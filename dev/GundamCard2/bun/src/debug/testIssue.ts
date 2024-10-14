import { EffectFn } from "../game/define/Effect"
import { ItemStateFn } from "../game/define/ItemState"
import { PlayerA, PlayerB, PlayerIDFn } from "../game/define/PlayerID"
import { setTipSelectionForUser, doEffect, createEffectTips } from "../game/gameState/doEffect"
import { createPlayEffects } from "../game/gameState/createPlayEffects"
import { mapItemState } from "../game/gameState/ItemStateComponent"
import { GameStateWithFlowMemory } from "../game/gameStateWithFlowMemory/GameStateWithFlowMemory"
import { getPrototype, loadPrototype } from "../script"
import { queryFlow } from "../game/gameStateWithFlowMemory/queryFlow"
import { getActivePlayerID } from "../game/gameState/ActivePlayerComponent"
import { AbsoluteBaSyouFn } from "../game/define/BaSyou"
import { TargetMissingError } from "../game/define/GameError"
import { getItemIdsByBasyou } from "../game/gameState/ItemTableComponent"
import { getPhase, setPhase } from "../game/gameState/PhaseComponent"
import { Flow } from "../game/gameStateWithFlowMemory/Flow"
import { TableFns } from "../tool/table"
import { getCard, mapCard } from "../game/gameState/CardTableComponent"
import { getCardIdsCanPayRollCost, getCardTexts, isCardMaster } from "../game/gameState/card"
import { clearGlobalEffects, getGlobalEffects } from "../game/gameState/globalEffects"
import { applyFlow } from "../game/gameStateWithFlowMemory/applyFlow"
import { createPlayCardEffects } from "../game/gameState/createPlayCardEffects"
import { getPlayerCommands, getPlayerCommandsFilterNoErrorDistinct, updateCommand } from "../game/gameState/updateCommand"
import { clearActiveEffectID } from "../game/gameStateWithFlowMemory/effect"
import { getEffect } from "../game/gameState/EffectStackComponent"
import { doTriggerEvent } from "../game/gameState/doTriggerEvent"

export async function testIssue() {
    const whiteSpeed = ["179001_01A_CH_WT007R_white", "179004_01A_CH_WT009R_white", "179004_01A_CH_WT010C_white", "179007_02A_U_WT027U_white", "179007_02A_U_WT027U_white", "179008_02A_U_WT034U_white", "179008_02A_U_WT034U_white", "179008_02A_U_WT034U_white", "179014_03B_CH_WT027R_white", "179015_04B_U_WT067C_white", "179015_04B_U_WT067C_white", "179015_04B_U_WT067C_white", "179016_04B_U_WT074C_white", "179016_04B_U_WT074C_white", "179016_04B_U_WT074C_white", "179016_04B_U_WT075C_white", "179016_04B_U_WT075C_white", "179016_04B_U_WT075C_white", "179019_01A_C_WT010C_white", "179019_01A_C_WT010C_white", "179019_02A_U_WT028R_white", "179019_02A_U_WT028R_white", "179022_06C_CH_WT057R_white", "179022_06C_CH_WT057R_white", "179022_06C_CH_WT057R_white", "179022_06C_U_WT113R_white", "179022_06C_U_WT113R_white", "179022_06C_U_WT113R_white", "179023_06C_CH_WT067C_white", "179024_03B_U_WT057U_white", "179024_03B_U_WT057U_white", "179025_07D_C_WT060U_white", "179025_07D_CH_WT075C_white", "179025_07D_CH_WT075C_white", "179025_07D_CH_WT075C_white", "179027_09D_C_WT067R_white", "179027_09D_C_WT067R_white", "179029_B3C_CH_WT102R_white", "179029_B3C_CH_WT103N_white", "179029_B3C_U_WT196R_white", "179030_11E_C_WT077S_white", "179030_11E_C_WT077S_white", "179030_11E_C_WT077S_white", "179030_11E_CH_WT108N_white", "179901_00_C_WT003P_white", "179901_00_C_WT003P_white", "179901_00_C_WT003P_white", "179901_CG_C_WT001P_white", "179901_CG_C_WT001P_white", "179901_CG_CH_WT002P_white"]
    const blackT3 = ["179015_04B_O_BK010C_black", "179015_04B_O_BK010C_black", "179015_04B_U_BK058R_black", "179015_04B_U_BK058R_black", "179015_04B_U_BK059C_black", "179015_04B_U_BK059C_black", "179015_04B_U_BK061C_black", "179015_04B_U_BK061C_black", "179016_04B_U_BK066C_black", "179016_04B_U_BK066C_black", "179019_02A_C_BK015S_black", "179019_02A_C_BK015S_black", "179020_05C_U_BK100U_black", "179020_05C_U_BK100U_black", "179023_06C_C_BK048R_black", "179023_06C_C_BK048R_black", "179023_06C_C_BK049U_black", "179023_06C_C_BK049U_black", "179024_04B_C_BK027U_black", "179024_04B_C_BK027U_black", "179024_04B_U_BK060C_black", "179024_04B_U_BK060C_black", "179024_04B_U_BK067C_black", "179024_04B_U_BK067C_black", "179024_B2B_C_BK054C_black", "179024_B2B_C_BK054C_black", "179024_B2B_U_BK128S_black_02", "179024_B2B_U_BK128S_black_02", "179024_B2B_U_BK129R_black", "179024_B2B_U_BK129R_black", "179027_09D_C_BK063R_black", "179027_09D_C_BK063R_black", "179027_09D_O_BK010N_black", "179027_09D_O_BK010N_black", "179027_09D_U_BK163S_black", "179027_09D_U_BK163S_black", "179027_09D_U_BK163S_black", "179029_06C_C_BK045U_black", "179029_06C_C_BK045U_black", "179029_B3C_C_BK071N_black", "179029_B3C_C_BK071N_black", "179029_B3C_U_BK184N_black", "179029_B3C_U_BK184N_black", "179029_B3C_U_BK184N_black", "179029_B3C_U_BK185N_black", "179029_B3C_U_BK185N_black", "179030_11E_U_BK194S_2_black", "179030_11E_U_BK194S_2_black", "179030_11E_U_BK194S_2_black", "179901_B2B_C_BK005P_black"]
    await Promise.all([...blackT3, ...whiteSpeed].map(loadPrototype))
    let ctx = TMP_CTX
    ctx = doTriggerEvent(ctx, {title:["このカードが場に出た場合"],cardIds:["PlayerA_51"]}) as GameStateWithFlowMemory
    if(getGlobalEffects(ctx, null).find(ge => ge.title[0] == "AddText" && ge.cardIds.includes("PlayerA_51")) == null){
        throw new Error()
    }

    const effects = getCardTexts(ctx, "PlayerA_51")
    console.log(effects)
    ctx = doTriggerEvent(ctx, {title:["このカードが攻撃に出撃した場合"],cardIds:["PlayerA_51"]}) as GameStateWithFlowMemory

    throw new Error()
    // ctx = clearActiveEffectID(ctx)
    // const flows = queryFlow(ctx, PlayerA)
    // console.log(flows)
    // const effects = createPlayCardEffects(ctx, "PlayerA_24")
    // if(effects.length != 1){
    //     console.log(effects)
    //     throw new Error()
    // }
    // let effect = effects[0]
    // const cets = createEffectTips(ctx, effect, 0, 0)
    // console.log(cets)
    // console.log("=======")
    // ctx = updateCommand(ctx) as GameStateWithFlowMemory
    // const cmds = getPlayerCommandsFilterNoErrorDistinct(ctx, PlayerA)
    // console.log(cmds.map(cmd=>cmd.tipOrErrors))
    // if(cmds.find(eff=>EffectFn.getCardID(getEffect(ctx,eff.effectId))== "PlayerA_24") == null){
    //     throw new Error()
    // }

    // ctx = setPhase(ctx, ["戦闘フェイズ", "ダメージ判定ステップ", "フリータイミング"]) as GameStateWithFlowMemory
    // if(createPlayEffects(ctx, PlayerA).filter(eff=>EffectFn.getCardID(eff) == "PlayerA_32").length != 1){
    //     throw new Error()
    // }

    // const ges = getGlobalEffects(ctx, null)
    // if(ges.find(ge=>ge.title[0] == "SpecialEffectBonus" && ge.cardIds.includes("PlayerA_13"))== null){
    //     throw new Error()
    // }
    // const ts = getCardTexts(ctx, "PlayerA_13")
    // ctx = updateCommand(ctx) as GameStateWithFlowMemory
    // let flows = queryFlow(ctx, PlayerA)
    // const flow = flows[0]
    // console.log(flow)
    // if(flow == null){
    //     throw new Error()
    // }
    // //console.log("===", ctx.stackEffect)
    // ctx = applyFlow(ctx, PlayerA, flow)
    //console.log("===", ctx.stackEffect)

    //flows = queryFlow(ctx, PlayerA)
    //throw new Error()
}

