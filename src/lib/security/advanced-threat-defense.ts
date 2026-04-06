/**
 * 高级威胁防御系统
 * 防御非常规入侵和爆破手段
 */

import { detectSQLInjection, detectXSS } from './input-validator';
import { logSecurityEvent, SecurityEventType, SecuritySeverity } from './security-logger';

// ============================================================================
// 1. Zero-day 漏洞利用防护
// ============================================================================

/**
 * 检测可疑的请求特征（可能指示零日漏洞）
 */
export function detectZeroDayExploit(request: {
  url: string;
  headers: Record<string, string>;
  body?: any;
}): {
  detected: boolean;
  severity: 'low' | 'medium' | 'high' | 'critical';
  patterns: string[];
} {
  const patterns: string[] = [];
  let severity: 'low' | 'medium' | 'high' | 'critical' = 'low';

  const { url, headers, body } = request;
  const userAgent = headers['user-agent']?.toLowerCase() || '';
  const referer = headers['referer']?.toLowerCase() || '';

  // 检测未知的 User-Agent 模式
  const suspiciousUA = [
    /python-requests/i,
    /curl/i,
    /wget/i,
    /libwww/i,
    /java\/\d/i,
    /ruby/i,
    /go-http-client/i,
    /okhttp/i,
    /apache-httpclient/i,
  ];

  for (const pattern of suspiciousUA) {
    if (pattern.test(userAgent)) {
      patterns.push(`Suspicious User-Agent: ${pattern.source}`);
      severity = 'medium';
    }
  }

  // 检测异常的请求头
  if (!headers['accept'] && !headers['content-type']) {
    patterns.push('Missing essential headers');
    severity = severity === 'low' ? 'medium' : severity;
  }

  // 检测异常的 Referer
  if (referer && !referer.startsWith('http')) {
    patterns.push('Invalid Referer header');
    severity = severity === 'low' ? 'medium' : severity;
  }

  // 检测异常的 URL 参数
  const urlParams = new URL(url, 'http://localhost').searchParams;
  for (const [key, value] of urlParams.entries()) {
    // 长参数名可能是攻击尝试
    if (key.length > 100) {
      patterns.push(`Extremely long parameter name: ${key.substring(0, 50)}...`);
      severity = severity === 'medium' ? 'high' : severity;
    }

    // Base64 编码的参数
    if (value.length > 50 && /^[A-Za-z0-9+/]+=*$/.test(value)) {
      patterns.push(`Possible Base64 encoded parameter: ${key}`);
      severity = severity === 'low' ? 'medium' : severity;
    }
  }

  // 检测请求体中的异常内容
  if (body) {
    const bodyStr = JSON.stringify(body);
    if (bodyStr.includes('${') || bodyStr.includes('<%')) {
      patterns.push('Template injection pattern detected');
      severity = severity === 'medium' ? 'high' : severity;
    }
  }

  return {
    detected: patterns.length > 0,
    severity,
    patterns,
  };
}

// ============================================================================
// 2. Social Engineering 防护
// ============================================================================

/**
 * 检测社会工程学攻击
 */
