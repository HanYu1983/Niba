# 創角系統設計（Character Creation System Design）

> ## ✅ 製作狀態：方向已定（Direction Locked）／準備實作
>
> 原「固定點數創角＋背景天賦」方案（§1–§11）已演進為 **「跨對局角色養成（卷系統）」**：角色以**名册形式持久存在**，每局結束依表現結算 **武學殘卷**，用於永久提升五維與設定初始功法。本文件以 **§12** 為現行定案設計，§1–§11 保留為舊方案參考（其固定點數分配與背景天賦暫不採用）。
>
> 已確認決策：(1) **角色名册可選**；(2) **卷依表現給多寡**；(3) **僅人類玩家選角**，AI 沿用 `createInitialPlayers` 預設生成。

## 12. 跨對局角色養成（卷系統）— 現行定案設計

> 本節取代原 §12 舊草稿，為當前定案。原「帳號級天賦樹」概念降為 §12.9 可選延伸，不與本系統衝突。

## 1. 文件目的

- 定義「俠客角色庫」系統：玩家可建立、保存與管理多個自有角色，並在每次開啟對局時選擇使用。
- 規格化創角三階段流程（基礎身份 → 五維屬性分配 → 起始背景／天賦）。
- 提供純函式規則、資料結構與 UI 元件架構，供後續實作與測試參考。
- 與既有系統對齊：五維屬性、五行門派、功法、`createCharacterState`、`allocateAttributePointAction`。

## 2. 設計支柱

- **持久性**：角色為跨對局存續的「俠客庫」實體，非每次開局重創。
- **選擇感**：點數分配、背景天賦影響角色定位，玩家感受到構築差異。
- **便利性**：固定點數分配為主，隨機洗點為輔（快速產生合理配置）。
- **多元性**：角色名與外觀、五維傾向、背景天賦組合出獨特俠客。

## 3. 定位與現況

| 面向 | 現況 | 創角後差異 |
|---|---|---|
| 五維屬性 | 玩家初始固定全 8（`createInitialPlayers`） | 玩家自訂分配 |
| 門派 | 不於創角選定，遊戲內由門派據點／武館學習 | 僅定「武學傾向」，進遊戲後再學 |
| 升級點數 | 每級 +2 點（`ATTRIBUTE_POINTS_PER_LEVEL`），已有 `allocateAttributePointAction` | 沿用 |
| 角色生成 | `createCharacterState` 集中管理屬性／血量／內力／功法 | 創角系統產出初始值注入其中 |

> 決策（已確認）：創角**不選定門派**，只定「武學傾向」；實際門派流程在遊戲內進行，符合現有門派學習系統。

## 4. 核心資料結構

### 4.1 角色庫（持久化）

```ts
export type CharacterProfile = {
  id: string
  name: string
  /** 外觀選擇（以 icon 或稱號代表；實際立繪留待美術資產）。 */
  portrait: string
  /** 稱號／身份（文字，影響部分對話稱謂）。 */
  title: string
  /** ✗ 不採用：起始背景（見 §5.3）。以下兩個欄位於卷系統中移除。 */
  backgroundId: string
  /** 選擇的天賦 ids（允許多個，見 §5.4、§6.3）。 */
  talentIds?: string[]
  /** 玩家自訂的起始五維（未含背景加成）。 */
  baseAttributes: PlayerAttributes
  /** ✗ 不採用：背景加成（見 §5.3）。卷系統不沿用。 */
  backgroundBonuses: {
    attributeModifiers: Partial<PlayerAttributes>
    startingInventory?: InventoryEntry[]
    startingInnerSkillId?: string
    startingExternalSkillId?: string
  }
  /** 建立時間（供列表排序）。 */
  createdAt: number
  /** 此角色已被使用進行過的對局次數（統計用）。 */
  gamesPlayed: number
}
```

### 4.2 儲存位置

- 角色庫為**本機持久化**，獨立於單局存檔。
- 建議存放於 `localStorage`（key：`wuheng-character-library`）或沿用專案既有存檔機制。
- 角色庫與對局存檔分離：角色是「模板」，對局存檔是「遊玩實例」。對局結束後角色的 `gamesPlayed` 增加，但五維不變（除非未來設計永久成長）。

## 5. 創角流程

### 5.1 Step 1：基礎身份

- 角色名稱（必填，防呆：非空、長度限制）。
- 外觀選擇（`portrait`）：以 icon／稱號呈現。待美術資產到位後可擴充立繪。
- 稱號（`title`）：玩家自訂或從預設清單挑選，影響部分對話／展示。

