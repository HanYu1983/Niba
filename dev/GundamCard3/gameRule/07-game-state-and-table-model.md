# 07 — 遊戲狀態、牌桌與初始化（重寫必讀）

## 目的

讓重寫者能還原**單一真相狀態（single source of truth）**與**持久化／同步時要帶的欄位**，避免只抄戰鬥公式卻漏掉 `flowMemory` 或 `table.cardStack` 順序語意。

## `GameState` 頂層組合

定義於 `bun/src/game/gameState/GameState.ts`：

- `isGameState: true`（型別守衛用）  
- `globalEffectPool: { [key: string]: GlobalEffect[] }`  
- `turn: number`  
- 並組合：`SetGroupComponent`、`IsBattleComponent`、`CardTableComponent`、`EffectStackComponent`、`ItemStateComponent`、`PhaseComponent`、`PlayerStateComponent`、`ActivePlayerComponent`、`CoinTableComponent`、`ItemTableComponent`（Card+Chip+Coin+SetGroup）、`RuntimeBattleAreaComponent`、`MessageComponent`

重寫時至少要能表達：**牌在哪（table）**、**每張牌／衍生物的狀態（itemStates）**、**階段與主動玩家**、**效果與堆疊**、**セット親子**、**交戰快照**、**訊息／除錯**。

## `GameStateWithFlowMemory`

`bun/src/game/gameStateWithFlowMemory/GameStateWithFlowMemory.ts`：

- `GameState` + `flowMemory: FlowMemoryComponent` + `stackEffectMemory: Effect[]`（堆疊清空時記憶，供「カット終了時」類事件）

### `flowMemory` 欄位語意

| 欄位 | 用途 |
|------|------|
| `state` | `prepareDeck` → `whoFirst` → `draw6AndConfirm` → `playing`；開局狀態機 |
| `hasTriggerEvent` | 當前「時機」是否已跑過 `FlowTriggerTextEvent`；避免重複觸發 |
| `hasPlayerPassPhase` | 自由時機內，雙方是否宣告「子階段結束」 |
| `hasPlayerPassCut` | 堆疊頂效果結算前，雙方是否放棄切入 |
| `hasPlayerPassPayCost` | 支付連鎖中雙方是否 pass |
| `shouldTriggerStackEffectFinishedEvent` | 堆疊結束後要觸發 `カット終了時` |
| `activeEffectID` / `activeLogicID` / `activeLogicSubID` | 當前正在支付／選邏輯的效果 |

## 牌桌 `table.cardStack`

實作：`bun/src/tool/table/index.ts`。

- **鍵**：`AbsoluteBaSyouFn.toString(baSyou)`，即 **JSON 字串化的 `[PlayerID, BaSyouKeyword]`**（例如 `["PlayerA","本国"]` 的字串形式）。重寫時必須與此一致，否則存檔／網路同步會對不上。  
- **值**：`string[]`，**陣列順序即區域內牌的順序**。  
  - **頂端／先抽**：程式從本国抽牌使用 `slice(0, n)`（見 `createDrawPhaseRuleEffect`、`applyFlow` 起手六張），故 **index 0 = 牌堆頂**（先被抽／先被當戰鬥傷害削到）。  
- **移動**：`TableFns.moveCard`；預設 append 到目標陣列**尾端**；`insertId === 0` 時改為插到**陣列開頭**（常見於本国傷害／回復時指定置頂）。

## 開局 `initState`

`GameStateWithFlowMemory.ts` 的 `initState(ctx, deckA, deckB)`：

1. `createCardWithProtoIds` 將兩副牌（原型 ID 列表）放入雙方 **本国**。  
2. 兩方本国 **shuffle**。  
3. `initCardFace`：**本国、捨て山、手札** 的 `Card.isFaceDown = true`；其餘區域 `false`。  
4. `setActivePlayerID(ctx, PlayerA)` — **先手在程式裡固定為 PlayerA**（若產品需猜拳，要在別層覆寫）。  
5. `flowMemory` 重置為 `DEFAULT_FLOW_MEMORY`（`prepareDeck`）。

接著透過 `FlowTriggerTextEvent` 依序推進：`prepareDeck` 洗牌 → `whoFirst` → `draw6AndConfirm`（見 `applyFlow` 與 `01`）。

## `PlayerState`（每位玩家）

`bun/src/game/define/PlayerState.ts`：

- `turn`、`playGCount`、`confirmPhase`、`textIdsUseThisTurn`  
- `PlayerStateFn.onTurnEnd` 會清空 `playGCount` 與 `textIdsUseThisTurn`（回合結束掛鉤需與引擎一致）

## `ItemState`（每個 item 實例）

`bun/src/game/define/ItemState.ts` 精要：

- `damage`、`destroyReason`  
- `tips`（使用者選擇的目標暫存，鍵為條件 key）  
- `flags`、`globalEffects`（掛在單卡上的全域效果）  
- `varNamesRemoveOnTurnEnd` / `varNamesRemoveOnStepEnd`  
- `isAttack` / `isDefence`（出擊步驟標記）  
- `textIdsUseThisTurn`（起動類「每回合一次」等，`addImmediateEffectIfCanPayCost` 與 `isSkipLimitCheck` 互動）

## 橫向檢查

- **與 08**：`table` 只存 **itemId 列表**；`cards`／`chips`／`coins` 另表存本體與 owner。  
- **與 09**：`effects` 以 id 對應 `Effect`，`stackEffect`／`immediateEffect`／`destroyEffect` 存 **id 列表** 表順序。

## 重寫缺口提醒

- **whoFirst**：`applyFlow` 目前幾乎直接切狀態，**未見完整「決先手」互動**；重寫產品規格時需自行定義或還原 UI 層邏輯。  
- **MessageComponent**：偏 log／UI，不影響規則結算，但除錯依賴它。
