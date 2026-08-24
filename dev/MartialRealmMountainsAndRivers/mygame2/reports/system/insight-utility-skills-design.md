# 悟性導向非戰鬥／輔助功法系統企劃與設計草案

**文件日期**：2026-08-23  
**文件狀態**：草案與討論中（Draft & Discussion）  
**目標模組**：功法系統（Inner/External Skills）、大地圖探索、修煉循環、據點經營

---

## 一、設計背景與問題定義

### 1.1 現況痛點
1. **悟性定位單一**：目前悟性屬性主要提供「功法裝備容量／運功上限」與「升級經驗值加成」。
2. **屬性脫節與邊際效益低**：單純投資悟性雖然能裝備更多功法，但若沒有同步提升「內息（最大內力）」與「臂力/身法」，玩家將面臨「有功法格位、無內力施展」或「招式威力低」的窘境。
3. **戰鬥以外維度缺乏功法支撐**：既有功法絕大多數為戰鬥輸出或數值被動，缺乏大地圖機動、視野探索、資源採集、內力自循環與據點經營等非戰鬥維度的技能。

### 1.2 核心目標
- **賦予高悟性獨立玩法定位**：打造「智謀／隱士／勘輿大師／經營掌門」流派。
- **低內力門檻 / 特殊代價**：以「高悟性需求（Insight Requirement）」取代「高內力消耗（Inner Power Cost）」，部分功法消耗體力或 0~1 點內力，甚至純被動生效。
- **拓展非戰鬥功法體系**：為大地圖互動、資源獲取、經營建設與戰術控場提供功能型功法。

---

## 一之補充：功法類型定義（Skill Type Definitions）

為統一後續設計用語，以下先定義三類功法的本質差異：

### 1. 內功（Inner Skill）
- **定位**：角色的「普攻傷害」來源，也是功法的根本基礎。
- **觸發方式**：**被動生效**，裝備即提供普攻傷害與常駐屬性（如吐納功的悟性 +5 加成）。
- **可否指定目標**：否，普攻作用於相鄰單一敵人，無需主動指定。
- **內力消耗**：0（普攻不耗內力）。
- **常用屬性 Buff**：吐納功掛載「吐納養氣」常駐 Buff，**悟性 +5**。
- **等級掛鉤**：
  - **普攻傷害**：隨功法等級成長。
  - **常駐屬性 Buff**：**不掛鉤等級**（固定數值，如悟性 +5），維持固定加成。

### 2. 傷害型外功（Damage External Skill）
- **定位**：角色的「技能傷害」來源，是主動施放的攻擊招式。
- **觸發方式**：**主動施放**，需指定目標（`target`），消耗內力造成傷害或施加負面效果。
- **可否指定目標**：是，必須指定一名目標。
- **內力消耗**：有（如 3～6 內力）。
- **等級掛鉤**：傷害與內力消耗隨功法等級成長。

### 3. 靈氣型外功（Aura External Skill）
- **定位**：不直接造成傷害，而是透過 **靈氣 Buff** 提供增益／減弱／特殊效果的輔助功法。
- **觸發方式**：**開啓／關閉功法**直接決定是否擁有靈氣 Buff；**開啓即常駐生效，關閉即移除**，不再透過「主動施放」來啟動 Buff。
- **可否指定目標**：**否**，作用於自身（`self`）；若需指定目標則歸為「傷害型外功」。
- **內力消耗**：0（常駐被動，無施放成本）。
- **等級掛鉤**：Buff 數值隨功法等級成長。

### 4. 強化型外功（Enhancement External Skill）
- **定位**：所有 `target` 為 `self` 類別的**主動型外功技能**。
- **觸發方式**：**主動施放**，施放後對自身產生效果；**無常駐靈氣 Buff**。
- **可否指定目標**：**否**，作用於自身（`self`）。
- **內力消耗**：有（如 5 內力）。
- **等級掛鉤**：**暫不支援**。
- **包含**：需「主動施放、作用自身（`self`）、產生短期效果」之功法，如回春功（回復自身 20% 血量）。

> **判定準則**：
> - 凡需「指定對象」者歸為**傷害型外功**（如奇門惑心術、知己知彼）。
> - 凡「開啓／關閉功法直接決定靈氣 Buff」者歸為**靈氣型外功**（如太虛引氣訣、天眼望氣訣、太虛流·迴氣，以及破壁功、林間步等門派地形機動功法）。
> - 凡「主動施放、作用自身（`self`）」者歸為**強化型外功**（如回春功）。

---

## 二、功法分類與創意候選清單

### 2.1 類別 A：修煉循環與氣息轉化類（解決低內力短板）

| 功法名稱 | 類型 | 需求條件 | 消耗 | 核心效果 |
| :--- | :--- | :--- | :--- | :--- |
| **《太虛引氣訣》** | 內功 | 悟性 $\ge 12$ | 被動 / 0 內力 | **以體化氣（Buff 形式）**：裝備時常駐掛載 Buff「引氣歸元」，回合結束結算時若有剩餘體力，自動將剩餘體力依比例轉化為內力（1 體力 $\rightarrow$ `2 + Lv` 內力）。 |
| **《四兩千斤訣》** | 被動/內功 | 悟性 $\ge 16$ | 被動 | **招式省氣（Buff 形式）**：裝備時常駐掛載 Buff「四兩撥千斤」，使裝備的所有外功內力消耗 $-1$（最低為 1），且外功造成傷害時附加 `悟性 × (0.4 + Lv × 0.05)` 的真實傷害。 |

