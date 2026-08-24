# Buff 系統設計文件

- 文件日期：2026-08-16
- 關聯文件：`reports/item-depth-design.md`（道具深度設計，Buff 為其創意根源）
- 目的：擴充 `BuffDefinition` 的分類與欄位，讓道具、功法、事件都能掛載更豐富的狀態效果。
- 狀態：本文件為**設計提案**，所有項目需經逐項確認後才進入實作。

---

## 一、現狀診斷

目前 `src/game/catalogs/buffCatalog.ts` 的 `BuffDefinition` 支援欄位：

| 欄位 | 作用 | 現有使用者 |
|---|---|---|
| `attributeModifiers` | 加減五維 | 藥丸、內功常駐 |
| `attributeMultiplier` | 五維乘算 | 寒毒（×0.8） |
| `criticalRateMultiplier` | 暴擊率乘算 | 暴擊強化（×2） |
| `terrainCostOverride` | 地形消耗覆寫 | 疾行 |
| `terrainStaminaCostMultipliers` | 地形消耗乘算 | （原水行適性，已移除） |
| `maxHealthDamagePercent` | 每回合扣最大血% | 燃燒（20%） |
| `reflectionPercent` | 受傷反彈% | 反震（100%） |

### 問題

- 幾乎都是「被動數值修正」，缺乏主動觸發、行動控制、資源轉換、狀態互動、條件型。
- Buff 是道具 / 功法 / 事件的共用掛載點；Buff 豐富度直接決定上層玩法深度。
- 現有負面狀態（燃燒、寒毒）已有，但缺少對應的「淨化 / 免疫 / 傳染」互動。

---

## 二、Buff 分類架構

| 類別 | 核心精神 | 預估風險 |
|---|---|---|
| 1. 資源轉換 | 傷害↔血量、受傷↔護盾 | 低 |
| 4. 條件型 | 依血量區間觸發強化 | 低 |
| 5. 移動類 | 指定地形消耗降為 1 | 低 |

---

## 三、BuffDefinition 欄位擴充草案

```ts
export type BuffCategory = 'buff' | 'debuff' | 'neutral'

export type BuffConditional = {
  when: 'health-below' | 'health-above'
  /** 0-1 之間的血量比例門檻。 */
  threshold: number
  /** 觸發時套用的五維乘算。 */
  multiplier: number
}

export type BuffDefinition = {
  id: string
  name: string
  description: string
  duration: BuffDuration
  durationRounds?: number
  category?: BuffCategory
  // 現有欄位
  attributeModifiers?: Partial<PlayerAttributes>
  attributeMultiplier?: number
  criticalRateMultiplier?: number
  terrainCostOverride?: number
  terrainStaminaCostMultipliers?: Partial<Record<TerrainType, number>>
  maxHealthDamagePercent?: number
  reflectionPercent?: number
  // 新增：資源轉換
  lifestealPercent?: number
  innerPowerLeechPercent?: number
  damageReductionPercent?: number
  // 新增：週期回復
  healthRegenPercent?: number
  innerPowerHealthRegenPercent?: number
  // 新增：傷害增益
  damageDealtPercent?: number
  externalSkillDamagePercent?: number
  // 新增：觸發 / 行動型
  onHitDamagePercent?: number
  thornsFlat?: number
  extraAction?: boolean
  actionPriority?: 'first' | 'last'
  // 新增：條件型
  conditional?: BuffConditional
}
```

---

## 四、類別 1：資源轉換

| Buff 名稱 | 欄位 | 效果 | 可掛載來源 |
|---|---|---|---|
| 嗜血 | `lifestealPercent: 0.3` | 造成傷害時回復 30% 傷害值的血量 | 道具、功法 |
| 鐵壁訣 | `damageReductionPercent: 0.2` | 受到傷害時，最終傷害 -20%（例：原 10 點 → 8 點） | 道具、功法 |
| 回春訣 | `healthRegenPercent: 0.1` | 每回合回復最大血量 10% 的氣血（與燃燒正負相對） | 道具、功法 |
| 化氣訣 | `innerPowerHealthRegenPercent: 0.1` | 每回合回復「最大內力 ×10%」的氣血（基準為內力，非血量） | 道具、功法 |
| 汲元 | `innerPowerLeechPercent: 0.2` | 造成傷害時回復 20% 傷害值的內力 | 功法 |
| 破軍訣 | `damageDealtPercent: 0.2` | **普通攻擊**造成的最終傷害 +20%（例：原 10 點 → 12 點；外功不受益） | 道具、功法 |
| 罡氣訣 | `externalSkillDamagePercent: 0.2` | 外功造成的最終傷害 +20%（普攻/其他來源不受益） | 功法 |

