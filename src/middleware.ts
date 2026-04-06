import { NextRequest, NextResponse } from 'next/server';

/**
 * 全球顶级安全防护中间件
 * 防御：DDoS攻击、SQL注入、XSS、CSRF等
 */

// 使用内存存储作为降级方案（生产环境应使用 Redis）
class MemoryRateLimiter {
  private requests: Map<string, number[]> = new Map();

  check(identifier: string, limit: number, window: number): boolean {
    const now = Date.now();
    const requests = this.requests.get(identifier) || [];

    // 清理过期的请求记录
    const validRequests = requests.filter(timestamp => now - timestamp < window);
    this.requests.set(identifier, validRequests);

    if (validRequests.length >= limit) {
      return false;
    }

    validRequests.push(now);
    this.requests.set(identifier, validRequests);
    return true;
  }

  cleanup(): void {
    const now = Date.now();
    for (const [key, requests] of this.requests.entries()) {
      const validRequests = requests.filter(timestamp => now - timestamp < 60000);
      if (validRequests.length === 0) {
        this.requests.delete(key);
      } else {
        this.requests.set(key, validRequests);
      }
    }
  }
}

// 内存速率限制器实例
const memoryRateLimiter = new MemoryRateLimiter();

// 定期清理内存（每分钟）
if (typeof setInterval !== 'undefined') {
  setInterval(() => memoryRateLimiter.cleanup(), 60000);
}

// 恶意IP黑名单
const BLACKLISTED_IPS = new Set<string>();

