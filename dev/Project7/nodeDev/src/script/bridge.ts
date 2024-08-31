import { Effect, EffectRuntime } from "../game/define/Effect";
import { PlayerID } from "../game/define/PlayerID";
import { Action, ActionTitle } from "../game/define/Text";
import { GameStateWithFlowMemory } from "../game/gameStateWithFlowMemory/GameStateWithFlowMemory";

export type Bridge = {
    getMyUnitIds(ctx: GameStateWithFlowMemory, playerID: PlayerID): string[]
    getFunctionByAction(action: ActionTitle): (ctx: any, runtime: EffectRuntime) => GameStateWithFlowMemory
    cutIn(ctx: GameStateWithFlowMemory, effect: Effect)
}

export type Runtime = {
    getCardID(): string;
    getPlayerID(): PlayerID;
}