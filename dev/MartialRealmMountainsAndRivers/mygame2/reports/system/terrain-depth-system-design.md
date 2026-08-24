# 地形深度系統設計文件（Terrain Depth System Design）

本文件詳細規劃地形系統優化方案，包含：
1. **方案 2：地形與五行／流派共鳴（流派主場）**
2. **方案 5：隨機事件與地形綁定（生態沈浸感）**
3. **方案 6：怪物地形親和（怪物生態與戰術差異）**
4. **方案 7：道具點地形化掉落池（地形物產差異化）**

---

## 一、設計目標與原則

### 1.1 設計目標
- **增強戰略維度**：讓玩家在地圖移動、戰鬥地點選擇、功法搭配時，將「地形」納入核心考量。
- **深化流派特色**：五行流派與對應地形產生共鳴，強化流派主題感。
- **豐富探索沈浸感**：事件與怪物依地形分布，形成合理的武俠世界生態。
- **低理解成本、高直覺性**：規則符合武俠五行與自然直覺（如木屬性親和森林、火屬性親和荒漠）。

### 1.2 既有架構相容原則
- **純加法／漸進式**：不破壞既有戰鬥結算、事件觸發、怪物 AI 邏輯。
- **資料驅動**：數值與對應關係抽離為 Catalog / Rules 常數，便於後續平衡調整。
- **純函式計算**：戰鬥倍率與屬性修正透過純函式推導，便於單元測試。

---

## 二、方案 2：地形與五行／流派共鳴（流派主場）

### 2.1 地形與五行對應關係

遊戲既有五行體系與流派定義如下：

| 五行屬性 | 流派（School） | 親和地形（Resonant Terrain） | 設計概念 |
| :--- | :--- | :--- | :--- |
| **金（Metal）** | 金剛流（`golden-body`） | **山嶽（mountain）** / 牆壁邊 | 崇山峻嶺藏金石，剛猛堅固 |
| **木（Wood）** | 追風流（`swift-wind`） | **森林（forest）** | 萬木蔥蘢，林間乘風起勢 |
| **水（Water）** | 寒水流（`frost-water`） | **水域（water）** | 江湖水澤，寒氣凝冰 |
| **火（Fire）** | 赤炎流（`scarlet-flame`） | **荒漠（desert）** | 烈日荒漠，炎陽燥熱助火威 |
| **土（Earth）** | 厚土流（`earth-mountain`） | **草地（plain）** | 沃野平原、大地厚德載物 |
| **無（None）** | 太虛流（`void-spirit`） | **所有地形（中庸均衡）** | 太虛無形，包容萬象 |

### 2.2 共鳴機制設計與架構實現

#### 2.2.1 機制實現架構：雙軌分工（純函式規則 + Buff 系統）
天地共鳴在系統架構上**不採用 OOP 物件導向的 `execute` 方法**，亦**不將單招共鳴強行包裝為全域 Buff**（避免身上同時裝備多屬性功法時產生跨屬性誤加成）。
系統採取明確分工的雙軌架構：

1. **功法天地共鳴（單招結算）→ 純函式規則（Pure Rules Function）**：
   - 比照現有的「五行相剋（`getElementDamageMultiplier`）」機制。
   - 於 `terrainCombatRules.ts` 中以純函式 `getTerrainResonanceDamageMultiplier(skillElement, standingTerrain)` 即時推導。
   - 單招精確判定：依「**該功法屬性 × 施法者當前站立格子地形**」計算倍率與內力減免，不產生狀態污染與副作用。
2. **角色／怪物主場體質（常駐環境增益）→ 動態 Buff 系統（Dynamic Buff）**：
   - 比照現有的「條件型 Buff」（如血量低於門檻時屬性增幅）。
   - 怪物/角色身處親和地形時，動態享有回避率、減傷率、反震等角色級屬性加成，UI 直接展示圖標與說明。

#### 2.2.2 傷害與效果加成（戰鬥中即時生效）
- **功法傷害加成**：
  - 施放與當前站立地形親和的功法（如在森林施展追風外功、在水域施展寒水外功）：
  - **外功最終傷害 × 1.25（+25%）**。
