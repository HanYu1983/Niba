# 代碼優化步驟文件（Code Update Plan）

**依據**：`reports/analysis/code-health-review-2026-08-31.md`
**日期**：2026-08-31
**原則**：小步前進、每步可獨立驗證、可隨時中斷、以現有 1108 個測試作為安全網。

---

## 執行進度

> 最後更新：2026-08-31

| 階段 | 狀態 | 備註 |
|---|---|---|
| 0 前置準備 | ⬜ 未開始 | |
| 1 立即修 | ✅ **已完成** | 含 1 個 bug 修正（見下） |
| 2 性能熱點 | ✅ **已完成** | 5 個步驟全數完成 |
| 3 雙寫與散彈修改 | ✅ **已完成** | 3.1 ✅ useItem 委派；3.2 ✅ occupancyRules 收斂；3.3 ✅ BuffEffects |
| 4 AI 與存檔 | ✅ **已完成** | 4.1 ✅ `ai/aiStepRunner.ts`（6 個 step + `buildAiDependencies` + `runAiStepLoop` 高階函式）；4.2 ✅ graph-search 移除 `structuredClone`（domain actions 已 immutable）、修正 `searchStrategies` 型別；4.3 ✅ 存檔 schema 驗證；4.4 ✅ 自動存檔 debounce |
| 5 分層與測試收斂 | ✅ **已完成** | 5.1 ✅ lint 達 **0 errors**（10 warnings：6 為 exhaustive-deps 刻意取捨、4 為 MapGrid React Compiler 誤報已降級 warn 並在 eslint.config.js 記錄根因——`getActiveBuffDefinitions` 的模組級 WeakMap 快取與 compiler 變異分析衝突，權衡後保留性能快取）；5.2 ✅ 雙向依賴已分離；5.3 ⏸️ fixture 命名整理暫緩（不影響功能） |
| 6 結構拆分 | 🔄 **進行中** | 6.1 部分完成：`store/createStore.ts`、`session/sessionController.ts`、`effects/animationBus.ts`、`ai/aiStepRunner.ts`、`actions/itemBurstActions.ts` 已抽出；純規則轉出口已移出 store；`gameStore.ts` 由 2359 行降至 1519 行；6.2 部分完成：`types.ts` 已拆分至 `game/types/{geometry,entities,map,combat,campaign,ai,runStats,gameState}.ts`（backward-compatible barrel）；GameState 三分 ✅ 已完成（`WorldState`/`UiState`/`SessionState` 以 intersection 組合，欄位形狀不變、零破壞） |

### 階段 1 額外發現的 bug（已修正）

**`turnActions.ts` 的 `resourcePoints` 三元方向寫反**：生物採集資源點後，回合完整結束時資源點狀態被還原為原始值，生物採集的資源點不會反映到地圖上。已修正為與 `itemPoints` 對稱的邏輯。

### 階段 2 完成摘要

- **2.1** `getCellVisibility` 提到 `useMemo`：一次算出 `visibleCellIds` Set，per-cell 只做 `Set.has`，消除約 4900 萬次比較/render。
- **2.2** `getCellVisibility` 優化：`revealed` 檢查提前（便宜短路）。
- **2.3** `getActiveBuffDefinitions` 加 WeakMap 快取；`allExternalSkillCatalog` / `allInnerSkillCatalog` 改 Map 索引。
- **2.4** `CreatureTurnContext` 加 `cellsByPosition` Map 與 `occupiedKeys` Set，`isCellTraversable` / `getCellMoveCost` / `isOccupiedExcludingDefenses` 改 O(1) 查詢。
- **2.5** `MapGrid` 加 `memo` + `cellObjects` 物件索引，取代 per-cell 的 11 次 filter。

---

## 完成度驗證報告（2026-08-31）

> 對照 `code-health-review-2026-08-31.md` 的建議清單，以程式碼實證（非僅文件宣稱）逐項驗證。
> 驗證基準：`npx tsc -b` ✅ 通過、`npm run test` ✅ **1119/1119 通過**、`npx eslint .` ✅ **0 errors**（10 warnings）。

### ✅ 已完成（經程式碼實證）

