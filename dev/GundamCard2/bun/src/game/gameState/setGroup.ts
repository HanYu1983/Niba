import { pipe, always, map, reduce } from "ramda";
import { BattlePointFn } from "../define/BattlePoint";
import { BattleBonus, TextSpeicalEffect } from "../define/CardText";
import { getCardBattlePoint, getCardHasSpeicalEffect } from "./card";
import { GameState } from "./GameState";
import { getSetGroupChildren } from "./SetGroupComponent";
import { getBattleGroup } from "./battleGroup";
import { getItemBaSyou } from "./ItemTableComponent";
import { GlobalEffect } from "../define/GlobalEffect";
import { GameExtParams } from "../define/GameExtParams";

// setgroup
export function getSetGroupBattlePoint(ctx: GameState, cardId: string, options: GameExtParams): BattleBonus {
    return pipe(
        always(getSetGroupChildren(ctx, cardId)),
        map(setGroupCardID => getCardBattlePoint(ctx, setGroupCardID, { ges: options.ges })),
        reduce(BattlePointFn.add, BattlePointFn.getAllStar()),
        BattlePointFn.toBattleBonus
    )()
}

export function isSetGroupHasA(
    ctx: GameState,
    a: TextSpeicalEffect,
    cardId: string,
    options: { ges?: GlobalEffect[] }
): boolean {
    const setGroupCards = getSetGroupChildren(ctx, cardId);
    return setGroupCards.some(cardId => getCardHasSpeicalEffect(ctx, a, cardId, { ges: options.ges }))
}

export function isMeleeUnit(ctx: GameState, itemId: string, options: { ges?: GlobalEffect[] }): boolean {
    const [atk, range, hp] = getSetGroupBattlePoint(ctx, itemId, { ges: options.ges })
    if (range == 0 && atk > 0) {
        return true
    }
    if (atk - range >= 2) {
        return true
    }
    return false
}

export function isRangeUnit(ctx: GameState, itemId: string, options: { ges?: GlobalEffect[] }): boolean {
    const [atk, range, hp] = getSetGroupBattlePoint(ctx, itemId, { ges: options.ges })
    if (range == 0) {
        return false
    }
    return isMeleeUnit(ctx, itemId, { ges: options.ges }) == false
}