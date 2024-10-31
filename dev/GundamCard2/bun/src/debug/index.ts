import { AbsoluteBaSyouFn, RelatedBaSyouFn } from "../game/define/BaSyou";
import { Card } from "../game/define/Card";
import { testGameError } from "../game/define/GameError";
import { PlayerA, PlayerB } from "../game/define/PlayerID";
import { addCards, mapCard, getCard, createCardWithProtoIds } from "../game/gameState/CardTableComponent";
import { doItemSwap } from "../game/gameState/doItemSwap";
import { createGameState, GameState } from "../game/gameState/GameState";
import { mapItemState, getItemState } from "../game/gameState/ItemStateComponent";
import { createStrBaSyouPair, getItemBaSyou, getItemIdsByBasyou } from "../game/gameState/ItemTableComponent";
import { getPrototype, loadPrototype } from "../script";
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
import { testAllCardTextTestEnv } from "../game/gameState/cardTextTestEnv";
import { testBattleBonus } from "./testFlow";
import { testOptAlgAttackCounty2, testOptAlgAttackCounty3 } from "../game/ai/SelectBattleGroupGene";
import { testOptAlgAttackCounty, testOptCreateBattleGroup } from "./testOptAlg";
import { checkIsBattle, isBattle } from "../game/gameState/IsBattleComponent";
import { createActionTitleFn } from "../game/gameState/createActionTitleFn";
import { EffectFn } from "../game/define/Effect";
import { createBridge } from "../game/bridge/createBridge";
import { Tip } from "../game/define/Tip";
import { setCardTipStrBaSyouPairs } from "../game/gameState/doEffect";

const fs = require('fs').promises;