### 5.2 Step 2：五維屬性分配（總點數固定）

- 基準：五維各 **5**（共 25 點基礎）。
- 可分配點數池：**+15 點**。
- 分配後總和恆為 **40**。
- 單維上下限：**最小 1、最大 15**。
- 即時預覽衍生數值（依 `playerStatsRules`）：
  - 最大生命 = 根骨 × 3
  - 最大體力 = 0.5×身法 + 0.5×臂力
  - 最大內力 = 內息 × 3
  - 攻擊暴擊率（臂力×2）、回避率（身法）等既有派生。

**隨機洗點（reroll）**：
- 產生一組「總和 40、單維在 [1,15]」的隨機分配（可選加權表現「專精」）。
- 玩家不滿意可重擲；也可手動微調。

> 純函式：`allocateCharacterAttributes(base, pool, preferred?) -> { attributes, remaining }`。
> 洗點純函式：`rollCharacterAttributes(rng) -> PlayerAttributes`（總和 40 且守界）。

### 5.3 Step 3：起始背景／天賦

> **✗ 不採用：起始背景取消（決策）**。背景為舊方案的「固定點數創角」一環，與現行定案 §12 卷系統（名稱＋外觀＋養成，無背景）衝突，**不實作**。以下保留僅供參考，勿在卷系統中沿用。

以下是候選背景清單（數值可再平衡，此處僅示意）。每個背景在創角時鎖定，不於遊戲內變更。

| 背景 id | 名稱 | 屬性加成 | 起始資源／功法 |
|---|---|---|---|
| `noble` | 名門弟子 | 悟性 +2、臂力 +1 | 起始悟性功法悟道 |
| `wanderer` | 江湖散人 | 身法 +2 | 隨機一件裝備 |
| `hunter` | 山野獵戶 | 臂力 +2、根骨 +1 | 絆馬索 ×1 |
| `merchant` | 商賈之子 | 內息 +2 | 起始資金 +50 |
| `prodigy` | 天賦異稟 | 每維 +1 | 可額外學習一次功法 |
| `ascetic` | 苦行僧侶 | 根骨 +3 | 喘息藥 ×2 |

> 設計原則：背景天賦提供「傾向」但不失衡，實際強度需配合對局平衡調整。

## 5.4 天賦玩法設計（玩法導向）

> 核心主張：天賦不應只影響「初始數值／道具」，而應**改寫玩法節奏**，讓不同天賦角色以不同方式與既有機制互動。以下提案分級呈現，供逐項權衡。實作時需先確認每個天賦的掛鉤點（hook）對應到既有系統，見 §6.3。

### A. 節奏型（改寫資源經濟）

| 天賦 id | 名稱 | 玩法改寫 | 掛鉤機制 | 潛在風險 |
|---|---|---|---|---|
| `qi-master` | 氣功大師 | 內力上限 +10%、體力上限 -10% | 上限計算 | 資源失衡 |

### B. 地圖／探索型（改寫移動與視野）

| 天賦 id | 名稱 | 玩法改寫 | 掛鉤機制 | 潛在風險 |
|---|---|---|---|---|
| `cartographer` | 大地圖客 | 視野 +1 | 視野 | 前期劣勢 |
| `scavenger` | 拾荒者 | 採集資源點時采集量+10% | 採集結算 | 建料溢流 |
| `alchemist` | 鍊金師 | 採集／撿取建料時有15%機率獲得等量金錢 | 採集／拾取結算 | 金錢通膨 |

### C. 戰鬥型（改寫戰鬥規則）

| 天賦 id | 名稱 | 玩法改寫 | 掛鉤機制 | 潛在風險 |
|---|---|---|---|---|
| `chain-hand` | 連環手 | 普通攻擊體力消耗-1, 建設所有建築體力消耗+1 | 攻擊後動作 | 連鎖失衡 |
| `phantom-dodge` | 鬼魅身法 | 回避率提升8%、暴擊率下降5% | 回避／暴擊結算 | 攻勢疲弱 |

### D. 顛覆型（改寫規則本身）

| 天賦 id | 名稱 | 玩法改寫 | 掛鉤機制 | 潛在風險 |
|---|---|---|---|---|
| `smith` | 冶匠 | 可多穿一個配件槽 | 裝備槽位 | 屬性通膨 |
| `merchant-king` | 商人王 | 買價 -10%／賣價 +20%，普通攻擊傷害 -10% | 商店結算 | 金錢向特化 |

### E. 成長型（改寫升級點數走向）