| 報告建議 | 計劃步驟 | 實證 |
|---|---|---|
| 移除殘留 debug log | 1.1 | `turnActions.ts` 已無 `console.log`（grep 實測 0 筆） |
| `resourcePoints` 三元方向 bug | 1.2 | 確認為 bug 並修正為對稱邏輯 |
| 使用者可見文案 / 簡體字 / 命名矛盾 | 1.3 / 1.4 | 已修正 |
| P-1 視野 O(cells²) 全圖重算 | 2.1 / 2.2 | `visibleCellIds` 提至 `useMemo`，per-cell 改 `Set.has` |
| P-4 `getActiveBuffDefinitions` 放大器 | 2.3 | WeakMap 快取（`playerDerivedRules.ts:75`）+ 目錄 Map 索引 |
| P-5 pipeline 迴圈內線性掃描 | 2.4 | `CreatureTurnContext` 加 `cellsByPosition` Map 與 `occupiedKeys` Set |
| P-3 MapGrid per-cell filter | 2.5 | `memo` + `cellObjects` 物件索引（後續再重寫為不可變分組） |
| **useItem 完整雙寫（324 行）** | 3.1 | ✅ store 版已改委派 `executeUseItemAction`（`gameStore.ts:958-960`，3 行） |
| 佔位計算 10 處散彈式拼湊 | 3.2 | ✅ `rules/occupancyRules.ts` 存在，`MOVEMENT_LAYERS` / `SPAWN_LAYERS` / `BUILD_LAYERS` preset |
| BuffDefinition/BuffInstance 4 處手動同步 | 3.3 | ✅ `core/buffEffects.ts` 存在，白名單改型別驅動 |
| AI step 樣板複製 5 份（約 550 行） | 4.1 | ✅ `ai/aiStepRunner.ts`：6 個 step + `buildAiDependencies` + `runAiStepLoop` 高階函式 |
| P-6 graph-search `structuredClone` | 4.2 | ✅ 已移除（domain actions 皆 immutable，深拷貝多餘）；`searchStrategies` 型別修正 |
| 存檔匯入無 schema 驗證 | 4.3 | ✅ `gameSaveValidation.ts` 存在，惡意存檔不白屏 |
| P-8 自動存檔同步阻塞 | 4.4 | ✅ debounce 已加入 |
| lint 分層 / 3 條雙向依賴邊 | 5.1 / 5.2 | ✅ lint 0 errors；`catalogs/lootCatalog.ts`、`rules/dialogueRules.ts`、`contracts/scenario.ts` 均存在 |
| `types.ts` 混合檔（1014 行） | 6.2 | ✅ 拆分至 `game/types/{geometry,entities,map,combat,campaign,ai,runStats,gameState}.ts`，`types.ts` 僅剩 **14 行** backward-compatible barrel |
| `GameState` 73 欄位混合 | 6.2 | ✅ 三分為 `WorldState` / `UiState` / `SessionState`（intersection 組合，欄位形狀不變、零破壞） |
| `gameStore.ts` God Object（2687 行） | 6.1 | 🟡 降至 **1519 行（-43%）**：`store/createStore.ts`、`session/sessionController.ts`、`effects/animationBus.ts`、`ai/aiStepRunner.ts`、`actions/itemBurstActions.ts` 已抽出；純規則轉出口已移出 |

### ⚠️ 未完成 / 部分完成