### 可行性分析（嗜血 / 資源轉換，2026-08-16 確認）

經核對現有傷害計算現場，**嗜血（`lifestealPercent`）可完全用現有機制實作，不需改動傷害公式結構**，屬四類擴充中風險最低者。

**兩個「造成傷害」現場都已能讀到攻擊者 Buff：**

- 玩家攻擊（外功 / 普攻）— `src/game/actions/combatActions.ts`
  - 第 267 行：`damage = getSkillDamage(getEffectiveAttributesForPlayer(target.player), ...)`，`target.player` 即攻擊者，其 `getActiveBuffsForPlayer(target.player)` 隨手可得。
  - 第 322 行附近：`targetWithFunctionalBuff` 處理完目標後，攻擊者 `playerWithAccessoryWear` 被寫回 state。只需在此多算 `heal = floor(damage * lifestealPercent)` 並加回攻擊者 `health`。
- 怪物攻擊玩家 — `src/game/actions/creatureActions.ts`
  - 第 358 行：`reflectionPercent` 已用 `getActiveBuffsForPlayer(adjacentPlayer)` 讀相鄰玩家 Buff；攻擊者 `creature` 的 Buff 在第 298 行（`isImmobilized`）已在使用。怪物帶嗜血可在第 350 行 `actualDamage` 算出後回補 `creature.health`。

**最小實作步驟：**

| 步驟 | 檔案 | 內容 |
|---|---|---|
| 1 | `src/game/catalogs/buffCatalog.ts` 的 `BuffDefinition` | 加 `lifestealPercent?: number` 欄位（草案已有） |
| 2 | `src/game/rules/playerDerivedRules.ts` | 加 `getLifestealPercent(player)`：對 `getActiveBuffsForPlayer` 求和 `lifestealPercent` |
| 3 | `combatActions.ts` + `creatureActions.ts` | 在兩個傷害現場算 `heal` 並回補攻擊者血量 |

**汲元改版（2026-08-16）：** 原「吸血並緩回」改為「造成傷害時回復內力」（`innerPowerLeechPercent`）。機制與嗜血完全對稱——同樣在兩個「造成傷害」現場（`combatActions.ts` 第 267/322 行、`creatureActions.ts` 第 350 行）讀攻擊者 Buff，只是回補欄位由 `health` 改為 `innerPower`（受 `maxInnerPower` 上限約束）。`getLifestealPercent` 的同形函式 `getInnerPowerLeechPercent(player)` 一併加入 `playerDerivedRules.ts` 即可。

**破軍訣（2026-08-16 新增，2026-08-16 修正範圍）：** **普通攻擊**造成的最終傷害 +20%（`damageDealtPercent`）。作用範圍限定於普攻——即 `creatureActions.ts` 第 350 行怪物攻擊玩家現場（以及未來的玩家普攻現場），外功（`combatActions.ts` 第 267 行）不觸發，與罡氣訣（外功）互補不重疊。使用者範例：原 `damage = 10`，`damageDealtPercent = 0.2` → `12`。風險低。

**罡氣訣（2026-08-16 新增）：** 外功造成的最終傷害 +20%（`externalSkillDamagePercent`），作用範圍比破軍訣更窄——只在 `combatActions.ts` 第 267 行的外功傷害計算處乘上攻擊者 Buff 總和，普攻（`creatureActions.ts` 怪物攻擊）與其他來源不觸發。與破軍訣可疊加（外功同時吃兩者）。風險低。

**回春訣（2026-08-16 新增）：** 每回合回復最大血量 10% 的氣血（`healthRegenPercent`）。與燃燒（`maxHealthDamagePercent`）正負相對——現有 `applyPeriodicBuffDamage`（`playerRules.ts` 第 71 行）已在每回合對 `maxHealthDamagePercent` 求和並扣血，只需在同一處加一個對 `healthRegenPercent` 求和並**加血**的分支（受 `maxHealth` 上限約束）。風險低。

**化氣訣（2026-08-16 新增）：** 每回合回復「最大內力 ×10%」的氣血（`innerPowerHealthRegenPercent`），基準為內力而非血量，與回春訣互補。同樣接在 `applyPeriodicBuffDamage`（`playerRules.ts` 第 71 行）的週期處理，加一個對 `innerPowerHealthRegenPercent` 求和並加血的分支（受 `maxHealth` 上限約束）。風險低。

