# 免费平台部署指南

## Railway部署（推荐）

### 1. 准备代码
```bash
cd /Users/apple/blood-sugar-assistant
# 创建package.json（根目录）
cat > package.json << EOF
{
  "name": "blood-sugar-assistant",
  "version": "1.0.0",
  "description": "血糖管理助手",
  "main": "backend/server.js",
  "scripts": {
    "start": "node backend/server.js",
    "dev": "node backend/server.js"
  },
  "dependencies": {
    "express": "^4.18.0",
    "cors": "^2.8.5",
    "body-parser": "^1.20.0",
    "axios": "^1.3.0"
  },
  "engines": {
    "node": ">=16.0.0"
  }
}
EOF
```

### 2. 上传到GitHub
```bash
# 初始化Git
git init
git add .
git commit -m "血糖管理助手初始版本"

# 创建GitHub仓库并推送
# 在GitHub创建新仓库：blood-sugar-assistant
git branch -M main
git remote add origin https://github.com/你的用户名/blood-sugar-assistant.git
git push -u origin main
```

### 3. Railway部署
1. 访问 https://railway.app/
2. 使用GitHub登录
3. 点击"New Project" > "Deploy from GitHub repo"
4. 选择你的blood-sugar-assistant仓库
5. 自动部署完成！

### 4. 获取访问地址
- Railway会自动分配一个URL
- 格式：https://你的项目名.railway.app

## Vercel + PlanetScale（备选）

### 前端部署到Vercel
1. 访问 https://vercel.com/
2. 导入GitHub仓库的frontend文件夹
3. 自动部署前端页面

### 后端部署到Railway
按上述Railway步骤部署后端

## 环境变量配置
在Railway/Vercel中设置：
- `NODE_ENV=production`
- `PORT=3001`（Railway会自动设置）