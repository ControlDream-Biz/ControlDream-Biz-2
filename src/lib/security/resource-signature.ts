/**
 * 静态资源 URL 签名工具
 * 为静态资源 URL 添加签名和时效限制
 * 防止资源被直接扒取、缓存滥用
 */

import crypto from 'crypto';

export interface SignedURL {
  url: string;
  expires: number;
  signature: string;
}

export interface SignedURLResult {
  url: string;
  expires: number;
  signature: string;
  fullUrl: string;
}

// 默认配置
const DEFAULT_CONFIG = {
  secretKey: process.env.STATIC_RESOURCE_SECRET_KEY || 'default-secret-key-change-me',
  expiresIn: 3600, // 1小时
  algorithm: 'sha256' as const,
};

/**
 * 生成资源 URL 签名
 * @param resourcePath 资源路径（如 /images/logo.png）
 * @param expiresIn 过期时间（秒）
 * @param secretKey 密钥
 * @returns 签名后的 URL 信息
 */
export function signResourceURL(
  resourcePath: string,
  expiresIn: number = DEFAULT_CONFIG.expiresIn,
  secretKey: string = DEFAULT_CONFIG.secretKey
): SignedURLResult {
  const expires = Math.floor(Date.now() / 1000) + expiresIn;

  // 构建签名字符串：resourcePath|expires
  const signString = `${resourcePath}|${expires}`;

  // 生成签名
  const signature = crypto
    .createHmac(DEFAULT_CONFIG.algorithm, secretKey)
    .update(signString)
    .digest('hex');

  // 构建完整 URL
  const params = new URLSearchParams({
    expires: expires.toString(),
    signature,
  });

  const fullUrl = `${resourcePath}${resourcePath.includes('?') ? '&' : '?'}${params.toString()}`;

  return {
    url: resourcePath,
    expires,
    signature,
    fullUrl,
  };
}

/**
 * 验证资源 URL 签名
 * @param resourcePath 资源路径
 * @param expires 过期时间
 * @param signature 签名
 * @param secretKey 密钥
 * @returns 验证结果
 */
export function verifyResourceURL(
  resourcePath: string,
  expires: number,
  signature: string,
  secretKey: string = DEFAULT_CONFIG.secretKey
): { valid: boolean; reason?: string } {
  const now = Math.floor(Date.now() / 1000);

  // 检查是否过期
  if (now > expires) {
    return {
      valid: false,
      reason: 'URL has expired',
    };
  }

  // 重新生成签名
  const signString = `${resourcePath}|${expires}`;
  const expectedSignature = crypto
    .createHmac(DEFAULT_CONFIG.algorithm, secretKey)
    .update(signString)
    .digest('hex');

  // 验证签名
  if (signature !== expectedSignature) {
    return {
      valid: false,
      reason: 'Invalid signature',
    };
  }

  return { valid: true };
}

/**
 * 从 URL 中提取签名信息
 * @param url 完整 URL
 * @returns 签名信息
 */
export function extractSignedURLInfo(url: string): {
  resourcePath: string;
  expires?: number;
  signature?: string;
} | null {
  try {
    const urlObj = new URL(url, 'http://example.com');
    const expires = urlObj.searchParams.get('expires');
    const signature = urlObj.searchParams.get('signature');

    // 移除查询参数，得到原始资源路径
    urlObj.searchParams.delete('expires');
    urlObj.searchParams.delete('signature');
    const resourcePath = urlObj.pathname + (urlObj.search || '');

    return {
      resourcePath,
      expires: expires ? parseInt(expires, 10) : undefined,
      signature: signature || undefined,
    };
  } catch {
    return null;
  }
}

/**
 * 验证请求中的签名 URL
 * @param request Request 对象
 * @param secretKey 密钥
 * @returns 验证结果
 */
export function verifySignedRequestURL(
  request: Request,
  secretKey: string = DEFAULT_CONFIG.secretKey
): { valid: boolean; reason?: string; resourcePath?: string } {
  const url = request.url;
  const info = extractSignedURLInfo(url);

  if (!info) {
    return {
      valid: false,
      reason: 'Invalid URL format',
    };
  }

  if (!info.expires || !info.signature) {
    return {
      valid: false,
      reason: 'Missing signature parameters',
    };
  }

  const result = verifyResourceURL(
    info.resourcePath,
    info.expires,
    info.signature,
    secretKey
  );

  if (!result.valid) {
    return result;
  }

  return {
    valid: true,
    resourcePath: info.resourcePath,
  };
}

