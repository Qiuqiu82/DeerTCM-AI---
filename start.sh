#!/bin/bash

# 中医临床智能诊疗助手启动脚本

echo "🏥 中医临床智能诊疗助手启动中..."

# 检查Python环境
if ! command -v python &> /dev/null; then
    echo "❌ Python未安装，请先安装Python 3.8+"
    exit 1
fi

# 检查Node.js环境
if ! command -v node &> /dev/null; then
    echo "❌ Node.js未安装，请先安装Node.js 18+"
    exit 1
fi

# 检查环境变量
if [ -z "$DASHSCOPE_API_KEY" ]; then
    echo "⚠️  未设置DASHSCOPE_API_KEY环境变量"
    echo "请在.env文件中设置或export DASHSCOPE_API_KEY=your_key"
fi

# 安装后端依赖
echo "📦 安装后端依赖..."
pip install -r requirements.txt

# 安装前端依赖
echo "📦 安装前端依赖..."
cd frontend && npm install && cd ..

# 启动后端服务
echo "🚀 启动后端服务..."
python index.py &
BACKEND_PID=$!

# 等待后端启动
sleep 3

# 启动前端服务
echo "🚀 启动前端服务..."
cd frontend && npm run dev &
FRONTEND_PID=$!

echo "✅ 服务启动完成！"
echo "📱 前端地址: http://localhost:5173"
echo "🔧 后端地址: http://localhost:8000"
echo "按Ctrl+C停止服务"

# 等待用户中断
trap "echo '🛑 正在停止服务...'; kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait
