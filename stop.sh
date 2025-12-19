#!/bin/bash

# 專案追蹤系統停止腳本

# 獲取腳本所在目錄
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
cd "$SCRIPT_DIR"

# 顏色定義
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}======================================"
echo -e "專案追蹤系統 停止中..."
echo -e "======================================${NC}\n"

# 停止後端
if [ -f .backend.pid ]; then
    BACKEND_PID=$(cat .backend.pid)
    echo -e "${GREEN}停止後端服務 (PID: $BACKEND_PID)...${NC}"
    kill $BACKEND_PID 2>/dev/null && echo "✅ 後端服務已停止" || echo "⚠️  後端服務可能已經停止"
    rm .backend.pid
else
    echo -e "${RED}未找到後端 PID 文件${NC}"
fi

# 停止前端
if [ -f .frontend.pid ]; then
    FRONTEND_PID=$(cat .frontend.pid)
    echo -e "${GREEN}停止前端服務 (PID: $FRONTEND_PID)...${NC}"
    kill $FRONTEND_PID 2>/dev/null && echo "✅ 前端服務已停止" || echo "⚠️  前端服務可能已經停止"
    rm .frontend.pid
else
    echo -e "${RED}未找到前端 PID 文件${NC}"
fi

# 清理殘留的 Python 和 Node 進程（可選）
echo -e "\n${GREEN}清理可能的殘留進程...${NC}"
pkill -f "python backend/main.py" 2>/dev/null
pkill -f "vite" 2>/dev/null

echo -e "\n${BLUE}======================================"
echo -e "✅ 系統已停止"
echo -e "======================================${NC}\n"
