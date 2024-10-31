import { warnCategory } from "../../tool/logger";
import { AbsoluteBaSyou, AbsoluteBaSyouFn } from "../define/BaSyou";
import { TextSpeicalEffect } from "../define/CardText";
import { GameExtParams } from "../define/GameExtParams";
import { GlobalEffect } from "../define/GlobalEffect";
import { getCardHasSpeicalEffect } from "./card";
import { getCard } from "./CardTableComponent";
import { GameState } from "./GameState";
import { getGlobalEffects, setGlobalEffects } from "./globalEffects";
import { isBattleAtBasyou } from "./IsBattleComponent";
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

// 從快取為主來計算傷害，非快照的部分用來判斷機體是不是還在原位
export function getBattleGroupBattlePoint(
  ctx: GameState,
  unitIds: string[],
  unitIdsFromSnapshot: string[],
  options: GameExtParams
): number {
  if (unitIdsFromSnapshot.length == 0) {
    return 0
  }
  const attackPower = unitIdsFromSnapshot
    .map((cardID, i): number => {
      // 從快照的位置判斷機體還在不在原位, 若不在, 戰鬥力算0
      if (unitIds.includes(cardID) == false) {
        warnCategory("getBattleGroupBattlePoint", `從快照的位置判斷機體還在不在原位, 若不在, 戰鬥力算0: ${cardID}`)
        return 0
      }
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
      const [melee, range, _] = getSetGroupBattlePoint(ctx, cardID, { ges: options.ges })
      // 第一位是格鬥力
      if (i == 0) {
        return melee
      }
      // 其它的是射擊力
      return range
    }).reduce((acc, c) => acc + c, 0);
  const bonus = options.ges?.map(ge => {
    if (ge.title[0] == "このカードの部隊の部隊戦闘力を_＋３する") {
      const times = unitIdsFromSnapshot.filter(unitId => ge.cardIds.includes(unitId)).length
      return ge.title[1] * times
    }
    return 0
  }).reduce((acc, c) => acc + c, 0) || 0
  const opponentBasyou = AbsoluteBaSyouFn.setOpponentPlayerID(getItemBaSyou(ctx, unitIdsFromSnapshot[0]))
  const opponentBattleGroup = getBattleGroup(ctx, opponentBasyou)
  const bonus2 = options.ges?.map(ge => {
    if (ge.title[0] == "このカードと交戦中の敵軍部隊の部隊戦闘力を_－３する") {
      const times = opponentBattleGroup.filter(unitId => ge.cardIds.includes(unitId)).length
      return ge.title[1] * times
    }
    return 0
  }).reduce((acc, c) => acc + c, 0) || 0
  return attackPower + bonus + bonus2;
}

export function isBattleGroupHasA(
  ctx: GameState,
  a: TextSpeicalEffect,
  cardID: string,
  options: GameExtParams
): boolean {
  const baSyou = getItemBaSyou(ctx, cardID);
  const battleGroup = getBattleGroup(ctx, baSyou);
  return battleGroup.some(bg => isSetGroupHasA(ctx, a, bg, { ges: options.ges }))
}

export function isABattleGroup(
  ctx: GameState,
  a: TextSpeicalEffect,
  cardID: string,
  options: GameExtParams
): boolean {
  const baSyou = getItemBaSyou(ctx, cardID);
  const battleGroup = getBattleGroup(ctx, baSyou);
  return battleGroup.every(bg => isSetGroupHasA(ctx, a, bg, { ges: options.ges }))
}