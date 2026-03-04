#!/usr/bin/env python3
"""Fetch Google Ads cost data and update the Ricoh weekly report spreadsheet.

Reads the "ブランド施策2025下期" spreadsheet, finds current-month campaigns,
fetches cost data from Google Ads API for each campaign (from billing start
date to yesterday), and updates:
  - J列 (媒体費実績) with actual cost from Google Ads
  - O列 (設定金額) when P列 (差分) >= ¥1,000, setting O = round(N, ¥1,000)
  - Q列 (設定ログ) with change log entries
  - Google Ads daily budgets to match O列

Also checks alerts:
  - F列 end date within 3 days
  - I列/G列 budget consumption >= 90% (active campaigns only)
  - Campaigns stopped in Google Ads before F列 end date

Outputs a JSON summary to --output for Slack notification.

Usage:
    python3 fetch_and_update.py [--env PATH] [--dry-run] [--output PATH]

Options:
    --env PATH     Path to .env file (default: ~/.ricoh-monitoring.env)
    --dry-run      Show what would be updated without writing
    --output PATH  Output JSON summary for Slack (default: ricoh_report.json)

Requires: requests google-auth google-api-python-client
"""

import argparse
import json
import math
import sys
import unicodedata
from datetime import datetime, timedelta
from pathlib import Path

try:
    import requests
except ImportError:
    print("Error: pip install requests", file=sys.stderr)
    sys.exit(1)

try:
    from google.oauth2.credentials import Credentials
    from googleapiclient.discovery import build
except ImportError:
    print("Error: pip install google-auth google-api-python-client", file=sys.stderr)
    sys.exit(1)


# ── Spreadsheet constants ────────────────────────────────────────────
SPREADSHEET_ID = "1emn80SU8AqQb1kXQldKZSLOKbSqFT3CUf5TiY8th6jc"
SHEET_NAME = "ブランド施策2025下期"
DATA_START_ROW = 4       # first possible data row (1-indexed)
DATA_END_ROW = 200       # read generously; sparse rows are fine
COL_A = 0   # 月
COL_B = 1   # 案件名
COL_C = 2   # キャンペーン名
COL_E = 4   # 請求開始日
COL_F = 5   # 請求終了日
COL_J = 9   # 媒体費(実績)
COL_M = 12  # 残り日数
COL_N = 13  # 理想日予算
COL_O = 14  # 設定金額
COL_P = 15  # 差分
COL_G = 6   # 金額(予算/G)
COL_I = 8   # 金額(実績/G)
COL_Q = 16  # 設定ログ

# Budget diff threshold (yen) — triggers O column update
BUDGET_DIFF_THRESHOLD = 1000

# Google Ads budget change safety limit (yen)
# Changes >= this amount require manual confirmation (--force to override)
BUDGET_CHANGE_SAFETY_LIMIT = 5000

# ── Google Ads constants ──────────────────────────────────────────────
GOOGLE_ADS_API_VERSION = "v23"


def load_env(path: str) -> dict:
    """Load key=value pairs from an env file."""
    env = {}
    p = Path(path).expanduser()
    if not p.exists():
        print(f"Error: env file not found: {p}", file=sys.stderr)
        sys.exit(1)
    for line in p.read_text().splitlines():
        line = line.strip()
        if line and not line.startswith("#") and "=" in line:
            k, v = line.split("=", 1)
            env[k.strip()] = v.strip()
    return env


# ── Google Sheets helpers ─────────────────────────────────────────────

def get_sheets_service(env: dict):
    creds = Credentials(
        token=None,
        refresh_token=env["GOOGLE_SHEETS_REFRESH_TOKEN"],
        client_id=env["GOOGLE_SHEETS_CLIENT_ID"],
        client_secret=env["GOOGLE_SHEETS_CLIENT_SECRET"],
        token_uri="https://oauth2.googleapis.com/token",
    )
    return build("sheets", "v4", credentials=creds)


def read_sheet_rows(service, start_row: int, end_row: int) -> list[list[str]]:
    """Read rows from spreadsheet (A:Q) and return as list of lists."""
    rng = f"'{SHEET_NAME}'!A{start_row}:Q{end_row}"
    result = service.spreadsheets().values().get(
        spreadsheetId=SPREADSHEET_ID, range=rng
    ).execute()
    return result.get("values", [])