---

### 2.2 類別 B：大地圖探索與視野情報類（探索與生存）

| 功法名稱 | 類型 | 需求條件 | 消耗 | 核心效果 |
| :--- | :--- | :--- | :--- | :--- |
| **《天眼望氣訣》** | 輔助/內功 | 悟性 $\ge 11$ | 被動 / 0 內力 | **觀氣明眸（Buff 形式）**：裝備時常駐掛載 Buff「天眼望氣」，使自身地圖視野半徑 $1 + \lceil Lv / 3 \rceil$（基礎視野擴大，便於提前勘查地形與敵情）。 |
| **《神行八卦步》** | 靈氣型外功 | 悟性 $\ge 10$<br>身法 $\ge 7$ | 被動 / 0 內力 | **神行步法（Buff 形式）**：開啟功法時常駐掛載 Buff「神行八卦」，使自身最大體力 `基礎值 + 2 + Lv`（大幅提升大地圖行動與機動上限）。 |
| **《靈植百草鑑》** | 被動功法 | 悟性 $\ge 13$ | 被動 | **草木精通（Buff 形式）**：裝備時常駐掛載 Buff「靈植百草」，在地圖資源點採集（草藥/礦石）時，採集體力消耗 $-1 - \lfloor Lv / 2 \rfloor$（最低 1），且有 `(50% + Lv × 5%)` 機率額外獲得雙倍產出或稀有素材。 |

---

### 2.3 類別 C：據點經營與天工建設類（基建與守城）

| 功法名稱 | 類型 | 需求條件 | 消耗 | 核心效果 |
| :--- | :--- | :--- | :--- | :--- |
| **《天工開物卷》** | 被動功法 | 悟性 $\ge 12$ | 被動 | **巧奪天工（Buff 形式）**：裝備時常駐掛載 Buff「天工開物」，在據點進行建築建造、升級或維修時，建築材料消耗減少 `(25% + Lv × 5%)`，建造獲得的門派聲望 $+(50% + Lv × 10%)$。 |
| **《商道通鑑》** | 被動功法 | 悟性 $\ge 10$ | 被動 | **低買高賣（Buff 形式）**：裝備時常駐掛載 Buff「商道通鑑」，在商店/黑市交易時，買入價格 $-(15% + Lv × 3%)$，賣出價格 $+(15% + Lv × 3%)$；完成告示牌任務獎金 $+(30% + Lv × 5%)$。 |

---

### 2.4 類別 D：謀略干擾與非接觸控場類（戰術謀士）

| 功法名稱 | 類型 | 需求條件 | 消耗 | 核心效果 |
| :--- | :--- | :--- | :--- | :--- |
| **《奇門惑心術》** | 傷害型外功 | 悟性 $\ge 14$ | 2 內力 | **迷魂引路（Buff 形式）**：消耗 2 內力對 3 格內一隻非 Boss 目標施加持續 `(1 + \lfloor Lv / 2 \rfloor)` 回合 Buff「惑心」，使其下一回合陷入「迷惘」（不進行攻擊，僅隨機移動）。 |
| **《知己知彼》** | 傷害型外功 | 悟性 $\ge 11$ | 1 內力 | **破綻洞察（Buff 形式）**：消耗 1 內力對 3 格內一名目標施加持續 `(2 + \lfloor Lv / 2 \rfloor)` 回合 Buff「洞察弱點」，使全隊及防禦塔對該目標造成的傷害 $+(20% + Lv × 5%)$。 |

---

## 一之補充：目前遊戲功法分類總表（以現行程式目錄為準）

> 本節只記錄目前已存在於遊戲功法目錄的功法，不包含尚未開發的草案功法。分類依照「內功／傷害型外功／靈氣型外功／強化型外功」定義整理。現行 **36 項**：內功 7 項、傷害型外功 9 項、靈氣型外功 19 項、強化型外功 1 項（回春功）。原 6 項門派輕功已轉為靈氣型外功，見 3.1。

### 1. 內功（7 項）

| 功法名稱 | ID | 所屬 | 主要作用 |
| :--- | :--- | :--- | :--- |
| 吐納功 | `tuna-gong` | 基礎功法 | 提供普攻傷害；裝備時掛載「吐納養氣」（悟性 +5）Buff。 |
| 金剛築基 | `golden-body-inner` | 金剛流 | 金剛流核心內功，提供普攻傷害。 |
| 追風吐納 | `swift-wind-inner` | 追風流 | 追風流核心內功，提供普攻傷害。 |
| 赤炎引氣 | `scarlet-flame-inner` | 赤炎流 | 赤炎流核心內功，提供普攻傷害。 |
| 寒水養氣 | `frost-water-inner` | 寒水流 | 寒水流核心內功，提供普攻傷害。 |
| 厚土納元 | `earth-mountain-inner` | 厚土流 | 厚土流核心內功，提供普攻傷害。 |
| 太虛養神 | `void-spirit-inner` | 太虛流 | 太虛流核心內功，提供普攻傷害。 |

### 2. 傷害型外功（9 項）

> 共同特徵：`target: 'target'`，主動施放、指定敵方目標、造成技能傷害，並依功法等級計算傷害與內力消耗。

