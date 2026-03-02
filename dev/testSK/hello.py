#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Microsoft Semantic Kernel (SK) - Hello (Python 3)

使用 Semantic Kernel 呼叫 LLM 回覆一句問候。
請設定環境變數 OPENAI_API_KEY，或建立 .env 並寫入 OPENAI_API_KEY=sk-...
"""

import asyncio
import os
import warnings

# 抑制 urllib3 在 macOS LibreSSL 下的 OpenSSL 警告（不影響連線）
warnings.filterwarnings("ignore", message=".*urllib3 v2 only supports OpenSSL.*")

# 可選：從 .env 載入環境變數（需安裝 python-dotenv）
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

# ----- 匯入 Semantic Kernel 核心元件 -----
# Kernel：SK 的核心，負責管理 AI 服務、插件與函數的呼叫
# OpenAIChatCompletion：連接 OpenAI Chat API 的服務
# OpenAIChatPromptExecutionSettings：設定每次呼叫的模型參數（如溫度、token 數）
# PromptTemplateConfig：定義「提示詞模板」的結構（把自然語言當成可重複呼叫的函數）
from semantic_kernel import Kernel
from semantic_kernel.connectors.ai.open_ai import OpenAIChatCompletion
from semantic_kernel.connectors.ai.open_ai import OpenAIChatPromptExecutionSettings
from semantic_kernel.prompt_template import PromptTemplateConfig


async def main():
    # ----- 1. 取得 API Key -----
    # 建議放在 .env，不要寫在程式裡，避免洩漏
    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key:
        print("請設定環境變數 OPENAI_API_KEY，或在專案目錄建立 .env 並寫入 OPENAI_API_KEY=sk-...")
        return

    # ----- 2. 建立 Kernel 並註冊 AI 服務 -----
    # Kernel 是 SK 的入口：所有「與 LLM 對話」都透過它
    kernel = Kernel()
    # add_service：把一個「Chat 完成服務」掛到 Kernel 上，之後執行 prompt 時會用這個服務
    # service_id 用來在有多個服務時指定要用哪一個
    kernel.add_service(
        OpenAIChatCompletion(
            ai_model_id="gpt-3.5-turbo",  # 使用的模型
            service_id="default",
            api_key=api_key,
        )
    )

    # ----- 3. 定義「語義函數」（Semantic Function） -----
    # 在 SK 裡，一段「送給 LLM 的提示詞」可以包成一個「函數」，方便重複呼叫、組合
    service_id = "default"
    # execution_settings：這次呼叫要用哪些模型參數
    execution_settings = OpenAIChatPromptExecutionSettings(
        service_id=service_id,      # 對應上面 add_service 的 service_id
        ai_model_id="gpt-3.5-turbo",
        max_tokens=200,             # 回覆最多 200 個 token
        temperature=0.7,             # 創造性程度，0～1，越高越隨機
    )
    # PromptTemplateConfig：把「一句話」變成一個可設定的模板
    # template 裡之後可以加變數，例如 "請用一句話向 {{$name}} 說你好"
    prompt_template_config = PromptTemplateConfig(
        template="請用一句話說你好（Hello）。",
        name="hello",               # 這個函數的名稱，方便在 Kernel 裡辨識
        template_format="semantic-kernel",
        input_variables=[],         # 此範例沒有輸入變數；有變數時會列在這裡
        execution_settings=execution_settings,
    )

    # 把「提示詞模板」註冊成 Kernel 的一個函數，歸在某個 plugin 下
    # plugin 用來分組多個相關函數（例如：翻譯 plugin、摘要 plugin）
    hello_func = kernel.add_function(
        function_name="hello",
        plugin_name="hello_plugin",
        prompt_template_config=prompt_template_config,
    )

    # ----- 4. 呼叫函數並取得回覆 -----
    # kernel.invoke(函數)：非同步執行該函數，把 prompt 送給 LLM，拿回結果
    result = await kernel.invoke(hello_func)

    # ----- 5. 從 FunctionResult 取出文字 -----
    # invoke 回傳的是 FunctionResult，實際 LLM 回覆在 get_inner_content() 或 .value
    reply = result.get_inner_content() if result and hasattr(result, "get_inner_content") else getattr(result, "value", result)
    print("Semantic Kernel 回覆:", reply)


# Python 非同步程式的入口：用 asyncio.run 執行 async 的 main
if __name__ == "__main__":
    asyncio.run(main())
