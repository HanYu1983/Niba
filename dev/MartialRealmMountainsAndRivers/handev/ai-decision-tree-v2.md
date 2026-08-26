# AI 設計版本 2：決策樹（Decision Tree）

> 狀態：草稿  
> 建立日期：2026-08-26  
> 前置文件：`ai-fuzzy-logic-v1.md`

---

## 1. 設計理念

放棄模糊邏輯的「多目標評分 → argmax」，回歸**最直接的條件判斷鏈**：

```
if (血量危急) → return 逃命
if (旁邊有弱怪) → return 攻擊
if (有東西撿) → return 撿道具
if ( ...) → return ...
return 待命
```

**核心原則**：越優先的狀況，在代碼中越早 return。條件判斷本身就是可行性測試——如果條件成立，行動一定可執行。

### 1.1 為什麼選決策樹

| 模糊邏輯 | 決策樹 |
|---------|--------|
| 多目標同時算分，容易三心二意 | 一次只做一件事，不會猶豫 |
| 參數多，調一個影響全局 | 每個 if 獨立，改一個不影響其他 |
| 需要 tie-breaking、momentum 等輔助機制 | 不需要——先匹配就先做 |
| 行為可預測性低（分數接近時隨機） | 行為完全可預測（看 if 順序就知道） |
| 適合「不知道該做什麼」的場景 | 適合「知道該做什麼」的場景 |

### 1.2 為什麼不完全拋棄模糊邏輯

決策樹的缺點是**每個條件是二元的**（成立/不成立），沒有「很危急 vs 有點危急」的區分。

解法：條件內部仍可用簡單數值判斷（如 `healthRatio < 0.3`），但**不需要隸屬函數**——就是普通的 if。

### 1.3 產出即合法（Validate-and-Fallback）

**核心保證**：從 `decideNextAction` 出來的 `AiAction`，必定能通過 `validateAiAction`。

**實現方式**：條件判斷與行動生成合為一步，生成後立即驗證，不通過就跳過：

```typescript
function decideNextAction(state: GameState, playerId: string): AiAction | null {
  // ...每個條件區塊都是：
  // 1. 條件成立？
  // 2. 成立 → 生成 candidate action
  // 3. validateAiAction(candidate) 通過？
  // 4. 通過 → return candidate
  // 5. 不通過 → fall through，繼續往下一個條件
}
```

**為什麼要這樣做**：
- 條件判斷是「粗估」（如 `hasRepairMaterials` 檢查庫存 ≥ 3）
- `validateAiAction` 是「精確」（檢查位置、朝向、冷卻、碰撞等）
- 兩者之間有 gap——粗估通過但精確驗證失敗是完全可能的
- **不驗證就 return 會導致執行時報錯**

**實例**：

```typescript
// 3.1 旁邊有能一回合击殺的怪 → 打
const easyKill = findAdjacentKillableCreature(state, player)
if (easyKill) {
  const candidate: AiAction = { type: 'attack', targetId: easyKill.id, targetType: 'creature' }
  if (validateAiAction(state, playerId, candidate)) {
    return candidate  // 必定可執行
  }
  // 不通過 → 不 return，繼續往下一個條件
}

// 4.1 可建造防禦 → 建造
if (canBuildDefense(state, playerId)) {
  const candidate = buildConstructionAction(state, player)
  if (candidate && validateAiAction(state, playerId, candidate)) {
    return candidate
  }
}
```

**與模糊邏輯的對比**：

| | 模糊邏輯 V1 | 決策樹 V2 |
|---|---|---|
| 行動生成 | `buildActionSequence` 產出後直接執行 | 生成後先 `validateAiAction`，通過才 return |
| 失敗處理 | `onStepFailed` callback（事後補救） | 條件判斷階段就避開（事前預防） |
| 可靠性 | 執行時才發現不行 | 出決策樹時就保證可行 |

---

## 2. 架構

### 2.1 決策函數

