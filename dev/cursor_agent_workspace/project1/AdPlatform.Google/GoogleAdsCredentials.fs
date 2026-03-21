namespace AdPlatform.Google

open System

/// Google Ads API 與 OAuth 所需憑證（通常由環境變數載入）。
/// `login-customer-id` 標頭請於呼叫 `GoogleAdsClient`／`SearchAsync` 時另以參數傳入。
type GoogleAdsCredentials =
    { ClientId: string
      ClientSecret: string
      RefreshToken: string
      DeveloperToken: string }

module GoogleAdsCredentials =

    /// 由四個參數建立憑證（會 trim）；若有欄位為空則回傳缺漏的邏輯鍵名列表。
    let tryCreate
        (clientId: string)
        (clientSecret: string)
        (refreshToken: string)
        (developerToken: string)
        : Result<GoogleAdsCredentials, string list> =
        let trim (s: string) =
            if isNull s then
                ""
            else
                s.Trim()

        let ci = trim clientId
        let cs = trim clientSecret
        let rt = trim refreshToken
        let dt = trim developerToken

        let fields =
            [ "client_id", ci
              "client_secret", cs
              "refresh_token", rt
              "developer_token", dt ]

        let missing =
            fields
            |> List.choose (fun (label, v) ->
                if String.IsNullOrWhiteSpace v then
                    Some label
                else
                    None)

        if missing.Length > 0 then
            Error missing
        else
            Ok
                { ClientId = ci
                  ClientSecret = cs
                  RefreshToken = rt
                  DeveloperToken = dt }

    let private tryVar (names: string list) =
        names
        |> List.tryPick (fun name ->
            let v = Environment.GetEnvironmentVariable(name)

            if String.IsNullOrWhiteSpace v then
                None
            else
                Some(v.Trim()))

    /// 依序嘗試多個環境變數名稱；優先使用帶 `GOOGLE_ADS_` 前綴者。
    let tryLoadFromEnvironment() : Result<GoogleAdsCredentials, string list> =
        let need label names =
            match tryVar names with
            | Some v -> Ok v
            | None -> Error label

        let clientId = need "client_id" [ "GOOGLE_ADS_CLIENT_ID"; "client_id" ]
        let clientSecret = need "client_secret" [ "GOOGLE_ADS_CLIENT_SECRET"; "client_secret" ]
        let refreshToken = need "refresh_token" [ "GOOGLE_ADS_REFRESH_TOKEN"; "refresh_token" ]
        let developerToken = need "developer_token" [ "GOOGLE_ADS_DEVELOPER_TOKEN"; "developer_token" ]

        let results =
            [ clientId; clientSecret; refreshToken; developerToken ]

        let missing =
            results
            |> List.choose (function
                | Error label -> Some label
                | Ok _ -> None)

        if missing.Length > 0 then
            Error missing
        else
            let unwrap =
                function
                | Ok x -> x
                | Error _ -> failwith "GoogleAdsCredentials: 缺少欄位時不應進入此分支。"

            tryCreate (unwrap clientId) (unwrap clientSecret) (unwrap refreshToken) (unwrap developerToken)
