#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Microsoft Semantic Kernel (SK) + OpenRouter 範例

OpenRouter 提供 OpenAI 相容 API，可用 SK 的 OpenAIChatCompletion
搭配自訂 AsyncOpenAI(base_url=OpenRouter 網址, api_key=OPENROUTER_API_KEY) 使用。

請在 .env 設定 OPENROUTER_API_KEY，或從 https://openrouter.ai/keys 取得。
模型 ID 請用 OpenRouter 格式，例如：openai/gpt-3.5-turbo、anthropic/claude-3-haiku
"""

import asyncio
import os
import warnings

# 抑制 urllib3 在 macOS LibreSSL 下的 OpenSSL 警告（不影響連線）
warnings.filterwarnings("ignore", message=".*urllib3 v2 only supports OpenSSL.*")

# 從 .env 載入環境變數，方便管理 API Key
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

# OpenAI 官方 Python 客戶端：可指定 base_url 連到「相容 OpenAI API」的服務（如 OpenRouter）
from openai import AsyncOpenAI

from semantic_kernel import Kernel
from semantic_kernel.connectors.ai.open_ai import OpenAIChatCompletion
from semantic_kernel.connectors.ai.open_ai import OpenAIChatPromptExecutionSettings
from semantic_kernel.prompt_template import PromptTemplateConfig

# ----- OpenRouter 設定 -----
# OpenRouter 端點與 OpenAI API 格式相容，所以用 OpenAI client 改 base_url 即可
OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1"
# 模型 ID 格式為「供應商/模型名」，完整列表：https://openrouter.ai/models
DEFAULT_OPENROUTER_MODEL = "minimax/minimax-m2.5"


async def main():
    # ----- 1. 取得 OpenRouter API Key -----
    api_key = os.environ.get("OPENROUTER_API_KEY")
    if not api_key:
        print("請設定環境變數 OPENROUTER_API_KEY（可寫在 .env），從 https://openrouter.ai/keys 取得")
        return

    # ----- 2. 建立「指向 OpenRouter」的 OpenAI 相容 client -----
    # 關鍵：base_url 改成 OpenRouter，api_key 用 OpenRouter 的 key
    # 這樣所有請求會發到 OpenRouter，由它轉發到實際模型（如 GPT、Claude 等）
    openrouter_client = AsyncOpenAI(
        base_url=OPENROUTER_BASE_URL,
        api_key=api_key,
    )

    # 可透過環境變數 OPENROUTER_MODEL_ID 切換模型，例如 anthropic/claude-3-haiku
    model_id = os.environ.get("OPENROUTER_MODEL_ID", DEFAULT_OPENROUTER_MODEL)

    # ----- 3. 建立 Kernel 並註冊「使用 OpenRouter 的」Chat 服務 -----
    kernel = Kernel()
    # 這裡不自己建 AsyncOpenAI，而是把上面建好的 openrouter_client 傳給 OpenAIChatCompletion
    # async_client 參數：讓 SK 使用我們指定的 client（含自訂 base_url），而不是預設的 api.openai.com
    kernel.add_service(
        OpenAIChatCompletion(
            ai_model_id=model_id,       # OpenRouter 的模型 ID，如 openai/gpt-3.5-turbo
            service_id="default",
            async_client=openrouter_client,
        )
    )

    # ----- 4. 定義語義函數（與 hello.py 相同概念） -----
    execution_settings = OpenAIChatPromptExecutionSettings(
        service_id="default",
        ai_model_id=model_id,
        max_tokens=200,
        temperature=0.7,
    )

    prompt_template_config = PromptTemplateConfig(
        template="請用一句話說你好（Hello）。",
        name="hello",
        template_format="semantic-kernel",
        input_variables=[],
        execution_settings=execution_settings,
    )

    hello_func = kernel.add_function(
        function_name="hello",
        plugin_name="hello_plugin",
        prompt_template_config=prompt_template_config,
    )

    # ----- 5. 呼叫並取得回覆 -----
    # 對 SK 來說流程一樣：invoke(函數) → 差別在底層請求會發到 OpenRouter 而非 OpenAI
    result = await kernel.invoke(hello_func)
    reply = result.get_inner_content() if result and hasattr(result, "get_inner_content") else getattr(result, "value", result)
    print("Semantic Kernel (OpenRouter) 回覆:", reply)


if __name__ == "__main__":
    asyncio.run(main())