```typescript
function decideNextAction(state: GameState, playerId: string): AiAction | null {
  const player = getPlayer(state, playerId)
  if (!player) return null

  // 每個條件區塊的模式：
  //   條件成立？→ 生成 candidate → validateAiAction 通過？→ return
  //   否則 fall through 到下一個條件

  // ═══════════════════════════════════════════════════
  // 第一優先級：保命
  // ═══════════════════════════════════════════════════

  // 1.1 血量極低 → 立即逃命
  if (player.health <= player.maxHealth * 0.2) {
    const candidate = buildRetreatAction(state, player)
    if (candidate && validateAiAction(state, playerId, candidate)) return candidate
  }

  // 1.2 正在被攻擊且扛不住 → 逃命
  const incomingDamage = estimateIncomingDamage(state, player)
  if (incomingDamage > 0 && player.health - incomingDamage <= 0) {
    const candidate = buildRetreatAction(state, player)
    if (candidate && validateAiAction(state, playerId, candidate)) return candidate
  }

  // 1.3 體力耗盡 → 回據點休息
  if (player.stamina <= 2) {
    const candidate = buildReturnToBaseAction(state, player)
    if (candidate && validateAiAction(state, playerId, candidate)) return candidate
  }

  // ═══════════════════════════════════════════════════
  // 第二優先級：緊急交互
  // ═══════════════════════════════════════════════════

  // 2.1 據點快爆炸了 → 修理
  const base = getOwnedBase(state, playerId)
  if (base && base.health <= base.maxHealth * 0.3 && hasRepairMaterials(state, playerId)) {
    const candidate = buildRepairAction(state, player, base)
    if (candidate && validateAiAction(state, playerId, candidate)) return candidate
  }

  // 2.2 身上有受傷 debuff → 去醫務室
  if (hasInjuryDebuff(state, playerId)) {
    const candidate = buildInfirmaryAction(state, player)
    if (candidate && validateAiAction(state, playerId, candidate)) return candidate
  }

  // ═══════════════════════════════════════════════════
  // 第三優先級：明確收益
  // ═══════════════════════════════════════════════════

  // 3.1 旁邊有能一回合击殺的怪 → 打
  const easyKill = findAdjacentKillableCreature(state, player)
  if (easyKill) {
    const candidate: AiAction = { type: 'attack', targetId: easyKill.id, targetType: 'creature' }
    if (validateAiAction(state, playerId, candidate)) return candidate
  }

  // 3.2 旁邊有道具 → 撿
  const nearbyItem = findAdjacentItem(state, player)
  if (nearbyItem) {
    const candidate: AiAction = { type: 'collect-item', itemId: nearbyItem.id }
    if (validateAiAction(state, playerId, candidate)) return candidate
  }

  // 3.3 距離近的弱怪（2格內）→ 走過去打
  const closeWeakCreature = findCloseWeakCreature(state, player, 2)
  if (closeWeakCreature && player.stamina >= 4) {
    const candidate = buildMoveAndAttackAction(state, player, closeWeakCreature)
    if (candidate && validateAiAction(state, playerId, candidate)) return candidate
  }

  // 3.4 旁邊有資源點 + 建料不足 → 採集
  if (needsBuildingMaterials(state, playerId)) {
    const resource = findAdjacentResourcePoint(state, player)
    if (resource) {
      const candidate: AiAction = { type: 'collect-resource', resourcePointId: resource.id }
      if (validateAiAction(state, playerId, candidate)) return candidate
    }
  }

  // ═══════════════════════════════════════════════════
  // 第四優先級：中長期目標
  // ═══════════════════════════════════════════════════

  // 4.1 可以建造防禦 → 建造
  if (canBuildDefense(state, playerId)) {
    const candidate = buildConstructionAction(state, player)
    if (candidate && validateAiAction(state, playerId, candidate)) return candidate
  }

  // 4.2 有技能可學 + 有夠錢 → 去學
  const learnCandidate = checkLearnableSkill(state, player)
  if (learnCandidate && validateAiAction(state, playerId, learnCandidate)) return learnCandidate

  // 4.3 有裝備可換 → 換
  const equipCandidate = checkBetterEquipment(state, player)
  if (equipCandidate && validateAiAction(state, playerId, equipCandidate)) return equipCandidate

  // ═══════════════════════════════════════════════════
  // 第五優先級：探索 / 移動
  // ═══════════════════════════════════════════════════

  // 5.1 附近有未探索區域 → 去看看
  const exploreCandidate = buildExploreAction(state, player)
  if (exploreCandidate && validateAiAction(state, playerId, exploreCandidate)) return exploreCandidate

  // 5.2 遠處有目標（怪/資源/道具）→ 走過去
  const distantTarget = findDistantTarget(state, player)
  if (distantTarget) {
    const candidate = buildMoveToAction(state, player, distantTarget.position)
    if (candidate && validateAiAction(state, playerId, candidate)) return candidate
  }

  // ═══════════════════════════════════════════════════
  // 兜底：待命
  // ═══════════════════════════════════════════════════
  return null  // endTurn
}
```

