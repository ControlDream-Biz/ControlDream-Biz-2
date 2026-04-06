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
│   │   │   ├── chat/       # AI 客服 API
│   │   │   └── admin/      # 后台管理 API
│   │   └── admin/          # 后台管理页面
│   ├── components/         # 组件
│   │   ├── ui/            # Shadcn UI 组件库
│   │   └── LiveChat.tsx   # 客服聊天窗口组件
│   ├── hooks/             # 自定义 Hooks
│   │   └── useWebSocket.ts # WebSocket 连接 Hook
│   ├── lib/               # 工具库
│   │   ├── db/           # 数据库相关
│   │   │   ├── schema.ts # 数据库表结构
│   │   │   ├── queries.ts # 数据库查询函数
│   │   │   └── init.ts   # 数据库初始化
│   │   ├── utils.ts      # 通用工具函数 (cn)
│   │   └── ws-client.ts  # WebSocket 客户端工具
│   ├── ws-handlers/       # WebSocket 处理器
│   │   └── chat.ts       # 聊天 WebSocket 端点
│   └── server.ts         # 自定义服务端入口（HTTP + WS）
├── drizzle.config.ts      # Drizzle ORM 配置
├── next.config.ts         # Next.js 配置
├── package.json           # 项目依赖管理
└── tsconfig.json          # TypeScript 配置
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
- **数据库持久化**：所有对话记录自动保存到 PostgreSQL 数据库
- **实时通信**：使用 WebSocket 实现实时消息推送和状态同步

### 核心文件
- **前端组件**: `src/components/LiveChat.tsx` - 客服聊天窗口组件
- **API 路由**: `src/app/api/chat/route.ts` - AI 客服接口
- **后台管理**: `src/app/admin/chat/page.tsx` - 客服管理后台
- **管理 API**: `src/app/api/admin/chat/route.ts` - 后台管理接口
- **数据库 Schema**: `src/lib/db/schema.ts` - 数据库表结构定义
- **数据库查询**: `src/lib/db/queries.ts` - 数据库操作函数
- **WebSocket 处理**: `src/ws-handlers/chat.ts` - WebSocket 端点处理器
- **WebSocket 客户端**: `src/lib/ws-client.ts` - WebSocket 连接工具
- **自定义 Hook**: `src/hooks/useWebSocket.ts` - React WebSocket Hook

### 数据库设计
- **conversations 表**: 存储对话会话信息
  - id, userId, agentId, status, lastMessage, messageCount, isHumanTakeover, createdAt, updatedAt
- **messages 表**: 存储对话消息
  - id, conversationId, type, content, senderId, agentId, isRead, createdAt

### 大模型配置
- **模型**: kimi-k2-5-260127 (Kimi K2.5)
- **流式输出**: 启用，提供实时打字效果
- **系统提示词**: 优化为企业客服角色，要求详细完整回答
- **对话历史**: 自动从数据库加载最近 10 条消息

### WebSocket 实时通信
- **端点**: `/ws/chat`
- **消息类型**:
  - `new-message`: 新消息推送
  - `conversation-update`: 对话状态更新
  - `human-takeover`: 人工接管通知
  - `human-release`: 释放接管通知
  - `typing`: 打字指示器
- **订阅机制**: 客户端可订阅特定对话的实时更新

### 人工接管功能
- 支持人工客服接管 AI 对话
- 后台可查看所有对话记录
- 支持发送人工消息和释放接管
- 实时同步状态给用户端

### 使用说明

#### 用户端（访客）
1. 访问网站首页，点击右下角聊天图标
2. 开始与 AI 客服对话
3. 对话记录自动保存，刷新页面可恢复历史
4. 若被人工接管，会显示相应提示

#### 管理端（客服人员）
1. 访问 `/admin/chat` 进入后台管理页面
2. 查看所有对话列表，显示最新消息和状态
3. 点击对话查看完整消息历史
4. 点击"接管对话"进入人工客服模式
5. 输入消息回复用户，消息实时推送给用户
6. 点击"释放接管"交还给 AI 客服

### 技术栈
- **后端**: Next.js API Routes + Drizzle ORM + PostgreSQL
- **WebSocket**: ws 库，自定义服务器集成
- **前端**: React 19 + TypeScript
- **UI**: shadcn/ui + Tailwind CSS 4
- **大模型**: Kimi K2.5 (coze-coding-dev-sdk)


