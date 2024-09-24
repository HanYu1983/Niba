import { PlayerID } from "../define/PlayerID";

export type ActivePlayerComponent = {
    activePlayerID: string | null;
}

export function setActivePlayerID(ctx: ActivePlayerComponent, playerId: PlayerID): ActivePlayerComponent {
    return {
        ...ctx,
        activePlayerID: playerId
    }
}

export function getActivePlayerID(ctx: ActivePlayerComponent): PlayerID {
    if (ctx.activePlayerID == null) {
        throw new Error(`activePlayerID not set yet`)
    }
    return ctx.activePlayerID
}