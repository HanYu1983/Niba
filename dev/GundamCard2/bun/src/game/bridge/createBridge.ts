import { Bridge } from "../../script/bridge";
import { GameStateFn } from "../gameState";
import { DefineFn } from "../define";
import { ToolFn } from "../tool";
import { GameExtParams } from "../define/GameExtParams";

export function createBridge(options: GameExtParams): Bridge {
    const bridge: Bridge = {
        GameStateFn: GameStateFn,
        DefineFn: DefineFn,
        ToolFn: ToolFn,
        Options: options,
    }
    return bridge
}