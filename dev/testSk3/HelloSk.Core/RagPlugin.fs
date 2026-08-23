namespace HelloSk.Core

open System
open System.ComponentModel
open HelloSk.Rag
open Microsoft.SemanticKernel

/// RAG Plugin：讓聊天可以指定 collectionName + 問題，查 Qdrant 並回傳相關內容摘要。
/// Embedding 與 Qdrant 搜尋直接使用 HelloSk.Rag 的實作（RagCore）。
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
                let vec = Embedding.generateOne q
                use http =
                    let baseUri = Uri(Qdrant.getEndpoint ())
                    let c = new System.Net.Http.HttpClient(BaseAddress = baseUri)
                    c.Timeout <- TimeSpan.FromSeconds(60.0)
                    c
                let hits = Qdrant.search http coll vec k
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
