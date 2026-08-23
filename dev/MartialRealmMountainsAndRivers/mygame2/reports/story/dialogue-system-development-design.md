# 對話編排系統開發設計文件（Dialogue System Development Design）

本文件規範《武行山河》「對話編排系統」的遊戲端實作架構，作為**編輯器對話編排功能（`DialogueEditorModal`）的前置依賴**。依《scenario-editor-design.md》第十一點五節「實際程式碼對照與補充建議」的精神——**先實作遊戲端消費者，再回頭校正編輯器 Schema 的生產者**——本文件聚焦於遊戲端如何承載、觸發、消費對話資料，並在最末節回饋編輯器 Schema 應同步修正的欄位。

---

## 一、設計定位與前置決策

### 1.1 為何先做遊戲端、再做編輯器

| 面向 | 先做編輯器的風險 | 先做遊戲端的收益 |
| :--- | :--- | :--- |
| **Schema 落地** | `triggerCondition`、`triggerParam`、對話佇列消費順序皆為設想，易與實際掛鉤點脫節 | 實作時自然浮現真正需要的欄位與上下文（如 `objectiveId` 格式、region 座標編碼） |
| **掛鉤點** | `on-objective-complete` / `on-defeat-boss` 無對應遊戲事件可掛 | 觸發條件直接掛在既有 `applyTargetDefeat`、`endPlayerTurn`、`reconstructRuin` 等動作上，掛鉤點自然成形 |
| **一鍵試玩閉環** | 試玩時對話根本不會觸發，只驗證了一半 | 遊戲端跑通後，編輯器試玩可完整驗證對話流程 |
| **欄位對齊** | 易發生「編輯器能填、遊戲沒讀」或「遊戲要、編輯器沒給」的兩邊對不上 | 遊戲端真實欄位回填 Schema，如同 11.5 節的 cross-reference 流程 |

**決策**：本文件所規範的遊戲端對話系統為 **M3-3（對話序列編排器）的前置里程碑**，獨立於編輯器之外先行開發。

### 1.2 與既有系統的相容原則
- **純狀態擴充**：對話狀態作為 `GameState` 的可選欄位（`campaignState`），不影響沙盒模式運行。
- **復用阻塞彈窗機制**：對話彈窗復用既有 `blockingModal` 機制（與 `ActionResultModal`、`PendingExplorationEventModal` 同層），不另立彈窗優先序系統。
- **復用探索事件暫存模式**：對話觸發若發生在「回合結束、敵人行動前後」之間，比照 `pendingCreatureTurn` 暫存機制處理，確保彈窗順序為「對話 → 敵人行動」而非同時出現。
- **資料驅動**：對話文本全數以結構化 Catalog 定義，不寫死於元件。

---

## 二、現況盤點與落差分析（Codebase Cross-Reference）

### 2.1 既有相關機制

| 機制 | 位置 | 與對話系統的關係 |
| :--- | :--- | :--- |
| **阻塞彈窗** | `types.ts` `BlockingModal`、`gameStore.confirmBlockingModal` | 對話彈窗將擴充此型別，復用同一套確認流程 |
| **探索事件暫存** | `gameStore.pendingCreatureTurn` / `flushPendingCreatureTurn` | 對話若在回合結束觸發，需比照此暫存模式 |
| **勝利判定** | `combatActions.applyTargetDefeat`（摧毀最後巢穴 → `gameWon`） | `on-defeat-boss` / `on-objective-complete` 掛鉤點 |
| **失敗判定** | `creatureAnimation.ts`（`allPlayersDefeated` / `anyBaseInactive`） | 失敗前是否插入失敗對話的掛鉤點 |
| **回合推進** | `turnActions.endPlayerTurn` / `startPlayerTurn` | `on-start`（開局）與回合相關觸發點 |
| **廢墟修復** | `ruinActions.reconstructRuin` | `reconstruct-ruin` 目標完成的掛鉤點 |
| **功法學習** | `sectGateActions.learnSkillAtSectGate`、`martialHallActions.learnSkillAtMartialHall` | `learn-skill` 目標完成的掛鉤點 |
| **建築建造** | `buildingActions.constructBuilding` / `constructDefenseStructure` | `build-building` / `build-defense-structure` 目標完成的掛鉤點 |
| **聲望/官階** | `governanceRules.applyPrestigeGain` / `applyConstructionPrestige` | `reach-prestige` 目標完成的掛鉤點 |
| **既有劇情設計** | `reports/story-campaign-system-design.md` | 已定義 `CampaignState`、`QuestObjective`、`StoryDialogueModal` 雛形，本文件為其「對話子系統」的深化實作 |

