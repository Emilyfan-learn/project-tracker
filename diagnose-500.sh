#!/bin/bash
# 自動診斷 500 錯誤的完整腳本

echo "=================================="
echo "  專案追蹤系統 - 500 錯誤診斷"
echo "=================================="
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

# 1. 檢查容器狀態
echo "========== 1. 容器狀態 =========="
$COMPOSE_CMD ps
echo ""

# 2. 檢查容器是否運行
if ! docker ps | grep -q projecttracker-backend; then
    echo "❌ 後端容器未運行！"
    echo "嘗試啟動容器..."
    $COMPOSE_CMD up -d
    sleep 5
fi

# 3. 檢查後端日誌
echo "========== 2. 後端日誌（最後 30 行）=========="
$COMPOSE_CMD logs backend --tail=30
echo ""

# 4. 檢查資料庫檔案
echo "========== 3. 資料庫檔案檢查 =========="
echo "主機上的資料庫檔案:"
if [ -f "./data/project_tracking.db" ]; then
    ls -lh ./data/project_tracking.db
    echo "✅ 主機上資料庫文件存在"
else
    echo "❌ 主機上找不到資料庫文件"
fi
echo ""

echo "容器內的資料庫檔案:"
docker exec projecttracker-backend ls -lh /app/data/ 2>/dev/null || echo "❌ 無法檢查容器內資料庫"
echo ""

# 5. 檢查環境變數
echo "========== 4. 環境變數檢查 =========="
docker exec projecttracker-backend printenv | grep DATABASE
echo ""

# 6. 運行資料庫驗證腳本
echo "========== 5. 資料庫驗證 =========="
docker exec projecttracker-backend python backend/verify_db.py
DB_VERIFY_EXIT_CODE=$?
echo ""

# 7. 測試 API
echo "========== 6. API 測試 =========="
echo "測試健康檢查端點:"
curl -s http://localhost:8000/health | python3 -m json.tool 2>/dev/null || curl -s http://localhost:8000/health
echo ""
echo ""

echo "測試專案列表端點:"
RESPONSE=$(curl -s -w "\nHTTP_CODE:%{http_code}" http://localhost:8000/api/projects/)
HTTP_CODE=$(echo "$RESPONSE" | grep HTTP_CODE | cut -d: -f2)
BODY=$(echo "$RESPONSE" | sed '/HTTP_CODE:/d')

echo "HTTP 狀態碼: $HTTP_CODE"
echo "回應內容:"
echo "$BODY" | python3 -m json.tool 2>/dev/null || echo "$BODY"
echo ""

# 8. 總結和建議
echo "========================================="
echo "           診斷總結"
echo "========================================="

if [ "$HTTP_CODE" = "500" ]; then
    echo "❌ 確認有 500 錯誤"
    echo ""
    echo "可能原因："

    if [ $DB_VERIFY_EXIT_CODE -ne 0 ]; then
        echo "  1. ❌ 資料庫驗證失敗 - 資料庫未正確初始化"
        echo ""
        echo "建議修復步驟："
        echo "  ./quick-start.sh"
    else
        echo "  1. ✅ 資料庫驗證通過"
        echo "  2. 檢查上面的後端日誌中的錯誤訊息"
        echo "  3. 可能是應用程式邏輯錯誤"
    fi
elif [ "$HTTP_CODE" = "200" ]; then
    echo "✅ API 正常運作！沒有 500 錯誤"
else
    echo "⚠️  收到非預期的狀態碼: $HTTP_CODE"
fi

echo ""
echo "========================================="
echo "完成診斷"
echo "========================================="
