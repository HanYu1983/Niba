import { AbsoluteBaSyouFn } from "../game/define/BaSyou";
import { Card } from "../game/define/Card";
import { CommandEffecTipFn } from "../game/define/CommandEffectTip";
import { Effect } from "../game/define/Effect";
import { TipError, TargetMissingError } from "../game/define/GameError";
import { PlayerA } from "../game/define/PlayerID";
import { PhaseFn } from "../game/define/Timing";
import { setActivePlayerID } from "../game/gameState/ActivePlayerComponent";
import { addCards } from "../game/gameState/CardTableComponent";
import { doEffect, createEffectTips, createCommandEffectTips } from "../game/gameState/doEffect";
import { doItemMove } from "../game/gameState/doItemMove";
import { getTopEffect } from "../game/gameState/EffectStackComponent";
import { createGameState, GameState } from "../game/gameState/GameState";
import { createPlayEffects } from "../game/gameState/createPlayEffects";
import { createPlayGEffects } from "../game/gameState/createPlayGEffects";
import { createTextsFromSpecialEffect } from "../game/gameState/createTextsFromSpecialEffect";
import { getItemBaSyou } from "../game/gameState/ItemTableComponent";
import { setPhase } from "../game/gameState/PhaseComponent";
import { doTriggerEvent } from "../game/gameState/doTriggerEvent";
import { loadPrototype } from "../script";

export async function testGain() {
    await loadPrototype("unitBlue")
    let ctx = createGameState()
    const cardA: Card = {
        id: "cardA",
        protoID: "unitBlue"
    }
    ctx = addCards(ctx, AbsoluteBaSyouFn.of(PlayerA, "配備エリア"), [cardA]) as GameState
    const texts = createTextsFromSpecialEffect(ctx, { title: ["特殊型", ["ゲイン"]], id: "" })
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
        throw new Error()
    }
    ctx = doEffect(ctx, effect, 0, 0)
    {
        const effect = getTopEffect(ctx)
        if (effect == null) {
            throw new Error()
        }
        // 推入堆疊的效果有可能需要玩家選對象, 所以會有未選對象錯誤才是正確
        const cets = createCommandEffectTips(ctx, effect).filter(CommandEffecTipFn.not(CommandEffecTipFn.filterNoError))
        if (cets.length != 0) {
            throw new Error()
        }
        // GAIN如果在戰場, 就必須要有選對象錯誤
        ctx = doItemMove(ctx, AbsoluteBaSyouFn.of(PlayerA, "戦闘エリア1"), [cardA.id, getItemBaSyou(ctx, cardA.id)])
        {
            const cets = createCommandEffectTips(ctx, effect).filter(CommandEffecTipFn.not(CommandEffecTipFn.filterNoError))
            if (cets.length != 1) {
                throw new Error()
            }
        }
    }
}