> 成長型天賦以「每次升級時 -1 某維、+1 另一維」改寫點數走向，讓角色隨等級自然偏向特定構築。以下五個天賦各主修一維、犧牲另一維，形成互補的成長型天賦組（對應五維：臂力／根骨／身法／內息／悟性）。
>
> **⚠️ 不影響原本升級屬性點**：此機制為「升級時額外附加的轉換」，**不消耗、不取代**升級原本給的屬性點（每級 +2 點，見 §3）。原本的 +2 點仍照常由玩家自由分配，此天賦是在其之上**額外**進行 -1/+1 的轉換。

| 天賦 id | 名稱 | 玩法改寫 | 掛鉤機制 | 潛在風險 |
|---|---|---|---|---|
| `nimble-body` | 身法輕靈 | 每次升級時 -1 臂力、+1 身法 | 升級點數分配（`level-up-attribute`） | 屬性失衡／點數走向被鎖死 |
| `divine-strength` | 天生神力 | 每次升級時 -1 身法、+1 臂力 | 升級點數分配（`level-up-attribute`） | 屬性失衡／點數走向被鎖死 |
| `iron-body` | 銅皮鐵骨 | 每次升級時 -1 身法、+1 根骨 | 升級點數分配（`level-up-attribute`） | 屬性失衡／點數走向被鎖死 |
| `deep-breath` | 氣沉丹田 | 每次升級時 -1 臂力、+1 內息 | 升級點數分配（`level-up-attribute`） | 屬性失衡／點數走向被鎖死 |
| `keen-mind` | 慧根通明 | 每次升級時 -1 根骨、+1 悟性 | 升級點數分配（`level-up-attribute`） | 屬性失衡／點數走向被鎖死 |

> 範例：`nimble-body` 屬 `hook` 原語，`hookPoint: 'level-up-attribute'`，`payload: { from: 'armStrength', to: 'agility', amount: 1 }`。其餘四個同屬此 hookPoint，僅 `payload` 的 `from`/`to` 不同。示範「在既有 `hook` 原語內新增 hookPoint 值」即可擴充，無須新增原語種類（見 §6.3）。

> 原則：天賦應「提供風格偏移」，而非「純數值碾壓」。待逐項權衡後，決定採用子集與數值平衡。

## 6. 資料流與規則層

```
創角 UI（React）
  → 角色建構資料（CharacterDraft）
  → characterRules.createCharacter(draft)    // 純函式：驗證＋算出最終五維與衍生值
  → 角色庫 store（新增／保存角色）
  → 對局開始：選擇角色 → createCharacterState(角色資料) 建立玩家
```

### 6.1 純函式模組建議（`game/rules/characterCreationRules.ts`）

- `createCharacterDraft() -> CharacterDraft`：初始空白草稿。
- `validateCharacterDraft(draft) -> { ok; reason? }`：名稱、點數總和、單維界線。
- `allocateAttributePoints(draft, attribute, delta) -> CharacterDraft`：增減點數並守界與總和。
- `rollCharacterAttributes(rng) -> PlayerAttributes`：洗點。
- `createCharacter(draft, background) -> CharacterProfile`：鎖定角色。（✗ 背景不採用，卷系統為 `createCharacter(draft)`）
- `applyBackgroundToProfile(profile) -> { baseAttributes, bonuses }`：套用背景。（✗ 不採用）

### 6.2 與 `createCharacterState` 的接合

- 對局開始時，將 `CharacterProfile.baseAttributes`（含背景加成）作為 `baseAttributes` 傳入 `createCharacterState`。
- 既有 `attributes / health / maxHealth / stamina / innerPower` 皆由 `createCharacterState` 自動衍生，無需重算。

### 6.3 天賦資料結構與掛鉤（hook）

- `CharacterProfile` 需新增 `talentIds`（可選多個天賦，見 §5.4、§6.3）。
- 天賦定義建議為獨立 catalog：`catalogs/talentCatalog.ts`，每個天賦宣告其影響的類型與掛鉤，供規則層查詢。

## 6.3 天賦抽象流程（三類原語 + 新增規則）

> 已確認：天賦採「**先定規則、再擴充**」方案。天賦效果必須能分解為下列**三類原語**，所有新增天賦皆須遵守 §6.4 的 R1–R4 規則。禁止建立「萬能上帝型 union」——天賦差異過大，統一的 kind 清單反而比不抽象更難擴展。

