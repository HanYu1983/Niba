# 事件觸發器系統設計文件（Event Trigger System Design）

本文件規範《武行山河》場景編輯器的**通用事件觸發器系統**：以「時機（Condition）→ 行為（Action）→ 參數（Param）」的統一模式，管理「啟動對話」「生成怪物」等遊戲行為。對話組只存腳本，觸發時機由觸發器統一設定。

---

## 一、背景與動機

### 1.1 需求來源

目前對話的觸發條件（`triggerCondition`）寫在每個對話步驟上，且「生成怪物」散落在探索事件效果中。這導致：

- 對話腳本與觸發時機耦合，編輯不直覺。
- 不同行為（對話、生成怪物）的觸發機制分散，難以統一管理。

### 1.2 設計目標

- **對話組只存腳本**：`dialogues` 改為「以對話組 id 為鍵的物件」，每個組有 `name` 與 `steps`，**不含觸發條件**。
- **統一觸發器**：新增 `triggers` 陣列，以「時機 → 行為 → id」模式統一管理所有觸發。
- **與現有機制並存**：第一版保留現有對話觸發與探索事件 `spawn-creature`，觸發器系統作為新增能力。

---

## 二、資料模型

### 2.1 對話組（Dialogue Group）

`ScenarioDefinition.dialogues` 從「陣列」改為「以對話組 id 為鍵的物件」：

```ts
// src/editor/editorTypes.ts
export type ScenarioDialogueGroup = {
  /** 對話組名稱（顯示用）。 */
  name: string
  /** 對話步驟（純腳本，不含觸發條件）。 */
  steps: Array<{
    id: string
    speakerName: string
    speakerIcon: string
    content: string
    customMetadata?: Record<string, unknown>
  }>
}

// ScenarioDefinition.dialogues 改為：
dialogues: Record<string, ScenarioDialogueGroup>
```

### 2.2 觸發器（Trigger）

`ScenarioDefinition` 頂層新增 `triggers` 陣列：

```ts
export type ScenarioTrigger = {
  id: string
  /** 觸發時機（沿用現有 DialogueTriggerCondition）。 */
  condition: string
  /** 時機參數（如擊敗的 boss id、進入區域座標、回合數）。 */
  conditionParam?: string
  /** 行為類型。 */
  action: 'start-dialogue' | 'spawn-creature'
  /** 行為參數（對話組 id / 怪物 id）。 */
  actionParam: string
}

// ScenarioDefinition 新增：
triggers?: ScenarioTrigger[]
```

### 2.3 範例

```jsonc
"dialogues": {
  "event-xxx": {
    "name": "序章對話",
    "steps": [
      { "id": "prologue-start-1", "speakerName": "村長 趙無極", "speakerIcon": "👴", "content": "少俠，青石村近來妖氣頻生……" },
      { "id": "prologue-start-2", "speakerName": "凌淵", "speakerIcon": "🥋", "content": "妖患不除，村中難安……" }
    ]
  }
},
"triggers": [
  {
    "id": "trigger-start-dialogue",
    "condition": "on-start",
    "action": "start-dialogue",
    "actionParam": "event-xxx"
  },
  {
    "id": "trigger-boss-spawn",
    "condition": "on-defeat-boss",
    "conditionParam": "boss-prologue",
    "action": "spawn-creature",
    "actionParam": "boss-prologue"
  }
]
```

---

## 三、時機類型（Condition）

沿用現有 `DialogueTriggerCondition`：

| 時機 | 參數（conditionParam） |
|------|------------------------|
| `on-start` | 無 |
| `on-objective-complete` | objectiveId |
| `on-enter-region` | `"row,column"` |
| `on-defeat-boss` | creatureId |
| `on-round-reached` | round number |
| `on-failure` | 無 |
| `on-victory` | 無 |

---

## 四、行為類型（Action）

第一版支援兩種：

| 行為 | 參數（actionParam） | 說明 |
|------|---------------------|------|
| `start-dialogue` | 對話組 id | 啟動指定對話組，將其 steps 推入對話佇列 |
| `spawn-creature` | 怪物 id | 從 `scenarioCreatures` 找到對應怪物加入場上 |

---

## 五、遊戲端執行器（Trigger Executor）

### 5.1 新增 `src/game/rules/triggerRules.ts`

