# 通用 AI 系統重構開發文件

- 文件狀態：Draft
- 文件版本：v0.2
- 建立日期：2026-08-15
- 適用範圍：Creature AI、玩家陣營 AI、AI 行動驗證、AI 回合排程、AI 行動日誌
- 前置文件：`ai-strategy-and-construction-development-design.md`
- 重構原則：先抽共用核心，再逐步遷移現有 AI；每個階段都必須保持既有行為可驗證

---

## 1. 重構目標

### 1.1 核心目標

- 建立可同時支援 Creature 與玩家陣營 AI 的通用 AI 基礎核心。
- 統一 AI 的感知、目標、路徑、行動、驗證、執行、日誌與回合排程邊界。
- 保留 Creature 與玩家 AI 的陣營、角色、戰略命令與行為偏好差異。
- 移除玩家 AI 對 UI Preview API 的依賴。
- 降低 `App.tsx`、`gameStore.ts`、`creatureActions.ts` 之間的耦合。
- 讓 AI 行動可以在固定地圖、無 UI 環境中測試與重播。
- 支援未來的建設 AI、逐步動畫、全域遊戲日誌與 Replay。
- 支援以 JSON 調整 AI 的條件、優先級、參數與行為順序，不因一般平衡調整修改核心程式碼。

### 1.2 非目標

- 不把 Creature 與玩家 AI 合併成同一套行為樹。
- 不移除玩家設定的 `AiOrder` 與 `AiConstructionPlan`。
- 不改變既有 Creature 行為優先級，除非新增測試先確認行為差異。
- 不在本文件第一階段實作複雜的自主戰略規劃。
- 不讓 AI 直接修改 `GameState`，所有狀態變更仍需透過 domain action 或 reducer。
- 不允許 JSON 執行任意 JavaScript 或任意程式碼。

### 1.3 重構前基線

目前系統已具備：

- `aiDefenseRules.ts`：玩家 AI 防守決策。
- `aiSupportRules.ts`：玩家 AI 支援決策。
- `aiSelfPreservationRules.ts`：玩家 AI 自保決策。
- `gameStore.runAiDefenseStep()`：玩家 AI 防守執行。
- `gameStore.runAiSupportStep()`：玩家 AI 支援執行。
- `creatureBehaviorRules.ts`：Creature 目標選擇與行為類型。
- `creatureActions.ts`：Creature 移動、攻擊、生成與回合結算。
- `creatureAnimation.ts`：Creature 回合結果套用與目前的批次結算流程。
- `CreatureActionLog`：Creature 行動紀錄。
- `AiOrder`、`AiConstructionPlan`：玩家設定的 AI 命令與建設計畫。

---

## 2. 目前問題與重構理由

### 2.1 Creature 與玩家 AI 使用不同執行模型

```text
Creature：選目標 → 直接移動 → 直接攻擊 → 批次回傳結果
玩家 AI：讀命令 → 自保 → 單步決策 → Store 執行 → React timer 再次觸發
```

問題：

- 感知與目標資料結構不一致。
- 距離、阻擋、威脅評估各自重複實作。
- 行動驗證與行動執行分散。
- Creature 仍將大量規則集中在 `moveCreatures()`。
- 玩家 AI 攻擊依賴 `previewAttackTarget()`，造成 UI 與 domain 邏輯耦合。

### 2.2 Creature 目標與路徑不一致

- Creature 主要使用 Manhattan 距離選擇目標。
- Creature 移動使用 greedy 逐格靠近。
- 牆壁、地形成本、其他 Actor、據點與設施可能使目標不可達。
- 目標不可達時目前缺少統一的重新感知與重新規劃流程。

### 2.3 Creature 回合結果與動畫協定不一致

- `moveCreatures()` 產生 `steps`。
- `creatureAnimation.ts` 目前一次性套用最終結果。
- `activeCreatureId` 沒有完整動畫消費流程。
- `creatureTurnInProgress` 只短暫存在，玩家難以觀察逐步行動。
- `CreatureTurnResult` 同時攜帶行動結果與完整世界 snapshot，存在覆蓋其他回合狀態的風險。

