# macOS 安裝指南

## 方法一：直接安裝（推薦）

### 前置需求

macOS 通常已預裝 Python，但建議使用 Homebrew 安裝最新版本。

#### 1. 安裝 Homebrew（如果尚未安裝）

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

#### 2. 安裝 Python 和 Node.js

```bash
# 安裝 Python 3.11+
brew install python@3.11

# 安裝 Node.js
brew install node
```

### 安裝步驟

#### 1. 下載專案

```bash
# 使用 Git
git clone <repository-url>
cd project-tracker

# 或下載 ZIP 後解壓縮
```

#### 2. 設定執行權限

```bash
chmod +x start_backend.sh
chmod +x start_frontend.sh
chmod +x start_all.sh
```

#### 3. 啟動專案

**選項 A - 一鍵啟動（推薦）：**

```bash
./start_all.sh
```

**選項 B - 分別啟動：**

開啟兩個終端視窗：

```bash
# 終端 1 - 後端
./start_backend.sh

# 終端 2 - 前端
./start_frontend.sh
```

#### 4. 開啟瀏覽器

前往：http://localhost:5173

---

## 方法二：使用 Docker（容器化部署）

### 前置需求

```bash
# 安裝 Docker Desktop for Mac
brew install --cask docker
```

### 安裝步驟

#### 1. 建立並啟動容器

```bash
# 一鍵啟動（Docker Desktop 使用 docker compose 不是 docker-compose）
docker compose up -d

# 查看日誌
docker compose logs -f
```

#### 2. 開啟瀏覽器

前往：http://localhost:5173

#### 3. 停止服務

```bash
docker compose down
```

**注意：** 如果您使用的是舊版 Docker，命令可能是 `docker-compose`（有連字符）

---

## 加入 macOS Dock（快捷啟動）

### 方法一：使用 Automator 建立應用程式

1. **開啟 Automator**
   - 打開「應用程式」→「Automator」
   - 選擇「新增文件」→「應用程式」

2. **建立啟動腳本**
   - 在左側搜尋「執行 Shell 指令碼」
   - 拖曳到右側工作流程區域
   - 輸入以下內容：

   ```bash
   # 開啟終端並執行啟動腳本
   osascript -e 'tell application "Terminal"
       activate
       do script "cd /完整路徑/project-tracker && ./start_all.sh"
   end tell'
   ```

   **注意：** 請將 `/完整路徑/project-tracker` 替換為您的實際專案路徑

3. **儲存應用程式**
   - 檔案 → 儲存
   - 名稱：「Project Tracker」
   - 儲存位置：「應用程式」資料夾

4. **設定圖示（可選）**
   - 在專案目錄建立 `app-icon.png`
   - 右鍵點擊 Automator 應用程式 → 「顯示簡介」
   - 將圖示拖曳到左上角圖示區域

5. **加入 Dock**
   - 從「應用程式」資料夾拖曳「Project Tracker」到 Dock

### 方法二：使用 AppleScript 建立應用程式

1. **開啟「腳本編輯器」**（在「應用程式」→「工具程式」）

2. **輸入以下腳本**：

   ```applescript
   tell application "Terminal"
       activate
       do script "cd /完整路徑/project-tracker && ./start_all.sh"
   end tell
   ```

3. **儲存為應用程式**
   - 檔案 → 輸出
   - 檔案格式：「應用程式」
   - 名稱：「Project Tracker」

4. **加入 Dock**
   - 拖曳應用程式到 Dock

---

## 開機自動啟動（可選）

### 使用 launchd

1. **建立啟動配置檔**

   ```bash
   nano ~/Library/LaunchAgents/com.projecttracker.plist
   ```

2. **輸入以下內容**：

   ```xml
   <?xml version="1.0" encoding="UTF-8"?>
   <!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
   <plist version="1.0">
   <dict>
       <key>Label</key>
       <string>com.projecttracker</string>
       <key>ProgramArguments</key>
       <array>
           <string>/完整路徑/project-tracker/start_all.sh</string>
       </array>
       <key>RunAtLoad</key>
       <true/>
       <key>KeepAlive</key>
       <false/>
   </dict>
   </plist>
   ```

3. **載入配置**

   ```bash
   launchctl load ~/Library/LaunchAgents/com.projecttracker.plist
   ```

4. **停用自動啟動**

   ```bash
   launchctl unload ~/Library/LaunchAgents/com.projecttracker.plist
   ```

---

## 常見問題

### Q: 如何找到專案的完整路徑？

```bash
cd project-tracker
pwd
```

輸出結果就是完整路徑，例如：`/Users/yourname/project-tracker`

### Q: 權限被拒絕？

```bash
chmod +x *.sh
```

### Q: Python 版本不對？

```bash
# 檢查版本
python3 --version

# 如果版本太舊，更新
brew upgrade python@3.11
```

### Q: 埠號被佔用？

```bash
# 查看哪個程式使用 8000 埠
lsof -ti:8000

# 終止該程式
kill -9 $(lsof -ti:8000)
```

### Q: 如何停止服務？

在執行的終端視窗按 `Ctrl+C`，或執行：

```bash
./stop_all.sh
```

---

## 效能優化建議

### 1. 使用生產模式部署

```bash
# 建立生產版本
cd frontend
npm run build

# 後端使用 gunicorn（需先安裝）
pip install gunicorn
gunicorn -w 4 -k uvicorn.workers.UvicornWorker backend.main:app
```

### 2. 設定反向代理（Nginx）

```bash
# 安裝 Nginx
brew install nginx

# 編輯配置
nano /usr/local/etc/nginx/nginx.conf
```

添加：

```nginx
server {
    listen 80;
    server_name localhost;

    location / {
        proxy_pass http://localhost:5173;
    }

    location /api {
        proxy_pass http://localhost:8000;
    }
}
```

---

## 資源監控

```bash
# 查看 Python 程序
ps aux | grep python

# 查看 Node 程序
ps aux | grep node

# 查看系統資源使用
top -o cpu
```
