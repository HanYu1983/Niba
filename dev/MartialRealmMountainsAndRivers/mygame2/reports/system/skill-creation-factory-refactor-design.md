# 功法統一創建入口重構設計文件

**文件日期**：2026-08-24  
**文件狀態**：設計階段，尚未實作  
**目標模組**：功法目錄、功法分類、Buff 綁定、功法施放資料

---

## 一、重構背景與問題定義

### 1.1 現況問題

目前功法資料主要直接以 `InnerSkill`、`ExternalSkill` 物件建立，造成以下問題：

1. 不同功法目錄重複撰寫相同預設欄位。
2. `target`、`category`、`innerPowerCost` 與效果欄位可能互相矛盾。
3. 新增功法時，開發者必須自行記憶每一種類型的必要欄位與限制。
4. `createJianghuSkill` 只服務江湖功法，無法成為所有功法的通用入口。
5. 地形輕功、常駐靈氣與主動強化效果目前容易混淆。
6. `functionalEffect`、`passiveBuffIds` 與實際功法類型之間缺乏單一驗證入口。

### 1.2 重構目標

建立四個具名的功法創建方法，統一處理功法資料建立：

- `createInnerSkill`
- `createDamageExternalSkill`
- `createAuraExternalSkill`
- `createEnhancementExternalSkill`

重構必須達成：

- 新功法優先透過對應 Factory 建立。
- 每種功法類型具有明確必要欄位。
- 類型預設值集中處理。
- 不改變現有功法的遊戲規則與公開資料格式，除非另有確認。
- Factory 只負責資料建立與靜態驗證，不負責戰鬥、治療、裝備或回合結算。

---

## 二、四種類型定義

### 2.1 內功

| 項目 | 規則 |
| :--- | :--- |
| 回傳型別 | `InnerSkill` |
| 目標 | 不指定目標 |
| 內力消耗 | 不適用；若底層欄位保留，固定為 0 或不暴露 |
| 主要效果 | 提供普攻傷害公式，可選擇掛載常駐 Buff |
| 必要輸入 | 基本資料、`calculateDamage` |
| 禁止情境 | 指定敵方目標、主動施放效果、外功內力消耗 |

### 2.2 傷害型外功

| 項目 | 規則 |
| :--- | :--- |
| 回傳型別 | `ExternalSkill` |
| `category` | `'damage'` |
| `target` | `'target'` |
| 內力消耗 | 必須大於 0 |
| 主要效果 | 技能傷害或指定敵方 Debuff |
| 必要輸入 | 基本資料、`innerPowerCost`、`calculateDamage` |
| 禁止情境 | 常駐自身 Buff、無目標施放 |

需要指定敵方目標的功能型功法，即使主要效果是燃燒、寒毒或其他 Debuff，也必須使用此入口。

### 2.3 靈氣型外功

| 項目 | 規則 |
| :--- | :--- |
| 回傳型別 | `ExternalSkill` |
| `category` | `'aura'` |
| `target` | `'self'` |
| 內力消耗 | 固定為 0 |
| 主要效果 | 開啟後常駐生效，關閉後移除 |
| 必要輸入 | 基本資料、至少一個 `passiveBuffId` 或結構化靈氣效果 |
| 啟動方式 | 裝備／開啟功法，不透過主動施放 |
| 禁止情境 | 指定敵方目標、一次性治療、短期主動效果 |

六項地形機動功法歸入靈氣型外功。它們不是獨立的第四種地形功法類型，而是靈氣型外功的效果子類型。

地形效果統一描述為：

- 對應地形移動消耗 `-2`
- 最低消耗為 `1`
- 開啟功法後常駐生效
- 關閉功法後立即移除

### 2.4 強化型外功

| 項目 | 規則 |
| :--- | :--- |
| 回傳型別 | `ExternalSkill` |
| `category` | `'enhancement'` |
| `target` | `'self'` |
| 內力消耗 | 由功法資料明確指定，通常大於 0 |
| 主要效果 | **直接施放、直接完成**，立即作用於自身 |
| 必要輸入 | 基本資料、`innerPowerCost`、主動效果描述 |
| 冷卻 | **無冷卻**：直接施放、立即完成 |
| 體力消耗 | **不消耗體力** |
| 進度 | **立即完成一次效果後即結束**，不產生持續 Buff |
| 禁止情境 | 冷卻機制、體力消耗、常駐 `passiveBuffIds`、指定敵方目標 |

目前確認的第一個功法為：

- 回春功：直接施放，回復自身最大生命的 20%，無冷卻、不消耗體力。

