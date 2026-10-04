@echo off
title Mackie's Daily Board Launcher
echo Starting Mackie's Daily Board (Calendar + Cookbook Meal Planner + Grocery List) on port 3005...
cd /d "%~dp0"
powershell -Command "Start-Process -FilePath 'node' -ArgumentList 'server/server.cjs' -WorkingDirectory '%~dp0' -WindowStyle Hidden"
timeout /t 2 >nul
start http://localhost:3005
echo Mackie's Daily Board is running at http://localhost:3005
pause
