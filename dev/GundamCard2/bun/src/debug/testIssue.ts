import { EffectFn } from "../game/define/Effect"
import { ItemStateFn } from "../game/define/ItemState"
import { PlayerA, PlayerB, PlayerIDFn } from "../game/define/PlayerID"
import { setTipSelectionForUser, doEffect } from "../game/gameState/doEffect"
import { createPlayEffects } from "../game/gameState/createPlayEffects"
import { mapItemState } from "../game/gameState/ItemStateComponent"
import { GameStateWithFlowMemory } from "../game/gameStateWithFlowMemory/GameStateWithFlowMemory"
import { loadPrototype } from "../script"
import { queryFlow } from "../game/gameStateWithFlowMemory/queryFlow"
import { applyFlow, createAIChoiseList } from "../game/gameStateWithFlowMemory/applyFlow"
import { getActivePlayerID } from "../game/gameState/ActivePlayerComponent"
import { AbsoluteBaSyouFn } from "../game/define/BaSyou"
import { TargetMissingError } from "../game/define/GameError"
import { getItemIdsByBasyou } from "../game/gameState/ItemTableComponent"
import { getPhase } from "../game/gameState/PhaseComponent"
import { Flow } from "../game/gameStateWithFlowMemory/Flow"
import { TableFns } from "../tool/table"

export async function testIssue() {
    const whiteSpeed = ["179001_01A_CH_WT007R_white", "179004_01A_CH_WT009R_white", "179004_01A_CH_WT010C_white", "179007_02A_U_WT027U_white", "179007_02A_U_WT027U_white", "179008_02A_U_WT034U_white", "179008_02A_U_WT034U_white", "179008_02A_U_WT034U_white", "179014_03B_CH_WT027R_white", "179015_04B_U_WT067C_white", "179015_04B_U_WT067C_white", "179015_04B_U_WT067C_white", "179016_04B_U_WT074C_white", "179016_04B_U_WT074C_white", "179016_04B_U_WT074C_white", "179016_04B_U_WT075C_white", "179016_04B_U_WT075C_white", "179016_04B_U_WT075C_white", "179019_01A_C_WT010C_white", "179019_01A_C_WT010C_white", "179019_02A_U_WT028R_white", "179019_02A_U_WT028R_white", "179022_06C_CH_WT057R_white", "179022_06C_CH_WT057R_white", "179022_06C_CH_WT057R_white", "179022_06C_U_WT113R_white", "179022_06C_U_WT113R_white", "179022_06C_U_WT113R_white", "179023_06C_CH_WT067C_white", "179024_03B_U_WT057U_white", "179024_03B_U_WT057U_white", "179025_07D_C_WT060U_white", "179025_07D_CH_WT075C_white", "179025_07D_CH_WT075C_white", "179025_07D_CH_WT075C_white", "179027_09D_C_WT067R_white", "179027_09D_C_WT067R_white", "179029_B3C_CH_WT102R_white", "179029_B3C_CH_WT103N_white", "179029_B3C_U_WT196R_white", "179030_11E_C_WT077S_white", "179030_11E_C_WT077S_white", "179030_11E_C_WT077S_white", "179030_11E_CH_WT108N_white", "179901_00_C_WT003P_white", "179901_00_C_WT003P_white", "179901_00_C_WT003P_white", "179901_CG_C_WT001P_white", "179901_CG_C_WT001P_white", "179901_CG_CH_WT002P_white"]
    const blackT3 = ["179015_04B_O_BK010C_black", "179015_04B_O_BK010C_black", "179015_04B_U_BK058R_black", "179015_04B_U_BK058R_black", "179015_04B_U_BK059C_black", "179015_04B_U_BK059C_black", "179015_04B_U_BK061C_black", "179015_04B_U_BK061C_black", "179016_04B_U_BK066C_black", "179016_04B_U_BK066C_black", "179019_02A_C_BK015S_black", "179019_02A_C_BK015S_black", "179020_05C_U_BK100U_black", "179020_05C_U_BK100U_black", "179023_06C_C_BK048R_black", "179023_06C_C_BK048R_black", "179023_06C_C_BK049U_black", "179023_06C_C_BK049U_black", "179024_04B_C_BK027U_black", "179024_04B_C_BK027U_black", "179024_04B_U_BK060C_black", "179024_04B_U_BK060C_black", "179024_04B_U_BK067C_black", "179024_04B_U_BK067C_black", "179024_B2B_C_BK054C_black", "179024_B2B_C_BK054C_black", "179024_B2B_U_BK128S_black_02", "179024_B2B_U_BK128S_black_02", "179024_B2B_U_BK129R_black", "179024_B2B_U_BK129R_black", "179027_09D_C_BK063R_black", "179027_09D_C_BK063R_black", "179027_09D_O_BK010N_black", "179027_09D_O_BK010N_black", "179027_09D_U_BK163S_black", "179027_09D_U_BK163S_black", "179027_09D_U_BK163S_black", "179029_06C_C_BK045U_black", "179029_06C_C_BK045U_black", "179029_B3C_C_BK071N_black", "179029_B3C_C_BK071N_black", "179029_B3C_U_BK184N_black", "179029_B3C_U_BK184N_black", "179029_B3C_U_BK184N_black", "179029_B3C_U_BK185N_black", "179029_B3C_U_BK185N_black", "179030_11E_U_BK194S_2_black", "179030_11E_U_BK194S_2_black", "179030_11E_U_BK194S_2_black", "179901_B2B_C_BK005P_black"]
    await Promise.all([...blackT3, ...whiteSpeed].map(loadPrototype))
    let ctx = TMP_CTX
    let flows = queryFlow(ctx, PlayerA)
    if(flows.length != 1){
        throw new Error()
    }
    let flow = flows[0]
    ctx = applyFlow(ctx, PlayerA, flow)
}

