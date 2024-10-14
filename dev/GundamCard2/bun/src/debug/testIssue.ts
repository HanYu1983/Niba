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
    ctx = setPhase(ctx, ["戦闘フェイズ", "防御ステップ", "フリータイミング"]) as GameStateWithFlowMemory
    ctx = updateCommand(ctx) as GameStateWithFlowMemory
    console.log("getPlayerCommands", getPlayerCommands(ctx, PlayerA).length)
    console.log("getPlayerCommandsFilterNoError", getPlayerCommandsFilterNoError(ctx, PlayerA).length)
    let flows = queryFlow(ctx, PlayerA)
    let flow: any = flows.find(flow => flow.id == "FlowSetActiveEffectID")
    if (flow == null) {
        throw new Error()
    }
    ctx = applyFlow(ctx, PlayerA, flow)

    flows = queryFlow(ctx, PlayerA).filter(flow => flow.id == "FlowSetTipSelection")
    flows.forEach(flow=>{
        ctx = applyFlow(ctx, PlayerA, flow)
    })
    console.log("getPlayerCommands", getPlayerCommands(ctx, PlayerA).length)
    console.log("getPlayerCommandsFilterNoError", getPlayerCommandsFilterNoError(ctx, PlayerA).length)

    flows = queryFlow(ctx, PlayerA)
    flow = flows.find(flow => flow.id == "FlowPassPayCost")
    if (flow == null) {
        throw new Error()
    }
    ctx = applyFlow(ctx, PlayerA, flow)


    flows = queryFlow(ctx, PlayerA)
    flow = flows.find(flow => flow.id == "FlowObserveEffect")
    if (flow == null) {
        throw new Error()
    }

    flows = queryFlow(ctx, PlayerB)
    flow = flows.find(flow => flow.id == "FlowPassPayCost")
    if (flow == null) {
        throw new Error()
    }
    ctx = applyFlow(ctx, PlayerB, flow)

    flows = queryFlow(ctx, PlayerA)
    flow = flows.find(flow => flow.id == "FlowDoEffect")
    if (flow == null) {
        throw new Error()
    }
    ctx = applyFlow(ctx, PlayerA, flow)
    console.log("getPlayerCommands", getPlayerCommands(ctx, PlayerA).length)
    console.log("getPlayerCommandsFilterNoError", getPlayerCommandsFilterNoError(ctx, PlayerA).length)

    flows = queryFlow(ctx, PlayerA)
    flow = flows.find(flow => flow.id == "FlowSetActiveEffectID")
    if (flow == null) {
        throw new Error()
    }
    ctx = applyFlow(ctx, PlayerA, flow)

    flows = queryFlow(ctx, PlayerA)
    flow = flows.find(flow => flow.id == "FlowPassPayCost")
    if (flow == null) {
        throw new Error()
    }
    ctx = applyFlow(ctx, PlayerA, flow)
    flows = queryFlow(ctx, PlayerA)

    flows = queryFlow(ctx, PlayerB)
    flow = flows.find(flow => flow.id == "FlowPassPayCost")
    if (flow == null) {
        throw new Error()
    }
    ctx = applyFlow(ctx, PlayerB, flow)
    console.log("=========", ctx.flowMemory.hasPlayerPassCut)
    console.log("getPlayerCommandsFilterNoError", getPlayerCommandsFilterNoError(ctx, PlayerA).length)

    flows = queryFlow(ctx, PlayerA)
    flow = flows.find(flow => flow.id == "FlowDoEffect")
    if (flow == null) {
        throw new Error()
    }
    ctx = applyFlow(ctx, PlayerA, flow)
    console.log("=========", ctx.flowMemory.hasPlayerPassCut)
    console.log("getPlayerCommandsFilterNoError", getPlayerCommandsFilterNoError(ctx, PlayerA).length)


    flows = queryFlow(ctx, PlayerB)
    flow = flows.find(flow => flow.id == "FlowHandleStackEffectFinished")
    if (flow == null) {
        throw new Error()
    }
    ctx = applyFlow(ctx, PlayerB, flow)
    

    flows = queryFlow(ctx, PlayerB)
    flow = flows.find(flow => flow.id == "FlowPassPhase")
    if (flow == null) {
        throw new Error()
    }
    ctx = applyFlow(ctx, PlayerB, flow)
    console.log("=========", ctx.flowMemory.hasPlayerPassCut)
    console.log("getPlayerCommands", getPlayerCommands(ctx, PlayerA).length)
    console.log("getPlayerCommandsFilterNoError", getPlayerCommandsFilterNoError(ctx, PlayerA).length)
    console.log("getPlayerCommandsFilterNoErrorDistinct", getPlayerCommandsFilterNoErrorDistinct(ctx, PlayerA).length)

    flows = queryFlow(ctx, PlayerA)
    // flow = flows.find(flow => flow.id == "FlowPassPhase")
    // if (flow == null) {
    //     throw new Error()
    // }
    // ctx = applyFlow(ctx, PlayerA, flow)
    console.log(flows)

    


    throw new Error()
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
            "protoID": "179003_01A_O_WT001C_white",
            "ownerID": "PlayerA",
            "isFaceDown": true,
            "isRoll": false
        },
        "PlayerA_2": {
            "id": "PlayerA_2",
            "protoID": "179003_01A_O_WT001C_white",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_3": {
            "id": "PlayerA_3",
            "protoID": "179003_01A_O_WT001C_white",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_4": {
            "id": "PlayerA_4",
            "protoID": "179003_01A_U_WT011C_white",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_5": {
            "id": "PlayerA_5",
            "protoID": "179003_01A_U_WT011C_white",
            "ownerID": "PlayerA",
            "isFaceDown": false,
            "isRoll": false
        },
        "PlayerA_6": {
            "id": "PlayerA_6",
            "protoID": "179003_01A_U_WT011C_white",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_7": {
            "id": "PlayerA_7",
            "protoID": "179009_03B_U_WT044U_white",
            "ownerID": "PlayerA",
            "isFaceDown": false,
            "isRoll": false
        },
        "PlayerA_8": {
            "id": "PlayerA_8",
            "protoID": "179009_03B_U_WT044U_white",
            "ownerID": "PlayerA",
            "isFaceDown": false,
            "isRoll": true
        },
        "PlayerA_9": {
            "id": "PlayerA_9",
            "protoID": "179009_03B_U_WT044U_white",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_10": {
            "id": "PlayerA_10",
            "protoID": "179009_03B_U_WT045U_white",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_11": {
            "id": "PlayerA_11",
            "protoID": "179009_03B_U_WT045U_white",
            "ownerID": "PlayerA",
            "isFaceDown": false
        },
        "PlayerA_12": {
            "id": "PlayerA_12",
            "protoID": "179009_03B_U_WT045U_white",
            "ownerID": "PlayerA",
            "isFaceDown": true,
            "isRoll": false
        },
        "PlayerA_13": {
            "id": "PlayerA_13",
            "protoID": "179015_04B_O_WT005U_white",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_14": {
            "id": "PlayerA_14",
            "protoID": "179015_04B_O_WT005U_white",
            "ownerID": "PlayerA",
            "isFaceDown": false,
            "isRoll": false
        },
        "PlayerA_15": {
            "id": "PlayerA_15",
            "protoID": "179015_04B_O_WT005U_white",
            "ownerID": "PlayerA",
            "isFaceDown": true,
            "isRoll": false
        },
        "PlayerA_16": {
            "id": "PlayerA_16",
            "protoID": "179019_01A_U_WT003C_white",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_17": {
            "id": "PlayerA_17",
            "protoID": "179019_01A_U_WT003C_white",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_18": {
            "id": "PlayerA_18",
            "protoID": "179019_01A_U_WT003C_white",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_19": {
            "id": "PlayerA_19",
            "protoID": "179019_02A_C_WT012U_white",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_20": {
            "id": "PlayerA_20",
            "protoID": "179019_02A_C_WT012U_white",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_21": {
            "id": "PlayerA_21",
            "protoID": "179019_02A_C_WT012U_white",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_22": {
            "id": "PlayerA_22",
            "protoID": "179019_02A_U_WT031C_white",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_23": {
            "id": "PlayerA_23",
            "protoID": "179019_02A_U_WT031C_white",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_24": {
            "id": "PlayerA_24",
            "protoID": "179019_02A_U_WT031C_white",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_25": {
            "id": "PlayerA_25",
            "protoID": "179023_06C_C_WT055C_white",
            "ownerID": "PlayerA",
            "isFaceDown": false,
            "isRoll": false
        },
        "PlayerA_26": {
            "id": "PlayerA_26",
            "protoID": "179023_06C_C_WT055C_white",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_27": {
            "id": "PlayerA_27",
            "protoID": "179023_06C_C_WT055C_white",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_28": {
            "id": "PlayerA_28",
            "protoID": "179024_03B_U_WT039R_white",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_29": {
            "id": "PlayerA_29",
            "protoID": "179024_03B_U_WT039R_white",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_30": {
            "id": "PlayerA_30",
            "protoID": "179024_03B_U_WT039R_white",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_31": {
            "id": "PlayerA_31",
            "protoID": "179024_03B_U_WT042U_white",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_32": {
            "id": "PlayerA_32",
            "protoID": "179024_03B_U_WT042U_white",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_33": {
            "id": "PlayerA_33",
            "protoID": "179024_03B_U_WT042U_white",
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
            "protoID": "179025_07D_CH_WT075C_white",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_36": {
            "id": "PlayerA_36",
            "protoID": "179027_09D_O_WT014N_white",
            "ownerID": "PlayerA",
            "isFaceDown": true,
            "isRoll": false
        },
        "PlayerA_37": {
            "id": "PlayerA_37",
            "protoID": "179027_09D_O_WT014N_white",
            "ownerID": "PlayerA",
            "isFaceDown": true,
            "isRoll": false
        },
        "PlayerA_38": {
            "id": "PlayerA_38",
            "protoID": "179027_09D_O_WT014N_white",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_39": {
            "id": "PlayerA_39",
            "protoID": "179028_10D_CH_WT095_white",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_40": {
            "id": "PlayerA_40",
            "protoID": "179028_10D_U_WT177R_white",
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
            "protoID": "179030_11E_C_WT077S_white",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_44": {
            "id": "PlayerA_44",
            "protoID": "179030_11E_C_WT078R_white",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_45": {
            "id": "PlayerA_45",
            "protoID": "179030_11E_C_WT078R_white",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_46": {
            "id": "PlayerA_46",
            "protoID": "179030_11E_C_WT078R_white",
            "ownerID": "PlayerA",
            "isFaceDown": false,
            "isRoll": false
        },
        "PlayerA_47": {
            "id": "PlayerA_47",
            "protoID": "179901_00_U_WT001P_white_02",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_48": {
            "id": "PlayerA_48",
            "protoID": "179901_00_U_WT001P_white_02",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_49": {
            "id": "PlayerA_49",
            "protoID": "179901_00_U_WT001P_white_02",
            "ownerID": "PlayerA",
            "isFaceDown": true
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
            "isFaceDown": true
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
            "isFaceDown": true,
            "isRoll": false
        },
        "PlayerB_57": {
            "id": "PlayerB_57",
            "protoID": "179003_01A_U_GN008R_green_02",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "PlayerB_58": {
            "id": "PlayerB_58",
            "protoID": "179007_02A_U_GN020R_green",
            "ownerID": "PlayerB",
            "isFaceDown": true,
            "isRoll": false
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
            "isFaceDown": true
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
            "isRoll": false
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
            "isFaceDown": true
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
            "isFaceDown": true,
            "isRoll": false
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
            "isFaceDown": true
        },
        "PlayerB_71": {
            "id": "PlayerB_71",
            "protoID": "179015_04B_U_GN055R_green_haku",
            "ownerID": "PlayerB",
            "isFaceDown": true,
            "isRoll": false
        },
        "PlayerB_72": {
            "id": "PlayerB_72",
            "protoID": "179016_04B_CH_GN035R_green",
            "ownerID": "PlayerB",
            "isFaceDown": true
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
            "isFaceDown": false,
            "isRoll": true
        },
        "PlayerB_75": {
            "id": "PlayerB_75",
            "protoID": "179018_05C_U_GN082U_green",
            "ownerID": "PlayerB",
            "isFaceDown": false,
            "isRoll": false
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
            "isFaceDown": true,
            "isRoll": false
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
            "isFaceDown": true
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
            "isFaceDown": true,
            "isRoll": false
        },
        "PlayerB_82": {
            "id": "PlayerB_82",
            "protoID": "179029_05C_U_GN077R_green",
            "ownerID": "PlayerB",
            "isFaceDown": false,
            "isRoll": false
        },
        "PlayerB_83": {
            "id": "PlayerB_83",
            "protoID": "179030_11E_C_GN074R_green",
            "ownerID": "PlayerB",
            "isFaceDown": true
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
            "isFaceDown": false,
            "isRoll": true
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
            "isFaceDown": true
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
            "isFaceDown": true,
            "isRoll": false
        },
        "PlayerB_96": {
            "id": "PlayerB_96",
            "protoID": "179901_CG_U_GN003P_green",
            "ownerID": "PlayerB",
            "isFaceDown": false,
            "isRoll": true
        },
        "PlayerB_97": {
            "id": "PlayerB_97",
            "protoID": "179901_CG_U_GN003P_green",
            "ownerID": "PlayerB",
            "isFaceDown": false,
            "isRoll": false
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
        "createPlayEffects_PlayerA_PlayerA_7_loadPrototype_179009_03B_U_WT044U_white_text_1": {
            "id": "createPlayEffects_PlayerA_PlayerA_7_loadPrototype_179009_03B_U_WT044U_white_text_1",
            "reason": [
                "PlayText",
                "PlayerA",
                "PlayerA_7",
                "loadPrototype_179009_03B_U_WT044U_white_text_1"
            ],
            "description": "（常時）〔１〕：自軍手札、または自軍ハンガーにある「特徴：メリクリウス系」を持つユニット１枚を、自軍配備エリアにリロール状態で出す。",
            "text": {
                "id": "loadPrototype_179009_03B_U_WT044U_white_text_1",
                "description": "（常時）〔１〕：自軍手札、または自軍ハンガーにある「特徴：メリクリウス系」を持つユニット１枚を、自軍配備エリアにリロール状態で出す。",
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
                    "自軍手札、または自軍ハンガーにある「特徴：メリクリウス系」を持つユニット１枚": {
                        "title": [
                            "Entity",
                            {
                                "side": "自軍",
                                "at": [
                                    "手札",
                                    "ハンガー"
                                ],
                                "hasChar": [
                                    "メリクリウス系"
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
                                                "自軍手札、または自軍ハンガーにある「特徴：メリクリウス系」を持つユニット１枚"
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
        "createPlayEffects_PlayerA_PlayerA_7_loadPrototype_179009_03B_U_WT044U_white_text_2": {
            "id": "createPlayEffects_PlayerA_PlayerA_7_loadPrototype_179009_03B_U_WT044U_white_text_2",
            "reason": [
                "PlayText",
                "PlayerA",
                "PlayerA_7",
                "loadPrototype_179009_03B_U_WT044U_white_text_2"
            ],
            "description": "（戦闘フェイズ）：［ ］の特徴を持つ自軍ユニット１枚は、ターン終了時まで、このカードの本来のテキスト１つと同じテキストを得る。ただし同じテキストは得られない）",
            "text": {
                "id": "loadPrototype_179009_03B_U_WT044U_white_text_2",
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
                            "メリクリウス系",
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
        "createPlayEffects_PlayerA_PlayerA_11_loadPrototype_179009_03B_U_WT045U_white_text_1": {
            "id": "createPlayEffects_PlayerA_PlayerA_11_loadPrototype_179009_03B_U_WT045U_white_text_1",
            "reason": [
                "PlayText",
                "PlayerA",
                "PlayerA_11",
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
        "createPlayEffects_PlayerA_PlayerA_11_loadPrototype_179009_03B_U_WT045U_white_text_2": {
            "id": "createPlayEffects_PlayerA_PlayerA_11_loadPrototype_179009_03B_U_WT045U_white_text_2",
            "reason": [
                "PlayText",
                "PlayerA",
                "PlayerA_11",
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
        "createPlayEffects_PlayerA_PlayerA_8_loadPrototype_179009_03B_U_WT044U_white_text_1": {
            "id": "createPlayEffects_PlayerA_PlayerA_8_loadPrototype_179009_03B_U_WT044U_white_text_1",
            "reason": [
                "PlayText",
                "PlayerA",
                "PlayerA_8",
                "loadPrototype_179009_03B_U_WT044U_white_text_1"
            ],
            "description": "（常時）〔１〕：自軍手札、または自軍ハンガーにある「特徴：メリクリウス系」を持つユニット１枚を、自軍配備エリアにリロール状態で出す。",
            "text": {
                "id": "loadPrototype_179009_03B_U_WT044U_white_text_1",
                "description": "（常時）〔１〕：自軍手札、または自軍ハンガーにある「特徴：メリクリウス系」を持つユニット１枚を、自軍配備エリアにリロール状態で出す。",
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
                    "自軍手札、または自軍ハンガーにある「特徴：メリクリウス系」を持つユニット１枚": {
                        "title": [
                            "Entity",
                            {
                                "side": "自軍",
                                "at": [
                                    "手札",
                                    "ハンガー"
                                ],
                                "hasChar": [
                                    "メリクリウス系"
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
                                                "自軍手札、または自軍ハンガーにある「特徴：メリクリウス系」を持つユニット１枚"
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
        "createPlayEffects_PlayerA_PlayerA_8_loadPrototype_179009_03B_U_WT044U_white_text_2": {
            "id": "createPlayEffects_PlayerA_PlayerA_8_loadPrototype_179009_03B_U_WT044U_white_text_2",
            "reason": [
                "PlayText",
                "PlayerA",
                "PlayerA_8",
                "loadPrototype_179009_03B_U_WT044U_white_text_2"
            ],
            "description": "（戦闘フェイズ）：［ ］の特徴を持つ自軍ユニット１枚は、ターン終了時まで、このカードの本来のテキスト１つと同じテキストを得る。ただし同じテキストは得られない）",
            "text": {
                "id": "loadPrototype_179009_03B_U_WT044U_white_text_2",
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
                            "メリクリウス系",
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
                "PlayerA_31",
                "PlayerA_10",
                "PlayerA_43",
                "PlayerA_13",
                "PlayerA_16",
                "PlayerA_27",
                "PlayerA_48",
                "PlayerA_23",
                "PlayerA_21",
                "PlayerA_17",
                "PlayerA_34",
                "PlayerA_24",
                "PlayerA_0",
                "PlayerA_38",
                "PlayerA_4",
                "PlayerA_9",
                "PlayerA_3",
                "PlayerA_40",
                "PlayerA_28",
                "PlayerA_49",
                "PlayerA_29",
                "PlayerA_22",
                "PlayerA_39",
                "PlayerA_6",
                "PlayerA_30",
                "PlayerA_26",
                "PlayerA_2",
                "PlayerA_18",
                "PlayerA_45",
                "PlayerA_20",
                "PlayerA_32",
                "PlayerA_41",
                "PlayerA_44",
                "PlayerA_19",
                "PlayerA_42",
                "PlayerA_35"
            ],
            "[\"PlayerB\",\"本国\"]": [
                "PlayerB_72",
                "PlayerB_59",
                "PlayerB_62",
                "PlayerB_61",
                "PlayerB_69",
                "PlayerB_79",
                "PlayerB_87",
                "PlayerB_66",
                "PlayerB_50",
                "PlayerB_80",
                "PlayerB_55",
                "PlayerB_94",
                "PlayerB_78",
                "PlayerB_83",
                "PlayerB_65",
                "PlayerB_52",
                "PlayerB_53",
                "PlayerB_51",
                "PlayerB_86",
                "PlayerB_57",
                "PlayerB_70",
                "PlayerB_88",
                "PlayerB_90",
                "PlayerB_60",
                "PlayerB_76",
                "PlayerB_68",
                "PlayerB_98",
                "PlayerB_73",
                "PlayerB_89",
                "PlayerB_99",
                "PlayerB_64",
                "PlayerB_54",
                "PlayerB_93",
                "PlayerB_84"
            ],
            "[\"PlayerA\",\"手札\"]": [
                "PlayerA_47",
                "PlayerA_33",
                "PlayerA_1"
            ],
            "[\"PlayerB\",\"手札\"]": [
                "PlayerB_92",
                "PlayerB_91",
                "PlayerB_56"
            ],
            "[\"PlayerA\",\"Gゾーン\"]": [
                "PlayerA_5",
                "PlayerA_46",
                "PlayerA_14",
                "PlayerA_25"
            ],
            "[\"PlayerB\",\"Gゾーン\"]": [
                "PlayerB_74",
                "PlayerB_85",
                "PlayerB_63",
                "PlayerB_97"
            ],
            "[\"PlayerB\",\"プレイされているカード\"]": [],
            "[\"PlayerB\",\"配備エリア\"]": [
                "PlayerB_75",
                "PlayerB_96"
            ],
            "[\"PlayerA\",\"プレイされているカード\"]": [],
            "[\"PlayerA\",\"配備エリア\"]": [
                "PlayerA_7",
                "PlayerA_11",
                "PlayerA_8"
            ],
            "[\"PlayerB\",\"戦闘エリア1\"]": [
                "PlayerB_82"
            ],
            "[\"PlayerA\",\"捨て山\"]": [
                "PlayerA_12",
                "PlayerA_36",
                "PlayerA_37",
                "PlayerA_15"
            ],
            "[\"PlayerA\",\"戦闘エリア1\"]": [],
            "[\"PlayerB\",\"捨て山\"]": [
                "PlayerB_67",
                "PlayerB_58",
                "PlayerB_77",
                "PlayerB_95",
                "PlayerB_81",
                "PlayerB_71"
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
                                "PlayerB_82",
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
                                "PlayerB_75",
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
        "PlayerB_75": {
            "id": "PlayerB_75",
            "damage": 0,
            "destroyReason": null,
            "flags": {},
            "tips": {
                "橫置支付1[緑]": {
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
                },
                "橫置支付0[緑]": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerB_74",
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
                                "PlayerB_74",
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
                                "PlayerB_74",
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
                "橫置支付0[白]": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerA_5",
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
                                "PlayerA_5",
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
                "橫置支付2[白]": {
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
                "合計国力〔x〕": {
                    "title": [
                        "カード",
                        [],
                        [
                            [
                                "PlayerA_5",
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
                    ]
                },
                "0[null]": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerA_5",
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
                                "PlayerA_5",
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
                "自軍手札、または自軍ハンガーにある「特徴：メリクリウス系」を持つユニット１枚": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerA_11",
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
                                "PlayerA_11",
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
                "橫置支付0[null]": {
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
                            ],
                            [
                                "PlayerA_25",
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
                "橫置支付1[null]": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerA_25",
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
                                "PlayerA_25",
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
                                "cardId": "PlayerA_7",
                                "textId": "loadPrototype_179009_03B_U_WT044U_white_text_0"
                            },
                            {
                                "cardId": "PlayerA_7",
                                "textId": "loadPrototype_179009_03B_U_WT044U_white_text_1"
                            }
                        ],
                        [
                            {
                                "cardId": "PlayerA_7",
                                "textId": "loadPrototype_179009_03B_U_WT044U_white_text_0"
                            }
                        ]
                    ]
                },
                "［ ］の特徴を持つ自軍ユニット１枚は": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerA_11",
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
                                "PlayerA_11",
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
            "isOpenForGain": false,
            "isCheat": false,
            "textIdsUseThisTurn": [
                //"loadPrototype_179009_03B_U_WT044U_white_text_2"
            ],
            "isAttack": false,
            "isDefence": false
        },
        "PlayerB_82": {
            "id": "PlayerB_82",
            "damage": 0,
            "destroyReason": null,
            "flags": {},
            "tips": {
                "橫置支付0[緑]": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerB_74",
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
                                "PlayerB_74",
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
                                "PlayerB_74",
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
            "isAttack": true,
            "isDefence": false,
            "isOpenForGain": false,
            "isCheat": false,
            "textIdsUseThisTurn": []
        },
        "PlayerA_11": {
            "id": "PlayerA_11",
            "damage": 0,
            "destroyReason": null,
            "flags": {},
            "tips": {
                "0[null]": {
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
                "自軍手札、または自軍ハンガーにある「特徴：ヴァイエイト系」を持つユニット１枚": {
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
                }
            },
            "globalEffects": {
                // "setGlobalEffect_01928bfd-03e7-700a-b204-bf46fcd8f123": {
                //     "title": [
                //         "AddTextRef",
                //         {
                //             "cardId": "PlayerA_7",
                //             "textId": "loadPrototype_179009_03B_U_WT044U_white_text_0"
                //         }
                //     ],
                //     "cardIds": [
                //         "PlayerA_11"
                //     ]
                // }
            },
            "varNamesRemoveOnTurnEnd": {
                "setGlobalEffect_01928bfd-03e7-700a-b204-bf46fcd8f123": true
            },
            "isFirstTurn": false,
            "textIdsUseThisTurn": [],
            "isOpenForGain": false,
            "isCheat": false,
            "isAttack": false,
            "isDefence": false
        },
        "PlayerA_8": {
            "id": "PlayerA_8",
            "damage": 0,
            "destroyReason": null,
            "flags": {},
            "tips": {},
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
                                "PlayerA_11",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "配備エリア"
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
                                "PlayerA_11",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "配備エリア"
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
        "PlayerB_96": {
            "id": "PlayerB_96",
            "damage": 0,
            "destroyReason": null,
            "flags": {},
            "tips": {
                "橫置支付1[緑]": {
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
                "橫置支付0[緑]": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerB_74",
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
                                "PlayerB_74",
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
                                "PlayerB_74",
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
            "varNamesRemoveOnTurnEnd": {},
            "isFirstTurn": true
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
        "createPlayEffects_PlayerA_PlayerA_7_loadPrototype_179009_03B_U_WT044U_white_text_1",
        "createPlayEffects_PlayerA_PlayerA_7_loadPrototype_179009_03B_U_WT044U_white_text_2",
        "createPlayEffects_PlayerA_PlayerA_11_loadPrototype_179009_03B_U_WT045U_white_text_1",
        "createPlayEffects_PlayerA_PlayerA_11_loadPrototype_179009_03B_U_WT045U_white_text_2",
        "createPlayEffects_PlayerA_PlayerA_8_loadPrototype_179009_03B_U_WT044U_white_text_1",
        "createPlayEffects_PlayerA_PlayerA_8_loadPrototype_179009_03B_U_WT044U_white_text_2"
    ],
    "commandEffectTips": [
        {
            "effectId": "createPlayEffects_PlayerA_PlayerA_7_loadPrototype_179009_03B_U_WT044U_white_text_1",
            "conditionKeys": [
                "0[null]",
                "自軍手札、または自軍ハンガーにある「特徴：メリクリウス系」を持つユニット１枚",
                "同回合上限"
            ],
            "logicID": 0,
            "logicSubID": 0,
            "tipOrErrors": [
                {
                    "effectId": "createPlayEffects_PlayerA_PlayerA_7_loadPrototype_179009_03B_U_WT044U_white_text_1",
                    "conditionKey": "0[null]",
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
                        "cardId: PlayerA_7 target not set yet: 0[null]"
                    ]
                },
                {
                    "effectId": "createPlayEffects_PlayerA_PlayerA_7_loadPrototype_179009_03B_U_WT044U_white_text_1",
                    "conditionKey": "自軍手札、または自軍ハンガーにある「特徴：メリクリウス系」を持つユニット１枚",
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
                    "effectId": "createPlayEffects_PlayerA_PlayerA_7_loadPrototype_179009_03B_U_WT044U_white_text_1",
                    "conditionKey": "同回合上限",
                    "tip": null,
                    "errors": []
                }
            ]
        },
        {
            "effectId": "createPlayEffects_PlayerA_PlayerA_7_loadPrototype_179009_03B_U_WT044U_white_text_2",
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
                    "effectId": "createPlayEffects_PlayerA_PlayerA_7_loadPrototype_179009_03B_U_WT044U_white_text_2",
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
                        "cardId: PlayerA_7 target not set yet: 橫置支付0[null]"
                    ]
                },
                {
                    "effectId": "createPlayEffects_PlayerA_PlayerA_7_loadPrototype_179009_03B_U_WT044U_white_text_2",
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
                        "cardId: PlayerA_7 target not set yet: 橫置支付1[null]"
                    ]
                },
                {
                    "effectId": "createPlayEffects_PlayerA_PlayerA_7_loadPrototype_179009_03B_U_WT044U_white_text_2",
                    "conditionKey": "このカードの本来のテキスト１つ",
                    "tip": {
                        "title": [
                            "テキスト",
                            [
                                {
                                    "cardId": "PlayerA_7",
                                    "textId": "loadPrototype_179009_03B_U_WT044U_white_text_0"
                                },
                                {
                                    "cardId": "PlayerA_7",
                                    "textId": "loadPrototype_179009_03B_U_WT044U_white_text_1"
                                }
                            ],
                            [
                                {
                                    "cardId": "PlayerA_7",
                                    "textId": "loadPrototype_179009_03B_U_WT044U_white_text_0"
                                }
                            ]
                        ],
                        "count": 1
                    },
                    "errors": []
                },
                {
                    "effectId": "createPlayEffects_PlayerA_PlayerA_7_loadPrototype_179009_03B_U_WT044U_white_text_2",
                    "conditionKey": "［ ］の特徴を持つ自軍ユニット１枚は",
                    "tip": {
                        "title": [
                            "カード",
                            [
                                [
                                    "PlayerA_11",
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
                                    "PlayerA_11",
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
                    "errors": [
                        "已有同樣的內文: [\"loadPrototype_179009_03B_U_WT044U_white_text_0\"]"
                    ]
                },
                {
                    "effectId": "createPlayEffects_PlayerA_PlayerA_7_loadPrototype_179009_03B_U_WT044U_white_text_2",
                    "conditionKey": "同回合上限",
                    "tip": null,
                    "errors": [
                        "同回合上限: （戦闘フェイズ）：［ ］の特徴を持つ自軍ユニット１枚は、ターン終了時まで、このカードの本来のテキスト１つと同じテキストを得る。ただし同じテキストは得られない）"
                    ]
                }
            ]
        },
        {
            "effectId": "createPlayEffects_PlayerA_PlayerA_11_loadPrototype_179009_03B_U_WT045U_white_text_1",
            "conditionKeys": [
                "0[null]",
                "自軍手札、または自軍ハンガーにある「特徴：ヴァイエイト系」を持つユニット１枚",
                "同回合上限"
            ],
            "logicID": 0,
            "logicSubID": 0,
            "tipOrErrors": [
                {
                    "effectId": "createPlayEffects_PlayerA_PlayerA_11_loadPrototype_179009_03B_U_WT045U_white_text_1",
                    "conditionKey": "0[null]",
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
                        "cardId: PlayerA_11 target not set yet: 0[null]"
                    ]
                },
                {
                    "effectId": "createPlayEffects_PlayerA_PlayerA_11_loadPrototype_179009_03B_U_WT045U_white_text_1",
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
                    "effectId": "createPlayEffects_PlayerA_PlayerA_11_loadPrototype_179009_03B_U_WT045U_white_text_1",
                    "conditionKey": "同回合上限",
                    "tip": null,
                    "errors": []
                }
            ]
        },
        {
            "effectId": "createPlayEffects_PlayerA_PlayerA_11_loadPrototype_179009_03B_U_WT045U_white_text_2",
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
                    "effectId": "createPlayEffects_PlayerA_PlayerA_11_loadPrototype_179009_03B_U_WT045U_white_text_2",
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
                        "cardId: PlayerA_11 target not set yet: 橫置支付0[null]"
                    ]
                },
                {
                    "effectId": "createPlayEffects_PlayerA_PlayerA_11_loadPrototype_179009_03B_U_WT045U_white_text_2",
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
                        "cardId: PlayerA_11 target not set yet: 橫置支付1[null]"
                    ]
                },
                {
                    "effectId": "createPlayEffects_PlayerA_PlayerA_11_loadPrototype_179009_03B_U_WT045U_white_text_2",
                    "conditionKey": "このカードの本来のテキスト１つ",
                    "tip": {
                        "title": [
                            "テキスト",
                            [
                                {
                                    "cardId": "PlayerA_11",
                                    "textId": "loadPrototype_179009_03B_U_WT045U_white_text_0"
                                },
                                {
                                    "cardId": "PlayerA_11",
                                    "textId": "loadPrototype_179009_03B_U_WT045U_white_text_1"
                                }
                            ],
                            [
                                {
                                    "cardId": "PlayerA_11",
                                    "textId": "loadPrototype_179009_03B_U_WT045U_white_text_0"
                                }
                            ]
                        ],
                        "count": 1
                    },
                    "errors": []
                },
                {
                    "effectId": "createPlayEffects_PlayerA_PlayerA_11_loadPrototype_179009_03B_U_WT045U_white_text_2",
                    "conditionKey": "［ ］の特徴を持つ自軍ユニット１枚は",
                    "tip": {
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
                    },
                    "errors": []
                },
                {
                    "effectId": "createPlayEffects_PlayerA_PlayerA_11_loadPrototype_179009_03B_U_WT045U_white_text_2",
                    "conditionKey": "同回合上限",
                    "tip": null,
                    "errors": []
                }
            ]
        },
        {
            "effectId": "createPlayEffects_PlayerA_PlayerA_8_loadPrototype_179009_03B_U_WT044U_white_text_1",
            "conditionKeys": [
                "0[null]",
                "自軍手札、または自軍ハンガーにある「特徴：メリクリウス系」を持つユニット１枚",
                "同回合上限"
            ],
            "logicID": 0,
            "logicSubID": 0,
            "tipOrErrors": [
                {
                    "effectId": "createPlayEffects_PlayerA_PlayerA_8_loadPrototype_179009_03B_U_WT044U_white_text_1",
                    "conditionKey": "0[null]",
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
                        "cardId: PlayerA_8 target not set yet: 0[null]"
                    ]
                },
                {
                    "effectId": "createPlayEffects_PlayerA_PlayerA_8_loadPrototype_179009_03B_U_WT044U_white_text_1",
                    "conditionKey": "自軍手札、または自軍ハンガーにある「特徴：メリクリウス系」を持つユニット１枚",
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
                    "effectId": "createPlayEffects_PlayerA_PlayerA_8_loadPrototype_179009_03B_U_WT044U_white_text_1",
                    "conditionKey": "同回合上限",
                    "tip": null,
                    "errors": []
                }
            ]
        },
        {
            "effectId": "createPlayEffects_PlayerA_PlayerA_8_loadPrototype_179009_03B_U_WT044U_white_text_2",
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
                    "effectId": "createPlayEffects_PlayerA_PlayerA_8_loadPrototype_179009_03B_U_WT044U_white_text_2",
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
                        "cardId: PlayerA_8 target not set yet: 橫置支付0[null]"
                    ]
                },
                {
                    "effectId": "createPlayEffects_PlayerA_PlayerA_8_loadPrototype_179009_03B_U_WT044U_white_text_2",
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
                        "cardId: PlayerA_8 target not set yet: 橫置支付1[null]"
                    ]
                },
                {
                    "effectId": "createPlayEffects_PlayerA_PlayerA_8_loadPrototype_179009_03B_U_WT044U_white_text_2",
                    "conditionKey": "このカードの本来のテキスト１つ",
                    "tip": {
                        "title": [
                            "テキスト",
                            [
                                {
                                    "cardId": "PlayerA_8",
                                    "textId": "loadPrototype_179009_03B_U_WT044U_white_text_0"
                                },
                                {
                                    "cardId": "PlayerA_8",
                                    "textId": "loadPrototype_179009_03B_U_WT044U_white_text_1"
                                }
                            ],
                            [
                                {
                                    "cardId": "PlayerA_8",
                                    "textId": "loadPrototype_179009_03B_U_WT044U_white_text_0"
                                }
                            ]
                        ],
                        "count": 1
                    },
                    "errors": []
                },
                {
                    "effectId": "createPlayEffects_PlayerA_PlayerA_8_loadPrototype_179009_03B_U_WT044U_white_text_2",
                    "conditionKey": "［ ］の特徴を持つ自軍ユニット１枚は",
                    "tip": {
                        "title": [
                            "カード",
                            [
                                [
                                    "PlayerA_11",
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
                                    "PlayerA_11",
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
                    "errors": [
                        "已有同樣的內文: [\"loadPrototype_179009_03B_U_WT044U_white_text_0\"]"
                    ]
                },
                {
                    "effectId": "createPlayEffects_PlayerA_PlayerA_8_loadPrototype_179009_03B_U_WT044U_white_text_2",
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
    "messageTopId": 828,
    "messages": [
        {
            "id": 827,
            "description": "onSetPhase:戦闘フェイズ,防御ステップ,規定の効果"
        },
        {
            "id": 826,
            "description": "onEvent: カット終了時 undefined"
        },
        {
            "id": 825,
            "description": "onEffectEnd: （戦闘フェイズ）：［ ］の特徴を持つ自軍ユニット１枚は、ターン終了時まで、このカードの本来のテキスト１つと同じテキストを得る。ただし同じテキストは得られない）"
        },
        {
            "id": 824,
            "description": "onEffectStart: （戦闘フェイズ）：［ ］の特徴を持つ自軍ユニット１枚は、ターン終了時まで、このカードの本来のテキスト１つと同じテキストを得る。ただし同じテキストは得られない）",
            "effect": {
                "id": "addStackEffect_01928bfc-cfe1-700a-ad73-f4025dfe2405",
                "description": "（戦闘フェイズ）：［ ］の特徴を持つ自軍ユニット１枚は、ターン終了時まで、このカードの本来のテキスト１つと同じテキストを得る。ただし同じテキストは得られない）",
                "reason": [
                    "PlayText",
                    "PlayerA",
                    "PlayerA_7",
                    "loadPrototype_179009_03B_U_WT044U_white_text_2"
                ],
                "text": {
                    "id": "loadPrototype_179009_03B_U_WT044U_white_text_2",
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
            "id": 823,
            "description": "onEffectEnd: （戦闘フェイズ）：［ ］の特徴を持つ自軍ユニット１枚は、ターン終了時まで、このカードの本来のテキスト１つと同じテキストを得る。ただし同じテキストは得られない）"
        },
        {
            "id": 822,
            "description": "PlayerA_25.isRoll false => true",
            "effect": {
                "id": "createPlayEffects_PlayerA_PlayerA_7_loadPrototype_179009_03B_U_WT044U_white_text_2",
                "reason": [
                    "PlayText",
                    "PlayerA",
                    "PlayerA_7",
                    "loadPrototype_179009_03B_U_WT044U_white_text_2"
                ],
                "description": "（戦闘フェイズ）：［ ］の特徴を持つ自軍ユニット１枚は、ターン終了時まで、このカードの本来のテキスト１つと同じテキストを得る。ただし同じテキストは得られない）",
                "text": {
                    "id": "loadPrototype_179009_03B_U_WT044U_white_text_2",
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
                                "メリクリウス系",
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
            "id": 821,
            "description": "PlayerA_14.isRoll false => true",
            "effect": {
                "id": "createPlayEffects_PlayerA_PlayerA_7_loadPrototype_179009_03B_U_WT044U_white_text_2",
                "reason": [
                    "PlayText",
                    "PlayerA",
                    "PlayerA_7",
                    "loadPrototype_179009_03B_U_WT044U_white_text_2"
                ],
                "description": "（戦闘フェイズ）：［ ］の特徴を持つ自軍ユニット１枚は、ターン終了時まで、このカードの本来のテキスト１つと同じテキストを得る。ただし同じテキストは得られない）",
                "text": {
                    "id": "loadPrototype_179009_03B_U_WT044U_white_text_2",
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
                                "メリクリウス系",
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
            "id": 820,
            "description": "onEffectStart: （戦闘フェイズ）：［ ］の特徴を持つ自軍ユニット１枚は、ターン終了時まで、このカードの本来のテキスト１つと同じテキストを得る。ただし同じテキストは得られない）",
            "effect": {
                "id": "createPlayEffects_PlayerA_PlayerA_7_loadPrototype_179009_03B_U_WT044U_white_text_2",
                "reason": [
                    "PlayText",
                    "PlayerA",
                    "PlayerA_7",
                    "loadPrototype_179009_03B_U_WT044U_white_text_2"
                ],
                "description": "（戦闘フェイズ）：［ ］の特徴を持つ自軍ユニット１枚は、ターン終了時まで、このカードの本来のテキスト１つと同じテキストを得る。ただし同じテキストは得られない）",
                "text": {
                    "id": "loadPrototype_179009_03B_U_WT044U_white_text_2",
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
                                "メリクリウス系",
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
            "id": 819,
            "description": "onSetPhase:戦闘フェイズ,防御ステップ,フリータイミング"
        },
        {
            "id": 818,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 817,
            "description": "onSetPhase:戦闘フェイズ,防御ステップ,ステップ開始"
        },
        {
            "id": 816,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 815,
            "description": "onSetPhase:戦闘フェイズ,攻撃ステップ,ステップ終了"
        },
        {
            "id": 814,
            "description": "onSetPhase:戦闘フェイズ,攻撃ステップ,フリータイミング2"
        },
        {
            "id": 813,
            "description": "onEffectEnd: 出擊"
        },
        {
            "id": 812,
            "description": "onEvent: このカードが攻撃に出撃した場合 [\"PlayerB_82\"]",
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
                            "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n            const runtimeBattleArea = GameStateFn2.getRuntimeBattleArea(ctx3, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A21\");\n            if (runtimeBattleArea == \"\\u5B87\\u5B99\\u30A8\\u30EA\\u30A2\")\n              return null;\n            const playerId2 = DefineFn2.EffectFn.getPlayerID(effect), opponentPlayerId = DefineFn2.PlayerIDFn.getOpponent(playerId2);\n            let unitIds = GameStateFn2.getItemIdsByBasyou(ctx3, DefineFn2.AbsoluteBaSyouFn.of(playerId2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\")).filter((cardId) => GameStateFn2.getSetGroupRoot(ctx3, cardId) == cardId).filter((cardId) => GameStateFn2.getCardBattleArea(ctx3, cardId).includes(runtimeBattleArea)).filter((cardId) => GameStateFn2.getCard(ctx3, cardId).isRoll != !0);\n            const opponentUnitIds = GameStateFn2.getBattleGroup(ctx3, DefineFn2.AbsoluteBaSyouFn.of(opponentPlayerId, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A21\"));\n            if (opponentUnitIds.length) {\n              if (GameStateFn2.isABattleGroup(ctx3, [\"\\u9AD8\\u6A5F\\u52D5\"], opponentUnitIds[0]))\n                unitIds = unitIds.filter((id) => GameStateFn2.isSetGroupHasA(ctx3, [\"\\u9AD8\\u6A5F\\u52D5\"], id));\n            }\n            return {\n              title: [\"\\u30AB\\u30FC\\u30C9\", unitIds.map((id) => {\n                return [id, GameStateFn2.getItemBaSyou(ctx3, id)];\n              }), []],\n              flags: { isGoBattleArea1: !0 }\n            };\n          }",
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                const playerId2 = DefineFn2.EffectFn.getPlayerID(effect), fackCardId = DefineFn2.EffectFn.getCardID(effect), earthPairs = GameStateFn2.getCardTipStrBaSyouPairs(ctx3, \"\\u53BB\\u5730\\u7403\", fackCardId), phase2 = GameStateFn2.getPhase(ctx3);\n                for (let pair3 of earthPairs)\n                  ctx3 = GameStateFn2.mapItemState(ctx3, pair3[0], (is) => ({ ...is, isAttack: phase2[1] == \"\\u653B\\u6483\\u30B9\\u30C6\\u30C3\\u30D7\", isDefence: phase2[1] == \"\\u9632\\u5FA1\\u30B9\\u30C6\\u30C3\\u30D7\" })), ctx3 = GameStateFn2.doItemMove(ctx3, DefineFn2.AbsoluteBaSyouFn.of(playerId2, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A21\"), pair3);\n                return ctx3;\n              }"
                                }
                            ],
                            "groupKey": "出擊"
                        },
                        "去宇宙": {
                            "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n            const runtimeBattleArea = GameStateFn2.getRuntimeBattleArea(ctx3, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A22\");\n            if (runtimeBattleArea == \"\\u5730\\u7403\\u30A8\\u30EA\\u30A2\")\n              return null;\n            const playerId2 = DefineFn2.EffectFn.getPlayerID(effect), opponentPlayerId = DefineFn2.PlayerIDFn.getOpponent(playerId2);\n            let unitIds = GameStateFn2.getItemIdsByBasyou(ctx3, DefineFn2.AbsoluteBaSyouFn.of(playerId2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\")).filter((cardId) => GameStateFn2.getSetGroupRoot(ctx3, cardId) == cardId).filter((cardId) => GameStateFn2.getCardBattleArea(ctx3, cardId).includes(runtimeBattleArea)).filter((cardId) => GameStateFn2.getCard(ctx3, cardId).isRoll != !0);\n            const opponentUnitIds = GameStateFn2.getBattleGroup(ctx3, DefineFn2.AbsoluteBaSyouFn.of(opponentPlayerId, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A22\"));\n            if (opponentUnitIds.length) {\n              if (GameStateFn2.isABattleGroup(ctx3, [\"\\u9AD8\\u6A5F\\u52D5\"], opponentUnitIds[0]))\n                unitIds = unitIds.filter((id) => GameStateFn2.isSetGroupHasA(ctx3, [\"\\u9AD8\\u6A5F\\u52D5\"], id));\n            }\n            return {\n              title: [\"\\u30AB\\u30FC\\u30C9\", unitIds.map((id) => {\n                return [id, GameStateFn2.getItemBaSyou(ctx3, id)];\n              }), []],\n              flags: { isGoBattleArea2: !0 }\n            };\n          }",
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
            "id": 811,
            "description": "onItemMove:PlayerB_82 = [\"PlayerB\",\"配備エリア\"] => [\"PlayerB\",\"戦闘エリア1\"]",
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
                            "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n            const runtimeBattleArea = GameStateFn2.getRuntimeBattleArea(ctx3, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A21\");\n            if (runtimeBattleArea == \"\\u5B87\\u5B99\\u30A8\\u30EA\\u30A2\")\n              return null;\n            const playerId2 = DefineFn2.EffectFn.getPlayerID(effect), opponentPlayerId = DefineFn2.PlayerIDFn.getOpponent(playerId2);\n            let unitIds = GameStateFn2.getItemIdsByBasyou(ctx3, DefineFn2.AbsoluteBaSyouFn.of(playerId2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\")).filter((cardId) => GameStateFn2.getSetGroupRoot(ctx3, cardId) == cardId).filter((cardId) => GameStateFn2.getCardBattleArea(ctx3, cardId).includes(runtimeBattleArea)).filter((cardId) => GameStateFn2.getCard(ctx3, cardId).isRoll != !0);\n            const opponentUnitIds = GameStateFn2.getBattleGroup(ctx3, DefineFn2.AbsoluteBaSyouFn.of(opponentPlayerId, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A21\"));\n            if (opponentUnitIds.length) {\n              if (GameStateFn2.isABattleGroup(ctx3, [\"\\u9AD8\\u6A5F\\u52D5\"], opponentUnitIds[0]))\n                unitIds = unitIds.filter((id) => GameStateFn2.isSetGroupHasA(ctx3, [\"\\u9AD8\\u6A5F\\u52D5\"], id));\n            }\n            return {\n              title: [\"\\u30AB\\u30FC\\u30C9\", unitIds.map((id) => {\n                return [id, GameStateFn2.getItemBaSyou(ctx3, id)];\n              }), []],\n              flags: { isGoBattleArea1: !0 }\n            };\n          }",
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                const playerId2 = DefineFn2.EffectFn.getPlayerID(effect), fackCardId = DefineFn2.EffectFn.getCardID(effect), earthPairs = GameStateFn2.getCardTipStrBaSyouPairs(ctx3, \"\\u53BB\\u5730\\u7403\", fackCardId), phase2 = GameStateFn2.getPhase(ctx3);\n                for (let pair3 of earthPairs)\n                  ctx3 = GameStateFn2.mapItemState(ctx3, pair3[0], (is) => ({ ...is, isAttack: phase2[1] == \"\\u653B\\u6483\\u30B9\\u30C6\\u30C3\\u30D7\", isDefence: phase2[1] == \"\\u9632\\u5FA1\\u30B9\\u30C6\\u30C3\\u30D7\" })), ctx3 = GameStateFn2.doItemMove(ctx3, DefineFn2.AbsoluteBaSyouFn.of(playerId2, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A21\"), pair3);\n                return ctx3;\n              }"
                                }
                            ],
                            "groupKey": "出擊"
                        },
                        "去宇宙": {
                            "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n            const runtimeBattleArea = GameStateFn2.getRuntimeBattleArea(ctx3, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A22\");\n            if (runtimeBattleArea == \"\\u5730\\u7403\\u30A8\\u30EA\\u30A2\")\n              return null;\n            const playerId2 = DefineFn2.EffectFn.getPlayerID(effect), opponentPlayerId = DefineFn2.PlayerIDFn.getOpponent(playerId2);\n            let unitIds = GameStateFn2.getItemIdsByBasyou(ctx3, DefineFn2.AbsoluteBaSyouFn.of(playerId2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\")).filter((cardId) => GameStateFn2.getSetGroupRoot(ctx3, cardId) == cardId).filter((cardId) => GameStateFn2.getCardBattleArea(ctx3, cardId).includes(runtimeBattleArea)).filter((cardId) => GameStateFn2.getCard(ctx3, cardId).isRoll != !0);\n            const opponentUnitIds = GameStateFn2.getBattleGroup(ctx3, DefineFn2.AbsoluteBaSyouFn.of(opponentPlayerId, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A22\"));\n            if (opponentUnitIds.length) {\n              if (GameStateFn2.isABattleGroup(ctx3, [\"\\u9AD8\\u6A5F\\u52D5\"], opponentUnitIds[0]))\n                unitIds = unitIds.filter((id) => GameStateFn2.isSetGroupHasA(ctx3, [\"\\u9AD8\\u6A5F\\u52D5\"], id));\n            }\n            return {\n              title: [\"\\u30AB\\u30FC\\u30C9\", unitIds.map((id) => {\n                return [id, GameStateFn2.getItemBaSyou(ctx3, id)];\n              }), []],\n              flags: { isGoBattleArea2: !0 }\n            };\n          }",
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
            "id": 810,
            "description": "onEvent: GameEventOnMove [\"PlayerB_82\"]",
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
                            "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n            const runtimeBattleArea = GameStateFn2.getRuntimeBattleArea(ctx3, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A21\");\n            if (runtimeBattleArea == \"\\u5B87\\u5B99\\u30A8\\u30EA\\u30A2\")\n              return null;\n            const playerId2 = DefineFn2.EffectFn.getPlayerID(effect), opponentPlayerId = DefineFn2.PlayerIDFn.getOpponent(playerId2);\n            let unitIds = GameStateFn2.getItemIdsByBasyou(ctx3, DefineFn2.AbsoluteBaSyouFn.of(playerId2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\")).filter((cardId) => GameStateFn2.getSetGroupRoot(ctx3, cardId) == cardId).filter((cardId) => GameStateFn2.getCardBattleArea(ctx3, cardId).includes(runtimeBattleArea)).filter((cardId) => GameStateFn2.getCard(ctx3, cardId).isRoll != !0);\n            const opponentUnitIds = GameStateFn2.getBattleGroup(ctx3, DefineFn2.AbsoluteBaSyouFn.of(opponentPlayerId, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A21\"));\n            if (opponentUnitIds.length) {\n              if (GameStateFn2.isABattleGroup(ctx3, [\"\\u9AD8\\u6A5F\\u52D5\"], opponentUnitIds[0]))\n                unitIds = unitIds.filter((id) => GameStateFn2.isSetGroupHasA(ctx3, [\"\\u9AD8\\u6A5F\\u52D5\"], id));\n            }\n            return {\n              title: [\"\\u30AB\\u30FC\\u30C9\", unitIds.map((id) => {\n                return [id, GameStateFn2.getItemBaSyou(ctx3, id)];\n              }), []],\n              flags: { isGoBattleArea1: !0 }\n            };\n          }",
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                const playerId2 = DefineFn2.EffectFn.getPlayerID(effect), fackCardId = DefineFn2.EffectFn.getCardID(effect), earthPairs = GameStateFn2.getCardTipStrBaSyouPairs(ctx3, \"\\u53BB\\u5730\\u7403\", fackCardId), phase2 = GameStateFn2.getPhase(ctx3);\n                for (let pair3 of earthPairs)\n                  ctx3 = GameStateFn2.mapItemState(ctx3, pair3[0], (is) => ({ ...is, isAttack: phase2[1] == \"\\u653B\\u6483\\u30B9\\u30C6\\u30C3\\u30D7\", isDefence: phase2[1] == \"\\u9632\\u5FA1\\u30B9\\u30C6\\u30C3\\u30D7\" })), ctx3 = GameStateFn2.doItemMove(ctx3, DefineFn2.AbsoluteBaSyouFn.of(playerId2, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A21\"), pair3);\n                return ctx3;\n              }"
                                }
                            ],
                            "groupKey": "出擊"
                        },
                        "去宇宙": {
                            "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n            const runtimeBattleArea = GameStateFn2.getRuntimeBattleArea(ctx3, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A22\");\n            if (runtimeBattleArea == \"\\u5730\\u7403\\u30A8\\u30EA\\u30A2\")\n              return null;\n            const playerId2 = DefineFn2.EffectFn.getPlayerID(effect), opponentPlayerId = DefineFn2.PlayerIDFn.getOpponent(playerId2);\n            let unitIds = GameStateFn2.getItemIdsByBasyou(ctx3, DefineFn2.AbsoluteBaSyouFn.of(playerId2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\")).filter((cardId) => GameStateFn2.getSetGroupRoot(ctx3, cardId) == cardId).filter((cardId) => GameStateFn2.getCardBattleArea(ctx3, cardId).includes(runtimeBattleArea)).filter((cardId) => GameStateFn2.getCard(ctx3, cardId).isRoll != !0);\n            const opponentUnitIds = GameStateFn2.getBattleGroup(ctx3, DefineFn2.AbsoluteBaSyouFn.of(opponentPlayerId, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A22\"));\n            if (opponentUnitIds.length) {\n              if (GameStateFn2.isABattleGroup(ctx3, [\"\\u9AD8\\u6A5F\\u52D5\"], opponentUnitIds[0]))\n                unitIds = unitIds.filter((id) => GameStateFn2.isSetGroupHasA(ctx3, [\"\\u9AD8\\u6A5F\\u52D5\"], id));\n            }\n            return {\n              title: [\"\\u30AB\\u30FC\\u30C9\", unitIds.map((id) => {\n                return [id, GameStateFn2.getItemBaSyou(ctx3, id)];\n              }), []],\n              flags: { isGoBattleArea2: !0 }\n            };\n          }",
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
            "id": 809,
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
                            "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n            const runtimeBattleArea = GameStateFn2.getRuntimeBattleArea(ctx3, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A21\");\n            if (runtimeBattleArea == \"\\u5B87\\u5B99\\u30A8\\u30EA\\u30A2\")\n              return null;\n            const playerId2 = DefineFn2.EffectFn.getPlayerID(effect), opponentPlayerId = DefineFn2.PlayerIDFn.getOpponent(playerId2);\n            let unitIds = GameStateFn2.getItemIdsByBasyou(ctx3, DefineFn2.AbsoluteBaSyouFn.of(playerId2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\")).filter((cardId) => GameStateFn2.getSetGroupRoot(ctx3, cardId) == cardId).filter((cardId) => GameStateFn2.getCardBattleArea(ctx3, cardId).includes(runtimeBattleArea)).filter((cardId) => GameStateFn2.getCard(ctx3, cardId).isRoll != !0);\n            const opponentUnitIds = GameStateFn2.getBattleGroup(ctx3, DefineFn2.AbsoluteBaSyouFn.of(opponentPlayerId, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A21\"));\n            if (opponentUnitIds.length) {\n              if (GameStateFn2.isABattleGroup(ctx3, [\"\\u9AD8\\u6A5F\\u52D5\"], opponentUnitIds[0]))\n                unitIds = unitIds.filter((id) => GameStateFn2.isSetGroupHasA(ctx3, [\"\\u9AD8\\u6A5F\\u52D5\"], id));\n            }\n            return {\n              title: [\"\\u30AB\\u30FC\\u30C9\", unitIds.map((id) => {\n                return [id, GameStateFn2.getItemBaSyou(ctx3, id)];\n              }), []],\n              flags: { isGoBattleArea1: !0 }\n            };\n          }",
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                const playerId2 = DefineFn2.EffectFn.getPlayerID(effect), fackCardId = DefineFn2.EffectFn.getCardID(effect), earthPairs = GameStateFn2.getCardTipStrBaSyouPairs(ctx3, \"\\u53BB\\u5730\\u7403\", fackCardId), phase2 = GameStateFn2.getPhase(ctx3);\n                for (let pair3 of earthPairs)\n                  ctx3 = GameStateFn2.mapItemState(ctx3, pair3[0], (is) => ({ ...is, isAttack: phase2[1] == \"\\u653B\\u6483\\u30B9\\u30C6\\u30C3\\u30D7\", isDefence: phase2[1] == \"\\u9632\\u5FA1\\u30B9\\u30C6\\u30C3\\u30D7\" })), ctx3 = GameStateFn2.doItemMove(ctx3, DefineFn2.AbsoluteBaSyouFn.of(playerId2, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A21\"), pair3);\n                return ctx3;\n              }"
                                }
                            ],
                            "groupKey": "出擊"
                        },
                        "去宇宙": {
                            "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n            const runtimeBattleArea = GameStateFn2.getRuntimeBattleArea(ctx3, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A22\");\n            if (runtimeBattleArea == \"\\u5730\\u7403\\u30A8\\u30EA\\u30A2\")\n              return null;\n            const playerId2 = DefineFn2.EffectFn.getPlayerID(effect), opponentPlayerId = DefineFn2.PlayerIDFn.getOpponent(playerId2);\n            let unitIds = GameStateFn2.getItemIdsByBasyou(ctx3, DefineFn2.AbsoluteBaSyouFn.of(playerId2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\")).filter((cardId) => GameStateFn2.getSetGroupRoot(ctx3, cardId) == cardId).filter((cardId) => GameStateFn2.getCardBattleArea(ctx3, cardId).includes(runtimeBattleArea)).filter((cardId) => GameStateFn2.getCard(ctx3, cardId).isRoll != !0);\n            const opponentUnitIds = GameStateFn2.getBattleGroup(ctx3, DefineFn2.AbsoluteBaSyouFn.of(opponentPlayerId, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A22\"));\n            if (opponentUnitIds.length) {\n              if (GameStateFn2.isABattleGroup(ctx3, [\"\\u9AD8\\u6A5F\\u52D5\"], opponentUnitIds[0]))\n                unitIds = unitIds.filter((id) => GameStateFn2.isSetGroupHasA(ctx3, [\"\\u9AD8\\u6A5F\\u52D5\"], id));\n            }\n            return {\n              title: [\"\\u30AB\\u30FC\\u30C9\", unitIds.map((id) => {\n                return [id, GameStateFn2.getItemBaSyou(ctx3, id)];\n              }), []],\n              flags: { isGoBattleArea2: !0 }\n            };\n          }",
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
            "id": 808,
            "description": "onSetPhase:戦闘フェイズ,攻撃ステップ,規定の効果"
        },
        {
            "id": 807,
            "description": "onSetPhase:戦闘フェイズ,攻撃ステップ,フリータイミング"
        },
        {
            "id": 806,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 805,
            "description": "onSetPhase:戦闘フェイズ,攻撃ステップ,ステップ開始"
        },
        {
            "id": 804,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 803,
            "description": "onSetPhase:配備フェイズ,フェイズ終了"
        },
        {
            "id": 802,
            "description": "onEvent: カット終了時 undefined"
        },
        {
            "id": 801,
            "description": "onEffectEnd: Play ゲルググ"
        },
        {
            "id": 800,
            "description": "onEvent: プレイされて場に出た場合 [\"PlayerB_96\"]",
            "effect": {
                "id": "createUnitGoStageEffectFromPlayEffect_PlayerB_96",
                "reason": [
                    "場に出る",
                    "PlayerB",
                    "PlayerB_96"
                ],
                "description": "Play ゲルググ",
                "text": {
                    "id": "createPlayUnitEffect_PlayerB_96",
                    "description": "Play ゲルググ",
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
            "id": 799,
            "description": "PlayerB_96.isRoll false => true",
            "effect": {
                "id": "createUnitGoStageEffectFromPlayEffect_PlayerB_96",
                "reason": [
                    "場に出る",
                    "PlayerB",
                    "PlayerB_96"
                ],
                "description": "Play ゲルググ",
                "text": {
                    "id": "createPlayUnitEffect_PlayerB_96",
                    "description": "Play ゲルググ",
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
            "id": 798,
            "description": "onItemMove:PlayerB_96 = [\"PlayerB\",\"プレイされているカード\"] => [\"PlayerB\",\"配備エリア\"]",
            "effect": {
                "id": "createUnitGoStageEffectFromPlayEffect_PlayerB_96",
                "reason": [
                    "場に出る",
                    "PlayerB",
                    "PlayerB_96"
                ],
                "description": "Play ゲルググ",
                "text": {
                    "id": "createPlayUnitEffect_PlayerB_96",
                    "description": "Play ゲルググ",
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
            "id": 797,
            "description": "onEvent: GameEventOnMove [\"PlayerB_96\"]",
            "effect": {
                "id": "createUnitGoStageEffectFromPlayEffect_PlayerB_96",
                "reason": [
                    "場に出る",
                    "PlayerB",
                    "PlayerB_96"
                ],
                "description": "Play ゲルググ",
                "text": {
                    "id": "createPlayUnitEffect_PlayerB_96",
                    "description": "Play ゲルググ",
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
            "id": 796,
            "description": "onEvent: このカードが場に出た場合 [\"PlayerB_96\"]",
            "effect": {
                "id": "createUnitGoStageEffectFromPlayEffect_PlayerB_96",
                "reason": [
                    "場に出る",
                    "PlayerB",
                    "PlayerB_96"
                ],
                "description": "Play ゲルググ",
                "text": {
                    "id": "createPlayUnitEffect_PlayerB_96",
                    "description": "Play ゲルググ",
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
            "id": 795,
            "description": "onEffectStart: Play ゲルググ",
            "effect": {
                "id": "createUnitGoStageEffectFromPlayEffect_PlayerB_96",
                "reason": [
                    "場に出る",
                    "PlayerB",
                    "PlayerB_96"
                ],
                "description": "Play ゲルググ",
                "text": {
                    "id": "createPlayUnitEffect_PlayerB_96",
                    "description": "Play ゲルググ",
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
            "id": 794,
            "description": "onEffectEnd: Play ゲルググ"
        },
        {
            "id": 793,
            "description": "onItemMove:PlayerB_96 = [\"PlayerB\",\"手札\"] => [\"PlayerB\",\"プレイされているカード\"]",
            "effect": {
                "id": "createPlayUnitEffect_PlayerB_96",
                "reason": [
                    "PlayCard",
                    "PlayerB",
                    "PlayerB_96",
                    {
                        "isPlayUnit": true
                    }
                ],
                "description": "Play ゲルググ",
                "text": {
                    "id": "createPlayUnitEffect_PlayerB_96",
                    "title": [
                        "使用型",
                        [
                            "自軍",
                            "配備フェイズ"
                        ]
                    ],
                    "description": "Play ゲルググ",
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
            }
        },
        {
            "id": 792,
            "description": "onEvent: GameEventOnMove [\"PlayerB_96\"]",
            "effect": {
                "id": "createPlayUnitEffect_PlayerB_96",
                "reason": [
                    "PlayCard",
                    "PlayerB",
                    "PlayerB_96",
                    {
                        "isPlayUnit": true
                    }
                ],
                "description": "Play ゲルググ",
                "text": {
                    "id": "createPlayUnitEffect_PlayerB_96",
                    "title": [
                        "使用型",
                        [
                            "自軍",
                            "配備フェイズ"
                        ]
                    ],
                    "description": "Play ゲルググ",
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
            }
        },
        {
            "id": 791,
            "description": "PlayerB_96.isFaceDown true => false",
            "effect": {
                "id": "createPlayUnitEffect_PlayerB_96",
                "reason": [
                    "PlayCard",
                    "PlayerB",
                    "PlayerB_96",
                    {
                        "isPlayUnit": true
                    }
                ],
                "description": "Play ゲルググ",
                "text": {
                    "id": "createPlayUnitEffect_PlayerB_96",
                    "title": [
                        "使用型",
                        [
                            "自軍",
                            "配備フェイズ"
                        ]
                    ],
                    "description": "Play ゲルググ",
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
            }
        },
        {
            "id": 790,
            "description": "onEvent: プレイした場合 [\"PlayerB_96\"]",
            "effect": {
                "id": "createPlayUnitEffect_PlayerB_96",
                "reason": [
                    "PlayCard",
                    "PlayerB",
                    "PlayerB_96",
                    {
                        "isPlayUnit": true
                    }
                ],
                "description": "Play ゲルググ",
                "text": {
                    "id": "createPlayUnitEffect_PlayerB_96",
                    "title": [
                        "使用型",
                        [
                            "自軍",
                            "配備フェイズ"
                        ]
                    ],
                    "description": "Play ゲルググ",
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
            }
        },
        {
            "id": 789,
            "description": "PlayerB_85.isRoll false => true",
            "effect": {
                "id": "createPlayUnitEffect_PlayerB_96",
                "reason": [
                    "PlayCard",
                    "PlayerB",
                    "PlayerB_96",
                    {
                        "isPlayUnit": true
                    }
                ],
                "description": "Play ゲルググ",
                "text": {
                    "id": "createPlayUnitEffect_PlayerB_96",
                    "title": [
                        "使用型",
                        [
                            "自軍",
                            "配備フェイズ"
                        ]
                    ],
                    "description": "Play ゲルググ",
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
            }
        },
        {
            "id": 788,
            "description": "PlayerB_74.isRoll false => true",
            "effect": {
                "id": "createPlayUnitEffect_PlayerB_96",
                "reason": [
                    "PlayCard",
                    "PlayerB",
                    "PlayerB_96",
                    {
                        "isPlayUnit": true
                    }
                ],
                "description": "Play ゲルググ",
                "text": {
                    "id": "createPlayUnitEffect_PlayerB_96",
                    "title": [
                        "使用型",
                        [
                            "自軍",
                            "配備フェイズ"
                        ]
                    ],
                    "description": "Play ゲルググ",
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
            }
        },
        {
            "id": 787,
            "description": "onEffectStart: Play ゲルググ",
            "effect": {
                "id": "createPlayUnitEffect_PlayerB_96",
                "reason": [
                    "PlayCard",
                    "PlayerB",
                    "PlayerB_96",
                    {
                        "isPlayUnit": true
                    }
                ],
                "description": "Play ゲルググ",
                "text": {
                    "id": "createPlayUnitEffect_PlayerB_96",
                    "title": [
                        "使用型",
                        [
                            "自軍",
                            "配備フェイズ"
                        ]
                    ],
                    "description": "Play ゲルググ",
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
            }
        },
        {
            "id": 786,
            "description": "onEffectEnd: PlayG"
        },
        {
            "id": 785,
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
            "id": 784,
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
            "id": 783,
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
            "id": 782,
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
            "id": 781,
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
            "id": 780,
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
            "id": 779,
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
            "id": 778,
            "description": "onSetPhase:配備フェイズ,フリータイミング"
        },
        {
            "id": 777,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 776,
            "description": "onSetPhase:配備フェイズ,フェイズ開始"
        },
        {
            "id": 775,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 774,
            "description": "onSetPhase:ドローフェイズ,フェイズ終了"
        },
        {
            "id": 773,
            "description": "onSetPhase:ドローフェイズ,フリータイミング"
        },
        {
            "id": 772,
            "description": "onEffectEnd: 抽牌階段規定效果"
        },
        {
            "id": 771,
            "description": "onItemMove:PlayerB_56 = [\"PlayerB\",\"本国\"] => [\"PlayerB\",\"手札\"]",
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
            "id": 770,
            "description": "onEvent: GameEventOnMove [\"PlayerB_56\"]",
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
            "id": 769,
            "description": "PlayerB_56.isRoll undefined => false",
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
            "id": 768,
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
            "id": 767,
            "description": "onSetPhase:ドローフェイズ,規定の効果"
        },
        {
            "id": 766,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 765,
            "description": "onSetPhase:ドローフェイズ,フェイズ開始"
        },
        {
            "id": 764,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 763,
            "description": "onSetPhase:リロールフェイズ,フェイズ終了"
        },
        {
            "id": 762,
            "description": "onSetPhase:リロールフェイズ,フリータイミング"
        },
        {
            "id": 761,
            "description": "onEffectEnd: getRerollPhaseRuleEffect"
        },
        {
            "id": 760,
            "description": "PlayerB_63.isRoll undefined => false",
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
            "id": 759,
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
            "id": 758,
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
            "id": 757,
            "description": "PlayerB_82.isRoll true => false",
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
            "id": 756,
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
            "id": 755,
            "description": "onSetPhase:リロールフェイズ,規定の効果"
        },
        {
            "id": 754,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 753,
            "description": "onSetPhase:リロールフェイズ,フェイズ開始"
        },
        {
            "id": 752,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 751,
            "description": "onPlayerStateChange:PlayerA"
        },
        {
            "id": 750,
            "description": "onSetPhase:戦闘フェイズ,ターン終了時,効果終了。ターン終了"
        },
        {
            "id": 749,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 748,
            "description": "onSetPhase:戦闘フェイズ,ターン終了時,手札調整"
        },
        {
            "id": 747,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 746,
            "description": "onSetPhase:戦闘フェイズ,ターン終了時,効果解決"
        },
        {
            "id": 745,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 744,
            "description": "onSetPhase:戦闘フェイズ,ターン終了時,ダメージリセット"
        },
        {
            "id": 743,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 742,
            "description": "onSetPhase:戦闘フェイズ,帰還ステップ,ステップ終了"
        },
        {
            "id": 741,
            "description": "onSetPhase:戦闘フェイズ,帰還ステップ,フリータイミング2"
        },
        {
            "id": 740,
            "description": "onEffectEnd: getReturnRuleEffect"
        },
        {
            "id": 739,
            "description": "onItemMove:PlayerA_8 = [\"PlayerA\",\"戦闘エリア1\"] => [\"PlayerA\",\"配備エリア\"]",
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
            "id": 738,
            "description": "onEvent: GameEventOnMove [\"PlayerA_8\"]",
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
            "id": 737,
            "description": "PlayerA_8.isRoll undefined => true",
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
            "id": 736,
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
            "id": 735,
            "description": "onSetPhase:戦闘フェイズ,帰還ステップ,規定の効果"
        },
        {
            "id": 734,
            "description": "onSetPhase:戦闘フェイズ,帰還ステップ,フリータイミング"
        },
        {
            "id": 733,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 732,
            "description": "onSetPhase:戦闘フェイズ,帰還ステップ,ステップ開始"
        },
        {
            "id": 731,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 730,
            "description": "onSetPhase:戦闘フェイズ,ダメージ判定ステップ,ステップ終了"
        },
        {
            "id": 729,
            "description": "onSetPhase:戦闘フェイズ,ダメージ判定ステップ,フリータイミング2"
        },
        {
            "id": 728,
            "description": "onEffectEnd: getDamageRuleEffect"
        },
        {
            "id": 727,
            "description": "onEvent: このカードの部隊が敵軍本国に戦闘ダメージを与えた場合 [\"PlayerA_8\"]",
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
            "id": 726,
            "description": "本國受到傷害: PlayerB => 6 damage",
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
            "id": 725,
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
            "id": 724,
            "description": "onItemMove:PlayerB_71 = [\"PlayerB\",\"本国\"] => [\"PlayerB\",\"捨て山\"]",
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
            "id": 723,
            "description": "onEvent: GameEventOnMove [\"PlayerB_71\"]",
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
            "id": 722,
            "description": "PlayerB_71.isRoll undefined => false",
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
            "id": 721,
            "description": "onItemMove:PlayerB_81 = [\"PlayerB\",\"本国\"] => [\"PlayerB\",\"捨て山\"]",
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
            "id": 720,
            "description": "onEvent: GameEventOnMove [\"PlayerB_81\"]",
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
            "id": 719,
            "description": "PlayerB_81.isRoll undefined => false",
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
            "id": 718,
            "description": "onItemMove:PlayerB_95 = [\"PlayerB\",\"本国\"] => [\"PlayerB\",\"捨て山\"]",
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
            "id": 717,
            "description": "onEvent: GameEventOnMove [\"PlayerB_95\"]",
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
            "id": 716,
            "description": "PlayerB_95.isRoll undefined => false",
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
            "id": 715,
            "description": "onItemMove:PlayerB_77 = [\"PlayerB\",\"本国\"] => [\"PlayerB\",\"捨て山\"]",
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
            "id": 714,
            "description": "onEvent: GameEventOnMove [\"PlayerB_77\"]",
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
            "id": 713,
            "description": "PlayerB_77.isRoll undefined => false",
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
            "id": 712,
            "description": "onItemMove:PlayerB_58 = [\"PlayerB\",\"本国\"] => [\"PlayerB\",\"捨て山\"]",
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
            "id": 711,
            "description": "onEvent: GameEventOnMove [\"PlayerB_58\"]",
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
            "id": 710,
            "description": "PlayerB_58.isRoll undefined => false",
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
            "id": 709,
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
            "id": 708,
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
            "id": 707,
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
            "id": 706,
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
            "id": 705,
            "description": "onSetPhase:戦闘フェイズ,ダメージ判定ステップ,規定の効果"
        },
        {
            "id": 704,
            "description": "onSetPhase:戦闘フェイズ,ダメージ判定ステップ,フリータイミング"
        },
        {
            "id": 703,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 702,
            "description": "onSetPhase:戦闘フェイズ,ダメージ判定ステップ,ステップ開始"
        },
        {
            "id": 701,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 700,
            "description": "onSetPhase:戦闘フェイズ,防御ステップ,ステップ終了"
        },
        {
            "id": 699,
            "description": "onSetPhase:戦闘フェイズ,防御ステップ,フリータイミング2"
        },
        {
            "id": 698,
            "description": "onEffectEnd: 出擊"
        },
        {
            "id": 697,
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
                            "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n            const runtimeBattleArea = GameStateFn2.getRuntimeBattleArea(ctx3, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A21\");\n            if (runtimeBattleArea == \"\\u5B87\\u5B99\\u30A8\\u30EA\\u30A2\")\n              return null;\n            const playerId2 = DefineFn2.EffectFn.getPlayerID(effect), opponentPlayerId = DefineFn2.PlayerIDFn.getOpponent(playerId2);\n            let unitIds = GameStateFn2.getItemIdsByBasyou(ctx3, DefineFn2.AbsoluteBaSyouFn.of(playerId2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\")).filter((cardId) => GameStateFn2.getSetGroupRoot(ctx3, cardId) == cardId).filter((cardId) => GameStateFn2.getCardBattleArea(ctx3, cardId).includes(runtimeBattleArea)).filter((cardId) => GameStateFn2.getCard(ctx3, cardId).isRoll != !0);\n            const opponentUnitIds = GameStateFn2.getBattleGroup(ctx3, DefineFn2.AbsoluteBaSyouFn.of(opponentPlayerId, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A21\"));\n            if (opponentUnitIds.length) {\n              if (GameStateFn2.isABattleGroup(ctx3, [\"\\u9AD8\\u6A5F\\u52D5\"], opponentUnitIds[0]))\n                unitIds = unitIds.filter((id) => GameStateFn2.isSetGroupHasA(ctx3, [\"\\u9AD8\\u6A5F\\u52D5\"], id));\n            }\n            return {\n              title: [\"\\u30AB\\u30FC\\u30C9\", unitIds.map((id) => {\n                return [id, GameStateFn2.getItemBaSyou(ctx3, id)];\n              }), []],\n              flags: { isGoBattleArea1: !0 }\n            };\n          }",
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                const playerId2 = DefineFn2.EffectFn.getPlayerID(effect), fackCardId = DefineFn2.EffectFn.getCardID(effect), earthPairs = GameStateFn2.getCardTipStrBaSyouPairs(ctx3, \"\\u53BB\\u5730\\u7403\", fackCardId), phase2 = GameStateFn2.getPhase(ctx3);\n                for (let pair3 of earthPairs)\n                  ctx3 = GameStateFn2.mapItemState(ctx3, pair3[0], (is) => ({ ...is, isAttack: phase2[1] == \"\\u653B\\u6483\\u30B9\\u30C6\\u30C3\\u30D7\", isDefence: phase2[1] == \"\\u9632\\u5FA1\\u30B9\\u30C6\\u30C3\\u30D7\" })), ctx3 = GameStateFn2.doItemMove(ctx3, DefineFn2.AbsoluteBaSyouFn.of(playerId2, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A21\"), pair3);\n                return ctx3;\n              }"
                                }
                            ],
                            "groupKey": "出擊"
                        },
                        "去宇宙": {
                            "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n            const runtimeBattleArea = GameStateFn2.getRuntimeBattleArea(ctx3, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A22\");\n            if (runtimeBattleArea == \"\\u5730\\u7403\\u30A8\\u30EA\\u30A2\")\n              return null;\n            const playerId2 = DefineFn2.EffectFn.getPlayerID(effect), opponentPlayerId = DefineFn2.PlayerIDFn.getOpponent(playerId2);\n            let unitIds = GameStateFn2.getItemIdsByBasyou(ctx3, DefineFn2.AbsoluteBaSyouFn.of(playerId2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\")).filter((cardId) => GameStateFn2.getSetGroupRoot(ctx3, cardId) == cardId).filter((cardId) => GameStateFn2.getCardBattleArea(ctx3, cardId).includes(runtimeBattleArea)).filter((cardId) => GameStateFn2.getCard(ctx3, cardId).isRoll != !0);\n            const opponentUnitIds = GameStateFn2.getBattleGroup(ctx3, DefineFn2.AbsoluteBaSyouFn.of(opponentPlayerId, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A22\"));\n            if (opponentUnitIds.length) {\n              if (GameStateFn2.isABattleGroup(ctx3, [\"\\u9AD8\\u6A5F\\u52D5\"], opponentUnitIds[0]))\n                unitIds = unitIds.filter((id) => GameStateFn2.isSetGroupHasA(ctx3, [\"\\u9AD8\\u6A5F\\u52D5\"], id));\n            }\n            return {\n              title: [\"\\u30AB\\u30FC\\u30C9\", unitIds.map((id) => {\n                return [id, GameStateFn2.getItemBaSyou(ctx3, id)];\n              }), []],\n              flags: { isGoBattleArea2: !0 }\n            };\n          }",
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
            "id": 696,
            "description": "onSetPhase:戦闘フェイズ,防御ステップ,規定の効果"
        },
        {
            "id": 695,
            "description": "onSetPhase:戦闘フェイズ,防御ステップ,フリータイミング"
        },
        {
            "id": 694,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 693,
            "description": "onSetPhase:戦闘フェイズ,防御ステップ,ステップ開始"
        },
        {
            "id": 692,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 691,
            "description": "onSetPhase:戦闘フェイズ,攻撃ステップ,ステップ終了"
        },
        {
            "id": 690,
            "description": "onSetPhase:戦闘フェイズ,攻撃ステップ,フリータイミング2"
        },
        {
            "id": 689,
            "description": "onEffectEnd: 出擊"
        },
        {
            "id": 688,
            "description": "onEvent: このカードが攻撃に出撃した場合 [\"PlayerA_8\"]",
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
                            "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n            const runtimeBattleArea = GameStateFn2.getRuntimeBattleArea(ctx3, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A21\");\n            if (runtimeBattleArea == \"\\u5B87\\u5B99\\u30A8\\u30EA\\u30A2\")\n              return null;\n            const playerId2 = DefineFn2.EffectFn.getPlayerID(effect), opponentPlayerId = DefineFn2.PlayerIDFn.getOpponent(playerId2);\n            let unitIds = GameStateFn2.getItemIdsByBasyou(ctx3, DefineFn2.AbsoluteBaSyouFn.of(playerId2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\")).filter((cardId) => GameStateFn2.getSetGroupRoot(ctx3, cardId) == cardId).filter((cardId) => GameStateFn2.getCardBattleArea(ctx3, cardId).includes(runtimeBattleArea)).filter((cardId) => GameStateFn2.getCard(ctx3, cardId).isRoll != !0);\n            const opponentUnitIds = GameStateFn2.getBattleGroup(ctx3, DefineFn2.AbsoluteBaSyouFn.of(opponentPlayerId, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A21\"));\n            if (opponentUnitIds.length) {\n              if (GameStateFn2.isABattleGroup(ctx3, [\"\\u9AD8\\u6A5F\\u52D5\"], opponentUnitIds[0]))\n                unitIds = unitIds.filter((id) => GameStateFn2.isSetGroupHasA(ctx3, [\"\\u9AD8\\u6A5F\\u52D5\"], id));\n            }\n            return {\n              title: [\"\\u30AB\\u30FC\\u30C9\", unitIds.map((id) => {\n                return [id, GameStateFn2.getItemBaSyou(ctx3, id)];\n              }), []],\n              flags: { isGoBattleArea1: !0 }\n            };\n          }",
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                const playerId2 = DefineFn2.EffectFn.getPlayerID(effect), fackCardId = DefineFn2.EffectFn.getCardID(effect), earthPairs = GameStateFn2.getCardTipStrBaSyouPairs(ctx3, \"\\u53BB\\u5730\\u7403\", fackCardId), phase2 = GameStateFn2.getPhase(ctx3);\n                for (let pair3 of earthPairs)\n                  ctx3 = GameStateFn2.mapItemState(ctx3, pair3[0], (is) => ({ ...is, isAttack: phase2[1] == \"\\u653B\\u6483\\u30B9\\u30C6\\u30C3\\u30D7\", isDefence: phase2[1] == \"\\u9632\\u5FA1\\u30B9\\u30C6\\u30C3\\u30D7\" })), ctx3 = GameStateFn2.doItemMove(ctx3, DefineFn2.AbsoluteBaSyouFn.of(playerId2, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A21\"), pair3);\n                return ctx3;\n              }"
                                }
                            ],
                            "groupKey": "出擊"
                        },
                        "去宇宙": {
                            "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n            const runtimeBattleArea = GameStateFn2.getRuntimeBattleArea(ctx3, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A22\");\n            if (runtimeBattleArea == \"\\u5730\\u7403\\u30A8\\u30EA\\u30A2\")\n              return null;\n            const playerId2 = DefineFn2.EffectFn.getPlayerID(effect), opponentPlayerId = DefineFn2.PlayerIDFn.getOpponent(playerId2);\n            let unitIds = GameStateFn2.getItemIdsByBasyou(ctx3, DefineFn2.AbsoluteBaSyouFn.of(playerId2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\")).filter((cardId) => GameStateFn2.getSetGroupRoot(ctx3, cardId) == cardId).filter((cardId) => GameStateFn2.getCardBattleArea(ctx3, cardId).includes(runtimeBattleArea)).filter((cardId) => GameStateFn2.getCard(ctx3, cardId).isRoll != !0);\n            const opponentUnitIds = GameStateFn2.getBattleGroup(ctx3, DefineFn2.AbsoluteBaSyouFn.of(opponentPlayerId, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A22\"));\n            if (opponentUnitIds.length) {\n              if (GameStateFn2.isABattleGroup(ctx3, [\"\\u9AD8\\u6A5F\\u52D5\"], opponentUnitIds[0]))\n                unitIds = unitIds.filter((id) => GameStateFn2.isSetGroupHasA(ctx3, [\"\\u9AD8\\u6A5F\\u52D5\"], id));\n            }\n            return {\n              title: [\"\\u30AB\\u30FC\\u30C9\", unitIds.map((id) => {\n                return [id, GameStateFn2.getItemBaSyou(ctx3, id)];\n              }), []],\n              flags: { isGoBattleArea2: !0 }\n            };\n          }",
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
            "id": 687,
            "description": "onItemMove:PlayerA_8 = [\"PlayerA\",\"配備エリア\"] => [\"PlayerA\",\"戦闘エリア1\"]",
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
                            "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n            const runtimeBattleArea = GameStateFn2.getRuntimeBattleArea(ctx3, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A21\");\n            if (runtimeBattleArea == \"\\u5B87\\u5B99\\u30A8\\u30EA\\u30A2\")\n              return null;\n            const playerId2 = DefineFn2.EffectFn.getPlayerID(effect), opponentPlayerId = DefineFn2.PlayerIDFn.getOpponent(playerId2);\n            let unitIds = GameStateFn2.getItemIdsByBasyou(ctx3, DefineFn2.AbsoluteBaSyouFn.of(playerId2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\")).filter((cardId) => GameStateFn2.getSetGroupRoot(ctx3, cardId) == cardId).filter((cardId) => GameStateFn2.getCardBattleArea(ctx3, cardId).includes(runtimeBattleArea)).filter((cardId) => GameStateFn2.getCard(ctx3, cardId).isRoll != !0);\n            const opponentUnitIds = GameStateFn2.getBattleGroup(ctx3, DefineFn2.AbsoluteBaSyouFn.of(opponentPlayerId, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A21\"));\n            if (opponentUnitIds.length) {\n              if (GameStateFn2.isABattleGroup(ctx3, [\"\\u9AD8\\u6A5F\\u52D5\"], opponentUnitIds[0]))\n                unitIds = unitIds.filter((id) => GameStateFn2.isSetGroupHasA(ctx3, [\"\\u9AD8\\u6A5F\\u52D5\"], id));\n            }\n            return {\n              title: [\"\\u30AB\\u30FC\\u30C9\", unitIds.map((id) => {\n                return [id, GameStateFn2.getItemBaSyou(ctx3, id)];\n              }), []],\n              flags: { isGoBattleArea1: !0 }\n            };\n          }",
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                const playerId2 = DefineFn2.EffectFn.getPlayerID(effect), fackCardId = DefineFn2.EffectFn.getCardID(effect), earthPairs = GameStateFn2.getCardTipStrBaSyouPairs(ctx3, \"\\u53BB\\u5730\\u7403\", fackCardId), phase2 = GameStateFn2.getPhase(ctx3);\n                for (let pair3 of earthPairs)\n                  ctx3 = GameStateFn2.mapItemState(ctx3, pair3[0], (is) => ({ ...is, isAttack: phase2[1] == \"\\u653B\\u6483\\u30B9\\u30C6\\u30C3\\u30D7\", isDefence: phase2[1] == \"\\u9632\\u5FA1\\u30B9\\u30C6\\u30C3\\u30D7\" })), ctx3 = GameStateFn2.doItemMove(ctx3, DefineFn2.AbsoluteBaSyouFn.of(playerId2, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A21\"), pair3);\n                return ctx3;\n              }"
                                }
                            ],
                            "groupKey": "出擊"
                        },
                        "去宇宙": {
                            "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n            const runtimeBattleArea = GameStateFn2.getRuntimeBattleArea(ctx3, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A22\");\n            if (runtimeBattleArea == \"\\u5730\\u7403\\u30A8\\u30EA\\u30A2\")\n              return null;\n            const playerId2 = DefineFn2.EffectFn.getPlayerID(effect), opponentPlayerId = DefineFn2.PlayerIDFn.getOpponent(playerId2);\n            let unitIds = GameStateFn2.getItemIdsByBasyou(ctx3, DefineFn2.AbsoluteBaSyouFn.of(playerId2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\")).filter((cardId) => GameStateFn2.getSetGroupRoot(ctx3, cardId) == cardId).filter((cardId) => GameStateFn2.getCardBattleArea(ctx3, cardId).includes(runtimeBattleArea)).filter((cardId) => GameStateFn2.getCard(ctx3, cardId).isRoll != !0);\n            const opponentUnitIds = GameStateFn2.getBattleGroup(ctx3, DefineFn2.AbsoluteBaSyouFn.of(opponentPlayerId, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A22\"));\n            if (opponentUnitIds.length) {\n              if (GameStateFn2.isABattleGroup(ctx3, [\"\\u9AD8\\u6A5F\\u52D5\"], opponentUnitIds[0]))\n                unitIds = unitIds.filter((id) => GameStateFn2.isSetGroupHasA(ctx3, [\"\\u9AD8\\u6A5F\\u52D5\"], id));\n            }\n            return {\n              title: [\"\\u30AB\\u30FC\\u30C9\", unitIds.map((id) => {\n                return [id, GameStateFn2.getItemBaSyou(ctx3, id)];\n              }), []],\n              flags: { isGoBattleArea2: !0 }\n            };\n          }",
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
            "id": 686,
            "description": "onEvent: GameEventOnMove [\"PlayerA_8\"]",
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
                            "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n            const runtimeBattleArea = GameStateFn2.getRuntimeBattleArea(ctx3, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A21\");\n            if (runtimeBattleArea == \"\\u5B87\\u5B99\\u30A8\\u30EA\\u30A2\")\n              return null;\n            const playerId2 = DefineFn2.EffectFn.getPlayerID(effect), opponentPlayerId = DefineFn2.PlayerIDFn.getOpponent(playerId2);\n            let unitIds = GameStateFn2.getItemIdsByBasyou(ctx3, DefineFn2.AbsoluteBaSyouFn.of(playerId2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\")).filter((cardId) => GameStateFn2.getSetGroupRoot(ctx3, cardId) == cardId).filter((cardId) => GameStateFn2.getCardBattleArea(ctx3, cardId).includes(runtimeBattleArea)).filter((cardId) => GameStateFn2.getCard(ctx3, cardId).isRoll != !0);\n            const opponentUnitIds = GameStateFn2.getBattleGroup(ctx3, DefineFn2.AbsoluteBaSyouFn.of(opponentPlayerId, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A21\"));\n            if (opponentUnitIds.length) {\n              if (GameStateFn2.isABattleGroup(ctx3, [\"\\u9AD8\\u6A5F\\u52D5\"], opponentUnitIds[0]))\n                unitIds = unitIds.filter((id) => GameStateFn2.isSetGroupHasA(ctx3, [\"\\u9AD8\\u6A5F\\u52D5\"], id));\n            }\n            return {\n              title: [\"\\u30AB\\u30FC\\u30C9\", unitIds.map((id) => {\n                return [id, GameStateFn2.getItemBaSyou(ctx3, id)];\n              }), []],\n              flags: { isGoBattleArea1: !0 }\n            };\n          }",
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                const playerId2 = DefineFn2.EffectFn.getPlayerID(effect), fackCardId = DefineFn2.EffectFn.getCardID(effect), earthPairs = GameStateFn2.getCardTipStrBaSyouPairs(ctx3, \"\\u53BB\\u5730\\u7403\", fackCardId), phase2 = GameStateFn2.getPhase(ctx3);\n                for (let pair3 of earthPairs)\n                  ctx3 = GameStateFn2.mapItemState(ctx3, pair3[0], (is) => ({ ...is, isAttack: phase2[1] == \"\\u653B\\u6483\\u30B9\\u30C6\\u30C3\\u30D7\", isDefence: phase2[1] == \"\\u9632\\u5FA1\\u30B9\\u30C6\\u30C3\\u30D7\" })), ctx3 = GameStateFn2.doItemMove(ctx3, DefineFn2.AbsoluteBaSyouFn.of(playerId2, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A21\"), pair3);\n                return ctx3;\n              }"
                                }
                            ],
                            "groupKey": "出擊"
                        },
                        "去宇宙": {
                            "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n            const runtimeBattleArea = GameStateFn2.getRuntimeBattleArea(ctx3, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A22\");\n            if (runtimeBattleArea == \"\\u5730\\u7403\\u30A8\\u30EA\\u30A2\")\n              return null;\n            const playerId2 = DefineFn2.EffectFn.getPlayerID(effect), opponentPlayerId = DefineFn2.PlayerIDFn.getOpponent(playerId2);\n            let unitIds = GameStateFn2.getItemIdsByBasyou(ctx3, DefineFn2.AbsoluteBaSyouFn.of(playerId2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\")).filter((cardId) => GameStateFn2.getSetGroupRoot(ctx3, cardId) == cardId).filter((cardId) => GameStateFn2.getCardBattleArea(ctx3, cardId).includes(runtimeBattleArea)).filter((cardId) => GameStateFn2.getCard(ctx3, cardId).isRoll != !0);\n            const opponentUnitIds = GameStateFn2.getBattleGroup(ctx3, DefineFn2.AbsoluteBaSyouFn.of(opponentPlayerId, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A22\"));\n            if (opponentUnitIds.length) {\n              if (GameStateFn2.isABattleGroup(ctx3, [\"\\u9AD8\\u6A5F\\u52D5\"], opponentUnitIds[0]))\n                unitIds = unitIds.filter((id) => GameStateFn2.isSetGroupHasA(ctx3, [\"\\u9AD8\\u6A5F\\u52D5\"], id));\n            }\n            return {\n              title: [\"\\u30AB\\u30FC\\u30C9\", unitIds.map((id) => {\n                return [id, GameStateFn2.getItemBaSyou(ctx3, id)];\n              }), []],\n              flags: { isGoBattleArea2: !0 }\n            };\n          }",
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
            "id": 685,
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
                            "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n            const runtimeBattleArea = GameStateFn2.getRuntimeBattleArea(ctx3, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A21\");\n            if (runtimeBattleArea == \"\\u5B87\\u5B99\\u30A8\\u30EA\\u30A2\")\n              return null;\n            const playerId2 = DefineFn2.EffectFn.getPlayerID(effect), opponentPlayerId = DefineFn2.PlayerIDFn.getOpponent(playerId2);\n            let unitIds = GameStateFn2.getItemIdsByBasyou(ctx3, DefineFn2.AbsoluteBaSyouFn.of(playerId2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\")).filter((cardId) => GameStateFn2.getSetGroupRoot(ctx3, cardId) == cardId).filter((cardId) => GameStateFn2.getCardBattleArea(ctx3, cardId).includes(runtimeBattleArea)).filter((cardId) => GameStateFn2.getCard(ctx3, cardId).isRoll != !0);\n            const opponentUnitIds = GameStateFn2.getBattleGroup(ctx3, DefineFn2.AbsoluteBaSyouFn.of(opponentPlayerId, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A21\"));\n            if (opponentUnitIds.length) {\n              if (GameStateFn2.isABattleGroup(ctx3, [\"\\u9AD8\\u6A5F\\u52D5\"], opponentUnitIds[0]))\n                unitIds = unitIds.filter((id) => GameStateFn2.isSetGroupHasA(ctx3, [\"\\u9AD8\\u6A5F\\u52D5\"], id));\n            }\n            return {\n              title: [\"\\u30AB\\u30FC\\u30C9\", unitIds.map((id) => {\n                return [id, GameStateFn2.getItemBaSyou(ctx3, id)];\n              }), []],\n              flags: { isGoBattleArea1: !0 }\n            };\n          }",
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                const playerId2 = DefineFn2.EffectFn.getPlayerID(effect), fackCardId = DefineFn2.EffectFn.getCardID(effect), earthPairs = GameStateFn2.getCardTipStrBaSyouPairs(ctx3, \"\\u53BB\\u5730\\u7403\", fackCardId), phase2 = GameStateFn2.getPhase(ctx3);\n                for (let pair3 of earthPairs)\n                  ctx3 = GameStateFn2.mapItemState(ctx3, pair3[0], (is) => ({ ...is, isAttack: phase2[1] == \"\\u653B\\u6483\\u30B9\\u30C6\\u30C3\\u30D7\", isDefence: phase2[1] == \"\\u9632\\u5FA1\\u30B9\\u30C6\\u30C3\\u30D7\" })), ctx3 = GameStateFn2.doItemMove(ctx3, DefineFn2.AbsoluteBaSyouFn.of(playerId2, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A21\"), pair3);\n                return ctx3;\n              }"
                                }
                            ],
                            "groupKey": "出擊"
                        },
                        "去宇宙": {
                            "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n            const runtimeBattleArea = GameStateFn2.getRuntimeBattleArea(ctx3, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A22\");\n            if (runtimeBattleArea == \"\\u5730\\u7403\\u30A8\\u30EA\\u30A2\")\n              return null;\n            const playerId2 = DefineFn2.EffectFn.getPlayerID(effect), opponentPlayerId = DefineFn2.PlayerIDFn.getOpponent(playerId2);\n            let unitIds = GameStateFn2.getItemIdsByBasyou(ctx3, DefineFn2.AbsoluteBaSyouFn.of(playerId2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\")).filter((cardId) => GameStateFn2.getSetGroupRoot(ctx3, cardId) == cardId).filter((cardId) => GameStateFn2.getCardBattleArea(ctx3, cardId).includes(runtimeBattleArea)).filter((cardId) => GameStateFn2.getCard(ctx3, cardId).isRoll != !0);\n            const opponentUnitIds = GameStateFn2.getBattleGroup(ctx3, DefineFn2.AbsoluteBaSyouFn.of(opponentPlayerId, \"\\u6226\\u95D8\\u30A8\\u30EA\\u30A22\"));\n            if (opponentUnitIds.length) {\n              if (GameStateFn2.isABattleGroup(ctx3, [\"\\u9AD8\\u6A5F\\u52D5\"], opponentUnitIds[0]))\n                unitIds = unitIds.filter((id) => GameStateFn2.isSetGroupHasA(ctx3, [\"\\u9AD8\\u6A5F\\u52D5\"], id));\n            }\n            return {\n              title: [\"\\u30AB\\u30FC\\u30C9\", unitIds.map((id) => {\n                return [id, GameStateFn2.getItemBaSyou(ctx3, id)];\n              }), []],\n              flags: { isGoBattleArea2: !0 }\n            };\n          }",
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
            "id": 684,
            "description": "onSetPhase:戦闘フェイズ,攻撃ステップ,規定の効果"
        },
        {
            "id": 683,
            "description": "onSetPhase:戦闘フェイズ,攻撃ステップ,フリータイミング"
        },
        {
            "id": 682,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 681,
            "description": "onSetPhase:戦闘フェイズ,攻撃ステップ,ステップ開始"
        },
        {
            "id": 680,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 679,
            "description": "onSetPhase:配備フェイズ,フェイズ終了"
        },
        {
            "id": 678,
            "description": "onEffectEnd: PlayG"
        },
        {
            "id": 677,
            "description": "onEvent: このカードがGとして場に出た場合 [\"PlayerA_25\"]",
            "effect": {
                "id": "createPlayGEffect_PlayerA_25",
                "reason": [
                    "PlayCard",
                    "PlayerA",
                    "PlayerA_25",
                    {
                        "isPlayG": true
                    }
                ],
                "description": "Play G",
                "text": {
                    "id": "createPlayGEffect_PlayerA_25",
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
            "id": 676,
            "description": "onEvent: プレイされて場に出た場合 [\"PlayerA_25\"]",
            "effect": {
                "id": "createPlayGEffect_PlayerA_25",
                "reason": [
                    "PlayCard",
                    "PlayerA",
                    "PlayerA_25",
                    {
                        "isPlayG": true
                    }
                ],
                "description": "Play G",
                "text": {
                    "id": "createPlayGEffect_PlayerA_25",
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
            "id": 675,
            "description": "onItemMove:PlayerA_25 = [\"PlayerA\",\"手札\"] => [\"PlayerA\",\"Gゾーン\"]",
            "effect": {
                "id": "createPlayGEffect_PlayerA_25",
                "reason": [
                    "PlayCard",
                    "PlayerA",
                    "PlayerA_25",
                    {
                        "isPlayG": true
                    }
                ],
                "description": "Play G",
                "text": {
                    "id": "createPlayGEffect_PlayerA_25",
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
            "id": 674,
            "description": "onEvent: GameEventOnMove [\"PlayerA_25\"]",
            "effect": {
                "id": "createPlayGEffect_PlayerA_25",
                "reason": [
                    "PlayCard",
                    "PlayerA",
                    "PlayerA_25",
                    {
                        "isPlayG": true
                    }
                ],
                "description": "Play G",
                "text": {
                    "id": "createPlayGEffect_PlayerA_25",
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
            "id": 673,
            "description": "PlayerA_25.isFaceDown true => false",
            "effect": {
                "id": "createPlayGEffect_PlayerA_25",
                "reason": [
                    "PlayCard",
                    "PlayerA",
                    "PlayerA_25",
                    {
                        "isPlayG": true
                    }
                ],
                "description": "Play G",
                "text": {
                    "id": "createPlayGEffect_PlayerA_25",
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
            "id": 672,
            "description": "onPlayerStateChange:PlayerA",
            "effect": {
                "id": "createPlayGEffect_PlayerA_25",
                "reason": [
                    "PlayCard",
                    "PlayerA",
                    "PlayerA_25",
                    {
                        "isPlayG": true
                    }
                ],
                "description": "Play G",
                "text": {
                    "id": "createPlayGEffect_PlayerA_25",
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
            "id": 671,
            "description": "onEffectStart: PlayG",
            "effect": {
                "id": "createPlayGEffect_PlayerA_25",
                "reason": [
                    "PlayCard",
                    "PlayerA",
                    "PlayerA_25",
                    {
                        "isPlayG": true
                    }
                ],
                "description": "Play G",
                "text": {
                    "id": "createPlayGEffect_PlayerA_25",
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
            "id": 670,
            "description": "onSetPhase:配備フェイズ,フリータイミング"
        },
        {
            "id": 669,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 668,
            "description": "onSetPhase:配備フェイズ,フェイズ開始"
        },
        {
            "id": 667,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 666,
            "description": "onSetPhase:ドローフェイズ,フェイズ終了"
        },
        {
            "id": 665,
            "description": "onSetPhase:ドローフェイズ,フリータイミング"
        },
        {
            "id": 664,
            "description": "onEffectEnd: 抽牌階段規定效果"
        },
        {
            "id": 663,
            "description": "onItemMove:PlayerA_25 = [\"PlayerA\",\"本国\"] => [\"PlayerA\",\"手札\"]",
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
            "id": 662,
            "description": "onEvent: GameEventOnMove [\"PlayerA_25\"]",
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
            "id": 661,
            "description": "PlayerA_25.isRoll undefined => false",
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
            "id": 660,
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
            "id": 659,
            "description": "onSetPhase:ドローフェイズ,規定の効果"
        },
        {
            "id": 658,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 657,
            "description": "onSetPhase:ドローフェイズ,フェイズ開始"
        },
        {
            "id": 656,
            "description": "onEvent: GameEventOnTiming undefined"
        },
        {
            "id": 655,
            "description": "onSetPhase:リロールフェイズ,フェイズ終了"
        },
        {
            "id": 654,
            "description": "onEvent: カット終了時 undefined"
        },
        {
            "id": 653,
            "description": "onEffectEnd: （常時）〔１〕：自軍手札、または自軍ハンガーにある「特徴：ヴァイエイト系」を持つユニット１枚を、自軍配備エリアにリロール状態で出す。"
        },
        {
            "id": 652,
            "description": "onItemMove:PlayerA_8 = [\"PlayerA\",\"手札\"] => [\"PlayerA\",\"配備エリア\"]",
            "effect": {
                "id": "addStackEffect_01928bf7-16f8-7007-a0f3-9b8757af2770",
                "description": "（常時）〔１〕：自軍手札、または自軍ハンガーにある「特徴：ヴァイエイト系」を持つユニット１枚を、自軍配備エリアにリロール状態で出す。",
                "reason": [
                    "PlayText",
                    "PlayerA",
                    "PlayerA_11",
                    "loadPrototype_179009_03B_U_WT045U_white_text_1"
                ],
                "text": {
                    "id": "loadPrototype_179009_03B_U_WT045U_white_text_1",
                    "description": "（常時）〔１〕：自軍手札、または自軍ハンガーにある「特徴：ヴァイエイト系」を持つユニット１枚を、自軍配備エリアにリロール状態で出す。",
                    "title": [],
                    "logicTreeActions": [
                        {
                            "actions": [
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
                        }
                    ]
                }
            }
        },
        {
            "id": 651,
            "description": "onEvent: GameEventOnMove [\"PlayerA_8\"]",
            "effect": {
                "id": "addStackEffect_01928bf7-16f8-7007-a0f3-9b8757af2770",
                "description": "（常時）〔１〕：自軍手札、または自軍ハンガーにある「特徴：ヴァイエイト系」を持つユニット１枚を、自軍配備エリアにリロール状態で出す。",
                "reason": [
                    "PlayText",
                    "PlayerA",
                    "PlayerA_11",
                    "loadPrototype_179009_03B_U_WT045U_white_text_1"
                ],
                "text": {
                    "id": "loadPrototype_179009_03B_U_WT045U_white_text_1",
                    "description": "（常時）〔１〕：自軍手札、または自軍ハンガーにある「特徴：ヴァイエイト系」を持つユニット１枚を、自軍配備エリアにリロール状態で出す。",
                    "title": [],
                    "logicTreeActions": [
                        {
                            "actions": [
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
                        }
                    ]
                }
            }
        },
        {
            "id": 650,
            "description": "onEvent: このカードが場に出た場合 [\"PlayerA_8\"]",
            "effect": {
                "id": "addStackEffect_01928bf7-16f8-7007-a0f3-9b8757af2770",
                "description": "（常時）〔１〕：自軍手札、または自軍ハンガーにある「特徴：ヴァイエイト系」を持つユニット１枚を、自軍配備エリアにリロール状態で出す。",
                "reason": [
                    "PlayText",
                    "PlayerA",
                    "PlayerA_11",
                    "loadPrototype_179009_03B_U_WT045U_white_text_1"
                ],
                "text": {
                    "id": "loadPrototype_179009_03B_U_WT045U_white_text_1",
                    "description": "（常時）〔１〕：自軍手札、または自軍ハンガーにある「特徴：ヴァイエイト系」を持つユニット１枚を、自軍配備エリアにリロール状態で出す。",
                    "title": [],
                    "logicTreeActions": [
                        {
                            "actions": [
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
                        }
                    ]
                }
            }
        },
        {
            "id": 649,
            "description": "PlayerA_8.isFaceDown true => false",
            "effect": {
                "id": "addStackEffect_01928bf7-16f8-7007-a0f3-9b8757af2770",
                "description": "（常時）〔１〕：自軍手札、または自軍ハンガーにある「特徴：ヴァイエイト系」を持つユニット１枚を、自軍配備エリアにリロール状態で出す。",
                "reason": [
                    "PlayText",
                    "PlayerA",
                    "PlayerA_11",
                    "loadPrototype_179009_03B_U_WT045U_white_text_1"
                ],
                "text": {
                    "id": "loadPrototype_179009_03B_U_WT045U_white_text_1",
                    "description": "（常時）〔１〕：自軍手札、または自軍ハンガーにある「特徴：ヴァイエイト系」を持つユニット１枚を、自軍配備エリアにリロール状態で出す。",
                    "title": [],
                    "logicTreeActions": [
                        {
                            "actions": [
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
                        }
                    ]
                }
            }
        },
        {
            "id": 648,
            "description": "onEffectStart: （常時）〔１〕：自軍手札、または自軍ハンガーにある「特徴：ヴァイエイト系」を持つユニット１枚を、自軍配備エリアにリロール状態で出す。",
            "effect": {
                "id": "addStackEffect_01928bf7-16f8-7007-a0f3-9b8757af2770",
                "description": "（常時）〔１〕：自軍手札、または自軍ハンガーにある「特徴：ヴァイエイト系」を持つユニット１枚を、自軍配備エリアにリロール状態で出す。",
                "reason": [
                    "PlayText",
                    "PlayerA",
                    "PlayerA_11",
                    "loadPrototype_179009_03B_U_WT045U_white_text_1"
                ],
                "text": {
                    "id": "loadPrototype_179009_03B_U_WT045U_white_text_1",
                    "description": "（常時）〔１〕：自軍手札、または自軍ハンガーにある「特徴：ヴァイエイト系」を持つユニット１枚を、自軍配備エリアにリロール状態で出す。",
                    "title": [],
                    "logicTreeActions": [
                        {
                            "actions": [
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
                        }
                    ]
                }
            }
        },
        {
            "id": 647,
            "description": "onEffectEnd: （常時）〔１〕：自軍手札、または自軍ハンガーにある「特徴：ヴァイエイト系」を持つユニット１枚を、自軍配備エリアにリロール状態で出す。"
        },
        {
            "id": 646,
            "description": "PlayerA_46.isRoll false => true",
            "effect": {
                "id": "createPlayEffects_PlayerA_PlayerA_11_loadPrototype_179009_03B_U_WT045U_white_text_1",
                "reason": [
                    "PlayText",
                    "PlayerA",
                    "PlayerA_11",
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
            }
        },
        {
            "id": 645,
            "description": "onEffectStart: （常時）〔１〕：自軍手札、または自軍ハンガーにある「特徴：ヴァイエイト系」を持つユニット１枚を、自軍配備エリアにリロール状態で出す。",
            "effect": {
                "id": "createPlayEffects_PlayerA_PlayerA_11_loadPrototype_179009_03B_U_WT045U_white_text_1",
                "reason": [
                    "PlayText",
                    "PlayerA",
                    "PlayerA_11",
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
            }
        },
        {
            "id": 644,
            "description": "onEvent: カット終了時 undefined"
        },
        {
            "id": 643,
            "description": "onEffectEnd: （常時）〔１〕：自軍手札、または自軍ハンガーにある「特徴：メリクリウス系」を持つユニット１枚を、自軍配備エリアにリロール状態で出す。"
        },
        {
            "id": 642,
            "description": "onItemMove:PlayerA_11 = [\"PlayerA\",\"手札\"] => [\"PlayerA\",\"配備エリア\"]",
            "effect": {
                "id": "addStackEffect_01928bf6-d196-7007-963d-ee6780a1fd43",
                "description": "（常時）〔１〕：自軍手札、または自軍ハンガーにある「特徴：メリクリウス系」を持つユニット１枚を、自軍配備エリアにリロール状態で出す。",
                "reason": [
                    "PlayText",
                    "PlayerA",
                    "PlayerA_7",
                    "loadPrototype_179009_03B_U_WT044U_white_text_1"
                ],
                "text": {
                    "id": "loadPrototype_179009_03B_U_WT044U_white_text_1",
                    "description": "（常時）〔１〕：自軍手札、または自軍ハンガーにある「特徴：メリクリウス系」を持つユニット１枚を、自軍配備エリアにリロール状態で出す。",
                    "title": [],
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": [
                                        "_の_ハンガーに移す",
                                        "自軍",
                                        "配備エリア"
                                    ],
                                    "vars": [
                                        "自軍手札、または自軍ハンガーにある「特徴：メリクリウス系」を持つユニット１枚"
                                    ]
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 641,
            "description": "onEvent: GameEventOnMove [\"PlayerA_11\"]",
            "effect": {
                "id": "addStackEffect_01928bf6-d196-7007-963d-ee6780a1fd43",
                "description": "（常時）〔１〕：自軍手札、または自軍ハンガーにある「特徴：メリクリウス系」を持つユニット１枚を、自軍配備エリアにリロール状態で出す。",
                "reason": [
                    "PlayText",
                    "PlayerA",
                    "PlayerA_7",
                    "loadPrototype_179009_03B_U_WT044U_white_text_1"
                ],
                "text": {
                    "id": "loadPrototype_179009_03B_U_WT044U_white_text_1",
                    "description": "（常時）〔１〕：自軍手札、または自軍ハンガーにある「特徴：メリクリウス系」を持つユニット１枚を、自軍配備エリアにリロール状態で出す。",
                    "title": [],
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": [
                                        "_の_ハンガーに移す",
                                        "自軍",
                                        "配備エリア"
                                    ],
                                    "vars": [
                                        "自軍手札、または自軍ハンガーにある「特徴：メリクリウス系」を持つユニット１枚"
                                    ]
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 640,
            "description": "onEvent: このカードが場に出た場合 [\"PlayerA_11\"]",
            "effect": {
                "id": "addStackEffect_01928bf6-d196-7007-963d-ee6780a1fd43",
                "description": "（常時）〔１〕：自軍手札、または自軍ハンガーにある「特徴：メリクリウス系」を持つユニット１枚を、自軍配備エリアにリロール状態で出す。",
                "reason": [
                    "PlayText",
                    "PlayerA",
                    "PlayerA_7",
                    "loadPrototype_179009_03B_U_WT044U_white_text_1"
                ],
                "text": {
                    "id": "loadPrototype_179009_03B_U_WT044U_white_text_1",
                    "description": "（常時）〔１〕：自軍手札、または自軍ハンガーにある「特徴：メリクリウス系」を持つユニット１枚を、自軍配備エリアにリロール状態で出す。",
                    "title": [],
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": [
                                        "_の_ハンガーに移す",
                                        "自軍",
                                        "配備エリア"
                                    ],
                                    "vars": [
                                        "自軍手札、または自軍ハンガーにある「特徴：メリクリウス系」を持つユニット１枚"
                                    ]
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 639,
            "description": "PlayerA_11.isFaceDown true => false",
            "effect": {
                "id": "addStackEffect_01928bf6-d196-7007-963d-ee6780a1fd43",
                "description": "（常時）〔１〕：自軍手札、または自軍ハンガーにある「特徴：メリクリウス系」を持つユニット１枚を、自軍配備エリアにリロール状態で出す。",
                "reason": [
                    "PlayText",
                    "PlayerA",
                    "PlayerA_7",
                    "loadPrototype_179009_03B_U_WT044U_white_text_1"
                ],
                "text": {
                    "id": "loadPrototype_179009_03B_U_WT044U_white_text_1",
                    "description": "（常時）〔１〕：自軍手札、または自軍ハンガーにある「特徴：メリクリウス系」を持つユニット１枚を、自軍配備エリアにリロール状態で出す。",
                    "title": [],
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": [
                                        "_の_ハンガーに移す",
                                        "自軍",
                                        "配備エリア"
                                    ],
                                    "vars": [
                                        "自軍手札、または自軍ハンガーにある「特徴：メリクリウス系」を持つユニット１枚"
                                    ]
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 638,
            "description": "onEffectStart: （常時）〔１〕：自軍手札、または自軍ハンガーにある「特徴：メリクリウス系」を持つユニット１枚を、自軍配備エリアにリロール状態で出す。",
            "effect": {
                "id": "addStackEffect_01928bf6-d196-7007-963d-ee6780a1fd43",
                "description": "（常時）〔１〕：自軍手札、または自軍ハンガーにある「特徴：メリクリウス系」を持つユニット１枚を、自軍配備エリアにリロール状態で出す。",
                "reason": [
                    "PlayText",
                    "PlayerA",
                    "PlayerA_7",
                    "loadPrototype_179009_03B_U_WT044U_white_text_1"
                ],
                "text": {
                    "id": "loadPrototype_179009_03B_U_WT044U_white_text_1",
                    "description": "（常時）〔１〕：自軍手札、または自軍ハンガーにある「特徴：メリクリウス系」を持つユニット１枚を、自軍配備エリアにリロール状態で出す。",
                    "title": [],
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": [
                                        "_の_ハンガーに移す",
                                        "自軍",
                                        "配備エリア"
                                    ],
                                    "vars": [
                                        "自軍手札、または自軍ハンガーにある「特徴：メリクリウス系」を持つユニット１枚"
                                    ]
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "id": 637,
            "description": "onEffectEnd: （常時）〔１〕：自軍手札、または自軍ハンガーにある「特徴：メリクリウス系」を持つユニット１枚を、自軍配備エリアにリロール状態で出す。"
        },
        {
            "id": 636,
            "description": "PlayerA_5.isRoll false => true",
            "effect": {
                "id": "createPlayEffects_PlayerA_PlayerA_7_loadPrototype_179009_03B_U_WT044U_white_text_1",
                "reason": [
                    "PlayText",
                    "PlayerA",
                    "PlayerA_7",
                    "loadPrototype_179009_03B_U_WT044U_white_text_1"
                ],
                "description": "（常時）〔１〕：自軍手札、または自軍ハンガーにある「特徴：メリクリウス系」を持つユニット１枚を、自軍配備エリアにリロール状態で出す。",
                "text": {
                    "id": "loadPrototype_179009_03B_U_WT044U_white_text_1",
                    "description": "（常時）〔１〕：自軍手札、または自軍ハンガーにある「特徴：メリクリウス系」を持つユニット１枚を、自軍配備エリアにリロール状態で出す。",
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
                        "自軍手札、または自軍ハンガーにある「特徴：メリクリウス系」を持つユニット１枚": {
                            "title": [
                                "Entity",
                                {
                                    "side": "自軍",
                                    "at": [
                                        "手札",
                                        "ハンガー"
                                    ],
                                    "hasChar": [
                                        "メリクリウス系"
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
                                                    "自軍手札、または自軍ハンガーにある「特徴：メリクリウス系」を持つユニット１枚"
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
            "id": 635,
            "description": "onEffectStart: （常時）〔１〕：自軍手札、または自軍ハンガーにある「特徴：メリクリウス系」を持つユニット１枚を、自軍配備エリアにリロール状態で出す。",
            "effect": {
                "id": "createPlayEffects_PlayerA_PlayerA_7_loadPrototype_179009_03B_U_WT044U_white_text_1",
                "reason": [
                    "PlayText",
                    "PlayerA",
                    "PlayerA_7",
                    "loadPrototype_179009_03B_U_WT044U_white_text_1"
                ],
                "description": "（常時）〔１〕：自軍手札、または自軍ハンガーにある「特徴：メリクリウス系」を持つユニット１枚を、自軍配備エリアにリロール状態で出す。",
                "text": {
                    "id": "loadPrototype_179009_03B_U_WT044U_white_text_1",
                    "description": "（常時）〔１〕：自軍手札、または自軍ハンガーにある「特徴：メリクリウス系」を持つユニット１枚を、自軍配備エリアにリロール状態で出す。",
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
                        "自軍手札、または自軍ハンガーにある「特徴：メリクリウス系」を持つユニット１枚": {
                            "title": [
                                "Entity",
                                {
                                    "side": "自軍",
                                    "at": [
                                        "手札",
                                        "ハンガー"
                                    ],
                                    "hasChar": [
                                        "メリクリウス系"
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
                                                    "自軍手札、または自軍ハンガーにある「特徴：メリクリウス系」を持つユニット１枚"
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
            "id": 634,
            "description": "onSetPhase:リロールフェイズ,フリータイミング"
        },
        {
            "id": 633,
            "description": "onEffectEnd: getRerollPhaseRuleEffect"
        },
        {
            "id": 632,
            "description": "PlayerA_14.isRoll true => false",
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
            "id": 631,
            "description": "PlayerA_46.isRoll true => false",
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
            "id": 630,
            "description": "PlayerA_5.isRoll true => false",
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
            "id": 629,
            "description": "PlayerA_7.isRoll true => false",
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
            "id": 628,
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
        }
    ],
    "messagesCurrentEffect": null,
    "messagesIsPlayerRead": {},
    "turn": 7,
    "setGroup": {
        "itemGroupParent": {},
        "itemGroupChildren": {}
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