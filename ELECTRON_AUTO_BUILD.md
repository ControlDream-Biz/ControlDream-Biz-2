# 🚀 Electron 自动打包配置指南

## 📖 概述

本项目已配置完整的 **GitHub Actions 自动打包**功能，支持：

- ✅ **Windows**: NSIS 安装包 + 便携版（x64）
- ✅ **macOS**: DMG + ZIP（x64 + arm64）
- ✅ **Linux**: AppImage + DEB + RPM（x64）
- ✅ **自动发布**: 推送 tag 后自动创建 Release

---

## 🎯 快速开始

### 方式一：推送到 GitHub（推荐）

#### 1. 创建 GitHub 仓库

如果还没有 GitHub 仓库，创建一个：

```bash
# 初始化 Git
git init

# 添加所有文件
git add .

# 提交
git commit -m "feat: 初始化 Electron 桌面应用"

# 添加远程仓库
git remote add origin https://github.com/你的用户名/仓库名.git

# 推送到 main 分支
git push -u origin main
```

#### 2. 自动打包触发

自动打包会在以下情况触发：

| 触发条件 | 说明 |
|---------|------|
| 推送到 `main` 分支 | 自动构建所有平台（仅生成 artifacts） |
| 推送到 `develop` 分支 | 自动构建所有平台（仅生成 artifacts） |
| 创建 tag `v*` | 自动构建所有平台 + 创建 Release |
| Pull Request | 自动构建所有平台（测试用） |
| 手动触发 | 在 Actions 页面手动运行 |

#### 3. 下载安装包

**方式 A: 从 Actions 下载**
1. 访问 GitHub 仓库的 **Actions** 标签页
2. 选择一个 workflow 运行
3. 滚动到底部，找到 **Artifacts**
4. 下载对应平台的安装包

**方式 B: 从 Releases 下载（仅 tag 触发）**
1. 访问 GitHub 仓库的 **Releases** 标签页
2. 找到对应的版本
3. 下载对应平台的安装包

---

## 🏷️ 创建 Release（自动发布）

### 步骤 1: 提交代码

```bash
# 确保所有更改已提交
git add .
git commit -m "feat: 准备发布 v1.0.0"
git push
```

### 步骤 2: 创建 tag

```bash
# 创建并推送 tag
git tag v1.0.0
git push origin v1.0.0
```

### 步骤 3: 等待自动打包

- GitHub Actions 会自动运行
- 大约需要 **10-15 分钟**（取决于平台）
- 可以在 Actions 页面查看进度

### 步骤 4: 下载安装包

- 打包完成后，会自动创建 Release
- 在 **Releases** 页面下载对应平台的安装包

---

## 📦 下载的文件说明

### Windows

| 文件名 | 说明 | 大小 |
|--------|------|------|
| `创梦管理后台 Setup 1.0.0.exe` | NSIS 安装包（推荐） | ~150MB |
| `创梦管理后台 1.0.0.exe` | 便携版（免安装） | ~140MB |

### macOS

| 文件名 | 说明 | 大小 |
|--------|------|------|
| `创梦管理后台-1.0.0.dmg` | DMG 安装包 | ~120MB |
| `创梦管理后台-1.0.0-mac.zip` | ZIP 压缩包 | ~115MB |

### Linux

| 文件名 | 说明 | 大小 | 适用系统 |
|--------|------|------|----------|
| `创梦管理后台-1.0.0.AppImage` | 通用可执行文件 | ~130MB | 所有 Linux 发行版 |
| `创梦管理后台-1.0.0.deb` | Debian 包 | ~125MB | Ubuntu/Debian |
| `创梦管理后台-1.0.0.rpm` | RPM 包 | ~125MB | Fedora/RHEL |

---

## 🔧 高级配置

### macOS 签名（可选）

如果要发布 macOS 版本，需要代码签名：

#### 1. 导出证书

```bash
# 在 macOS 上导出证书
security find-identity -v -p codesigning
```

#### 2. 添加到 GitHub Secrets

在 GitHub 仓库设置中添加以下 Secrets：

- `MAC_CERTS`: 证书文件内容（Base64 编码）
- `MAC_CERTS_PASSWORD`: 证书密码

#### 3. Base64 编码证书

```bash
# 转换证书为 Base64
base64 -i your-cert.p12 | pbcopy
```

#### 4. 更新 workflow

在 `.github/workflows/electron-build.yml` 中已配置：
```yaml
env:
  CSC_LINK: ${{ secrets.MAC_CERTS }}
  CSC_KEY_PASSWORD: ${{ secrets.MAC_CERTS_PASSWORD }}
```

### Windows 代码签名（可选）

如果要签名 Windows 应用：

#### 1. 获取代码签名证书

- 从 CA（如 DigiCert）购买代码签名证书
- 导出为 `.pfx` 文件

#### 2. 添加到 GitHub Secrets

- `WIN_CERTS`: 证书文件（Base64 编码）
- `WIN_CERTS_PASSWORD`: 证书密码

#### 3. 更新 workflow

```yaml
- name: Build Electron (Windows)
  run: pnpm electron:build:win
  env:
    GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
    CSC_LINK: ${{ secrets.WIN_CERTS }}
    CSC_KEY_PASSWORD: ${{ secrets.WIN_CERTS_PASSWORD }}
```

---

## 📝 Release 版本号规范

