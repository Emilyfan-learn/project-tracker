@echo off
REM Project Tracker 一鍵式重啟腳本 (Windows)
REM 用途：停止現有服務並重新啟動前端和後端

echo ========================================
echo    Project Tracker 一鍵式重啟
echo ========================================
echo.

REM 設定變數
set "SCRIPT_DIR=%~dp0"
cd /d "%SCRIPT_DIR%"

REM ============================================
REM 步驟 1/4: 停止現有進程
REM ============================================
echo [步驟 1/4] 停止現有進程...

REM 停止後端 (uvicorn)
for /f "tokens=2" %%a in ('tasklist ^| findstr /i "uvicorn"') do (
    echo   停止後端進程 (PID: %%a)
    taskkill /PID %%a /F >nul 2>&1
)

REM 停止前端 (node/vite)
for /f "tokens=2" %%a in ('tasklist ^| findstr /i "node.*vite"') do (
    echo   停止前端進程 (PID: %%a)
    taskkill /PID %%a /F >nul 2>&1
)

REM 額外停止所有 node 進程（更安全）
tasklist | findstr /i "node.exe" >nul 2>&1
if %errorlevel% equ 0 (
    echo   停止所有 Node.js 進程
    taskkill /IM node.exe /F >nul 2>&1
)

echo   [完成]
echo.

REM ============================================
REM 步驟 2/4: 檢查環境
REM ============================================
echo [步驟 2/4] 檢查環境...

python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo   [錯誤] Python 未安裝或未加入 PATH
    echo   請安裝 Python 3.9+ 並確保加入系統 PATH
    pause
    exit /b 1
)
for /f "tokens=*" %%a in ('python --version') do echo   [成功] %%a

node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo   [錯誤] Node.js 未安裝或未加入 PATH
    echo   請安裝 Node.js 18+ 並確保加入系統 PATH
    pause
    exit /b 1
)
for /f "tokens=*" %%a in ('node --version') do echo   [成功] Node.js %%a

npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo   [錯誤] npm 未安裝
    echo   請重新安裝 Node.js
    pause
    exit /b 1
)
for /f "tokens=*" %%a in ('npm --version') do echo   [成功] npm %%a

echo.

REM ============================================
REM 步驟 3/4: 啟動後端
REM ============================================
echo [步驟 3/4] 啟動後端服務...

REM 創建日誌目錄
if not exist logs mkdir logs

REM 啟動後端
start /b "" python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload > logs\backend.log 2>&1

echo   [成功] 後端已啟動
echo     URL: http://localhost:8000
echo     日誌: logs\backend.log
echo     等待後端啟動...
timeout /t 3 /nobreak >nul

REM 檢查後端是否成功啟動
curl -s http://localhost:8000/health >nul 2>&1
if %errorlevel% equ 0 (
    echo   [成功] 後端健康檢查通過
) else (
    echo   [警告] 後端可能還在啟動中...
)

echo.

REM ============================================
REM 步驟 4/4: 啟動前端
REM ============================================
echo [步驟 4/4] 啟動前端服務...

cd frontend
start /b "" npm run dev > ..\logs\frontend.log 2>&1
cd ..

echo   [成功] 前端已啟動
echo     URL: http://localhost:5173
echo     日誌: logs\frontend.log
echo     等待前端啟動...
timeout /t 3 /nobreak >nul

echo.

REM ============================================
REM 完成
REM ============================================
echo ========================================
echo    啟動完成！
echo ========================================
echo.
echo [服務狀態]
echo   後端 API:  http://localhost:8000
echo   前端頁面: http://localhost:5173
echo.
echo [查看即時日誌]
echo   後端: type logs\backend.log
echo   前端: type logs\frontend.log
echo.
echo [停止服務]
echo   執行: stop.bat
echo.
echo 按任意鍵退出此視窗（服務將繼續在背景運行）
pause >nul
