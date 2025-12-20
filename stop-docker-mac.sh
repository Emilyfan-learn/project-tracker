#!/bin/bash
# 強制關閉 Mac 上的 Docker

echo "🛑 關閉 Docker Desktop..."

# 1. 先停止所有容器
echo "1. 停止專案容器..."
docker compose down 2>/dev/null || docker-compose down 2>/dev/null || true

# 2. 停止所有運行中的容器
echo "2. 停止所有 Docker 容器..."
docker stop $(docker ps -aq) 2>/dev/null || true

# 3. 退出 Docker Desktop 應用程式
echo "3. 退出 Docker Desktop..."
osascript -e 'quit app "Docker"' 2>/dev/null || true

echo "✅ Docker 已關閉"
