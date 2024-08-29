import { PlayerID } from "../game/define"
import { GameState } from "../game/gameState/GameState"

export type Bridge = {
    getMyUnitIds(ctx: GameState, playerID: PlayerID): string[]
}

export type Runtime = {
    getCardID(): string;
    getPlayerID(): PlayerID;
}