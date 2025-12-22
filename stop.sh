#!/bin/bash

# Project Tracker 停止腳本
# 用途：停止前端和後端服務

# 獲取腳本所在目錄
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# 顏色定義
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}   🛑 Project Tracker 停止服務${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

STOPPED=0

# 從 PID 文件停止
if [ -f "logs/backend.pid" ]; then
    BACKEND_PID=$(cat logs/backend.pid)
    if ps -p $BACKEND_PID > /dev/null 2>&1; then
        echo -e "${YELLOW}停止後端進程 (PID: $BACKEND_PID)...${NC}"
        kill $BACKEND_PID 2>/dev/null
        STOPPED=$((STOPPED + 1))
    fi
    rm -f logs/backend.pid
fi

if [ -f "logs/frontend.pid" ]; then
    FRONTEND_PID=$(cat logs/frontend.pid)
    if ps -p $FRONTEND_PID > /dev/null 2>&1; then
        echo -e "${YELLOW}停止前端進程 (PID: $FRONTEND_PID)...${NC}"
        kill $FRONTEND_PID 2>/dev/null
        STOPPED=$((STOPPED + 1))
    fi
    rm -f logs/frontend.pid
fi

# 查找並停止所有相關進程
echo -e "${YELLOW}檢查其他相關進程...${NC}"

# 停止後端
BACKEND_PIDS=$(ps aux | grep "[u]vicorn.*backend.main:app" | awk '{print $2}')
if [ ! -z "$BACKEND_PIDS" ]; then
    echo -e "${BLUE}  停止後端進程: $BACKEND_PIDS${NC}"
    echo "$BACKEND_PIDS" | xargs kill 2>/dev/null || true
    STOPPED=$((STOPPED + 1))
fi

# 停止前端
FRONTEND_PIDS=$(ps aux | grep "[v]ite\|project-tracker-frontend" | awk '{print $2}')
if [ ! -z "$FRONTEND_PIDS" ]; then
    echo -e "${BLUE}  停止前端進程: $FRONTEND_PIDS${NC}"
    echo "$FRONTEND_PIDS" | xargs kill 2>/dev/null || true
    STOPPED=$((STOPPED + 1))
fi

echo ""
if [ $STOPPED -gt 0 ]; then
    echo -e "${GREEN}✅ 服務已停止${NC}"
else
    echo -e "${YELLOW}ℹ️  沒有運行中的服務${NC}"
fi
echo ""
