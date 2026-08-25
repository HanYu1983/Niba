# AI 感應器（Perception Sensors）演算法參照

> 2026-08-24 建立。整理專案中現有可被 AI 行為系統複用的感應器與空間查詢演算法。
> 後續新增感應器時同步更新本文件。

---

## 目錄

1. [空間基礎原語](#1-空間基礎原語)
2. [最短路徑樹（Dijkstra 移動成本圖）](#2-最短路徑樹dijkstra-移動成本圖)
3. [可達範圍收集](#3-可達範圍收集)
4. [障礙物偵測](#4-障礙物偵測)
5. [敵對目標發現](#5-敵對目標發現)
6. [視野與戰爭迷霧](#6-視野與戰爭迷霧)
7. [Creature Aggro 感知](#7-creature-aggro-感知)
8. [威脅評分（Threat Assessment）](#8-威脅評分threat-assessment)
9. [自保感知（Self-Preservation）](#9-自保感知self-preservation)
10. [動作驗證感知](#10-動作驗證感知)
11. [Policy 條件感知](#11-policy-條件感知)
12. [依賴關係圖](#12-依賴關係圖)

---

## 1. 空間基礎原語

### `Position` 型別
```ts
// types.ts:14-17
type Position = { row: number; column: number }
```

### 距離計算
| 函數 | 檔案 | 演算法 | 說明 |
|---|---|---|---|
| `manhattanDistance(a, b)` | `ai/perception/distance.ts` → `rules/mapCellStateRules.ts` | `\|Δrow\| + \|Δcol\|` | **全 AI 層唯一距離度量** |
| `getAdjacentPositions(pos)` | `types.ts:847-854` | 四方位鄰格 | 回傳上下左右 4 格 |
| `isSamePosition(a, b)` | `types.ts:856-858` | 同格判定 | |
| `isAdjacent(a, b)` | `types.ts:860-862` | Manhattan === 1 | |
| `isSameOrAdjacent(a, b)` | `types.ts:864-867` | 同格或相鄰 | |

> **注意**：部分舊程式碼仍直接寫 `Math.abs(a.row-b.row) + Math.abs(a.column-b.column)` 而非呼叫 `manhattanDistance`（見 `baseRules.ts:28`、`defenseRules.ts:38`、`creatureActions.ts:134` 等）。新程式應統一使用 `manhattanDistance`。

---

## 2. 最短路徑樹（Dijkstra 移動成本圖）

> **檔案**：`rules/movementRules.ts`  
> **重導出**：`ai/perception/blockedPositions.ts`

### `buildMovementCostMap(map, player, blockedPositions?)`
- **演算法**：Dijkstra 均勻代價搜尋（priority queue 為手寫 array + head pointer）
- **輸入**：地圖、玩家（含 position + stamina）、阻擋位置列表
- **輸出**：`Map<string, number>` — cellId → 從玩家位置出發的最低體力成本
- **地形成本**：

| 地形 | 成本 |
|---|---|
| road | 1 |
| plain | 2 |
| desert | 3 |
| forest | 4 |
| mountain | 5 |
| water | 6 |
| wall | ∞（不可通行） |

- **阻擋規則**：wall + 所有被佔用格（玩家、生物、基地、遺跡、門派大門、防禦建築）從 cost map 中排除
- **Buff 影響**：`BuffInstance.terrainCostOverride` 可覆蓋地形成本（單格）

### `getMovementCostTo(map, player, targetId, blockedPositions?)`
- 單格查詢：回傳 cost map 中指定 cellId 的成本，若不可達回傳 `null`

---

## 3. 可達範圍收集

> **檔案**：`ai/perception/reachablePositions.ts`

### `collectReachableCells(state, actor): ReachableCell[]`
```ts
type ReachableCell = {
  cellId: string
  position: Position
  cost: number  // 最低成本，保證 ≤ actor.stamina
}
```

- **流程**：呼叫 `buildMovementCostMap` → 過濾 `cost <= actor.stamina` 的所有格（含起點 cost=0）
- **用途**：defense positioning、support movement、escape routing、action validation
- **這是 AI 空間決策的核心感應器** — 所有移動類動作都從此結果集中選目標

---

## 4. 障礙物偵測

> **檔案**：`rules/movementRules.ts`  
> **重導出**：`ai/perception/blockedPositions.ts`

### `getBlockedPositions(state, playerId, options?): Position[]`
- 收集所有佔用位置（玩家、生物、基地、完好遺跡、門派大門、防禦建築）
- `options.includeInteractionPoints`：是否額外包含互動點（資源、物品等）

---

## 5. 敵對目標發現

> **檔案**：`ai/perception/targetDiscovery.ts`

### `listHostileActors(state): HostileActor[]`
```ts
type HostileActor =
  | { sourceType: 'creature'; creature: CreatureState }
  | { sourceType: 'nest'; nest: CreatureNestState }
```

- 回傳所有 **存活**（health > 0）的生物與巢穴
- 用途：defense / support / self-preservation 規則的共同敵對目標列表

### 輔助函數
| 函數 | 說明 |
|---|---|
| `getHostileActorId(actor)` | 提取 id |
| `getHostileActorPosition(actor)` | 提取 position |
| `isHostileActorStillValid(state, targetType, targetId)` | 過期目標檢查（是否存在 + 存活） |

---

## 6. 視野與戰爭迷霧

> **檔案**：`rules/visibilityRules.ts`

### 視野半徑常數
| 來源 | 半徑 |
|---|---|
| 玩家基礎視野 | 3 |
| 已發現基地 | 5 |
| 瞭望台 | 3 |
| 進階瞭望台 | 5 |
| 小型瞭望台 | 2 |
| 小型箭塔 | 1 |
| 偵查符咒（scout talisman） | 自訂 range |

### 主要函數

#### `getPlayerVisibleCellIds(state, playerId): Set<string>`
- 聯集：所有存活玩家視野 + 已發現基地 + 防禦建築視野
- **AI 用途**：決定 AI 能「看到」哪些格子

#### `getPlayerVisionRange(state, playerId): number`
- 回傳 `DEFAULT_VISION_RANGE(3)` + buff 額外加成（如 `visionRadiusBonus`）

#### `getCellVisibility(state, playerId, cell): VisibilityState`
- `'visible'`（當前可見）| `'explored'`（歷史已探索）| `'unexplored'`

#### `getScoutCellIds(map, position, range): string[]`
- 以 position 為中心、Manhattan range 為半徑，回傳所有格 ID

---

## 7. Creature Aggro 感知

> **檔案**：`rules/creatureBehaviorRules.ts`

### 行為類型與 Aggro 半徑
| 行為 | Aggro 半徑 | 目標優先序 |
|---|---|---|
| sieger | 7 | base → player |
| hunter | 6 | player only |
| scavenger | 5 | resource → player |
| wanderer | 4 | item → player |
| roamer | 2 | player only（最近距離） |

> 以上半徑可被 JSON policy `parameters.aggroRange` 覆蓋。

### 箭塔仇恨
- `ARROW_TOWER_AGGRO_RANGE = 5`
- 非 roamer 行為的生物，若 5 格內有箭塔且存活 → **箭塔為最高優先目標**（覆蓋行為優先序）

### `selectCreatureTarget(state, creature): CreatureTarget | null`
```
輸入：GameState + CreatureState
輸出：CreatureTarget | null

流程：
1. 取得 aggroRange（policy → fallback 常數）
2. Roamer 特例：僅掃描玩家，回傳最近或 null
3. 非 Roamer：檢查箭塔（5格內 → 最高優先）
4. 依行為優先序分組掃描（player/resource/base/item）
5. 每組選最近候選（Manhattan distance）
6. Fallback：最近 base（最後手段）
```

### `CreatureTarget` 結構
```ts
type CreatureTarget = {
  type: 'player' | 'resource' | 'item' | 'base' | 'defense'
  id: string
  position: Position
  distance: number
  player?: PlayerState
  resourcePoint?: ResourcePointState
  itemPoint?: ItemPointState
  base?: BaseState
  defenseStructure?: DefenseStructureState
}
```

---

## 8. 威脅評分（Threat Assessment）

> **檔案**：`aiDefenseRules.ts`

### `assessBaseThreats(state, baseId, aiPlayerId): AiThreatAssessment[]`
```ts
type AiThreatAssessment = {
  targetId: string
  targetType: 'creature' | 'nest'
  position: Position
  distanceToBase: number
  distanceToAi: number
  threatScore: number
  directlyAttackingBase: boolean
}
```

**評分公式**：
```
threatScore = 0
if (directlyAttackingBase)        threatScore += 1000
threatScore += max(0, 120 - distanceToBase × 10)   // 靠近基地加分
threatScore += max(0, 30 - distanceToAi)            // 靠近 AI 加分
```

- 掃描範圍：基地 12 格內的敵對目標
- 結果依 `threatScore` 降序排列

### `chooseDefenseAction(state, aiPlayerId, order): AiDefenseAction`
決策級聯：
1. **攻擊**：最近威脅 adjacent（distanceToAi === 1）→ 攻擊
2. **回防**：AI 在防禦半徑外 → 移動至最靠近基地的可達格
3. **攔截**：最高威脅在 (radius+3) 內 → 移動至最靠近威脅的可達格
4. **待命**：以上皆非 → hold

---

## 9. 自保感知（Self-Preservation）

> **檔案**：`aiSelfPreservationRules.ts`

### `chooseSelfPreservationAction(state, playerId, retreatHealthPercent, emergency?): AiDefenseAction | null`

**觸發條件**（滿足任一即觸發撤退）：
- 血量百分比 ≤ `max(emergency.minimumHealthPercent ?? 10, retreatHealthPercent)`
- 相鄰敵人數 ≥ `emergency.surroundedEnemyCount ?? 2`

**撤退路徑選擇**：
```
1. collectReachableCells 取得所有可達格
2. 對每個可達格：計算 nearestEnemyDistance = min(manhattanDistance to all enemies)
3. 排序：離所有敵人最遠 → 最低移動成本
4. 回傳最優位置
```

- 回傳 `null` 表示不需要自保 → 呼叫者繼續正常決策

---

## 10. 動作驗證感知

> **檔案**：`ai/validation/validateAiAction.ts`

### `validateAiAction(state, action): AiValidationResult`
| 動作類型 | 驗證內容 |
|---|---|
| move | 目標在 `collectReachableCells` 結果集中 |
| attack | 目標存在 + 存活 + actor 與 target adjacent |
| collect | 目標存在 + 存活 |
| build | 基地存在 |

### `validateAiDefenseDecision(state, playerId, decision)`
- 適配器：`AiDefenseAction` → `AiAction`（透過 `defenseActionToAiAction`）→ `validateAiAction`

---

## 11. Policy 條件感知

> **檔案**：`ai/policy/aiJsonPolicy.ts` + `ai/policy/aiPolicyRegistry.ts`

### 感知條件 ID（AiConditionId）
| 條件 | 對應感知 |
|---|---|
| `self-preservation-needed` | health% ≤ threshold 或 adjacent enemy ≥ limit |
| `adjacent-hostile` | isAdjacent(ai, any hostile) |
| `protect-base-threatened` | threats within base radius |
| `outside-defense-radius` | manhattanDistance(ai, base) > radius |
| `support-target-too-far` | manhattanDistance(ai, target) > maxDistance |
| `no-threat` | listHostileActors → none near |
| `no-target` | selectCreatureTarget → null |

### 可調參數
```ts
// aiJsonPolicy.ts — AiJsonPolicy.parameters
{
  aggroRange: number        // creature 生物仇恨半徑覆蓋
  minimumHealthPercent: number  // 自保血量門檻
  surroundedEnemyCount: number  // 被包圍敵人數門檻
}
```

---

## 12. 依賴關係圖

```
types.ts
├── Position, isAdjacent, getAdjacentPositions, isSamePosition
├── terrainStaminaCost（地形成本表）
│
├──► rules/mapCellStateRules.ts
│   └── manhattanDistance, isWithinMapInfluenceRange
│       └──► ai/perception/distance.ts（重導出）
│
├──► rules/movementRules.ts
│   ├── buildMovementCostMap（Dijkstra 移動成本圖）
│   ├── getBlockedPositions（障礙物列表）
│   ├── getMovementCostTo（單格成本查詢）
│   └── getReachableCellIds
│       └──► ai/perception/blockedPositions.ts（重導出全部）
│           └──► ai/perception/reachablePositions.ts
│               └── collectReachableCells ← 所有移動決策的核心
│
├──► rules/visibilityRules.ts
│   ├── getPlayerVisibleCellIds（視野聯集）
│   ├── getCellVisibility（單格可見性）
│   └── getScoutCellIds（偵查範圍）
│
├──► rules/creatureBehaviorRules.ts
│   ├── selectCreatureTarget（creature 目標選擇）
│   ├── getCreatureAggroRange（aggro 半徑）
│   └── getCreatureTargetGroups（行為優先序）
│
├──► ai/perception/targetDiscovery.ts
│   ├── listHostileActors（敵對目標列舉）
│   ├── getHostileActorId / Position
│   └── isHostileActorStillValid（過期檢查）
│
├──► aiDefenseRules.ts（威脅評分 + 防禦決策）
│   └── uses: distance + reachablePositions + targetDiscovery
│
├──► aiSupportRules.ts（支援決策）
│   └── uses: distance + reachablePositions + targetDiscovery
│
├──► aiSelfPreservationRules.ts（自保撤退）
│   └── uses: distance + reachablePositions + targetDiscovery
│
├──► ai/validation/validateAiAction.ts（動作驗證）
│   └── uses: reachablePositions + isAdjacent + entity lookups
│
└──► ai/policy/aiPolicyRegistry.ts（JSON Policy 查詢）
    └── uses: AiConditionId ↔ 感知函數映射
```

---

## 已知限制與演進方向

| 限制 | 說明 | 潛在改進 |
|---|---|---|
| 唯一距離度量 | 全系統只用 Manhattan distance | 若需 diagonals 可加 Euclidean |
| 無空間索引 | 障礙物/目標為線性掃描 | 大地圖可加四叉樹 / 網格索引 |
| 無路徑重建 | `buildMovementCostMap` 只回傳成本，不含前驅 | 需最短路徑時可從 cost map 回溯 |
| 視野不含 AI | 視野計算只服務玩家，AI 無「感知範圍」概念 | 未來可擴展 AI 自己的感知圈 |
| Creature 路徑為貪婪 | creature 用 greedy step（最近鄰格）非 Dijkstra | 大地圖 creature 可能繞路 |
| inline Manhattan | 6+ 處仍手寫 `Math.abs(...)` | 統一重構為 `manhattanDistance` |

---

## 參考檔案路徑

| 模組 | 路徑 |
|---|---|
| Position 原語 | `mygame2/src/game/types.ts` |
| Dijkstra 移動成本圖 | `mygame2/src/game/rules/movementRules.ts` |
| 可達範圍 | `mygame2/src/game/ai/perception/reachablePositions.ts` |
| 障礙物 | `mygame2/src/game/ai/perception/blockedPositions.ts` |
| 距離計算 | `mygame2/src/game/ai/perception/distance.ts` |
| 敵對目標發現 | `mygame2/src/game/ai/perception/targetDiscovery.ts` |
| 視野 | `mygame2/src/game/rules/visibilityRules.ts` |
| Creature 行為感知 | `mygame2/src/game/rules/creatureBehaviorRules.ts` |
| 威脅評分 | `mygame2/src/game/aiDefenseRules.ts` |
| 支援感知 | `mygame2/src/game/aiSupportRules.ts` |
| 自保感知 | `mygame2/src/game/aiSelfPreservationRules.ts` |
| 動作驗證 | `mygame2/src/game/ai/validation/validateAiAction.ts` |
| JSON Policy | `mygame2/src/game/ai/policy/aiJsonPolicy.ts` |
| Policy Registry | `mygame2/src/game/ai/policy/aiPolicyRegistry.ts` |
