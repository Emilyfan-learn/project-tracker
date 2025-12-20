#!/bin/bash

echo "========================================"
echo "  強制合併到 main 分支"
echo "========================================"
echo ""

# 確認
read -p "這將強制覆蓋 GitHub 上的 main 分支，確定嗎? (y/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "已取消"
    exit 1
fi

# 確保在功能分支
git checkout claude/setup-project-structure-01Q1PZ68MjHUgCd8KMjHnzGy

# 創建或重置 main 分支
git branch -D main 2>/dev/null
git checkout -b main

# 強制推送到 GitHub
echo ""
echo "推送到 GitHub..."
git push -f origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "========================================"
    echo "✅ 成功！"
    echo "========================================"
    echo ""
    echo "請前往 GitHub："
    echo "1. Settings > Branches"
    echo "2. 設置 'main' 為預設分支"
    echo "3. (可選) 刪除舊的功能分支"
    echo ""
else
    echo ""
    echo "❌ 推送失敗，請檢查錯誤訊息"
    echo ""
    exit 1
fi