**待決策項目自然消解（已確認）：**

- **1-B 吸血適用範圍**：嗜血只在「攻擊者主動造成的直接傷害」兩個現場觸發。燃燒（`applyPeriodicBuffDamage`，`playerRules.ts` 第 71 行）是週期扣血、反震（`reflectionPercent`）是「受傷反彈」非「造成傷害」——兩者都不經過這兩個現場，**天然不會觸發吸血，無需額外排除**。
- **1-A 護盾欄位**：屬「鐵壁訣」(`damageToShield`) 範疇，嗜血只回血不碰護盾，本項不受影響，待鐵壁訣實作時再決定。

### 可行性分析（鐵壁訣 / 減傷，2026-08-16 確認）

經核對受傷現場，**鐵壁訣（`damageReductionPercent`）可完全用現有機制實作，風險低**，與嗜血互補（一攻一守）。

**受傷主現場** — `src/game/actions/creatureActions.ts` 第 350–358 行：

```ts
const damage = avoided ? 0 : halved ? Math.max(1, Math.floor(baseDamage / 2)) : baseDamage
const actualDamage = Math.min(adjacentPlayer.health, damage)
// ↓ 插入減傷：讀 adjacentPlayer 的 Buff（reflectionPercent 已在第 358 行讀過同一來源）
const reduction = getActiveBuffsForPlayer(adjacentPlayer)
  .reduce((total, buff) => total + (getBuff(buff.definitionId)?.damageReductionPercent ?? 0), 0)
const finalDamage = Math.max(1, Math.floor(actualDamage * (1 - reduction)))
nextPlayers = nextPlayers.map((player) => player.id === adjacentPlayer.id
  ? { ...player, health: Math.max(0, player.health - finalDamage) }
  : player)
```

使用者範例：原本 `actualDamage = 10`，`reduction = 0.2` → `finalDamage = 8`。✅

**最小實作步驟：**

| 步驟 | 檔案 | 內容 |
|---|---|---|
| 1 | `src/game/catalogs/buffCatalog.ts` 的 `BuffDefinition` | 加 `damageReductionPercent?: number` 欄位（取代原 `damageToShield`） |
| 2 | `src/game/rules/playerDerivedRules.ts` | 加 `getDamageReductionPercent(player)`：對 `getActiveBuffsForPlayer` 求和 `damageReductionPercent` |
| 3 | `src/game/actions/creatureActions.ts` | 在受傷現場套用減免（如上） |

**與反震（`reflectionPercent`）的互動（待確認）：** 現場先算 `actualDamage` 再扣血，反震基於 `actualDamage`。減傷插入後有兩種處理：
- 方案 A（建議）：減傷只影響「玩家實際損失」，反震仍基於 `actualDamage`（即玩家少掉血、但照常反彈原傷害比例）。
- 方案 B：反震也基於 `finalDamage`（減傷後）。

建議採方案 A，使「減傷」與「反震」語意獨立；若採 B 則需在減傷後再算反震。

**減傷範圍（建議）：** 先只對「怪物直接攻擊」生效（最簡單）。是否涵蓋 `applyPeriodicBuffDamage`（燃燒類週期扣血）與玩家對玩家（PvP）另議。

### 待決策

1. 護盾欄位（原 1-A / 1-C）：**已作廢** — 鐵壁訣改為減傷（`damageReductionPercent`），本類別不再涉及護盾概念。
2. 吸血是否對「燃燒 / 反震」等非直接傷害生效？— **已決：天然不生效，無需排除（見可行性分析）**
3. 減傷與反震的互動（方案 A / B）— **建議方案 A，待確認**

---

## 五、類別 4：條件型

| Buff 名稱 | 欄位 | 效果 | 可掛載來源 |
|---|---|---|---|
| 背水 | `conditional: { when: 'health-below', threshold: 0.3, multiplier: 1.5 }` | 血量低於 30% 時五維 ×1.5 | 功法、道具 |
| 養氣 | `conditional: { when: 'health-above', threshold: 0.8, multiplier: 1.2 }` + 內力回復加成 | 血量高於 80% 時強化 | 道具 |
| 孤注 | `conditional: { when: 'health-below', threshold: 0.15, multiplier: 2 }` | 瀕死爆發，高風險 | 功法 |

### 可行性分析（條件型 / 類別 4，2026-08-16 確認）

