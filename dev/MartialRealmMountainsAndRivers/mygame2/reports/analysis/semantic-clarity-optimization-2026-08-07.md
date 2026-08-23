# 語義清晰度與重複定義優化報告（2026-08-07）

## 1. 目的

- 檢查目前專案是否存在「語義混淆」或「重複定義」現象。
- 提供可執行的收斂方案，降低後續擴充（新建築、新裝備、新功法）時的回歸風險。

## 2. 掃描範圍

- src/game/types.ts
- src/game/gameStore.ts
- src/game/catalogs/*
- src/game/rules/*
- src/components/*（與 store/catalog 接口相關）

## 3. 結論摘要

- 功能面目前穩定（測試與 build 可通過），但結構面仍有幾個高優先級語義問題。
- 主要問題集中在「檔名語義與實際責任不一致」、「舊欄位語義殘留」、「跨層依賴入口混用」。
- 建議先做 P0/P1 收斂，不需大改規則即可明顯提升可維護性。

## 4. 主要發現

### P0-1 `types.ts` 已不是純型別檔，語義與檔名不一致

現象：
- `types.ts` 除了型別，還包含多個執行邏輯與查表函式（例如 `getEquipment`、`getBuff`、`getInnerSkill`、`getExternalSkill`、`getEffectiveAttributesForPlayer`）。
- [x] 第一批角色上限計算已抽離至 `rules/playerStatsRules.ts`：`getMaxHealth`、`getMaxStamina`、`getMaxInnerPower`。
- [x] 第二批裝備、Buff 與地形衍生邏輯已抽離至 `rules/playerDerivedRules.ts`。
- [x] 第三批功法查表與悟性容量邏輯已抽離至 `rules/skillRules.ts`。
- `types.ts` 直接 import 多個 catalog，形成「型別檔承擔行為層責任」。

風險：
- 新同事會誤判此檔只放 type，導致重複實作 helper。
- 後續再拆分 catalog/rules 時，容易發生引用路徑震盪與循環依賴。

建議：
- 將 `types.ts` 中的執行邏輯分拆到 `selectors` 或 `rules`（如 `playerDerivedRules.ts`、`catalogLookup.ts`）。
- `types.ts` 僅保留 type/interface/純常數。

---

### P0-2 `equipmentIds` 與 `equipmentInventory` 語義重疊，命名易誤導

現象：
- `PlayerState` 同時有 `equipmentIds?` 與 `equipmentInventory?`。
- `equipmentInventory` 是實際持有的裝備實例（含耐久）。
- `unlockedEquipmentDropIds` 是已解鎖、可進入隨機掉落池的裝備定義 ID（非實際持有清單）。

風險：
- 讀程式時極易把 `equipmentIds` 誤判為「玩家持有裝備」。
- 新功能若誤用 `equipmentIds`，會產生掉落或 UI 顯示錯誤。

建議：
- [x] 將 `equipmentIds` 更名為 `unlockedEquipmentDropIds`。
- [x] 在 type 註解明確標示用途。
- [ ] 補一組測試：當 `unlockedEquipmentDropIds` 為空時，裝備掉落策略是否符合預期。

---

### P1-1 依賴入口混用：有些模組走 catalog 直連，有些走聚合匯出

現象：
- 專案已開始改成直接從 `catalogs/*` 匯入。
- 但仍有部分模組透過其他中介模組取得同類資料或型別，形成風格混用。

風險：
- 同一概念可能有兩種匯入習慣，維護時容易產生「改了 A，漏了 B」。

建議：
- 建立一條明確規範：
  - catalog/type 優先直連來源檔。
  - 只有 UI orchestrator 層可用聚合匯出（若保留）。
- 在 lint 或 PR checklist 加入「匯入路徑一致性」檢查。

---

### P1-2 Action 回傳介面不一致（boolean vs object）

現象：
- 多數 store action 回傳 `boolean`。
- 部分 action（例如建料調度）已升級為回傳結構化結果（`ok/reason/deliveredAmount/loss`）。

風險：
- 呼叫端在處理彈窗時要分支判斷回傳型別，增加樣板碼與錯誤機率。

建議：
- 定義共用結果型別：
  - `ActionResultLite = { ok: boolean; reason?: string }`
  - 需要擴充資料時使用交集型別。
- 新增/修改 action 時統一回傳協定。
- [x] 已建立 `ActionOutcome`，並套用至 Phase A 一般成功/失敗 action。
- [x] 已建立泛型 `ActionExecutionResult<T>`，並套用至修理、撿取與建料調度。
- [x] 防禦建造與探索事件已統一為 `ActionOutcome`。
- [x] 攻擊與外功已統一為 `ActionExecutionResult<T>`。
- Preview action 維持獨立的 `Preview | null` 協定，不與執行結果混用。

---

### P2-1 Catalog 與展示模型尚未完全分離

現象：
- 部分 UI 顯示邏輯（欄位組合、標籤字串）仍在 component 內組裝。
- 目前雖可運作，但長期會讓展示語義散落。

建議：
- 增加 `viewData` 層（如 `equipmentViewData.ts`）集中 icon/slotLabel/摘要字串。

## 5. 建議優化路線（小步快跑）

### Phase A（P0，1~2 天）

1. [x] 重命名 `equipmentIds` -> `unlockedEquipmentDropIds`。
2. [ ] 補齊該欄位語義測試（掉落池與實際持有分離）。
3. 在 `types.ts` 加註「待拆分函式清單」。

### Phase B（P1，2~3 天）

1. [x] 抽離第一批純角色衍生計算到 `rules/playerStatsRules.ts`。
2. [x] 抽離裝備、Buff 與地形衍生邏輯到 `rules/playerDerivedRules.ts`。
3. [x] 將 `getInnerSkill`、`getExternalSkill`、`getPlayerTotalInsightCost`、`getPlayerInsightCapacityBreakdown` 抽離至 `rules/skillRules.ts`。
4. [x] 統一一般 action 回傳協定（`ActionOutcome`）。
5. [x] 將修理、撿取與建料調度統一為 `ActionExecutionResult<T>`。
6. [x] 將防禦建造與探索事件統一為 `ActionOutcome`。
7. [x] 將攻擊與外功結果 action 統一為 `ActionExecutionResult<T>`。
8. 補一份 import 規範（README 或 CONTRIBUTING）。

### Phase C（P2，視情況）

1. 補齊 view-model 層，減少 component 內重複字串拼接。
2. 視需求導入 lint 規則限制跨層匯入。

## 6. 驗收標準

- `types.ts` 只保留型別/常數，行為函式明顯下降。
- `PlayerState` 裝備相關欄位語義無歧義。
- 新增 action 回傳格式統一。
- `npm test -- --run`、`npm run build` 維持通過。

## 7. 補充說明

- 本報告聚焦工程語義與結構，不涉及遊戲平衡值調整。
- 目前功能穩定，優化建議以「不破壞既有玩法」為前提。