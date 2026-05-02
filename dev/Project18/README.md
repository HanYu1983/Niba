# Project18（Haxe）

以 Docker 提供 Haxe 工具鏈；原始碼在 `src`，Apache Ant 的 `build.xml` 描述編譯步驟。

**遊戲骨架與擴充內容的分工**：見 [`GAME_DEV_GUIDE.md`](GAME_DEV_GUIDE.md)。

## 事前準備

- **Docker Compose**：請先啟動 Docker Desktop（或你的 Docker 引擎），再執行下方指令。
- **選用**：若本機已安裝 [Apache Ant](https://ant.apache.org/) 與 `haxe`，可直接在本機執行 `ant`，無需容器。

## 專案結構（摘要）

| 路徑 | 說明 |
|------|------|
| `src/` | 類路徑（`-cp src`） |
| `src/HelloWorld.hx` | 進入點（`-main HelloWorld`） |
| `bin/hello.js` | 編譯輸出（JavaScript） |
| `build.xml` | Ant：`build` / `clean` |
| `docker-compose.yml` | Haxe 容器；工作目錄 `/workspace`，掛載目前專案根目錄 |

## Docker Compose（建議）

在專案根目錄執行（Windows PowerShell 亦同）。

檢查 Haxe 版本：

```powershell
docker compose run --rm haxe haxe --version
```

與 `build.xml` 相同的編譯指令：

```powershell
docker compose run --rm haxe haxe -cp src -main HelloWorld -js bin/hello.js
```

進入容器 shell（工作目錄為掛載後的 `/workspace`）：

```powershell
docker compose run --rm haxe bash
```

容器內使用 `haxelib` 範例：

```powershell
docker compose run --rm haxe haxelib install <庫名稱>
```

## Apache Ant（本機）

需已將 `ant` 與 `haxe` 加入 PATH。

```powershell
ant              # 等同 ant build：建立 bin 並編譯為 bin/hello.js
ant clean        # 刪除 bin 目錄
```

## 本機直接編譯（不安裝 Ant）

若本機已安裝 Haxe：

```powershell
haxe -cp src -main HelloWorld -js bin/hello.js
```

（請先確保 `bin` 目錄存在，或使用 Ant 的 `prepare`／自行建立 `bin`。）

## 執行產生的 JavaScript

需已安裝 Node.js：

```powershell
node bin/hello.js
```