經核對 `src/game/rules/playerDerivedRules.ts` 的 `getEffectiveAttributesForPlayer`（第 115 行），**條件型 Buff 可完全用現有機制實作，風險低**，且天然消解三項待決策。

**關鍵事實**：`getEffectiveAttributesForPlayer(player)` 接收完整 `PlayerState`，內含 `health` 與 `maxHealth`；且每次傷害 / 受傷計算都會被呼叫（`combatActions.ts` 第 267 行、`creatureActions.ts` 第 350 行）。因此只要在現有的 `attributeMultiplier` 迴圈（第 145–149 行）之後，加一段血量比例判斷與乘算即可，屬**即時判定**。

**插入位置（示意）**：

```ts
const healthRatio = player.maxHealth > 0 ? player.health / player.maxHealth : 1
for (const buff of getActiveBuffsForPlayer(player)) {
  const conditional = getBuff(buff.definitionId)?.conditional
  if (!conditional) continue
  const met = conditional.when === 'health-below'
    ? healthRatio < conditional.threshold
    : healthRatio > conditional.threshold
  if (!met) continue
  for (const attribute of Object.keys(result) as Array<keyof PlayerAttributes>) {
    result[attribute] *= conditional.multiplier
  }
}
```

**最小實作步驟：**

| 步驟 | 檔案 | 內容 |
|---|---|---|
| 1 | `src/game/catalogs/buffCatalog.ts` 的 `BuffDefinition` | 加 `conditional?: BuffConditional` 欄位（草案已有） |
| 2 | `src/game/rules/playerDerivedRules.ts` | 在 `getEffectiveAttributesForPlayer` 的 `attributeMultiplier` 迴圈後，加 `conditional` 血量判斷與乘算 |
| 3 | `src/game/catalogs/buffCatalog.ts` | 加背水、養氣、孤注三個定義 |

**待決策項目自然消解（已確認）：**

- **4-A 乘算疊加**：條件型乘算接在 `attributeMultiplier`（寒毒 ×0.8）迴圈之後，兩者順序相乘——背水/孤注是「額外加成」、寒毒是「減益」，語意合理，無需額外排除。
- **4-B 條件判定時機**：`getEffectiveAttributesForPlayer` 在每次傷害計算當下被呼叫，血量比例即時讀取，**天然即時判定**，無需額外狀態標記。
- **4-C 多條件處理**：多個條件型同時滿足時，迴圈會逐一乘算（背水 ×1.5 與孤注 ×2 可同時觸發 → ×3），全部疊乘，無需特別處理。

**風險**：低。純加法、不動回合順序、不動現有公式，與類別 1 同級。

**提醒**：`BuffConditional` 與 `BuffCategory` 目前僅定義在本文草案（第三節），實際 `buffCatalog.ts` 尚未納入——實作時需將其搬進真實程式碼。

### 待決策

1. 條件型乘算是否與 `attributeMultiplier` 疊乘？— **已決：疊乘（見可行性分析）**
2. 條件在「計算傷害當下」判定，還是「Buff 施加當下」判定？— **已決：即時判定（見可行性分析）**
3. 多個條件型 Buff 同時滿足時如何處理？— **已決：全部疊乘（見可行性分析）**

---

## 六、類別 5：移動類

為每一種地形各做一個 Buff，效果是「進入該地形時移動消耗降為 1」。

| Buff 名稱 | 欄位 | 效果 | 可掛載來源 |
|---|---|---|---|
| 草行 | `terrainCostOverrides: { plain: 1 }` | 草地消耗降為 1（原 2） | 道具、功法 |
| 林行 | `terrainCostOverrides: { forest: 1 }` | 森林消耗降為 1（原 4） | 道具、功法 |
| 水行 | `terrainCostOverrides: { water: 1 }` | 水域消耗降為 1（原 6） | 道具、功法 |
| 山行 | `terrainCostOverrides: { mountain: 1 }` | 山嶽消耗降為 1（原 5） | 道具、功法 |
| 沙行 | `terrainCostOverrides: { desert: 1 }` | 荒漠消耗降為 1（原 3） | 道具、功法 |
| 破壁 | `terrainCostOverrides: { wall: 1 }` | 牆壁消耗降為 1（原 ∞，變可通行） | 功法 |
| 坦途 | `terrainCostOverrides: { road: 1 }` | 道路消耗降為 1（原即 1，保留完整性） | 道具 |

### 可行性分析（移動類 / 類別 5，2026-08-16 實作）

經核對 `src/game/rules/playerDerivedRules.ts` 的 `getTerrainStaminaCost`（第 152 行），**移動類 Buff 已實作完成，風險低**。

