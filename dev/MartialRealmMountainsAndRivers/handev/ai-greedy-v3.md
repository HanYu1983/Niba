# AI 設計版本 3：圖搜索貪婪演算法（Graph Search Greedy）

> 狀態：草稿  
> 建立日期：2026-08-27  
> 前置文件：`ai-fuzzy-logic-v1.md`、`ai-decision-tree-v2.md`

---

## 1. 設計理念

V1（模糊邏輯）和 V2（決策樹）的共同問題：**只看當前一步**。  
模糊邏輯選一個最高分目標然後執行，決策樹按優先級 return 第一個匹配的行動——兩者都無法回答「做 A 之後再做 B 是否比直接做 C 更好？」。

V3 將 AI 決策建模為**圖搜索問題**：

```
GameState ──action──→ GameState' ──action──→ GameState'' ──→ ...
   node₀                node₁                node₂
```

每個節點（Node）代表一個遊戲狀態 + 到達該狀態的行動。  
`getAdjacentNodes()` 生成所有可行的下一步行動，每個行動帶有分數。  
標準圖搜索演算法（爬山法、模擬退火、最長路徑）在此圖上搜索最佳行動序列。

### 1.1 為什麼選圖搜索

| 模糊邏輯 V1 | 決策樹 V2 | 圖搜索 V3 |
|------------|----------|----------|
| 只看當前一步 | 只看當前一步 | 可看 N 步（depth 參數） |
| 多目標評分互相干扰 | 條件硬排序 | 每個節點獨立評分，搜索算法選最優路徑 |
| 無法「先投資後回報」 | 無法「先移動再攻擊」 | 自然表達多步序列（移動→移動→攻擊） |
| 參數多、難調 | 順序敏感 | 分數分階，算法自動平衡 |

### 1.2 核心數據結構

```typescript
// 節點：代表一個遊戲狀態 + 到達它的行動
interface AiNode {
  // 該節點的遊戲狀態（純函數生成，不可變）
  state: GameState
  // 到達此節點的行動（根節點為 null）
  action: AiAction | null
  // 來源節點（根節點為 null）
  parent: AiNode | null
  // 從來源到此節點的累計成本（0 for root）
  cumulativeCost: number
  // 此節點的深度（根 = 0）
  depth: number

  // 核心方法：生成所有相鄰節點
  getAdjacentNodes(): AiEdge[]
}

// 邊：連接兩個節點的行動
interface AiEdge {
  // 目標節點（已套用 action 後的新 GameState）
  node: AiNode
  // 此邊的行動
  action: AiAction
  // 此行動的分數（0~1.5，越高越好；Tier 6 可超過 1.0）
  score: number
  // 行動成本（移動 = 格數，建造 = staminaCost，等等）
  cost: number
}
```

---

## 2. 節點實現：`getAdjacentNodes()`

這是 V3 的核心。`getAdjacentNodes()` 回傳所有**可行動 + 分數**，搜索演算法從中選最優。

### 2.1 分數體系：位階制

多個條件可能同時成立（例如「旁邊有弱怪」和「可以建造」），需要一個分數系統區分優先級。

**設計：位階（Tier）+ 位階內連續分數**

```
Tier 6（本回合击殺）：1.20 ~ 1.50  — 本回合可擊殺的敵人（最高行動）
Tier 5（緊急）：0.90 ~ 1.00  — 生死攸關（逃命、治療）
Tier 4（戰鬥）：0.70 ~ 0.89  — 戰鬥機會（弱怪、巢穴）
Tier 3（建設）：0.50 ~ 0.69  — 據點發展（建造、採集）
Tier 2（探索）：0.30 ~ 0.49  — 探索、移動
Tier 1（閒置）：0.10 ~ 0.29  — 待命、回合結束
Tier 0（非法）：0.00          — 不可行動（不回傳）
```

**Tier 6 設計意圖**：>1.0 的分數在搜索演算法中具有**絕對優先**——無論其他 Tier 分數多高，只要本回合击殺可行，AI 必定選擇。這解決了 V1/V2 中「明明可以殺掉敵人卻選擇建造」的問題。

**Tier 6 位階內分數**：
- 1.50 = 直接相鄰可擊殺（最高：零移動成本 + 確定擊殺）
- 1.35 = 需移動 1 格後擊殺（移動 1 格 + 確定擊殺）
- 1.20 = 需移動 2+ 格後擊殺（移動成本較高但仍在本回合可完成）

