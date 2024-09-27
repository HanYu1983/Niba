import { createBridge } from "../game/bridge/createBridge";
import { AbsoluteBaSyouFn } from "../game/define/BaSyou";
import { Card } from "../game/define/Card";
import { EffectFn } from "../game/define/Effect";
import { ItemStateFn } from "../game/define/ItemState";
import { PlayerA } from "../game/define/PlayerID";
import { setActivePlayerID } from "../game/gameState/ActivePlayerComponent";
import { addCards, createCardWithProtoIds, getCard } from "../game/gameState/CardTableComponent";
import { createEffectTips, doEffect, setTipSelectionForUser } from "../game/gameState/doEffect";
import { createGameState, GameState } from "../game/gameState/GameState";
import { createPlayCardEffects } from "../game/gameState/createPlayCardEffects";
import { mapItemState } from "../game/gameState/ItemStateComponent";
import { getItemIdsByBasyou } from "../game/gameState/ItemTableComponent";
import { setPhase } from "../game/gameState/PhaseComponent";
import { loadPrototype } from "../script";

export async function test179015_04B_U_BK058R_black() {
    await loadPrototype("179015_04B_U_BK058R_black")
    await loadPrototype("unitBlack")
    const cardA: Card = {
        id: "cardA",
        protoID: "179015_04B_U_BK058R_black"
    }
    let ctx = createGameState()
    ctx = addCards(ctx, AbsoluteBaSyouFn.of(PlayerA, "手札"), [cardA]) as GameState
    ctx = createCardWithProtoIds(ctx, AbsoluteBaSyouFn.of(PlayerA, "Gゾーン"), ["unitBlack", "unitBlack", "unitBlack", "unitBlack"]) as GameState
    ctx = setActivePlayerID(ctx, PlayerA) as GameState
    ctx = setPhase(ctx, ["配備フェイズ", "フリータイミング"]) as GameState
    const effects = createPlayCardEffects(ctx, cardA.id)
    if (effects.length == 0) {
        throw new Error()
    }
    {
        const effect = effects[0]
        const tipOrErrors = createEffectTips(ctx, effect, 0, 0, { isCheckUserSelection: true })
        const toes = tipOrErrors.filter(toe => toe.errors.length != 0)
        toes.forEach(info => {
            const tip = info.tip
            if (tip) {
                ctx = mapItemState(ctx, EffectFn.getCardID(effect), is => ItemStateFn.setTip(is, info.conditionKey, tip)) as GameState
            }
        })
        ctx = doEffect(ctx, effect, 0, 0)
        if (getItemIdsByBasyou(ctx, AbsoluteBaSyouFn.of(PlayerA, "Gゾーン")).filter(cardId => getCard(ctx, cardId).isRoll).length != 2) {
            throw new Error()
        }
    }
}