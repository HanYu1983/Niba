# 03 — 交戰快照、部隊與出擊

## 程式依據

- 交戰與快照：`bun/src/game/gameState/IsBattleComponent.ts`（`checkIsBattle`、`battleSnapshot`、`isBattle`）。  
- 部隊（battle group）：`bun/src/game/gameState/battleGroup.ts`（`getBattleGroup`、`getBattleGroupBattlePoint`）。  
- 出擊條件與事件：`createAttackPhaseRuleEffect.ts`、`player.ts`（`getPlayerUnitCanGoEarthIds`、`getPlayerUnitCanGoSpaceIds`）。  
- セットグループ戰鬥力合算：`bun/src/game/gameState/setGroup.ts`。

## 部隊（Battle Group）

- 同一絕對場所上，**セットグループ根（root）等於自己的卡片**視為一個部隊單位。  
- `getBattleGroup(ctx, baSyou)` 回傳該場上所有「根」卡 ID。

## 戰鬥力合算（`getBattleGroupBattlePoint`）

對快照中的部隊成員逐一貢獻戰鬥力：

- 若某卡**已不在**當前實際場上對應部隊列表中：該位置貢獻 **0**（日誌註明「不在原位算 0」）。  
- **已標記破壞**（`destroyReason != null`）：**0**。  
- **橫置**（`card.isRoll`）：**0**。  
- 否则取 `getSetGroupBattlePoint`：集合內各卡戰鬥力向量相加後轉 **格鬥／射擊／HP**。  
- **順位**：快照中 **索引 0** 的單位貢獻 **格鬥力**；其餘索引貢獻 **射擊力**。  
- 另可疊加全域效果如：部隊戰闘力 +N、交戰中敵軍部隊戰闘力 -N（依 `globalEffectPool` 標題分支）。

## 交戰（いずれかの戦闘エリア）

- `checkIsBattle` 對 **戦闘エリア1、戦闘エリア2** 逐一：  
  - 先將**當前**該區卡列表寫入 `battleSnapshot[key]`。  
  - `isBattleAtBasyou`：若**己方快照長度 > 0** 且**對手對應區快照長度 > 0** → **交戰中**。  
- 若交戰狀態與先前不同，觸發 `EventCenterFn.onIsBattleChange`。  
- `isBattle(ctx, cardID, cardID2?)`：以**快照**判斷雙方區是否都有單位；可選第二參數檢查是否與特定敵卡「對位」。

## 出擊規定效果（攻撃／防御ステップ）

- **攻撃ステップ**的規定の効果：主動玩家；**防御ステップ**：改為**對手**（`applyFlow` 內 `PlayerIDFn.getOpponent(ctx.activePlayerID)`）。  
- 效果本體 `createAttackPhaseRuleEffect`：可選（`isOption: true`），描述為「出擊」。  
- **去地球**：符合 `getPlayerUnitCanGoEarthIds` 的部隊 → 移至主動方 **戦闘エリア1**，並依當前步驟寫入 `itemState.isAttack`／`isDefence`。  
- **去宇宙**：對 **戦闘エリア2** 同理（`getPlayerUnitCanGoSpaceIds`）。  
- 僅在 **攻撃ステップ／規定の効果** 時觸發事件：`このカードが攻撃に出撃した場合`、`ユニットが出撃した場合`。  
- 最後呼叫 `checkIsBattle` 更新交戰狀態。

### `getPlayerUnitCanGoEarthIds`／`Space` 節選規則

- 若該戰鬥區的 `runtimeBattleArea` 與目標區域**相反**（例如要去地球區但 runtime 是宇宙）：**無人可出擊**。  
- 候選為**配備エリア**上的部隊根，且原型 `battleArea` 需包含目標 **地球／宇宙** 關鍵字。  
- 預設 **橫置不可出擊**；除非全域效果允許「ロール状態でも防御に出撃できる」等（程式用於防禦相關篩選，鍵名見程式）。  
- 若該區**已有對手部隊**，且對手部隊**全體**具 **高機動**：己方僅能出 **己方部隊也具高機動** 者（`isABattleGroup`／`isSetGroupHasA`）。

## 與其它規則的橫向檢查

- **與 04**：`doPlayerAttack` 註解明確寫道：傷害判定前若**曾成立交戰**，即使防方機體已全滅，**仍不能打本國**——依賴本檔的 `isBattle`（快照語意）。這與「強襲」例外同見 `04`，需一併閱讀避免誤解。  
- **與 02**：地球／宇宙對應寫死在 `RuntimeBattleAreaComponent`，不隨卡片改變。

## 第二輪補遺（衝突深挖）

- **快照時點**：戰鬥各步驟的 **ステップ開始** 會 `checkIsBattle`，故「是否交戰」在步驟內以最近一次檢查為準；**規定の効果**內出擊後再 `checkIsBattle` 會更新快照。  
- **「交戰中」與「能否打本國」**：`player.ts` 使用 `isBattle(ctx, willAttackUnits[0], null)`——即只要有對手區在快照上有單位即可能阻擋本國傷害，與 `isBattleAtBasyou` 定義一致，**無內部矛盾**。

```43:48:bun/src/game/gameState/IsBattleComponent.ts
export function isBattleAtBasyou(ctx: IsBattleComponent, basyou: AbsoluteBaSyou): boolean {
  const opponentBasyou = AbsoluteBaSyouFn.setOpponentPlayerID(basyou);
  const len1 = (ctx.battleSnapshot[AbsoluteBaSyouFn.toString(basyou)] || []).length
  const len2 = (ctx.battleSnapshot[AbsoluteBaSyouFn.toString(opponentBasyou)] || []).length
  return len1 > 0 && len2 > 0
}
```

```66:88:bun/src/game/gameState/IsBattleComponent.ts
export function isBattle(
  ctx: IsBattleComponent,
  cardID: string,
  cardID2: string | null
): boolean {
  const baSyou1 = getItemBaSyou(ctx, cardID);
  const baSyou1Ids = (ctx.battleSnapshot[AbsoluteBaSyouFn.toString(baSyou1)] || [])
  if (baSyou1Ids.length == 0) {
    return false
  }
  if (baSyou1Ids.includes(cardID) == false) {
    return false
  }
  const baSyou2 = AbsoluteBaSyouFn.setOpponentPlayerID(baSyou1);
  const opponentAreaIds = (ctx.battleSnapshot[AbsoluteBaSyouFn.toString(baSyou2)] || [])
  if (opponentAreaIds.length == 0) {
    return false
  }
  if (cardID2) {
    return opponentAreaIds.includes(cardID2)
  }
  return true
}
```
