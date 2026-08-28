# 篇章解鎖制官方角色設計（Chapter Unlock Official Character Design）V2

> ## ✅ 製作狀態：方向已定（Direction Locked）／準備實作
>
> 本文件為 **V2 定案**，取代 `official-character-chapter-design.md`（V1，保留參考）。
> V1 的「劇本關卡固定官方角色、局末回寫名冊」路線已放棄；V2 改為
> **「篇章解鎖制」**：劇本模式只負責解鎖，培養全部發生在沙盒模式。

## 1. 文件目的

- 定義「篇章解鎖制」官方角色系統：劇本模式通關 → 解鎖篇章角色在沙盒的可學習功法與天賦。
- 規格化官方角色資料結構、解鎖掛鉤與名冊／沙盒 UI。
- 最小化劇本模式改動：劇本關卡本身**不需要大改**。

## 2. 核心模型（與 V1 的差異）

| 面向 | V1（已放棄） | **V2（本定案）** |
|---|---|---|
| 劇本關卡角色 | 固定使用**名冊官方角色**，不可選 | **維持現況**：不可選角，依故事綁定**劇本自己的故事角色**（與名冊無關，僅名稱相同） |
| 培養場所 | 劇本局末回寫名冊 | **沙盒模式**（名冊角色照常跨局累積） |
| 劇本模式的作用 | 遊玩 + 培養 | **只做解鎖**：通關 → 解鎖名冊官方角色的可學習功法與天賦 |
| 劇本模式改動量 | 大（注入、回寫、等級錨定） | **極小**（只在局末結算加一個解鎖檢查） |
| 官方角色何時可玩 | 綁定關卡內 | **篇章開啟後即可在沙盒遊玩與培養** |

> **兩個「凌淵」的區分**：
> - **劇本故事角色**：`ScenarioDefinition` 玩家配置定義的局內角色，服務敘事，
>   與名冊**完全無關**（不讀取、不回寫），只是名稱恰好也叫「凌淵」。
> - **名冊官方角色**：`PersistentCharacter`（`isOfficial: true`），篇章開啟後存在於名冊，
>   專門供**沙盒模式**遊玩與培養，隨劇本通關解鎖功法/天賦。
> 兩者資料上零耦合，僅靠篇章（`chapterId`）關聯解鎖進度。

## 3. 已確認決策

| 議題 | 決策 |
|---|---|
| 篇章開啟 | 開啟（進入）篇章後，名冊官方角色即可在**沙盒模式遊玩與培養** |
| 劇本模式角色 | **維持現況**：不可選角，依故事綁定劇本自己的故事角色（與名冊無關，僅名稱相同） |
| 劇本模式培養 | **禁止**——劇本模式不回寫名冊、不累積任何養成進度 |
| 劇本模式作用 | **只解鎖**：通關篇章關卡 → 解鎖名冊官方角色的可學習功法與天賦 |
| 專屬功法 | 獨佔（僅名冊官方角色可用） |
| 名冊呈現 | 同一列表 + 官方標籤 |
| 沙盒選角 | 篇章開啟後即可選用官方角色（**無需通關全篇章**，比 V1 寬鬆） |

## 4. 核心資料結構

### 4.1 `PersistentCharacter` 擴充

```ts
// characterRoster.ts
export type PersistentCharacter = {
  // ...既有欄位...
  /** 官方角色旗標：篇章主角，禁止刪除／改名；篇章開啟後可在沙盒遊玩與培養。 */
  isOfficial?: boolean
  /** 綁定的篇章 id（對應 scenario id；現況一個篇章 = 一個劇本檔）。 */
  chapterId?: string
}
```

### 4.2 官方角色目錄

