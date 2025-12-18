#!/bin/bash

echo "========================================"
echo "  Project Tracker - Docker 停止"
echo "========================================"
echo ""

echo "停止並移除容器..."
docker compose down

if [ $? -eq 0 ]; then
    echo ""
    echo "✓ 所有容器已停止並移除"
    echo ""
    echo "如需完全清理（包含映像和卷）："
    echo "  docker compose down -v --rmi all"
    echo ""
else
    echo ""
    echo "❌ 停止失敗，請檢查錯誤訊息"
    echo ""
fi
