# 地圖格子與標記互動統一開發文件

## 1. 文件目的

- 統一空白格、地圖物件標記、滑鼠點擊與鍵盤操作的互動結果。
- 避免同一格因點擊位置不同而產生不同結果。
- 將互動規則、互動解析與 React 副作用分離。
- 為未來新增任務目標、警戒範圍、採集區域與其他地圖互動建立穩定基礎。

## 2. 為什麼需要分階段

這次修改同時涉及：

- 地圖格子狀態資料結構。
- Cell 與 Marker 的互動優先級。
- 滑鼠與鍵盤操作一致性。
- React callback 與遊戲 store 的副作用。
- 既有移動、攻擊、外功、建造、查看詳情流程。

若一次修改全部流程，容易造成以下風險：

- 攻擊模式誤觸發詳情。
- 移動模式誤觸發查看或採集。
- Marker 與空白格行為不一致。
- 鍵盤操作與滑鼠操作結果不同。
- 新互動解析器與既有 callback 重複執行。

因此必須採用「先固定行為，再抽離規則，最後切換 UI」的分階段方式。

## 3. 目標架構

```text
MapCellInteractionContext
        ↓
getMapCellViewState()
        ↓
resolveMapCellInteraction()
        ↓
MapCellInteraction
        ↓
executeMapCellInteraction()
        ↓
React callback / gameStore action
```

### 3.1 三層責任

| 層級 | 職責 | 不應負責 |
|---|---|---|
| View State | 收集格子可見性、物件與可用狀態 | 不執行 callback |
| Interaction Resolver | 依優先級產生唯一互動結果 | 不修改 GameState |
| Interaction Executor | 將結果轉成 UI 或 store 操作 | 不自行重新判斷優先級 |

## 4. 互動結果契約

建議建立完整的 `MapCellInteraction` union：

```ts
export type MapCellInteraction =
  | { type: 'none' }
  | { type: 'move'; playerId: string; position: Position }
  | { type: 'attack-creature'; creatureId: string }
  | { type: 'attack-nest'; nestId: string }
  | { type: 'build-defense'; position: Position }
  | { type: 'inspect-creature'; creatureId: string }
  | { type: 'inspect-nest'; nestId: string }
  | { type: 'inspect-base'; baseId: string }
  | { type: 'inspect-resource'; resourcePointId: string }
  | { type: 'inspect-event'; eventId: string }
  | { type: 'inspect-item'; itemPointId: string }
  | { type: 'inspect-ruin'; ruinId: string }
  | { type: 'inspect-defense'; structureId: string }
```

注意：`MapCellInteraction` 是資料結果，不應包含 React event、DOMRect 或 callback。

## 5. 分階段開發計畫

## Phase 0：基線盤點與行為鎖定

### 目標

在重構前記錄目前所有互動行為，確保後續不會無意改變遊戲規則。

### 工作項目

- 盤點 `MapGrid.tsx` 的 cell `onClick` 與 `onKeyDown`。
- 盤點所有 marker 的 `onClick` 與 `onKeyDown`。
- 記錄攻擊、外功、建造、移動與一般查看模式的優先級。
- 對照 `mapCellStateRules.ts` 目前已有的 cell 與 marker resolver。
- 補充規則層測試，不先修改 UI 行為。

### 驗收條件

- 所有既有互動入口已列出。
- 滑鼠與鍵盤目前差異已記錄。
- 既有完整測試通過。

## Phase 1：建立完整 View State

### 目標

建立一個純資料的 `MapCellInteractionContext`，讓 cell 與 marker 共用同一份格子資訊。

### 建議檔案

- `src/game/rules/mapCellStateRules.ts`
- 必要時新增 `src/game/rules/mapCellStateTypes.ts`

### Context 建議內容

```ts
export type MapCellInteractionContext = {
  position: Position
  visibility: 'visible' | 'explored' | 'unexplored'
  movementEnabled: boolean
  attackTargeting: boolean
  externalSkillTargeting: boolean
  defenseBuildMode: boolean
  activePlayerId: string | null
  canMove: boolean
  canBuildDefense: boolean
  creatures: Array<{ id: string; alive: boolean }>
  nests: Array<{ id: string; alive: boolean }>
  bases: Array<{ id: string }>
  resources: Array<{ id: string }>
  events: Array<{ id: string }>
  items: Array<{ id: string }>
  ruins: Array<{ id: string }>
  defenses: Array<{ id: string }>
}
```

### 規則

- `unexplored` 格不可產生任何互動。
- 物件清單只包含目前允許玩家看見的物件。
- 目標只包含存活的 Creature 或巢穴。
- `canMove` 與 `canBuildDefense` 必須由狀態計算層提供。
- View State 不執行 store action 或 UI callback。

### 驗收條件

- Cell 與 Marker 不再各自組合物件清單。
- 可對同一格產生唯一且可測試的 Context。
- 不會因點擊空白或標記而重新推導不同 visibility 規則。

## Phase 2：統一互動優先級解析

### 目標

讓 `resolveMapCellInteraction(context)` 產生唯一的 `MapCellInteraction`。

### 建議優先級

#### A. 阻擋條件

1. 遊戲結束。
2. 阻塞中的 Modal。
3. Creature 回合處理中。
4. 未探索格。

#### B. 特殊模式

5. 普通攻擊目標。
6. 外功目標。
7. 防禦建造位置。
8. 移動模式下的移動位置。

