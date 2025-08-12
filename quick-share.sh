#!/bin/bash

echo "🌐 血糖管理助手 - 快速分享"
echo "正在创建公网访问地址..."

# 确保服务器运行
if ! curl -s http://localhost:3001 > /dev/null; then
    echo "启动本地服务器..."
    cd /Users/apple/blood-sugar-assistant/backend
    nohup node server.js > server.log 2>&1 &
    sleep 3
fi

echo ""
echo "🎯 方法1: Serveo (推荐，无需密码)"
echo "运行以下命令获得公网地址："
echo "ssh -R 80:localhost:3001 serveo.net"
echo ""

echo "🎯 方法2: 临时HTTP服务器"
echo "运行以下命令创建简单的外网访问："
echo "python3 -m http.server 8080 --directory /Users/apple/blood-sugar-assistant/frontend &"
echo "然后使用 lt --port 8080"
echo ""

echo "🎯 方法3: 使用ngrok（需注册但最稳定）"
echo "1. 访问 https://ngrok.com/ 注册账号"
echo "2. 下载ngrok并配置token"
echo "3. 运行: ngrok http 3001"
echo ""

echo "✅ 本地访问地址: http://localhost:3001"
echo "选择上述任一方法创建公网访问！"