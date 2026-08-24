# 04 — ダメージ判定、本國傷害、破壞與帰還、回合末

## 程式依據

- ダメージ規定效果：`createDamageRuleEffect.ts` → `doPlayerAttack`（`player.ts`）。  
- 戰鬥傷害結算：`doRuleBattleDamage`、`doBattleDamage`（`player.ts`）。  
- 本國：`doCountryDamage.ts`。  
- 帰還：`createReturnRuleEffect.ts`。  
- 手札調整：`createDiscardRuleEffect.ts`；回合切換：`applyFlow.ts` ターン終了時。  
- 破壞排程：`queryFlow.ts` 中 `FlowMakeDestroyOrder`（ダメージ判定／規定の効果進行中例外）。

## ダメージ判定ステップ — 規定の効果

`createDamageRuleEffect` 令主動玩家對 **戦闘エリア1** 與 **戦闘エリア2** 各執行兩輪 `doPlayerAttack`：

1. **速度 1**  
2. **速度 2**

`doPlayerAttack` 對**攻方**與**守方**各呼叫一次 `doRuleBattleDamage`（同一速度下雙向結算）。

## 速度與速攻（`doRuleBattleDamage`）

- 若攻方部隊**全體**具 **速攻**（`isABattleGroup(ctx, ["速攻"], willAttackUnits[0], …)`）：只在 **速度 1** 造成傷害。  
- 若**不**具速攻：只在 **速度 2** 造成傷害。  
- 若 `willAttackUnits` 為空，不進行以上傷害邏輯。

## 對部隊造成戰鬥傷害（`doBattleDamage`）

- 依序對 `guardUnits` 中單位分配傷害；以 **HP - 當前 damage** 為可吸收量。  
- 傷害足夠擊破時：設 `destroyReason`、傷害設滿，**此時不發破壞事件**（註解：等進破壞堆疊）。  
- 部分傷害：觸發 `戦闘ダメージを受けた場合`，並帶 `isNotRule` 選項（與「是否算敵軍效果」的規則書註 p71 對應）。

## 溢傷與本國（`doRuleBattleDamage`）

- 條件：剩餘攻擊力 > 0，且**攻擊方為當前主動玩家**（`currentAttackPlayerID == getActivePlayerID(ctx)`）。  
- **打本國**當且僅當：  
  - `isBattle(ctx, willAttackUnits[0], null) == false`（**非交戰中**），**或**  
  - 攻方部隊**全體**具 **強襲**。  
- 滿足時呼叫 `doCountryDamage`：自本国頂依張數移到捨て山；並觸發 `自軍本国に戦闘ダメージが与えられた場合`。  
- 另觸發 `このカードの部隊が敵軍本国に戦闘ダメージを与えた場合`（卡列表為攻方部隊的セットグループ成員）。

### 與 03 的銜接（避免規則衝突）

- `player.ts` 註解：若已成立交戰，即使防禦方機體都不見，**一定不能打本國**——程式用 `isBattle(…, null)` 實現；**強襲**為明確例外。  
- 與快照語意一致：**無矛盾**。

## ダメージ後的破壞效果排程

- `doPlayerAttack` 結尾掃描交戰相關單位：若 `hp <= itemState.damage`，`addDestroyEffect(createDestroyEffect(…))`。  
- `queryFlow`：在 **ダメージ判定／規定の効果** 時**不**攔截破壞排程；其餘時機若有 `destroyEffect`，由**主動玩家**執行 `FlowMakeDestroyOrder` 決定順序並切入堆疊。

## 帰還ステップ — 規定の効果（`createReturnRuleEffect`）

對**雙方**的 **戦闘エリア1、戦闘エリア2**：

- 僅處理部隊根。  
- 若該部隊的 `battleArea` 包含**當前區域**（地球／宇宙）：**橫置**後移回該玩家的 **配備エリア**。  
- 否則（規則書註 p73）：移至 **ジャンクヤード**。

## ターン終了時

- **手札調整**：為 **PlayerA 與 PlayerB 各**建立 `createDiscardRuleEffect`（`addImmediateEffectIfCanPayCost`，`isSkipLimitCheck: true`）。  
- 手牌上限 **7**，可加上全域效果「自軍の手札の上限枚数に＋_１」；超過需選牌移至 **ジャンクヤード**（`doItemMoveBasic`）。  
- **不需棄牌時**：`createDiscardRuleEffect` 的條件會丟 `TipError`，`createCommandEffectTips` 無合法提示 → `addImmediateEffectIfCanPayCost` 不加入立即效果，改走 `EventCenterFn.onAddImmediateEffectButConditionFail`（見 `doEffect.ts`）。語意上等同「手牌已符合上限則跳過調整」。  
- **効果終了。ターン終了**：切換 `activePlayerID`、`turn++`。