/**
 * 生成多个资源的签名 URL
 * @param resources 资源路径数组
 * @param expiresIn 过期时间（秒）
 * @param secretKey 密钥
 * @returns 签名后的 URL 数组
 */
export function signMultipleResourceURLs(
  resources: string[],
  expiresIn: number = DEFAULT_CONFIG.expiresIn,
  secretKey: string = DEFAULT_CONFIG.secretKey
): SignedURLResult[] {
  return resources.map(resource => signResourceURL(resource, expiresIn, secretKey));
}

/**
 * 批量验证签名 URL
 * @param urls URL 数组
 * @param secretKey 密钥
 * @returns 验证结果数组
 */
export function verifyMultipleResourceURLs(
  urls: string[],
  secretKey: string = DEFAULT_CONFIG.secretKey
): { valid: boolean; reason?: string; resourcePath?: string }[] {
  return urls.map(url => {
    const info = extractSignedURLInfo(url);
    if (!info || !info.expires || !info.signature) {
      return {
        valid: false,
        reason: 'Invalid URL format',
      };
    }

    const result = verifyResourceURL(
      info.resourcePath,
      info.expires,
      info.signature,
      secretKey
    );

    return {
      ...result,
      resourcePath: info.resourcePath,
    };
  });
}

/**
 * 生成带有签名的图片 URL
 * @param imagePath 图片路径
 * @param expiresIn 过期时间（秒）
 * @param secretKey 密钥
 * @returns 签名后的图片 URL
 */
export function signImageURL(
  imagePath: string,
  expiresIn: number = DEFAULT_CONFIG.expiresIn,
  secretKey: string = DEFAULT_CONFIG.secretKey
): string {
  const result = signResourceURL(imagePath, expiresIn, secretKey);
  return result.fullUrl;
}

/**
 * 验证图片 URL 签名
 * @param request Request 对象
 * @param secretKey 密钥
 * @returns 验证结果
 */
export function verifyImageURL(
  request: Request,
  secretKey: string = DEFAULT_CONFIG.secretKey
): { valid: boolean; reason?: string } {
  return verifySignedRequestURL(request, secretKey);
}

/**
 * 清理过期的签名（从缓存中）
 * @param cache 缓存 Map
 * @param currentTime 当前时间（秒）
 */
export function cleanupExpiredSignatures(
  cache: Map<string, number>,
  currentTime: number = Math.floor(Date.now() / 1000)
): void {
  for (const [key, expires] of cache.entries()) {
    if (currentTime > expires) {
      cache.delete(key);
    }
  }
}

/**
 * 签名缓存（用于已签名的 URL）
 */
const signatureCache = new Map<string, { expires: number; url: string }>();

/**
 * 获取或创建签名 URL（带缓存）
 * @param resourcePath 资源路径
 * @param expiresIn 过期时间（秒）
 * @param secretKey 密钥
 * @returns 签名后的 URL
 */
export function getOrSignResourceURL(
  resourcePath: string,
  expiresIn: number = DEFAULT_CONFIG.expiresIn,
  secretKey: string = DEFAULT_CONFIG.secretKey
): string {
  const now = Math.floor(Date.now() / 1000);

  // 检查缓存
  const cached = signatureCache.get(resourcePath);
  if (cached && cached.expires > now) {
    return cached.url;
  }

  // 生成新签名
  const result = signResourceURL(resourcePath, expiresIn, secretKey);

  // 更新缓存
  signatureCache.set(resourcePath, {
    expires: result.expires,
    url: result.fullUrl,
  });

  // 清理过期缓存
  cleanupExpiredSignatures(
    new Map(
      Array.from(signatureCache.entries()).map(([key, value]) => [key, value.expires])
    ),
    now
  );

  return result.fullUrl;
}

/**
 * 定期清理过期签名（每小时执行一次）
 */
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Math.floor(Date.now() / 1000);
    cleanupExpiredSignatures(
      new Map(
        Array.from(signatureCache.entries()).map(([key, value]) => [key, value.expires])
      ),
      now
    );
  }, 60 * 60 * 1000);
}
