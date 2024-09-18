import { pipe, always, map, flatten, reduce, repeat, lift } from "ramda"
import { createBridge } from "../bridge/createBridge"
import { AbsoluteBaSyouFn, AbsoluteBaSyou, BaSyouKeywordFn, BaSyouKeyword } from "../define/BaSyou"
import { CardTextFn, ConditionFn, LogicTreeActionFn, Condition, ConditionTitleFn, Action, ActionTitleFn, ActionFn, CardText, OnEventFn } from "../define/CardText"
import { CoinFn } from "../define/Coin"
import { Effect, DestroyReason, EffectFn } from "../define/Effect"
import { TargetMissingError } from "../define/GameError"
import { GameEvent } from "../define/GameEvent"
import { ItemStateFn } from "../define/ItemState"
import { PhaseFn } from "../define/Timing"
import { Tip, TipFn, StrBaSyouPair } from "../define/Tip"
import { getCardIdsCanPayRollCost, getCardRuntimeCategory } from "./card"
import { getCard, setCard } from "./CardTableComponent"
import { GameState } from "./GameState"
import { clearGlobalEffects } from "./globalEffects"
import { getItemStateValues, getItemState, setItemState } from "./ItemStateComponent"
import { getItemController, addCoinsToCard, isCard, isChip, getItemBaSyou, isCoin, getItemPrototype, getItemIdsByBasyou, moveItem } from "./ItemTableComponent"
import { triggerEvent } from "./triggerEvent"
import { Bridge } from "../../script/bridge"
import { GlobalEffect } from "../define/GlobalEffect"
import { ToolFn } from "../tool"
import { addStackEffect } from "./EffectStackComponent"
import { PlayerIDFn } from "../define/PlayerID"

export function doEffect(
  ctx: GameState,
  effect: Effect,
  logicId: number,
  logicConditionsId: number,
): GameState {
  const ltacs = CardTextFn.getLogicTreeActionConditions(effect.text, CardTextFn.getLogicTreeAction(effect.text, logicId))[logicConditionsId]
  if (ltacs == null) {
    throw new Error(`ltasc not found: ${logicId}/${logicConditionsId}`)
  }
  const conditionIds = Object.keys(ltacs)
  const conditions = conditionIds.map(id => CardTextFn.getCondition(effect.text, id))
  const bridge = createBridge()
  const processCondition = (ctx: GameState) => pipe(
    always(conditions),
    map(condition => ConditionFn.getActionTitleFns(condition, getActionTitleFn)),
    flatten,
    reduce((ctx, fn) => fn(ctx, effect, bridge), ctx)
  )
  const processLogicAction = (ctx: GameState) => pipe(
    always(CardTextFn.getLogicTreeAction(effect.text, logicId)),
    lta => LogicTreeActionFn.getActionTitleFns(lta, getActionTitleFn),
    reduce((ctx, fn) => {
      ctx = fn(ctx, effect, bridge)
      //clearGlobalEffects(ctx)
      return ctx
    }, ctx)
  )
  ctx = processCondition(ctx)()
  ctx = processLogicAction(ctx)()
  ctx = clearGlobalEffects(ctx)
  ctx = triggerEvent(ctx, { title: ["解決直後"], effect: effect })
  return ctx;
}

export function getEffectTips(
  ctx: GameState,
  effect: Effect,
  logicId: number,
  logicConditionsId: number,
): Tip[] {
  const ltacs = CardTextFn.getLogicTreeActionConditions(effect.text, CardTextFn.getLogicTreeAction(effect.text, logicId))[logicConditionsId]
  if (ltacs == null) {
    throw new Error(`ltasc not found: ${logicId}/${logicConditionsId}`)
  }
  const conditionIds = Object.keys(ltacs)
  const conditions = conditionIds.map(id => CardTextFn.getCondition(effect.text, id))
  const bridge = createBridge()
  const getTips = pipe(
    always(conditions),
    map(condition => getConditionTitleFn(condition, {})),
    map(tipFn => tipFn(ctx, effect, bridge)),
    flatten
  )
  return getTips()
}

