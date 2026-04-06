/**
 * WAF 规则库（Web Application Firewall）
 * 支持可配置的攻击防护规则，定期更新以应对新型攻击
 *
 * 规则分类：
 * 1. SQL 注入检测
 * 2. XSS 攻击检测
 * 3. CSRF 攻击检测
 * 4. 路径遍历检测
 * 5. 命令注入检测
 * 6. 恶意 User-Agent 检测
 * 7. 速率限制规则
 * 8. IP 黑名单规则
 */

export interface WAFFeature {
  name: string;
  category: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  patterns: RegExp[];
  actions: 'block' | 'log' | 'warn';
}

export interface WAFConfig {
  enabled: boolean;
  features: WAFFeature[];
  rateLimit: {
    enabled: boolean;
    requestsPerMinute: number;
    requestsPerHour: number;
    whitelist: string[];
    blacklist: string[];
  };
  ipBlacklist: string[];
  suspiciousUserAgents: RegExp[];
  logRequests: boolean;
  blockThreshold: number; // 连续失败次数阈值
}

// ============ SQL 注入规则 ============
const SQL_INJECTION_RULES: WAFFeature = {
  name: 'SQL Injection Detection',
  category: 'SQL Injection',
  severity: 'critical',
  description: '检测 SQL 注入攻击',
  patterns: [
    // 基础 SQL 注入
    /union\s+select/i,
    /union\s+all\s+select/i,
    /select\s+.*\s+from/i,
    /insert\s+into/i,
    /update\s+.*\s+set/i,
    /delete\s+from/i,
    /drop\s+table/i,
    /drop\s+database/i,
    /create\s+table/i,
    /alter\s+table/i,
    /truncate\s+table/i,

    // 布尔型盲注
    /'or'1'='1/i,
    /"or"1"="1/i,
    /'or\s+1=1/i,
    /"or\s+1=1/i,
    /'or\s+1\s*=\s*1--/i,
    /"or\s+1\s*=\s*1--/i,

    // 时间型盲注
    /waitfor\s+delay/i,
    /sleep\(/i,
    /benchmark\(/i,

    // 堆叠查询
    /;\s*drop/i,
    /;\s*delete/i,
    /;\s*insert/i,
    /;\s*update/i,

    // 错误注入
    /and\s+1\s*=\s*2/i,
    /and\s+1\s*=\s*1/i,

    // 编码绕过
    /%27%20or%20/i,
    /%22%20or%20/i,
    /%2527%20or%20/i,

    // 注释注入
    /--\s*$|\/\*.*\*\//i,
    /#\s*$/i,

    // 其他常见注入
    /0x[0-9a-f]+/i,
    /char\(/i,
    /unhex\(/i,
    /load_file\(/i,
    /into\s+outfile/i,
  ],
  actions: 'block',
};

// ============ XSS 攻击规则 ============
const XSS_RULES: WAFFeature = {
  name: 'XSS Attack Detection',
  category: 'XSS',
  severity: 'high',
  description: '检测跨站脚本攻击',
  patterns: [
    // Script 标签
    /<script[^>]*>.*?<\/script>/gi,
    /<script[^>]*>/gi,
    /<\/script>/gi,
    /<script>/gi,

    // 事件处理器
    /onerror\s*=/gi,
    /onload\s*=/gi,
    /onmouseover\s*=/gi,
    /onfocus\s*=/gi,
    /onblur\s*=/gi,
    /onclick\s*=/gi,
    /ondblclick\s*=/gi,
    /onmousedown\s*=/gi,
    /onmouseup\s*=/gi,
    /onmouseenter\s*=/gi,
    /onmouseleave\s*=/gi,
    /onmousemove\s*=/gi,
    /onmouseout\s*=/gi,
    /onkeydown\s*=/gi,
    /onkeyup\s*=/gi,
    /onkeypress\s*=/gi,
    /onsubmit\s*=/gi,
    /onreset\s*=/gi,
    /onchange\s*=/gi,
    /onselect\s*=/gi,
    /oninput\s*=/gi,

    // JavaScript 伪协议
    /javascript:/gi,
    /data:.*text\/html/gi,

    // 危险函数
    /eval\s*\(/gi,
    /alert\s*\(/gi,
    /confirm\s*\(/gi,
    /prompt\s*\(/gi,
    /document\./gi,
    /window\./gi,
    /location\./gi,
    /navigator\./gi,

    // HTML 实体编码
    /&#x[0-9a-f]+;/gi,
    /&#[0-9]+;/gi,

    // SVG 注入
    /<svg[^>]*>.*?<\/svg>/gi,
    /<svg[^>]*>/gi,

    // Iframe 注入
    /<iframe[^>]*>.*?<\/iframe>/gi,
    /<iframe[^>]*>/gi,

    // Object 注入
    /<object[^>]*>.*?<\/object>/gi,
    /<embed[^>]*>.*?<\/embed>/gi,

    // CSS 表达式
    /expression\s*\(/gi,
    /@import\s+/gi,

    // 其他
    /fromCharCode\s*\(/gi,
    /innerHTML\s*=/gi,
    /outerHTML\s*=/gi,
  ],
  actions: 'block',
};

// ============ CSRF 攻击规则 ============
const CSRF_RULES: WAFFeature = {
  name: 'CSRF Attack Detection',
  category: 'CSRF',
  severity: 'medium',
  description: '检测跨站请求伪造攻击',
  patterns: [
    // 检测缺少 Referer 的敏感请求
    // 注：这个需要在路由层面检查，这里仅列出特征
  ],
  actions: 'log',
};

// ============ 路径遍历规则 ============
const PATH_TRAVERSAL_RULES: WAFFeature = {
  name: 'Path Traversal Detection',
  category: 'Path Traversal',
  severity: 'high',
  description: '检测路径遍历攻击',
  patterns: [
    /\.\.\//,
    /\.\.\\/,
    /%2e%2e%2f/i,
    /%2e%2e%5c/i,
    /%252e%252e%252f/i,
    /\.\.%2f/i,
    /\.\.%5c/i,
    /%c0%ae%c0%ae%c0%af/i,
    /%c0%ae%c0%ae%c0%5c/i,
    /..%00/i,
    /%00/i,
    // Windows 路径遍历
    /C:\\/,
    /D:\\/,
    /E:\\/,
    // 任意文件读取
    /\/etc\//i,
    /\/proc\//i,
    /\/sys\//i,
    /\/root\//i,
    /\/home\//i,
    /C:\\Windows\\/i,
    /C:\\Users\\/i,
  ],
  actions: 'block',
};

// ============ 命令注入规则 ============
const COMMAND_INJECTION_RULES: WAFFeature = {
  name: 'Command Injection Detection',
  category: 'Command Injection',
  severity: 'critical',
  description: '检测命令注入攻击',
  patterns: [
    /;\s*rm\s+/i,
    /;\s*cat\s+/i,
    /;\s*ls\s+/i,
    /;\s*cd\s+/i,
    /;\s*mv\s+/i,
    /;\s*cp\s+/i,
    /;\s*mkdir\s+/i,
    /;\s*chmod\s+/i,
    /;\s*chown\s+/i,
    /;\s*kill\s+/i,
    /;\s*ps\s+/i,
    /;\s*netstat/i,
    /;\s*whoami/i,
    /;\s*id/i,
    /;\s*pwd/i,
    /&&\s*rm/i,
    /&&\s*cat/i,
    /&&\s*ls/i,
    /\|\s*nc\s+/i,
    /\|\s*cat\s+/i,
    /\|\s*ls\s+/i,
    /\|\s*sh/i,
    /\|\s*bash/i,
    /\|\s*python/i,
    /\|\s*perl/i,
    /\|\s*php/i,
    /\|\s*node/i,
    /\|\s*npm/i,
    /\|\s*wget/i,
    /\|\s*curl/i,
    /\`.*\`/,
    /\$\(.*\)/,
    />\s*\/\//i,
    />\s*\/etc\//i,
    />\s*\/proc\//i,
    // Windows 命令
    /&\s*del/i,
    /&\s*type/i,
    /&\s*dir/i,
    /&\s*cd/i,
    /&\s*move/i,
    /&\s*copy/i,
    /&\s*rd/i,
    /&\s*md/i,
    /&\s*cls/i,
    /&\s*taskkill/i,
  ],
  actions: 'block',
};

// ============ 恶意 User-Agent 规则 ============
const MALICIOUS_USER_AGENTS = [
  // 扫描器
  /sqlmap/i,
  /nmap/i,
  /nikto/i,
  /burpsuite/i,
  /metasploit/i,
  /acunetix/i,
  /nessus/i,
  /openvas/i,
  /zap/i,
  /w3af/i,
  /arachni/i,
  /havij/i,
  /pangolin/i,
  /absinthe/i,
  /bbqsql/i,
  /blindbird/i,
  /commix/i,
  /dss/i,
  /exploit/i,
  /havij/i,
  /jbrofuzz/i,
  /marco/i,
  /nbsi/i,
  /pangolin/i,
  /putty/i,
  /sqlbrute/i,
  /sqlmap/i,
  /sqlninja/i,
  /sqlsus/i,
  /the mole/i,
  /ua-tester/i,
  /webgoat/i,
  /webtrends/i,
  /whatweb/i,
  /wpscan/i,
  /xsser/i,

  // 爬虫
  /scrapy/i,
  /python-requests/i,
  /python-urllib/i,
  /curl/i,
  /wget/i,
  /libwww/i,
  /java/i,
  /perl/i,
  /ruby/i,
  /php/i,
  /go-http-client/i,
  /node-fetch/i,
  /axios/i,

  // 自动化工具
  /selenium/i,
  /headless/i,
  /phantom/i,
  /puppeteer/i,
  /playwright/i,
  /cheerio/i,
  /jsdom/i,

  // 恶意行为
  /attack/i,
  /exploit/i,
  /hack/i,
  /crack/i,
  /vuln/i,
  /inject/i,
];

// ============ 默认 WAF 配置 ============
export const DEFAULT_WAF_CONFIG: WAFConfig = {
  enabled: true,
  features: [
    SQL_INJECTION_RULES,
    XSS_RULES,
    CSRF_RULES,
    PATH_TRAVERSAL_RULES,
    COMMAND_INJECTION_RULES,
  ],
  rateLimit: {
    enabled: true,
    requestsPerMinute: 60,
    requestsPerHour: 1000,
    whitelist: [],
    blacklist: [],
  },
  ipBlacklist: [],
  suspiciousUserAgents: MALICIOUS_USER_AGENTS,
  logRequests: true,
  blockThreshold: 10, // 连续失败10次后封禁
};

// ============ 规则更新日志 ============
export const WAF_UPDATE_LOG = [
  {
    version: '1.0.0',
    date: '2024-01-01',
    changes: [
      '初始化 WAF 规则库',
      '添加 SQL 注入检测规则',
      '添加 XSS 攻击检测规则',
      '添加路径遍历检测规则',
      '添加命令注入检测规则',
      '添加恶意 User-Agent 检测',
      '添加速率限制功能',
    ],
  },
  {
    version: '1.1.0',
    date: '2024-02-01',
    changes: [
      '增强 SQL 注入检测规则',
      '添加编码绕过检测',
      '添加时间型盲注检测',
      '添加堆叠查询检测',
    ],
  },
  {
    version: '1.2.0',
    date: '2024-03-01',
    changes: [
      '增强 XSS 攻击检测规则',
      '添加 SVG 注入检测',
      '添加 Iframe 注入检测',
      '添加 CSS 表达式检测',
    ],
  },
];

/**
 * 检查请求是否匹配 WAF 规则
 * @param input 输入内容（URL、请求体、Header 等）
 * @param config WAF 配置
 * @returns 匹配的规则列表
 */
export function checkWAFRules(input: string, config: WAFConfig = DEFAULT_WAF_CONFIG): WAFFeature[] {
  const matched: WAFFeature[] = [];

  if (!config.enabled) {
    return matched;
  }

  for (const feature of config.features) {
    for (const pattern of feature.patterns) {
      if (pattern.test(input)) {
        matched.push(feature);
        break; // 一个规则只匹配一次
      }
    }
  }

  return matched;
}

/**
 * 检查 User-Agent 是否可疑
 * @param userAgent User-Agent 字符串
 * @param config WAF 配置
 * @returns 是否可疑
 */
export function checkSuspiciousUserAgent(
  userAgent: string,
  config: WAFConfig = DEFAULT_WAF_CONFIG
): boolean {
  if (!config.enabled) {
    return false;
  }

  for (const pattern of config.suspiciousUserAgents) {
    if (pattern.test(userAgent)) {
      return true;
    }
  }

  return false;
}

/**
 * 检查 IP 是否在黑名单中
 * @param ip IP 地址
 * @param config WAF 配置
 * @returns 是否在黑名单中
 */
export function isIPBlacklisted(ip: string, config: WAFConfig = DEFAULT_WAF_CONFIG): boolean {
  if (!config.enabled) {
    return false;
  }

  return config.ipBlacklist.includes(ip) || config.rateLimit.blacklist.includes(ip);
}

/**
 * 检查 IP 是否在白名单中
 * @param ip IP 地址
 * @param config WAF 配置
 * @returns 是否在白名单中
 */
export function isIPWhitelisted(ip: string, config: WAFConfig = DEFAULT_WAF_CONFIG): boolean {
  if (!config.enabled) {
    return false;
  }

  return config.rateLimit.whitelist.includes(ip);
}

/**
 * 获取 WAF 统计信息
 * @param config WAF 配置
 * @returns 统计信息
 */
export function getWAFStats(config: WAFConfig = DEFAULT_WAF_CONFIG) {
  return {
    enabled: config.enabled,
    featureCount: config.features.length,
    ruleCount: config.features.reduce((sum, f) => sum + f.patterns.length, 0),
    ipBlacklistCount: config.ipBlacklist.length,
    userAgentPatternsCount: config.suspiciousUserAgents.length,
    rateLimitEnabled: config.rateLimit.enabled,
  };
}