export function detectSocialEngineeringAttack(input: string): {
  detected: boolean;
  type: string[];
  risk: 'low' | 'medium' | 'high';
} {
  const attacks: string[] = [];
  let risk: 'low' | 'medium' | 'high' = 'low';

  const lowerInput = input.toLowerCase();

  // 钓鱼关键词
  const phishingKeywords = [
    'confirm your account',
    'verify your identity',
    'update your payment',
    'security alert',
    'your account will be closed',
    'urgent action required',
    'click here immediately',
    'password expires',
    'verify your password',
    'suspicious activity',
    'limited time offer',
  ];

  for (const keyword of phishingKeywords) {
    if (lowerInput.includes(keyword)) {
      attacks.push(`Phishing keyword: "${keyword}"`);
      risk = 'medium';
    }
  }

  // 紧急性词汇
  const urgencyWords = [
    'urgent',
    'immediately',
    'asap',
    'right now',
    'today only',
    'expires soon',
    'don\'t wait',
    'act now',
  ];

  for (const word of urgencyWords) {
    if (lowerInput.includes(word)) {
      attacks.push(`Urgency word: "${word}"`);
      risk = risk === 'low' ? 'medium' : risk;
    }
  }

  // 奖励/威胁词汇
  const rewardThreatWords = [
    'congratulations',
    'you won',
    'prize',
    'reward',
    'gift',
    'your computer is infected',
    'virus detected',
    'security breach',
    'unauthorized access',
  ];

  for (const word of rewardThreatWords) {
    if (lowerInput.includes(word)) {
      attacks.push(`Reward/Threat word: "${word}"`);
      risk = risk === 'medium' ? 'high' : risk;
    }
  }

  // 可疑链接模式
  const suspiciousURLs = [
    /bit\.ly/i,
    /tinyurl\.com/i,
    /goo\.gl/i,
    /t\.co/i,
    /[a-z0-9]{20,}\.(com|net|org)/i,
    /https?:\/\/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/i, // IP地址URL
  ];

  for (const pattern of suspiciousURLs) {
    if (pattern.test(input)) {
      attacks.push(`Suspicious URL pattern: ${pattern.source}`);
      risk = risk === 'medium' ? 'high' : risk;
    }
  }

  return {
    detected: attacks.length > 0,
    type: attacks,
    risk,
  };
}

// ============================================================================
// 3. API 滥用防护
// ============================================================================

// API调用记录
const apiCallRecords = new Map<string, { count: number; lastCall: number }>();

/**
 * 检测 API 滥用
 */
export function detectAPIAbuse(
  apiKey: string,
  endpoint: string,
  limit: number = 100
): {
  allowed: boolean;
  remaining: number;
  resetTime: number;
} {
  const now = Date.now();
  const key = `${apiKey}:${endpoint}`;

  const record = apiCallRecords.get(key);

  if (!record) {
    apiCallRecords.set(key, { count: 1, lastCall: now });
    return { allowed: true, remaining: limit - 1, resetTime: now + 60000 };
  }

  // 检查是否在过去1分钟内
  if (now - record.lastCall < 60000) {
    if (record.count >= limit) {
      return { allowed: false, remaining: 0, resetTime: record.lastCall + 60000 };
    }

    record.count += 1;
    apiCallRecords.set(key, record);
    return { allowed: true, remaining: limit - record.count, resetTime: record.lastCall + 60000 };
  }

  // 重置计数器
  apiCallRecords.set(key, { count: 1, lastCall: now });
  return { allowed: true, remaining: limit - 1, resetTime: now + 60000 };
}

// ============================================================================
// 4. 供应链攻击防护
// ============================================================================

/**
 * 验证软件包完整性
 */
