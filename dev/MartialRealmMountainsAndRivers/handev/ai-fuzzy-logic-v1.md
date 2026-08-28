# AI 設計版本 1：模糊邏輯目標擇優系統

> 狀態：草稿  
> 建立日期：2026-08-25  
> 前置文件：`ai-development-playbook.md`、`ai-perception-sensors.md`

---

## 1. 設計理念

現行 AI（test1）僅做「巡檢興趣點」，缺乏**目標優先級動態判斷**。  
本版本引入**模糊邏輯（Fuzzy Logic）**，將多個目標各自計算出 0\~1 的**模糊值（Membership Value）**，最終擇優選擇最高分的目標執行。

核心公式：

```
goalScore = Σ(weight_i × membership_i) / Σ(weight_i)
bestGoal = argmax(goalScore)
```

---

## 2. 模糊輸入變數（Fuzzy Input Variables）

每個輸入變數定義一組**隸屬函數（Membership Functions）**，將原始數值映射到語意詞（low / medium / high）。

| 變數名 | 原始值範圍 | 語意詞 | 隸屬函數 |
|---|---|---|---|
| `hitsSurvivable` | 0\~∞ | low / medium / high | 三角或梯形 |
| `staminaRatio` | 0\~1 | depleted / low / medium / high | 三角或梯形 |
| `distanceToNearestThreat` | 0\~maxMap | close / medium / far | 三角或梯形 |
| `enemyStrengthRatio` | 0\~1 | weak / comparable / strong | 三角或梯形 |
| `reachableItemCount` | 0\~N | few / some / many | 階梯函數 |
| `reachableResourceCount` | 0\~N | few / some / many | 階梯函數 |
| `baseHealthRatio` | 0\~1 | critical / damaged / healthy | 三角或梯形 |
| `roundNumber` | 1\~∞ | early / mid / late | 階梯函數 |

> **hitsSurvivable** = `player.health / maxVisibleEnemyDamage`  
> 代表能承受幾次攻擊。小於 2 → LOW 高（危險）；大於 5 → HIGH 高（安全）。

### 2.1 隸屬函數定義（虛擬碼）

```
// 梯形隸屬函數：trapezoid(x, a, b, c, d)
//   x <= a: 0
//   a < x <= b: (x - a) / (b - a)
//   b < x <= c: 1
//   c < x <= d: (d - x) / (d - c)
//   x > d: 0

// hitsSurvivable = player.health / maxVisibleEnemyDamage
// < 2 → LOW 高（只能扛 1~2 下，危險）
// 2~5 → MEDIUM
// > 5 → HIGH 高（能扛 5+ 下，安全）
membership_hitsSurvivable_low    = trapezoid(hits, 0, 0, 1.5, 3)
membership_hitsSurvivable_medium = trapezoid(hits, 2, 3, 4, 5)
membership_hitsSurvivable_high   = trapezoid(hits, 4, 5.5, 99, 99)

membership_staminaRatio_depleted = trapezoid(staminaRatio, 0.0, 0.0, 0.1, 0.2)
membership_staminaRatio_low      = trapezoid(staminaRatio, 0.15, 0.25, 0.4, 0.5)
membership_staminaRatio_medium   = trapezoid(staminaRatio, 0.35, 0.5, 0.65, 0.8)
membership_staminaRatio_high     = trapezoid(staminaRatio, 0.7, 0.85, 1.0, 1.0)

membership_distance_close   = trapezoid(dist, 0, 0, 2, 4)
membership_distance_medium  = trapezoid(dist, 3, 5, 7, 9)
membership_distance_far     = trapezoid(dist, 8, 10, 99, 99)

// ... 其餘變數同理
```

---

## 3. 目標定義（Goals）

每個目標代表一個 AI 行為傾向，各自有獨立的模糊評分演算法。  
每個目標函數回傳 `GoalResult`，包含模糊分數與**目標物件參照**，供後續行動執行器直接使用。

### 3.0 回傳型別

```typescript
interface GoalResult {
  /** 模糊分數 0~1 */
  score: number
  /** 目標物件參照（id、position 等），供 executeAiAction 使用 */
  target?: GoalTarget
  /** 目標的額外上下文（距離、數量等），供日誌或 UI 顯示 */
  context?: Record<string, unknown>
}

// 各目標的 target 聯集
type GoalTarget =
  | { kind: 'retreat'; escapeDirection: Position }       // selfPreservation: 逃離方向
  | { kind: 'item'; id: string; position: Position }    // collectItems: 目標道具
  | { kind: 'resource'; id: string; position: Position } // collectResources: 目標資源點
  | { kind: 'enemy'; id: string; kind_: string; position: Position; hp: number } // engageCombat: 目標敵人
  | { kind: 'buildSite'; baseId: string; position: Position } // build: 建造位置
  | { kind: 'exploreDir'; direction: Position }          // explore: 探索方向
```

### 3.1 Goal：自我保命（Self-Preservation）

**用途**：生命值低時優先撤退或保守行動。

