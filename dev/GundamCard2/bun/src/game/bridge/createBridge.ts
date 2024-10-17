import { Bridge } from "../../script/bridge";
import { GameStateFn } from "../gameState";
import { DefineFn } from "../define";
import { ToolFn } from "../tool";
import { GlobalEffect } from "../define/GlobalEffect";

export function createBridge(options: { ges?: GlobalEffect[] }): Bridge {
    const bridge: Bridge = {
        GameStateFn: GameStateFn,
        DefineFn: DefineFn,
        ToolFn: ToolFn,
        Options: options,
    }
    return bridge
}