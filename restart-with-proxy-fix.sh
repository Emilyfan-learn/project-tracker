#!/bin/bash
# 完整重啟前後端服務（應用 Vite 代理修復）

echo "🔄 重啟服務（應用 Vite 代理修復）"
echo "========================================"
echo ""

# 步驟 1: 停止所有容器
echo "步驟 1: 停止所有容器..."
docker stop projecttracker-backend projecttracker-frontend 2>/dev/null || true
docker rm projecttracker-backend projecttracker-frontend 2>/dev/null || true
echo "✅ 完成"
echo ""

# 步驟 2: 確保網絡存在
echo "步驟 2: 確保 Docker 網絡存在..."
docker network create projecttracker-network 2>/dev/null || echo "網絡已存在"
echo "✅ 完成"
echo ""

# 步驟 3: 重新建構後端
echo "步驟 3: 重新建構後端..."
docker build -t projecttracker-backend -f Dockerfile.backend . --quiet
echo "✅ 完成"
echo ""

# 步驟 4: 啟動後端
echo "步驟 4: 啟動後端容器..."
docker run -d \
  --name projecttracker-backend \
  --network projecttracker-network \
  -p 8000:8000 \
  -v "$(pwd)/data:/app/data" \
  -v "$(pwd)/backend:/app/backend" \
  -e DATABASE_PATH=/app/data/project_tracking.db \
  --restart unless-stopped \
  projecttracker-backend

echo "✅ 後端已啟動"
echo ""

# 步驟 5: 等待後端啟動
echo "步驟 5: 等待後端啟動（10 秒）..."
sleep 10
echo "✅ 完成"
echo ""

# 步驟 6: 重新建構前端（包含新的 vite.config.js）
echo "步驟 6: 重新建構前端（包含代理修復）..."
docker build -t projecttracker-frontend -f frontend/Dockerfile ./frontend --quiet
echo "✅ 完成"
echo ""

# 步驟 7: 啟動前端
echo "步驟 7: 啟動前端容器..."
docker run -d \
  --name projecttracker-frontend \
  --network projecttracker-network \
  -p 5173:5173 \
  -v "$(pwd)/frontend:/app" \
  -v /app/node_modules \
  --restart unless-stopped \
  projecttracker-frontend

echo "✅ 前端已啟動"
echo ""

# 步驟 8: 等待前端啟動
echo "步驟 8: 等待前端啟動（15 秒）..."
sleep 15
echo "✅ 完成"
echo ""

# 步驟 9: 檢查容器狀態
echo "步驟 9: 檢查容器狀態..."
docker ps | grep projecttracker
echo ""

# 步驟 10: 檢查後端日誌
echo "步驟 10: 後端日誌（最後 10 行）..."
docker logs projecttracker-backend --tail=10
echo ""

# 步驟 11: 檢查前端日誌
echo "步驟 11: 前端日誌（查找 Vite 啟動訊息）..."
docker logs projecttracker-frontend 2>&1 | grep -A5 "VITE" || docker logs projecttracker-frontend --tail=20
echo ""

# 步驟 12: 測試後端 API
echo "步驟 12: 測試後端 API..."
HEALTH=$(curl -s http://localhost:8000/health)
echo "後端健康檢查: $HEALTH"
echo ""

# 步驟 13: 測試前端訪問
echo "步驟 13: 測試前端訪問..."
FRONTEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5173)
echo "前端狀態碼: $FRONTEND_STATUS"
echo ""

# 步驟 14: 在容器內測試代理
echo "步驟 14: 測試前端容器內的代理配置..."
docker exec projecttracker-frontend ping -c 2 projecttracker-backend 2>/dev/null || \
  echo "⚠️  無法 ping 後端容器（這在某些環境下是正常的）"
echo ""

# 總結
echo "========================================"
if [ "$FRONTEND_STATUS" = "200" ]; then
    echo "✅ 服務重啟成功！"
    echo ""
    echo "服務地址："
    echo "  前端: http://localhost:5173"
    echo "  後端: http://localhost:8000"
    echo "  API 文檔: http://localhost:8000/docs"
    echo ""
    echo "下一步："
    echo "  1. 在瀏覽器開啟 http://localhost:5173"
    echo "  2. 按 Cmd+Shift+R 強制刷新（清除緩存）"
    echo "  3. 檢查 Dashboard 是否正常載入"
    echo ""
    echo "如果仍有 500 錯誤："
    echo "  1. 按 F12 開啟開發者工具"
    echo "  2. 查看 Console 和 Network 標籤"
    echo "  3. 運行: docker logs projecttracker-frontend"
else
    echo "⚠️  前端可能未正常啟動"
    echo ""
    echo "查看日誌："
    echo "  docker logs projecttracker-frontend"
    echo "  docker logs projecttracker-backend"
fi
echo "========================================"
