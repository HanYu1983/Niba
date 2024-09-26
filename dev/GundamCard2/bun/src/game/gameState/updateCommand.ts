import { CommandEffectTip, CommandEffecTipFn } from "../define/CommandEffectTip"
import { PlayerA, PlayerB } from "../define/PlayerID"
import { createCommandEffectTips } from "./doEffect"
import { setCommandEffects, setCommandEffectTips } from "./EffectStackComponent"
import { GameState } from "./GameState"
import { getPlayEffects } from "./getPlayEffects"

// 使用型技能
export function updateCommand(ctx: GameState): GameState {
    const playerAEffects = getPlayEffects(ctx, PlayerA)
    const playerBEffects = getPlayEffects(ctx, PlayerB)
    const allEffects = [...playerAEffects, ...playerBEffects]
    const testedEffects = allEffects.flatMap(e => createCommandEffectTips(ctx, e))
    const effects = testedEffects.filter(CommandEffecTipFn.filterEffectDistinct).map(tip => tip.effect)
    ctx = setCommandEffectTips(ctx, testedEffects) as GameState
    ctx = setCommandEffects(ctx, effects) as GameState
    return ctx
}

export function getPlayerCommands(ctx: GameState, playerID: string): CommandEffectTip[] {
    return ctx.commandEffectTips.filter(CommandEffecTipFn.filterPlayerId(playerID))
}

export function getPlayerCommandsFilterNoError(ctx: GameState, playerID: string): CommandEffectTip[] {
    return getPlayerCommands(ctx, playerID).filter(CommandEffecTipFn.filterNoError)
}

export function getPlayerCommandsFilterNoErrorDistinct(ctx: GameState, playerID: string): CommandEffectTip[] {
    return getPlayerCommandsFilterNoError(ctx, playerID).filter(CommandEffecTipFn.filterEffectDistinct)
}