def parse_yen(s: str) -> float:
    """Parse ¥-formatted string to float. Returns 0 on failure."""
    s = str(s).replace("¥", "").replace(",", "").replace(" ", "").strip()
    if not s or s == "-":
        return 0.0
    try:
        return float(s)
    except ValueError:
        return 0.0


def parse_date(s: str) -> str | None:
    """Parse a date string (yyyy/m/d or yyyy-mm-dd etc.) to YYYY-MM-DD."""
    s = str(s).strip()
    if not s:
        return None
    for fmt in ("%Y/%m/%d", "%Y-%m-%d", "%Y/%m/%d %H:%M:%S"):
        try:
            return datetime.strptime(s, fmt).strftime("%Y-%m-%d")
        except ValueError:
            continue
    return None


def current_month_label() -> str:
    """Return the Japanese month label for the current month, e.g. '2月'."""
    return f"{datetime.now().month}月"


def find_current_month_rows(rows: list[list[str]], base_row: int) -> list[dict]:
    """Find rows that belong to the current month section.

    Returns list of dicts with row metadata (1-indexed row number, campaign
    name, billing start/end, etc.).
    """
    month_label = current_month_label()
    campaigns = []
    in_section = False

    for i, row in enumerate(rows):
        # Pad to at least Q columns
        while len(row) < 17:
            row.append("")

        row_num = base_row + i
        a_val = row[COL_A].strip()

        # Detect month section start
        if a_val == month_label:
            # Check if this is the header row (B = "案件名")
            if row[COL_B].strip() == "案件名":
                in_section = True
                continue
            # Could also be a data row with month in A
            in_section = True

        # Detect section end: another month header or empty section
        if in_section and a_val and a_val != month_label and a_val.endswith("月"):
            break

        if not in_section:
            continue

        campaign_name = row[COL_C].strip()
        if not campaign_name or campaign_name == "キャンペーン名":
            continue

        start_date = parse_date(row[COL_E])
        end_date = parse_date(row[COL_F])
        g_budget = parse_yen(row[COL_G])
        i_actual = parse_yen(row[COL_I])
        j_value = parse_yen(row[COL_J])
        remaining_days = parse_yen(row[COL_M])
        n_value = parse_yen(row[COL_N])
        o_value = parse_yen(row[COL_O])
        p_value = parse_yen(row[COL_P])
        q_log = row[COL_Q]
        anken_name = row[COL_B].strip()

        campaigns.append({
            "row": row_num,
            "anken_name": anken_name,
            "campaign_name": campaign_name,
            "start_date": start_date,
            "end_date": end_date,
            "g_budget": g_budget,
            "i_actual": i_actual,
            "j_value": j_value,
            "remaining_days": remaining_days,
            "n_value": n_value,
            "o_value": o_value,
            "p_value": p_value,
            "q_log": q_log,
        })

    return campaigns


# ── Google Ads helpers ────────────────────────────────────────────────

def get_ads_access_token(env: dict) -> str:
    resp = requests.post("https://oauth2.googleapis.com/token", data={
        "client_id": env["GOOGLE_ADS_CLIENT_ID"],
        "client_secret": env["GOOGLE_ADS_CLIENT_SECRET"],
        "refresh_token": env["GOOGLE_ADS_REFRESH_TOKEN"],
        "grant_type": "refresh_token",
    })
    if resp.status_code != 200:
        print(f"Error getting access token: {resp.text}", file=sys.stderr)
        sys.exit(1)
    return resp.json()["access_token"]


