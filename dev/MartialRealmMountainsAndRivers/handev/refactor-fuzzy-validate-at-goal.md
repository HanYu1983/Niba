# 臨時重構：模糊邏輯 Goal 層級合法性驗證

> 狀態：待執行  
> 建立日期：2026-08-27  
> 觸發原因：`runFuzzyStep` 的 validate 在 orchestration 層，太晚——GoalResult 回傳時應已保證合法

---

## 1. 問題現狀

### 1.1 現行流程

```
evaluateAllGoals(inputs)   → Record<GoalName, GoalResult>   // 純評分
rankGoals(goalResults)     → sorted goals                   // 排序
buildActionSequence(goal)  → AiAction[]                     // 純生成
validateAiAction           → ？                              // 不在這裡
execute AiAction           → GameState                      // 執行時才可能失敗
```

**問題**：`buildActionSequence` 生成的 AiAction 可能不合法（體力不足、目標不存在、建築類型錯誤…），但沒有任何地方在執行前驗證。  
`runFuzzyStep` 的 execute 失敗才發現——此時已經是執行時錯誤，不是決策時錯誤。

### 1.2 期望流程

```
evaluateAllGoals(inputs)         → Record<GoalName, GoalResult>   // 純評分
rankGoals(goalResults)           → sorted goals                   // 排序
buildValidatedActionSequence()   → AiAction[]                     // 生成 + 驗證 + apply
execute AiAction                 → GameState                      // 必定合法（保底）
```

**核心原則**：`GoalResult` 回傳時，其中包含的行動序列**必定合法**。  
runFuzzyStep 的 validate 是保底——若不通過，代表 goal 代碼邏輯有 bug。

---

## 2. 重構方案

### 2.1 新增 `buildValidatedActionSequence`

在 `goalActionMapper.ts` 中新增，包裝現有 `buildActionSequence`：

```typescript
import { validateAiAction } from '../validation/validateAiAction'
import { executeAiAction, type ExecuteAiActionDependencies } from '../execution/executeAiAction'

/**
 * 生成行動序列 + 逐步驗證 + 逐步 apply。
 *
 * - 每個 action 先 validateAiAction（含體力檢查）
 * - 通過後 executeAiAction 產出新 GameState
 * - 新 GameState 作為下一步的驗證基準
 * - 任何一步失敗 → 回傳空陣列（整組放棄）
 *
 * 與 buildActionSequence 的差異：
 *   buildActionSequence      = 純生成，不驗證
 *   buildValidatedActionSequence = 生成 + 驗證 + apply
 */
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
    // 1. Validate
    const validation = validateAiAction(current, action)
    if (!validation.valid) return []

    // 2. Apply（純函數，不 mutate 原始 state）
    const outcome = executeAiAction(current, action, dependencies)
    if (!outcome.result.ok) return []

    // 3. 新 state 作為下一步的基準
    current = outcome.state
  }

  return actions
}
```

### 2.2 依賴關係變化

**現有**：
```
goals.ts          → fuzzyInputs.ts（純評分）
goalActionMapper.ts → types, aiAction, perception（純生成）
gameStore.ts      → goals, goalActionMapper, validateAiAction, executeAiAction
```

**重構後**：
```
goals.ts          → fuzzyInputs.ts（不變）
goalActionMapper.ts → types, aiAction, perception, validateAiAction, executeAiAction（★ 新增）
gameStore.ts      → goals, goalActionMapper（validate/execute 不再直接呼叫）
```

**評估**：
- `goalActionMapper.ts` 本來就負責「生成合法行動」，加入 validate/execute 是職責補全
- 不會造成循環依賴（validateAiAction → actionCostRules → playerDerivedRules，不回到 goalActionMapper）
- `executeAiAction` 需要 `ExecuteAiActionDependencies`（combat + turn），需要從 gameStore 傳入

### 2.3 `ExecuteAiActionDependencies` 的來源

`executeAiAction` 需要 `dependencies: ExecuteAiActionDependencies`：

```typescript
export type ExecuteAiActionDependencies = {
  combat: CombatActionDependencies
  turn: TurnActionDependencies
}
```

這兩個依賴在 `gameStore.ts` 中已有實例。  
**方案**：在 `runFuzzyStep` 中取得 dependencies，傳入 `buildValidatedActionSequence`：

```typescript
// runFuzzyStep 內
const deps: ExecuteAiActionDependencies = {
  combat: { /* gameStore 已有的 combat deps */ },
  turn: { /* gameStore 已有的 turn deps */ },
}

const candidateActions = buildValidatedActionSequence(
  candidate.goal, candidate.result, gameState, currentPlayer, deps,
)
```

### 2.4 runFuzzyStep 的改動

