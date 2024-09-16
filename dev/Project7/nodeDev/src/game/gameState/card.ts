import { pipe, always, map, sum } from "ramda"
import { AbsoluteBaSyouFn, BattleAreaKeyword } from "../define/BaSyou"
import { BattlePoint, BattlePointFn } from "../define/BattlePoint"
import { Card } from "../define/Card"
import { CardColor, RollCostColor } from "../define/CardPrototype"
import { PlayerID } from "../define/PlayerID"
import { Situation, BattleBonus, TextSpeicalEffect, TextSpeicalEffectFn, CardText } from "../define/CardText"
import { getCard } from "./CardTableComponent"
import { getCoins, getCardIdByCoinId } from "./CoinTableComponent"
import { GameState } from "./GameState"
import { getGlobalEffects, setGlobalEffects, clearGlobalEffects } from "./globalEffects"
import { getItemPrototype, getItemIdsByBasyou, getItemBaSyou } from "./ItemTableComponent"
import { getSetGroupCards } from "./SetGroupComponent"

export function getCardTexts(ctx: GameState, cardID: string): CardText[] {
    const ges = getGlobalEffects(ctx, null)
    ctx = setGlobalEffects(ctx, null, ges)
    const addedTexts = ges.map(e => {
      if (e.cardIds.includes(cardID) && e.title[0] == "AddText") {
        return e.title[1]
      }
    }).filter(v => v) as CardText[]
    const prototype = getItemPrototype(ctx, cardID)
    return [...prototype.texts, ...addedTexts];
  }
  
  export function getCardCharacteristic(ctx: GameState, cardID: string) {
    const prototype = getItemPrototype(ctx, cardID)
    return prototype.characteristic;
  }
  
  export function getCardColor(ctx: GameState, cardID: string): CardColor {
    const prototype = getItemPrototype(ctx, cardID)
    return prototype.color;
  }
  
  export function getCardTitle(ctx: GameState, cardID: string): string {
    const prototype = getItemPrototype(ctx, cardID)
    return prototype.title;
  }
  
  export function getCardRollCost(ctx: GameState, cardID: string): RollCostColor[] {
    const prototype = getItemPrototype(ctx, cardID)
    return prototype.rollCost;
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
    return prototype.rollCost.length + added;
  }
  
  export function getCardIdsCanPayRollCost(ctx: GameState, playerId: PlayerID, situation: Situation | null): string[] {
    const normalG = getItemIdsByBasyou(ctx, AbsoluteBaSyouFn.of(playerId, "Gゾーン")).map(cardId => {
      return [cardId, getCard(ctx, cardId)] as [string, Card]
    }).filter(([cardId, card]) => card.isRoll != true).map(([cardId]) => cardId)
    return normalG
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
      prototype.battlePoint
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
    const match = getCardCharacteristic(ctx, unitCardID).match(/専用「(.+?)」/);
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
    return prototype.battleArea;
  }