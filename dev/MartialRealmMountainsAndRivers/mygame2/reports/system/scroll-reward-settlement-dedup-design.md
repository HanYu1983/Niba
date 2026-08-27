# 武學殘卷結算防重（runId 登記制）開發設計文件

## 1. 文件目的

- 解決「武學殘卷跨存檔重複領取」與「局末存檔無法判斷是否已結算」的問題。
- 定義以「本局唯一識別（runId）」為單位的持久化登記機制，取代現行以 `gameWon/gameOver` 旗標反推的推斷式判定。
- **狀態：實作完成（2026-08-27）。** T1–T8 全部完成，93 檔 / 1007 測試全數通過。

## 1.1 背景與問題分析

### 第一階段修復（已完成 2026-08-27，見 `reports/bug.md`）

最初的 bug：讀取「局末狀態」存檔時，`SystemOverlays` 因重新 mount 再次執行結算，
殘卷被重複累加。第一階段修復內容：

- `gameStore.ts` 新增模組級旗標 `rewardSettled`：
  - `startGame` / `restartGame` / `resetForTest` 重置為 false
  - `settleActiveCharacterRewards` 冪等（已 settled 回傳 null）
- `gameSave.ts` 存檔 payload 新增 `activeCharacterId` 欄位，讀檔還原，
  避免局末結算回寫到錯誤角色
- `loadGameFromSlot` / `loadGame` 載入局末存檔（`gameWon/gameOver === true`）
  時設模組旗標為 true，視為已結算不重算

第一階段修復解決了「同一 session 內讀檔重複結算」，但防重的「事實」
仍未持久化——由此衍生下述三個殘留漏洞，即本文件要解決的範圍。

### 現行機制（第一階段修復後）

- 局末時 `SystemOverlays` 呼叫 `gameStore.settleActiveCharacterRewards()`，將本局表現換算為殘卷寫入名册角色。
- 防重依賴兩層：
  1. 模組級旗標 `rewardSettled`（`gameStore.ts`）：同一 session 內同一局只結算一次；`startGame` / `restartGame` 重置，載入局末存檔視為已結算。
  2. 存檔摘要 `GameSaveSlotSummary.rewardSettled`：由 `state.gameWon/gameOver` **反推**，供存檔列表顯示「殘卷已結算」Tag。

### 已識別的漏洞（第一階段修復後仍存在）

| # | 漏洞 | 說明 |
|---|------|------|
| V1 | 結算時機與存檔時機脫鉤 | 局末後需等對話播完才結算。若玩家在勝利對話期間手動存檔，該檔被標為「已結算」但實際尚未結算 → 讀檔後獎勵永久丟失。 |
| V2 | 自動存檔未排除勝利狀態 | `endPlayerTurn` / `flushPendingCreatureTurn` 的自動存檔只排除 `gameOver`，未排除 `gameWon`。勝利狀態可能被寫入自動存檔，下次開遊戲直接停在結算畫面。 |
| V3 | 跨欄位重複領取 | 同一局存檔複製到多個欄位：欄位 A 玩到結局結算一次；讀欄位 B（進行中、不鎖定）再玩到結局 → 同一局領取多次。模組級旗標只在當前 session 有效，防不了跨讀檔。 |

### 根本原因

第一階段的模組級旗標是 session 內的暫時狀態，防重的「事實」（這局已結算過）
沒有被持久化記錄，而是每次從存檔內容**推斷**。推斷必然有盲區。

## 2. 核心設計概念

### 2.1 設計目標

- **精確去重**：「同一局只結算一次」以局的唯一識別保證，與存檔欄位、存檔時機完全解耦。
- **持久化**：已結算的事實寫入 localStorage，跨 session、跨讀檔有效。
- **向下相容**：舊存檔無 runId 時退回現行推斷邏輯，不破壞既有存檔。
- **UI 如實呈現**：存檔列表 Tag 改查登記表，顯示真實結算狀態。

### 2.2 方案選型