**位階內分數**：同一 Tier 內用連續值區分。例如 Tier 4 內：
- 兩回合击殺：0.80
- 巢穴目標：0.75

**為什麼用位階**：
- 避免「強戰鬥」分數壓過「緊急治療」（V1 的問題）
- 同 Tier 內的比較是連續的，不會退化為硬排序（V2 的問題）
- 搜索演算法拿到分數後可以直接用，不需要額外 tie-breaking

### 2.2 條件 → 行動映射表

`getAdjacentNodes()` 的內部實現是一張**條件→行動→分數**的映射表：

```typescript
// 虛擬碼：條件 → 行動生成器
const ACTION_GENERATORS: ConditionActionGenerator[] = [
  // ─── Tier 6：本回合击殺 ───
  {
    condition: (node) => canKillThisTurn(node.state, playerId),
    generate: (node) => generateKillThisTurnActions(node),
    tier: 6,
  },

  // ─── Tier 5：緊急 ───
  {
    condition: (node) => isHealthCritical(node.state, playerId),
    generate: (node) => generateRetreatActions(node),
    tier: 5,
  },
  {
    condition: (node) => needsHealing(node.state, playerId),
    generate: (node) => generateHealActions(node),
    tier: 5,
  },

  // ─── Tier 4：戰鬥 ───
  {
    condition: (node) => hasAdjacentKillableEnemy(node.state, playerId),
    generate: (node) => generateAttackActions(node),
    tier: 4,
  },
  {
    condition: (node) => hasReachableNest(node.state, playerId),
    generate: (node) => generateNestAttackActions(node),
    tier: 4,
  },

  // ─── Tier 3：建設 ───
  {
    condition: (node) => canBuildAtBase(node.state, playerId),
    generate: (node) => generateBuildActions(node),
    tier: 3,
  },
  {
    condition: (node) => hasAdjacentResource(node.state, playerId),
    generate: (node) => generateCollectActions(node),
    tier: 3,
  },

  // ─── Tier 2：探索 ───
  {
    condition: (node) => hasUnexploredNearby(node.state, playerId),
    generate: (node) => generateExploreActions(node),
    tier: 2,
  },

  // ─── Tier 1：閒置 ───
  {
    condition: () => true,  // 總是可行
    generate: (node) => generateEndTurnAction(node),
    tier: 1,
  },
]
```

**關鍵設計**：每個 `generate` 函數回傳**多個**候選行動（例如多個移動方向），不是只回傳一個。  
搜索演算法從中選最優路徑。

### 2.3 行動生成器實作要點

每個生成器負責：
1. 檢查條件（粗估）
2. 生成候選行動（含多個方向/目標）
3. 用 `validateAiAction` 驗證
4. 計算分數（位階 + 位階內連續值）
5. 回傳 `AiEdge[]`

**分數計算範例**：

