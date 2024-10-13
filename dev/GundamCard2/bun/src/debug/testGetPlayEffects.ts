import { AbsoluteBaSyouFn } from "../game/define/BaSyou"
import { Card } from "../game/define/Card"
import { PlayerA } from "../game/define/PlayerID"
import { setActivePlayerID } from "../game/gameState/ActivePlayerComponent"
import { addCards } from "../game/gameState/CardTableComponent"
import { createPlayEffects } from "../game/gameState/createPlayEffects"
import { createGameState, GameState } from "../game/gameState/GameState"
import { setPhase } from "../game/gameState/PhaseComponent"
import { loadPrototype, getPrototype } from "../script"

export async function testGetPlayEffects() {
    await loadPrototype("179024_03B_U_WT042U_white")
    let ctx = createGameState()
    const cardA: Card = {
        id: "cardA",
        protoID: "179024_03B_U_WT042U_white"
    }
    const cardB: Card = {
        id: "cardB",
        protoID: "179024_03B_U_WT042U_white"
    }
    const cardC: Card = {
        id: "cardC",
        protoID: "179024_03B_U_WT042U_white"
    }
    const cardCProto = getPrototype(cardC.protoID || "unknown")
    ctx = addCards(ctx, AbsoluteBaSyouFn.of(PlayerA, "手札"), [cardA]) as GameState
    ctx = addCards(ctx, AbsoluteBaSyouFn.of(PlayerA, "ハンガー"), [cardB]) as GameState
    ctx = addCards(ctx, AbsoluteBaSyouFn.of(PlayerA, "配備エリア"), [cardC]) as GameState
    ctx = setActivePlayerID(ctx, PlayerA) as GameState
    {
        const playEffects = createPlayEffects(ctx, PlayerA)
        if (playEffects.length != 0) {
            throw new Error()
        }
    }
    ctx = setPhase(ctx, ["配備フェイズ", "フリータイミング"]) as GameState
    {
        const playEffects = createPlayEffects(ctx, PlayerA)
        if (playEffects.length != 4) {
            throw new Error()
        }
        if (playEffects.find(eff => eff.reason[0] == "PlayCard" && eff.reason[1] == PlayerA && eff.reason[2] == cardA.id) == null) {
            throw new Error()
        }
        if (playEffects.find(eff => eff.reason[0] == "PlayCard" && eff.reason[1] == PlayerA && eff.reason[2] == cardB.id) == null) {
            throw new Error()
        }
    }
    ctx = setPhase(ctx, ["戦闘フェイズ", "ダメージ判定ステップ", "フリータイミング"]) as GameState
    ctx = setActivePlayerID(ctx, PlayerA) as GameState
    {
        const playEffects = createPlayEffects(ctx, PlayerA)
        if (playEffects.length != 2) {
            throw new Error()
        }
        if (playEffects.find(eff => eff.reason[0] == "PlayText" && eff.reason[1] == PlayerA && eff.reason[2] == cardC.id && eff.reason[3] == cardCProto.texts?.[0].id) == null) {
            throw new Error()
        }
        if (playEffects.find(eff => eff.reason[0] == "PlayText" && eff.reason[1] == PlayerA && eff.reason[2] == cardC.id && eff.reason[3] == cardCProto.texts?.[0].id) == null) {
            throw new Error()
        }
    }
}