| 功法名稱 | ID | 所屬 | 主要作用 |
| :--- | :--- | :--- | :--- |
| 破空掌 | `sky-breaking-palm` | 基礎功法 | 對相鄰單一敵人造成技能傷害。 |
| 金剛拳 | `golden-body-external-damage` | 金剛流 | 金剛流傷害型外功。 |
| 追風腿 | `swift-wind-external-damage` | 追風流 | 追風流傷害型外功。 |
| 炎火掌 | `scarlet-flame-external-damage` | 赤炎流 | 赤炎流傷害型外功。 |
| 寒水掌 | `frost-water-external-damage` | 寒水流 | 寒水流傷害型外功。 |
| 裂地拳 | `earth-mountain-external-damage` | 厚土流 | 厚土流傷害型外功。 |
| 靈犀指 | `void-spirit-external-damage` | 太虛流 | 太虛流傷害型外功。 |
| 赤炎流·燎原 | `scarlet-flame-external-functional` | 赤炎流 | 指定目標施加燃燒 Debuff。 |
| 寒水流·凝霜 | `frost-water-external-functional` | 寒水流 | 指定目標施加寒毒 Debuff。 |

### 3. 靈氣型外功（19 項）

> 共同特徵：以 `self` 為作用對象，**開啓／關閉功法直接決定是否擁有靈氣 Buff**；開啟即時、關閉即移除，不透過再次使用外功來啟動；Buff 效果需與功法等級掛鉤。

#### 3.1 門派靈氣型外功（6 項，屬性/功能型）

| 功法名稱 | ID | 所屬 | 對應效果 |
| :--- | :--- | :--- | :--- |
| 金剛流·暴擊強化 | `golden-body-external-functional` | 金剛流 | 暴擊率強化。 |
| 追風流·疾行 | `swift-wind-external-functional` | 追風流 | **追風攻勢**：普通攻擊體力消耗 −2（常駐 Buff，最低消耗 1 點）。 |
| 厚土流·反震 | `earth-mountain-external-functional` | 厚土流 | 反震傷害。 |
| 太虛流·迴氣（悟道） | `void-spirit-external-functional` | 太虛流 | **迴氣悟道**：開啟後所有功法經驗獲得 +20%（常駐 Buff）。 |

> 赤炎流·燎原與寒水流·凝霜目前仍屬需指定敵方目標的功能效果，實作分類應在後續修正為**傷害型外功**，而非靈氣型外功。此處先依現有目錄的 `functionalEffect` 保留，避免遺漏現行功法。

#### 3.1.1 門派靈氣型外功（6 項，地形機動型，原強化型外功）

> 原「強化型外功」中的門派輕功類功法改為**常駐靈氣 Buff** 形式：開啟即可使對應地形移動消耗 −2（最低 1），不再透過施放附加短期 Buff。

| 功法名稱 | ID | 所屬 | 對應效果 |
| :--- | :--- | :--- | :--- |
| 破壁功 | `golden-body-external-light-foot` | 金剛流 | 牆壁移動消耗 −2（最低 1）。 |
| 林間步 | `swift-wind-external-light-foot` | 追風流 | 森林移動消耗 −2（最低 1）。 |
| 踏沙功 | `scarlet-flame-external-light-foot` | 赤炎流 | 荒漠移動消耗 −2（最低 1）。 |
| 踏水功 | `frost-water-external-light-foot` | 寒水流 | 水域移動消耗 −2（最低 1）。 |
| 登山功 | `earth-mountain-external-light-foot` | 厚土流 | 山嶽移動消耗 −2（最低 1）。 |
| 草上飛 | `void-spirit-external-light-foot` | 太虛流 | 草地移動消耗 −2（最低 1）。 |

#### 3.2 江湖靈氣型外功（9 項）

| 功法名稱 | ID | 對應 Buff | 主要作用 |
| :--- | :--- | :--- | :--- |
| 血飲功 | `jianghu-bloodthirst` | 嗜血 | 造成傷害時回復生命。 |
| 鐵壁功 | `jianghu-iron-wall` | 鐵壁訣 | 受到傷害時減少最終傷害。 |
| 化氣功 | `jianghu-qi-transformation` | 化氣訣 | 依最大內力回復生命。 |
| 汲元功 | `jianghu-inner-power-drain` | 汲元 | 造成傷害時回復內力。 |
| 破軍功 | `jianghu-break-army` | 破軍訣 | 普通攻擊傷害提升。 |
| 罡氣功 | `jianghu-vigor` | 罡氣訣 | 外功傷害提升。 |
| 背水功 | `jianghu-back-to-water` | 背水 | 低生命時強化五維。 |
| 養氣功 | `jianghu-nurture-qi` | 養氣 | 高生命時強化五維。 |
| 孤注功 | `jianghu-all-in` | 孤注 | 極端低生命時大幅強化五維。 |

### 4. 強化型外功（1 項）

> 強化型外功是所有 `target` 為 `self` 類別的**主動型外功技能**，主動施放後對自身產生效果，**無常駐靈氣 Buff**；目前不支援等級掛鉤。

| 功法名稱 | ID | 所屬 | 對應效果 |
| :--- | :--- | :--- | :--- |
| 回春功 | `jianghu-spring-return` | 江湖 | **主動施放**：回復自身 20% 血量。 |

