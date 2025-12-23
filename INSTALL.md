# 專案追蹤系統 - 安裝說明

## 📋 安裝前準備

確保你的系統已安裝以下軟體：

- ✅ Python 3.9 或以上版本
- ✅ Node.js 18 或以上版本  
- ✅ npm 10 或以上版本

## 🚀 快速安裝（3 步驟）

### 步驟 1: 下載專案

```bash
git clone https://github.com/Emilyfan-learn/project-tracker.git
cd project-tracker
```

### 步驟 2: 安裝依賴

```bash
# 安裝後端依賴
pip install -r requirements.txt

# 安裝前端依賴
cd frontend && npm install && cd ..
```

### 步驟 3: 啟動服務

```bash
# 一鍵啟動
./restart.sh
```

就這麼簡單！🎉

系統會自動：
- ✓ 創建資料庫
- ✓ 啟動後端（http://localhost:8000）
- ✓ 啟動前端（http://localhost:5173）

## 🌐 訪問應用

在瀏覽器打開：**http://localhost:5173**

## 🛑 停止服務

```bash
./stop.sh
```

## 📝 查看日誌

```bash
# 後端日誌
tail -f logs/backend.log

# 前端日誌
tail -f logs/frontend.log
```

## ⚠️ 遇到問題？

### 問題 1: 權限錯誤

```bash
chmod +x restart.sh stop.sh
```

### 問題 2: Python 模組找不到

```bash
# 使用虛擬環境（推薦）
python3 -m venv venv
source venv/bin/activate  # Mac/Linux
# 或
venv\Scripts\activate     # Windows

# 重新安裝
pip install -r requirements.txt
```

### 問題 3: 端口被占用

```bash
# Mac/Linux
lsof -i :8000
kill <PID>

# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

### 問題 4: 資料庫錯誤

```bash
# 手動初始化資料庫
python3 backend/init_db.py
```

## 📖 更多說明

詳細文檔請參考 [README.md](README.md)

## 🆘 需要協助

如果以上方法都無法解決問題，請：
1. 檢查 `logs/backend.log` 和 `logs/frontend.log` 的錯誤訊息
2. 確認 Python 和 Node.js 版本符合需求
3. 聯繫專案維護者

---

**祝你使用愉快！** 🚀
