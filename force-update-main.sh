#!/bin/bash
# 強制將當前分支變成 main 的腳本

echo "⚠️  警告：這將用當前分支完全替換 main 分支"
echo "當前分支: claude/setup-project-structure-01Q1PZ68MjHUgCd8KMjhnzGy"
echo ""
read -p "確定要繼續嗎？(yes/no) " -r
if [[ ! $REPLY =~ ^[Yy]es$ ]]; then
    echo "取消操作"
    exit 1
fi

echo ""
echo "步驟 1: 確保當前分支是最新的..."
git checkout claude/setup-project-structure-01Q1PZ68MjHUgCd8KMjhnzGy
git pull origin claude/setup-project-structure-01Q1PZ68MjHUgCd8KMjhnzGy

echo ""
echo "步驟 2: 獲取遠端 main 分支..."
git fetch origin main:main

echo ""
echo "步驟 3: 合併當前分支到 main（使用我們的版本）..."
git checkout main
git merge -X theirs claude/setup-project-structure-01Q1PZ68MjHUgCd8KMjhnzGy -m "merge: 使用功能分支完全替換 main"

echo ""
echo "步驟 4: 嘗試推送到遠端..."
git push origin main

if [ $? -eq 0 ]; then
    echo "✅ 成功！main 分支已更新"
    git checkout claude/setup-project-structure-01Q1PZ68MjHUgCd8KMjhnzGy
else
    echo "❌ 推送失敗"
    echo ""
    echo "請使用以下方法之一："
    echo "1. 在 GitHub 上創建 Pull Request 並合併"
    echo "2. 在 GitHub Settings > Branches 中更改默認分支"
    echo "3. 聯繫倉庫管理員開啟強制推送權限"
fi
