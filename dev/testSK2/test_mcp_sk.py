#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
用 Semantic Kernel 測試本地 MCP（FastMCP 讀檔伺服器）

1. 連線至 MCP 伺服器（docker-compose 的 mcp 服務，或本機 http://localhost:8000）
2. 將 MCP 註冊為 SK plugin，以 function calling 讓 LLM 呼叫 read_file / list_dir
3. 依 prompt 執行並印出結果

請先啟動：docker-compose up -d
再執行：docker-compose run --rm app python test_mcp_sk.py
本機跑 MCP 時：MCP_URL=http://localhost:8000 python test_mcp_sk.py

.env 需有 OPENAI_API_KEY 或 OPENROUTER_API_KEY。
"""
import asyncio
import os
import sys
import warnings

warnings.filterwarnings("ignore", message=".*urllib3.*")

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

from semantic_kernel import Kernel
from semantic_kernel.connectors.ai.function_choice_behavior import FunctionChoiceBehavior
from semantic_kernel.connectors.ai.open_ai import OpenAIChatCompletion

OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1"
DEFAULT_OPENROUTER_MODEL = "minimax/minimax-m2.5"
MCP_PLUGIN_NAME = "file_reader"

# 預設 prompt：請 MCP 讀檔
DEFAULT_PROMPT = (
    "請用你手邊的「讀取本地檔案」工具，讀取 readme.txt 的內容，"
    "並用一兩句話告訴我檔案裡寫了什麼。"
)


def _mcp_url() -> str:
    base = os.environ.get("MCP_URL", "http://localhost:8000").rstrip("/")
    return f"{base}/sse" if "/sse" not in base else base


async def main():
    try:
        from semantic_kernel.connectors.mcp import MCPSsePlugin
    except ImportError as e:
        print("請安裝 semantic-kernel[mcp]：pip install semantic-kernel[mcp]")
        raise SystemExit(1) from e

    openrouter_key = os.environ.get("OPENROUTER_API_KEY")
    openai_key = os.environ.get("OPENAI_API_KEY")
    if openrouter_key:
        from openai import AsyncOpenAI
        client = AsyncOpenAI(base_url=OPENROUTER_BASE_URL, api_key=openrouter_key)
        model_id = os.environ.get("OPENROUTER_MODEL_ID", DEFAULT_OPENROUTER_MODEL)
        chat_service = OpenAIChatCompletion(
            service_id="default",
            ai_model_id=model_id,
            async_client=client,
        )
    elif openai_key:
        chat_service = OpenAIChatCompletion(
            service_id="default",
            ai_model_id=os.environ.get("OPENAI_CHAT_MODEL_ID", "gpt-3.5-turbo"),
            api_key=openai_key,
        )
    else:
        print("請設定 OPENAI_API_KEY 或 OPENROUTER_API_KEY（.env 或環境變數）。")
        return

    mcp_url = _mcp_url()
    print(f"連線 MCP: {mcp_url}")

    async with MCPSsePlugin(
        name=MCP_PLUGIN_NAME,
        description="讀取本地檔案的 MCP 工具（read_file, list_dir）",
        url=mcp_url,
    ) as mcp_plugin:
        kernel = Kernel()
        kernel.add_service(chat_service)
        kernel.add_plugin(mcp_plugin, plugin_name=MCP_PLUGIN_NAME)

        settings = kernel.get_prompt_execution_settings_from_service_id(service_id="default")
        settings.function_choice_behavior = FunctionChoiceBehavior.Auto(
            filters={"included_plugins": [MCP_PLUGIN_NAME]}
        )
        settings.max_tokens = 1000
        settings.temperature = 0.2

        prompt = (sys.argv[1] if len(sys.argv) > 1 else "").strip() or DEFAULT_PROMPT
        print("User (prompt):", prompt)
        print()

        result = await kernel.invoke_prompt(
            function_name="mcp_planner",
            plugin_name="demo",
            prompt=prompt,
            settings=settings,
        )

        reply = str(result) if result else "(無回覆)"
        print("Assistant (planner 執行結果):")
        print(reply)


if __name__ == "__main__":
    asyncio.run(main())
