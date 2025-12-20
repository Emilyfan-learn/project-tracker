#!/bin/bash
# 徹底清理 Docker 並重新啟動

echo "🧹 徹底清理 Docker 環境"
echo "========================================"
echo ""

# 檢測 Docker Compose 命令
if docker compose version &> /dev/null; then
    COMPOSE_CMD="docker compose"
elif command -v docker-compose &> /dev/null; then
    COMPOSE_CMD="docker-compose"
else
    echo "❌ 未找到 Docker Compose"
    exit 1
fi

# 步驟 1: 強制停止所有容器
echo "步驟 1: 強制停止所有專案相關容器..."
docker stop projecttracker-backend projecttracker-frontend project-tracker-backend project-tracker-frontend 2>/dev/null || true
echo "✅ 完成"
echo ""

# 步驟 2: 移除所有容器（包括停止的）
echo "步驟 2: 移除所有專案相關容器..."
docker rm -f projecttracker-backend projecttracker-frontend project-tracker-backend project-tracker-frontend 2>/dev/null || true
echo "✅ 完成"
echo ""

# 步驟 3: 使用 docker-compose down 清理
echo "步驟 3: Docker Compose 完整清理..."
$COMPOSE_CMD down -v --remove-orphans 2>/dev/null || true
echo "✅ 完成"
echo ""

# 步驟 4: 移除舊映像
echo "步驟 4: 移除舊 Docker 映像..."
docker rmi -f project-tracker-backend project-tracker-frontend 2>/dev/null || true
docker rmi -f projecttracter-backend projecttracter-frontend 2>/dev/null || true
echo "✅ 完成"
echo ""

# 步驟 5: 清理網絡
echo "步驟 5: 清理 Docker 網絡..."
docker network rm project-tracker_projecttracker-network projecttracker_projecttracker-network 2>/dev/null || true
echo "✅ 完成"
echo ""

# 步驟 6: Docker 系統清理
echo "步驟 6: Docker 系統清理（移除未使用的資源）..."
docker system prune -f
echo "✅ 完成"
echo ""

# 步驟 7: 確保資料目錄存在
echo "步驟 7: 確保資料目錄存在..."
mkdir -p ./data/backups/daily
mkdir -p ./data/backups/weekly
mkdir -p ./data/backups/monthly
mkdir -p ./data/backups/manual
echo "✅ 完成"
echo ""

# 步驟 8: 重新建構（不使用緩存）
echo "步驟 8: 重新建構容器（不使用緩存）..."
echo "（這可能需要幾分鐘時間）"
echo ""
$COMPOSE_CMD build --no-cache

if [ $? -ne 0 ]; then
    echo ""
    echo "❌ 建構失敗！"
    exit 1
fi

echo ""
echo "✅ 建構完成"
echo ""

# 步驟 9: 啟動容器
echo "步驟 9: 啟動容器..."
$COMPOSE_CMD up -d

if [ $? -ne 0 ]; then
    echo ""
    echo "❌ 啟動失敗！"
    echo ""
    echo "顯示 Docker Compose 日誌："
    $COMPOSE_CMD logs
    exit 1
fi

echo ""
echo "✅ 容器已啟動"
echo ""

# 步驟 10: 等待容器完全啟動
echo "步驟 10: 等待容器完全啟動..."
sleep 10
echo "✅ 完成"
echo ""

# 步驟 11: 檢查容器狀態
echo "步驟 11: 檢查容器狀態..."
echo ""
docker ps -a | grep -E "project-tracker|projecttracker" || docker ps -a
echo ""

# 步驟 12: 檢查後端日誌
echo "步驟 12: 檢查後端日誌..."
echo ""
$COMPOSE_CMD logs backend --tail=30
echo ""

# 步驟 13: 驗證資料庫
echo "步驟 13: 驗證資料庫..."
echo ""
docker exec project-tracker-backend python backend/verify_db.py 2>/dev/null || \
docker exec projecttracker-backend python backend/verify_db.py 2>/dev/null || \
echo "⚠️  無法運行資料庫驗證，但容器可能正在啟動中"
echo ""

# 步驟 14: 測試 API
echo "步驟 14: 測試 API（等待 5 秒讓服務完全啟動）..."
sleep 5
echo ""

echo "健康檢查:"
curl -s http://localhost:8000/health | python3 -m json.tool 2>/dev/null || curl -s http://localhost:8000/health || echo "⚠️  後端可能還在啟動中"
echo ""
echo ""

echo "專案列表 API:"
RESPONSE=$(curl -s -w "\nHTTP_CODE:%{http_code}" http://localhost:8000/api/projects/ 2>/dev/null)
HTTP_CODE=$(echo "$RESPONSE" | grep HTTP_CODE | cut -d: -f2)
BODY=$(echo "$RESPONSE" | sed '/HTTP_CODE:/d')

if [ -n "$HTTP_CODE" ]; then
    echo "HTTP 狀態碼: $HTTP_CODE"
    echo "回應內容:"
    echo "$BODY" | python3 -m json.tool 2>/dev/null || echo "$BODY"
else
    echo "⚠️  無法連接到 API，後端可能還在啟動中"
fi

echo ""
echo ""
echo "========================================"
echo "✅ 深度清理並重啟完成！"
echo "========================================"
echo ""
echo "服務地址："
echo "  前端: http://localhost:5173"
echo "  後端: http://localhost:8000"
echo "  API 文檔: http://localhost:8000/docs"
echo ""
echo "如果仍有問題，請運行："
echo "  docker compose logs backend"
echo "  docker compose logs frontend"
echo ""