- **內力消耗減免**：
  - 在親和地形施放對應外功：
  - **內力消耗 -1**（最低為 1）。
- **特殊狀態效果增幅**：
  - 赤炎流在荒漠：燃燒傷害每回合多扣 5% 生命（20% → 25%）。
  - 寒水流在水域：寒毒降低五維幅度增加（20% → 30%）。
  - 金剛流在山嶽：暴擊率加成額外 +5%。
  - 厚土流在草地：觸發天地共鳴；山嶽不再觸發土屬性共鳴。
  - 追風流在森林：施放後回避率額外 +5%（持續 2 回合）。

#### 2.2.3 戰鬥預覽（Attack Preview / External Skill Preview）整合
- 在攻擊預覽與外功預覽視窗中新增：
  - `地形共鳴：森林·追風流（傷害 +25%，內力 -1）` 提示標籤與數值計算。

---

## 三、方案 5：隨機事件與地形綁定（生態沈浸感）

### 3.1 現狀與問題
目前探索事件分為兩種觸發途徑，皆未區分地形：
1. **地圖常駐探索點（Map Exploration Events）**：在地圖空白格均勻生成，未區分地形，導致在水域周邊遇到「山賊設伏」或在深山遇到「渡口商船」等語境違和。
2. **回合結束隨機觸發事件（Turn-End Pending Events）**：玩家結束回合時依 `explorationTriggerChance` 機率觸發，目前從全域 `explorationEventCatalog` 均勻隨機抽取，忽略了玩家此時**身處何種地形**。

### 3.2 地形事件分類與專屬事件池

將探索事件與地形權重綁定，分為**通用事件**與**地形專屬事件**：

| 地形（Terrain） | 事件類型（Event Types） | 事件名稱 | 敘述與選項特色 |
| :--- | :--- | :--- | :--- |
| **通用（Any）** | `lost-caravan` | 失散商隊 | 交易／護送／搶奪 |
| | `wounded-traveler` | 受傷旅人 | 救助／送醫（醫療室） |
| | `ancient-ruins` | 古代遺跡 | 探索／鑑定（裝備店） |
| **森林（forest）** | `forest-herb-gatherer` | 密林採藥人 | 協助辨識草藥獲得高階丹藥；或請教林間身法 |
| | `deep-forest-beast` | 密林異獸蹤跡 | 追蹤獵物（獲取毛皮材料與聲望）或設下陷阱 |
| | `ancient-tree-enlightenment` | 千年古木悟道 | 靜坐調息（回復內力並增加功法經驗） |
| **山嶽（mountain）** | `mountain-bandit-ambush` | 險峰山賊伏擊 | 擊退山賊（獲取金錢裝備）或利用地勢威懾 |
| | `cliff-carved-scripture` | 絕壁石刻殘篇 | 攀登絕壁領悟身法/內功心法；或拓印石刻換聲望 |
| | `mountain-spring-well` | 雲頂靈泉 | 飲用靈泉（全滿氣血與內力，獲得短暫屬性增益） |
| **水域（water / 水域周邊）**| `ferry-merchant` | 渡口神秘水商 | 購買稀有水行丹藥／水行功法秘笈 |
| | `waterfront-fisher` | 碧波漁叟 | 切磋釣技／聽取江湖傳聞（解鎖周邊視野） |
| | `flooded-temple` | 水淹沉寺 | 潛水打撈寶物（需消耗體力與身法檢定） |
| **荒漠（desert）** | `desert-mirage` | 荒漠海市蜃樓 | 勘破幻象獲得悟性增益；或迷失方向消耗體力 |
| | `buried-caravan` | 風沙埋沒車隊 | 挖掘建料與金銀（獲得大量物資） |
| | `wandering-ascetic` | 苦行散修 | 論道切磋（獲得江湖外功或悟道經驗） |

### 3.3 雙軌生成與觸發規則改進

地形化事件需涵蓋**地圖生成**與**回合結束觸發**兩種場景：

#### 3.3.1 地圖常駐探索點生成（`eventSpawner.ts`）
1. 地圖初始化或事件補點（`replenishInteractionPoint`）時，讀取候選格子的 `cell.terrain`。
2. 根據當前格子的地形，從該地形專屬池 + 通用池中隨機抽取事件。
3. 確保地圖上可見的探索點與其周邊環境高度契合。

