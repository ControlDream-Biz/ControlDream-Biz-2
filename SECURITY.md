# 全球顶级安全防护系统

## 概述

本项目集成了企业级的安全防护系统，防御各种常见的和非常规的网络攻击手段。

## 防护能力

### 1. DDoS 攻击防护
- **中间件级速率限制**：全局、API、登录三层限流
- **内存级存储**：快速响应，低延迟
- **IP追踪**：识别恶意IP，支持黑名单
- **智能识别**：检测自动化工具和攻击特征

### 2. SQL 注入防护
- **参数化查询**：强制使用安全查询方式
- **白名单机制**：严格的字段名和表名验证
- **万能密码检测**：识别常见的SQL注入模式
- **深度清理**：移除危险字符和代码片段

### 3. XSS 攻击防护
- **HTML清理**：移除危险的HTML标签和属性
- **特殊字符转义**：防止JavaScript注入
- **CSP支持**：内容安全策略nonce生成和验证
- **深度检测**：多级别XSS模式识别

### 4. CSRF 攻击防护
- **Token生成**：基于crypto的安全令牌
- **恒定时间比较**：防止时序攻击
- **Origin验证**：验证请求来源的合法性
- **Referer检查**：防止跨站伪造

### 5. 暴力破解防护
- **失败次数限制**：可配置的最大尝试次数
- **自动锁定**：达到阈值后自动锁定
- **渐进式延迟**：增加攻击成本
- **IP和用户追踪**：双重防护机制

### 6. 会话安全
- **令牌生成**：强随机会话令牌
- **劫持检测**：IP和User-Agent变化监控
- **超时控制**：自动过期无效会话
- **安全Cookie**：HttpOnly、Secure、SameSite

### 7. 命令注入防护
- **模式识别**：检测危险命令注入
- **字符过滤**：移除危险字符
- **深度分析**：多种注入方式识别

### 8. 路径遍历防护
- **路径验证**：防止访问系统文件
- **编码检测**：识别各种绕过编码
- **白名单限制**：只允许特定路径

## 使用方法

### 基础使用

```typescript
import {
  quickSecurityCheck,
  validateLoginCredentials,
  generateSecureTokens,
  getSecurityHeaders,
} from '@/lib/security';

// 快速安全检查
const result = quickSecurityCheck(userInput);
if (!result.safe) {
  console.error('检测到威胁:', result.threats);
}

// 验证登录
const loginCheck = validateLoginCredentials(username, password);
if (!loginCheck.valid) {
  console.error('登录验证失败:', loginCheck.errors);
}

// 生成安全令牌
const tokens = generateSecureTokens();
// tokens.csrfToken
// tokens.cspNonce
// tokens.sessionToken

// 获取安全响应头
const headers = getSecurityHeaders();
```

### 输入验证

```typescript
import {
  isValidEmail,
  isValidPhone,
  checkPasswordStrength,
  validateObject,
} from '@/lib/security';

// 验证邮箱
if (!isValidEmail(email)) {
  throw new Error('邮箱格式无效');
}

// 检查密码强度
const strength = checkPasswordStrength(password);
if (strength.strength === 'weak') {
  console.warn('密码太弱:', strength.suggestions);
}

// 批量验证对象
const validation = validateObject(userData, {
  username: isValidUsername,
  email: isValidEmail,
  age: (val) => validateNumberRange(val, 18, 120),
});
```

### SQL 查询防护

```typescript
import { buildSafeQuery, sqlDefense } from '@/lib/security';

// 构建安全查询
const query = buildSafeQuery('users', ['id', 'name', 'email'], {
  filters: { name: 'John' },
  orderBy: { column: 'name', ascending: true },
  limit: 10,
});

if (!query.valid) {
  throw new Error(query.error);
}

// 执行安全查询
// 使用 query.query 构建查询
```

### 登录安全

```typescript
import {
  loginDefense,
  recordFailedAttempt,
  isLockedOut,
  clearFailedAttempt,
} from '@/lib/security';

// 验证登录
const check = isLockedOut(username, ipAddress);
if (check.locked) {
  return { error: check.reason };
}

// 执行登录验证
// ...

// 记录失败
recordFailedAttempt(username, ipAddress, userAgent);

// 清除失败记录（成功登录后）
clearFailedAttempt(username);
```

### CSRF 保护

```typescript
import { generateCSRFToken, validateCSRFToken } from '@/lib/security';

// 生成Token
const token = generateCSRFToken();
// 存储到session或cookie

// 验证Token
const valid = validateCSRFToken(providedToken, storedToken);
if (!valid.valid) {
  throw new Error('CSRF token无效');
}
```

### XSS 防护

```typescript
import { sanitizeHTML, escapeHTML, stripAllHTML } from '@/lib/security';

// 清理HTML
const cleanHTML = sanitizeHTML(userContent);

// 转义HTML
const escaped = escapeHTML(userInput);

// 移除所有HTML
const plainText = stripAllHTML(richContent);
```

### 安全日志

