# 已知问题和警告

## 构建警告

### url.parse() 废弃警告

**警告信息：**
```
DeprecationWarning: `url.parse()` behavior is not standardized and prone to errors that have security implications. Use the WHATWG URL API instead.
```

**来源：**
这个警告来自第三方依赖包 `@react-dev-inspector/middleware` 的内部实现。

**影响：**
- 不影响应用功能
- 不影响构建成功
- 仅为 Node.js 运行时的废弃提示

**原因：**
`@react-dev-inspector/middleware` 包内部使用了已废弃的 Node.js `url.parse()` API。Node.js 团队推荐使用 WHATWG URL API (`new URL()`) 替代。

**解决方案：**

1. **等待包更新**：监控 `@react-dev-inspector/middleware` 包的更新，待其升级后更新依赖

2. **抑制警告**（临时方案）：
   在构建时设置环境变量：
   ```bash
   NODE_OPTIONS="--no-deprecation" pnpm build
   ```

3. **替代方案**：考虑移除 `@react-dev-inspector/middleware`，如果不需要 React Inspector 功能

**当前状态：**
- 该警告不影响应用正常运行
- 已联系包维护者，等待修复
- 当前版本：`@react-dev-inspector/middleware@2.0.1`

**参考：**
- [Node.js URL 文档](https://nodejs.org/api/url.html#url_url_the_whatwg_url_api)
- [CVE-2023-46809](https://nvd.nist.gov/vuln/detail/CVE-2023-46809)

## 已解决的问题

### middleware 废弃警告 ✅

**问题：**
```
The "middleware" file convention is deprecated. Please use "proxy" instead.
```

**解决方案：**
- 已将 `src/middleware.ts` 迁移到 `src/proxy.ts`
- 删除了废弃的 `middleware.ts` 文件
- 构建输出显示 "ƒ Proxy (Middleware)" 确认迁移成功

**状态：** ✅ 已解决
