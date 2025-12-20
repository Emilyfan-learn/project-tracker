#!/bin/bash
# 啟動 Docker 容器

echo "🚀 啟動專案追蹤系統..."

# 檢查容器是否存在但已停止
BACKEND_EXISTS=$(docker ps -a -q -f name=projecttracker-backend)
FRONTEND_EXISTS=$(docker ps -a -q -f name=projecttracker-frontend)

if [ -n "$BACKEND_EXISTS" ] && [ -n "$FRONTEND_EXISTS" ]; then
    # 容器存在，直接啟動
    echo "啟動現有容器..."
    docker start projecttracker-backend projecttracker-frontend
    echo "✅ 服務已啟動"
else
    # 容器不存在，運行完整啟動腳本
    echo "首次啟動或容器已刪除，運行完整啟動..."
    ./start-without-compose.sh
fi

echo ""
echo "服務地址："
echo "  前端: http://localhost:5173"
echo "  後端: http://localhost:8000"
