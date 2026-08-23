# -*- coding: utf-8 -*-
"""
Google Ads API Plugin（參照 googleapi SKILL）

提供 query_ads：以 GAQL 查詢 Google Ads，流程與 query-ads.js / SKILL.md 一致：
1. 從 .env 讀取 client_id, client_secret, refresh_token, developer_token, login-customer-id（可選 customer-id）
2. 用 refresh_token 取得 access_token
3. 呼叫 googleAds:search 並回傳 results 摘要

.env 可放在專案根目錄或 googleapi/ 目錄。
"""
import json
import os
import urllib.error
import urllib.parse
import urllib.request
from typing import Annotated

from semantic_kernel.functions import kernel_function

TOKEN_URL = "https://www.googleapis.com/oauth2/v3/token"
SEARCH_VERSION = "v21"


def _load_env() -> dict[str, str]:
    """從 googleapi/.env 或專案根 .env 讀取（與 SKILL 同目錄優先），回傳 key=value 字典。"""
    root = os.path.dirname(os.path.abspath(__file__))
    env = {}
    for base in (os.path.join(root, "googleapi"), root):
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


def _get_access_token(env: dict[str, str]) -> str:
    """用 refresh_token 取得 access_token。"""
    body = "&".join([
        "grant_type=refresh_token",
        f"client_id={urllib.parse.quote(env['client_id'], safe='')}",
        f"client_secret={urllib.parse.quote(env['client_secret'], safe='')}",
        f"refresh_token={urllib.parse.quote(env['refresh_token'], safe='')}",
    ])
    req = urllib.request.Request(
        TOKEN_URL,
        data=body.encode("utf-8"),
        method="POST",
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )
    with urllib.request.urlopen(req, timeout=30) as res:
        data = json.loads(res.read().decode())
    token = data.get("access_token")
    if not token:
        raise RuntimeError(f"取得 token 失敗: {data}")
    return token


def _search(env: dict[str, str], access_token: str, customer_id: str, query: str) -> dict:
    """呼叫 googleAds:search，回傳完整 JSON。"""
    url = f"https://googleads.googleapis.com/{SEARCH_VERSION}/customers/{customer_id}/googleAds:search"
    body = json.dumps({"query": query}).encode("utf-8")
    req = urllib.request.Request(
        url,
        data=body,
        method="POST",
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {access_token}",
            "developer-token": env["developer_token"],
            "login-customer-id": env["login-customer-id"],
        },
    )
    with urllib.request.urlopen(req, timeout=60) as res:
        return json.loads(res.read().decode())


class GoogleAdsPlugin:
    """查詢 Google Ads API 的 Plugin，使用 GAQL。需在 .env 設定 OAuth 與 developer 變數。"""

    @kernel_function(
        name="query_ads",
        description="用 GAQL 查詢 Google Ads。傳入 GAQL 查詢字串（例如查 campaign、ad_group、keyword_view 等）；可選傳入 customer_id 覆寫查詢的客戶 ID。若不傳 gaql 則使用預設查詢（campaign 列表）。",
    )
    def query_ads(
        self,
        gaql: Annotated[str, "GAQL 查詢字串，例如: SELECT campaign.id, campaign.name FROM campaign LIMIT 5"] = "",
        customer_id: Annotated[str, "選填。要查詢的 Google Ads 客戶 ID，不傳則用 .env 的 customer-id 或 login-customer-id"] = "",
    ) -> str:
        query = (gaql or "").strip().replace("\n", " ").strip()
        print("query:")
        print(query)
        env = _load_env()
        required = ["client_id", "client_secret", "refresh_token", "developer_token", "login-customer-id"]
        missing = [k for k in required if not env.get(k)]
        if missing:
            return json.dumps({"error": f"缺少 .env 變數: {', '.join(missing)}"}, ensure_ascii=False)

        cid = (customer_id or "").strip() or env.get("customer-id") or env.get("login-customer-id")
        if not cid:
            return json.dumps({"error": "未設定 customer_id 且 .env 無 customer-id / login-customer-id"}, ensure_ascii=False)

        try:
            access_token = _get_access_token(env)
        except urllib.error.HTTPError as e:
            body = e.read().decode() if e.fp else str(e)
            return json.dumps({"error": f"取得 token 失敗 ({e.code}): {body}"}, ensure_ascii=False)
        except Exception as e:
            return json.dumps({"error": f"取得 token 失敗: {e!s}"}, ensure_ascii=False)

        try:
            search_res = _search(env, access_token, cid, query)
        except urllib.error.HTTPError as e:
            body = e.read().decode() if e.fp else str(e)
            return json.dumps({"error": f"查詢失敗 ({e.code}): {body}", "query": query}, ensure_ascii=False)
        except Exception as e:
            return json.dumps({"error": f"查詢失敗: {e!s}", "query": query}, ensure_ascii=False)

        if search_res.get("error"):
            return json.dumps({"error": search_res["error"], "query": query}, ensure_ascii=False)

        results = search_res.get("results") or []
        lines = [f"共 {len(results)} 筆"]
        for i, row in enumerate(results, 1):
            lines.append(f"  [{i}] {json.dumps(row, ensure_ascii=False)}")
        lines.append("\n完整回應:")
        lines.append(json.dumps(search_res, ensure_ascii=False, indent=2))
        print("search_res:")
        print(search_res)
        return "\n".join(lines)