```ts
// src/game/catalogs/officialCharacterCatalog.ts（新）
export type OfficialCharacterDefinition = {
  /** 對應名冊角色 id（固定 id，如 'official-lingyuan'）。 */
  characterId: string
  /** 綁定篇章（scenario id）。 */
  chapterId: string
  name: string
  title: string
  portrait: string
  /** 沙盒開局等級錨點（首次建立時使用）。 */
  initialLevel: number
  initialAttributes: PlayerAttributes
  /** 專屬功法四件套 id（1 內功 + 傷害/靈氣/強化外功各一）。 */
  exclusiveInnerSkillId: string
  exclusiveExternalSkillIds: string[]
  /**
   * 隨篇章進度解鎖的內容：
   * - skills：通關對應關卡後，解鎖為「可學習」（進 unlockedSkillIds，花卷學習）。
   * - talents：通關對應關卡後，解鎖為「可解鎖天賦」（進 unlockedTalentIds，花卷解鎖）。
   */
  storyUnlocks: {
    scenarioId: string
    skillIds?: string[]
    talentIds?: string[]
  }[]
}
```

> **解鎖語意**：劇本通關解鎖的是「**可學習／可解鎖**」資格，不是直接學會。
> 玩家仍需在沙盒培養面板花卷學習功法／解鎖天賦——與現有名冊經濟完全一致。

### 4.3 專屬功法標記

沿用 V1 §12.1–§12.3 的定案（代碼審查結論不變）：

- 專屬功法 `lootExcluded: true` + `exclusiveCharacterId` 並用。
- 放入新目錄 `officialExclusiveSkills.ts`，**加入** `allInner/ExternalSkillCatalog` 聚合
  （功法設定頁可查找），**不加入** progression（武館/門派）與 jianghu（掉落/巢穴）目錄。
- 唯一必改的取得路徑：`eventResolver.ts` 的 `getRandomLearnableSkill` 加過濾
  `!skill.exclusiveCharacterId`。

## 5. 篇章開啟與解鎖流程

### 5.1 篇章開啟：設計時靜態註冊

**新決策**：篇章不動態判定，**所有已創作的篇章在玩家端預設為開啟**。
「開啟」的語意是「**設計時定義、執行時已存在**」——作者在新增篇章時同步把對應的官方角色
加進名冊（持久化初始資料），玩家端一進主選單就看得到，無需任何解鎖動作。

實作變更：

- **刪除** V2 §5.1 原 `loadScenario` 中的 `ensureOfficialCharacter` 開篇章邏輯。
- **刪除** §7.1 `isOfficialCharacterAvailableInSandbox` 判定。
- **保留** `ensureOfficialCharacter` 函式（供「名冊中尚無該角色時的容錯建立」，例如：
  舊版存檔缺少凌淵時首次建立）。
- 沙盒下拉過濾改為：`!c.isOfficial || c.isOfficial`（**所有官方角色始終顯示**，
  不需任何條件判斷）。
- 玩家感知的「開啟」：官方角色在名冊中存在 → 沙盒可選用，無需任何劇本通關動作。

> **為何放棄動態判定**：動態判定需要「首次載入關卡」或「顯式按鈕」觸發，
> 對玩家都是不必要的摩擦——作者本來就在新增篇章時決定要釋出哪些角色，
> 該資訊直接隨存檔一起分發即可，不該再用遊戲行為「解鎖」。

### 5.2 劇本通關解鎖（story unlocks）

**掛鉤點：局末結算**（沿用 V1 §12.8 方案 A 的架構結論，但語意改為「解鎖可學習資格」）：

- 位置：`gameStore.recordCurrentScenarioClearance` 或 `settleActiveCharacterRewards` 附近，
  在 `recordScenarioClearance(scenarioId, cleared)` 時一併處理。
- 條件：`cleared === true`（勝利才解鎖）。
- 動作：查 `officialCharacterCatalog` 中 `storyUnlocks` 含該 `scenarioId` 的項目，將
  `skillIds` 併入官方角色 `unlockedSkillIds`、`talentIds` 併入 `unlockedTalentIds`（去重）。
