import { AbsoluteBaSyouFn } from "../game/define/BaSyou";
import { Card } from "../game/define/Card";
import { TipError, TargetMissingError } from "../game/define/GameError";
import { PlayerA, PlayerB } from "../game/define/PlayerID";
import { PhaseFn } from "../game/define/Timing";
import { setActivePlayerID } from "../game/gameState/ActivePlayerComponent";
import { addCards } from "../game/gameState/CardTableComponent";
import { doEffect, createEffectTips } from "../game/gameState/doEffect";
import { createGameState, GameState } from "../game/gameState/GameState";
import { createPlayEffects } from "../game/gameState/createPlayEffects";
import { getItemBaSyou } from "../game/gameState/ItemTableComponent";
import { setPhase } from "../game/gameState/PhaseComponent";
import { doTriggerEvent } from "../game/gameState/doTriggerEvent";
import { loadPrototype } from "../script";
import { createPlayGEffect } from "../game/gameState/createPlayCardEffects";

export async function testPlayG() {
    await loadPrototype("unitBlue")
    let ctx = createGameState()
    const unitBlue: Card = {
        id: "unitBlue",
        protoID: "unitBlue"
    }
    ctx = addCards(ctx, AbsoluteBaSyouFn.of(PlayerA, "手札"), [unitBlue]) as GameState

    const unitBlue2: Card = {
        id: "unitBlue2",
        protoID: "unitBlue"
    }
    ctx = addCards(ctx, AbsoluteBaSyouFn.of(PlayerA, "手札"), [unitBlue2]) as GameState
    ctx = setActivePlayerID(ctx, PlayerA) as GameState
    ctx = setPhase(ctx, ["配備フェイズ", "フリータイミング"]) as GameState
    const storedCtx = JSON.parse(JSON.stringify(ctx))
    {
        ctx = setActivePlayerID(ctx, PlayerB) as GameState
        const effects = createPlayEffects(ctx, PlayerA)
        if(effects.length != 0){
            throw new Error()
        }
    }
    ctx = storedCtx
    {

        const effects = createPlayEffects(ctx, PlayerA)
        if (effects.length != 4) {
            throw new Error()
        }
    }
    {
        const effect = createPlayGEffect(ctx, unitBlue.id)
        ctx = doEffect(ctx, effect, 0, 0)
        if (AbsoluteBaSyouFn.getBaSyouKeyword(getItemBaSyou(ctx, unitBlue.id)) == "Gゾーン") {

        } else {
            throw new Error()
        }
    }
    {
        const effect = createPlayGEffect(ctx, unitBlue2.id)
        const toes = createEffectTips(ctx, effect, 0, 0)
        if(toes.flatMap(toe=>toe.errors).length == 0){
            throw new Error()
        }
        try {
            ctx = doEffect(ctx, effect, 0, 0)
            throw new Error()
        } catch (e) {
            if (e instanceof TipError) {
                if (e.info.isPlayGLimit) {

                } else {
                    throw e
                }
            } else {
                throw e
            }
        }
    }
    {
        ctx = doTriggerEvent(ctx, { title: ["GameEventOnTiming", PhaseFn.getLast()] })
        const effect = createPlayGEffect(ctx, unitBlue2.id)
        ctx = doEffect(ctx, effect, 0, 0)
        if (AbsoluteBaSyouFn.getBaSyouKeyword(getItemBaSyou(ctx, unitBlue2.id)) == "Gゾーン") {

        } else {
            throw new Error()
        }
    }
}