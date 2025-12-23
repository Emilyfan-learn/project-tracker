@echo off
REM Project Tracker 停止腳本 (Windows)
REM 用途：停止前端和後端服務

echo ========================================
echo    Project Tracker 停止服務
echo ========================================
echo.

set STOPPED=0

REM 停止後端 (Python/uvicorn)
echo 檢查後端進程...
tasklist | findstr /i "python.*uvicorn" >nul 2>&1
if %errorlevel% equ 0 (
    echo   停止後端進程...
    for /f "tokens=2" %%a in ('tasklist ^| findstr /i "python"') do (
        taskkill /PID %%a /F >nul 2>&1
    )
    set /a STOPPED+=1
) else (
    echo   沒有運行中的後端進程
)

REM 停止前端 (Node.js/Vite)
echo 檢查前端進程...
tasklist | findstr /i "node.exe" >nul 2>&1
if %errorlevel% equ 0 (
    echo   停止前端進程...
    taskkill /IM node.exe /F >nul 2>&1
    set /a STOPPED+=1
) else (
    echo   沒有運行中的前端進程
)

REM 清理 PID 文件
if exist logs\backend.pid del /q logs\backend.pid
if exist logs\frontend.pid del /q logs\frontend.pid

echo.
if %STOPPED% gtr 0 (
    echo [成功] 服務已停止
) else (
    echo [訊息] 沒有運行中的服務
)
echo.
pause
