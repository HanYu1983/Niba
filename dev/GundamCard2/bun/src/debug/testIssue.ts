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
import { getCardIdsCanPayRollCost, isCardMaster } from "../game/gameState/card"
import { clearGlobalEffects, getGlobalEffects } from "../game/gameState/globalEffects"
import { applyFlow } from "../game/gameStateWithFlowMemory/applyFlow"
import { createPlayCardEffects } from "../game/gameState/createPlayCardEffects"

export async function testIssue() {
    const whiteSpeed = ["179001_01A_CH_WT007R_white", "179004_01A_CH_WT009R_white", "179004_01A_CH_WT010C_white", "179007_02A_U_WT027U_white", "179007_02A_U_WT027U_white", "179008_02A_U_WT034U_white", "179008_02A_U_WT034U_white", "179008_02A_U_WT034U_white", "179014_03B_CH_WT027R_white", "179015_04B_U_WT067C_white", "179015_04B_U_WT067C_white", "179015_04B_U_WT067C_white", "179016_04B_U_WT074C_white", "179016_04B_U_WT074C_white", "179016_04B_U_WT074C_white", "179016_04B_U_WT075C_white", "179016_04B_U_WT075C_white", "179016_04B_U_WT075C_white", "179019_01A_C_WT010C_white", "179019_01A_C_WT010C_white", "179019_02A_U_WT028R_white", "179019_02A_U_WT028R_white", "179022_06C_CH_WT057R_white", "179022_06C_CH_WT057R_white", "179022_06C_CH_WT057R_white", "179022_06C_U_WT113R_white", "179022_06C_U_WT113R_white", "179022_06C_U_WT113R_white", "179023_06C_CH_WT067C_white", "179024_03B_U_WT057U_white", "179024_03B_U_WT057U_white", "179025_07D_C_WT060U_white", "179025_07D_CH_WT075C_white", "179025_07D_CH_WT075C_white", "179025_07D_CH_WT075C_white", "179027_09D_C_WT067R_white", "179027_09D_C_WT067R_white", "179029_B3C_CH_WT102R_white", "179029_B3C_CH_WT103N_white", "179029_B3C_U_WT196R_white", "179030_11E_C_WT077S_white", "179030_11E_C_WT077S_white", "179030_11E_C_WT077S_white", "179030_11E_CH_WT108N_white", "179901_00_C_WT003P_white", "179901_00_C_WT003P_white", "179901_00_C_WT003P_white", "179901_CG_C_WT001P_white", "179901_CG_C_WT001P_white", "179901_CG_CH_WT002P_white"]
    const blackT3 = ["179015_04B_O_BK010C_black", "179015_04B_O_BK010C_black", "179015_04B_U_BK058R_black", "179015_04B_U_BK058R_black", "179015_04B_U_BK059C_black", "179015_04B_U_BK059C_black", "179015_04B_U_BK061C_black", "179015_04B_U_BK061C_black", "179016_04B_U_BK066C_black", "179016_04B_U_BK066C_black", "179019_02A_C_BK015S_black", "179019_02A_C_BK015S_black", "179020_05C_U_BK100U_black", "179020_05C_U_BK100U_black", "179023_06C_C_BK048R_black", "179023_06C_C_BK048R_black", "179023_06C_C_BK049U_black", "179023_06C_C_BK049U_black", "179024_04B_C_BK027U_black", "179024_04B_C_BK027U_black", "179024_04B_U_BK060C_black", "179024_04B_U_BK060C_black", "179024_04B_U_BK067C_black", "179024_04B_U_BK067C_black", "179024_B2B_C_BK054C_black", "179024_B2B_C_BK054C_black", "179024_B2B_U_BK128S_black_02", "179024_B2B_U_BK128S_black_02", "179024_B2B_U_BK129R_black", "179024_B2B_U_BK129R_black", "179027_09D_C_BK063R_black", "179027_09D_C_BK063R_black", "179027_09D_O_BK010N_black", "179027_09D_O_BK010N_black", "179027_09D_U_BK163S_black", "179027_09D_U_BK163S_black", "179027_09D_U_BK163S_black", "179029_06C_C_BK045U_black", "179029_06C_C_BK045U_black", "179029_B3C_C_BK071N_black", "179029_B3C_C_BK071N_black", "179029_B3C_U_BK184N_black", "179029_B3C_U_BK184N_black", "179029_B3C_U_BK184N_black", "179029_B3C_U_BK185N_black", "179029_B3C_U_BK185N_black", "179030_11E_U_BK194S_2_black", "179030_11E_U_BK194S_2_black", "179030_11E_U_BK194S_2_black", "179901_B2B_C_BK005P_black"]
    await Promise.all([...blackT3, ...whiteSpeed].map(loadPrototype))
    let ctx = TMP_CTX
    if(createPlayCardEffects(ctx, "PlayerA_41").length != 2){
        throw new Error()
    }
    ctx = setPhase(ctx, ["戦闘フェイズ", "ダメージ判定ステップ", "フリータイミング"]) as GameStateWithFlowMemory
    if(createPlayEffects(ctx, PlayerA).filter(eff=>EffectFn.getCardID(eff) == "PlayerA_41").length != 2){
        throw new Error()
    }
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
            "isFaceDown": false,
            "isRoll": false
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
            "isFaceDown": true,
            "isRoll": false
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
            "isFaceDown": true
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
            "protoID": "179015_04B_U_WT067C_white",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_11": {
            "id": "PlayerA_11",
            "protoID": "179015_04B_U_WT067C_white",
            "ownerID": "PlayerA",
            "isFaceDown": true,
            "isRoll": false
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
            "isFaceDown": true,
            "isRoll": false
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
            "isFaceDown": true
        },
        "PlayerA_17": {
            "id": "PlayerA_17",
            "protoID": "179016_04B_U_WT075C_white",
            "ownerID": "PlayerA",
            "isFaceDown": true,
            "isRoll": false
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
            "isFaceDown": true
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
            "isFaceDown": true,
            "isRoll": false
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
            "isFaceDown": true
        },
        "PlayerA_25": {
            "id": "PlayerA_25",
            "protoID": "179022_06C_U_WT113R_white",
            "ownerID": "PlayerA",
            "isFaceDown": true
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
            "isFaceDown": true
        },
        "PlayerA_28": {
            "id": "PlayerA_28",
            "protoID": "179023_06C_CH_WT067C_white",
            "ownerID": "PlayerA",
            "isFaceDown": true
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
            "isFaceDown": false,
            "isRoll": false
        },
        "PlayerA_33": {
            "id": "PlayerA_33",
            "protoID": "179025_07D_CH_WT075C_white",
            "ownerID": "PlayerA",
            "isFaceDown": false,
            "isRoll": false
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
            "isFaceDown": true,
            "isRoll": false
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
            "isFaceDown": true,
            "isRoll": false
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
            "isFaceDown": false,
            "isRoll": false
        },
        "PlayerA_44": {
            "id": "PlayerA_44",
            "protoID": "179901_00_C_WT003P_white",
            "ownerID": "PlayerA",
            "isFaceDown": true,
            "isRoll": false
        },
        "PlayerA_45": {
            "id": "PlayerA_45",
            "protoID": "179901_00_C_WT003P_white",
            "ownerID": "PlayerA",
            "isFaceDown": true
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
            "isFaceDown": true
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
            "isFaceDown": true
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
            "isFaceDown": false,
            "isRoll": false
        },
        "PlayerB_55": {
            "id": "PlayerB_55",
            "protoID": "179015_04B_U_BK059C_black",
            "ownerID": "PlayerB",
            "isFaceDown": false,
            "isRoll": true
        },
        "PlayerB_56": {
            "id": "PlayerB_56",
            "protoID": "179015_04B_U_BK061C_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
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
            "isFaceDown": true
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
            "isFaceDown": true
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
            "isFaceDown": true
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
            "isFaceDown": true
        },
        "PlayerB_69": {
            "id": "PlayerB_69",
            "protoID": "179024_04B_C_BK027U_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "PlayerB_70": {
            "id": "PlayerB_70",
            "protoID": "179024_04B_U_BK060C_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "PlayerB_71": {
            "id": "PlayerB_71",
            "protoID": "179024_04B_U_BK060C_black",
            "ownerID": "PlayerB",
            "isFaceDown": false,
            "isRoll": false
        },
        "PlayerB_72": {
            "id": "PlayerB_72",
            "protoID": "179024_04B_U_BK067C_black",
            "ownerID": "PlayerB",
            "isFaceDown": false,
            "isRoll": true
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
            "isFaceDown": true
        },
        "PlayerB_76": {
            "id": "PlayerB_76",
            "protoID": "179024_B2B_U_BK128S_black_02",
            "ownerID": "PlayerB",
            "isFaceDown": true
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
            "isFaceDown": true
        },
        "PlayerB_80": {
            "id": "PlayerB_80",
            "protoID": "179027_09D_C_BK063R_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
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
            "isFaceDown": true
        },
        "PlayerB_85": {
            "id": "PlayerB_85",
            "protoID": "179027_09D_U_BK163S_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "PlayerB_86": {
            "id": "PlayerB_86",
            "protoID": "179027_09D_U_BK163S_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
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
            "isFaceDown": true
        },
        "PlayerB_89": {
            "id": "PlayerB_89",
            "protoID": "179029_B3C_C_BK071N_black",
            "ownerID": "PlayerB",
            "isFaceDown": false,
            "isRoll": true
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
            "isFaceDown": false,
            "isRoll": true
        },
        "PlayerB_92": {
            "id": "PlayerB_92",
            "protoID": "179029_B3C_U_BK184N_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
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
            "isFaceDown": true
        },
        "PlayerB_95": {
            "id": "PlayerB_95",
            "protoID": "179029_B3C_U_BK185N_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "PlayerB_96": {
            "id": "PlayerB_96",
            "protoID": "179030_11E_U_BK194S_2_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "PlayerB_97": {
            "id": "PlayerB_97",
            "protoID": "179030_11E_U_BK194S_2_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "PlayerB_98": {
            "id": "PlayerB_98",
            "protoID": "179030_11E_U_BK194S_2_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "PlayerB_99": {
            "id": "PlayerB_99",
            "protoID": "179901_B2B_C_BK005P_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
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
            "isRoll": false,
            "isFaceDown": false
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
            "isRoll": true
        }
    },
    "effects": {
        "createPlayCardEffects_PlayerA_37": {
            "id": "createPlayCardEffects_PlayerA_37",
            "reason": [
                "PlayCard",
                "PlayerA",
                "PlayerA_37",
                {
                    "isPlayUnit": false,
                    "isPlayCharacter": true
                }
            ],
            "description": "Play",
            "text": {
                "id": "createPlayCardEffects_text_PlayerA_37",
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
                                    "value": "一個自軍機體"
                                },
                                {
                                    "type": "Leaf",
                                    "value": "0[白]"
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
        "createPlayCardEffects_PlayerA_30": {
            "id": "createPlayCardEffects_PlayerA_30",
            "reason": [
                "PlayCard",
                "PlayerA",
                "PlayerA_30",
                {
                    "isPlayUnit": true,
                    "isPlayCharacter": false
                }
            ],
            "description": "Play",
            "text": {
                "id": "createPlayCardEffects_text_PlayerA_30",
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
                                    "value": "0[白]"
                                },
                                {
                                    "type": "Leaf",
                                    "value": "1[白]"
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
        "createPlayGEffects_PlayerA_37": {
            "id": "createPlayGEffects_PlayerA_37",
            "reason": [
                "PlayCard",
                "PlayerA",
                "PlayerA_37",
                {
                    "isPlayG": true
                }
            ],
            "description": "PlayG",
            "text": {
                "id": "createPlayGEffects_text_PlayerA_37",
                "title": [],
                "description": "PlayG",
                "conditions": {
                    "出G上限": {
                        "actions": [
                            {
                                "title": "function _(ctx3, effect2, { DefineFn: DefineFn2, GameStateFn: GameStateFn2, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn2.EffectFn.getCardID(effect2), cardController = GameStateFn2.getItemController(ctx3, cardId2), ps = GameStateFn2.getPlayerState(ctx3, cardController);\n                if (ps.playGCount > 0)\n                  throw new DefineFn2.TipError(`\\u51FAG\\u4E0A\\u9650: ${ps.playGCount}`, { isPlayGLimit: !0 });\n                return ctx3 = GameStateFn2.mapPlayerState(ctx3, cardController, (ps2) => {\n                  return {\n                    ...ps2,\n                    playGCount: ps2.playGCount + 1\n                  };\n                }), ctx3;\n              }"
                            }
                        ]
                    }
                },
                "logicTreeActions": [
                    {
                        "actions": [
                            {
                                "title": "function _(ctx3, effect2, { DefineFn: DefineFn2, GameStateFn: GameStateFn2, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn2.EffectFn.getCardID(effect2), from = GameStateFn2.getItemBaSyou(ctx3, cardId2);\n                return ctx3 = GameStateFn2.doItemMove(ctx3, DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"G\\u30BE\\u30FC\\u30F3\"), [cardId2, from]), ctx3;\n              }"
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
        },
        "createPlayGEffects_PlayerA_41": {
            "id": "createPlayGEffects_PlayerA_41",
            "reason": [
                "PlayCard",
                "PlayerA",
                "PlayerA_41",
                {
                    "isPlayG": true
                }
            ],
            "description": "PlayG",
            "text": {
                "id": "createPlayGEffects_text_PlayerA_41",
                "title": [],
                "description": "PlayG",
                "conditions": {
                    "出G上限": {
                        "actions": [
                            {
                                "title": "function _(ctx3, effect2, { DefineFn: DefineFn2, GameStateFn: GameStateFn2, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn2.EffectFn.getCardID(effect2), cardController = GameStateFn2.getItemController(ctx3, cardId2), ps = GameStateFn2.getPlayerState(ctx3, cardController);\n                if (ps.playGCount > 0)\n                  throw new DefineFn2.TipError(`\\u51FAG\\u4E0A\\u9650: ${ps.playGCount}`, { isPlayGLimit: !0 });\n                return ctx3 = GameStateFn2.mapPlayerState(ctx3, cardController, (ps2) => {\n                  return {\n                    ...ps2,\n                    playGCount: ps2.playGCount + 1\n                  };\n                }), ctx3;\n              }"
                            }
                        ]
                    }
                },
                "logicTreeActions": [
                    {
                        "actions": [
                            {
                                "title": "function _(ctx3, effect2, { DefineFn: DefineFn2, GameStateFn: GameStateFn2, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn2.EffectFn.getCardID(effect2), from = GameStateFn2.getItemBaSyou(ctx3, cardId2);\n                return ctx3 = GameStateFn2.doItemMove(ctx3, DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"G\\u30BE\\u30FC\\u30F3\"), [cardId2, from]), ctx3;\n              }"
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
        },
        "createPlayGEffects_PlayerA_30": {
            "id": "createPlayGEffects_PlayerA_30",
            "reason": [
                "PlayCard",
                "PlayerA",
                "PlayerA_30",
                {
                    "isPlayG": true
                }
            ],
            "description": "PlayG",
            "text": {
                "id": "createPlayGEffects_text_PlayerA_30",
                "title": [],
                "description": "PlayG",
                "conditions": {
                    "出G上限": {
                        "actions": [
                            {
                                "title": "function _(ctx3, effect2, { DefineFn: DefineFn2, GameStateFn: GameStateFn2, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn2.EffectFn.getCardID(effect2), cardController = GameStateFn2.getItemController(ctx3, cardId2), ps = GameStateFn2.getPlayerState(ctx3, cardController);\n                if (ps.playGCount > 0)\n                  throw new DefineFn2.TipError(`\\u51FAG\\u4E0A\\u9650: ${ps.playGCount}`, { isPlayGLimit: !0 });\n                return ctx3 = GameStateFn2.mapPlayerState(ctx3, cardController, (ps2) => {\n                  return {\n                    ...ps2,\n                    playGCount: ps2.playGCount + 1\n                  };\n                }), ctx3;\n              }"
                            }
                        ]
                    }
                },
                "logicTreeActions": [
                    {
                        "actions": [
                            {
                                "title": "function _(ctx3, effect2, { DefineFn: DefineFn2, GameStateFn: GameStateFn2, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn2.EffectFn.getCardID(effect2), from = GameStateFn2.getItemBaSyou(ctx3, cardId2);\n                return ctx3 = GameStateFn2.doItemMove(ctx3, DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"G\\u30BE\\u30FC\\u30F3\"), [cardId2, from]), ctx3;\n              }"
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
        },
        "createPlayGEffects_PlayerA_18": {
            "id": "createPlayGEffects_PlayerA_18",
            "reason": [
                "PlayCard",
                "PlayerA",
                "PlayerA_18",
                {
                    "isPlayG": true
                }
            ],
            "description": "PlayG",
            "text": {
                "id": "createPlayGEffects_text_PlayerA_18",
                "title": [],
                "description": "PlayG",
                "conditions": {
                    "出G上限": {
                        "actions": [
                            {
                                "title": "function _(ctx3, effect2, { DefineFn: DefineFn2, GameStateFn: GameStateFn2, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn2.EffectFn.getCardID(effect2), cardController = GameStateFn2.getItemController(ctx3, cardId2), ps = GameStateFn2.getPlayerState(ctx3, cardController);\n                if (ps.playGCount > 0)\n                  throw new DefineFn2.TipError(`\\u51FAG\\u4E0A\\u9650: ${ps.playGCount}`, { isPlayGLimit: !0 });\n                return ctx3 = GameStateFn2.mapPlayerState(ctx3, cardController, (ps2) => {\n                  return {\n                    ...ps2,\n                    playGCount: ps2.playGCount + 1\n                  };\n                }), ctx3;\n              }"
                            }
                        ]
                    }
                },
                "logicTreeActions": [
                    {
                        "actions": [
                            {
                                "title": "function _(ctx3, effect2, { DefineFn: DefineFn2, GameStateFn: GameStateFn2, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn2.EffectFn.getCardID(effect2), from = GameStateFn2.getItemBaSyou(ctx3, cardId2);\n                return ctx3 = GameStateFn2.doItemMove(ctx3, DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"G\\u30BE\\u30FC\\u30F3\"), [cardId2, from]), ctx3;\n              }"
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
    "table": {
        "cardStack": {
            "[\"PlayerA\",\"本国\"]": [
                "PlayerA_42",
                "PlayerA_7",
                "PlayerA_25",
                "PlayerA_8",
                "PlayerA_3",
                "PlayerA_31",
                "PlayerA_16",
                "PlayerA_38",
                "PlayerA_24",
                "PlayerA_6",
                "PlayerA_47",
                "PlayerA_46",
                "PlayerA_20",
                "PlayerA_27",
                "PlayerA_9",
                "PlayerA_15",
                "PlayerA_10",
                "PlayerA_28",
                "PlayerA_29",
                "PlayerA_21",
                "PlayerA_48",
                "PlayerA_49",
                "PlayerA_1",
                "PlayerA_39",
                "PlayerA_5",
                "PlayerA_19",
                "PlayerA_0",
                "PlayerA_45",
                "PlayerA_12",
                "PlayerA_34",
                "PlayerA_35",
                "PlayerA_23"
            ],
            "[\"PlayerB\",\"本国\"]": [
                "PlayerB_51",
                "PlayerB_56",
                "PlayerB_95",
                "PlayerB_86",
                "PlayerB_84",
                "PlayerB_63",
                "PlayerB_50",
                "PlayerB_79",
                "PlayerB_75",
                "PlayerB_64",
                "PlayerB_94",
                "PlayerB_77",
                "PlayerB_93",
                "PlayerB_52",
                "PlayerB_83",
                "PlayerB_82",
                "PlayerB_60",
                "PlayerB_76",
                "PlayerB_73",
                "PlayerB_88",
                "PlayerB_92",
                "PlayerB_67",
                "PlayerB_59",
                "PlayerB_90",
                "PlayerB_85",
                "PlayerB_53",
                "PlayerB_70",
                "PlayerB_62",
                "PlayerB_97",
                "PlayerB_68",
                "PlayerB_98",
                "PlayerB_61",
                "PlayerB_81",
                "PlayerB_69",
                "PlayerB_99",
                "PlayerB_65",
                "PlayerB_78",
                "PlayerB_57",
                "PlayerB_66",
                "PlayerB_58",
                "PlayerB_80"
            ],
            "[\"PlayerA\",\"Gゾーン\"]": [
                "PlayerA_100",
                "PlayerA_101",
                "PlayerA_102",
                "PlayerA_32"
            ],
            "[\"PlayerA\",\"配備エリア\"]": [
                "PlayerA_14"
            ],
            "[\"PlayerB\",\"Gゾーン\"]": [
                "PlayerB_104",
                "PlayerB_105",
                "PlayerB_106",
                "PlayerB_89"
            ],
            "[\"PlayerB\",\"配備エリア\"]": [
                "PlayerB_72",
                "PlayerB_91",
                "PlayerB_107",
                "PlayerB_55"
            ],
            "[\"PlayerA\",\"手札\"]": [
                "PlayerA_37",
                "PlayerA_41",
                "PlayerA_30",
                "PlayerA_18"
            ],
            "[\"PlayerB\",\"手札\"]": [
                "PlayerB_96",
                "PlayerB_74",
                "PlayerB_87"
            ],
            "[\"PlayerB\",\"プレイされているカード\"]": [],
            "[\"PlayerA\",\"プレイされているカード\"]": [],
            "[\"PlayerA\",\"戦闘エリア1\"]": [],
            "[\"PlayerB\",\"戦闘エリア1\"]": [],
            "[\"PlayerA\",\"ジャンクヤード\"]": [
                "PlayerA_2",
                "PlayerA_103",
                "PlayerA_43",
                "PlayerA_33"
            ],
            "[\"PlayerB\",\"ハンガー\"]": [],
            "[\"PlayerB\",\"ジャンクヤード\"]": [
                "PlayerB_71",
                "PlayerB_54"
            ],
            "[\"PlayerB\",\"戦闘エリア2\"]": [],
            "[\"PlayerA\",\"捨て山\"]": [
                "PlayerA_36",
                "PlayerA_11",
                "PlayerA_13",
                "PlayerA_40",
                "PlayerA_4",
                "PlayerA_26",
                "PlayerA_22",
                "PlayerA_44",
                "PlayerA_17"
            ]
        }
    },
    "chips": {},
    "chipProtos": {},
    "itemStates": {
        "PlayerB_71": {
            "id": "PlayerB_71",
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
                "「特徴：T3部隊」を持つ自軍ユニット１枚": {
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
                                "PlayerB_71",
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
                                "PlayerB_89",
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
                                "PlayerB_89",
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
                                "PlayerA_43",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "手札"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_37",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "手札"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_41",
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
                                "PlayerA_33",
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
                                "PlayerA_43",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "手札"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_33",
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
        "PlayerA_2": {
            "id": "PlayerA_2",
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
        "PlayerA_14": {
            "id": "PlayerA_14",
            "damage": 0,
            "destroyReason": null,
            "flags": {},
            "tips": {
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
                        []
                    ],
                    "flags": {
                        "isGoBattleArea2": true
                    }
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
                                "PlayerB_55",
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
            "textIdsUseThisCut": {},
            "isOpenForGain": false,
            "isCheat": false,
            "isFirstTurn": false,
            "textIdsUseThisTurn": {}
        },
        "PlayerB_55": {
            "id": "PlayerB_55",
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
        "PlayerB_72": {
            "id": "PlayerB_72",
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
                                "PlayerB_89",
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
                                "PlayerB_89",
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
        "PlayerB_91": {
            "id": "PlayerB_91",
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
                                "PlayerB_89",
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
                                "PlayerB_89",
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
                                "PlayerB_71",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
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
                            ],
                            [
                                "PlayerB_55",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "配備エリア"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_72",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "配備エリア"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_91",
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
                                "PlayerB_71",
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
        "PlayerB_54": {
            "id": "PlayerB_54",
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
                            ],
                            [
                                "PlayerB_89",
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
                                "PlayerB_89",
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
                "自軍本国の上のカード１～４枚を見て、その中にある、「特徴：ヘイズル系」を持つユニット１枚": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerB_54",
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
                                "PlayerB_54",
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
                        "PlayerB_87",
                        "PlayerB_51",
                        "PlayerB_54",
                        "PlayerB_56"
                    ]
                },
                "打開自軍手裡或指定HANGER中特徵A並合計國力x以下的1張卡": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerB_54",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "ハンガー"
                                    ]
                                }
                            ]
                        ],
                        [
                            [
                                "PlayerB_54",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "ハンガー"
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
        }
    },
    "phase": [
        "配備フェイズ",
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
        "createPlayCardEffects_PlayerA_37",
        "createPlayCardEffects_PlayerA_30",
        "createPlayGEffects_PlayerA_37",
        "createPlayGEffects_PlayerA_41",
        "createPlayGEffects_PlayerA_30",
        "createPlayGEffects_PlayerA_18"
    ],
    "commandEffectTips": [
        {
            "effectId": "createPlayCardEffects_PlayerA_37",
            "conditionKeys": [
                "合計国力〔x〕",
                "一個自軍機體",
                "0[白]"
            ],
            "logicID": 0,
            "logicSubID": 0,
            "tipOrErrors": [
                {
                    "effectId": "createPlayCardEffects_PlayerA_37",
                    "conditionKey": "合計国力〔x〕",
                    "tip": null,
                    "errors": [
                        "合計国力〔x〕:4 < 5. Play"
                    ]
                },
                {
                    "effectId": "createPlayCardEffects_PlayerA_37",
                    "conditionKey": "一個自軍機體",
                    "tip": {
                        "title": [
                            "カード",
                            [
                                [
                                    "PlayerA_14",
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
                                    "PlayerA_14",
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
                    "effectId": "createPlayCardEffects_PlayerA_37",
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
                }
            ]
        },
        {
            "effectId": "createPlayCardEffects_PlayerA_30",
            "conditionKeys": [
                "合計国力〔x〕",
                "0[白]",
                "1[白]"
            ],
            "logicID": 0,
            "logicSubID": 0,
            "tipOrErrors": [
                {
                    "effectId": "createPlayCardEffects_PlayerA_30",
                    "conditionKey": "合計国力〔x〕",
                    "tip": null,
                    "errors": [
                        "合計国力〔x〕:4 < 5. Play"
                    ]
                },
                {
                    "effectId": "createPlayCardEffects_PlayerA_30",
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
                    "effectId": "createPlayCardEffects_PlayerA_30",
                    "conditionKey": "1[白]",
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
                }
            ]
        },
        {
            "effectId": "createPlayGEffects_PlayerA_37",
            "conditionKeys": [
                "出G上限"
            ],
            "logicID": 0,
            "logicSubID": 0,
            "tipOrErrors": [
                {
                    "effectId": "createPlayGEffects_PlayerA_37",
                    "conditionKey": "出G上限",
                    "tip": null,
                    "errors": []
                }
            ]
        },
        {
            "effectId": "createPlayGEffects_PlayerA_41",
            "conditionKeys": [
                "出G上限"
            ],
            "logicID": 0,
            "logicSubID": 0,
            "tipOrErrors": [
                {
                    "effectId": "createPlayGEffects_PlayerA_41",
                    "conditionKey": "出G上限",
                    "tip": null,
                    "errors": []
                }
            ]
        },
        {
            "effectId": "createPlayGEffects_PlayerA_30",
            "conditionKeys": [
                "出G上限"
            ],
            "logicID": 0,
            "logicSubID": 0,
            "tipOrErrors": [
                {
                    "effectId": "createPlayGEffects_PlayerA_30",
                    "conditionKey": "出G上限",
                    "tip": null,
                    "errors": []
                }
            ]
        },
        {
            "effectId": "createPlayGEffects_PlayerA_18",
            "conditionKeys": [
                "出G上限"
            ],
            "logicID": 0,
            "logicSubID": 0,
            "tipOrErrors": [
                {
                    "effectId": "createPlayGEffects_PlayerA_18",
                    "conditionKey": "出G上限",
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
    "turn": 2,
    "setGroup": {
        "itemGroupParent": {},
        "itemGroupChildren": {}
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