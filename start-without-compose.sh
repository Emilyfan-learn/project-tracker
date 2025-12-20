#!/bin/bash
# 不使用 docker-compose，直接啟動容器

echo "🚀 直接啟動容器（不使用 docker-compose）"
echo "========================================"
echo ""

# 步驟 1: 清理所有舊容器
echo "步驟 1: 清理所有舊容器..."
docker stop projecttracker-backend projecttracker-frontend test-backend 2>/dev/null || true
docker rm -f projecttracker-backend projecttracker-frontend test-backend 2>/dev/null || true
echo "✅ 完成"
echo ""

# 步驟 2: 清理舊網絡
echo "步驟 2: 清理舊網絡..."
docker network rm projecttracker-network test-network project-tracker_projecttracker-network 2>/dev/null || true
echo "✅ 完成"
echo ""

# 步驟 3: 創建新網絡
echo "步驟 3: 創建網絡..."
docker network create projecttracker-network
echo "✅ 完成"
echo ""

# 步驟 4: 確保資料目錄存在
echo "步驟 4: 確保資料目錄存在..."
mkdir -p ./data/backups/{daily,weekly,monthly,manual}
echo "✅ 完成"
echo ""

# 步驟 5: 建構後端映像
echo "步驟 5: 建構後端映像..."
docker build -t projecttracker-backend -f Dockerfile.backend .
if [ $? -ne 0 ]; then
    echo "❌ 後端建構失敗"
    exit 1
fi
echo "✅ 完成"
echo ""

# 步驟 6: 建構前端映像
echo "步驟 6: 建構前端映像..."
docker build -t projecttracker-frontend -f frontend/Dockerfile ./frontend
if [ $? -ne 0 ]; then
    echo "❌ 前端建構失敗"
    exit 1
fi
echo "✅ 完成"
echo ""

# 步驟 7: 啟動後端容器
echo "步驟 7: 啟動後端容器..."
docker run -d \
  --name projecttracker-backend \
  --network projecttracker-network \
  -p 8000:8000 \
  -v "$(pwd)/data:/app/data" \
  -v "$(pwd)/backend:/app/backend" \
  -e DATABASE_PATH=/app/data/project_tracking.db \
  --restart unless-stopped \
  projecttracker-backend

if [ $? -ne 0 ]; then
    echo "❌ 後端啟動失敗"
    docker logs projecttracker-backend
    exit 1
fi
echo "✅ 後端已啟動"
echo ""

# 步驟 8: 等待後端完全啟動
echo "步驟 8: 等待後端完全啟動（10 秒）..."
sleep 10
echo "✅ 完成"
echo ""

# 步驟 9: 啟動前端容器
echo "步驟 9: 啟動前端容器..."
docker run -d \
  --name projecttracker-frontend \
  --network projecttracker-network \
  -p 5173:5173 \
  -v "$(pwd)/frontend:/app" \
  -v /app/node_modules \
  --restart unless-stopped \
  projecttracker-frontend

if [ $? -ne 0 ]; then
    echo "❌ 前端啟動失敗"
    docker logs projecttracker-frontend
    exit 1
fi
echo "✅ 前端已啟動"
echo ""

# 步驟 10: 等待前端完全啟動
echo "步驟 10: 等待前端完全啟動（10 秒）..."
sleep 10
echo "✅ 完成"
echo ""

# 步驟 11: 檢查容器狀態
echo "步驟 11: 檢查容器狀態..."
docker ps | grep projecttracker
echo ""

# 步驟 12: 檢查後端日誌
echo "步驟 12: 後端日誌..."
docker logs projecttracker-backend --tail=20
echo ""

# 步驟 13: 檢查前端日誌
echo "步驟 13: 前端日誌..."
docker logs projecttracker-frontend --tail=20
echo ""

# 步驟 14: 測試 API
echo "步驟 14: 測試後端 API..."
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

# 步驟 15: 總結
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
    echo "查看日誌："
    echo "  docker logs projecttracker-backend"
    echo "  docker logs projecttracker-frontend"
    echo ""
    echo "停止服務："
    echo "  docker stop projecttracker-backend projecttracker-frontend"
    echo ""
    echo "在瀏覽器開啟："
    echo "  open http://localhost:5173"
else
    echo "⚠️  容器已啟動，但 API 測試失敗（狀態碼: $HTTP_CODE）"
    echo ""
    echo "查看後端日誌："
    echo "  docker logs projecttracker-backend"
fi
echo "========================================"
