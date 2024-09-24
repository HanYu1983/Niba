import { getPlayEffects, testGetPlayEffects } from "../game/gameState/getPlayEffects";
import { testBattleBonus, testFlow1, testFlow2 } from "./testFlow";
import { tests as itemGroupTests } from "../tool/ItemGroup"
import { test179028_10D_U_WT181N_white } from "./test179028_10D_U_WT181N_white";
import { test179024_03B_U_WT042U_white } from "./test179024_03B_U_WT042U_white";
import { test179001_01A_CH_WT007R_white } from "./test179001_01A_CH_WT007R_white";
import { test179030_11E_C_BL079R_blue } from "./test179030_11E_C_BL079R_blue";
import { testAttackRuleEffect, testAttackRuleEffect2 } from "./testAttackRuleEffect";
import { testDrawRuleEffect } from "./testDrawRuleEffect";
import { testReollRuleEffect } from "./testRerollRuleEffect";
import { testReturnRuleEffect } from "./testReturnRuleEffect";
import { testPS } from "./testPS";
import { testCrossWeapon } from "./testCrossWeapon";
import { getPrototype, loadPrototype } from "../script";
import { PlayerA, PlayerB, PlayerIDFn } from "../game/define/PlayerID";
import { getActivePlayerID, setActivePlayerID } from "../game/gameState/ActivePlayerComponent";
import { getPhase, setPhase } from "../game/gameState/PhaseComponent";
import { AbsoluteBaSyouFn } from "../game/define/BaSyou";
import { addCards, createCardWithProtoIds, getCard, mapCard } from "../game/gameState/CardTableComponent";
import { getGlobalEffects } from "../game/gameState/globalEffects";
import { createGameStateWithFlowMemory, GameStateWithFlowMemory } from "../game/gameStateWithFlowMemory/GameStateWithFlowMemory";
import { queryFlow } from "../game/gameStateWithFlowMemory/queryFlow";
import { applyFlow } from "../game/gameStateWithFlowMemory/applyFlow";
import { TargetMissingError } from "../game/define/GameError";
import { testIssue1 } from "./testIssue";
import { testPlayG } from "./testPlayG";
import { testPlayChar } from "./testPlayChar";
import { test179015_04B_U_BK061C_black } from "./test179015_04B_U_BK061C_black";
import { test179016_04B_U_BK066C_black } from "./test179016_04B_U_BK066C_black";
import { Card } from "../game/define/Card";
import { createGameState, GameState } from "../game/gameState/GameState";
import { getItemState, mapItemState } from "../game/gameState/ItemStateComponent";
import { swap } from "ramda";
import { swapItem } from "../game/gameState/swapItem";

export async function tests() {
    return [
        //testCompress,
        testLoadPrototype,
        testSwapItem,
        itemGroupTests,
        testFlow1,
        testFlow2,
        testBattleBonus,
        testGetPlayEffects,
        testAttackRuleEffect,
        testAttackRuleEffect2,
        testDrawRuleEffect,
        testReollRuleEffect,
        testReturnRuleEffect,
        testPS,
        testCrossWeapon,
        testIssue1,
        testPlayG,
        testPlayChar,
        test179028_10D_U_WT181N_white,
        test179024_03B_U_WT042U_white,
        test179001_01A_CH_WT007R_white,
        test179030_11E_C_BL079R_blue,
        test179015_04B_U_BK061C_black,
        test179016_04B_U_BK066C_black,
    ].reduce((worker, testF) => {
        return worker.then(async () => {
            console.log(`==============================${testF.name}==================================`);
            return testF()
        })
    }, Promise.resolve()).then(() => console.log("DONE!"))
}

