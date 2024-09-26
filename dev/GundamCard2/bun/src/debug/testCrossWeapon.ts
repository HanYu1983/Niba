import { AbsoluteBaSyouFn } from "../game/define/BaSyou";
import { Card } from "../game/define/Card";
import { Chip } from "../game/define/Chip";
import { PlayerA } from "../game/define/PlayerID";
import { PhaseFn } from "../game/define/Timing";
import { setActivePlayerID } from "../game/gameState/ActivePlayerComponent";
import { getCardTexts, getItemCharacteristic } from "../game/gameState/card";
import { addCards, getCard } from "../game/gameState/CardTableComponent";
import { addChips, setChipPrototype } from "../game/gameState/ChipTableComponent";
import { assertEffectCanPass, doEffect, onMoveItem, setTipSelectionForUser } from "../game/gameState/doEffect";
import { getTopEffect } from "../game/gameState/EffectStackComponent";
import { createGameState, GameState } from "../game/gameState/GameState";
import { getPlayEffects } from "../game/gameState/getPlayEffects";
import { setPhase } from "../game/gameState/PhaseComponent";
import { triggerEvent } from "../game/gameState/triggerEvent";
import { loadPrototype } from "../script";

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


    const playEffects = getPlayEffects(ctx, PlayerA)
    if (playEffects.length == 0) {
        throw new Error("")
    }
    {
        const effect = playEffects[0]
        console.log(`do: ${effect.description}`)
        ctx = setTipSelectionForUser(ctx, effect, 0, 0)
        ctx = doEffect(ctx, effect, 0, 0)
    }
    {
        const effect = getTopEffect(ctx)
        if (effect == null) {
            throw new Error()
        }
        console.log(`do: ${effect.description}`)
        ctx = doEffect(ctx, effect, 0, 0)
        if(getCardTexts(ctx, unit2.id).find(text=>text.title[0] == "特殊型" && text.title[1][0] == "高機動")){

        } else{
            throw new Error()
        }
        ctx = triggerEvent(ctx, {title: ["GameEventOnTiming", PhaseFn.getLast()]})
        if(getCardTexts(ctx, unit2.id).find(text=>text.title[0] == "特殊型" && text.title[1][0] == "高機動")){
            throw new Error()
        }
    }
}