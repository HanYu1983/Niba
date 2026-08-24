"""
Coder + Tester 協作（Semantic Kernel 0.9 相容版）

使用 SK 0.9 的 Kernel + 雙角色提示與迴圈模擬 AgentGroupChat：
Coder 撰寫 Plugin 代碼，Tester 審查並撰寫 Unit Test，直到 Tester 回覆包含 APPROVED。
需設定 .env 的 OPENROUTER_API_KEY。

除錯：若出現「(Coder 無回覆)」或「(Tester 無回覆)」，表示模型回傳的內容無法被解析成文字
（例如 API 逾時、回傳格式不同、或 content 為空）。可設定環境變數 DEBUG=1 執行，
會印出 result 的型別與內容以便排查。
"""

import asyncio
import os
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

OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1"
DEFAULT_OPENROUTER_MODEL = "minimax/minimax-m2.5"
MAX_TURNS = 6  # Coder 與 Tester 最多輪流發言次數

# 除錯模式：DEBUG=1 時會印出每次 invoke 的 result 摘要；無回覆時不論 DEBUG 都會印出原因
DEBUG = os.environ.get("DEBUG", "").lower() in ("1", "true", "yes")

CODER_PROMPT = """你是 Coder，一位精通 Python 與 Semantic Kernel 的資深開發者。
請根據「目前對話內容」中的需求與 Tester 的意見，撰寫或修正原子化、帶有 [kernel_function] 的 Plugin 代碼。
若這是第一則回覆，請直接依使用者需求產出完整 Plugin 代碼；若有 Tester 的審查意見，請依意見修正後再輸出完整代碼。
只輸出程式碼與必要註解，不要重複需求說明。

目前對話內容：
---
{{$conversation}}
---
請回覆（程式碼或說明）："""

TESTER_PROMPT = """你是 Tester，一位嚴格的測試工程師。
請根據「目前對話內容」檢查 Coder 寫的代碼是否有 Bug，並為其撰寫 Unit Test（或指出需修正之處）。
若代碼與測試都滿意，請在回覆最後明確寫出「APPROVED」。
若尚未滿意，請說明要修正的項目，不要寫 APPROVED。

目前對話內容：
---
{{$conversation}}
---
請回覆："""


def _get_text(result):
    """從 SK FunctionResult 取出字串。相容 value 為 ChatMessageContent 或 list[ChatMessageContent]。"""
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
        # 部分模型回傳 list 但元素結構不同，用 str 兜底
        return str(first).strip() if str(first).strip() else ""
    if isinstance(value, dict) and value:
        last = list(value.values())[-1]
        if hasattr(last, "content") and last.content is not None:
            return last.content if isinstance(last.content, str) else str(last.content)
        return str(last).strip() if last else ""
    return str(value).strip() if isinstance(value, str) else str(result)


def _debug_result(result, role: str, *, empty: bool = False):
    """
    印出 result 的除錯資訊。無回覆時（empty=True）會說明可能原因並印出結構。
    """
    prefix = "[除錯]"
    if empty:
        print(f"\n{prefix} 「{role} 無回覆」表示：模型有回傳，但從 FunctionResult 取出的文字為空。")
        print(f"{prefix} 常見原因：API 逾時、回傳格式與預期不同（例如 list/dict）、或 content 為空字串。\n")
    if result is None:
        print(f"{prefix} result 為 None（可能 invoke 拋錯或未回傳）。")
        return
    value = getattr(result, "value", None)
    print(f"{prefix} result 型別: {type(result).__name__}")
    print(f"{prefix} result.value 型別: {type(value).__name__}")
    if value is not None:
        if hasattr(value, "content"):
            c = getattr(value, "content", None)
            print(f"{prefix} value.content 型別: {type(c).__name__}, 長度: {len(str(c)) if c else 0}")
            if c is not None and len(str(c)) < 400:
                print(f"{prefix} value.content 預覽: {repr(c)[:400]}")
        if isinstance(value, list) and value:
            first = value[0]
            print(f"{prefix} value[0] 型別: {type(first).__name__}")
            if hasattr(first, "content"):
                fc = getattr(first, "content", None)
                print(f"{prefix} value[0].content 預覽: {repr(fc)[:300] if fc else None}")
    meta = getattr(result, "metadata", None) or {}
    if meta and (isinstance(meta, dict)):
        err = meta.get("exception") or meta.get("error")
        if err:
            print(f"{prefix} metadata 中的錯誤: {err}")
    raw_str = str(result)
    print(f"{prefix} str(result) 長度: {len(raw_str)}, 預覽: {repr(raw_str[:350])}")
    print()


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
        max_tokens=2000,
        temperature=0.3,
    )

    coder_config = PromptTemplateConfig(
        template=CODER_PROMPT,
        name="coder",
        template_format="semantic-kernel",
        input_variables=[{"name": "conversation", "description": "目前對話內容"}],
        execution_settings=execution_settings,
    )
    tester_config = PromptTemplateConfig(
        template=TESTER_PROMPT,
        name="tester",
        template_format="semantic-kernel",
        input_variables=[{"name": "conversation", "description": "目前對話內容"}],
        execution_settings=execution_settings,
    )

    coder_fn = kernel.add_function(
        function_name="coder",
        plugin_name="dev_team",
        prompt_template_config=coder_config,
    )
    tester_fn = kernel.add_function(
        function_name="tester",
        plugin_name="dev_team",
        prompt_template_config=tester_config,
    )

    task = "請幫我寫一個處理字幕檔案格式轉換的 SK Plugin (例如從 VTT 轉為 SRT)，並確保代碼具備原子性。"
    conversation = f"[使用者]\n{task}\n"

    for turn in range(MAX_TURNS):
        # Coder 發言
        print("\n===== [Coder] 發言 =====")
        try:
            r = await kernel.invoke(coder_fn, arguments=KernelArguments(conversation=conversation))
        except Exception as e:
            print(f"[錯誤] Coder invoke 拋錯: {e}")
            if DEBUG:
                import traceback
                traceback.print_exc()
            break
        if DEBUG:
            _debug_result(r, "Coder")
        coder_reply = _get_text(r)
        if not coder_reply or not coder_reply.strip():
            print("(Coder 無回覆)")
            _debug_result(r, "Coder", empty=True)
            break
        print(coder_reply[:1500] + ("..." if len(coder_reply) > 1500 else ""))
        conversation += f"\n[Coder]\n{coder_reply}\n"

        # Tester 發言
        print("\n===== [Tester] 發言 =====")
        try:
            r = await kernel.invoke(tester_fn, arguments=KernelArguments(conversation=conversation))
        except Exception as e:
            print(f"[錯誤] Tester invoke 拋錯: {e}")
            if DEBUG:
                import traceback
                traceback.print_exc()
            break
        if DEBUG:
            _debug_result(r, "Tester")
        tester_reply = _get_text(r)
        if not tester_reply or not tester_reply.strip():
            print("(Tester 無回覆)")
            _debug_result(r, "Tester", empty=True)
            break
        print(tester_reply[:1500] + ("..." if len(tester_reply) > 1500 else ""))
        conversation += f"\n[Tester]\n{tester_reply}\n"

        if "APPROVED" in tester_reply.upper():
            print("\n===== Tester 已 APPROVED，協作結束 =====")
            break
    else:
        print("\n===== 已達最大輪數，結束 =====")


if __name__ == "__main__":
    asyncio.run(main())
