# 代碼健康度與優化建議報告

**專案**：武行山河（mygame2）
**審查日期**：2026-08-31
**技術棧**：React 19.2 + TypeScript 6.0 + Vite 8.2 + Ant Design 6.5
**規模**：`src/` 約 3.0 萬行原始碼；102 個測試檔、1108 個測試（全數通過）
**審查方式**：靜態分析 + 依賴方向追蹤 + 熱路徑推算，所有結論均附檔案與行號證據

---

## 1. 專案總覽

### 1.1 目錄劃分

專案採用清楚的分層意圖，這是本次審查最值得肯定的基礎：

```
src/
  game/
    catalogs/   資料目錄（功法、道具、裝備、建築、Buff）— 純資料，無邏輯
    rules/      純規則函式（65 個檔）— 無副作用，state → 計算結果
    actions/    領域動作（state, args) → { state, result }
    ai/         AI 決策（fuzzy / decisionTree / graphSearch / perception / policy）
    gameStore.ts  狀態容器 + 用例編排
  components/   React UI（43 個檔）
  editor/       劇本編輯器（獨立 entry）
  hooks/        自訂 hooks
  lib/          analytics
```

**優點**：
- `rules/` 為純函式層，測試覆蓋率高（1108 個測試），這讓大規模重構有安全網。
- `actions/` 統一回傳 `{ state, result }` 契約，狀態變更可預測。
- 寫入路徑高度收斂：全專案僅 **7 個 UI 檔案** import `gameStore`，其餘元件皆為唯讀。
- 已有 `previewOrchestration.ts`、`storeAdapters.ts`、`buildingViewData.ts`、`buildingActionRegistry.ts` 等抽象，證明團隊具備良好的重構意識與模式認知。
- JSDoc 品質在同規模專案中屬上乘，多處記載了「為什麼」而非只有「做什麼」（詳見 §3.3）。

### 1.2 明顯的架構問題

| 問題 | 證據 | 嚴重度 |
|---|---|---|
| **`gameStore.ts` 為 God Object** | 2687 行、約 110 個公開成員、15 類異質職責、190 行 import 區塊（約 50 個模組） | 高 |
| **分層不是單向的** | 存在 3 條實質雙向依賴邊：`rules ↔ actions`、`rules ↔ ai`、`types ↔ catalogs` | 中 |
| **遊戲核心反向依賴編輯器層** | `gameStore.ts:173-175`、`rules/triggerRules.ts:2`、`scenarioStorage.ts:1` import `../editor/` | 中 |
| **新舊實作並存（比未重構更危險）** | `useItem` 在 store（324 行）與 `actions/itemActions.ts`（294 行）**完整雙寫**，UI 走 store 版、AI 走 action 版 | 高 |
| **AI 規則檔層級錯置** | `aiDefenseRules.ts`、`aiSupportRules.ts`、`aiSelfPreservationRules.ts` 在 `src/game/` 根層，其餘 AI 程式碼在 `src/game/ai/` | 低 |
| **無機械化分層邊界保護** | `eslint.config.js` 未設定 `import/no-restricted-paths` 或 `no-restricted-imports`，違規只能靠人工審查發現 | 中 |

**耦合結論**：架構的「意圖」是清楚的分層，但「執行」有漏洞。真正的風險不是分層本身，而是**缺少自動化防護**——已存在的 3 條雙向邊都是在無人察覺的情況下累積的。

---

## 2. 健康度分析

### 2.1 架構健康度：**5 / 10**

#### A. `gameStore.ts` 職責過載（嚴重度：高）

單一檔案同時承擔 15 類職責：

| 類別 | 代表成員 | 行號 |
|---|---|---|
| Store 基礎設施 | `updateGameState`、`subscribe`、`useGameState` | 329-362、2686 |
| 局次生命週期 | `startGame`、`restartGame`、`startChallengeGame`、`loadScenario` | 397、763、693、738 |
| 存檔持久化 | `saveGameToSlot`、`loadGameFromSlot`、`getSaveSlots` | 536-606 |
| 局外 meta 進度 | `settleActiveCharacterRewards`、`recordCurrentScenarioClearance` | 430-460、776 |
| 劇情對話 | `startCampaignChapter`、`advanceDialogue`、`confirmBlockingModal` | 461-535、873 |
| 預覽編排 | `previewAttack`、`previewExternalDamage`、`previewRepair` | 1742-1781、809-872 |
| 戰鬥執行 | `executeAttack`、`executeItemBurst`（139 行內嵌） | 1768、1881-2019 |
| 建築內政 | `constructBuilding`、`upgradeBuilding`、`switchBasePolicy` | 1468-1536 |
| 道具背包裝備 | `useItem`（**324 行內嵌**）、`equipEquipment`、`toggleExternalSkill` | 1124-1447 |
| AI 排程 | 6 個 `run*Step`（**共約 550 行**） | 2028-2575 |
| 動畫瞬時效果 | `animateCreatureTurn`、`triggerCreatureShake`、`showActionResult` | 364-366、802、788 |
| 回合流程 | `endPlayerTurn`、`flushPendingCreatureTurn` | 2576-2655、1618 |
| targeting 模式 | `beginAttackTargeting`、`beginFirstAidTargeting` | 888-933 |
| 純規則轉出口 | `spawnCreaturesFromNests`、`getDefenseBuildValidation` | 192-231 |
| 測試後門 | `resetForTest`、`setStateForTest` | 2667-2683 |

**薄封裝比例分析**：約 28 個成員（25%）為零邏輯委派（`runActionOutcome(...)` 單行），約 10 個（9%）為準薄封裝。但**剩餘 65% 含實質內嵌邏輯**——這說明「store 是 thin facade」的敘事並未成立。

**最肥的三個成員**：`useItem`（324 行）、`runAiConstructionStep` + `runAiSupportStep`（約 230 行）、`executeItemBurst`（139 行）。

#### B. 模組級可變狀態（嚴重度：高）

`gameStore.ts:233-273` 有 **8 個模組級 `let`**：

```
gameState、lastGameSettings、currentScenarioId、isChallengeMode
activeCharacterIds、rewardSettled、pendingCreatureTurn、pendingCreatureTurnBasePlayers
```

這構成了 React 看不見的第二套 state——只有 `gameState` 會通知 listeners（`:361`），其餘 7 個變更**不觸發任何重繪**。

值得肯定的是，`pendingCreatureTurn`（`:255-271`）與 `rewardSettled`（`:242-251`）都有 19 行與 10 行的三段式註解，明確記載了「為何用模組級變數而非 state 欄位」與「生命週期」。這是**知情的技術債**，比無註解的技術債好得多。但代價是需要 `resetForTest` / `setStateForTest` 兩個測試後門，且 5 個 `gameStore.*.test.ts` 共用同一份模組狀態，存在測試污染風險。

#### C. 依賴方向違規（嚴重度：中）

期望鏈：`catalogs → types → rules → actions → ai → gameStore → components`

實測違規：

| 違規 | 證據 |
|---|---|
| `rules → actions`（反向） | `rules/dialogueTriggerRules.ts:3`、`rules/triggerRules.ts:4` import `../actions/dialogueActions` |
| `rules ↔ ai`（**雙向**） | `rules/creatureBehaviorRules.ts:4-5` import `../ai/policy/aiPolicyRegistry`；而 `ai/perception/distance.ts:5` re-export `../../rules/mapCellStateRules` |
| `types ↔ catalogs`（**執行期循環**） | `types.ts:11-12` import `{ itemCatalog }`、`{ equipmentCatalog }` 建構 `itemPointLootCatalog`（`:373-382`）；而 13 個 catalog 檔 import `../types` |
| `game → editor`（層級反向） | `gameStore.ts:173-175`、`rules/triggerRules.ts:2`、`scenarioStorage.ts:1` |
| `catalogs → rules`（反向，僅型別） | `catalogs/talentCatalog.ts:2` import type from `../rules/playerStatsRules` |

