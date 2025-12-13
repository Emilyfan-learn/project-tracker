#!/bin/bash
# WBS API 測試腳本

BASE_URL="http://localhost:8000/api/wbs"

echo "════════════════════════════════════════════"
echo "  WBS CRUD API 測試"
echo "════════════════════════════════════════════"
echo ""

# 1. 健康檢查
echo "📍 1. 健康檢查"
curl -s http://localhost:8000/health | jq .
echo -e "\n"

# 2. 新增 WBS 項目
echo "📍 2. 新增 WBS 項目 (WBS 1.1)"
WBS_1_1=$(curl -s -X POST "$BASE_URL/" \
  -H "Content-Type: application/json" \
  -d '{
    "project_id": "PRJ001",
    "wbs_id": "1.1",
    "task_name": "需求分析",
    "category": "Task",
    "owner_unit": "開發部",
    "original_planned_start": "2024-12-15",
    "original_planned_end": "2024-12-25",
    "actual_progress": 30,
    "status": "進行中",
    "notes": "進行中，預計按時完成"
  }')
echo "$WBS_1_1" | jq .
echo -e "\n"

# 3. 新增第二個 WBS 項目
echo "📍 3. 新增 WBS 項目 (WBS 1.2)"
WBS_1_2=$(curl -s -X POST "$BASE_URL/" \
  -H "Content-Type: application/json" \
  -d '{
    "project_id": "PRJ001",
    "wbs_id": "1.2",
    "task_name": "系統設計",
    "category": "Task",
    "owner_unit": "架構部/開發部",
    "original_planned_start": "2024-12-20",
    "original_planned_end": "2024-12-30",
    "actual_progress": 0,
    "status": "未開始"
  }')
echo "$WBS_1_2" | jq .
echo -e "\n"

# 4. 新增里程碑
echo "📍 4. 新增 WBS 里程碑 (WBS 2)"
WBS_2=$(curl -s -X POST "$BASE_URL/" \
  -H "Content-Type: application/json" \
  -d '{
    "project_id": "PRJ001",
    "wbs_id": "2",
    "task_name": "開發階段完成",
    "category": "Milestone",
    "owner_unit": "客戶",
    "original_planned_start": "2025-01-01",
    "original_planned_end": "2025-01-01",
    "actual_progress": 0,
    "status": "未開始"
  }')
echo "$WBS_2" | jq .
echo -e "\n"

# 5. 取得所有 WBS 列表
echo "📍 5. 取得專案 PRJ001 的所有 WBS 項目"
curl -s "$BASE_URL/?project_id=PRJ001" | jq .
echo -e "\n"

# 6. 取得單一 WBS 項目
echo "📍 6. 取得單一 WBS 項目 (PRJ001_1.1)"
curl -s "$BASE_URL/PRJ001_1.1" | jq .
echo -e "\n"

# 7. 更新 WBS 項目進度
echo "📍 7. 更新 WBS 1.1 進度到 60%"
curl -s -X PUT "$BASE_URL/PRJ001_1.1" \
  -H "Content-Type: application/json" \
  -d '{
    "actual_progress": 60,
    "notes": "進度良好，持續進行中"
  }' | jq .
echo -e "\n"

# 8. 取得樹狀結構
echo "📍 8. 取得 WBS 樹狀結構"
curl -s "$BASE_URL/tree/PRJ001" | jq .
echo -e "\n"

# 9. 篩選進行中的項目
echo "📍 9. 取得所有「進行中」的項目"
curl -s "$BASE_URL/?project_id=PRJ001&status=進行中" | jq .
echo -e "\n"

echo "════════════════════════════════════════════"
echo "  測試完成！"
echo "════════════════════════════════════════════"
echo ""
echo "💡 提示："
echo "  - 訪問 http://localhost:8000/docs 查看完整 API 文件"
echo "  - 訪問 http://localhost:5173/wbs 使用前端介面"
echo ""