```ts
import type { GameState } from '../types'
import type { ScenarioTrigger } from '../../editor/editorTypes'
import { enqueueDialogue } from '../actions/dialogueActions'

/**
 * 依觸發事件執行所有符合條件的觸發器。
 * 回傳更新後的 GameState。
 */
export function executeTriggers(
  state: GameState,
  event: { type: string; param?: string },
): GameState {
  const triggers = state.campaignState?.triggers ?? []
  return triggers.reduce((currentState, trigger) => {
    if (!matchesTrigger(trigger, event)) return currentState
    return executeAction(currentState, trigger)
  }, state)
}

function matchesTrigger(trigger: ScenarioTrigger, event: { type: string; param?: string }): boolean {
  if (trigger.condition !== event.type) return false
  if (trigger.conditionParam !== undefined && trigger.conditionParam !== event.param) return false
  return true
}

function executeAction(state: GameState, trigger: ScenarioTrigger): GameState {
  if (trigger.action === 'start-dialogue') {
    const group = state.campaignState?.dialogueGroups?.[trigger.actionParam]
    if (group) {
      return enqueueDialogue(state, group.steps)
    }
  }
  if (trigger.action === 'spawn-creature') {
    const creature = state.scenarioCreatures?.find((c) => c.id === trigger.actionParam)
    if (creature) {
      return { ...state, creatures: [...state.creatures, creature] }
    }
  }
  return state
}
```

### 5.2 `CampaignState` 擴充

`CampaignState` 需注入觸發器與對話組定義：

```ts
// src/game/types.ts CampaignState 新增：
/** 本章節的觸發器定義（由 scenarioCompiler 注入）。 */
triggers?: ScenarioTrigger[]
/** 本章節的對話組定義（由 scenarioCompiler 注入）。 */
dialogueGroups?: Record<string, ScenarioDialogueGroup>
```

---

## 六、編譯器改動（`scenarioCompiler.ts`）

`compileCampaignState` 需注入 `triggers` 與 `dialogueGroups`：

```ts
function compileCampaignState(scenario: ScenarioDefinition): CampaignState {
  return {
    // ...existing...
    triggers: scenario.triggers ?? [],
    dialogueGroups: scenario.dialogues,
  }
}
```

---

## 七、掛鉤點

在各遊戲動作觸發時呼叫 `executeTriggers`：

| 時機 | 掛鉤位置 |
|------|----------|
| `on-start` | `gameStore.startCampaignChapter` / `loadScenario` |
| `on-victory` | `checkVictory` 勝利時 |
| `on-defeat-boss` | `applyTargetDefeat` 擊敗 Boss 時 |
| `on-enter-region` | `movePlayer` 移動後 |
| `on-round-reached` | `endPlayerTurn` 回合結束時 |
| `on-objective-complete` | `progressObjectives` 目標完成時 |
| `on-failure` | 失敗結算時 |

> 與現有 `collectTriggeredDialogues` 並存：兩者皆可觸發對話，但觸發器系統是新增的統一機制。

---

## 八、編輯器 UI

### 8.1 對話組編輯

- `DialogueAddModal` / `DialogueEditorModal` 改為編輯「對話組」：
  - 顯示對話組清單（id + name）
  - 每個組可編輯 `name` 與 `steps`
  - 新增/刪除對話組

### 8.2 觸發器編輯（新增 `TriggerEditorModal.tsx`）

「新增觸發」功能，格式為「時機 → 行為 → id」：

```text
新增觸發
├─ 時機（下拉：開局 / 勝利 / 擊敗首領 / 進入區域 / 到達回合 / 目標達成 / 失敗）
│    └─ 時機參數（依時機顯示：boss id / 座標 / 回合數 / objective id）
├─ 行為（下拉：啟動對話 / 生成怪物）
└─ 行為參數（依行為顯示：對話組 id 下拉 / 怪物 id 下拉）
```

---

## 九、驗收標準 / 拆分任務

- [x] `editorTypes.ts`：新增 `ScenarioDialogueGroup`、`ScenarioTrigger`，`dialogues` 改為物件。
- [x] `types.ts`：`CampaignState` 新增 `triggers`、`dialogueGroups`。
- [x] `scenarioCompiler.ts`：`compileCampaignState` 注入 `triggers`、`dialogueGroups`。
- [x] `triggerRules.ts`：新增 `executeTriggers` / `matchesTrigger` / `executeAction`。
- [x] 掛鉤點：各時機呼叫 `executeTriggers`。
- [x] `DialogueAddModal` / `DialogueEditorModal`：改為編輯對話組。
- [x] `TriggerEditorModal.tsx`：新增觸發器編輯器。
- [x] `PaletteSidebar`：新增「新增觸發」按鈕。
- [x] `prologue-village.json`：改為新格式（對話組 + triggers）。
- [x] 單元測試：`executeTriggers` 的時機比對、行為執行。
- [ ] 手動驗收：開局觸發對話、擊敗 Boss 生成怪物。

---

## 十、風險與備註

- **並存策略**：第一版保留現有 `collectTriggeredDialogues` 與探索事件 `spawn-creature`，觸發器系統為新增能力，避免破壞既有功能。
- **`dialogues` 格式變更**：從陣列改為物件，需同步更新所有讀取 `scenario.dialogues` 的地方（編譯器、編輯器 UI、驗證器）。
- **觸發器重複執行**：`start-dialogue` 需避免同一對話組重複觸發（可參考 `triggeredDialogueIds` 機制）。
- **`spawn-creature` 重複生成**：需避免同一怪物重複生成（可檢查 `creatures` 是否已存在該 id）。
