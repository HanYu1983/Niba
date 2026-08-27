# 臨時重構：validateAiAction 體力驗證補全

> 狀態：待執行  
> 建立日期：2026-08-27  
> 觸發原因：`validateAiAction` 的 attack case 不檢查體力，且 `ACTION_STAMINA_COSTS` 與 `AiAction` type 不對應

---

## 1. 問題現狀

### 1.1 validateAiAction 的 attack case

```typescript
// validateAiAction.ts:63-67
case 'attack': {
  const target = findTarget(state, action.target)
  if (!target || target.health <= 0) return { valid: false, reason: '攻擊目標不存在或已死亡。' }
  if (!isAdjacent(actor.position, target.position)) return { valid: false, reason: '目標不在攻擊距離內。' }
  return { valid: true }  // ← 沒檢查體力！
}
```

AI 可以生成「體力不足的攻擊」，通過 validate 但執行時失敗。

### 1.2 ACTION_STAMINA_COSTS vs AiAction type 不對應

**ACTION_STAMINA_COSTS**（18 keys）：
```
attack: 5, externalSkill: 0, useItem: 0, collectResource: 2,
collectItem: 0, mission: 2, heal: 2, repair: 2, shop: 0,
policy: 2, transport: 3, build: 3, upgrade: 3, defenseBuild: 3,
resourcePointBuild: 10, roadBuild: 1, buildRoad: 2, exploration: 0
```

**AiAction type**（15 types）：
```
move, attack, collect, build, hold, end-turn, allocate-attribute,
use-item, equip, equip-inner-skill, learn-skill, practice-skill,
use-facility, defense-build, buy-item
```

兩者命名不一致、數量不一致、部分 AiAction type 完全沒有對應 key。

---

## 2. 重構方案

### 2.1 新增 `getAiActionStaminaCost` 函數

在 `actionCostRules.ts` 中新增，從 `AiAction` + `GameState` 直接算出體力消耗：

```typescript
import type { AiAction } from '../ai/aiAction'
import { getTerrainStaminaCost } from '../rules/playerDerivedRules'

/**
 * 從 AiAction + GameState 計算體力消耗。validateAiAction 和 V3 search 共用此函數。
 *
 * - move（相鄰格）：用 getTerrainStaminaCost 精確計算目的地地形消耗
 * - move（非相鄰格）：manhattan 距離 × 平均地形成本（估算）
 * - 其他 action：查 ACTION_STAMINA_COSTS
 */
export function getAiActionStaminaCost(state: GameState, action: AiAction): number {
  switch (action.type) {
    case 'move': {
      const player = state.players.find((p) => p.id === action.actor.id)
      if (!player) return Infinity  // 玩家不存在，視為不可行
      const dist = Math.abs(player.position.row - action.destination.row)
                 + Math.abs(player.position.column - action.destination.column)

      // 相鄰格：精確計算目的地地形消耗（含 buff 覆寫）
      if (dist <= 1) {
        const destCell = state.map.cells.find(
          (c) => c.row === action.destination.row && c.column === action.destination.column,
        )
        if (!destCell) return Infinity  // 目的地不存在
        return getTerrainStaminaCost(destCell.terrain, player)
      }

      // 非相鄰格：估算 = 距離 × 平均地形成本（平原 2 為基準）
      const AVG_TERRAIN_COST = 2
      return dist * AVG_TERRAIN_COST
    }
    case 'attack':        return ACTION_STAMINA_COSTS.attack          // 5
    case 'collect':       return action.target.kind === 'item'
                             ? ACTION_STAMINA_COSTS.collectItem       // 0
                             : ACTION_STAMINA_COSTS.collectResource   // 2
    case 'build':         return ACTION_STAMINA_COSTS.build           // 3
    case 'defense-build': return ACTION_STAMINA_COSTS.defenseBuild    // 3
    case 'buy-item':      return ACTION_STAMINA_COSTS.shop            // 0
    case 'use-facility':
      switch (action.facilityType) {
        case 'heal':     return ACTION_STAMINA_COSTS.heal            // 2
        case 'mission':  return ACTION_STAMINA_COSTS.mission         // 2
        case 'repair':   return ACTION_STAMINA_COSTS.repair          // 2
      }
    // 以下 action 不消耗體力
    case 'hold':               return 0
    case 'end-turn':           return 0
    case 'allocate-attribute': return 0
    case 'use-item':           return 0
    case 'equip':              return 0
    case 'equip-inner-skill':  return 0
    case 'learn-skill':        return 0
    case 'practice-skill':     return 0
  }
}
```

