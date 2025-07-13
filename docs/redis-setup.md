# Redis 安装和配置指南

本指南将帮助您在 Windows 系统上安装和配置 Redis。

## 安装 Redis

### 方法 1: 使用 Windows Subsystem for Linux (WSL) - 推荐

1. **安装 WSL**（如果尚未安装）：
   ```powershell
   wsl --install
   ```

2. **在 WSL 中安装 Redis**：
   ```bash
   sudo apt update
   sudo apt install redis-server
   ```

3. **启动 Redis 服务**：
   ```bash
   sudo service redis-server start
   ```

4. **测试 Redis 连接**：
   ```bash
   redis-cli ping
   # 应该返回 PONG
   ```

### 方法 2: 使用 Docker - 简单快捷

1. **安装 Docker Desktop**（如果尚未安装）

2. **运行 Redis 容器**：
   ```bash
   docker run -d --name redis -p 6379:6379 redis:latest
   ```

3. **测试连接**：
   ```bash
   docker exec -it redis redis-cli ping
   # 应该返回 PONG
   ```

### 方法 3: 使用 Memurai（Windows 原生）

1. **下载 Memurai**：
   - 访问 https://www.memurai.com/
   - 下载 Windows 版本

2. **安装并启动服务**

3. **测试连接**：
   ```cmd
   memurai-cli ping
   ```

## 配置环境变量

在项目根目录创建 `.env.local` 文件（如果不存在）：

```env
# 复制 .env.example 的内容，然后添加：

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0
```

## 验证安装

运行测试脚本验证 Redis 功能：

```bash
npx tsx scripts/test-redis.ts
```

如果看到 "🎉 Redis 测试完成！所有功能正常工作。" 说明安装成功。

## 生产环境配置

### Redis 配置文件 (redis.conf)

```conf
# 绑定地址
bind 127.0.0.1

# 端口
port 6379

# 密码保护
requirepass your_strong_password_here

# 最大内存
maxmemory 256mb
maxmemory-policy allkeys-lru

# 持久化
save 900 1
save 300 10
save 60 10000

# AOF 持久化
appendonly yes
appendfsync everysec

# 日志级别
loglevel notice
logfile /var/log/redis/redis-server.log
```

### 环境变量（生产环境）

```env
REDIS_HOST=your-redis-host
REDIS_PORT=6379
REDIS_PASSWORD=your_strong_password_here
REDIS_DB=0
```

## 常用 Redis 命令

```bash
# 连接到 Redis
redis-cli

# 使用密码连接
redis-cli -a your_password

# 查看所有键
KEYS *

# 获取键值
GET key_name

# 设置键值
SET key_name value

# 删除键
DEL key_name

# 查看内存使用
INFO memory

# 清空所有数据
FLUSHALL

# 查看连接的客户端
CLIENT LIST
```

## 监控和维护

### 1. 内存监控

```bash
# 查看内存使用情况
redis-cli INFO memory

# 查看键的数量
redis-cli DBSIZE
```

### 2. 性能监控

```bash
# 实时监控命令
redis-cli MONITOR

# 查看慢查询
redis-cli SLOWLOG GET 10
```

### 3. 备份和恢复

```bash
# 手动保存快照
redis-cli BGSAVE

# 查看最后保存时间
redis-cli LASTSAVE
```

## 故障排除

### 连接问题

1. **检查 Redis 是否运行**：
   ```bash
   # Linux/WSL
   sudo service redis-server status
   
   # Docker
   docker ps | grep redis
   ```

2. **检查端口是否开放**：
   ```bash
   netstat -an | grep 6379
   ```

3. **检查防火墙设置**

### 性能问题

1. **检查内存使用**
2. **优化数据结构**
3. **设置合适的过期时间**
4. **使用连接池**

### 数据丢失

1. **检查持久化配置**
2. **定期备份**
3. **监控磁盘空间**

## 安全建议

1. **设置强密码**
2. **限制网络访问**
3. **禁用危险命令**
4. **定期更新 Redis 版本**
5. **监控异常访问**

## 开发环境快速启动

如果您只是想快速开始开发，推荐使用 Docker：

```bash
# 启动 Redis
docker run -d --name notra-redis -p 6379:6379 redis:latest

# 停止 Redis
docker stop notra-redis

# 重新启动
docker start notra-redis

# 删除容器
docker rm notra-redis
```

这样您就可以快速开始使用 Redis 功能了！