```typescript
// Tier 6：本回合击殺（最高優先級）
function generateKillThisTurnActions(node: AiNode): AiEdge[] {
  const edges: AiEdge[] = []
  const state = node.state
  const player = getPlayer(state, playerId)
  const enemies = listHostileActors(state)

  for (const enemy of enemies) {
    const dist = manhattan(player.position, enemy.position)
    const hitsToKill = Math.ceil(enemy.health / playerAttackDamage(state, playerId))
    const hitsToDie = Math.ceil(player.health / maxEnemyDamage(enemy))

    if (hitsToKill > hitsToDie) continue  // 殺不掉
    if (hitsToKill > 1) continue  // 需要多回合

    // 體力驗證（用 getAiActionStaminaCost）
    const moveAction: AiAction = { type: 'move', actor: { id: playerId, kind: 'player' }, destination: enemy.position, reason: '' }
    const attackAction: AiAction = { type: 'attack', actor: { id: playerId, kind: 'player' }, target: { id: enemy.id, kind: 'creature', position: enemy.position }, reason: '' }
    const moveCost = getAiActionStaminaCost(state, moveAction)
    const attackCost = getAiActionStaminaCost(state, attackAction)
    const totalCost = moveCost + attackCost
    if (totalCost > node.remainingStamina) continue

    // 分數：根據移動距離給分
    const score = dist <= 1 ? 1.50 : dist === 2 ? 1.35 : 1.20

    if (dist <= 1) {
      // 直接攻擊
      const action: AiAction = { type: 'attack', actor: { id: playerId, kind: 'player' }, target: { id: enemy.id, kind: 'creature', position: enemy.position }, reason: `本回合击殺 ${enemy.name}` }
      if (validateAiAction(state, action).valid) {
        const newState = executePure(state, action)
        edges.push({ node: new AiNodeImpl(newState, action, node, attackCost, node.depth + 1, node.remainingStamina - attackCost), action, score, cost: attackCost })
      }
    } else {
      // 移動→攻擊序列：生成移動節點，攻擊會在下一層展開
      const path = findPath(state, player.position, enemy.position)
      if (path) {
        const moveAction: AiAction = { type: 'move', actor: { id: playerId, kind: 'player' }, destination: path[1], reason: `趨近 ${enemy.name} 準備擊殺` }
        if (validateAiAction(state, moveAction).valid) {
          const newState = executePure(state, moveAction)
          edges.push({ node: new AiNodeImpl(newState, moveAction, node, moveCost, node.depth + 1, node.remainingStamina - moveCost), action: moveAction, score, cost: moveCost })
        }
      }
    }
  }
  return edges
}

// Tier 4：戰鬥（非本回合击殺）
function generateAttackActions(node: AiNode): AiEdge[] {
  const edges: AiEdge[] = []
  const state = node.state
  const player = getPlayer(state, playerId)
  const enemies = listHostileActors(state)  // 所有可見敵人

  for (const enemy of enemies) {
    const dist = manhattan(player.position, enemy.position)
    const hitsToKill = Math.ceil(enemy.health / playerAttackDamage(state, playerId))
    const hitsToDie = Math.ceil(player.health / maxEnemyDamage(enemy))

    // 條件：能打死 AND 不會被打死
    if (hitsToKill <= hitsToDie && dist <= maxMoveRange(state, playerId)) {
      // 分數：位階 4 + 位階內值
      const killRatio = hitsToDie / hitsToKill  // 越高越安全
      const innerScore = 0.70 + 0.19 * Math.min(1, (killRatio - 1) / 4)  // 1~5 → 0.70~0.89

      // 如果需要先移動才能攻擊，生成移動→攻擊序列
      if (dist > 1) {
        const path = findPath(state, player.position, enemy.position)
        if (path) {
          const moveEdge = generateMoveEdge(node, path[1], '趨近敵人')
          if (moveEdge) edges.push(moveEdge)
        }
      } else {
        // 直接攻擊
        const action: AiAction = { type: 'attack', actor: { id: playerId, kind: 'player' }, target: { id: enemy.id, kind: 'creature', position: enemy.position }, reason: `攻擊 ${enemy.name}` }
        if (validateAiAction(state, action).valid) {
          const newState = executePure(state, action)
          edges.push({ node: new AiNode(newState, action, node, actionCost, node.depth + 1), action, score: innerScore, cost: actionCost })
        }
      }
    }
  }
  return edges
}
```

### 2.4 體力預算（Stamina Budget）

`validateAiAction` 的 attack case **不檢查體力**——只查目標存在和相鄰。  
體力檢查在 `canPlayerPerformAction(state, playerId, staminaCost)`，但 validate 傳 `0`（只查回合資格）。

**問題**：多步序列（移動→移動→攻擊）需要確保每一步都有足夠體力。  
如果第一歩移動花光體力，第二歩攻擊就無法執行——但 search 層不知道。

**設計：節點追蹤剩餘體力**

每個 AiNode 追蹤**剩餘體力預算**，在生成相鄰節點時扣除：

```typescript
interface AiNode {
  // ... 其他欄位
  // 此節點的剩餘體力（從 parent 繼承，扣除本步 action 的 cost）
  remainingStamina: number
}

// 在 getAdjacentNodes() 中：
getAdjacentNodes(): AiEdge[] {
  const edges: AiEdge[] = []
  for (const gen of ACTION_GENERATORS) {
    if (!gen.condition(this)) continue
    const candidates = gen.generate(this)
    for (const edge of candidates) {
      // 體力驗證：本步 action 的 stamina cost ≤ 剩餘體力
      const staminaCost = getAiActionStaminaCost(this.state, edge.action)
      if (staminaCost > this.remainingStamina) continue  // 體力不足，跳過

      // 建立新節點，扣除體力
      const newStamina = this.remainingStamina - staminaCost
      const newNode = new AiNodeImpl(
        executePure(this.state, edge.action),
        edge.action,
        this,
        edge.cost,
        this.depth + 1,
        newStamina,
      )
      edges.push({ node: newNode, action: edge.action, score: edge.score, cost: edge.cost })
    }
  }
  return edges
}
```

