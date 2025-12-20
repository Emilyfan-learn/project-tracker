#!/bin/bash

echo "========================================"
echo "  專案追蹤系統 - 快速啟動"
echo "========================================"
echo ""

# 檢查是否在正確的目錄
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ 請在專案根目錄執行此腳本"
    echo "   cd ~/project/project-tracker"
    exit 1
fi

# 停止舊容器
echo "1. 停止舊容器..."
docker compose down 2>/dev/null || true

# 刪除舊資料庫（確保乾淨啟動）
echo "2. 清理舊資料庫..."
if [ -f "data/project_tracking.db" ]; then
    echo "   刪除舊資料庫..."
    rm -f data/project_tracking.db
fi

# 啟動容器
echo "3. 啟動容器..."
./start_docker.sh

echo ""
echo "========================================"
echo "✅ 啟動完成！"
echo "========================================"
echo ""
echo "如果看到「✅ 資料庫初始化完成」，表示一切正常"
echo ""
echo "訪問應用程式："
echo "  前端: http://localhost:5173"
echo "  後端: http://localhost:8000/docs"
echo ""
echo "查看日誌："
echo "  docker compose logs -f"
echo ""
echo "停止服務："
echo "  ./stop_docker.sh"
echo ""
