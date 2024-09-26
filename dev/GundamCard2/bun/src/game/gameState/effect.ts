import { pipe, always, map, flatten, reduce, repeat, lift, cond, pair } from "ramda"
import { createBridge } from "../bridge/createBridge"
import { AbsoluteBaSyouFn, AbsoluteBaSyou, BaSyouKeywordFn, BaSyouKeyword } from "../define/BaSyou"
import { CardTextFn, ConditionFn, LogicTreeActionFn, Condition, ConditionTitleFn, Action, ActionTitleFn, ActionFn, CardText, OnEventFn } from "../define/CardText"
import { CoinFn } from "../define/Coin"
import { Effect, DestroyReason, EffectFn } from "../define/Effect"
import { GameError, TargetMissingError } from "../define/GameError"
import { GameEvent } from "../define/GameEvent"
import { ItemStateFn } from "../define/ItemState"
import { PhaseFn } from "../define/Timing"
import { Tip, TipFn, StrBaSyouPair, TipTitleTextRef } from "../define/Tip"
import { getItemCharacteristic, getCardIdsCanPayRollCost, getCardRollCostLength, getItemRuntimeCategory, getCardTexts, getCardBattlePoint, getCardIdsCanPayRollColor } from "./card"
import { getCard, mapCard, setCard } from "./CardTableComponent"
import { GameState } from "./GameState"
import { clearGlobalEffects } from "./globalEffects"
import { getItemStateValues, getItemState, setItemState, mapItemState } from "./ItemStateComponent"
import { getItemController, addCoinsToCard, isCard, isChip, getItemBaSyou, isCoin, getItemPrototype, setItemIsRoll, getItemIdsByBasyou, assertTargetMissingError, getItemIdsByPlayerId } from "./ItemTableComponent"
import { triggerEvent } from "./triggerEvent"
import { Bridge } from "../../script/bridge"
import { GlobalEffect } from "../define/GlobalEffect"
import { ToolFn } from "../tool"
import { addStackEffect } from "./EffectStackComponent"
import { PlayerIDFn } from "../define/PlayerID"
import { CardFn } from "../define/Card"
import { getSetGroupRoot } from "./SetGroupComponent"
import { log } from "../../tool/logger"
import { BattlePointFn } from "../define/BattlePoint"
import { getBattleGroup } from "./battleGroup"
import { getSetGroupBattlePoint } from "./setGroup"
import { isBattle } from "./IsBattleComponent"
import { TipOrErrors, CommandEffectTip } from "../define/CommandEffectTip"
import { EventCenterFn } from "./EventCenter"
import { getActionTitleFn } from "./getActionTitleFn"
import { getConditionTitleFn } from "./getConditionTitleFn"

export function createEffectTips(
  ctx: GameState,
  effect: Effect,
  logicId: number,
  logicSubId: number,
  options?: { isCheckUserSelection?: boolean }
): TipOrErrors[] {
  const ltacs = CardTextFn.getLogicTreeActionConditions(effect.text, CardTextFn.getLogicTreeAction(effect.text, logicId))[logicSubId]
  if (ltacs == null) {
    throw new Error(`ltasc not found: ${logicId}/${logicSubId}`)
  }
  const bridge = createBridge()
  return Object.keys(ltacs).map(key => {
    const con = ltacs[key]
    log("createEffectTips", key, con.title)
    const tip = getConditionTitleFn(con, {})(ctx, effect, bridge)
    const errors: string[] = []
    if (tip) {
      // 一開始找可用指令時不需要包含[對象有沒有被使用者選擇]
      // 等到確定要用這個指令時, 再用這個選項來找出[哪一個對象還沒有被使用者選擇]
      if (options?.isCheckUserSelection) {
        try {
          const cardId = EffectFn.getCardID(effect)
          ItemStateFn.getTip(getItemState(ctx, cardId), key)
        } catch (e) {
          if (e instanceof GameError) {
            errors.push(e.message)
          } else {
            throw e
          }
        }
      }
      try {
        log("createEffectTips", "tip", tip)
        const error = TipFn.checkTipSatisfies(tip)
        if (error) {
          throw error
        }
        const cardId = EffectFn.getCardID(effect)
        ctx = mapItemState(ctx, cardId, is => ItemStateFn.setTip(is, key, tip)) as GameState
      } catch (e) {
        if (e instanceof GameError) {
          errors.push(e.message)
        } else {
          throw e
        }
      }
    }
    ctx = ConditionFn.getActionTitleFns(con, getActionTitleFn).reduce((ctx, fn): GameState => {
      try {
        ctx = fn(ctx, effect, bridge)
        //ctx = clearGlobalEffects(ctx)
        return ctx
      } catch (e) {
        if (e instanceof GameError) {
          errors.push(e.message)
          return ctx
        } else {
          throw e
        }
      }
    }, ctx)
    return { conditionKey: key, tip: tip, errors: errors }
  })
}

