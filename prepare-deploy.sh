#!/bin/bash
# 部署准备脚本

echo "🛠️  准备血糖管理助手部署"

cd /Users/apple/blood-sugar-assistant

# 创建根目录package.json
echo "创建根目录package.json..."
cat > package.json << 'EOF'
{
  "name": "blood-sugar-assistant",
  "version": "1.0.0",
  "description": "血糖管理助手 - CGM一体化智能助手",
  "main": "backend/server.js",
  "scripts": {
    "start": "node backend/server.js",
    "dev": "node backend/server.js"
  },
  "dependencies": {
    "express": "^4.18.0",
    "cors": "^2.8.5", 
    "body-parser": "^1.20.0",
    "axios": "^1.6.0"
  },
  "engines": {
    "node": ">=16.0.0"
  },
  "author": "血糖管理助手",
  "license": "MIT"
}
EOF

# 复制backend的node_modules到根目录（如果存在）
if [ -d "backend/node_modules" ]; then
    echo "复制依赖..."
    cp -r backend/node_modules ./
fi

# 创建.gitignore
echo "创建.gitignore..."
cat > .gitignore << 'EOF'
node_modules/
*.log
.env
.DS_Store
.vscode/
backend/server.log
EOF

# 创建README
echo "创建README.md..."
cat > README.md << 'EOF'
# 🩺 血糖管理助手

专业的CGM一体化智能血糖管理助手，提供个性化血糖监测建议和健康指导。

## 功能特点
- 🤖 智能对话：与CGM设备一体化的AI助手
- 📊 实时分析：基于血糖数据提供专业分析  
- 🎯 个性化：根据用户情况给出针对性建议
- 📱 友好界面：简洁易用的网页交互
- 🔒 安全可靠：本地化部署，数据安全

## 快速开始
```bash
npm start
```

访问：http://localhost:3001
EOF

echo "✅ 部署准备完成！"
echo ""
echo "📁 项目结构："
echo "├── package.json      # 项目配置"
echo "├── backend/          # 后端代码" 
echo "├── frontend/         # 前端代码"
echo "└── README.md         # 项目说明"
echo ""
echo "🚀 部署选项："
echo "1. 内网穿透: ./deploy-tunnel.sh"
echo "2. 云服务器: 查看 deploy-server.md"  
echo "3. 免费平台: 查看 deploy-free.md"