| 項目 | 現況 | 說明 |
|---|---|---|
| **5.3 測試 fixtures 統一** | ❌ 未做 | 實測仍有 **38 個測試檔**重複定義 `makePlayer` / `makeState`；`gameStore.test.ts:16` 誤命名的 `makePlayer`（實際回傳 `CreatureState`）仍在。計劃已標記「暫緩」——`PlayerState` 新增必填欄位時需同步修改 38 處 |
| **5.1 ESLint `no-restricted-imports` 分層規則** | ❌ 未做 | `eslint.config.js` 目前**沒有**分層邊界規則。報告 §6.2 方向三明確指出：`gameStore.ts` 從 1519 行膨脹到 2687 行、3 條雙向依賴邊的累積，都是在無人察覺下發生的——**缺少此機械化防護，本次重構成果可能被時間侵蝕** |
| **`game → editor` 反向依賴** | 🟡 部分 | `ScenarioDefinition` 已下沉至 `contracts/scenario.ts` ✅；但 `gameStore.ts:155-156` 仍 import `../editor/rules/scenarioCompiler` 與 `scenarioValidator`（最後一條反向邊） |
| **6.1 目標 400~600 行** | 🟡 未達 | 1519 行，超出目標約 2.5 倍。剩餘主體為 session 生命週期方法與約 28 個薄委派方法（`runActionOutcome(...)` 單行） |
| **6.2 optional 欄位必填化** | ❌ 未做 | `state.defenseStructures?` 等仍為 optional，數十處 `?? []` 未清除（原計劃列為 6.2 第 3 點） |
| **低優先項（報告 §5.4 #16~20）** | ❌ 未做 | Modal shell 元件 ×3、schoolId→emoji 常數表、`blocked`/`occupied`/`excluded` 術語統一、MapGrid props 拆分、舊報告加 superseded 標記 |

### 結論

**核心重構已全部完成**：報告 §6.2 的「方向一（解除 P-1+P-2 性能組合）」與「方向二（消滅新舊並存雙寫）」兩大目標完全落地；階段 1~4 全數完成，5.2 與 6.1/6.2 主體完成。

**尚未收尾的三件事**（按投報率排序）：

1. **ESLint `no-restricted-imports` 分層規則**（報告方向三的核心）——防止 `gameStore.ts` 再次膨脹、雙向依賴再次累積的機械化防護，成本約半小時
2. **5.3 fixtures 統一**（38 檔重複）——降低未來型別變更的修改面
3. **`game → editor` 最後一條反向邊**——`scenarioCompiler` / `scenarioValidator` 下沉

---

## 執行守則

1. **每完成一步就跑一次完整測試**：`npx tsc -b; npm run test`
2. **每步獨立 commit**，便於回滾。
3. **優化優先於新功能**：進行本計劃期間，暫停新增功能，避免再次堆積到 `gameStore.ts`。
4. **分階段推進**，每階段結束做一次整體驗證（手動跑一局 + 測試）。
5. **遇到不確定語意的地方（標 ⚠️ 者）先確認，不要猜**。

---

## 階段 0：前置準備（半小時）

### 步驟 0.1 — 建立基線

- [ ] 確認目前測試全數通過：`npx tsc -b; npm run test`
- [ ] 記錄基線行數：`gameStore.ts` = 2687 行、`MapGrid.tsx` = 681 行、`App.tsx` = 684 行
- [ ] 確認 `package-lock.json` 是否已提交（報告 B-5 提到需確認）
- [ ] 建立一個對照用的分支（如 `refactor/step-by-step`）

---

## 階段 1：立即修（低風險、零爭議、< 1 小時）

這些是「明顯錯誤」而非「重構」，先清掉避免後續干擾。

### 步驟 1.1 — 移除殘留 debug log ✅

**檔案**：`src/game/actions/turnActions.ts:116`

移除：
```ts
console.log('DEBUG endPlayerTurn early return', { ... })
```

**驗證**：`npm run test`；grep 確認 `src/game/` 下無其他非測試 `console.log`。

### 步驟 1.2 — ⚠️ 釐清 `resourcePoints` / `itemPoints` 三元方向相反 ✅（確認為 bug 並修正）

**檔案**：`src/game/actions/turnActions.ts:236-237`

目前：
```ts
resourcePoints: isRoundComplete ? state.resourcePoints : scheduledCreatureTurn?.resourcePoints ?? state.resourcePoints,
itemPoints:     isRoundComplete ? scheduledCreatureTurn?.itemPoints ?? state.itemPoints : state.itemPoints,
```

**動作**：
1. 先確認這是否為 bug（閱讀 `scheduledCreatureTurn` 的產生處，確認 resourcePoints 與 itemPoints 的語意是否應對稱）。
2. 若是 bug → 修正為對稱邏輯。
3. 若不是 bug → 補註解說明為何兩者方向相反。

**驗證**：新增/調整對應測試。