export function setEffectTips(ctx: GameState, e: Effect, toes: TipOrErrors[]): GameState {
  log("setEffectTips", "effect", e.description)
  switch (e.reason[0]) {
    case "Event":
    case "GameRule":
    case "Destroy":
    case "場に出る":
    case "PlayCard":
    case "PlayText": {
      const cardId = EffectFn.getCardID(e)
      log("setEffectTips", "cardId", cardId)
      toes.forEach(toe => {
        if (toe.errors.length) {
          return
        }
        const tip = toe.tip
        if (tip == null) {
          return
        }
        const key = toe.conditionKey
        log("setEffectTips", key, tip.title)
        ctx = mapItemState(ctx, cardId, is => ItemStateFn.setTip(is, key, tip)) as GameState
      })
      return ctx
    }
    default:
      throw new Error(`unknown effect reason: ${e.reason[0]}`)
  }
}

export function setTipSelectionForUser(ctx: GameState, e: Effect, logicId: number, logicSubId: number): GameState {
  return setEffectTips(ctx, e, createEffectTips(ctx, e, logicId, logicSubId))
}

export function clearTipSelectionForUser(
  ctx: GameState,
  effect: Effect,
  logicId: number,
  logicSubId: number,
) {
  const ltacs = CardTextFn.getLogicTreeActionConditions(effect.text, CardTextFn.getLogicTreeAction(effect.text, logicId))[logicSubId]
  if (ltacs == null) {
    throw new Error(`ltasc not found: ${logicId}/${logicSubId}`)
  }
  const bridge = createBridge()
  Object.keys(ltacs).forEach(key => {
    const con = ltacs[key]
    const tip = getConditionTitleFn(con, {})(ctx, effect, bridge)
    if (tip) {
      const cardId = EffectFn.getCardID(effect)
      if (getItemState(ctx, cardId).tips[key]) {
        ctx = mapItemState(ctx, cardId, is => ItemStateFn.clearTip(is, key)) as GameState
      }
    }
  })
  return ctx
}

export function assertEffectCanPass(
  ctx: GameState,
  effect: Effect,
  logicId: number,
  logicSubId: number,
) {
  const ltacs = CardTextFn.getLogicTreeActionConditions(effect.text, CardTextFn.getLogicTreeAction(effect.text, logicId))[logicSubId]
  if (ltacs == null) {
    throw new Error(`ltasc not found: ${logicId}/${logicSubId}`)
  }
  const bridge = createBridge()
  switch (effect.reason[0]) {
    case "GameRule":
    case "PlayCard":
    case "PlayText":
      log("assertEffectCanPass", effect.reason[0])
      Object.keys(ltacs).forEach(key => {
        log("assertEffectCanPass", "conditionKey", key)
        const con = ltacs[key]
        const tip = getConditionTitleFn(con, {})(ctx, effect, bridge)
        // 可選對象滿足
        if (tip) {
          TipFn.checkTipSatisfies(tip)
          // 玩家是否已選擇
          const selection = ItemStateFn.getTip(getItemState(ctx, EffectFn.getCardID(effect)), key)
          log("assertEffectCanPass", "selection", selection)
          log("assertEffectCanPass", "cardId", EffectFn.getCardID(effect))
          log("assertEffectCanPass", "itemState", getItemState(ctx, EffectFn.getCardID(effect)).tips)
        }
        ConditionFn.getActionTitleFns(con, getActionTitleFn).reduce((ctx, fn) => {
          log("assertEffectCanPass", "doActionTitle")
          return fn(ctx, effect, bridge)
        }, ctx)
      })
  }
}

export function createCommandEffectTips(ctx: GameState, effect: Effect): CommandEffectTip[] {
  if (effect.text.logicTreeActions) {
    const testedEffects = effect.text.logicTreeActions.flatMap((lta, logicId) => {
      const allTree = CardTextFn.getLogicTreeActionConditions(effect.text, lta)
      const allTest = allTree.map((conditions, logicSubId) => {
        const conTipErrors = createEffectTips(ctx, effect, logicId, logicSubId)
        return {
          effect: effect,
          logicID: logicId,
          logicSubID: logicSubId,
          tipOrErrors: conTipErrors
        } as CommandEffectTip
      })
      return allTest
    })
    return testedEffects
  }
  return []
}