**體力計算**：統一由 `getAiActionStaminaCost(state, action)` 處理（見重構文件 `refactor-validate-stamina.md` §2.1）。  
此函數接受 `GameState` + `AiAction`，回傳正確的體力消耗：
- `move`（相鄰格）：`getTerrainStaminaCost(destTerrain, player)` — 精確計算，含 buff 覆寫
- `move`（非相鄰格）：`manhattan × 2` — 估算值
- `attack`：5
- `build` / `defense-build`：3
- `collect`：2（resource）/ 0（item）
- 其他：0

**本回合击殺的體力驗證**：

```typescript
function canKillThisTurn(state: GameState, playerId: string, remainingStamina: number): boolean {
  const player = getPlayer(state, playerId)
  const enemies = listHostileActors(state)

  for (const enemy of enemies) {
    const dist = manhattan(player.position, enemy.position)
    const hitsToKill = Math.ceil(enemy.health / playerAttackDamage(state, playerId))
    const hitsToDie = Math.ceil(player.health / maxEnemyDamage(enemy))

    if (hitsToKill > hitsToDie) continue  // 殺不掉
    if (hitsToKill > 1) continue  // 需要多回合（V3 目前只考慮本回合击殺）

    // 用 getAiActionStaminaCost 算移動 + 攻擊的體力
    const moveAction: AiAction = { type: 'move', actor: { id: playerId, kind: 'player' }, destination: enemy.position, reason: '' }
    const attackAction: AiAction = { type: 'attack', actor: { id: playerId, kind: 'player' }, target: { id: enemy.id, kind: 'creature', position: enemy.position }, reason: '' }
    const moveCost = getAiActionStaminaCost(state, moveAction)
    const attackCost = getAiActionStaminaCost(state, attackAction)
    const totalCost = moveCost + attackCost

    if (totalCost <= remainingStamina) return true
  }
  return false
}
```

---

## 3. 純函數狀態轉換

### 3.1 為什麼要純函數

圖搜索需要**展開多個節點**，每個節點對應一個 GameState。  
如果 GameState 是 mutable 的，展開節點會互相污染。

**設計**：每個節點建立時，透過純函數從父節點的 GameState 生成新的 GameState：

```typescript
class AiNodeImpl implements AiNode {
  state: GameState
  action: AiAction | null
  parent: AiNode | null
  cumulativeCost: number
  depth: number

  constructor(state: GameState, action: AiAction | null, parent: AiNode | null, cost: number, depth: number) {
    this.state = state
    this.action = action
    this.parent = parent
    this.cumulativeCost = parent ? parent.cumulativeCost + cost : 0
    this.depth = depth
  }

  getAdjacentNodes(): AiEdge[] {
    // 從 ACTION_GENERATORS 產生候選
    // 每個候選用 executePure(this.state, action) 生成新 GameState
    // 回傳 AiEdge[]
  }
}
```

### 3.2 `executePure`：無副作用的狀態轉換

```typescript
function executePure(state: GameState, action: AiAction): GameState {
  // 深拷貝 GameState（避免 mutate 原始狀態）
  const stateCopy = structuredClone(state)
  // 套用 executeAiAction（已有的純領域函數）
  const result = executeAiAction(stateCopy, action, dependencies)
  return result.state
}
```

**注意**：`executeAiAction` 本身是純領域函數（不 mutate 外部狀態），但接收的是 mutable state。  
用 `structuredClone` 確保每個節點的 state 獨立。

### 3.3 記憶體優化：路徑壓縮

深度 N 的搜索會產生 N 個 GameState 副本。  
優化：**只保留根到葉的路徑**，中間節點用完即棄（垃圾回收）。

```typescript
// 搜索結束後，只回傳最佳路徑的行動序列
function extractPath(leaf: AiNode): AiAction[] {
  const path: AiAction[] = []
  let current: AiNode | null = leaf
  while (current?.action) {
    path.unshift(current.action)
    current = current.parent
  }
  return path  // [action₁, action₂, ..., actionₙ]
}
```

