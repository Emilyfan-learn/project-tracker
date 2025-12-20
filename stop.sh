#!/bin/bash
# 停止 Docker 容器

echo "🛑 停止專案追蹤系統..."
docker stop projecttracker-backend projecttracker-frontend 2>/dev/null
echo "✅ 服務已停止"
