import { pipe, always, map, sum } from "ramda"
import { AbsoluteBaSyouFn, BattleAreaKeyword } from "../define/BaSyou"
import { BattlePoint, BattlePointFn } from "../define/BattlePoint"
import { Card } from "../define/Card"
import { CardCategory, CardColor, GSignProperty, RollCostColor } from "../define/CardPrototype"
import { PlayerID } from "../define/PlayerID"
import { Situation, BattleBonus, TextSpeicalEffect, TextSpeicalEffectFn, CardText } from "../define/CardText"
import { getCard } from "./CardTableComponent"
import { getCoins, getCardIdByCoinId } from "./CoinTableComponent"
import { GameState } from "./GameState"
import { getGlobalEffects, setGlobalEffects, clearGlobalEffects } from "./globalEffects"
import { getItemPrototype, getItemIdsByBasyou, getItemBaSyou, isChip, isCard, getCardLikeItemIdsByBasyou, getItemController } from "./ItemTableComponent"
import { getSetGroupCards } from "./SetGroupComponent"
import { TipTitleTextRef } from "../define/Tip"

export function getCardTextFromCardTextRef(ctx: GameState, textRef: TipTitleTextRef): CardText {
  const { cardId, textId } = textRef
  const text = getItemPrototype(ctx, cardId).texts?.find(text => text.id == textId)
  if (text == null) {
    throw new Error(`textRef not found: ${cardId} => ${textId}`)
  }
  return text
}

export function getCardSpecialText(ctx: GameState, cardID: string, text: CardText): CardText {
  if (text.title[0] != "特殊型") {
    return text
  }
  switch (text.title[1][0]) {
    case "サイコミュ":
    case "範囲兵器": {
      const [name, value] = text.title[1]
      const ges = getGlobalEffects(ctx, null)
      ctx = setGlobalEffects(ctx, null, ges)
      const bonus = ges.filter(ge => ge.cardIds.includes(cardID)).map(ge => {
        if (ge.title[0] == "SpecialEffectBonus" && ge.title[1][0] == name) {
          return ge.title[2]
        }
        return 0
      }).reduce((a, b) => a + b)
      return {
        ...text,
        title: ["特殊型", [name, value + bonus]]
      }
    }
    default:
      return text
  }
}

export function getCardTexts(ctx: GameState, cardID: string): CardText[] {
  const ges = getGlobalEffects(ctx, null)
  ctx = setGlobalEffects(ctx, null, ges)
  const addedTexts = ges.flatMap(e => {
    if (e.cardIds.includes(cardID) && e.title[0] == "AddText") {
      return [e.title[1]]
    }
    if (e.cardIds.includes(cardID) && e.title[0] == "AddTextRef") {
      return [getCardTextFromCardTextRef(ctx, e.title[1])]
    }
    return []
  }).filter(v => v)
  const prototype = getItemPrototype(ctx, cardID)
  const texts = [...prototype.texts || [], ...addedTexts].map(text => {
    if (text.title[0] == "特殊型") {
      return getCardSpecialText(ctx, cardID, text)
    }
    return text
  })
  return texts
}

export function getItemCharacteristic(ctx: GameState, cardID: string): string {
  const prototype = getItemPrototype(ctx, cardID)
  return prototype.characteristic || "";
}

export function getCardColor(ctx: GameState, cardID: string): CardColor {
  const prototype = getItemPrototype(ctx, cardID)
  if (prototype.color == null) {
    throw new Error(`color not define: ${prototype.id}`)
  }
  return prototype.color;
}

export function getCardGSignProperty(ctx: GameState, cardID: string): GSignProperty {
  const prototype = getItemPrototype(ctx, cardID)
  if (prototype.gsign == null) {
    throw new Error(`gsign not define: ${prototype.id}`)
  }
  return prototype.gsign[1];
}

export function getCardTitle(ctx: GameState, cardID: string): string {
  const prototype = getItemPrototype(ctx, cardID)
  return prototype.title || "unknown";
}

export function getCardRollCost(ctx: GameState, cardID: string): RollCostColor[] {
  const prototype = getItemPrototype(ctx, cardID)
  return prototype.rollCost || [];
}

export function getCardRollCostLength(ctx: GameState, cardID: string): number {
  const prototype = getItemPrototype(ctx, cardID)
  const gEffects = getGlobalEffects(ctx, null)
  ctx = setGlobalEffects(ctx, null, gEffects)
  const added = pipe(
    always(gEffects),
    map(ge => {
      if (ge.title[0] == "合計国力＋(１)" && ge.cardIds.includes(cardID)) {
        return ge.title[1]
      }
      return 0
    }),
    sum
  )()
  return (prototype.rollCost || []).length + added;
}