### 分類備註與後續修正界線

- **內功**：只負責普攻與內功本身的常駐效果，不應改成靈氣型外功。
- **傷害型外功**：只要需要指定敵方對象，即使實際效果是施加 Debuff，也應歸入此類；因此赤炎流·燎原、寒水流·凝霜、後續的奇門惑心術、知己知彼都應依此規則處理。
- **靈氣型外功**：開啓／關閉功法直接決定是否擁有靈氣 Buff；開啟即時生效、關閉即移除，不透過再次施放來啟動。目前含江湖九功法、門派功能型（暴擊強化/疾行/反震/迴氣），以及門派地形機動型功法（破壁功等六項輕功）。
- **強化型外功**：所有 `target` 為 `self` 類別的主動施放型外功，施放後對自身產生效果、不使用常駐靈氣 Buff。目前含回春功（主動施放回復自身 20% 血量）。
- **目前文件中的草案功法**：太虛引氣訣、四兩千斤訣、天眼望氣訣、神行八卦步、靈植百草鑑、天工開物卷、商道通鑑尚未存在於現行遊戲目錄，應於後續開發時依上述分類新增，不應混入「現有功法」清單。

---

## 三、系統架構評估與實作影響

### 3.1 功法資料結構擴充（`SkillDefinition`）
- 新增非戰鬥 / 輔助型功法標記：`category?: 'combat' | 'exploration' | 'management' | 'utility'`
- 新增需求門檻檢查：`requiredInsight?: number`、`requiredAgility?: number`
- 新增地圖主動技能觸發器：`explorationActionId?: string`
- **等級掛鉤規範（Level Scaling）**：所有 Buff 數值皆需支援功法等級（`Lv`）動態計算，公式統一於 `playerDerivedRules.ts` / `combatActions.ts` 中套用。常見公式模式：
  - **線性成長**：`base + Lv × step`（如 `staminaToInnerPowerRatio: 2 + Lv`）。
  - **百分比成長**：`base% + Lv × step%`（如 `lifestealPercent: 0.15 + Lv × 0.02`）。
  - **條件乘算成長**：`conditional.multiplier: base + Lv × step`（如背水功 `1.25 + Lv × 0.05`）。
  - **取整函數**：使用 `floor(Lv / divisor)` 控制成長曲線斜率（如持續回合、視野半徑）。
- **Buff 機制擴充（`buffCatalog.ts`）**：
  > **重要規範**：所有新增 Buff 皆需支援等級掛鉤（Level Scaling），數值由功法等級（`Lv`）動態計算，公式統一於 `playerDerivedRules.ts` / `combatActions.ts` 中套用。
  - 新增《太虛引氣訣》常駐 Buff `taixu-qi-conversion`（引氣歸元）：定義 `staminaToInnerPowerRatio: (2 + Lv)`，由回合結束結算模組（`turnActions.ts` / `playerRules.ts`）讀取生效。
  - 新增《四兩千斤訣》常駐 Buff `four-ounces-thousand-pounds`（四兩撥千斤）：定義 `externalSkillInnerCostReduction: 1` 與 `insightTrueDamageMultiplier: (0.4 + Lv × 0.05)`，由戰鬥計算與外功施放模組（`combatActions.ts` / `skillRules.ts`）讀取生效。
  - 新增《天眼望氣訣》常駐 Buff `sky-eye-vision`（天眼望氣）：定義 `visionRadiusBonus: ceil(Lv / 3)`，由戰爭迷霧與視野計算模組（`fogOfWarRules.ts` / `playerDerivedRules.ts`）讀取生效。
  - 新增《神行八卦步》常駐 Buff `divine-movement-eight-trigrams`（神行八卦）：定義 `maxStaminaBonus: (2 + Lv)`，由玩家衍生數值與最大體力計算模組（`playerDerivedRules.ts`）讀取生效。
  - 新增《靈植百草鑑》常駐 Buff `spirit-herb-hundred-grass`（靈植百草）：定義 `gatherStaminaCostReduction: (1 + floor(Lv / 2))` 與 `gatherDoubleYieldChance: (0.5 + Lv × 0.05)`，由大地圖採集與資源點互動模組（`explorationActions.ts` / `gatherRules.ts`）讀取生效。
  - 新增《天工開物卷》常駐 Buff `heavenly-craftsman`（天工開物）：定義 `buildingMaterialCostReduction: (0.25 + Lv × 0.05)` 與 `buildingReputationBonus: (0.5 + Lv × 0.1)`，由據點建造與升級模組（`buildingActions.ts` / `buildingProgressionRules.ts`）讀取生效。
  - 新增《商道通鑑》常駐 Buff `merchant-way`（商道通鑑）：定義 `shopBuyPriceDiscount: (0.15 + Lv × 0.03)`、`shopSellPriceBonus: (0.15 + Lv × 0.03)` 與 `questRewardBonus: (0.3 + Lv × 0.05)`，由商店交易與任務獎勵模組（`shopRules.ts` / `questRules.ts`）讀取生效。
  - 新增《奇門惑心術》敵方 Debuff `confusion-maze`（惑心）：定義 `confused: true`、持續回合 `(1 + floor(Lv / 2))`，由怪物行動邏輯模組（`creatureActions.ts` / `aiRules.ts`）讀取生效，持有此 Debuff 的怪物本回合跳過攻擊並隨機移動。
  - 新增《知己知彼》敵方 Debuff `weakness-mark`（洞察弱點）：定義 `damageTakenFromAlliesBonus: (0.2 + Lv × 0.05)`、持續回合 `(2 + floor(Lv / 2))`，由戰鬥傷害計算模組（`combatActions.ts` / `creatureDamageRules.ts`）讀取生效，使全隊及防禦塔對該目標造成額外傷害。
  - 新增《太虛流·迴氣》常駐 Buff `void-spirit-return-qi`（迴氣悟道）：定義 `skillExpGainPercent: (0.2 + Lv × 0.02)`，由功法經驗結算模組（`skillRules.ts` / `playerRules.ts`）讀取生效，開啟後所有功法經驗獲得 +20%。
  - **江湖散修外功常駐 Buff 擴充（效果為原數值 50%，且支援等級掛鉤）**：
    - 《血飲功》Buff `bloodthirst-persistent`（嗜血·常駐）：`lifestealPercent: (0.15 + Lv × 0.02)`（原 0.3）。
    - 《鐵壁功》Buff `iron-wall-persistent`（鐵壁訣·常駐）：`damageReductionPercent: (0.1 + Lv × 0.02)`（原 0.2）。
    - 《化氣功》Buff `qi-transformation-persistent`（化氣訣·常駐）：`innerPowerHealthRegenPercent: (0.05 + Lv × 0.01)`（原 0.1）。
    - 《汲元功》Buff `inner-power-leech-persistent`（汲元·常駐）：`innerPowerLeechPercent: (0.08 + Lv × 0.015)`（原 0.2）。
    - 《破軍功》Buff `break-army-persistent`（破軍訣·常駐）：`damageDealtPercent: (0.1 + Lv × 0.02)`（原 0.2）。
    - 《罡氣功》Buff `vigor-persistent`（罡氣訣·常駐）：`externalSkillDamagePercent: (0.1 + Lv × 0.02)`（原 0.2）。
    - 《背水功》Buff `back-to-water-persistent`（背水·常駐）：`conditional: { when: 'health-below', threshold: 0.3, multiplier: (1.25 + Lv × 0.05) }`（原 1.5）。
    - 《養氣功》Buff `nurture-qi-persistent`（養氣·常駐）：`conditional: { when: 'health-above', threshold: 0.8, multiplier: (1.1 + Lv × 0.05) }`（原 1.2）。
    - 《孤注功》Buff `all-in-persistent`（孤注·常駐）：`conditional: { when: 'health-below', threshold: 0.15, multiplier: (1.5 + Lv × 0.1) }`（原 2.0）。