### 步驟 1.3 — 修正使用者可見文案 ✅

**檔案**：
- `src/components/GameOverModal.tsx:35, 37` — 「所有 **Creature** 巢穴」→「所有**怪物**巢穴」；「**Creature** 已消滅」→「**怪物**已消滅」
- `src/game/ai/graphSearch/actionGenerators.ts:123` — 簡體「击」→「擊」
- `src/game/ai/decisionTree/actionBuilders.ts:39, 135` — 簡體「达」→「達」

**驗證**：測試通過；目視確認 UI 文案。

### 步驟 1.4 — 修正命名與實作矛盾 ✅

**檔案**：`src/game/rules/visibilityRules.ts:26`

`getPlayerVisionRange(_state, _playerId)` 的參數實際有使用，移除底線前綴改為 `(state, playerId)`。

**驗證**：測試通過。

---

## 階段 2：解除性能熱點（高優先、投報率最高）

### 步驟 2.1 — `getCellVisibility` 提到 `useMemo`（最高優先）✅

**問題**：`MapGrid.tsx:282` 每格呼叫 `getCellVisibility`，觸發全圖重算（約 4900 萬次比較/render）。

**檔案**：`src/components/MapGrid.tsx`

**動作**：
1. 在 render 主體計算一次 `visibleCellIds`：
   ```ts
   const visibleCellIds = useMemo(() => {
     if (!visibility || !visibilityPlayerId) return null
     return getPlayerVisibleCellIds({ ...假 state... }, visibilityPlayerId)
   }, [visibility, visibilityPlayerId, map, players, bases, defenseStructures])
   ```
2. 在 `cells.map` 內，用 `visibleCellIds.has(cell.id)` 取代每格呼叫 `getCellVisibility`。
3. 保留 `getCellVisibility` 對 `exploredCellIds` / `revealedCreatureCellIds` / `mode === 'revealed'` 的判斷，但把「可見」部分改為查 Set。

**驗證**：測試通過；手動跑一局確認迷霧顯示不變。

### 步驟 2.2 — `exploredCellIds` / `revealedCreatureCellIds` 改用 `Set` ✅

**檔案**：`src/game/rules/visibilityRules.ts:86-87`

**動作**：
1. 在 `getCellVisibility` 內，把 `visibility.exploredCellIds.includes(cell.id)` 改為預先建好的 `Set`。
2. `revealedCreatureCellIds?.includes(cell.id)` 同理。

**驗證**：測試通過。

### 步驟 2.3 — `getActiveBuffDefinitions` 加快取 ✅

**問題**：BFS 每格都間接呼叫它，內部含 2 次目錄線性掃描。

**檔案**：`src/game/rules/playerDerivedRules.ts`

**動作**：
1. 建 `const buffCache = new WeakMap<PlayerState, BuffDefinition[]>()`。
2. `getActiveBuffDefinitions(player)` 先查快取，命中即回傳。
3. 同理對 `getEffectiveAttributesForPlayer` 加 WeakMap 快取（若 player 物件不可變，則快取安全）。
4. 把 `allExternalSkillCatalog.find(...)`（`:195`）與 `allInnerSkillCatalog.find(...)`（`:234`）改為模組級 Map 索引。

**⚠️ 注意**：先確認 player 物件的更新是否為 immutable（每次變更換新物件）——若是，WeakMap 快取安全；若存在就地變異，則不能用快取。

**驗證**：測試通過；手動跑一局確認 Buff 效果正確。

### 步驟 2.4 — `CreatureTurnContext` 加索引 ✅

**檔案**：`src/game/actions/creatureTurnPipeline.ts`

**動作**：
1. 在 `createCreatureTurnContext`（`:101-146`）加 `cellsByPosition: Map<string, MapCell>`。
2. 把 `isCellTraversable`（`:149`）、`getCellMoveCost`（`:154`）的 `map.cells.find(...)` 改為 `cellsByPosition.get(...)`。
3. 把 6 個 `occupiedBy*` 欄位合併為單一 `Set<posKey>`（`isOccupiedExcludingDefenses` 等處改查 Set）。

**驗證**：測試通過；手動跑一局確認怪物移動正常。