推荐使用语义化版本号：

| 版本号 | 说明 | 示例 |
|--------|------|------|
| `v1.0.0` | 正式发布 | 第一个稳定版本 |
| `v1.1.0` | 新功能 | 添加新功能 |
| `v1.0.1` | Bug 修复 | 修复 bug |
| `v2.0.0` | 重大更新 | 不兼容的重大更改 |
| `v1.0.0-beta.1` | 测试版 | 测试版本 |
| `v1.0.0-rc.1` | 候选发布版 | 发布候选版 |

---

## 🔄 CI/CD 工作流程

```
┌─────────────────┐
│  推送代码/Tag   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ GitHub Actions  │
│  自动触发       │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌──────┐  ┌──────┐  ┌──────┐
│Win   │  │macOS │  │Linux │
│Build │  │Build │  │Build │
└───┬──┘  └───┬──┘  └───┬──┘
    │         │         │
    └────┬────┴────┬────┘
         │         │
         ▼         ▼
    ┌──────────┐
    │Artifacts │
    └────┬─────┘
         │
         ▼
    ┌──────────┐
    │ Release  │ (仅 tag)
    └──────────┘
```

---

## 🎯 使用场景

### 场景 1: 开发测试

```bash
# 推送到 develop 分支
git checkout develop
git add .
git commit -m "test: 测试新功能"
git push origin develop

# 查看 Actions 页面，下载测试版本
```

### 场景 2: 发布新版本

```bash
# 1. 合并到 main
git checkout main
git merge develop

# 2. 提交
git commit -m "release: 准备 v1.1.0"
git push origin main

# 3. 创建 tag
git tag v1.1.0
git push origin v1.1.0

# 4. 等待打包，在 Releases 下载
```

### 场景 3: 紧急修复

```bash
# 1. 创建修复分支
git checkout -b hotfix/critical-bug

# 2. 修复 bug
git add .
git commit -m "fix: 修复严重 bug"

# 3. 推送并合并
git push origin hotfix/critical-bug
# 在 GitHub 创建 PR 合并到 main

# 4. 发布修复版本
git checkout main
git pull
git tag v1.0.1
git push origin v1.0.1
```

---

## 🔍 监控构建状态

### 查看 Actions 日志

1. 访问仓库的 **Actions** 标签页
2. 点击对应的 workflow 运行
3. 展开每个 job 查看详细日志
4. 如果失败，查看错误信息

### 构建失败排查

常见问题：

1. **依赖安装失败**
   ```bash
   # 清除缓存重新安装
   rm -rf node_modules
   pnpm install
   ```

2. **构建失败**
   ```bash
   # 本地测试构建
   pnpm build
   pnpm electron:build
   ```

3. **macOS 签名失败**
   - 检查证书是否正确
   - 确认 GitHub Secrets 配置正确

---

## 📊 构建时间估算

| 平台 | 预计时间 |
|------|----------|
| Windows | 8-10 分钟 |
| macOS | 10-12 分钟 |
| Linux | 6-8 分钟 |
| **总计** | **15-20 分钟** |

---

## 🎨 自定义配置

### 修改构建配置

编辑 `.github/workflows/electron-build.yml`:

```yaml
# 修改 Node.js 版本
env:
  NODE_VERSION: '20'  # 改为其他版本

# 修改触发条件
on:
  push:
    branches:
      - main
      - custom-branch  # 添加自定义分支
```

### 修改打包配置

编辑 `package.json`:

```json
{
  "build": {
    "win": {
      "target": ["nsis", "portable"]
    },
    "mac": {
      "target": ["dmg", "zip"]
    },
    "linux": {
      "target": ["AppImage", "deb", "rpm"]
    }
  }
}
```

---

## 🆘 常见问题

### Q1: 如何只构建 Windows 版本？

**A**: 修改 workflow，注释掉 macOS 和 Linux 的 job。

### Q2: 如何加快构建速度？

**A**:
- 使用 `actions/cache` 缓存依赖
- 减少构建目标（只打需要的包）
- 使用 GitHub Actions 自托管 Runner

### Q3: 如何自动测试？

**A**: 在 workflow 中添加测试步骤：

```yaml
- name: Run tests
  run: pnpm test

- name: Lint
  run: pnpm lint
```

### Q4: 如何部署到其他平台？

**A**: 添加 `upload-artifact` 后，使用其他工具部署：

```yaml
- name: Deploy to S3
  uses: jakejarvis/s3-sync-action@master
  with:
    args: --acl public-read --follow-symlinks --delete
    env:
      AWS_S3_BUCKET: ${{ secrets.AWS_S3_BUCKET }}
      AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
      AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
      AWS_REGION: 'us-east-1'
      SOURCE_DIR: 'dist-electron'
```

---

## 📞 技术支持

- **GitHub Actions 文档**: https://docs.github.com/actions
- **Electron Builder 文档**: https://www.electron.build/
- **本项目 Issues**: https://github.com/你的用户名/仓库名/issues

---

## 🎉 总结

现在您可以使用**全自动打包**功能：

1. ✅ 推送代码 → 自动构建
2. ✅ 创建 tag → 自动发布
3. ✅ 下载安装包 → 一键安装

不再需要手动打包，GitHub Actions 会帮您完成一切！

---

**更新时间**: 2025-01-11
**版本**: v1.0.0