#### D. 型別設計缺陷（嚴重度：高）

**`BuffInstance` 與 `BuffDefinition` 高度重複，需 4 處手動同步**：

| 定義 | 位置 | 欄位數 |
|---|---|---|
| `BuffDefinition` | `catalogs/buffCatalog.ts:15-96` | 約 55 |
| `BuffInstance` | `types.ts:84-137` | 約 43 |
| **逐字相同的重疊欄位** | — | **約 38** |

`BuffInstance` 僅 4 個獨有欄位（`id`、`definitionId`、`sourceId`、`remainingRounds`）。第三份清單是 `rules/playerDerivedRules.ts:69-81` 的手動白名單：

```ts
for (const key of [
  'attributeMultiplier', 'attributeModifiers', 'maxHealthDamagePercent', ... 'conditional',
] as const) {
  const value = instance[key]
  if (value !== undefined) overrides[key] = value as never   // ← 型別逃逸口
}
```

`as never` 斷言刻意關閉型別檢查——**白名單漏一個欄位，TypeScript 不會報錯**，只會靜默失去該欄位的縮放能力。

**這個風險已經實現**：白名單缺少 `reviveHealthPercent`，導致 `creatureAnimation.ts:24` 必須手寫 `returnLightBuff.reviveHealthPercent ?? definition?.reviveHealthPercent ?? 0.3` 繞過 `getEffectiveBuffDefinition`。同理 `stunned` 在 `creatureTurnPipeline.ts:311` 只讀 definition，忽略 instance override。

專案文件已明確標記此債務：`reports/system/insight-utility-skills-design.md:322` 寫著「每個新屬性需同步改動 4 處」。

**`types.ts`（1014 行）為混合檔**，85 個 export 包含：約 70 個型別、5 個執行期常數、**6 個純函式**（`getExperienceRequired`、`getCriticalRate`、`getAdjacentPositions`、`isSamePosition`、`isWithinRange`、`isAdjacent`）、1 個由 catalog 衍生的執行期資料。

`GameState`（`:955-1028`）有 **73 個欄位**，混合了地圖、實體、UI 預覽、動畫、操作模式、劇本 staging、局外 meta、AI 計畫、日誌，其中 **50+ 為 optional**——大量隱性狀態不變式無法由型別系統保證，全靠散落各處的 `?? []`、`?? false` 補防。

---

### 2.2 性能健康度：**4 / 10**

這是本次審查發現問題最集中的面向。預設地圖 40×40 = **1600 格**（`gameSettings.ts:5-6`）。

#### 【高】P-1：MapGrid 每格呼叫 `getCellVisibility`，形成 O(cells²) 全圖重算

`components/MapGrid.tsx:279` 進入 `cells.map`，`:282` 每格呼叫：

```tsx
getCellVisibility({ map, visibility, bases, defenseStructures, players, creatures,
  creatureNests, resourcePoints, itemPoints, explorationEvents, revealedCreatureCellIds,
  revealedCreatureUntilRound, activePlayerId: activePlayerId ?? '', round: 0,
  creatureActionLogs: [], attackPreview: null, ... }, visibilityPlayerId, cell)
```

呼叫鏈成本：
- `getCellVisibility`（`visibilityRules.ts:79-88`）→ `getPlayerVisibleCellIds`（**無快取**）
- `getPlayerVisibleCellIds`（`:38-66`）→ 對每位存活玩家 + 每個 discovered 據點 + 每個防禦設施各呼叫一次 `getVisionCellIds`
- `getVisionCellIds`（`:14-20`）→ **filter 整張 `map.cells`**

**成本推算**：1600 格 × 19 個視野來源（4 玩家 + 5 據點 + 10 設施）× 1600 格 ≈ **4900 萬次比較，每次 render 都重算**。

附帶問題：`visibilityRules.ts:86-87` 用 `revealedCreatureCellIds?.includes(cell.id)` 與 `visibility.exploredCellIds.includes(cell.id)`（陣列線性查詢），在 per-cell 迴圈內再乘一層 O(n)，而 `exploredCellIds` 中後期接近 1600 筆。

#### 【高】P-2：store 無 selector，任何變更都觸發全樹重繪（與 P-1 互相放大）

- `gameStore.ts:2686` `useSyncExternalStore(subscribe, getState, getState)` — **無 selector**，回傳整個 state 物件
- `App.tsx:35` `const gameState = useGameState()` — **全專案唯一訂閱點**
- `updateGameState` 每次都建新 state 物件 → snapshot 身分改變 → App 必重繪 → 整棵子樹（含 MapGrid 1600 格）重跑

**這意味著：清除一筆 log 也會觸發 P-1 的 4900 萬次比較。** 這是本專案最嚴重的性能組合。

#### 【高】P-3：MapGrid 無 `React.memo`，per-cell 做 11 次全陣列 filter

- `MapGrid.tsx:681` `export default MapGrid`（**未包 memo**）
- `:298-331` 每格對 `players`、`creatures`、`bases`、`creatureNests`、`resourcePoints`、`itemPoints`、`defenseStructures`、`explorationEvents`、`sectGates`、`ruins`、`traps` **各做一次 `.filter()`**（11 次線性掃描 × 1600 格）
- `:337-338` `blockedPositions.some(...)` 線性查詢（應用 Set）
- `:414` 每個防禦設施 marker 呼叫 `getBastionMultipliers`
- `:503-509` 每隻生物 marker 呼叫 `getActiveBuffsForPlayer` + 正則處理

緩解因素：`vite.config.ts:8-11` 已啟用 `babel-plugin-react-compiler`，但 React Compiler **無法**消除 `cells.map` 迴圈內對昂貴函式的逐格呼叫。

#### 【高】P-4：`getActiveBuffDefinitions` 是隱藏成本放大器

`playerDerivedRules.ts:174` 看似 O(buffs)，實際每次呼叫：
- → `getActiveBuffsForPlayer` → `getEquippedExternalSkillBuffs`（`:193`）→ **`allExternalSkillCatalog.find(...)`（`:195`，線性掃描全功法目錄）**
- → `getInnerSkillBuffs`（`:232`）→ **`allInnerSkillCatalog.find(...)`（`:234`，再一次線性掃描）**
- → `.map(getEffectiveBuffDefinition)` → 每個 buff 跑 40 個 key 的 for 迴圈 + `buildScaledBuffDescription`

**無任何 memoization**。而它被呼叫於 `canTraverseTerrain`（`:346`）與 `getTerrainStaminaCost`（`:351`）——**這兩個正是 BFS 內每格都呼叫的函式**（`movementRules.ts:69-73`）。

複合成本：1600 格 BFS × 每格 2 次 × (2 次目錄線性掃描 + 40-key 迴圈)。從呼叫端完全看不出這個成本。

#### 【高】P-5：`creatureTurnPipeline` 迴圈內 `map.cells.find`