### 程式碼對照（手牌調整）

```385:387:bun/src/game/gameStateWithFlowMemory/applyFlow.ts
                                    ctx = addImmediateEffectIfCanPayCost(ctx, createDiscardRuleEffect(ctx, PlayerA), { isSkipLimitCheck: true }) as GameStateWithFlowMemory
                                    ctx = addImmediateEffectIfCanPayCost(ctx, createDiscardRuleEffect(ctx, PlayerB), { isSkipLimitCheck: true }) as GameStateWithFlowMemory
                                    ctx = doTriggerEvent(ctx, { title: ["GameEventOnTiming", ctx.phase] }, { ges: getGlobalEffects(ctx, null) }) as GameStateWithFlowMemory;
```

```360:391:bun/src/game/gameState/doEffect.ts
export function addImmediateEffectIfCanPayCost(ctx: GameState, effect: Effect, options?: { isSkipLimitCheck?: boolean, isAssertConditionPass?: boolean }): GameState {
  const cets = createCommandEffectTips(ctx, effect)
  const cetsNoErr = cets.filter(CommandEffecTipFn.filterNoError)
  if (cetsNoErr.length == 0) {
    if (options?.isAssertConditionPass) {
      console.log(cets)
      console.log(cets.map(cet => cet.tipOrErrors.map(toe => toe.errors)))
      throw new Error(`condition not pass: ${effect.description}`)
    }
    ctx = EventCenterFn.onAddImmediateEffectButConditionFail(ctx, effect, cets)
    return ctx
  }
  // ... isSkipLimitCheck 略 ...
  return addImmediateEffect(ctx, effect) as GameState
}
```

## 與其它規則的橫向檢查

- **與 01**：ターン終了子階段順序固定；手札調整在切換主動玩家之前。  
- **與 05**：戰鬥中切入與堆疊解析不改寫本檔公式，但破壞排程進堆疊後會進入 05 的流程。

## 第二輪補遺

- **本国「治療」**：`doCountryDamage` 在 `damage < 0` 時自捨て山移回本国，並觸發 `EventCenterFn.onCountryHeal`——屬規則引擎支援的**負傷害**語意，實卡是否常用需對照效果文。  
- **雙向 `doRuleBattleDamage`**：同一 `doPlayerAttack` 內對攻守互換各跑一次，故**同一速度下雙方部隊若皆滿足速度條件，可能互換傷害**；解讀時勿假設「只有攻方打人」。

### 核心戰鬥結算（程式碼對照）

```160:187:bun/src/game/gameState/player.ts
export function doPlayerAttack(
  ctx: GameState,
  attackPlayerID: PlayerID,
  where: BaSyouKeyword,
  speedPhase: AttackSpeed,
  options: GameExtParams
): GameState {
  const guardPlayerID = PlayerIDFn.getOpponent(attackPlayerID)
  // ...
  const attackUnits = getBattleGroup(ctx, AbsoluteBaSyouFn.of(attackPlayerID, where));
  const attackUnitsSnapshot = getBattleGroupFromSnapshot(ctx, AbsoluteBaSyouFn.of(attackPlayerID, where));
  const attackPower = getBattleGroupBattlePoint(ctx, attackUnits, attackUnitsSnapshot, options);
  const guardUnits = getBattleGroup(ctx, AbsoluteBaSyouFn.of(guardPlayerID, where));
  const guardUnitsSnapshot = getBattleGroupFromSnapshot(ctx, AbsoluteBaSyouFn.of(guardPlayerID, where));
  const guardPower = getBattleGroupBattlePoint(ctx, guardUnits, guardUnitsSnapshot, options);
  ctx = doRuleBattleDamage(ctx, speedPhase, attackPlayerID, guardPlayerID, attackUnits, guardUnits, attackPower, { ges: options?.ges })
  ctx = doRuleBattleDamage(ctx, speedPhase, guardPlayerID, attackPlayerID, guardUnits, attackUnits, guardPower, { ges: options?.ges });
  // ... destroyEffect 略 ...
  return ctx;
}
```

```134:147:bun/src/game/gameState/player.ts
      if (currentAttackPlayerID == getActivePlayerID(ctx) && currentAttackPower > 0) {
        // 非交戰中或有強襲才能打本國(p35)
        if (isBattle(ctx, willAttackUnits[0], null) == false || isABattleGroup(ctx, ["強襲"], willAttackUnits[0], options)) {
          ctx = doCountryDamage(ctx, EffectFn.createGameRule(currentAttackPlayerID), currentGuardPlayerID, currentAttackPower, options)
          // ...
        }
      }
```
