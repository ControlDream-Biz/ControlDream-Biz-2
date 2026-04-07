# 🚀 3分钟快速开始 - 自动打包

## 🎯 超简单步骤

### 1️⃣ 创建 GitHub 仓库（如果没有）

```bash
# 进入项目目录
cd /workspace/projects

# 初始化 Git
git init

# 添加所有文件
git add .

# 提交
git commit -m "feat: 初始化 Electron 桌面应用"

# 添加远程仓库（替换为你的仓库地址）
git remote add origin https://github.com/你的用户名/你的仓库名.git

# 推送到 main 分支
git push -u origin main
```

### 2️⃣ 等待自动打包（10-15 分钟）

- 访问你的 GitHub 仓库
- 点击 **Actions** 标签页
- 看到 workflow 正在运行 ✅

### 3️⃣ 下载安装包

**方式 A: 从 Actions 下载**
1. 点击正在运行的 workflow
2. 滚动到底部
3. 找到 **Artifacts**
4. 下载对应平台的文件

**方式 B: 从 Releases 下载（需要创建 tag）**
```bash
# 创建版本 tag
git tag v1.0.0
git push origin v1.0.0
```
等待打包完成后，在 **Releases** 页面下载。

---

## 📥 各平台安装包名称

| 平台 | 文件名 | 位置 |
|------|--------|------|
| Windows | `创梦管理后台 Setup 1.0.0.exe` | Artifacts / Releases |
| macOS | `创梦管理后台-1.0.0.dmg` | Artifacts / Releases |
| Linux | `创梦管理后台-1.0.0.AppImage` | Artifacts / Releases |

---

## ⚡ 常用命令

```bash
# 查看构建状态
# 访问: https://github.com/你的用户名/你的仓库名/actions

# 创建新版本
git tag v1.1.0
git push origin v1.1.0

# 查看所有 tag
git tag

# 删除 tag
git tag -d v1.0.0
git push origin :refs/tags/v1.0.0
```

---

## 🔥 自动触发条件

| 操作 | 效果 |
|------|------|
| 推送到 `main` | 自动构建（Artifacts） |
| 推送到 `develop` | 自动构建（Artifacts） |
| 创建 `v*` tag | 自动构建 + Release |
| 提交 PR | 自动构建（测试） |

---

## ❓ 遇到问题？

### 问题 1: 推送失败

```bash
# 检查远程仓库
git remote -v

# 重新添加
git remote set-url origin https://github.com/你的用户名/你的仓库名.git
```

### 问题 2: 构建失败

- 查看 Actions 日志
- 检查代码是否有错误
- 在本地测试：`pnpm electron:build`

### 问题 3: 想只构建 Windows

编辑 `.github/workflows/electron-build.yml`，注释掉 macOS 和 Linux 的 job。

---

## 🎯 下一步

1. **详细文档**: 查看 `ELECTRON_AUTO_BUILD.md`
2. **使用指南**: 查看 `ELECTRON_GUIDE.md`
3. **配置签名**: 配置代码签名（可选）

---

**就这么简单！** 🎉

推送代码 → 等待构建 → 下载安装 → 完成！
