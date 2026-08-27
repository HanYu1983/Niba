# V3 圖搜索貪婪演算法 — 實現計劃

> 建立日期：2026-08-27  
> 設計文件：`ai-greedy-v3.md`  
> 狀態：待執行

---

## 1. 架構總覽

### 1.1 新增檔案

```
src/game/ai/graphSearch/
  ├── types.ts              // AiNode, AiEdge, SearchStrategy 型別
  ├── AiNodeImpl.ts         // AiNodeImpl 類別 + getAdjacentNodes
  ├── executePure.ts        // structuredClone + executeAiAction
  ├── searchStrategies.ts   // GreedyLongestPath（Phase 1）
  ├── actionGenerators.ts   // 所有 Tier 的條件→行動映射（單一檔案，避免過度拆分）
  ├── scoring.ts            // Tier 位階分數計算
  └── runGraphSearchStep.ts // 入口函數（類似 runFuzzyStep）
```

### 1.2 改動檔案

| 檔案 | 改動 |
|------|------|
| `types.ts` | AiOrder 加 `'graph-search'` |
| `aiTurnScheduler.ts` | AiOrderKind 加 `'graph-search'`、deps 加 `runGraphSearchStep`、dispatch 加分支 |
| `gameStore.ts` | 新增 `runGraphSearchStep` method + 傳入 scheduler deps |
| `App.tsx` | scheduler deps 加 `runGraphSearchStep` |
| `StrategicCommandModal.tsx` | UI 加 graph-search 選項 |
| `worldSetup.ts` | 預設 order 類型改為 `'graph-search'`（或保留 fuzzy） |
| `testHelpers/aiTestFixtures.ts` | 新增 `makeGraphSearchOrder()` |

---

## 2. 核心型別定義（`graphSearch/types.ts`）

```typescript
import type { GameState } from '../../types'
import type { AiAction } from '../aiAction'

export interface AiNode {
  state: GameState
  action: AiAction | null
  parent: AiNode | null
  cumulativeCost: number
  depth: number
  remainingStamina: number
}

export interface AiEdge {
  node: AiNode
  action: AiAction
  score: number    // 0~1.5，Tier 6 可 >1.0
  cost: number     // stamina cost
}

export interface SearchStrategy {
  search(root: AiNode, maxDepth: number): AiNode | null
}
```

---

## 3. executePure（`graphSearch/executePure.ts`）

純函數狀態轉換：`structuredClone` + `executeAiAction`。

```typescript
export function executePure(
  state: GameState,
  action: AiAction,
  dependencies: ExecuteAiActionDependencies,
): GameState {
  const copy = structuredClone(state)
  const result = executeAiAction(copy, action, dependencies)
  return result.state
}
```

**注意**：`dependencies` 從 `runGraphSearchStep` 傳入，與 gameStore 共用同一套 deps。

---

## 4. AiNodeImpl（`graphSearch/AiNodeImpl.ts`）

```typescript
export class AiNodeImpl implements AiNode {
  constructor(
    public state: GameState,
    public action: AiAction | null,
    public parent: AiNode | null,
    public cost: number,
    public depth: number,
    public remainingStamina: number,
  ) {
    this.cumulativeCost = parent ? parent.cumulativeCost + cost : 0
  }

  getAdjacentNodes(dependencies: ExecuteAiActionDependencies): AiEdge[] {
    // 呼叫 actionGenerators 產生候選
    return getActionGenerators(this, dependencies)
  }
}
```

---

## 5. 條件→行動生成器（`graphSearch/actionGenerators.ts`）

所有 Tier 的生成器放在單一檔案。每個生成器：
1. 檢查條件（粗估）
2. 生成候選 AiAction
3. 用 `validateAiAction` 驗證
4. 用 `getAiActionStaminaCost` 計算體力
5. 回傳 `AiEdge[]`

### 5.1 Tier 策略

