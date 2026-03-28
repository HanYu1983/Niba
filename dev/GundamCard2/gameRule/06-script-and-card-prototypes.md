# 06 — Script 層與卡牌原型

## 程式依據

- 載入入口：`bun/src/script/index.ts`（`loadPrototype`、`importJson`）。  
- 型別：`bun/src/game/define/CardPrototype.ts`、`CardText.ts`。  
- 測試／範例腳本：`bun/src/script/ext/*.ts`（編譯可到 `bun/public/ext`）。

## `loadPrototype` 資料流

1. 以 `imgID` 查快取 `_preloadPrototype`。  
2. 若 ID 含 `_`，拆出產品編號與 `info_25` 鍵，從 `./data/${prodid}.json` 讀取陣列並比對 `info_25`。  
3. 將 JSON 欄位對應到 `CardPrototype`：標題、類別（`UNIT`→`ユニット` 等）、費用、G 簽、戰鬥力三格、`battleArea`（地球／宇宙字串映射）、特性、卡色、稀有度等。  
4. 牌面文字 `info_12` 以前 60 字做關鍵字與費用列解析，產出 `CardText[]`（含顏色／ロール費標記、特殊詞如 高機動、速攻、強襲 等）。

## 類別（`CardCategory`）

程式支援：`ユニット`、`キャラクター`、`コマンド`、`オペレーション`、`オペレーション(ユニット)`、`ACE`、`グラフィック`。  

**執行時例外**：在 **Gゾーン** 上的項目 `getItemRuntimeCategory` 會回傳 **グラフィック**，與底層原型類別無關。

## `script/ext`

- 大量以卡號命名的檔案，供單卡測試或額外邏輯擴充；與核心規則引擎以 **bridge**（`bun/src/script/bridge.ts`）連接效果字串中的可執行片段。

## 與其它規則的橫向檢查

- **與 03／04**：`battleArea` 決定可出擊區域；特殊關鍵字（速攻、強襲、高機動）影響傷害與出擊篩選——若 JSON 解析漏字，規則行為會與紙卡不一致，屬**資料層**風險而非戰鬥公式錯誤。  
- **與 05**：`protectLevel`、クイック 等依文字結構進入效果系統；若 `loadPrototype` 未辨識，則行為缺失。

## 第二輪補遺

- **文字解析**：正則與長度閾值（如 `< 20` 才做特殊詞檢查）屬**實作品質**細節；完整規則以遊戲內實際載入結果為準。  
- **橋接函式**：效果內嵌字串透過 `.toString()` 還原並在執行環境呼叫 `GameStateFn`——修改規則時需同步測試已序列化的舊存檔是否相容（若專案有持久化）。