回春功屬於一次性主動效果，不應使用 `health-regen` 常駐 Buff，也不應加冷卻或體力成本。

---

## 三、建議模組與 API 邊界

### 3.1 新增模組

建議新增：

```text
src/game/catalogs/skillFactory.ts
```

模組責任：

- 建立共用功法基本資料。
- 套用四種類型的固定欄位。
- 將簡化輸入轉為既有 `InnerSkill`／`ExternalSkill` 結構。
- 驗證類型必要欄位與互斥欄位。
- 提供穩定的資料創建入口。

模組不負責：

- 功法學習。
- 功法裝備或開關。
- 功法施放。
- 傷害、治療或 Buff 結算。
- 功法經驗增加。
- React UI 狀態。

### 3.2 對外入口

```text
createInnerSkill(input): InnerSkill
createDamageExternalSkill(input): ExternalSkill
createAuraExternalSkill(input): ExternalSkill
createEnhancementExternalSkill(input): ExternalSkill
```

建議不對外暴露一個包含大量可選欄位的萬用 `createSkill`。四個具名入口可以讓 TypeScript 在編譯階段協助限制輸入，降低建立錯誤。

### 3.3 內部共用流程

```text
createXXXSkill(input)
  → 建立共用 metadata
  → 套用類型固定欄位
  → 建立效果欄位
  → 執行類型驗證
  → 回傳標準功法資料
```

---

## 四、輸入資料設計

### 4.1 共用基本資料

四種類型可共用以下基本欄位：

- `id`
- `name`
- `description`
- `insightCost`
- `requiredHallLevel`
- `school?`
- `schoolId?`
- `element?`
- `level?`

`formulaDescription` 是否由 Factory 自動生成，需要在實作前確認。第一階段建議保留明確輸入，避免改變現有 UI 顯示文字。

### 4.2 內功輸入

```text
InnerSkillCreateInput
├── metadata
├── formulaDescription
├── insightRequirement
├── buffIds?
└── calculateDamage
```

### 4.3 傷害型外功輸入

```text
DamageExternalSkillCreateInput
├── metadata
├── formulaDescription
├── insightCost
├── requiredHallLevel
├── innerPowerCost
├── school?
├── schoolId?
├── element?
├── level?
├── range?
├── functionalEffect?
└── calculateDamage
```

Factory 固定補上：

```text
category: 'damage'
target: 'target'
```

### 4.4 靈氣型外功輸入

```text
AuraExternalSkillCreateInput
├── metadata
├── formulaDescription
├── insightCost
├── requiredHallLevel
├── school?
├── schoolId?
├── element?
├── level?
├── functionalEffect?
├── passiveBuffIds?
└── auraEffect?
```

`passiveBuffIds` 與 `functionalEffect` 二者至少應提供一種可解析的效果來源。若採用結構化地形效果，則 `auraEffect` 也可作為合法效果來源。

### 4.5 強化型外功輸入

```text
EnhancementExternalSkillCreateInput
├── metadata
├── formulaDescription
├── insightCost
├── requiredHallLevel
├── innerPowerCost
├── school?
├── schoolId?
├── element?
├── level?
├── activationEffect
└── calculateDamage?
```

第一階段的主動效果建議採結構化資料：

```text
activationEffect: {
  kind: 'heal-self-percent',
  percent: 0.2
}
```

此資料只描述功法效果，不代表 Factory 執行治療。實際治療仍由 action/rule 層執行。

---

## 五、效果模型設計

### 5.1 為何不繼續擴張 `functionalEffect`

`functionalEffect` 適合描述既有功能型外功的 registry key，但不適合作為所有效果的唯一模型，原因如下：

- 靈氣效果與主動效果的生命週期不同。
- 回春功不是常駐 Buff。
- 地形移動效果需要額外描述地形、減少數值與最低值。
- 主動治療、清除 Debuff、短期屬性提升不應偽裝成常駐 Buff。

因此建議採分層方式：

```text
functionalEffect：既有 registry 相容欄位
passiveBuffIds：常駐 Buff 綁定
activationEffect：強化型外功主動效果
terrainEffect：地形靈氣效果
```

### 5.2 建議的結構化效果

```text
EnhancementActivationEffect
├── heal-self-percent
├── heal-self-flat
├── apply-self-buff
└── cleanse-self
```

```text
AuraEffect
├── terrain-cost-reduction
├── passive-buff
└── skill-exp-gain
```

第一階段不需要一次實作所有 `kind`，但型別設計應保留擴充空間。

