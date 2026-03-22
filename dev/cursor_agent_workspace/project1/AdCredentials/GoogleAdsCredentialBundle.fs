namespace AdCredentials

open System

/// Google Ads 憑證物料（由憑證檔 `key1`～`key5` 對應而來）。
/// 對應：**key1**=clientId、**key2**=clientSecret、**key3**=refreshToken、**key4**=developerToken、**key5**=defaultLoginCustomerId（可空白）。
type GoogleAdsCredentialBundle =
    { ClientId: string
      ClientSecret: string
      RefreshToken: string
      DeveloperToken: string
      DefaultLoginCustomerId: string option }

module GoogleAdsCredentialBundle =

    let private normPlatform (s: string) =
        if isNull s then
            ""
        else
            s.Trim().ToLowerInvariant()

    /// 固定小寫 `google`，與輸入列 `platform`／檔案 `clientAdPlatform` 比對一致。
    [<Literal>]
    let ExpectedClientAdPlatform = "google"

    /// 僅當 `entry.ClientAdPlatform` 為 Google 時成功；否則回傳錯誤訊息。
    let tryFromResolvedEntry (entry: ResolvedCredentialEntry) : Result<GoogleAdsCredentialBundle, string> =
        let plat = normPlatform entry.ClientAdPlatform

        if plat <> ExpectedClientAdPlatform then
            Error
                $"此筆憑證的 clientAdPlatform 為 '{entry.ClientAdPlatform}'，無法解析為 Google 憑證（須為 '{ExpectedClientAdPlatform}'）。"
        else
            match GoogleAdsCredentials.tryCreate entry.Key1 entry.Key2 entry.Key3 entry.Key4 with
            | Error missing ->
                let joined = String.Join("、", missing)
                Error $"GoogleAdsCredentials 驗證失敗，缺少：{joined}"
            | Ok creds ->
                let login =
                    if String.IsNullOrWhiteSpace entry.Key5 then
                        None
                    else
                        Some(entry.Key5.Trim())

                Ok
                    { ClientId = creds.ClientId
                      ClientSecret = creds.ClientSecret
                      RefreshToken = creds.RefreshToken
                      DeveloperToken = creds.DeveloperToken
                      DefaultLoginCustomerId = login }