def fetch_campaign_costs(env: dict, access_token: str,
                         campaigns: list[dict]) -> dict[str, float]:
    """Fetch cost for each campaign from Google Ads API.

    Groups campaigns by start_date to minimise API calls, then returns
    a dict mapping NFC-normalised campaign_name -> total cost (yen).
    """
    customer_id = env["GOOGLE_ADS_CUSTOMER_ID"].replace("-", "")
    yesterday = (datetime.now() - timedelta(days=1)).strftime("%Y-%m-%d")

    # Group by start_date
    date_groups: dict[str, list[str]] = {}
    for c in campaigns:
        sd = c["start_date"]
        if not sd:
            continue
        date_groups.setdefault(sd, []).append(c["campaign_name"])

    costs: dict[str, float] = {}

    for start_date, names in date_groups.items():
        # If start_date is after yesterday, skip (campaign hasn't started)
        if start_date > yesterday:
            for n in names:
                costs[unicodedata.normalize("NFC", n)] = 0.0
            continue

        query = f"""
            SELECT
                campaign.name,
                metrics.cost_micros
            FROM campaign
            WHERE segments.date BETWEEN '{start_date}' AND '{yesterday}'
        """

        url = (f"https://googleads.googleapis.com/{GOOGLE_ADS_API_VERSION}"
               f"/customers/{customer_id}/googleAds:searchStream")
        headers = {
            "Authorization": f"Bearer {access_token}",
            "developer-token": env["GOOGLE_ADS_DEVELOPER_TOKEN"],
            "Content-Type": "application/json",
        }

        resp = requests.post(url, headers=headers, json={"query": query})
        if resp.status_code != 200:
            print(f"Error fetching ads data ({start_date}~{yesterday}): "
                  f"{resp.status_code}", file=sys.stderr)
            print(resp.text[:500], file=sys.stderr)
            continue

        # Accumulate costs per campaign name
        batch_costs: dict[str, float] = {}
        for batch in resp.json():
            for row in batch.get("results", []):
                name = unicodedata.normalize(
                    "NFC", row.get("campaign", {}).get("name", ""))
                cost = int(row.get("metrics", {}).get("costMicros", 0)) / 1_000_000
                batch_costs[name] = batch_costs.get(name, 0) + cost

        # Map to target campaigns
        target_norm = {unicodedata.normalize("NFC", n): n for n in names}
        for norm_name in target_norm:
            if norm_name in batch_costs:
                costs[norm_name] = round(batch_costs[norm_name], 0)

    return costs


def fetch_campaign_budgets(env: dict, access_token: str) -> dict[str, dict]:
    """Fetch current daily budgets for all enabled campaigns.

    Returns dict mapping NFC-normalised campaign_name -> {
        "budget_yen": float,
        "budget_resource": str,
        "campaign_id": str,
    }
    """
    customer_id = env["GOOGLE_ADS_CUSTOMER_ID"].replace("-", "")

    query = """
        SELECT
            campaign.id,
            campaign.name,
            campaign_budget.amount_micros,
            campaign_budget.resource_name
        FROM campaign
        WHERE campaign.status = 'ENABLED'
    """

    url = (f"https://googleads.googleapis.com/{GOOGLE_ADS_API_VERSION}"
           f"/customers/{customer_id}/googleAds:searchStream")
    headers = {
        "Authorization": f"Bearer {access_token}",
        "developer-token": env["GOOGLE_ADS_DEVELOPER_TOKEN"],
        "Content-Type": "application/json",
    }

    resp = requests.post(url, headers=headers, json={"query": query})
    if resp.status_code != 200:
        print(f"Error fetching budgets: {resp.status_code}", file=sys.stderr)
        print(resp.text[:500], file=sys.stderr)
        return {}

    result = {}
    for batch in resp.json():
        for row in batch.get("results", []):
            campaign = row.get("campaign", {})
            budget_info = row.get("campaignBudget", {})
            name = unicodedata.normalize("NFC", campaign.get("name", ""))
            result[name] = {
                "budget_yen": int(budget_info.get("amountMicros", 0)) / 1_000_000,
                "budget_resource": budget_info.get("resourceName", ""),
                "campaign_id": campaign.get("id", ""),
            }
    return result


