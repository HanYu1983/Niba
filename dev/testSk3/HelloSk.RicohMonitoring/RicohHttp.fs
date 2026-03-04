namespace HelloSk.RicohMonitoring

open System
open System.Collections.Generic
open System.Net.Http
open System.Text
open System.Text.Json
open System.Threading.Tasks

/// HTTP と Google OAuth2 トークン取得
module RicohHttp =
    let private jsonOptions = JsonSerializerOptions(PropertyNameCaseInsensitive = true)

    /// POST form-urlencoded して JSON をパース。access_token を取得。
    let getGoogleAccessToken (client: HttpClient) (clientId: string) (clientSecret: string) (refreshToken: string) : Result<string, string> =
        let form = [
            KeyValuePair<string, string>("client_id", clientId)
            KeyValuePair<string, string>("client_secret", clientSecret)
            KeyValuePair<string, string>("refresh_token", refreshToken)
            KeyValuePair<string, string>("grant_type", "refresh_token")
        ]
        let content = new FormUrlEncodedContent(form)
        try
            let resp = client.PostAsync("https://oauth2.googleapis.com/token", content).GetAwaiter().GetResult()
            let body = resp.Content.ReadAsStringAsync().GetAwaiter().GetResult()
            if not resp.IsSuccessStatusCode then
                Error(sprintf "Token error %d: %s" (int resp.StatusCode) body)
            else
                let doc = JsonDocument.Parse(body)
                let root = doc.RootElement
                match root.TryGetProperty("access_token") with
                | true, tok -> Ok(tok.GetString())
                | _ -> Error("access_token not in response")
        with ex -> Error(ex.Message)

    /// POST JSON してレスポンス文字列を返す
    let postJson (client: HttpClient) (url: string) (headers: (string * string) list) (body: JsonElement) : Result<string, string> =
        try
            use req = new HttpRequestMessage(HttpMethod.Post, url)
            for (k, v) in headers do
                req.Headers.TryAddWithoutValidation(k, v) |> ignore
            req.Content <- new StringContent(body.GetRawText(), Encoding.UTF8, "application/json")
            let resp = client.SendAsync(req).GetAwaiter().GetResult()
            let s = resp.Content.ReadAsStringAsync().GetAwaiter().GetResult()
            if not resp.IsSuccessStatusCode then
                Error(sprintf "%d: %s" (int resp.StatusCode) (if s.Length > 500 then s.Substring(0, 500) + "..." else s))
            else
                Ok s
        with ex -> Error(ex.Message)

    /// GET で文字列取得
    let get (client: HttpClient) (url: string) (headers: (string * string) list) : Result<string, string> =
        try
            use req = new HttpRequestMessage(HttpMethod.Get, url)
            for (k, v) in headers do
                req.Headers.TryAddWithoutValidation(k, v) |> ignore
            let resp = client.SendAsync(req).GetAwaiter().GetResult()
            let s = resp.Content.ReadAsStringAsync().GetAwaiter().GetResult()
            if not resp.IsSuccessStatusCode then Error(sprintf "%d: %s" (int resp.StatusCode) s)
            else Ok s
        with ex -> Error(ex.Message)