export async function tests() {
    return [
        testAllCardTextTestEnv,
        testInsertMove,
        testIsBattle,
        // testOptAlgAttackCounty3,
        // testOptAlgAttackCounty2,
        testOptAlgAttackCounty,
        testOptCreateBattleGroup,
        test179030_11E_C_WT077S_white,
        testBattleBonus,
        testPS,
        testCrossWeapon,
        test179028_10D_U_WT181N_white,
        test179024_03B_U_WT042U_white,
        test179001_01A_CH_WT007R_white,
        test179016_04B_U_BK066C_black,
        test179030_11E_U_BK194S_2_black,
        test179015_04B_U_BK058R_black,
        test179030_11E_U_BK194S_2_black_2,
        test179030_11E_C_BL079R_blue,
        test179028_10D_C_BL070N_blue,
        test179025_07D_U_RD158C_red,
        test179019_01A_U_WT003C_white,
        test179009_03B_U_GN036U_green,
        test179003_01A_CH_GN001R_green,
        test179009_03B_U_WT045U_white,
        testIssue,
        test179028_10D_CH_WT095_white,
        test179901_00_U_WT001P_white_02,
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
        test179003_01A_U_BK008U_black,
        testGain,
        testSwapItem,
        testItemGroup,
        testGetPlayEffects,
        testAttackRuleEffect,
        testAttackRuleEffect2,
        testAttackRuleEffect3,
        testDrawRuleEffect,
        testReollRuleEffect,
        testReturnRuleEffect,
        testPlayG,
        testPlayChar,
        test179015_04B_U_BK061C_black,
        testCompress,
    ].reduce((worker, testF) => {
        return worker.then(async () => {
            console.log(`==============================${testF.name}==================================`);
            return testF()
        })
    }, Promise.resolve()).then(() => console.log("DONE!"))
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
    if (getItemState(ctx, unit.id).damage != 2) {
        throw new Error()
    }
    if (getItemState(ctx, unit2.id).damage != 0) {
        throw new Error()
    }
    if (getCard(ctx, unit.id).isRoll != true) {
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

async function testIsBattle() {
    let ctx = createGameState()
    ctx = addCards(ctx, AbsoluteBaSyouFn.of(PlayerA, "戦闘エリア1"), [{ id: "unit1", protoID: "unit" }]) as GameState
    ctx = addCards(ctx, AbsoluteBaSyouFn.of(PlayerA, "戦闘エリア2"), [{ id: "unit2", protoID: "unit" }]) as GameState
    ctx = checkIsBattle(ctx) as GameState
    if (isBattle(ctx, "unit1", null) != false) {
        throw new Error()
    }
    if (isBattle(ctx, "unit2", null) != false) {
        throw new Error()
    }
    ctx = addCards(ctx, AbsoluteBaSyouFn.of(PlayerB, "戦闘エリア1"), [{ id: "unit3", protoID: "unit" }]) as GameState
    ctx = addCards(ctx, AbsoluteBaSyouFn.of(PlayerB, "戦闘エリア2"), [{ id: "unit4", protoID: "unit" }]) as GameState
    ctx = checkIsBattle(ctx) as GameState
    if (isBattle(ctx, "unit1", null) != true) {
        throw new Error()
    }
    if (isBattle(ctx, "unit2", null) != true) {
        throw new Error()
    }
    if (isBattle(ctx, "unit3", null) != true) {
        throw new Error()
    }
    if (isBattle(ctx, "unit4", null) != true) {
        throw new Error()
    }
    if (isBattle(ctx, "unit1", "unit3") != true) {
        throw new Error()
    }
    if (isBattle(ctx, "unit2", "unit4") != true) {
        throw new Error()
    }
    if (isBattle(ctx, "unit1", "unit4") != false) {
        throw new Error()
    }
    if (isBattle(ctx, "unit2", "unit3") != false) {
        throw new Error()
    }
}

function testInsertMove() {
    let ctx = createGameState()
    ctx = addCards(ctx, AbsoluteBaSyouFn.of(PlayerA, "戦闘エリア2"), [
        { id: "unit1", protoID: "unit" },
        { id: "unit2", protoID: "unit" },
        { id: "unit3", protoID: "unit" },
    ]) as GameState
    ctx = addCards(ctx, AbsoluteBaSyouFn.of(PlayerA, "Gゾーン"), [
        { id: "g1", protoID: "unit" },
    ]) as GameState
    const masterCardId = "unit1"
    let originCtx = JSON.parse(JSON.stringify(ctx))
    {
        ctx = setCardTipStrBaSyouPairs(ctx, "var1", [createStrBaSyouPair(ctx, "unit2")], masterCardId)
        ctx = setCardTipStrBaSyouPairs(ctx, "var2", [createStrBaSyouPair(ctx, "g1")], masterCardId)
        ctx = createActionTitleFn({
            title: ["エリアの任意の順番に_リロール状態で移す", RelatedBaSyouFn.of("自軍", "戦闘エリア2"), false],
            vars: ["var1", "var2"]
        })(ctx, EffectFn.createEmptyPlayCard(PlayerA, masterCardId), createBridge({}))
        if (getItemIdsByBasyou(ctx, AbsoluteBaSyouFn.of(PlayerA, "戦闘エリア2"))[1] != "g1") {
            throw new Error()
        }
    }
    ctx = originCtx
    {
        ctx = setCardTipStrBaSyouPairs(ctx, "var1", [], masterCardId)
        ctx = setCardTipStrBaSyouPairs(ctx, "var2", [createStrBaSyouPair(ctx, "g1")], masterCardId)
        ctx = createActionTitleFn({
            title: ["エリアの任意の順番に_リロール状態で移す", RelatedBaSyouFn.of("自軍", "戦闘エリア2"), false],
            vars: ["var1", "var2"]
        })(ctx, EffectFn.createEmptyPlayCard(PlayerA, masterCardId), createBridge({}))
        if (getItemIdsByBasyou(ctx, AbsoluteBaSyouFn.of(PlayerA, "戦闘エリア2"))[3] != "g1") {
            throw new Error()
        }
    }
    ctx = originCtx
    {
        ctx = setCardTipStrBaSyouPairs(ctx, "var1", [createStrBaSyouPair(ctx, "unit1")], masterCardId)
        ctx = setCardTipStrBaSyouPairs(ctx, "var2", [createStrBaSyouPair(ctx, "g1")], masterCardId)
        ctx = createActionTitleFn({
            title: ["エリアの任意の順番に_リロール状態で移す", RelatedBaSyouFn.of("自軍", "戦闘エリア2"), false],
            vars: ["var1", "var2"]
        })(ctx, EffectFn.createEmptyPlayCard(PlayerA, masterCardId), createBridge({}))
        if (getItemIdsByBasyou(ctx, AbsoluteBaSyouFn.of(PlayerA, "戦闘エリア2"))[0] != "g1") {
            throw new Error()
        }
    }
}