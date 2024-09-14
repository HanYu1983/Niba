import { GameStateFn } from "../game/gameState";
import { DefineFn } from "../game/define";

export type Bridge = {
    GameStateFn: typeof GameStateFn,
    DefineFn: typeof DefineFn,
}