#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Semantic Kernel 簡單 Planner 範例 - Hello（1.x function calling）

使用「自動 function calling」作為 planner：
1. 註冊 HelloPlugin（say_hello）
2. 啟用 FunctionChoiceBehavior.Auto，由 LLM 規劃是否呼叫 say_hello
3. 執行後印出助理回覆

請設定 OPENAI_API_KEY 或 OPENROUTER_API_KEY（二擇一），並可選 OPENROUTER_MODEL_ID。
"""
import asyncio
import os
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

from hello_plugin import HelloPlugin

OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1"
DEFAULT_OPENROUTER_MODEL = "minimax/minimax-m2.5"


async def main():
    # 支援 OpenRouter 或 OpenAI
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

    kernel = Kernel()
    kernel.add_service(chat_service)
    kernel.add_plugin(HelloPlugin(), plugin_name="hello")

    # 啟用 planner（function calling）：只允許 hello plugin
    settings = kernel.get_prompt_execution_settings_from_service_id(service_id="default")
    settings.function_choice_behavior = FunctionChoiceBehavior.Auto(
        filters={"included_plugins": ["hello"]}
    )
    settings.max_tokens = 200
    settings.temperature = 0.3

    prompt = "請向使用者說 Hello（請使用你手邊可用的工具）。"
    print("User (prompt):", prompt)
    print()

    # 使用 invoke_prompt 觸發 planner（LLM 會決定是否呼叫 say_hello）
    result = await kernel.invoke_prompt(
        function_name="hello_planner",
        plugin_name="demo",
        prompt=prompt,
        settings=settings,
    )

    reply = str(result) if result else "(無回覆)"
    print("Assistant (planner 執行結果):", reply)


if __name__ == "__main__":
    asyncio.run(main())
