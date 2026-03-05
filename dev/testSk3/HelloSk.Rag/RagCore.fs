namespace HelloSk.Rag

open System
open System.IO
open System.Net.Http
open System.Text
open System.Text.Json
open System.Threading.Tasks
open Microsoft.Extensions.AI
open Microsoft.Extensions.DependencyInjection
open Microsoft.SemanticKernel
open Microsoft.SemanticKernel.Connectors.OpenAI
open Microsoft.SemanticKernel.Embeddings

type CleanChunk =
    { Path: string
      Index: int
      Text: string }

module private Env =
    let getEnv (key: string) =
        match Environment.GetEnvironmentVariable key with
        | null
        | "" -> None
        | v -> Some v

module Utils =
    let normalizeNewlines (s: string) =
        s.Replace("\r\n", "\n").Replace("\r", "\n")

    let splitToParagraphs (text: string) =
        let t = normalizeNewlines text
        t.Split("\n\n", StringSplitOptions.RemoveEmptyEntries)
        |> Array.map (fun p -> p.Trim())
        |> Array.filter (fun p -> not (String.IsNullOrWhiteSpace p))

    /// 依大致長度合併段落成 chunk（最簡版）
    let paragraphsToChunks (path: string) (paragraphs: string[]) (targetLen: int) : CleanChunk list =
        let chunks = ResizeArray<CleanChunk>()
        let mutable buf = StringBuilder()
        let mutable idx = 0
        for p in paragraphs do
            if buf.Length = 0 then
                buf.Append(p) |> ignore
            elif buf.Length + 2 + p.Length <= targetLen then
                buf.Append("\n\n").Append(p) |> ignore
            else
                chunks.Add({ Path = path; Index = idx; Text = buf.ToString() })
                idx <- idx + 1
                buf.Clear().Append(p) |> ignore
        if buf.Length > 0 then
            chunks.Add({ Path = path; Index = idx; Text = buf.ToString() })
        List.ofSeq chunks

module Embedding =
    let private getConfig () =
        let apiKey = Env.getEnv "OPENROUTER_API_KEY" |> Option.defaultValue ""
        let baseUrl =
            Env.getEnv "OPENROUTER_BASE_URL"
            |> Option.filter (String.IsNullOrWhiteSpace >> not)
            |> Option.defaultValue "https://openrouter.ai/api/v1"
        let modelId =
            Env.getEnv "OPENROUTER_EMBED_MODEL"
            |> Option.filter (String.IsNullOrWhiteSpace >> not)
            |> Option.orElse (Env.getEnv "OPENROUTER_MODEL")
            |> Option.defaultValue "text-embedding-3-large"
        baseUrl, apiKey, modelId

    /// 使用新 API IEmbeddingGenerator：以舊版 AddOpenAITextEmbeddingGeneration 註冊（支援自訂 endpoint）後以 AsEmbeddingGenerator 轉成 IEmbeddingGenerator
    let private generator =
        lazy
            (let baseUrl, apiKey, modelId = getConfig ()
             let normalizedBase = if baseUrl.EndsWith("/") then baseUrl else baseUrl + "/"
             let endpoint = Uri(normalizedBase)
             let httpClient = new HttpClient(BaseAddress = endpoint, Timeout = TimeSpan.FromSeconds(120.0))
             let builder = Kernel.CreateBuilder()
             builder.AddOpenAITextEmbeddingGeneration(modelId, apiKey, null, null, httpClient) |> ignore
             let kernel = builder.Build()
             let oldService = kernel.Services.GetRequiredService<ITextEmbeddingGenerationService>()
             oldService.AsEmbeddingGenerator())

    /// 使用新 API IEmbeddingGenerator.GenerateAsync 產生向量
    let generateEmbeddings (texts: string list) : float[][] =
        if List.isEmpty texts then
            [||]
        else
            try
                let gen = generator.Value
                let task = gen.GenerateAsync(texts)
                let embeddings = task.GetAwaiter().GetResult()
                embeddings
                |> Seq.map (fun (e: Embedding<float32>) -> e.Vector.ToArray() |> Array.map float)
                |> Seq.toArray
            with
            | :? TaskCanceledException as ex ->
                failwithf "Embeddings 呼叫逾時或被取消：%s" ex.Message
            | :? HttpRequestException as ex ->
                failwithf "Embeddings 連線錯誤：%s" ex.Message
            | ex ->
                failwithf "Embeddings 未預期錯誤：%s" ex.Message

    /// 對單一文字產生一個 embedding 向量
    let generateOne (text: string) : float[] =
        let vectors = generateEmbeddings [ text ]
        if vectors.Length = 0 then
            failwith "generateOne：產生向量數量為 0"
        else
            vectors.[0]