export function verifyPackageIntegrity(packageName: string, version: string, checksum: string): {
  valid: boolean;
  error?: string;
} {
  // 检查包名格式
  if (!/^(@[a-z0-9-~][a-z0-9-._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/.test(packageName)) {
    return { valid: false, error: 'Invalid package name format' };
  }

  // 检查版本格式
  if (!/^\d+\.\d+\.\d+/.test(version)) {
    return { valid: false, error: 'Invalid version format' };
  }

  // 检查校验和格式（SHA256）
  if (!/^[a-f0-9]{64}$/i.test(checksum)) {
    return { valid: false, error: 'Invalid checksum format' };
  }

  // 在实际应用中，应该和官方注册表的校验和进行比较
  return { valid: true };
}

// 恶意包黑名单
const MALICIOUS_PACKAGES = new Set([
  'crossenv',
  'npmconfig',
  'nodeconf',
  'webpack-freedom-logs',
  'security-web-browser',
]);

/**
 * 检查是否是已知恶意包
 */
export function checkMaliciousPackage(packageName: string): boolean {
  return MALICIOUS_PACKAGES.has(packageName);
}

// ============================================================================
// 5. 内部威胁防护
// ============================================================================

// 用户行为基线
const userBehaviorBaselines = new Map<string, {
  averageRequests: number;
  averageDataSize: number;
  commonEndpoints: string[];
  commonTimeRanges: number[][];
}>();

/**
 * 检测异常用户行为
 */
export function detectAnomalousUserBehavior(
  userId: string,
  requests: number,
  dataSize: number,
  endpoint: string,
  timestamp: number
): {
  anomalous: boolean;
  type: string;
  severity: 'low' | 'medium' | 'high';
} {
  const baseline = userBehaviorBaselines.get(userId);

  if (!baseline) {
    // 第一次记录，建立基线
    userBehaviorBaselines.set(userId, {
      averageRequests: requests,
      averageDataSize: dataSize,
      commonEndpoints: [endpoint],
      commonTimeRanges: [[timestamp, timestamp]],
    });
    return { anomalous: false, type: 'Baseline established', severity: 'low' };
  }

  // 检查请求频率异常
  if (requests > baseline.averageRequests * 5) {
    return {
      anomalous: true,
      type: 'Unusual request frequency',
      severity: 'high',
    };
  }

  // 检查数据传输量异常
  if (dataSize > baseline.averageDataSize * 10) {
    return {
      anomalous: true,
      type: 'Unusual data transfer volume',
      severity: 'high',
    };
  }

  // 检查访问异常端点
  if (!baseline.commonEndpoints.includes(endpoint)) {
    return {
      anomalous: true,
      type: 'Access to unusual endpoint',
      severity: 'medium',
    };
  }

  // 检查访问时间异常
  const currentHour = new Date(timestamp).getHours();
  const hasNormalAccess = baseline.commonTimeRanges.some(
    range => currentHour >= new Date(range[0]).getHours() && currentHour <= new Date(range[1]).getHours()
  );

  if (!hasNormalAccess) {
    return {
      anomalous: true,
      type: 'Access at unusual time',
      severity: 'medium',
    };
  }

  return { anomalous: false, type: 'Normal behavior', severity: 'low' };
}

// ============================================================================
// 6. 高级持久性威胁 (APT) 防护
// ============================================================================

// APT 指标
const aptIndicators = new Map<string, Set<string>>();

/**
 * 检测 APT 指标
 */
export function detectAPTIndicators(
  ip: string,
  userAgent: string,
  payload: any
): {
  detected: boolean;
  indicators: string[];
  severity: 'medium' | 'high' | 'critical';
} {
  const indicators: string[] = [];
  let severity: 'medium' | 'high' | 'critical' = 'medium';

  // 已知 APT 组织的 User-Agent
  const aptUserAgents = [
    /co2bot/i,
    /mirai/i,
    /xmr-stak/i,
    /xmrig/i,
    /miner/i,
    /c2/i,
  ];

  for (const pattern of aptUserAgents) {
    if (pattern.test(userAgent)) {
      indicators.push(`APT User-Agent: ${pattern.source}`);
      severity = 'critical';
    }
  }

  // 检测持久化机制
  if (payload && typeof payload === 'object') {
    const payloadStr = JSON.stringify(payload);

    // 检测计划任务
    if (payloadStr.includes('cron') || payloadStr.includes('scheduled')) {
      indicators.push('Persistence mechanism: Cron/Scheduled task');
      severity = severity === 'medium' ? 'high' : severity;
    }

    // 检测注册表修改
    if (payloadStr.includes('registry') || payloadStr.includes('regedit')) {
      indicators.push('Persistence mechanism: Registry modification');
      severity = severity === 'medium' ? 'high' : severity;
    }

    // 检测启动项
    if (payloadStr.includes('startup') || payloadStr.includes('autostart')) {
      indicators.push('Persistence mechanism: Startup item');
      severity = severity === 'medium' ? 'high' : severity;
    }
  }

  // 检查 IP 是否在已知的 APT IP 列表中
  const aptIP = aptIndicators.get(ip);
  if (aptIP && aptIP.size > 0) {
    indicators.push(`Known APT IP: ${ip}`);
    severity = 'critical';
  }

  return {
    detected: indicators.length > 0,
    indicators,
    severity,
  };
}

// ============================================================================
// 7. 加密货币挖矿检测
// ============================================================================

/**
 * 检测加密货币挖矿
 */
export function detectCryptoMining(payload: any, userAgent: string): {
  detected: boolean;
  type: string[];
  severity: 'medium' | 'high' | 'critical';
} {
  const types: string[] = [];
  let severity: 'medium' | 'high' | 'critical' = 'medium';

  // 检测已知的挖矿 User-Agent
  const miningUserAgents = [
    /xmrig/i,
    /xmr-stak/i,
    /cpuminer/i,
    /ccminer/i,
    /claymore/i,
    /ethminer/i,
    /miner/i,
  ];

  for (const pattern of miningUserAgents) {
    if (pattern.test(userAgent)) {
      types.push(`Mining User-Agent: ${pattern.source}`);
      severity = 'critical';
    }
  }

  // 检测挖矿相关的 payload
  if (payload && typeof payload === 'object') {
    const payloadStr = JSON.stringify(payload).toLowerCase();

    if (payloadStr.includes('stratum') || payloadStr.includes('mining pool')) {
      types.push('Mining pool connection');
      severity = severity === 'medium' ? 'high' : severity;
    }

    if (payloadStr.includes('share') || payloadStr.includes('nonce')) {
      types.push('Mining share submission');
      severity = severity === 'medium' ? 'high' : severity;
    }

    if (payloadStr.includes('hashrate') || payloadStr.includes('difficulty')) {
      types.push('Mining statistics');
      severity = severity === 'medium' ? 'high' : severity;
    }
  }

  return {
    detected: types.length > 0,
    type: types,
    severity,
  };
}

// ============================================================================
// 8. Bot 检测
// ============================================================================

/**
 * 检测自动化工具和 Bot
 */
export function detectBot(
  headers: Record<string, string>,
  behavior: {
    hasJavaScript: boolean;
    mouseMovement: boolean;
    keyboardInput: boolean;
    timingConsistent: boolean;
  }
): {
  isBot: boolean;
  confidence: 'low' | 'medium' | 'high';
  reasons: string[];
} {
  const reasons: string[] = [];
  let confidence: 'low' | 'medium' | 'high' = 'low';

  const userAgent = headers['user-agent']?.toLowerCase() || '';

  // 已知 Bot User-Agent
  const knownBots = [
    /googlebot/i,
    /bingbot/i,
    /baiduspider/i,
    /yandexbot/i,
    /slurp/i,
    /duckduckbot/i,
    /baiduspider/i,
    /yandex.com/i,
  ];

  let isKnownGoodBot = false;
  for (const pattern of knownBots) {
    if (pattern.test(userAgent)) {
      isKnownGoodBot = true;
      reasons.push('Known search engine bot');
      break;
    }
  }

  // 恶意 Bot User-Agent
  const maliciousBots = [
    /python/i,
    /curl/i,
    /wget/i,
    /java/i,
    /ruby/i,
    /perl/i,
    /libwww/i,
    /wget/i,
    /requests/i,
    /http\.client/i,
  ];

  for (const pattern of maliciousBots) {
    if (pattern.test(userAgent) && !isKnownGoodBot) {
      reasons.push(`Malicious bot User-Agent: ${pattern.source}`);
      confidence = 'high';
    }
  }

  // 行为分析
  if (!behavior.hasJavaScript) {
    reasons.push('No JavaScript detected');
    confidence = confidence === 'low' ? 'medium' : confidence;
  }

  if (!behavior.mouseMovement && !behavior.keyboardInput) {
    reasons.push('No human interaction detected');
    confidence = confidence === 'low' ? 'medium' : confidence;
  }

  if (behavior.timingConsistent) {
    reasons.push('Consistent timing patterns');
    confidence = confidence === 'medium' ? 'high' : confidence;
  }

  // 检查缺失的浏览器特征
  if (!headers['accept'] || !headers['accept-language']) {
    reasons.push('Missing browser headers');
    confidence = confidence === 'low' ? 'medium' : confidence;
  }

  return {
    isBot: reasons.length > 0 && !isKnownGoodBot,
    confidence,
    reasons,
  };
}

// ============================================================================
// 9. 恶意文件上传防护
// ============================================================================

/**
 * 检测恶意文件上传
 */
export function detectMaliciousFile(file: {
  name: string;
  type: string;
  size: number;
  content?: Buffer;
}): {
  safe: boolean;
  threats: string[];
  severity: 'low' | 'medium' | 'high' | 'critical';
} {
  const threats: string[] = [];
  let severity: 'low' | 'medium' | 'high' | 'critical' = 'low';

  const { name, type, size, content } = file;
  const extension = name.split('.').pop()?.toLowerCase() || '';

  // 检查文件扩展名
  const dangerousExtensions = [
    'exe', 'bat', 'cmd', 'sh', 'ps1', 'vbs', 'js',
    'jar', 'war', 'jsp', 'php', 'asp', 'aspx', 'cgi',
    'dll', 'so', 'dylib',
    'deb', 'rpm', 'msi',
    'scr', 'pif', 'com',
  ];

  if (dangerousExtensions.includes(extension)) {
    threats.push(`Dangerous file extension: .${extension}`);
    severity = 'critical';
  }

  // 检查 MIME 类型
  const dangerousMimeTypes = [
    'application/x-msdownload',
    'application/x-msdos-program',
    'application/x-executable',
    'application/x-sh',
    'application/x-shellscript',
    'text/x-php',
    'application/x-php',
  ];

  if (dangerousMimeTypes.includes(type.toLowerCase())) {
    threats.push(`Dangerous MIME type: ${type}`);
    severity = 'critical';
  }

  // 检查文件大小
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (size > maxSize) {
    threats.push(`File size exceeds limit: ${size} bytes`);
    severity = severity === 'low' ? 'medium' : severity;
  }

  // 检查文件内容（如果有）
  if (content && content.length > 0) {
    const contentStr = content.toString('utf8', 0, Math.min(1024, content.length));

    // 检测脚本内容
    if (/<script|eval\(|exec\(|system\(/i.test(contentStr)) {
      threats.push('Script content detected in file');
      severity = severity === 'medium' ? 'high' : severity;
    }

    // 检测 Webshell
    if (/<?php|<\?|\$_GET|\$_POST|\$_REQUEST/i.test(contentStr)) {
      threats.push('Possible webshell detected');
      severity = 'critical';
    }
  }

  return {
    safe: threats.length === 0,
    threats,
    severity,
  };
}

// ============================================================================
// 10. 日志注入防护
// ============================================================================

/**
 * 清理日志输入，防止日志注入
 */
export function sanitizeLogInput(input: string): string {
  if (!input || typeof input !== 'string') {
    return '';
  }

  return input
    .replace(/[\r\n]/g, '') // 移除换行符
    .replace(/\t/g, ' ') // 替换制表符
    .replace(/[\x00-\x1F\x7F]/g, '') // 移除控制字符
    .replace(/[<>]/g, '') // 移除 HTML 标签
    .substring(0, 1000); // 限制长度
}

// ============================================================================
// 11. HTTP 请求走私
// ============================================================================

/**
 * 检测 HTTP 请求走私
 */
export function detectHTTPSmuggling(headers: Record<string, string>, body?: any): {
  detected: boolean;
  type: string[];
  severity: 'high' | 'critical';
} {
  const types: string[] = [];
  let severity: 'high' | 'critical' = 'high';

  // 检查冲突的 Content-Length 和 Transfer-Encoding
  const contentLength = headers['content-length'];
  const transferEncoding = headers['transfer-encoding'];

  if (contentLength && transferEncoding) {
    types.push('Conflicting Content-Length and Transfer-Encoding');
    severity = 'critical';
  }

  // 检查重复的 Content-Length
  const contentLengthHeaders = Object.keys(headers).filter(
    key => key.toLowerCase() === 'content-length'
  );

  if (contentLengthHeaders.length > 1) {
    types.push('Duplicate Content-Length headers');
    severity = 'critical';
  }

  // 检查异常的 Content-Length
  if (contentLength) {
    const length = parseInt(contentLength, 10);
    if (isNaN(length) || length < 0) {
      types.push('Invalid Content-Length');
      severity = severity === 'high' ? 'critical' : severity;
    }
  }

  // 检查请求体中的异常内容
  if (body) {
    const bodyStr = typeof body === 'string' ? body : JSON.stringify(body);

    // 检测 TE.CL 模式
    if (/Transfer-Encoding:.*chunked.*Content-Length:.*\d+.*0\r\n\r\n/i.test(bodyStr)) {
      types.push('TE.CL request smuggling pattern');
      severity = 'critical';
    }

    // 检测 CL.TE 模式
    if (/Content-Length:.*\d+.*Transfer-Encoding:.*chunked.*\r\n0\r\n\r\n/i.test(bodyStr)) {
      types.push('CL.TE request smuggling pattern');
      severity = 'critical';
    }
  }

  return {
    detected: types.length > 0,
    type: types,
    severity,
  };
}

// ============================================================================
// 12. HTTP 响应分割
// ============================================================================

/**
 * 检测 HTTP 响应分割攻击
 */
export function detectHTTPResponseSplitting(input: string): {
  detected: boolean;
  severity: 'high';
} {
  const patterns = [
    /\r\n\r\n/, // CRLFCRLF
    /\r\nContent-Length:/i,
    /\r\nLocation:/i,
    /\r\nSet-Cookie:/i,
    /\n\n/, // LFLF
    /\r\r/, // CRCR
  ];

  for (const pattern of patterns) {
    if (pattern.test(input)) {
      return { detected: true, severity: 'high' };
    }
  }

  return { detected: false, severity: 'high' };
}

// ============================================================================
// 13. GraphQL 注入
// ============================================================================

/**
 * 检测 GraphQL 注入
 */
export function detectGraphQLInjection(query: string, variables: any): {
  detected: boolean;
  severity: 'medium' | 'high' | 'critical';
  threats: string[];
} {
  const threats: string[] = [];
  let severity: 'medium' | 'high' | 'critical' = 'medium';

  // 检测嵌套查询深度
  const depth = (query.match(/\{/g) || []).length;
  if (depth > 10) {
    threats.push(`Deep nested query: ${depth} levels`);
    severity = 'high';
  }

  // 检测大量字段
  const fields = (query.match(/\w+/g) || []).length;
  if (fields > 100) {
    threats.push(`Excessive fields: ${fields} fields`);
    severity = 'high';
  }

  // 检测 Introspection 查询
  if (/\{\s*__schema|__type/i.test(query)) {
    threats.push('Introspection query detected');
    severity = 'medium';
  }

  // 检测批量查询
  const operations = (query.match(/mutation|query/i) || []).length;
  if (operations > 5) {
    threats.push(`Batch operations: ${operations} operations`);
    severity = 'high';
  }

  // 检测变量中的注入
  if (variables) {
    const varsStr = JSON.stringify(variables);
    if (detectSQLInjection(varsStr)) {
      threats.push('SQL injection in variables');
      severity = 'critical';
    }

    if (detectXSS(varsStr)) {
      threats.push('XSS in variables');
      severity = 'high';
    }
  }

  return {
    detected: threats.length > 0,
    severity,
    threats,
  };
}

// ============================================================================
// 14. NoSQL 注入
// ============================================================================

/**
 * 检测 NoSQL 注入
 */
export function detectNoSQLInjection(input: any): {
  detected: boolean;
  severity: 'medium' | 'high' | 'critical';
  threats: string[];
} {
  const threats: string[] = [];
  let severity: 'medium' | 'high' | 'critical' = 'medium';

  const inputStr = typeof input === 'string' ? input : JSON.stringify(input);

  // NoSQL 操作符
  const noSQLOperators = [
    /\$where/i,
    /\$ne/i,
    /\$gt/i,
    /\$lt/i,
    /\$regex/i,
    /\$or/i,
    /\$and/i,
    /\$not/i,
    /\$exists/i,
    /\$in/i,
    /\$nin/i,
  ];

  for (const pattern of noSQLOperators) {
    if (pattern.test(inputStr)) {
      threats.push(`NoSQL operator: ${pattern.source}`);
      severity = 'high';
    }
  }

  // JavaScript 函数调用
  if (/function\s*\(|this\./i.test(inputStr)) {
    threats.push('JavaScript function call in NoSQL query');
    severity = 'critical';
  }

  // 布尔逻辑
  if (/\$ne:\s*null|\$gt:\s*''|\$regex:\s*true/i.test(inputStr)) {
    threats.push('NoSQL boolean bypass');
    severity = 'high';
  }

  return {
    detected: threats.length > 0,
    severity,
    threats,
  };
}

// ============================================================================
// 15. LDAP 注入
// ============================================================================

/**
 * 检测 LDAP 注入
 */
export function detectLDAPInjection(input: string): {
  detected: boolean;
  severity: 'high' | 'critical';
} {
  const patterns = [
    /\*/i, // 通配符
    /\(/i, // 左括号
    /\)/i, // 右括号
    /\|/i, // OR
    /\&/i, // AND
    /!/i, // NOT
    /=\s*\*/i, // 匹配所有
    /=\s*\(\)/i, // 空集
    /\)\(/i, // 逻辑运算
  ];

  for (const pattern of patterns) {
    if (pattern.test(input)) {
      return { detected: true, severity: 'high' };
    }
  }

  return { detected: false, severity: 'critical' };
}

// ============================================================================
// 16. XML 外部实体 (XXE)
// ============================================================================

/**
 * 检测 XXE 攻击
 */
export function detectXXE(xml: string): {
  detected: boolean;
  severity: 'critical';
} {
  const patterns = [
    /<!DOCTYPE/i,
    /<!ENTITY/i,
    /SYSTEM/i,
    /PUBLIC/i,
    /file:\/\//i,
    /http:\/\//i,
    /https:\/\//i,
    /ftp:\/\//i,
    /gopher:\/\//i,
  ];

  for (const pattern of patterns) {
    if (pattern.test(xml)) {
      return { detected: true, severity: 'critical' };
    }
  }

  return { detected: false, severity: 'critical' };
}

// ============================================================================
// 17. 服务器端请求伪造 (SSRF)
// ============================================================================

/**
 * 检测 SSRF 攻击
 */
export function detectSSRF(url: string): {
  detected: boolean;
  severity: 'medium' | 'high' | 'critical';
  reason: string;
} {
  const urlObj = new URL(url);

  // 检查内网 IP
  const privateIPs = [
    /^127\./, // localhost
    /^10\./, // 10.0.0.0/8
    /^172\.(1[6-9]|2[0-9]|3[0-1])\./, // 172.16.0.0/12
    /^192\.168\./, // 192.168.0.0/16
    /^0\./, // 0.0.0.0/8
  ];

  const hostname = urlObj.hostname;
  for (const pattern of privateIPs) {
    if (pattern.test(hostname)) {
      return {
        detected: true,
        severity: 'critical',
        reason: 'Private IP address',
      };
    }
  }

  // 检查特殊域名
  const specialDomains = [
    'localhost',
    'metadata.google.internal',
    '169.254.169.254', // AWS/GCP metadata
    'metadata.amazonaws.com',
  ];

  if (specialDomains.includes(hostname)) {
    return {
      detected: true,
      severity: 'critical',
      reason: 'Special domain (cloud metadata)',
    };
  }

  // 检查端口
  const dangerousPorts = [22, 23, 25, 53, 3306, 3389, 5432, 6379, 8080, 9200, 27017];
  if (dangerousPorts.includes(parseInt(urlObj.port))) {
    return {
      detected: true,
      severity: 'high',
      reason: 'Dangerous port',
    };
  }

  // 检查协议
  const dangerousProtocols = ['file://', 'ftp://', 'gopher://', 'dict://'];
  if (dangerousProtocols.some(protocol => url.startsWith(protocol))) {
    return {
      detected: true,
      severity: 'high',
      reason: 'Dangerous protocol',
    };
  }

  return {
    detected: false,
    severity: 'critical',
    reason: 'No SSRF detected',
  };
}

// ============================================================================
// 18. 污染攻击
// ============================================================================

/**
 * 检测污染攻击
 */
export function detectPollutionAttack(
  url: string,
  headers: Record<string, string>,
  body?: any
): {
  detected: boolean;
  severity: 'high' | 'critical';
  type: string;
} {
  // URL 参数污染
  const urlParams = new URL(url, 'http://localhost').searchParams;
  const paramCounts = new Map<string, number>();

  for (const [key] of urlParams.entries()) {
    paramCounts.set(key, (paramCounts.get(key) || 0) + 1);
  }

  for (const [key, count] of paramCounts.entries()) {
    if (count > 1) {
      return {
        detected: true,
        severity: 'critical',
        type: 'URL parameter pollution',
      };
    }
  }

  // HTTP 头污染
  const headerCounts = new Map<string, number>();
  for (const key of Object.keys(headers)) {
    const lowerKey = key.toLowerCase();
    headerCounts.set(lowerKey, (headerCounts.get(lowerKey) || 0) + 1);
  }

  for (const [key, count] of headerCounts.entries()) {
    if (count > 1) {
      return {
        detected: true,
        severity: 'critical',
        type: 'HTTP header pollution',
      };
    }
  }

  // JSON 键污染
  if (body && typeof body === 'object') {
    const keys = Object.keys(body);
    const keySet = new Set(keys);

    if (keys.length !== keySet.size) {
      return {
        detected: true,
        severity: 'critical',
        type: 'JSON key pollution',
      };
    }
  }

  return {
    detected: false,
    severity: 'critical',
    type: 'No pollution detected',
  };
}

// ============================================================================
// 19. 原型污染攻击
// ============================================================================

/**
 * 检测原型污染
 */
export function detectPrototypePollution(input: any): {
  detected: boolean;
  severity: 'critical';
} {
  if (typeof input !== 'object' || input === null) {
    return { detected: false, severity: 'critical' };
  }

  const inputStr = JSON.stringify(input);

  // 原型污染关键词
  const pollutionKeywords = [
    '__proto__',
    'constructor.prototype',
    'prototype',
  ];

  for (const keyword of pollutionKeywords) {
    if (inputStr.includes(keyword)) {
      return { detected: true, severity: 'critical' };
    }
  }

  return { detected: false, severity: 'critical' };
}

// ============================================================================
// 导出所有工具
// ============================================================================

export const advancedThreatDefense = {
  detectZeroDayExploit,
  detectSocialEngineeringAttack,
  detectAPIAbuse,
  verifyPackageIntegrity,
  checkMaliciousPackage,
  detectAnomalousUserBehavior,
  detectAPTIndicators,
  detectCryptoMining,
  detectBot,
  detectMaliciousFile,
  sanitizeLogInput,
  detectHTTPSmuggling,
  detectHTTPResponseSplitting,
  detectGraphQLInjection,
  detectNoSQLInjection,
  detectLDAPInjection,
  detectXXE,
  detectSSRF,
  detectPollutionAttack,
  detectPrototypePollution,
};
