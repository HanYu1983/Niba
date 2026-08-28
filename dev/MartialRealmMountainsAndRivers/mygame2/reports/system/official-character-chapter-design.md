# 官方角色與篇章綁定設計（Official Character & Chapter Binding Design）

> ## ⚠️ 狀態：已由 V2 取代（Superseded）——保留參考用
>
> 本文件（V1）的「劇本關卡固定官方角色、局末回寫名冊」路線**已放棄**。
> 現行定案請見 **`official-character-chapter-design-v2.md`**（篇章解鎖制：
> 劇本模式只負責解鎖功法/天賦，培養全部在沙盒模式）。
> V1 的 §12 開發細節補充（功法取得路徑盤點、`lootExcluded` 複用、
> `ensureOfficialCharacter` 冪等建立等代碼審查結論）仍為有效參考，V2 已沿用。
>
> 本文件定義「劇本篇章專屬官方角色」系統：每個篇章對應一位官方名冊角色
> （如第一章主角「凌淵」），擁有專屬功法四件套，於劇本關卡中固定使用、
> 跨局累積培養。玩家自建角色不受影響。

## 1. 文件目的

- 定義官方角色（篇章主角）的資料結構、功法獨佔機制與名冊呈現。
- 規格化劇本關卡與官方角色的綁定、開局注入與局末回寫流程。
- 與既有系統對齊：`PersistentCharacter`、`ScenarioDefinition`、`loadScenario`、`settleActiveCharacterRewards`（多角色架構）。

## 2. 已確認決策

| 議題 | 決策 |
|---|---|
| 培養模式 | **跨局累積**（模式一）：殘卷、五維、功法、天賦全部持久；「打不贏就繼續培養」的偷步挑戰是刻意設計 |
| 專屬功法 | **獨佔**：僅該官方角色可用；未來再考慮跨角色解鎖機制 |
| 名冊呈現 | **同一列表 + 官方標籤**（`isOfficial` 旗標） |
| 選角規則 | **劇本關卡固定官方角色，不可選**；目前無支線／挑戰關卡 |

## 3. 設計支柱

- **敘事與養成綁定**：專屬功法反映篇章主題（名稱、五行屬性與劇情呼應），新篇章 = 新角色 + 新功法。
- **偷步挑戰**：難度曲線責任在玩家；關卡按「預期培養進度」設計，並提供建議進度提示。
- **稀缺性**：專屬功法嚴格鎖定於篇章內，取得路徑（武館／門派／掉落／事件）全部排除。
- **成長不因失敗歸零**：每次局末回寫（含失敗局），符合「打不贏就繼續培養」。

## 4. 核心資料結構

### 4.1 `PersistentCharacter` 擴充

```ts
// characterRoster.ts
export type PersistentCharacter = {
  // ...既有欄位...
  /** 官方角色旗標：篇章主角，禁止刪除／改名；劇本關卡固定使用。 */
  isOfficial?: boolean
  /** 綁定的篇章 id（對應 campaignScenarioCatalog / scenarioStorage 的篇章識別）。 */
  chapterId?: string
}
```

- `isOfficial: true` 的角色：
  - 名冊 UI 顯示官方標籤（如「📖 篇章主角」）。
  - **禁止刪除與改名**（`deleteCharacter`／`updateCharacter` 擋下）。
  - 沙盒「使用角色」下拉**過濾掉**（見 §8 決策 B）。

### 4.2 官方角色種子資料

新增官方角色目錄（建議 `src/game/catalogs/officialCharacterCatalog.ts`）：

```ts
export type OfficialCharacterDefinition = {
  /** 對應名冊角色 id（固定 id，如 'official-lingyuan'）。 */
  characterId: string
  chapterId: string
  name: string
  title: string
  portrait: string
  /** 劇情設定的初始狀態（首次遊玩該篇章時的登場配置）。 */
  initialLevel: number
  initialAttributes: PlayerAttributes
  /** 專屬功法四件套 id。 */
  exclusiveInnerSkillId: string
  exclusiveExternalSkillIds: string[]  // 傷害型 / 靈氣型 / 強化型 各一
  /** 隨篇章進度解鎖的功法（見 §6）。 */
  storySkillUnlocks: { skillId: string; scenarioId: string }[]
}
```

- 首次遊玩篇章時，若名冊無對應官方角色 → **自動建立**（以 `initialLevel`／`initialAttributes` 與已解鎖的專屬功法初始化）。
- 已存在 → 直接使用名冊中的累積進度。