| Tier | 分數範圍 | 生成器 | 復用 |
|------|---------|--------|------|
| 6 | 1.20~1.50 | `generateKillThisTurn` | `listHostileActors`, `playerAttackDamage` (需新增 helper) |
| 5 | 0.90~1.00 | `generateRetreat`, `generateHeal` | `evaluateSelfPreservation` 的邏輯 |
| 4 | 0.70~0.89 | `generateAttack`, `generateNestAttack` | `listHostileActors` |
| 3 | 0.50~0.69 | `generateBuild`, `generateCollect` | `buildingCatalog`, `canPlayerBuildBuildingType` |
| 2 | 0.30~0.49 | `generateExplore` | `collectReachableCells` + 未探索格 |
| 1 | 0.10~0.29 | `generateEndTurn` | 無條件 |

### 5.2 移動序列生成

需要「先移動再攻擊」的多步序列時，生成器只生成**第一步移動**。  
搜索展開時，下一層會再生成攻擊行動。

```typescript
// Tier 4 範例：敵人在 3 格外
// 生成器回傳：移動到最近可達格的 AiEdge（score = 0.75）
// 下一層展開時：攻擊敵人的 AiEdge（score = 0.75+）
```

### 5.3 需要新增的 helpers

| Helper | 位置 | 說明 |
|--------|------|------|
| `playerAttackDamage(state, playerId)` | `playerDerivedRules.ts` 或 `graphSearch/scoring.ts` | 計算玩家攻擊力 |
| `maxEnemyDamage(creature)` | `graphSearch/scoring.ts` | 計算敵人最大傷害 |
| `canKillThisTurn(state, playerId, enemy, remainingStamina)` | `graphSearch/scoring.ts` | 判斷本回合击殺可行性 |

---

## 6. 搜索演算法（`graphSearch/searchStrategies.ts`）

Phase 1 只實現 `GreedyLongestPath`：

```typescript
export class GreedyLongestPath implements SearchStrategy {
  search(root: AiNode, maxDepth: number, dependencies: ExecuteAiActionDependencies): AiNode | null {
    // DFS + 分支剪枝（每層最多 MAX_BRANCHES 個候選）
    // 回傳累計分數最高的葉節點
  }
}
```

**參數**：
- `maxDepth`：預設 3
- `MAX_BRANCHES`：預設 5（每層剪枝）

---

## 7. 入口函數（`graphSearch/runGraphSearchStep.ts`）

類似 `runFuzzyStep` 的結構：

```typescript
export function runGraphSearchStep(
  state: GameState,
  playerId: string,
  dependencies: ExecuteAiActionDependencies,
): { actions: AiAction[]; exitReason?: string } {
  // 1. 建立根節點
  const player = state.players.find(p => p.id === playerId)!
  const root = new AiNodeImpl(state, null, null, 0, 0, player.stamina)

  // 2. 搜索
  const strategy = new GreedyLongestPath()
  const bestLeaf = strategy.search(root, MAX_DEPTH, dependencies)

  // 3. 提取路徑
  if (!bestLeaf) return { actions: [], exitReason: '搜索無結果' }
  return { actions: extractPath(bestLeaf) }
}
```

`extractPath` 從葉節點回溯 parent，收集所有 action。

---

## 8. gameStore 整合

### 8.1 新增 `runGraphSearchStep` method

```typescript
runGraphSearchStep: (playerId: string): ActionOutcome => {
  const state = gameState
  const player = state.players.find(p => p.id === playerId)
  const order = state.aiOrders?.find(o => o.aiPlayerId === playerId && o.type === 'graph-search' && o.status === 'active')
  if (!player?.isAI || state.activePlayerId !== playerId || !order) {
    return { ok: false, reason: '目前無法執行圖搜索回合。' }
  }

  const aiDeps: ExecuteAiActionDependencies = { combat: {...}, turn: {...} }  // 與 runFuzzyStep 相同
  const { actions, exitReason } = runGraphSearchStep(state, playerId, aiDeps)

  if (actions.length === 0) return { ok: false, reason: exitReason ?? '無可行動' }

  // 逐步執行
  for (const action of actions) {
    const cp = gameState.players.find(p => p.id === playerId)
    if (!cp || cp.stamina <= 0) break
    const actionResult = gameStore.executeAiAction(action)
    recordAiStepEvent(gameState.round, playerId, player.name, action, actionResult)
    if (!actionResult.ok) return { ok: false, reason: actionResult.reason }
  }

  return { ok: true }
}
```

