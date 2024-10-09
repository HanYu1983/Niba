import { AbsoluteBaSyou, AbsoluteBaSyouFn } from "../define/BaSyou";
import { TextSpeicalEffect } from "../define/CardText";
import { getCardHasSpeicalEffect } from "./card";
import { getCard } from "./CardTableComponent";
import { GameState } from "./GameState";
import { getGlobalEffects, setGlobalEffects } from "./globalEffects";
import { getItemState } from "./ItemStateComponent";
import { getItemIdsByBasyou, getItemBaSyou } from "./ItemTableComponent";
import { getSetGroupBattlePoint, isSetGroupHasA } from "./setGroup";
import { getSetGroupRoot, getSetGroupChildren } from "./SetGroupComponent";

// battleGroup
export function getBattleGroup(
  ctx: GameState,
  baSyou: AbsoluteBaSyou
): string[] {
  return getItemIdsByBasyou(ctx, baSyou).filter((cardId) => {
    return getSetGroupRoot(ctx, cardId) == cardId;
  })
}

export function getBattleGroupBattlePoint(
  ctx: GameState,
  unitCardIDs: string[]
): number {
  if (unitCardIDs.length == 0) {
    return 0
  }
  const attackPower = unitCardIDs
    .map((cardID, i): number => {
      // 破壞的單位沒有攻擊力
      const cs = getItemState(ctx, cardID);
      if (cs.destroyReason != null) {
        return 0;
      }
      const card = getCard(ctx, cardID);
      if (card == null) {
        throw new Error("card not found");
      }
      // 横置的單位沒有攻擊力
      if (card.isRoll) {
        return 0;
      }
      const [melee, range, _] = getSetGroupBattlePoint(ctx, cardID)
      // 第一位是格鬥力
      if (i == 0) {
        return melee
      }
      // 其它的是射擊力
      return range
    }).reduce((acc, c) => acc + c, 0);
  const ges = getGlobalEffects(ctx, null)
  ctx = setGlobalEffects(ctx, null, ges)
  const bonus = ges.map(ge => {
    if (ge.title[0] == "このカードの部隊の部隊戦闘力を_＋３する") {
      const times = unitCardIDs.filter(unitId => ge.cardIds.includes(unitId)).length
      return ge.title[1] * times
    }
    return 0
  }).reduce((acc, c) => acc + c, 0)
  const opponentBasyou = AbsoluteBaSyouFn.setOpponentPlayerID(getItemBaSyou(ctx, unitCardIDs[0]))
  const opponentBattleGroup = getBattleGroup(ctx, opponentBasyou)
  const bonus2 = ges.map(ge => {
    if (ge.title[0] == "このカードと交戦中の敵軍部隊の部隊戦闘力を_－３する") {

      const times = opponentBattleGroup.filter(unitId => ge.cardIds.includes(unitId)).length
      console.log("XXX", times, ge.cardIds, opponentBattleGroup)
      return ge.title[1] * times
    }
    return 0
  }).reduce((acc, c) => acc + c, 0)
  return attackPower + bonus + bonus2;
}

export function isBattleGroupHasA(
  ctx: GameState,
  a: TextSpeicalEffect,
  cardID: string
): boolean {
  const baSyou = getItemBaSyou(ctx, cardID);
  const battleGroup = getBattleGroup(ctx, baSyou);
  return battleGroup.some(bg => isSetGroupHasA(ctx, a, bg))
}