- **不動** `learnedSkillIds`／`talentIds`（已學/已啟用）——玩家在沙盒花卷才會學會/啟用。
- 冪等：`unlockedSkillIds`/`unlockedTalentIds` 為 Set 語意去重，重複通關不重複給。

> **劇本模式不回寫其他任何東西**：殘卷、五維、等級、局內功法一概不回寫名冊。
> 現行 `settleActiveCharacterRewards` 在劇本模式因 `activeCharacterIds = []` 自然跳過，
> 維持現狀即可。

### 5.3 沙盒培養（唯一培養場所）

- 玩家在沙盒選用官方角色 → 照常跨局累積（殘卷、五維、功法、天賦）。
- 培養面板（`CharacterTrainingPanel`）：
  - 「可培養功法」清單 = `unlockedSkillIds`（含劇本解鎖的專屬功法）→ 花卷學習。
  - 天賦面板：`unlockedTalentIds`（含劇本解鎖的天賦）→ 花卷解鎖 → 啟用。
- **現有培養系統零改動**——解鎖只是往 `unlockedSkillIds`/`unlockedTalentIds` 塞 id。

## 6. 劇本模式的改動範圍（極小）

| 項目 | 改動 |
|---|---|
| `loadScenario` | **零改動**（不再動態建立官方角色） |
| 局末結算 | 加解鎖檢查（勝利時併入 `unlockedSkillIds`/`unlockedTalentIds`） |
| 劇本關卡定義 | **零改動**（不需要 `officialCharacterId` 欄位；故事角色照舊由玩家配置定義） |
| 劇本內玩家 | **維持現況**：故事角色由 `ScenarioDefinition` 玩家配置定義，不可選角，與名冊無關 |
| 對話/觸發器 | 零改動 |

> **唯一戰鬥/事件代碼改動**：`eventResolver.ts` 的 `getRandomLearnableSkill` 過濾獨佔功法。
> 對話/觸發器系統不需新增 `unlock-skill` 效果。

**名冊資料建立**：官方角色（凌淵）作為持久化初始資料，
隨發布版本一起分發（類似內建模板、預建武館）。玩家首次載入遊戲時，
該角色已存在於名冊。實作可選擇：包入名冊存檔預設值、或在 `getCharacters()` 為空時
自動 merge 內建官方角色。

> 對比 V1：不需要 `injectOfficialProgress`、不需要等級錨定、不需要 `activeCharacterIds`
> 接線、不需要動 `scenarioCompiler`、**也不再需要 `loadScenario` 開篇章**。
> V2 的核心簡化：劇本模式只加一個解鎖檢查。

## 7. UI 變更

| 位置 | 變更 |
|---|---|
| 名冊列表（`CharacterLibraryScreen`） | 官方角色顯示標籤（如「📖 篇章主角」）；刪除／改名按鈕隱藏或禁用 |
| 沙盒選角（`GameStartScreen`） | 下拉**包含所有**官方角色（無需任何條件判斷） |
| 劇本關卡選擇（`CampaignScenarioTab`） | 顯示「通關可解鎖：◯◯功法／◯◯天賦」提示（引導玩家打劇本的動機） |
| 培養面板（`CharacterTrainingPanel`） | 零改動（解鎖的功法/天賦自然出現在可學習清單） |

> V2 §5.1 移除動態開啟判定後，**沙盒下拉不需要任何過濾**——所有官方角色始終顯示。
> `isOfficialCharacterAvailableInSandbox` 函式**作廢**。

## 8. 實作階段