### 2.2 關鍵落差

1. **`GameState` 缺少 `campaignState` 欄位**：`types.ts` 的 `GameState` 目前完全沒有劇情模式欄位，`story-campaign-system-design.md` 設計的 `campaignState` 從未落地。
2. **`BlockingModal` 不支援對話型別**：目前僅 `{ type: 'action-result' } | null`，需擴充對話型別。
3. **無對話佇列（dialogueQueue）**：`story-campaign-system-design.md` 提及但未實作。
4. **無觸發條件掛鉤點**：`applyTargetDefeat` 等動作完成後，沒有任何「觸發對話檢查」的呼叫點。
5. **無對話 Catalog**：`storyDialogueCatalog.ts` 從未建立。
6. **`gameStore` 無對話相關方法**：`startDialogue`、`advanceDialogue`、`skipDialogue` 皆缺。

---

## 三、系統架構與資料模型

### 3.1 資料結構定義

```ts
// src/game/types.ts（擴充）

/** 對話觸發條件類型。採開放式字串，供未來擴充自訂條件。 */
export type DialogueTriggerCondition =
  | 'on-start'                // 關卡開局時觸發
  | 'on-objective-complete'   // 特定任務目標達成時觸發（triggerParam = objectiveId）
  | 'on-enter-region'         // 玩家進入指定區域時觸發（triggerParam = "row,column" 或 region id）
  | 'on-defeat-boss'          // 擊敗首領時觸發（triggerParam = creatureId）
  | 'on-round-reached'        // 到達指定回合時觸發（triggerParam = round number）
  | 'on-failure'              // 失敗結算前觸發
  | 'on-victory'              // 勝利結算前觸發
  | string                    // 開放式擴充

/** 對話佇列中單一步驟的運行時狀態。 */
export type DialogueQueueEntry = {
  stepId: string              // 對應 ScenarioDialogueStep.id
  speakerName: string
  speakerIcon: string
  content: string
  triggerCondition: DialogueTriggerCondition
  triggerParam?: string
  /** 是否已顯示完畢（供跳過/還原用）。 */
  consumed?: boolean
}

/** 劇情模式運行時狀態。 */
export type CampaignState = {
  /** 當前章節索引（0 = 序章）。 */
  currentChapter: number
  /** 已觸發過的對話 stepId 集合（避免重複觸發）。 */
  triggeredDialogueIds: string[]
  /** 待顯示的對話佇列（FIFO；一次可能有多句排隊）。 */
  dialogueQueue: DialogueQueueEntry[]
  /** 任務目標運行時狀態（與 story-campaign-system-design.md 的 QuestObjective 對齊）。 */
  activeObjectives: Array<{
    id: string
    title: string
    type: string
    targetValue: number
    currentValue: number
    completed: boolean
    isOptional?: boolean
  }>
  /** 失敗條件運行時狀態。 */
  failConditions: {
    maxRounds?: number
    baseMustSurvive?: boolean
    playerMustSurvive?: boolean
    criticalBases?: string[]
    maxLostBasesCount?: number
  }
}

// BlockingModal 擴充
export type BlockingModal =
  | { type: 'action-result'; result: ActionResult; continuation: ActionContinuation }
  | { type: 'story-dialogue'; entry: DialogueQueueEntry; remaining: number }
  | null

// GameState 擴充
export type GameState = {
  // ...existing fields...
  campaignState?: CampaignState
}
```

### 3.2 對話 Catalog

