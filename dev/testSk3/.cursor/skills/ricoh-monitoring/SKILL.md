---
name: ricoh-monitoring
description: >
  リコーのGoogle広告キャンペーンの運用モニタリングスキル。
  スプレッドシート「ブランド施策2025下期」の当月キャンペーンに対して、
  Google Ads APIから費用データを取得しJ列(媒体費実績)を更新、
  P列(差分)が¥1,000以上のキャンペーンはO列(設定金額)を理想日予算に修正し
  Q列(設定ログ)に変更ログを記録、さらにGoogle広告の日予算も反映する。
  結果とアラートをSlackに通知する。
  Use when the user wants to: (1) リコーの運用モニタリングを実行, (2) リコーのGoogle広告費用を
  スプレッドシートに反映, (3) リコーのキャンペーン日予算を調整.
  Triggers on mentions of "リコー", "Ricoh", "リコー週次レポート", "リコーweekly",
  "ブランド施策", "日予算更新", "運用モニタリング", or requests to update the Ricoh report.
---

# Ricoh 運用モニタリング Skill

リコーのGoogle広告キャンペーンの運用モニタリングを自動化するスキル。

## ⚠️ 重要な制約事項

以下のルールは**必ず**遵守すること:

1. **スプレッドシートの編集範囲**: 青色セル（J列: 媒体費実績、O列: 設定金額、Q列: 設定ログ）**のみ**編集可能。それ以外のセルは**絶対に編集しない**こと。
2. **Google広告の変更範囲**: キャンペーンの**日予算のみ**変更可能。それ以外の設定（ステータス、ターゲティング、入札等）は**絶対に変更しない**こと。
3. **日予算の大幅変更**: 日予算を**¥5,000以上変更する場合**は、必ずユーザーの許可を取ってから実行すること。スクリプトでは `--force` オプションなしの場合、¥5,000以上の変更は自動スキップされる。

## 対象スプレッドシート

- **名前**: ブランド施策2025下期
- **ID**: `1emn80SU8AqQb1kXQldKZSLOKbSqFT3CUf5TiY8th6jc`
- **URL**: https://docs.google.com/spreadsheets/d/1emn80SU8AqQb1kXQldKZSLOKbSqFT3CUf5TiY8th6jc

## 対象Google広告アカウント

- **アカウント名**: 株式会社リコー
- **Customer ID**: 344-968-8129
- **注意**: MCC経由ではなく直接アクセスすること（MCC IDは使用しない）

## Prerequisites

```bash
pip install requests google-auth google-api-python-client
```

## Setup (First Time Only)

1. `.env` ファイルを作成:
   ```bash
   cp assets/.env.example ~/.ricoh-monitoring.env
   ```

2. `~/.ricoh-monitoring.env` に認証情報を設定:
   - Google Ads API: `GOOGLE_ADS_CUSTOMER_ID`, `GOOGLE_ADS_DEVELOPER_TOKEN`, `GOOGLE_ADS_CLIENT_ID`, `GOOGLE_ADS_CLIENT_SECRET`, `GOOGLE_ADS_REFRESH_TOKEN`
   - Google Sheets API: `GOOGLE_SHEETS_CLIENT_ID`, `GOOGLE_SHEETS_CLIENT_SECRET`, `GOOGLE_SHEETS_REFRESH_TOKEN`

3. Google Ads のリフレッシュトークンは `google-ads-report` スキルの `get_refresh_token.py` で取得可能。
   Google Sheets のリフレッシュトークンは `puzzshuwa-daily-report` スキルの `get_sheets_token.py` で取得可能。

## Workflow

### Step 1: データ取得・更新・アラートチェック

```bash
python3 scripts/fetch_and_update.py
```

スクリプトは以下の6ステップを順番に実行する:

1. **スプレッドシート読み取り**: 当月（例: 2月）のキャンペーン一覧を取得
2. **Google Ads費用取得**: 各キャンペーンのE列(請求開始日)〜昨日の費用をAPI経由で取得
3. **J列更新**: 媒体費(実績)をGoogle Ads APIの値で上書き
4. **O列/Q列更新**: P列(差分)が¥1,000以上のキャンペーンについて:
   - O列(設定金額) = N列(理想日予算)を¥1,000単位に丸めた値
   - Q列(設定ログ)に `m/d 日予算：¥旧→¥新` 形式でログを追記
5. **Google広告日予算反映**: O列の設定金額とGoogle広告の日予算が一致しないキャンペーンのみ更新
   - ¥5,000以上の変更は `--force` なしではスキップされる
6. **アラートチェック**: 以下の条件をチェックしてJSON出力に含める
   - F列の請求終了日が3日以内に迫っているもの
   - I列(実績/G) が G列(予算/G) の90%以上になっているもの（配信中のもののみ）
   - F列の請求終了日前にGoogle広告が停止しているもの
   - F列の請求終了日を過ぎているがGoogle広告が配信中のもの

出力: `ricoh_report.json`（Slack通知用サマリー）

