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

export async function testIssue() {
    const whiteSpeed = ["179001_01A_CH_WT007R_white", "179004_01A_CH_WT009R_white", "179004_01A_CH_WT010C_white", "179007_02A_U_WT027U_white", "179007_02A_U_WT027U_white", "179008_02A_U_WT034U_white", "179008_02A_U_WT034U_white", "179008_02A_U_WT034U_white", "179014_03B_CH_WT027R_white", "179015_04B_U_WT067C_white", "179015_04B_U_WT067C_white", "179015_04B_U_WT067C_white", "179016_04B_U_WT074C_white", "179016_04B_U_WT074C_white", "179016_04B_U_WT074C_white", "179016_04B_U_WT075C_white", "179016_04B_U_WT075C_white", "179016_04B_U_WT075C_white", "179019_01A_C_WT010C_white", "179019_01A_C_WT010C_white", "179019_02A_U_WT028R_white", "179019_02A_U_WT028R_white", "179022_06C_CH_WT057R_white", "179022_06C_CH_WT057R_white", "179022_06C_CH_WT057R_white", "179022_06C_U_WT113R_white", "179022_06C_U_WT113R_white", "179022_06C_U_WT113R_white", "179023_06C_CH_WT067C_white", "179024_03B_U_WT057U_white", "179024_03B_U_WT057U_white", "179025_07D_C_WT060U_white", "179025_07D_CH_WT075C_white", "179025_07D_CH_WT075C_white", "179025_07D_CH_WT075C_white", "179027_09D_C_WT067R_white", "179027_09D_C_WT067R_white", "179029_B3C_CH_WT102R_white", "179029_B3C_CH_WT103N_white", "179029_B3C_U_WT196R_white", "179030_11E_C_WT077S_white", "179030_11E_C_WT077S_white", "179030_11E_C_WT077S_white", "179030_11E_CH_WT108N_white", "179901_00_C_WT003P_white", "179901_00_C_WT003P_white", "179901_00_C_WT003P_white", "179901_CG_C_WT001P_white", "179901_CG_C_WT001P_white", "179901_CG_CH_WT002P_white"]
    const blackT3 = ["179015_04B_O_BK010C_black", "179015_04B_O_BK010C_black", "179015_04B_U_BK058R_black", "179015_04B_U_BK058R_black", "179015_04B_U_BK059C_black", "179015_04B_U_BK059C_black", "179015_04B_U_BK061C_black", "179015_04B_U_BK061C_black", "179016_04B_U_BK066C_black", "179016_04B_U_BK066C_black", "179019_02A_C_BK015S_black", "179019_02A_C_BK015S_black", "179020_05C_U_BK100U_black", "179020_05C_U_BK100U_black", "179023_06C_C_BK048R_black", "179023_06C_C_BK048R_black", "179023_06C_C_BK049U_black", "179023_06C_C_BK049U_black", "179024_04B_C_BK027U_black", "179024_04B_C_BK027U_black", "179024_04B_U_BK060C_black", "179024_04B_U_BK060C_black", "179024_04B_U_BK067C_black", "179024_04B_U_BK067C_black", "179024_B2B_C_BK054C_black", "179024_B2B_C_BK054C_black", "179024_B2B_U_BK128S_black_02", "179024_B2B_U_BK128S_black_02", "179024_B2B_U_BK129R_black", "179024_B2B_U_BK129R_black", "179027_09D_C_BK063R_black", "179027_09D_C_BK063R_black", "179027_09D_O_BK010N_black", "179027_09D_O_BK010N_black", "179027_09D_U_BK163S_black", "179027_09D_U_BK163S_black", "179027_09D_U_BK163S_black", "179029_06C_C_BK045U_black", "179029_06C_C_BK045U_black", "179029_B3C_C_BK071N_black", "179029_B3C_C_BK071N_black", "179029_B3C_U_BK184N_black", "179029_B3C_U_BK184N_black", "179029_B3C_U_BK184N_black", "179029_B3C_U_BK185N_black", "179029_B3C_U_BK185N_black", "179030_11E_U_BK194S_2_black", "179030_11E_U_BK194S_2_black", "179030_11E_U_BK194S_2_black", "179901_B2B_C_BK005P_black"]
    await Promise.all([...blackT3, ...whiteSpeed].map(loadPrototype))
    let ctx = TMP_CTX
    if(getActivePlayerID(ctx) != PlayerB){
        throw new Error()
    }
    const effects = createPlayEffects(ctx, PlayerB)
    if(effects.filter(eff=>eff.reason[0]=="PlayCard" && eff.reason[1] == PlayerA).length){
        console.log(effects)
        throw new Error()
    }
    

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
            "isFaceDown": true
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
            "isFaceDown": true
        },
        "PlayerA_6": {
            "id": "PlayerA_6",
            "protoID": "179003_01A_O_WT001C_white",
            "ownerID": "PlayerA",
            "isFaceDown": false,
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
            "isFaceDown": true
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
            "isFaceDown": true
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
            "isFaceDown": true
        },
        "PlayerA_13": {
            "id": "PlayerA_13",
            "protoID": "179003_01A_U_WT011C_white",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_14": {
            "id": "PlayerA_14",
            "protoID": "179003_01A_U_WT011C_white",
            "ownerID": "PlayerA",
            "isFaceDown": true
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
            "isFaceDown": true
        },
        "PlayerA_21": {
            "id": "PlayerA_21",
            "protoID": "179009_03B_U_WT045U_white",
            "ownerID": "PlayerA",
            "isFaceDown": false,
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
            "isFaceDown": true
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
            "isFaceDown": true
        },
        "PlayerA_28": {
            "id": "PlayerA_28",
            "protoID": "179019_01A_U_WT003C_white",
            "ownerID": "PlayerA",
            "isFaceDown": true
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
            "isFaceDown": true
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
            "isFaceDown": true
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
            "isFaceDown": false,
            "isRoll": false
        },
        "PlayerA_36": {
            "id": "PlayerA_36",
            "protoID": "179023_06C_C_WT055C_white",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_37": {
            "id": "PlayerA_37",
            "protoID": "179023_06C_C_WT055C_white",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_38": {
            "id": "PlayerA_38",
            "protoID": "179023_06C_C_WT055C_white",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_39": {
            "id": "PlayerA_39",
            "protoID": "179024_03B_U_WT039R_white",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_40": {
            "id": "PlayerA_40",
            "protoID": "179024_03B_U_WT039R_white",
            "ownerID": "PlayerA",
            "isFaceDown": true,
            "isRoll": false
        },
        "PlayerA_41": {
            "id": "PlayerA_41",
            "protoID": "179024_03B_U_WT039R_white",
            "ownerID": "PlayerA",
            "isFaceDown": true
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
            "isFaceDown": false,
            "isRoll": true
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
            "isFaceDown": true
        },
        "PlayerA_47": {
            "id": "PlayerA_47",
            "protoID": "179027_09D_O_WT014N_white",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_48": {
            "id": "PlayerA_48",
            "protoID": "179027_09D_O_WT014N_white",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_49": {
            "id": "PlayerA_49",
            "protoID": "179027_09D_O_WT014N_white",
            "ownerID": "PlayerA",
            "isFaceDown": false,
            "isRoll": true
        },
        "PlayerA_50": {
            "id": "PlayerA_50",
            "protoID": "179028_10D_CH_WT095_white",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_51": {
            "id": "PlayerA_51",
            "protoID": "179028_10D_U_WT177R_white",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_52": {
            "id": "PlayerA_52",
            "protoID": "179030_11E_C_WT077S_white",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_53": {
            "id": "PlayerA_53",
            "protoID": "179030_11E_C_WT077S_white",
            "ownerID": "PlayerA",
            "isFaceDown": false,
            "isRoll": false
        },
        "PlayerA_54": {
            "id": "PlayerA_54",
            "protoID": "179030_11E_C_WT077S_white",
            "ownerID": "PlayerA",
            "isFaceDown": true
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
            "isFaceDown": true
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
            "isFaceDown": true
        },
        "PlayerA_59": {
            "id": "PlayerA_59",
            "protoID": "179901_00_U_WT001P_white_02",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_60": {
            "id": "PlayerA_60",
            "protoID": "179901_00_U_WT001P_white_02",
            "ownerID": "PlayerA",
            "isFaceDown": false,
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
            "isFaceDown": false,
            "isRoll": false
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
            "isFaceDown": true,
            "isRoll": false
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
            "isFaceDown": true,
            "isRoll": false
        },
        "PlayerB_67": {
            "id": "PlayerB_67",
            "protoID": "179008_02A_U_WT034U_white",
            "ownerID": "PlayerB",
            "isFaceDown": true,
            "isRoll": false
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
            "isFaceDown": false,
            "isRoll": true
        },
        "PlayerB_70": {
            "id": "PlayerB_70",
            "protoID": "179015_04B_U_WT067C_white",
            "ownerID": "PlayerB",
            "isFaceDown": true,
            "isRoll": false
        },
        "PlayerB_71": {
            "id": "PlayerB_71",
            "protoID": "179016_04B_U_WT075C_white",
            "ownerID": "PlayerB",
            "isFaceDown": false,
            "isRoll": false
        },
        "PlayerB_72": {
            "id": "PlayerB_72",
            "protoID": "179015_04B_U_WT067C_white",
            "ownerID": "PlayerB",
            "isFaceDown": false,
            "isRoll": true
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
            "isRoll": false
        },
        "PlayerB_75": {
            "id": "PlayerB_75",
            "protoID": "179016_04B_U_WT074C_white",
            "ownerID": "PlayerB",
            "isFaceDown": true,
            "isRoll": false
        },
        "PlayerB_76": {
            "id": "PlayerB_76",
            "protoID": "179015_04B_U_WT067C_white",
            "ownerID": "PlayerB",
            "isFaceDown": false,
            "isRoll": false
        },
        "PlayerB_77": {
            "id": "PlayerB_77",
            "protoID": "179016_04B_U_WT075C_white",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "PlayerB_78": {
            "id": "PlayerB_78",
            "protoID": "179016_04B_U_WT075C_white",
            "ownerID": "PlayerB",
            "isFaceDown": true,
            "isRoll": false
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
            "isFaceDown": true
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
            "isFaceDown": false,
            "isRoll": false
        },
        "PlayerB_83": {
            "id": "PlayerB_83",
            "protoID": "179022_06C_CH_WT057R_white",
            "ownerID": "PlayerB",
            "isFaceDown": false,
            "isRoll": true
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
            "isRoll": true
        },
        "PlayerB_86": {
            "id": "PlayerB_86",
            "protoID": "179022_06C_U_WT113R_white",
            "ownerID": "PlayerB",
            "isFaceDown": false,
            "isRoll": true
        },
        "PlayerB_87": {
            "id": "PlayerB_87",
            "protoID": "179022_06C_U_WT113R_white",
            "ownerID": "PlayerB",
            "isFaceDown": false,
            "isRoll": true
        },
        "PlayerB_88": {
            "id": "PlayerB_88",
            "protoID": "179022_06C_U_WT113R_white",
            "ownerID": "PlayerB",
            "isFaceDown": true,
            "isRoll": false
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
            "isRoll": true
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
            "isFaceDown": true,
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
            "isFaceDown": true,
            "isRoll": false
        },
        "PlayerB_95": {
            "id": "PlayerB_95",
            "protoID": "179025_07D_CH_WT075C_white",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "PlayerB_96": {
            "id": "PlayerB_96",
            "protoID": "179027_09D_C_WT067R_white",
            "ownerID": "PlayerB",
            "isFaceDown": true
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
            "isFaceDown": false,
            "isRoll": true
        },
        "PlayerB_100": {
            "id": "PlayerB_100",
            "protoID": "179029_B3C_U_WT196R_white",
            "ownerID": "PlayerB",
            "isFaceDown": true,
            "isRoll": false
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
            "isFaceDown": false,
            "isRoll": false
        },
        "PlayerB_103": {
            "id": "PlayerB_103",
            "protoID": "179030_11E_C_WT077S_white",
            "ownerID": "PlayerB",
            "isFaceDown": false,
            "isRoll": false
        },
        "PlayerB_104": {
            "id": "PlayerB_104",
            "protoID": "179030_11E_CH_WT108N_white",
            "ownerID": "PlayerB",
            "isFaceDown": true,
            "isRoll": false
        },
        "PlayerB_105": {
            "id": "PlayerB_105",
            "protoID": "179901_00_C_WT003P_white",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "PlayerB_106": {
            "id": "PlayerB_106",
            "protoID": "179901_00_C_WT003P_white",
            "ownerID": "PlayerB",
            "isFaceDown": true,
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
            "isFaceDown": true
        },
        "PlayerB_110": {
            "id": "PlayerB_110",
            "protoID": "179901_CG_CH_WT002P_white",
            "ownerID": "PlayerB",
            "isFaceDown": true
        }
    },
    "effects": {
        "createDestroyEffect_PlayerB_76": {
            "id": "createDestroyEffect_PlayerB_76",
            "reason": [
                "Destroy",
                "PlayerA",
                "PlayerB_76",
                {
                    "id": "戦闘ダメージ",
                    "playerID": "PlayerA"
                }
            ],
            "text": {
                "id": "createDestroyEffect_text_PlayerB_76",
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
        },
        "createDestroyEffect_PlayerB_74": {
            "id": "createDestroyEffect_PlayerB_74",
            "reason": [
                "Destroy",
                "PlayerA",
                "PlayerB_74",
                {
                    "id": "戦闘ダメージ",
                    "playerID": "PlayerA"
                }
            ],
            "text": {
                "id": "createDestroyEffect_text_PlayerB_74",
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
        },
        "createDestroyEffect_PlayerB_62": {
            "id": "createDestroyEffect_PlayerB_62",
            "reason": [
                "Destroy",
                "PlayerA",
                "PlayerB_62",
                {
                    "id": "戦闘ダメージ",
                    "playerID": "PlayerA"
                }
            ],
            "text": {
                "id": "createDestroyEffect_text_PlayerB_62",
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
        },
        "179023_06C_C_WT055C_white_text_command": {
            "id": "179023_06C_C_WT055C_white_text_command",
            "reason": [
                "PlayCard",
                "PlayerA",
                "PlayerA_38",
                {
                    "isPlayCommand": true
                }
            ],
            "description": "Play パルマ・フィオキーナ",
            "text": {
                "id": "179023_06C_C_WT055C_white_text_command",
                "title": [
                    "使用型",
                    [
                        "ダメージ判定ステップ"
                    ]
                ],
                "description": "Play パルマ・フィオキーナ",
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
                    },
                    "戦闘エリアにいる敵軍ユニット１枚": {
                        "title": [
                            "Entity",
                            {
                                "at": [
                                    "戦闘エリア1",
                                    "戦闘エリア2"
                                ],
                                "side": "敵軍",
                                "is": [
                                    "ユニット"
                                ],
                                "count": 1
                            }
                        ]
                    }
                },
                "logicTreeActions": [
                    {
                        "logicTree": {
                            "type": "And",
                            "children": [
                                {
                                    "type": "Leaf",
                                    "value": "合計国力〔x〕"
                                },
                                {
                                    "type": "Leaf",
                                    "value": "橫置支付0[白]"
                                },
                                {
                                    "type": "Leaf",
                                    "value": "戦闘エリアにいる敵軍ユニット１枚"
                                }
                            ]
                        },
                        "actions": [
                            {
                                "title": "function _(ctx3, effect, { DefineFn, GameStateFn, ToolFn: ToolFn2 }) {\n              const cardId2 = DefineFn.EffectFn.getCardID(effect), prototype2 = GameStateFn.getItemPrototype(ctx3, cardId2);\n              if (prototype2.category == \"\\u30B3\\u30DE\\u30F3\\u30C9\")\n                ;\n              else\n                throw new Error;\n              const commandText2 = prototype2.commandText, from = GameStateFn.getItemBaSyou(ctx3, cardId2);\n              return ctx3 = GameStateFn.doItemMove(ctx3, DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u3044\\u308B\\u30AB\\u30FC\\u30C9\"), [cardId2, from]), GameStateFn.addStackEffect(ctx3, {\n                id: `${effect.id}_\\u5834\\u306B\\u51FA\\u308B`,\n                reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn.EffectFn.getPlayerID(effect), DefineFn.EffectFn.getCardID(effect)],\n                description: effect.text.description,\n                text: {\n                  id: commandText2?.id || `getPlayCardEffects_commentText_${cardId2}`,\n                  description: commandText2?.description || \"unknown\",\n                  title: [],\n                  logicTreeActions: [\n                    {\n                      actions: [\n                        {\n                          title: function _(ctx4, effect2, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                            const cardId3 = DefineFn2.EffectFn.getCardID(effect2), from2 = GameStateFn2.getItemBaSyou(ctx4, cardId3), to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u30B8\\u30E3\\u30F3\\u30AF\\u30E4\\u30FC\\u30C9\");\n                            return ctx4 = GameStateFn2.doItemMove(ctx4, to, [cardId3, from2]), ctx4 = GameStateFn2.doTriggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] }), ctx4;\n                          }.toString()\n                        },\n                        ...commandText2?.logicTreeActions?.[0]?.actions || []\n                      ]\n                    }\n                  ]\n                }\n              });\n            }"
                            }
                        ]
                    }
                ]
            }
        },
        "179019_02A_C_WT012U_white_text_command": {
            "id": "179019_02A_C_WT012U_white_text_command",
            "reason": [
                "PlayCard",
                "PlayerA",
                "PlayerA_30",
                {
                    "isPlayCommand": true
                }
            ],
            "description": "Play 移動弾薬庫",
            "text": {
                "id": "179019_02A_C_WT012U_white_text_command",
                "title": [
                    "使用型",
                    [
                        "ダメージ判定ステップ"
                    ]
                ],
                "description": "Play 移動弾薬庫",
                "conditions": {
                    "合計国力〔x〕": {
                        "actions": [
                            {
                                "title": [
                                    "合計国力〔x〕",
                                    1
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
                    "敵軍部隊１つ": {
                        "title": [
                            "_交戦中の_敵軍部隊_１つ",
                            null,
                            "敵軍",
                            1
                        ]
                    }
                },
                "logicTreeActions": [
                    {
                        "logicTree": {
                            "type": "And",
                            "children": [
                                {
                                    "type": "Leaf",
                                    "value": "合計国力〔x〕"
                                },
                                {
                                    "type": "Leaf",
                                    "value": "橫置支付0[白]"
                                },
                                {
                                    "type": "Leaf",
                                    "value": "敵軍部隊１つ"
                                }
                            ]
                        },
                        "actions": [
                            {
                                "title": "function _(ctx3, effect, { DefineFn, GameStateFn, ToolFn: ToolFn2 }) {\n              const cardId2 = DefineFn.EffectFn.getCardID(effect), prototype2 = GameStateFn.getItemPrototype(ctx3, cardId2);\n              if (prototype2.category == \"\\u30B3\\u30DE\\u30F3\\u30C9\")\n                ;\n              else\n                throw new Error;\n              const commandText2 = prototype2.commandText, from = GameStateFn.getItemBaSyou(ctx3, cardId2);\n              return ctx3 = GameStateFn.doItemMove(ctx3, DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u3044\\u308B\\u30AB\\u30FC\\u30C9\"), [cardId2, from]), GameStateFn.addStackEffect(ctx3, {\n                id: `${effect.id}_\\u5834\\u306B\\u51FA\\u308B`,\n                reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn.EffectFn.getPlayerID(effect), DefineFn.EffectFn.getCardID(effect)],\n                description: effect.text.description,\n                text: {\n                  id: commandText2?.id || `getPlayCardEffects_commentText_${cardId2}`,\n                  description: commandText2?.description || \"unknown\",\n                  title: [],\n                  logicTreeActions: [\n                    {\n                      actions: [\n                        {\n                          title: function _(ctx4, effect2, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                            const cardId3 = DefineFn2.EffectFn.getCardID(effect2), from2 = GameStateFn2.getItemBaSyou(ctx4, cardId3), to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u30B8\\u30E3\\u30F3\\u30AF\\u30E4\\u30FC\\u30C9\");\n                            return ctx4 = GameStateFn2.doItemMove(ctx4, to, [cardId3, from2]), ctx4 = GameStateFn2.doTriggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] }), ctx4;\n                          }.toString()\n                        },\n                        ...commandText2?.logicTreeActions?.[0]?.actions || []\n                      ]\n                    }\n                  ]\n                }\n              });\n            }"
                            }
                        ]
                    }
                ]
            }
        },
        "createPlayEffects_PlayerA_PlayerA_21_loadPrototype_179009_03B_U_WT045U_white_text_1": {
            "id": "createPlayEffects_PlayerA_PlayerA_21_loadPrototype_179009_03B_U_WT045U_white_text_1",
            "reason": [
                "PlayText",
                "PlayerA",
                "PlayerA_21",
                "loadPrototype_179009_03B_U_WT045U_white_text_1"
            ],
            "description": "（常時）〔１〕：自軍手札、または自軍ハンガーにある「特徴：ヴァイエイト系」を持つユニット１枚を、自軍配備エリアにリロール状態で出す。",
            "text": {
                "id": "loadPrototype_179009_03B_U_WT045U_white_text_1",
                "description": "（常時）〔１〕：自軍手札、または自軍ハンガーにある「特徴：ヴァイエイト系」を持つユニット１枚を、自軍配備エリアにリロール状態で出す。",
                "title": [
                    "使用型",
                    [
                        "常時"
                    ]
                ],
                "conditions": {
                    "0[null]": {
                        "title": [
                            "RollColor",
                            null
                        ],
                        "actions": [
                            {
                                "title": [
                                    "_ロールする",
                                    "ロール"
                                ],
                                "vars": [
                                    "0[null]"
                                ]
                            }
                        ]
                    },
                    "自軍手札、または自軍ハンガーにある「特徴：ヴァイエイト系」を持つユニット１枚": {
                        "title": [
                            "Entity",
                            {
                                "side": "自軍",
                                "at": [
                                    "手札",
                                    "ハンガー"
                                ],
                                "hasChar": [
                                    "ヴァイエイト系"
                                ],
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
                                    "cutIn",
                                    [
                                        {
                                            "title": [
                                                "_の_ハンガーに移す",
                                                "自軍",
                                                "配備エリア"
                                            ],
                                            "vars": [
                                                "自軍手札、または自軍ハンガーにある「特徴：ヴァイエイト系」を持つユニット１枚"
                                            ]
                                        }
                                    ]
                                ]
                            }
                        ]
                    }
                ]
            }
        },
        "createPlayEffects_PlayerA_PlayerA_21_loadPrototype_179009_03B_U_WT045U_white_text_2": {
            "id": "createPlayEffects_PlayerA_PlayerA_21_loadPrototype_179009_03B_U_WT045U_white_text_2",
            "reason": [
                "PlayText",
                "PlayerA",
                "PlayerA_21",
                "loadPrototype_179009_03B_U_WT045U_white_text_2"
            ],
            "description": "（戦闘フェイズ）：［ ］の特徴を持つ自軍ユニット１枚は、ターン終了時まで、このカードの本来のテキスト１つと同じテキストを得る。ただし同じテキストは得られない）",
            "text": {
                "id": "loadPrototype_179009_03B_U_WT045U_white_text_2",
                "title": [
                    "使用型",
                    [
                        "戦闘フェイズ"
                    ]
                ],
                "description": "（戦闘フェイズ）：［ ］の特徴を持つ自軍ユニット１枚は、ターン終了時まで、このカードの本来のテキスト１つと同じテキストを得る。ただし同じテキストは得られない）",
                "conditions": {
                    "橫置支付0[null]": {
                        "title": [
                            "RollColor",
                            null
                        ],
                        "actions": [
                            {
                                "title": [
                                    "_ロールする",
                                    "ロール"
                                ],
                                "vars": [
                                    "橫置支付0[null]"
                                ]
                            }
                        ],
                        "groupKey": "支付橫置國力"
                    },
                    "橫置支付1[null]": {
                        "title": [
                            "RollColor",
                            null
                        ],
                        "actions": [
                            {
                                "title": [
                                    "_ロールする",
                                    "ロール"
                                ],
                                "vars": [
                                    "橫置支付1[null]"
                                ]
                            }
                        ],
                        "groupKey": "支付橫置國力"
                    },
                    "このカードの本来のテキスト１つ": {
                        "title": [
                            "このカードの_本来のテキスト１つ",
                            true,
                            1
                        ]
                    },
                    "［ ］の特徴を持つ自軍ユニット１枚は": {
                        "title": [
                            "_本来の記述に｢特徴：_装弾｣を持つ_自軍_G_１枚",
                            false,
                            "ヴァイエイト系",
                            "自軍",
                            "ユニット",
                            1
                        ],
                        "exceptItemSelf": true,
                        "actions": [
                            {
                                "title": "function _(ctx3, effect, { GameStateFn, DefineFn }) {\n                    const cardId2 = DefineFn.EffectFn.getCardID(effect), pairs = GameStateFn.getCardTipStrBaSyouPairs(ctx3, \"\\uFF3B \\uFF3D\\u306E\\u7279\\u5FB4\\u3092\\u6301\\u3064\\u81EA\\u8ECD\\u30E6\\u30CB\\u30C3\\u30C8\\uFF11\\u679A\\u306F\", cardId2), textRefIds = GameStateFn.getCardTipTextRefs(ctx3, \"\\u3053\\u306E\\u30AB\\u30FC\\u30C9\\u306E\\u672C\\u6765\\u306E\\u30C6\\u30AD\\u30B9\\u30C8\\uFF11\\u3064\", cardId2).map((tr) => tr.textId);\n                    for (let pair2 of pairs)\n                      if (GameStateFn.getCardTexts(ctx3, pair2[0]).find((text2) => textRefIds.includes(text2.id)))\n                        throw new DefineFn.TipError(`\\u5DF2\\u6709\\u540C\\u6A23\\u7684\\u5167\\u6587: ${JSON.stringify(textRefIds)}`, { hasSameText: !0 });\n                    return ctx3;\n                  }"
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
                                    "cutIn",
                                    [
                                        {
                                            "title": "function _(ctx3, effect, { GameStateFn, DefineFn }) {\n                        const cardId2 = DefineFn.EffectFn.getCardID(effect), pairs = GameStateFn.getCardTipStrBaSyouPairs(ctx3, \"\\uFF3B \\uFF3D\\u306E\\u7279\\u5FB4\\u3092\\u6301\\u3064\\u81EA\\u8ECD\\u30E6\\u30CB\\u30C3\\u30C8\\uFF11\\u679A\\u306F\", cardId2), textRefs = GameStateFn.getCardTipTextRefs(ctx3, \"\\u3053\\u306E\\u30AB\\u30FC\\u30C9\\u306E\\u672C\\u6765\\u306E\\u30C6\\u30AD\\u30B9\\u30C8\\uFF11\\u3064\", cardId2);\n                        for (let pair2 of pairs) {\n                          GameStateFn.assertTargetMissingError(ctx3, pair2);\n                          const [targetCardId, targetBasyou] = pair2;\n                          ctx3 = GameStateFn.mapItemState(ctx3, targetCardId, (targetItemState) => {\n                            for (let textRef of textRefs) {\n                              if (GameStateFn.getCardTexts(ctx3, targetItemState.id).find((text2) => text2.id == textRef.textId) != null)\n                                continue;\n                              targetItemState = DefineFn.ItemStateFn.setGlobalEffect(targetItemState, null, {\n                                title: [\"AddTextRef\", textRef],\n                                cardIds: [targetItemState.id]\n                              }, { isRemoveOnTurnEnd: !0 });\n                            }\n                            return targetItemState;\n                          });\n                        }\n                        return ctx3;\n                      }"
                                        }
                                    ]
                                ]
                            }
                        ]
                    }
                ]
            }
        },
        "createPlayEffects_PlayerA_PlayerA_60_loadPrototype_179901_00_U_WT001P_white_02_text_0": {
            "id": "createPlayEffects_PlayerA_PlayerA_60_loadPrototype_179901_00_U_WT001P_white_02_text_0",
            "reason": [
                "PlayText",
                "PlayerA",
                "PlayerA_60",
                "loadPrototype_179901_00_U_WT001P_white_02_text_0"
            ],
            "description": "（戦闘フェイズ）〔２〕：このカードと交戦中の敵軍ユニットが破壊されている場合、G以外の敵軍カード１枚を破壊する。",
            "text": {
                "id": "loadPrototype_179901_00_U_WT001P_white_02_text_0",
                "description": "（戦闘フェイズ）〔２〕：このカードと交戦中の敵軍ユニットが破壊されている場合、G以外の敵軍カード１枚を破壊する。",
                "title": [
                    "使用型",
                    [
                        "戦闘フェイズ"
                    ]
                ],
                "conditions": {
                    "0[null]": {
                        "title": [
                            "RollColor",
                            null
                        ],
                        "actions": [
                            {
                                "title": [
                                    "_ロールする",
                                    "ロール"
                                ],
                                "vars": [
                                    "0[null]"
                                ]
                            }
                        ]
                    },
                    "1[null]": {
                        "title": [
                            "RollColor",
                            null
                        ],
                        "actions": [
                            {
                                "title": [
                                    "_ロールする",
                                    "ロール"
                                ],
                                "vars": [
                                    "1[null]"
                                ]
                            }
                        ]
                    },
                    "このカードと交戦中の敵軍ユニットが破壊されている場合": {
                        "actions": [
                            {
                                "title": [
                                    "Entity",
                                    {
                                        "isBattleWithThis": true,
                                        "isDestroy": true,
                                        "side": "敵軍",
                                        "is": [
                                            "ユニット"
                                        ],
                                        "min": 1
                                    }
                                ]
                            }
                        ]
                    },
                    "G以外の敵軍カード１枚": {
                        "title": [
                            "Entity",
                            {
                                "atBa": true,
                                "is": [
                                    "ACE",
                                    "オペレーション",
                                    "オペレーション(ユニット)",
                                    "キャラクター",
                                    "コマンド",
                                    "ユニット"
                                ],
                                "side": "敵軍",
                                "isDestroy": false,
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
                                    "cutIn",
                                    [
                                        {
                                            "title": [
                                                "_ロールする",
                                                "破壞"
                                            ],
                                            "vars": [
                                                "G以外の敵軍カード１枚"
                                            ]
                                        }
                                    ]
                                ]
                            }
                        ]
                    }
                ]
            }
        },
        "createPlayEffects_PlayerA_PlayerA_60_loadPrototype_179901_00_U_WT001P_white_02_text_3": {
            "id": "createPlayEffects_PlayerA_PlayerA_60_loadPrototype_179901_00_U_WT001P_white_02_text_3",
            "reason": [
                "PlayText",
                "PlayerA",
                "PlayerA_60",
                "loadPrototype_179901_00_U_WT001P_white_02_text_3"
            ],
            "description": "和這張卡交戰的防禦力x以下的敵軍機體1張破壞",
            "text": {
                "id": "loadPrototype_179901_00_U_WT001P_white_02_text_3",
                "title": [
                    "使用型",
                    [
                        "ダメージ判定ステップ"
                    ]
                ],
                "description": "和這張卡交戰的防禦力x以下的敵軍機體1張破壞",
                "conditions": {
                    "橫置支付0[null]": {
                        "title": [
                            "RollColor",
                            null
                        ],
                        "actions": [
                            {
                                "title": [
                                    "_ロールする",
                                    "ロール"
                                ],
                                "vars": [
                                    "橫置支付0[null]"
                                ]
                            }
                        ],
                        "groupKey": "支付橫置國力"
                    },
                    "這張卡交戰的防禦力x以下的敵軍機體1張": {
                        "title": [
                            "Entity",
                            {
                                "isBattleWithThis": true,
                                "compareBattlePoint": [
                                    "防御力",
                                    "<=",
                                    3
                                ],
                                "isDestroy": false,
                                "side": "敵軍",
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
                                    "cutIn",
                                    [
                                        {
                                            "title": [
                                                "_ロールする",
                                                "破壞"
                                            ],
                                            "vars": [
                                                "這張卡交戰的防禦力x以下的敵軍機體1張"
                                            ]
                                        }
                                    ]
                                ]
                            }
                        ]
                    }
                ]
            }
        },
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
        "createPlayEffects_PlayerA_PlayerA_43_loadPrototype_179024_03B_U_WT042U_white_text_1": {
            "id": "createPlayEffects_PlayerA_PlayerA_43_loadPrototype_179024_03B_U_WT042U_white_text_1",
            "reason": [
                "PlayText",
                "PlayerA",
                "PlayerA_43",
                "loadPrototype_179024_03B_U_WT042U_white_text_1"
            ],
            "description": "打開自軍手裡或指定HANGER中特徵A並合計國力x以下的1張卡, 和這張卡重置狀態置換, 這張卡置換後廢棄. x為自軍G的張數",
            "text": {
                "id": "loadPrototype_179024_03B_U_WT042U_white_text_1",
                "title": [
                    "使用型",
                    [
                        "戦闘フェイズ"
                    ]
                ],
                "description": "打開自軍手裡或指定HANGER中特徵A並合計國力x以下的1張卡, 和這張卡重置狀態置換, 這張卡置換後廢棄. x為自軍G的張數",
                "conditions": {
                    "打開自軍手裡或指定HANGER中特徵A並合計國力x以下的1張卡": {
                        "title": "function _(ctx3, effect, bridge) {\n                const { A: A2 } = {\"A\":\"シェンロン系\"};\n                if (A2 == \"\")\n                  throw new Error(\"A\\u6C92\\u6709\\u88AB\\u5B57\\u4E32\\u7F6E\\u63DB\");\n                const { GameStateFn, DefineFn } = bridge, cardId2 = DefineFn.EffectFn.getCardID(effect), cardController = GameStateFn.getItemController(ctx3, cardId2), gCount = GameStateFn.getItemIdsByBasyou(ctx3, DefineFn.AbsoluteBaSyouFn.of(cardController, \"G\\u30BE\\u30FC\\u30F3\")).length;\n                return GameStateFn.createConditionTitleFn({\n                  title: [\"\\u6253\\u958B\\u81EA\\u8ECD\\u624B\\u88E1\\u6216\\u6307\\u5B9AHANGER\\u4E2D\\u7279\\u5FB5_A\\u4E26\\u5408\\u8A08\\u570B\\u529B_x\\u4EE5\\u4E0B\\u7684_1\\u5F35\\u5361\", A2, gCount, 1]\n                }, {})(ctx3, effect, bridge);\n              }"
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
        "179025_07D_C_WT060U_white_text_command": {
            "id": "179025_07D_C_WT060U_white_text_command",
            "reason": [
                "PlayCard",
                "PlayerB",
                "PlayerB_92",
                {
                    "isPlayCommand": true
                }
            ],
            "description": "Play 巨なる力",
            "text": {
                "id": "179025_07D_C_WT060U_white_text_command",
                "title": [
                    "使用型",
                    [
                        "戦闘フェイズ"
                    ]
                ],
                "description": "Play 巨なる力",
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
                    "自軍ユニット１～２枚": {
                        "title": [
                            "Entity",
                            {
                                "at": [
                                    "戦闘エリア1",
                                    "戦闘エリア2",
                                    "配備エリア"
                                ],
                                "side": "自軍",
                                "is": [
                                    "ユニット"
                                ],
                                "min": 1,
                                "max": 2
                            }
                        ]
                    }
                },
                "logicTreeActions": [
                    {
                        "logicTree": {
                            "type": "And",
                            "children": [
                                {
                                    "type": "Leaf",
                                    "value": "合計国力〔x〕"
                                },
                                {
                                    "type": "Leaf",
                                    "value": "橫置支付0[白]"
                                },
                                {
                                    "type": "Leaf",
                                    "value": "自軍ユニット１～２枚"
                                }
                            ]
                        },
                        "actions": [
                            {
                                "title": "function _(ctx3, effect, { DefineFn, GameStateFn, ToolFn: ToolFn2 }) {\n              const cardId2 = DefineFn.EffectFn.getCardID(effect), prototype2 = GameStateFn.getItemPrototype(ctx3, cardId2);\n              if (prototype2.category == \"\\u30B3\\u30DE\\u30F3\\u30C9\")\n                ;\n              else\n                throw new Error;\n              const commandText2 = prototype2.commandText, from = GameStateFn.getItemBaSyou(ctx3, cardId2);\n              return ctx3 = GameStateFn.doItemMove(ctx3, DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u3044\\u308B\\u30AB\\u30FC\\u30C9\"), [cardId2, from]), GameStateFn.addStackEffect(ctx3, {\n                id: `${effect.id}_\\u5834\\u306B\\u51FA\\u308B`,\n                reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn.EffectFn.getPlayerID(effect), DefineFn.EffectFn.getCardID(effect)],\n                description: effect.text.description,\n                text: {\n                  id: commandText2?.id || `getPlayCardEffects_commentText_${cardId2}`,\n                  description: commandText2?.description || \"unknown\",\n                  title: [],\n                  logicTreeActions: [\n                    {\n                      actions: [\n                        {\n                          title: function _(ctx4, effect2, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                            const cardId3 = DefineFn2.EffectFn.getCardID(effect2), from2 = GameStateFn2.getItemBaSyou(ctx4, cardId3), to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u30B8\\u30E3\\u30F3\\u30AF\\u30E4\\u30FC\\u30C9\");\n                            return ctx4 = GameStateFn2.doItemMove(ctx4, to, [cardId3, from2]), ctx4 = GameStateFn2.doTriggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] }), ctx4;\n                          }.toString()\n                        },\n                        ...commandText2?.logicTreeActions?.[0]?.actions || []\n                      ]\n                    }\n                  ]\n                }\n              });\n            }"
                            }
                        ]
                    }
                ]
            }
        },
        "createPlayEffects_PlayerB_PlayerB_76_loadPrototype_179015_04B_U_WT067C_white_text_1": {
            "id": "createPlayEffects_PlayerB_PlayerB_76_loadPrototype_179015_04B_U_WT067C_white_text_1",
            "reason": [
                "PlayText",
                "PlayerB",
                "PlayerB_76",
                "loadPrototype_179015_04B_U_WT067C_white_text_1"
            ],
            "description": "打開自軍手裡或指定HANGER中特徵A並合計國力x以下的1張卡, 和這張卡重置狀態置換, 這張卡置換後廢棄. x為自軍G的張數",
            "text": {
                "id": "loadPrototype_179015_04B_U_WT067C_white_text_1",
                "title": [
                    "使用型",
                    [
                        "戦闘フェイズ"
                    ]
                ],
                "description": "打開自軍手裡或指定HANGER中特徵A並合計國力x以下的1張卡, 和這張卡重置狀態置換, 這張卡置換後廢棄. x為自軍G的張數",
                "conditions": {
                    "打開自軍手裡或指定HANGER中特徵A並合計國力x以下的1張卡": {
                        "title": "function _(ctx3, effect, bridge) {\n                const { A: A2 } = {\"A\":\"ブルーフレーム系\"};\n                if (A2 == \"\")\n                  throw new Error(\"A\\u6C92\\u6709\\u88AB\\u5B57\\u4E32\\u7F6E\\u63DB\");\n                const { GameStateFn, DefineFn } = bridge, cardId2 = DefineFn.EffectFn.getCardID(effect), cardController = GameStateFn.getItemController(ctx3, cardId2), gCount = GameStateFn.getItemIdsByBasyou(ctx3, DefineFn.AbsoluteBaSyouFn.of(cardController, \"G\\u30BE\\u30FC\\u30F3\")).length;\n                return GameStateFn.createConditionTitleFn({\n                  title: [\"\\u6253\\u958B\\u81EA\\u8ECD\\u624B\\u88E1\\u6216\\u6307\\u5B9AHANGER\\u4E2D\\u7279\\u5FB5_A\\u4E26\\u5408\\u8A08\\u570B\\u529B_x\\u4EE5\\u4E0B\\u7684_1\\u5F35\\u5361\", A2, gCount, 1]\n                }, {})(ctx3, effect, bridge);\n              }"
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
        "createPlayEffects_PlayerB_PlayerB_76_loadPrototype_179015_04B_U_WT067C_white_text_2": {
            "id": "createPlayEffects_PlayerB_PlayerB_76_loadPrototype_179015_04B_U_WT067C_white_text_2",
            "reason": [
                "PlayText",
                "PlayerB",
                "PlayerB_76",
                "loadPrototype_179015_04B_U_WT067C_white_text_2"
            ],
            "description": "（戦闘フェイズ）：［ ］の特徴を持つ自軍ユニット１枚は、ターン終了時まで、このカードの本来のテキスト１つと同じテキストを得る。ただし同じテキストは得られない）",
            "text": {
                "id": "loadPrototype_179015_04B_U_WT067C_white_text_2",
                "title": [
                    "使用型",
                    [
                        "戦闘フェイズ"
                    ]
                ],
                "description": "（戦闘フェイズ）：［ ］の特徴を持つ自軍ユニット１枚は、ターン終了時まで、このカードの本来のテキスト１つと同じテキストを得る。ただし同じテキストは得られない）",
                "conditions": {
                    "橫置支付0[null]": {
                        "title": [
                            "RollColor",
                            null
                        ],
                        "actions": [
                            {
                                "title": [
                                    "_ロールする",
                                    "ロール"
                                ],
                                "vars": [
                                    "橫置支付0[null]"
                                ]
                            }
                        ],
                        "groupKey": "支付橫置國力"
                    },
                    "橫置支付1[null]": {
                        "title": [
                            "RollColor",
                            null
                        ],
                        "actions": [
                            {
                                "title": [
                                    "_ロールする",
                                    "ロール"
                                ],
                                "vars": [
                                    "橫置支付1[null]"
                                ]
                            }
                        ],
                        "groupKey": "支付橫置國力"
                    },
                    "このカードの本来のテキスト１つ": {
                        "title": [
                            "このカードの_本来のテキスト１つ",
                            true,
                            1
                        ]
                    },
                    "［ ］の特徴を持つ自軍ユニット１枚は": {
                        "title": [
                            "_本来の記述に｢特徴：_装弾｣を持つ_自軍_G_１枚",
                            false,
                            "アストレイ系",
                            "自軍",
                            "ユニット",
                            1
                        ],
                        "exceptItemSelf": true,
                        "actions": [
                            {
                                "title": "function _(ctx3, effect, { GameStateFn, DefineFn }) {\n                    const cardId2 = DefineFn.EffectFn.getCardID(effect), pairs = GameStateFn.getCardTipStrBaSyouPairs(ctx3, \"\\uFF3B \\uFF3D\\u306E\\u7279\\u5FB4\\u3092\\u6301\\u3064\\u81EA\\u8ECD\\u30E6\\u30CB\\u30C3\\u30C8\\uFF11\\u679A\\u306F\", cardId2), textRefIds = GameStateFn.getCardTipTextRefs(ctx3, \"\\u3053\\u306E\\u30AB\\u30FC\\u30C9\\u306E\\u672C\\u6765\\u306E\\u30C6\\u30AD\\u30B9\\u30C8\\uFF11\\u3064\", cardId2).map((tr) => tr.textId);\n                    for (let pair2 of pairs)\n                      if (GameStateFn.getCardTexts(ctx3, pair2[0]).find((text2) => textRefIds.includes(text2.id)))\n                        throw new DefineFn.TipError(`\\u5DF2\\u6709\\u540C\\u6A23\\u7684\\u5167\\u6587: ${JSON.stringify(textRefIds)}`, { hasSameText: !0 });\n                    return ctx3;\n                  }"
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
                                    "cutIn",
                                    [
                                        {
                                            "title": "function _(ctx3, effect, { GameStateFn, DefineFn }) {\n                        const cardId2 = DefineFn.EffectFn.getCardID(effect), pairs = GameStateFn.getCardTipStrBaSyouPairs(ctx3, \"\\uFF3B \\uFF3D\\u306E\\u7279\\u5FB4\\u3092\\u6301\\u3064\\u81EA\\u8ECD\\u30E6\\u30CB\\u30C3\\u30C8\\uFF11\\u679A\\u306F\", cardId2), textRefs = GameStateFn.getCardTipTextRefs(ctx3, \"\\u3053\\u306E\\u30AB\\u30FC\\u30C9\\u306E\\u672C\\u6765\\u306E\\u30C6\\u30AD\\u30B9\\u30C8\\uFF11\\u3064\", cardId2);\n                        for (let pair2 of pairs) {\n                          GameStateFn.assertTargetMissingError(ctx3, pair2);\n                          const [targetCardId, targetBasyou] = pair2;\n                          ctx3 = GameStateFn.mapItemState(ctx3, targetCardId, (targetItemState) => {\n                            for (let textRef of textRefs) {\n                              if (GameStateFn.getCardTexts(ctx3, targetItemState.id).find((text2) => text2.id == textRef.textId) != null)\n                                continue;\n                              targetItemState = DefineFn.ItemStateFn.setGlobalEffect(targetItemState, null, {\n                                title: [\"AddTextRef\", textRef],\n                                cardIds: [targetItemState.id]\n                              }, { isRemoveOnTurnEnd: !0 });\n                            }\n                            return targetItemState;\n                          });\n                        }\n                        return ctx3;\n                      }"
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
                "PlayerA_55",
                "PlayerA_3",
                "PlayerA_24",
                "PlayerA_28",
                "PlayerA_27",
                "PlayerA_14",
                "PlayerA_33",
                "PlayerA_45",
                "PlayerA_2",
                "PlayerA_54",
                "PlayerA_59",
                "PlayerA_9",
                "PlayerA_31",
                "PlayerA_52",
                "PlayerA_4",
                "PlayerA_29",
                "PlayerA_58",
                "PlayerA_57",
                "PlayerA_47",
                "PlayerA_5",
                "PlayerA_50",
                "PlayerA_13",
                "PlayerA_51",
                "PlayerA_8",
                "PlayerA_39",
                "PlayerA_19",
                "PlayerA_46",
                "PlayerA_36",
                "PlayerA_34",
                "PlayerA_0",
                "PlayerA_20",
                "PlayerA_26",
                "PlayerA_1",
                "PlayerA_12",
                "PlayerA_48",
                "PlayerA_37",
                "PlayerA_23",
                "PlayerA_44",
                "PlayerA_10",
                "PlayerA_18",
                "PlayerA_41",
                "PlayerA_56"
            ],
            "[\"PlayerB\",\"本国\"]": [
                "PlayerB_89",
                "PlayerB_79",
                "PlayerB_65",
                "PlayerB_63",
                "PlayerB_109",
                "PlayerB_96",
                "PlayerB_110",
                "PlayerB_108",
                "PlayerB_95",
                "PlayerB_97",
                "PlayerB_93",
                "PlayerB_91",
                "PlayerB_77",
                "PlayerB_80",
                "PlayerB_98",
                "PlayerB_84",
                "PlayerB_101",
                "PlayerB_105",
                "PlayerB_81"
            ],
            "[\"PlayerA\",\"手札\"]": [
                "PlayerA_38",
                "PlayerA_30"
            ],
            "[\"PlayerB\",\"手札\"]": [
                "PlayerB_107",
                "PlayerB_104",
                "PlayerB_73",
                "PlayerB_92"
            ],
            "[\"PlayerA\",\"Gゾーン\"]": [
                "PlayerA_49",
                "PlayerA_6",
                "PlayerA_35",
                "PlayerA_32",
                "PlayerA_11",
                "PlayerA_53"
            ],
            "[\"PlayerB\",\"Gゾーン\"]": [
                "PlayerB_69",
                "PlayerB_72",
                "PlayerB_83",
                "PlayerB_87",
                "PlayerB_86",
                "PlayerB_90",
                "PlayerB_85",
                "PlayerB_99"
            ],
            "[\"PlayerA\",\"プレイされているカード\"]": [],
            "[\"PlayerA\",\"配備エリア\"]": [
                "PlayerA_7",
                "PlayerA_43"
            ],
            "[\"PlayerB\",\"プレイされているカード\"]": [],
            "[\"PlayerB\",\"配備エリア\"]": [
                "PlayerB_82"
            ],
            "[\"PlayerA\",\"戦闘エリア1\"]": [
                "PlayerA_21"
            ],
            "[\"PlayerB\",\"捨て山\"]": [
                "PlayerB_94",
                "PlayerB_75",
                "PlayerB_64",
                "PlayerB_88",
                "PlayerB_61",
                "PlayerB_78",
                "PlayerB_106",
                "PlayerB_67",
                "PlayerB_100",
                "PlayerB_70",
                "PlayerB_66"
            ],
            "[\"PlayerB\",\"戦闘エリア1\"]": [
                "PlayerB_76"
            ],
            "[\"PlayerA\",\"捨て山\"]": [
                "PlayerA_25",
                "PlayerA_42",
                "PlayerA_17",
                "PlayerA_40",
                "PlayerA_22",
                "PlayerA_16",
                "PlayerA_15"
            ],
            "[\"PlayerB\",\"ジャンクヤード\"]": [
                "PlayerB_103",
                "PlayerB_71",
                "PlayerB_68",
                "PlayerB_102"
            ],
            "[\"PlayerB\",\"戦闘エリア2\"]": [
                "PlayerB_74",
                "PlayerB_62"
            ],
            "[\"PlayerA\",\"戦闘エリア2\"]": [
                "PlayerA_60"
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
                "去地球": {
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
                        [],
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
        "PlayerA_21": {
            "id": "PlayerA_21",
            "damage": 1,
            "destroyReason": null,
            "flags": {},
            "tips": {
                "橫置支付0[白]": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerA_49",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_6",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_35",
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
                                "PlayerA_49",
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
                                "PlayerA_6",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_35",
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
                                "PlayerA_6",
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
                                "PlayerA_35",
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
                                "PlayerA_35",
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
                                "PlayerA_49",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_6",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_35",
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
            "isDefence": true
        },
        "PlayerB_74": {
            "id": "PlayerB_74",
            "damage": 2,
            "destroyReason": {
                "id": "戦闘ダメージ",
                "playerID": "PlayerA"
            },
            "flags": {},
            "tips": {
                "橫置支付0[白]": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerB_69",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_72",
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
                                "PlayerB_69",
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
                                "PlayerB_69",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_72",
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
                },
                "橫置支付0[null]": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerB_72",
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
                                "PlayerB_87",
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
                                "PlayerB_72",
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
                                "PlayerB_87",
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
                    ],
                    "min": 1
                }
            },
            "globalEffects": {
                "setGlobalEffect_01928ac5-bfbe-7118-927d-c5e23932a744": {
                    "title": [
                        "AddTextRef",
                        {
                            "cardId": "PlayerB_76",
                            "textId": "loadPrototype_179015_04B_U_WT067C_white_text_0"
                        }
                    ],
                    "cardIds": [
                        "PlayerB_74"
                    ]
                }
            },
            "varNamesRemoveOnTurnEnd": {
                "setGlobalEffect_01928ac5-bfbe-7118-927d-c5e23932a744": true
            },
            "isFirstTurn": false,
            "isOpenForGain": false,
            "isCheat": false,
            "textIdsUseThisTurn": [],
            "isAttack": true,
            "isDefence": false
        },
        "PlayerA_43": {
            "id": "PlayerA_43",
            "damage": 0,
            "destroyReason": null,
            "flags": {},
            "tips": {
                "橫置支付0[白]": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerA_49",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_6",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_35",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_32",
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
                                "PlayerA_49",
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
                                "PlayerA_49",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_6",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_35",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_32",
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
                "0[null]": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerA_49",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_6",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_35",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_32",
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
                                "PlayerA_53",
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
                                "PlayerA_49",
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
                "このカードが非交戦中の場合、敵軍ユニット１枚": {
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
                                "PlayerB_76",
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
                                "PlayerB_76",
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
            "globalEffects": {},
            "varNamesRemoveOnTurnEnd": {},
            "isFirstTurn": false,
            "textIdsUseThisTurn": [],
            "isOpenForGain": false,
            "isCheat": false,
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
                                "PlayerA_60",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "配備エリア"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_21",
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
                                "PlayerA_21",
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
                                "PlayerA_60",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "配備エリア"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_21",
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
                                "PlayerA_60",
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
        "PlayerB_68": {
            "id": "PlayerB_68",
            "damage": 0,
            "destroyReason": null,
            "flags": {},
            "tips": {
                "橫置支付0[白]": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerB_69",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_72",
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
                                "PlayerB_87",
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
                                "PlayerB_69",
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
                                "PlayerB_69",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_72",
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
                                "PlayerA_49",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_6",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_35",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_32",
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
                },
                "0[白]": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerA_32",
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
                                "PlayerA_32",
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
                    ],
                    "min": 1
                },
                "自軍ユニット１枚": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerA_43",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "配備エリア"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_60",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "配備エリア"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_21",
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
                                "PlayerA_43",
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
                                    "PlayerA_43"
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
                                    "PlayerA_43"
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
        "PlayerA_60": {
            "id": "PlayerA_60",
            "damage": 2,
            "destroyReason": null,
            "flags": {},
            "tips": {
                "橫置支付0[白]": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerA_49",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_6",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_35",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_32",
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
                                "PlayerA_49",
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
                                "PlayerA_6",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_35",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_32",
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
                                "PlayerA_6",
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
                                "PlayerA_35",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_32",
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
                                "PlayerA_35",
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
                                "PlayerA_49",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_6",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_35",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_32",
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
            "isDefence": true
        },
        "PlayerB_76": {
            "id": "PlayerB_76",
            "damage": 3,
            "destroyReason": {
                "id": "戦闘ダメージ",
                "playerID": "PlayerA"
            },
            "flags": {},
            "tips": {
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
                                        "配備エリア"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_82",
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
                "このカードの本来のテキスト１つ": {
                    "title": [
                        "テキスト",
                        [
                            {
                                "cardId": "PlayerB_76",
                                "textId": "loadPrototype_179015_04B_U_WT067C_white_text_0"
                            },
                            {
                                "cardId": "PlayerB_76",
                                "textId": "loadPrototype_179015_04B_U_WT067C_white_text_1"
                            }
                        ],
                        [
                            {
                                "cardId": "PlayerB_76",
                                "textId": "loadPrototype_179015_04B_U_WT067C_white_text_0"
                            }
                        ]
                    ],
                    "count": 1
                },
                "橫置支付0[null]": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerB_90",
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
                            ]
                        ],
                        [
                            [
                                "PlayerB_90",
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
                                "PlayerB_85",
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
                }
            },
            "globalEffects": {},
            "varNamesRemoveOnTurnEnd": {},
            "isAttack": true,
            "isDefence": false,
            "isOpenForGain": false,
            "isCheat": false,
            "isFirstTurn": false,
            "textIdsUseThisTurn": [
                "loadPrototype_179015_04B_U_WT067C_white_text_2"
            ]
        },
        "PlayerB_103": {
            "id": "PlayerB_103",
            "damage": 0,
            "destroyReason": null,
            "flags": {},
            "tips": {
                "自軍捨て山の上のカード１枚": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerB_90",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "捨て山"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_99",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "捨て山"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_94",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "捨て山"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_75",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "捨て山"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_64",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "捨て山"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_88",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "捨て山"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_61",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "捨て山"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_78",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "捨て山"
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
                                        "捨て山"
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
                                "PlayerB_86",
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
                    ],
                    "min": 1
                },
                "橫置支付1[白]": {
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
                                "PlayerB_86",
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
                                "PlayerB_86",
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
        "PlayerB_71": {
            "id": "PlayerB_71",
            "damage": 0,
            "destroyReason": null,
            "flags": {},
            "tips": {
                "橫置支付0[白]": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerB_69",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_72",
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
                                "PlayerB_86",
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
                                "PlayerB_69",
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
                                "PlayerB_72",
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
                                "PlayerB_86",
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
                                "PlayerB_72",
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
                                "PlayerB_69",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_72",
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
                                "PlayerB_86",
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
        "PlayerB_82": {
            "id": "PlayerB_82",
            "damage": 0,
            "destroyReason": null,
            "flags": {},
            "tips": {
                "橫置支付1[白]": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerB_72",
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
                                "PlayerB_86",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_90",
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
                            ]
                        ],
                        [
                            [
                                "PlayerB_72",
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
                                "PlayerB_69",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_72",
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
                                "PlayerB_86",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_90",
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
                            ]
                        ],
                        [
                            [
                                "PlayerB_69",
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
                                "PlayerB_69",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_72",
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
                                "PlayerB_86",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_90",
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
                            ]
                        ]
                    ]
                }
            },
            "globalEffects": {},
            "varNamesRemoveOnTurnEnd": {},
            "isFirstTurn": true
        },
        "PlayerB_62": {
            "id": "PlayerB_62",
            "damage": 0,
            "destroyReason": {
                "id": "戦闘ダメージ",
                "playerID": "PlayerA"
            },
            "flags": {},
            "tips": {
                "橫置支付0[白]": {
                    "title": [
                        "カード",
                        [
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
                                "PlayerB_86",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_90",
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
                            ]
                        ],
                        [
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
                    ],
                    "min": 1
                },
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
                                "PlayerB_76",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "配備エリア"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_82",
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
                "合計国力〔x〕": {
                    "title": [
                        "カード",
                        [],
                        [
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
                                "PlayerB_86",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_90",
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
                            ]
                        ]
                    ]
                }
            },
            "globalEffects": {},
            "varNamesRemoveOnTurnEnd": {},
            "isFirstTurn": true
        },
        "PlayerB_102": {
            "id": "PlayerB_102",
            "damage": 0,
            "destroyReason": null,
            "flags": {},
            "tips": {
                "自軍捨て山の上のカード１枚": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerB_99",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "捨て山"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_94",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "捨て山"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_75",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "捨て山"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_64",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "捨て山"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_88",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "捨て山"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_61",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "捨て山"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_78",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "捨て山"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_106",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "捨て山"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_67",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "捨て山"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_100",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "捨て山"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_70",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "捨て山"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_66",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "捨て山"
                                    ]
                                }
                            ]
                        ],
                        [
                            [
                                "PlayerB_99",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "捨て山"
                                    ]
                                }
                            ]
                        ]
                    ],
                    "count": 1
                },
                "橫置支付1[白]": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerB_86",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_90",
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
                            ]
                        ],
                        [
                            [
                                "PlayerB_86",
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
                                "PlayerB_86",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_90",
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
                                "PlayerB_86",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_90",
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
                            ]
                        ]
                    ]
                }
            },
            "globalEffects": {},
            "varNamesRemoveOnTurnEnd": {}
        }
    },
    "phase": [
        "戦闘フェイズ",
        "ダメージ判定ステップ",
        "フリータイミング2"
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
            "playGCount": 1,
            "confirmPhase": false,
            "textIdsUseThisTurn": {
                "179030_11E_C_WT077S_white_text_command": true
            }
        }
    },
    "activePlayerID": "PlayerB",
    "immediateEffect": [],
    "stackEffect": [
        "createDestroyEffect_PlayerB_62",
        "createDestroyEffect_PlayerB_74",
        "createDestroyEffect_PlayerB_76"
    ],
    "destroyEffect": [],
    "commandEffects": [
        "179023_06C_C_WT055C_white_text_command",
        "179019_02A_C_WT012U_white_text_command",
        "createPlayEffects_PlayerA_PlayerA_21_loadPrototype_179009_03B_U_WT045U_white_text_1",
        "createPlayEffects_PlayerA_PlayerA_21_loadPrototype_179009_03B_U_WT045U_white_text_2",
        "createPlayEffects_PlayerA_PlayerA_60_loadPrototype_179901_00_U_WT001P_white_02_text_0",
        "createPlayEffects_PlayerA_PlayerA_60_loadPrototype_179901_00_U_WT001P_white_02_text_3",
        "createPlayEffects_PlayerA_PlayerA_7_loadPrototype_179003_01A_O_WT001C_white_text_0",
        "createPlayEffects_PlayerA_PlayerA_43_loadPrototype_179024_03B_U_WT042U_white_text_1",
        "179025_07D_C_WT060U_white_text_command",
        "createPlayEffects_PlayerB_PlayerB_76_loadPrototype_179015_04B_U_WT067C_white_text_1",
        "createPlayEffects_PlayerB_PlayerB_76_loadPrototype_179015_04B_U_WT067C_white_text_2"
    ],
    "commandEffectTips": [
        {
            "effectId": "179023_06C_C_WT055C_white_text_command",
            "conditionKeys": [
                "合計国力〔x〕",
                "橫置支付0[白]",
                "戦闘エリアにいる敵軍ユニット１枚"
            ],
            "logicID": 0,
            "logicSubID": 0,
            "tipOrErrors": [
                {
                    "effectId": "179023_06C_C_WT055C_white_text_command",
                    "conditionKey": "合計国力〔x〕",
                    "tip": null,
                    "errors": []
                },
                {
                    "effectId": "179023_06C_C_WT055C_white_text_command",
                    "conditionKey": "橫置支付0[白]",
                    "tip": {
                        "title": [
                            "カード",
                            [
                                [
                                    "PlayerA_6",
                                    {
                                        "id": "AbsoluteBaSyou",
                                        "value": [
                                            "PlayerA",
                                            "Gゾーン"
                                        ]
                                    }
                                ],
                                [
                                    "PlayerA_35",
                                    {
                                        "id": "AbsoluteBaSyou",
                                        "value": [
                                            "PlayerA",
                                            "Gゾーン"
                                        ]
                                    }
                                ],
                                [
                                    "PlayerA_32",
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
                                    "PlayerA_53",
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
                                    "PlayerA_6",
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
                    "effectId": "179023_06C_C_WT055C_white_text_command",
                    "conditionKey": "戦闘エリアにいる敵軍ユニット１枚",
                    "tip": {
                        "title": [
                            "カード",
                            [
                                [
                                    "PlayerB_76",
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
                                    "PlayerB_76",
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
                    "errors": []
                }
            ]
        },
        {
            "effectId": "179019_02A_C_WT012U_white_text_command",
            "conditionKeys": [
                "合計国力〔x〕",
                "橫置支付0[白]",
                "敵軍部隊１つ"
            ],
            "logicID": 0,
            "logicSubID": 0,
            "tipOrErrors": [
                {
                    "effectId": "179019_02A_C_WT012U_white_text_command",
                    "conditionKey": "合計国力〔x〕",
                    "tip": null,
                    "errors": []
                },
                {
                    "effectId": "179019_02A_C_WT012U_white_text_command",
                    "conditionKey": "橫置支付0[白]",
                    "tip": {
                        "title": [
                            "カード",
                            [
                                [
                                    "PlayerA_6",
                                    {
                                        "id": "AbsoluteBaSyou",
                                        "value": [
                                            "PlayerA",
                                            "Gゾーン"
                                        ]
                                    }
                                ],
                                [
                                    "PlayerA_35",
                                    {
                                        "id": "AbsoluteBaSyou",
                                        "value": [
                                            "PlayerA",
                                            "Gゾーン"
                                        ]
                                    }
                                ],
                                [
                                    "PlayerA_32",
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
                                    "PlayerA_53",
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
                                    "PlayerA_6",
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
                    "effectId": "179019_02A_C_WT012U_white_text_command",
                    "conditionKey": "敵軍部隊１つ",
                    "tip": {
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
                        ],
                        "count": 1
                    },
                    "errors": []
                }
            ]
        },
        {
            "effectId": "createPlayEffects_PlayerA_PlayerA_21_loadPrototype_179009_03B_U_WT045U_white_text_1",
            "conditionKeys": [
                "0[null]",
                "自軍手札、または自軍ハンガーにある「特徴：ヴァイエイト系」を持つユニット１枚",
                "同回合上限"
            ],
            "logicID": 0,
            "logicSubID": 0,
            "tipOrErrors": [
                {
                    "effectId": "createPlayEffects_PlayerA_PlayerA_21_loadPrototype_179009_03B_U_WT045U_white_text_1",
                    "conditionKey": "0[null]",
                    "tip": {
                        "title": [
                            "カード",
                            [
                                [
                                    "PlayerA_6",
                                    {
                                        "id": "AbsoluteBaSyou",
                                        "value": [
                                            "PlayerA",
                                            "Gゾーン"
                                        ]
                                    }
                                ],
                                [
                                    "PlayerA_35",
                                    {
                                        "id": "AbsoluteBaSyou",
                                        "value": [
                                            "PlayerA",
                                            "Gゾーン"
                                        ]
                                    }
                                ],
                                [
                                    "PlayerA_32",
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
                                    "PlayerA_53",
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
                                    "PlayerA_6",
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
                    "effectId": "createPlayEffects_PlayerA_PlayerA_21_loadPrototype_179009_03B_U_WT045U_white_text_1",
                    "conditionKey": "自軍手札、または自軍ハンガーにある「特徴：ヴァイエイト系」を持つユニット１枚",
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
                    "effectId": "createPlayEffects_PlayerA_PlayerA_21_loadPrototype_179009_03B_U_WT045U_white_text_1",
                    "conditionKey": "同回合上限",
                    "tip": null,
                    "errors": []
                }
            ]
        },
        {
            "effectId": "createPlayEffects_PlayerA_PlayerA_21_loadPrototype_179009_03B_U_WT045U_white_text_2",
            "conditionKeys": [
                "橫置支付0[null]",
                "橫置支付1[null]",
                "このカードの本来のテキスト１つ",
                "［ ］の特徴を持つ自軍ユニット１枚は",
                "同回合上限"
            ],
            "logicID": 0,
            "logicSubID": 0,
            "tipOrErrors": [
                {
                    "effectId": "createPlayEffects_PlayerA_PlayerA_21_loadPrototype_179009_03B_U_WT045U_white_text_2",
                    "conditionKey": "橫置支付0[null]",
                    "tip": {
                        "title": [
                            "カード",
                            [
                                [
                                    "PlayerA_6",
                                    {
                                        "id": "AbsoluteBaSyou",
                                        "value": [
                                            "PlayerA",
                                            "Gゾーン"
                                        ]
                                    }
                                ],
                                [
                                    "PlayerA_35",
                                    {
                                        "id": "AbsoluteBaSyou",
                                        "value": [
                                            "PlayerA",
                                            "Gゾーン"
                                        ]
                                    }
                                ],
                                [
                                    "PlayerA_32",
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
                                    "PlayerA_53",
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
                                    "PlayerA_6",
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
                    "effectId": "createPlayEffects_PlayerA_PlayerA_21_loadPrototype_179009_03B_U_WT045U_white_text_2",
                    "conditionKey": "橫置支付1[null]",
                    "tip": {
                        "title": [
                            "カード",
                            [
                                [
                                    "PlayerA_35",
                                    {
                                        "id": "AbsoluteBaSyou",
                                        "value": [
                                            "PlayerA",
                                            "Gゾーン"
                                        ]
                                    }
                                ],
                                [
                                    "PlayerA_32",
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
                                    "PlayerA_53",
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
                                    "PlayerA_35",
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
                    "effectId": "createPlayEffects_PlayerA_PlayerA_21_loadPrototype_179009_03B_U_WT045U_white_text_2",
                    "conditionKey": "このカードの本来のテキスト１つ",
                    "tip": {
                        "title": [
                            "テキスト",
                            [
                                {
                                    "cardId": "PlayerA_21",
                                    "textId": "loadPrototype_179009_03B_U_WT045U_white_text_0"
                                },
                                {
                                    "cardId": "PlayerA_21",
                                    "textId": "loadPrototype_179009_03B_U_WT045U_white_text_1"
                                }
                            ],
                            [
                                {
                                    "cardId": "PlayerA_21",
                                    "textId": "loadPrototype_179009_03B_U_WT045U_white_text_0"
                                }
                            ]
                        ],
                        "count": 1
                    },
                    "errors": []
                },
                {
                    "effectId": "createPlayEffects_PlayerA_PlayerA_21_loadPrototype_179009_03B_U_WT045U_white_text_2",
                    "conditionKey": "［ ］の特徴を持つ自軍ユニット１枚は",
                    "tip": {
                        "title": [
                            "カード",
                            [],
                            []
                        ],
                        "count": 1
                    },
                    "errors": [
                        "count 0 not right: カード/1",
                        "cardId: PlayerA_21 target not set yet: ［ ］の特徴を持つ自軍ユニット１枚は"
                    ]
                },
                {
                    "effectId": "createPlayEffects_PlayerA_PlayerA_21_loadPrototype_179009_03B_U_WT045U_white_text_2",
                    "conditionKey": "同回合上限",
                    "tip": null,
                    "errors": []
                }
            ]
        },
        {
            "effectId": "createPlayEffects_PlayerA_PlayerA_60_loadPrototype_179901_00_U_WT001P_white_02_text_0",
            "conditionKeys": [
                "0[null]",
                "1[null]",
                "このカードと交戦中の敵軍ユニットが破壊されている場合",
                "G以外の敵軍カード１枚",
                "同回合上限"
            ],
            "logicID": 0,
            "logicSubID": 0,
            "tipOrErrors": [
                {
                    "effectId": "createPlayEffects_PlayerA_PlayerA_60_loadPrototype_179901_00_U_WT001P_white_02_text_0",
                    "conditionKey": "0[null]",
                    "tip": {
                        "title": [
                            "カード",
                            [
                                [
                                    "PlayerA_6",
                                    {
                                        "id": "AbsoluteBaSyou",
                                        "value": [
                                            "PlayerA",
                                            "Gゾーン"
                                        ]
                                    }
                                ],
                                [
                                    "PlayerA_35",
                                    {
                                        "id": "AbsoluteBaSyou",
                                        "value": [
                                            "PlayerA",
                                            "Gゾーン"
                                        ]
                                    }
                                ],
                                [
                                    "PlayerA_32",
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
                                    "PlayerA_53",
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
                                    "PlayerA_6",
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
                    "effectId": "createPlayEffects_PlayerA_PlayerA_60_loadPrototype_179901_00_U_WT001P_white_02_text_0",
                    "conditionKey": "1[null]",
                    "tip": {
                        "title": [
                            "カード",
                            [
                                [
                                    "PlayerA_35",
                                    {
                                        "id": "AbsoluteBaSyou",
                                        "value": [
                                            "PlayerA",
                                            "Gゾーン"
                                        ]
                                    }
                                ],
                                [
                                    "PlayerA_32",
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
                                    "PlayerA_53",
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
                                    "PlayerA_35",
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
                    "effectId": "createPlayEffects_PlayerA_PlayerA_60_loadPrototype_179901_00_U_WT001P_white_02_text_0",
                    "conditionKey": "このカードと交戦中の敵軍ユニットが破壊されている場合",
                    "tip": null,
                    "errors": [
                        "min 0 not right: カード/1"
                    ]
                },
                {
                    "effectId": "createPlayEffects_PlayerA_PlayerA_60_loadPrototype_179901_00_U_WT001P_white_02_text_0",
                    "conditionKey": "G以外の敵軍カード１枚",
                    "tip": {
                        "title": [
                            "カード",
                            [
                                [
                                    "PlayerB_76",
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
                                ],
                                [
                                    "PlayerB_82",
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
                                    "PlayerB_76",
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
                    "errors": []
                },
                {
                    "effectId": "createPlayEffects_PlayerA_PlayerA_60_loadPrototype_179901_00_U_WT001P_white_02_text_0",
                    "conditionKey": "同回合上限",
                    "tip": null,
                    "errors": []
                }
            ]
        },
        {
            "effectId": "createPlayEffects_PlayerA_PlayerA_60_loadPrototype_179901_00_U_WT001P_white_02_text_3",
            "conditionKeys": [
                "橫置支付0[null]",
                "這張卡交戰的防禦力x以下的敵軍機體1張",
                "同回合上限"
            ],
            "logicID": 0,
            "logicSubID": 0,
            "tipOrErrors": [
                {
                    "effectId": "createPlayEffects_PlayerA_PlayerA_60_loadPrototype_179901_00_U_WT001P_white_02_text_3",
                    "conditionKey": "橫置支付0[null]",
                    "tip": {
                        "title": [
                            "カード",
                            [
                                [
                                    "PlayerA_6",
                                    {
                                        "id": "AbsoluteBaSyou",
                                        "value": [
                                            "PlayerA",
                                            "Gゾーン"
                                        ]
                                    }
                                ],
                                [
                                    "PlayerA_35",
                                    {
                                        "id": "AbsoluteBaSyou",
                                        "value": [
                                            "PlayerA",
                                            "Gゾーン"
                                        ]
                                    }
                                ],
                                [
                                    "PlayerA_32",
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
                                    "PlayerA_53",
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
                                    "PlayerA_6",
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
                    "effectId": "createPlayEffects_PlayerA_PlayerA_60_loadPrototype_179901_00_U_WT001P_white_02_text_3",
                    "conditionKey": "這張卡交戰的防禦力x以下的敵軍機體1張",
                    "tip": {
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
                    "errors": []
                },
                {
                    "effectId": "createPlayEffects_PlayerA_PlayerA_60_loadPrototype_179901_00_U_WT001P_white_02_text_3",
                    "conditionKey": "同回合上限",
                    "tip": null,
                    "errors": []
                }
            ]
        },
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
                                    "PlayerA_6",
                                    {
                                        "id": "AbsoluteBaSyou",
                                        "value": [
                                            "PlayerA",
                                            "Gゾーン"
                                        ]
                                    }
                                ],
                                [
                                    "PlayerA_35",
                                    {
                                        "id": "AbsoluteBaSyou",
                                        "value": [
                                            "PlayerA",
                                            "Gゾーン"
                                        ]
                                    }
                                ],
                                [
                                    "PlayerA_32",
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
                                    "PlayerA_53",
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
                                    "PlayerA_6",
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
                                    "PlayerA_35",
                                    {
                                        "id": "AbsoluteBaSyou",
                                        "value": [
                                            "PlayerA",
                                            "Gゾーン"
                                        ]
                                    }
                                ],
                                [
                                    "PlayerA_32",
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
                                    "PlayerA_53",
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
                                    "PlayerA_35",
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
                                    "PlayerA_21",
                                    {
                                        "id": "AbsoluteBaSyou",
                                        "value": [
                                            "PlayerA",
                                            "戦闘エリア1"
                                        ]
                                    }
                                ],
                                [
                                    "PlayerA_60",
                                    {
                                        "id": "AbsoluteBaSyou",
                                        "value": [
                                            "PlayerA",
                                            "戦闘エリア2"
                                        ]
                                    }
                                ],
                                [
                                    "PlayerA_43",
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
                                    "PlayerA_21",
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
            "effectId": "createPlayEffects_PlayerA_PlayerA_43_loadPrototype_179024_03B_U_WT042U_white_text_1",
            "conditionKeys": [
                "打開自軍手裡或指定HANGER中特徵A並合計國力x以下的1張卡",
                "同回合上限"
            ],
            "logicID": 0,
            "logicSubID": 0,
            "tipOrErrors": [
                {
                    "effectId": "createPlayEffects_PlayerA_PlayerA_43_loadPrototype_179024_03B_U_WT042U_white_text_1",
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
                    "effectId": "createPlayEffects_PlayerA_PlayerA_43_loadPrototype_179024_03B_U_WT042U_white_text_1",
                    "conditionKey": "同回合上限",
                    "tip": null,
                    "errors": []
                }
            ]
        },
        {
            "effectId": "179025_07D_C_WT060U_white_text_command",
            "conditionKeys": [
                "合計国力〔x〕",
                "橫置支付0[白]",
                "自軍ユニット１～２枚"
            ],
            "logicID": 0,
            "logicSubID": 0,
            "tipOrErrors": [
                {
                    "effectId": "179025_07D_C_WT060U_white_text_command",
                    "conditionKey": "合計国力〔x〕",
                    "tip": null,
                    "errors": [
                        "合計国力〔x〕:0 < 5. Play 巨なる力"
                    ]
                },
                {
                    "effectId": "179025_07D_C_WT060U_white_text_command",
                    "conditionKey": "橫置支付0[白]",
                    "tip": {
                        "title": [
                            "カード",
                            [],
                            []
                        ],
                        "min": 1
                    },
                    "errors": [
                        "min 0 not right: カード/1",
                        "cardId: PlayerB_92 target not set yet: 橫置支付0[白]"
                    ]
                },
                {
                    "effectId": "179025_07D_C_WT060U_white_text_command",
                    "conditionKey": "自軍ユニット１～２枚",
                    "tip": {
                        "title": [
                            "カード",
                            [
                                [
                                    "PlayerB_76",
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
                                ],
                                [
                                    "PlayerB_82",
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
                                    "PlayerB_76",
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
                    "errors": []
                }
            ]
        },
        {
            "effectId": "createPlayEffects_PlayerB_PlayerB_76_loadPrototype_179015_04B_U_WT067C_white_text_1",
            "conditionKeys": [
                "打開自軍手裡或指定HANGER中特徵A並合計國力x以下的1張卡",
                "同回合上限"
            ],
            "logicID": 0,
            "logicSubID": 0,
            "tipOrErrors": [
                {
                    "effectId": "createPlayEffects_PlayerB_PlayerB_76_loadPrototype_179015_04B_U_WT067C_white_text_1",
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
                    "effectId": "createPlayEffects_PlayerB_PlayerB_76_loadPrototype_179015_04B_U_WT067C_white_text_1",
                    "conditionKey": "同回合上限",
                    "tip": null,
                    "errors": []
                }
            ]
        },
        {
            "effectId": "createPlayEffects_PlayerB_PlayerB_76_loadPrototype_179015_04B_U_WT067C_white_text_2",
            "conditionKeys": [
                "橫置支付0[null]",
                "橫置支付1[null]",
                "このカードの本来のテキスト１つ",
                "［ ］の特徴を持つ自軍ユニット１枚は",
                "同回合上限"
            ],
            "logicID": 0,
            "logicSubID": 0,
            "tipOrErrors": [
                {
                    "effectId": "createPlayEffects_PlayerB_PlayerB_76_loadPrototype_179015_04B_U_WT067C_white_text_2",
                    "conditionKey": "橫置支付0[null]",
                    "tip": {
                        "title": [
                            "カード",
                            [],
                            []
                        ],
                        "min": 1
                    },
                    "errors": [
                        "min 0 not right: カード/1",
                        "cardId: PlayerB_76 target not set yet: 橫置支付0[null]"
                    ]
                },
                {
                    "effectId": "createPlayEffects_PlayerB_PlayerB_76_loadPrototype_179015_04B_U_WT067C_white_text_2",
                    "conditionKey": "橫置支付1[null]",
                    "tip": {
                        "title": [
                            "カード",
                            [],
                            []
                        ],
                        "min": 1
                    },
                    "errors": [
                        "min 0 not right: カード/1",
                        "cardId: PlayerB_76 target not set yet: 橫置支付1[null]"
                    ]
                },
                {
                    "effectId": "createPlayEffects_PlayerB_PlayerB_76_loadPrototype_179015_04B_U_WT067C_white_text_2",
                    "conditionKey": "このカードの本来のテキスト１つ",
                    "tip": {
                        "title": [
                            "テキスト",
                            [
                                {
                                    "cardId": "PlayerB_76",
                                    "textId": "loadPrototype_179015_04B_U_WT067C_white_text_0"
                                },
                                {
                                    "cardId": "PlayerB_76",
                                    "textId": "loadPrototype_179015_04B_U_WT067C_white_text_1"
                                }
                            ],
                            [
                                {
                                    "cardId": "PlayerB_76",
                                    "textId": "loadPrototype_179015_04B_U_WT067C_white_text_0"
                                }
                            ]
                        ],
                        "count": 1
                    },
                    "errors": []
                },
                {
                    "effectId": "createPlayEffects_PlayerB_PlayerB_76_loadPrototype_179015_04B_U_WT067C_white_text_2",
                    "conditionKey": "［ ］の特徴を持つ自軍ユニット１枚は",
                    "tip": {
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
                                ],
                                [
                                    "PlayerB_82",
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
                                            "戦闘エリア2"
                                        ]
                                    }
                                ]
                            ]
                        ],
                        "count": 1
                    },
                    "errors": [
                        "已有同樣的內文: [\"loadPrototype_179015_04B_U_WT067C_white_text_0\"]"
                    ]
                },
                {
                    "effectId": "createPlayEffects_PlayerB_PlayerB_76_loadPrototype_179015_04B_U_WT067C_white_text_2",
                    "conditionKey": "同回合上限",
                    "tip": null,
                    "errors": [
                        "同回合上限: （戦闘フェイズ）：［ ］の特徴を持つ自軍ユニット１枚は、ターン終了時まで、このカードの本来のテキスト１つと同じテキストを得る。ただし同じテキストは得られない）"
                    ]
                }
            ]
        }
    ],
    "isBattle": {
        "[\"PlayerA\",\"戦闘エリア1\"]": true,
        "[\"PlayerB\",\"戦闘エリア1\"]": true,
        "[\"PlayerA\",\"戦闘エリア2\"]": true,
        "[\"PlayerB\",\"戦闘エリア2\"]": true
    },
    "coins": {
        "coin_01928abf-ccae-7007-b643-677b37825484": {
            "id": "coin_01928abf-ccae-7007-b643-677b37825484",
            "title": [
                "BattleBonus",
                [
                    -1,
                    -1,
                    -1
                ]
            ],
            "ownerID": "PlayerA"
        },
        "coin_01928ac5-4852-7114-a8a2-f541bcaa1225": {
            "id": "coin_01928ac5-4852-7114-a8a2-f541bcaa1225",
            "title": [
                "BattleBonus",
                [
                    -1,
                    -1,
                    -1
                ]
            ],
            "ownerID": "PlayerA"
        }
    },
    "coinId2cardId": {
        "coin_01928abf-ccae-7007-b643-677b37825484": "PlayerB_74",
        "coin_01928ac5-4852-7114-a8a2-f541bcaa1225": "PlayerB_76"
    },
    "globalEffectPool": {},
    "messageTopId": 1401,
    "messages": [
        {
            "id": 1400,
            "description": "onEvent: 破壊された場合 [\"PlayerB_76\"]"
        },
        {
            "id": 1399,
            "description": "onEvent: 破壊された場合 [\"PlayerB_74\"]"
        },
        {
            "id": 1398,
            "description": "onEvent: 破壊された場合 [\"PlayerB_62\"]"
        },
        {
            "id": 1397,
            "description": "onSetPhase:戦闘フェイズ,ダメージ判定ステップ,フリータイミング2"
        },
        {
            "id": 1396,
            "description": "onEffectEnd: getDamageRuleEffect"
        },
        {
            "id": 1395,
            "description": "傷害變化: PlayerB_74 0 => 2",
            "effect": {
                "id": "createDamageRuleEffect_PlayerB",
                "reason": [
                    "GameRule",
                    "PlayerB",
                    {
                        "isDamageCheck": true
                    }
                ],
                "text": {
                    "id": "createDamageRuleEffect_text_PlayerB",
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
            "id": 1394,
            "description": "被破壞尚未進入堆疊:PlayerB_62",
            "effect": {
                "id": "createDamageRuleEffect_PlayerB",
                "reason": [
                    "GameRule",
                    "PlayerB",
                    {
                        "isDamageCheck": true
                    }
                ],
                "text": {
                    "id": "createDamageRuleEffect_text_PlayerB",
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
            "id": 1393,
            "description": "被破壞尚未進入堆疊:PlayerB_74",
            "effect": {
                "id": "createDamageRuleEffect_PlayerB",
                "reason": [
                    "GameRule",
                    "PlayerB",
                    {
                        "isDamageCheck": true
                    }
                ],
                "text": {
                    "id": "createDamageRuleEffect_text_PlayerB",
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
            "id": 1392,
            "description": "傷害變化: PlayerB_76 0 => 3",
            "effect": {
                "id": "createDamageRuleEffect_PlayerB",
                "reason": [
                    "GameRule",
                    "PlayerB",
                    {
                        "isDamageCheck": true
                    }
                ],
                "text": {
                    "id": "createDamageRuleEffect_text_PlayerB",
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
            "id": 1391,
            "description": "被破壞尚未進入堆疊:PlayerB_76",
            "effect": {
                "id": "createDamageRuleEffect_PlayerB",
                "reason": [
                    "GameRule",
                    "PlayerB",
                    {
                        "isDamageCheck": true
                    }
                ],
                "text": {
                    "id": "createDamageRuleEffect_text_PlayerB",
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
            "id": 1390,
            "description": "傷害變化: PlayerA_60 0 => 2",
            "effect": {
                "id": "createDamageRuleEffect_PlayerB",
                "reason": [
                    "GameRule",
                    "PlayerB",
                    {
                        "isDamageCheck": true
                    }
                ],
                "text": {
                    "id": "createDamageRuleEffect_text_PlayerB",
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
            "id": 1389,
            "description": "onEvent: 戦闘ダメージを受けた場合 [\"PlayerA_60\"]",
            "effect": {
                "id": "createDamageRuleEffect_PlayerB",
                "reason": [
                    "GameRule",
                    "PlayerB",
                    {
                        "isDamageCheck": true
                    }
                ],
                "text": {
                    "id": "createDamageRuleEffect_text_PlayerB",
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
            "id": 1388,
            "description": "傷害變化: PlayerA_21 0 => 1",
            "effect": {
                "id": "createDamageRuleEffect_PlayerB",
                "reason": [
                    "GameRule",
                    "PlayerB",
                    {
                        "isDamageCheck": true
                    }
                ],
                "text": {
                    "id": "createDamageRuleEffect_text_PlayerB",
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
            "id": 1387,
            "description": "onEvent: 戦闘ダメージを受けた場合 [\"PlayerA_21\"]",
            "effect": {
                "id": "createDamageRuleEffect_PlayerB",
                "reason": [
                    "GameRule",
                    "PlayerB",
                    {
                        "isDamageCheck": true
                    }
                ],
                "text": {
                    "id": "createDamageRuleEffect_text_PlayerB",
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
            "id": 1386,
            "description": "onEffectStart: getDamageRuleEffect",
            "effect": {
                "id": "createDamageRuleEffect_PlayerB",
                "reason": [
                    "GameRule",
                    "PlayerB",
                    {
                        "isDamageCheck": true
                    }
                ],
                "text": {
                    "id": "createDamageRuleEffect_text_PlayerB",
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
            "id": 1385,
            "description": "onSetPhase:戦闘フェイズ,ダメージ判定ステップ,規定の効果"
        },
        {
            "id": 1384,
            "description": "onSetPhase:戦闘フェイズ,ダメージ判定ステップ,フリータイミング"
        },
        {
            "id": 1383,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 1382,
            "description": "onSetPhase:戦闘フェイズ,ダメージ判定ステップ,ステップ開始"
        },
        {
            "id": 1381,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 1380,
            "description": "onSetPhase:戦闘フェイズ,防御ステップ,ステップ終了"
        },
        {
            "id": 1379,
            "description": "onSetPhase:戦闘フェイズ,防御ステップ,フリータイミング2"
        },
        {
            "id": 1378,
            "description": "onEffectEnd: 出擊"
        },
        {
            "id": 1377,
            "description": "onItemMove:PlayerA_60 = [\"PlayerA\",\"配備エリア\"] => [\"PlayerA\",\"戦闘エリア2\"]",
            "effect": {
                "id": "createAttackPhaseRuleEffect_PlayerA",
                "reason": [
                    "GameRule",
                    "PlayerA",
                    {
                        "isAttack": false,
                        "isDefence": true
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
            "id": 1376,
            "description": "onEvent: GameEventOnMove [\"PlayerA_60\"]",
            "effect": {
                "id": "createAttackPhaseRuleEffect_PlayerA",
                "reason": [
                    "GameRule",
                    "PlayerA",
                    {
                        "isAttack": false,
                        "isDefence": true
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
            "id": 1375,
            "description": "onItemMove:PlayerA_21 = [\"PlayerA\",\"配備エリア\"] => [\"PlayerA\",\"戦闘エリア1\"]",
            "effect": {
                "id": "createAttackPhaseRuleEffect_PlayerA",
                "reason": [
                    "GameRule",
                    "PlayerA",
                    {
                        "isAttack": false,
                        "isDefence": true
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
            "id": 1374,
            "description": "onEvent: GameEventOnMove [\"PlayerA_21\"]",
            "effect": {
                "id": "createAttackPhaseRuleEffect_PlayerA",
                "reason": [
                    "GameRule",
                    "PlayerA",
                    {
                        "isAttack": false,
                        "isDefence": true
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
            "id": 1373,
            "description": "onEffectStart: 出擊",
            "effect": {
                "id": "createAttackPhaseRuleEffect_PlayerA",
                "reason": [
                    "GameRule",
                    "PlayerA",
                    {
                        "isAttack": false,
                        "isDefence": true
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
            "id": 1372,
            "description": "onSetPhase:戦闘フェイズ,防御ステップ,規定の効果"
        },
        {
            "id": 1371,
            "description": "onSetPhase:戦闘フェイズ,防御ステップ,フリータイミング"
        },
        {
            "id": 1370,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 1369,
            "description": "onSetPhase:戦闘フェイズ,防御ステップ,ステップ開始"
        },
        {
            "id": 1368,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 1367,
            "description": "onSetPhase:戦闘フェイズ,攻撃ステップ,ステップ終了"
        },
        {
            "id": 1366,
            "description": "onSetPhase:戦闘フェイズ,攻撃ステップ,フリータイミング2"
        },
        {
            "id": 1365,
            "description": "onEffectEnd: 出擊"
        },
        {
            "id": 1364,
            "description": "onEvent: このカードが攻撃に出撃した場合 [\"PlayerB_76\",\"PlayerB_74\"]",
            "effect": {
                "id": "createAttackPhaseRuleEffect_PlayerB",
                "reason": [
                    "GameRule",
                    "PlayerB",
                    {
                        "isAttack": true,
                        "isDefence": false
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
            "id": 1363,
            "description": "onItemMove:PlayerB_62 = [\"PlayerB\",\"配備エリア\"] => [\"PlayerB\",\"戦闘エリア2\"]",
            "effect": {
                "id": "createAttackPhaseRuleEffect_PlayerB",
                "reason": [
                    "GameRule",
                    "PlayerB",
                    {
                        "isAttack": true,
                        "isDefence": false
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
            "id": 1362,
            "description": "onItemMove:PlayerB_74 = [\"PlayerB\",\"配備エリア\"] => [\"PlayerB\",\"戦闘エリア2\"]",
            "effect": {
                "id": "createAttackPhaseRuleEffect_PlayerB",
                "reason": [
                    "GameRule",
                    "PlayerB",
                    {
                        "isAttack": true,
                        "isDefence": false
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
            "id": 1361,
            "description": "onEvent: GameEventOnMove [\"PlayerB_62\"]",
            "effect": {
                "id": "createAttackPhaseRuleEffect_PlayerB",
                "reason": [
                    "GameRule",
                    "PlayerB",
                    {
                        "isAttack": true,
                        "isDefence": false
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
            "id": 1360,
            "description": "onEvent: GameEventOnMove [\"PlayerB_74\"]",
            "effect": {
                "id": "createAttackPhaseRuleEffect_PlayerB",
                "reason": [
                    "GameRule",
                    "PlayerB",
                    {
                        "isAttack": true,
                        "isDefence": false
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
            "id": 1359,
            "description": "onItemMove:PlayerB_76 = [\"PlayerB\",\"配備エリア\"] => [\"PlayerB\",\"戦闘エリア1\"]",
            "effect": {
                "id": "createAttackPhaseRuleEffect_PlayerB",
                "reason": [
                    "GameRule",
                    "PlayerB",
                    {
                        "isAttack": true,
                        "isDefence": false
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
            "id": 1358,
            "description": "onEvent: GameEventOnMove [\"PlayerB_76\"]",
            "effect": {
                "id": "createAttackPhaseRuleEffect_PlayerB",
                "reason": [
                    "GameRule",
                    "PlayerB",
                    {
                        "isAttack": true,
                        "isDefence": false
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
            "id": 1357,
            "description": "onEffectStart: 出擊",
            "effect": {
                "id": "createAttackPhaseRuleEffect_PlayerB",
                "reason": [
                    "GameRule",
                    "PlayerB",
                    {
                        "isAttack": true,
                        "isDefence": false
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
            "id": 1356,
            "description": "onSetPhase:戦闘フェイズ,攻撃ステップ,規定の効果"
        },
        {
            "id": 1355,
            "description": "onEvent: カット終了時 undefined"
        },
        {
            "id": 1354,
            "description": "onEffectEnd: （戦闘フェイズ）：［ ］の特徴を持つ自軍ユニット１枚は、ターン終了時まで、このカードの本来のテキスト１つと同じテキストを得る。ただし同じテキストは得られない）"
        },
        {
            "id": 1353,
            "description": "onEffectStart: （戦闘フェイズ）：［ ］の特徴を持つ自軍ユニット１枚は、ターン終了時まで、このカードの本来のテキスト１つと同じテキストを得る。ただし同じテキストは得られない）",
            "effect": {
                "id": "addStackEffect_01928ac5-bbb3-7118-8a57-b016db9ee311",
                "description": "（戦闘フェイズ）：［ ］の特徴を持つ自軍ユニット１枚は、ターン終了時まで、このカードの本来のテキスト１つと同じテキストを得る。ただし同じテキストは得られない）",
                "reason": [
                    "PlayText",
                    "PlayerB",
                    "PlayerB_76",
                    "loadPrototype_179015_04B_U_WT067C_white_text_2"
                ],
                "text": {
                    "id": "loadPrototype_179015_04B_U_WT067C_white_text_2",
                    "description": "（戦闘フェイズ）：［ ］の特徴を持つ自軍ユニット１枚は、ターン終了時まで、このカードの本来のテキスト１つと同じテキストを得る。ただし同じテキストは得られない）",
                    "title": [],
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect, { GameStateFn, DefineFn }) {\n                        const cardId2 = DefineFn.EffectFn.getCardID(effect), pairs = GameStateFn.getCardTipStrBaSyouPairs(ctx3, \"\\uFF3B \\uFF3D\\u306E\\u7279\\u5FB4\\u3092\\u6301\\u3064\\u81EA\\u8ECD\\u30E6\\u30CB\\u30C3\\u30C8\\uFF11\\u679A\\u306F\", cardId2), textRefs = GameStateFn.getCardTipTextRefs(ctx3, \"\\u3053\\u306E\\u30AB\\u30FC\\u30C9\\u306E\\u672C\\u6765\\u306E\\u30C6\\u30AD\\u30B9\\u30C8\\uFF11\\u3064\", cardId2);\n                        for (let pair2 of pairs) {\n                          GameStateFn.assertTargetMissingError(ctx3, pair2);\n                          const [targetCardId, targetBasyou] = pair2;\n                          ctx3 = GameStateFn.mapItemState(ctx3, targetCardId, (targetItemState) => {\n                            for (let textRef of textRefs) {\n                              if (GameStateFn.getCardTexts(ctx3, targetItemState.id).find((text2) => text2.id == textRef.textId) != null)\n                                continue;\n                              targetItemState = DefineFn.ItemStateFn.setGlobalEffect(targetItemState, null, {\n                                title: [\"AddTextRef\", textRef],\n                                cardIds: [targetItemState.id]\n                              }, { isRemoveOnTurnEnd: !0 });\n                            }\n                            return targetItemState;\n                          });\n                        }\n                        return ctx3;\n                      }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 1352,
            "description": "onEffectEnd: （戦闘フェイズ）：［ ］の特徴を持つ自軍ユニット１枚は、ターン終了時まで、このカードの本来のテキスト１つと同じテキストを得る。ただし同じテキストは得られない）"
        },
        {
            "id": 1351,
            "description": "PlayerB_85.isRoll false => true",
            "effect": {
                "id": "createPlayEffects_PlayerB_PlayerB_76_loadPrototype_179015_04B_U_WT067C_white_text_2",
                "reason": [
                    "PlayText",
                    "PlayerB",
                    "PlayerB_76",
                    "loadPrototype_179015_04B_U_WT067C_white_text_2"
                ],
                "description": "（戦闘フェイズ）：［ ］の特徴を持つ自軍ユニット１枚は、ターン終了時まで、このカードの本来のテキスト１つと同じテキストを得る。ただし同じテキストは得られない）",
                "text": {
                    "id": "loadPrototype_179015_04B_U_WT067C_white_text_2",
                    "title": [
                        "使用型",
                        [
                            "戦闘フェイズ"
                        ]
                    ],
                    "description": "（戦闘フェイズ）：［ ］の特徴を持つ自軍ユニット１枚は、ターン終了時まで、このカードの本来のテキスト１つと同じテキストを得る。ただし同じテキストは得られない）",
                    "conditions": {
                        "橫置支付0[null]": {
                            "title": [
                                "RollColor",
                                null
                            ],
                            "actions": [
                                {
                                    "title": [
                                        "_ロールする",
                                        "ロール"
                                    ],
                                    "vars": [
                                        "橫置支付0[null]"
                                    ]
                                }
                            ],
                            "groupKey": "支付橫置國力"
                        },
                        "橫置支付1[null]": {
                            "title": [
                                "RollColor",
                                null
                            ],
                            "actions": [
                                {
                                    "title": [
                                        "_ロールする",
                                        "ロール"
                                    ],
                                    "vars": [
                                        "橫置支付1[null]"
                                    ]
                                }
                            ],
                            "groupKey": "支付橫置國力"
                        },
                        "このカードの本来のテキスト１つ": {
                            "title": [
                                "このカードの_本来のテキスト１つ",
                                true,
                                1
                            ]
                        },
                        "［ ］の特徴を持つ自軍ユニット１枚は": {
                            "title": [
                                "_本来の記述に｢特徴：_装弾｣を持つ_自軍_G_１枚",
                                false,
                                "アストレイ系",
                                "自軍",
                                "ユニット",
                                1
                            ],
                            "exceptItemSelf": true,
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect, { GameStateFn, DefineFn }) {\n                    const cardId2 = DefineFn.EffectFn.getCardID(effect), pairs = GameStateFn.getCardTipStrBaSyouPairs(ctx3, \"\\uFF3B \\uFF3D\\u306E\\u7279\\u5FB4\\u3092\\u6301\\u3064\\u81EA\\u8ECD\\u30E6\\u30CB\\u30C3\\u30C8\\uFF11\\u679A\\u306F\", cardId2), textRefIds = GameStateFn.getCardTipTextRefs(ctx3, \"\\u3053\\u306E\\u30AB\\u30FC\\u30C9\\u306E\\u672C\\u6765\\u306E\\u30C6\\u30AD\\u30B9\\u30C8\\uFF11\\u3064\", cardId2).map((tr) => tr.textId);\n                    for (let pair2 of pairs)\n                      if (GameStateFn.getCardTexts(ctx3, pair2[0]).find((text2) => textRefIds.includes(text2.id)))\n                        throw new DefineFn.TipError(`\\u5DF2\\u6709\\u540C\\u6A23\\u7684\\u5167\\u6587: ${JSON.stringify(textRefIds)}`, { hasSameText: !0 });\n                    return ctx3;\n                  }"
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
                                        "cutIn",
                                        [
                                            {
                                                "title": "function _(ctx3, effect, { GameStateFn, DefineFn }) {\n                        const cardId2 = DefineFn.EffectFn.getCardID(effect), pairs = GameStateFn.getCardTipStrBaSyouPairs(ctx3, \"\\uFF3B \\uFF3D\\u306E\\u7279\\u5FB4\\u3092\\u6301\\u3064\\u81EA\\u8ECD\\u30E6\\u30CB\\u30C3\\u30C8\\uFF11\\u679A\\u306F\", cardId2), textRefs = GameStateFn.getCardTipTextRefs(ctx3, \"\\u3053\\u306E\\u30AB\\u30FC\\u30C9\\u306E\\u672C\\u6765\\u306E\\u30C6\\u30AD\\u30B9\\u30C8\\uFF11\\u3064\", cardId2);\n                        for (let pair2 of pairs) {\n                          GameStateFn.assertTargetMissingError(ctx3, pair2);\n                          const [targetCardId, targetBasyou] = pair2;\n                          ctx3 = GameStateFn.mapItemState(ctx3, targetCardId, (targetItemState) => {\n                            for (let textRef of textRefs) {\n                              if (GameStateFn.getCardTexts(ctx3, targetItemState.id).find((text2) => text2.id == textRef.textId) != null)\n                                continue;\n                              targetItemState = DefineFn.ItemStateFn.setGlobalEffect(targetItemState, null, {\n                                title: [\"AddTextRef\", textRef],\n                                cardIds: [targetItemState.id]\n                              }, { isRemoveOnTurnEnd: !0 });\n                            }\n                            return targetItemState;\n                          });\n                        }\n                        return ctx3;\n                      }"
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
            "id": 1350,
            "description": "PlayerB_90.isRoll false => true",
            "effect": {
                "id": "createPlayEffects_PlayerB_PlayerB_76_loadPrototype_179015_04B_U_WT067C_white_text_2",
                "reason": [
                    "PlayText",
                    "PlayerB",
                    "PlayerB_76",
                    "loadPrototype_179015_04B_U_WT067C_white_text_2"
                ],
                "description": "（戦闘フェイズ）：［ ］の特徴を持つ自軍ユニット１枚は、ターン終了時まで、このカードの本来のテキスト１つと同じテキストを得る。ただし同じテキストは得られない）",
                "text": {
                    "id": "loadPrototype_179015_04B_U_WT067C_white_text_2",
                    "title": [
                        "使用型",
                        [
                            "戦闘フェイズ"
                        ]
                    ],
                    "description": "（戦闘フェイズ）：［ ］の特徴を持つ自軍ユニット１枚は、ターン終了時まで、このカードの本来のテキスト１つと同じテキストを得る。ただし同じテキストは得られない）",
                    "conditions": {
                        "橫置支付0[null]": {
                            "title": [
                                "RollColor",
                                null
                            ],
                            "actions": [
                                {
                                    "title": [
                                        "_ロールする",
                                        "ロール"
                                    ],
                                    "vars": [
                                        "橫置支付0[null]"
                                    ]
                                }
                            ],
                            "groupKey": "支付橫置國力"
                        },
                        "橫置支付1[null]": {
                            "title": [
                                "RollColor",
                                null
                            ],
                            "actions": [
                                {
                                    "title": [
                                        "_ロールする",
                                        "ロール"
                                    ],
                                    "vars": [
                                        "橫置支付1[null]"
                                    ]
                                }
                            ],
                            "groupKey": "支付橫置國力"
                        },
                        "このカードの本来のテキスト１つ": {
                            "title": [
                                "このカードの_本来のテキスト１つ",
                                true,
                                1
                            ]
                        },
                        "［ ］の特徴を持つ自軍ユニット１枚は": {
                            "title": [
                                "_本来の記述に｢特徴：_装弾｣を持つ_自軍_G_１枚",
                                false,
                                "アストレイ系",
                                "自軍",
                                "ユニット",
                                1
                            ],
                            "exceptItemSelf": true,
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect, { GameStateFn, DefineFn }) {\n                    const cardId2 = DefineFn.EffectFn.getCardID(effect), pairs = GameStateFn.getCardTipStrBaSyouPairs(ctx3, \"\\uFF3B \\uFF3D\\u306E\\u7279\\u5FB4\\u3092\\u6301\\u3064\\u81EA\\u8ECD\\u30E6\\u30CB\\u30C3\\u30C8\\uFF11\\u679A\\u306F\", cardId2), textRefIds = GameStateFn.getCardTipTextRefs(ctx3, \"\\u3053\\u306E\\u30AB\\u30FC\\u30C9\\u306E\\u672C\\u6765\\u306E\\u30C6\\u30AD\\u30B9\\u30C8\\uFF11\\u3064\", cardId2).map((tr) => tr.textId);\n                    for (let pair2 of pairs)\n                      if (GameStateFn.getCardTexts(ctx3, pair2[0]).find((text2) => textRefIds.includes(text2.id)))\n                        throw new DefineFn.TipError(`\\u5DF2\\u6709\\u540C\\u6A23\\u7684\\u5167\\u6587: ${JSON.stringify(textRefIds)}`, { hasSameText: !0 });\n                    return ctx3;\n                  }"
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
                                        "cutIn",
                                        [
                                            {
                                                "title": "function _(ctx3, effect, { GameStateFn, DefineFn }) {\n                        const cardId2 = DefineFn.EffectFn.getCardID(effect), pairs = GameStateFn.getCardTipStrBaSyouPairs(ctx3, \"\\uFF3B \\uFF3D\\u306E\\u7279\\u5FB4\\u3092\\u6301\\u3064\\u81EA\\u8ECD\\u30E6\\u30CB\\u30C3\\u30C8\\uFF11\\u679A\\u306F\", cardId2), textRefs = GameStateFn.getCardTipTextRefs(ctx3, \"\\u3053\\u306E\\u30AB\\u30FC\\u30C9\\u306E\\u672C\\u6765\\u306E\\u30C6\\u30AD\\u30B9\\u30C8\\uFF11\\u3064\", cardId2);\n                        for (let pair2 of pairs) {\n                          GameStateFn.assertTargetMissingError(ctx3, pair2);\n                          const [targetCardId, targetBasyou] = pair2;\n                          ctx3 = GameStateFn.mapItemState(ctx3, targetCardId, (targetItemState) => {\n                            for (let textRef of textRefs) {\n                              if (GameStateFn.getCardTexts(ctx3, targetItemState.id).find((text2) => text2.id == textRef.textId) != null)\n                                continue;\n                              targetItemState = DefineFn.ItemStateFn.setGlobalEffect(targetItemState, null, {\n                                title: [\"AddTextRef\", textRef],\n                                cardIds: [targetItemState.id]\n                              }, { isRemoveOnTurnEnd: !0 });\n                            }\n                            return targetItemState;\n                          });\n                        }\n                        return ctx3;\n                      }"
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
            "id": 1349,
            "description": "onEffectStart: （戦闘フェイズ）：［ ］の特徴を持つ自軍ユニット１枚は、ターン終了時まで、このカードの本来のテキスト１つと同じテキストを得る。ただし同じテキストは得られない）",
            "effect": {
                "id": "createPlayEffects_PlayerB_PlayerB_76_loadPrototype_179015_04B_U_WT067C_white_text_2",
                "reason": [
                    "PlayText",
                    "PlayerB",
                    "PlayerB_76",
                    "loadPrototype_179015_04B_U_WT067C_white_text_2"
                ],
                "description": "（戦闘フェイズ）：［ ］の特徴を持つ自軍ユニット１枚は、ターン終了時まで、このカードの本来のテキスト１つと同じテキストを得る。ただし同じテキストは得られない）",
                "text": {
                    "id": "loadPrototype_179015_04B_U_WT067C_white_text_2",
                    "title": [
                        "使用型",
                        [
                            "戦闘フェイズ"
                        ]
                    ],
                    "description": "（戦闘フェイズ）：［ ］の特徴を持つ自軍ユニット１枚は、ターン終了時まで、このカードの本来のテキスト１つと同じテキストを得る。ただし同じテキストは得られない）",
                    "conditions": {
                        "橫置支付0[null]": {
                            "title": [
                                "RollColor",
                                null
                            ],
                            "actions": [
                                {
                                    "title": [
                                        "_ロールする",
                                        "ロール"
                                    ],
                                    "vars": [
                                        "橫置支付0[null]"
                                    ]
                                }
                            ],
                            "groupKey": "支付橫置國力"
                        },
                        "橫置支付1[null]": {
                            "title": [
                                "RollColor",
                                null
                            ],
                            "actions": [
                                {
                                    "title": [
                                        "_ロールする",
                                        "ロール"
                                    ],
                                    "vars": [
                                        "橫置支付1[null]"
                                    ]
                                }
                            ],
                            "groupKey": "支付橫置國力"
                        },
                        "このカードの本来のテキスト１つ": {
                            "title": [
                                "このカードの_本来のテキスト１つ",
                                true,
                                1
                            ]
                        },
                        "［ ］の特徴を持つ自軍ユニット１枚は": {
                            "title": [
                                "_本来の記述に｢特徴：_装弾｣を持つ_自軍_G_１枚",
                                false,
                                "アストレイ系",
                                "自軍",
                                "ユニット",
                                1
                            ],
                            "exceptItemSelf": true,
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect, { GameStateFn, DefineFn }) {\n                    const cardId2 = DefineFn.EffectFn.getCardID(effect), pairs = GameStateFn.getCardTipStrBaSyouPairs(ctx3, \"\\uFF3B \\uFF3D\\u306E\\u7279\\u5FB4\\u3092\\u6301\\u3064\\u81EA\\u8ECD\\u30E6\\u30CB\\u30C3\\u30C8\\uFF11\\u679A\\u306F\", cardId2), textRefIds = GameStateFn.getCardTipTextRefs(ctx3, \"\\u3053\\u306E\\u30AB\\u30FC\\u30C9\\u306E\\u672C\\u6765\\u306E\\u30C6\\u30AD\\u30B9\\u30C8\\uFF11\\u3064\", cardId2).map((tr) => tr.textId);\n                    for (let pair2 of pairs)\n                      if (GameStateFn.getCardTexts(ctx3, pair2[0]).find((text2) => textRefIds.includes(text2.id)))\n                        throw new DefineFn.TipError(`\\u5DF2\\u6709\\u540C\\u6A23\\u7684\\u5167\\u6587: ${JSON.stringify(textRefIds)}`, { hasSameText: !0 });\n                    return ctx3;\n                  }"
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
                                        "cutIn",
                                        [
                                            {
                                                "title": "function _(ctx3, effect, { GameStateFn, DefineFn }) {\n                        const cardId2 = DefineFn.EffectFn.getCardID(effect), pairs = GameStateFn.getCardTipStrBaSyouPairs(ctx3, \"\\uFF3B \\uFF3D\\u306E\\u7279\\u5FB4\\u3092\\u6301\\u3064\\u81EA\\u8ECD\\u30E6\\u30CB\\u30C3\\u30C8\\uFF11\\u679A\\u306F\", cardId2), textRefs = GameStateFn.getCardTipTextRefs(ctx3, \"\\u3053\\u306E\\u30AB\\u30FC\\u30C9\\u306E\\u672C\\u6765\\u306E\\u30C6\\u30AD\\u30B9\\u30C8\\uFF11\\u3064\", cardId2);\n                        for (let pair2 of pairs) {\n                          GameStateFn.assertTargetMissingError(ctx3, pair2);\n                          const [targetCardId, targetBasyou] = pair2;\n                          ctx3 = GameStateFn.mapItemState(ctx3, targetCardId, (targetItemState) => {\n                            for (let textRef of textRefs) {\n                              if (GameStateFn.getCardTexts(ctx3, targetItemState.id).find((text2) => text2.id == textRef.textId) != null)\n                                continue;\n                              targetItemState = DefineFn.ItemStateFn.setGlobalEffect(targetItemState, null, {\n                                title: [\"AddTextRef\", textRef],\n                                cardIds: [targetItemState.id]\n                              }, { isRemoveOnTurnEnd: !0 });\n                            }\n                            return targetItemState;\n                          });\n                        }\n                        return ctx3;\n                      }"
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
            "id": 1348,
            "description": "onEvent: カット終了時 undefined"
        },
        {
            "id": 1347,
            "description": "onEffectEnd: （戦闘フェイズ）：自軍捨て山の上のカード１枚を、ロール状態で自軍Gにする。その後、カード２枚を引く。この記述の効果は、プレイヤー毎に１ターンに１回まで解決できる。"
        },
        {
            "id": 1346,
            "description": "onItemMove:PlayerB_92 = [\"PlayerB\",\"本国\"] => [\"PlayerB\",\"手札\"]",
            "effect": {
                "id": "179030_11E_C_WT077S_white_text_command_場に出る",
                "reason": [
                    "場に出る",
                    "PlayerB",
                    "PlayerB_102"
                ],
                "description": "Play 少年が見据える先",
                "text": {
                    "id": "179030_11E_C_WT077S_white_text_command",
                    "description": "（戦闘フェイズ）：自軍捨て山の上のカード１枚を、ロール状態で自軍Gにする。その後、カード２枚を引く。この記述の効果は、プレイヤー毎に１ターンに１回まで解決できる。",
                    "title": [],
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx4, effect2, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                            const cardId3 = DefineFn2.EffectFn.getCardID(effect2), from2 = GameStateFn2.getItemBaSyou(ctx4, cardId3), to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u30B8\\u30E3\\u30F3\\u30AF\\u30E4\\u30FC\\u30C9\");\n                            return ctx4 = GameStateFn2.doItemMove(ctx4, to, [cardId3, from2]), ctx4 = GameStateFn2.doTriggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] }), ctx4;\n                          }"
                                },
                                {
                                    "title": "function _(ctx, effect, { DefineFn, GameStateFn, ToolFn }) {\n                            const cardId = DefineFn.EffectFn.getCardID(effect);\n                            const cardController = GameStateFn.getItemController(ctx, cardId);\n                            const pairs = GameStateFn.getCardTipStrBaSyouPairs(ctx, \"自軍捨て山の上のカード１枚\", cardId);\n                            for (const pair of pairs) {\n                                ctx = GameStateFn.doItemSetRollState(ctx, true, pair, { isSkipTargetMissing: true });\n                                ctx = GameStateFn.doItemMove(ctx, DefineFn.AbsoluteBaSyouFn.of(cardController, \"Gゾーン\"), pair);\n                            }\n                            ctx = GameStateFn.doPlayerDrawCard(ctx, 2, cardController);\n                            return ctx;\n                        }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 1345,
            "description": "onEvent: GameEventOnMove [\"PlayerB_92\"]",
            "effect": {
                "id": "179030_11E_C_WT077S_white_text_command_場に出る",
                "reason": [
                    "場に出る",
                    "PlayerB",
                    "PlayerB_102"
                ],
                "description": "Play 少年が見据える先",
                "text": {
                    "id": "179030_11E_C_WT077S_white_text_command",
                    "description": "（戦闘フェイズ）：自軍捨て山の上のカード１枚を、ロール状態で自軍Gにする。その後、カード２枚を引く。この記述の効果は、プレイヤー毎に１ターンに１回まで解決できる。",
                    "title": [],
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx4, effect2, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                            const cardId3 = DefineFn2.EffectFn.getCardID(effect2), from2 = GameStateFn2.getItemBaSyou(ctx4, cardId3), to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u30B8\\u30E3\\u30F3\\u30AF\\u30E4\\u30FC\\u30C9\");\n                            return ctx4 = GameStateFn2.doItemMove(ctx4, to, [cardId3, from2]), ctx4 = GameStateFn2.doTriggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] }), ctx4;\n                          }"
                                },
                                {
                                    "title": "function _(ctx, effect, { DefineFn, GameStateFn, ToolFn }) {\n                            const cardId = DefineFn.EffectFn.getCardID(effect);\n                            const cardController = GameStateFn.getItemController(ctx, cardId);\n                            const pairs = GameStateFn.getCardTipStrBaSyouPairs(ctx, \"自軍捨て山の上のカード１枚\", cardId);\n                            for (const pair of pairs) {\n                                ctx = GameStateFn.doItemSetRollState(ctx, true, pair, { isSkipTargetMissing: true });\n                                ctx = GameStateFn.doItemMove(ctx, DefineFn.AbsoluteBaSyouFn.of(cardController, \"Gゾーン\"), pair);\n                            }\n                            ctx = GameStateFn.doPlayerDrawCard(ctx, 2, cardController);\n                            return ctx;\n                        }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 1344,
            "description": "PlayerB_92.isRoll undefined => false",
            "effect": {
                "id": "179030_11E_C_WT077S_white_text_command_場に出る",
                "reason": [
                    "場に出る",
                    "PlayerB",
                    "PlayerB_102"
                ],
                "description": "Play 少年が見据える先",
                "text": {
                    "id": "179030_11E_C_WT077S_white_text_command",
                    "description": "（戦闘フェイズ）：自軍捨て山の上のカード１枚を、ロール状態で自軍Gにする。その後、カード２枚を引く。この記述の効果は、プレイヤー毎に１ターンに１回まで解決できる。",
                    "title": [],
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx4, effect2, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                            const cardId3 = DefineFn2.EffectFn.getCardID(effect2), from2 = GameStateFn2.getItemBaSyou(ctx4, cardId3), to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u30B8\\u30E3\\u30F3\\u30AF\\u30E4\\u30FC\\u30C9\");\n                            return ctx4 = GameStateFn2.doItemMove(ctx4, to, [cardId3, from2]), ctx4 = GameStateFn2.doTriggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] }), ctx4;\n                          }"
                                },
                                {
                                    "title": "function _(ctx, effect, { DefineFn, GameStateFn, ToolFn }) {\n                            const cardId = DefineFn.EffectFn.getCardID(effect);\n                            const cardController = GameStateFn.getItemController(ctx, cardId);\n                            const pairs = GameStateFn.getCardTipStrBaSyouPairs(ctx, \"自軍捨て山の上のカード１枚\", cardId);\n                            for (const pair of pairs) {\n                                ctx = GameStateFn.doItemSetRollState(ctx, true, pair, { isSkipTargetMissing: true });\n                                ctx = GameStateFn.doItemMove(ctx, DefineFn.AbsoluteBaSyouFn.of(cardController, \"Gゾーン\"), pair);\n                            }\n                            ctx = GameStateFn.doPlayerDrawCard(ctx, 2, cardController);\n                            return ctx;\n                        }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 1343,
            "description": "onItemMove:PlayerB_73 = [\"PlayerB\",\"本国\"] => [\"PlayerB\",\"手札\"]",
            "effect": {
                "id": "179030_11E_C_WT077S_white_text_command_場に出る",
                "reason": [
                    "場に出る",
                    "PlayerB",
                    "PlayerB_102"
                ],
                "description": "Play 少年が見据える先",
                "text": {
                    "id": "179030_11E_C_WT077S_white_text_command",
                    "description": "（戦闘フェイズ）：自軍捨て山の上のカード１枚を、ロール状態で自軍Gにする。その後、カード２枚を引く。この記述の効果は、プレイヤー毎に１ターンに１回まで解決できる。",
                    "title": [],
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx4, effect2, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                            const cardId3 = DefineFn2.EffectFn.getCardID(effect2), from2 = GameStateFn2.getItemBaSyou(ctx4, cardId3), to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u30B8\\u30E3\\u30F3\\u30AF\\u30E4\\u30FC\\u30C9\");\n                            return ctx4 = GameStateFn2.doItemMove(ctx4, to, [cardId3, from2]), ctx4 = GameStateFn2.doTriggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] }), ctx4;\n                          }"
                                },
                                {
                                    "title": "function _(ctx, effect, { DefineFn, GameStateFn, ToolFn }) {\n                            const cardId = DefineFn.EffectFn.getCardID(effect);\n                            const cardController = GameStateFn.getItemController(ctx, cardId);\n                            const pairs = GameStateFn.getCardTipStrBaSyouPairs(ctx, \"自軍捨て山の上のカード１枚\", cardId);\n                            for (const pair of pairs) {\n                                ctx = GameStateFn.doItemSetRollState(ctx, true, pair, { isSkipTargetMissing: true });\n                                ctx = GameStateFn.doItemMove(ctx, DefineFn.AbsoluteBaSyouFn.of(cardController, \"Gゾーン\"), pair);\n                            }\n                            ctx = GameStateFn.doPlayerDrawCard(ctx, 2, cardController);\n                            return ctx;\n                        }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 1342,
            "description": "onEvent: GameEventOnMove [\"PlayerB_73\"]",
            "effect": {
                "id": "179030_11E_C_WT077S_white_text_command_場に出る",
                "reason": [
                    "場に出る",
                    "PlayerB",
                    "PlayerB_102"
                ],
                "description": "Play 少年が見据える先",
                "text": {
                    "id": "179030_11E_C_WT077S_white_text_command",
                    "description": "（戦闘フェイズ）：自軍捨て山の上のカード１枚を、ロール状態で自軍Gにする。その後、カード２枚を引く。この記述の効果は、プレイヤー毎に１ターンに１回まで解決できる。",
                    "title": [],
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx4, effect2, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                            const cardId3 = DefineFn2.EffectFn.getCardID(effect2), from2 = GameStateFn2.getItemBaSyou(ctx4, cardId3), to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u30B8\\u30E3\\u30F3\\u30AF\\u30E4\\u30FC\\u30C9\");\n                            return ctx4 = GameStateFn2.doItemMove(ctx4, to, [cardId3, from2]), ctx4 = GameStateFn2.doTriggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] }), ctx4;\n                          }"
                                },
                                {
                                    "title": "function _(ctx, effect, { DefineFn, GameStateFn, ToolFn }) {\n                            const cardId = DefineFn.EffectFn.getCardID(effect);\n                            const cardController = GameStateFn.getItemController(ctx, cardId);\n                            const pairs = GameStateFn.getCardTipStrBaSyouPairs(ctx, \"自軍捨て山の上のカード１枚\", cardId);\n                            for (const pair of pairs) {\n                                ctx = GameStateFn.doItemSetRollState(ctx, true, pair, { isSkipTargetMissing: true });\n                                ctx = GameStateFn.doItemMove(ctx, DefineFn.AbsoluteBaSyouFn.of(cardController, \"Gゾーン\"), pair);\n                            }\n                            ctx = GameStateFn.doPlayerDrawCard(ctx, 2, cardController);\n                            return ctx;\n                        }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 1341,
            "description": "PlayerB_73.isRoll undefined => false",
            "effect": {
                "id": "179030_11E_C_WT077S_white_text_command_場に出る",
                "reason": [
                    "場に出る",
                    "PlayerB",
                    "PlayerB_102"
                ],
                "description": "Play 少年が見据える先",
                "text": {
                    "id": "179030_11E_C_WT077S_white_text_command",
                    "description": "（戦闘フェイズ）：自軍捨て山の上のカード１枚を、ロール状態で自軍Gにする。その後、カード２枚を引く。この記述の効果は、プレイヤー毎に１ターンに１回まで解決できる。",
                    "title": [],
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx4, effect2, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                            const cardId3 = DefineFn2.EffectFn.getCardID(effect2), from2 = GameStateFn2.getItemBaSyou(ctx4, cardId3), to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u30B8\\u30E3\\u30F3\\u30AF\\u30E4\\u30FC\\u30C9\");\n                            return ctx4 = GameStateFn2.doItemMove(ctx4, to, [cardId3, from2]), ctx4 = GameStateFn2.doTriggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] }), ctx4;\n                          }"
                                },
                                {
                                    "title": "function _(ctx, effect, { DefineFn, GameStateFn, ToolFn }) {\n                            const cardId = DefineFn.EffectFn.getCardID(effect);\n                            const cardController = GameStateFn.getItemController(ctx, cardId);\n                            const pairs = GameStateFn.getCardTipStrBaSyouPairs(ctx, \"自軍捨て山の上のカード１枚\", cardId);\n                            for (const pair of pairs) {\n                                ctx = GameStateFn.doItemSetRollState(ctx, true, pair, { isSkipTargetMissing: true });\n                                ctx = GameStateFn.doItemMove(ctx, DefineFn.AbsoluteBaSyouFn.of(cardController, \"Gゾーン\"), pair);\n                            }\n                            ctx = GameStateFn.doPlayerDrawCard(ctx, 2, cardController);\n                            return ctx;\n                        }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 1340,
            "description": "onItemMove:PlayerB_99 = [\"PlayerB\",\"捨て山\"] => [\"PlayerB\",\"Gゾーン\"]",
            "effect": {
                "id": "179030_11E_C_WT077S_white_text_command_場に出る",
                "reason": [
                    "場に出る",
                    "PlayerB",
                    "PlayerB_102"
                ],
                "description": "Play 少年が見据える先",
                "text": {
                    "id": "179030_11E_C_WT077S_white_text_command",
                    "description": "（戦闘フェイズ）：自軍捨て山の上のカード１枚を、ロール状態で自軍Gにする。その後、カード２枚を引く。この記述の効果は、プレイヤー毎に１ターンに１回まで解決できる。",
                    "title": [],
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx4, effect2, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                            const cardId3 = DefineFn2.EffectFn.getCardID(effect2), from2 = GameStateFn2.getItemBaSyou(ctx4, cardId3), to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u30B8\\u30E3\\u30F3\\u30AF\\u30E4\\u30FC\\u30C9\");\n                            return ctx4 = GameStateFn2.doItemMove(ctx4, to, [cardId3, from2]), ctx4 = GameStateFn2.doTriggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] }), ctx4;\n                          }"
                                },
                                {
                                    "title": "function _(ctx, effect, { DefineFn, GameStateFn, ToolFn }) {\n                            const cardId = DefineFn.EffectFn.getCardID(effect);\n                            const cardController = GameStateFn.getItemController(ctx, cardId);\n                            const pairs = GameStateFn.getCardTipStrBaSyouPairs(ctx, \"自軍捨て山の上のカード１枚\", cardId);\n                            for (const pair of pairs) {\n                                ctx = GameStateFn.doItemSetRollState(ctx, true, pair, { isSkipTargetMissing: true });\n                                ctx = GameStateFn.doItemMove(ctx, DefineFn.AbsoluteBaSyouFn.of(cardController, \"Gゾーン\"), pair);\n                            }\n                            ctx = GameStateFn.doPlayerDrawCard(ctx, 2, cardController);\n                            return ctx;\n                        }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 1339,
            "description": "onEvent: GameEventOnMove [\"PlayerB_99\"]",
            "effect": {
                "id": "179030_11E_C_WT077S_white_text_command_場に出る",
                "reason": [
                    "場に出る",
                    "PlayerB",
                    "PlayerB_102"
                ],
                "description": "Play 少年が見据える先",
                "text": {
                    "id": "179030_11E_C_WT077S_white_text_command",
                    "description": "（戦闘フェイズ）：自軍捨て山の上のカード１枚を、ロール状態で自軍Gにする。その後、カード２枚を引く。この記述の効果は、プレイヤー毎に１ターンに１回まで解決できる。",
                    "title": [],
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx4, effect2, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                            const cardId3 = DefineFn2.EffectFn.getCardID(effect2), from2 = GameStateFn2.getItemBaSyou(ctx4, cardId3), to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u30B8\\u30E3\\u30F3\\u30AF\\u30E4\\u30FC\\u30C9\");\n                            return ctx4 = GameStateFn2.doItemMove(ctx4, to, [cardId3, from2]), ctx4 = GameStateFn2.doTriggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] }), ctx4;\n                          }"
                                },
                                {
                                    "title": "function _(ctx, effect, { DefineFn, GameStateFn, ToolFn }) {\n                            const cardId = DefineFn.EffectFn.getCardID(effect);\n                            const cardController = GameStateFn.getItemController(ctx, cardId);\n                            const pairs = GameStateFn.getCardTipStrBaSyouPairs(ctx, \"自軍捨て山の上のカード１枚\", cardId);\n                            for (const pair of pairs) {\n                                ctx = GameStateFn.doItemSetRollState(ctx, true, pair, { isSkipTargetMissing: true });\n                                ctx = GameStateFn.doItemMove(ctx, DefineFn.AbsoluteBaSyouFn.of(cardController, \"Gゾーン\"), pair);\n                            }\n                            ctx = GameStateFn.doPlayerDrawCard(ctx, 2, cardController);\n                            return ctx;\n                        }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 1338,
            "description": "PlayerB_99.isFaceDown true => false",
            "effect": {
                "id": "179030_11E_C_WT077S_white_text_command_場に出る",
                "reason": [
                    "場に出る",
                    "PlayerB",
                    "PlayerB_102"
                ],
                "description": "Play 少年が見据える先",
                "text": {
                    "id": "179030_11E_C_WT077S_white_text_command",
                    "description": "（戦闘フェイズ）：自軍捨て山の上のカード１枚を、ロール状態で自軍Gにする。その後、カード２枚を引く。この記述の効果は、プレイヤー毎に１ターンに１回まで解決できる。",
                    "title": [],
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx4, effect2, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                            const cardId3 = DefineFn2.EffectFn.getCardID(effect2), from2 = GameStateFn2.getItemBaSyou(ctx4, cardId3), to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u30B8\\u30E3\\u30F3\\u30AF\\u30E4\\u30FC\\u30C9\");\n                            return ctx4 = GameStateFn2.doItemMove(ctx4, to, [cardId3, from2]), ctx4 = GameStateFn2.doTriggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] }), ctx4;\n                          }"
                                },
                                {
                                    "title": "function _(ctx, effect, { DefineFn, GameStateFn, ToolFn }) {\n                            const cardId = DefineFn.EffectFn.getCardID(effect);\n                            const cardController = GameStateFn.getItemController(ctx, cardId);\n                            const pairs = GameStateFn.getCardTipStrBaSyouPairs(ctx, \"自軍捨て山の上のカード１枚\", cardId);\n                            for (const pair of pairs) {\n                                ctx = GameStateFn.doItemSetRollState(ctx, true, pair, { isSkipTargetMissing: true });\n                                ctx = GameStateFn.doItemMove(ctx, DefineFn.AbsoluteBaSyouFn.of(cardController, \"Gゾーン\"), pair);\n                            }\n                            ctx = GameStateFn.doPlayerDrawCard(ctx, 2, cardController);\n                            return ctx;\n                        }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 1337,
            "description": "PlayerB_99.isRoll false => true",
            "effect": {
                "id": "179030_11E_C_WT077S_white_text_command_場に出る",
                "reason": [
                    "場に出る",
                    "PlayerB",
                    "PlayerB_102"
                ],
                "description": "Play 少年が見据える先",
                "text": {
                    "id": "179030_11E_C_WT077S_white_text_command",
                    "description": "（戦闘フェイズ）：自軍捨て山の上のカード１枚を、ロール状態で自軍Gにする。その後、カード２枚を引く。この記述の効果は、プレイヤー毎に１ターンに１回まで解決できる。",
                    "title": [],
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx4, effect2, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                            const cardId3 = DefineFn2.EffectFn.getCardID(effect2), from2 = GameStateFn2.getItemBaSyou(ctx4, cardId3), to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u30B8\\u30E3\\u30F3\\u30AF\\u30E4\\u30FC\\u30C9\");\n                            return ctx4 = GameStateFn2.doItemMove(ctx4, to, [cardId3, from2]), ctx4 = GameStateFn2.doTriggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] }), ctx4;\n                          }"
                                },
                                {
                                    "title": "function _(ctx, effect, { DefineFn, GameStateFn, ToolFn }) {\n                            const cardId = DefineFn.EffectFn.getCardID(effect);\n                            const cardController = GameStateFn.getItemController(ctx, cardId);\n                            const pairs = GameStateFn.getCardTipStrBaSyouPairs(ctx, \"自軍捨て山の上のカード１枚\", cardId);\n                            for (const pair of pairs) {\n                                ctx = GameStateFn.doItemSetRollState(ctx, true, pair, { isSkipTargetMissing: true });\n                                ctx = GameStateFn.doItemMove(ctx, DefineFn.AbsoluteBaSyouFn.of(cardController, \"Gゾーン\"), pair);\n                            }\n                            ctx = GameStateFn.doPlayerDrawCard(ctx, 2, cardController);\n                            return ctx;\n                        }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 1336,
            "description": "onEvent: プレイされて場に出た場合 [\"PlayerB_102\"]",
            "effect": {
                "id": "179030_11E_C_WT077S_white_text_command_場に出る",
                "reason": [
                    "場に出る",
                    "PlayerB",
                    "PlayerB_102"
                ],
                "description": "Play 少年が見据える先",
                "text": {
                    "id": "179030_11E_C_WT077S_white_text_command",
                    "description": "（戦闘フェイズ）：自軍捨て山の上のカード１枚を、ロール状態で自軍Gにする。その後、カード２枚を引く。この記述の効果は、プレイヤー毎に１ターンに１回まで解決できる。",
                    "title": [],
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx4, effect2, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                            const cardId3 = DefineFn2.EffectFn.getCardID(effect2), from2 = GameStateFn2.getItemBaSyou(ctx4, cardId3), to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u30B8\\u30E3\\u30F3\\u30AF\\u30E4\\u30FC\\u30C9\");\n                            return ctx4 = GameStateFn2.doItemMove(ctx4, to, [cardId3, from2]), ctx4 = GameStateFn2.doTriggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] }), ctx4;\n                          }"
                                },
                                {
                                    "title": "function _(ctx, effect, { DefineFn, GameStateFn, ToolFn }) {\n                            const cardId = DefineFn.EffectFn.getCardID(effect);\n                            const cardController = GameStateFn.getItemController(ctx, cardId);\n                            const pairs = GameStateFn.getCardTipStrBaSyouPairs(ctx, \"自軍捨て山の上のカード１枚\", cardId);\n                            for (const pair of pairs) {\n                                ctx = GameStateFn.doItemSetRollState(ctx, true, pair, { isSkipTargetMissing: true });\n                                ctx = GameStateFn.doItemMove(ctx, DefineFn.AbsoluteBaSyouFn.of(cardController, \"Gゾーン\"), pair);\n                            }\n                            ctx = GameStateFn.doPlayerDrawCard(ctx, 2, cardController);\n                            return ctx;\n                        }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 1335,
            "description": "onItemMove:PlayerB_102 = [\"PlayerB\",\"プレイされているカード\"] => [\"PlayerB\",\"ジャンクヤード\"]",
            "effect": {
                "id": "179030_11E_C_WT077S_white_text_command_場に出る",
                "reason": [
                    "場に出る",
                    "PlayerB",
                    "PlayerB_102"
                ],
                "description": "Play 少年が見据える先",
                "text": {
                    "id": "179030_11E_C_WT077S_white_text_command",
                    "description": "（戦闘フェイズ）：自軍捨て山の上のカード１枚を、ロール状態で自軍Gにする。その後、カード２枚を引く。この記述の効果は、プレイヤー毎に１ターンに１回まで解決できる。",
                    "title": [],
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx4, effect2, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                            const cardId3 = DefineFn2.EffectFn.getCardID(effect2), from2 = GameStateFn2.getItemBaSyou(ctx4, cardId3), to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u30B8\\u30E3\\u30F3\\u30AF\\u30E4\\u30FC\\u30C9\");\n                            return ctx4 = GameStateFn2.doItemMove(ctx4, to, [cardId3, from2]), ctx4 = GameStateFn2.doTriggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] }), ctx4;\n                          }"
                                },
                                {
                                    "title": "function _(ctx, effect, { DefineFn, GameStateFn, ToolFn }) {\n                            const cardId = DefineFn.EffectFn.getCardID(effect);\n                            const cardController = GameStateFn.getItemController(ctx, cardId);\n                            const pairs = GameStateFn.getCardTipStrBaSyouPairs(ctx, \"自軍捨て山の上のカード１枚\", cardId);\n                            for (const pair of pairs) {\n                                ctx = GameStateFn.doItemSetRollState(ctx, true, pair, { isSkipTargetMissing: true });\n                                ctx = GameStateFn.doItemMove(ctx, DefineFn.AbsoluteBaSyouFn.of(cardController, \"Gゾーン\"), pair);\n                            }\n                            ctx = GameStateFn.doPlayerDrawCard(ctx, 2, cardController);\n                            return ctx;\n                        }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 1334,
            "description": "onEvent: GameEventOnMove [\"PlayerB_102\"]",
            "effect": {
                "id": "179030_11E_C_WT077S_white_text_command_場に出る",
                "reason": [
                    "場に出る",
                    "PlayerB",
                    "PlayerB_102"
                ],
                "description": "Play 少年が見据える先",
                "text": {
                    "id": "179030_11E_C_WT077S_white_text_command",
                    "description": "（戦闘フェイズ）：自軍捨て山の上のカード１枚を、ロール状態で自軍Gにする。その後、カード２枚を引く。この記述の効果は、プレイヤー毎に１ターンに１回まで解決できる。",
                    "title": [],
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx4, effect2, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                            const cardId3 = DefineFn2.EffectFn.getCardID(effect2), from2 = GameStateFn2.getItemBaSyou(ctx4, cardId3), to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u30B8\\u30E3\\u30F3\\u30AF\\u30E4\\u30FC\\u30C9\");\n                            return ctx4 = GameStateFn2.doItemMove(ctx4, to, [cardId3, from2]), ctx4 = GameStateFn2.doTriggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] }), ctx4;\n                          }"
                                },
                                {
                                    "title": "function _(ctx, effect, { DefineFn, GameStateFn, ToolFn }) {\n                            const cardId = DefineFn.EffectFn.getCardID(effect);\n                            const cardController = GameStateFn.getItemController(ctx, cardId);\n                            const pairs = GameStateFn.getCardTipStrBaSyouPairs(ctx, \"自軍捨て山の上のカード１枚\", cardId);\n                            for (const pair of pairs) {\n                                ctx = GameStateFn.doItemSetRollState(ctx, true, pair, { isSkipTargetMissing: true });\n                                ctx = GameStateFn.doItemMove(ctx, DefineFn.AbsoluteBaSyouFn.of(cardController, \"Gゾーン\"), pair);\n                            }\n                            ctx = GameStateFn.doPlayerDrawCard(ctx, 2, cardController);\n                            return ctx;\n                        }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 1333,
            "description": "onEffectStart: （戦闘フェイズ）：自軍捨て山の上のカード１枚を、ロール状態で自軍Gにする。その後、カード２枚を引く。この記述の効果は、プレイヤー毎に１ターンに１回まで解決できる。",
            "effect": {
                "id": "179030_11E_C_WT077S_white_text_command_場に出る",
                "reason": [
                    "場に出る",
                    "PlayerB",
                    "PlayerB_102"
                ],
                "description": "Play 少年が見据える先",
                "text": {
                    "id": "179030_11E_C_WT077S_white_text_command",
                    "description": "（戦闘フェイズ）：自軍捨て山の上のカード１枚を、ロール状態で自軍Gにする。その後、カード２枚を引く。この記述の効果は、プレイヤー毎に１ターンに１回まで解決できる。",
                    "title": [],
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx4, effect2, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                            const cardId3 = DefineFn2.EffectFn.getCardID(effect2), from2 = GameStateFn2.getItemBaSyou(ctx4, cardId3), to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u30B8\\u30E3\\u30F3\\u30AF\\u30E4\\u30FC\\u30C9\");\n                            return ctx4 = GameStateFn2.doItemMove(ctx4, to, [cardId3, from2]), ctx4 = GameStateFn2.doTriggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] }), ctx4;\n                          }"
                                },
                                {
                                    "title": "function _(ctx, effect, { DefineFn, GameStateFn, ToolFn }) {\n                            const cardId = DefineFn.EffectFn.getCardID(effect);\n                            const cardController = GameStateFn.getItemController(ctx, cardId);\n                            const pairs = GameStateFn.getCardTipStrBaSyouPairs(ctx, \"自軍捨て山の上のカード１枚\", cardId);\n                            for (const pair of pairs) {\n                                ctx = GameStateFn.doItemSetRollState(ctx, true, pair, { isSkipTargetMissing: true });\n                                ctx = GameStateFn.doItemMove(ctx, DefineFn.AbsoluteBaSyouFn.of(cardController, \"Gゾーン\"), pair);\n                            }\n                            ctx = GameStateFn.doPlayerDrawCard(ctx, 2, cardController);\n                            return ctx;\n                        }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 1332,
            "description": "onEffectEnd: Play 少年が見据える先"
        },
        {
            "id": 1331,
            "description": "onItemMove:PlayerB_102 = [\"PlayerB\",\"手札\"] => [\"PlayerB\",\"プレイされているカード\"]",
            "effect": {
                "id": "179030_11E_C_WT077S_white_text_command",
                "reason": [
                    "PlayCard",
                    "PlayerB",
                    "PlayerB_102",
                    {
                        "isPlayCommand": true
                    }
                ],
                "description": "Play 少年が見据える先",
                "text": {
                    "id": "179030_11E_C_WT077S_white_text_command",
                    "title": [
                        "使用型",
                        [
                            "戦闘フェイズ"
                        ]
                    ],
                    "description": "Play 少年が見据える先",
                    "conditions": {
                        "合計国力〔x〕": {
                            "actions": [
                                {
                                    "title": [
                                        "合計国力〔x〕",
                                        4
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
                        },
                        "自軍捨て山の上のカード１枚": {
                            "title": [
                                "Entity",
                                {
                                    "side": "自軍",
                                    "at": [
                                        "捨て山"
                                    ],
                                    "count": 1
                                }
                            ]
                        },
                        "この記述の効果は、プレイヤー毎に１ターンに１回まで解決できる": {
                            "actions": [
                                {
                                    "title": [
                                        "この記述の効果は、プレイヤー毎に１ターンに１回まで解決できる"
                                    ]
                                }
                            ]
                        }
                    },
                    "logicTreeActions": [
                        {
                            "logicTree": {
                                "type": "And",
                                "children": [
                                    {
                                        "type": "Leaf",
                                        "value": "合計国力〔x〕"
                                    },
                                    {
                                        "type": "Leaf",
                                        "value": "橫置支付0[白]"
                                    },
                                    {
                                        "type": "Leaf",
                                        "value": "橫置支付1[白]"
                                    },
                                    {
                                        "type": "Leaf",
                                        "value": "自軍捨て山の上のカード１枚"
                                    },
                                    {
                                        "type": "Leaf",
                                        "value": "この記述の効果は、プレイヤー毎に１ターンに１回まで解決できる"
                                    }
                                ]
                            },
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect, { DefineFn, GameStateFn, ToolFn: ToolFn2 }) {\n              const cardId2 = DefineFn.EffectFn.getCardID(effect), prototype2 = GameStateFn.getItemPrototype(ctx3, cardId2);\n              if (prototype2.category == \"\\u30B3\\u30DE\\u30F3\\u30C9\")\n                ;\n              else\n                throw new Error;\n              const commandText2 = prototype2.commandText, from = GameStateFn.getItemBaSyou(ctx3, cardId2);\n              return ctx3 = GameStateFn.doItemMove(ctx3, DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u3044\\u308B\\u30AB\\u30FC\\u30C9\"), [cardId2, from]), GameStateFn.addStackEffect(ctx3, {\n                id: `${effect.id}_\\u5834\\u306B\\u51FA\\u308B`,\n                reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn.EffectFn.getPlayerID(effect), DefineFn.EffectFn.getCardID(effect)],\n                description: effect.text.description,\n                text: {\n                  id: commandText2?.id || `getPlayCardEffects_commentText_${cardId2}`,\n                  description: commandText2?.description || \"unknown\",\n                  title: [],\n                  logicTreeActions: [\n                    {\n                      actions: [\n                        {\n                          title: function _(ctx4, effect2, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                            const cardId3 = DefineFn2.EffectFn.getCardID(effect2), from2 = GameStateFn2.getItemBaSyou(ctx4, cardId3), to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u30B8\\u30E3\\u30F3\\u30AF\\u30E4\\u30FC\\u30C9\");\n                            return ctx4 = GameStateFn2.doItemMove(ctx4, to, [cardId3, from2]), ctx4 = GameStateFn2.doTriggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] }), ctx4;\n                          }.toString()\n                        },\n                        ...commandText2?.logicTreeActions?.[0]?.actions || []\n                      ]\n                    }\n                  ]\n                }\n              });\n            }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 1330,
            "description": "onEvent: GameEventOnMove [\"PlayerB_102\"]",
            "effect": {
                "id": "179030_11E_C_WT077S_white_text_command",
                "reason": [
                    "PlayCard",
                    "PlayerB",
                    "PlayerB_102",
                    {
                        "isPlayCommand": true
                    }
                ],
                "description": "Play 少年が見据える先",
                "text": {
                    "id": "179030_11E_C_WT077S_white_text_command",
                    "title": [
                        "使用型",
                        [
                            "戦闘フェイズ"
                        ]
                    ],
                    "description": "Play 少年が見据える先",
                    "conditions": {
                        "合計国力〔x〕": {
                            "actions": [
                                {
                                    "title": [
                                        "合計国力〔x〕",
                                        4
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
                        },
                        "自軍捨て山の上のカード１枚": {
                            "title": [
                                "Entity",
                                {
                                    "side": "自軍",
                                    "at": [
                                        "捨て山"
                                    ],
                                    "count": 1
                                }
                            ]
                        },
                        "この記述の効果は、プレイヤー毎に１ターンに１回まで解決できる": {
                            "actions": [
                                {
                                    "title": [
                                        "この記述の効果は、プレイヤー毎に１ターンに１回まで解決できる"
                                    ]
                                }
                            ]
                        }
                    },
                    "logicTreeActions": [
                        {
                            "logicTree": {
                                "type": "And",
                                "children": [
                                    {
                                        "type": "Leaf",
                                        "value": "合計国力〔x〕"
                                    },
                                    {
                                        "type": "Leaf",
                                        "value": "橫置支付0[白]"
                                    },
                                    {
                                        "type": "Leaf",
                                        "value": "橫置支付1[白]"
                                    },
                                    {
                                        "type": "Leaf",
                                        "value": "自軍捨て山の上のカード１枚"
                                    },
                                    {
                                        "type": "Leaf",
                                        "value": "この記述の効果は、プレイヤー毎に１ターンに１回まで解決できる"
                                    }
                                ]
                            },
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect, { DefineFn, GameStateFn, ToolFn: ToolFn2 }) {\n              const cardId2 = DefineFn.EffectFn.getCardID(effect), prototype2 = GameStateFn.getItemPrototype(ctx3, cardId2);\n              if (prototype2.category == \"\\u30B3\\u30DE\\u30F3\\u30C9\")\n                ;\n              else\n                throw new Error;\n              const commandText2 = prototype2.commandText, from = GameStateFn.getItemBaSyou(ctx3, cardId2);\n              return ctx3 = GameStateFn.doItemMove(ctx3, DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u3044\\u308B\\u30AB\\u30FC\\u30C9\"), [cardId2, from]), GameStateFn.addStackEffect(ctx3, {\n                id: `${effect.id}_\\u5834\\u306B\\u51FA\\u308B`,\n                reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn.EffectFn.getPlayerID(effect), DefineFn.EffectFn.getCardID(effect)],\n                description: effect.text.description,\n                text: {\n                  id: commandText2?.id || `getPlayCardEffects_commentText_${cardId2}`,\n                  description: commandText2?.description || \"unknown\",\n                  title: [],\n                  logicTreeActions: [\n                    {\n                      actions: [\n                        {\n                          title: function _(ctx4, effect2, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                            const cardId3 = DefineFn2.EffectFn.getCardID(effect2), from2 = GameStateFn2.getItemBaSyou(ctx4, cardId3), to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u30B8\\u30E3\\u30F3\\u30AF\\u30E4\\u30FC\\u30C9\");\n                            return ctx4 = GameStateFn2.doItemMove(ctx4, to, [cardId3, from2]), ctx4 = GameStateFn2.doTriggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] }), ctx4;\n                          }.toString()\n                        },\n                        ...commandText2?.logicTreeActions?.[0]?.actions || []\n                      ]\n                    }\n                  ]\n                }\n              });\n            }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 1329,
            "description": "PlayerB_102.isFaceDown true => false",
            "effect": {
                "id": "179030_11E_C_WT077S_white_text_command",
                "reason": [
                    "PlayCard",
                    "PlayerB",
                    "PlayerB_102",
                    {
                        "isPlayCommand": true
                    }
                ],
                "description": "Play 少年が見据える先",
                "text": {
                    "id": "179030_11E_C_WT077S_white_text_command",
                    "title": [
                        "使用型",
                        [
                            "戦闘フェイズ"
                        ]
                    ],
                    "description": "Play 少年が見据える先",
                    "conditions": {
                        "合計国力〔x〕": {
                            "actions": [
                                {
                                    "title": [
                                        "合計国力〔x〕",
                                        4
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
                        },
                        "自軍捨て山の上のカード１枚": {
                            "title": [
                                "Entity",
                                {
                                    "side": "自軍",
                                    "at": [
                                        "捨て山"
                                    ],
                                    "count": 1
                                }
                            ]
                        },
                        "この記述の効果は、プレイヤー毎に１ターンに１回まで解決できる": {
                            "actions": [
                                {
                                    "title": [
                                        "この記述の効果は、プレイヤー毎に１ターンに１回まで解決できる"
                                    ]
                                }
                            ]
                        }
                    },
                    "logicTreeActions": [
                        {
                            "logicTree": {
                                "type": "And",
                                "children": [
                                    {
                                        "type": "Leaf",
                                        "value": "合計国力〔x〕"
                                    },
                                    {
                                        "type": "Leaf",
                                        "value": "橫置支付0[白]"
                                    },
                                    {
                                        "type": "Leaf",
                                        "value": "橫置支付1[白]"
                                    },
                                    {
                                        "type": "Leaf",
                                        "value": "自軍捨て山の上のカード１枚"
                                    },
                                    {
                                        "type": "Leaf",
                                        "value": "この記述の効果は、プレイヤー毎に１ターンに１回まで解決できる"
                                    }
                                ]
                            },
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect, { DefineFn, GameStateFn, ToolFn: ToolFn2 }) {\n              const cardId2 = DefineFn.EffectFn.getCardID(effect), prototype2 = GameStateFn.getItemPrototype(ctx3, cardId2);\n              if (prototype2.category == \"\\u30B3\\u30DE\\u30F3\\u30C9\")\n                ;\n              else\n                throw new Error;\n              const commandText2 = prototype2.commandText, from = GameStateFn.getItemBaSyou(ctx3, cardId2);\n              return ctx3 = GameStateFn.doItemMove(ctx3, DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u3044\\u308B\\u30AB\\u30FC\\u30C9\"), [cardId2, from]), GameStateFn.addStackEffect(ctx3, {\n                id: `${effect.id}_\\u5834\\u306B\\u51FA\\u308B`,\n                reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn.EffectFn.getPlayerID(effect), DefineFn.EffectFn.getCardID(effect)],\n                description: effect.text.description,\n                text: {\n                  id: commandText2?.id || `getPlayCardEffects_commentText_${cardId2}`,\n                  description: commandText2?.description || \"unknown\",\n                  title: [],\n                  logicTreeActions: [\n                    {\n                      actions: [\n                        {\n                          title: function _(ctx4, effect2, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                            const cardId3 = DefineFn2.EffectFn.getCardID(effect2), from2 = GameStateFn2.getItemBaSyou(ctx4, cardId3), to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u30B8\\u30E3\\u30F3\\u30AF\\u30E4\\u30FC\\u30C9\");\n                            return ctx4 = GameStateFn2.doItemMove(ctx4, to, [cardId3, from2]), ctx4 = GameStateFn2.doTriggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] }), ctx4;\n                          }.toString()\n                        },\n                        ...commandText2?.logicTreeActions?.[0]?.actions || []\n                      ]\n                    }\n                  ]\n                }\n              });\n            }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 1328,
            "description": "onEvent: プレイした場合 [\"PlayerB_102\"]",
            "effect": {
                "id": "179030_11E_C_WT077S_white_text_command",
                "reason": [
                    "PlayCard",
                    "PlayerB",
                    "PlayerB_102",
                    {
                        "isPlayCommand": true
                    }
                ],
                "description": "Play 少年が見据える先",
                "text": {
                    "id": "179030_11E_C_WT077S_white_text_command",
                    "title": [
                        "使用型",
                        [
                            "戦闘フェイズ"
                        ]
                    ],
                    "description": "Play 少年が見据える先",
                    "conditions": {
                        "合計国力〔x〕": {
                            "actions": [
                                {
                                    "title": [
                                        "合計国力〔x〕",
                                        4
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
                        },
                        "自軍捨て山の上のカード１枚": {
                            "title": [
                                "Entity",
                                {
                                    "side": "自軍",
                                    "at": [
                                        "捨て山"
                                    ],
                                    "count": 1
                                }
                            ]
                        },
                        "この記述の効果は、プレイヤー毎に１ターンに１回まで解決できる": {
                            "actions": [
                                {
                                    "title": [
                                        "この記述の効果は、プレイヤー毎に１ターンに１回まで解決できる"
                                    ]
                                }
                            ]
                        }
                    },
                    "logicTreeActions": [
                        {
                            "logicTree": {
                                "type": "And",
                                "children": [
                                    {
                                        "type": "Leaf",
                                        "value": "合計国力〔x〕"
                                    },
                                    {
                                        "type": "Leaf",
                                        "value": "橫置支付0[白]"
                                    },
                                    {
                                        "type": "Leaf",
                                        "value": "橫置支付1[白]"
                                    },
                                    {
                                        "type": "Leaf",
                                        "value": "自軍捨て山の上のカード１枚"
                                    },
                                    {
                                        "type": "Leaf",
                                        "value": "この記述の効果は、プレイヤー毎に１ターンに１回まで解決できる"
                                    }
                                ]
                            },
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect, { DefineFn, GameStateFn, ToolFn: ToolFn2 }) {\n              const cardId2 = DefineFn.EffectFn.getCardID(effect), prototype2 = GameStateFn.getItemPrototype(ctx3, cardId2);\n              if (prototype2.category == \"\\u30B3\\u30DE\\u30F3\\u30C9\")\n                ;\n              else\n                throw new Error;\n              const commandText2 = prototype2.commandText, from = GameStateFn.getItemBaSyou(ctx3, cardId2);\n              return ctx3 = GameStateFn.doItemMove(ctx3, DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u3044\\u308B\\u30AB\\u30FC\\u30C9\"), [cardId2, from]), GameStateFn.addStackEffect(ctx3, {\n                id: `${effect.id}_\\u5834\\u306B\\u51FA\\u308B`,\n                reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn.EffectFn.getPlayerID(effect), DefineFn.EffectFn.getCardID(effect)],\n                description: effect.text.description,\n                text: {\n                  id: commandText2?.id || `getPlayCardEffects_commentText_${cardId2}`,\n                  description: commandText2?.description || \"unknown\",\n                  title: [],\n                  logicTreeActions: [\n                    {\n                      actions: [\n                        {\n                          title: function _(ctx4, effect2, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                            const cardId3 = DefineFn2.EffectFn.getCardID(effect2), from2 = GameStateFn2.getItemBaSyou(ctx4, cardId3), to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u30B8\\u30E3\\u30F3\\u30AF\\u30E4\\u30FC\\u30C9\");\n                            return ctx4 = GameStateFn2.doItemMove(ctx4, to, [cardId3, from2]), ctx4 = GameStateFn2.doTriggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] }), ctx4;\n                          }.toString()\n                        },\n                        ...commandText2?.logicTreeActions?.[0]?.actions || []\n                      ]\n                    }\n                  ]\n                }\n              });\n            }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 1327,
            "description": "onPlayerStateChange:PlayerB",
            "effect": {
                "id": "179030_11E_C_WT077S_white_text_command",
                "reason": [
                    "PlayCard",
                    "PlayerB",
                    "PlayerB_102",
                    {
                        "isPlayCommand": true
                    }
                ],
                "description": "Play 少年が見据える先",
                "text": {
                    "id": "179030_11E_C_WT077S_white_text_command",
                    "title": [
                        "使用型",
                        [
                            "戦闘フェイズ"
                        ]
                    ],
                    "description": "Play 少年が見据える先",
                    "conditions": {
                        "合計国力〔x〕": {
                            "actions": [
                                {
                                    "title": [
                                        "合計国力〔x〕",
                                        4
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
                        },
                        "自軍捨て山の上のカード１枚": {
                            "title": [
                                "Entity",
                                {
                                    "side": "自軍",
                                    "at": [
                                        "捨て山"
                                    ],
                                    "count": 1
                                }
                            ]
                        },
                        "この記述の効果は、プレイヤー毎に１ターンに１回まで解決できる": {
                            "actions": [
                                {
                                    "title": [
                                        "この記述の効果は、プレイヤー毎に１ターンに１回まで解決できる"
                                    ]
                                }
                            ]
                        }
                    },
                    "logicTreeActions": [
                        {
                            "logicTree": {
                                "type": "And",
                                "children": [
                                    {
                                        "type": "Leaf",
                                        "value": "合計国力〔x〕"
                                    },
                                    {
                                        "type": "Leaf",
                                        "value": "橫置支付0[白]"
                                    },
                                    {
                                        "type": "Leaf",
                                        "value": "橫置支付1[白]"
                                    },
                                    {
                                        "type": "Leaf",
                                        "value": "自軍捨て山の上のカード１枚"
                                    },
                                    {
                                        "type": "Leaf",
                                        "value": "この記述の効果は、プレイヤー毎に１ターンに１回まで解決できる"
                                    }
                                ]
                            },
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect, { DefineFn, GameStateFn, ToolFn: ToolFn2 }) {\n              const cardId2 = DefineFn.EffectFn.getCardID(effect), prototype2 = GameStateFn.getItemPrototype(ctx3, cardId2);\n              if (prototype2.category == \"\\u30B3\\u30DE\\u30F3\\u30C9\")\n                ;\n              else\n                throw new Error;\n              const commandText2 = prototype2.commandText, from = GameStateFn.getItemBaSyou(ctx3, cardId2);\n              return ctx3 = GameStateFn.doItemMove(ctx3, DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u3044\\u308B\\u30AB\\u30FC\\u30C9\"), [cardId2, from]), GameStateFn.addStackEffect(ctx3, {\n                id: `${effect.id}_\\u5834\\u306B\\u51FA\\u308B`,\n                reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn.EffectFn.getPlayerID(effect), DefineFn.EffectFn.getCardID(effect)],\n                description: effect.text.description,\n                text: {\n                  id: commandText2?.id || `getPlayCardEffects_commentText_${cardId2}`,\n                  description: commandText2?.description || \"unknown\",\n                  title: [],\n                  logicTreeActions: [\n                    {\n                      actions: [\n                        {\n                          title: function _(ctx4, effect2, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                            const cardId3 = DefineFn2.EffectFn.getCardID(effect2), from2 = GameStateFn2.getItemBaSyou(ctx4, cardId3), to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u30B8\\u30E3\\u30F3\\u30AF\\u30E4\\u30FC\\u30C9\");\n                            return ctx4 = GameStateFn2.doItemMove(ctx4, to, [cardId3, from2]), ctx4 = GameStateFn2.doTriggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] }), ctx4;\n                          }.toString()\n                        },\n                        ...commandText2?.logicTreeActions?.[0]?.actions || []\n                      ]\n                    }\n                  ]\n                }\n              });\n            }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 1326,
            "description": "PlayerB_86.isRoll false => true",
            "effect": {
                "id": "179030_11E_C_WT077S_white_text_command",
                "reason": [
                    "PlayCard",
                    "PlayerB",
                    "PlayerB_102",
                    {
                        "isPlayCommand": true
                    }
                ],
                "description": "Play 少年が見据える先",
                "text": {
                    "id": "179030_11E_C_WT077S_white_text_command",
                    "title": [
                        "使用型",
                        [
                            "戦闘フェイズ"
                        ]
                    ],
                    "description": "Play 少年が見据える先",
                    "conditions": {
                        "合計国力〔x〕": {
                            "actions": [
                                {
                                    "title": [
                                        "合計国力〔x〕",
                                        4
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
                        },
                        "自軍捨て山の上のカード１枚": {
                            "title": [
                                "Entity",
                                {
                                    "side": "自軍",
                                    "at": [
                                        "捨て山"
                                    ],
                                    "count": 1
                                }
                            ]
                        },
                        "この記述の効果は、プレイヤー毎に１ターンに１回まで解決できる": {
                            "actions": [
                                {
                                    "title": [
                                        "この記述の効果は、プレイヤー毎に１ターンに１回まで解決できる"
                                    ]
                                }
                            ]
                        }
                    },
                    "logicTreeActions": [
                        {
                            "logicTree": {
                                "type": "And",
                                "children": [
                                    {
                                        "type": "Leaf",
                                        "value": "合計国力〔x〕"
                                    },
                                    {
                                        "type": "Leaf",
                                        "value": "橫置支付0[白]"
                                    },
                                    {
                                        "type": "Leaf",
                                        "value": "橫置支付1[白]"
                                    },
                                    {
                                        "type": "Leaf",
                                        "value": "自軍捨て山の上のカード１枚"
                                    },
                                    {
                                        "type": "Leaf",
                                        "value": "この記述の効果は、プレイヤー毎に１ターンに１回まで解決できる"
                                    }
                                ]
                            },
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect, { DefineFn, GameStateFn, ToolFn: ToolFn2 }) {\n              const cardId2 = DefineFn.EffectFn.getCardID(effect), prototype2 = GameStateFn.getItemPrototype(ctx3, cardId2);\n              if (prototype2.category == \"\\u30B3\\u30DE\\u30F3\\u30C9\")\n                ;\n              else\n                throw new Error;\n              const commandText2 = prototype2.commandText, from = GameStateFn.getItemBaSyou(ctx3, cardId2);\n              return ctx3 = GameStateFn.doItemMove(ctx3, DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u3044\\u308B\\u30AB\\u30FC\\u30C9\"), [cardId2, from]), GameStateFn.addStackEffect(ctx3, {\n                id: `${effect.id}_\\u5834\\u306B\\u51FA\\u308B`,\n                reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn.EffectFn.getPlayerID(effect), DefineFn.EffectFn.getCardID(effect)],\n                description: effect.text.description,\n                text: {\n                  id: commandText2?.id || `getPlayCardEffects_commentText_${cardId2}`,\n                  description: commandText2?.description || \"unknown\",\n                  title: [],\n                  logicTreeActions: [\n                    {\n                      actions: [\n                        {\n                          title: function _(ctx4, effect2, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                            const cardId3 = DefineFn2.EffectFn.getCardID(effect2), from2 = GameStateFn2.getItemBaSyou(ctx4, cardId3), to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u30B8\\u30E3\\u30F3\\u30AF\\u30E4\\u30FC\\u30C9\");\n                            return ctx4 = GameStateFn2.doItemMove(ctx4, to, [cardId3, from2]), ctx4 = GameStateFn2.doTriggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] }), ctx4;\n                          }.toString()\n                        },\n                        ...commandText2?.logicTreeActions?.[0]?.actions || []\n                      ]\n                    }\n                  ]\n                }\n              });\n            }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 1325,
            "description": "PlayerB_87.isRoll false => true",
            "effect": {
                "id": "179030_11E_C_WT077S_white_text_command",
                "reason": [
                    "PlayCard",
                    "PlayerB",
                    "PlayerB_102",
                    {
                        "isPlayCommand": true
                    }
                ],
                "description": "Play 少年が見据える先",
                "text": {
                    "id": "179030_11E_C_WT077S_white_text_command",
                    "title": [
                        "使用型",
                        [
                            "戦闘フェイズ"
                        ]
                    ],
                    "description": "Play 少年が見据える先",
                    "conditions": {
                        "合計国力〔x〕": {
                            "actions": [
                                {
                                    "title": [
                                        "合計国力〔x〕",
                                        4
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
                        },
                        "自軍捨て山の上のカード１枚": {
                            "title": [
                                "Entity",
                                {
                                    "side": "自軍",
                                    "at": [
                                        "捨て山"
                                    ],
                                    "count": 1
                                }
                            ]
                        },
                        "この記述の効果は、プレイヤー毎に１ターンに１回まで解決できる": {
                            "actions": [
                                {
                                    "title": [
                                        "この記述の効果は、プレイヤー毎に１ターンに１回まで解決できる"
                                    ]
                                }
                            ]
                        }
                    },
                    "logicTreeActions": [
                        {
                            "logicTree": {
                                "type": "And",
                                "children": [
                                    {
                                        "type": "Leaf",
                                        "value": "合計国力〔x〕"
                                    },
                                    {
                                        "type": "Leaf",
                                        "value": "橫置支付0[白]"
                                    },
                                    {
                                        "type": "Leaf",
                                        "value": "橫置支付1[白]"
                                    },
                                    {
                                        "type": "Leaf",
                                        "value": "自軍捨て山の上のカード１枚"
                                    },
                                    {
                                        "type": "Leaf",
                                        "value": "この記述の効果は、プレイヤー毎に１ターンに１回まで解決できる"
                                    }
                                ]
                            },
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect, { DefineFn, GameStateFn, ToolFn: ToolFn2 }) {\n              const cardId2 = DefineFn.EffectFn.getCardID(effect), prototype2 = GameStateFn.getItemPrototype(ctx3, cardId2);\n              if (prototype2.category == \"\\u30B3\\u30DE\\u30F3\\u30C9\")\n                ;\n              else\n                throw new Error;\n              const commandText2 = prototype2.commandText, from = GameStateFn.getItemBaSyou(ctx3, cardId2);\n              return ctx3 = GameStateFn.doItemMove(ctx3, DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u3044\\u308B\\u30AB\\u30FC\\u30C9\"), [cardId2, from]), GameStateFn.addStackEffect(ctx3, {\n                id: `${effect.id}_\\u5834\\u306B\\u51FA\\u308B`,\n                reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn.EffectFn.getPlayerID(effect), DefineFn.EffectFn.getCardID(effect)],\n                description: effect.text.description,\n                text: {\n                  id: commandText2?.id || `getPlayCardEffects_commentText_${cardId2}`,\n                  description: commandText2?.description || \"unknown\",\n                  title: [],\n                  logicTreeActions: [\n                    {\n                      actions: [\n                        {\n                          title: function _(ctx4, effect2, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                            const cardId3 = DefineFn2.EffectFn.getCardID(effect2), from2 = GameStateFn2.getItemBaSyou(ctx4, cardId3), to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u30B8\\u30E3\\u30F3\\u30AF\\u30E4\\u30FC\\u30C9\");\n                            return ctx4 = GameStateFn2.doItemMove(ctx4, to, [cardId3, from2]), ctx4 = GameStateFn2.doTriggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] }), ctx4;\n                          }.toString()\n                        },\n                        ...commandText2?.logicTreeActions?.[0]?.actions || []\n                      ]\n                    }\n                  ]\n                }\n              });\n            }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 1324,
            "description": "onEffectStart: Play 少年が見据える先",
            "effect": {
                "id": "179030_11E_C_WT077S_white_text_command",
                "reason": [
                    "PlayCard",
                    "PlayerB",
                    "PlayerB_102",
                    {
                        "isPlayCommand": true
                    }
                ],
                "description": "Play 少年が見据える先",
                "text": {
                    "id": "179030_11E_C_WT077S_white_text_command",
                    "title": [
                        "使用型",
                        [
                            "戦闘フェイズ"
                        ]
                    ],
                    "description": "Play 少年が見据える先",
                    "conditions": {
                        "合計国力〔x〕": {
                            "actions": [
                                {
                                    "title": [
                                        "合計国力〔x〕",
                                        4
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
                        },
                        "自軍捨て山の上のカード１枚": {
                            "title": [
                                "Entity",
                                {
                                    "side": "自軍",
                                    "at": [
                                        "捨て山"
                                    ],
                                    "count": 1
                                }
                            ]
                        },
                        "この記述の効果は、プレイヤー毎に１ターンに１回まで解決できる": {
                            "actions": [
                                {
                                    "title": [
                                        "この記述の効果は、プレイヤー毎に１ターンに１回まで解決できる"
                                    ]
                                }
                            ]
                        }
                    },
                    "logicTreeActions": [
                        {
                            "logicTree": {
                                "type": "And",
                                "children": [
                                    {
                                        "type": "Leaf",
                                        "value": "合計国力〔x〕"
                                    },
                                    {
                                        "type": "Leaf",
                                        "value": "橫置支付0[白]"
                                    },
                                    {
                                        "type": "Leaf",
                                        "value": "橫置支付1[白]"
                                    },
                                    {
                                        "type": "Leaf",
                                        "value": "自軍捨て山の上のカード１枚"
                                    },
                                    {
                                        "type": "Leaf",
                                        "value": "この記述の効果は、プレイヤー毎に１ターンに１回まで解決できる"
                                    }
                                ]
                            },
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect, { DefineFn, GameStateFn, ToolFn: ToolFn2 }) {\n              const cardId2 = DefineFn.EffectFn.getCardID(effect), prototype2 = GameStateFn.getItemPrototype(ctx3, cardId2);\n              if (prototype2.category == \"\\u30B3\\u30DE\\u30F3\\u30C9\")\n                ;\n              else\n                throw new Error;\n              const commandText2 = prototype2.commandText, from = GameStateFn.getItemBaSyou(ctx3, cardId2);\n              return ctx3 = GameStateFn.doItemMove(ctx3, DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u3044\\u308B\\u30AB\\u30FC\\u30C9\"), [cardId2, from]), GameStateFn.addStackEffect(ctx3, {\n                id: `${effect.id}_\\u5834\\u306B\\u51FA\\u308B`,\n                reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn.EffectFn.getPlayerID(effect), DefineFn.EffectFn.getCardID(effect)],\n                description: effect.text.description,\n                text: {\n                  id: commandText2?.id || `getPlayCardEffects_commentText_${cardId2}`,\n                  description: commandText2?.description || \"unknown\",\n                  title: [],\n                  logicTreeActions: [\n                    {\n                      actions: [\n                        {\n                          title: function _(ctx4, effect2, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                            const cardId3 = DefineFn2.EffectFn.getCardID(effect2), from2 = GameStateFn2.getItemBaSyou(ctx4, cardId3), to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u30B8\\u30E3\\u30F3\\u30AF\\u30E4\\u30FC\\u30C9\");\n                            return ctx4 = GameStateFn2.doItemMove(ctx4, to, [cardId3, from2]), ctx4 = GameStateFn2.doTriggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] }), ctx4;\n                          }.toString()\n                        },\n                        ...commandText2?.logicTreeActions?.[0]?.actions || []\n                      ]\n                    }\n                  ]\n                }\n              });\n            }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 1323,
            "description": "onSetPhase:戦闘フェイズ,攻撃ステップ,フリータイミング"
        },
        {
            "id": 1322,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 1321,
            "description": "onSetPhase:戦闘フェイズ,攻撃ステップ,ステップ開始"
        },
        {
            "id": 1320,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 1319,
            "description": "onSetPhase:配備フェイズ,フェイズ終了"
        },
        {
            "id": 1318,
            "description": "onEvent: カット終了時 undefined"
        },
        {
            "id": 1317,
            "description": "onEffectEnd: Play ラクス・クライン"
        },
        {
            "id": 1316,
            "description": "onEvent: プレイされて場にセットされた場合 [\"PlayerB_62\"]",
            "effect": {
                "id": "createCharOpUnitGoStageEffectFromPlayEffect_PlayerB_62",
                "reason": [
                    "場に出る",
                    "PlayerB",
                    "PlayerB_62"
                ],
                "description": "Play ラクス・クライン",
                "text": {
                    "id": "createPlayCharacterOperationEffect_PlayerB_62",
                    "description": "Play ラクス・クライン",
                    "title": [],
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect2, { DefineFn, GameStateFn }) {\n                  const cardId2 = DefineFn.EffectFn.getCardID(effect2), pairs = GameStateFn.getCardTipStrBaSyouPairs(ctx3, DefineFn.TipFn.createCharacterTargetUnitKey(), cardId2);\n                  if (pairs.length == 0)\n                    throw new Error(`pairs must not 0: ${effect2.text.description}`);\n                  const [targetCardId, targetBasyou] = pairs[0], from = GameStateFn.getItemBaSyou(ctx3, cardId2), to = targetBasyou;\n                  ctx3 = GameStateFn.doItemMove(ctx3, to, [cardId2, from]);\n                  const isRoll = GameStateFn.getCard(ctx3, targetCardId).isRoll || !1;\n                  return ctx3 = GameStateFn.mapCard(ctx3, cardId2, (is) => ({ ...is, isRoll })), ctx3 = GameStateFn.setSetGroupParent(ctx3, targetCardId, cardId2), ctx3 = GameStateFn.doTriggerEvent(ctx3, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId2] }), ctx3 = GameStateFn.doTriggerEvent(ctx3, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u30BB\\u30C3\\u30C8\\u3055\\u308C\\u305F\\u5834\\u5408\"], cardIds: [cardId2] }), ctx3;\n                }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 1315,
            "description": "onEvent: プレイされて場に出た場合 [\"PlayerB_62\"]",
            "effect": {
                "id": "createCharOpUnitGoStageEffectFromPlayEffect_PlayerB_62",
                "reason": [
                    "場に出る",
                    "PlayerB",
                    "PlayerB_62"
                ],
                "description": "Play ラクス・クライン",
                "text": {
                    "id": "createPlayCharacterOperationEffect_PlayerB_62",
                    "description": "Play ラクス・クライン",
                    "title": [],
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect2, { DefineFn, GameStateFn }) {\n                  const cardId2 = DefineFn.EffectFn.getCardID(effect2), pairs = GameStateFn.getCardTipStrBaSyouPairs(ctx3, DefineFn.TipFn.createCharacterTargetUnitKey(), cardId2);\n                  if (pairs.length == 0)\n                    throw new Error(`pairs must not 0: ${effect2.text.description}`);\n                  const [targetCardId, targetBasyou] = pairs[0], from = GameStateFn.getItemBaSyou(ctx3, cardId2), to = targetBasyou;\n                  ctx3 = GameStateFn.doItemMove(ctx3, to, [cardId2, from]);\n                  const isRoll = GameStateFn.getCard(ctx3, targetCardId).isRoll || !1;\n                  return ctx3 = GameStateFn.mapCard(ctx3, cardId2, (is) => ({ ...is, isRoll })), ctx3 = GameStateFn.setSetGroupParent(ctx3, targetCardId, cardId2), ctx3 = GameStateFn.doTriggerEvent(ctx3, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId2] }), ctx3 = GameStateFn.doTriggerEvent(ctx3, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u30BB\\u30C3\\u30C8\\u3055\\u308C\\u305F\\u5834\\u5408\"], cardIds: [cardId2] }), ctx3;\n                }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 1314,
            "description": "onSetSetGroupParent:PlayerB_74 PlayerB_62",
            "effect": {
                "id": "createCharOpUnitGoStageEffectFromPlayEffect_PlayerB_62",
                "reason": [
                    "場に出る",
                    "PlayerB",
                    "PlayerB_62"
                ],
                "description": "Play ラクス・クライン",
                "text": {
                    "id": "createPlayCharacterOperationEffect_PlayerB_62",
                    "description": "Play ラクス・クライン",
                    "title": [],
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect2, { DefineFn, GameStateFn }) {\n                  const cardId2 = DefineFn.EffectFn.getCardID(effect2), pairs = GameStateFn.getCardTipStrBaSyouPairs(ctx3, DefineFn.TipFn.createCharacterTargetUnitKey(), cardId2);\n                  if (pairs.length == 0)\n                    throw new Error(`pairs must not 0: ${effect2.text.description}`);\n                  const [targetCardId, targetBasyou] = pairs[0], from = GameStateFn.getItemBaSyou(ctx3, cardId2), to = targetBasyou;\n                  ctx3 = GameStateFn.doItemMove(ctx3, to, [cardId2, from]);\n                  const isRoll = GameStateFn.getCard(ctx3, targetCardId).isRoll || !1;\n                  return ctx3 = GameStateFn.mapCard(ctx3, cardId2, (is) => ({ ...is, isRoll })), ctx3 = GameStateFn.setSetGroupParent(ctx3, targetCardId, cardId2), ctx3 = GameStateFn.doTriggerEvent(ctx3, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId2] }), ctx3 = GameStateFn.doTriggerEvent(ctx3, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u30BB\\u30C3\\u30C8\\u3055\\u308C\\u305F\\u5834\\u5408\"], cardIds: [cardId2] }), ctx3;\n                }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 1313,
            "description": "onItemMove:PlayerB_62 = [\"PlayerB\",\"プレイされているカード\"] => [\"PlayerB\",\"配備エリア\"]",
            "effect": {
                "id": "createCharOpUnitGoStageEffectFromPlayEffect_PlayerB_62",
                "reason": [
                    "場に出る",
                    "PlayerB",
                    "PlayerB_62"
                ],
                "description": "Play ラクス・クライン",
                "text": {
                    "id": "createPlayCharacterOperationEffect_PlayerB_62",
                    "description": "Play ラクス・クライン",
                    "title": [],
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect2, { DefineFn, GameStateFn }) {\n                  const cardId2 = DefineFn.EffectFn.getCardID(effect2), pairs = GameStateFn.getCardTipStrBaSyouPairs(ctx3, DefineFn.TipFn.createCharacterTargetUnitKey(), cardId2);\n                  if (pairs.length == 0)\n                    throw new Error(`pairs must not 0: ${effect2.text.description}`);\n                  const [targetCardId, targetBasyou] = pairs[0], from = GameStateFn.getItemBaSyou(ctx3, cardId2), to = targetBasyou;\n                  ctx3 = GameStateFn.doItemMove(ctx3, to, [cardId2, from]);\n                  const isRoll = GameStateFn.getCard(ctx3, targetCardId).isRoll || !1;\n                  return ctx3 = GameStateFn.mapCard(ctx3, cardId2, (is) => ({ ...is, isRoll })), ctx3 = GameStateFn.setSetGroupParent(ctx3, targetCardId, cardId2), ctx3 = GameStateFn.doTriggerEvent(ctx3, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId2] }), ctx3 = GameStateFn.doTriggerEvent(ctx3, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u30BB\\u30C3\\u30C8\\u3055\\u308C\\u305F\\u5834\\u5408\"], cardIds: [cardId2] }), ctx3;\n                }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 1312,
            "description": "onEvent: GameEventOnMove [\"PlayerB_62\"]",
            "effect": {
                "id": "createCharOpUnitGoStageEffectFromPlayEffect_PlayerB_62",
                "reason": [
                    "場に出る",
                    "PlayerB",
                    "PlayerB_62"
                ],
                "description": "Play ラクス・クライン",
                "text": {
                    "id": "createPlayCharacterOperationEffect_PlayerB_62",
                    "description": "Play ラクス・クライン",
                    "title": [],
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect2, { DefineFn, GameStateFn }) {\n                  const cardId2 = DefineFn.EffectFn.getCardID(effect2), pairs = GameStateFn.getCardTipStrBaSyouPairs(ctx3, DefineFn.TipFn.createCharacterTargetUnitKey(), cardId2);\n                  if (pairs.length == 0)\n                    throw new Error(`pairs must not 0: ${effect2.text.description}`);\n                  const [targetCardId, targetBasyou] = pairs[0], from = GameStateFn.getItemBaSyou(ctx3, cardId2), to = targetBasyou;\n                  ctx3 = GameStateFn.doItemMove(ctx3, to, [cardId2, from]);\n                  const isRoll = GameStateFn.getCard(ctx3, targetCardId).isRoll || !1;\n                  return ctx3 = GameStateFn.mapCard(ctx3, cardId2, (is) => ({ ...is, isRoll })), ctx3 = GameStateFn.setSetGroupParent(ctx3, targetCardId, cardId2), ctx3 = GameStateFn.doTriggerEvent(ctx3, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId2] }), ctx3 = GameStateFn.doTriggerEvent(ctx3, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u30BB\\u30C3\\u30C8\\u3055\\u308C\\u305F\\u5834\\u5408\"], cardIds: [cardId2] }), ctx3;\n                }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 1311,
            "description": "onEvent: このカードが場に出た場合 [\"PlayerB_62\"]",
            "effect": {
                "id": "createCharOpUnitGoStageEffectFromPlayEffect_PlayerB_62",
                "reason": [
                    "場に出る",
                    "PlayerB",
                    "PlayerB_62"
                ],
                "description": "Play ラクス・クライン",
                "text": {
                    "id": "createPlayCharacterOperationEffect_PlayerB_62",
                    "description": "Play ラクス・クライン",
                    "title": [],
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect2, { DefineFn, GameStateFn }) {\n                  const cardId2 = DefineFn.EffectFn.getCardID(effect2), pairs = GameStateFn.getCardTipStrBaSyouPairs(ctx3, DefineFn.TipFn.createCharacterTargetUnitKey(), cardId2);\n                  if (pairs.length == 0)\n                    throw new Error(`pairs must not 0: ${effect2.text.description}`);\n                  const [targetCardId, targetBasyou] = pairs[0], from = GameStateFn.getItemBaSyou(ctx3, cardId2), to = targetBasyou;\n                  ctx3 = GameStateFn.doItemMove(ctx3, to, [cardId2, from]);\n                  const isRoll = GameStateFn.getCard(ctx3, targetCardId).isRoll || !1;\n                  return ctx3 = GameStateFn.mapCard(ctx3, cardId2, (is) => ({ ...is, isRoll })), ctx3 = GameStateFn.setSetGroupParent(ctx3, targetCardId, cardId2), ctx3 = GameStateFn.doTriggerEvent(ctx3, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId2] }), ctx3 = GameStateFn.doTriggerEvent(ctx3, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u30BB\\u30C3\\u30C8\\u3055\\u308C\\u305F\\u5834\\u5408\"], cardIds: [cardId2] }), ctx3;\n                }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 1310,
            "description": "onEffectStart: Play ラクス・クライン",
            "effect": {
                "id": "createCharOpUnitGoStageEffectFromPlayEffect_PlayerB_62",
                "reason": [
                    "場に出る",
                    "PlayerB",
                    "PlayerB_62"
                ],
                "description": "Play ラクス・クライン",
                "text": {
                    "id": "createPlayCharacterOperationEffect_PlayerB_62",
                    "description": "Play ラクス・クライン",
                    "title": [],
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect2, { DefineFn, GameStateFn }) {\n                  const cardId2 = DefineFn.EffectFn.getCardID(effect2), pairs = GameStateFn.getCardTipStrBaSyouPairs(ctx3, DefineFn.TipFn.createCharacterTargetUnitKey(), cardId2);\n                  if (pairs.length == 0)\n                    throw new Error(`pairs must not 0: ${effect2.text.description}`);\n                  const [targetCardId, targetBasyou] = pairs[0], from = GameStateFn.getItemBaSyou(ctx3, cardId2), to = targetBasyou;\n                  ctx3 = GameStateFn.doItemMove(ctx3, to, [cardId2, from]);\n                  const isRoll = GameStateFn.getCard(ctx3, targetCardId).isRoll || !1;\n                  return ctx3 = GameStateFn.mapCard(ctx3, cardId2, (is) => ({ ...is, isRoll })), ctx3 = GameStateFn.setSetGroupParent(ctx3, targetCardId, cardId2), ctx3 = GameStateFn.doTriggerEvent(ctx3, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId2] }), ctx3 = GameStateFn.doTriggerEvent(ctx3, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u30BB\\u30C3\\u30C8\\u3055\\u308C\\u305F\\u5834\\u5408\"], cardIds: [cardId2] }), ctx3;\n                }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 1309,
            "description": "onEffectEnd: Play ラクス・クライン"
        },
        {
            "id": 1308,
            "description": "onItemMove:PlayerB_62 = [\"PlayerB\",\"手札\"] => [\"PlayerB\",\"プレイされているカード\"]",
            "effect": {
                "id": "createPlayCharacterOperationEffect_PlayerB_62",
                "reason": [
                    "PlayCard",
                    "PlayerB",
                    "PlayerB_62",
                    {
                        "isPlayCharacter": true,
                        "isPlayOperation": false
                    }
                ],
                "description": "Play ラクス・クライン",
                "text": {
                    "id": "createPlayCharacterOperationEffect_PlayerB_62",
                    "title": [
                        "使用型",
                        [
                            "自軍",
                            "配備フェイズ"
                        ]
                    ],
                    "description": "Play ラクス・クライン",
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
                        },
                        "一個自軍機體": {
                            "title": [
                                "Entity",
                                {
                                    "at": [
                                        "配備エリア"
                                    ],
                                    "isCanSetCharacter": true,
                                    "side": "自軍",
                                    "is": [
                                        "ユニット"
                                    ],
                                    "count": 1
                                }
                            ]
                        }
                    },
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect, { DefineFn, GameStateFn, ToolFn: ToolFn2 }) {\n              const cardId2 = DefineFn.EffectFn.getCardID(effect), prototype2 = GameStateFn.getItemPrototype(ctx3, cardId2), from = GameStateFn.getItemBaSyou(ctx3, cardId2);\n              ctx3 = GameStateFn.doItemMove(ctx3, DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u3044\\u308B\\u30AB\\u30FC\\u30C9\"), [cardId2, from]);\n              const newE = GameStateFn.createCharOpUnitGoStageEffectFromPlayEffect(ctx3, effect);\n              return GameStateFn.addStackEffect(ctx3, newE);\n            }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 1307,
            "description": "onEvent: GameEventOnMove [\"PlayerB_62\"]",
            "effect": {
                "id": "createPlayCharacterOperationEffect_PlayerB_62",
                "reason": [
                    "PlayCard",
                    "PlayerB",
                    "PlayerB_62",
                    {
                        "isPlayCharacter": true,
                        "isPlayOperation": false
                    }
                ],
                "description": "Play ラクス・クライン",
                "text": {
                    "id": "createPlayCharacterOperationEffect_PlayerB_62",
                    "title": [
                        "使用型",
                        [
                            "自軍",
                            "配備フェイズ"
                        ]
                    ],
                    "description": "Play ラクス・クライン",
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
                        },
                        "一個自軍機體": {
                            "title": [
                                "Entity",
                                {
                                    "at": [
                                        "配備エリア"
                                    ],
                                    "isCanSetCharacter": true,
                                    "side": "自軍",
                                    "is": [
                                        "ユニット"
                                    ],
                                    "count": 1
                                }
                            ]
                        }
                    },
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect, { DefineFn, GameStateFn, ToolFn: ToolFn2 }) {\n              const cardId2 = DefineFn.EffectFn.getCardID(effect), prototype2 = GameStateFn.getItemPrototype(ctx3, cardId2), from = GameStateFn.getItemBaSyou(ctx3, cardId2);\n              ctx3 = GameStateFn.doItemMove(ctx3, DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u3044\\u308B\\u30AB\\u30FC\\u30C9\"), [cardId2, from]);\n              const newE = GameStateFn.createCharOpUnitGoStageEffectFromPlayEffect(ctx3, effect);\n              return GameStateFn.addStackEffect(ctx3, newE);\n            }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 1306,
            "description": "PlayerB_62.isFaceDown true => false",
            "effect": {
                "id": "createPlayCharacterOperationEffect_PlayerB_62",
                "reason": [
                    "PlayCard",
                    "PlayerB",
                    "PlayerB_62",
                    {
                        "isPlayCharacter": true,
                        "isPlayOperation": false
                    }
                ],
                "description": "Play ラクス・クライン",
                "text": {
                    "id": "createPlayCharacterOperationEffect_PlayerB_62",
                    "title": [
                        "使用型",
                        [
                            "自軍",
                            "配備フェイズ"
                        ]
                    ],
                    "description": "Play ラクス・クライン",
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
                        },
                        "一個自軍機體": {
                            "title": [
                                "Entity",
                                {
                                    "at": [
                                        "配備エリア"
                                    ],
                                    "isCanSetCharacter": true,
                                    "side": "自軍",
                                    "is": [
                                        "ユニット"
                                    ],
                                    "count": 1
                                }
                            ]
                        }
                    },
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect, { DefineFn, GameStateFn, ToolFn: ToolFn2 }) {\n              const cardId2 = DefineFn.EffectFn.getCardID(effect), prototype2 = GameStateFn.getItemPrototype(ctx3, cardId2), from = GameStateFn.getItemBaSyou(ctx3, cardId2);\n              ctx3 = GameStateFn.doItemMove(ctx3, DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u3044\\u308B\\u30AB\\u30FC\\u30C9\"), [cardId2, from]);\n              const newE = GameStateFn.createCharOpUnitGoStageEffectFromPlayEffect(ctx3, effect);\n              return GameStateFn.addStackEffect(ctx3, newE);\n            }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 1305,
            "description": "onEvent: プレイした場合 [\"PlayerB_62\"]",
            "effect": {
                "id": "createPlayCharacterOperationEffect_PlayerB_62",
                "reason": [
                    "PlayCard",
                    "PlayerB",
                    "PlayerB_62",
                    {
                        "isPlayCharacter": true,
                        "isPlayOperation": false
                    }
                ],
                "description": "Play ラクス・クライン",
                "text": {
                    "id": "createPlayCharacterOperationEffect_PlayerB_62",
                    "title": [
                        "使用型",
                        [
                            "自軍",
                            "配備フェイズ"
                        ]
                    ],
                    "description": "Play ラクス・クライン",
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
                        },
                        "一個自軍機體": {
                            "title": [
                                "Entity",
                                {
                                    "at": [
                                        "配備エリア"
                                    ],
                                    "isCanSetCharacter": true,
                                    "side": "自軍",
                                    "is": [
                                        "ユニット"
                                    ],
                                    "count": 1
                                }
                            ]
                        }
                    },
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect, { DefineFn, GameStateFn, ToolFn: ToolFn2 }) {\n              const cardId2 = DefineFn.EffectFn.getCardID(effect), prototype2 = GameStateFn.getItemPrototype(ctx3, cardId2), from = GameStateFn.getItemBaSyou(ctx3, cardId2);\n              ctx3 = GameStateFn.doItemMove(ctx3, DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u3044\\u308B\\u30AB\\u30FC\\u30C9\"), [cardId2, from]);\n              const newE = GameStateFn.createCharOpUnitGoStageEffectFromPlayEffect(ctx3, effect);\n              return GameStateFn.addStackEffect(ctx3, newE);\n            }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 1304,
            "description": "PlayerB_83.isRoll false => true",
            "effect": {
                "id": "createPlayCharacterOperationEffect_PlayerB_62",
                "reason": [
                    "PlayCard",
                    "PlayerB",
                    "PlayerB_62",
                    {
                        "isPlayCharacter": true,
                        "isPlayOperation": false
                    }
                ],
                "description": "Play ラクス・クライン",
                "text": {
                    "id": "createPlayCharacterOperationEffect_PlayerB_62",
                    "title": [
                        "使用型",
                        [
                            "自軍",
                            "配備フェイズ"
                        ]
                    ],
                    "description": "Play ラクス・クライン",
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
                        },
                        "一個自軍機體": {
                            "title": [
                                "Entity",
                                {
                                    "at": [
                                        "配備エリア"
                                    ],
                                    "isCanSetCharacter": true,
                                    "side": "自軍",
                                    "is": [
                                        "ユニット"
                                    ],
                                    "count": 1
                                }
                            ]
                        }
                    },
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect, { DefineFn, GameStateFn, ToolFn: ToolFn2 }) {\n              const cardId2 = DefineFn.EffectFn.getCardID(effect), prototype2 = GameStateFn.getItemPrototype(ctx3, cardId2), from = GameStateFn.getItemBaSyou(ctx3, cardId2);\n              ctx3 = GameStateFn.doItemMove(ctx3, DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u3044\\u308B\\u30AB\\u30FC\\u30C9\"), [cardId2, from]);\n              const newE = GameStateFn.createCharOpUnitGoStageEffectFromPlayEffect(ctx3, effect);\n              return GameStateFn.addStackEffect(ctx3, newE);\n            }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 1303,
            "description": "onEffectStart: Play ラクス・クライン",
            "effect": {
                "id": "createPlayCharacterOperationEffect_PlayerB_62",
                "reason": [
                    "PlayCard",
                    "PlayerB",
                    "PlayerB_62",
                    {
                        "isPlayCharacter": true,
                        "isPlayOperation": false
                    }
                ],
                "description": "Play ラクス・クライン",
                "text": {
                    "id": "createPlayCharacterOperationEffect_PlayerB_62",
                    "title": [
                        "使用型",
                        [
                            "自軍",
                            "配備フェイズ"
                        ]
                    ],
                    "description": "Play ラクス・クライン",
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
                        },
                        "一個自軍機體": {
                            "title": [
                                "Entity",
                                {
                                    "at": [
                                        "配備エリア"
                                    ],
                                    "isCanSetCharacter": true,
                                    "side": "自軍",
                                    "is": [
                                        "ユニット"
                                    ],
                                    "count": 1
                                }
                            ]
                        }
                    },
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect, { DefineFn, GameStateFn, ToolFn: ToolFn2 }) {\n              const cardId2 = DefineFn.EffectFn.getCardID(effect), prototype2 = GameStateFn.getItemPrototype(ctx3, cardId2), from = GameStateFn.getItemBaSyou(ctx3, cardId2);\n              ctx3 = GameStateFn.doItemMove(ctx3, DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u3044\\u308B\\u30AB\\u30FC\\u30C9\"), [cardId2, from]);\n              const newE = GameStateFn.createCharOpUnitGoStageEffectFromPlayEffect(ctx3, effect);\n              return GameStateFn.addStackEffect(ctx3, newE);\n            }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 1302,
            "description": "onEvent: カット終了時 undefined"
        },
        {
            "id": 1301,
            "description": "onEffectEnd: Play アストレイ レッドフレーム（ガーベラ・ストレート）"
        },
        {
            "id": 1300,
            "description": "onEvent: プレイされて場に出た場合 [\"PlayerB_82\"]",
            "effect": {
                "id": "createUnitGoStageEffectFromPlayEffect_PlayerB_82",
                "reason": [
                    "場に出る",
                    "PlayerB",
                    "PlayerB_82"
                ],
                "description": "Play アストレイ レッドフレーム（ガーベラ・ストレート）",
                "text": {
                    "id": "createPlayUnitEffect_PlayerB_82",
                    "description": "Play アストレイ レッドフレーム（ガーベラ・ストレート）",
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
            "id": 1299,
            "description": "onItemMove:PlayerB_82 = [\"PlayerB\",\"プレイされているカード\"] => [\"PlayerB\",\"配備エリア\"]",
            "effect": {
                "id": "createUnitGoStageEffectFromPlayEffect_PlayerB_82",
                "reason": [
                    "場に出る",
                    "PlayerB",
                    "PlayerB_82"
                ],
                "description": "Play アストレイ レッドフレーム（ガーベラ・ストレート）",
                "text": {
                    "id": "createPlayUnitEffect_PlayerB_82",
                    "description": "Play アストレイ レッドフレーム（ガーベラ・ストレート）",
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
            "id": 1298,
            "description": "onEvent: GameEventOnMove [\"PlayerB_82\"]",
            "effect": {
                "id": "createUnitGoStageEffectFromPlayEffect_PlayerB_82",
                "reason": [
                    "場に出る",
                    "PlayerB",
                    "PlayerB_82"
                ],
                "description": "Play アストレイ レッドフレーム（ガーベラ・ストレート）",
                "text": {
                    "id": "createPlayUnitEffect_PlayerB_82",
                    "description": "Play アストレイ レッドフレーム（ガーベラ・ストレート）",
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
            "id": 1297,
            "description": "onEvent: このカードが場に出た場合 [\"PlayerB_82\"]",
            "effect": {
                "id": "createUnitGoStageEffectFromPlayEffect_PlayerB_82",
                "reason": [
                    "場に出る",
                    "PlayerB",
                    "PlayerB_82"
                ],
                "description": "Play アストレイ レッドフレーム（ガーベラ・ストレート）",
                "text": {
                    "id": "createPlayUnitEffect_PlayerB_82",
                    "description": "Play アストレイ レッドフレーム（ガーベラ・ストレート）",
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
            "id": 1296,
            "description": "onEffectStart: Play アストレイ レッドフレーム（ガーベラ・ストレート）",
            "effect": {
                "id": "createUnitGoStageEffectFromPlayEffect_PlayerB_82",
                "reason": [
                    "場に出る",
                    "PlayerB",
                    "PlayerB_82"
                ],
                "description": "Play アストレイ レッドフレーム（ガーベラ・ストレート）",
                "text": {
                    "id": "createPlayUnitEffect_PlayerB_82",
                    "description": "Play アストレイ レッドフレーム（ガーベラ・ストレート）",
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
            "id": 1295,
            "description": "onEffectEnd: Play アストレイ レッドフレーム（ガーベラ・ストレート）"
        },
        {
            "id": 1294,
            "description": "onItemMove:PlayerB_82 = [\"PlayerB\",\"手札\"] => [\"PlayerB\",\"プレイされているカード\"]",
            "effect": {
                "id": "createPlayUnitEffect_PlayerB_82",
                "reason": [
                    "PlayCard",
                    "PlayerB",
                    "PlayerB_82",
                    {
                        "isPlayUnit": true
                    }
                ],
                "description": "Play アストレイ レッドフレーム（ガーベラ・ストレート）",
                "text": {
                    "id": "createPlayUnitEffect_PlayerB_82",
                    "title": [
                        "使用型",
                        [
                            "自軍",
                            "配備フェイズ"
                        ]
                    ],
                    "description": "Play アストレイ レッドフレーム（ガーベラ・ストレート）",
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
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 1293,
            "description": "onEvent: GameEventOnMove [\"PlayerB_82\"]",
            "effect": {
                "id": "createPlayUnitEffect_PlayerB_82",
                "reason": [
                    "PlayCard",
                    "PlayerB",
                    "PlayerB_82",
                    {
                        "isPlayUnit": true
                    }
                ],
                "description": "Play アストレイ レッドフレーム（ガーベラ・ストレート）",
                "text": {
                    "id": "createPlayUnitEffect_PlayerB_82",
                    "title": [
                        "使用型",
                        [
                            "自軍",
                            "配備フェイズ"
                        ]
                    ],
                    "description": "Play アストレイ レッドフレーム（ガーベラ・ストレート）",
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
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 1292,
            "description": "PlayerB_82.isFaceDown true => false",
            "effect": {
                "id": "createPlayUnitEffect_PlayerB_82",
                "reason": [
                    "PlayCard",
                    "PlayerB",
                    "PlayerB_82",
                    {
                        "isPlayUnit": true
                    }
                ],
                "description": "Play アストレイ レッドフレーム（ガーベラ・ストレート）",
                "text": {
                    "id": "createPlayUnitEffect_PlayerB_82",
                    "title": [
                        "使用型",
                        [
                            "自軍",
                            "配備フェイズ"
                        ]
                    ],
                    "description": "Play アストレイ レッドフレーム（ガーベラ・ストレート）",
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
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 1291,
            "description": "onEvent: プレイした場合 [\"PlayerB_82\"]",
            "effect": {
                "id": "createPlayUnitEffect_PlayerB_82",
                "reason": [
                    "PlayCard",
                    "PlayerB",
                    "PlayerB_82",
                    {
                        "isPlayUnit": true
                    }
                ],
                "description": "Play アストレイ レッドフレーム（ガーベラ・ストレート）",
                "text": {
                    "id": "createPlayUnitEffect_PlayerB_82",
                    "title": [
                        "使用型",
                        [
                            "自軍",
                            "配備フェイズ"
                        ]
                    ],
                    "description": "Play アストレイ レッドフレーム（ガーベラ・ストレート）",
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
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 1290,
            "description": "PlayerB_72.isRoll false => true",
            "effect": {
                "id": "createPlayUnitEffect_PlayerB_82",
                "reason": [
                    "PlayCard",
                    "PlayerB",
                    "PlayerB_82",
                    {
                        "isPlayUnit": true
                    }
                ],
                "description": "Play アストレイ レッドフレーム（ガーベラ・ストレート）",
                "text": {
                    "id": "createPlayUnitEffect_PlayerB_82",
                    "title": [
                        "使用型",
                        [
                            "自軍",
                            "配備フェイズ"
                        ]
                    ],
                    "description": "Play アストレイ レッドフレーム（ガーベラ・ストレート）",
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
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 1289,
            "description": "PlayerB_69.isRoll false => true",
            "effect": {
                "id": "createPlayUnitEffect_PlayerB_82",
                "reason": [
                    "PlayCard",
                    "PlayerB",
                    "PlayerB_82",
                    {
                        "isPlayUnit": true
                    }
                ],
                "description": "Play アストレイ レッドフレーム（ガーベラ・ストレート）",
                "text": {
                    "id": "createPlayUnitEffect_PlayerB_82",
                    "title": [
                        "使用型",
                        [
                            "自軍",
                            "配備フェイズ"
                        ]
                    ],
                    "description": "Play アストレイ レッドフレーム（ガーベラ・ストレート）",
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
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 1288,
            "description": "onEffectStart: Play アストレイ レッドフレーム（ガーベラ・ストレート）",
            "effect": {
                "id": "createPlayUnitEffect_PlayerB_82",
                "reason": [
                    "PlayCard",
                    "PlayerB",
                    "PlayerB_82",
                    {
                        "isPlayUnit": true
                    }
                ],
                "description": "Play アストレイ レッドフレーム（ガーベラ・ストレート）",
                "text": {
                    "id": "createPlayUnitEffect_PlayerB_82",
                    "title": [
                        "使用型",
                        [
                            "自軍",
                            "配備フェイズ"
                        ]
                    ],
                    "description": "Play アストレイ レッドフレーム（ガーベラ・ストレート）",
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
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 1287,
            "description": "onEffectEnd: PlayG"
        },
        {
            "id": 1286,
            "description": "onEvent: このカードがGとして場に出た場合 [\"PlayerB_85\"]",
            "effect": {
                "id": "createPlayGEffect_PlayerB_85",
                "reason": [
                    "PlayCard",
                    "PlayerB",
                    "PlayerB_85",
                    {
                        "isPlayG": true
                    }
                ],
                "description": "Play G",
                "text": {
                    "id": "createPlayGEffect_PlayerB_85",
                    "title": [
                        "使用型",
                        [
                            "自軍",
                            "配備フェイズ"
                        ]
                    ],
                    "description": "PlayG",
                    "conditions": {
                        "出G上限": {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect, { DefineFn, GameStateFn, ToolFn: ToolFn2 }) {\n              const cardId2 = DefineFn.EffectFn.getCardID(effect), cardController = GameStateFn.getItemController(ctx3, cardId2), ps = GameStateFn.getPlayerState(ctx3, cardController);\n              if (ps.playGCount > 0)\n                throw new DefineFn.TipError(`\\u51FAG\\u4E0A\\u9650: ${ps.playGCount}`, { isPlayGLimit: !0 });\n              return ctx3 = GameStateFn.mapPlayerState(ctx3, cardController, (ps2) => {\n                return {\n                  ...ps2,\n                  playGCount: ps2.playGCount + 1\n                };\n              }), ctx3;\n            }"
                                }
                            ]
                        }
                    },
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect, { DefineFn, GameStateFn, ToolFn: ToolFn2 }) {\n              const cardId2 = DefineFn.EffectFn.getCardID(effect), from = GameStateFn.getItemBaSyou(ctx3, cardId2);\n              return ctx3 = GameStateFn.doItemMove(ctx3, DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"G\\u30BE\\u30FC\\u30F3\"), [cardId2, from]), ctx3;\n            }"
                                },
                                {
                                    "title": [
                                        "triggerEvent",
                                        {
                                            "title": [
                                                "プレイされて場に出た場合"
                                            ]
                                        }
                                    ]
                                },
                                {
                                    "title": [
                                        "triggerEvent",
                                        {
                                            "title": [
                                                "このカードがGとして場に出た場合"
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 1285,
            "description": "onEvent: プレイされて場に出た場合 [\"PlayerB_85\"]",
            "effect": {
                "id": "createPlayGEffect_PlayerB_85",
                "reason": [
                    "PlayCard",
                    "PlayerB",
                    "PlayerB_85",
                    {
                        "isPlayG": true
                    }
                ],
                "description": "Play G",
                "text": {
                    "id": "createPlayGEffect_PlayerB_85",
                    "title": [
                        "使用型",
                        [
                            "自軍",
                            "配備フェイズ"
                        ]
                    ],
                    "description": "PlayG",
                    "conditions": {
                        "出G上限": {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect, { DefineFn, GameStateFn, ToolFn: ToolFn2 }) {\n              const cardId2 = DefineFn.EffectFn.getCardID(effect), cardController = GameStateFn.getItemController(ctx3, cardId2), ps = GameStateFn.getPlayerState(ctx3, cardController);\n              if (ps.playGCount > 0)\n                throw new DefineFn.TipError(`\\u51FAG\\u4E0A\\u9650: ${ps.playGCount}`, { isPlayGLimit: !0 });\n              return ctx3 = GameStateFn.mapPlayerState(ctx3, cardController, (ps2) => {\n                return {\n                  ...ps2,\n                  playGCount: ps2.playGCount + 1\n                };\n              }), ctx3;\n            }"
                                }
                            ]
                        }
                    },
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect, { DefineFn, GameStateFn, ToolFn: ToolFn2 }) {\n              const cardId2 = DefineFn.EffectFn.getCardID(effect), from = GameStateFn.getItemBaSyou(ctx3, cardId2);\n              return ctx3 = GameStateFn.doItemMove(ctx3, DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"G\\u30BE\\u30FC\\u30F3\"), [cardId2, from]), ctx3;\n            }"
                                },
                                {
                                    "title": [
                                        "triggerEvent",
                                        {
                                            "title": [
                                                "プレイされて場に出た場合"
                                            ]
                                        }
                                    ]
                                },
                                {
                                    "title": [
                                        "triggerEvent",
                                        {
                                            "title": [
                                                "このカードがGとして場に出た場合"
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 1284,
            "description": "onItemMove:PlayerB_85 = [\"PlayerB\",\"手札\"] => [\"PlayerB\",\"Gゾーン\"]",
            "effect": {
                "id": "createPlayGEffect_PlayerB_85",
                "reason": [
                    "PlayCard",
                    "PlayerB",
                    "PlayerB_85",
                    {
                        "isPlayG": true
                    }
                ],
                "description": "Play G",
                "text": {
                    "id": "createPlayGEffect_PlayerB_85",
                    "title": [
                        "使用型",
                        [
                            "自軍",
                            "配備フェイズ"
                        ]
                    ],
                    "description": "PlayG",
                    "conditions": {
                        "出G上限": {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect, { DefineFn, GameStateFn, ToolFn: ToolFn2 }) {\n              const cardId2 = DefineFn.EffectFn.getCardID(effect), cardController = GameStateFn.getItemController(ctx3, cardId2), ps = GameStateFn.getPlayerState(ctx3, cardController);\n              if (ps.playGCount > 0)\n                throw new DefineFn.TipError(`\\u51FAG\\u4E0A\\u9650: ${ps.playGCount}`, { isPlayGLimit: !0 });\n              return ctx3 = GameStateFn.mapPlayerState(ctx3, cardController, (ps2) => {\n                return {\n                  ...ps2,\n                  playGCount: ps2.playGCount + 1\n                };\n              }), ctx3;\n            }"
                                }
                            ]
                        }
                    },
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect, { DefineFn, GameStateFn, ToolFn: ToolFn2 }) {\n              const cardId2 = DefineFn.EffectFn.getCardID(effect), from = GameStateFn.getItemBaSyou(ctx3, cardId2);\n              return ctx3 = GameStateFn.doItemMove(ctx3, DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"G\\u30BE\\u30FC\\u30F3\"), [cardId2, from]), ctx3;\n            }"
                                },
                                {
                                    "title": [
                                        "triggerEvent",
                                        {
                                            "title": [
                                                "プレイされて場に出た場合"
                                            ]
                                        }
                                    ]
                                },
                                {
                                    "title": [
                                        "triggerEvent",
                                        {
                                            "title": [
                                                "このカードがGとして場に出た場合"
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 1283,
            "description": "onEvent: GameEventOnMove [\"PlayerB_85\"]",
            "effect": {
                "id": "createPlayGEffect_PlayerB_85",
                "reason": [
                    "PlayCard",
                    "PlayerB",
                    "PlayerB_85",
                    {
                        "isPlayG": true
                    }
                ],
                "description": "Play G",
                "text": {
                    "id": "createPlayGEffect_PlayerB_85",
                    "title": [
                        "使用型",
                        [
                            "自軍",
                            "配備フェイズ"
                        ]
                    ],
                    "description": "PlayG",
                    "conditions": {
                        "出G上限": {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect, { DefineFn, GameStateFn, ToolFn: ToolFn2 }) {\n              const cardId2 = DefineFn.EffectFn.getCardID(effect), cardController = GameStateFn.getItemController(ctx3, cardId2), ps = GameStateFn.getPlayerState(ctx3, cardController);\n              if (ps.playGCount > 0)\n                throw new DefineFn.TipError(`\\u51FAG\\u4E0A\\u9650: ${ps.playGCount}`, { isPlayGLimit: !0 });\n              return ctx3 = GameStateFn.mapPlayerState(ctx3, cardController, (ps2) => {\n                return {\n                  ...ps2,\n                  playGCount: ps2.playGCount + 1\n                };\n              }), ctx3;\n            }"
                                }
                            ]
                        }
                    },
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect, { DefineFn, GameStateFn, ToolFn: ToolFn2 }) {\n              const cardId2 = DefineFn.EffectFn.getCardID(effect), from = GameStateFn.getItemBaSyou(ctx3, cardId2);\n              return ctx3 = GameStateFn.doItemMove(ctx3, DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"G\\u30BE\\u30FC\\u30F3\"), [cardId2, from]), ctx3;\n            }"
                                },
                                {
                                    "title": [
                                        "triggerEvent",
                                        {
                                            "title": [
                                                "プレイされて場に出た場合"
                                            ]
                                        }
                                    ]
                                },
                                {
                                    "title": [
                                        "triggerEvent",
                                        {
                                            "title": [
                                                "このカードがGとして場に出た場合"
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 1282,
            "description": "PlayerB_85.isFaceDown true => false",
            "effect": {
                "id": "createPlayGEffect_PlayerB_85",
                "reason": [
                    "PlayCard",
                    "PlayerB",
                    "PlayerB_85",
                    {
                        "isPlayG": true
                    }
                ],
                "description": "Play G",
                "text": {
                    "id": "createPlayGEffect_PlayerB_85",
                    "title": [
                        "使用型",
                        [
                            "自軍",
                            "配備フェイズ"
                        ]
                    ],
                    "description": "PlayG",
                    "conditions": {
                        "出G上限": {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect, { DefineFn, GameStateFn, ToolFn: ToolFn2 }) {\n              const cardId2 = DefineFn.EffectFn.getCardID(effect), cardController = GameStateFn.getItemController(ctx3, cardId2), ps = GameStateFn.getPlayerState(ctx3, cardController);\n              if (ps.playGCount > 0)\n                throw new DefineFn.TipError(`\\u51FAG\\u4E0A\\u9650: ${ps.playGCount}`, { isPlayGLimit: !0 });\n              return ctx3 = GameStateFn.mapPlayerState(ctx3, cardController, (ps2) => {\n                return {\n                  ...ps2,\n                  playGCount: ps2.playGCount + 1\n                };\n              }), ctx3;\n            }"
                                }
                            ]
                        }
                    },
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect, { DefineFn, GameStateFn, ToolFn: ToolFn2 }) {\n              const cardId2 = DefineFn.EffectFn.getCardID(effect), from = GameStateFn.getItemBaSyou(ctx3, cardId2);\n              return ctx3 = GameStateFn.doItemMove(ctx3, DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"G\\u30BE\\u30FC\\u30F3\"), [cardId2, from]), ctx3;\n            }"
                                },
                                {
                                    "title": [
                                        "triggerEvent",
                                        {
                                            "title": [
                                                "プレイされて場に出た場合"
                                            ]
                                        }
                                    ]
                                },
                                {
                                    "title": [
                                        "triggerEvent",
                                        {
                                            "title": [
                                                "このカードがGとして場に出た場合"
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 1281,
            "description": "onPlayerStateChange:PlayerB",
            "effect": {
                "id": "createPlayGEffect_PlayerB_85",
                "reason": [
                    "PlayCard",
                    "PlayerB",
                    "PlayerB_85",
                    {
                        "isPlayG": true
                    }
                ],
                "description": "Play G",
                "text": {
                    "id": "createPlayGEffect_PlayerB_85",
                    "title": [
                        "使用型",
                        [
                            "自軍",
                            "配備フェイズ"
                        ]
                    ],
                    "description": "PlayG",
                    "conditions": {
                        "出G上限": {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect, { DefineFn, GameStateFn, ToolFn: ToolFn2 }) {\n              const cardId2 = DefineFn.EffectFn.getCardID(effect), cardController = GameStateFn.getItemController(ctx3, cardId2), ps = GameStateFn.getPlayerState(ctx3, cardController);\n              if (ps.playGCount > 0)\n                throw new DefineFn.TipError(`\\u51FAG\\u4E0A\\u9650: ${ps.playGCount}`, { isPlayGLimit: !0 });\n              return ctx3 = GameStateFn.mapPlayerState(ctx3, cardController, (ps2) => {\n                return {\n                  ...ps2,\n                  playGCount: ps2.playGCount + 1\n                };\n              }), ctx3;\n            }"
                                }
                            ]
                        }
                    },
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect, { DefineFn, GameStateFn, ToolFn: ToolFn2 }) {\n              const cardId2 = DefineFn.EffectFn.getCardID(effect), from = GameStateFn.getItemBaSyou(ctx3, cardId2);\n              return ctx3 = GameStateFn.doItemMove(ctx3, DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"G\\u30BE\\u30FC\\u30F3\"), [cardId2, from]), ctx3;\n            }"
                                },
                                {
                                    "title": [
                                        "triggerEvent",
                                        {
                                            "title": [
                                                "プレイされて場に出た場合"
                                            ]
                                        }
                                    ]
                                },
                                {
                                    "title": [
                                        "triggerEvent",
                                        {
                                            "title": [
                                                "このカードがGとして場に出た場合"
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 1280,
            "description": "onEffectStart: PlayG",
            "effect": {
                "id": "createPlayGEffect_PlayerB_85",
                "reason": [
                    "PlayCard",
                    "PlayerB",
                    "PlayerB_85",
                    {
                        "isPlayG": true
                    }
                ],
                "description": "Play G",
                "text": {
                    "id": "createPlayGEffect_PlayerB_85",
                    "title": [
                        "使用型",
                        [
                            "自軍",
                            "配備フェイズ"
                        ]
                    ],
                    "description": "PlayG",
                    "conditions": {
                        "出G上限": {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect, { DefineFn, GameStateFn, ToolFn: ToolFn2 }) {\n              const cardId2 = DefineFn.EffectFn.getCardID(effect), cardController = GameStateFn.getItemController(ctx3, cardId2), ps = GameStateFn.getPlayerState(ctx3, cardController);\n              if (ps.playGCount > 0)\n                throw new DefineFn.TipError(`\\u51FAG\\u4E0A\\u9650: ${ps.playGCount}`, { isPlayGLimit: !0 });\n              return ctx3 = GameStateFn.mapPlayerState(ctx3, cardController, (ps2) => {\n                return {\n                  ...ps2,\n                  playGCount: ps2.playGCount + 1\n                };\n              }), ctx3;\n            }"
                                }
                            ]
                        }
                    },
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect, { DefineFn, GameStateFn, ToolFn: ToolFn2 }) {\n              const cardId2 = DefineFn.EffectFn.getCardID(effect), from = GameStateFn.getItemBaSyou(ctx3, cardId2);\n              return ctx3 = GameStateFn.doItemMove(ctx3, DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"G\\u30BE\\u30FC\\u30F3\"), [cardId2, from]), ctx3;\n            }"
                                },
                                {
                                    "title": [
                                        "triggerEvent",
                                        {
                                            "title": [
                                                "プレイされて場に出た場合"
                                            ]
                                        }
                                    ]
                                },
                                {
                                    "title": [
                                        "triggerEvent",
                                        {
                                            "title": [
                                                "このカードがGとして場に出た場合"
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 1279,
            "description": "onSetPhase:配備フェイズ,フリータイミング"
        },
        {
            "id": 1278,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 1277,
            "description": "onSetPhase:配備フェイズ,フェイズ開始"
        },
        {
            "id": 1276,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 1275,
            "description": "onSetPhase:ドローフェイズ,フェイズ終了"
        },
        {
            "id": 1274,
            "description": "onSetPhase:ドローフェイズ,フリータイミング"
        },
        {
            "id": 1273,
            "description": "onEffectEnd: 抽牌階段規定效果"
        },
        {
            "id": 1272,
            "description": "onItemMove:PlayerB_104 = [\"PlayerB\",\"本国\"] => [\"PlayerB\",\"手札\"]",
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
            "id": 1271,
            "description": "onEvent: GameEventOnMove [\"PlayerB_104\"]",
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
            "id": 1270,
            "description": "PlayerB_104.isRoll undefined => false",
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
            "id": 1269,
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
            "id": 1268,
            "description": "onSetPhase:ドローフェイズ,規定の効果"
        },
        {
            "id": 1267,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 1266,
            "description": "onSetPhase:ドローフェイズ,フェイズ開始"
        },
        {
            "id": 1265,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 1264,
            "description": "onSetPhase:リロールフェイズ,フェイズ終了"
        },
        {
            "id": 1263,
            "description": "onSetPhase:リロールフェイズ,フリータイミング"
        },
        {
            "id": 1262,
            "description": "onEffectEnd: getRerollPhaseRuleEffect"
        },
        {
            "id": 1261,
            "description": "PlayerB_90.isRoll true => false",
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
            "id": 1260,
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
            "id": 1259,
            "description": "PlayerB_83.isRoll true => false",
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
            "id": 1258,
            "description": "PlayerB_72.isRoll true => false",
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
            "id": 1257,
            "description": "PlayerB_69.isRoll true => false",
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
            "id": 1256,
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
            "id": 1255,
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
            "id": 1254,
            "description": "onSetPhase:リロールフェイズ,規定の効果"
        },
        {
            "id": 1253,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 1252,
            "description": "onSetPhase:リロールフェイズ,フェイズ開始"
        },
        {
            "id": 1251,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 1250,
            "description": "onPlayerStateChange:PlayerA"
        },
        {
            "id": 1249,
            "description": "onSetPhase:戦闘フェイズ,ターン終了時,効果終了。ターン終了"
        },
        {
            "id": 1248,
            "description": "onSetPhase:戦闘フェイズ,ターン終了時,手札調整"
        },
        {
            "id": 1247,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 1246,
            "description": "onSetPhase:戦闘フェイズ,ターン終了時,効果解決"
        },
        {
            "id": 1245,
            "description": "onSetPhase:戦闘フェイズ,ターン終了時,ダメージリセット"
        },
        {
            "id": 1244,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 1243,
            "description": "onSetPhase:戦闘フェイズ,帰還ステップ,ステップ終了"
        },
        {
            "id": 1242,
            "description": "onSetPhase:戦闘フェイズ,帰還ステップ,フリータイミング2"
        },
        {
            "id": 1241,
            "description": "onEffectEnd: getReturnRuleEffect"
        },
        {
            "id": 1240,
            "description": "onItemMove:PlayerA_43 = [\"PlayerA\",\"戦闘エリア1\"] => [\"PlayerA\",\"配備エリア\"]",
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
            "id": 1239,
            "description": "onEvent: GameEventOnMove [\"PlayerA_43\"]",
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
            "id": 1238,
            "description": "PlayerA_43.isRoll false => true",
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
            "id": 1237,
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
            "id": 1236,
            "description": "onSetPhase:戦闘フェイズ,帰還ステップ,規定の効果"
        },
        {
            "id": 1235,
            "description": "onSetPhase:戦闘フェイズ,帰還ステップ,フリータイミング"
        },
        {
            "id": 1234,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 1233,
            "description": "onSetPhase:戦闘フェイズ,帰還ステップ,ステップ開始"
        },
        {
            "id": 1232,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 1231,
            "description": "onSetPhase:戦闘フェイズ,ダメージ判定ステップ,ステップ終了"
        },
        {
            "id": 1230,
            "description": "onSetPhase:戦闘フェイズ,ダメージ判定ステップ,フリータイミング2"
        },
        {
            "id": 1229,
            "description": "onEffectEnd: getDamageRuleEffect"
        },
        {
            "id": 1228,
            "description": "onEvent: このカードの部隊が敵軍本国に戦闘ダメージを与えた場合 [\"PlayerA_43\"]",
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
            "id": 1227,
            "description": "本國受到傷害: PlayerB => 5 damage",
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
            "id": 1226,
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
            "id": 1225,
            "description": "onItemMove:PlayerB_66 = [\"PlayerB\",\"本国\"] => [\"PlayerB\",\"捨て山\"]",
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
            "id": 1224,
            "description": "onEvent: GameEventOnMove [\"PlayerB_66\"]",
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
            "id": 1223,
            "description": "PlayerB_66.isRoll undefined => false",
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
            "id": 1222,
            "description": "onItemMove:PlayerB_70 = [\"PlayerB\",\"本国\"] => [\"PlayerB\",\"捨て山\"]",
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
            "id": 1221,
            "description": "onEvent: GameEventOnMove [\"PlayerB_70\"]",
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
            "id": 1220,
            "description": "PlayerB_70.isRoll undefined => false",
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
            "id": 1219,
            "description": "onItemMove:PlayerB_100 = [\"PlayerB\",\"本国\"] => [\"PlayerB\",\"捨て山\"]",
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
            "id": 1218,
            "description": "onEvent: GameEventOnMove [\"PlayerB_100\"]",
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
            "id": 1217,
            "description": "PlayerB_100.isRoll undefined => false",
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
            "id": 1216,
            "description": "onItemMove:PlayerB_67 = [\"PlayerB\",\"本国\"] => [\"PlayerB\",\"捨て山\"]",
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
            "id": 1215,
            "description": "onEvent: GameEventOnMove [\"PlayerB_67\"]",
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
            "id": 1214,
            "description": "PlayerB_67.isRoll undefined => false",
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
            "id": 1213,
            "description": "onItemMove:PlayerB_106 = [\"PlayerB\",\"本国\"] => [\"PlayerB\",\"捨て山\"]",
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
            "id": 1212,
            "description": "onEvent: GameEventOnMove [\"PlayerB_106\"]",
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
            "id": 1211,
            "description": "PlayerB_106.isRoll undefined => false",
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
            "id": 1210,
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
            "id": 1209,
            "description": "onSetPhase:戦闘フェイズ,ダメージ判定ステップ,規定の効果"
        },
        {
            "id": 1208,
            "description": "onEvent: カット終了時 undefined"
        },
        {
            "id": 1207,
            "description": "onEffectEnd: （自軍ダメージ判定ステップ）〔１〕：このカードは交戦中の場合、ターン終了時まで＋１／＋１／＋１を得る。または、このカードが非交戦中の場合、敵軍ユニット１枚の上に－１／－１／－１コイン１個を乗せる。"
        },
        {
            "id": 1206,
            "description": "onEffectStart: （自軍ダメージ判定ステップ）〔１〕：このカードは交戦中の場合、ターン終了時まで＋１／＋１／＋１を得る。または、このカードが非交戦中の場合、敵軍ユニット１枚の上に－１／－１／－１コイン１個を乗せる。",
            "effect": {
                "id": "addStackEffect_01928ac5-3c69-7114-a176-d8e6c32bc2d8",
                "reason": [
                    "PlayText",
                    "PlayerA",
                    "PlayerA_43",
                    "loadPrototype_179024_03B_U_WT042U_white_text_0"
                ],
                "description": "（自軍ダメージ判定ステップ）〔１〕：このカードは交戦中の場合、ターン終了時まで＋１／＋１／＋１を得る。または、このカードが非交戦中の場合、敵軍ユニット１枚の上に－１／－１／－１コイン１個を乗せる。",
                "text": {
                    "id": "loadPrototype_179024_03B_U_WT042U_white_text_0",
                    "title": [
                        "使用型",
                        [
                            "自軍",
                            "ダメージ判定ステップ"
                        ]
                    ],
                    "description": "（自軍ダメージ判定ステップ）〔１〕：このカードは交戦中の場合、ターン終了時まで＋１／＋１／＋１を得る。または、このカードが非交戦中の場合、敵軍ユニット１枚の上に－１／－１／－１コイン１個を乗せる。",
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx, effect, { DefineFn, GameStateFn, ToolFn }) {\n                                                    const cardId = DefineFn.EffectFn.getCardID(effect);\n                                                    if (GameStateFn.isBattle(ctx, cardId, null)) {\n                                                        ctx = GameStateFn.doItemSetGlobalEffectsUntilEndOfTurn(ctx, [\n                                                            {\n                                                                title: [\"＋x／＋x／＋xを得る\", [1, 1, 1]],\n                                                                cardIds: [cardId]\n                                                            }\n                                                        ], GameStateFn.createStrBaSyouPair(ctx, cardId));\n                                                        return ctx;\n                                                    }\n                                                    return GameStateFn.createActionTitleFn({\n                                                        title: [\"_－１／－１／－１コイン_１個を乗せる\", [-1, -1, -1], 1],\n                                                        vars: [\"このカードが非交戦中の場合、敵軍ユニット１枚\"]\n                                                    })(ctx, effect, null);\n                                                }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 1205,
            "description": "onEffectEnd: （自軍ダメージ判定ステップ）〔１〕：このカードは交戦中の場合、ターン終了時まで＋１／＋１／＋１を得る。または、このカードが非交戦中の場合、敵軍ユニット１枚の上に－１／－１／－１コイン１個を乗せる。"
        },
        {
            "id": 1204,
            "description": "PlayerA_49.isRoll false => true",
            "effect": {
                "id": "createPlayEffects_PlayerA_PlayerA_43_loadPrototype_179024_03B_U_WT042U_white_text_0",
                "reason": [
                    "PlayText",
                    "PlayerA",
                    "PlayerA_43",
                    "loadPrototype_179024_03B_U_WT042U_white_text_0"
                ],
                "description": "（自軍ダメージ判定ステップ）〔１〕：このカードは交戦中の場合、ターン終了時まで＋１／＋１／＋１を得る。または、このカードが非交戦中の場合、敵軍ユニット１枚の上に－１／－１／－１コイン１個を乗せる。",
                "text": {
                    "id": "loadPrototype_179024_03B_U_WT042U_white_text_0",
                    "title": [
                        "使用型",
                        [
                            "自軍",
                            "ダメージ判定ステップ"
                        ]
                    ],
                    "description": "（自軍ダメージ判定ステップ）〔１〕：このカードは交戦中の場合、ターン終了時まで＋１／＋１／＋１を得る。または、このカードが非交戦中の場合、敵軍ユニット１枚の上に－１／－１／－１コイン１個を乗せる。",
                    "conditions": {
                        "0[null]": {
                            "title": [
                                "RollColor",
                                null
                            ],
                            "actions": [
                                {
                                    "title": [
                                        "_ロールする",
                                        "ロール"
                                    ],
                                    "vars": [
                                        "0[null]"
                                    ]
                                }
                            ]
                        },
                        "このカードが非交戦中の場合、敵軍ユニット１枚": {
                            "title": "function _(ctx, effect, { DefineFn, GameStateFn }) {\n                        const cardId = DefineFn.EffectFn.getCardID(effect);\n                        if (GameStateFn.isBattle(ctx, cardId, null)) {\n                            return null;\n                        }\n                        return GameStateFn.createConditionTitleFn({\n                            title: [\"_交戦中の_自軍_ユニット_１枚\", null, \"敵軍\", \"ユニット\", 1]\n                        }, {})(ctx, effect, null);\n                    }"
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
                                    "title": "function _(ctx, effect, { DefineFn, GameStateFn, ToolFn }) {\n                                const newE = DefineFn.EffectFn.fromEffectBasic(effect, {\n                                    logicTreeAction: {\n                                        actions: [\n                                            {\n                                                title: function _(ctx, effect, { DefineFn, GameStateFn, ToolFn }) {\n                                                    const cardId = DefineFn.EffectFn.getCardID(effect);\n                                                    if (GameStateFn.isBattle(ctx, cardId, null)) {\n                                                        ctx = GameStateFn.doItemSetGlobalEffectsUntilEndOfTurn(ctx, [\n                                                            {\n                                                                title: [\"＋x／＋x／＋xを得る\", [1, 1, 1]],\n                                                                cardIds: [cardId]\n                                                            }\n                                                        ], GameStateFn.createStrBaSyouPair(ctx, cardId));\n                                                        return ctx;\n                                                    }\n                                                    return GameStateFn.createActionTitleFn({\n                                                        title: [\"_－１／－１／－１コイン_１個を乗せる\", [-1, -1, -1], 1],\n                                                        vars: [\"このカードが非交戦中の場合、敵軍ユニット１枚\"]\n                                                    })(ctx, effect, null);\n                                                }.toString()\n                                            }\n                                        ]\n                                    }\n                                });\n                                ctx = GameStateFn.addStackEffect(ctx, newE);\n                                return ctx;\n                            }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 1203,
            "description": "onEffectStart: （自軍ダメージ判定ステップ）〔１〕：このカードは交戦中の場合、ターン終了時まで＋１／＋１／＋１を得る。または、このカードが非交戦中の場合、敵軍ユニット１枚の上に－１／－１／－１コイン１個を乗せる。",
            "effect": {
                "id": "createPlayEffects_PlayerA_PlayerA_43_loadPrototype_179024_03B_U_WT042U_white_text_0",
                "reason": [
                    "PlayText",
                    "PlayerA",
                    "PlayerA_43",
                    "loadPrototype_179024_03B_U_WT042U_white_text_0"
                ],
                "description": "（自軍ダメージ判定ステップ）〔１〕：このカードは交戦中の場合、ターン終了時まで＋１／＋１／＋１を得る。または、このカードが非交戦中の場合、敵軍ユニット１枚の上に－１／－１／－１コイン１個を乗せる。",
                "text": {
                    "id": "loadPrototype_179024_03B_U_WT042U_white_text_0",
                    "title": [
                        "使用型",
                        [
                            "自軍",
                            "ダメージ判定ステップ"
                        ]
                    ],
                    "description": "（自軍ダメージ判定ステップ）〔１〕：このカードは交戦中の場合、ターン終了時まで＋１／＋１／＋１を得る。または、このカードが非交戦中の場合、敵軍ユニット１枚の上に－１／－１／－１コイン１個を乗せる。",
                    "conditions": {
                        "0[null]": {
                            "title": [
                                "RollColor",
                                null
                            ],
                            "actions": [
                                {
                                    "title": [
                                        "_ロールする",
                                        "ロール"
                                    ],
                                    "vars": [
                                        "0[null]"
                                    ]
                                }
                            ]
                        },
                        "このカードが非交戦中の場合、敵軍ユニット１枚": {
                            "title": "function _(ctx, effect, { DefineFn, GameStateFn }) {\n                        const cardId = DefineFn.EffectFn.getCardID(effect);\n                        if (GameStateFn.isBattle(ctx, cardId, null)) {\n                            return null;\n                        }\n                        return GameStateFn.createConditionTitleFn({\n                            title: [\"_交戦中の_自軍_ユニット_１枚\", null, \"敵軍\", \"ユニット\", 1]\n                        }, {})(ctx, effect, null);\n                    }"
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
                                    "title": "function _(ctx, effect, { DefineFn, GameStateFn, ToolFn }) {\n                                const newE = DefineFn.EffectFn.fromEffectBasic(effect, {\n                                    logicTreeAction: {\n                                        actions: [\n                                            {\n                                                title: function _(ctx, effect, { DefineFn, GameStateFn, ToolFn }) {\n                                                    const cardId = DefineFn.EffectFn.getCardID(effect);\n                                                    if (GameStateFn.isBattle(ctx, cardId, null)) {\n                                                        ctx = GameStateFn.doItemSetGlobalEffectsUntilEndOfTurn(ctx, [\n                                                            {\n                                                                title: [\"＋x／＋x／＋xを得る\", [1, 1, 1]],\n                                                                cardIds: [cardId]\n                                                            }\n                                                        ], GameStateFn.createStrBaSyouPair(ctx, cardId));\n                                                        return ctx;\n                                                    }\n                                                    return GameStateFn.createActionTitleFn({\n                                                        title: [\"_－１／－１／－１コイン_１個を乗せる\", [-1, -1, -1], 1],\n                                                        vars: [\"このカードが非交戦中の場合、敵軍ユニット１枚\"]\n                                                    })(ctx, effect, null);\n                                                }.toString()\n                                            }\n                                        ]\n                                    }\n                                });\n                                ctx = GameStateFn.addStackEffect(ctx, newE);\n                                return ctx;\n                            }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 1202,
            "description": "onSetPhase:戦闘フェイズ,ダメージ判定ステップ,フリータイミング"
        },
        {
            "id": 1201,
            "description": "onEvent: GameEventOnTiming undefined"
        }
    ],
    "messagesCurrentEffect": null,
    "messagesIsPlayerRead": {},
    "turn": 11,
    "setGroup": {
        "itemGroupParent": {
            "PlayerB_62": "PlayerB_74"
        },
        "itemGroupChildren": {
            "PlayerB_74": [
                "PlayerB_62"
            ]
        }
    },
    "stackEffectMemory": [],
    "flowMemory": {
        "state": "playing",
        "hasTriggerEvent": false,
        "hasPlayerPassPhase": {},
        "hasPlayerPassCut": {
            "PlayerB": true
        },
        "hasPlayerPassPayCost": {},
        "shouldTriggerStackEffectFinishedEvent": false,
        "activeEffectID": null,
        "activeLogicID": null,
        "activeLogicSubID": null
    }
}