#### 3.3.2 回合結束隨機觸發事件（`turnActions.ts: createPendingExplorationEvent`）
1. 玩家點擊結束回合且判定命中 `explorationTriggerChance` 時：
2. 讀取該玩家目前**站立格子的地形** `playerStandingCell.terrain`（例如停留在山嶽、荒漠或森林）。
3. 呼叫 `getTerrainExplorationEventType(standingTerrain)`：
   - 70% 機率自玩家所在**地形專屬池**中抽取事件（如在森林抽中「密林異獸」、在荒漠抽中「海市蜃樓」）。
   - 30% 機率自**通用事件池**（失散商隊、受傷旅人、古代遺跡）中抽取。
4. 彈窗事件（`PendingExplorationEventModal`）出現時，玩家體驗完全沉浸於當前身處的地理環境。

#### 3.3.3 事件選項條件過濾（`PendingExplorationEventModal.tsx`）
1. 回合結束事件與地圖常駐事件使用一致的選項條件過濾規則。
2. `PendingExplorationEventModal` 顯示選項前，必須檢查所有非位置條件：
  - `money-at-least`：玩家金錢是否足夠。
  - `item-owned`：玩家背包是否持有所需物品與數量。
  - `building-exists`：所有據點是否存在指定建築，例如防衛營、倉庫、醫療室或裝備商店。
3. 不符合條件的選項直接隱藏，不顯示為可選但不可用的狀態。
4. 執行層仍由 `checkEventRequirements` 再次驗證，UI 過濾不取代服務邏輯驗證。
5. 例：`beast-tracks` 的防衛營增強選項，在沒有 `barracks` 時不得顯示；即使被外部呼叫，也必須由執行層拒絕。

---

## 四、方案 6：怪物地形親和（怪物生態與戰術差異）

### 4.1 怪物生態分類與原生棲息地

怪物巢穴生成時，將其流派與所在地形結合，派生出「地形親和（Terrain Affinity）」。
**全數採用既有 Buff 系統實現**，統一掛載、結算與 UI 呈現，避免在怪物行動中硬編碼特判邏輯。

| 怪物類型／流派 | 原生親和地形 | 對應主場 Buff ID | Buff 效果定義（直接使用 BuffDefinition 欄位） |
| :--- | :--- | :--- | :--- |
| **追風狼群（swift-wind）** | **森林（forest）** | `home-turf-forest`（林隱狼性） | `evasionRateBonus: 15`（回避 +15%）<br>`damageDealtPercent: 0.15`（增傷 +15%）<br>`terrainCostOverrides: { forest: 1 }`（林間暢行） |
| **厚土石傀 / 狂熊（earth-mountain）** | **山嶽（mountain）** | `home-turf-mountain`（山嶽磐甲） | `damageReductionPercent: 0.2`（受傷 -20%）<br>`terrainCostOverrides: { mountain: 1 }`（山嶽暢行） |
| **寒潭水蛇 / 水怪（frost-water）** | **水域周邊（water）** | `home-turf-water`（狂瀾水息） | `damageDealtPercent: 0.15`（增傷 +15%）<br>`attributeModifiers: { innerEnergy: 2 }`（內息 +2）<br>`terrainCostOverrides: { water: 1 }`（水澤暢行） |
| **熾炎沙蠍 / 荒漠悍匪（scarlet-flame）** | **荒漠（desert）** | `home-turf-desert`（沙暴凶煞） | `damageDealtPercent: 0.15`（增傷 +15%）<br>`terrainCostOverrides: { desert: 1 }`（沙地暢行） |
| **金剛傀儡 / 廢墟守衛（golden-body）** | **廢墟周邊 / 山嶽** | `home-turf-ruin`（金剛古陣） | `damageReductionPercent: 0.25`（受傷 -25%）<br>`attributeModifiers: { armStrength: 2, constitution: 2 }` |

### 4.2 怪物地形優勢與玩家應對（戰術反制）