### 3.2 遊戲循環擴充點
1. **回合結束結算（`endTurn` / `tickPlayerBuffs`）**：讀取玩家生效 Buff（如「引氣歸元」），結算剩餘體力自動轉化為內力。
2. **戰鬥與外功施放（`combatActions.ts` / `skillRules.ts`）**：讀取玩家生效 Buff（如「四兩撥千斤」），外功內力消耗減免並附加基於悟性的真實傷害。
3. **迷霧與視野計算（`fogOfWarRules.ts` / `playerDerivedRules.ts`）**：讀取玩家生效 Buff（如「天眼望氣」），動態提升角色視野半徑 $+1$。
4. **體力上限計算（`playerDerivedRules.ts`）**：讀取玩家生效 Buff（如「神行八卦」），動態提升角色最大體力上限 $+2$。
5. **大地圖採集與資源互動（`explorationActions.ts` / `gatherRules.ts`）**：讀取玩家生效 Buff（如「靈植百草」），降低採集體力消耗並提高雙倍產出機率。
6. **據點建造與升級（`buildingActions.ts` / `buildingProgressionRules.ts`）**：讀取玩家生效 Buff（如「天工開物」），計算建造花費時減少材料消耗並提高門派聲望獲得。
7. **商店交易與任務獎勵（`shopRules.ts` / `questRules.ts`）**：讀取玩家生效 Buff（如「商道通鑑」），調整買賣價格與任務獎金倍率。
8. **怪物行動邏輯（`creatureActions.ts` / `aiRules.ts`）**：讀取怪物身上生效 Debuff（如「惑心」），控制迷惘狀態下的隨機移動行為。
9. **戰鬥傷害計算（`combatActions.ts` / `creatureDamageRules.ts`）**：讀取怪物身上生效 Debuff（如「洞察弱點」），動態提升全隊與防禦塔對該目標的傷害輸出。
10. **據點操作（`BasePanel` / `buildingProgressionRules`）**：計算建造花費時納入功法被動加成。

---

## 四、待討論與確認事項（Discussion Topics）

1. **功法定位（已確定）**：
   - 本次新增的 9 個非戰鬥／輔助功法，**一律歸類為「靈氣型外功」（`ExternalSkill`）**，佔用既有外功格位，不額外設立獨立格位。
   - 因此這些功法的 Buff 皆需支援等級掛鉤（Level Scaling）。
2. **第一階段優先試作項目**：
   - 建議挑選 2～3 個最能改善痛點的功法進行第一批試點（例如：1 個探索驅霧、1 個內力循環、1 個採集/經營）。
3. **數值平衡與獲取途徑**：
   - 這些功法是從商店購買、特定劇情/事件習得，還是初始門派傳授？

---