- `:149` `isCellTraversable`：`context.map.cells.find(...)` — **每次判斷單格都線性掃描 1600 格**
- `:154` `getCellMoveCost`：同上
- `:159-167` `isOccupiedExcludingDefenses`：對 **7 個位置陣列**連續 `.some(isSamePosition)`
- `:173-176` `isOccupiedByOtherCreature`：**每次呼叫都把 Map 展開成陣列**再線性搜尋
- `:252-256` `neighborCandidates`：4 鄰格 × (2 次 1600-格 find + 7 次 some + 1 次 Map 展開)

**成本推算（單回合）**：30 隻怪 × 10 步 × 4 鄰格 × 2 次 1600-格 find ≈ **380 萬次比較**。

關鍵是：`createCreatureTurnContext`（`:101-146`）已經建好 context，**卻沒有建 `cellsByPosition` 索引**——這是最低成本的高效修復點。

#### 【高】P-6：graph-search AI 每展開節點就 `structuredClone` 完整 state

- `ai/graphSearch/executePure.ts:10` `const copy = structuredClone(state)` — **完整 GameState 深拷貝（含 1600 格 map.cells）**
- `ai/graphSearch/actionGenerators.ts` 的 **7 個 generator 各自呼叫 `executePure`**（`:55, 89, 128, 167, 210, 240, 274`）
- `runGraphSearchStep.ts:7` `MAX_DEPTH = 3`，`searchStrategies.ts:16-32` 為 DFS 全展開（**無 beam width、無節點數上限**）

分支因子 b=10 時即 **1000 次全 state 深拷貝**，可能單次卡住 UI 執行緒。

#### 【中】P-7：Dijkstra 實作被複製 4 份，且每次重建索引

`movementRules.ts:42-44` 每次進 `buildMovementCostMap` 都 `new Map(map.cells.map(...))`（1600 筆）。BFS 本身實作良好（`:57` 用 `queueHead` 索引佇列取代 `shift()`），問題在呼叫頻率：

- `getMovementCostTo`（`:96`）算單一目標成本仍跑**完整 BFS**（無早期 return）
- `targetRules.ts:84` 每次玩家點一格移動都跑一次完整全圖 BFS
- `ai/fuzzy/fuzzyInputs.ts:276` 與 `:391` — **同一次 `computeFuzzyInputs` 內跑 2 次獨立 BFS**
- `gameStore.ts:2367` `runFuzzyStep` 的 `while` 迴圈 `MAX_LOOPS = 50`，每輪呼叫 `computeFuzzyInputs` → 最壞 **50 × (2 次 BFS + 3 次全圖掃描)**

同一個 Dijkstra 在 `movementRules.ts:38`、`ai/decisionTree/actionBuilders.ts:17` 與 `:79`、`ai/fuzzy/goalActionMapper.ts:17` **各有一份實作**。

#### 【中】P-8：localStorage 每回合寫入完整 GameState（同步阻塞）

- 自動存檔呼叫點：`gameStore.ts:452`、`:1638`、`:2647`、`:544`
- `gameSave.ts:97` `localStorage.setItem(key, JSON.stringify({ ..., state, ... }))` — **序列化整個 GameState**
- Payload 主體是 `map.cells`（1600 物件）+ `visibility.exploredCellIds`（可達 1600 字串），粗估單次 **150–400 KB**
- **無節流（debounce）**，4 人局每回合 4 次同步阻塞寫入
- `gameSave.ts:71-88` `getGameSaveSlots()` 一次 `JSON.parse` **全部 11 個 slot**，App 啟動即呼叫（`App.tsx:52`）

#### 【低】做得好的部分

- 主流程**沒有**完整深拷貝：`updateGameState` 用 immutable spread（淺拷貝 + 路徑複製），這是正確設計
- `worldGeneration.ts:263` `createRandomPositions` 已正確使用 `occupiedKeys` Set
- `ai/aiTurnScheduler.ts:83` 用 `setTimeout` 分片，避免單 tick 連續執行多步

---

### 2.3 安全性健康度：**8 / 10**

#### SQL 注入：**不適用**

本專案是純前端 SPA，明確證據：
- `package.json:15-20` runtime 依賴僅 `antd`、`react`、`react-dom`、`react-ga4` — 無 HTTP client、無 DB driver、無 ORM
- `docker-compose.yml` 只有一個 `node:22` CLI 容器，**無 DB service、無後端 service**
- 全部持久化都在 `localStorage`
- 唯一網路出口是 GA4 與同源 `public/data/changelog.json`

因此 SQL injection、SSRF、認證繞過、IDOR 等伺服器端攻擊面**全部不存在**。

連帶推論：**所有遊戲規則都是客戶端權威**，任何防作弊都不可能。單機模式可接受；若未來加入排行榜或多人，整個 `gameStore` 需搬到伺服器。

#### XSS：**無風險**

- 全 `src/` **零** `dangerouslySetInnerHTML` / `innerHTML` / `eval` / `new Function`
- 唯一的 `innerHTML` 在 `public/game-intro.html:783, 787, 808`，屬靜態行銷頁，資料源為同源自家資產
- `ai/policy/aiJsonPolicy.test.ts:66` 的 `eval("alert(1)")` 是**測試用惡意字串**，且該測試驗證它會被 reject（`aiJsonPolicy.ts:112-118` 有型別與範圍驗證）——這是正確的防禦設計

#### 憑證處理：**低風險**

- `lib/analytics.ts:3` `const MEASUREMENT_ID = 'G-XM7THSR92E'` 硬編碼。GA4 Measurement ID 屬**公開識別碼**（本來就會出現在客戶端），非機密。唯一影響是他人可灌假資料。建議移到 `import.meta.env.VITE_GA_ID` 以便切換環境，但**非漏洞**
- 全 `src/` 無 API key / password / secret / token

#### 【中】存檔匯入無 schema 驗證（本節唯一實質問題）

- `gameBackup.ts:70-80` `parseGameBackup` 只檢查 3 件事：`payload.game === 'mygame2'`、`backupVersion === 1`、`entries` 是物件。**完全沒有驗證 entries 的 value 型別或內容**
- `gameBackup.ts:57-67` `restoreGameBackup` 只過濾 key 前綴（`:62`），然後原封不動 `localStorage.setItem(key, value)`
- `gameSave.ts:110-113` 只檢查 `payload.version === 1 && payload.state && typeof payload.state === 'object'`，**接著直接當 GameState 用**

惡意存檔的實際影響：
1. **任意狀態注入**（無限金錢、`gameWon: true`）— 單機遊戲中屬作弊而非安全漏洞
2. **持久化 crash**：注入 `players: "x"` 會在 `updateGameState` 拋錯。因為寫入的是 AUTO_SAVE_SLOT，玩家可能**每次開啟都白屏**，需手動清 localStorage 才能救回。這是實質的健壯性缺口
3. **prototype pollution 不成立**：`JSON.parse` 對 `__proto__` 產生 own property；`restoreGameBackup` 用 `Object.entries` 迭代不觸發 setter
4. **quota 耗盡**：`restoreGameBackup:63` **未包 try/catch**，`QuotaExceededError` 會讓匯入中途拋錯，留下半套不一致資料
5. **跨 key 污染**：前綴檢查是正確防護，無法覆寫其他應用的 key — **這點做得好**

**專案內已有正確範本**：`editor/EditorApp.tsx:191` 的 `JSON.parse` 有 `validateScenario`（`gameStore.ts:739`）把關，是**全專案唯一做對 schema 驗證的匯入路徑**，可直接作為 gameSave / gameBackup 的重構參考。

其他 `JSON.parse` 點驗證品質對比：`settledRuns.ts:28`、`challengeState.ts:34`、`campaignClearance.ts:18`、`scenarioStorage.ts:67` 都以 `as unknown` 起手，較嚴謹。

