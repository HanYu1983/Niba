# 臨時重構：evaluateAllGoals 層級合法性驗證

> 狀態：待執行  
> 建立日期：2026-08-27  
> 前置文件：`refactor-fuzzy-validate-at-goal.md`  
> 變更：validate 從 goalActionMapper 提前到 goals.ts 的 evaluate 層  
> 更新：GoalResult 直接攜帶 `actions: AiAction[]`，runFuzzyStep 不再呼叫 buildActionSequence

---

## 1. 核心設計

### 1.1 契約

**`GoalResult` 回傳時，`actions` 已就緒且必定合法。**

```
evaluateAllGoals(inputs, state, player, deps)
  → Record<GoalName, GoalResult>
      → score > 0 的 GoalResult 必定有 actions[] 且全部通過 validateAiAction
      → score = 0 表示不可行（條件不符 / 驗證失敗）

runFuzzyStep
  → 取 score 最高的 GoalResult
  → 直接執行 result.actions（不需再 build / validate）
  → 保底 validate（正常必定通過，不通過 = bug）
```

### 1.2 新流程圖

```
evaluateAllGoals(inputs, state, player, deps)
  │
  ├─ evaluateSelfPreservation(inputs, state, player, deps)
  │    ├─ score = fuzzyMath(...)
  │    ├─ if score <= 0 → return { score: 0 }
  │    ├─ actions = buildActionSequence('selfPreservation', result, state, player)
  │    ├─ validate + apply 每一步 → fail? return { score: 0 }
  │    └─ return { score, target, actions }  ← ★ actions 已附帶
  │
  ├─ evaluateConstruction(inputs, state, player, deps)
  │    └─ 同上模式
  │
  └─ ... 共 17 個 goals

rankGoals(goalResults)
  → sorted（score > 0 的必定有合法 actions）

runFuzzyStep
  → candidate = rankedGoals[0]
  → actions = candidate.result.actions  ← ★ 直接取，不需 build
  → execute 每個 action（保底 validate）
```

---

## 2. 介面變化

### 2.1 GoalResult 新增 actions 欄位

```typescript
export interface GoalResult {
  score: number
  target?: GoalTarget
  distanceToTarget?: number
  context?: Record<string, unknown>
  actions?: AiAction[]  // ★ 新增：score > 0 時必定有值且合法
}
```

**使用規則**：
- `score > 0` → `actions` 必定存在且 `length > 0`
- `score = 0` → `actions` 無意義（undefined 或空陣列）

### 2.2 evaluateAllGoals 簽章

```typescript
// 現行
export function evaluateAllGoals(inputs: FuzzyInputs): Record<GoalName, GoalResult>

// 重構後
export function evaluateAllGoals(
  inputs: FuzzyInputs,
  state: GameState,
  player: PlayerState,
  dependencies: ExecuteAiActionDependencies,
): Record<GoalName, GoalResult>
```

### 2.3 個別 evaluate 函數簽章

```typescript
// 現行
export function evaluateConstruction(inputs: FuzzyInputs): GoalResult

// 重構後
export function evaluateConstruction(
  inputs: FuzzyInputs,
  state: GameState,
  player: PlayerState,
  dependencies: ExecuteAiActionDependencies,
): GoalResult
```

---

## 3. 內部實現模式

### 3.1 buildValidatedActionSequence（來自 refactor-fuzzy-validate-at-goal.md）

先建立共用的驗證函數，evaluate[Goal] 直接呼叫：

```typescript
// goalActionMapper.ts

export function buildValidatedActionSequence(
  goal: GoalName,
  result: GoalResult,
  state: GameState,
  player: PlayerState,
  dependencies: ExecuteAiActionDependencies,
): AiAction[] {
  const actions = buildActionSequence(goal, result, state, player)
  if (actions.length === 0) return []

  let current = state
  for (const action of actions) {
    const validation = validateAiAction(current, action)
    if (!validation.valid) return []
    const outcome = executeAiAction(current, action, dependencies)
    if (!outcome.result.ok) return []
    current = outcome.state
  }
  return actions
}
```

### 3.2 evaluate[Goal] 使用模式

每個 evaluate 函數只需呼叫 `buildValidatedActionSequence`，不必自行驗證：