### 8.2 deps 複用

`runGraphSearchStep` 和 `runFuzzyStep` 共用同一套 `aiDeps`。  
可考慮抽出為 `gameStore` 內的共用 helper。

---

## 9. 排程器整合

### 9.1 `aiTurnScheduler.ts`

```typescript
export type AiOrderKind = 'protect-base' | 'support-player' | 'construction' | 'fuzzy' | 'decision-tree' | 'graph-search'

export interface AiTurnSchedulerDeps {
  // ...existing...
  runGraphSearchStep(actorId: string): { ok: boolean; reason?: string }
}

// dispatch:
orderType === 'graph-search'
  ? deps.runGraphSearchStep(scheduledActorId)
  : deps.runFuzzyStep(scheduledActorId)
```

### 9.2 `types.ts` AiOrder

```typescript
| {
    id: string
    type: 'graph-search'
    aiPlayerId: string
    priority: number
    status: AiOrderStatus
  }
```

---

## 10. 實現順序

### Phase 1：核心框架（本次）

1. 建立 `graphSearch/` 目錄 + `types.ts`
2. 實現 `executePure.ts`
3. 實現 `AiNodeImpl.ts`（含 getAdjacentNodes 框架）
4. 實現 `actionGenerators.ts` — 只做 Tier 1（end-turn）+ Tier 5（retreat/heal）
5. 實現 `scoring.ts` — Tier 位階分數計算
6. 實現 `searchStrategies.ts` — GreedyLongestPath
7. 實現 `runGraphSearchStep.ts` — 入口函數
8. 接入 gameStore + scheduler + UI
9. Docker tsc + vitest 驗證
10. Commit

### Phase 2：完整行動生成器（後續）

1. Tier 6：本回合击殺
2. Tier 4：戰鬥（弱怪、巢穴）
3. Tier 3：建造 + 採集
4. Tier 2：探索移動

### Phase 3：搜索調優（後續）

1. 爬山法 + 模擬退火
2. MAX_BRANCHES / maxDepth 參數調整
3. 狀態哈希避免重複展開

---

## 11. 測試策略

### 11.1 單元測試

| 測試 | 說明 |
|------|------|
| `executePure` | 深拷貝驗證（不 mutate 原始 state） |
| `AiNodeImpl.getAdjacentNodes` | Tier 1 至少回傳 end-turn |
| `GreedyLongestPath.search` | 給定簡單場景，回傳最佳路徑 |
| `extractPath` | 回溯 parent 收集 actions |
| `scoring.ts` | Tier 位階分數計算正確 |

### 11.2 整合測試

| 測試 | 說明 |
|------|------|
| `runGraphSearchStep` | 給定有敵人的 state，回傳攻擊路徑 |
| `runGraphSearchStep` | 體力不足時回傳 end-turn |

---

## 12. 開放問題

| # | 問題 | 候選方案 |
|---|------|---------|
| 1 | `structuredClone` 效能 | 先用，效能問題再優化 |
| 2 | Tier 分數具體數值 | 先用設計文件的值，playtest 後調整 |
| 3 | 移動→攻擊多步序列 | 生成器只生成第一步，搜索展開再生成後續 |
| 4 | 與 construction AI 的整合 | graph-search 只管回合內行動，construction plan 由 runAiConstructionStep 處理 |
| 5 | 幫助函數（playerAttackDamage 等） | 先在 scoring.ts 內定義，後續可抽出 |
