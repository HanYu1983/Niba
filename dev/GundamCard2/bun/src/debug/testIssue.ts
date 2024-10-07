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
import { getPhase } from "../game/gameState/PhaseComponent"
import { Flow } from "../game/gameStateWithFlowMemory/Flow"
import { TableFns } from "../tool/table"
import { getCard, mapCard } from "../game/gameState/CardTableComponent"
import { getCardIdsCanPayRollCost, isCardMaster } from "../game/gameState/card"
import { clearGlobalEffects, getGlobalEffects } from "../game/gameState/globalEffects"
import { applyFlow } from "../game/gameStateWithFlowMemory/applyFlow"

export async function testIssue() {
    const whiteSpeed = ["179001_01A_CH_WT007R_white", "179004_01A_CH_WT009R_white", "179004_01A_CH_WT010C_white", "179007_02A_U_WT027U_white", "179007_02A_U_WT027U_white", "179008_02A_U_WT034U_white", "179008_02A_U_WT034U_white", "179008_02A_U_WT034U_white", "179014_03B_CH_WT027R_white", "179015_04B_U_WT067C_white", "179015_04B_U_WT067C_white", "179015_04B_U_WT067C_white", "179016_04B_U_WT074C_white", "179016_04B_U_WT074C_white", "179016_04B_U_WT074C_white", "179016_04B_U_WT075C_white", "179016_04B_U_WT075C_white", "179016_04B_U_WT075C_white", "179019_01A_C_WT010C_white", "179019_01A_C_WT010C_white", "179019_02A_U_WT028R_white", "179019_02A_U_WT028R_white", "179022_06C_CH_WT057R_white", "179022_06C_CH_WT057R_white", "179022_06C_CH_WT057R_white", "179022_06C_U_WT113R_white", "179022_06C_U_WT113R_white", "179022_06C_U_WT113R_white", "179023_06C_CH_WT067C_white", "179024_03B_U_WT057U_white", "179024_03B_U_WT057U_white", "179025_07D_C_WT060U_white", "179025_07D_CH_WT075C_white", "179025_07D_CH_WT075C_white", "179025_07D_CH_WT075C_white", "179027_09D_C_WT067R_white", "179027_09D_C_WT067R_white", "179029_B3C_CH_WT102R_white", "179029_B3C_CH_WT103N_white", "179029_B3C_U_WT196R_white", "179030_11E_C_WT077S_white", "179030_11E_C_WT077S_white", "179030_11E_C_WT077S_white", "179030_11E_CH_WT108N_white", "179901_00_C_WT003P_white", "179901_00_C_WT003P_white", "179901_00_C_WT003P_white", "179901_CG_C_WT001P_white", "179901_CG_C_WT001P_white", "179901_CG_CH_WT002P_white"]
    const blackT3 = ["179015_04B_O_BK010C_black", "179015_04B_O_BK010C_black", "179015_04B_U_BK058R_black", "179015_04B_U_BK058R_black", "179015_04B_U_BK059C_black", "179015_04B_U_BK059C_black", "179015_04B_U_BK061C_black", "179015_04B_U_BK061C_black", "179016_04B_U_BK066C_black", "179016_04B_U_BK066C_black", "179019_02A_C_BK015S_black", "179019_02A_C_BK015S_black", "179020_05C_U_BK100U_black", "179020_05C_U_BK100U_black", "179023_06C_C_BK048R_black", "179023_06C_C_BK048R_black", "179023_06C_C_BK049U_black", "179023_06C_C_BK049U_black", "179024_04B_C_BK027U_black", "179024_04B_C_BK027U_black", "179024_04B_U_BK060C_black", "179024_04B_U_BK060C_black", "179024_04B_U_BK067C_black", "179024_04B_U_BK067C_black", "179024_B2B_C_BK054C_black", "179024_B2B_C_BK054C_black", "179024_B2B_U_BK128S_black_02", "179024_B2B_U_BK128S_black_02", "179024_B2B_U_BK129R_black", "179024_B2B_U_BK129R_black", "179027_09D_C_BK063R_black", "179027_09D_C_BK063R_black", "179027_09D_O_BK010N_black", "179027_09D_O_BK010N_black", "179027_09D_U_BK163S_black", "179027_09D_U_BK163S_black", "179027_09D_U_BK163S_black", "179029_06C_C_BK045U_black", "179029_06C_C_BK045U_black", "179029_B3C_C_BK071N_black", "179029_B3C_C_BK071N_black", "179029_B3C_U_BK184N_black", "179029_B3C_U_BK184N_black", "179029_B3C_U_BK184N_black", "179029_B3C_U_BK185N_black", "179029_B3C_U_BK185N_black", "179030_11E_U_BK194S_2_black", "179030_11E_U_BK194S_2_black", "179030_11E_U_BK194S_2_black", "179901_B2B_C_BK005P_black"]
    await Promise.all([...blackT3, ...whiteSpeed].map(loadPrototype))
    let ctx = TMP_CTX
    if(isCardMaster(ctx, "PlayerA_30", "PlayerA_24") != true){
        throw new Error()
    }
    ctx = clearGlobalEffects(ctx) as GameStateWithFlowMemory
    console.log(getGlobalEffects(ctx, null))
    //throw new Error()
}

