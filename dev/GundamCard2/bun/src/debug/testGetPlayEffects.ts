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
        if (playEffects[0].reason[0] == "PlayCard" && playEffects[0].reason[1] == PlayerA && playEffects[0].reason[2] == cardA.id) {

        } else {
            throw new Error()
        }
        if (playEffects[1].reason[0] == "PlayCard" && playEffects[1].reason[1] == PlayerA && playEffects[1].reason[2] == cardB.id) {

        } else {
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
        if (playEffects[0].reason[0] == "PlayText" && playEffects[0].reason[1] == PlayerA && playEffects[0].reason[2] == cardC.id && playEffects[0].reason[3] == cardCProto.texts?.[0].id) {

        } else {
            throw new Error()
        }
        if (playEffects[1].reason[0] == "PlayText" && playEffects[0].reason[1] == PlayerA && playEffects[1].reason[2] == cardC.id && playEffects[1].reason[3] == cardCProto.texts?.[1].id) {

        } else {
            throw new Error()
        }
    }
}