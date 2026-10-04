@echo off
cd /d "c:\Users\micha\OneDrive\Desktop\ANTIGRAVITY PROJECTS\Mackie Mom Board"
:loop
node server/server.cjs
timeout /t 3 /nobreak >nul
goto loop