async function testLoadPrototype() {
    //const TMP_DECK = ["179001_01A_CH_WT007R_white", "179003_01A_U_BK008U_black", "179004_01A_CH_WT009R_white", "179004_01A_CH_WT010C_white", "179007_02A_O_BK005C_black", "179007_02A_U_WT027U_white", "179008_02A_U_WT034U_white", "179014_03B_CH_WT027R_white", "179015_04B_U_WT067C_white", "179016_04B_U_RD083C_red", "179016_04B_U_WT074C_white", "179016_04B_U_WT075C_white", "179019_01A_C_WT010C_white", "179022_06C_CH_WT057R_white", "179022_06C_U_WT113R_white", "179023_06C_CH_WT067C_white", "179023_06C_G_BL021C_blue", "179024_03B_U_WT057U_white", "179025_07D_C_WT060U_white", "179025_07D_CH_WT075C_white", "179025_07D_O_GN019C_green", "179025_07D_U_RD156R_red", "179025_07D_U_RD158C_red", "179028_10D_C_BL070N_blue", "179029_05C_O_BK014C_black", "179029_B3C_CH_WT102R_white", "179029_B3C_CH_WT103N_white", "179030_11E_C_BL076S_blue", "179030_11E_G_RD021N_red", "179030_11E_O_BK012N_black", "179030_11E_O_GN023N_green", "179030_11E_U_BL208S_blue", "179030_11E_U_BL210N_blue", "179030_11E_U_BL215R_blue", "179901_00_U_RD010P_red", "179901_CG_C_WT001P_white", "179901_CG_CH_WT002P_white"];
    const TMP_DECK = ["179031_12E_C_RD085N_red"]
    await Promise.all(TMP_DECK.map(loadPrototype))
}

async function testSwapItem() {
    await loadPrototype("unit")
    await loadPrototype("unitBlack")
    let ctx = createGameState()
    const unit: Card = {
        id: "unit",
        protoID: "unit"
    }
    const unit2: Card = {
        id: "unit2",
        protoID: "unitBlack"
    }
    ctx = addCards(ctx, AbsoluteBaSyouFn.of(PlayerA, "戦闘エリア1"), [unit]) as GameState
    ctx = addCards(ctx, AbsoluteBaSyouFn.of(PlayerB, "戦闘エリア1"), [unit2]) as GameState
    ctx = mapItemState(ctx, unit.id, is => ({ ...is, damage: 2 })) as GameState
    ctx = mapCard(ctx, unit.id, is => ({ ...is, isRoll: true })) as GameState
    if (getItemState(ctx, unit.id).damage != 2) {
        throw new Error()
    }
    ctx = swapItem(ctx, unit.id, unit2.id)
    if (getItemState(ctx, unit.id).damage != 0) {
        throw new Error()
    }
    if (getItemState(ctx, unit2.id).damage != 2) {
        throw new Error()
    }
    if (getCard(ctx, unit2.id).isRoll != true) {
        throw new Error()
    }
    if (getCard(ctx, unit.id).protoID != "unitBlack") {
        throw new Error()
    }
    if (getCard(ctx, unit2.id).protoID != "unit") {
        throw new Error()
    }
}

