import { Effect, EffectFn } from "../game/define/Effect"
import { ItemStateFn } from "../game/define/ItemState"
import { PlayerA, PlayerB, PlayerIDFn } from "../game/define/PlayerID"
import { setTipSelectionForUser, doEffect, createEffectTips, createCommandEffectTips } from "../game/gameState/doEffect"
import { createPlayEffects } from "../game/gameState/createPlayEffects"
import { mapItemState } from "../game/gameState/ItemStateComponent"
import { GameStateWithFlowMemory } from "../game/gameStateWithFlowMemory/GameStateWithFlowMemory"
import { getPrototype, loadPrototype } from "../script"
import { TipFn, StrBaSyouPair } from "../game/define/Tip"
import { GameStateFn } from "../game/gameState"
import { createTipByEntitySearch } from "../game/gameState/Entity"
import { doItemDamage } from "../game/gameState/doItemDamage"
import { getPlayerCommandsFilterNoErrorDistinct, updateCommand } from "../game/gameState/updateCommand"

export async function testIssue() {
    const whiteSpeed = ["179001_01A_CH_WT007R_white", "179004_01A_CH_WT009R_white", "179004_01A_CH_WT010C_white", "179007_02A_U_WT027U_white", "179007_02A_U_WT027U_white", "179008_02A_U_WT034U_white", "179008_02A_U_WT034U_white", "179008_02A_U_WT034U_white", "179014_03B_CH_WT027R_white", "179015_04B_U_WT067C_white", "179015_04B_U_WT067C_white", "179015_04B_U_WT067C_white", "179016_04B_U_WT074C_white", "179016_04B_U_WT074C_white", "179016_04B_U_WT074C_white", "179016_04B_U_WT075C_white", "179016_04B_U_WT075C_white", "179016_04B_U_WT075C_white", "179019_01A_C_WT010C_white", "179019_01A_C_WT010C_white", "179019_02A_U_WT028R_white", "179019_02A_U_WT028R_white", "179022_06C_CH_WT057R_white", "179022_06C_CH_WT057R_white", "179022_06C_CH_WT057R_white", "179022_06C_U_WT113R_white", "179022_06C_U_WT113R_white", "179022_06C_U_WT113R_white", "179023_06C_CH_WT067C_white", "179024_03B_U_WT057U_white", "179024_03B_U_WT057U_white", "179025_07D_C_WT060U_white", "179025_07D_CH_WT075C_white", "179025_07D_CH_WT075C_white", "179025_07D_CH_WT075C_white", "179027_09D_C_WT067R_white", "179027_09D_C_WT067R_white", "179029_B3C_CH_WT102R_white", "179029_B3C_CH_WT103N_white", "179029_B3C_U_WT196R_white", "179030_11E_C_WT077S_white", "179030_11E_C_WT077S_white", "179030_11E_C_WT077S_white", "179030_11E_CH_WT108N_white", "179901_00_C_WT003P_white", "179901_00_C_WT003P_white", "179901_00_C_WT003P_white", "179901_CG_C_WT001P_white", "179901_CG_C_WT001P_white", "179901_CG_CH_WT002P_white"]
    const blackT3 = ["179015_04B_O_BK010C_black", "179015_04B_O_BK010C_black", "179015_04B_U_BK058R_black", "179015_04B_U_BK058R_black", "179015_04B_U_BK059C_black", "179015_04B_U_BK059C_black", "179015_04B_U_BK061C_black", "179015_04B_U_BK061C_black", "179016_04B_U_BK066C_black", "179016_04B_U_BK066C_black", "179019_02A_C_BK015S_black", "179019_02A_C_BK015S_black", "179020_05C_U_BK100U_black", "179020_05C_U_BK100U_black", "179023_06C_C_BK048R_black", "179023_06C_C_BK048R_black", "179023_06C_C_BK049U_black", "179023_06C_C_BK049U_black", "179024_04B_C_BK027U_black", "179024_04B_C_BK027U_black", "179024_04B_U_BK060C_black", "179024_04B_U_BK060C_black", "179024_04B_U_BK067C_black", "179024_04B_U_BK067C_black", "179024_B2B_C_BK054C_black", "179024_B2B_C_BK054C_black", "179024_B2B_U_BK128S_black_02", "179024_B2B_U_BK128S_black_02", "179024_B2B_U_BK129R_black", "179024_B2B_U_BK129R_black", "179027_09D_C_BK063R_black", "179027_09D_C_BK063R_black", "179027_09D_O_BK010N_black", "179027_09D_O_BK010N_black", "179027_09D_U_BK163S_black", "179027_09D_U_BK163S_black", "179027_09D_U_BK163S_black", "179029_06C_C_BK045U_black", "179029_06C_C_BK045U_black", "179029_B3C_C_BK071N_black", "179029_B3C_C_BK071N_black", "179029_B3C_U_BK184N_black", "179029_B3C_U_BK184N_black", "179029_B3C_U_BK184N_black", "179029_B3C_U_BK185N_black", "179029_B3C_U_BK185N_black", "179030_11E_U_BK194S_2_black", "179030_11E_U_BK194S_2_black", "179030_11E_U_BK194S_2_black", "179901_B2B_C_BK005P_black"]
    await Promise.all([...blackT3, ...whiteSpeed].map(loadPrototype))
    let ctx = TMP_CTX
    // const pairs = TipFn.getSelection(createTipByEntitySearch(ctx, EffectFn.createEmptyPlayCard(PlayerA, "PlayerA_8"), {
    //     atBa: true,
    //     side: "敵軍",
    //     is: ["ユニット"],
    //     max: 50,
    //     asMuchAsPossible: true,
    // }, {})) as StrBaSyouPair[]
    // for (const pair of pairs) {
    //     ctx = doItemDamage(ctx, EffectFn.createEmptyPlayCard(PlayerA, "PlayerA_8"), 2, pair) as GameStateWithFlowMemory
    // }
    //console.log(pairs)

    ctx = updateCommand(ctx) as GameStateWithFlowMemory
    console.log(getPlayerCommandsFilterNoErrorDistinct(ctx, PlayerA))

    //"PlayerA_8"
    throw new Error()

}

