namespace HelloSk.Rag

open System
open System.IO
open System.Net.Http
open System.Net.Http.Headers
open System.Text
open System.Text.Json
open System.Threading.Tasks
open HelloSk.Core.Shared

type CleanChunk =
    { Path: string
      Index: int
      Text: string }

module private Utils =
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

module private Embedding =
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

    /// 呼叫 OpenAI 相容 /embeddings 產生向量（最簡版，不處理分頁）
    let generateEmbeddings (texts: string list) : float[][] =
        if List.isEmpty texts then [||] else
        let baseUrl, apiKey, modelId = getConfig ()
        try
            use client = new HttpClient()
            client.Timeout <- TimeSpan.FromSeconds(120.0)
            client.BaseAddress <- Uri(if baseUrl.EndsWith("/") then baseUrl else baseUrl + "/")
            if not (String.IsNullOrWhiteSpace apiKey) then
                client.DefaultRequestHeaders.Authorization <- AuthenticationHeaderValue("Bearer", apiKey)
            let body = {| model = modelId; input = texts |}
            use content = new StringContent(JsonSerializer.Serialize(body, jsonOptions), Encoding.UTF8, "application/json")
            let resp = client.PostAsync("embeddings", content).Result
            if not resp.IsSuccessStatusCode then
                let msg = resp.Content.ReadAsStringAsync().Result
                failwithf "Embeddings 失敗（HTTP %d）：%s" (int resp.StatusCode) msg
            let json = resp.Content.ReadAsStringAsync().Result
            use doc = JsonDocument.Parse(json)
            let root = doc.RootElement
            let data = root.GetProperty("data")
            data.EnumerateArray()
            |> Seq.map (fun item ->
                let emb = item.GetProperty("embedding")
                emb.EnumerateArray() |> Seq.map (fun v -> v.GetDouble() |> float) |> Seq.toArray)
            |> Seq.toArray
        with
        | :? TaskCanceledException as ex ->
            failwithf "Embeddings 呼叫逾時或被取消：%s" ex.Message
        | :? HttpRequestException as ex ->
            failwithf "Embeddings 連線錯誤：%s" ex.Message
        | ex ->
            failwithf "Embeddings 未預期錯誤：%s" ex.Message

module private Qdrant =
    let private jsonOptions =
        JsonSerializerOptions(PropertyNamingPolicy = JsonNamingPolicy.CamelCase, WriteIndented = false)

    let getEndpoint () =
        getEnv "QDRANT_ENDPOINT"
        |> Option.filter (String.IsNullOrWhiteSpace >> not)
        |> Option.defaultValue "http://qdrant:6333"
        |> fun s -> if s.EndsWith("/") then s else s + "/"

    let createCollectionIfNeeded (client: HttpClient) (collection: string) (dim: int) =
        try
            let url = sprintf "collections/%s" collection
            let body =
                {| vectors = {| size = dim; distance = "Cosine" |} |}
            use content = new StringContent(JsonSerializer.Serialize(body, jsonOptions), Encoding.UTF8, "application/json")
            let resp = client.PutAsync(url, content).Result
            // 若已存在會回錯誤（例如 400 / 409），但最簡版先忽略；只要不是嚴重連線錯誤即可
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
        // 使用 Qdrant PointsBatch 格式：ids + vectors + payloads（與 Qdrant 錯誤訊息相符）
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

        let body = {| ids = ids; vectors = vectors; payloads = payloads |}
        use content = new StringContent(JsonSerializer.Serialize(body, jsonOptions), Encoding.UTF8, "application/json")
        let url = sprintf "collections/%s/points?wait=true" collection
        let resp = client.PostAsync(url, content).Result
        if not resp.IsSuccessStatusCode then
            let msg = resp.Content.ReadAsStringAsync().Result
            failwithf "寫入 Qdrant 失敗（HTTP %d）：%s" (int resp.StatusCode) msg