```ts
// catalogs/talentCatalog.ts
export type TalentEffect =
  | { kind: 'passive-buff'; definitionId: string }            // ① 被動 buff：直接複用 BuffDefinition
  | { kind: 'resource-limit'; resource: ResourceLimit; multiplier: number } // ② 上限修正
  | { kind: 'hook'; hookPoint: TalentHookPoint; payload: unknown }          // ③ 鉤子型

export type TalentHookPoint =
  | 'gather-convert'        // 採集／拾取結算追加（鍊金師）
  | 'equipment-slot'        // 裝備槽位（冶匠）
  | 'action-stamina'        // 行動體力消耗（連環手）
  | 'level-up-attribute'    // 升級點數改寫（身法輕靈：-1臂力 +1身法）

export type TalentDefinition = {
  id: string
  name: string
  effects: TalentEffect[]   // 有序清單，每項歸屬上述三類原語之一
}
```

> **📌 實作現況（dev-log）**：`TalentEffect` 的 `passive-buff` 欄位實作時命名為 `buffId`（非 `definitionId`）；`TalentDefinition` 另增 `available: boolean` 標記效果是否已在 runtime 生效（resource-limit / hook 尚未接入時標 `false` 不開放選用）。以上為資料結構實作時的微調，不改變「三類原語」抽象本意。

### 三類原語的對應機制

| 原語 | 實作基座（已存在） | 說明 |
|---|---|---|
| ① `passive-buff` | `buffCatalog` 的 `BuffDefinition` + `playerDerivedRules.sumBuffPercent` | 天賦 = 一個「永遠啟用的被動 buff」。數值型一律走 buff field |
| ② `resource-limit` | `playerStatsRules` 收斂的 `getResourceLimit` | 影響血量／體力／內力上限，走單一入口 |
| ③ `hook` | 各規則／action 的掛鉤點 | 需改寫流程的天賦（採集轉換、槽位、行動消耗） |

> **📌 實作進度**：① 已上線（4 個天賦：製圖師／拾荒者／幻影步／商賈巨擘）；② 已上線（`qi-master` 內息調度，採 `max{Health,Stamina,InnerPower}Multiplier` buff 欄位表達，統一走 `getPlayerResourceLimit`）；③ **尚未實作**（`alchemist` / `chain-hand` / `smith` 需先建立鉤子點入口）。

### 保留的 8 個天賦 → 原語歸屬與掛鉤

| 天賦 | 原語 | 掛鉤點 | 備註 |
|---|---|---|---|
| `qi-master` | ② resource-limit | — | 內力 ×1.1、體力 ×0.9 |
| `cartographer` | ① passive-buff | — | 映射 `visionRadiusBonus` |
| `scavenger` | ① passive-buff | — | 映射 `gatherDoubleYieldChance` |
| `alchemist` | ③ hook | `gather-convert` | 需新欄位／新 hook，15% 機率等量金錢 |
| `chain-hand` | ③ hook | `action-stamina` | 普攻 −1、建設 +1 |
| `phantom-dodge` | ① passive-buff | — | 映射 `evasionRateBonus` / `criticalRateBonus` |
| `smith` | ③ hook | `equipment-slot` | 多穿一個配件槽 |
| `merchant-king` | ① passive-buff | — | 買價／賣價／普攻傷害全走既有欄位 |

> **📌 已實作天賦（catalog 現況）**：`cartographer`（視野半徑 +1）、`scavenger`（採集 25% 雙倍）、`phantom-dodge`（回避 +6%、暴擊 **-3%** — 原設計 +6% 因過強下修）、`merchant-king`（買 -20%、賣 +20%、普攻 +10%）、`qi-master`（內力 ×1.1、體力 ×0.9，以 `talent-qi-master` buff 表達）。`alchemist` / `chain-hand` / `smith` 尚未加入。

> **前 5 個原語「① 被動 buff」今天即可上線**：R1 到 R3 的抽象都是現成的（`BuffDefinition` + `sumBuffPercent`）。只有 `alchemist` / `smith` / `chain-hand` 三個鉤子型天賦各需新增一個原語入口，而非新增一個「天賦框架」。

### 上限修正收斂（原 ⚠️ 提示，保留）

`resource-limit` 原語必須經**單一純函式**入口，不可在各呼叫點硬寫：

```ts
// 集中於 rules/playerStatsRules（即 getMaxHealth / getMaxStamina / getMaxInnerPower 處）：
export type ResourceLimit = 'health' | 'stamina' | 'innerPower'
export function getResourceLimit(
  attributes: PlayerAttributes,
  resource: ResourceLimit,
  modifiers: ResourceLimitModifiers,   // 由 getActiveTalent(player) 彙整
): number
```

每個 `resource-limit` 天賦在 `talentCatalog` 宣告其 `resource + multiplier`，由 `getActiveTalent` 統一彙整後傳入 `getResourceLimit`。新增同類天賦只需在 catalog 加一條，無須改動各呼叫點。

