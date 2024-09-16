import { pipe, always, map, reduce } from "ramda";
import { BattlePointFn } from "../define/BattlePoint";
import { BattleBonus } from "../define/CardText";
import { getCardBattlePoint } from "./card";
import { GameState } from "./GameState";
import { getSetGroupCards } from "./SetGroupComponent";

// setgroup
export function getSetGroupBattlePoint(ctx: GameState, cardId: string): BattleBonus {
    return pipe(
      always(getSetGroupCards(ctx, cardId)),
      map(setGroupCardID => getCardBattlePoint(ctx, setGroupCardID)),
      reduce(BattlePointFn.add, BattlePointFn.getAllStar()),
      BattlePointFn.toBattleBonus
    )()
  }