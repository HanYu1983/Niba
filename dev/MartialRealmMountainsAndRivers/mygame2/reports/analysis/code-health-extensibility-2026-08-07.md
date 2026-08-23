# 代碼擴充性與健康度報告（2026-08-07）

## 1. 目的

- 評估目前代碼在「新增內容（建築、裝備、功法、道具、事件）」與「新增流程」時的擴充成本。
- 檢查重複、耦合、殘留與職責邊界，提供可執行的健康度改善方向。
- 本報告不改變遊戲規則，只聚焦工程結構。

## 2. 掃描範圍

- src/game/catalogs/*
- src/game/rules/*
- src/game/gameStore.ts
- src/game/types.ts
- src/components/*（與 store/catalog 接口相關）

## 3. 總體評估

- 功能穩定：19 個測試檔、207 個測試通過，build 成功。
- 結構已大幅改善：catalog 已獨立、types 已收斂、action 回傳協定已統一。
- 目前主要健康度風險集中在「UI 對建築類型的字串判斷」與「gameStore 單一檔案規模」。

## 4. 健康度亮點（已改善）

- Catalog 已獨立成 8 個檔案，新增內容只需編輯對應 catalog。
- `types.ts` 已回歸型別與資料模型職責。
- Action 回傳協定已統一為 `ActionOutcome` / `ActionExecutionResult<T>`。
- 角色衍生計算已抽離至 `playerStatsRules`、`playerDerivedRules`、`skillRules`。
- [x] 建築類型已集中至 `BUILDING_TYPES`。
- [x] 已移除 `gameStore.setOperation` 中的 debug `console.log`。
- [x] 第一批 store domain 已拆出 `actions/shopActions.ts`，涵蓋道具與裝備買賣。
- [x] 第二批 store domain 已拆出 `actions/buildingActions.ts`，涵蓋建築建造、升級與防禦建造。
- [x] 第三批 store domain 已拆出 `actions/governanceActions.ts`，涵蓋政策切換、遠端治理與建料調度。
- [x] 第四批 store domain 已拆出 `actions/explorationActions.ts`，涵蓋任務、就醫、資源採集與探索事件。
- [x] 第五批 store domain 已拆出 `actions/combatActions.ts`，涵蓋普通攻擊與外功執行。
- [x] 第六批 store domain 已拆出 `actions/storageActions.ts`，涵蓋道具與裝備公共倉庫存取。
- [x] 建立 `equipmentViewData.ts`，集中裝備部位標籤與屬性摘要格式化。
- [x] 建築 action registry 與 icon view data 已改用 `BUILDING_TYPES`，移除正式程式中的固定建築字串。
- [x] 第七批 store domain 已拆出 `actions/movementActions.ts`，涵蓋玩家移動、移動成本扣除、據點生命加成與視野更新。
- [x] 第八批 store domain 已拆出 `actions/turnActions.ts`，涵蓋玩家回合開始、回合結束、回合收入、玩家恢復與 Creature turn 邊界協調。
- [x] Creature animation orchestration 已拆出 `creatureAnimation.ts`，涵蓋逐隻 Creature action snapshot、動畫 log、回合收尾與 game over 判斷。
- [x] Creature 行為 action 已完整拆出至 `actions/creatureActions.ts`，涵蓋巢穴生成、移動、巡邏、玩家/資源點/防禦設施互動與逐隻 action snapshot；`gameStore` 僅保留相容性 API。
- [x] 遊戲設定讀寫已拆出至 `gameSettings.ts`；`GameStartScreen` 不再直接依賴 `gameStore`。
- [x] `MapGrid` 已直接依賴 `rules/movementRules`，Creature action import 已整理為單一入口。
- [x] 新增 Creature action snapshot 回歸測試，驗證每隻 Creature 都產生獨立行動步驟。
- [x] 補強 Creature 回合回歸測試，涵蓋箭塔先手擊殺與 Creature 攻擊玩家時的傷害/裝備耐久變化。

## 5. 主要發現

### P0-1 `gameStore.ts` 單一檔案規模過大

進度：已完成商店、建築、治理、探索、戰鬥、倉庫、玩家移動、回合 action、Creature 行為、Creature animation orchestration 與遊戲設定模組化；Creature 行動現在會逐隻套用 action snapshot，再切換 `activeCreatureId`。`gameStore` 目前主要仍承擔 preview orchestration 與狀態 adapter。

現象：
- `gameStore.ts` 包含多個 action 方法，橫跨：
  - 回合流程
  - 戰鬥
  - 外功
  - 建築
  - 政策
  - 治理
  - 商店
  - 倉庫
  - 探索
  - 移動
  - UI blocking 狀態

風險：
- 新增功能通常需要回頭修改同一個核心檔。
- 單一檔案過大，review 與測試定位成本高。

建議：
- 依領域拆分 action 群組（例如 `combatActions`、`baseActions`、`governanceActions`、`shopActions`），再合併成單一 store。
- 至少先將「純規則計算」與「狀態變更」分離。

---

### P0-2 UI 大量使用建築類型字串判斷

狀態：已完成主要常數化；正式程式已改用 `BUILDING_TYPES`。

現象：
- 多個元件直接以字串判斷建築類型：
  - `BuildingListModal`：`item-shop`、`equipment-shop`、`waystation`、`exchange`、`regional-management`
  - `BaseDetailsModal`：`exchange`
  - `ShopModal`：`item-shop`、`equipment-shop`
  - `MissionRewardModal`：`board`
  - `gameStore`：`board`、`infirmary`

風險：
- 新增建築類型時，需要同步修改多處字串判斷。
- 字串拼錯不會有編譯錯誤，容易產生隱性 bug。

建議：
- 建立建築類型常數或 enum（例如 `BUILDING_TYPE`）。
- 將「建築是否提供某功能」的判斷收斂到 rules（例如 `hasBuilding(base, 'waystation')` 已有部分）。
- 讓 UI 透過 helper 判斷，而非直接比對字串。

---

### P1-1 UI 對 `gameStore` 的依賴面偏廣

進度：已完成第一批純 helper 解耦；政策、建築等級、商店價格、任務獎勵、資源收益與驛站費用的元件依賴已改為直接從對應 rules 匯入。

現象：
- 仍有部分元件直接從 `gameStore` 取得狀態型 API 或尚未遷移的 helper。

風險：
- 元件與 store 耦合過深，store 成為「萬用出口」。

建議：
- 持續將純函式移至對應 rules/catalog，元件只保留真正需要 store 狀態或 action 的依賴。

---

### P1-2 殘留 `console.log`

狀態：已完成；`setOperation` 的 debug log 已移除。

現象：
- `gameStore.ts` 的 `setOperation` 內有 `console.log('Setting operation:', operation)`。

風險：
- 正式環境會輸出不必要的 log。

建議：
- 移除或改為可設定的 debug log。

---

### P2-1 展示 metadata 仍有局部重複

狀態：已完成。

現象：
- `EquipmentModal` 內有 `slotLabels`。
- `ShopModal` 內重複組裝屬性字串。
- `ATTRIBUTE_NAMES` 已集中，但裝備 slot 標籤仍散落。

建議：
- 已建立 `equipmentViewData.ts`，後續新增裝備展示格式應優先集中於此層。

---

### P2-2 部分 rules 檔案職責可再收斂

現象：
- `playerDerivedRules.ts` 同時包含裝備查表、Buff、地形與衍生屬性。
- 目前可運作，但檔案已偏大。

建議：
- 視擴充需求再拆分（例如 `equipmentLookup`、`buffRules`）。

## 6. 建議優先級

### P0（建議優先處理）

1. 建立建築類型常數，取代 UI 與 store 的字串判斷。
2. 評估 `gameStore.ts` 的領域拆分。

### P1

3. 移除 `setOperation` 的 `console.log`。
4. 元件改為直接從 rules/catalog 匯入純函式，減少對 store 的依賴。

### P2

5. 建立 `viewData` 層，集中 slot 標籤與摘要字串。
6. 視需要再拆分 `playerDerivedRules`。

## 7. 驗收標準

- 新增建築類型時，不需修改多處字串判斷。
- `gameStore.ts` 規模明顯下降或已拆分。
- 正式環境無殘留 `console.log`。
- 元件對 store 的依賴面縮小。
- `npm test -- --run`、`npm run build` 維持通過。

## 8. 補充說明

- 本報告聚焦工程健康度與擴充性，不涉及遊戲平衡。
- 目前功能穩定，建議以「小步快跑」方式逐步改善。
