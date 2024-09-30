import { testBattleBonus, testFlow1, testFlow2 } from "./testFlow";
import { tests as itemGroupTests } from "../tool/ItemGroup"
import { test179028_10D_U_WT181N_white } from "./test179028_10D_U_WT181N_white";
import { test179024_03B_U_WT042U_white } from "./test179024_03B_U_WT042U_white";
import { test179001_01A_CH_WT007R_white } from "./test179001_01A_CH_WT007R_white";
import { test179030_11E_C_BL079R_blue } from "./test179030_11E_C_BL079R_blue";
import { testAttackRuleEffect, testAttackRuleEffect2, testAttackRuleEffect3 } from "./testAttackRuleEffect";
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
import { createGameStateWithFlowMemory, GameStateWithFlowMemory, initState } from "../game/gameStateWithFlowMemory/GameStateWithFlowMemory";
import { queryFlow } from "../game/gameStateWithFlowMemory/queryFlow";
import { applyFlow, createAIChoiseList } from "../game/gameStateWithFlowMemory/applyFlow";
import { TargetMissingError } from "../game/define/GameError";
import { testPlayG } from "./testPlayG";
import { testPlayChar } from "./testPlayChar";
import { test179015_04B_U_BK061C_black, test179015_04B_U_BK061C_black_2 } from "./test179015_04B_U_BK061C_black";
import { test179016_04B_U_BK066C_black } from "./test179016_04B_U_BK066C_black";
import { Card } from "../game/define/Card";
import { createGameState, GameState } from "../game/gameState/GameState";
import { getItemState, mapItemState } from "../game/gameState/ItemStateComponent";
import { swap } from "ramda";
import { doItemSwap } from "../game/gameState/doItemSwap";
import { getItemBaSyou, getItemIdsByBasyou } from "../game/gameState/ItemTableComponent";
import { test179030_11E_U_BK194S_2_black, test179030_11E_U_BK194S_2_black_2 } from "./test179030_11E_U_BK194S_2_black";
import { test179015_04B_U_BK058R_black } from "./test179015_04B_U_BK058R_black";
import { testGain } from "./testGain";
import { test179028_10D_C_BL070N_blue } from "./test179028_10D_C_BL070N_blue";
import { test179003_01A_U_BK008U_black } from "./test179003_01A_U_BK008U_black";
import { test179025_07D_U_RD158C_red } from "./test179025_07D_U_RD158C_red";
import { testGetPlayEffects } from "./testGetPlayEffects";
import { TableFns } from "../tool/table";
import { Flow } from "../game/gameStateWithFlowMemory/Flow";
import { logCategory } from "../tool/logger";
import { test179020_05C_U_BK100U_black } from "./test179020_05C_U_BK100U_black";
import { test179901_B2B_C_BK005P_black } from "./test179901_B2B_C_BK005P_black";
import { testIssue } from "./testIssue";
import { testCompress } from "./testCompress";
import { test179027_09D_C_BK063R_black } from "./test179027_09D_C_BK063R_black";
const fs = require('fs').promises;

export async function tests() {
    return [
        //testIssue,
        test179027_09D_C_BK063R_black,
        test179901_B2B_C_BK005P_black,
        test179015_04B_U_BK061C_black_2,
        test179020_05C_U_BK100U_black,
        test179025_07D_U_RD158C_red,
        test179003_01A_U_BK008U_black,
        test179030_11E_C_BL079R_blue,
        test179028_10D_C_BL070N_blue,
        testGain,
        testLoadPrototype,
        testSwapItem,
        itemGroupTests,
        testFlow1,
        //testFlow2,
        testBattleBonus,
        testGetPlayEffects,
        testAttackRuleEffect,
        testAttackRuleEffect2,
        testAttackRuleEffect3,
        testDrawRuleEffect,
        testReollRuleEffect,
        testReturnRuleEffect,
        testPS,
        testCrossWeapon,
        testPlayG,
        testPlayChar,
        test179028_10D_U_WT181N_white,
        test179024_03B_U_WT042U_white,
        test179001_01A_CH_WT007R_white,
        test179015_04B_U_BK061C_black,
        test179016_04B_U_BK066C_black,
        test179030_11E_U_BK194S_2_black,
        test179015_04B_U_BK058R_black,
        test179030_11E_U_BK194S_2_black_2,
        testCompress,
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
    ctx = addCards(ctx, AbsoluteBaSyouFn.of(PlayerA, "戦闘エリア2"), [unit2]) as GameState
    ctx = mapItemState(ctx, unit.id, is => ({ ...is, damage: 2 })) as GameState
    ctx = mapCard(ctx, unit.id, is => ({ ...is, isRoll: true })) as GameState
    if (getItemState(ctx, unit.id).damage != 2) {
        throw new Error()
    }
    if (getItemState(ctx, unit2.id).damage != 0) {
        throw new Error()
    }
    ctx = doItemSwap(ctx, [unit.id, getItemBaSyou(ctx, unit.id)], [unit2.id, getItemBaSyou(ctx, unit2.id)])
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
    // unit.id還在是戦闘エリア1, 但是imgID對換了, 看起來就像是置換
    if (AbsoluteBaSyouFn.getBaSyouKeyword(getItemBaSyou(ctx, unit.id)) != "戦闘エリア1") {
        throw new Error()
    }
    if (AbsoluteBaSyouFn.getBaSyouKeyword(getItemBaSyou(ctx, unit2.id)) != "戦闘エリア2") {
        throw new Error()
    }
}




// ============================================================
// Bun v1.1.27 (267afa29) Windows x64
// Windows v.win10_fe
// CPU: sse42 avx avx2
// Args: "C:\Program Files\nodejs\node_modules\bun\bin\bun.exe" "run" ".\src\index.ts"
// Features: jsc tsconfig(2)
// Builtins: "bun:main" "node:buffer" "node:crypto" "node:fs" "node:string_decoder" "node:util/types"
// Elapsed: 24026ms | User: 9625ms | Sys: 78ms
// RSS: 0.35GB | Peak: 0.35GB | Commit: 0.48GB | Faults: 88180

// panic(main thread): Segmentation fault at address 0x30
// oh no: Bun has crashed. This indicates a bug in Bun, not your code.

// To send a redacted crash report to Bun's team,
// please file a GitHub issue using the link below:

//  https://bun.report/1.1.27/wr1267afa2AiggggCyhwk3Cyjhk3Csg9j3C4tqyN6nx9X0uqpT2vguJsozwJ47z57C20wjqBA2AgD