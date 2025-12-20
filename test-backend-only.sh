#!/bin/bash
# 只測試後端容器，隔離問題

echo "🔍 測試後端容器（不啟動前端）"
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

# 步驟 1: 清理
echo "步驟 1: 清理舊容器..."
docker stop projecttracker-backend project-tracker-backend 2>/dev/null || true
docker rm -f projecttracker-backend project-tracker-backend 2>/dev/null || true
docker network rm project-tracker_projecttracker-network 2>/dev/null || true
echo "✅ 完成"
echo ""

# 步驟 2: 建構後端
echo "步驟 2: 建構後端容器..."
docker build -t test-backend -f Dockerfile.backend .

if [ $? -ne 0 ]; then
    echo "❌ 建構失敗！請檢查上面的錯誤訊息"
    exit 1
fi
echo "✅ 建構完成"
echo ""

# 步驟 3: 創建網絡
echo "步驟 3: 創建網絡..."
docker network create test-network 2>/dev/null || true
echo "✅ 完成"
echo ""

# 步驟 4: 啟動後端容器
echo "步驟 4: 啟動後端容器..."
docker run -d \
  --name test-backend \
  --network test-network \
  -p 8000:8000 \
  -v "$(pwd)/data:/app/data" \
  -v "$(pwd)/backend:/app/backend" \
  -e DATABASE_PATH=/app/data/project_tracking.db \
  test-backend

if [ $? -ne 0 ]; then
    echo "❌ 啟動失敗！"
    exit 1
fi

echo "✅ 容器已啟動"
echo ""

# 步驟 5: 等待啟動
echo "步驟 5: 等待服務啟動（10 秒）..."
sleep 10
echo "✅ 完成"
echo ""

# 步驟 6: 檢查容器狀態
echo "步驟 6: 檢查容器狀態..."
docker ps -a | grep test-backend
echo ""

CONTAINER_STATUS=$(docker inspect -f '{{.State.Status}}' test-backend 2>/dev/null)
echo "容器狀態: $CONTAINER_STATUS"
echo ""

if [ "$CONTAINER_STATUS" != "running" ]; then
    echo "❌ 容器未運行！查看日誌："
    docker logs test-backend
    exit 1
fi

# 步驟 7: 查看容器日誌
echo "步驟 7: 查看容器日誌..."
docker logs test-backend
echo ""

# 步驟 8: 測試 API
echo "步驟 8: 測試 API..."
echo ""

echo "A. 健康檢查:"
curl -s http://localhost:8000/health | python3 -m json.tool 2>/dev/null || curl -s http://localhost:8000/health
echo ""
echo ""

echo "B. 根端點:"
curl -s http://localhost:8000/ | python3 -m json.tool 2>/dev/null || curl -s http://localhost:8000/
echo ""
echo ""

echo "C. 專案列表:"
RESPONSE=$(curl -s -w "\nHTTP_CODE:%{http_code}" http://localhost:8000/api/projects/)
HTTP_CODE=$(echo "$RESPONSE" | grep HTTP_CODE | cut -d: -f2)
BODY=$(echo "$RESPONSE" | sed '/HTTP_CODE:/d')

echo "HTTP 狀態碼: $HTTP_CODE"
echo "回應內容:"
echo "$BODY" | python3 -m json.tool 2>/dev/null || echo "$BODY"
echo ""

# 步驟 9: 總結
echo ""
echo "========================================"
if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ 後端測試成功！"
    echo ""
    echo "後端正常運行在 http://localhost:8000"
    echo "API 文檔: http://localhost:8000/docs"
    echo ""
    echo "要停止測試容器，運行："
    echo "  docker stop test-backend"
    echo "  docker rm test-backend"
elif [ "$HTTP_CODE" = "500" ]; then
    echo "⚠️  後端啟動成功，但 API 返回 500 錯誤"
    echo ""
    echo "這通常是資料庫或應用邏輯問題。"
    echo "查看完整日誌："
    echo "  docker logs test-backend"
else
    echo "❌ 後端測試失敗"
    echo "查看日誌："
    echo "  docker logs test-backend"
fi
echo "========================================"