#### 4.2.1 動態 Buff 掛載與主場優勢（Home Turf Advantage）
1. **動態結算機制（Dynamic Terrain Buffs）**：
   - **親和 Buff 僅在怪物身處其對應地形時生效**：
   - 怪物（`CreatureState`）在進行移動結算、屬性衍生或被玩家攻擊時，系統傳入怪物當前站立格子的 `cell.terrain`：
     - **身處親和地形**（例：追風狼在森林、厚土熊在山嶽）：純函式推導動態附加對應的 `home-turf-*` Buff 實例，享受主場屬性加成。
     - **離開親和地形**（例：追風狼被引出森林踏上草地）：純函式推導自動不包含該 Buff，主場增益**立即完全失效**，怪物數值回復基礎值。
   - **純函式推導、無狀態殘留**：不需要在 state 中頻繁手動執行 addBuff / removeBuff，由 `getActiveBuffsForCreature(creature, currentTerrain)` 即時計算，杜絕狀態不同步或殘留 Bug。
2. **戰術反制（引誘出擊，Kiting & Baiting）**：
   - 玩家若在森林挑戰「追風狼群」，對手享有回避與增傷 Buff，正面硬拼極其劣勢；
   - 玩家可站在外圍草地，利用攻擊吸引仇恨將怪物**引誘出森林到草地**進行交戰，抹除其主場 Buff，大幅降低討伐難度。
3. **UI 資訊透明化**：
   - 怪物詳情彈窗與戰鬥預覽視窗，可直接讀取此 Buff 並展示 `🌲 林隱狼性（主場生效中）`，怪物離開主場後該標籤自動消失，資訊清晰直觀。

#### 4.2.2 巢穴生成加權（`worldGeneration.ts`）
- 追風流巢穴優先偏向森林群聚區生成。
- 寒水流巢穴優先偏向水域邊緣生成。
- 赤炎流巢穴優先偏向荒漠生成。
- 厚土流巢穴優先偏向山嶽生成。

---

## 五、方案 7：道具點地形化掉落池（地形物產差異化）

### 5.1 現狀與問題
目前道具點（Item Point）的拾取是透過單一全域池 `itemPointLootCatalog`（包含所有 1~2 級道具與 1~2 級裝備），無論在雪山、沙漠還是森林拾取，內容物完全相同，缺乏不同地域探索的驚喜與採集策略。

### 5.2 地形專屬物產與掉落設計

將道具點掉落分為「**通用基礎池（30%）**」與「**地形特產池（70%）**」：

| 地形（Terrain） | 地形特產主題 | 核心特產道具／裝備範例 | 特色與戰術價值 |
| :--- | :--- | :--- | :--- |
| **草地（plain）** | 平原草藥、通用補給、行者輕裝 | ・基礎療傷藥、行氣丹<br>・行者袍、輕布鞋、麻布囊<br>・探地符、鳴鑼符 | 基礎生存與偵查物資，新手穩定補給 |
| **森林（forest）** | 靈木藥材、身法道具、敏捷裝備 | ・回氣丹、聚氣符、換元符<br>・踏雲靴、柳葉鏢、靈木簪<br>・木行/疾風符、絆馬索 | 強調身法、體力回復與戰場陷阱操控 |
| **山嶽（mountain）** | 稀有礦石、重甲硬兵、防護陣符 | ・定身索、大地厚甲、玄鐵重劍<br>・磐石玉珮、玄鐵護腕<br>・土行/落石符、回營符 | 強調根骨、臂力、高防禦裝備與陣地護符 |
| **水域周邊（water）** | 水生靈珠、內息丹藥、寒冰暗器 | ・凝元丹、玄息凝神丹<br>・碧波長衫、寒冰針、避水玉<br>・水行爆發符 | 強調內息、內力轉化與水系遠程爆發 |
| **荒漠（desert）** | 古代殘件、烈火符籙、燃血凶藥 | ・燃血丹、噬魂符、裂脈符<br>・赤炎刀、烈焰符、火雷符<br>・風沙護目鏡、殘破金屬殘片 | 強調高風險資源取捨型道具與火系高傷符籙 |

### 5.3 拾取運作流程與介面回饋

