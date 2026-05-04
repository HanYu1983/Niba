# GameMatchCore 重構約定（公開層 × 私有狀態）

本文件記錄 **`impl_ver1/GameMatchCore.hx`** 及同套件友元（`GameMatchVer1Ops`、`LuoshiJiCe` 等）在「維持綠燈、可長期維護」前提下的重構原則，與「把每個 `_欄位` 都改成薄 getter／setter」區隔開來。

---

## 1. 目標

1. **綠燈優先**：每次重構後須通過既有建置與測試（例如 `docker compose … haxe`、`node bin/hello.js`）。
2. **語意優先**：先將**依多欄位與完整步驟**組成的行為，收成**有名字的 `private` 方法**，並用註解依**狀態領域**分區（棋盤、君主／切片、格子事件、計策暫存、城池圖資、敵城對峙等），方便下一輪再拆。
3. **公開 API 只做綁定**：實作介面或對外入口時，**盡量只委派**到已寫好的私有方法；**邏輯先在「私欄位 + 私有方法」內完成**，再綁定。

---

## 2. 什麼「要」做到：優先委派給私有行為

下列類型的 **public**（或對外穩定）方法，**不應**在函式主體內直接散落讀寫 `_xxx`，而應經由具語意的 `private`：

| 類型 | 說明 | 典型例子 |
|------|------|----------|
| **狀態遷移** | 一改就牽動多個欄位或階段 | 落地分流、敵城階段推進、`applyMenuLeaf` 所觸發的處理鏈、`settleAfterMoveLanding` 對切片旗標的更新 |
| **大塊編排** | 單一 public 過長、難以測與難以再拆 | `createPlayerMenu`：應拆成多個「組 context／掛 roots／組 actions」的私有區塊，public 僅保留少數委派呼叫 |
| **帶規剘的寫入** | 含棋盤／格類別／數值邊界檢查後再寫 map | `forceAssignCityGarrison`、`forceSetCityOwner`、`forcePutCityStores`、`cityVacantNoGarrison` 等：校驗與 `city*` map 寫入宜集中在例如 `cityMaps*` 私有方法 |
| **工廠／註冊** | 建立物件並登錄賽局結構 | `createMonarch`、`createJiCe`（及若一致化則含對 roster 的註冊）：宜委派至 `monarchRegister…`、`jiCeAppendToOwner…` 等私有流程 |

**友元套件**（`@:allow(impl_ver1)`）：仍應**呼叫上述私有「行為」方法**，避免在 Ops／計策腳本中直接賦值 `m._欄位`。

---

## 3. 什麼「不必」強求：避免無語意的薄委派

下列情形**不要求**為了形式一致而再包一層僅 `return _欄位` 的 private：

- **唯讀快照／透視**：如 `board()`、`monarchs()`、多數僅 `return _pending…` 的 `forceGet*`。
- **建構子 `new()`**：欄位初始化保留在建構子內為合理例外。

理由：機械式「每個 public 都不能出現 `_`」會退化成又一輪 **getter 化**，維護成本高，且與「先邏輯化再綁定」的初衷相悖。

---

## 4. 團隊可用的一句話規則

> **有副作用、分支或複數欄位一齊變動的 public／友元呼叫路徑：不得在主流程裡直接讀寫 `_欄位`，須經具語意的 `private`；唯讀、`forceGet` 透視與 `new()` 初始化可維持例外。**

---

## 5. 與 `GAME_DEV_GUIDE.md` 的關係

- **骨架／擴充界線**、主迴路語意仍以 [`GAME_DEV_GUIDE.md`](./GAME_DEV_GUIDE.md) 為準。
- 本文件僅補充：**賽局核心類別內部**如何把「狀態與編排」整理成可維護結構，並與 **`force*` 測試／組局 API** 共存。

---

## 6. 檢查清單（改動後自查）

- [ ] 編譯與現有腳本測試仍綠。
- [ ] 新增或改動的路徑是否把**多欄位更新**收斂到**單一私有方法**（或清楚命名的一組私有方法），而不是在 public 裡逐行寫 `_`。
- [ ] Ops／具體計策是否已不再依賴 `m._xxx`，改呼叫 Core 的 `private` 行為（同套件可見）。
- [ ] 若只新增「`return _x` 的 private 包一層」而**沒有新語意**：考慮是否應省略，維持 public 一行 return 即可。