### 2.4 玩家 AI 執行框架重複

`runAiDefenseStep()` 與 `runAiSupportStep()` 都重複：

- Actor 與命令驗證。
- 自保判斷。
- 移動執行。
- 攻擊執行。
- 失敗處理。
- 結束回合。

### 2.5 AI Scheduler 與 React UI 耦合

- `App.tsx` 使用 `useEffect + setTimeout` 驅動 AI。
- AI 行為依賴 React 元件掛載。
- 不利於 headless simulation、Replay、伺服器執行與穩定的回合測試。
- timer closure 可能持有舊的 Actor 或命令資料。

### 2.6 隨機行為不可完整重現

- 部分 Creature 巡邏使用 `Math.random()`。
- 其他系統使用可注入的 random source。
- 相同存檔與 seed 不一定能重現相同 AI 行動。

---

## 3. 通用 AI 分層架構

```text
GameState
   ↓
Actor Adapter
   ↓
Perception 感知
   ↓
Emergency Policy 自保／系統規則
   ↓
Goal Policy 戰略命令／Creature 行為
   ↓
Planner 戰術決策
   ↓
AiAction
   ↓
Action Validator
   ↓
Action Executor / Domain Action
   ↓
AiEvent / GameLog
   ↓
State Reducer
   ↓
Turn Scheduler / Animation Consumer
```

### 3.1 各層責任

| 層級 | 責任 | 不應負責 |
|---|---|---|
| Actor Adapter | 將 Player／Creature 轉為通用 Actor 介面 | 修改遊戲狀態 |
| Perception | 產生可見目標、可達位置、威脅 | 決定最終行動 |
| Emergency Policy | 自保、死亡、包圍、必敗判斷 | 讀取 UI 狀態 |
| Goal Policy | 保護據點、支援玩家、Creature 行為偏好 | 直接修改 State |
| Planner | 從感知與目標產生單一 `AiAction` | 執行 action |
| Validator | 確認 Actor、目標、距離、體力與回合合法 | 自行選擇另一個目標 |
| Executor | 呼叫 domain action 並產生結果 | 顯示 UI |
| Event Log | 記錄可觀察行動 | 重新決策 |
| Scheduler | 控制 Actor 回合與重試 | 實作目標評分 |

---

## 4. 通用資料模型

### 4.1 Actor 參照

```ts
type AiActorKind = 'player' | 'creature'
t
type AiActorRef = {
  id: string
  kind: AiActorKind
}
```

規則：

- `player` 對應 `PlayerState`。
- `creature` 對應 `CreatureState`。
- 不用把兩種 State 合併成單一資料型別。
- 透過 Adapter 取得共同欄位。

### 4.2 Actor Snapshot

```ts
type AiActorSnapshot = {
  ref: AiActorRef
  position: Position
  health: number
  maxHealth: number
  stamina: number
  maxStamina: number
  alive: boolean
  faction: 'players' | 'creatures'
}
```

### 4.3 通用目標參照

```ts
type AiTargetKind = 'player' | 'creature' | 'nest' | 'base' | 'resource' | 'defense'

type AiTargetRef = {
  id: string
  kind: AiTargetKind
  position: Position
}
```

### 4.4 通用行動

```ts
type AiAction =
  | {
      type: 'move'
      actor: AiActorRef
      destination: Position
      path?: Position[]
      cost?: number
      reason: string
    }
  | {
      type: 'attack'
      actor: AiActorRef
      target: AiTargetRef
      reason: string
    }
  | {
      type: 'collect'
      actor: AiActorRef
      target: AiTargetRef
      reason: string
    }
  | {
      type: 'build'
      actor: AiActorRef
      baseId: string
      buildingType: string
      reason: string
    }
  | {
      type: 'hold'
      actor: AiActorRef
      reason: string
    }
  | {
      type: 'end-turn'
      actor: AiActorRef
      reason: string
    }
```

規則：

- AI 決策層只產生 `AiAction`。
- `AiAction` 不包含完整 `GameState`。
- 執行前必須重新驗證目標與成本。
- 舊的 `AiDefenseAction` 可暫時透過 Adapter 轉換。