**關鍵事實**：現有 `getTerrainStaminaCost` 支援兩種機制——`terrainCostOverride`（疾行：全域 → 2，硬編碼）與 `terrainStaminaCostMultipliers`（原水行適性：water ×0.5，已移除）。但兩者都無法處理 `wall`（消耗 ∞）：乘算 `1/∞` 會得到 NaN，全域 override 則無法只針對單一地形。

**實作方式**：新增 `terrainCostOverrides?: Partial<Record<TerrainType, number>>` 欄位，在 `getTerrainStaminaCost` 中對該地形**直接回傳覆寫值**，優先於基礎消耗與乘算。這讓 wall 也能被「破壁」成 1（變可通行），且與疾行的全域 override 不衝突（疾行仍優先於逐地形覆寫，因為它在函式開頭硬編碼 return 2）。

**已完成的程式碼變更：**

| 步驟 | 檔案 | 內容 |
|---|---|---|
| 1 | `src/game/catalogs/buffCatalog.ts` 的 `BuffDefinition` | 加 `terrainCostOverrides?: Partial<Record<TerrainType, number>>` 欄位 |
| 2 | `src/game/rules/playerDerivedRules.ts` | 在 `getTerrainStaminaCost` 中，疾行判斷之後、乘算之前，加 `terrainCostOverrides` 逐地形覆寫邏輯 |
| 3 | `src/game/catalogs/buffCatalog.ts` | 加草行、林行、水行、山行、沙行、破壁、坦途七個定義（皆 `rounds` / 2 回合） |

**與現有機制的互動：**
- **疾行（全域 override）**：仍優先於逐地形覆寫（函式開頭硬編碼 return 2）。若同時持有疾行與草行，進入草地消耗為 2（疾行勝出）。
- **水行（water → 1）**：取代原水行適性（water ×0.5，已移除），逐地形覆寫優先，進入水域消耗為 1。
- **wall 破壁**：原 ∞ 不可通行，破壁將其降為 1，使玩家可進入牆壁格（需上層移動邏輯允許；若移動邏輯另有 `terrain === 'wall'` 硬阻擋，需另行確認是否開放）。

**風險**：低。純加法欄位、不動回合順序、不動傷害公式。唯一需留意的是 wall 破壁後「是否真的可移動」取決於移動邏輯是否另有硬阻擋（建議後續確認 `worldGeneration.ts` / 移動相關邏輯）。

---

## 八、實作狀態

| 類別 | 狀態 | 說明 |
|---|---|---|
| 類別 1（資源轉換） | ✅ 已實作 | 嗜血、鐵壁訣、回春訣、化氣訣、汲元、破軍訣、罡氣訣 |
| 類別 4（條件型） | ✅ 已實作 | 背水、養氣、孤注 |
| 類別 5（移動類） | ✅ 已實作 | 草行、林行、水行、山行、沙行、破壁、坦途 |

**實作摘要（2026-08-16）：**

- `buffCatalog.ts`：`BuffDefinition` 新增 `category`、`lifestealPercent`、`innerPowerLeechPercent`、`damageReductionPercent`、`healthRegenPercent`、`innerPowerHealthRegenPercent`、`damageDealtPercent`、`externalSkillDamagePercent`、`conditional` 欄位；新增 `BuffCategory`、`BuffConditional` 型別；新增 10 個 Buff 定義。
- `playerDerivedRules.ts`：新增 `getLifestealPercent`、`getInnerPowerLeechPercent`、`getDamageReductionPercent`、`getDamageDealtPercent`、`getExternalSkillDamagePercent` 輔助函式；`getEffectiveAttributesForPlayer` 加條件型血量判斷（與 `attributeMultiplier` 疊乘）。
- `playerRules.ts`：`applyPeriodicBuffDamage` 加週期回復（回春訣 / 化氣訣）。
- `combatActions.ts`：外功傷害套用罡氣訣；攻擊者寫回時套用嗜血 / 汲元。
- `previewOrchestration.ts`：普攻預覽傷害套用破軍訣。
- `creatureActions.ts`：怪物普攻套用破軍訣；玩家受傷套用鐵壁訣（方案 A）；怪物造成傷害套用嗜血。

**驗證：** tsc 無錯誤；421 測試全過（新增 12 個 Buff 測試）。

---

## 七、江湖外功功法掛載（2026-08-16 實作）

