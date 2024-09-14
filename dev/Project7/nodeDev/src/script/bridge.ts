import { Effect, EffectFn } from "../game/define/Effect";
import { PlayerID } from "../game/define/PlayerID";
import { ActionTitle } from "../game/define/Text";
import { CardState } from "../game/gameState/CardStateComponent";
import { GameStateFn } from "../game/gameState";

export type Bridge = {
    ctx: any,
    getEffectCardID(effect: Effect): string;
    getEffectPlayerID(effect: Effect): PlayerID;
    getMyUnitIds(playerID: PlayerID): string[]
    getFunctionByAction(action: ActionTitle): (ctx: Bridge, effect: Effect) => Bridge
    cutIn(effect: Effect): Bridge,
    isBattle(cardId: string): boolean;
    getCardState(cardId: string): CardState;
    setCardState(cardId: string, cardState: CardState): Bridge
    EffectFn: typeof EffectFn,
    GameStateFn: typeof GameStateFn,
}