import { CommandEffectTip, CommandEffecTipFn } from "../define/CommandEffectTip"
import { Effect, EffectFn } from "../define/Effect"
import { PlayerA, PlayerB } from "../define/PlayerID"
import { createCommandEffectTips, getConditionTitleFn } from "../gameState/effect"
import { getPlayEffects } from "../gameState/getPlayEffects"
import { setCommandEffects, setCommandEffectTips } from "./effect"
import { GameStateWithFlowMemory } from "./GameStateWithFlowMemory"

// 使用型技能
export function updateCommand(ctx: GameStateWithFlowMemory): GameStateWithFlowMemory {
    const playerAEffects = getPlayEffects(ctx, PlayerA)
    const playerBEffects = getPlayEffects(ctx, PlayerB)
    const allEffects = [...playerAEffects, ...playerBEffects]
    const testedEffects = allEffects.flatMap(e => createCommandEffectTips(ctx, e))
    ctx = setCommandEffectTips(ctx, testedEffects) as GameStateWithFlowMemory
    ctx = setCommandEffects(ctx, testedEffects.filter((command, index, self) =>
        index === self.findIndex(c => c.effect.id === command.effect.id)
    ).map(tip => tip.effect))
    return ctx
}

export function getPlayerCommands(ctx: GameStateWithFlowMemory, playerID: string): CommandEffectTip[] {
    return ctx.commandEffectTips.filter(CommandEffecTipFn.filterPlayerId(playerID))
}

export function getPlayerCommandsFilterNoError(ctx: GameStateWithFlowMemory, playerID: string): CommandEffectTip[] {
    return getPlayerCommands(ctx, playerID).filter(CommandEffecTipFn.filterNoError)
}

export function getPlayerCommandsFilterNoErrorDistinct(ctx: GameStateWithFlowMemory, playerID: string): CommandEffectTip[] {
    return getPlayerCommandsFilterNoError(ctx, playerID).filter(CommandEffecTipFn.filterEffectDistinct)
}
