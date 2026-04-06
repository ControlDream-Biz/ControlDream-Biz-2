/**
 * CSRF和XSS防护工具
 * 提供跨站请求伪造和跨站脚本攻击防护
 */

import crypto from 'crypto';

/**
 * 生成CSRF令牌
 */
export function generateCSRFToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * 验证CSRF令牌
 */
export function validateCSRFToken(
  providedToken: string,
  storedToken: string
): {
  valid: boolean;
  error?: string;
} {
  if (!providedToken) {
    return { valid: false, error: 'CSRF令牌不能为空' };
  }

  if (!storedToken) {
    return { valid: false, error: '存储的CSRF令牌不存在' };
  }

  // 使用恒定时间比较，防止时序攻击
  const valid = crypto.timingSafeEqual(
    Buffer.from(providedToken, 'hex'),
    Buffer.from(storedToken, 'hex')
  );

  if (!valid) {
    return { valid: false, error: 'CSRF令牌无效' };
  }

  return { valid: true };
}

/**
 * 生成CSRF元标签HTML
 */
export function generateCSRFMetaTag(token: string): string {
  return `<meta name="csrf-token" content="${token}" />`;
}

/**
 * 生成CSRF隐藏输入字段
 */
export function generateCSRFInputField(token: string): string {
  return `<input type="hidden" name="csrf_token" value="${token}" />`;
}

/**
 * XSS防护：DOMPurify风格的HTML清理
 */
export function sanitizeHTML(input: string): string {
  if (!input || typeof input !== 'string') {
    return input;
  }

  // 基础HTML标签白名单
  const ALLOWED_TAGS = new Set([
    'p', 'br', 'strong', 'em', 'u', 'b', 'i', 'span',
    'a', 'img', 'ul', 'ol', 'li', 'blockquote', 'code', 'pre',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  ]);

  // 允许的属性
  const ALLOWED_ATTRS = new Set([
    'href', 'src', 'alt', 'title', 'target', 'rel', 'class', 'id',
  ]);

  // 危险的属性（绝对禁止）
  const DANGEROUS_ATTRS = new Set([
    'onload', 'onerror', 'onclick', 'onmouseover', 'onmouseout',
    'onfocus', 'onblur', 'onkeydown', 'onkeyup', 'onsubmit',
    'onchange', 'oninput', 'onreset', 'onselect', 'ondblclick',
    'javascript:', 'vbscript:', 'data:',
  ]);

  let result = input;

  // 移除危险的事件处理器和协议
  result = result.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '');
  result = result.replace(/javascript:/gi, '');
  result = result.replace(/vbscript:/gi, '');
  result = result.replace(/data:\s*text\/html/gi, '');

  // 移除script标签
  result = result.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gim, '');

  // 移除iframe标签
  result = result.replace(/<iframe\b[^>]*>([\s\S]*?)<\/iframe>/gim, '');

  // 移除object和embed标签
  result = result.replace(/<(object|embed|applet)\b[^>]*>([\s\S]*?)<\/\1>/gim, '');

  // 移除form标签
  result = result.replace(/<form\b[^>]*>([\s\S]*?)<\/form>/gim, '');

  // 移除input标签
  result = result.replace(/<input\b[^>]*>/gim, '');

  // 移除style和script属性
  result = result.replace(/\s*style\s*=\s*["'][^"']*["']/gi, '');
  result = result.replace(/\s*onclick\s*=\s*["'][^"']*["']/gi, '');

  // 清理a标签的href
  result = result.replace(
    /<a([^>]*)href\s*=\s*["']([^"']*)["']([^>]*)>/gi,
    (match, before, href, after) => {
      // 只允许http、https、mailto、tel协议
      if (
        /^https?:\/\//i.test(href) ||
        /^mailto:/i.test(href) ||
        /^tel:/i.test(href)
      ) {
        return `<a${before}href="${href}"${after}>`;
      }
      // 移除危险的href
      return `<a${before}${after}>`;
    }
  );

  // 清理img标签的src
  result = result.replace(
    /<img([^>]*)src\s*=\s*["']([^"']*)["']([^>]*)>/gi,
    (match, before, src, after) => {
      // 只允许http、https、data:image协议
      if (/^https?:\/\//i.test(src) || /^data:image\//i.test(src)) {
        return `<img${before}src="${src}"${after}>`;
      }
      // 移除危险的src
      return '';
    }
  );

  return result;
}

