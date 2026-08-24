# 結局戰績結算開發設計文件

## 1. 文件目的

- 在遊戲結束彈窗（勝利或失敗）中，向玩家展示本局「戰績」，讓玩家清楚知道這次的結果與過程。
- 定義可直接拆分成工程任務的資料模型、累積機制、結算計算與 UI 渲染規範。
- 與現有 `GameOverModal`、`GameState`、`SystemOverlays` 及各行動模組（戰鬥、建設、探索、道具、門派）保持一致。
- 本文件為「設計基準與進度追蹤」；標記為「提案」的內容尚未視為最終規則，標記為「已完成」的內容代表已接入程式。

## 1.1 目前開發狀態

- **狀態：實作完成（2026-08-18）。**
- 已完成：
  - 新增 `RunStats` 型別與 `GameState.runStats` 欄位，並在 `createGameState` / `createDebugGameState` 初始化。
  - 新增 `src/game/runStats.ts` 集中式 helper（`incrementRunStat` / `bumpRunStatMax` / `addMoneySpent` / `recordMaxLevel`）。
  - 各行動模組累加 `runStats`：戰鬥（擊敗、摧毀巢穴、傷害峰值）、建設（建造／升級／防禦設施）、探索（解決事件）、道具點（收集道具）、門派與武館（參悟功法、金錢消費）、商店與修理（金錢消費）。
  - 最高等級與五維快照在 `gameStore.updateGameState` 統一掃描人類玩家記錄，涵蓋所有升級來源。
  - 新增 `src/game/battleRecord.ts` 與 `computeBattleRecord` 純函式。
  - `GameOverModal` 新增 `record` prop 並以 antd `Descriptions` 呈現「本局戰績」。
  - `SystemOverlays` 呼叫 `computeBattleRecord(gameState)` 傳入 `record`。
  - `runStats` 隨 `GameState` 一併序列化，讀檔自動還原。
  - 新增 `runStats.test.ts` 與 `battleRecord.test.ts`；tsc 無錯誤、531 個測試全數通過。
- 暫緩：
  - 「歷史最佳」跨局對比（需擴充存檔槽，見第 6 節）。
  - 失敗時「距離勝利還差 X 個巢穴」的目標提示。
  - `buildingsRepaired`（據點建築修復）目前無對應功能，保留欄位為 0 供未來擴充。

## 2. 核心設計概念

### 2.1 設計目標

- **結果透明**：無論勝利或失敗，玩家都能看到本局達成的進度與關鍵數據。
- **過程可讀**：不只顯示最終快照，也顯示整局累積的戰鬥、建設與探索行為。
- **低風險接入**：資料來源明確，新增累積結構不影響既有回合邏輯；結算為純函式，UI 與邏輯解耦。
- **可測試**：累積與結算邏輯以純函式實作，便於撰寫單元測試。

### 2.2 三層架構

```text
累積層：各行動模組在事件發生時累加 runStats（掛在 GameState）
   ↓
結算層：computeBattleRecord(gameState) 合併 runStats + 最終快照 → BattleRecord
   ↓
渲染層：GameOverModal 接收 record 並以 Descriptions / Statistic 呈現
```

## 3. 資料模型

### 3.1 累積結構 `RunStats`

新增 `RunStats` 型別，掛在 `GameState.runStats` 上，由各行動模組在對應事件發生時累加。

```ts
export type RunStats = {
  /** 存活回合數（由 round 快照讀取，不在此累積）。 */
  creaturesDefeated: number      // 擊敗 Creature 數
  nestsDestroyed: number         // 摧毀 Creature 巢穴數
  buildingsBuilt: number         // 建造據點建築數
  buildingsUpgraded: number      // 升級據點建築數
  buildingsRepaired: number      // 修復據點建築數
  eventsResolved: number         // 解決探索事件數
  itemsCollected: number         // 收集道具數
  skillsLearned: number          // 參悟功法數（內功 / 外功）
  defenseStructuresBuilt: number // 建造地圖防禦設施數
  maxNormalAttackDamage: number  // 最高普通攻擊單次傷害（人類玩家造成）
  maxExternalSkillDamage: number  // 最高外功攻擊單次傷害（人類玩家造成）
  maxLevelReached: number         // 本局達到的最高等級（人類玩家）
  attributesAtMaxLevel: PlayerAttributes | null // 達到最高等級時的五維快照
  moneySpent: number              // 累計金錢消費數（人類玩家花費）
}
```