```
// 輸入
hitsSurvivable   = player.health / maxVisibleEnemyDamage
staminaRatio     = player.stamina / player.maxStamina
distToThreat     = minDistance(player.position, hostilePositions)
nearestThreat    = nearest hostile actor

// 模糊值
f_hitsLow        = membership_hitsSurvivable_low(hitsSurvivable)
f_staminaDepleted = membership_staminaRatio_depleted(staminaRatio)
f_threatClose    = membership_distance_close(distToThreat)

// 規則（取最大值）
score = max(
    f_hitsLow,                            // 只能扛 1~2 下 → 保命
    f_staminaDepleted,                    // 體力耗盡 → 保命
    AND(f_hitsLow, f_threatClose),        // 只能扛幾下 + 威脅近 → 強烈保命
)

// 目標：逃離最近威脅的方向
target = {
  kind: 'retreat',
  escapeDirection: oppositeDirection(player.position, nearestThreat.position),
}

return { score, target, context: { hitsSurvivable, distToThreat } }
```

---

### 3.2 Goal：收集道具（Collect Items）

**用途**：判斷周遭道具的價值。

```
// 輸入
reachableItems        = items within reachableCells（可到達的道具）
reachableItemCount    = len(reachableItems)
staminaRatio          = player.stamina / player.maxStamina
totalStaminaCost      = Σ(moveCost(path_to_item)) for each reachable item
itemsCollectableBeforeExhaust = count items where totalStaminaCost <= player.stamina
bestItem              = highest-value item within stamina budget (by item.tier or distance)

// 模糊值
f_manyReachableItems  = membership_many(reachableItemCount)    // 階梯：>=5 → 1.0, >=3 → 0.6, >=1 → 0.3
f_staminaHigh         = membership_staminaRatio_high(staminaRatio)
f_itemsCollectable    = membership_many(itemsCollectableBeforeExhaust)

// 規則
score = max(
    AND(f_manyReachableItems, f_staminaHigh),      // 道具多 + 體力足 → 強烈收集
    f_itemsCollectable,                              // 體力內能撿到的道具數
    0.0,                                             // 最低分
)

// 距離衰減：最遠道具距離 > 5 格時，分數 × 0.7 衰減
if (nearestItemDistance > 5):
    score *= 0.7

// 目標：最佳道具
target = bestItem
    ? { kind: 'item', id: bestItem.id, position: bestItem.position }
    : undefined

return { score, target, context: { reachableItemCount, itemsCollectableBeforeExhaust } }
```

---

### 3.3 Goal：採集資源（Collect Resources）

**用途**：採集資源點以獲取材料。

```
// 輸入
reachableResources      = resource points within reachableCells
reachableResourceCount  = len(reachableResources)
staminaRatio            = player.stamina / player.maxStamina
baseNeedMaterials       = base.maxBuildingMaterials - base.buildingMaterials
bestResource            = nearest or highest-yield resource point within stamina budget

// 模糊值
f_manyResources    = membership_many(reachableResourceCount)
f_staminaHigh      = membership_staminaRatio_high(staminaRatio)
f_baseNeeds        = trapezoid(baseNeedMaterials / base.maxBuildingMaterials, 0.3, 0.5, 0.9, 1.0)

// 規則
score = max(
    AND(f_manyResources, f_staminaHigh),
    f_baseNeeds,
)

// 距離衰減同收集道具
target = bestResource
    ? { kind: 'resource', id: bestResource.id, position: bestResource.position }
    : undefined

return { score, target, context: { reachableResourceCount, baseNeedMaterials } }
```

---

### 3.4 Goal：交戰（Engage Combat）

**用途**：判斷是否值得進攻。

```
// 輸入
hitsSurvivable      = player.health / maxVisibleEnemyDamage
staminaRatio         = player.stamina / player.maxStamina
distToEnemy          = minDistance(player.position, enemyPositions)
enemies              = listHostileActors(state, playerId)
bestTarget           = enemies.sort(by: canKillInOneTurn → closest → weakest).first
enemyHP              = bestTarget.health
enemyMaxHP           = bestTarget.maxHealth
enemyStrengthRatio   = enemyHP / enemyMaxHP
playerDPS            = estimated damage per turn
enemyDPS             = estimated enemy damage per turn

// 模糊值
f_hitsHigh           = membership_hitsSurvivable_high(hitsSurvivable)
f_staminaHigh        = membership_staminaRatio_high(staminaRatio)
f_enemyClose         = membership_distance_close(distToEnemy)
f_enemyWeak          = trapezoid(enemyStrengthRatio, 0.0, 0.0, 0.3, 0.6)
f_canKillInOneTurn   = (playerDPS >= enemyHP) ? 1.0 : 0.0
f_advantage          = trapezoid(playerDPS / max(enemyDPS, 0.1), 1.0, 1.5, 3.0, 5.0)

// 規則
score = max(
    AND(f_enemyClose, f_enemyWeak, f_hitsHigh),           // 敵人近 + 弱 + 能扛多下 → 打
    AND(f_canKillInOneTurn, f_enemyClose),                 // 能一回合击殺 → 打
    AND(f_advantage, f_staminaHigh),                       // 優勢 + 體力足 → 打
)

// 目標：最優先敵人
target = bestTarget
    ? { kind: 'enemy', id: bestTarget.id, kind_: bestTarget.kind, position: bestTarget.position, hp: bestTarget.health }
    : undefined

return { score, target, context: { distToEnemy, hitsSurvivable, playerDPS, enemyDPS } }
```

---

### 3.5 Goal：建造（Build）