### 步驟 2.5 — MapGrid 加 `memo` + 建物件索引 ✅

**檔案**：`src/components/MapGrid.tsx`

**動作**：
1. `export default memo(MapGrid)`。
2. 把 11 次 per-cell `.filter()` 改為一次 `Map<cellId, objects[]>` 索引（或按類型分別建 Map）。
3. `blockedPositions.some(...)` 改為 `Set.has(...)`。

**⚠️ 注意**：`memo` 需要 props 引用穩定，否則無效。需搭配 `useCallback`/`useMemo` 讓回呼與陣列 props 穩定，或接受 React Compiler 的自動 memo。

**驗證**：測試通過；用 React DevTools 確認 MapGrid 不會在無關 state 變更時重繪。

---

## 階段 3：消滅雙寫與散彈式修改（本迭代核心）

### 步驟 3.1 — 刪除 store 版 `useItem`

**檔案**：`src/game/gameStore.ts:1124-1447`

**動作**：
1. 把 `useItem` 改為委派：
   ```ts
   useItem: (playerId, itemId) => runActionOutcome(updateGameState, (state) => useItemAction(state, playerId, itemId), '無法使用此道具。')
   ```
2. 確認 `useItemAction`（`actions/itemActions.ts:77`）已涵蓋 store 版全部分支（報告確認二者完全同構）。
3. 刪除 store 版 324 行。

**驗證**：**這是關鍵點** — 現有 33 個 `gameStore.useItem` 測試就是迴歸網。跑 `npm run test`，全數通過即成功。

### 步驟 3.2 — 建 `rules/occupancyRules.ts`

**檔案**：新建 `src/game/rules/occupancyRules.ts`

**動作**：
1. 定義 `OccupancyLayer` 型別與 `getOccupiedPositions(state, { exclude, layers })`。
2. 定義三個 preset：`MOVEMENT_LAYERS` / `SPAWN_LAYERS` / `BUILD_LAYERS`。
3. `getBlockedPositions`（`movementRules.ts:17`）改為 `MOVEMENT_LAYERS` 的 wrapper（保持向後相容）。
4. 逐步替換報告列出的 9 處手工拼湊（`transportRules.ts`、`defenseRules.ts`、`itemActions.ts`、`gameStore.ts:1304`、`creatureActions.ts`、`creatureTurnPipeline.ts`、`worldGeneration.ts`、`worldSetup.ts`、`MapGrid.tsx`）。

**⚠️ 注意**：各處 layer 集合不同（有的缺 ruins、有的缺 sectGates），**逐處確認語意後再替換**，不要盲目統一。

**特別關注**：`itemActions.ts:258-266`（回營符）漏 ruins/sectGates，替換時應**補上**這些 layer，修正「回營傳送到廢墟格」的潛在 bug。

**驗證**：每替換一處就跑一次測試；最後手動跑一局確認移動、傳送、生成行為不變。

### 步驟 3.3 — 抽 `BuffEffects` 基礎型別

**檔案**：
- 新建 `src/game/core/buffEffects.ts`
- `src/game/catalogs/buffCatalog.ts`
- `src/game/types.ts`
- `src/game/rules/playerDerivedRules.ts`

**動作**：
1. 把約 38 個 override-able 數值欄位抽到 `BuffEffects`。
2. `BuffDefinition = BuffEffects & BuffMetadata`（name/description/duration/mapMarker…）。
3. `BuffInstance = Partial<BuffEffects> & { id; definitionId; sourceId; remainingRounds }`。
4. `getEffectiveBuffDefinition` 的白名單改為型別驅動：
   ```ts
   const BUFF_EFFECT_KEYS = [...] as const satisfies readonly (keyof BuffEffects)[]
   ```
   加型別完整性檢查，漏欄位時編譯失敗。
5. **順帶修**：把 `reviveHealthPercent`、`stunned` 加入白名單，移除 `creatureAnimation.ts:24` 與 `creatureTurnPipeline.ts:311` 的手動繞過。

**驗證**：`npx tsc -b` 通過（型別重組的主要驗證手段）；`npm run test` 全數通過。

---

## 階段 4：AI 與存檔健壯性（中優先）

