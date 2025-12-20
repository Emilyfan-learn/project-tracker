#!/bin/bash

echo "========================================"
echo "  Project Tracker - Docker 啟動"
echo "========================================"
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker 尚未安裝"
    echo ""
    echo "請先安裝 Docker Desktop："
    echo "  brew install --cask docker"
    echo ""
    exit 1
fi

# Check if Docker daemon is running
if ! docker info &> /dev/null; then
    echo "❌ Docker daemon 未執行"
    echo ""
    echo "請啟動 Docker Desktop 應用程式"
    echo ""
    exit 1
fi

echo "✓ Docker 已安裝並執行中"
echo ""

# Detect Docker Compose command
if docker compose version &> /dev/null; then
    COMPOSE_CMD="docker compose"
elif command -v docker-compose &> /dev/null; then
    COMPOSE_CMD="docker-compose"
else
    echo "❌ Docker Compose 未安裝"
    echo ""
    echo "請安裝 Docker Desktop (包含 Docker Compose)："
    echo "  brew install --cask docker"
    echo ""
    exit 1
fi

echo "使用命令: $COMPOSE_CMD"
echo ""

# Clean up any existing containers
echo "清理舊容器（如果存在）..."
$COMPOSE_CMD down 2>/dev/null || true

# Build and start containers
echo "建立並啟動容器..."
$COMPOSE_CMD up -d --build

if [ $? -eq 0 ]; then
    echo ""
    echo "✓ 服務已成功啟動！"
    echo ""
    echo "訪問應用程式："
    echo "  前端: http://localhost:5173"
    echo "  後端 API: http://localhost:8000/docs"
    echo ""
    echo "查看日誌："
    echo "  $COMPOSE_CMD logs -f"
    echo ""
    echo "停止服務："
    echo "  ./stop_docker.sh"
    echo ""

    # Open browser
    sleep 2
    if command -v open &> /dev/null; then
        echo "正在開啟瀏覽器..."
        open http://localhost:5173
    fi
else
    echo ""
    echo "❌ 啟動失敗"
    echo ""
    echo "請檢查錯誤訊息或執行："
    echo "  $COMPOSE_CMD logs"
    echo ""
    exit 1
fi
