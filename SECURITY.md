# 安全配置和保护指南

## 概述

本系统实施了多层安全保护措施，包括：
- 代码混淆和压缩
- 域名授权验证
- 源码保护
- 运行时安全检查
- 防盗版检测

## 安全特性

### 1. 代码混淆

**配置文件**: `next.config.ts`

生产环境自动启用 Terser 代码混淆：
- 函数名、类名混淆
- 删除注释和空格
- 删除所有 console 输出
- 删除死代码
- 多次压缩确保最大化混淆

**效果**:
```javascript
// 混淆前
function calculateTotal(price, quantity) {
  return price * quantity;
}

// 混淆后
var o=function(e,t){return e*t};
```

### 2. 域名授权

**配置文件**: `src/lib/security/protection.ts`

授权域名验证机制：
- 精确匹配域名列表
- 正则表达式模式匹配
- 开发环境自动放行（localhost）

**配置环境变量** (.env):
```bash
NEXT_PUBLIC_AUTHORIZED_DOMAIN=chuangmeng.com,www.chuangmeng.com
```

**添加新域名**:
编辑 `src/lib/security/protection.ts`:
```typescript
const AUTHORIZED_DOMAINS = [
  'your-domain.com',
  'another-domain.com',
];
```

### 3. 源码保护

**已实施的保护措施**:
- ✅ 禁用 Source Maps (`productionBrowserSourceMaps: false`)
- ✅ 移除所有 console 输出
- ✅ 代码混淆和压缩
- ✅ 删除注释
- ✅ 模块ID确定化

**验证**:
```bash
# 构建生产版本
pnpm build

# 检查是否有 .map 文件
ls -la .next/static/chunks/*.map
# 应该没有任何 .map 文件

# 检查生成的代码
cat .next/static/chunks/*.js | head -50
# 应该看到混淆后的代码
```

### 4. 安全响应头

**配置文件**: `next.config.ts` - `headers()` 函数

已配置的安全头部：
- `X-Frame-Options: DENY` - 防止点击劫持
- `X-Content-Type-Options: nosniff` - 防止MIME嗅探
- `X-XSS-Protection: 1; mode=block` - XSS防护
- `Strict-Transport-Security` - HTTPS强制
- `Content-Security-Policy` - 内容安全策略
- `Referrer-Policy` - 引用策略
- `Permissions-Policy` - 权限策略

**验证**:
```bash
curl -I https://your-domain.com
# 查看响应头是否包含上述安全头部
```

### 5. 运行时保护

**配置文件**: `src/lib/security/protection.ts`

检测机制：
- 域名授权验证
- iframe 嵌套检测
- 开发者工具检测
- 代码完整性校验

**未授权域名行为**:
- 显示全屏安全警告
- 阻止应用运行
- 记录安全事件

## 部署安全检查清单

### 部署前检查

- [ ] 设置正确的 `NEXT_PUBLIC_AUTHORIZED_DOMAIN`
- [ ] 设置应用版本号 `NEXT_PUBLIC_APP_VERSION`
- [ ] 添加所有授权域名到列表
- [ ] 确认 `NODE_ENV=production`
- [ ] 运行 `pnpm build` 生成生产版本
- [ ] 验证没有 .map 文件生成
- [ ] 验证代码已混淆

### 部署后验证

```bash
# 1. 检查安全响应头
curl -I https://your-domain.com

# 2. 检查是否有源码映射
curl https://your-domain.com/_next/static/chunks/*.js | grep sourceMappingURL

# 3. 检查代码是否混淆
curl https://your-domain.com/_next/static/chunks/main-*.js | head -20

# 4. 检查域名授权
# 在未授权域名访问应显示安全警告
```

### 测试安全功能

#### 1. 测试域名授权
```bash
# 在授权域名访问
curl https://authorized-domain.com
# 应该正常显示

# 在未授权域名访问（如果有测试环境）
curl https://unauthorized-domain.com
# 应该显示安全警告
```

#### 2. 测试 Source Maps 保护
```bash
# 尝试访问 Source Maps
curl https://your-domain.com/_next/static/chunks/main-*.js.map
# 应该返回 404 Not Found
```