#### C. 一般模式

9. 移動到可移動格。
10. Creature 詳情。
11. 巢穴詳情。
12. 據點詳情。
13. 防禦設施詳情。
14. 探索事件詳情。
15. 資源點詳情。
16. 道具點詳情。
17. 廢墟詳情。
18. 無可用操作。

### 重要規則

- 據點範圍 overlay 只提供資訊，不參與互動優先級。
- 互動優先級不可依賴 JSX 中 `if` 的排列順序。
- 同一個 context 必須得到同一個結果。
- Cell 與 Marker 的點擊結果必須一致。

### 驗收條件

- 所有優先級都有單元測試。
- 目標模式不會誤觸發詳情。
- 建造模式不會誤觸發移動。
- 據點範圍不會攔截任何操作。

## Phase 3：統一執行器

### 目標

將純資料互動結果轉換為唯一的 UI callback 或 gameStore action。

### 建議介面

```ts
export type MapInteractionHandlers = {
  move: (playerId: string, position: Position) => void
  attackCreature: (creatureId: string) => void
  attackNest: (nestId: string) => void
  buildDefense: (position: Position) => void
  inspectCreature: (creatureId: string, markerRect?: DOMRect) => void
  inspectNest: (nestId: string) => void
  inspectBase: (baseId: string) => void
  inspectResource: (resourcePointId: string) => void
  inspectEvent: (eventId: string) => void
  inspectItem: (itemPointId: string) => void
  inspectRuin: (ruinId: string) => void
  inspectDefense: (structureId: string) => void
}
```

### 執行規則

- Executor 不重新判斷優先級。
- `none` 不執行任何動作。
- 同一個 DOM 事件只能執行一次 executor。
- Marker 若使用 `stopPropagation()`，仍必須傳入與 cell 相同的 context。
- `DOMRect` 僅作為 UI 定位資料，不進入規則層。

### 驗收條件

- `MapGrid.tsx` 不再直接維護大量模式判斷。
- 所有互動 callback 集中由 executor 觸發。
- 滑鼠與鍵盤使用同一個 executor。
- 無重複移動、重複開啟 Modal 或重複攻擊。

## Phase 4：Cell 與 Marker 切換

### 目標

將現有 cell click、marker click、marker keydown 全部切換到統一流程。

### 遷移順序

1. 空白 cell click。
2. 道具點與事件 marker。
3. Creature 與巢穴 marker。
4. 據點、資源點、廢墟 marker。
5. 防禦設施 marker。
6. 所有 marker keyboard 操作。

### 每一步要求

- 保留舊流程作為對照。
- 先新增測試，再切換實作。
- 切換後執行相關測試與建置。
- 不在同一個 commit 同時改變互動優先級與視覺樣式。

### 驗收條件

- Cell 與 Marker 點擊結果一致。
- 滑鼠與鍵盤結果一致。
- 各模式的阻擋條件一致。
- 既有地圖拖曳不會誤觸發互動。

## Phase 5：回歸測試與清理

### 必測案例

| 案例 | 預期結果 |
|---|---|
| 空白可移動格 | 移動 |
| 據點範圍 + 可移動格 | 仍然移動 |
| Creature + 攻擊模式 | 攻擊 Creature |
| Creature + 一般模式 | 查看 Creature |
| 巢穴 + 外功模式 | 選取巢穴 |
| 事件 + 移動模式 | 移動 |
| 事件 + 一般模式 | 查看事件 |
| 道具點 + 移動模式 | 移動 |
| 道具點 + 一般模式 | 查看道具點 |
| 建造模式 + 空白格 | 建造 |
| 建造模式 + 佔用格 | 不建造 |
| 未探索格 | 無互動 |
| 遊戲結束 | 無互動 |
| Cell 與 Marker | 結果一致 |
| 滑鼠與鍵盤 | 結果一致 |

### 清理工作

- 移除 `MapGrid.tsx` 內重複的模式判斷。
- 移除已被 resolver 取代的舊 helper。
- 移除未使用 callback 或型別。
- 檢查 `stopPropagation()` 是否仍必要且位置正確。
- 檢查拖曳抑制 click 的流程。

### 最終驗收條件

- 所有測試通過。
- `npm run build` 成功。
- TypeScript 與 ESLint 無新增錯誤。
- 新增一種地圖互動時，只需新增 context 欄位、resolver 分支、executor handler 與測試。

## 6. 專案追蹤清單

| Task Item | Owner | Status | Priority | Deadline |
|---|---|---|---|---|
| Phase 0：基線盤點與行為鎖定 | 遊戲規則／前端工程 | Planned | P0 | TBD |
| Phase 1：建立完整 View State | 遊戲規則工程 | Planned | P0 | TBD |
| Phase 2：統一互動優先級解析 | 遊戲規則工程 | Planned | P0 | TBD |
| Phase 3：建立互動執行器 | 前端工程 | Planned | P0 | TBD |
| Phase 4：Cell 與 Marker 切換 | 前端工程 | Planned | P0 | TBD |
| Phase 5：回歸測試與清理 | QA／前端工程 | Planned | P0 | TBD |

## 7. 最終設計原則

- 規則層只產生資料，不接觸 React。
- React 只負責建立 context、渲染與執行 handler。
- Cell 與 Marker 不得各自定義互動優先級。
- 視覺 overlay 不得攔截資訊以外的互動。
- 所有互動結果都必須可透過純函式測試。
