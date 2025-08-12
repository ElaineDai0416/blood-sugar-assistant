# 云服务器部署指南

## 1. 购买云服务器
- 选择：阿里云/腾讯云轻量应用服务器
- 配置：1核2G内存，1M带宽
- 系统：Ubuntu 20.04 LTS
- 地域：选择离用户最近的

## 2. 连接服务器
```bash
ssh root@你的服务器IP
```

## 3. 安装环境
```bash
# 更新系统
apt update && apt upgrade -y

# 安装Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt-get install -y nodejs

# 安装PM2（进程管理器）
npm install -g pm2

# 安装Nginx（反向代理）
apt install nginx -y
```

## 4. 上传代码
```bash
# 创建项目目录
mkdir -p /var/www/blood-sugar-assistant
cd /var/www/blood-sugar-assistant

# 上传你的项目文件到这个目录
# 可以使用scp或者git clone
```

## 5. 安装依赖
```bash
cd /var/www/blood-sugar-assistant/backend
npm install
```

## 6. 配置PM2启动
```bash
# 创建PM2配置文件
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'blood-sugar-assistant',
    script: 'server.js',
    cwd: '/var/www/blood-sugar-assistant/backend',
    instances: 1,
    autorestart: true,
    watch: false,
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    }
  }]
}
EOF

# 启动应用
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## 7. 配置Nginx
```bash
cat > /etc/nginx/sites-available/blood-sugar-assistant << EOF
server {
    listen 80;
    server_name 你的域名或IP;
    
    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# 启用站点
ln -s /etc/nginx/sites-available/blood-sugar-assistant /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

## 8. 开放防火墙端口
```bash
ufw allow 80
ufw allow 443
ufw allow ssh
ufw enable
```

## 访问地址
http://你的服务器IP