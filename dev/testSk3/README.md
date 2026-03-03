# HelloSk — F# 語義核心 AI 工作站

以 F# 與 [Semantic Kernel](https://learn.microsoft.com/semantic-kernel/) 打造的本地 AI 工作站，透過 OpenRouter 呼叫多種大語言模型。

## 環境需求

- **.NET 8 SDK**（本地開發）  
  或 **Docker**（使用本 repo 的 `docker-compose`）
- **OpenRouter API Key**：到 [OpenRouter](https://openrouter.ai/) 取得，並設定環境變數 `OPENROUTER_API_KEY`

## 專案結構

| 專案 | 說明 |
|------|------|
| **HelloSk.Core** | 共用核心：從環境變數建立 Kernel、呼叫 prompt（OpenRouter/OpenAI 相容） |
| **HelloSk** | 範例：印出「Hello, Semantic Kernel!」 |
| **HelloSk.Ask** | 命令列問答：依參數或預設問題呼叫 LLM |

## 快速開始

### 1. 設定 API Key

在專案根目錄建立或編輯 `.env`：

```bash
OPENROUTER_API_KEY=sk-or-v1-你的金鑰
# 可選
OPENROUTER_MODEL=minimax/minimax-m2.5
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
```

`docker-compose` 會自動讀取同目錄的 `.env`。

### 2. 建置方案

方案檔目前為 `HelloSk.sln_`，建置前請先更名：

```powershell
Rename-Item HelloSk.sln_ HelloSk.sln
dotnet build HelloSk.sln
```

或使用 Docker：

```bash
docker compose run --rm run-sk dotnet build HelloSk.sln
```

（若仍使用 `HelloSk.sln_`，請將上述指令改為 `HelloSk.sln_`。）

### 3. 執行

**本地（PowerShell）：**

```powershell
$env:OPENROUTER_API_KEY = "sk-or-v1-你的金鑰"
dotnet run --project HelloSk
dotnet run --project HelloSk.Ask
dotnet run --project HelloSk.Ask -- "用一句話解釋 F#"
```

**Docker：**

```bash
docker compose run --rm run-sk dotnet run --project HelloSk
docker compose run --rm run-sk dotnet run --project HelloSk.Ask -- "用一句話解釋 F#"
```

## 作為 AI 工作站的建議

1. **保護 API Key**：`.env` 不要提交到版控（已建議加入 `.gitignore`）。
2. **模型與用量**：在 `.env` 用 `OPENROUTER_MODEL` 切換模型；用量與計費以 OpenRouter 為準。
3. **擴充**：新功能可放在 `HelloSk.Core`（Kernel、prompt、plugins），再以新專案（如新的 Console 或 Web）呼叫。
4. **互動開發**：在專案目錄執行 `dotnet fsi`，可 `#load "HelloSk.Core/Shared.fs"` 後在 F# Interactive 裡試跑 prompt。

完成以上步驟後，本機即具備以 F# + Semantic Kernel 呼叫 OpenRouter LLM 的「AI 工作站」環境。