const TMP_CTX: GameStateWithFlowMemory = {
    "isGameState": true,
    "cards": {
        "PlayerA_0": {
            "id": "PlayerA_0",
            "protoID": "179001_01A_CH_WT007R_white",
            "ownerID": "PlayerA",
            "isFaceDown": true,
            "isRoll": false
        },
        "PlayerA_1": {
            "id": "PlayerA_1",
            "protoID": "179004_01A_CH_WT009R_white",
            "ownerID": "PlayerA",
            "isFaceDown": true,
            "isRoll": false
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
            "isFaceDown": true,
            "isRoll": false
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
            "protoID": "179008_02A_U_WT034U_white",
            "ownerID": "PlayerA",
            "isFaceDown": true,
            "isRoll": false
        },
        "PlayerA_8": {
            "id": "PlayerA_8",
            "protoID": "179014_03B_CH_WT027R_white",
            "ownerID": "PlayerA",
            "isFaceDown": false,
            "isRoll": false
        },
        "PlayerA_9": {
            "id": "PlayerA_9",
            "protoID": "179015_04B_U_WT067C_white",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_10": {
            "id": "PlayerA_10",
            "protoID": "179015_04B_U_WT067C_white",
            "ownerID": "PlayerA",
            "isFaceDown": true
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
            "isFaceDown": true
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
            "isFaceDown": true
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
            "isFaceDown": false,
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
            "isFaceDown": true
        },
        "PlayerA_21": {
            "id": "PlayerA_21",
            "protoID": "179019_02A_U_WT028R_white",
            "ownerID": "PlayerA",
            "isFaceDown": false,
            "isRoll": false
        },
        "PlayerA_22": {
            "id": "PlayerA_22",
            "protoID": "179022_06C_CH_WT057R_white",
            "ownerID": "PlayerA",
            "isFaceDown": false,
            "isRoll": true
        },
        "PlayerA_23": {
            "id": "PlayerA_23",
            "protoID": "179022_06C_CH_WT057R_white",
            "ownerID": "PlayerA",
            "isFaceDown": false,
            "isRoll": false
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
            "isFaceDown": true,
            "isRoll": false
        },
        "PlayerA_27": {
            "id": "PlayerA_27",
            "protoID": "179022_06C_U_WT113R_white",
            "ownerID": "PlayerA",
            "isFaceDown": false,
            "isRoll": true
        },
        "PlayerA_28": {
            "id": "PlayerA_28",
            "protoID": "179023_06C_CH_WT067C_white",
            "ownerID": "PlayerA",
            "isFaceDown": true,
            "isRoll": false
        },
        "PlayerA_29": {
            "id": "PlayerA_29",
            "protoID": "179024_03B_U_WT057U_white",
            "ownerID": "PlayerA",
            "isFaceDown": false,
            "isRoll": true
        },
        "PlayerA_30": {
            "id": "PlayerA_30",
            "protoID": "179024_03B_U_WT057U_white",
            "ownerID": "PlayerA",
            "isFaceDown": true
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
            "isFaceDown": false,
            "isRoll": false
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
            "isFaceDown": true,
            "isRoll": false
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
            "isFaceDown": true,
            "isRoll": false
        },
        "PlayerA_43": {
            "id": "PlayerA_43",
            "protoID": "179030_11E_CH_WT108N_white",
            "ownerID": "PlayerA",
            "isFaceDown": false,
            "isRoll": true
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
            "isFaceDown": true,
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
            "isFaceDown": true,
            "isRoll": false
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
            "isFaceDown": true,
            "isRoll": false
        },
        "PlayerB_50": {
            "id": "PlayerB_50",
            "protoID": "179015_04B_O_BK010C_black",
            "ownerID": "PlayerB",
            "isFaceDown": true,
            "isRoll": false
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
            "isFaceDown": true
        },
        "PlayerB_54": {
            "id": "PlayerB_54",
            "protoID": "179015_04B_U_BK059C_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
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
            "isFaceDown": true
        },
        "PlayerB_58": {
            "id": "PlayerB_58",
            "protoID": "179016_04B_U_BK066C_black",
            "ownerID": "PlayerB",
            "isFaceDown": true,
            "isRoll": false
        },
        "PlayerB_59": {
            "id": "PlayerB_59",
            "protoID": "179016_04B_U_BK066C_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "PlayerB_60": {
            "id": "PlayerB_60",
            "protoID": "179019_02A_C_BK015S_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "PlayerB_61": {
            "id": "PlayerB_61",
            "protoID": "179019_02A_C_BK015S_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "PlayerB_62": {
            "id": "PlayerB_62",
            "protoID": "179020_05C_U_BK100U_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "PlayerB_63": {
            "id": "PlayerB_63",
            "protoID": "179020_05C_U_BK100U_black",
            "ownerID": "PlayerB",
            "isFaceDown": true,
            "isRoll": false
        },
        "PlayerB_64": {
            "id": "PlayerB_64",
            "protoID": "179023_06C_C_BK048R_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "PlayerB_65": {
            "id": "PlayerB_65",
            "protoID": "179023_06C_C_BK048R_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "PlayerB_66": {
            "id": "PlayerB_66",
            "protoID": "179023_06C_C_BK049U_black",
            "ownerID": "PlayerB",
            "isFaceDown": true,
            "isRoll": false
        },
        "PlayerB_67": {
            "id": "PlayerB_67",
            "protoID": "179023_06C_C_BK049U_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
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
            "isFaceDown": true,
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
            "isFaceDown": true
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
            "isFaceDown": true
        },
        "PlayerB_74": {
            "id": "PlayerB_74",
            "protoID": "179024_B2B_C_BK054C_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "PlayerB_75": {
            "id": "PlayerB_75",
            "protoID": "179024_B2B_C_BK054C_black",
            "ownerID": "PlayerB",
            "isFaceDown": true,
            "isRoll": false
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
            "isFaceDown": true
        },
        "PlayerB_78": {
            "id": "PlayerB_78",
            "protoID": "179024_B2B_U_BK129R_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
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
            "isFaceDown": true,
            "isRoll": false
        },
        "PlayerB_81": {
            "id": "PlayerB_81",
            "protoID": "179027_09D_C_BK063R_black",
            "ownerID": "PlayerB",
            "isFaceDown": true,
            "isRoll": false
        },
        "PlayerB_82": {
            "id": "PlayerB_82",
            "protoID": "179027_09D_O_BK010N_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "PlayerB_83": {
            "id": "PlayerB_83",
            "protoID": "179027_09D_O_BK010N_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
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
            "isFaceDown": true,
            "isRoll": false
        },
        "PlayerB_89": {
            "id": "PlayerB_89",
            "protoID": "179029_B3C_C_BK071N_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "PlayerB_90": {
            "id": "PlayerB_90",
            "protoID": "179029_B3C_C_BK071N_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "PlayerB_91": {
            "id": "PlayerB_91",
            "protoID": "179029_B3C_U_BK184N_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "PlayerB_92": {
            "id": "PlayerB_92",
            "protoID": "179029_B3C_U_BK184N_black",
            "ownerID": "PlayerB",
            "isFaceDown": false,
            "isRoll": false
        },
        "PlayerB_93": {
            "id": "PlayerB_93",
            "protoID": "179029_B3C_U_BK184N_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "PlayerB_94": {
            "id": "PlayerB_94",
            "protoID": "179029_B3C_U_BK185N_black",
            "ownerID": "PlayerB",
            "isFaceDown": true,
            "isRoll": false
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
            "isRoll": true
        },
        "PlayerA_101": {
            "id": "PlayerA_101",
            "protoID": "179008_02A_U_WT034U_white",
            "ownerID": "PlayerA",
            "isRoll": true
        },
        "PlayerA_102": {
            "id": "PlayerA_102",
            "protoID": "179014_03B_CH_WT027R_white",
            "ownerID": "PlayerA",
            "isRoll": true
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
            "isRoll": false
        },
        "PlayerB_105": {
            "id": "PlayerB_105",
            "protoID": "179015_04B_U_BK061C_black",
            "ownerID": "PlayerB",
            "isRoll": false
        },
        "PlayerB_106": {
            "id": "PlayerB_106",
            "protoID": "179016_04B_U_BK066C_black",
            "ownerID": "PlayerB",
            "isRoll": false
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
        "createPlayEffects_PlayerA_PlayerA_27_loadPrototype_179022_06C_U_WT113R_white_text_1": {
            "id": "createPlayEffects_PlayerA_PlayerA_27_loadPrototype_179022_06C_U_WT113R_white_text_1",
            "reason": [
                "PlayText",
                "PlayerA",
                "PlayerA_27",
                "loadPrototype_179022_06C_U_WT113R_white_text_1"
            ],
            "description": "打開自軍手裡或指定HANGER中特徵A並合計國力x以下的1張卡, 和這張卡重置狀態置換, 這張卡置換後廢棄. x為自軍G的張數",
            "text": {
                "id": "loadPrototype_179022_06C_U_WT113R_white_text_1",
                "title": [
                    "使用型",
                    [
                        "戦闘フェイズ"
                    ]
                ],
                "description": "打開自軍手裡或指定HANGER中特徵A並合計國力x以下的1張卡, 和這張卡重置狀態置換, 這張卡置換後廢棄. x為自軍G的張數",
                "conditions": {
                    "打開自軍手裡或指定HANGER中特徵A並合計國力x以下的1張卡": {
                        "title": "function _(ctx3, effect, bridge) {\n                const { A: A2 } = {\"A\":\"ブルーフレーム系\"};\n                const { GameStateFn, DefineFn } = bridge;\n                const cardId = DefineFn.EffectFn.getCardID(effect);\n                const cardController = GameStateFn.getItemController(ctx3, cardId);\n                const gCount = GameStateFn.getItemIdsByBasyou(ctx3, DefineFn.AbsoluteBaSyouFn.of(cardController, \"G\\u30BE\\u30FC\\u30F3\")).length;\n                return GameStateFn.createConditionTitleFn({\n                  title: [\"\\u6253\\u958B\\u81EA\\u8ECD\\u624B\\u88E1\\u6216\\u6307\\u5B9AHANGER\\u4E2D\\u7279\\u5FB5_A\\u4E26\\u5408\\u8A08\\u570B\\u529B_x\\u4EE5\\u4E0B\\u7684_1\\u5F35\\u5361\", A2, gCount, 1]\n                }, {})(ctx3, effect, bridge);\n              }"
                    },
                    "同切上限": {
                        "actions": [
                            {
                                "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn2.EffectFn.getCardID(effect);\n                const ps = GameStateFn2.getItemState(ctx3, cardId2);\n                if (ps.textIdsUseThisCut?.[effect.text.id]) {\n                  throw new DefineFn2.TipError(`\\u540C\\u5207\\u4E0A\\u9650: ${effect.text.description}`);\n                }\n                ctx3 = GameStateFn2.mapItemState(ctx3, cardId2, (ps2) => {\n                  return {\n                    ...ps2,\n                    textIdsUseThisCut: {\n                      ...ps2.textIdsUseThisCut,\n                      [effect.text.id]: true\n                    }\n                  };\n                });\n                return ctx3;\n              }"
                            }
                        ]
                    },
                    "同回合上限": {
                        "actions": [
                            {
                                "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn2.EffectFn.getCardID(effect);\n                const ps = GameStateFn2.getItemState(ctx3, cardId2);\n                if (ps.textIdsUseThisTurn?.[effect.text.id]) {\n                  throw new DefineFn2.TipError(`\\u540C\\u56DE\\u5408\\u4E0A\\u9650: ${effect.text.description}`);\n                }\n                ctx3 = GameStateFn2.mapItemState(ctx3, cardId2, (ps2) => {\n                  return {\n                    ...ps2,\n                    textIdsUseThisTurn: {\n                      ...ps2.textIdsUseThisTurn,\n                      [effect.text.id]: true\n                    }\n                  };\n                });\n                return ctx3;\n              }"
                            }
                        ]
                    }
                },
                "logicTreeActions": [
                    {
                        "actions": [
                            {
                                "title": "function _(ctx3, effect, { GameStateFn, DefineFn }) {\n                    const newE = DefineFn.EffectFn.fromEffectBasic(effect, {\n                      logicTreeAction: {\n                        actions: [\n                          {\n                            title: function _(ctx4, effect2, { GameStateFn: GameStateFn2, DefineFn: DefineFn2 }) {\n                              const cardId = DefineFn2.EffectFn.getCardID(effect2);\n                              const basyou = GameStateFn2.getItemBaSyou(ctx4, cardId);\n                              const pairs = GameStateFn2.getCardTipStrBaSyouPairs(ctx4, \"\\u6253\\u958B\\u81EA\\u8ECD\\u624B\\u88E1\\u6216\\u6307\\u5B9AHANGER\\u4E2D\\u7279\\u5FB5A\\u4E26\\u5408\\u8A08\\u570B\\u529Bx\\u4EE5\\u4E0B\\u76841\\u5F35\\u5361\", cardId);\n                              if (pairs.length == 0) {\n                                throw new Error(`pairs must not 0: ${effect2.text.description}`);\n                              }\n                              const targetPair = pairs[0];\n                              GameStateFn2.assertTargetMissingError(ctx4, targetPair);\n                              ctx4 = GameStateFn2.doItemSwap(ctx4, [cardId, basyou], targetPair);\n                              ctx4 = GameStateFn2.doItemSetRollState(ctx4, false, [cardId, basyou], { isSkipTargetMissing: true });\n                              ctx4 = GameStateFn2.doItemMove(ctx4, DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(basyou, \"\\u30B8\\u30E3\\u30F3\\u30AF\\u30E4\\u30FC\\u30C9\"), targetPair);\n                              ctx4 = GameStateFn2.doTriggerEvent(ctx4, { title: [\"\\u300C\\u6539\\u88C5\\u300D\\u306E\\u52B9\\u679C\\u3067\\u5EC3\\u68C4\\u3055\\u308C\\u308B\\u5834\\u5408\"], cardIds: [targetPair[0]] });\n                              ctx4 = GameStateFn2.doTriggerEvent(ctx4, { title: [\"\\u300C\\u6539\\u88C5\\u300D\\u306E\\u52B9\\u679C\\u3067\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId] });\n                              return ctx4;\n                            }.toString()\n                          }\n                        ]\n                      }\n                    });\n                    ctx3 = GameStateFn.addStackEffect(ctx3, newE);\n                    return ctx3;\n                  }"
                            }
                        ]
                    }
                ]
            }
        },
        "createPlayEffects_PlayerA_PlayerA_29_loadPrototype_179024_03B_U_WT057U_white_text_0": {
            "id": "createPlayEffects_PlayerA_PlayerA_29_loadPrototype_179024_03B_U_WT057U_white_text_0",
            "reason": [
                "PlayText",
                "PlayerA",
                "PlayerA_29",
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
                    "同切上限": {
                        "actions": [
                            {
                                "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn2.EffectFn.getCardID(effect);\n                const ps = GameStateFn2.getItemState(ctx3, cardId2);\n                if (ps.textIdsUseThisCut?.[effect.text.id]) {\n                  throw new DefineFn2.TipError(`\\u540C\\u5207\\u4E0A\\u9650: ${effect.text.description}`);\n                }\n                ctx3 = GameStateFn2.mapItemState(ctx3, cardId2, (ps2) => {\n                  return {\n                    ...ps2,\n                    textIdsUseThisCut: {\n                      ...ps2.textIdsUseThisCut,\n                      [effect.text.id]: true\n                    }\n                  };\n                });\n                return ctx3;\n              }"
                            }
                        ]
                    },
                    "同回合上限": {
                        "actions": [
                            {
                                "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn2.EffectFn.getCardID(effect);\n                const ps = GameStateFn2.getItemState(ctx3, cardId2);\n                if (ps.textIdsUseThisTurn?.[effect.text.id]) {\n                  throw new DefineFn2.TipError(`\\u540C\\u56DE\\u5408\\u4E0A\\u9650: ${effect.text.description}`);\n                }\n                ctx3 = GameStateFn2.mapItemState(ctx3, cardId2, (ps2) => {\n                  return {\n                    ...ps2,\n                    textIdsUseThisTurn: {\n                      ...ps2.textIdsUseThisTurn,\n                      [effect.text.id]: true\n                    }\n                  };\n                });\n                return ctx3;\n              }"
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
        "createPlayEffects_PlayerA_PlayerA_29_loadPrototype_179024_03B_U_WT057U_white_text_1": {
            "id": "createPlayEffects_PlayerA_PlayerA_29_loadPrototype_179024_03B_U_WT057U_white_text_1",
            "reason": [
                "PlayText",
                "PlayerA",
                "PlayerA_29",
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
                        "title": "function _(ctx3, effect, bridge) {\n                const { A: A2 } = {\"A\":\"ブルーフレーム系］　〔１〕：クロスウェポン［アストレイ系\"};\n                const { GameStateFn, DefineFn } = bridge;\n                const cardId = DefineFn.EffectFn.getCardID(effect);\n                const cardController = GameStateFn.getItemController(ctx3, cardId);\n                const gCount = GameStateFn.getItemIdsByBasyou(ctx3, DefineFn.AbsoluteBaSyouFn.of(cardController, \"G\\u30BE\\u30FC\\u30F3\")).length;\n                return GameStateFn.createConditionTitleFn({\n                  title: [\"\\u6253\\u958B\\u81EA\\u8ECD\\u624B\\u88E1\\u6216\\u6307\\u5B9AHANGER\\u4E2D\\u7279\\u5FB5_A\\u4E26\\u5408\\u8A08\\u570B\\u529B_x\\u4EE5\\u4E0B\\u7684_1\\u5F35\\u5361\", A2, gCount, 1]\n                }, {})(ctx3, effect, bridge);\n              }"
                    },
                    "同切上限": {
                        "actions": [
                            {
                                "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn2.EffectFn.getCardID(effect);\n                const ps = GameStateFn2.getItemState(ctx3, cardId2);\n                if (ps.textIdsUseThisCut?.[effect.text.id]) {\n                  throw new DefineFn2.TipError(`\\u540C\\u5207\\u4E0A\\u9650: ${effect.text.description}`);\n                }\n                ctx3 = GameStateFn2.mapItemState(ctx3, cardId2, (ps2) => {\n                  return {\n                    ...ps2,\n                    textIdsUseThisCut: {\n                      ...ps2.textIdsUseThisCut,\n                      [effect.text.id]: true\n                    }\n                  };\n                });\n                return ctx3;\n              }"
                            }
                        ]
                    },
                    "同回合上限": {
                        "actions": [
                            {
                                "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn2.EffectFn.getCardID(effect);\n                const ps = GameStateFn2.getItemState(ctx3, cardId2);\n                if (ps.textIdsUseThisTurn?.[effect.text.id]) {\n                  throw new DefineFn2.TipError(`\\u540C\\u56DE\\u5408\\u4E0A\\u9650: ${effect.text.description}`);\n                }\n                ctx3 = GameStateFn2.mapItemState(ctx3, cardId2, (ps2) => {\n                  return {\n                    ...ps2,\n                    textIdsUseThisTurn: {\n                      ...ps2.textIdsUseThisTurn,\n                      [effect.text.id]: true\n                    }\n                  };\n                });\n                return ctx3;\n              }"
                            }
                        ]
                    }
                },
                "logicTreeActions": [
                    {
                        "actions": [
                            {
                                "title": "function _(ctx3, effect, { GameStateFn, DefineFn }) {\n                    const newE = DefineFn.EffectFn.fromEffectBasic(effect, {\n                      logicTreeAction: {\n                        actions: [\n                          {\n                            title: function _(ctx4, effect2, { GameStateFn: GameStateFn2, DefineFn: DefineFn2 }) {\n                              const cardId = DefineFn2.EffectFn.getCardID(effect2);\n                              const basyou = GameStateFn2.getItemBaSyou(ctx4, cardId);\n                              const pairs = GameStateFn2.getCardTipStrBaSyouPairs(ctx4, \"\\u6253\\u958B\\u81EA\\u8ECD\\u624B\\u88E1\\u6216\\u6307\\u5B9AHANGER\\u4E2D\\u7279\\u5FB5A\\u4E26\\u5408\\u8A08\\u570B\\u529Bx\\u4EE5\\u4E0B\\u76841\\u5F35\\u5361\", cardId);\n                              if (pairs.length == 0) {\n                                throw new Error(`pairs must not 0: ${effect2.text.description}`);\n                              }\n                              const targetPair = pairs[0];\n                              GameStateFn2.assertTargetMissingError(ctx4, targetPair);\n                              ctx4 = GameStateFn2.doItemSwap(ctx4, [cardId, basyou], targetPair);\n                              ctx4 = GameStateFn2.doItemSetRollState(ctx4, false, [cardId, basyou], { isSkipTargetMissing: true });\n                              ctx4 = GameStateFn2.doItemMove(ctx4, DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(basyou, \"\\u30B8\\u30E3\\u30F3\\u30AF\\u30E4\\u30FC\\u30C9\"), targetPair);\n                              ctx4 = GameStateFn2.doTriggerEvent(ctx4, { title: [\"\\u300C\\u6539\\u88C5\\u300D\\u306E\\u52B9\\u679C\\u3067\\u5EC3\\u68C4\\u3055\\u308C\\u308B\\u5834\\u5408\"], cardIds: [targetPair[0]] });\n                              ctx4 = GameStateFn2.doTriggerEvent(ctx4, { title: [\"\\u300C\\u6539\\u88C5\\u300D\\u306E\\u52B9\\u679C\\u3067\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId] });\n                              return ctx4;\n                            }.toString()\n                          }\n                        ]\n                      }\n                    });\n                    ctx3 = GameStateFn.addStackEffect(ctx3, newE);\n                    return ctx3;\n                  }"
                            }
                        ]
                    }
                ]
            }
        },
        "createPlayEffects_PlayerA_PlayerA_29_loadPrototype_179024_03B_U_WT057U_white_text_2": {
            "id": "createPlayEffects_PlayerA_PlayerA_29_loadPrototype_179024_03B_U_WT057U_white_text_2",
            "reason": [
                "PlayText",
                "PlayerA",
                "PlayerA_29",
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
                        ]
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
                                "title": "function _(ctx3, effect, { GameStateFn, DefineFn }) {\n                    const cardId = DefineFn.EffectFn.getCardID(effect);\n                    const pairs = GameStateFn.getCardTipStrBaSyouPairs(ctx3, \"\\uFF3B \\uFF3D\\u306E\\u7279\\u5FB4\\u3092\\u6301\\u3064\\u81EA\\u8ECD\\u30E6\\u30CB\\u30C3\\u30C8\\uFF11\\u679A\\u306F\", cardId);\n                    const textRefs = GameStateFn.getCardTipTextRefs(ctx3, \"\\u3053\\u306E\\u30AB\\u30FC\\u30C9\\u306E\\u672C\\u6765\\u306E\\u30C6\\u30AD\\u30B9\\u30C8\\uFF11\\u3064\", cardId);\n                    const textRefIds = textRefs.map((tr) => tr.textId);\n                    for (const pair2 of pairs) {\n                      const hasSameText = GameStateFn.getCardTexts(ctx3, pair2[0]).find((text2) => textRefIds.includes(text2.id));\n                      if (hasSameText) {\n                        throw new DefineFn.TipError(`\\u5DF2\\u6709\\u540C\\u6A23\\u7684\\u5167\\u6587: ${JSON.stringify(textRefIds)}`, { hasSameText: true });\n                      }\n                    }\n                    return ctx3;\n                  }"
                            }
                        ]
                    },
                    "同切上限": {
                        "actions": [
                            {
                                "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn2.EffectFn.getCardID(effect);\n                const ps = GameStateFn2.getItemState(ctx3, cardId2);\n                if (ps.textIdsUseThisCut?.[effect.text.id]) {\n                  throw new DefineFn2.TipError(`\\u540C\\u5207\\u4E0A\\u9650: ${effect.text.description}`);\n                }\n                ctx3 = GameStateFn2.mapItemState(ctx3, cardId2, (ps2) => {\n                  return {\n                    ...ps2,\n                    textIdsUseThisCut: {\n                      ...ps2.textIdsUseThisCut,\n                      [effect.text.id]: true\n                    }\n                  };\n                });\n                return ctx3;\n              }"
                            }
                        ]
                    },
                    "同回合上限": {
                        "actions": [
                            {
                                "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn2.EffectFn.getCardID(effect);\n                const ps = GameStateFn2.getItemState(ctx3, cardId2);\n                if (ps.textIdsUseThisTurn?.[effect.text.id]) {\n                  throw new DefineFn2.TipError(`\\u540C\\u56DE\\u5408\\u4E0A\\u9650: ${effect.text.description}`);\n                }\n                ctx3 = GameStateFn2.mapItemState(ctx3, cardId2, (ps2) => {\n                  return {\n                    ...ps2,\n                    textIdsUseThisTurn: {\n                      ...ps2.textIdsUseThisTurn,\n                      [effect.text.id]: true\n                    }\n                  };\n                });\n                return ctx3;\n              }"
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
                                            "title": "function _(ctx3, effect, { GameStateFn, DefineFn }) {\n                        const cardId = DefineFn.EffectFn.getCardID(effect);\n                        const pairs = GameStateFn.getCardTipStrBaSyouPairs(ctx3, \"\\uFF3B \\uFF3D\\u306E\\u7279\\u5FB4\\u3092\\u6301\\u3064\\u81EA\\u8ECD\\u30E6\\u30CB\\u30C3\\u30C8\\uFF11\\u679A\\u306F\", cardId);\n                        const textRefs = GameStateFn.getCardTipTextRefs(ctx3, \"\\u3053\\u306E\\u30AB\\u30FC\\u30C9\\u306E\\u672C\\u6765\\u306E\\u30C6\\u30AD\\u30B9\\u30C8\\uFF11\\u3064\", cardId);\n                        for (const pair2 of pairs) {\n                          GameStateFn.assertTargetMissingError(ctx3, pair2);\n                          const [targetCardId, targetBasyou] = pair2;\n                          ctx3 = GameStateFn.mapItemState(ctx3, targetCardId, (targetItemState) => {\n                            for (const textRef of textRefs) {\n                              const alreadyHas = GameStateFn.getCardTexts(ctx3, targetItemState.id).find((text2) => text2.id == textRef.textId) != null;\n                              if (alreadyHas) {\n                                continue;\n                              }\n                              targetItemState = DefineFn.ItemStateFn.setGlobalEffect(targetItemState, null, {\n                                title: [\"AddTextRef\", textRef],\n                                cardIds: [targetItemState.id]\n                              }, { isRemoveOnTurnEnd: true });\n                            }\n                            return targetItemState;\n                          });\n                        }\n                        return ctx3;\n                      }"
                                        }
                                    ]
                                ]
                            }
                        ]
                    }
                ]
            }
        },
        "createPlayEffects_PlayerA_PlayerA_29_loadPrototype_179024_03B_U_WT057U_white_text_3": {
            "id": "createPlayEffects_PlayerA_PlayerA_29_loadPrototype_179024_03B_U_WT057U_white_text_3",
            "reason": [
                "PlayText",
                "PlayerA",
                "PlayerA_29",
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
                        ]
                    },
                    "這個效果只有這張卡從手中打出的回合可以使用": {
                        "actions": [
                            {
                                "title": "function _(ctx3, effect, { GameStateFn, DefineFn }) {\n                    const cardId = DefineFn.EffectFn.getCardID(effect);\n                    if (GameStateFn.getItemState(ctx3, cardId).isFirstTurn != true) {\n                      throw new DefineFn.TipError(`\\u9019\\u500B\\u6548\\u679C\\u53EA\\u6709\\u9019\\u5F35\\u5361\\u5F9E\\u624B\\u4E2D\\u6253\\u51FA\\u7684\\u56DE\\u5408\\u53EF\\u4EE5\\u4F7F\\u7528:${effect.text.description}`);\n                    }\n                    return ctx3;\n                  }"
                            }
                        ]
                    },
                    "同切上限": {
                        "actions": [
                            {
                                "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn2.EffectFn.getCardID(effect);\n                const ps = GameStateFn2.getItemState(ctx3, cardId2);\n                if (ps.textIdsUseThisCut?.[effect.text.id]) {\n                  throw new DefineFn2.TipError(`\\u540C\\u5207\\u4E0A\\u9650: ${effect.text.description}`);\n                }\n                ctx3 = GameStateFn2.mapItemState(ctx3, cardId2, (ps2) => {\n                  return {\n                    ...ps2,\n                    textIdsUseThisCut: {\n                      ...ps2.textIdsUseThisCut,\n                      [effect.text.id]: true\n                    }\n                  };\n                });\n                return ctx3;\n              }"
                            }
                        ]
                    },
                    "同回合上限": {
                        "actions": [
                            {
                                "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn2.EffectFn.getCardID(effect);\n                const ps = GameStateFn2.getItemState(ctx3, cardId2);\n                if (ps.textIdsUseThisTurn?.[effect.text.id]) {\n                  throw new DefineFn2.TipError(`\\u540C\\u56DE\\u5408\\u4E0A\\u9650: ${effect.text.description}`);\n                }\n                ctx3 = GameStateFn2.mapItemState(ctx3, cardId2, (ps2) => {\n                  return {\n                    ...ps2,\n                    textIdsUseThisTurn: {\n                      ...ps2.textIdsUseThisTurn,\n                      [effect.text.id]: true\n                    }\n                  };\n                });\n                return ctx3;\n              }"
                            }
                        ]
                    }
                },
                "logicTreeActions": [
                    {
                        "actions": [
                            {
                                "title": "function _(ctx3, effect, { GameStateFn, DefineFn }) {\n                    const { A: A2 } = {\"A\":\"アストレイ系\"};\n                    const newE = DefineFn.EffectFn.fromEffectBasic(effect, {\n                      conditions: {\n                        \"\\u770B\\u81EA\\u5DF1\\u672C\\u570B\\u5168\\u90E8\\u7684\\u5361,\\u53EF\\u4EE5\\u5F9E\\u4E2D\\u627E\\u51FA\\u7279\\u5FB5A\\u76841\\u5F35\\u5361\\u79FB\\u5230HANGER,\\u90A3\\u500B\\u6642\\u5019\\u672C\\u570B\\u6D17\\u724C\": {\n                          title: [\"_\\u81EA\\u8ECD_\\u672C\\u570B\\u627E\\u51FA\\u7279\\u5FB5_A\\u7684_1\\u5F35\\u5361\", \"\\u81EA\\u8ECD\", \"\\u672C\\u56FD\", A2, 1],\n                          actions: [\n                            {\n                              title: [\"\\u770B\\u81EA\\u5DF1_\\u672C\\u570B\\u5168\\u90E8\\u7684\\u5361\", \"\\u672C\\u56FD\"]\n                            }\n                          ]\n                        }\n                      },\n                      logicTreeAction: {\n                        actions: [\n                          {\n                            title: function _(ctx4, effect2, { GameStateFn: GameStateFn2, DefineFn: DefineFn2 }) {\n                              const cardId = DefineFn2.EffectFn.getCardID(effect2);\n                              const cardController = GameStateFn2.getItemController(ctx4, cardId);\n                              const pairs = GameStateFn2.getCardTipStrBaSyouPairs(ctx4, \"\\u770B\\u81EA\\u5DF1\\u672C\\u570B\\u5168\\u90E8\\u7684\\u5361,\\u53EF\\u4EE5\\u5F9E\\u4E2D\\u627E\\u51FA\\u7279\\u5FB5A\\u76841\\u5F35\\u5361\\u79FB\\u5230HANGER,\\u90A3\\u500B\\u6642\\u5019\\u672C\\u570B\\u6D17\\u724C\", cardId);\n                              if (pairs.length) {\n                                for (const pair2 of pairs) {\n                                  ctx4 = GameStateFn2.doItemMove(ctx4, DefineFn2.AbsoluteBaSyouFn.of(cardController, \"\\u30CF\\u30F3\\u30AC\\u30FC\"), pair2);\n                                }\n                                ctx4 = GameStateFn2.shuffleItems(ctx4, DefineFn2.AbsoluteBaSyouFn.of(cardController, \"\\u672C\\u56FD\"));\n                              }\n                              return ctx4;\n                            }.toString()\n                          }\n                        ]\n                      }\n                    });\n                    ctx3 = GameStateFn.addStackEffect(ctx3, newE);\n                    return ctx3;\n                  }"
                            }
                        ]
                    }
                ]
            }
        },
        "createAttackPhaseRuleEffect_PlayerA": {
            "id": "createAttackPhaseRuleEffect_PlayerA",
            "reason": [
                "GameRule",
                "PlayerA"
            ],
            "description": "出擊",
            "isOption": true,
            "text": {
                "id": "createAttackPhaseRuleEffect_text_PlayerA",
                "title": [],
                "description": "出擊",
                "conditions": {
                    "去地球": {
                        "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n            const currentBaKw = \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A21\";\n            const runtimeBattleArea = GameStateFn2.getRuntimeBattleArea(ctx3, currentBaKw);\n            if (runtimeBattleArea == \"\\u5B87\\u5B99\\u30A8\\u30EA\\u30A2\") {\n              return null;\n            }\n            const playerId2 = DefineFn2.EffectFn.getPlayerID(effect);\n            const opponentPlayerId = DefineFn2.PlayerIDFn.getOpponent(playerId2);\n            const cardIds = GameStateFn2.getItemIdsByBasyou(ctx3, DefineFn2.AbsoluteBaSyouFn.of(playerId2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\"));\n            let unitIds = cardIds.filter((cardId) => GameStateFn2.getSetGroupRoot(ctx3, cardId) == cardId).filter((cardId) => GameStateFn2.getCardBattleArea(ctx3, cardId).includes(runtimeBattleArea)).filter((cardId) => GameStateFn2.getCard(ctx3, cardId).isRoll != true);\n            const opponentUnitIds = GameStateFn2.getBattleGroup(ctx3, DefineFn2.AbsoluteBaSyouFn.of(opponentPlayerId, currentBaKw));\n            if (opponentUnitIds.length) {\n              if (GameStateFn2.isBattleGroupHasA(ctx3, [\"\\u9AD8\\u6A5F\\u52D5\"], opponentUnitIds[0])) {\n                unitIds = unitIds.filter((id) => GameStateFn2.isBattleGroupHasA(ctx3, [\"\\u9AD8\\u6A5F\\u52D5\"], id));\n              }\n            }\n            const pairs = unitIds.map((id) => {\n              return [id, GameStateFn2.getItemBaSyou(ctx3, id)];\n            });\n            return {\n              title: [\"\\u30AB\\u30FC\\u30C9\", pairs, pairs]\n            };\n          }",
                        "actions": [
                            {
                                "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                const playerId2 = DefineFn2.EffectFn.getPlayerID(effect);\n                const fackCardId = DefineFn2.EffectFn.getCardID(effect);\n                const earthPairs = GameStateFn2.getCardTipStrBaSyouPairs(ctx3, \"\\u53BB\\u5730\\u7403\", fackCardId);\n                for (const pair3 of earthPairs) {\n                  ctx3 = GameStateFn2.doItemMove(ctx3, DefineFn2.AbsoluteBaSyouFn.of(playerId2, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A21\"), pair3);\n                }\n                return ctx3;\n              }"
                            }
                        ]
                    },
                    "去宇宙": {
                        "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n            const currentBaKw = \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A22\";\n            const runtimeBattleArea = GameStateFn2.getRuntimeBattleArea(ctx3, currentBaKw);\n            if (runtimeBattleArea == \"\\u5730\\u7403\\u30A8\\u30EA\\u30A2\") {\n              return null;\n            }\n            const playerId2 = DefineFn2.EffectFn.getPlayerID(effect);\n            const opponentPlayerId = DefineFn2.PlayerIDFn.getOpponent(playerId2);\n            const cardIds = GameStateFn2.getItemIdsByBasyou(ctx3, DefineFn2.AbsoluteBaSyouFn.of(playerId2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\"));\n            let unitIds = cardIds.filter((cardId) => GameStateFn2.getSetGroupRoot(ctx3, cardId) == cardId).filter((cardId) => GameStateFn2.getCardBattleArea(ctx3, cardId).includes(runtimeBattleArea)).filter((cardId) => GameStateFn2.getCard(ctx3, cardId).isRoll != true);\n            const opponentUnitIds = GameStateFn2.getBattleGroup(ctx3, DefineFn2.AbsoluteBaSyouFn.of(opponentPlayerId, currentBaKw));\n            if (opponentUnitIds.length) {\n              if (GameStateFn2.isBattleGroupHasA(ctx3, [\"\\u9AD8\\u6A5F\\u52D5\"], opponentUnitIds[0])) {\n                unitIds = unitIds.filter((id) => GameStateFn2.isBattleGroupHasA(ctx3, [\"\\u9AD8\\u6A5F\\u52D5\"], id));\n              }\n            }\n            const pairs = unitIds.map((id) => {\n              return [id, GameStateFn2.getItemBaSyou(ctx3, id)];\n            });\n            return {\n              title: [\"\\u30AB\\u30FC\\u30C9\", pairs, pairs]\n            };\n          }",
                        "actions": [
                            {
                                "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                const playerId2 = DefineFn2.EffectFn.getPlayerID(effect);\n                const fackCardId = DefineFn2.EffectFn.getCardID(effect);\n                const spacePairs = GameStateFn2.getCardTipStrBaSyouPairs(ctx3, \"\\u53BB\\u5B87\\u5B99\", fackCardId);\n                for (const pair3 of spacePairs) {\n                  ctx3 = GameStateFn2.doItemMove(ctx3, DefineFn2.AbsoluteBaSyouFn.of(playerId2, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A22\"), pair3);\n                }\n                return ctx3;\n              }"
                            }
                        ]
                    }
                },
                "logicTreeActions": [
                    {
                        "actions": [
                            {
                                "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                const fackCardId = DefineFn2.EffectFn.getCardID(effect);\n                const phase = GameStateFn2.getPhase(ctx3);\n                const pairs1 = GameStateFn2.getCardTipStrBaSyouPairs(ctx3, \"\\u53BB\\u5730\\u7403\", fackCardId);\n                const pairs2 = GameStateFn2.getCardTipStrBaSyouPairs(ctx3, \"\\u53BB\\u5B87\\u5B99\", fackCardId);\n                if (DefineFn2.PhaseFn.eq(phase, [\"\\u6226\\u95D8\\u30D5\\u30A7\\u30A4\\u30BA\", \"\\u653B\\u6483\\u30B9\\u30C6\\u30C3\\u30D7\", \"\\u898F\\u5B9A\\u306E\\u52B9\\u679C\"])) {\n                  ctx3 = GameStateFn2.doTriggerEvent(ctx3, {\n                    title: [\"\\u3053\\u306E\\u30AB\\u30FC\\u30C9\\u304C\\u653B\\u6483\\u306B\\u51FA\\u6483\\u3057\\u305F\\u5834\\u5408\"],\n                    cardIds: [...pairs1, ...pairs2].map((p) => p[0])\n                  });\n                }\n                return ctx3;\n              }"
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
                "PlayerA_46",
                "PlayerA_33",
                "PlayerA_15",
                "PlayerA_14",
                "PlayerA_5",
                "PlayerA_41",
                "PlayerA_40",
                "PlayerA_17",
                "PlayerA_20",
                "PlayerA_16",
                "PlayerA_36",
                "PlayerA_11",
                "PlayerA_4",
                "PlayerA_35",
                "PlayerA_38",
                "PlayerA_37",
                "PlayerA_12",
                "PlayerA_10",
                "PlayerA_2",
                "PlayerA_31",
                "PlayerA_9",
                "PlayerA_30",
                "PlayerA_13",
                "PlayerA_6",
                "PlayerA_48",
                "PlayerA_32",
                "PlayerA_19"
            ],
            "[\"PlayerB\",\"本国\"]": [
                "PlayerB_67",
                "PlayerB_71",
                "PlayerB_57",
                "PlayerB_82",
                "PlayerB_59",
                "PlayerB_53",
                "PlayerB_54",
                "PlayerB_65",
                "PlayerB_60",
                "PlayerB_90",
                "PlayerB_61",
                "PlayerB_52",
                "PlayerB_83",
                "PlayerB_77",
                "PlayerB_93",
                "PlayerB_89",
                "PlayerB_73"
            ],
            "[\"PlayerA\",\"Gゾーン\"]": [
                "PlayerA_100",
                "PlayerA_101",
                "PlayerA_102",
                "PlayerA_22",
                "PlayerA_44"
            ],
            "[\"PlayerA\",\"配備エリア\"]": [
                "PlayerA_43",
                "PlayerA_103",
                "PlayerA_34",
                "PlayerA_27",
                "PlayerA_29"
            ],
            "[\"PlayerB\",\"Gゾーン\"]": [
                "PlayerB_104",
                "PlayerB_105",
                "PlayerB_106"
            ],
            "[\"PlayerB\",\"配備エリア\"]": [],
            "[\"PlayerA\",\"手札\"]": [
                "PlayerA_0",
                "PlayerA_26"
            ],
            "[\"PlayerB\",\"手札\"]": [
                "PlayerB_64",
                "PlayerB_62",
                "PlayerB_74",
                "PlayerB_91",
                "PlayerB_78",
                "PlayerB_76",
                "PlayerB_84",
                "PlayerB_97",
                "PlayerB_51",
                "PlayerB_98"
            ],
            "[\"PlayerA\",\"プレイされているカード\"]": [],
            "[\"PlayerB\",\"戦闘エリア1\"]": [
                "PlayerB_92"
            ],
            "[\"PlayerA\",\"捨て山\"]": [
                "PlayerA_28",
                "PlayerA_7",
                "PlayerA_39",
                "PlayerA_1",
                "PlayerA_45",
                "PlayerA_42",
                "PlayerA_3",
                "PlayerA_49",
                "PlayerA_47",
                "PlayerA_25"
            ],
            "[\"PlayerA\",\"戦闘エリア1\"]": [],
            "[\"PlayerB\",\"捨て山\"]": [
                "PlayerB_70",
                "PlayerB_85",
                "PlayerB_81",
                "PlayerB_69",
                "PlayerB_94",
                "PlayerB_87",
                "PlayerB_58",
                "PlayerB_55",
                "PlayerB_75",
                "PlayerB_99",
                "PlayerB_96",
                "PlayerB_56",
                "PlayerB_80",
                "PlayerB_50",
                "PlayerB_88",
                "PlayerB_86",
                "PlayerB_72",
                "PlayerB_63",
                "PlayerB_95",
                "PlayerB_66",
                "PlayerB_79"
            ],
            "[\"PlayerA\",\"ジャンクヤード\"]": [
                "PlayerA_8",
                "PlayerA_21",
                "PlayerA_18",
                "PlayerA_23",
                "PlayerA_24"
            ],
            "[\"PlayerA\",\"ハンガー\"]": [],
            "[\"PlayerB\",\"プレイされているカード\"]": [],
            "[\"PlayerB\",\"ジャンクヤード\"]": [
                "PlayerB_107",
                "PlayerB_68"
            ]
        }
    },
    "chips": {},
    "chipProtos": {},
    "itemStates": {
        "PlayerA_43": {
            "id": "PlayerA_43",
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
                                "PlayerA_34",
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
            "isFirstTurn": false,
            "textIdsUseThisCut": {},
            "isOpenForGain": false,
            "isCheat": false,
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
                        [
                            [
                                "PlayerB_92",
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
                                "PlayerB_92",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "配備エリア"
                                    ]
                                }
                            ]
                        ]
                    ]
                },
                "去宇宙": {
                    "title": [
                        "カード",
                        [],
                        []
                    ]
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
        "PlayerA_44": {
            "id": "PlayerA_44",
            "damage": 0,
            "destroyReason": null,
            "flags": {},
            "tips": {
                "敵軍ユニット１枚": {
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
                                "PlayerB_107",
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
            "tips": {
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
                "自分の手札２枚": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerA_18",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "手札"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_29",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "手札"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_23",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "手札"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_21",
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
                                "PlayerA_21",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "手札"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_18",
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
                    "count": 2
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
        "PlayerA_8": {
            "id": "PlayerA_8",
            "damage": 0,
            "destroyReason": null,
            "flags": {},
            "tips": {
                "一個自軍機體": {
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
                                "PlayerA_22",
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
                                "PlayerA_22",
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
                                "PlayerA_22",
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
                    ]
                },
                "去宇宙": {
                    "title": [
                        "カード",
                        [],
                        []
                    ]
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
        "PlayerA_29": {
            "id": "PlayerA_29",
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
                                "PlayerA_22",
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
                                "PlayerA_22",
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
                                "PlayerA_22",
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
                "看自己本國全部的卡,可以從中找出特徵A的1張卡移到HANGER,那個時候本國洗牌": {
                    "title": [
                        "カード",
                        [
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
                                "PlayerA_14",
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
                                "PlayerA_10",
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
                                "PlayerA_13",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "本国"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_16",
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
                                "PlayerA_30",
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
                                "PlayerA_12",
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
                                "PlayerA_27",
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
                    "min": 1,
                    "cheatCardIds": [
                        "PlayerA_31",
                        "PlayerA_33",
                        "PlayerA_24",
                        "PlayerA_5",
                        "PlayerA_32",
                        "PlayerA_38",
                        "PlayerA_15",
                        "PlayerA_41",
                        "PlayerA_0",
                        "PlayerA_46",
                        "PlayerA_14",
                        "PlayerA_6",
                        "PlayerA_17",
                        "PlayerA_27",
                        "PlayerA_35",
                        "PlayerA_11",
                        "PlayerA_48",
                        "PlayerA_4",
                        "PlayerA_10",
                        "PlayerA_9",
                        "PlayerA_13",
                        "PlayerA_36",
                        "PlayerA_16",
                        "PlayerA_19",
                        "PlayerA_20",
                        "PlayerA_40",
                        "PlayerA_2",
                        "PlayerA_37",
                        "PlayerA_30",
                        "PlayerA_26",
                        "PlayerA_12"
                    ]
                },
                "1[null]": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerA_22",
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
                                "PlayerA_22",
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
                                "PlayerA_29",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "戦闘エリア1"
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
                                "PlayerA_29",
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
                "0[null]": {
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
            "isFirstTurn": false,
            "textIdsUseThisCut": {},
            "textIdsUseThisTurn": {},
            "isOpenForGain": false,
            "isCheat": false
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
                                "PlayerA_29",
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
                                "PlayerA_29",
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
                                "PlayerA_22",
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
                                "PlayerA_22",
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
                                "PlayerA_22",
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
        "PlayerA_14": {
            "id": "PlayerA_14",
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
        "PlayerA_27": {
            "id": "PlayerA_27",
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
                                "PlayerA_22",
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
                                "PlayerA_22",
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
                "0[null]": {
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
                                "PlayerA_22",
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
                "敵軍ユニット１枚": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerB_92",
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
                                "PlayerB_92",
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
        "PlayerA_10": {
            "id": "PlayerA_10",
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
        "PlayerA_16": {
            "id": "PlayerA_16",
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
        "PlayerA_30": {
            "id": "PlayerA_30",
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
        "PlayerA_34": {
            "id": "PlayerA_34",
            "damage": 0,
            "destroyReason": null,
            "flags": {},
            "tips": {
                "0[白]": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerA_22",
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
                                "PlayerA_22",
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
                                "PlayerA_22",
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
                                "PlayerA_22",
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
                                "PlayerA_22",
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
                                "PlayerA_22",
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
        "PlayerB_92": {
            "id": "PlayerB_92",
            "damage": 0,
            "destroyReason": null,
            "flags": {},
            "tips": {
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
                },
                "自軍ユニット１枚": {
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
                                "PlayerB_92",
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
        "PlayerB_68": {
            "id": "PlayerB_68",
            "damage": 0,
            "destroyReason": null,
            "flags": {},
            "tips": {
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
                "敵軍手札１枚": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerA_23",
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
                                "PlayerA_23",
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
        }
    },
    "phase": [
        "戦闘フェイズ",
        "防御ステップ",
        "規定の効果"
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
    "immediateEffect": [
        "createAttackPhaseRuleEffect_PlayerA"
    ],
    "stackEffect": [],
    "destroyEffect": [],
    "commandEffects": [
        "createPlayEffects_PlayerA_PlayerA_27_loadPrototype_179022_06C_U_WT113R_white_text_1",
        "createPlayEffects_PlayerA_PlayerA_29_loadPrototype_179024_03B_U_WT057U_white_text_0",
        "createPlayEffects_PlayerA_PlayerA_29_loadPrototype_179024_03B_U_WT057U_white_text_1",
        "createPlayEffects_PlayerA_PlayerA_29_loadPrototype_179024_03B_U_WT057U_white_text_2",
        "createPlayEffects_PlayerA_PlayerA_29_loadPrototype_179024_03B_U_WT057U_white_text_3"
    ],
    "commandEffectTips": [
        {
            "effectId": "createPlayEffects_PlayerA_PlayerA_27_loadPrototype_179022_06C_U_WT113R_white_text_1",
            "logicID": 0,
            "logicSubID": 0,
            "tipOrErrors": [
                {
                    "effectId": "createPlayEffects_PlayerA_PlayerA_27_loadPrototype_179022_06C_U_WT113R_white_text_1",
                    "conditionKey": "打開自軍手裡或指定HANGER中特徵A並合計國力x以下的1張卡",
                    "tip": {
                        "title": [
                            "カード",
                            [
                                [
                                    "PlayerA_26",
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
                                    "PlayerA_26",
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
                    "errors": []
                },
                {
                    "effectId": "createPlayEffects_PlayerA_PlayerA_27_loadPrototype_179022_06C_U_WT113R_white_text_1",
                    "conditionKey": "同切上限",
                    "tip": null,
                    "errors": []
                },
                {
                    "effectId": "createPlayEffects_PlayerA_PlayerA_27_loadPrototype_179022_06C_U_WT113R_white_text_1",
                    "conditionKey": "同回合上限",
                    "tip": null,
                    "errors": []
                }
            ]
        },
        {
            "effectId": "createPlayEffects_PlayerA_PlayerA_29_loadPrototype_179024_03B_U_WT057U_white_text_0",
            "logicID": 0,
            "logicSubID": 0,
            "tipOrErrors": [
                {
                    "effectId": "createPlayEffects_PlayerA_PlayerA_29_loadPrototype_179024_03B_U_WT057U_white_text_0",
                    "conditionKey": "0[null]",
                    "tip": {
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
                    },
                    "errors": []
                },
                {
                    "effectId": "createPlayEffects_PlayerA_PlayerA_29_loadPrototype_179024_03B_U_WT057U_white_text_0",
                    "conditionKey": "1[null]",
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
                        "cardId: PlayerA_29 target not set yet: 1[null]"
                    ]
                },
                {
                    "effectId": "createPlayEffects_PlayerA_PlayerA_29_loadPrototype_179024_03B_U_WT057U_white_text_0",
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
                                    "PlayerA_27",
                                    {
                                        "id": "AbsoluteBaSyou",
                                        "value": [
                                            "PlayerA",
                                            "配備エリア"
                                        ]
                                    }
                                ],
                                [
                                    "PlayerA_29",
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
                    "effectId": "createPlayEffects_PlayerA_PlayerA_29_loadPrototype_179024_03B_U_WT057U_white_text_0",
                    "conditionKey": "同切上限",
                    "tip": null,
                    "errors": []
                },
                {
                    "effectId": "createPlayEffects_PlayerA_PlayerA_29_loadPrototype_179024_03B_U_WT057U_white_text_0",
                    "conditionKey": "同回合上限",
                    "tip": null,
                    "errors": []
                }
            ]
        },
        {
            "effectId": "createPlayEffects_PlayerA_PlayerA_29_loadPrototype_179024_03B_U_WT057U_white_text_1",
            "logicID": 0,
            "logicSubID": 0,
            "tipOrErrors": [
                {
                    "effectId": "createPlayEffects_PlayerA_PlayerA_29_loadPrototype_179024_03B_U_WT057U_white_text_1",
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
                    "effectId": "createPlayEffects_PlayerA_PlayerA_29_loadPrototype_179024_03B_U_WT057U_white_text_1",
                    "conditionKey": "同切上限",
                    "tip": null,
                    "errors": []
                },
                {
                    "effectId": "createPlayEffects_PlayerA_PlayerA_29_loadPrototype_179024_03B_U_WT057U_white_text_1",
                    "conditionKey": "同回合上限",
                    "tip": null,
                    "errors": []
                }
            ]
        },
        {
            "effectId": "createPlayEffects_PlayerA_PlayerA_29_loadPrototype_179024_03B_U_WT057U_white_text_2",
            "logicID": 0,
            "logicSubID": 0,
            "tipOrErrors": [
                {
                    "effectId": "createPlayEffects_PlayerA_PlayerA_29_loadPrototype_179024_03B_U_WT057U_white_text_2",
                    "conditionKey": "0[null]",
                    "tip": {
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
                    },
                    "errors": []
                },
                {
                    "effectId": "createPlayEffects_PlayerA_PlayerA_29_loadPrototype_179024_03B_U_WT057U_white_text_2",
                    "conditionKey": "このカードの本来のテキスト１つ",
                    "tip": {
                        "title": [
                            "テキスト",
                            [
                                {
                                    "cardId": "PlayerA_29",
                                    "textId": "loadPrototype_179024_03B_U_WT057U_white_text_0"
                                },
                                {
                                    "cardId": "PlayerA_29",
                                    "textId": "loadPrototype_179024_03B_U_WT057U_white_text_1"
                                },
                                {
                                    "cardId": "PlayerA_29",
                                    "textId": "loadPrototype_179024_03B_U_WT057U_white_text_3"
                                }
                            ],
                            [
                                {
                                    "cardId": "PlayerA_29",
                                    "textId": "loadPrototype_179024_03B_U_WT057U_white_text_0"
                                }
                            ]
                        ],
                        "count": 1
                    },
                    "errors": []
                },
                {
                    "effectId": "createPlayEffects_PlayerA_PlayerA_29_loadPrototype_179024_03B_U_WT057U_white_text_2",
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
                                    "PlayerA_27",
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
                    "effectId": "createPlayEffects_PlayerA_PlayerA_29_loadPrototype_179024_03B_U_WT057U_white_text_2",
                    "conditionKey": "同切上限",
                    "tip": null,
                    "errors": []
                },
                {
                    "effectId": "createPlayEffects_PlayerA_PlayerA_29_loadPrototype_179024_03B_U_WT057U_white_text_2",
                    "conditionKey": "同回合上限",
                    "tip": null,
                    "errors": []
                }
            ]
        },
        {
            "effectId": "createPlayEffects_PlayerA_PlayerA_29_loadPrototype_179024_03B_U_WT057U_white_text_3",
            "logicID": 0,
            "logicSubID": 0,
            "tipOrErrors": [
                {
                    "effectId": "createPlayEffects_PlayerA_PlayerA_29_loadPrototype_179024_03B_U_WT057U_white_text_3",
                    "conditionKey": "0[null]",
                    "tip": {
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
                    },
                    "errors": []
                },
                {
                    "effectId": "createPlayEffects_PlayerA_PlayerA_29_loadPrototype_179024_03B_U_WT057U_white_text_3",
                    "conditionKey": "這個效果只有這張卡從手中打出的回合可以使用",
                    "tip": null,
                    "errors": [
                        "這個效果只有這張卡從手中打出的回合可以使用:看自己本國全部的卡,可以從中找出特徵A的1張卡移到HANGER,那個時候本國洗牌.這個效果只有這張卡從手中打出的回合可以使用"
                    ]
                },
                {
                    "effectId": "createPlayEffects_PlayerA_PlayerA_29_loadPrototype_179024_03B_U_WT057U_white_text_3",
                    "conditionKey": "同切上限",
                    "tip": null,
                    "errors": []
                },
                {
                    "effectId": "createPlayEffects_PlayerA_PlayerA_29_loadPrototype_179024_03B_U_WT057U_white_text_3",
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
    "coins": {
        "coin_01925013-1f66-7114-aa5f-95ef369dd8c7": {
            "id": "coin_01925013-1f66-7114-aa5f-95ef369dd8c7",
            "title": [
                "BattleBonus",
                [
                    0,
                    0,
                    -1
                ]
            ],
            "ownerID": "PlayerB"
        },
        "coin_01925013-1f66-7114-aa5f-9bee06ed008a": {
            "id": "coin_01925013-1f66-7114-aa5f-9bee06ed008a",
            "title": [
                "BattleBonus",
                [
                    0,
                    0,
                    -1
                ]
            ],
            "ownerID": "PlayerB"
        },
        "coin_0192501a-3666-7224-9e5b-7b1a021518ee": {
            "id": "coin_0192501a-3666-7224-9e5b-7b1a021518ee",
            "title": [
                "BattleBonus",
                [
                    0,
                    0,
                    -1
                ]
            ],
            "ownerID": "PlayerA"
        },
        "coin_0192501a-3666-7224-9e5b-84b68bebdfeb": {
            "id": "coin_0192501a-3666-7224-9e5b-84b68bebdfeb",
            "title": [
                "BattleBonus",
                [
                    0,
                    0,
                    -1
                ]
            ],
            "ownerID": "PlayerA"
        }
    },
    "coinId2cardId": {
        "coin_01925013-1f66-7114-aa5f-95ef369dd8c7": "PlayerB_107",
        "coin_01925013-1f66-7114-aa5f-9bee06ed008a": "PlayerB_107",
        "coin_0192501a-3666-7224-9e5b-7b1a021518ee": "PlayerB_92",
        "coin_0192501a-3666-7224-9e5b-84b68bebdfeb": "PlayerB_92"
    },
    "globalEffectPool": {},
    "messages": [],
    "messagesCurrentEffect": null,
    "turn": 9,
    "setGroup": {
        "itemGroupParent": {
            "PlayerA_8": "PlayerA_103",
            "PlayerA_24": "PlayerA_29"
        },
        "itemGroupChildren": {
            "PlayerA_103": [
                "PlayerA_8"
            ],
            "PlayerA_29": [
                "PlayerA_24"
            ]
        }
    },
    "stackEffectMemory": [],
    "flowMemory": {
        "state": "playing",
        "hasTriggerEvent": true,
        "hasPlayerPassPhase": {},
        "hasPlayerPassCut": {
            "PlayerB": true,
            "PlayerA": true
        },
        "hasPlayerPassPayCost": {
            "PlayerA": true,
            "PlayerB": true
        },
        "shouldTriggerStackEffectFinishedEvent": false,
        "activeEffectID": "createAttackPhaseRuleEffect_PlayerA",
        "activeLogicID": 0,
        "activeLogicSubID": 0
    }
}