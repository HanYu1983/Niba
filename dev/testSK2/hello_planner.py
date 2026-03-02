#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Semantic Kernel 簡單 Planner 範例 - Hello（相容 0.9.x）

1. 註冊 HelloPlugin（say_hello），並用 semantic function 請 LLM 說你好
2. 先透過 plugin 取得問候語，再讓 LLM 依 prompt 回覆一句 Hello

請設定環境變數 OPENAI_API_KEY，或在專案目錄建立 .env。
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

from openai import AsyncOpenAI
from semantic_kernel import Kernel
from semantic_kernel.connectors.ai.open_ai import OpenAIChatCompletion
from semantic_kernel.connectors.ai.open_ai import OpenAIChatPromptExecutionSettings
from semantic_kernel.prompt_template import PromptTemplateConfig

from hello_plugin import HelloPlugin

# OpenRouter 端點與 OpenAI API 格式相容，所以用 OpenAI client 改 base_url 即可
OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1"
# 模型 ID 格式為「供應商/模型名」，完整列表：https://openrouter.ai/models
DEFAULT_OPENROUTER_MODEL = "minimax/minimax-m2.5"

async def main():
    api_key = os.environ.get("OPENROUTER_API_KEY")
    if not api_key:
        print("請設定環境變數 OPENROUTER_API_KEY .env 並寫入 OPENAI_API_KEY=sk-...")
        return

    service_id = "default"

    openrouter_client = AsyncOpenAI(
        base_url=OPENROUTER_BASE_URL,
        api_key=api_key,
    )

    # 可透過環境變數 OPENROUTER_MODEL_ID 切換模型，例如 anthropic/claude-3-haiku
    model_id = os.environ.get("OPENROUTER_MODEL_ID", DEFAULT_OPENROUTER_MODEL)


    # 1. 建立 Kernel，加入 OpenAI Chat 服務
    kernel = Kernel()
    kernel.add_service(
        OpenAIChatCompletion(
            service_id=service_id,
            ai_model_id=model_id,
            async_client=openrouter_client,
        )
    )

    # 2. 註冊 Hello Plugin
    kernel.add_plugin(HelloPlugin(), plugin_name="hello")

    # 3. 註冊一個「說你好」的 semantic function（單步 planner）
    execution_settings = OpenAIChatPromptExecutionSettings(
        service_id=service_id,
        ai_model_id="gpt-3.5-turbo",
        max_tokens=200,
        temperature=0.3,
    )
    prompt_config = PromptTemplateConfig(
        template="請用一句話向使用者說 Hello。",
        name="hello_plan",
        template_format="semantic-kernel",
        input_variables=[],
        execution_settings=execution_settings,
    )
    hello_func = kernel.add_function(
        function_name="hello_plan",
        plugin_name="hello_plugin",
        prompt_template_config=prompt_config,
    )

    # 4. 執行：先呼叫 plugin 取得問候，再執行 planner prompt
    print("(1) Plugin say_hello:", HelloPlugin().say_hello("World"))
    print()
    print("(2) Planner (semantic function) 回覆:")
    result = await kernel.invoke(hello_func)
    reply = result.get_inner_content() if result and hasattr(result, "get_inner_content") else getattr(result, "value", result)
    print(reply or "(無回覆)")


if __name__ == "__main__":
    asyncio.run(main())