| 方案 | 評估 |
|---|---|
| A. 標記特定存檔欄位（原提案） | 標記與存檔內容分離，覆蓋欄位後標記殘留/誤清；解決不了 V3。❌ |
| B. runId 登記制（採用） | 以局為單位持久化登記，V1/V3 全解；V2 另以自動存檔排除修復。✅ |
| C. 在 GameState 內嵌 settled 旗標 | 隨存檔複製而失效（每個副本都帶著自己的旗標），V3 不解。❌ |

## 3. 資料模型

### 3.1 runId 的產生與序列化

```ts
// types.ts — GameState 新增欄位
export type GameState = {
  // ...existing fields...
  /** 本局唯一識別（startGame/restartGame/loadScenario 時產生），隨存檔序列化。 */
  runId: string
}
```

- 格式：`run-{timestamp36}-{random6}`（與名册角色 id 同模式）。
- 產生點：`startGame`、`restartGame`、`loadScenario`（三個開新局的入口）。
- 序列化：隨 `GameState` 自動進出存檔，不需改 gameSave payload 版本。

### 3.2 已結算登記表

```ts
// 新檔 src/game/settledRuns.ts
const SETTLED_RUNS_STORAGE_KEY = 'mygame2.settled-runs'
/** 登記表上限：只保留最近 N 筆，避免 localStorage 無限成長。 */
const MAX_SETTLED_RUNS = 200

type SettledRunsPayload = {
  version: number
  /** 已結算的 runId 清單（新的在尾端）。 */
  runIds: string[]
}

export function isRunSettled(runId: string): boolean
export function markRunSettled(runId: string): void
```

- 每筆僅一個 id 字串，200 筆約數 KB，容量可忽略。
- 超上限時淘汰最舊者（理論上極舊的局不可能再被讀檔回去）。

### 3.3 存檔摘要擴充（三態，待決項 1 已採納）

```ts
// gameSave.ts
export type RewardSettlementStatus = 'settled' | 'pending' | 'in-progress'

export type GameSaveSlotSummary = {
  slot: number
  savedAt: string | null
  round: number | null
  /**
   * 武學殘卷結算狀態（三態）：
   * - 'settled'：已領過——有 runId 且已登記；或舊存檔無 runId 但局末（退回推斷）。
   * - 'pending'：局末但尚未結算（V1 情境），讀檔後可補結算。
   * - 'in-progress'：遊戲進行中。
   */
  rewardStatus: RewardSettlementStatus
}
```

## 4. 流程設計

### 4.1 結算流程（改造後）

```text
SystemOverlays 結算 useEffect 觸發（gameEnded && dialogueQueueEmpty）
        ↓
settleActiveCharacterRewards(stats, won, learnedSkillIds)
        ↓
┌─ 冪等檢查鏈 ────────────────────────────────┐
│ 1. activeCharacterId 為 null → 回傳 null     │
│ 2. 模組旗標 rewardSettled → 回傳 null        │
│ 3. state.runId 已在登記表 → 回傳 null        │  ← 新增（解 V3）
│ 4. 通過 → 結算 + markRunSettled(runId)       │
│    + 模組旗標設 true                         │
└──────────────────────────────────────────────┘
```

- 步驟 3 在 `gameStore.settleActiveCharacterRewards` 內查 `isRunSettled(state.runId)`。
- 步驟 4 結算成功後立即 `markRunSettled`——即使之後崩潰/關頁，事實已落盤。

### 4.2 讀檔流程（第一階段基礎上微調）

- `loadGameFromSlot` / `loadGame` 保留第一階段已實作的邏輯：
  - 還原 `activeCharacterId`（存檔 payload 欄位）
  - 局末存檔設模組旗標 `rewardSettled = true`
- 本階段新增：讀檔後若局末但 runId 未登記（`'pending'`），模組旗標**不設** true，
  讓結算 useEffect 正常觸發補結算（由登記表保證不重複）。
- 模組旗標是 session 內快速路徑；登記表是跨 session 的最終防線，兩者並存不衝突。

### 4.3 UI 顯示（GameSaveModal）

