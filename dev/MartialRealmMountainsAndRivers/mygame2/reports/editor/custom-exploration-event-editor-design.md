# 自定義探索事件編輯器設計文件（Custom Exploration Event Editor Design）

本文件規範《武行山河》場景編輯器的**自定義探索事件（Custom Exploration Event）**功能：讓編輯器能自定義事件的**名稱、描述、圖示、選項按鈕文字、條件數值與效果數值**，供劇本關卡使用。既有事件與自定義事件**並存**。

---

## 一、背景與動機

### 1.1 需求來源

第一章「青石遺恨」需要「靈泉」這類**固定場景互動點**——玩家到達後，可選擇「調查靈泉」「飲用泉水」等選項，每個選項有不同的條件與效果。目前探索事件（`eventCatalog.ts`）是**硬編碼**的，編輯器只能「選一個既有事件類型」擺放，無法自定義。

### 1.2 設計原則

- **並存（Coexistence）**：既有事件保留不變，新增自定義事件，兩者共用同一套事件解析/結算流程。
- **部分自定義（Partial Customization）**：結構（條件/效果類型）固定，內容（名稱、文字、數值）可自定義。
- **資料驅動（Data-Driven）**：自定義事件定義隨 `ScenarioDefinition` 序列化，儲存於 JSON / localStorage，不污染 `eventCatalog`。
- **複用結算（Reuse Resolver）**：自定義事件的選項結算複用既有 `eventResolver` 的 `checkEventRequirements` / `applyEventEffects`。

---

## 二、自定義範圍

| 可自定義 | 不可自定義（用既有） |
|----------|---------------------|
| 事件名稱（name） | 條件類型（`EventRequirement`） |
| 事件描述（description） | 效果類型（`EventEffect`） |
| 事件圖示（icon） | |
| 選項按鈕文字（label） | |
| 選項描述（description） | |
| 選項 `endsPlayerTurn` | |
| 條件數值（金額、道具 id/數量、建築類型） | |
| 效果數值（金額、聲望、道具 id/數量、功法類型） | |

> 條件/效果**類型**固定（如 `money`、`prestige`、`item`、`learn-skill`），但**參數值**可自定義。

---

## 三、資料模型

### 3.1 自定義事件定義（編輯器層）

在 `ScenarioEntityPlacement`（`kind === 'event'`）的 `data` 中，以 `type: 'custom'` 標記自定義事件，並攜帶完整定義：

```ts
// src/editor/editorTypes.ts 新增型別
export type CustomEventChoice = {
  id: string
  label: string
  description: string
  endsPlayerTurn: boolean
  requirements: EventRequirement[]
  effects: EventEffect[]
}

export type CustomEventData = {
  type: 'custom'
  name: string
  description: string
  icon: string
  choices: CustomEventChoice[]
}
```

> `EventRequirement` / `EventEffect` 直接複用 `eventCatalog.ts` 的既有型別。

### 3.2 事件實體 data 的兩種形式

```ts
// 既有事件：只存 eventType
data: { eventType: 'wandering-merchant' }

// 自定義事件：存完整定義
data: {
  type: 'custom',
  name: '靈泉',
  description: '清澈的靈泉，散發著微光。',
  icon: '⛲',
  choices: [
    {
      id: 'inspect',
      label: '調查靈泉',
      description: '仔細查看靈泉的異樣。',
      endsPlayerTurn: false,
      requirements: [{ type: 'active-player' }, { type: 'player-alive' }],
      effects: [{ type: 'prestige', amount: 5 }],
    },
    {
      id: 'drink',
      label: '飲用泉水',
      description: '飲下泉水，恢復元氣。',
      endsPlayerTurn: true,
      requirements: [{ type: 'active-player' }, { type: 'player-alive' }],
      effects: [{ type: 'item', itemId: 'heal-wound-medicine', quantity: 1 }],
    },
  ],
}
```

### 3.3 `ExplorationEventState` 擴充（`src/game/types.ts`）

自定義事件需在運行時攜帶自定義定義，供 `eventResolver` 查詢選項：

