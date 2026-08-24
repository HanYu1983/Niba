# 門派據點（Sect Gate）設計文件

> 狀態：設計討論稿（尚未開發）
> 日期：2026-08-16
> 來源：玩家反饋 + 門派功法系統重構方向

## 1. 設計目標

將「學習門派功法」從「玩家在自己據點蓋武館」改為「地圖上中立的門派據點設施」。
呼應玩家反饋：「功法應注重功能性而非數量」「用經驗值提升功法能力」。

門派據點是地圖上的中立設施，不可佔領，玩家透過「學習」與「練習」兩個動作
累積門派據點經驗使其升級，並提升自身已學功法的等級。

## 2. 核心模型

### 2.1 生成

- 開局依 `sectGateCount`（地圖設定頁，預設 **3**）隨機生成 N 個門派據點。
- 每個門派據點隨機指定一個門派（六門派：太虛/厚土/疾風/烈焰/寒水/金身），
  **生成時確保門派不重複**（地圖最多 6 個門派據點，對應六門派；`sectGateCount` 上限設為 6）。
- 每個門派據點攜帶該門派的 **三個功法**：
  - 1 內功：`${schoolId}-inner`
  - 1 傷害型外功：`${schoolId}-external-damage`
  - 1 技能型外功：`${schoolId}-external-functional`（帶 `functionalEffect`）

### 2.2 門派據點狀態

```
SectGateState {
  id: string
  schoolId: MartialSchoolId
  position: Position
  experience: number      // 門派據點自身經驗值
  level: 1 | 2 | 3        // 由 experience 推導
}
```

### 2.3 等級與功法解鎖對應

直接對應現有 `progressionExternalSkills` / `progressionInnerSkills` 的 `requiredHallLevel`：

| 門派據點等級 | 解鎖功法 | 對應現有欄位 |
|------------|---------|------------|
| Lv1 | 內功 | `requiredHallLevel: 1` |
| Lv2 | 傷害型外功 | `requiredHallLevel: 2` |
| Lv3 | 技能型外功 | `requiredHallLevel: 3` |

> 現有 catalog 已按此分級，門派據點等級可直接複用 `requiredHallLevel` 判斷可學功法。

## 3. 互動行為

門派據點中立、不可佔領，互動選項只有兩個：

### 3.1 學習功法（Learn）

- **代價**：金錢，沿用武館學習公式 `MARTIAL_HALL_LEARN_COST_PER_INSIGHT = 15`，
  即 `價格 = insightCost × 15`（內功用 `insightRequirement`，外功用 `insightCost`）。
  參考現有門派功法數值：內功 `insightRequirement: 5` → **75 金**；
  傷害外功 / 技能型外功 `insightCost: 2` → **30 金**。
  （具體數值邊玩邊調，但公式與武館一致。）
- **條件**：該功法須為此門派據點擁有、且門派據點等級已解鎖（見 2.3）、玩家尚未學會。
- **效果**：
  - 玩家 `externalSkillIds` / `innerSkillIds` 加入該功法。
  - 門派據點 `experience` 增加（見 4.1）。

### 3.2 練習功法（Practice）

- **代價**：體力 **5**（已定）。
- **條件**：該功法須為此門派據點擁有、**且玩家已經學會**該功法。
- **效果**（雙重經驗，已確認）：
  - 門派據點 `experience` 增加（見 4.1）。
  - 玩家該功法的個人經驗增加（呼叫現有 `addSkillExperience`）。

> 現有代碼已支援功法個人經驗：`player.skillProgression[skillId]` 存經驗與等級，
> `combatActions.ts` 在計算外功傷害（`:263-265`）與內力消耗（`:232`）時已讀取
> `getSkillProgression(player, skillId).level`。因此「練習 → 功法變強」鏈條已接通，
> 門派據點只需觸發 `addSkillExperience` 即可。

## 4. 經驗值與升級

### 4.1 門派據點經驗

- 學習與練習 **每次都增加相同數量** 的門派據點經驗（數值待定，邊玩邊調）。
- 升級門檻：**約學習 5 次升一級**（即 Lv1→2、Lv2→3 各需約 5 次動作累積）。
- 升級後自動解鎖下一級功法（見 2.3），無需玩家額外操作。

### 4.2 功法個人經驗

- 僅由「練習」觸發（學習不給功法個人經驗，只給門派據點經驗）。
- 使用現有 `SKILL_EXPERIENCE_PER_USE` 與 `addSkillExperience` 機制。
- 功法等級提升後，外功傷害與內力消耗自動隨 `level` 增強（現有邏輯已支援）。

## 5. 與現有系統的關係

| 現有系統 | 關係 |
|---------|------|
| `martialHallSkillCatalog` / `getMartialHallSkills` | 門派據點的功法清單直接複用 `progressionInnerSkills` / `progressionExternalSkills`（按 `schoolId` 過濾）。 |
| 武館建築（`building-type-martial-hall-*`） | 保留。武館仍可在自己據點建造，提供相同功法學習；門派據點是地圖上的替代/補充來源。兩者不衝突。 |
| `skillRules.addSkillExperience` / `getSkillProgression` | 練習功法直接呼叫，無需重構。 |
| 地圖設定頁（`GameStartScreen`） | 新增 `sectGateCount` 設定項（預設 3），與 `baseCount` / `nestCount` 同層級。 |
| `worldGeneration` | 新增 `createSectGates(map, count, seed, excludedPositions)`，隨機選門派與位置。 |

## 6. 待定事項（開發前需確認）

1. ~~學習功法的金錢代價具體數值。~~ **已定：沿用武館公式 `insightCost × 15`（內功 75 金 / 外功 30 金）。**
2. 門派據點每次動作的經驗值具體數值（目前僅定「約 5 次升一級」的比例）。
3. ~~多個門派據點是否允許同門派重複（建議不重複）。~~ **已定：生成時確保門派不重複，`sectGateCount` 上限 6。**
4. 門派據點是否顯示在迷霧/已知位置系統中（參考現有 `isKnownLocation` 邏輯）。
5. 練習功法是否結束玩家回合（目前僅扣 5 體力，不強制結束；若體力不足則不可練習）。

## 7. 開發任務清單（待啟動）

- [ ] 新增 `SectGateState` 型別（`types.ts`）
- [ ] `worldGeneration.ts`：新增 `createSectGates`，並在 `createGameState` / `worldSetup` 接入
- [ ] `GameStartScreen.tsx`：新增 `sectGateCount` 設定項（預設 3）
- [ ] `gameStore.ts`：`learnSectGateSkill` / `practiceSectGateSkill` action
- [ ] `creatureAnimation` / 回合系統：門派據點不參與戰鬥
- [ ] UI：門派據點詳情彈窗（學習/練習列表，依等級與已學狀態禁用）
- [ ] 測試：生成數量、等級解鎖、學習/練習經驗累積、體力/金錢扣減