```typescript
import {
  logSecurityEvent,
  getSecurityStats,
  getSecurityAlerts,
  generateSecurityReport,
} from '@/lib/security';

// 记录安全事件
const eventId = logSecurityEvent({
  type: SecurityEventType.SQL_INJECTION,
  severity: SecuritySeverity.CRITICAL,
  ip: request.ip,
  userAgent: request.headers['user-agent'],
  url: request.url,
  method: request.method,
  details: { payload: suspiciousInput },
});

// 获取安全统计
const stats = getSecurityStats(24); // 最近24小时

// 获取安全警报
const alerts = getSecurityAlerts();

// 生成安全报告
const report = generateSecurityReport(24);
console.log(report);
```

## 配置

### 环境变量

```env
# 域名配置
NEXT_PUBLIC_DOMAIN=https://yourdomain.com

# 安全配置（可选）
SECURITY_RATE_LIMIT_ENABLED=true
SECURITY_BLACKLIST_ENABLED=true
SECURITY_LOG_ENABLED=true
```

### 自定义配置

```typescript
import { SECURITY_CONFIG } from '@/lib/security';

// 修改速率限制
SECURITY_CONFIG.RATE_LIMIT.LOGIN.limit = 3;
SECURITY_CONFIG.RATE_LIMIT.LOGIN.window = 60000;

// 添加黑名单IP
SECURITY_CONFIG.BLACKLISTED_IPS.push('192.168.1.100');

// 添加允许的来源
SECURITY_CONFIG.ALLOWED_ORIGINS.push('https://app.yourdomain.com');
```

## 安全报告示例

```
╔═══════════════════════════════════════════════════════════════╗
║                    安全报告                                   ║
║  时间范围: 最近24小时                                          ║
╚═══════════════════════════════════════════════════════════════╝

📊 总体统计
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  总事件数: 127
  活跃威胁: 3

📈 事件类型分布
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  SQL_INJECTION: 2
  XSS_ATTACK: 5
  FAILED_LOGIN: 98
  RATE_LIMIT_EXCEEDED: 22

⚠️ 严重程度分布
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Critical: 2
  High: 8
  Medium: 15
  Low: 102

🎯 高危IP排名
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  1. 192.168.1.100 (45次, 威胁等级: critical)
  2. 10.0.0.50 (32次, 威胁等级: high)
  3. 172.16.0.20 (18次, 威胁等级: medium)

🚨 未解决警报
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Critical: 2 个
  High: 8 个
  Medium: 15 个
```

## 最佳实践

1. **始终验证用户输入**：使用提供的验证函数
2. **使用参数化查询**：不要拼接SQL语句
3. **启用速率限制**：防止暴力破解和DDoS
4. **定期审查安全日志**：及时发现异常
5. **保持依赖更新**：修复已知漏洞
6. **使用HTTPS**：确保数据传输安全
7. **实施最小权限原则**：限制用户访问
8. **定期备份**：防止数据丢失

## 技术架构

```
┌─────────────────────────────────────────────────────────┐
│                    安全防护层级                          │
├─────────────────────────────────────────────────────────┤
│  1. 中间件层 (middleware.ts)                            │
│     - DDoS防护                                          │
│     - 速率限制                                          │
│     - 恶意请求检测                                      │
│     - 安全响应头                                        │
├─────────────────────────────────────────────────────────┤
│  2. 输入验证层 (input-validator.ts)                     │
│     - SQL注入检测                                       │
│     - XSS检测                                           │
│     - 命令注入检测                                      │
│     - 路径遍历检测                                      │
├─────────────────────────────────────────────────────────┤
│  3. 业务逻辑层 (login-defense.ts, sql-injection-defense.ts) │
│     - 万能密码防护                                      │
│     - 暴力破解防护                                      │
│     - 会话安全                                          │
│     - 查询安全                                          │
├─────────────────────────────────────────────────────────┤
│  4. 应用层 (csrf-xss-defense.ts)                        │
│     - CSRF Token                                        │
│     - XSS清理                                           │
│     - CSP支持                                           │
│     - Cookie安全                                        │
├─────────────────────────────────────────────────────────┤
│  5. 监控层 (security-logger.ts)                         │
│     - 安全事件记录                                      │
│     - 威胁评分                                          │
│     - 统计分析                                          │
│     - 报警生成                                          │
└─────────────────────────────────────────────────────────┘
```

## 维护和监控

### 定期任务

1. **每日**：检查安全报告和警报
2. **每周**：审查高危IP和攻击模式
3. **每月**：清理旧事件和降低IP评分
4. **每季度**：安全审计和渗透测试

### 应急响应

当检测到严重安全事件时：

1. 立即记录事件详情
2. 识别受影响的系统
3. 隔离威胁来源（IP黑名单）
4. 通知安全团队
5. 实施临时防护措施
6. 根本原因分析
7. 修复漏洞
8. 更新安全策略

## 许可证

本安全系统作为项目的一部分，遵循项目许可证。

## 联系方式

如有安全问题，请联系安全团队。
