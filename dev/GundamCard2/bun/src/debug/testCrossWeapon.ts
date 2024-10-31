import { AbsoluteBaSyouFn } from "../game/define/BaSyou";
import { Card } from "../game/define/Card";
import { Chip } from "../game/define/Chip";
import { PlayerA } from "../game/define/PlayerID";
import { PhaseFn } from "../game/define/Timing";
import { setActivePlayerID } from "../game/gameState/ActivePlayerComponent";
import { getCardTexts, getItemCharacteristic } from "../game/gameState/card";
import { addCards, getCard } from "../game/gameState/CardTableComponent";
import { addChips, setChipPrototype } from "../game/gameState/ChipTableComponent";
import { assertEffectCanPass, createEffectTips, doEffect, setTipSelectionForUser } from "../game/gameState/doEffect";
import { getTopEffect } from "../game/gameState/EffectStackComponent";
import { createGameState, GameState } from "../game/gameState/GameState";
import { createPlayEffects } from "../game/gameState/createPlayEffects";
import { setPhase } from "../game/gameState/PhaseComponent";
import { doTriggerEvent } from "../game/gameState/doTriggerEvent";
import { loadPrototype } from "../script";
import { TipError } from "../game/define/GameError";
import { TipOrErrorsFn } from "../game/define/CommandEffectTip";
import { getGlobalEffects, setGlobalEffects } from "../game/gameState/globalEffects";
import { mapItemState } from "../game/gameState/ItemStateComponent";

export async function testCrossWeapon() {
    await loadPrototype("unitHasCrossWeaponABC")
    let ctx = createGameState()

    const unitHasCrossWeaponABC: Card = {
        id: "unitHasCrossWeaponABC",
        protoID: "unitHasCrossWeaponABC"
    }
    ctx = addCards(ctx, AbsoluteBaSyouFn.of(PlayerA, "配備エリア"), [unitHasCrossWeaponABC]) as GameState
    const unit2: Chip = {
        id: "unit2",
        protoID: "hasABC"
    }
    ctx = setChipPrototype(ctx, "hasABC", {
        characteristic: "ABC"
    }) as GameState
    ctx = addChips(ctx, AbsoluteBaSyouFn.of(PlayerA, "配備エリア"), [unit2]) as GameState
    if (getItemCharacteristic(ctx, unit2.id) != "ABC") {
        throw new Error()
    }
    ctx = setActivePlayerID(ctx, PlayerA) as GameState
    ctx = setPhase(ctx, ["戦闘フェイズ", "攻撃ステップ", "フリータイミング"]) as GameState
    const playEffects = createPlayEffects(ctx, PlayerA, { ges: getGlobalEffects(ctx, null) })
    if (playEffects.length == 0) {
        throw new Error("")
    }
    {
        const playEffect = playEffects[0]
        if (playEffect.text.description != "（戦闘フェイズ）：［ ］の特徴を持つ自軍ユニット１枚は、ターン終了時まで、このカードの本来のテキスト１つと同じテキストを得る。ただし同じテキストは得られない）") {
            throw new Error()
        }
        ctx = setTipSelectionForUser(ctx, playEffect, 0, 0)
        ctx = doEffect(ctx, playEffect, 0, 0)
        {
            const effect = getTopEffect(ctx)
            if (effect == null) {
                throw new Error()
            }
            ctx = doEffect(ctx, effect, 0, 0)
            let ges = getGlobalEffects(ctx, null)
            ctx = setGlobalEffects(ctx, null, ges)
            if (getCardTexts(ctx, unit2.id, { ges: ges }).find(text => text.title[0] == "特殊型" && text.title[1][0] == "高機動")) {

            } else {
                throw new Error()
            }
            try {
                // 強制清除回合上限旗標
                ctx = mapItemState(ctx, unitHasCrossWeaponABC.id, is => ({ ...is, textIdsUseThisTurn: [], textIdsUseThisCut: [] })) as GameState
                ctx = doEffect(ctx, playEffect, 0, 0)
                throw new Error()
            } catch (e) {
                if (e instanceof TipError && e.info.hasSameText) {
                    console.log(e.message)
                } else {
                    throw e
                }
            }
            const playEffects = createPlayEffects(ctx, PlayerA, { ges: getGlobalEffects(ctx, null) })
            if (playEffects.length != 1) {
                throw new Error()
            }
            {
                const playEffect = playEffects[0]
                if (playEffect.text.description != "（戦闘フェイズ）：［ ］の特徴を持つ自軍ユニット１枚は、ターン終了時まで、このカードの本来のテキスト１つと同じテキストを得る。ただし同じテキストは得られない）") {
                    throw new Error()
                }
                const cets = createEffectTips(ctx, playEffect, 0, 0)
                if (cets.filter(TipOrErrorsFn.filterError).length == 0) {
                    throw new Error()
                }
            }
            ctx = doTriggerEvent(ctx, { title: ["GameEventOnTiming", PhaseFn.getLast()] }, { ges: getGlobalEffects(ctx, null) })
            ges = getGlobalEffects(ctx, null)
            ctx = setGlobalEffects(ctx, null, ges)
            const texts = getCardTexts(ctx, unit2.id, { ges: ges })
            if (texts.find(text => text.title[0] == "特殊型" && text.title[1][0] == "高機動")) {
                console.log(texts)
                throw new Error()
            }
        }
    }
}