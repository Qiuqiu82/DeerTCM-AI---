@echo off
echo Starting TCM AI Assistant Backend...
call conda activate tcm-ai-rag
if %errorlevel% neq 0 (
    echo Error: Cannot activate conda environment.
    echo Please run install_deps.bat first to set up the environment.
    pause
    exit /b 1
)
python index.py
pause