---

## 4. 搜索演算法

### 4.1 介面

```typescript
interface SearchStrategy {
  search(root: AiNode, maxDepth: number): AiNode | null
}
```

回傳最佳葉節點（或 null）。

### 4.2 貪婪最長路徑（Greedy Longest Path）

每次選分數最高的邊展開，直到深度上限。

```typescript
class GreedyLongestPath implements SearchStrategy {
  search(root: AiNode, maxDepth: number): AiNode | null {
    let bestLeaf: AiNode | null = null
    let bestScore = -Infinity

    const dfs = (node: AiNode) => {
      if (node.depth >= maxDepth) {
        if (node.cumulativeCost > bestScore) {
          bestScore = node.cumulativeCost
          bestLeaf = node
        }
        return
      }

      const edges = node.getAdjacentNodes()
      // 按分數排序，只展開前 K 個（剪枝）
      edges.sort((a, b) => b.score - a.score)
      for (const edge of edges.slice(0, MAX_BRANCHES)) {
        dfs(edge.node)
      }
    }

    dfs(root)
    return bestLeaf
  }
}
```

**參數**：
- `maxDepth`：搜索深度（1 = 只看當前一步，3 = 看三步）
- `MAX_BRANCHES`：每層最多展開幾個候選（剪枝，預設 5）

### 4.3 爬山法（Hill Climbing）

帶隨機重启的爬山法：

```typescript
class HillClimbing implements SearchStrategy {
  search(root: AiNode, maxDepth: number, maxIterations: number = 50): AiNode | null {
    let bestLeaf = this.localSearch(root, maxDepth)

    for (let i = 0; i < maxIterations; i++) {
      // 隨機重启：從隨機深度的節點重新展開
      const randomNode = this.getRandomNodeOnPath(bestLeaf ?? root)
      const candidate = this.localSearch(randomNode, maxDepth)
      if (candidate && candidate.cumulativeCost > (bestLeaf?.cumulativeCost ?? -Infinity)) {
        bestLeaf = candidate
      }
    }

    return bestLeaf
  }

  private localSearch(node: AiNode, maxDepth: number): AiNode | null {
    let current = node
    for (let d = 0; d < maxDepth; d++) {
      const edges = current.getAdjacentNodes()
      if (edges.length === 0) break
      // 選分數最高的邊
      const bestEdge = edges.reduce((best, e) => e.score > best.score ? e : best)
      current = bestEdge.node
    }
    return current
  }
}
```

### 4.4 模擬退火（Simulated Annealing）

```typescript
class SimulatedAnnealing implements SearchStrategy {
  search(root: AiNode, maxDepth: number): AiNode | null {
    let current = this.greedyLeaf(root, maxDepth)
    let best = current
    let temp = INITIAL_TEMP

    for (let i = 0; i < MAX_ITERATIONS; i++) {
      // 隨機選擇一個節點，展開隨機分支
      const neighbor = this.randomNeighbor(current, maxDepth)
      if (!neighbor) break

      const delta = neighbor.cumulativeCost - current.cumulativeCost
      if (delta > 0 || Math.random() < Math.exp(delta / temp)) {
        current = neighbor
        if (current.cumulativeCost > best.cumulativeCost) {
          best = current
        }
      }
      temp *= COOLING_RATE
    }

    return best
  }
}
```

### 4.5 演算法比較

| 演算法 | 時間複雜度 | 品質 | 適用場景 |
|--------|-----------|------|---------|
| 貪婪最長路徑 | O(b^d) | 局部最優 | 預設選擇，穩定 |
| 爬山法 | O(iterations × d × b) | 可能卡在局部最優 | 需要快速決策 |
| 模擬退火 | O(iterations × d × b) | 全局最優概率高 | 需要高品質決策 |

**b** = 平均分支因子（每層候選數），**d** = 深度

---

## 5. 與 V1/V2 的整合

### 5.1 復用現有代碼

V3 不是重寫，是**包裝**：

| V3 模組 | 復用的 V1/V2 代碼 |
|---------|-------------------|
| 條件檢查 | `fuzzyInputs.ts` 的 feasibility data、`conditions.ts` 的條件 helpers |
| 行動生成 | `goalActionMapper.ts` 的 builder functions、`actionBuilders.ts` 的 pathfinding |
| 驗證 | `validateAiAction.ts`（直接呼叫） |
| 執行 | `executeAiAction.ts`（包裝為 `executePure`） |
| 分數 | 模糊邏輯的 membership functions（簡化為位階制） |

