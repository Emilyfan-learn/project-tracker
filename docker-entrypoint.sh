#!/bin/bash

# 確保資料目錄存在
mkdir -p /app/data/backups/daily
mkdir -p /app/data/backups/weekly
mkdir -p /app/data/backups/monthly
mkdir -p /app/data/backups/manual

# 如果資料庫不存在，則初始化
if [ ! -f /app/data/project_tracking.db ]; then
    echo "初始化資料庫..."
    python backend/init_db.py
    echo "資料庫初始化完成"
else
    echo "資料庫已存在，跳過初始化"
fi

# 啟動應用程式
echo "啟動應用程式..."
exec uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
