import { AbsoluteBaSyouFn } from "../game/define/BaSyou";
import { Card } from "../game/define/Card";
import { testGameError } from "../game/define/GameError";
import { PlayerA } from "../game/define/PlayerID";
import { addCards, mapCard, getCard } from "../game/gameState/CardTableComponent";
import { doItemSwap } from "../game/gameState/doItemSwap";
import { createGameState, GameState } from "../game/gameState/GameState";
import { mapItemState, getItemState } from "../game/gameState/ItemStateComponent";
import { getItemBaSyou } from "../game/gameState/ItemTableComponent";
import { loadPrototype } from "../script";
import { testItemGroup } from "../tool/ItemGroup";
import { test179001_01A_CH_WT007R_white } from "./test179001_01A_CH_WT007R_white";
import { test179019_01A_U_WT003C_white } from "./test179019_01A_U_WT003C_white";
import { test179003_01A_U_BK008U_black } from "./test179003_01A_U_BK008U_black";
import { test179007_02A_U_WT027U_white } from "./test179007_02A_U_WT027U_white";
import { test179015_04B_U_BK058R_black } from "./test179015_04B_U_BK058R_black";
import { test179015_04B_U_BK061C_black_2, test179015_04B_U_BK061C_black } from "./test179015_04B_U_BK061C_black";
import { test179016_04B_U_BK066C_black } from "./test179016_04B_U_BK066C_black";
import { test179020_05C_U_BK100U_black } from "./test179020_05C_U_BK100U_black";
import { test179024_03B_U_WT042U_white } from "./test179024_03B_U_WT042U_white";
import { test179025_07D_U_RD158C_red } from "./test179025_07D_U_RD158C_red";
import { test179027_09D_C_BK063R_black } from "./test179027_09D_C_BK063R_black";
import { test179027_09D_C_WT067R_white } from "./test179027_09D_C_WT067R_white";
import { test179028_10D_C_BL070N_blue } from "./test179028_10D_C_BL070N_blue";
import { test179028_10D_U_WT181N_white } from "./test179028_10D_U_WT181N_white";
import { test179029_B3C_CH_WT102R_white } from "./test179029_B3C_CH_WT102R_white";
import { test179030_11E_C_BL079R_blue } from "./test179030_11E_C_BL079R_blue";
import { test179030_11E_C_WT077S_white } from "./test179030_11E_C_WT077S_white";
import { test179030_11E_U_BK194S_2_black, test179030_11E_U_BK194S_2_black_2 } from "./test179030_11E_U_BK194S_2_black";
import { test179901_B2B_C_BK005P_black } from "./test179901_B2B_C_BK005P_black";
import { testAttackRuleEffect, testAttackRuleEffect2, testAttackRuleEffect3 } from "./testAttackRuleEffect";
import { testCompress } from "./testCompress";
import { testCrossWeapon } from "./testCrossWeapon";
import { testDrawRuleEffect } from "./testDrawRuleEffect";
import { testFlow1, testBattleBonus } from "./testFlow";
import { testGain } from "./testGain";
import { testGetPlayEffects } from "./testGetPlayEffects";
import { testIssue } from "./testIssue";
import { testKaiSo } from "./testKaiSo";
import { testPlayChar } from "./testPlayChar";
import { testPlayerScore } from "./testPlayerScore";
import { testPlayG } from "./testPlayG";
import { testPS } from "./testPS";
import { testReollRuleEffect } from "./testRerollRuleEffect";
import { testReturnRuleEffect } from "./testReturnRuleEffect";
import { testSupply } from "./testSupply";
import { testThinkVer1, testThinkVer1_2 } from "./testThinkVer1";
import { test179901_00_U_WT001P_white_02 } from "./test179901_00_U_WT001P_white_02";
import { test179028_10D_CH_WT095_white } from "./test179028_10D_CH_WT095_white";
import { test179009_03B_U_WT045U_white } from "./test179009_03B_U_WT045U_white";
import { test179003_01A_CH_GN001R_green } from "./test179003_01A_CH_GN001R_green";
import { test179009_03B_U_GN036U_green } from "./test179009_03B_U_GN036U_green";

