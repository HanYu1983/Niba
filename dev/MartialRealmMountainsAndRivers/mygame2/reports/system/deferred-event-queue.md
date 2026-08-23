# 回合結束延後流程追蹤（Deferred Turn Flow）

> 本文檔記錄「回合結束時探索事件與敵人行動的彈窗順序」的現有實作方式、潛在風險，
> 以及未來若需擴充時的改進方向。**本文僅為追蹤記錄，不代表需要立即實作。**

## 背景

玩家的回合結束（`gameStore.endPlayerTurn`）原本一次完成兩件事：

1. 以可設定機率觸發「探索事件」（`pendingExplorationEvent`）
2. 計算並執行敵人行動（`animateCreatureTurn`，產生生物行動彈窗）

兩者同步進行，導致探索事件彈窗與敵人行動彈窗**同時出現**，體驗不佳。

## 現有實作方式

為讓順序變為「探索事件 → 事件結果 → 敵人行動」，引入了延後機制：

| 組件 | 角色 |
|------|------|
| `pendingCreatureTurn`（`gameStore.ts` 模組變數） | 暫存敵人行動結果（`CreatureTurnResult`），待事件處理完再執行 |
| `endPlayerTurn` | 觸發事件時，把敵人行動結果寫入 `pendingCreatureTurn`，不立即 `animateCreatureTurn` |
| `resolvePendingExplorationEvent` | 事件選擇成功後，顯示結果彈窗（continuation 設為 `flush-creature-turn`） |
| `dismissPendingExplorationEvent` | 事件「直接關閉」（不選擇）時，立即執行敵人行動 |
| `flushPendingCreatureTurn` | 以目前 `gameState.players`（含事件效果）覆寫暫存結果後，執行 `animateCreatureTurn` |
| `ActionContinuation['flush-creature-turn']` | 事件結果彈窗關閉後，由 `confirmBlockingModal` 觸發 flush |

### 流程圖

```
玩家結束回合
  ├─ 觸發探索事件？
  │    ├─ 是 → 暫存 pendingCreatureTurn
  │    │        探索事件彈窗（先出現）
  │    │        ├─ 選擇 → 事件結果彈窗 → 關閉 → flush 敵人行動
  │    │        └─ 關閉（不選）→ 立即 flush 敵人行動
  │    │        → 下一位玩家／敵人行動彈窗
  │    └─ 否 → 立即 animateCreatureTurn
```

## 潛在風險

1. **控制流分散**：暫存→延後→flush 的邏輯散落在 `endPlayerTurn`、`resolvePendingExplorationEvent`、`dismissPendingExplorationEvent`、`flushPendingCreatureTurn`、`confirmBlockingModal` 五個方法。要理解一次「回合結束」的完整流程，須跨多處拼湊。

2. **非持久化的暫存**：`pendingCreatureTurn` 是模組變數，不在 `GameState` 內、不參與存檔。若在事件彈窗開啟時存檔／讀檔／關閉頁面，暫存的敵人行動會遺失。目前靠 `startGame`／`loadGameFromSlot`／`restartGame` 重置來規避，但「半途狀態」的邊界容易漏。

3. **continuation 的 if-else 擴張**：每新增一類延後動作，都要在 `ActionContinuation` 加一個 type，並在 `confirmBlockingModal` 加一個 `if`。種類變多時會趨於脆弱。

4. **「延後」語意隱晦**：敵人的移動結果其實已在 `endPlayerTurnAction` 寫入 state，延後的只是「動畫／彈窗／週期 Buff 結算」，而非「敵人是否行動」。未來維護者若誤解「延後 = 敵人還沒動」，可能造成狀態判斷錯誤。

## 未來改進方向（暫不實作）

若未來「回合結束時需依序處理多個彈窗」的場景增加（例如第二種隨機事件、NPC 對話等），可考慮將上述散落的延後邏輯抽象為**統一的待處理彈窗佇列**：

- 用一個佇列型別（類似 `DeferredStep[]`）取代單一 `pendingCreatureTurn` 變數。
- 所有「回合結束後續步驟」（探索事件、敵人行動、結果彈窗…）都推入佇列，依序出隊處理。
- 關鍵挑戰在於**調度器**：React 彈窗是 state 驅動，需設計「每處理完一步，誰來觸發下一步渲染」的機制，現有 `blockingModal` 的 continuation 可作為調度雛形。

> 註：在「只有單一延後場景」的現況下，此抽象屬於過早設計（YAGNI）。
> 建議待第二種需要延後的回合結束事件出現時，再回頭實作並參考本文件。

## 相關檔案

- `src/game/gameStore.ts`：`endPlayerTurn`、`resolvePendingExplorationEvent`、`dismissPendingExplorationEvent`、`flushPendingCreatureTurn`、`confirmBlockingModal`、模組變數 `pendingCreatureTurn`
- `src/game/types.ts`：`ActionContinuation`（含 `flush-creature-turn`）、`pendingExplorationEvent` 相關欄位
- `src/components/GameOverlays.tsx`：事件彈窗的 `onChoose`／`onClose` 串接