**用途**：判斷是否應該建造防禦結構。

```
// 輸入
baseHealthRatio       = base.health / base.maxHealth
buildingMaterials     = base.buildingMaterials
defenseStructureCount = len(defenseStructures.filter(owned by base))
threatsNearBase       = count enemies within base.defenseRadius
roundNumber           = state.round
buildSite             = position adjacent to base with fewest structures

// 模糊值
f_baseDamaged         = trapezoid(baseHealthRatio, 0.0, 0.0, 0.5, 0.8)
f_hasMaterials        = trapezoid(buildingMaterials / base.maxBuildingMaterials, 0.3, 0.5, 0.9, 1.0)
f_threatsNear         = membership_many(threatsNearBase)
f_earlyGame           = membership_early(roundNumber)    // 前期建造更有價值

// 規則
score = max(
    AND(f_baseDamaged, f_hasMaterials),                 // 損壞 + 有材料 → 建造
    AND(f_threatsNear, f_hasMaterials),                 // 有威脅 + 有材料 → 建造
    AND(f_earlyGame, f_hasMaterials),                   // 前期 + 有材料 → 建造
)

target = buildSite
    ? { kind: 'buildSite', baseId: base.id, position: buildSite }
    : undefined

return { score, target, context: { baseHealthRatio, threatsNearBase } }
```

---

### 3.6 Goal：探索未知（Explore）

**用途**：鼓勵 AI 探索地圖。

```
// 輸入
unexploredCellsNearby = count cells within radius 5 that are unexplored
staminaRatio          = player.stamina / player.maxStamina
roundNumber           = state.round
bestExploreDir        = direction with most unexplored cells within reach

// 模糊值
f_manyUnexplored   = membership_many(unexploredCellsNearby)
f_staminaHigh      = membership_staminaRatio_high(staminaRatio)
f_earlyGame        = membership_early(roundNumber)

// 規則
score = max(
    AND(f_manyUnexplored, f_staminaHigh),
    AND(f_earlyGame, f_staminaHigh),
)

target = bestExploreDir
    ? { kind: 'exploreDir', direction: bestExploreDir }
    : undefined

return { score, target, context: { unexploredCellsNearby } }
```

---

## 4. 戰略命令加權（Strategic Command Weighting）

玩家可透過 UI 下達**戰略命令**，為 AI 的目標評分提供**乘數加權**，改變 AI 行為傾向而不修改模糊規則本身。

### 4.1 戰略命令定義

| 命令 | 英文 | UI 顯示 | 效果描述 |
|---|---|---|---|
| 自由意圖 | `free` | 自由 | 預設，不加權（乘數 = 1.0） |
| 進攻意圖 | `aggressive` | 進攻 | 提高交戰意願，降低保命 |
| 防守意圖 | `defensive` | 防守 | 提高保命、建造，降低交戰 |
| 採集意圖 | `gathering` | 採集 | 提高道具/資源收集 |
| 探索意圖 | `exploration` | 探索 | 提高探索，降低交戰 |

### 4.2 加權矩陣（Weight Matrix）

每個戰略命令為 6 個目標各定義一個**乘數（multiplier）**，範圍 0.0\~2.0：

```
strategicWeights: Record<StrategicCommand, Record<GoalName, number>>

//                    selfPres  items  resources  combat  build  explore
strategicWeights = {
  free:         {     1.0,     1.0,     1.0,      1.0,    1.0,   1.0   },
  aggressive:   {     0.5,     0.8,     0.7,      1.8,    0.6,   0.7   },
  defensive:    {     1.6,     0.9,     1.2,      0.4,    1.7,   0.5   },
  gathering:    {     1.0,     1.7,     1.7,      0.5,    0.8,   0.6   },
  exploration:  {     0.9,     1.0,     0.8,      0.6,    0.7,   1.8   },
}
```

### 4.3 加權公式

```
// 原始模糊分數（§3 計算結果）
rawScore[goal] = goal 的原始模糊值

// 套用戰略加權
weightedScore[goal] = rawScore[goal] × strategicWeights[command][goal]

// 保命覆寫仍然生效（在加權之前或之後均可，但須一致）
if (rawScore['selfPreservation'] > 0.6):
    weightedScore['engageCombat'] = 0.0    // 保命覆寫不受進攻意圖影響

bestGoal = argmax(weightedScore)
```

### 4.4 意圖影響示意圖

```
自由意圖（baseline）：
  保命 ████████░░ 0.8
  道具 ██████░░░░ 0.6
  資源 █████░░░░░ 0.5
  交戰 ███████░░░ 0.7
  建造 ████░░░░░░ 0.4
  探索 ███░░░░░░░ 0.3

進攻意圖（× aggressive weights）：
  保命 ████░░░░░░ 0.4  (×0.5)
  道具 █████░░░░░ 0.48 (×0.8)
  資源 ███░░░░░░░ 0.35 (×0.7)
  交戰 █████████░ 1.26 (×1.8)
  建造 ██░░░░░░░░ 0.24 (×0.6)
  探索 ██░░░░░░░░ 0.21 (×0.7)

防禦意圖（× defensive weights）：
  保命 █████████░ 1.28 (×1.6)
  道具 █████░░░░░ 0.54 (×0.9)
  資源 ██████░░░░ 0.6  (×1.2)
  交戰 ███░░░░░░░ 0.28 (×0.4)
  建造 ███████░░░ 0.68 (×1.7)
  探索 █░░░░░░░░░ 0.15 (×0.5)
```

