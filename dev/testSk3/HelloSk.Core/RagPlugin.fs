namespace HelloSk.Core

open System
open System.ComponentModel
open System.Net.Http
open System.Net.Http.Headers
open System.Text
open System.Text.Json
open HelloSk.Core.Shared
open Microsoft.SemanticKernel

[<AutoOpen>]
module RagPluginImpl =

    module Embedding =
        let private jsonOptions =
            JsonSerializerOptions(PropertyNamingPolicy = JsonNamingPolicy.CamelCase, WriteIndented = false)

        let private getConfig () =
            let apiKey = getEnv "OPENROUTER_API_KEY" |> Option.defaultValue ""
            let baseUrl =
                getEnv "OPENROUTER_BASE_URL"
                |> Option.filter (String.IsNullOrWhiteSpace >> not)
                |> Option.defaultValue "https://openrouter.ai/api/v1"
            let modelId =
                getEnv "OPENROUTER_EMBED_MODEL"
                |> Option.filter (String.IsNullOrWhiteSpace >> not)
                |> Option.orElse (getEnv "OPENROUTER_MODEL")
                |> Option.defaultValue "text-embedding-3-large"
            baseUrl, apiKey, modelId

        /// 對單一文字產生一個 embedding 向量
        let generateOne (text: string) : float[] =
            let baseUrl, apiKey, modelId = getConfig ()
            use client = new HttpClient()
            client.Timeout <- TimeSpan.FromSeconds(60.0)
            client.BaseAddress <- Uri(if baseUrl.EndsWith("/") then baseUrl else baseUrl + "/")
            if not (String.IsNullOrWhiteSpace apiKey) then
                client.DefaultRequestHeaders.Authorization <- AuthenticationHeaderValue("Bearer", apiKey)
            let body = {| model = modelId; input = [ text ] |}
            use content = new StringContent(JsonSerializer.Serialize(body, jsonOptions), Encoding.UTF8, "application/json")
            let resp = client.PostAsync("embeddings", content).Result
            if not resp.IsSuccessStatusCode then
                let msg = resp.Content.ReadAsStringAsync().Result
                failwithf "Embeddings 失敗（HTTP %d）：%s" (int resp.StatusCode) msg
            let json = resp.Content.ReadAsStringAsync().Result
            use doc = JsonDocument.Parse(json)
            let root = doc.RootElement
            let data = root.GetProperty("data")
            let first =
                data.EnumerateArray()
                |> Seq.tryHead
            match first with
            | None -> failwith "Embeddings 回應中沒有 data"
            | Some item ->
                let emb = item.GetProperty("embedding")
                emb.EnumerateArray() |> Seq.map (fun v -> v.GetDouble() |> float) |> Seq.toArray

    module Qdrant =
        let private jsonOptions =
            JsonSerializerOptions(PropertyNamingPolicy = JsonNamingPolicy.CamelCase, WriteIndented = false)

        let getEndpoint () =
            getEnv "QDRANT_ENDPOINT"
            |> Option.filter (String.IsNullOrWhiteSpace >> not)
            |> Option.defaultValue "http://qdrant:6333"
            |> fun s -> if s.EndsWith("/") then s else s + "/"

        type SearchResult =
            { Path: string option
              Text: string option
              Score: float }

        let search (collection: string) (vector: float[]) (topK: int) : SearchResult list =
            use client =
                let baseUri = Uri(getEndpoint ())
                let c = new HttpClient(BaseAddress = baseUri)
                c.Timeout <- TimeSpan.FromSeconds(60.0)
                c
            let body =
                {| vector = vector
                   limit = topK
                   with_payload = true
                   with_vectors = false |}
            use content = new StringContent(JsonSerializer.Serialize(body, jsonOptions), Encoding.UTF8, "application/json")
            let url = sprintf "collections/%s/points/search" collection
            let resp = client.PostAsync(url, content).Result
            if not resp.IsSuccessStatusCode then
                let msg = resp.Content.ReadAsStringAsync().Result
                failwithf "Qdrant 搜尋失敗（HTTP %d）：%s" (int resp.StatusCode) msg
            let json = resp.Content.ReadAsStringAsync().Result
            use doc = JsonDocument.Parse(json)
            let root = doc.RootElement
            if not (root.TryGetProperty("result") |> fst) then
                []
            else
                root.GetProperty("result").EnumerateArray()
                |> Seq.map (fun hit ->
                    let score = hit.GetProperty("score").GetDouble() |> float
                    let payload =
                        if hit.TryGetProperty("payload") |> fst then hit.GetProperty("payload")
                        else JsonElement()
                    let tryGetString (name: string) =
                        if payload.ValueKind = JsonValueKind.Object && payload.TryGetProperty(name) |> fst then
                            let v = payload.GetProperty(name)
                            if v.ValueKind = JsonValueKind.String then Some (v.GetString())
                            else None
                        else None
                    { Path = tryGetString "path"
                      Text = tryGetString "text"
                      Score = score })
                |> Seq.toList

/// RAG Plugin：讓聊天可以指定 collectionName + 問題，查 Qdrant 並回傳相關內容摘要。
type RagPlugin() =

    [<KernelFunction("QdrantSearch")>]
    [<Description("對指定 Qdrant collection 進行語意搜尋。會先用 Embeddings 對 query 產生向量，再呼叫 Qdrant search，回傳前幾筆結果的路徑與內容摘要。")>]
    member _.QdrantSearch(
        [<Description("Qdrant 的 collection 名稱，例如 my_docs_collection")>] collectionName: string,
        [<Description("使用者的查詢問題或關鍵字")>] query: string,
        [<Description("選填。要取回的筆數，預設 5")>] ?topK: int
    ) : string =
        let coll = collectionName |> Option.ofObj |> Option.defaultValue "" |> fun s -> s.Trim()
        let q = query |> Option.ofObj |> Option.defaultValue "" |> fun s -> s.Trim()
        if String.IsNullOrWhiteSpace coll then
            "Error: collectionName 為必填"
        elif String.IsNullOrWhiteSpace q then
            "Error: query 為必填"
        else
            let k = defaultArg topK 5 |> max 1 |> min 20
            try
                let vec = RagPluginImpl.Embedding.generateOne q
                let hits = RagPluginImpl.Qdrant.search coll vec k
                if List.isEmpty hits then
                    sprintf "在 collection '%s' 中找不到與「%s」相關的內容。" coll q
                else
                    let lines = ResizeArray<string>()
                    lines.Add(sprintf "Qdrant collection '%s' 查詢：「%s」" coll q)
                    lines.Add(sprintf "共取得 %d 筆結果（僅列前 %d 筆）：" hits.Length (min k hits.Length))
                    hits
                    |> List.truncate k
                    |> List.iteri (fun i h ->
                        let path = h.Path |> Option.defaultValue "(無 path)"
                        let text =
                            h.Text
                            |> Option.defaultValue ""
                            |> fun t -> if t.Length > 300 then t.Substring(0, 300) + "..." else t
                        lines.Add(sprintf "[%d] score=%.4f" (i + 1) h.Score)
                        lines.Add(sprintf "    path: %s" path)
                        if not (String.IsNullOrWhiteSpace text) then
                            lines.Add(sprintf "    text: %s" text))
                    String.concat "\n" lines
            with ex ->
                "Error: " + ex.Message

