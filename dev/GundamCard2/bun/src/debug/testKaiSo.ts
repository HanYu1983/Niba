import { AbsoluteBaSyouFn } from "../game/define/BaSyou";
import { Card } from "../game/define/Card";
import { CommandEffecTipFn } from "../game/define/CommandEffectTip";
import { Effect } from "../game/define/Effect";
import { TipError, TargetMissingError } from "../game/define/GameError";
import { PlayerA } from "../game/define/PlayerID";
import { PhaseFn } from "../game/define/Timing";
import { setActivePlayerID } from "../game/gameState/ActivePlayerComponent";
import { addCards, createCardWithProtoIds, getCard } from "../game/gameState/CardTableComponent";
import { doEffect, createEffectTips, createCommandEffectTips, setTipSelectionForUser } from "../game/gameState/doEffect";
import { doItemMove } from "../game/gameState/doItemMove";
import { getTopEffect } from "../game/gameState/EffectStackComponent";
import { createGameState, GameState } from "../game/gameState/GameState";
import { createPlayEffects } from "../game/gameState/createPlayEffects";
import { createPlayGEffects } from "../game/gameState/createPlayGEffects";
import { createTextsFromSpecialEffect } from "../game/gameState/createTextsFromSpecialEffect";
import { getItemBaSyou, getItemIdsByBasyou } from "../game/gameState/ItemTableComponent";
import { setPhase } from "../game/gameState/PhaseComponent";
import { doTriggerEvent } from "../game/gameState/doTriggerEvent";
import { loadPrototype } from "../script";

export async function testKaiSo() {
    await loadPrototype("unitHasKaiSo")
    let ctx = createGameState()
    const cardA: Card = {
        id: "cardA",
        protoID: "unitHasKaiSo",
        isRoll: true,
    }
    ctx = addCards(ctx, AbsoluteBaSyouFn.of(PlayerA, "配備エリア"), [cardA]) as GameState
    const cardB: Card = {
        id: "cardB",
        protoID: "unitHasKaiSo"
    }
    ctx = addCards(ctx, AbsoluteBaSyouFn.of(PlayerA, "手札"), [cardB]) as GameState
    ctx = setPhase(ctx, ["戦闘フェイズ", "攻撃ステップ", "フリータイミング"]) as GameState
    let effects = createPlayEffects(ctx, PlayerA)
    if (effects.length != 1) {
        throw new Error()
    }
    let effect = effects[0]
    ctx = setTipSelectionForUser(ctx, effect, 0, 0)
    ctx = doEffect(ctx, effect, 0, 0)
    let top = getTopEffect(ctx)
    if (top == null) {
        throw new Error()
    }
    effect = top
    if (getCard(ctx, cardA.id).isRoll != true) {
        throw new Error()
    }
    ctx = doEffect(ctx, effect, 0, 0)
    // cardA必須在原位(只置換protoID)
    if (getItemBaSyou(ctx, cardA.id).value[1] != "配備エリア") {
        throw new Error()
    }
    // cardA被重置
    if (getCard(ctx, cardA.id).isRoll != false) {
        throw new Error()
    }
    // cardB被廢棄
    if (getItemBaSyou(ctx, cardB.id).value[1] != "ジャンクヤード") {
        throw new Error()
    }
}