## 附錄：現行遊戲內與 Buff 相關之既有外功功法清單

為了確保新設計與既有功法庫的協調性，以下整理目前遊戲中（`functionalSkillRegistry.ts` / `buffCatalog.ts`）已實裝、與 Buff 相關的外功功法：

### 1. 門派靈氣型外功（武館 Lv 3，消耗 6 內力）
> 以下效果皆隨武館等級動態成長。

| 功法名稱 | 門派 | 目標 | 對應 Buff | 效果與持續時間 |
| :--- | :--- | :--- | :--- | :--- |
| **金剛流·暴擊強化** | 金剛流 | 自身 (`self`) | 暴擊強化 | 自身暴擊率 $\times (2 + Lv \times 0.1)$（持續 2 回合） |
| **追風流·疾行** | 追風流 | 自身 (`self`) | 疾行 | 所有地形移動消耗視為 $2 - \lfloor Lv / 5 \rfloor$（最低 1，持續 2 回合） |
| **厚土流·反震** | 厚土流 | 自身 (`self`) | 反震 | 受到傷害時反彈 $(100% + Lv \times 5%)$ 同等傷害（持續 3 回合） |
| **赤炎流·燎原** | 赤炎流 | 目標 (`target`) | 燃燒 *(Debuff)* | 使目標每回合損失最大生命 $(20% + Lv \times 2%)$（持續 3 回合） |
| **寒水流·凝霜** | 寒水流 | 目標 (`target`) | 寒毒 *(Debuff)* | 使目標五維基本屬性降低 $(20% + Lv \times 2%)$（持續 2 回合） |
| **太虛流·迴氣（悟道）**| 太虛流 | 自身 (`self`) | 迴氣悟道 | 開啟後所有功法經驗獲得 +20%（常駐 Buff） |

### 2. 門派專屬地形機動型外功（武館 Lv 3；原強化型外功）
> 以下全部改為**常駐靈氣 Buff** 形式，開啟功法即對應地形移動消耗 −2（最低 1）。

| 功法名稱 | 門派 | 對應靈氣 | 對應效果（常駐） |
| :--- | :--- | :--- | :--- |
| **破壁功** | 金剛流 | 破壁 | 牆壁移動消耗 −2（最低 1）。 |
| **林間步** | 追風流 | 林行 | 森林移動消耗 −2（最低 1）。 |
| **踏沙功** | 赤炎流 | 沙行 | 荒漠移動消耗 −2（最低 1）。 |
| **踏水功** | 寒水流 | 水行 | 水域移動消耗 −2（最低 1）。 |
| **登山功** | 厚土流 | 山行 | 山嶽移動消耗 −2（最低 1）。 |
| **草上飛** | 太虛流 | 草行 | 草地移動消耗 −2（最低 1）。 |

### 3. 江湖靈氣型外功（無門派限制，消耗 5 內力）
> 以下全部改為**常駐 Buff** 形式，開啟功法即永久生效，效果數值調降為原來的 50%，且**支援等級掛鉤成長**。回春功已改歸為**強化型外功**（主動施放回復自身 20% 血量），不在下列清單中。

| 功法名稱 | 類別 | 對應 Buff | 核心效果（常駐 / 已調降 / 等級掛鉤） |
| :--- | :--- | :--- | :--- |
| **《血飲功》** | 資源轉換 | 嗜血 | 造成傷害時回復 `(15% + Lv × 2%)` 傷害值的生命（原 30%） |
| **《鐵壁功》** | 減傷防禦 | 鐵壁訣 | 受到傷害時，最終傷害 `-(10% + Lv × 2%)`（原 -20%） |
| **《化氣功》** | 週期回復 | 化氣訣 | 每回合回復「最大內力 $\times (5% + Lv × 1%)$」的氣血（原 10%） |
| **《汲元功》** | 資源轉換 | 汲元 | 造成傷害時回復 `(10% + Lv × 2%)` 傷害值的內力（原 20%） |
| **《破軍功》** | 輸出增益 | 破軍訣 | 普通攻擊造成的最終傷害 `+(10% + Lv × 2%)`（原 +20%） |
| **《罡氣功》** | 輸出增益 | 罡氣訣 | 外功造成的最終傷害 `+(10% + Lv × 2%)`（原 +20%） |
| **《背水功》** | 條件爆發 | 背水 | 生命低於 30% 時，五維屬性 $\times (1.25 + Lv × 0.05)$（原 ×1.5） |
| **《養氣功》** | 條件增益 | 養氣 | 生命高於 80% 時，五維屬性 $\times (1.1 + Lv × 0.05)$（原 ×1.2） |
| **《孤注功》** | 條件爆發 | 孤注 | 生命低於 15% 時，五維屬性 $\times (1.5 + Lv × 0.1)$（原 ×2.0） |

---

## 附錄二：開發可行性評估（Code Feasibility Analysis）

**評估日期**：2026-08-23
**結論**：方案整體可行，但分為三種難度等級；關鍵瓶頸在「內功 Buff 等級掛鉤」與「非戰鬥功法格位定位」兩處需先決策。

### 1. 已具備之基礎（可直接複用）