def update_google_ads_budget(env: dict, access_token: str,
                             budget_resource: str,
                             new_budget_yen: int) -> bool:
    """Update a single campaign budget via Google Ads API."""
    customer_id = env["GOOGLE_ADS_CUSTOMER_ID"].replace("-", "")
    url = (f"https://googleads.googleapis.com/{GOOGLE_ADS_API_VERSION}"
           f"/customers/{customer_id}/campaignBudgets:mutate")
    headers = {
        "Authorization": f"Bearer {access_token}",
        "developer-token": env["GOOGLE_ADS_DEVELOPER_TOKEN"],
        "Content-Type": "application/json",
    }
    body = {
        "operations": [{
            "update": {
                "resourceName": budget_resource,
                "amountMicros": str(new_budget_yen * 1_000_000),
            },
            "updateMask": "amount_micros",
        }]
    }
    resp = requests.post(url, headers=headers, json=body)
    if resp.status_code != 200:
        print(f"  Error updating budget: {resp.status_code} {resp.text[:300]}",
              file=sys.stderr)
        return False
    return True


def fetch_campaign_statuses(env: dict, access_token: str) -> dict[str, str]:
    """Fetch status for all campaigns (ENABLED, PAUSED, REMOVED, etc.).

    Returns dict mapping NFC-normalised campaign_name -> status string.
    """
    customer_id = env["GOOGLE_ADS_CUSTOMER_ID"].replace("-", "")

    query = """
        SELECT campaign.name, campaign.status
        FROM campaign
    """

    url = (f"https://googleads.googleapis.com/{GOOGLE_ADS_API_VERSION}"
           f"/customers/{customer_id}/googleAds:searchStream")
    headers = {
        "Authorization": f"Bearer {access_token}",
        "developer-token": env["GOOGLE_ADS_DEVELOPER_TOKEN"],
        "Content-Type": "application/json",
    }

    resp = requests.post(url, headers=headers, json={"query": query})
    if resp.status_code != 200:
        print(f"Error fetching statuses: {resp.status_code}", file=sys.stderr)
        return {}

    result = {}
    for batch in resp.json():
        for row in batch.get("results", []):
            name = unicodedata.normalize("NFC", row["campaign"]["name"])
            result[name] = row["campaign"]["status"]
    return result


def check_alerts(campaigns: list[dict], ads_statuses: dict[str, str]) -> dict:
    """Check alert conditions and return structured alert data.

    Returns dict with keys: end_date_soon, budget_high, stopped_early, still_running
    """
    today = datetime.now().date()
    alerts = {"end_date_soon": [], "budget_high": [], "stopped_early": [], "still_running": []}

    for c in campaigns:
        # Parse end_date to date object
        end_dt = None
        if c["end_date"]:
            try:
                end_dt = datetime.strptime(c["end_date"], "%Y-%m-%d").date()
            except ValueError:
                pass

        # Alert 1: F列 end date within 3 days
        if end_dt and end_dt >= today:
            days_left = (end_dt - today).days
            if days_left <= 3:
                alerts["end_date_soon"].append({
                    "campaign": c["campaign_name"],
                    "anken": c["anken_name"],
                    "end_date": c["end_date"],
                    "days_left": days_left,
                })

        # Alert 2: I/G >= 90% (only active campaigns, not ended)
        if c["g_budget"] > 0 and c["i_actual"] > 0 and c["remaining_days"] > 0:
            ratio = c["i_actual"] / c["g_budget"]
            if ratio >= 0.90:
                alerts["budget_high"].append({
                    "campaign": c["campaign_name"],
                    "anken": c["anken_name"],
                    "g_budget": c["g_budget"],
                    "i_actual": c["i_actual"],
                    "ratio": ratio,
                })

        # Alert 3: Before end_date but Google Ads stopped
        if end_dt and end_dt > today:
            name_norm = unicodedata.normalize("NFC", c["campaign_name"])
            status = ads_statuses.get(name_norm, "UNKNOWN")
            if status not in ("ENABLED",):
                alerts["stopped_early"].append({
                    "campaign": c["campaign_name"],
                    "anken": c["anken_name"],
                    "end_date": c["end_date"],
                    "status": status,
                })

        # Alert 4: Past end_date but Google Ads still running
        if end_dt and end_dt < today:
            name_norm = unicodedata.normalize("NFC", c["campaign_name"])
            status = ads_statuses.get(name_norm, "UNKNOWN")
            if status == "ENABLED":
                alerts["still_running"].append({
                    "campaign": c["campaign_name"],
                    "anken": c["anken_name"],
                    "end_date": c["end_date"],
                    "days_over": (today - end_dt).days,
                })

    return alerts


