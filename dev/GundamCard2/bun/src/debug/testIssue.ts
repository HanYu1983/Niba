import { EffectFn } from "../game/define/Effect"
import { ItemStateFn } from "../game/define/ItemState"
import { PlayerA, PlayerB, PlayerIDFn } from "../game/define/PlayerID"
import { setTipSelectionForUser, doEffect, createEffectTips } from "../game/gameState/doEffect"
import { createPlayEffects } from "../game/gameState/createPlayEffects"
import { mapItemState } from "../game/gameState/ItemStateComponent"
import { GameStateWithFlowMemory } from "../game/gameStateWithFlowMemory/GameStateWithFlowMemory"
import { getPrototype, loadPrototype } from "../script"
import { queryFlow } from "../game/gameStateWithFlowMemory/queryFlow"
import { applyFlow, createAIChoiseList } from "../game/gameStateWithFlowMemory/applyFlow"
import { getActivePlayerID } from "../game/gameState/ActivePlayerComponent"
import { AbsoluteBaSyouFn } from "../game/define/BaSyou"
import { TargetMissingError } from "../game/define/GameError"
import { getItemIdsByBasyou } from "../game/gameState/ItemTableComponent"
import { getPhase } from "../game/gameState/PhaseComponent"
import { Flow } from "../game/gameStateWithFlowMemory/Flow"
import { TableFns } from "../tool/table"
import { getCard, mapCard } from "../game/gameState/CardTableComponent"
import { getCardIdsCanPayRollCost } from "../game/gameState/card"
import { clearGlobalEffects } from "../game/gameState/globalEffects"

