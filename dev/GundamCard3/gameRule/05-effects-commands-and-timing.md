# 05 — 指令、堆疊、切入與出牌時機

## 程式依據

- 聚合可執行效果：`updateCommand.ts` → `createPlayEffects.ts`、`createPlayCardEffects.ts` 等。  
- 堆疊與切入：`queryFlow.ts`（`stackEffect`、`hasPlayerPassCut`）。  
- 效果執行與支付：`applyFlow.ts`（`FlowDoEffect`、`FlowPassPayCost`）、`doEffect.ts`。  
- 事件型定義：`bun/src/game/define/GameEvent.ts`。

## `updateCommand` 在做什麼

- 對 **PlayerA、PlayerB** 各跑一次 `createPlayEffects`，合併為 `commandEffects`，再經 `createCommandEffectTips` 產生帶錯誤檢查的 `commandEffectTips`。  
- 玩家可選指令來自 `getPlayerCommandsFilterNoErrorDistinct`。

## 配備フェイズ vs 自由タイミング（`createPlayEffects`）

- **配備フェイズ／フリータイミング**：掃描己方所有「有文字在場上」的區域（`BaSyouKeywordFn.getTextOn()`），對非 **コマンド** 卡產生 `createPlayCardEffects`，並過濾 `inTiming`。  
- **其它階段的自由タイミング**：僅當卡片具 **クイック** 特殊效果時，可略過 `inTiming` 檢查產生出牌效果（註解「クイック不判斷使用時機」）。  
- **コマンド**：僅在 `PhaseFn.isFreeTiming` 為真時聚合，且需 `inTiming`。

## G ゾーン上的文字能力

- 在 `getBaAll()` 掃描中，若區域為 **Gゾーン**，僅 `protectLevel == 2` 的文字會被納入（其餘略過）。

## 堆疊最上方效果的處理順序（摘要）

1. 若**並非**雙方都 `FlowPassCut`：  
   - 若當前玩家是堆疊頂效果的**控制者**，需等**對手先 PassCut** 才能輪到自己切入或 Pass。  
   - 否則可選擇**切入**（`FlowSetActiveEffectID` 搭配指令列表）或 **PassCut**。  
2. 雙方都 Pass 後：由**控制者**支付並執行堆疊頂效果（`FlowSetActiveEffectID` → 支付鏈 → `FlowDoEffect`）。

## 切入後重置

- `applyFlow` 在 `FlowDoEffect` 後會清空雙方 `hasPlayerPassCut`，使下一個堆疊效果可再次切入。

## 立即效果與主動權

- 見 [01-turn-engine.md](./01-turn-engine.md)；與堆疊邏輯**分開**，不要混用旗標。

## 與其它規則的橫向檢查

- **與 01**：自由時機必須雙方 `PassPhase` 才 `FlowNextTiming`；**即使堆疊為空**，仍受此限制。  
- **與 04**：`FlowMakeDestroyOrder` 將 `destroyEffect` 轉入堆疊；之後切入規則與本檔相同。  
- **潛在誤解**：「切入優先權」僅在 **堆疊非空** 時生效；空堆疊時走立即效果或自由時機指令。

## 第二輪補遺

- **支付對手放棄**：`FlowPassPayCost` 需**雙方都 pass** 或特定組合後才 `FlowDoEffect`；非控制者也可被動等待或觀察（`FlowObserveEffect`）。  
- **`GameEvent` 與觸發**：牌面事件標題列舉於 `GameEvent.ts`（如場出、破壊、交戦中等）；與 `Phase` 驅動的 `GameEventOnTiming` **並列**兩種來源。
