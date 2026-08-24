namespace HelloSk.RicohMonitoring

open System
open System.Globalization
open System.Text

/// スプレッドシート行のパース・当月セクション抽出・アラート判定
module RicohSpreadsheetLogic =
    let colA, colB, colC, colE, colF, colG, colI, colJ, colM, colN, colO, colP, colQ = 0, 1, 2, 4, 5, 6, 8, 9, 12, 13, 14, 15, 16

    let safeGet (row: string list) (i: int) =
        if i < row.Length then row.[i].Trim() else ""

    let parseYen (s: string) : float =
        let s = (if isNull s then "" else s).Replace("¥", "").Replace(",", "").Replace(" ", "").Trim()
        if s = "" || s = "-" then 0.0
        else match Double.TryParse(s, NumberStyles.Any, CultureInfo.InvariantCulture) with | true, v -> v | _ -> 0.0

    let parseDate (s: string) : string option =
        let s = (if isNull s then "" else s).Trim()
        if s = "" then None
        else
            let formats = [| "yyyy/M/d"; "yyyy-MM-dd"; "yyyy/M/d H:m:s" |]
            match DateTime.TryParseExact(s, formats, CultureInfo.InvariantCulture, DateTimeStyles.None) with
            | true, dt -> Some(dt.ToString("yyyy-MM-dd"))
            | _ -> None

    let currentMonthLabel () = sprintf "%d月" DateTime.Now.Month

    /// 行リストから当月セクションのキャンペーン行を抽出（1-based row 番号付き）
    let findCurrentMonthRows (rows: string list list) (baseRow: int) : CampaignRow list =
        let monthLabel = currentMonthLabel ()
        let mutable inSection = false
        let mutable result = []
        for i = 0 to rows.Length - 1 do
            let row = rows.[i]
            let pad = if row.Length < 17 then row @ List.replicate (17 - row.Length) "" else row
            let rowNum = baseRow + i
            let aVal = safeGet pad colA
            if aVal = monthLabel then inSection <- true
            if inSection && aVal <> "" && aVal <> monthLabel && aVal.EndsWith("月") then
                inSection <- false
            if not inSection then ()
            else
                let campaignName = safeGet pad colC
                if campaignName = "" || campaignName = "キャンペーン名" then ()
                else
                    result <-
                        { RowIndex = rowNum
                          AnkenName = safeGet pad colB
                          CampaignName = campaignName
                          StartDate = parseDate (safeGet pad colE)
                          EndDate = parseDate (safeGet pad colF)
                          GBudget = parseYen (safeGet pad colG)
                          IActual = parseYen (safeGet pad colI)
                          JValue = parseYen (safeGet pad colJ)
                          RemainingDays = parseYen (safeGet pad colM)
                          NValue = parseYen (safeGet pad colN)
                          OValue = parseYen (safeGet pad colO)
                          PValue = parseYen (safeGet pad colP)
                          QLog = safeGet pad colQ }
                        :: result
        List.rev result

    let shortenCampaignName (name: string) =
        let s = if isNull name then "" else name
        let s = if s.StartsWith("Ricoh_Hitokuse_") then s.Substring("Ricoh_Hitokuse_".Length) else s
        let s = if s.StartsWith("2025年3Q_ブランド施策_") then s.Substring("2025年3Q_ブランド施策_".Length) else s
        let s = if s.StartsWith("2025年4Q_ブランド施策_") then s.Substring("2025年4Q_ブランド施策_".Length) else s
        s

    let checkAlerts (campaigns: CampaignRow list) (adsStatuses: Map<string, string>) : Alerts =
        let today = DateTime.Now.Date
        let norm = fun s -> if String.IsNullOrEmpty(s) then s else s.Normalize(NormalizationForm.FormC)
        let endDateSoon = ResizeArray<AlertEndDateSoon>()
        let budgetHigh = ResizeArray<AlertBudgetHigh>()
        let stoppedEarly = ResizeArray<AlertStoppedEarly>()
        let stillRunning = ResizeArray<AlertStillRunning>()
        for c in campaigns do
            let endDt = c.EndDate |> Option.bind (fun s -> match DateTime.TryParseExact(s, "yyyy-MM-dd", null, DateTimeStyles.None) with | true, d -> Some d.Date | _ -> None)
            if endDt.IsSome && endDt.Value >= today then
                let daysLeft = (endDt.Value - today).Days
                if daysLeft <= 3 then endDateSoon.Add({ Campaign = c.CampaignName; Anken = c.AnkenName; EndDate = c.EndDate.Value; DaysLeft = daysLeft })
            if c.GBudget > 0.0 && c.IActual > 0.0 && c.RemainingDays > 0.0 then
                let ratio = c.IActual / c.GBudget
                if ratio >= 0.90 then budgetHigh.Add({ Campaign = c.CampaignName; Anken = c.AnkenName; GBudget = c.GBudget; IActual = c.IActual; Ratio = ratio })
            if endDt.IsSome && endDt.Value > today then
                let status = defaultArg (adsStatuses.TryFind(norm c.CampaignName)) "UNKNOWN"
                if status <> "ENABLED" then stoppedEarly.Add({ Campaign = c.CampaignName; Anken = c.AnkenName; EndDate = c.EndDate.Value; Status = status })
            if endDt.IsSome && endDt.Value < today then
                let status = defaultArg (adsStatuses.TryFind(norm c.CampaignName)) "UNKNOWN"
                if status = "ENABLED" then stillRunning.Add({ Campaign = c.CampaignName; Anken = c.AnkenName; EndDate = c.EndDate.Value; DaysOver = (today - endDt.Value).Days })
        { EndDateSoon = List.ofSeq endDateSoon
          BudgetHigh = List.ofSeq budgetHigh
          StoppedEarly = List.ofSeq stoppedEarly
          StillRunning = List.ofSeq stillRunning }
