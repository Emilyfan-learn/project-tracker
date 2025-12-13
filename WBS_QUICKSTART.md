# WBS 功能快速入門

## 🎯 功能概述

WBS（Work Breakdown Structure）模組提供完整的工作分解結構管理功能，包括：

- ✅ 完整的 CRUD 操作（新增、讀取、更新、刪除）
- ✅ 三階段時程追蹤（原始計畫 → 調整計畫 → 實際執行）
- ✅ 自動進度計算與偏差分析
- ✅ 逾期自動警示
- ✅ 階層樹狀結構
- ✅ 批次匯入功能

## 🚀 快速啟動

### 方式一：使用啟動腳本

```bash
# 1. 啟動後端（終端機 1）
./start-backend.sh

# 2. 啟動前端（終端機 2）
cd frontend
./start-frontend.sh
```

### 方式二：手動啟動

```bash
# 1. 啟動後端
source venv/bin/activate
python -m backend.main

# 2. 啟動前端（新終端）
cd frontend
npm run dev
```

## 📍 訪問地址

- **前端介面**: http://localhost:5173/wbs
- **API 文件**: http://localhost:8000/docs
- **健康檢查**: http://localhost:8000/health

## 🧪 測試 API

執行測試腳本：

```bash
./test-wbs-api.sh
```

或手動測試：

```bash
# 新增 WBS 項目
curl -X POST "http://localhost:8000/api/wbs/" \
  -H "Content-Type: application/json" \
  -d '{
    "project_id": "PRJ001",
    "wbs_id": "1.1",
    "task_name": "需求分析",
    "category": "Task",
    "owner_unit": "開發部",
    "original_planned_start": "2024-12-15",
    "original_planned_end": "2024-12-25",
    "actual_progress": 50,
    "status": "進行中"
  }'

# 查詢 WBS 列表
curl "http://localhost:8000/api/wbs/?project_id=PRJ001"

# 更新進度
curl -X PUT "http://localhost:8000/api/wbs/PRJ001_1.1" \
  -H "Content-Type: application/json" \
  -d '{"actual_progress": 80}'

# 刪除項目
curl -X DELETE "http://localhost:8000/api/wbs/PRJ001_1.1"
```

## 🎨 前端使用

### 1. 訪問 WBS 列表頁

訪問 http://localhost:5173/wbs

### 2. 新增 WBS 項目

1. 點擊「+ 新增 WBS」按鈕
2. 填寫表單：
   - **專案 ID**: 例如 `PRJ001`
   - **WBS 編號**: 例如 `1.1`, `2.2.3`
   - **任務名稱**: 任務描述
   - **類別**: Task 或 Milestone
   - **負責單位**: 例如 `開發部`, `AAA/BBB`, `客戶`
   - **三階段時程**:
     - 階段 1：原始計畫開始/結束日期
     - 階段 2：調整後開始/結束日期
     - 階段 3：實際開始/結束日期、工作天數
   - **實際進度**: 0-100%
   - **狀態**: 未開始/進行中/已完成
3. 點擊「新增」

### 3. 編輯 WBS 項目

1. 在列表中點擊「編輯」按鈕
2. 修改需要更新的欄位
3. 點擊「更新」

### 4. 刪除 WBS 項目

1. 在列表中點擊「刪除」按鈕
2. 確認刪除

### 5. 篩選功能

- **專案篩選**: 輸入專案 ID
- **狀態篩選**: 選擇未開始/進行中/已完成
- 點擊「搜尋」

## 📊 資料欄位說明

### 基本資訊
- **project_id**: 專案 ID（必填）
- **wbs_id**: WBS 編號，例如 1, 2.1, 2.1.3（必填）
- **task_name**: 任務名稱（必填）
- **category**: 類別，Task 或 Milestone
- **owner_unit**: 負責單位

### 負責單位智能解析
系統會自動解析負責單位類型：
- `"客戶"` → Client（客戶）
- `"AAA/BBB"` → Department（部門協作，主要：AAA，次要：BBB）
- `"開發部"` → Internal（內部單位）

### 三階段時程
**階段 1：原始計畫 (Baseline)**
- original_planned_start: 原始計畫開始日期
- original_planned_end: 原始計畫結束日期

**階段 2：調整計畫 (Revised)**
- revised_planned_start: 調整後開始日期
- revised_planned_end: 調整後結束日期

