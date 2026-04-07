#!/bin/bash

# Electron 开发环境启动脚本

echo "🚀 启动 Electron 开发环境..."

# 设置环境变量
export NODE_ENV=development

# 启动开发服务器并等待就绪
echo "📡 启动 Next.js 开发服务器..."
pnpm dev &
NEXT_PID=$!

# 等待服务器启动
echo "⏳ 等待服务器启动..."
sleep 5

# 启动 Electron
echo "🖥️  启动 Electron 应用..."
electron .

# 清理
trap "kill $NEXT_PID 2>/dev/null" EXIT
