#!/bin/bash
# 完全重置並重新啟動 Docker 環境

echo "🔄 完全重置並重新啟動 Docker 環境"
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

echo "使用命令: $COMPOSE_CMD"
echo ""

# 步驟 1: 停止並移除所有容器
echo "步驟 1: 停止並移除所有容器..."
$COMPOSE_CMD down -v 2>/dev/null || true
docker rm -f projecttracker-backend projecttracker-frontend 2>/dev/null || true
echo "✅ 完成"
echo ""

# 步驟 2: 清理舊映像（可選）
echo "步驟 2: 清理舊 Docker 映像..."
docker rmi project-tracker-backend project-tracker-frontend 2>/dev/null || true
echo "✅ 完成"
echo ""

# 步驟 3: 確保資料目錄存在
echo "步驟 3: 確保資料目錄結構存在..."
mkdir -p ./data/backups/daily
mkdir -p ./data/backups/weekly
mkdir -p ./data/backups/monthly
mkdir -p ./data/backups/manual
echo "✅ 完成"
echo ""

# 步驟 4: 重新建構並啟動
echo "步驟 4: 重新建構並啟動容器..."
echo "（這可能需要幾分鐘時間）"
echo ""
$COMPOSE_CMD up -d --build

if [ $? -ne 0 ]; then
    echo ""
    echo "❌ 啟動失敗！查看錯誤訊息："
    $COMPOSE_CMD logs
    exit 1
fi

echo ""
echo "✅ 容器已啟動"
echo ""

# 步驟 5: 等待容器完全啟動
echo "步驟 5: 等待容器完全啟動..."
sleep 5
echo "✅ 完成"
echo ""

# 步驟 6: 檢查容器狀態
echo "步驟 6: 檢查容器狀態..."
$COMPOSE_CMD ps
echo ""

# 步驟 7: 檢查後端日誌
echo "步驟 7: 檢查後端啟動日誌..."
$COMPOSE_CMD logs backend --tail=20
echo ""

# 步驟 8: 驗證資料庫
echo "步驟 8: 驗證資料庫..."
docker exec project-tracker-backend python backend/verify_db.py
echo ""

# 步驟 9: 測試 API
echo "步驟 9: 測試 API..."
echo "健康檢查:"
curl -s http://localhost:8000/health | python3 -m json.tool 2>/dev/null || curl -s http://localhost:8000/health
echo ""
echo ""

echo "專案列表:"
curl -s http://localhost:8000/api/projects/ | python3 -m json.tool 2>/dev/null || curl -s http://localhost:8000/api/projects/
echo ""

echo ""
echo "========================================"
echo "✅ 重啟完成！"
echo "========================================"
echo ""
echo "前端: http://localhost:5173"
echo "後端: http://localhost:8000"
echo "API 文檔: http://localhost:8000/docs"
echo ""
