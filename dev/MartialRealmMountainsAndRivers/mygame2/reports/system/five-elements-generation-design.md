# 五行相生連攜系統設計文件（Five Elements Generation Synergy System Design）

本文件規劃在既有「天地共鳴」與「五行相剋」基礎上，新增**五行相生連攜**機制：當裝備的內功元素生外功元素時，該外功獲得額外增益。

---

## 一、設計目標與原則

### 1.1 設計目標
- **強化功法搭配深度**：讓玩家在选择內功時，不僅考慮內功本身的傷害公式，還要考慮與已裝備外功的相生關係。
- **鼓勵流派切換策略**：玩家可以根據當前要使用的外功，切換對應相生的內功來獲得增益，形成動態戰術選擇。
- **維持低理解成本**：規則直覺明確——「內功生外功＝外功變強」。
- **純加法架構**：不破壞既有戰鬥結算、預覽彈窗、事件觸發邏輯。

### 1.2 設計哲學：內功為源，外功為用

| 維度 | 說明 |
| :--- | :--- |
| **內功（A）** | 運功之源，決定整體屬性與被動效果 |
| **外功（B）** | 攻擊之用，實際施放的傷害技能 |
| **相生連攜** | 當 A 生 B 時，B 獲得額外增益 |
| **戰術意義** | 根據當前要使用的外功，切換對應相生的內功 |

---

## 二、五行相生關係定義

### 2.1 相生循環

```
    ┌─────┐
    │ 金  │───────┐
    └─────┘       │
        ↑         ▼
    ┌─────┐   ┌─────┐
    │ 水  │   │ 土  │
    └─────┘   └─────┘
        ↑         │
        │         ▼
    ┌─────┐   ┌─────┐
    │ 木  │←──│ 火  │
    └─────┘   └─────┘
```

**相生順序**：金 → 土 → 水 → 木 → 火 → 金

### 2.2 連攜判定表

| 內功元素 A | 外功元素 B = ? | 觸發連攜 |
| :--- | :--- | :--- |
| **金** | 土 | ✅ 土系外功獲得增益 |
| **木** | 火 | ✅ 火系外功獲得增益 |
| **水** | 木 | ✅ 木系外功獲得增益 |
| **火** | 土 | ✅ 土系外功獲得增益 |
| **土** | 水 | ✅ 水系外功獲得增益 |

> **注意**：僅「內功元素生外功元素」觸發連攜。反向（外功生內功）不觸發。同屬性不觸發。太虛流不觸發。

---

## 三、連攜增益設計

### 3.1 增益內容

當內功 A 相生於外功 B 時，**外功 B 獲得以下增益**：

| 增益項目 | 數值 | 說明 |
| :--- | :--- | :--- |
| **傷害加成** | ×1.25（+25%） | 外功最終傷害提升 25% |
| **Buff ID** | `generation-synergy` | 用於 UI 顯示與未來擴充 |

### 3.2 增益計算時機

```
外功傷害計算流程：
  基礎傷害
  × 功法等級成長
  × 效果倍率（Buff）
  × 五行相剋倍率（如有）
  × 五行相生連攜倍率（如有） ← 此處
  × 天地共鳴倍率（如有）
  × 其他百分比加成（如罡氣訣）
  × 目標減傷率
```

### 3.3 多外功場景處理

玩家可同時裝備多個外功。連攜增益的判定方式：

- **每次施放外功時獨立判定**：檢查當前裝備的內功是否生「該外功」的元素。
- **未觸發連攜的外功不受影響**：僅被生的外功獲得 ×1.25 加成。
- **例**：內功為金 → 土系外功 ×1.25、木系外功 ×1（無連攜）。

### 3.4 與天地共鳴的疊乘

當連攜（×1.25）與天地共鳴（×1.25）同時觸發：

```
總倍率 = 1.25 × 1.25 = 1.5625
```

意即：在親和地形施放被內功所生的外功，可達到 **+56.25%** 傷害。

### 3.5 三重共振：連攜 + 共鳴 + 相剋

#### 3.5.1 觸發條件

當一次外功攻擊**同時滿足以下三個條件**時，觸發「三重共振」效果：

