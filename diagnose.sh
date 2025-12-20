#!/bin/bash

echo "========================================"
echo "  Docker 容器診斷工具"
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

echo "=== 1. 容器狀態 ==="
$COMPOSE_CMD ps
echo ""

echo "=== 2. 後端日誌（最後 30 行）==="
$COMPOSE_CMD logs --tail=30 backend
echo ""

echo "=== 3. 檢查資料庫檔案 ==="
docker exec projecttracker-backend ls -lh /app/data/ 2>/dev/null || echo "❌ 無法訪問容器"
echo ""

echo "=== 4. 檢查環境變數 ==="
docker exec projecttracker-backend printenv | grep DATABASE 2>/dev/null || echo "❌ 無法訪問容器"
echo ""

echo "=== 5. 測試後端 API ==="
curl -s http://localhost:8000/api/projects/ | head -c 200
echo ""
echo ""

echo "========================================"
echo "診斷完成"
echo "========================================"
