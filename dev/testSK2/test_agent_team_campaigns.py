#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
AI 團隊測試：兩 agent 分別從 Facebook / Google Ads 取得 campaign，
找出最多 2 筆名稱相似的 campaign，並用本地 MCP 寫出結果。

使用 semantic_kernel.agents 的 ChatCompletionAgent、GroupChatOrchestration；
若無則改為兩次 planner 取得資料後在程式中比對並寫檔。

請先：docker-compose up -d（含 mcp）
.env：OPENAI 或 OPENROUTER API key；若用 FB/Google 需對應 token。
"""
import asyncio
import os
import re
import warnings
from difflib import SequenceMatcher

warnings.filterwarnings("ignore", message=".*urllib3.*")

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1"
DEFAULT_OPENROUTER_MODEL = "minimax/minimax-m2.5"
MCP_OUTPUT_FILE = "campaign_match_result.txt"
MAX_SIMILAR_PAIRS = 2


def _chat_service():
    from semantic_kernel.connectors.ai.open_ai import OpenAIChatCompletion
    openrouter_key = os.environ.get("OPENROUTER_API_KEY")
    openai_key = os.environ.get("OPENAI_API_KEY")
    if openrouter_key:
        from openai import AsyncOpenAI
        client = AsyncOpenAI(base_url=OPENROUTER_BASE_URL, api_key=openrouter_key)
        model_id = os.environ.get("OPENROUTER_MODEL_ID", DEFAULT_OPENROUTER_MODEL)
        return OpenAIChatCompletion(
            service_id="default",
            ai_model_id=model_id,
            async_client=client,
        )
    if openai_key:
        return OpenAIChatCompletion(
            service_id="default",
            ai_model_id=os.environ.get("OPENAI_CHAT_MODEL_ID", "gpt-3.5-turbo"),
            api_key=openai_key,
        )
    raise RuntimeError("請設定 OPENAI_API_KEY 或 OPENROUTER_API_KEY")


def _extract_campaign_names(text: str) -> list[str]:
    """從 agent 回報文字中抽出 campaign 名稱（每行一項或常見格式）。"""
    if not text or not text.strip():
        return []
    names = []
    for line in text.replace("\r", "\n").split("\n"):
        line = line.strip()
        if not line or line.startswith("#") or line.startswith("["):
            continue
        # 去掉前綴編號、箭頭等
        line = re.sub(r"^[\d\-*\.]+\s*", "", line)
        if len(line) > 1 and len(line) < 200:
            names.append(line)
    return list(dict.fromkeys(names))  # 去重保留順序


def _normalize(name: str) -> str:
    return name.lower().strip()


def _similarity(a: str, b: str) -> float:
    na, nb = _normalize(a), _normalize(b)
    if na == nb:
        return 1.0
    if na in nb or nb in na:
        return 0.9
    return SequenceMatcher(None, na, nb).ratio()


def _find_similar_pairs(
    fb_names: list[str],
    ga_names: list[str],
    max_pairs: int = MAX_SIMILAR_PAIRS,
    threshold: float = 0.5,
) -> list[tuple[str, str]]:
    """找出最多 max_pairs 對相似名稱（threshold 以上）。"""
    pairs: list[tuple[float, str, str]] = []
    for fa in fb_names:
        for go in ga_names:
            score = _similarity(fa, go)
            if score >= threshold:
                pairs.append((score, fa, go))
    pairs.sort(key=lambda x: -x[0])
    seen_ga = set()
    result = []
    for _, fa, go in pairs:
        if go in seen_ga:
            continue
        seen_ga.add(go)
        result.append((fa, go))
        if len(result) >= max_pairs:
            break
    return result


async def _write_via_mcp(content: str, file_path: str = MCP_OUTPUT_FILE) -> str:
    """透過本地 MCP 寫檔，回傳寫入結果或錯誤訊息。"""
    try:
        from semantic_kernel import Kernel
        from semantic_kernel.connectors.mcp import MCPSsePlugin
        from semantic_kernel.functions.kernel_arguments import KernelArguments
    except ImportError:
        return "[錯誤] 需要 semantic-kernel[mcp]，無法寫入 MCP。"
    base = os.environ.get("MCP_URL", "http://localhost:8000").rstrip("/")
    url = f"{base}/sse" if "/sse" not in base else base
    async with MCPSsePlugin(
        name="file_writer",
        description="寫檔",
        url=url,
    ) as mcp_plugin:
        kernel = Kernel()
        write_fn = mcp_plugin["write_file"]
        result = await kernel.invoke(
            write_fn,
            KernelArguments(file_path=file_path, content=content),
        )
        out = str(result.get_inner_content() if hasattr(result, "get_inner_content") else result)
        return out or "已寫入。"


async def _run_with_agents(chat_svc) -> tuple[list[str], list[str]]:
    """使用 ChatCompletionAgent + GroupChatOrchestration 取得兩邊 campaign 名稱。"""
    from semantic_kernel.agents import (
        Agent,
        ChatCompletionAgent,
        GroupChatOrchestration,
        RoundRobinGroupChatManager,
    )
    from semantic_kernel.agents.runtime import InProcessRuntime
    from semantic_kernel.contents import ChatMessageContent

    from facebook_plugin import FacebookPlugin
    from google_ads_plugin import GoogleAdsPlugin

    fb_agent = ChatCompletionAgent(
        name="Facebook",
        description="使用 Facebook Graph API 取得廣告 campaign。",
        instructions=(
            "你只能使用 query_graph 工具。請查詢 Facebook 廣告的 campaign 列表"
            "（例如先 /me/adaccounts 取得帳號，再查該帳號的 campaigns，或使用可用的路徑）。"
            "最後只回報 campaign 名稱，每行一個，不要其他說明。"
        ),
        service=chat_svc,
        plugins=[FacebookPlugin()],
    )
    ga_agent = ChatCompletionAgent(
        name="GoogleAds",
        description="使用 Google Ads API 取得廣告 campaign。",
        instructions=(
            "你只能使用 query_ads 工具。請用 GAQL 查詢 campaign 的 id 與 name，"
            "例如：SELECT campaign.id, campaign.name FROM campaign WHERE campaign.status != 'REMOVED' LIMIT 15。"
            "最後只回報 campaign 名稱，每行一個，不要其他說明。"
        ),
        service=chat_svc,
        plugins=[GoogleAdsPlugin()],
    )

    messages: list[tuple[str, str]] = []

    def callback(msg: ChatMessageContent) -> None:
        name = getattr(msg, "name", None) or getattr(msg, "role", "?")
        content = getattr(msg, "content", None) or str(msg)
        messages.append((str(name), str(content)))
        print(f"[{name}]\n{content[:500]}{'...' if len(content) > 500 else ''}\n")

    orchestration = GroupChatOrchestration(
        members=[fb_agent, ga_agent],
        manager=RoundRobinGroupChatManager(max_rounds=4),
        agent_response_callback=callback,
    )
    runtime = InProcessRuntime()
    runtime.start()
    try:
        result = await orchestration.invoke(
            task="請 Facebook 先取得 Facebook 廣告的 campaign 名稱列表（每行一個）。"
                 "接著請 GoogleAds 取得 Google Ads 的 campaign 名稱列表（每行一個）。",
            runtime=runtime,
        )
        await result.get()
    finally:
        await runtime.stop_when_idle()

    fb_names, ga_names = [], []
    for name, content in messages:
        if "facebook" in name.lower():
            fb_names.extend(_extract_campaign_names(content))
        elif "google" in name.lower():
            ga_names.extend(_extract_campaign_names(content))
    return fb_names, ga_names


async def _run_fallback_planner(chat_svc) -> tuple[list[str], list[str]]:
    """無 agents 時：用兩次 planner 分別取得 FB / Google campaign 名稱。"""
    from semantic_kernel import Kernel
    from semantic_kernel.connectors.ai.function_choice_behavior import FunctionChoiceBehavior
    from facebook_plugin import FacebookPlugin
    from google_ads_plugin import GoogleAdsPlugin

    kernel = Kernel()
    kernel.add_service(chat_svc)

    # Facebook
    kernel.add_plugin(FacebookPlugin(), plugin_name="facebook")
    settings = kernel.get_prompt_execution_settings_from_service_id(service_id="default")
    settings.function_choice_behavior = FunctionChoiceBehavior.Auto(
        filters={"included_plugins": ["facebook"]}
    )
    settings.max_tokens = 800
    r1 = await kernel.invoke_prompt(
        function_name="fb_campaigns",
        plugin_name="demo",
        prompt="請用 query_graph 取得 Facebook 廣告 campaign 列表（必要時先查 /me/adaccounts 再查 campaigns）。最後只回報 campaign 名稱，每行一個。",
        settings=settings,
    )
    fb_text = str(r1) if r1 else ""
    fb_names = _extract_campaign_names(fb_text)

    # Google Ads（改用 google_ads plugin）
    kernel.add_plugin(GoogleAdsPlugin(), plugin_name="google_ads")
    settings.function_choice_behavior = FunctionChoiceBehavior.Auto(
        filters={"included_plugins": ["google_ads"]}
    )
    r2 = await kernel.invoke_prompt(
        function_name="ga_campaigns",
        plugin_name="demo",
        prompt="請用 query_ads 查詢 campaign 名稱，GAQL 例如 SELECT campaign.id, campaign.name FROM campaign WHERE campaign.status != 'REMOVED' LIMIT 15。最後只回報 campaign 名稱，每行一個。",
        settings=settings,
    )
    ga_text = str(r2) if r2 else ""
    ga_names = _extract_campaign_names(ga_text)

    return fb_names, ga_names


async def main():
    chat_svc = _chat_service()

    try:
        from semantic_kernel.agents import ChatCompletionAgent, GroupChatOrchestration
        use_agents = True
    except ImportError:
        use_agents = False

    if use_agents:
        print("使用 ChatCompletionAgent + GroupChatOrchestration 取得 campaign…\n")
        fb_names, ga_names = await _run_with_agents(chat_svc)
    else:
        print("使用 planner 取得 campaign（agents 模組不可用）…\n")
        fb_names, ga_names = await _run_fallback_planner(chat_svc)

    print("\n--- 解析結果 ---")
    print("Facebook campaign 數量:", len(fb_names), fb_names[:10])
    print("Google Ads campaign 數量:", len(ga_names), ga_names[:10])

    pairs = _find_similar_pairs(fb_names, ga_names, max_pairs=MAX_SIMILAR_PAIRS)
    lines = [
        "相似 campaign（最多 2 筆）",
        "=" * 40,
        f"Facebook 共 {len(fb_names)} 筆，Google Ads 共 {len(ga_names)} 筆。",
        "",
    ]
    for i, (fa, go) in enumerate(pairs, 1):
        lines.append(f"{i}. Facebook: {fa}")
        lines.append(f"   Google Ads: {go}")
        lines.append("")
    if not pairs:
        lines.append("（未找到名稱相似的 campaign）")
    content = "\n".join(lines)

    print("\n--- 寫入 MCP ---")
    write_result = await _write_via_mcp(content)
    print(write_result)
    print("\n完成。")


if __name__ == "__main__":
    asyncio.run(main())
