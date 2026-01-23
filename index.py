import logging
import sys
import os
from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import Optional
from llama_index.core import PromptTemplate, Settings, load_index_from_storage, StorageContext
from llama_index.llms.dashscope import DashScope, DashScopeGenerationModels
from llama_index.embeddings.dashscope import DashScopeEmbedding, DashScopeTextEmbeddingModels

# 配置日志
logging.basicConfig(stream=sys.stdout, level=logging.INFO)
logging.getLogger().addHandler(logging.StreamHandler(stream=sys.stdout))

# 中医专家系统提示词
SYSTEM_PROMPT = """你是一位经验丰富的中医临床专家，擅长根据患者症状进行中医辨证论治。你需要：
1. 仔细分析患者的症状、体征
2. 根据中医理论进行辨证分析
3. 给出相应的证候类型和治疗建议
4. 解释辨证依据和治疗原理"""

# 创建FastAPI应用
app = FastAPI(
    title="中医临床智能诊疗助手",
    description="基于RAG的中医诊疗智能系统",
    version="1.0.0"
)

class QueryRequest(BaseModel):
    question: str
    stream: Optional[bool] = True

class TCMAssistant:
    def __init__(self):
        # 初始化系统提示词
        self.query_wrapper_prompt = PromptTemplate(
            "[INST]<<SYS>>\n" + SYSTEM_PROMPT + "<</SYS>>\n\n{query_str}[/INST] "
        )

        # 1. 指定全局llm与embedding模型
        Settings.llm = DashScope(
            model_name=DashScopeGenerationModels.QWEN_MAX,
            api_key=os.getenv("DASHSCOPE_API_KEY")
        )
        Settings.embed_model = DashScopeEmbedding(
            model_name=DashScopeTextEmbeddingModels.TEXT_EMBEDDING_V1
        )

        # 从存储文件中读取embedding向量和向量索引
        storage_context = StorageContext.from_defaults(persist_dir="./doc_emb")

        # 根据存储的embedding向量和向量索引重新构建检索索引
        self.index = load_index_from_storage(storage_context)

        # 构建查询引擎
        self.query_engine = self.index.as_query_engine(streaming=True, similarity_top_k=5)

    def query_stream(self, question: str):
        """流式查询中医诊疗建议"""
        try:
            response = self.query_engine.query(question)
            for chunk in response.response_gen:
                yield f"data: {chunk}\n\n"
            yield "data: [DONE]\n\n"
        except Exception as e:
            yield f"data: Error: {str(e)}\n\n"

# 创建全局实例
tcm_assistant = TCMAssistant()

@app.get("/")
async def root():
    """根路径"""
    return {"message": "中医临床智能诊疗助手API", "status": "running"}

@app.post("/api/query")
async def query_tcm(request: QueryRequest):
    """中医诊疗查询接口"""
    if not request.question.strip():
        raise HTTPException(status_code=400, detail="问题不能为空")

    if request.stream:
        # 流式响应
        return StreamingResponse(
            tcm_assistant.query_stream(request.question),
            media_type="text/event-stream",
            headers={
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
            }
        )
    else:
        # 非流式响应
        try:
            response = tcm_assistant.query_engine.query(request.question)
            return {"answer": str(response)}
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"查询失败: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)