# mygame2 Catalogs 擴充指南

> 檢視日期：2026-08-23
> 範圍：`mygame2/src/game/catalogs/`（20 檔：17 資料 + 3 測試）
> 前置閱讀：`handev/mygame2-architecture.md`

## 1. Catalogs 全景

| 檔案 | 匯出 | 內容量 | 性質 |
|---|---|---|---|
| `itemCatalog.ts` | `itemCatalog: ItemDefinition[]` | ~46 件 | 靜態陣列，依分類子陣列在模組載入時 push 合併 |
| `equipmentCatalog.ts` | `equipmentCatalog: EquipmentDefinition[]` | ~39 件 | 基礎清單 + 六門派裝備由 tuple 表生成，category 自動補上 |
| `buffCatalog.ts` | `buffCatalog: BuffDefinition[]` | ~35 條 | 靜態陣列；欄位即「效果 DSL」，由規則層解譯 |
| `innerSkillCatalog.ts` | `innerSkillCatalog: InnerSkill[]` | 1 件 | **含行為**：`calculateDamage(attributes)` 閉包 |
| `externalSkillCatalog.ts` | `externalSkillCatalog: ExternalSkill[]` | 1 件 | 同上 + `functionalEffect` 可掛功能效果 |
| `skillProgressionCatalog.ts` | `progressionInnerSkills / progressionExternalSkills / martialHall*Skills` | 6 流派 × (1 內功 + 3 外功) | **程式生成**：由 6 個 `SchoolDefinition` 表 map/flatMap 出功法 |
| `jianghuExternalSkillCatalog.ts` | `jianghuExternalSkills: ExternalSkill[]` | 10 件 | 工廠函式 `createJianghuSkill()` 生成，皆為自我 Buff 型 |
| `martialHallSkillCatalog.ts` | `allInnerSkillCatalog / allExternalSkillCatalog / getMartialHallSkills()` | — | **聚合層**：合併基礎+進階+江湖功法，是外部查表的統一入口 |
| `functionalSkillRegistry.ts` | effect union + `functionalExternalSkillDescriptions` + `functionalSkillBuffBindings` + `getFunctionalSkillBuffIds()` | 21 effects | 功能外功 ↔ Buff 的中央對照表（防字串漂移） |
| `buildingCatalog.ts` | `buildingCatalog: BaseBuilding[]` + `BUILDING_TYPES` | 18 棟 | 靜態；bonus 欄位（healthBonus 等）由規則層讀取 |
| `defenseStructureCatalog.ts` | `defenseStructureCatalog[]` + `buildableDefenseStructureCatalog` | 9 種 | 後者 = 前者濾掉廢墟專屬小型設施 |
| `governancePolicyCatalog.ts` | `governancePolicyCatalog[]` | 4 政策 | 只有 id/name/description；**實際效果寫死在 policyRules** |
| `martialSchoolCatalog.ts` | `martialSchoolCatalog[]` + `MartialSchoolId` union | 6 流派 | id 是封閉 union，加門派要改型別 |
| `placeNameCatalog.ts` | `playerNames / cityNames / villageNames / resourceNames` | 各數十筆 | 世界生成隨機取名池 |
| `storyDialogueCatalog.ts` | `storyDialogueCatalog: Record<chapterId, ScenarioDialogueStep[]>` | 序章 3 句 | 資料驅動對話；`triggerCondition` 由 dialogueTriggerRules 比對 |
| `campaignScenarioCatalog.ts` | `campaignScenarioCatalog: Record<scenarioId, ScenarioDefinition>` | 2 章（序章＋第一章荒廟影禍） | 官方劇情章節（借用 editor 的 ScenarioDefinition 型別） |
| `terrainLootCatalog.ts` | `terrainItemPointLootCatalog: Partial<Record<TerrainType, LootDefinition[]>>` | 5 地形 | `createTerrainLoot(itemIds, equipmentIds)` 以 id 清單生成；權重 = `12 − requiredShopLevel×2` |

