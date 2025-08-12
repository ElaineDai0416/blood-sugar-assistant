#!/bin/bash
# 内网穿透快速部署脚本

echo "🚀 血糖管理助手 - 内网穿透部署"

# 检查服务器是否运行
if ! curl -s http://localhost:3001 > /dev/null; then
    echo "启动本地服务器..."
    cd /Users/apple/blood-sugar-assistant/backend
    nohup node server.js > server.log 2>&1 &
    sleep 3
fi

echo "选择内网穿透工具："
echo "1. ngrok（需注册，稳定）"
echo "2. localtunnel（无需注册，简单）"
echo "3. serveo（无需注册，SSH）"

read -p "请选择 (1-3): " choice

case $choice in
    1)
        echo "使用ngrok..."
        if ! command -v ngrok &> /dev/null; then
            echo "请先安装ngrok: https://ngrok.com/"
            exit 1
        fi
        echo "启动ngrok..."
        ngrok http 3001
        ;;
    2)
        echo "使用localtunnel..."
        if ! command -v lt &> /dev/null; then
            echo "安装localtunnel..."
            npm install -g localtunnel
        fi
        echo "启动localtunnel..."
        lt --port 3001 --subdomain blood-sugar-$(date +%s)
        ;;
    3)
        echo "使用serveo..."
        echo "访问地址将在下方显示"
        ssh -R 80:localhost:3001 serveo.net
        ;;
    *)
        echo "无效选择"
        exit 1
        ;;
esac