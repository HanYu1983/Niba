import { AbsoluteBaSyouFn } from "../game/define/BaSyou";
import { Card } from "../game/define/Card";
import { TargetMissingError } from "../game/define/GameError";
import { PlayerA } from "../game/define/PlayerID";
import { PhaseFn } from "../game/define/Timing";
import { setActivePlayerID } from "../game/gameState/ActivePlayerComponent";
import { addCards } from "../game/gameState/CardTableComponent";
import { doEffect, getEffectTips, setTipSelectionForUser } from "../game/gameState/effect";
import { getTopEffect } from "../game/gameState/EffectStackComponent";
import { createGameState, GameState } from "../game/gameState/GameState";
import { getPlayCardEffects } from "../game/gameState/getPlayCardEffect";
import { getPlayEffects } from "../game/gameState/getPlayEffects";
import { getPlayGEffects } from "../game/gameState/getPlayGEffect";
import { getItemBaSyou } from "../game/gameState/ItemTableComponent";
import { setPhase } from "../game/gameState/PhaseComponent";
import { getSetGroupChildren, getSetGroupRoot } from "../game/gameState/SetGroupComponent";
import { triggerEvent } from "../game/gameState/triggerEvent";
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
        const effects = getPlayCardEffects(ctx, charBlue.id)
        if (effects.length != 1) {
            throw new Error()
        }
        const effect =effects[0]
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