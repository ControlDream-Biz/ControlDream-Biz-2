# 项目上下文

### 版本技术栈

- **Framework**: Next.js 16 (App Router)
- **Core**: React 19
- **Language**: TypeScript 5
- **UI 组件**: shadcn/ui (基于 Radix UI)
- **Styling**: Tailwind CSS 4

## 目录结构

```
├── public/                 # 静态资源
├── scripts/                # 构建与启动脚本
│   ├── build.sh            # 构建脚本
│   ├── dev.sh              # 开发环境启动脚本
│   ├── prepare.sh          # 预处理脚本
│   └── start.sh            # 生产环境启动脚本
├── src/
│   ├── app/                # 页面路由与布局
│   │   ├── api/            # API 路由
│   │   │   ├── chat/       # 智能客服 API
│   │   │   ├── analytics/  # 数据分析 API
│   │   │   └── admin/      # 后台管理 API
│   │   ├── admin/          # 后台管理页面
│   │   └── globals.css     # 全局样式与动画
│   ├── components/ui/      # Shadcn UI 组件库
│   ├── components/         # 自定义组件
│   │   ├── LiveChat.tsx    # 智能客服组件
│   │   ├── LanguageSwitcher.tsx  # 语言切换组件
│   │   └── OptimizedImage.tsx    # 优化图片组件
│   ├── contexts/           # React Context
│   │   └── LanguageContext.tsx   # 语言切换上下文
│   ├── hooks/              # 自定义 Hooks
│   ├── lib/                # 工具库
│   │   ├── i18n/           # 国际化
│   │   ├── db/             # 数据库连接与查询
│   │   └── animations/     # 动画工具库
│   └── server.ts           # 自定义服务端入口
├── next.config.ts          # Next.js 配置
├── package.json            # 项目依赖管理
└── tsconfig.json           # TypeScript 配置
```

- 项目文件（如 app 目录、pages 目录、components 等）默认初始化到 `src/` 目录下。

## 包管理规范

**仅允许使用 pnpm** 作为包管理器，**严禁使用 npm 或 yarn**。
**常用命令**：
- 安装依赖：`pnpm add <package>`
- 安装开发依赖：`pnpm add -D <package>`
- 安装所有依赖：`pnpm install`
- 移除依赖：`pnpm remove <package>`

## 开发规范

- **项目理解加速**：初始可以依赖项目下`package.json`文件理解项目类型，如果没有或无法理解退化成阅读其他文件。
- **Hydration 错误预防**：严禁在 JSX 渲染逻辑中直接使用 typeof window、Date.now()、Math.random() 等动态数据。必须使用 'use client' 并配合 useEffect + useState 确保动态内容仅在客户端挂载后渲染；同时严禁非法 HTML 嵌套（如 <p> 嵌套 <div>）。


## UI 设计与组件规范 (UI & Styling Standards)

- 模板默认预装核心组件库 `shadcn/ui`，位于`src/components/ui/`目录下
- Next.js 项目**必须默认**采用 shadcn/ui 组件、风格和规范，**除非用户指定用其他的组件和规范。**

## 智能客服系统 (AI Chatbot)

### 功能概述
- 集成 Kimi K2.5 (kimi-k2-5-260127) 大模型提供智能客服
- 支持流式输出（SSE），模拟真人打字效果
- 每次对话分配随机工号（CS-XXXX 格式）
- 支持中英文双语对话

### 核心文件
- **前端组件**: `src/components/LiveChat.tsx` - 客服聊天窗口组件
- **API 路由**: `src/app/api/chat/route.ts` - AI 客服接口
- **后台管理**: `src/app/admin/chat/page.tsx` - 客服管理后台
- **管理 API**: `src/app/api/admin/chat/route.ts` - 后台管理接口

### 大模型配置
- **模型**: kimi-k2-5-260127 (Kimi K2.5)
- **流式输出**: 启用，提供实时打字效果
- **系统提示词**: 优化为企业客服角色，要求详细完整回答

### 人工接管功能
- 支持人工客服接管 AI 对话
- 后台可查看所有对话记录
- 支持发送人工消息和释放接管

### 使用说明
1. 访问 `/admin/chat` 进入后台管理页面
2. 点击对话列表查看对话详情
3. 点击"接管对话"进入人工客服模式
4. 输入消息回复用户
5. 点击"释放接管"交还给 AI 客服

## 多语言支持 (i18n)