| 條件 | 說明 |
| :--- | :--- |
| **相生連攜** | 內功元素生外功元素（×1.25 傷害加成） |
| **天地共鳴** | 外功元素與站立地形親和（×1.25 傷害加成） |
| **五行相剋** | 外功元素克制目標門派元素（×1.25 傷害加成） |

```
總倍率 = 1.25 × 1.25 × 1.25 = 1.9531（約 ×1.95，接近雙倍傷害）
```

#### 3.5.2 額外效果：停止活動一回合

觸發三重共振時，對目標施加**「震懾」Buff**，使其**停止活動一個回合**。

| 項目 | 內容 |
| :--- | :--- |
| **Buff ID** | `stunned` |
| **持續時間** | 1 回合 |
| **效果** | 目標跳過該回合的所有行動（移動、攻擊、施功均無法執行） |
| **適用對象** | 生物（Creature），不適用於巢穴（Nest） |
| **顯示方式** | 目標頭像上顯示 ⚫ 標記，UI 提示「目標震懾中」 |

#### 3.5.3 視覺效果：地圖震動動畫

觸發三重共振時，在地圖上呈現**震動動畫**，讓玩家直覺感受到強大的衝擊力。

| 項目 | 內容 |
| :--- | :--- |
| **觸發時機** | `executeExternalDamage` 判定三重共振成立、傷害計算完成後立即播放 |
| **動畫對象** | 被攻擊的生物（Creature）所在格子及其周圍 3×3 區域 |
| **動畫類型** | 螢幕震動（Screen Shake）+ 目標震顫（Target Shake） |
| **震動強度** | 位移幅度 8px，持續 0.5 秒，呈衰減正弦波 |
| **粒子特效** | 震動期間在目標位置產生五行元素對應的粒子爆發（金=白/銀、木=綠、水=藍、火=紅、土=黃） |
| **音效建議** | 低沉轟鳴聲（Boom），頻率由低到高再驟降 |

##### 動畫規格

```
時間軸：
  0.00s ── 傷害數字浮現 + 粒子爆發 + 螢幕開始震動（振幅 8px）
  0.10s ── 振幅最大（8px）
  0.25s ── 振幅 4px
  0.35s ── 振幅 2px
  0.50s ── 震動停止，目標開始 ⚫ 震懾標記閃爍
              ↓
          戰鬥結果彈窗出現
```

> **時程設計原則**：震動動畫播放完畢後，才顯示戰鬥結果彈窗。兩者**不並行**。
> 三重共振觸發率約 10-15%，並不常見，因此 0.5 秒延遲不會干擾正常遊玩體驗。
> 相反地，先看到震撼的震動效果、再看到詳細結果，能增強「三重共振」的爽感與儀式感。

##### CSS / Canvas 實作方向

| 技術方案 | 說明 |
| :--- | :--- |
| **CSS transform: translate()** | 對地圖容器套用 `@keyframes shake` 動畫，透過 class 切換觸發 |
| **Canvas requestAnimationFrame** | 若使用 Canvas 渲染，於每幀根據衰減函數偏移繪製座標 |
| **粒子系統** | 使用既有粒子系統（若有）或簡化版粒子陣列，依元素屬性設定顏色與發射角度 |

##### 修改檔案清單（視覺效果相關）

| 檔案 | 變更內容 |
| :--- | :--- |
| `src/game/actions/combatActions.ts` | 三重共振判定成立時，回傳 `tripleResonance: true` flag |
| `src/game/types.ts` | `ExternalDamageExecutionResult` 新增 `tripleResonance?: boolean` 欄位 |
| `src/components/MapGrid.tsx` 或地圖渲染元件 | 接收 `tripleResonance` flag，觸發震動動畫 class / Canvas 偏移 |
| `src/components/CreatureMarker.tsx`（若有） | 目標生物格子上顯示震動動畫與粒子特效 |
| `public/audio/` | 新增震動音效檔案（如 `triple-resonance.mp3`） |

##### ⚠️ 風險評估：戰鬥結算彈窗時程調整