```typescript
export function evaluateConstruction(
  inputs: FuzzyInputs,
  state: GameState,
  player: PlayerState,
  dependencies: ExecuteAiActionDependencies,
): GoalResult {
  const { canBuild, nearestBase, ... } = inputs

  // ── 原有評分邏輯 ──
  if (!canBuild || !nearestBase) return { score: 0 }
  const score = computeConstructionScore(inputs)
  if (score <= 0) return { score: 0 }

  // ── 建立 GoalResult ──
  const result: GoalResult = {
    score,
    target: { kind: 'build', baseId: nearestBase.id, buildingId: ..., buildingName: ... },
  }

  // ── 生成 + 驗證（一行搞定）──
  const actions = buildValidatedActionSequence('construction', result, state, player, dependencies)
  if (actions.length === 0) return { score: 0 }

  result.actions = actions
  return result
}
```

**不需要**自行呼叫 `validateAiAction` / `executeAiAction`——全部封裝在 `buildValidatedActionSequence` 裡。

### 3.3 不需要驗證的 goals

以下 4 個 goals 的 action 是純指令，直接用 `buildActionSequence`（不需 validate）：

| Goal | 原因 |
|------|------|
| `allocateAttributes` | allocate-attribute 不消耗體力，無位置驗證 |
| `useItem` | use-item 不消耗體力，道具存在已由 inputs 保證 |
| `equipEquipment` | equip 不消耗體力，instanceId 由 inputs 保證 |
| `equipInnerSkill` | 同上 |

```typescript
export function evaluateAllocateAttributes(
  inputs: FuzzyInputs,
  state: GameState,
  player: PlayerState,
  dependencies: ExecuteAiActionDependencies,
): GoalResult {
  // ... 評分 ...
  if (score <= 0) return { score: 0 }

  const result: GoalResult = { score, target: { kind: 'allocate-attribute', attribute: ... } }
  const actions = buildActionSequence('allocateAttributes', result, state, player)
  result.actions = actions  // 不需 validate
  return result
}
```

其餘 13 個 goals 用 `buildValidatedActionSequence`。

---

## 4. runFuzzyStep 改動

```typescript
// ── 現行 ──
const goalResults = evaluateAllGoals(inputs)
const rankedGoals = rankGoals(goalResults)
let actions = []

for (const candidate of rankedGoals) {
  if (candidate.result.score < MIN_THRESHOLD) break
  const candidateActions = buildActionSequence(candidate.goal, candidate.result, gameState, currentPlayer)
  if (candidateActions.length === 0) continue
  if (candidateActions.every((a) => a.type === 'hold')) continue
  actions = candidateActions
  goalFound = true
  break
}

// ── 重構後 ──
const goalResults = evaluateAllGoals(inputs, gameState, currentPlayer, deps)
const rankedGoals = rankGoals(goalResults)
let actions = []

for (const candidate of rankedGoals) {
  if (candidate.result.score < MIN_THRESHOLD) break
  const candidateActions = candidate.result.actions  // ★ 直接取
  if (!candidateActions || candidateActions.length === 0) continue
  if (candidateActions.every((a) => a.type === 'hold')) continue
  actions = candidateActions
  goalFound = true
  break
}

// ── execute（保底 validate）──
for (const action of actions) {
  const validation = validateAiAction(gameState, action)
  if (!validation.valid) {
    exitReason = `保底驗證失敗（代碼 bug）：${validation.reason}`
    break
  }
  const actionResult = gameStore.executeAiAction(action)
  // ...
}
```

**關鍵變化**：`runFuzzyStep` 不再 import `buildActionSequence`。

---

## 5. 依賴關係

```
goals.ts
  → fuzzyInputs.ts（純評分）
  → goalActionMapper.ts（buildValidatedActionSequence + buildActionSequence）

goalActionMapper.ts
  → validateAiAction.ts（★ 新增，封裝在 buildValidatedActionSequence 內）
  → executeAiAction.ts（★ 新增，封裝在 buildValidatedActionSequence 內）

gameStore.ts
  → goals.ts（evaluateAllGoals 帶 state/player/deps）
  → validateAiAction.ts（保底）
  → goalActionMapper.ts ✗ 不再需要（evaluate 已內部處理）
```

**evaluate[Goal] 不直接接觸 validateAiAction / executeAiAction**——全部透過 `buildValidatedActionSequence` 封裝。

**無循環依賴**：  
goals.ts → goalActionMapper.ts → validateAiAction → actionCostRules → playerDerivedRules  
不回到 goals.ts ✓

