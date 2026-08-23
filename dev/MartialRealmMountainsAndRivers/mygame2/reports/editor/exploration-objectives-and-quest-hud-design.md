# 探索型任務目標與任務追蹤 HUD 開發設計文件

本文件規範《武行山河》第一章「青石遺恨」實作所需的**兩個新任務目標類型**（`reach-position`、`interact-object`）與**任務追蹤 HUD（QuestTrackerPanel）**的架構、掛鉤點、資料模型與驗收標準。

---

## 一、背景與動機

### 1.1 需求來源

第一章「青石遺恨」的故事設計需要兩個探索型支線：

| 支線 | 類型 | 說明 |
|------|------|------|
| 調查靈泉 | 到達指定位置 | 玩家走到靈泉旁即完成 |
| 幫助村民 | 與物件互動 | 玩家與村民互動才完成 |

目前編輯器的目標類型（`defeat-creature`、`destroy-nest`、`build-building`、`reconstruct-ruin`、`learn-skill`、`reach-prestige`、`survive-rounds`、`build-defense-structure`）**皆為「動作型」目標**，缺少「探索型」目標。本文件新增兩種探索型目標。

### 1.2 設計原則

- **資料驅動**：新目標類型沿用既有 `activeObjectives` 結構，只擴充 `type` 與必要欄位。
- **純函式掛鉤**：探索型目標的推進沿用 `progressObjectives` 純函式，不新增分支代碼路徑。
- **編輯器擴充**：`QuestSequencerModal` 目標類型下拉選單新增兩項，並提供對應欄位編輯。
- **HUD 補齊**：新增 `QuestTrackerPanel` 顯示主線/支線進度，補足「玩家知道有支線」的資訊缺口。

---

## 二、新目標類型定義

### 2.1 `reach-position`（到達指定位置）

- **語意**：玩家（或任一人類玩家）移動後，其位置與目標位置相符，即完成。
- **觸發時機**：`movePlayer` 完成後。
- **綁定方式**：綁定目標位置（`targetRow` / `targetColumn`），或綁定實體 id（`targetId`）。

```ts
{
  id: 'obj-reach-spring',
  title: '調查靈泉',
  type: 'reach-position',
  targetRow: 5,        // 目標位置列
  targetColumn: 5,     // 目標位置欄
  targetValue: 1,
  isOptional: true,
}
```

### 2.2 `interact-object`（與物件互動）

- **語意**：玩家與指定物件（探索事件、NPC 等）互動後完成。
- **觸發時機**：`resolveExplorationEvent` 完成後（或未來互動系統）。
- **綁定方式**：綁定目標物件 id（`targetId`）。

```ts
{
  id: 'obj-help-villager',
  title: '幫助村民',
  type: 'interact-object',
  targetId: 'villager-1',
  targetValue: 1,
  isOptional: true,
}
```

> 注意：`interact-object` 綁定單一物件時 `targetValue = 1`；若要「與 3 個村民互動」，可設 3 個不綁定 `targetId` 的目標，或用單一目標累計 3 次（未來擴充）。

---

## 三、資料模型擴充

### 3.1 `activeObjectives` 目標欄位（`src/game/types.ts`）

在 `CampaignState.activeObjectives` 的目標元素中新增：

```ts
/** 目標指定到達的位置（reach-position 目標用）。 */
targetRow?: number
/** 目標指定到達的位置（reach-position 目標用）。 */
targetColumn?: number
```

`targetId` 已存在，`interact-object` 直接複用。

### 3.2 `ObjectiveProgressEvent` 擴充（`src/game/rules/campaignRules.ts`）

```ts
export type ObjectiveProgressEvent =
  | /* ...existing... */
  | { type: 'reach-position'; row: number; column: number }
  | { type: 'interact-object'; targetId: string }
```

### 3.3 `getEventTargetId` 擴充

```ts
function getEventTargetId(event: ObjectiveProgressEvent): string | undefined {
  switch (event.type) {
    case 'defeat-creature':
    case 'destroy-nest':
    case 'reconstruct-ruin':
    case 'interact-object':
      return event.targetId
    default:
      return undefined
  }
}
```

### 3.4 `progressObjectives` 推進邏輯

- **`reach-position`**：事件 `row`/`column` 與目標 `targetRow`/`targetColumn` 相符即完成。
- **`interact-object`**：事件 `targetId` 與目標 `targetId` 相符即完成（綁定語意）。

```ts
// reach-position：位置相符才推進。
if (objective.type === 'reach-position') {
  if (event.type !== 'reach-position') return objective
  if (objective.targetRow !== event.row || objective.targetColumn !== event.column) return objective
  return { ...objective, currentValue: objective.targetValue, completed: true }
}

// interact-object：綁定 targetId 相符才推進。
if (objective.type === 'interact-object') {
  if (event.type !== 'interact-object' || event.targetId !== objective.targetId) return objective
  return { ...objective, currentValue: objective.targetValue, completed: true }
}
```

---

## 四、掛鉤點

### 4.1 `reach-position` — `movePlayer`

`src/game/actions/movementActions.ts` 的 `movePlayer` 在移動完成後呼叫：

```ts
import { progressObjectives, checkVictory } from '../rules/campaignRules'

// 移動完成後：
const withObjectives = progressObjectives(stateWithHealthBonus, {
  type: 'reach-position',
  row,
  column,
})
return {
  state: checkVictory(withObjectives),
  result: { ok: true },
}
```

### 4.2 `interact-object` — `resolveExplorationEvent`

`src/game/actions/explorationActions.ts` 的 `resolveExplorationEvent` 在互動完成後呼叫：