### 4.5 戰略命令的來源

| 來源 | 說明 |
|---|---|
| 玩家手動下達 | UI 下拉選單選取意圖，存入 `aiOrders[].strategicCommand` |
| 預設值 | 未下達命令時 = `'free'` |
| AI 自動切換 | （未來）可根據局面自動調整（如血量低自動切 defensive） |

### 4.6 與 selfPreservation 覆寫的交互

```
// 規則：selfPreservation > 0.6 時，不論戰略命令為何，交戰分數歸零。
// 這是硬性安全機制，不受 aggression multiplier 影響。
if (rawScore['selfPreservation'] > 0.6):
    weightedScore['engageCombat'] = 0.0

// 但 defensive 意圖下，selfPreservation 門檻降低（更容易觸發保命）：
if (command === 'defensive' && rawScore['selfPreservation'] > 0.4):
    weightedScore['engageCombat'] = 0.0
```

---

## 5. 決策矩陣（Decision Matrix）

所有目標分數計算完畢並套用戰略加權後，取 **argmax** 作為當前最佳目標，同時保留目標物件參照。

```
// 1. 計算原始模糊分數 + 目標參照
goalResults: Record<GoalName, GoalResult> = evaluateAllGoals(fuzzyInputs)
// goalResults = {
//   selfPreservation: { score: 0.8, target: { kind: 'retreat', ... } },
//   collectItems:     { score: 0.6, target: { kind: 'item', id: 'item-3', ... } },
//   engageCombat:     { score: 0.7, target: { kind: 'enemy', id: 'creature-1', ... } },
//   ...
// }

// 2. 套用戰略命令加權（只加權 score，target 保留）
weightedResults: Record<GoalName, GoalResult> = applyStrategicWeights(goalResults, strategicCommand)

// 3. 保命覆寫（score 歸零，target 保留但不使用）
if (goalResults.selfPreservation.score > 0.6):
    weightedResults.engageCombat.score = 0.0

// 4. 決策
bestGoal = argmax(weightedResults, by: score)
bestResult = weightedResults[bestGoal]

// bestResult = {
//   score: 1.26,
//   target: { kind: 'enemy', id: 'creature-1', position: { row: 3, column: 5 }, hp: 12 },
//   context: { distToEnemy: 2, playerDPS: 15, enemyDPS: 8 }
// }
```

### 5.1 最低門檻（Minimum Threshold）

```
MIN_THRESHOLD = 0.2
if (bestResult.score < MIN_THRESHOLD):
    bestGoal = 'hold'
    bestResult = { score: 0, target: undefined }    // 原地待命
```

### 5.2 tie-breaking

```
// 當兩個目標分數相同時，依固定優先級選擇：
priority_order = [
    'selfPreservation',   // 保命永遠第一
    'engageCombat',       // 交戰第二
    'collectItems',       // 撿道具第三
    'collectResources',   // 採集資源第四
    'build',              // 建造第五
    'explore',            // 探索最後
]
bestGoal = first goal in priority_order with max score
```

---

## 6. 目標到行動的映射（Goal → Action Mapping）

選出最佳目標後，根據 `bestResult.target` 決定具體行動：

| 目標 | target.kind | 具體行動 |
|---|---|---|
| `selfPreservation` | `retreat` | `movePlayer` 向 `escapeDirection` 移動；若無法移動則 `hold` |
| `collectItems` | `item` | `movePlayer` → `item.position`，再到達後 `collectItemPoint(target.id)` |
| `collectResources` | `resource` | `movePlayer` → `resource.position`，到達後 `collectResourcePoint(target.id)` |
| `engageCombat` | `enemy` | `movePlayer` → 鄰近 `target.position`，再 `executeAiAttack(target.id)` |
| `build` | `buildSite` | `movePlayer` → `target.position`，再 `constructBuilding(baseId)` |
| `explore` | `exploreDir` | `movePlayer` → `target.direction` |

### 6.1 多步行動序列

部分目標需要多步執行（移動 + 動作），拆分為 `AiAction[]` 序列：