> **設計決策已確定**：震動動畫播放完畢後，才顯示戰鬥結果彈窗。兩者不並行。
> 
> **理由**：
> - 三重共振觸發率約 10-15%，並不常見，0.5 秒延遲不會干擾正常遊玩體驗。
> - 先看到震撼的震動效果、再看到詳細結果，能增強「三重共振」的爽感與儀式感。
> - 非三重共振的外功攻擊不受影響，維持原有即時彈窗流程。
> 
> **實作注意**：
> - `executeExternalDamage` 回傳結果後，UI 層需等待 0.5 秒才開啟彈窗。
> - 僅在 `tripleResonance === true` 時套用此延遲，一般外功攻擊不延遲。
> - 無需跳過機制（因為不是每次都會觸發，玩家預期較低）。

#### 3.5.4 判定流程

```
施放外功 B（元素 B）
    │
    ▼
內功 A 元素生外功 B 元素？ ──否──→ 不觸發連攜
    │是
    ▼
外功 B 元素與站立地形親和？ ──否──→ 僅連攜增益
    │是
    ▼
外功 B 元素克制目標門派元素？ ──否──→ 連攜 + 共鳴（×1.5625）
    │是
    ▼
三重共振觸發！（×1.9531 + 震懾 Buff）
```

#### 3.5.4 UI 顯示規範

**預覽彈窗（ExternalSkillPreviewModal.tsx）**：

| 情況 | 顯示內容 |
| :--- | :--- |
| 僅連攜 | `五行相生連攜：{內功名}生{外功名}｜傷害 ×1.25` |
| 連攜 + 共鳴 | `五行相生連攜：{內功名}生{外功名}｜傷害 ×1.25`<br>`天地共鳴：{地形名}｜傷害 ×1.25` |
| **三重共振** | `五行相生連攜：{內功名}生{外功名}｜傷害 ×1.25`<br>`天地共鳴：{地形名}｜傷害 ×1.25`<br>`五行相剋：{外功名}克{目標名}｜傷害 ×1.25`<br>**⚡ 三重共振！命中後使目標停止一回合** |

**執行結果彈窗（actionResultFormatters.ts）**：

```
造成傷害 195
五行相生連攜：烈陽戰體生烈陽轟（×1.25）
天地共鳴：荒漠（×1.25）
五行相剋：火克金（×1.25）
⚡ 三重共振！目標震懾一回合
```

若未觸發三重共振，則不顯示最後一行。

#### 3.5.5 平衡性考量

| 考量點 | 設計決策 |
| :--- | :--- |
| **觸發難度** | 需同時滿足三個獨立條件，期望觸發率約 10-15% |
| **效果強度** | 停止一回合對怪物而言極強，但僅限於高倍率組合時 |
| **玩家反饋** | 視覺/文字提示需醒目，讓玩家意識到這是稀有且強大的時機 |
| **AI 應對** | AI 應能識別此風險，避免在易觸發三重共振的地形面對相剋門派怪物 |
| **多層疊乘上限** | 最高 ×1.9531 + 罡氣訣（假設 ×1.15）= ×2.25，需監控怪物血量曲線 |


---

## 四、UI 顯示規範

### 4.1 功法設定面板（SkillModal.tsx）

在外功卡片上顯示連攜狀態：

| 情況 | 顯示內容 |
| :--- | :--- |
| **內功生外功** | 外功卡片右上角顯示 💚「相生連攜」標籤，並附註「×1.25」 |
| **內功生外功 + 三重共振條件** | 外功卡片右上角顯示 🔥「三重共振」標籤，並附註「×1.95 + 震懾」 |
| **無連攜** | 不顯示任何標籤 |

### 4.2 預覽彈窗（ExternalSkillPreviewModal.tsx）

在預期結果中顯示連攜狀態：

| 情況 | 顯示內容 |
| :--- | :--- |
| **觸發連攜** | 新增一行：`五行相生連攜：{內功名}生{外功名}｜傷害 ×1.25` |
| **觸發三重共振** | 新增三行：連攜、共鳴、相剋倍率，以及 `⚡ 三重共振！命中後使目標停止一回合` |
| **未觸發** | 不顯示此行 |

### 4.3 執行結果彈窗（actionResultFormatters.ts）

在傷害結果中顯示實際觸發的連攜：

```
造成傷害 165
五行相生連攜：烈陽戰體生烈陽轟（×1.10）
```

