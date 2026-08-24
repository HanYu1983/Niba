#!/usr/bin/env python3
"""Post the Ricoh monitoring report summary to Slack.

Reads the JSON summary produced by fetch_and_update.py and posts a
formatted message to the specified Slack channel using the Bot Token API.

Usage:
    python3 post_to_slack.py --input ricoh_report.json
    python3 post_to_slack.py --input ricoh_report.json --channel C0AF6K6C5RP

Requires: requests
"""

import argparse
import json
import sys
from pathlib import Path

try:
    import requests
except ImportError:
    print("Error: pip install requests", file=sys.stderr)
    sys.exit(1)

DEFAULT_CHANNEL = "C0AF6K6C5RP"  # #claude_test


def load_env(path: str) -> dict:
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


def format_yen(v) -> str:
    """Format a number as ¥N,NNN."""
    try:
        return f"¥{int(float(v)):,}"
    except (ValueError, TypeError):
        return str(v)


def build_message(summary: dict) -> str:
    """Build a Slack mrkdwn message from the JSON summary."""
    date = summary.get("date", "")
    url = summary.get("spreadsheet_url", "")
    j_updates = summary.get("j_updates", [])
    budget_changes = summary.get("budget_changes", [])
    alerts = summary.get("alerts", {})
    dry_run = summary.get("dry_run", False)

    lines = []
    prefix = "[DRY-RUN] " if dry_run else ""
    lines.append(f"*📊 {prefix}リコー ブランド施策 運用モニタリング ({date})*")
    lines.append("")
    lines.append("---")
    lines.append("")
    lines.append("*【更新結果】*")
    lines.append("")

    # J列 updates
    lines.append("*J列（媒体費実績）更新:*")
    if j_updates:
        for j in j_updates:
            lines.append(f"• {j['short_name']}: {format_yen(j['old'])} → {format_yen(j['new'])}")
    else:
        lines.append("変更なし")
    lines.append("")

    # Budget changes
    lines.append("*O列（設定金額）/ 日予算変更:*")
    if budget_changes:
        for bc in budget_changes:
            lines.append(f"• {bc['short_name']}: {format_yen(bc['old'])} → *{format_yen(bc['new'])}*")
        lines.append("→ Google広告の日予算にも反映済み ✅")
    else:
        lines.append("変更なし")
    lines.append("")
    lines.append("---")
    lines.append("")

    # Alerts
    lines.append("*【⚠️ アラート】*")
    lines.append("")

    # Alert 1: End date soon
    end_soon = alerts.get("end_date_soon", [])
    lines.append("*1. 請求終了日が3日以内に迫っているもの:*")
    if end_soon:
        for a in end_soon:
            short = a.get("campaign", "")
            # Try to shorten
            for prefix_str in ("Ricoh_Hitokuse_2025年4Q_ブランド施策_",
                               "Ricoh_Hitokuse_2025年3Q_ブランド施策_"):
                if short.startswith(prefix_str):
                    short = short[len(prefix_str):]
                    break
            lines.append(f"• {short} → 終了日: {a['end_date']} (残り{a['days_left']}日)")
    else:
        lines.append("該当なし ✅")
    lines.append("")

    # Alert 2: Budget high
    budget_high = alerts.get("budget_high", [])
    lines.append("*2. 予算消化率 90%以上（配信中のもの）:*")
    if budget_high:
        for a in budget_high:
            short = a.get("campaign", "")
            for prefix_str in ("Ricoh_Hitokuse_2025年4Q_ブランド施策_",
                               "Ricoh_Hitokuse_2025年3Q_ブランド施策_"):
                if short.startswith(prefix_str):
                    short = short[len(prefix_str):]
                    break
            ratio = a.get("ratio", 0)
            lines.append(f"• {short}: {format_yen(a['i_actual'])} / {format_yen(a['g_budget'])} (*{ratio:.1%}*)")
    else:
        lines.append("該当なし ✅")
    lines.append("")

    # Alert 3: Stopped early
    stopped = alerts.get("stopped_early", [])
    lines.append("*3. 請求終了日前にGoogle広告が停止しているもの:*")
    if stopped:
        for a in stopped:
            short = a.get("campaign", "")
            for prefix_str in ("Ricoh_Hitokuse_2025年4Q_ブランド施策_",
                               "Ricoh_Hitokuse_2025年3Q_ブランド施策_"):
                if short.startswith(prefix_str):
                    short = short[len(prefix_str):]
                    break
            lines.append(f"• {short} → {a['status']} (終了日: {a['end_date']})")
    else:
        lines.append("該当なし ✅")
    lines.append("")

    # Alert 4: Still running past end date
    still_running = alerts.get("still_running", [])
    lines.append("*4. 請求終了日を過ぎているが広告が配信中のもの:*")
    if still_running:
        for a in still_running:
            short = a.get("campaign", "")
            for prefix_str in ("Ricoh_Hitokuse_2025年4Q_ブランド施策_",
                               "Ricoh_Hitokuse_2025年3Q_ブランド施策_"):
                if short.startswith(prefix_str):
                    short = short[len(prefix_str):]
                    break
            lines.append(f"• {short} → 終了日: {a['end_date']} ({a['days_over']}日超過)")
    else:
        lines.append("該当なし ✅")
    lines.append("")
    lines.append("---")
    lines.append(f"<{url}|📎 スプレッドシートを開く>")

    return "\n".join(lines)


def post_to_slack(message: str, channel: str, env: dict) -> None:
    """Post a text message to Slack using Bot Token API."""
    token = env.get("SLACK_BOT_TOKEN")
    if not token:
        print("Error: SLACK_BOT_TOKEN not found in env file", file=sys.stderr)
        sys.exit(1)

    resp = requests.post(
        "https://slack.com/api/chat.postMessage",
        headers={
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
        },
        json={
            "channel": channel,
            "text": message,
        },
    )
    data = resp.json()
    if data.get("ok"):
        print(f"✅ Posted to Slack (channel: {channel})")
        print(f"   ts: {data.get('ts', '')}")
    else:
        print(f"❌ Slack error: {data.get('error')}", file=sys.stderr)
        sys.exit(1)


def main():
    parser = argparse.ArgumentParser(
        description="Post Ricoh monitoring report to Slack")
    parser.add_argument(
        "--input", required=True,
        help="Input JSON summary from fetch_and_update.py")
    parser.add_argument(
        "--channel", default=DEFAULT_CHANNEL,
        help=f"Slack channel ID (default: {DEFAULT_CHANNEL})")
    parser.add_argument(
        "--env", default="~/.ricoh-monitoring.env",
        help="Env file path (default: ~/.ricoh-monitoring.env)")
    args = parser.parse_args()

    # Load summary
    input_path = Path(args.input)
    if not input_path.exists():
        print(f"Error: Input file not found: {input_path}", file=sys.stderr)
        sys.exit(1)
    with open(input_path) as f:
        summary = json.load(f)

    # Build message
    message = build_message(summary)
    print("--- Message preview ---")
    print(message)
    print("--- End preview ---\n")

    # Load env and post
    env = load_env(args.env)
    post_to_slack(message, args.channel, env)


if __name__ == "__main__":
    main()