```
// 例：collectItems 需要 移動 → 撿道具
function buildActionSequence(goal: GoalName, result: GoalResult): AiAction[] {
  switch (goal) {
    case 'collectItems':
      return [
        { type: 'move', actor, destination: result.target.position },
        { type: 'collect', actor, target: { id: result.target.id, kind: 'item', position: result.target.position } },
      ]
    case 'engageCombat':
      return [
        { type: 'move', actor, destination: adjacentTo(result.target.position) },
        { type: 'attack', actor, target: { id: result.target.id, kind: result.target.kind_, position: result.target.position } },
      ]
    case 'selfPreservation':
      return [
        { type: 'move', actor, destination: result.target.escapeDirection },
      ]
    // ... 其餘目標同理
  }
}

---

## 7. 回合內決策模式：每步重新評估（Per-Action Re-evaluation）

### 7.1 設計選擇

| 方案 | 描述 | 選擇 |
|---|---|---|
| **A：每步重新評估** | 迴圈中每步 perceive → evaluate → select → execute | **V1 採用** |
| B：一次排完整回合 | 一次 perceive → evaluate → planFullTurn → 逐步 execute | 不採用 |

**選擇 A 的理由**：
1. 道具撿完後地圖狀態改變（道具消失、體力減少），重新評估才能選到當前最佳下一步
2. 中途遇到敵人可切換到交戰，不用等「舊計畫」用完
3. 模糊邏輯的核心價值是**動態適應**，一次排完等於放棄此優勢
4. 與 `executeAiAction` 架構契合——每步都是獨立的 `AiAction`

### 7.2 迴圈虛擬碼

```
function runStepLoop(playerId: string): void {
  const player = getPlayer(playerId)

  while (player.stamina > 0 && !gameOver) {
    // 1. Perceive：每步重新感知（局面可能已變）
    const inputs = computeFuzzyInputs(gameState, player)

    // 2. Evaluate：計算 6 個目標的模糊分數 + 目標參照
    const goalResults = evaluateAllGoals(inputs)

    // 3. Weight：套用戰略命令加權
    const weighted = applyStrategicWeights(goalResults, strategicCommand)

    // 4. Override：保命覆寫
    if (goalResults.selfPreservation.score > 0.6)
      weighted.engageCombat.score = 0.0

    // 5. Select：argmax + tie-breaking
    const best = selectBestGoal(weighted)

    // 6. 最低門檻
    if (best.score < MIN_THRESHOLD) {
      record('hold', { reason: '所有目標分數過低' })
      break  // 原地待命，結束迴圈
    }

    // 7. Build action sequence from target
    const actions = buildActionSequence(best)
    for (const action of actions) {
      if (player.stamina <= 0) break
      const result = gameStore.executeAiAction(action)
      recordAiStepEvent(round, playerId, player.name, action, result)
    }

    // 8. 重新讀取 player（state 已變）
    player = getPlayer(playerId)
  }
}
```

### 7.3 狀態圖

```
┌─────────────────────────────────────────────────────┐
│              AI Decision Loop (per-action)           │
│                                                     │
│  ┌──────────┐                                       │
│  │ Perceive │ ← 每步重新感知（局面可能已變）         │
│  └────┬─────┘                                       │
│       │                                             │
│       ▼                                             │
│  ┌──────────┐                                       │
│  │ Evaluate │ ← 計算 6 個 goal raw scores + target  │
│  └────┬─────┘                                       │
│       │                                             │
│       ▼                                             │
│  ┌──────────┐                                       │
│  │  Weight  │ ← × strategicWeights[command]         │
│  └────┬─────┘                                       │
│       │                                             │
│       ▼                                             │
│  ┌──────────┐                                       │
│  │ Override │ ← selfPreservation > 0.6 → combat = 0 │
│  └────┬─────┘                                       │
│       │                                             │
│       ▼                                             │
│  ┌──────────┐                                       │
│  │  Select  │ ← argmax + tie-breaking              │
│  └────┬─────┘                                       │
│       │                                             │
│       ▼                                             │
│  ┌──────────┐   stamina <= 0?                       │
│  │ Threshold│─── Yes ──► END                        │
│  └────┬─────┘                                       │
│       │ No                                          │
│       ▼                                             │
│  ┌──────────┐                                       │
│  │  Build   │ ← buildActionSequence(target)         │
│  └────┬─────┘                                       │
│       │                                             │
│       ▼                                             │
│  ┌──────────┐                                       │
│  │ Execute  │ ← executeAiAction(action) 逐步執行    │
│  └────┬─────┘                                       │
│       │                                             │
│       ▼                                             │
│  ┌──────────┐                                       │
│  │  Record  │ ← recordAiStepEvent                   │
│  └────┬─────┘                                       │
│       │                                             │
│       └────── stamina > 0? ── Yes ──► loop ────────►│
└─────────────────────────────────────────────────────┘
```

### 7.4 為何不選方案 B（一次排完）

```
// 方案 B 的問題示意：
plan = [move to item A, collect A, move to item B, collect B]  // 一次排完
execute(plan[0])  // 移動到 A
execute(plan[1])  // 撿了 A → A 消失，但 plan[2] 還是指向 B
                   // 此時可能旁邊出現敵人，但 plan 還在執行撿 B
execute(plan[2])  // 繼續移動到 B → 錯過了攻擊敵人的時機
execute(plan[3])  // 撿了 B → 回合結束，但其實應該去打敵人

// 方案 A 則在每步後重新評估：
step 1: perceive → 撿 A 最佳 → 移動到 A
step 2: perceive → A 已消失，敵人出現 → 打敵人
step 3: perceive → 敵人已死，B 還在 → 撿 B
```

---

## 8. 輸入變數計算方式（虛擬碼）

```typescript
type StrategicCommand = 'free' | 'aggressive' | 'defensive' | 'gathering' | 'exploration'
type GoalName = 'selfPreservation' | 'collectItems' | 'collectResources' | 'engageCombat' | 'build' | 'explore'

interface GoalResult {
  score: number
  target?: GoalTarget
  context?: Record<string, unknown>
}

type GoalTarget =
  | { kind: 'retreat'; escapeDirection: Position }
  | { kind: 'item'; id: string; position: Position }
  | { kind: 'resource'; id: string; position: Position }
  | { kind: 'enemy'; id: string; kind_: string; position: Position; hp: number }
  | { kind: 'buildSite'; baseId: string; position: Position }
  | { kind: 'exploreDir'; direction: Position }