若未觸發連攜，則不顯示此欄位。

---

## 五、實作規格

### 5.1 檔案變更清單

| 檔案 | 變更內容 |
| :--- | :--- |
| `src/game/rules/skillRules.ts` | 新增 `isElementGenerating(generator, generated)` 函式；新增 `getGenerationSynergyMultiplier(innerElement, outerElement)` 函式 |
| `src/game/previewOrchestration.ts` | `createExternalSkillPreview` 中加入連攜判定與顯示 |
| `src/game/actions/combatActions.ts` | `executeExternalDamage` 中加入連攜倍率計算 |
| `src/game/actionResultFormatters.ts` | 結果彈窗中加入連攜顯示 |
| `src/components/SkillModal.tsx` | 外功卡片上顯示連攜標籤 |
| `src/components/ExternalSkillPreviewModal.tsx` | 預覽彈窗中加入連攜顯示 |
| `src/game/rules/skillRules.test.ts` | 新增連攜單元測試 |

### 5.2 核心函式規格

#### 5.2.1 `isElementGenerating(generator, generated)`

```typescript
/**
 * 判斷 generator 元素是否生成 generated 元素。
 * 相生循環：金→土→水→木→火→金
 */
export function isElementGenerating(
  generator: SchoolElement | undefined,
  generated: SchoolElement | undefined,
): boolean {
  // none / undefined → false
  // 生成循環判定
}
```

#### 5.2.2 `getGenerationSynergyMultiplier(innerElement, outerElement)`

```typescript
/**
 * 取得五行相生連攜倍率。
 * 當內功元素生外功元素時返回 ×1.25，否則返回 ×1。
 */
export function getGenerationSynergyMultiplier(
  innerElement: SchoolElement | undefined,
  outerElement: SchoolElement | undefined,
): number {
  return isElementGenerating(innerElement, outerElement) ? 1.25 : 1
}
```

### 5.3 單元測試規格

| 測試案例 | 內功元素 | 外功元素 | 預期輸出 |
| :--- | :--- | :--- | :--- |
| 正常相生 | 金 | 土 | ×1.25 |
| 反向不生 | 土 | 金 | ×1 |
| 同屬性 | 火 | 火 | ×1 |
| 太虛流內功 | none | 木 | ×1 |
| 太虛流外功 | 金 | none | ×1 |
| 完整循環 | 水→木、木→火、火→土、土→水、金→土 | — | 全部 ×1.25 |

---

## 六、Buff 系統整合（未來擴充）

### 6.1 目前設計

連攜增益以**直接乘法倍率**形式套用，不經過 Buff 系統。原因：
- 連攜是「施放瞬間判定」，非持續性狀態。
- 不需要跨回合追蹤。
- 簡化實現，降低維護成本。

#### 震懾 Buff 實作規格（三重共振額外效果）

三重共振觸發的「停止活動一回合」效果透過既有 Buff 系統達成：

| 項目 | 內容 |
| :--- | :--- |
| **Buff ID** | `stunned` |
| **Buff 名稱** | 震懾 |
| **持續時間** | 1 回合（`remainingRounds: 1`） |
| **效果欄位** | `stunned: true`（於 `BuffInstance` 新增旗標） |
| **觸發時機** | `executeExternalDamage` 中判定三重共振成立時，將 Buff 附加至目標 |
| **AI 跳過邏輯** | AI 行動循環中檢查 `target.buffs?.some(b => b.definitionId === 'stunned')`，若為 true 則跳過該回合 |
| **UI 顯示** | 目標頭像上顯示 ⚫ 標記；PlayerPanel 中顯示「震懾中」狀態 |

##### 修改檔案清單（Buff 相關）

| 檔案 | 變更內容 |
| :--- | :--- |
| `src/game/types.ts` | `BuffInstance` 新增 `stunned?: boolean` 欄位；`BuffDefinition` 新增 `stunned` 類型 |
| `src/game/catalogs/buffCatalog.ts` | 新增 `stunned` Buff 定義 |
| `src/game/actions/combatActions.ts` | `executeExternalDamage` 中三重共振判定成立時，將 `stunned` Buff 加入目標 |
| `src/game/ai/` | AI 行動選擇邏輯中加入 stunned 檢查，跳過被震懾目標的回合 |
| `src/components/` | 目標頭像與 PlayerPanel 中加入 stunned 視覺提示 |

