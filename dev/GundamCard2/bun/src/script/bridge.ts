import { GameStateFn } from "../game/gameState";
import { DefineFn } from "../game/define";
import { ToolFn } from "../game/tool";
import { GlobalEffect } from "../game/define/GlobalEffect";
import { GameExtParams } from "../game/define/GameExtParams";

export type Bridge = {
    GameStateFn: typeof GameStateFn,
    DefineFn: typeof DefineFn,
    ToolFn: typeof ToolFn,
    Options: GameExtParams
}