# 中医临床智能诊疗助手

基于RAG（Retrieval-Augmented Generation）技术的中医临床智能诊疗系统，提供专业的辨证论治分析和治疗建议。

## 功能特性

- 🏥 **智能辨证**：基于中医理论进行症状分析和证候识别
- 💬 **实时对话**：支持流式输出的智能对话界面
- 📚 **知识库检索**：基于向量化文档的精准知识检索
- 🎨 **现代化界面**：响应式设计，支持桌面端和移动端
- ⚡ **高性能**：FastAPI后端 + React前端，流畅的用户体验

## 技术架构

### 后端
- **框架**: FastAPI
- **AI模型**: 阿里云DashScope Qwen-Max
- **向量检索**: LlamaIndex
- **嵌入模型**: DashScope Text Embedding V1

### 前端
- **框架**: React + TypeScript
- **构建工具**: Vite
- **样式**: Tailwind CSS
- **状态管理**: React Hooks

## 快速开始

### 环境要求

- Python 3.8+
- Node.js 18+
- npm 或 yarn

### 1. 后端部署

```bash
# 1. 安装Python依赖
pip install -r requirements.txt

# 2. 配置环境变量
# 创建 .env 文件并设置 DASHSCOPE_API_KEY
echo "DASHSCOPE_API_KEY=your_api_key_here" > .env

# 3. 启动后端服务
python index.py
```

后端将在 `http://localhost:8000` 启动

### 2. 前端部署

```bash
# 1. 进入前端目录
cd frontend

# 2. 安装依赖
npm install

# 3. 启动开发服务器
npm run dev
```

前端将在 `http://localhost:5173` 启动

### 3. 启动服务

```bash
# 方法1：分别启动
python index.py  # 后端服务 (http://localhost:8000)
cd frontend && npm run dev  # 前端服务 (http://localhost:5173)

# 方法2：一键启动（Linux/Mac）
chmod +x start.sh && ./start.sh

# 方法3：Windows批处理文件
start_backend.bat  # 启动后端
start_frontend.bat # 启动前端

# 方法4：Conda环境（推荐）
install_deps.bat         # 在conda环境中安装依赖
check_env.py            # 检查环境和依赖
run_backend.bat         # 启动后端服务
start_frontend.bat      # 启动前端服务
```

### 4. 生产部署

```bash
# 前端构建
cd frontend
npm run build

# 生产环境启动后端
python index.py
```

## 项目结构

```
tcm-ai-rag/
├── index.py                 # FastAPI后端主文件
├── requirements.txt         # Python依赖
├── doc_emb/                # 向量索引存储目录
├── data/                   # 原始文档数据
├── frontend/               # React前端项目
│   ├── src/
│   │   ├── components/
│   │   │   └── TCMChat.tsx    # 聊天组件
│   │   ├── App.tsx           # 主应用组件
│   │   ├── main.tsx          # 入口文件
│   │   └── index.css         # 样式文件
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.js
└── README.md
```

## API接口

### POST /api/query

中医诊疗查询接口

**请求体**:
```json
{
  "question": "不耐疲劳，口燥、咽干可能是哪些证候？",
  "stream": true
}
```

**响应**:
- 流式响应：Server-Sent Events格式
- 非流式响应：JSON格式

## 使用指南

1. **启动服务**：按照快速开始指南启动后端和前端服务
2. **访问应用**：打开浏览器访问 `http://localhost:5173`
3. **开始咨询**：在输入框中描述您的症状，点击"咨询"按钮
4. **查看结果**：系统会实时显示辨证分析和治疗建议

### 示例查询

- "不耐疲劳，口燥、咽干可能是哪些证候？"
- "患者出现头晕、乏力、舌淡苔白，该如何辨证？"
- "心悸、失眠、舌红少苔属于什么证型？"

## 开发指南

### 添加新的中医知识

1. 将新的中医文档放入 `data/` 目录
2. 运行文档处理脚本（需要实现索引重建功能）
3. 重启后端服务

### 自定义界面

修改 `frontend/src/components/TCMChat.tsx` 来自定义聊天界面。

### API扩展

在 `index.py` 中添加新的API端点来扩展功能。

## 部署选项

### Docker部署

```dockerfile
# Dockerfile
FROM python:3.9-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 8000

CMD ["python", "index.py"]
```

### 云服务器部署

推荐使用：
- **阿里云ECS**：与DashScope服务集成良好
- **腾讯云CVM**：性价比高
- **AWS EC2**：全球部署

## 注意事项

1. **API密钥安全**：确保 `DASHSCOPE_API_KEY` 环境变量正确设置
2. **索引文件**：`doc_emb/` 目录包含预训练的向量索引，不要删除
3. **并发限制**：根据DashScope的API限制调整并发请求
4. **数据隐私**：注意患者隐私保护，不要记录敏感医疗信息

## 许可证

本项目仅供学习和研究使用，请遵守相关法律法规。

## 贡献

欢迎提交Issue和Pull Request来改进这个项目！

## 联系方式

如有问题或建议，请通过GitHub Issues联系。
