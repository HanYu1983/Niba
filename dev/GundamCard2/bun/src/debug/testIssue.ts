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
import { getPlayerCommands, getPlayerCommandsFilterNoError, getPlayerCommandsFilterNoErrorDistinct, updateCommand } from "../game/gameState/updateCommand"
import { clearActiveEffectID } from "../game/gameStateWithFlowMemory/effect"
import { getEffect } from "../game/gameState/EffectStackComponent"
import { doTriggerEvent } from "../game/gameState/doTriggerEvent"

export async function testIssue() {
    const whiteSpeed = ["179001_01A_CH_WT007R_white", "179004_01A_CH_WT009R_white", "179004_01A_CH_WT010C_white", "179007_02A_U_WT027U_white", "179007_02A_U_WT027U_white", "179008_02A_U_WT034U_white", "179008_02A_U_WT034U_white", "179008_02A_U_WT034U_white", "179014_03B_CH_WT027R_white", "179015_04B_U_WT067C_white", "179015_04B_U_WT067C_white", "179015_04B_U_WT067C_white", "179016_04B_U_WT074C_white", "179016_04B_U_WT074C_white", "179016_04B_U_WT074C_white", "179016_04B_U_WT075C_white", "179016_04B_U_WT075C_white", "179016_04B_U_WT075C_white", "179019_01A_C_WT010C_white", "179019_01A_C_WT010C_white", "179019_02A_U_WT028R_white", "179019_02A_U_WT028R_white", "179022_06C_CH_WT057R_white", "179022_06C_CH_WT057R_white", "179022_06C_CH_WT057R_white", "179022_06C_U_WT113R_white", "179022_06C_U_WT113R_white", "179022_06C_U_WT113R_white", "179023_06C_CH_WT067C_white", "179024_03B_U_WT057U_white", "179024_03B_U_WT057U_white", "179025_07D_C_WT060U_white", "179025_07D_CH_WT075C_white", "179025_07D_CH_WT075C_white", "179025_07D_CH_WT075C_white", "179027_09D_C_WT067R_white", "179027_09D_C_WT067R_white", "179029_B3C_CH_WT102R_white", "179029_B3C_CH_WT103N_white", "179029_B3C_U_WT196R_white", "179030_11E_C_WT077S_white", "179030_11E_C_WT077S_white", "179030_11E_C_WT077S_white", "179030_11E_CH_WT108N_white", "179901_00_C_WT003P_white", "179901_00_C_WT003P_white", "179901_00_C_WT003P_white", "179901_CG_C_WT001P_white", "179901_CG_C_WT001P_white", "179901_CG_CH_WT002P_white"]
    const blackT3 = ["179015_04B_O_BK010C_black", "179015_04B_O_BK010C_black", "179015_04B_U_BK058R_black", "179015_04B_U_BK058R_black", "179015_04B_U_BK059C_black", "179015_04B_U_BK059C_black", "179015_04B_U_BK061C_black", "179015_04B_U_BK061C_black", "179016_04B_U_BK066C_black", "179016_04B_U_BK066C_black", "179019_02A_C_BK015S_black", "179019_02A_C_BK015S_black", "179020_05C_U_BK100U_black", "179020_05C_U_BK100U_black", "179023_06C_C_BK048R_black", "179023_06C_C_BK048R_black", "179023_06C_C_BK049U_black", "179023_06C_C_BK049U_black", "179024_04B_C_BK027U_black", "179024_04B_C_BK027U_black", "179024_04B_U_BK060C_black", "179024_04B_U_BK060C_black", "179024_04B_U_BK067C_black", "179024_04B_U_BK067C_black", "179024_B2B_C_BK054C_black", "179024_B2B_C_BK054C_black", "179024_B2B_U_BK128S_black_02", "179024_B2B_U_BK128S_black_02", "179024_B2B_U_BK129R_black", "179024_B2B_U_BK129R_black", "179027_09D_C_BK063R_black", "179027_09D_C_BK063R_black", "179027_09D_O_BK010N_black", "179027_09D_O_BK010N_black", "179027_09D_U_BK163S_black", "179027_09D_U_BK163S_black", "179027_09D_U_BK163S_black", "179029_06C_C_BK045U_black", "179029_06C_C_BK045U_black", "179029_B3C_C_BK071N_black", "179029_B3C_C_BK071N_black", "179029_B3C_U_BK184N_black", "179029_B3C_U_BK184N_black", "179029_B3C_U_BK184N_black", "179029_B3C_U_BK185N_black", "179029_B3C_U_BK185N_black", "179030_11E_U_BK194S_2_black", "179030_11E_U_BK194S_2_black", "179030_11E_U_BK194S_2_black", "179901_B2B_C_BK005P_black"]
    await Promise.all([...blackT3, ...whiteSpeed].map(loadPrototype))
    let ctx = TMP_CTX
    // ctx = setPhase(ctx, ["戦闘フェイズ", "防御ステップ", "フリータイミング"]) as GameStateWithFlowMemory
    // ctx = updateCommand(ctx) as GameStateWithFlowMemory
    // console.log("getPlayerCommands", getPlayerCommands(ctx, PlayerA).length)
    // console.log("getPlayerCommandsFilterNoError", getPlayerCommandsFilterNoError(ctx, PlayerA).length)
    // let flows = queryFlow(ctx, PlayerA)
    // let flow: any = flows.find(flow => flow.id == "FlowSetActiveEffectID")
    // if (flow == null) {
    //     throw new Error()
    // }
    // ctx = applyFlow(ctx, PlayerA, flow)

    // flows = queryFlow(ctx, PlayerA).filter(flow => flow.id == "FlowSetTipSelection")
    // flows.forEach(flow=>{
    //     ctx = applyFlow(ctx, PlayerA, flow)
    // })
    // console.log("getPlayerCommands", getPlayerCommands(ctx, PlayerA).length)
    // console.log("getPlayerCommandsFilterNoError", getPlayerCommandsFilterNoError(ctx, PlayerA).length)

    // flows = queryFlow(ctx, PlayerA)
    // flow = flows.find(flow => flow.id == "FlowPassPayCost")
    // if (flow == null) {
    //     throw new Error()
    // }
    // ctx = applyFlow(ctx, PlayerA, flow)


    // flows = queryFlow(ctx, PlayerA)
    // flow = flows.find(flow => flow.id == "FlowObserveEffect")
    // if (flow == null) {
    //     throw new Error()
    // }

    // flows = queryFlow(ctx, PlayerB)
    // flow = flows.find(flow => flow.id == "FlowPassPayCost")
    // if (flow == null) {
    //     throw new Error()
    // }
    // ctx = applyFlow(ctx, PlayerB, flow)

    // flows = queryFlow(ctx, PlayerA)
    // flow = flows.find(flow => flow.id == "FlowDoEffect")
    // if (flow == null) {
    //     throw new Error()
    // }
    // ctx = applyFlow(ctx, PlayerA, flow)
    // console.log("getPlayerCommands", getPlayerCommands(ctx, PlayerA).length)
    // console.log("getPlayerCommandsFilterNoError", getPlayerCommandsFilterNoError(ctx, PlayerA).length)

    // flows = queryFlow(ctx, PlayerA)
    // flow = flows.find(flow => flow.id == "FlowSetActiveEffectID")
    // if (flow == null) {
    //     throw new Error()
    // }
    // ctx = applyFlow(ctx, PlayerA, flow)

    // flows = queryFlow(ctx, PlayerA)
    // flow = flows.find(flow => flow.id == "FlowPassPayCost")
    // if (flow == null) {
    //     throw new Error()
    // }
    // ctx = applyFlow(ctx, PlayerA, flow)
    // flows = queryFlow(ctx, PlayerA)

    // flows = queryFlow(ctx, PlayerB)
    // flow = flows.find(flow => flow.id == "FlowPassPayCost")
    // if (flow == null) {
    //     throw new Error()
    // }
    // ctx = applyFlow(ctx, PlayerB, flow)
    // console.log("=========", ctx.flowMemory.hasPlayerPassCut)
    // console.log("getPlayerCommandsFilterNoError", getPlayerCommandsFilterNoError(ctx, PlayerA).length)

    // flows = queryFlow(ctx, PlayerA)
    // flow = flows.find(flow => flow.id == "FlowDoEffect")
    // if (flow == null) {
    //     throw new Error()
    // }
    // ctx = applyFlow(ctx, PlayerA, flow)
    // console.log("=========", ctx.flowMemory.hasPlayerPassCut)
    // console.log("getPlayerCommandsFilterNoError", getPlayerCommandsFilterNoError(ctx, PlayerA).length)


    // flows = queryFlow(ctx, PlayerB)
    // flow = flows.find(flow => flow.id == "FlowHandleStackEffectFinished")
    // if (flow == null) {
    //     throw new Error()
    // }
    // ctx = applyFlow(ctx, PlayerB, flow)
    

    // flows = queryFlow(ctx, PlayerB)
    // flow = flows.find(flow => flow.id == "FlowPassPhase")
    // if (flow == null) {
    //     throw new Error()
    // }
    // ctx = applyFlow(ctx, PlayerB, flow)
    // console.log("=========", ctx.flowMemory.hasPlayerPassCut)
    // console.log("getPlayerCommands", getPlayerCommands(ctx, PlayerA).length)
    // console.log("getPlayerCommandsFilterNoError", getPlayerCommandsFilterNoError(ctx, PlayerA).length)
    // console.log("getPlayerCommandsFilterNoErrorDistinct", getPlayerCommandsFilterNoErrorDistinct(ctx, PlayerA).length)
    // console.log("phase", getPhase(ctx))
    // flows = queryFlow(ctx, PlayerA)
    // flow = flows.find(flow => flow.id == "FlowSetActiveEffectID")
    // if (flow == null) {
    //     throw new Error()
    // }
    // ctx = applyFlow(ctx, PlayerA, flow)







    // flows = queryFlow(ctx, PlayerA).filter(flow => flow.id == "FlowSetTipSelection")
    // flows.forEach(flow=>{
    //     ctx = applyFlow(ctx, PlayerA, flow)
    // })
    // console.log("getPlayerCommands", getPlayerCommands(ctx, PlayerA).length)
    // console.log("getPlayerCommandsFilterNoError", getPlayerCommandsFilterNoError(ctx, PlayerA).length)

    // flows = queryFlow(ctx, PlayerA)
    // flow = flows.find(flow => flow.id == "FlowPassPayCost")
    // if (flow == null) {
    //     throw new Error()
    // }
    // ctx = applyFlow(ctx, PlayerA, flow)
    // flows = queryFlow(ctx, PlayerA)
    // console.log(flows)

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
            "isFaceDown": false,
            "isRoll": false
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
            "isFaceDown": false,
            "isRoll": true
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
            "isFaceDown": true,
            "isRoll": false
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
            "isFaceDown": false,
            "isRoll": true
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
            "isFaceDown": false,
            "isRoll": true
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
            "isFaceDown": false,
            "isRoll": false
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
            "isRoll": true
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
            "isFaceDown": false,
            "isRoll": false
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
            "protoID": "179015_04B_O_BK010C_black",
            "ownerID": "PlayerB",
            "isFaceDown": false,
            "isRoll": true
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
            "isFaceDown": false,
            "isRoll": true
        },
        "PlayerB_54": {
            "id": "PlayerB_54",
            "protoID": "179015_04B_U_BK059C_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "PlayerB_55": {
            "id": "PlayerB_55",
            "protoID": "179024_04B_U_BK067C_black",
            "ownerID": "PlayerB",
            "isFaceDown": false,
            "isRoll": false
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
            "isFaceDown": true,
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
            "isFaceDown": false,
            "isRoll": false
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
            "isFaceDown": false,
            "isRoll": true
        },
        "PlayerB_71": {
            "id": "PlayerB_71",
            "protoID": "179024_04B_U_BK060C_black",
            "ownerID": "PlayerB",
            "isFaceDown": false,
            "isRoll": true
        },
        "PlayerB_72": {
            "id": "PlayerB_72",
            "protoID": "179015_04B_U_BK059C_black",
            "ownerID": "PlayerB",
            "isFaceDown": false,
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
            "isFaceDown": false,
            "isRoll": true
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
            "isFaceDown": false,
            "isRoll": false
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
            "isFaceDown": false,
            "isRoll": true
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
            "isFaceDown": true
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
            "isFaceDown": true,
            "isRoll": false
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
            "isFaceDown": true,
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
            "isFaceDown": false,
            "isRoll": false
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
            "isFaceDown": true,
            "isRoll": false
        },
        "PlayerB_99": {
            "id": "PlayerB_99",
            "protoID": "179901_B2B_C_BK005P_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        }
    },
    "effects": {
        "addStackEffect_019294be-406b-7003-a239-a54b5931451f": {
            "id": "addStackEffect_019294be-406b-7003-a239-a54b5931451f",
            "description": "（戦闘フェイズ）：［ ］の特徴を持つ自軍ユニット１枚は、ターン終了時まで、このカードの本来のテキスト１つと同じテキストを得る。ただし同じテキストは得られない）",
            "reason": [
                "PlayText",
                "PlayerB",
                "PlayerB_78",
                "loadPrototype_179024_B2B_U_BK129R_black_text_3"
            ],
            "text": {
                "id": "loadPrototype_179024_B2B_U_BK129R_black_text_3",
                "description": "（戦闘フェイズ）：［ ］の特徴を持つ自軍ユニット１枚は、ターン終了時まで、このカードの本来のテキスト１つと同じテキストを得る。ただし同じテキストは得られない）",
                "title": [],
                "logicTreeActions": [
                    {
                        "actions": [
                            {
                                "title": "function _(ctx2, effect, { GameStateFn, DefineFn }) {\n                        const cardId = DefineFn.EffectFn.getCardID(effect), pairs = GameStateFn.getCardTipStrBaSyouPairs(ctx2, \"\\uFF3B \\uFF3D\\u306E\\u7279\\u5FB4\\u3092\\u6301\\u3064\\u81EA\\u8ECD\\u30E6\\u30CB\\u30C3\\u30C8\\uFF11\\u679A\\u306F\", cardId), textRefs = GameStateFn.getCardTipTextRefs(ctx2, \"\\u3053\\u306E\\u30AB\\u30FC\\u30C9\\u306E\\u672C\\u6765\\u306E\\u30C6\\u30AD\\u30B9\\u30C8\\uFF11\\u3064\", cardId), ges = GameStateFn.getGlobalEffects(ctx2, null);\n                        ctx2 = GameStateFn.setGlobalEffects(ctx2, null, ges);\n                        for (let pair2 of pairs) {\n                          GameStateFn.assertTargetMissingError(ctx2, pair2);\n                          const [targetCardId, targetBasyou] = pair2;\n                          ctx2 = GameStateFn.mapItemState(ctx2, targetCardId, (targetItemState) => {\n                            for (let textRef of textRefs) {\n                              if (GameStateFn.getCardTexts(ctx2, targetItemState.id, { ges }).find((text2) => text2.id == textRef.textId) != null)\n                                continue;\n                              targetItemState = DefineFn.ItemStateFn.setGlobalEffect(targetItemState, null, {\n                                title: [\"AddTextRef\", textRef],\n                                cardIds: [targetItemState.id]\n                              }, { isRemoveOnTurnEnd: !0 });\n                            }\n                            return targetItemState;\n                          });\n                        }\n                        return ctx2;\n                      }"
                            }
                        ]
                    }
                ]
            }
        },
        "addStackEffect_019294be-ce81-7003-a2e7-88ea2138cf44": {
            "id": "addStackEffect_019294be-ce81-7003-a2e7-88ea2138cf44",
            "description": "（戦闘フェイズ）〔２毎〕：このカードが戦闘エリアにいる場合、部隊１つの部隊戦闘力を、部隊解散まで＋２、または－２する。",
            "reason": [
                "PlayText",
                "PlayerA",
                "PlayerA_28",
                "loadPrototype_179019_02A_U_GN024U_green_text_0"
            ],
            "text": {
                "id": "loadPrototype_179019_02A_U_GN024U_green_text_0",
                "description": "（戦闘フェイズ）〔２毎〕：このカードが戦闘エリアにいる場合、部隊１つの部隊戦闘力を、部隊解散まで＋２、または－２する。",
                "title": [],
                "logicTreeActions": [
                    {
                        "actions": [
                            {
                                "title": "function _(ctx, effect, { DefineFn, GameStateFn }) {\n                                            const cardId = DefineFn.EffectFn.getCardID(effect);\n                                            const tip1 = GameStateFn.getItemState(ctx, cardId).tips[\"自軍部隊１つ\"];\n                                            if (tip1) {\n                                                const basyous = DefineFn.TipFn.getSelection(tip1);\n                                                if (basyous.length == 0) {\n                                                    throw new Error();\n                                                }\n                                                const targetIds = GameStateFn.getItemIdsByBasyou(ctx, basyous[0]);\n                                                if (targetIds.length == 0) {\n                                                    throw new DefineFn.TargetMissingError(\"\");\n                                                }\n                                                const targetId = targetIds[0];\n                                                ctx = GameStateFn.doItemSetGlobalEffectsUntilEndOfTurn(ctx, [{\n                                                        title: [\"このカードの部隊の部隊戦闘力を_＋３する\", 2],\n                                                        cardIds: [targetId]\n                                                    }], GameStateFn.createStrBaSyouPair(ctx, targetId));\n                                            }\n                                            const tip2 = GameStateFn.getItemState(ctx, cardId).tips[\"敵軍部隊１つ\"];\n                                            if (tip2) {\n                                                const basyous = DefineFn.TipFn.getSelection(tip1);\n                                                if (basyous.length == 0) {\n                                                    throw new Error();\n                                                }\n                                                const targetIds = GameStateFn.getItemIdsByBasyou(ctx, basyous[0]);\n                                                if (targetIds.length == 0) {\n                                                    throw new DefineFn.TargetMissingError(\"\");\n                                                }\n                                                const targetId = targetIds[0];\n                                                ctx = GameStateFn.doItemSetGlobalEffectsUntilEndOfTurn(ctx, [{\n                                                        title: [\"このカードの部隊の部隊戦闘力を_＋３する\", -2],\n                                                        cardIds: [targetId]\n                                                    }], GameStateFn.createStrBaSyouPair(ctx, targetId));\n                                            }\n                                            return ctx;\n                                        }"
                            }
                        ]
                    }
                ]
            }
        },
        "createPlayEffects_PlayerA_PlayerA_28_loadPrototype_179019_02A_U_GN024U_green_text_0": {
            "id": "createPlayEffects_PlayerA_PlayerA_28_loadPrototype_179019_02A_U_GN024U_green_text_0",
            "reason": [
                "PlayText",
                "PlayerA",
                "PlayerA_28",
                "loadPrototype_179019_02A_U_GN024U_green_text_0"
            ],
            "description": "（戦闘フェイズ）〔２毎〕：このカードが戦闘エリアにいる場合、部隊１つの部隊戦闘力を、部隊解散まで＋２、または－２する。",
            "text": {
                "id": "loadPrototype_179019_02A_U_GN024U_green_text_0",
                "description": "（戦闘フェイズ）〔２毎〕：このカードが戦闘エリアにいる場合、部隊１つの部隊戦闘力を、部隊解散まで＋２、または－２する。",
                "title": [
                    "使用型",
                    [
                        "戦闘フェイズ"
                    ]
                ],
                "testEnvs": [
                    {
                        "createCards": [
                            [
                                "自軍",
                                "戦闘エリア1",
                                [
                                    [
                                        "179019_02A_U_GN024U_green",
                                        1
                                    ]
                                ]
                            ],
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
                "isEachTime": true,
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
                    "このカードが戦闘エリアにいる場合": {
                        "actions": [
                            {
                                "title": [
                                    "このカードが_戦闘エリアにいる場合",
                                    [
                                        "戦闘エリア1",
                                        "戦闘エリア2"
                                    ]
                                ]
                            }
                        ]
                    },
                    "自軍部隊１つ": {
                        "title": [
                            "_交戦中の_敵軍部隊_１つ",
                            null,
                            "自軍",
                            1
                        ]
                    },
                    "敵軍部隊１つ": {
                        "title": [
                            "_交戦中の_敵軍部隊_１つ",
                            null,
                            "敵軍",
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
                        "logicTree": {
                            "type": "And",
                            "children": [
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
                                    "value": "このカードが戦闘エリアにいる場合"
                                },
                                {
                                    "type": "Or",
                                    "children": [
                                        {
                                            "type": "Leaf",
                                            "value": "自軍部隊１つ"
                                        },
                                        {
                                            "type": "Leaf",
                                            "value": "敵軍部隊１つ"
                                        }
                                    ]
                                }
                            ]
                        },
                        "actions": [
                            {
                                "title": [
                                    "cutIn",
                                    [
                                        {
                                            "title": "function _(ctx, effect, { DefineFn, GameStateFn }) {\n                                            const cardId = DefineFn.EffectFn.getCardID(effect);\n                                            const tip1 = GameStateFn.getItemState(ctx, cardId).tips[\"自軍部隊１つ\"];\n                                            if (tip1) {\n                                                const basyous = DefineFn.TipFn.getSelection(tip1);\n                                                if (basyous.length == 0) {\n                                                    throw new Error();\n                                                }\n                                                const targetIds = GameStateFn.getItemIdsByBasyou(ctx, basyous[0]);\n                                                if (targetIds.length == 0) {\n                                                    throw new DefineFn.TargetMissingError(\"\");\n                                                }\n                                                const targetId = targetIds[0];\n                                                ctx = GameStateFn.doItemSetGlobalEffectsUntilEndOfTurn(ctx, [{\n                                                        title: [\"このカードの部隊の部隊戦闘力を_＋３する\", 2],\n                                                        cardIds: [targetId]\n                                                    }], GameStateFn.createStrBaSyouPair(ctx, targetId));\n                                            }\n                                            const tip2 = GameStateFn.getItemState(ctx, cardId).tips[\"敵軍部隊１つ\"];\n                                            if (tip2) {\n                                                const basyous = DefineFn.TipFn.getSelection(tip1);\n                                                if (basyous.length == 0) {\n                                                    throw new Error();\n                                                }\n                                                const targetIds = GameStateFn.getItemIdsByBasyou(ctx, basyous[0]);\n                                                if (targetIds.length == 0) {\n                                                    throw new DefineFn.TargetMissingError(\"\");\n                                                }\n                                                const targetId = targetIds[0];\n                                                ctx = GameStateFn.doItemSetGlobalEffectsUntilEndOfTurn(ctx, [{\n                                                        title: [\"このカードの部隊の部隊戦闘力を_＋３する\", -2],\n                                                        cardIds: [targetId]\n                                                    }], GameStateFn.createStrBaSyouPair(ctx, targetId));\n                                            }\n                                            return ctx;\n                                        }"
                                        }
                                    ]
                                ]
                            }
                        ]
                    }
                ]
            }
        },
        "createPlayEffects_PlayerA_PlayerA_28_loadPrototype_179019_02A_U_GN024U_green_text_2": {
            "id": "createPlayEffects_PlayerA_PlayerA_28_loadPrototype_179019_02A_U_GN024U_green_text_2",
            "reason": [
                "PlayText",
                "PlayerA",
                "PlayerA_28",
                "loadPrototype_179019_02A_U_GN024U_green_text_2"
            ],
            "description": "打開自軍手裡或指定HANGER中特徵A並合計國力x以下的1張卡, 和這張卡重置狀態置換, 這張卡置換後廢棄. x為自軍G的張數",
            "text": {
                "id": "loadPrototype_179019_02A_U_GN024U_green_text_2",
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
                        "actions": [
                            {
                                "title": "function _(ctx2, effect, { GameStateFn, DefineFn }) {\n                    const newE = DefineFn.EffectFn.fromEffectBasic(effect, {\n                      logicTreeAction: {\n                        actions: [\n                          {\n                            title: function _(ctx3, effect2, { GameStateFn: GameStateFn2, DefineFn: DefineFn2 }) {\n                              const cardId = DefineFn2.EffectFn.getCardID(effect2), basyou = GameStateFn2.getItemBaSyou(ctx3, cardId), pairs = GameStateFn2.getCardTipStrBaSyouPairs(ctx3, \"\\u6253\\u958B\\u81EA\\u8ECD\\u624B\\u88E1\\u6216\\u6307\\u5B9AHANGER\\u4E2D\\u7279\\u5FB5A\\u4E26\\u5408\\u8A08\\u570B\\u529Bx\\u4EE5\\u4E0B\\u76841\\u5F35\\u5361\", cardId);\n                              if (pairs.length == 0)\n                                throw new Error(`pairs must not 0: ${effect2.text.description}`);\n                              const targetPair = pairs[0], ges = GameStateFn2.getGlobalEffects(ctx3, null);\n                              return ctx3 = GameStateFn2.setGlobalEffects(ctx3, null, ges), GameStateFn2.assertTargetMissingError(ctx3, targetPair), ctx3 = GameStateFn2.doItemSwap(ctx3, [cardId, basyou], targetPair), ctx3 = GameStateFn2.doItemSetRollState(ctx3, !1, [cardId, basyou], { isSkipTargetMissing: !0 }), ctx3 = GameStateFn2.doItemMove(ctx3, DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(basyou, \"\\u30B8\\u30E3\\u30F3\\u30AF\\u30E4\\u30FC\\u30C9\"), targetPair, { ges }), ctx3 = GameStateFn2.doTriggerEvent(ctx3, { title: [\"\\u300C\\u6539\\u88C5\\u300D\\u306E\\u52B9\\u679C\\u3067\\u5EC3\\u68C4\\u3055\\u308C\\u308B\\u5834\\u5408\"], cardIds: [targetPair[0]] }), ctx3 = GameStateFn2.doTriggerEvent(ctx3, { title: [\"\\u300C\\u6539\\u88C5\\u300D\\u306E\\u52B9\\u679C\\u3067\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId] }), ctx3;\n                            }.toString()\n                          }\n                        ]\n                      }\n                    });\n                    return ctx2 = GameStateFn.addStackEffect(ctx2, newE), ctx2;\n                  }"
                            }
                        ]
                    }
                ]
            }
        },
        "createPlayEffects_PlayerA_PlayerA_12_loadPrototype_179009_03B_U_GN037C_green_text_0": {
            "id": "createPlayEffects_PlayerA_PlayerA_12_loadPrototype_179009_03B_U_GN037C_green_text_0",
            "reason": [
                "PlayText",
                "PlayerA",
                "PlayerA_12",
                "loadPrototype_179009_03B_U_GN037C_green_text_0"
            ],
            "description": "（防御ステップ）〔１〕：このカードが戦闘エリアにいる場合、交戦中の敵軍部隊１つに３貫通ダメージを与える。自軍ユニットの「専用機のセット」が成立している場合、この効果のコストは〔０〕に変更される。",
            "text": {
                "id": "loadPrototype_179009_03B_U_GN037C_green_text_0",
                "description": "（防御ステップ）〔１〕：このカードが戦闘エリアにいる場合、交戦中の敵軍部隊１つに３貫通ダメージを与える。自軍ユニットの「専用機のセット」が成立している場合、この効果のコストは〔０〕に変更される。",
                "title": [
                    "使用型",
                    [
                        "防御ステップ"
                    ]
                ],
                "testEnvs": [
                    {
                        "createCards": [
                            [
                                "自軍",
                                "戦闘エリア1",
                                [
                                    [
                                        "179009_03B_U_GN037C_green",
                                        1
                                    ]
                                ]
                            ],
                            [
                                "自軍",
                                "Gゾーン",
                                [
                                    [
                                        "unit",
                                        1
                                    ]
                                ]
                            ],
                            [
                                "自軍",
                                "戦闘エリア2",
                                [
                                    [
                                        "unit",
                                        1
                                    ]
                                ]
                            ],
                            [
                                "敵軍",
                                "戦闘エリア2",
                                [
                                    [
                                        "unit",
                                        1
                                    ]
                                ]
                            ]
                        ]
                    },
                    {
                        "addCards": [
                            [
                                "自軍",
                                "配備エリア",
                                [
                                    {
                                        "id": "char",
                                        "protoID": "179901_CG_CH_GN001P_green"
                                    },
                                    {
                                        "id": "unit",
                                        "protoID": "179901_00_U_GN002P_green_02"
                                    }
                                ]
                            ]
                        ],
                        "createCards": [
                            [
                                "自軍",
                                "戦闘エリア1",
                                [
                                    [
                                        "179009_03B_U_GN037C_green",
                                        1
                                    ]
                                ]
                            ],
                            [
                                "自軍",
                                "戦闘エリア2",
                                [
                                    [
                                        "unit",
                                        1
                                    ]
                                ]
                            ],
                            [
                                "敵軍",
                                "戦闘エリア2",
                                [
                                    [
                                        "unit",
                                        1
                                    ]
                                ]
                            ]
                        ],
                        "setGroupParent": {
                            "char": "unit"
                        }
                    }
                ],
                "conditions": {
                    "自軍ユニットの「専用機のセット」が成立している場合": {
                        "actions": [
                            {
                                "title": [
                                    "Entity",
                                    {
                                        "side": "自軍",
                                        "isMaster": true,
                                        "min": 1
                                    }
                                ]
                            }
                        ]
                    },
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
                    "このカードが戦闘エリアにいる場合": {
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
                    "交戦中の敵軍部隊１つ": {
                        "title": [
                            "_交戦中の_敵軍部隊_１つ",
                            true,
                            "敵軍",
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
                        "logicTree": {
                            "type": "Or",
                            "children": [
                                {
                                    "type": "And",
                                    "children": [
                                        {
                                            "type": "Leaf",
                                            "value": "0[null]"
                                        },
                                        {
                                            "type": "Leaf",
                                            "value": "このカードが戦闘エリアにいる場合"
                                        },
                                        {
                                            "type": "Leaf",
                                            "value": "交戦中の敵軍部隊１つ"
                                        }
                                    ]
                                },
                                {
                                    "type": "And",
                                    "children": [
                                        {
                                            "type": "Leaf",
                                            "value": "自軍ユニットの「専用機のセット」が成立している場合"
                                        },
                                        {
                                            "type": "Leaf",
                                            "value": "このカードが戦闘エリアにいる場合"
                                        },
                                        {
                                            "type": "Leaf",
                                            "value": "交戦中の敵軍部隊１つ"
                                        }
                                    ]
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
                                                "_１貫通ダメージを与える",
                                                3
                                            ],
                                            "vars": [
                                                "交戦中の敵軍部隊１つ"
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
        "createPlayEffects_PlayerA_PlayerA_12_loadPrototype_179009_03B_U_GN037C_green_text_2": {
            "id": "createPlayEffects_PlayerA_PlayerA_12_loadPrototype_179009_03B_U_GN037C_green_text_2",
            "reason": [
                "PlayText",
                "PlayerA",
                "PlayerA_12",
                "loadPrototype_179009_03B_U_GN037C_green_text_2"
            ],
            "description": "（戦闘フェイズ）：［ ］の特徴を持つ自軍ユニット１枚は、ターン終了時まで、このカードの本来のテキスト１つと同じテキストを得る。ただし同じテキストは得られない）",
            "text": {
                "id": "loadPrototype_179009_03B_U_GN037C_green_text_2",
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
                            "撃墜王",
                            "自軍",
                            "ユニット",
                            1
                        ],
                        "exceptItemSelf": true,
                        "actions": [
                            {
                                "title": "function _(ctx2, effect, { GameStateFn, DefineFn }) {\n                    const cardId = DefineFn.EffectFn.getCardID(effect), pairs = GameStateFn.getCardTipStrBaSyouPairs(ctx2, \"\\uFF3B \\uFF3D\\u306E\\u7279\\u5FB4\\u3092\\u6301\\u3064\\u81EA\\u8ECD\\u30E6\\u30CB\\u30C3\\u30C8\\uFF11\\u679A\\u306F\", cardId), textRefIds = GameStateFn.getCardTipTextRefs(ctx2, \"\\u3053\\u306E\\u30AB\\u30FC\\u30C9\\u306E\\u672C\\u6765\\u306E\\u30C6\\u30AD\\u30B9\\u30C8\\uFF11\\u3064\", cardId).map((tr) => tr.textId), ges = GameStateFn.getGlobalEffects(ctx2, null);\n                    ctx2 = GameStateFn.setGlobalEffects(ctx2, null, ges);\n                    for (let pair2 of pairs)\n                      if (GameStateFn.getCardTexts(ctx2, pair2[0], { ges }).find((text2) => textRefIds.includes(text2.id)))\n                        throw new DefineFn.TipError(`\\u5DF2\\u6709\\u540C\\u6A23\\u7684\\u5167\\u6587: ${JSON.stringify(textRefIds)}`, { hasSameText: !0 });\n                    return ctx2;\n                  }"
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
                                            "title": "function _(ctx2, effect, { GameStateFn, DefineFn }) {\n                        const cardId = DefineFn.EffectFn.getCardID(effect), pairs = GameStateFn.getCardTipStrBaSyouPairs(ctx2, \"\\uFF3B \\uFF3D\\u306E\\u7279\\u5FB4\\u3092\\u6301\\u3064\\u81EA\\u8ECD\\u30E6\\u30CB\\u30C3\\u30C8\\uFF11\\u679A\\u306F\", cardId), textRefs = GameStateFn.getCardTipTextRefs(ctx2, \"\\u3053\\u306E\\u30AB\\u30FC\\u30C9\\u306E\\u672C\\u6765\\u306E\\u30C6\\u30AD\\u30B9\\u30C8\\uFF11\\u3064\", cardId), ges = GameStateFn.getGlobalEffects(ctx2, null);\n                        ctx2 = GameStateFn.setGlobalEffects(ctx2, null, ges);\n                        for (let pair2 of pairs) {\n                          GameStateFn.assertTargetMissingError(ctx2, pair2);\n                          const [targetCardId, targetBasyou] = pair2;\n                          ctx2 = GameStateFn.mapItemState(ctx2, targetCardId, (targetItemState) => {\n                            for (let textRef of textRefs) {\n                              if (GameStateFn.getCardTexts(ctx2, targetItemState.id, { ges }).find((text2) => text2.id == textRef.textId) != null)\n                                continue;\n                              targetItemState = DefineFn.ItemStateFn.setGlobalEffect(targetItemState, null, {\n                                title: [\"AddTextRef\", textRef],\n                                cardIds: [targetItemState.id]\n                              }, { isRemoveOnTurnEnd: !0 });\n                            }\n                            return targetItemState;\n                          });\n                        }\n                        return ctx2;\n                      }"
                                        }
                                    ]
                                ]
                            }
                        ]
                    }
                ]
            }
        },
        "createPlayCommandText_PlayerB_61": {
            "id": "createPlayCommandText_PlayerB_61",
            "reason": [
                "PlayCard",
                "PlayerB",
                "PlayerB_61",
                {
                    "isPlayCommand": true
                }
            ],
            "description": "Play 歴史の立会人",
            "text": {
                "id": "179019_02A_C_BK015S_black_text_command",
                "title": [
                    "使用型",
                    [
                        "自軍",
                        "戦闘フェイズ"
                    ]
                ],
                "description": "Play 歴史の立会人",
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
                    "橫置支付0[黒]": {
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
                                    "橫置支付0[黒]"
                                ]
                            }
                        ],
                        "groupKey": "支付橫置國力"
                    },
                    "G以外の、セットカードがセットされていない敵軍カード１枚": {
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
                                "hasSetCard": false,
                                "side": "敵軍",
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
                                    "value": "橫置支付0[黒]"
                                },
                                {
                                    "type": "Leaf",
                                    "value": "G以外の、セットカードがセットされていない敵軍カード１枚"
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
        "createPlayEffects_PlayerB_PlayerB_72_loadPrototype_179015_04B_U_BK059C_black_text_2": {
            "id": "createPlayEffects_PlayerB_PlayerB_72_loadPrototype_179015_04B_U_BK059C_black_text_2",
            "reason": [
                "PlayText",
                "PlayerB",
                "PlayerB_72",
                "loadPrototype_179015_04B_U_BK059C_black_text_2"
            ],
            "description": "打開自軍手裡或指定HANGER中特徵A並合計國力x以下的1張卡, 和這張卡重置狀態置換, 這張卡置換後廢棄. x為自軍G的張數",
            "text": {
                "id": "loadPrototype_179015_04B_U_BK059C_black_text_2",
                "title": [
                    "使用型",
                    [
                        "戦闘フェイズ"
                    ]
                ],
                "description": "打開自軍手裡或指定HANGER中特徵A並合計國力x以下的1張卡, 和這張卡重置狀態置換, 這張卡置換後廢棄. x為自軍G的張數",
                "conditions": {
                    "打開自軍手裡或指定HANGER中特徵A並合計國力x以下的1張卡": {
                        "title": "function _(ctx2, effect, bridge) {\n                const { A: A2 } = {\"A\":\"ヘイズル系\"};\n                if (A2 == \"\")\n                  throw new Error(\"A\\u6C92\\u6709\\u88AB\\u5B57\\u4E32\\u7F6E\\u63DB\");\n                const { GameStateFn, DefineFn } = bridge, cardId = DefineFn.EffectFn.getCardID(effect), cardController = GameStateFn.getItemController(ctx2, cardId), gCount = GameStateFn.getItemIdsByBasyou(ctx2, DefineFn.AbsoluteBaSyouFn.of(cardController, \"G\\u30BE\\u30FC\\u30F3\")).length;\n                return GameStateFn.createConditionTitleFn({\n                  title: [\"\\u6253\\u958B\\u81EA\\u8ECD\\u624B\\u88E1\\u6216\\u6307\\u5B9AHANGER\\u4E2D\\u7279\\u5FB5_A\\u4E26\\u5408\\u8A08\\u570B\\u529B_x\\u4EE5\\u4E0B\\u7684_1\\u5F35\\u5361\", A2, gCount, 1]\n                })(ctx2, effect, bridge);\n              }"
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
                                "title": "function _(ctx2, effect, { GameStateFn, DefineFn }) {\n                    const newE = DefineFn.EffectFn.fromEffectBasic(effect, {\n                      logicTreeAction: {\n                        actions: [\n                          {\n                            title: function _(ctx3, effect2, { GameStateFn: GameStateFn2, DefineFn: DefineFn2 }) {\n                              const cardId = DefineFn2.EffectFn.getCardID(effect2), basyou = GameStateFn2.getItemBaSyou(ctx3, cardId), pairs = GameStateFn2.getCardTipStrBaSyouPairs(ctx3, \"\\u6253\\u958B\\u81EA\\u8ECD\\u624B\\u88E1\\u6216\\u6307\\u5B9AHANGER\\u4E2D\\u7279\\u5FB5A\\u4E26\\u5408\\u8A08\\u570B\\u529Bx\\u4EE5\\u4E0B\\u76841\\u5F35\\u5361\", cardId);\n                              if (pairs.length == 0)\n                                throw new Error(`pairs must not 0: ${effect2.text.description}`);\n                              const targetPair = pairs[0], ges = GameStateFn2.getGlobalEffects(ctx3, null);\n                              return ctx3 = GameStateFn2.setGlobalEffects(ctx3, null, ges), GameStateFn2.assertTargetMissingError(ctx3, targetPair), ctx3 = GameStateFn2.doItemSwap(ctx3, [cardId, basyou], targetPair), ctx3 = GameStateFn2.doItemSetRollState(ctx3, !1, [cardId, basyou], { isSkipTargetMissing: !0 }), ctx3 = GameStateFn2.doItemMove(ctx3, DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(basyou, \"\\u30B8\\u30E3\\u30F3\\u30AF\\u30E4\\u30FC\\u30C9\"), targetPair, { ges }), ctx3 = GameStateFn2.doTriggerEvent(ctx3, { title: [\"\\u300C\\u6539\\u88C5\\u300D\\u306E\\u52B9\\u679C\\u3067\\u5EC3\\u68C4\\u3055\\u308C\\u308B\\u5834\\u5408\"], cardIds: [targetPair[0]] }), ctx3 = GameStateFn2.doTriggerEvent(ctx3, { title: [\"\\u300C\\u6539\\u88C5\\u300D\\u306E\\u52B9\\u679C\\u3067\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId] }), ctx3;\n                            }.toString()\n                          }\n                        ]\n                      }\n                    });\n                    return ctx2 = GameStateFn.addStackEffect(ctx2, newE), ctx2;\n                  }"
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
                                "title": [
                                    "同回合上限",
                                    1
                                ]
                            }
                        ]
                    }
                }
            }
        },
        "createPlayEffects_PlayerB_PlayerB_78_loadPrototype_179024_B2B_U_BK129R_black_text_2": {
            "id": "createPlayEffects_PlayerB_PlayerB_78_loadPrototype_179024_B2B_U_BK129R_black_text_2",
            "reason": [
                "PlayText",
                "PlayerB",
                "PlayerB_78",
                "loadPrototype_179024_B2B_U_BK129R_black_text_2"
            ],
            "description": "打開自軍手裡或指定HANGER中特徵A並合計國力x以下的1張卡, 和這張卡重置狀態置換, 這張卡置換後廢棄. x為自軍G的張數",
            "text": {
                "id": "loadPrototype_179024_B2B_U_BK129R_black_text_2",
                "title": [
                    "使用型",
                    [
                        "戦闘フェイズ"
                    ]
                ],
                "description": "打開自軍手裡或指定HANGER中特徵A並合計國力x以下的1張卡, 和這張卡重置狀態置換, 這張卡置換後廢棄. x為自軍G的張數",
                "conditions": {
                    "打開自軍手裡或指定HANGER中特徵A並合計國力x以下的1張卡": {
                        "title": "function _(ctx2, effect, bridge) {\n                const { A: A2 } = {\"A\":\"ファイバー系\"};\n                if (A2 == \"\")\n                  throw new Error(\"A\\u6C92\\u6709\\u88AB\\u5B57\\u4E32\\u7F6E\\u63DB\");\n                const { GameStateFn, DefineFn } = bridge, cardId = DefineFn.EffectFn.getCardID(effect), cardController = GameStateFn.getItemController(ctx2, cardId), gCount = GameStateFn.getItemIdsByBasyou(ctx2, DefineFn.AbsoluteBaSyouFn.of(cardController, \"G\\u30BE\\u30FC\\u30F3\")).length;\n                return GameStateFn.createConditionTitleFn({\n                  title: [\"\\u6253\\u958B\\u81EA\\u8ECD\\u624B\\u88E1\\u6216\\u6307\\u5B9AHANGER\\u4E2D\\u7279\\u5FB5_A\\u4E26\\u5408\\u8A08\\u570B\\u529B_x\\u4EE5\\u4E0B\\u7684_1\\u5F35\\u5361\", A2, gCount, 1]\n                })(ctx2, effect, bridge);\n              }"
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
                                "title": "function _(ctx2, effect, { GameStateFn, DefineFn }) {\n                    const newE = DefineFn.EffectFn.fromEffectBasic(effect, {\n                      logicTreeAction: {\n                        actions: [\n                          {\n                            title: function _(ctx3, effect2, { GameStateFn: GameStateFn2, DefineFn: DefineFn2 }) {\n                              const cardId = DefineFn2.EffectFn.getCardID(effect2), basyou = GameStateFn2.getItemBaSyou(ctx3, cardId), pairs = GameStateFn2.getCardTipStrBaSyouPairs(ctx3, \"\\u6253\\u958B\\u81EA\\u8ECD\\u624B\\u88E1\\u6216\\u6307\\u5B9AHANGER\\u4E2D\\u7279\\u5FB5A\\u4E26\\u5408\\u8A08\\u570B\\u529Bx\\u4EE5\\u4E0B\\u76841\\u5F35\\u5361\", cardId);\n                              if (pairs.length == 0)\n                                throw new Error(`pairs must not 0: ${effect2.text.description}`);\n                              const targetPair = pairs[0], ges = GameStateFn2.getGlobalEffects(ctx3, null);\n                              return ctx3 = GameStateFn2.setGlobalEffects(ctx3, null, ges), GameStateFn2.assertTargetMissingError(ctx3, targetPair), ctx3 = GameStateFn2.doItemSwap(ctx3, [cardId, basyou], targetPair), ctx3 = GameStateFn2.doItemSetRollState(ctx3, !1, [cardId, basyou], { isSkipTargetMissing: !0 }), ctx3 = GameStateFn2.doItemMove(ctx3, DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(basyou, \"\\u30B8\\u30E3\\u30F3\\u30AF\\u30E4\\u30FC\\u30C9\"), targetPair, { ges }), ctx3 = GameStateFn2.doTriggerEvent(ctx3, { title: [\"\\u300C\\u6539\\u88C5\\u300D\\u306E\\u52B9\\u679C\\u3067\\u5EC3\\u68C4\\u3055\\u308C\\u308B\\u5834\\u5408\"], cardIds: [targetPair[0]] }), ctx3 = GameStateFn2.doTriggerEvent(ctx3, { title: [\"\\u300C\\u6539\\u88C5\\u300D\\u306E\\u52B9\\u679C\\u3067\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId] }), ctx3;\n                            }.toString()\n                          }\n                        ]\n                      }\n                    });\n                    return ctx2 = GameStateFn.addStackEffect(ctx2, newE), ctx2;\n                  }"
                            }
                        ]
                    }
                ]
            }
        },
        "createPlayEffects_PlayerB_PlayerB_78_loadPrototype_179024_B2B_U_BK129R_black_text_3": {
            "id": "createPlayEffects_PlayerB_PlayerB_78_loadPrototype_179024_B2B_U_BK129R_black_text_3",
            "reason": [
                "PlayText",
                "PlayerB",
                "PlayerB_78",
                "loadPrototype_179024_B2B_U_BK129R_black_text_3"
            ],
            "description": "（戦闘フェイズ）：［ ］の特徴を持つ自軍ユニット１枚は、ターン終了時まで、このカードの本来のテキスト１つと同じテキストを得る。ただし同じテキストは得られない）",
            "text": {
                "id": "loadPrototype_179024_B2B_U_BK129R_black_text_3",
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
                            "T3部隊",
                            "自軍",
                            "ユニット",
                            1
                        ],
                        "exceptItemSelf": true,
                        "actions": [
                            {
                                "title": "function _(ctx2, effect, { GameStateFn, DefineFn }) {\n                    const cardId = DefineFn.EffectFn.getCardID(effect), pairs = GameStateFn.getCardTipStrBaSyouPairs(ctx2, \"\\uFF3B \\uFF3D\\u306E\\u7279\\u5FB4\\u3092\\u6301\\u3064\\u81EA\\u8ECD\\u30E6\\u30CB\\u30C3\\u30C8\\uFF11\\u679A\\u306F\", cardId), textRefIds = GameStateFn.getCardTipTextRefs(ctx2, \"\\u3053\\u306E\\u30AB\\u30FC\\u30C9\\u306E\\u672C\\u6765\\u306E\\u30C6\\u30AD\\u30B9\\u30C8\\uFF11\\u3064\", cardId).map((tr) => tr.textId), ges = GameStateFn.getGlobalEffects(ctx2, null);\n                    ctx2 = GameStateFn.setGlobalEffects(ctx2, null, ges);\n                    for (let pair2 of pairs)\n                      if (GameStateFn.getCardTexts(ctx2, pair2[0], { ges }).find((text2) => textRefIds.includes(text2.id)))\n                        throw new DefineFn.TipError(`\\u5DF2\\u6709\\u540C\\u6A23\\u7684\\u5167\\u6587: ${JSON.stringify(textRefIds)}`, { hasSameText: !0 });\n                    return ctx2;\n                  }"
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
                                            "title": "function _(ctx2, effect, { GameStateFn, DefineFn }) {\n                        const cardId = DefineFn.EffectFn.getCardID(effect), pairs = GameStateFn.getCardTipStrBaSyouPairs(ctx2, \"\\uFF3B \\uFF3D\\u306E\\u7279\\u5FB4\\u3092\\u6301\\u3064\\u81EA\\u8ECD\\u30E6\\u30CB\\u30C3\\u30C8\\uFF11\\u679A\\u306F\", cardId), textRefs = GameStateFn.getCardTipTextRefs(ctx2, \"\\u3053\\u306E\\u30AB\\u30FC\\u30C9\\u306E\\u672C\\u6765\\u306E\\u30C6\\u30AD\\u30B9\\u30C8\\uFF11\\u3064\", cardId), ges = GameStateFn.getGlobalEffects(ctx2, null);\n                        ctx2 = GameStateFn.setGlobalEffects(ctx2, null, ges);\n                        for (let pair2 of pairs) {\n                          GameStateFn.assertTargetMissingError(ctx2, pair2);\n                          const [targetCardId, targetBasyou] = pair2;\n                          ctx2 = GameStateFn.mapItemState(ctx2, targetCardId, (targetItemState) => {\n                            for (let textRef of textRefs) {\n                              if (GameStateFn.getCardTexts(ctx2, targetItemState.id, { ges }).find((text2) => text2.id == textRef.textId) != null)\n                                continue;\n                              targetItemState = DefineFn.ItemStateFn.setGlobalEffect(targetItemState, null, {\n                                title: [\"AddTextRef\", textRef],\n                                cardIds: [targetItemState.id]\n                              }, { isRemoveOnTurnEnd: !0 });\n                            }\n                            return targetItemState;\n                          });\n                        }\n                        return ctx2;\n                      }"
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
                "PlayerA_37",
                "PlayerA_23",
                "PlayerA_33",
                "PlayerA_36",
                "PlayerA_14",
                "PlayerA_27",
                "PlayerA_25",
                "PlayerA_39",
                "PlayerA_4",
                "PlayerA_49",
                "PlayerA_7",
                "PlayerA_8",
                "PlayerA_43",
                "PlayerA_29",
                "PlayerA_45",
                "PlayerA_13",
                "PlayerA_10",
                "PlayerA_42",
                "PlayerA_24",
                "PlayerA_31",
                "PlayerA_6",
                "PlayerA_16",
                "PlayerA_48",
                "PlayerA_35",
                "PlayerA_18",
                "PlayerA_1",
                "PlayerA_21",
                "PlayerA_46",
                "PlayerA_32",
                "PlayerA_5",
                "PlayerA_26",
                "PlayerA_9",
                "PlayerA_41",
                "PlayerA_38",
                "PlayerA_47",
                "PlayerA_15",
                "PlayerA_11",
                "PlayerA_30",
                "PlayerA_2"
            ],
            "[\"PlayerB\",\"本国\"]": [
                "PlayerB_93",
                "PlayerB_64",
                "PlayerB_77",
                "PlayerB_62",
                "PlayerB_56",
                "PlayerB_76",
                "PlayerB_75",
                "PlayerB_88",
                "PlayerB_57",
                "PlayerB_66",
                "PlayerB_52",
                "PlayerB_81",
                "PlayerB_95",
                "PlayerB_63",
                "PlayerB_84",
                "PlayerB_83",
                "PlayerB_90",
                "PlayerB_51",
                "PlayerB_96",
                "PlayerB_65",
                "PlayerB_54",
                "PlayerB_87",
                "PlayerB_74",
                "PlayerB_69",
                "PlayerB_68",
                "PlayerB_73",
                "PlayerB_91",
                "PlayerB_97",
                "PlayerB_99",
                "PlayerB_86",
                "PlayerB_80"
            ],
            "[\"PlayerA\",\"手札\"]": [
                "PlayerA_0",
                "PlayerA_17"
            ],
            "[\"PlayerB\",\"手札\"]": [
                "PlayerB_61",
                "PlayerB_67"
            ],
            "[\"PlayerA\",\"Gゾーン\"]": [
                "PlayerA_20",
                "PlayerA_40",
                "PlayerA_22",
                "PlayerA_19",
                "PlayerA_44"
            ],
            "[\"PlayerB\",\"Gゾーン\"]": [
                "PlayerB_70",
                "PlayerB_71",
                "PlayerB_85",
                "PlayerB_53",
                "PlayerB_50"
            ],
            "[\"PlayerA\",\"プレイされているカード\"]": [],
            "[\"PlayerA\",\"配備エリア\"]": [
                "PlayerA_12"
            ],
            "[\"PlayerA\",\"戦闘エリア1\"]": [
                "PlayerA_28",
                "PlayerA_34"
            ],
            "[\"PlayerB\",\"捨て山\"]": [
                "PlayerB_79",
                "PlayerB_58",
                "PlayerB_92",
                "PlayerB_89",
                "PlayerB_98",
                "PlayerB_59"
            ],
            "[\"PlayerB\",\"プレイされているカード\"]": [],
            "[\"PlayerB\",\"配備エリア\"]": [
                "PlayerB_82",
                "PlayerB_78"
            ],
            "[\"PlayerB\",\"ジャンクヤード\"]": [
                "PlayerB_60",
                "PlayerB_55"
            ],
            "[\"PlayerA\",\"ジャンクヤード\"]": [
                "PlayerA_3"
            ],
            "[\"PlayerB\",\"戦闘エリア1\"]": [
                "PlayerB_72",
                "PlayerB_94"
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
                                "PlayerB_94",
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
                        [
                            [
                                "PlayerB_94",
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
                "去地球": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerA_28",
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
                                "PlayerA_28",
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
                                "PlayerA_28",
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
        "PlayerA_28": {
            "id": "PlayerA_28",
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
                                "PlayerA_40",
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
                                "PlayerA_40",
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
                                "PlayerA_40",
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
                },
                "0[null]": {
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
                                "PlayerA_19",
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
                "1[null]": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerA_19",
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
                                "PlayerA_19",
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
        "PlayerB_94": {
            "id": "PlayerB_94",
            "damage": 0,
            "destroyReason": null,
            "flags": {},
            "tips": {
                "橫置支付0[黒]": {
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
                                "PlayerB_71",
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
                                "PlayerB_71",
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
                },
                "自軍ユニット１枚": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerB_94",
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
                                "PlayerB_94",
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
            "isAttack": true,
            "isDefence": false
        },
        "PlayerA_34": {
            "id": "PlayerA_34",
            "damage": 0,
            "destroyReason": null,
            "flags": {},
            "tips": {
                "一個自軍機體": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerA_28",
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
                                "PlayerA_28",
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
                                "PlayerA_40",
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
                                "PlayerA_19",
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
                                "PlayerA_40",
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
                                "PlayerA_19",
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
        "PlayerB_72": {
            "id": "PlayerB_72",
            "damage": 0,
            "destroyReason": null,
            "flags": {},
            "tips": {},
            "globalEffects": {},
            "varNamesRemoveOnTurnEnd": {},
            "isOpenForGain": false,
            "isCheat": false,
            "isFirstTurn": false,
            "textIdsUseThisTurn": [],
            "isAttack": true,
            "isDefence": false
        },
        "PlayerB_60": {
            "id": "PlayerB_60",
            "damage": 0,
            "destroyReason": null,
            "flags": {},
            "tips": {
                "G以外の、セットカードがセットされていない敵軍カード１枚": {
                    "title": [
                        "カード",
                        [
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
                                "PlayerA_3",
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
                "橫置支付0[黒]": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerB_71",
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
                                "PlayerB_53",
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
                                "PlayerB_71",
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
                                "PlayerB_71",
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
                                "PlayerB_53",
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
        "PlayerA_12": {
            "id": "PlayerA_12",
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
                                "PlayerA_40",
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
                                "PlayerA_19",
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
                                "PlayerA_40",
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
                                "PlayerA_19",
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
                                "PlayerA_40",
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
                                "PlayerA_19",
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
            "isOpenForGain": false,
            "isCheat": false,
            "textIdsUseThisTurn": [],
            "isAttack": false,
            "isDefence": false
        },
        "PlayerB_55": {
            "id": "PlayerB_55",
            "damage": 0,
            "destroyReason": null,
            "flags": {},
            "tips": {
                "橫置支付0[黒]": {
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
                                "PlayerB_71",
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
                                "PlayerB_53",
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
                                "PlayerB_71",
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
                                "PlayerB_53",
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
                                "PlayerB_55",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "本国"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_77",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "本国"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_62",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "本国"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_56",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "本国"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_76",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "本国"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_57",
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
                            ],
                            [
                                "PlayerB_63",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "本国"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_54",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "本国"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_73",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "本国"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_79",
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
                                "PlayerB_78",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "手札"
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
                            ]
                        ],
                        [
                            [
                                "PlayerB_55",
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
                    "count": 1
                },
                "0[黒]": {
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
                                "PlayerB_53",
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
                "打開自軍手裡或指定HANGER中特徵A並合計國力x以下的1張卡": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerB_55",
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
                                "PlayerB_55",
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
            "isOpenForGain": false,
            "isCheat": false,
            "textIdsUseThisTurn": [],
            "isAttack": false,
            "isDefence": false
        },
        "PlayerB_78": {
            "id": "PlayerB_78",
            "damage": 0,
            "destroyReason": null,
            "flags": {},
            "tips": {
                "橫置支付1[黒]": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerB_71",
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
                                "PlayerB_53",
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
                                "PlayerB_71",
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
                "橫置支付0[黒]": {
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
                                "PlayerB_71",
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
                                "PlayerB_53",
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
                                "PlayerB_71",
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
                                "PlayerB_53",
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
                },
                "［ ］の特徴を持つ自軍ユニット１枚は": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerB_72",
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
                                "PlayerB_72",
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
                "このカードの本来のテキスト１つ": {
                    "title": [
                        "テキスト",
                        [
                            {
                                "cardId": "PlayerB_78",
                                "textId": "loadPrototype_179024_B2B_U_BK129R_black_text_0"
                            },
                            {
                                "cardId": "PlayerB_78",
                                "textId": "loadPrototype_179024_B2B_U_BK129R_black_text_1"
                            },
                            {
                                "cardId": "PlayerB_78",
                                "textId": "loadPrototype_179024_B2B_U_BK129R_black_text_2"
                            }
                        ],
                        [
                            {
                                "cardId": "PlayerB_78",
                                "textId": "loadPrototype_179024_B2B_U_BK129R_black_text_0"
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
                                "PlayerB_53",
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
                                "PlayerB_53",
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
                }
            },
            "globalEffects": {},
            "varNamesRemoveOnTurnEnd": {},
            "isFirstTurn": true,
            "textIdsUseThisTurn": [
                "loadPrototype_179024_B2B_U_BK129R_black_text_3"
            ]
        },
        "PlayerB_82": {
            "id": "PlayerB_82",
            "damage": 0,
            "destroyReason": null,
            "flags": {},
            "tips": {
                "橫置支付0[黒]": {
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
                                "PlayerB_53",
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
                                "PlayerB_53",
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
            "isFirstTurn": true
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
        "addStackEffect_019294be-ce81-7003-a2e7-88ea2138cf44",
        "addStackEffect_019294be-406b-7003-a239-a54b5931451f"
    ],
    "destroyEffect": [],
    "commandEffects": [
        "createPlayEffects_PlayerA_PlayerA_28_loadPrototype_179019_02A_U_GN024U_green_text_0",
        "createPlayEffects_PlayerA_PlayerA_28_loadPrototype_179019_02A_U_GN024U_green_text_2",
        "createPlayEffects_PlayerA_PlayerA_12_loadPrototype_179009_03B_U_GN037C_green_text_0",
        "createPlayEffects_PlayerA_PlayerA_12_loadPrototype_179009_03B_U_GN037C_green_text_2",
        "createPlayCommandText_PlayerB_61",
        "createPlayEffects_PlayerB_PlayerB_72_loadPrototype_179015_04B_U_BK059C_black_text_2",
        "createPlayEffects_PlayerB_PlayerB_82_loadPrototype_179027_09D_O_BK010N_black_text_1",
        "createPlayEffects_PlayerB_PlayerB_78_loadPrototype_179024_B2B_U_BK129R_black_text_2",
        "createPlayEffects_PlayerB_PlayerB_78_loadPrototype_179024_B2B_U_BK129R_black_text_3"
    ],
    "commandEffectTips": [
        {
            "effectId": "createPlayEffects_PlayerA_PlayerA_28_loadPrototype_179019_02A_U_GN024U_green_text_0",
            "conditionKeys": [
                "0[null]",
                "1[null]",
                "このカードが戦闘エリアにいる場合",
                "自軍部隊１つ"
            ],
            "logicID": 0,
            "logicSubID": 0,
            "tipOrErrors": [
                {
                    "effectId": "createPlayEffects_PlayerA_PlayerA_28_loadPrototype_179019_02A_U_GN024U_green_text_0",
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
                    "effectId": "createPlayEffects_PlayerA_PlayerA_28_loadPrototype_179019_02A_U_GN024U_green_text_0",
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
                        "cardId: PlayerA_28 target not set yet: 1[null]"
                    ]
                },
                {
                    "effectId": "createPlayEffects_PlayerA_PlayerA_28_loadPrototype_179019_02A_U_GN024U_green_text_0",
                    "conditionKey": "このカードが戦闘エリアにいる場合",
                    "tip": null,
                    "errors": []
                },
                {
                    "effectId": "createPlayEffects_PlayerA_PlayerA_28_loadPrototype_179019_02A_U_GN024U_green_text_0",
                    "conditionKey": "自軍部隊１つ",
                    "tip": {
                        "title": [
                            "BaSyou",
                            [
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "戦闘エリア1"
                                    ]
                                }
                            ],
                            [
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
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
            "effectId": "createPlayEffects_PlayerA_PlayerA_28_loadPrototype_179019_02A_U_GN024U_green_text_0",
            "conditionKeys": [
                "0[null]",
                "1[null]",
                "このカードが戦闘エリアにいる場合",
                "敵軍部隊１つ"
            ],
            "logicID": 0,
            "logicSubID": 1,
            "tipOrErrors": [
                {
                    "effectId": "createPlayEffects_PlayerA_PlayerA_28_loadPrototype_179019_02A_U_GN024U_green_text_0",
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
                    "effectId": "createPlayEffects_PlayerA_PlayerA_28_loadPrototype_179019_02A_U_GN024U_green_text_0",
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
                        "cardId: PlayerA_28 target not set yet: 1[null]"
                    ]
                },
                {
                    "effectId": "createPlayEffects_PlayerA_PlayerA_28_loadPrototype_179019_02A_U_GN024U_green_text_0",
                    "conditionKey": "このカードが戦闘エリアにいる場合",
                    "tip": null,
                    "errors": []
                },
                {
                    "effectId": "createPlayEffects_PlayerA_PlayerA_28_loadPrototype_179019_02A_U_GN024U_green_text_0",
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
            "effectId": "createPlayEffects_PlayerA_PlayerA_28_loadPrototype_179019_02A_U_GN024U_green_text_2",
            "conditionKeys": [
                "打開自軍手裡或指定HANGER中特徵A並合計國力x以下的1張卡",
                "同回合上限"
            ],
            "logicID": 0,
            "logicSubID": 0,
            "tipOrErrors": [
                {
                    "effectId": "createPlayEffects_PlayerA_PlayerA_28_loadPrototype_179019_02A_U_GN024U_green_text_2",
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
                    "effectId": "createPlayEffects_PlayerA_PlayerA_28_loadPrototype_179019_02A_U_GN024U_green_text_2",
                    "conditionKey": "同回合上限",
                    "tip": null,
                    "errors": []
                }
            ]
        },
        {
            "effectId": "createPlayEffects_PlayerA_PlayerA_12_loadPrototype_179009_03B_U_GN037C_green_text_0",
            "conditionKeys": [
                "0[null]",
                "このカードが戦闘エリアにいる場合",
                "交戦中の敵軍部隊１つ"
            ],
            "logicID": 0,
            "logicSubID": 0,
            "tipOrErrors": [
                {
                    "effectId": "createPlayEffects_PlayerA_PlayerA_12_loadPrototype_179009_03B_U_GN037C_green_text_0",
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
                    "effectId": "createPlayEffects_PlayerA_PlayerA_12_loadPrototype_179009_03B_U_GN037C_green_text_0",
                    "conditionKey": "このカードが戦闘エリアにいる場合",
                    "tip": null,
                    "errors": [
                        "count 0 not right: カード/1"
                    ]
                },
                {
                    "effectId": "createPlayEffects_PlayerA_PlayerA_12_loadPrototype_179009_03B_U_GN037C_green_text_0",
                    "conditionKey": "交戦中の敵軍部隊１つ",
                    "tip": {
                        "title": [
                            "BaSyou",
                            [],
                            []
                        ],
                        "count": 1
                    },
                    "errors": [
                        "count 0 not right: BaSyou/1"
                    ]
                }
            ]
        },
        {
            "effectId": "createPlayEffects_PlayerA_PlayerA_12_loadPrototype_179009_03B_U_GN037C_green_text_0",
            "conditionKeys": [
                "自軍ユニットの「専用機のセット」が成立している場合",
                "このカードが戦闘エリアにいる場合",
                "交戦中の敵軍部隊１つ"
            ],
            "logicID": 0,
            "logicSubID": 1,
            "tipOrErrors": [
                {
                    "effectId": "createPlayEffects_PlayerA_PlayerA_12_loadPrototype_179009_03B_U_GN037C_green_text_0",
                    "conditionKey": "自軍ユニットの「専用機のセット」が成立している場合",
                    "tip": null,
                    "errors": [
                        "min 0 not right: カード/1"
                    ]
                },
                {
                    "effectId": "createPlayEffects_PlayerA_PlayerA_12_loadPrototype_179009_03B_U_GN037C_green_text_0",
                    "conditionKey": "このカードが戦闘エリアにいる場合",
                    "tip": null,
                    "errors": [
                        "count 0 not right: カード/1"
                    ]
                },
                {
                    "effectId": "createPlayEffects_PlayerA_PlayerA_12_loadPrototype_179009_03B_U_GN037C_green_text_0",
                    "conditionKey": "交戦中の敵軍部隊１つ",
                    "tip": {
                        "title": [
                            "BaSyou",
                            [],
                            []
                        ],
                        "count": 1
                    },
                    "errors": [
                        "count 0 not right: BaSyou/1"
                    ]
                }
            ]
        },
        {
            "effectId": "createPlayEffects_PlayerA_PlayerA_12_loadPrototype_179009_03B_U_GN037C_green_text_2",
            "conditionKeys": [
                "橫置支付0[null]",
                "このカードの本来のテキスト１つ",
                "［ ］の特徴を持つ自軍ユニット１枚は",
                "同回合上限"
            ],
            "logicID": 0,
            "logicSubID": 0,
            "tipOrErrors": [
                {
                    "effectId": "createPlayEffects_PlayerA_PlayerA_12_loadPrototype_179009_03B_U_GN037C_green_text_2",
                    "conditionKey": "橫置支付0[null]",
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
                    "effectId": "createPlayEffects_PlayerA_PlayerA_12_loadPrototype_179009_03B_U_GN037C_green_text_2",
                    "conditionKey": "このカードの本来のテキスト１つ",
                    "tip": {
                        "title": [
                            "テキスト",
                            [
                                {
                                    "cardId": "PlayerA_12",
                                    "textId": "loadPrototype_179009_03B_U_GN037C_green_text_0"
                                },
                                {
                                    "cardId": "PlayerA_12",
                                    "textId": "loadPrototype_179009_03B_U_GN037C_green_text_1"
                                }
                            ],
                            [
                                {
                                    "cardId": "PlayerA_12",
                                    "textId": "loadPrototype_179009_03B_U_GN037C_green_text_0"
                                }
                            ]
                        ],
                        "count": 1
                    },
                    "errors": []
                },
                {
                    "effectId": "createPlayEffects_PlayerA_PlayerA_12_loadPrototype_179009_03B_U_GN037C_green_text_2",
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
                        "cardId: PlayerA_12 target not set yet: ［ ］の特徴を持つ自軍ユニット１枚は"
                    ]
                },
                {
                    "effectId": "createPlayEffects_PlayerA_PlayerA_12_loadPrototype_179009_03B_U_GN037C_green_text_2",
                    "conditionKey": "同回合上限",
                    "tip": null,
                    "errors": []
                }
            ]
        },
        {
            "effectId": "createPlayCommandText_PlayerB_61",
            "conditionKeys": [
                "合計国力〔x〕",
                "橫置支付0[黒]",
                "G以外の、セットカードがセットされていない敵軍カード１枚"
            ],
            "logicID": 0,
            "logicSubID": 0,
            "tipOrErrors": [
                {
                    "effectId": "createPlayCommandText_PlayerB_61",
                    "conditionKey": "合計国力〔x〕",
                    "tip": null,
                    "errors": [
                        "合計国力〔x〕:0 < 3. Play 歴史の立会人"
                    ]
                },
                {
                    "effectId": "createPlayCommandText_PlayerB_61",
                    "conditionKey": "橫置支付0[黒]",
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
                        "cardId: PlayerB_61 target not set yet: 橫置支付0[黒]"
                    ]
                },
                {
                    "effectId": "createPlayCommandText_PlayerB_61",
                    "conditionKey": "G以外の、セットカードがセットされていない敵軍カード１枚",
                    "tip": {
                        "title": [
                            "カード",
                            [
                                [
                                    "PlayerA_12",
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
                                    "PlayerA_12",
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
                }
            ]
        },
        {
            "effectId": "createPlayEffects_PlayerB_PlayerB_72_loadPrototype_179015_04B_U_BK059C_black_text_2",
            "conditionKeys": [
                "打開自軍手裡或指定HANGER中特徵A並合計國力x以下的1張卡",
                "同回合上限"
            ],
            "logicID": 0,
            "logicSubID": 0,
            "tipOrErrors": [
                {
                    "effectId": "createPlayEffects_PlayerB_PlayerB_72_loadPrototype_179015_04B_U_BK059C_black_text_2",
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
                    "effectId": "createPlayEffects_PlayerB_PlayerB_72_loadPrototype_179015_04B_U_BK059C_black_text_2",
                    "conditionKey": "同回合上限",
                    "tip": null,
                    "errors": []
                }
            ]
        },
        {
            "effectId": "createPlayEffects_PlayerB_PlayerB_78_loadPrototype_179024_B2B_U_BK129R_black_text_2",
            "conditionKeys": [
                "打開自軍手裡或指定HANGER中特徵A並合計國力x以下的1張卡",
                "同回合上限"
            ],
            "logicID": 0,
            "logicSubID": 0,
            "tipOrErrors": [
                {
                    "effectId": "createPlayEffects_PlayerB_PlayerB_78_loadPrototype_179024_B2B_U_BK129R_black_text_2",
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
                    "effectId": "createPlayEffects_PlayerB_PlayerB_78_loadPrototype_179024_B2B_U_BK129R_black_text_2",
                    "conditionKey": "同回合上限",
                    "tip": null,
                    "errors": []
                }
            ]
        },
        {
            "effectId": "createPlayEffects_PlayerB_PlayerB_78_loadPrototype_179024_B2B_U_BK129R_black_text_3",
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
                    "effectId": "createPlayEffects_PlayerB_PlayerB_78_loadPrototype_179024_B2B_U_BK129R_black_text_3",
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
                        "cardId: PlayerB_78 target not set yet: 橫置支付0[null]"
                    ]
                },
                {
                    "effectId": "createPlayEffects_PlayerB_PlayerB_78_loadPrototype_179024_B2B_U_BK129R_black_text_3",
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
                        "cardId: PlayerB_78 target not set yet: 橫置支付1[null]"
                    ]
                },
                {
                    "effectId": "createPlayEffects_PlayerB_PlayerB_78_loadPrototype_179024_B2B_U_BK129R_black_text_3",
                    "conditionKey": "このカードの本来のテキスト１つ",
                    "tip": {
                        "title": [
                            "テキスト",
                            [
                                {
                                    "cardId": "PlayerB_78",
                                    "textId": "loadPrototype_179024_B2B_U_BK129R_black_text_0"
                                },
                                {
                                    "cardId": "PlayerB_78",
                                    "textId": "loadPrototype_179024_B2B_U_BK129R_black_text_1"
                                },
                                {
                                    "cardId": "PlayerB_78",
                                    "textId": "loadPrototype_179024_B2B_U_BK129R_black_text_2"
                                }
                            ],
                            [
                                {
                                    "cardId": "PlayerB_78",
                                    "textId": "loadPrototype_179024_B2B_U_BK129R_black_text_0"
                                }
                            ]
                        ],
                        "count": 1
                    },
                    "errors": []
                },
                {
                    "effectId": "createPlayEffects_PlayerB_PlayerB_78_loadPrototype_179024_B2B_U_BK129R_black_text_3",
                    "conditionKey": "［ ］の特徴を持つ自軍ユニット１枚は",
                    "tip": {
                        "title": [
                            "カード",
                            [
                                [
                                    "PlayerB_72",
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
                                    "PlayerB_72",
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
                    "effectId": "createPlayEffects_PlayerB_PlayerB_78_loadPrototype_179024_B2B_U_BK129R_black_text_3",
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
        "[\"PlayerA\",\"戦闘エリア1\"]": false,
        "[\"PlayerB\",\"戦闘エリア1\"]": false,
        "[\"PlayerA\",\"戦闘エリア2\"]": false,
        "[\"PlayerB\",\"戦闘エリア2\"]": false
    },
    "coins": {
        "coin_019294ba-f6c7-7003-8dc0-1256570109ad": {
            "id": "coin_019294ba-f6c7-7003-8dc0-1256570109ad",
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
        "coin_019294ba-f6c7-7003-8dc0-18d6c021e950": {
            "id": "coin_019294ba-f6c7-7003-8dc0-18d6c021e950",
            "title": [
                "BattleBonus",
                [
                    0,
                    0,
                    -1
                ]
            ],
            "ownerID": "PlayerB"
        }
    },
    "coinId2cardId": {
        "coin_019294ba-f6c7-7003-8dc0-1256570109ad": "PlayerB_94",
        "coin_019294ba-f6c7-7003-8dc0-18d6c021e950": "PlayerB_94"
    },
    "globalEffectPool": {
        "null": [
            {
                "title": [
                    "3以下の合計国力を持つ敵軍コマンドの効果では無効にならない"
                ],
                "cardIds": [
                    "PlayerB_60"
                ]
            },
            {
                "title": [
                    "3以下の合計国力を持つ敵軍コマンドの効果では無効にならない"
                ],
                "cardIds": [
                    "PlayerB_61"
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
                    "PlayerA_44"
                ]
            }
        ]
    },
    "messageTopId": 1087,
    "messages": [
        {
            "id": 1086,
            "description": "onEffectEnd: （戦闘フェイズ）〔２毎〕：このカードが戦闘エリアにいる場合、部隊１つの部隊戦闘力を、部隊解散まで＋２、または－２する。"
        },
        {
            "id": 1085,
            "description": "PlayerA_19.isRoll false => true",
            "effect": {
                "id": "createPlayEffects_PlayerA_PlayerA_28_loadPrototype_179019_02A_U_GN024U_green_text_0",
                "reason": [
                    "PlayText",
                    "PlayerA",
                    "PlayerA_28",
                    "loadPrototype_179019_02A_U_GN024U_green_text_0"
                ],
                "description": "（戦闘フェイズ）〔２毎〕：このカードが戦闘エリアにいる場合、部隊１つの部隊戦闘力を、部隊解散まで＋２、または－２する。",
                "text": {
                    "id": "loadPrototype_179019_02A_U_GN024U_green_text_0",
                    "description": "（戦闘フェイズ）〔２毎〕：このカードが戦闘エリアにいる場合、部隊１つの部隊戦闘力を、部隊解散まで＋２、または－２する。",
                    "title": [
                        "使用型",
                        [
                            "戦闘フェイズ"
                        ]
                    ],
                    "testEnvs": [
                        {
                            "createCards": [
                                [
                                    "自軍",
                                    "戦闘エリア1",
                                    [
                                        [
                                            "179019_02A_U_GN024U_green",
                                            1
                                        ]
                                    ]
                                ],
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
                    "isEachTime": true,
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
                        "このカードが戦闘エリアにいる場合": {
                            "actions": [
                                {
                                    "title": [
                                        "このカードが_戦闘エリアにいる場合",
                                        [
                                            "戦闘エリア1",
                                            "戦闘エリア2"
                                        ]
                                    ]
                                }
                            ]
                        },
                        "自軍部隊１つ": {
                            "title": [
                                "_交戦中の_敵軍部隊_１つ",
                                null,
                                "自軍",
                                1
                            ]
                        },
                        "敵軍部隊１つ": {
                            "title": [
                                "_交戦中の_敵軍部隊_１つ",
                                null,
                                "敵軍",
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
                            "logicTree": {
                                "type": "And",
                                "children": [
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
                                        "value": "このカードが戦闘エリアにいる場合"
                                    },
                                    {
                                        "type": "Or",
                                        "children": [
                                            {
                                                "type": "Leaf",
                                                "value": "自軍部隊１つ"
                                            },
                                            {
                                                "type": "Leaf",
                                                "value": "敵軍部隊１つ"
                                            }
                                        ]
                                    }
                                ]
                            },
                            "actions": [
                                {
                                    "title": [
                                        "cutIn",
                                        [
                                            {
                                                "title": "function _(ctx, effect, { DefineFn, GameStateFn }) {\n                                            const cardId = DefineFn.EffectFn.getCardID(effect);\n                                            const tip1 = GameStateFn.getItemState(ctx, cardId).tips[\"自軍部隊１つ\"];\n                                            if (tip1) {\n                                                const basyous = DefineFn.TipFn.getSelection(tip1);\n                                                if (basyous.length == 0) {\n                                                    throw new Error();\n                                                }\n                                                const targetIds = GameStateFn.getItemIdsByBasyou(ctx, basyous[0]);\n                                                if (targetIds.length == 0) {\n                                                    throw new DefineFn.TargetMissingError(\"\");\n                                                }\n                                                const targetId = targetIds[0];\n                                                ctx = GameStateFn.doItemSetGlobalEffectsUntilEndOfTurn(ctx, [{\n                                                        title: [\"このカードの部隊の部隊戦闘力を_＋３する\", 2],\n                                                        cardIds: [targetId]\n                                                    }], GameStateFn.createStrBaSyouPair(ctx, targetId));\n                                            }\n                                            const tip2 = GameStateFn.getItemState(ctx, cardId).tips[\"敵軍部隊１つ\"];\n                                            if (tip2) {\n                                                const basyous = DefineFn.TipFn.getSelection(tip1);\n                                                if (basyous.length == 0) {\n                                                    throw new Error();\n                                                }\n                                                const targetIds = GameStateFn.getItemIdsByBasyou(ctx, basyous[0]);\n                                                if (targetIds.length == 0) {\n                                                    throw new DefineFn.TargetMissingError(\"\");\n                                                }\n                                                const targetId = targetIds[0];\n                                                ctx = GameStateFn.doItemSetGlobalEffectsUntilEndOfTurn(ctx, [{\n                                                        title: [\"このカードの部隊の部隊戦闘力を_＋３する\", -2],\n                                                        cardIds: [targetId]\n                                                    }], GameStateFn.createStrBaSyouPair(ctx, targetId));\n                                            }\n                                            return ctx;\n                                        }"
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
            "id": 1084,
            "description": "PlayerA_22.isRoll false => true",
            "effect": {
                "id": "createPlayEffects_PlayerA_PlayerA_28_loadPrototype_179019_02A_U_GN024U_green_text_0",
                "reason": [
                    "PlayText",
                    "PlayerA",
                    "PlayerA_28",
                    "loadPrototype_179019_02A_U_GN024U_green_text_0"
                ],
                "description": "（戦闘フェイズ）〔２毎〕：このカードが戦闘エリアにいる場合、部隊１つの部隊戦闘力を、部隊解散まで＋２、または－２する。",
                "text": {
                    "id": "loadPrototype_179019_02A_U_GN024U_green_text_0",
                    "description": "（戦闘フェイズ）〔２毎〕：このカードが戦闘エリアにいる場合、部隊１つの部隊戦闘力を、部隊解散まで＋２、または－２する。",
                    "title": [
                        "使用型",
                        [
                            "戦闘フェイズ"
                        ]
                    ],
                    "testEnvs": [
                        {
                            "createCards": [
                                [
                                    "自軍",
                                    "戦闘エリア1",
                                    [
                                        [
                                            "179019_02A_U_GN024U_green",
                                            1
                                        ]
                                    ]
                                ],
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
                    "isEachTime": true,
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
                        "このカードが戦闘エリアにいる場合": {
                            "actions": [
                                {
                                    "title": [
                                        "このカードが_戦闘エリアにいる場合",
                                        [
                                            "戦闘エリア1",
                                            "戦闘エリア2"
                                        ]
                                    ]
                                }
                            ]
                        },
                        "自軍部隊１つ": {
                            "title": [
                                "_交戦中の_敵軍部隊_１つ",
                                null,
                                "自軍",
                                1
                            ]
                        },
                        "敵軍部隊１つ": {
                            "title": [
                                "_交戦中の_敵軍部隊_１つ",
                                null,
                                "敵軍",
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
                            "logicTree": {
                                "type": "And",
                                "children": [
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
                                        "value": "このカードが戦闘エリアにいる場合"
                                    },
                                    {
                                        "type": "Or",
                                        "children": [
                                            {
                                                "type": "Leaf",
                                                "value": "自軍部隊１つ"
                                            },
                                            {
                                                "type": "Leaf",
                                                "value": "敵軍部隊１つ"
                                            }
                                        ]
                                    }
                                ]
                            },
                            "actions": [
                                {
                                    "title": [
                                        "cutIn",
                                        [
                                            {
                                                "title": "function _(ctx, effect, { DefineFn, GameStateFn }) {\n                                            const cardId = DefineFn.EffectFn.getCardID(effect);\n                                            const tip1 = GameStateFn.getItemState(ctx, cardId).tips[\"自軍部隊１つ\"];\n                                            if (tip1) {\n                                                const basyous = DefineFn.TipFn.getSelection(tip1);\n                                                if (basyous.length == 0) {\n                                                    throw new Error();\n                                                }\n                                                const targetIds = GameStateFn.getItemIdsByBasyou(ctx, basyous[0]);\n                                                if (targetIds.length == 0) {\n                                                    throw new DefineFn.TargetMissingError(\"\");\n                                                }\n                                                const targetId = targetIds[0];\n                                                ctx = GameStateFn.doItemSetGlobalEffectsUntilEndOfTurn(ctx, [{\n                                                        title: [\"このカードの部隊の部隊戦闘力を_＋３する\", 2],\n                                                        cardIds: [targetId]\n                                                    }], GameStateFn.createStrBaSyouPair(ctx, targetId));\n                                            }\n                                            const tip2 = GameStateFn.getItemState(ctx, cardId).tips[\"敵軍部隊１つ\"];\n                                            if (tip2) {\n                                                const basyous = DefineFn.TipFn.getSelection(tip1);\n                                                if (basyous.length == 0) {\n                                                    throw new Error();\n                                                }\n                                                const targetIds = GameStateFn.getItemIdsByBasyou(ctx, basyous[0]);\n                                                if (targetIds.length == 0) {\n                                                    throw new DefineFn.TargetMissingError(\"\");\n                                                }\n                                                const targetId = targetIds[0];\n                                                ctx = GameStateFn.doItemSetGlobalEffectsUntilEndOfTurn(ctx, [{\n                                                        title: [\"このカードの部隊の部隊戦闘力を_＋３する\", -2],\n                                                        cardIds: [targetId]\n                                                    }], GameStateFn.createStrBaSyouPair(ctx, targetId));\n                                            }\n                                            return ctx;\n                                        }"
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
            "id": 1083,
            "description": "onEffectStart: （戦闘フェイズ）〔２毎〕：このカードが戦闘エリアにいる場合、部隊１つの部隊戦闘力を、部隊解散まで＋２、または－２する。",
            "effect": {
                "id": "createPlayEffects_PlayerA_PlayerA_28_loadPrototype_179019_02A_U_GN024U_green_text_0",
                "reason": [
                    "PlayText",
                    "PlayerA",
                    "PlayerA_28",
                    "loadPrototype_179019_02A_U_GN024U_green_text_0"
                ],
                "description": "（戦闘フェイズ）〔２毎〕：このカードが戦闘エリアにいる場合、部隊１つの部隊戦闘力を、部隊解散まで＋２、または－２する。",
                "text": {
                    "id": "loadPrototype_179019_02A_U_GN024U_green_text_0",
                    "description": "（戦闘フェイズ）〔２毎〕：このカードが戦闘エリアにいる場合、部隊１つの部隊戦闘力を、部隊解散まで＋２、または－２する。",
                    "title": [
                        "使用型",
                        [
                            "戦闘フェイズ"
                        ]
                    ],
                    "testEnvs": [
                        {
                            "createCards": [
                                [
                                    "自軍",
                                    "戦闘エリア1",
                                    [
                                        [
                                            "179019_02A_U_GN024U_green",
                                            1
                                        ]
                                    ]
                                ],
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
                    "isEachTime": true,
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
                        "このカードが戦闘エリアにいる場合": {
                            "actions": [
                                {
                                    "title": [
                                        "このカードが_戦闘エリアにいる場合",
                                        [
                                            "戦闘エリア1",
                                            "戦闘エリア2"
                                        ]
                                    ]
                                }
                            ]
                        },
                        "自軍部隊１つ": {
                            "title": [
                                "_交戦中の_敵軍部隊_１つ",
                                null,
                                "自軍",
                                1
                            ]
                        },
                        "敵軍部隊１つ": {
                            "title": [
                                "_交戦中の_敵軍部隊_１つ",
                                null,
                                "敵軍",
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
                            "logicTree": {
                                "type": "And",
                                "children": [
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
                                        "value": "このカードが戦闘エリアにいる場合"
                                    },
                                    {
                                        "type": "Or",
                                        "children": [
                                            {
                                                "type": "Leaf",
                                                "value": "自軍部隊１つ"
                                            },
                                            {
                                                "type": "Leaf",
                                                "value": "敵軍部隊１つ"
                                            }
                                        ]
                                    }
                                ]
                            },
                            "actions": [
                                {
                                    "title": [
                                        "cutIn",
                                        [
                                            {
                                                "title": "function _(ctx, effect, { DefineFn, GameStateFn }) {\n                                            const cardId = DefineFn.EffectFn.getCardID(effect);\n                                            const tip1 = GameStateFn.getItemState(ctx, cardId).tips[\"自軍部隊１つ\"];\n                                            if (tip1) {\n                                                const basyous = DefineFn.TipFn.getSelection(tip1);\n                                                if (basyous.length == 0) {\n                                                    throw new Error();\n                                                }\n                                                const targetIds = GameStateFn.getItemIdsByBasyou(ctx, basyous[0]);\n                                                if (targetIds.length == 0) {\n                                                    throw new DefineFn.TargetMissingError(\"\");\n                                                }\n                                                const targetId = targetIds[0];\n                                                ctx = GameStateFn.doItemSetGlobalEffectsUntilEndOfTurn(ctx, [{\n                                                        title: [\"このカードの部隊の部隊戦闘力を_＋３する\", 2],\n                                                        cardIds: [targetId]\n                                                    }], GameStateFn.createStrBaSyouPair(ctx, targetId));\n                                            }\n                                            const tip2 = GameStateFn.getItemState(ctx, cardId).tips[\"敵軍部隊１つ\"];\n                                            if (tip2) {\n                                                const basyous = DefineFn.TipFn.getSelection(tip1);\n                                                if (basyous.length == 0) {\n                                                    throw new Error();\n                                                }\n                                                const targetIds = GameStateFn.getItemIdsByBasyou(ctx, basyous[0]);\n                                                if (targetIds.length == 0) {\n                                                    throw new DefineFn.TargetMissingError(\"\");\n                                                }\n                                                const targetId = targetIds[0];\n                                                ctx = GameStateFn.doItemSetGlobalEffectsUntilEndOfTurn(ctx, [{\n                                                        title: [\"このカードの部隊の部隊戦闘力を_＋３する\", -2],\n                                                        cardIds: [targetId]\n                                                    }], GameStateFn.createStrBaSyouPair(ctx, targetId));\n                                            }\n                                            return ctx;\n                                        }"
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
            "id": 1082,
            "description": "onEffectEnd: （戦闘フェイズ）：［ ］の特徴を持つ自軍ユニット１枚は、ターン終了時まで、このカードの本来のテキスト１つと同じテキストを得る。ただし同じテキストは得られない）"
        },
        {
            "id": 1081,
            "description": "PlayerB_50.isRoll false => true",
            "effect": {
                "id": "createPlayEffects_PlayerB_PlayerB_78_loadPrototype_179024_B2B_U_BK129R_black_text_3",
                "reason": [
                    "PlayText",
                    "PlayerB",
                    "PlayerB_78",
                    "loadPrototype_179024_B2B_U_BK129R_black_text_3"
                ],
                "description": "（戦闘フェイズ）：［ ］の特徴を持つ自軍ユニット１枚は、ターン終了時まで、このカードの本来のテキスト１つと同じテキストを得る。ただし同じテキストは得られない）",
                "text": {
                    "id": "loadPrototype_179024_B2B_U_BK129R_black_text_3",
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
                                "T3部隊",
                                "自軍",
                                "ユニット",
                                1
                            ],
                            "exceptItemSelf": true,
                            "actions": [
                                {
                                    "title": "function _(ctx2, effect, { GameStateFn, DefineFn }) {\n                    const cardId = DefineFn.EffectFn.getCardID(effect), pairs = GameStateFn.getCardTipStrBaSyouPairs(ctx2, \"\\uFF3B \\uFF3D\\u306E\\u7279\\u5FB4\\u3092\\u6301\\u3064\\u81EA\\u8ECD\\u30E6\\u30CB\\u30C3\\u30C8\\uFF11\\u679A\\u306F\", cardId), textRefIds = GameStateFn.getCardTipTextRefs(ctx2, \"\\u3053\\u306E\\u30AB\\u30FC\\u30C9\\u306E\\u672C\\u6765\\u306E\\u30C6\\u30AD\\u30B9\\u30C8\\uFF11\\u3064\", cardId).map((tr) => tr.textId), ges = GameStateFn.getGlobalEffects(ctx2, null);\n                    ctx2 = GameStateFn.setGlobalEffects(ctx2, null, ges);\n                    for (let pair2 of pairs)\n                      if (GameStateFn.getCardTexts(ctx2, pair2[0], { ges }).find((text2) => textRefIds.includes(text2.id)))\n                        throw new DefineFn.TipError(`\\u5DF2\\u6709\\u540C\\u6A23\\u7684\\u5167\\u6587: ${JSON.stringify(textRefIds)}`, { hasSameText: !0 });\n                    return ctx2;\n                  }"
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
                                                "title": "function _(ctx2, effect, { GameStateFn, DefineFn }) {\n                        const cardId = DefineFn.EffectFn.getCardID(effect), pairs = GameStateFn.getCardTipStrBaSyouPairs(ctx2, \"\\uFF3B \\uFF3D\\u306E\\u7279\\u5FB4\\u3092\\u6301\\u3064\\u81EA\\u8ECD\\u30E6\\u30CB\\u30C3\\u30C8\\uFF11\\u679A\\u306F\", cardId), textRefs = GameStateFn.getCardTipTextRefs(ctx2, \"\\u3053\\u306E\\u30AB\\u30FC\\u30C9\\u306E\\u672C\\u6765\\u306E\\u30C6\\u30AD\\u30B9\\u30C8\\uFF11\\u3064\", cardId), ges = GameStateFn.getGlobalEffects(ctx2, null);\n                        ctx2 = GameStateFn.setGlobalEffects(ctx2, null, ges);\n                        for (let pair2 of pairs) {\n                          GameStateFn.assertTargetMissingError(ctx2, pair2);\n                          const [targetCardId, targetBasyou] = pair2;\n                          ctx2 = GameStateFn.mapItemState(ctx2, targetCardId, (targetItemState) => {\n                            for (let textRef of textRefs) {\n                              if (GameStateFn.getCardTexts(ctx2, targetItemState.id, { ges }).find((text2) => text2.id == textRef.textId) != null)\n                                continue;\n                              targetItemState = DefineFn.ItemStateFn.setGlobalEffect(targetItemState, null, {\n                                title: [\"AddTextRef\", textRef],\n                                cardIds: [targetItemState.id]\n                              }, { isRemoveOnTurnEnd: !0 });\n                            }\n                            return targetItemState;\n                          });\n                        }\n                        return ctx2;\n                      }"
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
            "id": 1080,
            "description": "PlayerB_53.isRoll false => true",
            "effect": {
                "id": "createPlayEffects_PlayerB_PlayerB_78_loadPrototype_179024_B2B_U_BK129R_black_text_3",
                "reason": [
                    "PlayText",
                    "PlayerB",
                    "PlayerB_78",
                    "loadPrototype_179024_B2B_U_BK129R_black_text_3"
                ],
                "description": "（戦闘フェイズ）：［ ］の特徴を持つ自軍ユニット１枚は、ターン終了時まで、このカードの本来のテキスト１つと同じテキストを得る。ただし同じテキストは得られない）",
                "text": {
                    "id": "loadPrototype_179024_B2B_U_BK129R_black_text_3",
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
                                "T3部隊",
                                "自軍",
                                "ユニット",
                                1
                            ],
                            "exceptItemSelf": true,
                            "actions": [
                                {
                                    "title": "function _(ctx2, effect, { GameStateFn, DefineFn }) {\n                    const cardId = DefineFn.EffectFn.getCardID(effect), pairs = GameStateFn.getCardTipStrBaSyouPairs(ctx2, \"\\uFF3B \\uFF3D\\u306E\\u7279\\u5FB4\\u3092\\u6301\\u3064\\u81EA\\u8ECD\\u30E6\\u30CB\\u30C3\\u30C8\\uFF11\\u679A\\u306F\", cardId), textRefIds = GameStateFn.getCardTipTextRefs(ctx2, \"\\u3053\\u306E\\u30AB\\u30FC\\u30C9\\u306E\\u672C\\u6765\\u306E\\u30C6\\u30AD\\u30B9\\u30C8\\uFF11\\u3064\", cardId).map((tr) => tr.textId), ges = GameStateFn.getGlobalEffects(ctx2, null);\n                    ctx2 = GameStateFn.setGlobalEffects(ctx2, null, ges);\n                    for (let pair2 of pairs)\n                      if (GameStateFn.getCardTexts(ctx2, pair2[0], { ges }).find((text2) => textRefIds.includes(text2.id)))\n                        throw new DefineFn.TipError(`\\u5DF2\\u6709\\u540C\\u6A23\\u7684\\u5167\\u6587: ${JSON.stringify(textRefIds)}`, { hasSameText: !0 });\n                    return ctx2;\n                  }"
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
                                                "title": "function _(ctx2, effect, { GameStateFn, DefineFn }) {\n                        const cardId = DefineFn.EffectFn.getCardID(effect), pairs = GameStateFn.getCardTipStrBaSyouPairs(ctx2, \"\\uFF3B \\uFF3D\\u306E\\u7279\\u5FB4\\u3092\\u6301\\u3064\\u81EA\\u8ECD\\u30E6\\u30CB\\u30C3\\u30C8\\uFF11\\u679A\\u306F\", cardId), textRefs = GameStateFn.getCardTipTextRefs(ctx2, \"\\u3053\\u306E\\u30AB\\u30FC\\u30C9\\u306E\\u672C\\u6765\\u306E\\u30C6\\u30AD\\u30B9\\u30C8\\uFF11\\u3064\", cardId), ges = GameStateFn.getGlobalEffects(ctx2, null);\n                        ctx2 = GameStateFn.setGlobalEffects(ctx2, null, ges);\n                        for (let pair2 of pairs) {\n                          GameStateFn.assertTargetMissingError(ctx2, pair2);\n                          const [targetCardId, targetBasyou] = pair2;\n                          ctx2 = GameStateFn.mapItemState(ctx2, targetCardId, (targetItemState) => {\n                            for (let textRef of textRefs) {\n                              if (GameStateFn.getCardTexts(ctx2, targetItemState.id, { ges }).find((text2) => text2.id == textRef.textId) != null)\n                                continue;\n                              targetItemState = DefineFn.ItemStateFn.setGlobalEffect(targetItemState, null, {\n                                title: [\"AddTextRef\", textRef],\n                                cardIds: [targetItemState.id]\n                              }, { isRemoveOnTurnEnd: !0 });\n                            }\n                            return targetItemState;\n                          });\n                        }\n                        return ctx2;\n                      }"
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
            "id": 1079,
            "description": "onEffectStart: （戦闘フェイズ）：［ ］の特徴を持つ自軍ユニット１枚は、ターン終了時まで、このカードの本来のテキスト１つと同じテキストを得る。ただし同じテキストは得られない）",
            "effect": {
                "id": "createPlayEffects_PlayerB_PlayerB_78_loadPrototype_179024_B2B_U_BK129R_black_text_3",
                "reason": [
                    "PlayText",
                    "PlayerB",
                    "PlayerB_78",
                    "loadPrototype_179024_B2B_U_BK129R_black_text_3"
                ],
                "description": "（戦闘フェイズ）：［ ］の特徴を持つ自軍ユニット１枚は、ターン終了時まで、このカードの本来のテキスト１つと同じテキストを得る。ただし同じテキストは得られない）",
                "text": {
                    "id": "loadPrototype_179024_B2B_U_BK129R_black_text_3",
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
                                "T3部隊",
                                "自軍",
                                "ユニット",
                                1
                            ],
                            "exceptItemSelf": true,
                            "actions": [
                                {
                                    "title": "function _(ctx2, effect, { GameStateFn, DefineFn }) {\n                    const cardId = DefineFn.EffectFn.getCardID(effect), pairs = GameStateFn.getCardTipStrBaSyouPairs(ctx2, \"\\uFF3B \\uFF3D\\u306E\\u7279\\u5FB4\\u3092\\u6301\\u3064\\u81EA\\u8ECD\\u30E6\\u30CB\\u30C3\\u30C8\\uFF11\\u679A\\u306F\", cardId), textRefIds = GameStateFn.getCardTipTextRefs(ctx2, \"\\u3053\\u306E\\u30AB\\u30FC\\u30C9\\u306E\\u672C\\u6765\\u306E\\u30C6\\u30AD\\u30B9\\u30C8\\uFF11\\u3064\", cardId).map((tr) => tr.textId), ges = GameStateFn.getGlobalEffects(ctx2, null);\n                    ctx2 = GameStateFn.setGlobalEffects(ctx2, null, ges);\n                    for (let pair2 of pairs)\n                      if (GameStateFn.getCardTexts(ctx2, pair2[0], { ges }).find((text2) => textRefIds.includes(text2.id)))\n                        throw new DefineFn.TipError(`\\u5DF2\\u6709\\u540C\\u6A23\\u7684\\u5167\\u6587: ${JSON.stringify(textRefIds)}`, { hasSameText: !0 });\n                    return ctx2;\n                  }"
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
                                                "title": "function _(ctx2, effect, { GameStateFn, DefineFn }) {\n                        const cardId = DefineFn.EffectFn.getCardID(effect), pairs = GameStateFn.getCardTipStrBaSyouPairs(ctx2, \"\\uFF3B \\uFF3D\\u306E\\u7279\\u5FB4\\u3092\\u6301\\u3064\\u81EA\\u8ECD\\u30E6\\u30CB\\u30C3\\u30C8\\uFF11\\u679A\\u306F\", cardId), textRefs = GameStateFn.getCardTipTextRefs(ctx2, \"\\u3053\\u306E\\u30AB\\u30FC\\u30C9\\u306E\\u672C\\u6765\\u306E\\u30C6\\u30AD\\u30B9\\u30C8\\uFF11\\u3064\", cardId), ges = GameStateFn.getGlobalEffects(ctx2, null);\n                        ctx2 = GameStateFn.setGlobalEffects(ctx2, null, ges);\n                        for (let pair2 of pairs) {\n                          GameStateFn.assertTargetMissingError(ctx2, pair2);\n                          const [targetCardId, targetBasyou] = pair2;\n                          ctx2 = GameStateFn.mapItemState(ctx2, targetCardId, (targetItemState) => {\n                            for (let textRef of textRefs) {\n                              if (GameStateFn.getCardTexts(ctx2, targetItemState.id, { ges }).find((text2) => text2.id == textRef.textId) != null)\n                                continue;\n                              targetItemState = DefineFn.ItemStateFn.setGlobalEffect(targetItemState, null, {\n                                title: [\"AddTextRef\", textRef],\n                                cardIds: [targetItemState.id]\n                              }, { isRemoveOnTurnEnd: !0 });\n                            }\n                            return targetItemState;\n                          });\n                        }\n                        return ctx2;\n                      }"
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
            "id": 1078,
            "description": "onSetPhase:戦闘フェイズ,防御ステップ,フリータイミング2"
        },
        {
            "id": 1077,
            "description": "onEffectEnd: 出擊"
        },
        {
            "id": 1076,
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
            "id": 1075,
            "description": "onItemMove:PlayerA_28 = [\"PlayerA\",\"配備エリア\"] => [\"PlayerA\",\"戦闘エリア1\"]",
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
            "id": 1074,
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
            "id": 1073,
            "description": "onEvent: GameEventOnMove [\"PlayerA_28\"]",
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
            "id": 1072,
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
            "id": 1071,
            "description": "onSetPhase:戦闘フェイズ,防御ステップ,規定の効果"
        },
        {
            "id": 1070,
            "description": "onSetPhase:戦闘フェイズ,防御ステップ,フリータイミング"
        },
        {
            "id": 1069,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 1068,
            "description": "onSetPhase:戦闘フェイズ,防御ステップ,ステップ開始"
        },
        {
            "id": 1067,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 1066,
            "description": "onSetPhase:戦闘フェイズ,攻撃ステップ,ステップ終了"
        },
        {
            "id": 1065,
            "description": "onSetPhase:戦闘フェイズ,攻撃ステップ,フリータイミング2"
        },
        {
            "id": 1064,
            "description": "onEffectEnd: 出擊"
        },
        {
            "id": 1063,
            "description": "onEvent: このカードが攻撃に出撃した場合 [\"PlayerB_72\",\"PlayerB_94\"]",
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
            "id": 1062,
            "description": "onItemMove:PlayerB_94 = [\"PlayerB\",\"配備エリア\"] => [\"PlayerB\",\"戦闘エリア1\"]",
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
            "id": 1061,
            "description": "onEvent: GameEventOnMove [\"PlayerB_94\"]",
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
            "id": 1060,
            "description": "onItemMove:PlayerB_72 = [\"PlayerB\",\"配備エリア\"] => [\"PlayerB\",\"戦闘エリア1\"]",
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
            "id": 1059,
            "description": "onEvent: GameEventOnMove [\"PlayerB_72\"]",
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
            "id": 1058,
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
            "id": 1057,
            "description": "onSetPhase:戦闘フェイズ,攻撃ステップ,規定の効果"
        },
        {
            "id": 1056,
            "description": "onSetPhase:戦闘フェイズ,攻撃ステップ,フリータイミング"
        },
        {
            "id": 1055,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 1054,
            "description": "onSetPhase:戦闘フェイズ,攻撃ステップ,ステップ開始"
        },
        {
            "id": 1053,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 1052,
            "description": "onSetPhase:配備フェイズ,フェイズ終了"
        },
        {
            "id": 1051,
            "description": "onEvent: カット終了時 undefined"
        },
        {
            "id": 1050,
            "description": "onEffectEnd: Play ギャプランTR-5［フライルー］"
        },
        {
            "id": 1049,
            "description": "onEvent: プレイされて場に出た場合 [\"PlayerB_78\"]",
            "effect": {
                "id": "createUnitGoStageEffectFromPlayEffect_PlayerB_78",
                "reason": [
                    "場に出る",
                    "PlayerB",
                    "PlayerB_78"
                ],
                "description": "Play ギャプランTR-5［フライルー］",
                "text": {
                    "id": "createPlayUnitEffect_PlayerB_78",
                    "description": "Play ギャプランTR-5［フライルー］",
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
            "id": 1048,
            "description": "PlayerB_78.isRoll false => true",
            "effect": {
                "id": "createUnitGoStageEffectFromPlayEffect_PlayerB_78",
                "reason": [
                    "場に出る",
                    "PlayerB",
                    "PlayerB_78"
                ],
                "description": "Play ギャプランTR-5［フライルー］",
                "text": {
                    "id": "createPlayUnitEffect_PlayerB_78",
                    "description": "Play ギャプランTR-5［フライルー］",
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
            "id": 1047,
            "description": "onItemMove:PlayerB_78 = [\"PlayerB\",\"プレイされているカード\"] => [\"PlayerB\",\"配備エリア\"]",
            "effect": {
                "id": "createUnitGoStageEffectFromPlayEffect_PlayerB_78",
                "reason": [
                    "場に出る",
                    "PlayerB",
                    "PlayerB_78"
                ],
                "description": "Play ギャプランTR-5［フライルー］",
                "text": {
                    "id": "createPlayUnitEffect_PlayerB_78",
                    "description": "Play ギャプランTR-5［フライルー］",
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
            "id": 1046,
            "description": "onEvent: GameEventOnMove [\"PlayerB_78\"]",
            "effect": {
                "id": "createUnitGoStageEffectFromPlayEffect_PlayerB_78",
                "reason": [
                    "場に出る",
                    "PlayerB",
                    "PlayerB_78"
                ],
                "description": "Play ギャプランTR-5［フライルー］",
                "text": {
                    "id": "createPlayUnitEffect_PlayerB_78",
                    "description": "Play ギャプランTR-5［フライルー］",
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
            "id": 1045,
            "description": "onEvent: このカードが場に出た場合 [\"PlayerB_78\"]",
            "effect": {
                "id": "createUnitGoStageEffectFromPlayEffect_PlayerB_78",
                "reason": [
                    "場に出る",
                    "PlayerB",
                    "PlayerB_78"
                ],
                "description": "Play ギャプランTR-5［フライルー］",
                "text": {
                    "id": "createPlayUnitEffect_PlayerB_78",
                    "description": "Play ギャプランTR-5［フライルー］",
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
            "id": 1044,
            "description": "onEffectStart: Play ギャプランTR-5［フライルー］",
            "effect": {
                "id": "createUnitGoStageEffectFromPlayEffect_PlayerB_78",
                "reason": [
                    "場に出る",
                    "PlayerB",
                    "PlayerB_78"
                ],
                "description": "Play ギャプランTR-5［フライルー］",
                "text": {
                    "id": "createPlayUnitEffect_PlayerB_78",
                    "description": "Play ギャプランTR-5［フライルー］",
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
            "id": 1043,
            "description": "onEffectEnd: Play 先を見通す眼"
        },
        {
            "id": 1042,
            "description": "onEvent: プレイされて場に出た場合 [\"PlayerB_82\"]",
            "effect": {
                "id": "createOperationGoStageEffectFromPlayEffect_PlayerB_82",
                "reason": [
                    "場に出る",
                    "PlayerB",
                    "PlayerB_82"
                ],
                "description": "Play 先を見通す眼",
                "text": {
                    "id": "createPlayOperationEffect_PlayerB_82",
                    "description": "Play 先を見通す眼",
                    "title": [],
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect2, { DefineFn, GameStateFn }) {\n                  const cardId2 = DefineFn.EffectFn.getCardID(effect2), from = GameStateFn.getItemBaSyou(ctx3, cardId2), to = DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\");\n                  return ctx3 = GameStateFn.doItemMove(ctx3, to, [cardId2, from]), ctx3 = GameStateFn.doTriggerEvent(ctx3, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId2] }), ctx3;\n                }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 1041,
            "description": "onItemMove:PlayerB_82 = [\"PlayerB\",\"プレイされているカード\"] => [\"PlayerB\",\"配備エリア\"]",
            "effect": {
                "id": "createOperationGoStageEffectFromPlayEffect_PlayerB_82",
                "reason": [
                    "場に出る",
                    "PlayerB",
                    "PlayerB_82"
                ],
                "description": "Play 先を見通す眼",
                "text": {
                    "id": "createPlayOperationEffect_PlayerB_82",
                    "description": "Play 先を見通す眼",
                    "title": [],
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect2, { DefineFn, GameStateFn }) {\n                  const cardId2 = DefineFn.EffectFn.getCardID(effect2), from = GameStateFn.getItemBaSyou(ctx3, cardId2), to = DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\");\n                  return ctx3 = GameStateFn.doItemMove(ctx3, to, [cardId2, from]), ctx3 = GameStateFn.doTriggerEvent(ctx3, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId2] }), ctx3;\n                }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 1040,
            "description": "onEvent: GameEventOnMove [\"PlayerB_82\"]",
            "effect": {
                "id": "createOperationGoStageEffectFromPlayEffect_PlayerB_82",
                "reason": [
                    "場に出る",
                    "PlayerB",
                    "PlayerB_82"
                ],
                "description": "Play 先を見通す眼",
                "text": {
                    "id": "createPlayOperationEffect_PlayerB_82",
                    "description": "Play 先を見通す眼",
                    "title": [],
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect2, { DefineFn, GameStateFn }) {\n                  const cardId2 = DefineFn.EffectFn.getCardID(effect2), from = GameStateFn.getItemBaSyou(ctx3, cardId2), to = DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\");\n                  return ctx3 = GameStateFn.doItemMove(ctx3, to, [cardId2, from]), ctx3 = GameStateFn.doTriggerEvent(ctx3, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId2] }), ctx3;\n                }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 1039,
            "description": "onEvent: このカードが場に出た場合 [\"PlayerB_82\"]",
            "effect": {
                "id": "createOperationGoStageEffectFromPlayEffect_PlayerB_82",
                "reason": [
                    "場に出る",
                    "PlayerB",
                    "PlayerB_82"
                ],
                "description": "Play 先を見通す眼",
                "text": {
                    "id": "createPlayOperationEffect_PlayerB_82",
                    "description": "Play 先を見通す眼",
                    "title": [],
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect2, { DefineFn, GameStateFn }) {\n                  const cardId2 = DefineFn.EffectFn.getCardID(effect2), from = GameStateFn.getItemBaSyou(ctx3, cardId2), to = DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\");\n                  return ctx3 = GameStateFn.doItemMove(ctx3, to, [cardId2, from]), ctx3 = GameStateFn.doTriggerEvent(ctx3, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId2] }), ctx3;\n                }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 1038,
            "description": "onEffectStart: Play 先を見通す眼",
            "effect": {
                "id": "createOperationGoStageEffectFromPlayEffect_PlayerB_82",
                "reason": [
                    "場に出る",
                    "PlayerB",
                    "PlayerB_82"
                ],
                "description": "Play 先を見通す眼",
                "text": {
                    "id": "createPlayOperationEffect_PlayerB_82",
                    "description": "Play 先を見通す眼",
                    "title": [],
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect2, { DefineFn, GameStateFn }) {\n                  const cardId2 = DefineFn.EffectFn.getCardID(effect2), from = GameStateFn.getItemBaSyou(ctx3, cardId2), to = DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\");\n                  return ctx3 = GameStateFn.doItemMove(ctx3, to, [cardId2, from]), ctx3 = GameStateFn.doTriggerEvent(ctx3, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId2] }), ctx3;\n                }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 1037,
            "description": "onEffectEnd: Play 先を見通す眼"
        },
        {
            "id": 1036,
            "description": "onItemMove:PlayerB_82 = [\"PlayerB\",\"手札\"] => [\"PlayerB\",\"プレイされているカード\"]",
            "effect": {
                "id": "createPlayOperationEffect_PlayerB_82",
                "reason": [
                    "PlayCard",
                    "PlayerB",
                    "PlayerB_82",
                    {
                        "isPlayOperation": true
                    }
                ],
                "description": "Play 先を見通す眼",
                "text": {
                    "id": "createPlayOperationEffect_PlayerB_82",
                    "title": [
                        "使用型",
                        [
                            "自軍",
                            "配備フェイズ"
                        ]
                    ],
                    "description": "Play 先を見通す眼",
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
                        "橫置支付0[黒]": {
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
                                        "橫置支付0[黒]"
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
                                    "title": "function _(ctx3, effect, { DefineFn, GameStateFn, ToolFn: ToolFn2 }) {\n              const cardId2 = DefineFn.EffectFn.getCardID(effect), from = GameStateFn.getItemBaSyou(ctx3, cardId2);\n              ctx3 = GameStateFn.doItemMove(ctx3, DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u3044\\u308B\\u30AB\\u30FC\\u30C9\"), [cardId2, from]);\n              const newE = GameStateFn.createOperationGoStageEffectFromPlayEffect(ctx3, effect);\n              return GameStateFn.addStackEffect(ctx3, newE);\n            }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 1035,
            "description": "onEvent: GameEventOnMove [\"PlayerB_82\"]",
            "effect": {
                "id": "createPlayOperationEffect_PlayerB_82",
                "reason": [
                    "PlayCard",
                    "PlayerB",
                    "PlayerB_82",
                    {
                        "isPlayOperation": true
                    }
                ],
                "description": "Play 先を見通す眼",
                "text": {
                    "id": "createPlayOperationEffect_PlayerB_82",
                    "title": [
                        "使用型",
                        [
                            "自軍",
                            "配備フェイズ"
                        ]
                    ],
                    "description": "Play 先を見通す眼",
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
                        "橫置支付0[黒]": {
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
                                        "橫置支付0[黒]"
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
                                    "title": "function _(ctx3, effect, { DefineFn, GameStateFn, ToolFn: ToolFn2 }) {\n              const cardId2 = DefineFn.EffectFn.getCardID(effect), from = GameStateFn.getItemBaSyou(ctx3, cardId2);\n              ctx3 = GameStateFn.doItemMove(ctx3, DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u3044\\u308B\\u30AB\\u30FC\\u30C9\"), [cardId2, from]);\n              const newE = GameStateFn.createOperationGoStageEffectFromPlayEffect(ctx3, effect);\n              return GameStateFn.addStackEffect(ctx3, newE);\n            }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 1034,
            "description": "PlayerB_82.isFaceDown true => false",
            "effect": {
                "id": "createPlayOperationEffect_PlayerB_82",
                "reason": [
                    "PlayCard",
                    "PlayerB",
                    "PlayerB_82",
                    {
                        "isPlayOperation": true
                    }
                ],
                "description": "Play 先を見通す眼",
                "text": {
                    "id": "createPlayOperationEffect_PlayerB_82",
                    "title": [
                        "使用型",
                        [
                            "自軍",
                            "配備フェイズ"
                        ]
                    ],
                    "description": "Play 先を見通す眼",
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
                        "橫置支付0[黒]": {
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
                                        "橫置支付0[黒]"
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
                                    "title": "function _(ctx3, effect, { DefineFn, GameStateFn, ToolFn: ToolFn2 }) {\n              const cardId2 = DefineFn.EffectFn.getCardID(effect), from = GameStateFn.getItemBaSyou(ctx3, cardId2);\n              ctx3 = GameStateFn.doItemMove(ctx3, DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u3044\\u308B\\u30AB\\u30FC\\u30C9\"), [cardId2, from]);\n              const newE = GameStateFn.createOperationGoStageEffectFromPlayEffect(ctx3, effect);\n              return GameStateFn.addStackEffect(ctx3, newE);\n            }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 1033,
            "description": "onEvent: プレイした場合 [\"PlayerB_82\"]",
            "effect": {
                "id": "createPlayOperationEffect_PlayerB_82",
                "reason": [
                    "PlayCard",
                    "PlayerB",
                    "PlayerB_82",
                    {
                        "isPlayOperation": true
                    }
                ],
                "description": "Play 先を見通す眼",
                "text": {
                    "id": "createPlayOperationEffect_PlayerB_82",
                    "title": [
                        "使用型",
                        [
                            "自軍",
                            "配備フェイズ"
                        ]
                    ],
                    "description": "Play 先を見通す眼",
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
                        "橫置支付0[黒]": {
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
                                        "橫置支付0[黒]"
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
                                    "title": "function _(ctx3, effect, { DefineFn, GameStateFn, ToolFn: ToolFn2 }) {\n              const cardId2 = DefineFn.EffectFn.getCardID(effect), from = GameStateFn.getItemBaSyou(ctx3, cardId2);\n              ctx3 = GameStateFn.doItemMove(ctx3, DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u3044\\u308B\\u30AB\\u30FC\\u30C9\"), [cardId2, from]);\n              const newE = GameStateFn.createOperationGoStageEffectFromPlayEffect(ctx3, effect);\n              return GameStateFn.addStackEffect(ctx3, newE);\n            }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 1032,
            "description": "PlayerB_85.isRoll false => true",
            "effect": {
                "id": "createPlayOperationEffect_PlayerB_82",
                "reason": [
                    "PlayCard",
                    "PlayerB",
                    "PlayerB_82",
                    {
                        "isPlayOperation": true
                    }
                ],
                "description": "Play 先を見通す眼",
                "text": {
                    "id": "createPlayOperationEffect_PlayerB_82",
                    "title": [
                        "使用型",
                        [
                            "自軍",
                            "配備フェイズ"
                        ]
                    ],
                    "description": "Play 先を見通す眼",
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
                        "橫置支付0[黒]": {
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
                                        "橫置支付0[黒]"
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
                                    "title": "function _(ctx3, effect, { DefineFn, GameStateFn, ToolFn: ToolFn2 }) {\n              const cardId2 = DefineFn.EffectFn.getCardID(effect), from = GameStateFn.getItemBaSyou(ctx3, cardId2);\n              ctx3 = GameStateFn.doItemMove(ctx3, DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u3044\\u308B\\u30AB\\u30FC\\u30C9\"), [cardId2, from]);\n              const newE = GameStateFn.createOperationGoStageEffectFromPlayEffect(ctx3, effect);\n              return GameStateFn.addStackEffect(ctx3, newE);\n            }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 1031,
            "description": "onEffectStart: Play 先を見通す眼",
            "effect": {
                "id": "createPlayOperationEffect_PlayerB_82",
                "reason": [
                    "PlayCard",
                    "PlayerB",
                    "PlayerB_82",
                    {
                        "isPlayOperation": true
                    }
                ],
                "description": "Play 先を見通す眼",
                "text": {
                    "id": "createPlayOperationEffect_PlayerB_82",
                    "title": [
                        "使用型",
                        [
                            "自軍",
                            "配備フェイズ"
                        ]
                    ],
                    "description": "Play 先を見通す眼",
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
                        "橫置支付0[黒]": {
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
                                        "橫置支付0[黒]"
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
                                    "title": "function _(ctx3, effect, { DefineFn, GameStateFn, ToolFn: ToolFn2 }) {\n              const cardId2 = DefineFn.EffectFn.getCardID(effect), from = GameStateFn.getItemBaSyou(ctx3, cardId2);\n              ctx3 = GameStateFn.doItemMove(ctx3, DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u3044\\u308B\\u30AB\\u30FC\\u30C9\"), [cardId2, from]);\n              const newE = GameStateFn.createOperationGoStageEffectFromPlayEffect(ctx3, effect);\n              return GameStateFn.addStackEffect(ctx3, newE);\n            }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 1030,
            "description": "onEffectEnd: Play ギャプランTR-5［フライルー］"
        },
        {
            "id": 1029,
            "description": "onItemMove:PlayerB_78 = [\"PlayerB\",\"手札\"] => [\"PlayerB\",\"プレイされているカード\"]",
            "effect": {
                "id": "createPlayUnitEffect_PlayerB_78",
                "reason": [
                    "PlayCard",
                    "PlayerB",
                    "PlayerB_78",
                    {
                        "isPlayUnit": true
                    }
                ],
                "description": "Play ギャプランTR-5［フライルー］",
                "text": {
                    "id": "createPlayUnitEffect_PlayerB_78",
                    "title": [
                        "使用型",
                        [
                            "自軍",
                            "配備フェイズ"
                        ]
                    ],
                    "description": "Play ギャプランTR-5［フライルー］",
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
                        "橫置支付0[黒]": {
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
                                        "橫置支付0[黒]"
                                    ]
                                }
                            ],
                            "groupKey": "支付橫置國力"
                        },
                        "橫置支付1[黒]": {
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
                                        "橫置支付1[黒]"
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
            "description": "onEvent: GameEventOnMove [\"PlayerB_78\"]",
            "effect": {
                "id": "createPlayUnitEffect_PlayerB_78",
                "reason": [
                    "PlayCard",
                    "PlayerB",
                    "PlayerB_78",
                    {
                        "isPlayUnit": true
                    }
                ],
                "description": "Play ギャプランTR-5［フライルー］",
                "text": {
                    "id": "createPlayUnitEffect_PlayerB_78",
                    "title": [
                        "使用型",
                        [
                            "自軍",
                            "配備フェイズ"
                        ]
                    ],
                    "description": "Play ギャプランTR-5［フライルー］",
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
                        "橫置支付0[黒]": {
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
                                        "橫置支付0[黒]"
                                    ]
                                }
                            ],
                            "groupKey": "支付橫置國力"
                        },
                        "橫置支付1[黒]": {
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
                                        "橫置支付1[黒]"
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
            "id": 1027,
            "description": "PlayerB_78.isFaceDown true => false",
            "effect": {
                "id": "createPlayUnitEffect_PlayerB_78",
                "reason": [
                    "PlayCard",
                    "PlayerB",
                    "PlayerB_78",
                    {
                        "isPlayUnit": true
                    }
                ],
                "description": "Play ギャプランTR-5［フライルー］",
                "text": {
                    "id": "createPlayUnitEffect_PlayerB_78",
                    "title": [
                        "使用型",
                        [
                            "自軍",
                            "配備フェイズ"
                        ]
                    ],
                    "description": "Play ギャプランTR-5［フライルー］",
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
                        "橫置支付0[黒]": {
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
                                        "橫置支付0[黒]"
                                    ]
                                }
                            ],
                            "groupKey": "支付橫置國力"
                        },
                        "橫置支付1[黒]": {
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
                                        "橫置支付1[黒]"
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
            "id": 1026,
            "description": "onEvent: プレイした場合 [\"PlayerB_78\"]",
            "effect": {
                "id": "createPlayUnitEffect_PlayerB_78",
                "reason": [
                    "PlayCard",
                    "PlayerB",
                    "PlayerB_78",
                    {
                        "isPlayUnit": true
                    }
                ],
                "description": "Play ギャプランTR-5［フライルー］",
                "text": {
                    "id": "createPlayUnitEffect_PlayerB_78",
                    "title": [
                        "使用型",
                        [
                            "自軍",
                            "配備フェイズ"
                        ]
                    ],
                    "description": "Play ギャプランTR-5［フライルー］",
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
                        "橫置支付0[黒]": {
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
                                        "橫置支付0[黒]"
                                    ]
                                }
                            ],
                            "groupKey": "支付橫置國力"
                        },
                        "橫置支付1[黒]": {
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
                                        "橫置支付1[黒]"
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
            "id": 1025,
            "description": "PlayerB_71.isRoll false => true",
            "effect": {
                "id": "createPlayUnitEffect_PlayerB_78",
                "reason": [
                    "PlayCard",
                    "PlayerB",
                    "PlayerB_78",
                    {
                        "isPlayUnit": true
                    }
                ],
                "description": "Play ギャプランTR-5［フライルー］",
                "text": {
                    "id": "createPlayUnitEffect_PlayerB_78",
                    "title": [
                        "使用型",
                        [
                            "自軍",
                            "配備フェイズ"
                        ]
                    ],
                    "description": "Play ギャプランTR-5［フライルー］",
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
                        "橫置支付0[黒]": {
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
                                        "橫置支付0[黒]"
                                    ]
                                }
                            ],
                            "groupKey": "支付橫置國力"
                        },
                        "橫置支付1[黒]": {
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
                                        "橫置支付1[黒]"
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
            "id": 1024,
            "description": "PlayerB_70.isRoll false => true",
            "effect": {
                "id": "createPlayUnitEffect_PlayerB_78",
                "reason": [
                    "PlayCard",
                    "PlayerB",
                    "PlayerB_78",
                    {
                        "isPlayUnit": true
                    }
                ],
                "description": "Play ギャプランTR-5［フライルー］",
                "text": {
                    "id": "createPlayUnitEffect_PlayerB_78",
                    "title": [
                        "使用型",
                        [
                            "自軍",
                            "配備フェイズ"
                        ]
                    ],
                    "description": "Play ギャプランTR-5［フライルー］",
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
                        "橫置支付0[黒]": {
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
                                        "橫置支付0[黒]"
                                    ]
                                }
                            ],
                            "groupKey": "支付橫置國力"
                        },
                        "橫置支付1[黒]": {
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
                                        "橫置支付1[黒]"
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
            "id": 1023,
            "description": "onEffectStart: Play ギャプランTR-5［フライルー］",
            "effect": {
                "id": "createPlayUnitEffect_PlayerB_78",
                "reason": [
                    "PlayCard",
                    "PlayerB",
                    "PlayerB_78",
                    {
                        "isPlayUnit": true
                    }
                ],
                "description": "Play ギャプランTR-5［フライルー］",
                "text": {
                    "id": "createPlayUnitEffect_PlayerB_78",
                    "title": [
                        "使用型",
                        [
                            "自軍",
                            "配備フェイズ"
                        ]
                    ],
                    "description": "Play ギャプランTR-5［フライルー］",
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
                        "橫置支付0[黒]": {
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
                                        "橫置支付0[黒]"
                                    ]
                                }
                            ],
                            "groupKey": "支付橫置國力"
                        },
                        "橫置支付1[黒]": {
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
                                        "橫置支付1[黒]"
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
            "id": 1022,
            "description": "onEffectEnd: PlayG"
        },
        {
            "id": 1021,
            "description": "onEvent: このカードがGとして場に出た場合 [\"PlayerB_50\"]",
            "effect": {
                "id": "createPlayGEffect_PlayerB_50",
                "reason": [
                    "PlayCard",
                    "PlayerB",
                    "PlayerB_50",
                    {
                        "isPlayG": true
                    }
                ],
                "description": "Play G",
                "text": {
                    "id": "createPlayGEffect_PlayerB_50",
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
            "description": "onEvent: プレイされて場に出た場合 [\"PlayerB_50\"]",
            "effect": {
                "id": "createPlayGEffect_PlayerB_50",
                "reason": [
                    "PlayCard",
                    "PlayerB",
                    "PlayerB_50",
                    {
                        "isPlayG": true
                    }
                ],
                "description": "Play G",
                "text": {
                    "id": "createPlayGEffect_PlayerB_50",
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
            "id": 1019,
            "description": "onItemMove:PlayerB_50 = [\"PlayerB\",\"手札\"] => [\"PlayerB\",\"Gゾーン\"]",
            "effect": {
                "id": "createPlayGEffect_PlayerB_50",
                "reason": [
                    "PlayCard",
                    "PlayerB",
                    "PlayerB_50",
                    {
                        "isPlayG": true
                    }
                ],
                "description": "Play G",
                "text": {
                    "id": "createPlayGEffect_PlayerB_50",
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
            "id": 1018,
            "description": "onEvent: GameEventOnMove [\"PlayerB_50\"]",
            "effect": {
                "id": "createPlayGEffect_PlayerB_50",
                "reason": [
                    "PlayCard",
                    "PlayerB",
                    "PlayerB_50",
                    {
                        "isPlayG": true
                    }
                ],
                "description": "Play G",
                "text": {
                    "id": "createPlayGEffect_PlayerB_50",
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
            "id": 1017,
            "description": "PlayerB_50.isFaceDown true => false",
            "effect": {
                "id": "createPlayGEffect_PlayerB_50",
                "reason": [
                    "PlayCard",
                    "PlayerB",
                    "PlayerB_50",
                    {
                        "isPlayG": true
                    }
                ],
                "description": "Play G",
                "text": {
                    "id": "createPlayGEffect_PlayerB_50",
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
            "id": 1016,
            "description": "onPlayerStateChange:PlayerB",
            "effect": {
                "id": "createPlayGEffect_PlayerB_50",
                "reason": [
                    "PlayCard",
                    "PlayerB",
                    "PlayerB_50",
                    {
                        "isPlayG": true
                    }
                ],
                "description": "Play G",
                "text": {
                    "id": "createPlayGEffect_PlayerB_50",
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
            "id": 1015,
            "description": "onEffectStart: PlayG",
            "effect": {
                "id": "createPlayGEffect_PlayerB_50",
                "reason": [
                    "PlayCard",
                    "PlayerB",
                    "PlayerB_50",
                    {
                        "isPlayG": true
                    }
                ],
                "description": "Play G",
                "text": {
                    "id": "createPlayGEffect_PlayerB_50",
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
            "id": 1014,
            "description": "onSetPhase:配備フェイズ,フリータイミング"
        },
        {
            "id": 1013,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 1012,
            "description": "onSetPhase:配備フェイズ,フェイズ開始"
        },
        {
            "id": 1011,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 1010,
            "description": "onSetPhase:ドローフェイズ,フェイズ終了"
        },
        {
            "id": 1009,
            "description": "onSetPhase:ドローフェイズ,フリータイミング"
        },
        {
            "id": 1008,
            "description": "onEffectEnd: 抽牌階段規定效果"
        },
        {
            "id": 1007,
            "description": "onItemMove:PlayerB_82 = [\"PlayerB\",\"本国\"] => [\"PlayerB\",\"手札\"]",
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
            "id": 1006,
            "description": "onEvent: GameEventOnMove [\"PlayerB_82\"]",
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
            "id": 1005,
            "description": "PlayerB_82.isRoll undefined => false",
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
            "id": 1004,
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
            "id": 1003,
            "description": "onSetPhase:ドローフェイズ,規定の効果"
        },
        {
            "id": 1002,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 1001,
            "description": "onSetPhase:ドローフェイズ,フェイズ開始"
        },
        {
            "id": 1000,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 999,
            "description": "onSetPhase:リロールフェイズ,フェイズ終了"
        },
        {
            "id": 998,
            "description": "onSetPhase:リロールフェイズ,フリータイミング"
        },
        {
            "id": 997,
            "description": "onEffectEnd: getRerollPhaseRuleEffect"
        },
        {
            "id": 996,
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
            "id": 995,
            "description": "PlayerB_71.isRoll true => false",
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
            "id": 994,
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
            "id": 993,
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
            "id": 992,
            "description": "onSetPhase:リロールフェイズ,規定の効果"
        },
        {
            "id": 991,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 990,
            "description": "onSetPhase:リロールフェイズ,フェイズ開始"
        },
        {
            "id": 989,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 988,
            "description": "onPlayerStateChange:PlayerA"
        },
        {
            "id": 987,
            "description": "onSetPhase:戦闘フェイズ,ターン終了時,効果終了。ターン終了"
        },
        {
            "id": 986,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 985,
            "description": "將發動起動效果但條件不足: : 調整手牌為7張以下"
        },
        {
            "id": 984,
            "description": "將發動起動效果但條件不足: : 調整手牌為7張以下"
        },
        {
            "id": 983,
            "description": "onSetPhase:戦闘フェイズ,ターン終了時,手札調整"
        },
        {
            "id": 982,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 981,
            "description": "onSetPhase:戦闘フェイズ,ターン終了時,効果解決"
        },
        {
            "id": 980,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 979,
            "description": "onSetPhase:戦闘フェイズ,ターン終了時,ダメージリセット"
        },
        {
            "id": 978,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 977,
            "description": "onSetPhase:戦闘フェイズ,帰還ステップ,ステップ終了"
        },
        {
            "id": 976,
            "description": "onSetPhase:戦闘フェイズ,帰還ステップ,フリータイミング2"
        },
        {
            "id": 975,
            "description": "onEffectEnd: getReturnRuleEffect"
        },
        {
            "id": 974,
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
            "id": 973,
            "description": "onSetPhase:戦闘フェイズ,帰還ステップ,規定の効果"
        },
        {
            "id": 972,
            "description": "onEvent: カット終了時 undefined"
        },
        {
            "id": 971,
            "description": "onEffectEnd: 打開自軍手裡或指定HANGER中特徵A並合計國力x以下的1張卡, 和這張卡重置狀態置換, 這張卡置換後廢棄. x為自軍G的張數"
        },
        {
            "id": 970,
            "description": "onEvent: 「改装」の効果で場に出た場合 [\"PlayerB_72\"]",
            "effect": {
                "id": "addStackEffect_019294bd-420a-7003-9ba6-8d7fc90ca9a0",
                "reason": [
                    "PlayText",
                    "PlayerB",
                    "PlayerB_72",
                    "loadPrototype_179024_04B_U_BK067C_black_text_2"
                ],
                "description": "打開自軍手裡或指定HANGER中特徵A並合計國力x以下的1張卡, 和這張卡重置狀態置換, 這張卡置換後廢棄. x為自軍G的張數",
                "text": {
                    "id": "loadPrototype_179024_04B_U_BK067C_black_text_2",
                    "title": [
                        "使用型",
                        [
                            "戦闘フェイズ"
                        ]
                    ],
                    "description": "打開自軍手裡或指定HANGER中特徵A並合計國力x以下的1張卡, 和這張卡重置狀態置換, 這張卡置換後廢棄. x為自軍G的張數",
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect2, { GameStateFn: GameStateFn2, DefineFn: DefineFn2 }) {\n                              const cardId = DefineFn2.EffectFn.getCardID(effect2), basyou = GameStateFn2.getItemBaSyou(ctx3, cardId), pairs = GameStateFn2.getCardTipStrBaSyouPairs(ctx3, \"\\u6253\\u958B\\u81EA\\u8ECD\\u624B\\u88E1\\u6216\\u6307\\u5B9AHANGER\\u4E2D\\u7279\\u5FB5A\\u4E26\\u5408\\u8A08\\u570B\\u529Bx\\u4EE5\\u4E0B\\u76841\\u5F35\\u5361\", cardId);\n                              if (pairs.length == 0)\n                                throw new Error(`pairs must not 0: ${effect2.text.description}`);\n                              const targetPair = pairs[0], ges = GameStateFn2.getGlobalEffects(ctx3, null);\n                              return ctx3 = GameStateFn2.setGlobalEffects(ctx3, null, ges), GameStateFn2.assertTargetMissingError(ctx3, targetPair), ctx3 = GameStateFn2.doItemSwap(ctx3, [cardId, basyou], targetPair), ctx3 = GameStateFn2.doItemSetRollState(ctx3, !1, [cardId, basyou], { isSkipTargetMissing: !0 }), ctx3 = GameStateFn2.doItemMove(ctx3, DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(basyou, \"\\u30B8\\u30E3\\u30F3\\u30AF\\u30E4\\u30FC\\u30C9\"), targetPair, { ges }), ctx3 = GameStateFn2.doTriggerEvent(ctx3, { title: [\"\\u300C\\u6539\\u88C5\\u300D\\u306E\\u52B9\\u679C\\u3067\\u5EC3\\u68C4\\u3055\\u308C\\u308B\\u5834\\u5408\"], cardIds: [targetPair[0]] }), ctx3 = GameStateFn2.doTriggerEvent(ctx3, { title: [\"\\u300C\\u6539\\u88C5\\u300D\\u306E\\u52B9\\u679C\\u3067\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId] }), ctx3;\n                            }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 969,
            "description": "onEvent: 「改装」の効果で廃棄される場合 [\"PlayerB_55\"]",
            "effect": {
                "id": "addStackEffect_019294bd-420a-7003-9ba6-8d7fc90ca9a0",
                "reason": [
                    "PlayText",
                    "PlayerB",
                    "PlayerB_72",
                    "loadPrototype_179024_04B_U_BK067C_black_text_2"
                ],
                "description": "打開自軍手裡或指定HANGER中特徵A並合計國力x以下的1張卡, 和這張卡重置狀態置換, 這張卡置換後廢棄. x為自軍G的張數",
                "text": {
                    "id": "loadPrototype_179024_04B_U_BK067C_black_text_2",
                    "title": [
                        "使用型",
                        [
                            "戦闘フェイズ"
                        ]
                    ],
                    "description": "打開自軍手裡或指定HANGER中特徵A並合計國力x以下的1張卡, 和這張卡重置狀態置換, 這張卡置換後廢棄. x為自軍G的張數",
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect2, { GameStateFn: GameStateFn2, DefineFn: DefineFn2 }) {\n                              const cardId = DefineFn2.EffectFn.getCardID(effect2), basyou = GameStateFn2.getItemBaSyou(ctx3, cardId), pairs = GameStateFn2.getCardTipStrBaSyouPairs(ctx3, \"\\u6253\\u958B\\u81EA\\u8ECD\\u624B\\u88E1\\u6216\\u6307\\u5B9AHANGER\\u4E2D\\u7279\\u5FB5A\\u4E26\\u5408\\u8A08\\u570B\\u529Bx\\u4EE5\\u4E0B\\u76841\\u5F35\\u5361\", cardId);\n                              if (pairs.length == 0)\n                                throw new Error(`pairs must not 0: ${effect2.text.description}`);\n                              const targetPair = pairs[0], ges = GameStateFn2.getGlobalEffects(ctx3, null);\n                              return ctx3 = GameStateFn2.setGlobalEffects(ctx3, null, ges), GameStateFn2.assertTargetMissingError(ctx3, targetPair), ctx3 = GameStateFn2.doItemSwap(ctx3, [cardId, basyou], targetPair), ctx3 = GameStateFn2.doItemSetRollState(ctx3, !1, [cardId, basyou], { isSkipTargetMissing: !0 }), ctx3 = GameStateFn2.doItemMove(ctx3, DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(basyou, \"\\u30B8\\u30E3\\u30F3\\u30AF\\u30E4\\u30FC\\u30C9\"), targetPair, { ges }), ctx3 = GameStateFn2.doTriggerEvent(ctx3, { title: [\"\\u300C\\u6539\\u88C5\\u300D\\u306E\\u52B9\\u679C\\u3067\\u5EC3\\u68C4\\u3055\\u308C\\u308B\\u5834\\u5408\"], cardIds: [targetPair[0]] }), ctx3 = GameStateFn2.doTriggerEvent(ctx3, { title: [\"\\u300C\\u6539\\u88C5\\u300D\\u306E\\u52B9\\u679C\\u3067\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId] }), ctx3;\n                            }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 968,
            "description": "onItemMove:PlayerB_55 = [\"PlayerB\",\"手札\"] => [\"PlayerB\",\"ジャンクヤード\"]",
            "effect": {
                "id": "addStackEffect_019294bd-420a-7003-9ba6-8d7fc90ca9a0",
                "reason": [
                    "PlayText",
                    "PlayerB",
                    "PlayerB_72",
                    "loadPrototype_179024_04B_U_BK067C_black_text_2"
                ],
                "description": "打開自軍手裡或指定HANGER中特徵A並合計國力x以下的1張卡, 和這張卡重置狀態置換, 這張卡置換後廢棄. x為自軍G的張數",
                "text": {
                    "id": "loadPrototype_179024_04B_U_BK067C_black_text_2",
                    "title": [
                        "使用型",
                        [
                            "戦闘フェイズ"
                        ]
                    ],
                    "description": "打開自軍手裡或指定HANGER中特徵A並合計國力x以下的1張卡, 和這張卡重置狀態置換, 這張卡置換後廢棄. x為自軍G的張數",
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect2, { GameStateFn: GameStateFn2, DefineFn: DefineFn2 }) {\n                              const cardId = DefineFn2.EffectFn.getCardID(effect2), basyou = GameStateFn2.getItemBaSyou(ctx3, cardId), pairs = GameStateFn2.getCardTipStrBaSyouPairs(ctx3, \"\\u6253\\u958B\\u81EA\\u8ECD\\u624B\\u88E1\\u6216\\u6307\\u5B9AHANGER\\u4E2D\\u7279\\u5FB5A\\u4E26\\u5408\\u8A08\\u570B\\u529Bx\\u4EE5\\u4E0B\\u76841\\u5F35\\u5361\", cardId);\n                              if (pairs.length == 0)\n                                throw new Error(`pairs must not 0: ${effect2.text.description}`);\n                              const targetPair = pairs[0], ges = GameStateFn2.getGlobalEffects(ctx3, null);\n                              return ctx3 = GameStateFn2.setGlobalEffects(ctx3, null, ges), GameStateFn2.assertTargetMissingError(ctx3, targetPair), ctx3 = GameStateFn2.doItemSwap(ctx3, [cardId, basyou], targetPair), ctx3 = GameStateFn2.doItemSetRollState(ctx3, !1, [cardId, basyou], { isSkipTargetMissing: !0 }), ctx3 = GameStateFn2.doItemMove(ctx3, DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(basyou, \"\\u30B8\\u30E3\\u30F3\\u30AF\\u30E4\\u30FC\\u30C9\"), targetPair, { ges }), ctx3 = GameStateFn2.doTriggerEvent(ctx3, { title: [\"\\u300C\\u6539\\u88C5\\u300D\\u306E\\u52B9\\u679C\\u3067\\u5EC3\\u68C4\\u3055\\u308C\\u308B\\u5834\\u5408\"], cardIds: [targetPair[0]] }), ctx3 = GameStateFn2.doTriggerEvent(ctx3, { title: [\"\\u300C\\u6539\\u88C5\\u300D\\u306E\\u52B9\\u679C\\u3067\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId] }), ctx3;\n                            }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 967,
            "description": "onEvent: GameEventOnMove [\"PlayerB_55\"]",
            "effect": {
                "id": "addStackEffect_019294bd-420a-7003-9ba6-8d7fc90ca9a0",
                "reason": [
                    "PlayText",
                    "PlayerB",
                    "PlayerB_72",
                    "loadPrototype_179024_04B_U_BK067C_black_text_2"
                ],
                "description": "打開自軍手裡或指定HANGER中特徵A並合計國力x以下的1張卡, 和這張卡重置狀態置換, 這張卡置換後廢棄. x為自軍G的張數",
                "text": {
                    "id": "loadPrototype_179024_04B_U_BK067C_black_text_2",
                    "title": [
                        "使用型",
                        [
                            "戦闘フェイズ"
                        ]
                    ],
                    "description": "打開自軍手裡或指定HANGER中特徵A並合計國力x以下的1張卡, 和這張卡重置狀態置換, 這張卡置換後廢棄. x為自軍G的張數",
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect2, { GameStateFn: GameStateFn2, DefineFn: DefineFn2 }) {\n                              const cardId = DefineFn2.EffectFn.getCardID(effect2), basyou = GameStateFn2.getItemBaSyou(ctx3, cardId), pairs = GameStateFn2.getCardTipStrBaSyouPairs(ctx3, \"\\u6253\\u958B\\u81EA\\u8ECD\\u624B\\u88E1\\u6216\\u6307\\u5B9AHANGER\\u4E2D\\u7279\\u5FB5A\\u4E26\\u5408\\u8A08\\u570B\\u529Bx\\u4EE5\\u4E0B\\u76841\\u5F35\\u5361\", cardId);\n                              if (pairs.length == 0)\n                                throw new Error(`pairs must not 0: ${effect2.text.description}`);\n                              const targetPair = pairs[0], ges = GameStateFn2.getGlobalEffects(ctx3, null);\n                              return ctx3 = GameStateFn2.setGlobalEffects(ctx3, null, ges), GameStateFn2.assertTargetMissingError(ctx3, targetPair), ctx3 = GameStateFn2.doItemSwap(ctx3, [cardId, basyou], targetPair), ctx3 = GameStateFn2.doItemSetRollState(ctx3, !1, [cardId, basyou], { isSkipTargetMissing: !0 }), ctx3 = GameStateFn2.doItemMove(ctx3, DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(basyou, \"\\u30B8\\u30E3\\u30F3\\u30AF\\u30E4\\u30FC\\u30C9\"), targetPair, { ges }), ctx3 = GameStateFn2.doTriggerEvent(ctx3, { title: [\"\\u300C\\u6539\\u88C5\\u300D\\u306E\\u52B9\\u679C\\u3067\\u5EC3\\u68C4\\u3055\\u308C\\u308B\\u5834\\u5408\"], cardIds: [targetPair[0]] }), ctx3 = GameStateFn2.doTriggerEvent(ctx3, { title: [\"\\u300C\\u6539\\u88C5\\u300D\\u306E\\u52B9\\u679C\\u3067\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId] }), ctx3;\n                            }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 966,
            "description": "PlayerB_55.isRoll true => false",
            "effect": {
                "id": "addStackEffect_019294bd-420a-7003-9ba6-8d7fc90ca9a0",
                "reason": [
                    "PlayText",
                    "PlayerB",
                    "PlayerB_72",
                    "loadPrototype_179024_04B_U_BK067C_black_text_2"
                ],
                "description": "打開自軍手裡或指定HANGER中特徵A並合計國力x以下的1張卡, 和這張卡重置狀態置換, 這張卡置換後廢棄. x為自軍G的張數",
                "text": {
                    "id": "loadPrototype_179024_04B_U_BK067C_black_text_2",
                    "title": [
                        "使用型",
                        [
                            "戦闘フェイズ"
                        ]
                    ],
                    "description": "打開自軍手裡或指定HANGER中特徵A並合計國力x以下的1張卡, 和這張卡重置狀態置換, 這張卡置換後廢棄. x為自軍G的張數",
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect2, { GameStateFn: GameStateFn2, DefineFn: DefineFn2 }) {\n                              const cardId = DefineFn2.EffectFn.getCardID(effect2), basyou = GameStateFn2.getItemBaSyou(ctx3, cardId), pairs = GameStateFn2.getCardTipStrBaSyouPairs(ctx3, \"\\u6253\\u958B\\u81EA\\u8ECD\\u624B\\u88E1\\u6216\\u6307\\u5B9AHANGER\\u4E2D\\u7279\\u5FB5A\\u4E26\\u5408\\u8A08\\u570B\\u529Bx\\u4EE5\\u4E0B\\u76841\\u5F35\\u5361\", cardId);\n                              if (pairs.length == 0)\n                                throw new Error(`pairs must not 0: ${effect2.text.description}`);\n                              const targetPair = pairs[0], ges = GameStateFn2.getGlobalEffects(ctx3, null);\n                              return ctx3 = GameStateFn2.setGlobalEffects(ctx3, null, ges), GameStateFn2.assertTargetMissingError(ctx3, targetPair), ctx3 = GameStateFn2.doItemSwap(ctx3, [cardId, basyou], targetPair), ctx3 = GameStateFn2.doItemSetRollState(ctx3, !1, [cardId, basyou], { isSkipTargetMissing: !0 }), ctx3 = GameStateFn2.doItemMove(ctx3, DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(basyou, \"\\u30B8\\u30E3\\u30F3\\u30AF\\u30E4\\u30FC\\u30C9\"), targetPair, { ges }), ctx3 = GameStateFn2.doTriggerEvent(ctx3, { title: [\"\\u300C\\u6539\\u88C5\\u300D\\u306E\\u52B9\\u679C\\u3067\\u5EC3\\u68C4\\u3055\\u308C\\u308B\\u5834\\u5408\"], cardIds: [targetPair[0]] }), ctx3 = GameStateFn2.doTriggerEvent(ctx3, { title: [\"\\u300C\\u6539\\u88C5\\u300D\\u306E\\u52B9\\u679C\\u3067\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId] }), ctx3;\n                            }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 965,
            "description": "PlayerB_55.protoID 179015_04B_U_BK059C_black => 179024_04B_U_BK067C_black",
            "effect": {
                "id": "addStackEffect_019294bd-420a-7003-9ba6-8d7fc90ca9a0",
                "reason": [
                    "PlayText",
                    "PlayerB",
                    "PlayerB_72",
                    "loadPrototype_179024_04B_U_BK067C_black_text_2"
                ],
                "description": "打開自軍手裡或指定HANGER中特徵A並合計國力x以下的1張卡, 和這張卡重置狀態置換, 這張卡置換後廢棄. x為自軍G的張數",
                "text": {
                    "id": "loadPrototype_179024_04B_U_BK067C_black_text_2",
                    "title": [
                        "使用型",
                        [
                            "戦闘フェイズ"
                        ]
                    ],
                    "description": "打開自軍手裡或指定HANGER中特徵A並合計國力x以下的1張卡, 和這張卡重置狀態置換, 這張卡置換後廢棄. x為自軍G的張數",
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect2, { GameStateFn: GameStateFn2, DefineFn: DefineFn2 }) {\n                              const cardId = DefineFn2.EffectFn.getCardID(effect2), basyou = GameStateFn2.getItemBaSyou(ctx3, cardId), pairs = GameStateFn2.getCardTipStrBaSyouPairs(ctx3, \"\\u6253\\u958B\\u81EA\\u8ECD\\u624B\\u88E1\\u6216\\u6307\\u5B9AHANGER\\u4E2D\\u7279\\u5FB5A\\u4E26\\u5408\\u8A08\\u570B\\u529Bx\\u4EE5\\u4E0B\\u76841\\u5F35\\u5361\", cardId);\n                              if (pairs.length == 0)\n                                throw new Error(`pairs must not 0: ${effect2.text.description}`);\n                              const targetPair = pairs[0], ges = GameStateFn2.getGlobalEffects(ctx3, null);\n                              return ctx3 = GameStateFn2.setGlobalEffects(ctx3, null, ges), GameStateFn2.assertTargetMissingError(ctx3, targetPair), ctx3 = GameStateFn2.doItemSwap(ctx3, [cardId, basyou], targetPair), ctx3 = GameStateFn2.doItemSetRollState(ctx3, !1, [cardId, basyou], { isSkipTargetMissing: !0 }), ctx3 = GameStateFn2.doItemMove(ctx3, DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(basyou, \"\\u30B8\\u30E3\\u30F3\\u30AF\\u30E4\\u30FC\\u30C9\"), targetPair, { ges }), ctx3 = GameStateFn2.doTriggerEvent(ctx3, { title: [\"\\u300C\\u6539\\u88C5\\u300D\\u306E\\u52B9\\u679C\\u3067\\u5EC3\\u68C4\\u3055\\u308C\\u308B\\u5834\\u5408\"], cardIds: [targetPair[0]] }), ctx3 = GameStateFn2.doTriggerEvent(ctx3, { title: [\"\\u300C\\u6539\\u88C5\\u300D\\u306E\\u52B9\\u679C\\u3067\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId] }), ctx3;\n                            }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 964,
            "description": "PlayerB_72.protoID 179024_04B_U_BK067C_black => 179015_04B_U_BK059C_black",
            "effect": {
                "id": "addStackEffect_019294bd-420a-7003-9ba6-8d7fc90ca9a0",
                "reason": [
                    "PlayText",
                    "PlayerB",
                    "PlayerB_72",
                    "loadPrototype_179024_04B_U_BK067C_black_text_2"
                ],
                "description": "打開自軍手裡或指定HANGER中特徵A並合計國力x以下的1張卡, 和這張卡重置狀態置換, 這張卡置換後廢棄. x為自軍G的張數",
                "text": {
                    "id": "loadPrototype_179024_04B_U_BK067C_black_text_2",
                    "title": [
                        "使用型",
                        [
                            "戦闘フェイズ"
                        ]
                    ],
                    "description": "打開自軍手裡或指定HANGER中特徵A並合計國力x以下的1張卡, 和這張卡重置狀態置換, 這張卡置換後廢棄. x為自軍G的張數",
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect2, { GameStateFn: GameStateFn2, DefineFn: DefineFn2 }) {\n                              const cardId = DefineFn2.EffectFn.getCardID(effect2), basyou = GameStateFn2.getItemBaSyou(ctx3, cardId), pairs = GameStateFn2.getCardTipStrBaSyouPairs(ctx3, \"\\u6253\\u958B\\u81EA\\u8ECD\\u624B\\u88E1\\u6216\\u6307\\u5B9AHANGER\\u4E2D\\u7279\\u5FB5A\\u4E26\\u5408\\u8A08\\u570B\\u529Bx\\u4EE5\\u4E0B\\u76841\\u5F35\\u5361\", cardId);\n                              if (pairs.length == 0)\n                                throw new Error(`pairs must not 0: ${effect2.text.description}`);\n                              const targetPair = pairs[0], ges = GameStateFn2.getGlobalEffects(ctx3, null);\n                              return ctx3 = GameStateFn2.setGlobalEffects(ctx3, null, ges), GameStateFn2.assertTargetMissingError(ctx3, targetPair), ctx3 = GameStateFn2.doItemSwap(ctx3, [cardId, basyou], targetPair), ctx3 = GameStateFn2.doItemSetRollState(ctx3, !1, [cardId, basyou], { isSkipTargetMissing: !0 }), ctx3 = GameStateFn2.doItemMove(ctx3, DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(basyou, \"\\u30B8\\u30E3\\u30F3\\u30AF\\u30E4\\u30FC\\u30C9\"), targetPair, { ges }), ctx3 = GameStateFn2.doTriggerEvent(ctx3, { title: [\"\\u300C\\u6539\\u88C5\\u300D\\u306E\\u52B9\\u679C\\u3067\\u5EC3\\u68C4\\u3055\\u308C\\u308B\\u5834\\u5408\"], cardIds: [targetPair[0]] }), ctx3 = GameStateFn2.doTriggerEvent(ctx3, { title: [\"\\u300C\\u6539\\u88C5\\u300D\\u306E\\u52B9\\u679C\\u3067\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId] }), ctx3;\n                            }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 963,
            "description": "onEffectStart: 打開自軍手裡或指定HANGER中特徵A並合計國力x以下的1張卡, 和這張卡重置狀態置換, 這張卡置換後廢棄. x為自軍G的張數",
            "effect": {
                "id": "addStackEffect_019294bd-420a-7003-9ba6-8d7fc90ca9a0",
                "reason": [
                    "PlayText",
                    "PlayerB",
                    "PlayerB_72",
                    "loadPrototype_179024_04B_U_BK067C_black_text_2"
                ],
                "description": "打開自軍手裡或指定HANGER中特徵A並合計國力x以下的1張卡, 和這張卡重置狀態置換, 這張卡置換後廢棄. x為自軍G的張數",
                "text": {
                    "id": "loadPrototype_179024_04B_U_BK067C_black_text_2",
                    "title": [
                        "使用型",
                        [
                            "戦闘フェイズ"
                        ]
                    ],
                    "description": "打開自軍手裡或指定HANGER中特徵A並合計國力x以下的1張卡, 和這張卡重置狀態置換, 這張卡置換後廢棄. x為自軍G的張數",
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect2, { GameStateFn: GameStateFn2, DefineFn: DefineFn2 }) {\n                              const cardId = DefineFn2.EffectFn.getCardID(effect2), basyou = GameStateFn2.getItemBaSyou(ctx3, cardId), pairs = GameStateFn2.getCardTipStrBaSyouPairs(ctx3, \"\\u6253\\u958B\\u81EA\\u8ECD\\u624B\\u88E1\\u6216\\u6307\\u5B9AHANGER\\u4E2D\\u7279\\u5FB5A\\u4E26\\u5408\\u8A08\\u570B\\u529Bx\\u4EE5\\u4E0B\\u76841\\u5F35\\u5361\", cardId);\n                              if (pairs.length == 0)\n                                throw new Error(`pairs must not 0: ${effect2.text.description}`);\n                              const targetPair = pairs[0], ges = GameStateFn2.getGlobalEffects(ctx3, null);\n                              return ctx3 = GameStateFn2.setGlobalEffects(ctx3, null, ges), GameStateFn2.assertTargetMissingError(ctx3, targetPair), ctx3 = GameStateFn2.doItemSwap(ctx3, [cardId, basyou], targetPair), ctx3 = GameStateFn2.doItemSetRollState(ctx3, !1, [cardId, basyou], { isSkipTargetMissing: !0 }), ctx3 = GameStateFn2.doItemMove(ctx3, DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(basyou, \"\\u30B8\\u30E3\\u30F3\\u30AF\\u30E4\\u30FC\\u30C9\"), targetPair, { ges }), ctx3 = GameStateFn2.doTriggerEvent(ctx3, { title: [\"\\u300C\\u6539\\u88C5\\u300D\\u306E\\u52B9\\u679C\\u3067\\u5EC3\\u68C4\\u3055\\u308C\\u308B\\u5834\\u5408\"], cardIds: [targetPair[0]] }), ctx3 = GameStateFn2.doTriggerEvent(ctx3, { title: [\"\\u300C\\u6539\\u88C5\\u300D\\u306E\\u52B9\\u679C\\u3067\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId] }), ctx3;\n                            }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 962,
            "description": "onEffectEnd: 打開自軍手裡或指定HANGER中特徵A並合計國力x以下的1張卡, 和這張卡重置狀態置換, 這張卡置換後廢棄. x為自軍G的張數"
        },
        {
            "id": 961,
            "description": "onEffectStart: 打開自軍手裡或指定HANGER中特徵A並合計國力x以下的1張卡, 和這張卡重置狀態置換, 這張卡置換後廢棄. x為自軍G的張數",
            "effect": {
                "id": "createPlayEffects_PlayerB_PlayerB_72_loadPrototype_179024_04B_U_BK067C_black_text_2",
                "reason": [
                    "PlayText",
                    "PlayerB",
                    "PlayerB_72",
                    "loadPrototype_179024_04B_U_BK067C_black_text_2"
                ],
                "description": "打開自軍手裡或指定HANGER中特徵A並合計國力x以下的1張卡, 和這張卡重置狀態置換, 這張卡置換後廢棄. x為自軍G的張數",
                "text": {
                    "id": "loadPrototype_179024_04B_U_BK067C_black_text_2",
                    "title": [
                        "使用型",
                        [
                            "戦闘フェイズ"
                        ]
                    ],
                    "description": "打開自軍手裡或指定HANGER中特徵A並合計國力x以下的1張卡, 和這張卡重置狀態置換, 這張卡置換後廢棄. x為自軍G的張數",
                    "conditions": {
                        "打開自軍手裡或指定HANGER中特徵A並合計國力x以下的1張卡": {
                            "title": "function _(ctx2, effect, bridge) {\n                const { A: A2 } = {\"A\":\"ヘイズル系\"};\n                if (A2 == \"\")\n                  throw new Error(\"A\\u6C92\\u6709\\u88AB\\u5B57\\u4E32\\u7F6E\\u63DB\");\n                const { GameStateFn, DefineFn } = bridge, cardId = DefineFn.EffectFn.getCardID(effect), cardController = GameStateFn.getItemController(ctx2, cardId), gCount = GameStateFn.getItemIdsByBasyou(ctx2, DefineFn.AbsoluteBaSyouFn.of(cardController, \"G\\u30BE\\u30FC\\u30F3\")).length;\n                return GameStateFn.createConditionTitleFn({\n                  title: [\"\\u6253\\u958B\\u81EA\\u8ECD\\u624B\\u88E1\\u6216\\u6307\\u5B9AHANGER\\u4E2D\\u7279\\u5FB5_A\\u4E26\\u5408\\u8A08\\u570B\\u529B_x\\u4EE5\\u4E0B\\u7684_1\\u5F35\\u5361\", A2, gCount, 1]\n                })(ctx2, effect, bridge);\n              }"
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
                                    "title": "function _(ctx2, effect, { GameStateFn, DefineFn }) {\n                    const newE = DefineFn.EffectFn.fromEffectBasic(effect, {\n                      logicTreeAction: {\n                        actions: [\n                          {\n                            title: function _(ctx3, effect2, { GameStateFn: GameStateFn2, DefineFn: DefineFn2 }) {\n                              const cardId = DefineFn2.EffectFn.getCardID(effect2), basyou = GameStateFn2.getItemBaSyou(ctx3, cardId), pairs = GameStateFn2.getCardTipStrBaSyouPairs(ctx3, \"\\u6253\\u958B\\u81EA\\u8ECD\\u624B\\u88E1\\u6216\\u6307\\u5B9AHANGER\\u4E2D\\u7279\\u5FB5A\\u4E26\\u5408\\u8A08\\u570B\\u529Bx\\u4EE5\\u4E0B\\u76841\\u5F35\\u5361\", cardId);\n                              if (pairs.length == 0)\n                                throw new Error(`pairs must not 0: ${effect2.text.description}`);\n                              const targetPair = pairs[0], ges = GameStateFn2.getGlobalEffects(ctx3, null);\n                              return ctx3 = GameStateFn2.setGlobalEffects(ctx3, null, ges), GameStateFn2.assertTargetMissingError(ctx3, targetPair), ctx3 = GameStateFn2.doItemSwap(ctx3, [cardId, basyou], targetPair), ctx3 = GameStateFn2.doItemSetRollState(ctx3, !1, [cardId, basyou], { isSkipTargetMissing: !0 }), ctx3 = GameStateFn2.doItemMove(ctx3, DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(basyou, \"\\u30B8\\u30E3\\u30F3\\u30AF\\u30E4\\u30FC\\u30C9\"), targetPair, { ges }), ctx3 = GameStateFn2.doTriggerEvent(ctx3, { title: [\"\\u300C\\u6539\\u88C5\\u300D\\u306E\\u52B9\\u679C\\u3067\\u5EC3\\u68C4\\u3055\\u308C\\u308B\\u5834\\u5408\"], cardIds: [targetPair[0]] }), ctx3 = GameStateFn2.doTriggerEvent(ctx3, { title: [\"\\u300C\\u6539\\u88C5\\u300D\\u306E\\u52B9\\u679C\\u3067\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId] }), ctx3;\n                            }.toString()\n                          }\n                        ]\n                      }\n                    });\n                    return ctx2 = GameStateFn.addStackEffect(ctx2, newE), ctx2;\n                  }"
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 960,
            "description": "onEffectEnd: （敵軍帰還ステップ）〔黒１〕：「特徴：T3部隊」を持つ自軍ユニット１枚を持ち主の手札に移す。"
        },
        {
            "id": 959,
            "description": "onItemMove:PlayerB_55 = [\"PlayerB\",\"本国\"] => [\"PlayerB\",\"手札\"]",
            "effect": {
                "id": "createPlayEffects_PlayerB_PlayerB_72_loadPrototype_179024_04B_U_BK067C_black_text_0",
                "reason": [
                    "PlayText",
                    "PlayerB",
                    "PlayerB_72",
                    "loadPrototype_179024_04B_U_BK067C_black_text_0"
                ],
                "description": "（敵軍帰還ステップ）〔黒１〕：「特徴：T3部隊」を持つ自軍ユニット１枚を持ち主の手札に移す。",
                "text": {
                    "id": "loadPrototype_179024_04B_U_BK067C_black_text_0",
                    "description": "（敵軍帰還ステップ）〔黒１〕：「特徴：T3部隊」を持つ自軍ユニット１枚を持ち主の手札に移す。",
                    "title": [
                        "使用型",
                        [
                            "敵軍",
                            "帰還ステップ"
                        ]
                    ],
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
                            ]
                        },
                        "「特徴：T3部隊」を持つ自軍ユニット１枚": {
                            "title": [
                                "Entity",
                                {
                                    "hasChar": [
                                        "T3部隊"
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
                                        "Action",
                                        {
                                            "move": {
                                                "id": "RelatedBaSyou",
                                                "value": [
                                                    "持ち主",
                                                    "手札"
                                                ]
                                            }
                                        }
                                    ],
                                    "vars": [
                                        "「特徴：T3部隊」を持つ自軍ユニット１枚"
                                    ]
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 958,
            "description": "onEvent: GameEventOnMove [\"PlayerB_55\"]",
            "effect": {
                "id": "createPlayEffects_PlayerB_PlayerB_72_loadPrototype_179024_04B_U_BK067C_black_text_0",
                "reason": [
                    "PlayText",
                    "PlayerB",
                    "PlayerB_72",
                    "loadPrototype_179024_04B_U_BK067C_black_text_0"
                ],
                "description": "（敵軍帰還ステップ）〔黒１〕：「特徴：T3部隊」を持つ自軍ユニット１枚を持ち主の手札に移す。",
                "text": {
                    "id": "loadPrototype_179024_04B_U_BK067C_black_text_0",
                    "description": "（敵軍帰還ステップ）〔黒１〕：「特徴：T3部隊」を持つ自軍ユニット１枚を持ち主の手札に移す。",
                    "title": [
                        "使用型",
                        [
                            "敵軍",
                            "帰還ステップ"
                        ]
                    ],
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
                            ]
                        },
                        "「特徴：T3部隊」を持つ自軍ユニット１枚": {
                            "title": [
                                "Entity",
                                {
                                    "hasChar": [
                                        "T3部隊"
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
                                        "Action",
                                        {
                                            "move": {
                                                "id": "RelatedBaSyou",
                                                "value": [
                                                    "持ち主",
                                                    "手札"
                                                ]
                                            }
                                        }
                                    ],
                                    "vars": [
                                        "「特徴：T3部隊」を持つ自軍ユニット１枚"
                                    ]
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 957,
            "description": "PlayerB_55.isRoll undefined => false",
            "effect": {
                "id": "createPlayEffects_PlayerB_PlayerB_72_loadPrototype_179024_04B_U_BK067C_black_text_0",
                "reason": [
                    "PlayText",
                    "PlayerB",
                    "PlayerB_72",
                    "loadPrototype_179024_04B_U_BK067C_black_text_0"
                ],
                "description": "（敵軍帰還ステップ）〔黒１〕：「特徴：T3部隊」を持つ自軍ユニット１枚を持ち主の手札に移す。",
                "text": {
                    "id": "loadPrototype_179024_04B_U_BK067C_black_text_0",
                    "description": "（敵軍帰還ステップ）〔黒１〕：「特徴：T3部隊」を持つ自軍ユニット１枚を持ち主の手札に移す。",
                    "title": [
                        "使用型",
                        [
                            "敵軍",
                            "帰還ステップ"
                        ]
                    ],
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
                            ]
                        },
                        "「特徴：T3部隊」を持つ自軍ユニット１枚": {
                            "title": [
                                "Entity",
                                {
                                    "hasChar": [
                                        "T3部隊"
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
                                        "Action",
                                        {
                                            "move": {
                                                "id": "RelatedBaSyou",
                                                "value": [
                                                    "持ち主",
                                                    "手札"
                                                ]
                                            }
                                        }
                                    ],
                                    "vars": [
                                        "「特徴：T3部隊」を持つ自軍ユニット１枚"
                                    ]
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 956,
            "description": "PlayerB_85.isRoll false => true",
            "effect": {
                "id": "createPlayEffects_PlayerB_PlayerB_72_loadPrototype_179024_04B_U_BK067C_black_text_0",
                "reason": [
                    "PlayText",
                    "PlayerB",
                    "PlayerB_72",
                    "loadPrototype_179024_04B_U_BK067C_black_text_0"
                ],
                "description": "（敵軍帰還ステップ）〔黒１〕：「特徴：T3部隊」を持つ自軍ユニット１枚を持ち主の手札に移す。",
                "text": {
                    "id": "loadPrototype_179024_04B_U_BK067C_black_text_0",
                    "description": "（敵軍帰還ステップ）〔黒１〕：「特徴：T3部隊」を持つ自軍ユニット１枚を持ち主の手札に移す。",
                    "title": [
                        "使用型",
                        [
                            "敵軍",
                            "帰還ステップ"
                        ]
                    ],
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
                            ]
                        },
                        "「特徴：T3部隊」を持つ自軍ユニット１枚": {
                            "title": [
                                "Entity",
                                {
                                    "hasChar": [
                                        "T3部隊"
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
                                        "Action",
                                        {
                                            "move": {
                                                "id": "RelatedBaSyou",
                                                "value": [
                                                    "持ち主",
                                                    "手札"
                                                ]
                                            }
                                        }
                                    ],
                                    "vars": [
                                        "「特徴：T3部隊」を持つ自軍ユニット１枚"
                                    ]
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 955,
            "description": "onEffectStart: （敵軍帰還ステップ）〔黒１〕：「特徴：T3部隊」を持つ自軍ユニット１枚を持ち主の手札に移す。",
            "effect": {
                "id": "createPlayEffects_PlayerB_PlayerB_72_loadPrototype_179024_04B_U_BK067C_black_text_0",
                "reason": [
                    "PlayText",
                    "PlayerB",
                    "PlayerB_72",
                    "loadPrototype_179024_04B_U_BK067C_black_text_0"
                ],
                "description": "（敵軍帰還ステップ）〔黒１〕：「特徴：T3部隊」を持つ自軍ユニット１枚を持ち主の手札に移す。",
                "text": {
                    "id": "loadPrototype_179024_04B_U_BK067C_black_text_0",
                    "description": "（敵軍帰還ステップ）〔黒１〕：「特徴：T3部隊」を持つ自軍ユニット１枚を持ち主の手札に移す。",
                    "title": [
                        "使用型",
                        [
                            "敵軍",
                            "帰還ステップ"
                        ]
                    ],
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
                            ]
                        },
                        "「特徴：T3部隊」を持つ自軍ユニット１枚": {
                            "title": [
                                "Entity",
                                {
                                    "hasChar": [
                                        "T3部隊"
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
                                        "Action",
                                        {
                                            "move": {
                                                "id": "RelatedBaSyou",
                                                "value": [
                                                    "持ち主",
                                                    "手札"
                                                ]
                                            }
                                        }
                                    ],
                                    "vars": [
                                        "「特徴：T3部隊」を持つ自軍ユニット１枚"
                                    ]
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 954,
            "description": "onSetPhase:戦闘フェイズ,帰還ステップ,フリータイミング"
        },
        {
            "id": 953,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 952,
            "description": "onSetPhase:戦闘フェイズ,帰還ステップ,ステップ開始"
        },
        {
            "id": 951,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 950,
            "description": "onSetPhase:戦闘フェイズ,ダメージ判定ステップ,ステップ終了"
        },
        {
            "id": 949,
            "description": "onSetPhase:戦闘フェイズ,ダメージ判定ステップ,フリータイミング2"
        },
        {
            "id": 948,
            "description": "onEffectEnd: getDamageRuleEffect"
        },
        {
            "id": 947,
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
            "id": 946,
            "description": "onSetPhase:戦闘フェイズ,ダメージ判定ステップ,規定の効果"
        },
        {
            "id": 945,
            "description": "onSetPhase:戦闘フェイズ,ダメージ判定ステップ,フリータイミング"
        },
        {
            "id": 944,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 943,
            "description": "onSetPhase:戦闘フェイズ,ダメージ判定ステップ,ステップ開始"
        },
        {
            "id": 942,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 941,
            "description": "onSetPhase:戦闘フェイズ,防御ステップ,ステップ終了"
        },
        {
            "id": 940,
            "description": "onSetPhase:戦闘フェイズ,防御ステップ,フリータイミング2"
        },
        {
            "id": 939,
            "description": "onEffectEnd: 出擊"
        },
        {
            "id": 938,
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
            "id": 937,
            "description": "onSetPhase:戦闘フェイズ,防御ステップ,規定の効果"
        },
        {
            "id": 936,
            "description": "onSetPhase:戦闘フェイズ,防御ステップ,フリータイミング"
        },
        {
            "id": 935,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 934,
            "description": "onSetPhase:戦闘フェイズ,防御ステップ,ステップ開始"
        },
        {
            "id": 933,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 932,
            "description": "onSetPhase:戦闘フェイズ,攻撃ステップ,ステップ終了"
        },
        {
            "id": 931,
            "description": "onSetPhase:戦闘フェイズ,攻撃ステップ,フリータイミング2"
        },
        {
            "id": 930,
            "description": "onSetPhase:戦闘フェイズ,攻撃ステップ,規定の効果"
        },
        {
            "id": 929,
            "description": "onSetPhase:戦闘フェイズ,攻撃ステップ,フリータイミング"
        },
        {
            "id": 928,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 927,
            "description": "onSetPhase:戦闘フェイズ,攻撃ステップ,ステップ開始"
        },
        {
            "id": 926,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 925,
            "description": "onSetPhase:配備フェイズ,フェイズ終了"
        },
        {
            "id": 924,
            "description": "onEvent: カット終了時 undefined"
        },
        {
            "id": 923,
            "description": "onEffectEnd: Play 高機動型ザクⅡ（ロバート・ギリアム機）"
        },
        {
            "id": 922,
            "description": "onEvent: プレイされて場に出た場合 [\"PlayerA_12\"]",
            "effect": {
                "id": "createUnitGoStageEffectFromPlayEffect_PlayerA_12",
                "reason": [
                    "場に出る",
                    "PlayerA",
                    "PlayerA_12"
                ],
                "description": "Play 高機動型ザクⅡ（ロバート・ギリアム機）",
                "text": {
                    "id": "createPlayUnitEffect_PlayerA_12",
                    "description": "Play 高機動型ザクⅡ（ロバート・ギリアム機）",
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
            "id": 921,
            "description": "PlayerA_12.isRoll false => true",
            "effect": {
                "id": "createUnitGoStageEffectFromPlayEffect_PlayerA_12",
                "reason": [
                    "場に出る",
                    "PlayerA",
                    "PlayerA_12"
                ],
                "description": "Play 高機動型ザクⅡ（ロバート・ギリアム機）",
                "text": {
                    "id": "createPlayUnitEffect_PlayerA_12",
                    "description": "Play 高機動型ザクⅡ（ロバート・ギリアム機）",
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
            "id": 920,
            "description": "onItemMove:PlayerA_12 = [\"PlayerA\",\"プレイされているカード\"] => [\"PlayerA\",\"配備エリア\"]",
            "effect": {
                "id": "createUnitGoStageEffectFromPlayEffect_PlayerA_12",
                "reason": [
                    "場に出る",
                    "PlayerA",
                    "PlayerA_12"
                ],
                "description": "Play 高機動型ザクⅡ（ロバート・ギリアム機）",
                "text": {
                    "id": "createPlayUnitEffect_PlayerA_12",
                    "description": "Play 高機動型ザクⅡ（ロバート・ギリアム機）",
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
            "id": 919,
            "description": "onEvent: GameEventOnMove [\"PlayerA_12\"]",
            "effect": {
                "id": "createUnitGoStageEffectFromPlayEffect_PlayerA_12",
                "reason": [
                    "場に出る",
                    "PlayerA",
                    "PlayerA_12"
                ],
                "description": "Play 高機動型ザクⅡ（ロバート・ギリアム機）",
                "text": {
                    "id": "createPlayUnitEffect_PlayerA_12",
                    "description": "Play 高機動型ザクⅡ（ロバート・ギリアム機）",
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
            "id": 918,
            "description": "onEvent: このカードが場に出た場合 [\"PlayerA_12\"]",
            "effect": {
                "id": "createUnitGoStageEffectFromPlayEffect_PlayerA_12",
                "reason": [
                    "場に出る",
                    "PlayerA",
                    "PlayerA_12"
                ],
                "description": "Play 高機動型ザクⅡ（ロバート・ギリアム機）",
                "text": {
                    "id": "createPlayUnitEffect_PlayerA_12",
                    "description": "Play 高機動型ザクⅡ（ロバート・ギリアム機）",
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
            "id": 917,
            "description": "onEffectStart: Play 高機動型ザクⅡ（ロバート・ギリアム機）",
            "effect": {
                "id": "createUnitGoStageEffectFromPlayEffect_PlayerA_12",
                "reason": [
                    "場に出る",
                    "PlayerA",
                    "PlayerA_12"
                ],
                "description": "Play 高機動型ザクⅡ（ロバート・ギリアム機）",
                "text": {
                    "id": "createPlayUnitEffect_PlayerA_12",
                    "description": "Play 高機動型ザクⅡ（ロバート・ギリアム機）",
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
            "id": 916,
            "description": "onEffectEnd: Play 高機動型ザクⅡ（ロバート・ギリアム機）"
        },
        {
            "id": 915,
            "description": "onItemMove:PlayerA_12 = [\"PlayerA\",\"手札\"] => [\"PlayerA\",\"プレイされているカード\"]",
            "effect": {
                "id": "createPlayUnitEffect_PlayerA_12",
                "reason": [
                    "PlayCard",
                    "PlayerA",
                    "PlayerA_12",
                    {
                        "isPlayUnit": true
                    }
                ],
                "description": "Play 高機動型ザクⅡ（ロバート・ギリアム機）",
                "text": {
                    "id": "createPlayUnitEffect_PlayerA_12",
                    "title": [
                        "使用型",
                        [
                            "自軍",
                            "配備フェイズ"
                        ]
                    ],
                    "description": "Play 高機動型ザクⅡ（ロバート・ギリアム機）",
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
            "id": 914,
            "description": "onEvent: GameEventOnMove [\"PlayerA_12\"]",
            "effect": {
                "id": "createPlayUnitEffect_PlayerA_12",
                "reason": [
                    "PlayCard",
                    "PlayerA",
                    "PlayerA_12",
                    {
                        "isPlayUnit": true
                    }
                ],
                "description": "Play 高機動型ザクⅡ（ロバート・ギリアム機）",
                "text": {
                    "id": "createPlayUnitEffect_PlayerA_12",
                    "title": [
                        "使用型",
                        [
                            "自軍",
                            "配備フェイズ"
                        ]
                    ],
                    "description": "Play 高機動型ザクⅡ（ロバート・ギリアム機）",
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
            "id": 913,
            "description": "PlayerA_12.isRoll undefined => false",
            "effect": {
                "id": "createPlayUnitEffect_PlayerA_12",
                "reason": [
                    "PlayCard",
                    "PlayerA",
                    "PlayerA_12",
                    {
                        "isPlayUnit": true
                    }
                ],
                "description": "Play 高機動型ザクⅡ（ロバート・ギリアム機）",
                "text": {
                    "id": "createPlayUnitEffect_PlayerA_12",
                    "title": [
                        "使用型",
                        [
                            "自軍",
                            "配備フェイズ"
                        ]
                    ],
                    "description": "Play 高機動型ザクⅡ（ロバート・ギリアム機）",
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
            "id": 912,
            "description": "onEvent: プレイした場合 [\"PlayerA_12\"]",
            "effect": {
                "id": "createPlayUnitEffect_PlayerA_12",
                "reason": [
                    "PlayCard",
                    "PlayerA",
                    "PlayerA_12",
                    {
                        "isPlayUnit": true
                    }
                ],
                "description": "Play 高機動型ザクⅡ（ロバート・ギリアム機）",
                "text": {
                    "id": "createPlayUnitEffect_PlayerA_12",
                    "title": [
                        "使用型",
                        [
                            "自軍",
                            "配備フェイズ"
                        ]
                    ],
                    "description": "Play 高機動型ザクⅡ（ロバート・ギリアム機）",
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
            "id": 911,
            "description": "PlayerA_40.isRoll false => true",
            "effect": {
                "id": "createPlayUnitEffect_PlayerA_12",
                "reason": [
                    "PlayCard",
                    "PlayerA",
                    "PlayerA_12",
                    {
                        "isPlayUnit": true
                    }
                ],
                "description": "Play 高機動型ザクⅡ（ロバート・ギリアム機）",
                "text": {
                    "id": "createPlayUnitEffect_PlayerA_12",
                    "title": [
                        "使用型",
                        [
                            "自軍",
                            "配備フェイズ"
                        ]
                    ],
                    "description": "Play 高機動型ザクⅡ（ロバート・ギリアム機）",
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
            "id": 910,
            "description": "PlayerA_20.isRoll false => true",
            "effect": {
                "id": "createPlayUnitEffect_PlayerA_12",
                "reason": [
                    "PlayCard",
                    "PlayerA",
                    "PlayerA_12",
                    {
                        "isPlayUnit": true
                    }
                ],
                "description": "Play 高機動型ザクⅡ（ロバート・ギリアム機）",
                "text": {
                    "id": "createPlayUnitEffect_PlayerA_12",
                    "title": [
                        "使用型",
                        [
                            "自軍",
                            "配備フェイズ"
                        ]
                    ],
                    "description": "Play 高機動型ザクⅡ（ロバート・ギリアム機）",
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
            "id": 909,
            "description": "onEffectStart: Play 高機動型ザクⅡ（ロバート・ギリアム機）",
            "effect": {
                "id": "createPlayUnitEffect_PlayerA_12",
                "reason": [
                    "PlayCard",
                    "PlayerA",
                    "PlayerA_12",
                    {
                        "isPlayUnit": true
                    }
                ],
                "description": "Play 高機動型ザクⅡ（ロバート・ギリアム機）",
                "text": {
                    "id": "createPlayUnitEffect_PlayerA_12",
                    "title": [
                        "使用型",
                        [
                            "自軍",
                            "配備フェイズ"
                        ]
                    ],
                    "description": "Play 高機動型ザクⅡ（ロバート・ギリアム機）",
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
            "id": 908,
            "description": "onEffectEnd: PlayG"
        },
        {
            "id": 907,
            "description": "onEvent: このカードがGとして場に出た場合 [\"PlayerA_44\"]",
            "effect": {
                "id": "createPlayGEffect_PlayerA_44",
                "reason": [
                    "PlayCard",
                    "PlayerA",
                    "PlayerA_44",
                    {
                        "isPlayG": true
                    }
                ],
                "description": "Play G",
                "text": {
                    "id": "createPlayGEffect_PlayerA_44",
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
            "id": 906,
            "description": "onEvent: プレイされて場に出た場合 [\"PlayerA_44\"]",
            "effect": {
                "id": "createPlayGEffect_PlayerA_44",
                "reason": [
                    "PlayCard",
                    "PlayerA",
                    "PlayerA_44",
                    {
                        "isPlayG": true
                    }
                ],
                "description": "Play G",
                "text": {
                    "id": "createPlayGEffect_PlayerA_44",
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
            "id": 905,
            "description": "onItemMove:PlayerA_44 = [\"PlayerA\",\"手札\"] => [\"PlayerA\",\"Gゾーン\"]",
            "effect": {
                "id": "createPlayGEffect_PlayerA_44",
                "reason": [
                    "PlayCard",
                    "PlayerA",
                    "PlayerA_44",
                    {
                        "isPlayG": true
                    }
                ],
                "description": "Play G",
                "text": {
                    "id": "createPlayGEffect_PlayerA_44",
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
            "id": 904,
            "description": "onEvent: GameEventOnMove [\"PlayerA_44\"]",
            "effect": {
                "id": "createPlayGEffect_PlayerA_44",
                "reason": [
                    "PlayCard",
                    "PlayerA",
                    "PlayerA_44",
                    {
                        "isPlayG": true
                    }
                ],
                "description": "Play G",
                "text": {
                    "id": "createPlayGEffect_PlayerA_44",
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
            "id": 903,
            "description": "PlayerA_44.isFaceDown true => false",
            "effect": {
                "id": "createPlayGEffect_PlayerA_44",
                "reason": [
                    "PlayCard",
                    "PlayerA",
                    "PlayerA_44",
                    {
                        "isPlayG": true
                    }
                ],
                "description": "Play G",
                "text": {
                    "id": "createPlayGEffect_PlayerA_44",
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
            "id": 902,
            "description": "onPlayerStateChange:PlayerA",
            "effect": {
                "id": "createPlayGEffect_PlayerA_44",
                "reason": [
                    "PlayCard",
                    "PlayerA",
                    "PlayerA_44",
                    {
                        "isPlayG": true
                    }
                ],
                "description": "Play G",
                "text": {
                    "id": "createPlayGEffect_PlayerA_44",
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
            "id": 901,
            "description": "onEffectStart: PlayG",
            "effect": {
                "id": "createPlayGEffect_PlayerA_44",
                "reason": [
                    "PlayCard",
                    "PlayerA",
                    "PlayerA_44",
                    {
                        "isPlayG": true
                    }
                ],
                "description": "Play G",
                "text": {
                    "id": "createPlayGEffect_PlayerA_44",
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
            "id": 900,
            "description": "onSetPhase:配備フェイズ,フリータイミング"
        },
        {
            "id": 899,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 898,
            "description": "onSetPhase:配備フェイズ,フェイズ開始"
        },
        {
            "id": 897,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 896,
            "description": "onSetPhase:ドローフェイズ,フェイズ終了"
        },
        {
            "id": 895,
            "description": "onSetPhase:ドローフェイズ,フリータイミング"
        },
        {
            "id": 894,
            "description": "onEffectEnd: 抽牌階段規定效果"
        },
        {
            "id": 893,
            "description": "onItemMove:PlayerA_17 = [\"PlayerA\",\"本国\"] => [\"PlayerA\",\"手札\"]",
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
            "id": 892,
            "description": "onEvent: GameEventOnMove [\"PlayerA_17\"]",
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
            "id": 891,
            "description": "PlayerA_17.isRoll undefined => false",
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
            "id": 890,
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
            "id": 889,
            "description": "onSetPhase:ドローフェイズ,規定の効果"
        },
        {
            "id": 888,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 887,
            "description": "onSetPhase:ドローフェイズ,フェイズ開始"
        }
    ],
    "messagesCurrentEffect": null,
    "messagesIsPlayerRead": {},
    "turn": 9,
    "setGroup": {
        "itemGroupParent": {
            "PlayerA_34": "PlayerA_28"
        },
        "itemGroupChildren": {
            "PlayerA_28": [
                "PlayerA_34"
            ]
        }
    },
    "stackEffectMemory": [],
    "flowMemory": {
        "state": "playing",
        "hasTriggerEvent": false,
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
        "activeEffectID": "addStackEffect_019294be-ce81-7003-a2e7-88ea2138cf44",
        "activeLogicID": 0,
        "activeLogicSubID": 0
    }
}