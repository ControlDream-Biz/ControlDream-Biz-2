/**
 * 服务器日志审计和异常访问监控
 * 记录所有请求，检测异常行为，提供安全分析
 */

import { db } from '@/lib/db';

export interface AuditLog {
  id?: number;
  timestamp: Date;
  ip: string;
  method: string;
  path: string;
  statusCode: number;
  userAgent?: string;
  referer?: string;
  duration: number;
  wafBlocked: boolean;
  wafRules?: string[];
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  suspicious: boolean;
}

export interface AuditStats {
  totalRequests: number;
  blockedRequests: number;
  suspiciousRequests: number;
  topIPs: { ip: string; count: number; riskLevel: string }[];
  topPaths: { path: string; count: number }[];
  attackAttempts: {
    sqlInjection: number;
    xss: number;
    commandInjection: number;
    pathTraversal: number;
    csrf: number;
  };
  timeRange: {
    start: Date;
    end: Date;
  };
}

// 内存存储（用于实时监控）
const auditLogCache: AuditLog[] = [];
const MAX_CACHE_SIZE = 1000;

/**
 * 记录审计日志
 * @param log 审计日志
 */
export async function logAudit(log: AuditLog): Promise<void> {
  // 添加到缓存
  auditLogCache.push(log);

  // 保持缓存大小
  if (auditLogCache.length > MAX_CACHE_SIZE) {
    auditLogCache.shift();
  }

  // 如果数据库可用，写入数据库
  try {
    // 注意：这里需要先创建数据库表结构
    // 暂时只使用内存存储
    console.log(`[Audit Log] ${log.ip} - ${log.method} ${log.path} - ${log.statusCode} - Risk: ${log.riskLevel}`);
  } catch (error) {
    console.error('[Audit Log] Failed to write to database:', error);
  }
}

/**
 * 评估请求风险等级
 * @param log 审计日志
 * @returns 风险等级
 */
export function evaluateRiskLevel(log: AuditLog): 'low' | 'medium' | 'high' | 'critical' {
  let score = 0;

  // WAF 阻断
  if (log.wafBlocked) {
    score += 50;
  }

  // 状态码异常
  if (log.statusCode >= 400 && log.statusCode < 500) {
    score += 10;
  } else if (log.statusCode >= 500) {
    score += 20;
  }

  // 请求时长异常
  if (log.duration > 5000) {
    score += 10; // 超过5秒
  }
  if (log.duration > 10000) {
    score += 20; // 超过10秒
  }

  // 可疑 User-Agent
  if (!log.userAgent || log.userAgent.length < 10) {
    score += 5;
  }

  // 路径可疑
  const suspiciousPaths = ['/admin', '/login', '/api/', '/.env', '/config', '/backup'];
  if (suspiciousPaths.some(path => log.path.includes(path))) {
    score += 15;
  }

  // 根据评分返回风险等级
  if (score >= 50) return 'critical';
  if (score >= 30) return 'high';
  if (score >= 10) return 'medium';
  return 'low';
}

/**
 * 检测异常访问行为
 * @param ip IP 地址
 * @returns 是否异常
 */
export function detectAnomalousBehavior(ip: string): {
  anomalous: boolean;
  reason?: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
} {
  const now = Date.now();
  const oneMinuteAgo = now - 60 * 1000;
  const oneHourAgo = now - 60 * 60 * 1000;

  // 获取最近1分钟的请求
  const recentRequests = auditLogCache.filter(log => {
    return log.ip === ip && new Date(log.timestamp).getTime() > oneMinuteAgo;
  });

  // 速率异常：1分钟内超过100次请求
  if (recentRequests.length > 100) {
    return {
      anomalous: true,
      reason: '高频请求（1分钟内超过100次）',
      severity: 'high',
    };
  }

  // 获取最近1小时的请求
  const hourlyRequests = auditLogCache.filter(log => {
    return log.ip === ip && new Date(log.timestamp).getTime() > oneHourAgo;
  });

  // 速率异常：1小时内超过1000次请求
  if (hourlyRequests.length > 1000) {
    return {
      anomalous: true,
      reason: '高频请求（1小时内超过1000次）',
      severity: 'high',
    };
  }

  // 失败率异常
  const failedRequests = hourlyRequests.filter(log => log.statusCode >= 400);
  if (failedRequests.length > 50 && failedRequests.length / hourlyRequests.length > 0.5) {
    return {
      anomalous: true,
      reason: '高失败率（失败率超过50%）',
      severity: 'medium',
    };
  }

  // WAF 阻断异常
  const blockedRequests = hourlyRequests.filter(log => log.wafBlocked);
  if (blockedRequests.length > 10) {
    return {
      anomalous: true,
      reason: '多次 WAF 阻断',
      severity: 'high',
    };
  }

  // 路径遍历检测
  const pathTraversalAttempts = hourlyRequests.filter(log =>
    log.path.includes('..') || log.path.includes('%2e')
  );
  if (pathTraversalAttempts.length > 5) {
    return {
      anomalous: true,
      reason: '路径遍历尝试',
      severity: 'critical',
    };
  }

  // SQL 注入尝试
  const sqlInjectionAttempts = hourlyRequests.filter(log =>
    log.wafRules?.some(rule => rule.includes('SQL'))
  );
  if (sqlInjectionAttempts.length > 5) {
    return {
      anomalous: true,
      reason: 'SQL 注入尝试',
      severity: 'critical',
    };
  }

  // XSS 尝试
  const xssAttempts = hourlyRequests.filter(log =>
    log.wafRules?.some(rule => rule.includes('XSS'))
  );
  if (xssAttempts.length > 5) {
    return {
      anomalous: true,
      reason: 'XSS 攻击尝试',
      severity: 'critical',
    };
  }

  return { anomalous: false };
}

