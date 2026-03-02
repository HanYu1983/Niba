#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
AWS CLI 助手（Semantic Kernel）

使用本地 AWS CLI Plugin，由 AI 判斷要執行哪個 aws 指令並代為執行，再以自然語言回覆。
需設定 .env 的 OPENROUTER_API_KEY，以及本機已安裝並設定好 AWS CLI。

用法：
  python aws_cli_assistant.py                    # 預設測試問題：我的 AWS 帳號 ID 是什麼？
  python aws_cli_assistant.py "列出我的 S3 buckets"  # 自訂問題
"""

import asyncio
import os
import re
import sys
import warnings

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

from aws_cli_plugin import AwsCliPlugin

OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1"
DEFAULT_OPENROUTER_MODEL = "minimax/minimax-m2.5"

# 系統提示：請只回傳「要執行的 aws 子指令」
COMMAND_SUGGESTER_PROMPT = """你是 AWS CLI 專家。使用者會問一個關於 AWS 的問題，你需要決定要執行哪一個 aws 指令來回答。

規則：
- 只回覆「一個」aws 子指令與參數，不要加上「aws 」前綴，不要解釋。
- 範例回覆：sts get-caller-identity
- 範例回覆：s3 ls
- 範例回覆：s3 ls s3://my-bucket
- 若無法從問題判斷出單一指令，回覆最可能的一個，例如查帳號用 sts get-caller-identity。

使用者問題：
{{$user_question}}
"""

# 根據指令輸出，用自然語言回覆使用者
ANSWER_PROMPT = """你是友善的 AWS 助手。使用者問了以下問題，我們已經執行了 AWS CLI 並得到輸出。請用 1～3 句簡短、易懂的話回答使用者，不要貼整段 JSON 或原始輸出。

使用者問題：{{$user_question}}

AWS CLI 輸出：
---
{{$cli_output}}
---
請直接回覆給使用者的答案（不要加「根據輸出」等前綴）："""


def _get_text(result):
    """從 SK FunctionResult 取出字串。"""
    if result is None:
        return ""
    value = getattr(result, "value", None)
    if value is None:
        return ""
    if hasattr(value, "content") and value.content is not None:
        return value.content if isinstance(value.content, str) else str(value.content)
    if isinstance(value, list) and len(value) > 0:
        first = value[0]
        if hasattr(first, "content") and first.content is not None:
            return first.content if isinstance(first.content, str) else str(first.content)
    if isinstance(value, dict) and value:
        last = list(value.values())[-1]
        if hasattr(last, "content") and last.content is not None:
            return last.content if isinstance(last.content, str) else str(last.content)
        return str(last) if last else ""
    return str(value).strip() if isinstance(value, str) else str(result)


def _extract_aws_subcommand(reply: str) -> str:
    """從模型回覆中抽出 aws 子指令（去掉開頭的 aws、換行、多餘空白）。"""
    text = reply.strip()
    # 去掉開頭的 aws
    text = re.sub(r"^aws\s+", "", text, flags=re.I)
    # 取第一行
    first_line = text.split("\n")[0].strip()
    return first_line or "sts get-caller-identity"


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
    kernel.add_plugin(AwsCliPlugin(), plugin_name="aws_cli_plugin")

    execution_settings = OpenAIChatPromptExecutionSettings(
        service_id="default",
        ai_model_id=model_id,
        max_tokens=300,
        temperature=0.1,
    )

    # 語義函數：由 AI 建議要執行的 aws 子指令
    command_suggester_config = PromptTemplateConfig(
        template=COMMAND_SUGGESTER_PROMPT,
        name="command_suggester",
        template_format="semantic-kernel",
        input_variables=[{"name": "user_question", "description": "使用者問題"}],
        execution_settings=execution_settings,
    )
    command_suggester = kernel.add_function(
        function_name="command_suggester",
        plugin_name="assistant_plugin",
        prompt_template_config=command_suggester_config,
    )

    # 語義函數：根據 CLI 輸出產生給使用者的答案
    answer_config = PromptTemplateConfig(
        template=ANSWER_PROMPT,
        name="answer_from_cli",
        template_format="semantic-kernel",
        input_variables=[
            {"name": "user_question", "description": "使用者問題"},
            {"name": "cli_output", "description": "AWS CLI 輸出"},
        ],
        execution_settings=execution_settings,
    )
    answer_func = kernel.add_function(
        function_name="answer_from_cli",
        plugin_name="assistant_plugin",
        prompt_template_config=answer_config,
    )

    # ----- 測試問題：命令列參數或預設 -----
    test_question = (
        " ".join(sys.argv[1:]).strip()
        if len(sys.argv) > 1
        else "我的 AWS 帳號 ID 是什麼？"
    )
    if not test_question:
        test_question = "我的 AWS 帳號 ID 是什麼？"
    print(f"使用者問：{test_question}\n")

    # Step 1：請 AI 建議要執行的 aws 指令
    print("（助手正在決定要執行哪個 aws 指令…）")
    cmd_result = await kernel.invoke(
        command_suggester,
        arguments=KernelArguments(user_question=test_question),
    )
    suggested = _get_text(cmd_result)
    sub_command = _extract_aws_subcommand(suggested)
    print(f"執行指令：aws {sub_command}\n")

    # Step 2：呼叫 AWS CLI Plugin 執行
    aws_func = kernel.get_function("aws_cli_plugin", "run_aws_cli")
    cli_result = await kernel.invoke(
        aws_func,
        arguments=KernelArguments(sub_command_and_args=sub_command),
    )
    cli_output = str(cli_result.value) if cli_result and cli_result.value else ""
    if not cli_output:
        cli_output = "(無輸出)"
    print("AWS CLI 輸出：")
    print(cli_output[:500] + ("..." if len(cli_output) > 500 else ""))
    print()

    # Step 3：請 AI 根據輸出回覆使用者
    print("（助手正在整理回覆…）")
    answer_result = await kernel.invoke(
        answer_func,
        arguments=KernelArguments(user_question=test_question, cli_output=cli_output),
    )
    answer = _get_text(answer_result)
    print("助手回覆：", answer.strip() or "(無回覆)")


if __name__ == "__main__":
    asyncio.run(main())