module Qdrant =
    let private jsonOptions =
        JsonSerializerOptions(PropertyNamingPolicy = JsonNamingPolicy.CamelCase, WriteIndented = false)
    /// Qdrant API 使用 snake_case，搜尋請求欄位名需與文件一致
    let private jsonOptionsSnake =
        JsonSerializerOptions(PropertyNamingPolicy = null, WriteIndented = false)

    let getEndpoint () =
        Env.getEnv "QDRANT_ENDPOINT"
        |> Option.filter (String.IsNullOrWhiteSpace >> not)
        |> Option.defaultValue "http://qdrant:6333"
        |> fun s -> if s.EndsWith("/") then s else s + "/"

    /// 刪除指定 collection（測試用；若不存在則忽略）
    let deleteCollection (client: HttpClient) (collection: string) =
        let url = sprintf "collections/%s" collection
        try
            use req = new HttpRequestMessage(HttpMethod.Delete, url)
            let resp = client.Send(req)
            if not resp.IsSuccessStatusCode && resp.StatusCode <> System.Net.HttpStatusCode.NotFound then
                let msg = resp.Content.ReadAsStringAsync().Result
                printfn "Qdrant 刪除 collection 警告（HTTP %d）：%s" (int resp.StatusCode) msg
        with
        | :? HttpRequestException as ex -> printfn "Qdrant 刪除 collection 連線錯誤：%s" ex.Message

    let createCollectionIfNeeded (client: HttpClient) (collection: string) (dim: int) =
        try
            let url = sprintf "collections/%s" collection
            let body =
                {| vectors = {| size = dim; distance = "Cosine" |} |}
            use content = new StringContent(JsonSerializer.Serialize(body, jsonOptions), Encoding.UTF8, "application/json")
            let resp = client.PutAsync(url, content).Result
            if not resp.IsSuccessStatusCode
               && resp.StatusCode <> System.Net.HttpStatusCode.BadRequest
               && resp.StatusCode <> System.Net.HttpStatusCode.Conflict then
                let msg = resp.Content.ReadAsStringAsync().Result
                failwithf "建立 Qdrant collection 失敗（HTTP %d）：%s" (int resp.StatusCode) msg
        with
        | :? TaskCanceledException as ex ->
            failwithf "Qdrant 建立 collection 逾時或被取消：%s" ex.Message
        | :? HttpRequestException as ex ->
            failwithf "Qdrant 建立 collection 連線錯誤：%s" ex.Message

    let upsertChunks (client: HttpClient) (collection: string) (vectors: float[][]) (chunks: CleanChunk list) =
        if vectors.Length <> chunks.Length then
            failwithf "向量數量 (%d) 與 chunks 數量 (%d) 不一致" vectors.Length chunks.Length

        let ids =
            chunks
            |> List.map (fun _ -> Guid.NewGuid().ToString())
            |> List.toArray

        let payloads =
            chunks
            |> List.map (fun chunk ->
                {| path = chunk.Path
                   chunk_index = chunk.Index
                   text = chunk.Text |})
            |> List.toArray

        let batch = {| ids = ids; vectors = vectors; payloads = payloads |}
        let body = {| batch = batch |}
        use content = new StringContent(JsonSerializer.Serialize(body, jsonOptions), Encoding.UTF8, "application/json")
        let url = sprintf "collections/%s/points?wait=true" collection
        use req = new HttpRequestMessage(HttpMethod.Put, url)
        req.Content <- content
        let resp = client.Send(req)
        if not resp.IsSuccessStatusCode then
            let msg = resp.Content.ReadAsStringAsync().Result
            failwithf "寫入 Qdrant 失敗（HTTP %d）：%s" (int resp.StatusCode) msg

    type SearchHit =
        { Path: string option
          Text: string option
          Score: float }

    let search (client: HttpClient) (collection: string) (vector: float[]) (topK: int) : SearchHit list =
        let body =
            {| vector = vector
               limit = topK
               with_payload = true
               with_vector = false |}
        use content = new StringContent(JsonSerializer.Serialize(body, jsonOptionsSnake), Encoding.UTF8, "application/json")
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
