# 个人助理 - 部署指南

## 使用 Vercel 免费部署

### 方法一：通过 Vercel 网站（推荐新手）

1. **访问 Vercel**
   - 打开 https://vercel.com
   - 点击 "Sign Up" 注册账号（推荐使用 GitHub 账号登录）

2. **导入项目**
   - 登录后点击 "Add New Project"
   - 选择 "Continue with GitHub"
   - 授权 Vercel 访问您的 GitHub 账号

3. **上传代码到 GitHub**
   ```bash
   # 初始化 Git 仓库（如果还没有）
   git init
   git add .
   git commit -m "Initial commit"
   
   # 创建 GitHub 仓库并推送
   # 1. 访问 https://github.com/new 创建新仓库
   # 2. 执行以下命令（替换为您的仓库地址）
   git remote add origin https://github.com/your-username/your-repo.git
   git branch -M main
   git push -u origin main
   ```

4. **在 Vercel 部署**
   - 在 Vercel 导入界面找到您的仓库
   - 点击 "Import"
   - Vercel 会自动检测配置
   - 点击 "Deploy"

5. **等待部署完成**
   - 部署过程约 2-3 分钟
   - 完成后会获得一个 `https://your-project.vercel.app` 的链接

### 方法二：使用 Vercel CLI（更快捷）

1. **安装 Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **在项目目录下部署**
   ```bash
   cd /Users/leocai/WorkBuddy/20260312210441
   vercel
   ```

3. **按提示操作**
   - 输入邮箱或 GitHub 账号登录
   - 项目名称可以自定义
   - 其他选项使用默认值即可

4. **完成部署**
   - 部署完成后会显示访问链接
   - 如需生产环境部署：`vercel --prod`

## 从手机访问

部署完成后，您会获得一个类似这样的链接：
```
https://personal-assistant.vercel.app
```

### 手机访问方式：
1. **直接输入链接**：在手机浏览器中直接输入部署链接
2. **二维码扫描**：使用手机扫描电脑屏幕上的二维码（Vercel 提供）
3. **分享链接**：将链接通过微信、短信等方式发送到手机

## Vercel 免费套餐特性

✅ **完全免费**
- 无限带宽
- 100GB/月 构建流量
- 100次构建/月
- 自定义域名支持
- HTTPS 自动配置
- 全球 CDN 加速
- 自动 Git 部署
- 预览环境

✅ **手机访问**
- 任何网络均可访问
- 支持 4G/5G/WiFi
- 完美支持移动端响应式设计
- HTTPS 安全连接

✅ **自动更新**
- 代码推送到 GitHub 自动触发部署
- 每次部署都有独立预览链接
- 一键回滚到任意版本

## 其他免费部署方案备选

### GitHub Pages（完全免费）

1. 在仓库设置中开启 GitHub Pages
2. 选择 `gh-pages` 分支作为源
3. 访问 `https://yourname.github.io/repo-name`

### Netlify（完全免费）

1. 访问 https://netlify.com
2. 注册并连接 GitHub 仓库
3. 自动构建和部署

## 部署后的维护

- 更新应用：只需 `git push` 到 GitHub，Vercel 自动部署
- 查看部署日志：访问 Vercel 控制台
- 自定义域名：在 Vercel 设置中添加自己的域名
- 环境变量：在项目设置中添加（如需要）

## 常见问题

**Q: 部署后数据会丢失吗？**
A: 不会。数据保存在您手机/电脑的浏览器 LocalStorage 中，每个设备独立存储。

**Q: 可以在不同设备间同步数据吗？**
A: 当前版本不支持跨设备同步，每个设备的数据是独立的。

**Q: 部署后可以修改代码吗？**
A: 可以。修改代码后推送到 GitHub，Vercel 会自动重新部署。

**Q: 免费套餐有有效期吗？**
A: 没有。Vercel 的免费套餐永久免费。

---

**下一步**：按照上述方法部署，完成后就可以从任何手机访问您的个人助理应用了！
