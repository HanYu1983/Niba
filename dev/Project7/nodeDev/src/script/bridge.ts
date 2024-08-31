import { PlayerID } from "../game/define/PlayerID";
import { GameState } from "../game/gameState/GameState"

export type Bridge = {
    getMyUnitIds(ctx: GameState, playerID: PlayerID): string[]
}

export type Runtime = {
    getCardID(): string;
    getPlayerID(): PlayerID;
}