1. **拾取邏輯（`lootFactory.ts: createItemPointLootForPlayer`）**：
   - 玩家踩上道具點並拾取時，傳入該道具點所在格子的 `terrain`。
   - 依據 `terrain` 從 `terrainItemPointLootCatalog[terrain]` 權重抽樣。
   - 保留防呆保底（若未定義或找不到則 fallback 至基礎療傷藥）。
2. **拾取結果提示（`ActionResultModal` / `formatItemPointPickupResult`）**：
   - 彈窗顯示標籤：`🌲 森林物產` / `⛰️ 山嶽礦藏` / `🏜️ 荒漠秘寶` / `🌊 水澤珍品`，增強探索反饋。

---

## 六、系統架構與模組劃分規劃

```
src/game/
├── catalogs/
│   ├── terrainAffinityCatalog.ts   # [新增] 定義地形與流派親和、怪物親和常數與倍率
│   ├── terrainEventCatalog.ts      # [擴充] 各地形專屬探索事件定義
│   ├── terrainLootCatalog.ts       # [新增] 各地形專屬道具點掉落池與權重定義
│   └── functionalSkillRegistry.ts  # [共用] 既有 Buff/效果註冊表
├── rules/
│   ├── terrainCombatRules.ts       # [新增] 計算地形共鳴傷害倍率、怪物主場加成、內力減免
│   ├── playerDerivedRules.ts       # [整合] 將地形戰鬥修正計入屬性與命中/回避
│   └── randomRules.ts              # [共用] 隨機種子工具
├── lootFactory.ts                  # [更新] createItemPointLootForPlayer 接收 terrain 參數
├── events/
│   ├── eventCatalog.ts             # [整合] 匯整地形專屬事件
│   └── eventSpawner.ts             # [更新] 依格子地形過濾可生成事件池
├── actions/
│   ├── combatActions.ts            # [更新] 戰鬥命中、傷害、內力結算時帶入地形共鳴
│   ├── creatureActions.ts          # [更新] 怪物 AI 移動與攻擊時計入主場親和
│   └── turnActions.ts              # [更新] createPendingExplorationEvent 依據玩家站立地形抽取事件
└── previewOrchestration.ts         # [更新] 預覽介面顯示地形共鳴與怪物主場狀態
```

---

## 七、開發階段規劃（Milestones）

| 階段 | 重點任務 | 預期產出 |
| :--- | :--- | :--- |
| **Phase 1** | **方案 2：地形與五行共鳴** | 建立 `terrainAffinityCatalog` 與 `terrainCombatRules`，戰鬥預覽與施放結算套用地形增益。 |
| **Phase 2** | **方案 7：道具點地形化物產** | 建立 `terrainLootCatalog`，`createItemPointLootForPlayer` 依據所在格地形分派特色物產。 |
| **Phase 3** | **方案 6：怪物地形親和** | 怪物在親和地形獲得戰鬥增益；巢穴生成偏向對應地形；UI 顯示怪物「主場狀態」。 |
| **Phase 4** | **方案 5：地形專屬事件** | 新增森林、山嶽、水域、荒漠專屬事件；`eventSpawner` 與 `turnActions`（回合結束觸發）依地形抽取；所有事件選項依金錢、物品與建築條件過濾。 |
| **Phase 5** | **UI 視覺與資訊回饋** | 地圖格資訊顯示地形共鳴與物產提示；戰鬥與拾取彈窗說明地形加成來源；單元測試完整驗證。 |

---

## 八、開發細節（Code-Level Implementation Details）

### 8.1 Phase 1：地形與五行共鳴（純函式規則）

**新增檔案 `src/game/catalogs/terrainAffinityCatalog.ts`**
```ts
import type { MartialElement } from '../types'
import type { TerrainType } from '../types'

/** 各五行屬性對應的親和地形清單。 */
export const ELEMENT_RESONANT_TERRAINS: Record<Exclude<MartialElement, 'none'>, TerrainType[]> = {
  metal: ['mountain'],
  wood: ['forest'],
  water: ['water'],
  fire: ['desert'],
  earth: ['plain'],
}
```