| 現有機制 | 位置 | 可否直接支撐新設計 |
| :--- | :--- | :--- |
| Buff 目錄與實例分離 | `buffCatalog.ts` + `BuffInstance` | ✅ 是 |
| 常駐 Buff（`duration: 'persistent'`） | `buffCatalog.ts` | ✅ 是（幻影步需改 persistent） |
| 等級掛鉤（`scaledPercent`） | `functionalSkillScaling.ts` | ⚠️ 僅覆蓋功能型外功 |
| 內功 Buff 注入 | `getInnerSkillBuffs`（`playerDerivedRules.ts`） | ⚠️ 無等級掛鉤 |
| 功法等級系統 | `skillRules.ts` 之 `getSkillProgression` | ✅ 已存在 |
| 敵方 Debuff（燃燒/寒毒/定身） | `buffCatalog.ts` | ✅ 部分可參考 |

**關鍵發現**：`getPlayerVisionRange` 目前是空殼（參數被 `void` 掉、固定回傳 `DEFAULT_VISION_RANGE = 3`），已預留擴充口，視野 Buff 最容易接入。

### 2. 需新增之 Buff 屬性欄位（中等工作量）

每個新屬性需同步改動 4 處：`BuffDefinition` 型別、`BuffInstance` 型別、`getEffectiveBuffDefinition` 覆寫白名單、實際結算邏輯。

| 新屬性 | 對應功法 | 難度 | 備註 |
| :--- | :--- | :--- | :--- |
| `staminaToInnerPowerRatio` | 太虛引氣訣 | 🟡 中 | 需在 `tickPlayerBuffs`/`endTurn` 加結算 |
| `externalSkillInnerCostReduction` | 四兩千斤訣 | 🟢 低 | `getSkillInnerPowerCost` 減 1 |
| `insightTrueDamageMultiplier` | 四兩千斤訣（真實傷害） | 🔴 高 | 目前無「真實傷害」概念，需新開傷害通道 |
| `visionRadiusBonus` | 天眼望氣訣 | 🟢 低 | `getPlayerVisionRange` 已留口 |
| `maxStaminaBonus` | 神行八卦步 | 🟡 中 | `getMaxStamina` 僅看屬性，需加 Buff 加算 |
| `gatherStaminaCostReduction` | 靈植百草鑑 | 🟡 中 | 採集邏輯需接 Buff |
| `gatherDoubleYieldChance` | 靈植百草鑑 | 🟡 中 | 需機率判定 |
| `buildingMaterialCostReduction` | 天工開物卷 | 🟡 中 | `buildingProgressionRules` 已有全局加成可仿照 |
| `buildingReputationBonus` | 天工開物卷 | 🟡 中 | 同上 |
| `confused`（迷惘） | 奇門惑心術 | 🔴 高 | 現有 `immobilized` 僅跳過移動，無「隨機移動」AI |
| `damageTakenFromAlliesBonus` | 知己知彼 | 🟡 中 | 需在傷害結算加乘 |
| `skillExpGainPercent` | 太虛流·迴氣 | 🟢 低 | 功法經驗結算時乘算 |

### 3. 功法類型定位與等級掛鉤的關鍵缺口

**功法類型定位（已確定方向）**：

| 功法類型 | 原版定位 | 新版定位（本次設計） |
| :--- | :--- | :--- |
| **內功** | 普攻傷害 | 普攻傷害（維持不變） |
| **傷害型外功** | 技能傷害 | 技能傷害（維持不變） |
| **靈氣型外功** | 主動施放 → 施加 Buff（持續 N 回合） | **開啓／關閉功法決定靈氣 Buff**：開啟即時生效、關閉即移除，不再透過「使用外功」來啟動 Buff |

> 此為架構級的定位變更：靈氣型外功從「主動施放、短期 Buff」轉為「開啓／關閉功法決定靈氣 Buff」。因此所有原屬「靈氣型外功」的功法（含江湖散修外功、門派功能型外功）皆需改為 `duration: 'persistent'`，且 Buff 數值改為**開啟期間動態計算**，而非施放瞬間快照。

**等級掛鉤適用範圍（已確定）**：

| 外功類別 | 是否支援等級掛鉤 |
| :--- | :--- |
| 門派靈氣型外功：屬性/功能型（暴擊強化/疾行/反震/迴氣） | ✅ 支援（隨功法等級成長） |
| 門派靈氣型外功：地形機動型（破壁/林間步/踏沙等 6 項，原強化型外功） | ✅ 支援（隨功法等級成長；對應地形移動消耗 −2，最低 1） |
| 江湖靈氣型外功（血飲/鐵壁/化氣等 9 項） | ✅ 支援（隨功法等級成長） |

**等級掛鉤的兩個關鍵缺口**：

1. **內功 Buff 目前完全不掛等級**：`getInnerSkillBuffs` 僅把 `innerSkill.buffIds` 映射成 `remainingRounds: null` 的 Buff，未套用等級縮放。新設計中《太虛引氣訣》《四兩千斤訣》《天眼望氣訣》《神行八卦步》皆為「內功/常駐 Buff」，需新增「內功 Buff 等級掛鉤」機制（現有 `getFunctionalSkillBuffOverrides` 僅吃 `functionalEffect`，不吃內功）。

2. **靈氣型外功改常駐的實作影響（已確定方向）**：現行江湖外功為「施放時施加 3 回合 Buff」，等級掛鉤發生在施放瞬間（`combatActions.ts` 呼叫 `getFunctionalSkillBuffOverrides`）。改常駐後，掛鉤需改為「開啟期間持續計算」，即把 Buff 數值動態綁定到該功法當前等級，而非施放快照。實作上需將 Buff 的等級縮放邏輯從 `combatActions.ts`（施放路徑）遷移至 `playerDerivedRules.ts`（開啟期間的衍生數值計算路徑）。

