#!/bin/bash
# 使用修復後的 docker-compose 啟動服務

echo "🚀 啟動專案（使用修復後的配置）"
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

# 步驟 1: 停止測試容器（如果還在運行）
echo "步驟 1: 停止測試容器..."
docker stop test-backend 2>/dev/null || true
docker rm test-backend 2>/dev/null || true
docker network rm test-network 2>/dev/null || true
echo "✅ 完成"
echo ""

# 步驟 2: 完全清理舊的 docker-compose 狀態
echo "步驟 2: 清理舊的 docker-compose 狀態..."
$COMPOSE_CMD down -v --remove-orphans 2>/dev/null || true
docker rm -f projecttracker-backend projecttracker-frontend 2>/dev/null || true
docker network rm project-tracker_projecttracker-network 2>/dev/null || true
echo "✅ 完成"
echo ""

# 步驟 3: 確保資料目錄存在
echo "步驟 3: 確保資料目錄存在..."
mkdir -p ./data/backups/{daily,weekly,monthly,manual}
echo "✅ 完成"
echo ""

# 步驟 4: 啟動服務
echo "步驟 4: 啟動服務..."
$COMPOSE_CMD up -d

if [ $? -ne 0 ]; then
    echo ""
    echo "❌ 啟動失敗！查看錯誤："
    $COMPOSE_CMD logs
    exit 1
fi

echo "✅ 服務已啟動"
echo ""

# 步驟 5: 等待服務完全啟動
echo "步驟 5: 等待服務完全啟動（15 秒）..."
sleep 15
echo "✅ 完成"
echo ""

# 步驟 6: 檢查容器狀態
echo "步驟 6: 檢查容器狀態..."
$COMPOSE_CMD ps
echo ""

# 步驟 7: 檢查後端日誌
echo "步驟 7: 檢查後端日誌..."
$COMPOSE_CMD logs backend --tail=20
echo ""

# 步驟 8: 檢查前端日誌
echo "步驟 8: 檢查前端日誌..."
$COMPOSE_CMD logs frontend --tail=20
echo ""

# 步驟 9: 測試 API
echo "步驟 9: 測試後端 API..."
echo ""

echo "健康檢查:"
HEALTH=$(curl -s http://localhost:8000/health)
echo "$HEALTH" | python3 -m json.tool 2>/dev/null || echo "$HEALTH"
echo ""

echo "專案列表 API:"
RESPONSE=$(curl -s -w "\nHTTP_CODE:%{http_code}" http://localhost:8000/api/projects/)
HTTP_CODE=$(echo "$RESPONSE" | grep HTTP_CODE | cut -d: -f2)
BODY=$(echo "$RESPONSE" | sed '/HTTP_CODE:/d')

echo "HTTP 狀態碼: $HTTP_CODE"
echo "回應:"
echo "$BODY" | python3 -m json.tool 2>/dev/null || echo "$BODY"
echo ""

# 步驟 10: 總結
echo ""
echo "========================================"
if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ 啟動成功！"
    echo ""
    echo "服務地址："
    echo "  前端: http://localhost:5173"
    echo "  後端 API: http://localhost:8000"
    echo "  API 文檔: http://localhost:8000/docs"
    echo ""
    echo "在瀏覽器開啟前端測試："
    echo "  open http://localhost:5173"
elif [ "$HTTP_CODE" = "500" ]; then
    echo "⚠️  服務已啟動，但 API 返回 500 錯誤"
    echo ""
    echo "查看後端日誌："
    echo "  $COMPOSE_CMD logs backend"
else
    echo "❌ API 測試失敗（狀態碼: $HTTP_CODE）"
    echo ""
    echo "查看日誌："
    echo "  $COMPOSE_CMD logs"
fi
echo "========================================"