| 階段 | 內容 | 依賴 |
|---|---|---|
| **Phase 1：官方角色基礎設施** | `isOfficial`/`chapterId` 欄位、官方角色目錄（凌淵）、專屬功法目錄與 `exclusiveCharacterId`、`eventResolver` 過濾、名冊 UI 標籤與防護、官方角色作為持久化初始資料建立 | 無 |
| **Phase 2：篇章通關解鎖** | 局末勝利解鎖（skills/talents）、劇本關卡解鎖提示 | Phase 1 |
| **Phase 3（遠期）** | 一個篇章拆多關（`chapterId` 群組）、專屬功法跨角色解鎖機制 | Phase 2、內容需求 |

## 9. 影響檔案

| 檔案 | 變更 |
|---|---|
| `src/game/characterRoster.ts` | `isOfficial`/`chapterId` 欄位、`ensureOfficialCharacter`、刪除/改名防護、篇章解鎖函式（`unlockStoryContent`） |
| `src/game/catalogs/officialCharacterCatalog.ts`（新） | 凌淵定義（含 `storyUnlocks`） |
| `src/game/catalogs/officialExclusiveSkills.ts`（新） | 專屬功法四件套 |
| `src/game/catalogs/martialHallSkillCatalog.ts` | 聚合加入專屬功法 |
| `src/game/catalogs/externalSkillCatalog.ts`、`innerSkillCatalog.ts` | `exclusiveCharacterId` 欄位 |
| `src/game/events/eventResolver.ts` | `getRandomLearnableSkill` 過濾獨佔功法 |
| `src/game/gameStore.ts` | `loadScenario` 開篇章（約 3 行）、局末解鎖接線 |
| `src/components/CharacterLibraryScreen.tsx` | 官方標籤、刪除/改名防護 |
| `src/components/GameStartScreen.tsx` | 沙盒下拉過濾（篇章已開啟才顯示） |
| `src/components/CampaignScenarioTab.tsx` | 通關解鎖提示 |

## 10. 驗證

- 篇章開啟：首次載入序章 → 名冊自動出現凌淵（含專屬內功已學）→ 沙盒可選用。
- 沙盒培養：用凌淵打沙盒 → 殘卷/五維/功法/天賦照常跨局累積。
- 劇本解鎖：通關序章（勝利）→ 凌淵的 `unlockedSkillIds`/`unlockedTalentIds` 新增對應項 →
  培養面板可花卷學習/解鎖；**失敗不解鎖**；重複通關不重複給。
- 劇本不回寫：劇本局末不產生殘卷、不動五維/等級（`activeCharacterIds = []` 維持現狀）。
- 獨佔：武館/門派/掉落/事件皆不出現專屬功法；僅凌淵可見。
- 防護：官方角色不可刪除/改名。
- 回歸：非官方角色沙盒、現有劇本行為不變；完整測試套件通過。

## 11. 開放問題（待討論）

| # | 議題 | 備註 |
|---|---|---|
| 1 | 專屬功法初始狀態：建立時「已學專屬內功」是否合理 | V1 同款假設；亦可全部走劇本解鎖 |
| 2 | `initialLevel` 是否需要（沙盒開局等級錨點） | 名冊無等級欄位；若要跨局累積等級需加欄位 |
| 3 | 官方角色作為持久化初始資料的分發方式 | 隨版本預建入 `getCharacters()` 預設值；或名冊為空時自動 merge 內建官方角色 |

---

## 12. 開發紀錄

### 2026-08-28｜凌淵角色與四件套專屬功法（Phase 1 第 1 波）

#### 本次完成

- **凌淵角色定義**（`src/game/catalogs/officialCharacterCatalog.ts`，新檔）：
  - `lingyuan: OfficialCharacterDefinition`，`characterId: 'official-lingyuan'`、`chapterId: 'prologue-village'`。
  - `initialAttributes` 在 createCharacterState 預設 8/8/8/8/8 之上疊加臂力 +2、根骨 +2、內息 +1、悟性 +2（敏捷 +0）。
  - `element: 'none'`（守護者超然五行）。
  - `exclusiveInnerSkillId: 'lingyuan-shelter-breath'`（建立時即「已學」）。
  - `exclusiveExternalSkillIds: ['lingyuan-mountain-pulse', 'lingyuan-rivers-sustain', 'lingyuan-five-elements-mend']`。
  - `storyUnlocks: []`（序章無額外解鎖，預留後續章節）。
  - 匯出 `officialCharacterCatalog`、`getOfficialCharacterByChapter`、`getOfficialCharacterById`。