/**
 * 严格XSS防护：移除所有HTML标签
 */
export function stripAllHTML(input: string): string {
  if (!input || typeof input !== 'string') {
    return input;
  }

  return input.replace(/<[^>]*>/g, '');
}

/**
 * 转义HTML特殊字符
 */
export function escapeHTML(input: string): string {
  if (!input || typeof input !== 'string') {
    return input;
  }

  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/\//g, '&#x2F;');
}

/**
 * URL安全编码
 */
export function encodeURL(input: string): string {
  if (!input || typeof input !== 'string') {
    return input;
  }

  return encodeURIComponent(input).replace(/[!'()*]/g, c => {
    return '%' + c.charCodeAt(0).toString(16).toUpperCase();
  });
}

/**
 * URL安全解码
 */
export function decodeURL(input: string): string {
  if (!input || typeof input !== 'string') {
    return input;
  }

  try {
    return decodeURIComponent(input);
  } catch {
    return input;
  }
}

/**
 * Base64安全编码
 */
export function encodeBase64(input: string): string {
  if (!input || typeof input !== 'string') {
    return input;
  }

  return Buffer.from(input, 'utf8').toString('base64');
}

/**
 * Base64安全解码
 */
export function decodeBase64(input: string): string {
  if (!input || typeof input !== 'string') {
    return input;
  }

  try {
    return Buffer.from(input, 'base64').toString('utf8');
  } catch {
    return '';
  }
}

/**
 * 检测XSS攻击模式
 */