#### 震懾 Buff 實作規格

三重共振觸發的「停止活動一回合」效果透過既有 Buff 系統達成：

| 項目 | 內容 |
| :--- | :--- |
| **Buff ID** | `stunned` |
| **Buff 名稱** | 震懾 |
| **持續時間** | 1 回合（`remainingRounds: 1`） |
| **效果欄位** | `stunned: true`（於 `BuffInstance` 新增旗標） |
| **觸發時機** | `executeExternalDamage` 中判定三重共振成立時，將 Buff 附加至目標 |
| **AI 跳過邏輯** | AI 行動循環中檢查 `target.buffs?.some(b => b.definitionId === 'stunned')`，若為 true 則跳過該回合 |
| **UI 顯示** | 目標頭像上顯示 ⚫ 標記；PlayerPanel 中顯示「震懾中」狀態 |

##### 修改檔案清單（Buff 相關）

| 檔案 | 變更內容 |
| :--- | :--- |
| `src/game/types.ts` | `BuffInstance` 新增 `stunned?: boolean` 欄位；`BuffDefinition` 新增 `stunned` 類型 |
| `src/game/catalogs/buffCatalog.ts` | 新增 `stunned` Buff 定義 |
| `src/game/actions/combatActions.ts` | `executeExternalDamage` 中三重共振判定成立時，將 `stunned` Buff 加入目標 |
| `src/game/ai/` | AI 行動選擇邏輯中加入 stunned 檢查，跳過被震懾目標的回合 |
| `src/components/` | 目標頭像與 PlayerPanel 中加入 stunned 視覺提示 |

### 6.2 未來擴充方向

若後續需要更複雜的連攜效果，可引入 Buff 系統：

| 擴充項目 | 說明 |
| :--- | :--- |
| **連攜 Buff** | 內功生外功時，施加一個持續 N 回合的 Buff（如「相生護體」） |
| **多重連攜** | 多名隊友的內功同時生同一外功時，Buff 疊加 |
| **連攜專屬效果** | 特定內功×外功組合觸發獨特效果（如回氣、治療、追加攻擊） |
| **連攜計數器** | 連續使用連攜外功累積層數，提升增益 |

---

## 七、平衡性考量

### 7.1 倍率設定依據

| 倍率 | 依據 |
| :--- | :--- |
| **連攜 ×1.25** | 穩定小幅加成，鼓勵玩家關注功法搭配但不強制 |
| **天地共鳴 ×1.25** | 維持現有值，比連攜更顯著（因為依賴地形條件） |
| **相剋 ×1.25** | 維持現有值，主要戰術選招依據 |

### 7.2 與既有機制的疊乘影響

| 組合 | 總倍率 |
| :--- | :--- |
| 僅連攜 | ×1.25 |
| 連攜 + 天地共鳴 | ×1.5625 |
| 連攜 + 相剋 | ×1.5625 |
| 連攜 + 天地共鳴 + 相剋 | ×1.9531 |
| 連攜 + 天地共鳴 + 相剋 + 罡氣訣（假設 ×1.15） | ×2.25 |

> **上限監控**：多重疊乘可能達到 ×1.5~×1.8，需確保怪物血量曲線能承載此範圍。建議實作後追蹤高階關卡的平均通關時間變化。

### 7.3 玩家體驗考量

- **正向回饋**：連攜觸發時應有視覺提示（標籤、動畫），讓玩家感受到搭配的價值。
- **切換成本**：切換內功消耗 1% 內力，連攜增益應足以彌補此成本。
- **學習曲線**：初期玩家可能不知道連攜存在，透過 UI 提示逐步引導發現。

---

## 八、開發檢查清單

### 8.1 核心邏輯

- [ ] 新增 `isElementGenerating()` 至 `skillRules.ts`
- [ ] 新增 `getGenerationSynergyMultiplier()` 至 `skillRules.ts`
- [ ] 新增 `isTripleResonance(innerElement, outerElement, terrain, targetSchool)` 判定函式
- [ ] 更新 `previewOrchestration.ts` 加入連攜判定與三重共振預覽
- [ ] 更新 `combatActions.ts` 加入連攜倍率計算與三重共振判定
- [ ] 更新 `actionResultFormatters.ts` 顯示連攜結果

