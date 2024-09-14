import { Bridge } from "../../script/bridge";
import { GameStateFn } from "../gameState";
import { DefineFn } from "../define";
import { ToolFn } from "../tool";

export function createBridge(): Bridge {
    const bridge: Bridge = {
        GameStateFn: GameStateFn,
        DefineFn: DefineFn,
        ToolFn: ToolFn,
    }
    return bridge
}