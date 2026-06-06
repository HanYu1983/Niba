# Haxe HelloWorld with Docker Compose

這個專案使用 Docker Compose 建立 Haxe 命令列環境，並將 `src/HelloWorld.hx` 編譯成 JavaScript。

## 專案結構

```text
Project19/
├── docker-compose.yml
├── build.hxml
├── src/
│   └── HelloWorld.hx
└── bin/
    └── HelloWorld.js
```

## 啟動容器

`docker-compose.yml` 包含兩個服務:

- `haxe` (`haxe:4.3`)：負責 Haxe 編譯
- `node` (`node:22`)：負責執行編譯後的 JavaScript (主機沒裝 Node.js 時的備援)

```powershell
docker compose up -d
```

## 使用 Haxe 編譯為 JavaScript

使用 `build.hxml` 編譯：

```powershell
docker compose exec haxe haxe build.hxml
```

或直接使用 Haxe 命令列參數：

```powershell
docker compose exec haxe haxe -cp src -main HelloWorld -js bin/HelloWorld.js
```

編譯完成後會產生：

```text
bin/HelloWorld.js
```

## 執行編譯結果

### 主機已安裝 Node.js

編譯後直接於 PowerShell 執行：

```powershell
node .\bin\HelloWorld.js
```

### 主機未安裝 Node.js (使用 docker-compose 的 node 服務)

`haxe:4.3` 官方映像檔不含 Node.js，因此在 `docker-compose.yml` 額外提供了 `node` 服務 (`node:22`) 作為執行環境。
透過 `docker compose exec node` 即可在容器內執行編譯後的 JS：

```powershell
docker compose exec node node ./bin/HelloWorld.js
```

> 開發迴圈通常是「容器內 `haxe build.hxml` 編譯 → 主機或 `node` 容器執行 JS」。
> 兩個服務共用同一個 `./:/workspace` volume，所以 `haxe` 容器編譯出的 `bin/HelloWorld.js` 可以直接被 `node` 容器讀到。

## 進入容器

進入 Haxe 容器 (編譯用):

```powershell
docker compose exec haxe bash
```

進入 Node 容器 (執行用):

```powershell
docker compose exec node bash
```

## 關閉容器

```powershell
docker compose down
```
