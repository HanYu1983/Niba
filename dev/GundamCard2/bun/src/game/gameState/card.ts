import { pipe, always, map, sum } from "ramda"
import { AbsoluteBaSyouFn, BattleAreaKeyword } from "../define/BaSyou"
import { BattlePoint, BattlePointFn } from "../define/BattlePoint"
import { Card } from "../define/Card"
import { CardCategory, CardColor, GSign, GSignProperty, RollCostColor } from "../define/CardPrototype"
import { PlayerID } from "../define/PlayerID"
import { Situation, BattleBonus, TextSpeicalEffect, TextSpeicalEffectFn, CardText, TextTitle } from "../define/CardText"
import { getCard } from "./CardTableComponent"
import { getCoins, getCardIdByCoinId } from "./CoinTableComponent"
import { GameState } from "./GameState"
import { getItemPrototype, getItemBaSyou, isChip, isCard, getItemController, ItemTableComponent } from "./ItemTableComponent"
import { getSetGroupChildren } from "./SetGroupComponent"
import { TipTitleTextRef } from "../define/Tip"
import { createBridge } from "../bridge/createBridge"
import { GlobalEffect } from "../define/GlobalEffect"
import { logCategory } from "../../tool/logger"
import { GameExtParams } from "../define/GameExtParams"

export function getCardTextFromCardTextRef(ctx: ItemTableComponent, textRef: TipTitleTextRef): CardText {
  const { cardId, textId } = textRef
  const proto = getItemPrototype(ctx, cardId)
  const text = proto.texts?.find(text => text.id == textId)
  if (text == null) {
    console.log(proto)
    console.log(textRef)
    throw new Error(`textRef not found: ${cardId} => ${textId}`)
  }
  return text
}

export function getCardSpecialText(text: CardText, options: { ges?: GlobalEffect[], cardId?: string }): CardText {
  logCategory("getCardSpecialText", "")
  if (text.title[0] != "特殊型") {
    return text
  }
  switch (text.title[1][0]) {
    case "サイコミュ":
    case "範囲兵器": {
      const [name, value] = text.title[1]
      const bonus = options?.ges?.filter(ge => ge.cardIds.includes(options.cardId || "")).map(ge => {
        if (ge.title[0] == "SpecialEffectBonus" && ge.title[1][0] == name) {
          return ge.title[1][1]
        }
        return 0
      }).reduce((a, b) => a + b, 0) || 0
      const title: TextTitle = ["特殊型", [name, value + bonus]]
      return {
        ...text,
        title: title,
        description: `${text.description} => ${JSON.stringify(title[1])}`,
      }
    }
    default:
      return text
  }
}

