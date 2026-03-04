namespace HelloSk.RicohMonitoring

open System
open System.IO
open System.Net.Http
open System.Text
open System.Text.Json

/// リコー運用モニタリング結果を Slack に投稿
module RicohPostToSlack =
    let private jsonOptions = JsonSerializerOptions(PropertyNameCaseInsensitive = true)

    let formatYen (v: float) = sprintf "¥%s" ((int v).ToString("N0"))

    let buildMessage (summary: RicohSummary) : string =
        let prefix = if summary.DryRun then "[DRY-RUN] " else ""
        let lines = ResizeArray<string>()
        lines.Add(sprintf "*📊 %sリコー ブランド施策 運用モニタリング (%s)*" prefix summary.Date)
        lines.Add("")
        lines.Add("---")
        lines.Add("")
        lines.Add("*【更新結果】*")
        lines.Add("")
        lines.Add("*J列（媒体費実績）更新:*")
        if summary.JUpdates.Length > 0 then
            for j in summary.JUpdates do
                lines.Add(sprintf "• %s: %s → %s" j.ShortName (formatYen j.Old) (formatYen j.New))
        else lines.Add("変更なし")
        lines.Add("")
        lines.Add("*O列（設定金額）/ 日予算変更:*")
        if summary.BudgetChanges.Length > 0 then
            for bc in summary.BudgetChanges do
                lines.Add(sprintf "• %s: %s → *%s*" bc.ShortName (formatYen bc.Old) (formatYen bc.New))
            lines.Add("→ Google広告の日予算にも反映済み ✅")
        else lines.Add("変更なし")
        lines.Add("")
        lines.Add("---")
        lines.Add("")
        lines.Add("*【⚠️ アラート】*")
        lines.Add("")
        lines.Add("*1. 請求終了日が3日以内に迫っているもの:*")
        if summary.Alerts.EndDateSoon.Length > 0 then
            for a in summary.Alerts.EndDateSoon do
                lines.Add(sprintf "• %s → 終了日: %s (残り%d日)" a.Campaign a.EndDate a.DaysLeft)
        else lines.Add("該当なし ✅")
        lines.Add("")
        lines.Add("*2. 予算消化率 90%以上（配信中のもの）:*")
        if summary.Alerts.BudgetHigh.Length > 0 then
            for a in summary.Alerts.BudgetHigh do
                lines.Add(sprintf "• %s: %s / %s (*%.1f%%*)" a.Campaign (formatYen a.IActual) (formatYen a.GBudget) (a.Ratio * 100.0))
        else lines.Add("該当なし ✅")
        lines.Add("")
        lines.Add("*3. 請求終了日前にGoogle広告が停止しているもの:*")
        if summary.Alerts.StoppedEarly.Length > 0 then
            for a in summary.Alerts.StoppedEarly do
                lines.Add(sprintf "• %s → %s (終了日: %s)" a.Campaign a.Status a.EndDate)
        else lines.Add("該当なし ✅")
        lines.Add("")
        lines.Add("*4. 請求終了日を過ぎているが広告が配信中のもの:*")
        if summary.Alerts.StillRunning.Length > 0 then
            for a in summary.Alerts.StillRunning do
                lines.Add(sprintf "• %s → 終了日: %s (%d日超過)" a.Campaign a.EndDate a.DaysOver)
        else lines.Add("該当なし ✅")
        lines.Add("")
        lines.Add("---")
        lines.Add(sprintf "<%s|📎 スプレッドシートを開く>" summary.SpreadsheetUrl)
        String.concat "\n" lines

    let run (envPath: string) (inputPath: string) (channelId: string) : Result<string, string> =
        if String.IsNullOrWhiteSpace(inputPath) then
            Error("inputPath is required")
        else
            let file = FileInfo(inputPath)
            if not file.Exists then
                Error(sprintf "Input file not found: %s" file.FullName)
            else
                let json = File.ReadAllText(file.FullName)
                let deserialized = JsonSerializer.Deserialize<RicohSummary>(json, jsonOptions)
                if isNull (box deserialized) then
                    Error("Failed to deserialize summary JSON")
                else
                    let summary = deserialized
                    match RicohEnv.load envPath with
                    | Error e -> Error e
                    | Ok env ->
                        let token = RicohEnv.get env "SLACK_BOT_TOKEN" |> Option.defaultValue ""
                        if String.IsNullOrEmpty(token) then
                            Error("SLACK_BOT_TOKEN not found in env")
                        else
                            use client = new HttpClient()
                            let channel = if String.IsNullOrWhiteSpace(channelId) then RicohConstants.DefaultSlackChannel else channelId
                            let body = JsonSerializer.Serialize({| channel = channel; text = buildMessage summary |})
                            use content = new StringContent(body, Encoding.UTF8, "application/json")
                            client.DefaultRequestHeaders.Add("Authorization", sprintf "Bearer %s" token)
                            try
                                let resp = client.PostAsync("https://slack.com/api/chat.postMessage", content).GetAwaiter().GetResult()
                                let respBody = resp.Content.ReadAsStringAsync().GetAwaiter().GetResult()
                                use doc = JsonDocument.Parse(respBody)
                                let mutable okEl = Unchecked.defaultof<JsonElement>
                                let ok = doc.RootElement.TryGetProperty("ok", &okEl) && okEl.GetBoolean()
                                if ok then Ok(sprintf "Posted to Slack (channel: %s)" channel)
                                else
                                    let mutable errEl = Unchecked.defaultof<JsonElement>
                                    let err = if doc.RootElement.TryGetProperty("error", &errEl) then errEl.GetString() else "unknown"
                                    Error(sprintf "Slack API error: %s" (if isNull err then "unknown" else err))
                            with ex -> Error(ex.Message)
