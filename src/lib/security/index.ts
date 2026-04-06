/**
 * 全球顶级安全防护系统
 * 统一导出所有安全工具
 */

// 类型定义 - 从 security-logger 导入，因为它定义了 enum
export { SecurityEventType, SecuritySeverity } from './security-logger';

// 其他类型
export type {
  SecurityEventLog,
  RateLimitConfig,
  ValidationResult,
  IPThreatLevel,
} from './types';

// 导入类型供内部使用
import type {
  ValidationResult,
  SecurityEventLog,
} from './types';

// 从 security-logger 导入类型供内部使用
import { SecurityEventType, SecuritySeverity } from './security-logger';

// 输入验证和清理
export * from './input-validator';

// SQL注入防护
export * from './sql-injection-defense';

// 登录安全防护
export * from './login-defense';

// CSRF和XSS防护
export * from './csrf-xss-defense';

// 安全日志和监控
export * from './security-logger';

// 高级威胁防御
export * from './advanced-threat-defense';

// 重新导出常用工具的简化版本
import {
  checkInputSecurity,
  sanitizeXSS,
  strictSanitize,
  isValidEmail,
  isValidPhone,
  checkPasswordStrength,
} from './input-validator';

import {
  buildSafeQuery,
  validateSQLIdentifier,
  sanitizeUserInput,
  detectSQLInjectionAttempt,
} from './sql-injection-defense';

import {
  validateLoginCredentials,
  detectUniversalPassword,
  isLockedOut,
  recordFailedAttempt,
  generateSessionToken,
  detectSessionHijacking,
} from './login-defense';

import {
  generateCSRFToken,
  validateCSRFToken,
  sanitizeHTML,
  escapeHTML,
  generateCSPNonce,
  getSecureCookieOptions,
} from './csrf-xss-defense';

import {
  logSecurityEvent,
  getSecurityStats,
  getSecurityAlerts,
  generateSecurityReport,
  getIPThreatScore,
} from './security-logger';

import {
  detectZeroDayExploit,
  detectSocialEngineeringAttack,
  detectAPIAbuse,
  detectBot,
  detectMaliciousFile,
  detectHTTPSmuggling,
  detectGraphQLInjection,
  detectNoSQLInjection,
  detectSSRF,
  detectPrototypePollution,
} from './advanced-threat-defense';

// 统一的安全配置
export const SECURITY_CONFIG = {
  // 密码要求
  PASSWORD: {
    MIN_LENGTH: 8,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBER: true,
    REQUIRE_SPECIAL: true,
    MAX_LENGTH: 128,
  },

  // 速率限制
  RATE_LIMIT: {
    GENERAL: {
      limit: 100,
      window: 60000, // 1分钟
    },
    API: {
      limit: 50,
      window: 60000,
    },
    LOGIN: {
      limit: 5,
      window: 60000,
    },
  },

  // 会话配置
  SESSION: {
    TIMEOUT: 30 * 60 * 1000, // 30分钟
    MAX_AGE: 24 * 60 * 60 * 1000, // 24小时
  },

  // IP黑名单
  BLACKLISTED_IPS: [] as string[], // 可以添加需要黑名单的IP

  // 允许的来源
  ALLOWED_ORIGINS: [
    'https://localhost:3000',
    process.env.NEXT_PUBLIC_DOMAIN || '',
  ].filter(Boolean),

  // Cookie安全
  COOKIE: {
    HTTPONLY: true,
    SECURE: true,
    SAMESITE: 'strict' as const,
  },
};

/**
 * 快速安全检查函数
 */
export function quickSecurityCheck(input: string): {
  safe: boolean;
  threats: string[];
  cleaned: string;
} {
  const result = checkInputSecurity(input);
  return {
    safe: result.isSafe,
    threats: result.threats,
    cleaned: result.sanitized,
  };
}

/**
 * 综合安全验证套件
 */
