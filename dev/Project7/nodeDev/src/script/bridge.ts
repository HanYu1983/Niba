import { TPlayerID } from "../game/define/PlayerID";
import { GameState } from "../game/gameState/GameState"

export type Bridge = {
    getMyUnitIds(ctx: GameState, playerID: TPlayerID): string[]
}

export type Runtime = {
    getCardID(): string;
    getPlayerID(): TPlayerID;
}