export function getCardIdsCanPayRollCost(ctx: GameState, playerId: PlayerID, situation: Situation | null): string[] {
  return getGlobalEffects(ctx, situation)
    .filter(ge => ge.title[0] == "發生國力")
    .flatMap(ge => ge.cardIds)
    .filter(cardId => getCard(ctx, cardId).isRoll != true)
    .filter(cardId => getItemController(ctx, cardId) == playerId)
}

export function getCardBattlePoint(
  ctx: GameState,
  cardID: string
): BattlePoint {
  ctx = clearGlobalEffects(ctx)
  const globalEffects = getGlobalEffects(ctx, null);
  ctx = setGlobalEffects(ctx, null, globalEffects)
  const card = getCard(ctx, cardID);
  const bonusFromGlobalEffects = globalEffects.map(ge => {
    if (ge.title[0] == "AddText" &&
      ge.cardIds.includes(cardID) &&
      ge.title[1].title[0] == "TextBattleBonus") {
      return ge.title[1].title[1]
    }
    if (ge.title[0] == "＋x／＋x／＋xを得る" && ge.cardIds.includes(cardID)) {
      return ge.title[1]
    }
    return [0, 0, 0] as BattleBonus
  })
  const bonusFormCoin = getCoins(ctx).map(coin => {
    if (coin.title[0] == "BattleBonus" && getCardIdByCoinId(ctx, coin.id) == cardID) {
      return coin.title[1]
    }
    return [0, 0, 0] as BattleBonus
  })
  const prototype = getItemPrototype(ctx, card.id);
  const retBonus = [...bonusFromGlobalEffects, ...bonusFormCoin].reduce(
    BattlePointFn.add,
    prototype.battlePoint || BattlePointFn.getAllStar()
  );
  return retBonus;
}

export function getCardHasSpeicalEffect(
  ctx: GameState,
  a: TextSpeicalEffect,
  cardID: string
): boolean {
  const texts = getCardTexts(ctx, cardID)
  const has = texts.filter(e =>
    e.title[0] == "特殊型" &&
    TextSpeicalEffectFn.isSameKeyword(e.title[1], a)
  ).length > 0
  return has;
}

export function isCardCanReroll(
  ctx: GameState,
  cardID: string,
  situation: Situation | null
): boolean {
  const baSyouKW = getItemBaSyou(ctx, cardID).value[1];
  switch (baSyouKW) {
    case "Gゾーン":
    case "配備エリア":
    case "戦闘エリア2":
    case "戦闘エリア1":
      break;
    default:
      return false;
  }
  const baSyou = getItemBaSyou(ctx, cardID);
  const setGroup = getSetGroupCards(ctx, cardID);
  return true;
}

export function isCardMaster(
  ctx: GameState,
  unitCardID: string,
  cardID: string
): boolean {
  const match = getItemCharacteristic(ctx, unitCardID).match(/専用「(.+?)」/);
  if (match == null) {
    return false;
  }
  const [_, masterName] = match;
  if (masterName != getCardTitle(ctx, cardID)) {
    return false;
  }
  return true;
}

export function getCardBattleArea(
  ctx: GameState,
  cardID: string
): BattleAreaKeyword[] {
  const card = getCard(ctx, cardID);
  if (card == null) {
    throw new Error("card not found");
  }
  const prototype = getItemPrototype(ctx, card.id);
  return prototype.battleArea || [];
}

export function getItemRuntimeCategory(ctx: GameState, itemId: string): CardCategory {
  if (AbsoluteBaSyouFn.getBaSyouKeyword(getItemBaSyou(ctx, itemId)) == "Gゾーン") {
    return "グラフィック"
  }
  if (isChip(ctx, itemId)) {
    return "ユニット"
  }
  if (isCard(ctx, itemId)) {
    const category = getItemPrototype(ctx, itemId).category
    if (category == null) {
      throw new Error(`card category not found: ${itemId}`)
    }
    return category
  }
  throw new Error(`getCardRuntimeCategory unknown item type: ${itemId}`)
}

export function getItemIsCanReroll(ctx: GameState, itemId: string): boolean {
  return true
}

export function getItemIsCanRoll(ctx: GameState, itemId: string): boolean {
  return true
}

export function getCardIdsCanPayRollColor(ctx: GameState, situation: Situation | null, playerId: PlayerID, color: CardColor): { cardId: string, colors: CardColor[] }[] {
  return getGlobalEffects(ctx, situation).filter(ge => {
    if (getItemController(ctx, ge.cardIds[0]) != playerId) {
      return false
    }
    if (ge.title[0] == "發生國力") {
      const gainColors = ge.title[1]
      switch (color) {
        case "紫":
          return true
        default:
          return gainColors.includes(color)
      }
    }
    return false
  }).map(ge => ({ cardId: ge.cardIds[0], colors: ge.title[1] as CardColor[] }))
}