export class SecurityValidator {
  /**
   * 验证用户输入
   */
  static validateInput(input: string): {
    valid: boolean;
    errors: string[];
    sanitized: string;
  } {
    const errors: string[] = [];
    let sanitized = input;

    // XSS检查
    const xssCheck = checkInputSecurity(input);
    if (!xssCheck.isSafe && xssCheck.threats.includes('XSS Attack')) {
      errors.push('输入包含潜在的XSS攻击代码');
    }

    // SQL注入检查
    if (!xssCheck.isSafe && xssCheck.threats.includes('SQL Injection')) {
      errors.push('输入包含潜在的SQL注入代码');
    }

    // 清理输入
    sanitized = xssCheck.sanitized;

    return {
      valid: errors.length === 0,
      errors,
      sanitized,
    };
  }

  /**
   * 验证登录请求
   */
  static validateLoginRequest(
    username: string,
    password: string,
    ip: string
  ): {
    valid: boolean;
    errors: string[];
    warnings: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];

    // 验证凭据
    const credentialCheck = validateLoginCredentials(username, password);
    if (!credentialCheck.valid) {
      errors.push(...credentialCheck.errors);
    }

    // 检查万能密码
    const universalCheck = detectUniversalPassword(password);
    if (universalCheck.isUniversal) {
      errors.push('检测到万能密码或SQL注入尝试');
      logSecurityEvent({
        type: SecurityEventType.UNIVERSAL_PASSWORD,
        severity: SecuritySeverity.CRITICAL,
        ip,
        userAgent: '',
        details: { username, patterns: universalCheck.patterns },
      });
    }

    // 检查IP威胁等级
    const threatLevel = getIPThreatScore(ip);
    if (threatLevel.level === 'critical') {
      warnings.push(`IP ${ip} 威胁等级为Critical`);
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * 验证API请求
   */
  static validateAPIRequest(
    params: Record<string, string>,
    allowedColumns: string[],
    ip: string
  ): ValidationResult<Record<string, string>> {
    const errors: string[] = [];

    // 清理参数
    const sanitized = sanitizeUserInput(params);
    if (!sanitized.valid) {
      errors.push(sanitized.error || '参数清理失败');
      return { valid: false, errors };
    }

    // 检测SQL注入
    for (const [key, value] of Object.entries(sanitized.sanitized || {})) {
      if (typeof value === 'string') {
        const attempt = detectSQLInjectionAttempt(value);
        if (attempt.isAttempt) {
          errors.push(`参数 ${key} 包含SQL注入代码`);
          logSecurityEvent({
            type: SecurityEventType.SQL_INJECTION,
            severity: attempt.severity as SecuritySeverity,
            ip,
            userAgent: '',
            details: { key, patterns: attempt.patterns },
          });
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      sanitized: sanitized.sanitized,
    };
  }
}

/**
 * 快速生成安全令牌
 */
export function generateSecureTokens(): {
  csrfToken: string;
  cspNonce: string;
  sessionToken: string;
} {
  return {
    csrfToken: generateCSRFToken(),
    cspNonce: generateCSPNonce(),
    sessionToken: generateSessionToken(),
  };
}

/**
 * 获取安全头部
 */
export function getSecurityHeaders(): Record<string, string> {
  return {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  };
}

// 默认导出
export default {
  // 输入验证
  checkInputSecurity,
  sanitizeXSS,
  strictSanitize,
  isValidEmail,
  isValidPhone,
  checkPasswordStrength,

  // SQL防御
  buildSafeQuery,
  validateSQLIdentifier,
  sanitizeUserInput,

  // 登录防御
  validateLoginCredentials,
  detectUniversalPassword,
  isLockedOut,
  generateSessionToken,

  // CSRF/XSS防御
  generateCSRFToken,
  validateCSRFToken,
  sanitizeHTML,
  escapeHTML,
  generateCSPNonce,

  // 日志和监控
  logSecurityEvent,
  getSecurityStats,
  getSecurityAlerts,
  generateSecurityReport,
  getIPThreatScore,

  // 高级威胁防御
  detectZeroDayExploit,
  detectSocialEngineeringAttack,
  detectAPIAbuse,
  detectBot,
  detectMaliciousFile,
  detectHTTPSmuggling,
  detectGraphQLInjection,
  detectNoSQLInjection,
  detectSSRF,
  detectPrototypePollution,

  // 配置
  SECURITY_CONFIG,
  SecurityValidator,
  generateSecureTokens,
  getSecurityHeaders,
  quickSecurityCheck,
};