### 5.2 與現有 test1/test2 的關係

```
test1（模糊邏輯）  ──保留──→  舊玩家可選
test2（決策樹）    ──保留──→  與 V3 互補
test3（圖搜索）    ──新增──→  V3 實現
```

V3 可以作為 test3 加入，或未來取代 test1/test2。

---

## 6. 實現路線圖

### Phase 1：核心框架（test3 原型）

**檔案結構**：
```
src/game/ai/graphSearch/
  ├── AiNode.ts          // AiNode 介面 + AiNodeImpl 類別
  ├── AiEdge.ts          // AiEdge 型別
  ├── executePure.ts     // 純函數狀態轉換
  ├── searchStrategies.ts // 搜索演算法（Greedy/HillClimbing/SA）
  ├── actionGenerators/
  │   ├── tier5-urgent.ts    // 緊急行動生成器
  │   ├── tier4-combat.ts    // 戰鬥行動生成器
  │   ├── tier3-build.ts     // 建設行動生成器
  │   ├── tier2-explore.ts   // 探索行動生成器
  │   └── tier1-idle.ts      // 閒置行動生成器
  └── runGraphSearch.ts  // 入口函數
```

**核心步驟**：
1. 定義 `AiNode` 介面 + `AiNodeImpl` 類別
2. 實現 `executePure`（包裝 `structuredClone` + `executeAiAction`）
3. 實現 `GreedyLongestPath` 搜索
4. 實現 Tier 1（end-turn）生成器——確保至少有一個可行行動
5. 接入 `runTest3Step` + `aiTurnScheduler`

### Phase 2：行動生成器

按 Tier 優先級實現：
1. Tier 5：逃命 + 治療
2. Tier 4：攻擊（弱怪、巢穴）
3. Tier 3：建造 + 採集
4. Tier 2：探索移動

### Phase 3：搜索調優

1. 調整 `MAX_BRANCHES`（分支剪枝）
2. 調整 `maxDepth`（搜索深度）
3. 實現爬山法和模擬退火
4. A/B 測試不同搜索策略

---

## 7. 效能考量

### 7.1 搜索空間估算

```
分支因子 b ≈ 5~10（每層 5~10 個可行動）
深度 d = 3
節點數 ≈ b^d = 125~1000

每次展開：structuredClone + executeAiAction + validateAiAction
≈ 0.1ms per node
總計 ≈ 12~100ms（可接受）
```

### 7.2 優化策略

| 策略 | 說明 |
|------|------|
| 分支剪枝 | 每層只展開 score 前 K 個候選 |
| 深度限制 | `maxDepth` 參數控制（建議 2~4） |
| 早期終止 | 找到 score = 1.0 的行動立即返回 |
| 狀態哈希 | 用 `hash(GameState)` 避免重複展開相同狀態 |
| 記憶體池 | 複用 `AiNodeImpl` 物件，減少 GC |

---

## 8. 開放問題

| # | 問題 | 候選方案 |
|---|------|---------|
| 1 | `structuredClone` 效能 | 用 immutable.js 或手寫深拷貝；或只拷貝必要欄位 |
| 2 | 分數位階的具體數值 | 需要 playtest 調整；可用 V1 的模糊函數作為初始值 |
| 3 | 移動→攻擊的多步序列 | 生成器需要 pathfinding（復用 Dijkstra） |
| 4 | 與 construction AI 的整合 | test3 只管回合內行動；construction plan 仍由 `runAiConstructionStep` 處理 |
| 5 | 搜索超時保護 | 設定 maxNodes 參數，超過就返回當前最佳 |

---

## 9. 結論

V3 圖搜索架構的優勢：

1. **多步規劃**：自然表達「先移動再攻擊」的序列
2. **演算法可替換**：同一個 Node 介面，換搜索策略就行
3. **分數位階**：避免 V1 的「三心二意」和 V2 的「硬排序」
4. **復用現有代碼**：條件檢查、行動生成、驗證、執行全部復用
5. **可測試性**：純函數、無副作用、易於單元測試

**風險**：
- `structuredClone` 效能需要驗證
- 搜索深度 > 3 時節點數可能爆炸
- 分數位階的具體數值需要 playtest 調整
