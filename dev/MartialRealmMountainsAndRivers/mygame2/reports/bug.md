

---

## 🐛 BUG: 讀檔時殘卷被重複計算 (save-load re-calc scroll reward)

**狀態**: ⏳ 待解決（下次對接）｜ 更新: 2026-08-27

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

---

* 威脅度計量表: 據點的血量, 資源點的血量, 怪物數目
* 怪的種類變多, 目的不一樣, 主動被動
* 怪物巡邏要走遠一些
* 每一次行動都有幾率觸發事件, 不需要探索點
* 打怪要掉落金錢