### 2.2 狀態圖

```
start
  │
  ▼
┌──────────────┐   Yes   ┌─────────┐
│ 血量 <= 20%? │────────►│  逃命   │──► return
└──────┬───────┘         └─────────┘
       │ No
       ▼
┌──────────────┐   Yes   ┌─────────┐
│扛不住下一擊? │────────►│  逃命   │──► return
└──────┬───────┘         └─────────┘
       │ No
       ▼
┌──────────────┐   Yes   ┌─────────┐
│ 體力 <= 2?   │────────►│ 回據點  │──► return
└──────┬───────┘         └─────────┘
       │ No
       ▼
┌──────────────┐   Yes   ┌─────────┐
│ 據點快爆 +   │────────►│  修理   │──► return
│ 有材料?      │         └─────────┘
└──────┬───────┘
       │ No
       ▼
       ...
       │
       ▼
┌──────────────┐
│  無法匹配    │──► return null (endTurn)
└──────────────┘
```

---

## 3. 條件判斷詳細定義

每個條件就是一個純函數，回傳 boolean。**條件成立 = 行動可行**，不需要額外的可行性檢查。

### 3.1 保命條件

```typescript
// 1.1 血量極低
function isHealthCritical(player: PlayerState): boolean {
  return player.health <= player.maxHealth * 0.2
}

// 1.2 扛不住下一次攻擊
function isLethalDamageIncoming(state: GameState, player: PlayerState): boolean {
  const damage = estimateIncomingDamage(state, player)
  return damage > 0 && player.health <= damage
}

// estimateIncomingDamage：視野內所有敵人的最高單次傷害
function estimateIncomingDamage(state: GameState, player: PlayerState): number {
  const threats = listVisibleHostiles(state, player.id)
  if (threats.length === 0) return 0
  return Math.max(...threats.map(t => t.attackDamage))
}

// 1.3 體力耗盡
function isExhausted(player: PlayerState): boolean {
  return player.stamina <= 2
}
```

### 3.2 緊急交互條件

```typescript
// 2.1 據點快爆 + 有材料
function needsEmergencyRepair(state: GameState, playerId: string): boolean {
  const base = getOwnedBase(state, playerId)
  if (!base) return false
  return base.health <= base.maxHealth * 0.3 && hasRepairMaterials(state, playerId)
}

// 2.2 受傷 debuff
function hasInjuryDebuff(state: GameState, playerId: string): boolean {
  const player = getPlayer(state, playerId)
  return player?.buffs?.some(b => b.type === 'injury') ?? false
}
```

### 3.3 明確收益條件

