import { AbsoluteBaSyouFn } from "../game/define/BaSyou";
import { Card } from "../game/define/Card";
import { PlayerA } from "../game/define/PlayerID";
import { PhaseFn } from "../game/define/Timing";
import { setActivePlayerID } from "../game/gameState/ActivePlayerComponent";
import { addCards, getCard } from "../game/gameState/CardTableComponent";
import { doEffect, setTipSelectionForUser } from "../game/gameState/doEffect";
import { getImmediateEffects, getTopEffect } from "../game/gameState/EffectStackComponent";
import { createGameState, GameState } from "../game/gameState/GameState";
import { createPlayEffects } from "../game/gameState/createPlayEffects";
import { getItemState } from "../game/gameState/ItemStateComponent";
import { getItemBaSyou } from "../game/gameState/ItemTableComponent";
import { doItemMove } from "../game/gameState/doItemMove";
import { setPhase } from "../game/gameState/PhaseComponent";
import { doTriggerEvent } from "../game/gameState/doTriggerEvent";
import { loadPrototype } from "../script";
import { getGlobalEffects } from "../game/gameState/globalEffects";

export async function testSupply() {
    await loadPrototype("unit")
    await loadPrototype("unitHasSupply")
    let ctx = createGameState()
    const unit: Card = {
        id: "unit",
        protoID: "unit",
        isRoll: true
    }
    ctx = addCards(ctx, AbsoluteBaSyouFn.of(PlayerA, "配備エリア"), [unit]) as GameState
    const unitHasSupply: Card = {
        id: "unitHasSupply",
        protoID: "unitHasSupply"
    }
    ctx = addCards(ctx, AbsoluteBaSyouFn.of(PlayerA, "配備エリア"), [unitHasSupply]) as GameState
    ctx = setActivePlayerID(ctx, PlayerA) as GameState
    ctx = setPhase(ctx, ["戦闘フェイズ", "攻撃ステップ", "フリータイミング"]) as GameState
    const playEffects = createPlayEffects(ctx, PlayerA, { ges: getGlobalEffects(ctx, null) })
    if (playEffects.length == 0) {
        throw new Error("")
    }
    let effect = playEffects[0]
    ctx = setTipSelectionForUser(ctx, effect, 0, 0)
    ctx = doEffect(ctx, effect, 0, 0)
    let topEffect = getTopEffect(ctx)
    if (topEffect == null) {
        throw new Error()
    }
    effect = topEffect
    if (getCard(ctx, unit.id).isRoll != true) {
        throw new Error()
    }
    ctx = doEffect(ctx, effect, 0, 0)
    if (getCard(ctx, unit.id).isRoll != false) {
        throw new Error()
    }
}