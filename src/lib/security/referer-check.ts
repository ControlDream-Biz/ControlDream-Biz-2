/**
 * Referer/Origin 双重校验工具
 * 验证请求来源是否合法
 * 防止 CSRF 攻击、接口滥用、直接访问静态资源
 */

import { NextRequest, NextResponse } from 'next/server';

export interface RefererCheckResult {
  valid: boolean;
  reason?: string;
  referer?: string;
  origin?: string;
}

// 默认白名单域名（从环境变量读取）
const DEFAULT_ALLOWED_DOMAINS = (
  process.env.NEXT_PUBLIC_AUTHORIZED_DOMAIN || ''
).split(',').filter(Boolean);

/**
 * 提取域名（从 URL）
 */
function extractDomain(url: string): string | null {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch {
    return null;
  }
}

/**
 * 提取完整域名（包括子域名）
 */
function extractFullDomain(url: string): string | null {
  try {
    const urlObj = new URL(url);
    return urlObj.origin;
  } catch {
    return null;
  }
}

/**
 * 检查域名是否在白名单中
 */
function isDomainAllowed(domain: string | null, allowedDomains: string[]): boolean {
  if (!domain) return false;

  // 移除端口
  const cleanDomain = domain.split(':')[0];

  // 检查是否在白名单中
  for (const allowedDomain of allowedDomains) {
    const cleanAllowed = allowedDomain.trim().split(':')[0];

    // 完全匹配
    if (cleanDomain === cleanAllowed) {
      return true;
    }

    // 通配符匹配 (*.example.com)
    if (cleanAllowed.startsWith('*.')) {
      const baseDomain = cleanAllowed.substring(2);
      if (cleanDomain.endsWith(baseDomain)) {
        return true;
      }
    }
  }

  // 开发环境允许 localhost
  if (
    process.env.NODE_ENV === 'development' &&
    ['localhost', '127.0.0.1', 'dev.coze.site'].includes(cleanDomain)
  ) {
    return true;
  }

  return false;
}

/**
 * 验证 Referer 头
 */
export function verifyReferer(
  request: NextRequest,
  allowedDomains: string[] = DEFAULT_ALLOWED_DOMAINS
): RefererCheckResult {
  const referer = request.headers.get('referer');

  if (!referer) {
    return {
      valid: false,
      reason: 'Referer header is missing',
    };
  }

  const domain = extractDomain(referer);
  if (!domain) {
    return {
      valid: false,
      reason: 'Invalid Referer URL',
      referer,
    };
  }

  if (!isDomainAllowed(domain, allowedDomains)) {
    return {
      valid: false,
      reason: `Referer domain "${domain}" is not in the allowed list`,
      referer,
    };
  }

  return {
    valid: true,
    referer,
  };
}

/**
 * 验证 Origin 头
 */
export function verifyOrigin(
  request: NextRequest,
  allowedDomains: string[] = DEFAULT_ALLOWED_DOMAINS
): RefererCheckResult {
  const origin = request.headers.get('origin');

  if (!origin) {
    // Origin 头可能不存在（非跨域请求）
    // 这种情况下，依赖 Referer 验证
    return {
      valid: true,
      reason: 'Origin header is optional for same-origin requests',
    };
  }

  const domain = extractDomain(origin);
  if (!domain) {
    return {
      valid: false,
      reason: 'Invalid Origin URL',
      origin,
    };
  }

  if (!isDomainAllowed(domain, allowedDomains)) {
    return {
      valid: false,
      reason: `Origin domain "${domain}" is not in the allowed list`,
      origin,
    };
  }

  return {
    valid: true,
    origin,
  };
}

/**
 * 双重验证（Referer + Origin）
 */
export function verifyRefererAndOrigin(
  request: NextRequest,
  allowedDomains: string[] = DEFAULT_ALLOWED_DOMAINS,
  strictMode: boolean = false
): RefererCheckResult {
  const refererResult = verifyReferer(request, allowedDomains);
  const originResult = verifyOrigin(request, allowedDomains);

  // 严格模式：两个都必须验证通过
  if (strictMode) {
    if (!refererResult.valid) {
      return refererResult;
    }

    if (!originResult.valid) {
      return originResult;
    }

    return {
      valid: true,
      referer: refererResult.referer,
      origin: originResult.origin,
    };
  }

  // 非严格模式：至少一个验证通过
  if (refererResult.valid || originResult.valid) {
    return {
      valid: true,
      referer: refererResult.referer,
      origin: originResult.origin,
    };
  }

  // 两个都失败，返回更详细的错误信息
  return {
    valid: false,
    reason: `Both Referer and Origin verification failed. Referer: ${refererResult.reason}, Origin: ${originResult.reason}`,
    referer: refererResult.referer,
    origin: originResult.origin,
  };
}

/**
 * 中间件：验证请求来源
 * 在 API Route 中使用
 */
export function refererMiddleware(
  request: NextRequest,
  allowedDomains: string[] = DEFAULT_ALLOWED_DOMAINS,
  strictMode: boolean = false
): { valid: boolean; response?: NextResponse } {
  const result = verifyRefererAndOrigin(request, allowedDomains, strictMode);

  if (!result.valid) {
    return {
      valid: false,
      response: NextResponse.json(
        {
          error: 'Forbidden',
          message: 'Invalid request origin',
          reason: result.reason,
        },
        { status: 403 }
      ),
    };
  }

  return { valid: true };
}

/**
 * 验证静态资源请求（仅 Referer）
 * 防止直接访问静态资源
 */
export function verifyStaticResourceRequest(
  request: NextRequest,
  allowedDomains: string[] = DEFAULT_ALLOWED_DOMAINS
): { valid: boolean; response?: NextResponse } {
  const referer = request.headers.get('referer');

  // 如果没有 Referer，可能是直接访问（不允许）
  if (!referer) {
    return {
      valid: false,
      response: NextResponse.json(
        {
          error: 'Forbidden',
          message: 'Direct access to static resources is not allowed',
        },
        { status: 403 }
      ),
    };
  }

  const result = verifyReferer(request, allowedDomains);
  if (!result.valid) {
    return {
      valid: false,
      response: NextResponse.json(
        {
          error: 'Forbidden',
          message: 'Invalid referer for static resource',
          reason: result.reason,
        },
        { status: 403 }
      ),
    };
  }

  return { valid: true };
}

/**
 * 生成 CORS 响应头
 */
export function generateCORSHeaders(
  request: NextRequest,
  allowedDomains: string[] = DEFAULT_ALLOWED_DOMAINS
): Record<string, string> {
  const origin = request.headers.get('origin');

  // 如果 Origin 在白名单中，返回该 Origin
  // 否则返回默认域名
  let allowedOrigin = allowedDomains[0] || process.env.NEXT_PUBLIC_APP_URL || '*';

  if (origin && isDomainAllowed(extractDomain(origin), allowedDomains)) {
    const fullDomain = extractFullDomain(origin);
    if (fullDomain) {
      allowedOrigin = fullDomain;
    }
  }

  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Max-Age': '86400',
  };
}