### 4.5 AI 行動事件

```ts
type AiActionEvent = {
  id: string
  round: number
  actor: AiActorRef
  action: AiAction
  result: 'started' | 'succeeded' | 'failed'
  reason?: string
  createdAt: string
}
```

規則：

- 重要 AI 行動寫入全域遊戲日誌。
- Creature 與玩家 AI 使用同一事件格式。
- UI 動畫只消費事件，不負責決定行動。
- 事件應可序列化，以支援存檔與 Replay。

---

## 5. Perception 感知層

### 5.1 感知資料

```ts
type AiPerception = {
  actor: AiActorSnapshot
  visibleActors: AiActorSnapshot[]
  targets: AiTargetRef[]
  reachablePositions: Array<{
    position: Position
    cost: number
    path?: Position[]
  }>
  threats: AiThreatAssessment[]
}
```

### 5.2 共用感知函式

建議新增：

```text
src/game/ai/perception/distance.ts
src/game/ai/perception/actorAdapters.ts
src/game/ai/perception/blockedPositions.ts
src/game/ai/perception/targetDiscovery.ts
src/game/ai/perception/threatAssessment.ts
src/game/ai/perception/reachablePositions.ts
```

共用責任：

- Manhattan 距離。
- Actor 是否存活。
- 可見目標篩選。
- 阻擋位置整理。
- 地形與體力成本。
- 可達位置與路徑。
- 目標是否仍然有效。

### 5.3 路徑演算法規則

- 所有 Actor 必須使用同一套可達性驗證。
- 地形成本不同時，使用 Dijkstra 或 A*，不可只依賴 greedy 距離。
- 沒有路徑時，感知層應標記目標不可達。
- 目標不可達時，Planner 必須重新選擇目標或返回待命。
- 路徑必須避開牆壁、不可通行物件與其他 Actor。

### 5.4 隨機性規則

```ts
type RandomSource = () => number
```

- Creature 巡邏、目標平手選擇與隨機行動必須注入 `RandomSource`。
- 不得在 domain AI 直接呼叫 `Math.random()`。
- 相同 seed 與相同 GameState 應產生相同 AI 決策。

---

## 6. Data-Driven AI JSON 設定

### 6.1 設計原則

- JSON 只描述 AI 的條件、參數、優先級、目標權重與行為順序。
- TypeScript 保留感知、路徑、規則驗證、行動執行與 State 更新能力。
- JSON 不得包含 `eval`、JavaScript 原始碼、函式文字或動態 import。
- Creature 與玩家 AI 可以使用不同 JSON Policy，但共用通用 AI 核心。
- 玩家設定的 `AiOrder` 是當前任務；JSON 是 AI 的基礎人格與行為偏好。

### 6.2 JSON 與玩家命令的分工

```text
系統自保規則
    ↓
玩家 AiOrder
    ↓
JSON Policy 優先級與行為參數
    ↓
通用 Planner
    ↓
AiAction
```

- 系統自保永遠高於 JSON 與玩家命令。
- 玩家命令決定「守哪裡、支援誰、管理哪個據點」。
- JSON 決定「在任務中偏好如何行動」。
- JSON 不得修改或接管其他 AI 的玩家命令。

### 6.3 JSON 設定型別

```ts
type AiConditionId =
  | 'self-preservation-needed'
  | 'adjacent-hostile'
  | 'protect-base-threatened'
  | 'outside-defense-radius'
  | 'support-target-too-far'
  | 'no-threat'
  | 'no-target'

type AiActionId =
  | 'retreat'
  | 'attack-adjacent-hostile'
  | 'intercept-threat'
  | 'return-to-base-radius'
  | 'follow-support-target'
  | 'collect-resource'
  | 'wander'
  | 'hold-position'
  | 'end-turn'

type AiJsonPolicy = {
  id: string
  version: number
  actorKind: 'player' | 'creature'
  emergency?: {
    minimumHealthPercent?: number
    surroundedEnemyCount?: number
    avoidFatalAttack?: boolean
  }
  priorities: Array<{
    condition: AiConditionId
    action: AiActionId
    priority: number
  }>
  parameters?: Record<string, number | boolean | string>
}
```

