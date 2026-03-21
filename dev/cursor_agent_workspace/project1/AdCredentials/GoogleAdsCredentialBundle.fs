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
            let k1 = entry.Key1
            let k2 = entry.Key2
            let k3 = entry.Key3
            let k4 = entry.Key4

            let missing =
                [ if String.IsNullOrWhiteSpace k1 then "key1（clientId）"
                  if String.IsNullOrWhiteSpace k2 then "key2（clientSecret）"
                  if String.IsNullOrWhiteSpace k3 then "key3（refreshToken）"
                  if String.IsNullOrWhiteSpace k4 then "key4（developerToken）" ]

            if missing.Length > 0 then
                let joined = String.Join("、", missing)
                Error $"Google 憑證缺少：{joined}"
            else
                let login =
                    if String.IsNullOrWhiteSpace entry.Key5 then
                        None
                    else
                        Some(entry.Key5.Trim())

                Ok
                    { ClientId = k1.Trim()
                      ClientSecret = k2.Trim()
                      RefreshToken = k3.Trim()
                      DeveloperToken = k4.Trim()
                      DefaultLoginCustomerId = login }