---

## 6. 影響範圍

### 6.1 需要改動的檔案

| 檔案 | 改動 |
|------|------|
| `goalActionMapper.ts` | 新增 `buildValidatedActionSequence`（import validateAiAction + executeAiAction） |
| `goals.ts` | GoalResult 加 `actions?` + evaluateAllGoals 簽章 + 13 個 evaluate 呼叫 buildValidatedActionSequence + 4 個直接 build |
| `gameStore.ts` | runFuzzyStep 傳入 state/player/deps + 取 `result.actions` + 保底 validate + 移除 buildActionSequence import |

### 6.2 不需要改動

| 檔案 | 原因 |
|------|------|
| `validateAiAction.ts` | 已有，被 goalActionMapper.ts 呼叫 |
| `executeAiAction.ts` | 已有，被 goalActionMapper.ts 呼叫 |
| `fuzzyInputs.ts` | 純感知，不變 |
| `decision.ts` | 純排序，不變 |

### 6.3 副作用

| 項目 | 說明 |
|------|------|
| evaluateAllGoals 不再是純函數 | 依賴 state/player/deps |
| buildActionSequence import 從 gameStore 移除 | 不再需要 |
| 單元測試需提供 state/player/deps mock | 但可復用現有 testHelpers |

---

## 7. 測試策略

### 7.1 evaluate 函數測試

```typescript
it('evaluateConstruction：合法建造 → score > 0 且 actions 有值', () => {
  const result = evaluateConstruction(inputs, state, player, deps)
  expect(result.score).toBeGreaterThan(0)
  expect(result.actions).toBeDefined()
  expect(result.actions!.length).toBeGreaterThan(0)
  // 每個 action 都合法
  for (const action of result.actions!) {
    expect(validateAiAction(state, action).valid).toBe(true)
  }
})

it('evaluateConstruction：體力不足 → score = 0', () => {
  const lowStaminaPlayer = { ...player, stamina: 1 }
  const result = evaluateConstruction(inputs, state, lowStaminaPlayer, deps)
  expect(result.score).toBe(0)
})
```

### 7.2 evaluateAllGoals 整合測試

```typescript
it('evaluateAllGoals：所有 score > 0 的 goals 都有合法 actions', () => {
  const results = evaluateAllGoals(inputs, state, player, deps)
  for (const [goalName, result] of Object.entries(results)) {
    if (result.score <= 0) continue
    expect(result.actions).toBeDefined()
    expect(result.actions!.length).toBeGreaterThan(0)
    for (const action of result.actions!) {
      expect(validateAiAction(state, action).valid).toBe(true)
    }
  }
})
```

### 7.3 runFuzzyStep 整合測試

```typescript
it('runFuzzyStep：直接執行 result.actions，不需再 build', () => {
  // 正常流程，保底 validate 不應失敗
  const result = gameStore.runFuzzyStep('ai-1')
  expect(result.ok).toBe(true)
})
```

---

## 8. 分析：GoalTarget 與 GoalResult.actions 的關係

### 8.1 兩層抽象

```
GoalTarget（意圖）     → "做什麼"     → { kind: 'build', baseId, buildingId }
GoalResult.actions（執行） → "怎麼做"     → [{ type: 'move', destination }, { type: 'build', buildingType }]
```

`GoalTarget` 是概念層——描述意圖。  
`GoalResult.actions` 是執行層——可直接執行的行動序列。

在 `buildValidatedActionSequence` 裡，`GoalTarget` 是 `buildActionSequence` 的**輸入**（用來生成 actions），但 `GoalTarget` 本身不是執行引擎需要的東西。

### 8.2 重構後 GoalTarget 的角色

GoalResult 帶 actions 後，執行引擎只看 `result.actions`。  
GoalTarget 變成：

| 用途 | 說明 |
|------|------|
| **debug / logging** | `recordAiStepEvent` 可記錄 "為何選這個 goal" |
| **score override** | `evaluateAllGoals` 後的 selfPreservation override 需要知道 goal kind |
| **UI 顯示** | StrategicCommandModal 可顯示 "建造中…" 等狀態 |
| **buildActionSequence 的輸入** | evaluate 內部仍需要 target 來生成 actions |

**不變的**：GoalTarget 仍是 `buildActionSequence` 的必要輸入。  
**變化的**：GoalTarget 不再是執行引擎的依賴。

