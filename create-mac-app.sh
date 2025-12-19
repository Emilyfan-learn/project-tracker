#!/bin/bash

# 為專案追蹤系統創建 macOS 應用程式

# 獲取腳本所在目錄
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
cd "$SCRIPT_DIR"

# 應用程式名稱
APP_NAME="專案追蹤系統"
APP_DIR="$HOME/Applications/$APP_NAME.app"

echo "======================================"
echo "創建 macOS 應用程式"
echo "======================================"

# 創建應用程式目錄結構
echo "1. 創建應用程式目錄結構..."
mkdir -p "$APP_DIR/Contents/MacOS"
mkdir -p "$APP_DIR/Contents/Resources"

# 創建啟動腳本
echo "2. 創建啟動腳本..."
cat > "$APP_DIR/Contents/MacOS/launcher.sh" << 'EOF'
#!/bin/bash

# 獲取專案目錄
PROJECT_DIR="__PROJECT_DIR__"
cd "$PROJECT_DIR"

# 啟動服務
./start.sh

# 等待服務啟動
sleep 5

# 在預設瀏覽器中打開應用程式
open http://localhost:5173

# 顯示通知
osascript -e 'display notification "服務已啟動，瀏覽器即將打開" with title "專案追蹤系統"'
EOF

# 替換專案目錄路徑
sed -i '' "s|__PROJECT_DIR__|$SCRIPT_DIR|g" "$APP_DIR/Contents/MacOS/launcher.sh"

# 設置執行權限
chmod +x "$APP_DIR/Contents/MacOS/launcher.sh"

# 創建主執行檔
echo "3. 創建主執行檔..."
cat > "$APP_DIR/Contents/MacOS/$APP_NAME" << 'EOF'
#!/bin/bash
SCRIPT_DIR="$(dirname "$0")"
"$SCRIPT_DIR/launcher.sh" &
EOF

chmod +x "$APP_DIR/Contents/MacOS/$APP_NAME"

# 創建 Info.plist
echo "4. 創建 Info.plist..."
cat > "$APP_DIR/Contents/Info.plist" << EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleExecutable</key>
    <string>$APP_NAME</string>
    <key>CFBundleIdentifier</key>
    <string>com.yourcompany.project-tracker</string>
    <key>CFBundleName</key>
    <string>$APP_NAME</string>
    <key>CFBundleVersion</key>
    <string>1.0</string>
    <key>CFBundleShortVersionString</key>
    <string>1.0</string>
    <key>CFBundlePackageType</key>
    <string>APPL</string>
    <key>CFBundleIconFile</key>
    <string>AppIcon</string>
</dict>
</plist>
EOF

# 創建簡單圖示（可選，之後可以替換）
echo "5. 創建應用程式圖示..."
# 這裡創建一個基本的圖示，您可以之後替換為自定義圖示

echo "======================================"
echo "✅ 應用程式創建成功！"
echo "======================================"
echo ""
echo "應用程式位置: $APP_DIR"
echo ""
echo "使用方式："
echo "1. 在 Finder 中打開 ~/Applications"
echo "2. 將「$APP_NAME」拖曳到 Dock"
echo "3. 點擊圖示即可啟動系統"
echo ""
echo "注意："
echo "- 首次啟動可能需要在「系統偏好設定 > 安全性與隱私」中允許執行"
echo "- 使用 ./stop.sh 停止服務"
echo ""