#### 【低】依賴安全

- `react ^19.2.8`、`vite ^8.2.0`、`typescript ~6.0.2`、`vitest ^4.1.10`、`antd ^6.5.3` — **全部當前主線版本，無明顯過時**
- runtime 依賴僅 4 個，攻擊面極小
- `react-ga4 ^3.0.1` 是唯一第三方 runtime 依賴，維護活躍度較低但功能單純
- `babel-plugin-react-compiler ^1.0.0` + `@rolldown/plugin-babel ^0.2.3` 屬實驗性工具鏈，是**建置穩定性**風險而非安全風險
- **建議確認 `package-lock.json` 是否已提交**，未提交會導致建置不可重現

---

## 3. 可讀性檢查

### 3.1 命名一致性

#### 【中】`blocked` / `occupied` / `excluded` 三詞指同一概念

同樣語意（「這格不能放／不能走」），三種說法分佈在三層：

| 用詞 | 出現位置 |
|---|---|
| `blocked` | `rules/movementRules.ts:17` `getBlockedPositions`、`:39` `blockedPositions`、`:45` `blockedPositionKeys` |
| `occupied` | `actions/creatureTurnPipeline.ts:85-91`（一次宣告 **6 個** `occupiedByBases/CreatureNests/ItemPoints/ExplorationEvents/Ruins/SectGates`）、`worldGeneration.ts:257, 382`、`actions/creatureActions.ts:84`、`rules/targetingRules.ts:79` |
| `excluded` | `worldGeneration.ts:203, 254, 269`、`events/eventSpawner.ts:51`、`worldSetup.ts:63` |

第四種說法是 `getBlockedPositions` 的 option 名 `includeInteractionPoints`（`movementRules.ts:14`）。

更加深歧義的是 `lootExcluded`（`catalogs/externalSkillCatalog.ts:37`）——這裡 `excluded` 是完全不同的意思（排除掉落池）。

**閱讀者必須逐一比對三份實作才能確認語意是否真的相同。**

#### 【中】`creature` / `enemy` 混用，且內部術語漏到 UI

- 主線術語 `creature` 一致性良好（`CreatureState`、`creatureTurnPipeline`、`moveCreatures`），`monster` 幾乎不存在
- 但 **AI 模組改用 `enemy`**：`ai/fuzzy/fuzzyInputs.ts:47, 56` `maxVisibleEnemyDamage`、`ai/graphSearch/scoring.ts:22` `getEnemyMaxDamage`、`aiSelfPreservationRules.ts:15` `enemyPositions`、`ai/policy/aiJsonPolicy.ts:44` `surroundedEnemyCount`（此欄位已進入**使用者可編輯的 JSON policy schema**，改名成本最高）
- **內部術語漏到玩家面前**：`components/GameOverModal.tsx:35` 顯示「所有 **Creature** 巢穴已被摧毀」、`:37`「**Creature** 已消滅所有玩家」——中英混雜的使用者可見文案問題
- 註解用「敵人」但識別字用 `creature`：`gameStore.ts:258`、`:2632`

#### 【低】簡體字混入使用者可見字串

- `ai/graphSearch/actionGenerators.ts:123` `` reason: `本回合击殺 ${enemy.name}` ``（「击」為簡體）
- `ai/decisionTree/actionBuilders.ts:39` 註解「找最近可**达**相鄰格」、`:135`「目標不可**达**時」

#### 【低-中】檔案命名慣例

- `rules/` 65 個檔案，`*Rules.ts` 慣例整體遵守良好
- 例外：`fiveElements.ts`、`functionalSkillScaling.ts`、`commandPanelSkills.ts` 無後綴
- **三個 `player*` 規則檔**（`playerRules.ts`、`playerStatsRules.ts`、`playerDerivedRules.ts`）職責邊界從檔名完全看不出來
- `catalogs/` 下 `skillFactory.ts`、`functionalSkillRegistry.ts`、`officialExclusiveSkills.ts` 用了 `Factory` / `Registry` / 無後綴三種
- 無 `__tests__/` 目錄慣例，5 個 `gameStore.*.test.ts` 分散在目錄各處

#### 【良好】中英文分工慣例清楚

主流模式一致且良好：**識別字全英文、註解與 JSDoc 全繁中、玩家可見字串全繁中**。上述例外屬個別漏網，非慣例混亂。

### 3.2 函數長度與複雜度

#### 最長函式（前 10）

| # | 函式 | 位置 | 約行數 |
|---|---|---|---|
| 1 | `MapGrid` | `components/MapGrid.tsx:75-680` | **606** |
| 2 | `App` | `App.tsx:34-680` | **647** |
| 3 | `useItem` | `gameStore.ts:1124-1447` | **324** |
| 4 | `computeFuzzyInputs` | `ai/fuzzy/fuzzyInputs.ts:159-471` | **313** |
| 5 | `endPlayerTurn`(action) | `actions/turnActions.ts:109-274` | **166** |
| 6 | `executeItemBurst` | `gameStore.ts:1881-2018` | 138 |
| 7 | `runAiConstructionStep` | `gameStore.ts:2104-2229` | 126 |
| 8 | `runFuzzyStep` | `gameStore.ts:2313-2435` | 123 |
| 9 | `runGraphSearchStep` | `gameStore.ts:2480-2575` | 96 |
| 10 | `runCreatureTurn` | `actions/creatureTurnPipeline.ts:617-700` | 85 |

#### 【高】`MapGrid`（606 行單一函式元件）

- **Props 解構單行約 1400 字元**（`:75`）——一行內解構 50+ props 並附預設值，實務上無法閱讀或 code review
- `MapGridProps` 型別宣告 57 行（`:17-73`），其中 `onXxxDetails` / `onXxxSelect` 回呼 **20 個**，是職責過重的直接證據
- `:396` `className` template literal：**單行 5 個巢狀三元 + 5 段字串拼接**，約 500 字元
- `:135-142` **6 層巢狀三元鏈**，且**中間三個分支回傳完全相同的值**：
  ```
  targetingSpec ? specRangeCellIds
    : externalSkillTargeting ? attackableTargetCellIds
    : attackTargeting ? attackableTargetCellIds
    : itemTargeting ? attackableTargetCellIds
    : new Set<string>()
  ```
  應為 `(externalSkillTargeting || attackTargeting || itemTargeting) ? ... : ...`。這是 4 個布林 props 與新框架 `targetingSpec` **並存的過渡期產物**（`:60-61` 註解坦承取代關係）——**兩套機制同時存在**，讀者必須同時理解兩者
- `resolveMapCellAction` 被呼叫兩次（`:352-372` 與 `:373-394`），**20 個參數的物件字面量整段複製**，唯一差異是多了 `marker` 欄位
- **IIFE-in-JSX**（`:500-527`）：雙層立即執行函式包裹，只為在 JSX 中宣告區域變數
- `useMemo` 僅 4 個（`:92, 107, 113, 119`），且 `:92` 的 `blockedPositions` 依賴 8 個陣列的**物件身分**，在 immutable store 下幾乎每次都失效 → 連鎖使 `:107` 的 BFS 重跑

#### 【高】`useItem`（324 行）