export function detectXSSPattern(input: string): {
  detected: boolean;
  severity: 'low' | 'medium' | 'high' | 'critical';
  patterns: string[];
} {
  if (!input || typeof input !== 'string') {
    return { detected: false, severity: 'low', patterns: [] };
  }

  const patterns: string[] = [];
  let severity: 'low' | 'medium' | 'high' | 'critical' = 'low';

  const patternsBySeverity = {
    critical: [
      /<script\b[^>]*>[\s\S]*?<\/script>/gi,
      /javascript:[^"']*/gi,
      /vbscript:[^"']*/gi,
      /data:text\/html[^"']*/gi,
      /fromCharCode\s*\(/gi,
    ],
    high: [
      /<iframe\b[^>]*>[\s\S]*?<\/iframe>/gi,
      /<object\b[^>]*>[\s\S]*?<\/object>/gi,
      /<embed\b[^>]*>/gi,
      /<form\b[^>]*>[\s\S]*?<\/form>/gi,
      /on\w+\s*=\s*["'][^"']*["']/gi,
      /eval\s*\(/gi,
    ],
    medium: [
      /<img\b[^>]*src\s*=\s*["'][^"']*["'][^>]*>/gi,
      /<a\b[^>]*href\s*=\s*["'][^"']*["'][^>]*>/gi,
      /<\w+[^>]*style\s*=\s*["'][^"']*["'][^>]*>/gi,
      /expression\s*\(/gi,
    ],
    low: [
      /<[^>]+>/g,
      /&lt;[^>]+&gt;/g,
      /&#\d+;/g,
      /&#x[0-9a-f]+;/gi,
    ],
  };

  const lowerInput = input.toLowerCase();

  for (const [level, patternList] of Object.entries(patternsBySeverity)) {
    for (const pattern of patternList) {
      if (pattern.test(lowerInput)) {
        patterns.push(pattern.source);
        if (level === 'critical' || (level === 'high' && severity !== 'critical')) {
          severity = level as 'low' | 'medium' | 'high' | 'critical';
        }
      }
    }
  }

  return {
    detected: patterns.length > 0,
    severity,
    patterns,
  };
}

/**
 * 内容安全策略（CSP）nonce生成
 */
export function generateCSPNonce(): string {
  return crypto.randomBytes(16).toString('base64');
}

/**
 * 验证CSP nonce
 */
export function validateCSPNonce(providedNonce: string, storedNonce: string): boolean {
  if (!providedNonce || !storedNonce) {
    return false;
  }

  // 使用恒定时间比较
  try {
    return crypto.timingSafeEqual(
      Buffer.from(providedNonce, 'base64'),
      Buffer.from(storedNonce, 'base64')
    );
  } catch {
    return false;
  }
}

/**
 * 设置安全的Cookie属性
 */
export function getSecureCookieOptions(): {
  httpOnly: boolean;
  secure: boolean;
  sameSite: 'strict' | 'lax' | 'none';
  path: string;
  maxAge: number;
} {
  return {
    httpOnly: true, // 防止XSS访问
    secure: true, // 仅HTTPS传输
    sameSite: 'strict', // 防止CSRF
    path: '/',
    maxAge: 24 * 60 * 60 * 1000, // 24小时
  };
}

/**
 * 验证来源（Referrer）是否可信
 */
export function validateOrigin(
  providedOrigin: string,
  allowedOrigins: string[]
): {
  valid: boolean;
  error?: string;
} {
  if (!providedOrigin) {
    return { valid: false, error: '来源不能为空' };
  }

  const origin = new URL(providedOrigin).origin;

  // 检查是否在允许的列表中
  if (!allowedOrigins.includes(origin)) {
    return {
      valid: false,
      error: `来源 "${origin}" 不在允许的列表中`,
    };
  }

  return { valid: true };
}

/**
 * 验证Referer头部
 */
export function validateReferer(
  referer: string,
  allowedReferers: string[]
): {
  valid: boolean;
  error?: string;
} {
  if (!referer) {
    return { valid: false, error: 'Referer不能为空' };
  }

  // 提取Referer的origin
  let origin: string;
  try {
    origin = new URL(referer).origin;
  } catch {
    return { valid: false, error: 'Referer格式无效' };
  }

  // 检查是否在允许的列表中
  if (!allowedReferers.includes(origin)) {
    return {
      valid: false,
      error: `Referer "${origin}" 不在允许的列表中`,
    };
  }

  return { valid: true };
}

/**
 * 安全的JSON解析
 */
export function safeJSONParse<T = unknown>(
  input: string,
  defaultValue: T
): T | null {
  try {
    // 检查JSON劫持攻击
    if (/^\s*[\[\{]/.test(input) && /\s*[\]\}]$/.test(input)) {
      return JSON.parse(input) as T;
    }
    return defaultValue;
  } catch {
    return defaultValue;
  }
}

/**
 * 安全的JSON字符串化
 */
export function safeJSONStringify(obj: unknown, space?: number): string {
  try {
    // 防止循环引用
    const seen = new WeakSet();

    return JSON.stringify(
      obj,
      (key, value) => {
        if (typeof value === 'object' && value !== null) {
          if (seen.has(value)) {
            return '[Circular]';
          }
          seen.add(value);
        }
        return value;
      },
      space
    );
  } catch {
    return '{}';
  }
}

// 导出所有工具
export const csrfXssDefense = {
  // CSRF
  generateToken: generateCSRFToken,
  validateToken: validateCSRFToken,
  generateMetaTag: generateCSRFMetaTag,
  generateInputField: generateCSRFInputField,

  // XSS
  sanitizeHTML,
  stripAllHTML,
  escapeHTML,
  encodeURL,
  decodeURL,
  encodeBase64,
  decodeBase64,
  detectXSSPattern,

  // CSP
  generateCSPNonce,
  validateCSPNonce,

  // Cookie安全
  getSecureCookieOptions,

  // Origin验证
  validateOrigin,
  validateReferer,

  // JSON安全
  safeJSONParse,
  safeJSONStringify,
};