⚠️ 另有兩個掉落池**不在 catalogs 資料夾**而在 `types.ts:340-354`：
- `lootCatalog`（怪物掉落的功法池，目前清空待重設計）
- `itemPointLootCatalog`（道具點通用池：≤2 級道具權重 20、非門派 ≤2 級裝備權重 10）

## 2. Catalog → 遊戲骨架的互動模式

歸納出六種消費模式，擴充前先確認新資料會被哪條路徑吃到：

### 模式 A：id 直查（find）
```
shopRules.getItemBuyPrice()      → itemCatalog.find(id)
shopRules.getEquipmentBuyPrice() → equipmentCatalog.find(id)
governanceRules.getPolicyDefinition() → governancePolicyCatalog.find(id)
```
價格、販售條件全部來自 catalog 欄位，UI 不用改。

### 模式 B：模組層 Map 快取
```
playerDerivedRules.ts:16  buffById = new Map(buffCatalog…)   ← 所有 Buff 生效的解譯核心
lootFactory.ts:40-42      innerSkillById / externalSkillById / itemById
```
查不到就靜默失敗（回 undefined / fallback），所以 id 拼錯不一定報錯，要靠測試守。

### 模式 C：filter 推導池
```
lootFactory.createLootForPlayer()    怪物掉落 = itemCatalog 過濾 requiredShopLevel ≤ 怪物等級
                                     + allInner/ExternalSkillCatalog 過濾未學會 & !lootExcluded & requiredHallLevel ≤ 等級
lootFactory.createItemPointLootForPlayer()  道具點 = 20% 通用池 + 80% 地形特產池
buildableDefenseStructureCatalog     排除 small-* 三種
getMartialHallSkills(schoolId)       武館貨源按 schoolId 過濾
editorOptions.ts                     編輯器下拉選單直接吃各 catalog（新增即自動出現）
```

### 模式 D：effect 型別 switch/if 鏈（資料驅動行為）
```
ItemEffectType                → gameStore.ts useItem 一長串 if（973~1236 行）
FunctionalExternalSkillEffect → combatActions 施放時經 getFunctionalSkillBuffIds() 掛 Buff；
                                functionalSkillScaling.ts 依 skill level 縮放數值
BuffDefinition 欄位           → playerDerivedRules / movementRules / combatActions 解譯
GovernancePolicyId            → policyRules if 鏈（getEffectiveMoneyCost 等）
```
**這是唯一「加一筆資料不夠」的模式**：新 effect 值必須同時擴 union + 補 handler。

### 模式 E：世界生成取名
```
worldGeneration / worldSetup ← placeNameCatalog 四個名字池
```

### 模式 F：劇情管線
```
campaignScenarioCatalog → gameStore.loadScenario() 編譯成 GameState
storyDialogueCatalog[chapterId] → collectTriggeredDialogues() 按 triggerCondition 入佇列
章節 id 是兩個 catalog 的 join key
```

## 3. 交叉引用與測試防護網

catalogs 之間大量以 **id 字串互相引用**，目前靠測試檔守住完整性：

| 引用 | 守護測試 |
|---|---|
| item.effect=buff 的 `buffDefinitionId` → buffCatalog | `itemCatalog.test.ts` |
| functionalSkillBuffBindings 每個 buffId → buffCatalog | `skillProgressionCatalog.test.ts` |
| terrainLootCatalog 的 item/equipment id → 兩大 catalog | `lootFactory.test.ts`（find 不到會被靜默剔除） |
| 劇情實體引用 skill id（如 `tuna-gong`） | 目前**無**自動測試，手動驗證 |

其他隱性約定：
- `requiredShopLevel` 身兼三職：商店解鎖等級、掉落階級（`getTierWeight`: 20/2^(tier−1)）、地形特產權重。
- `lootExcluded: true` 的技能（門派輕功）不會從掉落取得。
- `createFallbackItem()` 取 `itemCatalog[0]`——目錄順序不可任意重排開頭。
- `itemCatalog.push(...)` 在 import 時執行——有副作用，勿改成 lazy。