### 2.2 validateAiAction 補上體力檢查

在 `validateAiAction` 的 `switch` 前加入統一體力檢查：

```typescript
export function validateAiAction(state: GameState, action: AiAction): AiValidationResult {
  const actor = action.actor.kind === 'player'
    ? state.players.find((candidate) => candidate.id === action.actor.id)
    : state.creatures.find((candidate) => candidate.id === action.actor.id)
  if (!actor) return { valid: false, reason: '行動者不存在。' }
  if (actor.health <= 0) return { valid: false, reason: '行動者已無法行動。' }

  if (action.actor.kind === 'player') {
    const turnCheck = canPlayerPerformAction(state, action.actor.id, 0)
    if (!turnCheck.ok) return { valid: false, reason: turnCheck.reason ?? '目前無法行動。' }

    // ★ 新增：體力驗證
    const staminaCost = getAiActionStaminaCost(state, action)
    if (staminaCost > 0) {
      const player = state.players.find((candidate) => candidate.id === action.actor.id)
      if (player && player.stamina < staminaCost) {
        return { valid: false, reason: `體力不足（需要 ${staminaCost}，剩餘 ${player.stamina}）。` }
      }
    }
  }

  switch (action.type) {
    // ... 原有 case 不變
  }
}
```

### 2.3 AiAction type 完整對應表

| AiAction type | 計算方式 | 體力 | 備註 |
|---|---|---|---|
| `move`（相鄰格） | `getTerrainStaminaCost(destTerrain, player)` | 精確 | 含 buff 覆寫（破壁、疾行等） |
| `move`（非相鄰） | `manhattan × 2` | 估算 | 平原基準，實際由 Dijkstra 決定 |
| `attack` | `ACTION_STAMINA_COSTS.attack` | 5 | |
| `collect` | `collectResource` / `collectItem` | 2 / 0 | 依 target.kind |
| `build` | `ACTION_STAMINA_COSTS.build` | 3 | |
| `hold` | — | 0 | |
| `end-turn` | — | 0 | |
| `allocate-attribute` | — | 0 | |
| `use-item` | `useItem` | 0 | |
| `equip` | — | 0 | |
| `equip-inner-skill` | — | 0 | |
| `learn-skill` | — | 0 | |
| `practice-skill` | — | 0 | |
| `use-facility` | `heal` / `mission` / `repair` | 2 | 依 facilityType |
| `defense-build` | `defenseBuild` | 3 | |
| `buy-item` | `shop` | 0 | |

### 2.4 V3 文件同步修正

V3 設計文件 `ai-greedy-v3.md` 中 §2.4 的 `ACTION_STAMINA_COSTS` 表需要替換為 `getAiActionStaminaCost(state, action)` 函數。move 的體力不再由 search 層单独計算，統一由 `getAiActionStaminaCost` 處理。

---

## 3. 影響範圍

### 3.1 需要改動的檔案

| 檔案 | 改動 |
|------|------|
| `rules/actionCostRules.ts` | 新增 `getAiActionStaminaCost` |
| `ai/validation/validateAiAction.ts` | import + 體力檢查 |
| `ai/validation/validateAiAction.test.ts` | 新增體力不足的測試案例 |
| `handev/ai-greedy-v3.md` | §2.4 替換為 `getAiActionStaminaCost` |

### 3.2 不需要改動

- `executeAiAction.ts` — 執行層不變（已有的 `canPlayerPerformAction` 檢查仍在）
- `gameStore.ts` — scheduler 不變
- `ACTION_STAMINA_COSTS` 本身 — 保留作為遊戲規則的單一事實來源，`getAiActionStaminaCost` 從中取值

### 3.3 向後相容

- `getAiActionStaminaCost` 是純新增函數，不影響現有代碼
- `validateAiAction` 加入體力檢查後，之前通過的 action 如果體力不足會變成 `valid: false`——這是**正確行為**（之前是 bug）
- 現有測試中如果用了體力不足的 mock state，可能需要調整

---

## 4. 執行順序

1. `actionCostRules.ts`：新增 `getAiActionStaminaCost`
2. `validateAiAction.ts`：import + 加入體力檢查
3. `validateAiAction.test.ts`：新增測試
4. Docker tsc + vitest 驗證
5. Commit
6. 同步更新 V3 設計文件
