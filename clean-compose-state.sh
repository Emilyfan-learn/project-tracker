#!/bin/bash
# 清理 Docker Compose 的狀態文件

echo "🧹 清理 Docker Compose 狀態文件"
echo "========================================"
echo ""

# 檢測 Docker Compose 命令
if docker compose version &> /dev/null; then
    COMPOSE_CMD="docker compose"
elif command -v docker-compose &> /dev/null; then
    COMPOSE_CMD="docker-compose"
else
    echo "❌ 未找到 Docker Compose"
    exit 1
fi

# 步驟 1: 停止所有容器
echo "步驟 1: 停止所有容器..."
docker stop $(docker ps -aq) 2>/dev/null || true
echo "✅ 完成"
echo ""

# 步驟 2: 移除所有容器
echo "步驟 2: 移除所有容器..."
docker rm -f $(docker ps -aq) 2>/dev/null || true
echo "✅ 完成"
echo ""

# 步驟 3: 清理 Docker Compose 項目
echo "步驟 3: 清理 Docker Compose 項目..."
$COMPOSE_CMD down -v --remove-orphans 2>/dev/null || true
echo "✅ 完成"
echo ""

# 步驟 4: 移除所有網絡
echo "步驟 4: 移除未使用的網絡..."
docker network prune -f
echo "✅ 完成"
echo ""

# 步驟 5: 移除專案相關的映像
echo "步驟 5: 移除專案相關的映像..."
docker rmi -f $(docker images -q 'project-tracker*' 'projecttracker*' 'test-backend') 2>/dev/null || true
echo "✅ 完成"
echo ""

# 步驟 6: Docker 系統清理
echo "步驟 6: Docker 系統清理..."
docker system prune -f
echo "✅ 完成"
echo ""

# 步驟 7: 查找並刪除 Docker Compose 狀態文件
echo "步驟 7: 查找 Docker Compose 狀態文件..."
if [ -f ".docker/docker-compose.state" ]; then
    echo "找到狀態文件: .docker/docker-compose.state"
    rm -f .docker/docker-compose.state
    echo "✅ 已刪除"
else
    echo "未找到 .docker/docker-compose.state"
fi

if [ -f "docker-compose.override.yml" ]; then
    echo "找到: docker-compose.override.yml"
    echo "⚠️  保留此文件（可能包含自定義配置）"
fi
echo ""

# 步驟 8: 清理 Docker Desktop 的緩存（macOS）
echo "步驟 8: 清理 Docker Desktop 緩存..."
if [ -d "$HOME/Library/Containers/com.docker.docker/Data" ]; then
    echo "找到 Docker Desktop 數據目錄"
    echo "⚠️  不刪除（可能影響其他項目）"
    echo "如需完全重置 Docker，請在 Docker Desktop 中選擇："
    echo "   Troubleshoot > Reset to factory defaults"
else
    echo "未找到 Docker Desktop 數據目錄"
fi
echo ""

echo "========================================"
echo "✅ 清理完成！"
echo "========================================"
echo ""
echo "現在可以使用以下方式啟動："
echo "  1. 使用腳本（推薦）: ./start-without-compose.sh"
echo "  2. 使用 docker-compose: docker compose up -d --build"
echo ""