### 4.3 專屬功法標記

```ts
// externalSkillCatalog.ts / innerSkillCatalog.ts（或統一註冊表）
export type ExternalSkill = {
  // ...既有欄位...
  /** 獨佔此功法的官方角色 id；設定後不進入任何通用取得路徑。 */
  exclusiveCharacterId?: string
}
```

- `exclusiveCharacterId` 存在的功法：
  - 武館、門派據點、巢穴掉落（`getLearnableSkill`）、探索事件（`learn-skill`）**全部排除**。
  - 僅透過官方角色的 `unlockedSkillIds`／`learnedSkillIds` 進入該角色。

## 5. 篇章關卡綁定

### 5.1 `ScenarioDefinition` 擴充

```ts
// editorTypes.ts
export type ScenarioDefinition = {
  // ...既有欄位...
  /** 本關綁定的官方角色 id；設定後開局固定使用該角色，不可選角。 */
  officialCharacterId?: string
}
```

### 5.2 `loadScenario` 注入流程

現行 `loadScenario` 刻意不綁定名冊角色（`activeCharacterIds = []`）。改為：

1. 若 `scenario.officialCharacterId` 存在：
   - 從名冊讀取該角色（不存在則依 §4.2 自動建立）。
   - 將其養成資料（五維加成、初始功法、天賦、外觀）注入開局玩家（沿用 `createInitialPlayers` 的角色注入路徑，或直接覆寫 `compilePlayers` 產生的第一位人類玩家）。
   - `activeCharacterIds = [officialCharacterId]`（局末結算回寫到該角色）。
2. 若未設定：維持現行行為（`activeCharacterIds = []`）。

> **注意**：劇本關卡的玩家等級／五維目前由 `ScenarioDefinition` 的玩家配置決定。
> 綁定官方角色後，**以名冊累積進度覆蓋關卡預設**（跨局累積的語意）。
> 編輯器產出的測試關卡（無 `officialCharacterId`）不受影響。

### 5.3 局末回寫

沿用多角色結算架構（`settleActiveCharacterRewards`）：

- 每次局末（**含失敗局**）回寫：殘卷、本局獲得功法併入 `unlockedSkillIds`、`gamesPlayed`。
- `runId` 登記制防重維持不變。

## 6. 專屬功法解鎖：掛劇情進度，不掛卷

- 專屬功法**免費預學**：隨篇章進度自動解鎖（通關某關、擊敗某 Boss），不花卷。
- 掛鉤點：沿用 `on-victory`／`on-defeat-boss` 觸發器，或新增 `unlock-skill` 觸發效果：
  - 觸發時將 `skillId` 併入官方角色的 `unlockedSkillIds`（可培養清單）。
  - 是否直接進 `learnedSkillIds`（已學）建議**直接學會**——敘事獎勵不應再被卷經濟擋住。
- 殘卷經濟不變：官方角色的卷只花在**天賦**與**五維**（培養面板沿用）。

## 7. UI 變更

| 位置 | 變更 |
|---|---|
| 名冊列表（`CharacterLibraryScreen`） | 官方角色顯示標籤（如「📖 篇章主角」）；刪除／改名按鈕隱藏或禁用 |
| 劇本關卡選擇（`CampaignScenarioTab`） | 顯示本關固定角色與**建議培養進度**（如「建議等級 5+／已學 3 門功法」） |
| 沙盒選角（`GameStartScreen`） | 「使用角色」下拉過濾未解鎖的 `isOfficial` 角色（篇章全通關後解鎖，見 §8）；已解鎖者顯示解鎖標記 |
| 結算畫面（`GameOverModal`） | 顯示官方角色獲得的殘卷（多角色架構已支援） |

## 8. 邊界決策：沙盒能否使用官方角色

**決策：篇章全通關後解鎖（條件式解鎖）。**

- **預設鎖定**：篇章未全通關前，沙盒選角下拉**過濾掉** `isOfficial` 角色。
- **通關解鎖**：該官方角色綁定篇章的**所有關卡**（`campaignScenarioCatalog` 中同 `chapterId` 的劇本）皆已通關（`getScenarioClearances()[scenarioId] === true`）後，沙盒即可選用該角色。
- **解鎖意涵**：這是「篇章完成獎勵」——玩家證明自己已體驗完該篇章故事，才可帶著篇章主角（含專屬功法）進沙盒自由遊玩。稀缺性由「必須先通關整個篇章」保障，同時給予培養投入的長期回報。
- **實作**：
  - 新增純函式 `isOfficialCharacterUnlockedForSandbox(characterId)`（`characterRoster.ts` 或 `campaignClearance.ts`）：查 `chapterId` → 列出該篇章所有 scenarioId → 全部 `cleared === true` 才回傳 `true`。
  - 沙盒選角下拉過濾條件：`!isOfficial || isOfficialCharacterUnlockedForSandbox(id)`。
  - 名冊列表中，未解鎖的官方角色可顯示鎖定提示（如「🔒 通關篇章後可在沙盒使用」），已解鎖顯示解鎖標記。