- 整個函式是一連串**扁平的 `if (item.effect === 'X') { ... return {...} }` 早期回傳**（`:1164` attribute-up、`:1189` trap、`:1223` scout、`:1254` reveal-creatures、`:1283` recall-base…），每個分支各自重建完整 state
- **這是 switch/registry 模式被寫成 if-chain 的教科書案例**。專案已有 `buildingActionRegistry.ts` 證明團隊懂這個模式，卻沒套用到 item effects
- `consumeItem` 閉包（`:1150-1163`）在每個分支重複呼叫，但每個分支還要**額外手動 spread** `itemEffectsUsedThisTurn: [...(x ?? []), 'trap']`（`:1214`）、`'scout'`（`:1247`）、`'reveal-creatures'`（`:1277`）——同一段樣板複製 5+ 次，**effect 字串手打，打錯不會被型別系統擋住**
- 巢狀深度約 **5-6 層**
- **內嵌重複的距離函式**：`:1288-1289` 區域定義 `const manhattan = (a, b) => ...`，而 `rules/mapCellStateRules.ts` 已有 `manhattanDistance`（`creatureTurnPipeline.ts:146` 還特別註明「委託感知層統一出口，消除雙份實作」）——**同一份程式碼在別處消除了重複，在這裡又製造一份**

#### 【高】`endPlayerTurn`（action，166 行）

- 後 60 行（`:222-273`）是**單一 return 內的巨型物件字面量**，15+ 欄位各自帶 `isRoundComplete ? A : B` 三元
- **最難讀的片段（`:262-273`）— 四層巢狀三元 + `??` 鏈**：
  ```ts
  revealedCreatureCellIds: isRoundComplete
    ? beaconReveal?.revealedCreatureCellIds
      ?? (state.revealedCreatureUntilRound !== undefined && state.round + 1 > state.revealedCreatureUntilRound
        ? undefined
        : state.revealedCreatureCellIds)
    : state.revealedCreatureCellIds,
  ```
  然後 `revealedCreatureUntilRound`（`:270-273`）**把同一段邏輯完整複製一次**，只改欄位名
- **`resourcePoints` 與 `itemPoints` 的三元方向相反**（`:236-237`）：
  ```ts
  resourcePoints: isRoundComplete ? state.resourcePoints : scheduledCreatureTurn?.resourcePoints ?? state.resourcePoints,
  itemPoints:     isRoundComplete ? scheduledCreatureTurn?.itemPoints ?? state.itemPoints : state.itemPoints,
  ```
  **完全對調且無註解解釋**。這極可能是 bug，至少需要讀者停下推敲
- **殘留 debug log（應立即修）**：`:116` `console.log('DEBUG endPlayerTurn early return', {...})` — 這是**全 `src/game/` 唯一的非測試 `console.log`**，會在正式環境每次早期回傳時污染 console

#### 【中】`App`（647 行）

- `:53-101` 從 `useModalState` **一次解構 48 個值**
- `useState` 10 個、`useEffect` 5 個
- **`useMemo` / `useCallback` 零使用**，完全倚賴 React Compiler
- `:144-175` `modalOpen` 是 **26 個條件的 `||` 鏈**
- `:190` render 相關 effect 內 `gameState.map.cells.find(...)`（1600 格線性搜尋）

#### 【中】超長三元鏈（跨檔重複）

- `components/MartialHallModal.tsx:22` 與 `components/SectGateDetailsModal.tsx:20`：**11 段三元鏈的 schoolId → emoji 映射，單行約 400 字元，且兩檔完全重複**。應為 `Record<SchoolId, string>` 常數表（`editor/terrainStyles.ts` 已有這個好模式）
- `actions/explorationActions.ts:60`、`:86`（**完全相同的 5 段三元錯誤訊息鏈**）、`:114`（6 段）——三處複製
- `actions/combatActions.ts:377` 單行約 330 字元；`:467` 與 `:513` **重複同一段 `?? (X === 'rounds' ? Y ?? null : null)` 邏輯三次**

### 3.3 註解與文件

#### 【良好】JSDoc 品質是本專案最強項

抽查結果值得肯定：
- `rules/movementRules.ts:5-11` — `getBlockedPositions` 有完整的「為什麼」註解，明列哪些物件阻擋、哪些可通行、廢墟清除後的行為。**優秀範例**
- `gameStore.ts:255-273` — `pendingCreatureTurn` 有 **19 行**的「為何需要它 / 為何用模組級變數 / 生命週期」三段式註解，**明確記載了循環依賴的權衡**。這是罕見的高品質決策記錄
- `gameStore.ts:242-251` — `rewardSettled` 同樣有「為何需要 + 生命週期」
- `gameBackup.ts:1-11` — 檔案級 JSDoc 說明目的與做法
- `gameSave.ts:31-41` — `rewardStatus` 三態逐行解釋
- `actions/creatureTurnPipeline.ts:100, 218, 304-308` — 帶「切片 I/J/L」與「§9.2」的設計文件交叉引用

**缺口**：`ai/fuzzy/fuzzyInputs.ts` 大量使用 1-2 字元變數名（`c`、`e`、`b`、`h`、`s`、`n`、`g`、`i`）搭配單行註解（`:268-271, 299-302, 361-365`）。**AI 模組整體的註解與命名品質低於 rules / actions 層**。

#### 【中】舊報告與程式碼已脫節

抽查 `reports/analysis/`：

| 報告 | 同步狀況 |
|---|---|
| `code-health-review-2026-08-16.md` | **良好**。抽查其「P-2 移動搜尋已改索引佇列」→ 已驗證（`movementRules.ts:57` `let queueHead = 0`）。「未發現 SQL client、硬編碼 key、dangerouslySetInnerHTML」→ 與本次結論一致。未解項目（P-3 bundle 過大、S-2 客戶端權威）誠實標記為未處理 |
| `code-health-report-2026-08-11.md` | **明顯過期**。`:19` 宣稱 `gameStore.ts` **1519 行**，實測 **2687 行（+77%）**；`MapGrid.tsx` 442→681（+54%）、`App.tsx` 415→684（+65%）。`:50` 引用的 `as unknown as GameState` 已不存在，行號引用已漂移。**結構性洞察仍有效，但所有量化數據與行號均已失效** |

同時發現一處**宣稱過於樂觀**：08-16 報告稱「P-1 Buff 查詢重複已改為 Map 快取」，`playerDerivedRules.ts:64-66` 的 `getBuff` 確實 O(1)，**但同檔 `:195` `allExternalSkillCatalog.find(...)` 與 `:234` `allInnerSkillCatalog.find(...)` 仍是線性掃描，且位於熱路徑**（見 P-4）。

**建議**：在舊報告頂部加 `> ⚠️ 已被 YYYY-MM-DD 報告取代，數據僅供歷史參考`。

### 3.4 難以理解的邏輯

#### 【高】「同一資料的多時間點快照」是最需推敲的類別

6 處都屬同一模式，且 5 處只靠註解防護：

| 位置 | 隱含依賴 |
|---|---|
| `turnActions.ts:196-198` | 體力經驗必須在 `recoverLivingPlayers` **之前**計算（重排即靜默錯誤） |
| `turnActions.ts:186-188` | 烽燧臺揭示必須基於**回合結算後**的敵軍位置，故建臨時 state |
| `turnActions.ts:167-175` | 靈氣外功經驗需「以 `state.players` 最新裝備為準」，**同一 player 有兩份時間點不同的快照，欄位需手動挑選合併** |
| `gameStore.ts:1608-1610` | `scheduledCreatureTurn.players` 是「事件套用前」的舊快照 |
| `creatureAnimation.ts:43-48` | `mergeCreatureAttackBases` 存在的唯一理由是 `result.bases` 為攻擊前 snapshot |
| `App.tsx:37-38` | `ensureOfficialCharacters()` **必須在任何 `getCharacters()` 之前完成**，靠 effect 順序保證，無型別強制 |