### 支持语言
- 中文
- English (英语)
- 日本語 (日语)
- 한국어 (韩语)
- Français (法语)
- Deutsch (德语)
- Español (西班牙语)

### 核心文件
- **语言上下文**: `src/contexts/LanguageContext.tsx` - 提供语言切换状态管理
- **切换组件**: `src/components/LanguageSwitcher.tsx` - 下拉式语言切换器
- **翻译配置**: `src/lib/i18n/translations.ts` - 多语言翻译文本（307个翻译键，7种语言完整翻译）

### 使用说明
1. 使用 `LanguageSwitcher` 组件在页面中添加语言切换功能
2. 通过 `useLanguage` Hook 获取当前语言和切换函数
3. 在组件中使用 `t(key)` 获取翻译文本

### Analytics 集成
- **访客追踪**: LanguageContext 中自动追踪首次访客信息
- **页面浏览**: 使用 `usePageTracking` Hook 追踪页面访问
- **自定义事件**: 使用 `useEventTracking` Hook 追踪用户交互事件
- **核心文件**: `src/hooks/useAnalytics.ts`

## 数据库集成

### 数据库类型
- **主数据库**: PostgreSQL (通过环境变量 `DATABASE_URL` 配置)
- **备选方案**: 内存模式（未配置数据库连接时自动启用）

### 核心文件
- **Schema**: `src/lib/db/schema.ts` - 数据库表结构定义
- **连接**: `src/lib/db/index.ts` - 数据库连接配置
- **查询**: `src/lib/db/queries.ts` - CRUD 操作函数

### 数据表
- **conversations**: 对话记录
- **messages**: 消息记录
- **visitors**: 访客信息
- **pageViews**: 页面访问记录

## 数据分析功能

### 功能概述
- 访客统计（总数、最近30天）
- 页面浏览统计
- 语言分布分析
- 对话数量统计

### 核心文件
- **API 路由**: `src/app/api/analytics/route.ts` - 数据分析接口
- **查询函数**: `src/lib/db/queries.ts` 中的 `getAnalytics()`

### 使用说明
1. GET `/api/analytics` - 获取统计数据
2. POST `/api/analytics` - 记录访客和页面浏览数据
   - `action: 'track_visitor'` - 追踪访客
   - `action: 'track_page_view'` - 追踪页面浏览

## 性能优化

### 移动端优化
- **图片懒加载**: 使用 `OptimizedImage` 组件实现基于 IntersectionObserver 的懒加载
- **代码分割**: Webpack 配置自动分割 vendor 和 common 代码
- **图片格式**: 优先使用 AVIF 和 WebP 格式
- **响应式图片**: 根据设备尺寸自动调整图片大小

### 核心文件
- **优化配置**: `next.config.ts` - Webpack 和性能优化配置
- **优化组件**: `src/components/OptimizedImage.tsx` - 图片懒加载组件

### 生产环境优化
- 移除 console.log
- 启用 Gzip 压缩
- 优化包导入 (lucide-react, @radix-ui/react-icons)
- 滚动位置恢复

### 资源优化
- **图片优化**: 删除冗余Logo文件（节省7.3MB空间）
- **图片质量配置**: 优化为6个质量级别（70, 75, 80, 85, 90, 95）
- **图片格式支持**: AVIF 和 WebP 现代格式

### SEO 优化
- **Sitemap**: `src/app/sitemap.ts` - 自动生成站点地图
- **Robots.txt**: `src/app/robots.txt` - 搜索引擎爬虫规则
- **元数据优化**: 完整的 OpenGraph 和 Twitter Card 支持

### 错误处理
- **全局错误边界**: `src/app/global-error.tsx` - 处理严重错误
- **页面错误边界**: `src/app/error.tsx` - 处理页面级错误
- **加载状态**: `src/app/loading.tsx` - 优雅的加载动画

## 安全保护系统

### 功能概述
- **域名授权**: 检查域名是否在授权列表中
- **代码混淆**: 生产环境自动混淆和压缩代码
- **源码保护**: 禁用 Source Maps 防止源码泄露
- **盗版检测**: 检测未经授权的部署和使用
- **运行时保护**: 检测开发者工具、iframe嵌套等

### 核心文件
- **安全配置**: `next.config.ts` - Webpack 和 Terser 混淆配置
- **保护模块**: `src/lib/security/protection.ts` - 运行时安全检查
- **安全组件**: `src/components/SecurityProtection.tsx` - 客户端安全初始化
- **代理服务**: `src/proxy.ts` - DDoS、SQL注入、XSS 防护

