import { pipe, always, map, flatten, reduce, repeat, lift, cond, pair } from "ramda"
import { createBridge } from "../bridge/createBridge"
import { AbsoluteBaSyouFn, AbsoluteBaSyou, BaSyouKeywordFn, BaSyouKeyword } from "../define/BaSyou"
import { CardTextFn, ConditionFn, LogicTreeActionFn, Condition, ConditionTitleFn, Action, ActionTitleFn, ActionFn, CardText, OnEventFn } from "../define/CardText"
import { CoinFn } from "../define/Coin"
import { Effect, DestroyReason, EffectFn } from "../define/Effect"
import { TargetMissingError } from "../define/GameError"
import { GameEvent } from "../define/GameEvent"
import { ItemStateFn } from "../define/ItemState"
import { PhaseFn } from "../define/Timing"
import { Tip, TipFn, StrBaSyouPair, TipTitleTextRef } from "../define/Tip"
import { getItemCharacteristic, getCardIdsCanPayRollCost, getCardRollCostLength, getItemRuntimeCategory, getCardTexts, getCardBattlePoint, getCardIdsCanPayRollColor } from "./card"
import { getCard, setCard } from "./CardTableComponent"
import { GameState } from "./GameState"
import { clearGlobalEffects } from "./globalEffects"
import { getItemStateValues, getItemState, setItemState, mapItemState } from "./ItemStateComponent"
import { getItemController, addCoinsToCard, isCard, isChip, getItemBaSyou, isCoin, getItemPrototype, getItemIdsByBasyou, moveItem, setItemIsRoll, getCardLikeItemIdsByBasyou, assertTargetMissingError } from "./ItemTableComponent"
import { triggerEvent } from "./triggerEvent"
import { Bridge } from "../../script/bridge"
import { GlobalEffect } from "../define/GlobalEffect"
import { ToolFn } from "../tool"
import { addStackEffect } from "./EffectStackComponent"
import { PlayerIDFn } from "../define/PlayerID"
import { CommandEffectTip, TipOrErrors } from "../gameStateWithFlowMemory/GameStateWithFlowMemory"
import { CardFn } from "../define/Card"
import { getSetGroupRoot } from "./SetGroupComponent"
import { log } from "../../tool/logger"
import { BattlePointFn } from "../define/BattlePoint"
import { getBattleGroup } from "./battleGroup"
import { getSetGroupBattlePoint } from "./setGroup"