const TMP_CTX: GameStateWithFlowMemory = {
    "isGameState": true,
    "cards": {
        "PlayerA_0": {
            "id": "PlayerA_0",
            "protoID": "179001_01A_CH_WT007R_white",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_1": {
            "id": "PlayerA_1",
            "protoID": "179004_01A_CH_WT009R_white",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_2": {
            "id": "PlayerA_2",
            "protoID": "179004_01A_CH_WT010C_white",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_3": {
            "id": "PlayerA_3",
            "protoID": "179007_02A_U_WT027U_white",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_4": {
            "id": "PlayerA_4",
            "protoID": "179007_02A_U_WT027U_white",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_5": {
            "id": "PlayerA_5",
            "protoID": "179008_02A_U_WT034U_white",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_6": {
            "id": "PlayerA_6",
            "protoID": "179008_02A_U_WT034U_white",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_7": {
            "id": "PlayerA_7",
            "protoID": "179015_04B_U_WT067C_white",
            "ownerID": "PlayerA",
            "isFaceDown": false,
            "isRoll": false
        },
        "PlayerA_8": {
            "id": "PlayerA_8",
            "protoID": "179014_03B_CH_WT027R_white",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_9": {
            "id": "PlayerA_9",
            "protoID": "179015_04B_U_WT067C_white",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_10": {
            "id": "PlayerA_10",
            "protoID": "179008_02A_U_WT034U_white",
            "ownerID": "PlayerA",
            "isFaceDown": false,
            "isRoll": false
        },
        "PlayerA_11": {
            "id": "PlayerA_11",
            "protoID": "179015_04B_U_WT067C_white",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_12": {
            "id": "PlayerA_12",
            "protoID": "179016_04B_U_WT074C_white",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_13": {
            "id": "PlayerA_13",
            "protoID": "179016_04B_U_WT074C_white",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_14": {
            "id": "PlayerA_14",
            "protoID": "179016_04B_U_WT074C_white",
            "ownerID": "PlayerA",
            "isFaceDown": false,
            "isRoll": false
        },
        "PlayerA_15": {
            "id": "PlayerA_15",
            "protoID": "179016_04B_U_WT075C_white",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_16": {
            "id": "PlayerA_16",
            "protoID": "179016_04B_U_WT075C_white",
            "ownerID": "PlayerA",
            "isFaceDown": false,
            "isRoll": false
        },
        "PlayerA_17": {
            "id": "PlayerA_17",
            "protoID": "179016_04B_U_WT075C_white",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_18": {
            "id": "PlayerA_18",
            "protoID": "179019_01A_C_WT010C_white",
            "ownerID": "PlayerA",
            "isFaceDown": true,
            "isRoll": false
        },
        "PlayerA_19": {
            "id": "PlayerA_19",
            "protoID": "179019_01A_C_WT010C_white",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_20": {
            "id": "PlayerA_20",
            "protoID": "179019_02A_U_WT028R_white",
            "ownerID": "PlayerA",
            "isFaceDown": false,
            "isRoll": false
        },
        "PlayerA_21": {
            "id": "PlayerA_21",
            "protoID": "179019_02A_U_WT028R_white",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_22": {
            "id": "PlayerA_22",
            "protoID": "179022_06C_CH_WT057R_white",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_23": {
            "id": "PlayerA_23",
            "protoID": "179022_06C_CH_WT057R_white",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_24": {
            "id": "PlayerA_24",
            "protoID": "179022_06C_CH_WT057R_white",
            "ownerID": "PlayerA",
            "isFaceDown": false,
            "isRoll": false
        },
        "PlayerA_25": {
            "id": "PlayerA_25",
            "protoID": "179022_06C_U_WT113R_white",
            "ownerID": "PlayerA",
            "isFaceDown": true,
            "isRoll": false
        },
        "PlayerA_26": {
            "id": "PlayerA_26",
            "protoID": "179022_06C_U_WT113R_white",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_27": {
            "id": "PlayerA_27",
            "protoID": "179022_06C_U_WT113R_white",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_28": {
            "id": "PlayerA_28",
            "protoID": "179023_06C_CH_WT067C_white",
            "ownerID": "PlayerA",
            "isFaceDown": false,
            "isRoll": false
        },
        "PlayerA_29": {
            "id": "PlayerA_29",
            "protoID": "179024_03B_U_WT057U_white",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_30": {
            "id": "PlayerA_30",
            "protoID": "179024_03B_U_WT057U_white",
            "ownerID": "PlayerA",
            "isFaceDown": false,
            "isRoll": false
        },
        "PlayerA_31": {
            "id": "PlayerA_31",
            "protoID": "179025_07D_C_WT060U_white",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_32": {
            "id": "PlayerA_32",
            "protoID": "179025_07D_CH_WT075C_white",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_33": {
            "id": "PlayerA_33",
            "protoID": "179025_07D_CH_WT075C_white",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_34": {
            "id": "PlayerA_34",
            "protoID": "179025_07D_CH_WT075C_white",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_35": {
            "id": "PlayerA_35",
            "protoID": "179027_09D_C_WT067R_white",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_36": {
            "id": "PlayerA_36",
            "protoID": "179027_09D_C_WT067R_white",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_37": {
            "id": "PlayerA_37",
            "protoID": "179029_B3C_CH_WT102R_white",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_38": {
            "id": "PlayerA_38",
            "protoID": "179029_B3C_CH_WT103N_white",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_39": {
            "id": "PlayerA_39",
            "protoID": "179029_B3C_U_WT196R_white",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_40": {
            "id": "PlayerA_40",
            "protoID": "179030_11E_C_WT077S_white",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_41": {
            "id": "PlayerA_41",
            "protoID": "179030_11E_C_WT077S_white",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_42": {
            "id": "PlayerA_42",
            "protoID": "179030_11E_C_WT077S_white",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_43": {
            "id": "PlayerA_43",
            "protoID": "179030_11E_CH_WT108N_white",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_44": {
            "id": "PlayerA_44",
            "protoID": "179901_00_C_WT003P_white",
            "ownerID": "PlayerA",
            "isFaceDown": false,
            "isRoll": false
        },
        "PlayerA_45": {
            "id": "PlayerA_45",
            "protoID": "179901_00_C_WT003P_white",
            "ownerID": "PlayerA",
            "isFaceDown": false,
            "isRoll": false
        },
        "PlayerA_46": {
            "id": "PlayerA_46",
            "protoID": "179901_00_C_WT003P_white",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_47": {
            "id": "PlayerA_47",
            "protoID": "179901_CG_C_WT001P_white",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_48": {
            "id": "PlayerA_48",
            "protoID": "179901_CG_C_WT001P_white",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_49": {
            "id": "PlayerA_49",
            "protoID": "179901_CG_CH_WT002P_white",
            "ownerID": "PlayerA",
            "isFaceDown": false,
            "isRoll": false
        },
        "PlayerB_50": {
            "id": "PlayerB_50",
            "protoID": "179015_04B_O_BK010C_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "PlayerB_51": {
            "id": "PlayerB_51",
            "protoID": "179015_04B_O_BK010C_black",
            "ownerID": "PlayerB",
            "isFaceDown": true,
            "isRoll": false
        },
        "PlayerB_52": {
            "id": "PlayerB_52",
            "protoID": "179015_04B_U_BK058R_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "PlayerB_53": {
            "id": "PlayerB_53",
            "protoID": "179015_04B_U_BK058R_black",
            "ownerID": "PlayerB",
            "isFaceDown": true,
            "isRoll": false
        },
        "PlayerB_54": {
            "id": "PlayerB_54",
            "protoID": "179015_04B_U_BK059C_black",
            "ownerID": "PlayerB",
            "isFaceDown": true,
            "isRoll": false
        },
        "PlayerB_55": {
            "id": "PlayerB_55",
            "protoID": "179015_04B_U_BK059C_black",
            "ownerID": "PlayerB",
            "isFaceDown": true,
            "isRoll": false
        },
        "PlayerB_56": {
            "id": "PlayerB_56",
            "protoID": "179015_04B_U_BK061C_black",
            "ownerID": "PlayerB",
            "isFaceDown": true,
            "isRoll": false
        },
        "PlayerB_57": {
            "id": "PlayerB_57",
            "protoID": "179015_04B_U_BK061C_black",
            "ownerID": "PlayerB",
            "isFaceDown": true,
            "isRoll": false
        },
        "PlayerB_58": {
            "id": "PlayerB_58",
            "protoID": "179016_04B_U_BK066C_black",
            "ownerID": "PlayerB",
            "isFaceDown": false,
            "isRoll": false
        },
        "PlayerB_59": {
            "id": "PlayerB_59",
            "protoID": "179016_04B_U_BK066C_black",
            "ownerID": "PlayerB",
            "isFaceDown": true,
            "isRoll": false
        },
        "PlayerB_60": {
            "id": "PlayerB_60",
            "protoID": "179019_02A_C_BK015S_black",
            "ownerID": "PlayerB",
            "isFaceDown": true,
            "isRoll": false
        },
        "PlayerB_61": {
            "id": "PlayerB_61",
            "protoID": "179019_02A_C_BK015S_black",
            "ownerID": "PlayerB",
            "isFaceDown": true,
            "isRoll": false
        },
        "PlayerB_62": {
            "id": "PlayerB_62",
            "protoID": "179020_05C_U_BK100U_black",
            "ownerID": "PlayerB",
            "isFaceDown": true,
            "isRoll": false
        },
        "PlayerB_63": {
            "id": "PlayerB_63",
            "protoID": "179020_05C_U_BK100U_black",
            "ownerID": "PlayerB",
            "isFaceDown": false,
            "isRoll": true
        },
        "PlayerB_64": {
            "id": "PlayerB_64",
            "protoID": "179023_06C_C_BK048R_black",
            "ownerID": "PlayerB",
            "isFaceDown": true,
            "isRoll": false
        },
        "PlayerB_65": {
            "id": "PlayerB_65",
            "protoID": "179023_06C_C_BK048R_black",
            "ownerID": "PlayerB",
            "isFaceDown": true,
            "isRoll": false
        },
        "PlayerB_66": {
            "id": "PlayerB_66",
            "protoID": "179023_06C_C_BK049U_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "PlayerB_67": {
            "id": "PlayerB_67",
            "protoID": "179023_06C_C_BK049U_black",
            "ownerID": "PlayerB",
            "isFaceDown": true,
            "isRoll": false
        },
        "PlayerB_68": {
            "id": "PlayerB_68",
            "protoID": "179024_04B_C_BK027U_black",
            "ownerID": "PlayerB",
            "isFaceDown": false,
            "isRoll": false
        },
        "PlayerB_69": {
            "id": "PlayerB_69",
            "protoID": "179024_04B_C_BK027U_black",
            "ownerID": "PlayerB",
            "isFaceDown": false,
            "isRoll": false
        },
        "PlayerB_70": {
            "id": "PlayerB_70",
            "protoID": "179024_04B_U_BK060C_black",
            "ownerID": "PlayerB",
            "isFaceDown": true,
            "isRoll": false
        },
        "PlayerB_71": {
            "id": "PlayerB_71",
            "protoID": "179024_04B_U_BK060C_black",
            "ownerID": "PlayerB",
            "isFaceDown": true,
            "isRoll": false
        },
        "PlayerB_72": {
            "id": "PlayerB_72",
            "protoID": "179024_04B_U_BK067C_black",
            "ownerID": "PlayerB",
            "isFaceDown": true,
            "isRoll": false
        },
        "PlayerB_73": {
            "id": "PlayerB_73",
            "protoID": "179024_04B_U_BK067C_black",
            "ownerID": "PlayerB",
            "isFaceDown": true,
            "isRoll": false
        },
        "PlayerB_74": {
            "id": "PlayerB_74",
            "protoID": "179024_B2B_C_BK054C_black",
            "ownerID": "PlayerB",
            "isFaceDown": true,
            "isRoll": false
        },
        "PlayerB_75": {
            "id": "PlayerB_75",
            "protoID": "179024_B2B_C_BK054C_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "PlayerB_76": {
            "id": "PlayerB_76",
            "protoID": "179024_B2B_U_BK128S_black_02",
            "ownerID": "PlayerB",
            "isFaceDown": true,
            "isRoll": false
        },
        "PlayerB_77": {
            "id": "PlayerB_77",
            "protoID": "179024_B2B_U_BK128S_black_02",
            "ownerID": "PlayerB",
            "isFaceDown": false,
            "isRoll": false
        },
        "PlayerB_78": {
            "id": "PlayerB_78",
            "protoID": "179024_B2B_U_BK129R_black",
            "ownerID": "PlayerB",
            "isFaceDown": false,
            "isRoll": false
        },
        "PlayerB_79": {
            "id": "PlayerB_79",
            "protoID": "179024_B2B_U_BK129R_black",
            "ownerID": "PlayerB",
            "isFaceDown": true,
            "isRoll": false
        },
        "PlayerB_80": {
            "id": "PlayerB_80",
            "protoID": "179027_09D_C_BK063R_black",
            "ownerID": "PlayerB",
            "isFaceDown": false,
            "isRoll": false
        },
        "PlayerB_81": {
            "id": "PlayerB_81",
            "protoID": "179027_09D_C_BK063R_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "PlayerB_82": {
            "id": "PlayerB_82",
            "protoID": "179027_09D_O_BK010N_black",
            "ownerID": "PlayerB",
            "isFaceDown": false,
            "isRoll": false
        },
        "PlayerB_83": {
            "id": "PlayerB_83",
            "protoID": "179027_09D_O_BK010N_black",
            "ownerID": "PlayerB",
            "isFaceDown": true,
            "isRoll": false
        },
        "PlayerB_84": {
            "id": "PlayerB_84",
            "protoID": "179027_09D_U_BK163S_black",
            "ownerID": "PlayerB",
            "isFaceDown": true,
            "isRoll": false
        },
        "PlayerB_85": {
            "id": "PlayerB_85",
            "protoID": "179027_09D_U_BK163S_black",
            "ownerID": "PlayerB",
            "isFaceDown": true,
            "isRoll": false
        },
        "PlayerB_86": {
            "id": "PlayerB_86",
            "protoID": "179027_09D_U_BK163S_black",
            "ownerID": "PlayerB",
            "isFaceDown": true,
            "isRoll": false
        },
        "PlayerB_87": {
            "id": "PlayerB_87",
            "protoID": "179029_06C_C_BK045U_black",
            "ownerID": "PlayerB",
            "isFaceDown": true,
            "isRoll": false
        },
        "PlayerB_88": {
            "id": "PlayerB_88",
            "protoID": "179029_06C_C_BK045U_black",
            "ownerID": "PlayerB",
            "isFaceDown": false,
            "isRoll": false
        },
        "PlayerB_89": {
            "id": "PlayerB_89",
            "protoID": "179029_B3C_C_BK071N_black",
            "ownerID": "PlayerB",
            "isFaceDown": false,
            "isRoll": false
        },
        "PlayerB_90": {
            "id": "PlayerB_90",
            "protoID": "179029_B3C_C_BK071N_black",
            "ownerID": "PlayerB",
            "isFaceDown": false,
            "isRoll": false
        },
        "PlayerB_91": {
            "id": "PlayerB_91",
            "protoID": "179029_B3C_U_BK184N_black",
            "ownerID": "PlayerB",
            "isFaceDown": true,
            "isRoll": false
        },
        "PlayerB_92": {
            "id": "PlayerB_92",
            "protoID": "179029_B3C_U_BK184N_black",
            "ownerID": "PlayerB",
            "isFaceDown": true,
            "isRoll": false
        },
        "PlayerB_93": {
            "id": "PlayerB_93",
            "protoID": "179029_B3C_U_BK184N_black",
            "ownerID": "PlayerB",
            "isFaceDown": true,
            "isRoll": false
        },
        "PlayerB_94": {
            "id": "PlayerB_94",
            "protoID": "179029_B3C_U_BK185N_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "PlayerB_95": {
            "id": "PlayerB_95",
            "protoID": "179029_B3C_U_BK185N_black",
            "ownerID": "PlayerB",
            "isFaceDown": true,
            "isRoll": false
        },
        "PlayerB_96": {
            "id": "PlayerB_96",
            "protoID": "179030_11E_U_BK194S_2_black",
            "ownerID": "PlayerB",
            "isFaceDown": true,
            "isRoll": false
        },
        "PlayerB_97": {
            "id": "PlayerB_97",
            "protoID": "179030_11E_U_BK194S_2_black",
            "ownerID": "PlayerB",
            "isFaceDown": true,
            "isRoll": false
        },
        "PlayerB_98": {
            "id": "PlayerB_98",
            "protoID": "179030_11E_U_BK194S_2_black",
            "ownerID": "PlayerB",
            "isFaceDown": true,
            "isRoll": false
        },
        "PlayerB_99": {
            "id": "PlayerB_99",
            "protoID": "179901_B2B_C_BK005P_black",
            "ownerID": "PlayerB",
            "isFaceDown": true,
            "isRoll": false
        },
        "PlayerA_100": {
            "id": "PlayerA_100",
            "protoID": "179008_02A_U_WT034U_white",
            "ownerID": "PlayerA",
            "isRoll": false
        },
        "PlayerA_101": {
            "id": "PlayerA_101",
            "protoID": "179008_02A_U_WT034U_white",
            "ownerID": "PlayerA",
            "isRoll": false
        },
        "PlayerA_102": {
            "id": "PlayerA_102",
            "protoID": "179014_03B_CH_WT027R_white",
            "ownerID": "PlayerA",
            "isRoll": false
        },
        "PlayerA_103": {
            "id": "PlayerA_103",
            "protoID": "179016_04B_U_WT074C_white",
            "ownerID": "PlayerA",
            "isRoll": false
        },
        "PlayerB_104": {
            "id": "PlayerB_104",
            "protoID": "179015_04B_U_BK061C_black",
            "ownerID": "PlayerB",
            "isRoll": true
        },
        "PlayerB_105": {
            "id": "PlayerB_105",
            "protoID": "179015_04B_U_BK061C_black",
            "ownerID": "PlayerB",
            "isRoll": true
        },
        "PlayerB_106": {
            "id": "PlayerB_106",
            "protoID": "179016_04B_U_BK066C_black",
            "ownerID": "PlayerB",
            "isRoll": true
        },
        "PlayerB_107": {
            "id": "PlayerB_107",
            "protoID": "179020_05C_U_BK100U_black",
            "ownerID": "PlayerB",
            "isRoll": false,
            "isFaceDown": false
        }
    },
    "effects": {
        "createPlayCardEffects_PlayerA_18": {
            "id": "createPlayCardEffects_PlayerA_18",
            "reason": [
                "PlayCard",
                "PlayerA",
                "PlayerA_18",
                {
                    "isPlayUnit": false,
                    "isPlayCharacter": false
                }
            ],
            "description": "Play",
            "text": {
                "id": "createPlayCardEffects_text_PlayerA_18",
                "title": [
                    "使用型",
                    [
                        "戦闘フェイズ"
                    ]
                ],
                "description": "Play",
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
                        ],
                        "groupKey": "支付橫置國力"
                    },
                    "自軍ユニット１枚": {
                        "title": [
                            "_自軍_ユニット_１枚",
                            "自軍",
                            "ユニット",
                            1
                        ]
                    },
                    "「速攻」または「高機動」": {
                        "title": "function _(ctx, effect, { DefineFn, GameStateFn }) {\n                    return {\n                        title: [\"StringOptions\", [\"速攻\", \"高機動\"], [\"速攻\"]],\n                        count: 1,\n                    };\n                }"
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
                                    "value": "0[白]"
                                },
                                {
                                    "type": "Leaf",
                                    "value": "自軍ユニット１枚"
                                },
                                {
                                    "type": "Leaf",
                                    "value": "「速攻」または「高機動」"
                                }
                            ]
                        },
                        "actions": [
                            {
                                "title": "function _(ctx3, effect, { DefineFn, GameStateFn, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn.EffectFn.getCardID(effect), prototype2 = GameStateFn.getItemPrototype(ctx3, cardId2), from = GameStateFn.getItemBaSyou(ctx3, cardId2);\n                if (ctx3 = GameStateFn.doItemMove(ctx3, DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u3044\\u308B\\u30AB\\u30FC\\u30C9\"), [cardId2, from]), prototype2.category == \"\\u30E6\\u30CB\\u30C3\\u30C8\")\n                  return GameStateFn.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn.EffectFn.getPlayerID(effect), DefineFn.EffectFn.getCardID(effect)],\n                    description: effect.text.description,\n                    text: {\n                      id: effect.text.id,\n                      description: effect.text.description,\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect2, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                                const cardId3 = DefineFn2.EffectFn.getCardID(effect2), from2 = GameStateFn2.getItemBaSyou(ctx4, cardId3), to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\");\n                                ctx4 = GameStateFn2.doItemMove(ctx4, to, [cardId3, from2]);\n                                const hasHigh = GameStateFn2.getCardHasSpeicalEffect(ctx4, [\"\\u6226\\u95D8\\u914D\\u5099\"], cardId3), hasPS = GameStateFn2.getCardHasSpeicalEffect(ctx4, [\"PS\\u88C5\\u7532\"], cardId3), isRoll = (hasHigh || hasPS) == !1;\n                                return ctx4 = GameStateFn2.doItemSetRollState(ctx4, isRoll, [cardId3, GameStateFn2.getItemBaSyou(ctx4, cardId3)], { isSkipTargetMissing: !0 }), ctx4 = GameStateFn2.doTriggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] }), ctx4;\n                              }.toString()\n                            }\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                if (prototype2.category == \"\\u30AD\\u30E3\\u30E9\\u30AF\\u30BF\\u30FC\" || prototype2.category == \"\\u30AA\\u30DA\\u30EC\\u30FC\\u30B7\\u30E7\\u30F3(\\u30E6\\u30CB\\u30C3\\u30C8)\")\n                  return GameStateFn.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn.EffectFn.getPlayerID(effect), DefineFn.EffectFn.getCardID(effect)],\n                    description: effect.text.description,\n                    text: {\n                      id: effect.text.id,\n                      description: effect.text.description,\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect2, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                                const cardId3 = DefineFn2.EffectFn.getCardID(effect2), pairs = GameStateFn2.getCardTipStrBaSyouPairs(ctx4, \"\\u4E00\\u500B\\u81EA\\u8ECD\\u6A5F\\u9AD4\", cardId3);\n                                if (pairs.length == 0)\n                                  throw new Error(`pairs must not 0: ${effect2.text.description}`);\n                                const [targetCardId, targetBasyou] = pairs[0], from2 = GameStateFn2.getItemBaSyou(ctx4, cardId3), to = targetBasyou;\n                                ctx4 = GameStateFn2.doItemMove(ctx4, to, [cardId3, from2]);\n                                const isRoll = GameStateFn2.getCard(ctx4, targetCardId).isRoll || !1;\n                                return ctx4 = GameStateFn2.mapCard(ctx4, cardId3, (is) => ({ ...is, isRoll })), ctx4 = GameStateFn2.setSetGroupParent(ctx4, targetCardId, cardId3), ctx4 = GameStateFn2.doTriggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] }), ctx4 = GameStateFn2.doTriggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u30BB\\u30C3\\u30C8\\u3055\\u308C\\u305F\\u5834\\u5408\"], cardIds: [cardId3] }), ctx4;\n                              }.toString()\n                            }\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                if (prototype2.category == \"\\u30B3\\u30DE\\u30F3\\u30C9\")\n                  return GameStateFn.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn.EffectFn.getPlayerID(effect), DefineFn.EffectFn.getCardID(effect)],\n                    description: effect.text.description,\n                    text: {\n                      id: prototype2.commandText?.id || `getPlayCardEffects_commentText_${cardId2}`,\n                      description: prototype2.commandText?.description || \"unknown\",\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect2, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                                const cardId3 = DefineFn2.EffectFn.getCardID(effect2), from2 = GameStateFn2.getItemBaSyou(ctx4, cardId3), to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u30B8\\u30E3\\u30F3\\u30AF\\u30E4\\u30FC\\u30C9\");\n                                return ctx4 = GameStateFn2.doItemMove(ctx4, to, [cardId3, from2]), ctx4 = GameStateFn2.doTriggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] }), ctx4;\n                              }.toString()\n                            },\n                            ...prototype2.commandText?.logicTreeActions?.[0]?.actions || []\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                if (prototype2.category == \"\\u30B0\\u30E9\\u30D5\\u30A3\\u30C3\\u30AF\") {\n                  const cardId3 = DefineFn.EffectFn.getCardID(effect), from2 = GameStateFn.getItemBaSyou(ctx3, cardId3), to = DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"G\\u30BE\\u30FC\\u30F3\");\n                  return ctx3 = GameStateFn.doItemMove(ctx3, to, [cardId3, from2]), ctx3 = GameStateFn.doTriggerEvent(ctx3, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] }), ctx3;\n                }\n                if (prototype2.category == \"\\u30AA\\u30DA\\u30EC\\u30FC\\u30B7\\u30E7\\u30F3\") {\n                  const cardId3 = DefineFn.EffectFn.getCardID(effect), from2 = GameStateFn.getItemBaSyou(ctx3, cardId3), to = DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\");\n                  return ctx3 = GameStateFn.doItemMove(ctx3, to, [cardId3, from2]), ctx3 = GameStateFn.doTriggerEvent(ctx3, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] }), ctx3;\n                }\n                if (prototype2.category == \"ACE\")\n                  throw new Error(`not support category: ${prototype2.category}`);\n                return ctx3;\n              }"
                            }
                        ]
                    }
                ]
            }
        },
        "createPlayEffects_PlayerA_PlayerA_49_loadPrototype_179901_CG_CH_WT002P_white_text_0": {
            "id": "createPlayEffects_PlayerA_PlayerA_49_loadPrototype_179901_CG_CH_WT002P_white_text_0",
            "reason": [
                "PlayText",
                "PlayerA",
                "PlayerA_49",
                "loadPrototype_179901_CG_CH_WT002P_white_text_0"
            ],
            "description": "（戦闘フェイズ）〔R〕：自軍キャラ１枚は、ターン終了時まで、＋２／＋２／＋２を得る。",
            "text": {
                "id": "loadPrototype_179901_CG_CH_WT002P_white_text_0",
                "description": "（戦闘フェイズ）〔R〕：自軍キャラ１枚は、ターン終了時まで、＋２／＋２／＋２を得る。",
                "title": [
                    "使用型",
                    [
                        "戦闘フェイズ"
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
                            "Entity",
                            {
                                "atBa": true,
                                "side": "自軍",
                                "is": [
                                    "キャラクター"
                                ],
                                "count": 1
                            }
                        ]
                    },
                    "同回合上限": {
                        "actions": [
                            {
                                "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn2.EffectFn.getCardID(effect);\n                if (GameStateFn2.getItemState(ctx3, cardId2).textIdsUseThisTurn?.[effect.text.id])\n                  throw new DefineFn2.TipError(`\\u540C\\u56DE\\u5408\\u4E0A\\u9650: ${effect.text.description}`);\n                return ctx3 = GameStateFn2.mapItemState(ctx3, cardId2, (ps2) => {\n                  return {\n                    ...ps2,\n                    textIdsUseThisTurn: {\n                      ...ps2.textIdsUseThisTurn,\n                      [effect.text.id]: !0\n                    }\n                  };\n                }), ctx3;\n              }"
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
                                                            "＋x／＋x／＋xを得る",
                                                            [
                                                                2,
                                                                2,
                                                                2
                                                            ]
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
        },
        "createPlayEffects_PlayerA_PlayerA_49_loadPrototype_179901_CG_CH_WT002P_white_text_1": {
            "id": "createPlayEffects_PlayerA_PlayerA_49_loadPrototype_179901_CG_CH_WT002P_white_text_1",
            "reason": [
                "PlayText",
                "PlayerA",
                "PlayerA_49",
                "loadPrototype_179901_CG_CH_WT002P_white_text_1"
            ],
            "description": "這張卡以外的自軍機體1張重置",
            "text": {
                "id": "loadPrototype_179901_CG_CH_WT002P_white_text_1",
                "title": [
                    "使用型",
                    [
                        "自軍",
                        "攻撃ステップ"
                    ]
                ],
                "description": "這張卡以外的自軍機體1張重置",
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
                        ],
                        "groupKey": "支付橫置國力"
                    },
                    "這張卡以外的自軍機體1張": {
                        "title": [
                            "_自軍_ユニット_１枚",
                            "自軍",
                            "ユニット",
                            1
                        ],
                        "exceptItemSelf": true
                    },
                    "同回合上限": {
                        "actions": [
                            {
                                "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn2.EffectFn.getCardID(effect);\n                if (GameStateFn2.getItemState(ctx3, cardId2).textIdsUseThisTurn?.[effect.text.id])\n                  throw new DefineFn2.TipError(`\\u540C\\u56DE\\u5408\\u4E0A\\u9650: ${effect.text.description}`);\n                return ctx3 = GameStateFn2.mapItemState(ctx3, cardId2, (ps2) => {\n                  return {\n                    ...ps2,\n                    textIdsUseThisTurn: {\n                      ...ps2.textIdsUseThisTurn,\n                      [effect.text.id]: !0\n                    }\n                  };\n                }), ctx3;\n              }"
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
                                                "リロール"
                                            ],
                                            "vars": [
                                                "這張卡以外的自軍機體1張"
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
        "createPlayEffects_PlayerA_PlayerA_30_loadPrototype_179024_03B_U_WT057U_white_text_0": {
            "id": "createPlayEffects_PlayerA_PlayerA_30_loadPrototype_179024_03B_U_WT057U_white_text_0",
            "reason": [
                "PlayText",
                "PlayerA",
                "PlayerA_30",
                "loadPrototype_179024_03B_U_WT057U_white_text_0"
            ],
            "description": "（戦闘フェイズ）〔２〕：「特徴：アストレイ系」を持つ自軍ユニット１枚は、ターン終了時まで、戦闘力に＋４を振り分けて得る。",
            "text": {
                "id": "loadPrototype_179024_03B_U_WT057U_white_text_0",
                "description": "（戦闘フェイズ）〔２〕：「特徴：アストレイ系」を持つ自軍ユニット１枚は、ターン終了時まで、戦闘力に＋４を振り分けて得る。",
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
                    "「特徴：アストレイ系」を持つ自軍ユニット１枚": {
                        "title": [
                            "_本来の記述に｢特徴：_装弾｣を持つ_自軍_G_１枚",
                            false,
                            "アストレイ系",
                            "自軍",
                            "ユニット",
                            1
                        ]
                    },
                    "同回合上限": {
                        "actions": [
                            {
                                "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn2.EffectFn.getCardID(effect);\n                if (GameStateFn2.getItemState(ctx3, cardId2).textIdsUseThisTurn?.[effect.text.id])\n                  throw new DefineFn2.TipError(`\\u540C\\u56DE\\u5408\\u4E0A\\u9650: ${effect.text.description}`);\n                return ctx3 = GameStateFn2.mapItemState(ctx3, cardId2, (ps2) => {\n                  return {\n                    ...ps2,\n                    textIdsUseThisTurn: {\n                      ...ps2.textIdsUseThisTurn,\n                      [effect.text.id]: !0\n                    }\n                  };\n                }), ctx3;\n              }"
                            }
                        ]
                    }
                },
                "logicTreeActions": [
                    {
                        "actions": [
                            {
                                "title": "function _(ctx, effect, { DefineFn, GameStateFn }) {\n                                const newE = DefineFn.EffectFn.fromEffectBasic(effect, {\n                                    conditions: {\n                                        \"戦闘力に＋４を振り分けて\": {\n                                            title: function _(ctx, effect, { DefineFn, GameStateFn }) {\n                                                return {\n                                                    title: [\"BattleBonus\", [[4, 0, 0]], [[4, 0, 0]]],\n                                                    count: 1\n                                                };\n                                            }.toString()\n                                        }\n                                    },\n                                    logicTreeAction: {\n                                        actions: [\n                                            {\n                                                title: function _(ctx, effect, { DefineFn, GameStateFn }) {\n                                                    const cardId = DefineFn.EffectFn.getCardID(effect);\n                                                    const bonus = GameStateFn.getCardTipBattleBonus(ctx, \"戦闘力に＋４を振り分けて\", cardId)[0];\n                                                    ctx = GameStateFn.doItemSetGlobalEffectsUntilEndOfTurn(ctx, [{ title: [\"＋x／＋x／＋xを得る\", bonus], cardIds: [cardId] }], GameStateFn.createStrBaSyouPair(ctx, cardId));\n                                                    return ctx;\n                                                }.toString()\n                                            }\n                                        ]\n                                    }\n                                });\n                                ctx = GameStateFn.addStackEffect(ctx, newE);\n                                return ctx;\n                            }"
                            }
                        ]
                    }
                ]
            }
        },
        "createPlayEffects_PlayerA_PlayerA_30_loadPrototype_179024_03B_U_WT057U_white_text_1": {
            "id": "createPlayEffects_PlayerA_PlayerA_30_loadPrototype_179024_03B_U_WT057U_white_text_1",
            "reason": [
                "PlayText",
                "PlayerA",
                "PlayerA_30",
                "loadPrototype_179024_03B_U_WT057U_white_text_1"
            ],
            "description": "打開自軍手裡或指定HANGER中特徵A並合計國力x以下的1張卡, 和這張卡重置狀態置換, 這張卡置換後廢棄. x為自軍G的張數",
            "text": {
                "id": "loadPrototype_179024_03B_U_WT057U_white_text_1",
                "title": [
                    "使用型",
                    [
                        "戦闘フェイズ"
                    ]
                ],
                "description": "打開自軍手裡或指定HANGER中特徵A並合計國力x以下的1張卡, 和這張卡重置狀態置換, 這張卡置換後廢棄. x為自軍G的張數",
                "conditions": {
                    "打開自軍手裡或指定HANGER中特徵A並合計國力x以下的1張卡": {
                        "title": "function _(ctx3, effect, bridge) {\n                const { A: A2 } = {\"A\":\"ブルーフレーム系］　〔１〕：クロスウェポン［アストレイ系\"};\n                if (A2 == \"\")\n                  throw new Error(\"A\\u6C92\\u6709\\u88AB\\u5B57\\u4E32\\u7F6E\\u63DB\");\n                const { GameStateFn, DefineFn } = bridge, cardId = DefineFn.EffectFn.getCardID(effect), cardController = GameStateFn.getItemController(ctx3, cardId), gCount = GameStateFn.getItemIdsByBasyou(ctx3, DefineFn.AbsoluteBaSyouFn.of(cardController, \"G\\u30BE\\u30FC\\u30F3\")).length;\n                return GameStateFn.createConditionTitleFn({\n                  title: [\"\\u6253\\u958B\\u81EA\\u8ECD\\u624B\\u88E1\\u6216\\u6307\\u5B9AHANGER\\u4E2D\\u7279\\u5FB5_A\\u4E26\\u5408\\u8A08\\u570B\\u529B_x\\u4EE5\\u4E0B\\u7684_1\\u5F35\\u5361\", A2, gCount, 1]\n                }, {})(ctx3, effect, bridge);\n              }"
                    },
                    "同回合上限": {
                        "actions": [
                            {
                                "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn2.EffectFn.getCardID(effect);\n                if (GameStateFn2.getItemState(ctx3, cardId2).textIdsUseThisTurn?.[effect.text.id])\n                  throw new DefineFn2.TipError(`\\u540C\\u56DE\\u5408\\u4E0A\\u9650: ${effect.text.description}`);\n                return ctx3 = GameStateFn2.mapItemState(ctx3, cardId2, (ps2) => {\n                  return {\n                    ...ps2,\n                    textIdsUseThisTurn: {\n                      ...ps2.textIdsUseThisTurn,\n                      [effect.text.id]: !0\n                    }\n                  };\n                }), ctx3;\n              }"
                            }
                        ]
                    }
                },
                "logicTreeActions": [
                    {
                        "actions": [
                            {
                                "title": "function _(ctx3, effect, { GameStateFn, DefineFn }) {\n                    const newE = DefineFn.EffectFn.fromEffectBasic(effect, {\n                      logicTreeAction: {\n                        actions: [\n                          {\n                            title: function _(ctx4, effect2, { GameStateFn: GameStateFn2, DefineFn: DefineFn2 }) {\n                              const cardId = DefineFn2.EffectFn.getCardID(effect2), basyou = GameStateFn2.getItemBaSyou(ctx4, cardId), pairs = GameStateFn2.getCardTipStrBaSyouPairs(ctx4, \"\\u6253\\u958B\\u81EA\\u8ECD\\u624B\\u88E1\\u6216\\u6307\\u5B9AHANGER\\u4E2D\\u7279\\u5FB5A\\u4E26\\u5408\\u8A08\\u570B\\u529Bx\\u4EE5\\u4E0B\\u76841\\u5F35\\u5361\", cardId);\n                              if (pairs.length == 0)\n                                throw new Error(`pairs must not 0: ${effect2.text.description}`);\n                              const targetPair = pairs[0];\n                              return GameStateFn2.assertTargetMissingError(ctx4, targetPair), ctx4 = GameStateFn2.doItemSwap(ctx4, [cardId, basyou], targetPair), ctx4 = GameStateFn2.doItemSetRollState(ctx4, !1, [cardId, basyou], { isSkipTargetMissing: !0 }), ctx4 = GameStateFn2.doItemMove(ctx4, DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(basyou, \"\\u30B8\\u30E3\\u30F3\\u30AF\\u30E4\\u30FC\\u30C9\"), targetPair), ctx4 = GameStateFn2.doTriggerEvent(ctx4, { title: [\"\\u300C\\u6539\\u88C5\\u300D\\u306E\\u52B9\\u679C\\u3067\\u5EC3\\u68C4\\u3055\\u308C\\u308B\\u5834\\u5408\"], cardIds: [targetPair[0]] }), ctx4 = GameStateFn2.doTriggerEvent(ctx4, { title: [\"\\u300C\\u6539\\u88C5\\u300D\\u306E\\u52B9\\u679C\\u3067\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId] }), ctx4;\n                            }.toString()\n                          }\n                        ]\n                      }\n                    });\n                    return ctx3 = GameStateFn.addStackEffect(ctx3, newE), ctx3;\n                  }"
                            }
                        ]
                    }
                ]
            }
        },
        "createPlayEffects_PlayerA_PlayerA_30_loadPrototype_179024_03B_U_WT057U_white_text_2": {
            "id": "createPlayEffects_PlayerA_PlayerA_30_loadPrototype_179024_03B_U_WT057U_white_text_2",
            "reason": [
                "PlayText",
                "PlayerA",
                "PlayerA_30",
                "loadPrototype_179024_03B_U_WT057U_white_text_2"
            ],
            "description": "（戦闘フェイズ）：［ ］の特徴を持つ自軍ユニット１枚は、ターン終了時まで、このカードの本来のテキスト１つと同じテキストを得る。ただし同じテキストは得られない）",
            "text": {
                "id": "loadPrototype_179024_03B_U_WT057U_white_text_2",
                "title": [
                    "使用型",
                    [
                        "戦闘フェイズ"
                    ]
                ],
                "description": "（戦闘フェイズ）：［ ］の特徴を持つ自軍ユニット１枚は、ターン終了時まで、このカードの本来のテキスト１つと同じテキストを得る。ただし同じテキストは得られない）",
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
                                "title": "function _(ctx3, effect, { GameStateFn, DefineFn }) {\n                    const cardId = DefineFn.EffectFn.getCardID(effect), pairs = GameStateFn.getCardTipStrBaSyouPairs(ctx3, \"\\uFF3B \\uFF3D\\u306E\\u7279\\u5FB4\\u3092\\u6301\\u3064\\u81EA\\u8ECD\\u30E6\\u30CB\\u30C3\\u30C8\\uFF11\\u679A\\u306F\", cardId), textRefIds = GameStateFn.getCardTipTextRefs(ctx3, \"\\u3053\\u306E\\u30AB\\u30FC\\u30C9\\u306E\\u672C\\u6765\\u306E\\u30C6\\u30AD\\u30B9\\u30C8\\uFF11\\u3064\", cardId).map((tr) => tr.textId);\n                    for (let pair2 of pairs)\n                      if (GameStateFn.getCardTexts(ctx3, pair2[0]).find((text2) => textRefIds.includes(text2.id)))\n                        throw new DefineFn.TipError(`\\u5DF2\\u6709\\u540C\\u6A23\\u7684\\u5167\\u6587: ${JSON.stringify(textRefIds)}`, { hasSameText: !0 });\n                    return ctx3;\n                  }"
                            }
                        ]
                    },
                    "同回合上限": {
                        "actions": [
                            {
                                "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn2.EffectFn.getCardID(effect);\n                if (GameStateFn2.getItemState(ctx3, cardId2).textIdsUseThisTurn?.[effect.text.id])\n                  throw new DefineFn2.TipError(`\\u540C\\u56DE\\u5408\\u4E0A\\u9650: ${effect.text.description}`);\n                return ctx3 = GameStateFn2.mapItemState(ctx3, cardId2, (ps2) => {\n                  return {\n                    ...ps2,\n                    textIdsUseThisTurn: {\n                      ...ps2.textIdsUseThisTurn,\n                      [effect.text.id]: !0\n                    }\n                  };\n                }), ctx3;\n              }"
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
                                            "title": "function _(ctx3, effect, { GameStateFn, DefineFn }) {\n                        const cardId = DefineFn.EffectFn.getCardID(effect), pairs = GameStateFn.getCardTipStrBaSyouPairs(ctx3, \"\\uFF3B \\uFF3D\\u306E\\u7279\\u5FB4\\u3092\\u6301\\u3064\\u81EA\\u8ECD\\u30E6\\u30CB\\u30C3\\u30C8\\uFF11\\u679A\\u306F\", cardId), textRefs = GameStateFn.getCardTipTextRefs(ctx3, \"\\u3053\\u306E\\u30AB\\u30FC\\u30C9\\u306E\\u672C\\u6765\\u306E\\u30C6\\u30AD\\u30B9\\u30C8\\uFF11\\u3064\", cardId);\n                        for (let pair2 of pairs) {\n                          GameStateFn.assertTargetMissingError(ctx3, pair2);\n                          const [targetCardId, targetBasyou] = pair2;\n                          ctx3 = GameStateFn.mapItemState(ctx3, targetCardId, (targetItemState) => {\n                            for (let textRef of textRefs) {\n                              if (GameStateFn.getCardTexts(ctx3, targetItemState.id).find((text2) => text2.id == textRef.textId) != null)\n                                continue;\n                              targetItemState = DefineFn.ItemStateFn.setGlobalEffect(targetItemState, null, {\n                                title: [\"AddTextRef\", textRef],\n                                cardIds: [targetItemState.id]\n                              }, { isRemoveOnTurnEnd: !0 });\n                            }\n                            return targetItemState;\n                          });\n                        }\n                        return ctx3;\n                      }"
                                        }
                                    ]
                                ]
                            }
                        ]
                    }
                ]
            }
        },
        "createPlayEffects_PlayerA_PlayerA_30_loadPrototype_179024_03B_U_WT057U_white_text_3": {
            "id": "createPlayEffects_PlayerA_PlayerA_30_loadPrototype_179024_03B_U_WT057U_white_text_3",
            "reason": [
                "PlayText",
                "PlayerA",
                "PlayerA_30",
                "loadPrototype_179024_03B_U_WT057U_white_text_3"
            ],
            "description": "看自己本國全部的卡,可以從中找出特徵A的1張卡移到HANGER,那個時候本國洗牌.這個效果只有這張卡從手中打出的回合可以使用",
            "text": {
                "id": "loadPrototype_179024_03B_U_WT057U_white_text_3",
                "title": [
                    "使用型",
                    [
                        "常時"
                    ]
                ],
                "description": "看自己本國全部的卡,可以從中找出特徵A的1張卡移到HANGER,那個時候本國洗牌.這個效果只有這張卡從手中打出的回合可以使用",
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
                        ],
                        "groupKey": "支付橫置國力"
                    },
                    "這個效果只有這張卡從手中打出的回合可以使用": {
                        "actions": [
                            {
                                "title": "function _(ctx3, effect, { GameStateFn, DefineFn }) {\n                    const cardId = DefineFn.EffectFn.getCardID(effect);\n                    if (GameStateFn.getItemState(ctx3, cardId).isFirstTurn != !0)\n                      throw new DefineFn.TipError(`\\u9019\\u500B\\u6548\\u679C\\u53EA\\u6709\\u9019\\u5F35\\u5361\\u5F9E\\u624B\\u4E2D\\u6253\\u51FA\\u7684\\u56DE\\u5408\\u53EF\\u4EE5\\u4F7F\\u7528:${effect.text.description}`);\n                    return ctx3;\n                  }"
                            }
                        ]
                    },
                    "同回合上限": {
                        "actions": [
                            {
                                "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn2.EffectFn.getCardID(effect);\n                if (GameStateFn2.getItemState(ctx3, cardId2).textIdsUseThisTurn?.[effect.text.id])\n                  throw new DefineFn2.TipError(`\\u540C\\u56DE\\u5408\\u4E0A\\u9650: ${effect.text.description}`);\n                return ctx3 = GameStateFn2.mapItemState(ctx3, cardId2, (ps2) => {\n                  return {\n                    ...ps2,\n                    textIdsUseThisTurn: {\n                      ...ps2.textIdsUseThisTurn,\n                      [effect.text.id]: !0\n                    }\n                  };\n                }), ctx3;\n              }"
                            }
                        ]
                    }
                },
                "logicTreeActions": [
                    {
                        "actions": [
                            {
                                "title": "function _(ctx3, effect, { GameStateFn, DefineFn }) {\n                    const { A: A2 } = {\"A\":\"アストレイ系\"}, newE = DefineFn.EffectFn.fromEffectBasic(effect, {\n                      conditions: {\n                        \"\\u770B\\u81EA\\u5DF1\\u672C\\u570B\\u5168\\u90E8\\u7684\\u5361,\\u53EF\\u4EE5\\u5F9E\\u4E2D\\u627E\\u51FA\\u7279\\u5FB5A\\u76841\\u5F35\\u5361\\u79FB\\u5230HANGER,\\u90A3\\u500B\\u6642\\u5019\\u672C\\u570B\\u6D17\\u724C\": {\n                          title: [\"_\\u81EA\\u8ECD_\\u672C\\u570B\\u627E\\u51FA\\u7279\\u5FB5_A\\u7684_1\\u5F35\\u5361\", \"\\u81EA\\u8ECD\", \"\\u672C\\u56FD\", A2, 1],\n                          actions: [\n                            {\n                              title: [\"\\u770B\\u81EA\\u5DF1_\\u672C\\u570B\\u5168\\u90E8\\u7684\\u5361\", \"\\u672C\\u56FD\"]\n                            }\n                          ]\n                        }\n                      },\n                      logicTreeAction: {\n                        actions: [\n                          {\n                            title: function _(ctx4, effect2, { GameStateFn: GameStateFn2, DefineFn: DefineFn2 }) {\n                              const cardId = DefineFn2.EffectFn.getCardID(effect2), cardController = GameStateFn2.getItemController(ctx4, cardId), pairs = GameStateFn2.getCardTipStrBaSyouPairs(ctx4, \"\\u770B\\u81EA\\u5DF1\\u672C\\u570B\\u5168\\u90E8\\u7684\\u5361,\\u53EF\\u4EE5\\u5F9E\\u4E2D\\u627E\\u51FA\\u7279\\u5FB5A\\u76841\\u5F35\\u5361\\u79FB\\u5230HANGER,\\u90A3\\u500B\\u6642\\u5019\\u672C\\u570B\\u6D17\\u724C\", cardId);\n                              if (pairs.length) {\n                                for (let pair2 of pairs)\n                                  ctx4 = GameStateFn2.doItemMove(ctx4, DefineFn2.AbsoluteBaSyouFn.of(cardController, \"\\u30CF\\u30F3\\u30AC\\u30FC\"), pair2);\n                                ctx4 = GameStateFn2.shuffleItems(ctx4, DefineFn2.AbsoluteBaSyouFn.of(cardController, \"\\u672C\\u56FD\"));\n                              }\n                              return ctx4;\n                            }.toString()\n                          }\n                        ]\n                      }\n                    });\n                    return ctx3 = GameStateFn.addStackEffect(ctx3, newE), ctx3;\n                  }"
                            }
                        ]
                    }
                ]
            }
        },
        "createPlayEffects_PlayerA_PlayerA_7_loadPrototype_179015_04B_U_WT067C_white_text_0": {
            "id": "createPlayEffects_PlayerA_PlayerA_7_loadPrototype_179015_04B_U_WT067C_white_text_0",
            "reason": [
                "PlayText",
                "PlayerA",
                "PlayerA_7",
                "loadPrototype_179015_04B_U_WT067C_white_text_0"
            ],
            "description": "打開自軍手裡或指定HANGER中特徵A並合計國力x以下的1張卡, 和這張卡重置狀態置換, 這張卡置換後廢棄. x為自軍G的張數",
            "text": {
                "id": "loadPrototype_179015_04B_U_WT067C_white_text_0",
                "title": [
                    "使用型",
                    [
                        "戦闘フェイズ"
                    ]
                ],
                "description": "打開自軍手裡或指定HANGER中特徵A並合計國力x以下的1張卡, 和這張卡重置狀態置換, 這張卡置換後廢棄. x為自軍G的張數",
                "conditions": {
                    "打開自軍手裡或指定HANGER中特徵A並合計國力x以下的1張卡": {
                        "title": "function _(ctx3, effect, bridge) {\n                const { A: A2 } = {\"A\":\"ブルーフレーム系］<br />〔２〕：クロスウェポン［アストレイ系\"};\n                if (A2 == \"\")\n                  throw new Error(\"A\\u6C92\\u6709\\u88AB\\u5B57\\u4E32\\u7F6E\\u63DB\");\n                const { GameStateFn, DefineFn } = bridge, cardId = DefineFn.EffectFn.getCardID(effect), cardController = GameStateFn.getItemController(ctx3, cardId), gCount = GameStateFn.getItemIdsByBasyou(ctx3, DefineFn.AbsoluteBaSyouFn.of(cardController, \"G\\u30BE\\u30FC\\u30F3\")).length;\n                return GameStateFn.createConditionTitleFn({\n                  title: [\"\\u6253\\u958B\\u81EA\\u8ECD\\u624B\\u88E1\\u6216\\u6307\\u5B9AHANGER\\u4E2D\\u7279\\u5FB5_A\\u4E26\\u5408\\u8A08\\u570B\\u529B_x\\u4EE5\\u4E0B\\u7684_1\\u5F35\\u5361\", A2, gCount, 1]\n                }, {})(ctx3, effect, bridge);\n              }"
                    },
                    "同回合上限": {
                        "actions": [
                            {
                                "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn2.EffectFn.getCardID(effect);\n                if (GameStateFn2.getItemState(ctx3, cardId2).textIdsUseThisTurn?.[effect.text.id])\n                  throw new DefineFn2.TipError(`\\u540C\\u56DE\\u5408\\u4E0A\\u9650: ${effect.text.description}`);\n                return ctx3 = GameStateFn2.mapItemState(ctx3, cardId2, (ps2) => {\n                  return {\n                    ...ps2,\n                    textIdsUseThisTurn: {\n                      ...ps2.textIdsUseThisTurn,\n                      [effect.text.id]: !0\n                    }\n                  };\n                }), ctx3;\n              }"
                            }
                        ]
                    }
                },
                "logicTreeActions": [
                    {
                        "actions": [
                            {
                                "title": "function _(ctx3, effect, { GameStateFn, DefineFn }) {\n                    const newE = DefineFn.EffectFn.fromEffectBasic(effect, {\n                      logicTreeAction: {\n                        actions: [\n                          {\n                            title: function _(ctx4, effect2, { GameStateFn: GameStateFn2, DefineFn: DefineFn2 }) {\n                              const cardId = DefineFn2.EffectFn.getCardID(effect2), basyou = GameStateFn2.getItemBaSyou(ctx4, cardId), pairs = GameStateFn2.getCardTipStrBaSyouPairs(ctx4, \"\\u6253\\u958B\\u81EA\\u8ECD\\u624B\\u88E1\\u6216\\u6307\\u5B9AHANGER\\u4E2D\\u7279\\u5FB5A\\u4E26\\u5408\\u8A08\\u570B\\u529Bx\\u4EE5\\u4E0B\\u76841\\u5F35\\u5361\", cardId);\n                              if (pairs.length == 0)\n                                throw new Error(`pairs must not 0: ${effect2.text.description}`);\n                              const targetPair = pairs[0];\n                              return GameStateFn2.assertTargetMissingError(ctx4, targetPair), ctx4 = GameStateFn2.doItemSwap(ctx4, [cardId, basyou], targetPair), ctx4 = GameStateFn2.doItemSetRollState(ctx4, !1, [cardId, basyou], { isSkipTargetMissing: !0 }), ctx4 = GameStateFn2.doItemMove(ctx4, DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(basyou, \"\\u30B8\\u30E3\\u30F3\\u30AF\\u30E4\\u30FC\\u30C9\"), targetPair), ctx4 = GameStateFn2.doTriggerEvent(ctx4, { title: [\"\\u300C\\u6539\\u88C5\\u300D\\u306E\\u52B9\\u679C\\u3067\\u5EC3\\u68C4\\u3055\\u308C\\u308B\\u5834\\u5408\"], cardIds: [targetPair[0]] }), ctx4 = GameStateFn2.doTriggerEvent(ctx4, { title: [\"\\u300C\\u6539\\u88C5\\u300D\\u306E\\u52B9\\u679C\\u3067\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId] }), ctx4;\n                            }.toString()\n                          }\n                        ]\n                      }\n                    });\n                    return ctx3 = GameStateFn.addStackEffect(ctx3, newE), ctx3;\n                  }"
                            }
                        ]
                    }
                ]
            }
        },
        "createPlayEffects_PlayerA_PlayerA_7_loadPrototype_179015_04B_U_WT067C_white_text_1": {
            "id": "createPlayEffects_PlayerA_PlayerA_7_loadPrototype_179015_04B_U_WT067C_white_text_1",
            "reason": [
                "PlayText",
                "PlayerA",
                "PlayerA_7",
                "loadPrototype_179015_04B_U_WT067C_white_text_1"
            ],
            "description": "（戦闘フェイズ）：［ ］の特徴を持つ自軍ユニット１枚は、ターン終了時まで、このカードの本来のテキスト１つと同じテキストを得る。ただし同じテキストは得られない）",
            "text": {
                "id": "loadPrototype_179015_04B_U_WT067C_white_text_1",
                "title": [
                    "使用型",
                    [
                        "戦闘フェイズ"
                    ]
                ],
                "description": "（戦闘フェイズ）：［ ］の特徴を持つ自軍ユニット１枚は、ターン終了時まで、このカードの本来のテキスト１つと同じテキストを得る。ただし同じテキストは得られない）",
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
                        ],
                        "groupKey": "支付橫置國力"
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
                                "title": "function _(ctx3, effect, { GameStateFn, DefineFn }) {\n                    const cardId = DefineFn.EffectFn.getCardID(effect), pairs = GameStateFn.getCardTipStrBaSyouPairs(ctx3, \"\\uFF3B \\uFF3D\\u306E\\u7279\\u5FB4\\u3092\\u6301\\u3064\\u81EA\\u8ECD\\u30E6\\u30CB\\u30C3\\u30C8\\uFF11\\u679A\\u306F\", cardId), textRefIds = GameStateFn.getCardTipTextRefs(ctx3, \"\\u3053\\u306E\\u30AB\\u30FC\\u30C9\\u306E\\u672C\\u6765\\u306E\\u30C6\\u30AD\\u30B9\\u30C8\\uFF11\\u3064\", cardId).map((tr) => tr.textId);\n                    for (let pair2 of pairs)\n                      if (GameStateFn.getCardTexts(ctx3, pair2[0]).find((text2) => textRefIds.includes(text2.id)))\n                        throw new DefineFn.TipError(`\\u5DF2\\u6709\\u540C\\u6A23\\u7684\\u5167\\u6587: ${JSON.stringify(textRefIds)}`, { hasSameText: !0 });\n                    return ctx3;\n                  }"
                            }
                        ]
                    },
                    "同回合上限": {
                        "actions": [
                            {
                                "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn2.EffectFn.getCardID(effect);\n                if (GameStateFn2.getItemState(ctx3, cardId2).textIdsUseThisTurn?.[effect.text.id])\n                  throw new DefineFn2.TipError(`\\u540C\\u56DE\\u5408\\u4E0A\\u9650: ${effect.text.description}`);\n                return ctx3 = GameStateFn2.mapItemState(ctx3, cardId2, (ps2) => {\n                  return {\n                    ...ps2,\n                    textIdsUseThisTurn: {\n                      ...ps2.textIdsUseThisTurn,\n                      [effect.text.id]: !0\n                    }\n                  };\n                }), ctx3;\n              }"
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
                                            "title": "function _(ctx3, effect, { GameStateFn, DefineFn }) {\n                        const cardId = DefineFn.EffectFn.getCardID(effect), pairs = GameStateFn.getCardTipStrBaSyouPairs(ctx3, \"\\uFF3B \\uFF3D\\u306E\\u7279\\u5FB4\\u3092\\u6301\\u3064\\u81EA\\u8ECD\\u30E6\\u30CB\\u30C3\\u30C8\\uFF11\\u679A\\u306F\", cardId), textRefs = GameStateFn.getCardTipTextRefs(ctx3, \"\\u3053\\u306E\\u30AB\\u30FC\\u30C9\\u306E\\u672C\\u6765\\u306E\\u30C6\\u30AD\\u30B9\\u30C8\\uFF11\\u3064\", cardId);\n                        for (let pair2 of pairs) {\n                          GameStateFn.assertTargetMissingError(ctx3, pair2);\n                          const [targetCardId, targetBasyou] = pair2;\n                          ctx3 = GameStateFn.mapItemState(ctx3, targetCardId, (targetItemState) => {\n                            for (let textRef of textRefs) {\n                              if (GameStateFn.getCardTexts(ctx3, targetItemState.id).find((text2) => text2.id == textRef.textId) != null)\n                                continue;\n                              targetItemState = DefineFn.ItemStateFn.setGlobalEffect(targetItemState, null, {\n                                title: [\"AddTextRef\", textRef],\n                                cardIds: [targetItemState.id]\n                              }, { isRemoveOnTurnEnd: !0 });\n                            }\n                            return targetItemState;\n                          });\n                        }\n                        return ctx3;\n                      }"
                                        }
                                    ]
                                ]
                            }
                        ]
                    }
                ]
            }
        },
        "createPlayEffects_PlayerA_PlayerA_7_loadPrototype_179015_04B_U_WT067C_white_text_2": {
            "id": "createPlayEffects_PlayerA_PlayerA_7_loadPrototype_179015_04B_U_WT067C_white_text_2",
            "reason": [
                "PlayText",
                "PlayerA",
                "PlayerA_7",
                "loadPrototype_179015_04B_U_WT067C_white_text_2"
            ],
            "description": "看自己本國全部的卡,可以從中找出特徵A的1張卡移到HANGER,那個時候本國洗牌.這個效果只有這張卡從手中打出的回合可以使用",
            "text": {
                "id": "loadPrototype_179015_04B_U_WT067C_white_text_2",
                "title": [
                    "使用型",
                    [
                        "常時"
                    ]
                ],
                "description": "看自己本國全部的卡,可以從中找出特徵A的1張卡移到HANGER,那個時候本國洗牌.這個效果只有這張卡從手中打出的回合可以使用",
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
                        ],
                        "groupKey": "支付橫置國力"
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
                        ],
                        "groupKey": "支付橫置國力"
                    },
                    "這個效果只有這張卡從手中打出的回合可以使用": {
                        "actions": [
                            {
                                "title": "function _(ctx3, effect, { GameStateFn, DefineFn }) {\n                    const cardId = DefineFn.EffectFn.getCardID(effect);\n                    if (GameStateFn.getItemState(ctx3, cardId).isFirstTurn != !0)\n                      throw new DefineFn.TipError(`\\u9019\\u500B\\u6548\\u679C\\u53EA\\u6709\\u9019\\u5F35\\u5361\\u5F9E\\u624B\\u4E2D\\u6253\\u51FA\\u7684\\u56DE\\u5408\\u53EF\\u4EE5\\u4F7F\\u7528:${effect.text.description}`);\n                    return ctx3;\n                  }"
                            }
                        ]
                    },
                    "同回合上限": {
                        "actions": [
                            {
                                "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn2.EffectFn.getCardID(effect);\n                if (GameStateFn2.getItemState(ctx3, cardId2).textIdsUseThisTurn?.[effect.text.id])\n                  throw new DefineFn2.TipError(`\\u540C\\u56DE\\u5408\\u4E0A\\u9650: ${effect.text.description}`);\n                return ctx3 = GameStateFn2.mapItemState(ctx3, cardId2, (ps2) => {\n                  return {\n                    ...ps2,\n                    textIdsUseThisTurn: {\n                      ...ps2.textIdsUseThisTurn,\n                      [effect.text.id]: !0\n                    }\n                  };\n                }), ctx3;\n              }"
                            }
                        ]
                    }
                },
                "logicTreeActions": [
                    {
                        "actions": [
                            {
                                "title": "function _(ctx3, effect, { GameStateFn, DefineFn }) {\n                    const { A: A2 } = {\"A\":\"アストレイ系\"}, newE = DefineFn.EffectFn.fromEffectBasic(effect, {\n                      conditions: {\n                        \"\\u770B\\u81EA\\u5DF1\\u672C\\u570B\\u5168\\u90E8\\u7684\\u5361,\\u53EF\\u4EE5\\u5F9E\\u4E2D\\u627E\\u51FA\\u7279\\u5FB5A\\u76841\\u5F35\\u5361\\u79FB\\u5230HANGER,\\u90A3\\u500B\\u6642\\u5019\\u672C\\u570B\\u6D17\\u724C\": {\n                          title: [\"_\\u81EA\\u8ECD_\\u672C\\u570B\\u627E\\u51FA\\u7279\\u5FB5_A\\u7684_1\\u5F35\\u5361\", \"\\u81EA\\u8ECD\", \"\\u672C\\u56FD\", A2, 1],\n                          actions: [\n                            {\n                              title: [\"\\u770B\\u81EA\\u5DF1_\\u672C\\u570B\\u5168\\u90E8\\u7684\\u5361\", \"\\u672C\\u56FD\"]\n                            }\n                          ]\n                        }\n                      },\n                      logicTreeAction: {\n                        actions: [\n                          {\n                            title: function _(ctx4, effect2, { GameStateFn: GameStateFn2, DefineFn: DefineFn2 }) {\n                              const cardId = DefineFn2.EffectFn.getCardID(effect2), cardController = GameStateFn2.getItemController(ctx4, cardId), pairs = GameStateFn2.getCardTipStrBaSyouPairs(ctx4, \"\\u770B\\u81EA\\u5DF1\\u672C\\u570B\\u5168\\u90E8\\u7684\\u5361,\\u53EF\\u4EE5\\u5F9E\\u4E2D\\u627E\\u51FA\\u7279\\u5FB5A\\u76841\\u5F35\\u5361\\u79FB\\u5230HANGER,\\u90A3\\u500B\\u6642\\u5019\\u672C\\u570B\\u6D17\\u724C\", cardId);\n                              if (pairs.length) {\n                                for (let pair2 of pairs)\n                                  ctx4 = GameStateFn2.doItemMove(ctx4, DefineFn2.AbsoluteBaSyouFn.of(cardController, \"\\u30CF\\u30F3\\u30AC\\u30FC\"), pair2);\n                                ctx4 = GameStateFn2.shuffleItems(ctx4, DefineFn2.AbsoluteBaSyouFn.of(cardController, \"\\u672C\\u56FD\"));\n                              }\n                              return ctx4;\n                            }.toString()\n                          }\n                        ]\n                      }\n                    });\n                    return ctx3 = GameStateFn.addStackEffect(ctx3, newE), ctx3;\n                  }"
                            }
                        ]
                    }
                ]
            }
        },
        "createPlayCardEffects_PlayerB_78": {
            "id": "createPlayCardEffects_PlayerB_78",
            "reason": [
                "PlayCard",
                "PlayerB",
                "PlayerB_78",
                {
                    "isPlayUnit": true,
                    "isPlayCharacter": false
                }
            ],
            "description": "Play",
            "text": {
                "id": "createPlayCardEffects_text_PlayerB_78",
                "title": [
                    "使用型",
                    [
                        "自軍",
                        "配備フェイズ"
                    ]
                ],
                "description": "Play",
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
                    "0[黒]": {
                        "title": [
                            "RollColor",
                            "黒"
                        ],
                        "actions": [
                            {
                                "title": [
                                    "_ロールする",
                                    "ロール"
                                ],
                                "vars": [
                                    "0[黒]"
                                ]
                            }
                        ],
                        "groupKey": "支付橫置國力"
                    },
                    "1[黒]": {
                        "title": [
                            "RollColor",
                            "黒"
                        ],
                        "actions": [
                            {
                                "title": [
                                    "_ロールする",
                                    "ロール"
                                ],
                                "vars": [
                                    "1[黒]"
                                ]
                            }
                        ],
                        "groupKey": "支付橫置國力"
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
                                    "value": "0[黒]"
                                },
                                {
                                    "type": "Leaf",
                                    "value": "1[黒]"
                                }
                            ]
                        },
                        "actions": [
                            {
                                "title": "function _(ctx3, effect, { DefineFn, GameStateFn, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn.EffectFn.getCardID(effect), prototype2 = GameStateFn.getItemPrototype(ctx3, cardId2), from = GameStateFn.getItemBaSyou(ctx3, cardId2);\n                if (ctx3 = GameStateFn.doItemMove(ctx3, DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u3044\\u308B\\u30AB\\u30FC\\u30C9\"), [cardId2, from]), prototype2.category == \"\\u30E6\\u30CB\\u30C3\\u30C8\")\n                  return GameStateFn.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn.EffectFn.getPlayerID(effect), DefineFn.EffectFn.getCardID(effect)],\n                    description: effect.text.description,\n                    text: {\n                      id: effect.text.id,\n                      description: effect.text.description,\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect2, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                                const cardId3 = DefineFn2.EffectFn.getCardID(effect2), from2 = GameStateFn2.getItemBaSyou(ctx4, cardId3), to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\");\n                                ctx4 = GameStateFn2.doItemMove(ctx4, to, [cardId3, from2]);\n                                const hasHigh = GameStateFn2.getCardHasSpeicalEffect(ctx4, [\"\\u6226\\u95D8\\u914D\\u5099\"], cardId3), hasPS = GameStateFn2.getCardHasSpeicalEffect(ctx4, [\"PS\\u88C5\\u7532\"], cardId3), isRoll = (hasHigh || hasPS) == !1;\n                                return ctx4 = GameStateFn2.doItemSetRollState(ctx4, isRoll, [cardId3, GameStateFn2.getItemBaSyou(ctx4, cardId3)], { isSkipTargetMissing: !0 }), ctx4 = GameStateFn2.doTriggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] }), ctx4;\n                              }.toString()\n                            }\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                if (prototype2.category == \"\\u30AD\\u30E3\\u30E9\\u30AF\\u30BF\\u30FC\" || prototype2.category == \"\\u30AA\\u30DA\\u30EC\\u30FC\\u30B7\\u30E7\\u30F3(\\u30E6\\u30CB\\u30C3\\u30C8)\")\n                  return GameStateFn.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn.EffectFn.getPlayerID(effect), DefineFn.EffectFn.getCardID(effect)],\n                    description: effect.text.description,\n                    text: {\n                      id: effect.text.id,\n                      description: effect.text.description,\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect2, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                                const cardId3 = DefineFn2.EffectFn.getCardID(effect2), pairs = GameStateFn2.getCardTipStrBaSyouPairs(ctx4, \"\\u4E00\\u500B\\u81EA\\u8ECD\\u6A5F\\u9AD4\", cardId3);\n                                if (pairs.length == 0)\n                                  throw new Error(`pairs must not 0: ${effect2.text.description}`);\n                                const [targetCardId, targetBasyou] = pairs[0], from2 = GameStateFn2.getItemBaSyou(ctx4, cardId3), to = targetBasyou;\n                                ctx4 = GameStateFn2.doItemMove(ctx4, to, [cardId3, from2]);\n                                const isRoll = GameStateFn2.getCard(ctx4, targetCardId).isRoll || !1;\n                                return ctx4 = GameStateFn2.mapCard(ctx4, cardId3, (is) => ({ ...is, isRoll })), ctx4 = GameStateFn2.setSetGroupParent(ctx4, targetCardId, cardId3), ctx4 = GameStateFn2.doTriggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] }), ctx4 = GameStateFn2.doTriggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u30BB\\u30C3\\u30C8\\u3055\\u308C\\u305F\\u5834\\u5408\"], cardIds: [cardId3] }), ctx4;\n                              }.toString()\n                            }\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                if (prototype2.category == \"\\u30B3\\u30DE\\u30F3\\u30C9\")\n                  return GameStateFn.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn.EffectFn.getPlayerID(effect), DefineFn.EffectFn.getCardID(effect)],\n                    description: effect.text.description,\n                    text: {\n                      id: prototype2.commandText?.id || `getPlayCardEffects_commentText_${cardId2}`,\n                      description: prototype2.commandText?.description || \"unknown\",\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect2, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                                const cardId3 = DefineFn2.EffectFn.getCardID(effect2), from2 = GameStateFn2.getItemBaSyou(ctx4, cardId3), to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u30B8\\u30E3\\u30F3\\u30AF\\u30E4\\u30FC\\u30C9\");\n                                return ctx4 = GameStateFn2.doItemMove(ctx4, to, [cardId3, from2]), ctx4 = GameStateFn2.doTriggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] }), ctx4;\n                              }.toString()\n                            },\n                            ...prototype2.commandText?.logicTreeActions?.[0]?.actions || []\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                if (prototype2.category == \"\\u30B0\\u30E9\\u30D5\\u30A3\\u30C3\\u30AF\") {\n                  const cardId3 = DefineFn.EffectFn.getCardID(effect), from2 = GameStateFn.getItemBaSyou(ctx3, cardId3), to = DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"G\\u30BE\\u30FC\\u30F3\");\n                  return ctx3 = GameStateFn.doItemMove(ctx3, to, [cardId3, from2]), ctx3 = GameStateFn.doTriggerEvent(ctx3, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] }), ctx3;\n                }\n                if (prototype2.category == \"\\u30AA\\u30DA\\u30EC\\u30FC\\u30B7\\u30E7\\u30F3\") {\n                  const cardId3 = DefineFn.EffectFn.getCardID(effect), from2 = GameStateFn.getItemBaSyou(ctx3, cardId3), to = DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\");\n                  return ctx3 = GameStateFn.doItemMove(ctx3, to, [cardId3, from2]), ctx3 = GameStateFn.doTriggerEvent(ctx3, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] }), ctx3;\n                }\n                if (prototype2.category == \"ACE\")\n                  throw new Error(`not support category: ${prototype2.category}`);\n                return ctx3;\n              }"
                            }
                        ]
                    }
                ]
            }
        },
        "createPlayEffects_PlayerB_PlayerB_77_loadPrototype_179024_B2B_U_BK128S_black_02_text_1": {
            "id": "createPlayEffects_PlayerB_PlayerB_77_loadPrototype_179024_B2B_U_BK128S_black_02_text_1",
            "reason": [
                "PlayText",
                "PlayerB",
                "PlayerB_77",
                "loadPrototype_179024_B2B_U_BK128S_black_02_text_1"
            ],
            "description": "打開自軍手裡或指定HANGER中特徵A並合計國力x以下的1張卡, 和這張卡重置狀態置換, 這張卡置換後廢棄. x為自軍G的張數",
            "text": {
                "id": "loadPrototype_179024_B2B_U_BK128S_black_02_text_1",
                "title": [
                    "使用型",
                    [
                        "戦闘フェイズ"
                    ]
                ],
                "description": "打開自軍手裡或指定HANGER中特徵A並合計國力x以下的1張卡, 和這張卡重置狀態置換, 這張卡置換後廢棄. x為自軍G的張數",
                "conditions": {
                    "打開自軍手裡或指定HANGER中特徵A並合計國力x以下的1張卡": {
                        "title": "function _(ctx3, effect, bridge) {\n                const { A: A2 } = {\"A\":\"ヘイズル系］　〔黒１毎〕：クロスウェポン［T3部隊\"};\n                if (A2 == \"\")\n                  throw new Error(\"A\\u6C92\\u6709\\u88AB\\u5B57\\u4E32\\u7F6E\\u63DB\");\n                const { GameStateFn, DefineFn } = bridge, cardId = DefineFn.EffectFn.getCardID(effect), cardController = GameStateFn.getItemController(ctx3, cardId), gCount = GameStateFn.getItemIdsByBasyou(ctx3, DefineFn.AbsoluteBaSyouFn.of(cardController, \"G\\u30BE\\u30FC\\u30F3\")).length;\n                return GameStateFn.createConditionTitleFn({\n                  title: [\"\\u6253\\u958B\\u81EA\\u8ECD\\u624B\\u88E1\\u6216\\u6307\\u5B9AHANGER\\u4E2D\\u7279\\u5FB5_A\\u4E26\\u5408\\u8A08\\u570B\\u529B_x\\u4EE5\\u4E0B\\u7684_1\\u5F35\\u5361\", A2, gCount, 1]\n                }, {})(ctx3, effect, bridge);\n              }"
                    },
                    "同回合上限": {
                        "actions": [
                            {
                                "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn2.EffectFn.getCardID(effect);\n                if (GameStateFn2.getItemState(ctx3, cardId2).textIdsUseThisTurn?.[effect.text.id])\n                  throw new DefineFn2.TipError(`\\u540C\\u56DE\\u5408\\u4E0A\\u9650: ${effect.text.description}`);\n                return ctx3 = GameStateFn2.mapItemState(ctx3, cardId2, (ps2) => {\n                  return {\n                    ...ps2,\n                    textIdsUseThisTurn: {\n                      ...ps2.textIdsUseThisTurn,\n                      [effect.text.id]: !0\n                    }\n                  };\n                }), ctx3;\n              }"
                            }
                        ]
                    }
                },
                "logicTreeActions": [
                    {
                        "actions": [
                            {
                                "title": "function _(ctx3, effect, { GameStateFn, DefineFn }) {\n                    const newE = DefineFn.EffectFn.fromEffectBasic(effect, {\n                      logicTreeAction: {\n                        actions: [\n                          {\n                            title: function _(ctx4, effect2, { GameStateFn: GameStateFn2, DefineFn: DefineFn2 }) {\n                              const cardId = DefineFn2.EffectFn.getCardID(effect2), basyou = GameStateFn2.getItemBaSyou(ctx4, cardId), pairs = GameStateFn2.getCardTipStrBaSyouPairs(ctx4, \"\\u6253\\u958B\\u81EA\\u8ECD\\u624B\\u88E1\\u6216\\u6307\\u5B9AHANGER\\u4E2D\\u7279\\u5FB5A\\u4E26\\u5408\\u8A08\\u570B\\u529Bx\\u4EE5\\u4E0B\\u76841\\u5F35\\u5361\", cardId);\n                              if (pairs.length == 0)\n                                throw new Error(`pairs must not 0: ${effect2.text.description}`);\n                              const targetPair = pairs[0];\n                              return GameStateFn2.assertTargetMissingError(ctx4, targetPair), ctx4 = GameStateFn2.doItemSwap(ctx4, [cardId, basyou], targetPair), ctx4 = GameStateFn2.doItemSetRollState(ctx4, !1, [cardId, basyou], { isSkipTargetMissing: !0 }), ctx4 = GameStateFn2.doItemMove(ctx4, DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(basyou, \"\\u30B8\\u30E3\\u30F3\\u30AF\\u30E4\\u30FC\\u30C9\"), targetPair), ctx4 = GameStateFn2.doTriggerEvent(ctx4, { title: [\"\\u300C\\u6539\\u88C5\\u300D\\u306E\\u52B9\\u679C\\u3067\\u5EC3\\u68C4\\u3055\\u308C\\u308B\\u5834\\u5408\"], cardIds: [targetPair[0]] }), ctx4 = GameStateFn2.doTriggerEvent(ctx4, { title: [\"\\u300C\\u6539\\u88C5\\u300D\\u306E\\u52B9\\u679C\\u3067\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId] }), ctx4;\n                            }.toString()\n                          }\n                        ]\n                      }\n                    });\n                    return ctx3 = GameStateFn.addStackEffect(ctx3, newE), ctx3;\n                  }"
                            }
                        ]
                    }
                ]
            }
        },
        "createPlayEffects_PlayerB_PlayerB_77_loadPrototype_179024_B2B_U_BK128S_black_02_text_2": {
            "id": "createPlayEffects_PlayerB_PlayerB_77_loadPrototype_179024_B2B_U_BK128S_black_02_text_2",
            "reason": [
                "PlayText",
                "PlayerB",
                "PlayerB_77",
                "loadPrototype_179024_B2B_U_BK128S_black_02_text_2"
            ],
            "description": "（戦闘フェイズ）：［ ］の特徴を持つ自軍ユニット１枚は、ターン終了時まで、このカードの本来のテキスト１つと同じテキストを得る。ただし同じテキストは得られない）",
            "text": {
                "id": "loadPrototype_179024_B2B_U_BK128S_black_02_text_2",
                "title": [
                    "使用型",
                    [
                        "戦闘フェイズ"
                    ]
                ],
                "description": "（戦闘フェイズ）：［ ］の特徴を持つ自軍ユニット１枚は、ターン終了時まで、このカードの本来のテキスト１つと同じテキストを得る。ただし同じテキストは得られない）",
                "conditions": {
                    "0[黒]": {
                        "title": [
                            "RollColor",
                            "黒"
                        ],
                        "actions": [
                            {
                                "title": [
                                    "_ロールする",
                                    "ロール"
                                ],
                                "vars": [
                                    "0[黒]"
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
                            "T3部隊",
                            "自軍",
                            "ユニット",
                            1
                        ],
                        "exceptItemSelf": true,
                        "actions": [
                            {
                                "title": "function _(ctx3, effect, { GameStateFn, DefineFn }) {\n                    const cardId = DefineFn.EffectFn.getCardID(effect), pairs = GameStateFn.getCardTipStrBaSyouPairs(ctx3, \"\\uFF3B \\uFF3D\\u306E\\u7279\\u5FB4\\u3092\\u6301\\u3064\\u81EA\\u8ECD\\u30E6\\u30CB\\u30C3\\u30C8\\uFF11\\u679A\\u306F\", cardId), textRefIds = GameStateFn.getCardTipTextRefs(ctx3, \"\\u3053\\u306E\\u30AB\\u30FC\\u30C9\\u306E\\u672C\\u6765\\u306E\\u30C6\\u30AD\\u30B9\\u30C8\\uFF11\\u3064\", cardId).map((tr) => tr.textId);\n                    for (let pair2 of pairs)\n                      if (GameStateFn.getCardTexts(ctx3, pair2[0]).find((text2) => textRefIds.includes(text2.id)))\n                        throw new DefineFn.TipError(`\\u5DF2\\u6709\\u540C\\u6A23\\u7684\\u5167\\u6587: ${JSON.stringify(textRefIds)}`, { hasSameText: !0 });\n                    return ctx3;\n                  }"
                            }
                        ]
                    },
                    "同回合上限": {
                        "actions": [
                            {
                                "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn2.EffectFn.getCardID(effect);\n                if (GameStateFn2.getItemState(ctx3, cardId2).textIdsUseThisTurn?.[effect.text.id])\n                  throw new DefineFn2.TipError(`\\u540C\\u56DE\\u5408\\u4E0A\\u9650: ${effect.text.description}`);\n                return ctx3 = GameStateFn2.mapItemState(ctx3, cardId2, (ps2) => {\n                  return {\n                    ...ps2,\n                    textIdsUseThisTurn: {\n                      ...ps2.textIdsUseThisTurn,\n                      [effect.text.id]: !0\n                    }\n                  };\n                }), ctx3;\n              }"
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
                                            "title": "function _(ctx3, effect, { GameStateFn, DefineFn }) {\n                        const cardId = DefineFn.EffectFn.getCardID(effect), pairs = GameStateFn.getCardTipStrBaSyouPairs(ctx3, \"\\uFF3B \\uFF3D\\u306E\\u7279\\u5FB4\\u3092\\u6301\\u3064\\u81EA\\u8ECD\\u30E6\\u30CB\\u30C3\\u30C8\\uFF11\\u679A\\u306F\", cardId), textRefs = GameStateFn.getCardTipTextRefs(ctx3, \"\\u3053\\u306E\\u30AB\\u30FC\\u30C9\\u306E\\u672C\\u6765\\u306E\\u30C6\\u30AD\\u30B9\\u30C8\\uFF11\\u3064\", cardId);\n                        for (let pair2 of pairs) {\n                          GameStateFn.assertTargetMissingError(ctx3, pair2);\n                          const [targetCardId, targetBasyou] = pair2;\n                          ctx3 = GameStateFn.mapItemState(ctx3, targetCardId, (targetItemState) => {\n                            for (let textRef of textRefs) {\n                              if (GameStateFn.getCardTexts(ctx3, targetItemState.id).find((text2) => text2.id == textRef.textId) != null)\n                                continue;\n                              targetItemState = DefineFn.ItemStateFn.setGlobalEffect(targetItemState, null, {\n                                title: [\"AddTextRef\", textRef],\n                                cardIds: [targetItemState.id]\n                              }, { isRemoveOnTurnEnd: !0 });\n                            }\n                            return targetItemState;\n                          });\n                        }\n                        return ctx3;\n                      }"
                                        }
                                    ]
                                ]
                            }
                        ]
                    }
                ]
            }
        },
        "createPlayEffects_PlayerB_PlayerB_77_loadPrototype_179024_B2B_U_BK128S_black_02_text_3": {
            "id": "createPlayEffects_PlayerB_PlayerB_77_loadPrototype_179024_B2B_U_BK128S_black_02_text_3",
            "reason": [
                "PlayText",
                "PlayerB",
                "PlayerB_77",
                "loadPrototype_179024_B2B_U_BK128S_black_02_text_3"
            ],
            "description": "看自己本國全部的卡,可以從中找出特徵A的1張卡移到HANGER,那個時候本國洗牌.這個效果只有這張卡從手中打出的回合可以使用",
            "text": {
                "id": "loadPrototype_179024_B2B_U_BK128S_black_02_text_3",
                "title": [
                    "使用型",
                    [
                        "常時"
                    ]
                ],
                "description": "看自己本國全部的卡,可以從中找出特徵A的1張卡移到HANGER,那個時候本國洗牌.這個效果只有這張卡從手中打出的回合可以使用",
                "conditions": {
                    "0[黒]": {
                        "title": [
                            "RollColor",
                            "黒"
                        ],
                        "actions": [
                            {
                                "title": [
                                    "_ロールする",
                                    "ロール"
                                ],
                                "vars": [
                                    "0[黒]"
                                ]
                            }
                        ],
                        "groupKey": "支付橫置國力"
                    },
                    "這個效果只有這張卡從手中打出的回合可以使用": {
                        "actions": [
                            {
                                "title": "function _(ctx3, effect, { GameStateFn, DefineFn }) {\n                    const cardId = DefineFn.EffectFn.getCardID(effect);\n                    if (GameStateFn.getItemState(ctx3, cardId).isFirstTurn != !0)\n                      throw new DefineFn.TipError(`\\u9019\\u500B\\u6548\\u679C\\u53EA\\u6709\\u9019\\u5F35\\u5361\\u5F9E\\u624B\\u4E2D\\u6253\\u51FA\\u7684\\u56DE\\u5408\\u53EF\\u4EE5\\u4F7F\\u7528:${effect.text.description}`);\n                    return ctx3;\n                  }"
                            }
                        ]
                    },
                    "同回合上限": {
                        "actions": [
                            {
                                "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn2.EffectFn.getCardID(effect);\n                if (GameStateFn2.getItemState(ctx3, cardId2).textIdsUseThisTurn?.[effect.text.id])\n                  throw new DefineFn2.TipError(`\\u540C\\u56DE\\u5408\\u4E0A\\u9650: ${effect.text.description}`);\n                return ctx3 = GameStateFn2.mapItemState(ctx3, cardId2, (ps2) => {\n                  return {\n                    ...ps2,\n                    textIdsUseThisTurn: {\n                      ...ps2.textIdsUseThisTurn,\n                      [effect.text.id]: !0\n                    }\n                  };\n                }), ctx3;\n              }"
                            }
                        ]
                    }
                },
                "logicTreeActions": [
                    {
                        "actions": [
                            {
                                "title": "function _(ctx3, effect, { GameStateFn, DefineFn }) {\n                    const { A: A2 } = {\"A\":\"T3部隊\"}, newE = DefineFn.EffectFn.fromEffectBasic(effect, {\n                      conditions: {\n                        \"\\u770B\\u81EA\\u5DF1\\u672C\\u570B\\u5168\\u90E8\\u7684\\u5361,\\u53EF\\u4EE5\\u5F9E\\u4E2D\\u627E\\u51FA\\u7279\\u5FB5A\\u76841\\u5F35\\u5361\\u79FB\\u5230HANGER,\\u90A3\\u500B\\u6642\\u5019\\u672C\\u570B\\u6D17\\u724C\": {\n                          title: [\"_\\u81EA\\u8ECD_\\u672C\\u570B\\u627E\\u51FA\\u7279\\u5FB5_A\\u7684_1\\u5F35\\u5361\", \"\\u81EA\\u8ECD\", \"\\u672C\\u56FD\", A2, 1],\n                          actions: [\n                            {\n                              title: [\"\\u770B\\u81EA\\u5DF1_\\u672C\\u570B\\u5168\\u90E8\\u7684\\u5361\", \"\\u672C\\u56FD\"]\n                            }\n                          ]\n                        }\n                      },\n                      logicTreeAction: {\n                        actions: [\n                          {\n                            title: function _(ctx4, effect2, { GameStateFn: GameStateFn2, DefineFn: DefineFn2 }) {\n                              const cardId = DefineFn2.EffectFn.getCardID(effect2), cardController = GameStateFn2.getItemController(ctx4, cardId), pairs = GameStateFn2.getCardTipStrBaSyouPairs(ctx4, \"\\u770B\\u81EA\\u5DF1\\u672C\\u570B\\u5168\\u90E8\\u7684\\u5361,\\u53EF\\u4EE5\\u5F9E\\u4E2D\\u627E\\u51FA\\u7279\\u5FB5A\\u76841\\u5F35\\u5361\\u79FB\\u5230HANGER,\\u90A3\\u500B\\u6642\\u5019\\u672C\\u570B\\u6D17\\u724C\", cardId);\n                              if (pairs.length) {\n                                for (let pair2 of pairs)\n                                  ctx4 = GameStateFn2.doItemMove(ctx4, DefineFn2.AbsoluteBaSyouFn.of(cardController, \"\\u30CF\\u30F3\\u30AC\\u30FC\"), pair2);\n                                ctx4 = GameStateFn2.shuffleItems(ctx4, DefineFn2.AbsoluteBaSyouFn.of(cardController, \"\\u672C\\u56FD\"));\n                              }\n                              return ctx4;\n                            }.toString()\n                          }\n                        ]\n                      }\n                    });\n                    return ctx3 = GameStateFn.addStackEffect(ctx3, newE), ctx3;\n                  }"
                            }
                        ]
                    }
                ]
            }
        },
        "createPlayEffects_PlayerB_PlayerB_82_loadPrototype_179027_09D_O_BK010N_black_text_1": {
            "id": "createPlayEffects_PlayerB_PlayerB_82_loadPrototype_179027_09D_O_BK010N_black_text_1",
            "reason": [
                "PlayText",
                "PlayerB",
                "PlayerB_82",
                "loadPrototype_179027_09D_O_BK010N_black_text_1"
            ],
            "description": "（常時）〔１〕：このカードを廃棄する。その場合、自軍ジャンクヤードにあるユニット１枚を、持ち主のハンガーに移す。",
            "text": {
                "id": "loadPrototype_179027_09D_O_BK010N_black_text_1",
                "description": "（常時）〔１〕：このカードを廃棄する。その場合、自軍ジャンクヤードにあるユニット１枚を、持ち主のハンガーに移す。",
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
                    "このカードを廃棄する": {
                        "actions": [
                            {
                                "title": [
                                    "_ロールする",
                                    "廃棄"
                                ]
                            }
                        ]
                    },
                    "自軍ジャンクヤードにあるユニット１枚": {
                        "title": [
                            "Entity",
                            {
                                "side": "自軍",
                                "at": [
                                    "ジャンクヤード"
                                ],
                                "is": [
                                    "ユニット"
                                ],
                                "count": 1
                            }
                        ],
                        "actions": [
                            {
                                "title": [
                                    "_の_ハンガーに移す",
                                    "持ち主",
                                    "ハンガー"
                                ]
                            }
                        ]
                    },
                    "同回合上限": {
                        "actions": [
                            {
                                "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn2.EffectFn.getCardID(effect);\n                if (GameStateFn2.getItemState(ctx3, cardId2).textIdsUseThisTurn?.[effect.text.id])\n                  throw new DefineFn2.TipError(`\\u540C\\u56DE\\u5408\\u4E0A\\u9650: ${effect.text.description}`);\n                return ctx3 = GameStateFn2.mapItemState(ctx3, cardId2, (ps2) => {\n                  return {\n                    ...ps2,\n                    textIdsUseThisTurn: {\n                      ...ps2.textIdsUseThisTurn,\n                      [effect.text.id]: !0\n                    }\n                  };\n                }), ctx3;\n              }"
                            }
                        ]
                    }
                }
            }
        }
    },
    "table": {
        "cardStack": {
            "[\"PlayerA\",\"本国\"]": [
                "PlayerA_19",
                "PlayerA_21",
                "PlayerA_8",
                "PlayerA_5",
                "PlayerA_9",
                "PlayerA_34",
                "PlayerA_22",
                "PlayerA_4",
                "PlayerA_43",
                "PlayerA_1",
                "PlayerA_39",
                "PlayerA_31",
                "PlayerA_26",
                "PlayerA_3",
                "PlayerA_23",
                "PlayerA_42",
                "PlayerA_17",
                "PlayerA_33",
                "PlayerA_0",
                "PlayerA_46",
                "PlayerA_36",
                "PlayerA_38",
                "PlayerA_40",
                "PlayerA_27",
                "PlayerA_15",
                "PlayerA_2",
                "PlayerA_11",
                "PlayerA_6",
                "PlayerA_29",
                "PlayerA_12",
                "PlayerA_47",
                "PlayerA_13",
                "PlayerA_41",
                "PlayerA_37",
                "PlayerA_32",
                "PlayerA_48",
                "PlayerA_35"
            ],
            "[\"PlayerB\",\"本国\"]": [
                "PlayerB_50",
                "PlayerB_52",
                "PlayerB_94",
                "PlayerB_81",
                "PlayerB_75"
            ],
            "[\"PlayerA\",\"Gゾーン\"]": [
                "PlayerA_100",
                "PlayerA_101",
                "PlayerA_102",
                "PlayerA_44",
                "PlayerA_45",
                "PlayerA_14"
            ],
            "[\"PlayerA\",\"配備エリア\"]": [
                "PlayerA_103",
                "PlayerA_49",
                "PlayerA_30",
                "PlayerA_7"
            ],
            "[\"PlayerB\",\"Gゾーン\"]": [
                "PlayerB_104",
                "PlayerB_105",
                "PlayerB_106",
                "PlayerB_63",
                "PlayerB_80"
            ],
            "[\"PlayerB\",\"配備エリア\"]": [
                "PlayerB_77",
                "PlayerB_82"
            ],
            "[\"PlayerA\",\"手札\"]": [
                "PlayerA_25",
                "PlayerA_18"
            ],
            "[\"PlayerB\",\"手札\"]": [
                "PlayerB_66",
                "PlayerB_67",
                "PlayerB_97"
            ],
            "[\"PlayerA\",\"プレイされているカード\"]": [],
            "[\"PlayerA\",\"ジャンクヤード\"]": [
                "PlayerA_10",
                "PlayerA_16",
                "PlayerA_28",
                "PlayerA_24"
            ],
            "[\"PlayerA\",\"戦闘エリア1\"]": [],
            "[\"PlayerB\",\"捨て山\"]": [
                "PlayerB_96",
                "PlayerB_98",
                "PlayerB_56",
                "PlayerB_60",
                "PlayerB_71",
                "PlayerB_95",
                "PlayerB_92",
                "PlayerB_57",
                "PlayerB_65",
                "PlayerB_59",
                "PlayerB_83",
                "PlayerB_91",
                "PlayerB_64",
                "PlayerB_93",
                "PlayerB_54",
                "PlayerB_55",
                "PlayerB_87",
                "PlayerB_73",
                "PlayerB_99",
                "PlayerB_61",
                "PlayerB_72",
                "PlayerB_79",
                "PlayerB_86",
                "PlayerB_84",
                "PlayerB_62",
                "PlayerB_85",
                "PlayerB_76",
                "PlayerB_74",
                "PlayerB_70",
                "PlayerB_53",
                "PlayerB_51"
            ],
            "[\"PlayerB\",\"プレイされているカード\"]": [],
            "[\"PlayerB\",\"ジャンクヤード\"]": [
                "PlayerB_68",
                "PlayerB_107",
                "PlayerB_89",
                "PlayerB_58",
                "PlayerB_90",
                "PlayerB_69"
            ],
            "[\"PlayerA\",\"ハンガー\"]": [
                "PlayerA_20"
            ],
            "[\"PlayerA\",\"戦闘エリア2\"]": [],
            "[\"PlayerB\",\"ハンガー\"]": [
                "PlayerB_88",
                "PlayerB_78"
            ]
        }
    },
    "chips": {},
    "chipProtos": {},
    "itemStates": {
        "PlayerA_7": {
            "id": "PlayerA_7",
            "damage": 0,
            "destroyReason": null,
            "flags": {},
            "tips": {},
            "globalEffects": {},
            "varNamesRemoveOnTurnEnd": {},
            "textIdsUseThisCut": {},
            "isOpenForGain": false,
            "isCheat": false,
            "isFirstTurn": false,
            "textIdsUseThisTurn": {}
        },
        "PlayerA_103": {
            "id": "PlayerA_103",
            "damage": 0,
            "destroyReason": null,
            "flags": {},
            "tips": {
                "0[null]": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerA_102",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_44",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_45",
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
                                "PlayerA_102",
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
                "1[null]": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerA_44",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_45",
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
                                "PlayerA_44",
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
                }
            },
            "globalEffects": {},
            "varNamesRemoveOnTurnEnd": {},
            "textIdsUseThisCut": {},
            "isOpenForGain": false,
            "isCheat": false,
            "isFirstTurn": false,
            "textIdsUseThisTurn": {}
        },
        "PlayerA_10": {
            "id": "PlayerA_10",
            "damage": 0,
            "destroyReason": null,
            "flags": {},
            "tips": {
                "0[白]": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerA_100",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_101",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_102",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_44",
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
                                "PlayerA_100",
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
                                "PlayerA_100",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_101",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_102",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_44",
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
                "打開自軍手裡或指定HANGER中特徵A並合計國力x以下的1張卡": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerA_10",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "手札"
                                    ]
                                }
                            ]
                        ],
                        [
                            [
                                "PlayerA_10",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
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
            "textIdsUseThisCut": {},
            "textIdsUseThisTurn": {},
            "isOpenForGain": false,
            "isCheat": false
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
                                "PlayerA_30",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "配備エリア"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_7",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "配備エリア"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_103",
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
                                "PlayerA_30",
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
                                "PlayerA_30",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "配備エリア"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_7",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "配備エリア"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_103",
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
                                "PlayerA_7",
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
            "textIdsUseThisCut": {},
            "textIdsUseThisTurn": {}
        },
        "PlayerB_68": {
            "id": "PlayerB_68",
            "damage": 0,
            "destroyReason": null,
            "flags": {},
            "tips": {
                "敵軍手札１枚": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerA_16",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "手札"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_30",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "手札"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_45",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "手札"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_28",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "手札"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_24",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "手札"
                                    ]
                                }
                            ]
                        ],
                        [
                            [
                                "PlayerA_16",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "手札"
                                    ]
                                }
                            ]
                        ]
                    ],
                    "count": 1
                },
                "0[黒]": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerB_104",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_105",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_106",
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
                                "PlayerB_104",
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
                                "PlayerB_104",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_105",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_106",
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
            "textIdsUseThisCut": {},
            "isOpenForGain": false,
            "isCheat": false,
            "isFirstTurn": false,
            "textIdsUseThisTurn": {}
        },
        "PlayerB_58": {
            "id": "PlayerB_58",
            "damage": 0,
            "destroyReason": null,
            "flags": {},
            "tips": {
                "黒X": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerB_105",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_106",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_63",
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
                                "PlayerB_105",
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
                                "PlayerB_105",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_106",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_63",
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
            "textIdsUseThisCut": {},
            "isOpenForGain": false,
            "isCheat": false,
            "textIdsUseThisTurn": {}
        },
        "PlayerB_89": {
            "id": "PlayerB_89",
            "damage": 0,
            "destroyReason": null,
            "flags": {},
            "tips": {
                "自軍カード１枚": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerB_107",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "配備エリア"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_58",
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
                                "PlayerB_107",
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
                "0[黒]": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerB_105",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_106",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_63",
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
                                "PlayerB_105",
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
                                "PlayerB_105",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_106",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_63",
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
            "textIdsUseThisCut": {},
            "isOpenForGain": false,
            "isCheat": false,
            "isFirstTurn": false,
            "textIdsUseThisTurn": {}
        },
        "PlayerB_107": {
            "id": "PlayerB_107",
            "damage": 0,
            "destroyReason": null,
            "flags": {},
            "tips": {},
            "globalEffects": {},
            "varNamesRemoveOnTurnEnd": {},
            "textIdsUseThisCut": {},
            "isOpenForGain": false,
            "isCheat": false,
            "isFirstTurn": false,
            "textIdsUseThisTurn": {}
        },
        "PlayerB_90": {
            "id": "PlayerB_90",
            "damage": 0,
            "destroyReason": null,
            "flags": {},
            "tips": {
                "0[黒]": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerB_106",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_63",
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
                                "PlayerB_106",
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
                "自軍カード１枚": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerB_58",
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
                                "PlayerB_58",
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
                                "PlayerB_106",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_63",
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
            "textIdsUseThisCut": {},
            "isOpenForGain": false,
            "isCheat": false,
            "isFirstTurn": false,
            "textIdsUseThisTurn": {}
        },
        "PlayerA_30": {
            "id": "PlayerA_30",
            "damage": 0,
            "destroyReason": null,
            "flags": {},
            "tips": {
                "0[白]": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerA_100",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_101",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_102",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_44",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_45",
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
                                "PlayerA_100",
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
                                "PlayerA_101",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_102",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_44",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_45",
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
                                "PlayerA_101",
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
                                "PlayerA_100",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_101",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_102",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_44",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_45",
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
                "看自己本國全部的卡,可以從中找出特徵A的1張卡移到HANGER,那個時候本國洗牌": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerA_12",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "本国"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_21",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "本国"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_3",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "本国"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_26",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "本国"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_6",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "本国"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_9",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "本国"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_4",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "本国"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_20",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "本国"
                                    ]
                                }
                            ],
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
                                "PlayerA_5",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "本国"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_27",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "本国"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_11",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "本国"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_17",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "本国"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_15",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "本国"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_13",
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
                                "PlayerA_20",
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
                    "max": 1,
                    "cheatCardIds": [
                        "PlayerA_46",
                        "PlayerA_12",
                        "PlayerA_21",
                        "PlayerA_3",
                        "PlayerA_19",
                        "PlayerA_31",
                        "PlayerA_40",
                        "PlayerA_34",
                        "PlayerA_26",
                        "PlayerA_43",
                        "PlayerA_6",
                        "PlayerA_9",
                        "PlayerA_4",
                        "PlayerA_48",
                        "PlayerA_20",
                        "PlayerA_29",
                        "PlayerA_8",
                        "PlayerA_0",
                        "PlayerA_23",
                        "PlayerA_5",
                        "PlayerA_36",
                        "PlayerA_32",
                        "PlayerA_37",
                        "PlayerA_47",
                        "PlayerA_2",
                        "PlayerA_27",
                        "PlayerA_39",
                        "PlayerA_11",
                        "PlayerA_17",
                        "PlayerA_18",
                        "PlayerA_1",
                        "PlayerA_49",
                        "PlayerA_38",
                        "PlayerA_42",
                        "PlayerA_15",
                        "PlayerA_41",
                        "PlayerA_22",
                        "PlayerA_13",
                        "PlayerA_35",
                        "PlayerA_33"
                    ]
                },
                "1[null]": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerA_45",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_14",
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
                                "PlayerA_45",
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
                "「特徴：アストレイ系」を持つ自軍ユニット１枚": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerA_30",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "配備エリア"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_7",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "配備エリア"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_103",
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
                                "PlayerA_30",
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
                    ]
                },
                "0[null]": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerA_14",
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
                                "PlayerA_14",
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
                "このカードの本来のテキスト１つ": {
                    "title": [
                        "テキスト",
                        [
                            {
                                "cardId": "PlayerA_30",
                                "textId": "loadPrototype_179024_03B_U_WT057U_white_text_0"
                            },
                            {
                                "cardId": "PlayerA_30",
                                "textId": "loadPrototype_179024_03B_U_WT057U_white_text_1"
                            },
                            {
                                "cardId": "PlayerA_30",
                                "textId": "loadPrototype_179024_03B_U_WT057U_white_text_3"
                            }
                        ],
                        [
                            {
                                "cardId": "PlayerA_30",
                                "textId": "loadPrototype_179024_03B_U_WT057U_white_text_0"
                            }
                        ]
                    ]
                },
                "［ ］の特徴を持つ自軍ユニット１枚は": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerA_7",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "配備エリア"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_103",
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
                                "PlayerA_7",
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
                }
            },
            "globalEffects": {},
            "varNamesRemoveOnTurnEnd": {},
            "isFirstTurn": false,
            "textIdsUseThisCut": {},
            "textIdsUseThisTurn": {},
            "isOpenForGain": false,
            "isCheat": false
        },
        "PlayerA_46": {
            "id": "PlayerA_46",
            "damage": 0,
            "destroyReason": null,
            "flags": {},
            "tips": {},
            "globalEffects": {},
            "varNamesRemoveOnTurnEnd": {},
            "isCheat": false,
            "textIdsUseThisCut": {},
            "isOpenForGain": false,
            "isFirstTurn": false,
            "textIdsUseThisTurn": {}
        },
        "PlayerA_12": {
            "id": "PlayerA_12",
            "damage": 0,
            "destroyReason": null,
            "flags": {},
            "tips": {},
            "globalEffects": {},
            "varNamesRemoveOnTurnEnd": {},
            "isCheat": false,
            "textIdsUseThisCut": {},
            "isOpenForGain": false,
            "isFirstTurn": false,
            "textIdsUseThisTurn": {}
        },
        "PlayerA_21": {
            "id": "PlayerA_21",
            "damage": 0,
            "destroyReason": null,
            "flags": {},
            "tips": {},
            "globalEffects": {},
            "varNamesRemoveOnTurnEnd": {},
            "isCheat": false,
            "textIdsUseThisCut": {},
            "isOpenForGain": false,
            "isFirstTurn": false,
            "textIdsUseThisTurn": {}
        },
        "PlayerA_3": {
            "id": "PlayerA_3",
            "damage": 0,
            "destroyReason": null,
            "flags": {},
            "tips": {},
            "globalEffects": {},
            "varNamesRemoveOnTurnEnd": {},
            "isCheat": false,
            "textIdsUseThisCut": {},
            "isOpenForGain": false,
            "isFirstTurn": false,
            "textIdsUseThisTurn": {}
        },
        "PlayerA_19": {
            "id": "PlayerA_19",
            "damage": 0,
            "destroyReason": null,
            "flags": {},
            "tips": {},
            "globalEffects": {},
            "varNamesRemoveOnTurnEnd": {},
            "isCheat": false,
            "textIdsUseThisCut": {},
            "isOpenForGain": false,
            "isFirstTurn": false,
            "textIdsUseThisTurn": {}
        },
        "PlayerA_31": {
            "id": "PlayerA_31",
            "damage": 0,
            "destroyReason": null,
            "flags": {},
            "tips": {},
            "globalEffects": {},
            "varNamesRemoveOnTurnEnd": {},
            "isCheat": false,
            "textIdsUseThisCut": {},
            "isOpenForGain": false,
            "isFirstTurn": false,
            "textIdsUseThisTurn": {}
        },
        "PlayerA_40": {
            "id": "PlayerA_40",
            "damage": 0,
            "destroyReason": null,
            "flags": {},
            "tips": {},
            "globalEffects": {},
            "varNamesRemoveOnTurnEnd": {},
            "isCheat": false,
            "textIdsUseThisCut": {},
            "isOpenForGain": false,
            "isFirstTurn": false,
            "textIdsUseThisTurn": {}
        },
        "PlayerA_34": {
            "id": "PlayerA_34",
            "damage": 0,
            "destroyReason": null,
            "flags": {},
            "tips": {},
            "globalEffects": {},
            "varNamesRemoveOnTurnEnd": {},
            "isCheat": false,
            "textIdsUseThisCut": {},
            "isOpenForGain": false,
            "isFirstTurn": false,
            "textIdsUseThisTurn": {}
        },
        "PlayerA_26": {
            "id": "PlayerA_26",
            "damage": 0,
            "destroyReason": null,
            "flags": {},
            "tips": {},
            "globalEffects": {},
            "varNamesRemoveOnTurnEnd": {},
            "isCheat": false,
            "textIdsUseThisCut": {},
            "isOpenForGain": false,
            "isFirstTurn": false,
            "textIdsUseThisTurn": {}
        },
        "PlayerA_43": {
            "id": "PlayerA_43",
            "damage": 0,
            "destroyReason": null,
            "flags": {},
            "tips": {},
            "globalEffects": {},
            "varNamesRemoveOnTurnEnd": {},
            "isCheat": false,
            "textIdsUseThisCut": {},
            "isOpenForGain": false,
            "isFirstTurn": false,
            "textIdsUseThisTurn": {}
        },
        "PlayerA_6": {
            "id": "PlayerA_6",
            "damage": 0,
            "destroyReason": null,
            "flags": {},
            "tips": {},
            "globalEffects": {},
            "varNamesRemoveOnTurnEnd": {},
            "isCheat": false,
            "textIdsUseThisCut": {},
            "isOpenForGain": false,
            "isFirstTurn": false,
            "textIdsUseThisTurn": {}
        },
        "PlayerA_9": {
            "id": "PlayerA_9",
            "damage": 0,
            "destroyReason": null,
            "flags": {},
            "tips": {},
            "globalEffects": {},
            "varNamesRemoveOnTurnEnd": {},
            "isCheat": false,
            "textIdsUseThisCut": {},
            "isOpenForGain": false,
            "isFirstTurn": false,
            "textIdsUseThisTurn": {}
        },
        "PlayerA_4": {
            "id": "PlayerA_4",
            "damage": 0,
            "destroyReason": null,
            "flags": {},
            "tips": {},
            "globalEffects": {},
            "varNamesRemoveOnTurnEnd": {},
            "isCheat": false,
            "textIdsUseThisCut": {},
            "isOpenForGain": false,
            "isFirstTurn": false,
            "textIdsUseThisTurn": {}
        },
        "PlayerA_48": {
            "id": "PlayerA_48",
            "damage": 0,
            "destroyReason": null,
            "flags": {},
            "tips": {},
            "globalEffects": {},
            "varNamesRemoveOnTurnEnd": {},
            "isCheat": false,
            "textIdsUseThisCut": {},
            "isOpenForGain": false,
            "isFirstTurn": false,
            "textIdsUseThisTurn": {}
        },
        "PlayerA_20": {
            "id": "PlayerA_20",
            "damage": 0,
            "destroyReason": null,
            "flags": {},
            "tips": {},
            "globalEffects": {},
            "varNamesRemoveOnTurnEnd": {},
            "isCheat": false,
            "textIdsUseThisCut": {},
            "isOpenForGain": false,
            "isFirstTurn": false,
            "textIdsUseThisTurn": {}
        },
        "PlayerA_29": {
            "id": "PlayerA_29",
            "damage": 0,
            "destroyReason": null,
            "flags": {},
            "tips": {},
            "globalEffects": {},
            "varNamesRemoveOnTurnEnd": {},
            "isCheat": false,
            "textIdsUseThisCut": {},
            "isOpenForGain": false,
            "isFirstTurn": false,
            "textIdsUseThisTurn": {}
        },
        "PlayerA_8": {
            "id": "PlayerA_8",
            "damage": 0,
            "destroyReason": null,
            "flags": {},
            "tips": {},
            "globalEffects": {},
            "varNamesRemoveOnTurnEnd": {},
            "isCheat": false,
            "textIdsUseThisCut": {},
            "isOpenForGain": false,
            "isFirstTurn": false,
            "textIdsUseThisTurn": {}
        },
        "PlayerA_0": {
            "id": "PlayerA_0",
            "damage": 0,
            "destroyReason": null,
            "flags": {},
            "tips": {},
            "globalEffects": {},
            "varNamesRemoveOnTurnEnd": {},
            "isCheat": false,
            "textIdsUseThisCut": {},
            "isOpenForGain": false,
            "isFirstTurn": false,
            "textIdsUseThisTurn": {}
        },
        "PlayerA_23": {
            "id": "PlayerA_23",
            "damage": 0,
            "destroyReason": null,
            "flags": {},
            "tips": {},
            "globalEffects": {},
            "varNamesRemoveOnTurnEnd": {},
            "isCheat": false,
            "textIdsUseThisCut": {},
            "isOpenForGain": false,
            "isFirstTurn": false,
            "textIdsUseThisTurn": {}
        },
        "PlayerA_5": {
            "id": "PlayerA_5",
            "damage": 0,
            "destroyReason": null,
            "flags": {},
            "tips": {},
            "globalEffects": {},
            "varNamesRemoveOnTurnEnd": {},
            "isCheat": false,
            "textIdsUseThisCut": {},
            "isOpenForGain": false,
            "isFirstTurn": false,
            "textIdsUseThisTurn": {}
        },
        "PlayerA_36": {
            "id": "PlayerA_36",
            "damage": 0,
            "destroyReason": null,
            "flags": {},
            "tips": {},
            "globalEffects": {},
            "varNamesRemoveOnTurnEnd": {},
            "isCheat": false,
            "textIdsUseThisCut": {},
            "isOpenForGain": false,
            "isFirstTurn": false,
            "textIdsUseThisTurn": {}
        },
        "PlayerA_32": {
            "id": "PlayerA_32",
            "damage": 0,
            "destroyReason": null,
            "flags": {},
            "tips": {},
            "globalEffects": {},
            "varNamesRemoveOnTurnEnd": {},
            "isCheat": false,
            "textIdsUseThisCut": {},
            "isOpenForGain": false,
            "isFirstTurn": false,
            "textIdsUseThisTurn": {}
        },
        "PlayerA_37": {
            "id": "PlayerA_37",
            "damage": 0,
            "destroyReason": null,
            "flags": {},
            "tips": {},
            "globalEffects": {},
            "varNamesRemoveOnTurnEnd": {},
            "isCheat": false,
            "textIdsUseThisCut": {},
            "isOpenForGain": false,
            "isFirstTurn": false,
            "textIdsUseThisTurn": {}
        },
        "PlayerA_47": {
            "id": "PlayerA_47",
            "damage": 0,
            "destroyReason": null,
            "flags": {},
            "tips": {},
            "globalEffects": {},
            "varNamesRemoveOnTurnEnd": {},
            "isCheat": false,
            "textIdsUseThisCut": {},
            "isOpenForGain": false,
            "isFirstTurn": false,
            "textIdsUseThisTurn": {}
        },
        "PlayerA_2": {
            "id": "PlayerA_2",
            "damage": 0,
            "destroyReason": null,
            "flags": {},
            "tips": {},
            "globalEffects": {},
            "varNamesRemoveOnTurnEnd": {},
            "isCheat": false,
            "textIdsUseThisCut": {},
            "isOpenForGain": false,
            "isFirstTurn": false,
            "textIdsUseThisTurn": {}
        },
        "PlayerA_27": {
            "id": "PlayerA_27",
            "damage": 0,
            "destroyReason": null,
            "flags": {},
            "tips": {},
            "globalEffects": {},
            "varNamesRemoveOnTurnEnd": {},
            "isCheat": false,
            "textIdsUseThisCut": {},
            "isOpenForGain": false,
            "isFirstTurn": false,
            "textIdsUseThisTurn": {}
        },
        "PlayerA_39": {
            "id": "PlayerA_39",
            "damage": 0,
            "destroyReason": null,
            "flags": {},
            "tips": {},
            "globalEffects": {},
            "varNamesRemoveOnTurnEnd": {},
            "isCheat": false,
            "textIdsUseThisCut": {},
            "isOpenForGain": false,
            "isFirstTurn": false,
            "textIdsUseThisTurn": {}
        },
        "PlayerA_11": {
            "id": "PlayerA_11",
            "damage": 0,
            "destroyReason": null,
            "flags": {},
            "tips": {},
            "globalEffects": {},
            "varNamesRemoveOnTurnEnd": {},
            "isCheat": false,
            "textIdsUseThisCut": {},
            "isOpenForGain": false,
            "isFirstTurn": false,
            "textIdsUseThisTurn": {}
        },
        "PlayerA_17": {
            "id": "PlayerA_17",
            "damage": 0,
            "destroyReason": null,
            "flags": {},
            "tips": {},
            "globalEffects": {},
            "varNamesRemoveOnTurnEnd": {},
            "isCheat": false,
            "textIdsUseThisCut": {},
            "isOpenForGain": false,
            "isFirstTurn": false,
            "textIdsUseThisTurn": {}
        },
        "PlayerA_18": {
            "id": "PlayerA_18",
            "damage": 0,
            "destroyReason": null,
            "flags": {},
            "tips": {},
            "globalEffects": {},
            "varNamesRemoveOnTurnEnd": {},
            "isCheat": false,
            "textIdsUseThisCut": {},
            "isOpenForGain": false,
            "isFirstTurn": false,
            "textIdsUseThisTurn": {}
        },
        "PlayerA_1": {
            "id": "PlayerA_1",
            "damage": 0,
            "destroyReason": null,
            "flags": {},
            "tips": {},
            "globalEffects": {},
            "varNamesRemoveOnTurnEnd": {},
            "isCheat": false,
            "textIdsUseThisCut": {},
            "isOpenForGain": false,
            "isFirstTurn": false,
            "textIdsUseThisTurn": {}
        },
        "PlayerA_49": {
            "id": "PlayerA_49",
            "damage": 0,
            "destroyReason": null,
            "flags": {},
            "tips": {
                "0[白]": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerA_100",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_101",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_102",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_44",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_45",
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
                                "PlayerA_100",
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
                                "PlayerA_100",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_101",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_102",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_44",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_45",
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
                "自軍キャラ１枚": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerA_24",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "戦闘エリア1"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_49",
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
                                "PlayerA_24",
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
                }
            },
            "globalEffects": {},
            "varNamesRemoveOnTurnEnd": {},
            "isCheat": false,
            "textIdsUseThisCut": {},
            "isOpenForGain": false,
            "isFirstTurn": false,
            "textIdsUseThisTurn": {}
        },
        "PlayerA_38": {
            "id": "PlayerA_38",
            "damage": 0,
            "destroyReason": null,
            "flags": {},
            "tips": {},
            "globalEffects": {},
            "varNamesRemoveOnTurnEnd": {},
            "isCheat": false,
            "textIdsUseThisCut": {},
            "isOpenForGain": false,
            "isFirstTurn": false,
            "textIdsUseThisTurn": {}
        },
        "PlayerA_42": {
            "id": "PlayerA_42",
            "damage": 0,
            "destroyReason": null,
            "flags": {},
            "tips": {},
            "globalEffects": {},
            "varNamesRemoveOnTurnEnd": {},
            "isCheat": false,
            "textIdsUseThisCut": {},
            "isOpenForGain": false,
            "isFirstTurn": false,
            "textIdsUseThisTurn": {}
        },
        "PlayerA_15": {
            "id": "PlayerA_15",
            "damage": 0,
            "destroyReason": null,
            "flags": {},
            "tips": {},
            "globalEffects": {},
            "varNamesRemoveOnTurnEnd": {},
            "isCheat": false,
            "textIdsUseThisCut": {},
            "isOpenForGain": false,
            "isFirstTurn": false,
            "textIdsUseThisTurn": {}
        },
        "PlayerA_41": {
            "id": "PlayerA_41",
            "damage": 0,
            "destroyReason": null,
            "flags": {},
            "tips": {},
            "globalEffects": {},
            "varNamesRemoveOnTurnEnd": {},
            "isCheat": false,
            "textIdsUseThisCut": {},
            "isOpenForGain": false,
            "isFirstTurn": false,
            "textIdsUseThisTurn": {}
        },
        "PlayerA_22": {
            "id": "PlayerA_22",
            "damage": 0,
            "destroyReason": null,
            "flags": {},
            "tips": {},
            "globalEffects": {},
            "varNamesRemoveOnTurnEnd": {},
            "isCheat": false,
            "textIdsUseThisCut": {},
            "isOpenForGain": false,
            "isFirstTurn": false,
            "textIdsUseThisTurn": {}
        },
        "PlayerA_13": {
            "id": "PlayerA_13",
            "damage": 0,
            "destroyReason": null,
            "flags": {},
            "tips": {},
            "globalEffects": {},
            "varNamesRemoveOnTurnEnd": {},
            "isCheat": false,
            "textIdsUseThisCut": {},
            "isOpenForGain": false,
            "isFirstTurn": false,
            "textIdsUseThisTurn": {}
        },
        "PlayerA_35": {
            "id": "PlayerA_35",
            "damage": 0,
            "destroyReason": null,
            "flags": {},
            "tips": {},
            "globalEffects": {},
            "varNamesRemoveOnTurnEnd": {},
            "isCheat": false,
            "textIdsUseThisCut": {},
            "isOpenForGain": false,
            "isFirstTurn": false,
            "textIdsUseThisTurn": {}
        },
        "PlayerA_33": {
            "id": "PlayerA_33",
            "damage": 0,
            "destroyReason": null,
            "flags": {},
            "tips": {},
            "globalEffects": {},
            "varNamesRemoveOnTurnEnd": {},
            "isCheat": false,
            "textIdsUseThisCut": {},
            "isOpenForGain": false,
            "isFirstTurn": false,
            "textIdsUseThisTurn": {}
        },
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
                        []
                    ],
                    "flags": {
                        "isGoBattleArea1": true
                    }
                },
                "去宇宙": {
                    "title": [
                        "カード",
                        [],
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
            "textIdsUseThisCut": {},
            "textIdsUseThisTurn": {}
        },
        "PlayerB_69": {
            "id": "PlayerB_69",
            "damage": 0,
            "destroyReason": null,
            "flags": {},
            "tips": {
                "敵軍手札１枚": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerA_28",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "手札"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_24",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "手札"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_14",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "手札"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_25",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "手札"
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
                                        "手札"
                                    ]
                                }
                            ]
                        ]
                    ],
                    "count": 1
                },
                "0[黒]": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerB_104",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_105",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_106",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_63",
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
                                "PlayerB_104",
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
                                "PlayerB_104",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_105",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_106",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_63",
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
            "textIdsUseThisCut": {},
            "isOpenForGain": false,
            "isCheat": false,
            "isFirstTurn": false,
            "textIdsUseThisTurn": {}
        },
        "PlayerB_88": {
            "id": "PlayerB_88",
            "damage": 0,
            "destroyReason": null,
            "flags": {},
            "tips": {
                "0[黒]": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerB_105",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_106",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_63",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_88",
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
                                "PlayerB_105",
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
                "自軍本国のカードを全て見て、その中にあるグラフィック１枚を": {
                    "title": [
                        "カード",
                        [],
                        []
                    ],
                    "max": 1,
                    "cheatCardIds": [
                        "PlayerB_79",
                        "PlayerB_74",
                        "PlayerB_75",
                        "PlayerB_61",
                        "PlayerB_55",
                        "PlayerB_81",
                        "PlayerB_78",
                        "PlayerB_84",
                        "PlayerB_94",
                        "PlayerB_52",
                        "PlayerB_70",
                        "PlayerB_51",
                        "PlayerB_93",
                        "PlayerB_87",
                        "PlayerB_86",
                        "PlayerB_53",
                        "PlayerB_54",
                        "PlayerB_99",
                        "PlayerB_72",
                        "PlayerB_50",
                        "PlayerB_76",
                        "PlayerB_85",
                        "PlayerB_73",
                        "PlayerB_62",
                        "PlayerB_82"
                    ]
                },
                "1[黒]": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerB_106",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_63",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_88",
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
                                "PlayerB_106",
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
            "isOpenForGain": false,
            "isCheat": false,
            "isFirstTurn": false,
            "textIdsUseThisCut": {},
            "textIdsUseThisTurn": {}
        },
        "PlayerA_24": {
            "id": "PlayerA_24",
            "damage": 0,
            "destroyReason": null,
            "flags": {},
            "tips": {
                "一個自軍機體": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerA_30",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "配備エリア"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_7",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "配備エリア"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_103",
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
                                "PlayerA_30",
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
                "0[白]": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerA_101",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_102",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_44",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_45",
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
                                "PlayerA_101",
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
                                "PlayerA_102",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_44",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_45",
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
                                "PlayerA_102",
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
                                "PlayerA_101",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_102",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_44",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_45",
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
            "textIdsUseThisCut": {},
            "isOpenForGain": false,
            "isCheat": false,
            "textIdsUseThisTurn": {}
        },
        "PlayerB_77": {
            "id": "PlayerB_77",
            "damage": 0,
            "destroyReason": null,
            "flags": {},
            "tips": {
                "1[黒]": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerB_105",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_106",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_63",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_80",
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
                                "PlayerB_105",
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
                                "PlayerB_104",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_105",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_106",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_63",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_80",
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
                "0[黒]": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerB_63",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_80",
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
                                "PlayerB_63",
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
                "看自己本國全部的卡,可以從中找出特徵A的1張卡移到HANGER,那個時候本國洗牌": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerB_78",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "本国"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_52",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "本国"
                                    ]
                                }
                            ]
                        ],
                        [
                            [
                                "PlayerB_78",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "本国"
                                    ]
                                }
                            ]
                        ]
                    ],
                    "max": 1,
                    "cheatCardIds": [
                        "PlayerB_78",
                        "PlayerB_75",
                        "PlayerB_81",
                        "PlayerB_94",
                        "PlayerB_52",
                        "PlayerB_50"
                    ]
                }
            },
            "globalEffects": {},
            "varNamesRemoveOnTurnEnd": {},
            "isFirstTurn": false,
            "textIdsUseThisCut": {},
            "textIdsUseThisTurn": {},
            "isOpenForGain": false,
            "isCheat": false
        },
        "PlayerB_82": {
            "id": "PlayerB_82",
            "damage": 0,
            "destroyReason": null,
            "flags": {},
            "tips": {
                "0[黒]": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerB_106",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_63",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_80",
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
                                "PlayerB_106",
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
                                "PlayerB_106",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_63",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_80",
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
            "textIdsUseThisCut": {},
            "isOpenForGain": false,
            "isCheat": false,
            "textIdsUseThisTurn": {}
        },
        "PlayerB_78": {
            "id": "PlayerB_78",
            "damage": 0,
            "destroyReason": null,
            "flags": {},
            "tips": {},
            "globalEffects": {},
            "varNamesRemoveOnTurnEnd": {},
            "isCheat": false,
            "textIdsUseThisCut": {},
            "isOpenForGain": false,
            "isFirstTurn": false,
            "textIdsUseThisTurn": {}
        },
        "PlayerB_75": {
            "id": "PlayerB_75",
            "damage": 0,
            "destroyReason": null,
            "flags": {},
            "tips": {},
            "globalEffects": {},
            "varNamesRemoveOnTurnEnd": {},
            "isCheat": false,
            "textIdsUseThisCut": {},
            "isOpenForGain": false,
            "isFirstTurn": false,
            "textIdsUseThisTurn": {}
        },
        "PlayerB_81": {
            "id": "PlayerB_81",
            "damage": 0,
            "destroyReason": null,
            "flags": {},
            "tips": {},
            "globalEffects": {},
            "varNamesRemoveOnTurnEnd": {},
            "isCheat": false,
            "textIdsUseThisCut": {},
            "isOpenForGain": false,
            "isFirstTurn": false,
            "textIdsUseThisTurn": {}
        },
        "PlayerB_94": {
            "id": "PlayerB_94",
            "damage": 0,
            "destroyReason": null,
            "flags": {},
            "tips": {},
            "globalEffects": {},
            "varNamesRemoveOnTurnEnd": {},
            "isCheat": false,
            "textIdsUseThisCut": {},
            "isOpenForGain": false,
            "isFirstTurn": false,
            "textIdsUseThisTurn": {}
        },
        "PlayerB_52": {
            "id": "PlayerB_52",
            "damage": 0,
            "destroyReason": null,
            "flags": {},
            "tips": {},
            "globalEffects": {},
            "varNamesRemoveOnTurnEnd": {},
            "isCheat": false,
            "textIdsUseThisCut": {},
            "isOpenForGain": false,
            "isFirstTurn": false,
            "textIdsUseThisTurn": {}
        },
        "PlayerB_50": {
            "id": "PlayerB_50",
            "damage": 0,
            "destroyReason": null,
            "flags": {},
            "tips": {},
            "globalEffects": {},
            "varNamesRemoveOnTurnEnd": {},
            "isCheat": false,
            "textIdsUseThisCut": {},
            "isOpenForGain": false,
            "isFirstTurn": false,
            "textIdsUseThisTurn": {}
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
    "activePlayerID": "PlayerA",
    "immediateEffect": [],
    "stackEffect": [],
    "destroyEffect": [],
    "commandEffects": [
        "createPlayCardEffects_PlayerA_18",
        "createPlayEffects_PlayerA_PlayerA_49_loadPrototype_179901_CG_CH_WT002P_white_text_0",
        "createPlayEffects_PlayerA_PlayerA_49_loadPrototype_179901_CG_CH_WT002P_white_text_1",
        "createPlayEffects_PlayerA_PlayerA_30_loadPrototype_179024_03B_U_WT057U_white_text_0",
        "createPlayEffects_PlayerA_PlayerA_30_loadPrototype_179024_03B_U_WT057U_white_text_1",
        "createPlayEffects_PlayerA_PlayerA_30_loadPrototype_179024_03B_U_WT057U_white_text_2",
        "createPlayEffects_PlayerA_PlayerA_30_loadPrototype_179024_03B_U_WT057U_white_text_3",
        "createPlayEffects_PlayerA_PlayerA_7_loadPrototype_179015_04B_U_WT067C_white_text_0",
        "createPlayEffects_PlayerA_PlayerA_7_loadPrototype_179015_04B_U_WT067C_white_text_1",
        "createPlayEffects_PlayerA_PlayerA_7_loadPrototype_179015_04B_U_WT067C_white_text_2",
        "createPlayCardEffects_PlayerB_78",
        "createPlayEffects_PlayerB_PlayerB_77_loadPrototype_179024_B2B_U_BK128S_black_02_text_1",
        "createPlayEffects_PlayerB_PlayerB_77_loadPrototype_179024_B2B_U_BK128S_black_02_text_2",
        "createPlayEffects_PlayerB_PlayerB_77_loadPrototype_179024_B2B_U_BK128S_black_02_text_3",
        "createPlayEffects_PlayerB_PlayerB_82_loadPrototype_179027_09D_O_BK010N_black_text_1"
    ],
    "commandEffectTips": [
        {
            "effectId": "createPlayCardEffects_PlayerA_18",
            "logicID": 0,
            "logicSubID": 0,
            "tipOrErrors": [
                {
                    "effectId": "createPlayCardEffects_PlayerA_18",
                    "conditionKey": "合計国力〔x〕",
                    "tip": null,
                    "errors": []
                },
                {
                    "effectId": "createPlayCardEffects_PlayerA_18",
                    "conditionKey": "0[白]",
                    "tip": {
                        "title": [
                            "カード",
                            [
                                [
                                    "PlayerA_100",
                                    {
                                        "id": "AbsoluteBaSyou",
                                        "value": [
                                            "PlayerA",
                                            "Gゾーン"
                                        ]
                                    }
                                ],
                                [
                                    "PlayerA_101",
                                    {
                                        "id": "AbsoluteBaSyou",
                                        "value": [
                                            "PlayerA",
                                            "Gゾーン"
                                        ]
                                    }
                                ],
                                [
                                    "PlayerA_102",
                                    {
                                        "id": "AbsoluteBaSyou",
                                        "value": [
                                            "PlayerA",
                                            "Gゾーン"
                                        ]
                                    }
                                ],
                                [
                                    "PlayerA_44",
                                    {
                                        "id": "AbsoluteBaSyou",
                                        "value": [
                                            "PlayerA",
                                            "Gゾーン"
                                        ]
                                    }
                                ],
                                [
                                    "PlayerA_45",
                                    {
                                        "id": "AbsoluteBaSyou",
                                        "value": [
                                            "PlayerA",
                                            "Gゾーン"
                                        ]
                                    }
                                ],
                                [
                                    "PlayerA_14",
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
                                    "PlayerA_100",
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
                    "effectId": "createPlayCardEffects_PlayerA_18",
                    "conditionKey": "自軍ユニット１枚",
                    "tip": {
                        "title": [
                            "カード",
                            [
                                [
                                    "PlayerA_103",
                                    {
                                        "id": "AbsoluteBaSyou",
                                        "value": [
                                            "PlayerA",
                                            "配備エリア"
                                        ]
                                    }
                                ],
                                [
                                    "PlayerA_30",
                                    {
                                        "id": "AbsoluteBaSyou",
                                        "value": [
                                            "PlayerA",
                                            "配備エリア"
                                        ]
                                    }
                                ],
                                [
                                    "PlayerA_7",
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
                                    "PlayerA_103",
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
                    "effectId": "createPlayCardEffects_PlayerA_18",
                    "conditionKey": "「速攻」または「高機動」",
                    "tip": {
                        "title": [
                            "StringOptions",
                            [
                                "速攻",
                                "高機動"
                            ],
                            [
                                "速攻"
                            ]
                        ],
                        "count": 1
                    },
                    "errors": []
                }
            ]
        },
        {
            "effectId": "createPlayEffects_PlayerA_PlayerA_49_loadPrototype_179901_CG_CH_WT002P_white_text_0",
            "logicID": 0,
            "logicSubID": 0,
            "tipOrErrors": [
                {
                    "effectId": "createPlayEffects_PlayerA_PlayerA_49_loadPrototype_179901_CG_CH_WT002P_white_text_0",
                    "conditionKey": "〔R〕",
                    "tip": null,
                    "errors": []
                },
                {
                    "effectId": "createPlayEffects_PlayerA_PlayerA_49_loadPrototype_179901_CG_CH_WT002P_white_text_0",
                    "conditionKey": "自軍キャラ１枚",
                    "tip": {
                        "title": [
                            "カード",
                            [
                                [
                                    "PlayerA_49",
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
                                    "PlayerA_49",
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
                    "effectId": "createPlayEffects_PlayerA_PlayerA_49_loadPrototype_179901_CG_CH_WT002P_white_text_0",
                    "conditionKey": "同回合上限",
                    "tip": null,
                    "errors": []
                }
            ]
        },
        {
            "effectId": "createPlayEffects_PlayerA_PlayerA_49_loadPrototype_179901_CG_CH_WT002P_white_text_1",
            "logicID": 0,
            "logicSubID": 0,
            "tipOrErrors": [
                {
                    "effectId": "createPlayEffects_PlayerA_PlayerA_49_loadPrototype_179901_CG_CH_WT002P_white_text_1",
                    "conditionKey": "0[null]",
                    "tip": {
                        "title": [
                            "カード",
                            [
                                [
                                    "PlayerA_100",
                                    {
                                        "id": "AbsoluteBaSyou",
                                        "value": [
                                            "PlayerA",
                                            "Gゾーン"
                                        ]
                                    }
                                ],
                                [
                                    "PlayerA_101",
                                    {
                                        "id": "AbsoluteBaSyou",
                                        "value": [
                                            "PlayerA",
                                            "Gゾーン"
                                        ]
                                    }
                                ],
                                [
                                    "PlayerA_102",
                                    {
                                        "id": "AbsoluteBaSyou",
                                        "value": [
                                            "PlayerA",
                                            "Gゾーン"
                                        ]
                                    }
                                ],
                                [
                                    "PlayerA_44",
                                    {
                                        "id": "AbsoluteBaSyou",
                                        "value": [
                                            "PlayerA",
                                            "Gゾーン"
                                        ]
                                    }
                                ],
                                [
                                    "PlayerA_45",
                                    {
                                        "id": "AbsoluteBaSyou",
                                        "value": [
                                            "PlayerA",
                                            "Gゾーン"
                                        ]
                                    }
                                ],
                                [
                                    "PlayerA_14",
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
                                    "PlayerA_100",
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
                    "effectId": "createPlayEffects_PlayerA_PlayerA_49_loadPrototype_179901_CG_CH_WT002P_white_text_1",
                    "conditionKey": "這張卡以外的自軍機體1張",
                    "tip": {
                        "title": [
                            "カード",
                            [
                                [
                                    "PlayerA_103",
                                    {
                                        "id": "AbsoluteBaSyou",
                                        "value": [
                                            "PlayerA",
                                            "配備エリア"
                                        ]
                                    }
                                ],
                                [
                                    "PlayerA_30",
                                    {
                                        "id": "AbsoluteBaSyou",
                                        "value": [
                                            "PlayerA",
                                            "配備エリア"
                                        ]
                                    }
                                ],
                                [
                                    "PlayerA_7",
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
                                    "PlayerA_103",
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
                    "effectId": "createPlayEffects_PlayerA_PlayerA_49_loadPrototype_179901_CG_CH_WT002P_white_text_1",
                    "conditionKey": "同回合上限",
                    "tip": null,
                    "errors": []
                }
            ]
        },
        {
            "effectId": "createPlayEffects_PlayerA_PlayerA_30_loadPrototype_179024_03B_U_WT057U_white_text_0",
            "logicID": 0,
            "logicSubID": 0,
            "tipOrErrors": [
                {
                    "effectId": "createPlayEffects_PlayerA_PlayerA_30_loadPrototype_179024_03B_U_WT057U_white_text_0",
                    "conditionKey": "0[null]",
                    "tip": {
                        "title": [
                            "カード",
                            [
                                [
                                    "PlayerA_100",
                                    {
                                        "id": "AbsoluteBaSyou",
                                        "value": [
                                            "PlayerA",
                                            "Gゾーン"
                                        ]
                                    }
                                ],
                                [
                                    "PlayerA_101",
                                    {
                                        "id": "AbsoluteBaSyou",
                                        "value": [
                                            "PlayerA",
                                            "Gゾーン"
                                        ]
                                    }
                                ],
                                [
                                    "PlayerA_102",
                                    {
                                        "id": "AbsoluteBaSyou",
                                        "value": [
                                            "PlayerA",
                                            "Gゾーン"
                                        ]
                                    }
                                ],
                                [
                                    "PlayerA_44",
                                    {
                                        "id": "AbsoluteBaSyou",
                                        "value": [
                                            "PlayerA",
                                            "Gゾーン"
                                        ]
                                    }
                                ],
                                [
                                    "PlayerA_45",
                                    {
                                        "id": "AbsoluteBaSyou",
                                        "value": [
                                            "PlayerA",
                                            "Gゾーン"
                                        ]
                                    }
                                ],
                                [
                                    "PlayerA_14",
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
                                    "PlayerA_100",
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
                    "effectId": "createPlayEffects_PlayerA_PlayerA_30_loadPrototype_179024_03B_U_WT057U_white_text_0",
                    "conditionKey": "1[null]",
                    "tip": {
                        "title": [
                            "カード",
                            [
                                [
                                    "PlayerA_101",
                                    {
                                        "id": "AbsoluteBaSyou",
                                        "value": [
                                            "PlayerA",
                                            "Gゾーン"
                                        ]
                                    }
                                ],
                                [
                                    "PlayerA_102",
                                    {
                                        "id": "AbsoluteBaSyou",
                                        "value": [
                                            "PlayerA",
                                            "Gゾーン"
                                        ]
                                    }
                                ],
                                [
                                    "PlayerA_44",
                                    {
                                        "id": "AbsoluteBaSyou",
                                        "value": [
                                            "PlayerA",
                                            "Gゾーン"
                                        ]
                                    }
                                ],
                                [
                                    "PlayerA_45",
                                    {
                                        "id": "AbsoluteBaSyou",
                                        "value": [
                                            "PlayerA",
                                            "Gゾーン"
                                        ]
                                    }
                                ],
                                [
                                    "PlayerA_14",
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
                                    "PlayerA_101",
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
                    "effectId": "createPlayEffects_PlayerA_PlayerA_30_loadPrototype_179024_03B_U_WT057U_white_text_0",
                    "conditionKey": "「特徴：アストレイ系」を持つ自軍ユニット１枚",
                    "tip": {
                        "title": [
                            "カード",
                            [
                                [
                                    "PlayerA_103",
                                    {
                                        "id": "AbsoluteBaSyou",
                                        "value": [
                                            "PlayerA",
                                            "配備エリア"
                                        ]
                                    }
                                ],
                                [
                                    "PlayerA_30",
                                    {
                                        "id": "AbsoluteBaSyou",
                                        "value": [
                                            "PlayerA",
                                            "配備エリア"
                                        ]
                                    }
                                ],
                                [
                                    "PlayerA_7",
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
                                    "PlayerA_103",
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
                    "effectId": "createPlayEffects_PlayerA_PlayerA_30_loadPrototype_179024_03B_U_WT057U_white_text_0",
                    "conditionKey": "同回合上限",
                    "tip": null,
                    "errors": []
                }
            ]
        },
        {
            "effectId": "createPlayEffects_PlayerA_PlayerA_30_loadPrototype_179024_03B_U_WT057U_white_text_1",
            "logicID": 0,
            "logicSubID": 0,
            "tipOrErrors": [
                {
                    "effectId": "createPlayEffects_PlayerA_PlayerA_30_loadPrototype_179024_03B_U_WT057U_white_text_1",
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
                    "effectId": "createPlayEffects_PlayerA_PlayerA_30_loadPrototype_179024_03B_U_WT057U_white_text_1",
                    "conditionKey": "同回合上限",
                    "tip": null,
                    "errors": []
                }
            ]
        },
        {
            "effectId": "createPlayEffects_PlayerA_PlayerA_30_loadPrototype_179024_03B_U_WT057U_white_text_2",
            "logicID": 0,
            "logicSubID": 0,
            "tipOrErrors": [
                {
                    "effectId": "createPlayEffects_PlayerA_PlayerA_30_loadPrototype_179024_03B_U_WT057U_white_text_2",
                    "conditionKey": "0[null]",
                    "tip": {
                        "title": [
                            "カード",
                            [
                                [
                                    "PlayerA_100",
                                    {
                                        "id": "AbsoluteBaSyou",
                                        "value": [
                                            "PlayerA",
                                            "Gゾーン"
                                        ]
                                    }
                                ],
                                [
                                    "PlayerA_101",
                                    {
                                        "id": "AbsoluteBaSyou",
                                        "value": [
                                            "PlayerA",
                                            "Gゾーン"
                                        ]
                                    }
                                ],
                                [
                                    "PlayerA_102",
                                    {
                                        "id": "AbsoluteBaSyou",
                                        "value": [
                                            "PlayerA",
                                            "Gゾーン"
                                        ]
                                    }
                                ],
                                [
                                    "PlayerA_44",
                                    {
                                        "id": "AbsoluteBaSyou",
                                        "value": [
                                            "PlayerA",
                                            "Gゾーン"
                                        ]
                                    }
                                ],
                                [
                                    "PlayerA_45",
                                    {
                                        "id": "AbsoluteBaSyou",
                                        "value": [
                                            "PlayerA",
                                            "Gゾーン"
                                        ]
                                    }
                                ],
                                [
                                    "PlayerA_14",
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
                                    "PlayerA_100",
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
                    "effectId": "createPlayEffects_PlayerA_PlayerA_30_loadPrototype_179024_03B_U_WT057U_white_text_2",
                    "conditionKey": "このカードの本来のテキスト１つ",
                    "tip": {
                        "title": [
                            "テキスト",
                            [
                                {
                                    "cardId": "PlayerA_30",
                                    "textId": "loadPrototype_179024_03B_U_WT057U_white_text_0"
                                },
                                {
                                    "cardId": "PlayerA_30",
                                    "textId": "loadPrototype_179024_03B_U_WT057U_white_text_1"
                                },
                                {
                                    "cardId": "PlayerA_30",
                                    "textId": "loadPrototype_179024_03B_U_WT057U_white_text_3"
                                }
                            ],
                            [
                                {
                                    "cardId": "PlayerA_30",
                                    "textId": "loadPrototype_179024_03B_U_WT057U_white_text_0"
                                }
                            ]
                        ],
                        "count": 1
                    },
                    "errors": []
                },
                {
                    "effectId": "createPlayEffects_PlayerA_PlayerA_30_loadPrototype_179024_03B_U_WT057U_white_text_2",
                    "conditionKey": "［ ］の特徴を持つ自軍ユニット１枚は",
                    "tip": {
                        "title": [
                            "カード",
                            [
                                [
                                    "PlayerA_103",
                                    {
                                        "id": "AbsoluteBaSyou",
                                        "value": [
                                            "PlayerA",
                                            "配備エリア"
                                        ]
                                    }
                                ],
                                [
                                    "PlayerA_7",
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
                                    "PlayerA_103",
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
                    "effectId": "createPlayEffects_PlayerA_PlayerA_30_loadPrototype_179024_03B_U_WT057U_white_text_2",
                    "conditionKey": "同回合上限",
                    "tip": null,
                    "errors": []
                }
            ]
        },
        {
            "effectId": "createPlayEffects_PlayerA_PlayerA_30_loadPrototype_179024_03B_U_WT057U_white_text_3",
            "logicID": 0,
            "logicSubID": 0,
            "tipOrErrors": [
                {
                    "effectId": "createPlayEffects_PlayerA_PlayerA_30_loadPrototype_179024_03B_U_WT057U_white_text_3",
                    "conditionKey": "0[null]",
                    "tip": {
                        "title": [
                            "カード",
                            [
                                [
                                    "PlayerA_100",
                                    {
                                        "id": "AbsoluteBaSyou",
                                        "value": [
                                            "PlayerA",
                                            "Gゾーン"
                                        ]
                                    }
                                ],
                                [
                                    "PlayerA_101",
                                    {
                                        "id": "AbsoluteBaSyou",
                                        "value": [
                                            "PlayerA",
                                            "Gゾーン"
                                        ]
                                    }
                                ],
                                [
                                    "PlayerA_102",
                                    {
                                        "id": "AbsoluteBaSyou",
                                        "value": [
                                            "PlayerA",
                                            "Gゾーン"
                                        ]
                                    }
                                ],
                                [
                                    "PlayerA_44",
                                    {
                                        "id": "AbsoluteBaSyou",
                                        "value": [
                                            "PlayerA",
                                            "Gゾーン"
                                        ]
                                    }
                                ],
                                [
                                    "PlayerA_45",
                                    {
                                        "id": "AbsoluteBaSyou",
                                        "value": [
                                            "PlayerA",
                                            "Gゾーン"
                                        ]
                                    }
                                ],
                                [
                                    "PlayerA_14",
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
                                    "PlayerA_100",
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
                    "effectId": "createPlayEffects_PlayerA_PlayerA_30_loadPrototype_179024_03B_U_WT057U_white_text_3",
                    "conditionKey": "這個效果只有這張卡從手中打出的回合可以使用",
                    "tip": null,
                    "errors": [
                        "這個效果只有這張卡從手中打出的回合可以使用:看自己本國全部的卡,可以從中找出特徵A的1張卡移到HANGER,那個時候本國洗牌.這個效果只有這張卡從手中打出的回合可以使用"
                    ]
                },
                {
                    "effectId": "createPlayEffects_PlayerA_PlayerA_30_loadPrototype_179024_03B_U_WT057U_white_text_3",
                    "conditionKey": "同回合上限",
                    "tip": null,
                    "errors": []
                }
            ]
        },
        {
            "effectId": "createPlayEffects_PlayerA_PlayerA_7_loadPrototype_179015_04B_U_WT067C_white_text_0",
            "logicID": 0,
            "logicSubID": 0,
            "tipOrErrors": [
                {
                    "effectId": "createPlayEffects_PlayerA_PlayerA_7_loadPrototype_179015_04B_U_WT067C_white_text_0",
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
                    "effectId": "createPlayEffects_PlayerA_PlayerA_7_loadPrototype_179015_04B_U_WT067C_white_text_0",
                    "conditionKey": "同回合上限",
                    "tip": null,
                    "errors": []
                }
            ]
        },
        {
            "effectId": "createPlayEffects_PlayerA_PlayerA_7_loadPrototype_179015_04B_U_WT067C_white_text_1",
            "logicID": 0,
            "logicSubID": 0,
            "tipOrErrors": [
                {
                    "effectId": "createPlayEffects_PlayerA_PlayerA_7_loadPrototype_179015_04B_U_WT067C_white_text_1",
                    "conditionKey": "0[null]",
                    "tip": {
                        "title": [
                            "カード",
                            [
                                [
                                    "PlayerA_100",
                                    {
                                        "id": "AbsoluteBaSyou",
                                        "value": [
                                            "PlayerA",
                                            "Gゾーン"
                                        ]
                                    }
                                ],
                                [
                                    "PlayerA_101",
                                    {
                                        "id": "AbsoluteBaSyou",
                                        "value": [
                                            "PlayerA",
                                            "Gゾーン"
                                        ]
                                    }
                                ],
                                [
                                    "PlayerA_102",
                                    {
                                        "id": "AbsoluteBaSyou",
                                        "value": [
                                            "PlayerA",
                                            "Gゾーン"
                                        ]
                                    }
                                ],
                                [
                                    "PlayerA_44",
                                    {
                                        "id": "AbsoluteBaSyou",
                                        "value": [
                                            "PlayerA",
                                            "Gゾーン"
                                        ]
                                    }
                                ],
                                [
                                    "PlayerA_45",
                                    {
                                        "id": "AbsoluteBaSyou",
                                        "value": [
                                            "PlayerA",
                                            "Gゾーン"
                                        ]
                                    }
                                ],
                                [
                                    "PlayerA_14",
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
                                    "PlayerA_100",
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
                    "effectId": "createPlayEffects_PlayerA_PlayerA_7_loadPrototype_179015_04B_U_WT067C_white_text_1",
                    "conditionKey": "1[null]",
                    "tip": {
                        "title": [
                            "カード",
                            [
                                [
                                    "PlayerA_101",
                                    {
                                        "id": "AbsoluteBaSyou",
                                        "value": [
                                            "PlayerA",
                                            "Gゾーン"
                                        ]
                                    }
                                ],
                                [
                                    "PlayerA_102",
                                    {
                                        "id": "AbsoluteBaSyou",
                                        "value": [
                                            "PlayerA",
                                            "Gゾーン"
                                        ]
                                    }
                                ],
                                [
                                    "PlayerA_44",
                                    {
                                        "id": "AbsoluteBaSyou",
                                        "value": [
                                            "PlayerA",
                                            "Gゾーン"
                                        ]
                                    }
                                ],
                                [
                                    "PlayerA_45",
                                    {
                                        "id": "AbsoluteBaSyou",
                                        "value": [
                                            "PlayerA",
                                            "Gゾーン"
                                        ]
                                    }
                                ],
                                [
                                    "PlayerA_14",
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
                                    "PlayerA_101",
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
                    "effectId": "createPlayEffects_PlayerA_PlayerA_7_loadPrototype_179015_04B_U_WT067C_white_text_1",
                    "conditionKey": "このカードの本来のテキスト１つ",
                    "tip": {
                        "title": [
                            "テキスト",
                            [
                                {
                                    "cardId": "PlayerA_7",
                                    "textId": "loadPrototype_179015_04B_U_WT067C_white_text_0"
                                },
                                {
                                    "cardId": "PlayerA_7",
                                    "textId": "loadPrototype_179015_04B_U_WT067C_white_text_2"
                                },
                                {
                                    "cardId": "PlayerA_7",
                                    "textId": "loadPrototype_179015_04B_U_WT067C_white_text_3"
                                }
                            ],
                            [
                                {
                                    "cardId": "PlayerA_7",
                                    "textId": "loadPrototype_179015_04B_U_WT067C_white_text_0"
                                }
                            ]
                        ],
                        "count": 1
                    },
                    "errors": []
                },
                {
                    "effectId": "createPlayEffects_PlayerA_PlayerA_7_loadPrototype_179015_04B_U_WT067C_white_text_1",
                    "conditionKey": "［ ］の特徴を持つ自軍ユニット１枚は",
                    "tip": {
                        "title": [
                            "カード",
                            [
                                [
                                    "PlayerA_103",
                                    {
                                        "id": "AbsoluteBaSyou",
                                        "value": [
                                            "PlayerA",
                                            "配備エリア"
                                        ]
                                    }
                                ],
                                [
                                    "PlayerA_30",
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
                                    "PlayerA_103",
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
                    "effectId": "createPlayEffects_PlayerA_PlayerA_7_loadPrototype_179015_04B_U_WT067C_white_text_1",
                    "conditionKey": "同回合上限",
                    "tip": null,
                    "errors": []
                }
            ]
        },
        {
            "effectId": "createPlayEffects_PlayerA_PlayerA_7_loadPrototype_179015_04B_U_WT067C_white_text_2",
            "logicID": 0,
            "logicSubID": 0,
            "tipOrErrors": [
                {
                    "effectId": "createPlayEffects_PlayerA_PlayerA_7_loadPrototype_179015_04B_U_WT067C_white_text_2",
                    "conditionKey": "0[null]",
                    "tip": {
                        "title": [
                            "カード",
                            [
                                [
                                    "PlayerA_100",
                                    {
                                        "id": "AbsoluteBaSyou",
                                        "value": [
                                            "PlayerA",
                                            "Gゾーン"
                                        ]
                                    }
                                ],
                                [
                                    "PlayerA_101",
                                    {
                                        "id": "AbsoluteBaSyou",
                                        "value": [
                                            "PlayerA",
                                            "Gゾーン"
                                        ]
                                    }
                                ],
                                [
                                    "PlayerA_102",
                                    {
                                        "id": "AbsoluteBaSyou",
                                        "value": [
                                            "PlayerA",
                                            "Gゾーン"
                                        ]
                                    }
                                ],
                                [
                                    "PlayerA_44",
                                    {
                                        "id": "AbsoluteBaSyou",
                                        "value": [
                                            "PlayerA",
                                            "Gゾーン"
                                        ]
                                    }
                                ],
                                [
                                    "PlayerA_45",
                                    {
                                        "id": "AbsoluteBaSyou",
                                        "value": [
                                            "PlayerA",
                                            "Gゾーン"
                                        ]
                                    }
                                ],
                                [
                                    "PlayerA_14",
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
                                    "PlayerA_100",
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
                    "effectId": "createPlayEffects_PlayerA_PlayerA_7_loadPrototype_179015_04B_U_WT067C_white_text_2",
                    "conditionKey": "1[null]",
                    "tip": {
                        "title": [
                            "カード",
                            [
                                [
                                    "PlayerA_101",
                                    {
                                        "id": "AbsoluteBaSyou",
                                        "value": [
                                            "PlayerA",
                                            "Gゾーン"
                                        ]
                                    }
                                ],
                                [
                                    "PlayerA_102",
                                    {
                                        "id": "AbsoluteBaSyou",
                                        "value": [
                                            "PlayerA",
                                            "Gゾーン"
                                        ]
                                    }
                                ],
                                [
                                    "PlayerA_44",
                                    {
                                        "id": "AbsoluteBaSyou",
                                        "value": [
                                            "PlayerA",
                                            "Gゾーン"
                                        ]
                                    }
                                ],
                                [
                                    "PlayerA_45",
                                    {
                                        "id": "AbsoluteBaSyou",
                                        "value": [
                                            "PlayerA",
                                            "Gゾーン"
                                        ]
                                    }
                                ],
                                [
                                    "PlayerA_14",
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
                                    "PlayerA_101",
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
                    "effectId": "createPlayEffects_PlayerA_PlayerA_7_loadPrototype_179015_04B_U_WT067C_white_text_2",
                    "conditionKey": "這個效果只有這張卡從手中打出的回合可以使用",
                    "tip": null,
                    "errors": [
                        "這個效果只有這張卡從手中打出的回合可以使用:看自己本國全部的卡,可以從中找出特徵A的1張卡移到HANGER,那個時候本國洗牌.這個效果只有這張卡從手中打出的回合可以使用"
                    ]
                },
                {
                    "effectId": "createPlayEffects_PlayerA_PlayerA_7_loadPrototype_179015_04B_U_WT067C_white_text_2",
                    "conditionKey": "同回合上限",
                    "tip": null,
                    "errors": []
                }
            ]
        },
        {
            "effectId": "createPlayCardEffects_PlayerB_78",
            "logicID": 0,
            "logicSubID": 0,
            "tipOrErrors": [
                {
                    "effectId": "createPlayCardEffects_PlayerB_78",
                    "conditionKey": "合計国力〔x〕",
                    "tip": null,
                    "errors": [
                        "合計国力〔x〕:1 < 5. Play"
                    ]
                },
                {
                    "effectId": "createPlayCardEffects_PlayerB_78",
                    "conditionKey": "0[黒]",
                    "tip": {
                        "title": [
                            "カード",
                            [
                                [
                                    "PlayerB_80",
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
                                    "PlayerB_80",
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
                    "errors": []
                },
                {
                    "effectId": "createPlayCardEffects_PlayerB_78",
                    "conditionKey": "1[黒]",
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
                        "cardId: PlayerB_78 target not set yet: 1[黒]"
                    ]
                }
            ]
        },
        {
            "effectId": "createPlayEffects_PlayerB_PlayerB_77_loadPrototype_179024_B2B_U_BK128S_black_02_text_1",
            "logicID": 0,
            "logicSubID": 0,
            "tipOrErrors": [
                {
                    "effectId": "createPlayEffects_PlayerB_PlayerB_77_loadPrototype_179024_B2B_U_BK128S_black_02_text_1",
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
                    "effectId": "createPlayEffects_PlayerB_PlayerB_77_loadPrototype_179024_B2B_U_BK128S_black_02_text_1",
                    "conditionKey": "同回合上限",
                    "tip": null,
                    "errors": []
                }
            ]
        },
        {
            "effectId": "createPlayEffects_PlayerB_PlayerB_77_loadPrototype_179024_B2B_U_BK128S_black_02_text_2",
            "logicID": 0,
            "logicSubID": 0,
            "tipOrErrors": [
                {
                    "effectId": "createPlayEffects_PlayerB_PlayerB_77_loadPrototype_179024_B2B_U_BK128S_black_02_text_2",
                    "conditionKey": "0[黒]",
                    "tip": {
                        "title": [
                            "カード",
                            [
                                [
                                    "PlayerB_80",
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
                                    "PlayerB_80",
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
                    "errors": []
                },
                {
                    "effectId": "createPlayEffects_PlayerB_PlayerB_77_loadPrototype_179024_B2B_U_BK128S_black_02_text_2",
                    "conditionKey": "このカードの本来のテキスト１つ",
                    "tip": {
                        "title": [
                            "テキスト",
                            [
                                {
                                    "cardId": "PlayerB_77",
                                    "textId": "loadPrototype_179024_B2B_U_BK128S_black_02_text_0"
                                },
                                {
                                    "cardId": "PlayerB_77",
                                    "textId": "loadPrototype_179024_B2B_U_BK128S_black_02_text_1"
                                },
                                {
                                    "cardId": "PlayerB_77",
                                    "textId": "loadPrototype_179024_B2B_U_BK128S_black_02_text_3"
                                },
                                {
                                    "cardId": "PlayerB_77",
                                    "textId": "loadPrototype_179024_B2B_U_BK128S_black_02_text_4"
                                },
                                {
                                    "cardId": "PlayerB_77",
                                    "textId": "loadPrototype_179024_B2B_U_BK128S_black_02_text_5"
                                }
                            ],
                            [
                                {
                                    "cardId": "PlayerB_77",
                                    "textId": "loadPrototype_179024_B2B_U_BK128S_black_02_text_0"
                                }
                            ]
                        ],
                        "count": 1
                    },
                    "errors": []
                },
                {
                    "effectId": "createPlayEffects_PlayerB_PlayerB_77_loadPrototype_179024_B2B_U_BK128S_black_02_text_2",
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
                        "cardId: PlayerB_77 target not set yet: ［ ］の特徴を持つ自軍ユニット１枚は"
                    ]
                },
                {
                    "effectId": "createPlayEffects_PlayerB_PlayerB_77_loadPrototype_179024_B2B_U_BK128S_black_02_text_2",
                    "conditionKey": "同回合上限",
                    "tip": null,
                    "errors": []
                }
            ]
        },
        {
            "effectId": "createPlayEffects_PlayerB_PlayerB_77_loadPrototype_179024_B2B_U_BK128S_black_02_text_3",
            "logicID": 0,
            "logicSubID": 0,
            "tipOrErrors": [
                {
                    "effectId": "createPlayEffects_PlayerB_PlayerB_77_loadPrototype_179024_B2B_U_BK128S_black_02_text_3",
                    "conditionKey": "0[黒]",
                    "tip": {
                        "title": [
                            "カード",
                            [
                                [
                                    "PlayerB_80",
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
                                    "PlayerB_80",
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
                    "errors": []
                },
                {
                    "effectId": "createPlayEffects_PlayerB_PlayerB_77_loadPrototype_179024_B2B_U_BK128S_black_02_text_3",
                    "conditionKey": "這個效果只有這張卡從手中打出的回合可以使用",
                    "tip": null,
                    "errors": [
                        "這個效果只有這張卡從手中打出的回合可以使用:看自己本國全部的卡,可以從中找出特徵A的1張卡移到HANGER,那個時候本國洗牌.這個效果只有這張卡從手中打出的回合可以使用"
                    ]
                },
                {
                    "effectId": "createPlayEffects_PlayerB_PlayerB_77_loadPrototype_179024_B2B_U_BK128S_black_02_text_3",
                    "conditionKey": "同回合上限",
                    "tip": null,
                    "errors": []
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
    "messages": [],
    "messagesCurrentEffect": null,
    "turn": 6,
    "setGroup": {
        "itemGroupParent": {
            "PlayerA_24": "PlayerA_30"
        },
        "itemGroupChildren": {
            "PlayerA_30": [
                "PlayerA_24"
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
            "PlayerA": true,
            "PlayerB": true
        },
        "hasPlayerPassPayCost": {},
        "shouldTriggerStackEffectFinishedEvent": false,
        "activeEffectID": null,
        "activeLogicID": null,
        "activeLogicSubID": null
    }
}