// 戰略命令加權矩陣
const STRATEGIC_WEIGHTS: Record<StrategicCommand, Record<GoalName, number>> = {
  free:         { selfPreservation: 1.0, collectItems: 1.0, collectResources: 1.0, engageCombat: 1.0, build: 1.0, explore: 1.0 },
  aggressive:   { selfPreservation: 0.5, collectItems: 0.8, collectResources: 0.7, engageCombat: 1.8, build: 0.6, explore: 0.7 },
  defensive:    { selfPreservation: 1.6, collectItems: 0.9, collectResources: 1.2, engageCombat: 0.4, build: 1.7, explore: 0.5 },
  gathering:    { selfPreservation: 1.0, collectItems: 1.7, collectResources: 1.7, engageCombat: 0.5, build: 0.8, explore: 0.6 },
  exploration:  { selfPreservation: 0.9, collectItems: 1.0, collectResources: 0.8, engageCombat: 0.6, build: 0.7, explore: 1.8 },
}

interface FuzzyInputs {
  hitsSurvivable: number         // player.health / maxVisibleEnemyDamage（能扛幾下）
  staminaRatio: number           // player.stamina / player.maxStamina
  distToNearestThreat: number    // min distance to hostile creature or enemy player
  enemyStrengthRatio: number     // nearest enemy HP / max HP (0 if no enemy)
  maxVisibleEnemyDamage: number  // 場上可見生物最高傷害力
  reachableItemCount: number     // items in reachable cells
  reachableResourceCount: number // resource points in reachable cells
  baseHealthRatio: number        // base HP / max HP (0 if no base)
  roundNumber: number            // state.round
  itemsCollectableBeforeExhaust: number  // items reachable within remaining stamina
  unexploredCellsNearby: number // unexplored cells within radius 5
}

function computeFuzzyInputs(state: GameState, player: PlayerState): FuzzyInputs {
  const reachableCells = collectReachableCells(state.map, player.position, player.stamina)
  const reachableItems = state.itemPoints.filter(item =>
    reachableCells.some(cell => cell.row === item.position.row && cell.column === item.position.column)
  )
  const reachableResources = state.resourcePoints.filter(rp =>
    reachableCells.some(cell => cell.row === rp.position.row && cell.column === rp.position.column)
  )
  const hostiles = listHostileActors(state, player.id)

  // 場上可見生物最高傷害力（用於計算 hitsSurvivable）
  const maxVisibleEnemyDamage = hostiles.length > 0
    ? Math.max(...hostiles.map(h => h.attackDamage))
    : 0
  // hitsSurvivable = 能扛幾下；無敵人時視為安全（99）
  const hitsSurvivable = maxVisibleEnemyDamage > 0
    ? player.health / maxVisibleEnemyDamage
    : 99

  const distToNearestThreat = hostiles.length > 0
    ? Math.min(...hostiles.map(h => manhattanDistance(player.position, h.position)))
    : Infinity

  return {
    hitsSurvivable,
    staminaRatio: player.stamina / player.maxStamina,
    distToNearestThreat,
    enemyStrengthRatio: hostiles.length > 0
      ? hostiles[0].health / hostiles[0].maxHealth
      : 0,
    maxVisibleEnemyDamage,
    reachableItemCount: reachableItems.length,
    reachableResourceCount: reachableResources.length,
    baseHealthRatio: state.bases.find(b => b.ownerPlayerId === player.id)
      ?.health / state.bases.find(b => b.ownerPlayerId === player.id)?.maxHealth ?? 1,
    roundNumber: state.round,
    itemsCollectableBeforeExhaust: computeCollectableCount(player, reachableItems, state.map),
    unexploredCellsNearby: countUnexploredNearby(state.map, player.position, 5),
  }
}
```

---

## 9. 參數可調性

所有隸屬函數的邊界值（a, b, c, d）與權重應可從 JSON 配置檔讀取，方便後續平衡調整：

```json
{
  "membershipFunctions": {
    "hitsSurvivable": {
      "low": [0, 0, 1.5, 3],
      "medium": [2, 3, 4, 5],
      "high": [4, 5.5, 99, 99]
    },
    "staminaRatio": {
      "depleted": [0.0, 0.0, 0.1, 0.2],
      "low": [0.15, 0.25, 0.4, 0.5],
      "medium": [0.35, 0.5, 0.65, 0.8],
      "high": [0.7, 0.85, 1.0, 1.0]
    }
  },
  "goalWeights": {
    "selfPreservation": 1.0,
    "collectItems": 0.8,
    "collectResources": 0.7,
    "engageCombat": 0.9,
    "build": 0.6,
    "explore": 0.5
  },
  "strategicWeights": {
    "free":         { "selfPreservation": 1.0, "collectItems": 1.0, "collectResources": 1.0, "engageCombat": 1.0, "build": 1.0, "explore": 1.0 },
    "aggressive":   { "selfPreservation": 0.5, "collectItems": 0.8, "collectResources": 0.7, "engageCombat": 1.8, "build": 0.6, "explore": 0.7 },
    "defensive":    { "selfPreservation": 1.6, "collectItems": 0.9, "collectResources": 1.2, "engageCombat": 0.4, "build": 1.7, "explore": 0.5 },
    "gathering":    { "selfPreservation": 1.0, "collectItems": 1.7, "collectResources": 1.7, "engageCombat": 0.5, "build": 0.8, "explore": 0.6 },
    "exploration":  { "selfPreservation": 0.9, "collectItems": 1.0, "collectResources": 0.8, "engageCombat": 0.6, "build": 0.7, "explore": 1.8 }
  },
  "minimumThreshold": 0.2,
  "selfPreservationOverrideThreshold": 0.6,
  "defensiveOverrideThreshold": 0.4,
  "distanceDecayRadius": 5,
  "distanceDecayFactor": 0.7
}
```

---

## 10. 與現行架構的整合路徑

| 現行模組 | 整合方式 |
|---|---|
| `ai/perception/reachableInterests.ts` | 作為 `computeFuzzyInputs` 的子函數 |
| `ai/perception/targetDiscovery.ts` | 供 `listHostileActors` 計算威脅 |
| `ai/execution/executeAiAction.ts` | 目標選定後的行動執行入口 |
| `ai/validation/validateAiAction.ts` | 行動執行前的合法性驗證 |
| `gameStore.runTest1Step` | 改為：perceive → evaluate → select → execute loop |
| `aiTurnScheduler` | 不變，仍呼叫 `runTest1Step` |

---

## 11. 實作順序建議

| 步驟 | 內容 | 依賴 |
|---|---|---|
| 1 | 建立 `ai/fuzzy/membershipFunctions.ts`（梯形隸屬函數） | 無 |
| 2 | 建立 `ai/fuzzy/fuzzyInputs.ts`（computeFuzzyInputs） | perception 模組 |
| 3 | 建立 `ai/fuzzy/goals.ts`（6 個 goal 評分函數） | step 1, 2 |
| 4 | 建立 `ai/fuzzy/strategicWeights.ts`（戰略命令加權矩陣 + 套用函數） | step 3 |
| 5 | 建立 `ai/fuzzy/decision.ts`（argmax + tie-breaking + 保命覆寫） | step 4 |
| 6 | 建立 `ai/fuzzy/goalActionMapper.ts`（目標→行動映射） | step 5 |
| 7 | 改寫 `runTest1Step` 使用新管線 | step 6 |
| 8 | 建立 `ai/fuzzy/fuzzyAi.test.ts`（端到端測試） | step 7 |
| 9 | （可選）JSON 配置檔讀取 | step 8 |

---

## 12. 已知缺陷與技術解法

### 12.1 缺陷一：多目標分數接近時「三心二意」

**症狀**：探索=0.55、交戰=0.52、採集=0.50，AI 每步切換目標——探索一步→交戰一步→採集一步→回到探索，什麼都做不成。

**根本原因**：argmax 沒有「慣性」，每步都是獨立決策，不記得上一步選了什麼。

#### 解法 A：遲滯（Hysteresis）—— 切換需要「明顯更優」

```
currentGoal = 上一步選出的目標（跨步保留）

