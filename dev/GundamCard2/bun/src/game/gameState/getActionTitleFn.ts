import { log } from "console"
import { repeat, lift } from "ramda"
import { AbsoluteBaSyouFn, AbsoluteBaSyou } from "../define/BaSyou"
import { Action, ActionTitleFn, ActionFn } from "../define/CardText"
import { CoinFn } from "../define/Coin"
import { Effect, EffectFn } from "../define/Effect"
import { TipError } from "../define/GameError"
import { GlobalEffect } from "../define/GlobalEffect"
import { ItemStateFn } from "../define/ItemState"
import { PlayerIDFn } from "../define/PlayerID"
import { StrBaSyouPair } from "../define/Tip"
import { getCardIdsCanPayRollCost, getItemRuntimeCategory } from "./card"
import { mapCard } from "./CardTableComponent"
import { getCardTipStrBaSyouPairs, setItemGlobalEffectsUntilEndOfTurn } from "./doEffect"
import { addStackEffect } from "./EffectStackComponent"
import { GameState } from "./GameState"
import { mapItemState, getItemState, setItemState } from "./ItemStateComponent"
import { getItemController, getItemBaSyou, setItemIsRoll, assertTargetMissingError, getItemIdsByBasyou, addCoinsToCard, getItemIdsByPlayerId, getItemPrototype } from "./ItemTableComponent"
import { doItemMove } from "./doItemMove"
import { doItemSwap } from "./doItemSwap"
import { triggerEvent } from "./triggerEvent"
import { doItemDamage } from "./doItemDamage"

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
              log("getActionTitleFn", whatToDo, varNames, pairs)
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
            case "廃棄": {
              for (const pair of pairs) {
                ctx = doItemMove(ctx, AbsoluteBaSyouFn.of(cardController, "ジャンクヤード"), pair)
              }
              return ctx
            }
          }
        }
      }
      case "_２ダメージを与える": {
        const [_, damage] = action.title
        const varNames = action.vars
        return function (ctx: GameState, effect: Effect): GameState {
          const cardId = EffectFn.getCardID(effect)
          const pairs = varNames == null ?
            [[cardId, getItemBaSyou(ctx, cardId)] as StrBaSyouPair] :
            varNames.flatMap(varName => {
              return getCardTipStrBaSyouPairs(ctx, varName, cardId)
            })
  
          for (const pair of pairs) {
            assertTargetMissingError(ctx, pair)
            const [targetId, _] = pair
            ctx = mapItemState(ctx, targetId, is => {
              return {
                ...is,
                damage: is.damage + damage
              }
            }) as GameState
          }
          return ctx
        }
      }
      case "_敵軍本国に_１ダメージ": {
        const [_, side, damage] = action.title
        return function (ctx: GameState, effect: Effect): GameState {
          const cardId = EffectFn.getCardID(effect)
          const cardController = getItemController(ctx, cardId)
          const playerId = side == "自軍" ? cardController : PlayerIDFn.getOpponent(cardController)
          const from = AbsoluteBaSyouFn.of(playerId, "本国")
          const pairs = getItemIdsByBasyou(ctx, from).map(itemId => {
            return [itemId, from] as StrBaSyouPair
          }).slice(0, damage)
          const to = AbsoluteBaSyouFn.of(playerId, "捨て山")
          for (const pair of pairs) {
            ctx = doItemMove(ctx, to, pair)
          }
          return ctx
        }
      }
      case "_の_ハンガーに移す": {
        const [_, side, basyouKw] = action.title
        const varNames = action.vars
        return function (ctx: GameState, effect: Effect): GameState {
          const cardId = EffectFn.getCardID(effect)
          const cardController = getItemController(ctx, cardId)
          const pairs = varNames == null ?
            [[cardId, getItemBaSyou(ctx, cardId)] as StrBaSyouPair] :
            varNames.flatMap(varName => {
              return getCardTipStrBaSyouPairs(ctx, varName, cardId)
            })
          const playerId = side == "自軍" ? cardController : PlayerIDFn.getOpponent(cardController)
          const to = AbsoluteBaSyouFn.of(playerId, basyouKw)
          for (const pair of pairs) {
            ctx = doItemMove(ctx, to, pair)
          }
          return ctx
        }
      }
      case "看自己_本國全部的卡": {
        const [_, basyouKw] = action.title
        return function (ctx: GameState, effect: Effect): GameState {
          const cardId = EffectFn.getCardID(effect)
          const cardController = getItemController(ctx, cardId)
          for (const itemId of getItemIdsByBasyou(ctx, AbsoluteBaSyouFn.of(cardController, basyouKw))) {
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
            return doItemDamage(ctx, 1, pair)
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
          const pairs = getItemIdsByBasyou(ctx, fromBasyou).slice(0, count).map(cardId => {
            return [cardId, fromBasyou] as StrBaSyouPair
          })
          for (const pair of pairs) {
            ctx = doItemMove(ctx, AbsoluteBaSyouFn.of(cardController, "手札"), pair)
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
          const [target1] = getCardTipStrBaSyouPairs(ctx, varNames[0], cardId)
          const [target2] = getCardTipStrBaSyouPairs(ctx, varNames[1], cardId)
          ctx = doItemSwap(ctx, target1, target2)
          ctx = mapCard(ctx, target2[0], card => ({ ...card, isRoll: false })) as GameState
          // 以下應不需要, 置換只有換protoID和狀態, 這樣才能繼承所有對象
          // ctx = moveItem(ctx, t2ba, [t1, t1ba]) as GameState
          // ctx = moveItem(ctx, t1ba, [t2, t2ba]) as GameState
          // let t1card = getCard(ctx, t1)
          // t1card = CardFn.setIsRoll(t1card, false)
          // ctx = setCard(ctx, t1, t1card) as GameState
          // const t1State = { ...getItemState(ctx, t1) }
          // const t2State = { ...getItemState(ctx, t2) }
          // ctx = setItemState(ctx, t1, t2State) as GameState
          // ctx = setItemState(ctx, t2, t1State) as GameState
          return ctx
        }
      case "合計国力〔x〕": {
        const [_, x] = action.title
        return function (ctx: GameState, effect: Effect): GameState {
          const cardId = EffectFn.getCardID(effect)
          const cardController = getItemController(ctx, cardId)
          const cardIdsCanPay = getCardIdsCanPayRollCost(ctx, cardController, null)
          if (cardIdsCanPay.length < x) {
            throw new TipError(`合計国力〔x〕:${cardIdsCanPay.length} < ${x}. ${effect.text.description}`)
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
            getItemIdsByBasyou(ctx, basyou)
              .filter(cardId => getItemRuntimeCategory(ctx, cardId) == category)
              .map(cardId => [cardId, basyou] as StrBaSyouPair)
          )
          if (pairs.length == 0) {
            throw new TipError(`${action.title[0]} ${pairs.length}`)
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
            throw new TipError(`${action.title} ${cardId} not in ${JSON.stringify(areas)}`)
          }
          return ctx
        }
      }
      case "_黒のGサインを持つ_自軍_Gが_５枚以上ある場合": {
        const [_, color, side, category, count] = action.title
        return function (ctx: GameState, effect: Effect): GameState {
          const cardId = EffectFn.getCardID(effect)
          const cardController = getItemController(ctx, cardId)
          const playerId = side == "自軍" ? cardController : PlayerIDFn.getOpponent(cardController)
          const gsignCount = getItemIdsByPlayerId(ctx, false, playerId)
            .filter(itemId => getItemPrototype(ctx, itemId).gsign?.[0].includes(color))
            .filter(itemId => getItemRuntimeCategory(ctx, itemId) == category).length
          if (gsignCount < count) {
            throw new TipError(`you have ${gsignCount}. must ${count}: ${action.title[0]}`)
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