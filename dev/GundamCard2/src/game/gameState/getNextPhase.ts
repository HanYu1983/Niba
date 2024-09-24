import { Phase, PhaseFn } from "../define/Timing";
import { GameState } from "./GameState";
import { getPhase, setPhase } from "./PhaseComponent";
// TODO
// p52 階段跳過
export function getNextPhase(ctx: GameState): Phase {
    const next = PhaseFn.getNext(getPhase(ctx))
    return next
}

export function setNextPhase(ctx: GameState): GameState {
    return setPhase(ctx, getNextPhase(ctx)) as GameState
}