**階段 3：實際執行 (Actual)**
- actual_start_date: 實際開始日期
- actual_end_date: 實際結束日期
- work_days: 工作天數

### 進度追蹤
- **actual_progress**: 實際完成進度 (0-100%)
- **estimated_progress**: 預估進度（系統自動計算）
- **progress_variance**: 進度偏差 = 實際進度 - 預估進度
  - 正值（綠色）：超前進度 ✅
  - 負值（紅色）：落後進度 ⚠️

### 狀態管理
- **status**: 未開始/進行中/已完成
- **is_overdue**: 是否逾期（系統自動判斷）
  - 條件：狀態非「已完成」且當前日期 > 預計結束日期

### 其他
- **notes**: 備註說明
- **alert_flag**: 警示標記

## 💡 進度計算邏輯

### 預估進度計算

```
如果今天 >= 預計結束日期:
    預估進度 = 100%
否則如果今天 <= 預計開始日期:
    預估進度 = 0%
否則:
    總天數 = 預計結束 - 預計開始
    已過天數 = 今天 - 預計開始
    預估進度 = (已過天數 / 總天數) × 100%
```

### 進度偏差

```
進度偏差 = 實際進度 - 預估進度
```

### 逾期判定

```
如果 (狀態 != '已完成' AND 今天 > 預計結束日期):
    is_overdue = True
```

## 🎨 UI 視覺說明

### 列表顯示特色

1. **進度條**: 視覺化顯示實際進度
2. **進度偏差**:
   - 綠色 `(+10)`: 超前 10%
   - 紅色 `(-15)`: 落後 15%
3. **逾期標示**: 紅色背景 + ⚠️ 圖示
4. **狀態徽章**:
   - 未開始: 灰色
   - 進行中: 藍色
   - 已完成: 綠色

## 🔌 API 端點總覽

### 基本 CRUD

| 方法 | 端點 | 說明 |
|------|------|------|
| POST | `/api/wbs/` | 新增 WBS 項目 |
| GET | `/api/wbs/` | 取得 WBS 列表（支援篩選） |
| GET | `/api/wbs/{item_id}` | 取得單一 WBS 項目 |
| PUT | `/api/wbs/{item_id}` | 更新 WBS 項目 |
| DELETE | `/api/wbs/{item_id}` | 刪除 WBS 項目 |

### 進階功能

| 方法 | 端點 | 說明 |
|------|------|------|
| GET | `/api/wbs/tree/{project_id}` | 取得階層樹狀結構 |
| GET | `/api/wbs/{item_id}/children` | 取得子項目 |
| POST | `/api/wbs/batch` | 批次新增 |

### 查詢參數

**GET /api/wbs/**
- `project_id`: 專案 ID 篩選
- `status`: 狀態篩選（未開始/進行中/已完成）
- `skip`: 分頁偏移量（預設: 0）
- `limit`: 每頁筆數（預設: 100，最大: 1000）

## 🐛 常見問題

### Q1: 後端啟動失敗

**檢查項目：**
1. 是否已安裝依賴：`pip install -r requirements.txt`
2. 是否已啟動虛擬環境：`source venv/bin/activate`
3. 資料庫是否初始化：`python -m backend.init_db`

### Q2: 前端啟動失敗

**檢查項目：**
1. 是否已安裝依賴：`cd frontend && npm install`
2. Node.js 版本是否 >= 18

### Q3: API 呼叫失敗

**檢查項目：**
1. 後端是否已啟動：`curl http://localhost:8000/health`
2. 前端代理設定：檢查 `frontend/vite.config.js` 的 proxy 設定

### Q4: 資料未顯示

**檢查項目：**
1. 瀏覽器開發者工具 Network 標籤查看 API 回應
2. 確認專案 ID 是否正確
3. 資料庫是否有資料：檢查 `data/project_tracking.db`

## 📚 相關文件

- **專案規格**: `project-spec-complete-v2.0.md`
- **README**: `README.md`
- **API 文件**: http://localhost:8000/docs（啟動後端後訪問）

## 🎯 下一步

完成 WBS 基礎功能後，可以繼續開發：

1. **Excel 匯入/匯出**: 批次匯入 WBS 資料
2. **甘特圖視圖**: 視覺化時程管理
3. **依賴關係管理**: WBS 項目間的依賴設定
4. **問題追蹤**: Issue 與 WBS 的關聯
5. **報表生成**: 各類管理報表

---

**版本**: v2.0.0
**更新日期**: 2024-12-13
