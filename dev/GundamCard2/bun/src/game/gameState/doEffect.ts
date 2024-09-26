
import { logCategory } from "../../tool/logger"
import { createBridge } from "../bridge/createBridge"
import { AbsoluteBaSyouFn } from "../define/BaSyou"
import { CardTextFn, ConditionFn, LogicTreeActionFn } from "../define/CardText"
import { TipOrErrors, CommandEffectTip } from "../define/CommandEffectTip"
import { Effect, EffectFn } from "../define/Effect"
import { TipError, TargetMissingError } from "../define/GameError"
import { GlobalEffect } from "../define/GlobalEffect"
import { ItemStateFn } from "../define/ItemState"
import { TipFn, TipTitleTextRef, StrBaSyouPair } from "../define/Tip"
import { EventCenterFn } from "./EventCenter"
import { GameState } from "./GameState"
import { getActionTitleFn } from "./getActionTitleFn"
import { getConditionTitleFn } from "./getConditionTitleFn"
import { getItemState, mapItemState, setItemState } from "./ItemStateComponent"
import { isCard, isChip, getItemBaSyou, isCoin } from "./ItemTableComponent"

export function doEffect(
  ctx: GameState,
  effect: Effect,
  logicId: number,
  logicSubId: number,
): GameState {
  logCategory("doEffect", effect.text.description)
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
    logCategory("doEffect", "conditionKey", conditionKey)
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

export function createEffectTips(
  ctx: GameState,
  effect: Effect,
  logicId: number,
  logicSubId: number,
  options?: { isCheckUserSelection?: boolean, isAssert?: boolean }
): TipOrErrors[] {
  const ltacs = CardTextFn.getLogicTreeActionConditions(effect.text, CardTextFn.getLogicTreeAction(effect.text, logicId))[logicSubId]
  if (ltacs == null) {
    throw new Error(`ltasc not found: ${logicId}/${logicSubId}`)
  }
  const bridge = createBridge()
  return Object.keys(ltacs).map(key => {
    const con = ltacs[key]
    logCategory("createEffectTips", key, con.title)
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
          if (e instanceof TipError) {
            if (options.isAssert) {
              throw e
            }
            errors.push(e.message)
          } else {
            throw e
          }
        }
      }
      try {
        logCategory("createEffectTips", "tip", tip)
        const error = TipFn.checkTipSatisfies(tip)
        if (error) {
          throw error
        }
        const cardId = EffectFn.getCardID(effect)
        ctx = mapItemState(ctx, cardId, is => ItemStateFn.setTip(is, key, tip)) as GameState
      } catch (e) {
        if (e instanceof TipError) {
          if (options?.isAssert) {
            throw e
          }
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
        if (e instanceof TipError) {
          if (options?.isAssert) {
            throw e
          }
          errors.push(e.message)
          return ctx
        } else {
          throw e
        }
      }
    }, ctx)
    return { effect: effect, conditionKey: key, tip: tip, errors: errors }
  })
}

export function setEffectTips(ctx: GameState, e: Effect, toes: TipOrErrors[]): GameState {
  logCategory("setEffectTips", "effect", e.description)
  switch (e.reason[0]) {
    case "Event":
    case "GameRule":
    case "Destroy":
    case "場に出る":
    case "PlayCard":
    case "PlayText": {
      const cardId = EffectFn.getCardID(e)
      logCategory("setEffectTips", "cardId", cardId)
      toes.forEach(toe => {
        if (toe.errors.length) {
          return
        }
        const tip = toe.tip
        if (tip == null) {
          return
        }
        const key = toe.conditionKey
        logCategory("setEffectTips", key, tip.title)
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
  createEffectTips(ctx, effect, logicId, logicSubId, { isCheckUserSelection: true, isAssert: true })
  // const ltacs = CardTextFn.getLogicTreeActionConditions(effect.text, CardTextFn.getLogicTreeAction(effect.text, logicId))[logicSubId]
  // if (ltacs == null) {
  //   throw new Error(`ltasc not found: ${logicId}/${logicSubId}`)
  // }
  // const bridge = createBridge()
  // switch (effect.reason[0]) {
  //   case "GameRule":
  //   case "PlayCard":
  //   case "PlayText":
  //     log("assertEffectCanPass", effect.reason[0])
  //     Object.keys(ltacs).forEach(key => {
  //       log("assertEffectCanPass", "conditionKey", key)
  //       const con = ltacs[key]
  //       const tip = getConditionTitleFn(con, {})(ctx, effect, bridge)
  //       // 可選對象滿足
  //       if (tip) {
  //         TipFn.checkTipSatisfies(tip)
  //         // 玩家是否已選擇
  //         const selection = ItemStateFn.getTip(getItemState(ctx, EffectFn.getCardID(effect)), key)
  //         log("assertEffectCanPass", "selection", selection)
  //         log("assertEffectCanPass", "cardId", EffectFn.getCardID(effect))
  //         log("assertEffectCanPass", "itemState", getItemState(ctx, EffectFn.getCardID(effect)).tips)
  //       }
  //       ConditionFn.getActionTitleFns(con, getActionTitleFn).reduce((ctx, fn) => {
  //         log("assertEffectCanPass", "doActionTitle")
  //         return fn(ctx, effect, bridge)
  //       }, ctx)
  //     })
  // }
}

export function createCommandEffectTips(ctx: GameState, effect: Effect): CommandEffectTip[] {
  if (effect.text.logicTreeActions) {
    logCategory("createCommandEffectTips", effect.text.logicTreeActions.length)
    const testedEffects = effect.text.logicTreeActions.flatMap((lta, logicId) => {
      const conditionsList = CardTextFn.getLogicTreeActionConditions(effect.text, lta)
      const allTest = conditionsList.map((conditions, logicSubId) => {
        logCategory("createCommandEffectTips", "createEffectTips", logicId, logicSubId, Object.keys(conditions))
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