/**
 * 获取审计统计
 * @param hours 时间范围（小时）
 * @returns 统计信息
 */
export function getAuditStats(hours: number = 24): AuditStats {
  const now = Date.now();
  const startTime = now - hours * 60 * 60 * 1000;

  const logs = auditLogCache.filter(log => {
    return new Date(log.timestamp).getTime() > startTime;
  });

  // 统计 IP 访问次数
  const ipCounts = new Map<string, { count: number; riskLevel: string }>();
  logs.forEach(log => {
    const current = ipCounts.get(log.ip) || { count: 0, riskLevel: log.riskLevel };
    ipCounts.set(log.ip, {
      count: current.count + 1,
      riskLevel: log.riskLevel > current.riskLevel ? log.riskLevel : current.riskLevel,
    });
  });

  const topIPs = Array.from(ipCounts.entries())
    .map(([ip, data]) => ({ ip, count: data.count, riskLevel: data.riskLevel }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // 统计路径访问次数
  const pathCounts = new Map<string, number>();
  logs.forEach(log => {
    pathCounts.set(log.path, (pathCounts.get(log.path) || 0) + 1);
  });

  const topPaths = Array.from(pathCounts.entries())
    .map(([path, count]) => ({ path, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // 统计攻击尝试
  const attackAttempts = {
    sqlInjection: 0,
    xss: 0,
    commandInjection: 0,
    pathTraversal: 0,
    csrf: 0,
  };

  logs.forEach(log => {
    if (log.wafRules) {
      log.wafRules.forEach(rule => {
        if (rule.includes('SQL')) attackAttempts.sqlInjection++;
        if (rule.includes('XSS')) attackAttempts.xss++;
        if (rule.includes('Command')) attackAttempts.commandInjection++;
        if (rule.includes('Path Traversal')) attackAttempts.pathTraversal++;
        if (rule.includes('CSRF')) attackAttempts.csrf++;
      });
    }
  });

  return {
    totalRequests: logs.length,
    blockedRequests: logs.filter(log => log.wafBlocked).length,
    suspiciousRequests: logs.filter(log => log.suspicious).length,
    topIPs,
    topPaths,
    attackAttempts,
    timeRange: {
      start: new Date(startTime),
      end: new Date(now),
    },
  };
}

/**
 * 获取可疑 IP 列表
 * @param threshold 阈值（最近24小时内失败次数）
 * @returns 可疑 IP 列表
 */
export function getSuspiciousIPs(threshold: number = 10): string[] {
  const now = Date.now();
  const oneDayAgo = now - 24 * 60 * 60 * 1000;

  const logs = auditLogCache.filter(log => {
    return new Date(log.timestamp).getTime() > oneDayAgo;
  });

  const ipFailedCounts = new Map<string, number>();
  logs.forEach(log => {
    if (log.statusCode >= 400 || log.wafBlocked) {
      ipFailedCounts.set(log.ip, (ipFailedCounts.get(log.ip) || 0) + 1);
    }
  });

  return Array.from(ipFailedCounts.entries())
    .filter(([_, count]) => count >= threshold)
    .map(([ip, _]) => ip)
    .sort((a, b) => (ipFailedCounts.get(b) || 0) - (ipFailedCounts.get(a) || 0));
}

/**
 * 导出审计日志
 * @param hours 时间范围（小时）
 * @returns 日志数组
 */
export function exportAuditLogs(hours: number = 24): AuditLog[] {
  const now = Date.now();
  const startTime = now - hours * 60 * 60 * 1000;

  return auditLogCache.filter(log => {
    return new Date(log.timestamp).getTime() > startTime;
  });
}

/**
 * 清理过期日志
 * @param hours 保留小时数
 */
export function cleanExpiredLogs(hours: number = 72): void {
  const now = Date.now();
  const cutoffTime = now - hours * 60 * 60 * 1000;

  const initialLength = auditLogCache.length;
  for (let i = auditLogCache.length - 1; i >= 0; i--) {
    if (new Date(auditLogCache[i].timestamp).getTime() < cutoffTime) {
      auditLogCache.splice(i, 1);
    }
  }

  const removedCount = initialLength - auditLogCache.length;
  if (removedCount > 0) {
    console.log(`[Audit Log] Cleaned up ${removedCount} expired logs`);
  }
}

// 定期清理过期日志（每小时执行一次）
if (typeof setInterval !== 'undefined') {
  setInterval(() => cleanExpiredLogs(72), 60 * 60 * 1000);
}
