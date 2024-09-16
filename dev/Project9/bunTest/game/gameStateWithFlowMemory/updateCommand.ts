// 更新命令列表

import { createBridge } from "../bridge/createBridge"
import { CardTextFn, ConditionFn } from "../define/CardText"
import { Effect, EffectFn } from "../define/Effect"
import { TargetMissingError } from "../define/GameError"
import { PlayerA, PlayerB } from "../define/PlayerID"
import { TipFn } from "../define/Tip"
import { getPlayEffects } from "../gameState/getPlayEffects"
import { setCommandEffects } from "./effect"
import { GameStateWithFlowMemory } from "./GameStateWithFlowMemory"

// 使用型技能
export function updateCommand(ctx: GameStateWithFlowMemory): GameStateWithFlowMemory {
    const playerAEffects = getPlayEffects(ctx, PlayerA)
    const playerBEffects = getPlayEffects(ctx, PlayerB)
    const allEffects = [...playerAEffects, ...playerBEffects]
    const bridge = createBridge()
    const testedEffects = allEffects.flatMap(e => {
        if (e.text.logicTreeActions) {
            const testedEffects = e.text.logicTreeActions.flatMap((lta, logicId) => {
                const allTree = CardTextFn.getLogicTreeActionConditions(e.text, lta)
                const allTest = allTree.map((t, logicSubId) => {
                    const errors = Object.values(t).flatMap(con => ConditionFn.getTitleFn(con)(ctx, e, bridge)).map(tip => TipFn.checkTipSatisfies(tip))
                    return [e, logicId, logicSubId, errors] as [Effect, number, number, TargetMissingError[]]
                })
                return allTest
            })
            return testedEffects
        }
        return [] as [Effect, number, number, TargetMissingError[]][]
    })
    const canUseEffects = testedEffects.filter(([_, _2, _3, errors]) => errors.filter(v => v).length == 0).map(([effect]) => effect)
    ctx = setCommandEffects(ctx, canUseEffects) as GameStateWithFlowMemory
    return ctx
}

export function getPlayerCommands(ctx: GameStateWithFlowMemory, playerID: string): Effect[] {
    return ctx.commandEffect.filter(e => EffectFn.getPlayerID(e) == playerID)
}