#!/bin/bash

# 專案追蹤系統啟動腳本

# 獲取腳本所在目錄
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
cd "$SCRIPT_DIR"

# 顏色定義
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}======================================"
echo -e "專案追蹤系統 啟動中..."
echo -e "======================================${NC}\n"

# 啟動後端
echo -e "${GREEN}[1/2] 啟動後端服務...${NC}"
source venv/bin/activate
python backend/main.py &
BACKEND_PID=$!
echo -e "後端服務 PID: $BACKEND_PID"

# 等待後端啟動
sleep 3

# 啟動前端
echo -e "\n${GREEN}[2/2] 啟動前端服務...${NC}"
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..
echo -e "前端服務 PID: $FRONTEND_PID"

# 保存 PID 到文件
echo "$BACKEND_PID" > .backend.pid
echo "$FRONTEND_PID" > .frontend.pid

echo -e "\n${BLUE}======================================"
echo -e "✅ 系統啟動成功！"
echo -e "======================================${NC}"
echo -e "${GREEN}後端：${NC} http://127.0.0.1:5000"
echo -e "${GREEN}前端：${NC} http://localhost:5173"
echo -e "\n${BLUE}提示：${NC}"
echo -e "  - 在瀏覽器中打開 ${GREEN}http://localhost:5173${NC}"
echo -e "  - 使用 ${GREEN}./stop.sh${NC} 停止服務"
echo -e "  - 按 Ctrl+C 不會停止服務（服務在背景運行）\n"

# 保持腳本運行並顯示日誌選項
echo -e "${BLUE}服務已在背景運行${NC}"
echo "如需查看日誌，請檢查終端機輸出"