### 安全特性

#### 代码混淆和压缩
- **Terser 混淆**: 混淆函数名、类名和属性名
- **死代码删除**: 自动删除未使用的代码
- **console 删除**: 生产环境移除所有 console 输出
- **多次压缩**: 3次压缩确保最大化混淆

#### 安全响应头
- **X-Frame-Options: DENY** - 防止点击劫持
- **X-Content-Type-Options: nosniff** - 防止MIME嗅探
- **X-XSS-Protection** - XSS 过滤器
- **Strict-Transport-Security** - HTTPS 强制
- **Content-Security-Policy** - 内容安全策略
- **Referrer-Policy** - 引用策略
- **Permissions-Policy** - 权限策略

#### 源码保护
- **Source Maps 禁用**: 生产环境不生成源码映射
- **模块ID确定化**: 防止缓存投毒
- **代码完整性校验**: 检测代码是否被修改
- **版权水印**: 页面右下角显示版权信息

### 环境变量配置
```bash
# 应用版本
NEXT_PUBLIC_APP_VERSION=1.0.0

# 授权域名（多个域名用逗号分隔）
NEXT_PUBLIC_AUTHORIZED_DOMAIN=chuangmeng.com,www.chuangmeng.com

# 安全标志
NEXT_PUBLIC_SECURITY_ENABLED=true
```

### 安全检查机制
1. **域名检查**: 每次加载时验证域名授权
2. **iframe 检测**: 检测是否被非法嵌套
3. **开发者工具检测**: 检测是否打开调试工具
4. **代码完整性**: 检测关键函数是否被修改

### 授权域名配置
编辑 `src/lib/security/protection.ts` 中的 `AUTHORIZED_DOMAINS` 数组：
```typescript
const AUTHORIZED_DOMAINS = [
  process.env.NEXT_PUBLIC_AUTHORIZED_DOMAIN || '',
  'localhost',
  '127.0.0.1',
  'dev.coze.site',
];
```

### 版权保护
- 自动添加版权元数据
- 页面右下角显示水印
- 控制台显示版权信息
- 安全警告页面显示版权

## 交互动画系统

### 动画类型
- **滚动动画**: 元素进入视口时的淡入、滑动效果
- **悬停动画**: 缩放、阴影、旋转等悬停效果
- **页面过渡**: 页面切换时的过渡动画
- **关键帧动画**: 内置多种 CSS 动画效果

### 核心文件
- **动画库**: `src/lib/animations/index.tsx` - 动画工具函数和组件
- **全局样式**: `src/app/globals.css` - 关键帧动画定义

### 可用组件
- `ScrollReveal` - 滚动触发的显示动画
- `HoverAnimation` - 悬停效果
- `PageTransition` - 页面切换动画
- `FadeIn`, `SlideUp`, `ScaleIn` - 简单动画组件

### 可用 Hooks
- `useScrollAnimation` - 滚动视窗检测
- `usePageTransition` - 页面过渡效果

## 已知问题

### 构建警告

#### url.parse() 废弃警告
- **警告**: `DeprecationWarning: url.parse() behavior is not standardized`
- **来源**: `@react-dev-inspector/middleware@2.0.1` 依赖包
- **影响**: 不影响应用功能和构建，仅为 Node.js 运行时废弃提示
- **状态**: 已在 `KNOWN_ISSUES.md` 中记录，等待包更新
- **临时方案**: 设置 `NODE_OPTIONS="--no-deprecation"` 可抑制警告

#### Proxy 迁移 ✅
- **状态**: 已完成 middleware → proxy 迁移
- **变更**: `src/middleware.ts` → `src/proxy.ts`
- **结果**: 构建警告已消除

## 维护指南

### 添加新翻译
1. 在 `src/lib/i18n/complete-translations.ts` 对应模块添加
2. 运行 `npx tsx scripts/final-update-translations.ts` 自动生成繁体中文
3. 运行 `pnpm ts-check` 确保无类型错误

### 更新依赖
- 使用 `pnpm update <package>` 更新单个包
- 使用 `pnpm update --latest` 更新所有包到最新版本
- 更新后运行 `pnpm ts-check` 和 `pnpm build` 验证

### 构建失败排查
1. 检查 TypeScript 错误：`pnpm ts-check`
2. 检查构建日志：`tail -n 50 /app/work/logs/bypass/app.log`
3. 清理缓存：`rm -rf .next && pnpm build`


