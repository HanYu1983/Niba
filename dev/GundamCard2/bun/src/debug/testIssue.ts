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

    // ctx = updateCommand(ctx) as GameStateWithFlowMemory
    // console.log(getPlayerCommandsFilterNoErrorDistinct(ctx, PlayerA))

    const cardId = "PlayerB_87"
    const from = GameStateFn.getItemBaSyou(ctx, cardId)
    const hasNT = GameStateFn.getItemIdsByBasyou(ctx, from).filter(itemId => GameStateFn.getItemCharacteristic(ctx, itemId).indexOf("NT") != -1).length > 0
    console.log(hasNT)

    //"PlayerA_8"
    //throw new Error()

}

const TMP_CTX: GameStateWithFlowMemory = {
    "isGameState": true,
    "cards": {
        "PlayerA_0": {
            "id": "PlayerA_0",
            "protoID": "179003_01A_C_BN003C_brown",
            "ownerID": "PlayerA",
            "isFaceDown": true,
            "isRoll": false
        },
        "PlayerA_1": {
            "id": "PlayerA_1",
            "protoID": "179003_01A_C_BN003C_brown",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_2": {
            "id": "PlayerA_2",
            "protoID": "179003_01A_C_BN003C_brown",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_3": {
            "id": "PlayerA_3",
            "protoID": "179003_01A_U_BN006R_brown_02",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_4": {
            "id": "PlayerA_4",
            "protoID": "179003_01A_U_BN006R_brown_02",
            "ownerID": "PlayerA",
            "isFaceDown": false,
            "isRoll": false
        },
        "PlayerA_5": {
            "id": "PlayerA_5",
            "protoID": "179003_01A_U_BN006R_brown_02",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_6": {
            "id": "PlayerA_6",
            "protoID": "179004_01A_O_BN005U_brown",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_7": {
            "id": "PlayerA_7",
            "protoID": "179004_01A_O_BN005U_brown",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_8": {
            "id": "PlayerA_8",
            "protoID": "179014_03B_U_BN046R_brown_haku",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_9": {
            "id": "PlayerA_9",
            "protoID": "179014_03B_U_BN046R_brown_haku",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_10": {
            "id": "PlayerA_10",
            "protoID": "179014_03B_U_BN046R_brown_haku",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_11": {
            "id": "PlayerA_11",
            "protoID": "179015_04B_U_BN057C_brown",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_12": {
            "id": "PlayerA_12",
            "protoID": "179015_04B_U_BN057C_brown",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_13": {
            "id": "PlayerA_13",
            "protoID": "179015_04B_U_BN057C_brown",
            "ownerID": "PlayerA",
            "isFaceDown": false,
            "isRoll": false
        },
        "PlayerA_14": {
            "id": "PlayerA_14",
            "protoID": "179016_04B_U_BN066C_brown",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_15": {
            "id": "PlayerA_15",
            "protoID": "179018_05C_C_BN027C_brown",
            "ownerID": "PlayerA",
            "isFaceDown": false,
            "isRoll": true
        },
        "PlayerA_16": {
            "id": "PlayerA_16",
            "protoID": "179018_05C_C_BN027C_brown",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_17": {
            "id": "PlayerA_17",
            "protoID": "179018_05C_C_BN027C_brown",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_18": {
            "id": "PlayerA_18",
            "protoID": "179018_05C_C_BN029R_brown",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_19": {
            "id": "PlayerA_19",
            "protoID": "179018_05C_C_BN029R_brown",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_20": {
            "id": "PlayerA_20",
            "protoID": "179022_06C_C_BN036U_brown",
            "ownerID": "PlayerA",
            "isFaceDown": true,
            "isRoll": false
        },
        "PlayerA_21": {
            "id": "PlayerA_21",
            "protoID": "179022_06C_C_BN036U_brown",
            "ownerID": "PlayerA",
            "isFaceDown": true,
            "isRoll": false
        },
        "PlayerA_22": {
            "id": "PlayerA_22",
            "protoID": "179022_06C_C_BN036U_brown",
            "ownerID": "PlayerA",
            "isFaceDown": false,
            "isRoll": false
        },
        "PlayerA_23": {
            "id": "PlayerA_23",
            "protoID": "179022_06C_CH_BN052R_brown",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_24": {
            "id": "PlayerA_24",
            "protoID": "179022_06C_U_BN101R_brown",
            "ownerID": "PlayerA",
            "isFaceDown": true,
            "isRoll": false
        },
        "PlayerA_25": {
            "id": "PlayerA_25",
            "protoID": "179022_06C_U_BN101R_brown",
            "ownerID": "PlayerA",
            "isFaceDown": true,
            "isRoll": false
        },
        "PlayerA_26": {
            "id": "PlayerA_26",
            "protoID": "179022_06C_U_BN101R_brown",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_27": {
            "id": "PlayerA_27",
            "protoID": "179024_B2B_C_BN041C_brown",
            "ownerID": "PlayerA",
            "isFaceDown": true,
            "isRoll": false
        },
        "PlayerA_28": {
            "id": "PlayerA_28",
            "protoID": "179024_B2B_C_BN041C_brown",
            "ownerID": "PlayerA",
            "isFaceDown": false,
            "isRoll": false
        },
        "PlayerA_29": {
            "id": "PlayerA_29",
            "protoID": "179024_B2B_C_BN041C_brown",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_30": {
            "id": "PlayerA_30",
            "protoID": "179025_07D_CH_BN066R_brown",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_31": {
            "id": "PlayerA_31",
            "protoID": "179025_07D_U_BN138R_brown",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_32": {
            "id": "PlayerA_32",
            "protoID": "179025_07D_U_BN138R_brown",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_33": {
            "id": "PlayerA_33",
            "protoID": "179025_07D_U_BN138R_brown",
            "ownerID": "PlayerA",
            "isFaceDown": true,
            "isRoll": false
        },
        "PlayerA_34": {
            "id": "PlayerA_34",
            "protoID": "179028_10D_U_BN164N_brown",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_35": {
            "id": "PlayerA_35",
            "protoID": "179028_10D_U_BN164N_brown",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_36": {
            "id": "PlayerA_36",
            "protoID": "179028_10D_U_BN164N_brown",
            "ownerID": "PlayerA",
            "isFaceDown": true,
            "isRoll": false
        },
        "PlayerA_37": {
            "id": "PlayerA_37",
            "protoID": "179029_05C_U_BN077R_brown",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_38": {
            "id": "PlayerA_38",
            "protoID": "179029_05C_U_BN077R_brown",
            "ownerID": "PlayerA",
            "isFaceDown": true,
            "isRoll": false
        },
        "PlayerA_39": {
            "id": "PlayerA_39",
            "protoID": "179029_05C_U_BN077R_brown",
            "ownerID": "PlayerA",
            "isFaceDown": false,
            "isRoll": false
        },
        "PlayerA_40": {
            "id": "PlayerA_40",
            "protoID": "179029_06C_C_BN039R_brown",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_41": {
            "id": "PlayerA_41",
            "protoID": "179029_06C_C_BN039R_brown",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_42": {
            "id": "PlayerA_42",
            "protoID": "179029_06C_C_BN039R_brown",
            "ownerID": "PlayerA",
            "isFaceDown": false,
            "isRoll": true
        },
        "PlayerA_43": {
            "id": "PlayerA_43",
            "protoID": "179029_B3C_CH_BN088R_brown",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_44": {
            "id": "PlayerA_44",
            "protoID": "179030_11E_U_BN188N_brown",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_45": {
            "id": "PlayerA_45",
            "protoID": "179030_11E_U_BN188N_brown",
            "ownerID": "PlayerA",
            "isFaceDown": true,
            "isRoll": false
        },
        "PlayerA_46": {
            "id": "PlayerA_46",
            "protoID": "179030_11E_U_BN188N_brown",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_47": {
            "id": "PlayerA_47",
            "protoID": "179901_09D_C_BN007P_brown",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_48": {
            "id": "PlayerA_48",
            "protoID": "179901_09D_C_BN007P_brown",
            "ownerID": "PlayerA",
            "isFaceDown": true,
            "isRoll": false
        },
        "PlayerA_49": {
            "id": "PlayerA_49",
            "protoID": "179901_09D_C_BN007P_brown",
            "ownerID": "PlayerA",
            "isFaceDown": true,
            "isRoll": false
        },
        "PlayerB_50": {
            "id": "PlayerB_50",
            "protoID": "179003_01A_C_GN003R_green",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "PlayerB_51": {
            "id": "PlayerB_51",
            "protoID": "179003_01A_CH_GN001R_green",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "PlayerB_52": {
            "id": "PlayerB_52",
            "protoID": "179003_01A_U_GN001R_green",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "PlayerB_53": {
            "id": "PlayerB_53",
            "protoID": "179003_01A_U_GN001R_green",
            "ownerID": "PlayerB",
            "isFaceDown": false,
            "isRoll": false
        },
        "PlayerB_54": {
            "id": "PlayerB_54",
            "protoID": "179003_01A_U_GN001R_green",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "PlayerB_55": {
            "id": "PlayerB_55",
            "protoID": "179003_01A_U_GN008R_green_02",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "PlayerB_56": {
            "id": "PlayerB_56",
            "protoID": "179003_01A_U_GN008R_green_02",
            "ownerID": "PlayerB",
            "isFaceDown": false,
            "isRoll": true
        },
        "PlayerB_57": {
            "id": "PlayerB_57",
            "protoID": "179003_01A_U_GN008R_green_02",
            "ownerID": "PlayerB",
            "isFaceDown": false
        },
        "PlayerB_58": {
            "id": "PlayerB_58",
            "protoID": "179007_02A_U_GN020R_green",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "PlayerB_59": {
            "id": "PlayerB_59",
            "protoID": "179009_03B_U_GN036U_green",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "PlayerB_60": {
            "id": "PlayerB_60",
            "protoID": "179009_03B_U_GN036U_green",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "PlayerB_61": {
            "id": "PlayerB_61",
            "protoID": "179009_03B_U_GN036U_green",
            "ownerID": "PlayerB",
            "isFaceDown": false,
            "isRoll": false
        },
        "PlayerB_62": {
            "id": "PlayerB_62",
            "protoID": "179009_03B_U_GN037C_green",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "PlayerB_63": {
            "id": "PlayerB_63",
            "protoID": "179009_03B_U_GN037C_green",
            "ownerID": "PlayerB",
            "isFaceDown": false,
            "isRoll": true
        },
        "PlayerB_64": {
            "id": "PlayerB_64",
            "protoID": "179009_03B_U_GN037C_green",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "PlayerB_65": {
            "id": "PlayerB_65",
            "protoID": "179009_03B_U_GN042R_green",
            "ownerID": "PlayerB",
            "isFaceDown": false,
            "isRoll": false
        },
        "PlayerB_66": {
            "id": "PlayerB_66",
            "protoID": "179009_03B_U_GN042R_green",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "PlayerB_67": {
            "id": "PlayerB_67",
            "protoID": "179009_03B_U_GN042R_green",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "PlayerB_68": {
            "id": "PlayerB_68",
            "protoID": "179015_04B_CH_GN030R_green",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "PlayerB_69": {
            "id": "PlayerB_69",
            "protoID": "179015_04B_U_GN053U_green",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "PlayerB_70": {
            "id": "PlayerB_70",
            "protoID": "179015_04B_U_GN055R_green_haku",
            "ownerID": "PlayerB",
            "isFaceDown": false,
            "isRoll": true
        },
        "PlayerB_71": {
            "id": "PlayerB_71",
            "protoID": "179015_04B_U_GN055R_green_haku",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "PlayerB_72": {
            "id": "PlayerB_72",
            "protoID": "179016_04B_CH_GN035R_green",
            "ownerID": "PlayerB",
            "isFaceDown": true,
            "isRoll": false
        },
        "PlayerB_73": {
            "id": "PlayerB_73",
            "protoID": "179016_04B_CH_GN036C_green",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "PlayerB_74": {
            "id": "PlayerB_74",
            "protoID": "179016_04B_CH_GN036C_green",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "PlayerB_75": {
            "id": "PlayerB_75",
            "protoID": "179018_05C_U_GN082U_green",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "PlayerB_76": {
            "id": "PlayerB_76",
            "protoID": "179019_02A_U_GN024U_green",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "PlayerB_77": {
            "id": "PlayerB_77",
            "protoID": "179019_02A_U_GN024U_green",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "PlayerB_78": {
            "id": "PlayerB_78",
            "protoID": "179019_02A_U_GN024U_green",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "PlayerB_79": {
            "id": "PlayerB_79",
            "protoID": "179024_B2B_C_GN052C_green",
            "ownerID": "PlayerB",
            "isFaceDown": true,
            "isRoll": false
        },
        "PlayerB_80": {
            "id": "PlayerB_80",
            "protoID": "179025_07D_C_GN056U_green",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "PlayerB_81": {
            "id": "PlayerB_81",
            "protoID": "179025_07D_CH_GN070C_green",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "PlayerB_82": {
            "id": "PlayerB_82",
            "protoID": "179029_05C_U_GN077R_green",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "PlayerB_83": {
            "id": "PlayerB_83",
            "protoID": "179030_11E_C_GN074R_green",
            "ownerID": "PlayerB",
            "isFaceDown": false,
            "isRoll": false
        },
        "PlayerB_84": {
            "id": "PlayerB_84",
            "protoID": "179030_11E_CH_GN093N_green",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "PlayerB_85": {
            "id": "PlayerB_85",
            "protoID": "179030_11E_CH_GN094R_green",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "PlayerB_86": {
            "id": "PlayerB_86",
            "protoID": "179030_11E_U_GN184N_green",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "PlayerB_87": {
            "id": "PlayerB_87",
            "protoID": "179030_11E_U_GN184N_green",
            "ownerID": "PlayerB",
            "isFaceDown": false,
            "isRoll": false
        },
        "PlayerB_88": {
            "id": "PlayerB_88",
            "protoID": "179030_11E_U_GN184N_green",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "PlayerB_89": {
            "id": "PlayerB_89",
            "protoID": "179031_12E_CH_GN096R_green",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "PlayerB_90": {
            "id": "PlayerB_90",
            "protoID": "179901_00_C_GN007P_green",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "PlayerB_91": {
            "id": "PlayerB_91",
            "protoID": "179901_00_C_GN007P_green",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "PlayerB_92": {
            "id": "PlayerB_92",
            "protoID": "179901_00_C_GN007P_green",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "PlayerB_93": {
            "id": "PlayerB_93",
            "protoID": "179901_00_U_GN001P_green_02",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "PlayerB_94": {
            "id": "PlayerB_94",
            "protoID": "179901_00_U_GN002P_green_02",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "PlayerB_95": {
            "id": "PlayerB_95",
            "protoID": "179901_CG_CH_GN001P_green",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "PlayerB_96": {
            "id": "PlayerB_96",
            "protoID": "179901_CG_U_GN003P_green",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "PlayerB_97": {
            "id": "PlayerB_97",
            "protoID": "179901_CG_U_GN003P_green",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "PlayerB_98": {
            "id": "PlayerB_98",
            "protoID": "179901_CG_U_GN008P_green",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "PlayerB_99": {
            "id": "PlayerB_99",
            "protoID": "179901_CG_U_GN008P_green",
            "ownerID": "PlayerB",
            "isFaceDown": true
        }
    },
    "effects": {
        "addStackEffect_01929626-a5f9-7002-8139-e2bd1a3f89a7": {
            "id": "addStackEffect_01929626-a5f9-7002-8139-e2bd1a3f89a7",
            "description": "交戰中的敵軍機體1張x傷害. 這個效果只有在同區中有NT才能使用.",
            "reason": [
                "PlayText",
                "PlayerB",
                "PlayerB_87",
                "loadPrototype_179030_11E_U_GN184N_green_text_2"
            ],
            "text": {
                "id": "loadPrototype_179030_11E_U_GN184N_green_text_2",
                "description": "交戰中的敵軍機體1張x傷害. 這個效果只有在同區中有NT才能使用.",
                "title": [],
                "logicTreeActions": [
                    {
                        "actions": [
                            {
                                "title": [
                                    "_１ダメージを与える",
                                    2
                                ],
                                "vars": [
                                    "交戰中的敵軍機體1張"
                                ]
                            }
                        ]
                    }
                ]
            }
        },
        "createPlayEffects_PlayerA_PlayerA_39_loadPrototype_179029_05C_U_BN077R_brown_text_1": {
            "id": "createPlayEffects_PlayerA_PlayerA_39_loadPrototype_179029_05C_U_BN077R_brown_text_1",
            "reason": [
                "PlayText",
                "PlayerA",
                "PlayerA_39",
                "loadPrototype_179029_05C_U_BN077R_brown_text_1"
            ],
            "description": "打開自軍手裡或指定HANGER中特徵A並合計國力x以下的1張卡, 和這張卡重置狀態置換, 這張卡置換後廢棄. x為自軍G的張數",
            "text": {
                "id": "loadPrototype_179029_05C_U_BN077R_brown_text_1",
                "title": [
                    "使用型",
                    [
                        "戦闘フェイズ"
                    ]
                ],
                "description": "打開自軍手裡或指定HANGER中特徵A並合計國力x以下的1張卡, 和這張卡重置狀態置換, 這張卡置換後廢棄. x為自軍G的張數",
                "conditions": {
                    "打開自軍手裡或指定HANGER中特徵A並合計國力x以下的1張卡": {
                        "title": "function _(ctx2, effect, bridge) {\n                const { A: A2 } = {\"A\":\"シャイニング系\"};\n                if (A2 == \"\")\n                  throw new Error(\"A\\u6C92\\u6709\\u88AB\\u5B57\\u4E32\\u7F6E\\u63DB\");\n                const { GameStateFn, DefineFn } = bridge, cardId = DefineFn.EffectFn.getCardID(effect), cardController = GameStateFn.getItemController(ctx2, cardId), gCount = GameStateFn.getItemIdsByBasyou(ctx2, DefineFn.AbsoluteBaSyouFn.of(cardController, \"G\\u30BE\\u30FC\\u30F3\")).length;\n                return GameStateFn.createConditionTitleFn({\n                  title: [\"\\u6253\\u958B\\u81EA\\u8ECD\\u624B\\u88E1\\u6216\\u6307\\u5B9AHANGER\\u4E2D\\u7279\\u5FB5_A\\u4E26\\u5408\\u8A08\\u570B\\u529B_x\\u4EE5\\u4E0B\\u7684_1\\u5F35\\u5361\", A2, gCount, 1]\n                })(ctx2, effect, bridge);\n              }"
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
        "createPlayEffects_PlayerB_PlayerB_87_loadPrototype_179030_11E_U_GN184N_green_text_2": {
            "id": "createPlayEffects_PlayerB_PlayerB_87_loadPrototype_179030_11E_U_GN184N_green_text_2",
            "reason": [
                "PlayText",
                "PlayerB",
                "PlayerB_87",
                "loadPrototype_179030_11E_U_GN184N_green_text_2"
            ],
            "description": "交戰中的敵軍機體1張x傷害. 這個效果只有在同區中有NT才能使用.",
            "text": {
                "id": "loadPrototype_179030_11E_U_GN184N_green_text_2",
                "title": [
                    "使用型",
                    [
                        "防御ステップ"
                    ]
                ],
                "description": "交戰中的敵軍機體1張x傷害. 這個效果只有在同區中有NT才能使用.",
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
                    "交戰中的敵軍機體1張": {
                        "title": "function _(ctx2, effect, { GameStateFn, DefineFn, Options }) {\n                const { addCardIds: addCardIds2 } = {\"addCardIds\":[]};\n                if (addCardIds2 == null)\n                  throw new Error(\"addCardIds must replace\");\n                const cardId = DefineFn.EffectFn.getCardID(effect), tip = GameStateFn.createTipByEntitySearch(ctx2, effect, {\n                  isBattle: !0,\n                  side: \"\\u6575\\u8ECD\",\n                  is: [\"\\u30E6\\u30CB\\u30C3\\u30C8\"],\n                  count: 1\n                }, { ges: Options.ges });\n                let wants = DefineFn.TipFn.getWant(tip);\n                return wants = [...wants, ...addCardIds2.map((itemId) => GameStateFn.createStrBaSyouPair(ctx2, itemId))], {\n                  title: [\"\\u30AB\\u30FC\\u30C9\", wants, wants.slice(0, 1)],\n                  count: 1\n                };\n              }"
                    },
                    "同區中有NT才能使用": {
                        "actions": [
                            {
                                "title": "function _(ctx2, effect, { GameStateFn, DefineFn }) {\n                    const cardId = DefineFn.EffectFn.getCardID(effect), from = GameStateFn.getItemBaSyou(ctx2, cardId);\n                    if (GameStateFn.getItemIdsByBasyou(ctx2, from).filter((itemId) => GameStateFn.getItemCharacteristic(ctx2, itemId).indexOf(\"NT\")).length > 0 == !1)\n                      throw new TipError(\"no NT in the same area\");\n                    return ctx2;\n                  }"
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
                                    "value": "交戰中的敵軍機體1張"
                                },
                                {
                                    "type": "Leaf",
                                    "value": "同區中有NT才能使用"
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
                                                "_１ダメージを与える",
                                                2
                                            ],
                                            "vars": [
                                                "交戰中的敵軍機體1張"
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
                "PlayerA_11",
                "PlayerA_18",
                "PlayerA_37",
                "PlayerA_41",
                "PlayerA_40",
                "PlayerA_34",
                "PlayerA_1",
                "PlayerA_12",
                "PlayerA_10",
                "PlayerA_6",
                "PlayerA_16",
                "PlayerA_30",
                "PlayerA_14",
                "PlayerA_5",
                "PlayerA_44",
                "PlayerA_7",
                "PlayerA_23",
                "PlayerA_43",
                "PlayerA_46",
                "PlayerA_2",
                "PlayerA_35",
                "PlayerA_32",
                "PlayerA_29",
                "PlayerA_17",
                "PlayerA_19",
                "PlayerA_9",
                "PlayerA_26",
                "PlayerA_3",
                "PlayerA_47",
                "PlayerA_8"
            ],
            "[\"PlayerB\",\"本国\"]": [
                "PlayerB_94",
                "PlayerB_64",
                "PlayerB_96",
                "PlayerB_75",
                "PlayerB_62",
                "PlayerB_90",
                "PlayerB_76",
                "PlayerB_95",
                "PlayerB_98",
                "PlayerB_51",
                "PlayerB_84",
                "PlayerB_71",
                "PlayerB_89",
                "PlayerB_86",
                "PlayerB_93",
                "PlayerB_78",
                "PlayerB_59",
                "PlayerB_80",
                "PlayerB_74",
                "PlayerB_69",
                "PlayerB_52",
                "PlayerB_91",
                "PlayerB_92",
                "PlayerB_81",
                "PlayerB_77",
                "PlayerB_99",
                "PlayerB_55",
                "PlayerB_82",
                "PlayerB_66",
                "PlayerB_97",
                "PlayerB_58",
                "PlayerB_54",
                "PlayerB_68",
                "PlayerB_60",
                "PlayerB_85",
                "PlayerB_73",
                "PlayerB_67",
                "PlayerB_88",
                "PlayerB_50"
            ],
            "[\"PlayerA\",\"手札\"]": [
                "PlayerA_31",
                "PlayerA_25",
                "PlayerA_36",
                "PlayerA_33"
            ],
            "[\"PlayerB\",\"手札\"]": [
                "PlayerB_72",
                "PlayerB_79"
            ],
            "[\"PlayerA\",\"Gゾーン\"]": [
                "PlayerA_15",
                "PlayerA_42",
                "PlayerA_22",
                "PlayerA_28",
                "PlayerA_13"
            ],
            "[\"PlayerB\",\"Gゾーン\"]": [
                "PlayerB_70",
                "PlayerB_56",
                "PlayerB_63",
                "PlayerB_65",
                "PlayerB_57"
            ],
            "[\"PlayerB\",\"プレイされているカード\"]": [],
            "[\"PlayerB\",\"配備エリア\"]": [],
            "[\"PlayerB\",\"戦闘エリア1\"]": [
                "PlayerB_87"
            ],
            "[\"PlayerA\",\"捨て山\"]": [
                "PlayerA_24",
                "PlayerA_38",
                "PlayerA_20",
                "PlayerA_21",
                "PlayerA_0",
                "PlayerA_49",
                "PlayerA_27",
                "PlayerA_45",
                "PlayerA_48"
            ],
            "[\"PlayerA\",\"プレイされているカード\"]": [],
            "[\"PlayerA\",\"配備エリア\"]": [],
            "[\"PlayerB\",\"ジャンクヤード\"]": [
                "PlayerB_83",
                "PlayerB_61"
            ],
            "[\"PlayerB\",\"戦闘エリア2\"]": [
                "PlayerB_53"
            ],
            "[\"PlayerA\",\"戦闘エリア1\"]": [],
            "[\"PlayerA\",\"ジャンクヤード\"]": [
                "PlayerA_4"
            ],
            "[\"PlayerA\",\"戦闘エリア2\"]": [
                "PlayerA_39"
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
                                "PlayerB_87",
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
                                "PlayerB_53",
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
        "PlayerB_53": {
            "id": "PlayerB_53",
            "damage": 0,
            "destroyReason": null,
            "flags": {},
            "tips": {
                "橫置支付0[緑]": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerB_70",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_56",
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
                                "PlayerB_70",
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
                "橫置支付1[緑]": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerB_56",
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
                                "PlayerB_56",
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
                                "PlayerB_70",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_56",
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
            "isAttack": true,
            "isDefence": false,
            "isOpenForGain": false,
            "isCheat": false,
            "textIdsUseThisTurn": []
        },
        "PlayerA_13": {
            "id": "PlayerA_13",
            "damage": 0,
            "destroyReason": null,
            "flags": {},
            "tips": {
                "橫置支付0[茶]": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerA_15",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_42",
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
                                "PlayerA_15",
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
                                "PlayerA_15",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_42",
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
            "isOpenForGain": false,
            "isCheat": false,
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
                "ロール状態の敵軍ユニット１枚": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerA_13",
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
                                "PlayerA_13",
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
                "橫置支付0[緑]": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerB_70",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_56",
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
                                "PlayerB_70",
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
                "橫置支付1[緑]": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerB_56",
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
                                "PlayerB_56",
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
                                "PlayerB_70",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_56",
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
            "isOpenForGain": false,
            "isCheat": false,
            "isFirstTurn": false,
            "textIdsUseThisTurn": [],
            "isAttack": false,
            "isDefence": false
        },
        "PlayerA_4": {
            "id": "PlayerA_4",
            "damage": 0,
            "destroyReason": null,
            "flags": {},
            "tips": {
                "橫置支付0[茶]": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerA_15",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_42",
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
                                "PlayerA_28",
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
                                "PlayerA_15",
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
                "橫置支付1[茶]": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerA_42",
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
                                "PlayerA_28",
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
                                "PlayerA_42",
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
                                "PlayerA_15",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_42",
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
                    ]
                },
                "橫置支付0[null]": {
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
                                "PlayerA_28",
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
                "這張卡在戰區的場合, 打開自軍本國上的1張卡": {
                    "title": [
                        "カード",
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
                    "count": 1,
                    "cheatCardIds": [
                        "PlayerA_27"
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
        "PlayerB_61": {
            "id": "PlayerB_61",
            "damage": 0,
            "destroyReason": null,
            "flags": {},
            "tips": {
                "橫置支付0[緑]": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerB_70",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_56",
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
                                "PlayerB_65",
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
                                "PlayerB_70",
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
                "橫置支付1[緑]": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerB_56",
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
                                "PlayerB_65",
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
                                "PlayerB_56",
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
                                "PlayerB_70",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_56",
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
                                "PlayerB_65",
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
            "isAttack": false,
            "isDefence": false,
            "isOpenForGain": false,
            "isCheat": false,
            "textIdsUseThisTurn": []
        },
        "SystemFakeCardID_createAttackPhaseRuleEffect_text_PlayerA": {
            "id": "SystemFakeCardID_createAttackPhaseRuleEffect_text_PlayerA",
            "damage": 0,
            "destroyReason": null,
            "flags": {},
            "tips": {
                "去宇宙": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerA_39",
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
                                "PlayerA_39",
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
                },
                "去地球": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerA_39",
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
        "PlayerA_27": {
            "id": "PlayerA_27",
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
        "PlayerA_39": {
            "id": "PlayerA_39",
            "damage": 0,
            "destroyReason": null,
            "flags": {},
            "tips": {
                "橫置支付0[茶]": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerA_15",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_42",
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
                                "PlayerA_13",
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
                                "PlayerA_15",
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
                "橫置支付1[茶]": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerA_42",
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
                                "PlayerA_13",
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
                                "PlayerA_42",
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
                                "PlayerA_15",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_42",
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
        "PlayerB_87": {
            "id": "PlayerB_87",
            "damage": 0,
            "destroyReason": null,
            "flags": {
                "enabled": true
            },
            "tips": {
                "橫置支付0[緑]": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerB_70",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_56",
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
                                "PlayerB_65",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
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
                        ],
                        [
                            [
                                "PlayerB_70",
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
                "橫置支付1[緑]": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerB_56",
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
                                "PlayerB_65",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
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
                        ],
                        [
                            [
                                "PlayerB_56",
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
                                "PlayerB_70",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_56",
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
                                "PlayerB_65",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
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
                    ]
                },
                "交戰中的敵軍機體1張": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerA_39",
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
                                "PlayerA_39",
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
                    "count": 1
                },
                "橫置支付0[null]": {
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
                                "PlayerB_65",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
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
                }
            },
            "globalEffects": {},
            "varNamesRemoveOnTurnEnd": {
                "enabled": true
            },
            "isFirstTurn": true,
            "textIdsUseThisTurn": [
                "loadPrototype_179030_11E_U_GN184N_green_text_2",
                "loadPrototype_179030_11E_U_GN184N_green_text_0"
            ],
            "isAttack": true,
            "isDefence": false
        }
    },
    "phase": [
        "戦闘フェイズ",
        "防御ステップ",
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
            "textIdsUseThisTurn": {}
        }
    },
    "activePlayerID": "PlayerB",
    "immediateEffect": [],
    "stackEffect": [
        "addStackEffect_01929626-a5f9-7002-8139-e2bd1a3f89a7"
    ],
    "destroyEffect": [],
    "commandEffects": [
        "createPlayEffects_PlayerA_PlayerA_39_loadPrototype_179029_05C_U_BN077R_brown_text_1",
        "createPlayEffects_PlayerB_PlayerB_87_loadPrototype_179030_11E_U_GN184N_green_text_2"
    ],
    "commandEffectTips": [
        {
            "effectId": "createPlayEffects_PlayerA_PlayerA_39_loadPrototype_179029_05C_U_BN077R_brown_text_1",
            "conditionKeys": [
                "同回合上限",
                "打開自軍手裡或指定HANGER中特徵A並合計國力x以下的1張卡"
            ],
            "logicID": 0,
            "logicSubID": 0,
            "tipOrErrors": [
                {
                    "effectId": "createPlayEffects_PlayerA_PlayerA_39_loadPrototype_179029_05C_U_BN077R_brown_text_1",
                    "conditionKey": "同回合上限",
                    "tip": null,
                    "errors": []
                },
                {
                    "effectId": "createPlayEffects_PlayerA_PlayerA_39_loadPrototype_179029_05C_U_BN077R_brown_text_1",
                    "conditionKey": "打開自軍手裡或指定HANGER中特徵A並合計國力x以下的1張卡",
                    "tip": {
                        "title": [
                            "カード",
                            [
                                [
                                    "PlayerA_36",
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
                                    "PlayerA_36",
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
                }
            ]
        },
        {
            "effectId": "createPlayEffects_PlayerB_PlayerB_87_loadPrototype_179030_11E_U_GN184N_green_text_2",
            "conditionKeys": [
                "同回合上限",
                "橫置支付0[null]",
                "交戰中的敵軍機體1張",
                "同區中有NT才能使用"
            ],
            "logicID": 0,
            "logicSubID": 0,
            "tipOrErrors": [
                {
                    "effectId": "createPlayEffects_PlayerB_PlayerB_87_loadPrototype_179030_11E_U_GN184N_green_text_2",
                    "conditionKey": "同回合上限",
                    "tip": null,
                    "errors": [
                        "同回合上限: 交戰中的敵軍機體1張x傷害. 這個效果只有在同區中有NT才能使用."
                    ]
                },
                {
                    "effectId": "createPlayEffects_PlayerB_PlayerB_87_loadPrototype_179030_11E_U_GN184N_green_text_2",
                    "conditionKey": "橫置支付0[null]",
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
                                            "Gゾーン"
                                        ]
                                    }
                                ],
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
                            ],
                            [
                                [
                                    "PlayerB_65",
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
                    "effectId": "createPlayEffects_PlayerB_PlayerB_87_loadPrototype_179030_11E_U_GN184N_green_text_2",
                    "conditionKey": "交戰中的敵軍機體1張",
                    "tip": {
                        "title": [
                            "カード",
                            [
                                [
                                    "PlayerA_39",
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
                                    "PlayerA_39",
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
                        "count": 1
                    },
                    "errors": []
                },
                {
                    "effectId": "createPlayEffects_PlayerB_PlayerB_87_loadPrototype_179030_11E_U_GN184N_green_text_2",
                    "conditionKey": "同區中有NT才能使用",
                    "tip": null,
                    "errors": []
                }
            ]
        }
    ],
    "isBattle": {
        "[\"PlayerA\",\"戦闘エリア1\"]": false,
        "[\"PlayerB\",\"戦闘エリア1\"]": false,
        "[\"PlayerA\",\"戦闘エリア2\"]": true,
        "[\"PlayerB\",\"戦闘エリア2\"]": true
    },
    "coins": {},
    "coinId2cardId": {},
    "globalEffectPool": {
        "null": [
            {
                "title": [
                    "發生國力",
                    [
                        "茶"
                    ]
                ],
                "cardIds": [
                    "PlayerA_22"
                ]
            },
            {
                "title": [
                    "發生國力",
                    [
                        "茶"
                    ]
                ],
                "cardIds": [
                    "PlayerA_28"
                ]
            },
            {
                "title": [
                    "發生國力",
                    [
                        "茶"
                    ]
                ],
                "cardIds": [
                    "PlayerA_13"
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
                    "PlayerB_65"
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
                    "PlayerB_57"
                ]
            }
        ]
    },
    "messageTopId": 1074,
    "messages": [
        {
            "id": 1073,
            "description": "onEffectEnd: 交戰中的敵軍機體1張x傷害. 這個效果只有在同區中有NT才能使用."
        },
        {
            "id": 1072,
            "description": "PlayerB_63.isRoll false => true",
            "effect": {
                "id": "createPlayEffects_PlayerB_PlayerB_87_loadPrototype_179030_11E_U_GN184N_green_text_2",
                "reason": [
                    "PlayText",
                    "PlayerB",
                    "PlayerB_87",
                    "loadPrototype_179030_11E_U_GN184N_green_text_2"
                ],
                "description": "交戰中的敵軍機體1張x傷害. 這個效果只有在同區中有NT才能使用.",
                "text": {
                    "id": "loadPrototype_179030_11E_U_GN184N_green_text_2",
                    "title": [
                        "使用型",
                        [
                            "防御ステップ"
                        ]
                    ],
                    "description": "交戰中的敵軍機體1張x傷害. 這個效果只有在同區中有NT才能使用.",
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
                        "交戰中的敵軍機體1張": {
                            "title": "function _(ctx2, effect, { GameStateFn, DefineFn, Options }) {\n                const { addCardIds: addCardIds2 } = {\"addCardIds\":[]};\n                if (addCardIds2 == null)\n                  throw new Error(\"addCardIds must replace\");\n                const cardId = DefineFn.EffectFn.getCardID(effect), tip = GameStateFn.createTipByEntitySearch(ctx2, effect, {\n                  isBattle: !0,\n                  side: \"\\u6575\\u8ECD\",\n                  is: [\"\\u30E6\\u30CB\\u30C3\\u30C8\"],\n                  count: 1\n                }, { ges: Options.ges });\n                let wants = DefineFn.TipFn.getWant(tip);\n                return wants = [...wants, ...addCardIds2.map((itemId) => GameStateFn.createStrBaSyouPair(ctx2, itemId))], {\n                  title: [\"\\u30AB\\u30FC\\u30C9\", wants, wants.slice(0, 1)],\n                  count: 1\n                };\n              }"
                        },
                        "同區中有NT才能使用": {
                            "actions": [
                                {
                                    "title": "function _(ctx2, effect, { GameStateFn, DefineFn }) {\n                    const cardId = DefineFn.EffectFn.getCardID(effect), from = GameStateFn.getItemBaSyou(ctx2, cardId);\n                    if (GameStateFn.getItemIdsByBasyou(ctx2, from).filter((itemId) => GameStateFn.getItemCharacteristic(ctx2, itemId).indexOf(\"NT\")).length > 0 == !1)\n                      throw new TipError(\"no NT in the same area\");\n                    return ctx2;\n                  }"
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
                                        "value": "交戰中的敵軍機體1張"
                                    },
                                    {
                                        "type": "Leaf",
                                        "value": "同區中有NT才能使用"
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
                                                    "_１ダメージを与える",
                                                    2
                                                ],
                                                "vars": [
                                                    "交戰中的敵軍機體1張"
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
            "id": 1071,
            "description": "onEffectStart: 交戰中的敵軍機體1張x傷害. 這個效果只有在同區中有NT才能使用.",
            "effect": {
                "id": "createPlayEffects_PlayerB_PlayerB_87_loadPrototype_179030_11E_U_GN184N_green_text_2",
                "reason": [
                    "PlayText",
                    "PlayerB",
                    "PlayerB_87",
                    "loadPrototype_179030_11E_U_GN184N_green_text_2"
                ],
                "description": "交戰中的敵軍機體1張x傷害. 這個效果只有在同區中有NT才能使用.",
                "text": {
                    "id": "loadPrototype_179030_11E_U_GN184N_green_text_2",
                    "title": [
                        "使用型",
                        [
                            "防御ステップ"
                        ]
                    ],
                    "description": "交戰中的敵軍機體1張x傷害. 這個效果只有在同區中有NT才能使用.",
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
                        "交戰中的敵軍機體1張": {
                            "title": "function _(ctx2, effect, { GameStateFn, DefineFn, Options }) {\n                const { addCardIds: addCardIds2 } = {\"addCardIds\":[]};\n                if (addCardIds2 == null)\n                  throw new Error(\"addCardIds must replace\");\n                const cardId = DefineFn.EffectFn.getCardID(effect), tip = GameStateFn.createTipByEntitySearch(ctx2, effect, {\n                  isBattle: !0,\n                  side: \"\\u6575\\u8ECD\",\n                  is: [\"\\u30E6\\u30CB\\u30C3\\u30C8\"],\n                  count: 1\n                }, { ges: Options.ges });\n                let wants = DefineFn.TipFn.getWant(tip);\n                return wants = [...wants, ...addCardIds2.map((itemId) => GameStateFn.createStrBaSyouPair(ctx2, itemId))], {\n                  title: [\"\\u30AB\\u30FC\\u30C9\", wants, wants.slice(0, 1)],\n                  count: 1\n                };\n              }"
                        },
                        "同區中有NT才能使用": {
                            "actions": [
                                {
                                    "title": "function _(ctx2, effect, { GameStateFn, DefineFn }) {\n                    const cardId = DefineFn.EffectFn.getCardID(effect), from = GameStateFn.getItemBaSyou(ctx2, cardId);\n                    if (GameStateFn.getItemIdsByBasyou(ctx2, from).filter((itemId) => GameStateFn.getItemCharacteristic(ctx2, itemId).indexOf(\"NT\")).length > 0 == !1)\n                      throw new TipError(\"no NT in the same area\");\n                    return ctx2;\n                  }"
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
                                        "value": "交戰中的敵軍機體1張"
                                    },
                                    {
                                        "type": "Leaf",
                                        "value": "同區中有NT才能使用"
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
                                                    "_１ダメージを与える",
                                                    2
                                                ],
                                                "vars": [
                                                    "交戰中的敵軍機體1張"
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
            "id": 1070,
            "description": "onSetPhase:戦闘フェイズ,防御ステップ,フリータイミング2"
        },
        {
            "id": 1069,
            "description": "onEffectEnd: 出擊"
        },
        {
            "id": 1068,
            "description": "onItemMove:PlayerA_39 = [\"PlayerA\",\"配備エリア\"] => [\"PlayerA\",\"戦闘エリア2\"]",
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
            "id": 1067,
            "description": "onEvent: GameEventOnMove [\"PlayerA_39\"]",
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
            "id": 1066,
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
            "id": 1065,
            "description": "onSetPhase:戦闘フェイズ,防御ステップ,規定の効果"
        },
        {
            "id": 1064,
            "description": "onSetPhase:戦闘フェイズ,防御ステップ,フリータイミング"
        },
        {
            "id": 1063,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 1062,
            "description": "onSetPhase:戦闘フェイズ,防御ステップ,ステップ開始"
        },
        {
            "id": 1061,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 1060,
            "description": "onSetPhase:戦闘フェイズ,攻撃ステップ,ステップ終了"
        },
        {
            "id": 1059,
            "description": "onSetPhase:戦闘フェイズ,攻撃ステップ,フリータイミング2"
        },
        {
            "id": 1058,
            "description": "onEffectEnd: 出擊"
        },
        {
            "id": 1057,
            "description": "onEvent: このカードが攻撃に出撃した場合 [\"PlayerB_87\",\"PlayerB_53\"]",
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
            "id": 1056,
            "description": "onItemMove:PlayerB_53 = [\"PlayerB\",\"配備エリア\"] => [\"PlayerB\",\"戦闘エリア2\"]",
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
            "id": 1055,
            "description": "onEvent: GameEventOnMove [\"PlayerB_53\"]",
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
            "id": 1054,
            "description": "onItemMove:PlayerB_87 = [\"PlayerB\",\"配備エリア\"] => [\"PlayerB\",\"戦闘エリア1\"]",
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
            "id": 1053,
            "description": "onEvent: GameEventOnMove [\"PlayerB_87\"]",
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
            "id": 1052,
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
            "id": 1051,
            "description": "onSetPhase:戦闘フェイズ,攻撃ステップ,規定の効果"
        },
        {
            "id": 1050,
            "description": "onSetPhase:戦闘フェイズ,攻撃ステップ,フリータイミング"
        },
        {
            "id": 1049,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 1048,
            "description": "onSetPhase:戦闘フェイズ,攻撃ステップ,ステップ開始"
        },
        {
            "id": 1047,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 1046,
            "description": "onSetPhase:配備フェイズ,フェイズ終了"
        },
        {
            "id": 1045,
            "description": "onEvent: カット終了時 undefined"
        },
        {
            "id": 1044,
            "description": "onEffectEnd: 緑のGサインを持つ自軍Gが４枚以上ある状態で、このカードが場に出た場合"
        },
        {
            "id": 1043,
            "description": "onEffectStart: 緑のGサインを持つ自軍Gが４枚以上ある状態で、このカードが場に出た場合",
            "effect": {
                "id": "addImmediateEffect_01929626-485c-7002-8055-2a64472b14f6",
                "reason": [
                    "PlayText",
                    "PlayerB",
                    "PlayerB_87",
                    "loadPrototype_179030_11E_U_GN184N_green_text_0"
                ],
                "description": "緑のGサインを持つ自軍Gが４枚以上ある状態で、このカードが場に出た場合",
                "text": {
                    "id": "loadPrototype_179030_11E_U_GN184N_green_text_0",
                    "title": [
                        "自動型",
                        "起動"
                    ],
                    "description": "緑のGサインを持つ自軍Gが４枚以上ある状態で、このカードが場に出た場合",
                    "conditions": {
                        "緑のGサインを持つ自軍Gが４枚以上ある状態": {
                            "actions": [
                                {
                                    "title": [
                                        "Entity",
                                        {
                                            "at": [
                                                "Gゾーン"
                                            ],
                                            "side": "自軍",
                                            "min": 4
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
                                    "title": "function _(ctx, effect, { DefineFn, GameStateFn, Options }) {\n                                        const cardId = DefineFn.EffectFn.getCardID(effect);\n                                        ctx = GameStateFn.mapItemState(ctx, cardId, is => DefineFn.ItemStateFn.setFlag(is, \"enabled\", true, { isRemoveOnTurnEnd: true }));\n                                        return ctx;\n                                    }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 1042,
            "description": "onEffectEnd: Play ヤクト・ドーガ（クェス機）"
        },
        {
            "id": 1041,
            "description": "onEvent: プレイされて場に出た場合 [\"PlayerB_87\"]",
            "effect": {
                "id": "createUnitGoStageEffectFromPlayEffect_PlayerB_87",
                "reason": [
                    "場に出る",
                    "PlayerB",
                    "PlayerB_87"
                ],
                "description": "Play ヤクト・ドーガ（クェス機）",
                "text": {
                    "id": "createPlayUnitEffect_PlayerB_87",
                    "description": "Play ヤクト・ドーガ（クェス機）",
                    "title": [],
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect2, { DefineFn, GameStateFn }) {\n                  const ges = GameStateFn.getGlobalEffects(ctx3, null), cardId2 = DefineFn.EffectFn.getCardID(effect2), from = GameStateFn.getItemBaSyou(ctx3, cardId2), to = DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\");\n                  ctx3 = GameStateFn.doItemMove(ctx3, to, [cardId2, from]);\n                  const hasHigh = GameStateFn.getCardHasSpeicalEffect(ctx3, [\"\\u6226\\u95D8\\u914D\\u5099\"], cardId2, { ges }), hasPS = GameStateFn.getCardHasSpeicalEffect(ctx3, [\"\\u3010PS\\u88C5\\u7532\\u3011\"], cardId2, { ges }), isRoll = (hasHigh || hasPS) == !1;\n                  return ctx3 = GameStateFn.doItemSetRollState(ctx3, isRoll, [cardId2, GameStateFn.getItemBaSyou(ctx3, cardId2)], { isSkipTargetMissing: !0 }), ctx3 = GameStateFn.doTriggerEvent(ctx3, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId2] }), ctx3;\n                }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 1040,
            "description": "onItemMove:PlayerB_87 = [\"PlayerB\",\"プレイされているカード\"] => [\"PlayerB\",\"配備エリア\"]",
            "effect": {
                "id": "createUnitGoStageEffectFromPlayEffect_PlayerB_87",
                "reason": [
                    "場に出る",
                    "PlayerB",
                    "PlayerB_87"
                ],
                "description": "Play ヤクト・ドーガ（クェス機）",
                "text": {
                    "id": "createPlayUnitEffect_PlayerB_87",
                    "description": "Play ヤクト・ドーガ（クェス機）",
                    "title": [],
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect2, { DefineFn, GameStateFn }) {\n                  const ges = GameStateFn.getGlobalEffects(ctx3, null), cardId2 = DefineFn.EffectFn.getCardID(effect2), from = GameStateFn.getItemBaSyou(ctx3, cardId2), to = DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\");\n                  ctx3 = GameStateFn.doItemMove(ctx3, to, [cardId2, from]);\n                  const hasHigh = GameStateFn.getCardHasSpeicalEffect(ctx3, [\"\\u6226\\u95D8\\u914D\\u5099\"], cardId2, { ges }), hasPS = GameStateFn.getCardHasSpeicalEffect(ctx3, [\"\\u3010PS\\u88C5\\u7532\\u3011\"], cardId2, { ges }), isRoll = (hasHigh || hasPS) == !1;\n                  return ctx3 = GameStateFn.doItemSetRollState(ctx3, isRoll, [cardId2, GameStateFn.getItemBaSyou(ctx3, cardId2)], { isSkipTargetMissing: !0 }), ctx3 = GameStateFn.doTriggerEvent(ctx3, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId2] }), ctx3;\n                }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 1039,
            "description": "onEvent: GameEventOnMove [\"PlayerB_87\"]",
            "effect": {
                "id": "createUnitGoStageEffectFromPlayEffect_PlayerB_87",
                "reason": [
                    "場に出る",
                    "PlayerB",
                    "PlayerB_87"
                ],
                "description": "Play ヤクト・ドーガ（クェス機）",
                "text": {
                    "id": "createPlayUnitEffect_PlayerB_87",
                    "description": "Play ヤクト・ドーガ（クェス機）",
                    "title": [],
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect2, { DefineFn, GameStateFn }) {\n                  const ges = GameStateFn.getGlobalEffects(ctx3, null), cardId2 = DefineFn.EffectFn.getCardID(effect2), from = GameStateFn.getItemBaSyou(ctx3, cardId2), to = DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\");\n                  ctx3 = GameStateFn.doItemMove(ctx3, to, [cardId2, from]);\n                  const hasHigh = GameStateFn.getCardHasSpeicalEffect(ctx3, [\"\\u6226\\u95D8\\u914D\\u5099\"], cardId2, { ges }), hasPS = GameStateFn.getCardHasSpeicalEffect(ctx3, [\"\\u3010PS\\u88C5\\u7532\\u3011\"], cardId2, { ges }), isRoll = (hasHigh || hasPS) == !1;\n                  return ctx3 = GameStateFn.doItemSetRollState(ctx3, isRoll, [cardId2, GameStateFn.getItemBaSyou(ctx3, cardId2)], { isSkipTargetMissing: !0 }), ctx3 = GameStateFn.doTriggerEvent(ctx3, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId2] }), ctx3;\n                }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 1038,
            "description": "onEvent: このカードが場に出た場合 [\"PlayerB_87\"]",
            "effect": {
                "id": "createUnitGoStageEffectFromPlayEffect_PlayerB_87",
                "reason": [
                    "場に出る",
                    "PlayerB",
                    "PlayerB_87"
                ],
                "description": "Play ヤクト・ドーガ（クェス機）",
                "text": {
                    "id": "createPlayUnitEffect_PlayerB_87",
                    "description": "Play ヤクト・ドーガ（クェス機）",
                    "title": [],
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect2, { DefineFn, GameStateFn }) {\n                  const ges = GameStateFn.getGlobalEffects(ctx3, null), cardId2 = DefineFn.EffectFn.getCardID(effect2), from = GameStateFn.getItemBaSyou(ctx3, cardId2), to = DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\");\n                  ctx3 = GameStateFn.doItemMove(ctx3, to, [cardId2, from]);\n                  const hasHigh = GameStateFn.getCardHasSpeicalEffect(ctx3, [\"\\u6226\\u95D8\\u914D\\u5099\"], cardId2, { ges }), hasPS = GameStateFn.getCardHasSpeicalEffect(ctx3, [\"\\u3010PS\\u88C5\\u7532\\u3011\"], cardId2, { ges }), isRoll = (hasHigh || hasPS) == !1;\n                  return ctx3 = GameStateFn.doItemSetRollState(ctx3, isRoll, [cardId2, GameStateFn.getItemBaSyou(ctx3, cardId2)], { isSkipTargetMissing: !0 }), ctx3 = GameStateFn.doTriggerEvent(ctx3, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId2] }), ctx3;\n                }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 1037,
            "description": "onEffectStart: Play ヤクト・ドーガ（クェス機）",
            "effect": {
                "id": "createUnitGoStageEffectFromPlayEffect_PlayerB_87",
                "reason": [
                    "場に出る",
                    "PlayerB",
                    "PlayerB_87"
                ],
                "description": "Play ヤクト・ドーガ（クェス機）",
                "text": {
                    "id": "createPlayUnitEffect_PlayerB_87",
                    "description": "Play ヤクト・ドーガ（クェス機）",
                    "title": [],
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect2, { DefineFn, GameStateFn }) {\n                  const ges = GameStateFn.getGlobalEffects(ctx3, null), cardId2 = DefineFn.EffectFn.getCardID(effect2), from = GameStateFn.getItemBaSyou(ctx3, cardId2), to = DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\");\n                  ctx3 = GameStateFn.doItemMove(ctx3, to, [cardId2, from]);\n                  const hasHigh = GameStateFn.getCardHasSpeicalEffect(ctx3, [\"\\u6226\\u95D8\\u914D\\u5099\"], cardId2, { ges }), hasPS = GameStateFn.getCardHasSpeicalEffect(ctx3, [\"\\u3010PS\\u88C5\\u7532\\u3011\"], cardId2, { ges }), isRoll = (hasHigh || hasPS) == !1;\n                  return ctx3 = GameStateFn.doItemSetRollState(ctx3, isRoll, [cardId2, GameStateFn.getItemBaSyou(ctx3, cardId2)], { isSkipTargetMissing: !0 }), ctx3 = GameStateFn.doTriggerEvent(ctx3, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId2] }), ctx3;\n                }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 1036,
            "description": "onEffectEnd: Play ヤクト・ドーガ（クェス機）"
        },
        {
            "id": 1035,
            "description": "onItemMove:PlayerB_87 = [\"PlayerB\",\"手札\"] => [\"PlayerB\",\"プレイされているカード\"]",
            "effect": {
                "id": "createPlayUnitEffect_PlayerB_87",
                "reason": [
                    "PlayCard",
                    "PlayerB",
                    "PlayerB_87",
                    {
                        "isPlayUnit": true
                    }
                ],
                "description": "Play ヤクト・ドーガ（クェス機）",
                "text": {
                    "id": "createPlayUnitEffect_PlayerB_87",
                    "title": [
                        "使用型",
                        [
                            "自軍",
                            "配備フェイズ"
                        ]
                    ],
                    "description": "Play ヤクト・ドーガ（クェス機）",
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
                        "橫置支付1[緑]": {
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
                                        "橫置支付1[緑]"
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
                                    "title": "function _(ctx3, effect, { DefineFn, GameStateFn, ToolFn: ToolFn2 }) {\n              let ges = GameStateFn.getGlobalEffects(ctx3, null);\n              ctx3 = GameStateFn.setGlobalEffects(ctx3, null, ges);\n              const cardId2 = DefineFn.EffectFn.getCardID(effect), from = GameStateFn.getItemBaSyou(ctx3, cardId2);\n              ctx3 = GameStateFn.doItemMove(ctx3, DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u3044\\u308B\\u30AB\\u30FC\\u30C9\"), [cardId2, from]);\n              const newE = GameStateFn.createUnitGoStageEffectFromPlayEffect(ctx3, effect, { ges });\n              return GameStateFn.addStackEffect(ctx3, newE);\n            }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 1034,
            "description": "onEvent: GameEventOnMove [\"PlayerB_87\"]",
            "effect": {
                "id": "createPlayUnitEffect_PlayerB_87",
                "reason": [
                    "PlayCard",
                    "PlayerB",
                    "PlayerB_87",
                    {
                        "isPlayUnit": true
                    }
                ],
                "description": "Play ヤクト・ドーガ（クェス機）",
                "text": {
                    "id": "createPlayUnitEffect_PlayerB_87",
                    "title": [
                        "使用型",
                        [
                            "自軍",
                            "配備フェイズ"
                        ]
                    ],
                    "description": "Play ヤクト・ドーガ（クェス機）",
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
                        "橫置支付1[緑]": {
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
                                        "橫置支付1[緑]"
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
                                    "title": "function _(ctx3, effect, { DefineFn, GameStateFn, ToolFn: ToolFn2 }) {\n              let ges = GameStateFn.getGlobalEffects(ctx3, null);\n              ctx3 = GameStateFn.setGlobalEffects(ctx3, null, ges);\n              const cardId2 = DefineFn.EffectFn.getCardID(effect), from = GameStateFn.getItemBaSyou(ctx3, cardId2);\n              ctx3 = GameStateFn.doItemMove(ctx3, DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u3044\\u308B\\u30AB\\u30FC\\u30C9\"), [cardId2, from]);\n              const newE = GameStateFn.createUnitGoStageEffectFromPlayEffect(ctx3, effect, { ges });\n              return GameStateFn.addStackEffect(ctx3, newE);\n            }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 1033,
            "description": "PlayerB_87.isFaceDown true => false",
            "effect": {
                "id": "createPlayUnitEffect_PlayerB_87",
                "reason": [
                    "PlayCard",
                    "PlayerB",
                    "PlayerB_87",
                    {
                        "isPlayUnit": true
                    }
                ],
                "description": "Play ヤクト・ドーガ（クェス機）",
                "text": {
                    "id": "createPlayUnitEffect_PlayerB_87",
                    "title": [
                        "使用型",
                        [
                            "自軍",
                            "配備フェイズ"
                        ]
                    ],
                    "description": "Play ヤクト・ドーガ（クェス機）",
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
                        "橫置支付1[緑]": {
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
                                        "橫置支付1[緑]"
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
                                    "title": "function _(ctx3, effect, { DefineFn, GameStateFn, ToolFn: ToolFn2 }) {\n              let ges = GameStateFn.getGlobalEffects(ctx3, null);\n              ctx3 = GameStateFn.setGlobalEffects(ctx3, null, ges);\n              const cardId2 = DefineFn.EffectFn.getCardID(effect), from = GameStateFn.getItemBaSyou(ctx3, cardId2);\n              ctx3 = GameStateFn.doItemMove(ctx3, DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u3044\\u308B\\u30AB\\u30FC\\u30C9\"), [cardId2, from]);\n              const newE = GameStateFn.createUnitGoStageEffectFromPlayEffect(ctx3, effect, { ges });\n              return GameStateFn.addStackEffect(ctx3, newE);\n            }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 1032,
            "description": "onEvent: プレイした場合 [\"PlayerB_87\"]",
            "effect": {
                "id": "createPlayUnitEffect_PlayerB_87",
                "reason": [
                    "PlayCard",
                    "PlayerB",
                    "PlayerB_87",
                    {
                        "isPlayUnit": true
                    }
                ],
                "description": "Play ヤクト・ドーガ（クェス機）",
                "text": {
                    "id": "createPlayUnitEffect_PlayerB_87",
                    "title": [
                        "使用型",
                        [
                            "自軍",
                            "配備フェイズ"
                        ]
                    ],
                    "description": "Play ヤクト・ドーガ（クェス機）",
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
                        "橫置支付1[緑]": {
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
                                        "橫置支付1[緑]"
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
                                    "title": "function _(ctx3, effect, { DefineFn, GameStateFn, ToolFn: ToolFn2 }) {\n              let ges = GameStateFn.getGlobalEffects(ctx3, null);\n              ctx3 = GameStateFn.setGlobalEffects(ctx3, null, ges);\n              const cardId2 = DefineFn.EffectFn.getCardID(effect), from = GameStateFn.getItemBaSyou(ctx3, cardId2);\n              ctx3 = GameStateFn.doItemMove(ctx3, DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u3044\\u308B\\u30AB\\u30FC\\u30C9\"), [cardId2, from]);\n              const newE = GameStateFn.createUnitGoStageEffectFromPlayEffect(ctx3, effect, { ges });\n              return GameStateFn.addStackEffect(ctx3, newE);\n            }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 1031,
            "description": "PlayerB_56.isRoll false => true",
            "effect": {
                "id": "createPlayUnitEffect_PlayerB_87",
                "reason": [
                    "PlayCard",
                    "PlayerB",
                    "PlayerB_87",
                    {
                        "isPlayUnit": true
                    }
                ],
                "description": "Play ヤクト・ドーガ（クェス機）",
                "text": {
                    "id": "createPlayUnitEffect_PlayerB_87",
                    "title": [
                        "使用型",
                        [
                            "自軍",
                            "配備フェイズ"
                        ]
                    ],
                    "description": "Play ヤクト・ドーガ（クェス機）",
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
                        "橫置支付1[緑]": {
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
                                        "橫置支付1[緑]"
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
                                    "title": "function _(ctx3, effect, { DefineFn, GameStateFn, ToolFn: ToolFn2 }) {\n              let ges = GameStateFn.getGlobalEffects(ctx3, null);\n              ctx3 = GameStateFn.setGlobalEffects(ctx3, null, ges);\n              const cardId2 = DefineFn.EffectFn.getCardID(effect), from = GameStateFn.getItemBaSyou(ctx3, cardId2);\n              ctx3 = GameStateFn.doItemMove(ctx3, DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u3044\\u308B\\u30AB\\u30FC\\u30C9\"), [cardId2, from]);\n              const newE = GameStateFn.createUnitGoStageEffectFromPlayEffect(ctx3, effect, { ges });\n              return GameStateFn.addStackEffect(ctx3, newE);\n            }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 1030,
            "description": "PlayerB_70.isRoll false => true",
            "effect": {
                "id": "createPlayUnitEffect_PlayerB_87",
                "reason": [
                    "PlayCard",
                    "PlayerB",
                    "PlayerB_87",
                    {
                        "isPlayUnit": true
                    }
                ],
                "description": "Play ヤクト・ドーガ（クェス機）",
                "text": {
                    "id": "createPlayUnitEffect_PlayerB_87",
                    "title": [
                        "使用型",
                        [
                            "自軍",
                            "配備フェイズ"
                        ]
                    ],
                    "description": "Play ヤクト・ドーガ（クェス機）",
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
                        "橫置支付1[緑]": {
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
                                        "橫置支付1[緑]"
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
                                    "title": "function _(ctx3, effect, { DefineFn, GameStateFn, ToolFn: ToolFn2 }) {\n              let ges = GameStateFn.getGlobalEffects(ctx3, null);\n              ctx3 = GameStateFn.setGlobalEffects(ctx3, null, ges);\n              const cardId2 = DefineFn.EffectFn.getCardID(effect), from = GameStateFn.getItemBaSyou(ctx3, cardId2);\n              ctx3 = GameStateFn.doItemMove(ctx3, DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u3044\\u308B\\u30AB\\u30FC\\u30C9\"), [cardId2, from]);\n              const newE = GameStateFn.createUnitGoStageEffectFromPlayEffect(ctx3, effect, { ges });\n              return GameStateFn.addStackEffect(ctx3, newE);\n            }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 1029,
            "description": "onEffectStart: Play ヤクト・ドーガ（クェス機）",
            "effect": {
                "id": "createPlayUnitEffect_PlayerB_87",
                "reason": [
                    "PlayCard",
                    "PlayerB",
                    "PlayerB_87",
                    {
                        "isPlayUnit": true
                    }
                ],
                "description": "Play ヤクト・ドーガ（クェス機）",
                "text": {
                    "id": "createPlayUnitEffect_PlayerB_87",
                    "title": [
                        "使用型",
                        [
                            "自軍",
                            "配備フェイズ"
                        ]
                    ],
                    "description": "Play ヤクト・ドーガ（クェス機）",
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
                        "橫置支付1[緑]": {
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
                                        "橫置支付1[緑]"
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
                                    "title": "function _(ctx3, effect, { DefineFn, GameStateFn, ToolFn: ToolFn2 }) {\n              let ges = GameStateFn.getGlobalEffects(ctx3, null);\n              ctx3 = GameStateFn.setGlobalEffects(ctx3, null, ges);\n              const cardId2 = DefineFn.EffectFn.getCardID(effect), from = GameStateFn.getItemBaSyou(ctx3, cardId2);\n              ctx3 = GameStateFn.doItemMove(ctx3, DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u3044\\u308B\\u30AB\\u30FC\\u30C9\"), [cardId2, from]);\n              const newE = GameStateFn.createUnitGoStageEffectFromPlayEffect(ctx3, effect, { ges });\n              return GameStateFn.addStackEffect(ctx3, newE);\n            }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 1028,
            "description": "onEffectEnd: PlayG"
        },
        {
            "id": 1027,
            "description": "onEvent: このカードがGとして場に出た場合 [\"PlayerB_57\"]",
            "effect": {
                "id": "createPlayGEffect_PlayerB_57",
                "reason": [
                    "PlayCard",
                    "PlayerB",
                    "PlayerB_57",
                    {
                        "isPlayG": true
                    }
                ],
                "description": "Play G",
                "text": {
                    "id": "createPlayGEffect_PlayerB_57",
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
            "id": 1026,
            "description": "onEvent: プレイされて場に出た場合 [\"PlayerB_57\"]",
            "effect": {
                "id": "createPlayGEffect_PlayerB_57",
                "reason": [
                    "PlayCard",
                    "PlayerB",
                    "PlayerB_57",
                    {
                        "isPlayG": true
                    }
                ],
                "description": "Play G",
                "text": {
                    "id": "createPlayGEffect_PlayerB_57",
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
            "id": 1025,
            "description": "onItemMove:PlayerB_57 = [\"PlayerB\",\"手札\"] => [\"PlayerB\",\"Gゾーン\"]",
            "effect": {
                "id": "createPlayGEffect_PlayerB_57",
                "reason": [
                    "PlayCard",
                    "PlayerB",
                    "PlayerB_57",
                    {
                        "isPlayG": true
                    }
                ],
                "description": "Play G",
                "text": {
                    "id": "createPlayGEffect_PlayerB_57",
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
            "id": 1024,
            "description": "onEvent: GameEventOnMove [\"PlayerB_57\"]",
            "effect": {
                "id": "createPlayGEffect_PlayerB_57",
                "reason": [
                    "PlayCard",
                    "PlayerB",
                    "PlayerB_57",
                    {
                        "isPlayG": true
                    }
                ],
                "description": "Play G",
                "text": {
                    "id": "createPlayGEffect_PlayerB_57",
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
            "id": 1023,
            "description": "PlayerB_57.isFaceDown true => false",
            "effect": {
                "id": "createPlayGEffect_PlayerB_57",
                "reason": [
                    "PlayCard",
                    "PlayerB",
                    "PlayerB_57",
                    {
                        "isPlayG": true
                    }
                ],
                "description": "Play G",
                "text": {
                    "id": "createPlayGEffect_PlayerB_57",
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
            "id": 1022,
            "description": "onPlayerStateChange:PlayerB",
            "effect": {
                "id": "createPlayGEffect_PlayerB_57",
                "reason": [
                    "PlayCard",
                    "PlayerB",
                    "PlayerB_57",
                    {
                        "isPlayG": true
                    }
                ],
                "description": "Play G",
                "text": {
                    "id": "createPlayGEffect_PlayerB_57",
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
            "id": 1021,
            "description": "onEffectStart: PlayG",
            "effect": {
                "id": "createPlayGEffect_PlayerB_57",
                "reason": [
                    "PlayCard",
                    "PlayerB",
                    "PlayerB_57",
                    {
                        "isPlayG": true
                    }
                ],
                "description": "Play G",
                "text": {
                    "id": "createPlayGEffect_PlayerB_57",
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
            "id": 1020,
            "description": "onSetPhase:配備フェイズ,フリータイミング"
        },
        {
            "id": 1019,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 1018,
            "description": "onSetPhase:配備フェイズ,フェイズ開始"
        },
        {
            "id": 1017,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 1016,
            "description": "onSetPhase:ドローフェイズ,フェイズ終了"
        },
        {
            "id": 1015,
            "description": "onSetPhase:ドローフェイズ,フリータイミング"
        },
        {
            "id": 1014,
            "description": "onEffectEnd: 抽牌階段規定效果"
        },
        {
            "id": 1013,
            "description": "onItemMove:PlayerB_87 = [\"PlayerB\",\"本国\"] => [\"PlayerB\",\"手札\"]",
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
            "id": 1012,
            "description": "onEvent: GameEventOnMove [\"PlayerB_87\"]",
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
            "id": 1011,
            "description": "PlayerB_87.isRoll undefined => false",
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
            "id": 1010,
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
            "id": 1009,
            "description": "onSetPhase:ドローフェイズ,規定の効果"
        },
        {
            "id": 1008,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 1007,
            "description": "onSetPhase:ドローフェイズ,フェイズ開始"
        },
        {
            "id": 1006,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 1005,
            "description": "onSetPhase:リロールフェイズ,フェイズ終了"
        },
        {
            "id": 1004,
            "description": "onSetPhase:リロールフェイズ,フリータイミング"
        },
        {
            "id": 1003,
            "description": "onEffectEnd: getRerollPhaseRuleEffect"
        },
        {
            "id": 1002,
            "description": "PlayerB_65.isRoll undefined => false",
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
            "id": 1001,
            "description": "PlayerB_56.isRoll true => false",
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
            "id": 1000,
            "description": "PlayerB_70.isRoll true => false",
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
            "id": 999,
            "description": "PlayerB_53.isRoll true => false",
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
            "id": 998,
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
            "id": 997,
            "description": "onSetPhase:リロールフェイズ,規定の効果"
        },
        {
            "id": 996,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 995,
            "description": "onSetPhase:リロールフェイズ,フェイズ開始"
        },
        {
            "id": 994,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 993,
            "description": "onPlayerStateChange:PlayerA"
        },
        {
            "id": 992,
            "description": "onSetPhase:戦闘フェイズ,ターン終了時,効果終了。ターン終了"
        },
        {
            "id": 991,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 990,
            "description": "將發動起動效果但條件不足: : 調整手牌為7張以下"
        },
        {
            "id": 989,
            "description": "將發動起動效果但條件不足: : 調整手牌為7張以下"
        },
        {
            "id": 988,
            "description": "onSetPhase:戦闘フェイズ,ターン終了時,手札調整"
        },
        {
            "id": 987,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 986,
            "description": "onSetPhase:戦闘フェイズ,ターン終了時,効果解決"
        },
        {
            "id": 985,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 984,
            "description": "onSetPhase:戦闘フェイズ,ターン終了時,ダメージリセット"
        },
        {
            "id": 983,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 982,
            "description": "onSetPhase:戦闘フェイズ,帰還ステップ,ステップ終了"
        },
        {
            "id": 981,
            "description": "onSetPhase:戦闘フェイズ,帰還ステップ,フリータイミング2"
        },
        {
            "id": 980,
            "description": "onEffectEnd: getReturnRuleEffect"
        },
        {
            "id": 979,
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
            "id": 978,
            "description": "onSetPhase:戦闘フェイズ,帰還ステップ,規定の効果"
        },
        {
            "id": 977,
            "description": "onSetPhase:戦闘フェイズ,帰還ステップ,フリータイミング"
        },
        {
            "id": 976,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 975,
            "description": "onSetPhase:戦闘フェイズ,帰還ステップ,ステップ開始"
        },
        {
            "id": 974,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 973,
            "description": "onSetPhase:戦闘フェイズ,ダメージ判定ステップ,ステップ終了"
        },
        {
            "id": 972,
            "description": "onSetPhase:戦闘フェイズ,ダメージ判定ステップ,フリータイミング2"
        },
        {
            "id": 971,
            "description": "onEffectEnd: getDamageRuleEffect"
        },
        {
            "id": 970,
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
            "id": 969,
            "description": "onSetPhase:戦闘フェイズ,ダメージ判定ステップ,規定の効果"
        },
        {
            "id": 968,
            "description": "onSetPhase:戦闘フェイズ,ダメージ判定ステップ,フリータイミング"
        },
        {
            "id": 967,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 966,
            "description": "onSetPhase:戦闘フェイズ,ダメージ判定ステップ,ステップ開始"
        },
        {
            "id": 965,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 964,
            "description": "onSetPhase:戦闘フェイズ,防御ステップ,ステップ終了"
        },
        {
            "id": 963,
            "description": "onSetPhase:戦闘フェイズ,防御ステップ,フリータイミング2"
        },
        {
            "id": 962,
            "description": "onEffectEnd: 出擊"
        },
        {
            "id": 961,
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
            "id": 960,
            "description": "onSetPhase:戦闘フェイズ,防御ステップ,規定の効果"
        },
        {
            "id": 959,
            "description": "onSetPhase:戦闘フェイズ,防御ステップ,フリータイミング"
        },
        {
            "id": 958,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 957,
            "description": "onSetPhase:戦闘フェイズ,防御ステップ,ステップ開始"
        },
        {
            "id": 956,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 955,
            "description": "onSetPhase:戦闘フェイズ,攻撃ステップ,ステップ終了"
        },
        {
            "id": 954,
            "description": "onSetPhase:戦闘フェイズ,攻撃ステップ,フリータイミング2"
        },
        {
            "id": 953,
            "description": "onSetPhase:戦闘フェイズ,攻撃ステップ,規定の効果"
        },
        {
            "id": 952,
            "description": "onSetPhase:戦闘フェイズ,攻撃ステップ,フリータイミング"
        },
        {
            "id": 951,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 950,
            "description": "onSetPhase:戦闘フェイズ,攻撃ステップ,ステップ開始"
        },
        {
            "id": 949,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 948,
            "description": "onSetPhase:配備フェイズ,フェイズ終了"
        },
        {
            "id": 947,
            "description": "onEvent: カット終了時 undefined"
        },
        {
            "id": 946,
            "description": "onEffectEnd: Play シャイニングガンダム［∞］"
        },
        {
            "id": 945,
            "description": "onEvent: プレイされて場に出た場合 [\"PlayerA_39\"]",
            "effect": {
                "id": "createUnitGoStageEffectFromPlayEffect_PlayerA_39",
                "reason": [
                    "場に出る",
                    "PlayerA",
                    "PlayerA_39"
                ],
                "description": "Play シャイニングガンダム［∞］",
                "text": {
                    "id": "createPlayUnitEffect_PlayerA_39",
                    "description": "Play シャイニングガンダム［∞］",
                    "title": [],
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect2, { DefineFn, GameStateFn }) {\n                  const ges = GameStateFn.getGlobalEffects(ctx3, null), cardId2 = DefineFn.EffectFn.getCardID(effect2), from = GameStateFn.getItemBaSyou(ctx3, cardId2), to = DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\");\n                  ctx3 = GameStateFn.doItemMove(ctx3, to, [cardId2, from]);\n                  const hasHigh = GameStateFn.getCardHasSpeicalEffect(ctx3, [\"\\u6226\\u95D8\\u914D\\u5099\"], cardId2, { ges }), hasPS = GameStateFn.getCardHasSpeicalEffect(ctx3, [\"\\u3010PS\\u88C5\\u7532\\u3011\"], cardId2, { ges }), isRoll = (hasHigh || hasPS) == !1;\n                  return ctx3 = GameStateFn.doItemSetRollState(ctx3, isRoll, [cardId2, GameStateFn.getItemBaSyou(ctx3, cardId2)], { isSkipTargetMissing: !0 }), ctx3 = GameStateFn.doTriggerEvent(ctx3, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId2] }), ctx3;\n                }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 944,
            "description": "onItemMove:PlayerA_39 = [\"PlayerA\",\"プレイされているカード\"] => [\"PlayerA\",\"配備エリア\"]",
            "effect": {
                "id": "createUnitGoStageEffectFromPlayEffect_PlayerA_39",
                "reason": [
                    "場に出る",
                    "PlayerA",
                    "PlayerA_39"
                ],
                "description": "Play シャイニングガンダム［∞］",
                "text": {
                    "id": "createPlayUnitEffect_PlayerA_39",
                    "description": "Play シャイニングガンダム［∞］",
                    "title": [],
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect2, { DefineFn, GameStateFn }) {\n                  const ges = GameStateFn.getGlobalEffects(ctx3, null), cardId2 = DefineFn.EffectFn.getCardID(effect2), from = GameStateFn.getItemBaSyou(ctx3, cardId2), to = DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\");\n                  ctx3 = GameStateFn.doItemMove(ctx3, to, [cardId2, from]);\n                  const hasHigh = GameStateFn.getCardHasSpeicalEffect(ctx3, [\"\\u6226\\u95D8\\u914D\\u5099\"], cardId2, { ges }), hasPS = GameStateFn.getCardHasSpeicalEffect(ctx3, [\"\\u3010PS\\u88C5\\u7532\\u3011\"], cardId2, { ges }), isRoll = (hasHigh || hasPS) == !1;\n                  return ctx3 = GameStateFn.doItemSetRollState(ctx3, isRoll, [cardId2, GameStateFn.getItemBaSyou(ctx3, cardId2)], { isSkipTargetMissing: !0 }), ctx3 = GameStateFn.doTriggerEvent(ctx3, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId2] }), ctx3;\n                }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 943,
            "description": "onEvent: GameEventOnMove [\"PlayerA_39\"]",
            "effect": {
                "id": "createUnitGoStageEffectFromPlayEffect_PlayerA_39",
                "reason": [
                    "場に出る",
                    "PlayerA",
                    "PlayerA_39"
                ],
                "description": "Play シャイニングガンダム［∞］",
                "text": {
                    "id": "createPlayUnitEffect_PlayerA_39",
                    "description": "Play シャイニングガンダム［∞］",
                    "title": [],
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect2, { DefineFn, GameStateFn }) {\n                  const ges = GameStateFn.getGlobalEffects(ctx3, null), cardId2 = DefineFn.EffectFn.getCardID(effect2), from = GameStateFn.getItemBaSyou(ctx3, cardId2), to = DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\");\n                  ctx3 = GameStateFn.doItemMove(ctx3, to, [cardId2, from]);\n                  const hasHigh = GameStateFn.getCardHasSpeicalEffect(ctx3, [\"\\u6226\\u95D8\\u914D\\u5099\"], cardId2, { ges }), hasPS = GameStateFn.getCardHasSpeicalEffect(ctx3, [\"\\u3010PS\\u88C5\\u7532\\u3011\"], cardId2, { ges }), isRoll = (hasHigh || hasPS) == !1;\n                  return ctx3 = GameStateFn.doItemSetRollState(ctx3, isRoll, [cardId2, GameStateFn.getItemBaSyou(ctx3, cardId2)], { isSkipTargetMissing: !0 }), ctx3 = GameStateFn.doTriggerEvent(ctx3, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId2] }), ctx3;\n                }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 942,
            "description": "onEvent: このカードが場に出た場合 [\"PlayerA_39\"]",
            "effect": {
                "id": "createUnitGoStageEffectFromPlayEffect_PlayerA_39",
                "reason": [
                    "場に出る",
                    "PlayerA",
                    "PlayerA_39"
                ],
                "description": "Play シャイニングガンダム［∞］",
                "text": {
                    "id": "createPlayUnitEffect_PlayerA_39",
                    "description": "Play シャイニングガンダム［∞］",
                    "title": [],
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect2, { DefineFn, GameStateFn }) {\n                  const ges = GameStateFn.getGlobalEffects(ctx3, null), cardId2 = DefineFn.EffectFn.getCardID(effect2), from = GameStateFn.getItemBaSyou(ctx3, cardId2), to = DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\");\n                  ctx3 = GameStateFn.doItemMove(ctx3, to, [cardId2, from]);\n                  const hasHigh = GameStateFn.getCardHasSpeicalEffect(ctx3, [\"\\u6226\\u95D8\\u914D\\u5099\"], cardId2, { ges }), hasPS = GameStateFn.getCardHasSpeicalEffect(ctx3, [\"\\u3010PS\\u88C5\\u7532\\u3011\"], cardId2, { ges }), isRoll = (hasHigh || hasPS) == !1;\n                  return ctx3 = GameStateFn.doItemSetRollState(ctx3, isRoll, [cardId2, GameStateFn.getItemBaSyou(ctx3, cardId2)], { isSkipTargetMissing: !0 }), ctx3 = GameStateFn.doTriggerEvent(ctx3, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId2] }), ctx3;\n                }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 941,
            "description": "onEffectStart: Play シャイニングガンダム［∞］",
            "effect": {
                "id": "createUnitGoStageEffectFromPlayEffect_PlayerA_39",
                "reason": [
                    "場に出る",
                    "PlayerA",
                    "PlayerA_39"
                ],
                "description": "Play シャイニングガンダム［∞］",
                "text": {
                    "id": "createPlayUnitEffect_PlayerA_39",
                    "description": "Play シャイニングガンダム［∞］",
                    "title": [],
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect2, { DefineFn, GameStateFn }) {\n                  const ges = GameStateFn.getGlobalEffects(ctx3, null), cardId2 = DefineFn.EffectFn.getCardID(effect2), from = GameStateFn.getItemBaSyou(ctx3, cardId2), to = DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\");\n                  ctx3 = GameStateFn.doItemMove(ctx3, to, [cardId2, from]);\n                  const hasHigh = GameStateFn.getCardHasSpeicalEffect(ctx3, [\"\\u6226\\u95D8\\u914D\\u5099\"], cardId2, { ges }), hasPS = GameStateFn.getCardHasSpeicalEffect(ctx3, [\"\\u3010PS\\u88C5\\u7532\\u3011\"], cardId2, { ges }), isRoll = (hasHigh || hasPS) == !1;\n                  return ctx3 = GameStateFn.doItemSetRollState(ctx3, isRoll, [cardId2, GameStateFn.getItemBaSyou(ctx3, cardId2)], { isSkipTargetMissing: !0 }), ctx3 = GameStateFn.doTriggerEvent(ctx3, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId2] }), ctx3;\n                }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 940,
            "description": "onEffectEnd: Play シャイニングガンダム［∞］"
        },
        {
            "id": 939,
            "description": "onItemMove:PlayerA_39 = [\"PlayerA\",\"手札\"] => [\"PlayerA\",\"プレイされているカード\"]",
            "effect": {
                "id": "createPlayUnitEffect_PlayerA_39",
                "reason": [
                    "PlayCard",
                    "PlayerA",
                    "PlayerA_39",
                    {
                        "isPlayUnit": true
                    }
                ],
                "description": "Play シャイニングガンダム［∞］",
                "text": {
                    "id": "createPlayUnitEffect_PlayerA_39",
                    "title": [
                        "使用型",
                        [
                            "自軍",
                            "配備フェイズ"
                        ]
                    ],
                    "description": "Play シャイニングガンダム［∞］",
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
                        "橫置支付0[茶]": {
                            "title": [
                                "RollColor",
                                "茶"
                            ],
                            "actions": [
                                {
                                    "title": [
                                        "_ロールする",
                                        "ロール"
                                    ],
                                    "vars": [
                                        "橫置支付0[茶]"
                                    ]
                                }
                            ],
                            "groupKey": "支付橫置國力"
                        },
                        "橫置支付1[茶]": {
                            "title": [
                                "RollColor",
                                "茶"
                            ],
                            "actions": [
                                {
                                    "title": [
                                        "_ロールする",
                                        "ロール"
                                    ],
                                    "vars": [
                                        "橫置支付1[茶]"
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
                                    "title": "function _(ctx3, effect, { DefineFn, GameStateFn, ToolFn: ToolFn2 }) {\n              let ges = GameStateFn.getGlobalEffects(ctx3, null);\n              ctx3 = GameStateFn.setGlobalEffects(ctx3, null, ges);\n              const cardId2 = DefineFn.EffectFn.getCardID(effect), from = GameStateFn.getItemBaSyou(ctx3, cardId2);\n              ctx3 = GameStateFn.doItemMove(ctx3, DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u3044\\u308B\\u30AB\\u30FC\\u30C9\"), [cardId2, from]);\n              const newE = GameStateFn.createUnitGoStageEffectFromPlayEffect(ctx3, effect, { ges });\n              return GameStateFn.addStackEffect(ctx3, newE);\n            }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 938,
            "description": "onEvent: GameEventOnMove [\"PlayerA_39\"]",
            "effect": {
                "id": "createPlayUnitEffect_PlayerA_39",
                "reason": [
                    "PlayCard",
                    "PlayerA",
                    "PlayerA_39",
                    {
                        "isPlayUnit": true
                    }
                ],
                "description": "Play シャイニングガンダム［∞］",
                "text": {
                    "id": "createPlayUnitEffect_PlayerA_39",
                    "title": [
                        "使用型",
                        [
                            "自軍",
                            "配備フェイズ"
                        ]
                    ],
                    "description": "Play シャイニングガンダム［∞］",
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
                        "橫置支付0[茶]": {
                            "title": [
                                "RollColor",
                                "茶"
                            ],
                            "actions": [
                                {
                                    "title": [
                                        "_ロールする",
                                        "ロール"
                                    ],
                                    "vars": [
                                        "橫置支付0[茶]"
                                    ]
                                }
                            ],
                            "groupKey": "支付橫置國力"
                        },
                        "橫置支付1[茶]": {
                            "title": [
                                "RollColor",
                                "茶"
                            ],
                            "actions": [
                                {
                                    "title": [
                                        "_ロールする",
                                        "ロール"
                                    ],
                                    "vars": [
                                        "橫置支付1[茶]"
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
                                    "title": "function _(ctx3, effect, { DefineFn, GameStateFn, ToolFn: ToolFn2 }) {\n              let ges = GameStateFn.getGlobalEffects(ctx3, null);\n              ctx3 = GameStateFn.setGlobalEffects(ctx3, null, ges);\n              const cardId2 = DefineFn.EffectFn.getCardID(effect), from = GameStateFn.getItemBaSyou(ctx3, cardId2);\n              ctx3 = GameStateFn.doItemMove(ctx3, DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u3044\\u308B\\u30AB\\u30FC\\u30C9\"), [cardId2, from]);\n              const newE = GameStateFn.createUnitGoStageEffectFromPlayEffect(ctx3, effect, { ges });\n              return GameStateFn.addStackEffect(ctx3, newE);\n            }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 937,
            "description": "PlayerA_39.isRoll undefined => false",
            "effect": {
                "id": "createPlayUnitEffect_PlayerA_39",
                "reason": [
                    "PlayCard",
                    "PlayerA",
                    "PlayerA_39",
                    {
                        "isPlayUnit": true
                    }
                ],
                "description": "Play シャイニングガンダム［∞］",
                "text": {
                    "id": "createPlayUnitEffect_PlayerA_39",
                    "title": [
                        "使用型",
                        [
                            "自軍",
                            "配備フェイズ"
                        ]
                    ],
                    "description": "Play シャイニングガンダム［∞］",
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
                        "橫置支付0[茶]": {
                            "title": [
                                "RollColor",
                                "茶"
                            ],
                            "actions": [
                                {
                                    "title": [
                                        "_ロールする",
                                        "ロール"
                                    ],
                                    "vars": [
                                        "橫置支付0[茶]"
                                    ]
                                }
                            ],
                            "groupKey": "支付橫置國力"
                        },
                        "橫置支付1[茶]": {
                            "title": [
                                "RollColor",
                                "茶"
                            ],
                            "actions": [
                                {
                                    "title": [
                                        "_ロールする",
                                        "ロール"
                                    ],
                                    "vars": [
                                        "橫置支付1[茶]"
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
                                    "title": "function _(ctx3, effect, { DefineFn, GameStateFn, ToolFn: ToolFn2 }) {\n              let ges = GameStateFn.getGlobalEffects(ctx3, null);\n              ctx3 = GameStateFn.setGlobalEffects(ctx3, null, ges);\n              const cardId2 = DefineFn.EffectFn.getCardID(effect), from = GameStateFn.getItemBaSyou(ctx3, cardId2);\n              ctx3 = GameStateFn.doItemMove(ctx3, DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u3044\\u308B\\u30AB\\u30FC\\u30C9\"), [cardId2, from]);\n              const newE = GameStateFn.createUnitGoStageEffectFromPlayEffect(ctx3, effect, { ges });\n              return GameStateFn.addStackEffect(ctx3, newE);\n            }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 936,
            "description": "onEvent: プレイした場合 [\"PlayerA_39\"]",
            "effect": {
                "id": "createPlayUnitEffect_PlayerA_39",
                "reason": [
                    "PlayCard",
                    "PlayerA",
                    "PlayerA_39",
                    {
                        "isPlayUnit": true
                    }
                ],
                "description": "Play シャイニングガンダム［∞］",
                "text": {
                    "id": "createPlayUnitEffect_PlayerA_39",
                    "title": [
                        "使用型",
                        [
                            "自軍",
                            "配備フェイズ"
                        ]
                    ],
                    "description": "Play シャイニングガンダム［∞］",
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
                        "橫置支付0[茶]": {
                            "title": [
                                "RollColor",
                                "茶"
                            ],
                            "actions": [
                                {
                                    "title": [
                                        "_ロールする",
                                        "ロール"
                                    ],
                                    "vars": [
                                        "橫置支付0[茶]"
                                    ]
                                }
                            ],
                            "groupKey": "支付橫置國力"
                        },
                        "橫置支付1[茶]": {
                            "title": [
                                "RollColor",
                                "茶"
                            ],
                            "actions": [
                                {
                                    "title": [
                                        "_ロールする",
                                        "ロール"
                                    ],
                                    "vars": [
                                        "橫置支付1[茶]"
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
                                    "title": "function _(ctx3, effect, { DefineFn, GameStateFn, ToolFn: ToolFn2 }) {\n              let ges = GameStateFn.getGlobalEffects(ctx3, null);\n              ctx3 = GameStateFn.setGlobalEffects(ctx3, null, ges);\n              const cardId2 = DefineFn.EffectFn.getCardID(effect), from = GameStateFn.getItemBaSyou(ctx3, cardId2);\n              ctx3 = GameStateFn.doItemMove(ctx3, DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u3044\\u308B\\u30AB\\u30FC\\u30C9\"), [cardId2, from]);\n              const newE = GameStateFn.createUnitGoStageEffectFromPlayEffect(ctx3, effect, { ges });\n              return GameStateFn.addStackEffect(ctx3, newE);\n            }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 935,
            "description": "PlayerA_42.isRoll false => true",
            "effect": {
                "id": "createPlayUnitEffect_PlayerA_39",
                "reason": [
                    "PlayCard",
                    "PlayerA",
                    "PlayerA_39",
                    {
                        "isPlayUnit": true
                    }
                ],
                "description": "Play シャイニングガンダム［∞］",
                "text": {
                    "id": "createPlayUnitEffect_PlayerA_39",
                    "title": [
                        "使用型",
                        [
                            "自軍",
                            "配備フェイズ"
                        ]
                    ],
                    "description": "Play シャイニングガンダム［∞］",
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
                        "橫置支付0[茶]": {
                            "title": [
                                "RollColor",
                                "茶"
                            ],
                            "actions": [
                                {
                                    "title": [
                                        "_ロールする",
                                        "ロール"
                                    ],
                                    "vars": [
                                        "橫置支付0[茶]"
                                    ]
                                }
                            ],
                            "groupKey": "支付橫置國力"
                        },
                        "橫置支付1[茶]": {
                            "title": [
                                "RollColor",
                                "茶"
                            ],
                            "actions": [
                                {
                                    "title": [
                                        "_ロールする",
                                        "ロール"
                                    ],
                                    "vars": [
                                        "橫置支付1[茶]"
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
                                    "title": "function _(ctx3, effect, { DefineFn, GameStateFn, ToolFn: ToolFn2 }) {\n              let ges = GameStateFn.getGlobalEffects(ctx3, null);\n              ctx3 = GameStateFn.setGlobalEffects(ctx3, null, ges);\n              const cardId2 = DefineFn.EffectFn.getCardID(effect), from = GameStateFn.getItemBaSyou(ctx3, cardId2);\n              ctx3 = GameStateFn.doItemMove(ctx3, DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u3044\\u308B\\u30AB\\u30FC\\u30C9\"), [cardId2, from]);\n              const newE = GameStateFn.createUnitGoStageEffectFromPlayEffect(ctx3, effect, { ges });\n              return GameStateFn.addStackEffect(ctx3, newE);\n            }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 934,
            "description": "PlayerA_15.isRoll false => true",
            "effect": {
                "id": "createPlayUnitEffect_PlayerA_39",
                "reason": [
                    "PlayCard",
                    "PlayerA",
                    "PlayerA_39",
                    {
                        "isPlayUnit": true
                    }
                ],
                "description": "Play シャイニングガンダム［∞］",
                "text": {
                    "id": "createPlayUnitEffect_PlayerA_39",
                    "title": [
                        "使用型",
                        [
                            "自軍",
                            "配備フェイズ"
                        ]
                    ],
                    "description": "Play シャイニングガンダム［∞］",
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
                        "橫置支付0[茶]": {
                            "title": [
                                "RollColor",
                                "茶"
                            ],
                            "actions": [
                                {
                                    "title": [
                                        "_ロールする",
                                        "ロール"
                                    ],
                                    "vars": [
                                        "橫置支付0[茶]"
                                    ]
                                }
                            ],
                            "groupKey": "支付橫置國力"
                        },
                        "橫置支付1[茶]": {
                            "title": [
                                "RollColor",
                                "茶"
                            ],
                            "actions": [
                                {
                                    "title": [
                                        "_ロールする",
                                        "ロール"
                                    ],
                                    "vars": [
                                        "橫置支付1[茶]"
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
                                    "title": "function _(ctx3, effect, { DefineFn, GameStateFn, ToolFn: ToolFn2 }) {\n              let ges = GameStateFn.getGlobalEffects(ctx3, null);\n              ctx3 = GameStateFn.setGlobalEffects(ctx3, null, ges);\n              const cardId2 = DefineFn.EffectFn.getCardID(effect), from = GameStateFn.getItemBaSyou(ctx3, cardId2);\n              ctx3 = GameStateFn.doItemMove(ctx3, DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u3044\\u308B\\u30AB\\u30FC\\u30C9\"), [cardId2, from]);\n              const newE = GameStateFn.createUnitGoStageEffectFromPlayEffect(ctx3, effect, { ges });\n              return GameStateFn.addStackEffect(ctx3, newE);\n            }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 933,
            "description": "onEffectStart: Play シャイニングガンダム［∞］",
            "effect": {
                "id": "createPlayUnitEffect_PlayerA_39",
                "reason": [
                    "PlayCard",
                    "PlayerA",
                    "PlayerA_39",
                    {
                        "isPlayUnit": true
                    }
                ],
                "description": "Play シャイニングガンダム［∞］",
                "text": {
                    "id": "createPlayUnitEffect_PlayerA_39",
                    "title": [
                        "使用型",
                        [
                            "自軍",
                            "配備フェイズ"
                        ]
                    ],
                    "description": "Play シャイニングガンダム［∞］",
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
                        "橫置支付0[茶]": {
                            "title": [
                                "RollColor",
                                "茶"
                            ],
                            "actions": [
                                {
                                    "title": [
                                        "_ロールする",
                                        "ロール"
                                    ],
                                    "vars": [
                                        "橫置支付0[茶]"
                                    ]
                                }
                            ],
                            "groupKey": "支付橫置國力"
                        },
                        "橫置支付1[茶]": {
                            "title": [
                                "RollColor",
                                "茶"
                            ],
                            "actions": [
                                {
                                    "title": [
                                        "_ロールする",
                                        "ロール"
                                    ],
                                    "vars": [
                                        "橫置支付1[茶]"
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
                                    "title": "function _(ctx3, effect, { DefineFn, GameStateFn, ToolFn: ToolFn2 }) {\n              let ges = GameStateFn.getGlobalEffects(ctx3, null);\n              ctx3 = GameStateFn.setGlobalEffects(ctx3, null, ges);\n              const cardId2 = DefineFn.EffectFn.getCardID(effect), from = GameStateFn.getItemBaSyou(ctx3, cardId2);\n              ctx3 = GameStateFn.doItemMove(ctx3, DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u3044\\u308B\\u30AB\\u30FC\\u30C9\"), [cardId2, from]);\n              const newE = GameStateFn.createUnitGoStageEffectFromPlayEffect(ctx3, effect, { ges });\n              return GameStateFn.addStackEffect(ctx3, newE);\n            }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 932,
            "description": "onEffectEnd: PlayG"
        },
        {
            "id": 931,
            "description": "onEvent: このカードがGとして場に出た場合 [\"PlayerA_13\"]",
            "effect": {
                "id": "createPlayGEffect_PlayerA_13",
                "reason": [
                    "PlayCard",
                    "PlayerA",
                    "PlayerA_13",
                    {
                        "isPlayG": true
                    }
                ],
                "description": "Play G",
                "text": {
                    "id": "createPlayGEffect_PlayerA_13",
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
            "id": 930,
            "description": "onEvent: プレイされて場に出た場合 [\"PlayerA_13\"]",
            "effect": {
                "id": "createPlayGEffect_PlayerA_13",
                "reason": [
                    "PlayCard",
                    "PlayerA",
                    "PlayerA_13",
                    {
                        "isPlayG": true
                    }
                ],
                "description": "Play G",
                "text": {
                    "id": "createPlayGEffect_PlayerA_13",
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
            "id": 929,
            "description": "onItemMove:PlayerA_13 = [\"PlayerA\",\"手札\"] => [\"PlayerA\",\"Gゾーン\"]",
            "effect": {
                "id": "createPlayGEffect_PlayerA_13",
                "reason": [
                    "PlayCard",
                    "PlayerA",
                    "PlayerA_13",
                    {
                        "isPlayG": true
                    }
                ],
                "description": "Play G",
                "text": {
                    "id": "createPlayGEffect_PlayerA_13",
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
            "id": 928,
            "description": "onEvent: GameEventOnMove [\"PlayerA_13\"]",
            "effect": {
                "id": "createPlayGEffect_PlayerA_13",
                "reason": [
                    "PlayCard",
                    "PlayerA",
                    "PlayerA_13",
                    {
                        "isPlayG": true
                    }
                ],
                "description": "Play G",
                "text": {
                    "id": "createPlayGEffect_PlayerA_13",
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
            "id": 927,
            "description": "PlayerA_13.isFaceDown true => false",
            "effect": {
                "id": "createPlayGEffect_PlayerA_13",
                "reason": [
                    "PlayCard",
                    "PlayerA",
                    "PlayerA_13",
                    {
                        "isPlayG": true
                    }
                ],
                "description": "Play G",
                "text": {
                    "id": "createPlayGEffect_PlayerA_13",
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
            "id": 926,
            "description": "onPlayerStateChange:PlayerA",
            "effect": {
                "id": "createPlayGEffect_PlayerA_13",
                "reason": [
                    "PlayCard",
                    "PlayerA",
                    "PlayerA_13",
                    {
                        "isPlayG": true
                    }
                ],
                "description": "Play G",
                "text": {
                    "id": "createPlayGEffect_PlayerA_13",
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
            "id": 925,
            "description": "onEffectStart: PlayG",
            "effect": {
                "id": "createPlayGEffect_PlayerA_13",
                "reason": [
                    "PlayCard",
                    "PlayerA",
                    "PlayerA_13",
                    {
                        "isPlayG": true
                    }
                ],
                "description": "Play G",
                "text": {
                    "id": "createPlayGEffect_PlayerA_13",
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
            "id": 924,
            "description": "onSetPhase:配備フェイズ,フリータイミング"
        },
        {
            "id": 923,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 922,
            "description": "onSetPhase:配備フェイズ,フェイズ開始"
        },
        {
            "id": 921,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 920,
            "description": "onSetPhase:ドローフェイズ,フェイズ終了"
        },
        {
            "id": 919,
            "description": "onSetPhase:ドローフェイズ,フリータイミング"
        },
        {
            "id": 918,
            "description": "onEffectEnd: 抽牌階段規定效果"
        },
        {
            "id": 917,
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
            "id": 916,
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
            "id": 915,
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
            "id": 914,
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
            "id": 913,
            "description": "onSetPhase:ドローフェイズ,規定の効果"
        },
        {
            "id": 912,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 911,
            "description": "onSetPhase:ドローフェイズ,フェイズ開始"
        },
        {
            "id": 910,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 909,
            "description": "onSetPhase:リロールフェイズ,フェイズ終了"
        },
        {
            "id": 908,
            "description": "onSetPhase:リロールフェイズ,フリータイミング"
        },
        {
            "id": 907,
            "description": "onEffectEnd: getRerollPhaseRuleEffect"
        },
        {
            "id": 906,
            "description": "PlayerA_22.isRoll true => false",
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
            "id": 905,
            "description": "PlayerA_42.isRoll true => false",
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
            "id": 904,
            "description": "PlayerA_15.isRoll true => false",
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
            "id": 903,
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
            "id": 902,
            "description": "onSetPhase:リロールフェイズ,規定の効果"
        },
        {
            "id": 901,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 900,
            "description": "onSetPhase:リロールフェイズ,フェイズ開始"
        },
        {
            "id": 899,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 898,
            "description": "onPlayerStateChange:PlayerB"
        },
        {
            "id": 897,
            "description": "onSetPhase:戦闘フェイズ,ターン終了時,効果終了。ターン終了"
        },
        {
            "id": 896,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 895,
            "description": "將發動起動效果但條件不足: : 調整手牌為7張以下"
        },
        {
            "id": 894,
            "description": "將發動起動效果但條件不足: : 調整手牌為7張以下"
        },
        {
            "id": 893,
            "description": "onSetPhase:戦闘フェイズ,ターン終了時,手札調整"
        },
        {
            "id": 892,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 891,
            "description": "onSetPhase:戦闘フェイズ,ターン終了時,効果解決"
        },
        {
            "id": 890,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 889,
            "description": "onSetPhase:戦闘フェイズ,ターン終了時,ダメージリセット"
        },
        {
            "id": 888,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 887,
            "description": "onSetPhase:戦闘フェイズ,帰還ステップ,ステップ終了"
        },
        {
            "id": 886,
            "description": "onSetPhase:戦闘フェイズ,帰還ステップ,フリータイミング2"
        },
        {
            "id": 885,
            "description": "onEffectEnd: getReturnRuleEffect"
        },
        {
            "id": 884,
            "description": "onItemMove:PlayerB_53 = [\"PlayerB\",\"戦闘エリア2\"] => [\"PlayerB\",\"配備エリア\"]",
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
            "id": 883,
            "description": "onEvent: GameEventOnMove [\"PlayerB_53\"]",
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
            "id": 882,
            "description": "PlayerB_53.isRoll false => true",
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
            "id": 881,
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
            "id": 880,
            "description": "onSetPhase:戦闘フェイズ,帰還ステップ,規定の効果"
        },
        {
            "id": 879,
            "description": "onSetPhase:戦闘フェイズ,帰還ステップ,フリータイミング"
        },
        {
            "id": 878,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 877,
            "description": "onSetPhase:戦闘フェイズ,帰還ステップ,ステップ開始"
        },
        {
            "id": 876,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 875,
            "description": "onSetPhase:戦闘フェイズ,ダメージ判定ステップ,ステップ終了"
        },
        {
            "id": 874,
            "description": "onEvent: カット終了時 undefined"
        }
    ],
    "messagesCurrentEffect": null,
    "messagesIsPlayerRead": {},
    "turn": 9,
    "setGroup": {
        "itemGroupParent": {},
        "itemGroupChildren": {}
    },
    "stackEffectMemory": [],
    "flowMemory": {
        "state": "playing",
        "hasTriggerEvent": false,
        "hasPlayerPassPhase": {},
        "hasPlayerPassCut": {},
        "hasPlayerPassPayCost": {},
        "shouldTriggerStackEffectFinishedEvent": false,
        "activeEffectID": null,
        "activeLogicID": null,
        "activeLogicSubID": null
    }
}