/**
 * 二次签名校验工具
 * 防止 API 滥用、重放攻击、中间人攻击
 *
 * 使用场景：
 * - 核心 API 接口（如 /api/chat、/api/analytics）
 * - 敏感操作（如管理员操作）
 * - 需要额外安全保护的接口
 */

import crypto from 'crypto';

// 签名配置
export interface SignatureConfig {
  secretKey: string; // 密钥
  algorithm: 'sha256' | 'sha512'; // 算法
  timestampWindow: number; // 时间戳有效期（秒）
  nonceWindow: number; // Nonce 有效期（秒）
}

// 签名请求
export interface SignedRequest {
  timestamp: number; // 时间戳（秒）
  nonce: string; // 随机字符串
  signature: string; // 签名
}

// 签名验证结果
export interface SignatureVerificationResult {
  valid: boolean;
  reason?: string;
}

// 默认配置（生产环境应从环境变量读取）
const DEFAULT_CONFIG: SignatureConfig = {
  secretKey: process.env.API_SECRET_KEY || 'your-secret-key-change-in-production',
  algorithm: 'sha256',
  timestampWindow: 300, // 5分钟
  nonceWindow: 300, // 5分钟
};

// Nonce 存储（防重放攻击）
const nonceCache = new Map<string, number>();

// 定期清理过期 Nonce（每分钟）
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Math.floor(Date.now() / 1000);
    for (const [nonce, timestamp] of nonceCache.entries()) {
      if (now - timestamp > DEFAULT_CONFIG.nonceWindow) {
        nonceCache.delete(nonce);
      }
    }
  }, 60 * 1000);
}

/**
 * 生成签名（客户端使用）
 * @param data 要签名的数据（对象或字符串）
 * @param secretKey 密钥
 * @param timestamp 时间戳（秒）
 * @param nonce 随机字符串
 * @returns 签名
 */
export function generateSignature(
  data: Record<string, unknown> | string,
  secretKey: string = DEFAULT_CONFIG.secretKey,
  timestamp?: number,
  nonce?: string
): string {
  // 如果未提供时间戳，使用当前时间
  const ts = timestamp || Math.floor(Date.now() / 1000);

  // 如果未提供 nonce，生成随机字符串
  const nc = nonce || generateNonce();

  // 构建签名字符串
  let content = '';

  if (typeof data === 'string') {
    content = data;
  } else {
    // 对对象按 key 排序后拼接
    const sortedKeys = Object.keys(data).sort();
    const sortedData = sortedKeys.map(key => `${key}=${data[key]}`).join('&');
    content = sortedData;
  }

  // 拼接时间戳、nonce、数据
  const signString = `${ts}|${nc}|${content}`;

  // 生成签名
  const hmac = crypto.createHmac(DEFAULT_CONFIG.algorithm, secretKey);
  hmac.update(signString);
  return hmac.digest('hex');
}

/**
 * 生成完整的签名请求对象（客户端使用）
 * @param data 要签名的数据
 * @param secretKey 密钥
 * @returns 签名请求对象
 */
export function generateSignedRequest(
  data: Record<string, unknown> | string,
  secretKey: string = DEFAULT_CONFIG.secretKey
): SignedRequest & { data: string } {
  const timestamp = Math.floor(Date.now() / 1000);
  const nonce = generateNonce();
  const signature = generateSignature(data, secretKey, timestamp, nonce);

  return {
    timestamp,
    nonce,
    signature,
    data: typeof data === 'string' ? data : JSON.stringify(data),
  };
}

/**
 * 验证签名（服务端使用）
 * @param signedRequest 签名请求对象
 * @param config 签名配置
 * @returns 验证结果
 */
export function verifySignature(
  signedRequest: SignedRequest,
  data: Record<string, unknown> | string,
  config: SignatureConfig = DEFAULT_CONFIG
): SignatureVerificationResult {
  const { timestamp, nonce, signature } = signedRequest;
  const now = Math.floor(Date.now() / 1000);

  // 1. 验证时间戳是否在有效期内
  if (Math.abs(now - timestamp) > config.timestampWindow) {
    return {
      valid: false,
      reason: 'Timestamp expired or invalid',
    };
  }

  // 2. 验证 Nonce 是否重复（防重放攻击）
  if (nonceCache.has(nonce)) {
    return {
      valid: false,
      reason: 'Nonce already used (replay attack detected)',
    };
  }

  // 3. 生成期望的签名
  const expectedSignature = generateSignature(data, config.secretKey, timestamp, nonce);

  // 4. 验证签名是否匹配
  if (signature !== expectedSignature) {
    return {
      valid: false,
      reason: 'Invalid signature',
    };
  }

  // 5. 保存 Nonce（防重放）
  nonceCache.set(nonce, timestamp);

  return { valid: true };
}

