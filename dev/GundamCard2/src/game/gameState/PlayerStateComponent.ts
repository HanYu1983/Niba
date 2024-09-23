import { assoc } from "ramda";
import { PlayerState, PlayerStateFn } from "../define/PlayerState";
import { PlayerID } from "../define/PlayerID";
import { EventCenterFn } from "./EventCenter";

export type PlayerStateComponent = {
    playerStates: { [key: string]: PlayerState };
}

export function getPlayerState(ctx: PlayerStateComponent, playerId: PlayerID): PlayerState {
    return ctx.playerStates[playerId] || { ...PlayerStateFn.identity(), id: playerId };
}

export function setPlayerState(ctx: PlayerStateComponent, playerId: PlayerID, cardState: PlayerState): PlayerStateComponent {
    const old = getPlayerState(ctx, playerId)
    ctx = { ...ctx, playerStates: assoc(playerId, cardState, ctx.playerStates) }
    ctx = EventCenterFn.onPlayerStateChange(ctx, old, getPlayerState(ctx, playerId))
    return ctx
}

export function mapPlayerState(ctx: PlayerStateComponent, playerId: PlayerID, fn: (itemState: PlayerState) => PlayerState): PlayerStateComponent {
    const old = getPlayerState(ctx, playerId)
    const curr = fn(old)
    ctx = setPlayerState(ctx, playerId, curr)
    return ctx
}