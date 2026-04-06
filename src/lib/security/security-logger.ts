/**
 * 安全日志和监控系统
 * 记录和分析安全事件
 */

// 安全事件类型
export enum SecurityEventType {
  SQL_INJECTION = 'SQL_INJECTION',
  XSS_ATTACK = 'XSS_ATTACK',
  CSRF_ATTACK = 'CSRF_ATTACK',
  COMMAND_INJECTION = 'COMMAND_INJECTION',
  PATH_TRAVERSAL = 'PATH_TRAVERSAL',
  BRUTE_FORCE = 'BRUTE_FORCE',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  UNIVERSAL_PASSWORD = 'UNIVERSAL_PASSWORD',
  SESSION_HIJACKING = 'SESSION_HIJACKING',
  BLACKLISTED_IP = 'BLACKLISTED_IP',
  MALICIOUS_REQUEST = 'MALICIOUS_REQUEST',
  FAILED_LOGIN = 'FAILED_LOGIN',
  SUCCESSFUL_LOGIN = 'SUCCESSFUL_LOGIN',
  SUSPICIOUS_ACTIVITY = 'SUSPICIOUS_ACTIVITY',
}

// 事件严重程度
export enum SecuritySeverity {
  INFO = 'info',
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

// 安全事件接口
export interface SecurityEvent {
  id: string;
  timestamp: string;
  type: SecurityEventType;
  severity: SecuritySeverity;
  ip: string;
  userAgent: string;
  url?: string;
  method?: string;
  userId?: string;
  sessionId?: string;
  details: Record<string, unknown>;
  resolved?: boolean;
  resolvedAt?: string;
  resolvedBy?: string;
}

// 安全统计数据
export interface SecurityStats {
  totalEvents: number;
  eventsByType: Record<string, number>;
  eventsBySeverity: Record<string, number>;
  topOffenders: {
    ip: string;
    count: number;
    events: string[];
  }[];
  recentCritical: SecurityEvent[];
  activeThreats: number;
}

// 内存存储事件（生产环境应使用数据库）
const securityEvents: Map<string, SecurityEvent> = new Map();
const MAX_EVENTS = 10000; // 内存中最多存储10000条事件

// IP威胁评分
const ipThreatScores = new Map<string, number>();

/**
 * 生成唯一事件ID
 */
function generateEventId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * 记录安全事件
 */
export function logSecurityEvent(params: {
  type: SecurityEventType;
  severity: SecuritySeverity;
  ip: string;
  userAgent: string;
  url?: string;
  method?: string;
  userId?: string;
  sessionId?: string;
  details: Record<string, unknown>;
}): string {
  const eventId = generateEventId();

  const event: SecurityEvent = {
    id: eventId,
    timestamp: new Date().toISOString(),
    type: params.type,
    severity: params.severity,
    ip: params.ip,
    userAgent: params.userAgent,
    url: params.url,
    method: params.method,
    userId: params.userId,
    sessionId: params.sessionId,
    details: params.details,
    resolved: false,
  };

  // 存储事件
  securityEvents.set(eventId, event);

  // 如果超过最大数量，删除最旧的事件
  if (securityEvents.size > MAX_EVENTS) {
    const iterator = securityEvents.keys();
    const oldestKey = iterator.next().value;
    if (oldestKey) {
      securityEvents.delete(oldestKey);
    }
  }

  // 更新IP威胁评分
  updateIPThreatScore(params.ip, params.severity);

  // 输出到控制台（生产环境应该发送到日志系统）
  const logLevel = params.severity === SecuritySeverity.CRITICAL
    ? 'error'
    : params.severity === SecuritySeverity.HIGH
    ? 'warn'
    : 'info';

  console[logLevel]('[SECURITY]', JSON.stringify(event, null, 2));

  return eventId;
}

/**
 * 更新IP威胁评分
 */
function updateIPThreatScore(ip: string, severity: SecuritySeverity): void {
  const currentScore = ipThreatScores.get(ip) || 0;

  const scoreIncrease = {
    [SecuritySeverity.INFO]: 0,
    [SecuritySeverity.LOW]: 1,
    [SecuritySeverity.MEDIUM]: 5,
    [SecuritySeverity.HIGH]: 10,
    [SecuritySeverity.CRITICAL]: 20,
  };

  ipThreatScores.set(ip, currentScore + scoreIncrease[severity]);
}

/**
 * 获取IP威胁评分
 */
export function getIPThreatScore(ip: string): {
  score: number;
  level: 'low' | 'medium' | 'high' | 'critical';
} {
  const score = ipThreatScores.get(ip) || 0;

  let level: 'low' | 'medium' | 'high' | 'critical' = 'low';
  if (score >= 50) level = 'critical';
  else if (score >= 30) level = 'high';
  else if (score >= 10) level = 'medium';

  return { score, level };
}

/**
 * 查询安全事件
 */
export function querySecurityEvents(filters: {
  type?: SecurityEventType;
  severity?: SecuritySeverity;
  ip?: string;
  userId?: string;
  startTime?: Date;
  endTime?: Date;
  resolved?: boolean;
  limit?: number;
}): SecurityEvent[] {
  let results = Array.from(securityEvents.values());

  // 按类型过滤
  if (filters.type) {
    results = results.filter(e => e.type === filters.type);
  }

  // 按严重程度过滤
  if (filters.severity) {
    results = results.filter(e => e.severity === filters.severity);
  }

  // 按IP过滤
  if (filters.ip) {
    results = results.filter(e => e.ip === filters.ip);
  }

  // 按用户过滤
  if (filters.userId) {
    results = results.filter(e => e.userId === filters.userId);
  }

  // 按时间范围过滤
  if (filters.startTime) {
    results = results.filter(e => new Date(e.timestamp) >= filters.startTime!);
  }
  if (filters.endTime) {
    results = results.filter(e => new Date(e.timestamp) <= filters.endTime!);
  }

  // 按解决状态过滤
  if (filters.resolved !== undefined) {
    results = results.filter(e => e.resolved === filters.resolved);
  }

  // 限制数量
  if (filters.limit) {
    results = results.slice(0, filters.limit);
  }

  // 按时间倒序排列
  return results.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

/**
 * 获取安全统计
 */
export function getSecurityStats(hours: number = 24): SecurityStats {
  const now = new Date();
  const startTime = new Date(now.getTime() - hours * 60 * 60 * 1000);

  const recentEvents = Array.from(securityEvents.values()).filter(
    e => new Date(e.timestamp) >= startTime
  );

  // 按类型统计
  const eventsByType: Record<string, number> = {};
  recentEvents.forEach(e => {
    eventsByType[e.type] = (eventsByType[e.type] || 0) + 1;
  });

  // 按严重程度统计
  const eventsBySeverity: Record<string, number> = {};
  recentEvents.forEach(e => {
    eventsBySeverity[e.severity] = (eventsBySeverity[e.severity] || 0) + 1;
  });

  // 统计恶意IP
  const ipEventCounts = new Map<string, { count: number; events: string[] }>();
  recentEvents.forEach(e => {
    const current = ipEventCounts.get(e.ip) || { count: 0, events: [] };
    current.count += 1;
    current.events.push(e.type);
    ipEventCounts.set(e.ip, current);
  });

  const topOffenders = Array.from(ipEventCounts.entries())
    .map(([ip, data]) => ({ ip, count: data.count, events: [...new Set(data.events)] }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // 最近的严重事件
  const recentCritical = recentEvents
    .filter(e => e.severity === SecuritySeverity.CRITICAL || e.severity === SecuritySeverity.HIGH)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 10);

  // 活跃威胁数量
  const activeThreats = recentEvents.filter(
    e => !e.resolved && (e.severity === SecuritySeverity.HIGH || e.severity === SecuritySeverity.CRITICAL)
  ).length;

  return {
    totalEvents: recentEvents.length,
    eventsByType,
    eventsBySeverity,
    topOffenders,
    recentCritical,
    activeThreats,
  };
}

/**
 * 标记事件为已解决
 */
export function resolveSecurityEvent(
  eventId: string,
  resolvedBy: string
): { success: boolean; error?: string } {
  const event = securityEvents.get(eventId);

  if (!event) {
    return { success: false, error: '事件不存在' };
  }

  event.resolved = true;
  event.resolvedAt = new Date().toISOString();
  event.resolvedBy = resolvedBy;

  securityEvents.set(eventId, event);

  console.info('[SECURITY]', `Event ${eventId} resolved by ${resolvedBy}`);

  return { success: true };
}

/**
 * 获取未解决的安全警报
 */
export function getSecurityAlerts(): {
  critical: SecurityEvent[];
  high: SecurityEvent[];
  medium: SecurityEvent[];
} {
  const unresolved = Array.from(securityEvents.values()).filter(e => !e.resolved);

  return {
    critical: unresolved.filter(e => e.severity === SecuritySeverity.CRITICAL),
    high: unresolved.filter(e => e.severity === SecuritySeverity.HIGH),
    medium: unresolved.filter(e => e.severity === SecuritySeverity.MEDIUM),
  };
}

/**
 * 清理旧事件
 */
export function cleanupOldEvents(daysToKeep: number = 30): number {
  const cutoffDate = new Date(Date.now() - daysToKeep * 24 * 60 * 60 * 1000);
  let deletedCount = 0;

  for (const [eventId, event] of securityEvents.entries()) {
    if (new Date(event.timestamp) < cutoffDate) {
      securityEvents.delete(eventId);
      deletedCount++;
    }
  }

  console.info('[SECURITY]', `Cleaned up ${deletedCount} old events`);

  return deletedCount;
}

/**
 * 生成安全报告
 */
export function generateSecurityReport(hours: number = 24): string {
  const stats = getSecurityStats(hours);
  const alerts = getSecurityAlerts();

  const report = `
╔═══════════════════════════════════════════════════════════════╗
║                    安全报告                                   ║
║  时间范围: 最近${hours}小时                                      ║
╚═══════════════════════════════════════════════════════════════╝

📊 总体统计
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  总事件数: ${stats.totalEvents}
  活跃威胁: ${stats.activeThreats}

📈 事件类型分布
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${Object.entries(stats.eventsByType)
  .map(([type, count]) => `  ${type}: ${count}`)
  .join('\n')}

⚠️ 严重程度分布
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Critical: ${stats.eventsBySeverity[SecuritySeverity.CRITICAL] || 0}
  High:     ${stats.eventsBySeverity[SecuritySeverity.HIGH] || 0}
  Medium:   ${stats.eventsBySeverity[SecuritySeverity.MEDIUM] || 0}
  Low:      ${stats.eventsBySeverity[SecuritySeverity.LOW] || 0}
  Info:     ${stats.eventsBySeverity[SecuritySeverity.INFO] || 0}

🎯 高危IP排名
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${stats.topOffenders.slice(0, 5).map((offender, index) => {
  const threatLevel = getIPThreatScore(offender.ip);
  return `  ${index + 1}. ${offender.ip} (${offender.count}次, 威胁等级: ${threatLevel.level})`;
}).join('\n')}

🚨 未解决警报
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Critical: ${alerts.critical.length} 个
  High:     ${alerts.high.length} 个
  Medium:   ${alerts.medium.length} 个

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  报告生成时间: ${new Date().toISOString()}
`;

  return report;
}

/**
 * 自动清理任务
 */
function runCleanupTasks(): void {
  // 清理旧事件
  cleanupOldEvents(30);

  // 降低过期的IP威胁评分
  const now = Date.now();
  const scoreDecay = 0.1; // 每次降低10%

  for (const [ip, score] of ipThreatScores.entries()) {
    const newScore = Math.max(0, score * (1 - scoreDecay));
    if (newScore < 1) {
      ipThreatScores.delete(ip);
    } else {
      ipThreatScores.set(ip, newScore);
    }
  }
}

// 定期执行清理任务（每小时）
if (typeof setInterval !== 'undefined') {
  setInterval(runCleanupTasks, 60 * 60 * 1000);
}

// 导出所有工具
export const securityLogger = {
  logEvent: logSecurityEvent,
  queryEvents: querySecurityEvents,
  getStats: getSecurityStats,
  getAlerts: getSecurityAlerts,
  resolveEvent: resolveSecurityEvent,
  cleanup: cleanupOldEvents,
  generateReport: generateSecurityReport,
  getIPThreatScore,
};