export function getCardTexts(ctx: ItemTableComponent, cardID: string, options: GameExtParams): CardText[] {
  logCategory("getCardTexts", "")
  const addedTexts = options?.ges?.flatMap(e => {
    if (e.cardIds.includes(cardID) && e.title[0] == "AddText") {
      return [e.title[1]]
    }
    if (e.cardIds.includes(cardID) && e.title[0] == "AddTextRef") {
      return [getCardTextFromCardTextRef(ctx, e.title[1])]
    }
    return []
  }).filter(v => v) || []
  const prototype = getItemPrototype(ctx, cardID)
  const texts = [...prototype.texts || [], ...addedTexts].map(text => {
    if (text.title[0] == "特殊型") {
      return getCardSpecialText(text, { cardId: cardID, ges: options?.ges })
    }
    return text
  })

  // 取得增減費用的效果, 寫在condition裡很像就可以了
  // 179003_01A_U_BN007R_brown
  // R
  // G
  // シャイニングガンダム（スーパーモード）
  // シャイニング系　MF　専用「ドモン・カッシュ」
  // （ダメージ判定ステップ）〔茶３毎〕：このカードの部隊が戦闘ダメージを与えている場合、敵軍ユニット１枚の上に、±０／±０／－１コイン２個を乗せる。
  // この効果のコストは、このカードに「特徴：GF」を持つキャラがセットされている場合、〔茶２毎〕に変更される。

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


export function getItemGSign(ctx: GameState, cardID: string): GSign {
  const prototype = getItemPrototype(ctx, cardID)
  if (prototype.gsign == null) {
    throw new Error(`gsign not define: ${prototype.id}`)
  }
  return prototype.gsign;
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

export function getCardRollCostLength(ctx: GameState, cardID: string): number {
  const prototype = getItemPrototype(ctx, cardID)
  return prototype.rollCost?.length || 0
}

export function getCardTotalCostLength(ctx: GameState, cardID: string, options: GameExtParams): number {
  logCategory("getCardTotalCostLength", "")
  const prototype = getItemPrototype(ctx, cardID)
  const added = pipe(
    always(options?.ges || []),
    map(ge => {
      if (ge.title[0] == "合計国力_＋１" && ge.cardIds.includes(cardID)) {
        return ge.title[1]
      }
      return 0
    }),
    sum
  )()
  let totalCost = 0
  if (prototype.totalCost == null) {

  } else if (prototype.totalCost == "X") {
    totalCost = getCardIdsCanPayRollCost(ctx, getItemController(ctx, cardID), options).length
  } else {
    totalCost = prototype.totalCost
  }
  return totalCost + added;
}

export function getCardIdsCanPayRollCost(ctx: GameState, playerId: PlayerID, options: { ges?: GlobalEffect[] }): string[] {
  logCategory("getCardIdsCanPayRollCost", "")
  return options?.ges?.filter(ge => ge.title[0] == "發生國力")
    .flatMap(ge => ge.cardIds)
    .filter(cardId => getCard(ctx, cardId).isRoll != true)
    .filter(cardId => getItemController(ctx, cardId) == playerId) || []
}

export function getCardBattlePoint(
  ctx: GameState,
  cardID: string,
  options: { ges?: GlobalEffect[] }
): BattlePoint {
  logCategory("getCardBattlePoint", "")
  const card = getCard(ctx, cardID);
  const bonusFromGlobalEffects = options?.ges?.map(ge => {
    if (ge.title[0] == "AddText" &&
      ge.cardIds.includes(cardID) &&
      ge.title[1].title[0] == "TextBattleBonus") {
      return ge.title[1].title[1]
    }
    if (ge.title[0] == "＋x／＋x／＋xを得る" && ge.cardIds.includes(cardID)) {
      return ge.title[1]
    }
    return [0, 0, 0] as BattleBonus
  }) || []
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
  ctx: ItemTableComponent,
  a: TextSpeicalEffect,
  cardID: string,
  options: { ges?: GlobalEffect[] }
): boolean {
  logCategory("getCardHasSpeicalEffect", "")
  const texts = getCardTexts(ctx, cardID, options)
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
  const setGroup = getSetGroupChildren(ctx, cardID);
  return true;
}

export function isCardMaster(
  ctx: GameState,
  unitCardID: string,
  cardID: string
): boolean {
  logCategory("isCardMaster", unitCardID, cardID)
  const char = getItemCharacteristic(ctx, unitCardID)
  logCategory("isCardMaster", "getItemCharacteristic", char)
  const match = char.match(/専用「(.+?)」/);
  if (match == null) {
    return false;
  }
  const [_, masterName] = match;
  const title = getCardTitle(ctx, cardID)
  logCategory("isCardMaster", masterName, title, masterName == title)
  if (masterName != title) {
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

export function getCardIdsCanPayRollColor(ctx: GameState, playerId: PlayerID, color: CardColor | null, options: { ges?: GlobalEffect[] }): { cardId: string, colors: CardColor[] }[] {
  logCategory("getCardIdsCanPayRollColor", "")
  return options?.ges?.flatMap(ge => {
    if (ge.cardIds.length == 0) {
      return []
    }
    if (getItemController(ctx, ge.cardIds[0]) != playerId) {
      return []
    }
    if (ge.title[0] == "發生國力") {
      const gainColors = ge.title[1]
      if (color == null || color == "紫" || gainColors.includes(color)) {
        return ge.cardIds.map(cardId => ({ cardId: cardId, colors: gainColors }))
      }
    }
    if (ge.title[0] == "このカードを自軍Gとしてロールできる") {
      return ge.cardIds.filter(cardId => getCard(ctx, cardId).isRoll != true).map(cardId => {
        const colors = getItemPrototype(ctx, cardId).gsign?.[0] || []
        return { cardId: cardId, colors: colors }
      })
    }
    if (ge.title[0] == "_白のGサインを持つ_自軍_Gとして扱う事ができる" && ge.title[2] == "自軍" && ge.title[3] == "グラフィック") {
      const cardIds = ge.cardIds
        .filter(cardId => getItemController(ctx, cardId) == playerId)
        .filter(cardId => getCard(ctx, cardId).isRoll != true)
      const colors = ge.title[1]
      return cardIds.map(cardId => {
        return { cardId: cardId, colors: colors }
      })
    }
    return []
  }) || []
}