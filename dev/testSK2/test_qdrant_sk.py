#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
用 Semantic Kernel + Qdrant 向量庫做簡單測試

1. 使用 SK 的 Kernel 與 Embedding 服務產生向量（支援 OpenRouter 或 OpenAI）
2. 連線 Qdrant（docker-compose 的 qdrant 服務），建立 collection、寫入幾筆文字、語意搜尋
3. 印出搜尋結果

請先啟動：docker-compose up -d
再執行：docker-compose run --rm app python test_qdrant_sk.py
或本機跑 Qdrant 時：QDRANT_HOST=localhost python test_qdrant_sk.py

.env 需有 OPENROUTER_API_KEY 或 OPENAI_API_KEY（二擇一，供 embedding 使用）。
OpenRouter 時可設 OPENROUTER_EMBEDDING_MODEL（預設 openai/text-embedding-3-small）。
"""
import asyncio
import os
import uuid
import warnings

warnings.filterwarnings("ignore", message=".*urllib3.*")

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

from qdrant_client import QdrantClient
from qdrant_client.models import Distance, PointStruct, VectorParams

from semantic_kernel import Kernel
try:
    from semantic_kernel.connectors.ai.open_ai import OpenAITextEmbedding
except ImportError:
    from semantic_kernel.connectors.ai.open_ai.services import OpenAITextEmbedding

OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1"
COLLECTION_NAME = "sk_test_memory"
# OpenAI 與 OpenRouter 常用 embedding 維度（text-embedding-3-small）
DIM = 1536

# 範例文件（寫入後用語意搜尋）
SAMPLE_TEXTS = [
    "Semantic Kernel 是微軟的 AI 編程框架，支援 plugins 與 planners。",
    "Qdrant 是開源向量資料庫，適合做語意搜尋與 RAG。",
    "Docker Compose 可一次啟動多個服務，例如 app 與 Qdrant。",
]

# 搜尋用的查詢
SEARCH_QUERY = "向量資料庫與 RAG 用哪一個？"


async def get_embedding(kernel: Kernel, text: str) -> list[float]:
    """用 SK 的 embedding 服務產生單一文字的向量。"""
    emb_service = kernel.get_service(type=OpenAITextEmbedding)
    result = await emb_service.generate_embeddings([text])
    if hasattr(result, "__getitem__"):
        first = result[0]
        if hasattr(first, "tolist"):
            return first.tolist()
        return list(first)
    return list(result)


async def main():
    # 支援 OpenRouter 或 OpenAI（與其他 planner 一致）
    openrouter_key = os.environ.get("OPENROUTER_API_KEY")
    openai_key = os.environ.get("OPENAI_API_KEY")
    if openrouter_key:
        from openai import AsyncOpenAI
        client = AsyncOpenAI(base_url=OPENROUTER_BASE_URL, api_key=openrouter_key)
        model_id = os.environ.get(
            "OPENROUTER_EMBEDDING_MODEL",
            "openai/text-embedding-3-small",
        )
        embedding_service = OpenAITextEmbedding(
            ai_model_id=model_id,
            async_client=client,
        )
        print(f"使用 OpenRouter embedding: {model_id}")
    elif openai_key:
        embedding_service = OpenAITextEmbedding(
            ai_model_id=os.environ.get("OPENAI_EMBEDDING_MODEL", "text-embedding-3-small"),
            api_key=openai_key,
        )
        print("使用 OpenAI embedding")
    else:
        print("請設定 OPENROUTER_API_KEY 或 OPENAI_API_KEY（.env 或環境變數）。")
        return

    kernel = Kernel()
    kernel.add_service(embedding_service)

    host = os.environ.get("QDRANT_HOST", "localhost")
    port = int(os.environ.get("QDRANT_PORT", "6333"))
    print(f"連線 Qdrant: {host}:{port}")

    client = QdrantClient(host=host, port=port)

    # 2. 若 collection 已存在可刪除再建（測試用），或改用 recreate=False 保留
    try:
        client.delete_collection(COLLECTION_NAME)
    except Exception:
        pass
    client.create_collection(
        collection_name=COLLECTION_NAME,
        vectors_config=VectorParams(size=DIM, distance=Distance.COSINE),
    )

    # 3. 為範例文字產生 embedding 並寫入 Qdrant
    points = []
    for i, text in enumerate(SAMPLE_TEXTS):
        vec = await get_embedding(kernel, text)
        points.append(
            PointStruct(
                id=str(uuid.uuid4()),
                vector=vec,
                payload={"text": text, "index": i},
            )
        )
    client.upsert(collection_name=COLLECTION_NAME, points=points)
    print(f"已寫入 {len(points)} 筆到 collection: {COLLECTION_NAME}")

    # 4. 用搜尋句做語意查詢（新版 qdrant_client 用 query_points 取代 search）
    query_vector = await get_embedding(kernel, SEARCH_QUERY)
    response = client.query_points(
        collection_name=COLLECTION_NAME,
        query=query_vector,
        limit=3,
    )
    hits = getattr(response, "points", None) or getattr(response, "result", []) or []
    print(f"\n搜尋: 「{SEARCH_QUERY}」")
    print("結果:")
    for r in hits:
        score = getattr(r, "score", None) or 0.0
        payload = getattr(r, "payload", None) or {}
        text = payload.get("text", payload)
        print(f"  score={score:.4f}  {text}")

    print("\n完成。")


if __name__ == "__main__":
    asyncio.run(main())
