#!/bin/bash
# 啟動後端服務腳本

# 啟動虛擬環境
source venv/bin/activate

# 啟動 FastAPI 服務
echo "🚀 正在啟動 Project Tracker 後端服務..."
echo "📍 API 文件: http://localhost:8000/docs"
echo "📍 健康檢查: http://localhost:8000/health"
echo ""

python -m backend.main