const fs = require('fs').promises;

export async function tests() {
    return [
        testLoadPrototype,
        test179009_03B_U_GN036U_green,
        test179003_01A_CH_GN001R_green,
        test179009_03B_U_WT045U_white,
        testIssue,
        test179028_10D_CH_WT095_white,
        test179901_00_U_WT001P_white_02,
        test179019_01A_U_WT003C_white,
        test179030_11E_C_WT077S_white,
        testPlayerScore,
        testThinkVer1_2,
        test179029_B3C_CH_WT102R_white,
        testThinkVer1,
        test179007_02A_U_WT027U_white,
        test179027_09D_C_WT067R_white,
        testKaiSo,
        testSupply,
        testGameError,
        test179027_09D_C_BK063R_black,
        test179901_B2B_C_BK005P_black,
        test179015_04B_U_BK061C_black_2,
        test179020_05C_U_BK100U_black,
        test179025_07D_U_RD158C_red,
        test179003_01A_U_BK008U_black,
        test179030_11E_C_BL079R_blue,
        test179028_10D_C_BL070N_blue,
        testGain,
        testSwapItem,
        testItemGroup,
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
    const TMP_DECK = ["179015_04B_O_BK010C_black", "179015_04B_O_BK010C_black", "179015_04B_U_BK058R_black", "179015_04B_U_BK058R_black", "179015_04B_U_BK059C_black", "179015_04B_U_BK059C_black", "179015_04B_U_BK061C_black", "179015_04B_U_BK061C_black", "179016_04B_U_BK066C_black", "179016_04B_U_BK066C_black", "179019_02A_C_BK015S_black", "179019_02A_C_BK015S_black", "179020_05C_U_BK100U_black", "179020_05C_U_BK100U_black", "179023_06C_C_BK048R_black", "179023_06C_C_BK048R_black", "179023_06C_C_BK049U_black", "179023_06C_C_BK049U_black", "179024_04B_C_BK027U_black", "179024_04B_C_BK027U_black", "179024_04B_U_BK060C_black", "179024_04B_U_BK060C_black", "179024_04B_U_BK067C_black", "179024_04B_U_BK067C_black", "179024_B2B_C_BK054C_black", "179024_B2B_C_BK054C_black", "179024_B2B_U_BK128S_black_02", "179024_B2B_U_BK128S_black_02", "179024_B2B_U_BK129R_black", "179024_B2B_U_BK129R_black", "179027_09D_C_BK063R_black", "179027_09D_C_BK063R_black", "179027_09D_O_BK010N_black", "179027_09D_O_BK010N_black", "179027_09D_U_BK163S_black", "179027_09D_U_BK163S_black", "179027_09D_U_BK163S_black", "179029_06C_C_BK045U_black", "179029_06C_C_BK045U_black", "179029_B3C_C_BK071N_black", "179029_B3C_C_BK071N_black", "179029_B3C_U_BK184N_black", "179029_B3C_U_BK184N_black", "179029_B3C_U_BK184N_black", "179029_B3C_U_BK185N_black", "179029_B3C_U_BK185N_black", "179030_11E_U_BK194S_2_black", "179030_11E_U_BK194S_2_black", "179030_11E_U_BK194S_2_black", "179901_B2B_C_BK005P_black"]
    const TMP_DECK2 = ["179001_01A_CH_WT007R_white", "179004_01A_CH_WT009R_white", "179004_01A_CH_WT010C_white", "179007_02A_U_WT027U_white", "179007_02A_U_WT027U_white", "179008_02A_U_WT034U_white", "179008_02A_U_WT034U_white", "179008_02A_U_WT034U_white", "179014_03B_CH_WT027R_white", "179015_04B_U_WT067C_white", "179015_04B_U_WT067C_white", "179015_04B_U_WT067C_white", "179016_04B_U_WT074C_white", "179016_04B_U_WT074C_white", "179016_04B_U_WT074C_white", "179016_04B_U_WT075C_white", "179016_04B_U_WT075C_white", "179016_04B_U_WT075C_white", "179019_01A_C_WT010C_white", "179019_01A_C_WT010C_white", "179019_02A_U_WT028R_white", "179019_02A_U_WT028R_white", "179022_06C_CH_WT057R_white", "179022_06C_CH_WT057R_white", "179022_06C_CH_WT057R_white", "179022_06C_U_WT113R_white", "179022_06C_U_WT113R_white", "179022_06C_U_WT113R_white", "179023_06C_CH_WT067C_white", "179024_03B_U_WT057U_white", "179024_03B_U_WT057U_white", "179025_07D_C_WT060U_white", "179025_07D_CH_WT075C_white", "179025_07D_CH_WT075C_white", "179025_07D_CH_WT075C_white", "179027_09D_C_WT067R_white", "179027_09D_C_WT067R_white", "179029_B3C_CH_WT102R_white", "179029_B3C_CH_WT103N_white", "179029_B3C_U_WT196R_white", "179030_11E_C_WT077S_white", "179030_11E_C_WT077S_white", "179030_11E_C_WT077S_white", "179030_11E_CH_WT108N_white", "179901_00_C_WT003P_white", "179901_00_C_WT003P_white", "179901_00_C_WT003P_white", "179901_CG_C_WT001P_white", "179901_CG_C_WT001P_white", "179901_CG_CH_WT002P_white"]
    const TMP_DECK3 = ["179003_01A_C_BN003C_brown", "179003_01A_C_BN003C_brown", "179003_01A_C_BN003C_brown", "179003_01A_U_BN006R_brown_02", "179003_01A_U_BN006R_brown_02", "179003_01A_U_BN006R_brown_02", "179004_01A_O_BN005U_brown", "179004_01A_O_BN005U_brown", "179014_03B_U_BN046R_brown_haku", "179014_03B_U_BN046R_brown_haku", "179014_03B_U_BN046R_brown_haku", "179015_04B_U_BN057C_brown", "179015_04B_U_BN057C_brown", "179015_04B_U_BN057C_brown", "179016_04B_U_BN066C_brown", "179018_05C_C_BN027C_brown", "179018_05C_C_BN027C_brown", "179018_05C_C_BN027C_brown", "179018_05C_C_BN029R_brown", "179018_05C_C_BN029R_brown", "179022_06C_C_BN036U_brown", "179022_06C_C_BN036U_brown", "179022_06C_C_BN036U_brown", "179022_06C_CH_BN052R_brown", "179022_06C_U_BN101R_brown", "179022_06C_U_BN101R_brown", "179022_06C_U_BN101R_brown", "179024_B2B_C_BN041C_brown", "179024_B2B_C_BN041C_brown", "179024_B2B_C_BN041C_brown", "179025_07D_CH_BN066R_brown", "179025_07D_U_BN138R_brown", "179025_07D_U_BN138R_brown", "179025_07D_U_BN138R_brown", "179028_10D_U_BN164N_brown", "179028_10D_U_BN164N_brown", "179028_10D_U_BN164N_brown", "179029_05C_U_BN077R_brown", "179029_05C_U_BN077R_brown", "179029_05C_U_BN077R_brown", "179029_06C_C_BN039R_brown", "179029_06C_C_BN039R_brown", "179029_06C_C_BN039R_brown", "179029_B3C_CH_BN088R_brown", "179030_11E_U_BN188N_brown", "179030_11E_U_BN188N_brown", "179030_11E_U_BN188N_brown", "179901_09D_C_BN007P_brown", "179901_09D_C_BN007P_brown", "179901_09D_C_BN007P_brown"]
    const TMP_DECK4 = ["179001_01A_U_WT007C_white", "179001_01A_U_WT007C_white", "179003_01A_U_WT001R_white_02", "179003_01A_U_WT005R_white_02", "179003_01A_U_WT005R_white_02", "179003_01A_U_WT005R_white_02", "179007_02A_CH_WT016C_white", "179009_03B_CH_WT020R_white", "179009_03B_CH_WT024C_white", "179011_03B_U_WT040C_white", "179011_03B_U_WT040C_white", "179011_03B_U_WT040C_white", "179015_04B_CH_WT030C_white", "179015_04B_U_WT065C_white", "179019_01A_CH_WT008U_white", "179019_01A_CH_WT008U_white", "179019_01A_CH_WT008U_white", "179019_01A_U_WT006R_white", "179019_01A_U_WT006R_white", "179019_01A_U_WT006R_white", "179020_05C_CH_WT054C_white", "179024_03B_U_WT042U_white", "179024_03B_U_WT042U_white", "179024_03B_U_WT042U_white", "179025_07D_C_WT061C_white", "179025_07D_C_WT061C_white", "179025_07D_C_WT061C_white", "179026_08D_U_WT158C_white", "179026_08D_U_WT158C_white", "179026_08D_U_WT159U_white", "179026_08D_U_WT162C_white", "179026_08D_U_WT162C_white", "179026_08D_U_WT162C_white", "179027_09D_C_WT067R_white", "179028_10D_C_WT073N_white", "179028_10D_C_WT073N_white", "179028_10D_C_WT073N_white", "179029_05C_C_WT047U_white", "179029_05C_CH_WT043U_white", "179029_05C_CH_WT043U_white", "179029_06C_U_WT112C_white", "179029_06C_U_WT112C_white", "179030_11E_C_WT077S_white", "179030_11E_C_WT078R_white", "179901_CG_C_WT001P_white", "179901_CG_C_WT001P_white", "179901_CG_C_WT001P_white", "179901_CG_CH_WT002P_white", "179901_CG_U_WT009P_white", "179901_UN_WT003P_white"];
    const DECK_W_RANGE = ["179001_01A_CH_WT006C_white", "179001_01A_CH_WT006C_white", "179001_01A_CH_WT006C_white", "179001_01A_CH_WT006C_white", "179003_01A_O_WT001C_white", "179003_01A_O_WT001C_white", "179003_01A_O_WT001C_white", "179003_01A_O_WT001C_white", "179003_01A_O_WT001C_white", "179003_01A_O_WT001C_white", "179003_01A_O_WT001C_white", "179003_01A_U_WT011C_white", "179003_01A_U_WT011C_white", "179003_01A_U_WT011C_white", "179003_01A_U_WT011C_white", "179009_03B_U_WT044U_white", "179009_03B_U_WT044U_white", "179009_03B_U_WT044U_white", "179009_03B_U_WT044U_white", "179009_03B_U_WT044U_white", "179009_03B_U_WT045U_white", "179009_03B_U_WT045U_white", "179009_03B_U_WT045U_white", "179009_03B_U_WT045U_white", "179015_04B_O_WT005U_white", "179015_04B_O_WT005U_white", "179015_04B_O_WT005U_white", "179019_01A_U_WT003C_white", "179019_01A_U_WT003C_white", "179019_01A_U_WT003C_white", "179019_02A_C_WT012U_white", "179019_02A_C_WT012U_white", "179019_02A_C_WT012U_white", "179019_02A_U_WT031C_white", "179019_02A_U_WT031C_white", "179019_02A_U_WT031C_white", "179023_06C_C_WT055C_white", "179023_06C_C_WT055C_white", "179023_06C_C_WT055C_white", "179024_03B_U_WT039R_white", "179024_03B_U_WT039R_white", "179024_03B_U_WT039R_white", "179024_03B_U_WT042U_white", "179024_03B_U_WT042U_white", "179024_03B_U_WT042U_white", "179025_07D_CH_WT075C_white", "179025_07D_CH_WT075C_white", "179027_09D_O_WT014N_white", "179027_09D_O_WT014N_white", "179027_09D_O_WT014N_white", "179028_10D_CH_WT095_white", "179028_10D_U_WT177R_white", "179030_11E_C_WT077S_white", "179030_11E_C_WT077S_white", "179030_11E_C_WT077S_white", "179030_11E_C_WT078R_white", "179030_11E_C_WT078R_white", "179030_11E_C_WT078R_white", "179901_00_U_WT001P_white_02", "179901_00_U_WT001P_white_02", "179901_00_U_WT001P_white_02"]
    const all = TMP_DECK.concat(TMP_DECK2).concat(TMP_DECK3).concat(TMP_DECK4).concat(DECK_W_RANGE)
    for(const id of all){
        await loadPrototype(id)
    }
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