export function getConditionTitleFn(condition: Condition, options: { isPlay?: boolean }): ConditionTitleFn {
  if (typeof condition.title == "string") {
    return ConditionFn.getTitleFn(condition)
  }
  switch (condition.title[0]) {
    case "合計国力〔x〕": {
      const [_, x] = condition.title
      return function (ctx: GameState, effect: Effect): Tip[] {
        const playerId = EffectFn.getPlayerID(effect)
        const cardIdsCanPay = getCardIdsCanPayRollCost(ctx, playerId, null)
        return [
          {
            title: ["合計国力〔x〕", cardIdsCanPay],
            min: x
          }
        ]
      }
    }
    case "本来の記述に｢特徴：_装弾｣を持つ_自軍_G_１枚": {
      const [_, targetChar, side, category, count] = condition.title
      return function (ctx: GameState, effect: Effect): Tip[] {
        const cardId = EffectFn.getPlayerID(effect)
        const playerId = getItemController(ctx, cardId);
        if (getItemPrototype(ctx, cardId).characteristic?.includes(targetChar)) {
          const targetPlayerId = side == "自軍" ? playerId : PlayerIDFn.getOpponent(playerId)
          const basyous: AbsoluteBaSyou[] = category == "グラフィック" ?
            [AbsoluteBaSyouFn.of(targetPlayerId, "Gゾーン")] :
            (lift(AbsoluteBaSyouFn.of)([targetPlayerId], BaSyouKeywordFn.getBaAll()))
          const pairs = basyous.flatMap(basyou => getItemIdsByBasyou(ctx, basyou).map(cardId => [cardId, basyou] as StrBaSyouPair))
          return [
            {
              title: ["カード", pairs, pairs.slice(0, count)],
              count: count,
            }
          ]
        }
        return []
      }
    }
    case "_戦闘エリアにいる_敵軍_ユニット_１～_２枚": {
      const [_, basyouKws, side, category, min, max] = condition.title
      return function (ctx: GameState, effect: Effect): Tip[] {
        const cardId = EffectFn.getPlayerID(effect)
        const playerId = getItemController(ctx, cardId);
        const targetPlayerId = side == "自軍" ? playerId : PlayerIDFn.getOpponent(playerId)
        const basyous: AbsoluteBaSyou[] = (lift(AbsoluteBaSyouFn.of)([targetPlayerId], basyouKws))
        const pairs = basyous.flatMap(basyou =>
          getItemIdsByBasyou(ctx, basyou)
            .filter(cardId => getCardRuntimeCategory(ctx, cardId) == category)
            .map(cardId => [cardId, basyou] as StrBaSyouPair)
        )
        return [
          {
            title: ["カード", pairs, pairs.slice(0, max)],
            min: min,
            max: max,
          }
        ]
      }
    }
    case "_敵軍_ユニットが_戦闘エリアにいる場合":
    case "_交戦中の_自軍_ユニット_１枚":
    case "このセットグループの_ユニットは":
    case "_自軍_ユニット_１枚":
    case "RollColor":
    case "_自軍手札、または自軍ハンガーにある、_６以下の合計国力を持つ_ユニット_１枚を":
      return function (ctx: GameState, effect: Effect): Tip[] {

        return []
      }
  }
}

