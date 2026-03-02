#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
用 Planner 測試 Facebook Graph API Plugin

註冊 FacebookPlugin，以 function calling 讓 LLM 依使用者意圖呼叫 query_graph，
查詢 Facebook Graph API（例如 /me、/me/adaccounts、廣告帳號的 campaigns）。

請設定 .env：OPENAI_API_KEY 或 OPENROUTER_API_KEY；
若會呼叫 query_graph，另需 FB_ACCESS_TOKEN（見 facebookapi/SKILL.md）。

用法:
  python test_facebook_planner.py
  python test_facebook_planner.py "用 Facebook API 查一下我的廣告帳號列表"
  docker-compose run --rm app python test_facebook_planner.py "查 /me 的 id 和 name"
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

from facebook_plugin import FacebookPlugin

OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1"
DEFAULT_OPENROUTER_MODEL = "minimax/minimax-m2.5"

# 預設 prompt：觸發 planner 呼叫 query_graph 查 /me
DEFAULT_PROMPT = (
    "請用你手邊的 Facebook Graph API 查詢工具，幫我查「我」的資料："
    "呼叫路徑 /me，查完後用一兩句話總結給我看（例如 id、name）。"
)


async def main():
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
    kernel.add_plugin(FacebookPlugin(), plugin_name="facebook")

    settings = kernel.get_prompt_execution_settings_from_service_id(service_id="default")
    settings.function_choice_behavior = FunctionChoiceBehavior.Auto(
        filters={"included_plugins": ["facebook"]}
    )
    settings.max_tokens = 1500
    settings.temperature = 0.2

    prompt = (sys.argv[1] if len(sys.argv) > 1 else "").strip() or DEFAULT_PROMPT
    print("User (prompt):", prompt)
    print()

    result = await kernel.invoke_prompt(
        function_name="facebook_planner",
        plugin_name="demo",
        prompt=prompt,
        settings=settings,
    )

    reply = str(result) if result else "(無回覆)"
    print("Assistant (planner 執行結果):")
    print(reply)


if __name__ == "__main__":
    asyncio.run(main())
