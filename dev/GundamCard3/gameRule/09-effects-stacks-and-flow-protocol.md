# 09 — 效果物件、三種佇列與 Flow 協議（重寫必讀）

## `Effect` 本體

`bun/src/game/define/Effect.ts`：

- `id: string`（空字串時 `addStackEffect`／`addImmediateEffect` 會配 UUID）  
- `reason: EffectReason` — **決定控制者與「來源卡 id」**  
- `text: CardText` — 條件、提示、邏輯樹（見 `10`）  
- `description?`、`isOption?`

### `EffectReason` 變體（重寫需完整支援）

| 標籤 | 用途（摘要） |
|------|----------------|
| `場に出る` | 進場 |
| `PlayCard` | 從手牌等打出卡牌；第四參可標 `isPlayG`／`isPlayUnit` 等 |
| `PlayText` | 使用場上文字能力 |
| `GameRule` | 系統規則；`reason[1]` 為控制玩家；**無真實 cardId** |
| `Destroy` | 破壞廢棄效果；帶 `DestroyReason` |
| `Situation` | 局面類效果 |
| `Event` | 事件驅動 |

### `EffectFn.getCardID` 與假卡 ID

- `GameRule` 效果沒有真實卡牌：`getCardID` 回傳 `SystemFakeCardID_${text.id}`，僅供 **TipSelection 存入 `ItemState`** 等內部用途。重寫 UI 時勿把假 ID 當真卡。

## 三種效果佇列（`EffectStackComponent`）

`bun/src/game/gameState/EffectStackComponent.ts` 註解為準：

1. **`immediateEffect`**：必須**立即**一個個處理；**新效果插在陣列前端**（index 0 最先處理）。`addImmediateEffect` 會觸發 `EventCenterFn.onAddImmediateEffect`。  
2. **`stackEffect`**：**主堆疊**；**新效果插在陣列前端**（`stackEffect[0]` = 堆疊頂）。切入即再往上疊。  
3. **`destroyEffect`**：戰鬥傷害等產生的**破壞／廃棄**效果先進此佇列；在大多數時機由**主動玩家** `FlowMakeDestroyOrder` 決定順序後轉入主堆疊（`doCutInDestroyEffectsAndClear`）。**ダメージ判定／規定の効果**進行中 `queryFlow` 會**暫停**破壞順序 UI（見 `queryFlow` `SelectDestroyOrder`）。

所有效果實體存於 `ctx.effects: { [id]: Effect }`；佇列只存 id。

## `addImmediateEffectIfCanPayCost`

- 先 `createCommandEffectTips` 檢查條件；無合法提示 → 不加入佇列，改 `onAddImmediateEffectButConditionFail`（除非 `isAssertConditionPass` 丟錯）。  
- 可選 `isSkipLimitCheck`：略過「本回合已用過該 text.id」的阻擋（手牌調整等使用）。

## Flow 型別目錄

`bun/src/game/gameStateWithFlowMemory/Flow.ts` 定義**伺服器與客戶端之間的合法動作枚舉**，重寫時需實作同等狀態機：

- `FlowTriggerTextEvent` / `FlowNextTiming` — 推進階段  
- `FlowPassPhase` / `FlowCancelPassPhase` — 自由時機結束宣告  
- `FlowSetActiveEffectID` / `FlowCancelActiveEffectID` — 選定要支付的效果  
- `FlowSetActiveLogicID` — 多邏輯擇一  
- `FlowSetTipSelection` — 填入條件目標  
- `FlowPassPayCost` / `FlowDoEffect` — 支付完成後執行  
- `FlowPassCut` / `FlowCancelPassCut` — 堆疊切入權  
- `FlowHandleStackEffectFinished` — 堆疊清空後事件  
- `FlowMakeDestroyOrder` — 破壞順序  
- `FlowDeleteImmediateEffect` — 放棄可選立即效果  
- `FlowWaitPlayer` / `FlowObserveEffect` / `FlowUpdateCommand`

**權威流程**在 `queryFlow`（何時誰可點什麼）+ `applyFlow`（套用後狀態變化）。

## 橫向檢查

- **與 01**：`FlowNextTiming` 會清 `hasTriggerEvent`、`hasPlayerPassPhase`。  
- **與 05**：切入與自由時機使用**不同** Pass 旗標。  
- **與 10**：`FlowDoEffect` 最終進 `doActiveEffect` → `doEffect`，依賴 CardText 內可執行字串。

## 重寫風險

- 若只實作「堆疊」而不實作 **`immediateEffect` 優先與主被動等待**，行為會與原版不一致。  
- `stackEffectMemory` 與 `カット終了時` 事件綁定，漏做會少觸發一整類效果。

## 第二輪補遺：`EventCenterFn` 鉤子清單

`bun/src/game/gameState/EventCenter.ts` 在規則步驟之間插入橫切邏輯；重寫時至少要實作**被現有程式呼叫**的點，否則行為漂移。

- **效果生命週期**：`onEffectStart`、`onEffectEnd`、`onActionStart`、`onActionEnd`  
- **事件／觸發**：`onEvent`（內部再分派 `doTriggerEvent` 等）  
- **立即效果**：`onAddImmediateEffect`、`onAddImmediateEffectButConditionFail`  
- **目標錯誤**：`onTargetMessingError`  
- **ItemState／Card**：`onItemStateChange`、`onItemStateDestroyReasonChange`、`onItemDamageChange`、`onCardChange`  
- **玩家狀態**：`onPlayerStateChange`  
- **セット**：`onSetSetGroupParent`  
- **階段與戰鬥**：`onSetPhase`、`onIsBattleChange`  
- **本国**：`onCountryDamage`、`onCountryHeal`  
- **場上物件**：`onItemAdd`、`onItemDelete`、`onItemMoveBefore`、`onItemMove`  
- **牌桌**：`onTableChange`

完整副作用（含 `removeSetGroupParent`、`updateGlobalEffects` 等）請直接對照該檔實作，**不可只抄函式名**。