#### 【中】三處假 state 物件

- `MapGrid.tsx:282` — 為呼叫 `getCellVisibility` 現場拼 20 欄位假 state，含 `round: 0`、`creatureActionLogs: []` 等**與真實狀態不符的硬編值**。若 `getCellVisibility` 未來讀取 `round`，會靜默取到 0
- `creatureTurnPipeline.ts:677+` `fakeStateForSelection` — 變數名誠實但同樣脆弱
- `gameStore.ts:2607` `getBlockedPositions({ ...currentState, players } as GameState, '', {...})` — **傳空字串當 playerId**，倚賴 `movementRules.ts:19` 的 `player.id !== playerId` 對空字串永真的隱性行為。**完全沒有註解**

#### 【中】命名與實作矛盾

`visibilityRules.ts:26` `getPlayerVisionRange(_state, _playerId)` — 參數加底線前綴（慣例表示未使用）**但函式體實際使用了兩者**（`:28`）。這會誤導讀者。

#### 【中】`searchStrategies.ts` 型別逃生

`ai/graphSearch/searchStrategies.ts:25-27`：
```ts
const edges = current instanceof Object && 'getEdges' in current
  ? (current as any).getEdges(dependencies)
  : []
```
- `current instanceof Object` 對任何非 null 物件恆為 true → **這個檢查毫無作用**
- `as any` 繞過型別系統 — 這是**全 `src/` 非測試碼中唯一的 `as any`**
- `:16-40` 的 `dfs` 是無深度以外剪枝的遞迴，註解稱「已在 getAdjacentNodes 內剪枝」但該函式不在此檔，讀者需跨檔驗證

---

## 4. 代碼復用性檢查

### 4.1 【高】`useItem` 完整雙寫 — 最嚴重的重複

| | store 版 | actions 版 |
|---|---|---|
| 位置 | `gameStore.ts:1124-1447`（**324 行**） | `actions/itemActions.ts:77-370`（**約 294 行**） |
| 分支 | attribute-up(1165)、trap(1190)、scout(1223)、reveal-creatures(1259)、recall-base(1283)、element-burst(1339)、buff(1356)、health/stamina/inner-power(1348-1415) | attribute-up(117)、trap(143)、scout(175)、reveal-creatures(212)、recall-base(238)、element-burst(291)、buff(302)、health/stamina/inner-power(342-365) — **完全同構** |
| 呼叫者 | **UI**：`overlays/PlayerOverlays.tsx:49`；33 個測試 assertion | **AI**：`ai/execution/executeAiAction.ts:62` |

`itemActions.ts:75` 的註解明說「對應 gameStore.useItem 的完整邏輯」——即這是**刻意的複製而非重構過渡**。任何新道具效果都必須手動雙寫，且無自動化檢查。

**這是投報率最高的單一重構**：刪除 store 版，改為 `runActionOutcome(useItemAction)`，可減 324 行，現有 33 個測試即為迴歸網。

### 4.2 【高】「阻擋／佔用位置」計算在 10 處各自拼湊

正規實作是 `rules/movementRules.ts:17-36` `getBlockedPositions(state, playerId, { includeInteractionPoints })`，但以下 9 處**沒有用它**：

| # | 位置 | 差異點 |
|---|---|---|
| 0 | ✅ `rules/movementRules.ts:19-30` | **正規實作**（players/creatures/bases/nests/ruins/sectGates/defenseStructures + 可選互動點） |
| 1 | ❌ `components/MapGrid.tsx:92-107` | 手工複製 7 項清單 + 同樣的 `Number.isFinite` filter，**邏輯完全等價，純複製**（UI 只有 props 沒 state） |
| 2 | ❌ `rules/transportRules.ts:112-119` | `getBlockedPositions(...)` **再手動附加** nests/resourcePoints/itemPoints/events/defenseStructures → nests 與 defenseStructures **重複疊加** |
| 3 | ❌ `rules/defenseRules.ts:29-36` | players（**未排除自己**）… 少了 ruins、sectGates、events、traps |
| 4 | ❌ `actions/itemActions.ts:258-266`（回營符） | 少 ruins/sectGates → **回營可能傳送到廢墟或門派格** |
| 5 | ❌ `gameStore.ts:1304-1313`（回營符 store 版） | 與 #4 **逐行相同**（§4.1 雙寫副作用） |
| 6 | ❌ `actions/creatureActions.ts:85-90` | 收 array 參數而非 state，簽章不對齊 |
| 7 | ❌ `actions/creatureTurnPipeline.ts:128-133` | 拆成 **4 個獨立欄位**（第三種形狀） |
| 8 | ❌ `worldGeneration.ts:379-389` | 10 項清單，少 traps |
| 9 | ❌ `worldGeneration.ts:408-418` | **與 #8 逐行相同**（同檔內 30 行距離複製） |
| 10 | ❌ `worldSetup.ts:64-118` | 5 段漸進式 `excludedPositions` 累積 |

外加測試層：`debugMap.test.ts:45-50, 89-94, 154-162`（同檔 3 份）、`creatureNest.test.ts:130-136`。

**這是最典型的散彈式修改熱點**，且 `reports/analysis/code-health-report-2026-08-11.md:142` 早在半年前就標記過（建議 `getInteractionOccupiedPositions`），**至今未落地**。實際 bug 面：新增一種佔格實體需同步 10 處，漏改即產生「單位重疊」或「生成點蓋在既有物件上」。

### 4.3 【中】測試 fixture 在 39 個檔案重複

已有共用夾具 `testHelpers/aiTestFixtures.ts`（提供 `makePlainMap`、`makeTestPlayer`、`makeTestCreature`、`makeAiTestState` 等），**但只有 11 個檔採用**。

**另外 39 個檔案自行重複定義** `makePlayer` / `makeState` / `makeBase` / `makeCreature`，包含本次 session 新增的 `actions/turnActions.auraExp.test.ts:18`、`actions/turnActions.auraSwap.test.ts:18`、`rules/buffScalingDescription.test.ts:5`。

**證據：實質等價**。比對 `rules/rules.test.ts:7-30` 與 `testHelpers/aiTestFixtures.ts:16-38`：欄位清單、順序、`attributes: { armStrength: 8, constitution: 8, agility: 7, innerEnergy: 5, insight: 7 }`、`innerSkillIds: ['tuna-gong']`、`...overrides` 收尾，**幾乎逐字相同**。`makePlainMap`（11×11 全平原）在至少 4 處各自重寫。

**額外語意陷阱**：`gameStore.test.ts:16` `function makePlayer(overrides: Partial<CreatureState>): CreatureState` — **名為 `makePlayer` 卻回傳 `CreatureState`**，與其他 38 個檔的同名函式語意衝突。

當 `PlayerState`（`types.ts:169-212`，44 個欄位）新增必填欄位時，需修 39 個檔。

### 4.4 【中】AI step 樣板複製 5 份