### 6.4 JSON 範例：玩家防守型 AI

```json
{
  "id": "defensive-guardian",
  "version": 1,
  "actorKind": "player",
  "emergency": {
    "minimumHealthPercent": 10,
    "surroundedEnemyCount": 2,
    "avoidFatalAttack": true
  },
  "priorities": [
    { "condition": "self-preservation-needed", "action": "retreat", "priority": 100 },
    { "condition": "adjacent-hostile", "action": "attack-adjacent-hostile", "priority": 90 },
    { "condition": "protect-base-threatened", "action": "intercept-threat", "priority": 80 },
    { "condition": "outside-defense-radius", "action": "return-to-base-radius", "priority": 70 },
    { "condition": "no-threat", "action": "hold-position", "priority": 10 }
  ]
}
```

### 6.5 JSON 範例：Creature 攻城型 AI

```json
{
  "id": "creature-sieger",
  "version": 1,
  "actorKind": "creature",
  "priorities": [
    { "condition": "self-preservation-needed", "action": "retreat", "priority": 100 },
    { "condition": "adjacent-hostile", "action": "attack-adjacent-hostile", "priority": 95 },
    { "condition": "protect-base-threatened", "action": "intercept-threat", "priority": 80 },
    { "condition": "no-target", "action": "wander", "priority": 10 }
  ]
}
```

### 6.6 設定檔來源

第一階段建議使用內建 JSON：

```text
src/game/ai/configs/
  defensive-guardian.json
  creature-sieger.json
  creature-scavenger.json
```

後續如需不重新 build 即可調參，再支援：

```text
public/ai-configs/*.json
```

外部 JSON 必須經過版本檢查與 Schema 驗證，載入失敗時使用內建 fallback。

### 6.7 白名單與驗證規則

- `id` 必須存在且唯一。
- `version` 必須是目前支援版本。
- `actorKind` 必須是 `player` 或 `creature`。
- `condition` 必須屬於 `AiConditionId` 白名單。
- `action` 必須屬於 `AiActionId` 白名單。
- `priority` 必須是有限數值。
- 生命百分比必須介於 `0～100`。
- 距離、範圍、數量不得為負數。
- 無效設定必須記錄錯誤並使用 fallback，不得讓 AI 回合卡死。

### 6.8 JSON 載入與 fallback 流程

#### Stage

- 系統依 AI Policy ID 取得 JSON 設定。

#### System Response

- 解析 JSON。
- 執行 Schema 與白名單驗證。
- 驗證成功後建立不可變 Policy。

#### State Change

- AI Scheduler 使用驗證後的 Policy。
- 設定內容不直接寫入 `GameState`，除非玩家命令或遊戲存檔明確保存 Policy ID。

#### Exception Handling

- 檔案不存在：使用同 actorKind 的預設 Policy。
- JSON 格式錯誤：記錄全域遊戲日誌，使用 fallback。
- 版本不支援：記錄錯誤，使用 fallback。
- 條件或行為不在白名單：拒絕該項目，不得執行任意內容。

### 6.9 JSON 可調整與不可調整項目

可由 JSON 調整：

- 行為優先級。
- 自保參數。
- Aggro 範圍與追擊距離。
- 目標類型權重。
- 建設選擇權重。
- 失敗重試次數。
- 巡邏與隨機行動權重。

不可由 JSON 直接定義：

- 任意 JavaScript。
- GameState 直接修改。
- 未註冊的 Action。
- 未通過 Validator 的移動、攻擊或建設。
- 人類玩家對 AI 命令的修改權限。

---

## 7. Emergency Policy 自保層

### 7.1 優先級

```text
1. 死亡或無法行動
2. AI 自保
3. 玩家 AI 戰略命令／Creature 行為
4. 戰術行動
5. 待命或結束回合
```

### 7.2 共用自保條件