- **四件套專屬功法**（`src/game/catalogs/officialExclusiveSkills.ts`，新檔）：
  - `lingyuanShelterBreath`（內功，element:none，普攻公式：臂力×0.5 + 根骨×0.2 + 內息×0.3）。
  - `lingyuanMountainPulse`（傷害外功，半徑 1 / all，公式：內息×0.6 + 悟性×0.4）。
  - `lingyuanRiversSustain`（靈氣外功，element:water，複用既有 `spring-return-art` buff——`getEquippedExternalSkillBuffs` 強制 `remainingRounds: null`，規避原本 3 回合限制）。
  - `lingyuanFiveElementsMend`（強化外功，`activationEffect: heal-self-percent 0.3`）。
  - 建立後立即賦值 `exclusiveCharacterId = 'official-lingyuan'` 與 `lootExcluded = true`
    （Factory 不會自動帶這兩個欄位，這是當前最乾淨的鎖定方式）。

- **凌淵專屬 Buff**（`src/game/catalogs/buffCatalog.ts`）：
  - 新增 `lingyuan-shelter-breath-buff`（悟性 +3，persistent）。

- **型別擴充**：
  - `InnerSkill` / `ExternalSkill` 加 `exclusiveCharacterId?: string`、`lootExcluded?: boolean`（後者已存在）。
  - `PlayerState` 加 `characterId?: string`。
  - `InitialCharacterConfig`（`worldGeneration.ts`）加 `characterId?: string`。

- **功法聚合**（`src/game/catalogs/martialHallSkillCatalog.ts`）：
  - 凌淵 1 內功 + 3 外功加入 `allInnerSkillCatalog` / `allExternalSkillCatalog`。
  - **排序**：放在 `progressionInnerSkills` / `progressionExternalSkills` **之前**——避免破壞既有
    `lootFactory.test.ts` 中 `slice(0, -1)` 對「目錄結尾為可掉落功法」的隱含假設。

- **事件掉落過濾**（`src/game/events/eventResolver.ts`）：
  - `getRandomLearnableSkill` 新增兩道過濾：
    - `skill.exclusiveCharacterId && skill.exclusiveCharacterId !== player.characterId` → 排除。
    - `skill.lootExcluded` → 排除。
  - 凌淵的 `exclusiveCharacterId === 'official-lingyuan'` 對非凌淵玩家永遠排除；
    凌淵自己的專屬功法因 `lootExcluded: true` 一併排除（透過 `createInitialPlayers` 的
    `initialExternalSkillIds` 直接寫入玩家 `externalSkillIds` 取得，不走事件掉落）。

- **角色建立注入**（`src/game/worldGeneration.ts`）：
  - `createCharacterState` 呼叫端帶入 `characterId: useCharacterSkills ? character?.characterId : undefined`。
  - 凌淵的 `exclusiveInnerSkillId` 與 `exclusiveExternalSkillIds` 透過既有
    `initialInternalSkillId` / `initialExternalSkillIds` 注入；
    `innerSkillIds = [...new Set(['tuna-gong', innerSkillId])]` 確保 `tuna-gong` 仍保留在已知清單。

#### 影響檔案

