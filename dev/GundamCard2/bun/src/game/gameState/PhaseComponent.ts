import { Phase, PhaseFn } from "../define/Timing";
import { EventCenterFn } from "./EventCenter";

export type PhaseComponent = {
    phase: Phase;
}

export function setPhase(ctx: PhaseComponent, timing: Phase): PhaseComponent {
    const old = ctx.phase
    ctx = {
        ...ctx,
        phase: timing,
    }
    ctx = EventCenterFn.onSetPhase(ctx, old, ctx.phase)
    return ctx
}

export function getPhase(ctx: PhaseComponent): Phase {
    return ctx.phase
}