```ts
// src/game/catalogs/storyDialogueCatalog.ts（新增）

export type ScenarioDialogueStep = {
  id: string
  speakerName: string
  speakerIcon: string
  content: string
  triggerCondition: DialogueTriggerCondition
  triggerParam?: string
  /** 執行此對話後是否一併結束本章（用於 on-victory / on-failure 結算對話）。 */
  endsChapter?: boolean
  customMetadata?: Record<string, unknown>
}

/** 以章節 ID 索引的對話清單。 */
export const storyDialogueCatalog: Record<string, ScenarioDialogueStep[]> = {
  'prologue-village': [
    { id: 'prologue-start-1', speakerName: '村長 趙無極', speakerIcon: '👴', content: '少俠，青石村近來妖氣頻生...', triggerCondition: 'on-start' },
    { id: 'prologue-boss-defeat-1', speakerName: '村長 趙無極', speakerIcon: '👴', content: '妖物已除，青石村得救了！', triggerCondition: 'on-defeat-boss', triggerParam: 'boss-prologue' },
  ],
}
```

### 3.3 模組與檔案結構

```
src/game/
├── types.ts                          # [擴充] CampaignState、DialogueQueueEntry、BlockingModal
├── catalogs/
│   └── storyDialogueCatalog.ts       # [新增] 對話文本資料
├── rules/
│   └── dialogueTriggerRules.ts      # [新增] 觸發條件比對純函式
├── actions/
│   └── dialogueActions.ts            # [新增] 對話佇列操作純函式
src/components/
├── StoryDialogueModal.tsx            # [新增] 對話彈窗元件
src/components/overlays/
└── SystemOverlays.tsx                # [擴充] 掛載 StoryDialogueModal
reports/
└── dialogue-system-development-design.md  # 本文件
```

---

## 四、觸發條件掛鉤點設計（Trigger Hook Points）

### 4.1 掛鉤點總覽

| 觸發條件 | 掛鉤位置 | 觸發時機 | 傳遞上下文 |
| :--- | :--- | :--- | :--- |
| `on-start` | `gameStore.startCampaignChapter` | 章節載入完成後 | `chapterId` |
| `on-objective-complete` | `campaignRules.checkObjectiveCompletion` | 目標 `currentValue` 達 `targetValue` 時 | `objectiveId` |
| `on-enter-region` | `movePlayerAction` | 玩家移動後座標落入指定區域 | `"row,column"` |
| `on-defeat-boss` | `applyTargetDefeat`（`isBoss` 旗標） | Boss 生物被擊殺時 | `creatureId` |
| `on-round-reached` | `endPlayerTurnAction` | 回合數遞增後比對 | `round` 字串 |
| `on-failure` | `creatureAnimation` 失敗判定後 | `gameOver = true` 設定前 | 無 |
| `on-victory` | `applyTargetDefeat` 最後巢穴摧毀時 | `gameWon = true` 設定前 | 無 |

### 4.2 觸發流程（Trigger Flow）

```text
Stage 1: 遊戲動作發生（如擊殺 Boss）
  └─ 動作函式（applyTargetDefeat）回傳新 state 前
  └─ 呼叫 dialogueTriggerRules.collectTriggeredDialogues(state, { type: 'on-defeat-boss', param: creatureId })
  └─ 比對 storyDialogueCatalog 中 triggerCondition === 'on-defeat-boss' && triggerParam === creatureId 的步驟
  └─ 過濾已觸發過的 stepId（triggeredDialogueIds）
  └─ 將符合的步驟推入 campaignState.dialogueQueue

Stage 2: 佇列消費
  └─ gameStore 偵測 dialogueQueue 非空且 blockingModal 為 null
  └─ 取出佇列首項，設定 blockingModal = { type: 'story-dialogue', entry, remaining: queue.length }
  └─ 凍結地圖交互（operation = 'idle'）

Stage 3: 玩家推進
  └─ 玩家點擊「繼續」或按 Space/Enter
  └─ gameStore.advanceDialogue()
  └─ 將 entry.stepId 寫入 triggeredDialogueIds
  └─ 清除 blockingModal
  └─ 若佇列仍有剩餘，立即顯示下一句；否則恢復地圖交互

Stage 4: 跳過
  └─ 玩家點擊「跳過對話」或按 Esc
  └─ gameStore.skipDialogue()
  └─ 將佇列所有 stepId 寫入 triggeredDialogueIds
  └─ 清空 dialogueQueue 與 blockingModal
```

### 4.3 與敵人行動暫存的協調

當對話在 `endPlayerTurn` 流程中觸發（如 `on-round-reached` 或 `on-objective-complete` 在回合結束時達成）：

