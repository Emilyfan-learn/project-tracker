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

# Build and start containers
echo "建立並啟動容器..."
docker compose up -d

if [ $? -eq 0 ]; then
    echo ""
    echo "✓ 服務已成功啟動！"
    echo ""
    echo "訪問應用程式："
    echo "  前端: http://localhost:5173"
    echo "  後端 API: http://localhost:8000/docs"
    echo ""
    echo "查看日誌："
    echo "  docker compose logs -f"
    echo ""
    echo "停止服務："
    echo "  docker compose down"
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
    echo "  docker compose logs"
    echo ""
    exit 1
fi