export function getActionTitleFn(action: Action): ActionTitleFn {
  if (typeof action.title == "string") {
    return ActionFn.getTitleFn(action)
  }
  switch (action.title[0]) {
    case "cutIn": {
      const [_, actions] = action.title
      return function (ctx: GameState, effect: Effect): GameState {
        const cardId = EffectFn.getCardID(effect)
        ctx = addStackEffect(ctx, {
          reason: ["PlayText", EffectFn.getPlayerID(effect), cardId, effect.text.id || "unknown"],
          text: {
            id: "",
            title: [],
            logicTreeActions: [
              {
                actions: actions
              }
            ]
          }
        }) as GameState
        return ctx
      }
    }
    case "_ロールする": {
      const [_, isRoll] = action.title
      const varName = action.vars
      return function (ctx: GameState, effect: Effect): GameState {
        if (varName == null) {

        }
        return ctx
      }
    }
    case "_１ダメージを与える": {
      return function (ctx: GameState, effect: Effect): GameState {
        if (action.vars == null) {
          throw new Error(`action.var not found: ${action.title[0]}`)
        }
        const cardId = EffectFn.getCardID(effect)
        let cardState = getItemState(ctx, cardId);
        const tip = ItemStateFn.getTip(cardState, action.vars[0])
        const tipError = TipFn.checkTipSatisfies(tip)
        if (tipError) throw tipError
        if (tip.title[0] == "カード") {
          const targetPairs = TipFn.getSelection(tip) as StrBaSyouPair[]
          ctx = targetPairs.reduce((ctx, pair) => {
            return makeItemDamage(ctx, 1, pair)
          }, ctx)
        }
        return ctx
      }
    }
    case "_－１／－１／－１コイン_１個を乗せる": {
      const [_, bonus, x] = action.title
      const varNames = action.vars
      if (varNames == null) {
        throw new Error(`action.var not found: ${action.title[0]}`)
      }
      return function (ctx: GameState, effect: Effect): GameState {
        const cardId = EffectFn.getCardID(effect)
        const cardState = getItemState(ctx, cardId);
        const tip = ItemStateFn.getTip(cardState, varNames[0])
        const tipError = TipFn.checkTipSatisfies(tip)
        if (tipError) {
          throw tipError
        }
        if (tip.title[0] != "カード") {
          throw new Error("must カード")
        }
        const pairs = TipFn.getSelection(tip) as StrBaSyouPair[]
        const [targetCardId, targetBasyou] = pairs[0]
        const coins = repeat(CoinFn.battleBonus(bonus))(x)
        ctx = addCoinsToCard(ctx, [targetCardId, targetBasyou], coins) as GameState
        return ctx
      }
    }
    case "移除卡狀態_旗標": {
      const [_, flagName] = action.title
      return function (ctx: GameState, effect: Effect): GameState {
        const cardId = EffectFn.getCardID(effect)
        let cardState = getItemState(ctx, cardId);
        cardState = ItemStateFn.removeFlag(cardState, flagName)
        ctx = setItemState(ctx, cardId, cardState) as GameState
        return ctx
      }
    }
    case "ターン終了時まで「速攻」を得る。": {
      const [_, ges] = action.title
      const varNames = action.vars
      if (varNames == null) {
        throw new Error(`action.var not found: ${action.title[0]}`)
      }
      return function (ctx: GameState, effect: Effect): GameState {
        const cardId = EffectFn.getCardID(effect)
        const cardState = getItemState(ctx, cardId);
        const tip = ItemStateFn.getTip(cardState, varNames[0])
        const tipError = TipFn.checkTipSatisfies(tip)
        if (tipError) {
          throw tipError
        }
        if (tip.title[0] != "カード") {
          throw new Error("must カード")
        }
        const pairs = TipFn.getSelection(tip) as StrBaSyouPair[]
        for (const [targetCardId, targetBaSyou] of pairs) {
          const gesForCard = ges.map(ge => {
            return {
              ...ge,
              cardIds: [targetCardId],
            } as GlobalEffect
          })
          ctx = setItemGlobalEffectsUntilEndOfTurn(ctx, gesForCard, [targetCardId, targetBaSyou])
        }
        return ctx
      }
    }
    case "カード_１枚を引く": {
      const [_, count] = action.title
      return function (ctx: GameState, effect: Effect): GameState {
        const cardId = EffectFn.getCardID(effect)
        const cardController = getItemController(ctx, cardId)
        const fromBasyou = AbsoluteBaSyouFn.of(cardController, "Gゾーン")
        const pairs = getItemIdsByBasyou(ctx, fromBasyou).slice(0, count).map(cardId => {
          return [cardId, fromBasyou] as StrBaSyouPair
        })
        for (const pair of pairs) {
          ctx = moveItem(ctx, AbsoluteBaSyouFn.of(cardController, "手札"), pair, onMoveItem) as GameState
        }
        return ctx
      }
    }
    case "リロール状態で置き換える":
      return function (ctx: GameState, effect: Effect): GameState {
        return ctx
      }
  }
}

