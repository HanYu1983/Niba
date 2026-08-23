# -*- coding: utf-8 -*-
"""
Facebook Graph API Plugin（參照 facebookapi SKILL）

提供 query_graph：以 Graph 路徑查詢 Facebook Graph API，流程與 query-facebook.js / SKILL.md 一致：
1. 從 .env 讀取 FB_ACCESS_TOKEN（必填）、FB_GRAPH_VERSION（選填，預設 v19.0）
2. GET https://graph.facebook.com/{version}{path}?access_token=...
3. 回傳完整 JSON；若 API 回傳 error 則回傳錯誤內容

.env 可放在專案根目錄或 facebookapi/ 目錄。
"""
import json
import os
import urllib.error
import urllib.parse
import urllib.request
from typing import Annotated

from semantic_kernel.functions import kernel_function

DEFAULT_VERSION = "v19.0"


def _load_env() -> dict[str, str]:
    """從 facebookapi/.env 或專案根 .env 讀取（與 SKILL 同目錄優先）。"""
    root = os.path.dirname(os.path.abspath(__file__))
    env = {}
    for base in (os.path.join(root, "facebookapi"), root):
        path = os.path.join(base, ".env")
        if not os.path.isfile(path):
            continue
        with open(path, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if not line or line.startswith("#"):
                    continue
                idx = line.find("=")
                if idx > 0:
                    env[line[:idx].strip()] = line[idx + 1 :].strip()
        break
    return env


def _graph_get(version: str, path: str, access_token: str) -> dict:
    """GET Graph API，path 可含查詢參數，會自動加上 access_token。"""
    path = path.strip()
    if "?" in path:
        path = f"{path}&access_token={urllib.parse.quote(access_token, safe='')}"
    else:
        path = f"{path}?access_token={urllib.parse.quote(access_token, safe='')}"
    url = f"https://graph.facebook.com/{version}{path}"
    req = urllib.request.Request(url, method="GET")
    with urllib.request.urlopen(req, timeout=30) as res:
        return json.loads(res.read().decode())


class FacebookPlugin:
    """查詢 Facebook Graph API 的 Plugin。需在 .env 設定 FB_ACCESS_TOKEN。"""

    @kernel_function(
        name="query_graph",
        description="呼叫 Facebook Graph API。傳入 Graph 路徑，例如 /me、/me/adaccounts、/{ad_account_id}/campaigns。可帶查詢參數，例如 /me?fields=id,name。不傳則查 /me。",
    )
    def query_graph(
        self,
        path: Annotated[
            str,
            "Graph API 路徑，例如 /me、/me/adaccounts、/123456/campaigns；可含查詢參數如 ?fields=id,name",
        ] = "/me",
    ) -> str:
        print("path:")
        print(path)
        env = _load_env()
        access_token = env.get("FB_ACCESS_TOKEN", "").strip()
        if not access_token:
            return json.dumps(
                {"error": "缺少 .env 變數: FB_ACCESS_TOKEN"},
                ensure_ascii=False,
            )
        version = (env.get("FB_GRAPH_VERSION") or DEFAULT_VERSION).strip() or DEFAULT_VERSION
        path = (path or "").strip() or "/me"

        try:
            res = _graph_get(version, path, access_token)
        except urllib.error.HTTPError as e:
            body = e.read().decode() if e.fp else str(e)
            return json.dumps(
                {"error": f"請求失敗 ({e.code}): {body}", "path": path},
                ensure_ascii=False,
            )
        except Exception as e:
            return json.dumps(
                {"error": str(e), "path": path},
                ensure_ascii=False,
            )

        if isinstance(res, dict) and res.get("error"):
            return json.dumps(
                {"error": res["error"], "path": path},
                ensure_ascii=False,
                indent=2,
            )
        ret = json.dumps(res, ensure_ascii=False, indent=2)
        print("ret:")
        print(ret)
        return ret