```text
endPlayerTurn
  ├─ 計算敵人行動（scheduledCreatureTurn）
  ├─ 偵測對話觸發 → 推入 dialogueQueue
  ├─ 若 dialogueQueue 非空：
  │    ├─ 暫存 scheduledCreatureTurn（比照 pendingCreatureTurn 機制）
  │    ├─ 顯示對話彈窗
  │    └─ 對話佇列清空後，由 advanceDialogue 呼叫 flushPendingCreatureTurn
  └─ 若無對話：維持原流程，立即執行敵人行動
```

**實作要點**：`pendingCreatureTurn` 目前僅供探索事件使用，需擴充為「對話與探索事件共用」的暫存機制，或新增獨立的 `pendingDialogueCreatureTurn`。建議**擴充既有機制**以避免雙暫存衝突。

---

## 五、UI 與彈窗規範

### 5.1 StoryDialogueModal 元件規範

| 元件名稱 | 元件類型 | 狀態 | 動作與反饋 |
| :--- | :--- | :--- | :--- |
| `SpeakerAvatar` | Icon/Avatar | active | 顯示 `speakerIcon`（如 👴、🐺） |
| `SpeakerNameLabel` | Typography.Text | active | 顯示 `speakerName` |
| `DialogueText` | Typography.Paragraph | typing / complete | 支援打字機效果；點擊可立即完整顯示 |
| `ContinueButton` | Button (Primary) | active | 推進下一句；快捷鍵 Space/Enter |
| `SkipButton` | Button (Ghost) | active | 跳過全部剩餘對話；快捷鍵 Esc |
| `QueueIndicator` | Typography.Text | active | 顯示 `3/7` 形式的進度指示 |

### 5.2 彈窗優先序

`blockingModal` 為單一欄位，同一時間僅能顯示一個彈窗。優先序如下：

1. `story-dialogue`（對話）— 最高優先，凍結所有地圖交互
2. `action-result`（行動結果）— 對話清空後才顯示
3. `pendingExplorationEvent`（探索事件）— 既有機制，與對話共用暫存

**衝突處理**：若對話與探索事件同時觸發，對話優先（對話通常是劇情關鍵節點）。實作上 `collectTriggeredDialogues` 在推入佇列後，`gameStore` 優先消費 `dialogueQueue`，再處理 `pendingExplorationEvent`。

### 5.3 GameOver 整合

`on-victory` / `on-failure` 對話需在 `GameOverModal` 顯示前播畢：

```text
gameOver/gameWon 判定為 true
  ├─ 若有 on-victory / on-failure 對話 → 先顯示對話
  └─ 對話佇列清空後 → 顯示 GameOverModal
```

`GameOverModal` 的 `open` 條件需調整為：`gameOver && dialogueQueueEmpty` 或 `gameWon && dialogueQueueEmpty`。

---

## 六、開發里程碑與逐步測試計畫

### Phase 1：資料模型與 Catalog 骨架

#### Milestone D1-1：型別擴充與空 Catalog
- **開發任務**：
  1. `types.ts` 擴充 `CampaignState`、`DialogueQueueEntry`、`BlockingModal` 對話型別。
  2. `GameState` 新增可選 `campaignState?: CampaignState`。
  3. 新增 `storyDialogueCatalog.ts`，先放入序章 2 句 `on-start` 對話作為測試資料。
- **測試方式**：
  - 自動測試：`types.test.ts` 確認 `GameState` 含 `campaignState` 可選欄位。
  - 自動測試：Catalog 載入後能以章節 ID 查詢對話清單。
- **驗收標準**：✅ 型別擴充不破壞既有 `GameState` 使用處；`npm run build` 通過。

#### Milestone D1-2：對話佇列操作純函式
- **開發任務**：
  1. `dialogueActions.ts` 實作：
     - `enqueueDialogue(state, steps): GameState` — 推入佇列
     - `dequeueDialogue(state): { state, entry | null }` — 取出首項
     - `markDialogueTriggered(state, stepId): GameState` — 寫入已觸發集合
     - `skipAllDialogue(state): GameState` — 清空佇列並全部標記已觸發
  2. 確保純函式、不可變更。
- **測試方式**：
  - 自動測試：`dialogueActions.test.ts` 覆蓋推入/取出/標記/跳過序列。
- **驗收標準**：✅ 佇列操作正確、已觸發集合不重複。

### Phase 2：觸發條件引擎

