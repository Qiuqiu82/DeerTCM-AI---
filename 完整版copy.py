
import logging
import sys
import os
from llama_index.core import PromptTemplate, Settings, load_index_from_storage, StorageContext
from llama_index.llms.dashscope import DashScope, DashScopeGenerationModels
from llama_index.embeddings.dashscope import DashScopeEmbedding, DashScopeTextEmbeddingModels

logging.basicConfig(stream=sys.stdout, level=logging.INFO)
logging.getLogger().addHandler(logging.StreamHandler(stream=sys.stdout))

SYSTEM_PROMPT = """You are a helpful AI assistant."""
query_wrapper_prompt = PromptTemplate(
    "[INST]<<SYS>>\n" + SYSTEM_PROMPT + "<</SYS>>\n\n{query_str}[/INST] "
)

# 1. 指定全局llm与embedding模型
Settings.llm = DashScope(model_name=DashScopeGenerationModels.QWEN_MAX,api_key=os.getenv("DASHSCOPE_API_KEY"))
Settings.embed_model = DashScopeEmbedding(model_name=DashScopeTextEmbeddingModels.TEXT_EMBEDDING_V1)

# ################################################二阶段


#检索数据###################################

# 从存储文件中读取embedding向量和向量索引
storage_context = StorageContext.from_defaults(persist_dir="./doc_emb")

# 根据存储的embedding向量和向量索引重新构建检索索引
index = load_index_from_storage(storage_context)

# 构建查询引擎
query_engine = index.as_query_engine(streaming=True, similarity_top_k=5)

# 查询获得答案
response = query_engine.query("不耐疲劳，口燥、咽干可能是哪些证候？")
response.print_response_stream()
print()