- 初始值：所有欄位為 `0`，在 `worldSetup` / 初始 `GameState` 建立時初始化；`attributesAtMaxLevel` 初始為 `null`。
- 存放位置：`GameState.runStats`，隨存檔一併序列化（不影響既有欄位）。
- 傷害類欄位語意：記錄「單次攻擊結算後的實際傷害」最大值，僅統計人類玩家對目標（Creature / 巢穴 / 防禦設施 / 其他玩家）造成的傷害；每次攻擊結算後與現值取 `Math.max` 更新。
- 等級快照語意：`maxLevelReached` 記錄人類玩家本局達到的最高等級；當等級刷新峰值時，同步以 `player.attributes` 深拷貝寫入 `attributesAtMaxLevel`。因等級只增不減，最終值即峰值；顯式記錄可避免未來等級機制變動時遺漏。

### 3.2 結算結構 `BattleRecord`

新增 `BattleRecord` 型別，由 `computeBattleRecord` 產出，供 `GameOverModal` 渲染。

```ts
export type BattleRecord = {
  won: boolean
  reason?: 'all-players-defeated' | 'all-bases-inactive'
  roundsSurvived: number         // 存活回合（= gameState.round）
  playerLevel: number            // 玩家等級（取人類玩家）
  prestige: number               // 玩家聲望
  governanceRank: number         // 治理階級
  money: number                  // 金錢結餘
  remainingBases: number         // 剩餘據點數
  remainingNests: number         // 剩餘巢穴數
  stats: RunStats                // 累積戰績
}
```

### 3.3 累積來源對照表

| `RunStats` 欄位 | 累加觸發點 | 負責模組 |
|---|---|---|
| `creaturesDefeated` | Creature 被擊敗（氣血歸零） | `combatActions` |
| `nestsDestroyed` | Creature 巢穴被摧毀 | `combatActions` / `creatureActions` |
| `buildingsBuilt` | 據點建築建造完成 | `buildingActions` |
| `buildingsUpgraded` | 據點建築升級完成 | `buildingActions` |
| `buildingsRepaired` | 據點建築修復完成 | `buildingActions` |
| `eventsResolved` | 探索事件解決 | `explorationActions` |
| `itemsCollected` | 道具點拾取 / 事件獲得道具 | `itemActions` / `explorationActions` |
| `skillsLearned` | 參悟內功 / 外功 | `sectGateActions` / `martialHall` |
| `defenseStructuresBuilt` | 地圖防禦設施建造完成 | `buildingActions`（防禦設施） |
| `maxNormalAttackDamage` | 人類玩家普通攻擊結算後的實際傷害 | `combatActions`（普通攻擊） |
| `maxExternalSkillDamage` | 人類玩家外功攻擊結算後的實際傷害 | `combatActions`（外功攻擊） |
| `maxLevelReached` | 人類玩家升級時刷新峰值等級 | `characterFactory`（升級） |
| `attributesAtMaxLevel` | 升級刷新峰值時快照五維 | `characterFactory`（升級） |
| `moneySpent` | 人類玩家任何花費金錢的行為（建造 / 升級 / 修復 / 修理 / 商店 / 醫療 / 門派參悟等） | 各花費模組（`buildingActions` / `itemActions` / `sectGateActions` / 商店與醫療等） |

## 4. 結算計算

### 4.1 純函式 `computeBattleRecord`

- 檔案：`src/game/battleRecord.ts`
- 簽名：`computeBattleRecord(gameState: GameState): BattleRecord`
- 邏輯：
  - `roundsSurvived = gameState.round`
  - 取人類玩家（非 `isAI`）作為結算對象；若有多名玩家，取 `activePlayerId` 對應者，缺省取第一個非 AI 玩家。
  - `playerLevel = player.level ?? 1`
  - `prestige = player.prestige`
  - `governanceRank = player.governanceRank ?? 1`
  - `money = player.money`
  - `remainingBases = gameState.bases.filter(b => b.active !== false).length`
  - `remainingNests = gameState.creatureNests.length`
  - `stats = gameState.runStats`
- 不修改 `gameState`，純讀取。

### 4.2 顯示欄位清單（MVP）