// 切換條件：新目標分數 > 當前目標分數 + HYSTERESIS_MARGIN
HYSTERESIS_MARGIN = 0.15

if (bestGoal !== currentGoal && bestScore < currentGoalScore + HYSTERESIS_MARGIN):
    bestGoal = currentGoal  // 不切換，繼續執行原目標
```

**效果**：探索=0.55 時交戰要到 0.70 以上才會切過去，0.52 不夠。

**優點**：實現簡單，一行判斷。
**缺點**： margin 太大 → AI 反應遲鈍（血低了還不跑）；太小 → 效果不明顯。

#### 解法 B：慣性加成（Momentum）—— 持續執行加分

```
// 每步執行同一目標時，累積 momentum bonus
momentum[goal] += 0.03  // 每步 +0.03，上限 0.15

// 換目標時 momentum 歸零
if (bestGoal !== currentGoal):
    momentum[bestGoal] = 0

// 最終分數 = 原始分數 + momentum
finalScore = rawScore + momentum[goal]
```

**效果**：已執行 3 步的探索 goal 自動 +0.09，交戰要 0.64 以上才能贏。

**優點**：比 hysteresis 更自然——不是硬切，是「越做越想做」。
**缺點**：多一個需要調的參數（每步加多少、上限多少）。

#### 解法 C：最小承諾步數（Commitment Steps）

```
// 選出目標後，鎖定 COMMITMENT_STEPS 步不切換
COMMITMENT_STEPS = 2

if (stepsSinceGoalChange < COMMITMENT_STEPS):
    bestGoal = currentGoal  // 強制執行
```

**優點**：最簡單，保證至少做 2 步。
**缺點**：最粗暴——鎖定期間遇到緊急狀況（如血量驟降）也不能切換。

#### 建議：解法 A + B 組合

```
// 遲滯 + 慣性
currentGoalScore = rawScore[currentGoal] + momentum[currentGoal]

// 切換條件：新目標分數 > 當前目標分數 + margin
if (bestGoal !== currentGoal && bestScore < currentGoalScore + 0.1):
    bestGoal = currentGoal

// 慣性累積
if (bestGoal === currentGoal):
    momentum[bestGoal] = min(0.15, momentum[bestGoal] + 0.03)
else:
    momentum = {} // 歸零