### 8.3 與決策樹的對比

決策樹系統**不使用 GoalTarget**：

```
conditions → 決策 → buildAttackAction(state, target) → AiAction
                   → buildMoveAction(state, destination) → AiAction
```

決策樹直接從條件生成 AiAction，沒有中間的 "意圖" 抽象。

| | 模糊邏輯 | 決策樹 |
|---|---|---|
| 評分 | fuzzy math → GoalResult.score | 條件判斷 → 布爾 |
| 意圖 | GoalTarget（結構化） | 無 |
| 行動 | buildActionSequence(GoalTarget) → AiAction[] | buildXxxAction(state) → AiAction |
| 驗證 | buildValidatedActionSequence | validateAiAction（在 dispatch 前） |

**隱含的概念差異**：

模糊邏輯是 **score → intent → action**（三步）：  
先算分數，再決定意圖（GoalTarget），再生成行動。  
GoalTarget 是 score 和 action 之間的橋樑。

決策樹是 **condition → action**（兩步）：  
條件直接決定行動，不需要中間意圖層。

### 8.4 可以去掉 GoalTarget 嗎？

**技術上可以**：GoalResult 只保留 `{ score, actions }`，evaluate 直接生成 actions 不經過 target。

**但不建議**，因為：

1. **buildActionSequence 仍需要某種 "意圖" 來生成 actions**  
   即使去掉 GoalTarget，`buildActionSequence` 的 switch case 仍需要知道 "這次是為了建造還是攻擊"。  
   這個資訊會從 GoalTarget 變成 GoalName（已存在）+ actions 內的資訊。

2. **GoalTarget 携帶了 actions 沒有的語意**  
   例如 `{ kind: 'retreat', escapeDirection }` 說明了「往哪逃」，但 actions 裡只有一串 move，看不出 retreat 的意圖。

3. **debug / logging 的可讀性**  
   記錄 "construction" 比記錄 "move + build" 更容易理解 AI 的決策邏輯。

### 8.5 建議的演進路徑

```
Phase 1（本次重構）：
  GoalResult = { score, target, actions }   ← target 保留，actions 新增
  buildActionSequence 仍以 target 為輸入

Phase 2（未來可選）：
  若 V3 圖搜索不需要 GoalTarget（直接 node → actions），
  可將 GoalTarget 降級為 optional metadata：
  GoalResult = { score, actions, debugTarget? }
```

**核心原則**：actions 是執行的唯一依據，target 是輔助理解的元資料。

### 8.6 意圖作為通用 AI 抽象：潛在設計價值

#### 8.6.1 核心洞察

`buildValidatedActionSequence` 的本質是一個**計畫器（Planner）**：

```
意圖（GoalTarget） + 當前狀態（GameState） → 驗證過的行動序列（AiAction[]）
```

這個計畫器**不關心意圖從哪裡來**。它只負責：
1. 拿到一個意圖
2. 生成對應的行動序列
3. 驗證每一步
4. 回傳合法序列（或空陣列）

這意味著：**任何 AI 策略只要能產生 GoalTarget，就能複用同一套計畫器。**

#### 8.6.2 通用架構

```
┌─────────────────────────────────────────────────┐
│              AI 決策層（可替換）                    │
│                                                   │
│  模糊邏輯：fuzzyMath → score → GoalTarget          │
│  決策樹：  conditions → GoalTarget                 │
│  V3 圖搜索：node evaluation → GoalTarget           │
│  手動規則：if HP < 30% → { kind: 'retreat' }       │
│                                                   │
│  共同產出：GoalTarget + score                      │
└──────────────────────┬──────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────┐
│           計畫器（共用）                            │
│                                                   │
│  buildValidatedActionSequence(target, state, deps)│
│  → 生成 actions + 驗證 + apply                     │
│  → 回傳 AiAction[]（必定合法）                      │
└──────────────────────┬──────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────┐
│           執行層（共用）                            │
│                                                   │
│  executeAiAction(state, action) → GameState       │
│  保底 validate                                    │
└─────────────────────────────────────────────────┘
```

#### 8.6.3 決策樹的整合

決策樹目前直接從條件生成 AiAction，不經過 GoalTarget。  
但可以重構為：

