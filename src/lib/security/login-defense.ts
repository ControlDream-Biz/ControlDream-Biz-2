/**
 * 登录安全防护工具
 * 防御：万能密码、暴力破解、会话劫持等
 */

import { detectSQLInjection, checkPasswordStrength } from './input-validator';

// 万能密码黑名单
const UNIVERSAL_PASSWORD_PATTERNS = [
  // SQL注入万能密码
  /'(\s+)*(or|xor)\s+1\s*=\s*1/i,
  /'(\s+)*(or|xor)\s+1\s*=\s*'1/i,
  /'(\s+)*(or|xor)\s+'1'(\s+)*=\s*'1/i,
  /admin'(\s+)*(or|xor)(\s+)*'1'(\s+)*=(\s+)*'1/i,
  /"(\s+)*(or|xor)(\s+)*"1"(\s+)*=(\s+)*"1/i,
  /'(\s+)*or(\s+)*'(\s+)*=/i,
  /"(\s+)*or(\s+)*"(\s+)*=/i,
  /'(\s+)*=(\s+)*'/i,
  /"(\s+)*=(\s+)*"/i,
  // 常见万能密码
  /123456/i,
  /password/i,
  /admin/i,
  /root/i,
  /qwerty/i,
  /letmein/i,
  /welcome/i,
  /111111/i,
  /000000/i,
  /abc123/i,
  // 特殊字符组合
  /['"]\s*or\s*['"]/i,
  /['"]\s*=\s*['"]/i,
  /['"]\s*#\s*/,
  /['"]\s*--\s*/,
  /['"]\s*;\s*/,
];

// 暴力破解防护配置
interface BruteForceConfig {
  maxAttempts: number; // 最大尝试次数
  lockoutDuration: number; // 锁定时长（毫秒）
  progressiveDelay: boolean; // 是否启用渐进式延迟
  ipTracking: boolean; // 是否追踪IP
  userTracking: boolean; // 是否追踪用户名
}

const DEFAULT_BRUTE_FORCE_CONFIG: BruteForceConfig = {
  maxAttempts: 5,
  lockoutDuration: 15 * 60 * 1000, // 15分钟
  progressiveDelay: true,
  ipTracking: true,
  userTracking: true,
};

// 失败尝试记录
interface FailedAttempt {
  count: number;
  lastAttempt: number;
  lockedUntil?: number;
  ip: string;
  userAgent: string;
}

// 内存存储失败尝试（生产环境应使用Redis）
const failedAttempts = new Map<string, FailedAttempt>();

/**
 * 检测万能密码
 */
export function detectUniversalPassword(password: string): {
  isUniversal: boolean;
  reason?: string;
  patterns: string[];
} {
  const patterns: string[] = [];

  for (const pattern of UNIVERSAL_PASSWORD_PATTERNS) {
    if (pattern.test(password)) {
      patterns.push(pattern.source);
    }
  }

  if (patterns.length > 0) {
    return {
      isUniversal: true,
      reason: '检测到万能密码或SQL注入尝试',
      patterns,
    };
  }

  return {
    isUniversal: false,
    patterns,
  };
}

/**
 * 验证登录凭据
 */
export function validateLoginCredentials(
  username: string,
  password: string
): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // 检查用户名
  if (!username || username.trim().length === 0) {
    errors.push('用户名不能为空');
  } else if (username.length < 3) {
    errors.push('用户名长度至少3个字符');
  } else if (username.length > 50) {
    errors.push('用户名长度不能超过50个字符');
  } else if (/['";]/.test(username)) {
    errors.push('用户名包含非法字符');
  } else if (detectSQLInjection(username)) {
    errors.push('用户名包含可疑的SQL注入代码');
  }

  // 检查密码
  if (!password || password.trim().length === 0) {
    errors.push('密码不能为空');
  } else if (password.length < 6) {
    errors.push('密码长度至少6个字符');
  } else if (password.length > 128) {
    errors.push('密码长度不能超过128个字符');
  } else {
    // 检测万能密码
    const universalCheck = detectUniversalPassword(password);
    if (universalCheck.isUniversal) {
      errors.push(`密码安全检查失败: ${universalCheck.reason}`);
    }

    // 检查密码强度
    const strengthCheck = checkPasswordStrength(password);
    if (strengthCheck.strength === 'weak') {
      errors.push('密码强度太弱，建议使用更复杂的密码');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * 记录失败的登录尝试
 */
export function recordFailedAttempt(
  identifier: string,
  ip: string,
  userAgent: string,
  config: BruteForceConfig = DEFAULT_BRUTE_FORCE_CONFIG
): void {
  const now = Date.now();
  const existing = failedAttempts.get(identifier);

  if (existing) {
    existing.count += 1;
    existing.lastAttempt = now;

    // 检查是否达到最大尝试次数
    if (existing.count >= config.maxAttempts && !existing.lockedUntil) {
      existing.lockedUntil = now + config.lockoutDuration;
    }
  } else {
    failedAttempts.set(identifier, {
      count: 1,
      lastAttempt: now,
      ip,
      userAgent,
    });
  }

  // 记录安全事件
  logSecurityEvent('FAILED_LOGIN_ATTEMPT', {
    identifier,
    ip,
    userAgent,
    attemptCount: existing ? existing.count : 1,
  });
}

/**
 * 检查是否被锁定
 */
export function isLockedOut(
  identifier: string,
  config: BruteForceConfig = DEFAULT_BRUTE_FORCE_CONFIG
): {
  locked: boolean;
  reason?: string;
  remainingTime?: number;
} {
  const record = failedAttempts.get(identifier);

  if (!record) {
    return { locked: false };
  }

  const now = Date.now();

  // 检查是否在锁定期内
  if (record.lockedUntil && record.lockedUntil > now) {
    return {
      locked: true,
      reason: `账户已被锁定，请${Math.ceil((record.lockedUntil - now) / 60000)}分钟后再试`,
      remainingTime: record.lockedUntil - now,
    };
  }

  // 检查是否接近锁定
  if (record.count >= config.maxAttempts - 1) {
    return {
      locked: false,
      reason: `警告：还剩${config.maxAttempts - record.count}次尝试机会`,
    };
  }

  return { locked: false };
}

/**
 * 计算渐进式延迟时间
 */
export function calculateProgressiveDelay(
  failedAttempts: number,
  config: BruteForceConfig = DEFAULT_BRUTE_FORCE_CONFIG
): number {
  if (!config.progressiveDelay) {
    return 0;
  }

  // 延迟时间随失败次数指数增长
  const baseDelay = 1000; // 1秒
  const delay = baseDelay * Math.pow(2, failedAttempts - 1);

  // 最大延迟30秒
  return Math.min(delay, 30000);
}

/**
 * 清除成功的登录记录
 */
export function clearFailedAttempt(identifier: string): void {
  failedAttempts.delete(identifier);
  logSecurityEvent('SUCCESSFUL_LOGIN', { identifier });
}

/**
 * 获取剩余尝试次数
 */
export function getRemainingAttempts(
  identifier: string,
  config: BruteForceConfig = DEFAULT_BRUTE_FORCE_CONFIG
): number {
  const record = failedAttempts.get(identifier);
  if (!record) {
    return config.maxAttempts;
  }
  return Math.max(0, config.maxAttempts - record.count);
}

/**
 * 验证会话令牌
 */
export function validateSessionToken(token: string): {
  valid: boolean;
  error?: string;
} {
  if (!token) {
    return { valid: false, error: '会话令牌不能为空' };
  }

  // 检查令牌格式
  if (typeof token !== 'string') {
    return { valid: false, error: '会话令牌格式无效' };
  }

  // 检查令牌长度
  if (token.length < 32) {
    return { valid: false, error: '会话令牌长度不足' };
  }

  // 检查是否包含危险字符
  if (/['";<>\{\}]/.test(token)) {
    return { valid: false, error: '会话令牌包含非法字符' };
  }

  return { valid: true };
}

/**
 * 生成安全的会话令牌
 */
export function generateSessionToken(): string {
  const timestamp = Date.now();
  const randomBytes = Array.from({ length: 32 }, () =>
    Math.floor(Math.random() * 256)
  ).map(b => b.toString(16).padStart(2, '0'));

  return `${timestamp}${randomBytes.join('')}`;
}

/**
 * 检测会话劫持
 */
export function detectSessionHijacking(
  currentIP: string,
  currentUA: string,
  storedIP: string,
  storedUA: string
): {
  hijacked: boolean;
  risk: 'low' | 'medium' | 'high';
  reason?: string;
} {
  let risk: 'low' | 'medium' | 'high' = 'low';
  const reasons: string[] = [];

  // IP地址变化检测
  if (currentIP !== storedIP) {
    risk = risk === 'low' ? 'medium' : 'high';
    reasons.push('IP地址发生变化');
  }

  // User-Agent变化检测
  if (currentUA !== storedUA) {
    risk = 'high';
    reasons.push('User-Agent发生变化');
  }

  return {
    hijacked: risk === 'high',
    risk,
    reason: reasons.length > 0 ? reasons.join(', ') : undefined,
  };
}

/**
 * 记录安全事件
 */
function logSecurityEvent(
  type: string,
  data: Record<string, unknown>
): void {
  const event = {
    timestamp: new Date().toISOString(),
    type,
    ...data,
  };

  // 在生产环境中，应该发送到安全监控系统
  console.warn('[SECURITY]', JSON.stringify(event));
}

/**
 * 清理过期的失败记录
 */
export function cleanupExpiredAttempts(
  config: BruteForceConfig = DEFAULT_BRUTE_FORCE_CONFIG
): void {
  const now = Date.now();
  const maxAge = config.lockoutDuration * 2; // 保留两倍锁定时长的记录

  for (const [identifier, record] of failedAttempts.entries()) {
    if (now - record.lastAttempt > maxAge) {
      failedAttempts.delete(identifier);
    }
  }
}

// 定期清理过期记录（每5分钟）
if (typeof setInterval !== 'undefined') {
  setInterval(() => cleanupExpiredAttempts(), 5 * 60 * 1000);
}

/**
 * 获取登录安全统计
 */
export function getLoginSecurityStats(): {
  totalFailedAttempts: number;
  activeLockouts: number;
  highRiskIPs: string[];
} {
  let totalFailedAttempts = 0;
  let activeLockouts = 0;
  const highRiskIPs: string[] = [];

  const now = Date.now();

  for (const [identifier, record] of failedAttempts.entries()) {
    totalFailedAttempts += record.count;

    if (record.lockedUntil && record.lockedUntil > now) {
      activeLockouts++;
    }

    if (record.count >= 3) {
      highRiskIPs.push(record.ip);
    }
  }

  return {
    totalFailedAttempts,
    activeLockouts,
    highRiskIPs: [...new Set(highRiskIPs)],
  };
}

// 导出所有工具
export const loginDefense = {
  validateCredentials: validateLoginCredentials,
  detectUniversalPassword,
  recordFailedAttempt,
  isLockedOut,
  calculateProgressiveDelay,
  clearFailedAttempt,
  getRemainingAttempts,
  validateSessionToken,
  generateSessionToken,
  detectSessionHijacking,
  cleanupExpiredAttempts,
  getStats: getLoginSecurityStats,
};