#### 3. 测试代码混淆
```bash
# 检查生成的代码
curl https://your-domain.com/_next/static/chunks/main-*.js
# 应该看到混淆后的代码，没有函数名和注释
```

#### 4. 测试安全响应头
```bash
curl -I https://your-domain.com | grep -E 'X-|Content-Security-Policy'
# 应该看到所有安全头部
```

## 常见问题

### Q1: 如何添加新的授权域名？

编辑 `.env` 文件：
```bash
NEXT_PUBLIC_AUTHORIZED_DOMAIN=domain1.com,domain2.com,domain3.com
```

或者编辑 `src/lib/security/protection.ts`：
```typescript
const AUTHORIZED_DOMAINS = [
  'domain1.com',
  'domain2.com',
  'domain3.com',
];
```

### Q2: 开发环境会触发安全检查吗？

不会。开发环境（`NODE_ENV=development`）会自动跳过安全检查。

### Q3: 如何临时禁用安全检查？

仅建议用于测试，生产环境不应禁用：

编辑 `src/lib/security/protection.ts`:
```typescript
export function runSecurityChecks(): boolean {
  if (process.env.NODE_ENV === 'development') {
    return true;
  }

  // 添加临时禁用
  if (process.env.NEXT_PUBLIC_DISABLE_SECURITY === 'true') {
    return true;
  }

  // ... 其他检查
}
```

设置环境变量：
```bash
NEXT_PUBLIC_DISABLE_SECURITY=true
```

### Q4: 如何更新应用版本？

修改 `.env` 文件：
```bash
NEXT_PUBLIC_APP_VERSION=1.0.1
```

或修改 `src/lib/security/protection.ts`:
```typescript
const COPYRIGHT_INFO = {
  company: 'Chuangmeng Computer System Co., Ltd.',
  year: new Date().getFullYear(),
  version: '1.0.1',
};
```

### Q5: 代码混淆会影响性能吗？

不会。代码混淆在构建时完成，不会影响运行时性能。反而由于：
- 删除了注释和空格
- 删除了死代码
- 优化了代码结构

可能略微提升性能。

## 高级安全配置

### 1. 代码签名（可选）

可以考虑添加代码签名来验证代码完整性：

```typescript
// src/lib/security/integrity.ts
const EXPECTED_HASH = 'abc123...'; // 期望的代码哈希

export function verifyCodeIntegrity(): boolean {
  const actualHash = calculateCodeHash();
  return actualHash === EXPECTED_HASH;
}
```

### 2. 实时授权验证（可选）

可以添加实时API验证域名授权：

```typescript
export async function verifyDomainLicense(domain: string): Promise<boolean> {
  const response = await fetch('/api/verify-license', {
    method: 'POST',
    body: JSON.stringify({ domain }),
  });
  const result = await response.json();
  return result.authorized;
}
```

### 3. 加密关键数据（可选）

对于敏感配置，可以使用环境变量加密：

```typescript
const encrypted = process.env.ENCRYPTED_CONFIG;
const decrypted = decrypt(encrypted, SECRET_KEY);
```

## 安全最佳实践

1. **定期更新依赖**: `pnpm update --latest`
2. **定期安全审计**: `pnpm audit`
3. **使用强密码**: 数据库、API密钥等
4. **启用 HTTPS**: 配置 SSL 证书
5. **监控异常日志**: 记录安全事件
6. **定期备份**: 防止数据丢失
7. **限制访问**: IP 白名单、防火墙
8. **最小权限原则**: 只授予必要的权限

## 安全监控

查看安全日志：
```bash
# 查看安全事件
grep 'SECURITY' /app/work/logs/bypass/app.log

# 查看未授权访问
grep 'unauthorized' /app/work/logs/bypass/app.log
```

## 参考资料

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security](https://nextjs.org/docs/app/building-your-application/configuring/security)
- [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [HTTP Strict Transport Security](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security)

## 联系支持

如遇到安全问题，请联系：
- 邮箱：security@chuangmeng.com
- 电话：400-888-8888