為每個 Buff 創作一個「江湖外功功法」來掛載。所謂江湖門派，就是**沒有門派**——這些功法由散修武者於江湖中流傳，不隸屬任何武館流派（無 `schoolId`），因此可在任何武館學習、也可自掉落取得。

**掛載機制**：功能型外功（`target: 'self'`）透過 `functionalEffect` → `FUNCTIONAL_BUFF_BY_EFFECT` 對應到 Buff ID，施放時對自身施加 Buff。

**新增檔案**：`src/game/catalogs/jianghuExternalSkillCatalog.ts` — 17 個江湖外功。

| 江湖功法 | 對應 Buff | functionalEffect |
|---|---|---|
| 血飲功 | 嗜血 | `lifesteal` |
| 鐵壁功 | 鐵壁訣 | `damage-reduction` |
| 回春功 | 回春訣 | `health-regen` |
| 化氣功 | 化氣訣 | `inner-power-health-regen` |
| 汲元功 | 汲元 | `inner-power-leech` |
| 破軍功 | 破軍訣 | `damage-dealt` |
| 罡氣功 | 罡氣訣 | `external-skill-damage` |
| 背水功 | 背水 | `back-to-water` |
| 養氣功 | 養氣 | `nurture-qi` |
| 孤注功 | 孤注 | `all-in` |
| 草上飛 | 草行 | `plain-step` |
| 林間步 | 林行 | `forest-step` |
| 踏水功 | 水行 | `water-step` |
| 登山功 | 山行 | `mountain-step` |
| 踏沙功 | 沙行 | `desert-step` |
| 破壁功 | 破壁 | `wall-step` |
| 坦途功 | 坦途 | `road-step` |

**程式碼變更：**

| 檔案 | 內容 |
|---|---|
| `skillProgressionCatalog.ts` | `FunctionalExternalSkillEffect` 擴充 17 個效果；`functionalExternalSkillDescriptions` 補對應說明 |
| `jianghuExternalSkillCatalog.ts` | 新增 17 個江湖外功（皆 `target: 'self'`、`requiredHallLevel: 3`、無 `schoolId`） |
| `martialHallSkillCatalog.ts` | `allExternalSkillCatalog` 加入江湖功法；`getMartialHallSkills` 任何武館皆含江湖功法 |
| `combatActions.ts` | `FUNCTIONAL_BUFF_BY_EFFECT` 補 17 個效果 → Buff ID 對應 |

**怪物掉落池整合（2026-08-16）：** 江湖外功**已自動進入怪物掉落池**——`createLootForPlayer`（`lootFactory.ts`）使用 `allExternalSkillCatalog`，本就含江湖功法，無需額外改動。但因江湖功法 `requiredHallLevel: 3`，只有擊殺等級 ≥ 3 的怪物才有機率掉落；且 `!player.externalSkillIds.includes(skill.id)` 過濾已學功法。新增測試驗證高階怪物可掉落。**驗證：426 測試全過（新增 1 個掉落測試）。**

---

## 九、逐項決策追蹤

| 項目 | 狀態 | 決策結果 |
|---|---|---|
| 1-A 護盾欄位 | 已作廢 | 鐵壁訣改為減傷（`damageReductionPercent`），本類別不再涉及護盾 |
| 1-B 吸血適用範圍 | 已決策 | 天然不對燃燒/反震生效，無需排除（見四、可行性分析） |
| 1-C 護盾穿透 | 已作廢 | 隨 1-A 作廢 |
| 1-D 減傷與反震互動 | 已決策 | 方案 A（減傷只影響玩家損血，反震仍基於原傷害），已實作 |
| 4-A 乘算疊加 | 已決策 | 與 `attributeMultiplier` 疊乘（見五、可行性分析） |
| 4-B 條件判定時機 | 已決策 | 即時判定（`getEffectiveAttributesForPlayer` 每次傷害計算當下讀血量） |
| 4-C 多條件處理 | 已決策 | 全部疊乘（多個條件同時滿足逐一乘算） |
| 5-A 逐地形覆寫欄位 | 已決策 | 新增 `terrainCostOverrides`，優先於基礎消耗與乘算（見六、可行性分析） |
| 5-B wall 破壁 | 已決策 | 破壁將 wall 降為 1（變可通行），是否真可移動待確認上層邏輯 |
| 5-C road 冗餘 | 已決策 | 坦途仍保留（分類完整性） |
| 7-A 江湖功法掛載 | 已決策 | 每個 Buff 創作一個無門派江湖外功，任何武館可學、可掉落（見七） |