```typescript
// 3.1 能一回合击殺
function findAdjacentKillableCreature(state: GameState, player: PlayerState): CreatureState | null {
  const creatures = listVisibleHostiles(state, player.id)
  for (const c of creatures) {
    if (manhattan(player.position, c.position) === 1) {
      const estimatedDamage = computePlayerDamage(player, c)
      if (estimatedDamage >= c.health) return c
    }
  }
  return null
}

// 3.2 旁邊有道具
function findAdjacentItem(state: GameState, player: PlayerState): ItemPoint | null {
  return state.itemPoints.find(item =>
    manhattan(player.position, item.position) === 1
  ) ?? null
}

// 3.3 近距離弱怪
function findCloseWeakCreature(state: GameState, player: PlayerState, maxDist: number): CreatureState | null {
  const creatures = listVisibleHostiles(state, player.id)
  const candidates = creatures.filter(c => {
    const dist = manhattan(player.position, c.position)
    return dist <= maxDist && c.health <= player.maxHealth * 0.4
  })
  return candidates.sort((a, b) => a.health - b.health)[0] ?? null
}

// 3.4 建料不足
function needsBuildingMaterials(state: GameState, playerId: string): boolean {
  const base = getOwnedBase(state, playerId)
  if (!base) return false
  return base.buildingMaterials < base.maxBuildingMaterials * 0.7
}
```

### 3.4 中長期條件

```typescript
// 4.1 可建造防禦
function canBuildDefense(state: GameState, playerId: string): boolean {
  const base = getOwnedBase(state, playerId)
  if (!base) return false
  return base.buildingMaterials >= 3 && hasEmptyBuildSlot(state, base)
}

// 4.2 可學技能
function checkLearnableSkill(state: GameState, player: PlayerState): AiAction | null {
  // 檢查武館 + 門派閘門
  // 有可學的 + 錢夠 → return learn action
  // 否則 return null
}

// 4.3 可換裝備
function checkBetterEquipment(state: GameState, player: PlayerState): AiAction | null {
  // 比較身上裝備 vs 背包內裝備
  // 有更強的 → return equip action
  // 否則 return null
}
```

---

## 4. 與模糊邏輯的關鍵差異

| 面向 | 模糊邏輯 V1 | 決策樹 V2 |
|------|------------|----------|
| 決策方式 | 多目標評分 → argmax | 條件鏈 → 第一個匹配 |
| 行為可預測性 | 低（分數接近時隨機） | 高（看 if 順序就知道） |
| 三心二意 | 容易發生 | 不可能 |
| 新增行為 | 需要設計新 goal + 調參 | 加一個 if |
| 緊急反應 | 依賴分數足夠高 | 一定在最前面， guaranteed |
| 適應性 | 好（分數漸變） | 差（二元匹配） |
| 複雜度 | 高（隸屬函數、權重、tie-breaking） | 低（if-else） |
| 調參難度 | 高（參數互相影響） | 低（每個條件獨立） |

---

## 5. 條件順序的設計原則

### 5.1 排序規則

```
1. 生存（保命）      → 最高，絕對不可跳過
2. 緊急交互（修理）  → 據點要爆了，比打怪重要
3. 明確收益（白嫖）  → 不花體力就能賺的
4. 中長期目標（建設）→ 花體力但有回報
5. 探索 / 移動       → 沒有更好的選擇
6. 待命              → 兜底
```

### 5.2 新增條件的規則

1. **想清楚優先級**：新條件該插在哪兩個現有條件之間？
2. **條件本身是可行性測試**：如果條件成立但行動不可執行，代表條件寫錯了
3. **每個條件只做一件事**：不要在一個 if 裡塞太多邏輯
4. **return null 是合法的**：不代表 AI 笨，代表「沒有值得做的事」

---

## 6. 可能的擴展

### 6.1 帶權重的條件（保留一點模糊性）

如果純二元不夠用，條件可以回傳一個簡單的權重：

