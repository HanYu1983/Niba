namespace HelloSk.PdfToMd

open System
open System.IO
open UglyToad.PdfPig
open UglyToad.PdfPig.Content

module Program =

    /// 將 PDF 轉成 Markdown：擷取每頁文字與圖片，輸出 .md 及圖片檔（存於同名的 _images 資料夾）。
    /// 用法：dotnet run --project HelloSk.PdfToMd -- <pdf路徑> [輸出目錄]
    /// 若未指定輸出目錄，則 .md 與 _images 寫在 PDF 所在目錄。
    let convertPdfToMd (pdfPath: string) (outputDir: string) : unit =
        if not (File.Exists pdfPath) then
            failwithf "檔案不存在：%s" pdfPath

        let pdfDir = Path.GetDirectoryName(Path.GetFullPath(pdfPath))
        let baseName = Path.GetFileNameWithoutExtension(pdfPath)
        let outDir = if String.IsNullOrWhiteSpace outputDir then pdfDir else outputDir
        let imagesDir = Path.Combine(outDir, baseName + "_images")
        Directory.CreateDirectory(imagesDir) |> ignore

        let mdPath = Path.Combine(outDir, baseName + ".md")
        use doc = PdfDocument.Open(pdfPath)
        let pages = doc.GetPages() |> Seq.toArray
        let sb = System.Text.StringBuilder()

        for pageIndex in 0 .. pages.Length - 1 do
            let page = pages.[pageIndex]
            let pageNum = pageIndex + 1
            sb.AppendLine(sprintf "## 第 %d 頁" pageNum) |> ignore
            sb.AppendLine() |> ignore

            // 文字：頁面 Text 屬性
            let text = page.Text
            if not (String.IsNullOrWhiteSpace text) then
                sb.AppendLine(text.Trim()) |> ignore
                sb.AppendLine() |> ignore

            // 圖片：GetImages() 擷取，存檔並在 md 中引用
            let images = page.GetImages() |> Seq.toArray
            for imgIndex in 0 .. images.Length - 1 do
                let img = images.[imgIndex]
                let ext, bytes =
                    match img.TryGetPng() with
                    | true, pngBytes -> ".png", Array.ofSeq pngBytes
                    | false, _ ->
                        let rawArr = Array.ofSeq img.RawBytes
                        if rawArr.Length >= 2 && rawArr.[0] = 0xFFuy && rawArr.[1] = 0xD8uy then ".jpg", rawArr
                        else ".png", rawArr
                let imgFileName = sprintf "page%d_img%d%s" pageNum (imgIndex + 1) ext
                let imgPath = Path.Combine(imagesDir, imgFileName)
                File.WriteAllBytes(imgPath, bytes)
                let relativePath = Path.Combine(baseName + "_images", imgFileName).Replace("\\", "/")
                sb.AppendLine(sprintf "![第 %d 頁 圖 %d](%s)" pageNum (imgIndex + 1) relativePath) |> ignore
                sb.AppendLine() |> ignore

        File.WriteAllText(mdPath, sb.ToString(), System.Text.Encoding.UTF8)
        printfn "已輸出：%s" mdPath
        printfn "圖片目錄：%s" imagesDir

    [<EntryPoint>]
    let main argv =
        if argv.Length < 1 then
            printfn "用法：dotnet run --project HelloSk.PdfToMd -- <PDF路徑> [輸出目錄]"
            printfn "範例：dotnet run --project HelloSk.PdfToMd -- ./doc.pdf ./output"
            1
        else
            try
                let pdfPath = argv.[0]
                let outputDir = if argv.Length >= 2 then argv.[1] else ""
                convertPdfToMd pdfPath outputDir
                0
            with ex ->
                printfn "錯誤：%s" ex.Message
                match ex.InnerException with
                | null -> ()
                | inner -> printfn "內層：%s" inner.Message
                1
