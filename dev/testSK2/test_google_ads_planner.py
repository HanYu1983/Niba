#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
用 Planner 測試 Google Ads Plugin

註冊 GoogleAdsPlugin，以 function calling 讓 LLM 依使用者意圖呼叫 query_ads，
並依 GAQL 查詢 Google Ads。

請設定 .env：OPENAI_API_KEY 或 OPENROUTER_API_KEY；
若會呼叫 query_ads，另需 Google Ads 相關變數（見 googleapi/SKILL.md）。

用法:
  python test_google_ads_planner.py
  python test_google_ads_planner.py "查一下關鍵字成效，最近 30 天"
  docker-compose run --rm app python test_google_ads_planner.py "查詢customer client為DAC_麒麟麦酒株式会社有幾個campaign"
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

from google_ads_plugin import GoogleAdsPlugin

OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1"
DEFAULT_OPENROUTER_MODEL = "minimax/minimax-m2.5"

# 預設 prompt：觸發 planner 呼叫 query_ads 查 campaign
DEFAULT_PROMPT = (
    "請用你手邊的 Google Ads 查詢工具，幫我查「廣告活動」列表："
    "campaign 的 id、name、status、advertising_channel_type，"
    "狀態不是 REMOVED 的，最多 10 筆。查完後用一兩句話總結給我看。"
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
    kernel.add_plugin(GoogleAdsPlugin(), plugin_name="google_ads")

    settings = kernel.get_prompt_execution_settings_from_service_id(service_id="default")
    settings.function_choice_behavior = FunctionChoiceBehavior.Auto(
        filters={"included_plugins": ["google_ads"]}
    )
    settings.max_tokens = 1500
    settings.temperature = 0.2

    prompt = (sys.argv[1] if len(sys.argv) > 1 else "").strip() or DEFAULT_PROMPT
    print("User (prompt):", prompt)
    print()

    result = await kernel.invoke_prompt(
        function_name="google_ads_planner",
        plugin_name="demo",
        prompt=prompt,
        settings=settings,
    )

    reply = str(result) if result else "(無回覆)"
    print("Assistant (planner 執行結果):")
    print(reply)


if __name__ == "__main__":
    asyncio.run(main())