### 4. 非戰鬥功法本質衝突（需先決策）

現有功法僅有 `InnerSkill` 與 `ExternalSkill` 兩類。本次新增的 9 個非戰鬥／輔助功法**已確定歸類為「靈氣型外功」（`ExternalSkill`）**，佔用既有外功格位（不新增 `UtilitySkill` 獨立格位）。

> 但因這些功法大多無傷害、無內力施放，仍有一項實作注意事項：現有 `ExternalSkill` 型別中 `calculateDamage`、`innerPowerCost` 為必填欄位，需將它們改為**可選欄位**（或為非戰鬥功法提供 `calculateDamage: () => 0`、`innerPowerCost: 0` 的預設值），否則會破壞型別約束。

- **方案 A**：新增第三類 `UtilitySkill`（獨立格位），最乾淨、工作量最大。
- **方案 B**：塞進現有 `ExternalSkill`，以 `category` + 可選欄位區分，快速但型別變髒。

> **本次採納方案 B**：新增功法皆為 `ExternalSkill`，以 `category` 標記區分（combat / exploration / management / utility），並將 `calculateDamage` / `innerPowerCost` 改為可選欄位。

### 5. 建議開發順序（風險由低到高）

| 階段 | 內容 | 理由 |
| :--- | :--- | :--- |
| ✅ 可直接做 | 幻影步改常駐、`visionRadiusBonus`、`externalSkillInnerCostReduction` | 已有明確擴充口、低風險 |
| 🟡 先做 | 江湖外功改常駐 + 數值減半（暫不掛等級） | 資料改動，邏輯影響可控 |
| 🟡 後做 | `maxStaminaBonus`、採集/建造/交易 Buff | 需新增屬性與結算點，單項不難 |
| 🔴 需設計 | 「真實傷害」、「迷惘（隨機移動 AI）」、「內功等級掛鉤」 | 目前無對應底層概念，需先補系統 |
| ⚠️ 先決策 | 非戰鬥功法格位定位 | 影響所有實作路徑 |

---

## 附錄三：實作進度追蹤（2026-08-24）

> 本節記錄依本文件逐步實作的進度，避免與「設計草案」混淆。設計責任仍以上方各節為準。

### 已完成實作 ✅

| 項目 | 對應功法 / Buff | 實作位置 | 說明 |
| :--- | :--- | :--- | :--- |
| 幻影步改常駐 | `phantom-step` | `buffCatalog.ts` | duration 改 `persistent` |
| 江湖外功改常駐＋數值減半＋等級掛鉤 | 血飲/鐵壁/化氣/汲元/破軍/罡氣/背水/養氣/孤注 | `functionalSkillScaling.ts` | 加法式公式（Lv.1 = 減半值） |
| 天眼望氣 | buff `sky-eye-vision` / effect `vision-expansion` | 新 `insightUtilityExternalSkillCatalog.ts` + `visibilityRules.ts` | 視野半徑 +ceil(Lv/3) |
| 四兩撥千斤 | buff `four-ounces-thousand-pounds` / effect `skill-cost-reduction` | `insightUtilityExternalSkillCatalog.ts` + `combatActions.ts` | 外功內力消耗 -1 |
| 商道通鑑 | buff `merchant-way` / effect `merchant-way` | `insightUtilityExternalSkillCatalog.ts` + `shopRules.ts` | 買價 -15%、賣價 +15%（+3%/級） |
| 天工開物卷 | buff `heavenly-craftsman` / effect `craftsmanship` | `insightUtilityExternalSkillCatalog.ts` + `buildingProgressionRules.ts` `buildingActions.ts` | 材料 -25%（+5%/級） |
| 靈植百草鑑 | buff `spirit-herb-hundred-grass` / effect `gathering` | `insightUtilityExternalSkillCatalog.ts` + `explorationActions.ts` | 採集省體力、雙倍產出 |
| 神行八卦步 | buff `divine-movement-eight-trigrams` / effect `divine-movement` | `insightUtilityExternalSkillCatalog.ts` + `playerRules.ts` | 最大體力 +2（+1/級） |
| 太虛引氣 | buff `taixu-qi-conversion` / effect `qi-conversion` | `insightUtilityExternalSkillCatalog.ts` + `playerRules.ts` | 剩餘體力→內力（2+級） |

### 中風險：待開發（🟡）

| 功法 | Buff 欄位 | 消費點 |
| :--- | :--- | :--- |
| （上述 5 項已全部完成） | — | — |

### 高難度：本次不實作（🔴 需先補底層系統）

| 項目 | 對應 | 原因 |
| :--- | :--- | :--- |
| 真實傷害 | 四兩千斤 `insightTrueDamageMultiplier` | 目前無「真實傷害」傷害通道，需新開 |
| 迷惘（隨機移動 AI） | `confused` / 奇門惑心術 | 現有 `immobilized` 僅跳過移動，無隨機移動 AI |
| 內功等級掛鉤 | 太虛引氣等內功 Buff | `getFunctionalSkillBuffOverrides` 不吃內功，需補內功等級掛鉤機制 |