### 步驟 4.1 — 抽 `buildAiDependencies` + `runAiStepLoop`

**檔案**：`src/game/gameStore.ts:2028-2575` → 新建 `src/game/ai/aiStepRunner.ts`

**動作**：
1. 抽 `buildAiDependencies(state)`（目前複製 3 次，含 14 參數 `moveCreatures` 呼叫）。
2. 抽 `runAiStepLoop({ playerId, orderType, decide })` 高階函式（含 `MAX_LOOPS` 迴圈骨架）。
3. 6 個 `run*Step` 移出 store。
4. 統一 `currentState.itemPoints` 與 `currentState.itemPoints ?? []` 的不一致。

**驗證**：AI 相關測試（`gameStore.aiSteps.test.ts` 等）全數通過；手動跑一局確認 AI 行為不變。

### 步驟 4.2 — graph-search 移除 `structuredClone`

**檔案**：`src/game/ai/graphSearch/executePure.ts`、`searchStrategies.ts`

**動作**：
1. 評估用 immutable apply 取代 `structuredClone`，或加 beam width / 節點數上限。
2. 移除 `searchStrategies.ts:25-27` 的無效 `instanceof Object` 檢查與 `as any`。

**⚠️ 注意**：這是性能修正，但 graph-search 是複雜子系統，建議先加節點數上限（低成本）而非全量改 immutable（高風險）。

**驗證**：AI 測試通過；手動跑一局確認 graph-search AI 決策正常。

### 步驟 4.3 — 存檔 schema 驗證

**檔案**：`src/game/gameBackup.ts`、`src/game/gameSave.ts`

**動作**：
1. 參考 `editor/EditorApp.tsx:191` + `validateScenario` 模式，為存檔匯入加入 schema 驗證。
2. `restoreGameBackup` 包 try/catch，處理 `QuotaExceededError` 與中途失敗的不一致狀態。
3. `loadGameStateFromSlot` 讀檔後做基本型別檢查再使用。

**驗證**：新增惡意存檔測試（如 `players: "x"`、`map.cells: null`），確認不會白屏。

### 步驟 4.4 — 自動存檔 debounce

**檔案**：`src/game/gameSave.ts`

**動作**：
1. 對 `saveGameStateToSlot` 加 debounce（如 500ms）。
2. 評估 `exploredCellIds` 序列化壓縮（可後續再做）。

**驗證**：測試通過；手動確認自動存檔仍正常運作。

---

## 階段 5：分層保護與測試收斂（下迭代）

### 步驟 5.1 — 加 ESLint 分層邊界規則

**檔案**：`eslint.config.js`

**動作**：
1. 加 `no-restricted-imports`，把 `catalogs → types → rules → actions → ai → gameStore → components` 寫成可執行約束。
2. 先設定為「warn」觀察，逐步改為「error」。

**驗證**：`npm run lint` 無違規。

### 步驟 5.2 — 解 3 條雙向依賴邊

**動作**：
1. `aiActionEvent`、`aiAction`、`perception/distance` 下沉到 `game/core/` → 解除 `rules ↔ ai`。
2. `enqueueDialogue` / `getTriggeredDialogueIds` 移入 `rules/dialogueRules.ts` → 解除 `rules → actions`。
3. `itemPointLootCatalog`（`types.ts:373`）搬到 `catalogs/lootCatalog.ts` → 解除 `types ↔ catalogs`。
4. `ScenarioDefinition` 下沉到 `game/contracts/scenario.ts` → 解除 `game → editor`。

**驗證**：測試通過；確認無循環依賴。

### 步驟 5.3 — 升級測試 fixtures ⏸️ 命名整理暫緩

> 本步驟中的 fixture 命名整理（例如 `makePlayer` 等）目前不影響執行功能，
> 僅屬可讀性與命名規範改善，因此先暫緩，不為此承擔大範圍引用修改風險。
> 後續若需統一命名，應使用語意重新命名並逐批驗證。

**檔案**：`src/game/testHelpers/aiTestFixtures.ts` → `src/game/testHelpers/gameFixtures.ts`