- 生命值低於 Actor 或命令撤退門檻。
- 多名敵人包圍。
- 預估下一次攻擊會導致死亡。
- 行動後無法安全返回任務區域。
- 目標區域的威脅高於 Actor 可承受程度。
- Actor 已死亡或沒有行動資源。

### 7.3 陣營差異

自保判斷可以共用，但自保行動由 Policy 決定：

- 玩家 AI：返回指定據點、脫離敵人、結束回合。
- Creature Guardian：返回巢穴或守護區域。
- Creature Sieger：撤離防禦密集區，保留攻城能力。
- Creature Scavenger：放棄高風險資源點並巡邏。

### 7.4 自保規則

- 自保不是玩家可編輯的 `AiOrder`。
- 自保可以暫停或中斷當前目標，但不可修改玩家命令。
- 危險解除後，恢復原本 active Goal。
- 找不到安全路徑時，不得盲目移動；應 `hold` 或 `end-turn`。

---

## 8. Goal Policy 戰略／行為政策

### 8.1 玩家 AI Policy

#### Protect Base

- 目標：保護指定據點。
- 參數：`baseId`、`radius`、`priority`、`retreatHealthPercent`。
- 行為：防守、攔截、攻擊威脅、回到防守區域。

#### Support Player

- 目標：支援指定玩家。
- 參數：`playerId`、`maxDistance`、`priority`、`retreatHealthPercent`。
- 行為：靠近目標、攻擊阻擋敵人、支援目標附近戰鬥。
- 目標死亡時：命令改為 `paused`，AI 不再受該命令影響。

#### Construction

- 目標：按照單一 AI 的單一據點建設計畫執行。
- 參數：`baseId`、`policy`、`allowUpgrade`、`queue`。
- 行為：依佇列與建設方針選擇建築或升級。

### 8.2 Creature Policy

#### Scavenger

- 優先資源點。
- 沒有資源目標時再考慮玩家。
- 遇到高威脅時撤退或改變目標。

#### Hunter

- 優先存活玩家。
- 依 aggro range 搜尋目標。
- 不應因不可達目標永久卡住。

#### Sieger

- 優先據點與防禦設施。
- 攻城途中遇到更高威脅時重新評估。
- 不應透過隱含 fallback 攻擊任意設施。

#### Guardian

- 優先守護巢穴或 home position。
- 離開守護區域後應具備返回邏輯。

#### Wanderer / Roamer

- 低主動性巡邏。
- 只在警戒範圍內追蹤合法目標。
- 巡邏使用可重現的 RandomSource。

### 8.3 Policy 介面

```ts
type AiPolicy = {
  selectGoal: (perception: AiPerception, context: AiGoalContext) => AiGoal | null
  chooseAction: (perception: AiPerception, goal: AiGoal) => AiAction
}
```

- Policy 不得直接修改 State。
- Policy 不得呼叫 React、Modal 或 Store UI API。
- Policy 必須可在純單元測試中執行。

---

## 9. Planner 與 Action Validator

### 9.1 Planner

建議新增：

```text
src/game/ai/planner/planAiAction.ts
src/game/ai/planner/planPlayerAiAction.ts
src/game/ai/planner/planCreatureAction.ts
```

Planner 負責：

- 讀取 Perception。
- 讀取 Emergency Policy 結果。
- 讀取 Goal Policy。
- 產生單一 `AiAction`。
- 不執行 Action。

### 9.2 Action Validator

建議新增：

```ts
validateAiAction(state: GameState, action: AiAction): {
  valid: boolean
  reason?: string
}
```

驗證項目：

- Actor 是否存在、存活且屬於正確陣營。
- Actor 是否輪到行動。
- Creature phase / player phase 是否正確。
- 目標是否仍存在且存活。
- 目標是否仍在合法距離。
- 移動路徑是否仍可達。
- 體力是否足夠。
- 行動是否符合 active `AiOrder` 或 Creature Policy。
- 是否有 blocking modal 或其他不可執行狀態。

### 9.3 Stale Action 處理

