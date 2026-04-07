#!/bin/bash

# Electron 应用打包脚本

echo "🚀 开始打包 Electron 应用..."

# 检查环境
if [ -z "$NODE_ENV" ]; then
  export NODE_ENV=production
fi

# 清理旧的构建产物
echo "🧹 清理旧的构建产物..."
rm -rf dist-electron
rm -rf .next

# 构建生产版本
echo "📦 构建 Next.js 生产版本..."
pnpm build

if [ $? -ne 0 ]; then
  echo "❌ Next.js 构建失败"
  exit 1
fi

# 构建安装包
echo "🔨 构建 Electron 安装包..."

# 检测平台
case "$(uname -s)" in
  Linux*)
    echo "🐧 检测到 Linux 平台"
    pnpm electron:build:linux
    ;;
  Darwin*)
    echo "🍎 检测到 macOS 平台"
    pnpm electron:build:mac
    ;;
  MINGW*|MSYS*|CYGWIN*)
    echo "🪟 检测到 Windows 平台"
    pnpm electron:build:win
    ;;
  *)
    echo "❌ 未知平台"
    exit 1
    ;;
esac

if [ $? -eq 0 ]; then
  echo "✅ 打包成功！"
  echo "📁 安装包位置: dist-electron/"
else
  echo "❌ 打包失败"
  exit 1
fi
