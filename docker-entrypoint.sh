#!/bin/bash

# 設置環境變數（如果未設置）
export DATABASE_PATH=${DATABASE_PATH:-/app/data/project_tracking.db}

echo "資料庫路徑: $DATABASE_PATH"

# 確保資料目錄存在
mkdir -p /app/data/backups/daily
mkdir -p /app/data/backups/weekly
mkdir -p /app/data/backups/monthly
mkdir -p /app/data/backups/manual

# 如果資料庫不存在，則初始化
if [ ! -f "$DATABASE_PATH" ]; then
    echo "初始化資料庫..."
    python backend/init_db.py
    if [ $? -eq 0 ]; then
        echo "✅ 資料庫初始化完成"
    else
        echo "❌ 資料庫初始化失敗"
        exit 1
    fi
else
    echo "資料庫已存在，跳過初始化"
fi

# 啟動應用程式
echo "啟動應用程式..."
exec uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
