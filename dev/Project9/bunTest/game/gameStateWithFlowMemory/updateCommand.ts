import { createBridge } from "../bridge/createBridge"
import { CardTextFn, ConditionFn } from "../define/CardText"
import { Effect, EffectFn } from "../define/Effect"
import { PlayerA, PlayerB } from "../define/PlayerID"
import { TipFn } from "../define/Tip"
import { getConditionTitleFn } from "../gameState/effect"
import { getPlayEffects } from "../gameState/getPlayEffects"
import { ToolFn } from "../tool"
import { setCommandEffects } from "./effect"
import { CommandEffectTip, GameStateWithFlowMemory } from "./GameStateWithFlowMemory"

export function getCommandEffectTips(ctx: GameStateWithFlowMemory, e: Effect): CommandEffectTip[] {
    const bridge = createBridge()
    if (e.text.logicTreeActions) {
        const testedEffects = e.text.logicTreeActions.flatMap((lta, logicId) => {
            const allTree = CardTextFn.getLogicTreeActionConditions(e.text, lta)
            const allTest = allTree.map((t, logicSubId) => {
                const errors = Object.values(t).flatMap(con => getConditionTitleFn(con, {})(ctx, e, bridge)).map(tip => TipFn.checkTipSatisfies(tip))
                const ret: CommandEffectTip = {
                    id: ToolFn.getUUID("getCommandEffectTip"),
                    effect: e,
                    logicID: logicId,
                    logicSubID: logicSubId,
                    errors: errors
                }
                return ret
            })
            return allTest
        })
        return testedEffects
    }
    return []
}

// 使用型技能
export function updateCommand(ctx: GameStateWithFlowMemory): GameStateWithFlowMemory {
    const playerAEffects = getPlayEffects(ctx, PlayerA)
    const playerBEffects = getPlayEffects(ctx, PlayerB)
    const allEffects = [...playerAEffects, ...playerBEffects]
    const testedEffects = allEffects.flatMap(e => getCommandEffectTips(ctx, e))
    ctx = setCommandEffects(ctx, testedEffects) as GameStateWithFlowMemory
    return ctx
}

export function getPlayerCommands(ctx: GameStateWithFlowMemory, playerID: string): CommandEffectTip[] {
    return ctx.commandEffectTips.filter(e => EffectFn.getPlayerID(e.effect) == playerID)
}

export function getPlayerCommandsFilterNoError(ctx: GameStateWithFlowMemory, playerID: string): CommandEffectTip[] {
    return getPlayerCommands(ctx, playerID).filter(({ errors }) => errors.filter(v => v).length == 0)
}

export function getPlayerCommandsFilterNoErrorDistinct(ctx: GameStateWithFlowMemory, playerID: string): CommandEffectTip[] {
    return getPlayerCommandsFilterNoError(ctx, playerID).filter((command, index, self) =>
        index === self.findIndex(c => c.effect.id === command.effect.id)
    )
}