export function getEffectTips(
  ctx: GameState,
  effect: Effect,
  logicId: number,
  logicSubId: number,
): TipOrErrors[] {
  const ltacs = CardTextFn.getLogicTreeActionConditions(effect.text, CardTextFn.getLogicTreeAction(effect.text, logicId))[logicSubId]
  if (ltacs == null) {
    throw new Error(`ltasc not found: ${logicId}/${logicSubId}`)
  }
  const bridge = createBridge()
  return Object.keys(ltacs).map(key => {
    const con = ltacs[key]
    const tip = getConditionTitleFn(con, {})(ctx, effect, bridge)
    if (tip) {
      const cardId = EffectFn.getCardID(effect)
      ctx = mapItemState(ctx, cardId, is => ItemStateFn.setTip(is, key, tip)) as GameState
    }
    const errors: TargetMissingError[] = []
    ctx = ConditionFn.getActionTitleFns(con, getActionTitleFn).reduce((ctx, fn): GameState => {
      try {
        return fn(ctx, effect, bridge)
      } catch (e) {
        if (e instanceof TargetMissingError) {
          errors.push(e)
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
  switch (e.reason[0]) {
    case "GameRule":
    case "Destroy":
    case "場に出る":
    case "PlayCard":
    case "PlayText": {
      const cardId = EffectFn.getCardID(e)
      toes.forEach(toe => {
        if (toe.errors.length) {
          return
        }
        const tip = toe.tip
        if (tip == null) {
          return
        }
        const key = toe.conditionKey
        ctx = mapItemState(ctx, cardId, is => ItemStateFn.setTip(is, key, tip)) as GameState
      })
      return ctx
    }
    default:
      throw new Error(`unknown effect reason: ${e.reason[0]}`)
  }
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
      Object.keys(ltacs).forEach(key => {
        const con = ltacs[key]
        const tip = getConditionTitleFn(con, {})(ctx, effect, bridge)
        // 可選對象滿足
        if (tip) {
          TipFn.checkTipSatisfies(tip)
          // 玩家是否已選擇
          ItemStateFn.getTip(getItemState(ctx, EffectFn.getCardID(effect)), key)
        }
        ConditionFn.getActionTitleFns(con, getActionTitleFn).reduce((ctx, fn) => fn(ctx, effect, bridge), ctx)
      })
  }
}

export function getCommandEffectTips(ctx: GameState, effect: Effect): CommandEffectTip[] {
  if (effect.text.logicTreeActions) {
    const testedEffects = effect.text.logicTreeActions.flatMap((lta, logicId) => {
      const allTree = CardTextFn.getLogicTreeActionConditions(effect.text, lta)
      const allTest = allTree.map((conditions, logicSubId) => {
        const conTipErrors = getEffectTips(ctx, effect, logicId, logicSubId)
        return {
          id: ToolFn.getUUID("getCommandEffectTips"),
          effect: effect,
          logicID: logicId,
          logicSubID: logicSubId,
          tipOrErrors: conTipErrors
        }
      })
      return allTest
    })
    return testedEffects
  }
  return []
}

export function setTipSelectionForUser(ctx: GameState, e: Effect, logicId: number, logicSubId: number): GameState {
  return setEffectTips(ctx, e, getEffectTips(ctx, e, logicId, logicSubId))
}

export function doEffect(
  ctx: GameState,
  effect: Effect,
  logicId: number,
  logicSubId: number,
): GameState {
  assertEffectCanPass(ctx, effect, logicId, logicSubId)
  const ltacs = CardTextFn.getLogicTreeActionConditions(effect.text, CardTextFn.getLogicTreeAction(effect.text, logicId))[logicSubId]
  if (ltacs == null) {
    throw new Error(`ltasc not found: ${logicId}/${logicSubId}`)
  }
  const bridge = createBridge()
  const conditionIds = Object.keys(ltacs)
  const conditions = conditionIds.map(id => CardTextFn.getCondition(effect.text, id))
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
      return ctx
    }, ctx)
  )
  ctx = processCondition(ctx)()
  ctx = processLogicAction(ctx)()
  ctx = clearGlobalEffects(ctx)
  return ctx;
}

export function getConditionTitleFn(condition: Condition, options: { isPlay?: boolean }): ConditionTitleFn {
  if (condition.title == null || typeof condition.title == "string") {
    return ConditionFn.getTitleFn(condition)
  }
  log("getConditionTitleFn", condition.title)
  switch (condition.title[0]) {
    case "このカードの_本来のテキスト１つ": {
      const [_, isOrigin, count] = condition.title
      return function (ctx: GameState, effect: Effect): Tip | null {
        const cardId = EffectFn.getCardID(effect)
        const texts = isOrigin ?
          (getItemPrototype(ctx, cardId).texts || []) :
          getCardTexts(ctx, cardId)
        const textRefs: TipTitleTextRef[] = texts.filter(text => (text.title[0] == "特殊型" && text.title[1][0] == "クロスウェポン") == false).map(text => {
          return {
            cardId: cardId,
            textId: text.id
          }
        })
        log(`getConditionTitleFn`, textRefs)
        return {
          title: ["テキスト", textRefs, textRefs.slice(0, count)],
          count: count,
        }
      }
    }
    case "_本来の記述に｢特徴：_装弾｣を持つ_自軍_G_１枚": {
      const [_, isOrigin, targetChar, side, category, count] = condition.title
      const exceptItemSelf = condition.exceptItemSelf
      return function (ctx: GameState, effect: Effect): Tip | null {
        const fromCardId = EffectFn.getCardID(effect)
        const playerId = getItemController(ctx, fromCardId);
        const targetPlayerId = side == "自軍" ? playerId : PlayerIDFn.getOpponent(playerId)
        if (category == "グラフィック") {
          const basyous: AbsoluteBaSyou[] = [AbsoluteBaSyouFn.of(targetPlayerId, "Gゾーン")]
          const pairs = basyous.flatMap(basyou =>
            getCardLikeItemIdsByBasyou(ctx, basyou)
              .filter(cardId => {
                if (exceptItemSelf && fromCardId == cardId) {
                  return false
                }
                if (getCard(ctx, cardId).isRoll) {
                  return false
                }
                if (isOrigin) {
                  return getItemPrototype(ctx, cardId).characteristic?.includes(targetChar)
                } else {
                  return getItemCharacteristic(ctx, cardId)
                }
              })
              .map(cardId => [cardId, basyou] as StrBaSyouPair)
          )
          return {
            title: ["カード", pairs, pairs.slice(0, count)],
            count: count,
          }

        } else {
          const basyous: AbsoluteBaSyou[] = (lift(AbsoluteBaSyouFn.of)([targetPlayerId], BaSyouKeywordFn.getBaAll()))
          const pairs = basyous.flatMap(basyou =>
            getCardLikeItemIdsByBasyou(ctx, basyou)
              .filter(cardId => getSetGroupRoot(ctx, cardId))
              .filter(cardId => getItemRuntimeCategory(ctx, cardId) == category)
              .filter(cardId => {
                if (exceptItemSelf && fromCardId == cardId) {
                  return false
                }
                if (isOrigin) {
                  return getItemPrototype(ctx, cardId).characteristic?.includes(targetChar)
                } else {
                  return getItemCharacteristic(ctx, cardId).includes(targetChar)
                }
              })
              .map(cardId => [cardId, basyou] as StrBaSyouPair)
          )
          return {
            title: ["カード", pairs, pairs.slice(0, count)],
            count: count,
          }

        }
      }
    }
    case "_戦闘エリアにいる_敵軍_ユニット_１～_２枚": {
      const [_, basyouKws, side, category, min, max] = condition.title
      return function (ctx: GameState, effect: Effect): Tip | null {
        const cardId = EffectFn.getCardID(effect)
        const playerId = getItemController(ctx, cardId);
        const targetPlayerId = side == "自軍" ? playerId : PlayerIDFn.getOpponent(playerId)
        const basyous: AbsoluteBaSyou[] = (lift(AbsoluteBaSyouFn.of)([targetPlayerId], basyouKws))
        const pairs = basyous.flatMap(basyou =>
          getCardLikeItemIdsByBasyou(ctx, basyou)
            .filter(cardId => getItemRuntimeCategory(ctx, cardId) == category)
            .map(cardId => [cardId, basyou] as StrBaSyouPair)
        )
        return {
          title: ["カード", pairs, pairs.slice(0, max)],
          min: min,
          max: max,
        }

      }
    }
    case "_自軍_ユニット_１枚": {
      const [_, side, category, count] = condition.title
      return function (ctx: GameState, effect: Effect): Tip | null {
        const cardId = EffectFn.getCardID(effect)
        const playerId = getItemController(ctx, cardId);
        const targetPlayerId = side == "自軍" ? playerId : PlayerIDFn.getOpponent(playerId)
        const basyous: AbsoluteBaSyou[] = (lift(AbsoluteBaSyouFn.of)([targetPlayerId], BaSyouKeywordFn.getBaAll()))
        const pairs = basyous.flatMap(basyou =>
          getCardLikeItemIdsByBasyou(ctx, basyou)
            .filter(cardId => getItemRuntimeCategory(ctx, cardId) == category)
            .map(cardId => [cardId, basyou] as StrBaSyouPair)
        )
        return {
          title: ["カード", pairs, pairs.slice(0, count)],
          count: 1,
        }

      }
    }
    case "_自軍手札、または自軍ハンガーにある、_６以下の合計国力を持つ_ユニット_１枚を": {
      const [_, side, totalCost, category, count] = condition.title
      return function (ctx: GameState, effect: Effect): Tip | null {
        const cardId = EffectFn.getCardID(effect)
        const playerId = getItemController(ctx, cardId);
        const targetPlayerId = side == "自軍" ? playerId : PlayerIDFn.getOpponent(playerId)
        const basyous: AbsoluteBaSyou[] = (lift(AbsoluteBaSyouFn.of)([targetPlayerId], ["手札", "ハンガー"]))
        const pairs = basyous.flatMap(basyou =>
          getCardLikeItemIdsByBasyou(ctx, basyou)
            .filter(cardId => getItemRuntimeCategory(ctx, cardId) == category)
            .filter(cardId => getCardRollCostLength(ctx, cardId) <= totalCost)
            .map(cardId => [cardId, basyou] as StrBaSyouPair)
        )
        return {
          title: ["カード", pairs, pairs.slice(0, count)],
          min: count,
        }
      }
    }
    case "_自軍_本國上的_1張卡": {
      const [_, side, basyouKw, count] = condition.title
      return function (ctx: GameState, effect: Effect): Tip | null {
        const cardId = EffectFn.getCardID(effect)
        const playerId = getItemController(ctx, cardId);
        const targetPlayerId = side == "自軍" ? playerId : PlayerIDFn.getOpponent(playerId)
        const basyous: AbsoluteBaSyou[] = (lift(AbsoluteBaSyouFn.of)([targetPlayerId], [basyouKw]))
        const pairs = basyous.flatMap(basyou =>
          getCardLikeItemIdsByBasyou(ctx, basyou).map(cardId => [cardId, basyou] as StrBaSyouPair)
        )
        return {
          title: ["カード", pairs, pairs.slice(0, count)],
          min: count,
        }

      }
    }
    case "這張卡交戰的防禦力_x以下的敵軍機體_1張": {
      const [_, x, count] = condition.title
      return function (ctx: GameState, effect: Effect): Tip | null {
        const cardId = EffectFn.getCardID(effect)
        if (AbsoluteBaSyouFn.getBaSyouKeyword(getItemBaSyou(ctx, cardId)) == "戦闘エリア1" || AbsoluteBaSyouFn.getBaSyouKeyword(getItemBaSyou(ctx, cardId)) == "戦闘エリア2") {

        } else {
          return null
        }
        const cardController = getItemController(ctx, cardId)
        const opponentId = PlayerIDFn.getOpponent(cardController)
        const from = AbsoluteBaSyouFn.setPlayerID(getItemBaSyou(ctx, cardId), opponentId)
        // TODO 去掉重復
        const targetIds = getCardLikeItemIdsByBasyou(ctx, from)
          .map(itemId => getSetGroupRoot(ctx, itemId))
          .filter(itemId => {
            const [_, def, _2] = getSetGroupBattlePoint(ctx, itemId)
            return def <= x
          })
        const pairs = targetIds.map(itemId => [itemId, from] as StrBaSyouPair)
        return {
          title: ["カード", pairs, pairs.slice(0, count)],
          min: count,
        }
      }
    }
    case "_自軍_本國找出特徵_A的_1張卡": {
      const [_, side, basyouKw, char, count] = condition.title
      return function (ctx: GameState, effect: Effect): Tip | null {
        const cardId = EffectFn.getCardID(effect)
        const playerId = getItemController(ctx, cardId);
        const targetPlayerId = side == "自軍" ? playerId : PlayerIDFn.getOpponent(playerId)
        const from = AbsoluteBaSyouFn.of(targetPlayerId, basyouKw)
        const itemIdAtBasyou = getCardLikeItemIdsByBasyou(ctx, from)
        const targetIds = itemIdAtBasyou.filter(itemId => {
          return getItemCharacteristic(ctx, itemId).indexOf(char) != -1
        })
        const pairs = targetIds.map(targetId => [targetId, from] as StrBaSyouPair)
        return {
          title: ["カード", pairs, pairs.slice(0, count)],
          min: count,
          cheatCardIds: itemIdAtBasyou
        }
      }
    }
    case "RollColor": {
      const [_, color] = condition.title
      return function (ctx: GameState, effect: Effect): Tip | null {
        const cardId = EffectFn.getCardID(effect)
        const cardController = getItemController(ctx, cardId)
        const cardIdColors = getCardIdsCanPayRollColor(ctx, null, cardController, color)
        let colorIds = []
        if (color == "紫") {
          // 單紫優先
          colorIds = cardIdColors.filter(gId => gId.colors.length == 1 && gId.colors[0] == color).map(gId => gId.cardId).slice(0, 1)
          // 若無單紫
          if (colorIds.length == 0) {
            // 非紫需要2張
            colorIds = cardIdColors.filter(gId => gId.colors.length == 1).map(gId => gId.cardId).slice(0, 2)
            // 若非紫小於2張
            if (colorIds.length < 2) {
              // 最下策則用雙色卡支付
              colorIds = cardIdColors.filter(gId => gId.colors.length > 1).map(gId => gId.cardId).slice(0, 2)
            }
          }
        } else {
          // 單色優先
          colorIds = cardIdColors.filter(gId => gId.colors.length == 1 && gId.colors[0] == color).map(gId => gId.cardId).slice(0, 1)
          if (colorIds.length == 0) {
            // 最下策則用雙色卡支付
            colorIds = cardIdColors.filter(gId => gId.colors.length > 1 && gId.colors.includes(color)).map(gId => gId.cardId).slice(0, 1)
          }
        }
        const cardIdColorsPairs = cardIdColors.map(gId => gId.cardId).map(colorId => [colorId, getItemBaSyou(ctx, colorId)] as StrBaSyouPair)
        const pairs = colorIds.map(colorId => [colorId, getItemBaSyou(ctx, colorId)] as StrBaSyouPair)
        return {
          title: ["カード", cardIdColorsPairs, pairs],
          min: 1,
        }
      }
    }
    case "_交戦中の_自軍_ユニット_１枚":
    case "このセットグループの_ユニットは":
      return function (ctx: GameState, effect: Effect): Tip | null {
        return null
      }
  }
}

export function getActionTitleFn(action: Action): ActionTitleFn {
  if (typeof action.title == "string") {
    return ActionFn.getTitleFn(action)
  }
  switch (action.title[0]) {
    case "triggerEvent": {
      const [_, event] = action.title
      return function (ctx: GameState, effect: Effect): GameState {
        ctx = triggerEvent(ctx, { ...event, effect: effect })
        return ctx
      }
    }
    case "cutIn": {
      const [_, actions] = action.title
      return function (ctx: GameState, effect: Effect): GameState {
        const cardId = EffectFn.getCardID(effect)
        ctx = addStackEffect(ctx, {
          id: "",
          description: effect.text.description,
          reason: ["PlayText", EffectFn.getPlayerID(effect), cardId, effect.text.id],
          text: {
            id: effect.text.id,
            description: effect.text.description,
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
      const [_, whatToDo] = action.title
      const varNames = action.vars
      return function (ctx: GameState, effect: Effect): GameState {
        const cardId = EffectFn.getCardID(effect)
        const cardController = getItemController(ctx, cardId)
        const pairs = varNames == null ?
          [[cardId, getItemBaSyou(ctx, cardId)] as StrBaSyouPair] :
          varNames.flatMap(varName => {
            return getCardTipStrBaSyouPairs(ctx, varName, cardId)
          })
        switch (whatToDo) {
          case "ロール": {
            for (const pair of pairs) {
              ctx = setItemIsRoll(ctx, true, pair) as GameState
            }
            return ctx
          }
          case "リロール": {
            for (const pair of pairs) {
              ctx = setItemIsRoll(ctx, false, pair) as GameState
            }
            return ctx
          }
          case "打開": {
            for (const pair of pairs) {
              assertTargetMissingError(ctx, pair)
              ctx = mapItemState(ctx, pair[0], is => ({ ...is, isOpenForGain: true })) as GameState
            }
            return ctx
          }
          case "破壞": {
            for (const pair of pairs) {
              assertTargetMissingError(ctx, pair)
              ctx = mapItemState(ctx, pair[0], is => ({ ...is, destroyReason: { id: "破壊する", playerID: cardController } })) as GameState
            }
            return ctx
          }
        }
      }
    }
    case "看自己_本國全部的卡": {
      const [_, basyouKw] = action.title
      return function (ctx: GameState, effect: Effect): GameState {
        const cardId = EffectFn.getCardID(effect)
        const cardController = getItemController(ctx, cardId)
        for (const itemId of getCardLikeItemIdsByBasyou(ctx, AbsoluteBaSyouFn.of(cardController, basyouKw))) {
          ctx = mapItemState(ctx, itemId, is => ({ ...is, isCheat: true })) as GameState
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
        const targetPairs = getCardTipStrBaSyouPairs(ctx, action.vars[0], cardId)
        ctx = targetPairs.reduce((ctx, pair) => {
          return makeItemDamage(ctx, 1, pair)
        }, ctx)
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
        const pairs = getCardTipStrBaSyouPairs(ctx, varNames[0], cardId)
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
        const pairs = getCardTipStrBaSyouPairs(ctx, varNames[0], cardId)
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
        const fromBasyou = AbsoluteBaSyouFn.of(cardController, "本国")
        const pairs = getCardLikeItemIdsByBasyou(ctx, fromBasyou).slice(0, count).map(cardId => {
          return [cardId, fromBasyou] as StrBaSyouPair
        })
        for (const pair of pairs) {
          ctx = moveItem(ctx, AbsoluteBaSyouFn.of(cardController, "手札"), pair, onMoveItem) as GameState
        }
        return ctx
      }
    }
    case "リロール状態で置き換える":
      const varNames = action.vars
      if (varNames == null) {
        throw new Error(`action.var not found: ${action.title[0]}`)
      }
      return function (ctx: GameState, effect: Effect): GameState {
        const cardId = EffectFn.getCardID(effect)
        const [[t1, t1ba]] = getCardTipStrBaSyouPairs(ctx, varNames[0], cardId)
        const [[t2, t2ba]] = getCardTipStrBaSyouPairs(ctx, varNames[1], cardId)
        ctx = moveItem(ctx, t2ba, [t1, t1ba], onMoveItem) as GameState
        ctx = moveItem(ctx, t1ba, [t2, t2ba], onMoveItem) as GameState
        let t1card = getCard(ctx, t1)
        t1card = CardFn.setIsRoll(t1card, false)
        ctx = setCard(ctx, t1, t1card) as GameState
        const t1State = { ...getItemState(ctx, t1) }
        const t2State = { ...getItemState(ctx, t2) }
        ctx = setItemState(ctx, t1, t2State) as GameState
        ctx = setItemState(ctx, t2, t1State) as GameState
        return ctx
      }
    case "合計国力〔x〕": {
      const [_, x] = action.title
      return function (ctx: GameState, effect: Effect): GameState {
        const cardId = EffectFn.getCardID(effect)
        const cardController = getItemController(ctx, cardId)
        const cardIdsCanPay = getCardIdsCanPayRollCost(ctx, cardController, null)
        if (cardIdsCanPay.length < x) {
          throw new TargetMissingError(`合計国力〔x〕:${cardIdsCanPay.length} < ${x}`)
        }
        return ctx
      }
    }
    case "_敵軍_ユニットが_戦闘エリアにいる場合": {
      const [_, side, category, areas] = action.title
      return function (ctx: GameState, effect: Effect): GameState {
        const cardId = EffectFn.getCardID(effect)
        const playerId = getItemController(ctx, cardId);
        const targetPlayerId = side == "自軍" ? playerId : PlayerIDFn.getOpponent(playerId)
        const basyous: AbsoluteBaSyou[] = (lift(AbsoluteBaSyouFn.of)([targetPlayerId], areas))
        const pairs = basyous.flatMap(basyou =>
          getCardLikeItemIdsByBasyou(ctx, basyou)
            .filter(cardId => getItemRuntimeCategory(ctx, cardId) == category)
            .map(cardId => [cardId, basyou] as StrBaSyouPair)
        )
        if (pairs.length == 0) {
          throw new TargetMissingError(`${action.title[0]} ${pairs.length}`)
        }
        return ctx
      }
    }
    case "這張卡在_戰區的場合": {
      const [_, areas] = action.title
      return function (ctx: GameState, effect: Effect): GameState {
        const cardId = EffectFn.getCardID(effect)
        const from = getItemBaSyou(ctx, cardId)
        if (areas.includes(AbsoluteBaSyouFn.getBaSyouKeyword(from))) {

        } else {
          throw new TargetMissingError(`${action.title} ${cardId} not in ${JSON.stringify(areas)}`)
        }
        return ctx
      }
    }
    case "這個效果1回合只能用1次": {
      return function (ctx: GameState, effect: Effect): GameState {
        return ctx
      }
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