- Action 在執行前必須重新驗證。
- 目標死亡、位置改變或成本變動時，Action 視為 stale。
- stale 不應直接讓 AI 結束整個回合。
- 應重新感知並重新規劃一次。
- 重試達上限後才 `hold` 或 `end-turn`。

---

## 10. Action Executor 與 Domain 邊界

### 10.1 AI Action Executor

建議新增：

```text
src/game/ai/execution/executeAiAction.ts
src/game/ai/execution/executeAiAttack.ts
src/game/ai/execution/executeAiMove.ts
src/game/ai/execution/executeAiBuild.ts
```

### 10.2 執行規則

- AI 不呼叫 `previewAttackTarget()`。
- UI Preview 只服務人類玩家互動。
- AI 攻擊使用原子 domain action。
- AI 移動使用既有 `movePlayerAction` 或通用移動 action。
- AI 建設使用建設 action 的 domain 版本。
- 執行結果回傳狀態變更與 `AiActionEvent`。

### 10.3 共用攻擊解析

Creature 與玩家 AI 的攻擊應逐步共用：

- 目標合法性。
- 距離檢查。
- 傷害計算。
- 目標生命變更。
- 反震、閃避、裝備耐久。
- 擊敗、獎勵與行動日誌。

但以下部分保留陣營差異：

- 玩家戰鬥獎勵。
- Creature 的攻城傷害。
- 玩家功法觸發。
- Creature Buff 與行為特效。

---

## 11. Turn Scheduler

### 11.1 統一入口

```ts
runAiTurnStep(state: GameState, actorId: AiActorRef): StepResult
```

流程：

1. 驗證 Actor 與回合。
2. 建立 Perception。
3. 執行 Emergency Policy。
4. 取得玩家命令或 Creature Policy。
5. 產生單一 `AiAction`。
6. 驗證 `AiAction`。
7. 執行 `AiAction`。
8. 產生 `AiActionEvent`。
9. 仍有行動資源時排程下一步。
10. 沒有合法行動時結束 Actor 回合。

### 11.2 Scheduler 狀態

```ts
type AiSchedulerState = {
  runningActorId: AiActorRef | null
  stepIndex: number
  retryCount: number
  cancelled: boolean
}
```

規則：

- 同一 Actor 不可同時執行兩個 Scheduler。
- AI 回合開始時建立 scheduler context。
- 行動完成後再重新感知，不使用舊 closure 的 State。
- Modal、Creature phase、Game Over 時暫停或取消。
- Scheduler 取消後不得執行 stale timer。

### 11.3 React 邊界

- React 只負責啟動、停止與顯示 Scheduler。
- Scheduler 不依賴 `App.tsx` 才能計算決策。
- `setTimeout` 只作為動畫節奏，不作為遊戲規則來源。

---

## 12. Creature 遷移規則

### Phase 1：保留舊行為，抽共用感知

- 保留 `moveCreatures()` 對外介面。
- 將距離、阻擋、目標存活與可達性移至通用感知模組。
- 將 Creature 原有目標優先級轉為 `CreaturePolicy`。
- `Math.random()` 改為注入 `RandomSource`。

驗收：

- 現有 Creature 測試全部通過。
- 相同 seed 得到相同巡邏結果。
- 不可達目標會重新選擇或安全待命。
- `blocked` 不再攻擊非原始目標的任意防禦設施。

### Phase 2：拆分 Creature Action

將 `moveCreatures()` 拆為：

```text
perceiveCreature()
selectCreatureTarget()
planCreatureAction()
validateCreatureAction()
executeCreatureAction()
reduceCreatureEvents()
```

- 先維持 `CreatureTurnResult` 相容格式。
- 測試穩定後，再改用 `AiActionEvent[]`。

### Phase 3：事件化回合結果

- 不再把完整 world snapshot 當作唯一結果。
- 改用事件或 patch reducer 套用狀態變化。
- 事件格式支援動畫、全域日誌與 Replay。

### Phase 4：逐步動畫

- 若採用逐步動畫，`steps` 必須由 Animator 實際消費。
- `activeCreatureId` 必須隨事件更新。
- `creatureTurnInProgress` 必須維持到最後一個事件完成。
- 動畫取消或讀檔時必須清理 scheduler 狀態。

