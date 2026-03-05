namespace HelloSk.Rag

open System
open System.IO
open System.Net.Http
open System.Text

module Program =

    /// 自我測試：寫入一段固定中文到指定 collection，然後用該文字查詢；
    /// 若 Qdrant 沒有回任何結果，就丟出錯誤。
    let private runSelfTest (collection: string) =
        printfn "=== RAG 自我測試：collection = %s ===" collection

        let testText =
            "這是一段用來測試 RAG 管線的中文文字，用來確認寫入向量與查詢是否正常運作。"

        let chunk =
            { Path = "self-test"
              Index = 0
              Text = testText }

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

        let snippet =
            let raw = testText.Trim()
            if raw.Length <= 80 then raw else raw.Substring(0, 80)

        printfn "  使用 snippet 檢索（前 %d 字）..." snippet.Length
        let queryVec = Embedding.generateOne snippet
        let hits = Qdrant.search http collection queryVec 1
        if List.isEmpty hits then
            failwith "自我測試失敗：Qdrant 查不到剛寫入的 self-test chunk。"
        else
            let h = List.head hits
            printfn "  自我測試成功：score=%.4f path=%s" h.Score (h.Path |> Option.defaultValue "(無 path)")

        printfn "=== RAG 自我測試完成 ==="

    [<EntryPoint>]
    let main argv =
        if argv.Length >= 1 && argv.[0] = "--self-test" then
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
        elif argv.Length >= 1 && argv.[0] = "--test-qdrant-sk" then
            TestQdrantSk.run ()
        elif argv.Length < 1 then
            printfn "用法：dotnet run --project HelloSk.Rag -- <資料夾> [collectionName]"
            printfn "或：   dotnet run --project HelloSk.Rag -- --self-test [collectionName]"
            printfn "或：   dotnet run --project HelloSk.Rag -- --test-qdrant-sk"
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

                                for chunk in chunks do
                                    let raw = if isNull chunk.Text then "" else chunk.Text.Trim()
                                    if raw.Length > 0 then
                                        let snippet =
                                            if raw.Length <= 80 then raw
                                            else raw.Substring(0, 80)

                                        printfn "  驗證 chunk #%d 檢索（截取前 %d 字）..." chunk.Index snippet.Length
                                        let vec = Embedding.generateOne snippet
                                        let hits = Qdrant.search http collection vec 1
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