```typescript
// 現行（orchestration 層驗證）
for (const candidate of rankedGoals) {
  if (candidate.result.score < MIN_THRESHOLD) break
  const candidateActions = buildActionSequence(candidate.goal, candidate.result, gameState, currentPlayer)
  if (candidateActions.length === 0) continue
  if (candidateActions.every((a) => a.type === 'hold')) continue
  actions = candidateActions
  goalFound = true
  break
}

// 重構後（goal 層級已驗證，此處只是 fallback）
for (const candidate of rankedGoals) {
  if (candidate.result.score < MIN_THRESHOLD) break
  const candidateActions = buildValidatedActionSequence(
    candidate.goal, candidate.result, gameState, currentPlayer, deps,
  )
  if (candidateActions.length === 0) continue  // 非法→fallback（正常）
  if (candidateActions.every((a) => a.type === 'hold')) continue
  actions = candidateActions
  goalFound = true
  break
}
```

**execute 階段仍保留 validateAiAction 作為保底**：

```typescript
for (const action of actions) {
  // ★ 保底驗證（正常情況必定通過）
  const validation = validateAiAction(gameState, action)
  if (!validation.valid) {
    exitReason = `保底驗證失敗（代碼 bug）：${validation.reason}`
    break
  }

  const actionResult = gameStore.executeAiAction(action)
  recordAiStepEvent(...)
  if (!actionResult.ok) {
    exitReason = `行動失敗：${actionResult.reason}`
    break
  }
}
```

---

## 3. 影響範圍

### 3.1 需要改動的檔案

| 檔案 | 改動 |
|------|------|
| `ai/fuzzy/goalActionMapper.ts` | 新增 `buildValidatedActionSequence` |
| `gameStore.ts` | runFuzzyStep 改用新函數 + 傳入 dependencies + 保底 validate |

### 3.2 不需要改動

| 檔案 | 原因 |
|------|------|
| `goals.ts` | 純評分，不涉及行動生成/驗證 |
| `validateAiAction.ts` | 已有，直接呼叫 |
| `executeAiAction.ts` | 已有，直接呼叫 |
| `fuzzyInputs.ts` | 純感知，不涉及 |
| `decision.ts` | 純排序，不涉及 |

### 3.3 向後相容

- `buildActionSequence` 保留不變（其他呼叫者可能用到）
- `buildValidatedActionSequence` 是純新增
- 現有測試中 `buildActionSequence` 的測試不受影響
- `runFuzzyStep` 的行為變化：之前 execute 失敗才 fallback，現在 generate 時就 fallback

---

## 4. 測試策略

### 4.1 單元測試：`buildValidatedActionSequence`

```typescript
it('合法行動序列 → 回傳完整序列', () => {
  // arrange: mock state + goal result 生成合法 attack action
  const actions = buildValidatedActionSequence('engageCombat', result, state, player, deps)
  expect(actions.length).toBeGreaterThan(0)
  expect(actions[0].type).toBe('attack')
})

it('體力不足的行動序列 → 回傳空陣列', () => {
  // arrange: mock state stamina=2, build 生成 build action (cost=3)
  const actions = buildValidatedActionSequence('construction', result, state, player, deps)
  expect(actions).toEqual([])
})

it('apply 後下一步不合法 → 回傳空陣列', () => {
  // arrange: 兩步序列，第一步合法但 apply 後第二步不合法
  const actions = buildValidatedActionSequence(goal, result, state, player, deps)
  expect(actions).toEqual([])
})
```

### 4.2 整合測試：`runFuzzyStep` 保底

```typescript
it('保底驗證失敗時回傳含 bug 訊息的 exitReason', () => {
  // 正常情況下此測試不應觸發
  // 需要 mock buildValidatedActionSequence 回傳合法但 executeAiAction 失敗的場景
})
```

---

## 5. 執行順序

1. `goalActionMapper.ts`：新增 `buildValidatedActionSequence`
2. `gameStore.ts`：runFuzzyStep 改用新函數 + 傳入 deps + 保底 validate
3. 新增 `buildValidatedActionSequence` 單元測試
4. Docker tsc + vitest 驗證
5. Commit

---

## 6. 開放問題

| # | 問題 | 候選方案 |
|---|------|---------|
| 1 | `executeAiAction` 的 dependencies 如何從 gameStore 取得 | 檢查 gameStore 內已有的 combat/turn deps 實例 |
| 2 | apply 後的 state 是否需要深拷貝 | `executeAiAction` 已回傳新 state（不 mutate），安全 |
| 3 | 效能影響：每步都 validate + execute | validate 很輕量；execute 在 goal 層是模擬，不影响真實 state |
| 4 | 與 V3 圖搜索的整合 | V3 的 `executePure` 也是同一模式，可復用 |
