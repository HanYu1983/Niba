namespace HelloSk.RicohMonitoring

open System
open System.IO
open System.Net.Http
open System.Text
open System.Text.Json
open System.Threading

/// リコー運用モニタリング本処理：スプレッドシート読取・Google Ads 費用取得・J/O/Q 更新・日予算反映・アラート・JSON 出力
module RicohFetchAndUpdate =
    open RicohSpreadsheetLogic
    open RicohConstants

    let private sheetRange () = sprintf "'%s'!A%d:Q%d" SheetName DataStartRow DataEndRow

    let run (envPath: string) (dryRun: bool) (outputPath: string) (force: bool) : Result<string, string> =
        match RicohEnv.load envPath with
        | Error e -> Error e
        | Ok env ->
            match RicohEnv.validate env with
            | Error e -> Error e
            | Ok () ->
                use client = new HttpClient()
                client.Timeout <- TimeSpan.FromSeconds(60.0)
                let sheetsToken =
                    RicohHttp.getGoogleAccessToken client
                        (defaultArg (RicohEnv.get env "GOOGLE_SHEETS_CLIENT_ID") "")
                        (defaultArg (RicohEnv.get env "GOOGLE_SHEETS_CLIENT_SECRET") "")
                        (defaultArg (RicohEnv.get env "GOOGLE_SHEETS_REFRESH_TOKEN") "")
                match sheetsToken with
                | Error e -> Error(sprintf "Sheets token: %s" e)
                | Ok sheetsAccessToken ->
                    match RicohAds.getAccessToken client env with
                    | Error e -> Error(sprintf "Ads token: %s" e)
                    | Ok adsAccessToken ->
                        let yesterday = DateTime.Now.AddDays(-1.0).ToString("yyyy-MM-dd")
                        match RicohSheets.getValues client sheetsAccessToken SpreadsheetId (sheetRange()) with
                        | Error e -> Error(sprintf "Sheets get: %s" e)
                        | Ok rows ->
                            let campaigns = findCurrentMonthRows rows DataStartRow
                            if campaigns.Length = 0 then
                                Ok(sprintf "No campaigns for %s" (currentMonthLabel()))
                            else
                                match RicohAds.fetchCampaignCosts client env adsAccessToken campaigns yesterday with
                                | Error e -> Error(sprintf "Ads costs: %s" e)
                                | Ok costs ->
                                    let nfc = fun s -> if String.IsNullOrEmpty(s) then s else s.Normalize(NormalizationForm.FormC)
                                    let jUpdates = ResizeArray<_>()
                                    for c in campaigns do
                                        let nameNfc = nfc c.CampaignName
                                        match Map.tryFind nameNfc costs with
                                        | Some newCost when abs(newCost - c.JValue) >= 1.0 ->
                                            jUpdates.Add((sprintf "'%s'!J%d" SheetName c.RowIndex, [[box newCost]]))
                                        | _ -> ()
                                    let mutable campaignsAfterJ = campaigns
                                    if jUpdates.Count > 0 && not dryRun then
                                        match RicohSheets.batchUpdate client sheetsAccessToken SpreadsheetId (List.ofSeq jUpdates) with
                                        | Error _ -> ()
                                        | _ -> ()
                                        Thread.Sleep(2000)
                                        match RicohSheets.getValues client sheetsAccessToken SpreadsheetId (sheetRange()) with
                                        | Ok rows2 -> campaignsAfterJ <- findCurrentMonthRows rows2 DataStartRow
                                        | _ -> ()
                                    match RicohAds.fetchCampaignBudgets client env adsAccessToken with
                                    | Error e -> Error(sprintf "Ads budgets: %s" e)
                                    | Ok adsBudgets ->
                                        let todayStr = sprintf "%d/%d" DateTime.Now.Month DateTime.Now.Day
                                        let oqUpdates = ResizeArray<_>()
                                        let budgetChanges = ResizeArray<BudgetChange>()
                                        for c in campaignsAfterJ do
                                            if c.RemainingDays > 0.0 && abs(c.PValue) >= float BudgetDiffThreshold then
                                                let newO = int (Math.Round(c.NValue / 1000.0) * 1000.0)
                                                oqUpdates.Add((sprintf "'%s'!O%d" SheetName c.RowIndex, [[box newO]]))
                                                let newQ = if String.IsNullOrEmpty(c.QLog) then sprintf "%s 日予算：¥%.0f→¥%d" todayStr c.OValue newO else c.QLog + "\n" + sprintf "%s 日予算：¥%.0f→¥%d" todayStr c.OValue newO
                                                oqUpdates.Add((sprintf "'%s'!Q%d" SheetName c.RowIndex, [[box newQ]]))
                                                match Map.tryFind (nfc c.CampaignName) adsBudgets with
                                                | Some info when abs(info.BudgetYen - float newO) >= 1.0 ->
                                                    budgetChanges.Add({ CampaignName = c.CampaignName; BudgetResource = info.BudgetResource; OldBudget = info.BudgetYen; NewBudget = newO })
                                                | _ -> ()
                                        if oqUpdates.Count > 0 && not dryRun then
                                            RicohSheets.batchUpdate client sheetsAccessToken SpreadsheetId (List.ofSeq oqUpdates) |> ignore
                                        for bc in budgetChanges do
                                            let changeAmt = abs(bc.NewBudget - int bc.OldBudget)
                                            if not dryRun && (changeAmt < BudgetChangeSafetyLimit || force) then
                                                RicohAds.updateCampaignBudget client env adsAccessToken bc.BudgetResource bc.NewBudget |> ignore
                                        let statuses = match RicohAds.fetchCampaignStatuses client env adsAccessToken with | Ok m -> m | _ -> Map.empty
                                        let alerts = checkAlerts campaignsAfterJ statuses
                                        let jUpdatesForSummary: RicohJUpdateItem list =
                                            campaigns
                                            |> List.choose (fun c ->
                                                let nameNfc = nfc c.CampaignName
                                                Map.tryFind nameNfc costs |> Option.bind (fun newVal -> if abs(newVal - c.JValue) >= 1.0 then Some { RicohJUpdateItem.Campaign = c.CampaignName; ShortName = shortenCampaignName c.CampaignName; Old = c.JValue; New = newVal } else None))
                                        let summary: RicohSummary =
                                            { Date = DateTime.Now.ToString("yyyy/MM/dd")
                                              Month = currentMonthLabel()
                                              SpreadsheetUrl = sprintf "https://docs.google.com/spreadsheets/d/%s" SpreadsheetId
                                              JUpdates = jUpdatesForSummary
                                              BudgetChanges = ((List.ofSeq budgetChanges) |> List.map (fun bc -> { RicohBudgetChangeItem.Campaign = bc.CampaignName; ShortName = shortenCampaignName bc.CampaignName; Old = bc.OldBudget; New = float bc.NewBudget }) : RicohBudgetChangeItem list)
                                              Alerts = alerts
                                              DryRun = dryRun }
                                        let json = JsonSerializer.Serialize(summary, JsonSerializerOptions(WriteIndented = true, Encoder = System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping))
                                        let outPath = if String.IsNullOrWhiteSpace(outputPath) then "ricoh_report.json" else outputPath
                                        try
                                            File.WriteAllText(outPath, json)
                                            Ok(sprintf "Summary written to %s" outPath)
                                        with ex -> Error(ex.Message)