const TMP_CTX: GameStateWithFlowMemory = {
    "isGameState": true,
    "cards": {
        "PlayerA_0": {
            "id": "PlayerA_0",
            "protoID": "179001_01A_CH_WT006C_white",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_1": {
            "id": "PlayerA_1",
            "protoID": "179001_01A_CH_WT006C_white",
            "ownerID": "PlayerA",
            "isFaceDown": false,
            "isRoll": false
        },
        "PlayerA_2": {
            "id": "PlayerA_2",
            "protoID": "179001_01A_CH_WT006C_white",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_3": {
            "id": "PlayerA_3",
            "protoID": "179001_01A_CH_WT006C_white",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_4": {
            "id": "PlayerA_4",
            "protoID": "179003_01A_O_WT001C_white",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_5": {
            "id": "PlayerA_5",
            "protoID": "179003_01A_O_WT001C_white",
            "ownerID": "PlayerA",
            "isFaceDown": true,
            "isRoll": false
        },
        "PlayerA_6": {
            "id": "PlayerA_6",
            "protoID": "179003_01A_O_WT001C_white",
            "ownerID": "PlayerA",
            "isFaceDown": true,
            "isRoll": false
        },
        "PlayerA_7": {
            "id": "PlayerA_7",
            "protoID": "179003_01A_O_WT001C_white",
            "ownerID": "PlayerA",
            "isFaceDown": false,
            "isRoll": false
        },
        "PlayerA_8": {
            "id": "PlayerA_8",
            "protoID": "179003_01A_O_WT001C_white",
            "ownerID": "PlayerA",
            "isFaceDown": true,
            "isRoll": false
        },
        "PlayerA_9": {
            "id": "PlayerA_9",
            "protoID": "179003_01A_O_WT001C_white",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_10": {
            "id": "PlayerA_10",
            "protoID": "179003_01A_O_WT001C_white",
            "ownerID": "PlayerA",
            "isFaceDown": true,
            "isRoll": false
        },
        "PlayerA_11": {
            "id": "PlayerA_11",
            "protoID": "179003_01A_U_WT011C_white",
            "ownerID": "PlayerA",
            "isFaceDown": false,
            "isRoll": false
        },
        "PlayerA_12": {
            "id": "PlayerA_12",
            "protoID": "179003_01A_U_WT011C_white",
            "ownerID": "PlayerA",
            "isFaceDown": true,
            "isRoll": false
        },
        "PlayerA_13": {
            "id": "PlayerA_13",
            "protoID": "179003_01A_U_WT011C_white",
            "ownerID": "PlayerA",
            "isFaceDown": false,
            "isRoll": true
        },
        "PlayerA_14": {
            "id": "PlayerA_14",
            "protoID": "179003_01A_U_WT011C_white",
            "ownerID": "PlayerA",
            "isFaceDown": true,
            "isRoll": false
        },
        "PlayerA_15": {
            "id": "PlayerA_15",
            "protoID": "179009_03B_U_WT044U_white",
            "ownerID": "PlayerA",
            "isFaceDown": true,
            "isRoll": false
        },
        "PlayerA_16": {
            "id": "PlayerA_16",
            "protoID": "179009_03B_U_WT044U_white",
            "ownerID": "PlayerA",
            "isFaceDown": true,
            "isRoll": false
        },
        "PlayerA_17": {
            "id": "PlayerA_17",
            "protoID": "179009_03B_U_WT044U_white",
            "ownerID": "PlayerA",
            "isFaceDown": true,
            "isRoll": false
        },
        "PlayerA_18": {
            "id": "PlayerA_18",
            "protoID": "179009_03B_U_WT044U_white",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_19": {
            "id": "PlayerA_19",
            "protoID": "179009_03B_U_WT044U_white",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_20": {
            "id": "PlayerA_20",
            "protoID": "179009_03B_U_WT045U_white",
            "ownerID": "PlayerA",
            "isFaceDown": false,
            "isRoll": false
        },
        "PlayerA_21": {
            "id": "PlayerA_21",
            "protoID": "179009_03B_U_WT045U_white",
            "ownerID": "PlayerA",
            "isFaceDown": true,
            "isRoll": false
        },
        "PlayerA_22": {
            "id": "PlayerA_22",
            "protoID": "179009_03B_U_WT045U_white",
            "ownerID": "PlayerA",
            "isFaceDown": true,
            "isRoll": false
        },
        "PlayerA_23": {
            "id": "PlayerA_23",
            "protoID": "179009_03B_U_WT045U_white",
            "ownerID": "PlayerA",
            "isFaceDown": true,
            "isRoll": false
        },
        "PlayerA_24": {
            "id": "PlayerA_24",
            "protoID": "179015_04B_O_WT005U_white",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_25": {
            "id": "PlayerA_25",
            "protoID": "179015_04B_O_WT005U_white",
            "ownerID": "PlayerA",
            "isFaceDown": true,
            "isRoll": false
        },
        "PlayerA_26": {
            "id": "PlayerA_26",
            "protoID": "179015_04B_O_WT005U_white",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_27": {
            "id": "PlayerA_27",
            "protoID": "179019_01A_U_WT003C_white",
            "ownerID": "PlayerA",
            "isFaceDown": false,
            "isRoll": false
        },
        "PlayerA_28": {
            "id": "PlayerA_28",
            "protoID": "179019_01A_U_WT003C_white",
            "ownerID": "PlayerA",
            "isFaceDown": false,
            "isRoll": true
        },
        "PlayerA_29": {
            "id": "PlayerA_29",
            "protoID": "179019_01A_U_WT003C_white",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_30": {
            "id": "PlayerA_30",
            "protoID": "179019_02A_C_WT012U_white",
            "ownerID": "PlayerA",
            "isFaceDown": true,
            "isRoll": false
        },
        "PlayerA_31": {
            "id": "PlayerA_31",
            "protoID": "179019_02A_C_WT012U_white",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_32": {
            "id": "PlayerA_32",
            "protoID": "179019_02A_C_WT012U_white",
            "ownerID": "PlayerA",
            "isFaceDown": false,
            "isRoll": false
        },
        "PlayerA_33": {
            "id": "PlayerA_33",
            "protoID": "179019_02A_U_WT031C_white",
            "ownerID": "PlayerA",
            "isFaceDown": false,
            "isRoll": true
        },
        "PlayerA_34": {
            "id": "PlayerA_34",
            "protoID": "179019_02A_U_WT031C_white",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_35": {
            "id": "PlayerA_35",
            "protoID": "179019_02A_U_WT031C_white",
            "ownerID": "PlayerA",
            "isFaceDown": true,
            "isRoll": false
        },
        "PlayerA_36": {
            "id": "PlayerA_36",
            "protoID": "179023_06C_C_WT055C_white",
            "ownerID": "PlayerA",
            "isFaceDown": true,
            "isRoll": false
        },
        "PlayerA_37": {
            "id": "PlayerA_37",
            "protoID": "179023_06C_C_WT055C_white",
            "ownerID": "PlayerA",
            "isFaceDown": true,
            "isRoll": false
        },
        "PlayerA_38": {
            "id": "PlayerA_38",
            "protoID": "179023_06C_C_WT055C_white",
            "ownerID": "PlayerA",
            "isFaceDown": false,
            "isRoll": false
        },
        "PlayerA_39": {
            "id": "PlayerA_39",
            "protoID": "179024_03B_U_WT039R_white",
            "ownerID": "PlayerA",
            "isFaceDown": true,
            "isRoll": false
        },
        "PlayerA_40": {
            "id": "PlayerA_40",
            "protoID": "179024_03B_U_WT039R_white",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_41": {
            "id": "PlayerA_41",
            "protoID": "179024_03B_U_WT039R_white",
            "ownerID": "PlayerA",
            "isFaceDown": false,
            "isRoll": false
        },
        "PlayerA_42": {
            "id": "PlayerA_42",
            "protoID": "179024_03B_U_WT042U_white",
            "ownerID": "PlayerA",
            "isFaceDown": true,
            "isRoll": false
        },
        "PlayerA_43": {
            "id": "PlayerA_43",
            "protoID": "179024_03B_U_WT042U_white",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_44": {
            "id": "PlayerA_44",
            "protoID": "179024_03B_U_WT042U_white",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_45": {
            "id": "PlayerA_45",
            "protoID": "179025_07D_CH_WT075C_white",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_46": {
            "id": "PlayerA_46",
            "protoID": "179025_07D_CH_WT075C_white",
            "ownerID": "PlayerA",
            "isFaceDown": false,
            "isRoll": false
        },
        "PlayerA_47": {
            "id": "PlayerA_47",
            "protoID": "179027_09D_O_WT014N_white",
            "ownerID": "PlayerA",
            "isFaceDown": true,
            "isRoll": false
        },
        "PlayerA_48": {
            "id": "PlayerA_48",
            "protoID": "179027_09D_O_WT014N_white",
            "ownerID": "PlayerA",
            "isFaceDown": false,
            "isRoll": false
        },
        "PlayerA_49": {
            "id": "PlayerA_49",
            "protoID": "179027_09D_O_WT014N_white",
            "ownerID": "PlayerA",
            "isFaceDown": false,
            "isRoll": false
        },
        "PlayerA_50": {
            "id": "PlayerA_50",
            "protoID": "179028_10D_CH_WT095_white",
            "ownerID": "PlayerA",
            "isFaceDown": true,
            "isRoll": false
        },
        "PlayerA_51": {
            "id": "PlayerA_51",
            "protoID": "179028_10D_U_WT177R_white",
            "ownerID": "PlayerA",
            "isFaceDown": false,
            "isRoll": true
        },
        "PlayerA_52": {
            "id": "PlayerA_52",
            "protoID": "179030_11E_C_WT077S_white",
            "ownerID": "PlayerA",
            "isFaceDown": true,
            "isRoll": false
        },
        "PlayerA_53": {
            "id": "PlayerA_53",
            "protoID": "179030_11E_C_WT077S_white",
            "ownerID": "PlayerA",
            "isFaceDown": true,
            "isRoll": false
        },
        "PlayerA_54": {
            "id": "PlayerA_54",
            "protoID": "179030_11E_C_WT077S_white",
            "ownerID": "PlayerA",
            "isFaceDown": false,
            "isRoll": true
        },
        "PlayerA_55": {
            "id": "PlayerA_55",
            "protoID": "179030_11E_C_WT078R_white",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_56": {
            "id": "PlayerA_56",
            "protoID": "179030_11E_C_WT078R_white",
            "ownerID": "PlayerA",
            "isFaceDown": true,
            "isRoll": false
        },
        "PlayerA_57": {
            "id": "PlayerA_57",
            "protoID": "179030_11E_C_WT078R_white",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_58": {
            "id": "PlayerA_58",
            "protoID": "179901_00_U_WT001P_white_02",
            "ownerID": "PlayerA",
            "isFaceDown": true,
            "isRoll": false
        },
        "PlayerA_59": {
            "id": "PlayerA_59",
            "protoID": "179901_00_U_WT001P_white_02",
            "ownerID": "PlayerA",
            "isFaceDown": false,
            "isRoll": false
        },
        "PlayerA_60": {
            "id": "PlayerA_60",
            "protoID": "179901_00_U_WT001P_white_02",
            "ownerID": "PlayerA",
            "isFaceDown": true,
            "isRoll": false
        },
        "PlayerB_61": {
            "id": "PlayerB_61",
            "protoID": "179001_01A_CH_WT007R_white",
            "ownerID": "PlayerB",
            "isFaceDown": true,
            "isRoll": false
        },
        "PlayerB_62": {
            "id": "PlayerB_62",
            "protoID": "179004_01A_CH_WT009R_white",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "PlayerB_63": {
            "id": "PlayerB_63",
            "protoID": "179004_01A_CH_WT010C_white",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "PlayerB_64": {
            "id": "PlayerB_64",
            "protoID": "179007_02A_U_WT027U_white",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "PlayerB_65": {
            "id": "PlayerB_65",
            "protoID": "179007_02A_U_WT027U_white",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "PlayerB_66": {
            "id": "PlayerB_66",
            "protoID": "179008_02A_U_WT034U_white",
            "ownerID": "PlayerB",
            "isFaceDown": false,
            "isRoll": false
        },
        "PlayerB_67": {
            "id": "PlayerB_67",
            "protoID": "179008_02A_U_WT034U_white",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "PlayerB_68": {
            "id": "PlayerB_68",
            "protoID": "179008_02A_U_WT034U_white",
            "ownerID": "PlayerB",
            "isFaceDown": false,
            "isRoll": false
        },
        "PlayerB_69": {
            "id": "PlayerB_69",
            "protoID": "179014_03B_CH_WT027R_white",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "PlayerB_70": {
            "id": "PlayerB_70",
            "protoID": "179015_04B_U_WT067C_white",
            "ownerID": "PlayerB",
            "isFaceDown": false,
            "isRoll": false
        },
        "PlayerB_71": {
            "id": "PlayerB_71",
            "protoID": "179015_04B_U_WT067C_white",
            "ownerID": "PlayerB",
            "isFaceDown": false,
            "isRoll": false
        },
        "PlayerB_72": {
            "id": "PlayerB_72",
            "protoID": "179015_04B_U_WT067C_white",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "PlayerB_73": {
            "id": "PlayerB_73",
            "protoID": "179016_04B_U_WT074C_white",
            "ownerID": "PlayerB",
            "isFaceDown": true,
            "isRoll": false
        },
        "PlayerB_74": {
            "id": "PlayerB_74",
            "protoID": "179016_04B_U_WT074C_white",
            "ownerID": "PlayerB",
            "isFaceDown": false,
            "isRoll": true
        },
        "PlayerB_75": {
            "id": "PlayerB_75",
            "protoID": "179016_04B_U_WT074C_white",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "PlayerB_76": {
            "id": "PlayerB_76",
            "protoID": "179016_04B_U_WT075C_white",
            "ownerID": "PlayerB",
            "isFaceDown": false,
            "isRoll": false
        },
        "PlayerB_77": {
            "id": "PlayerB_77",
            "protoID": "179016_04B_U_WT075C_white",
            "ownerID": "PlayerB",
            "isFaceDown": false,
            "isRoll": false
        },
        "PlayerB_78": {
            "id": "PlayerB_78",
            "protoID": "179016_04B_U_WT075C_white",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "PlayerB_79": {
            "id": "PlayerB_79",
            "protoID": "179019_01A_C_WT010C_white",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "PlayerB_80": {
            "id": "PlayerB_80",
            "protoID": "179019_01A_C_WT010C_white",
            "ownerID": "PlayerB",
            "isFaceDown": true,
            "isRoll": false
        },
        "PlayerB_81": {
            "id": "PlayerB_81",
            "protoID": "179019_02A_U_WT028R_white",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "PlayerB_82": {
            "id": "PlayerB_82",
            "protoID": "179019_02A_U_WT028R_white",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "PlayerB_83": {
            "id": "PlayerB_83",
            "protoID": "179022_06C_CH_WT057R_white",
            "ownerID": "PlayerB",
            "isFaceDown": false,
            "isRoll": false
        },
        "PlayerB_84": {
            "id": "PlayerB_84",
            "protoID": "179022_06C_CH_WT057R_white",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "PlayerB_85": {
            "id": "PlayerB_85",
            "protoID": "179022_06C_CH_WT057R_white",
            "ownerID": "PlayerB",
            "isFaceDown": false,
            "isRoll": false
        },
        "PlayerB_86": {
            "id": "PlayerB_86",
            "protoID": "179022_06C_U_WT113R_white",
            "ownerID": "PlayerB",
            "isFaceDown": false,
            "isRoll": false
        },
        "PlayerB_87": {
            "id": "PlayerB_87",
            "protoID": "179022_06C_U_WT113R_white",
            "ownerID": "PlayerB",
            "isFaceDown": false,
            "isRoll": false
        },
        "PlayerB_88": {
            "id": "PlayerB_88",
            "protoID": "179022_06C_U_WT113R_white",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "PlayerB_89": {
            "id": "PlayerB_89",
            "protoID": "179023_06C_CH_WT067C_white",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "PlayerB_90": {
            "id": "PlayerB_90",
            "protoID": "179024_03B_U_WT057U_white",
            "ownerID": "PlayerB",
            "isFaceDown": false,
            "isRoll": false
        },
        "PlayerB_91": {
            "id": "PlayerB_91",
            "protoID": "179024_03B_U_WT057U_white",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "PlayerB_92": {
            "id": "PlayerB_92",
            "protoID": "179025_07D_C_WT060U_white",
            "ownerID": "PlayerB",
            "isFaceDown": false,
            "isRoll": false
        },
        "PlayerB_93": {
            "id": "PlayerB_93",
            "protoID": "179025_07D_CH_WT075C_white",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "PlayerB_94": {
            "id": "PlayerB_94",
            "protoID": "179025_07D_CH_WT075C_white",
            "ownerID": "PlayerB",
            "isFaceDown": false,
            "isRoll": false
        },
        "PlayerB_95": {
            "id": "PlayerB_95",
            "protoID": "179025_07D_CH_WT075C_white",
            "ownerID": "PlayerB",
            "isFaceDown": false,
            "isRoll": false
        },
        "PlayerB_96": {
            "id": "PlayerB_96",
            "protoID": "179027_09D_C_WT067R_white",
            "ownerID": "PlayerB",
            "isFaceDown": true,
            "isRoll": false
        },
        "PlayerB_97": {
            "id": "PlayerB_97",
            "protoID": "179027_09D_C_WT067R_white",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "PlayerB_98": {
            "id": "PlayerB_98",
            "protoID": "179029_B3C_CH_WT102R_white",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "PlayerB_99": {
            "id": "PlayerB_99",
            "protoID": "179029_B3C_CH_WT103N_white",
            "ownerID": "PlayerB",
            "isFaceDown": true,
            "isRoll": false
        },
        "PlayerB_100": {
            "id": "PlayerB_100",
            "protoID": "179029_B3C_U_WT196R_white",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "PlayerB_101": {
            "id": "PlayerB_101",
            "protoID": "179030_11E_C_WT077S_white",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "PlayerB_102": {
            "id": "PlayerB_102",
            "protoID": "179030_11E_C_WT077S_white",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "PlayerB_103": {
            "id": "PlayerB_103",
            "protoID": "179030_11E_C_WT077S_white",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "PlayerB_104": {
            "id": "PlayerB_104",
            "protoID": "179030_11E_CH_WT108N_white",
            "ownerID": "PlayerB",
            "isFaceDown": false,
            "isRoll": true
        },
        "PlayerB_105": {
            "id": "PlayerB_105",
            "protoID": "179901_00_C_WT003P_white",
            "ownerID": "PlayerB",
            "isFaceDown": false,
            "isRoll": false
        },
        "PlayerB_106": {
            "id": "PlayerB_106",
            "protoID": "179901_00_C_WT003P_white",
            "ownerID": "PlayerB",
            "isFaceDown": false,
            "isRoll": false
        },
        "PlayerB_107": {
            "id": "PlayerB_107",
            "protoID": "179901_00_C_WT003P_white",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "PlayerB_108": {
            "id": "PlayerB_108",
            "protoID": "179901_CG_C_WT001P_white",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "PlayerB_109": {
            "id": "PlayerB_109",
            "protoID": "179901_CG_C_WT001P_white",
            "ownerID": "PlayerB",
            "isFaceDown": true,
            "isRoll": false
        },
        "PlayerB_110": {
            "id": "PlayerB_110",
            "protoID": "179901_CG_CH_WT002P_white",
            "ownerID": "PlayerB",
            "isFaceDown": true
        }
    },
    "effects": {
        "createPlayEffects_PlayerA_PlayerA_7_loadPrototype_179003_01A_O_WT001C_white_text_0": {
            "id": "createPlayEffects_PlayerA_PlayerA_7_loadPrototype_179003_01A_O_WT001C_white_text_0",
            "reason": [
                "PlayText",
                "PlayerA",
                "PlayerA_7",
                "loadPrototype_179003_01A_O_WT001C_white_text_0"
            ],
            "description": "（敵軍戦闘フェイズ）〔白２毎〕：自軍ユニット１枚は、ターン終了時まで「速攻」、または「高機動」１つを得る。",
            "text": {
                "id": "loadPrototype_179003_01A_O_WT001C_white_text_0",
                "description": "（敵軍戦闘フェイズ）〔白２毎〕：自軍ユニット１枚は、ターン終了時まで「速攻」、または「高機動」１つを得る。",
                "title": [
                    "使用型",
                    [
                        "敵軍",
                        "戦闘フェイズ"
                    ]
                ],
                "isEachTime": true,
                "conditions": {
                    "0[白]": {
                        "title": [
                            "RollColor",
                            "白"
                        ],
                        "actions": [
                            {
                                "title": [
                                    "_ロールする",
                                    "ロール"
                                ],
                                "vars": [
                                    "0[白]"
                                ]
                            }
                        ]
                    },
                    "1[白]": {
                        "title": [
                            "RollColor",
                            "白"
                        ],
                        "actions": [
                            {
                                "title": [
                                    "_ロールする",
                                    "ロール"
                                ],
                                "vars": [
                                    "1[白]"
                                ]
                            }
                        ]
                    },
                    "自軍ユニット１枚": {
                        "title": [
                            "_自軍_ユニット_１枚",
                            "自軍",
                            "ユニット",
                            1
                        ]
                    },
                    "「速攻」、または「高機動」１つ": {
                        "title": "function _(ctx, effect, { DefineFn, GameStateFn }) {\n                        const ge1 = {\n                            title: [\"AddText\", {\n                                    id: `179003_01A_O_WT001C_white_gain_1`,\n                                    title: [\"特殊型\", [\"速攻\"]],\n                                    description: \"速攻\"\n                                }],\n                            cardIds: []\n                        };\n                        const ge2 = {\n                            title: [\"AddText\", {\n                                    id: `179003_01A_O_WT001C_white_gain_2`,\n                                    title: [\"特殊型\", [\"高機動\"]],\n                                    description: \"高機動\"\n                                }],\n                            cardIds: []\n                        };\n                        return {\n                            title: [\"GlobalEffects\", [ge1, ge2], [ge1]],\n                            count: 1\n                        };\n                    }"
                    },
                    "同回合上限": {
                        "actions": [
                            {
                                "title": [
                                    "同回合上限",
                                    1
                                ]
                            }
                        ]
                    }
                },
                "logicTreeActions": [
                    {
                        "actions": [
                            {
                                "title": [
                                    "cutIn",
                                    [
                                        {
                                            "title": "function _(ctx, effect, { DefineFn, GameStateFn }) {\n                                            const cardId = DefineFn.EffectFn.getCardID(effect);\n                                            const pairs = GameStateFn.getCardTipStrBaSyouPairs(ctx, \"自軍ユニット１枚\", cardId);\n                                            const selections = GameStateFn.getCardTipSelection(ctx, \"「速攻」、または「高機動」１つ\", cardId);\n                                            pairs.forEach(pair => {\n                                                selections.forEach(ge => {\n                                                    ge.cardIds = [pair[0]];\n                                                    ctx = GameStateFn.doItemSetGlobalEffectsUntilEndOfTurn(ctx, [ge], pair);\n                                                });\n                                            });\n                                            return ctx;\n                                        }"
                                        }
                                    ]
                                ]
                            }
                        ]
                    }
                ]
            }
        },
        "createPlayEffects_PlayerA_PlayerA_41_loadPrototype_179024_03B_U_WT039R_white_text_2": {
            "id": "createPlayEffects_PlayerA_PlayerA_41_loadPrototype_179024_03B_U_WT039R_white_text_2",
            "reason": [
                "PlayText",
                "PlayerA",
                "PlayerA_41",
                "loadPrototype_179024_03B_U_WT039R_white_text_2"
            ],
            "description": "打開自軍手裡或指定HANGER中特徵A並合計國力x以下的1張卡, 和這張卡重置狀態置換, 這張卡置換後廢棄. x為自軍G的張數",
            "text": {
                "id": "loadPrototype_179024_03B_U_WT039R_white_text_2",
                "title": [
                    "使用型",
                    [
                        "戦闘フェイズ"
                    ]
                ],
                "description": "打開自軍手裡或指定HANGER中特徵A並合計國力x以下的1張卡, 和這張卡重置狀態置換, 這張卡置換後廢棄. x為自軍G的張數",
                "conditions": {
                    "打開自軍手裡或指定HANGER中特徵A並合計國力x以下的1張卡": {
                        "title": "function _(ctx3, effect, bridge) {\n                const { A: A2 } = {\"A\":\"デスサイズ系\"};\n                if (A2 == \"\")\n                  throw new Error(\"A\\u6C92\\u6709\\u88AB\\u5B57\\u4E32\\u7F6E\\u63DB\");\n                const { GameStateFn, DefineFn } = bridge, cardId2 = DefineFn.EffectFn.getCardID(effect), cardController = GameStateFn.getItemController(ctx3, cardId2), gCount = GameStateFn.getItemIdsByBasyou(ctx3, DefineFn.AbsoluteBaSyouFn.of(cardController, \"G\\u30BE\\u30FC\\u30F3\")).length;\n                return GameStateFn.createConditionTitleFn({\n                  title: [\"\\u6253\\u958B\\u81EA\\u8ECD\\u624B\\u88E1\\u6216\\u6307\\u5B9AHANGER\\u4E2D\\u7279\\u5FB5_A\\u4E26\\u5408\\u8A08\\u570B\\u529B_x\\u4EE5\\u4E0B\\u7684_1\\u5F35\\u5361\", A2, gCount, 1]\n                }, {})(ctx3, effect, bridge);\n              }"
                    },
                    "同回合上限": {
                        "actions": [
                            {
                                "title": [
                                    "同回合上限",
                                    1
                                ]
                            }
                        ]
                    }
                },
                "logicTreeActions": [
                    {
                        "actions": [
                            {
                                "title": "function _(ctx3, effect, { GameStateFn, DefineFn }) {\n                    const newE = DefineFn.EffectFn.fromEffectBasic(effect, {\n                      logicTreeAction: {\n                        actions: [\n                          {\n                            title: function _(ctx4, effect2, { GameStateFn: GameStateFn2, DefineFn: DefineFn2 }) {\n                              const cardId2 = DefineFn2.EffectFn.getCardID(effect2), basyou = GameStateFn2.getItemBaSyou(ctx4, cardId2), pairs = GameStateFn2.getCardTipStrBaSyouPairs(ctx4, \"\\u6253\\u958B\\u81EA\\u8ECD\\u624B\\u88E1\\u6216\\u6307\\u5B9AHANGER\\u4E2D\\u7279\\u5FB5A\\u4E26\\u5408\\u8A08\\u570B\\u529Bx\\u4EE5\\u4E0B\\u76841\\u5F35\\u5361\", cardId2);\n                              if (pairs.length == 0)\n                                throw new Error(`pairs must not 0: ${effect2.text.description}`);\n                              const targetPair = pairs[0];\n                              return GameStateFn2.assertTargetMissingError(ctx4, targetPair), ctx4 = GameStateFn2.doItemSwap(ctx4, [cardId2, basyou], targetPair), ctx4 = GameStateFn2.doItemSetRollState(ctx4, !1, [cardId2, basyou], { isSkipTargetMissing: !0 }), ctx4 = GameStateFn2.doItemMove(ctx4, DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(basyou, \"\\u30B8\\u30E3\\u30F3\\u30AF\\u30E4\\u30FC\\u30C9\"), targetPair), ctx4 = GameStateFn2.doTriggerEvent(ctx4, { title: [\"\\u300C\\u6539\\u88C5\\u300D\\u306E\\u52B9\\u679C\\u3067\\u5EC3\\u68C4\\u3055\\u308C\\u308B\\u5834\\u5408\"], cardIds: [targetPair[0]] }), ctx4 = GameStateFn2.doTriggerEvent(ctx4, { title: [\"\\u300C\\u6539\\u88C5\\u300D\\u306E\\u52B9\\u679C\\u3067\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId2] }), ctx4;\n                            }.toString()\n                          }\n                        ]\n                      }\n                    });\n                    return ctx3 = GameStateFn.addStackEffect(ctx3, newE), ctx3;\n                  }"
                            }
                        ]
                    }
                ]
            }
        },
        "createPlayEffects_PlayerA_PlayerA_51_loadPrototype_179028_10D_U_WT177R_white_text_4": {
            "id": "createPlayEffects_PlayerA_PlayerA_51_loadPrototype_179028_10D_U_WT177R_white_text_4",
            "reason": [
                "PlayText",
                "PlayerA",
                "PlayerA_51",
                "loadPrototype_179028_10D_U_WT177R_white_text_4"
            ],
            "description": "打開自軍手裡或指定HANGER中特徵A並合計國力x以下的1張卡, 和這張卡重置狀態置換, 這張卡置換後廢棄. x為自軍G的張數",
            "text": {
                "id": "loadPrototype_179028_10D_U_WT177R_white_text_4",
                "title": [
                    "使用型",
                    [
                        "戦闘フェイズ"
                    ]
                ],
                "description": "打開自軍手裡或指定HANGER中特徵A並合計國力x以下的1張卡, 和這張卡重置狀態置換, 這張卡置換後廢棄. x為自軍G的張數",
                "conditions": {
                    "打開自軍手裡或指定HANGER中特徵A並合計國力x以下的1張卡": {
                        "title": "function _(ctx3, effect, bridge) {\n                const { A: A2 } = {\"A\":\"ウイング系\"};\n                if (A2 == \"\")\n                  throw new Error(\"A\\u6C92\\u6709\\u88AB\\u5B57\\u4E32\\u7F6E\\u63DB\");\n                const { GameStateFn, DefineFn } = bridge, cardId2 = DefineFn.EffectFn.getCardID(effect), cardController = GameStateFn.getItemController(ctx3, cardId2), gCount = GameStateFn.getItemIdsByBasyou(ctx3, DefineFn.AbsoluteBaSyouFn.of(cardController, \"G\\u30BE\\u30FC\\u30F3\")).length;\n                return GameStateFn.createConditionTitleFn({\n                  title: [\"\\u6253\\u958B\\u81EA\\u8ECD\\u624B\\u88E1\\u6216\\u6307\\u5B9AHANGER\\u4E2D\\u7279\\u5FB5_A\\u4E26\\u5408\\u8A08\\u570B\\u529B_x\\u4EE5\\u4E0B\\u7684_1\\u5F35\\u5361\", A2, gCount, 1]\n                }, {})(ctx3, effect, bridge);\n              }"
                    },
                    "同回合上限": {
                        "actions": [
                            {
                                "title": [
                                    "同回合上限",
                                    1
                                ]
                            }
                        ]
                    }
                },
                "logicTreeActions": [
                    {
                        "actions": [
                            {
                                "title": "function _(ctx3, effect, { GameStateFn, DefineFn }) {\n                    const newE = DefineFn.EffectFn.fromEffectBasic(effect, {\n                      logicTreeAction: {\n                        actions: [\n                          {\n                            title: function _(ctx4, effect2, { GameStateFn: GameStateFn2, DefineFn: DefineFn2 }) {\n                              const cardId2 = DefineFn2.EffectFn.getCardID(effect2), basyou = GameStateFn2.getItemBaSyou(ctx4, cardId2), pairs = GameStateFn2.getCardTipStrBaSyouPairs(ctx4, \"\\u6253\\u958B\\u81EA\\u8ECD\\u624B\\u88E1\\u6216\\u6307\\u5B9AHANGER\\u4E2D\\u7279\\u5FB5A\\u4E26\\u5408\\u8A08\\u570B\\u529Bx\\u4EE5\\u4E0B\\u76841\\u5F35\\u5361\", cardId2);\n                              if (pairs.length == 0)\n                                throw new Error(`pairs must not 0: ${effect2.text.description}`);\n                              const targetPair = pairs[0];\n                              return GameStateFn2.assertTargetMissingError(ctx4, targetPair), ctx4 = GameStateFn2.doItemSwap(ctx4, [cardId2, basyou], targetPair), ctx4 = GameStateFn2.doItemSetRollState(ctx4, !1, [cardId2, basyou], { isSkipTargetMissing: !0 }), ctx4 = GameStateFn2.doItemMove(ctx4, DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(basyou, \"\\u30B8\\u30E3\\u30F3\\u30AF\\u30E4\\u30FC\\u30C9\"), targetPair), ctx4 = GameStateFn2.doTriggerEvent(ctx4, { title: [\"\\u300C\\u6539\\u88C5\\u300D\\u306E\\u52B9\\u679C\\u3067\\u5EC3\\u68C4\\u3055\\u308C\\u308B\\u5834\\u5408\"], cardIds: [targetPair[0]] }), ctx4 = GameStateFn2.doTriggerEvent(ctx4, { title: [\"\\u300C\\u6539\\u88C5\\u300D\\u306E\\u52B9\\u679C\\u3067\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId2] }), ctx4;\n                            }.toString()\n                          }\n                        ]\n                      }\n                    });\n                    return ctx3 = GameStateFn.addStackEffect(ctx3, newE), ctx3;\n                  }"
                            }
                        ]
                    }
                ]
            }
        },
        "createPlayEffects_PlayerB_PlayerB_104_loadPrototype_179030_11E_CH_WT108N_white_text_0": {
            "id": "createPlayEffects_PlayerB_PlayerB_104_loadPrototype_179030_11E_CH_WT108N_white_text_0",
            "reason": [
                "PlayText",
                "PlayerB",
                "PlayerB_104",
                "loadPrototype_179030_11E_CH_WT108N_white_text_0"
            ],
            "description": "（攻撃ステップ）〔R〕：自軍キャラ１枚は、ターン終了時まで「高機動」を得る。",
            "text": {
                "id": "loadPrototype_179030_11E_CH_WT108N_white_text_0",
                "description": "（攻撃ステップ）〔R〕：自軍キャラ１枚は、ターン終了時まで「高機動」を得る。",
                "title": [
                    "使用型",
                    [
                        "攻撃ステップ"
                    ]
                ],
                "conditions": {
                    "〔R〕": {
                        "actions": [
                            {
                                "title": [
                                    "_ロールする",
                                    "ロール"
                                ]
                            }
                        ]
                    },
                    "自軍キャラ１枚": {
                        "title": [
                            "_自軍_ユニット_１枚",
                            "自軍",
                            "キャラクター",
                            1
                        ]
                    },
                    "同回合上限": {
                        "actions": [
                            {
                                "title": [
                                    "同回合上限",
                                    1
                                ]
                            }
                        ]
                    }
                },
                "logicTreeActions": [
                    {
                        "actions": [
                            {
                                "title": [
                                    "cutIn",
                                    [
                                        {
                                            "title": [
                                                "ターン終了時まで「速攻」を得る。",
                                                [
                                                    {
                                                        "title": [
                                                            "AddText",
                                                            {
                                                                "id": "",
                                                                "title": [
                                                                    "特殊型",
                                                                    [
                                                                        "高機動"
                                                                    ]
                                                                ]
                                                            }
                                                        ],
                                                        "cardIds": []
                                                    }
                                                ]
                                            ],
                                            "vars": [
                                                "自軍キャラ１枚"
                                            ]
                                        }
                                    ]
                                ]
                            }
                        ]
                    }
                ]
            }
        }
    },
    "table": {
        "cardStack": {
            "[\"PlayerA\",\"本国\"]": [
                "PlayerA_29",
                "PlayerA_40",
                "PlayerA_4",
                "PlayerA_2",
                "PlayerA_43",
                "PlayerA_19",
                "PlayerA_18",
                "PlayerA_44",
                "PlayerA_0",
                "PlayerA_24",
                "PlayerA_57",
                "PlayerA_9",
                "PlayerA_31",
                "PlayerA_55",
                "PlayerA_45",
                "PlayerA_3",
                "PlayerA_26",
                "PlayerA_34"
            ],
            "[\"PlayerB\",\"本国\"]": [
                "PlayerB_78",
                "PlayerB_107",
                "PlayerB_91",
                "PlayerB_64",
                "PlayerB_65",
                "PlayerB_84",
                "PlayerB_102",
                "PlayerB_88",
                "PlayerB_98",
                "PlayerB_81",
                "PlayerB_100",
                "PlayerB_108",
                "PlayerB_82",
                "PlayerB_69",
                "PlayerB_103",
                "PlayerB_110",
                "PlayerB_97",
                "PlayerB_67",
                "PlayerB_101",
                "PlayerB_79",
                "PlayerB_89",
                "PlayerB_63",
                "PlayerB_62",
                "PlayerB_75",
                "PlayerB_93",
                "PlayerB_72"
            ],
            "[\"PlayerA\",\"手札\"]": [],
            "[\"PlayerB\",\"手札\"]": [
                "PlayerB_109",
                "PlayerB_61"
            ],
            "[\"PlayerA\",\"Gゾーン\"]": [
                "PlayerA_28",
                "PlayerA_54",
                "PlayerA_13",
                "PlayerA_27",
                "PlayerA_46",
                "PlayerA_11",
                "PlayerA_48"
            ],
            "[\"PlayerB\",\"Gゾーン\"]": [
                "PlayerB_87",
                "PlayerB_85",
                "PlayerB_95",
                "PlayerB_76",
                "PlayerB_77",
                "PlayerB_83",
                "PlayerB_68",
                "PlayerB_66",
                "PlayerB_94"
            ],
            "[\"PlayerB\",\"プレイされているカード\"]": [],
            "[\"PlayerB\",\"配備エリア\"]": [
                "PlayerB_74",
                "PlayerB_104"
            ],
            "[\"PlayerA\",\"プレイされているカード\"]": [],
            "[\"PlayerA\",\"配備エリア\"]": [
                "PlayerA_7",
                "PlayerA_49",
                "PlayerA_41",
                "PlayerA_33",
                "PlayerA_51"
            ],
            "[\"PlayerB\",\"ジャンクヤード\"]": [
                "PlayerB_71",
                "PlayerB_70",
                "PlayerB_92",
                "PlayerB_106",
                "PlayerB_105",
                "PlayerB_86",
                "PlayerB_90"
            ],
            "[\"PlayerB\",\"戦闘エリア1\"]": [],
            "[\"PlayerB\",\"戦闘エリア2\"]": [],
            "[\"PlayerA\",\"ジャンクヤード\"]": [
                "PlayerA_32",
                "PlayerA_1",
                "PlayerA_59",
                "PlayerA_20",
                "PlayerA_38"
            ],
            "[\"PlayerA\",\"捨て山\"]": [
                "PlayerA_8",
                "PlayerA_15",
                "PlayerA_39",
                "PlayerA_37",
                "PlayerA_60",
                "PlayerA_35",
                "PlayerA_23",
                "PlayerA_30",
                "PlayerA_16",
                "PlayerA_22",
                "PlayerA_58",
                "PlayerA_5",
                "PlayerA_25",
                "PlayerA_50",
                "PlayerA_6",
                "PlayerA_56",
                "PlayerA_52",
                "PlayerA_14",
                "PlayerA_12",
                "PlayerA_21",
                "PlayerA_36",
                "PlayerA_42",
                "PlayerA_10",
                "PlayerA_47",
                "PlayerA_53",
                "PlayerA_17"
            ],
            "[\"PlayerA\",\"戦闘エリア1\"]": [],
            "[\"PlayerA\",\"ハンガー\"]": [],
            "[\"PlayerB\",\"捨て山\"]": [
                "PlayerB_73",
                "PlayerB_80",
                "PlayerB_99",
                "PlayerB_96"
            ]
        }
    },
    "chips": {},
    "chipProtos": {},
    "itemStates": {
        "SystemFakeCardID_createAttackPhaseRuleEffect_text_PlayerB": {
            "id": "SystemFakeCardID_createAttackPhaseRuleEffect_text_PlayerB",
            "damage": 0,
            "destroyReason": null,
            "flags": {},
            "tips": {
                "去宇宙": {
                    "title": [
                        "カード",
                        [],
                        []
                    ],
                    "flags": {
                        "isGoBattleArea2": true
                    }
                },
                "去地球": {
                    "title": [
                        "カード",
                        [],
                        []
                    ],
                    "flags": {
                        "isGoBattleArea1": true
                    }
                }
            },
            "globalEffects": {},
            "varNamesRemoveOnTurnEnd": {},
            "isOpenForGain": false,
            "isCheat": false,
            "isFirstTurn": false,
            "textIdsUseThisTurn": [],
            "isAttack": false,
            "isDefence": false
        },
        "PlayerB_74": {
            "id": "PlayerB_74",
            "damage": 0,
            "destroyReason": null,
            "flags": {},
            "tips": {
                "橫置支付0[白]": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerB_87",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_85",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_95",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ]
                        ],
                        [
                            [
                                "PlayerB_87",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ]
                        ]
                    ],
                    "min": 1
                },
                "合計国力〔x〕": {
                    "title": [
                        "カード",
                        [],
                        [
                            [
                                "PlayerB_87",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_85",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_95",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ]
                        ]
                    ]
                },
                "橫置支付0[null]": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerB_95",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_76",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_77",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_83",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_68",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ]
                        ],
                        [
                            [
                                "PlayerB_95",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ]
                        ]
                    ],
                    "min": 1
                },
                "橫置支付1[null]": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerB_76",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_77",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_83",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_68",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ]
                        ],
                        [
                            [
                                "PlayerB_76",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ]
                        ]
                    ],
                    "min": 1
                },
                "0[null]": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerB_76",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_77",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_83",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_68",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_66",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_94",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ]
                        ],
                        [
                            [
                                "PlayerB_76",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ]
                        ]
                    ],
                    "min": 1
                },
                "1[null]": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerB_77",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_83",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_68",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_66",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_94",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ]
                        ],
                        [
                            [
                                "PlayerB_77",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ]
                        ]
                    ],
                    "min": 1
                },
                "「特徴：アストレイ系」を持つ自軍ユニット１枚": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerB_90",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "戦闘エリア1"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_74",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "戦闘エリア2"
                                    ]
                                }
                            ]
                        ],
                        [
                            [
                                "PlayerB_90",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "戦闘エリア1"
                                    ]
                                }
                            ]
                        ]
                    ],
                    "count": 1
                },
                "戦闘力に＋４を振り分けて": {
                    "title": [
                        "BattleBonus",
                        [
                            [
                                4,
                                0,
                                0
                            ]
                        ],
                        [
                            [
                                4,
                                0,
                                0
                            ]
                        ]
                    ],
                    "count": 1
                }
            },
            "globalEffects": {},
            "varNamesRemoveOnTurnEnd": {},
            "isFirstTurn": false,
            "textIdsUseThisTurn": [],
            "isOpenForGain": false,
            "isCheat": false,
            "isAttack": false,
            "isDefence": false
        },
        "PlayerA_7": {
            "id": "PlayerA_7",
            "damage": 0,
            "destroyReason": null,
            "flags": {},
            "tips": {
                "合計国力〔x〕": {
                    "title": [
                        "カード",
                        [],
                        [
                            [
                                "PlayerA_28",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_54",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_13",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_27",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ]
                        ]
                    ]
                },
                "0[白]": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerA_54",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_13",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_27",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_46",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_11",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_48",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ]
                        ],
                        [
                            [
                                "PlayerA_54",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ]
                        ]
                    ],
                    "min": 1
                },
                "1[白]": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerA_13",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_27",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_46",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_11",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_48",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ]
                        ],
                        [
                            [
                                "PlayerA_13",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ]
                        ]
                    ],
                    "min": 1
                },
                "自軍ユニット１枚": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerA_41",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "戦闘エリア1"
                                    ]
                                }
                            ]
                        ],
                        [
                            [
                                "PlayerA_41",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "戦闘エリア1"
                                    ]
                                }
                            ]
                        ]
                    ],
                    "count": 1
                },
                "「速攻」、または「高機動」１つ": {
                    "title": [
                        "GlobalEffects",
                        [
                            {
                                "title": [
                                    "AddText",
                                    {
                                        "id": "179003_01A_O_WT001C_white_gain_1",
                                        "title": [
                                            "特殊型",
                                            [
                                                "速攻"
                                            ]
                                        ],
                                        "description": "速攻"
                                    }
                                ],
                                "cardIds": [
                                    "PlayerA_41"
                                ]
                            },
                            {
                                "title": [
                                    "AddText",
                                    {
                                        "id": "179003_01A_O_WT001C_white_gain_2",
                                        "title": [
                                            "特殊型",
                                            [
                                                "高機動"
                                            ]
                                        ],
                                        "description": "高機動"
                                    }
                                ],
                                "cardIds": []
                            }
                        ],
                        [
                            {
                                "title": [
                                    "AddText",
                                    {
                                        "id": "179003_01A_O_WT001C_white_gain_1",
                                        "title": [
                                            "特殊型",
                                            [
                                                "速攻"
                                            ]
                                        ],
                                        "description": "速攻"
                                    }
                                ],
                                "cardIds": [
                                    "PlayerA_41"
                                ]
                            }
                        ]
                    ]
                }
            },
            "globalEffects": {},
            "varNamesRemoveOnTurnEnd": {},
            "isFirstTurn": false,
            "isOpenForGain": false,
            "isCheat": false,
            "textIdsUseThisTurn": [],
            "isAttack": false,
            "isDefence": false
        },
        "PlayerB_70": {
            "id": "PlayerB_70",
            "damage": 0,
            "destroyReason": null,
            "flags": {},
            "tips": {},
            "globalEffects": {},
            "varNamesRemoveOnTurnEnd": {},
            "isAttack": false,
            "isDefence": false,
            "isOpenForGain": false,
            "isCheat": false,
            "isFirstTurn": false,
            "textIdsUseThisTurn": []
        },
        "PlayerB_71": {
            "id": "PlayerB_71",
            "damage": 0,
            "destroyReason": null,
            "flags": {},
            "tips": {
                "橫置支付1[白]": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerB_85",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_95",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_76",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ]
                        ],
                        [
                            [
                                "PlayerB_85",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ]
                        ]
                    ],
                    "min": 1
                },
                "橫置支付0[白]": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerB_87",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_85",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_95",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_76",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ]
                        ],
                        [
                            [
                                "PlayerB_87",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ]
                        ]
                    ],
                    "min": 1
                },
                "合計国力〔x〕": {
                    "title": [
                        "カード",
                        [],
                        [
                            [
                                "PlayerB_87",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_85",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_95",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_76",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ]
                        ]
                    ]
                },
                "打開自軍手裡或指定HANGER中特徵A並合計國力x以下的1張卡": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerB_71",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "手札"
                                    ]
                                }
                            ]
                        ],
                        [
                            [
                                "PlayerB_71",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "手札"
                                    ]
                                }
                            ]
                        ]
                    ],
                    "count": 1
                }
            },
            "globalEffects": {},
            "varNamesRemoveOnTurnEnd": {},
            "isFirstTurn": false,
            "textIdsUseThisTurn": [],
            "isOpenForGain": false,
            "isCheat": false,
            "isAttack": false,
            "isDefence": false
        },
        "PlayerA_32": {
            "id": "PlayerA_32",
            "damage": 0,
            "destroyReason": null,
            "flags": {},
            "tips": {
                "橫置支付0[白]": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerA_28",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_54",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_13",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_27",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ]
                        ],
                        [
                            [
                                "PlayerA_28",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ]
                        ]
                    ],
                    "min": 1
                },
                "敵軍部隊１つ": {
                    "title": [
                        "BaSyou",
                        [
                            {
                                "id": "AbsoluteBaSyou",
                                "value": [
                                    "PlayerB",
                                    "戦闘エリア1"
                                ]
                            },
                            {
                                "id": "AbsoluteBaSyou",
                                "value": [
                                    "PlayerB",
                                    "戦闘エリア2"
                                ]
                            }
                        ],
                        [
                            {
                                "id": "AbsoluteBaSyou",
                                "value": [
                                    "PlayerB",
                                    "戦闘エリア1"
                                ]
                            }
                        ]
                    ]
                },
                "合計国力〔x〕": {
                    "title": [
                        "カード",
                        [],
                        [
                            [
                                "PlayerA_28",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_54",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_13",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_27",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ]
                        ]
                    ]
                }
            },
            "globalEffects": {},
            "varNamesRemoveOnTurnEnd": {},
            "isOpenForGain": false,
            "isCheat": false,
            "isFirstTurn": false,
            "textIdsUseThisTurn": [],
            "isAttack": false,
            "isDefence": false
        },
        "PlayerA_59": {
            "id": "PlayerA_59",
            "damage": 0,
            "destroyReason": null,
            "flags": {},
            "tips": {
                "橫置支付0[白]": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerA_28",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_54",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_13",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_27",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_46",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ]
                        ],
                        [
                            [
                                "PlayerA_28",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ]
                        ]
                    ],
                    "min": 1
                },
                "橫置支付1[白]": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerA_54",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_13",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_27",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_46",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ]
                        ],
                        [
                            [
                                "PlayerA_54",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ]
                        ]
                    ],
                    "min": 1
                },
                "橫置支付2[白]": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerA_13",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_27",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_46",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ]
                        ],
                        [
                            [
                                "PlayerA_13",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ]
                        ]
                    ],
                    "min": 1
                },
                "合計国力〔x〕": {
                    "title": [
                        "カード",
                        [],
                        [
                            [
                                "PlayerA_28",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_54",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_13",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_27",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_46",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ]
                        ]
                    ]
                }
            },
            "globalEffects": {},
            "varNamesRemoveOnTurnEnd": {},
            "isFirstTurn": false,
            "isOpenForGain": false,
            "isCheat": false,
            "textIdsUseThisTurn": [],
            "isAttack": false,
            "isDefence": false
        },
        "PlayerB_86": {
            "id": "PlayerB_86",
            "damage": 0,
            "destroyReason": null,
            "flags": {},
            "tips": {
                "橫置支付0[白]": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerB_87",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_85",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_95",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_76",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_77",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ]
                        ],
                        [
                            [
                                "PlayerB_87",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ]
                        ]
                    ],
                    "min": 1
                },
                "合計国力〔x〕": {
                    "title": [
                        "カード",
                        [],
                        [
                            [
                                "PlayerB_87",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_85",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_95",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_76",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_77",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ]
                        ]
                    ]
                },
                "敵軍ユニット１枚": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerA_59",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "配備エリア"
                                    ]
                                }
                            ]
                        ],
                        [
                            [
                                "PlayerA_59",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "配備エリア"
                                    ]
                                }
                            ]
                        ]
                    ],
                    "count": 1
                },
                "橫置支付0[null]": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerB_76",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_77",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ]
                        ],
                        [
                            [
                                "PlayerB_76",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ]
                        ]
                    ],
                    "min": 1
                }
            },
            "globalEffects": {},
            "varNamesRemoveOnTurnEnd": {},
            "isFirstTurn": false,
            "textIdsUseThisTurn": [],
            "isOpenForGain": false,
            "isCheat": false,
            "isAttack": false,
            "isDefence": false
        },
        "PlayerB_104": {
            "id": "PlayerB_104",
            "damage": 0,
            "destroyReason": null,
            "flags": {},
            "tips": {
                "一個自軍機體": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerB_74",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "配備エリア"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_86",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "配備エリア"
                                    ]
                                }
                            ]
                        ],
                        [
                            [
                                "PlayerB_74",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "配備エリア"
                                    ]
                                }
                            ]
                        ]
                    ],
                    "count": 1
                },
                "橫置支付0[白]": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerB_77",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ]
                        ],
                        [
                            [
                                "PlayerB_77",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ]
                        ]
                    ],
                    "min": 1
                },
                "合計国力〔x〕": {
                    "title": [
                        "カード",
                        [],
                        [
                            [
                                "PlayerB_77",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ]
                        ]
                    ]
                },
                "自軍キャラ１枚": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerB_104",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "配備エリア"
                                    ]
                                }
                            ]
                        ],
                        [
                            [
                                "PlayerB_104",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "配備エリア"
                                    ]
                                }
                            ]
                        ]
                    ],
                    "count": 1
                }
            },
            "globalEffects": {
                "setGlobalEffect_01928b0c-6ce3-722e-99f0-ed4ab7194295": {
                    "title": [
                        "AddText",
                        {
                            "id": "",
                            "title": [
                                "特殊型",
                                [
                                    "高機動"
                                ]
                            ]
                        }
                    ],
                    "cardIds": [
                        "PlayerB_104"
                    ]
                }
            },
            "varNamesRemoveOnTurnEnd": {
                "setGlobalEffect_01928b0c-6ce3-722e-99f0-ed4ab7194295": true
            },
            "isFirstTurn": false,
            "isOpenForGain": false,
            "isCheat": false,
            "textIdsUseThisTurn": [
                "loadPrototype_179030_11E_CH_WT108N_white_text_0"
            ],
            "isAttack": false,
            "isDefence": false
        },
        "PlayerA_1": {
            "id": "PlayerA_1",
            "damage": 0,
            "destroyReason": null,
            "flags": {},
            "tips": {
                "橫置支付0[白]": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerA_28",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_54",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_13",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_27",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_46",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_11",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ]
                        ],
                        [
                            [
                                "PlayerA_28",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ]
                        ]
                    ],
                    "min": 1
                },
                "一個自軍機體": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerA_59",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "配備エリア"
                                    ]
                                }
                            ]
                        ],
                        [
                            [
                                "PlayerA_59",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "配備エリア"
                                    ]
                                }
                            ]
                        ]
                    ],
                    "count": 1
                },
                "合計国力〔x〕": {
                    "title": [
                        "カード",
                        [],
                        [
                            [
                                "PlayerA_28",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_54",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_13",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_27",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_46",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_11",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ]
                        ]
                    ]
                }
            },
            "globalEffects": {},
            "varNamesRemoveOnTurnEnd": {},
            "isFirstTurn": false,
            "isOpenForGain": false,
            "isCheat": false,
            "textIdsUseThisTurn": [],
            "isAttack": false,
            "isDefence": false
        },
        "PlayerB_92": {
            "id": "PlayerB_92",
            "damage": 0,
            "destroyReason": null,
            "flags": {},
            "tips": {
                "自軍ユニット１～２枚": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerB_86",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "戦闘エリア1"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_74",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "戦闘エリア2"
                                    ]
                                }
                            ]
                        ],
                        [
                            [
                                "PlayerB_86",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "戦闘エリア1"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_74",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "戦闘エリア2"
                                    ]
                                }
                            ]
                        ]
                    ],
                    "min": 1,
                    "max": 2
                },
                "橫置支付0[白]": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerB_87",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_85",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_95",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_76",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_77",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_83",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ]
                        ],
                        [
                            [
                                "PlayerB_87",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ]
                        ]
                    ],
                    "min": 1
                },
                "合計国力〔x〕": {
                    "title": [
                        "カード",
                        [],
                        [
                            [
                                "PlayerB_87",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_85",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_95",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_76",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_77",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_83",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ]
                        ]
                    ]
                }
            },
            "globalEffects": {},
            "varNamesRemoveOnTurnEnd": {},
            "isOpenForGain": false,
            "isCheat": false,
            "isFirstTurn": false,
            "textIdsUseThisTurn": [],
            "isAttack": false,
            "isDefence": false
        },
        "PlayerB_106": {
            "id": "PlayerB_106",
            "damage": 0,
            "destroyReason": null,
            "flags": {},
            "tips": {
                "橫置支付0[白]": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerB_85",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_95",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_76",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_77",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_83",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ]
                        ],
                        [
                            [
                                "PlayerB_85",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ]
                        ]
                    ],
                    "min": 1
                },
                "橫置支付1[白]": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerB_95",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_76",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_77",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_83",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ]
                        ],
                        [
                            [
                                "PlayerB_95",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ]
                        ]
                    ],
                    "min": 1
                },
                "戦闘エリアにいる、４以下の防御力を持つ敵軍ユニット１枚": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerA_59",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "配備エリア"
                                    ]
                                }
                            ]
                        ],
                        [
                            [
                                "PlayerA_59",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "配備エリア"
                                    ]
                                }
                            ]
                        ]
                    ],
                    "count": 1
                },
                "合計国力〔x〕": {
                    "title": [
                        "カード",
                        [],
                        [
                            [
                                "PlayerB_85",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_95",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_76",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_77",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_83",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ]
                        ]
                    ]
                }
            },
            "globalEffects": {},
            "varNamesRemoveOnTurnEnd": {},
            "isOpenForGain": false,
            "isCheat": false,
            "isFirstTurn": false,
            "textIdsUseThisTurn": [],
            "isAttack": false,
            "isDefence": false
        },
        "PlayerA_20": {
            "id": "PlayerA_20",
            "damage": 0,
            "destroyReason": null,
            "flags": {},
            "tips": {
                "橫置支付0[白]": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerA_28",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_54",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_13",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_27",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_46",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_11",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ]
                        ],
                        [
                            [
                                "PlayerA_28",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ]
                        ]
                    ],
                    "min": 1
                },
                "橫置支付1[白]": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerA_54",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_13",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_27",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_46",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_11",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ]
                        ],
                        [
                            [
                                "PlayerA_54",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ]
                        ]
                    ],
                    "min": 1
                },
                "橫置支付2[白]": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerA_13",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_27",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_46",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_11",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ]
                        ],
                        [
                            [
                                "PlayerA_13",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ]
                        ]
                    ],
                    "min": 1
                },
                "合計国力〔x〕": {
                    "title": [
                        "カード",
                        [],
                        [
                            [
                                "PlayerA_28",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_54",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_13",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_27",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_46",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_11",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ]
                        ]
                    ]
                }
            },
            "globalEffects": {},
            "varNamesRemoveOnTurnEnd": {},
            "isFirstTurn": false,
            "isOpenForGain": false,
            "isCheat": false,
            "textIdsUseThisTurn": [],
            "isAttack": false,
            "isDefence": false
        },
        "PlayerB_105": {
            "id": "PlayerB_105",
            "damage": 0,
            "destroyReason": null,
            "flags": {},
            "tips": {
                "橫置支付1[白]": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerB_77",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_83",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ]
                        ],
                        [
                            [
                                "PlayerB_77",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ]
                        ]
                    ],
                    "min": 1
                },
                "橫置支付0[白]": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerB_76",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_77",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_83",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ]
                        ],
                        [
                            [
                                "PlayerB_76",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ]
                        ]
                    ],
                    "min": 1
                },
                "戦闘エリアにいる、４以下の防御力を持つ敵軍ユニット１枚": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerA_20",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "配備エリア"
                                    ]
                                }
                            ]
                        ],
                        [
                            [
                                "PlayerA_20",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "配備エリア"
                                    ]
                                }
                            ]
                        ]
                    ],
                    "count": 1
                },
                "合計国力〔x〕": {
                    "title": [
                        "カード",
                        [],
                        [
                            [
                                "PlayerB_76",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_77",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_83",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ]
                        ]
                    ]
                }
            },
            "globalEffects": {},
            "varNamesRemoveOnTurnEnd": {},
            "isOpenForGain": false,
            "isCheat": false,
            "isFirstTurn": false,
            "textIdsUseThisTurn": [],
            "isAttack": false,
            "isDefence": false
        },
        "PlayerA_38": {
            "id": "PlayerA_38",
            "damage": 0,
            "destroyReason": null,
            "flags": {
                "enabled": true,
                "varNamesRemoveOnTurnEnd": {
                    "enabled": true
                }
            },
            "tips": {
                "橫置支付0[白]": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerA_27",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_46",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_11",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_48",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ]
                        ],
                        [
                            [
                                "PlayerA_27",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ]
                        ]
                    ],
                    "min": 1
                },
                "戦闘エリアにいる敵軍ユニット１枚": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerB_86",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "戦闘エリア1"
                                    ]
                                }
                            ]
                        ],
                        [
                            [
                                "PlayerB_86",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "戦闘エリア1"
                                    ]
                                }
                            ]
                        ]
                    ],
                    "count": 1
                },
                "合計国力〔x〕": {
                    "title": [
                        "カード",
                        [],
                        [
                            [
                                "PlayerA_27",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_46",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_11",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_48",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ]
                        ]
                    ]
                }
            },
            "globalEffects": {},
            "varNamesRemoveOnTurnEnd": {},
            "isOpenForGain": false,
            "isCheat": false,
            "isFirstTurn": false,
            "textIdsUseThisTurn": [],
            "isAttack": false,
            "isDefence": false
        },
        "PlayerA_49": {
            "id": "PlayerA_49",
            "damage": 0,
            "destroyReason": null,
            "flags": {},
            "tips": {
                "橫置支付0[白]": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerA_28",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_54",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_13",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_27",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_46",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_11",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_48",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ]
                        ],
                        [
                            [
                                "PlayerA_28",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ]
                        ]
                    ],
                    "min": 1
                },
                "橫置支付1[白]": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerA_54",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_13",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_27",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_46",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_11",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_48",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ]
                        ],
                        [
                            [
                                "PlayerA_54",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ]
                        ]
                    ],
                    "min": 1
                },
                "合計国力〔x〕": {
                    "title": [
                        "カード",
                        [],
                        [
                            [
                                "PlayerA_28",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_54",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_13",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_27",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_46",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_11",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_48",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ]
                        ]
                    ]
                }
            },
            "globalEffects": {},
            "varNamesRemoveOnTurnEnd": {},
            "isFirstTurn": false,
            "isOpenForGain": false,
            "isCheat": false,
            "textIdsUseThisTurn": [],
            "isAttack": false,
            "isDefence": false
        },
        "PlayerB_90": {
            "id": "PlayerB_90",
            "damage": 0,
            "destroyReason": null,
            "flags": {},
            "tips": {
                "橫置支付1[白]": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerB_85",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_95",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_76",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_77",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_83",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_68",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ]
                        ],
                        [
                            [
                                "PlayerB_85",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ]
                        ]
                    ],
                    "min": 1
                },
                "橫置支付0[白]": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerB_87",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_85",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_95",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_76",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_77",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_83",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_68",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ]
                        ],
                        [
                            [
                                "PlayerB_87",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ]
                        ]
                    ],
                    "min": 1
                },
                "合計国力〔x〕": {
                    "title": [
                        "カード",
                        [],
                        [
                            [
                                "PlayerB_87",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_85",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_95",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_76",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_77",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_83",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_68",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ]
                        ]
                    ]
                },
                "「特徴：アストレイ系」を持つ自軍ユニット１枚": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerB_90",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "戦闘エリア1"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_74",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "戦闘エリア2"
                                    ]
                                }
                            ]
                        ],
                        [
                            [
                                "PlayerB_90",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "戦闘エリア1"
                                    ]
                                }
                            ]
                        ]
                    ],
                    "count": 1
                },
                "0[null]": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerB_87",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_85",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_95",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_76",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_77",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_83",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_68",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_66",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_94",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ]
                        ],
                        [
                            [
                                "PlayerB_87",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ]
                        ]
                    ],
                    "min": 1
                },
                "1[null]": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerB_85",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_95",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_76",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_77",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_83",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_68",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_66",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_94",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ]
                        ],
                        [
                            [
                                "PlayerB_85",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ]
                        ]
                    ],
                    "min": 1
                },
                "戦闘力に＋４を振り分けて": {
                    "title": [
                        "BattleBonus",
                        [
                            [
                                4,
                                0,
                                0
                            ]
                        ],
                        [
                            [
                                4,
                                0,
                                0
                            ]
                        ]
                    ],
                    "count": 1
                },
                "橫置支付0[null]": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerB_95",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_76",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_77",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_83",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_68",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_66",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_94",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ]
                        ],
                        [
                            [
                                "PlayerB_95",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ]
                        ]
                    ],
                    "min": 1
                },
                "［ ］の特徴を持つ自軍ユニット１枚は": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerB_74",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "戦闘エリア2"
                                    ]
                                }
                            ]
                        ],
                        [
                            [
                                "PlayerB_74",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "戦闘エリア2"
                                    ]
                                }
                            ]
                        ]
                    ],
                    "count": 1
                },
                "このカードの本来のテキスト１つ": {
                    "title": [
                        "テキスト",
                        [
                            {
                                "cardId": "PlayerB_90",
                                "textId": "loadPrototype_179024_03B_U_WT057U_white_text_0"
                            },
                            {
                                "cardId": "PlayerB_90",
                                "textId": "loadPrototype_179024_03B_U_WT057U_white_text_1"
                            }
                        ],
                        [
                            {
                                "cardId": "PlayerB_90",
                                "textId": "loadPrototype_179024_03B_U_WT057U_white_text_0"
                            }
                        ]
                    ],
                    "count": 1
                }
            },
            "globalEffects": {},
            "varNamesRemoveOnTurnEnd": {},
            "isFirstTurn": false,
            "textIdsUseThisTurn": [],
            "isOpenForGain": false,
            "isCheat": false,
            "isAttack": false,
            "isDefence": false
        },
        "PlayerA_41": {
            "id": "PlayerA_41",
            "damage": 0,
            "destroyReason": null,
            "flags": {},
            "tips": {
                "橫置支付0[白]": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerA_28",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_54",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_13",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_27",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_46",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_11",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_48",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ]
                        ],
                        [
                            [
                                "PlayerA_28",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ]
                        ]
                    ],
                    "min": 1
                },
                "合計国力〔x〕": {
                    "title": [
                        "カード",
                        [],
                        [
                            [
                                "PlayerA_28",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_54",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_13",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_27",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_46",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_11",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_48",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ]
                        ]
                    ]
                }
            },
            "globalEffects": {},
            "varNamesRemoveOnTurnEnd": {},
            "isFirstTurn": false,
            "isOpenForGain": false,
            "isCheat": false,
            "textIdsUseThisTurn": [],
            "isAttack": false,
            "isDefence": false
        },
        "SystemFakeCardID_createAttackPhaseRuleEffect_text_PlayerA": {
            "id": "SystemFakeCardID_createAttackPhaseRuleEffect_text_PlayerA",
            "damage": 0,
            "destroyReason": null,
            "flags": {},
            "tips": {
                "去地球": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerA_41",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "配備エリア"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_51",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "配備エリア"
                                    ]
                                }
                            ]
                        ],
                        [
                            [
                                "PlayerA_51",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "配備エリア"
                                    ]
                                }
                            ]
                        ]
                    ],
                    "flags": {
                        "isGoBattleArea1": true
                    }
                },
                "去宇宙": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerA_41",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "配備エリア"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_51",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "配備エリア"
                                    ]
                                }
                            ]
                        ],
                        []
                    ],
                    "flags": {
                        "isGoBattleArea2": true
                    }
                }
            },
            "globalEffects": {},
            "varNamesRemoveOnTurnEnd": {},
            "isOpenForGain": false,
            "isCheat": false,
            "isFirstTurn": false,
            "textIdsUseThisTurn": [],
            "isAttack": false,
            "isDefence": false
        },
        "PlayerA_33": {
            "id": "PlayerA_33",
            "damage": 0,
            "destroyReason": null,
            "flags": {},
            "tips": {
                "橫置支付0[白]": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerA_28",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_54",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_13",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_27",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_46",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_11",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_48",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ]
                        ],
                        [
                            [
                                "PlayerA_28",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ]
                        ]
                    ],
                    "min": 1
                },
                "合計国力〔x〕": {
                    "title": [
                        "カード",
                        [],
                        [
                            [
                                "PlayerA_28",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_54",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_13",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_27",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_46",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_11",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_48",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ]
                        ]
                    ]
                },
                "自軍本国の上のカード４枚までを見て、その中にある、このカードと同じ属性のGサインを持つユニット１枚": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerA_29",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "本国"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_40",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "本国"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_51",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "本国"
                                    ]
                                }
                            ]
                        ],
                        [
                            [
                                "PlayerA_51",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "本国"
                                    ]
                                }
                            ]
                        ]
                    ],
                    "count": 1,
                    "cheatCardIds": [
                        "PlayerA_29",
                        "PlayerA_40",
                        "PlayerA_51",
                        "PlayerA_4"
                    ]
                }
            },
            "globalEffects": {},
            "varNamesRemoveOnTurnEnd": {},
            "isFirstTurn": false,
            "textIdsUseThisTurn": [],
            "isOpenForGain": false,
            "isCheat": false,
            "isAttack": false,
            "isDefence": false
        },
        "PlayerA_51": {
            "id": "PlayerA_51",
            "damage": 0,
            "destroyReason": null,
            "flags": {},
            "tips": {
                "橫置支付0[白]": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerA_54",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_13",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_27",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_46",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_11",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_48",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ]
                        ],
                        [
                            [
                                "PlayerA_54",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ]
                        ]
                    ],
                    "min": 1
                },
                "橫置支付1[白]": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerA_13",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_27",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_46",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_11",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_48",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ]
                        ],
                        [
                            [
                                "PlayerA_13",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ]
                        ]
                    ],
                    "min": 1
                },
                "合計国力〔x〕": {
                    "title": [
                        "カード",
                        [],
                        [
                            [
                                "PlayerA_54",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_13",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_27",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_46",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_11",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_48",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ]
                        ]
                    ]
                }
            },
            "globalEffects": {
                "setGlobalEffect_01928b13-7ba0-722e-a074-42b778810a8e": {
                    "title": [
                        "AddText",
                        {
                            "id": "179028_10D_U_WT177R_white_ターン終了時まで以下のテキストを得る",
                            "description": "「『起動』：このカードが攻撃に出撃した場合、自軍本国をX回復する。Xの値は、このカードの合計国力の値と同じとする」",
                            "title": [
                                "自動型",
                                "起動"
                            ],
                            "protectLevel": 1,
                            "onEvent": "function _(ctx, effect, { DefineFn, GameStateFn }) {\n                                        const cardId = DefineFn.EffectFn.getCardID(effect);\n                                        const cardController = GameStateFn.getItemController(ctx, cardId);\n                                        const event = DefineFn.EffectFn.getEvent(effect);\n                                        if (event.title[0] == \"このカードが攻撃に出撃した場合\" && event.cardIds?.includes(cardId)) {\n                                            const totalCostLength = GameStateFn.getCardTotalCostLength(ctx, cardId);\n                                            ctx = GameStateFn.doCountryDamage(ctx, cardController, -totalCostLength);\n                                        }\n                                        return ctx;\n                                    }"
                        }
                    ],
                    "cardIds": []
                }
            },
            "varNamesRemoveOnTurnEnd": {
                "setGlobalEffect_01928b13-7ba0-722e-a074-42b778810a8e": true
            },
            "isFirstTurn": false,
            "isAttack": false,
            "isDefence": false,
            "isOpenForGain": false,
            "isCheat": false,
            "textIdsUseThisTurn": []
        }
    },
    "phase": [
        "戦闘フェイズ",
        "攻撃ステップ",
        "フリータイミング"
    ],
    "playerStates": {
        "PlayerA": {
            "id": "PlayerA",
            "turn": 0,
            "playGCount": 0,
            "confirmPhase": false,
            "textIdsUseThisTurn": {}
        },
        "PlayerB": {
            "id": "PlayerB",
            "turn": 0,
            "playGCount": 0,
            "confirmPhase": false,
            "textIdsUseThisTurn": {}
        }
    },
    "activePlayerID": "PlayerB",
    "immediateEffect": [],
    "stackEffect": [],
    "destroyEffect": [],
    "commandEffects": [
        "createPlayEffects_PlayerA_PlayerA_7_loadPrototype_179003_01A_O_WT001C_white_text_0",
        "createPlayEffects_PlayerA_PlayerA_41_loadPrototype_179024_03B_U_WT039R_white_text_2",
        "createPlayEffects_PlayerA_PlayerA_51_loadPrototype_179028_10D_U_WT177R_white_text_4",
        "createPlayEffects_PlayerB_PlayerB_104_loadPrototype_179030_11E_CH_WT108N_white_text_0"
    ],
    "commandEffectTips": [
        {
            "effectId": "createPlayEffects_PlayerA_PlayerA_7_loadPrototype_179003_01A_O_WT001C_white_text_0",
            "conditionKeys": [
                "0[白]",
                "1[白]",
                "自軍ユニット１枚",
                "「速攻」、または「高機動」１つ",
                "同回合上限"
            ],
            "logicID": 0,
            "logicSubID": 0,
            "tipOrErrors": [
                {
                    "effectId": "createPlayEffects_PlayerA_PlayerA_7_loadPrototype_179003_01A_O_WT001C_white_text_0",
                    "conditionKey": "0[白]",
                    "tip": {
                        "title": [
                            "カード",
                            [
                                [
                                    "PlayerA_27",
                                    {
                                        "id": "AbsoluteBaSyou",
                                        "value": [
                                            "PlayerA",
                                            "Gゾーン"
                                        ]
                                    }
                                ],
                                [
                                    "PlayerA_46",
                                    {
                                        "id": "AbsoluteBaSyou",
                                        "value": [
                                            "PlayerA",
                                            "Gゾーン"
                                        ]
                                    }
                                ],
                                [
                                    "PlayerA_11",
                                    {
                                        "id": "AbsoluteBaSyou",
                                        "value": [
                                            "PlayerA",
                                            "Gゾーン"
                                        ]
                                    }
                                ],
                                [
                                    "PlayerA_48",
                                    {
                                        "id": "AbsoluteBaSyou",
                                        "value": [
                                            "PlayerA",
                                            "Gゾーン"
                                        ]
                                    }
                                ]
                            ],
                            [
                                [
                                    "PlayerA_27",
                                    {
                                        "id": "AbsoluteBaSyou",
                                        "value": [
                                            "PlayerA",
                                            "Gゾーン"
                                        ]
                                    }
                                ]
                            ]
                        ],
                        "min": 1
                    },
                    "errors": []
                },
                {
                    "effectId": "createPlayEffects_PlayerA_PlayerA_7_loadPrototype_179003_01A_O_WT001C_white_text_0",
                    "conditionKey": "1[白]",
                    "tip": {
                        "title": [
                            "カード",
                            [
                                [
                                    "PlayerA_46",
                                    {
                                        "id": "AbsoluteBaSyou",
                                        "value": [
                                            "PlayerA",
                                            "Gゾーン"
                                        ]
                                    }
                                ],
                                [
                                    "PlayerA_11",
                                    {
                                        "id": "AbsoluteBaSyou",
                                        "value": [
                                            "PlayerA",
                                            "Gゾーン"
                                        ]
                                    }
                                ],
                                [
                                    "PlayerA_48",
                                    {
                                        "id": "AbsoluteBaSyou",
                                        "value": [
                                            "PlayerA",
                                            "Gゾーン"
                                        ]
                                    }
                                ]
                            ],
                            [
                                [
                                    "PlayerA_46",
                                    {
                                        "id": "AbsoluteBaSyou",
                                        "value": [
                                            "PlayerA",
                                            "Gゾーン"
                                        ]
                                    }
                                ]
                            ]
                        ],
                        "min": 1
                    },
                    "errors": []
                },
                {
                    "effectId": "createPlayEffects_PlayerA_PlayerA_7_loadPrototype_179003_01A_O_WT001C_white_text_0",
                    "conditionKey": "自軍ユニット１枚",
                    "tip": {
                        "title": [
                            "カード",
                            [
                                [
                                    "PlayerA_41",
                                    {
                                        "id": "AbsoluteBaSyou",
                                        "value": [
                                            "PlayerA",
                                            "配備エリア"
                                        ]
                                    }
                                ],
                                [
                                    "PlayerA_33",
                                    {
                                        "id": "AbsoluteBaSyou",
                                        "value": [
                                            "PlayerA",
                                            "配備エリア"
                                        ]
                                    }
                                ],
                                [
                                    "PlayerA_51",
                                    {
                                        "id": "AbsoluteBaSyou",
                                        "value": [
                                            "PlayerA",
                                            "配備エリア"
                                        ]
                                    }
                                ]
                            ],
                            [
                                [
                                    "PlayerA_41",
                                    {
                                        "id": "AbsoluteBaSyou",
                                        "value": [
                                            "PlayerA",
                                            "配備エリア"
                                        ]
                                    }
                                ]
                            ]
                        ],
                        "count": 1
                    },
                    "errors": []
                },
                {
                    "effectId": "createPlayEffects_PlayerA_PlayerA_7_loadPrototype_179003_01A_O_WT001C_white_text_0",
                    "conditionKey": "「速攻」、または「高機動」１つ",
                    "tip": {
                        "title": [
                            "GlobalEffects",
                            [
                                {
                                    "title": [
                                        "AddText",
                                        {
                                            "id": "179003_01A_O_WT001C_white_gain_1",
                                            "title": [
                                                "特殊型",
                                                [
                                                    "速攻"
                                                ]
                                            ],
                                            "description": "速攻"
                                        }
                                    ],
                                    "cardIds": []
                                },
                                {
                                    "title": [
                                        "AddText",
                                        {
                                            "id": "179003_01A_O_WT001C_white_gain_2",
                                            "title": [
                                                "特殊型",
                                                [
                                                    "高機動"
                                                ]
                                            ],
                                            "description": "高機動"
                                        }
                                    ],
                                    "cardIds": []
                                }
                            ],
                            [
                                {
                                    "title": [
                                        "AddText",
                                        {
                                            "id": "179003_01A_O_WT001C_white_gain_1",
                                            "title": [
                                                "特殊型",
                                                [
                                                    "速攻"
                                                ]
                                            ],
                                            "description": "速攻"
                                        }
                                    ],
                                    "cardIds": []
                                }
                            ]
                        ],
                        "count": 1
                    },
                    "errors": []
                },
                {
                    "effectId": "createPlayEffects_PlayerA_PlayerA_7_loadPrototype_179003_01A_O_WT001C_white_text_0",
                    "conditionKey": "同回合上限",
                    "tip": null,
                    "errors": []
                }
            ]
        },
        {
            "effectId": "createPlayEffects_PlayerA_PlayerA_41_loadPrototype_179024_03B_U_WT039R_white_text_2",
            "conditionKeys": [
                "打開自軍手裡或指定HANGER中特徵A並合計國力x以下的1張卡",
                "同回合上限"
            ],
            "logicID": 0,
            "logicSubID": 0,
            "tipOrErrors": [
                {
                    "effectId": "createPlayEffects_PlayerA_PlayerA_41_loadPrototype_179024_03B_U_WT039R_white_text_2",
                    "conditionKey": "打開自軍手裡或指定HANGER中特徵A並合計國力x以下的1張卡",
                    "tip": {
                        "title": [
                            "カード",
                            [],
                            []
                        ],
                        "count": 1
                    },
                    "errors": [
                        "count 0 not right: カード/1"
                    ]
                },
                {
                    "effectId": "createPlayEffects_PlayerA_PlayerA_41_loadPrototype_179024_03B_U_WT039R_white_text_2",
                    "conditionKey": "同回合上限",
                    "tip": null,
                    "errors": []
                }
            ]
        },
        {
            "effectId": "createPlayEffects_PlayerA_PlayerA_51_loadPrototype_179028_10D_U_WT177R_white_text_4",
            "conditionKeys": [
                "打開自軍手裡或指定HANGER中特徵A並合計國力x以下的1張卡",
                "同回合上限"
            ],
            "logicID": 0,
            "logicSubID": 0,
            "tipOrErrors": [
                {
                    "effectId": "createPlayEffects_PlayerA_PlayerA_51_loadPrototype_179028_10D_U_WT177R_white_text_4",
                    "conditionKey": "打開自軍手裡或指定HANGER中特徵A並合計國力x以下的1張卡",
                    "tip": {
                        "title": [
                            "カード",
                            [],
                            []
                        ],
                        "count": 1
                    },
                    "errors": [
                        "count 0 not right: カード/1"
                    ]
                },
                {
                    "effectId": "createPlayEffects_PlayerA_PlayerA_51_loadPrototype_179028_10D_U_WT177R_white_text_4",
                    "conditionKey": "同回合上限",
                    "tip": null,
                    "errors": []
                }
            ]
        },
        {
            "effectId": "createPlayEffects_PlayerB_PlayerB_104_loadPrototype_179030_11E_CH_WT108N_white_text_0",
            "conditionKeys": [
                "〔R〕",
                "自軍キャラ１枚",
                "同回合上限"
            ],
            "logicID": 0,
            "logicSubID": 0,
            "tipOrErrors": [
                {
                    "effectId": "createPlayEffects_PlayerB_PlayerB_104_loadPrototype_179030_11E_CH_WT108N_white_text_0",
                    "conditionKey": "〔R〕",
                    "tip": null,
                    "errors": [
                        "card already isRoll: true: PlayerB_104"
                    ]
                },
                {
                    "effectId": "createPlayEffects_PlayerB_PlayerB_104_loadPrototype_179030_11E_CH_WT108N_white_text_0",
                    "conditionKey": "自軍キャラ１枚",
                    "tip": {
                        "title": [
                            "カード",
                            [
                                [
                                    "PlayerB_104",
                                    {
                                        "id": "AbsoluteBaSyou",
                                        "value": [
                                            "PlayerB",
                                            "配備エリア"
                                        ]
                                    }
                                ]
                            ],
                            [
                                [
                                    "PlayerB_104",
                                    {
                                        "id": "AbsoluteBaSyou",
                                        "value": [
                                            "PlayerB",
                                            "配備エリア"
                                        ]
                                    }
                                ]
                            ]
                        ],
                        "count": 1
                    },
                    "errors": []
                },
                {
                    "effectId": "createPlayEffects_PlayerB_PlayerB_104_loadPrototype_179030_11E_CH_WT108N_white_text_0",
                    "conditionKey": "同回合上限",
                    "tip": null,
                    "errors": [
                        "同回合上限: （攻撃ステップ）〔R〕：自軍キャラ１枚は、ターン終了時まで「高機動」を得る。"
                    ]
                }
            ]
        }
    ],
    "isBattle": {
        "[\"PlayerA\",\"戦闘エリア1\"]": false,
        "[\"PlayerB\",\"戦闘エリア1\"]": false,
        "[\"PlayerA\",\"戦闘エリア2\"]": false,
        "[\"PlayerB\",\"戦闘エリア2\"]": false
    },
    "coins": {},
    "coinId2cardId": {},
    "globalEffectPool": {},
    "messageTopId": 2187,
    "messages": [
        {
            "id": 2186,
            "description": "onEvent: このカードが攻撃に出撃した場合 [\"PlayerA_51\"]"
        },
        {
            "id": 2185,
            "description": "onEvent: このカードが場に出た場合 [\"PlayerA_51\"]"
        },
        {
            "id": 2184,
            "description": "onEvent: カット終了時 undefined"
        },
        {
            "id": 2183,
            "description": "onEffectEnd: （攻撃ステップ）〔R〕：自軍キャラ１枚は、ターン終了時まで「高機動」を得る。"
        },
        {
            "id": 2182,
            "description": "onEffectStart: （攻撃ステップ）〔R〕：自軍キャラ１枚は、ターン終了時まで「高機動」を得る。",
            "effect": {
                "id": "addStackEffect_01928b0c-6a4b-722e-9132-58ee2997856f",
                "description": "（攻撃ステップ）〔R〕：自軍キャラ１枚は、ターン終了時まで「高機動」を得る。",
                "reason": [
                    "PlayText",
                    "PlayerB",
                    "PlayerB_104",
                    "loadPrototype_179030_11E_CH_WT108N_white_text_0"
                ],
                "text": {
                    "id": "loadPrototype_179030_11E_CH_WT108N_white_text_0",
                    "description": "（攻撃ステップ）〔R〕：自軍キャラ１枚は、ターン終了時まで「高機動」を得る。",
                    "title": [],
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": [
                                        "ターン終了時まで「速攻」を得る。",
                                        [
                                            {
                                                "title": [
                                                    "AddText",
                                                    {
                                                        "id": "",
                                                        "title": [
                                                            "特殊型",
                                                            [
                                                                "高機動"
                                                            ]
                                                        ]
                                                    }
                                                ],
                                                "cardIds": []
                                            }
                                        ]
                                    ],
                                    "vars": [
                                        "自軍キャラ１枚"
                                    ]
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 2181,
            "description": "onEffectEnd: （攻撃ステップ）〔R〕：自軍キャラ１枚は、ターン終了時まで「高機動」を得る。"
        },
        {
            "id": 2180,
            "description": "PlayerB_104.isRoll false => true",
            "effect": {
                "id": "createPlayEffects_PlayerB_PlayerB_104_loadPrototype_179030_11E_CH_WT108N_white_text_0",
                "reason": [
                    "PlayText",
                    "PlayerB",
                    "PlayerB_104",
                    "loadPrototype_179030_11E_CH_WT108N_white_text_0"
                ],
                "description": "（攻撃ステップ）〔R〕：自軍キャラ１枚は、ターン終了時まで「高機動」を得る。",
                "text": {
                    "id": "loadPrototype_179030_11E_CH_WT108N_white_text_0",
                    "description": "（攻撃ステップ）〔R〕：自軍キャラ１枚は、ターン終了時まで「高機動」を得る。",
                    "title": [
                        "使用型",
                        [
                            "攻撃ステップ"
                        ]
                    ],
                    "conditions": {
                        "〔R〕": {
                            "actions": [
                                {
                                    "title": [
                                        "_ロールする",
                                        "ロール"
                                    ]
                                }
                            ]
                        },
                        "自軍キャラ１枚": {
                            "title": [
                                "_自軍_ユニット_１枚",
                                "自軍",
                                "キャラクター",
                                1
                            ]
                        },
                        "同回合上限": {
                            "actions": [
                                {
                                    "title": [
                                        "同回合上限",
                                        1
                                    ]
                                }
                            ]
                        }
                    },
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": [
                                        "cutIn",
                                        [
                                            {
                                                "title": [
                                                    "ターン終了時まで「速攻」を得る。",
                                                    [
                                                        {
                                                            "title": [
                                                                "AddText",
                                                                {
                                                                    "id": "",
                                                                    "title": [
                                                                        "特殊型",
                                                                        [
                                                                            "高機動"
                                                                        ]
                                                                    ]
                                                                }
                                                            ],
                                                            "cardIds": []
                                                        }
                                                    ]
                                                ],
                                                "vars": [
                                                    "自軍キャラ１枚"
                                                ]
                                            }
                                        ]
                                    ]
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 2179,
            "description": "PlayerB_74.isRoll false => true",
            "effect": {
                "id": "createPlayEffects_PlayerB_PlayerB_104_loadPrototype_179030_11E_CH_WT108N_white_text_0",
                "reason": [
                    "PlayText",
                    "PlayerB",
                    "PlayerB_104",
                    "loadPrototype_179030_11E_CH_WT108N_white_text_0"
                ],
                "description": "（攻撃ステップ）〔R〕：自軍キャラ１枚は、ターン終了時まで「高機動」を得る。",
                "text": {
                    "id": "loadPrototype_179030_11E_CH_WT108N_white_text_0",
                    "description": "（攻撃ステップ）〔R〕：自軍キャラ１枚は、ターン終了時まで「高機動」を得る。",
                    "title": [
                        "使用型",
                        [
                            "攻撃ステップ"
                        ]
                    ],
                    "conditions": {
                        "〔R〕": {
                            "actions": [
                                {
                                    "title": [
                                        "_ロールする",
                                        "ロール"
                                    ]
                                }
                            ]
                        },
                        "自軍キャラ１枚": {
                            "title": [
                                "_自軍_ユニット_１枚",
                                "自軍",
                                "キャラクター",
                                1
                            ]
                        },
                        "同回合上限": {
                            "actions": [
                                {
                                    "title": [
                                        "同回合上限",
                                        1
                                    ]
                                }
                            ]
                        }
                    },
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": [
                                        "cutIn",
                                        [
                                            {
                                                "title": [
                                                    "ターン終了時まで「速攻」を得る。",
                                                    [
                                                        {
                                                            "title": [
                                                                "AddText",
                                                                {
                                                                    "id": "",
                                                                    "title": [
                                                                        "特殊型",
                                                                        [
                                                                            "高機動"
                                                                        ]
                                                                    ]
                                                                }
                                                            ],
                                                            "cardIds": []
                                                        }
                                                    ]
                                                ],
                                                "vars": [
                                                    "自軍キャラ１枚"
                                                ]
                                            }
                                        ]
                                    ]
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 2178,
            "description": "onEffectStart: （攻撃ステップ）〔R〕：自軍キャラ１枚は、ターン終了時まで「高機動」を得る。",
            "effect": {
                "id": "createPlayEffects_PlayerB_PlayerB_104_loadPrototype_179030_11E_CH_WT108N_white_text_0",
                "reason": [
                    "PlayText",
                    "PlayerB",
                    "PlayerB_104",
                    "loadPrototype_179030_11E_CH_WT108N_white_text_0"
                ],
                "description": "（攻撃ステップ）〔R〕：自軍キャラ１枚は、ターン終了時まで「高機動」を得る。",
                "text": {
                    "id": "loadPrototype_179030_11E_CH_WT108N_white_text_0",
                    "description": "（攻撃ステップ）〔R〕：自軍キャラ１枚は、ターン終了時まで「高機動」を得る。",
                    "title": [
                        "使用型",
                        [
                            "攻撃ステップ"
                        ]
                    ],
                    "conditions": {
                        "〔R〕": {
                            "actions": [
                                {
                                    "title": [
                                        "_ロールする",
                                        "ロール"
                                    ]
                                }
                            ]
                        },
                        "自軍キャラ１枚": {
                            "title": [
                                "_自軍_ユニット_１枚",
                                "自軍",
                                "キャラクター",
                                1
                            ]
                        },
                        "同回合上限": {
                            "actions": [
                                {
                                    "title": [
                                        "同回合上限",
                                        1
                                    ]
                                }
                            ]
                        }
                    },
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": [
                                        "cutIn",
                                        [
                                            {
                                                "title": [
                                                    "ターン終了時まで「速攻」を得る。",
                                                    [
                                                        {
                                                            "title": [
                                                                "AddText",
                                                                {
                                                                    "id": "",
                                                                    "title": [
                                                                        "特殊型",
                                                                        [
                                                                            "高機動"
                                                                        ]
                                                                    ]
                                                                }
                                                            ],
                                                            "cardIds": []
                                                        }
                                                    ]
                                                ],
                                                "vars": [
                                                    "自軍キャラ１枚"
                                                ]
                                            }
                                        ]
                                    ]
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 2177,
            "description": "onSetPhase:戦闘フェイズ,攻撃ステップ,フリータイミング"
        },
        {
            "id": 2176,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 2175,
            "description": "onSetPhase:戦闘フェイズ,攻撃ステップ,ステップ開始"
        },
        {
            "id": 2174,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 2173,
            "description": "onSetPhase:配備フェイズ,フェイズ終了"
        },
        {
            "id": 2172,
            "description": "onSetPhase:配備フェイズ,フリータイミング"
        },
        {
            "id": 2171,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 2170,
            "description": "onSetPhase:配備フェイズ,フェイズ開始"
        },
        {
            "id": 2169,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 2168,
            "description": "onSetPhase:ドローフェイズ,フェイズ終了"
        },
        {
            "id": 2167,
            "description": "onSetPhase:ドローフェイズ,フリータイミング"
        },
        {
            "id": 2166,
            "description": "onEffectEnd: 抽牌階段規定效果"
        },
        {
            "id": 2165,
            "description": "onItemMove:PlayerB_61 = [\"PlayerB\",\"本国\"] => [\"PlayerB\",\"手札\"]",
            "effect": {
                "id": "createDrawPhaseRuleEffect_PlayerB",
                "reason": [
                    "GameRule",
                    "PlayerB",
                    {
                        "isDraw": true
                    }
                ],
                "text": {
                    "id": "createDrawPhaseRuleEffect_text_PlayerB",
                    "title": [],
                    "description": "抽牌階段規定效果",
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                const playerId2 = DefineFn2.EffectFn.getPlayerID(effect), from = DefineFn2.AbsoluteBaSyouFn.of(playerId2, \"\\u672C\\u56FD\"), cardIds = GameStateFn2.getItemIdsByBasyou(ctx3, from).slice(0, 1);\n                for (let cardId of cardIds)\n                  ctx3 = GameStateFn2.doItemMove(ctx3, DefineFn2.AbsoluteBaSyouFn.of(playerId2, \"\\u624B\\u672D\"), [cardId, from]);\n                return ctx3;\n              }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 2164,
            "description": "onEvent: GameEventOnMove [\"PlayerB_61\"]",
            "effect": {
                "id": "createDrawPhaseRuleEffect_PlayerB",
                "reason": [
                    "GameRule",
                    "PlayerB",
                    {
                        "isDraw": true
                    }
                ],
                "text": {
                    "id": "createDrawPhaseRuleEffect_text_PlayerB",
                    "title": [],
                    "description": "抽牌階段規定效果",
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                const playerId2 = DefineFn2.EffectFn.getPlayerID(effect), from = DefineFn2.AbsoluteBaSyouFn.of(playerId2, \"\\u672C\\u56FD\"), cardIds = GameStateFn2.getItemIdsByBasyou(ctx3, from).slice(0, 1);\n                for (let cardId of cardIds)\n                  ctx3 = GameStateFn2.doItemMove(ctx3, DefineFn2.AbsoluteBaSyouFn.of(playerId2, \"\\u624B\\u672D\"), [cardId, from]);\n                return ctx3;\n              }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 2163,
            "description": "PlayerB_61.isRoll undefined => false",
            "effect": {
                "id": "createDrawPhaseRuleEffect_PlayerB",
                "reason": [
                    "GameRule",
                    "PlayerB",
                    {
                        "isDraw": true
                    }
                ],
                "text": {
                    "id": "createDrawPhaseRuleEffect_text_PlayerB",
                    "title": [],
                    "description": "抽牌階段規定效果",
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                const playerId2 = DefineFn2.EffectFn.getPlayerID(effect), from = DefineFn2.AbsoluteBaSyouFn.of(playerId2, \"\\u672C\\u56FD\"), cardIds = GameStateFn2.getItemIdsByBasyou(ctx3, from).slice(0, 1);\n                for (let cardId of cardIds)\n                  ctx3 = GameStateFn2.doItemMove(ctx3, DefineFn2.AbsoluteBaSyouFn.of(playerId2, \"\\u624B\\u672D\"), [cardId, from]);\n                return ctx3;\n              }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 2162,
            "description": "onEffectStart: 抽牌階段規定效果",
            "effect": {
                "id": "createDrawPhaseRuleEffect_PlayerB",
                "reason": [
                    "GameRule",
                    "PlayerB",
                    {
                        "isDraw": true
                    }
                ],
                "text": {
                    "id": "createDrawPhaseRuleEffect_text_PlayerB",
                    "title": [],
                    "description": "抽牌階段規定效果",
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                const playerId2 = DefineFn2.EffectFn.getPlayerID(effect), from = DefineFn2.AbsoluteBaSyouFn.of(playerId2, \"\\u672C\\u56FD\"), cardIds = GameStateFn2.getItemIdsByBasyou(ctx3, from).slice(0, 1);\n                for (let cardId of cardIds)\n                  ctx3 = GameStateFn2.doItemMove(ctx3, DefineFn2.AbsoluteBaSyouFn.of(playerId2, \"\\u624B\\u672D\"), [cardId, from]);\n                return ctx3;\n              }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 2161,
            "description": "onSetPhase:ドローフェイズ,規定の効果"
        },
        {
            "id": 2160,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 2159,
            "description": "onSetPhase:ドローフェイズ,フェイズ開始"
        },
        {
            "id": 2158,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 2157,
            "description": "onSetPhase:リロールフェイズ,フェイズ終了"
        },
        {
            "id": 2156,
            "description": "onSetPhase:リロールフェイズ,フリータイミング"
        },
        {
            "id": 2155,
            "description": "onEffectEnd: getRerollPhaseRuleEffect"
        },
        {
            "id": 2154,
            "description": "PlayerB_77.isRoll true => false",
            "effect": {
                "id": "createRerollPhaseRuleEffect_PlayerB",
                "reason": [
                    "GameRule",
                    "PlayerB",
                    {
                        "isReroll": true
                    }
                ],
                "text": {
                    "id": "createRerollPhaseRuleEffect_text_PlayerB",
                    "title": [],
                    "description": "getRerollPhaseRuleEffect",
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                const playerId2 = DefineFn2.EffectFn.getPlayerID(effect), pairs = [\"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\", \"G\\u30BE\\u30FC\\u30F3\"].flatMap((kw) => {\n                  const basyou = DefineFn2.AbsoluteBaSyouFn.of(playerId2, kw);\n                  return GameStateFn2.getItemIdsByBasyou(ctx3, basyou).filter((cardId) => GameStateFn2.getItemIsCanReroll(ctx3, cardId)).map((cardId) => {\n                    return [cardId, basyou];\n                  });\n                });\n                for (let pair3 of pairs)\n                  ctx3 = GameStateFn2.doItemSetRollState(ctx3, !1, pair3, { isSkipTargetMissing: !0 });\n                return ctx3;\n              }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 2153,
            "description": "PlayerB_76.isRoll true => false",
            "effect": {
                "id": "createRerollPhaseRuleEffect_PlayerB",
                "reason": [
                    "GameRule",
                    "PlayerB",
                    {
                        "isReroll": true
                    }
                ],
                "text": {
                    "id": "createRerollPhaseRuleEffect_text_PlayerB",
                    "title": [],
                    "description": "getRerollPhaseRuleEffect",
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                const playerId2 = DefineFn2.EffectFn.getPlayerID(effect), pairs = [\"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\", \"G\\u30BE\\u30FC\\u30F3\"].flatMap((kw) => {\n                  const basyou = DefineFn2.AbsoluteBaSyouFn.of(playerId2, kw);\n                  return GameStateFn2.getItemIdsByBasyou(ctx3, basyou).filter((cardId) => GameStateFn2.getItemIsCanReroll(ctx3, cardId)).map((cardId) => {\n                    return [cardId, basyou];\n                  });\n                });\n                for (let pair3 of pairs)\n                  ctx3 = GameStateFn2.doItemSetRollState(ctx3, !1, pair3, { isSkipTargetMissing: !0 });\n                return ctx3;\n              }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 2152,
            "description": "PlayerB_95.isRoll true => false",
            "effect": {
                "id": "createRerollPhaseRuleEffect_PlayerB",
                "reason": [
                    "GameRule",
                    "PlayerB",
                    {
                        "isReroll": true
                    }
                ],
                "text": {
                    "id": "createRerollPhaseRuleEffect_text_PlayerB",
                    "title": [],
                    "description": "getRerollPhaseRuleEffect",
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                const playerId2 = DefineFn2.EffectFn.getPlayerID(effect), pairs = [\"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\", \"G\\u30BE\\u30FC\\u30F3\"].flatMap((kw) => {\n                  const basyou = DefineFn2.AbsoluteBaSyouFn.of(playerId2, kw);\n                  return GameStateFn2.getItemIdsByBasyou(ctx3, basyou).filter((cardId) => GameStateFn2.getItemIsCanReroll(ctx3, cardId)).map((cardId) => {\n                    return [cardId, basyou];\n                  });\n                });\n                for (let pair3 of pairs)\n                  ctx3 = GameStateFn2.doItemSetRollState(ctx3, !1, pair3, { isSkipTargetMissing: !0 });\n                return ctx3;\n              }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 2151,
            "description": "PlayerB_85.isRoll true => false",
            "effect": {
                "id": "createRerollPhaseRuleEffect_PlayerB",
                "reason": [
                    "GameRule",
                    "PlayerB",
                    {
                        "isReroll": true
                    }
                ],
                "text": {
                    "id": "createRerollPhaseRuleEffect_text_PlayerB",
                    "title": [],
                    "description": "getRerollPhaseRuleEffect",
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                const playerId2 = DefineFn2.EffectFn.getPlayerID(effect), pairs = [\"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\", \"G\\u30BE\\u30FC\\u30F3\"].flatMap((kw) => {\n                  const basyou = DefineFn2.AbsoluteBaSyouFn.of(playerId2, kw);\n                  return GameStateFn2.getItemIdsByBasyou(ctx3, basyou).filter((cardId) => GameStateFn2.getItemIsCanReroll(ctx3, cardId)).map((cardId) => {\n                    return [cardId, basyou];\n                  });\n                });\n                for (let pair3 of pairs)\n                  ctx3 = GameStateFn2.doItemSetRollState(ctx3, !1, pair3, { isSkipTargetMissing: !0 });\n                return ctx3;\n              }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 2150,
            "description": "PlayerB_87.isRoll true => false",
            "effect": {
                "id": "createRerollPhaseRuleEffect_PlayerB",
                "reason": [
                    "GameRule",
                    "PlayerB",
                    {
                        "isReroll": true
                    }
                ],
                "text": {
                    "id": "createRerollPhaseRuleEffect_text_PlayerB",
                    "title": [],
                    "description": "getRerollPhaseRuleEffect",
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                const playerId2 = DefineFn2.EffectFn.getPlayerID(effect), pairs = [\"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\", \"G\\u30BE\\u30FC\\u30F3\"].flatMap((kw) => {\n                  const basyou = DefineFn2.AbsoluteBaSyouFn.of(playerId2, kw);\n                  return GameStateFn2.getItemIdsByBasyou(ctx3, basyou).filter((cardId) => GameStateFn2.getItemIsCanReroll(ctx3, cardId)).map((cardId) => {\n                    return [cardId, basyou];\n                  });\n                });\n                for (let pair3 of pairs)\n                  ctx3 = GameStateFn2.doItemSetRollState(ctx3, !1, pair3, { isSkipTargetMissing: !0 });\n                return ctx3;\n              }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 2149,
            "description": "PlayerB_104.isRoll true => false",
            "effect": {
                "id": "createRerollPhaseRuleEffect_PlayerB",
                "reason": [
                    "GameRule",
                    "PlayerB",
                    {
                        "isReroll": true
                    }
                ],
                "text": {
                    "id": "createRerollPhaseRuleEffect_text_PlayerB",
                    "title": [],
                    "description": "getRerollPhaseRuleEffect",
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                const playerId2 = DefineFn2.EffectFn.getPlayerID(effect), pairs = [\"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\", \"G\\u30BE\\u30FC\\u30F3\"].flatMap((kw) => {\n                  const basyou = DefineFn2.AbsoluteBaSyouFn.of(playerId2, kw);\n                  return GameStateFn2.getItemIdsByBasyou(ctx3, basyou).filter((cardId) => GameStateFn2.getItemIsCanReroll(ctx3, cardId)).map((cardId) => {\n                    return [cardId, basyou];\n                  });\n                });\n                for (let pair3 of pairs)\n                  ctx3 = GameStateFn2.doItemSetRollState(ctx3, !1, pair3, { isSkipTargetMissing: !0 });\n                return ctx3;\n              }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 2148,
            "description": "PlayerB_74.isRoll true => false",
            "effect": {
                "id": "createRerollPhaseRuleEffect_PlayerB",
                "reason": [
                    "GameRule",
                    "PlayerB",
                    {
                        "isReroll": true
                    }
                ],
                "text": {
                    "id": "createRerollPhaseRuleEffect_text_PlayerB",
                    "title": [],
                    "description": "getRerollPhaseRuleEffect",
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                const playerId2 = DefineFn2.EffectFn.getPlayerID(effect), pairs = [\"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\", \"G\\u30BE\\u30FC\\u30F3\"].flatMap((kw) => {\n                  const basyou = DefineFn2.AbsoluteBaSyouFn.of(playerId2, kw);\n                  return GameStateFn2.getItemIdsByBasyou(ctx3, basyou).filter((cardId) => GameStateFn2.getItemIsCanReroll(ctx3, cardId)).map((cardId) => {\n                    return [cardId, basyou];\n                  });\n                });\n                for (let pair3 of pairs)\n                  ctx3 = GameStateFn2.doItemSetRollState(ctx3, !1, pair3, { isSkipTargetMissing: !0 });\n                return ctx3;\n              }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 2147,
            "description": "onEffectStart: getRerollPhaseRuleEffect",
            "effect": {
                "id": "createRerollPhaseRuleEffect_PlayerB",
                "reason": [
                    "GameRule",
                    "PlayerB",
                    {
                        "isReroll": true
                    }
                ],
                "text": {
                    "id": "createRerollPhaseRuleEffect_text_PlayerB",
                    "title": [],
                    "description": "getRerollPhaseRuleEffect",
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                const playerId2 = DefineFn2.EffectFn.getPlayerID(effect), pairs = [\"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\", \"G\\u30BE\\u30FC\\u30F3\"].flatMap((kw) => {\n                  const basyou = DefineFn2.AbsoluteBaSyouFn.of(playerId2, kw);\n                  return GameStateFn2.getItemIdsByBasyou(ctx3, basyou).filter((cardId) => GameStateFn2.getItemIsCanReroll(ctx3, cardId)).map((cardId) => {\n                    return [cardId, basyou];\n                  });\n                });\n                for (let pair3 of pairs)\n                  ctx3 = GameStateFn2.doItemSetRollState(ctx3, !1, pair3, { isSkipTargetMissing: !0 });\n                return ctx3;\n              }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 2146,
            "description": "onSetPhase:リロールフェイズ,規定の効果"
        },
        {
            "id": 2145,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 2144,
            "description": "onSetPhase:リロールフェイズ,フェイズ開始"
        },
        {
            "id": 2143,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 2142,
            "description": "onPlayerStateChange:PlayerA"
        },
        {
            "id": 2141,
            "description": "onSetPhase:戦闘フェイズ,ターン終了時,効果終了。ターン終了"
        },
        {
            "id": 2140,
            "description": "onSetPhase:戦闘フェイズ,ターン終了時,手札調整"
        },
        {
            "id": 2139,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 2138,
            "description": "onSetPhase:戦闘フェイズ,ターン終了時,効果解決"
        },
        {
            "id": 2137,
            "description": "onSetPhase:戦闘フェイズ,ターン終了時,ダメージリセット"
        },
        {
            "id": 2136,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 2135,
            "description": "onSetPhase:戦闘フェイズ,帰還ステップ,ステップ終了"
        },
        {
            "id": 2134,
            "description": "onSetPhase:戦闘フェイズ,帰還ステップ,フリータイミング2"
        },
        {
            "id": 2133,
            "description": "onEffectEnd: getReturnRuleEffect"
        },
        {
            "id": 2132,
            "description": "onItemMove:PlayerA_51 = [\"PlayerA\",\"戦闘エリア1\"] => [\"PlayerA\",\"配備エリア\"]",
            "effect": {
                "id": "createReturnRuleEffect_PlayerA",
                "reason": [
                    "GameRule",
                    "PlayerA",
                    {
                        "isReturn": true
                    }
                ],
                "text": {
                    "id": "createReturnRuleEffect_text_PlayerA",
                    "title": [],
                    "description": "getReturnRuleEffect",
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                const playerId2 = DefineFn2.EffectFn.getPlayerID(effect), opponentId = DefineFn2.PlayerIDFn.getOpponent(playerId2);\n                ctx3 = _processKw(ctx3, playerId2, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A21\"), ctx3 = _processKw(ctx3, playerId2, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A22\"), ctx3 = _processKw(ctx3, opponentId, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A21\"), ctx3 = _processKw(ctx3, opponentId, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A22\");\n                function _processKw(ctx4, playerId3, fromKw) {\n                  const from = DefineFn2.AbsoluteBaSyouFn.of(playerId3, fromKw), runtimeArea1 = GameStateFn2.getRuntimeBattleArea(ctx4, fromKw), unitIdsAtArea1 = GameStateFn2.getItemIdsByBasyou(ctx4, from);\n                  for (let cardId of unitIdsAtArea1) {\n                    const target = [cardId, from];\n                    if (GameStateFn2.getSetGroupRoot(ctx4, cardId) != cardId)\n                      continue;\n                    if (GameStateFn2.getCardBattleArea(ctx4, cardId).includes(runtimeArea1))\n                      ctx4 = GameStateFn2.doItemSetRollState(ctx4, !0, target, { isSkipTargetMissing: !0 }), ctx4 = GameStateFn2.doItemMove(ctx4, DefineFn2.AbsoluteBaSyouFn.of(playerId3, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\"), target, { isSkipTargetMissing: !0 });\n                    else\n                      ctx4 = GameStateFn2.doItemMove(ctx4, DefineFn2.AbsoluteBaSyouFn.of(playerId3, \"\\u30B8\\u30E3\\u30F3\\u30AF\\u30E4\\u30FC\\u30C9\"), target, { isSkipTargetMissing: !0 });\n                  }\n                  return ctx4;\n                }\n                return ctx3;\n              }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 2131,
            "description": "onEvent: GameEventOnMove [\"PlayerA_51\"]",
            "effect": {
                "id": "createReturnRuleEffect_PlayerA",
                "reason": [
                    "GameRule",
                    "PlayerA",
                    {
                        "isReturn": true
                    }
                ],
                "text": {
                    "id": "createReturnRuleEffect_text_PlayerA",
                    "title": [],
                    "description": "getReturnRuleEffect",
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                const playerId2 = DefineFn2.EffectFn.getPlayerID(effect), opponentId = DefineFn2.PlayerIDFn.getOpponent(playerId2);\n                ctx3 = _processKw(ctx3, playerId2, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A21\"), ctx3 = _processKw(ctx3, playerId2, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A22\"), ctx3 = _processKw(ctx3, opponentId, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A21\"), ctx3 = _processKw(ctx3, opponentId, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A22\");\n                function _processKw(ctx4, playerId3, fromKw) {\n                  const from = DefineFn2.AbsoluteBaSyouFn.of(playerId3, fromKw), runtimeArea1 = GameStateFn2.getRuntimeBattleArea(ctx4, fromKw), unitIdsAtArea1 = GameStateFn2.getItemIdsByBasyou(ctx4, from);\n                  for (let cardId of unitIdsAtArea1) {\n                    const target = [cardId, from];\n                    if (GameStateFn2.getSetGroupRoot(ctx4, cardId) != cardId)\n                      continue;\n                    if (GameStateFn2.getCardBattleArea(ctx4, cardId).includes(runtimeArea1))\n                      ctx4 = GameStateFn2.doItemSetRollState(ctx4, !0, target, { isSkipTargetMissing: !0 }), ctx4 = GameStateFn2.doItemMove(ctx4, DefineFn2.AbsoluteBaSyouFn.of(playerId3, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\"), target, { isSkipTargetMissing: !0 });\n                    else\n                      ctx4 = GameStateFn2.doItemMove(ctx4, DefineFn2.AbsoluteBaSyouFn.of(playerId3, \"\\u30B8\\u30E3\\u30F3\\u30AF\\u30E4\\u30FC\\u30C9\"), target, { isSkipTargetMissing: !0 });\n                  }\n                  return ctx4;\n                }\n                return ctx3;\n              }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 2130,
            "description": "PlayerA_51.isRoll false => true",
            "effect": {
                "id": "createReturnRuleEffect_PlayerA",
                "reason": [
                    "GameRule",
                    "PlayerA",
                    {
                        "isReturn": true
                    }
                ],
                "text": {
                    "id": "createReturnRuleEffect_text_PlayerA",
                    "title": [],
                    "description": "getReturnRuleEffect",
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                const playerId2 = DefineFn2.EffectFn.getPlayerID(effect), opponentId = DefineFn2.PlayerIDFn.getOpponent(playerId2);\n                ctx3 = _processKw(ctx3, playerId2, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A21\"), ctx3 = _processKw(ctx3, playerId2, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A22\"), ctx3 = _processKw(ctx3, opponentId, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A21\"), ctx3 = _processKw(ctx3, opponentId, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A22\");\n                function _processKw(ctx4, playerId3, fromKw) {\n                  const from = DefineFn2.AbsoluteBaSyouFn.of(playerId3, fromKw), runtimeArea1 = GameStateFn2.getRuntimeBattleArea(ctx4, fromKw), unitIdsAtArea1 = GameStateFn2.getItemIdsByBasyou(ctx4, from);\n                  for (let cardId of unitIdsAtArea1) {\n                    const target = [cardId, from];\n                    if (GameStateFn2.getSetGroupRoot(ctx4, cardId) != cardId)\n                      continue;\n                    if (GameStateFn2.getCardBattleArea(ctx4, cardId).includes(runtimeArea1))\n                      ctx4 = GameStateFn2.doItemSetRollState(ctx4, !0, target, { isSkipTargetMissing: !0 }), ctx4 = GameStateFn2.doItemMove(ctx4, DefineFn2.AbsoluteBaSyouFn.of(playerId3, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\"), target, { isSkipTargetMissing: !0 });\n                    else\n                      ctx4 = GameStateFn2.doItemMove(ctx4, DefineFn2.AbsoluteBaSyouFn.of(playerId3, \"\\u30B8\\u30E3\\u30F3\\u30AF\\u30E4\\u30FC\\u30C9\"), target, { isSkipTargetMissing: !0 });\n                  }\n                  return ctx4;\n                }\n                return ctx3;\n              }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 2129,
            "description": "onEffectStart: getReturnRuleEffect",
            "effect": {
                "id": "createReturnRuleEffect_PlayerA",
                "reason": [
                    "GameRule",
                    "PlayerA",
                    {
                        "isReturn": true
                    }
                ],
                "text": {
                    "id": "createReturnRuleEffect_text_PlayerA",
                    "title": [],
                    "description": "getReturnRuleEffect",
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                const playerId2 = DefineFn2.EffectFn.getPlayerID(effect), opponentId = DefineFn2.PlayerIDFn.getOpponent(playerId2);\n                ctx3 = _processKw(ctx3, playerId2, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A21\"), ctx3 = _processKw(ctx3, playerId2, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A22\"), ctx3 = _processKw(ctx3, opponentId, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A21\"), ctx3 = _processKw(ctx3, opponentId, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A22\");\n                function _processKw(ctx4, playerId3, fromKw) {\n                  const from = DefineFn2.AbsoluteBaSyouFn.of(playerId3, fromKw), runtimeArea1 = GameStateFn2.getRuntimeBattleArea(ctx4, fromKw), unitIdsAtArea1 = GameStateFn2.getItemIdsByBasyou(ctx4, from);\n                  for (let cardId of unitIdsAtArea1) {\n                    const target = [cardId, from];\n                    if (GameStateFn2.getSetGroupRoot(ctx4, cardId) != cardId)\n                      continue;\n                    if (GameStateFn2.getCardBattleArea(ctx4, cardId).includes(runtimeArea1))\n                      ctx4 = GameStateFn2.doItemSetRollState(ctx4, !0, target, { isSkipTargetMissing: !0 }), ctx4 = GameStateFn2.doItemMove(ctx4, DefineFn2.AbsoluteBaSyouFn.of(playerId3, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\"), target, { isSkipTargetMissing: !0 });\n                    else\n                      ctx4 = GameStateFn2.doItemMove(ctx4, DefineFn2.AbsoluteBaSyouFn.of(playerId3, \"\\u30B8\\u30E3\\u30F3\\u30AF\\u30E4\\u30FC\\u30C9\"), target, { isSkipTargetMissing: !0 });\n                  }\n                  return ctx4;\n                }\n                return ctx3;\n              }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 2128,
            "description": "onSetPhase:戦闘フェイズ,帰還ステップ,規定の効果"
        },
        {
            "id": 2127,
            "description": "onSetPhase:戦闘フェイズ,帰還ステップ,フリータイミング"
        },
        {
            "id": 2126,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 2125,
            "description": "onSetPhase:戦闘フェイズ,帰還ステップ,ステップ開始"
        },
        {
            "id": 2124,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 2123,
            "description": "onSetPhase:戦闘フェイズ,ダメージ判定ステップ,ステップ終了"
        },
        {
            "id": 2122,
            "description": "onSetPhase:戦闘フェイズ,ダメージ判定ステップ,フリータイミング2"
        },
        {
            "id": 2121,
            "description": "onEffectEnd: getDamageRuleEffect"
        },
        {
            "id": 2120,
            "description": "onEvent: このカードの部隊が敵軍本国に戦闘ダメージを与えた場合 [\"PlayerA_51\"]",
            "effect": {
                "id": "createDamageRuleEffect_PlayerA",
                "reason": [
                    "GameRule",
                    "PlayerA",
                    {
                        "isDamageCheck": true
                    }
                ],
                "text": {
                    "id": "createDamageRuleEffect_text_PlayerA",
                    "title": [],
                    "description": "getDamageRuleEffect",
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                const playerId2 = DefineFn2.EffectFn.getPlayerID(effect);\n                return ctx3 = GameStateFn2.doPlayerAttack(ctx3, playerId2, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A21\", 1), ctx3 = GameStateFn2.doPlayerAttack(ctx3, playerId2, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A22\", 1), ctx3 = GameStateFn2.doPlayerAttack(ctx3, playerId2, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A21\", 2), ctx3 = GameStateFn2.doPlayerAttack(ctx3, playerId2, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A22\", 2), ctx3;\n              }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 2119,
            "description": "本國受到傷害: PlayerB => 4 damage",
            "effect": {
                "id": "createDamageRuleEffect_PlayerA",
                "reason": [
                    "GameRule",
                    "PlayerA",
                    {
                        "isDamageCheck": true
                    }
                ],
                "text": {
                    "id": "createDamageRuleEffect_text_PlayerA",
                    "title": [],
                    "description": "getDamageRuleEffect",
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                const playerId2 = DefineFn2.EffectFn.getPlayerID(effect);\n                return ctx3 = GameStateFn2.doPlayerAttack(ctx3, playerId2, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A21\", 1), ctx3 = GameStateFn2.doPlayerAttack(ctx3, playerId2, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A22\", 1), ctx3 = GameStateFn2.doPlayerAttack(ctx3, playerId2, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A21\", 2), ctx3 = GameStateFn2.doPlayerAttack(ctx3, playerId2, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A22\", 2), ctx3;\n              }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 2118,
            "description": "onEvent: 自軍本国に戦闘ダメージが与えられた場合 undefined",
            "effect": {
                "id": "createDamageRuleEffect_PlayerA",
                "reason": [
                    "GameRule",
                    "PlayerA",
                    {
                        "isDamageCheck": true
                    }
                ],
                "text": {
                    "id": "createDamageRuleEffect_text_PlayerA",
                    "title": [],
                    "description": "getDamageRuleEffect",
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                const playerId2 = DefineFn2.EffectFn.getPlayerID(effect);\n                return ctx3 = GameStateFn2.doPlayerAttack(ctx3, playerId2, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A21\", 1), ctx3 = GameStateFn2.doPlayerAttack(ctx3, playerId2, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A22\", 1), ctx3 = GameStateFn2.doPlayerAttack(ctx3, playerId2, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A21\", 2), ctx3 = GameStateFn2.doPlayerAttack(ctx3, playerId2, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A22\", 2), ctx3;\n              }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 2117,
            "description": "onItemMove:PlayerB_96 = [\"PlayerB\",\"本国\"] => [\"PlayerB\",\"捨て山\"]",
            "effect": {
                "id": "createDamageRuleEffect_PlayerA",
                "reason": [
                    "GameRule",
                    "PlayerA",
                    {
                        "isDamageCheck": true
                    }
                ],
                "text": {
                    "id": "createDamageRuleEffect_text_PlayerA",
                    "title": [],
                    "description": "getDamageRuleEffect",
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                const playerId2 = DefineFn2.EffectFn.getPlayerID(effect);\n                return ctx3 = GameStateFn2.doPlayerAttack(ctx3, playerId2, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A21\", 1), ctx3 = GameStateFn2.doPlayerAttack(ctx3, playerId2, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A22\", 1), ctx3 = GameStateFn2.doPlayerAttack(ctx3, playerId2, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A21\", 2), ctx3 = GameStateFn2.doPlayerAttack(ctx3, playerId2, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A22\", 2), ctx3;\n              }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 2116,
            "description": "onEvent: GameEventOnMove [\"PlayerB_96\"]",
            "effect": {
                "id": "createDamageRuleEffect_PlayerA",
                "reason": [
                    "GameRule",
                    "PlayerA",
                    {
                        "isDamageCheck": true
                    }
                ],
                "text": {
                    "id": "createDamageRuleEffect_text_PlayerA",
                    "title": [],
                    "description": "getDamageRuleEffect",
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                const playerId2 = DefineFn2.EffectFn.getPlayerID(effect);\n                return ctx3 = GameStateFn2.doPlayerAttack(ctx3, playerId2, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A21\", 1), ctx3 = GameStateFn2.doPlayerAttack(ctx3, playerId2, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A22\", 1), ctx3 = GameStateFn2.doPlayerAttack(ctx3, playerId2, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A21\", 2), ctx3 = GameStateFn2.doPlayerAttack(ctx3, playerId2, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A22\", 2), ctx3;\n              }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 2115,
            "description": "PlayerB_96.isRoll undefined => false",
            "effect": {
                "id": "createDamageRuleEffect_PlayerA",
                "reason": [
                    "GameRule",
                    "PlayerA",
                    {
                        "isDamageCheck": true
                    }
                ],
                "text": {
                    "id": "createDamageRuleEffect_text_PlayerA",
                    "title": [],
                    "description": "getDamageRuleEffect",
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                const playerId2 = DefineFn2.EffectFn.getPlayerID(effect);\n                return ctx3 = GameStateFn2.doPlayerAttack(ctx3, playerId2, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A21\", 1), ctx3 = GameStateFn2.doPlayerAttack(ctx3, playerId2, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A22\", 1), ctx3 = GameStateFn2.doPlayerAttack(ctx3, playerId2, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A21\", 2), ctx3 = GameStateFn2.doPlayerAttack(ctx3, playerId2, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A22\", 2), ctx3;\n              }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 2114,
            "description": "onItemMove:PlayerB_99 = [\"PlayerB\",\"本国\"] => [\"PlayerB\",\"捨て山\"]",
            "effect": {
                "id": "createDamageRuleEffect_PlayerA",
                "reason": [
                    "GameRule",
                    "PlayerA",
                    {
                        "isDamageCheck": true
                    }
                ],
                "text": {
                    "id": "createDamageRuleEffect_text_PlayerA",
                    "title": [],
                    "description": "getDamageRuleEffect",
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                const playerId2 = DefineFn2.EffectFn.getPlayerID(effect);\n                return ctx3 = GameStateFn2.doPlayerAttack(ctx3, playerId2, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A21\", 1), ctx3 = GameStateFn2.doPlayerAttack(ctx3, playerId2, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A22\", 1), ctx3 = GameStateFn2.doPlayerAttack(ctx3, playerId2, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A21\", 2), ctx3 = GameStateFn2.doPlayerAttack(ctx3, playerId2, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A22\", 2), ctx3;\n              }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 2113,
            "description": "onEvent: GameEventOnMove [\"PlayerB_99\"]",
            "effect": {
                "id": "createDamageRuleEffect_PlayerA",
                "reason": [
                    "GameRule",
                    "PlayerA",
                    {
                        "isDamageCheck": true
                    }
                ],
                "text": {
                    "id": "createDamageRuleEffect_text_PlayerA",
                    "title": [],
                    "description": "getDamageRuleEffect",
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                const playerId2 = DefineFn2.EffectFn.getPlayerID(effect);\n                return ctx3 = GameStateFn2.doPlayerAttack(ctx3, playerId2, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A21\", 1), ctx3 = GameStateFn2.doPlayerAttack(ctx3, playerId2, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A22\", 1), ctx3 = GameStateFn2.doPlayerAttack(ctx3, playerId2, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A21\", 2), ctx3 = GameStateFn2.doPlayerAttack(ctx3, playerId2, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A22\", 2), ctx3;\n              }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 2112,
            "description": "PlayerB_99.isRoll undefined => false",
            "effect": {
                "id": "createDamageRuleEffect_PlayerA",
                "reason": [
                    "GameRule",
                    "PlayerA",
                    {
                        "isDamageCheck": true
                    }
                ],
                "text": {
                    "id": "createDamageRuleEffect_text_PlayerA",
                    "title": [],
                    "description": "getDamageRuleEffect",
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                const playerId2 = DefineFn2.EffectFn.getPlayerID(effect);\n                return ctx3 = GameStateFn2.doPlayerAttack(ctx3, playerId2, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A21\", 1), ctx3 = GameStateFn2.doPlayerAttack(ctx3, playerId2, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A22\", 1), ctx3 = GameStateFn2.doPlayerAttack(ctx3, playerId2, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A21\", 2), ctx3 = GameStateFn2.doPlayerAttack(ctx3, playerId2, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A22\", 2), ctx3;\n              }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 2111,
            "description": "onItemMove:PlayerB_80 = [\"PlayerB\",\"本国\"] => [\"PlayerB\",\"捨て山\"]",
            "effect": {
                "id": "createDamageRuleEffect_PlayerA",
                "reason": [
                    "GameRule",
                    "PlayerA",
                    {
                        "isDamageCheck": true
                    }
                ],
                "text": {
                    "id": "createDamageRuleEffect_text_PlayerA",
                    "title": [],
                    "description": "getDamageRuleEffect",
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                const playerId2 = DefineFn2.EffectFn.getPlayerID(effect);\n                return ctx3 = GameStateFn2.doPlayerAttack(ctx3, playerId2, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A21\", 1), ctx3 = GameStateFn2.doPlayerAttack(ctx3, playerId2, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A22\", 1), ctx3 = GameStateFn2.doPlayerAttack(ctx3, playerId2, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A21\", 2), ctx3 = GameStateFn2.doPlayerAttack(ctx3, playerId2, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A22\", 2), ctx3;\n              }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 2110,
            "description": "onEvent: GameEventOnMove [\"PlayerB_80\"]",
            "effect": {
                "id": "createDamageRuleEffect_PlayerA",
                "reason": [
                    "GameRule",
                    "PlayerA",
                    {
                        "isDamageCheck": true
                    }
                ],
                "text": {
                    "id": "createDamageRuleEffect_text_PlayerA",
                    "title": [],
                    "description": "getDamageRuleEffect",
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                const playerId2 = DefineFn2.EffectFn.getPlayerID(effect);\n                return ctx3 = GameStateFn2.doPlayerAttack(ctx3, playerId2, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A21\", 1), ctx3 = GameStateFn2.doPlayerAttack(ctx3, playerId2, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A22\", 1), ctx3 = GameStateFn2.doPlayerAttack(ctx3, playerId2, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A21\", 2), ctx3 = GameStateFn2.doPlayerAttack(ctx3, playerId2, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A22\", 2), ctx3;\n              }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 2109,
            "description": "PlayerB_80.isRoll undefined => false",
            "effect": {
                "id": "createDamageRuleEffect_PlayerA",
                "reason": [
                    "GameRule",
                    "PlayerA",
                    {
                        "isDamageCheck": true
                    }
                ],
                "text": {
                    "id": "createDamageRuleEffect_text_PlayerA",
                    "title": [],
                    "description": "getDamageRuleEffect",
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                const playerId2 = DefineFn2.EffectFn.getPlayerID(effect);\n                return ctx3 = GameStateFn2.doPlayerAttack(ctx3, playerId2, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A21\", 1), ctx3 = GameStateFn2.doPlayerAttack(ctx3, playerId2, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A22\", 1), ctx3 = GameStateFn2.doPlayerAttack(ctx3, playerId2, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A21\", 2), ctx3 = GameStateFn2.doPlayerAttack(ctx3, playerId2, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A22\", 2), ctx3;\n              }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 2108,
            "description": "onItemMove:PlayerB_73 = [\"PlayerB\",\"本国\"] => [\"PlayerB\",\"捨て山\"]",
            "effect": {
                "id": "createDamageRuleEffect_PlayerA",
                "reason": [
                    "GameRule",
                    "PlayerA",
                    {
                        "isDamageCheck": true
                    }
                ],
                "text": {
                    "id": "createDamageRuleEffect_text_PlayerA",
                    "title": [],
                    "description": "getDamageRuleEffect",
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                const playerId2 = DefineFn2.EffectFn.getPlayerID(effect);\n                return ctx3 = GameStateFn2.doPlayerAttack(ctx3, playerId2, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A21\", 1), ctx3 = GameStateFn2.doPlayerAttack(ctx3, playerId2, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A22\", 1), ctx3 = GameStateFn2.doPlayerAttack(ctx3, playerId2, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A21\", 2), ctx3 = GameStateFn2.doPlayerAttack(ctx3, playerId2, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A22\", 2), ctx3;\n              }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 2107,
            "description": "onEvent: GameEventOnMove [\"PlayerB_73\"]",
            "effect": {
                "id": "createDamageRuleEffect_PlayerA",
                "reason": [
                    "GameRule",
                    "PlayerA",
                    {
                        "isDamageCheck": true
                    }
                ],
                "text": {
                    "id": "createDamageRuleEffect_text_PlayerA",
                    "title": [],
                    "description": "getDamageRuleEffect",
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                const playerId2 = DefineFn2.EffectFn.getPlayerID(effect);\n                return ctx3 = GameStateFn2.doPlayerAttack(ctx3, playerId2, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A21\", 1), ctx3 = GameStateFn2.doPlayerAttack(ctx3, playerId2, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A22\", 1), ctx3 = GameStateFn2.doPlayerAttack(ctx3, playerId2, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A21\", 2), ctx3 = GameStateFn2.doPlayerAttack(ctx3, playerId2, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A22\", 2), ctx3;\n              }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 2106,
            "description": "PlayerB_73.isRoll undefined => false",
            "effect": {
                "id": "createDamageRuleEffect_PlayerA",
                "reason": [
                    "GameRule",
                    "PlayerA",
                    {
                        "isDamageCheck": true
                    }
                ],
                "text": {
                    "id": "createDamageRuleEffect_text_PlayerA",
                    "title": [],
                    "description": "getDamageRuleEffect",
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                const playerId2 = DefineFn2.EffectFn.getPlayerID(effect);\n                return ctx3 = GameStateFn2.doPlayerAttack(ctx3, playerId2, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A21\", 1), ctx3 = GameStateFn2.doPlayerAttack(ctx3, playerId2, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A22\", 1), ctx3 = GameStateFn2.doPlayerAttack(ctx3, playerId2, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A21\", 2), ctx3 = GameStateFn2.doPlayerAttack(ctx3, playerId2, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A22\", 2), ctx3;\n              }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 2105,
            "description": "onEffectStart: getDamageRuleEffect",
            "effect": {
                "id": "createDamageRuleEffect_PlayerA",
                "reason": [
                    "GameRule",
                    "PlayerA",
                    {
                        "isDamageCheck": true
                    }
                ],
                "text": {
                    "id": "createDamageRuleEffect_text_PlayerA",
                    "title": [],
                    "description": "getDamageRuleEffect",
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                const playerId2 = DefineFn2.EffectFn.getPlayerID(effect);\n                return ctx3 = GameStateFn2.doPlayerAttack(ctx3, playerId2, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A21\", 1), ctx3 = GameStateFn2.doPlayerAttack(ctx3, playerId2, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A22\", 1), ctx3 = GameStateFn2.doPlayerAttack(ctx3, playerId2, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A21\", 2), ctx3 = GameStateFn2.doPlayerAttack(ctx3, playerId2, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A22\", 2), ctx3;\n              }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 2104,
            "description": "onSetPhase:戦闘フェイズ,ダメージ判定ステップ,規定の効果"
        },
        {
            "id": 2103,
            "description": "onSetPhase:戦闘フェイズ,ダメージ判定ステップ,フリータイミング"
        },
        {
            "id": 2102,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 2101,
            "description": "onSetPhase:戦闘フェイズ,ダメージ判定ステップ,ステップ開始"
        },
        {
            "id": 2100,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 2099,
            "description": "onSetPhase:戦闘フェイズ,防御ステップ,ステップ終了"
        },
        {
            "id": 2098,
            "description": "onSetPhase:戦闘フェイズ,防御ステップ,フリータイミング2"
        },
        {
            "id": 2097,
            "description": "onEffectEnd: 出擊"
        },
        {
            "id": 2096,
            "description": "onEffectStart: 出擊",
            "effect": {
                "id": "createAttackPhaseRuleEffect_PlayerB",
                "reason": [
                    "GameRule",
                    "PlayerB",
                    {
                        "isAttack": false,
                        "isDefence": true
                    }
                ],
                "description": "出擊",
                "isOption": true,
                "text": {
                    "id": "createAttackPhaseRuleEffect_text_PlayerB",
                    "title": [],
                    "description": "出擊",
                    "conditions": {
                        "去地球": {
                            "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n            const runtimeBattleArea = GameStateFn2.getRuntimeBattleArea(ctx3, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A21\");\n            if (runtimeBattleArea == \"\\u5B87\\u5B99\\u30A8\\u30EA\\u30A2\")\n              return null;\n            const playerId2 = DefineFn2.EffectFn.getPlayerID(effect), opponentPlayerId = DefineFn2.PlayerIDFn.getOpponent(playerId2);\n            let unitIds = GameStateFn2.getItemIdsByBasyou(ctx3, DefineFn2.AbsoluteBaSyouFn.of(playerId2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\")).filter((cardId) => GameStateFn2.getSetGroupRoot(ctx3, cardId) == cardId).filter((cardId) => GameStateFn2.getCardBattleArea(ctx3, cardId).includes(runtimeBattleArea)).filter((cardId) => GameStateFn2.getCard(ctx3, cardId).isRoll != !0);\n            const opponentUnitIds = GameStateFn2.getBattleGroup(ctx3, DefineFn2.AbsoluteBaSyouFn.of(opponentPlayerId, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A21\"));\n            if (opponentUnitIds.length) {\n              if (GameStateFn2.isBattleGroupHasA(ctx3, [\"\\u9AD8\\u6A5F\\u52D5\"], opponentUnitIds[0]))\n                unitIds = unitIds.filter((id) => GameStateFn2.isBattleGroupHasA(ctx3, [\"\\u9AD8\\u6A5F\\u52D5\"], id));\n            }\n            return {\n              title: [\"\\u30AB\\u30FC\\u30C9\", unitIds.map((id) => {\n                return [id, GameStateFn2.getItemBaSyou(ctx3, id)];\n              }), []],\n              flags: { isGoBattleArea1: !0 }\n            };\n          }",
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                const playerId2 = DefineFn2.EffectFn.getPlayerID(effect), fackCardId = DefineFn2.EffectFn.getCardID(effect), earthPairs = GameStateFn2.getCardTipStrBaSyouPairs(ctx3, \"\\u53BB\\u5730\\u7403\", fackCardId), phase2 = GameStateFn2.getPhase(ctx3);\n                for (let pair3 of earthPairs)\n                  ctx3 = GameStateFn2.mapItemState(ctx3, pair3[0], (is) => ({ ...is, isAttack: phase2[1] == \"\\u653B\\u6483\\u30B9\\u30C6\\u30C3\\u30D7\", isDefence: phase2[1] == \"\\u9632\\u5FA1\\u30B9\\u30C6\\u30C3\\u30D7\" })), ctx3 = GameStateFn2.doItemMove(ctx3, DefineFn2.AbsoluteBaSyouFn.of(playerId2, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A21\"), pair3);\n                return ctx3;\n              }"
                                }
                            ],
                            "groupKey": "出擊"
                        },
                        "去宇宙": {
                            "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n            const runtimeBattleArea = GameStateFn2.getRuntimeBattleArea(ctx3, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A22\");\n            if (runtimeBattleArea == \"\\u5730\\u7403\\u30A8\\u30EA\\u30A2\")\n              return null;\n            const playerId2 = DefineFn2.EffectFn.getPlayerID(effect), opponentPlayerId = DefineFn2.PlayerIDFn.getOpponent(playerId2);\n            let unitIds = GameStateFn2.getItemIdsByBasyou(ctx3, DefineFn2.AbsoluteBaSyouFn.of(playerId2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\")).filter((cardId) => GameStateFn2.getSetGroupRoot(ctx3, cardId) == cardId).filter((cardId) => GameStateFn2.getCardBattleArea(ctx3, cardId).includes(runtimeBattleArea)).filter((cardId) => GameStateFn2.getCard(ctx3, cardId).isRoll != !0);\n            const opponentUnitIds = GameStateFn2.getBattleGroup(ctx3, DefineFn2.AbsoluteBaSyouFn.of(opponentPlayerId, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A22\"));\n            if (opponentUnitIds.length) {\n              if (GameStateFn2.isBattleGroupHasA(ctx3, [\"\\u9AD8\\u6A5F\\u52D5\"], opponentUnitIds[0]))\n                unitIds = unitIds.filter((id) => GameStateFn2.isBattleGroupHasA(ctx3, [\"\\u9AD8\\u6A5F\\u52D5\"], id));\n            }\n            return {\n              title: [\"\\u30AB\\u30FC\\u30C9\", unitIds.map((id) => {\n                return [id, GameStateFn2.getItemBaSyou(ctx3, id)];\n              }), []],\n              flags: { isGoBattleArea2: !0 }\n            };\n          }",
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                const playerId2 = DefineFn2.EffectFn.getPlayerID(effect), fackCardId = DefineFn2.EffectFn.getCardID(effect), spacePairs = GameStateFn2.getCardTipStrBaSyouPairs(ctx3, \"\\u53BB\\u5B87\\u5B99\", fackCardId), phase2 = GameStateFn2.getPhase(ctx3);\n                for (let pair3 of spacePairs)\n                  ctx3 = GameStateFn2.mapItemState(ctx3, pair3[0], (is) => ({ ...is, isAttack: phase2[1] == \"\\u653B\\u6483\\u30B9\\u30C6\\u30C3\\u30D7\", isDefence: phase2[1] == \"\\u9632\\u5FA1\\u30B9\\u30C6\\u30C3\\u30D7\" })), ctx3 = GameStateFn2.doItemMove(ctx3, DefineFn2.AbsoluteBaSyouFn.of(playerId2, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A22\"), pair3);\n                return ctx3;\n              }"
                                }
                            ],
                            "groupKey": "出擊"
                        }
                    },
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                const fackCardId = DefineFn2.EffectFn.getCardID(effect), phase2 = GameStateFn2.getPhase(ctx3), pairs1 = GameStateFn2.getCardTipStrBaSyouPairs(ctx3, \"\\u53BB\\u5730\\u7403\", fackCardId), pairs2 = GameStateFn2.getCardTipStrBaSyouPairs(ctx3, \"\\u53BB\\u5B87\\u5B99\", fackCardId);\n                if (DefineFn2.PhaseFn.eq(phase2, [\"\\u6226\\u95D8\\u30D5\\u30A7\\u30A4\\u30BA\", \"\\u653B\\u6483\\u30B9\\u30C6\\u30C3\\u30D7\", \"\\u898F\\u5B9A\\u306E\\u52B9\\u679C\"]))\n                  ctx3 = GameStateFn2.doTriggerEvent(ctx3, {\n                    title: [\"\\u3053\\u306E\\u30AB\\u30FC\\u30C9\\u304C\\u653B\\u6483\\u306B\\u51FA\\u6483\\u3057\\u305F\\u5834\\u5408\"],\n                    cardIds: [...pairs1, ...pairs2].map((p) => p[0])\n                  });\n                return ctx3;\n              }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 2095,
            "description": "onSetPhase:戦闘フェイズ,防御ステップ,規定の効果"
        },
        {
            "id": 2094,
            "description": "onSetPhase:戦闘フェイズ,防御ステップ,フリータイミング"
        },
        {
            "id": 2093,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 2092,
            "description": "onSetPhase:戦闘フェイズ,防御ステップ,ステップ開始"
        },
        {
            "id": 2091,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 2090,
            "description": "onSetPhase:戦闘フェイズ,攻撃ステップ,ステップ終了"
        },
        {
            "id": 2089,
            "description": "onSetPhase:戦闘フェイズ,攻撃ステップ,フリータイミング2"
        },
        {
            "id": 2088,
            "description": "onEffectEnd: 出擊"
        },
        {
            "id": 2087,
            "description": "onEvent: このカードが攻撃に出撃した場合 [\"PlayerA_51\"]",
            "effect": {
                "id": "createAttackPhaseRuleEffect_PlayerA",
                "reason": [
                    "GameRule",
                    "PlayerA",
                    {
                        "isAttack": true,
                        "isDefence": false
                    }
                ],
                "description": "出擊",
                "isOption": true,
                "text": {
                    "id": "createAttackPhaseRuleEffect_text_PlayerA",
                    "title": [],
                    "description": "出擊",
                    "conditions": {
                        "去地球": {
                            "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n            const runtimeBattleArea = GameStateFn2.getRuntimeBattleArea(ctx3, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A21\");\n            if (runtimeBattleArea == \"\\u5B87\\u5B99\\u30A8\\u30EA\\u30A2\")\n              return null;\n            const playerId2 = DefineFn2.EffectFn.getPlayerID(effect), opponentPlayerId = DefineFn2.PlayerIDFn.getOpponent(playerId2);\n            let unitIds = GameStateFn2.getItemIdsByBasyou(ctx3, DefineFn2.AbsoluteBaSyouFn.of(playerId2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\")).filter((cardId) => GameStateFn2.getSetGroupRoot(ctx3, cardId) == cardId).filter((cardId) => GameStateFn2.getCardBattleArea(ctx3, cardId).includes(runtimeBattleArea)).filter((cardId) => GameStateFn2.getCard(ctx3, cardId).isRoll != !0);\n            const opponentUnitIds = GameStateFn2.getBattleGroup(ctx3, DefineFn2.AbsoluteBaSyouFn.of(opponentPlayerId, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A21\"));\n            if (opponentUnitIds.length) {\n              if (GameStateFn2.isBattleGroupHasA(ctx3, [\"\\u9AD8\\u6A5F\\u52D5\"], opponentUnitIds[0]))\n                unitIds = unitIds.filter((id) => GameStateFn2.isBattleGroupHasA(ctx3, [\"\\u9AD8\\u6A5F\\u52D5\"], id));\n            }\n            return {\n              title: [\"\\u30AB\\u30FC\\u30C9\", unitIds.map((id) => {\n                return [id, GameStateFn2.getItemBaSyou(ctx3, id)];\n              }), []],\n              flags: { isGoBattleArea1: !0 }\n            };\n          }",
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                const playerId2 = DefineFn2.EffectFn.getPlayerID(effect), fackCardId = DefineFn2.EffectFn.getCardID(effect), earthPairs = GameStateFn2.getCardTipStrBaSyouPairs(ctx3, \"\\u53BB\\u5730\\u7403\", fackCardId), phase2 = GameStateFn2.getPhase(ctx3);\n                for (let pair3 of earthPairs)\n                  ctx3 = GameStateFn2.mapItemState(ctx3, pair3[0], (is) => ({ ...is, isAttack: phase2[1] == \"\\u653B\\u6483\\u30B9\\u30C6\\u30C3\\u30D7\", isDefence: phase2[1] == \"\\u9632\\u5FA1\\u30B9\\u30C6\\u30C3\\u30D7\" })), ctx3 = GameStateFn2.doItemMove(ctx3, DefineFn2.AbsoluteBaSyouFn.of(playerId2, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A21\"), pair3);\n                return ctx3;\n              }"
                                }
                            ],
                            "groupKey": "出擊"
                        },
                        "去宇宙": {
                            "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n            const runtimeBattleArea = GameStateFn2.getRuntimeBattleArea(ctx3, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A22\");\n            if (runtimeBattleArea == \"\\u5730\\u7403\\u30A8\\u30EA\\u30A2\")\n              return null;\n            const playerId2 = DefineFn2.EffectFn.getPlayerID(effect), opponentPlayerId = DefineFn2.PlayerIDFn.getOpponent(playerId2);\n            let unitIds = GameStateFn2.getItemIdsByBasyou(ctx3, DefineFn2.AbsoluteBaSyouFn.of(playerId2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\")).filter((cardId) => GameStateFn2.getSetGroupRoot(ctx3, cardId) == cardId).filter((cardId) => GameStateFn2.getCardBattleArea(ctx3, cardId).includes(runtimeBattleArea)).filter((cardId) => GameStateFn2.getCard(ctx3, cardId).isRoll != !0);\n            const opponentUnitIds = GameStateFn2.getBattleGroup(ctx3, DefineFn2.AbsoluteBaSyouFn.of(opponentPlayerId, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A22\"));\n            if (opponentUnitIds.length) {\n              if (GameStateFn2.isBattleGroupHasA(ctx3, [\"\\u9AD8\\u6A5F\\u52D5\"], opponentUnitIds[0]))\n                unitIds = unitIds.filter((id) => GameStateFn2.isBattleGroupHasA(ctx3, [\"\\u9AD8\\u6A5F\\u52D5\"], id));\n            }\n            return {\n              title: [\"\\u30AB\\u30FC\\u30C9\", unitIds.map((id) => {\n                return [id, GameStateFn2.getItemBaSyou(ctx3, id)];\n              }), []],\n              flags: { isGoBattleArea2: !0 }\n            };\n          }",
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                const playerId2 = DefineFn2.EffectFn.getPlayerID(effect), fackCardId = DefineFn2.EffectFn.getCardID(effect), spacePairs = GameStateFn2.getCardTipStrBaSyouPairs(ctx3, \"\\u53BB\\u5B87\\u5B99\", fackCardId), phase2 = GameStateFn2.getPhase(ctx3);\n                for (let pair3 of spacePairs)\n                  ctx3 = GameStateFn2.mapItemState(ctx3, pair3[0], (is) => ({ ...is, isAttack: phase2[1] == \"\\u653B\\u6483\\u30B9\\u30C6\\u30C3\\u30D7\", isDefence: phase2[1] == \"\\u9632\\u5FA1\\u30B9\\u30C6\\u30C3\\u30D7\" })), ctx3 = GameStateFn2.doItemMove(ctx3, DefineFn2.AbsoluteBaSyouFn.of(playerId2, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A22\"), pair3);\n                return ctx3;\n              }"
                                }
                            ],
                            "groupKey": "出擊"
                        }
                    },
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                const fackCardId = DefineFn2.EffectFn.getCardID(effect), phase2 = GameStateFn2.getPhase(ctx3), pairs1 = GameStateFn2.getCardTipStrBaSyouPairs(ctx3, \"\\u53BB\\u5730\\u7403\", fackCardId), pairs2 = GameStateFn2.getCardTipStrBaSyouPairs(ctx3, \"\\u53BB\\u5B87\\u5B99\", fackCardId);\n                if (DefineFn2.PhaseFn.eq(phase2, [\"\\u6226\\u95D8\\u30D5\\u30A7\\u30A4\\u30BA\", \"\\u653B\\u6483\\u30B9\\u30C6\\u30C3\\u30D7\", \"\\u898F\\u5B9A\\u306E\\u52B9\\u679C\"]))\n                  ctx3 = GameStateFn2.doTriggerEvent(ctx3, {\n                    title: [\"\\u3053\\u306E\\u30AB\\u30FC\\u30C9\\u304C\\u653B\\u6483\\u306B\\u51FA\\u6483\\u3057\\u305F\\u5834\\u5408\"],\n                    cardIds: [...pairs1, ...pairs2].map((p) => p[0])\n                  });\n                return ctx3;\n              }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 2086,
            "description": "onItemMove:PlayerA_51 = [\"PlayerA\",\"配備エリア\"] => [\"PlayerA\",\"戦闘エリア1\"]",
            "effect": {
                "id": "createAttackPhaseRuleEffect_PlayerA",
                "reason": [
                    "GameRule",
                    "PlayerA",
                    {
                        "isAttack": true,
                        "isDefence": false
                    }
                ],
                "description": "出擊",
                "isOption": true,
                "text": {
                    "id": "createAttackPhaseRuleEffect_text_PlayerA",
                    "title": [],
                    "description": "出擊",
                    "conditions": {
                        "去地球": {
                            "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n            const runtimeBattleArea = GameStateFn2.getRuntimeBattleArea(ctx3, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A21\");\n            if (runtimeBattleArea == \"\\u5B87\\u5B99\\u30A8\\u30EA\\u30A2\")\n              return null;\n            const playerId2 = DefineFn2.EffectFn.getPlayerID(effect), opponentPlayerId = DefineFn2.PlayerIDFn.getOpponent(playerId2);\n            let unitIds = GameStateFn2.getItemIdsByBasyou(ctx3, DefineFn2.AbsoluteBaSyouFn.of(playerId2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\")).filter((cardId) => GameStateFn2.getSetGroupRoot(ctx3, cardId) == cardId).filter((cardId) => GameStateFn2.getCardBattleArea(ctx3, cardId).includes(runtimeBattleArea)).filter((cardId) => GameStateFn2.getCard(ctx3, cardId).isRoll != !0);\n            const opponentUnitIds = GameStateFn2.getBattleGroup(ctx3, DefineFn2.AbsoluteBaSyouFn.of(opponentPlayerId, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A21\"));\n            if (opponentUnitIds.length) {\n              if (GameStateFn2.isBattleGroupHasA(ctx3, [\"\\u9AD8\\u6A5F\\u52D5\"], opponentUnitIds[0]))\n                unitIds = unitIds.filter((id) => GameStateFn2.isBattleGroupHasA(ctx3, [\"\\u9AD8\\u6A5F\\u52D5\"], id));\n            }\n            return {\n              title: [\"\\u30AB\\u30FC\\u30C9\", unitIds.map((id) => {\n                return [id, GameStateFn2.getItemBaSyou(ctx3, id)];\n              }), []],\n              flags: { isGoBattleArea1: !0 }\n            };\n          }",
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                const playerId2 = DefineFn2.EffectFn.getPlayerID(effect), fackCardId = DefineFn2.EffectFn.getCardID(effect), earthPairs = GameStateFn2.getCardTipStrBaSyouPairs(ctx3, \"\\u53BB\\u5730\\u7403\", fackCardId), phase2 = GameStateFn2.getPhase(ctx3);\n                for (let pair3 of earthPairs)\n                  ctx3 = GameStateFn2.mapItemState(ctx3, pair3[0], (is) => ({ ...is, isAttack: phase2[1] == \"\\u653B\\u6483\\u30B9\\u30C6\\u30C3\\u30D7\", isDefence: phase2[1] == \"\\u9632\\u5FA1\\u30B9\\u30C6\\u30C3\\u30D7\" })), ctx3 = GameStateFn2.doItemMove(ctx3, DefineFn2.AbsoluteBaSyouFn.of(playerId2, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A21\"), pair3);\n                return ctx3;\n              }"
                                }
                            ],
                            "groupKey": "出擊"
                        },
                        "去宇宙": {
                            "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n            const runtimeBattleArea = GameStateFn2.getRuntimeBattleArea(ctx3, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A22\");\n            if (runtimeBattleArea == \"\\u5730\\u7403\\u30A8\\u30EA\\u30A2\")\n              return null;\n            const playerId2 = DefineFn2.EffectFn.getPlayerID(effect), opponentPlayerId = DefineFn2.PlayerIDFn.getOpponent(playerId2);\n            let unitIds = GameStateFn2.getItemIdsByBasyou(ctx3, DefineFn2.AbsoluteBaSyouFn.of(playerId2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\")).filter((cardId) => GameStateFn2.getSetGroupRoot(ctx3, cardId) == cardId).filter((cardId) => GameStateFn2.getCardBattleArea(ctx3, cardId).includes(runtimeBattleArea)).filter((cardId) => GameStateFn2.getCard(ctx3, cardId).isRoll != !0);\n            const opponentUnitIds = GameStateFn2.getBattleGroup(ctx3, DefineFn2.AbsoluteBaSyouFn.of(opponentPlayerId, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A22\"));\n            if (opponentUnitIds.length) {\n              if (GameStateFn2.isBattleGroupHasA(ctx3, [\"\\u9AD8\\u6A5F\\u52D5\"], opponentUnitIds[0]))\n                unitIds = unitIds.filter((id) => GameStateFn2.isBattleGroupHasA(ctx3, [\"\\u9AD8\\u6A5F\\u52D5\"], id));\n            }\n            return {\n              title: [\"\\u30AB\\u30FC\\u30C9\", unitIds.map((id) => {\n                return [id, GameStateFn2.getItemBaSyou(ctx3, id)];\n              }), []],\n              flags: { isGoBattleArea2: !0 }\n            };\n          }",
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                const playerId2 = DefineFn2.EffectFn.getPlayerID(effect), fackCardId = DefineFn2.EffectFn.getCardID(effect), spacePairs = GameStateFn2.getCardTipStrBaSyouPairs(ctx3, \"\\u53BB\\u5B87\\u5B99\", fackCardId), phase2 = GameStateFn2.getPhase(ctx3);\n                for (let pair3 of spacePairs)\n                  ctx3 = GameStateFn2.mapItemState(ctx3, pair3[0], (is) => ({ ...is, isAttack: phase2[1] == \"\\u653B\\u6483\\u30B9\\u30C6\\u30C3\\u30D7\", isDefence: phase2[1] == \"\\u9632\\u5FA1\\u30B9\\u30C6\\u30C3\\u30D7\" })), ctx3 = GameStateFn2.doItemMove(ctx3, DefineFn2.AbsoluteBaSyouFn.of(playerId2, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A22\"), pair3);\n                return ctx3;\n              }"
                                }
                            ],
                            "groupKey": "出擊"
                        }
                    },
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                const fackCardId = DefineFn2.EffectFn.getCardID(effect), phase2 = GameStateFn2.getPhase(ctx3), pairs1 = GameStateFn2.getCardTipStrBaSyouPairs(ctx3, \"\\u53BB\\u5730\\u7403\", fackCardId), pairs2 = GameStateFn2.getCardTipStrBaSyouPairs(ctx3, \"\\u53BB\\u5B87\\u5B99\", fackCardId);\n                if (DefineFn2.PhaseFn.eq(phase2, [\"\\u6226\\u95D8\\u30D5\\u30A7\\u30A4\\u30BA\", \"\\u653B\\u6483\\u30B9\\u30C6\\u30C3\\u30D7\", \"\\u898F\\u5B9A\\u306E\\u52B9\\u679C\"]))\n                  ctx3 = GameStateFn2.doTriggerEvent(ctx3, {\n                    title: [\"\\u3053\\u306E\\u30AB\\u30FC\\u30C9\\u304C\\u653B\\u6483\\u306B\\u51FA\\u6483\\u3057\\u305F\\u5834\\u5408\"],\n                    cardIds: [...pairs1, ...pairs2].map((p) => p[0])\n                  });\n                return ctx3;\n              }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 2085,
            "description": "onEvent: GameEventOnMove [\"PlayerA_51\"]",
            "effect": {
                "id": "createAttackPhaseRuleEffect_PlayerA",
                "reason": [
                    "GameRule",
                    "PlayerA",
                    {
                        "isAttack": true,
                        "isDefence": false
                    }
                ],
                "description": "出擊",
                "isOption": true,
                "text": {
                    "id": "createAttackPhaseRuleEffect_text_PlayerA",
                    "title": [],
                    "description": "出擊",
                    "conditions": {
                        "去地球": {
                            "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n            const runtimeBattleArea = GameStateFn2.getRuntimeBattleArea(ctx3, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A21\");\n            if (runtimeBattleArea == \"\\u5B87\\u5B99\\u30A8\\u30EA\\u30A2\")\n              return null;\n            const playerId2 = DefineFn2.EffectFn.getPlayerID(effect), opponentPlayerId = DefineFn2.PlayerIDFn.getOpponent(playerId2);\n            let unitIds = GameStateFn2.getItemIdsByBasyou(ctx3, DefineFn2.AbsoluteBaSyouFn.of(playerId2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\")).filter((cardId) => GameStateFn2.getSetGroupRoot(ctx3, cardId) == cardId).filter((cardId) => GameStateFn2.getCardBattleArea(ctx3, cardId).includes(runtimeBattleArea)).filter((cardId) => GameStateFn2.getCard(ctx3, cardId).isRoll != !0);\n            const opponentUnitIds = GameStateFn2.getBattleGroup(ctx3, DefineFn2.AbsoluteBaSyouFn.of(opponentPlayerId, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A21\"));\n            if (opponentUnitIds.length) {\n              if (GameStateFn2.isBattleGroupHasA(ctx3, [\"\\u9AD8\\u6A5F\\u52D5\"], opponentUnitIds[0]))\n                unitIds = unitIds.filter((id) => GameStateFn2.isBattleGroupHasA(ctx3, [\"\\u9AD8\\u6A5F\\u52D5\"], id));\n            }\n            return {\n              title: [\"\\u30AB\\u30FC\\u30C9\", unitIds.map((id) => {\n                return [id, GameStateFn2.getItemBaSyou(ctx3, id)];\n              }), []],\n              flags: { isGoBattleArea1: !0 }\n            };\n          }",
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                const playerId2 = DefineFn2.EffectFn.getPlayerID(effect), fackCardId = DefineFn2.EffectFn.getCardID(effect), earthPairs = GameStateFn2.getCardTipStrBaSyouPairs(ctx3, \"\\u53BB\\u5730\\u7403\", fackCardId), phase2 = GameStateFn2.getPhase(ctx3);\n                for (let pair3 of earthPairs)\n                  ctx3 = GameStateFn2.mapItemState(ctx3, pair3[0], (is) => ({ ...is, isAttack: phase2[1] == \"\\u653B\\u6483\\u30B9\\u30C6\\u30C3\\u30D7\", isDefence: phase2[1] == \"\\u9632\\u5FA1\\u30B9\\u30C6\\u30C3\\u30D7\" })), ctx3 = GameStateFn2.doItemMove(ctx3, DefineFn2.AbsoluteBaSyouFn.of(playerId2, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A21\"), pair3);\n                return ctx3;\n              }"
                                }
                            ],
                            "groupKey": "出擊"
                        },
                        "去宇宙": {
                            "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n            const runtimeBattleArea = GameStateFn2.getRuntimeBattleArea(ctx3, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A22\");\n            if (runtimeBattleArea == \"\\u5730\\u7403\\u30A8\\u30EA\\u30A2\")\n              return null;\n            const playerId2 = DefineFn2.EffectFn.getPlayerID(effect), opponentPlayerId = DefineFn2.PlayerIDFn.getOpponent(playerId2);\n            let unitIds = GameStateFn2.getItemIdsByBasyou(ctx3, DefineFn2.AbsoluteBaSyouFn.of(playerId2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\")).filter((cardId) => GameStateFn2.getSetGroupRoot(ctx3, cardId) == cardId).filter((cardId) => GameStateFn2.getCardBattleArea(ctx3, cardId).includes(runtimeBattleArea)).filter((cardId) => GameStateFn2.getCard(ctx3, cardId).isRoll != !0);\n            const opponentUnitIds = GameStateFn2.getBattleGroup(ctx3, DefineFn2.AbsoluteBaSyouFn.of(opponentPlayerId, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A22\"));\n            if (opponentUnitIds.length) {\n              if (GameStateFn2.isBattleGroupHasA(ctx3, [\"\\u9AD8\\u6A5F\\u52D5\"], opponentUnitIds[0]))\n                unitIds = unitIds.filter((id) => GameStateFn2.isBattleGroupHasA(ctx3, [\"\\u9AD8\\u6A5F\\u52D5\"], id));\n            }\n            return {\n              title: [\"\\u30AB\\u30FC\\u30C9\", unitIds.map((id) => {\n                return [id, GameStateFn2.getItemBaSyou(ctx3, id)];\n              }), []],\n              flags: { isGoBattleArea2: !0 }\n            };\n          }",
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                const playerId2 = DefineFn2.EffectFn.getPlayerID(effect), fackCardId = DefineFn2.EffectFn.getCardID(effect), spacePairs = GameStateFn2.getCardTipStrBaSyouPairs(ctx3, \"\\u53BB\\u5B87\\u5B99\", fackCardId), phase2 = GameStateFn2.getPhase(ctx3);\n                for (let pair3 of spacePairs)\n                  ctx3 = GameStateFn2.mapItemState(ctx3, pair3[0], (is) => ({ ...is, isAttack: phase2[1] == \"\\u653B\\u6483\\u30B9\\u30C6\\u30C3\\u30D7\", isDefence: phase2[1] == \"\\u9632\\u5FA1\\u30B9\\u30C6\\u30C3\\u30D7\" })), ctx3 = GameStateFn2.doItemMove(ctx3, DefineFn2.AbsoluteBaSyouFn.of(playerId2, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A22\"), pair3);\n                return ctx3;\n              }"
                                }
                            ],
                            "groupKey": "出擊"
                        }
                    },
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                const fackCardId = DefineFn2.EffectFn.getCardID(effect), phase2 = GameStateFn2.getPhase(ctx3), pairs1 = GameStateFn2.getCardTipStrBaSyouPairs(ctx3, \"\\u53BB\\u5730\\u7403\", fackCardId), pairs2 = GameStateFn2.getCardTipStrBaSyouPairs(ctx3, \"\\u53BB\\u5B87\\u5B99\", fackCardId);\n                if (DefineFn2.PhaseFn.eq(phase2, [\"\\u6226\\u95D8\\u30D5\\u30A7\\u30A4\\u30BA\", \"\\u653B\\u6483\\u30B9\\u30C6\\u30C3\\u30D7\", \"\\u898F\\u5B9A\\u306E\\u52B9\\u679C\"]))\n                  ctx3 = GameStateFn2.doTriggerEvent(ctx3, {\n                    title: [\"\\u3053\\u306E\\u30AB\\u30FC\\u30C9\\u304C\\u653B\\u6483\\u306B\\u51FA\\u6483\\u3057\\u305F\\u5834\\u5408\"],\n                    cardIds: [...pairs1, ...pairs2].map((p) => p[0])\n                  });\n                return ctx3;\n              }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 2084,
            "description": "onEffectStart: 出擊",
            "effect": {
                "id": "createAttackPhaseRuleEffect_PlayerA",
                "reason": [
                    "GameRule",
                    "PlayerA",
                    {
                        "isAttack": true,
                        "isDefence": false
                    }
                ],
                "description": "出擊",
                "isOption": true,
                "text": {
                    "id": "createAttackPhaseRuleEffect_text_PlayerA",
                    "title": [],
                    "description": "出擊",
                    "conditions": {
                        "去地球": {
                            "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n            const runtimeBattleArea = GameStateFn2.getRuntimeBattleArea(ctx3, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A21\");\n            if (runtimeBattleArea == \"\\u5B87\\u5B99\\u30A8\\u30EA\\u30A2\")\n              return null;\n            const playerId2 = DefineFn2.EffectFn.getPlayerID(effect), opponentPlayerId = DefineFn2.PlayerIDFn.getOpponent(playerId2);\n            let unitIds = GameStateFn2.getItemIdsByBasyou(ctx3, DefineFn2.AbsoluteBaSyouFn.of(playerId2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\")).filter((cardId) => GameStateFn2.getSetGroupRoot(ctx3, cardId) == cardId).filter((cardId) => GameStateFn2.getCardBattleArea(ctx3, cardId).includes(runtimeBattleArea)).filter((cardId) => GameStateFn2.getCard(ctx3, cardId).isRoll != !0);\n            const opponentUnitIds = GameStateFn2.getBattleGroup(ctx3, DefineFn2.AbsoluteBaSyouFn.of(opponentPlayerId, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A21\"));\n            if (opponentUnitIds.length) {\n              if (GameStateFn2.isBattleGroupHasA(ctx3, [\"\\u9AD8\\u6A5F\\u52D5\"], opponentUnitIds[0]))\n                unitIds = unitIds.filter((id) => GameStateFn2.isBattleGroupHasA(ctx3, [\"\\u9AD8\\u6A5F\\u52D5\"], id));\n            }\n            return {\n              title: [\"\\u30AB\\u30FC\\u30C9\", unitIds.map((id) => {\n                return [id, GameStateFn2.getItemBaSyou(ctx3, id)];\n              }), []],\n              flags: { isGoBattleArea1: !0 }\n            };\n          }",
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                const playerId2 = DefineFn2.EffectFn.getPlayerID(effect), fackCardId = DefineFn2.EffectFn.getCardID(effect), earthPairs = GameStateFn2.getCardTipStrBaSyouPairs(ctx3, \"\\u53BB\\u5730\\u7403\", fackCardId), phase2 = GameStateFn2.getPhase(ctx3);\n                for (let pair3 of earthPairs)\n                  ctx3 = GameStateFn2.mapItemState(ctx3, pair3[0], (is) => ({ ...is, isAttack: phase2[1] == \"\\u653B\\u6483\\u30B9\\u30C6\\u30C3\\u30D7\", isDefence: phase2[1] == \"\\u9632\\u5FA1\\u30B9\\u30C6\\u30C3\\u30D7\" })), ctx3 = GameStateFn2.doItemMove(ctx3, DefineFn2.AbsoluteBaSyouFn.of(playerId2, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A21\"), pair3);\n                return ctx3;\n              }"
                                }
                            ],
                            "groupKey": "出擊"
                        },
                        "去宇宙": {
                            "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n            const runtimeBattleArea = GameStateFn2.getRuntimeBattleArea(ctx3, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A22\");\n            if (runtimeBattleArea == \"\\u5730\\u7403\\u30A8\\u30EA\\u30A2\")\n              return null;\n            const playerId2 = DefineFn2.EffectFn.getPlayerID(effect), opponentPlayerId = DefineFn2.PlayerIDFn.getOpponent(playerId2);\n            let unitIds = GameStateFn2.getItemIdsByBasyou(ctx3, DefineFn2.AbsoluteBaSyouFn.of(playerId2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\")).filter((cardId) => GameStateFn2.getSetGroupRoot(ctx3, cardId) == cardId).filter((cardId) => GameStateFn2.getCardBattleArea(ctx3, cardId).includes(runtimeBattleArea)).filter((cardId) => GameStateFn2.getCard(ctx3, cardId).isRoll != !0);\n            const opponentUnitIds = GameStateFn2.getBattleGroup(ctx3, DefineFn2.AbsoluteBaSyouFn.of(opponentPlayerId, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A22\"));\n            if (opponentUnitIds.length) {\n              if (GameStateFn2.isBattleGroupHasA(ctx3, [\"\\u9AD8\\u6A5F\\u52D5\"], opponentUnitIds[0]))\n                unitIds = unitIds.filter((id) => GameStateFn2.isBattleGroupHasA(ctx3, [\"\\u9AD8\\u6A5F\\u52D5\"], id));\n            }\n            return {\n              title: [\"\\u30AB\\u30FC\\u30C9\", unitIds.map((id) => {\n                return [id, GameStateFn2.getItemBaSyou(ctx3, id)];\n              }), []],\n              flags: { isGoBattleArea2: !0 }\n            };\n          }",
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                const playerId2 = DefineFn2.EffectFn.getPlayerID(effect), fackCardId = DefineFn2.EffectFn.getCardID(effect), spacePairs = GameStateFn2.getCardTipStrBaSyouPairs(ctx3, \"\\u53BB\\u5B87\\u5B99\", fackCardId), phase2 = GameStateFn2.getPhase(ctx3);\n                for (let pair3 of spacePairs)\n                  ctx3 = GameStateFn2.mapItemState(ctx3, pair3[0], (is) => ({ ...is, isAttack: phase2[1] == \"\\u653B\\u6483\\u30B9\\u30C6\\u30C3\\u30D7\", isDefence: phase2[1] == \"\\u9632\\u5FA1\\u30B9\\u30C6\\u30C3\\u30D7\" })), ctx3 = GameStateFn2.doItemMove(ctx3, DefineFn2.AbsoluteBaSyouFn.of(playerId2, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A22\"), pair3);\n                return ctx3;\n              }"
                                }
                            ],
                            "groupKey": "出擊"
                        }
                    },
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                const fackCardId = DefineFn2.EffectFn.getCardID(effect), phase2 = GameStateFn2.getPhase(ctx3), pairs1 = GameStateFn2.getCardTipStrBaSyouPairs(ctx3, \"\\u53BB\\u5730\\u7403\", fackCardId), pairs2 = GameStateFn2.getCardTipStrBaSyouPairs(ctx3, \"\\u53BB\\u5B87\\u5B99\", fackCardId);\n                if (DefineFn2.PhaseFn.eq(phase2, [\"\\u6226\\u95D8\\u30D5\\u30A7\\u30A4\\u30BA\", \"\\u653B\\u6483\\u30B9\\u30C6\\u30C3\\u30D7\", \"\\u898F\\u5B9A\\u306E\\u52B9\\u679C\"]))\n                  ctx3 = GameStateFn2.doTriggerEvent(ctx3, {\n                    title: [\"\\u3053\\u306E\\u30AB\\u30FC\\u30C9\\u304C\\u653B\\u6483\\u306B\\u51FA\\u6483\\u3057\\u305F\\u5834\\u5408\"],\n                    cardIds: [...pairs1, ...pairs2].map((p) => p[0])\n                  });\n                return ctx3;\n              }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 2083,
            "description": "onSetPhase:戦闘フェイズ,攻撃ステップ,規定の効果"
        },
        {
            "id": 2082,
            "description": "onSetPhase:戦闘フェイズ,攻撃ステップ,フリータイミング"
        },
        {
            "id": 2081,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 2080,
            "description": "onSetPhase:戦闘フェイズ,攻撃ステップ,ステップ開始"
        },
        {
            "id": 2079,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 2078,
            "description": "onSetPhase:配備フェイズ,フェイズ終了"
        },
        {
            "id": 2077,
            "description": "onEvent: カット終了時 undefined"
        },
        {
            "id": 2076,
            "description": "onEffectEnd: 合計国力_＋１してプレイできる"
        },
        {
            "id": 2075,
            "description": "onEvent: プレイされて場に出た場合 [\"PlayerA_51\"]",
            "effect": {
                "id": "createUnitGoStageEffectFromPlayEffect_PlayerA_51",
                "reason": [
                    "場に出る",
                    "PlayerA",
                    "PlayerA_51"
                ],
                "description": "合計国力_＋１してプレイできる",
                "text": {
                    "id": "totalCostPlusPlayEffect_text_PlayerA_51",
                    "description": "合計国力_＋１してプレイできる",
                    "title": [],
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect2, { DefineFn, GameStateFn }) {\n                  const cardId2 = DefineFn.EffectFn.getCardID(effect2), from = GameStateFn.getItemBaSyou(ctx3, cardId2), to = DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\");\n                  ctx3 = GameStateFn.doItemMove(ctx3, to, [cardId2, from]);\n                  const hasHigh = GameStateFn.getCardHasSpeicalEffect(ctx3, [\"\\u6226\\u95D8\\u914D\\u5099\"], cardId2), hasPS = GameStateFn.getCardHasSpeicalEffect(ctx3, [\"\\u3010PS\\u88C5\\u7532\\u3011\"], cardId2), isRoll = (hasHigh || hasPS) == !1;\n                  return ctx3 = GameStateFn.doItemSetRollState(ctx3, isRoll, [cardId2, GameStateFn.getItemBaSyou(ctx3, cardId2)], { isSkipTargetMissing: !0 }), ctx3 = GameStateFn.doTriggerEvent(ctx3, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId2] }), ctx3;\n                }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 2074,
            "description": "onItemMove:PlayerA_51 = [\"PlayerA\",\"プレイされているカード\"] => [\"PlayerA\",\"配備エリア\"]",
            "effect": {
                "id": "createUnitGoStageEffectFromPlayEffect_PlayerA_51",
                "reason": [
                    "場に出る",
                    "PlayerA",
                    "PlayerA_51"
                ],
                "description": "合計国力_＋１してプレイできる",
                "text": {
                    "id": "totalCostPlusPlayEffect_text_PlayerA_51",
                    "description": "合計国力_＋１してプレイできる",
                    "title": [],
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect2, { DefineFn, GameStateFn }) {\n                  const cardId2 = DefineFn.EffectFn.getCardID(effect2), from = GameStateFn.getItemBaSyou(ctx3, cardId2), to = DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\");\n                  ctx3 = GameStateFn.doItemMove(ctx3, to, [cardId2, from]);\n                  const hasHigh = GameStateFn.getCardHasSpeicalEffect(ctx3, [\"\\u6226\\u95D8\\u914D\\u5099\"], cardId2), hasPS = GameStateFn.getCardHasSpeicalEffect(ctx3, [\"\\u3010PS\\u88C5\\u7532\\u3011\"], cardId2), isRoll = (hasHigh || hasPS) == !1;\n                  return ctx3 = GameStateFn.doItemSetRollState(ctx3, isRoll, [cardId2, GameStateFn.getItemBaSyou(ctx3, cardId2)], { isSkipTargetMissing: !0 }), ctx3 = GameStateFn.doTriggerEvent(ctx3, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId2] }), ctx3;\n                }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 2073,
            "description": "onEvent: GameEventOnMove [\"PlayerA_51\"]",
            "effect": {
                "id": "createUnitGoStageEffectFromPlayEffect_PlayerA_51",
                "reason": [
                    "場に出る",
                    "PlayerA",
                    "PlayerA_51"
                ],
                "description": "合計国力_＋１してプレイできる",
                "text": {
                    "id": "totalCostPlusPlayEffect_text_PlayerA_51",
                    "description": "合計国力_＋１してプレイできる",
                    "title": [],
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect2, { DefineFn, GameStateFn }) {\n                  const cardId2 = DefineFn.EffectFn.getCardID(effect2), from = GameStateFn.getItemBaSyou(ctx3, cardId2), to = DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\");\n                  ctx3 = GameStateFn.doItemMove(ctx3, to, [cardId2, from]);\n                  const hasHigh = GameStateFn.getCardHasSpeicalEffect(ctx3, [\"\\u6226\\u95D8\\u914D\\u5099\"], cardId2), hasPS = GameStateFn.getCardHasSpeicalEffect(ctx3, [\"\\u3010PS\\u88C5\\u7532\\u3011\"], cardId2), isRoll = (hasHigh || hasPS) == !1;\n                  return ctx3 = GameStateFn.doItemSetRollState(ctx3, isRoll, [cardId2, GameStateFn.getItemBaSyou(ctx3, cardId2)], { isSkipTargetMissing: !0 }), ctx3 = GameStateFn.doTriggerEvent(ctx3, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId2] }), ctx3;\n                }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 2072,
            "description": "onEvent: このカードが場に出た場合 [\"PlayerA_51\"]",
            "effect": {
                "id": "createUnitGoStageEffectFromPlayEffect_PlayerA_51",
                "reason": [
                    "場に出る",
                    "PlayerA",
                    "PlayerA_51"
                ],
                "description": "合計国力_＋１してプレイできる",
                "text": {
                    "id": "totalCostPlusPlayEffect_text_PlayerA_51",
                    "description": "合計国力_＋１してプレイできる",
                    "title": [],
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect2, { DefineFn, GameStateFn }) {\n                  const cardId2 = DefineFn.EffectFn.getCardID(effect2), from = GameStateFn.getItemBaSyou(ctx3, cardId2), to = DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\");\n                  ctx3 = GameStateFn.doItemMove(ctx3, to, [cardId2, from]);\n                  const hasHigh = GameStateFn.getCardHasSpeicalEffect(ctx3, [\"\\u6226\\u95D8\\u914D\\u5099\"], cardId2), hasPS = GameStateFn.getCardHasSpeicalEffect(ctx3, [\"\\u3010PS\\u88C5\\u7532\\u3011\"], cardId2), isRoll = (hasHigh || hasPS) == !1;\n                  return ctx3 = GameStateFn.doItemSetRollState(ctx3, isRoll, [cardId2, GameStateFn.getItemBaSyou(ctx3, cardId2)], { isSkipTargetMissing: !0 }), ctx3 = GameStateFn.doTriggerEvent(ctx3, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId2] }), ctx3;\n                }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 2071,
            "description": "onEffectStart: 合計国力_＋１してプレイできる",
            "effect": {
                "id": "createUnitGoStageEffectFromPlayEffect_PlayerA_51",
                "reason": [
                    "場に出る",
                    "PlayerA",
                    "PlayerA_51"
                ],
                "description": "合計国力_＋１してプレイできる",
                "text": {
                    "id": "totalCostPlusPlayEffect_text_PlayerA_51",
                    "description": "合計国力_＋１してプレイできる",
                    "title": [],
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect2, { DefineFn, GameStateFn }) {\n                  const cardId2 = DefineFn.EffectFn.getCardID(effect2), from = GameStateFn.getItemBaSyou(ctx3, cardId2), to = DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\");\n                  ctx3 = GameStateFn.doItemMove(ctx3, to, [cardId2, from]);\n                  const hasHigh = GameStateFn.getCardHasSpeicalEffect(ctx3, [\"\\u6226\\u95D8\\u914D\\u5099\"], cardId2), hasPS = GameStateFn.getCardHasSpeicalEffect(ctx3, [\"\\u3010PS\\u88C5\\u7532\\u3011\"], cardId2), isRoll = (hasHigh || hasPS) == !1;\n                  return ctx3 = GameStateFn.doItemSetRollState(ctx3, isRoll, [cardId2, GameStateFn.getItemBaSyou(ctx3, cardId2)], { isSkipTargetMissing: !0 }), ctx3 = GameStateFn.doTriggerEvent(ctx3, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId2] }), ctx3;\n                }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 2070,
            "description": "onEffectEnd: 合計国力_＋１してプレイできる"
        },
        {
            "id": 2069,
            "description": "onItemMove:PlayerA_51 = [\"PlayerA\",\"ハンガー\"] => [\"PlayerA\",\"プレイされているカード\"]",
            "effect": {
                "id": "totalCostPlusPlayEffect_PlayerA_51",
                "reason": [
                    "PlayCard",
                    "PlayerA",
                    "PlayerA_51",
                    {
                        "isPlayUnit": true
                    }
                ],
                "description": "合計国力_＋１してプレイできる",
                "text": {
                    "id": "totalCostPlusPlayEffect_text_PlayerA_51",
                    "title": [
                        "使用型",
                        [
                            "自軍",
                            "配備フェイズ"
                        ]
                    ],
                    "description": "合計国力_＋１してプレイできる",
                    "conditions": {
                        "合計国力〔x〕": {
                            "actions": [
                                {
                                    "title": [
                                        "合計国力〔x〕",
                                        5
                                    ]
                                }
                            ]
                        },
                        "橫置支付0[白]": {
                            "title": [
                                "RollColor",
                                "白"
                            ],
                            "actions": [
                                {
                                    "title": [
                                        "_ロールする",
                                        "ロール"
                                    ],
                                    "vars": [
                                        "橫置支付0[白]"
                                    ]
                                }
                            ],
                            "groupKey": "支付橫置國力"
                        },
                        "橫置支付1[白]": {
                            "title": [
                                "RollColor",
                                "白"
                            ],
                            "actions": [
                                {
                                    "title": [
                                        "_ロールする",
                                        "ロール"
                                    ],
                                    "vars": [
                                        "橫置支付1[白]"
                                    ]
                                }
                            ],
                            "groupKey": "支付橫置國力"
                        }
                    },
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect, { DefineFn, GameStateFn, ToolFn: ToolFn2 }) {\n              const cardId2 = DefineFn.EffectFn.getCardID(effect), from = GameStateFn.getItemBaSyou(ctx3, cardId2);\n              ctx3 = GameStateFn.doItemMove(ctx3, DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u3044\\u308B\\u30AB\\u30FC\\u30C9\"), [cardId2, from]);\n              const newE = GameStateFn.createUnitGoStageEffectFromPlayEffect(ctx3, effect);\n              return GameStateFn.addStackEffect(ctx3, newE);\n            }"
                                },
                                {
                                    "title": "function _(ctx3, effect, { GameStateFn, DefineFn }) {\n          const { addedLength: addedLength2 } = {addedLength: 1}, cardId2 = DefineFn.EffectFn.getCardID(effect);\n          let cs = GameStateFn.getItemState(ctx3, cardId2);\n          return cs = DefineFn.ItemStateFn.setMoreTotalRollCostLengthPlay(cs, addedLength2), ctx3 = GameStateFn.setItemState(ctx3, cardId2, cs), ctx3;\n        }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 2068,
            "description": "onEvent: GameEventOnMove [\"PlayerA_51\"]",
            "effect": {
                "id": "totalCostPlusPlayEffect_PlayerA_51",
                "reason": [
                    "PlayCard",
                    "PlayerA",
                    "PlayerA_51",
                    {
                        "isPlayUnit": true
                    }
                ],
                "description": "合計国力_＋１してプレイできる",
                "text": {
                    "id": "totalCostPlusPlayEffect_text_PlayerA_51",
                    "title": [
                        "使用型",
                        [
                            "自軍",
                            "配備フェイズ"
                        ]
                    ],
                    "description": "合計国力_＋１してプレイできる",
                    "conditions": {
                        "合計国力〔x〕": {
                            "actions": [
                                {
                                    "title": [
                                        "合計国力〔x〕",
                                        5
                                    ]
                                }
                            ]
                        },
                        "橫置支付0[白]": {
                            "title": [
                                "RollColor",
                                "白"
                            ],
                            "actions": [
                                {
                                    "title": [
                                        "_ロールする",
                                        "ロール"
                                    ],
                                    "vars": [
                                        "橫置支付0[白]"
                                    ]
                                }
                            ],
                            "groupKey": "支付橫置國力"
                        },
                        "橫置支付1[白]": {
                            "title": [
                                "RollColor",
                                "白"
                            ],
                            "actions": [
                                {
                                    "title": [
                                        "_ロールする",
                                        "ロール"
                                    ],
                                    "vars": [
                                        "橫置支付1[白]"
                                    ]
                                }
                            ],
                            "groupKey": "支付橫置國力"
                        }
                    },
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect, { DefineFn, GameStateFn, ToolFn: ToolFn2 }) {\n              const cardId2 = DefineFn.EffectFn.getCardID(effect), from = GameStateFn.getItemBaSyou(ctx3, cardId2);\n              ctx3 = GameStateFn.doItemMove(ctx3, DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u3044\\u308B\\u30AB\\u30FC\\u30C9\"), [cardId2, from]);\n              const newE = GameStateFn.createUnitGoStageEffectFromPlayEffect(ctx3, effect);\n              return GameStateFn.addStackEffect(ctx3, newE);\n            }"
                                },
                                {
                                    "title": "function _(ctx3, effect, { GameStateFn, DefineFn }) {\n          const { addedLength: addedLength2 } = {addedLength: 1}, cardId2 = DefineFn.EffectFn.getCardID(effect);\n          let cs = GameStateFn.getItemState(ctx3, cardId2);\n          return cs = DefineFn.ItemStateFn.setMoreTotalRollCostLengthPlay(cs, addedLength2), ctx3 = GameStateFn.setItemState(ctx3, cardId2, cs), ctx3;\n        }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 2067,
            "description": "PlayerA_13.isRoll false => true",
            "effect": {
                "id": "totalCostPlusPlayEffect_PlayerA_51",
                "reason": [
                    "PlayCard",
                    "PlayerA",
                    "PlayerA_51",
                    {
                        "isPlayUnit": true
                    }
                ],
                "description": "合計国力_＋１してプレイできる",
                "text": {
                    "id": "totalCostPlusPlayEffect_text_PlayerA_51",
                    "title": [
                        "使用型",
                        [
                            "自軍",
                            "配備フェイズ"
                        ]
                    ],
                    "description": "合計国力_＋１してプレイできる",
                    "conditions": {
                        "合計国力〔x〕": {
                            "actions": [
                                {
                                    "title": [
                                        "合計国力〔x〕",
                                        5
                                    ]
                                }
                            ]
                        },
                        "橫置支付0[白]": {
                            "title": [
                                "RollColor",
                                "白"
                            ],
                            "actions": [
                                {
                                    "title": [
                                        "_ロールする",
                                        "ロール"
                                    ],
                                    "vars": [
                                        "橫置支付0[白]"
                                    ]
                                }
                            ],
                            "groupKey": "支付橫置國力"
                        },
                        "橫置支付1[白]": {
                            "title": [
                                "RollColor",
                                "白"
                            ],
                            "actions": [
                                {
                                    "title": [
                                        "_ロールする",
                                        "ロール"
                                    ],
                                    "vars": [
                                        "橫置支付1[白]"
                                    ]
                                }
                            ],
                            "groupKey": "支付橫置國力"
                        }
                    },
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect, { DefineFn, GameStateFn, ToolFn: ToolFn2 }) {\n              const cardId2 = DefineFn.EffectFn.getCardID(effect), from = GameStateFn.getItemBaSyou(ctx3, cardId2);\n              ctx3 = GameStateFn.doItemMove(ctx3, DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u3044\\u308B\\u30AB\\u30FC\\u30C9\"), [cardId2, from]);\n              const newE = GameStateFn.createUnitGoStageEffectFromPlayEffect(ctx3, effect);\n              return GameStateFn.addStackEffect(ctx3, newE);\n            }"
                                },
                                {
                                    "title": "function _(ctx3, effect, { GameStateFn, DefineFn }) {\n          const { addedLength: addedLength2 } = {addedLength: 1}, cardId2 = DefineFn.EffectFn.getCardID(effect);\n          let cs = GameStateFn.getItemState(ctx3, cardId2);\n          return cs = DefineFn.ItemStateFn.setMoreTotalRollCostLengthPlay(cs, addedLength2), ctx3 = GameStateFn.setItemState(ctx3, cardId2, cs), ctx3;\n        }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 2066,
            "description": "PlayerA_54.isRoll false => true",
            "effect": {
                "id": "totalCostPlusPlayEffect_PlayerA_51",
                "reason": [
                    "PlayCard",
                    "PlayerA",
                    "PlayerA_51",
                    {
                        "isPlayUnit": true
                    }
                ],
                "description": "合計国力_＋１してプレイできる",
                "text": {
                    "id": "totalCostPlusPlayEffect_text_PlayerA_51",
                    "title": [
                        "使用型",
                        [
                            "自軍",
                            "配備フェイズ"
                        ]
                    ],
                    "description": "合計国力_＋１してプレイできる",
                    "conditions": {
                        "合計国力〔x〕": {
                            "actions": [
                                {
                                    "title": [
                                        "合計国力〔x〕",
                                        5
                                    ]
                                }
                            ]
                        },
                        "橫置支付0[白]": {
                            "title": [
                                "RollColor",
                                "白"
                            ],
                            "actions": [
                                {
                                    "title": [
                                        "_ロールする",
                                        "ロール"
                                    ],
                                    "vars": [
                                        "橫置支付0[白]"
                                    ]
                                }
                            ],
                            "groupKey": "支付橫置國力"
                        },
                        "橫置支付1[白]": {
                            "title": [
                                "RollColor",
                                "白"
                            ],
                            "actions": [
                                {
                                    "title": [
                                        "_ロールする",
                                        "ロール"
                                    ],
                                    "vars": [
                                        "橫置支付1[白]"
                                    ]
                                }
                            ],
                            "groupKey": "支付橫置國力"
                        }
                    },
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect, { DefineFn, GameStateFn, ToolFn: ToolFn2 }) {\n              const cardId2 = DefineFn.EffectFn.getCardID(effect), from = GameStateFn.getItemBaSyou(ctx3, cardId2);\n              ctx3 = GameStateFn.doItemMove(ctx3, DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u3044\\u308B\\u30AB\\u30FC\\u30C9\"), [cardId2, from]);\n              const newE = GameStateFn.createUnitGoStageEffectFromPlayEffect(ctx3, effect);\n              return GameStateFn.addStackEffect(ctx3, newE);\n            }"
                                },
                                {
                                    "title": "function _(ctx3, effect, { GameStateFn, DefineFn }) {\n          const { addedLength: addedLength2 } = {addedLength: 1}, cardId2 = DefineFn.EffectFn.getCardID(effect);\n          let cs = GameStateFn.getItemState(ctx3, cardId2);\n          return cs = DefineFn.ItemStateFn.setMoreTotalRollCostLengthPlay(cs, addedLength2), ctx3 = GameStateFn.setItemState(ctx3, cardId2, cs), ctx3;\n        }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 2065,
            "description": "onEffectStart: 合計国力_＋１してプレイできる",
            "effect": {
                "id": "totalCostPlusPlayEffect_PlayerA_51",
                "reason": [
                    "PlayCard",
                    "PlayerA",
                    "PlayerA_51",
                    {
                        "isPlayUnit": true
                    }
                ],
                "description": "合計国力_＋１してプレイできる",
                "text": {
                    "id": "totalCostPlusPlayEffect_text_PlayerA_51",
                    "title": [
                        "使用型",
                        [
                            "自軍",
                            "配備フェイズ"
                        ]
                    ],
                    "description": "合計国力_＋１してプレイできる",
                    "conditions": {
                        "合計国力〔x〕": {
                            "actions": [
                                {
                                    "title": [
                                        "合計国力〔x〕",
                                        5
                                    ]
                                }
                            ]
                        },
                        "橫置支付0[白]": {
                            "title": [
                                "RollColor",
                                "白"
                            ],
                            "actions": [
                                {
                                    "title": [
                                        "_ロールする",
                                        "ロール"
                                    ],
                                    "vars": [
                                        "橫置支付0[白]"
                                    ]
                                }
                            ],
                            "groupKey": "支付橫置國力"
                        },
                        "橫置支付1[白]": {
                            "title": [
                                "RollColor",
                                "白"
                            ],
                            "actions": [
                                {
                                    "title": [
                                        "_ロールする",
                                        "ロール"
                                    ],
                                    "vars": [
                                        "橫置支付1[白]"
                                    ]
                                }
                            ],
                            "groupKey": "支付橫置國力"
                        }
                    },
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect, { DefineFn, GameStateFn, ToolFn: ToolFn2 }) {\n              const cardId2 = DefineFn.EffectFn.getCardID(effect), from = GameStateFn.getItemBaSyou(ctx3, cardId2);\n              ctx3 = GameStateFn.doItemMove(ctx3, DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u3044\\u308B\\u30AB\\u30FC\\u30C9\"), [cardId2, from]);\n              const newE = GameStateFn.createUnitGoStageEffectFromPlayEffect(ctx3, effect);\n              return GameStateFn.addStackEffect(ctx3, newE);\n            }"
                                },
                                {
                                    "title": "function _(ctx3, effect, { GameStateFn, DefineFn }) {\n          const { addedLength: addedLength2 } = {addedLength: 1}, cardId2 = DefineFn.EffectFn.getCardID(effect);\n          let cs = GameStateFn.getItemState(ctx3, cardId2);\n          return cs = DefineFn.ItemStateFn.setMoreTotalRollCostLengthPlay(cs, addedLength2), ctx3 = GameStateFn.setItemState(ctx3, cardId2, cs), ctx3;\n        }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 2064,
            "description": "onEvent: カット終了時 undefined"
        },
        {
            "id": 2063,
            "description": "onEffectEnd: 『起動』：このカードが場に出た場合、自軍本国の上のカード４枚までを見て、その中にある、このカードと同じ属性のGサインを持つユニット１枚を自軍ハンガーに移す事ができる。"
        },
        {
            "id": 2062,
            "description": "onItemMove:PlayerA_51 = [\"PlayerA\",\"本国\"] => [\"PlayerA\",\"ハンガー\"]",
            "effect": {
                "id": "addImmediateEffect_01928b05-b3d5-7229-acb5-b9eef3417995",
                "reason": [
                    "PlayText",
                    "PlayerA",
                    "PlayerA_33",
                    "loadPrototype_179019_02A_U_WT031C_white_text_0"
                ],
                "isOption": true,
                "text": {
                    "id": "loadPrototype_179019_02A_U_WT031C_white_text_0",
                    "title": [
                        "自動型",
                        "起動"
                    ],
                    "description": "『起動』：このカードが場に出た場合、自軍本国の上のカード４枚までを見て、その中にある、このカードと同じ属性のGサインを持つユニット１枚を自軍ハンガーに移す事ができる。",
                    "conditions": {
                        "自軍本国の上のカード４枚までを見て、その中にある、このカードと同じ属性のGサインを持つユニット１枚": {
                            "title": [
                                "Entity",
                                {
                                    "see": [
                                        {
                                            "id": "RelatedBaSyou",
                                            "value": [
                                                "自軍",
                                                "本国"
                                            ]
                                        },
                                        1,
                                        4
                                    ],
                                    "hasGSignProperty": [
                                        "W"
                                    ],
                                    "side": "自軍",
                                    "is": [
                                        "ユニット"
                                    ],
                                    "count": 1
                                }
                            ]
                        },
                        "同回合上限": {
                            "actions": [
                                {
                                    "title": [
                                        "同回合上限",
                                        1
                                    ]
                                }
                            ]
                        }
                    },
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": [
                                        "_の_ハンガーに移す",
                                        "自軍",
                                        "ハンガー"
                                    ],
                                    "vars": [
                                        "自軍本国の上のカード４枚までを見て、その中にある、このカードと同じ属性のGサインを持つユニット１枚"
                                    ]
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 2061,
            "description": "onEvent: GameEventOnMove [\"PlayerA_51\"]",
            "effect": {
                "id": "addImmediateEffect_01928b05-b3d5-7229-acb5-b9eef3417995",
                "reason": [
                    "PlayText",
                    "PlayerA",
                    "PlayerA_33",
                    "loadPrototype_179019_02A_U_WT031C_white_text_0"
                ],
                "isOption": true,
                "text": {
                    "id": "loadPrototype_179019_02A_U_WT031C_white_text_0",
                    "title": [
                        "自動型",
                        "起動"
                    ],
                    "description": "『起動』：このカードが場に出た場合、自軍本国の上のカード４枚までを見て、その中にある、このカードと同じ属性のGサインを持つユニット１枚を自軍ハンガーに移す事ができる。",
                    "conditions": {
                        "自軍本国の上のカード４枚までを見て、その中にある、このカードと同じ属性のGサインを持つユニット１枚": {
                            "title": [
                                "Entity",
                                {
                                    "see": [
                                        {
                                            "id": "RelatedBaSyou",
                                            "value": [
                                                "自軍",
                                                "本国"
                                            ]
                                        },
                                        1,
                                        4
                                    ],
                                    "hasGSignProperty": [
                                        "W"
                                    ],
                                    "side": "自軍",
                                    "is": [
                                        "ユニット"
                                    ],
                                    "count": 1
                                }
                            ]
                        },
                        "同回合上限": {
                            "actions": [
                                {
                                    "title": [
                                        "同回合上限",
                                        1
                                    ]
                                }
                            ]
                        }
                    },
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": [
                                        "_の_ハンガーに移す",
                                        "自軍",
                                        "ハンガー"
                                    ],
                                    "vars": [
                                        "自軍本国の上のカード４枚までを見て、その中にある、このカードと同じ属性のGサインを持つユニット１枚"
                                    ]
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 2060,
            "description": "PlayerA_51.isRoll undefined => false",
            "effect": {
                "id": "addImmediateEffect_01928b05-b3d5-7229-acb5-b9eef3417995",
                "reason": [
                    "PlayText",
                    "PlayerA",
                    "PlayerA_33",
                    "loadPrototype_179019_02A_U_WT031C_white_text_0"
                ],
                "isOption": true,
                "text": {
                    "id": "loadPrototype_179019_02A_U_WT031C_white_text_0",
                    "title": [
                        "自動型",
                        "起動"
                    ],
                    "description": "『起動』：このカードが場に出た場合、自軍本国の上のカード４枚までを見て、その中にある、このカードと同じ属性のGサインを持つユニット１枚を自軍ハンガーに移す事ができる。",
                    "conditions": {
                        "自軍本国の上のカード４枚までを見て、その中にある、このカードと同じ属性のGサインを持つユニット１枚": {
                            "title": [
                                "Entity",
                                {
                                    "see": [
                                        {
                                            "id": "RelatedBaSyou",
                                            "value": [
                                                "自軍",
                                                "本国"
                                            ]
                                        },
                                        1,
                                        4
                                    ],
                                    "hasGSignProperty": [
                                        "W"
                                    ],
                                    "side": "自軍",
                                    "is": [
                                        "ユニット"
                                    ],
                                    "count": 1
                                }
                            ]
                        },
                        "同回合上限": {
                            "actions": [
                                {
                                    "title": [
                                        "同回合上限",
                                        1
                                    ]
                                }
                            ]
                        }
                    },
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": [
                                        "_の_ハンガーに移す",
                                        "自軍",
                                        "ハンガー"
                                    ],
                                    "vars": [
                                        "自軍本国の上のカード４枚までを見て、その中にある、このカードと同じ属性のGサインを持つユニット１枚"
                                    ]
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 2059,
            "description": "onEffectStart: 『起動』：このカードが場に出た場合、自軍本国の上のカード４枚までを見て、その中にある、このカードと同じ属性のGサインを持つユニット１枚を自軍ハンガーに移す事ができる。",
            "effect": {
                "id": "addImmediateEffect_01928b05-b3d5-7229-acb5-b9eef3417995",
                "reason": [
                    "PlayText",
                    "PlayerA",
                    "PlayerA_33",
                    "loadPrototype_179019_02A_U_WT031C_white_text_0"
                ],
                "isOption": true,
                "text": {
                    "id": "loadPrototype_179019_02A_U_WT031C_white_text_0",
                    "title": [
                        "自動型",
                        "起動"
                    ],
                    "description": "『起動』：このカードが場に出た場合、自軍本国の上のカード４枚までを見て、その中にある、このカードと同じ属性のGサインを持つユニット１枚を自軍ハンガーに移す事ができる。",
                    "conditions": {
                        "自軍本国の上のカード４枚までを見て、その中にある、このカードと同じ属性のGサインを持つユニット１枚": {
                            "title": [
                                "Entity",
                                {
                                    "see": [
                                        {
                                            "id": "RelatedBaSyou",
                                            "value": [
                                                "自軍",
                                                "本国"
                                            ]
                                        },
                                        1,
                                        4
                                    ],
                                    "hasGSignProperty": [
                                        "W"
                                    ],
                                    "side": "自軍",
                                    "is": [
                                        "ユニット"
                                    ],
                                    "count": 1
                                }
                            ]
                        },
                        "同回合上限": {
                            "actions": [
                                {
                                    "title": [
                                        "同回合上限",
                                        1
                                    ]
                                }
                            ]
                        }
                    },
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": [
                                        "_の_ハンガーに移す",
                                        "自軍",
                                        "ハンガー"
                                    ],
                                    "vars": [
                                        "自軍本国の上のカード４枚までを見て、その中にある、このカードと同じ属性のGサインを持つユニット１枚"
                                    ]
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 2058,
            "description": "onEffectEnd: Play マグアナック"
        },
        {
            "id": 2057,
            "description": "onEvent: プレイされて場に出た場合 [\"PlayerA_33\"]",
            "effect": {
                "id": "createUnitGoStageEffectFromPlayEffect_PlayerA_33",
                "reason": [
                    "場に出る",
                    "PlayerA",
                    "PlayerA_33"
                ],
                "description": "Play マグアナック",
                "text": {
                    "id": "createPlayUnitEffect_PlayerA_33",
                    "description": "Play マグアナック",
                    "title": [],
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect2, { DefineFn, GameStateFn }) {\n                  const cardId2 = DefineFn.EffectFn.getCardID(effect2), from = GameStateFn.getItemBaSyou(ctx3, cardId2), to = DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\");\n                  ctx3 = GameStateFn.doItemMove(ctx3, to, [cardId2, from]);\n                  const hasHigh = GameStateFn.getCardHasSpeicalEffect(ctx3, [\"\\u6226\\u95D8\\u914D\\u5099\"], cardId2), hasPS = GameStateFn.getCardHasSpeicalEffect(ctx3, [\"\\u3010PS\\u88C5\\u7532\\u3011\"], cardId2), isRoll = (hasHigh || hasPS) == !1;\n                  return ctx3 = GameStateFn.doItemSetRollState(ctx3, isRoll, [cardId2, GameStateFn.getItemBaSyou(ctx3, cardId2)], { isSkipTargetMissing: !0 }), ctx3 = GameStateFn.doTriggerEvent(ctx3, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId2] }), ctx3;\n                }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 2056,
            "description": "PlayerA_33.isRoll false => true",
            "effect": {
                "id": "createUnitGoStageEffectFromPlayEffect_PlayerA_33",
                "reason": [
                    "場に出る",
                    "PlayerA",
                    "PlayerA_33"
                ],
                "description": "Play マグアナック",
                "text": {
                    "id": "createPlayUnitEffect_PlayerA_33",
                    "description": "Play マグアナック",
                    "title": [],
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect2, { DefineFn, GameStateFn }) {\n                  const cardId2 = DefineFn.EffectFn.getCardID(effect2), from = GameStateFn.getItemBaSyou(ctx3, cardId2), to = DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\");\n                  ctx3 = GameStateFn.doItemMove(ctx3, to, [cardId2, from]);\n                  const hasHigh = GameStateFn.getCardHasSpeicalEffect(ctx3, [\"\\u6226\\u95D8\\u914D\\u5099\"], cardId2), hasPS = GameStateFn.getCardHasSpeicalEffect(ctx3, [\"\\u3010PS\\u88C5\\u7532\\u3011\"], cardId2), isRoll = (hasHigh || hasPS) == !1;\n                  return ctx3 = GameStateFn.doItemSetRollState(ctx3, isRoll, [cardId2, GameStateFn.getItemBaSyou(ctx3, cardId2)], { isSkipTargetMissing: !0 }), ctx3 = GameStateFn.doTriggerEvent(ctx3, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId2] }), ctx3;\n                }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 2055,
            "description": "onItemMove:PlayerA_33 = [\"PlayerA\",\"プレイされているカード\"] => [\"PlayerA\",\"配備エリア\"]",
            "effect": {
                "id": "createUnitGoStageEffectFromPlayEffect_PlayerA_33",
                "reason": [
                    "場に出る",
                    "PlayerA",
                    "PlayerA_33"
                ],
                "description": "Play マグアナック",
                "text": {
                    "id": "createPlayUnitEffect_PlayerA_33",
                    "description": "Play マグアナック",
                    "title": [],
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect2, { DefineFn, GameStateFn }) {\n                  const cardId2 = DefineFn.EffectFn.getCardID(effect2), from = GameStateFn.getItemBaSyou(ctx3, cardId2), to = DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\");\n                  ctx3 = GameStateFn.doItemMove(ctx3, to, [cardId2, from]);\n                  const hasHigh = GameStateFn.getCardHasSpeicalEffect(ctx3, [\"\\u6226\\u95D8\\u914D\\u5099\"], cardId2), hasPS = GameStateFn.getCardHasSpeicalEffect(ctx3, [\"\\u3010PS\\u88C5\\u7532\\u3011\"], cardId2), isRoll = (hasHigh || hasPS) == !1;\n                  return ctx3 = GameStateFn.doItemSetRollState(ctx3, isRoll, [cardId2, GameStateFn.getItemBaSyou(ctx3, cardId2)], { isSkipTargetMissing: !0 }), ctx3 = GameStateFn.doTriggerEvent(ctx3, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId2] }), ctx3;\n                }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 2054,
            "description": "onEvent: GameEventOnMove [\"PlayerA_33\"]",
            "effect": {
                "id": "createUnitGoStageEffectFromPlayEffect_PlayerA_33",
                "reason": [
                    "場に出る",
                    "PlayerA",
                    "PlayerA_33"
                ],
                "description": "Play マグアナック",
                "text": {
                    "id": "createPlayUnitEffect_PlayerA_33",
                    "description": "Play マグアナック",
                    "title": [],
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect2, { DefineFn, GameStateFn }) {\n                  const cardId2 = DefineFn.EffectFn.getCardID(effect2), from = GameStateFn.getItemBaSyou(ctx3, cardId2), to = DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\");\n                  ctx3 = GameStateFn.doItemMove(ctx3, to, [cardId2, from]);\n                  const hasHigh = GameStateFn.getCardHasSpeicalEffect(ctx3, [\"\\u6226\\u95D8\\u914D\\u5099\"], cardId2), hasPS = GameStateFn.getCardHasSpeicalEffect(ctx3, [\"\\u3010PS\\u88C5\\u7532\\u3011\"], cardId2), isRoll = (hasHigh || hasPS) == !1;\n                  return ctx3 = GameStateFn.doItemSetRollState(ctx3, isRoll, [cardId2, GameStateFn.getItemBaSyou(ctx3, cardId2)], { isSkipTargetMissing: !0 }), ctx3 = GameStateFn.doTriggerEvent(ctx3, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId2] }), ctx3;\n                }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 2053,
            "description": "onEvent: このカードが場に出た場合 [\"PlayerA_33\"]",
            "effect": {
                "id": "createUnitGoStageEffectFromPlayEffect_PlayerA_33",
                "reason": [
                    "場に出る",
                    "PlayerA",
                    "PlayerA_33"
                ],
                "description": "Play マグアナック",
                "text": {
                    "id": "createPlayUnitEffect_PlayerA_33",
                    "description": "Play マグアナック",
                    "title": [],
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect2, { DefineFn, GameStateFn }) {\n                  const cardId2 = DefineFn.EffectFn.getCardID(effect2), from = GameStateFn.getItemBaSyou(ctx3, cardId2), to = DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\");\n                  ctx3 = GameStateFn.doItemMove(ctx3, to, [cardId2, from]);\n                  const hasHigh = GameStateFn.getCardHasSpeicalEffect(ctx3, [\"\\u6226\\u95D8\\u914D\\u5099\"], cardId2), hasPS = GameStateFn.getCardHasSpeicalEffect(ctx3, [\"\\u3010PS\\u88C5\\u7532\\u3011\"], cardId2), isRoll = (hasHigh || hasPS) == !1;\n                  return ctx3 = GameStateFn.doItemSetRollState(ctx3, isRoll, [cardId2, GameStateFn.getItemBaSyou(ctx3, cardId2)], { isSkipTargetMissing: !0 }), ctx3 = GameStateFn.doTriggerEvent(ctx3, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId2] }), ctx3;\n                }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 2052,
            "description": "onEffectStart: Play マグアナック",
            "effect": {
                "id": "createUnitGoStageEffectFromPlayEffect_PlayerA_33",
                "reason": [
                    "場に出る",
                    "PlayerA",
                    "PlayerA_33"
                ],
                "description": "Play マグアナック",
                "text": {
                    "id": "createPlayUnitEffect_PlayerA_33",
                    "description": "Play マグアナック",
                    "title": [],
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect2, { DefineFn, GameStateFn }) {\n                  const cardId2 = DefineFn.EffectFn.getCardID(effect2), from = GameStateFn.getItemBaSyou(ctx3, cardId2), to = DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\");\n                  ctx3 = GameStateFn.doItemMove(ctx3, to, [cardId2, from]);\n                  const hasHigh = GameStateFn.getCardHasSpeicalEffect(ctx3, [\"\\u6226\\u95D8\\u914D\\u5099\"], cardId2), hasPS = GameStateFn.getCardHasSpeicalEffect(ctx3, [\"\\u3010PS\\u88C5\\u7532\\u3011\"], cardId2), isRoll = (hasHigh || hasPS) == !1;\n                  return ctx3 = GameStateFn.doItemSetRollState(ctx3, isRoll, [cardId2, GameStateFn.getItemBaSyou(ctx3, cardId2)], { isSkipTargetMissing: !0 }), ctx3 = GameStateFn.doTriggerEvent(ctx3, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId2] }), ctx3;\n                }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 2051,
            "description": "onEffectEnd: Play マグアナック"
        },
        {
            "id": 2050,
            "description": "onItemMove:PlayerA_33 = [\"PlayerA\",\"手札\"] => [\"PlayerA\",\"プレイされているカード\"]",
            "effect": {
                "id": "createPlayUnitEffect_PlayerA_33",
                "reason": [
                    "PlayCard",
                    "PlayerA",
                    "PlayerA_33",
                    {
                        "isPlayUnit": true
                    }
                ],
                "description": "Play マグアナック",
                "text": {
                    "id": "createPlayUnitEffect_PlayerA_33",
                    "title": [
                        "使用型",
                        [
                            "自軍",
                            "配備フェイズ"
                        ]
                    ],
                    "description": "Play マグアナック",
                    "conditions": {
                        "合計国力〔x〕": {
                            "actions": [
                                {
                                    "title": [
                                        "合計国力〔x〕",
                                        3
                                    ]
                                }
                            ]
                        },
                        "橫置支付0[白]": {
                            "title": [
                                "RollColor",
                                "白"
                            ],
                            "actions": [
                                {
                                    "title": [
                                        "_ロールする",
                                        "ロール"
                                    ],
                                    "vars": [
                                        "橫置支付0[白]"
                                    ]
                                }
                            ],
                            "groupKey": "支付橫置國力"
                        }
                    },
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect, { DefineFn, GameStateFn, ToolFn: ToolFn2 }) {\n              const cardId2 = DefineFn.EffectFn.getCardID(effect), from = GameStateFn.getItemBaSyou(ctx3, cardId2);\n              ctx3 = GameStateFn.doItemMove(ctx3, DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u3044\\u308B\\u30AB\\u30FC\\u30C9\"), [cardId2, from]);\n              const newE = GameStateFn.createUnitGoStageEffectFromPlayEffect(ctx3, effect);\n              return GameStateFn.addStackEffect(ctx3, newE);\n            }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 2049,
            "description": "onEvent: GameEventOnMove [\"PlayerA_33\"]",
            "effect": {
                "id": "createPlayUnitEffect_PlayerA_33",
                "reason": [
                    "PlayCard",
                    "PlayerA",
                    "PlayerA_33",
                    {
                        "isPlayUnit": true
                    }
                ],
                "description": "Play マグアナック",
                "text": {
                    "id": "createPlayUnitEffect_PlayerA_33",
                    "title": [
                        "使用型",
                        [
                            "自軍",
                            "配備フェイズ"
                        ]
                    ],
                    "description": "Play マグアナック",
                    "conditions": {
                        "合計国力〔x〕": {
                            "actions": [
                                {
                                    "title": [
                                        "合計国力〔x〕",
                                        3
                                    ]
                                }
                            ]
                        },
                        "橫置支付0[白]": {
                            "title": [
                                "RollColor",
                                "白"
                            ],
                            "actions": [
                                {
                                    "title": [
                                        "_ロールする",
                                        "ロール"
                                    ],
                                    "vars": [
                                        "橫置支付0[白]"
                                    ]
                                }
                            ],
                            "groupKey": "支付橫置國力"
                        }
                    },
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect, { DefineFn, GameStateFn, ToolFn: ToolFn2 }) {\n              const cardId2 = DefineFn.EffectFn.getCardID(effect), from = GameStateFn.getItemBaSyou(ctx3, cardId2);\n              ctx3 = GameStateFn.doItemMove(ctx3, DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u3044\\u308B\\u30AB\\u30FC\\u30C9\"), [cardId2, from]);\n              const newE = GameStateFn.createUnitGoStageEffectFromPlayEffect(ctx3, effect);\n              return GameStateFn.addStackEffect(ctx3, newE);\n            }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 2048,
            "description": "PlayerA_33.isFaceDown true => false",
            "effect": {
                "id": "createPlayUnitEffect_PlayerA_33",
                "reason": [
                    "PlayCard",
                    "PlayerA",
                    "PlayerA_33",
                    {
                        "isPlayUnit": true
                    }
                ],
                "description": "Play マグアナック",
                "text": {
                    "id": "createPlayUnitEffect_PlayerA_33",
                    "title": [
                        "使用型",
                        [
                            "自軍",
                            "配備フェイズ"
                        ]
                    ],
                    "description": "Play マグアナック",
                    "conditions": {
                        "合計国力〔x〕": {
                            "actions": [
                                {
                                    "title": [
                                        "合計国力〔x〕",
                                        3
                                    ]
                                }
                            ]
                        },
                        "橫置支付0[白]": {
                            "title": [
                                "RollColor",
                                "白"
                            ],
                            "actions": [
                                {
                                    "title": [
                                        "_ロールする",
                                        "ロール"
                                    ],
                                    "vars": [
                                        "橫置支付0[白]"
                                    ]
                                }
                            ],
                            "groupKey": "支付橫置國力"
                        }
                    },
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect, { DefineFn, GameStateFn, ToolFn: ToolFn2 }) {\n              const cardId2 = DefineFn.EffectFn.getCardID(effect), from = GameStateFn.getItemBaSyou(ctx3, cardId2);\n              ctx3 = GameStateFn.doItemMove(ctx3, DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u3044\\u308B\\u30AB\\u30FC\\u30C9\"), [cardId2, from]);\n              const newE = GameStateFn.createUnitGoStageEffectFromPlayEffect(ctx3, effect);\n              return GameStateFn.addStackEffect(ctx3, newE);\n            }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 2047,
            "description": "onEvent: プレイした場合 [\"PlayerA_33\"]",
            "effect": {
                "id": "createPlayUnitEffect_PlayerA_33",
                "reason": [
                    "PlayCard",
                    "PlayerA",
                    "PlayerA_33",
                    {
                        "isPlayUnit": true
                    }
                ],
                "description": "Play マグアナック",
                "text": {
                    "id": "createPlayUnitEffect_PlayerA_33",
                    "title": [
                        "使用型",
                        [
                            "自軍",
                            "配備フェイズ"
                        ]
                    ],
                    "description": "Play マグアナック",
                    "conditions": {
                        "合計国力〔x〕": {
                            "actions": [
                                {
                                    "title": [
                                        "合計国力〔x〕",
                                        3
                                    ]
                                }
                            ]
                        },
                        "橫置支付0[白]": {
                            "title": [
                                "RollColor",
                                "白"
                            ],
                            "actions": [
                                {
                                    "title": [
                                        "_ロールする",
                                        "ロール"
                                    ],
                                    "vars": [
                                        "橫置支付0[白]"
                                    ]
                                }
                            ],
                            "groupKey": "支付橫置國力"
                        }
                    },
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect, { DefineFn, GameStateFn, ToolFn: ToolFn2 }) {\n              const cardId2 = DefineFn.EffectFn.getCardID(effect), from = GameStateFn.getItemBaSyou(ctx3, cardId2);\n              ctx3 = GameStateFn.doItemMove(ctx3, DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u3044\\u308B\\u30AB\\u30FC\\u30C9\"), [cardId2, from]);\n              const newE = GameStateFn.createUnitGoStageEffectFromPlayEffect(ctx3, effect);\n              return GameStateFn.addStackEffect(ctx3, newE);\n            }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 2046,
            "description": "PlayerA_28.isRoll false => true",
            "effect": {
                "id": "createPlayUnitEffect_PlayerA_33",
                "reason": [
                    "PlayCard",
                    "PlayerA",
                    "PlayerA_33",
                    {
                        "isPlayUnit": true
                    }
                ],
                "description": "Play マグアナック",
                "text": {
                    "id": "createPlayUnitEffect_PlayerA_33",
                    "title": [
                        "使用型",
                        [
                            "自軍",
                            "配備フェイズ"
                        ]
                    ],
                    "description": "Play マグアナック",
                    "conditions": {
                        "合計国力〔x〕": {
                            "actions": [
                                {
                                    "title": [
                                        "合計国力〔x〕",
                                        3
                                    ]
                                }
                            ]
                        },
                        "橫置支付0[白]": {
                            "title": [
                                "RollColor",
                                "白"
                            ],
                            "actions": [
                                {
                                    "title": [
                                        "_ロールする",
                                        "ロール"
                                    ],
                                    "vars": [
                                        "橫置支付0[白]"
                                    ]
                                }
                            ],
                            "groupKey": "支付橫置國力"
                        }
                    },
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect, { DefineFn, GameStateFn, ToolFn: ToolFn2 }) {\n              const cardId2 = DefineFn.EffectFn.getCardID(effect), from = GameStateFn.getItemBaSyou(ctx3, cardId2);\n              ctx3 = GameStateFn.doItemMove(ctx3, DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u3044\\u308B\\u30AB\\u30FC\\u30C9\"), [cardId2, from]);\n              const newE = GameStateFn.createUnitGoStageEffectFromPlayEffect(ctx3, effect);\n              return GameStateFn.addStackEffect(ctx3, newE);\n            }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 2045,
            "description": "onEffectStart: Play マグアナック",
            "effect": {
                "id": "createPlayUnitEffect_PlayerA_33",
                "reason": [
                    "PlayCard",
                    "PlayerA",
                    "PlayerA_33",
                    {
                        "isPlayUnit": true
                    }
                ],
                "description": "Play マグアナック",
                "text": {
                    "id": "createPlayUnitEffect_PlayerA_33",
                    "title": [
                        "使用型",
                        [
                            "自軍",
                            "配備フェイズ"
                        ]
                    ],
                    "description": "Play マグアナック",
                    "conditions": {
                        "合計国力〔x〕": {
                            "actions": [
                                {
                                    "title": [
                                        "合計国力〔x〕",
                                        3
                                    ]
                                }
                            ]
                        },
                        "橫置支付0[白]": {
                            "title": [
                                "RollColor",
                                "白"
                            ],
                            "actions": [
                                {
                                    "title": [
                                        "_ロールする",
                                        "ロール"
                                    ],
                                    "vars": [
                                        "橫置支付0[白]"
                                    ]
                                }
                            ],
                            "groupKey": "支付橫置國力"
                        }
                    },
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect, { DefineFn, GameStateFn, ToolFn: ToolFn2 }) {\n              const cardId2 = DefineFn.EffectFn.getCardID(effect), from = GameStateFn.getItemBaSyou(ctx3, cardId2);\n              ctx3 = GameStateFn.doItemMove(ctx3, DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u3044\\u308B\\u30AB\\u30FC\\u30C9\"), [cardId2, from]);\n              const newE = GameStateFn.createUnitGoStageEffectFromPlayEffect(ctx3, effect);\n              return GameStateFn.addStackEffect(ctx3, newE);\n            }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 2044,
            "description": "onSetPhase:配備フェイズ,フリータイミング"
        },
        {
            "id": 2043,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 2042,
            "description": "onSetPhase:配備フェイズ,フェイズ開始"
        },
        {
            "id": 2041,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 2040,
            "description": "onSetPhase:ドローフェイズ,フェイズ終了"
        },
        {
            "id": 2039,
            "description": "onSetPhase:ドローフェイズ,フリータイミング"
        },
        {
            "id": 2038,
            "description": "onEffectEnd: 抽牌階段規定效果"
        },
        {
            "id": 2037,
            "description": "onItemMove:PlayerA_33 = [\"PlayerA\",\"本国\"] => [\"PlayerA\",\"手札\"]",
            "effect": {
                "id": "createDrawPhaseRuleEffect_PlayerA",
                "reason": [
                    "GameRule",
                    "PlayerA",
                    {
                        "isDraw": true
                    }
                ],
                "text": {
                    "id": "createDrawPhaseRuleEffect_text_PlayerA",
                    "title": [],
                    "description": "抽牌階段規定效果",
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                const playerId2 = DefineFn2.EffectFn.getPlayerID(effect), from = DefineFn2.AbsoluteBaSyouFn.of(playerId2, \"\\u672C\\u56FD\"), cardIds = GameStateFn2.getItemIdsByBasyou(ctx3, from).slice(0, 1);\n                for (let cardId of cardIds)\n                  ctx3 = GameStateFn2.doItemMove(ctx3, DefineFn2.AbsoluteBaSyouFn.of(playerId2, \"\\u624B\\u672D\"), [cardId, from]);\n                return ctx3;\n              }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 2036,
            "description": "onEvent: GameEventOnMove [\"PlayerA_33\"]",
            "effect": {
                "id": "createDrawPhaseRuleEffect_PlayerA",
                "reason": [
                    "GameRule",
                    "PlayerA",
                    {
                        "isDraw": true
                    }
                ],
                "text": {
                    "id": "createDrawPhaseRuleEffect_text_PlayerA",
                    "title": [],
                    "description": "抽牌階段規定效果",
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                const playerId2 = DefineFn2.EffectFn.getPlayerID(effect), from = DefineFn2.AbsoluteBaSyouFn.of(playerId2, \"\\u672C\\u56FD\"), cardIds = GameStateFn2.getItemIdsByBasyou(ctx3, from).slice(0, 1);\n                for (let cardId of cardIds)\n                  ctx3 = GameStateFn2.doItemMove(ctx3, DefineFn2.AbsoluteBaSyouFn.of(playerId2, \"\\u624B\\u672D\"), [cardId, from]);\n                return ctx3;\n              }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 2035,
            "description": "PlayerA_33.isRoll undefined => false",
            "effect": {
                "id": "createDrawPhaseRuleEffect_PlayerA",
                "reason": [
                    "GameRule",
                    "PlayerA",
                    {
                        "isDraw": true
                    }
                ],
                "text": {
                    "id": "createDrawPhaseRuleEffect_text_PlayerA",
                    "title": [],
                    "description": "抽牌階段規定效果",
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                const playerId2 = DefineFn2.EffectFn.getPlayerID(effect), from = DefineFn2.AbsoluteBaSyouFn.of(playerId2, \"\\u672C\\u56FD\"), cardIds = GameStateFn2.getItemIdsByBasyou(ctx3, from).slice(0, 1);\n                for (let cardId of cardIds)\n                  ctx3 = GameStateFn2.doItemMove(ctx3, DefineFn2.AbsoluteBaSyouFn.of(playerId2, \"\\u624B\\u672D\"), [cardId, from]);\n                return ctx3;\n              }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 2034,
            "description": "onEffectStart: 抽牌階段規定效果",
            "effect": {
                "id": "createDrawPhaseRuleEffect_PlayerA",
                "reason": [
                    "GameRule",
                    "PlayerA",
                    {
                        "isDraw": true
                    }
                ],
                "text": {
                    "id": "createDrawPhaseRuleEffect_text_PlayerA",
                    "title": [],
                    "description": "抽牌階段規定效果",
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                const playerId2 = DefineFn2.EffectFn.getPlayerID(effect), from = DefineFn2.AbsoluteBaSyouFn.of(playerId2, \"\\u672C\\u56FD\"), cardIds = GameStateFn2.getItemIdsByBasyou(ctx3, from).slice(0, 1);\n                for (let cardId of cardIds)\n                  ctx3 = GameStateFn2.doItemMove(ctx3, DefineFn2.AbsoluteBaSyouFn.of(playerId2, \"\\u624B\\u672D\"), [cardId, from]);\n                return ctx3;\n              }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 2033,
            "description": "onSetPhase:ドローフェイズ,規定の効果"
        },
        {
            "id": 2032,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 2031,
            "description": "onSetPhase:ドローフェイズ,フェイズ開始"
        },
        {
            "id": 2030,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 2029,
            "description": "onSetPhase:リロールフェイズ,フェイズ終了"
        },
        {
            "id": 2028,
            "description": "onSetPhase:リロールフェイズ,フリータイミング"
        },
        {
            "id": 2027,
            "description": "onEffectEnd: getRerollPhaseRuleEffect"
        },
        {
            "id": 2026,
            "description": "PlayerA_13.isRoll true => false",
            "effect": {
                "id": "createRerollPhaseRuleEffect_PlayerA",
                "reason": [
                    "GameRule",
                    "PlayerA",
                    {
                        "isReroll": true
                    }
                ],
                "text": {
                    "id": "createRerollPhaseRuleEffect_text_PlayerA",
                    "title": [],
                    "description": "getRerollPhaseRuleEffect",
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                const playerId2 = DefineFn2.EffectFn.getPlayerID(effect), pairs = [\"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\", \"G\\u30BE\\u30FC\\u30F3\"].flatMap((kw) => {\n                  const basyou = DefineFn2.AbsoluteBaSyouFn.of(playerId2, kw);\n                  return GameStateFn2.getItemIdsByBasyou(ctx3, basyou).filter((cardId) => GameStateFn2.getItemIsCanReroll(ctx3, cardId)).map((cardId) => {\n                    return [cardId, basyou];\n                  });\n                });\n                for (let pair3 of pairs)\n                  ctx3 = GameStateFn2.doItemSetRollState(ctx3, !1, pair3, { isSkipTargetMissing: !0 });\n                return ctx3;\n              }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 2025,
            "description": "PlayerA_54.isRoll true => false",
            "effect": {
                "id": "createRerollPhaseRuleEffect_PlayerA",
                "reason": [
                    "GameRule",
                    "PlayerA",
                    {
                        "isReroll": true
                    }
                ],
                "text": {
                    "id": "createRerollPhaseRuleEffect_text_PlayerA",
                    "title": [],
                    "description": "getRerollPhaseRuleEffect",
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                const playerId2 = DefineFn2.EffectFn.getPlayerID(effect), pairs = [\"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\", \"G\\u30BE\\u30FC\\u30F3\"].flatMap((kw) => {\n                  const basyou = DefineFn2.AbsoluteBaSyouFn.of(playerId2, kw);\n                  return GameStateFn2.getItemIdsByBasyou(ctx3, basyou).filter((cardId) => GameStateFn2.getItemIsCanReroll(ctx3, cardId)).map((cardId) => {\n                    return [cardId, basyou];\n                  });\n                });\n                for (let pair3 of pairs)\n                  ctx3 = GameStateFn2.doItemSetRollState(ctx3, !1, pair3, { isSkipTargetMissing: !0 });\n                return ctx3;\n              }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 2024,
            "description": "PlayerA_28.isRoll true => false",
            "effect": {
                "id": "createRerollPhaseRuleEffect_PlayerA",
                "reason": [
                    "GameRule",
                    "PlayerA",
                    {
                        "isReroll": true
                    }
                ],
                "text": {
                    "id": "createRerollPhaseRuleEffect_text_PlayerA",
                    "title": [],
                    "description": "getRerollPhaseRuleEffect",
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                const playerId2 = DefineFn2.EffectFn.getPlayerID(effect), pairs = [\"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\", \"G\\u30BE\\u30FC\\u30F3\"].flatMap((kw) => {\n                  const basyou = DefineFn2.AbsoluteBaSyouFn.of(playerId2, kw);\n                  return GameStateFn2.getItemIdsByBasyou(ctx3, basyou).filter((cardId) => GameStateFn2.getItemIsCanReroll(ctx3, cardId)).map((cardId) => {\n                    return [cardId, basyou];\n                  });\n                });\n                for (let pair3 of pairs)\n                  ctx3 = GameStateFn2.doItemSetRollState(ctx3, !1, pair3, { isSkipTargetMissing: !0 });\n                return ctx3;\n              }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 2023,
            "description": "PlayerA_41.isRoll true => false",
            "effect": {
                "id": "createRerollPhaseRuleEffect_PlayerA",
                "reason": [
                    "GameRule",
                    "PlayerA",
                    {
                        "isReroll": true
                    }
                ],
                "text": {
                    "id": "createRerollPhaseRuleEffect_text_PlayerA",
                    "title": [],
                    "description": "getRerollPhaseRuleEffect",
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                const playerId2 = DefineFn2.EffectFn.getPlayerID(effect), pairs = [\"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\", \"G\\u30BE\\u30FC\\u30F3\"].flatMap((kw) => {\n                  const basyou = DefineFn2.AbsoluteBaSyouFn.of(playerId2, kw);\n                  return GameStateFn2.getItemIdsByBasyou(ctx3, basyou).filter((cardId) => GameStateFn2.getItemIsCanReroll(ctx3, cardId)).map((cardId) => {\n                    return [cardId, basyou];\n                  });\n                });\n                for (let pair3 of pairs)\n                  ctx3 = GameStateFn2.doItemSetRollState(ctx3, !1, pair3, { isSkipTargetMissing: !0 });\n                return ctx3;\n              }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 2022,
            "description": "onEffectStart: getRerollPhaseRuleEffect",
            "effect": {
                "id": "createRerollPhaseRuleEffect_PlayerA",
                "reason": [
                    "GameRule",
                    "PlayerA",
                    {
                        "isReroll": true
                    }
                ],
                "text": {
                    "id": "createRerollPhaseRuleEffect_text_PlayerA",
                    "title": [],
                    "description": "getRerollPhaseRuleEffect",
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                const playerId2 = DefineFn2.EffectFn.getPlayerID(effect), pairs = [\"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\", \"G\\u30BE\\u30FC\\u30F3\"].flatMap((kw) => {\n                  const basyou = DefineFn2.AbsoluteBaSyouFn.of(playerId2, kw);\n                  return GameStateFn2.getItemIdsByBasyou(ctx3, basyou).filter((cardId) => GameStateFn2.getItemIsCanReroll(ctx3, cardId)).map((cardId) => {\n                    return [cardId, basyou];\n                  });\n                });\n                for (let pair3 of pairs)\n                  ctx3 = GameStateFn2.doItemSetRollState(ctx3, !1, pair3, { isSkipTargetMissing: !0 });\n                return ctx3;\n              }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 2021,
            "description": "onSetPhase:リロールフェイズ,規定の効果"
        },
        {
            "id": 2020,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 2019,
            "description": "onSetPhase:リロールフェイズ,フェイズ開始"
        },
        {
            "id": 2018,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 2017,
            "description": "onPlayerStateChange:PlayerB"
        },
        {
            "id": 2016,
            "description": "onSetPhase:戦闘フェイズ,ターン終了時,効果終了。ターン終了"
        },
        {
            "id": 2015,
            "description": "onSetPhase:戦闘フェイズ,ターン終了時,手札調整"
        },
        {
            "id": 2014,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 2013,
            "description": "onSetPhase:戦闘フェイズ,ターン終了時,効果解決"
        },
        {
            "id": 2012,
            "description": "onSetPhase:戦闘フェイズ,ターン終了時,ダメージリセット"
        },
        {
            "id": 2011,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 2010,
            "description": "onSetPhase:戦闘フェイズ,帰還ステップ,ステップ終了"
        },
        {
            "id": 2009,
            "description": "onSetPhase:戦闘フェイズ,帰還ステップ,フリータイミング2"
        },
        {
            "id": 2008,
            "description": "onEffectEnd: getReturnRuleEffect"
        },
        {
            "id": 2007,
            "description": "onItemMove:PlayerA_41 = [\"PlayerA\",\"戦闘エリア1\"] => [\"PlayerA\",\"配備エリア\"]",
            "effect": {
                "id": "createReturnRuleEffect_PlayerB",
                "reason": [
                    "GameRule",
                    "PlayerB",
                    {
                        "isReturn": true
                    }
                ],
                "text": {
                    "id": "createReturnRuleEffect_text_PlayerB",
                    "title": [],
                    "description": "getReturnRuleEffect",
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                const playerId2 = DefineFn2.EffectFn.getPlayerID(effect), opponentId = DefineFn2.PlayerIDFn.getOpponent(playerId2);\n                ctx3 = _processKw(ctx3, playerId2, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A21\"), ctx3 = _processKw(ctx3, playerId2, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A22\"), ctx3 = _processKw(ctx3, opponentId, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A21\"), ctx3 = _processKw(ctx3, opponentId, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A22\");\n                function _processKw(ctx4, playerId3, fromKw) {\n                  const from = DefineFn2.AbsoluteBaSyouFn.of(playerId3, fromKw), runtimeArea1 = GameStateFn2.getRuntimeBattleArea(ctx4, fromKw), unitIdsAtArea1 = GameStateFn2.getItemIdsByBasyou(ctx4, from);\n                  for (let cardId of unitIdsAtArea1) {\n                    const target = [cardId, from];\n                    if (GameStateFn2.getSetGroupRoot(ctx4, cardId) != cardId)\n                      continue;\n                    if (GameStateFn2.getCardBattleArea(ctx4, cardId).includes(runtimeArea1))\n                      ctx4 = GameStateFn2.doItemSetRollState(ctx4, !0, target, { isSkipTargetMissing: !0 }), ctx4 = GameStateFn2.doItemMove(ctx4, DefineFn2.AbsoluteBaSyouFn.of(playerId3, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\"), target, { isSkipTargetMissing: !0 });\n                    else\n                      ctx4 = GameStateFn2.doItemMove(ctx4, DefineFn2.AbsoluteBaSyouFn.of(playerId3, \"\\u30B8\\u30E3\\u30F3\\u30AF\\u30E4\\u30FC\\u30C9\"), target, { isSkipTargetMissing: !0 });\n                  }\n                  return ctx4;\n                }\n                return ctx3;\n              }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 2006,
            "description": "onEvent: GameEventOnMove [\"PlayerA_41\"]",
            "effect": {
                "id": "createReturnRuleEffect_PlayerB",
                "reason": [
                    "GameRule",
                    "PlayerB",
                    {
                        "isReturn": true
                    }
                ],
                "text": {
                    "id": "createReturnRuleEffect_text_PlayerB",
                    "title": [],
                    "description": "getReturnRuleEffect",
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                const playerId2 = DefineFn2.EffectFn.getPlayerID(effect), opponentId = DefineFn2.PlayerIDFn.getOpponent(playerId2);\n                ctx3 = _processKw(ctx3, playerId2, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A21\"), ctx3 = _processKw(ctx3, playerId2, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A22\"), ctx3 = _processKw(ctx3, opponentId, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A21\"), ctx3 = _processKw(ctx3, opponentId, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A22\");\n                function _processKw(ctx4, playerId3, fromKw) {\n                  const from = DefineFn2.AbsoluteBaSyouFn.of(playerId3, fromKw), runtimeArea1 = GameStateFn2.getRuntimeBattleArea(ctx4, fromKw), unitIdsAtArea1 = GameStateFn2.getItemIdsByBasyou(ctx4, from);\n                  for (let cardId of unitIdsAtArea1) {\n                    const target = [cardId, from];\n                    if (GameStateFn2.getSetGroupRoot(ctx4, cardId) != cardId)\n                      continue;\n                    if (GameStateFn2.getCardBattleArea(ctx4, cardId).includes(runtimeArea1))\n                      ctx4 = GameStateFn2.doItemSetRollState(ctx4, !0, target, { isSkipTargetMissing: !0 }), ctx4 = GameStateFn2.doItemMove(ctx4, DefineFn2.AbsoluteBaSyouFn.of(playerId3, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\"), target, { isSkipTargetMissing: !0 });\n                    else\n                      ctx4 = GameStateFn2.doItemMove(ctx4, DefineFn2.AbsoluteBaSyouFn.of(playerId3, \"\\u30B8\\u30E3\\u30F3\\u30AF\\u30E4\\u30FC\\u30C9\"), target, { isSkipTargetMissing: !0 });\n                  }\n                  return ctx4;\n                }\n                return ctx3;\n              }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 2005,
            "description": "PlayerA_41.isRoll false => true",
            "effect": {
                "id": "createReturnRuleEffect_PlayerB",
                "reason": [
                    "GameRule",
                    "PlayerB",
                    {
                        "isReturn": true
                    }
                ],
                "text": {
                    "id": "createReturnRuleEffect_text_PlayerB",
                    "title": [],
                    "description": "getReturnRuleEffect",
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                const playerId2 = DefineFn2.EffectFn.getPlayerID(effect), opponentId = DefineFn2.PlayerIDFn.getOpponent(playerId2);\n                ctx3 = _processKw(ctx3, playerId2, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A21\"), ctx3 = _processKw(ctx3, playerId2, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A22\"), ctx3 = _processKw(ctx3, opponentId, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A21\"), ctx3 = _processKw(ctx3, opponentId, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A22\");\n                function _processKw(ctx4, playerId3, fromKw) {\n                  const from = DefineFn2.AbsoluteBaSyouFn.of(playerId3, fromKw), runtimeArea1 = GameStateFn2.getRuntimeBattleArea(ctx4, fromKw), unitIdsAtArea1 = GameStateFn2.getItemIdsByBasyou(ctx4, from);\n                  for (let cardId of unitIdsAtArea1) {\n                    const target = [cardId, from];\n                    if (GameStateFn2.getSetGroupRoot(ctx4, cardId) != cardId)\n                      continue;\n                    if (GameStateFn2.getCardBattleArea(ctx4, cardId).includes(runtimeArea1))\n                      ctx4 = GameStateFn2.doItemSetRollState(ctx4, !0, target, { isSkipTargetMissing: !0 }), ctx4 = GameStateFn2.doItemMove(ctx4, DefineFn2.AbsoluteBaSyouFn.of(playerId3, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\"), target, { isSkipTargetMissing: !0 });\n                    else\n                      ctx4 = GameStateFn2.doItemMove(ctx4, DefineFn2.AbsoluteBaSyouFn.of(playerId3, \"\\u30B8\\u30E3\\u30F3\\u30AF\\u30E4\\u30FC\\u30C9\"), target, { isSkipTargetMissing: !0 });\n                  }\n                  return ctx4;\n                }\n                return ctx3;\n              }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 2004,
            "description": "onItemMove:PlayerB_104 = [\"PlayerB\",\"戦闘エリア2\"] => [\"PlayerB\",\"配備エリア\"]",
            "effect": {
                "id": "createReturnRuleEffect_PlayerB",
                "reason": [
                    "GameRule",
                    "PlayerB",
                    {
                        "isReturn": true
                    }
                ],
                "text": {
                    "id": "createReturnRuleEffect_text_PlayerB",
                    "title": [],
                    "description": "getReturnRuleEffect",
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                const playerId2 = DefineFn2.EffectFn.getPlayerID(effect), opponentId = DefineFn2.PlayerIDFn.getOpponent(playerId2);\n                ctx3 = _processKw(ctx3, playerId2, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A21\"), ctx3 = _processKw(ctx3, playerId2, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A22\"), ctx3 = _processKw(ctx3, opponentId, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A21\"), ctx3 = _processKw(ctx3, opponentId, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A22\");\n                function _processKw(ctx4, playerId3, fromKw) {\n                  const from = DefineFn2.AbsoluteBaSyouFn.of(playerId3, fromKw), runtimeArea1 = GameStateFn2.getRuntimeBattleArea(ctx4, fromKw), unitIdsAtArea1 = GameStateFn2.getItemIdsByBasyou(ctx4, from);\n                  for (let cardId of unitIdsAtArea1) {\n                    const target = [cardId, from];\n                    if (GameStateFn2.getSetGroupRoot(ctx4, cardId) != cardId)\n                      continue;\n                    if (GameStateFn2.getCardBattleArea(ctx4, cardId).includes(runtimeArea1))\n                      ctx4 = GameStateFn2.doItemSetRollState(ctx4, !0, target, { isSkipTargetMissing: !0 }), ctx4 = GameStateFn2.doItemMove(ctx4, DefineFn2.AbsoluteBaSyouFn.of(playerId3, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\"), target, { isSkipTargetMissing: !0 });\n                    else\n                      ctx4 = GameStateFn2.doItemMove(ctx4, DefineFn2.AbsoluteBaSyouFn.of(playerId3, \"\\u30B8\\u30E3\\u30F3\\u30AF\\u30E4\\u30FC\\u30C9\"), target, { isSkipTargetMissing: !0 });\n                  }\n                  return ctx4;\n                }\n                return ctx3;\n              }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 2003,
            "description": "onItemMove:PlayerB_74 = [\"PlayerB\",\"戦闘エリア2\"] => [\"PlayerB\",\"配備エリア\"]",
            "effect": {
                "id": "createReturnRuleEffect_PlayerB",
                "reason": [
                    "GameRule",
                    "PlayerB",
                    {
                        "isReturn": true
                    }
                ],
                "text": {
                    "id": "createReturnRuleEffect_text_PlayerB",
                    "title": [],
                    "description": "getReturnRuleEffect",
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                const playerId2 = DefineFn2.EffectFn.getPlayerID(effect), opponentId = DefineFn2.PlayerIDFn.getOpponent(playerId2);\n                ctx3 = _processKw(ctx3, playerId2, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A21\"), ctx3 = _processKw(ctx3, playerId2, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A22\"), ctx3 = _processKw(ctx3, opponentId, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A21\"), ctx3 = _processKw(ctx3, opponentId, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A22\");\n                function _processKw(ctx4, playerId3, fromKw) {\n                  const from = DefineFn2.AbsoluteBaSyouFn.of(playerId3, fromKw), runtimeArea1 = GameStateFn2.getRuntimeBattleArea(ctx4, fromKw), unitIdsAtArea1 = GameStateFn2.getItemIdsByBasyou(ctx4, from);\n                  for (let cardId of unitIdsAtArea1) {\n                    const target = [cardId, from];\n                    if (GameStateFn2.getSetGroupRoot(ctx4, cardId) != cardId)\n                      continue;\n                    if (GameStateFn2.getCardBattleArea(ctx4, cardId).includes(runtimeArea1))\n                      ctx4 = GameStateFn2.doItemSetRollState(ctx4, !0, target, { isSkipTargetMissing: !0 }), ctx4 = GameStateFn2.doItemMove(ctx4, DefineFn2.AbsoluteBaSyouFn.of(playerId3, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\"), target, { isSkipTargetMissing: !0 });\n                    else\n                      ctx4 = GameStateFn2.doItemMove(ctx4, DefineFn2.AbsoluteBaSyouFn.of(playerId3, \"\\u30B8\\u30E3\\u30F3\\u30AF\\u30E4\\u30FC\\u30C9\"), target, { isSkipTargetMissing: !0 });\n                  }\n                  return ctx4;\n                }\n                return ctx3;\n              }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 2002,
            "description": "onEvent: GameEventOnMove [\"PlayerB_104\"]",
            "effect": {
                "id": "createReturnRuleEffect_PlayerB",
                "reason": [
                    "GameRule",
                    "PlayerB",
                    {
                        "isReturn": true
                    }
                ],
                "text": {
                    "id": "createReturnRuleEffect_text_PlayerB",
                    "title": [],
                    "description": "getReturnRuleEffect",
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                const playerId2 = DefineFn2.EffectFn.getPlayerID(effect), opponentId = DefineFn2.PlayerIDFn.getOpponent(playerId2);\n                ctx3 = _processKw(ctx3, playerId2, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A21\"), ctx3 = _processKw(ctx3, playerId2, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A22\"), ctx3 = _processKw(ctx3, opponentId, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A21\"), ctx3 = _processKw(ctx3, opponentId, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A22\");\n                function _processKw(ctx4, playerId3, fromKw) {\n                  const from = DefineFn2.AbsoluteBaSyouFn.of(playerId3, fromKw), runtimeArea1 = GameStateFn2.getRuntimeBattleArea(ctx4, fromKw), unitIdsAtArea1 = GameStateFn2.getItemIdsByBasyou(ctx4, from);\n                  for (let cardId of unitIdsAtArea1) {\n                    const target = [cardId, from];\n                    if (GameStateFn2.getSetGroupRoot(ctx4, cardId) != cardId)\n                      continue;\n                    if (GameStateFn2.getCardBattleArea(ctx4, cardId).includes(runtimeArea1))\n                      ctx4 = GameStateFn2.doItemSetRollState(ctx4, !0, target, { isSkipTargetMissing: !0 }), ctx4 = GameStateFn2.doItemMove(ctx4, DefineFn2.AbsoluteBaSyouFn.of(playerId3, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\"), target, { isSkipTargetMissing: !0 });\n                    else\n                      ctx4 = GameStateFn2.doItemMove(ctx4, DefineFn2.AbsoluteBaSyouFn.of(playerId3, \"\\u30B8\\u30E3\\u30F3\\u30AF\\u30E4\\u30FC\\u30C9\"), target, { isSkipTargetMissing: !0 });\n                  }\n                  return ctx4;\n                }\n                return ctx3;\n              }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 2001,
            "description": "onEvent: GameEventOnMove [\"PlayerB_74\"]",
            "effect": {
                "id": "createReturnRuleEffect_PlayerB",
                "reason": [
                    "GameRule",
                    "PlayerB",
                    {
                        "isReturn": true
                    }
                ],
                "text": {
                    "id": "createReturnRuleEffect_text_PlayerB",
                    "title": [],
                    "description": "getReturnRuleEffect",
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                const playerId2 = DefineFn2.EffectFn.getPlayerID(effect), opponentId = DefineFn2.PlayerIDFn.getOpponent(playerId2);\n                ctx3 = _processKw(ctx3, playerId2, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A21\"), ctx3 = _processKw(ctx3, playerId2, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A22\"), ctx3 = _processKw(ctx3, opponentId, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A21\"), ctx3 = _processKw(ctx3, opponentId, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A22\");\n                function _processKw(ctx4, playerId3, fromKw) {\n                  const from = DefineFn2.AbsoluteBaSyouFn.of(playerId3, fromKw), runtimeArea1 = GameStateFn2.getRuntimeBattleArea(ctx4, fromKw), unitIdsAtArea1 = GameStateFn2.getItemIdsByBasyou(ctx4, from);\n                  for (let cardId of unitIdsAtArea1) {\n                    const target = [cardId, from];\n                    if (GameStateFn2.getSetGroupRoot(ctx4, cardId) != cardId)\n                      continue;\n                    if (GameStateFn2.getCardBattleArea(ctx4, cardId).includes(runtimeArea1))\n                      ctx4 = GameStateFn2.doItemSetRollState(ctx4, !0, target, { isSkipTargetMissing: !0 }), ctx4 = GameStateFn2.doItemMove(ctx4, DefineFn2.AbsoluteBaSyouFn.of(playerId3, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\"), target, { isSkipTargetMissing: !0 });\n                    else\n                      ctx4 = GameStateFn2.doItemMove(ctx4, DefineFn2.AbsoluteBaSyouFn.of(playerId3, \"\\u30B8\\u30E3\\u30F3\\u30AF\\u30E4\\u30FC\\u30C9\"), target, { isSkipTargetMissing: !0 });\n                  }\n                  return ctx4;\n                }\n                return ctx3;\n              }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 2000,
            "description": "PlayerB_104.isRoll false => true",
            "effect": {
                "id": "createReturnRuleEffect_PlayerB",
                "reason": [
                    "GameRule",
                    "PlayerB",
                    {
                        "isReturn": true
                    }
                ],
                "text": {
                    "id": "createReturnRuleEffect_text_PlayerB",
                    "title": [],
                    "description": "getReturnRuleEffect",
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                const playerId2 = DefineFn2.EffectFn.getPlayerID(effect), opponentId = DefineFn2.PlayerIDFn.getOpponent(playerId2);\n                ctx3 = _processKw(ctx3, playerId2, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A21\"), ctx3 = _processKw(ctx3, playerId2, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A22\"), ctx3 = _processKw(ctx3, opponentId, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A21\"), ctx3 = _processKw(ctx3, opponentId, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A22\");\n                function _processKw(ctx4, playerId3, fromKw) {\n                  const from = DefineFn2.AbsoluteBaSyouFn.of(playerId3, fromKw), runtimeArea1 = GameStateFn2.getRuntimeBattleArea(ctx4, fromKw), unitIdsAtArea1 = GameStateFn2.getItemIdsByBasyou(ctx4, from);\n                  for (let cardId of unitIdsAtArea1) {\n                    const target = [cardId, from];\n                    if (GameStateFn2.getSetGroupRoot(ctx4, cardId) != cardId)\n                      continue;\n                    if (GameStateFn2.getCardBattleArea(ctx4, cardId).includes(runtimeArea1))\n                      ctx4 = GameStateFn2.doItemSetRollState(ctx4, !0, target, { isSkipTargetMissing: !0 }), ctx4 = GameStateFn2.doItemMove(ctx4, DefineFn2.AbsoluteBaSyouFn.of(playerId3, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\"), target, { isSkipTargetMissing: !0 });\n                    else\n                      ctx4 = GameStateFn2.doItemMove(ctx4, DefineFn2.AbsoluteBaSyouFn.of(playerId3, \"\\u30B8\\u30E3\\u30F3\\u30AF\\u30E4\\u30FC\\u30C9\"), target, { isSkipTargetMissing: !0 });\n                  }\n                  return ctx4;\n                }\n                return ctx3;\n              }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 1999,
            "description": "PlayerB_74.isRoll false => true",
            "effect": {
                "id": "createReturnRuleEffect_PlayerB",
                "reason": [
                    "GameRule",
                    "PlayerB",
                    {
                        "isReturn": true
                    }
                ],
                "text": {
                    "id": "createReturnRuleEffect_text_PlayerB",
                    "title": [],
                    "description": "getReturnRuleEffect",
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                const playerId2 = DefineFn2.EffectFn.getPlayerID(effect), opponentId = DefineFn2.PlayerIDFn.getOpponent(playerId2);\n                ctx3 = _processKw(ctx3, playerId2, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A21\"), ctx3 = _processKw(ctx3, playerId2, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A22\"), ctx3 = _processKw(ctx3, opponentId, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A21\"), ctx3 = _processKw(ctx3, opponentId, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A22\");\n                function _processKw(ctx4, playerId3, fromKw) {\n                  const from = DefineFn2.AbsoluteBaSyouFn.of(playerId3, fromKw), runtimeArea1 = GameStateFn2.getRuntimeBattleArea(ctx4, fromKw), unitIdsAtArea1 = GameStateFn2.getItemIdsByBasyou(ctx4, from);\n                  for (let cardId of unitIdsAtArea1) {\n                    const target = [cardId, from];\n                    if (GameStateFn2.getSetGroupRoot(ctx4, cardId) != cardId)\n                      continue;\n                    if (GameStateFn2.getCardBattleArea(ctx4, cardId).includes(runtimeArea1))\n                      ctx4 = GameStateFn2.doItemSetRollState(ctx4, !0, target, { isSkipTargetMissing: !0 }), ctx4 = GameStateFn2.doItemMove(ctx4, DefineFn2.AbsoluteBaSyouFn.of(playerId3, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\"), target, { isSkipTargetMissing: !0 });\n                    else\n                      ctx4 = GameStateFn2.doItemMove(ctx4, DefineFn2.AbsoluteBaSyouFn.of(playerId3, \"\\u30B8\\u30E3\\u30F3\\u30AF\\u30E4\\u30FC\\u30C9\"), target, { isSkipTargetMissing: !0 });\n                  }\n                  return ctx4;\n                }\n                return ctx3;\n              }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 1998,
            "description": "onEffectStart: getReturnRuleEffect",
            "effect": {
                "id": "createReturnRuleEffect_PlayerB",
                "reason": [
                    "GameRule",
                    "PlayerB",
                    {
                        "isReturn": true
                    }
                ],
                "text": {
                    "id": "createReturnRuleEffect_text_PlayerB",
                    "title": [],
                    "description": "getReturnRuleEffect",
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                const playerId2 = DefineFn2.EffectFn.getPlayerID(effect), opponentId = DefineFn2.PlayerIDFn.getOpponent(playerId2);\n                ctx3 = _processKw(ctx3, playerId2, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A21\"), ctx3 = _processKw(ctx3, playerId2, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A22\"), ctx3 = _processKw(ctx3, opponentId, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A21\"), ctx3 = _processKw(ctx3, opponentId, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A22\");\n                function _processKw(ctx4, playerId3, fromKw) {\n                  const from = DefineFn2.AbsoluteBaSyouFn.of(playerId3, fromKw), runtimeArea1 = GameStateFn2.getRuntimeBattleArea(ctx4, fromKw), unitIdsAtArea1 = GameStateFn2.getItemIdsByBasyou(ctx4, from);\n                  for (let cardId of unitIdsAtArea1) {\n                    const target = [cardId, from];\n                    if (GameStateFn2.getSetGroupRoot(ctx4, cardId) != cardId)\n                      continue;\n                    if (GameStateFn2.getCardBattleArea(ctx4, cardId).includes(runtimeArea1))\n                      ctx4 = GameStateFn2.doItemSetRollState(ctx4, !0, target, { isSkipTargetMissing: !0 }), ctx4 = GameStateFn2.doItemMove(ctx4, DefineFn2.AbsoluteBaSyouFn.of(playerId3, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\"), target, { isSkipTargetMissing: !0 });\n                    else\n                      ctx4 = GameStateFn2.doItemMove(ctx4, DefineFn2.AbsoluteBaSyouFn.of(playerId3, \"\\u30B8\\u30E3\\u30F3\\u30AF\\u30E4\\u30FC\\u30C9\"), target, { isSkipTargetMissing: !0 });\n                  }\n                  return ctx4;\n                }\n                return ctx3;\n              }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 1997,
            "description": "onSetPhase:戦闘フェイズ,帰還ステップ,規定の効果"
        },
        {
            "id": 1996,
            "description": "onSetPhase:戦闘フェイズ,帰還ステップ,フリータイミング"
        },
        {
            "id": 1995,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 1994,
            "description": "onSetPhase:戦闘フェイズ,帰還ステップ,ステップ開始"
        },
        {
            "id": 1993,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 1992,
            "description": "onSetPhase:戦闘フェイズ,ダメージ判定ステップ,ステップ終了"
        },
        {
            "id": 1991,
            "description": "onEvent: カット終了時 undefined"
        },
        {
            "id": 1990,
            "description": "onEffectEnd: undefined"
        },
        {
            "id": 1989,
            "description": "onItemMove:PlayerB_90 = [\"PlayerB\",\"戦闘エリア1\"] => [\"PlayerB\",\"ジャンクヤード\"]",
            "effect": {
                "id": "createDestroyEffect_PlayerB_90",
                "reason": [
                    "Destroy",
                    "PlayerA",
                    "PlayerB_90",
                    {
                        "id": "戦闘ダメージ",
                        "playerID": "PlayerA"
                    }
                ],
                "text": {
                    "id": "createDestroyEffect_text_PlayerB_90",
                    "title": [],
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect2, { DefineFn, GameStateFn }) {\n                const cardId2 = DefineFn.EffectFn.getCardID(effect2), cardOwner = GameStateFn.getItemOwner(ctx3, cardId2);\n                return ctx3 = GameStateFn.doItemMove(ctx3, DefineFn.AbsoluteBaSyouFn.of(cardOwner, \"\\u30B8\\u30E3\\u30F3\\u30AF\\u30E4\\u30FC\\u30C9\"), [cardId2, GameStateFn.getItemBaSyou(ctx3, cardId2)], { isSkipTargetMissing: !0 }), ctx3 = GameStateFn.mapItemState(ctx3, cardId2, (is) => {\n                  return {\n                    ...is,\n                    damage: 0\n                  };\n                }), ctx3;\n              }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 1988,
            "description": "onEvent: GameEventOnMove [\"PlayerB_90\"]",
            "effect": {
                "id": "createDestroyEffect_PlayerB_90",
                "reason": [
                    "Destroy",
                    "PlayerA",
                    "PlayerB_90",
                    {
                        "id": "戦闘ダメージ",
                        "playerID": "PlayerA"
                    }
                ],
                "text": {
                    "id": "createDestroyEffect_text_PlayerB_90",
                    "title": [],
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect2, { DefineFn, GameStateFn }) {\n                const cardId2 = DefineFn.EffectFn.getCardID(effect2), cardOwner = GameStateFn.getItemOwner(ctx3, cardId2);\n                return ctx3 = GameStateFn.doItemMove(ctx3, DefineFn.AbsoluteBaSyouFn.of(cardOwner, \"\\u30B8\\u30E3\\u30F3\\u30AF\\u30E4\\u30FC\\u30C9\"), [cardId2, GameStateFn.getItemBaSyou(ctx3, cardId2)], { isSkipTargetMissing: !0 }), ctx3 = GameStateFn.mapItemState(ctx3, cardId2, (is) => {\n                  return {\n                    ...is,\n                    damage: 0\n                  };\n                }), ctx3;\n              }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 1987,
            "description": "傷害變化: PlayerB_90 4 => 0",
            "effect": {
                "id": "createDestroyEffect_PlayerB_90",
                "reason": [
                    "Destroy",
                    "PlayerA",
                    "PlayerB_90",
                    {
                        "id": "戦闘ダメージ",
                        "playerID": "PlayerA"
                    }
                ],
                "text": {
                    "id": "createDestroyEffect_text_PlayerB_90",
                    "title": [],
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect2, { DefineFn, GameStateFn }) {\n                const cardId2 = DefineFn.EffectFn.getCardID(effect2), cardOwner = GameStateFn.getItemOwner(ctx3, cardId2);\n                return ctx3 = GameStateFn.doItemMove(ctx3, DefineFn.AbsoluteBaSyouFn.of(cardOwner, \"\\u30B8\\u30E3\\u30F3\\u30AF\\u30E4\\u30FC\\u30C9\"), [cardId2, GameStateFn.getItemBaSyou(ctx3, cardId2)], { isSkipTargetMissing: !0 }), ctx3 = GameStateFn.mapItemState(ctx3, cardId2, (is) => {\n                  return {\n                    ...is,\n                    damage: 0\n                  };\n                }), ctx3;\n              }"
                                }
                            ]
                        }
                    ]
                }
            }
        }
    ],
    "messagesCurrentEffect": null,
    "messagesIsPlayerRead": {},
    "turn": 19,
    "setGroup": {
        "itemGroupParent": {
            "PlayerB_104": "PlayerB_74"
        },
        "itemGroupChildren": {
            "PlayerB_74": [
                "PlayerB_104"
            ]
        }
    },
    "stackEffectMemory": [],
    "flowMemory": {
        "state": "playing",
        "hasTriggerEvent": false,
        "hasPlayerPassPhase": {
            "PlayerB": true
        },
        "hasPlayerPassCut": {
            "PlayerB": true,
            "PlayerA": true
        },
        "hasPlayerPassPayCost": {},
        "shouldTriggerStackEffectFinishedEvent": false,
        "activeEffectID": null,
        "activeLogicID": null,
        "activeLogicSubID": null
    }
}