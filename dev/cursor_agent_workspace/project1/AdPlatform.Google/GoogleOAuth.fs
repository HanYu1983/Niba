namespace AdPlatform.Google

open AdCredentials
open System
open System.Collections.Generic
open System.Net.Http
open System.Text.Json

module internal GoogleOAuth =

    let private tryPropString (root: JsonElement) (name: string) =
        let mutable el = Unchecked.defaultof<JsonElement>

        if root.TryGetProperty(name, &el) && el.ValueKind = JsonValueKind.String then
            let s = el.GetString()

            if String.IsNullOrEmpty s then
                None
            else
                Some s
        else
            None

    let private tryPropInt (root: JsonElement) (name: string) =
        let mutable el = Unchecked.defaultof<JsonElement>

        if root.TryGetProperty(name, &el) && el.ValueKind = JsonValueKind.Number then
            try
                Some(el.GetInt32())
            with _ ->
                None
        else
            None

    /// 以 refresh_token 換取 access_token（Google OAuth2）。
    let refreshAccessTokenAsync (http: HttpClient) (creds: GoogleAdsCredentials) : Async<Result<struct (string * int), string>> =
        async {
            let pairs =
                [ KeyValuePair("grant_type", "refresh_token")
                  KeyValuePair("client_id", creds.ClientId)
                  KeyValuePair("client_secret", creds.ClientSecret)
                  KeyValuePair("refresh_token", creds.RefreshToken) ]

            use content = new FormUrlEncodedContent(pairs)

            use req = new HttpRequestMessage(HttpMethod.Post, "https://oauth2.googleapis.com/token")
            req.Content <- content

            let! resp = http.SendAsync(req) |> Async.AwaitTask
            let! body = resp.Content.ReadAsStringAsync() |> Async.AwaitTask

            if not resp.IsSuccessStatusCode then
                let errMsg =
                    try
                        use doc = JsonDocument.Parse(body)
                        let root = doc.RootElement

                        match tryPropString root "error" with
                        | Some e ->
                            let desc = tryPropString root "error_description" |> Option.defaultValue ""
                            $"{e}: {desc}"
                        | None -> body
                    with _ ->
                        body

                return Error $"OAuth token 請求失敗 ({int resp.StatusCode}): {errMsg}"
            else
                try
                    use doc = JsonDocument.Parse(body)
                    let root = doc.RootElement

                    match tryPropString root "access_token" with
                    | None -> return Error "OAuth 回應缺少 access_token。"
                    | Some token when String.IsNullOrWhiteSpace token -> return Error "OAuth 回應 access_token 為空。"
                    | Some token ->
                        let exp =
                            match tryPropInt root "expires_in" with
                            | Some n -> max 60 n
                            | None -> 3600

                        return Ok(struct (token, exp))
                with ex ->
                    return Error $"解析 OAuth JSON 失敗：{ex.Message}"
        }