```typescript
// 不是 0/1，而是 0~1
function combatAttractiveness(state: GameState, player: PlayerState): number {
  const creatures = listVisibleHostiles(state, player.id)
  if (creatures.length === 0) return 0

  const best = creatures[0]
  const canKill = computePlayerDamage(player, best) >= best.health ? 1.0 : 0.0
  const isClose = manhattan(player.position, best.position) <= 1 ? 1.0 : 0.3

  return canKill * isClose  // 能一回合击殺且近 → 1.0
}

// 在決策函數中用門檻判斷
if (combatAttractiveness(state, player) > 0.7) {
  return buildAttackAction(...)
}
```

**好處**：保留了決策樹的結構，但每個條件有「程度」的區分。

### 6.2 狀態記憶（State Memory）

記住上一步做了什麼，避免反覆切換：

```typescript
// 在 state 中記錄 AI 上一步的行動
const lastAction = state.aiMemory?.lastAction

// 如果上一步在打怪，這步繼續打（除非條件變了）
if (lastAction?.type === 'attack' && findAdjacentKillableCreature(...)) {
  return lastAction  // 繼續打
}
```

**好處**：解決「三心二意」但比 momentum 更直接。

### 6.3 子樹（Subtree）

複雜條件可以封裝為子決策樹：

```typescript
function decideCombatAction(state: GameState, player: PlayerState): AiAction | null {
  // 子樹：戰鬥決策
  const creatures = listVisibleHostiles(state, player.id)

  // 1. 能一回合击殺 → 打最近的
  const killable = creatures.find(c => canKillInOneTurn(player, c) && manhattan(player, c.position) === 1)
  if (killable) return { type: 'attack', targetId: killable.id, targetType: 'creature' }

  // 2. 旁邊有怪但殺不死 → 評估要不要打
  const adjacent = creatures.find(c => manhattan(player, c.position) === 1)
  if (adjacent && player.health > player.maxHealth * 0.5) {
    return { type: 'attack', targetId: adjacent.id, targetType: 'creature' }
  }

  // 3. 遠處有弱怪 → 走過去
  const weak = creatures.find(c => c.health <= player.maxHealth * 0.3 && manhattan(player, c.position) <= 3)
  if (weak && player.stamina >= 4) {
    return buildMoveToAction(state, player, weak.position)
  }

  return null  // 沒有好的戰鬥目標
}
```

---

## 7. 與現行架構的整合

決策樹替換的是 `selectBestGoal` + `buildActionSequence` 的角色：

```
之前：computeFuzzyInputs → evaluateAllGoals → rankGoals → buildActionSequence
之後：decideNextAction（一個函數搞定）
```

`runTest1Step` 改為：

```
while (player.stamina > 0 && !gameOver) {
  const action = decideNextAction(state, player.id)
  if (!action) break  // null = 待命，結束回合
  executeAiAction(state, action)
  state = getState()  // 重新讀取（state 已變）
}
```

**不變的部分**：
- `executeAiAction`：行動執行器
- `validateAiAction`：行動驗證器
- `aiTurnScheduler`：回合排程器
- `computeFuzzyInputs` 中的感知邏輯（仍然需要）

**可以簡化的部分**：
- `goals.ts` → 刪除（不再需要 17 個 goal 評分函數）
- `decision.ts` → 刪除（不再需要 argmax + tie-breaking）
- `goalActionMapper.ts` → 刪除（條件判斷直接 return action）

---

## 8. 實作順序

| 步驟 | 內容 | 依賴 |
|------|------|------|
| 1 | 建立 `ai/decisionTree/conditions.ts`（所有條件函數） | 無 |
| 2 | 建立 `ai/decisionTree/decideNextAction.ts`（主決策函數） | step 1 |
| 3 | 建立 `ai/decisionTree/actionBuilders.ts`（條件到行動的映射） | step 2 |
| 4 | 改寫 `runTest1Step` 使用決策樹 | step 3 |
| 5 | 保留 `fuzzyInputs.ts` 中的感知函數供條件使用 | 無 |
| 6 | （可選）逐步將模糊邏輯的行為遷移到決策樹 | step 4 |
