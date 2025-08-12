#!/bin/bash

echo "🚀 启动Serveo隧道..."
echo "这将创建一个无需密码的公网访问地址"
echo ""

# 添加serveo.net到known_hosts
mkdir -p ~/.ssh
ssh-keyscan -H serveo.net >> ~/.ssh/known_hosts 2>/dev/null

echo "正在连接到serveo.net..."
echo "访问地址将在下方显示："
echo ""

# 连接serveo
ssh -o StrictHostKeyChecking=no -R 80:localhost:3001 serveo.net