module Program =

    /// 自我測試：寫入一段固定中文到指定 collection，然後用該文字查詢；
    /// 若 Qdrant 沒有回任何結果，就丟出錯誤。
    let private runSelfTest (collection: string) =
        printfn "=== RAG 自我測試：collection = %s ===" collection

        let testText =
            "這是一段用來測試 RAG 管線的中文文字，用來確認寫入向量與查詢是否正常運作。"

        // 準備單一 chunk
        let chunk =
            { Path = "self-test"
              Index = 0
              Text = testText }

        // 產生向量並寫入 Qdrant
        let vectors = Embedding.generateEmbeddings [ testText ]
        if vectors.Length <> 1 then
            failwithf "自我測試：產生向量數量異常（預期 1，實際 %d）" vectors.Length

        use http =
            let baseUri = Uri(Qdrant.getEndpoint ())
            let c = new HttpClient(BaseAddress = baseUri)
            c.Timeout <- TimeSpan.FromSeconds(60.0)
            c

        printfn "  建立或確認 Qdrant collection：%s（dim=%d）" collection vectors.[0].Length
        Qdrant.createCollectionIfNeeded http collection vectors.[0].Length

        printfn "  寫入 self-test chunk 到 Qdrant..."
        Qdrant.upsertChunks http collection vectors [ chunk ]

        // 立刻用該文字的前 80 字做查詢
        let snippet =
            let raw = testText.Trim()
            if raw.Length <= 80 then raw else raw.Substring(0, 80)

        printfn "  使用 snippet 檢索（前 %d 字）..." snippet.Length
        let queryVec = HelloSk.Core.RagPluginImpl.Embedding.generateOne snippet
        let hits = HelloSk.Core.RagPluginImpl.Qdrant.search collection queryVec 1
        if List.isEmpty hits then
            failwith "自我測試失敗：Qdrant 查不到剛寫入的 self-test chunk。"
        else
            let h = List.head hits
            printfn "  自我測試成功：score=%.4f path=%s" h.Score (h.Path |> Option.defaultValue "(無 path)")

        printfn "=== RAG 自我測試完成 ==="

    [<EntryPoint>]
    let main argv =
        if argv.Length >= 1 && argv.[0] = "--self-test" then
            // 用法：dotnet run --project HelloSk.Rag -- --self-test [collectionName]
            let collection = if argv.Length >= 2 then argv.[1] else "rag_self_test"
            try
                runSelfTest collection
                0
            with ex ->
                printfn "自我測試錯誤：%s" ex.Message
                match ex.InnerException with
                | null -> ()
                | inner -> printfn "內層錯誤：%s" inner.Message
                1
        elif argv.Length < 1 then
            printfn "用法：dotnet run --project HelloSk.Rag -- <資料夾> [collectionName]"
            printfn "或：   dotnet run --project HelloSk.Rag -- --self-test [collectionName]"
            1
        else
            let root = argv.[0]
            let collection = if argv.Length >= 2 then argv.[1] else "default_collection"
            if not (Directory.Exists root) then
                printfn "資料夾不存在：%s" root
                1
            else
                try
                    use http =
                        let baseUri = Uri(Qdrant.getEndpoint ())
                        let c = new HttpClient(BaseAddress = baseUri)
                        c.Timeout <- TimeSpan.FromSeconds(120.0)
                        c

                    // 掃描檔案（最簡版先處理 .txt / .md）
                    let files =
                        Directory.EnumerateFiles(root, "*.*", SearchOption.AllDirectories)
                        |> Seq.filter (fun p ->
                            let ext = Path.GetExtension(p).ToLowerInvariant()
                            ext = ".txt" || ext = ".md")
                        |> Seq.toList

                    if List.isEmpty files then
                        printfn "沒有可處理的檔案（僅支援 .txt / .md）"
                        0
                    else
                        let mutable created = false
                        for path in files do
                            printfn "開始處理檔案：%s" path
                            let text = File.ReadAllText(path, Encoding.UTF8)
                            let paras = Utils.splitToParagraphs text
                            let chunks = Utils.paragraphsToChunks path paras 2000
                            if List.isEmpty chunks then
                                printfn "檔案 %s 無有效內容，略過。" path
                            else
                                // 產生向量
                                printfn "  產生 embeddings（%d chunks）..." chunks.Length
                                let texts = chunks |> List.map (fun c -> c.Text)
                                let vectors = Embedding.generateEmbeddings texts

                                if not created && vectors.Length > 0 then
                                    created <- true
                                    printfn "  建立或確認 Qdrant collection：%s（dim=%d）" collection vectors.[0].Length
                                    Qdrant.createCollectionIfNeeded http collection vectors.[0].Length

                                printfn "  寫入 Qdrant..."
                                Qdrant.upsertChunks http collection vectors chunks
                                printfn "已匯入：%s (%d chunks)" path chunks.Length

                                // 逐一驗證每個 chunk：用該 chunk 的前幾十個字作為查詢，若查不到則視為錯誤
                                for chunk in chunks do
                                    let raw = if isNull chunk.Text then "" else chunk.Text.Trim()
                                    if raw.Length > 0 then
                                        let snippet =
                                            if raw.Length <= 80 then raw
                                            else raw.Substring(0, 80)

                                        printfn "  驗證 chunk #%d 檢索（截取前 %d 字）..." chunk.Index snippet.Length
                                        let vec =
                                            HelloSk.Core.RagPluginImpl.Embedding.generateOne snippet
                                        let hits =
                                            HelloSk.Core.RagPluginImpl.Qdrant.search collection vec 1
                                        if List.isEmpty hits then
                                            failwithf "Qdrant 查不到剛寫入的 chunk：%s (index=%d)" chunk.Path chunk.Index

                        printfn "完成匯入至 Qdrant collection '%s'。" collection
                        0
                with ex ->
                    printfn "錯誤：%s" ex.Message
                    match ex.InnerException with
                    | null -> ()
                    | inner -> printfn "內層錯誤：%s" inner.Message
                    1