### Step 2: Slack 通知

```bash
python3 scripts/post_to_slack.py --input ricoh_report.json
```

`#claude_test` (channel_id: `C0AF6K6C5RP`) に Slack Bot Token (chat.postMessage API) で投稿する。
Bot Token は `~/.ricoh-monitoring.env` の `SLACK_BOT_TOKEN` を参照。

投稿形式:

```
📊 リコー ブランド施策 運用モニタリング (YYYY/MM/DD)

【更新結果】
J列（媒体費実績）更新: 変更があったキャンペーン一覧
O列（設定金額）/ 日予算変更: 変更があったキャンペーン一覧

【⚠️ アラート】
1. 請求終了日が3日以内に迫っているもの
2. 予算消化率 90%以上（I列/G列、配信中のもののみ）
3. 請求終了日前にGoogle広告が停止しているもの
4. 請求終了日を過ぎているが広告が配信中のもの
```

### 一括実行

```bash
python3 scripts/fetch_and_update.py --output ricoh_report.json && \
python3 scripts/post_to_slack.py --input ricoh_report.json
```

### ドライラン（変更せずに確認のみ）

```bash
python3 scripts/fetch_and_update.py --dry-run --output ricoh_report.json
```

## スプレッドシート構造

| 列 | 内容 | 編集可否 |
|----|------|----------|
| A | 月 | ❌ 読み取りのみ |
| B | 案件名 | ❌ 読み取りのみ |
| C | キャンペーン名 | ❌ 読み取りのみ |
| D | 休日配信 | ❌ 読み取りのみ |
| E | 請求開始日 | ❌ 読み取りのみ |
| F | 請求終了日 | ❌ 読み取りのみ |
| G | 金額(予算/G) | ❌ 読み取りのみ |
| H | 媒体費(予算) | ❌ 読み取りのみ |
| I | 金額(実績/G) | ❌ 読み取りのみ |
| J | 媒体費(実績) | ✅ **更新対象（青色セル）** |
| K | 残余予算(G) | ❌ 数式（自動計算） |
| L | 媒体費(残余予算) | ❌ 数式（自動計算） |
| M | 残り日数 | ❌ 数式（自動計算） |
| N | 理想日予算 | ❌ 数式（自動計算） |
| O | 設定金額 | ✅ **更新対象（青色セル）** |
| P | 差分 | ❌ 数式（自動計算） |
| Q | 設定ログ | ✅ **更新対象（青色セル）** |

## キャンペーン名の注意事項

- C列のキャンペーン名はGoogle広告のキャンペーン名と**完全一致**させる必要がある
- Unicode正規化（NFC/NFD）の違いに注意（特に「グ」「プ」などの濁点・半濁点文字）
- 過去に発生した不一致例:
  - `海外①_メキシコ` → `海外①メキシコ`（余分なアンダースコア）
  - `国内⑤廃棄物処理` → `国内⑤産廃物処理`（名称違い）
  - `リコーグループ` のUnicode正規化差異（NFD vs NFC）

## Options

| オプション | デフォルト | 説明 |
|-----------|-----------|------|
| `--env PATH` | `~/.ricoh-monitoring.env` | 認証情報ファイルのパス |
| `--dry-run` | off | 変更を適用せずに確認のみ |
| `--output PATH` | `ricoh_report.json` | Slack通知用JSONサマリーの出力先 |
| `--force` | off | ¥5,000以上の日予算変更を許可 |

## Slack 送信方式

Slack Bot Token (chat.postMessage API) で投稿する。
Bot Token は `~/.ricoh-monitoring.env` の `SLACK_BOT_TOKEN` を参照。
投稿先: `#claude_test` (channel_id: `C0AF6K6C5RP`)

## Troubleshooting

- **Google Ads認証エラー**: `~/.ricoh-monitoring.env` の `GOOGLE_ADS_REFRESH_TOKEN` を確認。期限切れの場合は `google-ads-report` スキルの `get_refresh_token.py` で再取得
- **Google Sheets認証エラー**: `GOOGLE_SHEETS_REFRESH_TOKEN` を確認。`puzzshuwa-daily-report` スキルの `get_sheets_token.py` で再取得
- **MCC PERMISSION_DENIED**: リコーアカウントはMCC経由ではなく直接アクセスする。envファイルに `GOOGLE_ADS_MCC_ID` を設定しないこと
- **キャンペーン名不一致**: C列のキャンペーン名がGoogle広告と完全一致しているか確認。Unicode正規化（NFC）の違いに注意
- **J列の値が微小に異なる**: Google Ads APIの費用データは取得タイミングにより数百円程度の差異が生じることがある（正常）
- **P列の差分が¥1,000未満でも残る**: O列は¥1,000単位に丸めるため、N列との間に端数差が残る（正常）
- **日予算変更がスキップされた**: ¥5,000以上の変更は安全のため自動スキップ。`--force` オプションを付けて再実行するか、手動で確認後に実行
