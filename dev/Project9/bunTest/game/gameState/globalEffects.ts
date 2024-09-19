import { pipe, always, map, flatten } from "ramda"
import { log } from "../../tool/logger"
import { createBridge } from "../bridge/createBridge"
import { AbsoluteBaSyouFn } from "../define/BaSyou"
import { Effect } from "../define/Effect"
import { GlobalEffect } from "../define/GlobalEffect"
import { PlayerA, PlayerB } from "../define/PlayerID"
import { Situation, getTextsFromTokuSyuKouKa, getOnSituationFn, OnSituationFn, CardText } from "../define/CardText"
import { ToolFn } from "../tool"
import { getCardIds, getCard } from "./CardTableComponent"
import { GameState } from "./GameState"
import { getItemIdsByBasyou, isCard, isChip, getItem, getItemPrototype, Item, getItemController, getCardLikeItemIdsByBasyou } from "./ItemTableComponent"
import { getItemStateValues } from "./ItemStateComponent"
import { ItemStateFn } from "../define/ItemState"

export function getGlobalEffects(ctx: GameState, situation: Situation | null): GlobalEffect[] {
  const key = JSON.stringify(situation)
  const cached = ctx.globalEffectPool[key]
  if (cached) {
    log("getGlobalEffects", "useCache")
    return cached
  }
  return getSituationEffects(ctx, situation)
}

export function setGlobalEffects(ctx: GameState, situation: Situation | null, ges: GlobalEffect[]): GameState {
  const key = JSON.stringify(situation)
  return {
    ...ctx,
    globalEffectPool: {
      ...ctx.globalEffectPool,
      [key]: ges
    }
  }
}

export function clearGlobalEffects(ctx: GameState): GameState {
  return {
    ...ctx,
    globalEffectPool: {}
  }
}

// globalEffects
function getSituationEffects(ctx: GameState, situation: Situation | null): GlobalEffect[] {
  // 常駐
  const getTextGroup1 = pipe(
    always(AbsoluteBaSyouFn.getBaAll()),
    map(basyou => getCardLikeItemIdsByBasyou(ctx, basyou)),
    flatten,
    itemIds => itemIds.filter(itemId => isCard(ctx, itemId) || isChip(ctx, itemId)),
    map(itemId => getItem(ctx, itemId)),
    map(item => {
      const proto = getItemPrototype(ctx, item.id)
      let texts = (proto.texts || []).flatMap(text => {
        if (text.title[0] == "特殊型") {
          return getTextsFromTokuSyuKouKa(text.title[1])
        }
        return [text]
      })
      texts = texts.filter(text => text.title[0] == "自動型" && (text.title[1] == "常駐" || text.title[1] == "起動"))
      return [item, texts] as [Item, CardText[]]
    })
  )
  // 恒常
  const getTextGroup2 = pipe(
    always(AbsoluteBaSyouFn.getScriptAll()),
    map(basyou => getCardLikeItemIdsByBasyou(ctx, basyou)),
    flatten,
    itemIds => itemIds.filter(itemId => isCard(ctx, itemId) || isChip(ctx, itemId)),
    map(itemId => getItem(ctx, itemId)),
    map(item => {
      const proto = getItemPrototype(ctx, item.id)
      let texts = (proto.texts || []).flatMap(text => {
        if (text.title[0] == "特殊型") {
          return getTextsFromTokuSyuKouKa(text.title[1])
        }
        return [text]
      })
      texts = texts.filter(text => text.title[0] == "自動型" && text.title[1] == "恒常")
      return [item, texts] as [Item, CardText[]]
    })
  )
  // Gゾーン常駐
  const getTextGroup3 = pipe(
    always([AbsoluteBaSyouFn.of(PlayerA, "Gゾーン"), AbsoluteBaSyouFn.of(PlayerB, "Gゾーン")]),
    map(basyou => getCardLikeItemIdsByBasyou(ctx, basyou)),
    flatten,
    itemIds => itemIds.filter(itemId => isCard(ctx, itemId) || isChip(ctx, itemId)),
    map(itemId => getItem(ctx, itemId)),
    map(item => {
      const proto = getItemPrototype(ctx, item.id)
      let texts = (proto.texts || []).flatMap(text => {
        if (text.isEnabledWhileG && text.title[0] == "特殊型") {
          return getTextsFromTokuSyuKouKa(text.title[1])
        }
        return [text]
      })
      texts = texts.filter(text => text.isEnabledWhileG && text.title[0] == "自動型" && (text.title[1] == "常駐" || text.title[1] == "起動"))
      return [item, texts] as [Item, CardText[]]
    })
  )
  // command
  const getTextGroup4 = pipe(
    always(getCardIds(ctx)),
    map(cardId => {
      const proto = getItemPrototype(ctx, cardId)
      if (proto.commandText?.onSituation) {
        return [getCard(ctx, cardId), [proto.commandText]] as [Item, CardText[]]
      }
    }),
    infos => infos.filter(v => v) as [Item, CardText[]][],
  )
  const allCardTexts = [...getTextGroup1(), ...getTextGroup2(), ...getTextGroup3(), ...getTextGroup4()]

  const bridge = createBridge()
  const ges = allCardTexts.flatMap(([item, texts]) => {
    const globalEffects = texts
      .map((text, i) => {
        const cardController = getItemController(ctx, item.id)
        const fn = getOnSituationFn(text)
        const effect: Effect = {
          id: ToolFn.getUUID("getSituationEffects"),
          reason: ["Situation", cardController, item.id, situation],
          text: text
        }
        return [fn, effect] as [OnSituationFn, Effect]
      })
      .flatMap(([fn, effect]) => {
        return fn(ctx, effect, bridge)
      })
    return globalEffects
  })

  const itemStateGes = getItemStateValues(ctx).flatMap(ItemStateFn.getGlobalEffects)

  const gesLayer1 = [...ges, ...itemStateGes]

  const gesLayer2 = gesLayer1.filter(ge => ge.title[0] == "AddText")
    .map(ge => [ge.cardIds, ge.title[1]] as [string[], CardText])
    .flatMap(([itemIds, text]) => {
      return itemIds
        .flatMap(itemId => {
          const cardController = getItemController(ctx, itemId)
          const texts = text.title[0] == "特殊型" ? getTextsFromTokuSyuKouKa(text.title[1]) : [text]
          return texts.map(text => {
            const fn = getOnSituationFn(text)
            const effect: Effect = {
              id: ToolFn.getUUID("getSituationEffects"),
              reason: ["Situation", cardController, itemId, situation],
              text: text
            }
            return { fn: fn, effect: effect }
          })
        })
        .flatMap(({ fn, effect }) => {
          return fn(ctx, effect, bridge)
        })
    })

  return [...gesLayer1, ...gesLayer2]
}

