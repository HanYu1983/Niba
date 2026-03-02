#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
雙 Agent 協作：智能家居熱門新聞（含上網查詢 MCP/Plugin）
- 上網查詢 Plugin：使用 DuckDuckGo 搜尋網路，取得新聞來源與連結
- Agent 1（新聞查詢）：根據搜尋結果挑選 2 條最熱門新聞，附來源網址
- Agent 2（摘要寫入）：將查到的資料總結並以 Markdown 寫入檔案
使用 Semantic Kernel + OpenRouter。
"""

import asyncio
import os
import warnings
from pathlib import Path
from typing import Annotated

warnings.filterwarnings("ignore", message=".*urllib3 v2 only supports OpenSSL.*")
warnings.filterwarnings("ignore", message=".*duckduckgo_search.*renamed to.*")

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

from duckduckgo_search import DDGS
from openai import AsyncOpenAI
from semantic_kernel import Kernel
from semantic_kernel.connectors.ai.open_ai import OpenAIChatCompletion
from semantic_kernel.connectors.ai.open_ai import OpenAIChatPromptExecutionSettings
from semantic_kernel.functions.kernel_arguments import KernelArguments
from semantic_kernel.functions.kernel_function_decorator import kernel_function
from semantic_kernel.prompt_template import PromptTemplateConfig

OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1"
DEFAULT_OPENROUTER_MODEL = "minimax/minimax-m2.5"
OUTPUT_FILE = Path(__file__).resolve().parent / "smart_home_news_report.md"


# ---------------------------------------------------------------------------
# 上網查詢 Plugin（MCP 風格：提供網路搜尋能力給 Agent）
# ---------------------------------------------------------------------------
class WebSearchPlugin:
    """提供網路搜尋的 Plugin，供 AI Agent 上網查詢新聞等。"""

    @kernel_function(
        name="search_news",
        description="在網路上搜尋指定關鍵字的新聞，回傳標題、摘要與來源網址。用於查詢熱門新聞。",
    )
    def search_news(
        self,
        query: Annotated[str, "搜尋關鍵字，例如：智能家居 熱門新聞 2025"],
        max_results: Annotated[int, "最多回傳幾筆結果"] = 8,
    ) -> str:
        """使用 DuckDuckGo 搜尋新聞，回傳整理後的文字（標題、摘要、URL）。"""
        return _do_web_search(query, max_results)


def _do_web_search(query: str, max_results: int = 8) -> str:
    """同步執行網路搜尋（在執行緒中呼叫，避免阻塞）。先試新聞搜尋，無結果則改為一般搜尋。"""
    try:
        with DDGS() as ddgs:
            results = list(ddgs.news(query, max_results=max_results))
            if not results:
                # 新聞無結果時改用一般網頁搜尋
                results = list(ddgs.text(query, max_results=max_results))
    except Exception as e:
        return f"[搜尋發生錯誤: {e}]"
    if not results:
        return "[未找到相關結果]"
    lines = []
    for i, r in enumerate(results, 1):
        title = r.get("title") or ""
        body = r.get("body") or r.get("href") or ""
        url = r.get("url") or r.get("href") or ""
        lines.append(f"【{i}】{title}\n摘要：{body}\n來源：{url}")
    return "\n\n".join(lines)


# ---------------------------------------------------------------------------
# Agent 1：根據「搜尋結果」挑選 2 條新聞（附來源網址）
# ---------------------------------------------------------------------------
NEWS_SEARCHER_PROMPT = """你是一位資訊助理。以下是用「上網查詢」得到的搜尋結果，請從中挑選「最熱門、最值得報導」的 2 條semantic kernel相關新聞。

要求：
- 只輸出 2 條新聞，必須來自下方搜尋結果，不要編造。
- 每條請包含：標題、簡短摘要（1～2 句）、以及來源網址（請使用搜尋結果中的「來源」URL）。
- 輸出格式請用清楚的分段，例如：
  新聞1標題：...
  新聞1摘要：...
  新聞1來源：...
  新聞2標題：...
  新聞2摘要：...
  新聞2來源：...

以下是網路搜尋結果：
---
{{$search_results}}
---
請直接輸出上述格式的 2 條新聞，不要加上其他說明。"""


# ---------------------------------------------------------------------------
# Agent 2：將新聞內容總結並整理成 Markdown
# ---------------------------------------------------------------------------
MARKDOWN_WRITER_PROMPT = """你是一位專業的技術寫作助理。請將以下「semantic kernel 熱門新聞」的原始內容，整理成一份簡潔的 Markdown 報告。

要求：
- 標題使用： # semantic kernel 熱門新聞摘要
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

    # ----- 上網查詢 Plugin（MCP 風格） -----
    kernel.add_plugin(WebSearchPlugin(), plugin_name="web_search_plugin")

    execution_settings = OpenAIChatPromptExecutionSettings(
        service_id="default",
        ai_model_id=model_id,
        max_tokens=1500,
        temperature=0.3,
    )

    # ----- Step 1：上網查詢（呼叫 MCP/Plugin 的搜尋能力） -----
    search_query = "semantic kernel 2026"
    print(f"上網查詢中：{search_query}")
    search_results_text = await asyncio.to_thread(_do_web_search, search_query, 8)
    if not search_results_text:
        print("上網查詢未取得結果。")
        return
    if search_results_text.strip().startswith("[搜尋發生錯誤"):
        print("上網查詢錯誤：", search_results_text[:250])
        return
    print("上網查詢完成。\n")

    # print(search_results_text)
    # return

    # ----- Step 2：Agent 1 根據搜尋結果挑選 2 條新聞 -----
    news_searcher_config = PromptTemplateConfig(
        template=NEWS_SEARCHER_PROMPT,
        name="news_searcher",
        template_format="semantic-kernel",
        input_variables=[{"name": "search_results", "description": "網路搜尋結果文字"}],
        execution_settings=execution_settings,
    )
    news_searcher = kernel.add_function(
        function_name="news_searcher",
        plugin_name="news_plugin",
        prompt_template_config=news_searcher_config,
    )

    print("Agent 1（新聞查詢）執行中…")
    result1 = await kernel.invoke(
        news_searcher,
        arguments=KernelArguments(search_results=search_results_text),
    )
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
