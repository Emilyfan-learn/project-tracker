# 專案追蹤系統 - Windows 11 安裝說明

## 📋 安裝前準備

### 必要軟體

請先安裝以下軟體：

1. **Python 3.9+**
   - 下載：https://www.python.org/downloads/
   - ⚠️ 安裝時務必勾選「Add Python to PATH」

2. **Node.js 18+ (LTS 版本)**
   - 下載：https://nodejs.org/
   - 建議下載 LTS (Long Term Support) 版本

3. **Git for Windows**
   - 下載：https://git-scm.com/download/win
   - 用於克隆專案

### 驗證安裝

按 `Win + R`，輸入 `cmd`，開啟命令提示字元，執行：

```cmd
python --version
node --version
npm --version
git --version
```

如果都能顯示版本號，表示安裝成功！

## 🚀 快速安裝（3 步驟）

### 步驟 1: 下載專案

開啟 **命令提示字元** 或 **PowerShell**：

```cmd
git clone https://github.com/Emilyfan-learn/project-tracker.git
cd project-tracker
```

### 步驟 2: 安裝依賴

```cmd
REM 安裝後端依賴
pip install -r requirements.txt

REM 安裝前端依賴
cd frontend
npm install
cd ..
```

### 步驟 3: 啟動服務

```cmd
REM 一鍵啟動
restart.bat
```

就這麼簡單！🎉

系統會自動：
- ✓ 創建資料庫
- ✓ 啟動後端（http://localhost:8000）
- ✓ 啟動前端（http://localhost:5173）

## 🌐 訪問應用

在瀏覽器打開：**http://localhost:5173**

## 🛑 停止服務

```cmd
stop.bat
```

## 📝 查看日誌

日誌檔案位於 `logs\` 目錄：

```cmd
REM 查看後端日誌
type logs\backend.log

REM 即時監看後端日誌（需要 PowerShell）
Get-Content logs\backend.log -Wait -Tail 20

REM 查看前端日誌
type logs\frontend.log
```

## 🔧 使用虛擬環境（推薦）

虛擬環境可以隔離專案依賴，避免與其他 Python 專案衝突：

### 方法 1: 使用 venv（Python 內建）

```cmd
REM 1. 創建虛擬環境
python -m venv venv

REM 2. 啟動虛擬環境
venv\Scripts\activate

REM 3. 你會看到 (venv) 前綴，表示已進入虛擬環境
REM 現在安裝依賴
pip install -r requirements.txt

REM 4. 離開虛擬環境（當你不需要時）
deactivate
```

### 方法 2: 使用 PowerShell

```powershell
# 1. 創建虛擬環境
python -m venv venv

# 2. 如果遇到執行政策錯誤，需要先執行：
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# 3. 啟動虛擬環境
.\venv\Scripts\Activate.ps1

# 4. 安裝依賴
pip install -r requirements.txt
```

## ⚠️ 常見問題

### 問題 1: 'python' 不是內部或外部命令

**原因**：Python 未加入系統 PATH

**解決方案**：
1. 重新安裝 Python，勾選「Add Python to PATH」
2. 或手動加入 PATH：
   - 搜尋列輸入「環境變數」
   - 點擊「編輯系統環境變數」
   - 點擊「環境變數」
   - 在「系統變數」中找到「Path」，點擊「編輯」
   - 新增 Python 安裝路徑（例如：`C:\Python311\` 和 `C:\Python311\Scripts\`）

### 問題 2: pip install 出現權限錯誤

**解決方案**：

```cmd
REM 使用 --user 選項
pip install --user -r requirements.txt

REM 或以系統管理員身分執行命令提示字元
REM 右鍵點擊「命令提示字元」→「以系統管理員身分執行」
```

### 問題 3: npm install 失敗

**解決方案**：

```cmd
REM 清除 npm 快取
npm cache clean --force

REM 刪除 node_modules
rmdir /s /q frontend\node_modules

REM 重新安裝
cd frontend
npm install
```

### 問題 4: PowerShell 無法執行腳本

**錯誤訊息**：「因為這個系統上已停用指令碼執行」

**解決方案**：

```powershell
# 以系統管理員身分開啟 PowerShell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### 問題 5: 端口被占用

**檢查端口占用**：

```cmd
REM 檢查 8000 端口
netstat -ano | findstr :8000

REM 檢查 5173 端口
netstat -ano | findstr :5173
```

**停止占用端口的進程**：

```cmd
REM 假設 PID 是 12345
taskkill /PID 12345 /F
```

### 問題 6: 防火牆阻擋

如果瀏覽器無法訪問服務，可能被防火牆阻擋：

1. 開啟「Windows Defender 防火牆」
2. 點擊「允許應用程式或功能通過 Windows Defender 防火牆」
3. 點擊「變更設定」
4. 勾選「Python」和「Node.js」

### 問題 7: 資料庫表不存在

**解決方案**：

```cmd
REM 手動初始化資料庫
python backend\init_db.py

REM 或重啟服務
restart.bat
```

## 🛠 手動啟動（進階）

如果不想使用 `restart.bat`，可以手動啟動：

### 啟動後端

開啟**命令提示字元 1**：

```cmd
python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
```

### 啟動前端

開啟**命令提示字元 2**：

```cmd
cd frontend
npm run dev
```

## 📂 檔案位置

- **資料庫**：`data\project_tracking.db`
- **備份**：`data\backups\`
- **日誌**：`logs\backend.log`、`logs\frontend.log`
- **PID 檔案**：`logs\backend.pid`、`logs\frontend.pid`

## 🎯 快捷鍵建議

建立桌面捷徑：

1. 右鍵桌面 → 新增 → 捷徑
2. 位置輸入：`C:\路徑\project-tracker\restart.bat`
3. 命名為「啟動專案追蹤系統」

## 💡 效能優化建議

### 1. 使用 SSD

將專案放在 SSD 上可以大幅提升啟動速度

### 2. 排除防毒掃描

將專案目錄加入防毒軟體的排除清單：
- `C:\path\to\project-tracker\`

### 3. 關閉不必要的背景程式

確保系統有足夠資源運行服務

## 🆘 需要協助

如果以上方法都無法解決問題，請：

1. 查看 `logs\backend.log` 的錯誤訊息
2. 確認 Python 和 Node.js 版本符合需求
3. 到 GitHub Issues 回報問題
4. 聯繫專案維護者

## 📖 更多資訊

- 詳細文檔：[README.md](README.md)
- 一般安裝說明：[INSTALL.md](INSTALL.md)

---

**祝你使用愉快！** 🚀
