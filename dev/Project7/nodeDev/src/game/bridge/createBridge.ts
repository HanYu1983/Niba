import { Bridge } from "../../script/bridge";
import { GameStateFn } from "../gameState";
import { DefineFn } from "../define";

export function createBridge(): Bridge {
    const bridge: Bridge = {
        GameStateFn: GameStateFn,
        DefineFn: DefineFn
    }
    return bridge
}