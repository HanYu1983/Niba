
import { logCategory } from "../../tool/logger"
import { createBridge } from "../bridge/createBridge"
import { AbsoluteBaSyouFn } from "../define/BaSyou"
import { BattleBonus, CardTextFn, Condition, ConditionFn, LogicTreeAction, LogicTreeActionFn } from "../define/CardText"
import { TipOrErrors, CommandEffectTip, TipOrErrorsFn, CommandEffecTipFn } from "../define/CommandEffectTip"
import { Effect, EffectFn, EffectReason } from "../define/Effect"
import { TipError, TargetMissingError } from "../define/GameError"
import { GlobalEffect } from "../define/GlobalEffect"
import { ItemStateFn } from "../define/ItemState"
import { TipFn, TipTitleTextRef, StrBaSyouPair, Tip } from "../define/Tip"
import { EventCenterFn } from "./EventCenter"
import { GameState } from "./GameState"
import { createActionTitleFn } from "./createActionTitleFn"
import { createConditionTitleFn } from "./createConditionTitleFn"
import { getItemState, mapItemState, setItemState } from "./ItemStateComponent"
import { addImmediateEffect } from "./EffectStackComponent"
import { getItemController } from "./ItemTableComponent"

export function doEffect(
  ctx: GameState,
  effect: Effect,
  logicId: number,
  logicSubId: number,
): GameState {
  logCategory("doEffect", effect.id, effect.text.id, effect.text.description)
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
    const actions = ConditionFn.getActions(condition)
    for (const action of actions) {
      EventCenterFn.onActionStart(ctx, effect, action)
      const actionFn = createActionTitleFn(action)
      ctx = actionFn(ctx, effect, bridge)
      EventCenterFn.onActionEnd(ctx, effect, action)
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
  for (const action of LogicTreeActionFn.getActions(lta)) {
    EventCenterFn.onActionStart(ctx, effect, action)
    const actionFn = createActionTitleFn(action)
    ctx = actionFn(ctx, effect, bridge)
    EventCenterFn.onActionEnd(ctx, effect, action)
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

export function assertTipForUserSelection(ctx: GameState, effect: Effect, cardId: string) {
  const userTips = getItemState(ctx, cardId).tips
  const groupSets: { [key: string]: string[] } = {}
  Object.entries(effect.text.conditions || {}).forEach(([conditionKey, con]) => {
    if (con.groupKey) {
      const userTip = userTips[conditionKey]
      if (userTip == null) {
        return
      }
      if (userTip.isRepeat) {
        return
      }
      switch (userTip.title[0]) {
        case "カード": {
          const userCardIds = userTip.title[2].map(p => p[0]);
          let groupSetsWithKey = groupSets[con.groupKey] || []
          groupSetsWithKey = [...userCardIds, ...groupSetsWithKey];
          groupSetsWithKey.forEach(gid => {
            if (groupSetsWithKey.filter(gid2 => gid2 == gid).length > 1) {
              console.warn(con.groupKey, groupSetsWithKey)
              throw new TipError(`有重復的對象: ${con.groupKey} ${JSON.stringify(groupSetsWithKey)}`)
            }
          })
          groupSets[con.groupKey] = groupSetsWithKey
        }
      }
    }
  })
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
    const errors: string[] = []
    let tip: Tip | null = null
    try {
      tip = createConditionTitleFn(con)(ctx, effect, bridge)
      if ((tip as any)?.isGameState) {
        console.log(`快速檢查是不寫錯回傳成GameState, 應該要回傳Tip|null:`, key, con.title)
        throw new Error()
      }
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
    if (tip) {
      // 一開始找可用指令時不需要包含[對象有沒有被使用者選擇]
      // 等到確定要用這個指令時, 再用這個選項來找出[哪一個對象還沒有被使用者選擇]
      if (options?.isCheckUserSelection) {
        try {
          const cardId = EffectFn.getCardID(effect)
          ItemStateFn.getTip(getItemState(ctx, cardId), key)
          assertTipForUserSelection(ctx, effect, cardId)
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
        logCategory("createEffectTips", "tip")
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
    ctx = ConditionFn.getActionTitleFns(con, createActionTitleFn).reduce((ctx, fn): GameState => {
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
    return { effectId: effect.id, conditionKey: key, tip: tip, errors: errors }
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
          throw new Error(toe.errors.join("|"))
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
  Object.keys(ltacs).forEach(key => {
    const cardId = EffectFn.getCardID(effect)
    if (getItemState(ctx, cardId).tips[key]) {
      ctx = mapItemState(ctx, cardId, is => ItemStateFn.clearTip(is, key)) as GameState
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
}

export function createCommandEffectTips(ctx: GameState, effect: Effect): CommandEffectTip[] {
  logCategory("createCommandEffectTips", "effect.id", effect.id)
  logCategory("createCommandEffectTips", "effect.text.id", effect.text.id, effect.description)
  if (effect.text.logicTreeActions) {
    const testedEffects = effect.text.logicTreeActions.flatMap((lta, logicId) => {
      const conditionsList = CardTextFn.getLogicTreeActionConditions(effect.text, lta)
      const allTest = conditionsList.map((conditions, logicSubId) => {
        // 先將之前選的對象刪除，避免拿到舊值
        ctx = clearTipSelectionForUser(ctx, effect, logicId, logicSubId)
        //logCategory("createCommandEffectTips", "createEffectTips", logicId, logicSubId, Object.keys(conditions))
        const conTipErrors = createEffectTips(ctx, effect, logicId, logicSubId)
        return {
          effectId: effect.id,
          conditionKeys: Object.keys(conditions),
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

export function getCardTipSelection(ctx: GameState, varName: string, cardId: string) {
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
    case "BattleBonus":
    case "GlobalEffects":
      return TipFn.getSelection(tip)
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

export function getCardTipBattleBonus(ctx: GameState, varName: string, cardId: string): BattleBonus[] {
  return getCardTipSelection(ctx, varName, cardId) as BattleBonus[]
}

export function getCardTipStrings(ctx: GameState, varName: string, cardId: string): string[] {
  return getCardTipSelection(ctx, varName, cardId) as string[]
}

export function createPlayTextEffectFromEffect(ctx: GameState, e: Effect, options?: { conditions?: { [key: string]: Condition }, logicTreeAction?: LogicTreeAction, isOption?: boolean }): Effect {
  const cardId = EffectFn.getCardID(e)
  const cardController = getItemController(ctx, cardId)
  return EffectFn.fromEffectBasic(e, { ...options, reason: ["PlayText", cardController, cardId, e.text.id] })
}

export function addImmediateEffectIfCanPayCost(ctx: GameState, effect: Effect): GameState {
  const cets = createCommandEffectTips(ctx, effect)
  const cetsNoErr = cets.filter(CommandEffecTipFn.filterNoError)
  if (cetsNoErr.length == 0) {
    console.warn("addImmediateEffectIfCanPayCost", `將發動起動效果但條件不足: ${effect.text.description}`, cets)
    return ctx
  }
  return addImmediateEffect(ctx, effect) as GameState
}