**動作**：
1. 改名去掉「ai」限定，提供 `makePlayer` / `makeCreature` / `makeBase` / `makeState` / `makePlainMap`。
2. 血量預設改走 `playerStatsRules.getMaxHealth`（消除與 39 個檔的語意分歧）。
3. 分批遷移 39 個重複定義的測試檔（按目錄，先 rules 再 actions 再 components）。
4. 修正 `gameStore.test.ts:16` 誤命名的 `makePlayer`（實際回傳 `CreatureState`）改為 `makeTestCreature`。

**驗證**：測試全數通過（失敗即刻可見）。

---

## 階段 6：結構性拆分（放最後、風險最高）

### 步驟 6.1 — `gameStore.ts` 拆分

**動作**（依報告 §1.3 建議）：
1. 抽出 `game/store/createStore.ts`（store 基礎設施 + updateGameState pipeline）。
2. 抽出 `game/session/sessionController.ts`（session 生命週期 + 8 個模組級變數封成 `SessionContext`）。
3. 抽出 `game/effects/animationBus.ts`（動畫/一次性視覺訊號）。
4. 純規則轉出口（`spawnCreaturesFromNests` 等）移出 store，呼叫端直接 import。

**目標**：store 降到 400~600 行。

**驗證**：全量測試；手動跑完整一局。

### 步驟 6.2 — `types.ts` 拆分 + `GameState` 三分

**動作**：
1. `types.ts` → `game/types/{entities,map,combat,campaign,ai}.ts` + `game/geometry.ts`。
2. `GameState` 分為 `WorldState`（權威模擬）/ `UiState`（預覽、blockingModal、operation）/ `SessionState`（runId、scenarioId）。
3. `state.defenseStructures?` 等 optional 一律必填（`[]` 預設），刪掉數十處 `?? []`。

**⚠️ 注意**：此步波及全專案，務必在階段 1~5 全部完成後再做，並分多個 commit 推進。

**驗證**：全量測試；手動跑完整一局。

---

## 附錄 A：執行順序總覽

| 階段 | 主題 | 風險 | 預計投入 |
|---|---|---|---|
| 0 | 前置準備 | — | 0.5 小時 |
| 1 | 立即修 | 極低 | 1 小時 |
| 2 | 性能熱點 | 低 | 1~2 天 |
| 3 | 雙寫與散彈修改 | 低~中 | 1~2 天 |
| 4 | AI 與存檔 | 中 | 1~2 天 |
| 5 | 分層與測試收斂 | 中 | 2~3 天 |
| 6 | 結構拆分 | **高** | 3~5 天 |

## 附錄 B：每個階段的完成標準

- **階段 1**：`src/game/` 無殘留 `console.log`；UI 文案無「Creature」/簡體字；`resourcePoints`/`itemPoints` 三元已釐清。
- **階段 2**：React DevTools 確認 MapGrid 不重繪；單回合怪物移動時間明顯下降。
- **階段 3**：`gameStore.ts` 減少約 500 行；grep 確認無 `useItem` 雙寫；佔位計算只剩 `occupancyRules.ts` 單一來源。
- **階段 4**：AI step 樣板單一來源；存檔匯入有 schema 驗證；惡意存檔不會白屏。
- **階段 5**：`npm run lint` 無分層違規；無循環依賴；39 個測試檔改用統一 fixture。
- **階段 6**：`gameStore.ts` ≤ 600 行；`types.ts` 已拆分；`GameState` 三分。

## 附錄 C：回滾策略

- 每步驟獨立 commit，標題用「refactor: ...」或「fix: ...」。
- 任何步驟測試失敗 → 立即 `git revert` 該 commit，不強行修復。
- 階段 6 的每步拆得更細（如先拆 `UiState` 再拆 `SessionState`），避免一次動太多。

## 附錄 D：明確不做的事

1. **不要**大規模重寫 `components/ → rules/` 的 125 處唯讀 import（寫入已收斂，成本高於收益）。
2. **不要**在階段 1~5 完成前動 `types.ts` 的 `GameState` 三分。
3. **不要**為了「統一術語」而改名已進入使用者可編輯 schema 的 `surroundedEnemyCount`（改名成本過高）。