---

## 13. 玩家 AI 遷移規則

### Phase 1：保留既有純函式

- 保留 `chooseDefenseAction()`。
- 保留 `chooseSupportAction()`。
- 保留 `chooseSelfPreservationAction()`。
- 新增 Adapter 將輸出轉為通用 `AiAction`。

### Phase 2：合併執行框架

將：

```text
runAiDefenseStep()
runAiSupportStep()
```

逐步改為：

```text
perceivePlayerAi()
chooseEmergencyAction()
choosePlayerOrderAction()
validateAiAction()
executeAiAction()
```

- 防守與支援只保留 Policy 差異。
- 移動、攻擊、失敗重試與結束回合共用。

### Phase 3：移出 App Scheduler

- 新增 `src/game/ai/aiTurnScheduler.ts`。
- `App.tsx` 不再直接決定 AI 下一步。
- React 只負責監聽 Scheduler 事件與渲染 UI。

### Phase 4：加入建設 Policy

- 新增 `chooseConstructionAction()`。
- 讀取 `AiConstructionPlan`。
- 驗證建築前置條件與材料。
- 執行建築 action。
- 更新 queue item 狀態：`planned`、`building`、`completed`、`blocked`、`cancelled`。

---

## 14. 測試規格

### 14.1 感知與路徑

- 同距離目標使用穩定 ID 排序。
- 死亡目標不可選。
- 目標超出警戒範圍不可選。
- 牆壁阻擋時可繞行。
- 不可達目標會重新選擇。
- 地形成本與體力消耗正確。
- 其他 Actor 阻擋時不可穿越。
- 移動目的地不可與物件重疊。

### 14.2 自保

- 生命值低於命令門檻時自保優先。
- 系統最低自保線不可被玩家命令覆蓋。
- 多敵人包圍時優先脫離。
- 沒有安全位置時 `hold` 或 `end-turn`。
- 自保不應移向更高威脅區。
- 自保後恢復原本 Goal。

### 14.3 Action Contract

每個 Action 都必須測試：

```text
perception → decision → validation → execution → event
```

必要情境：

- 目標在執行前死亡。
- 目標位置在執行前改變。
- 體力在執行前不足。
- Action stale 後重新規劃一次。
- 重試超過上限後安全結束回合。
- AI 不可透過 UI Preview API 執行攻擊。

### 14.4 回合生命週期

- 所有玩家行動完成後才進入 Creature phase。
- Creature phase 中不能執行玩家 AI。（A0：`gameStore.aiSteps.test.ts` 已覆蓋 store 守衛）
- Creature phase 結束後正確輪到下一位玩家。
- 同一 Actor 不會同時啟動兩個 Scheduler。
- Modal 開啟時 AI scheduler 暫停或取消。
- Modal 關閉後不會重複執行 stale action。
- Game Over 後不再排程 AI。
- 死亡 AI 正確結束回合。

### 14.5 Creature 行動

- `steps` 若保留，必須逐步更新 `activeCreatureId`。
- 中間事件不會覆蓋最新玩家、據點或資源狀態。
- Creature 不可進入 wall。
- Creature 不可攻擊非原始目標的任意防禦設施。
- 相同 RandomSource 與 State 產生相同結果。
- 生命值不會低於 0。

### 14.6 建設 AI

- 建築前置條件不足時標記 `blocked`。
- 建料不足時標記 `blocked`。
- `paused` 方針不主動建造，但可執行採集。
- 建築完成時更新 queue item 與全域日誌。
- 每位 AI 只管理一個據點建設計畫。

---

## 15. 分階段開發計畫

### Phase 1：共用純函式與型別

- Owner：AI Engineering
- Status：Todo
- Priority：P0
- Acceptance Criteria：
  - 共用距離、阻擋、存活、目標與可達性函式完成。
  - `AiAction` 型別完成。
  - 不改變既有外部行為。
- Test Method：
  - 共用感知單元測試。
  - 既有 43 個測試檔全部通過。

### Phase 2：AI Action Validator / Executor