| 類別 | 欄位 | 來源 |
|------|------|------|
| 結算 | 結果 / 結束原因 | 既有 `won` / `reason` |
| 角色 | 最高等級 / 該等級五維（臂力・根骨・身法・內息・悟性） | `stats.maxLevelReached` / `stats.attributesAtMaxLevel` |
| 歷程 | 存活回合 | `roundsSurvived` |
| 角色 | 等級 / 聲望 / 治理階級 / 金錢 / 累計消費 | `playerLevel` / `prestige` / `governanceRank` / `money` / `stats.moneySpent` |
| 戰鬥 | 擊敗怪物 / 摧毀巢穴 | `stats.creaturesDefeated` / `stats.nestsDestroyed` |
| 戰鬥 | 最高普通攻擊傷害 / 最高外功攻擊傷害 | `stats.maxNormalAttackDamage` / `stats.maxExternalSkillDamage` |
| 建設 | 建造 / 升級 / 修復 / 防禦設施 | `stats.buildingsBuilt` / `buildingsUpgraded` / `buildingsRepaired` / `defenseStructuresBuilt` |
| 探索 | 解決事件 / 收集道具 / 參悟功法 | `stats.eventsResolved` / `itemsCollected` / `skillsLearned` |
| 殘局 | 剩餘據點 / 剩餘巢穴 | `remainingBases` / `remainingNests` |

## 5. UI 渲染規範

### 5.1 `GameOverModal` 調整

- props 新增：`record?: BattleRecord`
- 保留既有勝 / 負標題與結束原因段落。
- 標題下方新增「本局戰績」區塊，使用 antd `Descriptions`（column 響應式）或 `Statistic` 卡片網格呈現第 4.2 節欄位。
- 戰績區塊之後保留「重新開始」按鈕。
- 若 `record` 為 `undefined`，降級為只顯示既有勝負段落（相容舊呼叫）。

### 5.2 `SystemOverlays` 調整

- 呼叫 `GameOverModal` 前先執行 `computeBattleRecord(gameState)`。
- 將結果以 `record` prop 傳入。

```tsx
<GameOverModal
  open={Boolean(gameState.gameOver || gameState.gameWon)}
  won={Boolean(gameState.gameWon)}
  reason={gameState.gameOverReason}
  record={computeBattleRecord(gameState)}
  onRestart={() => gameStore.restartGame()}
/>
```

### 5.3 視覺建議

- 勝利：標題綠色調；失敗：標題中性灰。
- 戰績區塊以 `Descriptions` 分組（角色 / 戰鬥 / 建設 / 探索 / 殘局），提升可讀性。
- 數值使用 `Statistic` 強調關鍵指標（等級、聲望、擊敗怪物數）。

## 6. 可選增強（暫緩）

### 6.1 歷史最佳對比

- 在存檔槽（建議 `gameSave.ts` 的 `GAME_SAVE_SLOT_COUNT` 之外另設最佳紀錄）儲存 `BattleRecord` 最佳值。
- 彈窗中顯示「本次 vs 最佳」對比，強化重玩動機。
- 需擴充存檔結構與讀寫邏輯，風險較高，故暫緩。

### 6.2 失敗目標提示

- 失敗時額外標註「距離勝利還差 X 個巢穴」（`remainingNests` 即為 X）。
- 給玩家明確的下一局目標感，實作成本低，可於 MVP 後補上。

## 7. 工程拆分與驗收條件

### 7.1 任務拆分

1. 新增 `RunStats` 型別與 `GameState.runStats` 欄位，並在初始 `GameState` 初始化為全 0。
2. 在 `combatActions` / `buildingActions` / `explorationActions` / `itemActions` / `sectGateActions` 對應事件累加 `runStats`。
3. 新增 `src/game/battleRecord.ts` 與 `computeBattleRecord` 純函式。
4. 新增 `BattleRecord` 型別。
5. 調整 `GameOverModal` 接收並渲染 `record`。
6. 調整 `SystemOverlays` 傳入 `record`。
7. 補充單元測試（累積正確性、`computeBattleRecord` 輸出、UI 降級相容）。

### 7.2 驗收條件

- 勝利與失敗彈窗均顯示「本局戰績」區塊。
- 戰績數值與實際遊戲行為一致（擊敗 3 隻怪物則顯示 3）。
- 不傳 `record` 時彈窗不崩潰，僅顯示既有勝負段落。
- `tsc -b --noEmit` 無錯誤；既有測試與新增測試全數通過。
- 存檔讀取後 `runStats` 正確還原（不遺失累積資料）。

## 8. 風險與注意事項

- **多玩家**：目前 `humanPlayerCount` 為唯一玩家來源（AI 玩家數已停用），結算取人類玩家即可；若未來恢復 AI 玩家，需明確結算對象。
- **巢穴重建**：`creatureActions` 在防禦設施被摧毀時可能重建巢穴（見既有待辦），`nestsDestroyed` 與 `remainingNests` 需以「實際摧毀次數」與「當前巢穴數」分開計，避免重複計入。
- **序列化**：`runStats` 需納入 `gameSave` 序列化，否則讀檔後戰績歸零。
