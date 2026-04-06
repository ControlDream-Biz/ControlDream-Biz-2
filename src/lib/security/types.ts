/**
 * 安全系统类型定义
 */

// 安全事件类型
export type SecurityEventType =
  | 'AUTHENTICATION_FAILURE'
  | 'BRUTE_FORCE'
  | 'SQL_INJECTION'
  | 'XSS_ATTEMPT'
  | 'CSRF_ATTACK'
  | 'MALICIOUS_PATTERN'
  | 'MISSING_HEADERS'
  | 'RATE_LIMIT_EXCEEDED'
  | 'UNAUTHORIZED_ACCESS'
  | 'UNIVERSAL_PASSWORD'
  | 'PATH_TRAVERSAL'
  | 'COMMAND_INJECTION';

// 安全严重级别
export type SecuritySeverity = 'low' | 'medium' | 'high' | 'critical';

// 安全事件日志
export interface SecurityEventLog {
  type: SecurityEventType;
  severity: SecuritySeverity;
  ip: string;
  userAgent?: string;
  details?: Record<string, unknown>;
  timestamp?: number;
}

// 速率限制配置
export interface RateLimitConfig {
  limit: number;
  window: number; // 毫秒
}

// 验证结果
export interface ValidationResult<T = unknown> {
  valid: boolean;
  errors: string[];
  warnings?: string[];
  sanitized?: T;
}

// IP 威胁等级
export interface IPThreatLevel {
  level: SecuritySeverity;
  score: number;
  reasons: string[];
}

// 用户输入清理结果
export interface SanitizeResult {
  valid: boolean;
  sanitized?: string | Record<string, string>;
  error?: string;
}

// Terser 插件配置
export interface TerserPluginOptions {
  constructor: { name: string };
  options: {
    terserOptions: {
      compress?: {
        drop_console?: boolean;
        drop_debugger?: boolean;
      };
    };
  };
}