- Owner：AI Engineering
- Status：Todo
- Priority：P0
- Acceptance Criteria：
  - 玩家 AI 攻擊不再使用 Preview API。
  - AI 行動前重新驗證。
  - stale action 可重試一次。
- Test Method：
  - Action contract 測試。
  - GameStore 整合測試。

### Phase 3：統一 Player AI Scheduler

- Owner：Engineering
- Status：Todo
- Priority：P1
- Acceptance Criteria：
  - 防守與支援共用執行框架。
  - Scheduler 不再直接放在 `App.tsx`。
  - 同一 Actor 不重入。
- Test Method：
  - 回合生命週期測試。
  - timer cancellation 測試。

### Phase 4：Creature Action/Event Pipeline

- Owner：AI Engineering
- Status：Todo
- Priority：P0
- Acceptance Criteria：
  - Creature 目標、路徑、行動與 reducer 分離。
  - 不可達目標能重新規劃。
  - `blocked` 不會攻擊錯誤目標。
- Test Method：
  - 固定地圖情境。
  - 行動事件 reducer 測試。

### Phase 5：動畫與全域日誌

- Owner：UI / Engineering
- Status：Todo
- Priority：P1
- Acceptance Criteria：
  - AI 與 Creature 行動都能產生動畫事件。
  - 全域日誌記錄人類、AI 與 Creature 重要行動。
  - 動畫不改變遊戲規則結果。
- Test Method：
  - 事件順序測試。
  - 動畫取消、讀檔與 Game Over 測試。

### Phase 6：建設 AI

- Owner：AI Engineering
- Status：Todo
- Priority：P2
- Acceptance Criteria：
  - AI 依據 `AiConstructionPlan` 自動選擇建築。
  - 建築完成、阻塞與取消狀態正確。
  - 建築完成時產生提醒與全域日誌。
- Test Method：
  - 建設決策純函式測試。
  - 固定據點建設情境測試。

---

## 16. 重構風險與回滾策略

### 16.1 主要風險

- 重構改變 Creature 原有目標優先級。
- 新 Action Executor 與既有玩家戰鬥規則產生差異。
- 事件化後覆蓋順序與現有 snapshot 合併不一致。
- Scheduler 移出 React 後，Modal 與動畫同步失效。
- AI 自動回合因 stale timer 重複執行。
- 通用型別過度抽象，反而掩蓋 Creature 與玩家 AI 的規則差異。

### 16.2 回滾策略

- 每個 Phase 使用獨立 Adapter，不直接刪除舊 API。
- 保留 `moveCreatures()` 舊入口，直到 Event Pipeline 完成驗收。
- 保留 `runAiDefenseStep()` 與 `runAiSupportStep()` 相容包裝層。
- 每次重構先執行完整測試與 production build。
- 行為差異需使用固定 seed 與固定地圖比對。
- 若新 executor 失敗，可暫時切回既有 domain action 流程。

---

## 17. 初步驗收結論

### 可行性

- 技術可行性：高。
- 直接一次性合併風險：高，不建議。
- 建議採用：共用 AI 基礎核心 + 陣營／角色專屬 Policy + 共用 Validator / Executor + 分離 Scheduler。

### 開發入口

第一個開發切片應為：

0. ~~為 `runAiDefenseStep`／`runAiSupportStep` 補 gameStore 整合測試。~~ **A0 已完成**（`gameStore.aiSteps.test.ts` 8 例）。
1. 玩家 AI 攻擊去 Preview 化（切片 A；A0 測試為驗收網）。
2. 抽出共用距離、阻擋、目標與可達性純函式。
3. 建立通用 `AiAction` 型別。
4. 建立 Action Validator，但先不改變現有行動結果。
5. 所有既有測試通過後，再進入 Scheduler／Creature 拆管線。

### 暫不允許

- 在 Phase 1 前新增更多 Creature 行為類型。
- 在沒有 Action Validator 前增加更多 AI 建設行為。
- 在沒有事件協定前宣稱已完成逐步動畫。
- 直接刪除現有 Creature 回合與玩家 AI API。
