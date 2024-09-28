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
    const blackT3 = ["179015_04B_O_BK010C_black", "179015_04B_O_BK010C_black", "179015_04B_U_BK058R_black", "179015_04B_U_BK058R_black", "179015_04B_U_BK059C_black", "179015_04B_U_BK059C_black", "179015_04B_U_BK061C_black", "179015_04B_U_BK061C_black", "179016_04B_U_BK066C_black", "179016_04B_U_BK066C_black", "179019_02A_C_BK015S_black", "179019_02A_C_BK015S_black", "179020_05C_U_BK100U_black", "179020_05C_U_BK100U_black", "179023_06C_C_BK048R_black", "179023_06C_C_BK048R_black", "179023_06C_C_BK049U_black", "179023_06C_C_BK049U_black", "179024_04B_C_BK027U_black", "179024_04B_C_BK027U_black", "179024_04B_U_BK060C_black", "179024_04B_U_BK060C_black", "179024_04B_U_BK067C_black", "179024_04B_U_BK067C_black", "179024_B2B_C_BK054C_black", "179024_B2B_C_BK054C_black", "179024_B2B_U_BK128S_black_02", "179024_B2B_U_BK128S_black_02", "179024_B2B_U_BK129R_black", "179024_B2B_U_BK129R_black", "179027_09D_C_BK063R_black", "179027_09D_C_BK063R_black", "179027_09D_O_BK010N_black", "179027_09D_O_BK010N_black", "179027_09D_U_BK163S_black", "179027_09D_U_BK163S_black", "179027_09D_U_BK163S_black", "179029_06C_C_BK045U_black", "179029_06C_C_BK045U_black", "179029_B3C_C_BK071N_black", "179029_B3C_C_BK071N_black", "179029_B3C_U_BK184N_black", "179029_B3C_U_BK184N_black", "179029_B3C_U_BK184N_black", "179029_B3C_U_BK185N_black", "179029_B3C_U_BK185N_black", "179030_11E_U_BK194S_2_black", "179030_11E_U_BK194S_2_black", "179030_11E_U_BK194S_2_black", "179901_B2B_C_BK005P_black"]
    await Promise.all(blackT3.map(loadPrototype))
    let ctx = TMP_CTX
    for (let i = 0; i < 1000; ++i) {
        console.log(`${i} > ${getPhase(ctx)} > ${getActivePlayerID(ctx)}`)
        console.log(`${i} > PlayerA: ${getItemIdsByBasyou(ctx, AbsoluteBaSyouFn.of(PlayerA, "本国")).length}`)
        console.log(`${i} > PlayerB: ${getItemIdsByBasyou(ctx, AbsoluteBaSyouFn.of(PlayerB, "本国")).length}`)
        console.log(`${i} > turn: ${ctx.turn}`)
        const playerId = PlayerIDFn.getAll()[Math.round(Math.random() * 1000) % 2]
        {
            const clickTime = Math.round(Math.random() * 1000) % 5
            for (let t = 0; t < clickTime; ++t) {
                const flows = queryFlow(ctx, playerId)
                if (flows.length) {
                    try {
                        let flow: Flow | null = null
                        // const aiChoiseList = flows.flatMap(flow => createAIChoiseList(ctx, flow))
                        // if (aiChoiseList.length > 0) {
                        //     aiChoiseList.sort((a, b) => b.weight - a.weight)
                        //     flow = aiChoiseList[0].flow
                        //     console.log(`applyFlow: ${flow.id}`)
                        //     ctx = applyFlow(ctx, playerId, flow)
                        //     TableFns.assertDup(ctx.table)
                        // }
                        if (flow == null) {
                            flow = flows[Math.round(Math.random()*1000)%flows.length]
                        }
                        console.log(`applyFlow: ${flow.id}`)
                        ctx = applyFlow(ctx, playerId, flow)
                        TableFns.assertDup(ctx.table)
                    } catch (e) {
                        if (e instanceof TargetMissingError) {
                            console.log(e.message)
                        } else {
                            throw e
                        }
                    }
                }
            }
        }
    }
    throw new Error()
}

