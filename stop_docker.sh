#!/bin/bash

echo "========================================"
echo "  Project Tracker - Docker 停止"
echo "========================================"
echo ""

# Detect Docker Compose command
if docker compose version &> /dev/null; then
    COMPOSE_CMD="docker compose"
elif command -v docker-compose &> /dev/null; then
    COMPOSE_CMD="docker-compose"
else
    echo "❌ Docker Compose 未找到"
    exit 1
fi

echo "停止並移除容器..."
$COMPOSE_CMD down

if [ $? -eq 0 ]; then
    echo ""
    echo "✓ 所有容器已停止並移除"
    echo ""
    echo "如需完全清理（包含映像和卷）："
    echo "  $COMPOSE_CMD down -v --rmi all"
    echo ""
else
    echo ""
    echo "❌ 停止失敗，請檢查錯誤訊息"
    echo ""
fi