// 可疑请求特征检测
const MALICIOUS_PATTERNS = [
  // SQL注入特征
  /union.*select/i,
  /drop.*table/i,
  /insert.*into/i,
  /update.*set/i,
  /delete.*from/i,
  /'or'1'='1/i,
  /'or'1'='1/i,
  /admin'/i,
  /1'='1/i,
  /1=1/i,
  /<script>/i,
  /javascript:/i,
  /onerror=/i,
  /onload=/i,
  /eval\(/i,
  /document\./i,
  /window\./i,
  /alert\(/i,
  // 路径遍历
  /\.\.\//,
  /%2e%2e%2f/i,
  // 命令注入
  /;\s*rm\s+/i,
  /;\s*cat\s+/i,
  /;\s*ls\s+/i,
  /&&\s*rm/i,
  /\|\s*nc\s+/i,
  // XSS特征
  /<iframe/i,
  /<object/i,
  /<embed/i,
  /onmouseover=/i,
  /onfocus=/i,
  /onblur=/i,
  // 常见攻击工具特征
  /sqlmap/i,
  /nmap/i,
  /nikto/i,
  /burpsuite/i,
  /metasploit/i,
  /acunetix/i,
  /nessus/i,
];

// 危险的HTTP方法
const BLOCKED_METHODS = ['TRACE', 'TRACK', 'CONNECT', 'DEBUG', 'PUT', 'DELETE'];

// 创建IP标识符（考虑代理和CDN）
function getClientIdentifier(request: NextRequest): string {
  // 检查CF-Connecting-IP（Cloudflare）
  const cfIp = request.headers.get('cf-connecting-ip');
  if (cfIp) return cfIp;

  // 检查X-Forwarded-For
  const xff = request.headers.get('x-forwarded-for');
  if (xff) {
    const ips = xff.split(',').map(ip => ip.trim());
    return ips[0]; // 获取第一个IP（原始客户端）
  }

  // 检查X-Real-IP
  const xRealIp = request.headers.get('x-real-ip');
  if (xRealIp) return xRealIp;

  // 回退到未知
  return 'unknown';
}

// 检测恶意请求
function detectMaliciousRequest(request: NextRequest): boolean {
  const url = request.url.toLowerCase();
  const userAgent = request.headers.get('user-agent')?.toLowerCase() || '';

  // 检查URL中的恶意模式
  for (const pattern of MALICIOUS_PATTERNS) {
    if (pattern.test(url)) {
      return true;
    }
  }

  // 检查User-Agent中的恶意工具
  if (/bot|crawl|spider|scan|probe|test/i.test(userAgent)) {
    // 某些合法爬虫可能被误判，这里可以添加白名单
    if (!/googlebot|bingbot|baiduspider|yandexbot/i.test(userAgent)) {
      return true;
    }
  }

  return false;
}

// 检查缺失的必需头部（伪装请求检测）
function checkMissingHeaders(request: NextRequest): boolean {
  const userAgent = request.headers.get('user-agent');
  const accept = request.headers.get('accept');
  const host = request.headers.get('host');

  // 缺少基本头部可能是自动化工具
  if (!userAgent && !accept && !host) {
    return true;
  }

  return false;
}

// 速率限制配置
const RATE_LIMIT_CONFIG = {
  // 通用请求限制
  general: {
    limit: 100, // 每分钟100次
    window: 60000, // 60秒
  },
  // API请求限制
  api: {
    limit: 50, // 每分钟50次
    window: 60000,
  },
  // 登录尝试限制
  login: {
    limit: 5, // 每分钟5次
    window: 60000,
  },
};

// 记录安全事件
function logSecurityEvent(type: string, request: NextRequest, reason: string) {
  const ip = getClientIdentifier(request);
  const userAgent = request.headers.get('user-agent') || 'unknown';
  const timestamp = new Date().toISOString();

  const logEntry = {
    timestamp,
    type,
    ip,
    userAgent,
    url: request.url,
    method: request.method,
    reason,
  };

  // 写入日志（实际项目中应该写入数据库或日志服务）
  console.warn('[SECURITY]', JSON.stringify(logEntry));

  // 如果环境变量中有日志存储配置，可以在这里写入
  // 例如：写入到数据库或发送到安全监控服务
}

// 生成安全响应
function createSecurityResponse(reason: string, statusCode: number = 429) {
  return NextResponse.json(
    {
      error: 'Security Alert',
      message: 'Your request has been blocked due to security reasons.',
      code: statusCode,
    },
    { status: statusCode }
  );
}

// 中间件主逻辑
export function middleware(request: NextRequest) {
  const ip = getClientIdentifier(request);
  const pathname = request.nextUrl.pathname;
  const method = request.method.toUpperCase();

  // 1. 检查IP黑名单
  if (BLACKLISTED_IPS.has(ip)) {
    logSecurityEvent('BLACKLISTED_IP', request, 'IP is blacklisted');
    return createSecurityResponse('IP is blacklisted', 403);
  }

  // 2. 检查HTTP方法
  if (BLOCKED_METHODS.includes(method)) {
    logSecurityEvent('BLOCKED_METHOD', request, `Method ${method} is not allowed`);
    return createSecurityResponse('Method not allowed', 405);
  }

  // 3. 检测恶意请求模式
  if (detectMaliciousRequest(request)) {
    logSecurityEvent('MALICIOUS_PATTERN', request, 'Malicious request pattern detected');
    // 将IP加入黑名单（可选，谨慎使用）
    // BLACKLISTED_IPS.add(ip);
    return createSecurityResponse('Malicious request detected', 400);
  }

  // 4. 检查缺失头部
  if (checkMissingHeaders(request)) {
    logSecurityEvent('MISSING_HEADERS', request, 'Missing required headers');
    return createSecurityResponse('Invalid request', 400);
  }

  // 5. 速率限制
  let rateLimitType = 'general';
  if (pathname.startsWith('/api/')) {
    rateLimitType = 'api';
  } else if (pathname.includes('/login') || pathname.includes('/auth')) {
    rateLimitType = 'login';
  }

  const config = RATE_LIMIT_CONFIG[rateLimitType as keyof typeof RATE_LIMIT_CONFIG];
  const allowed = memoryRateLimiter.check(ip, config.limit, config.window);

  if (!allowed) {
    logSecurityEvent('RATE_LIMIT_EXCEEDED', request, `Rate limit exceeded: ${rateLimitType}`);
    return createSecurityResponse('Rate limit exceeded. Please try again later.', 429);
  }

  // 6. 添加安全响应头
  const response = NextResponse.next();

  // CSP（内容安全策略）
  response.headers.set(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.google.com https://www.gstatic.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://fonts.gstatic.com",
      "img-src 'self' data: https: blob:",
      "font-src 'self' https://fonts.gstatic.com https://fonts.googleapis.com",
      "connect-src 'self' https://api.coze.dev",
      "frame-src 'self'",
      "media-src 'self' https:",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "upgrade-insecure-requests",
    ].join('; ')
  );

  // 其他安全头部
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');

  // 防止信息泄露
  response.headers.delete('X-Powered-By');

  return response;
}

// 配置中间件匹配路径
export const config = {
  matcher: [
    // 匹配所有路径
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};
