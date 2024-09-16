import { Phase, PhaseFn } from "../define/Timing";

export type PhaseComponent = {
    phase: Phase;
}

export function setNextPhase(ctx: PhaseComponent): PhaseComponent {
    return {
        ...ctx,
        phase: PhaseFn.getNext(ctx.phase),
    }
}

export function setPhase(ctx: PhaseComponent, timing: Phase): PhaseComponent {
    return {
        ...ctx,
        phase: timing,
    }
}

export function getPhase(ctx: PhaseComponent): Phase {
    return ctx.phase
}
