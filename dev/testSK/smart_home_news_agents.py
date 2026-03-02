#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
雙 Agent 協作：智能家居熱門新聞
- Agent 1（新聞查詢）：查詢最近最熱門的 2 條智能家居新聞，附來源網址
- Agent 2（摘要寫入）：將查到的資料總結並以 Markdown 寫入檔案
使用 Semantic Kernel + OpenRouter。
"""

import asyncio
import os
import warnings
from pathlib import Path

warnings.filterwarnings("ignore", message=".*urllib3 v2 only supports OpenSSL.*")

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

from openai import AsyncOpenAI
from semantic_kernel import Kernel
from semantic_kernel.connectors.ai.open_ai import OpenAIChatCompletion
from semantic_kernel.connectors.ai.open_ai import OpenAIChatPromptExecutionSettings
from semantic_kernel.functions.kernel_arguments import KernelArguments
from semantic_kernel.prompt_template import PromptTemplateConfig

OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1"
DEFAULT_OPENROUTER_MODEL = "minimax/minimax-m2.5"
OUTPUT_FILE = Path(__file__).resolve().parent / "smart_home_news_report.md"


# ---------------------------------------------------------------------------
# Agent 1：新聞查詢（只取 2 條，附來源網址）
# ---------------------------------------------------------------------------
NEWS_SEARCHER_PROMPT = """你是一位智能家居領域的資訊助理。請「直接用文字」列出最近最熱門的 2 條智能家居相關新聞。

重要：請直接輸出純文字內容，不要使用任何搜尋工具、不要只輸出 JSON 或 API 呼叫。請根據你的知識寫出 2 條真實或具代表性的熱門新聞。

要求：
- 只輸出 2 條新聞。
- 每條請包含：標題、簡短摘要（1～2 句）、以及來源網址（可為真實或範例格式的 URL）。
- 輸出格式請用清楚的分段，例如：
  新聞1標題：...
  新聞1摘要：...
  新聞1來源：...
  新聞2標題：...
  新聞2摘要：...
  新聞2來源：...
"""


# ---------------------------------------------------------------------------
# Agent 2：將新聞內容總結並整理成 Markdown
# ---------------------------------------------------------------------------
MARKDOWN_WRITER_PROMPT = """你是一位專業的技術寫作助理。請將以下「智能家居熱門新聞」的原始內容，整理成一份簡潔的 Markdown 報告。

要求：
- 標題使用： # 智能家居熱門新聞摘要
- 每條新聞用 ## 編號. 標題 作為小標，接著一段摘要，最後一行用「來源：」加上可點擊的連結，例如：來源：[連結文字](URL)
- 保持簡短、易讀，不要添加額外章節。
- 只根據提供的內容撰寫，不要編造沒有出現的新聞或網址。

以下是 Agent 1 查詢到的新聞原始內容：
---
{{$news_content}}
---
請直接輸出完整的 Markdown 內容，不要加上說明文字。"""


async def main():
    api_key = os.environ.get("OPENROUTER_API_KEY")
    if not api_key:
        print("請設定環境變數 OPENROUTER_API_KEY（可寫在 .env）")
        return

    openrouter_client = AsyncOpenAI(
        base_url=OPENROUTER_BASE_URL,
        api_key=api_key,
    )
    model_id = os.environ.get("OPENROUTER_MODEL_ID", DEFAULT_OPENROUTER_MODEL)

    kernel = Kernel()
    kernel.add_service(
        OpenAIChatCompletion(
            ai_model_id=model_id,
            service_id="default",
            async_client=openrouter_client,
        )
    )

    execution_settings = OpenAIChatPromptExecutionSettings(
        service_id="default",
        ai_model_id=model_id,
        max_tokens=1500,
        temperature=0.3,
    )

    # ----- Agent 1：新聞查詢 -----
    news_searcher_config = PromptTemplateConfig(
        template=NEWS_SEARCHER_PROMPT,
        name="news_searcher",
        template_format="semantic-kernel",
        input_variables=[],
        execution_settings=execution_settings,
    )
    news_searcher = kernel.add_function(
        function_name="news_searcher",
        plugin_name="news_plugin",
        prompt_template_config=news_searcher_config,
    )

    print("Agent 1（新聞查詢）執行中…")
    result1 = await kernel.invoke(news_searcher)
    news_content = _get_text(result1)
    if not news_content or not news_content.strip():
        print("Agent 1 未傳回內容，請檢查 OPENROUTER_API_KEY 或稍後重試。")
        return
    print("Agent 1 完成，取得新聞內容。\n")

    # ----- Agent 2：總結並輸出 Markdown -----
    writer_config = PromptTemplateConfig(
        template=MARKDOWN_WRITER_PROMPT,
        name="markdown_writer",
        template_format="semantic-kernel",
        input_variables=[{"name": "news_content", "description": "新聞原始內容"}],
        execution_settings=execution_settings,
    )
    markdown_writer = kernel.add_function(
        function_name="markdown_writer",
        plugin_name="writer_plugin",
        prompt_template_config=writer_config,
    )

    print("Agent 2（摘要寫入）執行中…")
    writer_args = KernelArguments(news_content=news_content)
    result2 = await kernel.invoke(markdown_writer, arguments=writer_args)
    markdown_text = _get_text(result2)
    if not markdown_text or not markdown_text.strip():
        print("Agent 2 未傳回內容，結束。")
        return
    print("Agent 2 完成。\n")

    # ----- 寫入檔案 -----
    OUTPUT_FILE.write_text(markdown_text.strip(), encoding="utf-8")
    print(f"已將報告寫入：{OUTPUT_FILE}")


def _get_text(result):
    """從 SK FunctionResult 取出助理回覆字串（ChatMessageContent.content）。"""
    if result is None:
        return ""
    value = getattr(result, "value", None)
    if value is None:
        return ""
    # Chat 完成回傳的是 ChatMessageContent，文字在 .content
    if hasattr(value, "content") and value.content is not None:
        return value.content if isinstance(value.content, str) else str(value.content)
    if isinstance(value, list) and len(value) > 0:
        first = value[0]
        if hasattr(first, "content") and first.content is not None:
            return first.content if isinstance(first.content, str) else str(first.content)
    # SK 有時會包成 dict，取最後一個 value（通常為助理回覆）
    if isinstance(value, dict) and value:
        last = list(value.values())[-1]
        if hasattr(last, "content") and last.content is not None:
            return last.content if isinstance(last.content, str) else str(last.content)
        return str(last) if last else ""
    # 最終後備：SK FunctionResult.__str__ 會轉成字串
    return str(value).strip() if isinstance(value, str) else str(result)


if __name__ == "__main__":
    asyncio.run(main())
