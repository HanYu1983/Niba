import { Bridge } from "../../script/bridge";
import { Effect, EffectFn } from "../define/Effect";
import { PlayerID } from "../define/PlayerID";
import { ActionTitle } from "../define/Text";
import { CardState, CardStateFn } from "./CardStateComponent";
import { getCardIds } from "./CardTableComponent";
import { GameState } from "./GameState";
import { GameStateFn } from ".";

export function createBridge(ctx: GameState): Bridge {
    const bridge: Bridge = {
        ctx: ctx,
        getEffectCardID: function (effect: Effect): string {
            return EffectFn.getCardID(effect);
        },
        getEffectPlayerID: function (effect: Effect): PlayerID {
            return EffectFn.getPlayerID(effect);
        },
        getMyUnitIds: function (playerID: PlayerID): string[] {
            return getCardIds(ctx);
        },
        getFunctionByAction: function (action: ActionTitle): (ctx: Bridge, effect: Effect) => Bridge {
            throw new Error("Function not implemented.");
        },
        cutIn: function (effect: Effect): Bridge {
            throw new Error("Function not implemented.");
        },
        isBattle: function (cardId: string): boolean {
            throw new Error("Function not implemented.");
        },
        getCardState: function (cardId: string): CardState {
            throw new Error("Function not implemented.");
        },
        setCardState: function (cardId: string, cardState: CardState): Bridge {
            throw new Error("Function not implemented.");
        },
        EffectFn: EffectFn,
        GameStateFn: GameStateFn
    }
    return bridge
}