> **📌 實際收斂（已實作，分兩層）**：
> - **層1 純函式核心** `getResourceLimit(attributes, resource, modifiers?)`（`playerStatsRules.ts`）：`baseLimit × multiplier + bonus`；三個既有 getter `getMaxHealth/getMaxStamina/getMaxInnerPower` 內部改呼叫核心，白箱相容。
> - **層2 buff 橋接** `getPlayerResourceLimit(player, resource)`（`playerDerivedRules.ts`）：以 effective 五維為 base，疊乘生效 buff 的 `max{Health,Stamina,InnerPower}Multiplier`，加總 `maxStaminaBonus`。
> - 所有 max* 重算點（`characterFactory` / `playerRules` / `equipmentRules` / `itemActions` / `gameStore`）已改走層2，**一併修正了原先 4 處 `maxStaminaBonus` 遺漏**。
> - **resource-limit 天賦以 buff 表達**（非 effect kind）：`qi-master` 在 `buffCatalog` 定義 `maxInnerPowerMultiplier: 1.1, maxStaminaMultiplier: 0.9`，經 buff 管線自動生效；`getResourceLimitModifiers` 彙整函式保留供直接用 resource-limit effect 的未來擴充。

### 6.3.1 resource-limit 型天賦提案（走既有抽象，尚未實作）

> **設計說明**：以下三項天賦與 `qi-master` 同源（資源上限修正），但刻意簡化為**單一增益、無取捨**的直觀效果，降低玩家理解與選擇成本。均以既有 `buff field` 表達，開局注入後經 `getPlayerResourceLimit` 自動生效；**新增每條只需在 `buffCatalog`（buff 定義）＋ `talentCatalog`（天賦條目）各加一行，無需改動任何規則／呼叫點**。

| 天賦 id | 名稱 | 效果 | 對應 buff field |
|---|---|---|---|
| `vital-body` | 金剛體魄 | 最大血量 +10% | `maxHealthMultiplier: 1.1` |
| `deep-dantian` | 丹田凝息 | 最大內力 +10% | `maxInnerPowerMultiplier: 1.1` |
| `sturdy-legs` | 力士雙足 | 最大體力 +2 | `maxStaminaBonus: 2` |

> **catalog 條目示意**（待採用時才需填入 `buffCatalog`／`talentCatalog`）：
> ```ts
> // buffCatalog.ts
> { id: 'talent-vital-body', name: '天賦·金剛體魄', description: '最大血量 +10%。', duration: 'persistent', category: 'buff', maxHealthMultiplier: 1.1 },
> { id: 'talent-deep-dantian', name: '天賦·丹田凝息', description: '最大內力 +10%。', duration: 'persistent', category: 'buff', maxInnerPowerMultiplier: 1.1 },
> { id: 'talent-sturdy-legs', name: '天賦·力士雙足', description: '最大體力 +2。', duration: 'persistent', category: 'buff', maxStaminaBonus: 2 },
> // talentCatalog.ts（with available: true）
> { id: 'vital-body', name: '金剛體魄', description: '最大血量 +10%。', available: true, effects: [{ kind: 'passive-buff', buffId: 'talent-vital-body' }] },
> { id: 'deep-dantian', name: '丹田凝息', description: '最大內力 +10%。', available: true, effects: [{ kind: 'passive-buff', buffId: 'talent-deep-dantian' }] },
> { id: 'sturdy-legs', name: '力士雙足', description: '最大體力 +2。', available: true, effects: [{ kind: 'passive-buff', buffId: 'talent-sturdy-legs' }] },
> ```

- ~~既有 `backgroundBonuses.attributeModifiers` 只能表達「起始數值」…~~（✗ 背景不採用；卷系統僅保留天賦概念於 §12.9，§5.4 純屬參考）
  - 天賦（`talentIds`）：玩法改寫（§5.4，參考用）。
  - 舊方案主張「背景＋天賦並存」；卷系統已取消背景，此段不再成立。

### 6.4 新增天賦必須遵守的規則（contract）

> **R1** 每個天賦只能由三類原語組成（`passive-buff` / `resource-limit` / `hook`），禁止「無分類」的特例分支。
> **R2** 數值型一律走 buff field；缺欄位時**擴充 `BuffDefinition`**，而不是在天賦裡寫 `if (talentIds.includes('xxx'))`。
> **R5** 多個天賦的加入需考量**搭配平衡**（synergy／counter），避免無腦堆疊所有賺錢型或全輸出型天賦；具體限制方式（可選同類上限、成本遞增）待平衡測試時定。
> **R3** 上限修正一律走 `getResourceLimit` 單一入口，禁止在 `getMaxHealth/getMaxStamina/getMaxInnerPower` 呼叫點再各寫一份邏輯。
> **R4** 鉤子型天賦必須宣告 `hookPoint`，且該 hook 函式**透過參數注入 modifiers**、天賦本身不做判斷——新增同類天賦只需加 catalog 條目。

