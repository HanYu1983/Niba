import { assoc } from "ramda";
import { PlayerState, PlayerStateFn } from "../define/PlayerState";
import { PlayerID } from "../define/PlayerID";

export type PlayerStateComponent = {
    playerStates: { [key: string]: PlayerState };
}

export function getPlayerState(ctx: PlayerStateComponent, playerId: PlayerID): PlayerState {
    return ctx.playerStates[playerId] || { ...PlayerStateFn.identity(), id: playerId };
}

export function setPlayerState(ctx: PlayerStateComponent, playerId: PlayerID, cardState: PlayerState): PlayerStateComponent {
    return { ...ctx, playerStates: assoc(playerId, cardState, ctx.playerStates) }
}