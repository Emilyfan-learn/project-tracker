# 🐳 Docker 安裝指南

使用 Docker 運行專案追蹤系統是最簡單的方式，無需手動安裝 Python 和 Node.js。

---

## 📋 前置需求

### macOS

#### 1. 安裝 Docker Desktop

```bash
# 使用 Homebrew 安裝 Docker Desktop
brew install --cask docker
```

或者從官網下載：https://www.docker.com/products/docker-desktop/

#### 2. 啟動 Docker Desktop

- 在應用程式中找到「Docker」並啟動
- 等待 Docker 圖示在狀態列顯示（鯨魚圖標）
- 確認 Docker 正在運行

#### 3. 驗證安裝

```bash
# 檢查 Docker 版本
docker --version

# 檢查 Docker Compose 版本（新版本內建）
docker compose version
# 或舊版本
docker-compose --version
```

---

## 📥 下載專案

```bash
# 移動到您想要存放專案的位置
cd ~/Documents

# 克隆專案
git clone https://github.com/Emilyfan-learn/project-tracker.git

# 進入專案目錄
cd project-tracker

# 切換到最新分支
git checkout claude/setup-project-structure-01Q1PZ68MjHUgCd8KMjhnzGy
```

---

## 🚀 啟動系統

### 方法 1：使用啟動腳本（推薦）

```bash
cd ~/Documents/project-tracker

# 設置執行權限（只需執行一次）
chmod +x start_docker.sh stop_docker.sh

# 啟動系統
./start_docker.sh
```

腳本會自動：
- ✅ 檢查 Docker 是否安裝
- ✅ 檢查 Docker 是否運行
- ✅ 自動偵測正確的 Docker Compose 命令
- ✅ 建立並啟動容器
- ✅ 在瀏覽器中打開應用程式

### 方法 2：手動啟動

```bash
# 如果使用新版 Docker Desktop（推薦）
docker compose up -d --build

# 如果使用舊版 docker-compose
docker-compose up -d --build
```

---

## 🌐 訪問應用程式

啟動成功後：

- **前端界面**: http://localhost:5173
- **後端 API 文檔**: http://localhost:8000/docs

---

## 🛑 停止系統

### 使用停止腳本

```bash
./stop_docker.sh
```

### 手動停止

```bash
# 新版
docker compose down

# 舊版
docker-compose down
```

### 完全清理（移除所有資料）

```bash
# 停止容器並刪除卷和映像
docker compose down -v --rmi all
```

---

## 📊 查看日誌

```bash
# 查看所有容器的日誌
docker compose logs -f

# 只查看後端日誌
docker compose logs -f backend

# 只查看前端日誌
docker compose logs -f frontend
```

---

## 🔄 更新專案

當有新版本時：

```bash
# 停止容器
./stop_docker.sh

# 拉取最新代碼
git pull origin claude/setup-project-structure-01Q1PZ68MjHUgCd8KMjhnzGy

# 重新建立並啟動
./start_docker.sh
```

---

## 🐞 常見問題

### Q1: 執行 `./start_docker.sh` 時出現 "Permission denied"

**解決方法：**
```bash
chmod +x start_docker.sh stop_docker.sh
```

### Q2: 錯誤 "unknown shorthand flag: 'd' in -d"

**原因：** Docker Compose 命令格式問題

**解決方法：**
已在腳本中自動處理。如果仍有問題：
```bash
# 檢查您的 Docker Compose 版本
docker compose version  # 新版
docker-compose version  # 舊版

# 使用對應的命令
```

### Q3: 錯誤 "Cannot connect to the Docker daemon"

**原因：** Docker Desktop 未啟動

**解決方法：**
1. 啟動 Docker Desktop 應用程式
2. 等待狀態列的鯨魚圖標出現
3. 重新執行 `./start_docker.sh`

### Q4: 端口被占用（5173 或 8000）

**解決方法：**
```bash
# 查找占用端口的進程
lsof -i :5173
lsof -i :8000

# 終止進程
kill -9 <PID>
```

### Q5: 容器無法啟動

**查看錯誤日誌：**
```bash
docker compose logs
```

**重新建立容器：**
```bash
./stop_docker.sh
docker compose down -v  # 清除卷
./start_docker.sh
```

### Q6: 如何進入容器內部？

```bash
# 進入後端容器
docker exec -it projecttracker-backend bash

# 進入前端容器
docker exec -it projecttracker-frontend sh
```

---

## 🆚 Docker vs 直接安裝

### Docker 方式（推薦）

**優點：**
- ✅ 一鍵安裝，無需配置環境
- ✅ 環境隔離，不影響系統
- ✅ 容易更新和管理
- ✅ 跨平台一致性

**缺點：**
- ❌ 需要 Docker Desktop（約 500MB）
- ❌ 首次建立較慢

### 直接安裝方式

**優點：**
- ✅ 不需要額外軟體
- ✅ 啟動速度較快
- ✅ 更容易調試

**缺點：**
- ❌ 需要手動安裝 Python、Node.js
- ❌ 可能有環境衝突
- ❌ 設置較複雜

詳見：[INSTALL_MAC.md](./INSTALL_MAC.md)

---

## 🎯 加入 Dock（可選）

您可以創建一個應用程式快捷方式：

```bash
# 創建啟動腳本
cat > ~/Desktop/start-project-tracker.command << 'EOF'
#!/bin/bash
cd ~/Documents/project-tracker
./start_docker.sh
EOF

# 設置權限
chmod +x ~/Desktop/start-project-tracker.command
```

雙擊桌面上的 `start-project-tracker.command` 即可啟動！

---

## 📁 Docker 檔案說明

- **docker-compose.yml**: 定義前後端服務
- **Dockerfile.backend**: 後端 Python 容器配置
- **frontend/Dockerfile**: 前端 Node.js 容器配置
- **start_docker.sh**: 啟動腳本
- **stop_docker.sh**: 停止腳本

---

## 🎉 完成！

現在您可以使用 Docker 運行專案追蹤系統了！

**快速命令：**
```bash
./start_docker.sh   # 啟動
./stop_docker.sh    # 停止
```

如有問題，請查看日誌或聯繫技術支援。