### 8.2 類型定義

- [ ] `ExternalSkillPreview` 新增 `synergy?: boolean; tripleResonance?: boolean`
- [ ] `ExternalDamageExecutionResult` 新增 `synergy?: boolean; tripleResonance?: boolean`
- [ ] `BuffInstance` 新增 `stunned?: boolean` 欄位
- [ ] `BuffDefinition` 新增 `stunned` 類型

### 8.3 UI 顯示

- [ ] 更新 `SkillModal.tsx` 顯示連攜標籤（💚 / 🔥）
- [ ] 更新 `ExternalSkillPreviewModal.tsx` 顯示連攜與三重共振資訊
- [ ] 更新 `actionResultFormatters.ts` 顯示連攜結果與三重共振提示
- [ ] 目標頭像上顯示 ⚫ 震懾標記
- [ ] PlayerPanel 中顯示「震懾中」狀態

### 8.4 視覺效果（三重共振動畫）

- [ ] 地圖容器套用 CSS `@keyframes shake` 動畫（位移幅度 8px，持續 0.5s）
- [ ] 目標生物格子顯示震顫動畫
- [ ] 依元素屬性設定粒子顏色（金=白/銀、木=綠、水=藍、火=紅、土=黃）
- [ ] 新增震動音效檔案 `triple-resonance.mp3`
- [ ] Canvas 渲染方案：每幀根據衰減函數偏移繪製座標

### 8.5 Buff 系統

- [ ] 新增 `stunned` Buff 定義至 `buffCatalog.ts`
- [ ] `executeExternalDamage` 中三重共振成立時附加 stunned Buff 至目標
- [ ] AI 行動循環中加入 stunned 檢查，跳過被震懾目標的回合

### 8.6 測試與驗證

- [ ] 新增單元測試（相生、反向、同屬性、太虛流、完整循環、三重共振判定）
- [ ] 手動驗證所有 25 種元素組合的連攜判定
- [ ] 手動觸發三重共振並驗證動畫播放
- [ ] 監控多重疊乘傷害上限（最高 ×2.25）
- [ ] 更新 changelog.json

---

## 九、開發要點與注意事項

> 以下為分析既有程式碼後的實作關鍵點，避免踩坑。

### 9.1 ⚠️ 元素欄位為「可選」，需補齊判定防護

`ExternalSkill` 與 `InnerSkill` 的 `element` 欄位是**可選**的（`element?: 'none' | ...`）。例如 `externalSkillCatalog` 中的「破空掌」`sky-breaking-palm` 就**沒有標註 `element`**。

- **風險**：`undefined` 元素直接參與相生／相剋判定會導致 `resonantTerrains[skillElement]`、`counters[attacker]` 讀取 `undefined` 索引而 crash 或誤判。
- **對策**：`isElementGenerating`、`getGenerationSynergyMultiplier`、`isTripleResonance` 函式開頭一律防護 `undefined` 與 `'none'`，直接回傳 `false`／`×1`。
- **資料補齊決策**：需逐一盤點 `externalSkillCatalog`／`innerSkillCatalog` 中缺漏 `element` 的功法，決定是「補上元素」還是「視為無屬性不參與連攜」。破空掌等無元素功法應明確歸屬。

### 9.2 「震懾」是「完全跳過回合」，比既有控制 Buff 更強

既有的 `buffCatalog` 已存在兩種控制類 Buff，但語意不同：

| 既有 Buff | 效果 | 差異 |
| :--- | :--- | :--- |
| `trap-immobilize`（定身） | `immobilized: true`，僅**跳過移動** | 仍可攻擊 |
| `confusion-maze`（惑心） | `confused: true`，**跳過攻擊＋隨機移動** | 仍會亂走 |
| **`stunned`（震懾，本設計新增）** | **完全跳過回合**：不移動、不攻擊 | 最強控制 |

