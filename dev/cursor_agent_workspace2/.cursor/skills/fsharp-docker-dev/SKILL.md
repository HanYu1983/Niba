---
name: fsharp-docker-dev
description: Sets up F# development in Docker with the .NET 8 SDK, including multi-project solutions and shared library projects. Use for F# containers, docker-compose, dotnet fsi, or build/run/test across entry apps and common projects.
---

# F# Docker 開發環境

## 何時使用

- 使用者要在 Docker 裡開發 / 執行 F#（無本機 SDK）
- 需要可重現的 `docker-compose` 服務定義
- 要互動式 `bash` + `dotnet fsi` 或在本機目錄上 `dotnet build` / `dotnet run`
- 同一 repo 內有多個 F# 專案（例如入口程式＋共用函式庫＋測試）

## 建議映像與掛載

- **映像**：`mcr.microsoft.com/dotnet/sdk:8.0`（含 `dotnet` CLI 與 F#）
- **工作目錄**：容器內 `/app`
- **掛載**：專案根目錄 `.` → `/app`（程式碼在宿主與容器同步）
- **互動**：`stdin_open: true`、`tty: true`，並以 `exec bash` 保持 shell 常駐

## docker-compose 片段

將下列服務合併進專案的 `docker-compose.yml`（或 `docker-compose.override.yml`），並在**專案根目錄**執行 compose：

```yaml
services:
  fsharp-dev:
    image: mcr.microsoft.com/dotnet/sdk:8.0
    container_name: fsharp-dev
    working_dir: /app
    volumes:
      - .:/app
    stdin_open: true
    tty: true
    command:
      [
        "bash",
        "-c",
        "dotnet --version && echo '--- F# 開發環境就緒。可用: dotnet fsi, dotnet run, dotnet build ---' && exec bash",
      ]
```

## 常用指令（代理應代使用者執行時）

在專案根目錄：

```bash
docker compose run --rm fsharp-dev dotnet --version
docker compose run --rm fsharp-dev dotnet build
docker compose run --rm fsharp-dev dotnet run --project path/to/Your.fsproj
```

互動式 F# REPL（需 TTY）：

```bash
docker compose run --rm -it fsharp-dev dotnet fsi
```

長駐開發 shell（與 compose 中 `tty`/`stdin_open` 搭配）：

```bash
docker compose run --rm -it fsharp-dev bash
```

若使用 `docker compose up` 啟動該服務，需保留終端機附加（`-it` 行為依 compose 版本與服務設定而定）；**一鍵指令**時優先 `docker compose run --rm -it`。

## 多專案與共用專案

掛載後容器內 **`working_dir` 即 repo 根目錄**（例如 `/app`）。多專案時在根目錄放 solution（`*.sln`），各專案為子資料夾；**共用邏輯**放在類似 `Common` 的類別庫，入口程式（如 `Entry1`）的 `.fsproj` 以 `<ProjectReference Include="..\Common\Common.fsproj" />`（路徑依實際結構調整）引用。建置順序由 SDK 依參考關係解析，無需手動先編譯 Common。

以下假設在 **repo 根** 執行 `docker compose`，且 compose 服務名為 `fsharp-dev`（若命名為 `run-sk` 等，將指令中的服務名一併替換即可）。

```bash
# 執行各專案（--project 可為資料夾路徑，SDK 會找其中的 .fsproj）
docker compose run --rm fsharp-dev dotnet run --project Entry1
docker compose run --rm fsharp-dev dotnet run --project Common   # 僅當 Common 為可執行專案；若為類別庫請改 build 或從 Entry1 run

# 執行測試（測試專案資料夾或專案名，依 repo 而定）
docker compose run --rm fsharp-dev dotnet test Common.Tests

# 建置指定專案
docker compose run --rm fsharp-dev dotnet build Entry1/Entry1.fsproj
```

可選：在根目錄對整個 solution 一次建置或測試：

```bash
docker compose run --rm fsharp-dev dotnet build YourSolution.sln
docker compose run --rm fsharp-dev dotnet test YourSolution.sln
```

## 新專案（可選）

在容器內從空白建立主控台應用：

```bash
docker compose run --rm fsharp-dev dotnet new console -lang F# -n MyApp -o MyApp
```

## 注意事項

- 掛載目錄權限：Linux/macOS 上容器內建立之檔案可能屬 root，必要時調整 UID/GID 或使用命名卷策略（進階）。
- SDK 版本鎖在 `8.0`；若要升級，僅需改 `image` tag（例如 `9.0`）並確認專案 `TargetFramework` 相容。
