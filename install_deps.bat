@echo off
echo Installing dependencies in conda environment...
call conda activate tcm-ai-rag
if %errorlevel% neq 0 (
    echo Error: Cannot activate conda environment.
    echo Please run setup_conda.bat first.
    pause
    exit /b 1
)
pip install -r requirements.txt
if %errorlevel% equ 0 (
    echo Dependencies installed successfully!
) else (
    echo Error: Failed to install dependencies.
)
pause
