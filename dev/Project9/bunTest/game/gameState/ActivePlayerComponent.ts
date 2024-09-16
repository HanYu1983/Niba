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