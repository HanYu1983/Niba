import { createBridge } from "../game/bridge/createBridge"
import { AbsoluteBaSyouFn } from "../game/define/BaSyou"
import { Card } from "../game/define/Card"
import { EffectFn } from "../game/define/Effect"
import { PlayerA, PlayerB } from "../game/define/PlayerID"
import { setActivePlayerID } from "../game/gameState/ActivePlayerComponent"
import { addCards, createCardWithProtoIds } from "../game/gameState/CardTableComponent"
import { createConditionTitleFn } from "../game/gameState/createConditionTitleFn"
import { doEffect, setTipSelectionForUser } from "../game/gameState/doEffect"
import { doTriggerEvent } from "../game/gameState/doTriggerEvent"
import { getImmediateEffects } from "../game/gameState/EffectStackComponent"
import { createTipByEntitySearch } from "../game/gameState/Entity"
import { createGameState, GameState } from "../game/gameState/GameState"
import { getGlobalEffects } from "../game/gameState/globalEffects"
import { getItemIdsByBasyou } from "../game/gameState/ItemTableComponent"
import { setPhase } from "../game/gameState/PhaseComponent"
import { loadPrototype } from "../script"

export async function test179020_05C_U_BK100U_black() {
    await loadPrototype("179020_05C_U_BK100U_black")
    await loadPrototype("unitBlack")
    const cardA: Card = {
        id: "cardA",
        protoID: "179020_05C_U_BK100U_black"
    }
    let ctx = createGameState()
    ctx = addCards(ctx, AbsoluteBaSyouFn.of(PlayerA, "戦闘エリア1"), [cardA]) as GameState
    ctx = createCardWithProtoIds(ctx, AbsoluteBaSyouFn.of(PlayerA, "Gゾーン"), ["unitBlack", "unitBlack", "unitBlack", "unitBlack"]) as GameState
    ctx = setActivePlayerID(ctx, PlayerA) as GameState
    // 一開始敵人沒手牌, 無法發動能力
    ctx = doTriggerEvent(ctx, { title: ["このカードの部隊が敵軍本国に戦闘ダメージを与えた場合"], cardIds: [cardA.id] })
    {
        const tip = createTipByEntitySearch(ctx, EffectFn.createEmptyPlayCard(PlayerA, cardA.id), { side: "敵軍", at: ["手札"], count: 2 }, { ges: getGlobalEffects(ctx, null) })
        if (tip == null) {
            throw new Error()
        }
        if (tip.title[0] == "カード" && tip.title[1].length == 0) {

        } else {
            throw new Error()
        }
    }
    if (getImmediateEffects(ctx).length != 0) {
        throw new Error()
    }
    // 敵人加入足夠的手牌, 發動能力
    ctx = createCardWithProtoIds(ctx, AbsoluteBaSyouFn.of(PlayerB, "手札"), ["unitBlack", "unitBlack"]) as GameState
    {
        const tip = createTipByEntitySearch(ctx, EffectFn.createEmptyPlayCard(PlayerA, cardA.id), { side: "敵軍", at: ["手札"], count: 2 }, { ges: getGlobalEffects(ctx, null) })
        if (tip == null) {
            throw new Error()
        }
        if (tip.title[0] == "カード" && tip.title[1].length == 2) {

        } else {
            throw new Error()
        }
    }
    ctx = doTriggerEvent(ctx, { title: ["このカードの部隊が敵軍本国に戦闘ダメージを与えた場合"], cardIds: [cardA.id] })
    {
        if (getImmediateEffects(ctx).length != 1) {
            throw new Error()
        }
        const effect = getImmediateEffects(ctx)[0]
        ctx = setTipSelectionForUser(ctx, effect, 0, 0)
        ctx = doEffect(ctx, effect, 0, 0)
        if (getItemIdsByBasyou(ctx, AbsoluteBaSyouFn.of(PlayerB, "手札")).length != 0) {
            throw new Error()
        }
        if (getItemIdsByBasyou(ctx, AbsoluteBaSyouFn.of(PlayerB, "ジャンクヤード")).length != 2) {
            throw new Error()
        }
    }
}