- **注意**：專屬功法隨角色帶入沙盒（解鎖即含全部已學專屬功法）；沙盒平衡以「通關整個篇章的培養進度」為預期基準。

## 9. 實作階段

| 階段 | 內容 | 依賴 |
|---|---|---|
| **Phase 1：官方角色基礎設施** | `isOfficial`／`chapterId` 旗標、官方角色目錄與種子資料（凌淵 + 四件套）、名冊 UI 標籤、禁止刪除／改名、沙盒過濾（含篇章通關解鎖判定） | 無 |
| **Phase 2：篇章綁定** | `ScenarioDefinition.officialCharacterId`、`loadScenario` 注入與自動建立、局末回寫接線、關卡建議進度顯示 | Phase 1、第一章關卡清單 |
| **Phase 3：專屬功法獨佔** | `exclusiveCharacterId` 標記、取得路徑過濾、`unlock-skill` 劇情解鎖掛鉤 | Phase 1、2 |

## 10. 影響檔案（預估）

| 檔案 | 變更 |
|---|---|
| `src/game/characterRoster.ts` | `isOfficial`／`chapterId` 欄位、刪除／改名防護、官方角色自動建立 |
| `src/game/catalogs/officialCharacterCatalog.ts`（新） | 官方角色定義（凌淵等） |
| `src/game/catalogs/externalSkillCatalog.ts`、`innerSkillCatalog.ts` | `exclusiveCharacterId` 欄位與專屬功法定義 |
| `src/game/lootFactory.ts`、`martialHallActions.ts`、`sectGateActions.ts`、事件系統 | 取得路徑過濾獨佔功法 |
| `src/editor/editorTypes.ts` | `ScenarioDefinition.officialCharacterId` |
| `src/game/gameStore.ts` | `loadScenario` 注入官方角色 |
| `src/components/CharacterLibraryScreen.tsx` | 官方標籤、刪除／改名防護 |
| `src/components/CampaignScenarioTab.tsx` | 固定角色與建議進度顯示 |
| `src/components/GameStartScreen.tsx` | 沙盒選角過濾官方角色 |
| `src/game/rules/triggerRules.ts`（或事件系統） | `unlock-skill` 劇情解鎖效果 |

## 11. 驗證

- 名冊：官方角色不可刪除／改名；沙盒下拉不出現未解鎖的官方角色；篇章全通關後沙盒可選用並顯示解鎖標記。
- 篇章：首次進入第一章自動建立凌淵（初始狀態）；重玩帶入累積進度；失敗局也回寫成長。
- 獨佔：武館／門派／掉落／事件皆不出現專屬功法；僅凌淵的功法設定頁可見。
- 解鎖：通關指定關卡後專屬功法自動學會，不扣卷。
- 回歸：沙盒（非官方角色）與現有劇本（無 `officialCharacterId`）行為不變；完整測試套件通過。

## 12. 開發細節補充（2026-08-28 代碼審查後定案）

> 本章節為實際審查 `lootFactory.ts`、`eventResolver.ts`、`martialHallSkillCatalog.ts`、
> `scenarioCompiler.ts`、`triggerRules.ts`、`characterRoster.ts`、`campaignClearance.ts` 後
> 的開發細節定案，取代 §4–§6 中與此衝突的描述。

### 12.1 專屬功法排除：複用 `lootExcluded` + `exclusiveCharacterId` 並用

`ExternalSkill` 已有 `lootExcluded?: boolean` 欄位，`lootFactory.ts` 的 `toSkillLoot` 已過濾之。
專屬功法**兩者並用**：

- `lootExcluded: true`：負責掉落排除（現成機制，零改動）。
- `exclusiveCharacterId`：負責語意標記與 UI 顯示（「凌淵專屬」）。

### 12.2 功法取得路徑洩漏點盤點（實測結果）