**新增檔案 `src/game/rules/terrainCombatRules.ts`**
```ts
/** 天地共鳴傷害倍率（親和地形 ×1.25，否則 ×1）。 */
export function getTerrainResonanceDamageMultiplier(
  skillElement: MartialElement | undefined,
  standingTerrain: TerrainType,
): number {
  if (!skillElement || skillElement === 'none') return 1
  return ELEMENT_RESONANT_TERRAINS[skillElement].includes(standingTerrain) ? 1.25 : 1
}

/** 天地共鳴內力減免（親和時 -1，否則 0）。 */
export function getTerrainResonanceInnerPowerDiscount(
  skillElement: MartialElement | undefined,
  standingTerrain: TerrainType,
): number {
  return getTerrainResonanceDamageMultiplier(skillElement, standingTerrain) > 1 ? 1 : 0
}
```

**改動點**
- `combatActions.ts: executeExternalDamage`：取得施法者站立格子地形後，將 `resonanceMultiplier` 乘入 `baseDamage`，並將內力消耗扣減 `resonanceDiscount`。
- `previewOrchestration.ts`：預覽時同步帶入共鳴倍率，並在預覽結果附註「地形共鳴」標籤。
- **注意**：需先有「施法者站立格地形」查詢工具函式（`getTerrainAtPosition(map, position)`），供 combat 與 preview 共用。

### 8.2 Phase 2：道具點地形化物產

**新增檔案 `src/game/catalogs/terrainLootCatalog.ts`**
```ts
import type { TerrainType } from '../types'
import type { LootDefinition } from '../types'

/** 各地形專屬掉落池（權重抽樣）。 */
export const terrainItemPointLootCatalog: Partial<Record<TerrainType, LootDefinition[]>> = {
  plain: [/* 行者袍、探地符、療傷藥… */],
  forest: [/* 踏雲靴、絆馬索、聚氣符… */],
  mountain: [/* 玄鐵重劍、定身索、回營符… */],
  water: [/* 碧波長衫、寒冰針、凝元丹… */],
  desert: [/* 赤炎刀、燃血丹、烈焰符… */],
}
```

**改動點**
- `lootFactory.ts: createItemPointLootForPlayer(player, terrain?)`：新增 `terrain` 參數；若 `terrain` 有對應專屬池，則 70% 自專屬池、30% 自通用 `itemPointLootCatalog` 抽樣；無對應時回退全域池。
- `gameStore.ts: collectItemPoint`：拾取時由道具點 `position` 反查 `map.cells` 取得 `terrain` 後傳入。
- `actionResultFormatters.ts: formatItemPointPickupResult`：附註地形物產標籤。

### 8.3 Phase 3：怪物地形親和

**新增檔案 `src/game/catalogs/terrainAffinityCatalog.ts`（擴充）**
```ts
/** 各流派怪物的主場 Buff ID 與親和地形對照。 */
export const CREATURE_HOME_TURF: Record<string, { terrain: TerrainType; buffId: string }> = {
  'swift-wind': { terrain: 'forest', buffId: 'home-turf-forest' },
  'earth-mountain': { terrain: 'mountain', buffId: 'home-turf-mountain' },
  'frost-water': { terrain: 'water', buffId: 'home-turf-water' },
  'scarlet-flame': { terrain: 'desert', buffId: 'home-turf-desert' },
  'golden-body': { terrain: 'mountain', buffId: 'home-turf-ruin' },
}
```

**新增 Buff 定義（`buffCatalog.ts`）**
```ts
{ id: 'home-turf-forest', name: '林隱狼性', description: '身處森林主場：回避 +15%、增傷 +15%、林間暢行。', duration: 'persistent', evasionRateBonus: 15, damageDealtPercent: 0.15, terrainCostOverrides: { forest: 1 } },
// …其餘 home-turf-* 同表 4.1
```

**改動點**
- `playerDerivedRules.ts`：新增 `getActiveBuffsForCreature(creature, standingTerrain)` 純函式，動態注入主場 Buff（不寫入 state）。
- `creatureActions.ts`：怪物移動與攻擊結算時，傳入怪物當前格子地形以套用主場 Buff 效果。
- `creatureNestDetailsModal.tsx` / 怪物詳情：顯示當前主場 Buff 標籤。