### 5.3 地形效果規則

地形靈氣效果需要具備：

- `terrain`
- `amount`
- `minimumCost`

目前回春功重構與地形功法重構可分開處理，避免把地形規則與主動治療規則耦合。

---

## 六、現有目錄遷移方案

### Phase 0：建立重構基線

**目標**：不改變遊戲行為。

- 固定目前功法數量與分類。
- 確認 `npm run build` 通過。
- 執行現有功法、Buff、技能規則測試。
- 記錄外部可觀察欄位與 UI 顯示文字。

### Phase 1：建立 Factory

**目標**：只新增 Factory 與型別，不遷移目錄。

- 建立 `skillFactory.ts`。
- 定義四種 Create Input。
- 定義基本 metadata builder。
- 加入類型驗證。
- 建立 Factory 單元測試。

### Phase 2：遷移不具特殊生命週期的功法

建議先遷移：

- `sky-breaking-palm`
- 江湖靈氣型外功
- 門派傷害型外功
- 門派靈氣型外功

此階段每次只遷移一類，確保行為與原資料一致。

### Phase 3：遷移地形機動型功法

將以下功法改用 `createAuraExternalSkill`：

- 破壁功
- 林間步
- 踏沙功
- 踏水功
- 登山功
- 草上飛

地形效果為：

```text
對應地形移動消耗 -2，最低 1
```

這一步需要同步確認現有移動規則是否能讀取常駐靈氣效果。

### Phase 4：新增並遷移回春功

回春功使用 `createEnhancementExternalSkill`：

- `target: 'self'`
- `category: 'enhancement'`
- 主動施放
- 回復自身最大生命 20%
- 無冷卻、不消耗體力
- 不掛載 `spring-return-persistent`
- 不使用每回合回復的常駐 Buff 邏輯

實作前仍須確認內力消耗與滿血施放規則。

### Phase 5：移除重複建立邏輯

- 將 `createJianghuSkill` 改為 Factory 的包裝器，或直接移除。
- 移除各 catalog 中重複的預設欄位。
- 確保所有新功法都經過統一入口。
- 保留 catalog 只負責排列與提供資料。

---

## 七、錯誤處理與例外情境

### 7.1 建立階段錯誤

Factory 應在資料不合法時立即失敗，錯誤訊息至少包含：

- 功法 ID
- Factory 類型
- 失敗欄位
- 違反的規則

### 7.2 必須拒絕的資料

| Factory | 應拒絕的情況 |
| :--- | :--- |
| 內功 | 缺少傷害公式、出現外功施放欄位、指定目標 |
| 傷害型外功 | `target !== 'target'`、內力消耗小於等於 0、缺少傷害公式 |
| 靈氣型外功 | `target !== 'self'`、內力消耗非 0、沒有常駐效果來源、帶主動施放效果 |
| 強化型外功 | `target !== 'self'`、缺少 `activationEffect`、帶常駐 `passiveBuffIds` |

### 7.3 例外情境

- 舊資料沒有 `category`：由兼容層推導，不應在 Factory 中默默改變分類。
- 舊資料使用 `light-foot`：遷移完成前保留解析能力；遷移完成後改為 `category: 'aura'` 加地形效果。
- `functionalEffect` 沒有 Buff binding：允許建立，但必須由資料驗證測試標記為需要補充效果。
- 功法效果需要指定敵方目標：不得使用 Aura 或 Enhancement Factory。
- 同一個 ID 被不同 Factory 建立：由 catalog 統一驗證時拒絕。

---

## 八、測試與驗收標準

### 8.1 Factory 單元測試

每個 Factory 至少測試：

- 可以建立合法資料。
- 自動套用正確 `category`。
- 自動套用正確 `target`。
- 自動套用正確內力消耗預設值。
- 缺少必要欄位時失敗。
- 違反類型規則時失敗。

### 8.2 分類驗證測試

驗證現有目錄：

- 所有內功通過 `createInnerSkill` 規則。
- 所有指定敵方的功法為 `category: 'damage'`。
- 所有常駐自身 Buff 功法為 `category: 'aura'`。
- 六項地形輕功為 Aura，而不是 Enhancement。
- 回春功為 Enhancement，而不是 Aura。

### 8.3 行為回歸測試

必須確認：

- 功法傷害不變。
- 內力消耗不變，除非設計明確修改。
- Buff 綁定 ID 不變，除非設計明確修改。
- 功法學習與掉落規則不變。
- 功法裝備與開關行為不變。
- 回春功只在主動施放時回復 20% 最大生命。
- 地形功法的消耗不低於 1。

