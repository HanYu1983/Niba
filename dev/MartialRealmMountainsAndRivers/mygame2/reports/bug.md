

---

## 🐛 BUG: 讀檔時殘卷被重複計算 (save-load re-calc scroll reward)

**狀態**: ✅ 已修復（2026-08-27）｜ 更新: 2026-08-27

### 情境
若玩家的存檔恰好是「局末狀態（gameWon/gameOver = true）」，讀檔後
`SystemOverlays` 會因重新 mount 再次執行 `settleActiveCharacterRewards`，
殘卷（武學殘卷）被重複累加進名册角色。

### 根本原因
1. `src/game/gameStore.ts` 的 `loadGameFromSlot` / `loadGame` **不重置**
   `activeCharacterId`（模組變數）。
2. `src/components/overlays/SystemOverlays.tsx` 的 `recordedRef` 只防「同一
   mount（元件實例）內」重複結算；讀檔會讓元件重新 mount，`recordedRef`
   重置為 false，`gameEnded` 又為 true → 再次呼叫結算。
3. `applyEndGameRewards`（`src/game/characterRoster.ts`）每次都以
   `current.scrolls + reward` 累加，不具冪等性。

### 相關位置
| 檔案 | 行 | 說明 |
|------|----|------|
| `SystemOverlays.tsx` | 32–65 | `scrollReward` state + 結算 useEffect |
| `gameStore.ts` | 236 | `activeCharacterId` 模組變數 |
| `gameStore.ts` | 383 | `startGame` 設定 activeCharacterId |
| `gameStore.ts` | 393–394 | `settleActiveCharacterRewards` |
| `characterRoster.ts` | — | `applyEndGameRewards` 每次都 + reward |

### 修法方向（下次實作）
殘卷結算應「同一局只計算一次」：
1. **(推薦)** gameStore 加模組旗標 `rewardSettled`：
   - `startGame` / `restartGame` 設 `false`
   - `settleActiveCharacterRewards` 若已 settled 回傳 `null`（冪等）
   - `loadGameFromSlot` / `loadGame` 載入時，若 `state.gameWon/gameOver === true`
     則設 `rewardSettled = true`（視為已結算，不重算）
2. 或在 `settleActiveCharacterRewards` 內部做持久化「已結算」標記去重。
3. 或在 `SystemOverlays` 用「本局唯一識別」去重（較複雜，不建議）。

### 注意
- 讀檔回到「正常進行中」的局（未局末）不會觸發結算 → 不受影響。
- 只需處理「載入即局末」或「先前已結算又讀檔」的防重。

### 補充（2026-08-27 代碼探索後確認）
問題範圍比上述更廣，修復時應一併處理：
1. `loadGameFromSlot` / `loadGame` **不還原** `activeCharacterId`、
   `currentScenarioId`、`lastGameSettings` → 讀檔後結算可能回寫到
   **錯誤角色**或 null。只加 `rewardSettled` 旗標防重複是不夠的，
   還需在存檔時把 `activeCharacterId` 寫入 slot 並於讀檔還原。
2. `restartGame()` 不清 `activeCharacterId`（重開新局沿用同名册角色）——
   需確認是否為刻意設計；若是刻意，`rewardSettled` 仍須在 restart 時重置。
3. 根本解法：將 `activeCharacterId` 移入 `GameState`（隨存檔序列化），
   模組級可變狀態正是本次 bug 的溫床。
4. 測試：`gameStore.test.ts` 加案例「載入局末存檔 → settle 回傳 null」、
   「同局二次 settle 冪等」。

### 實作記錄（2026-08-27 已完成）
- `gameStore.ts`：新增模組旗標 `rewardSettled`；`startGame` / `restartGame`
  / `resetForTest` 重置為 false；`settleActiveCharacterRewards` 冪等
  （已 settled 回傳 null）；`loadGameFromSlot` / `loadGame` 載入局末存檔時
  設為 true。
- `gameSave.ts`：存檔 payload 新增 `activeCharacterId` 欄位（向下相容，
  舊存檔缺漏視為 null）；讀檔還原 `activeCharacterId`，避免結算回寫錯誤角色。
- 測試：`gameStore.test.ts` 新增 4 案例（二次 settle 冪等、restart 後可重算、
  載入局末存檔不重算、載入進行中存檔還原角色且可結算）。
- 驗證：全套件 92 檔 / 998 測試全數通過。

---

## 📋 待辦功能清單與開發切入點

| 待辦 | 開發切入點 | 難度 |
|---|---|---|
| 威脅度計量表（據點血量/資源點血量/怪物數） | 新增 `rules/threatRules.ts` 純計算 + HUD 元件顯示；資料全在 `GameState` 現成欄位 | ⭐ 低 |
| 怪物種類多樣化（主動/被動、不同目的） | `CreatureState` 加 `behaviorType` 欄位；`ai/policy/` 已分層可直接掛策略；`creatureTurnPipeline.ts` 分派 | ⭐⭐⭐ 高 |
| 怪物巡邏範圍加大 | `actions/creatureActions.ts` 巡邏半徑參數化，放 `gameSettings` 或怪物 config | ⭐ 低 |
| 行動機率觸發事件（免探索點） | `endPlayerTurn` 的 `appendActionEvents` 管線加機率分支，複用 `events/eventSpawner.ts`；注意與 `pendingCreatureTurn` 延後機制的互動 | ⭐⭐ 中 |
| 打怪掉落金錢 | `resolveCreatureDefeatRewards`（combatActions.ts L175）已存在，加金錢欄位即可 | ⭐ 低 |

建議開發順序：殘卷 bug（含 activeCharacterId 持久化）→ 掉金錢 + 巡邏範圍
→ 威脅度計量表 → 行動觸發事件 → 怪物多樣化（最大工程，先寫設計文件到
`reports/system/`）。