const TMP_CTX: GameStateWithFlowMemory = {
    "isGameState": true,
    "cards": {
        "PlayerA_0": {
            "id": "PlayerA_0",
            "protoID": "179003_01A_C_GN003R_green",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_1": {
            "id": "PlayerA_1",
            "protoID": "179003_01A_CH_GN001R_green",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_2": {
            "id": "PlayerA_2",
            "protoID": "179003_01A_U_GN001R_green",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_3": {
            "id": "PlayerA_3",
            "protoID": "179003_01A_U_GN001R_green",
            "ownerID": "PlayerA",
            "isFaceDown": false,
            "isRoll": false
        },
        "PlayerA_4": {
            "id": "PlayerA_4",
            "protoID": "179003_01A_U_GN001R_green",
            "ownerID": "PlayerA",
            "isFaceDown": false,
            "isRoll": false
        },
        "PlayerA_5": {
            "id": "PlayerA_5",
            "protoID": "179003_01A_U_GN008R_green_02",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_6": {
            "id": "PlayerA_6",
            "protoID": "179003_01A_U_GN008R_green_02",
            "ownerID": "PlayerA",
            "isFaceDown": false,
            "isRoll": false
        },
        "PlayerA_7": {
            "id": "PlayerA_7",
            "protoID": "179019_02A_U_GN024U_green",
            "ownerID": "PlayerA",
            "isFaceDown": false,
            "isRoll": false
        },
        "PlayerA_8": {
            "id": "PlayerA_8",
            "protoID": "179007_02A_U_GN020R_green",
            "ownerID": "PlayerA",
            "isFaceDown": false,
            "isRoll": false
        },
        "PlayerA_9": {
            "id": "PlayerA_9",
            "protoID": "179009_03B_U_GN036U_green",
            "ownerID": "PlayerA",
            "isFaceDown": false,
            "isRoll": false
        },
        "PlayerA_10": {
            "id": "PlayerA_10",
            "protoID": "179009_03B_U_GN036U_green",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_11": {
            "id": "PlayerA_11",
            "protoID": "179009_03B_U_GN036U_green",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_12": {
            "id": "PlayerA_12",
            "protoID": "179009_03B_U_GN037C_green",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_13": {
            "id": "PlayerA_13",
            "protoID": "179009_03B_U_GN037C_green",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_14": {
            "id": "PlayerA_14",
            "protoID": "179009_03B_U_GN037C_green",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_15": {
            "id": "PlayerA_15",
            "protoID": "179009_03B_U_GN042R_green",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_16": {
            "id": "PlayerA_16",
            "protoID": "179009_03B_U_GN042R_green",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_17": {
            "id": "PlayerA_17",
            "protoID": "179009_03B_U_GN042R_green",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_18": {
            "id": "PlayerA_18",
            "protoID": "179015_04B_CH_GN030R_green",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_19": {
            "id": "PlayerA_19",
            "protoID": "179015_04B_U_GN053U_green",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_20": {
            "id": "PlayerA_20",
            "protoID": "179015_04B_U_GN055R_green_haku",
            "ownerID": "PlayerA",
            "isFaceDown": false,
            "isRoll": true
        },
        "PlayerA_21": {
            "id": "PlayerA_21",
            "protoID": "179015_04B_U_GN055R_green_haku",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_22": {
            "id": "PlayerA_22",
            "protoID": "179016_04B_CH_GN035R_green",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_23": {
            "id": "PlayerA_23",
            "protoID": "179016_04B_CH_GN036C_green",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_24": {
            "id": "PlayerA_24",
            "protoID": "179016_04B_CH_GN036C_green",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_25": {
            "id": "PlayerA_25",
            "protoID": "179018_05C_U_GN082U_green",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_26": {
            "id": "PlayerA_26",
            "protoID": "179019_02A_U_GN024U_green",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_27": {
            "id": "PlayerA_27",
            "protoID": "179003_01A_U_GN008R_green_02",
            "ownerID": "PlayerA",
            "isFaceDown": false,
            "isRoll": false
        },
        "PlayerA_28": {
            "id": "PlayerA_28",
            "protoID": "179019_02A_U_GN024U_green",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_29": {
            "id": "PlayerA_29",
            "protoID": "179024_B2B_C_GN052C_green",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_30": {
            "id": "PlayerA_30",
            "protoID": "179025_07D_C_GN056U_green",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_31": {
            "id": "PlayerA_31",
            "protoID": "179025_07D_CH_GN070C_green",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_32": {
            "id": "PlayerA_32",
            "protoID": "179029_05C_U_GN077R_green",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_33": {
            "id": "PlayerA_33",
            "protoID": "179030_11E_C_GN074R_green",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_34": {
            "id": "PlayerA_34",
            "protoID": "179030_11E_CH_GN093N_green",
            "ownerID": "PlayerA",
            "isFaceDown": false,
            "isRoll": false
        },
        "PlayerA_35": {
            "id": "PlayerA_35",
            "protoID": "179030_11E_CH_GN094R_green",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_36": {
            "id": "PlayerA_36",
            "protoID": "179030_11E_U_GN184N_green",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_37": {
            "id": "PlayerA_37",
            "protoID": "179030_11E_U_GN184N_green",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_38": {
            "id": "PlayerA_38",
            "protoID": "179030_11E_U_GN184N_green",
            "ownerID": "PlayerA",
            "isFaceDown": false,
            "isRoll": false
        },
        "PlayerA_39": {
            "id": "PlayerA_39",
            "protoID": "179031_12E_CH_GN096R_green",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_40": {
            "id": "PlayerA_40",
            "protoID": "179901_00_C_GN007P_green",
            "ownerID": "PlayerA",
            "isFaceDown": false,
            "isRoll": false
        },
        "PlayerA_41": {
            "id": "PlayerA_41",
            "protoID": "179901_00_C_GN007P_green",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_42": {
            "id": "PlayerA_42",
            "protoID": "179901_00_C_GN007P_green",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_43": {
            "id": "PlayerA_43",
            "protoID": "179901_00_U_GN001P_green_02",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_44": {
            "id": "PlayerA_44",
            "protoID": "179901_00_U_GN002P_green_02",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_45": {
            "id": "PlayerA_45",
            "protoID": "179901_CG_CH_GN001P_green",
            "ownerID": "PlayerA",
            "isFaceDown": false,
            "isRoll": false
        },
        "PlayerA_46": {
            "id": "PlayerA_46",
            "protoID": "179901_CG_U_GN003P_green",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_47": {
            "id": "PlayerA_47",
            "protoID": "179901_CG_U_GN003P_green",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_48": {
            "id": "PlayerA_48",
            "protoID": "179901_CG_U_GN008P_green",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_49": {
            "id": "PlayerA_49",
            "protoID": "179901_CG_U_GN008P_green",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerB_50": {
            "id": "PlayerB_50",
            "protoID": "179001_01A_CH_WT007R_white",
            "ownerID": "PlayerB",
            "isFaceDown": false,
            "isRoll": false
        },
        "PlayerB_51": {
            "id": "PlayerB_51",
            "protoID": "179004_01A_CH_WT009R_white",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "PlayerB_52": {
            "id": "PlayerB_52",
            "protoID": "179004_01A_CH_WT010C_white",
            "ownerID": "PlayerB",
            "isFaceDown": true,
            "isRoll": false
        },
        "PlayerB_53": {
            "id": "PlayerB_53",
            "protoID": "179007_02A_U_WT027U_white",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "PlayerB_54": {
            "id": "PlayerB_54",
            "protoID": "179007_02A_U_WT027U_white",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "PlayerB_55": {
            "id": "PlayerB_55",
            "protoID": "179008_02A_U_WT034U_white",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "PlayerB_56": {
            "id": "PlayerB_56",
            "protoID": "179016_04B_U_WT075C_white",
            "ownerID": "PlayerB",
            "isFaceDown": false,
            "isRoll": false
        },
        "PlayerB_57": {
            "id": "PlayerB_57",
            "protoID": "179008_02A_U_WT034U_white",
            "ownerID": "PlayerB",
            "isFaceDown": false,
            "isRoll": true
        },
        "PlayerB_58": {
            "id": "PlayerB_58",
            "protoID": "179014_03B_CH_WT027R_white",
            "ownerID": "PlayerB",
            "isFaceDown": true,
            "isRoll": false
        },
        "PlayerB_59": {
            "id": "PlayerB_59",
            "protoID": "179015_04B_U_WT067C_white",
            "ownerID": "PlayerB",
            "isFaceDown": true,
            "isRoll": false
        },
        "PlayerB_60": {
            "id": "PlayerB_60",
            "protoID": "179015_04B_U_WT067C_white",
            "ownerID": "PlayerB",
            "isFaceDown": true,
            "isRoll": false
        },
        "PlayerB_61": {
            "id": "PlayerB_61",
            "protoID": "179015_04B_U_WT067C_white",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "PlayerB_62": {
            "id": "PlayerB_62",
            "protoID": "179016_04B_U_WT074C_white",
            "ownerID": "PlayerB",
            "isFaceDown": false,
            "isRoll": false
        },
        "PlayerB_63": {
            "id": "PlayerB_63",
            "protoID": "179016_04B_U_WT074C_white",
            "ownerID": "PlayerB",
            "isFaceDown": false,
            "isRoll": false
        },
        "PlayerB_64": {
            "id": "PlayerB_64",
            "protoID": "179016_04B_U_WT074C_white",
            "ownerID": "PlayerB",
            "isFaceDown": false,
            "isRoll": false
        },
        "PlayerB_65": {
            "id": "PlayerB_65",
            "protoID": "179008_02A_U_WT034U_white",
            "ownerID": "PlayerB",
            "isFaceDown": false,
            "isRoll": false
        },
        "PlayerB_66": {
            "id": "PlayerB_66",
            "protoID": "179016_04B_U_WT075C_white",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "PlayerB_67": {
            "id": "PlayerB_67",
            "protoID": "179022_06C_U_WT113R_white",
            "ownerID": "PlayerB",
            "isFaceDown": false,
            "isRoll": false
        },
        "PlayerB_68": {
            "id": "PlayerB_68",
            "protoID": "179019_01A_C_WT010C_white",
            "ownerID": "PlayerB",
            "isFaceDown": false,
            "isRoll": false
        },
        "PlayerB_69": {
            "id": "PlayerB_69",
            "protoID": "179019_01A_C_WT010C_white",
            "ownerID": "PlayerB",
            "isFaceDown": true,
            "isRoll": false
        },
        "PlayerB_70": {
            "id": "PlayerB_70",
            "protoID": "179019_02A_U_WT028R_white",
            "ownerID": "PlayerB",
            "isFaceDown": true,
            "isRoll": false
        },
        "PlayerB_71": {
            "id": "PlayerB_71",
            "protoID": "179019_02A_U_WT028R_white",
            "ownerID": "PlayerB",
            "isFaceDown": true,
            "isRoll": false
        },
        "PlayerB_72": {
            "id": "PlayerB_72",
            "protoID": "179022_06C_CH_WT057R_white",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "PlayerB_73": {
            "id": "PlayerB_73",
            "protoID": "179022_06C_CH_WT057R_white",
            "ownerID": "PlayerB",
            "isFaceDown": true,
            "isRoll": false
        },
        "PlayerB_74": {
            "id": "PlayerB_74",
            "protoID": "179022_06C_CH_WT057R_white",
            "ownerID": "PlayerB",
            "isFaceDown": true,
            "isRoll": false
        },
        "PlayerB_75": {
            "id": "PlayerB_75",
            "protoID": "179022_06C_U_WT113R_white",
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
            "protoID": "179022_06C_U_WT113R_white",
            "ownerID": "PlayerB",
            "isFaceDown": false,
            "isRoll": false
        },
        "PlayerB_78": {
            "id": "PlayerB_78",
            "protoID": "179023_06C_CH_WT067C_white",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "PlayerB_79": {
            "id": "PlayerB_79",
            "protoID": "179024_03B_U_WT057U_white",
            "ownerID": "PlayerB",
            "isFaceDown": false,
            "isRoll": false
        },
        "PlayerB_80": {
            "id": "PlayerB_80",
            "protoID": "179024_03B_U_WT057U_white",
            "ownerID": "PlayerB",
            "isFaceDown": true,
            "isRoll": false
        },
        "PlayerB_81": {
            "id": "PlayerB_81",
            "protoID": "179025_07D_C_WT060U_white",
            "ownerID": "PlayerB",
            "isFaceDown": true,
            "isRoll": false
        },
        "PlayerB_82": {
            "id": "PlayerB_82",
            "protoID": "179025_07D_CH_WT075C_white",
            "ownerID": "PlayerB",
            "isFaceDown": true,
            "isRoll": false
        },
        "PlayerB_83": {
            "id": "PlayerB_83",
            "protoID": "179025_07D_CH_WT075C_white",
            "ownerID": "PlayerB",
            "isFaceDown": false,
            "isRoll": false
        },
        "PlayerB_84": {
            "id": "PlayerB_84",
            "protoID": "179025_07D_CH_WT075C_white",
            "ownerID": "PlayerB",
            "isFaceDown": true,
            "isRoll": false
        },
        "PlayerB_85": {
            "id": "PlayerB_85",
            "protoID": "179027_09D_C_WT067R_white",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "PlayerB_86": {
            "id": "PlayerB_86",
            "protoID": "179027_09D_C_WT067R_white",
            "ownerID": "PlayerB",
            "isFaceDown": false,
            "isRoll": false
        },
        "PlayerB_87": {
            "id": "PlayerB_87",
            "protoID": "179029_B3C_CH_WT102R_white",
            "ownerID": "PlayerB",
            "isFaceDown": true,
            "isRoll": false
        },
        "PlayerB_88": {
            "id": "PlayerB_88",
            "protoID": "179029_B3C_CH_WT103N_white",
            "ownerID": "PlayerB",
            "isFaceDown": true,
            "isRoll": false
        },
        "PlayerB_89": {
            "id": "PlayerB_89",
            "protoID": "179029_B3C_U_WT196R_white",
            "ownerID": "PlayerB",
            "isFaceDown": false,
            "isRoll": false
        },
        "PlayerB_90": {
            "id": "PlayerB_90",
            "protoID": "179030_11E_C_WT077S_white",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "PlayerB_91": {
            "id": "PlayerB_91",
            "protoID": "179030_11E_C_WT077S_white",
            "ownerID": "PlayerB",
            "isFaceDown": true,
            "isRoll": false
        },
        "PlayerB_92": {
            "id": "PlayerB_92",
            "protoID": "179030_11E_C_WT077S_white",
            "ownerID": "PlayerB",
            "isFaceDown": false,
            "isRoll": false
        },
        "PlayerB_93": {
            "id": "PlayerB_93",
            "protoID": "179030_11E_CH_WT108N_white",
            "ownerID": "PlayerB",
            "isFaceDown": true,
            "isRoll": false
        },
        "PlayerB_94": {
            "id": "PlayerB_94",
            "protoID": "179901_00_C_WT003P_white",
            "ownerID": "PlayerB",
            "isFaceDown": true,
            "isRoll": false
        },
        "PlayerB_95": {
            "id": "PlayerB_95",
            "protoID": "179901_00_C_WT003P_white",
            "ownerID": "PlayerB",
            "isFaceDown": true,
            "isRoll": false
        },
        "PlayerB_96": {
            "id": "PlayerB_96",
            "protoID": "179901_00_C_WT003P_white",
            "ownerID": "PlayerB",
            "isFaceDown": true,
            "isRoll": false
        },
        "PlayerB_97": {
            "id": "PlayerB_97",
            "protoID": "179901_CG_C_WT001P_white",
            "ownerID": "PlayerB",
            "isFaceDown": false,
            "isRoll": false
        },
        "PlayerB_98": {
            "id": "PlayerB_98",
            "protoID": "179901_CG_C_WT001P_white",
            "ownerID": "PlayerB",
            "isFaceDown": true,
            "isRoll": false
        },
        "PlayerB_99": {
            "id": "PlayerB_99",
            "protoID": "179901_CG_CH_WT002P_white",
            "ownerID": "PlayerB",
            "isFaceDown": true,
            "isRoll": false
        }
    },
    "effects": {
        "createPlayEffects_PlayerA_PlayerA_27_loadPrototype_179003_01A_U_GN008R_green_02_text_0": {
            "id": "createPlayEffects_PlayerA_PlayerA_27_loadPrototype_179003_01A_U_GN008R_green_02_text_0",
            "reason": [
                "PlayText",
                "PlayerA",
                "PlayerA_27",
                "loadPrototype_179003_01A_U_GN008R_green_02_text_0"
            ],
            "description": "和這張卡交戰的防禦力x以下的敵軍機體1張破壞",
            "text": {
                "id": "loadPrototype_179003_01A_U_GN008R_green_02_text_0",
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
                    "這張卡交戰的防禦力x以下的敵軍機體1張": {
                        "title": [
                            "Entity",
                            {
                                "atBa": true,
                                "isBattleWithThis": true,
                                "compareBattlePoint": [
                                    "防御力",
                                    "<=",
                                    4
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
                        "logicTree": {
                            "type": "And",
                            "children": [
                                {
                                    "type": "Leaf",
                                    "value": "同回合上限"
                                },
                                {
                                    "type": "Leaf",
                                    "value": "橫置支付0[null]"
                                },
                                {
                                    "type": "Leaf",
                                    "value": "橫置支付1[null]"
                                },
                                {
                                    "type": "Leaf",
                                    "value": "這張卡交戰的防禦力x以下的敵軍機體1張"
                                }
                            ]
                        },
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
        "createPlayEffects_PlayerA_PlayerA_27_loadPrototype_179003_01A_U_GN008R_green_02_text_1": {
            "id": "createPlayEffects_PlayerA_PlayerA_27_loadPrototype_179003_01A_U_GN008R_green_02_text_1",
            "reason": [
                "PlayText",
                "PlayerA",
                "PlayerA_27",
                "loadPrototype_179003_01A_U_GN008R_green_02_text_1"
            ],
            "description": "這張卡在戰區的場合, 打開自軍本國上的1張卡和這張卡同GsignProperty的情況, 這張卡回合結束前+x/+x/+x, x為打開的卡的横置費用數量, 這個效果1回合只能用1次",
            "text": {
                "id": "loadPrototype_179003_01A_U_GN008R_green_02_text_1",
                "title": [
                    "使用型",
                    [
                        "ダメージ判定ステップ"
                    ]
                ],
                "description": "這張卡在戰區的場合, 打開自軍本國上的1張卡和這張卡同GsignProperty的情況, 這張卡回合結束前+x/+x/+x, x為打開的卡的横置費用數量, 這個效果1回合只能用1次",
                "testEnvs": [
                    {
                        "createCards": [
                            [
                                "自軍",
                                "戦闘エリア1",
                                [
                                    [
                                        "unitHasGain",
                                        1
                                    ]
                                ]
                            ],
                            [
                                "自軍",
                                "本国",
                                [
                                    [
                                        "unitHasGain",
                                        1
                                    ]
                                ]
                            ]
                        ]
                    }
                ],
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
                    "這個效果1回合只能用1次": {
                        "actions": [
                            {
                                "title": [
                                    "この記述の効果は、プレイヤー毎に１ターンに１回まで解決できる"
                                ]
                            }
                        ]
                    },
                    "這張卡在戰區的場合": {
                        "actions": [
                            {
                                "title": [
                                    "Entity",
                                    {
                                        "isThisCard": true,
                                        "at": [
                                            "戦闘エリア1",
                                            "戦闘エリア2"
                                        ],
                                        "count": 1
                                    }
                                ]
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
                        "logicTree": {
                            "type": "And",
                            "children": [
                                {
                                    "type": "Leaf",
                                    "value": "同回合上限"
                                },
                                {
                                    "type": "Leaf",
                                    "value": "橫置支付0[null]"
                                },
                                {
                                    "type": "Leaf",
                                    "value": "這個效果1回合只能用1次"
                                },
                                {
                                    "type": "Leaf",
                                    "value": "這張卡在戰區的場合"
                                }
                            ]
                        },
                        "actions": [
                            {
                                "title": [
                                    "cutIn",
                                    [
                                        {
                                            "title": "function _(ctx2, effect, { GameStateFn, DefineFn }) {\n                        const newE = DefineFn.EffectFn.fromEffectBasic(effect, {\n                          conditions: {\n                            \"\\u9019\\u5F35\\u5361\\u5728\\u6230\\u5340\\u7684\\u5834\\u5408, \\u6253\\u958B\\u81EA\\u8ECD\\u672C\\u570B\\u4E0A\\u76841\\u5F35\\u5361\": {\n                              title: [\"Entity\", {\n                                see: [DefineFn.RelatedBaSyouFn.of(\"\\u81EA\\u8ECD\", \"\\u672C\\u56FD\"), 1, 1],\n                                count: 1\n                              }],\n                              actions: [\n                                {\n                                  title: [\"_\\u30ED\\u30FC\\u30EB\\u3059\\u308B\", \"\\u898B\"],\n                                  vars: [\"\\u9019\\u5F35\\u5361\\u5728\\u6230\\u5340\\u7684\\u5834\\u5408, \\u6253\\u958B\\u81EA\\u8ECD\\u672C\\u570B\\u4E0A\\u76841\\u5F35\\u5361\"]\n                                }\n                              ]\n                            },\n                            \"\\u9019\\u5F35\\u5361\\u5728\\u6230\\u5340\\u7684\\u5834\\u5408\": {\n                              actions: [\n                                {\n                                  title: [\"Entity\", {\n                                    isThisCard: !0,\n                                    at: [\"\\u6226\\u95D8\\u30A8\\u30EA\\u30A21\", \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A22\"],\n                                    count: 1\n                                  }]\n                                }\n                              ]\n                            }\n                          },\n                          logicTreeAction: {\n                            actions: [\n                              {\n                                title: function _(ctx3, effect2, { GameStateFn: GameStateFn2, DefineFn: DefineFn2, ToolFn: ToolFn2, Options }) {\n                                  const cardId = DefineFn2.EffectFn.getCardID(effect2), pairs = GameStateFn2.getCardTipStrBaSyouPairs(ctx3, \"\\u9019\\u5F35\\u5361\\u5728\\u6230\\u5340\\u7684\\u5834\\u5408, \\u6253\\u958B\\u81EA\\u8ECD\\u672C\\u570B\\u4E0A\\u76841\\u5F35\\u5361\", cardId);\n                                  if (pairs.length == 0)\n                                    throw new Error(`pairs must not 0: ${effect2.text.description}`);\n                                  const [openCardId] = pairs[0];\n                                  if (GameStateFn2.getCardGSignProperty(ctx3, openCardId) == GameStateFn2.getCardGSignProperty(ctx3, cardId) == !1)\n                                    return console.warn(\"\\u4E0D\\u540C\\u7684GSignProperty\\uFF0C\\u7121\\u6CD5\\u5F97\\u5230\\u7D05\\u5229\"), ctx3;\n                                  const ges = Options.ges, bonus = GameStateFn2.getCardRollCostLength(ctx3, openCardId), gainBonus = [bonus, bonus, bonus];\n                                  ctx3 = GameStateFn2.doTriggerEvent(ctx3, { title: [\"\\u300C\\u30B2\\u30A4\\u30F3\\u300D\\u306E\\u52B9\\u679C\\u3067\\u6226\\u95D8\\u4FEE\\u6B63\\u3092\\u5F97\\u308B\\u5834\\u5408\", gainBonus], cardIds: [cardId] });\n                                  const hasCase1 = GameStateFn2.getCardTexts(ctx3, cardId, { ges }).find((text2) => text2.description == \"\\u300E\\u8D77\\u52D5\\u300F\\uFF1A\\u3053\\u306E\\u30AB\\u30FC\\u30C9\\u306F\\u3001\\u300C\\u30B2\\u30A4\\u30F3\\u300D\\u306E\\u52B9\\u679C\\u3067\\u6226\\u95D8\\u4FEE\\u6B63\\u3092\\u5F97\\u308B\\u5834\\u5408\\u3001\\u305D\\u306E\\u6226\\u95D8\\u4FEE\\u6B63\\u306E\\u4EE3\\u308F\\u308A\\u306B\\u3001\\u30BF\\u30FC\\u30F3\\u7D42\\u4E86\\u6642\\u307E\\u3067\\uFF0B\\uFF14\\uFF0F\\xB1\\uFF10\\uFF0F\\xB1\\uFF10\\u3092\\u5F97\\u308B\\u4E8B\\u304C\\u3067\\u304D\\u308B\\u3002\") != null, hasCase2 = GameStateFn2.getCardTexts(ctx3, cardId, { ges }).find((text2) => text2.description == \"\\u300E\\u8D77\\u52D5\\u300F\\uFF1A\\u3053\\u306E\\u30AB\\u30FC\\u30C9\\u306F\\u3001\\u300C\\u30B2\\u30A4\\u30F3\\u300D\\u306E\\u52B9\\u679C\\u3067\\u6226\\u95D8\\u4FEE\\u6B63\\u3092\\u5F97\\u308B\\u5834\\u5408\\u3001\\u305D\\u306E\\u6226\\u95D8\\u4FEE\\u6B63\\u3092\\u5F97\\u308B\\u4EE3\\u308F\\u308A\\u306B\\u3001\\u30BF\\u30FC\\u30F3\\u7D42\\u4E86\\u6642\\u307E\\u3067\\u3001\\u300C\\u901F\\u653B\\u300D\\u3092\\u5F97\\u308B\\u4E8B\\u304C\\u3067\\u304D\\u308B\\u3002\") != null;\n                                  if (hasCase1)\n                                    ctx3 = GameStateFn2.doItemSetGlobalEffectsUntilEndOfTurn(ctx3, [{ title: [\"\\uFF0Bx\\uFF0F\\uFF0Bx\\uFF0F\\uFF0Bx\\u3092\\u5F97\\u308B\", [4, 0, 0]], cardIds: [cardId] }], GameStateFn2.createStrBaSyouPair(ctx3, cardId));\n                                  else if (hasCase2)\n                                    ctx3 = GameStateFn2.doItemSetGlobalEffectsUntilEndOfTurn(ctx3, [{ title: [\"AddText\", { id: ToolFn2.getUUID(\"hasCase2\"), title: [\"\\u7279\\u6B8A\\u578B\", [\"\\u901F\\u653B\"]] }], cardIds: [cardId] }], GameStateFn2.createStrBaSyouPair(ctx3, cardId));\n                                  else\n                                    ctx3 = GameStateFn2.mapItemState(ctx3, cardId, (is) => DefineFn2.ItemStateFn.setGlobalEffect(is, null, {\n                                      title: [\"\\uFF0Bx\\uFF0F\\uFF0Bx\\uFF0F\\uFF0Bx\\u3092\\u5F97\\u308B\", gainBonus],\n                                      cardIds: [cardId]\n                                    }, { isRemoveOnTurnEnd: !0 })), ctx3 = GameStateFn2.doTriggerEvent(ctx3, { title: [\"\\u300C\\u30B2\\u30A4\\u30F3\\u300D\\u306E\\u52B9\\u679C\\u3067\\u6226\\u95D8\\u4FEE\\u6B63\\u3092\\u5F97\\u305F\\u5834\\u5408\", gainBonus], cardIds: [cardId] });\n                                  return ctx3;\n                                }.toString()\n                              }\n                            ]\n                          }\n                        });\n                        return ctx2 = GameStateFn.addImmediateEffect(ctx2, newE), ctx2;\n                      }"
                                        }
                                    ]
                                ]
                            }
                        ]
                    }
                ]
            }
        },
        "createPlayEffects_PlayerA_PlayerA_27_loadPrototype_179003_01A_U_GN008R_green_02_text_2": {
            "id": "createPlayEffects_PlayerA_PlayerA_27_loadPrototype_179003_01A_U_GN008R_green_02_text_2",
            "reason": [
                "PlayText",
                "PlayerA",
                "PlayerA_27",
                "loadPrototype_179003_01A_U_GN008R_green_02_text_2"
            ],
            "description": "打開自軍手裡或指定HANGER中特徵A並合計國力x以下的1張卡, 和這張卡重置狀態置換, 這張卡置換後廢棄. x為自軍G的張數",
            "text": {
                "id": "loadPrototype_179003_01A_U_GN008R_green_02_text_2",
                "title": [
                    "使用型",
                    [
                        "戦闘フェイズ"
                    ]
                ],
                "description": "打開自軍手裡或指定HANGER中特徵A並合計國力x以下的1張卡, 和這張卡重置狀態置換, 這張卡置換後廢棄. x為自軍G的張數",
                "conditions": {
                    "打開自軍手裡或指定HANGER中特徵A並合計國力x以下的1張卡": {
                        "title": "function _(ctx2, effect, bridge) {\n                const { A: A2 } = {\"A\":\"アプサラス系\"};\n                if (A2 == \"\")\n                  throw new Error(\"A\\u6C92\\u6709\\u88AB\\u5B57\\u4E32\\u7F6E\\u63DB\");\n                const { GameStateFn, DefineFn } = bridge, cardId = DefineFn.EffectFn.getCardID(effect), cardController = GameStateFn.getItemController(ctx2, cardId), gCount = GameStateFn.getItemIdsByBasyou(ctx2, DefineFn.AbsoluteBaSyouFn.of(cardController, \"G\\u30BE\\u30FC\\u30F3\")).length;\n                return GameStateFn.createConditionTitleFn({\n                  title: [\"\\u6253\\u958B\\u81EA\\u8ECD\\u624B\\u88E1\\u6216\\u6307\\u5B9AHANGER\\u4E2D\\u7279\\u5FB5_A\\u4E26\\u5408\\u8A08\\u570B\\u529B_x\\u4EE5\\u4E0B\\u7684_1\\u5F35\\u5361\", A2, gCount, 1]\n                })(ctx2, effect, bridge);\n              }"
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
                        "logicTree": {
                            "type": "And",
                            "children": [
                                {
                                    "type": "Leaf",
                                    "value": "同回合上限"
                                },
                                {
                                    "type": "Leaf",
                                    "value": "打開自軍手裡或指定HANGER中特徵A並合計國力x以下的1張卡"
                                }
                            ]
                        },
                        "actions": [
                            {
                                "title": "function _(ctx2, effect, { GameStateFn, DefineFn }) {\n                    const newE = DefineFn.EffectFn.fromEffectBasic(effect, {\n                      logicTreeAction: {\n                        actions: [\n                          {\n                            title: function _(ctx3, effect2, { GameStateFn: GameStateFn2, DefineFn: DefineFn2 }) {\n                              const cardId = DefineFn2.EffectFn.getCardID(effect2), basyou = GameStateFn2.getItemBaSyou(ctx3, cardId), pairs = GameStateFn2.getCardTipStrBaSyouPairs(ctx3, \"\\u6253\\u958B\\u81EA\\u8ECD\\u624B\\u88E1\\u6216\\u6307\\u5B9AHANGER\\u4E2D\\u7279\\u5FB5A\\u4E26\\u5408\\u8A08\\u570B\\u529Bx\\u4EE5\\u4E0B\\u76841\\u5F35\\u5361\", cardId);\n                              if (pairs.length == 0)\n                                throw new Error(`pairs must not 0: ${effect2.text.description}`);\n                              const targetPair = pairs[0], ges = GameStateFn2.getGlobalEffects(ctx3, null);\n                              return ctx3 = GameStateFn2.setGlobalEffects(ctx3, null, ges), GameStateFn2.assertTargetMissingError(ctx3, targetPair), ctx3 = GameStateFn2.doItemSwap(ctx3, [cardId, basyou], targetPair), ctx3 = GameStateFn2.doItemSetRollState(ctx3, !1, [cardId, basyou], { isSkipTargetMissing: !0 }), ctx3 = GameStateFn2.doItemMove(ctx3, DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(basyou, \"\\u30B8\\u30E3\\u30F3\\u30AF\\u30E4\\u30FC\\u30C9\"), targetPair, { ges }), ctx3 = GameStateFn2.doTriggerEvent(ctx3, { title: [\"\\u300C\\u6539\\u88C5\\u300D\\u306E\\u52B9\\u679C\\u3067\\u5EC3\\u68C4\\u3055\\u308C\\u308B\\u5834\\u5408\"], cardIds: [targetPair[0]] }), ctx3 = GameStateFn2.doTriggerEvent(ctx3, { title: [\"\\u300C\\u6539\\u88C5\\u300D\\u306E\\u52B9\\u679C\\u3067\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId] }), ctx3;\n                            }.toString()\n                          }\n                        ]\n                      }\n                    });\n                    return ctx2 = GameStateFn.addStackEffect(ctx2, newE), ctx2;\n                  }"
                            }
                        ]
                    }
                ]
            }
        },
        "createPlayEffects_PlayerA_PlayerA_45_loadPrototype_179901_CG_CH_GN001P_green_text_0": {
            "id": "createPlayEffects_PlayerA_PlayerA_45_loadPrototype_179901_CG_CH_GN001P_green_text_0",
            "reason": [
                "PlayText",
                "PlayerA",
                "PlayerA_45",
                "loadPrototype_179901_CG_CH_GN001P_green_text_0"
            ],
            "description": "（戦闘フェイズ）〔２〕：このセットグループのユニットは、ターン終了時まで「速攻」を得る。",
            "text": {
                "id": "loadPrototype_179901_CG_CH_GN001P_green_text_0",
                "description": "（戦闘フェイズ）〔２〕：このセットグループのユニットは、ターン終了時まで「速攻」を得る。",
                "title": [
                    "使用型",
                    [
                        "戦闘フェイズ"
                    ]
                ],
                "testEnvs": [
                    {
                        "addCards": [
                            [
                                "自軍",
                                "配備エリア",
                                [
                                    {
                                        "id": "this",
                                        "protoID": "179901_CG_CH_GN001P_green"
                                    },
                                    {
                                        "id": "unit",
                                        "protoID": "unit"
                                    }
                                ]
                            ]
                        ],
                        "setGroupParent": {
                            "this": "unit"
                        },
                        "createCards": [
                            [
                                "自軍",
                                "Gゾーン",
                                [
                                    [
                                        "unit",
                                        2
                                    ]
                                ]
                            ]
                        ]
                    }
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
                    "このセットグループのユニット": {
                        "title": [
                            "このセットグループの_ユニットは",
                            "ユニット"
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
                        "logicTree": {
                            "type": "And",
                            "children": [
                                {
                                    "type": "Leaf",
                                    "value": "同回合上限"
                                },
                                {
                                    "type": "Leaf",
                                    "value": "0[null]"
                                },
                                {
                                    "type": "Leaf",
                                    "value": "1[null]"
                                },
                                {
                                    "type": "Leaf",
                                    "value": "このセットグループのユニット"
                                }
                            ]
                        },
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
                                                                        "速攻"
                                                                    ]
                                                                ]
                                                            }
                                                        ],
                                                        "cardIds": []
                                                    }
                                                ]
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
        "createPlayEffects_PlayerB_PlayerB_65_loadPrototype_179008_02A_U_WT034U_white_text_1": {
            "id": "createPlayEffects_PlayerB_PlayerB_65_loadPrototype_179008_02A_U_WT034U_white_text_1",
            "reason": [
                "PlayText",
                "PlayerB",
                "PlayerB_65",
                "loadPrototype_179008_02A_U_WT034U_white_text_1"
            ],
            "description": "打開自軍手裡或指定HANGER中特徵A並合計國力x以下的1張卡, 和這張卡重置狀態置換, 這張卡置換後廢棄. x為自軍G的張數",
            "text": {
                "id": "loadPrototype_179008_02A_U_WT034U_white_text_1",
                "title": [
                    "使用型",
                    [
                        "戦闘フェイズ"
                    ]
                ],
                "description": "打開自軍手裡或指定HANGER中特徵A並合計國力x以下的1張卡, 和這張卡重置狀態置換, 這張卡置換後廢棄. x為自軍G的張數",
                "conditions": {
                    "打開自軍手裡或指定HANGER中特徵A並合計國力x以下的1張卡": {
                        "title": "function _(ctx2, effect, bridge) {\n                const { A: A2 } = {\"A\":\"ブルーフレーム系\"};\n                if (A2 == \"\")\n                  throw new Error(\"A\\u6C92\\u6709\\u88AB\\u5B57\\u4E32\\u7F6E\\u63DB\");\n                const { GameStateFn, DefineFn } = bridge, cardId = DefineFn.EffectFn.getCardID(effect), cardController = GameStateFn.getItemController(ctx2, cardId), gCount = GameStateFn.getItemIdsByBasyou(ctx2, DefineFn.AbsoluteBaSyouFn.of(cardController, \"G\\u30BE\\u30FC\\u30F3\")).length;\n                return GameStateFn.createConditionTitleFn({\n                  title: [\"\\u6253\\u958B\\u81EA\\u8ECD\\u624B\\u88E1\\u6216\\u6307\\u5B9AHANGER\\u4E2D\\u7279\\u5FB5_A\\u4E26\\u5408\\u8A08\\u570B\\u529B_x\\u4EE5\\u4E0B\\u7684_1\\u5F35\\u5361\", A2, gCount, 1]\n                })(ctx2, effect, bridge);\n              }"
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
                        "logicTree": {
                            "type": "And",
                            "children": [
                                {
                                    "type": "Leaf",
                                    "value": "同回合上限"
                                },
                                {
                                    "type": "Leaf",
                                    "value": "打開自軍手裡或指定HANGER中特徵A並合計國力x以下的1張卡"
                                }
                            ]
                        },
                        "actions": [
                            {
                                "title": "function _(ctx2, effect, { GameStateFn, DefineFn }) {\n                    const newE = DefineFn.EffectFn.fromEffectBasic(effect, {\n                      logicTreeAction: {\n                        actions: [\n                          {\n                            title: function _(ctx3, effect2, { GameStateFn: GameStateFn2, DefineFn: DefineFn2 }) {\n                              const cardId = DefineFn2.EffectFn.getCardID(effect2), basyou = GameStateFn2.getItemBaSyou(ctx3, cardId), pairs = GameStateFn2.getCardTipStrBaSyouPairs(ctx3, \"\\u6253\\u958B\\u81EA\\u8ECD\\u624B\\u88E1\\u6216\\u6307\\u5B9AHANGER\\u4E2D\\u7279\\u5FB5A\\u4E26\\u5408\\u8A08\\u570B\\u529Bx\\u4EE5\\u4E0B\\u76841\\u5F35\\u5361\", cardId);\n                              if (pairs.length == 0)\n                                throw new Error(`pairs must not 0: ${effect2.text.description}`);\n                              const targetPair = pairs[0], ges = GameStateFn2.getGlobalEffects(ctx3, null);\n                              return ctx3 = GameStateFn2.setGlobalEffects(ctx3, null, ges), GameStateFn2.assertTargetMissingError(ctx3, targetPair), ctx3 = GameStateFn2.doItemSwap(ctx3, [cardId, basyou], targetPair), ctx3 = GameStateFn2.doItemSetRollState(ctx3, !1, [cardId, basyou], { isSkipTargetMissing: !0 }), ctx3 = GameStateFn2.doItemMove(ctx3, DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(basyou, \"\\u30B8\\u30E3\\u30F3\\u30AF\\u30E4\\u30FC\\u30C9\"), targetPair, { ges }), ctx3 = GameStateFn2.doTriggerEvent(ctx3, { title: [\"\\u300C\\u6539\\u88C5\\u300D\\u306E\\u52B9\\u679C\\u3067\\u5EC3\\u68C4\\u3055\\u308C\\u308B\\u5834\\u5408\"], cardIds: [targetPair[0]] }), ctx3 = GameStateFn2.doTriggerEvent(ctx3, { title: [\"\\u300C\\u6539\\u88C5\\u300D\\u306E\\u52B9\\u679C\\u3067\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId] }), ctx3;\n                            }.toString()\n                          }\n                        ]\n                      }\n                    });\n                    return ctx2 = GameStateFn.addStackEffect(ctx2, newE), ctx2;\n                  }"
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
                "PlayerA_11",
                "PlayerA_17",
                "PlayerA_36",
                "PlayerA_23",
                "PlayerA_48",
                "PlayerA_33",
                "PlayerA_14",
                "PlayerA_10",
                "PlayerA_29",
                "PlayerA_19",
                "PlayerA_5",
                "PlayerA_43",
                "PlayerA_25",
                "PlayerA_15",
                "PlayerA_49",
                "PlayerA_18",
                "PlayerA_26",
                "PlayerA_0",
                "PlayerA_46",
                "PlayerA_42",
                "PlayerA_16",
                "PlayerA_32",
                "PlayerA_2",
                "PlayerA_47",
                "PlayerA_30",
                "PlayerA_13",
                "PlayerA_44",
                "PlayerA_41",
                "PlayerA_12",
                "PlayerA_22",
                "PlayerA_1",
                "PlayerA_39",
                "PlayerA_21",
                "PlayerA_24",
                "PlayerA_31",
                "PlayerA_28",
                "PlayerA_35",
                "PlayerA_37"
            ],
            "[\"PlayerB\",\"本国\"]": [
                "PlayerB_61",
                "PlayerB_51",
                "PlayerB_55",
                "PlayerB_78",
                "PlayerB_53",
                "PlayerB_66",
                "PlayerB_90",
                "PlayerB_85",
                "PlayerB_54",
                "PlayerB_75",
                "PlayerB_72"
            ],
            "[\"PlayerA\",\"手札\"]": [],
            "[\"PlayerB\",\"手札\"]": [
                "PlayerB_95"
            ],
            "[\"PlayerA\",\"Gゾーン\"]": [
                "PlayerA_20",
                "PlayerA_9",
                "PlayerA_6",
                "PlayerA_38",
                "PlayerA_4"
            ],
            "[\"PlayerB\",\"Gゾーン\"]": [
                "PlayerB_57",
                "PlayerB_64",
                "PlayerB_77",
                "PlayerB_50",
                "PlayerB_62",
                "PlayerB_79",
                "PlayerB_97"
            ],
            "[\"PlayerA\",\"プレイされているカード\"]": [],
            "[\"PlayerA\",\"配備エリア\"]": [],
            "[\"PlayerA\",\"戦闘エリア1\"]": [
                "PlayerA_8",
                "PlayerA_34"
            ],
            "[\"PlayerB\",\"捨て山\"]": [
                "PlayerB_52",
                "PlayerB_58",
                "PlayerB_94",
                "PlayerB_59",
                "PlayerB_71",
                "PlayerB_74",
                "PlayerB_82",
                "PlayerB_73",
                "PlayerB_93",
                "PlayerB_91",
                "PlayerB_96",
                "PlayerB_70",
                "PlayerB_98",
                "PlayerB_80",
                "PlayerB_60",
                "PlayerB_87",
                "PlayerB_81",
                "PlayerB_84",
                "PlayerB_88",
                "PlayerB_69",
                "PlayerB_99"
            ],
            "[\"PlayerB\",\"プレイされているカード\"]": [],
            "[\"PlayerB\",\"配備エリア\"]": [
                "PlayerB_83"
            ],
            "[\"PlayerA\",\"戦闘エリア2\"]": [
                "PlayerA_27",
                "PlayerA_45"
            ],
            "[\"PlayerA\",\"ジャンクヤード\"]": [
                "PlayerA_40",
                "PlayerA_7",
                "PlayerA_3"
            ],
            "[\"PlayerB\",\"ジャンクヤード\"]": [
                "PlayerB_92",
                "PlayerB_76",
                "PlayerB_67",
                "PlayerB_56",
                "PlayerB_86",
                "PlayerB_89",
                "PlayerB_68"
            ],
            "[\"PlayerB\",\"戦闘エリア1\"]": [
                "PlayerB_63"
            ],
            "[\"PlayerB\",\"戦闘エリア2\"]": [
                "PlayerB_65"
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
                                "PlayerB_63",
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
                                "PlayerB_65",
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
        "PlayerA_3": {
            "id": "PlayerA_3",
            "damage": 0,
            "destroyReason": null,
            "flags": {},
            "tips": {
                "橫置支付0[緑]": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerA_20",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_9",
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
                                "PlayerA_20",
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
                "橫置支付1[緑]": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerA_9",
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
                                "PlayerA_9",
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
                                "PlayerA_20",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_9",
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
        "PlayerA_27": {
            "id": "PlayerA_27",
            "damage": 0,
            "destroyReason": null,
            "flags": {},
            "tips": {
                "橫置支付0[null]": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerA_4",
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
                                "PlayerA_4",
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
                "這張卡在戰區的場合, 打開自軍本國上的1張卡": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerA_34",
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
                                "PlayerA_34",
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
                        "PlayerA_34"
                    ]
                }
            },
            "globalEffects": {},
            "varNamesRemoveOnTurnEnd": {},
            "isAttack": false,
            "isDefence": true,
            "textIdsUseThisTurn": [],
            "isOpenForGain": false,
            "isCheat": false,
            "isFirstTurn": false
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
                                "PlayerA_8",
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
                                "PlayerA_8",
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
                                "PlayerA_8",
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
                                "PlayerA_27",
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
        "PlayerB_83": {
            "id": "PlayerB_83",
            "damage": 0,
            "destroyReason": null,
            "flags": {},
            "tips": {
                "橫置支付0[白]": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerB_57",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_64",
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
                                "PlayerB_57",
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
                                "PlayerB_57",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_64",
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
        "PlayerA_45": {
            "id": "PlayerA_45",
            "damage": 0,
            "destroyReason": null,
            "flags": {},
            "tips": {
                "橫置支付0[緑]": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerA_20",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_9",
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
                            ]
                        ],
                        [
                            [
                                "PlayerA_20",
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
                "橫置支付1[緑]": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerA_9",
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
                            ]
                        ],
                        [
                            [
                                "PlayerA_9",
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
                                "PlayerA_3",
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
                                "PlayerA_27",
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
                                "PlayerA_20",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_9",
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
        "PlayerA_4": {
            "id": "PlayerA_4",
            "damage": 0,
            "destroyReason": null,
            "flags": {},
            "tips": {},
            "globalEffects": {},
            "varNamesRemoveOnTurnEnd": {},
            "isCheat": false,
            "isOpenForGain": false,
            "isFirstTurn": false,
            "textIdsUseThisTurn": [],
            "isAttack": false,
            "isDefence": false
        },
        "PlayerB_63": {
            "id": "PlayerB_63",
            "damage": 0,
            "destroyReason": null,
            "flags": {},
            "tips": {
                "橫置支付0[白]": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerB_57",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_64",
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
                                "PlayerB_50",
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
                                "PlayerB_57",
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
                                "PlayerB_57",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_64",
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
                                "PlayerB_50",
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
            "globalEffects": {
                "setGlobalEffect_01929605-b9af-7001-bf59-61fd62619e3f": {
                    "title": [
                        "AddText",
                        {
                            "id": "_01929605-b9ae-7001-bf59-5ec2744d6d33",
                            "title": [
                                "特殊型",
                                [
                                    "速攻"
                                ]
                            ]
                        }
                    ],
                    "cardIds": [
                        "PlayerB_63"
                    ]
                }
            },
            "varNamesRemoveOnTurnEnd": {
                "setGlobalEffect_01929605-b9af-7001-bf59-61fd62619e3f": true
            },
            "isFirstTurn": false,
            "textIdsUseThisTurn": [],
            "isOpenForGain": false,
            "isCheat": false,
            "isAttack": true,
            "isDefence": false
        },
        "PlayerA_40": {
            "id": "PlayerA_40",
            "damage": 0,
            "destroyReason": null,
            "flags": {},
            "tips": {
                "橫置支付0[緑]": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerA_20",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_9",
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
                                "PlayerA_38",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_4",
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
                                "PlayerA_20",
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
                "橫置支付1[緑]": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerA_9",
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
                                "PlayerA_38",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_4",
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
                                "PlayerA_9",
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
                "橫置支付2[緑]": {
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
                                "PlayerA_38",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_4",
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
                "自軍手札にある、６以上の合計国力と緑のロールコストを持つユニット１枚": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerA_8",
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
                                "PlayerA_8",
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
                                "PlayerA_20",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_9",
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
                                "PlayerA_38",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_4",
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
        "PlayerA_8": {
            "id": "PlayerA_8",
            "damage": 0,
            "destroyReason": null,
            "flags": {},
            "tips": {
                "〔X〕": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerA_38",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_4",
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
                                "PlayerA_38",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_4",
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
            "isAttack": false,
            "isDefence": true,
            "textIdsUseThisTurn": [],
            "isOpenForGain": false,
            "isCheat": false
        },
        "PlayerB_92": {
            "id": "PlayerB_92",
            "damage": 0,
            "destroyReason": null,
            "flags": {},
            "tips": {
                "自軍捨て山の上のカード１枚": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerB_62",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "捨て山"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_52",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "捨て山"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_58",
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
                                "PlayerB_59",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "捨て山"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_71",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "捨て山"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_74",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "捨て山"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_82",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "捨て山"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_73",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "捨て山"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_93",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "捨て山"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_91",
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
                                "PlayerB_62",
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
                                "PlayerB_64",
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
                                "PlayerB_50",
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
                                "PlayerB_64",
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
                                "PlayerB_50",
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
                                "PlayerB_64",
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
                                "PlayerB_50",
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
        "PlayerA_34": {
            "id": "PlayerA_34",
            "damage": 0,
            "destroyReason": null,
            "flags": {},
            "tips": {
                "橫置支付0[緑]": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerA_20",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_9",
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
                                "PlayerA_38",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_4",
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
                                "PlayerA_20",
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
                                "PlayerA_8",
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
                                "PlayerA_8",
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
                                "PlayerA_20",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_9",
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
                                "PlayerA_38",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_4",
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
            "isOpenForGain": false,
            "isFirstTurn": false,
            "textIdsUseThisTurn": [],
            "isAttack": false,
            "isDefence": false
        },
        "PlayerB_65": {
            "id": "PlayerB_65",
            "damage": 0,
            "destroyReason": null,
            "flags": {},
            "tips": {},
            "globalEffects": {},
            "varNamesRemoveOnTurnEnd": {},
            "textIdsUseThisTurn": [],
            "isOpenForGain": false,
            "isCheat": false,
            "isFirstTurn": false,
            "isAttack": true,
            "isDefence": false
        },
        "PlayerB_89": {
            "id": "PlayerB_89",
            "damage": 0,
            "destroyReason": null,
            "flags": {},
            "tips": {
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
                            ],
                            [
                                "PlayerB_50",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_62",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_79",
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
                "橫置支付1[白]": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerB_50",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_62",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_79",
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
                                "PlayerB_50",
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
                "橫置支付2[白]": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerB_62",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_79",
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
                                "PlayerB_62",
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
                            ],
                            [
                                "PlayerB_50",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_62",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_79",
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
                "自軍本国のカードを全て見て、その中にある「ルイン・リー」、または「マニィ・アンバサダ」1枚": {
                    "title": [
                        "カード",
                        [],
                        []
                    ],
                    "max": 1,
                    "cheatCardIds": [
                        "PlayerB_61",
                        "PlayerB_51",
                        "PlayerB_55",
                        "PlayerB_90",
                        "PlayerB_86",
                        "PlayerB_54",
                        "PlayerB_85",
                        "PlayerB_78",
                        "PlayerB_68",
                        "PlayerB_75",
                        "PlayerB_53",
                        "PlayerB_72",
                        "PlayerB_66"
                    ]
                }
            },
            "globalEffects": {},
            "varNamesRemoveOnTurnEnd": {},
            "isFirstTurn": false,
            "textIdsUseThisTurn": [],
            "isAttack": false,
            "isDefence": false,
            "isOpenForGain": false,
            "isCheat": false
        },
        "PlayerB_76": {
            "id": "PlayerB_76",
            "damage": 0,
            "destroyReason": null,
            "flags": {},
            "tips": {
                "橫置支付0[白]": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerB_57",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_64",
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
                                "PlayerB_50",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_62",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_79",
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
                                "PlayerB_57",
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
                                "PlayerB_64",
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
                                "PlayerB_50",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_62",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_79",
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
                                "PlayerB_64",
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
                                "PlayerB_57",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_64",
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
                                "PlayerB_50",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_62",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_79",
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
                                "PlayerB_76",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "手札"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_67",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "手札"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_56",
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
                                "PlayerB_76",
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
        "PlayerB_67": {
            "id": "PlayerB_67",
            "damage": 0,
            "destroyReason": null,
            "flags": {},
            "tips": {
                "打開自軍手裡或指定HANGER中特徵A並合計國力x以下的1張卡": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerB_67",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "手札"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_56",
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
                                "PlayerB_67",
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
            "isAttack": false,
            "isDefence": false,
            "textIdsUseThisTurn": [],
            "isOpenForGain": false,
            "isCheat": false,
            "isFirstTurn": false
        },
        "PlayerA_7": {
            "id": "PlayerA_7",
            "damage": 0,
            "destroyReason": null,
            "flags": {},
            "tips": {
                "橫置支付0[緑]": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerA_20",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_9",
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
                            ]
                        ],
                        [
                            [
                                "PlayerA_20",
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
                "橫置支付1[緑]": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerA_9",
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
                            ]
                        ],
                        [
                            [
                                "PlayerA_9",
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
                                "PlayerA_20",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_9",
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
                            ]
                        ]
                    ]
                },
                "橫置支付0[null]": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerA_38",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_4",
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
                                "PlayerA_38",
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
                "這張卡在戰區的場合, 打開自軍本國上的1張卡": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerA_34",
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
                                "PlayerA_34",
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
                        "PlayerA_34"
                    ]
                },
                "打開自軍手裡或指定HANGER中特徵A並合計國力x以下的1張卡": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerA_7",
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
                                "PlayerA_7",
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
            "isOpenForGain": false,
            "isCheat": false,
            "textIdsUseThisTurn": [],
            "isAttack": false,
            "isDefence": false
        },
        "PlayerB_56": {
            "id": "PlayerB_56",
            "damage": 0,
            "destroyReason": null,
            "flags": {},
            "tips": {
                "打開自軍手裡或指定HANGER中特徵A並合計國力x以下的1張卡": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerB_56",
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
                                "PlayerB_56",
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
            "textIdsUseThisTurn": [],
            "isOpenForGain": false,
            "isCheat": false,
            "isFirstTurn": false,
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
                                "PlayerB_79",
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
                                "PlayerB_79",
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
                "任意の枚数の敵軍ユニット": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerA_27",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "戦闘エリア1"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_3",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "戦闘エリア2"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_8",
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
                                "PlayerA_27",
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
                    "isRepeat": true,
                    "count": 1
                },
                "合計国力〔x〕": {
                    "title": [
                        "カード",
                        [],
                        [
                            [
                                "PlayerB_79",
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
                                "PlayerB_57",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_64",
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
                                "PlayerB_50",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_62",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_79",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_97",
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
                                "PlayerB_57",
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
                "自軍ユニット１枚": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerB_63",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "配備エリア"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_65",
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
                                "PlayerB_63",
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
                "「速攻」または「高機動」": {
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
                "合計国力〔x〕": {
                    "title": [
                        "カード",
                        [],
                        [
                            [
                                "PlayerB_57",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_64",
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
                                "PlayerB_50",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_62",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_79",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_97",
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
            "playGCount": 1,
            "confirmPhase": false,
            "textIdsUseThisTurn": {}
        }
    },
    "activePlayerID": "PlayerB",
    "immediateEffect": [],
    "stackEffect": [],
    "destroyEffect": [],
    "commandEffects": [
        "createPlayEffects_PlayerA_PlayerA_27_loadPrototype_179003_01A_U_GN008R_green_02_text_0",
        "createPlayEffects_PlayerA_PlayerA_27_loadPrototype_179003_01A_U_GN008R_green_02_text_1",
        "createPlayEffects_PlayerA_PlayerA_27_loadPrototype_179003_01A_U_GN008R_green_02_text_2",
        "createPlayEffects_PlayerA_PlayerA_45_loadPrototype_179901_CG_CH_GN001P_green_text_0",
        "createPlayEffects_PlayerB_PlayerB_65_loadPrototype_179008_02A_U_WT034U_white_text_1"
    ],
    "commandEffectTips": [
        {
            "effectId": "createPlayEffects_PlayerA_PlayerA_27_loadPrototype_179003_01A_U_GN008R_green_02_text_0",
            "conditionKeys": [
                "同回合上限",
                "橫置支付0[null]",
                "橫置支付1[null]",
                "這張卡交戰的防禦力x以下的敵軍機體1張"
            ],
            "logicID": 0,
            "logicSubID": 0,
            "tipOrErrors": [
                {
                    "effectId": "createPlayEffects_PlayerA_PlayerA_27_loadPrototype_179003_01A_U_GN008R_green_02_text_0",
                    "conditionKey": "同回合上限",
                    "tip": null,
                    "errors": []
                },
                {
                    "effectId": "createPlayEffects_PlayerA_PlayerA_27_loadPrototype_179003_01A_U_GN008R_green_02_text_0",
                    "conditionKey": "橫置支付0[null]",
                    "tip": {
                        "title": [
                            "カード",
                            [
                                [
                                    "PlayerA_9",
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
                                    "PlayerA_38",
                                    {
                                        "id": "AbsoluteBaSyou",
                                        "value": [
                                            "PlayerA",
                                            "Gゾーン"
                                        ]
                                    }
                                ],
                                [
                                    "PlayerA_4",
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
                                    "PlayerA_9",
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
                    "effectId": "createPlayEffects_PlayerA_PlayerA_27_loadPrototype_179003_01A_U_GN008R_green_02_text_0",
                    "conditionKey": "橫置支付1[null]",
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
                                    "PlayerA_38",
                                    {
                                        "id": "AbsoluteBaSyou",
                                        "value": [
                                            "PlayerA",
                                            "Gゾーン"
                                        ]
                                    }
                                ],
                                [
                                    "PlayerA_4",
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
                    "effectId": "createPlayEffects_PlayerA_PlayerA_27_loadPrototype_179003_01A_U_GN008R_green_02_text_0",
                    "conditionKey": "這張卡交戰的防禦力x以下的敵軍機體1張",
                    "tip": {
                        "title": [
                            "カード",
                            [
                                [
                                    "PlayerB_65",
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
                                    "PlayerB_65",
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
                }
            ]
        },
        {
            "effectId": "createPlayEffects_PlayerA_PlayerA_27_loadPrototype_179003_01A_U_GN008R_green_02_text_1",
            "conditionKeys": [
                "同回合上限",
                "橫置支付0[null]",
                "這個效果1回合只能用1次",
                "這張卡在戰區的場合"
            ],
            "logicID": 0,
            "logicSubID": 0,
            "tipOrErrors": [
                {
                    "effectId": "createPlayEffects_PlayerA_PlayerA_27_loadPrototype_179003_01A_U_GN008R_green_02_text_1",
                    "conditionKey": "同回合上限",
                    "tip": null,
                    "errors": []
                },
                {
                    "effectId": "createPlayEffects_PlayerA_PlayerA_27_loadPrototype_179003_01A_U_GN008R_green_02_text_1",
                    "conditionKey": "橫置支付0[null]",
                    "tip": {
                        "title": [
                            "カード",
                            [
                                [
                                    "PlayerA_9",
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
                                    "PlayerA_38",
                                    {
                                        "id": "AbsoluteBaSyou",
                                        "value": [
                                            "PlayerA",
                                            "Gゾーン"
                                        ]
                                    }
                                ],
                                [
                                    "PlayerA_4",
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
                                    "PlayerA_9",
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
                    "effectId": "createPlayEffects_PlayerA_PlayerA_27_loadPrototype_179003_01A_U_GN008R_green_02_text_1",
                    "conditionKey": "這個效果1回合只能用1次",
                    "tip": null,
                    "errors": []
                },
                {
                    "effectId": "createPlayEffects_PlayerA_PlayerA_27_loadPrototype_179003_01A_U_GN008R_green_02_text_1",
                    "conditionKey": "這張卡在戰區的場合",
                    "tip": null,
                    "errors": []
                }
            ]
        },
        {
            "effectId": "createPlayEffects_PlayerA_PlayerA_27_loadPrototype_179003_01A_U_GN008R_green_02_text_2",
            "conditionKeys": [
                "同回合上限",
                "打開自軍手裡或指定HANGER中特徵A並合計國力x以下的1張卡"
            ],
            "logicID": 0,
            "logicSubID": 0,
            "tipOrErrors": [
                {
                    "effectId": "createPlayEffects_PlayerA_PlayerA_27_loadPrototype_179003_01A_U_GN008R_green_02_text_2",
                    "conditionKey": "同回合上限",
                    "tip": null,
                    "errors": []
                },
                {
                    "effectId": "createPlayEffects_PlayerA_PlayerA_27_loadPrototype_179003_01A_U_GN008R_green_02_text_2",
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
                }
            ]
        },
        {
            "effectId": "createPlayEffects_PlayerA_PlayerA_45_loadPrototype_179901_CG_CH_GN001P_green_text_0",
            "conditionKeys": [
                "同回合上限",
                "0[null]",
                "1[null]",
                "このセットグループのユニット"
            ],
            "logicID": 0,
            "logicSubID": 0,
            "tipOrErrors": [
                {
                    "effectId": "createPlayEffects_PlayerA_PlayerA_45_loadPrototype_179901_CG_CH_GN001P_green_text_0",
                    "conditionKey": "同回合上限",
                    "tip": null,
                    "errors": []
                },
                {
                    "effectId": "createPlayEffects_PlayerA_PlayerA_45_loadPrototype_179901_CG_CH_GN001P_green_text_0",
                    "conditionKey": "0[null]",
                    "tip": {
                        "title": [
                            "カード",
                            [
                                [
                                    "PlayerA_9",
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
                                    "PlayerA_38",
                                    {
                                        "id": "AbsoluteBaSyou",
                                        "value": [
                                            "PlayerA",
                                            "Gゾーン"
                                        ]
                                    }
                                ],
                                [
                                    "PlayerA_4",
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
                                    "PlayerA_9",
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
                    "effectId": "createPlayEffects_PlayerA_PlayerA_45_loadPrototype_179901_CG_CH_GN001P_green_text_0",
                    "conditionKey": "1[null]",
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
                                    "PlayerA_38",
                                    {
                                        "id": "AbsoluteBaSyou",
                                        "value": [
                                            "PlayerA",
                                            "Gゾーン"
                                        ]
                                    }
                                ],
                                [
                                    "PlayerA_4",
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
                    "effectId": "createPlayEffects_PlayerA_PlayerA_45_loadPrototype_179901_CG_CH_GN001P_green_text_0",
                    "conditionKey": "このセットグループのユニット",
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
                                            "戦闘エリア2"
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
                                            "戦闘エリア2"
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
            "effectId": "createPlayEffects_PlayerB_PlayerB_65_loadPrototype_179008_02A_U_WT034U_white_text_1",
            "conditionKeys": [
                "同回合上限",
                "打開自軍手裡或指定HANGER中特徵A並合計國力x以下的1張卡"
            ],
            "logicID": 0,
            "logicSubID": 0,
            "tipOrErrors": [
                {
                    "effectId": "createPlayEffects_PlayerB_PlayerB_65_loadPrototype_179008_02A_U_WT034U_white_text_1",
                    "conditionKey": "同回合上限",
                    "tip": null,
                    "errors": []
                },
                {
                    "effectId": "createPlayEffects_PlayerB_PlayerB_65_loadPrototype_179008_02A_U_WT034U_white_text_1",
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
    "coins": {},
    "coinId2cardId": {},
    "globalEffectPool": {
        "null": [
            {
                "title": [
                    "このカードが受ける全ての_通常ダメージは、_２減殺される",
                    "通常ダメージ",
                    2
                ],
                "cardIds": [
                    "PlayerA_8"
                ]
            },
            {
                "title": [
                    "AddText",
                    {
                        "id": "_01929605-b9ae-7001-bf59-5ec2744d6d33",
                        "title": [
                            "特殊型",
                            [
                                "速攻"
                            ]
                        ]
                    }
                ],
                "cardIds": [
                    "PlayerB_63"
                ]
            },
            {
                "title": [
                    "發生國力",
                    [
                        "緑"
                    ]
                ],
                "cardIds": [
                    "PlayerA_9"
                ]
            },
            {
                "title": [
                    "發生國力",
                    [
                        "緑"
                    ]
                ],
                "cardIds": [
                    "PlayerA_6"
                ]
            },
            {
                "title": [
                    "發生國力",
                    [
                        "緑"
                    ]
                ],
                "cardIds": [
                    "PlayerA_38"
                ]
            },
            {
                "title": [
                    "發生國力",
                    [
                        "緑"
                    ]
                ],
                "cardIds": [
                    "PlayerA_4"
                ]
            },
            {
                "title": [
                    "發生國力",
                    [
                        "白"
                    ]
                ],
                "cardIds": [
                    "PlayerB_64"
                ]
            },
            {
                "title": [
                    "發生國力",
                    [
                        "白"
                    ]
                ],
                "cardIds": [
                    "PlayerB_77"
                ]
            },
            {
                "title": [
                    "發生國力",
                    [
                        "白"
                    ]
                ],
                "cardIds": [
                    "PlayerB_50"
                ]
            },
            {
                "title": [
                    "發生國力",
                    [
                        "白"
                    ]
                ],
                "cardIds": [
                    "PlayerB_62"
                ]
            },
            {
                "title": [
                    "發生國力",
                    [
                        "白"
                    ]
                ],
                "cardIds": [
                    "PlayerB_79"
                ]
            },
            {
                "title": [
                    "發生國力",
                    [
                        "白"
                    ]
                ],
                "cardIds": [
                    "PlayerB_97"
                ]
            }
        ]
    },
    "messageTopId": 1515,
    "messages": [
        {
            "id": 1514,
            "description": "onSetPhase:戦闘フェイズ,ダメージ判定ステップ,フリータイミング"
        },
        {
            "id": 1513,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 1512,
            "description": "onSetPhase:戦闘フェイズ,ダメージ判定ステップ,ステップ開始"
        },
        {
            "id": 1511,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 1510,
            "description": "onSetPhase:戦闘フェイズ,防御ステップ,ステップ終了"
        },
        {
            "id": 1509,
            "description": "onSetPhase:戦闘フェイズ,防御ステップ,フリータイミング2"
        },
        {
            "id": 1508,
            "description": "onEffectEnd: 出擊"
        },
        {
            "id": 1507,
            "description": "onItemMove:PlayerA_45 = [\"PlayerA\",\"配備エリア\"] => [\"PlayerA\",\"戦闘エリア2\"]",
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
                            "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n            const runtimeBattleArea = GameStateFn2.getRuntimeBattleArea(ctx3, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A21\");\n            if (runtimeBattleArea == \"\\u5B87\\u5B99\\u30A8\\u30EA\\u30A2\")\n              return null;\n            const playerId2 = DefineFn2.EffectFn.getPlayerID(effect), opponentPlayerId = DefineFn2.PlayerIDFn.getOpponent(playerId2);\n            let unitIds = GameStateFn2.getItemIdsByBasyou(ctx3, DefineFn2.AbsoluteBaSyouFn.of(playerId2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\")).filter((cardId) => GameStateFn2.getSetGroupRoot(ctx3, cardId) == cardId).filter((cardId) => GameStateFn2.getCardBattleArea(ctx3, cardId).includes(runtimeBattleArea)).filter((cardId) => GameStateFn2.getCard(ctx3, cardId).isRoll != !0);\n            const opponentUnitIds = GameStateFn2.getBattleGroup(ctx3, DefineFn2.AbsoluteBaSyouFn.of(opponentPlayerId, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A21\"));\n            if (opponentUnitIds.length) {\n              const ges = GameStateFn2.getGlobalEffects(ctx3, null);\n              if (GameStateFn2.isABattleGroup(ctx3, [\"\\u9AD8\\u6A5F\\u52D5\"], opponentUnitIds[0], { ges }))\n                unitIds = unitIds.filter((id) => GameStateFn2.isSetGroupHasA(ctx3, [\"\\u9AD8\\u6A5F\\u52D5\"], id, { ges }));\n            }\n            return {\n              title: [\"\\u30AB\\u30FC\\u30C9\", unitIds.map((id) => {\n                return [id, GameStateFn2.getItemBaSyou(ctx3, id)];\n              }), []],\n              flags: { isGoBattleArea1: !0 }\n            };\n          }",
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                const playerId2 = DefineFn2.EffectFn.getPlayerID(effect), fackCardId = DefineFn2.EffectFn.getCardID(effect), earthPairs = GameStateFn2.getCardTipStrBaSyouPairs(ctx3, \"\\u53BB\\u5730\\u7403\", fackCardId), phase2 = GameStateFn2.getPhase(ctx3);\n                for (let pair3 of earthPairs)\n                  ctx3 = GameStateFn2.mapItemState(ctx3, pair3[0], (is) => ({ ...is, isAttack: phase2[1] == \"\\u653B\\u6483\\u30B9\\u30C6\\u30C3\\u30D7\", isDefence: phase2[1] == \"\\u9632\\u5FA1\\u30B9\\u30C6\\u30C3\\u30D7\" })), ctx3 = GameStateFn2.doItemMove(ctx3, DefineFn2.AbsoluteBaSyouFn.of(playerId2, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A21\"), pair3);\n                return ctx3;\n              }"
                                }
                            ],
                            "groupKey": "出擊"
                        },
                        "去宇宙": {
                            "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n            const runtimeBattleArea = GameStateFn2.getRuntimeBattleArea(ctx3, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A22\");\n            if (runtimeBattleArea == \"\\u5730\\u7403\\u30A8\\u30EA\\u30A2\")\n              return null;\n            const playerId2 = DefineFn2.EffectFn.getPlayerID(effect), opponentPlayerId = DefineFn2.PlayerIDFn.getOpponent(playerId2);\n            let unitIds = GameStateFn2.getItemIdsByBasyou(ctx3, DefineFn2.AbsoluteBaSyouFn.of(playerId2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\")).filter((cardId) => GameStateFn2.getSetGroupRoot(ctx3, cardId) == cardId).filter((cardId) => GameStateFn2.getCardBattleArea(ctx3, cardId).includes(runtimeBattleArea)).filter((cardId) => GameStateFn2.getCard(ctx3, cardId).isRoll != !0);\n            const opponentUnitIds = GameStateFn2.getBattleGroup(ctx3, DefineFn2.AbsoluteBaSyouFn.of(opponentPlayerId, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A22\"));\n            if (opponentUnitIds.length) {\n              const ges = GameStateFn2.getGlobalEffects(ctx3, null);\n              if (GameStateFn2.isABattleGroup(ctx3, [\"\\u9AD8\\u6A5F\\u52D5\"], opponentUnitIds[0], { ges }))\n                unitIds = unitIds.filter((id) => GameStateFn2.isSetGroupHasA(ctx3, [\"\\u9AD8\\u6A5F\\u52D5\"], id, { ges }));\n            }\n            return {\n              title: [\"\\u30AB\\u30FC\\u30C9\", unitIds.map((id) => {\n                return [id, GameStateFn2.getItemBaSyou(ctx3, id)];\n              }), []],\n              flags: { isGoBattleArea2: !0 }\n            };\n          }",
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                const playerId2 = DefineFn2.EffectFn.getPlayerID(effect), fackCardId = DefineFn2.EffectFn.getCardID(effect), spacePairs = GameStateFn2.getCardTipStrBaSyouPairs(ctx3, \"\\u53BB\\u5B87\\u5B99\", fackCardId), phase2 = GameStateFn2.getPhase(ctx3);\n                for (let pair3 of spacePairs)\n                  ctx3 = GameStateFn2.mapItemState(ctx3, pair3[0], (is) => ({ ...is, isAttack: phase2[1] == \"\\u653B\\u6483\\u30B9\\u30C6\\u30C3\\u30D7\", isDefence: phase2[1] == \"\\u9632\\u5FA1\\u30B9\\u30C6\\u30C3\\u30D7\" })), ctx3 = GameStateFn2.doItemMove(ctx3, DefineFn2.AbsoluteBaSyouFn.of(playerId2, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A22\"), pair3);\n                return ctx3 = GameStateFn2.checkIsBattle(ctx3), ctx3;\n              }"
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
            "id": 1506,
            "description": "onItemMove:PlayerA_27 = [\"PlayerA\",\"配備エリア\"] => [\"PlayerA\",\"戦闘エリア2\"]",
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
                            "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n            const runtimeBattleArea = GameStateFn2.getRuntimeBattleArea(ctx3, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A21\");\n            if (runtimeBattleArea == \"\\u5B87\\u5B99\\u30A8\\u30EA\\u30A2\")\n              return null;\n            const playerId2 = DefineFn2.EffectFn.getPlayerID(effect), opponentPlayerId = DefineFn2.PlayerIDFn.getOpponent(playerId2);\n            let unitIds = GameStateFn2.getItemIdsByBasyou(ctx3, DefineFn2.AbsoluteBaSyouFn.of(playerId2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\")).filter((cardId) => GameStateFn2.getSetGroupRoot(ctx3, cardId) == cardId).filter((cardId) => GameStateFn2.getCardBattleArea(ctx3, cardId).includes(runtimeBattleArea)).filter((cardId) => GameStateFn2.getCard(ctx3, cardId).isRoll != !0);\n            const opponentUnitIds = GameStateFn2.getBattleGroup(ctx3, DefineFn2.AbsoluteBaSyouFn.of(opponentPlayerId, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A21\"));\n            if (opponentUnitIds.length) {\n              const ges = GameStateFn2.getGlobalEffects(ctx3, null);\n              if (GameStateFn2.isABattleGroup(ctx3, [\"\\u9AD8\\u6A5F\\u52D5\"], opponentUnitIds[0], { ges }))\n                unitIds = unitIds.filter((id) => GameStateFn2.isSetGroupHasA(ctx3, [\"\\u9AD8\\u6A5F\\u52D5\"], id, { ges }));\n            }\n            return {\n              title: [\"\\u30AB\\u30FC\\u30C9\", unitIds.map((id) => {\n                return [id, GameStateFn2.getItemBaSyou(ctx3, id)];\n              }), []],\n              flags: { isGoBattleArea1: !0 }\n            };\n          }",
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                const playerId2 = DefineFn2.EffectFn.getPlayerID(effect), fackCardId = DefineFn2.EffectFn.getCardID(effect), earthPairs = GameStateFn2.getCardTipStrBaSyouPairs(ctx3, \"\\u53BB\\u5730\\u7403\", fackCardId), phase2 = GameStateFn2.getPhase(ctx3);\n                for (let pair3 of earthPairs)\n                  ctx3 = GameStateFn2.mapItemState(ctx3, pair3[0], (is) => ({ ...is, isAttack: phase2[1] == \"\\u653B\\u6483\\u30B9\\u30C6\\u30C3\\u30D7\", isDefence: phase2[1] == \"\\u9632\\u5FA1\\u30B9\\u30C6\\u30C3\\u30D7\" })), ctx3 = GameStateFn2.doItemMove(ctx3, DefineFn2.AbsoluteBaSyouFn.of(playerId2, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A21\"), pair3);\n                return ctx3;\n              }"
                                }
                            ],
                            "groupKey": "出擊"
                        },
                        "去宇宙": {
                            "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n            const runtimeBattleArea = GameStateFn2.getRuntimeBattleArea(ctx3, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A22\");\n            if (runtimeBattleArea == \"\\u5730\\u7403\\u30A8\\u30EA\\u30A2\")\n              return null;\n            const playerId2 = DefineFn2.EffectFn.getPlayerID(effect), opponentPlayerId = DefineFn2.PlayerIDFn.getOpponent(playerId2);\n            let unitIds = GameStateFn2.getItemIdsByBasyou(ctx3, DefineFn2.AbsoluteBaSyouFn.of(playerId2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\")).filter((cardId) => GameStateFn2.getSetGroupRoot(ctx3, cardId) == cardId).filter((cardId) => GameStateFn2.getCardBattleArea(ctx3, cardId).includes(runtimeBattleArea)).filter((cardId) => GameStateFn2.getCard(ctx3, cardId).isRoll != !0);\n            const opponentUnitIds = GameStateFn2.getBattleGroup(ctx3, DefineFn2.AbsoluteBaSyouFn.of(opponentPlayerId, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A22\"));\n            if (opponentUnitIds.length) {\n              const ges = GameStateFn2.getGlobalEffects(ctx3, null);\n              if (GameStateFn2.isABattleGroup(ctx3, [\"\\u9AD8\\u6A5F\\u52D5\"], opponentUnitIds[0], { ges }))\n                unitIds = unitIds.filter((id) => GameStateFn2.isSetGroupHasA(ctx3, [\"\\u9AD8\\u6A5F\\u52D5\"], id, { ges }));\n            }\n            return {\n              title: [\"\\u30AB\\u30FC\\u30C9\", unitIds.map((id) => {\n                return [id, GameStateFn2.getItemBaSyou(ctx3, id)];\n              }), []],\n              flags: { isGoBattleArea2: !0 }\n            };\n          }",
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                const playerId2 = DefineFn2.EffectFn.getPlayerID(effect), fackCardId = DefineFn2.EffectFn.getCardID(effect), spacePairs = GameStateFn2.getCardTipStrBaSyouPairs(ctx3, \"\\u53BB\\u5B87\\u5B99\", fackCardId), phase2 = GameStateFn2.getPhase(ctx3);\n                for (let pair3 of spacePairs)\n                  ctx3 = GameStateFn2.mapItemState(ctx3, pair3[0], (is) => ({ ...is, isAttack: phase2[1] == \"\\u653B\\u6483\\u30B9\\u30C6\\u30C3\\u30D7\", isDefence: phase2[1] == \"\\u9632\\u5FA1\\u30B9\\u30C6\\u30C3\\u30D7\" })), ctx3 = GameStateFn2.doItemMove(ctx3, DefineFn2.AbsoluteBaSyouFn.of(playerId2, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A22\"), pair3);\n                return ctx3 = GameStateFn2.checkIsBattle(ctx3), ctx3;\n              }"
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
            "id": 1505,
            "description": "onEvent: GameEventOnMove [\"PlayerA_45\"]",
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
                            "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n            const runtimeBattleArea = GameStateFn2.getRuntimeBattleArea(ctx3, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A21\");\n            if (runtimeBattleArea == \"\\u5B87\\u5B99\\u30A8\\u30EA\\u30A2\")\n              return null;\n            const playerId2 = DefineFn2.EffectFn.getPlayerID(effect), opponentPlayerId = DefineFn2.PlayerIDFn.getOpponent(playerId2);\n            let unitIds = GameStateFn2.getItemIdsByBasyou(ctx3, DefineFn2.AbsoluteBaSyouFn.of(playerId2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\")).filter((cardId) => GameStateFn2.getSetGroupRoot(ctx3, cardId) == cardId).filter((cardId) => GameStateFn2.getCardBattleArea(ctx3, cardId).includes(runtimeBattleArea)).filter((cardId) => GameStateFn2.getCard(ctx3, cardId).isRoll != !0);\n            const opponentUnitIds = GameStateFn2.getBattleGroup(ctx3, DefineFn2.AbsoluteBaSyouFn.of(opponentPlayerId, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A21\"));\n            if (opponentUnitIds.length) {\n              const ges = GameStateFn2.getGlobalEffects(ctx3, null);\n              if (GameStateFn2.isABattleGroup(ctx3, [\"\\u9AD8\\u6A5F\\u52D5\"], opponentUnitIds[0], { ges }))\n                unitIds = unitIds.filter((id) => GameStateFn2.isSetGroupHasA(ctx3, [\"\\u9AD8\\u6A5F\\u52D5\"], id, { ges }));\n            }\n            return {\n              title: [\"\\u30AB\\u30FC\\u30C9\", unitIds.map((id) => {\n                return [id, GameStateFn2.getItemBaSyou(ctx3, id)];\n              }), []],\n              flags: { isGoBattleArea1: !0 }\n            };\n          }",
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                const playerId2 = DefineFn2.EffectFn.getPlayerID(effect), fackCardId = DefineFn2.EffectFn.getCardID(effect), earthPairs = GameStateFn2.getCardTipStrBaSyouPairs(ctx3, \"\\u53BB\\u5730\\u7403\", fackCardId), phase2 = GameStateFn2.getPhase(ctx3);\n                for (let pair3 of earthPairs)\n                  ctx3 = GameStateFn2.mapItemState(ctx3, pair3[0], (is) => ({ ...is, isAttack: phase2[1] == \"\\u653B\\u6483\\u30B9\\u30C6\\u30C3\\u30D7\", isDefence: phase2[1] == \"\\u9632\\u5FA1\\u30B9\\u30C6\\u30C3\\u30D7\" })), ctx3 = GameStateFn2.doItemMove(ctx3, DefineFn2.AbsoluteBaSyouFn.of(playerId2, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A21\"), pair3);\n                return ctx3;\n              }"
                                }
                            ],
                            "groupKey": "出擊"
                        },
                        "去宇宙": {
                            "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n            const runtimeBattleArea = GameStateFn2.getRuntimeBattleArea(ctx3, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A22\");\n            if (runtimeBattleArea == \"\\u5730\\u7403\\u30A8\\u30EA\\u30A2\")\n              return null;\n            const playerId2 = DefineFn2.EffectFn.getPlayerID(effect), opponentPlayerId = DefineFn2.PlayerIDFn.getOpponent(playerId2);\n            let unitIds = GameStateFn2.getItemIdsByBasyou(ctx3, DefineFn2.AbsoluteBaSyouFn.of(playerId2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\")).filter((cardId) => GameStateFn2.getSetGroupRoot(ctx3, cardId) == cardId).filter((cardId) => GameStateFn2.getCardBattleArea(ctx3, cardId).includes(runtimeBattleArea)).filter((cardId) => GameStateFn2.getCard(ctx3, cardId).isRoll != !0);\n            const opponentUnitIds = GameStateFn2.getBattleGroup(ctx3, DefineFn2.AbsoluteBaSyouFn.of(opponentPlayerId, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A22\"));\n            if (opponentUnitIds.length) {\n              const ges = GameStateFn2.getGlobalEffects(ctx3, null);\n              if (GameStateFn2.isABattleGroup(ctx3, [\"\\u9AD8\\u6A5F\\u52D5\"], opponentUnitIds[0], { ges }))\n                unitIds = unitIds.filter((id) => GameStateFn2.isSetGroupHasA(ctx3, [\"\\u9AD8\\u6A5F\\u52D5\"], id, { ges }));\n            }\n            return {\n              title: [\"\\u30AB\\u30FC\\u30C9\", unitIds.map((id) => {\n                return [id, GameStateFn2.getItemBaSyou(ctx3, id)];\n              }), []],\n              flags: { isGoBattleArea2: !0 }\n            };\n          }",
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                const playerId2 = DefineFn2.EffectFn.getPlayerID(effect), fackCardId = DefineFn2.EffectFn.getCardID(effect), spacePairs = GameStateFn2.getCardTipStrBaSyouPairs(ctx3, \"\\u53BB\\u5B87\\u5B99\", fackCardId), phase2 = GameStateFn2.getPhase(ctx3);\n                for (let pair3 of spacePairs)\n                  ctx3 = GameStateFn2.mapItemState(ctx3, pair3[0], (is) => ({ ...is, isAttack: phase2[1] == \"\\u653B\\u6483\\u30B9\\u30C6\\u30C3\\u30D7\", isDefence: phase2[1] == \"\\u9632\\u5FA1\\u30B9\\u30C6\\u30C3\\u30D7\" })), ctx3 = GameStateFn2.doItemMove(ctx3, DefineFn2.AbsoluteBaSyouFn.of(playerId2, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A22\"), pair3);\n                return ctx3 = GameStateFn2.checkIsBattle(ctx3), ctx3;\n              }"
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
            "id": 1504,
            "description": "onEvent: GameEventOnMove [\"PlayerA_27\"]",
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
                            "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n            const runtimeBattleArea = GameStateFn2.getRuntimeBattleArea(ctx3, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A21\");\n            if (runtimeBattleArea == \"\\u5B87\\u5B99\\u30A8\\u30EA\\u30A2\")\n              return null;\n            const playerId2 = DefineFn2.EffectFn.getPlayerID(effect), opponentPlayerId = DefineFn2.PlayerIDFn.getOpponent(playerId2);\n            let unitIds = GameStateFn2.getItemIdsByBasyou(ctx3, DefineFn2.AbsoluteBaSyouFn.of(playerId2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\")).filter((cardId) => GameStateFn2.getSetGroupRoot(ctx3, cardId) == cardId).filter((cardId) => GameStateFn2.getCardBattleArea(ctx3, cardId).includes(runtimeBattleArea)).filter((cardId) => GameStateFn2.getCard(ctx3, cardId).isRoll != !0);\n            const opponentUnitIds = GameStateFn2.getBattleGroup(ctx3, DefineFn2.AbsoluteBaSyouFn.of(opponentPlayerId, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A21\"));\n            if (opponentUnitIds.length) {\n              const ges = GameStateFn2.getGlobalEffects(ctx3, null);\n              if (GameStateFn2.isABattleGroup(ctx3, [\"\\u9AD8\\u6A5F\\u52D5\"], opponentUnitIds[0], { ges }))\n                unitIds = unitIds.filter((id) => GameStateFn2.isSetGroupHasA(ctx3, [\"\\u9AD8\\u6A5F\\u52D5\"], id, { ges }));\n            }\n            return {\n              title: [\"\\u30AB\\u30FC\\u30C9\", unitIds.map((id) => {\n                return [id, GameStateFn2.getItemBaSyou(ctx3, id)];\n              }), []],\n              flags: { isGoBattleArea1: !0 }\n            };\n          }",
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                const playerId2 = DefineFn2.EffectFn.getPlayerID(effect), fackCardId = DefineFn2.EffectFn.getCardID(effect), earthPairs = GameStateFn2.getCardTipStrBaSyouPairs(ctx3, \"\\u53BB\\u5730\\u7403\", fackCardId), phase2 = GameStateFn2.getPhase(ctx3);\n                for (let pair3 of earthPairs)\n                  ctx3 = GameStateFn2.mapItemState(ctx3, pair3[0], (is) => ({ ...is, isAttack: phase2[1] == \"\\u653B\\u6483\\u30B9\\u30C6\\u30C3\\u30D7\", isDefence: phase2[1] == \"\\u9632\\u5FA1\\u30B9\\u30C6\\u30C3\\u30D7\" })), ctx3 = GameStateFn2.doItemMove(ctx3, DefineFn2.AbsoluteBaSyouFn.of(playerId2, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A21\"), pair3);\n                return ctx3;\n              }"
                                }
                            ],
                            "groupKey": "出擊"
                        },
                        "去宇宙": {
                            "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n            const runtimeBattleArea = GameStateFn2.getRuntimeBattleArea(ctx3, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A22\");\n            if (runtimeBattleArea == \"\\u5730\\u7403\\u30A8\\u30EA\\u30A2\")\n              return null;\n            const playerId2 = DefineFn2.EffectFn.getPlayerID(effect), opponentPlayerId = DefineFn2.PlayerIDFn.getOpponent(playerId2);\n            let unitIds = GameStateFn2.getItemIdsByBasyou(ctx3, DefineFn2.AbsoluteBaSyouFn.of(playerId2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\")).filter((cardId) => GameStateFn2.getSetGroupRoot(ctx3, cardId) == cardId).filter((cardId) => GameStateFn2.getCardBattleArea(ctx3, cardId).includes(runtimeBattleArea)).filter((cardId) => GameStateFn2.getCard(ctx3, cardId).isRoll != !0);\n            const opponentUnitIds = GameStateFn2.getBattleGroup(ctx3, DefineFn2.AbsoluteBaSyouFn.of(opponentPlayerId, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A22\"));\n            if (opponentUnitIds.length) {\n              const ges = GameStateFn2.getGlobalEffects(ctx3, null);\n              if (GameStateFn2.isABattleGroup(ctx3, [\"\\u9AD8\\u6A5F\\u52D5\"], opponentUnitIds[0], { ges }))\n                unitIds = unitIds.filter((id) => GameStateFn2.isSetGroupHasA(ctx3, [\"\\u9AD8\\u6A5F\\u52D5\"], id, { ges }));\n            }\n            return {\n              title: [\"\\u30AB\\u30FC\\u30C9\", unitIds.map((id) => {\n                return [id, GameStateFn2.getItemBaSyou(ctx3, id)];\n              }), []],\n              flags: { isGoBattleArea2: !0 }\n            };\n          }",
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                const playerId2 = DefineFn2.EffectFn.getPlayerID(effect), fackCardId = DefineFn2.EffectFn.getCardID(effect), spacePairs = GameStateFn2.getCardTipStrBaSyouPairs(ctx3, \"\\u53BB\\u5B87\\u5B99\", fackCardId), phase2 = GameStateFn2.getPhase(ctx3);\n                for (let pair3 of spacePairs)\n                  ctx3 = GameStateFn2.mapItemState(ctx3, pair3[0], (is) => ({ ...is, isAttack: phase2[1] == \"\\u653B\\u6483\\u30B9\\u30C6\\u30C3\\u30D7\", isDefence: phase2[1] == \"\\u9632\\u5FA1\\u30B9\\u30C6\\u30C3\\u30D7\" })), ctx3 = GameStateFn2.doItemMove(ctx3, DefineFn2.AbsoluteBaSyouFn.of(playerId2, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A22\"), pair3);\n                return ctx3 = GameStateFn2.checkIsBattle(ctx3), ctx3;\n              }"
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
            "id": 1503,
            "description": "onItemMove:PlayerA_34 = [\"PlayerA\",\"配備エリア\"] => [\"PlayerA\",\"戦闘エリア1\"]",
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
                            "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n            const runtimeBattleArea = GameStateFn2.getRuntimeBattleArea(ctx3, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A21\");\n            if (runtimeBattleArea == \"\\u5B87\\u5B99\\u30A8\\u30EA\\u30A2\")\n              return null;\n            const playerId2 = DefineFn2.EffectFn.getPlayerID(effect), opponentPlayerId = DefineFn2.PlayerIDFn.getOpponent(playerId2);\n            let unitIds = GameStateFn2.getItemIdsByBasyou(ctx3, DefineFn2.AbsoluteBaSyouFn.of(playerId2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\")).filter((cardId) => GameStateFn2.getSetGroupRoot(ctx3, cardId) == cardId).filter((cardId) => GameStateFn2.getCardBattleArea(ctx3, cardId).includes(runtimeBattleArea)).filter((cardId) => GameStateFn2.getCard(ctx3, cardId).isRoll != !0);\n            const opponentUnitIds = GameStateFn2.getBattleGroup(ctx3, DefineFn2.AbsoluteBaSyouFn.of(opponentPlayerId, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A21\"));\n            if (opponentUnitIds.length) {\n              const ges = GameStateFn2.getGlobalEffects(ctx3, null);\n              if (GameStateFn2.isABattleGroup(ctx3, [\"\\u9AD8\\u6A5F\\u52D5\"], opponentUnitIds[0], { ges }))\n                unitIds = unitIds.filter((id) => GameStateFn2.isSetGroupHasA(ctx3, [\"\\u9AD8\\u6A5F\\u52D5\"], id, { ges }));\n            }\n            return {\n              title: [\"\\u30AB\\u30FC\\u30C9\", unitIds.map((id) => {\n                return [id, GameStateFn2.getItemBaSyou(ctx3, id)];\n              }), []],\n              flags: { isGoBattleArea1: !0 }\n            };\n          }",
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                const playerId2 = DefineFn2.EffectFn.getPlayerID(effect), fackCardId = DefineFn2.EffectFn.getCardID(effect), earthPairs = GameStateFn2.getCardTipStrBaSyouPairs(ctx3, \"\\u53BB\\u5730\\u7403\", fackCardId), phase2 = GameStateFn2.getPhase(ctx3);\n                for (let pair3 of earthPairs)\n                  ctx3 = GameStateFn2.mapItemState(ctx3, pair3[0], (is) => ({ ...is, isAttack: phase2[1] == \"\\u653B\\u6483\\u30B9\\u30C6\\u30C3\\u30D7\", isDefence: phase2[1] == \"\\u9632\\u5FA1\\u30B9\\u30C6\\u30C3\\u30D7\" })), ctx3 = GameStateFn2.doItemMove(ctx3, DefineFn2.AbsoluteBaSyouFn.of(playerId2, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A21\"), pair3);\n                return ctx3;\n              }"
                                }
                            ],
                            "groupKey": "出擊"
                        },
                        "去宇宙": {
                            "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n            const runtimeBattleArea = GameStateFn2.getRuntimeBattleArea(ctx3, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A22\");\n            if (runtimeBattleArea == \"\\u5730\\u7403\\u30A8\\u30EA\\u30A2\")\n              return null;\n            const playerId2 = DefineFn2.EffectFn.getPlayerID(effect), opponentPlayerId = DefineFn2.PlayerIDFn.getOpponent(playerId2);\n            let unitIds = GameStateFn2.getItemIdsByBasyou(ctx3, DefineFn2.AbsoluteBaSyouFn.of(playerId2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\")).filter((cardId) => GameStateFn2.getSetGroupRoot(ctx3, cardId) == cardId).filter((cardId) => GameStateFn2.getCardBattleArea(ctx3, cardId).includes(runtimeBattleArea)).filter((cardId) => GameStateFn2.getCard(ctx3, cardId).isRoll != !0);\n            const opponentUnitIds = GameStateFn2.getBattleGroup(ctx3, DefineFn2.AbsoluteBaSyouFn.of(opponentPlayerId, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A22\"));\n            if (opponentUnitIds.length) {\n              const ges = GameStateFn2.getGlobalEffects(ctx3, null);\n              if (GameStateFn2.isABattleGroup(ctx3, [\"\\u9AD8\\u6A5F\\u52D5\"], opponentUnitIds[0], { ges }))\n                unitIds = unitIds.filter((id) => GameStateFn2.isSetGroupHasA(ctx3, [\"\\u9AD8\\u6A5F\\u52D5\"], id, { ges }));\n            }\n            return {\n              title: [\"\\u30AB\\u30FC\\u30C9\", unitIds.map((id) => {\n                return [id, GameStateFn2.getItemBaSyou(ctx3, id)];\n              }), []],\n              flags: { isGoBattleArea2: !0 }\n            };\n          }",
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                const playerId2 = DefineFn2.EffectFn.getPlayerID(effect), fackCardId = DefineFn2.EffectFn.getCardID(effect), spacePairs = GameStateFn2.getCardTipStrBaSyouPairs(ctx3, \"\\u53BB\\u5B87\\u5B99\", fackCardId), phase2 = GameStateFn2.getPhase(ctx3);\n                for (let pair3 of spacePairs)\n                  ctx3 = GameStateFn2.mapItemState(ctx3, pair3[0], (is) => ({ ...is, isAttack: phase2[1] == \"\\u653B\\u6483\\u30B9\\u30C6\\u30C3\\u30D7\", isDefence: phase2[1] == \"\\u9632\\u5FA1\\u30B9\\u30C6\\u30C3\\u30D7\" })), ctx3 = GameStateFn2.doItemMove(ctx3, DefineFn2.AbsoluteBaSyouFn.of(playerId2, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A22\"), pair3);\n                return ctx3 = GameStateFn2.checkIsBattle(ctx3), ctx3;\n              }"
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
            "id": 1502,
            "description": "onItemMove:PlayerA_8 = [\"PlayerA\",\"配備エリア\"] => [\"PlayerA\",\"戦闘エリア1\"]",
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
                            "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n            const runtimeBattleArea = GameStateFn2.getRuntimeBattleArea(ctx3, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A21\");\n            if (runtimeBattleArea == \"\\u5B87\\u5B99\\u30A8\\u30EA\\u30A2\")\n              return null;\n            const playerId2 = DefineFn2.EffectFn.getPlayerID(effect), opponentPlayerId = DefineFn2.PlayerIDFn.getOpponent(playerId2);\n            let unitIds = GameStateFn2.getItemIdsByBasyou(ctx3, DefineFn2.AbsoluteBaSyouFn.of(playerId2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\")).filter((cardId) => GameStateFn2.getSetGroupRoot(ctx3, cardId) == cardId).filter((cardId) => GameStateFn2.getCardBattleArea(ctx3, cardId).includes(runtimeBattleArea)).filter((cardId) => GameStateFn2.getCard(ctx3, cardId).isRoll != !0);\n            const opponentUnitIds = GameStateFn2.getBattleGroup(ctx3, DefineFn2.AbsoluteBaSyouFn.of(opponentPlayerId, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A21\"));\n            if (opponentUnitIds.length) {\n              const ges = GameStateFn2.getGlobalEffects(ctx3, null);\n              if (GameStateFn2.isABattleGroup(ctx3, [\"\\u9AD8\\u6A5F\\u52D5\"], opponentUnitIds[0], { ges }))\n                unitIds = unitIds.filter((id) => GameStateFn2.isSetGroupHasA(ctx3, [\"\\u9AD8\\u6A5F\\u52D5\"], id, { ges }));\n            }\n            return {\n              title: [\"\\u30AB\\u30FC\\u30C9\", unitIds.map((id) => {\n                return [id, GameStateFn2.getItemBaSyou(ctx3, id)];\n              }), []],\n              flags: { isGoBattleArea1: !0 }\n            };\n          }",
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                const playerId2 = DefineFn2.EffectFn.getPlayerID(effect), fackCardId = DefineFn2.EffectFn.getCardID(effect), earthPairs = GameStateFn2.getCardTipStrBaSyouPairs(ctx3, \"\\u53BB\\u5730\\u7403\", fackCardId), phase2 = GameStateFn2.getPhase(ctx3);\n                for (let pair3 of earthPairs)\n                  ctx3 = GameStateFn2.mapItemState(ctx3, pair3[0], (is) => ({ ...is, isAttack: phase2[1] == \"\\u653B\\u6483\\u30B9\\u30C6\\u30C3\\u30D7\", isDefence: phase2[1] == \"\\u9632\\u5FA1\\u30B9\\u30C6\\u30C3\\u30D7\" })), ctx3 = GameStateFn2.doItemMove(ctx3, DefineFn2.AbsoluteBaSyouFn.of(playerId2, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A21\"), pair3);\n                return ctx3;\n              }"
                                }
                            ],
                            "groupKey": "出擊"
                        },
                        "去宇宙": {
                            "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n            const runtimeBattleArea = GameStateFn2.getRuntimeBattleArea(ctx3, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A22\");\n            if (runtimeBattleArea == \"\\u5730\\u7403\\u30A8\\u30EA\\u30A2\")\n              return null;\n            const playerId2 = DefineFn2.EffectFn.getPlayerID(effect), opponentPlayerId = DefineFn2.PlayerIDFn.getOpponent(playerId2);\n            let unitIds = GameStateFn2.getItemIdsByBasyou(ctx3, DefineFn2.AbsoluteBaSyouFn.of(playerId2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\")).filter((cardId) => GameStateFn2.getSetGroupRoot(ctx3, cardId) == cardId).filter((cardId) => GameStateFn2.getCardBattleArea(ctx3, cardId).includes(runtimeBattleArea)).filter((cardId) => GameStateFn2.getCard(ctx3, cardId).isRoll != !0);\n            const opponentUnitIds = GameStateFn2.getBattleGroup(ctx3, DefineFn2.AbsoluteBaSyouFn.of(opponentPlayerId, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A22\"));\n            if (opponentUnitIds.length) {\n              const ges = GameStateFn2.getGlobalEffects(ctx3, null);\n              if (GameStateFn2.isABattleGroup(ctx3, [\"\\u9AD8\\u6A5F\\u52D5\"], opponentUnitIds[0], { ges }))\n                unitIds = unitIds.filter((id) => GameStateFn2.isSetGroupHasA(ctx3, [\"\\u9AD8\\u6A5F\\u52D5\"], id, { ges }));\n            }\n            return {\n              title: [\"\\u30AB\\u30FC\\u30C9\", unitIds.map((id) => {\n                return [id, GameStateFn2.getItemBaSyou(ctx3, id)];\n              }), []],\n              flags: { isGoBattleArea2: !0 }\n            };\n          }",
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                const playerId2 = DefineFn2.EffectFn.getPlayerID(effect), fackCardId = DefineFn2.EffectFn.getCardID(effect), spacePairs = GameStateFn2.getCardTipStrBaSyouPairs(ctx3, \"\\u53BB\\u5B87\\u5B99\", fackCardId), phase2 = GameStateFn2.getPhase(ctx3);\n                for (let pair3 of spacePairs)\n                  ctx3 = GameStateFn2.mapItemState(ctx3, pair3[0], (is) => ({ ...is, isAttack: phase2[1] == \"\\u653B\\u6483\\u30B9\\u30C6\\u30C3\\u30D7\", isDefence: phase2[1] == \"\\u9632\\u5FA1\\u30B9\\u30C6\\u30C3\\u30D7\" })), ctx3 = GameStateFn2.doItemMove(ctx3, DefineFn2.AbsoluteBaSyouFn.of(playerId2, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A22\"), pair3);\n                return ctx3 = GameStateFn2.checkIsBattle(ctx3), ctx3;\n              }"
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
            "id": 1501,
            "description": "onEvent: GameEventOnMove [\"PlayerA_34\"]",
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
                            "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n            const runtimeBattleArea = GameStateFn2.getRuntimeBattleArea(ctx3, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A21\");\n            if (runtimeBattleArea == \"\\u5B87\\u5B99\\u30A8\\u30EA\\u30A2\")\n              return null;\n            const playerId2 = DefineFn2.EffectFn.getPlayerID(effect), opponentPlayerId = DefineFn2.PlayerIDFn.getOpponent(playerId2);\n            let unitIds = GameStateFn2.getItemIdsByBasyou(ctx3, DefineFn2.AbsoluteBaSyouFn.of(playerId2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\")).filter((cardId) => GameStateFn2.getSetGroupRoot(ctx3, cardId) == cardId).filter((cardId) => GameStateFn2.getCardBattleArea(ctx3, cardId).includes(runtimeBattleArea)).filter((cardId) => GameStateFn2.getCard(ctx3, cardId).isRoll != !0);\n            const opponentUnitIds = GameStateFn2.getBattleGroup(ctx3, DefineFn2.AbsoluteBaSyouFn.of(opponentPlayerId, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A21\"));\n            if (opponentUnitIds.length) {\n              const ges = GameStateFn2.getGlobalEffects(ctx3, null);\n              if (GameStateFn2.isABattleGroup(ctx3, [\"\\u9AD8\\u6A5F\\u52D5\"], opponentUnitIds[0], { ges }))\n                unitIds = unitIds.filter((id) => GameStateFn2.isSetGroupHasA(ctx3, [\"\\u9AD8\\u6A5F\\u52D5\"], id, { ges }));\n            }\n            return {\n              title: [\"\\u30AB\\u30FC\\u30C9\", unitIds.map((id) => {\n                return [id, GameStateFn2.getItemBaSyou(ctx3, id)];\n              }), []],\n              flags: { isGoBattleArea1: !0 }\n            };\n          }",
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                const playerId2 = DefineFn2.EffectFn.getPlayerID(effect), fackCardId = DefineFn2.EffectFn.getCardID(effect), earthPairs = GameStateFn2.getCardTipStrBaSyouPairs(ctx3, \"\\u53BB\\u5730\\u7403\", fackCardId), phase2 = GameStateFn2.getPhase(ctx3);\n                for (let pair3 of earthPairs)\n                  ctx3 = GameStateFn2.mapItemState(ctx3, pair3[0], (is) => ({ ...is, isAttack: phase2[1] == \"\\u653B\\u6483\\u30B9\\u30C6\\u30C3\\u30D7\", isDefence: phase2[1] == \"\\u9632\\u5FA1\\u30B9\\u30C6\\u30C3\\u30D7\" })), ctx3 = GameStateFn2.doItemMove(ctx3, DefineFn2.AbsoluteBaSyouFn.of(playerId2, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A21\"), pair3);\n                return ctx3;\n              }"
                                }
                            ],
                            "groupKey": "出擊"
                        },
                        "去宇宙": {
                            "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n            const runtimeBattleArea = GameStateFn2.getRuntimeBattleArea(ctx3, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A22\");\n            if (runtimeBattleArea == \"\\u5730\\u7403\\u30A8\\u30EA\\u30A2\")\n              return null;\n            const playerId2 = DefineFn2.EffectFn.getPlayerID(effect), opponentPlayerId = DefineFn2.PlayerIDFn.getOpponent(playerId2);\n            let unitIds = GameStateFn2.getItemIdsByBasyou(ctx3, DefineFn2.AbsoluteBaSyouFn.of(playerId2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\")).filter((cardId) => GameStateFn2.getSetGroupRoot(ctx3, cardId) == cardId).filter((cardId) => GameStateFn2.getCardBattleArea(ctx3, cardId).includes(runtimeBattleArea)).filter((cardId) => GameStateFn2.getCard(ctx3, cardId).isRoll != !0);\n            const opponentUnitIds = GameStateFn2.getBattleGroup(ctx3, DefineFn2.AbsoluteBaSyouFn.of(opponentPlayerId, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A22\"));\n            if (opponentUnitIds.length) {\n              const ges = GameStateFn2.getGlobalEffects(ctx3, null);\n              if (GameStateFn2.isABattleGroup(ctx3, [\"\\u9AD8\\u6A5F\\u52D5\"], opponentUnitIds[0], { ges }))\n                unitIds = unitIds.filter((id) => GameStateFn2.isSetGroupHasA(ctx3, [\"\\u9AD8\\u6A5F\\u52D5\"], id, { ges }));\n            }\n            return {\n              title: [\"\\u30AB\\u30FC\\u30C9\", unitIds.map((id) => {\n                return [id, GameStateFn2.getItemBaSyou(ctx3, id)];\n              }), []],\n              flags: { isGoBattleArea2: !0 }\n            };\n          }",
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                const playerId2 = DefineFn2.EffectFn.getPlayerID(effect), fackCardId = DefineFn2.EffectFn.getCardID(effect), spacePairs = GameStateFn2.getCardTipStrBaSyouPairs(ctx3, \"\\u53BB\\u5B87\\u5B99\", fackCardId), phase2 = GameStateFn2.getPhase(ctx3);\n                for (let pair3 of spacePairs)\n                  ctx3 = GameStateFn2.mapItemState(ctx3, pair3[0], (is) => ({ ...is, isAttack: phase2[1] == \"\\u653B\\u6483\\u30B9\\u30C6\\u30C3\\u30D7\", isDefence: phase2[1] == \"\\u9632\\u5FA1\\u30B9\\u30C6\\u30C3\\u30D7\" })), ctx3 = GameStateFn2.doItemMove(ctx3, DefineFn2.AbsoluteBaSyouFn.of(playerId2, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A22\"), pair3);\n                return ctx3 = GameStateFn2.checkIsBattle(ctx3), ctx3;\n              }"
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
            "id": 1500,
            "description": "onEvent: GameEventOnMove [\"PlayerA_8\"]",
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
                            "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n            const runtimeBattleArea = GameStateFn2.getRuntimeBattleArea(ctx3, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A21\");\n            if (runtimeBattleArea == \"\\u5B87\\u5B99\\u30A8\\u30EA\\u30A2\")\n              return null;\n            const playerId2 = DefineFn2.EffectFn.getPlayerID(effect), opponentPlayerId = DefineFn2.PlayerIDFn.getOpponent(playerId2);\n            let unitIds = GameStateFn2.getItemIdsByBasyou(ctx3, DefineFn2.AbsoluteBaSyouFn.of(playerId2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\")).filter((cardId) => GameStateFn2.getSetGroupRoot(ctx3, cardId) == cardId).filter((cardId) => GameStateFn2.getCardBattleArea(ctx3, cardId).includes(runtimeBattleArea)).filter((cardId) => GameStateFn2.getCard(ctx3, cardId).isRoll != !0);\n            const opponentUnitIds = GameStateFn2.getBattleGroup(ctx3, DefineFn2.AbsoluteBaSyouFn.of(opponentPlayerId, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A21\"));\n            if (opponentUnitIds.length) {\n              const ges = GameStateFn2.getGlobalEffects(ctx3, null);\n              if (GameStateFn2.isABattleGroup(ctx3, [\"\\u9AD8\\u6A5F\\u52D5\"], opponentUnitIds[0], { ges }))\n                unitIds = unitIds.filter((id) => GameStateFn2.isSetGroupHasA(ctx3, [\"\\u9AD8\\u6A5F\\u52D5\"], id, { ges }));\n            }\n            return {\n              title: [\"\\u30AB\\u30FC\\u30C9\", unitIds.map((id) => {\n                return [id, GameStateFn2.getItemBaSyou(ctx3, id)];\n              }), []],\n              flags: { isGoBattleArea1: !0 }\n            };\n          }",
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                const playerId2 = DefineFn2.EffectFn.getPlayerID(effect), fackCardId = DefineFn2.EffectFn.getCardID(effect), earthPairs = GameStateFn2.getCardTipStrBaSyouPairs(ctx3, \"\\u53BB\\u5730\\u7403\", fackCardId), phase2 = GameStateFn2.getPhase(ctx3);\n                for (let pair3 of earthPairs)\n                  ctx3 = GameStateFn2.mapItemState(ctx3, pair3[0], (is) => ({ ...is, isAttack: phase2[1] == \"\\u653B\\u6483\\u30B9\\u30C6\\u30C3\\u30D7\", isDefence: phase2[1] == \"\\u9632\\u5FA1\\u30B9\\u30C6\\u30C3\\u30D7\" })), ctx3 = GameStateFn2.doItemMove(ctx3, DefineFn2.AbsoluteBaSyouFn.of(playerId2, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A21\"), pair3);\n                return ctx3;\n              }"
                                }
                            ],
                            "groupKey": "出擊"
                        },
                        "去宇宙": {
                            "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n            const runtimeBattleArea = GameStateFn2.getRuntimeBattleArea(ctx3, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A22\");\n            if (runtimeBattleArea == \"\\u5730\\u7403\\u30A8\\u30EA\\u30A2\")\n              return null;\n            const playerId2 = DefineFn2.EffectFn.getPlayerID(effect), opponentPlayerId = DefineFn2.PlayerIDFn.getOpponent(playerId2);\n            let unitIds = GameStateFn2.getItemIdsByBasyou(ctx3, DefineFn2.AbsoluteBaSyouFn.of(playerId2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\")).filter((cardId) => GameStateFn2.getSetGroupRoot(ctx3, cardId) == cardId).filter((cardId) => GameStateFn2.getCardBattleArea(ctx3, cardId).includes(runtimeBattleArea)).filter((cardId) => GameStateFn2.getCard(ctx3, cardId).isRoll != !0);\n            const opponentUnitIds = GameStateFn2.getBattleGroup(ctx3, DefineFn2.AbsoluteBaSyouFn.of(opponentPlayerId, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A22\"));\n            if (opponentUnitIds.length) {\n              const ges = GameStateFn2.getGlobalEffects(ctx3, null);\n              if (GameStateFn2.isABattleGroup(ctx3, [\"\\u9AD8\\u6A5F\\u52D5\"], opponentUnitIds[0], { ges }))\n                unitIds = unitIds.filter((id) => GameStateFn2.isSetGroupHasA(ctx3, [\"\\u9AD8\\u6A5F\\u52D5\"], id, { ges }));\n            }\n            return {\n              title: [\"\\u30AB\\u30FC\\u30C9\", unitIds.map((id) => {\n                return [id, GameStateFn2.getItemBaSyou(ctx3, id)];\n              }), []],\n              flags: { isGoBattleArea2: !0 }\n            };\n          }",
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                const playerId2 = DefineFn2.EffectFn.getPlayerID(effect), fackCardId = DefineFn2.EffectFn.getCardID(effect), spacePairs = GameStateFn2.getCardTipStrBaSyouPairs(ctx3, \"\\u53BB\\u5B87\\u5B99\", fackCardId), phase2 = GameStateFn2.getPhase(ctx3);\n                for (let pair3 of spacePairs)\n                  ctx3 = GameStateFn2.mapItemState(ctx3, pair3[0], (is) => ({ ...is, isAttack: phase2[1] == \"\\u653B\\u6483\\u30B9\\u30C6\\u30C3\\u30D7\", isDefence: phase2[1] == \"\\u9632\\u5FA1\\u30B9\\u30C6\\u30C3\\u30D7\" })), ctx3 = GameStateFn2.doItemMove(ctx3, DefineFn2.AbsoluteBaSyouFn.of(playerId2, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A22\"), pair3);\n                return ctx3 = GameStateFn2.checkIsBattle(ctx3), ctx3;\n              }"
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
            "id": 1499,
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
                            "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n            const runtimeBattleArea = GameStateFn2.getRuntimeBattleArea(ctx3, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A21\");\n            if (runtimeBattleArea == \"\\u5B87\\u5B99\\u30A8\\u30EA\\u30A2\")\n              return null;\n            const playerId2 = DefineFn2.EffectFn.getPlayerID(effect), opponentPlayerId = DefineFn2.PlayerIDFn.getOpponent(playerId2);\n            let unitIds = GameStateFn2.getItemIdsByBasyou(ctx3, DefineFn2.AbsoluteBaSyouFn.of(playerId2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\")).filter((cardId) => GameStateFn2.getSetGroupRoot(ctx3, cardId) == cardId).filter((cardId) => GameStateFn2.getCardBattleArea(ctx3, cardId).includes(runtimeBattleArea)).filter((cardId) => GameStateFn2.getCard(ctx3, cardId).isRoll != !0);\n            const opponentUnitIds = GameStateFn2.getBattleGroup(ctx3, DefineFn2.AbsoluteBaSyouFn.of(opponentPlayerId, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A21\"));\n            if (opponentUnitIds.length) {\n              const ges = GameStateFn2.getGlobalEffects(ctx3, null);\n              if (GameStateFn2.isABattleGroup(ctx3, [\"\\u9AD8\\u6A5F\\u52D5\"], opponentUnitIds[0], { ges }))\n                unitIds = unitIds.filter((id) => GameStateFn2.isSetGroupHasA(ctx3, [\"\\u9AD8\\u6A5F\\u52D5\"], id, { ges }));\n            }\n            return {\n              title: [\"\\u30AB\\u30FC\\u30C9\", unitIds.map((id) => {\n                return [id, GameStateFn2.getItemBaSyou(ctx3, id)];\n              }), []],\n              flags: { isGoBattleArea1: !0 }\n            };\n          }",
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                const playerId2 = DefineFn2.EffectFn.getPlayerID(effect), fackCardId = DefineFn2.EffectFn.getCardID(effect), earthPairs = GameStateFn2.getCardTipStrBaSyouPairs(ctx3, \"\\u53BB\\u5730\\u7403\", fackCardId), phase2 = GameStateFn2.getPhase(ctx3);\n                for (let pair3 of earthPairs)\n                  ctx3 = GameStateFn2.mapItemState(ctx3, pair3[0], (is) => ({ ...is, isAttack: phase2[1] == \"\\u653B\\u6483\\u30B9\\u30C6\\u30C3\\u30D7\", isDefence: phase2[1] == \"\\u9632\\u5FA1\\u30B9\\u30C6\\u30C3\\u30D7\" })), ctx3 = GameStateFn2.doItemMove(ctx3, DefineFn2.AbsoluteBaSyouFn.of(playerId2, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A21\"), pair3);\n                return ctx3;\n              }"
                                }
                            ],
                            "groupKey": "出擊"
                        },
                        "去宇宙": {
                            "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n            const runtimeBattleArea = GameStateFn2.getRuntimeBattleArea(ctx3, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A22\");\n            if (runtimeBattleArea == \"\\u5730\\u7403\\u30A8\\u30EA\\u30A2\")\n              return null;\n            const playerId2 = DefineFn2.EffectFn.getPlayerID(effect), opponentPlayerId = DefineFn2.PlayerIDFn.getOpponent(playerId2);\n            let unitIds = GameStateFn2.getItemIdsByBasyou(ctx3, DefineFn2.AbsoluteBaSyouFn.of(playerId2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\")).filter((cardId) => GameStateFn2.getSetGroupRoot(ctx3, cardId) == cardId).filter((cardId) => GameStateFn2.getCardBattleArea(ctx3, cardId).includes(runtimeBattleArea)).filter((cardId) => GameStateFn2.getCard(ctx3, cardId).isRoll != !0);\n            const opponentUnitIds = GameStateFn2.getBattleGroup(ctx3, DefineFn2.AbsoluteBaSyouFn.of(opponentPlayerId, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A22\"));\n            if (opponentUnitIds.length) {\n              const ges = GameStateFn2.getGlobalEffects(ctx3, null);\n              if (GameStateFn2.isABattleGroup(ctx3, [\"\\u9AD8\\u6A5F\\u52D5\"], opponentUnitIds[0], { ges }))\n                unitIds = unitIds.filter((id) => GameStateFn2.isSetGroupHasA(ctx3, [\"\\u9AD8\\u6A5F\\u52D5\"], id, { ges }));\n            }\n            return {\n              title: [\"\\u30AB\\u30FC\\u30C9\", unitIds.map((id) => {\n                return [id, GameStateFn2.getItemBaSyou(ctx3, id)];\n              }), []],\n              flags: { isGoBattleArea2: !0 }\n            };\n          }",
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                const playerId2 = DefineFn2.EffectFn.getPlayerID(effect), fackCardId = DefineFn2.EffectFn.getCardID(effect), spacePairs = GameStateFn2.getCardTipStrBaSyouPairs(ctx3, \"\\u53BB\\u5B87\\u5B99\", fackCardId), phase2 = GameStateFn2.getPhase(ctx3);\n                for (let pair3 of spacePairs)\n                  ctx3 = GameStateFn2.mapItemState(ctx3, pair3[0], (is) => ({ ...is, isAttack: phase2[1] == \"\\u653B\\u6483\\u30B9\\u30C6\\u30C3\\u30D7\", isDefence: phase2[1] == \"\\u9632\\u5FA1\\u30B9\\u30C6\\u30C3\\u30D7\" })), ctx3 = GameStateFn2.doItemMove(ctx3, DefineFn2.AbsoluteBaSyouFn.of(playerId2, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A22\"), pair3);\n                return ctx3 = GameStateFn2.checkIsBattle(ctx3), ctx3;\n              }"
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
            "id": 1498,
            "description": "onSetPhase:戦闘フェイズ,防御ステップ,規定の効果"
        },
        {
            "id": 1497,
            "description": "onSetPhase:戦闘フェイズ,防御ステップ,フリータイミング"
        },
        {
            "id": 1496,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 1495,
            "description": "onSetPhase:戦闘フェイズ,防御ステップ,ステップ開始"
        },
        {
            "id": 1494,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 1493,
            "description": "onSetPhase:戦闘フェイズ,攻撃ステップ,ステップ終了"
        },
        {
            "id": 1492,
            "description": "onSetPhase:戦闘フェイズ,攻撃ステップ,フリータイミング2"
        },
        {
            "id": 1491,
            "description": "onEffectEnd: 出擊"
        },
        {
            "id": 1490,
            "description": "onEvent: このカードが攻撃に出撃した場合 [\"PlayerB_63\",\"PlayerB_65\"]",
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
                            "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n            const runtimeBattleArea = GameStateFn2.getRuntimeBattleArea(ctx3, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A21\");\n            if (runtimeBattleArea == \"\\u5B87\\u5B99\\u30A8\\u30EA\\u30A2\")\n              return null;\n            const playerId2 = DefineFn2.EffectFn.getPlayerID(effect), opponentPlayerId = DefineFn2.PlayerIDFn.getOpponent(playerId2);\n            let unitIds = GameStateFn2.getItemIdsByBasyou(ctx3, DefineFn2.AbsoluteBaSyouFn.of(playerId2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\")).filter((cardId) => GameStateFn2.getSetGroupRoot(ctx3, cardId) == cardId).filter((cardId) => GameStateFn2.getCardBattleArea(ctx3, cardId).includes(runtimeBattleArea)).filter((cardId) => GameStateFn2.getCard(ctx3, cardId).isRoll != !0);\n            const opponentUnitIds = GameStateFn2.getBattleGroup(ctx3, DefineFn2.AbsoluteBaSyouFn.of(opponentPlayerId, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A21\"));\n            if (opponentUnitIds.length) {\n              const ges = GameStateFn2.getGlobalEffects(ctx3, null);\n              if (GameStateFn2.isABattleGroup(ctx3, [\"\\u9AD8\\u6A5F\\u52D5\"], opponentUnitIds[0], { ges }))\n                unitIds = unitIds.filter((id) => GameStateFn2.isSetGroupHasA(ctx3, [\"\\u9AD8\\u6A5F\\u52D5\"], id, { ges }));\n            }\n            return {\n              title: [\"\\u30AB\\u30FC\\u30C9\", unitIds.map((id) => {\n                return [id, GameStateFn2.getItemBaSyou(ctx3, id)];\n              }), []],\n              flags: { isGoBattleArea1: !0 }\n            };\n          }",
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                const playerId2 = DefineFn2.EffectFn.getPlayerID(effect), fackCardId = DefineFn2.EffectFn.getCardID(effect), earthPairs = GameStateFn2.getCardTipStrBaSyouPairs(ctx3, \"\\u53BB\\u5730\\u7403\", fackCardId), phase2 = GameStateFn2.getPhase(ctx3);\n                for (let pair3 of earthPairs)\n                  ctx3 = GameStateFn2.mapItemState(ctx3, pair3[0], (is) => ({ ...is, isAttack: phase2[1] == \"\\u653B\\u6483\\u30B9\\u30C6\\u30C3\\u30D7\", isDefence: phase2[1] == \"\\u9632\\u5FA1\\u30B9\\u30C6\\u30C3\\u30D7\" })), ctx3 = GameStateFn2.doItemMove(ctx3, DefineFn2.AbsoluteBaSyouFn.of(playerId2, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A21\"), pair3);\n                return ctx3;\n              }"
                                }
                            ],
                            "groupKey": "出擊"
                        },
                        "去宇宙": {
                            "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n            const runtimeBattleArea = GameStateFn2.getRuntimeBattleArea(ctx3, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A22\");\n            if (runtimeBattleArea == \"\\u5730\\u7403\\u30A8\\u30EA\\u30A2\")\n              return null;\n            const playerId2 = DefineFn2.EffectFn.getPlayerID(effect), opponentPlayerId = DefineFn2.PlayerIDFn.getOpponent(playerId2);\n            let unitIds = GameStateFn2.getItemIdsByBasyou(ctx3, DefineFn2.AbsoluteBaSyouFn.of(playerId2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\")).filter((cardId) => GameStateFn2.getSetGroupRoot(ctx3, cardId) == cardId).filter((cardId) => GameStateFn2.getCardBattleArea(ctx3, cardId).includes(runtimeBattleArea)).filter((cardId) => GameStateFn2.getCard(ctx3, cardId).isRoll != !0);\n            const opponentUnitIds = GameStateFn2.getBattleGroup(ctx3, DefineFn2.AbsoluteBaSyouFn.of(opponentPlayerId, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A22\"));\n            if (opponentUnitIds.length) {\n              const ges = GameStateFn2.getGlobalEffects(ctx3, null);\n              if (GameStateFn2.isABattleGroup(ctx3, [\"\\u9AD8\\u6A5F\\u52D5\"], opponentUnitIds[0], { ges }))\n                unitIds = unitIds.filter((id) => GameStateFn2.isSetGroupHasA(ctx3, [\"\\u9AD8\\u6A5F\\u52D5\"], id, { ges }));\n            }\n            return {\n              title: [\"\\u30AB\\u30FC\\u30C9\", unitIds.map((id) => {\n                return [id, GameStateFn2.getItemBaSyou(ctx3, id)];\n              }), []],\n              flags: { isGoBattleArea2: !0 }\n            };\n          }",
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                const playerId2 = DefineFn2.EffectFn.getPlayerID(effect), fackCardId = DefineFn2.EffectFn.getCardID(effect), spacePairs = GameStateFn2.getCardTipStrBaSyouPairs(ctx3, \"\\u53BB\\u5B87\\u5B99\", fackCardId), phase2 = GameStateFn2.getPhase(ctx3);\n                for (let pair3 of spacePairs)\n                  ctx3 = GameStateFn2.mapItemState(ctx3, pair3[0], (is) => ({ ...is, isAttack: phase2[1] == \"\\u653B\\u6483\\u30B9\\u30C6\\u30C3\\u30D7\", isDefence: phase2[1] == \"\\u9632\\u5FA1\\u30B9\\u30C6\\u30C3\\u30D7\" })), ctx3 = GameStateFn2.doItemMove(ctx3, DefineFn2.AbsoluteBaSyouFn.of(playerId2, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A22\"), pair3);\n                return ctx3 = GameStateFn2.checkIsBattle(ctx3), ctx3;\n              }"
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
            "id": 1489,
            "description": "onItemMove:PlayerB_65 = [\"PlayerB\",\"配備エリア\"] => [\"PlayerB\",\"戦闘エリア2\"]",
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
                            "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n            const runtimeBattleArea = GameStateFn2.getRuntimeBattleArea(ctx3, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A21\");\n            if (runtimeBattleArea == \"\\u5B87\\u5B99\\u30A8\\u30EA\\u30A2\")\n              return null;\n            const playerId2 = DefineFn2.EffectFn.getPlayerID(effect), opponentPlayerId = DefineFn2.PlayerIDFn.getOpponent(playerId2);\n            let unitIds = GameStateFn2.getItemIdsByBasyou(ctx3, DefineFn2.AbsoluteBaSyouFn.of(playerId2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\")).filter((cardId) => GameStateFn2.getSetGroupRoot(ctx3, cardId) == cardId).filter((cardId) => GameStateFn2.getCardBattleArea(ctx3, cardId).includes(runtimeBattleArea)).filter((cardId) => GameStateFn2.getCard(ctx3, cardId).isRoll != !0);\n            const opponentUnitIds = GameStateFn2.getBattleGroup(ctx3, DefineFn2.AbsoluteBaSyouFn.of(opponentPlayerId, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A21\"));\n            if (opponentUnitIds.length) {\n              const ges = GameStateFn2.getGlobalEffects(ctx3, null);\n              if (GameStateFn2.isABattleGroup(ctx3, [\"\\u9AD8\\u6A5F\\u52D5\"], opponentUnitIds[0], { ges }))\n                unitIds = unitIds.filter((id) => GameStateFn2.isSetGroupHasA(ctx3, [\"\\u9AD8\\u6A5F\\u52D5\"], id, { ges }));\n            }\n            return {\n              title: [\"\\u30AB\\u30FC\\u30C9\", unitIds.map((id) => {\n                return [id, GameStateFn2.getItemBaSyou(ctx3, id)];\n              }), []],\n              flags: { isGoBattleArea1: !0 }\n            };\n          }",
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                const playerId2 = DefineFn2.EffectFn.getPlayerID(effect), fackCardId = DefineFn2.EffectFn.getCardID(effect), earthPairs = GameStateFn2.getCardTipStrBaSyouPairs(ctx3, \"\\u53BB\\u5730\\u7403\", fackCardId), phase2 = GameStateFn2.getPhase(ctx3);\n                for (let pair3 of earthPairs)\n                  ctx3 = GameStateFn2.mapItemState(ctx3, pair3[0], (is) => ({ ...is, isAttack: phase2[1] == \"\\u653B\\u6483\\u30B9\\u30C6\\u30C3\\u30D7\", isDefence: phase2[1] == \"\\u9632\\u5FA1\\u30B9\\u30C6\\u30C3\\u30D7\" })), ctx3 = GameStateFn2.doItemMove(ctx3, DefineFn2.AbsoluteBaSyouFn.of(playerId2, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A21\"), pair3);\n                return ctx3;\n              }"
                                }
                            ],
                            "groupKey": "出擊"
                        },
                        "去宇宙": {
                            "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n            const runtimeBattleArea = GameStateFn2.getRuntimeBattleArea(ctx3, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A22\");\n            if (runtimeBattleArea == \"\\u5730\\u7403\\u30A8\\u30EA\\u30A2\")\n              return null;\n            const playerId2 = DefineFn2.EffectFn.getPlayerID(effect), opponentPlayerId = DefineFn2.PlayerIDFn.getOpponent(playerId2);\n            let unitIds = GameStateFn2.getItemIdsByBasyou(ctx3, DefineFn2.AbsoluteBaSyouFn.of(playerId2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\")).filter((cardId) => GameStateFn2.getSetGroupRoot(ctx3, cardId) == cardId).filter((cardId) => GameStateFn2.getCardBattleArea(ctx3, cardId).includes(runtimeBattleArea)).filter((cardId) => GameStateFn2.getCard(ctx3, cardId).isRoll != !0);\n            const opponentUnitIds = GameStateFn2.getBattleGroup(ctx3, DefineFn2.AbsoluteBaSyouFn.of(opponentPlayerId, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A22\"));\n            if (opponentUnitIds.length) {\n              const ges = GameStateFn2.getGlobalEffects(ctx3, null);\n              if (GameStateFn2.isABattleGroup(ctx3, [\"\\u9AD8\\u6A5F\\u52D5\"], opponentUnitIds[0], { ges }))\n                unitIds = unitIds.filter((id) => GameStateFn2.isSetGroupHasA(ctx3, [\"\\u9AD8\\u6A5F\\u52D5\"], id, { ges }));\n            }\n            return {\n              title: [\"\\u30AB\\u30FC\\u30C9\", unitIds.map((id) => {\n                return [id, GameStateFn2.getItemBaSyou(ctx3, id)];\n              }), []],\n              flags: { isGoBattleArea2: !0 }\n            };\n          }",
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                const playerId2 = DefineFn2.EffectFn.getPlayerID(effect), fackCardId = DefineFn2.EffectFn.getCardID(effect), spacePairs = GameStateFn2.getCardTipStrBaSyouPairs(ctx3, \"\\u53BB\\u5B87\\u5B99\", fackCardId), phase2 = GameStateFn2.getPhase(ctx3);\n                for (let pair3 of spacePairs)\n                  ctx3 = GameStateFn2.mapItemState(ctx3, pair3[0], (is) => ({ ...is, isAttack: phase2[1] == \"\\u653B\\u6483\\u30B9\\u30C6\\u30C3\\u30D7\", isDefence: phase2[1] == \"\\u9632\\u5FA1\\u30B9\\u30C6\\u30C3\\u30D7\" })), ctx3 = GameStateFn2.doItemMove(ctx3, DefineFn2.AbsoluteBaSyouFn.of(playerId2, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A22\"), pair3);\n                return ctx3 = GameStateFn2.checkIsBattle(ctx3), ctx3;\n              }"
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
            "id": 1488,
            "description": "onEvent: GameEventOnMove [\"PlayerB_65\"]",
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
                            "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n            const runtimeBattleArea = GameStateFn2.getRuntimeBattleArea(ctx3, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A21\");\n            if (runtimeBattleArea == \"\\u5B87\\u5B99\\u30A8\\u30EA\\u30A2\")\n              return null;\n            const playerId2 = DefineFn2.EffectFn.getPlayerID(effect), opponentPlayerId = DefineFn2.PlayerIDFn.getOpponent(playerId2);\n            let unitIds = GameStateFn2.getItemIdsByBasyou(ctx3, DefineFn2.AbsoluteBaSyouFn.of(playerId2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\")).filter((cardId) => GameStateFn2.getSetGroupRoot(ctx3, cardId) == cardId).filter((cardId) => GameStateFn2.getCardBattleArea(ctx3, cardId).includes(runtimeBattleArea)).filter((cardId) => GameStateFn2.getCard(ctx3, cardId).isRoll != !0);\n            const opponentUnitIds = GameStateFn2.getBattleGroup(ctx3, DefineFn2.AbsoluteBaSyouFn.of(opponentPlayerId, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A21\"));\n            if (opponentUnitIds.length) {\n              const ges = GameStateFn2.getGlobalEffects(ctx3, null);\n              if (GameStateFn2.isABattleGroup(ctx3, [\"\\u9AD8\\u6A5F\\u52D5\"], opponentUnitIds[0], { ges }))\n                unitIds = unitIds.filter((id) => GameStateFn2.isSetGroupHasA(ctx3, [\"\\u9AD8\\u6A5F\\u52D5\"], id, { ges }));\n            }\n            return {\n              title: [\"\\u30AB\\u30FC\\u30C9\", unitIds.map((id) => {\n                return [id, GameStateFn2.getItemBaSyou(ctx3, id)];\n              }), []],\n              flags: { isGoBattleArea1: !0 }\n            };\n          }",
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                const playerId2 = DefineFn2.EffectFn.getPlayerID(effect), fackCardId = DefineFn2.EffectFn.getCardID(effect), earthPairs = GameStateFn2.getCardTipStrBaSyouPairs(ctx3, \"\\u53BB\\u5730\\u7403\", fackCardId), phase2 = GameStateFn2.getPhase(ctx3);\n                for (let pair3 of earthPairs)\n                  ctx3 = GameStateFn2.mapItemState(ctx3, pair3[0], (is) => ({ ...is, isAttack: phase2[1] == \"\\u653B\\u6483\\u30B9\\u30C6\\u30C3\\u30D7\", isDefence: phase2[1] == \"\\u9632\\u5FA1\\u30B9\\u30C6\\u30C3\\u30D7\" })), ctx3 = GameStateFn2.doItemMove(ctx3, DefineFn2.AbsoluteBaSyouFn.of(playerId2, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A21\"), pair3);\n                return ctx3;\n              }"
                                }
                            ],
                            "groupKey": "出擊"
                        },
                        "去宇宙": {
                            "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n            const runtimeBattleArea = GameStateFn2.getRuntimeBattleArea(ctx3, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A22\");\n            if (runtimeBattleArea == \"\\u5730\\u7403\\u30A8\\u30EA\\u30A2\")\n              return null;\n            const playerId2 = DefineFn2.EffectFn.getPlayerID(effect), opponentPlayerId = DefineFn2.PlayerIDFn.getOpponent(playerId2);\n            let unitIds = GameStateFn2.getItemIdsByBasyou(ctx3, DefineFn2.AbsoluteBaSyouFn.of(playerId2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\")).filter((cardId) => GameStateFn2.getSetGroupRoot(ctx3, cardId) == cardId).filter((cardId) => GameStateFn2.getCardBattleArea(ctx3, cardId).includes(runtimeBattleArea)).filter((cardId) => GameStateFn2.getCard(ctx3, cardId).isRoll != !0);\n            const opponentUnitIds = GameStateFn2.getBattleGroup(ctx3, DefineFn2.AbsoluteBaSyouFn.of(opponentPlayerId, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A22\"));\n            if (opponentUnitIds.length) {\n              const ges = GameStateFn2.getGlobalEffects(ctx3, null);\n              if (GameStateFn2.isABattleGroup(ctx3, [\"\\u9AD8\\u6A5F\\u52D5\"], opponentUnitIds[0], { ges }))\n                unitIds = unitIds.filter((id) => GameStateFn2.isSetGroupHasA(ctx3, [\"\\u9AD8\\u6A5F\\u52D5\"], id, { ges }));\n            }\n            return {\n              title: [\"\\u30AB\\u30FC\\u30C9\", unitIds.map((id) => {\n                return [id, GameStateFn2.getItemBaSyou(ctx3, id)];\n              }), []],\n              flags: { isGoBattleArea2: !0 }\n            };\n          }",
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                const playerId2 = DefineFn2.EffectFn.getPlayerID(effect), fackCardId = DefineFn2.EffectFn.getCardID(effect), spacePairs = GameStateFn2.getCardTipStrBaSyouPairs(ctx3, \"\\u53BB\\u5B87\\u5B99\", fackCardId), phase2 = GameStateFn2.getPhase(ctx3);\n                for (let pair3 of spacePairs)\n                  ctx3 = GameStateFn2.mapItemState(ctx3, pair3[0], (is) => ({ ...is, isAttack: phase2[1] == \"\\u653B\\u6483\\u30B9\\u30C6\\u30C3\\u30D7\", isDefence: phase2[1] == \"\\u9632\\u5FA1\\u30B9\\u30C6\\u30C3\\u30D7\" })), ctx3 = GameStateFn2.doItemMove(ctx3, DefineFn2.AbsoluteBaSyouFn.of(playerId2, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A22\"), pair3);\n                return ctx3 = GameStateFn2.checkIsBattle(ctx3), ctx3;\n              }"
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
            "id": 1487,
            "description": "onItemMove:PlayerB_63 = [\"PlayerB\",\"配備エリア\"] => [\"PlayerB\",\"戦闘エリア1\"]",
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
                            "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n            const runtimeBattleArea = GameStateFn2.getRuntimeBattleArea(ctx3, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A21\");\n            if (runtimeBattleArea == \"\\u5B87\\u5B99\\u30A8\\u30EA\\u30A2\")\n              return null;\n            const playerId2 = DefineFn2.EffectFn.getPlayerID(effect), opponentPlayerId = DefineFn2.PlayerIDFn.getOpponent(playerId2);\n            let unitIds = GameStateFn2.getItemIdsByBasyou(ctx3, DefineFn2.AbsoluteBaSyouFn.of(playerId2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\")).filter((cardId) => GameStateFn2.getSetGroupRoot(ctx3, cardId) == cardId).filter((cardId) => GameStateFn2.getCardBattleArea(ctx3, cardId).includes(runtimeBattleArea)).filter((cardId) => GameStateFn2.getCard(ctx3, cardId).isRoll != !0);\n            const opponentUnitIds = GameStateFn2.getBattleGroup(ctx3, DefineFn2.AbsoluteBaSyouFn.of(opponentPlayerId, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A21\"));\n            if (opponentUnitIds.length) {\n              const ges = GameStateFn2.getGlobalEffects(ctx3, null);\n              if (GameStateFn2.isABattleGroup(ctx3, [\"\\u9AD8\\u6A5F\\u52D5\"], opponentUnitIds[0], { ges }))\n                unitIds = unitIds.filter((id) => GameStateFn2.isSetGroupHasA(ctx3, [\"\\u9AD8\\u6A5F\\u52D5\"], id, { ges }));\n            }\n            return {\n              title: [\"\\u30AB\\u30FC\\u30C9\", unitIds.map((id) => {\n                return [id, GameStateFn2.getItemBaSyou(ctx3, id)];\n              }), []],\n              flags: { isGoBattleArea1: !0 }\n            };\n          }",
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                const playerId2 = DefineFn2.EffectFn.getPlayerID(effect), fackCardId = DefineFn2.EffectFn.getCardID(effect), earthPairs = GameStateFn2.getCardTipStrBaSyouPairs(ctx3, \"\\u53BB\\u5730\\u7403\", fackCardId), phase2 = GameStateFn2.getPhase(ctx3);\n                for (let pair3 of earthPairs)\n                  ctx3 = GameStateFn2.mapItemState(ctx3, pair3[0], (is) => ({ ...is, isAttack: phase2[1] == \"\\u653B\\u6483\\u30B9\\u30C6\\u30C3\\u30D7\", isDefence: phase2[1] == \"\\u9632\\u5FA1\\u30B9\\u30C6\\u30C3\\u30D7\" })), ctx3 = GameStateFn2.doItemMove(ctx3, DefineFn2.AbsoluteBaSyouFn.of(playerId2, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A21\"), pair3);\n                return ctx3;\n              }"
                                }
                            ],
                            "groupKey": "出擊"
                        },
                        "去宇宙": {
                            "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n            const runtimeBattleArea = GameStateFn2.getRuntimeBattleArea(ctx3, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A22\");\n            if (runtimeBattleArea == \"\\u5730\\u7403\\u30A8\\u30EA\\u30A2\")\n              return null;\n            const playerId2 = DefineFn2.EffectFn.getPlayerID(effect), opponentPlayerId = DefineFn2.PlayerIDFn.getOpponent(playerId2);\n            let unitIds = GameStateFn2.getItemIdsByBasyou(ctx3, DefineFn2.AbsoluteBaSyouFn.of(playerId2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\")).filter((cardId) => GameStateFn2.getSetGroupRoot(ctx3, cardId) == cardId).filter((cardId) => GameStateFn2.getCardBattleArea(ctx3, cardId).includes(runtimeBattleArea)).filter((cardId) => GameStateFn2.getCard(ctx3, cardId).isRoll != !0);\n            const opponentUnitIds = GameStateFn2.getBattleGroup(ctx3, DefineFn2.AbsoluteBaSyouFn.of(opponentPlayerId, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A22\"));\n            if (opponentUnitIds.length) {\n              const ges = GameStateFn2.getGlobalEffects(ctx3, null);\n              if (GameStateFn2.isABattleGroup(ctx3, [\"\\u9AD8\\u6A5F\\u52D5\"], opponentUnitIds[0], { ges }))\n                unitIds = unitIds.filter((id) => GameStateFn2.isSetGroupHasA(ctx3, [\"\\u9AD8\\u6A5F\\u52D5\"], id, { ges }));\n            }\n            return {\n              title: [\"\\u30AB\\u30FC\\u30C9\", unitIds.map((id) => {\n                return [id, GameStateFn2.getItemBaSyou(ctx3, id)];\n              }), []],\n              flags: { isGoBattleArea2: !0 }\n            };\n          }",
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                const playerId2 = DefineFn2.EffectFn.getPlayerID(effect), fackCardId = DefineFn2.EffectFn.getCardID(effect), spacePairs = GameStateFn2.getCardTipStrBaSyouPairs(ctx3, \"\\u53BB\\u5B87\\u5B99\", fackCardId), phase2 = GameStateFn2.getPhase(ctx3);\n                for (let pair3 of spacePairs)\n                  ctx3 = GameStateFn2.mapItemState(ctx3, pair3[0], (is) => ({ ...is, isAttack: phase2[1] == \"\\u653B\\u6483\\u30B9\\u30C6\\u30C3\\u30D7\", isDefence: phase2[1] == \"\\u9632\\u5FA1\\u30B9\\u30C6\\u30C3\\u30D7\" })), ctx3 = GameStateFn2.doItemMove(ctx3, DefineFn2.AbsoluteBaSyouFn.of(playerId2, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A22\"), pair3);\n                return ctx3 = GameStateFn2.checkIsBattle(ctx3), ctx3;\n              }"
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
            "id": 1486,
            "description": "onEvent: GameEventOnMove [\"PlayerB_63\"]",
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
                            "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n            const runtimeBattleArea = GameStateFn2.getRuntimeBattleArea(ctx3, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A21\");\n            if (runtimeBattleArea == \"\\u5B87\\u5B99\\u30A8\\u30EA\\u30A2\")\n              return null;\n            const playerId2 = DefineFn2.EffectFn.getPlayerID(effect), opponentPlayerId = DefineFn2.PlayerIDFn.getOpponent(playerId2);\n            let unitIds = GameStateFn2.getItemIdsByBasyou(ctx3, DefineFn2.AbsoluteBaSyouFn.of(playerId2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\")).filter((cardId) => GameStateFn2.getSetGroupRoot(ctx3, cardId) == cardId).filter((cardId) => GameStateFn2.getCardBattleArea(ctx3, cardId).includes(runtimeBattleArea)).filter((cardId) => GameStateFn2.getCard(ctx3, cardId).isRoll != !0);\n            const opponentUnitIds = GameStateFn2.getBattleGroup(ctx3, DefineFn2.AbsoluteBaSyouFn.of(opponentPlayerId, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A21\"));\n            if (opponentUnitIds.length) {\n              const ges = GameStateFn2.getGlobalEffects(ctx3, null);\n              if (GameStateFn2.isABattleGroup(ctx3, [\"\\u9AD8\\u6A5F\\u52D5\"], opponentUnitIds[0], { ges }))\n                unitIds = unitIds.filter((id) => GameStateFn2.isSetGroupHasA(ctx3, [\"\\u9AD8\\u6A5F\\u52D5\"], id, { ges }));\n            }\n            return {\n              title: [\"\\u30AB\\u30FC\\u30C9\", unitIds.map((id) => {\n                return [id, GameStateFn2.getItemBaSyou(ctx3, id)];\n              }), []],\n              flags: { isGoBattleArea1: !0 }\n            };\n          }",
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                const playerId2 = DefineFn2.EffectFn.getPlayerID(effect), fackCardId = DefineFn2.EffectFn.getCardID(effect), earthPairs = GameStateFn2.getCardTipStrBaSyouPairs(ctx3, \"\\u53BB\\u5730\\u7403\", fackCardId), phase2 = GameStateFn2.getPhase(ctx3);\n                for (let pair3 of earthPairs)\n                  ctx3 = GameStateFn2.mapItemState(ctx3, pair3[0], (is) => ({ ...is, isAttack: phase2[1] == \"\\u653B\\u6483\\u30B9\\u30C6\\u30C3\\u30D7\", isDefence: phase2[1] == \"\\u9632\\u5FA1\\u30B9\\u30C6\\u30C3\\u30D7\" })), ctx3 = GameStateFn2.doItemMove(ctx3, DefineFn2.AbsoluteBaSyouFn.of(playerId2, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A21\"), pair3);\n                return ctx3;\n              }"
                                }
                            ],
                            "groupKey": "出擊"
                        },
                        "去宇宙": {
                            "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n            const runtimeBattleArea = GameStateFn2.getRuntimeBattleArea(ctx3, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A22\");\n            if (runtimeBattleArea == \"\\u5730\\u7403\\u30A8\\u30EA\\u30A2\")\n              return null;\n            const playerId2 = DefineFn2.EffectFn.getPlayerID(effect), opponentPlayerId = DefineFn2.PlayerIDFn.getOpponent(playerId2);\n            let unitIds = GameStateFn2.getItemIdsByBasyou(ctx3, DefineFn2.AbsoluteBaSyouFn.of(playerId2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\")).filter((cardId) => GameStateFn2.getSetGroupRoot(ctx3, cardId) == cardId).filter((cardId) => GameStateFn2.getCardBattleArea(ctx3, cardId).includes(runtimeBattleArea)).filter((cardId) => GameStateFn2.getCard(ctx3, cardId).isRoll != !0);\n            const opponentUnitIds = GameStateFn2.getBattleGroup(ctx3, DefineFn2.AbsoluteBaSyouFn.of(opponentPlayerId, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A22\"));\n            if (opponentUnitIds.length) {\n              const ges = GameStateFn2.getGlobalEffects(ctx3, null);\n              if (GameStateFn2.isABattleGroup(ctx3, [\"\\u9AD8\\u6A5F\\u52D5\"], opponentUnitIds[0], { ges }))\n                unitIds = unitIds.filter((id) => GameStateFn2.isSetGroupHasA(ctx3, [\"\\u9AD8\\u6A5F\\u52D5\"], id, { ges }));\n            }\n            return {\n              title: [\"\\u30AB\\u30FC\\u30C9\", unitIds.map((id) => {\n                return [id, GameStateFn2.getItemBaSyou(ctx3, id)];\n              }), []],\n              flags: { isGoBattleArea2: !0 }\n            };\n          }",
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                const playerId2 = DefineFn2.EffectFn.getPlayerID(effect), fackCardId = DefineFn2.EffectFn.getCardID(effect), spacePairs = GameStateFn2.getCardTipStrBaSyouPairs(ctx3, \"\\u53BB\\u5B87\\u5B99\", fackCardId), phase2 = GameStateFn2.getPhase(ctx3);\n                for (let pair3 of spacePairs)\n                  ctx3 = GameStateFn2.mapItemState(ctx3, pair3[0], (is) => ({ ...is, isAttack: phase2[1] == \"\\u653B\\u6483\\u30B9\\u30C6\\u30C3\\u30D7\", isDefence: phase2[1] == \"\\u9632\\u5FA1\\u30B9\\u30C6\\u30C3\\u30D7\" })), ctx3 = GameStateFn2.doItemMove(ctx3, DefineFn2.AbsoluteBaSyouFn.of(playerId2, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A22\"), pair3);\n                return ctx3 = GameStateFn2.checkIsBattle(ctx3), ctx3;\n              }"
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
            "id": 1485,
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
                            "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n            const runtimeBattleArea = GameStateFn2.getRuntimeBattleArea(ctx3, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A21\");\n            if (runtimeBattleArea == \"\\u5B87\\u5B99\\u30A8\\u30EA\\u30A2\")\n              return null;\n            const playerId2 = DefineFn2.EffectFn.getPlayerID(effect), opponentPlayerId = DefineFn2.PlayerIDFn.getOpponent(playerId2);\n            let unitIds = GameStateFn2.getItemIdsByBasyou(ctx3, DefineFn2.AbsoluteBaSyouFn.of(playerId2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\")).filter((cardId) => GameStateFn2.getSetGroupRoot(ctx3, cardId) == cardId).filter((cardId) => GameStateFn2.getCardBattleArea(ctx3, cardId).includes(runtimeBattleArea)).filter((cardId) => GameStateFn2.getCard(ctx3, cardId).isRoll != !0);\n            const opponentUnitIds = GameStateFn2.getBattleGroup(ctx3, DefineFn2.AbsoluteBaSyouFn.of(opponentPlayerId, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A21\"));\n            if (opponentUnitIds.length) {\n              const ges = GameStateFn2.getGlobalEffects(ctx3, null);\n              if (GameStateFn2.isABattleGroup(ctx3, [\"\\u9AD8\\u6A5F\\u52D5\"], opponentUnitIds[0], { ges }))\n                unitIds = unitIds.filter((id) => GameStateFn2.isSetGroupHasA(ctx3, [\"\\u9AD8\\u6A5F\\u52D5\"], id, { ges }));\n            }\n            return {\n              title: [\"\\u30AB\\u30FC\\u30C9\", unitIds.map((id) => {\n                return [id, GameStateFn2.getItemBaSyou(ctx3, id)];\n              }), []],\n              flags: { isGoBattleArea1: !0 }\n            };\n          }",
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                const playerId2 = DefineFn2.EffectFn.getPlayerID(effect), fackCardId = DefineFn2.EffectFn.getCardID(effect), earthPairs = GameStateFn2.getCardTipStrBaSyouPairs(ctx3, \"\\u53BB\\u5730\\u7403\", fackCardId), phase2 = GameStateFn2.getPhase(ctx3);\n                for (let pair3 of earthPairs)\n                  ctx3 = GameStateFn2.mapItemState(ctx3, pair3[0], (is) => ({ ...is, isAttack: phase2[1] == \"\\u653B\\u6483\\u30B9\\u30C6\\u30C3\\u30D7\", isDefence: phase2[1] == \"\\u9632\\u5FA1\\u30B9\\u30C6\\u30C3\\u30D7\" })), ctx3 = GameStateFn2.doItemMove(ctx3, DefineFn2.AbsoluteBaSyouFn.of(playerId2, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A21\"), pair3);\n                return ctx3;\n              }"
                                }
                            ],
                            "groupKey": "出擊"
                        },
                        "去宇宙": {
                            "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n            const runtimeBattleArea = GameStateFn2.getRuntimeBattleArea(ctx3, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A22\");\n            if (runtimeBattleArea == \"\\u5730\\u7403\\u30A8\\u30EA\\u30A2\")\n              return null;\n            const playerId2 = DefineFn2.EffectFn.getPlayerID(effect), opponentPlayerId = DefineFn2.PlayerIDFn.getOpponent(playerId2);\n            let unitIds = GameStateFn2.getItemIdsByBasyou(ctx3, DefineFn2.AbsoluteBaSyouFn.of(playerId2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\")).filter((cardId) => GameStateFn2.getSetGroupRoot(ctx3, cardId) == cardId).filter((cardId) => GameStateFn2.getCardBattleArea(ctx3, cardId).includes(runtimeBattleArea)).filter((cardId) => GameStateFn2.getCard(ctx3, cardId).isRoll != !0);\n            const opponentUnitIds = GameStateFn2.getBattleGroup(ctx3, DefineFn2.AbsoluteBaSyouFn.of(opponentPlayerId, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A22\"));\n            if (opponentUnitIds.length) {\n              const ges = GameStateFn2.getGlobalEffects(ctx3, null);\n              if (GameStateFn2.isABattleGroup(ctx3, [\"\\u9AD8\\u6A5F\\u52D5\"], opponentUnitIds[0], { ges }))\n                unitIds = unitIds.filter((id) => GameStateFn2.isSetGroupHasA(ctx3, [\"\\u9AD8\\u6A5F\\u52D5\"], id, { ges }));\n            }\n            return {\n              title: [\"\\u30AB\\u30FC\\u30C9\", unitIds.map((id) => {\n                return [id, GameStateFn2.getItemBaSyou(ctx3, id)];\n              }), []],\n              flags: { isGoBattleArea2: !0 }\n            };\n          }",
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                const playerId2 = DefineFn2.EffectFn.getPlayerID(effect), fackCardId = DefineFn2.EffectFn.getCardID(effect), spacePairs = GameStateFn2.getCardTipStrBaSyouPairs(ctx3, \"\\u53BB\\u5B87\\u5B99\", fackCardId), phase2 = GameStateFn2.getPhase(ctx3);\n                for (let pair3 of spacePairs)\n                  ctx3 = GameStateFn2.mapItemState(ctx3, pair3[0], (is) => ({ ...is, isAttack: phase2[1] == \"\\u653B\\u6483\\u30B9\\u30C6\\u30C3\\u30D7\", isDefence: phase2[1] == \"\\u9632\\u5FA1\\u30B9\\u30C6\\u30C3\\u30D7\" })), ctx3 = GameStateFn2.doItemMove(ctx3, DefineFn2.AbsoluteBaSyouFn.of(playerId2, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A22\"), pair3);\n                return ctx3 = GameStateFn2.checkIsBattle(ctx3), ctx3;\n              }"
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
            "id": 1484,
            "description": "onSetPhase:戦闘フェイズ,攻撃ステップ,規定の効果"
        },
        {
            "id": 1483,
            "description": "onEvent: カット終了時 undefined"
        },
        {
            "id": 1482,
            "description": "onEffectEnd: （戦闘フェイズ）：自軍ユニット１枚は、ターン終了時まで「速攻」または「高機動」を得る。"
        },
        {
            "id": 1481,
            "description": "onEvent: プレイされて場に出た場合 [\"PlayerB_68\"]",
            "effect": {
                "id": "createPlayCommandText_PlayerB_68_場に出る",
                "reason": [
                    "場に出る",
                    "PlayerB",
                    "PlayerB_68"
                ],
                "description": "Play 黄昏の魔弾",
                "text": {
                    "id": "179019_01A_C_WT010C_white_text_command",
                    "description": "（戦闘フェイズ）：自軍ユニット１枚は、ターン終了時まで「速攻」または「高機動」を得る。",
                    "title": [],
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx4, effect2, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                            const cardId3 = DefineFn2.EffectFn.getCardID(effect2), from2 = GameStateFn2.getItemBaSyou(ctx4, cardId3), to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u30B8\\u30E3\\u30F3\\u30AF\\u30E4\\u30FC\\u30C9\");\n                            return ctx4 = GameStateFn2.doItemMove(ctx4, to, [cardId3, from2]), ctx4 = GameStateFn2.doTriggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] }), ctx4;\n                          }"
                                },
                                {
                                    "title": "function _(ctx, effect, { DefineFn, GameStateFn, ToolFn }) {\n                            const cardId = DefineFn.EffectFn.getCardID(effect);\n                            const pairs1 = GameStateFn.getCardTipStrBaSyouPairs(ctx, \"自軍ユニット１枚\", cardId);\n                            const str2 = GameStateFn.getCardTipStrings(ctx, \"「速攻」または「高機動」\", cardId);\n                            switch (str2[0]) {\n                                case \"速攻\":\n                                    for (const pair of pairs1) {\n                                        ctx = GameStateFn.doItemSetGlobalEffectsUntilEndOfTurn(ctx, [{ title: [\"AddText\", { id: ToolFn.getUUID(), title: [\"特殊型\", [\"速攻\"]] }], cardIds: [pair[0]] }], pair);\n                                    }\n                                    break;\n                                case \"高機動\":\n                                    for (const pair of pairs1) {\n                                        ctx = GameStateFn.doItemSetGlobalEffectsUntilEndOfTurn(ctx, [{ title: [\"AddText\", { id: ToolFn.getUUID(), title: [\"特殊型\", [\"高機動\"]] }], cardIds: [pair[0]] }], pair);\n                                    }\n                                    break;\n                            }\n                            return ctx;\n                        }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 1480,
            "description": "onItemMove:PlayerB_68 = [\"PlayerB\",\"プレイされているカード\"] => [\"PlayerB\",\"ジャンクヤード\"]",
            "effect": {
                "id": "createPlayCommandText_PlayerB_68_場に出る",
                "reason": [
                    "場に出る",
                    "PlayerB",
                    "PlayerB_68"
                ],
                "description": "Play 黄昏の魔弾",
                "text": {
                    "id": "179019_01A_C_WT010C_white_text_command",
                    "description": "（戦闘フェイズ）：自軍ユニット１枚は、ターン終了時まで「速攻」または「高機動」を得る。",
                    "title": [],
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx4, effect2, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                            const cardId3 = DefineFn2.EffectFn.getCardID(effect2), from2 = GameStateFn2.getItemBaSyou(ctx4, cardId3), to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u30B8\\u30E3\\u30F3\\u30AF\\u30E4\\u30FC\\u30C9\");\n                            return ctx4 = GameStateFn2.doItemMove(ctx4, to, [cardId3, from2]), ctx4 = GameStateFn2.doTriggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] }), ctx4;\n                          }"
                                },
                                {
                                    "title": "function _(ctx, effect, { DefineFn, GameStateFn, ToolFn }) {\n                            const cardId = DefineFn.EffectFn.getCardID(effect);\n                            const pairs1 = GameStateFn.getCardTipStrBaSyouPairs(ctx, \"自軍ユニット１枚\", cardId);\n                            const str2 = GameStateFn.getCardTipStrings(ctx, \"「速攻」または「高機動」\", cardId);\n                            switch (str2[0]) {\n                                case \"速攻\":\n                                    for (const pair of pairs1) {\n                                        ctx = GameStateFn.doItemSetGlobalEffectsUntilEndOfTurn(ctx, [{ title: [\"AddText\", { id: ToolFn.getUUID(), title: [\"特殊型\", [\"速攻\"]] }], cardIds: [pair[0]] }], pair);\n                                    }\n                                    break;\n                                case \"高機動\":\n                                    for (const pair of pairs1) {\n                                        ctx = GameStateFn.doItemSetGlobalEffectsUntilEndOfTurn(ctx, [{ title: [\"AddText\", { id: ToolFn.getUUID(), title: [\"特殊型\", [\"高機動\"]] }], cardIds: [pair[0]] }], pair);\n                                    }\n                                    break;\n                            }\n                            return ctx;\n                        }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 1479,
            "description": "onEvent: GameEventOnMove [\"PlayerB_68\"]",
            "effect": {
                "id": "createPlayCommandText_PlayerB_68_場に出る",
                "reason": [
                    "場に出る",
                    "PlayerB",
                    "PlayerB_68"
                ],
                "description": "Play 黄昏の魔弾",
                "text": {
                    "id": "179019_01A_C_WT010C_white_text_command",
                    "description": "（戦闘フェイズ）：自軍ユニット１枚は、ターン終了時まで「速攻」または「高機動」を得る。",
                    "title": [],
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx4, effect2, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                            const cardId3 = DefineFn2.EffectFn.getCardID(effect2), from2 = GameStateFn2.getItemBaSyou(ctx4, cardId3), to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u30B8\\u30E3\\u30F3\\u30AF\\u30E4\\u30FC\\u30C9\");\n                            return ctx4 = GameStateFn2.doItemMove(ctx4, to, [cardId3, from2]), ctx4 = GameStateFn2.doTriggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] }), ctx4;\n                          }"
                                },
                                {
                                    "title": "function _(ctx, effect, { DefineFn, GameStateFn, ToolFn }) {\n                            const cardId = DefineFn.EffectFn.getCardID(effect);\n                            const pairs1 = GameStateFn.getCardTipStrBaSyouPairs(ctx, \"自軍ユニット１枚\", cardId);\n                            const str2 = GameStateFn.getCardTipStrings(ctx, \"「速攻」または「高機動」\", cardId);\n                            switch (str2[0]) {\n                                case \"速攻\":\n                                    for (const pair of pairs1) {\n                                        ctx = GameStateFn.doItemSetGlobalEffectsUntilEndOfTurn(ctx, [{ title: [\"AddText\", { id: ToolFn.getUUID(), title: [\"特殊型\", [\"速攻\"]] }], cardIds: [pair[0]] }], pair);\n                                    }\n                                    break;\n                                case \"高機動\":\n                                    for (const pair of pairs1) {\n                                        ctx = GameStateFn.doItemSetGlobalEffectsUntilEndOfTurn(ctx, [{ title: [\"AddText\", { id: ToolFn.getUUID(), title: [\"特殊型\", [\"高機動\"]] }], cardIds: [pair[0]] }], pair);\n                                    }\n                                    break;\n                            }\n                            return ctx;\n                        }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 1478,
            "description": "onEffectStart: （戦闘フェイズ）：自軍ユニット１枚は、ターン終了時まで「速攻」または「高機動」を得る。",
            "effect": {
                "id": "createPlayCommandText_PlayerB_68_場に出る",
                "reason": [
                    "場に出る",
                    "PlayerB",
                    "PlayerB_68"
                ],
                "description": "Play 黄昏の魔弾",
                "text": {
                    "id": "179019_01A_C_WT010C_white_text_command",
                    "description": "（戦闘フェイズ）：自軍ユニット１枚は、ターン終了時まで「速攻」または「高機動」を得る。",
                    "title": [],
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx4, effect2, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                            const cardId3 = DefineFn2.EffectFn.getCardID(effect2), from2 = GameStateFn2.getItemBaSyou(ctx4, cardId3), to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u30B8\\u30E3\\u30F3\\u30AF\\u30E4\\u30FC\\u30C9\");\n                            return ctx4 = GameStateFn2.doItemMove(ctx4, to, [cardId3, from2]), ctx4 = GameStateFn2.doTriggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] }), ctx4;\n                          }"
                                },
                                {
                                    "title": "function _(ctx, effect, { DefineFn, GameStateFn, ToolFn }) {\n                            const cardId = DefineFn.EffectFn.getCardID(effect);\n                            const pairs1 = GameStateFn.getCardTipStrBaSyouPairs(ctx, \"自軍ユニット１枚\", cardId);\n                            const str2 = GameStateFn.getCardTipStrings(ctx, \"「速攻」または「高機動」\", cardId);\n                            switch (str2[0]) {\n                                case \"速攻\":\n                                    for (const pair of pairs1) {\n                                        ctx = GameStateFn.doItemSetGlobalEffectsUntilEndOfTurn(ctx, [{ title: [\"AddText\", { id: ToolFn.getUUID(), title: [\"特殊型\", [\"速攻\"]] }], cardIds: [pair[0]] }], pair);\n                                    }\n                                    break;\n                                case \"高機動\":\n                                    for (const pair of pairs1) {\n                                        ctx = GameStateFn.doItemSetGlobalEffectsUntilEndOfTurn(ctx, [{ title: [\"AddText\", { id: ToolFn.getUUID(), title: [\"特殊型\", [\"高機動\"]] }], cardIds: [pair[0]] }], pair);\n                                    }\n                                    break;\n                            }\n                            return ctx;\n                        }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 1477,
            "description": "onEffectEnd: Play 黄昏の魔弾"
        },
        {
            "id": 1476,
            "description": "onItemMove:PlayerB_68 = [\"PlayerB\",\"手札\"] => [\"PlayerB\",\"プレイされているカード\"]",
            "effect": {
                "id": "createPlayCommandText_PlayerB_68",
                "reason": [
                    "PlayCard",
                    "PlayerB",
                    "PlayerB_68",
                    {
                        "isPlayCommand": true
                    }
                ],
                "description": "Play 黄昏の魔弾",
                "text": {
                    "id": "179019_01A_C_WT010C_white_text_command",
                    "title": [
                        "使用型",
                        [
                            "戦闘フェイズ"
                        ]
                    ],
                    "description": "Play 黄昏の魔弾",
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
                                        "value": "橫置支付0[白]"
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
                                    "title": "function _(ctx3, effect, { DefineFn, GameStateFn, ToolFn: ToolFn2 }) {\n              const cardId2 = DefineFn.EffectFn.getCardID(effect), prototype2 = GameStateFn.getItemPrototype(ctx3, cardId2);\n              if (prototype2.category == \"\\u30B3\\u30DE\\u30F3\\u30C9\")\n                ;\n              else\n                throw new Error;\n              const commandText2 = prototype2.commandText, from = GameStateFn.getItemBaSyou(ctx3, cardId2);\n              return ctx3 = GameStateFn.doItemMove(ctx3, DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u3044\\u308B\\u30AB\\u30FC\\u30C9\"), [cardId2, from]), GameStateFn.addStackEffect(ctx3, {\n                id: `${effect.id}_\\u5834\\u306B\\u51FA\\u308B`,\n                reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn.EffectFn.getPlayerID(effect), DefineFn.EffectFn.getCardID(effect)],\n                description: effect.text.description,\n                text: {\n                  id: commandText2?.id || `getPlayCardEffects_commentText_${cardId2}`,\n                  description: commandText2?.description || \"unknown\",\n                  title: [],\n                  logicTreeActions: [\n                    {\n                      actions: [\n                        {\n                          title: function _(ctx4, effect2, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                            const cardId3 = DefineFn2.EffectFn.getCardID(effect2), from2 = GameStateFn2.getItemBaSyou(ctx4, cardId3), to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u30B8\\u30E3\\u30F3\\u30AF\\u30E4\\u30FC\\u30C9\");\n                            return ctx4 = GameStateFn2.doItemMove(ctx4, to, [cardId3, from2]), ctx4 = GameStateFn2.doTriggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] }), ctx4;\n                          }.toString()\n                        },\n                        ...commandText2?.logicTreeActions?.[0]?.actions || []\n                      ]\n                    }\n                  ]\n                }\n              });\n            }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 1475,
            "description": "onEvent: GameEventOnMove [\"PlayerB_68\"]",
            "effect": {
                "id": "createPlayCommandText_PlayerB_68",
                "reason": [
                    "PlayCard",
                    "PlayerB",
                    "PlayerB_68",
                    {
                        "isPlayCommand": true
                    }
                ],
                "description": "Play 黄昏の魔弾",
                "text": {
                    "id": "179019_01A_C_WT010C_white_text_command",
                    "title": [
                        "使用型",
                        [
                            "戦闘フェイズ"
                        ]
                    ],
                    "description": "Play 黄昏の魔弾",
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
                                        "value": "橫置支付0[白]"
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
                                    "title": "function _(ctx3, effect, { DefineFn, GameStateFn, ToolFn: ToolFn2 }) {\n              const cardId2 = DefineFn.EffectFn.getCardID(effect), prototype2 = GameStateFn.getItemPrototype(ctx3, cardId2);\n              if (prototype2.category == \"\\u30B3\\u30DE\\u30F3\\u30C9\")\n                ;\n              else\n                throw new Error;\n              const commandText2 = prototype2.commandText, from = GameStateFn.getItemBaSyou(ctx3, cardId2);\n              return ctx3 = GameStateFn.doItemMove(ctx3, DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u3044\\u308B\\u30AB\\u30FC\\u30C9\"), [cardId2, from]), GameStateFn.addStackEffect(ctx3, {\n                id: `${effect.id}_\\u5834\\u306B\\u51FA\\u308B`,\n                reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn.EffectFn.getPlayerID(effect), DefineFn.EffectFn.getCardID(effect)],\n                description: effect.text.description,\n                text: {\n                  id: commandText2?.id || `getPlayCardEffects_commentText_${cardId2}`,\n                  description: commandText2?.description || \"unknown\",\n                  title: [],\n                  logicTreeActions: [\n                    {\n                      actions: [\n                        {\n                          title: function _(ctx4, effect2, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                            const cardId3 = DefineFn2.EffectFn.getCardID(effect2), from2 = GameStateFn2.getItemBaSyou(ctx4, cardId3), to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u30B8\\u30E3\\u30F3\\u30AF\\u30E4\\u30FC\\u30C9\");\n                            return ctx4 = GameStateFn2.doItemMove(ctx4, to, [cardId3, from2]), ctx4 = GameStateFn2.doTriggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] }), ctx4;\n                          }.toString()\n                        },\n                        ...commandText2?.logicTreeActions?.[0]?.actions || []\n                      ]\n                    }\n                  ]\n                }\n              });\n            }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 1474,
            "description": "PlayerB_68.isFaceDown true => false",
            "effect": {
                "id": "createPlayCommandText_PlayerB_68",
                "reason": [
                    "PlayCard",
                    "PlayerB",
                    "PlayerB_68",
                    {
                        "isPlayCommand": true
                    }
                ],
                "description": "Play 黄昏の魔弾",
                "text": {
                    "id": "179019_01A_C_WT010C_white_text_command",
                    "title": [
                        "使用型",
                        [
                            "戦闘フェイズ"
                        ]
                    ],
                    "description": "Play 黄昏の魔弾",
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
                                        "value": "橫置支付0[白]"
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
                                    "title": "function _(ctx3, effect, { DefineFn, GameStateFn, ToolFn: ToolFn2 }) {\n              const cardId2 = DefineFn.EffectFn.getCardID(effect), prototype2 = GameStateFn.getItemPrototype(ctx3, cardId2);\n              if (prototype2.category == \"\\u30B3\\u30DE\\u30F3\\u30C9\")\n                ;\n              else\n                throw new Error;\n              const commandText2 = prototype2.commandText, from = GameStateFn.getItemBaSyou(ctx3, cardId2);\n              return ctx3 = GameStateFn.doItemMove(ctx3, DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u3044\\u308B\\u30AB\\u30FC\\u30C9\"), [cardId2, from]), GameStateFn.addStackEffect(ctx3, {\n                id: `${effect.id}_\\u5834\\u306B\\u51FA\\u308B`,\n                reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn.EffectFn.getPlayerID(effect), DefineFn.EffectFn.getCardID(effect)],\n                description: effect.text.description,\n                text: {\n                  id: commandText2?.id || `getPlayCardEffects_commentText_${cardId2}`,\n                  description: commandText2?.description || \"unknown\",\n                  title: [],\n                  logicTreeActions: [\n                    {\n                      actions: [\n                        {\n                          title: function _(ctx4, effect2, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                            const cardId3 = DefineFn2.EffectFn.getCardID(effect2), from2 = GameStateFn2.getItemBaSyou(ctx4, cardId3), to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u30B8\\u30E3\\u30F3\\u30AF\\u30E4\\u30FC\\u30C9\");\n                            return ctx4 = GameStateFn2.doItemMove(ctx4, to, [cardId3, from2]), ctx4 = GameStateFn2.doTriggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] }), ctx4;\n                          }.toString()\n                        },\n                        ...commandText2?.logicTreeActions?.[0]?.actions || []\n                      ]\n                    }\n                  ]\n                }\n              });\n            }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 1473,
            "description": "onEvent: プレイした場合 [\"PlayerB_68\"]",
            "effect": {
                "id": "createPlayCommandText_PlayerB_68",
                "reason": [
                    "PlayCard",
                    "PlayerB",
                    "PlayerB_68",
                    {
                        "isPlayCommand": true
                    }
                ],
                "description": "Play 黄昏の魔弾",
                "text": {
                    "id": "179019_01A_C_WT010C_white_text_command",
                    "title": [
                        "使用型",
                        [
                            "戦闘フェイズ"
                        ]
                    ],
                    "description": "Play 黄昏の魔弾",
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
                                        "value": "橫置支付0[白]"
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
                                    "title": "function _(ctx3, effect, { DefineFn, GameStateFn, ToolFn: ToolFn2 }) {\n              const cardId2 = DefineFn.EffectFn.getCardID(effect), prototype2 = GameStateFn.getItemPrototype(ctx3, cardId2);\n              if (prototype2.category == \"\\u30B3\\u30DE\\u30F3\\u30C9\")\n                ;\n              else\n                throw new Error;\n              const commandText2 = prototype2.commandText, from = GameStateFn.getItemBaSyou(ctx3, cardId2);\n              return ctx3 = GameStateFn.doItemMove(ctx3, DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u3044\\u308B\\u30AB\\u30FC\\u30C9\"), [cardId2, from]), GameStateFn.addStackEffect(ctx3, {\n                id: `${effect.id}_\\u5834\\u306B\\u51FA\\u308B`,\n                reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn.EffectFn.getPlayerID(effect), DefineFn.EffectFn.getCardID(effect)],\n                description: effect.text.description,\n                text: {\n                  id: commandText2?.id || `getPlayCardEffects_commentText_${cardId2}`,\n                  description: commandText2?.description || \"unknown\",\n                  title: [],\n                  logicTreeActions: [\n                    {\n                      actions: [\n                        {\n                          title: function _(ctx4, effect2, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                            const cardId3 = DefineFn2.EffectFn.getCardID(effect2), from2 = GameStateFn2.getItemBaSyou(ctx4, cardId3), to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u30B8\\u30E3\\u30F3\\u30AF\\u30E4\\u30FC\\u30C9\");\n                            return ctx4 = GameStateFn2.doItemMove(ctx4, to, [cardId3, from2]), ctx4 = GameStateFn2.doTriggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] }), ctx4;\n                          }.toString()\n                        },\n                        ...commandText2?.logicTreeActions?.[0]?.actions || []\n                      ]\n                    }\n                  ]\n                }\n              });\n            }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 1472,
            "description": "PlayerB_57.isRoll false => true",
            "effect": {
                "id": "createPlayCommandText_PlayerB_68",
                "reason": [
                    "PlayCard",
                    "PlayerB",
                    "PlayerB_68",
                    {
                        "isPlayCommand": true
                    }
                ],
                "description": "Play 黄昏の魔弾",
                "text": {
                    "id": "179019_01A_C_WT010C_white_text_command",
                    "title": [
                        "使用型",
                        [
                            "戦闘フェイズ"
                        ]
                    ],
                    "description": "Play 黄昏の魔弾",
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
                                        "value": "橫置支付0[白]"
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
                                    "title": "function _(ctx3, effect, { DefineFn, GameStateFn, ToolFn: ToolFn2 }) {\n              const cardId2 = DefineFn.EffectFn.getCardID(effect), prototype2 = GameStateFn.getItemPrototype(ctx3, cardId2);\n              if (prototype2.category == \"\\u30B3\\u30DE\\u30F3\\u30C9\")\n                ;\n              else\n                throw new Error;\n              const commandText2 = prototype2.commandText, from = GameStateFn.getItemBaSyou(ctx3, cardId2);\n              return ctx3 = GameStateFn.doItemMove(ctx3, DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u3044\\u308B\\u30AB\\u30FC\\u30C9\"), [cardId2, from]), GameStateFn.addStackEffect(ctx3, {\n                id: `${effect.id}_\\u5834\\u306B\\u51FA\\u308B`,\n                reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn.EffectFn.getPlayerID(effect), DefineFn.EffectFn.getCardID(effect)],\n                description: effect.text.description,\n                text: {\n                  id: commandText2?.id || `getPlayCardEffects_commentText_${cardId2}`,\n                  description: commandText2?.description || \"unknown\",\n                  title: [],\n                  logicTreeActions: [\n                    {\n                      actions: [\n                        {\n                          title: function _(ctx4, effect2, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                            const cardId3 = DefineFn2.EffectFn.getCardID(effect2), from2 = GameStateFn2.getItemBaSyou(ctx4, cardId3), to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u30B8\\u30E3\\u30F3\\u30AF\\u30E4\\u30FC\\u30C9\");\n                            return ctx4 = GameStateFn2.doItemMove(ctx4, to, [cardId3, from2]), ctx4 = GameStateFn2.doTriggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] }), ctx4;\n                          }.toString()\n                        },\n                        ...commandText2?.logicTreeActions?.[0]?.actions || []\n                      ]\n                    }\n                  ]\n                }\n              });\n            }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 1471,
            "description": "onEffectStart: Play 黄昏の魔弾",
            "effect": {
                "id": "createPlayCommandText_PlayerB_68",
                "reason": [
                    "PlayCard",
                    "PlayerB",
                    "PlayerB_68",
                    {
                        "isPlayCommand": true
                    }
                ],
                "description": "Play 黄昏の魔弾",
                "text": {
                    "id": "179019_01A_C_WT010C_white_text_command",
                    "title": [
                        "使用型",
                        [
                            "戦闘フェイズ"
                        ]
                    ],
                    "description": "Play 黄昏の魔弾",
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
                                        "value": "橫置支付0[白]"
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
                                    "title": "function _(ctx3, effect, { DefineFn, GameStateFn, ToolFn: ToolFn2 }) {\n              const cardId2 = DefineFn.EffectFn.getCardID(effect), prototype2 = GameStateFn.getItemPrototype(ctx3, cardId2);\n              if (prototype2.category == \"\\u30B3\\u30DE\\u30F3\\u30C9\")\n                ;\n              else\n                throw new Error;\n              const commandText2 = prototype2.commandText, from = GameStateFn.getItemBaSyou(ctx3, cardId2);\n              return ctx3 = GameStateFn.doItemMove(ctx3, DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u3044\\u308B\\u30AB\\u30FC\\u30C9\"), [cardId2, from]), GameStateFn.addStackEffect(ctx3, {\n                id: `${effect.id}_\\u5834\\u306B\\u51FA\\u308B`,\n                reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn.EffectFn.getPlayerID(effect), DefineFn.EffectFn.getCardID(effect)],\n                description: effect.text.description,\n                text: {\n                  id: commandText2?.id || `getPlayCardEffects_commentText_${cardId2}`,\n                  description: commandText2?.description || \"unknown\",\n                  title: [],\n                  logicTreeActions: [\n                    {\n                      actions: [\n                        {\n                          title: function _(ctx4, effect2, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                            const cardId3 = DefineFn2.EffectFn.getCardID(effect2), from2 = GameStateFn2.getItemBaSyou(ctx4, cardId3), to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u30B8\\u30E3\\u30F3\\u30AF\\u30E4\\u30FC\\u30C9\");\n                            return ctx4 = GameStateFn2.doItemMove(ctx4, to, [cardId3, from2]), ctx4 = GameStateFn2.doTriggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] }), ctx4;\n                          }.toString()\n                        },\n                        ...commandText2?.logicTreeActions?.[0]?.actions || []\n                      ]\n                    }\n                  ]\n                }\n              });\n            }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 1470,
            "description": "onSetPhase:戦闘フェイズ,攻撃ステップ,フリータイミング"
        },
        {
            "id": 1469,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 1468,
            "description": "onSetPhase:戦闘フェイズ,攻撃ステップ,ステップ開始"
        },
        {
            "id": 1467,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 1466,
            "description": "onSetPhase:配備フェイズ,フェイズ終了"
        },
        {
            "id": 1465,
            "description": "onEffectEnd: PlayG"
        },
        {
            "id": 1464,
            "description": "onEvent: このカードがGとして場に出た場合 [\"PlayerB_97\"]",
            "effect": {
                "id": "createPlayGEffect_PlayerB_97",
                "reason": [
                    "PlayCard",
                    "PlayerB",
                    "PlayerB_97",
                    {
                        "isPlayG": true
                    }
                ],
                "description": "Play G",
                "text": {
                    "id": "createPlayGEffect_PlayerB_97",
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
            "id": 1463,
            "description": "onEvent: プレイされて場に出た場合 [\"PlayerB_97\"]",
            "effect": {
                "id": "createPlayGEffect_PlayerB_97",
                "reason": [
                    "PlayCard",
                    "PlayerB",
                    "PlayerB_97",
                    {
                        "isPlayG": true
                    }
                ],
                "description": "Play G",
                "text": {
                    "id": "createPlayGEffect_PlayerB_97",
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
            "id": 1462,
            "description": "onItemMove:PlayerB_97 = [\"PlayerB\",\"手札\"] => [\"PlayerB\",\"Gゾーン\"]",
            "effect": {
                "id": "createPlayGEffect_PlayerB_97",
                "reason": [
                    "PlayCard",
                    "PlayerB",
                    "PlayerB_97",
                    {
                        "isPlayG": true
                    }
                ],
                "description": "Play G",
                "text": {
                    "id": "createPlayGEffect_PlayerB_97",
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
            "id": 1461,
            "description": "onEvent: GameEventOnMove [\"PlayerB_97\"]",
            "effect": {
                "id": "createPlayGEffect_PlayerB_97",
                "reason": [
                    "PlayCard",
                    "PlayerB",
                    "PlayerB_97",
                    {
                        "isPlayG": true
                    }
                ],
                "description": "Play G",
                "text": {
                    "id": "createPlayGEffect_PlayerB_97",
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
            "id": 1460,
            "description": "PlayerB_97.isFaceDown true => false",
            "effect": {
                "id": "createPlayGEffect_PlayerB_97",
                "reason": [
                    "PlayCard",
                    "PlayerB",
                    "PlayerB_97",
                    {
                        "isPlayG": true
                    }
                ],
                "description": "Play G",
                "text": {
                    "id": "createPlayGEffect_PlayerB_97",
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
            "id": 1459,
            "description": "onPlayerStateChange:PlayerB",
            "effect": {
                "id": "createPlayGEffect_PlayerB_97",
                "reason": [
                    "PlayCard",
                    "PlayerB",
                    "PlayerB_97",
                    {
                        "isPlayG": true
                    }
                ],
                "description": "Play G",
                "text": {
                    "id": "createPlayGEffect_PlayerB_97",
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
            "id": 1458,
            "description": "onEffectStart: PlayG",
            "effect": {
                "id": "createPlayGEffect_PlayerB_97",
                "reason": [
                    "PlayCard",
                    "PlayerB",
                    "PlayerB_97",
                    {
                        "isPlayG": true
                    }
                ],
                "description": "Play G",
                "text": {
                    "id": "createPlayGEffect_PlayerB_97",
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
            "id": 1457,
            "description": "onSetPhase:配備フェイズ,フリータイミング"
        },
        {
            "id": 1456,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 1455,
            "description": "onSetPhase:配備フェイズ,フェイズ開始"
        },
        {
            "id": 1454,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 1453,
            "description": "onSetPhase:ドローフェイズ,フェイズ終了"
        },
        {
            "id": 1452,
            "description": "onSetPhase:ドローフェイズ,フリータイミング"
        },
        {
            "id": 1451,
            "description": "onEffectEnd: 抽牌階段規定效果"
        },
        {
            "id": 1450,
            "description": "onItemMove:PlayerB_68 = [\"PlayerB\",\"本国\"] => [\"PlayerB\",\"手札\"]",
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
            "id": 1449,
            "description": "onEvent: GameEventOnMove [\"PlayerB_68\"]",
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
            "id": 1448,
            "description": "PlayerB_68.isRoll undefined => false",
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
            "id": 1447,
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
            "id": 1446,
            "description": "onSetPhase:ドローフェイズ,規定の効果"
        },
        {
            "id": 1445,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 1444,
            "description": "onSetPhase:ドローフェイズ,フェイズ開始"
        },
        {
            "id": 1443,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 1442,
            "description": "onSetPhase:リロールフェイズ,フェイズ終了"
        },
        {
            "id": 1441,
            "description": "onSetPhase:リロールフェイズ,フリータイミング"
        },
        {
            "id": 1440,
            "description": "onEffectEnd: getRerollPhaseRuleEffect"
        },
        {
            "id": 1439,
            "description": "PlayerB_79.isRoll true => false",
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
            "id": 1438,
            "description": "PlayerB_62.isRoll true => false",
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
            "id": 1437,
            "description": "PlayerB_50.isRoll true => false",
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
            "id": 1436,
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
            "id": 1435,
            "description": "PlayerB_64.isRoll true => false",
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
            "id": 1434,
            "description": "PlayerB_57.isRoll true => false",
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
            "id": 1433,
            "description": "PlayerB_65.isRoll true => false",
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
            "id": 1432,
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
            "id": 1431,
            "description": "onSetPhase:リロールフェイズ,規定の効果"
        },
        {
            "id": 1430,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 1429,
            "description": "onSetPhase:リロールフェイズ,フェイズ開始"
        },
        {
            "id": 1428,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 1427,
            "description": "onPlayerStateChange:PlayerA"
        },
        {
            "id": 1426,
            "description": "onSetPhase:戦闘フェイズ,ターン終了時,効果終了。ターン終了"
        },
        {
            "id": 1425,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 1424,
            "description": "將發動起動效果但條件不足: : 調整手牌為7張以下"
        },
        {
            "id": 1423,
            "description": "將發動起動效果但條件不足: : 調整手牌為7張以下"
        },
        {
            "id": 1422,
            "description": "onSetPhase:戦闘フェイズ,ターン終了時,手札調整"
        },
        {
            "id": 1421,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 1420,
            "description": "onSetPhase:戦闘フェイズ,ターン終了時,効果解決"
        },
        {
            "id": 1419,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 1418,
            "description": "onSetPhase:戦闘フェイズ,ターン終了時,ダメージリセット"
        },
        {
            "id": 1417,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 1416,
            "description": "onSetPhase:戦闘フェイズ,帰還ステップ,ステップ終了"
        },
        {
            "id": 1415,
            "description": "onSetPhase:戦闘フェイズ,帰還ステップ,フリータイミング2"
        },
        {
            "id": 1414,
            "description": "onEffectEnd: getReturnRuleEffect"
        },
        {
            "id": 1413,
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
            "id": 1412,
            "description": "onSetPhase:戦闘フェイズ,帰還ステップ,規定の効果"
        },
        {
            "id": 1411,
            "description": "onSetPhase:戦闘フェイズ,帰還ステップ,フリータイミング"
        },
        {
            "id": 1410,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 1409,
            "description": "onSetPhase:戦闘フェイズ,帰還ステップ,ステップ開始"
        },
        {
            "id": 1408,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 1407,
            "description": "onSetPhase:戦闘フェイズ,ダメージ判定ステップ,ステップ終了"
        },
        {
            "id": 1406,
            "description": "onSetPhase:戦闘フェイズ,ダメージ判定ステップ,フリータイミング2"
        },
        {
            "id": 1405,
            "description": "onEffectEnd: getDamageRuleEffect"
        },
        {
            "id": 1404,
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
                                    "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                const ges = GameStateFn2.getGlobalEffects(ctx3, null);\n                ctx3 = GameStateFn2.setGlobalEffects(ctx3, null, ges);\n                const playerId2 = DefineFn2.EffectFn.getPlayerID(effect);\n                return ctx3 = GameStateFn2.doPlayerAttack(ctx3, playerId2, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A21\", 1, { ges }), ctx3 = GameStateFn2.doPlayerAttack(ctx3, playerId2, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A22\", 1, { ges }), ctx3 = GameStateFn2.doPlayerAttack(ctx3, playerId2, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A21\", 2, { ges }), ctx3 = GameStateFn2.doPlayerAttack(ctx3, playerId2, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A22\", 2, { ges }), ctx3;\n              }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 1403,
            "description": "onSetPhase:戦闘フェイズ,ダメージ判定ステップ,規定の効果"
        },
        {
            "id": 1402,
            "description": "onSetPhase:戦闘フェイズ,ダメージ判定ステップ,フリータイミング"
        },
        {
            "id": 1401,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 1400,
            "description": "onSetPhase:戦闘フェイズ,ダメージ判定ステップ,ステップ開始"
        },
        {
            "id": 1399,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 1398,
            "description": "onSetPhase:戦闘フェイズ,防御ステップ,ステップ終了"
        },
        {
            "id": 1397,
            "description": "onSetPhase:戦闘フェイズ,防御ステップ,フリータイミング2"
        },
        {
            "id": 1396,
            "description": "onEffectEnd: 出擊"
        },
        {
            "id": 1395,
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
                            "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n            const runtimeBattleArea = GameStateFn2.getRuntimeBattleArea(ctx3, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A21\");\n            if (runtimeBattleArea == \"\\u5B87\\u5B99\\u30A8\\u30EA\\u30A2\")\n              return null;\n            const playerId2 = DefineFn2.EffectFn.getPlayerID(effect), opponentPlayerId = DefineFn2.PlayerIDFn.getOpponent(playerId2);\n            let unitIds = GameStateFn2.getItemIdsByBasyou(ctx3, DefineFn2.AbsoluteBaSyouFn.of(playerId2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\")).filter((cardId) => GameStateFn2.getSetGroupRoot(ctx3, cardId) == cardId).filter((cardId) => GameStateFn2.getCardBattleArea(ctx3, cardId).includes(runtimeBattleArea)).filter((cardId) => GameStateFn2.getCard(ctx3, cardId).isRoll != !0);\n            const opponentUnitIds = GameStateFn2.getBattleGroup(ctx3, DefineFn2.AbsoluteBaSyouFn.of(opponentPlayerId, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A21\"));\n            if (opponentUnitIds.length) {\n              const ges = GameStateFn2.getGlobalEffects(ctx3, null);\n              if (GameStateFn2.isABattleGroup(ctx3, [\"\\u9AD8\\u6A5F\\u52D5\"], opponentUnitIds[0], { ges }))\n                unitIds = unitIds.filter((id) => GameStateFn2.isSetGroupHasA(ctx3, [\"\\u9AD8\\u6A5F\\u52D5\"], id, { ges }));\n            }\n            return {\n              title: [\"\\u30AB\\u30FC\\u30C9\", unitIds.map((id) => {\n                return [id, GameStateFn2.getItemBaSyou(ctx3, id)];\n              }), []],\n              flags: { isGoBattleArea1: !0 }\n            };\n          }",
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                const playerId2 = DefineFn2.EffectFn.getPlayerID(effect), fackCardId = DefineFn2.EffectFn.getCardID(effect), earthPairs = GameStateFn2.getCardTipStrBaSyouPairs(ctx3, \"\\u53BB\\u5730\\u7403\", fackCardId), phase2 = GameStateFn2.getPhase(ctx3);\n                for (let pair3 of earthPairs)\n                  ctx3 = GameStateFn2.mapItemState(ctx3, pair3[0], (is) => ({ ...is, isAttack: phase2[1] == \"\\u653B\\u6483\\u30B9\\u30C6\\u30C3\\u30D7\", isDefence: phase2[1] == \"\\u9632\\u5FA1\\u30B9\\u30C6\\u30C3\\u30D7\" })), ctx3 = GameStateFn2.doItemMove(ctx3, DefineFn2.AbsoluteBaSyouFn.of(playerId2, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A21\"), pair3);\n                return ctx3;\n              }"
                                }
                            ],
                            "groupKey": "出擊"
                        },
                        "去宇宙": {
                            "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n            const runtimeBattleArea = GameStateFn2.getRuntimeBattleArea(ctx3, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A22\");\n            if (runtimeBattleArea == \"\\u5730\\u7403\\u30A8\\u30EA\\u30A2\")\n              return null;\n            const playerId2 = DefineFn2.EffectFn.getPlayerID(effect), opponentPlayerId = DefineFn2.PlayerIDFn.getOpponent(playerId2);\n            let unitIds = GameStateFn2.getItemIdsByBasyou(ctx3, DefineFn2.AbsoluteBaSyouFn.of(playerId2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\")).filter((cardId) => GameStateFn2.getSetGroupRoot(ctx3, cardId) == cardId).filter((cardId) => GameStateFn2.getCardBattleArea(ctx3, cardId).includes(runtimeBattleArea)).filter((cardId) => GameStateFn2.getCard(ctx3, cardId).isRoll != !0);\n            const opponentUnitIds = GameStateFn2.getBattleGroup(ctx3, DefineFn2.AbsoluteBaSyouFn.of(opponentPlayerId, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A22\"));\n            if (opponentUnitIds.length) {\n              const ges = GameStateFn2.getGlobalEffects(ctx3, null);\n              if (GameStateFn2.isABattleGroup(ctx3, [\"\\u9AD8\\u6A5F\\u52D5\"], opponentUnitIds[0], { ges }))\n                unitIds = unitIds.filter((id) => GameStateFn2.isSetGroupHasA(ctx3, [\"\\u9AD8\\u6A5F\\u52D5\"], id, { ges }));\n            }\n            return {\n              title: [\"\\u30AB\\u30FC\\u30C9\", unitIds.map((id) => {\n                return [id, GameStateFn2.getItemBaSyou(ctx3, id)];\n              }), []],\n              flags: { isGoBattleArea2: !0 }\n            };\n          }",
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                const playerId2 = DefineFn2.EffectFn.getPlayerID(effect), fackCardId = DefineFn2.EffectFn.getCardID(effect), spacePairs = GameStateFn2.getCardTipStrBaSyouPairs(ctx3, \"\\u53BB\\u5B87\\u5B99\", fackCardId), phase2 = GameStateFn2.getPhase(ctx3);\n                for (let pair3 of spacePairs)\n                  ctx3 = GameStateFn2.mapItemState(ctx3, pair3[0], (is) => ({ ...is, isAttack: phase2[1] == \"\\u653B\\u6483\\u30B9\\u30C6\\u30C3\\u30D7\", isDefence: phase2[1] == \"\\u9632\\u5FA1\\u30B9\\u30C6\\u30C3\\u30D7\" })), ctx3 = GameStateFn2.doItemMove(ctx3, DefineFn2.AbsoluteBaSyouFn.of(playerId2, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A22\"), pair3);\n                return ctx3 = GameStateFn2.checkIsBattle(ctx3), ctx3;\n              }"
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
            "id": 1394,
            "description": "onSetPhase:戦闘フェイズ,防御ステップ,規定の効果"
        },
        {
            "id": 1393,
            "description": "onSetPhase:戦闘フェイズ,防御ステップ,フリータイミング"
        },
        {
            "id": 1392,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 1391,
            "description": "onSetPhase:戦闘フェイズ,防御ステップ,ステップ開始"
        },
        {
            "id": 1390,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 1389,
            "description": "onSetPhase:戦闘フェイズ,攻撃ステップ,ステップ終了"
        },
        {
            "id": 1388,
            "description": "onSetPhase:戦闘フェイズ,攻撃ステップ,フリータイミング2"
        },
        {
            "id": 1387,
            "description": "onSetPhase:戦闘フェイズ,攻撃ステップ,規定の効果"
        },
        {
            "id": 1386,
            "description": "onSetPhase:戦闘フェイズ,攻撃ステップ,フリータイミング"
        },
        {
            "id": 1385,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 1384,
            "description": "onSetPhase:戦闘フェイズ,攻撃ステップ,ステップ開始"
        },
        {
            "id": 1383,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 1382,
            "description": "onSetPhase:配備フェイズ,フェイズ終了"
        },
        {
            "id": 1381,
            "description": "onEvent: カット終了時 undefined"
        },
        {
            "id": 1380,
            "description": "onEffectEnd: Play クェス・パラヤ"
        },
        {
            "id": 1379,
            "description": "onEvent: プレイされて場にセットされた場合 [\"PlayerA_34\"]",
            "effect": {
                "id": "createCharOpUnitGoStageEffectFromPlayEffect_PlayerA_34",
                "reason": [
                    "場に出る",
                    "PlayerA",
                    "PlayerA_34"
                ],
                "description": "Play クェス・パラヤ",
                "text": {
                    "id": "createPlayCharacterOperationEffect_PlayerA_34",
                    "description": "Play クェス・パラヤ",
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
            "id": 1378,
            "description": "onEvent: プレイされて場に出た場合 [\"PlayerA_34\"]",
            "effect": {
                "id": "createCharOpUnitGoStageEffectFromPlayEffect_PlayerA_34",
                "reason": [
                    "場に出る",
                    "PlayerA",
                    "PlayerA_34"
                ],
                "description": "Play クェス・パラヤ",
                "text": {
                    "id": "createPlayCharacterOperationEffect_PlayerA_34",
                    "description": "Play クェス・パラヤ",
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
            "id": 1377,
            "description": "onSetSetGroupParent:PlayerA_8 PlayerA_34",
            "effect": {
                "id": "createCharOpUnitGoStageEffectFromPlayEffect_PlayerA_34",
                "reason": [
                    "場に出る",
                    "PlayerA",
                    "PlayerA_34"
                ],
                "description": "Play クェス・パラヤ",
                "text": {
                    "id": "createPlayCharacterOperationEffect_PlayerA_34",
                    "description": "Play クェス・パラヤ",
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
            "id": 1376,
            "description": "onItemMove:PlayerA_34 = [\"PlayerA\",\"プレイされているカード\"] => [\"PlayerA\",\"配備エリア\"]",
            "effect": {
                "id": "createCharOpUnitGoStageEffectFromPlayEffect_PlayerA_34",
                "reason": [
                    "場に出る",
                    "PlayerA",
                    "PlayerA_34"
                ],
                "description": "Play クェス・パラヤ",
                "text": {
                    "id": "createPlayCharacterOperationEffect_PlayerA_34",
                    "description": "Play クェス・パラヤ",
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
            "id": 1375,
            "description": "onEvent: GameEventOnMove [\"PlayerA_34\"]",
            "effect": {
                "id": "createCharOpUnitGoStageEffectFromPlayEffect_PlayerA_34",
                "reason": [
                    "場に出る",
                    "PlayerA",
                    "PlayerA_34"
                ],
                "description": "Play クェス・パラヤ",
                "text": {
                    "id": "createPlayCharacterOperationEffect_PlayerA_34",
                    "description": "Play クェス・パラヤ",
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
            "id": 1374,
            "description": "onEvent: このカードが場に出た場合 [\"PlayerA_34\"]",
            "effect": {
                "id": "createCharOpUnitGoStageEffectFromPlayEffect_PlayerA_34",
                "reason": [
                    "場に出る",
                    "PlayerA",
                    "PlayerA_34"
                ],
                "description": "Play クェス・パラヤ",
                "text": {
                    "id": "createPlayCharacterOperationEffect_PlayerA_34",
                    "description": "Play クェス・パラヤ",
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
            "id": 1373,
            "description": "onEffectStart: Play クェス・パラヤ",
            "effect": {
                "id": "createCharOpUnitGoStageEffectFromPlayEffect_PlayerA_34",
                "reason": [
                    "場に出る",
                    "PlayerA",
                    "PlayerA_34"
                ],
                "description": "Play クェス・パラヤ",
                "text": {
                    "id": "createPlayCharacterOperationEffect_PlayerA_34",
                    "description": "Play クェス・パラヤ",
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
            "id": 1372,
            "description": "onEffectEnd: Play クェス・パラヤ"
        },
        {
            "id": 1371,
            "description": "onItemMove:PlayerA_34 = [\"PlayerA\",\"手札\"] => [\"PlayerA\",\"プレイされているカード\"]",
            "effect": {
                "id": "createPlayCharacterOperationEffect_PlayerA_34",
                "reason": [
                    "PlayCard",
                    "PlayerA",
                    "PlayerA_34",
                    {
                        "isPlayCharacter": true,
                        "isPlayOperation": false
                    }
                ],
                "description": "Play クェス・パラヤ",
                "text": {
                    "id": "createPlayCharacterOperationEffect_PlayerA_34",
                    "title": [
                        "使用型",
                        [
                            "自軍",
                            "配備フェイズ"
                        ]
                    ],
                    "description": "Play クェス・パラヤ",
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
                        "橫置支付0[緑]": {
                            "title": [
                                "RollColor",
                                "緑"
                            ],
                            "actions": [
                                {
                                    "title": [
                                        "_ロールする",
                                        "ロール"
                                    ],
                                    "vars": [
                                        "橫置支付0[緑]"
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
                        },
                        "同名卡不能下": {
                            "actions": [
                                {
                                    "title": [
                                        "Entity",
                                        {
                                            "atBa": true,
                                            "hasTitle": [
                                                "クェス・パラヤ"
                                            ],
                                            "count": 0
                                        }
                                    ]
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
            "id": 1370,
            "description": "onEvent: GameEventOnMove [\"PlayerA_34\"]",
            "effect": {
                "id": "createPlayCharacterOperationEffect_PlayerA_34",
                "reason": [
                    "PlayCard",
                    "PlayerA",
                    "PlayerA_34",
                    {
                        "isPlayCharacter": true,
                        "isPlayOperation": false
                    }
                ],
                "description": "Play クェス・パラヤ",
                "text": {
                    "id": "createPlayCharacterOperationEffect_PlayerA_34",
                    "title": [
                        "使用型",
                        [
                            "自軍",
                            "配備フェイズ"
                        ]
                    ],
                    "description": "Play クェス・パラヤ",
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
                        "橫置支付0[緑]": {
                            "title": [
                                "RollColor",
                                "緑"
                            ],
                            "actions": [
                                {
                                    "title": [
                                        "_ロールする",
                                        "ロール"
                                    ],
                                    "vars": [
                                        "橫置支付0[緑]"
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
                        },
                        "同名卡不能下": {
                            "actions": [
                                {
                                    "title": [
                                        "Entity",
                                        {
                                            "atBa": true,
                                            "hasTitle": [
                                                "クェス・パラヤ"
                                            ],
                                            "count": 0
                                        }
                                    ]
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
            "id": 1369,
            "description": "PlayerA_34.isFaceDown true => false",
            "effect": {
                "id": "createPlayCharacterOperationEffect_PlayerA_34",
                "reason": [
                    "PlayCard",
                    "PlayerA",
                    "PlayerA_34",
                    {
                        "isPlayCharacter": true,
                        "isPlayOperation": false
                    }
                ],
                "description": "Play クェス・パラヤ",
                "text": {
                    "id": "createPlayCharacterOperationEffect_PlayerA_34",
                    "title": [
                        "使用型",
                        [
                            "自軍",
                            "配備フェイズ"
                        ]
                    ],
                    "description": "Play クェス・パラヤ",
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
                        "橫置支付0[緑]": {
                            "title": [
                                "RollColor",
                                "緑"
                            ],
                            "actions": [
                                {
                                    "title": [
                                        "_ロールする",
                                        "ロール"
                                    ],
                                    "vars": [
                                        "橫置支付0[緑]"
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
                        },
                        "同名卡不能下": {
                            "actions": [
                                {
                                    "title": [
                                        "Entity",
                                        {
                                            "atBa": true,
                                            "hasTitle": [
                                                "クェス・パラヤ"
                                            ],
                                            "count": 0
                                        }
                                    ]
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
            "id": 1368,
            "description": "onEvent: プレイした場合 [\"PlayerA_34\"]",
            "effect": {
                "id": "createPlayCharacterOperationEffect_PlayerA_34",
                "reason": [
                    "PlayCard",
                    "PlayerA",
                    "PlayerA_34",
                    {
                        "isPlayCharacter": true,
                        "isPlayOperation": false
                    }
                ],
                "description": "Play クェス・パラヤ",
                "text": {
                    "id": "createPlayCharacterOperationEffect_PlayerA_34",
                    "title": [
                        "使用型",
                        [
                            "自軍",
                            "配備フェイズ"
                        ]
                    ],
                    "description": "Play クェス・パラヤ",
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
                        "橫置支付0[緑]": {
                            "title": [
                                "RollColor",
                                "緑"
                            ],
                            "actions": [
                                {
                                    "title": [
                                        "_ロールする",
                                        "ロール"
                                    ],
                                    "vars": [
                                        "橫置支付0[緑]"
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
                        },
                        "同名卡不能下": {
                            "actions": [
                                {
                                    "title": [
                                        "Entity",
                                        {
                                            "atBa": true,
                                            "hasTitle": [
                                                "クェス・パラヤ"
                                            ],
                                            "count": 0
                                        }
                                    ]
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
            "id": 1367,
            "description": "PlayerA_20.isRoll false => true",
            "effect": {
                "id": "createPlayCharacterOperationEffect_PlayerA_34",
                "reason": [
                    "PlayCard",
                    "PlayerA",
                    "PlayerA_34",
                    {
                        "isPlayCharacter": true,
                        "isPlayOperation": false
                    }
                ],
                "description": "Play クェス・パラヤ",
                "text": {
                    "id": "createPlayCharacterOperationEffect_PlayerA_34",
                    "title": [
                        "使用型",
                        [
                            "自軍",
                            "配備フェイズ"
                        ]
                    ],
                    "description": "Play クェス・パラヤ",
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
                        "橫置支付0[緑]": {
                            "title": [
                                "RollColor",
                                "緑"
                            ],
                            "actions": [
                                {
                                    "title": [
                                        "_ロールする",
                                        "ロール"
                                    ],
                                    "vars": [
                                        "橫置支付0[緑]"
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
                        },
                        "同名卡不能下": {
                            "actions": [
                                {
                                    "title": [
                                        "Entity",
                                        {
                                            "atBa": true,
                                            "hasTitle": [
                                                "クェス・パラヤ"
                                            ],
                                            "count": 0
                                        }
                                    ]
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
            "id": 1366,
            "description": "onEffectStart: Play クェス・パラヤ",
            "effect": {
                "id": "createPlayCharacterOperationEffect_PlayerA_34",
                "reason": [
                    "PlayCard",
                    "PlayerA",
                    "PlayerA_34",
                    {
                        "isPlayCharacter": true,
                        "isPlayOperation": false
                    }
                ],
                "description": "Play クェス・パラヤ",
                "text": {
                    "id": "createPlayCharacterOperationEffect_PlayerA_34",
                    "title": [
                        "使用型",
                        [
                            "自軍",
                            "配備フェイズ"
                        ]
                    ],
                    "description": "Play クェス・パラヤ",
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
                        "橫置支付0[緑]": {
                            "title": [
                                "RollColor",
                                "緑"
                            ],
                            "actions": [
                                {
                                    "title": [
                                        "_ロールする",
                                        "ロール"
                                    ],
                                    "vars": [
                                        "橫置支付0[緑]"
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
                        },
                        "同名卡不能下": {
                            "actions": [
                                {
                                    "title": [
                                        "Entity",
                                        {
                                            "atBa": true,
                                            "hasTitle": [
                                                "クェス・パラヤ"
                                            ],
                                            "count": 0
                                        }
                                    ]
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
            "id": 1365,
            "description": "onSetPhase:配備フェイズ,フリータイミング"
        },
        {
            "id": 1364,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 1363,
            "description": "onSetPhase:配備フェイズ,フェイズ開始"
        },
        {
            "id": 1362,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 1361,
            "description": "onSetPhase:ドローフェイズ,フェイズ終了"
        },
        {
            "id": 1360,
            "description": "onSetPhase:ドローフェイズ,フリータイミング"
        },
        {
            "id": 1359,
            "description": "onEffectEnd: 抽牌階段規定效果"
        },
        {
            "id": 1358,
            "description": "onItemMove:PlayerA_34 = [\"PlayerA\",\"本国\"] => [\"PlayerA\",\"手札\"]",
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
            "id": 1357,
            "description": "onEvent: GameEventOnMove [\"PlayerA_34\"]",
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
            "id": 1356,
            "description": "PlayerA_34.isRoll undefined => false",
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
            "id": 1355,
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
            "id": 1354,
            "description": "onSetPhase:ドローフェイズ,規定の効果"
        },
        {
            "id": 1353,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 1352,
            "description": "onSetPhase:ドローフェイズ,フェイズ開始"
        },
        {
            "id": 1351,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 1350,
            "description": "onSetPhase:リロールフェイズ,フェイズ終了"
        },
        {
            "id": 1349,
            "description": "onSetPhase:リロールフェイズ,フリータイミング"
        },
        {
            "id": 1348,
            "description": "onEffectEnd: getRerollPhaseRuleEffect"
        },
        {
            "id": 1347,
            "description": "PlayerA_4.isRoll true => false",
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
            "id": 1346,
            "description": "PlayerA_38.isRoll true => false",
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
            "id": 1345,
            "description": "PlayerA_6.isRoll true => false",
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
            "id": 1344,
            "description": "PlayerA_9.isRoll true => false",
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
            "id": 1343,
            "description": "PlayerA_20.isRoll true => false",
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
            "id": 1342,
            "description": "PlayerA_45.isRoll true => false",
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
            "id": 1341,
            "description": "PlayerA_27.isRoll true => false",
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
            "id": 1340,
            "description": "PlayerA_8.isRoll true => false",
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
            "id": 1339,
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
            "id": 1338,
            "description": "onSetPhase:リロールフェイズ,規定の効果"
        },
        {
            "id": 1337,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 1336,
            "description": "onSetPhase:リロールフェイズ,フェイズ開始"
        },
        {
            "id": 1335,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 1334,
            "description": "onPlayerStateChange:PlayerB"
        },
        {
            "id": 1333,
            "description": "onSetPhase:戦闘フェイズ,ターン終了時,効果終了。ターン終了"
        },
        {
            "id": 1332,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 1331,
            "description": "將發動起動效果但條件不足: : 調整手牌為7張以下"
        },
        {
            "id": 1330,
            "description": "將發動起動效果但條件不足: : 調整手牌為7張以下"
        },
        {
            "id": 1329,
            "description": "onSetPhase:戦闘フェイズ,ターン終了時,手札調整"
        },
        {
            "id": 1328,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 1327,
            "description": "onSetPhase:戦闘フェイズ,ターン終了時,効果解決"
        },
        {
            "id": 1326,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 1325,
            "description": "傷害變化: PlayerB_65 3 => 0"
        },
        {
            "id": 1324,
            "description": "傷害變化: PlayerA_27 4 => 0"
        },
        {
            "id": 1323,
            "description": "onSetPhase:戦闘フェイズ,ターン終了時,ダメージリセット"
        },
        {
            "id": 1322,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 1321,
            "description": "onSetPhase:戦闘フェイズ,帰還ステップ,ステップ終了"
        },
        {
            "id": 1320,
            "description": "onSetPhase:戦闘フェイズ,帰還ステップ,フリータイミング2"
        },
        {
            "id": 1319,
            "description": "onEffectEnd: getReturnRuleEffect"
        },
        {
            "id": 1318,
            "description": "onItemMove:PlayerA_45 = [\"PlayerA\",\"戦闘エリア1\"] => [\"PlayerA\",\"配備エリア\"]",
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
            "id": 1317,
            "description": "onItemMove:PlayerA_27 = [\"PlayerA\",\"戦闘エリア1\"] => [\"PlayerA\",\"配備エリア\"]",
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
            "id": 1316,
            "description": "onEvent: GameEventOnMove [\"PlayerA_45\"]",
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
            "id": 1315,
            "description": "onEvent: GameEventOnMove [\"PlayerA_27\"]",
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
        }
    ],
    "messagesCurrentEffect": null,
    "messagesIsPlayerRead": {},
    "turn": 11,
    "setGroup": {
        "itemGroupParent": {
            "PlayerA_45": "PlayerA_27",
            "PlayerA_34": "PlayerA_8"
        },
        "itemGroupChildren": {
            "PlayerA_27": [
                "PlayerA_45"
            ],
            "PlayerA_8": [
                "PlayerA_34"
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
        "hasPlayerPassCut": {},
        "hasPlayerPassPayCost": {},
        "shouldTriggerStackEffectFinishedEvent": false,
        "activeEffectID": null,
        "activeLogicID": null,
        "activeLogicSubID": null
    }
}