> **📌 實作遵循確認（dev-log）**：目前實作嚴格遵守 R1–R4。R2 落地為「把 `maxHealthMultiplier/maxStaminaMultiplier/maxInnerPowerMultiplier` 擴充進 `BuffDefinition`（含 `BuffInstance` override 與 `playerDerivedRules.getEffectiveBuffDefinition` 白名單同步更新）」，而非在天賦規則層寫條件分支。R3 落地為分層收斂 `getResourceLimit` / `getPlayerResourceLimit`。天賦解鎖／開啟另有經濟約束（花卷解鎖 `unlockTalent`、開啟免費 `setCharacterTalent`，未解鎖不可開啟），呼應 R5 的成本遞增構想。

## 7. UI 架構

### 7.1 頁面／元件

- `CharacterLibraryScreen`：角色庫列表（新建、選用、刪除、改名、查看）。
- `CharacterCreationModal`／`CharacterCreationScreen`：三階段創角 wizard。
- 元件拆分：
  - `CharacterIdentityStep`（名稱／外觀／稱號）
  - `AttributeDistributionStep`（點數分配 + 洗點 + 衍生值預覽）
  - ~~`BackgroundSelectionStep`（背景選擇 + 預覽）~~（✗ 背景不採用，此元件移除）
- `createCharacterState` 於「確認創角」時產出可預覽的角色數據。

### 7.2 進入點

- 主選單（`GameStartScreen` 群組）新增「俠客庫」入口。
- 開始對局流程中，選擇「使用哪位俠客」或「新建俠客」。

## 8. 平衡與風險

| 風險 | 影響 | 建議 |
|---|---|---|
| 屬性分配過度專精導致前期過強／過弱 | 中 | 單維上限 15、點數池固定，並由對局平衡對齊 |
| 背景加成破壞平衡 | 中 | 加成幅度小、屬性型不拘一格；配合對局平衡測試 |
| 天賦玩法改寫造成特定流派霸權 | 高 | 每項天賦掛鉤需配合對局平衡測試，採「風格偏移」而非「數值碾壓」 |
| 天賦與既有規則掛鉤點衝突 | 高 | 逐天賦建立 hook，純函式測試確保作用範圍收斂 |
| 角色庫存檔相容性 | 中 | 版本欄位、缺省值處理 |
| UI 複雜度 | 低 | 三階段 wizard 控管流程 |

## 9. 實作優先級（Phase 拆解）

- **Phase A**：角色庫資料結構 + 本機存檔 + 角色列表（新建／選用／刪除）。
- **Phase B**：五維分配 UI（含洗點）＋衍生值預覽。
- ~~**Phase C**：背景定義與鎖定（數值向）。~~（✗ 背景不採用，此 Phase 取消）
- **Phase C'**：天賦定義與掛鉤（玩法向；逐天賦權衡後分批接入）。
- **Phase D**：對局開始流程整合（選擇角色 → `createCharacterState`）。
- **Phase E**：改名、外觀 icon、稱號、統計（gamesPlayed）與測試補全。

## 10. 影響檔案預覽

- 新增：`game/types.ts`（CharacterProfile、TalentEffectKind）、`game/rules/characterCreationRules.ts`、`catalogs/characterBackgroundCatalog.ts`、`catalogs/talentCatalog.ts`、UI 元件、測試。
- 修改：`game/characterFactory`（若有需要）、`GameStartScreen`、`gameStore`（角色庫存取）、各天賦掛鉤的既有 rule/action 檔案。

## 11. 驗證

- 純函式單元測試：點數總和、守界、洗點、背景套用、衍生值。
- 角色庫存檔 round-trip 測試。
- Build / lint 通過。

## 12. 跨對局角色養成（卷系統）— 現行定案設計

### 12.1 核心概念

```
角色 = 跨對局持久實體（名册），人類玩家開局前選用
每場對局結束（無論勝敗）
  → 依 runStats 結算「武學殘卷」(scrolls)
  → 卷為單一貨幣，用於：
      ① 永久五維加成（疊加進 baseAttributes）
      ② 設定初始功法（從「功法庫」選，開局即攜帶）
```

