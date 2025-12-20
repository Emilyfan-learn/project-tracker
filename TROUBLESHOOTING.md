# 專案追蹤系統 - 故障排除指南

## 常見問題解決方案

### 1. 500 錯誤（Request failed with status code 500）

#### 症狀
開啟專案管理頁面時出現 "request failed with status code 500"

#### 可能原因
1. 資料庫未正確初始化
2. 資料庫檔案不存在
3. 資料庫權限問題
4. Docker 容器內環境變數設置錯誤

#### 解決步驟

**步驟 1: 檢查容器日誌**
```bash
docker compose logs backend | tail -50
```

查找錯誤訊息，特別注意：
- "Database file not found"
- "Failed to connect to database"
- "FileNotFoundError"

**步驟 2: 驗證資料庫狀態**
```bash
# 進入容器
docker exec -it projecttracker-backend bash

# 運行資料庫驗證腳本
python backend/verify_db.py

# 退出容器
exit
```

驗證腳本會檢查：
- ✅ 環境變數是否正確設置
- ✅ 資料庫檔案是否存在
- ✅ 檔案權限是否正確
- ✅ 資料表是否已建立
- ✅ 能否正常查詢

**步驟 3: 檢查資料庫檔案**
```bash
# 檢查主機上的資料庫檔案
ls -lh ./data/project_tracking.db

# 檢查容器內的資料庫檔案
docker exec projecttracker-backend ls -lh /app/data/project_tracking.db

# 檢查環境變數
docker exec projecttracker-backend printenv | grep DATABASE
```

**步驟 4: 重新初始化資料庫（如果需要）**
```bash
# 使用快速啟動腳本（會清理並重建）
./quick-start.sh
```

或手動重新初始化：
```bash
# 停止容器
./stop_docker.sh

# 刪除舊資料庫
rm -f ./data/project_tracking.db

# 重新啟動
./start_docker.sh
```

**步驟 5: 檢查 API 回應**
```bash
# 測試根端點
curl http://localhost:8000/

# 測試健康檢查
curl http://localhost:8000/health

# 測試專案列表（這個可能會返回 500）
curl http://localhost:8000/api/projects/
```

如果 `/health` 返回 `"database": "false"`，表示資料庫檔案不存在。

---

### 2. Docker Compose 命令錯誤

#### 症狀
```
unknown shorthand flag: 'd' in -d
```

#### 原因
系統使用舊版 `docker-compose`（帶連字符）而非新版 `docker compose`（空格）

#### 解決方案
腳本已自動檢測，直接使用：
```bash
./start_docker.sh
./stop_docker.sh
```

---

### 3. 容器名稱衝突

#### 症狀
```
Error response from daemon: Conflict. The container name "/projecttracker-backend" is already in use
```

#### 解決方案
```bash
# 清理舊容器
docker compose down

# 或強制移除
docker rm -f projecttracker-backend projecttracker-frontend

# 重新啟動
./start_docker.sh
```

---

### 4. 資料庫初始化失敗

#### 症狀
容器日誌顯示：
```
❌ 資料庫初始化失敗
```

#### 診斷步驟
```bash
# 查看詳細錯誤
docker compose logs backend

# 手動嘗試初始化
docker exec -it projecttracker-backend python backend/init_db.py

# 檢查資料目錄權限
docker exec projecttracker-backend ls -la /app/data
```

#### 可能解決方案
```bash
# 確保主機目錄存在且有正確權限
mkdir -p ./data
chmod 755 ./data

# 重新啟動
./quick-start.sh
```

---

### 5. 前端無法連接後端

#### 症狀
前端頁面空白或無法載入資料

#### 檢查步驟
1. **確認後端運行中**
   ```bash
   curl http://localhost:8000/health
   ```

2. **檢查瀏覽器控制台**
   - 開啟 Chrome DevTools (F12)
   - 查看 Console 標籤的錯誤訊息
   - 查看 Network 標籤的失敗請求

3. **檢查 CORS 設定**
   後端應該允許 `http://localhost:5173` 的請求

---

## 使用診斷工具

### 自動診斷腳本
```bash
./diagnose.sh
```

這會顯示：
1. 容器狀態
2. 後端日誌（最後 30 行）
3. 資料庫檔案資訊
4. 環境變數
5. API 測試結果

### 資料庫驗證腳本
```bash
docker exec -it projecttracker-backend python backend/verify_db.py
```

顯示詳細的資料庫狀態資訊。

---

## 常用命令

### 查看即時日誌
```bash
docker compose logs -f
docker compose logs -f backend
docker compose logs -f frontend
```

### 重新建構容器
```bash
docker compose up -d --build
```

### 進入容器 shell
```bash
# 後端
docker exec -it projecttracker-backend bash

# 前端
docker exec -it projecttracker-frontend sh
```

### 檢查容器狀態
```bash
docker compose ps
docker ps -a | grep projecttracker
```

---

## 完全重置

如果所有方法都失敗，可以完全重置：

```bash
# 1. 停止並移除所有容器
docker compose down

# 2. 移除舊映像檔（可選）
docker rmi projecttracter-backend projecttracter-frontend

# 3. 清理資料
rm -rf ./data/project_tracking.db

# 4. 重新啟動
./quick-start.sh
```

---

## 尋求幫助

如果問題仍然存在，請收集以下資訊：

1. **容器日誌**
   ```bash
   docker compose logs backend > backend-logs.txt
   docker compose logs frontend > frontend-logs.txt
   ```

2. **資料庫驗證結果**
   ```bash
   docker exec projecttracker-backend python backend/verify_db.py > db-verify.txt
   ```

3. **系統資訊**
   ```bash
   docker version > docker-info.txt
   docker compose version >> docker-info.txt
   ```

4. **瀏覽器控制台截圖**
   - Console 標籤
   - Network 標籤（顯示失敗的 API 請求）

提供這些資訊可以幫助更快地診斷問題。
