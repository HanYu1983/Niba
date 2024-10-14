import { pipe, always, map, flatten } from "ramda"
import { logCategory } from "../../tool/logger"
import { createBridge } from "../bridge/createBridge"
import { AbsoluteBaSyouFn } from "../define/BaSyou"
import { Effect } from "../define/Effect"
import { GlobalEffect } from "../define/GlobalEffect"
import { PlayerA, PlayerB } from "../define/PlayerID"
import { Situation, getOnSituationFn, OnSituationFn, CardText } from "../define/CardText"
import { ToolFn } from "../tool"
import { getCardIds, getCard } from "./CardTableComponent"
import { GameState } from "./GameState"
import { getItemIdsByBasyou, isCard, isChip, getItem, getItemPrototype, Item, getItemController } from "./ItemTableComponent"
import { getItemState, getItemStateValues } from "./ItemStateComponent"
import { ItemStateFn } from "../define/ItemState"
import { createTextsFromSpecialEffect } from "./createTextsFromSpecialEffect"
import { TipTitleTextRef } from "../define/Tip"
import { getCardTextFromCardTextRef } from "./card"

export function getGlobalEffects(ctx: GameState, situation: Situation | null): GlobalEffect[] {
  const key = JSON.stringify(situation)
  const cached = ctx.globalEffectPool[key]
  if (cached) {
    logCategory("getGlobalEffects", "useCache")
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
  const bridge = createBridge()
  const ges = createAllCardTexts(ctx, situation).flatMap(([item, texts]) => {
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
  const gGes = [AbsoluteBaSyouFn.of(PlayerA, "Gゾーン"), AbsoluteBaSyouFn.of(PlayerB, "Gゾーン")]
    .flatMap(basyou => getItemIdsByBasyou(ctx, basyou))
    .filter(itemId => getCard(ctx, itemId).isRoll != true)
    .map(itemId => {
      // 空陣列代表產生無色國力
      const colors = getItemPrototype(ctx, itemId).gsign?.[0] || []
      return { title: ["發生國力", colors], cardIds: [itemId] } as GlobalEffect
    })
  return [...ges, ...itemStateGes, ...gGes]
}


export function createAllCardTexts(ctx: GameState, situation: Situation | null): [Item, CardText[]][] {
  // 常駐
  const getTextGroup1 = pipe(
    always(AbsoluteBaSyouFn.getBaAll()),
    map(basyou => getItemIdsByBasyou(ctx, basyou)),
    flatten,
    itemIds => itemIds.filter(itemId => isCard(ctx, itemId) || isChip(ctx, itemId)),
    map(itemId => getItem(ctx, itemId)),
    map(item => {
      const proto = getItemPrototype(ctx, item.id)
      let texts = (proto.texts || []).flatMap(text => {
        if (text.title[0] == "特殊型") {
          return createTextsFromSpecialEffect(ctx, item.id, text)
        }
        return [text]
      })
      texts = texts.filter(text => text.title[0] == "自動型" && (text.title[1] == "常駐" || text.title[1] == "起動"))
      return [item, texts] as [Item, CardText[]]
    })
  )
  // 恒常 & 使用型
  const getTextGroup2 = pipe(
    always(AbsoluteBaSyouFn.getTextOn()),
    map(basyou => getItemIdsByBasyou(ctx, basyou)),
    flatten,
    itemIds => itemIds.filter(itemId => isCard(ctx, itemId) || isChip(ctx, itemId)),
    map(itemId => getItem(ctx, itemId)),
    map(item => {
      const proto = getItemPrototype(ctx, item.id)
      let texts = (proto.texts || []).flatMap(text => {
        if (text.title[0] == "特殊型") {
          return createTextsFromSpecialEffect(ctx, item.id, text)
        }
        return [text]
      })
      texts = texts.filter(text => (text.title[0] == "自動型" && text.title[1] == "恒常") || text.title[0] == "使用型")
      return [item, texts] as [Item, CardText[]]
    })
  )
  // Gゾーン常駐
  const getTextGroup3 = pipe(
    always([AbsoluteBaSyouFn.of(PlayerA, "Gゾーン"), AbsoluteBaSyouFn.of(PlayerB, "Gゾーン")]),
    map(basyou => getItemIdsByBasyou(ctx, basyou)),
    flatten,
    itemIds => itemIds.filter(itemId => isCard(ctx, itemId) || isChip(ctx, itemId)),
    map(itemId => getItem(ctx, itemId)),
    map(item => {
      const proto = getItemPrototype(ctx, item.id)
      let texts = (proto.texts || []).flatMap(text => {
        if (text.protectLevel == 2 && text.title[0] == "特殊型") {
          return createTextsFromSpecialEffect(ctx, item.id, text)
        }
        return [text]
      })
      texts = texts.filter(text => text.protectLevel == 2 && text.title[0] == "自動型" && (text.title[1] == "常駐" || text.title[1] == "起動"))
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
      return null
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

  const textsLayer2 = gesLayer1.filter(ge => ge.title[0] == "AddText")
    .map(ge => [ge.cardIds, ge.title[1]] as [string[], CardText])
    .flatMap(([itemIds, text]) => {
      return itemIds.flatMap(itemId => {
        const texts = text.title[0] == "特殊型" ? createTextsFromSpecialEffect(ctx, itemId, text) : [text]
        return [[getItem(ctx, itemId), texts]] as [Item, CardText[]][]
      })
    })

  const textsLayer2_2 = gesLayer1.filter(ge => ge.title[0] == "AddTextRef")
    .map(ge => [ge.cardIds, ge.title[1]] as [string[], TipTitleTextRef])
    .flatMap(([itemIds, textRef]) => {
      return itemIds.flatMap(itemId => {
        const text = getCardTextFromCardTextRef(ctx, textRef)
        const texts = text.title[0] == "特殊型" ? createTextsFromSpecialEffect(ctx, itemId, text) : [text]
        return [[getItem(ctx, itemId), texts]] as [Item, CardText[]][]
      })
    })
  return [...allCardTexts, ...textsLayer2, ...textsLayer2_2]
}