- **培育對象是「單一角色」而非帳號**：每名人類玩家擁有獨立名册，各自累積自己的卷與功法庫。
- **僅人類玩家選角**：AI 仍走 `createInitialPlayers` 預設生成（五維全 8、僅 `吐納功`、無外功），不佔用名册、不可被培養。
- 既有的 `PlayerState.baseAttributes` 欄位（`types.ts:167`）目前未被使用，正好作為永久加成的注入點，無須大改結構。

### 12.2 與舊方案（§1–§11）的差異

| 面向 | 舊方案（固定點數創角） | 新定案（卷系統） |
|---|---|---|
| 創角內容 | 名稱＋五維分配（25+20 點）＋背景＋天賦 | 名稱＋外觀／稱號（輕量）；強度全靠養成 |
| 五維來源 | 創角時一次分配固定 | 每局結束用卷永久提升，成本遞增 |
| 功法來源 | 背景給 1 個起始功法 | 功法庫跨局累積；卷設定開局攜帶 |
| 平衡風險 | §8 所列「分配過度專精／背景破壞平衡」 | 養成為漸進、可控，天然規避一次性分配失衡 |
| 天賦玩法改寫 | §5.4 全套（高掛鉤風險） | 採多天賦（`talentIds`，見 §6.3）；具體天賦子集與平衡待定 |

### 12.3 資料結構

> **與舊 `CharacterProfile`（§4.1）的關係**：`PersistentCharacter` 為現行定案，**取代**舊 `CharacterProfile`。兩者描述同一「跨局角色」實體，重疊的身份欄位（`id`/`name`/`portrait`/`title`/`createdAt`/`gamesPlayed`）與天賦欄位（`talentIds`）沿用；養成欄位（`scrolls`/`attributeBonuses`/`learnedSkillIds`/`initialExternalSkillIds`/`initialInternalSkillId`）取代舊的創角欄位（`baseAttributes`/`backgroundId`/`backgroundBonuses`）。§4.1 僅保留作舊方案參考。

```ts
// 新增：src/game/catalogs（或 storage）— PersistentCharacter
export type PersistentCharacter = {
  id: string
  name: string
  /** 外觀 icon／稱號（輕量，不影響數值）。 */
  portrait?: string
  title?: string
  /** 選擇的天賦 ids（允許多個，見 §5.4、§6.3）。 */
  talentIds?: string[]
  /** 累積武學殘卷（單一貨幣）。 */
  scrolls: number
  /** 永久五維加成，開局疊加進 createCharacterState 的 baseAttributes。 */
  attributeBonuses: PlayerAttributes   // 預設全 0
  /** 功法庫：跨局累積「曾學過」的技能 id（內功＋外功）。 */
  learnedSkillIds: string[]
  /** 用卷設為開局攜帶的外功（限 learnedSkillIds 內）。 */
  initialExternalSkillIds: string[]
  /** 開局內功（預設 'tuna-gong'，可改為庫內其他內功）。 */
  initialInternalSkillId: string
  /** 養成統計。 */
  gamesPlayed: number
  createdAt: number
}
```

- 存檔位置：`localStorage`（key 建議 `mygame2.character-roster`），**獨立於單局存檔**（`gameSave.ts`）。與 `campaignClearance.ts` 同模式。
- 角色是「模板」，對局是「遊玩實例」；卷與功法庫在局末回寫，五維加成與初始功法在開局讀取。

### 12.4 卷獲取公式（依表現，起點值待調）

局末由該人類玩家所屬 `RunStats` 結算：

| 來源 | 卷數 | 依據 |
|---|---|---|
| 完局基礎 | 勝利 +20 / 敗退 +8 | 對局勝負狀態 |
| 等級 | 每級 +3 | `runStats.maxLevelReached` |
| 擊殺妖獸 | 普通 +2、首領 +10 | 擊殺統計 |
| 新功法入庫 | 每種首次 +5 | 將本局 `learnedSkillIds` 併入角色功法庫，去重計新增 |

> 一局預估 30–120 卷。公式集中於純函式 `computeScrollReward(runStats, won)` 便於平衡調整與測試。

### 12.5 卷花費（成本遞增，起點值待調）

- **五維永久加成**：每點成本 `10 + 5 × 已投點數`（第 1 點 10、第 2 點 15、第 3 點 20…），避免後期無腦堆滿。
  - 花費時 `attributeBonuses[dim] += 1`、`scrolls -= cost`。
- **初始功法解鎖**：每個 30 卷；上限 **外功 2 個、內功 1 個**，且只能從 `learnedSkillIds` 選（未學過不可設）。
  - 設定即寫入 `initialExternalSkillIds` / `initialInternalSkillId`。