| 取得路徑 | 現況 | 是否需改 |
|---|---|---|
| 怪物掉落 `createLootForPlayer` | `toSkillLoot` 已過濾 `lootExcluded` | ✅ 設 `lootExcluded` 即可 |
| 巢穴傳授 `getLearnableSkill` | 只用 `jianghuExternalSkills` | ✅ 專屬功法不放進江湖目錄即可，零改動 |
| 武館 `getMartialHallSkills` | 只用 `progressionInner/ExternalSkills` | ✅ 零改動 |
| 門派 `getSectGateSkills` | 同上 | ✅ 零改動 |
| **探索事件 `getRandomLearnableSkill`** | `eventResolver.ts` 用 `allInner/ExternalSkillCatalog` **且無任何過濾** | ⚠️ **唯一洩漏點，必改** |

唯一必改的戰鬥/事件代碼：

```ts
// eventResolver.ts — getRandomLearnableSkill
const unlearned = catalog.filter((skill) => !learned.has(skill.id) && !skill.exclusiveCharacterId)
```

### 12.3 專屬功法目錄放置：新增 `officialExclusiveSkills.ts`

`allExternalSkillCatalog`（`martialHallSkillCatalog.ts`）是聚合點。專屬功法：

- **加入** `allInnerSkillCatalog` / `allExternalSkillCatalog` 聚合 → 功法設定頁、戰鬥查詢、`getExternalSkill` 可查找。
- **不加入** `progressionInner/ExternalSkills`（武館/門派）與 `jianghuExternalSkills`（掉落/巢穴）→ 其他取得路徑天然排除。

### 12.4 官方角色建立：新增 `ensureOfficialCharacter`（冪等）

`createCharacter` 用 `generateId()` 隨機 id 且名稱重複會失敗，不適用官方角色。新增：

```ts
/** 確保官方角色存在於名冊（冪等）：不存在則以定義建立，存在則回傳現有累積進度。 */
export function ensureOfficialCharacter(def: OfficialCharacterDefinition): PersistentCharacter
```

- 以固定 `characterId`（如 `'official-lingyuan'`）查名冊。
- 不存在 → 以 `initialAttributes`／初始功法建立（`isOfficial: true`、`chapterId`）。
- 存在 → 直接回傳（跨局累積語意）。
- `getStored()` 的缺省相容邏輯會為舊角色補 `createDefaultProgression()` 預設值，官方角色經此路徑亦相容。

### 12.5 刪除／改名防護點

- `deleteCharacter`：`isOfficial` 直接回傳 `false`。
- `updateCharacter`：官方角色擋**名稱**修改；稱號／外觀建議一併擋（保持官方一致性）。
- UI 端 `CharacterLibraryScreen` 的刪除／編輯按鈕同步隱藏。

### 12.6 篇章識別：現況「一個 scenario = 一個章節」

**設計文件與現況的最大落差**：`ScenarioDefinition` 只有 `chapterIndex: number`（序數），
**沒有 `chapterId`**；每個 scenario 的 `id` 同時作為 `storyDialogueCatalog` 索引鍵；
目前一個劇本檔即一個章節（序章 0、森林獵殺 1、湖風嘆 2）。

**短期定案**：篇章 = 單一 scenario，`OfficialCharacterDefinition.chapterId` 直接對應 scenario `id`。
沙盒解鎖判定簡化為：

```ts
export function isOfficialCharacterUnlockedForSandbox(characterId: string): boolean {
  const character = getCharacter(characterId)
  if (!character?.isOfficial || !character.chapterId) return false
  return getScenarioCleared(character.chapterId) === true
}
```

未來一個篇章拆多關時，再引入 `ScenarioDefinition.chapterId?: string` 群組欄位，
解鎖判定改為「同 chapterId 的所有 scenario 全通關」。§8 的「所有關卡」描述保留為長期語意。

### 12.7 `loadScenario` 注入接點：編譯後覆寫，不改 `compilePlayers`

`compilePlayers`（`scenarioCompiler.ts`）保持純粹（編輯器職責），注入是遊戲端職責。
在 `loadScenario` 中、`buildGameStateFromScenario` 之後覆寫第一位人類玩家：

```ts
if (scenario.officialCharacterId) {
  const official = ensureOfficialCharacter(getOfficialCharacterDefinition(scenario.officialCharacterId))
  gameState = {
    ...gameState,
    players: gameState.players.map((p, i) => i === 0 && !p.isAI
      ? injectOfficialProgress(p, official)  // 覆寫五維/等級/功法/天賦/外觀
      : p),
    activeCharacterIds: [official.id],
  }
}
```