```typescript
// 現行決策樹：condition → action
function decideNextAction(state, player): AiAction | null {
  if (hp < 30%) return buildRetreatAction(state, player)
  if (enemy nearby) return buildAttackAction(state, player)
  return buildExploreAction(state, player)
}

// 重構後：condition → intent → plan
function decideNextAction(state, player): AiAction[] | null {
  let intent: GoalTarget | null = null

  if (hp < 30%) {
    intent = { kind: 'retreat', escapeDirection: computeEscapeDir(state, player) }
  } else if (enemy nearby) {
    intent = { kind: 'attack', targetId: enemy.id, targetType: 'creature', position: enemy.position }
  } else {
    intent = { kind: 'explore', position: pickExploreTarget(state, player) }
  }

  if (!intent) return null

  // 複用同一套計畫器
  const goalName = targetToGoalName(intent)  // 'selfPreservation' | 'engageCombat' | ...
  return buildValidatedActionSequence(goalName, { score: 1, target: intent }, state, player, deps)
}
```

**好處**：
- 決策樹的 action 也經過 validate + apply，不再需要在 scheduler 做保底
- 兩套 AI 系統共享同一套計畫器，邏輯一致
- 新增 action 類型只需改 `buildActionSequence`，兩套系統同時受益

#### 8.6.4 設計價值

| 價值 | 說明 |
|------|------|
| **統一驗證** | 所有 AI 策略的行動都經過同一套 validate + apply，不出現「模糊邏輯有驗證但決策樹沒有」的不一致 |
| **模組化** | 決策層（怎麼選）和計畫層（怎麼做）分離，可獨立替換 |
| **可測試** | 計畫器可獨立測試：給定任意 GoalTarget + state，驗證產出的 actions 合法 |
| **可擴展** | 新增 AI 策略（如 V3）只需產出 GoalTarget，不需重寫 action 生成邏輯 |
| **可除錯** | GoalTarget 作為意圖記錄，方便追溯「AI 為什麼做這個決定」 |
| **向後相容** | 決策樹可逐步遷移，不必一次改完——先包一層 intent wrapper |

#### 8.6.5 統一介面（未來願景）

```typescript
// 所有 AI 策略 implement 同一介面
interface AiStrategy {
  evaluate(state: GameState, player: PlayerState): Array<{
    intent: GoalTarget
    score: number
  }>
}

// 計畫器不關心意圖從哪來
function plan(
  intents: Array<{ intent: GoalTarget; score: number }>,
  state: GameState,
  player: PlayerState,
  dependencies: ExecuteAiActionDependencies,
): { actions: AiAction[]; intent: GoalTarget } | null {
  const sorted = intents.sort((a, b) => b.score - a.score)
  for (const { intent, score } of sorted) {
    if (score <= 0) break
    const goalName = targetToGoalName(intent)
    const actions = buildValidatedActionSequence(goalName, { score, target: intent }, state, player, dependencies)
    if (actions.length > 0) return { actions, intent }
  }
  return null
}
```

```typescript
// 使用
const fuzzyStrategy: AiStrategy = { evaluate: (s, p) => evaluateAllGoals(computeFuzzyInputs(s, p), s, p, deps) }
const dtStrategy: AiStrategy = { evaluate: (s, p) => decideAllIntents(s, p) }
const v3Strategy: AiStrategy = { evaluate: (s, p) => graphSearch(s, p) }

// 同一個 planner，同一個 executor
const planResult = plan(strategy.evaluate(state, player), state, player, deps)
if (planResult) executePlan(state, planResult.actions)
```

---

## 9. 執行順序

1. `goalActionMapper.ts`：新增 `buildValidatedActionSequence`（import validateAiAction + executeAiAction）
2. `goals.ts`：GoalResult 加 `actions?` 欄位（target 保留）
3. `goals.ts`：evaluateAllGoals 簽章加 state/player/deps
4. `goals.ts`：13 個需驗證的 evaluate 函數加參數 + 呼叫 `buildValidatedActionSequence`
5. `goals.ts`：4 個不需驗證的 evaluate 函數加參數 + 直接 `buildActionSequence`
6. `gameStore.ts`：runFuzzyStep 傳入 state/player/deps
7. `gameStore.ts`：select loop 改取 `result.actions`
8. `gameStore.ts`：execute 保留保底 validate
9. `gameStore.ts`：移除 `buildActionSequence` import（若不再需要）
10. Docker tsc + vitest 驗證
11. Commit