async function testCompress() {
    const blackT3 = ["179015_04B_O_BK010C_black", "179015_04B_O_BK010C_black", "179015_04B_U_BK058R_black", "179015_04B_U_BK058R_black", "179015_04B_U_BK059C_black", "179015_04B_U_BK059C_black", "179015_04B_U_BK061C_black", "179015_04B_U_BK061C_black", "179016_04B_U_BK066C_black", "179016_04B_U_BK066C_black", "179019_02A_C_BK015S_black", "179019_02A_C_BK015S_black", "179020_05C_U_BK100U_black", "179020_05C_U_BK100U_black", "179023_06C_C_BK048R_black", "179023_06C_C_BK048R_black", "179023_06C_C_BK049U_black", "179023_06C_C_BK049U_black", "179024_04B_C_BK027U_black", "179024_04B_C_BK027U_black", "179024_04B_U_BK060C_black", "179024_04B_U_BK060C_black", "179024_04B_U_BK067C_black", "179024_04B_U_BK067C_black", "179024_B2B_C_BK054C_black", "179024_B2B_C_BK054C_black", "179024_B2B_U_BK128S_black_02", "179024_B2B_U_BK128S_black_02", "179024_B2B_U_BK129R_black", "179024_B2B_U_BK129R_black", "179027_09D_C_BK063R_black", "179027_09D_C_BK063R_black", "179027_09D_O_BK010N_black", "179027_09D_O_BK010N_black", "179027_09D_U_BK163S_black", "179027_09D_U_BK163S_black", "179027_09D_U_BK163S_black", "179029_06C_C_BK045U_black", "179029_06C_C_BK045U_black", "179029_B3C_C_BK071N_black", "179029_B3C_C_BK071N_black", "179029_B3C_U_BK184N_black", "179029_B3C_U_BK184N_black", "179029_B3C_U_BK184N_black", "179029_B3C_U_BK185N_black", "179029_B3C_U_BK185N_black", "179030_11E_U_BK194S_2_black", "179030_11E_U_BK194S_2_black", "179030_11E_U_BK194S_2_black", "179901_B2B_C_BK005P_black"]
    await Promise.all(blackT3.map(loadPrototype))
    let ctx = createGameStateWithFlowMemory()
    ctx = setActivePlayerID(ctx, PlayerA) as GameStateWithFlowMemory
    ctx = setPhase(ctx, ["配備フェイズ", "フリータイミング"]) as GameStateWithFlowMemory
    ctx = setActivePlayerID(ctx, PlayerA) as GameStateWithFlowMemory
    ctx = createCardWithProtoIds(ctx, AbsoluteBaSyouFn.of(PlayerA, "本国"), blackT3) as GameStateWithFlowMemory
    ctx = createCardWithProtoIds(ctx, AbsoluteBaSyouFn.of(PlayerA, "手札"), blackT3.slice(0, 6)) as GameStateWithFlowMemory
    ctx = createCardWithProtoIds(ctx, AbsoluteBaSyouFn.of(PlayerA, "配備エリア"), blackT3.slice(6, 6)) as GameStateWithFlowMemory
    ctx = createCardWithProtoIds(ctx, AbsoluteBaSyouFn.of(PlayerA, "Gゾーン"), blackT3.slice(12, 6)) as GameStateWithFlowMemory
    ctx = createCardWithProtoIds(ctx, AbsoluteBaSyouFn.of(PlayerB, "本国"), blackT3) as GameStateWithFlowMemory
    ctx = createCardWithProtoIds(ctx, AbsoluteBaSyouFn.of(PlayerB, "手札"), blackT3.slice(0, 6)) as GameStateWithFlowMemory
    ctx = createCardWithProtoIds(ctx, AbsoluteBaSyouFn.of(PlayerB, "配備エリア"), blackT3.slice(6, 6)) as GameStateWithFlowMemory
    ctx = createCardWithProtoIds(ctx, AbsoluteBaSyouFn.of(PlayerB, "Gゾーン"), blackT3.slice(12, 6)) as GameStateWithFlowMemory
    for (let i = 0; i < 1000; ++i) {
        console.log(`${i} > ${getPhase(ctx)} > ${getActivePlayerID(ctx)}`)
        const playerId = PlayerIDFn.getAll()[Math.round(Math.random() * 1000) % 2]
        {
            const clickTime = Math.round(Math.random() * 1000) % 3
            for (let t = 0; t < clickTime; ++t) {
                const flows = queryFlow(ctx, playerId)
                if (flows.length) {
                    try {
                        const flow = flows[Math.round(Math.random() * 1000) % flows.length]
                        console.log(`${playerId}>${flow.id}>${flow.description}`)
                        ctx = applyFlow(ctx, playerId, flow)
                    } catch (e) {
                        if (e instanceof TargetMissingError) {
                            console.log(e.message)
                        } else {
                            throw e
                        }
                    }
                }
            }
        }
        getGlobalEffects(ctx, null)
        const cmd = getPlayEffects(ctx, playerId)
        console.log(`${playerId} 能用的指令數量: ${cmd.length}`)
    }
}