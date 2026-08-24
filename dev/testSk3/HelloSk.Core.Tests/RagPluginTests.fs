module HelloSk.Core.Tests.RagPluginTests

open Xunit
open HelloSk.Core

/// 對 RagPlugin 做一些基本驗證與簡單整合測試。
module BasicValidation =

    [<Fact>]
    let ``collectionName 為空時應回傳錯誤訊息`` () =
        let rag = RagPlugin()
        let result = rag.QdrantSearch(null, "query", 5)
        Assert.Contains("collectionName 為必填", result)

    [<Fact>]
    let ``query 為空時應回傳錯誤訊息`` () =
        let rag = RagPlugin()
        let result = rag.QdrantSearch("my_collection", "   ", 5)
        Assert.Contains("query 為必填", result)

    /// 需要 Qdrant 執行中，且 HelloSk.Rag 已將 ./docs 匯入 my_docs_collection。
    /// 驗證：對 my_docs_collection 查詢與 RAG 相關內容時，應取得至少一筆結果，而不是「找不到」或 Error。
    [<Fact>]
    let ``QdrantSearch my_docs_collection 對 RAG 查詢應有結果`` () =
        let rag = RagPlugin()
        // 查詢字串可與你在 docs 中實際談 RAG 的內容相近
        let result = rag.QdrantSearch("my_docs_collection5", "第 10 章", 5)
        Assert.DoesNotContain("Error:", result)
        Assert.DoesNotContain("找不到與", result)

