# Windows 11 安裝指南

## 方案一：最簡化安裝（推薦給受限環境）

此方案不包含 Excel 匯入/匯出功能，但包含所有其他核心功能。

### 前置需求

- Python 3.11 或更高版本
- Node.js 18 或更高版本

### 安裝步驟

1. **下載專案**
   ```cmd
   # 如果有 Git
   git clone <repository-url>
   cd projecttracter

   # 如果沒有 Git，請下載 ZIP 並解壓縮
   ```

2. **雙擊執行批次檔**

   開啟兩個命令提示字元視窗：

   **視窗 1 - 啟動後端：**
   ```cmd
   雙擊 start_backend.bat
   ```

   **視窗 2 - 啟動前端：**
   ```cmd
   雙擊 start_frontend.bat
   ```

3. **開啟瀏覽器**

   前往：http://localhost:5173

### 第一次執行時

批次檔會自動：
- 建立 Python 虛擬環境
- 安裝後端相依套件（最小化版本）
- 初始化資料庫
- 安裝前端相依套件
- 啟動開發伺服器

### 停止服務

在兩個命令提示字元視窗中按 `Ctrl+C`

---

## 方案二：完整安裝（包含 Excel 功能）

### 選項 A：使用預編譯套件

```cmd
# 建立虛擬環境
python -m venv venv
venv\Scripts\activate

# 安裝預編譯版本
pip install --only-binary :all: numpy pandas openpyxl
pip install -r requirements.txt

# 初始化資料庫
python backend/init_db.py

# 啟動後端（新視窗）
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000

# 安裝並啟動前端（另一個新視窗）
cd frontend
npm install
npm run dev
```

### 選項 B：安裝 Visual C++ Build Tools

1. 下載並安裝 Microsoft Visual C++ Build Tools
   - 網址：https://visualstudio.microsoft.com/visual-cpp-build-tools/
   - 選擇「Desktop development with C++」
   - 需要約 6-8 GB 磁碟空間

2. 安裝完成後執行：
   ```cmd
   python -m venv venv
   venv\Scripts\activate
   pip install -r requirements.txt
   ```

### 選項 C：使用 Anaconda

```cmd
# 使用 Anaconda Prompt
conda create -n projecttracker python=3.11
conda activate projecttracker
conda install numpy pandas openpyxl
pip install -r requirements.txt
```

---

## 公司電腦受限環境解決方案

### 1. 申請 IT 部門協助

準備以下資料給 IT 部門：

**需要安裝的軟體：**
- Python 3.11+ (https://www.python.org/)
- Node.js 18+ (https://nodejs.org/)

**Python 套件清單：**
- 最小版本：使用 `requirements-minimal.txt`
- 完整版本：使用 `requirements.txt`

**說明：**
此系統用於專案管理追蹤，在本機執行，不需要網路連線。

### 2. 使用雲端服務

- **Replit**：https://replit.com/
- **Google Colab**：適合測試後端功能

### 3. 檢查現有安裝

```cmd
# 檢查是否已安裝 Python
python --version

# 檢查是否已安裝 Node.js
node --version

# 檢查是否已安裝 npm
npm --version
```

---

## 功能差異比較

| 功能 | 最小化安裝 | 完整安裝 |
|------|-----------|---------|
| WBS 工作項目管理 | ✅ | ✅ |
| 待辦事項管理 | ✅ | ✅ |
| 問題追蹤管理 | ✅ | ✅ |
| 智慧篩選功能 | ✅ | ✅ |
| 資料查詢與檢視 | ✅ | ✅ |
| Excel 匯入 WBS | ❌ | ✅ |
| Excel 匯出功能 | ❌ | ✅ |
| WBS 範本下載 | ❌ | ✅ |

---

## 常見問題

### Q: 批次檔執行後立即關閉？

A: 以滑鼠右鍵點擊批次檔，選擇「以系統管理員身分執行」

### Q: 出現「Python 不是內部或外部命令」？

A: 需要將 Python 加入系統 PATH：
1. 重新安裝 Python
2. 勾選「Add Python to PATH」選項

### Q: 前端無法連接後端？

A: 確認：
1. 後端服務正在執行（http://localhost:8000）
2. 防火牆沒有封鎖 8000 或 5173 埠

### Q: 想要在團隊中共用？

A:
1. 找出電腦的 IP 位址：`ipconfig`
2. 修改 `frontend/src/utils/api.js` 中的 baseURL
3. 團隊成員可透過 `http://<你的IP>:5173` 訪問

---

## 技術支援

如遇問題，請提供：
1. Windows 版本：`winver`
2. Python 版本：`python --version`
3. Node.js 版本：`node --version`
4. 錯誤訊息截圖