| 檔案 | 變更 |
|---|---|
| `src/game/catalogs/officialCharacterCatalog.ts` | **新檔**：凌淵定義 |
| `src/game/catalogs/officialExclusiveSkills.ts` | **新檔**：四件套專屬功法 |
| `src/game/catalogs/buffCatalog.ts` | 新增 `lingyuan-shelter-breath-buff` |
| `src/game/catalogs/externalSkillCatalog.ts` | `ExternalSkill` 加 `exclusiveCharacterId?: string` |
| `src/game/catalogs/innerSkillCatalog.ts` | `InnerSkill` 加 `lootExcluded?: boolean` 與 `exclusiveCharacterId?: string` |
| `src/game/catalogs/martialHallSkillCatalog.ts` | 聚合凌淵 1 內功 + 3 外功（放在 `progressionXXX` 之前） |
| `src/game/events/eventResolver.ts` | `getRandomLearnableSkill` 過濾獨佔與 lootExcluded 功法 |
| `src/game/types.ts` | `PlayerState` 加 `characterId?: string` |
| `src/game/worldGeneration.ts` | `InitialCharacterConfig` 加 `characterId?`；`createInitialPlayers` 注入 `characterId` |

#### 驗證結果

- TypeScript：`npx tsc --noEmit` 通過。
- 測試：`npx vitest run` 93 個檔案 / **1014 項全數通過**。
- Loot 過濾：怪物擊殺掉落（`lootFactory.ts`）的 `toSkillLoot` 已內建 `!skill.lootExcluded` 過濾，**無需修改**。

#### 待辦（下次接續）

| # | 項目 | 備註 |
|---|---|---|
| 1 | **凌淵天賦** | V2 §4.2 `storyUnlocks.talentIds` 預留欄位但未設計。建議 2~3 個對應「守護者」主題天賦（如「五行同心」在水/火/土主場 +5% 治療）。設計後需在 `getTalentBuffs` 路徑串起來 |
| 2 | **`ensureOfficialCharacter` 實作** | V2 §5.1 修訂為「持久化初始資料隨版本分發」，但 `characterRoster.ts` 還沒實作（名冊為空時自動 merge 凌淵的容錯建立） |
| 3 | **`isOfficial` / `chapterId` 欄位加到 `PersistentCharacter`** | 名冊型別尚未加官方旗標；UI 標籤與刪除/改名防護也尚未實作 |
| 4 | **凌淵專屬功法單元測試** | 至少覆蓋：(a) 凌淵建立時已帶四件套、(b) 非凌淵玩家事件掉落池不含專屬功法、(c) `lootFactory.toSkillLoot` 過濾凌淵功法、(d) 凌淵的靈氣 buff 在每回合觸發回復 |
| 5 | **劇本通關解鎖接線** | Phase 2 項目：`recordScenarioClearance(cleared=true)` 時把 `storyUnlocks` 併入 `unlockedSkillIds` / `unlockedTalentIds` |
| 6 | **V2 設計文件 §11 開放問題定案** | 議題 1：建立時「已學專屬內功」是否合理。議題 3：官方角色分發方式。 |

#### 設計決策備忘

- **凌淵的靈氣外功複用 `spring-return-art` buff**：與江湖「回春訣」共享同一個
  `healthRegenPercent` 機制，差異只在名稱與敘事。這是**刻意設計**——守護者版本透過
  `exclusiveCharacterId` + `lootExcluded` 雙重鎖定，戰鬥系統層面零重複實作。
- **「先賦值再合併」是當前最簡鎖定方式**：Factory（`createInnerSkill` / `createDamageExternalSkill` 等）
  沒提供 `exclusiveCharacterId` / `lootExcluded` 參數；如要讓 Factory 支援需動 4 個工廠函式
  簽名，目前影響範圍更大。改用「建立後立即賦值」可維持 Factory 純淨。
- **凌淵在事件掉落池中也不會撿到自己的專屬功法**：`lootExcluded: true` 與 `exclusiveCharacterId`
  雙重鎖定，副作用是凌淵在「重新遊玩」劇情事件時也無法「領悟」新專屬功法（除非另行開啟
  劇情事件派發管道）。目前設計假設凌淵的 4 件套已透過角色建立自帶，無需事件派發。