export async function testIssue() {
    const whiteSpeed = ["179001_01A_CH_WT007R_white", "179004_01A_CH_WT009R_white", "179004_01A_CH_WT010C_white", "179007_02A_U_WT027U_white", "179007_02A_U_WT027U_white", "179008_02A_U_WT034U_white", "179008_02A_U_WT034U_white", "179008_02A_U_WT034U_white", "179014_03B_CH_WT027R_white", "179015_04B_U_WT067C_white", "179015_04B_U_WT067C_white", "179015_04B_U_WT067C_white", "179016_04B_U_WT074C_white", "179016_04B_U_WT074C_white", "179016_04B_U_WT074C_white", "179016_04B_U_WT075C_white", "179016_04B_U_WT075C_white", "179016_04B_U_WT075C_white", "179019_01A_C_WT010C_white", "179019_01A_C_WT010C_white", "179019_02A_U_WT028R_white", "179019_02A_U_WT028R_white", "179022_06C_CH_WT057R_white", "179022_06C_CH_WT057R_white", "179022_06C_CH_WT057R_white", "179022_06C_U_WT113R_white", "179022_06C_U_WT113R_white", "179022_06C_U_WT113R_white", "179023_06C_CH_WT067C_white", "179024_03B_U_WT057U_white", "179024_03B_U_WT057U_white", "179025_07D_C_WT060U_white", "179025_07D_CH_WT075C_white", "179025_07D_CH_WT075C_white", "179025_07D_CH_WT075C_white", "179027_09D_C_WT067R_white", "179027_09D_C_WT067R_white", "179029_B3C_CH_WT102R_white", "179029_B3C_CH_WT103N_white", "179029_B3C_U_WT196R_white", "179030_11E_C_WT077S_white", "179030_11E_C_WT077S_white", "179030_11E_C_WT077S_white", "179030_11E_CH_WT108N_white", "179901_00_C_WT003P_white", "179901_00_C_WT003P_white", "179901_00_C_WT003P_white", "179901_CG_C_WT001P_white", "179901_CG_C_WT001P_white", "179901_CG_CH_WT002P_white"]
    const blackT3 = ["179015_04B_O_BK010C_black", "179015_04B_O_BK010C_black", "179015_04B_U_BK058R_black", "179015_04B_U_BK058R_black", "179015_04B_U_BK059C_black", "179015_04B_U_BK059C_black", "179015_04B_U_BK061C_black", "179015_04B_U_BK061C_black", "179016_04B_U_BK066C_black", "179016_04B_U_BK066C_black", "179019_02A_C_BK015S_black", "179019_02A_C_BK015S_black", "179020_05C_U_BK100U_black", "179020_05C_U_BK100U_black", "179023_06C_C_BK048R_black", "179023_06C_C_BK048R_black", "179023_06C_C_BK049U_black", "179023_06C_C_BK049U_black", "179024_04B_C_BK027U_black", "179024_04B_C_BK027U_black", "179024_04B_U_BK060C_black", "179024_04B_U_BK060C_black", "179024_04B_U_BK067C_black", "179024_04B_U_BK067C_black", "179024_B2B_C_BK054C_black", "179024_B2B_C_BK054C_black", "179024_B2B_U_BK128S_black_02", "179024_B2B_U_BK128S_black_02", "179024_B2B_U_BK129R_black", "179024_B2B_U_BK129R_black", "179027_09D_C_BK063R_black", "179027_09D_C_BK063R_black", "179027_09D_O_BK010N_black", "179027_09D_O_BK010N_black", "179027_09D_U_BK163S_black", "179027_09D_U_BK163S_black", "179027_09D_U_BK163S_black", "179029_06C_C_BK045U_black", "179029_06C_C_BK045U_black", "179029_B3C_C_BK071N_black", "179029_B3C_C_BK071N_black", "179029_B3C_U_BK184N_black", "179029_B3C_U_BK184N_black", "179029_B3C_U_BK184N_black", "179029_B3C_U_BK185N_black", "179029_B3C_U_BK185N_black", "179030_11E_U_BK194S_2_black", "179030_11E_U_BK194S_2_black", "179030_11E_U_BK194S_2_black", "179901_B2B_C_BK005P_black"]
    await Promise.all([...blackT3, ...whiteSpeed].map(loadPrototype))
    let ctx = TMP_CTX
    let flows = queryFlow(ctx, PlayerA)
    let flow = flows[1] as Flow
    if(flow.id == "FlowSetActiveEffectID"){
        const effect = flow.tips.find(e=> e.reason[0]=="PlayCard" && getCard(ctx, e.reason[2]).protoID == "179022_06C_CH_WT057R_white")
        if(effect == null){
            throw new Error()
        }
        
        // 將不小心被橫的轉正
        ctx = mapCard(ctx, "PlayerA_101", card=>({...card, isRoll: false})) as GameStateWithFlowMemory
        if(getCardIdsCanPayRollCost(ctx, PlayerA, null).length != 4){
            throw new Error()
        }
        if(getCard(ctx, "PlayerA_101").isRoll != false){
            throw new Error()
        }
        console.log("確定是前台選到重復的G，兩一張G橫置2次就會出錯")
        const cardId = effect.reason[2]!
        console.log(ctx.itemStates[cardId])

        const cets = createEffectTips(ctx, effect, 0, 0)
        console.log(cets)
        console.log("使用setTipSelectionForUser重設支付就可以正確, 驗証了上面的想法")
        ctx = setTipSelectionForUser(ctx, effect, 0, 0) as GameStateWithFlowMemory
        ctx = doEffect(ctx, effect, 0, 0) as GameStateWithFlowMemory
    }
    //ctx = applyFlow(ctx, PlayerA, flow)

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
            "isFaceDown": true
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
            "isFaceDown": true
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
            "isFaceDown": true,
            "isRoll": false
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
            "isFaceDown": false,
            "isRoll": false
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
            "isFaceDown": true
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
            "isFaceDown": true,
            "isRoll": false
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
            "isFaceDown": true
        },
        "PlayerB_72": {
            "id": "PlayerB_72",
            "protoID": "179024_04B_U_BK067C_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
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
            "isFaceDown": false,
            "isRoll": false
        },
        "PlayerB_99": {
            "id": "PlayerB_99",
            "protoID": "179901_B2B_C_BK005P_black",
            "ownerID": "PlayerB",
            "isFaceDown": false,
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
        "createPlayCardEffects_PlayerA_37": {
            "id": "createPlayCardEffects_PlayerA_37",
            "reason": [
                "PlayCard",
                "PlayerA",
                "PlayerA_37"
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
                                "title": "function _(ctx3, effect, { DefineFn, GameStateFn, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn.EffectFn.getCardID(effect);\n                const prototype2 = GameStateFn.getItemPrototype(ctx3, cardId2);\n                const from = GameStateFn.getItemBaSyou(ctx3, cardId2);\n                ctx3 = GameStateFn.doItemMove(ctx3, DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u3044\\u308B\\u30AB\\u30FC\\u30C9\"), [cardId2, from]);\n                if (prototype2.category == \"\\u30E6\\u30CB\\u30C3\\u30C8\") {\n                  return GameStateFn.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn.EffectFn.getPlayerID(effect), DefineFn.EffectFn.getCardID(effect)],\n                    description: effect.text.description,\n                    text: {\n                      id: effect.text.id,\n                      description: effect.text.description,\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect2, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                                const cardId3 = DefineFn2.EffectFn.getCardID(effect2);\n                                const from2 = GameStateFn2.getItemBaSyou(ctx4, cardId3);\n                                const to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\");\n                                ctx4 = GameStateFn2.doItemMove(ctx4, to, [cardId3, from2]);\n                                const hasHigh = GameStateFn2.getCardHasSpeicalEffect(ctx4, [\"\\u6226\\u95D8\\u914D\\u5099\"], cardId3);\n                                const hasPS = GameStateFn2.getCardHasSpeicalEffect(ctx4, [\"PS\\u88C5\\u7532\"], cardId3);\n                                const isNoNeedRoll = hasHigh || hasPS;\n                                const isRoll = isNoNeedRoll == false;\n                                ctx4 = GameStateFn2.doItemSetRollState(ctx4, isRoll, [cardId3, GameStateFn2.getItemBaSyou(ctx4, cardId3)], { isSkipTargetMissing: true });\n                                ctx4 = GameStateFn2.doTriggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                                return ctx4;\n                              }.toString()\n                            }\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30AD\\u30E3\\u30E9\\u30AF\\u30BF\\u30FC\" || prototype2.category == \"\\u30AA\\u30DA\\u30EC\\u30FC\\u30B7\\u30E7\\u30F3(\\u30E6\\u30CB\\u30C3\\u30C8)\") {\n                  return GameStateFn.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn.EffectFn.getPlayerID(effect), DefineFn.EffectFn.getCardID(effect)],\n                    description: effect.text.description,\n                    text: {\n                      id: effect.text.id,\n                      description: effect.text.description,\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect2, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                                const cardId3 = DefineFn2.EffectFn.getCardID(effect2);\n                                const pairs = GameStateFn2.getCardTipStrBaSyouPairs(ctx4, \"\\u4E00\\u500B\\u81EA\\u8ECD\\u6A5F\\u9AD4\", cardId3);\n                                if (pairs.length == 0) {\n                                  throw new Error(`pairs must not 0: ${effect2.text.description}`);\n                                }\n                                const [targetCardId, targetBasyou] = pairs[0];\n                                const from2 = GameStateFn2.getItemBaSyou(ctx4, cardId3);\n                                const to = targetBasyou;\n                                ctx4 = GameStateFn2.doItemMove(ctx4, to, [cardId3, from2]);\n                                const isRoll = GameStateFn2.getCard(ctx4, targetCardId).isRoll || false;\n                                ctx4 = GameStateFn2.mapCard(ctx4, cardId3, (is) => ({ ...is, isRoll }));\n                                ctx4 = GameStateFn2.setSetGroupParent(ctx4, targetCardId, cardId3);\n                                ctx4 = GameStateFn2.doTriggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                                ctx4 = GameStateFn2.doTriggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u30BB\\u30C3\\u30C8\\u3055\\u308C\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                                return ctx4;\n                              }.toString()\n                            }\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30B3\\u30DE\\u30F3\\u30C9\") {\n                  return GameStateFn.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn.EffectFn.getPlayerID(effect), DefineFn.EffectFn.getCardID(effect)],\n                    description: effect.text.description,\n                    text: {\n                      id: prototype2.commandText?.id || `getPlayCardEffects_commentText_${cardId2}`,\n                      description: prototype2.commandText?.description || \"unknown\",\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect2, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                                const cardId3 = DefineFn2.EffectFn.getCardID(effect2);\n                                const from2 = GameStateFn2.getItemBaSyou(ctx4, cardId3);\n                                const to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u30B8\\u30E3\\u30F3\\u30AF\\u30E4\\u30FC\\u30C9\");\n                                ctx4 = GameStateFn2.doItemMove(ctx4, to, [cardId3, from2]);\n                                ctx4 = GameStateFn2.doTriggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                                return ctx4;\n                              }.toString()\n                            },\n                            ...prototype2.commandText?.logicTreeActions?.[0]?.actions || []\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30B0\\u30E9\\u30D5\\u30A3\\u30C3\\u30AF\") {\n                  const cardId3 = DefineFn.EffectFn.getCardID(effect);\n                  const from2 = GameStateFn.getItemBaSyou(ctx3, cardId3);\n                  const to = DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"G\\u30BE\\u30FC\\u30F3\");\n                  ctx3 = GameStateFn.doItemMove(ctx3, to, [cardId3, from2]);\n                  ctx3 = GameStateFn.doTriggerEvent(ctx3, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                  return ctx3;\n                }\n                if (prototype2.category == \"\\u30AA\\u30DA\\u30EC\\u30FC\\u30B7\\u30E7\\u30F3\") {\n                  const cardId3 = DefineFn.EffectFn.getCardID(effect);\n                  const from2 = GameStateFn.getItemBaSyou(ctx3, cardId3);\n                  const to = DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\");\n                  ctx3 = GameStateFn.doItemMove(ctx3, to, [cardId3, from2]);\n                  ctx3 = GameStateFn.doTriggerEvent(ctx3, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                  return ctx3;\n                }\n                if (prototype2.category == \"ACE\") {\n                  throw new Error(`not support category: ${prototype2.category}`);\n                }\n                return ctx3;\n              }"
                            }
                        ]
                    }
                ]
            }
        },
        "createPlayCardEffects_PlayerA_10": {
            "id": "createPlayCardEffects_PlayerA_10",
            "reason": [
                "PlayCard",
                "PlayerA",
                "PlayerA_10"
            ],
            "description": "Play",
            "text": {
                "id": "createPlayCardEffects_text_PlayerA_10",
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
                                    4
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
                                "title": "function _(ctx3, effect, { DefineFn, GameStateFn, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn.EffectFn.getCardID(effect);\n                const prototype2 = GameStateFn.getItemPrototype(ctx3, cardId2);\n                const from = GameStateFn.getItemBaSyou(ctx3, cardId2);\n                ctx3 = GameStateFn.doItemMove(ctx3, DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u3044\\u308B\\u30AB\\u30FC\\u30C9\"), [cardId2, from]);\n                if (prototype2.category == \"\\u30E6\\u30CB\\u30C3\\u30C8\") {\n                  return GameStateFn.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn.EffectFn.getPlayerID(effect), DefineFn.EffectFn.getCardID(effect)],\n                    description: effect.text.description,\n                    text: {\n                      id: effect.text.id,\n                      description: effect.text.description,\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect2, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                                const cardId3 = DefineFn2.EffectFn.getCardID(effect2);\n                                const from2 = GameStateFn2.getItemBaSyou(ctx4, cardId3);\n                                const to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\");\n                                ctx4 = GameStateFn2.doItemMove(ctx4, to, [cardId3, from2]);\n                                const hasHigh = GameStateFn2.getCardHasSpeicalEffect(ctx4, [\"\\u6226\\u95D8\\u914D\\u5099\"], cardId3);\n                                const hasPS = GameStateFn2.getCardHasSpeicalEffect(ctx4, [\"PS\\u88C5\\u7532\"], cardId3);\n                                const isNoNeedRoll = hasHigh || hasPS;\n                                const isRoll = isNoNeedRoll == false;\n                                ctx4 = GameStateFn2.doItemSetRollState(ctx4, isRoll, [cardId3, GameStateFn2.getItemBaSyou(ctx4, cardId3)], { isSkipTargetMissing: true });\n                                ctx4 = GameStateFn2.doTriggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                                return ctx4;\n                              }.toString()\n                            }\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30AD\\u30E3\\u30E9\\u30AF\\u30BF\\u30FC\" || prototype2.category == \"\\u30AA\\u30DA\\u30EC\\u30FC\\u30B7\\u30E7\\u30F3(\\u30E6\\u30CB\\u30C3\\u30C8)\") {\n                  return GameStateFn.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn.EffectFn.getPlayerID(effect), DefineFn.EffectFn.getCardID(effect)],\n                    description: effect.text.description,\n                    text: {\n                      id: effect.text.id,\n                      description: effect.text.description,\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect2, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                                const cardId3 = DefineFn2.EffectFn.getCardID(effect2);\n                                const pairs = GameStateFn2.getCardTipStrBaSyouPairs(ctx4, \"\\u4E00\\u500B\\u81EA\\u8ECD\\u6A5F\\u9AD4\", cardId3);\n                                if (pairs.length == 0) {\n                                  throw new Error(`pairs must not 0: ${effect2.text.description}`);\n                                }\n                                const [targetCardId, targetBasyou] = pairs[0];\n                                const from2 = GameStateFn2.getItemBaSyou(ctx4, cardId3);\n                                const to = targetBasyou;\n                                ctx4 = GameStateFn2.doItemMove(ctx4, to, [cardId3, from2]);\n                                const isRoll = GameStateFn2.getCard(ctx4, targetCardId).isRoll || false;\n                                ctx4 = GameStateFn2.mapCard(ctx4, cardId3, (is) => ({ ...is, isRoll }));\n                                ctx4 = GameStateFn2.setSetGroupParent(ctx4, targetCardId, cardId3);\n                                ctx4 = GameStateFn2.doTriggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                                ctx4 = GameStateFn2.doTriggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u30BB\\u30C3\\u30C8\\u3055\\u308C\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                                return ctx4;\n                              }.toString()\n                            }\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30B3\\u30DE\\u30F3\\u30C9\") {\n                  return GameStateFn.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn.EffectFn.getPlayerID(effect), DefineFn.EffectFn.getCardID(effect)],\n                    description: effect.text.description,\n                    text: {\n                      id: prototype2.commandText?.id || `getPlayCardEffects_commentText_${cardId2}`,\n                      description: prototype2.commandText?.description || \"unknown\",\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect2, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                                const cardId3 = DefineFn2.EffectFn.getCardID(effect2);\n                                const from2 = GameStateFn2.getItemBaSyou(ctx4, cardId3);\n                                const to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u30B8\\u30E3\\u30F3\\u30AF\\u30E4\\u30FC\\u30C9\");\n                                ctx4 = GameStateFn2.doItemMove(ctx4, to, [cardId3, from2]);\n                                ctx4 = GameStateFn2.doTriggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                                return ctx4;\n                              }.toString()\n                            },\n                            ...prototype2.commandText?.logicTreeActions?.[0]?.actions || []\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30B0\\u30E9\\u30D5\\u30A3\\u30C3\\u30AF\") {\n                  const cardId3 = DefineFn.EffectFn.getCardID(effect);\n                  const from2 = GameStateFn.getItemBaSyou(ctx3, cardId3);\n                  const to = DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"G\\u30BE\\u30FC\\u30F3\");\n                  ctx3 = GameStateFn.doItemMove(ctx3, to, [cardId3, from2]);\n                  ctx3 = GameStateFn.doTriggerEvent(ctx3, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                  return ctx3;\n                }\n                if (prototype2.category == \"\\u30AA\\u30DA\\u30EC\\u30FC\\u30B7\\u30E7\\u30F3\") {\n                  const cardId3 = DefineFn.EffectFn.getCardID(effect);\n                  const from2 = GameStateFn.getItemBaSyou(ctx3, cardId3);\n                  const to = DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\");\n                  ctx3 = GameStateFn.doItemMove(ctx3, to, [cardId3, from2]);\n                  ctx3 = GameStateFn.doTriggerEvent(ctx3, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                  return ctx3;\n                }\n                if (prototype2.category == \"ACE\") {\n                  throw new Error(`not support category: ${prototype2.category}`);\n                }\n                return ctx3;\n              }"
                            }
                        ]
                    }
                ]
            }
        },
        "createPlayCardEffects_PlayerA_24": {
            "id": "createPlayCardEffects_PlayerA_24",
            "reason": [
                "PlayCard",
                "PlayerA",
                "PlayerA_24"
            ],
            "description": "Play",
            "text": {
                "id": "createPlayCardEffects_text_PlayerA_24",
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
                                    4
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
                                },
                                {
                                    "type": "Leaf",
                                    "value": "1[白]"
                                }
                            ]
                        },
                        "actions": [
                            {
                                "title": "function _(ctx3, effect, { DefineFn, GameStateFn, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn.EffectFn.getCardID(effect);\n                const prototype2 = GameStateFn.getItemPrototype(ctx3, cardId2);\n                const from = GameStateFn.getItemBaSyou(ctx3, cardId2);\n                ctx3 = GameStateFn.doItemMove(ctx3, DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u3044\\u308B\\u30AB\\u30FC\\u30C9\"), [cardId2, from]);\n                if (prototype2.category == \"\\u30E6\\u30CB\\u30C3\\u30C8\") {\n                  return GameStateFn.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn.EffectFn.getPlayerID(effect), DefineFn.EffectFn.getCardID(effect)],\n                    description: effect.text.description,\n                    text: {\n                      id: effect.text.id,\n                      description: effect.text.description,\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect2, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                                const cardId3 = DefineFn2.EffectFn.getCardID(effect2);\n                                const from2 = GameStateFn2.getItemBaSyou(ctx4, cardId3);\n                                const to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\");\n                                ctx4 = GameStateFn2.doItemMove(ctx4, to, [cardId3, from2]);\n                                const hasHigh = GameStateFn2.getCardHasSpeicalEffect(ctx4, [\"\\u6226\\u95D8\\u914D\\u5099\"], cardId3);\n                                const hasPS = GameStateFn2.getCardHasSpeicalEffect(ctx4, [\"PS\\u88C5\\u7532\"], cardId3);\n                                const isNoNeedRoll = hasHigh || hasPS;\n                                const isRoll = isNoNeedRoll == false;\n                                ctx4 = GameStateFn2.doItemSetRollState(ctx4, isRoll, [cardId3, GameStateFn2.getItemBaSyou(ctx4, cardId3)], { isSkipTargetMissing: true });\n                                ctx4 = GameStateFn2.doTriggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                                return ctx4;\n                              }.toString()\n                            }\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30AD\\u30E3\\u30E9\\u30AF\\u30BF\\u30FC\" || prototype2.category == \"\\u30AA\\u30DA\\u30EC\\u30FC\\u30B7\\u30E7\\u30F3(\\u30E6\\u30CB\\u30C3\\u30C8)\") {\n                  return GameStateFn.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn.EffectFn.getPlayerID(effect), DefineFn.EffectFn.getCardID(effect)],\n                    description: effect.text.description,\n                    text: {\n                      id: effect.text.id,\n                      description: effect.text.description,\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect2, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                                const cardId3 = DefineFn2.EffectFn.getCardID(effect2);\n                                const pairs = GameStateFn2.getCardTipStrBaSyouPairs(ctx4, \"\\u4E00\\u500B\\u81EA\\u8ECD\\u6A5F\\u9AD4\", cardId3);\n                                if (pairs.length == 0) {\n                                  throw new Error(`pairs must not 0: ${effect2.text.description}`);\n                                }\n                                const [targetCardId, targetBasyou] = pairs[0];\n                                const from2 = GameStateFn2.getItemBaSyou(ctx4, cardId3);\n                                const to = targetBasyou;\n                                ctx4 = GameStateFn2.doItemMove(ctx4, to, [cardId3, from2]);\n                                const isRoll = GameStateFn2.getCard(ctx4, targetCardId).isRoll || false;\n                                ctx4 = GameStateFn2.mapCard(ctx4, cardId3, (is) => ({ ...is, isRoll }));\n                                ctx4 = GameStateFn2.setSetGroupParent(ctx4, targetCardId, cardId3);\n                                ctx4 = GameStateFn2.doTriggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                                ctx4 = GameStateFn2.doTriggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u30BB\\u30C3\\u30C8\\u3055\\u308C\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                                return ctx4;\n                              }.toString()\n                            }\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30B3\\u30DE\\u30F3\\u30C9\") {\n                  return GameStateFn.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn.EffectFn.getPlayerID(effect), DefineFn.EffectFn.getCardID(effect)],\n                    description: effect.text.description,\n                    text: {\n                      id: prototype2.commandText?.id || `getPlayCardEffects_commentText_${cardId2}`,\n                      description: prototype2.commandText?.description || \"unknown\",\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect2, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                                const cardId3 = DefineFn2.EffectFn.getCardID(effect2);\n                                const from2 = GameStateFn2.getItemBaSyou(ctx4, cardId3);\n                                const to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u30B8\\u30E3\\u30F3\\u30AF\\u30E4\\u30FC\\u30C9\");\n                                ctx4 = GameStateFn2.doItemMove(ctx4, to, [cardId3, from2]);\n                                ctx4 = GameStateFn2.doTriggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                                return ctx4;\n                              }.toString()\n                            },\n                            ...prototype2.commandText?.logicTreeActions?.[0]?.actions || []\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30B0\\u30E9\\u30D5\\u30A3\\u30C3\\u30AF\") {\n                  const cardId3 = DefineFn.EffectFn.getCardID(effect);\n                  const from2 = GameStateFn.getItemBaSyou(ctx3, cardId3);\n                  const to = DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"G\\u30BE\\u30FC\\u30F3\");\n                  ctx3 = GameStateFn.doItemMove(ctx3, to, [cardId3, from2]);\n                  ctx3 = GameStateFn.doTriggerEvent(ctx3, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                  return ctx3;\n                }\n                if (prototype2.category == \"\\u30AA\\u30DA\\u30EC\\u30FC\\u30B7\\u30E7\\u30F3\") {\n                  const cardId3 = DefineFn.EffectFn.getCardID(effect);\n                  const from2 = GameStateFn.getItemBaSyou(ctx3, cardId3);\n                  const to = DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\");\n                  ctx3 = GameStateFn.doItemMove(ctx3, to, [cardId3, from2]);\n                  ctx3 = GameStateFn.doTriggerEvent(ctx3, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                  return ctx3;\n                }\n                if (prototype2.category == \"ACE\") {\n                  throw new Error(`not support category: ${prototype2.category}`);\n                }\n                return ctx3;\n              }"
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
                "PlayerA_37"
            ],
            "description": "PlayG",
            "isPlayG": true,
            "text": {
                "id": "createPlayGEffects_text_PlayerA_37",
                "title": [],
                "description": "PlayG",
                "conditions": {
                    "出G上限": {
                        "actions": [
                            {
                                "title": "function _(ctx3, effect2, { DefineFn: DefineFn2, GameStateFn: GameStateFn2, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn2.EffectFn.getCardID(effect2);\n                const cardController = GameStateFn2.getItemController(ctx3, cardId2);\n                const ps = GameStateFn2.getPlayerState(ctx3, cardController);\n                if (ps.playGCount > 0) {\n                  throw new DefineFn2.TipError(`\\u51FAG\\u4E0A\\u9650: ${ps.playGCount}`, { isPlayGLimit: true });\n                }\n                ctx3 = GameStateFn2.mapPlayerState(ctx3, cardController, (ps2) => {\n                  return {\n                    ...ps2,\n                    playGCount: ps2.playGCount + 1\n                  };\n                });\n                return ctx3;\n              }"
                            }
                        ]
                    }
                },
                "logicTreeActions": [
                    {
                        "actions": [
                            {
                                "title": "function _(ctx3, effect2, { DefineFn: DefineFn2, GameStateFn: GameStateFn2, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn2.EffectFn.getCardID(effect2);\n                const from = GameStateFn2.getItemBaSyou(ctx3, cardId2);\n                ctx3 = GameStateFn2.doItemMove(ctx3, DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"G\\u30BE\\u30FC\\u30F3\"), [cardId2, from]);\n                return ctx3;\n              }"
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
        "createPlayGEffects_PlayerA_10": {
            "id": "createPlayGEffects_PlayerA_10",
            "reason": [
                "PlayCard",
                "PlayerA",
                "PlayerA_10"
            ],
            "description": "PlayG",
            "isPlayG": true,
            "text": {
                "id": "createPlayGEffects_text_PlayerA_10",
                "title": [],
                "description": "PlayG",
                "conditions": {
                    "出G上限": {
                        "actions": [
                            {
                                "title": "function _(ctx3, effect2, { DefineFn: DefineFn2, GameStateFn: GameStateFn2, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn2.EffectFn.getCardID(effect2);\n                const cardController = GameStateFn2.getItemController(ctx3, cardId2);\n                const ps = GameStateFn2.getPlayerState(ctx3, cardController);\n                if (ps.playGCount > 0) {\n                  throw new DefineFn2.TipError(`\\u51FAG\\u4E0A\\u9650: ${ps.playGCount}`, { isPlayGLimit: true });\n                }\n                ctx3 = GameStateFn2.mapPlayerState(ctx3, cardController, (ps2) => {\n                  return {\n                    ...ps2,\n                    playGCount: ps2.playGCount + 1\n                  };\n                });\n                return ctx3;\n              }"
                            }
                        ]
                    }
                },
                "logicTreeActions": [
                    {
                        "actions": [
                            {
                                "title": "function _(ctx3, effect2, { DefineFn: DefineFn2, GameStateFn: GameStateFn2, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn2.EffectFn.getCardID(effect2);\n                const from = GameStateFn2.getItemBaSyou(ctx3, cardId2);\n                ctx3 = GameStateFn2.doItemMove(ctx3, DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"G\\u30BE\\u30FC\\u30F3\"), [cardId2, from]);\n                return ctx3;\n              }"
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
        "createPlayGEffects_PlayerA_24": {
            "id": "createPlayGEffects_PlayerA_24",
            "reason": [
                "PlayCard",
                "PlayerA",
                "PlayerA_24"
            ],
            "description": "PlayG",
            "isPlayG": true,
            "text": {
                "id": "createPlayGEffects_text_PlayerA_24",
                "title": [],
                "description": "PlayG",
                "conditions": {
                    "出G上限": {
                        "actions": [
                            {
                                "title": "function _(ctx3, effect2, { DefineFn: DefineFn2, GameStateFn: GameStateFn2, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn2.EffectFn.getCardID(effect2);\n                const cardController = GameStateFn2.getItemController(ctx3, cardId2);\n                const ps = GameStateFn2.getPlayerState(ctx3, cardController);\n                if (ps.playGCount > 0) {\n                  throw new DefineFn2.TipError(`\\u51FAG\\u4E0A\\u9650: ${ps.playGCount}`, { isPlayGLimit: true });\n                }\n                ctx3 = GameStateFn2.mapPlayerState(ctx3, cardController, (ps2) => {\n                  return {\n                    ...ps2,\n                    playGCount: ps2.playGCount + 1\n                  };\n                });\n                return ctx3;\n              }"
                            }
                        ]
                    }
                },
                "logicTreeActions": [
                    {
                        "actions": [
                            {
                                "title": "function _(ctx3, effect2, { DefineFn: DefineFn2, GameStateFn: GameStateFn2, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn2.EffectFn.getCardID(effect2);\n                const from = GameStateFn2.getItemBaSyou(ctx3, cardId2);\n                ctx3 = GameStateFn2.doItemMove(ctx3, DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"G\\u30BE\\u30FC\\u30F3\"), [cardId2, from]);\n                return ctx3;\n              }"
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
                "PlayerA_40",
                "PlayerA_48",
                "PlayerA_11",
                "PlayerA_9",
                "PlayerA_1",
                "PlayerA_15",
                "PlayerA_33",
                "PlayerA_27",
                "PlayerA_46",
                "PlayerA_19",
                "PlayerA_5",
                "PlayerA_0",
                "PlayerA_36",
                "PlayerA_44",
                "PlayerA_7",
                "PlayerA_17",
                "PlayerA_2",
                "PlayerA_14",
                "PlayerA_3",
                "PlayerA_6",
                "PlayerA_8",
                "PlayerA_42",
                "PlayerA_47",
                "PlayerA_38",
                "PlayerA_39",
                "PlayerA_43",
                "PlayerA_28",
                "PlayerA_30",
                "PlayerA_12",
                "PlayerA_29",
                "PlayerA_4",
                "PlayerA_34",
                "PlayerA_31",
                "PlayerA_20",
                "PlayerA_25",
                "PlayerA_21",
                "PlayerA_18",
                "PlayerA_16",
                "PlayerA_13",
                "PlayerA_26",
                "PlayerA_22",
                "PlayerA_41"
            ],
            "[\"PlayerB\",\"本国\"]": [
                "PlayerB_78",
                "PlayerB_62",
                "PlayerB_61",
                "PlayerB_90",
                "PlayerB_95",
                "PlayerB_88",
                "PlayerB_91",
                "PlayerB_75",
                "PlayerB_71",
                "PlayerB_53",
                "PlayerB_74",
                "PlayerB_65",
                "PlayerB_64",
                "PlayerB_54",
                "PlayerB_76",
                "PlayerB_81",
                "PlayerB_52",
                "PlayerB_77",
                "PlayerB_70",
                "PlayerB_83",
                "PlayerB_60",
                "PlayerB_85",
                "PlayerB_63",
                "PlayerB_82",
                "PlayerB_79",
                "PlayerB_66",
                "PlayerB_94",
                "PlayerB_84",
                "PlayerB_58",
                "PlayerB_57",
                "PlayerB_68",
                "PlayerB_89",
                "PlayerB_86",
                "PlayerB_93",
                "PlayerB_56",
                "PlayerB_80",
                "PlayerB_72",
                "PlayerB_69",
                "PlayerB_92",
                "PlayerB_51"
            ],
            "[\"PlayerA\",\"Gゾーン\"]": [
                "PlayerA_100",
                "PlayerA_101",
                "PlayerA_102",
                "PlayerA_45"
            ],
            "[\"PlayerA\",\"配備エリア\"]": [
                "PlayerA_49",
                "PlayerA_32",
                "PlayerA_103"
            ],
            "[\"PlayerB\",\"Gゾーン\"]": [
                "PlayerB_104",
                "PlayerB_105",
                "PlayerB_106"
            ],
            "[\"PlayerB\",\"配備エリア\"]": [],
            "[\"PlayerA\",\"手札\"]": [
                "PlayerA_37",
                "PlayerA_10",
                "PlayerA_24"
            ],
            "[\"PlayerB\",\"手札\"]": [
                "PlayerB_87",
                "PlayerB_50",
                "PlayerB_67",
                "PlayerB_73",
                "PlayerB_96"
            ],
            "[\"PlayerA\",\"プレイされているカード\"]": [],
            "[\"PlayerA\",\"ジャンクヤード\"]": [
                "PlayerA_35",
                "PlayerA_23"
            ],
            "[\"PlayerB\",\"ジャンクヤード\"]": [
                "PlayerB_107",
                "PlayerB_99",
                "PlayerB_98"
            ],
            "[\"PlayerA\",\"戦闘エリア2\"]": [],
            "[\"PlayerB\",\"捨て山\"]": [
                "PlayerB_55",
                "PlayerB_59",
                "PlayerB_97"
            ],
            "[\"PlayerB\",\"プレイされているカード\"]": []
        }
    },
    "chips": {},
    "chipProtos": {},
    "itemStates": {
        "PlayerA_35": {
            "id": "PlayerA_35",
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
                "任意の枚数の敵軍ユニット": {
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
                    "isRepeat": true,
                    "count": 3
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
                            ]
                        ]
                    ]
                },
                "自軍キャラ１枚": {
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
                            ],
                            [
                                "PlayerA_32",
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
                                "PlayerA_32",
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
        "PlayerA_45": {
            "id": "PlayerA_45",
            "damage": 0,
            "destroyReason": null,
            "flags": {},
            "tips": {
                "敵軍ユニット１枚": {
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
        "PlayerA_32": {
            "id": "PlayerA_32",
            "damage": 0,
            "destroyReason": null,
            "flags": {},
            "tips": {
                "0[白]": {
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
        "PlayerB_99": {
            "id": "PlayerB_99",
            "damage": 0,
            "destroyReason": null,
            "flags": {},
            "tips": {
                "黒X": {
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
                "全ての軍は、自分の手札X枚を可能な限り選ん1": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerB_98",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "手札"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_87",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "手札"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_50",
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
                                "PlayerB_73",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "手札"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_96",
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
                                "PlayerB_98",
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
                    "max": 1,
                    "min": 1
                },
                "全ての軍は、自分の手札X枚を可能な限り選ん2": {
                    "title": [
                        "カード",
                        [
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
                                "PlayerA_10",
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
                    "max": 1,
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
                }
            },
            "globalEffects": {},
            "varNamesRemoveOnTurnEnd": {}
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
        "createPlayCardEffects_PlayerA_10",
        "createPlayCardEffects_PlayerA_24",
        "createPlayGEffects_PlayerA_37",
        "createPlayGEffects_PlayerA_10",
        "createPlayGEffects_PlayerA_24"
    ],
    "commandEffectTips": [
        {
            "effectId": "createPlayCardEffects_PlayerA_37",
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
                    "errors": []
                }
            ]
        },
        {
            "effectId": "createPlayCardEffects_PlayerA_10",
            "logicID": 0,
            "logicSubID": 0,
            "tipOrErrors": [
                {
                    "effectId": "createPlayCardEffects_PlayerA_10",
                    "conditionKey": "合計国力〔x〕",
                    "tip": null,
                    "errors": []
                },
                {
                    "effectId": "createPlayCardEffects_PlayerA_10",
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
                    "errors": []
                },
                {
                    "effectId": "createPlayCardEffects_PlayerA_10",
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
                    "errors": []
                }
            ]
        },
        {
            "effectId": "createPlayCardEffects_PlayerA_24",
            "logicID": 0,
            "logicSubID": 0,
            "tipOrErrors": [
                {
                    "effectId": "createPlayCardEffects_PlayerA_24",
                    "conditionKey": "合計国力〔x〕",
                    "tip": null,
                    "errors": []
                },
                {
                    "effectId": "createPlayCardEffects_PlayerA_24",
                    "conditionKey": "一個自軍機體",
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
                    "effectId": "createPlayCardEffects_PlayerA_24",
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
                    "errors": []
                },
                {
                    "effectId": "createPlayCardEffects_PlayerA_24",
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
                    "errors": []
                }
            ]
        },
        {
            "effectId": "createPlayGEffects_PlayerA_37",
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
            "effectId": "createPlayGEffects_PlayerA_10",
            "logicID": 0,
            "logicSubID": 0,
            "tipOrErrors": [
                {
                    "effectId": "createPlayGEffects_PlayerA_10",
                    "conditionKey": "出G上限",
                    "tip": null,
                    "errors": []
                }
            ]
        },
        {
            "effectId": "createPlayGEffects_PlayerA_24",
            "logicID": 0,
            "logicSubID": 0,
            "tipOrErrors": [
                {
                    "effectId": "createPlayGEffects_PlayerA_24",
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