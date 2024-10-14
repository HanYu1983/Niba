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
            "isFaceDown": true
        },
        "PlayerA_4": {
            "id": "PlayerA_4",
            "protoID": "179003_01A_U_GN001R_green",
            "ownerID": "PlayerA",
            "isFaceDown": true
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
            "isFaceDown": true
        },
        "PlayerA_7": {
            "id": "PlayerA_7",
            "protoID": "179003_01A_U_GN008R_green_02",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_8": {
            "id": "PlayerA_8",
            "protoID": "179007_02A_U_GN020R_green",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_9": {
            "id": "PlayerA_9",
            "protoID": "179009_03B_U_GN036U_green",
            "ownerID": "PlayerA",
            "isFaceDown": true
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
            "isFaceDown": true
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
            "protoID": "179019_02A_U_GN024U_green",
            "ownerID": "PlayerA",
            "isFaceDown": true
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
            "isFaceDown": true
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
            "isFaceDown": true
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
            "isFaceDown": true
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
            "protoID": "179001_01A_CH_WT006C_white",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "PlayerB_51": {
            "id": "PlayerB_51",
            "protoID": "179001_01A_CH_WT006C_white",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "PlayerB_52": {
            "id": "PlayerB_52",
            "protoID": "179001_01A_CH_WT006C_white",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "PlayerB_53": {
            "id": "PlayerB_53",
            "protoID": "179001_01A_CH_WT006C_white",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "PlayerB_54": {
            "id": "PlayerB_54",
            "protoID": "179003_01A_O_WT001C_white",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "PlayerB_55": {
            "id": "PlayerB_55",
            "protoID": "179003_01A_O_WT001C_white",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "PlayerB_56": {
            "id": "PlayerB_56",
            "protoID": "179003_01A_O_WT001C_white",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "PlayerB_57": {
            "id": "PlayerB_57",
            "protoID": "179003_01A_O_WT001C_white",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "PlayerB_58": {
            "id": "PlayerB_58",
            "protoID": "179003_01A_O_WT001C_white",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "PlayerB_59": {
            "id": "PlayerB_59",
            "protoID": "179003_01A_O_WT001C_white",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "PlayerB_60": {
            "id": "PlayerB_60",
            "protoID": "179003_01A_O_WT001C_white",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "PlayerB_61": {
            "id": "PlayerB_61",
            "protoID": "179003_01A_U_WT011C_white",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "PlayerB_62": {
            "id": "PlayerB_62",
            "protoID": "179003_01A_U_WT011C_white",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "PlayerB_63": {
            "id": "PlayerB_63",
            "protoID": "179003_01A_U_WT011C_white",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "PlayerB_64": {
            "id": "PlayerB_64",
            "protoID": "179003_01A_U_WT011C_white",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "PlayerB_65": {
            "id": "PlayerB_65",
            "protoID": "179009_03B_U_WT044U_white",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "PlayerB_66": {
            "id": "PlayerB_66",
            "protoID": "179009_03B_U_WT044U_white",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "PlayerB_67": {
            "id": "PlayerB_67",
            "protoID": "179009_03B_U_WT044U_white",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "PlayerB_68": {
            "id": "PlayerB_68",
            "protoID": "179009_03B_U_WT044U_white",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "PlayerB_69": {
            "id": "PlayerB_69",
            "protoID": "179009_03B_U_WT044U_white",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "PlayerB_70": {
            "id": "PlayerB_70",
            "protoID": "179009_03B_U_WT045U_white",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "PlayerB_71": {
            "id": "PlayerB_71",
            "protoID": "179009_03B_U_WT045U_white",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "PlayerB_72": {
            "id": "PlayerB_72",
            "protoID": "179009_03B_U_WT045U_white",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "PlayerB_73": {
            "id": "PlayerB_73",
            "protoID": "179009_03B_U_WT045U_white",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "PlayerB_74": {
            "id": "PlayerB_74",
            "protoID": "179015_04B_O_WT005U_white",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "PlayerB_75": {
            "id": "PlayerB_75",
            "protoID": "179015_04B_O_WT005U_white",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "PlayerB_76": {
            "id": "PlayerB_76",
            "protoID": "179015_04B_O_WT005U_white",
            "ownerID": "PlayerB",
            "isFaceDown": false,
            "isRoll": true
        },
        "PlayerB_77": {
            "id": "PlayerB_77",
            "protoID": "179019_01A_U_WT003C_white",
            "ownerID": "PlayerB",
            "isFaceDown": false,
            "isRoll": true
        },
        "PlayerB_78": {
            "id": "PlayerB_78",
            "protoID": "179019_01A_U_WT003C_white",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "PlayerB_79": {
            "id": "PlayerB_79",
            "protoID": "179019_01A_U_WT003C_white",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "PlayerB_80": {
            "id": "PlayerB_80",
            "protoID": "179019_02A_C_WT012U_white",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "PlayerB_81": {
            "id": "PlayerB_81",
            "protoID": "179019_02A_C_WT012U_white",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "PlayerB_82": {
            "id": "PlayerB_82",
            "protoID": "179019_02A_C_WT012U_white",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "PlayerB_83": {
            "id": "PlayerB_83",
            "protoID": "179019_02A_U_WT031C_white",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "PlayerB_84": {
            "id": "PlayerB_84",
            "protoID": "179019_02A_U_WT031C_white",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "PlayerB_85": {
            "id": "PlayerB_85",
            "protoID": "179019_02A_U_WT031C_white",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "PlayerB_86": {
            "id": "PlayerB_86",
            "protoID": "179023_06C_C_WT055C_white",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "PlayerB_87": {
            "id": "PlayerB_87",
            "protoID": "179023_06C_C_WT055C_white",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "PlayerB_88": {
            "id": "PlayerB_88",
            "protoID": "179023_06C_C_WT055C_white",
            "ownerID": "PlayerB",
            "isFaceDown": true,
            "isRoll": false
        },
        "PlayerB_89": {
            "id": "PlayerB_89",
            "protoID": "179024_03B_U_WT039R_white",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "PlayerB_90": {
            "id": "PlayerB_90",
            "protoID": "179024_03B_U_WT039R_white",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "PlayerB_91": {
            "id": "PlayerB_91",
            "protoID": "179024_03B_U_WT039R_white",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "PlayerB_92": {
            "id": "PlayerB_92",
            "protoID": "179024_03B_U_WT042U_white",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "PlayerB_93": {
            "id": "PlayerB_93",
            "protoID": "179024_03B_U_WT042U_white",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "PlayerB_94": {
            "id": "PlayerB_94",
            "protoID": "179024_03B_U_WT042U_white",
            "ownerID": "PlayerB",
            "isFaceDown": true
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
            "protoID": "179025_07D_CH_WT075C_white",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "PlayerB_97": {
            "id": "PlayerB_97",
            "protoID": "179027_09D_O_WT014N_white",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "PlayerB_98": {
            "id": "PlayerB_98",
            "protoID": "179027_09D_O_WT014N_white",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "PlayerB_99": {
            "id": "PlayerB_99",
            "protoID": "179027_09D_O_WT014N_white",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "PlayerB_100": {
            "id": "PlayerB_100",
            "protoID": "179028_10D_CH_WT095_white",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "PlayerB_101": {
            "id": "PlayerB_101",
            "protoID": "179028_10D_U_WT177R_white",
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
            "protoID": "179030_11E_C_WT077S_white",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "PlayerB_105": {
            "id": "PlayerB_105",
            "protoID": "179030_11E_C_WT078R_white",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "PlayerB_106": {
            "id": "PlayerB_106",
            "protoID": "179030_11E_C_WT078R_white",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "PlayerB_107": {
            "id": "PlayerB_107",
            "protoID": "179030_11E_C_WT078R_white",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "PlayerB_108": {
            "id": "PlayerB_108",
            "protoID": "179901_00_U_WT001P_white_02",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "PlayerB_109": {
            "id": "PlayerB_109",
            "protoID": "179901_00_U_WT001P_white_02",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "PlayerB_110": {
            "id": "PlayerB_110",
            "protoID": "179901_00_U_WT001P_white_02",
            "ownerID": "PlayerB",
            "isFaceDown": true
        }
    },
    "effects": {
        "createPlayGEffect_PlayerA_48": {
            "id": "createPlayGEffect_PlayerA_48",
            "reason": [
                "PlayCard",
                "PlayerA",
                "PlayerA_48",
                {
                    "isPlayG": true
                }
            ],
            "description": "Play G",
            "text": {
                "id": "createPlayGEffect_PlayerA_48",
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
        },
        "createPlayUnitEffect_PlayerA_48": {
            "id": "createPlayUnitEffect_PlayerA_48",
            "reason": [
                "PlayCard",
                "PlayerA",
                "PlayerA_48",
                {
                    "isPlayUnit": true
                }
            ],
            "description": "Play グフカスタム",
            "text": {
                "id": "createPlayUnitEffect_PlayerA_48",
                "title": [
                    "使用型",
                    [
                        "自軍",
                        "配備フェイズ"
                    ]
                ],
                "description": "Play グフカスタム",
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
                                "title": "function _(ctx3, effect, { DefineFn, GameStateFn, ToolFn: ToolFn2 }) {\n              const cardId2 = DefineFn.EffectFn.getCardID(effect), from = GameStateFn.getItemBaSyou(ctx3, cardId2);\n              ctx3 = GameStateFn.doItemMove(ctx3, DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u3044\\u308B\\u30AB\\u30FC\\u30C9\"), [cardId2, from]);\n              const newE = GameStateFn.createUnitGoStageEffectFromPlayEffect(ctx3, effect);\n              return GameStateFn.addStackEffect(ctx3, newE);\n            }"
                            }
                        ]
                    }
                ]
            }
        },
        "createPlayGEffect_PlayerA_16": {
            "id": "createPlayGEffect_PlayerA_16",
            "reason": [
                "PlayCard",
                "PlayerA",
                "PlayerA_16",
                {
                    "isPlayG": true
                }
            ],
            "description": "Play G",
            "text": {
                "id": "createPlayGEffect_PlayerA_16",
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
        },
        "createPlayUnitEffect_PlayerA_16": {
            "id": "createPlayUnitEffect_PlayerA_16",
            "reason": [
                "PlayCard",
                "PlayerA",
                "PlayerA_16",
                {
                    "isPlayUnit": true
                }
            ],
            "description": "Play アプサラスⅢ［†］",
            "text": {
                "id": "createPlayUnitEffect_PlayerA_16",
                "title": [
                    "使用型",
                    [
                        "自軍",
                        "配備フェイズ"
                    ]
                ],
                "description": "Play アプサラスⅢ［†］",
                "conditions": {
                    "合計国力〔x〕": {
                        "actions": [
                            {
                                "title": [
                                    "合計国力〔x〕",
                                    6
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
                    },
                    "橫置支付2[緑]": {
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
                                    "橫置支付2[緑]"
                                ]
                            }
                        ],
                        "groupKey": "支付橫置國力"
                    },
                    "橫置支付3[緑]": {
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
                                    "橫置支付3[緑]"
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
        },
        "createPlayGEffect_PlayerA_6": {
            "id": "createPlayGEffect_PlayerA_6",
            "reason": [
                "PlayCard",
                "PlayerA",
                "PlayerA_6",
                {
                    "isPlayG": true
                }
            ],
            "description": "Play G",
            "text": {
                "id": "createPlayGEffect_PlayerA_6",
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
        },
        "createPlayUnitEffect_PlayerA_6": {
            "id": "createPlayUnitEffect_PlayerA_6",
            "reason": [
                "PlayCard",
                "PlayerA",
                "PlayerA_6",
                {
                    "isPlayUnit": true
                }
            ],
            "description": "Play アプサラスⅡ【箔押しVer.】",
            "text": {
                "id": "createPlayUnitEffect_PlayerA_6",
                "title": [
                    "使用型",
                    [
                        "自軍",
                        "配備フェイズ"
                    ]
                ],
                "description": "Play アプサラスⅡ【箔押しVer.】",
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
                    },
                    "橫置支付2[緑]": {
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
                                    "橫置支付2[緑]"
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
        },
        "createPlayGEffect_PlayerA_36": {
            "id": "createPlayGEffect_PlayerA_36",
            "reason": [
                "PlayCard",
                "PlayerA",
                "PlayerA_36",
                {
                    "isPlayG": true
                }
            ],
            "description": "Play G",
            "text": {
                "id": "createPlayGEffect_PlayerA_36",
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
        },
        "createPlayUnitEffect_PlayerA_36": {
            "id": "createPlayUnitEffect_PlayerA_36",
            "reason": [
                "PlayCard",
                "PlayerA",
                "PlayerA_36",
                {
                    "isPlayUnit": true
                }
            ],
            "description": "Play ヤクト・ドーガ（クェス機）",
            "text": {
                "id": "createPlayUnitEffect_PlayerA_36",
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
                                "title": "function _(ctx3, effect, { DefineFn, GameStateFn, ToolFn: ToolFn2 }) {\n              const cardId2 = DefineFn.EffectFn.getCardID(effect), from = GameStateFn.getItemBaSyou(ctx3, cardId2);\n              ctx3 = GameStateFn.doItemMove(ctx3, DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u3044\\u308B\\u30AB\\u30FC\\u30C9\"), [cardId2, from]);\n              const newE = GameStateFn.createUnitGoStageEffectFromPlayEffect(ctx3, effect);\n              return GameStateFn.addStackEffect(ctx3, newE);\n            }"
                            }
                        ]
                    }
                ]
            }
        },
        "createPlayGEffect_PlayerA_43": {
            "id": "createPlayGEffect_PlayerA_43",
            "reason": [
                "PlayCard",
                "PlayerA",
                "PlayerA_43",
                {
                    "isPlayG": true
                }
            ],
            "description": "Play G",
            "text": {
                "id": "createPlayGEffect_PlayerA_43",
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
        },
        "createPlayUnitEffect_PlayerA_43": {
            "id": "createPlayUnitEffect_PlayerA_43",
            "reason": [
                "PlayCard",
                "PlayerA",
                "PlayerA_43",
                {
                    "isPlayUnit": true
                }
            ],
            "description": "Play シャア専用ゲルググ ［†］",
            "text": {
                "id": "createPlayUnitEffect_PlayerA_43",
                "title": [
                    "使用型",
                    [
                        "自軍",
                        "配備フェイズ"
                    ]
                ],
                "description": "Play シャア専用ゲルググ ［†］",
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
                                "title": "function _(ctx3, effect, { DefineFn, GameStateFn, ToolFn: ToolFn2 }) {\n              const cardId2 = DefineFn.EffectFn.getCardID(effect), from = GameStateFn.getItemBaSyou(ctx3, cardId2);\n              ctx3 = GameStateFn.doItemMove(ctx3, DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u3044\\u308B\\u30AB\\u30FC\\u30C9\"), [cardId2, from]);\n              const newE = GameStateFn.createUnitGoStageEffectFromPlayEffect(ctx3, effect);\n              return GameStateFn.addStackEffect(ctx3, newE);\n            }"
                            }
                        ]
                    }
                ]
            }
        },
        "createPlayGEffect_PlayerB_54": {
            "id": "createPlayGEffect_PlayerB_54",
            "reason": [
                "PlayCard",
                "PlayerB",
                "PlayerB_54",
                {
                    "isPlayG": true
                }
            ],
            "description": "Play G",
            "text": {
                "id": "createPlayGEffect_PlayerB_54",
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
        },
        "createPlayOperationEffect_PlayerB_54": {
            "id": "createPlayOperationEffect_PlayerB_54",
            "reason": [
                "PlayCard",
                "PlayerB",
                "PlayerB_54",
                {
                    "isPlayOperation": true
                }
            ],
            "description": "Play OS改竄",
            "text": {
                "id": "createPlayOperationEffect_PlayerB_54",
                "title": [
                    "使用型",
                    [
                        "自軍",
                        "配備フェイズ"
                    ]
                ],
                "description": "Play OS改竄",
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
                    }
                },
                "logicTreeActions": [
                    {
                        "actions": [
                            {
                                "title": "function _(ctx3, effect, { DefineFn, GameStateFn, ToolFn: ToolFn2 }) {\n              const cardId2 = DefineFn.EffectFn.getCardID(effect), from = GameStateFn.getItemBaSyou(ctx3, cardId2);\n              ctx3 = GameStateFn.doItemMove(ctx3, DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u3044\\u308B\\u30AB\\u30FC\\u30C9\"), [cardId2, from]);\n              const newE = GameStateFn.createOperationGoStageEffectFromPlayEffect(ctx3, effect);\n              return GameStateFn.addStackEffect(ctx3, newE);\n            }"
                            }
                        ]
                    }
                ]
            }
        },
        "createPlayGEffect_PlayerB_66": {
            "id": "createPlayGEffect_PlayerB_66",
            "reason": [
                "PlayCard",
                "PlayerB",
                "PlayerB_66",
                {
                    "isPlayG": true
                }
            ],
            "description": "Play G",
            "text": {
                "id": "createPlayGEffect_PlayerB_66",
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
        },
        "createPlayUnitEffect_PlayerB_66": {
            "id": "createPlayUnitEffect_PlayerB_66",
            "reason": [
                "PlayCard",
                "PlayerB",
                "PlayerB_66",
                {
                    "isPlayUnit": true
                }
            ],
            "description": "Play ヴァイエイト",
            "text": {
                "id": "createPlayUnitEffect_PlayerB_66",
                "title": [
                    "使用型",
                    [
                        "自軍",
                        "配備フェイズ"
                    ]
                ],
                "description": "Play ヴァイエイト",
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
                    "橫置支付2[白]": {
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
                                    "橫置支付2[白]"
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
        },
        "createPlayGEffect_PlayerB_85": {
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
        },
        "createPlayUnitEffect_PlayerB_85": {
            "id": "createPlayUnitEffect_PlayerB_85",
            "reason": [
                "PlayCard",
                "PlayerB",
                "PlayerB_85",
                {
                    "isPlayUnit": true
                }
            ],
            "description": "Play マグアナック",
            "text": {
                "id": "createPlayUnitEffect_PlayerB_85",
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
        },
        "createPlayGEffect_PlayerA_42": {
            "id": "createPlayGEffect_PlayerA_42",
            "reason": [
                "PlayCard",
                "PlayerA",
                "PlayerA_42",
                {
                    "isPlayG": true
                }
            ],
            "description": "Play G",
            "text": {
                "id": "createPlayGEffect_PlayerA_42",
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
        },
        "createPlayCommandText_PlayerA_42": {
            "id": "createPlayCommandText_PlayerA_42",
            "reason": [
                "PlayCard",
                "PlayerA",
                "PlayerA_42",
                {
                    "isPlayCommand": true
                }
            ],
            "description": "Play 狂気の落とし子",
            "text": {
                "id": "createPlayCommandText_PlayerA_42",
                "title": [
                    "使用型",
                    [
                        "自軍",
                        "配備フェイズ"
                    ]
                ],
                "description": "Play 狂気の落とし子",
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
                    },
                    "橫置支付2[緑]": {
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
                                    "橫置支付2[緑]"
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
                                    "value": "橫置支付0[緑]"
                                },
                                {
                                    "type": "Leaf",
                                    "value": "橫置支付1[緑]"
                                },
                                {
                                    "type": "Leaf",
                                    "value": "橫置支付2[緑]"
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
        "createPlayGEffect_PlayerB_88": {
            "id": "createPlayGEffect_PlayerB_88",
            "reason": [
                "PlayCard",
                "PlayerB",
                "PlayerB_88",
                {
                    "isPlayG": true
                }
            ],
            "description": "Play G",
            "text": {
                "id": "createPlayGEffect_PlayerB_88",
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
    "table": {
        "cardStack": {
            "[\"PlayerA\",\"本国\"]": [
                "PlayerA_29",
                "PlayerA_33",
                "PlayerA_37",
                "PlayerA_13",
                "PlayerA_10",
                "PlayerA_19",
                "PlayerA_18",
                "PlayerA_8",
                "PlayerA_9",
                "PlayerA_12",
                "PlayerA_2",
                "PlayerA_47",
                "PlayerA_31",
                "PlayerA_45",
                "PlayerA_1",
                "PlayerA_17",
                "PlayerA_39",
                "PlayerA_28",
                "PlayerA_24",
                "PlayerA_46",
                "PlayerA_38",
                "PlayerA_25",
                "PlayerA_41",
                "PlayerA_30",
                "PlayerA_4",
                "PlayerA_44",
                "PlayerA_21",
                "PlayerA_35",
                "PlayerA_26",
                "PlayerA_49",
                "PlayerA_0",
                "PlayerA_23",
                "PlayerA_34",
                "PlayerA_20",
                "PlayerA_11",
                "PlayerA_15",
                "PlayerA_32",
                "PlayerA_7",
                "PlayerA_27",
                "PlayerA_22",
                "PlayerA_3",
                "PlayerA_5",
                "PlayerA_14"
            ],
            "[\"PlayerB\",\"本国\"]": [
                "PlayerB_53",
                "PlayerB_81",
                "PlayerB_104",
                "PlayerB_107",
                "PlayerB_78",
                "PlayerB_89",
                "PlayerB_90",
                "PlayerB_97",
                "PlayerB_92",
                "PlayerB_56",
                "PlayerB_110",
                "PlayerB_74",
                "PlayerB_58",
                "PlayerB_98",
                "PlayerB_99",
                "PlayerB_72",
                "PlayerB_84",
                "PlayerB_109",
                "PlayerB_67",
                "PlayerB_101",
                "PlayerB_62",
                "PlayerB_108",
                "PlayerB_55",
                "PlayerB_64",
                "PlayerB_59",
                "PlayerB_105",
                "PlayerB_87",
                "PlayerB_65",
                "PlayerB_94",
                "PlayerB_103",
                "PlayerB_100",
                "PlayerB_70",
                "PlayerB_96",
                "PlayerB_63",
                "PlayerB_102",
                "PlayerB_61",
                "PlayerB_52",
                "PlayerB_75",
                "PlayerB_50",
                "PlayerB_79",
                "PlayerB_93",
                "PlayerB_51",
                "PlayerB_80",
                "PlayerB_82",
                "PlayerB_86",
                "PlayerB_83",
                "PlayerB_57",
                "PlayerB_71",
                "PlayerB_60",
                "PlayerB_91",
                "PlayerB_69",
                "PlayerB_73",
                "PlayerB_68",
                "PlayerB_106"
            ],
            "[\"PlayerA\",\"手札\"]": [
                "PlayerA_48",
                "PlayerA_42",
                "PlayerA_16",
                "PlayerA_6",
                "PlayerA_36",
                "PlayerA_43"
            ],
            "[\"PlayerB\",\"手札\"]": [
                "PlayerB_54",
                "PlayerB_66",
                "PlayerB_85",
                "PlayerB_88"
            ],
            "[\"PlayerB\",\"Gゾーン\"]": [
                "PlayerB_95"
            ],
            "[\"PlayerB\",\"プレイされているカード\"]": [],
            "[\"PlayerA\",\"Gゾーン\"]": [
                "PlayerA_40"
            ],
            "[\"PlayerB\",\"配備エリア\"]": [
                "PlayerB_77",
                "PlayerB_76"
            ]
        }
    },
    "chips": {},
    "chipProtos": {},
    "itemStates": {
        "PlayerB_77": {
            "id": "PlayerB_77",
            "damage": 0,
            "destroyReason": null,
            "flags": {},
            "tips": {
                "橫置支付0[白]": {
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
                "合計国力〔x〕": {
                    "title": [
                        "カード",
                        [],
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
            "textIdsUseThisTurn": [],
            "isAttack": false,
            "isDefence": false
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
                                "PlayerB_77",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "配備エリア"
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
                                "PlayerB_77",
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
                    "min": 1
                },
                "一個自軍機體": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerB_77",
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
                                "PlayerB_77",
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
                }
            },
            "globalEffects": {},
            "varNamesRemoveOnTurnEnd": {},
            "isFirstTurn": true
        }
    },
    "phase": [
        "配備フェイズ",
        "フリータイミング"
    ],
    "playerStates": {
        "PlayerB": {
            "id": "PlayerB",
            "turn": 0,
            "playGCount": 1,
            "confirmPhase": false,
            "textIdsUseThisTurn": {}
        },
        "PlayerA": {
            "id": "PlayerA",
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
        "createPlayGEffect_PlayerA_48",
        "createPlayUnitEffect_PlayerA_48",
        "createPlayGEffect_PlayerA_16",
        "createPlayUnitEffect_PlayerA_16",
        "createPlayGEffect_PlayerA_6",
        "createPlayUnitEffect_PlayerA_6",
        "createPlayGEffect_PlayerA_36",
        "createPlayUnitEffect_PlayerA_36",
        "createPlayGEffect_PlayerA_43",
        "createPlayUnitEffect_PlayerA_43",
        "createPlayGEffect_PlayerB_54",
        "createPlayOperationEffect_PlayerB_54",
        "createPlayGEffect_PlayerB_66",
        "createPlayUnitEffect_PlayerB_66",
        "createPlayGEffect_PlayerB_85",
        "createPlayUnitEffect_PlayerB_85",
        "createPlayGEffect_PlayerA_42",
        "createPlayCommandText_PlayerA_42",
        "createPlayGEffect_PlayerB_88"
    ],
    "commandEffectTips": [
        {
            "effectId": "createPlayGEffect_PlayerA_48",
            "conditionKeys": [
                "出G上限"
            ],
            "logicID": 0,
            "logicSubID": 0,
            "tipOrErrors": [
                {
                    "effectId": "createPlayGEffect_PlayerA_48",
                    "conditionKey": "出G上限",
                    "tip": null,
                    "errors": []
                }
            ]
        },
        {
            "effectId": "createPlayUnitEffect_PlayerA_48",
            "conditionKeys": [
                "合計国力〔x〕",
                "橫置支付0[緑]",
                "橫置支付1[緑]"
            ],
            "logicID": 0,
            "logicSubID": 0,
            "tipOrErrors": [
                {
                    "effectId": "createPlayUnitEffect_PlayerA_48",
                    "conditionKey": "合計国力〔x〕",
                    "tip": null,
                    "errors": [
                        "合計国力〔x〕:1 < 3. Play グフカスタム"
                    ]
                },
                {
                    "effectId": "createPlayUnitEffect_PlayerA_48",
                    "conditionKey": "橫置支付0[緑]",
                    "tip": {
                        "title": [
                            "カード",
                            [
                                [
                                    "PlayerA_40",
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
                                    "PlayerA_40",
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
                    "effectId": "createPlayUnitEffect_PlayerA_48",
                    "conditionKey": "橫置支付1[緑]",
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
                        "cardId: PlayerA_48 target not set yet: 橫置支付1[緑]"
                    ]
                }
            ]
        },
        {
            "effectId": "createPlayGEffect_PlayerA_16",
            "conditionKeys": [
                "出G上限"
            ],
            "logicID": 0,
            "logicSubID": 0,
            "tipOrErrors": [
                {
                    "effectId": "createPlayGEffect_PlayerA_16",
                    "conditionKey": "出G上限",
                    "tip": null,
                    "errors": []
                }
            ]
        },
        {
            "effectId": "createPlayUnitEffect_PlayerA_16",
            "conditionKeys": [
                "合計国力〔x〕",
                "橫置支付0[緑]",
                "橫置支付1[緑]",
                "橫置支付2[緑]",
                "橫置支付3[緑]"
            ],
            "logicID": 0,
            "logicSubID": 0,
            "tipOrErrors": [
                {
                    "effectId": "createPlayUnitEffect_PlayerA_16",
                    "conditionKey": "合計国力〔x〕",
                    "tip": null,
                    "errors": [
                        "合計国力〔x〕:1 < 6. Play アプサラスⅢ［†］"
                    ]
                },
                {
                    "effectId": "createPlayUnitEffect_PlayerA_16",
                    "conditionKey": "橫置支付0[緑]",
                    "tip": {
                        "title": [
                            "カード",
                            [
                                [
                                    "PlayerA_40",
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
                                    "PlayerA_40",
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
                    "effectId": "createPlayUnitEffect_PlayerA_16",
                    "conditionKey": "橫置支付1[緑]",
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
                        "cardId: PlayerA_16 target not set yet: 橫置支付1[緑]"
                    ]
                },
                {
                    "effectId": "createPlayUnitEffect_PlayerA_16",
                    "conditionKey": "橫置支付2[緑]",
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
                        "cardId: PlayerA_16 target not set yet: 橫置支付2[緑]"
                    ]
                },
                {
                    "effectId": "createPlayUnitEffect_PlayerA_16",
                    "conditionKey": "橫置支付3[緑]",
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
                        "cardId: PlayerA_16 target not set yet: 橫置支付3[緑]"
                    ]
                }
            ]
        },
        {
            "effectId": "createPlayGEffect_PlayerA_6",
            "conditionKeys": [
                "出G上限"
            ],
            "logicID": 0,
            "logicSubID": 0,
            "tipOrErrors": [
                {
                    "effectId": "createPlayGEffect_PlayerA_6",
                    "conditionKey": "出G上限",
                    "tip": null,
                    "errors": []
                }
            ]
        },
        {
            "effectId": "createPlayUnitEffect_PlayerA_6",
            "conditionKeys": [
                "合計国力〔x〕",
                "橫置支付0[緑]",
                "橫置支付1[緑]",
                "橫置支付2[緑]"
            ],
            "logicID": 0,
            "logicSubID": 0,
            "tipOrErrors": [
                {
                    "effectId": "createPlayUnitEffect_PlayerA_6",
                    "conditionKey": "合計国力〔x〕",
                    "tip": null,
                    "errors": [
                        "合計国力〔x〕:1 < 5. Play アプサラスⅡ【箔押しVer.】"
                    ]
                },
                {
                    "effectId": "createPlayUnitEffect_PlayerA_6",
                    "conditionKey": "橫置支付0[緑]",
                    "tip": {
                        "title": [
                            "カード",
                            [
                                [
                                    "PlayerA_40",
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
                                    "PlayerA_40",
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
                    "effectId": "createPlayUnitEffect_PlayerA_6",
                    "conditionKey": "橫置支付1[緑]",
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
                        "cardId: PlayerA_6 target not set yet: 橫置支付1[緑]"
                    ]
                },
                {
                    "effectId": "createPlayUnitEffect_PlayerA_6",
                    "conditionKey": "橫置支付2[緑]",
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
                        "cardId: PlayerA_6 target not set yet: 橫置支付2[緑]"
                    ]
                }
            ]
        },
        {
            "effectId": "createPlayGEffect_PlayerA_36",
            "conditionKeys": [
                "出G上限"
            ],
            "logicID": 0,
            "logicSubID": 0,
            "tipOrErrors": [
                {
                    "effectId": "createPlayGEffect_PlayerA_36",
                    "conditionKey": "出G上限",
                    "tip": null,
                    "errors": []
                }
            ]
        },
        {
            "effectId": "createPlayUnitEffect_PlayerA_36",
            "conditionKeys": [
                "合計国力〔x〕",
                "橫置支付0[緑]",
                "橫置支付1[緑]"
            ],
            "logicID": 0,
            "logicSubID": 0,
            "tipOrErrors": [
                {
                    "effectId": "createPlayUnitEffect_PlayerA_36",
                    "conditionKey": "合計国力〔x〕",
                    "tip": null,
                    "errors": [
                        "合計国力〔x〕:1 < 4. Play ヤクト・ドーガ（クェス機）"
                    ]
                },
                {
                    "effectId": "createPlayUnitEffect_PlayerA_36",
                    "conditionKey": "橫置支付0[緑]",
                    "tip": {
                        "title": [
                            "カード",
                            [
                                [
                                    "PlayerA_40",
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
                                    "PlayerA_40",
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
                    "effectId": "createPlayUnitEffect_PlayerA_36",
                    "conditionKey": "橫置支付1[緑]",
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
                        "cardId: PlayerA_36 target not set yet: 橫置支付1[緑]"
                    ]
                }
            ]
        },
        {
            "effectId": "createPlayGEffect_PlayerA_43",
            "conditionKeys": [
                "出G上限"
            ],
            "logicID": 0,
            "logicSubID": 0,
            "tipOrErrors": [
                {
                    "effectId": "createPlayGEffect_PlayerA_43",
                    "conditionKey": "出G上限",
                    "tip": null,
                    "errors": []
                }
            ]
        },
        {
            "effectId": "createPlayUnitEffect_PlayerA_43",
            "conditionKeys": [
                "合計国力〔x〕",
                "橫置支付0[緑]",
                "橫置支付1[緑]"
            ],
            "logicID": 0,
            "logicSubID": 0,
            "tipOrErrors": [
                {
                    "effectId": "createPlayUnitEffect_PlayerA_43",
                    "conditionKey": "合計国力〔x〕",
                    "tip": null,
                    "errors": [
                        "合計国力〔x〕:1 < 4. Play シャア専用ゲルググ ［†］"
                    ]
                },
                {
                    "effectId": "createPlayUnitEffect_PlayerA_43",
                    "conditionKey": "橫置支付0[緑]",
                    "tip": {
                        "title": [
                            "カード",
                            [
                                [
                                    "PlayerA_40",
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
                                    "PlayerA_40",
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
                    "effectId": "createPlayUnitEffect_PlayerA_43",
                    "conditionKey": "橫置支付1[緑]",
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
                        "cardId: PlayerA_43 target not set yet: 橫置支付1[緑]"
                    ]
                }
            ]
        },
        {
            "effectId": "createPlayGEffect_PlayerB_54",
            "conditionKeys": [
                "出G上限"
            ],
            "logicID": 0,
            "logicSubID": 0,
            "tipOrErrors": [
                {
                    "effectId": "createPlayGEffect_PlayerB_54",
                    "conditionKey": "出G上限",
                    "tip": null,
                    "errors": [
                        "出G上限: 1"
                    ]
                }
            ]
        },
        {
            "effectId": "createPlayOperationEffect_PlayerB_54",
            "conditionKeys": [
                "合計国力〔x〕"
            ],
            "logicID": 0,
            "logicSubID": 0,
            "tipOrErrors": [
                {
                    "effectId": "createPlayOperationEffect_PlayerB_54",
                    "conditionKey": "合計国力〔x〕",
                    "tip": null,
                    "errors": [
                        "合計国力〔x〕:1 < 4. Play OS改竄"
                    ]
                }
            ]
        },
        {
            "effectId": "createPlayGEffect_PlayerB_66",
            "conditionKeys": [
                "出G上限"
            ],
            "logicID": 0,
            "logicSubID": 0,
            "tipOrErrors": [
                {
                    "effectId": "createPlayGEffect_PlayerB_66",
                    "conditionKey": "出G上限",
                    "tip": null,
                    "errors": [
                        "出G上限: 1"
                    ]
                }
            ]
        },
        {
            "effectId": "createPlayUnitEffect_PlayerB_66",
            "conditionKeys": [
                "合計国力〔x〕",
                "橫置支付0[白]",
                "橫置支付1[白]",
                "橫置支付2[白]"
            ],
            "logicID": 0,
            "logicSubID": 0,
            "tipOrErrors": [
                {
                    "effectId": "createPlayUnitEffect_PlayerB_66",
                    "conditionKey": "合計国力〔x〕",
                    "tip": null,
                    "errors": [
                        "合計国力〔x〕:1 < 3. Play ヴァイエイト"
                    ]
                },
                {
                    "effectId": "createPlayUnitEffect_PlayerB_66",
                    "conditionKey": "橫置支付0[白]",
                    "tip": {
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
                    "errors": []
                },
                {
                    "effectId": "createPlayUnitEffect_PlayerB_66",
                    "conditionKey": "橫置支付1[白]",
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
                        "cardId: PlayerB_66 target not set yet: 橫置支付1[白]"
                    ]
                },
                {
                    "effectId": "createPlayUnitEffect_PlayerB_66",
                    "conditionKey": "橫置支付2[白]",
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
                        "cardId: PlayerB_66 target not set yet: 橫置支付2[白]"
                    ]
                }
            ]
        },
        {
            "effectId": "createPlayGEffect_PlayerB_85",
            "conditionKeys": [
                "出G上限"
            ],
            "logicID": 0,
            "logicSubID": 0,
            "tipOrErrors": [
                {
                    "effectId": "createPlayGEffect_PlayerB_85",
                    "conditionKey": "出G上限",
                    "tip": null,
                    "errors": [
                        "出G上限: 1"
                    ]
                }
            ]
        },
        {
            "effectId": "createPlayUnitEffect_PlayerB_85",
            "conditionKeys": [
                "合計国力〔x〕",
                "橫置支付0[白]"
            ],
            "logicID": 0,
            "logicSubID": 0,
            "tipOrErrors": [
                {
                    "effectId": "createPlayUnitEffect_PlayerB_85",
                    "conditionKey": "合計国力〔x〕",
                    "tip": null,
                    "errors": [
                        "合計国力〔x〕:1 < 3. Play マグアナック"
                    ]
                },
                {
                    "effectId": "createPlayUnitEffect_PlayerB_85",
                    "conditionKey": "橫置支付0[白]",
                    "tip": {
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
                    "errors": []
                }
            ]
        },
        {
            "effectId": "createPlayGEffect_PlayerA_42",
            "conditionKeys": [
                "出G上限"
            ],
            "logicID": 0,
            "logicSubID": 0,
            "tipOrErrors": [
                {
                    "effectId": "createPlayGEffect_PlayerA_42",
                    "conditionKey": "出G上限",
                    "tip": null,
                    "errors": []
                }
            ]
        },
        {
            "effectId": "createPlayCommandText_PlayerA_42",
            "conditionKeys": [
                "合計国力〔x〕",
                "橫置支付0[緑]",
                "橫置支付1[緑]",
                "橫置支付2[緑]"
            ],
            "logicID": 0,
            "logicSubID": 0,
            "tipOrErrors": [
                {
                    "effectId": "createPlayCommandText_PlayerA_42",
                    "conditionKey": "合計国力〔x〕",
                    "tip": null,
                    "errors": [
                        "合計国力〔x〕:1 < 4. Play 狂気の落とし子"
                    ]
                },
                {
                    "effectId": "createPlayCommandText_PlayerA_42",
                    "conditionKey": "橫置支付0[緑]",
                    "tip": {
                        "title": [
                            "カード",
                            [
                                [
                                    "PlayerA_40",
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
                                    "PlayerA_40",
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
                    "effectId": "createPlayCommandText_PlayerA_42",
                    "conditionKey": "橫置支付1[緑]",
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
                        "cardId: PlayerA_42 target not set yet: 橫置支付1[緑]"
                    ]
                },
                {
                    "effectId": "createPlayCommandText_PlayerA_42",
                    "conditionKey": "橫置支付2[緑]",
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
                        "cardId: PlayerA_42 target not set yet: 橫置支付2[緑]"
                    ]
                }
            ]
        },
        {
            "effectId": "createPlayGEffect_PlayerB_88",
            "conditionKeys": [
                "出G上限"
            ],
            "logicID": 0,
            "logicSubID": 0,
            "tipOrErrors": [
                {
                    "effectId": "createPlayGEffect_PlayerB_88",
                    "conditionKey": "出G上限",
                    "tip": null,
                    "errors": [
                        "出G上限: 1"
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
    "messageTopId": 247,
    "messages": [
        {
            "id": 246,
            "description": "onEvent: カット終了時 undefined"
        },
        {
            "id": 245,
            "description": "onEffectEnd: Play サイクロプス"
        },
        {
            "id": 244,
            "description": "onEvent: プレイされて場にセットされた場合 [\"PlayerB_76\"]",
            "effect": {
                "id": "createCharOpUnitGoStageEffectFromPlayEffect_PlayerB_76",
                "reason": [
                    "場に出る",
                    "PlayerB",
                    "PlayerB_76"
                ],
                "description": "Play サイクロプス",
                "text": {
                    "id": "createPlayCharacterOperationEffect_PlayerB_76",
                    "description": "Play サイクロプス",
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
            "id": 243,
            "description": "onEvent: プレイされて場に出た場合 [\"PlayerB_76\"]",
            "effect": {
                "id": "createCharOpUnitGoStageEffectFromPlayEffect_PlayerB_76",
                "reason": [
                    "場に出る",
                    "PlayerB",
                    "PlayerB_76"
                ],
                "description": "Play サイクロプス",
                "text": {
                    "id": "createPlayCharacterOperationEffect_PlayerB_76",
                    "description": "Play サイクロプス",
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
            "id": 242,
            "description": "onSetSetGroupParent:PlayerB_77 PlayerB_76",
            "effect": {
                "id": "createCharOpUnitGoStageEffectFromPlayEffect_PlayerB_76",
                "reason": [
                    "場に出る",
                    "PlayerB",
                    "PlayerB_76"
                ],
                "description": "Play サイクロプス",
                "text": {
                    "id": "createPlayCharacterOperationEffect_PlayerB_76",
                    "description": "Play サイクロプス",
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
            "id": 241,
            "description": "PlayerB_76.isRoll false => true",
            "effect": {
                "id": "createCharOpUnitGoStageEffectFromPlayEffect_PlayerB_76",
                "reason": [
                    "場に出る",
                    "PlayerB",
                    "PlayerB_76"
                ],
                "description": "Play サイクロプス",
                "text": {
                    "id": "createPlayCharacterOperationEffect_PlayerB_76",
                    "description": "Play サイクロプス",
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
            "id": 240,
            "description": "onItemMove:PlayerB_76 = [\"PlayerB\",\"プレイされているカード\"] => [\"PlayerB\",\"配備エリア\"]",
            "effect": {
                "id": "createCharOpUnitGoStageEffectFromPlayEffect_PlayerB_76",
                "reason": [
                    "場に出る",
                    "PlayerB",
                    "PlayerB_76"
                ],
                "description": "Play サイクロプス",
                "text": {
                    "id": "createPlayCharacterOperationEffect_PlayerB_76",
                    "description": "Play サイクロプス",
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
            "id": 239,
            "description": "onEvent: GameEventOnMove [\"PlayerB_76\"]",
            "effect": {
                "id": "createCharOpUnitGoStageEffectFromPlayEffect_PlayerB_76",
                "reason": [
                    "場に出る",
                    "PlayerB",
                    "PlayerB_76"
                ],
                "description": "Play サイクロプス",
                "text": {
                    "id": "createPlayCharacterOperationEffect_PlayerB_76",
                    "description": "Play サイクロプス",
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
            "id": 238,
            "description": "onEvent: このカードが場に出た場合 [\"PlayerB_76\"]",
            "effect": {
                "id": "createCharOpUnitGoStageEffectFromPlayEffect_PlayerB_76",
                "reason": [
                    "場に出る",
                    "PlayerB",
                    "PlayerB_76"
                ],
                "description": "Play サイクロプス",
                "text": {
                    "id": "createPlayCharacterOperationEffect_PlayerB_76",
                    "description": "Play サイクロプス",
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
            "id": 237,
            "description": "onEffectStart: Play サイクロプス",
            "effect": {
                "id": "createCharOpUnitGoStageEffectFromPlayEffect_PlayerB_76",
                "reason": [
                    "場に出る",
                    "PlayerB",
                    "PlayerB_76"
                ],
                "description": "Play サイクロプス",
                "text": {
                    "id": "createPlayCharacterOperationEffect_PlayerB_76",
                    "description": "Play サイクロプス",
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
            "id": 236,
            "description": "onEffectEnd: Play サイクロプス"
        },
        {
            "id": 235,
            "description": "onItemMove:PlayerB_76 = [\"PlayerB\",\"手札\"] => [\"PlayerB\",\"プレイされているカード\"]",
            "effect": {
                "id": "createPlayCharacterOperationEffect_PlayerB_76",
                "reason": [
                    "PlayCard",
                    "PlayerB",
                    "PlayerB_76",
                    {
                        "isPlayCharacter": false,
                        "isPlayOperation": true
                    }
                ],
                "description": "Play サイクロプス",
                "text": {
                    "id": "createPlayCharacterOperationEffect_PlayerB_76",
                    "title": [
                        "使用型",
                        [
                            "自軍",
                            "配備フェイズ"
                        ]
                    ],
                    "description": "Play サイクロプス",
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
            "id": 234,
            "description": "onEvent: GameEventOnMove [\"PlayerB_76\"]",
            "effect": {
                "id": "createPlayCharacterOperationEffect_PlayerB_76",
                "reason": [
                    "PlayCard",
                    "PlayerB",
                    "PlayerB_76",
                    {
                        "isPlayCharacter": false,
                        "isPlayOperation": true
                    }
                ],
                "description": "Play サイクロプス",
                "text": {
                    "id": "createPlayCharacterOperationEffect_PlayerB_76",
                    "title": [
                        "使用型",
                        [
                            "自軍",
                            "配備フェイズ"
                        ]
                    ],
                    "description": "Play サイクロプス",
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
            "id": 233,
            "description": "PlayerB_76.isRoll undefined => false",
            "effect": {
                "id": "createPlayCharacterOperationEffect_PlayerB_76",
                "reason": [
                    "PlayCard",
                    "PlayerB",
                    "PlayerB_76",
                    {
                        "isPlayCharacter": false,
                        "isPlayOperation": true
                    }
                ],
                "description": "Play サイクロプス",
                "text": {
                    "id": "createPlayCharacterOperationEffect_PlayerB_76",
                    "title": [
                        "使用型",
                        [
                            "自軍",
                            "配備フェイズ"
                        ]
                    ],
                    "description": "Play サイクロプス",
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
            "id": 232,
            "description": "onEvent: プレイした場合 [\"PlayerB_76\"]",
            "effect": {
                "id": "createPlayCharacterOperationEffect_PlayerB_76",
                "reason": [
                    "PlayCard",
                    "PlayerB",
                    "PlayerB_76",
                    {
                        "isPlayCharacter": false,
                        "isPlayOperation": true
                    }
                ],
                "description": "Play サイクロプス",
                "text": {
                    "id": "createPlayCharacterOperationEffect_PlayerB_76",
                    "title": [
                        "使用型",
                        [
                            "自軍",
                            "配備フェイズ"
                        ]
                    ],
                    "description": "Play サイクロプス",
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
            "id": 231,
            "description": "PlayerB_77.isRoll false => true",
            "effect": {
                "id": "createPlayCharacterOperationEffect_PlayerB_76",
                "reason": [
                    "PlayCard",
                    "PlayerB",
                    "PlayerB_76",
                    {
                        "isPlayCharacter": false,
                        "isPlayOperation": true
                    }
                ],
                "description": "Play サイクロプス",
                "text": {
                    "id": "createPlayCharacterOperationEffect_PlayerB_76",
                    "title": [
                        "使用型",
                        [
                            "自軍",
                            "配備フェイズ"
                        ]
                    ],
                    "description": "Play サイクロプス",
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
            "id": 230,
            "description": "onEffectStart: Play サイクロプス",
            "effect": {
                "id": "createPlayCharacterOperationEffect_PlayerB_76",
                "reason": [
                    "PlayCard",
                    "PlayerB",
                    "PlayerB_76",
                    {
                        "isPlayCharacter": false,
                        "isPlayOperation": true
                    }
                ],
                "description": "Play サイクロプス",
                "text": {
                    "id": "createPlayCharacterOperationEffect_PlayerB_76",
                    "title": [
                        "使用型",
                        [
                            "自軍",
                            "配備フェイズ"
                        ]
                    ],
                    "description": "Play サイクロプス",
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
            "id": 229,
            "description": "onSetPhase:配備フェイズ,フリータイミング"
        },
        {
            "id": 228,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 227,
            "description": "onSetPhase:配備フェイズ,フェイズ開始"
        },
        {
            "id": 226,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 225,
            "description": "onSetPhase:ドローフェイズ,フェイズ終了"
        },
        {
            "id": 224,
            "description": "onSetPhase:ドローフェイズ,フリータイミング"
        },
        {
            "id": 223,
            "description": "onEffectEnd: 抽牌階段規定效果"
        },
        {
            "id": 222,
            "description": "onItemMove:PlayerB_88 = [\"PlayerB\",\"本国\"] => [\"PlayerB\",\"手札\"]",
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
            "id": 221,
            "description": "onEvent: GameEventOnMove [\"PlayerB_88\"]",
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
            "id": 220,
            "description": "PlayerB_88.isRoll undefined => false",
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
            "id": 219,
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
            "id": 218,
            "description": "onSetPhase:ドローフェイズ,規定の効果"
        },
        {
            "id": 217,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 216,
            "description": "onSetPhase:ドローフェイズ,フェイズ開始"
        },
        {
            "id": 215,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 214,
            "description": "onSetPhase:リロールフェイズ,フェイズ終了"
        },
        {
            "id": 213,
            "description": "onSetPhase:リロールフェイズ,フリータイミング"
        },
        {
            "id": 212,
            "description": "onEffectEnd: getRerollPhaseRuleEffect"
        },
        {
            "id": 211,
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
            "id": 210,
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
            "id": 209,
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
            "id": 208,
            "description": "onSetPhase:リロールフェイズ,規定の効果"
        },
        {
            "id": 207,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 206,
            "description": "onSetPhase:リロールフェイズ,フェイズ開始"
        },
        {
            "id": 205,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 204,
            "description": "onPlayerStateChange:PlayerA"
        },
        {
            "id": 203,
            "description": "onSetPhase:戦闘フェイズ,ターン終了時,効果終了。ターン終了"
        },
        {
            "id": 202,
            "description": "onSetPhase:戦闘フェイズ,ターン終了時,手札調整"
        },
        {
            "id": 201,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 200,
            "description": "onSetPhase:戦闘フェイズ,ターン終了時,効果解決"
        },
        {
            "id": 199,
            "description": "onSetPhase:戦闘フェイズ,ターン終了時,ダメージリセット"
        },
        {
            "id": 198,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 197,
            "description": "onSetPhase:戦闘フェイズ,帰還ステップ,ステップ終了"
        },
        {
            "id": 196,
            "description": "onSetPhase:戦闘フェイズ,帰還ステップ,フリータイミング2"
        },
        {
            "id": 195,
            "description": "onEffectEnd: getReturnRuleEffect"
        },
        {
            "id": 194,
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
            "id": 193,
            "description": "onSetPhase:戦闘フェイズ,帰還ステップ,規定の効果"
        },
        {
            "id": 192,
            "description": "onSetPhase:戦闘フェイズ,帰還ステップ,フリータイミング"
        },
        {
            "id": 191,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 190,
            "description": "onSetPhase:戦闘フェイズ,帰還ステップ,ステップ開始"
        },
        {
            "id": 189,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 188,
            "description": "onSetPhase:戦闘フェイズ,ダメージ判定ステップ,ステップ終了"
        },
        {
            "id": 187,
            "description": "onSetPhase:戦闘フェイズ,ダメージ判定ステップ,フリータイミング2"
        },
        {
            "id": 186,
            "description": "onEffectEnd: getDamageRuleEffect"
        },
        {
            "id": 185,
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
            "id": 184,
            "description": "onSetPhase:戦闘フェイズ,ダメージ判定ステップ,規定の効果"
        },
        {
            "id": 183,
            "description": "onSetPhase:戦闘フェイズ,ダメージ判定ステップ,フリータイミング"
        },
        {
            "id": 182,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 181,
            "description": "onSetPhase:戦闘フェイズ,ダメージ判定ステップ,ステップ開始"
        },
        {
            "id": 180,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 179,
            "description": "onSetPhase:戦闘フェイズ,防御ステップ,ステップ終了"
        },
        {
            "id": 178,
            "description": "onSetPhase:戦闘フェイズ,防御ステップ,フリータイミング2"
        },
        {
            "id": 177,
            "description": "onEffectEnd: 出擊"
        },
        {
            "id": 176,
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
            "id": 175,
            "description": "onSetPhase:戦闘フェイズ,防御ステップ,規定の効果"
        },
        {
            "id": 174,
            "description": "onSetPhase:戦闘フェイズ,防御ステップ,フリータイミング"
        },
        {
            "id": 173,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 172,
            "description": "onSetPhase:戦闘フェイズ,防御ステップ,ステップ開始"
        },
        {
            "id": 171,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 170,
            "description": "onSetPhase:戦闘フェイズ,攻撃ステップ,ステップ終了"
        },
        {
            "id": 169,
            "description": "onSetPhase:戦闘フェイズ,攻撃ステップ,フリータイミング2"
        },
        {
            "id": 168,
            "description": "onSetPhase:戦闘フェイズ,攻撃ステップ,規定の効果"
        },
        {
            "id": 167,
            "description": "onSetPhase:戦闘フェイズ,攻撃ステップ,フリータイミング"
        },
        {
            "id": 166,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 165,
            "description": "onSetPhase:戦闘フェイズ,攻撃ステップ,ステップ開始"
        },
        {
            "id": 164,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 163,
            "description": "onSetPhase:配備フェイズ,フェイズ終了"
        },
        {
            "id": 162,
            "description": "onEvent: カット終了時 undefined"
        },
        {
            "id": 161,
            "description": "onEffectEnd: Play リーオー"
        },
        {
            "id": 160,
            "description": "onEvent: プレイされて場に出た場合 [\"PlayerB_77\"]",
            "effect": {
                "id": "createUnitGoStageEffectFromPlayEffect_PlayerB_77",
                "reason": [
                    "場に出る",
                    "PlayerB",
                    "PlayerB_77"
                ],
                "description": "Play リーオー",
                "text": {
                    "id": "createPlayUnitEffect_PlayerB_77",
                    "description": "Play リーオー",
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
            "id": 159,
            "description": "PlayerB_77.isRoll false => true",
            "effect": {
                "id": "createUnitGoStageEffectFromPlayEffect_PlayerB_77",
                "reason": [
                    "場に出る",
                    "PlayerB",
                    "PlayerB_77"
                ],
                "description": "Play リーオー",
                "text": {
                    "id": "createPlayUnitEffect_PlayerB_77",
                    "description": "Play リーオー",
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
            "id": 158,
            "description": "onItemMove:PlayerB_77 = [\"PlayerB\",\"プレイされているカード\"] => [\"PlayerB\",\"配備エリア\"]",
            "effect": {
                "id": "createUnitGoStageEffectFromPlayEffect_PlayerB_77",
                "reason": [
                    "場に出る",
                    "PlayerB",
                    "PlayerB_77"
                ],
                "description": "Play リーオー",
                "text": {
                    "id": "createPlayUnitEffect_PlayerB_77",
                    "description": "Play リーオー",
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
            "id": 157,
            "description": "onEvent: GameEventOnMove [\"PlayerB_77\"]",
            "effect": {
                "id": "createUnitGoStageEffectFromPlayEffect_PlayerB_77",
                "reason": [
                    "場に出る",
                    "PlayerB",
                    "PlayerB_77"
                ],
                "description": "Play リーオー",
                "text": {
                    "id": "createPlayUnitEffect_PlayerB_77",
                    "description": "Play リーオー",
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
            "id": 156,
            "description": "onEvent: このカードが場に出た場合 [\"PlayerB_77\"]",
            "effect": {
                "id": "createUnitGoStageEffectFromPlayEffect_PlayerB_77",
                "reason": [
                    "場に出る",
                    "PlayerB",
                    "PlayerB_77"
                ],
                "description": "Play リーオー",
                "text": {
                    "id": "createPlayUnitEffect_PlayerB_77",
                    "description": "Play リーオー",
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
            "id": 155,
            "description": "onEffectStart: Play リーオー",
            "effect": {
                "id": "createUnitGoStageEffectFromPlayEffect_PlayerB_77",
                "reason": [
                    "場に出る",
                    "PlayerB",
                    "PlayerB_77"
                ],
                "description": "Play リーオー",
                "text": {
                    "id": "createPlayUnitEffect_PlayerB_77",
                    "description": "Play リーオー",
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
            "id": 154,
            "description": "onEffectEnd: PlayG"
        },
        {
            "id": 153,
            "description": "onEvent: このカードがGとして場に出た場合 [\"PlayerA_40\"]",
            "effect": {
                "id": "createPlayGEffect_PlayerA_40",
                "reason": [
                    "PlayCard",
                    "PlayerA",
                    "PlayerA_40",
                    {
                        "isPlayG": true
                    }
                ],
                "description": "Play G",
                "text": {
                    "id": "createPlayGEffect_PlayerA_40",
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
            "id": 152,
            "description": "onEvent: プレイされて場に出た場合 [\"PlayerA_40\"]",
            "effect": {
                "id": "createPlayGEffect_PlayerA_40",
                "reason": [
                    "PlayCard",
                    "PlayerA",
                    "PlayerA_40",
                    {
                        "isPlayG": true
                    }
                ],
                "description": "Play G",
                "text": {
                    "id": "createPlayGEffect_PlayerA_40",
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
            "id": 151,
            "description": "onItemMove:PlayerA_40 = [\"PlayerA\",\"手札\"] => [\"PlayerA\",\"Gゾーン\"]",
            "effect": {
                "id": "createPlayGEffect_PlayerA_40",
                "reason": [
                    "PlayCard",
                    "PlayerA",
                    "PlayerA_40",
                    {
                        "isPlayG": true
                    }
                ],
                "description": "Play G",
                "text": {
                    "id": "createPlayGEffect_PlayerA_40",
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
            "id": 150,
            "description": "onEvent: GameEventOnMove [\"PlayerA_40\"]",
            "effect": {
                "id": "createPlayGEffect_PlayerA_40",
                "reason": [
                    "PlayCard",
                    "PlayerA",
                    "PlayerA_40",
                    {
                        "isPlayG": true
                    }
                ],
                "description": "Play G",
                "text": {
                    "id": "createPlayGEffect_PlayerA_40",
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
            "id": 149,
            "description": "PlayerA_40.isFaceDown true => false",
            "effect": {
                "id": "createPlayGEffect_PlayerA_40",
                "reason": [
                    "PlayCard",
                    "PlayerA",
                    "PlayerA_40",
                    {
                        "isPlayG": true
                    }
                ],
                "description": "Play G",
                "text": {
                    "id": "createPlayGEffect_PlayerA_40",
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
            "id": 148,
            "description": "onPlayerStateChange:PlayerA",
            "effect": {
                "id": "createPlayGEffect_PlayerA_40",
                "reason": [
                    "PlayCard",
                    "PlayerA",
                    "PlayerA_40",
                    {
                        "isPlayG": true
                    }
                ],
                "description": "Play G",
                "text": {
                    "id": "createPlayGEffect_PlayerA_40",
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
            "id": 147,
            "description": "onEffectStart: PlayG",
            "effect": {
                "id": "createPlayGEffect_PlayerA_40",
                "reason": [
                    "PlayCard",
                    "PlayerA",
                    "PlayerA_40",
                    {
                        "isPlayG": true
                    }
                ],
                "description": "Play G",
                "text": {
                    "id": "createPlayGEffect_PlayerA_40",
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
            "id": 146,
            "description": "onEffectEnd: Play リーオー"
        },
        {
            "id": 145,
            "description": "onItemMove:PlayerB_77 = [\"PlayerB\",\"手札\"] => [\"PlayerB\",\"プレイされているカード\"]",
            "effect": {
                "id": "createPlayUnitEffect_PlayerB_77",
                "reason": [
                    "PlayCard",
                    "PlayerB",
                    "PlayerB_77",
                    {
                        "isPlayUnit": true
                    }
                ],
                "description": "Play リーオー",
                "text": {
                    "id": "createPlayUnitEffect_PlayerB_77",
                    "title": [
                        "使用型",
                        [
                            "自軍",
                            "配備フェイズ"
                        ]
                    ],
                    "description": "Play リーオー",
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
            "id": 144,
            "description": "onEvent: GameEventOnMove [\"PlayerB_77\"]",
            "effect": {
                "id": "createPlayUnitEffect_PlayerB_77",
                "reason": [
                    "PlayCard",
                    "PlayerB",
                    "PlayerB_77",
                    {
                        "isPlayUnit": true
                    }
                ],
                "description": "Play リーオー",
                "text": {
                    "id": "createPlayUnitEffect_PlayerB_77",
                    "title": [
                        "使用型",
                        [
                            "自軍",
                            "配備フェイズ"
                        ]
                    ],
                    "description": "Play リーオー",
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
            "id": 143,
            "description": "PlayerB_77.isRoll undefined => false",
            "effect": {
                "id": "createPlayUnitEffect_PlayerB_77",
                "reason": [
                    "PlayCard",
                    "PlayerB",
                    "PlayerB_77",
                    {
                        "isPlayUnit": true
                    }
                ],
                "description": "Play リーオー",
                "text": {
                    "id": "createPlayUnitEffect_PlayerB_77",
                    "title": [
                        "使用型",
                        [
                            "自軍",
                            "配備フェイズ"
                        ]
                    ],
                    "description": "Play リーオー",
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
            "id": 142,
            "description": "onEvent: プレイした場合 [\"PlayerB_77\"]",
            "effect": {
                "id": "createPlayUnitEffect_PlayerB_77",
                "reason": [
                    "PlayCard",
                    "PlayerB",
                    "PlayerB_77",
                    {
                        "isPlayUnit": true
                    }
                ],
                "description": "Play リーオー",
                "text": {
                    "id": "createPlayUnitEffect_PlayerB_77",
                    "title": [
                        "使用型",
                        [
                            "自軍",
                            "配備フェイズ"
                        ]
                    ],
                    "description": "Play リーオー",
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
            "id": 141,
            "description": "PlayerB_95.isRoll undefined => true",
            "effect": {
                "id": "createPlayUnitEffect_PlayerB_77",
                "reason": [
                    "PlayCard",
                    "PlayerB",
                    "PlayerB_77",
                    {
                        "isPlayUnit": true
                    }
                ],
                "description": "Play リーオー",
                "text": {
                    "id": "createPlayUnitEffect_PlayerB_77",
                    "title": [
                        "使用型",
                        [
                            "自軍",
                            "配備フェイズ"
                        ]
                    ],
                    "description": "Play リーオー",
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
            "id": 140,
            "description": "onEffectStart: Play リーオー",
            "effect": {
                "id": "createPlayUnitEffect_PlayerB_77",
                "reason": [
                    "PlayCard",
                    "PlayerB",
                    "PlayerB_77",
                    {
                        "isPlayUnit": true
                    }
                ],
                "description": "Play リーオー",
                "text": {
                    "id": "createPlayUnitEffect_PlayerB_77",
                    "title": [
                        "使用型",
                        [
                            "自軍",
                            "配備フェイズ"
                        ]
                    ],
                    "description": "Play リーオー",
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
            "id": 139,
            "description": "onEffectEnd: PlayG"
        },
        {
            "id": 138,
            "description": "onEvent: このカードがGとして場に出た場合 [\"PlayerB_95\"]",
            "effect": {
                "id": "createPlayGEffect_PlayerB_95",
                "reason": [
                    "PlayCard",
                    "PlayerB",
                    "PlayerB_95",
                    {
                        "isPlayG": true
                    }
                ],
                "description": "Play G",
                "text": {
                    "id": "createPlayGEffect_PlayerB_95",
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
            "id": 137,
            "description": "onEvent: プレイされて場に出た場合 [\"PlayerB_95\"]",
            "effect": {
                "id": "createPlayGEffect_PlayerB_95",
                "reason": [
                    "PlayCard",
                    "PlayerB",
                    "PlayerB_95",
                    {
                        "isPlayG": true
                    }
                ],
                "description": "Play G",
                "text": {
                    "id": "createPlayGEffect_PlayerB_95",
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
            "id": 136,
            "description": "onItemMove:PlayerB_95 = [\"PlayerB\",\"手札\"] => [\"PlayerB\",\"Gゾーン\"]",
            "effect": {
                "id": "createPlayGEffect_PlayerB_95",
                "reason": [
                    "PlayCard",
                    "PlayerB",
                    "PlayerB_95",
                    {
                        "isPlayG": true
                    }
                ],
                "description": "Play G",
                "text": {
                    "id": "createPlayGEffect_PlayerB_95",
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
            "id": 135,
            "description": "onEvent: GameEventOnMove [\"PlayerB_95\"]",
            "effect": {
                "id": "createPlayGEffect_PlayerB_95",
                "reason": [
                    "PlayCard",
                    "PlayerB",
                    "PlayerB_95",
                    {
                        "isPlayG": true
                    }
                ],
                "description": "Play G",
                "text": {
                    "id": "createPlayGEffect_PlayerB_95",
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
            "id": 134,
            "description": "PlayerB_95.isFaceDown true => false",
            "effect": {
                "id": "createPlayGEffect_PlayerB_95",
                "reason": [
                    "PlayCard",
                    "PlayerB",
                    "PlayerB_95",
                    {
                        "isPlayG": true
                    }
                ],
                "description": "Play G",
                "text": {
                    "id": "createPlayGEffect_PlayerB_95",
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
            "id": 133,
            "description": "onPlayerStateChange:PlayerB",
            "effect": {
                "id": "createPlayGEffect_PlayerB_95",
                "reason": [
                    "PlayCard",
                    "PlayerB",
                    "PlayerB_95",
                    {
                        "isPlayG": true
                    }
                ],
                "description": "Play G",
                "text": {
                    "id": "createPlayGEffect_PlayerB_95",
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
            "id": 132,
            "description": "onEffectStart: PlayG",
            "effect": {
                "id": "createPlayGEffect_PlayerB_95",
                "reason": [
                    "PlayCard",
                    "PlayerB",
                    "PlayerB_95",
                    {
                        "isPlayG": true
                    }
                ],
                "description": "Play G",
                "text": {
                    "id": "createPlayGEffect_PlayerB_95",
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
            "id": 131,
            "description": "onSetPhase:配備フェイズ,フリータイミング"
        },
        {
            "id": 130,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 129,
            "description": "onSetPhase:配備フェイズ,フェイズ開始"
        },
        {
            "id": 128,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 127,
            "description": "onSetPhase:ドローフェイズ,フェイズ終了"
        },
        {
            "id": 126,
            "description": "onSetPhase:ドローフェイズ,フリータイミング"
        },
        {
            "id": 125,
            "description": "onEffectEnd: 抽牌階段規定效果"
        },
        {
            "id": 124,
            "description": "onItemMove:PlayerA_40 = [\"PlayerA\",\"本国\"] => [\"PlayerA\",\"手札\"]",
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
            "id": 123,
            "description": "onEvent: GameEventOnMove [\"PlayerA_40\"]",
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
            "id": 122,
            "description": "PlayerA_40.isRoll undefined => false",
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
            "id": 121,
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
            "id": 120,
            "description": "onSetPhase:ドローフェイズ,規定の効果"
        },
        {
            "id": 119,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 118,
            "description": "onSetPhase:ドローフェイズ,フェイズ開始"
        },
        {
            "id": 117,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 116,
            "description": "onSetPhase:リロールフェイズ,フェイズ終了"
        },
        {
            "id": 115,
            "description": "onSetPhase:リロールフェイズ,フリータイミング"
        },
        {
            "id": 114,
            "description": "onEffectEnd: getRerollPhaseRuleEffect"
        },
        {
            "id": 113,
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
            "id": 112,
            "description": "onSetPhase:リロールフェイズ,規定の効果"
        },
        {
            "id": 111,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 110,
            "description": "PlayerB_79.isFaceDown undefined => true"
        },
        {
            "id": 109,
            "description": "PlayerB_67.isFaceDown undefined => true"
        },
        {
            "id": 108,
            "description": "PlayerB_91.isFaceDown undefined => true"
        },
        {
            "id": 107,
            "description": "PlayerB_97.isFaceDown undefined => true"
        },
        {
            "id": 106,
            "description": "PlayerB_83.isFaceDown undefined => true"
        },
        {
            "id": 105,
            "description": "PlayerB_59.isFaceDown undefined => true"
        },
        {
            "id": 104,
            "description": "PlayerB_86.isFaceDown undefined => true"
        },
        {
            "id": 103,
            "description": "PlayerB_82.isFaceDown undefined => true"
        },
        {
            "id": 102,
            "description": "PlayerB_52.isFaceDown undefined => true"
        },
        {
            "id": 101,
            "description": "PlayerB_103.isFaceDown undefined => true"
        },
        {
            "id": 100,
            "description": "PlayerB_57.isFaceDown undefined => true"
        },
        {
            "id": 99,
            "description": "PlayerB_63.isFaceDown undefined => true"
        },
        {
            "id": 98,
            "description": "PlayerB_105.isFaceDown undefined => true"
        },
        {
            "id": 97,
            "description": "PlayerB_69.isFaceDown undefined => true"
        },
        {
            "id": 96,
            "description": "PlayerB_80.isFaceDown undefined => true"
        },
        {
            "id": 95,
            "description": "PlayerB_62.isFaceDown undefined => true"
        },
        {
            "id": 94,
            "description": "PlayerB_90.isFaceDown undefined => true"
        },
        {
            "id": 93,
            "description": "PlayerB_98.isFaceDown undefined => true"
        },
        {
            "id": 92,
            "description": "PlayerB_102.isFaceDown undefined => true"
        },
        {
            "id": 91,
            "description": "PlayerB_78.isFaceDown undefined => true"
        },
        {
            "id": 90,
            "description": "PlayerB_107.isFaceDown undefined => true"
        },
        {
            "id": 89,
            "description": "PlayerB_61.isFaceDown undefined => true"
        },
        {
            "id": 88,
            "description": "PlayerB_68.isFaceDown undefined => true"
        },
        {
            "id": 87,
            "description": "PlayerB_84.isFaceDown undefined => true"
        },
        {
            "id": 86,
            "description": "PlayerB_106.isFaceDown undefined => true"
        },
        {
            "id": 85,
            "description": "PlayerB_54.isFaceDown undefined => true"
        },
        {
            "id": 84,
            "description": "PlayerB_99.isFaceDown undefined => true"
        },
        {
            "id": 83,
            "description": "PlayerB_66.isFaceDown undefined => true"
        },
        {
            "id": 82,
            "description": "PlayerB_75.isFaceDown undefined => true"
        },
        {
            "id": 81,
            "description": "PlayerB_88.isFaceDown undefined => true"
        },
        {
            "id": 80,
            "description": "PlayerB_100.isFaceDown undefined => true"
        },
        {
            "id": 79,
            "description": "PlayerB_108.isFaceDown undefined => true"
        },
        {
            "id": 78,
            "description": "PlayerB_73.isFaceDown undefined => true"
        },
        {
            "id": 77,
            "description": "PlayerB_92.isFaceDown undefined => true"
        },
        {
            "id": 76,
            "description": "PlayerB_101.isFaceDown undefined => true"
        },
        {
            "id": 75,
            "description": "PlayerB_93.isFaceDown undefined => true"
        },
        {
            "id": 74,
            "description": "PlayerB_51.isFaceDown undefined => true"
        },
        {
            "id": 73,
            "description": "PlayerB_58.isFaceDown undefined => true"
        },
        {
            "id": 72,
            "description": "PlayerB_76.isFaceDown undefined => true"
        },
        {
            "id": 71,
            "description": "PlayerB_55.isFaceDown undefined => true"
        },
        {
            "id": 70,
            "description": "PlayerB_104.isFaceDown undefined => true"
        },
        {
            "id": 69,
            "description": "PlayerB_89.isFaceDown undefined => true"
        },
        {
            "id": 68,
            "description": "PlayerB_50.isFaceDown undefined => true"
        },
        {
            "id": 67,
            "description": "PlayerB_70.isFaceDown undefined => true"
        },
        {
            "id": 66,
            "description": "PlayerB_72.isFaceDown undefined => true"
        },
        {
            "id": 65,
            "description": "PlayerB_60.isFaceDown undefined => true"
        },
        {
            "id": 64,
            "description": "PlayerB_109.isFaceDown undefined => true"
        },
        {
            "id": 63,
            "description": "PlayerB_110.isFaceDown undefined => true"
        },
        {
            "id": 62,
            "description": "PlayerB_81.isFaceDown undefined => true"
        },
        {
            "id": 61,
            "description": "PlayerB_95.isFaceDown undefined => true"
        },
        {
            "id": 60,
            "description": "PlayerB_64.isFaceDown undefined => true"
        },
        {
            "id": 59,
            "description": "PlayerB_56.isFaceDown undefined => true"
        },
        {
            "id": 58,
            "description": "PlayerB_71.isFaceDown undefined => true"
        },
        {
            "id": 57,
            "description": "PlayerB_87.isFaceDown undefined => true"
        },
        {
            "id": 56,
            "description": "PlayerB_77.isFaceDown undefined => true"
        },
        {
            "id": 55,
            "description": "PlayerB_94.isFaceDown undefined => true"
        },
        {
            "id": 54,
            "description": "PlayerB_74.isFaceDown undefined => true"
        },
        {
            "id": 53,
            "description": "PlayerB_65.isFaceDown undefined => true"
        },
        {
            "id": 52,
            "description": "PlayerB_85.isFaceDown undefined => true"
        },
        {
            "id": 51,
            "description": "PlayerB_53.isFaceDown undefined => true"
        },
        {
            "id": 50,
            "description": "PlayerB_96.isFaceDown undefined => true"
        },
        {
            "id": 49,
            "description": "PlayerA_14.isFaceDown undefined => true"
        },
        {
            "id": 48,
            "description": "PlayerA_38.isFaceDown undefined => true"
        },
        {
            "id": 47,
            "description": "PlayerA_13.isFaceDown undefined => true"
        }
    ],
    "messagesCurrentEffect": null,
    "messagesIsPlayerRead": {},
    "turn": 1,
    "setGroup": {
        "itemGroupParent": {
            "PlayerB_76": "PlayerB_77"
        },
        "itemGroupChildren": {
            "PlayerB_77": [
                "PlayerB_76"
            ]
        }
    },
    "stackEffectMemory": [],
    "flowMemory": {
        "state": "playing",
        "hasTriggerEvent": false,
        "hasPlayerPassPhase": {},
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