### 12.6 功法庫機制（養成循環核心）

```
打一局 → 在武館／門派據點／探索事件學到新功法
      → 局末併入該角色 learnedSkillIds（跨局累積、去重）
      → 之後用卷把庫中功法設為初始功法
      → 下一局開局即攜帶 → 越玩可選構築越豐富
```

- 這形成「學到 → 設為初始 → 更強開局」的正迴圈，且只能從自己打過的東西挑選，避免直接給頂級強技能破壞平衡。
- 與既有學功路徑（武館 `learnSkillAtMartialHall`、門派 `learnSkillAtSectGate`、事件 `learn-skill`）完全相容，只需在局末把 `player.externalSkillIds / innerSkillIds` 回寫角色功法庫。

### 12.7 開局注入（與 `createCharacterState` 接合）

對局開始時，若人類玩家選用了 `PersistentCharacter`：

```
createCharacterState({
  ...,
  baseAttributes: { 臂力:8, 根骨:8, 身法:8, 內息:8, 悟性:8 } ＋ character.attributeBonuses,
  innerSkillId: character.initialInternalSkillId,
  innerSkillIds: [character.initialInternalSkillId],
  externalSkillIds: [...character.initialExternalSkillIds],
  equippedExternalSkillIds: [...character.initialExternalSkillIds],
})
```

- `createCharacterState` 已自動由 `baseAttributes` 衍生血量／體力／內力上限，**無須重算**。
- AI 玩家維持 `createInitialPlayers` 原樣（不讀名册）。

### 12.8 實作優先級與影響檔案

- **Phase A**：`PersistentCharacter` 資料結構 + `localStorage` 名册存取（新增 `characterRoster.ts`）。
- **Phase B**：`GameStartScreen` 改為「先選角色（或新建）→ 再選地圖」；AI 不經此流程。
- **Phase C**：局末結算 `computeScrollReward` 並回寫卷與功法庫。
- **Phase D**：培養介面（花卷：五維遞增成本＋初始功法設定，限功法庫）。
- **Phase E**：`createCharacterState` 開局注入；測試補全（純函式＋ round-trip）。

> 影響檔案：新增 `characterRoster.ts`、培養 UI；修改 `GameStartScreen`、`gameStore`（開局選角＋局末回寫）、`createCharacterState` 呼叫處。

### 12.9 可選延伸

**帳號級天賦樹（降級）**
原 §12 舊草稿的「帳號級天賦樹」不與本系統衝突，可作為**第二層 meta 進度**未來再議：
- 卷系統解決「角色強度養成」；天賦樹可解決「玩法風格偏移」（§5.4 的玩法改寫型天賦）。
- 若實作，建議掛在「帳號層」而非「角色層」，與卷系統並存。

**AI 玩家選用名册角色（待 AI 完善後）**
> 現行決策：AI 不走名册（§12.1，沿用 `createInitialPlayers` 預設生成）。此為**未來延伸**，不與現行設計衝突。
- **動機**：鼓勵玩家多培養角色。若 AI 可選用玩家名册庫中的角色，玩家會有更強動機「把角色練強」——因為練好的角色可能出現在對面，形成「我的養成有實際影響」的成就感與挑戰。
- **建議機制**：
  - 僅在 AI 系統完善、能「選用並妥善運用」特定角色構築後才實作（避免 AI 拿了玩家練的強角卻不會用，造成體驗落差）。
  - 觸發方式可為：AI 從名册庫「借用」角色（含 `attributeBonuses` 與初始功法），或在特定對局（如挑戰模式）直接指定。
  - 玩家名册角色被 AI 借用時**不消耗、不刪除**，僅為「讀取模板」建立對局實例。
- **風險**：玩家可能因此刻意不培養強角（反向動機）。需設計誘因權衡（例如借用角色對局勝利給原培養者額外卷，或提供「AI 對手也由名册生成」的專屬模式供玩家選擇）。

### 12.10 待決／可調項

- [x] 角色名册可選（決策已定）
- [x] 卷依表現給多寡（決策已定，公式見 §12.4）
- [x] 僅人類選角，AI 預設生成（決策已定）
- [ ] §12.4 / §12.5 的具體數值（卷數、成本曲線）需實測後微調
- [ ] 初始內功是否也開放用卷切換（本設計預設開放，上限 1）
- [ ] 角色刪除／改名／轉讓卷等管理功能範圍（Phase E 細究）
- [ ] 名册版本相容（`attributeBonuses` 欄位缺省處理）