## 4. 擴充操作手冊（by case）

### 4.1 加一件道具（最常見，零程式碼）
1. 在 `itemCatalog.ts` 對應分類子陣列加一筆（或新建分類陣列並加入 `extendedItemCatalog` 合併）。
2. 填 `buyPrice`、`requiredShopLevel`（同時決定掉落稀有度）。
3. 要讓它出現在特定地形道具點 → 把 id 加進 `terrainLootCatalog.ts` 對應地形清單。
4. 若 `effect: 'buff'` → buffCatalog 必須已有該 `buffDefinitionId`（否則測試紅）。
5. UI（商店、背包、編輯器、highlightTerms）自動生效。

**新 ItemEffectType** 才需要動程式：union 加值 → `gameStore.useItem` 加處理分支（注意 `itemEffectsUsedThisTurn` 每回合限一次的登記）→ 視需要補 `previewOrchestration`、`itemGroups.ts` 分組。

### 4.2 加一件裝備
- 一般裝備：`baseEquipmentCatalog` 加一筆（slot/modifiers/maxDurability/buyPrice/requiredShopLevel）；`category` 會自動補。想進掉落池就加 terrainLootCatalog。
- 門派裝備：`sectEquipmentCatalog` 的 tuple 表加一行（schoolId, 名稱, slot, icon, sectGateLevel, buyPrice, modifiers），id 自動為 `sect-{school}-{slot}`；臂力欄位有自動平衡公式補正。

### 4.3 加一條 Buff
1. 只用**既有欄位**組合（attributeModifiers / terrainCostOverrides / damageDealtPercent / conditional…）→ 純加資料即可，playerDerivedRules 會解譯。
2. 需要**新機制欄位**（如新的 `xxxPercent`）→ BuffDefinition 加欄位 → 在讀取端（combatActions / playerDerivedRules / movementRules）加解譯邏輯 → `types.ts` 的 `BuffInstance` 同步加快照欄位。
3. 主場類 Buff（home-turf-*）需另外在 creature 生成處綁定，不是只加 catalog 就會觸發。

### 4.4 加功法
| 類型 | 做法 |
|---|---|
| 獨立內功 | `innerSkillCatalog.ts` 加一筆，自帶 `calculateDamage` 閉包 |
| 獨立傷害外功 | `externalSkillCatalog.ts` 加一筆（target 必填） |
| 門派系列 | 改 `skillProgressionCatalog.ts` 的 `schools` 表（注意 `innerNames/externalNames` 有 6 個名字但目前只取 `[0]`，等級系統尚未展開） |
| 江湖功能外功 | 先確認 `FunctionalExternalSkillEffect` 已有該 effect → `jianghuExternalSkillCatalog.ts` 用 `createJianghuSkill()` 加一筆 |

**全新功能效果（effect）**的完整 checklist：
1. `functionalSkillRegistry.ts`：effect union 加值 + `functionalExternalSkillDescriptions` 加描述 + `functionalSkillBuffBindings` 加對應 buffId。
2. `buffCatalog.ts`：新增承接效果的 Buff 定義。
3. `functionalSkillScaling.ts`：若數值隨技能等級縮放，加 if 分支。
4. combatActions 經 registry 自動掛 buff，通常不用改。
5. 跑 `skillProgressionCatalog.test.ts` 驗證 binding 完整性。

**加第七個門派**牽連最廢：`MartialSchoolId` union → `martialSchoolCatalog` → `skillProgressionCatalog.schools` → `buildingCatalog` 加武館（type: 'martial-hall' + schoolId）→ `equipmentCatalog` 門派裝備 tuple → 視需要 home-turf Buff。