const TMP_CTX: GameStateWithFlowMemory = {
    "isGameState": true,
    "cards": {
        "PlayerA_0": {
            "id": "PlayerA_0",
            "protoID": "179015_04B_O_BK010C_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_1": {
            "id": "PlayerA_1",
            "protoID": "179015_04B_O_BK010C_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_2": {
            "id": "PlayerA_2",
            "protoID": "179015_04B_U_BK058R_black",
            "ownerID": "PlayerA",
            "isFaceDown": false,
            "isRoll": true
        },
        "PlayerA_3": {
            "id": "PlayerA_3",
            "protoID": "179015_04B_U_BK058R_black",
            "ownerID": "PlayerA",
            "isFaceDown": false,
            "isRoll": true
        },
        "PlayerA_4": {
            "id": "PlayerA_4",
            "protoID": "179015_04B_U_BK059C_black",
            "ownerID": "PlayerA",
            "isFaceDown": false,
            "isRoll": false
        },
        "PlayerA_5": {
            "id": "PlayerA_5",
            "protoID": "179015_04B_U_BK059C_black",
            "ownerID": "PlayerA",
            "isFaceDown": false,
            "isRoll": false
        },
        "PlayerA_6": {
            "id": "PlayerA_6",
            "protoID": "179015_04B_U_BK061C_black",
            "ownerID": "PlayerA",
            "isFaceDown": false,
            "isRoll": true
        },
        "PlayerA_7": {
            "id": "PlayerA_7",
            "protoID": "179015_04B_U_BK061C_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_8": {
            "id": "PlayerA_8",
            "protoID": "179016_04B_U_BK066C_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_9": {
            "id": "PlayerA_9",
            "protoID": "179016_04B_U_BK066C_black",
            "ownerID": "PlayerA",
            "isFaceDown": false,
            "isRoll": true
        },
        "PlayerA_10": {
            "id": "PlayerA_10",
            "protoID": "179019_02A_C_BK015S_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_11": {
            "id": "PlayerA_11",
            "protoID": "179019_02A_C_BK015S_black",
            "ownerID": "PlayerA",
            "isFaceDown": false,
            "isRoll": false
        },
        "PlayerA_12": {
            "id": "PlayerA_12",
            "protoID": "179020_05C_U_BK100U_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_13": {
            "id": "PlayerA_13",
            "protoID": "179020_05C_U_BK100U_black",
            "ownerID": "PlayerA",
            "isFaceDown": true,
            "isRoll": false
        },
        "PlayerA_14": {
            "id": "PlayerA_14",
            "protoID": "179023_06C_C_BK048R_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_15": {
            "id": "PlayerA_15",
            "protoID": "179023_06C_C_BK048R_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_16": {
            "id": "PlayerA_16",
            "protoID": "179023_06C_C_BK049U_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_17": {
            "id": "PlayerA_17",
            "protoID": "179023_06C_C_BK049U_black",
            "ownerID": "PlayerA",
            "isFaceDown": true,
            "isRoll": false
        },
        "PlayerA_18": {
            "id": "PlayerA_18",
            "protoID": "179024_04B_C_BK027U_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_19": {
            "id": "PlayerA_19",
            "protoID": "179024_04B_C_BK027U_black",
            "ownerID": "PlayerA",
            "isFaceDown": false,
            "isRoll": false
        },
        "PlayerA_20": {
            "id": "PlayerA_20",
            "protoID": "179024_04B_U_BK060C_black",
            "ownerID": "PlayerA",
            "isFaceDown": false,
            "isRoll": true
        },
        "PlayerA_21": {
            "id": "PlayerA_21",
            "protoID": "179024_04B_U_BK060C_black",
            "ownerID": "PlayerA",
            "isFaceDown": false,
            "isRoll": true
        },
        "PlayerA_22": {
            "id": "PlayerA_22",
            "protoID": "179024_04B_U_BK067C_black",
            "ownerID": "PlayerA",
            "isFaceDown": false,
            "isRoll": true
        },
        "PlayerA_23": {
            "id": "PlayerA_23",
            "protoID": "179024_04B_U_BK067C_black",
            "ownerID": "PlayerA",
            "isFaceDown": true,
            "isRoll": false
        },
        "PlayerA_24": {
            "id": "PlayerA_24",
            "protoID": "179024_B2B_C_BK054C_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_25": {
            "id": "PlayerA_25",
            "protoID": "179024_B2B_C_BK054C_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_26": {
            "id": "PlayerA_26",
            "protoID": "179024_B2B_U_BK128S_black_02",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_27": {
            "id": "PlayerA_27",
            "protoID": "179024_B2B_U_BK128S_black_02",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_28": {
            "id": "PlayerA_28",
            "protoID": "179024_B2B_U_BK129R_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_29": {
            "id": "PlayerA_29",
            "protoID": "179024_B2B_U_BK129R_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_30": {
            "id": "PlayerA_30",
            "protoID": "179027_09D_C_BK063R_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_31": {
            "id": "PlayerA_31",
            "protoID": "179027_09D_C_BK063R_black",
            "ownerID": "PlayerA",
            "isFaceDown": true,
            "isRoll": false
        },
        "PlayerA_32": {
            "id": "PlayerA_32",
            "protoID": "179027_09D_O_BK010N_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_33": {
            "id": "PlayerA_33",
            "protoID": "179027_09D_O_BK010N_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_34": {
            "id": "PlayerA_34",
            "protoID": "179027_09D_U_BK163S_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_35": {
            "id": "PlayerA_35",
            "protoID": "179027_09D_U_BK163S_black",
            "ownerID": "PlayerA",
            "isFaceDown": false,
            "isRoll": false
        },
        "PlayerA_36": {
            "id": "PlayerA_36",
            "protoID": "179027_09D_U_BK163S_black",
            "ownerID": "PlayerA",
            "isFaceDown": false,
            "isRoll": false
        },
        "PlayerA_37": {
            "id": "PlayerA_37",
            "protoID": "179029_06C_C_BK045U_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_38": {
            "id": "PlayerA_38",
            "protoID": "179029_06C_C_BK045U_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_39": {
            "id": "PlayerA_39",
            "protoID": "179029_B3C_C_BK071N_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_40": {
            "id": "PlayerA_40",
            "protoID": "179029_B3C_C_BK071N_black",
            "ownerID": "PlayerA",
            "isFaceDown": true,
            "isRoll": false
        },
        "PlayerA_41": {
            "id": "PlayerA_41",
            "protoID": "179029_B3C_U_BK184N_black",
            "ownerID": "PlayerA",
            "isFaceDown": true,
            "isRoll": false
        },
        "PlayerA_42": {
            "id": "PlayerA_42",
            "protoID": "179029_B3C_U_BK184N_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_43": {
            "id": "PlayerA_43",
            "protoID": "179029_B3C_U_BK184N_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_44": {
            "id": "PlayerA_44",
            "protoID": "179029_B3C_U_BK185N_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_45": {
            "id": "PlayerA_45",
            "protoID": "179029_B3C_U_BK185N_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_46": {
            "id": "PlayerA_46",
            "protoID": "179030_11E_U_BK194S_2_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_47": {
            "id": "PlayerA_47",
            "protoID": "179030_11E_U_BK194S_2_black",
            "ownerID": "PlayerA",
            "isFaceDown": false,
            "isRoll": true
        },
        "PlayerA_48": {
            "id": "PlayerA_48",
            "protoID": "179030_11E_U_BK194S_2_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "PlayerA_49": {
            "id": "PlayerA_49",
            "protoID": "179901_B2B_C_BK005P_black",
            "ownerID": "PlayerA",
            "isFaceDown": true,
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
            "isFaceDown": false,
            "isRoll": true
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
            "isFaceDown": false,
            "isRoll": true
        },
        "PlayerB_56": {
            "id": "PlayerB_56",
            "protoID": "179015_04B_U_BK061C_black",
            "ownerID": "PlayerB",
            "isFaceDown": false,
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
            "isFaceDown": true,
            "isRoll": false
        },
        "PlayerB_61": {
            "id": "PlayerB_61",
            "protoID": "179019_02A_C_BK015S_black",
            "ownerID": "PlayerB",
            "isFaceDown": false,
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
            "isFaceDown": true,
            "isRoll": false
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
            "isFaceDown": true,
            "isRoll": false
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
            "isFaceDown": true
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
            "isFaceDown": false,
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
            "isFaceDown": false,
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
            "isFaceDown": true,
            "isRoll": false
        },
        "PlayerB_77": {
            "id": "PlayerB_77",
            "protoID": "179024_B2B_U_BK128S_black_02",
            "ownerID": "PlayerB",
            "isFaceDown": true,
            "isRoll": false
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
            "isFaceDown": true,
            "isRoll": false
        },
        "PlayerB_83": {
            "id": "PlayerB_83",
            "protoID": "179027_09D_O_BK010N_black",
            "ownerID": "PlayerB",
            "isFaceDown": false,
            "isRoll": false
        },
        "PlayerB_84": {
            "id": "PlayerB_84",
            "protoID": "179027_09D_U_BK163S_black",
            "ownerID": "PlayerB",
            "isFaceDown": false,
            "isRoll": true
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
            "isFaceDown": false,
            "isRoll": true
        },
        "PlayerB_87": {
            "id": "PlayerB_87",
            "protoID": "179029_06C_C_BK045U_black",
            "ownerID": "PlayerB",
            "isFaceDown": false,
            "isRoll": false
        },
        "PlayerB_88": {
            "id": "PlayerB_88",
            "protoID": "179029_06C_C_BK045U_black",
            "ownerID": "PlayerB",
            "isFaceDown": false,
            "isRoll": true
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
            "isFaceDown": false,
            "isRoll": false
        },
        "PlayerB_99": {
            "id": "PlayerB_99",
            "protoID": "179901_B2B_C_BK005P_black",
            "ownerID": "PlayerB",
            "isFaceDown": false,
            "isRoll": false
        }
    },
    "effects": {
        "createPlayCardEffects_PlayerB_61": {
            "id": "createPlayCardEffects_PlayerB_61",
            "reason": [
                "PlayCard",
                "PlayerB",
                "PlayerB_61"
            ],
            "description": "從手中即將出牌, 出牌後會產生場出的效果",
            "text": {
                "id": "createPlayCardEffects_text_PlayerB_61",
                "title": [],
                "description": "從手中即將出牌, 出牌後會產生場出的效果",
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
                                }
                            ]
                        },
                        "actions": [
                            {
                                "title": "function _(ctx3, effect, { DefineFn, GameStateFn, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn.EffectFn.getCardID(effect);\n                const prototype2 = GameStateFn.getItemPrototype(ctx3, cardId2);\n                const from = GameStateFn.getItemBaSyou(ctx3, cardId2);\n                ctx3 = GameStateFn.doItemMove(ctx3, DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u3044\\u308B\\u30AB\\u30FC\\u30C9\"), [cardId2, from]);\n                if (prototype2.category == \"\\u30E6\\u30CB\\u30C3\\u30C8\") {\n                  return GameStateFn.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn.EffectFn.getPlayerID(effect), DefineFn.EffectFn.getCardID(effect)],\n                    description: effect.text.description,\n                    text: {\n                      id: effect.text.id,\n                      description: effect.text.description,\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect2, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                                const cardId3 = DefineFn2.EffectFn.getCardID(effect2);\n                                const from2 = GameStateFn2.getItemBaSyou(ctx4, cardId3);\n                                const to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\");\n                                ctx4 = GameStateFn2.doItemMove(ctx4, to, [cardId3, from2]);\n                                const hasHigh = GameStateFn2.getCardHasSpeicalEffect(ctx4, [\"\\u6226\\u95D8\\u914D\\u5099\"], cardId3);\n                                const hasPS = GameStateFn2.getCardHasSpeicalEffect(ctx4, [\"PS\\u88C5\\u7532\"], cardId3);\n                                const isNoNeedRoll = hasHigh || hasPS;\n                                const isRoll = isNoNeedRoll == false;\n                                ctx4 = GameStateFn2.doItemSetRollState(ctx4, isRoll, [cardId3, from2], { isSkipTargetMissing: true });\n                                ctx4 = GameStateFn2.doTriggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                                return ctx4;\n                              }.toString()\n                            }\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30AD\\u30E3\\u30E9\\u30AF\\u30BF\\u30FC\" || prototype2.category == \"\\u30AA\\u30DA\\u30EC\\u30FC\\u30B7\\u30E7\\u30F3(\\u30E6\\u30CB\\u30C3\\u30C8)\") {\n                  return GameStateFn.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn.EffectFn.getPlayerID(effect), DefineFn.EffectFn.getCardID(effect)],\n                    description: effect.text.description,\n                    text: {\n                      id: effect.text.id,\n                      description: effect.text.description,\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect2, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                                const cardId3 = DefineFn2.EffectFn.getCardID(effect2);\n                                const pairs = GameStateFn2.getCardTipStrBaSyouPairs(ctx4, \"\\u4E00\\u500B\\u81EA\\u8ECD\\u6A5F\\u9AD4\", cardId3);\n                                if (pairs.length == 0) {\n                                  throw new Error(`pairs must not 0: ${effect2.text.description}`);\n                                }\n                                const [targetCardId, targetBasyou] = pairs[0];\n                                const from2 = GameStateFn2.getItemBaSyou(ctx4, cardId3);\n                                const to = targetBasyou;\n                                ctx4 = GameStateFn2.doItemMove(ctx4, to, [cardId3, from2]);\n                                ctx4 = GameStateFn2.setSetGroupParent(ctx4, targetCardId, cardId3);\n                                ctx4 = GameStateFn2.doTriggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                                ctx4 = GameStateFn2.doTriggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u30BB\\u30C3\\u30C8\\u3055\\u308C\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                                return ctx4;\n                              }.toString()\n                            }\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30B3\\u30DE\\u30F3\\u30C9\") {\n                  return GameStateFn.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn.EffectFn.getPlayerID(effect), DefineFn.EffectFn.getCardID(effect)],\n                    description: effect.text.description,\n                    text: {\n                      id: prototype2.commandText?.id || `getPlayCardEffects_commentText_${cardId2}`,\n                      description: prototype2.commandText?.description || \"unknown\",\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect2, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                                const cardId3 = DefineFn2.EffectFn.getCardID(effect2);\n                                const from2 = GameStateFn2.getItemBaSyou(ctx4, cardId3);\n                                const to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u30B8\\u30E3\\u30F3\\u30AF\\u30E4\\u30FC\\u30C9\");\n                                ctx4 = GameStateFn2.doItemMove(ctx4, to, [cardId3, from2]);\n                                ctx4 = GameStateFn2.doTriggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                                return ctx4;\n                              }.toString()\n                            },\n                            ...prototype2.commandText?.logicTreeActions?.[0]?.actions || []\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30B0\\u30E9\\u30D5\\u30A3\\u30C3\\u30AF\") {\n                  const cardId3 = DefineFn.EffectFn.getCardID(effect);\n                  const from2 = GameStateFn.getItemBaSyou(ctx3, cardId3);\n                  const to = DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"G\\u30BE\\u30FC\\u30F3\");\n                  ctx3 = GameStateFn.doItemMove(ctx3, to, [cardId3, from2]);\n                  ctx3 = GameStateFn.doTriggerEvent(ctx3, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                  return ctx3;\n                }\n                if (prototype2.category == \"\\u30AA\\u30DA\\u30EC\\u30FC\\u30B7\\u30E7\\u30F3\") {\n                  const cardId3 = DefineFn.EffectFn.getCardID(effect);\n                  const from2 = GameStateFn.getItemBaSyou(ctx3, cardId3);\n                  const to = DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\");\n                  ctx3 = GameStateFn.doItemMove(ctx3, to, [cardId3, from2]);\n                  ctx3 = GameStateFn.doTriggerEvent(ctx3, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                  return ctx3;\n                }\n                if (prototype2.category == \"ACE\") {\n                  throw new Error(`not support category: ${prototype2.category}`);\n                }\n                return ctx3;\n              }"
                            }
                        ]
                    }
                ]
            }
        },
        "createPlayCardEffects_PlayerB_87": {
            "id": "createPlayCardEffects_PlayerB_87",
            "reason": [
                "PlayCard",
                "PlayerB",
                "PlayerB_87"
            ],
            "description": "從手中即將出牌, 出牌後會產生場出的效果",
            "text": {
                "id": "createPlayCardEffects_text_PlayerB_87",
                "title": [],
                "description": "從手中即將出牌, 出牌後會產生場出的效果",
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
                                "title": "function _(ctx3, effect, { DefineFn, GameStateFn, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn.EffectFn.getCardID(effect);\n                const prototype2 = GameStateFn.getItemPrototype(ctx3, cardId2);\n                const from = GameStateFn.getItemBaSyou(ctx3, cardId2);\n                ctx3 = GameStateFn.doItemMove(ctx3, DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u3044\\u308B\\u30AB\\u30FC\\u30C9\"), [cardId2, from]);\n                if (prototype2.category == \"\\u30E6\\u30CB\\u30C3\\u30C8\") {\n                  return GameStateFn.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn.EffectFn.getPlayerID(effect), DefineFn.EffectFn.getCardID(effect)],\n                    description: effect.text.description,\n                    text: {\n                      id: effect.text.id,\n                      description: effect.text.description,\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect2, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                                const cardId3 = DefineFn2.EffectFn.getCardID(effect2);\n                                const from2 = GameStateFn2.getItemBaSyou(ctx4, cardId3);\n                                const to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\");\n                                ctx4 = GameStateFn2.doItemMove(ctx4, to, [cardId3, from2]);\n                                const hasHigh = GameStateFn2.getCardHasSpeicalEffect(ctx4, [\"\\u6226\\u95D8\\u914D\\u5099\"], cardId3);\n                                const hasPS = GameStateFn2.getCardHasSpeicalEffect(ctx4, [\"PS\\u88C5\\u7532\"], cardId3);\n                                const isNoNeedRoll = hasHigh || hasPS;\n                                const isRoll = isNoNeedRoll == false;\n                                ctx4 = GameStateFn2.doItemSetRollState(ctx4, isRoll, [cardId3, from2], { isSkipTargetMissing: true });\n                                ctx4 = GameStateFn2.doTriggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                                return ctx4;\n                              }.toString()\n                            }\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30AD\\u30E3\\u30E9\\u30AF\\u30BF\\u30FC\" || prototype2.category == \"\\u30AA\\u30DA\\u30EC\\u30FC\\u30B7\\u30E7\\u30F3(\\u30E6\\u30CB\\u30C3\\u30C8)\") {\n                  return GameStateFn.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn.EffectFn.getPlayerID(effect), DefineFn.EffectFn.getCardID(effect)],\n                    description: effect.text.description,\n                    text: {\n                      id: effect.text.id,\n                      description: effect.text.description,\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect2, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                                const cardId3 = DefineFn2.EffectFn.getCardID(effect2);\n                                const pairs = GameStateFn2.getCardTipStrBaSyouPairs(ctx4, \"\\u4E00\\u500B\\u81EA\\u8ECD\\u6A5F\\u9AD4\", cardId3);\n                                if (pairs.length == 0) {\n                                  throw new Error(`pairs must not 0: ${effect2.text.description}`);\n                                }\n                                const [targetCardId, targetBasyou] = pairs[0];\n                                const from2 = GameStateFn2.getItemBaSyou(ctx4, cardId3);\n                                const to = targetBasyou;\n                                ctx4 = GameStateFn2.doItemMove(ctx4, to, [cardId3, from2]);\n                                ctx4 = GameStateFn2.setSetGroupParent(ctx4, targetCardId, cardId3);\n                                ctx4 = GameStateFn2.doTriggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                                ctx4 = GameStateFn2.doTriggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u30BB\\u30C3\\u30C8\\u3055\\u308C\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                                return ctx4;\n                              }.toString()\n                            }\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30B3\\u30DE\\u30F3\\u30C9\") {\n                  return GameStateFn.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn.EffectFn.getPlayerID(effect), DefineFn.EffectFn.getCardID(effect)],\n                    description: effect.text.description,\n                    text: {\n                      id: prototype2.commandText?.id || `getPlayCardEffects_commentText_${cardId2}`,\n                      description: prototype2.commandText?.description || \"unknown\",\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect2, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                                const cardId3 = DefineFn2.EffectFn.getCardID(effect2);\n                                const from2 = GameStateFn2.getItemBaSyou(ctx4, cardId3);\n                                const to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u30B8\\u30E3\\u30F3\\u30AF\\u30E4\\u30FC\\u30C9\");\n                                ctx4 = GameStateFn2.doItemMove(ctx4, to, [cardId3, from2]);\n                                ctx4 = GameStateFn2.doTriggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                                return ctx4;\n                              }.toString()\n                            },\n                            ...prototype2.commandText?.logicTreeActions?.[0]?.actions || []\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30B0\\u30E9\\u30D5\\u30A3\\u30C3\\u30AF\") {\n                  const cardId3 = DefineFn.EffectFn.getCardID(effect);\n                  const from2 = GameStateFn.getItemBaSyou(ctx3, cardId3);\n                  const to = DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"G\\u30BE\\u30FC\\u30F3\");\n                  ctx3 = GameStateFn.doItemMove(ctx3, to, [cardId3, from2]);\n                  ctx3 = GameStateFn.doTriggerEvent(ctx3, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                  return ctx3;\n                }\n                if (prototype2.category == \"\\u30AA\\u30DA\\u30EC\\u30FC\\u30B7\\u30E7\\u30F3\") {\n                  const cardId3 = DefineFn.EffectFn.getCardID(effect);\n                  const from2 = GameStateFn.getItemBaSyou(ctx3, cardId3);\n                  const to = DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\");\n                  ctx3 = GameStateFn.doItemMove(ctx3, to, [cardId3, from2]);\n                  ctx3 = GameStateFn.doTriggerEvent(ctx3, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                  return ctx3;\n                }\n                if (prototype2.category == \"ACE\") {\n                  throw new Error(`not support category: ${prototype2.category}`);\n                }\n                return ctx3;\n              }"
                            }
                        ]
                    }
                ]
            }
        },
        "createPlayCardEffects_PlayerB_99": {
            "id": "createPlayCardEffects_PlayerB_99",
            "reason": [
                "PlayCard",
                "PlayerB",
                "PlayerB_99"
            ],
            "description": "從手中即將出牌, 出牌後會產生場出的效果",
            "text": {
                "id": "createPlayCardEffects_text_PlayerB_99",
                "title": [],
                "description": "從手中即將出牌, 出牌後會產生場出的效果",
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
                    "黒X": {
                        "title": [
                            "RollColor",
                            "黒"
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
                                    "value": "黒X"
                                }
                            ]
                        },
                        "actions": [
                            {
                                "title": "function _(ctx3, effect, { DefineFn, GameStateFn, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn.EffectFn.getCardID(effect);\n                const prototype2 = GameStateFn.getItemPrototype(ctx3, cardId2);\n                const from = GameStateFn.getItemBaSyou(ctx3, cardId2);\n                ctx3 = GameStateFn.doItemMove(ctx3, DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u3044\\u308B\\u30AB\\u30FC\\u30C9\"), [cardId2, from]);\n                if (prototype2.category == \"\\u30E6\\u30CB\\u30C3\\u30C8\") {\n                  return GameStateFn.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn.EffectFn.getPlayerID(effect), DefineFn.EffectFn.getCardID(effect)],\n                    description: effect.text.description,\n                    text: {\n                      id: effect.text.id,\n                      description: effect.text.description,\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect2, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                                const cardId3 = DefineFn2.EffectFn.getCardID(effect2);\n                                const from2 = GameStateFn2.getItemBaSyou(ctx4, cardId3);\n                                const to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\");\n                                ctx4 = GameStateFn2.doItemMove(ctx4, to, [cardId3, from2]);\n                                const hasHigh = GameStateFn2.getCardHasSpeicalEffect(ctx4, [\"\\u6226\\u95D8\\u914D\\u5099\"], cardId3);\n                                const hasPS = GameStateFn2.getCardHasSpeicalEffect(ctx4, [\"PS\\u88C5\\u7532\"], cardId3);\n                                const isNoNeedRoll = hasHigh || hasPS;\n                                const isRoll = isNoNeedRoll == false;\n                                ctx4 = GameStateFn2.doItemSetRollState(ctx4, isRoll, [cardId3, from2], { isSkipTargetMissing: true });\n                                ctx4 = GameStateFn2.doTriggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                                return ctx4;\n                              }.toString()\n                            }\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30AD\\u30E3\\u30E9\\u30AF\\u30BF\\u30FC\" || prototype2.category == \"\\u30AA\\u30DA\\u30EC\\u30FC\\u30B7\\u30E7\\u30F3(\\u30E6\\u30CB\\u30C3\\u30C8)\") {\n                  return GameStateFn.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn.EffectFn.getPlayerID(effect), DefineFn.EffectFn.getCardID(effect)],\n                    description: effect.text.description,\n                    text: {\n                      id: effect.text.id,\n                      description: effect.text.description,\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect2, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                                const cardId3 = DefineFn2.EffectFn.getCardID(effect2);\n                                const pairs = GameStateFn2.getCardTipStrBaSyouPairs(ctx4, \"\\u4E00\\u500B\\u81EA\\u8ECD\\u6A5F\\u9AD4\", cardId3);\n                                if (pairs.length == 0) {\n                                  throw new Error(`pairs must not 0: ${effect2.text.description}`);\n                                }\n                                const [targetCardId, targetBasyou] = pairs[0];\n                                const from2 = GameStateFn2.getItemBaSyou(ctx4, cardId3);\n                                const to = targetBasyou;\n                                ctx4 = GameStateFn2.doItemMove(ctx4, to, [cardId3, from2]);\n                                ctx4 = GameStateFn2.setSetGroupParent(ctx4, targetCardId, cardId3);\n                                ctx4 = GameStateFn2.doTriggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                                ctx4 = GameStateFn2.doTriggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u30BB\\u30C3\\u30C8\\u3055\\u308C\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                                return ctx4;\n                              }.toString()\n                            }\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30B3\\u30DE\\u30F3\\u30C9\") {\n                  return GameStateFn.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn.EffectFn.getPlayerID(effect), DefineFn.EffectFn.getCardID(effect)],\n                    description: effect.text.description,\n                    text: {\n                      id: prototype2.commandText?.id || `getPlayCardEffects_commentText_${cardId2}`,\n                      description: prototype2.commandText?.description || \"unknown\",\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect2, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                                const cardId3 = DefineFn2.EffectFn.getCardID(effect2);\n                                const from2 = GameStateFn2.getItemBaSyou(ctx4, cardId3);\n                                const to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u30B8\\u30E3\\u30F3\\u30AF\\u30E4\\u30FC\\u30C9\");\n                                ctx4 = GameStateFn2.doItemMove(ctx4, to, [cardId3, from2]);\n                                ctx4 = GameStateFn2.doTriggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                                return ctx4;\n                              }.toString()\n                            },\n                            ...prototype2.commandText?.logicTreeActions?.[0]?.actions || []\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30B0\\u30E9\\u30D5\\u30A3\\u30C3\\u30AF\") {\n                  const cardId3 = DefineFn.EffectFn.getCardID(effect);\n                  const from2 = GameStateFn.getItemBaSyou(ctx3, cardId3);\n                  const to = DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"G\\u30BE\\u30FC\\u30F3\");\n                  ctx3 = GameStateFn.doItemMove(ctx3, to, [cardId3, from2]);\n                  ctx3 = GameStateFn.doTriggerEvent(ctx3, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                  return ctx3;\n                }\n                if (prototype2.category == \"\\u30AA\\u30DA\\u30EC\\u30FC\\u30B7\\u30E7\\u30F3\") {\n                  const cardId3 = DefineFn.EffectFn.getCardID(effect);\n                  const from2 = GameStateFn.getItemBaSyou(ctx3, cardId3);\n                  const to = DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\");\n                  ctx3 = GameStateFn.doItemMove(ctx3, to, [cardId3, from2]);\n                  ctx3 = GameStateFn.doTriggerEvent(ctx3, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                  return ctx3;\n                }\n                if (prototype2.category == \"ACE\") {\n                  throw new Error(`not support category: ${prototype2.category}`);\n                }\n                return ctx3;\n              }"
                            }
                        ]
                    }
                ]
            }
        },
        "createPlayGEffects_PlayerB_61": {
            "id": "createPlayGEffects_PlayerB_61",
            "reason": [
                "PlayCard",
                "PlayerB",
                "PlayerB_61"
            ],
            "description": "PlayG",
            "isPlayG": true,
            "text": {
                "id": "createPlayGEffects_text_PlayerB_61",
                "title": [],
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
        "createPlayGEffects_PlayerB_87": {
            "id": "createPlayGEffects_PlayerB_87",
            "reason": [
                "PlayCard",
                "PlayerB",
                "PlayerB_87"
            ],
            "description": "PlayG",
            "isPlayG": true,
            "text": {
                "id": "createPlayGEffects_text_PlayerB_87",
                "title": [],
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
        "createPlayGEffects_PlayerB_99": {
            "id": "createPlayGEffects_PlayerB_99",
            "reason": [
                "PlayCard",
                "PlayerB",
                "PlayerB_99"
            ],
            "description": "PlayG",
            "isPlayG": true,
            "text": {
                "id": "createPlayGEffects_text_PlayerB_99",
                "title": [],
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
        "getPlayEffects_PlayerB_PlayerB_98_loadPrototype_179030_11E_U_BK194S_2_black_text_0": {
            "id": "getPlayEffects_PlayerB_PlayerB_98_loadPrototype_179030_11E_U_BK194S_2_black_text_0",
            "reason": [
                "PlayText",
                "PlayerB",
                "PlayerB_98",
                "loadPrototype_179030_11E_U_BK194S_2_black_text_0"
            ],
            "description": "（自軍ターン）〔０〕：黒のGサインを持つ自軍Gが５枚以上ある場合、自軍ジャンクヤードにある、黒のGサインを持つ全てのカードは、このターン中、自軍手札にあるかのようにプレイできる。このターン中、場、または手札から、自軍ジャンクヤードにカードが移る場合、ジャンクヤードに移る代わりにゲームから取り除かれる。",
            "text": {
                "id": "loadPrototype_179030_11E_U_BK194S_2_black_text_0",
                "description": "（自軍ターン）〔０〕：黒のGサインを持つ自軍Gが５枚以上ある場合、自軍ジャンクヤードにある、黒のGサインを持つ全てのカードは、このターン中、自軍手札にあるかのようにプレイできる。このターン中、場、または手札から、自軍ジャンクヤードにカードが移る場合、ジャンクヤードに移る代わりにゲームから取り除かれる。",
                "title": [
                    "使用型",
                    [
                        "自軍",
                        "ターン"
                    ]
                ],
                "conditions": {
                    "黒のGサインを持つ自軍Gが５枚以上ある場合": {
                        "actions": [
                            {
                                "title": [
                                    "_黒のGサインを持つ_自軍_Gが_５枚以上ある場合",
                                    "黒",
                                    "自軍",
                                    "グラフィック",
                                    5
                                ]
                            }
                        ]
                    },
                    "同切上限": {
                        "actions": [
                            {
                                "title": "function _(ctx3, effect, { DefineFn: DefineFn2, GameStateFn: GameStateFn2, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn2.EffectFn.getCardID(effect);\n                const ps = GameStateFn2.getItemState(ctx3, cardId2);\n                if (ps.textIdsUseThisCut?.[effect.text.id]) {\n                  throw new DefineFn2.TipError(`\\u540C\\u5207\\u4E0A\\u9650: ${effect.text.description}`);\n                }\n                ctx3 = GameStateFn2.mapItemState(ctx3, cardId2, (ps2) => {\n                  return {\n                    ...ps2,\n                    textIdsUseThisCut: {\n                      ...ps2.textIdsUseThisCut,\n                      [effect.text.id]: true\n                    }\n                  };\n                });\n                return ctx3;\n              }"
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
                                            "title": "function _(ctx, effect, { DefineFn, GameStateFn }) {\n                                            const cardId = DefineFn.EffectFn.getCardID(effect);\n                                            const ge1 = {\n                                                title: [\"場、または手札から、自軍ジャンクヤードにカードが移る場合、ジャンクヤードに移る代わりにゲームから取り除かれる\"],\n                                                cardIds: [cardId]\n                                            };\n                                            ctx = GameStateFn.mapItemState(ctx, cardId, is => DefineFn.ItemStateFn.setGlobalEffect(is, null, ge1, { isRemoveOnTurnEnd: true }));\n                                            ctx = GameStateFn.mapItemState(ctx, cardId, is => DefineFn.ItemStateFn.setFlag(is, \"enabled\", true, { isRemoveOnTurnEnd: true }));\n                                            return ctx;\n                                        }"
                                        }
                                    ]
                                ]
                            }
                        ]
                    }
                ],
                "onSituation": "function _(ctx, effect, bridge) {\n                const { DefineFn, GameStateFn } = bridge;\n                const situation = DefineFn.EffectFn.getSituation(effect);\n                if (situation != null) {\n                    return [];\n                }\n                const cardId = DefineFn.EffectFn.getCardID(effect);\n                if (GameStateFn.getItemState(ctx, cardId).flags[\"enabled\"]) {\n                    const cardController = GameStateFn.getItemController(ctx, cardId);\n                    const targetIds = GameStateFn.getItemIdsByBasyou(ctx, DefineFn.AbsoluteBaSyouFn.of(cardController, \"ジャンクヤード\"))\n                        .filter(cardId => GameStateFn.getItemPrototype(ctx, cardId).gsign?.[0].includes(\"黒\"));\n                    if (targetIds.length) {\n                        return [\n                            {\n                                title: [\"自軍手札にあるかのようにプレイできる\"],\n                                cardIds: targetIds\n                            }\n                        ];\n                    }\n                }\n                return [];\n            }"
            }
        }
    },
    "table": {
        "cardStack": {
            "[\"PlayerA\",\"本国\"]": [
                "PlayerA_48",
                "PlayerA_26",
                "PlayerA_10",
                "PlayerA_27",
                "PlayerA_43",
                "PlayerA_42",
                "PlayerA_28",
                "PlayerA_1",
                "PlayerA_32",
                "PlayerA_14",
                "PlayerA_18",
                "PlayerA_29",
                "PlayerA_38",
                "PlayerA_15",
                "PlayerA_39",
                "PlayerA_33",
                "PlayerA_37",
                "PlayerA_24",
                "PlayerA_44",
                "PlayerA_45",
                "PlayerA_0",
                "PlayerA_8",
                "PlayerA_34",
                "PlayerA_25",
                "PlayerA_16",
                "PlayerA_12",
                "PlayerA_7",
                "PlayerA_46",
                "PlayerA_30"
            ],
            "[\"PlayerB\",\"本国\"]": [
                "PlayerB_54",
                "PlayerB_97",
                "PlayerB_57",
                "PlayerB_53",
                "PlayerB_59",
                "PlayerB_75",
                "PlayerB_74",
                "PlayerB_50",
                "PlayerB_68",
                "PlayerB_96",
                "PlayerB_90"
            ],
            "[\"PlayerA\",\"手札\"]": [],
            "[\"PlayerB\",\"手札\"]": [],
            "[\"PlayerA\",\"Gゾーン\"]": [
                "PlayerA_47",
                "PlayerA_6",
                "PlayerA_36",
                "PlayerA_35",
                "PlayerA_4"
            ],
            "[\"PlayerB\",\"Gゾーン\"]": [
                "PlayerB_88",
                "PlayerB_52",
                "PlayerB_84",
                "PlayerB_78",
                "PlayerB_55",
                "PlayerB_86",
                "PlayerB_72"
            ],
            "[\"PlayerB\",\"プレイされているカード\"]": [],
            "[\"PlayerB\",\"配備エリア\"]": [
                "PlayerB_83",
                "PlayerB_70",
                "PlayerB_56",
                "PlayerB_98"
            ],
            "[\"PlayerA\",\"プレイされているカード\"]": [],
            "[\"PlayerA\",\"配備エリア\"]": [
                "PlayerA_2",
                "PlayerA_3",
                "PlayerA_22",
                "PlayerA_21",
                "PlayerA_20",
                "PlayerA_9"
            ],
            "[\"PlayerA\",\"戦闘エリア2\"]": [],
            "[\"PlayerB\",\"捨て山\"]": [
                "PlayerB_95",
                "PlayerB_80",
                "PlayerB_67",
                "PlayerB_79",
                "PlayerB_58",
                "PlayerB_73",
                "PlayerB_92",
                "PlayerB_63",
                "PlayerB_82",
                "PlayerB_89",
                "PlayerB_93",
                "PlayerB_62",
                "PlayerB_51",
                "PlayerB_91",
                "PlayerB_85",
                "PlayerB_71",
                "PlayerB_76",
                "PlayerB_64",
                "PlayerB_77",
                "PlayerB_81",
                "PlayerB_66",
                "PlayerB_94",
                "PlayerB_60",
                "PlayerB_65",
                "PlayerB_69"
            ],
            "[\"PlayerB\",\"ジャンクヤード\"]": [
                "PlayerB_61",
                "PlayerB_87",
                "PlayerB_99"
            ],
            "[\"PlayerA\",\"ジャンクヤード\"]": [
                "PlayerA_19",
                "PlayerA_5",
                "PlayerA_11"
            ],
            "[\"PlayerA\",\"戦闘エリア1\"]": [],
            "[\"PlayerB\",\"戦闘エリア1\"]": [],
            "[\"PlayerA\",\"捨て山\"]": [
                "PlayerA_17",
                "PlayerA_31",
                "PlayerA_23",
                "PlayerA_49",
                "PlayerA_41",
                "PlayerA_13",
                "PlayerA_40"
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
        "PlayerB_83": {
            "id": "PlayerB_83",
            "damage": 0,
            "destroyReason": null,
            "flags": {},
            "tips": {
                "0[黒]": {
                    "title": [
                        "カード",
                        [
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
                                "PlayerB_88",
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
            "isFirstTurn": false,
            "isOpenForGain": false,
            "isCheat": false,
            "textIdsUseThisCut": {},
            "textIdsUseThisTurn": {}
        },
        "PlayerA_9": {
            "id": "PlayerA_9",
            "damage": 0,
            "destroyReason": null,
            "flags": {},
            "tips": {
                "黒X": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerA_47",
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
                                "PlayerA_47",
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
            "isOpenForGain": false,
            "isCheat": false,
            "textIdsUseThisTurn": {}
        },
        "PlayerA_20": {
            "id": "PlayerA_20",
            "damage": 0,
            "destroyReason": null,
            "flags": {},
            "tips": {
                "0[黒]": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerA_47",
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
                                "PlayerA_47",
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
                                "PlayerA_3",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "配備エリア"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_22",
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
                            ],
                            [
                                "PlayerA_20",
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
                            ],
                            [
                                "PlayerA_22",
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
                            ],
                            [
                                "PlayerA_20",
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
                        [
                            [
                                "PlayerA_9",
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
                                "PlayerA_9",
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
        "PlayerB_87": {
            "id": "PlayerB_87",
            "damage": 0,
            "destroyReason": null,
            "flags": {},
            "tips": {
                "0[黒]": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerB_55",
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
                                "PlayerB_72",
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
                                "PlayerB_55",
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
                "1[黒]": {
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
                                "PlayerB_72",
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
        "PlayerA_21": {
            "id": "PlayerA_21",
            "damage": 0,
            "destroyReason": null,
            "flags": {},
            "tips": {
                "0[黒]": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerA_47",
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
                                "PlayerA_36",
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
                                "PlayerA_47",
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
            "isOpenForGain": false,
            "isCheat": false,
            "textIdsUseThisTurn": {}
        },
        "PlayerA_19": {
            "id": "PlayerA_19",
            "damage": 0,
            "destroyReason": null,
            "flags": {},
            "tips": {
                "0[黒]": {
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
                                "PlayerA_36",
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
        "PlayerB_72": {
            "id": "PlayerB_72",
            "damage": 0,
            "destroyReason": {
                "id": "戦闘ダメージ",
                "playerID": "PlayerA"
            },
            "flags": {},
            "tips": {
                "0[黒]": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerB_88",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_52",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_84",
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
                                "PlayerB_88",
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
            "isFirstTurn": false,
            "textIdsUseThisCut": {},
            "isOpenForGain": false,
            "isCheat": false,
            "textIdsUseThisTurn": {}
        },
        "PlayerA_5": {
            "id": "PlayerA_5",
            "damage": 0,
            "destroyReason": {
                "id": "戦闘ダメージ",
                "playerID": "PlayerB"
            },
            "flags": {},
            "tips": {
                "0[黒]": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerA_47",
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
                                "PlayerA_36",
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
                                "PlayerA_47",
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
            "isOpenForGain": false,
            "isCheat": false,
            "textIdsUseThisTurn": {}
        },
        "PlayerA_22": {
            "id": "PlayerA_22",
            "damage": 1,
            "destroyReason": null,
            "flags": {},
            "tips": {
                "0[黒]": {
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
                                "PlayerA_36",
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
        "PlayerB_70": {
            "id": "PlayerB_70",
            "damage": 0,
            "destroyReason": {
                "id": "戦闘ダメージ",
                "playerID": "PlayerA"
            },
            "flags": {},
            "tips": {
                "0[黒]": {
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
                                "PlayerB_72",
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
        "PlayerA_3": {
            "id": "PlayerA_3",
            "damage": 0,
            "destroyReason": null,
            "flags": {},
            "tips": {
                "1[黒]": {
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
                                "PlayerA_36",
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
                "0[黒]": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerA_47",
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
                                "PlayerA_36",
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
                                "PlayerA_47",
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
            "isOpenForGain": false,
            "isCheat": false,
            "textIdsUseThisTurn": {}
        },
        "PlayerB_56": {
            "id": "PlayerB_56",
            "damage": 0,
            "destroyReason": null,
            "flags": {},
            "tips": {
                "0[黒]": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerB_88",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_52",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_84",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_78",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_55",
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
                                "PlayerB_88",
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
                "敵軍ユニット１枚": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerA_5",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "配備エリア"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_22",
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
                            ],
                            [
                                "PlayerA_20",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "配備エリア"
                                    ]
                                }
                            ],
                            [
                                "PlayerA_9",
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
                                "PlayerA_5",
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
            "isOpenForGain": false,
            "isCheat": false,
            "textIdsUseThisTurn": {}
        },
        "PlayerA_11": {
            "id": "PlayerA_11",
            "damage": 0,
            "destroyReason": null,
            "flags": {},
            "tips": {
                "0[黒]": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerA_47",
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
                                "PlayerA_36",
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
                                "PlayerA_47",
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
        "PlayerB_98": {
            "id": "PlayerB_98",
            "damage": 0,
            "destroyReason": null,
            "flags": {
                "enabled": true
            },
            "tips": {
                "0[黒]": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerB_88",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_52",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_84",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_78",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_55",
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
                                "PlayerB_88",
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
                "1[黒]": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerB_52",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_84",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_78",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_55",
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
                                "PlayerB_52",
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
                "setGlobalEffect_01923802-5f47-7001-acdb-ee971b951021": {
                    "title": [
                        "場、または手札から、自軍ジャンクヤードにカードが移る場合、ジャンクヤードに移る代わりにゲームから取り除かれる"
                    ],
                    "cardIds": [
                        "PlayerB_98"
                    ]
                },
                "setGlobalEffect_01923802-6478-7001-adc2-b1ed413c1d08": {
                    "title": [
                        "場、または手札から、自軍ジャンクヤードにカードが移る場合、ジャンクヤードに移る代わりにゲームから取り除かれる"
                    ],
                    "cardIds": [
                        "PlayerB_98"
                    ]
                }
            },
            "varNamesRemoveOnTurnEnd": {
                "setGlobalEffect_01923802-5f47-7001-acdb-ee971b951021": true,
                "enabled": true,
                "setGlobalEffect_01923802-6478-7001-adc2-b1ed413c1d08": true
            },
            "isFirstTurn": false,
            "textIdsUseThisCut": {},
            "isOpenForGain": false,
            "isCheat": false,
            "textIdsUseThisTurn": {}
        },
        "PlayerB_61": {
            "id": "PlayerB_61",
            "damage": 0,
            "destroyReason": null,
            "flags": {},
            "tips": {
                "0[黒]": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerB_78",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerB",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "PlayerB_55",
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
                                "PlayerB_72",
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
                                "PlayerB_78",
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
                "1[黒]": {
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
                                "PlayerA_36",
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
                "0[黒]": {
                    "title": [
                        "カード",
                        [
                            [
                                "PlayerA_47",
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
                                "PlayerA_36",
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
                                "PlayerA_47",
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
            "isOpenForGain": false,
            "isCheat": false,
            "textIdsUseThisTurn": {}
        },
        "PlayerB_99": {
            "id": "PlayerB_99",
            "damage": 0,
            "destroyReason": null,
            "flags": {},
            "tips": {
                "全ての軍は、自分の手札X枚を可能な限り選ん1": {
                    "title": [
                        "カード",
                        [],
                        []
                    ],
                    "max": 1
                },
                "全ての軍は、自分の手札X枚を可能な限り選ん2": {
                    "title": [
                        "カード",
                        [],
                        []
                    ],
                    "max": 1
                }
            },
            "globalEffects": {},
            "varNamesRemoveOnTurnEnd": {},
            "textIdsUseThisCut": {}
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
            "confirmPhase": false
        },
        "PlayerB": {
            "id": "PlayerB",
            "turn": 0,
            "playGCount": 0,
            "confirmPhase": false
        }
    },
    "activePlayerID": "PlayerB",
    "immediateEffect": [],
    "stackEffect": [],
    "destroyEffect": [],
    "commandEffects": [
        "createPlayCardEffects_PlayerB_61",
        "createPlayCardEffects_PlayerB_87",
        "createPlayCardEffects_PlayerB_99",
        "createPlayGEffects_PlayerB_61",
        "createPlayGEffects_PlayerB_87",
        "createPlayGEffects_PlayerB_99",
        "getPlayEffects_PlayerB_PlayerB_98_loadPrototype_179030_11E_U_BK194S_2_black_text_0"
    ],
    "commandEffectTips": [
        {
            "effectId": "createPlayCardEffects_PlayerB_61",
            "logicID": 0,
            "logicSubID": 0,
            "tipOrErrors": [
                {
                    "effectId": "createPlayCardEffects_PlayerB_61",
                    "conditionKey": "合計国力〔x〕",
                    "tip": null,
                    "errors": [
                        "合計国力〔x〕:1 < 3. 從手中即將出牌, 出牌後會產生場出的效果"
                    ]
                },
                {
                    "effectId": "createPlayCardEffects_PlayerB_61",
                    "conditionKey": "0[黒]",
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
                    "errors": []
                }
            ]
        },
        {
            "effectId": "createPlayCardEffects_PlayerB_87",
            "logicID": 0,
            "logicSubID": 0,
            "tipOrErrors": [
                {
                    "effectId": "createPlayCardEffects_PlayerB_87",
                    "conditionKey": "合計国力〔x〕",
                    "tip": null,
                    "errors": [
                        "合計国力〔x〕:1 < 3. 從手中即將出牌, 出牌後會產生場出的效果"
                    ]
                },
                {
                    "effectId": "createPlayCardEffects_PlayerB_87",
                    "conditionKey": "0[黒]",
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
                    "errors": []
                },
                {
                    "effectId": "createPlayCardEffects_PlayerB_87",
                    "conditionKey": "1[黒]",
                    "tip": {
                        "title": [
                            "カード",
                            [],
                            []
                        ],
                        "min": 0
                    },
                    "errors": []
                }
            ]
        },
        {
            "effectId": "createPlayCardEffects_PlayerB_99",
            "logicID": 0,
            "logicSubID": 0,
            "tipOrErrors": [
                {
                    "effectId": "createPlayCardEffects_PlayerB_99",
                    "conditionKey": "合計国力〔x〕",
                    "tip": null,
                    "errors": []
                },
                {
                    "effectId": "createPlayCardEffects_PlayerB_99",
                    "conditionKey": "黒X",
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
                    "errors": []
                }
            ]
        },
        {
            "effectId": "createPlayGEffects_PlayerB_61",
            "logicID": 0,
            "logicSubID": 0,
            "tipOrErrors": [
                {
                    "effectId": "createPlayGEffects_PlayerB_61",
                    "conditionKey": "出G上限",
                    "tip": null,
                    "errors": []
                }
            ]
        },
        {
            "effectId": "createPlayGEffects_PlayerB_87",
            "logicID": 0,
            "logicSubID": 0,
            "tipOrErrors": [
                {
                    "effectId": "createPlayGEffects_PlayerB_87",
                    "conditionKey": "出G上限",
                    "tip": null,
                    "errors": []
                }
            ]
        },
        {
            "effectId": "createPlayGEffects_PlayerB_99",
            "logicID": 0,
            "logicSubID": 0,
            "tipOrErrors": [
                {
                    "effectId": "createPlayGEffects_PlayerB_99",
                    "conditionKey": "出G上限",
                    "tip": null,
                    "errors": []
                }
            ]
        },
        {
            "effectId": "getPlayEffects_PlayerB_PlayerB_98_loadPrototype_179030_11E_U_BK194S_2_black_text_0",
            "logicID": 0,
            "logicSubID": 0,
            "tipOrErrors": [
                {
                    "effectId": "getPlayEffects_PlayerB_PlayerB_98_loadPrototype_179030_11E_U_BK194S_2_black_text_0",
                    "conditionKey": "黒のGサインを持つ自軍Gが５枚以上ある場合",
                    "tip": null,
                    "errors": []
                },
                {
                    "effectId": "getPlayEffects_PlayerB_PlayerB_98_loadPrototype_179030_11E_U_BK194S_2_black_text_0",
                    "conditionKey": "同切上限",
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
    "turn": 15,
    "setGroup": {
        "itemGroupParent": {},
        "itemGroupChildren": {}
    },
    "stackEffectMemory": [],
    "flowMemory": {
        "state": "playing",
        "hasTriggerEvent": false,
        "hasPlayerPassPhase": {
            "PlayerA": true
        },
        "hasPlayerPassCut": {
            "PlayerB": true,
            "PlayerA": true
        },
        "hasPlayerPassPayCost": {},
        "shouldTriggerStackEffectFinishedEvent": false,
        "activeEffectID": "createPlayCardEffects_PlayerB_99",
        "activeLogicID": 0,
        "activeLogicSubID": 0
    }
}