`gameStore.ts:2028-2575` 的 6 個 `run*Step`：
- **守衛條件**完全同構（`!player?.isAI || state.activePlayerId !== playerId || state.creatureTurnInProgress || state.gameOver || !order`）複製 **5 次**：`:2032, 2110, 2234, 2317, 2440, 2484`
- **`aiDeps` 依賴組裝**（含 14 參數的 `moveCreatures` 呼叫）在 `:2328-2367`、`:2495+`、`:2582-2607` **複製 3 次**，且 `endPlayerTurn` 版用 `currentState.itemPoints` 而 fuzzy 版用 `currentState.itemPoints ?? []`（`:2340` vs `:2593`）→ **潛在不一致**
- **`validate → execute → recordAiStepEvent`** 樣板在 `runAiDefenseStep` 內就複製 4 次（`:2039-2047, 2049-2057, 2061-2070, 2072-2080`）
- **迴圈骨架**（`MAX_LOOPS = 50` + `exitReason` + 統一出口）在 fuzzy / decisionTree / graphSearch 三處複製

抽 `buildAiDependencies(state)` 與 `runAiStepLoop({ playerId, orderType, decide })` 可省約 250 行。

### 4.5 【低】UI Modal 樣板重複（35 個檔案）

三種樣板：

**A. 「詳細資料 + footer={null}」**（≥6 檔）：`CreatureNestDetailsModal.tsx:29-36`、`ResourcePointDetailsModal.tsx:44-51`、`RuinDetailsModal.tsx:24-31`、`ItemPointDetailsModal.tsx:51-57`、`DefenseStructureDetailsModal.tsx:23-29`、`ExplorationEventDetailsModal.tsx:51-57`。

**注意 `RuinDetailsModal` 未使用 `LocationDetailsCard`**，改為手寫 `Flex/Typography/Tag`（`:34-47`）→ **同類彈窗視覺已出現漂移**。

**B. 「關閉按鈕 footer」**（≥8 檔）：`EquipmentModal.tsx:30`、`InventoryModal.tsx:30`、`SkillModal.tsx:36`、`UnifiedSkillModal.tsx:91`、`MartialHallModal.tsx:25`、`SectGateDetailsModal.tsx:33`、`GameSaveModal.tsx:15`、`SystemCommandModal.tsx:18`、`StrategicCommandModal.tsx:32`。

**C. 「預覽 取消/確認」**（4 檔）：`RepairPreviewModal.tsx:16-21`、`AttackPreviewModal.tsx`、`ExternalSkillPreviewModal.tsx`、`ItemBurstPreviewModal.tsx`。

抽 3 個 shell 元件可移除約 280 行樣板並修復視覺一致性。

### 4.6 【中】Dijkstra 實作 4 份、schoolId→emoji 映射 2 份

- Dijkstra：`movementRules.ts:38`、`ai/decisionTree/actionBuilders.ts:17`、`:79`、`ai/fuzzy/goalActionMapper.ts:17` — 每份各自重建 `cellsByPosition` 與 `blockedKeys`
- schoolId→emoji 11 段三元鏈：`MartialHallModal.tsx:22` 與 `SectGateDetailsModal.tsx:20` 完全重複
- Buff `remainingRounds` 解析：`combatActions.ts:377, 467, 513` 三處重複 `?? (X === 'rounds' ? Y ?? null : null)`
- 探索失敗訊息三元鏈：`explorationActions.ts:60, 86, 114` 三處

---

## 5. 優化建議

### 5.1 立即修（本週，成本 < 1 小時，風險極低）

| # | 行動 | 位置 | 效益 |
|---|---|---|---|
| 1 | **移除殘留 debug log** | `actions/turnActions.ts:116` | 正式環境 console 污染；全 `src/game/` 唯一一處 |
| 2 | **釐清 `resourcePoints`/`itemPoints` 三元方向相反是否為 bug** | `actions/turnActions.ts:236-237` | 疑似正確性缺陷 |
| 3 | **`GameOverModal` 的 "Creature" 改為中文** | `components/GameOverModal.tsx:35, 37` | 使用者可見文案 |
| 4 | **修正簡體字** | `ai/graphSearch/actionGenerators.ts:123` | 使用者可見文案 |
| 5 | **`getPlayerVisionRange` 參數移除底線前綴** | `rules/visibilityRules.ts:26` | 命名與實作矛盾 |

### 5.2 高優先（本迭代，投報率最高）

| # | 行動 | 節 | 效益 / 成本 |
|---|---|---|---|
| **1** | **`getCellVisibility` 提到 `useMemo`：算一次 `visibleCellIds` Set，per-cell 只做 `Set.has`** | P-1, P-2 | **極高 / 極低**。單點改動消除約 4900 萬次比較。這是全專案投報率最高的一步 |
| **2** | **`exploredCellIds` / `revealedCreatureCellIds` 改用 `Set`** | P-1 | 高 / 極低 |
| **3** | **`CreatureTurnContext` 加 `cellsByPosition: Map`；`occupiedBy*` 6 欄位合併為單一 `Set<posKey>`** | P-5 | 高 / 低（context 已存在，只需加欄位） |
| **4** | **刪除 `gameStore.useItem` 內嵌實作，改委派 `useItemAction`** | 4.1 | 高 / **低**（-324 行，33 個現有測試即迴歸網） |
| **5** | **`getActiveBuffDefinitions` / `getEffectiveAttributesForPlayer` 加 WeakMap 快取；catalog `find` 改 Map 查找** | P-4 | 高 / 低（放大器效應，同時改善 BFS） |
| **6** | **MapGrid：建一次 `Map<cellId, objects>` 取代 11 次 per-cell filter；`export default memo(MapGrid)`** | P-3 | 高 / 中 |
| **7** | **抽 `BuffEffects` 基礎型別，白名單改型別驅動** | 2.1-D | 高 / 低（純型別重組，順帶修 `reviveHealthPercent` / `stunned` 漏 override） |

第 7 項建議做法：

```ts
// game/core/buffEffects.ts —— 單一真相
export type BuffEffects = { /* 38 個 override-able 數值欄位 */ }

// catalogs/buffCatalog.ts
export type BuffDefinition = BuffEffects & BuffMetadata

// types.ts
export type BuffInstance = Partial<BuffEffects> & {
  id: string; definitionId: string; sourceId: string; remainingRounds: number | null
}
```

並加型別層完整性檢查，讓漏欄位時編譯失敗：
```ts
type _Exhaustive = Exclude<keyof BuffEffects, typeof BUFF_EFFECT_KEYS[number]> extends never ? true : never
const _check: _Exhaustive = true
```

### 5.3 中優先（下個迭代）

| # | 行動 | 節 | 效益 / 成本 |
|---|---|---|---|
| 8 | **建 `rules/occupancyRules.ts`，收斂 10 處佔位計算** | 4.2 | 高 / 中（各處 layer 集合不同，需逐處確認語意） |
| 9 | **graph-search 移除 `structuredClone`（改 immutable apply 或加 beam width 上限）** | P-6 | 高 / 中 |
| 10 | **抽 `buildAiDependencies` + `runAiStepLoop`，`run*Step` 移到 `ai/aiStepRunner.ts`** | 4.4 | 中 / 中（-250 行，store -550 行） |
| 11 | **`gameSave` / `gameBackup` 加 schema 驗證（複用 `validateScenario` 模式）+ `restoreGameBackup` 包 try/catch** | B-3 | 中 / 低 |
| 12 | **自動存檔加 debounce；`exploredCellIds` 序列化壓縮** | P-8 | 中 / 低 |
| 13 | **`useItem` 改 effect registry（參考 `buildingActionRegistry`）** | 4.1 | 中 / 中 |
| 14 | **升級 `aiTestFixtures` → `gameFixtures`，分批遷移 39 個測試檔** | 4.3 | 中 / 低（測試碼，失敗即刻可見） |
| 15 | **加 ESLint 分層邊界規則（`no-restricted-imports`），並解 3 條雙向依賴邊** | 2.1-C | 中 / 中（防止回退） |

