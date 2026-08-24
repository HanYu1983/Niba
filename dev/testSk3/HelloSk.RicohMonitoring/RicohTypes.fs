namespace HelloSk.RicohMonitoring

open System

/// スプレッドシートの当月キャンペーン1行分（0-based 列インデックス対応）
type CampaignRow =
    { RowIndex: int
      AnkenName: string
      CampaignName: string
      StartDate: string option
      EndDate: string option
      GBudget: float
      IActual: float
      JValue: float
      RemainingDays: float
      NValue: float
      OValue: float
      PValue: float
      QLog: string }

/// J列更新用（range + values）
type JUpdate = { Range: string; Values: float list list }

/// O列/Q列更新用
type OQUpdate = { Range: string; Values: string list list }

/// Google Ads 日予算変更候補
type BudgetChange =
    { CampaignName: string
      BudgetResource: string
      OldBudget: float
      NewBudget: int }

/// アラート：請求終了日3日以内
type AlertEndDateSoon =
    { [<System.Text.Json.Serialization.JsonPropertyName("campaign")>] Campaign: string
      [<System.Text.Json.Serialization.JsonPropertyName("anken")>] Anken: string
      [<System.Text.Json.Serialization.JsonPropertyName("end_date")>] EndDate: string
      [<System.Text.Json.Serialization.JsonPropertyName("days_left")>] DaysLeft: int }

/// アラート：予算消化率90%以上
type AlertBudgetHigh =
    { [<System.Text.Json.Serialization.JsonPropertyName("campaign")>] Campaign: string
      [<System.Text.Json.Serialization.JsonPropertyName("anken")>] Anken: string
      [<System.Text.Json.Serialization.JsonPropertyName("g_budget")>] GBudget: float
      [<System.Text.Json.Serialization.JsonPropertyName("i_actual")>] IActual: float
      [<System.Text.Json.Serialization.JsonPropertyName("ratio")>] Ratio: float }

/// アラート：終了日前に停止
type AlertStoppedEarly =
    { [<System.Text.Json.Serialization.JsonPropertyName("campaign")>] Campaign: string
      [<System.Text.Json.Serialization.JsonPropertyName("anken")>] Anken: string
      [<System.Text.Json.Serialization.JsonPropertyName("end_date")>] EndDate: string
      [<System.Text.Json.Serialization.JsonPropertyName("status")>] Status: string }

/// アラート：終了日超過で配信中
type AlertStillRunning =
    { [<System.Text.Json.Serialization.JsonPropertyName("campaign")>] Campaign: string
      [<System.Text.Json.Serialization.JsonPropertyName("anken")>] Anken: string
      [<System.Text.Json.Serialization.JsonPropertyName("end_date")>] EndDate: string
      [<System.Text.Json.Serialization.JsonPropertyName("days_over")>] DaysOver: int }

type Alerts =
    { [<System.Text.Json.Serialization.JsonPropertyName("end_date_soon")>] EndDateSoon: AlertEndDateSoon list
      [<System.Text.Json.Serialization.JsonPropertyName("budget_high")>] BudgetHigh: AlertBudgetHigh list
      [<System.Text.Json.Serialization.JsonPropertyName("stopped_early")>] StoppedEarly: AlertStoppedEarly list
      [<System.Text.Json.Serialization.JsonPropertyName("still_running")>] StillRunning: AlertStillRunning list }

type RicohJUpdateItem =
    { [<System.Text.Json.Serialization.JsonPropertyName("campaign")>] Campaign: string
      [<System.Text.Json.Serialization.JsonPropertyName("short_name")>] ShortName: string
      [<System.Text.Json.Serialization.JsonPropertyName("old")>] Old: float
      [<System.Text.Json.Serialization.JsonPropertyName("new")>] New: float }

type RicohBudgetChangeItem =
    { [<System.Text.Json.Serialization.JsonPropertyName("campaign")>] Campaign: string
      [<System.Text.Json.Serialization.JsonPropertyName("short_name")>] ShortName: string
      [<System.Text.Json.Serialization.JsonPropertyName("old")>] Old: float
      [<System.Text.Json.Serialization.JsonPropertyName("new")>] New: float }

/// Slack 通知用 JSON サマリー（fetch_and_update 出力）。プロパティ名は JSON で snake_case にする。
type RicohSummary =
    { [<System.Text.Json.Serialization.JsonPropertyName("date")>] Date: string
      [<System.Text.Json.Serialization.JsonPropertyName("month")>] Month: string
      [<System.Text.Json.Serialization.JsonPropertyName("spreadsheet_url")>] SpreadsheetUrl: string
      [<System.Text.Json.Serialization.JsonPropertyName("j_updates")>] JUpdates: RicohJUpdateItem list
      [<System.Text.Json.Serialization.JsonPropertyName("budget_changes")>] BudgetChanges: RicohBudgetChangeItem list
      [<System.Text.Json.Serialization.JsonPropertyName("alerts")>] Alerts: Alerts
      [<System.Text.Json.Serialization.JsonPropertyName("dry_run")>] DryRun: bool }

module RicohConstants =
    let [<Literal>] SpreadsheetId = "1emn80SU8AqQb1kXQldKZSLOKbSqFT3CUf5TiY8th6jc"
    let [<Literal>] SheetName = "ブランド施策2025下期"
    let [<Literal>] DataStartRow = 4
    let [<Literal>] DataEndRow = 200
    let [<Literal>] BudgetDiffThreshold = 1000
    let [<Literal>] BudgetChangeSafetyLimit = 5000
    let [<Literal>] GoogleAdsApiVersion = "v23"
    let [<Literal>] DefaultSlackChannel = "C0AF6K6C5RP"