export function doEffect(
  ctx: GameState,
  effect: Effect,
  logicId: number,
  logicSubId: number,
): GameState {
  log("doEffect", effect.text.description)
  ctx = EventCenterFn.onEffectStart(ctx, effect)
  assertEffectCanPass(ctx, effect, logicId, logicSubId)
  const ltacs = CardTextFn.getLogicTreeActionConditions(effect.text, CardTextFn.getLogicTreeAction(effect.text, logicId))[logicSubId]
  if (ltacs == null) {
    throw new Error(`ltasc not found: ${logicId}/${logicSubId}`)
  }
  const bridge = createBridge()
  const conditionIds = Object.keys(ltacs)
  const cardId = EffectFn.getCardID(effect)
  conditionIds.forEach(conditionKey => {
    log("doEffect", "conditionKey", conditionKey)
    const condition = CardTextFn.getCondition(effect.text, conditionKey)
    const actionFns = ConditionFn.getActionTitleFns(condition, getActionTitleFn)
    for (const actionFn of actionFns) {
      ctx = actionFn(ctx, effect, bridge)
      //ctx = clearGlobalEffects(ctx)
    }
    // if (condition.actions) {
    //   for (const action of condition.actions) {
    //     if (action.vars) {
    //       for (const name of action.vars) {
    //         log("doEffect", "clearTip", name)
    //         ctx = mapItemState(ctx, cardId, is => ItemStateFn.clearTip(is, name)) as GameState
    //       }
    //     }
    //   }
    // }
  })
  const lta = CardTextFn.getLogicTreeAction(effect.text, logicId)
  for (const actionFn of LogicTreeActionFn.getActionTitleFns(lta, getActionTitleFn)) {
    ctx = actionFn(ctx, effect, bridge)
    //ctx = clearGlobalEffects(ctx)
  }
  // for (const action of lta.actions) {
  //   if (action.vars) {
  //     for (const name of action.vars) {
  //       log("doEffect", "clearTip", name)
  //       ctx = mapItemState(ctx, cardId, is => ItemStateFn.clearTip(is, name)) as GameState
  //     }
  //   }
  // }
  ctx = EventCenterFn.onEffectEnd(ctx, effect)
  return ctx;
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
      cs = ItemStateFn.setGlobalEffect(cs, null, eg, { isRemoveOnTurnEnd: true })
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
    if (AbsoluteBaSyouFn.getBaSyouKeyword(to) == "プレイされているカード") {
      ctx = triggerEvent(ctx, {
        title: ["プレイした場合"],
        cardIds: [cardId]
      } as GameEvent)
    }
  }
  // 從非場所到場所=出場
  if (BaSyouKeywordFn.isBa(AbsoluteBaSyouFn.getBaSyouKeyword(from)) == false && BaSyouKeywordFn.isBa(AbsoluteBaSyouFn.getBaSyouKeyword(to))) {
    // 剛出場的回合
    ctx = mapItemState(ctx, cardId, is => {
      return {
        ...is,
        isFirstTurn: true
      }
    }) as GameState
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
  ctx = triggerEvent(ctx, {
    title: ["GameEventOnMove", from, to],
    cardIds: [cardId]
  })
  return ctx
}

function getCardTipSelection(ctx: GameState, varName: string, cardId: string) {
  const cardState = getItemState(ctx, cardId);
  const tip = ItemStateFn.getTip(cardState, varName)
  const tipError = TipFn.checkTipSatisfies(tip)
  if (tipError) {
    throw tipError
  }
  switch (tip.title[0]) {
    case "カード":
    case "テキスト":
    case "StringOptions":
      return TipFn.getSelection(tip)
    default:
      throw new Error(`unknown tip title: ${tip.title[0]}`)
  }
}

export function getCardTipTextRefs(ctx: GameState, varName: string, cardId: string): TipTitleTextRef[] {
  return getCardTipSelection(ctx, varName, cardId) as TipTitleTextRef[]
}

export function setCardTipTextRefs(ctx: GameState, varName: string, pairs: TipTitleTextRef[], cardId: string): GameState {
  let cs = getItemState(ctx, cardId)
  cs = ItemStateFn.setTip(cs, varName, { title: ["テキスト", [], pairs] })
  ctx = setItemState(ctx, cardId, cs) as GameState
  return ctx
}

export function getCardTipStrBaSyouPairs(ctx: GameState, varName: string, cardId: string): StrBaSyouPair[] {
  return getCardTipSelection(ctx, varName, cardId) as StrBaSyouPair[]
}

export function setCardTipStrBaSyouPairs(ctx: GameState, varName: string, pairs: StrBaSyouPair[], cardId: string): GameState {
  let cs = getItemState(ctx, cardId)
  cs = ItemStateFn.setTip(cs, varName, { title: ["カード", [], pairs] })
  ctx = setItemState(ctx, cardId, cs) as GameState
  return ctx
}