第 15 項的具體解法：
1. `aiActionEvent`、`aiAction`、`perception/distance` 下沉到中立層 `game/core/` → 解除 `rules ↔ ai`
2. `enqueueDialogue` / `getTriggeredDialogueIds` 是純 state transformer，移入 `rules/dialogueRules.ts` → 解除 `rules → actions`
3. `itemPointLootCatalog`（`types.ts:373`）搬到 `catalogs/lootCatalog.ts` → 讓 `types.ts` 回歸「僅 `import type`」
4. `ScenarioDefinition` 下沉到 `game/contracts/scenario.ts` → 讓 `game` 不再 import `editor`

### 5.4 低優先（機會性處理）

| # | 行動 | 節 |
|---|---|---|
| 16 | 3 個 Modal shell 元件（`DetailsModal` / `InfoModal` / `PreviewModal`） | 4.5 |
| 17 | schoolId→emoji 改常數表；探索失敗訊息與 Buff remainingRounds 抽輔助函式 | 4.6 |
| 18 | 統一 `blocked` / `occupied` / `excluded` 術語為單一詞彙 | 3.1 |
| 19 | `MapGrid` props 拆分為分組物件；移除 4 個 targeting 布林旗標（統一走 `targetingSpec`） | 3.2 |
| 20 | 舊分析報告加註 superseded 標記 | 3.3 |
| 21 | `types.ts` 拆分 + `GameState` 分為 `WorldState` / `UiState` / `SessionState` 三 slice | 2.1-D |
| 22 | AI 根層規則檔（`aiDefenseRules.ts` 等）移入 `src/game/ai/` | 1.2 |

第 21 項風險最高（波及全專案），建議放最後。但它的效益也最大：讓存檔只序列化 `WorldState`，可一次解決 P-8 的 payload 過大問題，並讓 `state.defenseStructures?` 等 optional 一律必填，刪掉數十處 `?? []`。

### 5.5 明確不建議動的部分

**`components/` → `rules/` 的 125 處唯讀 import。** 雖然耦合面大（43 個檔案），但寫入路徑已正確收斂在 7 個檔案，且引入完整 viewData 層的成本高於當前收益。建議只在新增功能時採用既有的 viewData 模式（如 `buildingViewData.ts`），漸進收斂而非大規模重寫。

---

## 6. 總結

### 6.1 整體健康度評分：**6.0 / 10**

| 面向 | 評分 | 說明 |
|---|---|---|
| 架構健康度 | 5 / 10 | 分層意圖清楚且已有良好抽象，但 `gameStore.ts` 為 God Object、3 條雙向依賴邊、無機械化邊界保護 |
| 性能健康度 | 4 / 10 | P-1 與 P-2 互相放大形成嚴重熱點；多處 O(n²) 在熱路徑；但主流程 immutable 設計正確，且修復成本意外地低 |
| 安全性健康度 | 8 / 10 | 純前端無伺服器攻擊面；零 XSS 向量；無硬編碼機密。唯一缺口是存檔匯入無 schema 驗證（可 DoS 自己） |
| 可讀性 | 6 / 10 | JSDoc 品質上乘且多處記載決策理由（同規模專案罕見）；但 4 個函式超過 300 行、多處超長三元鏈、術語三重分歧 |
| 復用性 | 5 / 10 | 已有 registry / viewData / fixtures 等正確模式，但**未推廣**；`useItem` 完整雙寫與佔位計算 10 份是主要扣分項 |
| 測試健康度 | 8 / 10 | 1108 個測試全數通過、`rules/` 覆蓋良好，是重構的可靠安全網。扣分在 39 個檔重複 fixture |

**評分理由**：這個專案的問題不是「不懂正確做法」——`buildingActionRegistry.ts`、`previewOrchestration.ts`、`aiTestFixtures.ts`、`buildingViewData.ts` 的存在證明團隊具備良好的模式認知，`gameStore.ts:255-273` 的決策註解品質更是罕見。

真正的問題是**重構做了一半就停下，且舊實作沒有刪除**。`useItem` 雙寫、`recall-base` 佔位計算雙寫，都是「新舊並存」——這比純粹的未重構更危險，因為兩份實作會靜默分歧。

### 6.2 最重要的三個優化方向

#### 方向一：解除 P-1 + P-2 的性能組合（**立即執行**）

`getCellVisibility` 的 per-cell 呼叫（1600 格 × 19 來源 × 1600 格 ≈ 4900 萬次比較）與「store 無 selector 導致任何變更都全樹重繪」互相放大——**清除一筆 log 也會觸發全圖重算**。

修復方式極簡：把 `getPlayerVisibleCellIds` 的結果提到 `useMemo`，per-cell 只做 `Set.has`。搭配 `exploredCellIds` 改 Set 與 `MapGrid` 加 `memo`，這三個改動的總成本不到半天，但能解決本專案最嚴重的性能問題。

#### 方向二：消滅「新舊並存」的雙寫（**本迭代**）

三個具體目標，順序即為投報率排序：

1. **刪除 `gameStore.useItem`（324 行）改委派 `useItemAction`** — 33 個現有測試即迴歸網，風險極低
2. **建 `rules/occupancyRules.ts` 收斂 10 處佔位計算** — 半年前的報告已標記，至今未落地，且 `itemActions.ts:258-266` 的漏 ruins/sectGates 是**實際存在的行為缺陷**
3. **抽 `BuffEffects` 基礎型別** — 目前新增一個 Buff 欄位需改 4 處，且 `reviveHealthPercent` 與 `stunned` 已經因白名單漏列而需手動繞過

這三項合計可減少約 500 行程式碼，並消除三類「漏改就靜默出錯」的維護陷阱。

#### 方向三：為分層建立機械化保護（**下個迭代**）

`gameStore.ts` 從 1519 行成長到 2687 行（+77%）、3 條雙向依賴邊的累積，都是在無人察覺下發生的。程式碼審查無法可靠地攔截這類漸進退化。

具體做法：
1. 加 ESLint `no-restricted-imports` 分層規則，把 `catalogs → types → rules → actions → ai → gameStore → components` 寫成可執行的約束
2. 把 `aiActionEvent`、`perception/distance`、`ScenarioDefinition`、`BuffEffects` 下沉到中立層 `game/core/`，一次解除 3 條雙向邊
3. 為 `gameStore.ts` 設行數上限告警（例如 CI 檢查 > 1500 行即失敗），迫使新功能走 `actions/` 而非繼續堆積

有了這層保護，才能讓方向二的重構成果不被時間侵蝕。

---

## 附錄：本次審查的驗證方法

所有結論均經以下方式取證，非推測：

- **檔案規模**：PowerShell `Measure-Object -Line` 實測，非估算
- **依賴方向**：逐檔 grep import 語句並交叉比對，確認雙向邊
- **性能熱點**：追蹤完整呼叫鏈（如 `getCellVisibility` → `getPlayerVisibleCellIds` → `getVisionCellIds` → `map.cells.filter`），以預設地圖 1600 格推算成本量級
- **重複邏輯**：對每個候選片段實際開檔比對行內容，區分「語意等價的複製」與「形似但語意不同」
- **舊報告同步性**：抽查 3 份報告的具體宣稱（如「已改索引佇列」），逐一到程式碼驗證真偽
- **關鍵發現二次確認**：`turnActions.ts:116` 的 `console.log`、`MapGrid.tsx:282` 的 per-cell 呼叫、`visibilityRules.ts:86-87` 的陣列查詢均已開檔目視確認