```ts
export type ExplorationEventState = {
  id: string
  type: ExplorationEventType | 'custom'   // 擴充為可含 'custom'
  name: string
  description: string
  position: Position
  status: ExplorationEventStatus
  discovered: boolean
  expiresAtRound: number | null
  sourcePoolId?: ExplorationEventPoolId
  /** 自定義事件定義（type === 'custom' 時存在）。 */
  customEvent?: {
    icon: string
    choices: Array<{
      id: string
      label: string
      description: string
      endsPlayerTurn: boolean
      requirements: EventRequirement[]
      effects: EventEffect[]
    }>
  }
}
```

---

## 四、編譯器改動（`scenarioCompiler.ts`）

### 4.1 `compileEvents` 支援自定義事件

```ts
function compileEvents(placements: ScenarioEntityPlacement[]): ExplorationEventState[] {
  return placements.map((placement) => {
    const data = placement.data as Record<string, unknown>
    // 自定義事件：讀取完整定義。
    if (data.type === 'custom') {
      return {
        id: placement.id,
        type: 'custom',
        name: (data.name as string) ?? '事件',
        description: (data.description as string) ?? '',
        position: placement.position,
        status: 'available',
        discovered: true,
        expiresAtRound: null,
        customEvent: {
          icon: (data.icon as string) ?? '🗨️',
          choices: (data.choices as CustomEventChoice[]) ?? [],
        },
      }
    }
    // 既有事件：查 eventCatalog。
    const eventType = (data.eventType as string) ?? 'lost-caravan'
    const definition = getExplorationEventDefinition(eventType as never)
    return {
      id: placement.id,
      type: eventType as ExplorationEventState['type'],
      name: definition?.name ?? '事件',
      description: definition?.description ?? '',
      position: placement.position,
      status: 'available',
      discovered: true,
      expiresAtRound: null,
    }
  })
}
```

---

## 五、解析器改動（`eventResolver.ts`）

### 5.1 `getEventChoiceDefinition` 支援自定義事件

```ts
export function getEventChoiceDefinition(event: ExplorationEventState, choiceId: string) {
  // 自定義事件：從 customEvent 查選項。
  if (event.type === 'custom' && event.customEvent) {
    return event.customEvent.choices.find((choice) => choice.id === choiceId)
  }
  return getExplorationEventDefinition(event.type as ExplorationEventType)?.choices.find((choice) => choice.id === choiceId)
}
```

> 自定義事件的 `requirements` / `effects` 型別與既有事件相同，`checkEventRequirements` / `applyEventEffects` 不需改動，直接複用。

### 5.2 選項顯示來源

`WorldObjectOverlays.tsx` 顯示事件選項按鈕時，需能讀取自定義事件的 `choices`。需確認該處的選項來源，調整為「自定義事件讀 `customEvent.choices`，既有事件讀 `eventCatalog`」。

---

## 六、編輯器 UI

### 6.1 事件圖章切換

- `PaletteSidebar` 的「事件」圖章不變。
- `InspectorSidebar` 的事件檢視器新增「事件模式」切換：
  - **既有事件**：下拉選 `eventType`（既有 `EVENT_TYPE_OPTIONS`）。
  - **自定義事件**：切換到自定義模式，開啟自定義事件編輯器。

### 6.2 自定義事件編輯器（新增 `CustomEventEditorModal.tsx`）

結構化表單，編輯以下欄位：

| 欄位 | 類型 | 說明 |
|------|------|------|
| 事件名稱 | Input | `name` |
| 事件描述 | Input.TextArea | `description` |
| 事件圖示 | Input | `icon`（emoji） |
| 選項清單 | 列表 + 新增/刪除/排序 | `choices` |
| └ 選項文字 | Input | `label` |
| └ 選項描述 | Input | `description` |
| └ 結束回合 | Switch | `endsPlayerTurn` |
| └ 條件清單 | 列表 + 新增/刪除 | `requirements` |
| └ 效果清單 | 列表 + 新增/刪除 | `effects` |

### 6.3 條件/效果結構化表單