- Tag 判定改為 `entry.rewardStatus` 三態：
  - `'settled'` → 金色 Tag「殘卷已結算」，Tooltip：「此局武學殘卷已結算入名册；讀取後不會重複計算。」
  - `'pending'` → 灰色 Tag「局末待結算」，Tooltip：「此存檔為局末狀態但尚未結算，讀取後會正常結算。」
  - `'in-progress'` → 不顯示 Tag。

### 4.4 結算畫面顯示（SystemOverlays）

- 若 settle 因已登記而回傳 null 且該局為局末：GameOverModal 顯示「此局已領取過獎勵」提示，而非「獲得 ×0」，避免玩家誤會。
- 實作：`scrollReward` state 增加「skipped」語意（如 `-1` 或獨立 flag）。

## 5. 待決項（已決議 2026-08-27）

1. **summary 細分三態**：✅ 採納。`rewardSettled: boolean` 改為
   `rewardStatus: 'settled' | 'pending' | 'in-progress'`：
   - `'settled'`：殘卷確定已領過——有 runId 且已登記；或舊存檔無 runId 但局末（退回推斷）。金色 Tag「殘卷已結算」。
   - `'pending'`：局末但尚未結算（V1 情境）——局末狀態且 runId 未登記。灰色 Tag「局末待結算」，Tooltip「讀取後會正常結算」。
   - `'in-progress'`：遊戲進行中，不顯示 Tag。
2. **登記表上限**：✅ 維持 200 筆。
3. **手動存檔在局末是否允許**：✅ 先允許＋runId 機制兜底，觀察是否有實際困擾再收緊。

## 6. 實作清單（工程任務拆分）

| # | 任務 | 檔案 | 依賴 |
|---|------|------|------|
| T1 | `GameState.runId` 型別 + 三個開局入口產生 id | `types.ts`, `worldSetup.ts`(或 gameStore), `gameStore.ts` | — |
| T2 | 新增 `settledRuns.ts`（isRunSettled/markRunSettled + 測試） | `src/game/settledRuns.ts` | — |
| T3 | `settleActiveCharacterRewards` 接入登記表檢查與登記 | `gameStore.ts` | T1, T2 |
| T4 | 存檔摘要混合判定（runId 查表 → 舊檔退回推斷） | `gameSave.ts` | T1, T2 |
| T5 | 自動存檔補排 `gameWon`（修 V2） | `gameStore.ts` L1508, L2502 | — |
| T6 | GameSaveModal Tag/Tooltip 更新（三態：settled 金色／pending 灰色／in-progress 不顯示） | `GameSaveModal.tsx` | T4 |
| T7 | SystemOverlays「此局已領取過獎勵」提示 | `SystemOverlays.tsx`, `GameOverModal.tsx` | T3 |
| T8 | 測試：跨欄位同局只結算一次／舊存檔相容／局末未結算讀檔可補結算 | `gameStore.test.ts`, `settledRuns.test.ts` | T1–T4 |

## 7. 測試案例規劃

1. **跨欄位去重（V3 核心）**：同 runId 存檔於 slot 1、slot 2 → 各自讀檔玩到局末 → 只結算一次。
2. **舊存檔相容**：無 runId 的局末存檔 → 讀檔不重算（沿用第一階段旗標行為）。
3. **局末未結算可補結算（V1 修復後語意）**：局中存檔（非局末）→ 手動改 state 為局末（模擬對話期間存檔情境）→ 讀檔 → 正常結算一次。
4. **markRunSettled 冪等**：重複標記同一 runId 不報錯、集合不重複。
5. **上限淘汰**：超過 MAX_SETTLED_RUNS 後最舊者被移除。
6. **摘要三態判定**：有 runId 已登記 → `'settled'`；有 runId 未登記且局末 → `'pending'`；有 runId 未登記且非局末 → `'in-progress'`；無 runId 局末 → `'settled'`（退回推斷）；無 runId 非局末 → `'in-progress'`。

## 8. 相關文件

- `reports/bug.md` — 殘卷重複計算 bug 的原始記錄與第一階段修復（模組旗標 + activeCharacterId 持久化），本文件為其第二階段（跨 session 防重）。
- `reports/system/end-game-battle-record-design.md` — RunStats 累積機制（結算公式的資料來源）。