/**
 * 验证请求签名（从 HTTP 请求中提取）
 * @param request HTTP 请求
 * @param config 签名配置
 * @returns 验证结果
 */
export async function verifyRequestSignature(
  request: Request,
  config: SignatureConfig = DEFAULT_CONFIG
): Promise<SignatureVerificationResult> {
  try {
    // 从 Header 中提取签名信息
    const timestamp = request.headers.get('X-Timestamp');
    const nonce = request.headers.get('X-Nonce');
    const signature = request.headers.get('X-Signature');

    if (!timestamp || !nonce || !signature) {
      return {
        valid: false,
        reason: 'Missing signature headers (X-Timestamp, X-Nonce, X-Signature)',
      };
    }

    // 获取请求体
    const bodyPromise = request.headers.get('content-type')?.includes('application/json')
      ? request.clone().json()
      : Promise.resolve('');

    const body = await bodyPromise;

    return verifySignature(
      {
        timestamp: parseInt(timestamp, 10),
        nonce,
        signature,
      },
      body || request.url as string | Record<string, unknown>,
      config
    );
  } catch (error) {
    return {
      valid: false,
      reason: 'Failed to verify signature',
    };
  }
}

/**
 * 生成随机 Nonce
 * @returns 随机字符串
 */
function generateNonce(): string {
  return crypto.randomBytes(16).toString('hex');
}

/**
 * 为请求添加签名（客户端使用）
 * @param request 原始请求
 * @param secretKey 密钥
 * @returns 签名后的请求
 */
export function signRequest(
  request: RequestInit & { url?: string },
  secretKey: string = DEFAULT_CONFIG.secretKey
): RequestInit {
  const timestamp = Math.floor(Date.now() / 1000);
  const nonce = generateNonce();

  // 获取请求体
  let body = '';
  if (request.body) {
    body = typeof request.body === 'string' ? request.body : JSON.stringify(request.body);
  }

  // 生成签名
  const signature = generateSignature(body || request.url || '', secretKey, timestamp, nonce);

  // 添加签名头
  return {
    ...request,
    headers: {
      ...request.headers,
      'X-Timestamp': timestamp.toString(),
      'X-Nonce': nonce,
      'X-Signature': signature,
    },
  };
}

/**
 * 中间件：验证签名（Next.js API Route 使用）
 * @param request HTTP 请求
 * @param config 签名配置
 * @returns 验证结果
 */
export async function signatureMiddleware(
  request: Request,
  config: SignatureConfig = DEFAULT_CONFIG
): Promise<{ valid: boolean; response?: Response }> {
  const result = await verifyRequestSignature(request, config);

  if (!result.valid) {
    return {
      valid: false,
      response: new Response(
        JSON.stringify({
          error: 'Invalid signature',
          reason: result.reason,
        }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        }
      ),
    };
  }

  return { valid: true };
}

/**
 * 客户端签名工具（浏览器环境使用）
 */
export class ClientSignature {
  private secretKey: string;

  constructor(secretKey: string = DEFAULT_CONFIG.secretKey) {
    this.secretKey = secretKey;
  }

  /**
   * 为 Fetch 请求添加签名
   * @param url 请求 URL
   * @param options 请求选项
   * @returns 签名后的请求选项
   */
  signFetch(url: string, options: RequestInit = {}): RequestInit {
    const timestamp = Math.floor(Date.now() / 1000);
    const nonce = generateNonce();

    let body = '';
    if (options.body) {
      body = typeof options.body === 'string' ? options.body : JSON.stringify(options.body);
    }

    const signature = generateSignature(body || url, this.secretKey, timestamp, nonce);

    return {
      ...options,
      headers: {
        ...options.headers,
        'X-Timestamp': timestamp.toString(),
        'X-Nonce': nonce,
        'X-Signature': signature,
      },
    };
  }

  /**
   * 发送带签名的请求
   * @param url 请求 URL
   * @param options 请求选项
   * @returns Fetch 响应
   */
  async fetch(url: string, options: RequestInit = {}): Promise<Response> {
    const signedOptions = this.signFetch(url, options);
    return fetch(url, signedOptions);
  }
}

/**
 * 获取签名统计信息
 * @returns 统计信息
 */
export function getSignatureStats() {
  return {
    nonceCacheSize: nonceCache.size,
    algorithm: DEFAULT_CONFIG.algorithm,
    timestampWindow: DEFAULT_CONFIG.timestampWindow,
    nonceWindow: DEFAULT_CONFIG.nonceWindow,
  };
}