### 8.4 Phase 4：地形專屬事件

**新增/擴充 `eventCatalog.ts`**
- 建立 `TERRAIN_EVENT_POOL: Partial<Record<TerrainType, ExplorationEventType[]>>` 對照表。
- 通用池 `COMMON_EVENT_POOL: ExplorationEventType[] = ['lost-caravan', 'wounded-traveler', 'ancient-ruins']`。

**改動點**
- `eventSpawner.ts`：生成/補點時讀取 `cell.terrain`，呼叫 `pickTerrainEventType(terrain)`。
- `turnActions.ts: createPendingExplorationEvent(player, round, standingTerrain)`：接收玩家站立地形，70% 專屬池 + 30% 通用池抽取。

---

## 九、風險評估與緩解對策

### 9.1 風險矩陣總覽

| 風險 | 影響 | 發生機率 | 等級 | 緩解對策 |
| :--- | :--- | :--- | :--- | :--- |
| **數值可調性**：地形共鳴倍率未來需微調 | 中 | 中 | **低** | 數值統一抽離為 Catalog/Rules 常數（如 `RESONANCE_DAMAGE_MULTIPLIER`），方便隨時直接修改 |
| **移動成本與主場衝突**：怪物 `terrainCostOverrides` 覆寫既有的破壁/輕功規則 | 中 | 中 | **中** | 維持既有 `terrainCostOverrides` 的優先級不變，主場 Buff 僅用 `terrainCostOverrides` 欄位，不新增特殊分支 |
| **事件池爆炸**：地形專屬事件大幅增加目錄規模 | 低 | 中 | **中** | 每地形先以 3 個事件起步，共用既有 `ExplorationEventDefinition` 結構與選項格式，避免重複定義 |
| **性能回歸**：每次屬性衍生都遍歷 map.cells 查地形 | 中 | 低 | **中** | 建立 `Map<string, TerrainType>`（key=`row-column`）快取，O(1) 查詢 |
| **既有測試破壞**：動態 Buff 注入影響怪物屬性判定 | 中 | 中 | **高** | 純函式加參數採「預設值 = 無主場」向後相容；逐 Phase 跑完整 `vitest` 套件 |
| **狀態一致性**：怪物主場 Buff 未寫入 state 導致 UI 與結算不一致 | 高 | 低 | **中** | 統一由 `getActiveBuffsForCreature` 單一純函式供「結算」與「UI 顯示」共用，杜絕雙重來源 |
| **玩家理解成本**：共鳴/主場規則過多，玩家看不懂 | 中 | 中 | **中** | Phase 5 強化 UI 提示（地形共鳴標籤、主場 Buff 圖標），並於遊戲導覽頁補充規則說明 |

### 9.2 關鍵決策與取捨（Trade-offs）

1. **純函式 vs 狀態寫入**：
   - 選擇純函式動態推導（不寫入 `creature.buffs`），避免頻繁 addBuff/removeBuff 造成的狀態同步風險，代價是每次計算需傳入地形參數。
2. **專屬池機率（70/30）**：
   - 地形專屬事件占比過高會稀釋通用事件曝光率；70/30 是「沉浸感」與「內容多樣性」的折衷，可再調。
3. **共鳴倍率（+25%）**：
   - 過高會破壞流派平衡、過低則失去戰略意義；+25% 與五行相剋（×2 / ×0.5）形成對比，初期以 +25% 起步，視模擬結果微調。

### 9.3 驗收標準（Definition of Done）

- [ ] 每個 Phase 皆附帶對應 `*.test.ts` 單元測試（純函式規則、掉落抽樣、Buff 注入、事件抽取）。
- [ ] 完整 `npx vitest run` 套件全數通過，無既有測試回歸。
- [ ] 手動冒煙測試：森林放追風外功、荒漠挑戰沙蠍、山嶽拾取礦石道具點，三場景符合設計預期。

---

## 十、總結

## 十一、目前開發進度與後續待辦

### 11.1 已完成

