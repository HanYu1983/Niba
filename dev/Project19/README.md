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

## 啟動 Haxe 容器

```powershell
docker compose up -d
```

## 安裝所需 Haxe libraries

`rxhaxe` 不在 haxelib registry 上, 需由 GitHub 安裝:

```powershell
docker compose exec haxe haxelib git rxhaxe https://github.com/longde123/RxHaxe.git
```

## 使用 Haxe 編譯為 JavaScript

使用 `build.hxml` 編譯：

```powershell
docker compose exec haxe haxe build.hxml
```

若程式碼使用 `rxhaxe`, 編譯時需加上 `-lib rxhaxe`：

```powershell
docker compose exec haxe haxe -lib rxhaxe build.hxml
```

或直接使用 Haxe 命令列參數：

```powershell
docker compose exec haxe haxe -lib rxhaxe -cp src -main HelloWorld -js bin/HelloWorld.js
```

編譯完成後會產生：

```text
bin/HelloWorld.js
```

## 在主機執行編譯結果

本機已安裝 Node.js，編譯後直接於 PowerShell 執行：

```powershell
node .\bin\HelloWorld.js
```

> 註: `haxe:4.3` 官方映像檔不含 Node.js，所以執行 JS 走主機端而不是容器內。
> 開發迴圈通常是「容器內 `haxe build.hxml` 編譯 → 主機 `node .\bin\HelloWorld.js` 執行」。

## 進入容器

```powershell
docker compose exec haxe bash
```

## 關閉容器

```powershell
docker compose down
```
