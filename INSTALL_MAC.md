# 📱 macOS 安裝指南

這份指南將幫助您在 MacBook 上安裝和運行專案追蹤系統。

---

## 🔧 前置需求

### 1. 安裝 Homebrew

打開「終端機」(Terminal)，執行以下指令：

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### 2. 安裝 Python 和 Node.js

```bash
# 安裝 Python 3.11
brew install python@3.11

# 安裝 Node.js
brew install node

# 安裝 Git（如果還沒安裝）
brew install git
```

### 3. 驗證安裝

```bash
python3 --version  # 應該顯示 3.11.x
node --version     # 應該顯示 v18.x 或更高
npm --version      # 應該顯示 9.x 或更高
git --version      # 應該顯示 2.x 或更高
```

---

## 📥 下載專案

### 方法 1：從 GitHub 克隆（推薦）

```bash
# 移動到您想要存放專案的位置
cd ~/Documents

# 克隆專案
git clone https://github.com/Emilyfan-learn/project-tracker.git

# 進入專案目錄
cd project-tracker

# 切換到最新功能分支
git checkout claude/setup-project-structure-01Q1PZ68MjHUgCd8KMjhnzGy
```

### 方法 2：下載 ZIP 壓縮檔

1. 訪問 https://github.com/Emilyfan-learn/project-tracker
2. 點擊綠色的「Code」按鈕
3. 選擇「Download ZIP」
4. 解壓縮到 `~/Documents/project-tracker`

---

## ⚙️ 設置專案

### 1. 設置後端

```bash
cd ~/Documents/project-tracker

# 建立 Python 虛擬環境
python3 -m venv venv

# 啟動虛擬環境
source venv/bin/activate

# 安裝 Python 套件
pip install -r requirements.txt

# 初始化資料庫
python backend/init_db.py
```

您應該會看到：
```
✅ 資料庫初始化成功
```

### 2. 設置前端

```bash
# 進入前端目錄
cd frontend

# 安裝相依套件
npm install

# 返回專案根目錄
cd ..
```

---

## 🚀 啟動系統

### 方法 1：手動啟動（兩個終端機視窗）

**終端機視窗 1 - 啟動後端：**
```bash
cd ~/Documents/project-tracker
source venv/bin/activate
python backend/main.py
```

保持這個視窗開啟。您會看到：
```
後端服務器運行在 http://127.0.0.1:5000
```

**終端機視窗 2 - 啟動前端：**
```bash
cd ~/Documents/project-tracker/frontend
npm run dev
```

保持這個視窗開啟。您會看到：
```
前端服務器運行在 http://localhost:5173
```

**開啟瀏覽器：**
訪問 http://localhost:5173

### 方法 2：使用啟動腳本（推薦）

```bash
cd ~/Documents/project-tracker

# 設置執行權限（只需執行一次）
chmod +x start.sh stop.sh

# 啟動系統
./start.sh
```

系統會在背景運行。然後在瀏覽器中打開：http://localhost:5173

**停止系統：**
```bash
./stop.sh
```

---

## 🎯 加入 Dock（可選）

如果您想要在 Dock 中快速啟動系統：

### 1. 創建 macOS 應用程式

```bash
cd ~/Documents/project-tracker

# 設置執行權限
chmod +x create-mac-app.sh

# 創建應用程式
./create-mac-app.sh
```

### 2. 將應用程式加入 Dock

1. 打開 Finder
2. 按 `Cmd + Shift + G`，輸入：`~/Applications`
3. 找到「專案追蹤系統.app」
4. 將它拖曳到 Dock

### 3. 使用

- **啟動**：點擊 Dock 中的圖示
- **停止**：在終端機中執行 `./stop.sh`

---

## 🔄 更新專案

當有新版本時：

```bash
cd ~/Documents/project-tracker

# 停止系統（如果正在運行）
./stop.sh

# 拉取最新代碼
git pull origin claude/setup-project-structure-01Q1PZ68MjHUgCd8KMjhnzGy

# 更新 Python 套件
source venv/bin/activate
pip install -r requirements.txt

# 更新前端套件
cd frontend
npm install
cd ..

# 重新啟動
./start.sh
```

---

## 📝 常見問題

### Q1: 首次運行時出現「無法打開應用程式」的警告

**解決方法：**
1. 打開「系統偏好設定」> 「安全性與隱私」
2. 點擊「一般」標籤
3. 點擊「仍要打開」

### Q2: 端口被占用

如果看到錯誤：`Address already in use`

**解決方法：**
```bash
# 查找占用端口的進程
lsof -i :5000  # 後端端口
lsof -i :5173  # 前端端口

# 終止進程（替換 PID）
kill -9 <PID>
```

### Q3: Python 虛擬環境啟動失敗

**解決方法：**
```bash
# 刪除舊的虛擬環境
rm -rf venv

# 重新創建
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### Q4: npm install 失敗

**解決方法：**
```bash
cd frontend

# 清除緩存
npm cache clean --force

# 刪除 node_modules
rm -rf node_modules package-lock.json

# 重新安裝
npm install
```

---

## 🎉 完成！

現在您可以在 MacBook 上使用專案追蹤系統了！

**系統功能：**
- ✅ WBS 階層式管理（可折疊樹狀結構）
- ✅ 連續新增 WBS 項目
- ✅ 問題追蹤管理
- ✅ 待辦事項管理
- ✅ Excel 匯入/匯出
- ✅ 甘特圖視圖
- ✅ 儀表板概覽

**快速鍵：**
- 啟動系統：`./start.sh`
- 停止系統：`./stop.sh`
- 訪問網址：http://localhost:5173

如有問題，請查看終端機的錯誤訊息或聯繫技術支援。