`injectOfficialProgress`（新純函式）：以名冊的 `attributeBonuses`、`learnedSkillIds`、`talentIds`
覆寫玩家；**保留**關卡設定的位置、金錢、道具。

### 12.8 專屬功法解鎖掛鉤：掛局末結算，不改觸發器

`triggerRules.ts` 的 `executeAction` 是純 GameState 操作；「解鎖功法到名冊」是 localStorage
副作用，塞進觸發器會破壞分層。

**定案（方案 A）**：觸發器不改。專屬功法解鎖掛在**局末結算**——
`settleActiveCharacterRewards` 時，檢查該官方角色 `storySkillUnlocks` 中
`scenarioId === currentScenarioId` 的功法，**勝利時**直接併入 `learnedSkillIds`（免費）。

- 通關即解鎖，語意乾淨；失敗局不解鎖（`won` 參數把關）。
- `applyEndGameRewards` 已是唯一名冊回寫點，解鎖邏輯集中，冪等性（runId 登記）自動覆蓋。
- §6 的「`unlock-skill` 觸發器」描述**作廢**，以此節為準。

### 12.9 沙盒解鎖 UI 過濾點

`GameStartScreen.tsx` 選角下拉 options 過濾：

```ts
options={rosterCharacters
  .filter((c) => !c.isOfficial || isOfficialCharacterUnlockedForSandbox(c.id))
  .map((c) => ({ label: `${c.name}${c.isOfficial ? ' 📖（篇章主角）' : ''}`, value: c.id }))}
```

名冊列表（`CharacterLibraryScreen`）顯示全部官方角色，未解鎖者加鎖定提示
（如「🔒 通關篇章後可在沙盒使用」）。

### 12.10 `initialLevel` 語意：開局等級錨點（每次開局重置）

`PersistentCharacter` **沒有等級欄位**——等級是局內狀態（`PlayerState.level`），
名冊只存五維加成與功法。

**定案**：`OfficialCharacterDefinition.initialLevel` 作為**開局等級錨點**——
每次開局（含重玩）都重置到 `initialLevel`；跨局累積的只有五維／功法／天賦／殘卷。

- 理由：避免等級通膨破壞後續關卡難度；「偷步挑戰」的成長感由五維／功法／天賦承擔。
- 注入時同步設定 `player.level = initialLevel` 與對應經驗（`getExperienceRequired` 換算或直接 `experience: 0`）。

### 12.11 修訂後工作清單

**Phase 1（依賴順序）**：

1. `characterRoster.ts`：`isOfficial`/`chapterId` 欄位 + `ensureOfficialCharacter` + 刪除/改名防護。
2. `officialCharacterCatalog.ts`（新）：凌淵定義（`initialLevel` = 開局等級錨點）。
3. `officialExclusiveSkills.ts`（新）：四件套功法（`lootExcluded: true` + `exclusiveCharacterId`），加入 `allInner/ExternalSkillCatalog` 聚合。
4. `eventResolver.ts`：`getRandomLearnableSkill` 過濾 `exclusiveCharacterId`（唯一戰鬥代碼改動）。
5. `campaignClearance.ts` 或 `characterRoster.ts`：`isOfficialCharacterUnlockedForSandbox`。
6. UI：名冊標籤/防護、沙盒下拉過濾。

**Phase 2**：

7. `editorTypes.ts`：`ScenarioDefinition.officialCharacterId`。
8. `gameStore.loadScenario`：`ensureOfficialCharacter` + `injectOfficialProgress` 注入 + `activeCharacterIds` 接線。
9. `applyEndGameRewards`（或其上層）：`storySkillUnlocks` 勝利解鎖（§12.8 方案 A）。
10. UI：關卡選擇顯示固定角色與建議進度。

### 12.12 待討論決策點

| # | 議題 | 建議 | 狀態 |
|---|---|---|---|
| 1 | 篇章識別（§12.6） | 短期篇章 = 單一 scenario；未來再引入 chapterId 群組 | 待確認 |
| 2 | 劇情解鎖掛鉤（§12.8） | 掛局末結算（勝利時），不改觸發器 | 待確認 |
| 3 | 等級錨點（§12.10） | 每次開局重置到 `initialLevel`；跨局累積五維/功法/天賦/殘卷 | 待確認 |
| 4 | 官方角色稱號/外觀可否改（§12.5） | 建議一併擋 | 待確認 |
