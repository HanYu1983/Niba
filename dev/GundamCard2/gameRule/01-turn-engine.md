# 01 — 回合引擎與流程控制

## 程式依據

- 階段序列：`bun/src/game/define/Timing.ts` 中 `PhaseFn.getAll()`、`getNext()`（循環）。  
- 系統事件與進階：`bun/src/game/gameStateWithFlowMemory/applyFlow.ts`（`FlowTriggerTextEvent`、`FlowNextTiming`）。  
- 玩家可做什麼：`bun/src/game/gameStateWithFlowMemory/queryFlow.ts`。

## 規則要點（反推）

### 階段順序

一回合內階段依 `PhaseFn.getAll()` 固定順序循環，包含：

- **リロールフェイズ**：フェイズ開始 → 規定の効果 → フリータイミング → フェイズ終了  
- **ドローフェイズ**：同上結構  
- **配備フェイズ**：フェイズ開始 → フリータイミング → フェイズ終了（**無**「規定の効果」節點）  
- **戦闘フェイズ**：攻撃／防御／ダメージ判定／帰還 各步驟均為：ステップ開始 → フリータイミング → 規定の効果 → フリータイミング2 → ステップ終了  
- **ターン終了時**：ダメージリセット → 効果解決 → 手札調整 → 効果終了。ターン終了  

### 誰來推進「時機」

- 在**自由タイミング**（含戰鬥步驟的フリータイミング／フリータイミング2）：`queryFlow` 中 `handleFreeTiming()` 要求 **PlayerA 與 PlayerB 的 `hasPlayerPassPhase` 皆為 true**，且呼叫者為**主動玩家**時，才允許 `FlowNextTiming`。  
- 在非自由時機：主動玩家若已執行完當前時機的 `FlowTriggerTextEvent`（`flowMemory.hasTriggerEvent == true`），下一個 query 會直接給 `FlowNextTiming`（被動方 `FlowWaitPlayer`）。

### `FlowTriggerTextEvent` 與當前 `phase`

- 觸發時檢查 `flow.event` 必須是 `["GameEventOnTiming", ctx.phase]`，否則丟錯——即**只能在「當前時機」觸發對應的 on-timing 邏輯**。  
- 依 `ctx.phase[0]` 分支：`ドロー`／`リロール` 的 **規定の効果** 會 `addImmediateEffect` 排入對應規則效果；戦闘各步驟則在 **規定の効果** 排入出擊／ダメージ／帰還等（見 `03`、`04` 文檔）。  
- 多數時機另會 `doTriggerEvent(ctx, { title: ["GameEventOnTiming", ctx.phase] }, …)` 讓卡片的「時機類」能力反應。

### 立即效果（`immediateEffect`）

- 堆疊為空且有待處理立即效果時：**非主動玩家**若仍有「對方的立即效果」則等待；否則主動方需先處理自己的立即效果。  
- 可選效果（`isOption`）或經測試已無法支付的，可 `FlowDeleteImmediateEffect` 放棄。

### 遊戲結束

- 任一方 **本国** 牌堆（`table.cardStack` 對應键）長度為 0：`queryFlow` 回傳 `FlowWaitPlayer`「遊戲結束」。  
- 語意上對應「本国無卡可抽／本国被削完」類終局條件，與實體規則書用語可能略有出入，以程式為準。

### 回合交接

- 在 `["戦闘フェイズ","ターン終了時","効果終了。ターン終了"]` 觸發後：`activePlayerID` 改為對手，`turn` 加一（`applyFlow`）。

## 與其它規則的橫向檢查

- **與 02**：ドロー／リロール的「規定の効果」只在本檔描述的時機排程；實際移牌邏輯在 02。  
- **與 05**：自由時機內可執行「指令／出牌」與 `FlowPassPhase` 並存；雙方都 Pass 後才進下一時機，**不會**因單方打完牌自動進階。  
- **衝突排查**：若直覺上「主動方說結束就該進戰鬥下一步」，與程式不符——程式要求**雙方**都宣告該自由時機結束（`queryFlow` `handleFreeTiming`）。

## 第二輪補遺（更深）

- **切入與堆疊**：堆疊非空時切入邏輯不在本檔細展開，完整優先權見 [05-effects-commands-and-timing.md](./05-effects-commands-and-timing.md)；與「自由時機 Pass」是**不同**旗標（`hasPlayerPassCut` vs `hasPlayerPassPhase`）。  
- **配備フェイズ無「規定の効果」**：若規則書記載配備開始時有強制處理，本引擎可能改由卡片 `GameEventOnTiming` 或進場效果承擔——需對照單卡，非引擎全域步驟。

## 第三輪補遺（重寫導向）

- **客戶端／伺服器協議**：凡「誰在何時可執行何動作」的完整決策樹在 `queryFlow.ts`；動作型別在 `Flow.ts`。重寫網路層時應以 [09-effects-stacks-and-flow-protocol.md](./09-effects-stacks-and-flow-protocol.md) 為準，避免只複製本檔文字描述。
