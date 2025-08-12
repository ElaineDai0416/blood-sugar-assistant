#!/bin/bash

echo "启动血糖管理助手..."

cd backend

if [ ! -d "node_modules" ]; then
    echo "首次运行，正在安装依赖..."
    npm install
fi

echo "正在启动服务器..."
echo "服务器启动后，请在浏览器中访问 http://localhost:3000"
echo "按 Ctrl+C 停止服务器"

npm start