#### Milestone D2-1：觸發條件比對純函式
- **開發任務**：
  1. `dialogueTriggerRules.ts` 實作 `collectTriggeredDialogues(state, trigger): ScenarioDialogueStep[]`。
  2. 比對邏輯：`triggerCondition` 相符 + `triggerParam` 相符 + 尚未觸發過。
  3. 支援所有 7 種觸發條件（`on-start`、`on-objective-complete`、`on-enter-region`、`on-defeat-boss`、`on-round-reached`、`on-failure`、`on-victory`）。
- **測試方式**：
  - 自動測試：`dialogueTriggerRules.test.ts` 覆蓋每種觸發條件的正向與反向（已觸發過不重複）。
- **驗收標準**：✅ 所有觸發條件比對正確、不重複觸發。

#### Milestone D2-2：掛鉤點接入
- **開發任務**：
  1. `applyTargetDefeat` 擴充：擊殺 Boss 後呼叫 `collectTriggeredDialogues` 並 `enqueueDialogue`。
  2. `endPlayerTurnAction` 擴充：回合遞增後檢查 `on-round-reached`。
  3. `movePlayerAction` 擴充：移動後檢查 `on-enter-region`。
  4. `creatureAnimation` 擴充：失敗/勝利判定後檢查 `on-failure` / `on-victory`。
  5. 新增 `gameStore.startCampaignChapter(chapterId)`：載入章節並觸發 `on-start`。
- **測試方式**：
  - 自動測試：模擬擊殺 Boss 後 `dialogueQueue` 含正確步驟。
  - 自動測試：回合到達指定數後觸發對話。
- **驗收標準**：✅ 所有掛鉤點正確觸發、佇列正確填充。

### Phase 3：彈窗 UI 與佇列消費

#### Milestone D3-1：StoryDialogueModal 元件
- **開發任務**：
  1. 實作 `StoryDialogueModal.tsx`：頭像、名稱、對話文、繼續/跳過按鈕、進度指示。
  2. 支援打字機效果（可選，先以完整顯示為主）。
  3. 鍵盤快捷鍵：Space/Enter 推進、Esc 跳過。
- **測試方式**：
  - 手動確認：注入測試對話佇列後，彈窗正確顯示，按鈕可推進/跳過。
- **驗收標準**：✅ 彈窗渲染正常、推進/跳過行為正確。

#### Milestone D3-2：gameStore 對話方法與 blockingModal 整合
- **開發任務**：
  1. `gameStore` 新增：
     - `advanceDialogue()` — 推進下一句
     - `skipDialogue()` — 跳過全部
  2. `updateGameState` 內偵測：`dialogueQueue` 非空且 `blockingModal` 為 null 時，自動取出首項設定 `blockingModal = { type: 'story-dialogue', ... }`。
  3. `SystemOverlays` 擴充：`blockingModal.type === 'story-dialogue'` 時渲染 `StoryDialogueModal`。
- **測試方式**：
  - 手動確認：注入 3 句對話，點繼續 3 次後彈窗關閉、地圖恢復交互。
  - 自動測試：`advanceDialogue` 正確更新 `triggeredDialogueIds`。
- **驗收標準**：✅ 佇列消費流暢、blockingModal 切換正確。

#### Milestone D3-3：與敵人行動暫存協調
- **開發任務**：
  1. 擴充 `pendingCreatureTurn` 機制：對話觸發時也暫存敵人行動。
  2. `advanceDialogue` 在佇列清空後，若 `pendingCreatureTurn` 存在則呼叫 `flushPendingCreatureTurn`。
  3. 確保彈窗順序：對話 → 探索事件結果 → 敵人行動。
- **測試方式**：
  - 手動確認：回合結束觸發對話時，敵人行動延後至對話結束後執行。
- **驗收標準**：✅ 對話與敵人行動不重疊、順序正確。

### Phase 4：GameOver 整合與序章驗證

#### Milestone D4-1：勝利/失敗對話與 GameOverModal 協調
- **開發任務**：
  1. `on-victory` / `on-failure` 對話在 `GameOverModal` 顯示前播畢。
  2. `GameOverModal.open` 條件調整為 `gameOver && dialogueQueueEmpty`。
  3. `endsChapter` 旗標：對話播畢後自動觸發章節結算。
