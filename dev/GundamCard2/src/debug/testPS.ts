import { AbsoluteBaSyouFn } from "../game/define/BaSyou";
import { Card } from "../game/define/Card";
import { PlayerA } from "../game/define/PlayerID";
import { PhaseFn } from "../game/define/Timing";
import { setActivePlayerID } from "../game/gameState/ActivePlayerComponent";
import { addCards, getCard } from "../game/gameState/CardTableComponent";
import { doEffect, onMoveItem, setTipSelectionForUser } from "../game/gameState/effect";
import { getTopEffect } from "../game/gameState/EffectStackComponent";
import { createGameState, GameState } from "../game/gameState/GameState";
import { getPlayEffects } from "../game/gameState/getPlayEffects";
import { getItemState } from "../game/gameState/ItemStateComponent";
import { getItemBaSyou } from "../game/gameState/ItemTableComponent";
import { moveCardLikeItem } from "../game/gameState/moveCardLikeItem";
import { setPhase } from "../game/gameState/PhaseComponent";
import { triggerEvent } from "../game/gameState/triggerEvent";
import { loadPrototype } from "../script";

export async function testPS() {
    await loadPrototype("unitHasPS")
    await loadPrototype("unitHasSupply")
    let ctx = createGameState()
    const unitHasPS: Card = {
        id: "unitHasPS",
        protoID: "unitHasPS"
    }
    ctx = addCards(ctx, AbsoluteBaSyouFn.of(PlayerA, "手札"), [unitHasPS]) as GameState
    const unitHasSupply: Card = {
        id: "unitHasSupply",
        protoID: "unitHasSupply"
    }
    ctx = addCards(ctx, AbsoluteBaSyouFn.of(PlayerA, "手札"), [unitHasSupply]) as GameState
    ctx = setActivePlayerID(ctx, PlayerA) as GameState
    ctx = setPhase(ctx, ["配備フェイズ", "フリータイミング"]) as GameState
    const playEffects = getPlayEffects(ctx, PlayerA)
    if (playEffects.length == 0) {
        throw new Error("")
    }
    {
        const effect = playEffects[0]
        console.log(`do: ${effect.description}`)
        ctx = doEffect(ctx, effect, 0, 0)
        if (AbsoluteBaSyouFn.getBaSyouKeyword(getItemBaSyou(ctx, unitHasPS.id)) != "プレイされているカード") {
            throw new Error("")
        }
    }
    {
        const effect = getTopEffect(ctx)
        if (effect == null) {
            throw new Error("")
        }
        ctx = doEffect(ctx, effect, 0, 0)
        if (AbsoluteBaSyouFn.getBaSyouKeyword(getItemBaSyou(ctx, unitHasPS.id)) != "配備エリア") {
            throw new Error("")
        }
        if (getCard(ctx, unitHasPS.id).isRoll) {
            throw new Error("")
        }
    }
    {
        ctx = moveCardLikeItem(ctx, AbsoluteBaSyouFn.of(PlayerA, "戦闘エリア1"), [unitHasPS.id, getItemBaSyou(ctx, unitHasPS.id)])
        if (getItemState(ctx, unitHasPS.id).flags["return"] == null) {
            throw new Error("")
        }
        let ctx2 = JSON.parse(JSON.stringify(ctx))
        ctx2 = triggerEvent(ctx2, {
            title: ["GameEventOnTiming", PhaseFn.getFirst()]
        })
        if (getItemState(ctx2, unitHasPS.id).flags["return"]) {
            throw new Error("")
        }
        if (AbsoluteBaSyouFn.getBaSyouKeyword(getItemBaSyou(ctx2, unitHasPS.id)) != "手札") {
            throw new Error("")
        }
    }
    {
        if (getItemState(ctx, unitHasPS.id).flags["return"] != true) {
            throw new Error("")
        }
        ctx = moveCardLikeItem(ctx, AbsoluteBaSyouFn.of(PlayerA, "戦闘エリア1"), [unitHasSupply.id, getItemBaSyou(ctx, unitHasSupply.id)])
        if (getItemState(ctx, unitHasPS.id).flags["return"]) {
            throw new Error("")
        }
        let ctx2 = JSON.parse(JSON.stringify(ctx))
        ctx2 = triggerEvent(ctx2, {
            title: ["GameEventOnTiming", PhaseFn.getFirst()]
        })
        if (AbsoluteBaSyouFn.getBaSyouKeyword(getItemBaSyou(ctx2, unitHasPS.id)) != "戦闘エリア1") {
            throw new Error("")
        }
    }
}