### 4.5 加建築
1. `BUILDING_TYPES` 加 key + `buildingCatalog` 加定義（constructionCost/requiredRank/bonus 欄位）。
2. 既有 bonus（healthBonus/materialCapacityBonus/collectionBonus）由 buildingRules/baseRules 自動讀取；**新 bonus 欄位要自己接進規則層**。
3. 要互動功能 → 仿 `mission/heal/repair`：`BaseBuildingActionType` 加值 → `buildingActionRegistry` 註冊 handler → actions 層寫動作函式 → UI 加按鈕。
4. 特例參考：trade-market 的全局靈氣是在建造流程（buildingActions.constructBuilding）硬編碼觸發。
5. 編輯器 palette 自動收錄。

### 4.6 加防禦設施
`DefenseStructureType` union + 定義一筆即可；attackRange>0 自動獲得 Creature 回合反擊、providesVision 影響視野、changesTerrain=true 走改地形路徑（如道路）。廢墟限定設施記得排除在 `buildableDefenseStructureCatalog` 外（現為黑名單 filter，新小型設施要加進排除清單）。

### 4.7 加政策
`GovernancePolicyId` union + catalog 一筆 + **policyRules 手寫效果**（description 不會自己生效）。解鎖條件看 `governanceRules.getAvailablePolicyIds`（官階門檻）。

### 4.8 加劇情章節
1. `campaignScenarioCatalog` 加 `ScenarioDefinition`（地圖 cells、entities、quests、dialogues）。
2. `storyDialogueCatalog` 用**同一個 chapterId** 加對話步驟（on-start / on-victory / on-failure…）。
3. 實體 data 引用的 skill/item id 要存在於對應 catalog（目前無測試守護，建議人工核對）。

### 4.9 加名字
`placeNameCatalog` 四個陣列直接 push，世界生成即用。

## 5. 建議的擴充工作流

1. **先找消費路徑**：grep 新資料的 id 型別會被誰 filter/find/switch（見第 2 節六種模式）。
2. **純資料優先**：能用現有 effect 欄位組合就不要發明新欄位。
3. **id 命名慣例**：道具 kebab-case 主題字串、門派裝備 `sect-{school}-{slot}`、功法 `{school}-external-damage/-functional/-light-foot`、江湖 `jianghu-*`——遵循前綴方便除錯與 highlightTerms。
4. **同步補測試**：跨目錄引用務必在對應 `.test.ts` 加存在性斷言（仿 itemCatalog.test.ts 的 buff 檢查）。
5. **驗證指令**：
   ```powershell
   npx tsc -b --pretty false   # 型別（union 改動最容易漏）
   npx vitest run              # 全量；重點: itemCatalog / skillProgressionCatalog / equipmentCatalog / lootFactory
   npm run analyze:combat      # 動了數值後跑平衡分析
   ```
6. **存檔相容性**：GameState 只存 id，舊存檔遇到被移除/改名的 id 會壞——**只加不改不刪**最安全；真要改 id 需寫 gameSave 遷移。

## 6. 觀察到的改善機會（擴充前的技術債）

1. **掉落池分裂**：`lootCatalog` / `itemPointLootCatalog` 在 types.ts，其餘在 catalogs/ ——建議搬移集中，否則擴充容易漏改一半。
2. **MartialSchoolId 封閉 union** 散布多檔；若計畫加門派或讓 mod 注入門派，可改為由 catalog 推導型別 `(typeof martialSchoolCatalog[number]['id'])`。
3. **skillProgressionCatalog 只用到名字表第 1 個名字**：六級名稱已備好但 level 全為 1，功法等級系統（skillProgression）是現成的擴充切入點。
4. **劇情實體引用無測試**：scenario entities 的 itemId/skillId 建议加一個 scenarioCompiler 層級的引用完整性測試。
5. **政策效果硬編碼**：若要擴到 8~10 個政策，建議把效果也資料化（percent 之類欄位），避免 policyRules if 鏈膨脹。
