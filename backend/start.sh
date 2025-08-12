#!/bin/bash
# 血糖管理助手启动脚本

echo "🩺 启动血糖管理助手..."

# 进入项目目录
cd /Users/apple/blood-sugar-assistant/backend

# 停止可能运行的旧进程
echo "停止旧进程..."
pkill -f "node server.js" 2>/dev/null

# 等待进程完全停止
sleep 2

# 启动新服务器
echo "启动服务器..."
nohup node server.js > server.log 2>&1 &
SERVER_PID=$!

# 等待服务器启动
sleep 3

# 检查服务器状态
if curl -s http://localhost:3001 > /dev/null; then
    echo "✅ 血糖管理助手启动成功！"
    echo "🌐 访问地址: http://localhost:3001"
    echo "📋 服务器PID: $SERVER_PID"
    echo "📝 日志文件: server.log"
else
    echo "❌ 服务器启动失败，请检查日志"
    tail -10 server.log
fi