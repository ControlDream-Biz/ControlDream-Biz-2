#!/bin/bash
set -Eeuo pipefail

COZE_WORKSPACE_PATH="${COZE_WORKSPACE_PATH:-$(pwd)}"

cd "${COZE_WORKSPACE_PATH}"

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 错误计数
ERRORS=0

# 打印带颜色的消息
print_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
    ERRORS=$((ERRORS + 1))
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

echo "=========================================="
echo "  Next.js 安全构建脚本"
echo "=========================================="
echo ""

# 步骤1：安装依赖
print_info "步骤 1/6: 安装依赖..."
pnpm install --prefer-frozen-lockfile --prefer-offline --loglevel debug --reporter=append-only

# 步骤2：构建项目
print_info "步骤 2/6: 构建 Next.js 项目..."
pnpm next build

# 步骤3：删除 Source Maps（防止源码泄露）
print_info "步骤 3/6: 删除 Source Maps..."
MAP_COUNT=$(find .next -name "*.map" -type f 2>/dev/null | wc -l || echo 0)

if [ "$MAP_COUNT" -gt 0 ]; then
    print_info "发现 $MAP_COUNT 个 .map 文件，正在删除..."
    find .next -name "*.map" -delete
    print_info ".map 文件已删除"
else
    print_info "未发现 .map 文件"
fi

# 验证：检查是否还有 .map 文件
REMAINING_MAPS=$(find .next -name "*.map" -type f 2>/dev/null | wc -l || echo 0)
if [ "$REMAINING_MAPS" -gt 0 ]; then
    print_error "仍然存在 $REMAINING_MAPS 个 .map 文件！"
    find .next -name "*.map" -type f
else
    print_info "✓ 源码保护验证通过：无 .map 文件"
fi

# 步骤4：验证代码混淆
print_info "步骤 4/6: 验证代码混淆..."
if [ -d ".next/server" ]; then
    # 检查服务端代码是否包含 console.log（应该被删除）
    CONSOLE_COUNT=$(grep -r "console.log" .next/server/app 2>/dev/null | wc -l | tr -d '[:space:]' || echo 0)
    if [ "$CONSOLE_COUNT" -eq 0 ]; then
        print_info "✓ 代码混淆验证通过：console.log 已移除"
    else
        print_warning "发现 $CONSOLE_COUNT 处 console.log（可能未完全混淆）"
    fi
else
    print_warning "无法验证代码混淆：.next/server 目录不存在"
fi

# 步骤5：验证授权域名配置
print_info "步骤 5/6: 验证授权域名配置..."
if [ -f ".env.local" ]; then
    if grep -q "NEXT_PUBLIC_AUTHORIZED_DOMAIN" .env.local; then
        AUTH_DOMAIN=$(grep "NEXT_PUBLIC_AUTHORIZED_DOMAIN" .env.local | cut -d '=' -f2)
        if [ -n "$AUTH_DOMAIN" ]; then
            print_info "✓ 授权域名已配置: $AUTH_DOMAIN"
        else
            print_error "授权域名配置为空！"
        fi
    else
        print_warning "未配置授权域名（NEXT_PUBLIC_AUTHORIZED_DOMAIN）"
    fi
else
    print_warning ".env.local 文件不存在，跳过域名验证"
fi

# 步骤6：检查构建产物
print_info "步骤 6/6: 检查构建产物..."
if [ -d ".next" ]; then
    TOTAL_SIZE=$(du -sh .next | cut -f1)
    print_info "构建产物大小: $TOTAL_SIZE"

    # 检查关键文件
    if [ -f ".next/BUILD_ID" ]; then
        BUILD_ID=$(cat .next/BUILD_ID)
        print_info "构建 ID: $BUILD_ID"
    fi

    if [ -d ".next/static" ]; then
        STATIC_COUNT=$(find .next/static -type f 2>/dev/null | wc -l || echo 0)
        print_info "静态资源数量: $STATIC_COUNT"
    fi
fi

echo ""
echo "=========================================="
echo "  构建检查摘要"
echo "=========================================="

# 错误统计
if [ $ERRORS -eq 0 ]; then
    print_info "✓ 所有检查通过！"
else
    print_error "发现 $ERRORS 个错误，请检查并修复！"
    exit 1
fi

echo ""
print_info "开始打包服务器..."
pnpm tsup src/server.ts --format cjs --platform node --target node20 --outDir dist --no-splitting --no-minify

echo ""
print_info "✓ 构建和检查完成！"
echo ""
print_info "部署前请确认："
echo "  1. 授权域名配置正确"
echo "  2. 环境变量已设置（DATABASE_URL 等）"
echo "  3. 数据库连接正常"
echo "  4. 安全响应头已启用"
echo ""
