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
│   ├── components/ui/      # Shadcn UI 组件库
│   ├── hooks/              # 自定义 Hooks
│   ├── lib/                # 工具库
│   │   └── utils.ts        # 通用工具函数 (cn)
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


