#!/bin/bash

# Project Tracker 一鍵式重啟腳本
# 用途：停止現有服務並重新啟動前端和後端

set -e  # 遇到錯誤立即退出

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
echo -e "${BLUE}   🚀 Project Tracker 一鍵式重啟${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# ============================================
# 1. 停止現有進程
# ============================================
echo -e "${YELLOW}📋 步驟 1/4: 停止現有進程...${NC}"

# 停止後端（查找 uvicorn 進程）
BACKEND_PIDS=$(ps aux | grep "[u]vicorn.*backend.main:app" | awk '{print $2}')
if [ ! -z "$BACKEND_PIDS" ]; then
    echo -e "${BLUE}  停止後端進程: $BACKEND_PIDS${NC}"
    echo "$BACKEND_PIDS" | xargs kill 2>/dev/null || true
    sleep 1
else
    echo -e "${BLUE}  沒有運行中的後端進程${NC}"
fi

# 停止前端（查找 vite 和 node 進程）
FRONTEND_PIDS=$(ps aux | grep "[v]ite\|project-tracker-frontend" | awk '{print $2}')
if [ ! -z "$FRONTEND_PIDS" ]; then
    echo -e "${BLUE}  停止前端進程: $FRONTEND_PIDS${NC}"
    echo "$FRONTEND_PIDS" | xargs kill 2>/dev/null || true
    sleep 1
else
    echo -e "${BLUE}  沒有運行中的前端進程${NC}"
fi

echo -e "${GREEN}  ✓ 完成${NC}"
echo ""

# ============================================
# 2. 檢查環境
# ============================================
echo -e "${YELLOW}🔍 步驟 2/4: 檢查環境...${NC}"

# 檢查 Python
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}  ❌ Python3 未安裝${NC}"
    exit 1
fi
echo -e "${GREEN}  ✓ Python3: $(python3 --version)${NC}"

# 檢查 Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}  ❌ Node.js 未安裝${NC}"
    exit 1
fi
echo -e "${GREEN}  ✓ Node.js: $(node --version)${NC}"

# 檢查 npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}  ❌ npm 未安裝${NC}"
    exit 1
fi
echo -e "${GREEN}  ✓ npm: $(npm --version)${NC}"

echo ""

# ============================================
# 3. 啟動後端
# ============================================
echo -e "${YELLOW}🔧 步驟 3/4: 啟動後端服務...${NC}"

# 創建日誌目錄
mkdir -p logs

# 啟動後端
cd "$SCRIPT_DIR"
nohup python3 -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload > logs/backend.log 2>&1 &
BACKEND_PID=$!
echo $BACKEND_PID > logs/backend.pid

echo -e "${GREEN}  ✓ 後端已啟動 (PID: $BACKEND_PID)${NC}"
echo -e "${BLUE}    URL: http://localhost:8000${NC}"
echo -e "${BLUE}    日誌: logs/backend.log${NC}"

# 等待後端啟動
echo -e "${BLUE}    等待後端啟動...${NC}"
sleep 3

# 檢查後端是否成功啟動
if curl -s http://localhost:8000/health > /dev/null 2>&1; then
    echo -e "${GREEN}  ✓ 後端健康檢查通過${NC}"
else
    echo -e "${YELLOW}  ⚠ 後端可能還在啟動中...${NC}"
fi

echo ""

# ============================================
# 4. 啟動前端
# ============================================
echo -e "${YELLOW}🎨 步驟 4/4: 啟動前端服務...${NC}"

cd "$SCRIPT_DIR/frontend"
nohup npm run dev > ../logs/frontend.log 2>&1 &
FRONTEND_PID=$!
echo $FRONTEND_PID > ../logs/frontend.pid

echo -e "${GREEN}  ✓ 前端已啟動 (PID: $FRONTEND_PID)${NC}"
echo -e "${BLUE}    URL: http://localhost:5173${NC}"
echo -e "${BLUE}    日誌: logs/frontend.log${NC}"

# 等待前端啟動
echo -e "${BLUE}    等待前端啟動...${NC}"
sleep 3

echo ""

# ============================================
# 完成
# ============================================
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}   ✨ 啟動完成！${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "📊 ${BLUE}服務狀態${NC}"
echo -e "  ┌─ 後端 API:  ${GREEN}http://localhost:8000${NC}"
echo -e "  └─ 前端頁面: ${GREEN}http://localhost:5173${NC}"
echo ""
echo -e "📝 ${BLUE}查看即時日誌${NC}"
echo -e "  ┌─ 後端: ${YELLOW}tail -f logs/backend.log${NC}"
echo -e "  └─ 前端: ${YELLOW}tail -f logs/frontend.log${NC}"
echo ""
echo -e "🛑 ${BLUE}停止服務${NC}"
echo -e "  ┌─ 執行停止腳本: ${YELLOW}./stop.sh${NC}"
echo -e "  └─ 手動停止: ${YELLOW}kill $BACKEND_PID $FRONTEND_PID${NC}"
echo ""