- **測試方式**：
  - 手動確認：擊殺最後首領後，先顯示勝利對話，再顯示 GameOverModal。
- **驗收標準**：✅ 勝利/失敗對話不漏接、GameOverModal 時機正確。

#### Milestone D4-2：序章對話完整串接
- **開發任務**：
  1. `storyDialogueCatalog` 完整填入序章對話（開局、擊殺 Boss、勝利結算）。
  2. `gameStore.startCampaignChapter('prologue-village')` 完整實作。
  3. 從主選單進入劇情模式 → 序章 → 開局對話 → 遊戲 → 擊殺 Boss → 勝利對話 → 結算。
- **測試方式**：
  - 手動冒煙測試：完整通關序章，對話觸發時機正確。
- **驗收標準**：✅ 序章對話流程無卡頓、無漏接。

### 里程碑總覽與依賴關係

```text
D1-1 型別擴充與空 Catalog
  └─ D1-2 對話佇列操作純函式
       └─ D2-1 觸發條件比對純函式
            └─ D2-2 掛鉤點接入
                 └─ D3-1 StoryDialogueModal 元件
                      └─ D3-2 gameStore 對話方法與 blockingModal 整合
                           └─ D3-3 與敵人行動暫存協調
                                └─ D4-1 勝利/失敗對話與 GameOverModal 協調
                                     └─ D4-2 序章對話完整串接
```

---

## 七、回饋編輯器 Schema 修正建議

依本文件實作結果，`scenario-editor-design.md` 的 `ScenarioDialogueStep` 應同步修正以下欄位：

### 7.1 觸發條件列舉擴充

原設計僅 4 種，遊戲端實作後發現需要：

```ts
triggerCondition:
  | 'on-start'
  | 'on-objective-complete'
  | 'on-enter-region'
  | 'on-defeat-boss'
  | 'on-round-reached'    // 新增：到達指定回合
  | 'on-failure'           // 新增：失敗結算前
  | 'on-victory'           // 新增：勝利結算前
  | string                 // 開放式擴充
```

### 7.2 新增 `endsChapter` 旗標

```ts
export type ScenarioDialogueStep = {
  // ...existing fields...
  /** 執行此對話後是否一併結束本章（用於 on-victory / on-failure 結算對話）。 */
  endsChapter?: boolean
}
```

### 7.3 `triggerParam` 格式規範化

| 觸發條件 | `triggerParam` 格式 | 範例 |
| :--- | :--- | :--- |
| `on-objective-complete` | objectiveId | `"obj-defeat-boss"` |
| `on-enter-region` | `"row,column"` 或 region id | `"5,7"` 或 `"region-forest-core"` |
| `on-defeat-boss` | creatureId | `"boss-treant"` |
| `on-round-reached` | round number 字串 | `"15"` |

### 7.4 編輯器 `DialogueEditorModal` 對應調整

- 觸發條件下拉需新增 `on-round-reached`、`on-failure`、`on-victory` 三個選項。
- `triggerParam` 輸入框依觸發條件動態切換：
  - `on-round-reached` → InputNumber
  - `on-enter-region` → 座標輸入或 Target Picker（點選地圖區域）
  - `on-objective-complete` → 從既有任務目標清單下拉
  - `on-defeat-boss` → 從地圖 Boss 物件下拉
- 新增 `endsChapter` Switch（僅 `on-victory` / `on-failure` 時顯示）。

---

## 八、驗收與測試標準（Definition of Done）

- [ ] `dialogueActions.test.ts` 覆蓋佇列推入/取出/標記/跳過序列。
- [ ] `dialogueTriggerRules.test.ts` 覆蓋所有 7 種觸發條件的正向與反向。
- [ ] `gameStore` 對話方法（`advanceDialogue`、`skipDialogue`、`startCampaignChapter`）單元測試通過。
- [ ] 序章手動冒煙測試：開局對話 → 遊戲 → 擊殺 Boss → 勝利對話 → 結算，流程無卡頓。
- [ ] 對話與敵人行動暫存協調正確，彈窗順序為「對話 → 探索事件結果 → 敵人行動」。
- [ ] `npm run test` 與 `npm run build` 全數通過。
- [ ] 回饋編輯器 Schema 修正建議已更新至 `scenario-editor-design.md`。