export function getOnEventTitleFn(text: CardText): OnEventFn {
  if (text.onEvent == null || typeof text.onEvent == "string") {
    return CardTextFn.getOnEventFn(text)
  }
  switch (text.onEvent[0]) {
    case "GameEventOnTimingDoAction": {
      const [_, timing, action] = text.onEvent;
      return function (ctx: GameState, effect: Effect): GameState {
        const event = EffectFn.getEvent(effect)
        if (event.title[0] == "GameEventOnTiming" && PhaseFn.eq(event.title[1], timing)) {
          return getActionTitleFn(action)(ctx, effect, null)
        }
        return ctx
      }
    }
  }
}


export function makeItemDamage(ctx: GameState, damage: number, target: StrBaSyouPair): GameState {
  const [targetItemId, targetOriginBasyou] = target
  if (isCard(ctx, targetItemId) || isChip(ctx, targetItemId)) {
    const nowBasyou = getItemBaSyou(ctx, targetItemId)
    if (AbsoluteBaSyouFn.eq(targetOriginBasyou, nowBasyou)) {
      throw new TargetMissingError("basyou not same")
    }
    let cardState = getItemState(ctx, targetItemId);
    cardState = ItemStateFn.damage(cardState, damage)
    ctx = setItemState(ctx, targetItemId, cardState) as GameState
    return ctx
  }
  throw new Error(`makeItemDamage unknown item: ${targetItemId}`)
}

export function setItemGlobalEffectsUntilEndOfTurn(ctx: GameState, egs: GlobalEffect[], [itemId, originBasyou]: StrBaSyouPair): GameState {
  if (isCard(ctx, itemId) || isChip(ctx, itemId)) {
    const nowBasyou = getItemBaSyou(ctx, itemId)
    if (AbsoluteBaSyouFn.eq(nowBasyou, originBasyou) == false) {
      throw new TargetMissingError(`target missing: ${itemId} from ${originBasyou}`)
    }
    let cs = getItemState(ctx, itemId)
    for (const eg of egs) {
      cs = ItemStateFn.setGlobalEffect(cs, ToolFn.getUUID("setItemGlobalEffectsUntilEndOfTurn"), true, eg)
    }
    ctx = setItemState(ctx, itemId, cs) as GameState
    return ctx
  }
  if (isCoin(ctx, itemId)) {
    throw new Error(`coin can not setItemGlobalEffectsUntilEndOfTurn: ${itemId}`)
  }
  throw new Error(`setItemGlobalEffectsUntilEndOfTurn unknown item: ${itemId}`)
}

export function onMoveItem(ctx: GameState, to: AbsoluteBaSyou, [cardId, from]: StrBaSyouPair): GameState {
  ctx = clearGlobalEffects(ctx)
  if (AbsoluteBaSyouFn.getBaSyouKeyword(from) == "手札") {
    ctx = triggerEvent(ctx, {
      title: ["プレイされて場に出た場合"],
      cardIds: [cardId]
    } as GameEvent)
    if (AbsoluteBaSyouFn.getBaSyouKeyword(to) == "プレイされているカード") {
      ctx = triggerEvent(ctx, {
        title: ["プレイした場合"],
        cardIds: [cardId]
      } as GameEvent)
    }
  }
  if (BaSyouKeywordFn.isBa(AbsoluteBaSyouFn.getBaSyouKeyword(from)) == false && BaSyouKeywordFn.isBa(AbsoluteBaSyouFn.getBaSyouKeyword(to))) {
    ctx = triggerEvent(ctx, {
      title: ["場に出た場合"],
      cardIds: [cardId]
    } as GameEvent)
  }
  if ((["ジャンクヤード", "捨て山", "本国"] as BaSyouKeyword[]).includes(AbsoluteBaSyouFn.getBaSyouKeyword(to))) {
    let card = getCard(ctx, cardId)
    card = {
      ...card,
      isRoll: false,
      isFaceDown: true,
    }
    ctx = setCard(ctx, cardId, card) as GameState
  } else if ((["Gゾーン", "ハンガー", "プレイされているカード", "取り除かれたカード"] as BaSyouKeyword[]).includes(AbsoluteBaSyouFn.getBaSyouKeyword(to))) {
    let card = getCard(ctx, cardId)
    card = {
      ...card,
      isFaceDown: false,
    }
    ctx = setCard(ctx, cardId, card) as GameState
  }
  return ctx
}