def shorten_campaign_name(name: str) -> str:
    """Shorten campaign name for display (remove common prefix)."""
    # Remove "Ricoh_Hitokuse_2025年XQ_ブランド施策_" prefix
    prefix = "Ricoh_Hitokuse_"
    if name.startswith(prefix):
        name = name[len(prefix):]
    # Remove year/quarter
    for q in ("2025年3Q_ブランド施策_", "2025年4Q_ブランド施策_"):
        if name.startswith(q):
            name = name[len(q):]
            break
    return name


# ── Main ──────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(
        description="Fetch Google Ads costs and update Ricoh monitoring report")
    parser.add_argument(
        "--env", default="~/.ricoh-monitoring.env",
        help="Path to .env file (default: ~/.ricoh-monitoring.env)")
    parser.add_argument(
        "--dry-run", action="store_true",
        help="Show changes without writing to spreadsheet or Google Ads")
    parser.add_argument(
        "--output", default="ricoh_report.json",
        help="Output JSON summary for Slack notification (default: ricoh_report.json)")
    parser.add_argument(
        "--force", action="store_true",
        help="Allow budget changes >= ¥5,000 without manual confirmation")
    args = parser.parse_args()

    env = load_env(args.env)

    # Validate required keys
    required_ads = ["GOOGLE_ADS_CUSTOMER_ID", "GOOGLE_ADS_DEVELOPER_TOKEN",
                    "GOOGLE_ADS_CLIENT_ID", "GOOGLE_ADS_CLIENT_SECRET",
                    "GOOGLE_ADS_REFRESH_TOKEN"]
    required_sheets = ["GOOGLE_SHEETS_CLIENT_ID", "GOOGLE_SHEETS_CLIENT_SECRET",
                       "GOOGLE_SHEETS_REFRESH_TOKEN"]
    for key in required_ads + required_sheets:
        if key not in env:
            print(f"Error: {key} not found in env file", file=sys.stderr)
            sys.exit(1)

    today_str = datetime.now().strftime("%m/%d").lstrip("0").replace("/0", "/")
    # e.g. "2/17"
    # Adjust format: m/d without leading zeros
    parts = datetime.now().strftime("%m/%d").split("/")
    today_str = f"{int(parts[0])}/{int(parts[1])}"

    print(f"=== リコー ブランド施策 運用モニタリング ({datetime.now().strftime('%Y-%m-%d')}) ===\n")

    # ── Step 1: Read spreadsheet ──────────────────────────────────────
    print("[1/6] Reading spreadsheet...")
    sheets_service = get_sheets_service(env)
    rows = read_sheet_rows(sheets_service, DATA_START_ROW, DATA_END_ROW)
    campaigns = find_current_month_rows(rows, DATA_START_ROW)
    print(f"  Found {len(campaigns)} campaigns for {current_month_label()}")
    for c in campaigns:
        print(f"    Row {c['row']}: {c['campaign_name']}")

    if not campaigns:
        print("No campaigns found for the current month.", file=sys.stderr)
        sys.exit(0)

    # ── Step 2: Fetch Google Ads costs ────────────────────────────────
    print(f"\n[2/6] Fetching Google Ads cost data...")
    access_token = get_ads_access_token(env)
    costs = fetch_campaign_costs(env, access_token, campaigns)

    # ── Step 3: Update J column (媒体費実績) ──────────────────────────
    print(f"\n[3/6] Updating J列 (媒体費実績)...")
    # Keep a copy for summary before re-reading
    campaigns_snapshot = list(campaigns)
    j_updates = []
    for c in campaigns:
        name_norm = unicodedata.normalize("NFC", c["campaign_name"])
        new_cost = costs.get(name_norm)
        if new_cost is not None:
            old_val = c["j_value"]
            if abs(new_cost - old_val) >= 1:
                j_updates.append({
                    "range": f"'{SHEET_NAME}'!J{c['row']}",
                    "values": [[new_cost]],
                })
                print(f"  Row {c['row']}: ¥{old_val:,.0f} → ¥{new_cost:,.0f}  "
                      f"({c['campaign_name'][:40]}...)")
            else:
                print(f"  Row {c['row']}: ¥{old_val:,.0f} (unchanged)")

    if j_updates:
        if args.dry_run:
            print(f"  [DRY-RUN] Would update {len(j_updates)} cells in J列")
        else:
            body = {"valueInputOption": "USER_ENTERED", "data": j_updates}
            result = sheets_service.spreadsheets().values().batchUpdate(
                spreadsheetId=SPREADSHEET_ID, body=body
            ).execute()
            print(f"  Updated {result.get('totalUpdatedCells', 0)} cells in J列")
    else:
        print("  No J列 updates needed")

    # Re-read to get recalculated P values after J update
    if j_updates and not args.dry_run:
        import time
        time.sleep(2)  # Wait for formulas to recalculate
        rows = read_sheet_rows(sheets_service, DATA_START_ROW, DATA_END_ROW)
        campaigns = find_current_month_rows(rows, DATA_START_ROW)

    # ── Step 4: Check P列 diff and update O列/Q列 ────────────────────
    print(f"\n[4/6] Checking P列 (差分) for threshold ≥ ¥{BUDGET_DIFF_THRESHOLD:,}...")
    oq_updates = []
    budget_changes = []  # For Google Ads budget updates

    # Fetch current Google Ads budgets
    ads_budgets = fetch_campaign_budgets(env, access_token)

    for c in campaigns:
        # Only check active campaigns (remaining_days > 0)
        if c["remaining_days"] <= 0:
            continue

        p_abs = abs(c["p_value"])
        if p_abs >= BUDGET_DIFF_THRESHOLD:
            n_value = c["n_value"]
            old_o = c["o_value"]
            new_o = round(n_value / 1000) * 1000  # Round to nearest ¥1,000

            print(f"  Row {c['row']}: P=¥{c['p_value']:,.0f} → "
                  f"O: ¥{old_o:,.0f} → ¥{new_o:,.0f}")

            # Update O column
            oq_updates.append({
                "range": f"'{SHEET_NAME}'!O{c['row']}",
                "values": [[new_o]],
            })

            # Update Q column (append log)
            old_q = c["q_log"]
            new_log = f"{today_str} 日予算：¥{old_o:,.0f}→¥{new_o:,.0f}"
            new_q = f"{old_q}\n{new_log}" if old_q else new_log
            oq_updates.append({
                "range": f"'{SHEET_NAME}'!Q{c['row']}",
                "values": [[new_q]],
            })

            # Track Google Ads budget change
            name_norm = unicodedata.normalize("NFC", c["campaign_name"])
            if name_norm in ads_budgets:
                budget_info = ads_budgets[name_norm]
                if abs(budget_info["budget_yen"] - new_o) >= 1:
                    budget_changes.append({
                        "name": c["campaign_name"],
                        "budget_resource": budget_info["budget_resource"],
                        "old_budget": budget_info["budget_yen"],
                        "new_budget": int(new_o),
                    })

    if oq_updates:
        if args.dry_run:
            print(f"  [DRY-RUN] Would update {len(oq_updates)} cells in O/Q列")
        else:
            body = {"valueInputOption": "USER_ENTERED", "data": oq_updates}
            result = sheets_service.spreadsheets().values().batchUpdate(
                spreadsheetId=SPREADSHEET_ID, body=body
            ).execute()
            print(f"  Updated {result.get('totalUpdatedCells', 0)} cells in O/Q列")
    else:
        print("  No O/Q列 updates needed (all P列 diffs < threshold)")

    # ── Step 5: Update Google Ads daily budgets ───────────────────────
    if budget_changes:
        print(f"\n[5/6] Updating Google Ads daily budgets...")
        skipped_large = []
        for bc in budget_changes:
            change_amount = abs(bc["new_budget"] - bc["old_budget"])
            print(f"  {bc['name'][:50]}...")
            print(f"    ¥{bc['old_budget']:,.0f} → ¥{bc['new_budget']:,} "
                  f"(変更額: ¥{change_amount:,})")
            if args.dry_run:
                print("    [DRY-RUN] Skipped")
            elif change_amount >= BUDGET_CHANGE_SAFETY_LIMIT and not args.force:
                print(f"    ⚠️  SKIPPED: 変更額が¥{BUDGET_CHANGE_SAFETY_LIMIT:,}以上"
                      f"のため手動確認が必要 (--force で強制実行)")
                skipped_large.append(bc)
            else:
                ok = update_google_ads_budget(
                    env, access_token,
                    bc["budget_resource"], bc["new_budget"])
                print(f"    {'✅ Updated' if ok else '❌ Failed'}")
        if skipped_large:
            print(f"\n  ⚠️  {len(skipped_large)}件のキャンペーンは変更額が"
                  f"¥{BUDGET_CHANGE_SAFETY_LIMIT:,}以上のためスキップされました。")
            print(f"  手動で確認後、--force オプションを付けて再実行してください。")
    else:
        print(f"\n[5/6] No Google Ads budget updates needed")

    # ── Step 6: Check alerts ──────────────────────────────────────────
    print(f"\n[6/6] Checking alerts...")
    ads_statuses = fetch_campaign_statuses(env, access_token)
    # Re-read latest data after updates
    if not args.dry_run and (j_updates or oq_updates):
        import time as _time2
        _time2.sleep(2)
        rows = read_sheet_rows(sheets_service, DATA_START_ROW, DATA_END_ROW)
        campaigns = find_current_month_rows(rows, DATA_START_ROW)

    alerts = check_alerts(campaigns, ads_statuses)

    print(f"  請求終了日3日以内: {len(alerts['end_date_soon'])} 件")
    for a in alerts["end_date_soon"]:
        print(f"    {shorten_campaign_name(a['campaign'])} → {a['end_date']} (残り{a['days_left']}日)")

    print(f"  予算消化率90%以上: {len(alerts['budget_high'])} 件")
    for a in alerts["budget_high"]:
        print(f"    {shorten_campaign_name(a['campaign'])} → {a['ratio']:.1%}")

    print(f"  終了日前に停止: {len(alerts['stopped_early'])} 件")
    for a in alerts["stopped_early"]:
        print(f"    {shorten_campaign_name(a['campaign'])} → {a['status']} (終了日: {a['end_date']})")

    print(f"  終了日超過で配信中: {len(alerts['still_running'])} 件")
    for a in alerts["still_running"]:
        print(f"    {shorten_campaign_name(a['campaign'])} → 終了日: {a['end_date']} ({a['days_over']}日超過)")

    # ── Build summary JSON for Slack ──────────────────────────────────
    summary = {
        "date": datetime.now().strftime("%Y/%m/%d"),
        "month": current_month_label(),
        "spreadsheet_url": f"https://docs.google.com/spreadsheets/d/{SPREADSHEET_ID}",
        "j_updates": [
            {
                "campaign": c["campaign_name"],
                "short_name": shorten_campaign_name(c["campaign_name"]),
                "old": c["j_value"],
                "new": costs.get(unicodedata.normalize("NFC", c["campaign_name"]), 0),
            }
            for c in campaigns_snapshot
            if abs(costs.get(unicodedata.normalize("NFC", c["campaign_name"]), 0) - c["j_value"]) >= 1
               and costs.get(unicodedata.normalize("NFC", c["campaign_name"])) is not None
        ],
        "budget_changes": [
            {
                "campaign": bc["name"],
                "short_name": shorten_campaign_name(bc["name"]),
                "old": bc["old_budget"],
                "new": bc["new_budget"],
            }
            for bc in budget_changes
        ],
        "alerts": alerts,
        "dry_run": args.dry_run,
    }

    output_path = Path(args.output)
    with open(output_path, "w") as f:
        json.dump(summary, f, ensure_ascii=False, indent=2)
    print(f"\nSummary saved to: {output_path}")

    print(f"\n=== Done ===")
    print(f"  Spreadsheet: https://docs.google.com/spreadsheets/d/{SPREADSHEET_ID}")


if __name__ == "__main__":
    main()