- **風險**：若直接參考 `immobilized` 的實作位置（`creatureTurnPipeline.ts` 的 `planCreatureMovement` 內），只會跳過移動、仍會攻擊，**不符合設計意圖**。
- **對策**：`stunned` 的檢查必須掛在**回合管線的最前段**（`validateCreatureTurnEligibility` 附近，select／plan 之前），直接整回合 return、不產生日誌。此處已存在 `validateCreatureTurnEligibility(creature)` 前段過濾，應在此加入 stunned 判斷，與「存活＋座標有效」同層級。
- **Buff tick 仍要執行**：即使跳過行動，剩餘回合數（`remainingRounds`）仍需正常 -1，否則震懾永不結束。需確認 tick 邏輯在 skip 路徑仍被呼叫。

### 9.3 連攜倍率需與「爆擊」先後順序一致

前次實作的「傷害型外功暴擊」在 `executeExternalDamage` 中最後以 `Math.floor(damageBeforeCrit * 1.5)` 結算。連攜倍率（×1.25）應在**暴擊之前**併入基礎傷害，避免乘法順序導致小數捨入不一致。

- **建議公式**：
  ```
  damage = floor( floor( baseDamage × 相剋 × 連攜 × 共鳴 × 其他 ) × (暴擊 ? 1.5 : 1) )
  ```
- **風險**：若連攜在暴擊後才乘，或與 `damageBeforeTargetReduction` 的命名混淆，會造成預覽與實際結算不符。

### 9.4 內功元素來源要確認取得路徑

連攜判定需要「當前裝備內功的元素」。目前 `createExternalSkillPreview`／`executeExternalDamage` 使用 `getInnerSkill(target.player.innerSkillId)` 取得內功。需確認：

- 玩家 `innerSkillId` 是否永遠有效（有無空字串／未裝備情境）。
- 太虛流（`void-spirit`）內功是否回傳 `'none'` 元素——若是，連攜自然失效，符合設計。

### 9.5 三重共振判定需統一一處，避免預覽／結算分叉

`createExternalSkillPreview`（預覽）與 `executeExternalDamage`（結算）**各自**計算傷害，若三重共振判定邏輯分開實作，極易兩邊結果不一致。

- **對策**：將三重共振判定封裝成單一純函式 `isTripleResonance(innerElement, outerElement, terrain, targetSchool)`，兩處共用，並以單元測試鎖定。
- 預覽與結果彈窗的顯示文案也應共用同一份 formatting，避免兩處文案漂移。

### 9.6 彈窗延遲需在 UI 層而非 action 層處理

0.5 秒震動動畫與彈窗的串行時程（先動畫、後彈窗）應在**元件層**處理，避免污染純函式的 `executeExternalDamage` 回傳。

- `executeExternalDamage` 只回傳資料（含 `tripleResonance: true`），**不呼叫 setTimeout**。
- UI 元件收到結果後，若 `tripleResonance === true`，先播放 0.5s 動畫，`onAnimationEnd` 再開啟彈窗；一般外功直接開彈窗。

### 9.7 AI 也受震懾影響（含 AI 玩家）

`stunned` Buff 掛在「生物（Creature）」上，AI 玩家的怪物回合管線需跳過。但要注意：

- 若未來「震懾」也施放於 AI 玩家（人類玩家），需一併檢查玩家行動的入口（`canPlayerPerformAction`），否則 AI 玩家仍會行動。
- 本設計目前僅對象為生物，暫不需處理玩家側，但需在程式碼註記此限制。

### 9.8 檢查清單補充

- [ ] 盤點所有功法 `element` 欄位，補齊或標明「無屬性」策略
- [ ] `isElementGenerating` 等函式防護 `undefined`／`'none'`
- [ ] `stunned` 檢查掛在回合管線最前段（`validateCreatureTurnEligibility` 層級）
- [ ] 確認震懾跳過時 Buff `remainingRounds` 仍正常 tick
- [ ] 連攜倍率在暴擊之前結算，乘法順序固定
- [ ] 三重共振判定函式僅實作一處，預覽／結算共用
- [ ] 彈窗延遲在 UI 層（onAnimationEnd）處理，action 層保持純函式
- [ ] 用既有的 `immobilized`／`confused` 作為 `stunned` 的對照，避免語意混淆
