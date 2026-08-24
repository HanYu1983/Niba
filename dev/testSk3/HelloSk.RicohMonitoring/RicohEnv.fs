namespace HelloSk.RicohMonitoring

open System
open System.Collections.Generic
open System.IO

/// 環境変数ファイル（key=value）の読み込み
module RicohEnv =
    let private defaultEnvPath () =
        let home = Environment.GetFolderPath(Environment.SpecialFolder.UserProfile)
        Path.Combine(home, ".ricoh-monitoring.env")

    /// 指定パス（~ 展開可）から key=value を読み、Map で返す。存在しない場合は Error。
    let load (path: string) : Result<Map<string, string>, string> =
        let expanded =
            if isNull path || path.Trim() = "" then defaultEnvPath ()
            else path.Replace("~", Environment.GetFolderPath(Environment.SpecialFolder.UserProfile)).Trim()
        let file = FileInfo(expanded)
        if not file.Exists then
            Error(sprintf "Env file not found: %s" file.FullName)
        else
            let mutable m = Map.empty
            for line in File.ReadAllLines(file.FullName) do
                let s = line.Trim()
                if s.Length > 0 && not (s.StartsWith("#")) && s.Contains("=") then
                    let i = s.IndexOf('=')
                    let k = s.Substring(0, i).Trim()
                    let v = s.Substring(i + 1).Trim()
                    m <- m.Add(k, v)
            Ok m

    let requiredAdsKeys =
        [ "GOOGLE_ADS_CUSTOMER_ID"
          "GOOGLE_ADS_DEVELOPER_TOKEN"
          "GOOGLE_ADS_CLIENT_ID"
          "GOOGLE_ADS_CLIENT_SECRET"
          "GOOGLE_ADS_REFRESH_TOKEN" ]

    let requiredSheetsKeys =
        [ "GOOGLE_SHEETS_CLIENT_ID"
          "GOOGLE_SHEETS_CLIENT_SECRET"
          "GOOGLE_SHEETS_REFRESH_TOKEN" ]

    /// 必須キーが全て存在するか検証。欠けていれば Error にキー名を列挙。
    let validate (env: Map<string, string>) : Result<unit, string> =
        let missing =
            (requiredAdsKeys @ requiredSheetsKeys)
            |> List.filter (fun k -> not (env.ContainsKey(k)))
        if missing.Length > 0 then
            Error(sprintf "Missing in env: %s" (String.concat ", " missing))
        else
            Ok()

    let get (env: Map<string, string>) (key: string) : string option =
        env.TryFind(key)
