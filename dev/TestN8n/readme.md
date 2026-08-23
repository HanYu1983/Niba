/* 啟用 extension（只需一次） */
CREATE EXTENSION IF NOT EXISTS vector;
/* 建立資料表 */
CREATE TABLE rag_documents (
    id SERIAL PRIMARY KEY,
    content TEXT,                -- 原始文本
    embedding VECTOR(512),      -- 向量欄位，維度要和你的 embedding 模型一致
    metadata JSONB               -- 可選，用來存額外資訊
);

/dt