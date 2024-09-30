import { createBridge } from "../game/bridge/createBridge";
import { AbsoluteBaSyouFn } from "../game/define/BaSyou";
import { Card } from "../game/define/Card";
import { EffectFn } from "../game/define/Effect";
import { ItemStateFn } from "../game/define/ItemState";
import { PlayerA, PlayerB } from "../game/define/PlayerID";
import { setActivePlayerID } from "../game/gameState/ActivePlayerComponent";
import { addCards, createCardWithProtoIds, getCard } from "../game/gameState/CardTableComponent";
import { createEffectTips, doEffect, setTipSelectionForUser } from "../game/gameState/doEffect";
import { createGameState, GameState } from "../game/gameState/GameState";
import { createPlayCardEffects } from "../game/gameState/createPlayCardEffects";
import { getItemState, mapItemState } from "../game/gameState/ItemStateComponent";
import { getItemIdsByBasyou } from "../game/gameState/ItemTableComponent";
import { setPhase } from "../game/gameState/PhaseComponent";
import { loadPrototype } from "../script";
import { repeat } from "ramda";
import { createPlayEffects } from "../game/gameState/createPlayEffects";
import { createTipByEntitySearch } from "../game/gameState/Entity";
import { TipFn } from "../game/define/Tip";
import { getTopEffect } from "../game/gameState/EffectStackComponent";
import { setSetGroupParent } from "../game/gameState/SetGroupComponent";
import { TipError } from "../game/define/GameError";

export async function test179027_09D_C_BK063R_black() {
    await loadPrototype("179027_09D_C_BK063R_black")
    await loadPrototype("unitBlack")
    const cardA: Card = {
        id: "cardA",
        protoID: "179027_09D_C_BK063R_black"
    }
    let ctx = createGameState()
    ctx = addCards(ctx, AbsoluteBaSyouFn.of(PlayerA, "手札"), [cardA]) as GameState
    ctx = createCardWithProtoIds(ctx, AbsoluteBaSyouFn.of(PlayerA, "本国"), repeat("unitBlack", 1)) as GameState
    ctx = createCardWithProtoIds(ctx, AbsoluteBaSyouFn.of(PlayerA, "Gゾーン"), repeat("unitBlack", 5)) as GameState
    ctx = setActivePlayerID(ctx, PlayerA) as GameState
    ctx = setPhase(ctx, ["戦闘フェイズ", "ダメージ判定ステップ", "フリータイミング"]) as GameState
    let originCtx = JSON.parse(JSON.stringify(ctx))
    let effects = createPlayEffects(ctx, PlayerA)
    {
        if (effects.length != 1) {
            throw new Error()
        }
        let effect = effects[0]
        let tipOrErrors = createEffectTips(ctx, effect, 0, 0)
        let toes = tipOrErrors.filter(toe => toe.errors.length > 0)
        if (toes.length != 1) {
            throw new Error()
        }

        ctx = createCardWithProtoIds(ctx, AbsoluteBaSyouFn.of(PlayerB, "戦闘エリア1"), repeat("unitBlack", 1)) as GameState
        let tip = createTipByEntitySearch(ctx, cardA.id, {
            at: ["戦闘エリア1", "戦闘エリア2"],
            hasSetCard: false,
            side: "敵軍",
            is: ["ユニット"],
            count: 1
        })
        let selection = TipFn.getSelection(tip)
        if(selection.length != 1){
            console.log(tip)
            throw new Error()
        }

        tipOrErrors = createEffectTips(ctx, effect, 0, 0)
        toes = tipOrErrors.filter(toe => toe.errors.length > 0)
        if (toes.length != 0) {
            throw new Error()
        }

        ctx = setTipSelectionForUser(ctx, effect, 0, 0)
        ctx = doEffect(ctx, effect, 0, 0)
        
        const topEffect = getTopEffect(ctx)
        if(topEffect == null){
            throw new Error()
        }
        effect = topEffect
        ctx = doEffect(ctx, effect, 0, 0)
        // 卡被破壞
        if(getItemIdsByBasyou(ctx, AbsoluteBaSyouFn.of(PlayerB, "戦闘エリア1")).find(cardId=>getItemState(ctx, cardId).destroyReason) == null){
            throw new Error()
        }
        // 本國的本被抽
        if(getItemIdsByBasyou(ctx, AbsoluteBaSyouFn.of(PlayerA, "本国")).length != 0){
            throw new Error()
        }
        // 指令移到墓地
        if(getItemIdsByBasyou(ctx, AbsoluteBaSyouFn.of(PlayerA, "ジャンクヤード")).length != 1){
            throw new Error()
        }
        console.log(ctx.cards)
        // 國力橫3張
        if(getItemIdsByBasyou(ctx, AbsoluteBaSyouFn.of(PlayerA, "Gゾーン")).filter(cardId=>getCard(ctx, cardId).isRoll).length != 3){
            throw new Error()
        }
    }
    ctx = originCtx
    const cardB: Card = {
        id: "cardB",
        protoID: "unitBlack"
    }
    ctx = addCards(ctx, AbsoluteBaSyouFn.of(PlayerA, "配備エリア"), [cardB]) as GameState
    const cardC: Card = {
        id: "cardC",
        protoID: "unitBlack"
    }
    ctx = addCards(ctx, AbsoluteBaSyouFn.of(PlayerA, "配備エリア"), [cardC]) as GameState
    ctx = setSetGroupParent(ctx, cardB.id, cardC.id) as GameState
    ctx = createCardWithProtoIds(ctx, AbsoluteBaSyouFn.of(PlayerB, "戦闘エリア1"), repeat("unitBlack", 1)) as GameState
    {
        effects = createPlayEffects(ctx, PlayerA)
        if (effects.length != 2) {
            throw new Error()
        }
        let effect = effects[1]
        if(effect.text.id != "totalCostPlusPlayEffect_text_cardA"){
            throw new Error()
        }
        let tipOrErrors = createEffectTips(ctx, effect, 0, 0)
        let toes = tipOrErrors.filter(toe => toe.errors.length > 0)
        if (toes.length != 0) {
            throw new Error()
        }

        ctx = setTipSelectionForUser(ctx, effect, 0, 0)
        ctx = doEffect(ctx, effect, 0, 0)
        
        const topEffect = getTopEffect(ctx)
        if(topEffect == null){
            throw new Error()
        }
        effect = topEffect
        ctx = doEffect(ctx, effect, 0, 0)

        // 國力橫1張
        if(getItemIdsByBasyou(ctx, AbsoluteBaSyouFn.of(PlayerA, "Gゾーン")).filter(cardId=>getCard(ctx, cardId).isRoll).length != 1){
            throw new Error()
        }
    }
}