```ts
import { progressObjectives, checkVictory } from '../rules/campaignRules'

// 互動完成後：
const withObjectives = progressObjectives(nextState, {
  type: 'interact-object',
  targetId: eventId,
})
return checkVictory(withObjectives)
```

> 需確認 `resolveExplorationEvent` 目前的回傳結構，掛鉤位置以「互動成功結算後」為準。

---

## 五、編輯器擴充

### 5.1 `QuestSequencerModal` 目標類型選單

新增兩個選項：

```ts
const OBJECTIVE_TYPE_OPTIONS = [
  /* ...existing... */
  { value: 'reach-position', label: '到達指定位置' },
  { value: 'interact-object', label: '與物件互動' },
]
```

### 5.2 欄位編輯

- 選 `reach-position`：顯示 `targetRow` / `targetColumn` 兩個 `InputNumber`。
- 選 `interact-object`：顯示 `targetId` 輸入框（物件 id）。

### 5.3 `scenarioValidator` 擴充

- `reach-position`：需提供 `targetRow` / `targetColumn`，且在地圖範圍內。
- `interact-object`：需提供 `targetId`。

---

## 六、任務追蹤 HUD（QuestTrackerPanel）

### 6.1 定位

- 固定於遊戲畫面**左上角**（或右上角），可折疊。
- 僅在 `campaignState` 存在（劇本模式）時顯示。

### 6.2 元件結構（新增 `src/components/QuestTrackerPanel.tsx`）

```text
QuestTrackerCard（可折疊 Collapse）
├─ 主線目標（MainObjectiveList）
│    └─ ☐ 擊敗青石妖王（0/1）
└─ 支線目標（OptionalObjectiveList，金色/灰色標記）
     ├─ ◇ 調查靈泉（未完成）
     └─ ◇ 幫助村民（0/3）
```

### 6.3 狀態

| 狀態 | 呈現 |
|------|------|
| `idle` | 正常半透明浮動展示 |
| `updated` | 目標數值變更時金色高亮閃爍 3 秒 |
| `completed` | 達成時播放核取勾選效果 |

### 6.4 資料來源

- 從 `gameState.campaignState.activeObjectives` 讀取。
- 主線 = `isOptional !== true`；支線 = `isOptional === true`。
- 顯示 `currentValue / targetValue` 進度。

### 6.5 掛載位置

- 在 `App.tsx` 的遊戲畫面（`screen === 'game'`）掛載。
- 與 `GameStatusCard` 並存，位置錯開（`GameStatusCard` 現於頂部，`QuestTrackerPanel` 置左側）。

---

## 七、第一章 JSON 更新

### 7.1 支線目標

```jsonc
"victoryObjectives": [
  { "id": "obj-defeat-boss", "title": "擊敗青石妖王", "type": "defeat-creature", "targetId": "boss-prologue", "targetValue": 1 },
  { "id": "obj-reach-spring", "title": "調查靈泉", "type": "reach-position", "targetRow": 5, "targetColumn": 5, "targetValue": 1, "isOptional": true },
  { "id": "obj-help-villager", "title": "幫助村民", "type": "interact-object", "targetId": "villager-1", "targetValue": 1, "isOptional": true }
]
```

### 7.2 身世線索對話（勝利時觸發）

```jsonc
{
  "id": "prologue-victory-lore",
  "speakerName": "主角",
  "speakerIcon": "🥋",
  "content": "妖氣雖除，但源頭未明。我隱約記得師父臨終所言——「山河有難時，你會明白。」我須繼續追查。",
  "triggerCondition": "on-victory"
}
```

---

## 八、驗收標準 / 拆分任務

- [ ] `src/game/types.ts`：`activeObjectives` 目標新增 `targetRow` / `targetColumn`。
- [ ] `src/game/rules/campaignRules.ts`：擴充 `ObjectiveProgressEvent`（`reach-position` / `interact-object`）、`getEventTargetId`、`progressObjectives`。
- [ ] `src/game/actions/movementActions.ts`：`movePlayer` 掛鉤 `reach-position`。
- [ ] `src/game/actions/explorationActions.ts`：`resolveExplorationEvent` 掛鉤 `interact-object`。
- [ ] `src/editor/components/QuestSequencerModal.tsx`：目標類型選單 + 欄位編輯。
- [ ] `src/editor/rules/scenarioValidator.ts`：新目標類型驗證。
- [ ] `src/components/QuestTrackerPanel.tsx`：新增任務追蹤 HUD。
- [ ] `src/App.tsx`：掛載 `QuestTrackerPanel`。
- [ ] `public/data/scenarios/prologue-village.json`：加入支線目標與身世線索對話。
- [ ] 單元測試：`reach-position` / `interact-object` 推進邏輯、勝利判定、驗證器。
- [ ] 手動驗收：移動到靈泉完成支線、與村民互動完成支線、HUD 顯示進度。

---

## 九、風險與備註

- **`interact-object` 的綁定語意**：若需「與 3 個村民互動」，建議用「不綁定 `targetId` 累計」或「3 個獨立目標」，避免單一目標綁定 3 次的語意模糊。
- **`resolveExplorationEvent` 掛鉤位置**：需先確認該函式的回傳結構，確保「互動成功後」才推進目標。
- **HUD 與現有 UI 重疊**：`QuestTrackerPanel` 需與 `GameStatusCard`、`BasePanel` 位置錯開，避免遮擋。
- **沙盒模式不顯示 HUD**：`campaignState` 不存在時不顯示，維持沙盒純淨。
