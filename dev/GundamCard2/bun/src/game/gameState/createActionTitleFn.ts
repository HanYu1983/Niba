import { repeat, lift, range } from "ramda"
import { AbsoluteBaSyouFn, AbsoluteBaSyou, RelatedBaSyou, BaSyou } from "../define/BaSyou"
import { Action, ActionTitleFn, ActionFn } from "../define/CardText"
import { CoinFn } from "../define/Coin"
import { Effect, EffectFn } from "../define/Effect"
import { TargetMissingError, TipError } from "../define/GameError"
import { GlobalEffect } from "../define/GlobalEffect"
import { ItemStateFn } from "../define/ItemState"
import { PlayerID, PlayerIDFn } from "../define/PlayerID"
import { StrBaSyouPair, Tip, TipFn } from "../define/Tip"
import { getCardIdsCanPayRollCost, getItemRuntimeCategory } from "./card"
import { mapCard } from "./CardTableComponent"
import { getCardTipSelection, getCardTipStrBaSyouPairs, setCardTipStrBaSyouPairs } from "./doEffect"
import { addStackEffect } from "./EffectStackComponent"
import { GameState } from "./GameState"
import { mapItemState, getItemState, setItemState } from "./ItemStateComponent"
import { getItemController, getItemBaSyou, assertTargetMissingError, getItemIdsByBasyou, addCoinsToCard, getItemIdsByPlayerId, getItemPrototype, getItemOwner, shuffleItems, createStrBaSyouPair } from "./ItemTableComponent"
import { doItemMove } from "./doItemMove"
import { doItemSwap } from "./doItemSwap"
import { doTriggerEvent } from "./doTriggerEvent"
import { doItemDamage } from "./doItemDamage"
import { doItemSetRollState } from "./doItemSetRollState"
import { doCountryDamage } from "./doCountryDamage"
import { logCategory } from "../../tool/logger"
import { doItemSetDestroy } from "./doItemSetDestroy"
import { doItemSetGlobalEffectsUntilEndOfTurn } from "./doItemSetGlobalEffectsUntilEndOfTurn"
import { RelatedPlayerSideKeyword } from "../define"
import { doPlayerDrawCard } from "./doPlayerDrawCard"
import { getPlayerState, mapPlayerState } from "./PlayerStateComponent"
import { createTipByEntitySearch } from "./Entity"
import { doBattleDamage, doRuleBattleDamage } from "./player"
import { getBattleGroup } from "./battleGroup"

export function createPlayerIdFromRelated(ctx: GameState, cardId: string, re: RelatedPlayerSideKeyword): PlayerID {
  switch (re) {
    case "自軍":
      return getItemController(ctx, cardId)
    case "敵軍":
      return PlayerIDFn.getOpponent(getItemController(ctx, cardId))
    case "持ち主":
      return getItemOwner(ctx, cardId)
  }
}

export function createAbsoluteBaSyouFromBaSyou(ctx: GameState, cardId: string, re: BaSyou): AbsoluteBaSyou {
  if (re.id == "AbsoluteBaSyou") {
    return re
  }
  return AbsoluteBaSyouFn.of(createPlayerIdFromRelated(ctx, cardId, re.value[0]), re.value[1])
}

