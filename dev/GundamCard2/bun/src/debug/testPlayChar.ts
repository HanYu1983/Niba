import { AbsoluteBaSyouFn } from "../game/define/BaSyou";
import { Card } from "../game/define/Card";
import { TargetMissingError } from "../game/define/GameError";
import { PlayerA } from "../game/define/PlayerID";
import { PhaseFn } from "../game/define/Timing";
import { setActivePlayerID } from "../game/gameState/ActivePlayerComponent";
import { addCards } from "../game/gameState/CardTableComponent";
import { doEffect, createEffectTips, setTipSelectionForUser } from "../game/gameState/doEffect";
import { getTopEffect } from "../game/gameState/EffectStackComponent";
import { createGameState, GameState } from "../game/gameState/GameState";
import { createPlayCardEffects } from "../game/gameState/createPlayCardEffects";
import { setPhase } from "../game/gameState/PhaseComponent";
import { getSetGroupChildren, getSetGroupRoot } from "../game/gameState/SetGroupComponent";
import { doTriggerEvent } from "../game/gameState/doTriggerEvent";
import { loadPrototype } from "../script";

export async function testPlayChar() {
    await loadPrototype("unitBlue")
    await loadPrototype("charBlue")
    let ctx = createGameState()
    const unitBlue: Card = {
        id: "unitBlue",
        protoID: "unitBlue"
    }
    ctx = addCards(ctx, AbsoluteBaSyouFn.of(PlayerA, "配備エリア"), [unitBlue]) as GameState

    const charBlue: Card = {
        id: "charBlue",
        protoID: "charBlue"
    }
    ctx = addCards(ctx, AbsoluteBaSyouFn.of(PlayerA, "手札"), [charBlue]) as GameState
    ctx = setActivePlayerID(ctx, PlayerA) as GameState
    ctx = setPhase(ctx, ["配備フェイズ", "フリータイミング"]) as GameState
    {
        const effects = createPlayCardEffects(ctx, charBlue.id)
        if (effects.length != 2) {
            console.log(effects)
            throw new Error()
        }
        const effect =effects.find(eff=>eff.reason[0] == "PlayCard" && eff.reason[3].isPlayCharacter)
        if(effect == null){
            throw new Error()
        }
        ctx = setTipSelectionForUser(ctx, effect, 0, 0)
        ctx = doEffect(ctx, effect, 0, 0)
    }
    {
        const effect = getTopEffect(ctx)
        if (effect == null) {
            throw new Error()
        }
        ctx = doEffect(ctx, effect, 0, 0)
        if(getSetGroupRoot(ctx, charBlue.id) != unitBlue.id){
            throw new Error()
        }
        // 子樹
        if(getSetGroupChildren(ctx, unitBlue.id).length != 2){
            throw new Error()
        }
        // 子樹
        if(getSetGroupChildren(ctx, charBlue.id).length != 1){
            throw new Error()
        }
        if(getSetGroupRoot(ctx, charBlue.id) != unitBlue.id){
            throw new Error()
        }
    }
}