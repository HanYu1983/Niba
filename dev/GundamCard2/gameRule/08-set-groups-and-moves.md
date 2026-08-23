# 08 — セットグループ與移動規則（重寫必讀）

## 資料結構

- `setGroup` 使用泛用 **ItemGroup**（`bun/src/tool/ItemGroup`，由 `SetGroupComponent` 持有）。  
- `getSetGroupRoot(ctx, id)`：找根（部隊「代表」）。  
- `getSetGroupChildren(ctx, rootId)`：同一セット內所有 item id（含根）。  
- `setSetGroupParent(ctx, parentCardId, cardId)`：建立親子；會觸發 `EventCenterFn.onSetSetGroupParent`。  
- `removeSetGroupParent(ctx, cardId)`：刪除關係。

**部隊**在戰鬥區的判定：同一 `AbsoluteBaSyou` 上，`getSetGroupRoot == 自身 id` 的卡視為一支部隊（見 `battleGroup.ts`）。

## 移動時的「整組拖移」（p66）

`bun/src/game/gameState/doItemMove.ts` 中 `doItemMoveBasic`：

- 對 **Card** 或 **Chip** 移動時，`itemIds = getSetGroupChildren(ctx, itemId)`，**對組內每一張**依序：  
  1. `EventCenterFn.onItemMoveBefore`  
  2. `TableFns.moveCard`（從該卡當前實際位置 `getItemBaSyou`）  
  3. `EventCenterFn.onItemMove`  
- 因此：**移動根卡＝移動整個セット的實體位置**（子卡不會留在原區）。

## `doItemMove` vs `doItemMoveBasic`

- `doItemMove`：先 `assertTargetMissingError`（效果結算時目標仍須合法），再呼叫 `doItemMoveBasic`。  
- `doItemMoveBasic`：純移動；本国傷害等規則直接用此函式略過 assert（見 `doCountryDamage`）。

## 硬幣

- `isCoin`：**不可** `moveCard`（丟錯）；硬幣語意由 `CoinTableComponent` 處理。

## 全域效果：改寫目的地

若存在標題為  
`場、または手札から、自軍ジャンクヤードにカードが移る場合、ジャンクヤードに移る代わりにゲームから取り除かれる`  
且來源為「場」或「手札」、目標為**該效果控制者的ジャンクヤード**：程式把 `to` 改為 **取り除かれたカード**（`doItemMoveBasic` 開頭）。

## 程式內未竟事項（重寫者需決策）

`SetGroupComponent.ts` 註解與 TODO（節錄意譯）：

- **P67**：セット 破壊／移動到本国或捨て山時，**玩家應可決定順序** — 現況未必完整。  
- **P56**：對象在解決時變成不可指定 → **失對象** — 需對照 `assertTargetMissingError` 與效果文。  
- **P68**：起動效果一回合一次（除非「每」）— 與 `textIdsUseThisTurn`／`addImmediateEffectIfCanPayCost` 部分對應，**註解稱 TODO**。  
- 多張單卡規則（改装複數、先頭處理、對抗無效後再支付等）列在註解中，**重寫時不可當作已完成**。

## 橫向檢查

- **與 03／04**：戰鬥力用 `getSetGroupChildren` 合算；破壞排程可能以「根」或組內多卡為單位，需讀 `createDestroyEffect` 呼叫點。  
- **與 07**：`table` 內卡序與セット無關；セット只決定「一起動」的 id 集合。