export function createActionTitleFn(action: Action): ActionTitleFn {
  if (typeof action.title == "string") {
    return ActionFn.getTitleFn(action)
  }
  switch (action.title[0]) {
    case "Entity": {
      const [_, options] = action.title
      if ([options.max, options.min, options.count].every(v => v == null)) {
        throw new Error(`Entity search must has one of min, max, count`)
      }
      return function (ctx: GameState, effect: Effect): GameState {
        const cardId = EffectFn.getCardID(effect)
        const tip = createTipByEntitySearch(ctx, cardId, options)
        const error = TipFn.checkTipSatisfies(tip)
        if (error) {
          throw error
        }
        return ctx
      }
    }
    case "この記述の効果は、プレイヤー毎に１ターンに１回まで解決できる": {
      return function (ctx: GameState, effect: Effect): GameState {
        const cardId = EffectFn.getCardID(effect)
        const cardController = getItemController(ctx, cardId)
        if (getPlayerState(ctx, cardController).textIdsUseThisTurn[effect.text.id]) {
          throw new TargetMissingError(`この記述の効果は、プレイヤー毎に１ターンに１回まで解決できる`)
        }
        ctx = mapPlayerState(ctx, cardController, ps => ({
          ...ps, textIdsUseThisTurn: {
            ...ps.textIdsUseThisTurn,
            [effect.text.id]: true
          }
        })) as GameState
        return ctx
      }
    }
    case "_自軍_本国をシャッフルする": {
      const [_, side, basyouKw] = action.title
      return function (ctx: GameState, effect: Effect): GameState {
        const cardId = EffectFn.getCardID(effect)
        const playerId = createPlayerIdFromRelated(ctx, cardId, side)
        const basyou = AbsoluteBaSyouFn.of(playerId, basyouKw)
        ctx = shuffleItems(ctx, basyou) as GameState
        return ctx
      }
    }
    case "Action": {
      const [_, options] = action.title
      const varNames = action.vars
      return function (ctx: GameState, effect: Effect): GameState {
        const cardId = EffectFn.getCardID(effect)
        const pairs = varNames == null ?
          [[cardId, getItemBaSyou(ctx, cardId)] as StrBaSyouPair] :
          varNames.flatMap(varName => {
            return getCardTipStrBaSyouPairs(ctx, varName, cardId)
          })
        for (const pair of pairs) {
          if (options.move) {
            ctx = doItemMove(ctx, createAbsoluteBaSyouFromBaSyou(ctx, cardId, options.move), pair)
          }
        }
        return ctx
      }
    }
    case "triggerEvent": {
      const [_, event] = action.title
      return function (ctx: GameState, effect: Effect): GameState {
        const cardId = EffectFn.getCardID(effect)
        ctx = doTriggerEvent(ctx, { ...event, effect: effect, cardIds: [cardId] })
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
              ctx = doItemSetRollState(ctx, true, pair) as GameState
            }
            return ctx
          }
          case "リロール": {
            for (const pair of pairs) {
              ctx = doItemSetRollState(ctx, false, pair) as GameState
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
              ctx = doItemSetDestroy(ctx, { id: "破壊する", playerID: cardController }, pair)
            }
            return ctx
          }
          case "廃棄": {
            for (const pair of pairs) {
              ctx = doItemMove(ctx, AbsoluteBaSyouFn.setBaSyouKeyword(pair[1], "ジャンクヤード"), pair)
            }
            return ctx
          }
          case "破壊を無効": {
            for (const pair of pairs) {
              ctx = doItemSetDestroy(ctx, null, pair)
            }
            return ctx
          }
          case "見": {
            for (const pair of pairs) {
              ctx = mapItemState(ctx, pair[0], is => ({ ...is, isCheat: true })) as GameState
            }
            return ctx
          }
        }
      }
    }
    // case "_２ダメージを与える": {
    //   const [_, damage] = action.title
    //   const varNames = action.vars
    //   return function (ctx: GameState, effect: Effect): GameState {
    //     const cardId = EffectFn.getCardID(effect)
    //     const pairs = varNames == null ?
    //       [[cardId, getItemBaSyou(ctx, cardId)] as StrBaSyouPair] :
    //       varNames.flatMap(varName => {
    //         return getCardTipStrBaSyouPairs(ctx, varName, cardId)
    //       })

    //     for (const pair of pairs) {
    //       assertTargetMissingError(ctx, pair)
    //       const [targetId, _] = pair
    //       ctx = mapItemState(ctx, targetId, is => {
    //         return {
    //           ...is,
    //           damage: is.damage + damage
    //         }
    //       }) as GameState
    //     }
    //     return ctx
    //   }
    // }
    case "_敵軍本国に_１ダメージ": {
      const [_, side, damage] = action.title
      return function (ctx: GameState, effect: Effect): GameState {
        const cardId = EffectFn.getCardID(effect)
        const cardController = getItemController(ctx, cardId)
        const playerId = PlayerIDFn.fromRelatedPlayerSideKeyword(side, cardController)
        ctx = doCountryDamage(ctx, playerId, damage)
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
        const playerId = PlayerIDFn.fromRelatedPlayerSideKeyword(side, cardController)
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
      const [_, damage] = action.title
      const varNames = action.vars
      return function (ctx: GameState, effect: Effect): GameState {
        const cardId = EffectFn.getCardID(effect)
        const cardController = getItemController(ctx, cardId)
        const pairs = varNames == null ?
          [[cardId, getItemBaSyou(ctx, cardId)] as StrBaSyouPair] :
          varNames.flatMap(varName => {
            return getCardTipStrBaSyouPairs(ctx, varName, cardId)
          })
        ctx = pairs.reduce((ctx, pair) => {
          return doItemDamage(ctx, cardController, damage, pair)
        }, ctx)
        return ctx
      }
    }
    case "_１貫通ダメージを与える": {
      const [_, damage] = action.title
      const varNames = action.vars
      return function (ctx: GameState, effect: Effect): GameState {
        const cardId = EffectFn.getCardID(effect)
        const cardController = getItemController(ctx, cardId)
        const basyous = varNames == null ?
          [getItemBaSyou(ctx, cardId)] :
          varNames.flatMap(varName => {
            return getCardTipSelection(ctx, varName, cardId, { assertTitle: ["BaSyou", [], []] }) as AbsoluteBaSyou[]
          })
        const [nextCtx, _] = doBattleDamage(ctx,
          cardController,
          basyous.flatMap(basyou => getBattleGroup(ctx, basyou)),
          damage, { isNotRule: true }
        )
        ctx = nextCtx
        return ctx
      }
    }
    case "_－１／－１／－１コイン_１個を乗せる": {
      const [_, bonus, x] = action.title
      const varNames = action.vars
      // if (varNames == null) {
      //   throw new Error(`action.var not found: ${action.title[0]}`)
      // }
      return function (ctx: GameState, effect: Effect): GameState {
        const cardId = EffectFn.getCardID(effect)
        const playerId = EffectFn.getPlayerID(effect)
        const pairs = varNames == null ?
          [[cardId, getItemBaSyou(ctx, cardId)] as StrBaSyouPair] :
          varNames.flatMap(varName => {
            return getCardTipStrBaSyouPairs(ctx, varName, cardId)
          })
        //const pairs = getCardTipStrBaSyouPairs(ctx, varNames[0], cardId)
        if (pairs.length == 0) {
          throw new Error(`pairs must not 0: ${action.title} ${action.vars}`)
        }
        const [targetCardId, targetBasyou] = pairs[0]
        const coins = range(0, x).map(i => CoinFn.battleBonus(playerId, bonus))
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
      // if (varNames == null) {
      //   throw new Error(`action.var not found: ${action.title[0]}`)
      // }
      return function (ctx: GameState, effect: Effect): GameState {
        const cardId = EffectFn.getCardID(effect)
        const pairs = varNames == null ?
          [[cardId, getItemBaSyou(ctx, cardId)] as StrBaSyouPair] :
          varNames.flatMap(varName => {
            return getCardTipStrBaSyouPairs(ctx, varName, cardId)
          })
        //const pairs = getCardTipStrBaSyouPairs(ctx, varNames[0], cardId)
        for (const [targetCardId, targetBaSyou] of pairs) {
          const gesForCard = ges.map(ge => {
            return {
              ...ge,
              cardIds: [targetCardId],
            } as GlobalEffect
          })
          ctx = doItemSetGlobalEffectsUntilEndOfTurn(ctx, gesForCard, [targetCardId, targetBaSyou])
        }
        return ctx
      }
    }
    case "カード_１枚を引く": {
      const [_, count] = action.title
      return function (ctx: GameState, effect: Effect): GameState {
        const cardId = EffectFn.getCardID(effect)
        const cardController = getItemController(ctx, cardId)
        ctx = doPlayerDrawCard(ctx, count, cardController)
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
        ctx = doItemSetRollState(ctx, false, target2, { isSkipTargetMissing: true })
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
          throw new TargetMissingError(`合計国力〔x〕:${cardIdsCanPay.length} < ${x}. ${effect.text.description}`)
        }
        ctx = setCardTipStrBaSyouPairs(ctx, TipFn.createTotalCostKey(), cardIdsCanPay.map(cardId => createStrBaSyouPair(ctx, cardId)), cardId)
        return ctx
      }
    }
    case "_敵軍_ユニットが_戦闘エリアにいる場合": {
      const [_, side, category, areas] = action.title
      return function (ctx: GameState, effect: Effect): GameState {
        const cardId = EffectFn.getCardID(effect)
        const playerId = getItemController(ctx, cardId);
        const targetPlayerId = PlayerIDFn.fromRelatedPlayerSideKeyword(side, playerId)
        const basyous: AbsoluteBaSyou[] = (lift(AbsoluteBaSyouFn.of)([targetPlayerId], areas))
        const pairs = basyous.flatMap(basyou =>
          getItemIdsByBasyou(ctx, basyou)
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
    case "_黒のGサインを持つ_自軍_Gが_５枚以上ある場合": {
      const [_, color, side, category, count] = action.title
      return function (ctx: GameState, effect: Effect): GameState {
        const cardId = EffectFn.getCardID(effect)
        const cardController = getItemController(ctx, cardId)
        const playerId = PlayerIDFn.fromRelatedPlayerSideKeyword(side, cardController)
        const gsignCount = getItemIdsByPlayerId(ctx, false, playerId)
          .filter(itemId => getItemPrototype(ctx, itemId).gsign?.[0].includes(color))
          .filter(itemId => getItemRuntimeCategory(ctx, itemId) == category).length
        if (gsignCount < count) {
          throw new TargetMissingError(`you have ${gsignCount}. must ${count}: ${action.title[0]}`)
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