### 8.4 建置與驗收

- `npm run build` 通過。
- `npm run test` 通過。
- Factory 測試通過。
- 功法分類總表與程式目錄數量一致。
- 不產生 circular dependency。
- Factory 不依賴 action、React 或 store 模組。

---

## 九、待確認事項與已確認決策

以下項目在開始實作前必須確認。已確認項目將標記為 ✅ 並記錄結論：

1. ✅ **`ExternalSkillCategory` 改為 `'damage' | 'aura' | 'enhancement'`**（已確認）。
   - `aura` 涵蓋原靈氣型外功與地形機動功法。
   - 底層 `category` 不再使用 `light-foot`。
2. ✅ **完全移除 `light-foot`**（已確認，隨決策 1）。
   - 六項地形輕功改用 `category: 'aura'`，並以 Aura 地形效果子類型描述：
     - 對應地形移動消耗 `-2`
     - 最低消耗 `1`
     - 開啟後常駐生效、關閉即移除
3. ⚪ **回春功的 `innerPowerCost`**（已定為非關鍵：由實作彈性決定，先設合理值如 2，未來可再調整）。
4. ✅ **回春功是否有冷卻時間**——**無冷卻**。強化型外功定義為「直接施放、立即完成」，不設冷卻。
5. ✅ **回春功是否消耗體力**——**不消耗體力**。強化型外功不消耗體力。
6. ⚪ **回春功是否允許滿血施放**——**允許**（已定為非關鍵）。
7. ✅ **回春功回復基準**——**最大生命的 20%**（已確認）。
8. ✅ **`formulaDescription` 是否由 Factory 自動產生**——**保留為明確輸入**。優點：保留現有 UI 顯示文案、不改變既有效果說明；全自動化會改動介面文字並增加猜測邏輯。
9. ✅ **`calculateDamage` 是否改為可選欄位**——**改為可選**。靈氣型、強化型本質無傷害，Factory 對未提供者補回預設 `() => 0`，避免非傷害功法被迫塞無意義函式。
10. ✅ **舊資料的 `functionalEffect` 是否保留為兼容欄位**——**保留**。遷移期間既有 registry 綁定仍需依賴此欄位，作為向後相容入口；新功法可改用結構化效果。
11. ✅ **靈氣型功法的 Buff 是否全部改為 `duration: 'persistent'`**——**全部改為 `persistent`**。呼應「開啟即常駐、關閉即移除」的氣場型外功定義；預設值由 Factory 的 `createAuraExternalSkill` 統一提供，避免各目錄逐筆手動設定。
12. ✅ **功法等級是否影響回氣 20% 回復量**——**不影響**。回春功回復量固定為最大生命 20%，不隨功法等級成長（維持欄位簡單、非關鍵數值）。

---

## 十、專案追蹤清單

| Task Item | Owner | Status | Priority | Deadline |
| :--- | :--- | :--- | :--- | :--- |
| 固定功法重構前測試基線 | Gameplay | Not Started | High | TBD |
| 定義四種 Create Input | Gameplay | Not Started | High | TBD |
| 建立 `skillFactory.ts` | Gameplay | Not Started | High | TBD |
| 建立 Factory 驗證錯誤格式 | Gameplay | Not Started | Medium | TBD |
| 遷移基礎傷害型外功 | Gameplay | Not Started | Medium | TBD |
| 遷移門派靈氣型外功 | Gameplay | Not Started | Medium | TBD |
| 遷移六項地形靈氣功法 | Gameplay | Not Started | Medium | TBD |
| 實作回春功強化型資料 | Gameplay | Not Started | High | TBD |
| 補上行為回歸測試 | QA / Gameplay | Not Started | High | TBD |
| 更新功法分類文件 | Design | Not Started | Medium | TBD |

---

## 十一、結論

本次重構採用以下原則：

1. 四種類型各自提供明確的創建方法。
2. 內部共用 Builder，對外避免萬用且充滿可選欄位的 `createSkill`。
3. 靈氣型外功負責常駐效果；強化型外功負責主動短期效果。
4. 地形輕功歸入靈氣型外功，地形只是效果子類型。
5. 回春功歸入強化型外功，使用主動治療效果，不使用常駐回復 Buff。
6. Factory 只處理資料建立與驗證，不侵入戰鬥、行動、Buff 或 UI 邏輯。
7. 先建立測試基線，再逐步遷移現有功法，避免一次性重構造成行為回歸。

本文件只描述重構設計與實作順序，未修改任何程式碼。