**條件編輯**（下拉選類型 + 依類型顯示參數欄位）：

| 條件類型 | 參數欄位 |
|----------|----------|
| `adjacent-to-event` | 無 |
| `active-player` | 無 |
| `player-alive` | 無 |
| `money-at-least` | 金額 `InputNumber` |
| `item-owned` | 道具 `Select` + 數量 `InputNumber` |
| `building-exists` | 建築類型 `Select` |

**效果編輯**（下拉選類型 + 依類型顯示參數欄位）：

| 效果類型 | 參數欄位 |
|----------|----------|
| `money` | 金額 `InputNumber`（可負） |
| `prestige` | 聲望 `InputNumber`（可負） |
| `item` | 道具 `Select` + 數量 `InputNumber` |
| `learn-skill` | 功法類型 `Select`（inner/external） |

> 道具選項複用 `LOOT_ITEM_OPTIONS` 或 `itemCatalog`；建築選項複用 `BUILDING_OPTIONS`。

---

## 七、驗證器改動（`scenarioValidator.ts`）

自定義事件驗證：

- `data.type === 'custom'` 時，需有 `name`（非空）。
- 每個選項需有 `label`（非空）。
- 每個選項的 `effects` 非空（至少一個效果）。
- 條件/效果型別合法性（可選，由結構化表單保證）。

---

## 八、第一章 JSON 更新

將靈泉改為自定義事件：

```jsonc
{
  "id": "event-spring",
  "kind": "event",
  "position": { "row": 5, "column": 5 },
  "data": {
    "type": "custom",
    "name": "靈泉",
    "description": "清澈的靈泉，散發著微光。",
    "icon": "⛲",
    "choices": [
      {
        "id": "inspect",
        "label": "調查靈泉",
        "description": "仔細查看靈泉的異樣。",
        "endsPlayerTurn": false,
        "requirements": [{ "type": "active-player" }, { "type": "player-alive" }],
        "effects": [{ "type": "prestige", "amount": 5 }]
      }
    ]
  }
}
```

---

## 九、驗收標準 / 拆分任務

- [ ] `src/editor/editorTypes.ts`：新增 `CustomEventChoice` / `CustomEventData` 型別。
- [ ] `src/game/types.ts`：`ExplorationEventState` 擴充 `customEvent` 欄位與 `type: 'custom'`。
- [ ] `src/editor/rules/scenarioCompiler.ts`：`compileEvents` 支援自定義事件。
- [ ] `src/game/events/eventResolver.ts`：`getEventChoiceDefinition` 支援自定義事件。
- [ ] `src/components/overlays/WorldObjectOverlays.tsx`：事件選項顯示支援自定義事件。
- [ ] `src/editor/components/CustomEventEditorModal.tsx`：新增自定義事件編輯器（結構化表單）。
- [ ] `src/editor/components/InspectorSidebar.tsx`：事件檢視器新增「事件模式」切換。
- [ ] `src/editor/rules/scenarioValidator.ts`：自定義事件驗證。
- [ ] `public/data/scenarios/prologue-village.json`：靈泉改為自定義事件。
- [ ] 單元測試：編譯器自定義事件、解析器自定義選項、驗證器。
- [ ] 手動驗收：編輯器建立自定義事件、試玩時選項正常顯示與結算。

---

## 十、風險與備註

- **`type` 字串的型別安全**：`ExplorationEventState.type` 擴充為 `ExplorationEventType | 'custom'`，既有 `eventResolver` 需處理 `custom` 分支，避免型別收窄問題。
- **選項顯示來源統一**：`WorldObjectOverlays` 需統一「既有事件 / 自定義事件」的選項讀取路徑，避免重複邏輯。
- **`customEvent` 序列化**：自定義事件定義需隨 `ScenarioDefinition` 正確序列化/反序列化（JSON / localStorage），確保 `data.choices` 完整。
- **與 `interact-object` 目標的配合**：自定義事件（如靈泉）可作為 `interact-object` 目標的 `targetId`，需確保編譯後事件的 `id` 與目標 `targetId` 一致。
