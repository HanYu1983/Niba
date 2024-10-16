import { AbsoluteBaSyouFn } from "../game/define/BaSyou";
import { Card } from "../game/define/Card";
import { CommandEffecTipFn } from "../game/define/CommandEffectTip";
import { Effect } from "../game/define/Effect";
import { TipError, TargetMissingError } from "../game/define/GameError";
import { PlayerA } from "../game/define/PlayerID";
import { PhaseFn } from "../game/define/Timing";
import { setActivePlayerID } from "../game/gameState/ActivePlayerComponent";
import { addCards, createCardWithProtoIds } from "../game/gameState/CardTableComponent";
import { doEffect, createEffectTips, createCommandEffectTips, setTipSelectionForUser } from "../game/gameState/doEffect";
import { doItemMove } from "../game/gameState/doItemMove";
import { getImmediateEffects, getTopEffect, removeEffect } from "../game/gameState/EffectStackComponent";
import { createGameState, GameState } from "../game/gameState/GameState";
import { createTextsFromSpecialEffect } from "../game/gameState/createTextsFromSpecialEffect";
import { getItemBaSyou } from "../game/gameState/ItemTableComponent";
import { setPhase } from "../game/gameState/PhaseComponent";
import { doTriggerEvent } from "../game/gameState/doTriggerEvent";
import { loadPrototype } from "../script";
import { getSetGroupBattlePoint } from "../game/gameState/setGroup";
import { getGlobalEffects } from "../game/gameState/globalEffects";
import { BattlePointFn } from "../game/define/BattlePoint";

export async function testGain() {
    await loadPrototype("unitBlue")
    let ctx = createGameState()
    const cardA: Card = {
        id: "cardA",
        protoID: "unitBlue"
    }
    ctx = addCards(ctx, AbsoluteBaSyouFn.of(PlayerA, "戦闘エリア1"), [cardA]) as GameState
    ctx = createCardWithProtoIds(ctx, AbsoluteBaSyouFn.of(PlayerA, "本国"), ["unitBlue"]) as GameState
    const texts = createTextsFromSpecialEffect({ title: ["特殊型", ["ゲイン"]], id: "" }, { cardId: cardA.id })
    if (texts.length == 0) {
        throw new Error()
    }
    const text = texts[0]
    const effect: Effect = {
        id: "",
        reason: ["PlayText", PlayerA, cardA.id, text.id],
        text: text
    }
    const cets = createCommandEffectTips(ctx, effect).filter(CommandEffecTipFn.filterNoError)
    if (cets.length != 1) {
        console.log(createCommandEffectTips(ctx, effect).map(cet => cet.tipOrErrors))
        throw new Error()
    }
    ctx = doEffect(ctx, effect, 0, 0)
    {
        const effect = getTopEffect(ctx)
        if (effect == null) {
            throw new Error()
        }
        ctx = doEffect(ctx, effect, 0, 0)
        for (let i = 0; i < 10; ++i) {
            const effect = getImmediateEffects(ctx)[0]
            if (effect) {
                ctx = setTipSelectionForUser(ctx, effect, 0, 0)
                ctx = doEffect(ctx, effect, 0, 0)
                ctx = removeEffect(ctx, effect.id) as GameState
            } else {
                break
            }
        }
    }
    if (BattlePointFn.eq([1, 1, 1], getSetGroupBattlePoint(ctx, cardA.id, { ges: getGlobalEffects(ctx, null) })) != true) {
        throw new Error()
    }
}