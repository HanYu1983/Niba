namespace HelloSk.Rag

open System
open System.IO
open System.Net.Http
open System.Text
open System.Text.Json
open System.Threading.Tasks
open Microsoft.SemanticKernel
open Microsoft.SemanticKernel.Connectors.OpenAI
open Microsoft.SemanticKernel.Embeddings
open Microsoft.Extensions.DependencyInjection

/// 改寫自 test_qdrant_sk.py，本檔自包含：使用 OpenAITextEmbedding（SK）產生向量，自行實作 Qdrant HTTP，不引用同專案其它模組。
module TestQdrantSk =

    let [<Literal>] CollectionName = "sk_test_memory"
    let [<Literal>] SampleText1 = "Semantic Kernel 是微軟的 AI 編程框架，支援 plugins 與 planners。"
    let [<Literal>] SampleText2 = "Qdrant 是開源向量資料庫，適合做語意搜尋與 RAG。"
    let [<Literal>] SampleText3 = "Docker Compose 可一次啟動多個服務，例如 app 與 Qdrant。"
    let sampleTexts = [ SampleText1; SampleText2; SampleText3 ]
    let [<Literal>] SearchQuery = "向量資料庫與 RAG 用哪一個？"

    let private jsonOptions =
        JsonSerializerOptions(PropertyNamingPolicy = JsonNamingPolicy.CamelCase, WriteIndented = false)
    /// Qdrant API 使用 snake_case，搜尋時欄位名需與文件一致
    let private jsonOptionsSnake =
        JsonSerializerOptions(PropertyNamingPolicy = null, WriteIndented = false)

    let private getEnv (key: string) =
        match Environment.GetEnvironmentVariable key with
        | null | "" -> None
        | v -> Some v

    /// 使用 OpenAITextEmbedding（SK）建立 Kernel 並取得 ITextEmbeddingGenerationService，支援 OpenRouter 自訂 endpoint
    let private createEmbeddingService () : ITextEmbeddingGenerationService =
        let apiKey = getEnv "OPENROUTER_API_KEY" |> Option.defaultValue (getEnv "OPENAI_API_KEY" |> Option.defaultValue "")
        let baseUrl =
            getEnv "OPENROUTER_BASE_URL"
            |> Option.filter (String.IsNullOrWhiteSpace >> not)
            |> Option.defaultValue "https://openrouter.ai/api/v1"
        let modelId =
            getEnv "OPENROUTER_EMBED_MODEL"
            |> Option.filter (String.IsNullOrWhiteSpace >> not)
            |> Option.orElse (getEnv "OPENROUTER_EMBEDDING_MODEL")
            |> Option.orElse (getEnv "OPENROUTER_MODEL")
            |> Option.defaultValue "openai/text-embedding-3-small"

        if String.IsNullOrWhiteSpace apiKey then
            failwith "請設定 OPENROUTER_API_KEY 或 OPENAI_API_KEY（.env 或環境變數）。"

        let normalizedBase = if baseUrl.EndsWith("/") then baseUrl else baseUrl + "/"
        let endpoint = Uri(normalizedBase)
        let httpClient = new HttpClient(BaseAddress = endpoint, Timeout = TimeSpan.FromSeconds(120.0))
        let builder = Kernel.CreateBuilder()
        builder.AddOpenAITextEmbeddingGeneration(modelId, apiKey, null, null, httpClient) |> ignore
        let kernel = builder.Build()
        kernel.Services.GetRequiredService<ITextEmbeddingGenerationService>()

    /// 用 OpenAITextEmbedding 產生單一文字向量（float[]）
    let private generateOne (service: ITextEmbeddingGenerationService) (text: string) : float[] =
        let task = service.GenerateEmbeddingAsync(text)
        let mem = task.GetAwaiter().GetResult()
        mem.Span.ToArray() |> Array.map float

    /// 用 OpenAITextEmbedding 產生多筆文字向量（float[][]）
    let private generateMany (service: ITextEmbeddingGenerationService) (texts: string list) : float[][] =
        if List.isEmpty texts then [||] else
        let task = service.GenerateEmbeddingsAsync(List.toArray texts)
        let list = task.GetAwaiter().GetResult()
        list |> Seq.map (fun (m: ReadOnlyMemory<float32>) -> m.Span.ToArray() |> Array.map float) |> Seq.toArray

    /// Qdrant endpoint（本檔自讀環境變數）
    let private getQdrantEndpoint () =
        getEnv "QDRANT_ENDPOINT"
        |> Option.filter (String.IsNullOrWhiteSpace >> not)
        |> Option.orElse (getEnv "QDRANT_HOST" |> Option.map (fun h -> sprintf "http://%s:6333" h))
        |> Option.defaultValue "http://qdrant:6333"
        |> fun s -> if s.EndsWith("/") then s else s + "/"

    let private deleteCollection (client: HttpClient) (collection: string) =
        let url = sprintf "collections/%s" collection
        try
            use req = new HttpRequestMessage(HttpMethod.Delete, url)
            let resp = client.Send(req)
            if not resp.IsSuccessStatusCode && resp.StatusCode <> System.Net.HttpStatusCode.NotFound then
                let msg = resp.Content.ReadAsStringAsync().Result
                printfn "Qdrant 刪除 collection 警告（HTTP %d）：%s" (int resp.StatusCode) msg
        with :? HttpRequestException as ex -> printfn "Qdrant 刪除 collection 連線錯誤：%s" ex.Message

    let private createCollection (client: HttpClient) (collection: string) (dim: int) =
        let url = sprintf "collections/%s" collection
        let body = {| vectors = {| size = dim; distance = "Cosine" |} |}
        use content = new StringContent(JsonSerializer.Serialize(body, jsonOptions), Encoding.UTF8, "application/json")
        let resp = client.PutAsync(url, content).Result
        if not resp.IsSuccessStatusCode then
            let msg = resp.Content.ReadAsStringAsync().Result
            failwithf "建立 Qdrant collection 失敗（HTTP %d）：%s" (int resp.StatusCode) msg

    let private upsertPoints (client: HttpClient) (collection: string) (vectors: float[][]) (payloads: obj[]) =
        if vectors.Length <> payloads.Length then failwithf "向量數量 (%d) 與 payloads (%d) 不一致" vectors.Length payloads.Length
        let ids = Array.init vectors.Length (fun _ -> Guid.NewGuid().ToString())
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

    type SearchHit = { Text: string option; Score: float }

    let private search (client: HttpClient) (collection: string) (vector: float[]) (topK: int) : SearchHit list =
        let body = {| vector = vector; limit = topK; with_payload = true; with_vector = false |}
        use content = new StringContent(JsonSerializer.Serialize(body, jsonOptionsSnake), Encoding.UTF8, "application/json")
        let url = sprintf "collections/%s/points/search" collection
        let resp = client.PostAsync(url, content).Result
        if not resp.IsSuccessStatusCode then
            let msg = resp.Content.ReadAsStringAsync().Result
            failwithf "Qdrant 搜尋失敗（HTTP %d）：%s" (int resp.StatusCode) msg
        let json = resp.Content.ReadAsStringAsync().Result
        use doc = JsonDocument.Parse(json)
        let root = doc.RootElement
        if not (root.TryGetProperty("result") |> fst) then [] else
        root.GetProperty("result").EnumerateArray()
        |> Seq.map (fun hit ->
            let score = hit.GetProperty("score").GetDouble() |> float
            let text =
                if hit.TryGetProperty("payload") |> fst then
                    let payload = hit.GetProperty("payload")
                    if payload.TryGetProperty("text") |> fst then payload.GetProperty("text").GetString() |> Option.ofObj
                    else None
                else None
            { Text = text; Score = score })
        |> Seq.toList

    /// 執行測試：本檔內使用 OpenAITextEmbedding + 自實作 Qdrant HTTP，不引用其它檔案。
    let run () : int =
        try
            printfn "=== TestQdrantSk（自包含：OpenAITextEmbedding + Qdrant HTTP）==="

            let embeddingService = createEmbeddingService ()
            printfn "使用 OpenAITextEmbedding（SK）產生向量"

            let dimVec = generateOne embeddingService sampleTexts.[0]
            let dim = dimVec.Length
            printfn "Embedding 維度: %d" dim

            let endpoint = getQdrantEndpoint ()
            printfn "連線 Qdrant: %s" endpoint

            use http =
                let c = new HttpClient(BaseAddress = Uri(endpoint), Timeout = TimeSpan.FromSeconds(120.0))
                c

            deleteCollection http CollectionName
            createCollection http CollectionName dim

            let vectors = generateMany embeddingService sampleTexts
            let payloads =
                sampleTexts
                |> List.mapi (fun i text -> box {| text = text; index = i |})
                |> List.toArray
            upsertPoints http CollectionName vectors payloads
            printfn "已寫入 %d 筆到 collection: %s" sampleTexts.Length CollectionName

            let queryVector = generateOne embeddingService SearchQuery
            let hits = search http CollectionName queryVector 3

            printfn "\n搜尋: 「%s」" SearchQuery
            printfn "結果 (%d 筆):" hits.Length
            for h in hits do
                let text = h.Text |> Option.defaultValue "(無 text)"
                printfn "  score=%.4f  %s" h.Score text

            printfn "\n完成。"
            0
        with ex ->
            printfn "TestQdrantSk 錯誤：%s" ex.Message
            match ex.InnerException with
            | null -> ()
            | inner -> printfn "內層錯誤：%s" inner.Message
            1