- **地圖地形權重**：地圖設定頁可調整各地形權重，並支援隨機生成權重。
- **地形限制生成**：據點、門派據點與廢墟避開水域。
- **天地共鳴核心**：草地／土、森林／木、水域／水、荒漠／火、山嶽／金的共鳴判定。
- **天地共鳴結算**：親和外功傷害 ×1.25、內力消耗 -1，且預覽與實際結算同步。
- **怪物內功傷害**：怪物普通攻擊改用自身內功公式，悟性生成下限為 5。
- **怪物主場 Buff 基礎架構**：主場 Buff 依怪物當前地形動態生效，離開地形立即失效；主場增傷、部分減傷與屬性加成已接入攻擊結算與生物詳細 Modal。
- **怪物巢穴地形偏向**：巢穴流派以 70% 機率依所在格地形決定、30% 機率隨機決定，並保留數量與不重疊規則。
- **道具點地形化**：所有有屬性的道具與裝備各自分配至單一地形；無屬性元素爆發道具保留在通用池；通用掉落 20%、地形特產 80%。
- **道具點 UI**：地圖 icon、詳細 Modal、拾取結果會顯示草地物產、森林物產、山嶽礦藏、水澤珍品或荒漠秘寶。
- **事件地形化框架**：地圖常駐事件與回合結束事件依玩家／事件所在格地形抽取；回合事件使用地形池 70%／通用池 30%。
- **事件條件過濾**：事件選項會檢查金錢、物品與建築條件；不符合條件的選項在 UI 隱藏，執行層仍會二次驗證。
- **驛站傳送**：據點驛站可傳送至門派據點，並在目標周邊一格降落。

### 11.2 部分完成

- **怪物主場 Buff 戰鬥效果**：主場反震與怪物主場暴擊依目前設計暫不啟用；主場移動成本仍需整合至怪物移動流程。
- **地形專屬事件**：目前已完成事件池分類與抽取框架，部分地形事件仍沿用既有事件內容，尚未新增完整的森林、山嶽、水域與荒漠專屬事件。
- **UI 資訊回饋**：怪物靈氣、道具物產與基礎共鳴提示已加入；戰鬥結果的完整共鳴來源與怪物主場細節仍可補強。

### 11.3 尚未開發

- 完整地形專屬事件內容：採藥人、古木悟道、絕壁石刻、雲頂靈泉、渡口水商、海市蜃樓等。

### 11.4 後續開發順序

1. 完成怪物主場 Buff 的移動成本整合；反震與怪物主場暴擊暫不列入開發。
2. 新增完整的地形專屬事件內容與獎勵。
3. 將怪物巢穴生成與流派親和地形加權連動。
4. 補強戰鬥預覽、攻擊結果與怪物詳細 Modal 的地形效果說明。
5. 每個階段完成後進行單元測試與遊戲內手動驗證，再進入下一階段。

### 11.5 驗證狀態

- 目前已完成的相關功能均有對應測試覆蓋。
- 目前請進行遊戲內手動驗證，重點觀察：森林追風流「林風迴避」、荒漠赤炎流「炎砂灼燒」、水域寒水流「寒潭玄毒」、草地厚土流「厚土反震」、山嶽金剛流暴擊率加成，以及怪物主場 Buff 顯示與離開地形後的失效。
- 測試回報格式建議包含：測試地形、角色／怪物流派、施放功法、靈氣列表、預覽數值、實際結果與是否符合預期。
- 最近一次事件與回合流程驗證：**125 個測試通過**。
- 最近一次道具、裝備與地形掉落驗證：**16 個測試通過**。
- 後續新增功能仍需在測試通過後請玩家進行遊戲內驗證。

透過「**流派共鳴 + 地形物產 + 地形事件 + 怪物主場**」四維聯動，地形從原本單純的「體力扣除障礙」升級為「**核心戰術與探索要素**」：
- **戰術配裝**：配功法時會考量地圖地形權重（森林多配追風，荒漠多配赤炎）；
- **路線規劃**：想刷特定裝備或資源取捨丹藥時，會專門前往山嶽或荒漠道具點採集；
- **戰鬥走位**：遇到強敵時會利用走位誘敵離開怪物主場，將戰場拉到己方親和地形；
- **沈浸探索**：探索不同地形區域時，拾取物產與隨機事件都有強烈的地域風格與特色。