```

---

### 12.2 缺陷二：參數不易調適

**症狀**：調了 selfPreservation 的梯形邊界，結果交戰分數也跟著變；想讓 AI 多打怪，改了 engageCombat 權重，結果 AI 不撿道具了。

**根本原因**：
1. 目標之間**非正交**——同一輸入（如 `hitsSurvivable`）影響多個目標
2. 模糊函數的邊界值是**魔術數字**，沒有直覺意義
3. 調一個參數的**連鎖反應**不可預測

#### 解法 A：正規化輸入（Normalize Inputs）

把所有輸入映射到 0\~1，讓隸屬函數的邊界值有統一意義：

```
// 之前：hitsSurvivable 可能是 0\~99，梯形邊界 [0, 0.5, 1, 2]
// 之後：映射到 0\~1，邊界 [0, 0.1, 0.2, 0.4]

function normalize(value, min, max):
    return clamp((value - min) / (max - min), 0, 1)
```

**效果**：所有隸屬函數都在 0\~1 範圍內工作，調參時有統一基準。

#### 解法 B：規則與數值分離（Rule-Value Separation）

把「決策邏輯」和「數值閾值」分開：

```json
// rules.json — 只描述「什麼條件下做什麼」，不含數字
{
  "selfPreservation": {
    "rules": [
      { "if": "hitsSurvivable is LOW", "then": "score += HIGH" },
      { "if": "hitsSurvivable is LOW and threat is CLOSE", "then": "score += VERY_HIGH" }
    ]
  }
}

// thresholds.json — 只描述「LOW 是多少」
{
  "hitsSurvivable": { "LOW": [0, 0.5, 1, 2] },
  "threatDistance": { "CLOSE": [0, 0, 2, 4] }
}
```

**效果**：調「LOW 的定義」不影響規則邏輯；改規則不影響數值。

#### 解法 C：情境化預設（Contextual Presets）

不同遊戲階段用不同參數集：

```
presets = {
  early: { // 前期：探索優先、戰鬥保守
    engageCombat_weight: 0.6,
    exploration_weight: 1.5,
    selfPreservation_threshold: 0.7
  },
  mid: { // 中期：平衡
    engageCombat_weight: 1.0,
    exploration_weight: 1.0,
    selfPreservation_threshold: 0.6
  },
  late: { // 後期：積極戰鬥
    engageCombat_weight: 1.4,
    exploration_weight: 0.5,
    selfPreservation_threshold: 0.5
  }
}

// 根據 roundNumber 自動選擇 preset
currentPreset = presets[round < 15 ? 'early' : round < 30 ? 'mid' : 'late']
```

**效果**：不需要一套參數打天下，每個階段獨立調整。

#### 解法 D：決策日誌 + 回放（Decision Logging + Replay）

記錄每次決策的完整資訊，方便事後分析：

```typescript
interface DecisionLog {
  round: number
  step: number
  inputs: FuzzyInputs          // 當時的所有輸入
  rawScores: Record<GoalName, number>  // 各目標原始分數
  finalScores: Record<GoalName, number> // 加權後分數
  selected: GoalName           // 最終選擇
  reason: string               // 為什麼選這個（最高分/tie-breaking/...）
}
```

**效果**：出問題時可以回放「當時為什麼做這個決定」，精確找到哪個參數不合理。

---

### 12.3 綜合建議：V2 架構方向

| 改進 | 優先度 | 複雜度 | 效果 |
|------|--------|--------|------|
| 慣性加成（Momentum） | 高 | 低 | 解決三心二意 |
| 遲滯門檻（Hysteresis） | 高 | 低 | 解決三心二意 |
| 決策日誌 | 高 | 低 | 解決不易調適 |
| 正規化輸入 | 中 | 中 | 解決不易調適 |
| 規則與數值分離 | 中 | 中 | 解決不易調適 |
| 情境化預設 | 低 | 中 | 解決不易調適 |

**V2 最低可行改進**：加 Momentum + Hysteresis + DecisionLog，三件事就能大幅改善兩個缺陷。

---

## 13. 意圖作為通用 AI 抽象：潛在設計價值

> 本節整合自 `refactor-fuzzy-evaluate-validate.md §8.6`，論述模糊邏輯的核心
> `buildValidatedActionSequence` 其實是**通用計畫器（Planner）**，可被所有 AI 策略複用。

### 13.1 核心洞察

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

### 13.2 通用架構

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

### 13.3 決策樹的整合

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

### 13.4 設計價值

| 價值 | 說明 |
|------|------|
| **統一驗證** | 所有 AI 策略的行動都經過同一套 validate + apply，不出現「模糊邏輯有驗證但決策樹沒有」的不一致 |
| **模組化** | 決策層（怎麼選）和計畫層（怎麼做）分離，可獨立替換 |
| **可測試** | 計畫器可獨立測試：給定任意 GoalTarget + state，驗證產出的 actions 合法 |
| **可擴展** | 新增 AI 策略（如 V3）只需產出 GoalTarget，不需重寫 action 生成邏輯 |
| **可除錯** | GoalTarget 作為意圖記錄，方便追溯「AI 為什麼做這個決定」 |
| **向後相容** | 決策樹可逐步遷移，不必一次改完——先包一層 intent wrapper |

### 13.5 統一介面（未來願景）

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
