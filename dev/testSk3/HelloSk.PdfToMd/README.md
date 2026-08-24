# HelloSk.PdfToMd

以 F# 程式化將指定 PDF 轉成 Markdown，包含內嵌圖片。

## 依賴

- **UglyToad.PdfPig**：擷取 PDF 文字與圖片。

## 用法

```bash
dotnet run --project HelloSk.PdfToMd -- <PDF路徑> [輸出目錄]
```

- **PDF路徑**：要轉換的 .pdf 檔案。
- **輸出目錄**（選填）：若未指定，則 .md 與圖片資料夾寫在 PDF 所在目錄。

## 輸出

- `<檔名>.md`：Markdown 檔，每頁為 `## 第 N 頁`，接該頁文字與圖片引用。
- `<檔名>_images/`：該 PDF 擷取出的圖片（`pageN_imgM.png` 或 `.jpg`），在 .md 中以相對路徑引用。

## 範例

```bash
dotnet run --project HelloSk.PdfToMd -- ./doc.pdf
# 產生 ./doc.md 與 ./doc_images/

dotnet run --project HelloSk.PdfToMd -- ./doc.pdf ./output
# 產生 ./output/doc.md 與 ./output/doc_images/
```

## Docker

在 repo 根目錄：

```bash
docker compose run --rm run-sk dotnet run --project HelloSk.PdfToMd -- /app/某路徑/file.pdf
```
