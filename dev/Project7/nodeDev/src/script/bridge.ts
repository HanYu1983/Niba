import { Effect } from "../game/define/Effect";
import { PlayerID } from "../game/define/PlayerID";
import { Action, ActionTitle } from "../game/define/Text";

export type Bridge = {
    ctx: any,
    getEffectCardID(effect: Effect): string;
    getEffectPlayerID(effect: Effect): PlayerID;
    getMyUnitIds(playerID: PlayerID): string[]
    getFunctionByAction(action: ActionTitle): (ctx: Bridge, effect: Effect) => Bridge
    cutIn(effect: Effect): Bridge
}