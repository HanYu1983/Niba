import { EffectFn } from "../game/define/Effect"
import { ItemStateFn } from "../game/define/ItemState"
import { PlayerA } from "../game/define/PlayerID"
import { setTipSelectionForUser, doEffect } from "../game/gameState/doEffect"
import { createPlayEffects } from "../game/gameState/createPlayEffects"
import { mapItemState } from "../game/gameState/ItemStateComponent"
import { GameStateWithFlowMemory } from "../game/gameStateWithFlowMemory/GameStateWithFlowMemory"
import { loadPrototype } from "../script"

export async function testIssue() {
    const blackT3 = ["179015_04B_O_BK010C_black", "179015_04B_O_BK010C_black", "179015_04B_U_BK058R_black", "179015_04B_U_BK058R_black", "179015_04B_U_BK059C_black", "179015_04B_U_BK059C_black", "179015_04B_U_BK061C_black", "179015_04B_U_BK061C_black", "179016_04B_U_BK066C_black", "179016_04B_U_BK066C_black", "179019_02A_C_BK015S_black", "179019_02A_C_BK015S_black", "179020_05C_U_BK100U_black", "179020_05C_U_BK100U_black", "179023_06C_C_BK048R_black", "179023_06C_C_BK048R_black", "179023_06C_C_BK049U_black", "179023_06C_C_BK049U_black", "179024_04B_C_BK027U_black", "179024_04B_C_BK027U_black", "179024_04B_U_BK060C_black", "179024_04B_U_BK060C_black", "179024_04B_U_BK067C_black", "179024_04B_U_BK067C_black", "179024_B2B_C_BK054C_black", "179024_B2B_C_BK054C_black", "179024_B2B_U_BK128S_black_02", "179024_B2B_U_BK128S_black_02", "179024_B2B_U_BK129R_black", "179024_B2B_U_BK129R_black", "179027_09D_C_BK063R_black", "179027_09D_C_BK063R_black", "179027_09D_O_BK010N_black", "179027_09D_O_BK010N_black", "179027_09D_U_BK163S_black", "179027_09D_U_BK163S_black", "179027_09D_U_BK163S_black", "179029_06C_C_BK045U_black", "179029_06C_C_BK045U_black", "179029_B3C_C_BK071N_black", "179029_B3C_C_BK071N_black", "179029_B3C_U_BK184N_black", "179029_B3C_U_BK184N_black", "179029_B3C_U_BK184N_black", "179029_B3C_U_BK185N_black", "179029_B3C_U_BK185N_black", "179030_11E_U_BK194S_2_black", "179030_11E_U_BK194S_2_black", "179030_11E_U_BK194S_2_black", "179901_B2B_C_BK005P_black"]
    await Promise.all(blackT3.map(loadPrototype))
    let ctx = ISSUE_CTX2
    const cmds = createPlayEffects(ctx, PlayerA)
    if (cmds.length == 0) {
        throw new Error()
    }
    const effect = cmds[1]
    const cardId = EffectFn.getCardID(effect)
    //ctx = mapItemState(ctx, cardId, ItemStateFn.onEffectEnd) as GameStateWithFlowMemory

    console.log(ctx.itemStates)
    //ctx = setTipSelectionForUser(ctx, effect, 0, 0) as GameStateWithFlowMemory
    doEffect(ctx, effect, 0, 0)
}

const ISSUE_CTX2: GameStateWithFlowMemory = {
    "isGameState": true,
    "cards": {
        "card_019228a2-b3ab-7aa1-91a5-ebc7e5743251": {
            "id": "card_019228a2-b3ab-7aa1-91a5-ebc7e5743251",
            "protoID": "179015_04B_O_BK010C_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "card_019228a2-b3ab-7aa1-91a5-f70f99535374": {
            "id": "card_019228a2-b3ab-7aa1-91a5-f70f99535374",
            "protoID": "179015_04B_O_BK010C_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "card_019228a2-b3ab-7aa1-91a5-fa684dd64c1e": {
            "id": "card_019228a2-b3ab-7aa1-91a5-fa684dd64c1e",
            "protoID": "179015_04B_U_BK058R_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "card_019228a2-b3ab-7aa1-91a6-022854ebcdd1": {
            "id": "card_019228a2-b3ab-7aa1-91a6-022854ebcdd1",
            "protoID": "179015_04B_U_BK058R_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "card_019228a2-b3ab-7aa1-91a6-0f14ae14af62": {
            "id": "card_019228a2-b3ab-7aa1-91a6-0f14ae14af62",
            "protoID": "179015_04B_U_BK059C_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "card_019228a2-b3ab-7aa1-91a6-132a90b05b93": {
            "id": "card_019228a2-b3ab-7aa1-91a6-132a90b05b93",
            "protoID": "179015_04B_U_BK059C_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "card_019228a2-b3ab-7aa1-91a6-1dee2cccb07f": {
            "id": "card_019228a2-b3ab-7aa1-91a6-1dee2cccb07f",
            "protoID": "179015_04B_U_BK061C_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "card_019228a2-b3ab-7aa1-91a6-227a3254535a": {
            "id": "card_019228a2-b3ab-7aa1-91a6-227a3254535a",
            "protoID": "179015_04B_U_BK061C_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "card_019228a2-b3ab-7aa1-91a6-2bce727dc7f6": {
            "id": "card_019228a2-b3ab-7aa1-91a6-2bce727dc7f6",
            "protoID": "179016_04B_U_BK066C_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "card_019228a2-b3ab-7aa1-91a6-30d63f2264f4": {
            "id": "card_019228a2-b3ab-7aa1-91a6-30d63f2264f4",
            "protoID": "179016_04B_U_BK066C_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "card_019228a2-b3ab-7aa1-91a6-3fb4c4a20d36": {
            "id": "card_019228a2-b3ab-7aa1-91a6-3fb4c4a20d36",
            "protoID": "179019_02A_C_BK015S_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "card_019228a2-b3ab-7aa1-91a6-4057d6b95c1e": {
            "id": "card_019228a2-b3ab-7aa1-91a6-4057d6b95c1e",
            "protoID": "179019_02A_C_BK015S_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "card_019228a2-b3ab-7aa1-91a6-4c629ee770d6": {
            "id": "card_019228a2-b3ab-7aa1-91a6-4c629ee770d6",
            "protoID": "179020_05C_U_BK100U_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "card_019228a2-b3ab-7aa1-91a6-52f2ce4ec146": {
            "id": "card_019228a2-b3ab-7aa1-91a6-52f2ce4ec146",
            "protoID": "179020_05C_U_BK100U_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "card_019228a2-b3ab-7aa1-91a6-5d66b82e4443": {
            "id": "card_019228a2-b3ab-7aa1-91a6-5d66b82e4443",
            "protoID": "179023_06C_C_BK048R_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "card_019228a2-b3ab-7aa1-91a6-672bffb80738": {
            "id": "card_019228a2-b3ab-7aa1-91a6-672bffb80738",
            "protoID": "179023_06C_C_BK048R_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "card_019228a2-b3ab-7aa1-91a6-6f1c9336d949": {
            "id": "card_019228a2-b3ab-7aa1-91a6-6f1c9336d949",
            "protoID": "179023_06C_C_BK049U_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "card_019228a2-b3ab-7aa1-91a6-72c289d2d725": {
            "id": "card_019228a2-b3ab-7aa1-91a6-72c289d2d725",
            "protoID": "179023_06C_C_BK049U_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "card_019228a2-b3ab-7aa1-91a6-7e59e997453a": {
            "id": "card_019228a2-b3ab-7aa1-91a6-7e59e997453a",
            "protoID": "179024_04B_C_BK027U_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "card_019228a2-b3ab-7aa1-91a6-81a7fed6df43": {
            "id": "card_019228a2-b3ab-7aa1-91a6-81a7fed6df43",
            "protoID": "179024_04B_C_BK027U_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "card_019228a2-b3ab-7aa1-91a6-8d5f9fce3954": {
            "id": "card_019228a2-b3ab-7aa1-91a6-8d5f9fce3954",
            "protoID": "179024_04B_U_BK060C_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "card_019228a2-b3ab-7aa1-91a6-916304bdc510": {
            "id": "card_019228a2-b3ab-7aa1-91a6-916304bdc510",
            "protoID": "179024_04B_U_BK060C_black",
            "ownerID": "PlayerA",
            "isFaceDown": false,
            "isRoll": true
        },
        "card_019228a2-b3ab-7aa1-91a6-9e57b426b5a1": {
            "id": "card_019228a2-b3ab-7aa1-91a6-9e57b426b5a1",
            "protoID": "179024_04B_U_BK067C_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "card_019228a2-b3ab-7aa1-91a6-a4318db101ed": {
            "id": "card_019228a2-b3ab-7aa1-91a6-a4318db101ed",
            "protoID": "179024_04B_U_BK067C_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "card_019228a2-b3ab-7aa1-91a6-ad5531e4f63c": {
            "id": "card_019228a2-b3ab-7aa1-91a6-ad5531e4f63c",
            "protoID": "179024_B2B_C_BK054C_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "card_019228a2-b3ab-7aa1-91a6-b37c0047c043": {
            "id": "card_019228a2-b3ab-7aa1-91a6-b37c0047c043",
            "protoID": "179024_B2B_C_BK054C_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "card_019228a2-b3ab-7aa1-91a6-bb70aed30e97": {
            "id": "card_019228a2-b3ab-7aa1-91a6-bb70aed30e97",
            "protoID": "179024_B2B_U_BK128S_black_02",
            "ownerID": "PlayerA",
            "isFaceDown": false
        },
        "card_019228a2-b3ab-7aa1-91a6-c5fe0999029a": {
            "id": "card_019228a2-b3ab-7aa1-91a6-c5fe0999029a",
            "protoID": "179024_B2B_U_BK128S_black_02",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "card_019228a2-b3ab-7aa1-91a6-ca6a9cde99d5": {
            "id": "card_019228a2-b3ab-7aa1-91a6-ca6a9cde99d5",
            "protoID": "179024_B2B_U_BK129R_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "card_019228a2-b3ab-7aa1-91a6-d51714bff97d": {
            "id": "card_019228a2-b3ab-7aa1-91a6-d51714bff97d",
            "protoID": "179024_B2B_U_BK129R_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "card_019228a2-b3ab-7aa1-91a6-dfef78c47907": {
            "id": "card_019228a2-b3ab-7aa1-91a6-dfef78c47907",
            "protoID": "179027_09D_C_BK063R_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "card_019228a2-b3ab-7aa1-91a6-e0d7ad289950": {
            "id": "card_019228a2-b3ab-7aa1-91a6-e0d7ad289950",
            "protoID": "179027_09D_C_BK063R_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "card_019228a2-b3ab-7aa1-91a6-ef5424a0245c": {
            "id": "card_019228a2-b3ab-7aa1-91a6-ef5424a0245c",
            "protoID": "179027_09D_O_BK010N_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "card_019228a2-b3ab-7aa1-91a6-f36e97d4ca06": {
            "id": "card_019228a2-b3ab-7aa1-91a6-f36e97d4ca06",
            "protoID": "179027_09D_O_BK010N_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "card_019228a2-b3ab-7aa1-91a6-fa728e1965a4": {
            "id": "card_019228a2-b3ab-7aa1-91a6-fa728e1965a4",
            "protoID": "179027_09D_U_BK163S_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "card_019228a2-b3ab-7aa1-91a7-07cdb0200b42": {
            "id": "card_019228a2-b3ab-7aa1-91a7-07cdb0200b42",
            "protoID": "179027_09D_U_BK163S_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "card_019228a2-b3ab-7aa1-91a7-0831a57fbe97": {
            "id": "card_019228a2-b3ab-7aa1-91a7-0831a57fbe97",
            "protoID": "179027_09D_U_BK163S_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "card_019228a2-b3ab-7aa1-91a7-115043c50b31": {
            "id": "card_019228a2-b3ab-7aa1-91a7-115043c50b31",
            "protoID": "179029_06C_C_BK045U_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "card_019228a2-b3ab-7aa1-91a7-196333ac1eaa": {
            "id": "card_019228a2-b3ab-7aa1-91a7-196333ac1eaa",
            "protoID": "179029_06C_C_BK045U_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "card_019228a2-b3ab-7aa1-91a7-20bccd29b9bc": {
            "id": "card_019228a2-b3ab-7aa1-91a7-20bccd29b9bc",
            "protoID": "179029_B3C_C_BK071N_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "card_019228a2-b3ab-7aa1-91a7-29839aaf997e": {
            "id": "card_019228a2-b3ab-7aa1-91a7-29839aaf997e",
            "protoID": "179029_B3C_C_BK071N_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "card_019228a2-b3ab-7aa1-91a7-35cef9ffb804": {
            "id": "card_019228a2-b3ab-7aa1-91a7-35cef9ffb804",
            "protoID": "179029_B3C_U_BK184N_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "card_019228a2-b3ab-7aa1-91a7-3af5fb00fae0": {
            "id": "card_019228a2-b3ab-7aa1-91a7-3af5fb00fae0",
            "protoID": "179029_B3C_U_BK184N_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "card_019228a2-b3ab-7aa1-91a7-460e372d6792": {
            "id": "card_019228a2-b3ab-7aa1-91a7-460e372d6792",
            "protoID": "179029_B3C_U_BK184N_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "card_019228a2-b3ab-7aa1-91a7-4c44a994ffed": {
            "id": "card_019228a2-b3ab-7aa1-91a7-4c44a994ffed",
            "protoID": "179029_B3C_U_BK185N_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "card_019228a2-b3ab-7aa1-91a7-51f100e497c4": {
            "id": "card_019228a2-b3ab-7aa1-91a7-51f100e497c4",
            "protoID": "179029_B3C_U_BK185N_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "card_019228a2-b3ab-7aa1-91a7-5f1277f82568": {
            "id": "card_019228a2-b3ab-7aa1-91a7-5f1277f82568",
            "protoID": "179030_11E_U_BK194S_2_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "card_019228a2-b3ab-7aa1-91a7-6230d83ecf37": {
            "id": "card_019228a2-b3ab-7aa1-91a7-6230d83ecf37",
            "protoID": "179030_11E_U_BK194S_2_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "card_019228a2-b3ab-7aa1-91a7-6ec3adb08642": {
            "id": "card_019228a2-b3ab-7aa1-91a7-6ec3adb08642",
            "protoID": "179030_11E_U_BK194S_2_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "card_019228a2-b3ab-7aa1-91a7-77a446c6f951": {
            "id": "card_019228a2-b3ab-7aa1-91a7-77a446c6f951",
            "protoID": "179901_B2B_C_BK005P_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "card_019228a2-b3ab-7aa1-91a7-780cd74645c5": {
            "id": "card_019228a2-b3ab-7aa1-91a7-780cd74645c5",
            "protoID": "179015_04B_O_BK010C_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "card_019228a2-b3ab-7aa1-91a7-86ba3d5ea989": {
            "id": "card_019228a2-b3ab-7aa1-91a7-86ba3d5ea989",
            "protoID": "179015_04B_O_BK010C_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "card_019228a2-b3ab-7aa1-91a7-89d2e19532a0": {
            "id": "card_019228a2-b3ab-7aa1-91a7-89d2e19532a0",
            "protoID": "179015_04B_U_BK058R_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "card_019228a2-b3ab-7aa1-91a7-9055f643914c": {
            "id": "card_019228a2-b3ab-7aa1-91a7-9055f643914c",
            "protoID": "179015_04B_U_BK058R_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "card_019228a2-b3ab-7aa1-91a7-9ccc05945f11": {
            "id": "card_019228a2-b3ab-7aa1-91a7-9ccc05945f11",
            "protoID": "179015_04B_U_BK059C_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "card_019228a2-b3ab-7aa1-91a7-a65c92c8212d": {
            "id": "card_019228a2-b3ab-7aa1-91a7-a65c92c8212d",
            "protoID": "179015_04B_U_BK059C_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "card_019228a2-b3ab-7aa1-91a7-aa1658dfe792": {
            "id": "card_019228a2-b3ab-7aa1-91a7-aa1658dfe792",
            "protoID": "179015_04B_U_BK061C_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "card_019228a2-b3ab-7aa1-91a7-b3b355f9cbdb": {
            "id": "card_019228a2-b3ab-7aa1-91a7-b3b355f9cbdb",
            "protoID": "179015_04B_U_BK061C_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "card_019228a2-b3ab-7aa1-91a7-ba88cb304932": {
            "id": "card_019228a2-b3ab-7aa1-91a7-ba88cb304932",
            "protoID": "179016_04B_U_BK066C_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "card_019228a2-b3ab-7aa1-91a7-c0e378553005": {
            "id": "card_019228a2-b3ab-7aa1-91a7-c0e378553005",
            "protoID": "179016_04B_U_BK066C_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "card_019228a2-b3ab-7aa1-91a7-cc42147ca8e3": {
            "id": "card_019228a2-b3ab-7aa1-91a7-cc42147ca8e3",
            "protoID": "179019_02A_C_BK015S_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "card_019228a2-b3ab-7aa1-91a7-d4241a33a5ab": {
            "id": "card_019228a2-b3ab-7aa1-91a7-d4241a33a5ab",
            "protoID": "179019_02A_C_BK015S_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "card_019228a2-b3ab-7aa1-91a7-da24043b398f": {
            "id": "card_019228a2-b3ab-7aa1-91a7-da24043b398f",
            "protoID": "179020_05C_U_BK100U_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "card_019228a2-b3ab-7aa1-91a7-e26bc87ffcd1": {
            "id": "card_019228a2-b3ab-7aa1-91a7-e26bc87ffcd1",
            "protoID": "179020_05C_U_BK100U_black",
            "ownerID": "PlayerB",
            "isFaceDown": false
        },
        "card_019228a2-b3ab-7aa1-91a7-ef4510b86844": {
            "id": "card_019228a2-b3ab-7aa1-91a7-ef4510b86844",
            "protoID": "179023_06C_C_BK048R_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "card_019228a2-b3ab-7aa1-91a7-f0e8919452e5": {
            "id": "card_019228a2-b3ab-7aa1-91a7-f0e8919452e5",
            "protoID": "179023_06C_C_BK048R_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "card_019228a2-b3ab-7aa1-91a7-f97c0b32257b": {
            "id": "card_019228a2-b3ab-7aa1-91a7-f97c0b32257b",
            "protoID": "179023_06C_C_BK049U_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "card_019228a2-b3ab-7aa1-91a8-069e5295d3e5": {
            "id": "card_019228a2-b3ab-7aa1-91a8-069e5295d3e5",
            "protoID": "179023_06C_C_BK049U_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "card_019228a2-b3ab-7aa1-91a8-0e6175a9654c": {
            "id": "card_019228a2-b3ab-7aa1-91a8-0e6175a9654c",
            "protoID": "179024_04B_C_BK027U_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "card_019228a2-b3ab-7aa1-91a8-10baa876e6cb": {
            "id": "card_019228a2-b3ab-7aa1-91a8-10baa876e6cb",
            "protoID": "179024_04B_C_BK027U_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "card_019228a2-b3ab-7aa1-91a8-1dbb17140bb1": {
            "id": "card_019228a2-b3ab-7aa1-91a8-1dbb17140bb1",
            "protoID": "179024_04B_U_BK060C_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "card_019228a2-b3ab-7aa1-91a8-26425b84bf2a": {
            "id": "card_019228a2-b3ab-7aa1-91a8-26425b84bf2a",
            "protoID": "179024_04B_U_BK060C_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "card_019228a2-b3ab-7aa1-91a8-2bbad2748a5c": {
            "id": "card_019228a2-b3ab-7aa1-91a8-2bbad2748a5c",
            "protoID": "179024_04B_U_BK067C_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "card_019228a2-b3ab-7aa1-91a8-353d386890e5": {
            "id": "card_019228a2-b3ab-7aa1-91a8-353d386890e5",
            "protoID": "179024_04B_U_BK067C_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "card_019228a2-b3ab-7aa1-91a8-3c6d374831b8": {
            "id": "card_019228a2-b3ab-7aa1-91a8-3c6d374831b8",
            "protoID": "179024_B2B_C_BK054C_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "card_019228a2-b3ab-7aa1-91a8-438ca8e780be": {
            "id": "card_019228a2-b3ab-7aa1-91a8-438ca8e780be",
            "protoID": "179024_B2B_C_BK054C_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "card_019228a2-b3ab-7aa1-91a8-4c7777197941": {
            "id": "card_019228a2-b3ab-7aa1-91a8-4c7777197941",
            "protoID": "179024_B2B_U_BK128S_black_02",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "card_019228a2-b3ab-7aa1-91a8-54530aa3135e": {
            "id": "card_019228a2-b3ab-7aa1-91a8-54530aa3135e",
            "protoID": "179024_B2B_U_BK128S_black_02",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "card_019228a2-b3ab-7aa1-91a8-5a60314f7e0e": {
            "id": "card_019228a2-b3ab-7aa1-91a8-5a60314f7e0e",
            "protoID": "179024_B2B_U_BK129R_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "card_019228a2-b3ab-7aa1-91a8-657e6cef2726": {
            "id": "card_019228a2-b3ab-7aa1-91a8-657e6cef2726",
            "protoID": "179024_B2B_U_BK129R_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "card_019228a2-b3ab-7aa1-91a8-6c879ad38bb0": {
            "id": "card_019228a2-b3ab-7aa1-91a8-6c879ad38bb0",
            "protoID": "179027_09D_C_BK063R_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "card_019228a2-b3ab-7aa1-91a8-7374870bbb99": {
            "id": "card_019228a2-b3ab-7aa1-91a8-7374870bbb99",
            "protoID": "179027_09D_C_BK063R_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "card_019228a2-b3ab-7aa1-91a8-7bc21cd2d171": {
            "id": "card_019228a2-b3ab-7aa1-91a8-7bc21cd2d171",
            "protoID": "179027_09D_O_BK010N_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "card_019228a2-b3ab-7aa1-91a8-81765bcbfe14": {
            "id": "card_019228a2-b3ab-7aa1-91a8-81765bcbfe14",
            "protoID": "179027_09D_O_BK010N_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "card_019228a2-b3ab-7aa1-91a8-8a264f3350ec": {
            "id": "card_019228a2-b3ab-7aa1-91a8-8a264f3350ec",
            "protoID": "179027_09D_U_BK163S_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "card_019228a2-b3ab-7aa1-91a8-96efcf686494": {
            "id": "card_019228a2-b3ab-7aa1-91a8-96efcf686494",
            "protoID": "179027_09D_U_BK163S_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "card_019228a2-b3ab-7aa1-91a8-989a32664b03": {
            "id": "card_019228a2-b3ab-7aa1-91a8-989a32664b03",
            "protoID": "179027_09D_U_BK163S_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "card_019228a2-b3ab-7aa1-91a8-a0f8743c2e04": {
            "id": "card_019228a2-b3ab-7aa1-91a8-a0f8743c2e04",
            "protoID": "179029_06C_C_BK045U_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "card_019228a2-b3ab-7aa1-91a8-aac33653e6da": {
            "id": "card_019228a2-b3ab-7aa1-91a8-aac33653e6da",
            "protoID": "179029_06C_C_BK045U_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "card_019228a2-b3ab-7aa1-91a8-b41fd2fd2ec4": {
            "id": "card_019228a2-b3ab-7aa1-91a8-b41fd2fd2ec4",
            "protoID": "179029_B3C_C_BK071N_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "card_019228a2-b3ab-7aa1-91a8-bad0822cb2b5": {
            "id": "card_019228a2-b3ab-7aa1-91a8-bad0822cb2b5",
            "protoID": "179029_B3C_C_BK071N_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "card_019228a2-b3ab-7aa1-91a8-c485642cfc42": {
            "id": "card_019228a2-b3ab-7aa1-91a8-c485642cfc42",
            "protoID": "179029_B3C_U_BK184N_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "card_019228a2-b3ab-7aa1-91a8-caf5db0f128e": {
            "id": "card_019228a2-b3ab-7aa1-91a8-caf5db0f128e",
            "protoID": "179029_B3C_U_BK184N_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "card_019228a2-b3ab-7aa1-91a8-d5b60ef1fa30": {
            "id": "card_019228a2-b3ab-7aa1-91a8-d5b60ef1fa30",
            "protoID": "179029_B3C_U_BK184N_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "card_019228a2-b3ab-7aa1-91a8-d8a7354f5f06": {
            "id": "card_019228a2-b3ab-7aa1-91a8-d8a7354f5f06",
            "protoID": "179029_B3C_U_BK185N_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "card_019228a2-b3ab-7aa1-91a8-e222a24e9b6c": {
            "id": "card_019228a2-b3ab-7aa1-91a8-e222a24e9b6c",
            "protoID": "179029_B3C_U_BK185N_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "card_019228a2-b3ab-7aa1-91a8-ef538aa6d139": {
            "id": "card_019228a2-b3ab-7aa1-91a8-ef538aa6d139",
            "protoID": "179030_11E_U_BK194S_2_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "card_019228a2-b3ab-7aa1-91a8-f0d990dd54ef": {
            "id": "card_019228a2-b3ab-7aa1-91a8-f0d990dd54ef",
            "protoID": "179030_11E_U_BK194S_2_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "card_019228a2-b3ab-7aa1-91a8-fe8cee8b7c27": {
            "id": "card_019228a2-b3ab-7aa1-91a8-fe8cee8b7c27",
            "protoID": "179030_11E_U_BK194S_2_black",
            "ownerID": "PlayerB",
            "isFaceDown": false
        },
        "card_019228a2-b3ab-7aa1-91a9-059c517e5046": {
            "id": "card_019228a2-b3ab-7aa1-91a9-059c517e5046",
            "protoID": "179901_B2B_C_BK005P_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "card_019228a2-b3ac-7aa1-91a9-0b52ccbc1678": {
            "id": "card_019228a2-b3ac-7aa1-91a9-0b52ccbc1678",
            "protoID": "179015_04B_O_BK010C_black",
            "ownerID": "PlayerA",
            "isRoll": true
        },
        "card_019228a2-b3ac-7aa1-91a9-14efae86910f": {
            "id": "card_019228a2-b3ac-7aa1-91a9-14efae86910f",
            "protoID": "179015_04B_O_BK010C_black",
            "ownerID": "PlayerA",
            "isRoll": false
        },
        "card_019228a2-b3ac-7aa1-91a9-1b6b9b5b67c7": {
            "id": "card_019228a2-b3ac-7aa1-91a9-1b6b9b5b67c7",
            "protoID": "179015_04B_U_BK058R_black",
            "ownerID": "PlayerA",
            "isRoll": false
        },
        "card_019228a2-b3ac-7aa1-91a9-24b93989ff69": {
            "id": "card_019228a2-b3ac-7aa1-91a9-24b93989ff69",
            "protoID": "179015_04B_U_BK058R_black",
            "ownerID": "PlayerA",
            "isRoll": false
        },
        "card_019228a2-b3ac-7aa1-91a9-2883a50decb7": {
            "id": "card_019228a2-b3ac-7aa1-91a9-2883a50decb7",
            "protoID": "179015_04B_U_BK059C_black",
            "ownerID": "PlayerA",
            "isRoll": false
        },
        "card_019228a2-b3ac-7aa1-91a9-356f51d15ec4": {
            "id": "card_019228a2-b3ac-7aa1-91a9-356f51d15ec4",
            "protoID": "179015_04B_U_BK059C_black",
            "ownerID": "PlayerA",
            "isRoll": false
        }
    },
    "effects": {},
    "table": {
        "cardStack": {
            "[\"PlayerA\",\"本国\"]": [
                "card_019228a2-b3ab-7aa1-91a7-5f1277f82568",
                "card_019228a2-b3ab-7aa1-91a7-3af5fb00fae0",
                "card_019228a2-b3ab-7aa1-91a6-ef5424a0245c",
                "card_019228a2-b3ab-7aa1-91a6-227a3254535a",
                "card_019228a2-b3ab-7aa1-91a6-52f2ce4ec146",
                "card_019228a2-b3ab-7aa1-91a6-4c629ee770d6",
                "card_019228a2-b3ab-7aa1-91a7-115043c50b31",
                "card_019228a2-b3ab-7aa1-91a6-fa728e1965a4",
                "card_019228a2-b3ab-7aa1-91a6-dfef78c47907",
                "card_019228a2-b3ab-7aa1-91a6-022854ebcdd1",
                "card_019228a2-b3ab-7aa1-91a6-30d63f2264f4",
                "card_019228a2-b3ab-7aa1-91a6-6f1c9336d949",
                "card_019228a2-b3ab-7aa1-91a6-ca6a9cde99d5",
                "card_019228a2-b3ab-7aa1-91a7-51f100e497c4",
                "card_019228a2-b3ab-7aa1-91a6-7e59e997453a",
                "card_019228a2-b3ab-7aa1-91a7-0831a57fbe97",
                "card_019228a2-b3ab-7aa1-91a6-672bffb80738",
                "card_019228a2-b3ab-7aa1-91a6-5d66b82e4443",
                "card_019228a2-b3ab-7aa1-91a5-ebc7e5743251",
                "card_019228a2-b3ab-7aa1-91a7-29839aaf997e",
                "card_019228a2-b3ab-7aa1-91a6-132a90b05b93",
                "card_019228a2-b3ab-7aa1-91a6-b37c0047c043",
                "card_019228a2-b3ab-7aa1-91a5-f70f99535374",
                "card_019228a2-b3ab-7aa1-91a6-9e57b426b5a1",
                "card_019228a2-b3ab-7aa1-91a7-20bccd29b9bc",
                "card_019228a2-b3ab-7aa1-91a6-f36e97d4ca06",
                "card_019228a2-b3ab-7aa1-91a6-81a7fed6df43",
                "card_019228a2-b3ab-7aa1-91a7-6230d83ecf37",
                "card_019228a2-b3ab-7aa1-91a6-2bce727dc7f6",
                "card_019228a2-b3ab-7aa1-91a6-0f14ae14af62",
                "card_019228a2-b3ab-7aa1-91a5-fa684dd64c1e",
                "card_019228a2-b3ab-7aa1-91a6-72c289d2d725",
                "card_019228a2-b3ab-7aa1-91a6-c5fe0999029a",
                "card_019228a2-b3ab-7aa1-91a6-3fb4c4a20d36",
                "card_019228a2-b3ab-7aa1-91a7-35cef9ffb804",
                "card_019228a2-b3ab-7aa1-91a7-460e372d6792",
                "card_019228a2-b3ab-7aa1-91a6-1dee2cccb07f",
                "card_019228a2-b3ab-7aa1-91a6-d51714bff97d",
                "card_019228a2-b3ab-7aa1-91a6-8d5f9fce3954",
                "card_019228a2-b3ab-7aa1-91a6-ad5531e4f63c",
                "card_019228a2-b3ab-7aa1-91a6-4057d6b95c1e",
                "card_019228a2-b3ab-7aa1-91a7-4c44a994ffed",
                "card_019228a2-b3ab-7aa1-91a6-a4318db101ed"
            ],
            "[\"PlayerB\",\"本国\"]": [
                "card_019228a2-b3ab-7aa1-91a8-d8a7354f5f06",
                "card_019228a2-b3ab-7aa1-91a8-7bc21cd2d171",
                "card_019228a2-b3ab-7aa1-91a7-89d2e19532a0",
                "card_019228a2-b3ab-7aa1-91a8-1dbb17140bb1",
                "card_019228a2-b3ab-7aa1-91a8-4c7777197941",
                "card_019228a2-b3ab-7aa1-91a7-ef4510b86844",
                "card_019228a2-b3ab-7aa1-91a8-81765bcbfe14",
                "card_019228a2-b3ab-7aa1-91a8-7374870bbb99",
                "card_019228a2-b3ab-7aa1-91a7-aa1658dfe792",
                "card_019228a2-b3ab-7aa1-91a8-54530aa3135e",
                "card_019228a2-b3ab-7aa1-91a7-780cd74645c5",
                "card_019228a2-b3ab-7aa1-91a8-069e5295d3e5",
                "card_019228a2-b3ab-7aa1-91a8-e222a24e9b6c",
                "card_019228a2-b3ab-7aa1-91a8-657e6cef2726",
                "card_019228a2-b3ab-7aa1-91a8-353d386890e5",
                "card_019228a2-b3ab-7aa1-91a7-f97c0b32257b",
                "card_019228a2-b3ab-7aa1-91a7-ba88cb304932",
                "card_019228a2-b3ab-7aa1-91a8-0e6175a9654c",
                "card_019228a2-b3ab-7aa1-91a8-f0d990dd54ef",
                "card_019228a2-b3ab-7aa1-91a8-8a264f3350ec",
                "card_019228a2-b3ab-7aa1-91a7-a65c92c8212d",
                "card_019228a2-b3ab-7aa1-91a8-26425b84bf2a",
                "card_019228a2-b3ab-7aa1-91a8-438ca8e780be",
                "card_019228a2-b3ab-7aa1-91a7-b3b355f9cbdb",
                "card_019228a2-b3ab-7aa1-91a7-cc42147ca8e3",
                "card_019228a2-b3ab-7aa1-91a8-2bbad2748a5c",
                "card_019228a2-b3ab-7aa1-91a8-b41fd2fd2ec4",
                "card_019228a2-b3ab-7aa1-91a8-989a32664b03",
                "card_019228a2-b3ab-7aa1-91a7-86ba3d5ea989",
                "card_019228a2-b3ab-7aa1-91a9-059c517e5046",
                "card_019228a2-b3ab-7aa1-91a7-d4241a33a5ab",
                "card_019228a2-b3ab-7aa1-91a7-f0e8919452e5",
                "card_019228a2-b3ab-7aa1-91a8-d5b60ef1fa30",
                "card_019228a2-b3ab-7aa1-91a8-10baa876e6cb",
                "card_019228a2-b3ab-7aa1-91a7-9055f643914c",
                "card_019228a2-b3ab-7aa1-91a8-c485642cfc42",
                "card_019228a2-b3ab-7aa1-91a8-3c6d374831b8",
                "card_019228a2-b3ab-7aa1-91a8-ef538aa6d139",
                "card_019228a2-b3ab-7aa1-91a7-c0e378553005",
                "card_019228a2-b3ab-7aa1-91a8-caf5db0f128e",
                "card_019228a2-b3ab-7aa1-91a7-9ccc05945f11",
                "card_019228a2-b3ab-7aa1-91a7-da24043b398f",
                "card_019228a2-b3ab-7aa1-91a8-aac33653e6da",
                "card_019228a2-b3ab-7aa1-91a8-a0f8743c2e04"
            ],
            "[\"PlayerA\",\"Gゾーン\"]": [
                "card_019228a2-b3ac-7aa1-91a9-0b52ccbc1678",
                "card_019228a2-b3ac-7aa1-91a9-14efae86910f",
                "card_019228a2-b3ac-7aa1-91a9-1b6b9b5b67c7",
                "card_019228a2-b3ac-7aa1-91a9-24b93989ff69",
                "card_019228a2-b3ac-7aa1-91a9-2883a50decb7",
                "card_019228a2-b3ac-7aa1-91a9-356f51d15ec4",
                "card_019228a2-b3ab-7aa1-91a6-bb70aed30e97"
            ],
            "[\"PlayerA\",\"手札\"]": [
                "card_019228a2-b3ab-7aa1-91a6-e0d7ad289950",
                "card_019228a2-b3ab-7aa1-91a7-07cdb0200b42",
                "card_019228a2-b3ab-7aa1-91a7-6ec3adb08642",
                "card_019228a2-b3ab-7aa1-91a7-196333ac1eaa",
                "card_019228a2-b3ab-7aa1-91a7-77a446c6f951"
            ],
            "[\"PlayerB\",\"手札\"]": [
                "card_019228a2-b3ab-7aa1-91a8-96efcf686494",
                "card_019228a2-b3ab-7aa1-91a8-bad0822cb2b5",
                "card_019228a2-b3ab-7aa1-91a8-6c879ad38bb0",
                "card_019228a2-b3ab-7aa1-91a8-5a60314f7e0e"
            ],
            "[\"PlayerA\",\"プレイされているカード\"]": [],
            "[\"PlayerA\",\"配備エリア\"]": [
                "card_019228a2-b3ab-7aa1-91a6-916304bdc510"
            ],
            "[\"PlayerB\",\"プレイされているカード\"]": [
                "card_019228a2-b3ab-7aa1-91a8-fe8cee8b7c27"
            ],
            "[\"PlayerB\",\"Gゾーン\"]": [
                "card_019228a2-b3ab-7aa1-91a7-e26bc87ffcd1"
            ]
        }
    },
    "chips": {},
    "chipProtos": {},
    "itemStates": {
        "card_019228a2-b3ab-7aa1-91a6-916304bdc510": {
            "id": "card_019228a2-b3ab-7aa1-91a6-916304bdc510",
            "damage": 0,
            "destroyReason": null,
            "flags": {},
            "tips": {},
            "globalEffects": {},
            "varNamesRemoveOnTurnEnd": {},
            "isFirstTurn": true,
            "textIdsUseThisCut": {}
        },
        "card_019228a2-b3ab-7aa1-91a7-07cdb0200b42": {
            "id": "card_019228a2-b3ab-7aa1-91a7-07cdb0200b42",
            "damage": 0,
            "destroyReason": null,
            "flags": {},
            "tips": {
                "0[黒]": {
                    "title": [
                        "カード",
                        [
                            [
                                "card_019228a2-b3ac-7aa1-91a9-14efae86910f",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "card_019228a2-b3ac-7aa1-91a9-1b6b9b5b67c7",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "card_019228a2-b3ac-7aa1-91a9-24b93989ff69",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "card_019228a2-b3ac-7aa1-91a9-2883a50decb7",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "card_019228a2-b3ac-7aa1-91a9-356f51d15ec4",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "card_019228a2-b3ab-7aa1-91a6-bb70aed30e97",
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
                                "card_019228a2-b3ac-7aa1-91a9-14efae86910f",
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
                "1[黒]": {
                    "title": [
                        "カード",
                        [
                            [
                                "card_019228a2-b3ac-7aa1-91a9-14efae86910f",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "card_019228a2-b3ac-7aa1-91a9-1b6b9b5b67c7",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "card_019228a2-b3ac-7aa1-91a9-24b93989ff69",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "card_019228a2-b3ac-7aa1-91a9-2883a50decb7",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "card_019228a2-b3ac-7aa1-91a9-356f51d15ec4",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "card_019228a2-b3ab-7aa1-91a6-bb70aed30e97",
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
                                "card_019228a2-b3ac-7aa1-91a9-14efae86910f",
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
                "2[黒]": {
                    "title": [
                        "カード",
                        [
                            [
                                "card_019228a2-b3ac-7aa1-91a9-14efae86910f",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "card_019228a2-b3ac-7aa1-91a9-1b6b9b5b67c7",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "card_019228a2-b3ac-7aa1-91a9-24b93989ff69",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "card_019228a2-b3ac-7aa1-91a9-2883a50decb7",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "card_019228a2-b3ac-7aa1-91a9-356f51d15ec4",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "card_019228a2-b3ab-7aa1-91a6-bb70aed30e97",
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
                                "card_019228a2-b3ac-7aa1-91a9-14efae86910f",
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
            "playGCount": 1,
            "confirmPhase": false
        },
        "PlayerB": {
            "id": "PlayerB",
            "turn": 0,
            "playGCount": 1,
            "confirmPhase": false
        }
    },
    "activePlayerID": "PlayerA",
    "immediateEffect": [],
    "stackEffect": [],
    "isBattle": {},
    "coins": {},
    "coinId2cardId": {},
    "globalEffectPool": {},
    "messages": [],
    "messagesCurrentEffect": null,
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
    },
    "commandEffectTips": [
        {
            "effect": {
                "id": "getPlayCardEffects_card_019228a2-b3ab-7aa1-91a6-e0d7ad289950",
                "reason": [
                    "PlayCard",
                    "PlayerA",
                    "card_019228a2-b3ab-7aa1-91a6-e0d7ad289950"
                ],
                "description": "從手中即將出牌, 出牌後會產生場出的效果",
                "text": {
                    "id": "getPlayCardEffects_text_card_019228a2-b3ab-7aa1-91a6-e0d7ad289950",
                    "title": [
                        "使用型",
                        [
                            "配備フェイズ"
                        ]
                    ],
                    "description": "從手中即將出牌, 出牌後會產生場出的效果",
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
                        },
                        "2[黒]": {
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
                                        "2[黒]"
                                    ]
                                }
                            ]
                        }
                    },
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect2, { DefineFn, GameStateFn, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn.EffectFn.getCardID(effect2);\n                const prototype2 = GameStateFn.getItemPrototype(ctx3, cardId2);\n                const from = GameStateFn.getItemBaSyou(ctx3, cardId2);\n                ctx3 = GameStateFn.doItemMove(ctx3, DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u3044\\u308B\\u30AB\\u30FC\\u30C9\"), [cardId2, from]);\n                if (prototype2.category == \"\\u30E6\\u30CB\\u30C3\\u30C8\") {\n                  return GameStateFn.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn.EffectFn.getPlayerID(effect2), DefineFn.EffectFn.getCardID(effect2)],\n                    description: effect2.text.description,\n                    text: {\n                      id: effect2.text.id,\n                      description: effect2.text.description,\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect3, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                                const cardId3 = DefineFn2.EffectFn.getCardID(effect3);\n                                const from2 = GameStateFn2.getItemBaSyou(ctx4, cardId3);\n                                const to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\");\n                                ctx4 = GameStateFn2.moveItem(ctx4, to, [cardId3, from2]);\n                                const hasHigh = GameStateFn2.getCardHasSpeicalEffect(ctx4, [\"\\u6226\\u95D8\\u914D\\u5099\"], cardId3);\n                                const hasPS = GameStateFn2.getCardHasSpeicalEffect(ctx4, [\"PS\\u88C5\\u7532\"], cardId3);\n                                const isNoNeedRoll = hasHigh || hasPS;\n                                const isRoll = isNoNeedRoll == false;\n                                ctx4 = GameStateFn2.setItemIsRoll(ctx4, isRoll, [cardId3, to]);\n                                ctx4 = GameStateFn2.triggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                                return ctx4;\n                              }.toString()\n                            }\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30AD\\u30E3\\u30E9\\u30AF\\u30BF\\u30FC\" || prototype2.category == \"\\u30AA\\u30DA\\u30EC\\u30FC\\u30B7\\u30E7\\u30F3(\\u30E6\\u30CB\\u30C3\\u30C8)\") {\n                  return GameStateFn.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn.EffectFn.getPlayerID(effect2), DefineFn.EffectFn.getCardID(effect2)],\n                    description: effect2.text.description,\n                    text: {\n                      id: effect2.text.id,\n                      description: effect2.text.description,\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect3, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                                const cardId3 = DefineFn2.EffectFn.getCardID(effect3);\n                                const pairs = GameStateFn2.getCardTipStrBaSyouPairs(ctx4, \"\\u4E00\\u500B\\u81EA\\u8ECD\\u6A5F\\u9AD4\", cardId3);\n                                const [targetCardId, targetBasyou] = pairs[0];\n                                const from2 = GameStateFn2.getItemBaSyou(ctx4, cardId3);\n                                const to = targetBasyou;\n                                ctx4 = GameStateFn2.moveItem(ctx4, to, [cardId3, from2]);\n                                ctx4 = GameStateFn2.setSetGroupParent(ctx4, targetCardId, cardId3);\n                                ctx4 = GameStateFn2.triggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                                ctx4 = GameStateFn2.triggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u30BB\\u30C3\\u30C8\\u3055\\u308C\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                                return ctx4;\n                              }.toString()\n                            }\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30B3\\u30DE\\u30F3\\u30C9\") {\n                  return GameStateFn.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn.EffectFn.getPlayerID(effect2), DefineFn.EffectFn.getCardID(effect2)],\n                    description: effect2.text.description,\n                    text: {\n                      id: prototype2.commandText?.id || ToolFn2.getUUID(\"getPlayCardEffects\"),\n                      description: prototype2.commandText?.description || \"unknown\",\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect3, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                                const cardId3 = DefineFn2.EffectFn.getCardID(effect3);\n                                const from2 = GameStateFn2.getItemBaSyou(ctx4, cardId3);\n                                const to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u30B8\\u30E3\\u30F3\\u30AF\\u30E4\\u30FC\\u30C9\");\n                                ctx4 = GameStateFn2.moveItem(ctx4, to, [cardId3, from2]);\n                                ctx4 = GameStateFn2.triggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                                return ctx4;\n                              }.toString()\n                            },\n                            ...prototype2.commandText?.logicTreeActions?.[0].actions || []\n                          ]\n                        },\n                        ...prototype2.commandText?.logicTreeActions?.slice(1) || []\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30B0\\u30E9\\u30D5\\u30A3\\u30C3\\u30AF\") {\n                  const cardId3 = DefineFn.EffectFn.getCardID(effect2);\n                  const from2 = GameStateFn.getItemBaSyou(ctx3, cardId3);\n                  const to = DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"G\\u30BE\\u30FC\\u30F3\");\n                  ctx3 = GameStateFn.doItemMove(ctx3, to, [cardId3, from2]);\n                  ctx3 = GameStateFn.triggerEvent(ctx3, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                  return ctx3;\n                }\n                if (prototype2.category == \"\\u30AA\\u30DA\\u30EC\\u30FC\\u30B7\\u30E7\\u30F3\") {\n                  const cardId3 = DefineFn.EffectFn.getCardID(effect2);\n                  const from2 = GameStateFn.getItemBaSyou(ctx3, cardId3);\n                  const to = DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\");\n                  ctx3 = GameStateFn.doItemMove(ctx3, to, [cardId3, from2]);\n                  ctx3 = GameStateFn.triggerEvent(ctx3, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                  return ctx3;\n                }\n                if (prototype2.category == \"ACE\") {\n                  throw new Error(`not support category: ${prototype2.category}`);\n                }\n                return ctx3;\n              }"
                                }
                            ]
                        }
                    ]
                }
            },
            "logicID": 0,
            "logicSubID": 0,
            "tipOrErrors": [
                {
                    "conditionKey": "合計国力〔x〕",
                    "tip": null,
                    "errors": []
                },
                {
                    "conditionKey": "0[黒]",
                    "tip": {
                        "title": [
                            "カード",
                            [
                                [
                                    "card_019228a2-b3ac-7aa1-91a9-14efae86910f",
                                    {
                                        "id": "AbsoluteBaSyou",
                                        "value": [
                                            "PlayerA",
                                            "Gゾーン"
                                        ]
                                    }
                                ],
                                [
                                    "card_019228a2-b3ac-7aa1-91a9-1b6b9b5b67c7",
                                    {
                                        "id": "AbsoluteBaSyou",
                                        "value": [
                                            "PlayerA",
                                            "Gゾーン"
                                        ]
                                    }
                                ],
                                [
                                    "card_019228a2-b3ac-7aa1-91a9-24b93989ff69",
                                    {
                                        "id": "AbsoluteBaSyou",
                                        "value": [
                                            "PlayerA",
                                            "Gゾーン"
                                        ]
                                    }
                                ],
                                [
                                    "card_019228a2-b3ac-7aa1-91a9-2883a50decb7",
                                    {
                                        "id": "AbsoluteBaSyou",
                                        "value": [
                                            "PlayerA",
                                            "Gゾーン"
                                        ]
                                    }
                                ],
                                [
                                    "card_019228a2-b3ac-7aa1-91a9-356f51d15ec4",
                                    {
                                        "id": "AbsoluteBaSyou",
                                        "value": [
                                            "PlayerA",
                                            "Gゾーン"
                                        ]
                                    }
                                ],
                                [
                                    "card_019228a2-b3ab-7aa1-91a6-bb70aed30e97",
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
                                    "card_019228a2-b3ac-7aa1-91a9-14efae86910f",
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
                    "conditionKey": "1[黒]",
                    "tip": {
                        "title": [
                            "カード",
                            [
                                [
                                    "card_019228a2-b3ac-7aa1-91a9-1b6b9b5b67c7",
                                    {
                                        "id": "AbsoluteBaSyou",
                                        "value": [
                                            "PlayerA",
                                            "Gゾーン"
                                        ]
                                    }
                                ],
                                [
                                    "card_019228a2-b3ac-7aa1-91a9-24b93989ff69",
                                    {
                                        "id": "AbsoluteBaSyou",
                                        "value": [
                                            "PlayerA",
                                            "Gゾーン"
                                        ]
                                    }
                                ],
                                [
                                    "card_019228a2-b3ac-7aa1-91a9-2883a50decb7",
                                    {
                                        "id": "AbsoluteBaSyou",
                                        "value": [
                                            "PlayerA",
                                            "Gゾーン"
                                        ]
                                    }
                                ],
                                [
                                    "card_019228a2-b3ac-7aa1-91a9-356f51d15ec4",
                                    {
                                        "id": "AbsoluteBaSyou",
                                        "value": [
                                            "PlayerA",
                                            "Gゾーン"
                                        ]
                                    }
                                ],
                                [
                                    "card_019228a2-b3ab-7aa1-91a6-bb70aed30e97",
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
                                    "card_019228a2-b3ac-7aa1-91a9-1b6b9b5b67c7",
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
                    "conditionKey": "2[黒]",
                    "tip": {
                        "title": [
                            "カード",
                            [
                                [
                                    "card_019228a2-b3ac-7aa1-91a9-24b93989ff69",
                                    {
                                        "id": "AbsoluteBaSyou",
                                        "value": [
                                            "PlayerA",
                                            "Gゾーン"
                                        ]
                                    }
                                ],
                                [
                                    "card_019228a2-b3ac-7aa1-91a9-2883a50decb7",
                                    {
                                        "id": "AbsoluteBaSyou",
                                        "value": [
                                            "PlayerA",
                                            "Gゾーン"
                                        ]
                                    }
                                ],
                                [
                                    "card_019228a2-b3ac-7aa1-91a9-356f51d15ec4",
                                    {
                                        "id": "AbsoluteBaSyou",
                                        "value": [
                                            "PlayerA",
                                            "Gゾーン"
                                        ]
                                    }
                                ],
                                [
                                    "card_019228a2-b3ab-7aa1-91a6-bb70aed30e97",
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
                                    "card_019228a2-b3ac-7aa1-91a9-24b93989ff69",
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
            "effect": {
                "id": "getPlayCardEffects_card_019228a2-b3ab-7aa1-91a7-07cdb0200b42",
                "reason": [
                    "PlayCard",
                    "PlayerA",
                    "card_019228a2-b3ab-7aa1-91a7-07cdb0200b42"
                ],
                "description": "從手中即將出牌, 出牌後會產生場出的效果",
                "text": {
                    "id": "getPlayCardEffects_text_card_019228a2-b3ab-7aa1-91a7-07cdb0200b42",
                    "title": [
                        "使用型",
                        [
                            "配備フェイズ"
                        ]
                    ],
                    "description": "從手中即將出牌, 出牌後會產生場出的效果",
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
                        },
                        "2[黒]": {
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
                                        "2[黒]"
                                    ]
                                }
                            ]
                        }
                    },
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect2, { DefineFn, GameStateFn, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn.EffectFn.getCardID(effect2);\n                const prototype2 = GameStateFn.getItemPrototype(ctx3, cardId2);\n                const from = GameStateFn.getItemBaSyou(ctx3, cardId2);\n                ctx3 = GameStateFn.doItemMove(ctx3, DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u3044\\u308B\\u30AB\\u30FC\\u30C9\"), [cardId2, from]);\n                if (prototype2.category == \"\\u30E6\\u30CB\\u30C3\\u30C8\") {\n                  return GameStateFn.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn.EffectFn.getPlayerID(effect2), DefineFn.EffectFn.getCardID(effect2)],\n                    description: effect2.text.description,\n                    text: {\n                      id: effect2.text.id,\n                      description: effect2.text.description,\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect3, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                                const cardId3 = DefineFn2.EffectFn.getCardID(effect3);\n                                const from2 = GameStateFn2.getItemBaSyou(ctx4, cardId3);\n                                const to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\");\n                                ctx4 = GameStateFn2.moveItem(ctx4, to, [cardId3, from2]);\n                                const hasHigh = GameStateFn2.getCardHasSpeicalEffect(ctx4, [\"\\u6226\\u95D8\\u914D\\u5099\"], cardId3);\n                                const hasPS = GameStateFn2.getCardHasSpeicalEffect(ctx4, [\"PS\\u88C5\\u7532\"], cardId3);\n                                const isNoNeedRoll = hasHigh || hasPS;\n                                const isRoll = isNoNeedRoll == false;\n                                ctx4 = GameStateFn2.setItemIsRoll(ctx4, isRoll, [cardId3, to]);\n                                ctx4 = GameStateFn2.triggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                                return ctx4;\n                              }.toString()\n                            }\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30AD\\u30E3\\u30E9\\u30AF\\u30BF\\u30FC\" || prototype2.category == \"\\u30AA\\u30DA\\u30EC\\u30FC\\u30B7\\u30E7\\u30F3(\\u30E6\\u30CB\\u30C3\\u30C8)\") {\n                  return GameStateFn.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn.EffectFn.getPlayerID(effect2), DefineFn.EffectFn.getCardID(effect2)],\n                    description: effect2.text.description,\n                    text: {\n                      id: effect2.text.id,\n                      description: effect2.text.description,\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect3, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                                const cardId3 = DefineFn2.EffectFn.getCardID(effect3);\n                                const pairs = GameStateFn2.getCardTipStrBaSyouPairs(ctx4, \"\\u4E00\\u500B\\u81EA\\u8ECD\\u6A5F\\u9AD4\", cardId3);\n                                const [targetCardId, targetBasyou] = pairs[0];\n                                const from2 = GameStateFn2.getItemBaSyou(ctx4, cardId3);\n                                const to = targetBasyou;\n                                ctx4 = GameStateFn2.moveItem(ctx4, to, [cardId3, from2]);\n                                ctx4 = GameStateFn2.setSetGroupParent(ctx4, targetCardId, cardId3);\n                                ctx4 = GameStateFn2.triggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                                ctx4 = GameStateFn2.triggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u30BB\\u30C3\\u30C8\\u3055\\u308C\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                                return ctx4;\n                              }.toString()\n                            }\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30B3\\u30DE\\u30F3\\u30C9\") {\n                  return GameStateFn.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn.EffectFn.getPlayerID(effect2), DefineFn.EffectFn.getCardID(effect2)],\n                    description: effect2.text.description,\n                    text: {\n                      id: prototype2.commandText?.id || ToolFn2.getUUID(\"getPlayCardEffects\"),\n                      description: prototype2.commandText?.description || \"unknown\",\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect3, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                                const cardId3 = DefineFn2.EffectFn.getCardID(effect3);\n                                const from2 = GameStateFn2.getItemBaSyou(ctx4, cardId3);\n                                const to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u30B8\\u30E3\\u30F3\\u30AF\\u30E4\\u30FC\\u30C9\");\n                                ctx4 = GameStateFn2.moveItem(ctx4, to, [cardId3, from2]);\n                                ctx4 = GameStateFn2.triggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                                return ctx4;\n                              }.toString()\n                            },\n                            ...prototype2.commandText?.logicTreeActions?.[0].actions || []\n                          ]\n                        },\n                        ...prototype2.commandText?.logicTreeActions?.slice(1) || []\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30B0\\u30E9\\u30D5\\u30A3\\u30C3\\u30AF\") {\n                  const cardId3 = DefineFn.EffectFn.getCardID(effect2);\n                  const from2 = GameStateFn.getItemBaSyou(ctx3, cardId3);\n                  const to = DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"G\\u30BE\\u30FC\\u30F3\");\n                  ctx3 = GameStateFn.doItemMove(ctx3, to, [cardId3, from2]);\n                  ctx3 = GameStateFn.triggerEvent(ctx3, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                  return ctx3;\n                }\n                if (prototype2.category == \"\\u30AA\\u30DA\\u30EC\\u30FC\\u30B7\\u30E7\\u30F3\") {\n                  const cardId3 = DefineFn.EffectFn.getCardID(effect2);\n                  const from2 = GameStateFn.getItemBaSyou(ctx3, cardId3);\n                  const to = DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\");\n                  ctx3 = GameStateFn.doItemMove(ctx3, to, [cardId3, from2]);\n                  ctx3 = GameStateFn.triggerEvent(ctx3, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                  return ctx3;\n                }\n                if (prototype2.category == \"ACE\") {\n                  throw new Error(`not support category: ${prototype2.category}`);\n                }\n                return ctx3;\n              }"
                                }
                            ]
                        }
                    ]
                }
            },
            "logicID": 0,
            "logicSubID": 0,
            "tipOrErrors": [
                {
                    "conditionKey": "合計国力〔x〕",
                    "tip": null,
                    "errors": []
                },
                {
                    "conditionKey": "0[黒]",
                    "tip": {
                        "title": [
                            "カード",
                            [
                                [
                                    "card_019228a2-b3ac-7aa1-91a9-14efae86910f",
                                    {
                                        "id": "AbsoluteBaSyou",
                                        "value": [
                                            "PlayerA",
                                            "Gゾーン"
                                        ]
                                    }
                                ],
                                [
                                    "card_019228a2-b3ac-7aa1-91a9-1b6b9b5b67c7",
                                    {
                                        "id": "AbsoluteBaSyou",
                                        "value": [
                                            "PlayerA",
                                            "Gゾーン"
                                        ]
                                    }
                                ],
                                [
                                    "card_019228a2-b3ac-7aa1-91a9-24b93989ff69",
                                    {
                                        "id": "AbsoluteBaSyou",
                                        "value": [
                                            "PlayerA",
                                            "Gゾーン"
                                        ]
                                    }
                                ],
                                [
                                    "card_019228a2-b3ac-7aa1-91a9-2883a50decb7",
                                    {
                                        "id": "AbsoluteBaSyou",
                                        "value": [
                                            "PlayerA",
                                            "Gゾーン"
                                        ]
                                    }
                                ],
                                [
                                    "card_019228a2-b3ac-7aa1-91a9-356f51d15ec4",
                                    {
                                        "id": "AbsoluteBaSyou",
                                        "value": [
                                            "PlayerA",
                                            "Gゾーン"
                                        ]
                                    }
                                ],
                                [
                                    "card_019228a2-b3ab-7aa1-91a6-bb70aed30e97",
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
                                    "card_019228a2-b3ac-7aa1-91a9-14efae86910f",
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
                    "conditionKey": "1[黒]",
                    "tip": {
                        "title": [
                            "カード",
                            [
                                [
                                    "card_019228a2-b3ac-7aa1-91a9-1b6b9b5b67c7",
                                    {
                                        "id": "AbsoluteBaSyou",
                                        "value": [
                                            "PlayerA",
                                            "Gゾーン"
                                        ]
                                    }
                                ],
                                [
                                    "card_019228a2-b3ac-7aa1-91a9-24b93989ff69",
                                    {
                                        "id": "AbsoluteBaSyou",
                                        "value": [
                                            "PlayerA",
                                            "Gゾーン"
                                        ]
                                    }
                                ],
                                [
                                    "card_019228a2-b3ac-7aa1-91a9-2883a50decb7",
                                    {
                                        "id": "AbsoluteBaSyou",
                                        "value": [
                                            "PlayerA",
                                            "Gゾーン"
                                        ]
                                    }
                                ],
                                [
                                    "card_019228a2-b3ac-7aa1-91a9-356f51d15ec4",
                                    {
                                        "id": "AbsoluteBaSyou",
                                        "value": [
                                            "PlayerA",
                                            "Gゾーン"
                                        ]
                                    }
                                ],
                                [
                                    "card_019228a2-b3ab-7aa1-91a6-bb70aed30e97",
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
                                    "card_019228a2-b3ac-7aa1-91a9-1b6b9b5b67c7",
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
                    "conditionKey": "2[黒]",
                    "tip": {
                        "title": [
                            "カード",
                            [
                                [
                                    "card_019228a2-b3ac-7aa1-91a9-24b93989ff69",
                                    {
                                        "id": "AbsoluteBaSyou",
                                        "value": [
                                            "PlayerA",
                                            "Gゾーン"
                                        ]
                                    }
                                ],
                                [
                                    "card_019228a2-b3ac-7aa1-91a9-2883a50decb7",
                                    {
                                        "id": "AbsoluteBaSyou",
                                        "value": [
                                            "PlayerA",
                                            "Gゾーン"
                                        ]
                                    }
                                ],
                                [
                                    "card_019228a2-b3ac-7aa1-91a9-356f51d15ec4",
                                    {
                                        "id": "AbsoluteBaSyou",
                                        "value": [
                                            "PlayerA",
                                            "Gゾーン"
                                        ]
                                    }
                                ],
                                [
                                    "card_019228a2-b3ab-7aa1-91a6-bb70aed30e97",
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
                                    "card_019228a2-b3ac-7aa1-91a9-24b93989ff69",
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
            "effect": {
                "id": "getPlayCardEffects_card_019228a2-b3ab-7aa1-91a7-6ec3adb08642",
                "reason": [
                    "PlayCard",
                    "PlayerA",
                    "card_019228a2-b3ab-7aa1-91a7-6ec3adb08642"
                ],
                "description": "從手中即將出牌, 出牌後會產生場出的效果",
                "text": {
                    "id": "getPlayCardEffects_text_card_019228a2-b3ab-7aa1-91a7-6ec3adb08642",
                    "title": [
                        "使用型",
                        [
                            "配備フェイズ"
                        ]
                    ],
                    "description": "從手中即將出牌, 出牌後會產生場出的效果",
                    "conditions": {
                        "合計国力〔x〕": {
                            "actions": [
                                {
                                    "title": [
                                        "合計国力〔x〕",
                                        0
                                    ]
                                }
                            ]
                        }
                    },
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect2, { DefineFn, GameStateFn, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn.EffectFn.getCardID(effect2);\n                const prototype2 = GameStateFn.getItemPrototype(ctx3, cardId2);\n                const from = GameStateFn.getItemBaSyou(ctx3, cardId2);\n                ctx3 = GameStateFn.doItemMove(ctx3, DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u3044\\u308B\\u30AB\\u30FC\\u30C9\"), [cardId2, from]);\n                if (prototype2.category == \"\\u30E6\\u30CB\\u30C3\\u30C8\") {\n                  return GameStateFn.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn.EffectFn.getPlayerID(effect2), DefineFn.EffectFn.getCardID(effect2)],\n                    description: effect2.text.description,\n                    text: {\n                      id: effect2.text.id,\n                      description: effect2.text.description,\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect3, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                                const cardId3 = DefineFn2.EffectFn.getCardID(effect3);\n                                const from2 = GameStateFn2.getItemBaSyou(ctx4, cardId3);\n                                const to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\");\n                                ctx4 = GameStateFn2.moveItem(ctx4, to, [cardId3, from2]);\n                                const hasHigh = GameStateFn2.getCardHasSpeicalEffect(ctx4, [\"\\u6226\\u95D8\\u914D\\u5099\"], cardId3);\n                                const hasPS = GameStateFn2.getCardHasSpeicalEffect(ctx4, [\"PS\\u88C5\\u7532\"], cardId3);\n                                const isNoNeedRoll = hasHigh || hasPS;\n                                const isRoll = isNoNeedRoll == false;\n                                ctx4 = GameStateFn2.setItemIsRoll(ctx4, isRoll, [cardId3, to]);\n                                ctx4 = GameStateFn2.triggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                                return ctx4;\n                              }.toString()\n                            }\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30AD\\u30E3\\u30E9\\u30AF\\u30BF\\u30FC\" || prototype2.category == \"\\u30AA\\u30DA\\u30EC\\u30FC\\u30B7\\u30E7\\u30F3(\\u30E6\\u30CB\\u30C3\\u30C8)\") {\n                  return GameStateFn.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn.EffectFn.getPlayerID(effect2), DefineFn.EffectFn.getCardID(effect2)],\n                    description: effect2.text.description,\n                    text: {\n                      id: effect2.text.id,\n                      description: effect2.text.description,\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect3, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                                const cardId3 = DefineFn2.EffectFn.getCardID(effect3);\n                                const pairs = GameStateFn2.getCardTipStrBaSyouPairs(ctx4, \"\\u4E00\\u500B\\u81EA\\u8ECD\\u6A5F\\u9AD4\", cardId3);\n                                const [targetCardId, targetBasyou] = pairs[0];\n                                const from2 = GameStateFn2.getItemBaSyou(ctx4, cardId3);\n                                const to = targetBasyou;\n                                ctx4 = GameStateFn2.moveItem(ctx4, to, [cardId3, from2]);\n                                ctx4 = GameStateFn2.setSetGroupParent(ctx4, targetCardId, cardId3);\n                                ctx4 = GameStateFn2.triggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                                ctx4 = GameStateFn2.triggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u30BB\\u30C3\\u30C8\\u3055\\u308C\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                                return ctx4;\n                              }.toString()\n                            }\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30B3\\u30DE\\u30F3\\u30C9\") {\n                  return GameStateFn.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn.EffectFn.getPlayerID(effect2), DefineFn.EffectFn.getCardID(effect2)],\n                    description: effect2.text.description,\n                    text: {\n                      id: prototype2.commandText?.id || ToolFn2.getUUID(\"getPlayCardEffects\"),\n                      description: prototype2.commandText?.description || \"unknown\",\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect3, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                                const cardId3 = DefineFn2.EffectFn.getCardID(effect3);\n                                const from2 = GameStateFn2.getItemBaSyou(ctx4, cardId3);\n                                const to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u30B8\\u30E3\\u30F3\\u30AF\\u30E4\\u30FC\\u30C9\");\n                                ctx4 = GameStateFn2.moveItem(ctx4, to, [cardId3, from2]);\n                                ctx4 = GameStateFn2.triggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                                return ctx4;\n                              }.toString()\n                            },\n                            ...prototype2.commandText?.logicTreeActions?.[0].actions || []\n                          ]\n                        },\n                        ...prototype2.commandText?.logicTreeActions?.slice(1) || []\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30B0\\u30E9\\u30D5\\u30A3\\u30C3\\u30AF\") {\n                  const cardId3 = DefineFn.EffectFn.getCardID(effect2);\n                  const from2 = GameStateFn.getItemBaSyou(ctx3, cardId3);\n                  const to = DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"G\\u30BE\\u30FC\\u30F3\");\n                  ctx3 = GameStateFn.doItemMove(ctx3, to, [cardId3, from2]);\n                  ctx3 = GameStateFn.triggerEvent(ctx3, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                  return ctx3;\n                }\n                if (prototype2.category == \"\\u30AA\\u30DA\\u30EC\\u30FC\\u30B7\\u30E7\\u30F3\") {\n                  const cardId3 = DefineFn.EffectFn.getCardID(effect2);\n                  const from2 = GameStateFn.getItemBaSyou(ctx3, cardId3);\n                  const to = DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\");\n                  ctx3 = GameStateFn.doItemMove(ctx3, to, [cardId3, from2]);\n                  ctx3 = GameStateFn.triggerEvent(ctx3, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                  return ctx3;\n                }\n                if (prototype2.category == \"ACE\") {\n                  throw new Error(`not support category: ${prototype2.category}`);\n                }\n                return ctx3;\n              }"
                                }
                            ]
                        }
                    ]
                }
            },
            "logicID": 0,
            "logicSubID": 0,
            "tipOrErrors": [
                {
                    "conditionKey": "合計国力〔x〕",
                    "tip": null,
                    "errors": []
                }
            ]
        },
        {
            "effect": {
                "id": "getPlayCardEffects_card_019228a2-b3ab-7aa1-91a7-196333ac1eaa",
                "reason": [
                    "PlayCard",
                    "PlayerA",
                    "card_019228a2-b3ab-7aa1-91a7-196333ac1eaa"
                ],
                "description": "從手中即將出牌, 出牌後會產生場出的效果",
                "text": {
                    "id": "getPlayCardEffects_text_card_019228a2-b3ab-7aa1-91a7-196333ac1eaa",
                    "title": [
                        "使用型",
                        [
                            "配備フェイズ"
                        ]
                    ],
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
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect2, { DefineFn, GameStateFn, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn.EffectFn.getCardID(effect2);\n                const prototype2 = GameStateFn.getItemPrototype(ctx3, cardId2);\n                const from = GameStateFn.getItemBaSyou(ctx3, cardId2);\n                ctx3 = GameStateFn.doItemMove(ctx3, DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u3044\\u308B\\u30AB\\u30FC\\u30C9\"), [cardId2, from]);\n                if (prototype2.category == \"\\u30E6\\u30CB\\u30C3\\u30C8\") {\n                  return GameStateFn.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn.EffectFn.getPlayerID(effect2), DefineFn.EffectFn.getCardID(effect2)],\n                    description: effect2.text.description,\n                    text: {\n                      id: effect2.text.id,\n                      description: effect2.text.description,\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect3, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                                const cardId3 = DefineFn2.EffectFn.getCardID(effect3);\n                                const from2 = GameStateFn2.getItemBaSyou(ctx4, cardId3);\n                                const to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\");\n                                ctx4 = GameStateFn2.moveItem(ctx4, to, [cardId3, from2]);\n                                const hasHigh = GameStateFn2.getCardHasSpeicalEffect(ctx4, [\"\\u6226\\u95D8\\u914D\\u5099\"], cardId3);\n                                const hasPS = GameStateFn2.getCardHasSpeicalEffect(ctx4, [\"PS\\u88C5\\u7532\"], cardId3);\n                                const isNoNeedRoll = hasHigh || hasPS;\n                                const isRoll = isNoNeedRoll == false;\n                                ctx4 = GameStateFn2.setItemIsRoll(ctx4, isRoll, [cardId3, to]);\n                                ctx4 = GameStateFn2.triggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                                return ctx4;\n                              }.toString()\n                            }\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30AD\\u30E3\\u30E9\\u30AF\\u30BF\\u30FC\" || prototype2.category == \"\\u30AA\\u30DA\\u30EC\\u30FC\\u30B7\\u30E7\\u30F3(\\u30E6\\u30CB\\u30C3\\u30C8)\") {\n                  return GameStateFn.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn.EffectFn.getPlayerID(effect2), DefineFn.EffectFn.getCardID(effect2)],\n                    description: effect2.text.description,\n                    text: {\n                      id: effect2.text.id,\n                      description: effect2.text.description,\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect3, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                                const cardId3 = DefineFn2.EffectFn.getCardID(effect3);\n                                const pairs = GameStateFn2.getCardTipStrBaSyouPairs(ctx4, \"\\u4E00\\u500B\\u81EA\\u8ECD\\u6A5F\\u9AD4\", cardId3);\n                                const [targetCardId, targetBasyou] = pairs[0];\n                                const from2 = GameStateFn2.getItemBaSyou(ctx4, cardId3);\n                                const to = targetBasyou;\n                                ctx4 = GameStateFn2.moveItem(ctx4, to, [cardId3, from2]);\n                                ctx4 = GameStateFn2.setSetGroupParent(ctx4, targetCardId, cardId3);\n                                ctx4 = GameStateFn2.triggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                                ctx4 = GameStateFn2.triggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u30BB\\u30C3\\u30C8\\u3055\\u308C\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                                return ctx4;\n                              }.toString()\n                            }\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30B3\\u30DE\\u30F3\\u30C9\") {\n                  return GameStateFn.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn.EffectFn.getPlayerID(effect2), DefineFn.EffectFn.getCardID(effect2)],\n                    description: effect2.text.description,\n                    text: {\n                      id: prototype2.commandText?.id || ToolFn2.getUUID(\"getPlayCardEffects\"),\n                      description: prototype2.commandText?.description || \"unknown\",\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect3, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                                const cardId3 = DefineFn2.EffectFn.getCardID(effect3);\n                                const from2 = GameStateFn2.getItemBaSyou(ctx4, cardId3);\n                                const to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u30B8\\u30E3\\u30F3\\u30AF\\u30E4\\u30FC\\u30C9\");\n                                ctx4 = GameStateFn2.moveItem(ctx4, to, [cardId3, from2]);\n                                ctx4 = GameStateFn2.triggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                                return ctx4;\n                              }.toString()\n                            },\n                            ...prototype2.commandText?.logicTreeActions?.[0].actions || []\n                          ]\n                        },\n                        ...prototype2.commandText?.logicTreeActions?.slice(1) || []\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30B0\\u30E9\\u30D5\\u30A3\\u30C3\\u30AF\") {\n                  const cardId3 = DefineFn.EffectFn.getCardID(effect2);\n                  const from2 = GameStateFn.getItemBaSyou(ctx3, cardId3);\n                  const to = DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"G\\u30BE\\u30FC\\u30F3\");\n                  ctx3 = GameStateFn.doItemMove(ctx3, to, [cardId3, from2]);\n                  ctx3 = GameStateFn.triggerEvent(ctx3, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                  return ctx3;\n                }\n                if (prototype2.category == \"\\u30AA\\u30DA\\u30EC\\u30FC\\u30B7\\u30E7\\u30F3\") {\n                  const cardId3 = DefineFn.EffectFn.getCardID(effect2);\n                  const from2 = GameStateFn.getItemBaSyou(ctx3, cardId3);\n                  const to = DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\");\n                  ctx3 = GameStateFn.doItemMove(ctx3, to, [cardId3, from2]);\n                  ctx3 = GameStateFn.triggerEvent(ctx3, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                  return ctx3;\n                }\n                if (prototype2.category == \"ACE\") {\n                  throw new Error(`not support category: ${prototype2.category}`);\n                }\n                return ctx3;\n              }"
                                }
                            ]
                        }
                    ]
                }
            },
            "logicID": 0,
            "logicSubID": 0,
            "tipOrErrors": [
                {
                    "conditionKey": "合計国力〔x〕",
                    "tip": null,
                    "errors": []
                },
                {
                    "conditionKey": "0[黒]",
                    "tip": {
                        "title": [
                            "カード",
                            [
                                [
                                    "card_019228a2-b3ac-7aa1-91a9-14efae86910f",
                                    {
                                        "id": "AbsoluteBaSyou",
                                        "value": [
                                            "PlayerA",
                                            "Gゾーン"
                                        ]
                                    }
                                ],
                                [
                                    "card_019228a2-b3ac-7aa1-91a9-1b6b9b5b67c7",
                                    {
                                        "id": "AbsoluteBaSyou",
                                        "value": [
                                            "PlayerA",
                                            "Gゾーン"
                                        ]
                                    }
                                ],
                                [
                                    "card_019228a2-b3ac-7aa1-91a9-24b93989ff69",
                                    {
                                        "id": "AbsoluteBaSyou",
                                        "value": [
                                            "PlayerA",
                                            "Gゾーン"
                                        ]
                                    }
                                ],
                                [
                                    "card_019228a2-b3ac-7aa1-91a9-2883a50decb7",
                                    {
                                        "id": "AbsoluteBaSyou",
                                        "value": [
                                            "PlayerA",
                                            "Gゾーン"
                                        ]
                                    }
                                ],
                                [
                                    "card_019228a2-b3ac-7aa1-91a9-356f51d15ec4",
                                    {
                                        "id": "AbsoluteBaSyou",
                                        "value": [
                                            "PlayerA",
                                            "Gゾーン"
                                        ]
                                    }
                                ],
                                [
                                    "card_019228a2-b3ab-7aa1-91a6-bb70aed30e97",
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
                                    "card_019228a2-b3ac-7aa1-91a9-14efae86910f",
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
                    "conditionKey": "1[黒]",
                    "tip": {
                        "title": [
                            "カード",
                            [
                                [
                                    "card_019228a2-b3ac-7aa1-91a9-1b6b9b5b67c7",
                                    {
                                        "id": "AbsoluteBaSyou",
                                        "value": [
                                            "PlayerA",
                                            "Gゾーン"
                                        ]
                                    }
                                ],
                                [
                                    "card_019228a2-b3ac-7aa1-91a9-24b93989ff69",
                                    {
                                        "id": "AbsoluteBaSyou",
                                        "value": [
                                            "PlayerA",
                                            "Gゾーン"
                                        ]
                                    }
                                ],
                                [
                                    "card_019228a2-b3ac-7aa1-91a9-2883a50decb7",
                                    {
                                        "id": "AbsoluteBaSyou",
                                        "value": [
                                            "PlayerA",
                                            "Gゾーン"
                                        ]
                                    }
                                ],
                                [
                                    "card_019228a2-b3ac-7aa1-91a9-356f51d15ec4",
                                    {
                                        "id": "AbsoluteBaSyou",
                                        "value": [
                                            "PlayerA",
                                            "Gゾーン"
                                        ]
                                    }
                                ],
                                [
                                    "card_019228a2-b3ab-7aa1-91a6-bb70aed30e97",
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
                                    "card_019228a2-b3ac-7aa1-91a9-1b6b9b5b67c7",
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
            "effect": {
                "id": "getPlayCardEffects_card_019228a2-b3ab-7aa1-91a7-77a446c6f951",
                "reason": [
                    "PlayCard",
                    "PlayerA",
                    "card_019228a2-b3ab-7aa1-91a7-77a446c6f951"
                ],
                "description": "從手中即將出牌, 出牌後會產生場出的效果",
                "text": {
                    "id": "getPlayCardEffects_text_card_019228a2-b3ab-7aa1-91a7-77a446c6f951",
                    "title": [
                        "使用型",
                        [
                            "配備フェイズ"
                        ]
                    ],
                    "description": "從手中即將出牌, 出牌後會產生場出的效果",
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
                        "黒X": {
                            "title": [
                                "RollColor",
                                "黒"
                            ]
                        }
                    },
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect2, { DefineFn, GameStateFn, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn.EffectFn.getCardID(effect2);\n                const prototype2 = GameStateFn.getItemPrototype(ctx3, cardId2);\n                const from = GameStateFn.getItemBaSyou(ctx3, cardId2);\n                ctx3 = GameStateFn.doItemMove(ctx3, DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u3044\\u308B\\u30AB\\u30FC\\u30C9\"), [cardId2, from]);\n                if (prototype2.category == \"\\u30E6\\u30CB\\u30C3\\u30C8\") {\n                  return GameStateFn.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn.EffectFn.getPlayerID(effect2), DefineFn.EffectFn.getCardID(effect2)],\n                    description: effect2.text.description,\n                    text: {\n                      id: effect2.text.id,\n                      description: effect2.text.description,\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect3, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                                const cardId3 = DefineFn2.EffectFn.getCardID(effect3);\n                                const from2 = GameStateFn2.getItemBaSyou(ctx4, cardId3);\n                                const to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\");\n                                ctx4 = GameStateFn2.moveItem(ctx4, to, [cardId3, from2]);\n                                const hasHigh = GameStateFn2.getCardHasSpeicalEffect(ctx4, [\"\\u6226\\u95D8\\u914D\\u5099\"], cardId3);\n                                const hasPS = GameStateFn2.getCardHasSpeicalEffect(ctx4, [\"PS\\u88C5\\u7532\"], cardId3);\n                                const isNoNeedRoll = hasHigh || hasPS;\n                                const isRoll = isNoNeedRoll == false;\n                                ctx4 = GameStateFn2.setItemIsRoll(ctx4, isRoll, [cardId3, to]);\n                                ctx4 = GameStateFn2.triggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                                return ctx4;\n                              }.toString()\n                            }\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30AD\\u30E3\\u30E9\\u30AF\\u30BF\\u30FC\" || prototype2.category == \"\\u30AA\\u30DA\\u30EC\\u30FC\\u30B7\\u30E7\\u30F3(\\u30E6\\u30CB\\u30C3\\u30C8)\") {\n                  return GameStateFn.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn.EffectFn.getPlayerID(effect2), DefineFn.EffectFn.getCardID(effect2)],\n                    description: effect2.text.description,\n                    text: {\n                      id: effect2.text.id,\n                      description: effect2.text.description,\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect3, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                                const cardId3 = DefineFn2.EffectFn.getCardID(effect3);\n                                const pairs = GameStateFn2.getCardTipStrBaSyouPairs(ctx4, \"\\u4E00\\u500B\\u81EA\\u8ECD\\u6A5F\\u9AD4\", cardId3);\n                                const [targetCardId, targetBasyou] = pairs[0];\n                                const from2 = GameStateFn2.getItemBaSyou(ctx4, cardId3);\n                                const to = targetBasyou;\n                                ctx4 = GameStateFn2.moveItem(ctx4, to, [cardId3, from2]);\n                                ctx4 = GameStateFn2.setSetGroupParent(ctx4, targetCardId, cardId3);\n                                ctx4 = GameStateFn2.triggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                                ctx4 = GameStateFn2.triggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u30BB\\u30C3\\u30C8\\u3055\\u308C\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                                return ctx4;\n                              }.toString()\n                            }\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30B3\\u30DE\\u30F3\\u30C9\") {\n                  return GameStateFn.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn.EffectFn.getPlayerID(effect2), DefineFn.EffectFn.getCardID(effect2)],\n                    description: effect2.text.description,\n                    text: {\n                      id: prototype2.commandText?.id || ToolFn2.getUUID(\"getPlayCardEffects\"),\n                      description: prototype2.commandText?.description || \"unknown\",\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect3, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                                const cardId3 = DefineFn2.EffectFn.getCardID(effect3);\n                                const from2 = GameStateFn2.getItemBaSyou(ctx4, cardId3);\n                                const to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u30B8\\u30E3\\u30F3\\u30AF\\u30E4\\u30FC\\u30C9\");\n                                ctx4 = GameStateFn2.moveItem(ctx4, to, [cardId3, from2]);\n                                ctx4 = GameStateFn2.triggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                                return ctx4;\n                              }.toString()\n                            },\n                            ...prototype2.commandText?.logicTreeActions?.[0].actions || []\n                          ]\n                        },\n                        ...prototype2.commandText?.logicTreeActions?.slice(1) || []\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30B0\\u30E9\\u30D5\\u30A3\\u30C3\\u30AF\") {\n                  const cardId3 = DefineFn.EffectFn.getCardID(effect2);\n                  const from2 = GameStateFn.getItemBaSyou(ctx3, cardId3);\n                  const to = DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"G\\u30BE\\u30FC\\u30F3\");\n                  ctx3 = GameStateFn.doItemMove(ctx3, to, [cardId3, from2]);\n                  ctx3 = GameStateFn.triggerEvent(ctx3, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                  return ctx3;\n                }\n                if (prototype2.category == \"\\u30AA\\u30DA\\u30EC\\u30FC\\u30B7\\u30E7\\u30F3\") {\n                  const cardId3 = DefineFn.EffectFn.getCardID(effect2);\n                  const from2 = GameStateFn.getItemBaSyou(ctx3, cardId3);\n                  const to = DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\");\n                  ctx3 = GameStateFn.doItemMove(ctx3, to, [cardId3, from2]);\n                  ctx3 = GameStateFn.triggerEvent(ctx3, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                  return ctx3;\n                }\n                if (prototype2.category == \"ACE\") {\n                  throw new Error(`not support category: ${prototype2.category}`);\n                }\n                return ctx3;\n              }"
                                }
                            ]
                        }
                    ]
                }
            },
            "logicID": 0,
            "logicSubID": 0,
            "tipOrErrors": [
                {
                    "conditionKey": "合計国力〔x〕",
                    "tip": null,
                    "errors": []
                },
                {
                    "conditionKey": "黒X",
                    "tip": {
                        "title": [
                            "カード",
                            [
                                [
                                    "card_019228a2-b3ac-7aa1-91a9-14efae86910f",
                                    {
                                        "id": "AbsoluteBaSyou",
                                        "value": [
                                            "PlayerA",
                                            "Gゾーン"
                                        ]
                                    }
                                ],
                                [
                                    "card_019228a2-b3ac-7aa1-91a9-1b6b9b5b67c7",
                                    {
                                        "id": "AbsoluteBaSyou",
                                        "value": [
                                            "PlayerA",
                                            "Gゾーン"
                                        ]
                                    }
                                ],
                                [
                                    "card_019228a2-b3ac-7aa1-91a9-24b93989ff69",
                                    {
                                        "id": "AbsoluteBaSyou",
                                        "value": [
                                            "PlayerA",
                                            "Gゾーン"
                                        ]
                                    }
                                ],
                                [
                                    "card_019228a2-b3ac-7aa1-91a9-2883a50decb7",
                                    {
                                        "id": "AbsoluteBaSyou",
                                        "value": [
                                            "PlayerA",
                                            "Gゾーン"
                                        ]
                                    }
                                ],
                                [
                                    "card_019228a2-b3ac-7aa1-91a9-356f51d15ec4",
                                    {
                                        "id": "AbsoluteBaSyou",
                                        "value": [
                                            "PlayerA",
                                            "Gゾーン"
                                        ]
                                    }
                                ],
                                [
                                    "card_019228a2-b3ab-7aa1-91a6-bb70aed30e97",
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
                                    "card_019228a2-b3ac-7aa1-91a9-14efae86910f",
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
            "effect": {
                "id": "getPlayGEffects_card_019228a2-b3ab-7aa1-91a6-e0d7ad289950",
                "reason": [
                    "PlayCard",
                    "PlayerA",
                    "card_019228a2-b3ab-7aa1-91a6-e0d7ad289950"
                ],
                "description": "PlayG",
                "text": {
                    "id": "getPlayGEffects_text_card_019228a2-b3ab-7aa1-91a6-e0d7ad289950",
                    "title": [],
                    "conditions": {
                        "出G上限": {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect5, { DefineFn: DefineFn2, GameStateFn: GameStateFn2, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn2.EffectFn.getCardID(effect5);\n                const cardController = GameStateFn2.getItemController(ctx3, cardId2);\n                const ps = GameStateFn2.getPlayerState(ctx3, cardController);\n                if (ps.playGCount > 0) {\n                  throw new DefineFn2.GameError(`\\u51FAG\\u4E0A\\u9650: ${ps.playGCount}`);\n                }\n                ctx3 = GameStateFn2.mapPlayerState(ctx3, cardController, (ps2) => {\n                  return {\n                    ...ps2,\n                    playGCount: ps2.playGCount + 1\n                  };\n                });\n                return ctx3;\n              }"
                                }
                            ]
                        }
                    },
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect5, { DefineFn: DefineFn2, GameStateFn: GameStateFn2, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn2.EffectFn.getCardID(effect5);\n                const from = GameStateFn2.getItemBaSyou(ctx3, cardId2);\n                ctx3 = GameStateFn2.moveItem(ctx3, DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"G\\u30BE\\u30FC\\u30F3\"), [cardId2, from]);\n                return ctx3;\n              }"
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
            "logicID": 0,
            "logicSubID": 0,
            "tipOrErrors": [
                {
                    "conditionKey": "出G上限",
                    "tip": null,
                    "errors": [
                        "出G上限: 1"
                    ]
                }
            ]
        },
        {
            "effect": {
                "id": "getPlayGEffects_card_019228a2-b3ab-7aa1-91a7-07cdb0200b42",
                "reason": [
                    "PlayCard",
                    "PlayerA",
                    "card_019228a2-b3ab-7aa1-91a7-07cdb0200b42"
                ],
                "description": "PlayG",
                "text": {
                    "id": "getPlayGEffects_text_card_019228a2-b3ab-7aa1-91a7-07cdb0200b42",
                    "title": [],
                    "conditions": {
                        "出G上限": {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect5, { DefineFn: DefineFn2, GameStateFn: GameStateFn2, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn2.EffectFn.getCardID(effect5);\n                const cardController = GameStateFn2.getItemController(ctx3, cardId2);\n                const ps = GameStateFn2.getPlayerState(ctx3, cardController);\n                if (ps.playGCount > 0) {\n                  throw new DefineFn2.GameError(`\\u51FAG\\u4E0A\\u9650: ${ps.playGCount}`);\n                }\n                ctx3 = GameStateFn2.mapPlayerState(ctx3, cardController, (ps2) => {\n                  return {\n                    ...ps2,\n                    playGCount: ps2.playGCount + 1\n                  };\n                });\n                return ctx3;\n              }"
                                }
                            ]
                        }
                    },
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect5, { DefineFn: DefineFn2, GameStateFn: GameStateFn2, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn2.EffectFn.getCardID(effect5);\n                const from = GameStateFn2.getItemBaSyou(ctx3, cardId2);\n                ctx3 = GameStateFn2.moveItem(ctx3, DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"G\\u30BE\\u30FC\\u30F3\"), [cardId2, from]);\n                return ctx3;\n              }"
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
            "logicID": 0,
            "logicSubID": 0,
            "tipOrErrors": [
                {
                    "conditionKey": "出G上限",
                    "tip": null,
                    "errors": [
                        "出G上限: 1"
                    ]
                }
            ]
        },
        {
            "effect": {
                "id": "getPlayGEffects_card_019228a2-b3ab-7aa1-91a7-6ec3adb08642",
                "reason": [
                    "PlayCard",
                    "PlayerA",
                    "card_019228a2-b3ab-7aa1-91a7-6ec3adb08642"
                ],
                "description": "PlayG",
                "text": {
                    "id": "getPlayGEffects_text_card_019228a2-b3ab-7aa1-91a7-6ec3adb08642",
                    "title": [],
                    "conditions": {
                        "出G上限": {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect5, { DefineFn: DefineFn2, GameStateFn: GameStateFn2, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn2.EffectFn.getCardID(effect5);\n                const cardController = GameStateFn2.getItemController(ctx3, cardId2);\n                const ps = GameStateFn2.getPlayerState(ctx3, cardController);\n                if (ps.playGCount > 0) {\n                  throw new DefineFn2.GameError(`\\u51FAG\\u4E0A\\u9650: ${ps.playGCount}`);\n                }\n                ctx3 = GameStateFn2.mapPlayerState(ctx3, cardController, (ps2) => {\n                  return {\n                    ...ps2,\n                    playGCount: ps2.playGCount + 1\n                  };\n                });\n                return ctx3;\n              }"
                                }
                            ]
                        }
                    },
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect5, { DefineFn: DefineFn2, GameStateFn: GameStateFn2, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn2.EffectFn.getCardID(effect5);\n                const from = GameStateFn2.getItemBaSyou(ctx3, cardId2);\n                ctx3 = GameStateFn2.moveItem(ctx3, DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"G\\u30BE\\u30FC\\u30F3\"), [cardId2, from]);\n                return ctx3;\n              }"
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
            "logicID": 0,
            "logicSubID": 0,
            "tipOrErrors": [
                {
                    "conditionKey": "出G上限",
                    "tip": null,
                    "errors": [
                        "出G上限: 1"
                    ]
                }
            ]
        },
        {
            "effect": {
                "id": "getPlayGEffects_card_019228a2-b3ab-7aa1-91a7-196333ac1eaa",
                "reason": [
                    "PlayCard",
                    "PlayerA",
                    "card_019228a2-b3ab-7aa1-91a7-196333ac1eaa"
                ],
                "description": "PlayG",
                "text": {
                    "id": "getPlayGEffects_text_card_019228a2-b3ab-7aa1-91a7-196333ac1eaa",
                    "title": [],
                    "conditions": {
                        "出G上限": {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect5, { DefineFn: DefineFn2, GameStateFn: GameStateFn2, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn2.EffectFn.getCardID(effect5);\n                const cardController = GameStateFn2.getItemController(ctx3, cardId2);\n                const ps = GameStateFn2.getPlayerState(ctx3, cardController);\n                if (ps.playGCount > 0) {\n                  throw new DefineFn2.GameError(`\\u51FAG\\u4E0A\\u9650: ${ps.playGCount}`);\n                }\n                ctx3 = GameStateFn2.mapPlayerState(ctx3, cardController, (ps2) => {\n                  return {\n                    ...ps2,\n                    playGCount: ps2.playGCount + 1\n                  };\n                });\n                return ctx3;\n              }"
                                }
                            ]
                        }
                    },
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect5, { DefineFn: DefineFn2, GameStateFn: GameStateFn2, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn2.EffectFn.getCardID(effect5);\n                const from = GameStateFn2.getItemBaSyou(ctx3, cardId2);\n                ctx3 = GameStateFn2.moveItem(ctx3, DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"G\\u30BE\\u30FC\\u30F3\"), [cardId2, from]);\n                return ctx3;\n              }"
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
            "logicID": 0,
            "logicSubID": 0,
            "tipOrErrors": [
                {
                    "conditionKey": "出G上限",
                    "tip": null,
                    "errors": [
                        "出G上限: 1"
                    ]
                }
            ]
        },
        {
            "effect": {
                "id": "getPlayGEffects_card_019228a2-b3ab-7aa1-91a7-77a446c6f951",
                "reason": [
                    "PlayCard",
                    "PlayerA",
                    "card_019228a2-b3ab-7aa1-91a7-77a446c6f951"
                ],
                "description": "PlayG",
                "text": {
                    "id": "getPlayGEffects_text_card_019228a2-b3ab-7aa1-91a7-77a446c6f951",
                    "title": [],
                    "conditions": {
                        "出G上限": {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect5, { DefineFn: DefineFn2, GameStateFn: GameStateFn2, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn2.EffectFn.getCardID(effect5);\n                const cardController = GameStateFn2.getItemController(ctx3, cardId2);\n                const ps = GameStateFn2.getPlayerState(ctx3, cardController);\n                if (ps.playGCount > 0) {\n                  throw new DefineFn2.GameError(`\\u51FAG\\u4E0A\\u9650: ${ps.playGCount}`);\n                }\n                ctx3 = GameStateFn2.mapPlayerState(ctx3, cardController, (ps2) => {\n                  return {\n                    ...ps2,\n                    playGCount: ps2.playGCount + 1\n                  };\n                });\n                return ctx3;\n              }"
                                }
                            ]
                        }
                    },
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect5, { DefineFn: DefineFn2, GameStateFn: GameStateFn2, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn2.EffectFn.getCardID(effect5);\n                const from = GameStateFn2.getItemBaSyou(ctx3, cardId2);\n                ctx3 = GameStateFn2.moveItem(ctx3, DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"G\\u30BE\\u30FC\\u30F3\"), [cardId2, from]);\n                return ctx3;\n              }"
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
            "logicID": 0,
            "logicSubID": 0,
            "tipOrErrors": [
                {
                    "conditionKey": "出G上限",
                    "tip": null,
                    "errors": [
                        "出G上限: 1"
                    ]
                }
            ]
        },
        {
            "effect": {
                "id": "getPlayCardEffects_card_019228a2-b3ab-7aa1-91a8-96efcf686494",
                "reason": [
                    "PlayCard",
                    "PlayerB",
                    "card_019228a2-b3ab-7aa1-91a8-96efcf686494"
                ],
                "description": "從手中即將出牌, 出牌後會產生場出的效果",
                "text": {
                    "id": "getPlayCardEffects_text_card_019228a2-b3ab-7aa1-91a8-96efcf686494",
                    "title": [
                        "使用型",
                        [
                            "配備フェイズ"
                        ]
                    ],
                    "description": "從手中即將出牌, 出牌後會產生場出的效果",
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
                        },
                        "2[黒]": {
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
                                        "2[黒]"
                                    ]
                                }
                            ]
                        }
                    },
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect2, { DefineFn, GameStateFn, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn.EffectFn.getCardID(effect2);\n                const prototype2 = GameStateFn.getItemPrototype(ctx3, cardId2);\n                const from = GameStateFn.getItemBaSyou(ctx3, cardId2);\n                ctx3 = GameStateFn.doItemMove(ctx3, DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u3044\\u308B\\u30AB\\u30FC\\u30C9\"), [cardId2, from]);\n                if (prototype2.category == \"\\u30E6\\u30CB\\u30C3\\u30C8\") {\n                  return GameStateFn.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn.EffectFn.getPlayerID(effect2), DefineFn.EffectFn.getCardID(effect2)],\n                    description: effect2.text.description,\n                    text: {\n                      id: effect2.text.id,\n                      description: effect2.text.description,\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect3, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                                const cardId3 = DefineFn2.EffectFn.getCardID(effect3);\n                                const from2 = GameStateFn2.getItemBaSyou(ctx4, cardId3);\n                                const to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\");\n                                ctx4 = GameStateFn2.moveItem(ctx4, to, [cardId3, from2]);\n                                const hasHigh = GameStateFn2.getCardHasSpeicalEffect(ctx4, [\"\\u6226\\u95D8\\u914D\\u5099\"], cardId3);\n                                const hasPS = GameStateFn2.getCardHasSpeicalEffect(ctx4, [\"PS\\u88C5\\u7532\"], cardId3);\n                                const isNoNeedRoll = hasHigh || hasPS;\n                                const isRoll = isNoNeedRoll == false;\n                                ctx4 = GameStateFn2.setItemIsRoll(ctx4, isRoll, [cardId3, to]);\n                                ctx4 = GameStateFn2.triggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                                return ctx4;\n                              }.toString()\n                            }\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30AD\\u30E3\\u30E9\\u30AF\\u30BF\\u30FC\" || prototype2.category == \"\\u30AA\\u30DA\\u30EC\\u30FC\\u30B7\\u30E7\\u30F3(\\u30E6\\u30CB\\u30C3\\u30C8)\") {\n                  return GameStateFn.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn.EffectFn.getPlayerID(effect2), DefineFn.EffectFn.getCardID(effect2)],\n                    description: effect2.text.description,\n                    text: {\n                      id: effect2.text.id,\n                      description: effect2.text.description,\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect3, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                                const cardId3 = DefineFn2.EffectFn.getCardID(effect3);\n                                const pairs = GameStateFn2.getCardTipStrBaSyouPairs(ctx4, \"\\u4E00\\u500B\\u81EA\\u8ECD\\u6A5F\\u9AD4\", cardId3);\n                                const [targetCardId, targetBasyou] = pairs[0];\n                                const from2 = GameStateFn2.getItemBaSyou(ctx4, cardId3);\n                                const to = targetBasyou;\n                                ctx4 = GameStateFn2.moveItem(ctx4, to, [cardId3, from2]);\n                                ctx4 = GameStateFn2.setSetGroupParent(ctx4, targetCardId, cardId3);\n                                ctx4 = GameStateFn2.triggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                                ctx4 = GameStateFn2.triggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u30BB\\u30C3\\u30C8\\u3055\\u308C\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                                return ctx4;\n                              }.toString()\n                            }\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30B3\\u30DE\\u30F3\\u30C9\") {\n                  return GameStateFn.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn.EffectFn.getPlayerID(effect2), DefineFn.EffectFn.getCardID(effect2)],\n                    description: effect2.text.description,\n                    text: {\n                      id: prototype2.commandText?.id || ToolFn2.getUUID(\"getPlayCardEffects\"),\n                      description: prototype2.commandText?.description || \"unknown\",\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect3, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                                const cardId3 = DefineFn2.EffectFn.getCardID(effect3);\n                                const from2 = GameStateFn2.getItemBaSyou(ctx4, cardId3);\n                                const to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u30B8\\u30E3\\u30F3\\u30AF\\u30E4\\u30FC\\u30C9\");\n                                ctx4 = GameStateFn2.moveItem(ctx4, to, [cardId3, from2]);\n                                ctx4 = GameStateFn2.triggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                                return ctx4;\n                              }.toString()\n                            },\n                            ...prototype2.commandText?.logicTreeActions?.[0].actions || []\n                          ]\n                        },\n                        ...prototype2.commandText?.logicTreeActions?.slice(1) || []\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30B0\\u30E9\\u30D5\\u30A3\\u30C3\\u30AF\") {\n                  const cardId3 = DefineFn.EffectFn.getCardID(effect2);\n                  const from2 = GameStateFn.getItemBaSyou(ctx3, cardId3);\n                  const to = DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"G\\u30BE\\u30FC\\u30F3\");\n                  ctx3 = GameStateFn.doItemMove(ctx3, to, [cardId3, from2]);\n                  ctx3 = GameStateFn.triggerEvent(ctx3, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                  return ctx3;\n                }\n                if (prototype2.category == \"\\u30AA\\u30DA\\u30EC\\u30FC\\u30B7\\u30E7\\u30F3\") {\n                  const cardId3 = DefineFn.EffectFn.getCardID(effect2);\n                  const from2 = GameStateFn.getItemBaSyou(ctx3, cardId3);\n                  const to = DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\");\n                  ctx3 = GameStateFn.doItemMove(ctx3, to, [cardId3, from2]);\n                  ctx3 = GameStateFn.triggerEvent(ctx3, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                  return ctx3;\n                }\n                if (prototype2.category == \"ACE\") {\n                  throw new Error(`not support category: ${prototype2.category}`);\n                }\n                return ctx3;\n              }"
                                }
                            ]
                        }
                    ]
                }
            },
            "logicID": 0,
            "logicSubID": 0,
            "tipOrErrors": [
                {
                    "conditionKey": "合計国力〔x〕",
                    "tip": null,
                    "errors": [
                        "合計国力〔x〕:1 < 6. 從手中即將出牌, 出牌後會產生場出的效果"
                    ]
                },
                {
                    "conditionKey": "0[黒]",
                    "tip": {
                        "title": [
                            "カード",
                            [
                                [
                                    "card_019228a2-b3ab-7aa1-91a7-e26bc87ffcd1",
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
                                    "card_019228a2-b3ab-7aa1-91a7-e26bc87ffcd1",
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
                },
                {
                    "conditionKey": "2[黒]",
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
            "effect": {
                "id": "getPlayCardEffects_card_019228a2-b3ab-7aa1-91a8-bad0822cb2b5",
                "reason": [
                    "PlayCard",
                    "PlayerB",
                    "card_019228a2-b3ab-7aa1-91a8-bad0822cb2b5"
                ],
                "description": "從手中即將出牌, 出牌後會產生場出的效果",
                "text": {
                    "id": "getPlayCardEffects_text_card_019228a2-b3ab-7aa1-91a8-bad0822cb2b5",
                    "title": [
                        "使用型",
                        [
                            "配備フェイズ"
                        ]
                    ],
                    "description": "從手中即將出牌, 出牌後會產生場出的效果",
                    "conditions": {
                        "合計国力〔x〕": {
                            "actions": [
                                {
                                    "title": [
                                        "合計国力〔x〕",
                                        2
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
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect2, { DefineFn, GameStateFn, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn.EffectFn.getCardID(effect2);\n                const prototype2 = GameStateFn.getItemPrototype(ctx3, cardId2);\n                const from = GameStateFn.getItemBaSyou(ctx3, cardId2);\n                ctx3 = GameStateFn.doItemMove(ctx3, DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u3044\\u308B\\u30AB\\u30FC\\u30C9\"), [cardId2, from]);\n                if (prototype2.category == \"\\u30E6\\u30CB\\u30C3\\u30C8\") {\n                  return GameStateFn.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn.EffectFn.getPlayerID(effect2), DefineFn.EffectFn.getCardID(effect2)],\n                    description: effect2.text.description,\n                    text: {\n                      id: effect2.text.id,\n                      description: effect2.text.description,\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect3, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                                const cardId3 = DefineFn2.EffectFn.getCardID(effect3);\n                                const from2 = GameStateFn2.getItemBaSyou(ctx4, cardId3);\n                                const to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\");\n                                ctx4 = GameStateFn2.moveItem(ctx4, to, [cardId3, from2]);\n                                const hasHigh = GameStateFn2.getCardHasSpeicalEffect(ctx4, [\"\\u6226\\u95D8\\u914D\\u5099\"], cardId3);\n                                const hasPS = GameStateFn2.getCardHasSpeicalEffect(ctx4, [\"PS\\u88C5\\u7532\"], cardId3);\n                                const isNoNeedRoll = hasHigh || hasPS;\n                                const isRoll = isNoNeedRoll == false;\n                                ctx4 = GameStateFn2.setItemIsRoll(ctx4, isRoll, [cardId3, to]);\n                                ctx4 = GameStateFn2.triggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                                return ctx4;\n                              }.toString()\n                            }\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30AD\\u30E3\\u30E9\\u30AF\\u30BF\\u30FC\" || prototype2.category == \"\\u30AA\\u30DA\\u30EC\\u30FC\\u30B7\\u30E7\\u30F3(\\u30E6\\u30CB\\u30C3\\u30C8)\") {\n                  return GameStateFn.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn.EffectFn.getPlayerID(effect2), DefineFn.EffectFn.getCardID(effect2)],\n                    description: effect2.text.description,\n                    text: {\n                      id: effect2.text.id,\n                      description: effect2.text.description,\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect3, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                                const cardId3 = DefineFn2.EffectFn.getCardID(effect3);\n                                const pairs = GameStateFn2.getCardTipStrBaSyouPairs(ctx4, \"\\u4E00\\u500B\\u81EA\\u8ECD\\u6A5F\\u9AD4\", cardId3);\n                                const [targetCardId, targetBasyou] = pairs[0];\n                                const from2 = GameStateFn2.getItemBaSyou(ctx4, cardId3);\n                                const to = targetBasyou;\n                                ctx4 = GameStateFn2.moveItem(ctx4, to, [cardId3, from2]);\n                                ctx4 = GameStateFn2.setSetGroupParent(ctx4, targetCardId, cardId3);\n                                ctx4 = GameStateFn2.triggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                                ctx4 = GameStateFn2.triggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u30BB\\u30C3\\u30C8\\u3055\\u308C\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                                return ctx4;\n                              }.toString()\n                            }\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30B3\\u30DE\\u30F3\\u30C9\") {\n                  return GameStateFn.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn.EffectFn.getPlayerID(effect2), DefineFn.EffectFn.getCardID(effect2)],\n                    description: effect2.text.description,\n                    text: {\n                      id: prototype2.commandText?.id || ToolFn2.getUUID(\"getPlayCardEffects\"),\n                      description: prototype2.commandText?.description || \"unknown\",\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect3, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                                const cardId3 = DefineFn2.EffectFn.getCardID(effect3);\n                                const from2 = GameStateFn2.getItemBaSyou(ctx4, cardId3);\n                                const to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u30B8\\u30E3\\u30F3\\u30AF\\u30E4\\u30FC\\u30C9\");\n                                ctx4 = GameStateFn2.moveItem(ctx4, to, [cardId3, from2]);\n                                ctx4 = GameStateFn2.triggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                                return ctx4;\n                              }.toString()\n                            },\n                            ...prototype2.commandText?.logicTreeActions?.[0].actions || []\n                          ]\n                        },\n                        ...prototype2.commandText?.logicTreeActions?.slice(1) || []\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30B0\\u30E9\\u30D5\\u30A3\\u30C3\\u30AF\") {\n                  const cardId3 = DefineFn.EffectFn.getCardID(effect2);\n                  const from2 = GameStateFn.getItemBaSyou(ctx3, cardId3);\n                  const to = DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"G\\u30BE\\u30FC\\u30F3\");\n                  ctx3 = GameStateFn.doItemMove(ctx3, to, [cardId3, from2]);\n                  ctx3 = GameStateFn.triggerEvent(ctx3, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                  return ctx3;\n                }\n                if (prototype2.category == \"\\u30AA\\u30DA\\u30EC\\u30FC\\u30B7\\u30E7\\u30F3\") {\n                  const cardId3 = DefineFn.EffectFn.getCardID(effect2);\n                  const from2 = GameStateFn.getItemBaSyou(ctx3, cardId3);\n                  const to = DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\");\n                  ctx3 = GameStateFn.doItemMove(ctx3, to, [cardId3, from2]);\n                  ctx3 = GameStateFn.triggerEvent(ctx3, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                  return ctx3;\n                }\n                if (prototype2.category == \"ACE\") {\n                  throw new Error(`not support category: ${prototype2.category}`);\n                }\n                return ctx3;\n              }"
                                }
                            ]
                        }
                    ]
                }
            },
            "logicID": 0,
            "logicSubID": 0,
            "tipOrErrors": [
                {
                    "conditionKey": "合計国力〔x〕",
                    "tip": null,
                    "errors": [
                        "合計国力〔x〕:1 < 2. 從手中即將出牌, 出牌後會產生場出的效果"
                    ]
                },
                {
                    "conditionKey": "0[黒]",
                    "tip": {
                        "title": [
                            "カード",
                            [
                                [
                                    "card_019228a2-b3ab-7aa1-91a7-e26bc87ffcd1",
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
                                    "card_019228a2-b3ab-7aa1-91a7-e26bc87ffcd1",
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
            "effect": {
                "id": "getPlayCardEffects_card_019228a2-b3ab-7aa1-91a8-6c879ad38bb0",
                "reason": [
                    "PlayCard",
                    "PlayerB",
                    "card_019228a2-b3ab-7aa1-91a8-6c879ad38bb0"
                ],
                "description": "從手中即將出牌, 出牌後會產生場出的效果",
                "text": {
                    "id": "getPlayCardEffects_text_card_019228a2-b3ab-7aa1-91a8-6c879ad38bb0",
                    "title": [
                        "使用型",
                        [
                            "配備フェイズ"
                        ]
                    ],
                    "description": "從手中即將出牌, 出牌後會產生場出的效果",
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
                        },
                        "2[黒]": {
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
                                        "2[黒]"
                                    ]
                                }
                            ]
                        }
                    },
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect2, { DefineFn, GameStateFn, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn.EffectFn.getCardID(effect2);\n                const prototype2 = GameStateFn.getItemPrototype(ctx3, cardId2);\n                const from = GameStateFn.getItemBaSyou(ctx3, cardId2);\n                ctx3 = GameStateFn.doItemMove(ctx3, DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u3044\\u308B\\u30AB\\u30FC\\u30C9\"), [cardId2, from]);\n                if (prototype2.category == \"\\u30E6\\u30CB\\u30C3\\u30C8\") {\n                  return GameStateFn.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn.EffectFn.getPlayerID(effect2), DefineFn.EffectFn.getCardID(effect2)],\n                    description: effect2.text.description,\n                    text: {\n                      id: effect2.text.id,\n                      description: effect2.text.description,\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect3, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                                const cardId3 = DefineFn2.EffectFn.getCardID(effect3);\n                                const from2 = GameStateFn2.getItemBaSyou(ctx4, cardId3);\n                                const to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\");\n                                ctx4 = GameStateFn2.moveItem(ctx4, to, [cardId3, from2]);\n                                const hasHigh = GameStateFn2.getCardHasSpeicalEffect(ctx4, [\"\\u6226\\u95D8\\u914D\\u5099\"], cardId3);\n                                const hasPS = GameStateFn2.getCardHasSpeicalEffect(ctx4, [\"PS\\u88C5\\u7532\"], cardId3);\n                                const isNoNeedRoll = hasHigh || hasPS;\n                                const isRoll = isNoNeedRoll == false;\n                                ctx4 = GameStateFn2.setItemIsRoll(ctx4, isRoll, [cardId3, to]);\n                                ctx4 = GameStateFn2.triggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                                return ctx4;\n                              }.toString()\n                            }\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30AD\\u30E3\\u30E9\\u30AF\\u30BF\\u30FC\" || prototype2.category == \"\\u30AA\\u30DA\\u30EC\\u30FC\\u30B7\\u30E7\\u30F3(\\u30E6\\u30CB\\u30C3\\u30C8)\") {\n                  return GameStateFn.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn.EffectFn.getPlayerID(effect2), DefineFn.EffectFn.getCardID(effect2)],\n                    description: effect2.text.description,\n                    text: {\n                      id: effect2.text.id,\n                      description: effect2.text.description,\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect3, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                                const cardId3 = DefineFn2.EffectFn.getCardID(effect3);\n                                const pairs = GameStateFn2.getCardTipStrBaSyouPairs(ctx4, \"\\u4E00\\u500B\\u81EA\\u8ECD\\u6A5F\\u9AD4\", cardId3);\n                                const [targetCardId, targetBasyou] = pairs[0];\n                                const from2 = GameStateFn2.getItemBaSyou(ctx4, cardId3);\n                                const to = targetBasyou;\n                                ctx4 = GameStateFn2.moveItem(ctx4, to, [cardId3, from2]);\n                                ctx4 = GameStateFn2.setSetGroupParent(ctx4, targetCardId, cardId3);\n                                ctx4 = GameStateFn2.triggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                                ctx4 = GameStateFn2.triggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u30BB\\u30C3\\u30C8\\u3055\\u308C\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                                return ctx4;\n                              }.toString()\n                            }\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30B3\\u30DE\\u30F3\\u30C9\") {\n                  return GameStateFn.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn.EffectFn.getPlayerID(effect2), DefineFn.EffectFn.getCardID(effect2)],\n                    description: effect2.text.description,\n                    text: {\n                      id: prototype2.commandText?.id || ToolFn2.getUUID(\"getPlayCardEffects\"),\n                      description: prototype2.commandText?.description || \"unknown\",\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect3, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                                const cardId3 = DefineFn2.EffectFn.getCardID(effect3);\n                                const from2 = GameStateFn2.getItemBaSyou(ctx4, cardId3);\n                                const to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u30B8\\u30E3\\u30F3\\u30AF\\u30E4\\u30FC\\u30C9\");\n                                ctx4 = GameStateFn2.moveItem(ctx4, to, [cardId3, from2]);\n                                ctx4 = GameStateFn2.triggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                                return ctx4;\n                              }.toString()\n                            },\n                            ...prototype2.commandText?.logicTreeActions?.[0].actions || []\n                          ]\n                        },\n                        ...prototype2.commandText?.logicTreeActions?.slice(1) || []\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30B0\\u30E9\\u30D5\\u30A3\\u30C3\\u30AF\") {\n                  const cardId3 = DefineFn.EffectFn.getCardID(effect2);\n                  const from2 = GameStateFn.getItemBaSyou(ctx3, cardId3);\n                  const to = DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"G\\u30BE\\u30FC\\u30F3\");\n                  ctx3 = GameStateFn.doItemMove(ctx3, to, [cardId3, from2]);\n                  ctx3 = GameStateFn.triggerEvent(ctx3, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                  return ctx3;\n                }\n                if (prototype2.category == \"\\u30AA\\u30DA\\u30EC\\u30FC\\u30B7\\u30E7\\u30F3\") {\n                  const cardId3 = DefineFn.EffectFn.getCardID(effect2);\n                  const from2 = GameStateFn.getItemBaSyou(ctx3, cardId3);\n                  const to = DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\");\n                  ctx3 = GameStateFn.doItemMove(ctx3, to, [cardId3, from2]);\n                  ctx3 = GameStateFn.triggerEvent(ctx3, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                  return ctx3;\n                }\n                if (prototype2.category == \"ACE\") {\n                  throw new Error(`not support category: ${prototype2.category}`);\n                }\n                return ctx3;\n              }"
                                }
                            ]
                        }
                    ]
                }
            },
            "logicID": 0,
            "logicSubID": 0,
            "tipOrErrors": [
                {
                    "conditionKey": "合計国力〔x〕",
                    "tip": null,
                    "errors": [
                        "合計国力〔x〕:1 < 4. 從手中即將出牌, 出牌後會產生場出的效果"
                    ]
                },
                {
                    "conditionKey": "0[黒]",
                    "tip": {
                        "title": [
                            "カード",
                            [
                                [
                                    "card_019228a2-b3ab-7aa1-91a7-e26bc87ffcd1",
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
                                    "card_019228a2-b3ab-7aa1-91a7-e26bc87ffcd1",
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
                },
                {
                    "conditionKey": "2[黒]",
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
            "effect": {
                "id": "getPlayCardEffects_card_019228a2-b3ab-7aa1-91a8-5a60314f7e0e",
                "reason": [
                    "PlayCard",
                    "PlayerB",
                    "card_019228a2-b3ab-7aa1-91a8-5a60314f7e0e"
                ],
                "description": "從手中即將出牌, 出牌後會產生場出的效果",
                "text": {
                    "id": "getPlayCardEffects_text_card_019228a2-b3ab-7aa1-91a8-5a60314f7e0e",
                    "title": [
                        "使用型",
                        [
                            "配備フェイズ"
                        ]
                    ],
                    "description": "從手中即將出牌, 出牌後會產生場出的效果",
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
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect2, { DefineFn, GameStateFn, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn.EffectFn.getCardID(effect2);\n                const prototype2 = GameStateFn.getItemPrototype(ctx3, cardId2);\n                const from = GameStateFn.getItemBaSyou(ctx3, cardId2);\n                ctx3 = GameStateFn.doItemMove(ctx3, DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u3044\\u308B\\u30AB\\u30FC\\u30C9\"), [cardId2, from]);\n                if (prototype2.category == \"\\u30E6\\u30CB\\u30C3\\u30C8\") {\n                  return GameStateFn.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn.EffectFn.getPlayerID(effect2), DefineFn.EffectFn.getCardID(effect2)],\n                    description: effect2.text.description,\n                    text: {\n                      id: effect2.text.id,\n                      description: effect2.text.description,\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect3, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                                const cardId3 = DefineFn2.EffectFn.getCardID(effect3);\n                                const from2 = GameStateFn2.getItemBaSyou(ctx4, cardId3);\n                                const to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\");\n                                ctx4 = GameStateFn2.moveItem(ctx4, to, [cardId3, from2]);\n                                const hasHigh = GameStateFn2.getCardHasSpeicalEffect(ctx4, [\"\\u6226\\u95D8\\u914D\\u5099\"], cardId3);\n                                const hasPS = GameStateFn2.getCardHasSpeicalEffect(ctx4, [\"PS\\u88C5\\u7532\"], cardId3);\n                                const isNoNeedRoll = hasHigh || hasPS;\n                                const isRoll = isNoNeedRoll == false;\n                                ctx4 = GameStateFn2.setItemIsRoll(ctx4, isRoll, [cardId3, to]);\n                                ctx4 = GameStateFn2.triggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                                return ctx4;\n                              }.toString()\n                            }\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30AD\\u30E3\\u30E9\\u30AF\\u30BF\\u30FC\" || prototype2.category == \"\\u30AA\\u30DA\\u30EC\\u30FC\\u30B7\\u30E7\\u30F3(\\u30E6\\u30CB\\u30C3\\u30C8)\") {\n                  return GameStateFn.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn.EffectFn.getPlayerID(effect2), DefineFn.EffectFn.getCardID(effect2)],\n                    description: effect2.text.description,\n                    text: {\n                      id: effect2.text.id,\n                      description: effect2.text.description,\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect3, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                                const cardId3 = DefineFn2.EffectFn.getCardID(effect3);\n                                const pairs = GameStateFn2.getCardTipStrBaSyouPairs(ctx4, \"\\u4E00\\u500B\\u81EA\\u8ECD\\u6A5F\\u9AD4\", cardId3);\n                                const [targetCardId, targetBasyou] = pairs[0];\n                                const from2 = GameStateFn2.getItemBaSyou(ctx4, cardId3);\n                                const to = targetBasyou;\n                                ctx4 = GameStateFn2.moveItem(ctx4, to, [cardId3, from2]);\n                                ctx4 = GameStateFn2.setSetGroupParent(ctx4, targetCardId, cardId3);\n                                ctx4 = GameStateFn2.triggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                                ctx4 = GameStateFn2.triggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u30BB\\u30C3\\u30C8\\u3055\\u308C\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                                return ctx4;\n                              }.toString()\n                            }\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30B3\\u30DE\\u30F3\\u30C9\") {\n                  return GameStateFn.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn.EffectFn.getPlayerID(effect2), DefineFn.EffectFn.getCardID(effect2)],\n                    description: effect2.text.description,\n                    text: {\n                      id: prototype2.commandText?.id || ToolFn2.getUUID(\"getPlayCardEffects\"),\n                      description: prototype2.commandText?.description || \"unknown\",\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect3, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                                const cardId3 = DefineFn2.EffectFn.getCardID(effect3);\n                                const from2 = GameStateFn2.getItemBaSyou(ctx4, cardId3);\n                                const to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u30B8\\u30E3\\u30F3\\u30AF\\u30E4\\u30FC\\u30C9\");\n                                ctx4 = GameStateFn2.moveItem(ctx4, to, [cardId3, from2]);\n                                ctx4 = GameStateFn2.triggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                                return ctx4;\n                              }.toString()\n                            },\n                            ...prototype2.commandText?.logicTreeActions?.[0].actions || []\n                          ]\n                        },\n                        ...prototype2.commandText?.logicTreeActions?.slice(1) || []\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30B0\\u30E9\\u30D5\\u30A3\\u30C3\\u30AF\") {\n                  const cardId3 = DefineFn.EffectFn.getCardID(effect2);\n                  const from2 = GameStateFn.getItemBaSyou(ctx3, cardId3);\n                  const to = DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"G\\u30BE\\u30FC\\u30F3\");\n                  ctx3 = GameStateFn.doItemMove(ctx3, to, [cardId3, from2]);\n                  ctx3 = GameStateFn.triggerEvent(ctx3, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                  return ctx3;\n                }\n                if (prototype2.category == \"\\u30AA\\u30DA\\u30EC\\u30FC\\u30B7\\u30E7\\u30F3\") {\n                  const cardId3 = DefineFn.EffectFn.getCardID(effect2);\n                  const from2 = GameStateFn.getItemBaSyou(ctx3, cardId3);\n                  const to = DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\");\n                  ctx3 = GameStateFn.doItemMove(ctx3, to, [cardId3, from2]);\n                  ctx3 = GameStateFn.triggerEvent(ctx3, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                  return ctx3;\n                }\n                if (prototype2.category == \"ACE\") {\n                  throw new Error(`not support category: ${prototype2.category}`);\n                }\n                return ctx3;\n              }"
                                }
                            ]
                        }
                    ]
                }
            },
            "logicID": 0,
            "logicSubID": 0,
            "tipOrErrors": [
                {
                    "conditionKey": "合計国力〔x〕",
                    "tip": null,
                    "errors": [
                        "合計国力〔x〕:1 < 5. 從手中即將出牌, 出牌後會產生場出的效果"
                    ]
                },
                {
                    "conditionKey": "0[黒]",
                    "tip": {
                        "title": [
                            "カード",
                            [
                                [
                                    "card_019228a2-b3ab-7aa1-91a7-e26bc87ffcd1",
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
                                    "card_019228a2-b3ab-7aa1-91a7-e26bc87ffcd1",
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
            "effect": {
                "id": "getPlayGEffects_card_019228a2-b3ab-7aa1-91a8-96efcf686494",
                "reason": [
                    "PlayCard",
                    "PlayerB",
                    "card_019228a2-b3ab-7aa1-91a8-96efcf686494"
                ],
                "description": "PlayG",
                "text": {
                    "id": "getPlayGEffects_text_card_019228a2-b3ab-7aa1-91a8-96efcf686494",
                    "title": [],
                    "conditions": {
                        "出G上限": {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect5, { DefineFn: DefineFn2, GameStateFn: GameStateFn2, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn2.EffectFn.getCardID(effect5);\n                const cardController = GameStateFn2.getItemController(ctx3, cardId2);\n                const ps = GameStateFn2.getPlayerState(ctx3, cardController);\n                if (ps.playGCount > 0) {\n                  throw new DefineFn2.GameError(`\\u51FAG\\u4E0A\\u9650: ${ps.playGCount}`);\n                }\n                ctx3 = GameStateFn2.mapPlayerState(ctx3, cardController, (ps2) => {\n                  return {\n                    ...ps2,\n                    playGCount: ps2.playGCount + 1\n                  };\n                });\n                return ctx3;\n              }"
                                }
                            ]
                        }
                    },
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect5, { DefineFn: DefineFn2, GameStateFn: GameStateFn2, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn2.EffectFn.getCardID(effect5);\n                const from = GameStateFn2.getItemBaSyou(ctx3, cardId2);\n                ctx3 = GameStateFn2.moveItem(ctx3, DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"G\\u30BE\\u30FC\\u30F3\"), [cardId2, from]);\n                return ctx3;\n              }"
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
            "logicID": 0,
            "logicSubID": 0,
            "tipOrErrors": [
                {
                    "conditionKey": "出G上限",
                    "tip": null,
                    "errors": [
                        "出G上限: 1"
                    ]
                }
            ]
        },
        {
            "effect": {
                "id": "getPlayGEffects_card_019228a2-b3ab-7aa1-91a8-bad0822cb2b5",
                "reason": [
                    "PlayCard",
                    "PlayerB",
                    "card_019228a2-b3ab-7aa1-91a8-bad0822cb2b5"
                ],
                "description": "PlayG",
                "text": {
                    "id": "getPlayGEffects_text_card_019228a2-b3ab-7aa1-91a8-bad0822cb2b5",
                    "title": [],
                    "conditions": {
                        "出G上限": {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect5, { DefineFn: DefineFn2, GameStateFn: GameStateFn2, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn2.EffectFn.getCardID(effect5);\n                const cardController = GameStateFn2.getItemController(ctx3, cardId2);\n                const ps = GameStateFn2.getPlayerState(ctx3, cardController);\n                if (ps.playGCount > 0) {\n                  throw new DefineFn2.GameError(`\\u51FAG\\u4E0A\\u9650: ${ps.playGCount}`);\n                }\n                ctx3 = GameStateFn2.mapPlayerState(ctx3, cardController, (ps2) => {\n                  return {\n                    ...ps2,\n                    playGCount: ps2.playGCount + 1\n                  };\n                });\n                return ctx3;\n              }"
                                }
                            ]
                        }
                    },
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect5, { DefineFn: DefineFn2, GameStateFn: GameStateFn2, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn2.EffectFn.getCardID(effect5);\n                const from = GameStateFn2.getItemBaSyou(ctx3, cardId2);\n                ctx3 = GameStateFn2.moveItem(ctx3, DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"G\\u30BE\\u30FC\\u30F3\"), [cardId2, from]);\n                return ctx3;\n              }"
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
            "logicID": 0,
            "logicSubID": 0,
            "tipOrErrors": [
                {
                    "conditionKey": "出G上限",
                    "tip": null,
                    "errors": [
                        "出G上限: 1"
                    ]
                }
            ]
        },
        {
            "effect": {
                "id": "getPlayGEffects_card_019228a2-b3ab-7aa1-91a8-6c879ad38bb0",
                "reason": [
                    "PlayCard",
                    "PlayerB",
                    "card_019228a2-b3ab-7aa1-91a8-6c879ad38bb0"
                ],
                "description": "PlayG",
                "text": {
                    "id": "getPlayGEffects_text_card_019228a2-b3ab-7aa1-91a8-6c879ad38bb0",
                    "title": [],
                    "conditions": {
                        "出G上限": {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect5, { DefineFn: DefineFn2, GameStateFn: GameStateFn2, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn2.EffectFn.getCardID(effect5);\n                const cardController = GameStateFn2.getItemController(ctx3, cardId2);\n                const ps = GameStateFn2.getPlayerState(ctx3, cardController);\n                if (ps.playGCount > 0) {\n                  throw new DefineFn2.GameError(`\\u51FAG\\u4E0A\\u9650: ${ps.playGCount}`);\n                }\n                ctx3 = GameStateFn2.mapPlayerState(ctx3, cardController, (ps2) => {\n                  return {\n                    ...ps2,\n                    playGCount: ps2.playGCount + 1\n                  };\n                });\n                return ctx3;\n              }"
                                }
                            ]
                        }
                    },
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect5, { DefineFn: DefineFn2, GameStateFn: GameStateFn2, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn2.EffectFn.getCardID(effect5);\n                const from = GameStateFn2.getItemBaSyou(ctx3, cardId2);\n                ctx3 = GameStateFn2.moveItem(ctx3, DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"G\\u30BE\\u30FC\\u30F3\"), [cardId2, from]);\n                return ctx3;\n              }"
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
            "logicID": 0,
            "logicSubID": 0,
            "tipOrErrors": [
                {
                    "conditionKey": "出G上限",
                    "tip": null,
                    "errors": [
                        "出G上限: 1"
                    ]
                }
            ]
        },
        {
            "effect": {
                "id": "getPlayGEffects_card_019228a2-b3ab-7aa1-91a8-5a60314f7e0e",
                "reason": [
                    "PlayCard",
                    "PlayerB",
                    "card_019228a2-b3ab-7aa1-91a8-5a60314f7e0e"
                ],
                "description": "PlayG",
                "text": {
                    "id": "getPlayGEffects_text_card_019228a2-b3ab-7aa1-91a8-5a60314f7e0e",
                    "title": [],
                    "conditions": {
                        "出G上限": {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect5, { DefineFn: DefineFn2, GameStateFn: GameStateFn2, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn2.EffectFn.getCardID(effect5);\n                const cardController = GameStateFn2.getItemController(ctx3, cardId2);\n                const ps = GameStateFn2.getPlayerState(ctx3, cardController);\n                if (ps.playGCount > 0) {\n                  throw new DefineFn2.GameError(`\\u51FAG\\u4E0A\\u9650: ${ps.playGCount}`);\n                }\n                ctx3 = GameStateFn2.mapPlayerState(ctx3, cardController, (ps2) => {\n                  return {\n                    ...ps2,\n                    playGCount: ps2.playGCount + 1\n                  };\n                });\n                return ctx3;\n              }"
                                }
                            ]
                        }
                    },
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect5, { DefineFn: DefineFn2, GameStateFn: GameStateFn2, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn2.EffectFn.getCardID(effect5);\n                const from = GameStateFn2.getItemBaSyou(ctx3, cardId2);\n                ctx3 = GameStateFn2.moveItem(ctx3, DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"G\\u30BE\\u30FC\\u30F3\"), [cardId2, from]);\n                return ctx3;\n              }"
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
            "logicID": 0,
            "logicSubID": 0,
            "tipOrErrors": [
                {
                    "conditionKey": "出G上限",
                    "tip": null,
                    "errors": [
                        "出G上限: 1"
                    ]
                }
            ]
        }
    ],
    "commandEffects": [
        {
            "id": "getPlayCardEffects_card_019228a2-b3ab-7aa1-91a6-e0d7ad289950",
            "reason": [
                "PlayCard",
                "PlayerA",
                "card_019228a2-b3ab-7aa1-91a6-e0d7ad289950"
            ],
            "description": "從手中即將出牌, 出牌後會產生場出的效果",
            "text": {
                "id": "getPlayCardEffects_text_card_019228a2-b3ab-7aa1-91a6-e0d7ad289950",
                "title": [
                    "使用型",
                    [
                        "配備フェイズ"
                    ]
                ],
                "description": "從手中即將出牌, 出牌後會產生場出的效果",
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
                    },
                    "2[黒]": {
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
                                    "2[黒]"
                                ]
                            }
                        ]
                    }
                },
                "logicTreeActions": [
                    {
                        "actions": [
                            {
                                "title": "function _(ctx3, effect2, { DefineFn, GameStateFn, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn.EffectFn.getCardID(effect2);\n                const prototype2 = GameStateFn.getItemPrototype(ctx3, cardId2);\n                const from = GameStateFn.getItemBaSyou(ctx3, cardId2);\n                ctx3 = GameStateFn.doItemMove(ctx3, DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u3044\\u308B\\u30AB\\u30FC\\u30C9\"), [cardId2, from]);\n                if (prototype2.category == \"\\u30E6\\u30CB\\u30C3\\u30C8\") {\n                  return GameStateFn.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn.EffectFn.getPlayerID(effect2), DefineFn.EffectFn.getCardID(effect2)],\n                    description: effect2.text.description,\n                    text: {\n                      id: effect2.text.id,\n                      description: effect2.text.description,\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect3, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                                const cardId3 = DefineFn2.EffectFn.getCardID(effect3);\n                                const from2 = GameStateFn2.getItemBaSyou(ctx4, cardId3);\n                                const to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\");\n                                ctx4 = GameStateFn2.moveItem(ctx4, to, [cardId3, from2]);\n                                const hasHigh = GameStateFn2.getCardHasSpeicalEffect(ctx4, [\"\\u6226\\u95D8\\u914D\\u5099\"], cardId3);\n                                const hasPS = GameStateFn2.getCardHasSpeicalEffect(ctx4, [\"PS\\u88C5\\u7532\"], cardId3);\n                                const isNoNeedRoll = hasHigh || hasPS;\n                                const isRoll = isNoNeedRoll == false;\n                                ctx4 = GameStateFn2.setItemIsRoll(ctx4, isRoll, [cardId3, to]);\n                                ctx4 = GameStateFn2.triggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                                return ctx4;\n                              }.toString()\n                            }\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30AD\\u30E3\\u30E9\\u30AF\\u30BF\\u30FC\" || prototype2.category == \"\\u30AA\\u30DA\\u30EC\\u30FC\\u30B7\\u30E7\\u30F3(\\u30E6\\u30CB\\u30C3\\u30C8)\") {\n                  return GameStateFn.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn.EffectFn.getPlayerID(effect2), DefineFn.EffectFn.getCardID(effect2)],\n                    description: effect2.text.description,\n                    text: {\n                      id: effect2.text.id,\n                      description: effect2.text.description,\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect3, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                                const cardId3 = DefineFn2.EffectFn.getCardID(effect3);\n                                const pairs = GameStateFn2.getCardTipStrBaSyouPairs(ctx4, \"\\u4E00\\u500B\\u81EA\\u8ECD\\u6A5F\\u9AD4\", cardId3);\n                                const [targetCardId, targetBasyou] = pairs[0];\n                                const from2 = GameStateFn2.getItemBaSyou(ctx4, cardId3);\n                                const to = targetBasyou;\n                                ctx4 = GameStateFn2.moveItem(ctx4, to, [cardId3, from2]);\n                                ctx4 = GameStateFn2.setSetGroupParent(ctx4, targetCardId, cardId3);\n                                ctx4 = GameStateFn2.triggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                                ctx4 = GameStateFn2.triggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u30BB\\u30C3\\u30C8\\u3055\\u308C\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                                return ctx4;\n                              }.toString()\n                            }\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30B3\\u30DE\\u30F3\\u30C9\") {\n                  return GameStateFn.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn.EffectFn.getPlayerID(effect2), DefineFn.EffectFn.getCardID(effect2)],\n                    description: effect2.text.description,\n                    text: {\n                      id: prototype2.commandText?.id || ToolFn2.getUUID(\"getPlayCardEffects\"),\n                      description: prototype2.commandText?.description || \"unknown\",\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect3, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                                const cardId3 = DefineFn2.EffectFn.getCardID(effect3);\n                                const from2 = GameStateFn2.getItemBaSyou(ctx4, cardId3);\n                                const to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u30B8\\u30E3\\u30F3\\u30AF\\u30E4\\u30FC\\u30C9\");\n                                ctx4 = GameStateFn2.moveItem(ctx4, to, [cardId3, from2]);\n                                ctx4 = GameStateFn2.triggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                                return ctx4;\n                              }.toString()\n                            },\n                            ...prototype2.commandText?.logicTreeActions?.[0].actions || []\n                          ]\n                        },\n                        ...prototype2.commandText?.logicTreeActions?.slice(1) || []\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30B0\\u30E9\\u30D5\\u30A3\\u30C3\\u30AF\") {\n                  const cardId3 = DefineFn.EffectFn.getCardID(effect2);\n                  const from2 = GameStateFn.getItemBaSyou(ctx3, cardId3);\n                  const to = DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"G\\u30BE\\u30FC\\u30F3\");\n                  ctx3 = GameStateFn.doItemMove(ctx3, to, [cardId3, from2]);\n                  ctx3 = GameStateFn.triggerEvent(ctx3, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                  return ctx3;\n                }\n                if (prototype2.category == \"\\u30AA\\u30DA\\u30EC\\u30FC\\u30B7\\u30E7\\u30F3\") {\n                  const cardId3 = DefineFn.EffectFn.getCardID(effect2);\n                  const from2 = GameStateFn.getItemBaSyou(ctx3, cardId3);\n                  const to = DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\");\n                  ctx3 = GameStateFn.doItemMove(ctx3, to, [cardId3, from2]);\n                  ctx3 = GameStateFn.triggerEvent(ctx3, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                  return ctx3;\n                }\n                if (prototype2.category == \"ACE\") {\n                  throw new Error(`not support category: ${prototype2.category}`);\n                }\n                return ctx3;\n              }"
                            }
                        ]
                    }
                ]
            }
        },
        {
            "id": "getPlayCardEffects_card_019228a2-b3ab-7aa1-91a7-07cdb0200b42",
            "reason": [
                "PlayCard",
                "PlayerA",
                "card_019228a2-b3ab-7aa1-91a7-07cdb0200b42"
            ],
            "description": "從手中即將出牌, 出牌後會產生場出的效果",
            "text": {
                "id": "getPlayCardEffects_text_card_019228a2-b3ab-7aa1-91a7-07cdb0200b42",
                "title": [
                    "使用型",
                    [
                        "配備フェイズ"
                    ]
                ],
                "description": "從手中即將出牌, 出牌後會產生場出的效果",
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
                    },
                    "2[黒]": {
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
                                    "2[黒]"
                                ]
                            }
                        ]
                    }
                },
                "logicTreeActions": [
                    {
                        "actions": [
                            {
                                "title": "function _(ctx3, effect2, { DefineFn, GameStateFn, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn.EffectFn.getCardID(effect2);\n                const prototype2 = GameStateFn.getItemPrototype(ctx3, cardId2);\n                const from = GameStateFn.getItemBaSyou(ctx3, cardId2);\n                ctx3 = GameStateFn.doItemMove(ctx3, DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u3044\\u308B\\u30AB\\u30FC\\u30C9\"), [cardId2, from]);\n                if (prototype2.category == \"\\u30E6\\u30CB\\u30C3\\u30C8\") {\n                  return GameStateFn.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn.EffectFn.getPlayerID(effect2), DefineFn.EffectFn.getCardID(effect2)],\n                    description: effect2.text.description,\n                    text: {\n                      id: effect2.text.id,\n                      description: effect2.text.description,\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect3, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                                const cardId3 = DefineFn2.EffectFn.getCardID(effect3);\n                                const from2 = GameStateFn2.getItemBaSyou(ctx4, cardId3);\n                                const to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\");\n                                ctx4 = GameStateFn2.moveItem(ctx4, to, [cardId3, from2]);\n                                const hasHigh = GameStateFn2.getCardHasSpeicalEffect(ctx4, [\"\\u6226\\u95D8\\u914D\\u5099\"], cardId3);\n                                const hasPS = GameStateFn2.getCardHasSpeicalEffect(ctx4, [\"PS\\u88C5\\u7532\"], cardId3);\n                                const isNoNeedRoll = hasHigh || hasPS;\n                                const isRoll = isNoNeedRoll == false;\n                                ctx4 = GameStateFn2.setItemIsRoll(ctx4, isRoll, [cardId3, to]);\n                                ctx4 = GameStateFn2.triggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                                return ctx4;\n                              }.toString()\n                            }\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30AD\\u30E3\\u30E9\\u30AF\\u30BF\\u30FC\" || prototype2.category == \"\\u30AA\\u30DA\\u30EC\\u30FC\\u30B7\\u30E7\\u30F3(\\u30E6\\u30CB\\u30C3\\u30C8)\") {\n                  return GameStateFn.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn.EffectFn.getPlayerID(effect2), DefineFn.EffectFn.getCardID(effect2)],\n                    description: effect2.text.description,\n                    text: {\n                      id: effect2.text.id,\n                      description: effect2.text.description,\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect3, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                                const cardId3 = DefineFn2.EffectFn.getCardID(effect3);\n                                const pairs = GameStateFn2.getCardTipStrBaSyouPairs(ctx4, \"\\u4E00\\u500B\\u81EA\\u8ECD\\u6A5F\\u9AD4\", cardId3);\n                                const [targetCardId, targetBasyou] = pairs[0];\n                                const from2 = GameStateFn2.getItemBaSyou(ctx4, cardId3);\n                                const to = targetBasyou;\n                                ctx4 = GameStateFn2.moveItem(ctx4, to, [cardId3, from2]);\n                                ctx4 = GameStateFn2.setSetGroupParent(ctx4, targetCardId, cardId3);\n                                ctx4 = GameStateFn2.triggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                                ctx4 = GameStateFn2.triggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u30BB\\u30C3\\u30C8\\u3055\\u308C\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                                return ctx4;\n                              }.toString()\n                            }\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30B3\\u30DE\\u30F3\\u30C9\") {\n                  return GameStateFn.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn.EffectFn.getPlayerID(effect2), DefineFn.EffectFn.getCardID(effect2)],\n                    description: effect2.text.description,\n                    text: {\n                      id: prototype2.commandText?.id || ToolFn2.getUUID(\"getPlayCardEffects\"),\n                      description: prototype2.commandText?.description || \"unknown\",\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect3, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                                const cardId3 = DefineFn2.EffectFn.getCardID(effect3);\n                                const from2 = GameStateFn2.getItemBaSyou(ctx4, cardId3);\n                                const to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u30B8\\u30E3\\u30F3\\u30AF\\u30E4\\u30FC\\u30C9\");\n                                ctx4 = GameStateFn2.moveItem(ctx4, to, [cardId3, from2]);\n                                ctx4 = GameStateFn2.triggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                                return ctx4;\n                              }.toString()\n                            },\n                            ...prototype2.commandText?.logicTreeActions?.[0].actions || []\n                          ]\n                        },\n                        ...prototype2.commandText?.logicTreeActions?.slice(1) || []\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30B0\\u30E9\\u30D5\\u30A3\\u30C3\\u30AF\") {\n                  const cardId3 = DefineFn.EffectFn.getCardID(effect2);\n                  const from2 = GameStateFn.getItemBaSyou(ctx3, cardId3);\n                  const to = DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"G\\u30BE\\u30FC\\u30F3\");\n                  ctx3 = GameStateFn.doItemMove(ctx3, to, [cardId3, from2]);\n                  ctx3 = GameStateFn.triggerEvent(ctx3, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                  return ctx3;\n                }\n                if (prototype2.category == \"\\u30AA\\u30DA\\u30EC\\u30FC\\u30B7\\u30E7\\u30F3\") {\n                  const cardId3 = DefineFn.EffectFn.getCardID(effect2);\n                  const from2 = GameStateFn.getItemBaSyou(ctx3, cardId3);\n                  const to = DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\");\n                  ctx3 = GameStateFn.doItemMove(ctx3, to, [cardId3, from2]);\n                  ctx3 = GameStateFn.triggerEvent(ctx3, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                  return ctx3;\n                }\n                if (prototype2.category == \"ACE\") {\n                  throw new Error(`not support category: ${prototype2.category}`);\n                }\n                return ctx3;\n              }"
                            }
                        ]
                    }
                ]
            }
        },
        {
            "id": "getPlayCardEffects_card_019228a2-b3ab-7aa1-91a7-6ec3adb08642",
            "reason": [
                "PlayCard",
                "PlayerA",
                "card_019228a2-b3ab-7aa1-91a7-6ec3adb08642"
            ],
            "description": "從手中即將出牌, 出牌後會產生場出的效果",
            "text": {
                "id": "getPlayCardEffects_text_card_019228a2-b3ab-7aa1-91a7-6ec3adb08642",
                "title": [
                    "使用型",
                    [
                        "配備フェイズ"
                    ]
                ],
                "description": "從手中即將出牌, 出牌後會產生場出的效果",
                "conditions": {
                    "合計国力〔x〕": {
                        "actions": [
                            {
                                "title": [
                                    "合計国力〔x〕",
                                    0
                                ]
                            }
                        ]
                    }
                },
                "logicTreeActions": [
                    {
                        "actions": [
                            {
                                "title": "function _(ctx3, effect2, { DefineFn, GameStateFn, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn.EffectFn.getCardID(effect2);\n                const prototype2 = GameStateFn.getItemPrototype(ctx3, cardId2);\n                const from = GameStateFn.getItemBaSyou(ctx3, cardId2);\n                ctx3 = GameStateFn.doItemMove(ctx3, DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u3044\\u308B\\u30AB\\u30FC\\u30C9\"), [cardId2, from]);\n                if (prototype2.category == \"\\u30E6\\u30CB\\u30C3\\u30C8\") {\n                  return GameStateFn.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn.EffectFn.getPlayerID(effect2), DefineFn.EffectFn.getCardID(effect2)],\n                    description: effect2.text.description,\n                    text: {\n                      id: effect2.text.id,\n                      description: effect2.text.description,\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect3, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                                const cardId3 = DefineFn2.EffectFn.getCardID(effect3);\n                                const from2 = GameStateFn2.getItemBaSyou(ctx4, cardId3);\n                                const to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\");\n                                ctx4 = GameStateFn2.moveItem(ctx4, to, [cardId3, from2]);\n                                const hasHigh = GameStateFn2.getCardHasSpeicalEffect(ctx4, [\"\\u6226\\u95D8\\u914D\\u5099\"], cardId3);\n                                const hasPS = GameStateFn2.getCardHasSpeicalEffect(ctx4, [\"PS\\u88C5\\u7532\"], cardId3);\n                                const isNoNeedRoll = hasHigh || hasPS;\n                                const isRoll = isNoNeedRoll == false;\n                                ctx4 = GameStateFn2.setItemIsRoll(ctx4, isRoll, [cardId3, to]);\n                                ctx4 = GameStateFn2.triggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                                return ctx4;\n                              }.toString()\n                            }\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30AD\\u30E3\\u30E9\\u30AF\\u30BF\\u30FC\" || prototype2.category == \"\\u30AA\\u30DA\\u30EC\\u30FC\\u30B7\\u30E7\\u30F3(\\u30E6\\u30CB\\u30C3\\u30C8)\") {\n                  return GameStateFn.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn.EffectFn.getPlayerID(effect2), DefineFn.EffectFn.getCardID(effect2)],\n                    description: effect2.text.description,\n                    text: {\n                      id: effect2.text.id,\n                      description: effect2.text.description,\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect3, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                                const cardId3 = DefineFn2.EffectFn.getCardID(effect3);\n                                const pairs = GameStateFn2.getCardTipStrBaSyouPairs(ctx4, \"\\u4E00\\u500B\\u81EA\\u8ECD\\u6A5F\\u9AD4\", cardId3);\n                                const [targetCardId, targetBasyou] = pairs[0];\n                                const from2 = GameStateFn2.getItemBaSyou(ctx4, cardId3);\n                                const to = targetBasyou;\n                                ctx4 = GameStateFn2.moveItem(ctx4, to, [cardId3, from2]);\n                                ctx4 = GameStateFn2.setSetGroupParent(ctx4, targetCardId, cardId3);\n                                ctx4 = GameStateFn2.triggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                                ctx4 = GameStateFn2.triggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u30BB\\u30C3\\u30C8\\u3055\\u308C\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                                return ctx4;\n                              }.toString()\n                            }\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30B3\\u30DE\\u30F3\\u30C9\") {\n                  return GameStateFn.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn.EffectFn.getPlayerID(effect2), DefineFn.EffectFn.getCardID(effect2)],\n                    description: effect2.text.description,\n                    text: {\n                      id: prototype2.commandText?.id || ToolFn2.getUUID(\"getPlayCardEffects\"),\n                      description: prototype2.commandText?.description || \"unknown\",\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect3, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                                const cardId3 = DefineFn2.EffectFn.getCardID(effect3);\n                                const from2 = GameStateFn2.getItemBaSyou(ctx4, cardId3);\n                                const to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u30B8\\u30E3\\u30F3\\u30AF\\u30E4\\u30FC\\u30C9\");\n                                ctx4 = GameStateFn2.moveItem(ctx4, to, [cardId3, from2]);\n                                ctx4 = GameStateFn2.triggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                                return ctx4;\n                              }.toString()\n                            },\n                            ...prototype2.commandText?.logicTreeActions?.[0].actions || []\n                          ]\n                        },\n                        ...prototype2.commandText?.logicTreeActions?.slice(1) || []\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30B0\\u30E9\\u30D5\\u30A3\\u30C3\\u30AF\") {\n                  const cardId3 = DefineFn.EffectFn.getCardID(effect2);\n                  const from2 = GameStateFn.getItemBaSyou(ctx3, cardId3);\n                  const to = DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"G\\u30BE\\u30FC\\u30F3\");\n                  ctx3 = GameStateFn.doItemMove(ctx3, to, [cardId3, from2]);\n                  ctx3 = GameStateFn.triggerEvent(ctx3, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                  return ctx3;\n                }\n                if (prototype2.category == \"\\u30AA\\u30DA\\u30EC\\u30FC\\u30B7\\u30E7\\u30F3\") {\n                  const cardId3 = DefineFn.EffectFn.getCardID(effect2);\n                  const from2 = GameStateFn.getItemBaSyou(ctx3, cardId3);\n                  const to = DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\");\n                  ctx3 = GameStateFn.doItemMove(ctx3, to, [cardId3, from2]);\n                  ctx3 = GameStateFn.triggerEvent(ctx3, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                  return ctx3;\n                }\n                if (prototype2.category == \"ACE\") {\n                  throw new Error(`not support category: ${prototype2.category}`);\n                }\n                return ctx3;\n              }"
                            }
                        ]
                    }
                ]
            }
        },
        {
            "id": "getPlayCardEffects_card_019228a2-b3ab-7aa1-91a7-196333ac1eaa",
            "reason": [
                "PlayCard",
                "PlayerA",
                "card_019228a2-b3ab-7aa1-91a7-196333ac1eaa"
            ],
            "description": "從手中即將出牌, 出牌後會產生場出的效果",
            "text": {
                "id": "getPlayCardEffects_text_card_019228a2-b3ab-7aa1-91a7-196333ac1eaa",
                "title": [
                    "使用型",
                    [
                        "配備フェイズ"
                    ]
                ],
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
                        "actions": [
                            {
                                "title": "function _(ctx3, effect2, { DefineFn, GameStateFn, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn.EffectFn.getCardID(effect2);\n                const prototype2 = GameStateFn.getItemPrototype(ctx3, cardId2);\n                const from = GameStateFn.getItemBaSyou(ctx3, cardId2);\n                ctx3 = GameStateFn.doItemMove(ctx3, DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u3044\\u308B\\u30AB\\u30FC\\u30C9\"), [cardId2, from]);\n                if (prototype2.category == \"\\u30E6\\u30CB\\u30C3\\u30C8\") {\n                  return GameStateFn.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn.EffectFn.getPlayerID(effect2), DefineFn.EffectFn.getCardID(effect2)],\n                    description: effect2.text.description,\n                    text: {\n                      id: effect2.text.id,\n                      description: effect2.text.description,\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect3, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                                const cardId3 = DefineFn2.EffectFn.getCardID(effect3);\n                                const from2 = GameStateFn2.getItemBaSyou(ctx4, cardId3);\n                                const to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\");\n                                ctx4 = GameStateFn2.moveItem(ctx4, to, [cardId3, from2]);\n                                const hasHigh = GameStateFn2.getCardHasSpeicalEffect(ctx4, [\"\\u6226\\u95D8\\u914D\\u5099\"], cardId3);\n                                const hasPS = GameStateFn2.getCardHasSpeicalEffect(ctx4, [\"PS\\u88C5\\u7532\"], cardId3);\n                                const isNoNeedRoll = hasHigh || hasPS;\n                                const isRoll = isNoNeedRoll == false;\n                                ctx4 = GameStateFn2.setItemIsRoll(ctx4, isRoll, [cardId3, to]);\n                                ctx4 = GameStateFn2.triggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                                return ctx4;\n                              }.toString()\n                            }\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30AD\\u30E3\\u30E9\\u30AF\\u30BF\\u30FC\" || prototype2.category == \"\\u30AA\\u30DA\\u30EC\\u30FC\\u30B7\\u30E7\\u30F3(\\u30E6\\u30CB\\u30C3\\u30C8)\") {\n                  return GameStateFn.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn.EffectFn.getPlayerID(effect2), DefineFn.EffectFn.getCardID(effect2)],\n                    description: effect2.text.description,\n                    text: {\n                      id: effect2.text.id,\n                      description: effect2.text.description,\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect3, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                                const cardId3 = DefineFn2.EffectFn.getCardID(effect3);\n                                const pairs = GameStateFn2.getCardTipStrBaSyouPairs(ctx4, \"\\u4E00\\u500B\\u81EA\\u8ECD\\u6A5F\\u9AD4\", cardId3);\n                                const [targetCardId, targetBasyou] = pairs[0];\n                                const from2 = GameStateFn2.getItemBaSyou(ctx4, cardId3);\n                                const to = targetBasyou;\n                                ctx4 = GameStateFn2.moveItem(ctx4, to, [cardId3, from2]);\n                                ctx4 = GameStateFn2.setSetGroupParent(ctx4, targetCardId, cardId3);\n                                ctx4 = GameStateFn2.triggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                                ctx4 = GameStateFn2.triggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u30BB\\u30C3\\u30C8\\u3055\\u308C\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                                return ctx4;\n                              }.toString()\n                            }\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30B3\\u30DE\\u30F3\\u30C9\") {\n                  return GameStateFn.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn.EffectFn.getPlayerID(effect2), DefineFn.EffectFn.getCardID(effect2)],\n                    description: effect2.text.description,\n                    text: {\n                      id: prototype2.commandText?.id || ToolFn2.getUUID(\"getPlayCardEffects\"),\n                      description: prototype2.commandText?.description || \"unknown\",\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect3, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                                const cardId3 = DefineFn2.EffectFn.getCardID(effect3);\n                                const from2 = GameStateFn2.getItemBaSyou(ctx4, cardId3);\n                                const to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u30B8\\u30E3\\u30F3\\u30AF\\u30E4\\u30FC\\u30C9\");\n                                ctx4 = GameStateFn2.moveItem(ctx4, to, [cardId3, from2]);\n                                ctx4 = GameStateFn2.triggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                                return ctx4;\n                              }.toString()\n                            },\n                            ...prototype2.commandText?.logicTreeActions?.[0].actions || []\n                          ]\n                        },\n                        ...prototype2.commandText?.logicTreeActions?.slice(1) || []\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30B0\\u30E9\\u30D5\\u30A3\\u30C3\\u30AF\") {\n                  const cardId3 = DefineFn.EffectFn.getCardID(effect2);\n                  const from2 = GameStateFn.getItemBaSyou(ctx3, cardId3);\n                  const to = DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"G\\u30BE\\u30FC\\u30F3\");\n                  ctx3 = GameStateFn.doItemMove(ctx3, to, [cardId3, from2]);\n                  ctx3 = GameStateFn.triggerEvent(ctx3, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                  return ctx3;\n                }\n                if (prototype2.category == \"\\u30AA\\u30DA\\u30EC\\u30FC\\u30B7\\u30E7\\u30F3\") {\n                  const cardId3 = DefineFn.EffectFn.getCardID(effect2);\n                  const from2 = GameStateFn.getItemBaSyou(ctx3, cardId3);\n                  const to = DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\");\n                  ctx3 = GameStateFn.doItemMove(ctx3, to, [cardId3, from2]);\n                  ctx3 = GameStateFn.triggerEvent(ctx3, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                  return ctx3;\n                }\n                if (prototype2.category == \"ACE\") {\n                  throw new Error(`not support category: ${prototype2.category}`);\n                }\n                return ctx3;\n              }"
                            }
                        ]
                    }
                ]
            }
        },
        {
            "id": "getPlayCardEffects_card_019228a2-b3ab-7aa1-91a7-77a446c6f951",
            "reason": [
                "PlayCard",
                "PlayerA",
                "card_019228a2-b3ab-7aa1-91a7-77a446c6f951"
            ],
            "description": "從手中即將出牌, 出牌後會產生場出的效果",
            "text": {
                "id": "getPlayCardEffects_text_card_019228a2-b3ab-7aa1-91a7-77a446c6f951",
                "title": [
                    "使用型",
                    [
                        "配備フェイズ"
                    ]
                ],
                "description": "從手中即將出牌, 出牌後會產生場出的效果",
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
                    "黒X": {
                        "title": [
                            "RollColor",
                            "黒"
                        ]
                    }
                },
                "logicTreeActions": [
                    {
                        "actions": [
                            {
                                "title": "function _(ctx3, effect2, { DefineFn, GameStateFn, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn.EffectFn.getCardID(effect2);\n                const prototype2 = GameStateFn.getItemPrototype(ctx3, cardId2);\n                const from = GameStateFn.getItemBaSyou(ctx3, cardId2);\n                ctx3 = GameStateFn.doItemMove(ctx3, DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u3044\\u308B\\u30AB\\u30FC\\u30C9\"), [cardId2, from]);\n                if (prototype2.category == \"\\u30E6\\u30CB\\u30C3\\u30C8\") {\n                  return GameStateFn.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn.EffectFn.getPlayerID(effect2), DefineFn.EffectFn.getCardID(effect2)],\n                    description: effect2.text.description,\n                    text: {\n                      id: effect2.text.id,\n                      description: effect2.text.description,\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect3, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                                const cardId3 = DefineFn2.EffectFn.getCardID(effect3);\n                                const from2 = GameStateFn2.getItemBaSyou(ctx4, cardId3);\n                                const to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\");\n                                ctx4 = GameStateFn2.moveItem(ctx4, to, [cardId3, from2]);\n                                const hasHigh = GameStateFn2.getCardHasSpeicalEffect(ctx4, [\"\\u6226\\u95D8\\u914D\\u5099\"], cardId3);\n                                const hasPS = GameStateFn2.getCardHasSpeicalEffect(ctx4, [\"PS\\u88C5\\u7532\"], cardId3);\n                                const isNoNeedRoll = hasHigh || hasPS;\n                                const isRoll = isNoNeedRoll == false;\n                                ctx4 = GameStateFn2.setItemIsRoll(ctx4, isRoll, [cardId3, to]);\n                                ctx4 = GameStateFn2.triggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                                return ctx4;\n                              }.toString()\n                            }\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30AD\\u30E3\\u30E9\\u30AF\\u30BF\\u30FC\" || prototype2.category == \"\\u30AA\\u30DA\\u30EC\\u30FC\\u30B7\\u30E7\\u30F3(\\u30E6\\u30CB\\u30C3\\u30C8)\") {\n                  return GameStateFn.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn.EffectFn.getPlayerID(effect2), DefineFn.EffectFn.getCardID(effect2)],\n                    description: effect2.text.description,\n                    text: {\n                      id: effect2.text.id,\n                      description: effect2.text.description,\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect3, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                                const cardId3 = DefineFn2.EffectFn.getCardID(effect3);\n                                const pairs = GameStateFn2.getCardTipStrBaSyouPairs(ctx4, \"\\u4E00\\u500B\\u81EA\\u8ECD\\u6A5F\\u9AD4\", cardId3);\n                                const [targetCardId, targetBasyou] = pairs[0];\n                                const from2 = GameStateFn2.getItemBaSyou(ctx4, cardId3);\n                                const to = targetBasyou;\n                                ctx4 = GameStateFn2.moveItem(ctx4, to, [cardId3, from2]);\n                                ctx4 = GameStateFn2.setSetGroupParent(ctx4, targetCardId, cardId3);\n                                ctx4 = GameStateFn2.triggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                                ctx4 = GameStateFn2.triggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u30BB\\u30C3\\u30C8\\u3055\\u308C\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                                return ctx4;\n                              }.toString()\n                            }\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30B3\\u30DE\\u30F3\\u30C9\") {\n                  return GameStateFn.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn.EffectFn.getPlayerID(effect2), DefineFn.EffectFn.getCardID(effect2)],\n                    description: effect2.text.description,\n                    text: {\n                      id: prototype2.commandText?.id || ToolFn2.getUUID(\"getPlayCardEffects\"),\n                      description: prototype2.commandText?.description || \"unknown\",\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect3, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                                const cardId3 = DefineFn2.EffectFn.getCardID(effect3);\n                                const from2 = GameStateFn2.getItemBaSyou(ctx4, cardId3);\n                                const to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u30B8\\u30E3\\u30F3\\u30AF\\u30E4\\u30FC\\u30C9\");\n                                ctx4 = GameStateFn2.moveItem(ctx4, to, [cardId3, from2]);\n                                ctx4 = GameStateFn2.triggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                                return ctx4;\n                              }.toString()\n                            },\n                            ...prototype2.commandText?.logicTreeActions?.[0].actions || []\n                          ]\n                        },\n                        ...prototype2.commandText?.logicTreeActions?.slice(1) || []\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30B0\\u30E9\\u30D5\\u30A3\\u30C3\\u30AF\") {\n                  const cardId3 = DefineFn.EffectFn.getCardID(effect2);\n                  const from2 = GameStateFn.getItemBaSyou(ctx3, cardId3);\n                  const to = DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"G\\u30BE\\u30FC\\u30F3\");\n                  ctx3 = GameStateFn.doItemMove(ctx3, to, [cardId3, from2]);\n                  ctx3 = GameStateFn.triggerEvent(ctx3, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                  return ctx3;\n                }\n                if (prototype2.category == \"\\u30AA\\u30DA\\u30EC\\u30FC\\u30B7\\u30E7\\u30F3\") {\n                  const cardId3 = DefineFn.EffectFn.getCardID(effect2);\n                  const from2 = GameStateFn.getItemBaSyou(ctx3, cardId3);\n                  const to = DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\");\n                  ctx3 = GameStateFn.doItemMove(ctx3, to, [cardId3, from2]);\n                  ctx3 = GameStateFn.triggerEvent(ctx3, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                  return ctx3;\n                }\n                if (prototype2.category == \"ACE\") {\n                  throw new Error(`not support category: ${prototype2.category}`);\n                }\n                return ctx3;\n              }"
                            }
                        ]
                    }
                ]
            }
        },
        {
            "id": "getPlayGEffects_card_019228a2-b3ab-7aa1-91a6-e0d7ad289950",
            "reason": [
                "PlayCard",
                "PlayerA",
                "card_019228a2-b3ab-7aa1-91a6-e0d7ad289950"
            ],
            "description": "PlayG",
            "text": {
                "id": "getPlayGEffects_text_card_019228a2-b3ab-7aa1-91a6-e0d7ad289950",
                "title": [],
                "conditions": {
                    "出G上限": {
                        "actions": [
                            {
                                "title": "function _(ctx3, effect5, { DefineFn: DefineFn2, GameStateFn: GameStateFn2, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn2.EffectFn.getCardID(effect5);\n                const cardController = GameStateFn2.getItemController(ctx3, cardId2);\n                const ps = GameStateFn2.getPlayerState(ctx3, cardController);\n                if (ps.playGCount > 0) {\n                  throw new DefineFn2.GameError(`\\u51FAG\\u4E0A\\u9650: ${ps.playGCount}`);\n                }\n                ctx3 = GameStateFn2.mapPlayerState(ctx3, cardController, (ps2) => {\n                  return {\n                    ...ps2,\n                    playGCount: ps2.playGCount + 1\n                  };\n                });\n                return ctx3;\n              }"
                            }
                        ]
                    }
                },
                "logicTreeActions": [
                    {
                        "actions": [
                            {
                                "title": "function _(ctx3, effect5, { DefineFn: DefineFn2, GameStateFn: GameStateFn2, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn2.EffectFn.getCardID(effect5);\n                const from = GameStateFn2.getItemBaSyou(ctx3, cardId2);\n                ctx3 = GameStateFn2.moveItem(ctx3, DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"G\\u30BE\\u30FC\\u30F3\"), [cardId2, from]);\n                return ctx3;\n              }"
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
        {
            "id": "getPlayGEffects_card_019228a2-b3ab-7aa1-91a7-07cdb0200b42",
            "reason": [
                "PlayCard",
                "PlayerA",
                "card_019228a2-b3ab-7aa1-91a7-07cdb0200b42"
            ],
            "description": "PlayG",
            "text": {
                "id": "getPlayGEffects_text_card_019228a2-b3ab-7aa1-91a7-07cdb0200b42",
                "title": [],
                "conditions": {
                    "出G上限": {
                        "actions": [
                            {
                                "title": "function _(ctx3, effect5, { DefineFn: DefineFn2, GameStateFn: GameStateFn2, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn2.EffectFn.getCardID(effect5);\n                const cardController = GameStateFn2.getItemController(ctx3, cardId2);\n                const ps = GameStateFn2.getPlayerState(ctx3, cardController);\n                if (ps.playGCount > 0) {\n                  throw new DefineFn2.GameError(`\\u51FAG\\u4E0A\\u9650: ${ps.playGCount}`);\n                }\n                ctx3 = GameStateFn2.mapPlayerState(ctx3, cardController, (ps2) => {\n                  return {\n                    ...ps2,\n                    playGCount: ps2.playGCount + 1\n                  };\n                });\n                return ctx3;\n              }"
                            }
                        ]
                    }
                },
                "logicTreeActions": [
                    {
                        "actions": [
                            {
                                "title": "function _(ctx3, effect5, { DefineFn: DefineFn2, GameStateFn: GameStateFn2, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn2.EffectFn.getCardID(effect5);\n                const from = GameStateFn2.getItemBaSyou(ctx3, cardId2);\n                ctx3 = GameStateFn2.moveItem(ctx3, DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"G\\u30BE\\u30FC\\u30F3\"), [cardId2, from]);\n                return ctx3;\n              }"
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
        {
            "id": "getPlayGEffects_card_019228a2-b3ab-7aa1-91a7-6ec3adb08642",
            "reason": [
                "PlayCard",
                "PlayerA",
                "card_019228a2-b3ab-7aa1-91a7-6ec3adb08642"
            ],
            "description": "PlayG",
            "text": {
                "id": "getPlayGEffects_text_card_019228a2-b3ab-7aa1-91a7-6ec3adb08642",
                "title": [],
                "conditions": {
                    "出G上限": {
                        "actions": [
                            {
                                "title": "function _(ctx3, effect5, { DefineFn: DefineFn2, GameStateFn: GameStateFn2, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn2.EffectFn.getCardID(effect5);\n                const cardController = GameStateFn2.getItemController(ctx3, cardId2);\n                const ps = GameStateFn2.getPlayerState(ctx3, cardController);\n                if (ps.playGCount > 0) {\n                  throw new DefineFn2.GameError(`\\u51FAG\\u4E0A\\u9650: ${ps.playGCount}`);\n                }\n                ctx3 = GameStateFn2.mapPlayerState(ctx3, cardController, (ps2) => {\n                  return {\n                    ...ps2,\n                    playGCount: ps2.playGCount + 1\n                  };\n                });\n                return ctx3;\n              }"
                            }
                        ]
                    }
                },
                "logicTreeActions": [
                    {
                        "actions": [
                            {
                                "title": "function _(ctx3, effect5, { DefineFn: DefineFn2, GameStateFn: GameStateFn2, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn2.EffectFn.getCardID(effect5);\n                const from = GameStateFn2.getItemBaSyou(ctx3, cardId2);\n                ctx3 = GameStateFn2.moveItem(ctx3, DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"G\\u30BE\\u30FC\\u30F3\"), [cardId2, from]);\n                return ctx3;\n              }"
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
        {
            "id": "getPlayGEffects_card_019228a2-b3ab-7aa1-91a7-196333ac1eaa",
            "reason": [
                "PlayCard",
                "PlayerA",
                "card_019228a2-b3ab-7aa1-91a7-196333ac1eaa"
            ],
            "description": "PlayG",
            "text": {
                "id": "getPlayGEffects_text_card_019228a2-b3ab-7aa1-91a7-196333ac1eaa",
                "title": [],
                "conditions": {
                    "出G上限": {
                        "actions": [
                            {
                                "title": "function _(ctx3, effect5, { DefineFn: DefineFn2, GameStateFn: GameStateFn2, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn2.EffectFn.getCardID(effect5);\n                const cardController = GameStateFn2.getItemController(ctx3, cardId2);\n                const ps = GameStateFn2.getPlayerState(ctx3, cardController);\n                if (ps.playGCount > 0) {\n                  throw new DefineFn2.GameError(`\\u51FAG\\u4E0A\\u9650: ${ps.playGCount}`);\n                }\n                ctx3 = GameStateFn2.mapPlayerState(ctx3, cardController, (ps2) => {\n                  return {\n                    ...ps2,\n                    playGCount: ps2.playGCount + 1\n                  };\n                });\n                return ctx3;\n              }"
                            }
                        ]
                    }
                },
                "logicTreeActions": [
                    {
                        "actions": [
                            {
                                "title": "function _(ctx3, effect5, { DefineFn: DefineFn2, GameStateFn: GameStateFn2, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn2.EffectFn.getCardID(effect5);\n                const from = GameStateFn2.getItemBaSyou(ctx3, cardId2);\n                ctx3 = GameStateFn2.moveItem(ctx3, DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"G\\u30BE\\u30FC\\u30F3\"), [cardId2, from]);\n                return ctx3;\n              }"
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
        {
            "id": "getPlayGEffects_card_019228a2-b3ab-7aa1-91a7-77a446c6f951",
            "reason": [
                "PlayCard",
                "PlayerA",
                "card_019228a2-b3ab-7aa1-91a7-77a446c6f951"
            ],
            "description": "PlayG",
            "text": {
                "id": "getPlayGEffects_text_card_019228a2-b3ab-7aa1-91a7-77a446c6f951",
                "title": [],
                "conditions": {
                    "出G上限": {
                        "actions": [
                            {
                                "title": "function _(ctx3, effect5, { DefineFn: DefineFn2, GameStateFn: GameStateFn2, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn2.EffectFn.getCardID(effect5);\n                const cardController = GameStateFn2.getItemController(ctx3, cardId2);\n                const ps = GameStateFn2.getPlayerState(ctx3, cardController);\n                if (ps.playGCount > 0) {\n                  throw new DefineFn2.GameError(`\\u51FAG\\u4E0A\\u9650: ${ps.playGCount}`);\n                }\n                ctx3 = GameStateFn2.mapPlayerState(ctx3, cardController, (ps2) => {\n                  return {\n                    ...ps2,\n                    playGCount: ps2.playGCount + 1\n                  };\n                });\n                return ctx3;\n              }"
                            }
                        ]
                    }
                },
                "logicTreeActions": [
                    {
                        "actions": [
                            {
                                "title": "function _(ctx3, effect5, { DefineFn: DefineFn2, GameStateFn: GameStateFn2, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn2.EffectFn.getCardID(effect5);\n                const from = GameStateFn2.getItemBaSyou(ctx3, cardId2);\n                ctx3 = GameStateFn2.moveItem(ctx3, DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"G\\u30BE\\u30FC\\u30F3\"), [cardId2, from]);\n                return ctx3;\n              }"
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
        {
            "id": "getPlayCardEffects_card_019228a2-b3ab-7aa1-91a8-96efcf686494",
            "reason": [
                "PlayCard",
                "PlayerB",
                "card_019228a2-b3ab-7aa1-91a8-96efcf686494"
            ],
            "description": "從手中即將出牌, 出牌後會產生場出的效果",
            "text": {
                "id": "getPlayCardEffects_text_card_019228a2-b3ab-7aa1-91a8-96efcf686494",
                "title": [
                    "使用型",
                    [
                        "配備フェイズ"
                    ]
                ],
                "description": "從手中即將出牌, 出牌後會產生場出的效果",
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
                    },
                    "2[黒]": {
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
                                    "2[黒]"
                                ]
                            }
                        ]
                    }
                },
                "logicTreeActions": [
                    {
                        "actions": [
                            {
                                "title": "function _(ctx3, effect2, { DefineFn, GameStateFn, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn.EffectFn.getCardID(effect2);\n                const prototype2 = GameStateFn.getItemPrototype(ctx3, cardId2);\n                const from = GameStateFn.getItemBaSyou(ctx3, cardId2);\n                ctx3 = GameStateFn.doItemMove(ctx3, DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u3044\\u308B\\u30AB\\u30FC\\u30C9\"), [cardId2, from]);\n                if (prototype2.category == \"\\u30E6\\u30CB\\u30C3\\u30C8\") {\n                  return GameStateFn.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn.EffectFn.getPlayerID(effect2), DefineFn.EffectFn.getCardID(effect2)],\n                    description: effect2.text.description,\n                    text: {\n                      id: effect2.text.id,\n                      description: effect2.text.description,\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect3, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                                const cardId3 = DefineFn2.EffectFn.getCardID(effect3);\n                                const from2 = GameStateFn2.getItemBaSyou(ctx4, cardId3);\n                                const to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\");\n                                ctx4 = GameStateFn2.moveItem(ctx4, to, [cardId3, from2]);\n                                const hasHigh = GameStateFn2.getCardHasSpeicalEffect(ctx4, [\"\\u6226\\u95D8\\u914D\\u5099\"], cardId3);\n                                const hasPS = GameStateFn2.getCardHasSpeicalEffect(ctx4, [\"PS\\u88C5\\u7532\"], cardId3);\n                                const isNoNeedRoll = hasHigh || hasPS;\n                                const isRoll = isNoNeedRoll == false;\n                                ctx4 = GameStateFn2.setItemIsRoll(ctx4, isRoll, [cardId3, to]);\n                                ctx4 = GameStateFn2.triggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                                return ctx4;\n                              }.toString()\n                            }\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30AD\\u30E3\\u30E9\\u30AF\\u30BF\\u30FC\" || prototype2.category == \"\\u30AA\\u30DA\\u30EC\\u30FC\\u30B7\\u30E7\\u30F3(\\u30E6\\u30CB\\u30C3\\u30C8)\") {\n                  return GameStateFn.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn.EffectFn.getPlayerID(effect2), DefineFn.EffectFn.getCardID(effect2)],\n                    description: effect2.text.description,\n                    text: {\n                      id: effect2.text.id,\n                      description: effect2.text.description,\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect3, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                                const cardId3 = DefineFn2.EffectFn.getCardID(effect3);\n                                const pairs = GameStateFn2.getCardTipStrBaSyouPairs(ctx4, \"\\u4E00\\u500B\\u81EA\\u8ECD\\u6A5F\\u9AD4\", cardId3);\n                                const [targetCardId, targetBasyou] = pairs[0];\n                                const from2 = GameStateFn2.getItemBaSyou(ctx4, cardId3);\n                                const to = targetBasyou;\n                                ctx4 = GameStateFn2.moveItem(ctx4, to, [cardId3, from2]);\n                                ctx4 = GameStateFn2.setSetGroupParent(ctx4, targetCardId, cardId3);\n                                ctx4 = GameStateFn2.triggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                                ctx4 = GameStateFn2.triggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u30BB\\u30C3\\u30C8\\u3055\\u308C\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                                return ctx4;\n                              }.toString()\n                            }\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30B3\\u30DE\\u30F3\\u30C9\") {\n                  return GameStateFn.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn.EffectFn.getPlayerID(effect2), DefineFn.EffectFn.getCardID(effect2)],\n                    description: effect2.text.description,\n                    text: {\n                      id: prototype2.commandText?.id || ToolFn2.getUUID(\"getPlayCardEffects\"),\n                      description: prototype2.commandText?.description || \"unknown\",\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect3, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                                const cardId3 = DefineFn2.EffectFn.getCardID(effect3);\n                                const from2 = GameStateFn2.getItemBaSyou(ctx4, cardId3);\n                                const to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u30B8\\u30E3\\u30F3\\u30AF\\u30E4\\u30FC\\u30C9\");\n                                ctx4 = GameStateFn2.moveItem(ctx4, to, [cardId3, from2]);\n                                ctx4 = GameStateFn2.triggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                                return ctx4;\n                              }.toString()\n                            },\n                            ...prototype2.commandText?.logicTreeActions?.[0].actions || []\n                          ]\n                        },\n                        ...prototype2.commandText?.logicTreeActions?.slice(1) || []\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30B0\\u30E9\\u30D5\\u30A3\\u30C3\\u30AF\") {\n                  const cardId3 = DefineFn.EffectFn.getCardID(effect2);\n                  const from2 = GameStateFn.getItemBaSyou(ctx3, cardId3);\n                  const to = DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"G\\u30BE\\u30FC\\u30F3\");\n                  ctx3 = GameStateFn.doItemMove(ctx3, to, [cardId3, from2]);\n                  ctx3 = GameStateFn.triggerEvent(ctx3, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                  return ctx3;\n                }\n                if (prototype2.category == \"\\u30AA\\u30DA\\u30EC\\u30FC\\u30B7\\u30E7\\u30F3\") {\n                  const cardId3 = DefineFn.EffectFn.getCardID(effect2);\n                  const from2 = GameStateFn.getItemBaSyou(ctx3, cardId3);\n                  const to = DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\");\n                  ctx3 = GameStateFn.doItemMove(ctx3, to, [cardId3, from2]);\n                  ctx3 = GameStateFn.triggerEvent(ctx3, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                  return ctx3;\n                }\n                if (prototype2.category == \"ACE\") {\n                  throw new Error(`not support category: ${prototype2.category}`);\n                }\n                return ctx3;\n              }"
                            }
                        ]
                    }
                ]
            }
        },
        {
            "id": "getPlayCardEffects_card_019228a2-b3ab-7aa1-91a8-bad0822cb2b5",
            "reason": [
                "PlayCard",
                "PlayerB",
                "card_019228a2-b3ab-7aa1-91a8-bad0822cb2b5"
            ],
            "description": "從手中即將出牌, 出牌後會產生場出的效果",
            "text": {
                "id": "getPlayCardEffects_text_card_019228a2-b3ab-7aa1-91a8-bad0822cb2b5",
                "title": [
                    "使用型",
                    [
                        "配備フェイズ"
                    ]
                ],
                "description": "從手中即將出牌, 出牌後會產生場出的效果",
                "conditions": {
                    "合計国力〔x〕": {
                        "actions": [
                            {
                                "title": [
                                    "合計国力〔x〕",
                                    2
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
                        "actions": [
                            {
                                "title": "function _(ctx3, effect2, { DefineFn, GameStateFn, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn.EffectFn.getCardID(effect2);\n                const prototype2 = GameStateFn.getItemPrototype(ctx3, cardId2);\n                const from = GameStateFn.getItemBaSyou(ctx3, cardId2);\n                ctx3 = GameStateFn.doItemMove(ctx3, DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u3044\\u308B\\u30AB\\u30FC\\u30C9\"), [cardId2, from]);\n                if (prototype2.category == \"\\u30E6\\u30CB\\u30C3\\u30C8\") {\n                  return GameStateFn.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn.EffectFn.getPlayerID(effect2), DefineFn.EffectFn.getCardID(effect2)],\n                    description: effect2.text.description,\n                    text: {\n                      id: effect2.text.id,\n                      description: effect2.text.description,\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect3, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                                const cardId3 = DefineFn2.EffectFn.getCardID(effect3);\n                                const from2 = GameStateFn2.getItemBaSyou(ctx4, cardId3);\n                                const to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\");\n                                ctx4 = GameStateFn2.moveItem(ctx4, to, [cardId3, from2]);\n                                const hasHigh = GameStateFn2.getCardHasSpeicalEffect(ctx4, [\"\\u6226\\u95D8\\u914D\\u5099\"], cardId3);\n                                const hasPS = GameStateFn2.getCardHasSpeicalEffect(ctx4, [\"PS\\u88C5\\u7532\"], cardId3);\n                                const isNoNeedRoll = hasHigh || hasPS;\n                                const isRoll = isNoNeedRoll == false;\n                                ctx4 = GameStateFn2.setItemIsRoll(ctx4, isRoll, [cardId3, to]);\n                                ctx4 = GameStateFn2.triggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                                return ctx4;\n                              }.toString()\n                            }\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30AD\\u30E3\\u30E9\\u30AF\\u30BF\\u30FC\" || prototype2.category == \"\\u30AA\\u30DA\\u30EC\\u30FC\\u30B7\\u30E7\\u30F3(\\u30E6\\u30CB\\u30C3\\u30C8)\") {\n                  return GameStateFn.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn.EffectFn.getPlayerID(effect2), DefineFn.EffectFn.getCardID(effect2)],\n                    description: effect2.text.description,\n                    text: {\n                      id: effect2.text.id,\n                      description: effect2.text.description,\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect3, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                                const cardId3 = DefineFn2.EffectFn.getCardID(effect3);\n                                const pairs = GameStateFn2.getCardTipStrBaSyouPairs(ctx4, \"\\u4E00\\u500B\\u81EA\\u8ECD\\u6A5F\\u9AD4\", cardId3);\n                                const [targetCardId, targetBasyou] = pairs[0];\n                                const from2 = GameStateFn2.getItemBaSyou(ctx4, cardId3);\n                                const to = targetBasyou;\n                                ctx4 = GameStateFn2.moveItem(ctx4, to, [cardId3, from2]);\n                                ctx4 = GameStateFn2.setSetGroupParent(ctx4, targetCardId, cardId3);\n                                ctx4 = GameStateFn2.triggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                                ctx4 = GameStateFn2.triggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u30BB\\u30C3\\u30C8\\u3055\\u308C\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                                return ctx4;\n                              }.toString()\n                            }\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30B3\\u30DE\\u30F3\\u30C9\") {\n                  return GameStateFn.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn.EffectFn.getPlayerID(effect2), DefineFn.EffectFn.getCardID(effect2)],\n                    description: effect2.text.description,\n                    text: {\n                      id: prototype2.commandText?.id || ToolFn2.getUUID(\"getPlayCardEffects\"),\n                      description: prototype2.commandText?.description || \"unknown\",\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect3, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                                const cardId3 = DefineFn2.EffectFn.getCardID(effect3);\n                                const from2 = GameStateFn2.getItemBaSyou(ctx4, cardId3);\n                                const to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u30B8\\u30E3\\u30F3\\u30AF\\u30E4\\u30FC\\u30C9\");\n                                ctx4 = GameStateFn2.moveItem(ctx4, to, [cardId3, from2]);\n                                ctx4 = GameStateFn2.triggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                                return ctx4;\n                              }.toString()\n                            },\n                            ...prototype2.commandText?.logicTreeActions?.[0].actions || []\n                          ]\n                        },\n                        ...prototype2.commandText?.logicTreeActions?.slice(1) || []\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30B0\\u30E9\\u30D5\\u30A3\\u30C3\\u30AF\") {\n                  const cardId3 = DefineFn.EffectFn.getCardID(effect2);\n                  const from2 = GameStateFn.getItemBaSyou(ctx3, cardId3);\n                  const to = DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"G\\u30BE\\u30FC\\u30F3\");\n                  ctx3 = GameStateFn.doItemMove(ctx3, to, [cardId3, from2]);\n                  ctx3 = GameStateFn.triggerEvent(ctx3, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                  return ctx3;\n                }\n                if (prototype2.category == \"\\u30AA\\u30DA\\u30EC\\u30FC\\u30B7\\u30E7\\u30F3\") {\n                  const cardId3 = DefineFn.EffectFn.getCardID(effect2);\n                  const from2 = GameStateFn.getItemBaSyou(ctx3, cardId3);\n                  const to = DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\");\n                  ctx3 = GameStateFn.doItemMove(ctx3, to, [cardId3, from2]);\n                  ctx3 = GameStateFn.triggerEvent(ctx3, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                  return ctx3;\n                }\n                if (prototype2.category == \"ACE\") {\n                  throw new Error(`not support category: ${prototype2.category}`);\n                }\n                return ctx3;\n              }"
                            }
                        ]
                    }
                ]
            }
        },
        {
            "id": "getPlayCardEffects_card_019228a2-b3ab-7aa1-91a8-6c879ad38bb0",
            "reason": [
                "PlayCard",
                "PlayerB",
                "card_019228a2-b3ab-7aa1-91a8-6c879ad38bb0"
            ],
            "description": "從手中即將出牌, 出牌後會產生場出的效果",
            "text": {
                "id": "getPlayCardEffects_text_card_019228a2-b3ab-7aa1-91a8-6c879ad38bb0",
                "title": [
                    "使用型",
                    [
                        "配備フェイズ"
                    ]
                ],
                "description": "從手中即將出牌, 出牌後會產生場出的效果",
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
                    },
                    "2[黒]": {
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
                                    "2[黒]"
                                ]
                            }
                        ]
                    }
                },
                "logicTreeActions": [
                    {
                        "actions": [
                            {
                                "title": "function _(ctx3, effect2, { DefineFn, GameStateFn, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn.EffectFn.getCardID(effect2);\n                const prototype2 = GameStateFn.getItemPrototype(ctx3, cardId2);\n                const from = GameStateFn.getItemBaSyou(ctx3, cardId2);\n                ctx3 = GameStateFn.doItemMove(ctx3, DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u3044\\u308B\\u30AB\\u30FC\\u30C9\"), [cardId2, from]);\n                if (prototype2.category == \"\\u30E6\\u30CB\\u30C3\\u30C8\") {\n                  return GameStateFn.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn.EffectFn.getPlayerID(effect2), DefineFn.EffectFn.getCardID(effect2)],\n                    description: effect2.text.description,\n                    text: {\n                      id: effect2.text.id,\n                      description: effect2.text.description,\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect3, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                                const cardId3 = DefineFn2.EffectFn.getCardID(effect3);\n                                const from2 = GameStateFn2.getItemBaSyou(ctx4, cardId3);\n                                const to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\");\n                                ctx4 = GameStateFn2.moveItem(ctx4, to, [cardId3, from2]);\n                                const hasHigh = GameStateFn2.getCardHasSpeicalEffect(ctx4, [\"\\u6226\\u95D8\\u914D\\u5099\"], cardId3);\n                                const hasPS = GameStateFn2.getCardHasSpeicalEffect(ctx4, [\"PS\\u88C5\\u7532\"], cardId3);\n                                const isNoNeedRoll = hasHigh || hasPS;\n                                const isRoll = isNoNeedRoll == false;\n                                ctx4 = GameStateFn2.setItemIsRoll(ctx4, isRoll, [cardId3, to]);\n                                ctx4 = GameStateFn2.triggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                                return ctx4;\n                              }.toString()\n                            }\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30AD\\u30E3\\u30E9\\u30AF\\u30BF\\u30FC\" || prototype2.category == \"\\u30AA\\u30DA\\u30EC\\u30FC\\u30B7\\u30E7\\u30F3(\\u30E6\\u30CB\\u30C3\\u30C8)\") {\n                  return GameStateFn.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn.EffectFn.getPlayerID(effect2), DefineFn.EffectFn.getCardID(effect2)],\n                    description: effect2.text.description,\n                    text: {\n                      id: effect2.text.id,\n                      description: effect2.text.description,\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect3, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                                const cardId3 = DefineFn2.EffectFn.getCardID(effect3);\n                                const pairs = GameStateFn2.getCardTipStrBaSyouPairs(ctx4, \"\\u4E00\\u500B\\u81EA\\u8ECD\\u6A5F\\u9AD4\", cardId3);\n                                const [targetCardId, targetBasyou] = pairs[0];\n                                const from2 = GameStateFn2.getItemBaSyou(ctx4, cardId3);\n                                const to = targetBasyou;\n                                ctx4 = GameStateFn2.moveItem(ctx4, to, [cardId3, from2]);\n                                ctx4 = GameStateFn2.setSetGroupParent(ctx4, targetCardId, cardId3);\n                                ctx4 = GameStateFn2.triggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                                ctx4 = GameStateFn2.triggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u30BB\\u30C3\\u30C8\\u3055\\u308C\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                                return ctx4;\n                              }.toString()\n                            }\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30B3\\u30DE\\u30F3\\u30C9\") {\n                  return GameStateFn.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn.EffectFn.getPlayerID(effect2), DefineFn.EffectFn.getCardID(effect2)],\n                    description: effect2.text.description,\n                    text: {\n                      id: prototype2.commandText?.id || ToolFn2.getUUID(\"getPlayCardEffects\"),\n                      description: prototype2.commandText?.description || \"unknown\",\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect3, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                                const cardId3 = DefineFn2.EffectFn.getCardID(effect3);\n                                const from2 = GameStateFn2.getItemBaSyou(ctx4, cardId3);\n                                const to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u30B8\\u30E3\\u30F3\\u30AF\\u30E4\\u30FC\\u30C9\");\n                                ctx4 = GameStateFn2.moveItem(ctx4, to, [cardId3, from2]);\n                                ctx4 = GameStateFn2.triggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                                return ctx4;\n                              }.toString()\n                            },\n                            ...prototype2.commandText?.logicTreeActions?.[0].actions || []\n                          ]\n                        },\n                        ...prototype2.commandText?.logicTreeActions?.slice(1) || []\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30B0\\u30E9\\u30D5\\u30A3\\u30C3\\u30AF\") {\n                  const cardId3 = DefineFn.EffectFn.getCardID(effect2);\n                  const from2 = GameStateFn.getItemBaSyou(ctx3, cardId3);\n                  const to = DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"G\\u30BE\\u30FC\\u30F3\");\n                  ctx3 = GameStateFn.doItemMove(ctx3, to, [cardId3, from2]);\n                  ctx3 = GameStateFn.triggerEvent(ctx3, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                  return ctx3;\n                }\n                if (prototype2.category == \"\\u30AA\\u30DA\\u30EC\\u30FC\\u30B7\\u30E7\\u30F3\") {\n                  const cardId3 = DefineFn.EffectFn.getCardID(effect2);\n                  const from2 = GameStateFn.getItemBaSyou(ctx3, cardId3);\n                  const to = DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\");\n                  ctx3 = GameStateFn.doItemMove(ctx3, to, [cardId3, from2]);\n                  ctx3 = GameStateFn.triggerEvent(ctx3, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                  return ctx3;\n                }\n                if (prototype2.category == \"ACE\") {\n                  throw new Error(`not support category: ${prototype2.category}`);\n                }\n                return ctx3;\n              }"
                            }
                        ]
                    }
                ]
            }
        },
        {
            "id": "getPlayCardEffects_card_019228a2-b3ab-7aa1-91a8-5a60314f7e0e",
            "reason": [
                "PlayCard",
                "PlayerB",
                "card_019228a2-b3ab-7aa1-91a8-5a60314f7e0e"
            ],
            "description": "從手中即將出牌, 出牌後會產生場出的效果",
            "text": {
                "id": "getPlayCardEffects_text_card_019228a2-b3ab-7aa1-91a8-5a60314f7e0e",
                "title": [
                    "使用型",
                    [
                        "配備フェイズ"
                    ]
                ],
                "description": "從手中即將出牌, 出牌後會產生場出的效果",
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
                        "actions": [
                            {
                                "title": "function _(ctx3, effect2, { DefineFn, GameStateFn, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn.EffectFn.getCardID(effect2);\n                const prototype2 = GameStateFn.getItemPrototype(ctx3, cardId2);\n                const from = GameStateFn.getItemBaSyou(ctx3, cardId2);\n                ctx3 = GameStateFn.doItemMove(ctx3, DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u3044\\u308B\\u30AB\\u30FC\\u30C9\"), [cardId2, from]);\n                if (prototype2.category == \"\\u30E6\\u30CB\\u30C3\\u30C8\") {\n                  return GameStateFn.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn.EffectFn.getPlayerID(effect2), DefineFn.EffectFn.getCardID(effect2)],\n                    description: effect2.text.description,\n                    text: {\n                      id: effect2.text.id,\n                      description: effect2.text.description,\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect3, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                                const cardId3 = DefineFn2.EffectFn.getCardID(effect3);\n                                const from2 = GameStateFn2.getItemBaSyou(ctx4, cardId3);\n                                const to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\");\n                                ctx4 = GameStateFn2.moveItem(ctx4, to, [cardId3, from2]);\n                                const hasHigh = GameStateFn2.getCardHasSpeicalEffect(ctx4, [\"\\u6226\\u95D8\\u914D\\u5099\"], cardId3);\n                                const hasPS = GameStateFn2.getCardHasSpeicalEffect(ctx4, [\"PS\\u88C5\\u7532\"], cardId3);\n                                const isNoNeedRoll = hasHigh || hasPS;\n                                const isRoll = isNoNeedRoll == false;\n                                ctx4 = GameStateFn2.setItemIsRoll(ctx4, isRoll, [cardId3, to]);\n                                ctx4 = GameStateFn2.triggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                                return ctx4;\n                              }.toString()\n                            }\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30AD\\u30E3\\u30E9\\u30AF\\u30BF\\u30FC\" || prototype2.category == \"\\u30AA\\u30DA\\u30EC\\u30FC\\u30B7\\u30E7\\u30F3(\\u30E6\\u30CB\\u30C3\\u30C8)\") {\n                  return GameStateFn.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn.EffectFn.getPlayerID(effect2), DefineFn.EffectFn.getCardID(effect2)],\n                    description: effect2.text.description,\n                    text: {\n                      id: effect2.text.id,\n                      description: effect2.text.description,\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect3, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                                const cardId3 = DefineFn2.EffectFn.getCardID(effect3);\n                                const pairs = GameStateFn2.getCardTipStrBaSyouPairs(ctx4, \"\\u4E00\\u500B\\u81EA\\u8ECD\\u6A5F\\u9AD4\", cardId3);\n                                const [targetCardId, targetBasyou] = pairs[0];\n                                const from2 = GameStateFn2.getItemBaSyou(ctx4, cardId3);\n                                const to = targetBasyou;\n                                ctx4 = GameStateFn2.moveItem(ctx4, to, [cardId3, from2]);\n                                ctx4 = GameStateFn2.setSetGroupParent(ctx4, targetCardId, cardId3);\n                                ctx4 = GameStateFn2.triggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                                ctx4 = GameStateFn2.triggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u30BB\\u30C3\\u30C8\\u3055\\u308C\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                                return ctx4;\n                              }.toString()\n                            }\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30B3\\u30DE\\u30F3\\u30C9\") {\n                  return GameStateFn.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn.EffectFn.getPlayerID(effect2), DefineFn.EffectFn.getCardID(effect2)],\n                    description: effect2.text.description,\n                    text: {\n                      id: prototype2.commandText?.id || ToolFn2.getUUID(\"getPlayCardEffects\"),\n                      description: prototype2.commandText?.description || \"unknown\",\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect3, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                                const cardId3 = DefineFn2.EffectFn.getCardID(effect3);\n                                const from2 = GameStateFn2.getItemBaSyou(ctx4, cardId3);\n                                const to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u30B8\\u30E3\\u30F3\\u30AF\\u30E4\\u30FC\\u30C9\");\n                                ctx4 = GameStateFn2.moveItem(ctx4, to, [cardId3, from2]);\n                                ctx4 = GameStateFn2.triggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                                return ctx4;\n                              }.toString()\n                            },\n                            ...prototype2.commandText?.logicTreeActions?.[0].actions || []\n                          ]\n                        },\n                        ...prototype2.commandText?.logicTreeActions?.slice(1) || []\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30B0\\u30E9\\u30D5\\u30A3\\u30C3\\u30AF\") {\n                  const cardId3 = DefineFn.EffectFn.getCardID(effect2);\n                  const from2 = GameStateFn.getItemBaSyou(ctx3, cardId3);\n                  const to = DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"G\\u30BE\\u30FC\\u30F3\");\n                  ctx3 = GameStateFn.doItemMove(ctx3, to, [cardId3, from2]);\n                  ctx3 = GameStateFn.triggerEvent(ctx3, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                  return ctx3;\n                }\n                if (prototype2.category == \"\\u30AA\\u30DA\\u30EC\\u30FC\\u30B7\\u30E7\\u30F3\") {\n                  const cardId3 = DefineFn.EffectFn.getCardID(effect2);\n                  const from2 = GameStateFn.getItemBaSyou(ctx3, cardId3);\n                  const to = DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\");\n                  ctx3 = GameStateFn.doItemMove(ctx3, to, [cardId3, from2]);\n                  ctx3 = GameStateFn.triggerEvent(ctx3, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                  return ctx3;\n                }\n                if (prototype2.category == \"ACE\") {\n                  throw new Error(`not support category: ${prototype2.category}`);\n                }\n                return ctx3;\n              }"
                            }
                        ]
                    }
                ]
            }
        },
        {
            "id": "getPlayGEffects_card_019228a2-b3ab-7aa1-91a8-96efcf686494",
            "reason": [
                "PlayCard",
                "PlayerB",
                "card_019228a2-b3ab-7aa1-91a8-96efcf686494"
            ],
            "description": "PlayG",
            "text": {
                "id": "getPlayGEffects_text_card_019228a2-b3ab-7aa1-91a8-96efcf686494",
                "title": [],
                "conditions": {
                    "出G上限": {
                        "actions": [
                            {
                                "title": "function _(ctx3, effect5, { DefineFn: DefineFn2, GameStateFn: GameStateFn2, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn2.EffectFn.getCardID(effect5);\n                const cardController = GameStateFn2.getItemController(ctx3, cardId2);\n                const ps = GameStateFn2.getPlayerState(ctx3, cardController);\n                if (ps.playGCount > 0) {\n                  throw new DefineFn2.GameError(`\\u51FAG\\u4E0A\\u9650: ${ps.playGCount}`);\n                }\n                ctx3 = GameStateFn2.mapPlayerState(ctx3, cardController, (ps2) => {\n                  return {\n                    ...ps2,\n                    playGCount: ps2.playGCount + 1\n                  };\n                });\n                return ctx3;\n              }"
                            }
                        ]
                    }
                },
                "logicTreeActions": [
                    {
                        "actions": [
                            {
                                "title": "function _(ctx3, effect5, { DefineFn: DefineFn2, GameStateFn: GameStateFn2, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn2.EffectFn.getCardID(effect5);\n                const from = GameStateFn2.getItemBaSyou(ctx3, cardId2);\n                ctx3 = GameStateFn2.moveItem(ctx3, DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"G\\u30BE\\u30FC\\u30F3\"), [cardId2, from]);\n                return ctx3;\n              }"
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
        {
            "id": "getPlayGEffects_card_019228a2-b3ab-7aa1-91a8-bad0822cb2b5",
            "reason": [
                "PlayCard",
                "PlayerB",
                "card_019228a2-b3ab-7aa1-91a8-bad0822cb2b5"
            ],
            "description": "PlayG",
            "text": {
                "id": "getPlayGEffects_text_card_019228a2-b3ab-7aa1-91a8-bad0822cb2b5",
                "title": [],
                "conditions": {
                    "出G上限": {
                        "actions": [
                            {
                                "title": "function _(ctx3, effect5, { DefineFn: DefineFn2, GameStateFn: GameStateFn2, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn2.EffectFn.getCardID(effect5);\n                const cardController = GameStateFn2.getItemController(ctx3, cardId2);\n                const ps = GameStateFn2.getPlayerState(ctx3, cardController);\n                if (ps.playGCount > 0) {\n                  throw new DefineFn2.GameError(`\\u51FAG\\u4E0A\\u9650: ${ps.playGCount}`);\n                }\n                ctx3 = GameStateFn2.mapPlayerState(ctx3, cardController, (ps2) => {\n                  return {\n                    ...ps2,\n                    playGCount: ps2.playGCount + 1\n                  };\n                });\n                return ctx3;\n              }"
                            }
                        ]
                    }
                },
                "logicTreeActions": [
                    {
                        "actions": [
                            {
                                "title": "function _(ctx3, effect5, { DefineFn: DefineFn2, GameStateFn: GameStateFn2, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn2.EffectFn.getCardID(effect5);\n                const from = GameStateFn2.getItemBaSyou(ctx3, cardId2);\n                ctx3 = GameStateFn2.moveItem(ctx3, DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"G\\u30BE\\u30FC\\u30F3\"), [cardId2, from]);\n                return ctx3;\n              }"
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
        {
            "id": "getPlayGEffects_card_019228a2-b3ab-7aa1-91a8-6c879ad38bb0",
            "reason": [
                "PlayCard",
                "PlayerB",
                "card_019228a2-b3ab-7aa1-91a8-6c879ad38bb0"
            ],
            "description": "PlayG",
            "text": {
                "id": "getPlayGEffects_text_card_019228a2-b3ab-7aa1-91a8-6c879ad38bb0",
                "title": [],
                "conditions": {
                    "出G上限": {
                        "actions": [
                            {
                                "title": "function _(ctx3, effect5, { DefineFn: DefineFn2, GameStateFn: GameStateFn2, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn2.EffectFn.getCardID(effect5);\n                const cardController = GameStateFn2.getItemController(ctx3, cardId2);\n                const ps = GameStateFn2.getPlayerState(ctx3, cardController);\n                if (ps.playGCount > 0) {\n                  throw new DefineFn2.GameError(`\\u51FAG\\u4E0A\\u9650: ${ps.playGCount}`);\n                }\n                ctx3 = GameStateFn2.mapPlayerState(ctx3, cardController, (ps2) => {\n                  return {\n                    ...ps2,\n                    playGCount: ps2.playGCount + 1\n                  };\n                });\n                return ctx3;\n              }"
                            }
                        ]
                    }
                },
                "logicTreeActions": [
                    {
                        "actions": [
                            {
                                "title": "function _(ctx3, effect5, { DefineFn: DefineFn2, GameStateFn: GameStateFn2, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn2.EffectFn.getCardID(effect5);\n                const from = GameStateFn2.getItemBaSyou(ctx3, cardId2);\n                ctx3 = GameStateFn2.moveItem(ctx3, DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"G\\u30BE\\u30FC\\u30F3\"), [cardId2, from]);\n                return ctx3;\n              }"
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
        {
            "id": "getPlayGEffects_card_019228a2-b3ab-7aa1-91a8-5a60314f7e0e",
            "reason": [
                "PlayCard",
                "PlayerB",
                "card_019228a2-b3ab-7aa1-91a8-5a60314f7e0e"
            ],
            "description": "PlayG",
            "text": {
                "id": "getPlayGEffects_text_card_019228a2-b3ab-7aa1-91a8-5a60314f7e0e",
                "title": [],
                "conditions": {
                    "出G上限": {
                        "actions": [
                            {
                                "title": "function _(ctx3, effect5, { DefineFn: DefineFn2, GameStateFn: GameStateFn2, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn2.EffectFn.getCardID(effect5);\n                const cardController = GameStateFn2.getItemController(ctx3, cardId2);\n                const ps = GameStateFn2.getPlayerState(ctx3, cardController);\n                if (ps.playGCount > 0) {\n                  throw new DefineFn2.GameError(`\\u51FAG\\u4E0A\\u9650: ${ps.playGCount}`);\n                }\n                ctx3 = GameStateFn2.mapPlayerState(ctx3, cardController, (ps2) => {\n                  return {\n                    ...ps2,\n                    playGCount: ps2.playGCount + 1\n                  };\n                });\n                return ctx3;\n              }"
                            }
                        ]
                    }
                },
                "logicTreeActions": [
                    {
                        "actions": [
                            {
                                "title": "function _(ctx3, effect5, { DefineFn: DefineFn2, GameStateFn: GameStateFn2, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn2.EffectFn.getCardID(effect5);\n                const from = GameStateFn2.getItemBaSyou(ctx3, cardId2);\n                ctx3 = GameStateFn2.moveItem(ctx3, DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"G\\u30BE\\u30FC\\u30F3\"), [cardId2, from]);\n                return ctx3;\n              }"
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
    ],
    "destroyEffect": []
}

const ISSUE_CTX: GameStateWithFlowMemory = {
    "isGameState": true,
    "cards": {
        "card_0192280d-2a19-722c-bee6-7fb7250fbe31": {
            "id": "card_0192280d-2a19-722c-bee6-7fb7250fbe31",
            "protoID": "179015_04B_O_BK010C_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "card_0192280d-2a19-722c-bee6-8081c0796ffc": {
            "id": "card_0192280d-2a19-722c-bee6-8081c0796ffc",
            "protoID": "179015_04B_O_BK010C_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "card_0192280d-2a19-722c-bee6-88e6117a638b": {
            "id": "card_0192280d-2a19-722c-bee6-88e6117a638b",
            "protoID": "179015_04B_U_BK058R_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "card_0192280d-2a19-722c-bee6-9662a1a12d86": {
            "id": "card_0192280d-2a19-722c-bee6-9662a1a12d86",
            "protoID": "179015_04B_U_BK058R_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "card_0192280d-2a19-722c-bee6-9d43829cb979": {
            "id": "card_0192280d-2a19-722c-bee6-9d43829cb979",
            "protoID": "179015_04B_U_BK059C_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "card_0192280d-2a19-722c-bee6-a6ede945ab3e": {
            "id": "card_0192280d-2a19-722c-bee6-a6ede945ab3e",
            "protoID": "179015_04B_U_BK059C_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "card_0192280d-2a19-722c-bee6-ab919f0cd020": {
            "id": "card_0192280d-2a19-722c-bee6-ab919f0cd020",
            "protoID": "179015_04B_U_BK061C_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "card_0192280d-2a19-722c-bee6-b2ecf68365eb": {
            "id": "card_0192280d-2a19-722c-bee6-b2ecf68365eb",
            "protoID": "179015_04B_U_BK061C_black",
            "ownerID": "PlayerA",
            "isFaceDown": false,
            "isRoll": true
        },
        "card_0192280d-2a19-722c-bee6-bc847967d45e": {
            "id": "card_0192280d-2a19-722c-bee6-bc847967d45e",
            "protoID": "179016_04B_U_BK066C_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "card_0192280d-2a19-722c-bee6-c4d8a56bc8ca": {
            "id": "card_0192280d-2a19-722c-bee6-c4d8a56bc8ca",
            "protoID": "179016_04B_U_BK066C_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "card_0192280d-2a19-722c-bee6-cadb7fe489ba": {
            "id": "card_0192280d-2a19-722c-bee6-cadb7fe489ba",
            "protoID": "179019_02A_C_BK015S_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "card_0192280d-2a19-722c-bee6-d4a41527fb64": {
            "id": "card_0192280d-2a19-722c-bee6-d4a41527fb64",
            "protoID": "179019_02A_C_BK015S_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "card_0192280d-2a19-722c-bee6-db203ca48aef": {
            "id": "card_0192280d-2a19-722c-bee6-db203ca48aef",
            "protoID": "179020_05C_U_BK100U_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "card_0192280d-2a19-722c-bee6-e374e7768e38": {
            "id": "card_0192280d-2a19-722c-bee6-e374e7768e38",
            "protoID": "179020_05C_U_BK100U_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "card_0192280d-2a19-722c-bee6-ebcff7840b12": {
            "id": "card_0192280d-2a19-722c-bee6-ebcff7840b12",
            "protoID": "179023_06C_C_BK048R_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "card_0192280d-2a19-722c-bee6-f38c05554d21": {
            "id": "card_0192280d-2a19-722c-bee6-f38c05554d21",
            "protoID": "179023_06C_C_BK048R_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "card_0192280d-2a19-722c-bee6-fa7c888afa62": {
            "id": "card_0192280d-2a19-722c-bee6-fa7c888afa62",
            "protoID": "179023_06C_C_BK049U_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "card_0192280d-2a19-722c-bee7-036be4b33af7": {
            "id": "card_0192280d-2a19-722c-bee7-036be4b33af7",
            "protoID": "179023_06C_C_BK049U_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "card_0192280d-2a19-722c-bee7-0cd213866be1": {
            "id": "card_0192280d-2a19-722c-bee7-0cd213866be1",
            "protoID": "179024_04B_C_BK027U_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "card_0192280d-2a19-722c-bee7-15990eef917f": {
            "id": "card_0192280d-2a19-722c-bee7-15990eef917f",
            "protoID": "179024_04B_C_BK027U_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "card_0192280d-2a19-722c-bee7-1d4b0877ef81": {
            "id": "card_0192280d-2a19-722c-bee7-1d4b0877ef81",
            "protoID": "179024_04B_U_BK060C_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "card_0192280d-2a19-722c-bee7-2693461e499b": {
            "id": "card_0192280d-2a19-722c-bee7-2693461e499b",
            "protoID": "179024_04B_U_BK060C_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "card_0192280d-2a19-722c-bee7-2ee18aab6140": {
            "id": "card_0192280d-2a19-722c-bee7-2ee18aab6140",
            "protoID": "179024_04B_U_BK067C_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "card_0192280d-2a19-722c-bee7-310accdac5b1": {
            "id": "card_0192280d-2a19-722c-bee7-310accdac5b1",
            "protoID": "179024_04B_U_BK067C_black",
            "ownerID": "PlayerA",
            "isFaceDown": false,
            "isRoll": true
        },
        "card_0192280d-2a19-722c-bee7-3ca94dfcbe2f": {
            "id": "card_0192280d-2a19-722c-bee7-3ca94dfcbe2f",
            "protoID": "179024_B2B_C_BK054C_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "card_0192280d-2a19-722c-bee7-40c9b0765a86": {
            "id": "card_0192280d-2a19-722c-bee7-40c9b0765a86",
            "protoID": "179024_B2B_C_BK054C_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "card_0192280d-2a19-722c-bee7-484c9e0f66e7": {
            "id": "card_0192280d-2a19-722c-bee7-484c9e0f66e7",
            "protoID": "179024_B2B_U_BK128S_black_02",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "card_0192280d-2a19-722c-bee7-55ed42c3b5fb": {
            "id": "card_0192280d-2a19-722c-bee7-55ed42c3b5fb",
            "protoID": "179024_B2B_U_BK128S_black_02",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "card_0192280d-2a19-722c-bee7-5fd303fb4416": {
            "id": "card_0192280d-2a19-722c-bee7-5fd303fb4416",
            "protoID": "179024_B2B_U_BK129R_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "card_0192280d-2a19-722c-bee7-650a41b7c3e1": {
            "id": "card_0192280d-2a19-722c-bee7-650a41b7c3e1",
            "protoID": "179024_B2B_U_BK129R_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "card_0192280d-2a19-722c-bee7-6fc31f892354": {
            "id": "card_0192280d-2a19-722c-bee7-6fc31f892354",
            "protoID": "179027_09D_C_BK063R_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "card_0192280d-2a19-722c-bee7-77574034c45f": {
            "id": "card_0192280d-2a19-722c-bee7-77574034c45f",
            "protoID": "179027_09D_C_BK063R_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "card_0192280d-2a19-722c-bee7-79ec137c1aaa": {
            "id": "card_0192280d-2a19-722c-bee7-79ec137c1aaa",
            "protoID": "179027_09D_O_BK010N_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "card_0192280d-2a19-722c-bee7-861b2abc22cd": {
            "id": "card_0192280d-2a19-722c-bee7-861b2abc22cd",
            "protoID": "179027_09D_O_BK010N_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "card_0192280d-2a19-722c-bee7-8911ccccedff": {
            "id": "card_0192280d-2a19-722c-bee7-8911ccccedff",
            "protoID": "179027_09D_U_BK163S_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "card_0192280d-2a19-722c-bee7-97d8cd9646ae": {
            "id": "card_0192280d-2a19-722c-bee7-97d8cd9646ae",
            "protoID": "179027_09D_U_BK163S_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "card_0192280d-2a19-722c-bee7-9a73bd38e5d3": {
            "id": "card_0192280d-2a19-722c-bee7-9a73bd38e5d3",
            "protoID": "179027_09D_U_BK163S_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "card_0192280d-2a19-722c-bee7-a374642b39f8": {
            "id": "card_0192280d-2a19-722c-bee7-a374642b39f8",
            "protoID": "179029_06C_C_BK045U_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "card_0192280d-2a19-722c-bee7-adb8a055ae5f": {
            "id": "card_0192280d-2a19-722c-bee7-adb8a055ae5f",
            "protoID": "179029_06C_C_BK045U_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "card_0192280d-2a19-722c-bee7-b5390d0799d0": {
            "id": "card_0192280d-2a19-722c-bee7-b5390d0799d0",
            "protoID": "179029_B3C_C_BK071N_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "card_0192280d-2a19-722c-bee7-bf5e24f9501c": {
            "id": "card_0192280d-2a19-722c-bee7-bf5e24f9501c",
            "protoID": "179029_B3C_C_BK071N_black",
            "ownerID": "PlayerA",
            "isFaceDown": true,
            "isRoll": false
        },
        "card_0192280d-2a19-722c-bee7-c540008ef179": {
            "id": "card_0192280d-2a19-722c-bee7-c540008ef179",
            "protoID": "179029_B3C_U_BK184N_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "card_0192280d-2a19-722c-bee7-cc02dc4569b3": {
            "id": "card_0192280d-2a19-722c-bee7-cc02dc4569b3",
            "protoID": "179029_B3C_U_BK184N_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "card_0192280d-2a19-722c-bee7-d3502ecb62c9": {
            "id": "card_0192280d-2a19-722c-bee7-d3502ecb62c9",
            "protoID": "179029_B3C_U_BK184N_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "card_0192280d-2a19-722c-bee7-d96954c1bbca": {
            "id": "card_0192280d-2a19-722c-bee7-d96954c1bbca",
            "protoID": "179029_B3C_U_BK185N_black",
            "ownerID": "PlayerA",
            "isFaceDown": false,
            "isRoll": true
        },
        "card_0192280d-2a19-722c-bee7-e184aaf561ba": {
            "id": "card_0192280d-2a19-722c-bee7-e184aaf561ba",
            "protoID": "179029_B3C_U_BK185N_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "card_0192280d-2a19-722c-bee7-ed470edee21c": {
            "id": "card_0192280d-2a19-722c-bee7-ed470edee21c",
            "protoID": "179030_11E_U_BK194S_2_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "card_0192280d-2a19-722c-bee7-f655c7325ee3": {
            "id": "card_0192280d-2a19-722c-bee7-f655c7325ee3",
            "protoID": "179030_11E_U_BK194S_2_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "card_0192280d-2a19-722c-bee7-fed7ab282c62": {
            "id": "card_0192280d-2a19-722c-bee7-fed7ab282c62",
            "protoID": "179030_11E_U_BK194S_2_black",
            "ownerID": "PlayerA",
            "isFaceDown": false
        },
        "card_0192280d-2a19-722c-bee8-04761fb84fea": {
            "id": "card_0192280d-2a19-722c-bee8-04761fb84fea",
            "protoID": "179901_B2B_C_BK005P_black",
            "ownerID": "PlayerA",
            "isFaceDown": true,
            "isRoll": false
        },
        "card_0192280d-2a1a-722c-bee8-09acb2c31074": {
            "id": "card_0192280d-2a1a-722c-bee8-09acb2c31074",
            "protoID": "179015_04B_O_BK010C_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "card_0192280d-2a1a-722c-bee8-17cd47a29d99": {
            "id": "card_0192280d-2a1a-722c-bee8-17cd47a29d99",
            "protoID": "179015_04B_O_BK010C_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "card_0192280d-2a1a-722c-bee8-1a15fe11ae42": {
            "id": "card_0192280d-2a1a-722c-bee8-1a15fe11ae42",
            "protoID": "179015_04B_U_BK058R_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "card_0192280d-2a1a-722c-bee8-22b70b5c8913": {
            "id": "card_0192280d-2a1a-722c-bee8-22b70b5c8913",
            "protoID": "179015_04B_U_BK058R_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "card_0192280d-2a1a-722c-bee8-2ad0f0538a25": {
            "id": "card_0192280d-2a1a-722c-bee8-2ad0f0538a25",
            "protoID": "179015_04B_U_BK059C_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "card_0192280d-2a1a-722c-bee8-30e8b1929f6f": {
            "id": "card_0192280d-2a1a-722c-bee8-30e8b1929f6f",
            "protoID": "179015_04B_U_BK059C_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "card_0192280d-2a1a-722c-bee8-380ec4e3af20": {
            "id": "card_0192280d-2a1a-722c-bee8-380ec4e3af20",
            "protoID": "179015_04B_U_BK061C_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "card_0192280d-2a1a-722c-bee8-42ce57e25753": {
            "id": "card_0192280d-2a1a-722c-bee8-42ce57e25753",
            "protoID": "179015_04B_U_BK061C_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "card_0192280d-2a1a-722c-bee8-4cab8e4dd9b9": {
            "id": "card_0192280d-2a1a-722c-bee8-4cab8e4dd9b9",
            "protoID": "179016_04B_U_BK066C_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "card_0192280d-2a1a-722c-bee8-545f278e09d8": {
            "id": "card_0192280d-2a1a-722c-bee8-545f278e09d8",
            "protoID": "179016_04B_U_BK066C_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "card_0192280d-2a1a-722c-bee8-5b89f4d36ac3": {
            "id": "card_0192280d-2a1a-722c-bee8-5b89f4d36ac3",
            "protoID": "179019_02A_C_BK015S_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "card_0192280d-2a1a-722c-bee8-60bde7d51d9d": {
            "id": "card_0192280d-2a1a-722c-bee8-60bde7d51d9d",
            "protoID": "179019_02A_C_BK015S_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "card_0192280d-2a1a-722c-bee8-6b105bbb365e": {
            "id": "card_0192280d-2a1a-722c-bee8-6b105bbb365e",
            "protoID": "179020_05C_U_BK100U_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "card_0192280d-2a1a-722c-bee8-700fcd25d231": {
            "id": "card_0192280d-2a1a-722c-bee8-700fcd25d231",
            "protoID": "179020_05C_U_BK100U_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "card_0192280d-2a1a-722c-bee8-7ca6fcbed823": {
            "id": "card_0192280d-2a1a-722c-bee8-7ca6fcbed823",
            "protoID": "179023_06C_C_BK048R_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "card_0192280d-2a1a-722c-bee8-8231dac9d3e8": {
            "id": "card_0192280d-2a1a-722c-bee8-8231dac9d3e8",
            "protoID": "179023_06C_C_BK048R_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "card_0192280d-2a1a-722c-bee8-8a0c283e590c": {
            "id": "card_0192280d-2a1a-722c-bee8-8a0c283e590c",
            "protoID": "179023_06C_C_BK049U_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "card_0192280d-2a1a-722c-bee8-937516767ad9": {
            "id": "card_0192280d-2a1a-722c-bee8-937516767ad9",
            "protoID": "179023_06C_C_BK049U_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "card_0192280d-2a1a-722c-bee8-9f77ee2c2b45": {
            "id": "card_0192280d-2a1a-722c-bee8-9f77ee2c2b45",
            "protoID": "179024_04B_C_BK027U_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "card_0192280d-2a1a-722c-bee8-a0cfbccea56a": {
            "id": "card_0192280d-2a1a-722c-bee8-a0cfbccea56a",
            "protoID": "179024_04B_C_BK027U_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "card_0192280d-2a1a-722c-bee8-af517568f08a": {
            "id": "card_0192280d-2a1a-722c-bee8-af517568f08a",
            "protoID": "179024_04B_U_BK060C_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "card_0192280d-2a1a-722c-bee8-b719f06ce12f": {
            "id": "card_0192280d-2a1a-722c-bee8-b719f06ce12f",
            "protoID": "179024_04B_U_BK060C_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "card_0192280d-2a1a-722c-bee8-b807844b970f": {
            "id": "card_0192280d-2a1a-722c-bee8-b807844b970f",
            "protoID": "179024_04B_U_BK067C_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "card_0192280d-2a1a-722c-bee8-c51a720215e2": {
            "id": "card_0192280d-2a1a-722c-bee8-c51a720215e2",
            "protoID": "179024_04B_U_BK067C_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "card_0192280d-2a1a-722c-bee8-cdc3c6c493c2": {
            "id": "card_0192280d-2a1a-722c-bee8-cdc3c6c493c2",
            "protoID": "179024_B2B_C_BK054C_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "card_0192280d-2a1a-722c-bee8-d64a581beb03": {
            "id": "card_0192280d-2a1a-722c-bee8-d64a581beb03",
            "protoID": "179024_B2B_C_BK054C_black",
            "ownerID": "PlayerB",
            "isFaceDown": false
        },
        "card_0192280d-2a1a-722c-bee8-de7136267bee": {
            "id": "card_0192280d-2a1a-722c-bee8-de7136267bee",
            "protoID": "179024_B2B_U_BK128S_black_02",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "card_0192280d-2a1a-722c-bee8-e6284e4bf293": {
            "id": "card_0192280d-2a1a-722c-bee8-e6284e4bf293",
            "protoID": "179024_B2B_U_BK128S_black_02",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "card_0192280d-2a1a-722c-bee8-ebf6397c14cc": {
            "id": "card_0192280d-2a1a-722c-bee8-ebf6397c14cc",
            "protoID": "179024_B2B_U_BK129R_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "card_0192280d-2a1a-722c-bee8-f4cc8032ecf7": {
            "id": "card_0192280d-2a1a-722c-bee8-f4cc8032ecf7",
            "protoID": "179024_B2B_U_BK129R_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "card_0192280d-2a1a-722c-bee8-f99edf04221d": {
            "id": "card_0192280d-2a1a-722c-bee8-f99edf04221d",
            "protoID": "179027_09D_C_BK063R_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "card_0192280d-2a1a-722c-bee9-0176d1beb775": {
            "id": "card_0192280d-2a1a-722c-bee9-0176d1beb775",
            "protoID": "179027_09D_C_BK063R_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "card_0192280d-2a1a-722c-bee9-0faf1211102b": {
            "id": "card_0192280d-2a1a-722c-bee9-0faf1211102b",
            "protoID": "179027_09D_O_BK010N_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "card_0192280d-2a1a-722c-bee9-11962eed4c10": {
            "id": "card_0192280d-2a1a-722c-bee9-11962eed4c10",
            "protoID": "179027_09D_O_BK010N_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "card_0192280d-2a1a-722c-bee9-1879cba949ce": {
            "id": "card_0192280d-2a1a-722c-bee9-1879cba949ce",
            "protoID": "179027_09D_U_BK163S_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "card_0192280d-2a1a-722c-bee9-245ae56db99e": {
            "id": "card_0192280d-2a1a-722c-bee9-245ae56db99e",
            "protoID": "179027_09D_U_BK163S_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "card_0192280d-2a1a-722c-bee9-2d7f451ab639": {
            "id": "card_0192280d-2a1a-722c-bee9-2d7f451ab639",
            "protoID": "179027_09D_U_BK163S_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "card_0192280d-2a1a-722c-bee9-307b4e84126f": {
            "id": "card_0192280d-2a1a-722c-bee9-307b4e84126f",
            "protoID": "179029_06C_C_BK045U_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "card_0192280d-2a1a-722c-bee9-3e65d1aa49ae": {
            "id": "card_0192280d-2a1a-722c-bee9-3e65d1aa49ae",
            "protoID": "179029_06C_C_BK045U_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "card_0192280d-2a1a-722c-bee9-46fa4bd5c6df": {
            "id": "card_0192280d-2a1a-722c-bee9-46fa4bd5c6df",
            "protoID": "179029_B3C_C_BK071N_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "card_0192280d-2a1a-722c-bee9-4a5240379db1": {
            "id": "card_0192280d-2a1a-722c-bee9-4a5240379db1",
            "protoID": "179029_B3C_C_BK071N_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "card_0192280d-2a1a-722c-bee9-50ea71443f92": {
            "id": "card_0192280d-2a1a-722c-bee9-50ea71443f92",
            "protoID": "179029_B3C_U_BK184N_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "card_0192280d-2a1a-722c-bee9-59cc2ab51802": {
            "id": "card_0192280d-2a1a-722c-bee9-59cc2ab51802",
            "protoID": "179029_B3C_U_BK184N_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "card_0192280d-2a1a-722c-bee9-64df1e27dcdd": {
            "id": "card_0192280d-2a1a-722c-bee9-64df1e27dcdd",
            "protoID": "179029_B3C_U_BK184N_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "card_0192280d-2a1a-722c-bee9-6e69e625df66": {
            "id": "card_0192280d-2a1a-722c-bee9-6e69e625df66",
            "protoID": "179029_B3C_U_BK185N_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "card_0192280d-2a1a-722c-bee9-7015b00b7ea2": {
            "id": "card_0192280d-2a1a-722c-bee9-7015b00b7ea2",
            "protoID": "179029_B3C_U_BK185N_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "card_0192280d-2a1a-722c-bee9-7c2898c2cc37": {
            "id": "card_0192280d-2a1a-722c-bee9-7c2898c2cc37",
            "protoID": "179030_11E_U_BK194S_2_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "card_0192280d-2a1a-722c-bee9-85581a040e33": {
            "id": "card_0192280d-2a1a-722c-bee9-85581a040e33",
            "protoID": "179030_11E_U_BK194S_2_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "card_0192280d-2a1a-722c-bee9-8c21be50510c": {
            "id": "card_0192280d-2a1a-722c-bee9-8c21be50510c",
            "protoID": "179030_11E_U_BK194S_2_black",
            "ownerID": "PlayerB",
            "isFaceDown": false
        },
        "card_0192280d-2a1a-722c-bee9-94bebab38d08": {
            "id": "card_0192280d-2a1a-722c-bee9-94bebab38d08",
            "protoID": "179901_B2B_C_BK005P_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "card_0192280d-2a1b-722c-bee9-9918c54ec364": {
            "id": "card_0192280d-2a1b-722c-bee9-9918c54ec364",
            "protoID": "179015_04B_O_BK010C_black",
            "ownerID": "PlayerA",
            "isRoll": true
        },
        "card_0192280d-2a1b-722c-bee9-a1f4605c342c": {
            "id": "card_0192280d-2a1b-722c-bee9-a1f4605c342c",
            "protoID": "179015_04B_O_BK010C_black",
            "ownerID": "PlayerA",
            "isRoll": true
        },
        "card_0192280d-2a1b-722c-bee9-af00583b5002": {
            "id": "card_0192280d-2a1b-722c-bee9-af00583b5002",
            "protoID": "179015_04B_U_BK058R_black",
            "ownerID": "PlayerA",
            "isRoll": true
        },
        "card_0192280d-2a1b-722c-bee9-b40ddd613aae": {
            "id": "card_0192280d-2a1b-722c-bee9-b40ddd613aae",
            "protoID": "179015_04B_U_BK058R_black",
            "ownerID": "PlayerA",
            "isRoll": true
        },
        "card_0192280d-2a1b-722c-bee9-b82fad61ceae": {
            "id": "card_0192280d-2a1b-722c-bee9-b82fad61ceae",
            "protoID": "179015_04B_U_BK059C_black",
            "ownerID": "PlayerA",
            "isRoll": false
        },
        "card_0192280d-2a1b-722c-bee9-c32f7fd8f8be": {
            "id": "card_0192280d-2a1b-722c-bee9-c32f7fd8f8be",
            "protoID": "179015_04B_U_BK059C_black",
            "ownerID": "PlayerA",
            "isRoll": false
        }
    },
    "effects": {},
    "table": {
        "cardStack": {
            "[\"PlayerA\",\"本国\"]": [
                "card_0192280d-2a19-722c-bee6-9d43829cb979",
                "card_0192280d-2a19-722c-bee7-9a73bd38e5d3",
                "card_0192280d-2a19-722c-bee7-79ec137c1aaa",
                "card_0192280d-2a19-722c-bee7-861b2abc22cd",
                "card_0192280d-2a19-722c-bee7-77574034c45f",
                "card_0192280d-2a19-722c-bee7-d3502ecb62c9",
                "card_0192280d-2a19-722c-bee7-f655c7325ee3",
                "card_0192280d-2a19-722c-bee7-484c9e0f66e7",
                "card_0192280d-2a19-722c-bee6-fa7c888afa62",
                "card_0192280d-2a19-722c-bee6-f38c05554d21",
                "card_0192280d-2a19-722c-bee7-1d4b0877ef81",
                "card_0192280d-2a19-722c-bee7-2693461e499b",
                "card_0192280d-2a19-722c-bee7-a374642b39f8",
                "card_0192280d-2a19-722c-bee6-e374e7768e38",
                "card_0192280d-2a19-722c-bee7-6fc31f892354",
                "card_0192280d-2a19-722c-bee6-88e6117a638b",
                "card_0192280d-2a19-722c-bee7-8911ccccedff",
                "card_0192280d-2a19-722c-bee7-e184aaf561ba",
                "card_0192280d-2a19-722c-bee6-c4d8a56bc8ca",
                "card_0192280d-2a19-722c-bee7-15990eef917f",
                "card_0192280d-2a19-722c-bee7-5fd303fb4416",
                "card_0192280d-2a19-722c-bee7-2ee18aab6140",
                "card_0192280d-2a19-722c-bee6-a6ede945ab3e",
                "card_0192280d-2a19-722c-bee7-cc02dc4569b3",
                "card_0192280d-2a19-722c-bee7-036be4b33af7",
                "card_0192280d-2a19-722c-bee7-b5390d0799d0",
                "card_0192280d-2a19-722c-bee7-ed470edee21c",
                "card_0192280d-2a19-722c-bee7-97d8cd9646ae",
                "card_0192280d-2a19-722c-bee6-8081c0796ffc",
                "card_0192280d-2a19-722c-bee6-bc847967d45e",
                "card_0192280d-2a19-722c-bee7-55ed42c3b5fb",
                "card_0192280d-2a19-722c-bee6-9662a1a12d86",
                "card_0192280d-2a19-722c-bee7-c540008ef179",
                "card_0192280d-2a19-722c-bee7-40c9b0765a86",
                "card_0192280d-2a19-722c-bee7-3ca94dfcbe2f",
                "card_0192280d-2a19-722c-bee6-cadb7fe489ba",
                "card_0192280d-2a19-722c-bee7-adb8a055ae5f",
                "card_0192280d-2a19-722c-bee6-db203ca48aef",
                "card_0192280d-2a19-722c-bee6-7fb7250fbe31",
                "card_0192280d-2a19-722c-bee7-0cd213866be1",
                "card_0192280d-2a19-722c-bee6-ab919f0cd020",
                "card_0192280d-2a19-722c-bee6-d4a41527fb64",
                "card_0192280d-2a19-722c-bee7-650a41b7c3e1"
            ],
            "[\"PlayerB\",\"本国\"]": [
                "card_0192280d-2a1a-722c-bee9-6e69e625df66",
                "card_0192280d-2a1a-722c-bee9-4a5240379db1",
                "card_0192280d-2a1a-722c-bee8-e6284e4bf293",
                "card_0192280d-2a1a-722c-bee9-2d7f451ab639",
                "card_0192280d-2a1a-722c-bee8-6b105bbb365e",
                "card_0192280d-2a1a-722c-bee9-59cc2ab51802",
                "card_0192280d-2a1a-722c-bee8-f99edf04221d",
                "card_0192280d-2a1a-722c-bee8-545f278e09d8",
                "card_0192280d-2a1a-722c-bee8-9f77ee2c2b45",
                "card_0192280d-2a1a-722c-bee9-94bebab38d08",
                "card_0192280d-2a1a-722c-bee8-17cd47a29d99",
                "card_0192280d-2a1a-722c-bee9-0176d1beb775",
                "card_0192280d-2a1a-722c-bee8-1a15fe11ae42",
                "card_0192280d-2a1a-722c-bee8-5b89f4d36ac3",
                "card_0192280d-2a1a-722c-bee9-50ea71443f92",
                "card_0192280d-2a1a-722c-bee9-46fa4bd5c6df",
                "card_0192280d-2a1a-722c-bee8-8231dac9d3e8",
                "card_0192280d-2a1a-722c-bee8-700fcd25d231",
                "card_0192280d-2a1a-722c-bee8-ebf6397c14cc",
                "card_0192280d-2a1a-722c-bee8-de7136267bee",
                "card_0192280d-2a1a-722c-bee9-1879cba949ce",
                "card_0192280d-2a1a-722c-bee8-4cab8e4dd9b9",
                "card_0192280d-2a1a-722c-bee9-64df1e27dcdd",
                "card_0192280d-2a1a-722c-bee9-11962eed4c10",
                "card_0192280d-2a1a-722c-bee9-245ae56db99e",
                "card_0192280d-2a1a-722c-bee9-7015b00b7ea2",
                "card_0192280d-2a1a-722c-bee8-7ca6fcbed823",
                "card_0192280d-2a1a-722c-bee9-7c2898c2cc37",
                "card_0192280d-2a1a-722c-bee8-22b70b5c8913",
                "card_0192280d-2a1a-722c-bee8-a0cfbccea56a",
                "card_0192280d-2a1a-722c-bee9-307b4e84126f",
                "card_0192280d-2a1a-722c-bee8-2ad0f0538a25",
                "card_0192280d-2a1a-722c-bee9-0faf1211102b",
                "card_0192280d-2a1a-722c-bee8-b719f06ce12f",
                "card_0192280d-2a1a-722c-bee8-937516767ad9",
                "card_0192280d-2a1a-722c-bee9-85581a040e33",
                "card_0192280d-2a1a-722c-bee8-42ce57e25753",
                "card_0192280d-2a1a-722c-bee8-cdc3c6c493c2",
                "card_0192280d-2a1a-722c-bee8-c51a720215e2",
                "card_0192280d-2a1a-722c-bee8-f4cc8032ecf7",
                "card_0192280d-2a1a-722c-bee8-30e8b1929f6f",
                "card_0192280d-2a1a-722c-bee8-8a0c283e590c",
                "card_0192280d-2a1a-722c-bee8-60bde7d51d9d",
                "card_0192280d-2a1a-722c-bee9-3e65d1aa49ae"
            ],
            "[\"PlayerA\",\"Gゾーン\"]": [
                "card_0192280d-2a1b-722c-bee9-9918c54ec364",
                "card_0192280d-2a1b-722c-bee9-a1f4605c342c",
                "card_0192280d-2a1b-722c-bee9-af00583b5002",
                "card_0192280d-2a1b-722c-bee9-b40ddd613aae",
                "card_0192280d-2a1b-722c-bee9-b82fad61ceae",
                "card_0192280d-2a1b-722c-bee9-c32f7fd8f8be",
                "card_0192280d-2a19-722c-bee7-fed7ab282c62"
            ],
            "[\"PlayerA\",\"手札\"]": [
                "card_0192280d-2a19-722c-bee6-ebcff7840b12"
            ],
            "[\"PlayerB\",\"手札\"]": [
                "card_0192280d-2a1a-722c-bee8-b807844b970f",
                "card_0192280d-2a1a-722c-bee8-09acb2c31074",
                "card_0192280d-2a1a-722c-bee8-af517568f08a",
                "card_0192280d-2a1a-722c-bee8-380ec4e3af20"
            ],
            "[\"PlayerB\",\"プレイされているカード\"]": [
                "card_0192280d-2a1a-722c-bee9-8c21be50510c"
            ],
            "[\"PlayerB\",\"Gゾーン\"]": [
                "card_0192280d-2a1a-722c-bee8-d64a581beb03"
            ],
            "[\"PlayerA\",\"プレイされているカード\"]": [],
            "[\"PlayerA\",\"ジャンクヤード\"]": [
                "card_0192280d-2a19-722c-bee7-bf5e24f9501c",
                "card_0192280d-2a19-722c-bee8-04761fb84fea"
            ],
            "[\"PlayerA\",\"配備エリア\"]": [
                "card_0192280d-2a19-722c-bee7-310accdac5b1",
                "card_0192280d-2a19-722c-bee7-d96954c1bbca",
                "card_0192280d-2a19-722c-bee6-b2ecf68365eb"
            ]
        }
    },
    "chips": {},
    "chipProtos": {},
    "itemStates": {
        "card_0192280d-2a19-722c-bee7-d96954c1bbca": {
            "id": "card_0192280d-2a19-722c-bee7-d96954c1bbca",
            "damage": 0,
            "destroyReason": null,
            "flags": {},
            "tips": {
                "0[黒]": {
                    "title": [
                        "カード",
                        [
                            [
                                "card_0192280d-2a1b-722c-bee9-9918c54ec364",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "card_0192280d-2a1b-722c-bee9-a1f4605c342c",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "card_0192280d-2a1b-722c-bee9-af00583b5002",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "card_0192280d-2a1b-722c-bee9-b40ddd613aae",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "card_0192280d-2a1b-722c-bee9-b82fad61ceae",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "card_0192280d-2a1b-722c-bee9-c32f7fd8f8be",
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
                                "card_0192280d-2a1b-722c-bee9-9918c54ec364",
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
            "isFirstTurn": true,
            "textIdsUseThisCut": {}
        },
        "card_0192280d-2a19-722c-bee7-310accdac5b1": {
            "id": "card_0192280d-2a19-722c-bee7-310accdac5b1",
            "damage": 0,
            "destroyReason": null,
            "flags": {},
            "tips": {
                "0[黒]": {
                    "title": [
                        "カード",
                        [
                            [
                                "card_0192280d-2a1b-722c-bee9-a1f4605c342c",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "card_0192280d-2a1b-722c-bee9-af00583b5002",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "card_0192280d-2a1b-722c-bee9-b40ddd613aae",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "card_0192280d-2a1b-722c-bee9-b82fad61ceae",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "card_0192280d-2a1b-722c-bee9-c32f7fd8f8be",
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
                                "card_0192280d-2a1b-722c-bee9-a1f4605c342c",
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
            "isFirstTurn": true,
            "textIdsUseThisCut": {}
        },
        "card_0192280d-2a19-722c-bee7-bf5e24f9501c": {
            "id": "card_0192280d-2a19-722c-bee7-bf5e24f9501c",
            "damage": 0,
            "destroyReason": null,
            "flags": {},
            "tips": {
                "0[黒]": {
                    "title": [
                        "カード",
                        [
                            [
                                "card_0192280d-2a1b-722c-bee9-af00583b5002",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "card_0192280d-2a1b-722c-bee9-b40ddd613aae",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "card_0192280d-2a1b-722c-bee9-b82fad61ceae",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "card_0192280d-2a1b-722c-bee9-c32f7fd8f8be",
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
                                "card_0192280d-2a1b-722c-bee9-af00583b5002",
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
            "textIdsUseThisCut": {}
        },
        "card_0192280d-2a19-722c-bee6-ebcff7840b12": {
            "id": "card_0192280d-2a19-722c-bee6-ebcff7840b12",
            "damage": 0,
            "destroyReason": null,
            "flags": {},
            "tips": {
                "0[黒]": {
                    "title": [
                        "カード",
                        [
                            [
                                "card_0192280d-2a1b-722c-bee9-b40ddd613aae",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "card_0192280d-2a1b-722c-bee9-b82fad61ceae",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "card_0192280d-2a1b-722c-bee9-c32f7fd8f8be",
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
                                "card_0192280d-2a1b-722c-bee9-b40ddd613aae",
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
                "1[黒]": {
                    "title": [
                        "カード",
                        [
                            [
                                "card_0192280d-2a1b-722c-bee9-b40ddd613aae",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "card_0192280d-2a1b-722c-bee9-b82fad61ceae",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "card_0192280d-2a1b-722c-bee9-c32f7fd8f8be",
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
                                "card_0192280d-2a1b-722c-bee9-b40ddd613aae",
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
            "textIdsUseThisCut": {}
        },
        "card_0192280d-2a19-722c-bee8-04761fb84fea": {
            "id": "card_0192280d-2a19-722c-bee8-04761fb84fea",
            "damage": 0,
            "destroyReason": null,
            "flags": {},
            "tips": {
                "黒X": {
                    "title": [
                        "カード",
                        [
                            [
                                "card_0192280d-2a1b-722c-bee9-b40ddd613aae",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "card_0192280d-2a1b-722c-bee9-b82fad61ceae",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "card_0192280d-2a1b-722c-bee9-c32f7fd8f8be",
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
                                "card_0192280d-2a1b-722c-bee9-b40ddd613aae",
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
            "textIdsUseThisCut": {}
        },
        "card_0192280d-2a19-722c-bee6-b2ecf68365eb": {
            "id": "card_0192280d-2a19-722c-bee6-b2ecf68365eb",
            "damage": 0,
            "destroyReason": null,
            "flags": {},
            "tips": {
                "0[黒]": {
                    "title": [
                        "カード",
                        [
                            [
                                "card_0192280d-2a1b-722c-bee9-b40ddd613aae",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "card_0192280d-2a1b-722c-bee9-b82fad61ceae",
                                {
                                    "id": "AbsoluteBaSyou",
                                    "value": [
                                        "PlayerA",
                                        "Gゾーン"
                                    ]
                                }
                            ],
                            [
                                "card_0192280d-2a1b-722c-bee9-c32f7fd8f8be",
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
                                "card_0192280d-2a1b-722c-bee9-b40ddd613aae",
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
            "isFirstTurn": true,
            "textIdsUseThisCut": {}
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
            "confirmPhase": false
        },
        "PlayerA": {
            "id": "PlayerA",
            "turn": 0,
            "playGCount": 1,
            "confirmPhase": false
        }
    },
    "activePlayerID": "PlayerA",
    "immediateEffect": [],
    "stackEffect": [],
    "isBattle": {},
    "coins": {},
    "coinId2cardId": {},
    "globalEffectPool": {},
    "messages": [],
    "messagesCurrentEffect": null,
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
    },
    "commandEffectTips": [
        {
            "effect": {
                "id": "getPlayCardEffects_card_0192280d-2a19-722c-bee6-ebcff7840b12",
                "reason": [
                    "PlayCard",
                    "PlayerA",
                    "card_0192280d-2a19-722c-bee6-ebcff7840b12"
                ],
                "description": "從手中即將出牌, 出牌後會產生場出的效果",
                "text": {
                    "id": "getPlayCardEffects_text_card_0192280d-2a19-722c-bee6-ebcff7840b12",
                    "title": [
                        "使用型",
                        [
                            "配備フェイズ"
                        ]
                    ],
                    "description": "從手中即將出牌, 出牌後會產生場出的效果",
                    "conditions": {
                        "合計国力〔x〕": {
                            "actions": [
                                {
                                    "title": [
                                        "合計国力〔x〕",
                                        2
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
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect2, { DefineFn, GameStateFn, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn.EffectFn.getCardID(effect2);\n                const prototype2 = GameStateFn.getItemPrototype(ctx3, cardId2);\n                const from = GameStateFn.getItemBaSyou(ctx3, cardId2);\n                ctx3 = GameStateFn.doItemMove(ctx3, DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u3044\\u308B\\u30AB\\u30FC\\u30C9\"), [cardId2, from]);\n                if (prototype2.category == \"\\u30E6\\u30CB\\u30C3\\u30C8\") {\n                  return GameStateFn.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn.EffectFn.getPlayerID(effect2), DefineFn.EffectFn.getCardID(effect2)],\n                    description: effect2.text.description,\n                    text: {\n                      id: effect2.text.id,\n                      description: effect2.text.description,\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect3, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                                const cardId3 = DefineFn2.EffectFn.getCardID(effect3);\n                                const from2 = GameStateFn2.getItemBaSyou(ctx4, cardId3);\n                                const to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\");\n                                ctx4 = GameStateFn2.moveItem(ctx4, to, [cardId3, from2]);\n                                const hasHigh = GameStateFn2.getCardHasSpeicalEffect(ctx4, [\"\\u6226\\u95D8\\u914D\\u5099\"], cardId3);\n                                const hasPS = GameStateFn2.getCardHasSpeicalEffect(ctx4, [\"PS\\u88C5\\u7532\"], cardId3);\n                                const isNoNeedRoll = hasHigh || hasPS;\n                                const isRoll = isNoNeedRoll == false;\n                                ctx4 = GameStateFn2.setItemIsRoll(ctx4, isRoll, [cardId3, to]);\n                                ctx4 = GameStateFn2.triggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                                return ctx4;\n                              }.toString()\n                            }\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30AD\\u30E3\\u30E9\\u30AF\\u30BF\\u30FC\" || prototype2.category == \"\\u30AA\\u30DA\\u30EC\\u30FC\\u30B7\\u30E7\\u30F3(\\u30E6\\u30CB\\u30C3\\u30C8)\") {\n                  return GameStateFn.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn.EffectFn.getPlayerID(effect2), DefineFn.EffectFn.getCardID(effect2)],\n                    description: effect2.text.description,\n                    text: {\n                      id: effect2.text.id,\n                      description: effect2.text.description,\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect3, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                                const cardId3 = DefineFn2.EffectFn.getCardID(effect3);\n                                const pairs = GameStateFn2.getCardTipStrBaSyouPairs(ctx4, \"\\u4E00\\u500B\\u81EA\\u8ECD\\u6A5F\\u9AD4\", cardId3);\n                                const [targetCardId, targetBasyou] = pairs[0];\n                                const from2 = GameStateFn2.getItemBaSyou(ctx4, cardId3);\n                                const to = targetBasyou;\n                                ctx4 = GameStateFn2.moveItem(ctx4, to, [cardId3, from2]);\n                                ctx4 = GameStateFn2.setSetGroupParent(ctx4, targetCardId, cardId3);\n                                ctx4 = GameStateFn2.triggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                                ctx4 = GameStateFn2.triggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u30BB\\u30C3\\u30C8\\u3055\\u308C\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                                return ctx4;\n                              }.toString()\n                            }\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30B3\\u30DE\\u30F3\\u30C9\") {\n                  return GameStateFn.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn.EffectFn.getPlayerID(effect2), DefineFn.EffectFn.getCardID(effect2)],\n                    description: effect2.text.description,\n                    text: {\n                      id: prototype2.commandText?.id || ToolFn2.getUUID(\"getPlayCardEffects\"),\n                      description: prototype2.commandText?.description || \"unknown\",\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect3, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                                const cardId3 = DefineFn2.EffectFn.getCardID(effect3);\n                                const from2 = GameStateFn2.getItemBaSyou(ctx4, cardId3);\n                                const to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u30B8\\u30E3\\u30F3\\u30AF\\u30E4\\u30FC\\u30C9\");\n                                ctx4 = GameStateFn2.moveItem(ctx4, to, [cardId3, from2]);\n                                ctx4 = GameStateFn2.triggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                                return ctx4;\n                              }.toString()\n                            },\n                            ...prototype2.commandText?.logicTreeActions?.[0].actions || []\n                          ]\n                        },\n                        ...prototype2.commandText?.logicTreeActions?.slice(1) || []\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30B0\\u30E9\\u30D5\\u30A3\\u30C3\\u30AF\") {\n                  const cardId3 = DefineFn.EffectFn.getCardID(effect2);\n                  const from2 = GameStateFn.getItemBaSyou(ctx3, cardId3);\n                  const to = DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"G\\u30BE\\u30FC\\u30F3\");\n                  ctx3 = GameStateFn.doItemMove(ctx3, to, [cardId3, from2]);\n                  ctx3 = GameStateFn.triggerEvent(ctx3, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                  return ctx3;\n                }\n                if (prototype2.category == \"\\u30AA\\u30DA\\u30EC\\u30FC\\u30B7\\u30E7\\u30F3\") {\n                  const cardId3 = DefineFn.EffectFn.getCardID(effect2);\n                  const from2 = GameStateFn.getItemBaSyou(ctx3, cardId3);\n                  const to = DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\");\n                  ctx3 = GameStateFn.doItemMove(ctx3, to, [cardId3, from2]);\n                  ctx3 = GameStateFn.triggerEvent(ctx3, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                  return ctx3;\n                }\n                if (prototype2.category == \"ACE\") {\n                  throw new Error(`not support category: ${prototype2.category}`);\n                }\n                return ctx3;\n              }"
                                }
                            ]
                        }
                    ]
                }
            },
            "logicID": 0,
            "logicSubID": 0,
            "tipOrErrors": [
                {
                    "conditionKey": "合計国力〔x〕",
                    "tip": null,
                    "errors": []
                },
                {
                    "conditionKey": "0[黒]",
                    "tip": {
                        "title": [
                            "カード",
                            [
                                [
                                    "card_0192280d-2a1b-722c-bee9-b82fad61ceae",
                                    {
                                        "id": "AbsoluteBaSyou",
                                        "value": [
                                            "PlayerA",
                                            "Gゾーン"
                                        ]
                                    }
                                ],
                                [
                                    "card_0192280d-2a1b-722c-bee9-c32f7fd8f8be",
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
                                    "card_0192280d-2a1b-722c-bee9-b82fad61ceae",
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
                    "conditionKey": "1[黒]",
                    "tip": {
                        "title": [
                            "カード",
                            [
                                [
                                    "card_0192280d-2a1b-722c-bee9-c32f7fd8f8be",
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
                                    "card_0192280d-2a1b-722c-bee9-c32f7fd8f8be",
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
            "effect": {
                "id": "getPlayGEffects_card_0192280d-2a19-722c-bee6-ebcff7840b12",
                "reason": [
                    "PlayCard",
                    "PlayerA",
                    "card_0192280d-2a19-722c-bee6-ebcff7840b12"
                ],
                "description": "PlayG",
                "text": {
                    "id": "getPlayGEffects_text_card_0192280d-2a19-722c-bee6-ebcff7840b12",
                    "title": [],
                    "conditions": {
                        "出G上限": {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect5, { DefineFn: DefineFn2, GameStateFn: GameStateFn2, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn2.EffectFn.getCardID(effect5);\n                const cardController = GameStateFn2.getItemController(ctx3, cardId2);\n                const ps = GameStateFn2.getPlayerState(ctx3, cardController);\n                if (ps.playGCount > 0) {\n                  throw new DefineFn2.GameError(`\\u51FAG\\u4E0A\\u9650: ${ps.playGCount}`);\n                }\n                ctx3 = GameStateFn2.mapPlayerState(ctx3, cardController, (ps2) => {\n                  return {\n                    ...ps2,\n                    playGCount: ps2.playGCount + 1\n                  };\n                });\n                return ctx3;\n              }"
                                }
                            ]
                        }
                    },
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect5, { DefineFn: DefineFn2, GameStateFn: GameStateFn2, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn2.EffectFn.getCardID(effect5);\n                const from = GameStateFn2.getItemBaSyou(ctx3, cardId2);\n                ctx3 = GameStateFn2.moveItem(ctx3, DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"G\\u30BE\\u30FC\\u30F3\"), [cardId2, from]);\n                return ctx3;\n              }"
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
            "logicID": 0,
            "logicSubID": 0,
            "tipOrErrors": [
                {
                    "conditionKey": "出G上限",
                    "tip": null,
                    "errors": [
                        "出G上限: 1"
                    ]
                }
            ]
        },
        {
            "effect": {
                "id": "getPlayCardEffects_card_0192280d-2a1a-722c-bee8-b807844b970f",
                "reason": [
                    "PlayCard",
                    "PlayerB",
                    "card_0192280d-2a1a-722c-bee8-b807844b970f"
                ],
                "description": "從手中即將出牌, 出牌後會產生場出的效果",
                "text": {
                    "id": "getPlayCardEffects_text_card_0192280d-2a1a-722c-bee8-b807844b970f",
                    "title": [
                        "使用型",
                        [
                            "配備フェイズ"
                        ]
                    ],
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
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect2, { DefineFn, GameStateFn, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn.EffectFn.getCardID(effect2);\n                const prototype2 = GameStateFn.getItemPrototype(ctx3, cardId2);\n                const from = GameStateFn.getItemBaSyou(ctx3, cardId2);\n                ctx3 = GameStateFn.doItemMove(ctx3, DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u3044\\u308B\\u30AB\\u30FC\\u30C9\"), [cardId2, from]);\n                if (prototype2.category == \"\\u30E6\\u30CB\\u30C3\\u30C8\") {\n                  return GameStateFn.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn.EffectFn.getPlayerID(effect2), DefineFn.EffectFn.getCardID(effect2)],\n                    description: effect2.text.description,\n                    text: {\n                      id: effect2.text.id,\n                      description: effect2.text.description,\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect3, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                                const cardId3 = DefineFn2.EffectFn.getCardID(effect3);\n                                const from2 = GameStateFn2.getItemBaSyou(ctx4, cardId3);\n                                const to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\");\n                                ctx4 = GameStateFn2.moveItem(ctx4, to, [cardId3, from2]);\n                                const hasHigh = GameStateFn2.getCardHasSpeicalEffect(ctx4, [\"\\u6226\\u95D8\\u914D\\u5099\"], cardId3);\n                                const hasPS = GameStateFn2.getCardHasSpeicalEffect(ctx4, [\"PS\\u88C5\\u7532\"], cardId3);\n                                const isNoNeedRoll = hasHigh || hasPS;\n                                const isRoll = isNoNeedRoll == false;\n                                ctx4 = GameStateFn2.setItemIsRoll(ctx4, isRoll, [cardId3, to]);\n                                ctx4 = GameStateFn2.triggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                                return ctx4;\n                              }.toString()\n                            }\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30AD\\u30E3\\u30E9\\u30AF\\u30BF\\u30FC\" || prototype2.category == \"\\u30AA\\u30DA\\u30EC\\u30FC\\u30B7\\u30E7\\u30F3(\\u30E6\\u30CB\\u30C3\\u30C8)\") {\n                  return GameStateFn.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn.EffectFn.getPlayerID(effect2), DefineFn.EffectFn.getCardID(effect2)],\n                    description: effect2.text.description,\n                    text: {\n                      id: effect2.text.id,\n                      description: effect2.text.description,\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect3, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                                const cardId3 = DefineFn2.EffectFn.getCardID(effect3);\n                                const pairs = GameStateFn2.getCardTipStrBaSyouPairs(ctx4, \"\\u4E00\\u500B\\u81EA\\u8ECD\\u6A5F\\u9AD4\", cardId3);\n                                const [targetCardId, targetBasyou] = pairs[0];\n                                const from2 = GameStateFn2.getItemBaSyou(ctx4, cardId3);\n                                const to = targetBasyou;\n                                ctx4 = GameStateFn2.moveItem(ctx4, to, [cardId3, from2]);\n                                ctx4 = GameStateFn2.setSetGroupParent(ctx4, targetCardId, cardId3);\n                                ctx4 = GameStateFn2.triggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                                ctx4 = GameStateFn2.triggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u30BB\\u30C3\\u30C8\\u3055\\u308C\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                                return ctx4;\n                              }.toString()\n                            }\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30B3\\u30DE\\u30F3\\u30C9\") {\n                  return GameStateFn.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn.EffectFn.getPlayerID(effect2), DefineFn.EffectFn.getCardID(effect2)],\n                    description: effect2.text.description,\n                    text: {\n                      id: prototype2.commandText?.id || ToolFn2.getUUID(\"getPlayCardEffects\"),\n                      description: prototype2.commandText?.description || \"unknown\",\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect3, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                                const cardId3 = DefineFn2.EffectFn.getCardID(effect3);\n                                const from2 = GameStateFn2.getItemBaSyou(ctx4, cardId3);\n                                const to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u30B8\\u30E3\\u30F3\\u30AF\\u30E4\\u30FC\\u30C9\");\n                                ctx4 = GameStateFn2.moveItem(ctx4, to, [cardId3, from2]);\n                                ctx4 = GameStateFn2.triggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                                return ctx4;\n                              }.toString()\n                            },\n                            ...prototype2.commandText?.logicTreeActions?.[0].actions || []\n                          ]\n                        },\n                        ...prototype2.commandText?.logicTreeActions?.slice(1) || []\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30B0\\u30E9\\u30D5\\u30A3\\u30C3\\u30AF\") {\n                  const cardId3 = DefineFn.EffectFn.getCardID(effect2);\n                  const from2 = GameStateFn.getItemBaSyou(ctx3, cardId3);\n                  const to = DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"G\\u30BE\\u30FC\\u30F3\");\n                  ctx3 = GameStateFn.doItemMove(ctx3, to, [cardId3, from2]);\n                  ctx3 = GameStateFn.triggerEvent(ctx3, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                  return ctx3;\n                }\n                if (prototype2.category == \"\\u30AA\\u30DA\\u30EC\\u30FC\\u30B7\\u30E7\\u30F3\") {\n                  const cardId3 = DefineFn.EffectFn.getCardID(effect2);\n                  const from2 = GameStateFn.getItemBaSyou(ctx3, cardId3);\n                  const to = DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\");\n                  ctx3 = GameStateFn.doItemMove(ctx3, to, [cardId3, from2]);\n                  ctx3 = GameStateFn.triggerEvent(ctx3, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                  return ctx3;\n                }\n                if (prototype2.category == \"ACE\") {\n                  throw new Error(`not support category: ${prototype2.category}`);\n                }\n                return ctx3;\n              }"
                                }
                            ]
                        }
                    ]
                }
            },
            "logicID": 0,
            "logicSubID": 0,
            "tipOrErrors": [
                {
                    "conditionKey": "合計国力〔x〕",
                    "tip": null,
                    "errors": [
                        "合計国力〔x〕:1 < 3. 從手中即將出牌, 出牌後會產生場出的效果"
                    ]
                },
                {
                    "conditionKey": "0[黒]",
                    "tip": {
                        "title": [
                            "カード",
                            [
                                [
                                    "card_0192280d-2a1a-722c-bee8-d64a581beb03",
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
                                    "card_0192280d-2a1a-722c-bee8-d64a581beb03",
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
            "effect": {
                "id": "getPlayCardEffects_card_0192280d-2a1a-722c-bee8-09acb2c31074",
                "reason": [
                    "PlayCard",
                    "PlayerB",
                    "card_0192280d-2a1a-722c-bee8-09acb2c31074"
                ],
                "description": "從手中即將出牌, 出牌後會產生場出的效果",
                "text": {
                    "id": "getPlayCardEffects_text_card_0192280d-2a1a-722c-bee8-09acb2c31074",
                    "title": [
                        "使用型",
                        [
                            "配備フェイズ"
                        ]
                    ],
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
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect2, { DefineFn, GameStateFn, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn.EffectFn.getCardID(effect2);\n                const prototype2 = GameStateFn.getItemPrototype(ctx3, cardId2);\n                const from = GameStateFn.getItemBaSyou(ctx3, cardId2);\n                ctx3 = GameStateFn.doItemMove(ctx3, DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u3044\\u308B\\u30AB\\u30FC\\u30C9\"), [cardId2, from]);\n                if (prototype2.category == \"\\u30E6\\u30CB\\u30C3\\u30C8\") {\n                  return GameStateFn.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn.EffectFn.getPlayerID(effect2), DefineFn.EffectFn.getCardID(effect2)],\n                    description: effect2.text.description,\n                    text: {\n                      id: effect2.text.id,\n                      description: effect2.text.description,\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect3, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                                const cardId3 = DefineFn2.EffectFn.getCardID(effect3);\n                                const from2 = GameStateFn2.getItemBaSyou(ctx4, cardId3);\n                                const to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\");\n                                ctx4 = GameStateFn2.moveItem(ctx4, to, [cardId3, from2]);\n                                const hasHigh = GameStateFn2.getCardHasSpeicalEffect(ctx4, [\"\\u6226\\u95D8\\u914D\\u5099\"], cardId3);\n                                const hasPS = GameStateFn2.getCardHasSpeicalEffect(ctx4, [\"PS\\u88C5\\u7532\"], cardId3);\n                                const isNoNeedRoll = hasHigh || hasPS;\n                                const isRoll = isNoNeedRoll == false;\n                                ctx4 = GameStateFn2.setItemIsRoll(ctx4, isRoll, [cardId3, to]);\n                                ctx4 = GameStateFn2.triggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                                return ctx4;\n                              }.toString()\n                            }\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30AD\\u30E3\\u30E9\\u30AF\\u30BF\\u30FC\" || prototype2.category == \"\\u30AA\\u30DA\\u30EC\\u30FC\\u30B7\\u30E7\\u30F3(\\u30E6\\u30CB\\u30C3\\u30C8)\") {\n                  return GameStateFn.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn.EffectFn.getPlayerID(effect2), DefineFn.EffectFn.getCardID(effect2)],\n                    description: effect2.text.description,\n                    text: {\n                      id: effect2.text.id,\n                      description: effect2.text.description,\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect3, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                                const cardId3 = DefineFn2.EffectFn.getCardID(effect3);\n                                const pairs = GameStateFn2.getCardTipStrBaSyouPairs(ctx4, \"\\u4E00\\u500B\\u81EA\\u8ECD\\u6A5F\\u9AD4\", cardId3);\n                                const [targetCardId, targetBasyou] = pairs[0];\n                                const from2 = GameStateFn2.getItemBaSyou(ctx4, cardId3);\n                                const to = targetBasyou;\n                                ctx4 = GameStateFn2.moveItem(ctx4, to, [cardId3, from2]);\n                                ctx4 = GameStateFn2.setSetGroupParent(ctx4, targetCardId, cardId3);\n                                ctx4 = GameStateFn2.triggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                                ctx4 = GameStateFn2.triggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u30BB\\u30C3\\u30C8\\u3055\\u308C\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                                return ctx4;\n                              }.toString()\n                            }\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30B3\\u30DE\\u30F3\\u30C9\") {\n                  return GameStateFn.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn.EffectFn.getPlayerID(effect2), DefineFn.EffectFn.getCardID(effect2)],\n                    description: effect2.text.description,\n                    text: {\n                      id: prototype2.commandText?.id || ToolFn2.getUUID(\"getPlayCardEffects\"),\n                      description: prototype2.commandText?.description || \"unknown\",\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect3, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                                const cardId3 = DefineFn2.EffectFn.getCardID(effect3);\n                                const from2 = GameStateFn2.getItemBaSyou(ctx4, cardId3);\n                                const to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u30B8\\u30E3\\u30F3\\u30AF\\u30E4\\u30FC\\u30C9\");\n                                ctx4 = GameStateFn2.moveItem(ctx4, to, [cardId3, from2]);\n                                ctx4 = GameStateFn2.triggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                                return ctx4;\n                              }.toString()\n                            },\n                            ...prototype2.commandText?.logicTreeActions?.[0].actions || []\n                          ]\n                        },\n                        ...prototype2.commandText?.logicTreeActions?.slice(1) || []\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30B0\\u30E9\\u30D5\\u30A3\\u30C3\\u30AF\") {\n                  const cardId3 = DefineFn.EffectFn.getCardID(effect2);\n                  const from2 = GameStateFn.getItemBaSyou(ctx3, cardId3);\n                  const to = DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"G\\u30BE\\u30FC\\u30F3\");\n                  ctx3 = GameStateFn.doItemMove(ctx3, to, [cardId3, from2]);\n                  ctx3 = GameStateFn.triggerEvent(ctx3, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                  return ctx3;\n                }\n                if (prototype2.category == \"\\u30AA\\u30DA\\u30EC\\u30FC\\u30B7\\u30E7\\u30F3\") {\n                  const cardId3 = DefineFn.EffectFn.getCardID(effect2);\n                  const from2 = GameStateFn.getItemBaSyou(ctx3, cardId3);\n                  const to = DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\");\n                  ctx3 = GameStateFn.doItemMove(ctx3, to, [cardId3, from2]);\n                  ctx3 = GameStateFn.triggerEvent(ctx3, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                  return ctx3;\n                }\n                if (prototype2.category == \"ACE\") {\n                  throw new Error(`not support category: ${prototype2.category}`);\n                }\n                return ctx3;\n              }"
                                }
                            ]
                        }
                    ]
                }
            },
            "logicID": 0,
            "logicSubID": 0,
            "tipOrErrors": [
                {
                    "conditionKey": "合計国力〔x〕",
                    "tip": null,
                    "errors": [
                        "合計国力〔x〕:1 < 3. 從手中即將出牌, 出牌後會產生場出的效果"
                    ]
                },
                {
                    "conditionKey": "0[黒]",
                    "tip": {
                        "title": [
                            "カード",
                            [
                                [
                                    "card_0192280d-2a1a-722c-bee8-d64a581beb03",
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
                                    "card_0192280d-2a1a-722c-bee8-d64a581beb03",
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
            "effect": {
                "id": "getPlayCardEffects_card_0192280d-2a1a-722c-bee8-af517568f08a",
                "reason": [
                    "PlayCard",
                    "PlayerB",
                    "card_0192280d-2a1a-722c-bee8-af517568f08a"
                ],
                "description": "從手中即將出牌, 出牌後會產生場出的效果",
                "text": {
                    "id": "getPlayCardEffects_text_card_0192280d-2a1a-722c-bee8-af517568f08a",
                    "title": [
                        "使用型",
                        [
                            "配備フェイズ"
                        ]
                    ],
                    "description": "從手中即將出牌, 出牌後會產生場出的效果",
                    "conditions": {
                        "合計国力〔x〕": {
                            "actions": [
                                {
                                    "title": [
                                        "合計国力〔x〕",
                                        2
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
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect2, { DefineFn, GameStateFn, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn.EffectFn.getCardID(effect2);\n                const prototype2 = GameStateFn.getItemPrototype(ctx3, cardId2);\n                const from = GameStateFn.getItemBaSyou(ctx3, cardId2);\n                ctx3 = GameStateFn.doItemMove(ctx3, DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u3044\\u308B\\u30AB\\u30FC\\u30C9\"), [cardId2, from]);\n                if (prototype2.category == \"\\u30E6\\u30CB\\u30C3\\u30C8\") {\n                  return GameStateFn.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn.EffectFn.getPlayerID(effect2), DefineFn.EffectFn.getCardID(effect2)],\n                    description: effect2.text.description,\n                    text: {\n                      id: effect2.text.id,\n                      description: effect2.text.description,\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect3, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                                const cardId3 = DefineFn2.EffectFn.getCardID(effect3);\n                                const from2 = GameStateFn2.getItemBaSyou(ctx4, cardId3);\n                                const to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\");\n                                ctx4 = GameStateFn2.moveItem(ctx4, to, [cardId3, from2]);\n                                const hasHigh = GameStateFn2.getCardHasSpeicalEffect(ctx4, [\"\\u6226\\u95D8\\u914D\\u5099\"], cardId3);\n                                const hasPS = GameStateFn2.getCardHasSpeicalEffect(ctx4, [\"PS\\u88C5\\u7532\"], cardId3);\n                                const isNoNeedRoll = hasHigh || hasPS;\n                                const isRoll = isNoNeedRoll == false;\n                                ctx4 = GameStateFn2.setItemIsRoll(ctx4, isRoll, [cardId3, to]);\n                                ctx4 = GameStateFn2.triggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                                return ctx4;\n                              }.toString()\n                            }\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30AD\\u30E3\\u30E9\\u30AF\\u30BF\\u30FC\" || prototype2.category == \"\\u30AA\\u30DA\\u30EC\\u30FC\\u30B7\\u30E7\\u30F3(\\u30E6\\u30CB\\u30C3\\u30C8)\") {\n                  return GameStateFn.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn.EffectFn.getPlayerID(effect2), DefineFn.EffectFn.getCardID(effect2)],\n                    description: effect2.text.description,\n                    text: {\n                      id: effect2.text.id,\n                      description: effect2.text.description,\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect3, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                                const cardId3 = DefineFn2.EffectFn.getCardID(effect3);\n                                const pairs = GameStateFn2.getCardTipStrBaSyouPairs(ctx4, \"\\u4E00\\u500B\\u81EA\\u8ECD\\u6A5F\\u9AD4\", cardId3);\n                                const [targetCardId, targetBasyou] = pairs[0];\n                                const from2 = GameStateFn2.getItemBaSyou(ctx4, cardId3);\n                                const to = targetBasyou;\n                                ctx4 = GameStateFn2.moveItem(ctx4, to, [cardId3, from2]);\n                                ctx4 = GameStateFn2.setSetGroupParent(ctx4, targetCardId, cardId3);\n                                ctx4 = GameStateFn2.triggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                                ctx4 = GameStateFn2.triggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u30BB\\u30C3\\u30C8\\u3055\\u308C\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                                return ctx4;\n                              }.toString()\n                            }\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30B3\\u30DE\\u30F3\\u30C9\") {\n                  return GameStateFn.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn.EffectFn.getPlayerID(effect2), DefineFn.EffectFn.getCardID(effect2)],\n                    description: effect2.text.description,\n                    text: {\n                      id: prototype2.commandText?.id || ToolFn2.getUUID(\"getPlayCardEffects\"),\n                      description: prototype2.commandText?.description || \"unknown\",\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect3, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                                const cardId3 = DefineFn2.EffectFn.getCardID(effect3);\n                                const from2 = GameStateFn2.getItemBaSyou(ctx4, cardId3);\n                                const to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u30B8\\u30E3\\u30F3\\u30AF\\u30E4\\u30FC\\u30C9\");\n                                ctx4 = GameStateFn2.moveItem(ctx4, to, [cardId3, from2]);\n                                ctx4 = GameStateFn2.triggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                                return ctx4;\n                              }.toString()\n                            },\n                            ...prototype2.commandText?.logicTreeActions?.[0].actions || []\n                          ]\n                        },\n                        ...prototype2.commandText?.logicTreeActions?.slice(1) || []\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30B0\\u30E9\\u30D5\\u30A3\\u30C3\\u30AF\") {\n                  const cardId3 = DefineFn.EffectFn.getCardID(effect2);\n                  const from2 = GameStateFn.getItemBaSyou(ctx3, cardId3);\n                  const to = DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"G\\u30BE\\u30FC\\u30F3\");\n                  ctx3 = GameStateFn.doItemMove(ctx3, to, [cardId3, from2]);\n                  ctx3 = GameStateFn.triggerEvent(ctx3, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                  return ctx3;\n                }\n                if (prototype2.category == \"\\u30AA\\u30DA\\u30EC\\u30FC\\u30B7\\u30E7\\u30F3\") {\n                  const cardId3 = DefineFn.EffectFn.getCardID(effect2);\n                  const from2 = GameStateFn.getItemBaSyou(ctx3, cardId3);\n                  const to = DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\");\n                  ctx3 = GameStateFn.doItemMove(ctx3, to, [cardId3, from2]);\n                  ctx3 = GameStateFn.triggerEvent(ctx3, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                  return ctx3;\n                }\n                if (prototype2.category == \"ACE\") {\n                  throw new Error(`not support category: ${prototype2.category}`);\n                }\n                return ctx3;\n              }"
                                }
                            ]
                        }
                    ]
                }
            },
            "logicID": 0,
            "logicSubID": 0,
            "tipOrErrors": [
                {
                    "conditionKey": "合計国力〔x〕",
                    "tip": null,
                    "errors": [
                        "合計国力〔x〕:1 < 2. 從手中即將出牌, 出牌後會產生場出的效果"
                    ]
                },
                {
                    "conditionKey": "0[黒]",
                    "tip": {
                        "title": [
                            "カード",
                            [
                                [
                                    "card_0192280d-2a1a-722c-bee8-d64a581beb03",
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
                                    "card_0192280d-2a1a-722c-bee8-d64a581beb03",
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
            "effect": {
                "id": "getPlayCardEffects_card_0192280d-2a1a-722c-bee8-380ec4e3af20",
                "reason": [
                    "PlayCard",
                    "PlayerB",
                    "card_0192280d-2a1a-722c-bee8-380ec4e3af20"
                ],
                "description": "從手中即將出牌, 出牌後會產生場出的效果",
                "text": {
                    "id": "getPlayCardEffects_text_card_0192280d-2a1a-722c-bee8-380ec4e3af20",
                    "title": [
                        "使用型",
                        [
                            "配備フェイズ"
                        ]
                    ],
                    "description": "從手中即將出牌, 出牌後會產生場出的效果",
                    "conditions": {
                        "合計国力〔x〕": {
                            "actions": [
                                {
                                    "title": [
                                        "合計国力〔x〕",
                                        2
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
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect2, { DefineFn, GameStateFn, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn.EffectFn.getCardID(effect2);\n                const prototype2 = GameStateFn.getItemPrototype(ctx3, cardId2);\n                const from = GameStateFn.getItemBaSyou(ctx3, cardId2);\n                ctx3 = GameStateFn.doItemMove(ctx3, DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u3044\\u308B\\u30AB\\u30FC\\u30C9\"), [cardId2, from]);\n                if (prototype2.category == \"\\u30E6\\u30CB\\u30C3\\u30C8\") {\n                  return GameStateFn.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn.EffectFn.getPlayerID(effect2), DefineFn.EffectFn.getCardID(effect2)],\n                    description: effect2.text.description,\n                    text: {\n                      id: effect2.text.id,\n                      description: effect2.text.description,\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect3, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                                const cardId3 = DefineFn2.EffectFn.getCardID(effect3);\n                                const from2 = GameStateFn2.getItemBaSyou(ctx4, cardId3);\n                                const to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\");\n                                ctx4 = GameStateFn2.moveItem(ctx4, to, [cardId3, from2]);\n                                const hasHigh = GameStateFn2.getCardHasSpeicalEffect(ctx4, [\"\\u6226\\u95D8\\u914D\\u5099\"], cardId3);\n                                const hasPS = GameStateFn2.getCardHasSpeicalEffect(ctx4, [\"PS\\u88C5\\u7532\"], cardId3);\n                                const isNoNeedRoll = hasHigh || hasPS;\n                                const isRoll = isNoNeedRoll == false;\n                                ctx4 = GameStateFn2.setItemIsRoll(ctx4, isRoll, [cardId3, to]);\n                                ctx4 = GameStateFn2.triggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                                return ctx4;\n                              }.toString()\n                            }\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30AD\\u30E3\\u30E9\\u30AF\\u30BF\\u30FC\" || prototype2.category == \"\\u30AA\\u30DA\\u30EC\\u30FC\\u30B7\\u30E7\\u30F3(\\u30E6\\u30CB\\u30C3\\u30C8)\") {\n                  return GameStateFn.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn.EffectFn.getPlayerID(effect2), DefineFn.EffectFn.getCardID(effect2)],\n                    description: effect2.text.description,\n                    text: {\n                      id: effect2.text.id,\n                      description: effect2.text.description,\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect3, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                                const cardId3 = DefineFn2.EffectFn.getCardID(effect3);\n                                const pairs = GameStateFn2.getCardTipStrBaSyouPairs(ctx4, \"\\u4E00\\u500B\\u81EA\\u8ECD\\u6A5F\\u9AD4\", cardId3);\n                                const [targetCardId, targetBasyou] = pairs[0];\n                                const from2 = GameStateFn2.getItemBaSyou(ctx4, cardId3);\n                                const to = targetBasyou;\n                                ctx4 = GameStateFn2.moveItem(ctx4, to, [cardId3, from2]);\n                                ctx4 = GameStateFn2.setSetGroupParent(ctx4, targetCardId, cardId3);\n                                ctx4 = GameStateFn2.triggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                                ctx4 = GameStateFn2.triggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u30BB\\u30C3\\u30C8\\u3055\\u308C\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                                return ctx4;\n                              }.toString()\n                            }\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30B3\\u30DE\\u30F3\\u30C9\") {\n                  return GameStateFn.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn.EffectFn.getPlayerID(effect2), DefineFn.EffectFn.getCardID(effect2)],\n                    description: effect2.text.description,\n                    text: {\n                      id: prototype2.commandText?.id || ToolFn2.getUUID(\"getPlayCardEffects\"),\n                      description: prototype2.commandText?.description || \"unknown\",\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect3, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                                const cardId3 = DefineFn2.EffectFn.getCardID(effect3);\n                                const from2 = GameStateFn2.getItemBaSyou(ctx4, cardId3);\n                                const to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u30B8\\u30E3\\u30F3\\u30AF\\u30E4\\u30FC\\u30C9\");\n                                ctx4 = GameStateFn2.moveItem(ctx4, to, [cardId3, from2]);\n                                ctx4 = GameStateFn2.triggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                                return ctx4;\n                              }.toString()\n                            },\n                            ...prototype2.commandText?.logicTreeActions?.[0].actions || []\n                          ]\n                        },\n                        ...prototype2.commandText?.logicTreeActions?.slice(1) || []\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30B0\\u30E9\\u30D5\\u30A3\\u30C3\\u30AF\") {\n                  const cardId3 = DefineFn.EffectFn.getCardID(effect2);\n                  const from2 = GameStateFn.getItemBaSyou(ctx3, cardId3);\n                  const to = DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"G\\u30BE\\u30FC\\u30F3\");\n                  ctx3 = GameStateFn.doItemMove(ctx3, to, [cardId3, from2]);\n                  ctx3 = GameStateFn.triggerEvent(ctx3, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                  return ctx3;\n                }\n                if (prototype2.category == \"\\u30AA\\u30DA\\u30EC\\u30FC\\u30B7\\u30E7\\u30F3\") {\n                  const cardId3 = DefineFn.EffectFn.getCardID(effect2);\n                  const from2 = GameStateFn.getItemBaSyou(ctx3, cardId3);\n                  const to = DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\");\n                  ctx3 = GameStateFn.doItemMove(ctx3, to, [cardId3, from2]);\n                  ctx3 = GameStateFn.triggerEvent(ctx3, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                  return ctx3;\n                }\n                if (prototype2.category == \"ACE\") {\n                  throw new Error(`not support category: ${prototype2.category}`);\n                }\n                return ctx3;\n              }"
                                }
                            ]
                        }
                    ]
                }
            },
            "logicID": 0,
            "logicSubID": 0,
            "tipOrErrors": [
                {
                    "conditionKey": "合計国力〔x〕",
                    "tip": null,
                    "errors": [
                        "合計国力〔x〕:1 < 2. 從手中即將出牌, 出牌後會產生場出的效果"
                    ]
                },
                {
                    "conditionKey": "0[黒]",
                    "tip": {
                        "title": [
                            "カード",
                            [
                                [
                                    "card_0192280d-2a1a-722c-bee8-d64a581beb03",
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
                                    "card_0192280d-2a1a-722c-bee8-d64a581beb03",
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
            "effect": {
                "id": "getPlayGEffects_card_0192280d-2a1a-722c-bee8-b807844b970f",
                "reason": [
                    "PlayCard",
                    "PlayerB",
                    "card_0192280d-2a1a-722c-bee8-b807844b970f"
                ],
                "description": "PlayG",
                "text": {
                    "id": "getPlayGEffects_text_card_0192280d-2a1a-722c-bee8-b807844b970f",
                    "title": [],
                    "conditions": {
                        "出G上限": {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect5, { DefineFn: DefineFn2, GameStateFn: GameStateFn2, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn2.EffectFn.getCardID(effect5);\n                const cardController = GameStateFn2.getItemController(ctx3, cardId2);\n                const ps = GameStateFn2.getPlayerState(ctx3, cardController);\n                if (ps.playGCount > 0) {\n                  throw new DefineFn2.GameError(`\\u51FAG\\u4E0A\\u9650: ${ps.playGCount}`);\n                }\n                ctx3 = GameStateFn2.mapPlayerState(ctx3, cardController, (ps2) => {\n                  return {\n                    ...ps2,\n                    playGCount: ps2.playGCount + 1\n                  };\n                });\n                return ctx3;\n              }"
                                }
                            ]
                        }
                    },
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect5, { DefineFn: DefineFn2, GameStateFn: GameStateFn2, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn2.EffectFn.getCardID(effect5);\n                const from = GameStateFn2.getItemBaSyou(ctx3, cardId2);\n                ctx3 = GameStateFn2.moveItem(ctx3, DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"G\\u30BE\\u30FC\\u30F3\"), [cardId2, from]);\n                return ctx3;\n              }"
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
            "logicID": 0,
            "logicSubID": 0,
            "tipOrErrors": [
                {
                    "conditionKey": "出G上限",
                    "tip": null,
                    "errors": [
                        "出G上限: 1"
                    ]
                }
            ]
        },
        {
            "effect": {
                "id": "getPlayGEffects_card_0192280d-2a1a-722c-bee8-09acb2c31074",
                "reason": [
                    "PlayCard",
                    "PlayerB",
                    "card_0192280d-2a1a-722c-bee8-09acb2c31074"
                ],
                "description": "PlayG",
                "text": {
                    "id": "getPlayGEffects_text_card_0192280d-2a1a-722c-bee8-09acb2c31074",
                    "title": [],
                    "conditions": {
                        "出G上限": {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect5, { DefineFn: DefineFn2, GameStateFn: GameStateFn2, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn2.EffectFn.getCardID(effect5);\n                const cardController = GameStateFn2.getItemController(ctx3, cardId2);\n                const ps = GameStateFn2.getPlayerState(ctx3, cardController);\n                if (ps.playGCount > 0) {\n                  throw new DefineFn2.GameError(`\\u51FAG\\u4E0A\\u9650: ${ps.playGCount}`);\n                }\n                ctx3 = GameStateFn2.mapPlayerState(ctx3, cardController, (ps2) => {\n                  return {\n                    ...ps2,\n                    playGCount: ps2.playGCount + 1\n                  };\n                });\n                return ctx3;\n              }"
                                }
                            ]
                        }
                    },
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect5, { DefineFn: DefineFn2, GameStateFn: GameStateFn2, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn2.EffectFn.getCardID(effect5);\n                const from = GameStateFn2.getItemBaSyou(ctx3, cardId2);\n                ctx3 = GameStateFn2.moveItem(ctx3, DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"G\\u30BE\\u30FC\\u30F3\"), [cardId2, from]);\n                return ctx3;\n              }"
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
            "logicID": 0,
            "logicSubID": 0,
            "tipOrErrors": [
                {
                    "conditionKey": "出G上限",
                    "tip": null,
                    "errors": [
                        "出G上限: 1"
                    ]
                }
            ]
        },
        {
            "effect": {
                "id": "getPlayGEffects_card_0192280d-2a1a-722c-bee8-af517568f08a",
                "reason": [
                    "PlayCard",
                    "PlayerB",
                    "card_0192280d-2a1a-722c-bee8-af517568f08a"
                ],
                "description": "PlayG",
                "text": {
                    "id": "getPlayGEffects_text_card_0192280d-2a1a-722c-bee8-af517568f08a",
                    "title": [],
                    "conditions": {
                        "出G上限": {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect5, { DefineFn: DefineFn2, GameStateFn: GameStateFn2, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn2.EffectFn.getCardID(effect5);\n                const cardController = GameStateFn2.getItemController(ctx3, cardId2);\n                const ps = GameStateFn2.getPlayerState(ctx3, cardController);\n                if (ps.playGCount > 0) {\n                  throw new DefineFn2.GameError(`\\u51FAG\\u4E0A\\u9650: ${ps.playGCount}`);\n                }\n                ctx3 = GameStateFn2.mapPlayerState(ctx3, cardController, (ps2) => {\n                  return {\n                    ...ps2,\n                    playGCount: ps2.playGCount + 1\n                  };\n                });\n                return ctx3;\n              }"
                                }
                            ]
                        }
                    },
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect5, { DefineFn: DefineFn2, GameStateFn: GameStateFn2, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn2.EffectFn.getCardID(effect5);\n                const from = GameStateFn2.getItemBaSyou(ctx3, cardId2);\n                ctx3 = GameStateFn2.moveItem(ctx3, DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"G\\u30BE\\u30FC\\u30F3\"), [cardId2, from]);\n                return ctx3;\n              }"
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
            "logicID": 0,
            "logicSubID": 0,
            "tipOrErrors": [
                {
                    "conditionKey": "出G上限",
                    "tip": null,
                    "errors": [
                        "出G上限: 1"
                    ]
                }
            ]
        },
        {
            "effect": {
                "id": "getPlayGEffects_card_0192280d-2a1a-722c-bee8-380ec4e3af20",
                "reason": [
                    "PlayCard",
                    "PlayerB",
                    "card_0192280d-2a1a-722c-bee8-380ec4e3af20"
                ],
                "description": "PlayG",
                "text": {
                    "id": "getPlayGEffects_text_card_0192280d-2a1a-722c-bee8-380ec4e3af20",
                    "title": [],
                    "conditions": {
                        "出G上限": {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect5, { DefineFn: DefineFn2, GameStateFn: GameStateFn2, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn2.EffectFn.getCardID(effect5);\n                const cardController = GameStateFn2.getItemController(ctx3, cardId2);\n                const ps = GameStateFn2.getPlayerState(ctx3, cardController);\n                if (ps.playGCount > 0) {\n                  throw new DefineFn2.GameError(`\\u51FAG\\u4E0A\\u9650: ${ps.playGCount}`);\n                }\n                ctx3 = GameStateFn2.mapPlayerState(ctx3, cardController, (ps2) => {\n                  return {\n                    ...ps2,\n                    playGCount: ps2.playGCount + 1\n                  };\n                });\n                return ctx3;\n              }"
                                }
                            ]
                        }
                    },
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect5, { DefineFn: DefineFn2, GameStateFn: GameStateFn2, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn2.EffectFn.getCardID(effect5);\n                const from = GameStateFn2.getItemBaSyou(ctx3, cardId2);\n                ctx3 = GameStateFn2.moveItem(ctx3, DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"G\\u30BE\\u30FC\\u30F3\"), [cardId2, from]);\n                return ctx3;\n              }"
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
            "logicID": 0,
            "logicSubID": 0,
            "tipOrErrors": [
                {
                    "conditionKey": "出G上限",
                    "tip": null,
                    "errors": [
                        "出G上限: 1"
                    ]
                }
            ]
        }
    ],
    "commandEffects": [
        {
            "id": "getPlayCardEffects_card_0192280d-2a19-722c-bee6-ebcff7840b12",
            "reason": [
                "PlayCard",
                "PlayerA",
                "card_0192280d-2a19-722c-bee6-ebcff7840b12"
            ],
            "description": "從手中即將出牌, 出牌後會產生場出的效果",
            "text": {
                "id": "getPlayCardEffects_text_card_0192280d-2a19-722c-bee6-ebcff7840b12",
                "title": [
                    "使用型",
                    [
                        "配備フェイズ"
                    ]
                ],
                "description": "從手中即將出牌, 出牌後會產生場出的效果",
                "conditions": {
                    "合計国力〔x〕": {
                        "actions": [
                            {
                                "title": [
                                    "合計国力〔x〕",
                                    2
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
                        "actions": [
                            {
                                "title": "function _(ctx3, effect2, { DefineFn, GameStateFn, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn.EffectFn.getCardID(effect2);\n                const prototype2 = GameStateFn.getItemPrototype(ctx3, cardId2);\n                const from = GameStateFn.getItemBaSyou(ctx3, cardId2);\n                ctx3 = GameStateFn.doItemMove(ctx3, DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u3044\\u308B\\u30AB\\u30FC\\u30C9\"), [cardId2, from]);\n                if (prototype2.category == \"\\u30E6\\u30CB\\u30C3\\u30C8\") {\n                  return GameStateFn.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn.EffectFn.getPlayerID(effect2), DefineFn.EffectFn.getCardID(effect2)],\n                    description: effect2.text.description,\n                    text: {\n                      id: effect2.text.id,\n                      description: effect2.text.description,\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect3, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                                const cardId3 = DefineFn2.EffectFn.getCardID(effect3);\n                                const from2 = GameStateFn2.getItemBaSyou(ctx4, cardId3);\n                                const to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\");\n                                ctx4 = GameStateFn2.moveItem(ctx4, to, [cardId3, from2]);\n                                const hasHigh = GameStateFn2.getCardHasSpeicalEffect(ctx4, [\"\\u6226\\u95D8\\u914D\\u5099\"], cardId3);\n                                const hasPS = GameStateFn2.getCardHasSpeicalEffect(ctx4, [\"PS\\u88C5\\u7532\"], cardId3);\n                                const isNoNeedRoll = hasHigh || hasPS;\n                                const isRoll = isNoNeedRoll == false;\n                                ctx4 = GameStateFn2.setItemIsRoll(ctx4, isRoll, [cardId3, to]);\n                                ctx4 = GameStateFn2.triggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                                return ctx4;\n                              }.toString()\n                            }\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30AD\\u30E3\\u30E9\\u30AF\\u30BF\\u30FC\" || prototype2.category == \"\\u30AA\\u30DA\\u30EC\\u30FC\\u30B7\\u30E7\\u30F3(\\u30E6\\u30CB\\u30C3\\u30C8)\") {\n                  return GameStateFn.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn.EffectFn.getPlayerID(effect2), DefineFn.EffectFn.getCardID(effect2)],\n                    description: effect2.text.description,\n                    text: {\n                      id: effect2.text.id,\n                      description: effect2.text.description,\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect3, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                                const cardId3 = DefineFn2.EffectFn.getCardID(effect3);\n                                const pairs = GameStateFn2.getCardTipStrBaSyouPairs(ctx4, \"\\u4E00\\u500B\\u81EA\\u8ECD\\u6A5F\\u9AD4\", cardId3);\n                                const [targetCardId, targetBasyou] = pairs[0];\n                                const from2 = GameStateFn2.getItemBaSyou(ctx4, cardId3);\n                                const to = targetBasyou;\n                                ctx4 = GameStateFn2.moveItem(ctx4, to, [cardId3, from2]);\n                                ctx4 = GameStateFn2.setSetGroupParent(ctx4, targetCardId, cardId3);\n                                ctx4 = GameStateFn2.triggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                                ctx4 = GameStateFn2.triggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u30BB\\u30C3\\u30C8\\u3055\\u308C\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                                return ctx4;\n                              }.toString()\n                            }\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30B3\\u30DE\\u30F3\\u30C9\") {\n                  return GameStateFn.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn.EffectFn.getPlayerID(effect2), DefineFn.EffectFn.getCardID(effect2)],\n                    description: effect2.text.description,\n                    text: {\n                      id: prototype2.commandText?.id || ToolFn2.getUUID(\"getPlayCardEffects\"),\n                      description: prototype2.commandText?.description || \"unknown\",\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect3, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                                const cardId3 = DefineFn2.EffectFn.getCardID(effect3);\n                                const from2 = GameStateFn2.getItemBaSyou(ctx4, cardId3);\n                                const to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u30B8\\u30E3\\u30F3\\u30AF\\u30E4\\u30FC\\u30C9\");\n                                ctx4 = GameStateFn2.moveItem(ctx4, to, [cardId3, from2]);\n                                ctx4 = GameStateFn2.triggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                                return ctx4;\n                              }.toString()\n                            },\n                            ...prototype2.commandText?.logicTreeActions?.[0].actions || []\n                          ]\n                        },\n                        ...prototype2.commandText?.logicTreeActions?.slice(1) || []\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30B0\\u30E9\\u30D5\\u30A3\\u30C3\\u30AF\") {\n                  const cardId3 = DefineFn.EffectFn.getCardID(effect2);\n                  const from2 = GameStateFn.getItemBaSyou(ctx3, cardId3);\n                  const to = DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"G\\u30BE\\u30FC\\u30F3\");\n                  ctx3 = GameStateFn.doItemMove(ctx3, to, [cardId3, from2]);\n                  ctx3 = GameStateFn.triggerEvent(ctx3, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                  return ctx3;\n                }\n                if (prototype2.category == \"\\u30AA\\u30DA\\u30EC\\u30FC\\u30B7\\u30E7\\u30F3\") {\n                  const cardId3 = DefineFn.EffectFn.getCardID(effect2);\n                  const from2 = GameStateFn.getItemBaSyou(ctx3, cardId3);\n                  const to = DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\");\n                  ctx3 = GameStateFn.doItemMove(ctx3, to, [cardId3, from2]);\n                  ctx3 = GameStateFn.triggerEvent(ctx3, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                  return ctx3;\n                }\n                if (prototype2.category == \"ACE\") {\n                  throw new Error(`not support category: ${prototype2.category}`);\n                }\n                return ctx3;\n              }"
                            }
                        ]
                    }
                ]
            }
        },
        {
            "id": "getPlayGEffects_card_0192280d-2a19-722c-bee6-ebcff7840b12",
            "reason": [
                "PlayCard",
                "PlayerA",
                "card_0192280d-2a19-722c-bee6-ebcff7840b12"
            ],
            "description": "PlayG",
            "text": {
                "id": "getPlayGEffects_text_card_0192280d-2a19-722c-bee6-ebcff7840b12",
                "title": [],
                "conditions": {
                    "出G上限": {
                        "actions": [
                            {
                                "title": "function _(ctx3, effect5, { DefineFn: DefineFn2, GameStateFn: GameStateFn2, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn2.EffectFn.getCardID(effect5);\n                const cardController = GameStateFn2.getItemController(ctx3, cardId2);\n                const ps = GameStateFn2.getPlayerState(ctx3, cardController);\n                if (ps.playGCount > 0) {\n                  throw new DefineFn2.GameError(`\\u51FAG\\u4E0A\\u9650: ${ps.playGCount}`);\n                }\n                ctx3 = GameStateFn2.mapPlayerState(ctx3, cardController, (ps2) => {\n                  return {\n                    ...ps2,\n                    playGCount: ps2.playGCount + 1\n                  };\n                });\n                return ctx3;\n              }"
                            }
                        ]
                    }
                },
                "logicTreeActions": [
                    {
                        "actions": [
                            {
                                "title": "function _(ctx3, effect5, { DefineFn: DefineFn2, GameStateFn: GameStateFn2, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn2.EffectFn.getCardID(effect5);\n                const from = GameStateFn2.getItemBaSyou(ctx3, cardId2);\n                ctx3 = GameStateFn2.moveItem(ctx3, DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"G\\u30BE\\u30FC\\u30F3\"), [cardId2, from]);\n                return ctx3;\n              }"
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
        {
            "id": "getPlayCardEffects_card_0192280d-2a1a-722c-bee8-b807844b970f",
            "reason": [
                "PlayCard",
                "PlayerB",
                "card_0192280d-2a1a-722c-bee8-b807844b970f"
            ],
            "description": "從手中即將出牌, 出牌後會產生場出的效果",
            "text": {
                "id": "getPlayCardEffects_text_card_0192280d-2a1a-722c-bee8-b807844b970f",
                "title": [
                    "使用型",
                    [
                        "配備フェイズ"
                    ]
                ],
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
                        "actions": [
                            {
                                "title": "function _(ctx3, effect2, { DefineFn, GameStateFn, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn.EffectFn.getCardID(effect2);\n                const prototype2 = GameStateFn.getItemPrototype(ctx3, cardId2);\n                const from = GameStateFn.getItemBaSyou(ctx3, cardId2);\n                ctx3 = GameStateFn.doItemMove(ctx3, DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u3044\\u308B\\u30AB\\u30FC\\u30C9\"), [cardId2, from]);\n                if (prototype2.category == \"\\u30E6\\u30CB\\u30C3\\u30C8\") {\n                  return GameStateFn.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn.EffectFn.getPlayerID(effect2), DefineFn.EffectFn.getCardID(effect2)],\n                    description: effect2.text.description,\n                    text: {\n                      id: effect2.text.id,\n                      description: effect2.text.description,\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect3, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                                const cardId3 = DefineFn2.EffectFn.getCardID(effect3);\n                                const from2 = GameStateFn2.getItemBaSyou(ctx4, cardId3);\n                                const to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\");\n                                ctx4 = GameStateFn2.moveItem(ctx4, to, [cardId3, from2]);\n                                const hasHigh = GameStateFn2.getCardHasSpeicalEffect(ctx4, [\"\\u6226\\u95D8\\u914D\\u5099\"], cardId3);\n                                const hasPS = GameStateFn2.getCardHasSpeicalEffect(ctx4, [\"PS\\u88C5\\u7532\"], cardId3);\n                                const isNoNeedRoll = hasHigh || hasPS;\n                                const isRoll = isNoNeedRoll == false;\n                                ctx4 = GameStateFn2.setItemIsRoll(ctx4, isRoll, [cardId3, to]);\n                                ctx4 = GameStateFn2.triggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                                return ctx4;\n                              }.toString()\n                            }\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30AD\\u30E3\\u30E9\\u30AF\\u30BF\\u30FC\" || prototype2.category == \"\\u30AA\\u30DA\\u30EC\\u30FC\\u30B7\\u30E7\\u30F3(\\u30E6\\u30CB\\u30C3\\u30C8)\") {\n                  return GameStateFn.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn.EffectFn.getPlayerID(effect2), DefineFn.EffectFn.getCardID(effect2)],\n                    description: effect2.text.description,\n                    text: {\n                      id: effect2.text.id,\n                      description: effect2.text.description,\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect3, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                                const cardId3 = DefineFn2.EffectFn.getCardID(effect3);\n                                const pairs = GameStateFn2.getCardTipStrBaSyouPairs(ctx4, \"\\u4E00\\u500B\\u81EA\\u8ECD\\u6A5F\\u9AD4\", cardId3);\n                                const [targetCardId, targetBasyou] = pairs[0];\n                                const from2 = GameStateFn2.getItemBaSyou(ctx4, cardId3);\n                                const to = targetBasyou;\n                                ctx4 = GameStateFn2.moveItem(ctx4, to, [cardId3, from2]);\n                                ctx4 = GameStateFn2.setSetGroupParent(ctx4, targetCardId, cardId3);\n                                ctx4 = GameStateFn2.triggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                                ctx4 = GameStateFn2.triggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u30BB\\u30C3\\u30C8\\u3055\\u308C\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                                return ctx4;\n                              }.toString()\n                            }\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30B3\\u30DE\\u30F3\\u30C9\") {\n                  return GameStateFn.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn.EffectFn.getPlayerID(effect2), DefineFn.EffectFn.getCardID(effect2)],\n                    description: effect2.text.description,\n                    text: {\n                      id: prototype2.commandText?.id || ToolFn2.getUUID(\"getPlayCardEffects\"),\n                      description: prototype2.commandText?.description || \"unknown\",\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect3, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                                const cardId3 = DefineFn2.EffectFn.getCardID(effect3);\n                                const from2 = GameStateFn2.getItemBaSyou(ctx4, cardId3);\n                                const to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u30B8\\u30E3\\u30F3\\u30AF\\u30E4\\u30FC\\u30C9\");\n                                ctx4 = GameStateFn2.moveItem(ctx4, to, [cardId3, from2]);\n                                ctx4 = GameStateFn2.triggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                                return ctx4;\n                              }.toString()\n                            },\n                            ...prototype2.commandText?.logicTreeActions?.[0].actions || []\n                          ]\n                        },\n                        ...prototype2.commandText?.logicTreeActions?.slice(1) || []\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30B0\\u30E9\\u30D5\\u30A3\\u30C3\\u30AF\") {\n                  const cardId3 = DefineFn.EffectFn.getCardID(effect2);\n                  const from2 = GameStateFn.getItemBaSyou(ctx3, cardId3);\n                  const to = DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"G\\u30BE\\u30FC\\u30F3\");\n                  ctx3 = GameStateFn.doItemMove(ctx3, to, [cardId3, from2]);\n                  ctx3 = GameStateFn.triggerEvent(ctx3, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                  return ctx3;\n                }\n                if (prototype2.category == \"\\u30AA\\u30DA\\u30EC\\u30FC\\u30B7\\u30E7\\u30F3\") {\n                  const cardId3 = DefineFn.EffectFn.getCardID(effect2);\n                  const from2 = GameStateFn.getItemBaSyou(ctx3, cardId3);\n                  const to = DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\");\n                  ctx3 = GameStateFn.doItemMove(ctx3, to, [cardId3, from2]);\n                  ctx3 = GameStateFn.triggerEvent(ctx3, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                  return ctx3;\n                }\n                if (prototype2.category == \"ACE\") {\n                  throw new Error(`not support category: ${prototype2.category}`);\n                }\n                return ctx3;\n              }"
                            }
                        ]
                    }
                ]
            }
        },
        {
            "id": "getPlayCardEffects_card_0192280d-2a1a-722c-bee8-09acb2c31074",
            "reason": [
                "PlayCard",
                "PlayerB",
                "card_0192280d-2a1a-722c-bee8-09acb2c31074"
            ],
            "description": "從手中即將出牌, 出牌後會產生場出的效果",
            "text": {
                "id": "getPlayCardEffects_text_card_0192280d-2a1a-722c-bee8-09acb2c31074",
                "title": [
                    "使用型",
                    [
                        "配備フェイズ"
                    ]
                ],
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
                        "actions": [
                            {
                                "title": "function _(ctx3, effect2, { DefineFn, GameStateFn, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn.EffectFn.getCardID(effect2);\n                const prototype2 = GameStateFn.getItemPrototype(ctx3, cardId2);\n                const from = GameStateFn.getItemBaSyou(ctx3, cardId2);\n                ctx3 = GameStateFn.doItemMove(ctx3, DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u3044\\u308B\\u30AB\\u30FC\\u30C9\"), [cardId2, from]);\n                if (prototype2.category == \"\\u30E6\\u30CB\\u30C3\\u30C8\") {\n                  return GameStateFn.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn.EffectFn.getPlayerID(effect2), DefineFn.EffectFn.getCardID(effect2)],\n                    description: effect2.text.description,\n                    text: {\n                      id: effect2.text.id,\n                      description: effect2.text.description,\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect3, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                                const cardId3 = DefineFn2.EffectFn.getCardID(effect3);\n                                const from2 = GameStateFn2.getItemBaSyou(ctx4, cardId3);\n                                const to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\");\n                                ctx4 = GameStateFn2.moveItem(ctx4, to, [cardId3, from2]);\n                                const hasHigh = GameStateFn2.getCardHasSpeicalEffect(ctx4, [\"\\u6226\\u95D8\\u914D\\u5099\"], cardId3);\n                                const hasPS = GameStateFn2.getCardHasSpeicalEffect(ctx4, [\"PS\\u88C5\\u7532\"], cardId3);\n                                const isNoNeedRoll = hasHigh || hasPS;\n                                const isRoll = isNoNeedRoll == false;\n                                ctx4 = GameStateFn2.setItemIsRoll(ctx4, isRoll, [cardId3, to]);\n                                ctx4 = GameStateFn2.triggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                                return ctx4;\n                              }.toString()\n                            }\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30AD\\u30E3\\u30E9\\u30AF\\u30BF\\u30FC\" || prototype2.category == \"\\u30AA\\u30DA\\u30EC\\u30FC\\u30B7\\u30E7\\u30F3(\\u30E6\\u30CB\\u30C3\\u30C8)\") {\n                  return GameStateFn.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn.EffectFn.getPlayerID(effect2), DefineFn.EffectFn.getCardID(effect2)],\n                    description: effect2.text.description,\n                    text: {\n                      id: effect2.text.id,\n                      description: effect2.text.description,\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect3, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                                const cardId3 = DefineFn2.EffectFn.getCardID(effect3);\n                                const pairs = GameStateFn2.getCardTipStrBaSyouPairs(ctx4, \"\\u4E00\\u500B\\u81EA\\u8ECD\\u6A5F\\u9AD4\", cardId3);\n                                const [targetCardId, targetBasyou] = pairs[0];\n                                const from2 = GameStateFn2.getItemBaSyou(ctx4, cardId3);\n                                const to = targetBasyou;\n                                ctx4 = GameStateFn2.moveItem(ctx4, to, [cardId3, from2]);\n                                ctx4 = GameStateFn2.setSetGroupParent(ctx4, targetCardId, cardId3);\n                                ctx4 = GameStateFn2.triggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                                ctx4 = GameStateFn2.triggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u30BB\\u30C3\\u30C8\\u3055\\u308C\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                                return ctx4;\n                              }.toString()\n                            }\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30B3\\u30DE\\u30F3\\u30C9\") {\n                  return GameStateFn.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn.EffectFn.getPlayerID(effect2), DefineFn.EffectFn.getCardID(effect2)],\n                    description: effect2.text.description,\n                    text: {\n                      id: prototype2.commandText?.id || ToolFn2.getUUID(\"getPlayCardEffects\"),\n                      description: prototype2.commandText?.description || \"unknown\",\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect3, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                                const cardId3 = DefineFn2.EffectFn.getCardID(effect3);\n                                const from2 = GameStateFn2.getItemBaSyou(ctx4, cardId3);\n                                const to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u30B8\\u30E3\\u30F3\\u30AF\\u30E4\\u30FC\\u30C9\");\n                                ctx4 = GameStateFn2.moveItem(ctx4, to, [cardId3, from2]);\n                                ctx4 = GameStateFn2.triggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                                return ctx4;\n                              }.toString()\n                            },\n                            ...prototype2.commandText?.logicTreeActions?.[0].actions || []\n                          ]\n                        },\n                        ...prototype2.commandText?.logicTreeActions?.slice(1) || []\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30B0\\u30E9\\u30D5\\u30A3\\u30C3\\u30AF\") {\n                  const cardId3 = DefineFn.EffectFn.getCardID(effect2);\n                  const from2 = GameStateFn.getItemBaSyou(ctx3, cardId3);\n                  const to = DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"G\\u30BE\\u30FC\\u30F3\");\n                  ctx3 = GameStateFn.doItemMove(ctx3, to, [cardId3, from2]);\n                  ctx3 = GameStateFn.triggerEvent(ctx3, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                  return ctx3;\n                }\n                if (prototype2.category == \"\\u30AA\\u30DA\\u30EC\\u30FC\\u30B7\\u30E7\\u30F3\") {\n                  const cardId3 = DefineFn.EffectFn.getCardID(effect2);\n                  const from2 = GameStateFn.getItemBaSyou(ctx3, cardId3);\n                  const to = DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\");\n                  ctx3 = GameStateFn.doItemMove(ctx3, to, [cardId3, from2]);\n                  ctx3 = GameStateFn.triggerEvent(ctx3, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                  return ctx3;\n                }\n                if (prototype2.category == \"ACE\") {\n                  throw new Error(`not support category: ${prototype2.category}`);\n                }\n                return ctx3;\n              }"
                            }
                        ]
                    }
                ]
            }
        },
        {
            "id": "getPlayCardEffects_card_0192280d-2a1a-722c-bee8-af517568f08a",
            "reason": [
                "PlayCard",
                "PlayerB",
                "card_0192280d-2a1a-722c-bee8-af517568f08a"
            ],
            "description": "從手中即將出牌, 出牌後會產生場出的效果",
            "text": {
                "id": "getPlayCardEffects_text_card_0192280d-2a1a-722c-bee8-af517568f08a",
                "title": [
                    "使用型",
                    [
                        "配備フェイズ"
                    ]
                ],
                "description": "從手中即將出牌, 出牌後會產生場出的效果",
                "conditions": {
                    "合計国力〔x〕": {
                        "actions": [
                            {
                                "title": [
                                    "合計国力〔x〕",
                                    2
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
                        "actions": [
                            {
                                "title": "function _(ctx3, effect2, { DefineFn, GameStateFn, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn.EffectFn.getCardID(effect2);\n                const prototype2 = GameStateFn.getItemPrototype(ctx3, cardId2);\n                const from = GameStateFn.getItemBaSyou(ctx3, cardId2);\n                ctx3 = GameStateFn.doItemMove(ctx3, DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u3044\\u308B\\u30AB\\u30FC\\u30C9\"), [cardId2, from]);\n                if (prototype2.category == \"\\u30E6\\u30CB\\u30C3\\u30C8\") {\n                  return GameStateFn.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn.EffectFn.getPlayerID(effect2), DefineFn.EffectFn.getCardID(effect2)],\n                    description: effect2.text.description,\n                    text: {\n                      id: effect2.text.id,\n                      description: effect2.text.description,\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect3, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                                const cardId3 = DefineFn2.EffectFn.getCardID(effect3);\n                                const from2 = GameStateFn2.getItemBaSyou(ctx4, cardId3);\n                                const to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\");\n                                ctx4 = GameStateFn2.moveItem(ctx4, to, [cardId3, from2]);\n                                const hasHigh = GameStateFn2.getCardHasSpeicalEffect(ctx4, [\"\\u6226\\u95D8\\u914D\\u5099\"], cardId3);\n                                const hasPS = GameStateFn2.getCardHasSpeicalEffect(ctx4, [\"PS\\u88C5\\u7532\"], cardId3);\n                                const isNoNeedRoll = hasHigh || hasPS;\n                                const isRoll = isNoNeedRoll == false;\n                                ctx4 = GameStateFn2.setItemIsRoll(ctx4, isRoll, [cardId3, to]);\n                                ctx4 = GameStateFn2.triggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                                return ctx4;\n                              }.toString()\n                            }\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30AD\\u30E3\\u30E9\\u30AF\\u30BF\\u30FC\" || prototype2.category == \"\\u30AA\\u30DA\\u30EC\\u30FC\\u30B7\\u30E7\\u30F3(\\u30E6\\u30CB\\u30C3\\u30C8)\") {\n                  return GameStateFn.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn.EffectFn.getPlayerID(effect2), DefineFn.EffectFn.getCardID(effect2)],\n                    description: effect2.text.description,\n                    text: {\n                      id: effect2.text.id,\n                      description: effect2.text.description,\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect3, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                                const cardId3 = DefineFn2.EffectFn.getCardID(effect3);\n                                const pairs = GameStateFn2.getCardTipStrBaSyouPairs(ctx4, \"\\u4E00\\u500B\\u81EA\\u8ECD\\u6A5F\\u9AD4\", cardId3);\n                                const [targetCardId, targetBasyou] = pairs[0];\n                                const from2 = GameStateFn2.getItemBaSyou(ctx4, cardId3);\n                                const to = targetBasyou;\n                                ctx4 = GameStateFn2.moveItem(ctx4, to, [cardId3, from2]);\n                                ctx4 = GameStateFn2.setSetGroupParent(ctx4, targetCardId, cardId3);\n                                ctx4 = GameStateFn2.triggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                                ctx4 = GameStateFn2.triggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u30BB\\u30C3\\u30C8\\u3055\\u308C\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                                return ctx4;\n                              }.toString()\n                            }\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30B3\\u30DE\\u30F3\\u30C9\") {\n                  return GameStateFn.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn.EffectFn.getPlayerID(effect2), DefineFn.EffectFn.getCardID(effect2)],\n                    description: effect2.text.description,\n                    text: {\n                      id: prototype2.commandText?.id || ToolFn2.getUUID(\"getPlayCardEffects\"),\n                      description: prototype2.commandText?.description || \"unknown\",\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect3, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                                const cardId3 = DefineFn2.EffectFn.getCardID(effect3);\n                                const from2 = GameStateFn2.getItemBaSyou(ctx4, cardId3);\n                                const to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u30B8\\u30E3\\u30F3\\u30AF\\u30E4\\u30FC\\u30C9\");\n                                ctx4 = GameStateFn2.moveItem(ctx4, to, [cardId3, from2]);\n                                ctx4 = GameStateFn2.triggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                                return ctx4;\n                              }.toString()\n                            },\n                            ...prototype2.commandText?.logicTreeActions?.[0].actions || []\n                          ]\n                        },\n                        ...prototype2.commandText?.logicTreeActions?.slice(1) || []\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30B0\\u30E9\\u30D5\\u30A3\\u30C3\\u30AF\") {\n                  const cardId3 = DefineFn.EffectFn.getCardID(effect2);\n                  const from2 = GameStateFn.getItemBaSyou(ctx3, cardId3);\n                  const to = DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"G\\u30BE\\u30FC\\u30F3\");\n                  ctx3 = GameStateFn.doItemMove(ctx3, to, [cardId3, from2]);\n                  ctx3 = GameStateFn.triggerEvent(ctx3, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                  return ctx3;\n                }\n                if (prototype2.category == \"\\u30AA\\u30DA\\u30EC\\u30FC\\u30B7\\u30E7\\u30F3\") {\n                  const cardId3 = DefineFn.EffectFn.getCardID(effect2);\n                  const from2 = GameStateFn.getItemBaSyou(ctx3, cardId3);\n                  const to = DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\");\n                  ctx3 = GameStateFn.doItemMove(ctx3, to, [cardId3, from2]);\n                  ctx3 = GameStateFn.triggerEvent(ctx3, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                  return ctx3;\n                }\n                if (prototype2.category == \"ACE\") {\n                  throw new Error(`not support category: ${prototype2.category}`);\n                }\n                return ctx3;\n              }"
                            }
                        ]
                    }
                ]
            }
        },
        {
            "id": "getPlayCardEffects_card_0192280d-2a1a-722c-bee8-380ec4e3af20",
            "reason": [
                "PlayCard",
                "PlayerB",
                "card_0192280d-2a1a-722c-bee8-380ec4e3af20"
            ],
            "description": "從手中即將出牌, 出牌後會產生場出的效果",
            "text": {
                "id": "getPlayCardEffects_text_card_0192280d-2a1a-722c-bee8-380ec4e3af20",
                "title": [
                    "使用型",
                    [
                        "配備フェイズ"
                    ]
                ],
                "description": "從手中即將出牌, 出牌後會產生場出的效果",
                "conditions": {
                    "合計国力〔x〕": {
                        "actions": [
                            {
                                "title": [
                                    "合計国力〔x〕",
                                    2
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
                        "actions": [
                            {
                                "title": "function _(ctx3, effect2, { DefineFn, GameStateFn, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn.EffectFn.getCardID(effect2);\n                const prototype2 = GameStateFn.getItemPrototype(ctx3, cardId2);\n                const from = GameStateFn.getItemBaSyou(ctx3, cardId2);\n                ctx3 = GameStateFn.doItemMove(ctx3, DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u3044\\u308B\\u30AB\\u30FC\\u30C9\"), [cardId2, from]);\n                if (prototype2.category == \"\\u30E6\\u30CB\\u30C3\\u30C8\") {\n                  return GameStateFn.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn.EffectFn.getPlayerID(effect2), DefineFn.EffectFn.getCardID(effect2)],\n                    description: effect2.text.description,\n                    text: {\n                      id: effect2.text.id,\n                      description: effect2.text.description,\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect3, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                                const cardId3 = DefineFn2.EffectFn.getCardID(effect3);\n                                const from2 = GameStateFn2.getItemBaSyou(ctx4, cardId3);\n                                const to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\");\n                                ctx4 = GameStateFn2.moveItem(ctx4, to, [cardId3, from2]);\n                                const hasHigh = GameStateFn2.getCardHasSpeicalEffect(ctx4, [\"\\u6226\\u95D8\\u914D\\u5099\"], cardId3);\n                                const hasPS = GameStateFn2.getCardHasSpeicalEffect(ctx4, [\"PS\\u88C5\\u7532\"], cardId3);\n                                const isNoNeedRoll = hasHigh || hasPS;\n                                const isRoll = isNoNeedRoll == false;\n                                ctx4 = GameStateFn2.setItemIsRoll(ctx4, isRoll, [cardId3, to]);\n                                ctx4 = GameStateFn2.triggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                                return ctx4;\n                              }.toString()\n                            }\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30AD\\u30E3\\u30E9\\u30AF\\u30BF\\u30FC\" || prototype2.category == \"\\u30AA\\u30DA\\u30EC\\u30FC\\u30B7\\u30E7\\u30F3(\\u30E6\\u30CB\\u30C3\\u30C8)\") {\n                  return GameStateFn.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn.EffectFn.getPlayerID(effect2), DefineFn.EffectFn.getCardID(effect2)],\n                    description: effect2.text.description,\n                    text: {\n                      id: effect2.text.id,\n                      description: effect2.text.description,\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect3, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                                const cardId3 = DefineFn2.EffectFn.getCardID(effect3);\n                                const pairs = GameStateFn2.getCardTipStrBaSyouPairs(ctx4, \"\\u4E00\\u500B\\u81EA\\u8ECD\\u6A5F\\u9AD4\", cardId3);\n                                const [targetCardId, targetBasyou] = pairs[0];\n                                const from2 = GameStateFn2.getItemBaSyou(ctx4, cardId3);\n                                const to = targetBasyou;\n                                ctx4 = GameStateFn2.moveItem(ctx4, to, [cardId3, from2]);\n                                ctx4 = GameStateFn2.setSetGroupParent(ctx4, targetCardId, cardId3);\n                                ctx4 = GameStateFn2.triggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                                ctx4 = GameStateFn2.triggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u30BB\\u30C3\\u30C8\\u3055\\u308C\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                                return ctx4;\n                              }.toString()\n                            }\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30B3\\u30DE\\u30F3\\u30C9\") {\n                  return GameStateFn.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn.EffectFn.getPlayerID(effect2), DefineFn.EffectFn.getCardID(effect2)],\n                    description: effect2.text.description,\n                    text: {\n                      id: prototype2.commandText?.id || ToolFn2.getUUID(\"getPlayCardEffects\"),\n                      description: prototype2.commandText?.description || \"unknown\",\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect3, { DefineFn: DefineFn2, GameStateFn: GameStateFn2 }) {\n                                const cardId3 = DefineFn2.EffectFn.getCardID(effect3);\n                                const from2 = GameStateFn2.getItemBaSyou(ctx4, cardId3);\n                                const to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u30B8\\u30E3\\u30F3\\u30AF\\u30E4\\u30FC\\u30C9\");\n                                ctx4 = GameStateFn2.moveItem(ctx4, to, [cardId3, from2]);\n                                ctx4 = GameStateFn2.triggerEvent(ctx4, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                                return ctx4;\n                              }.toString()\n                            },\n                            ...prototype2.commandText?.logicTreeActions?.[0].actions || []\n                          ]\n                        },\n                        ...prototype2.commandText?.logicTreeActions?.slice(1) || []\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30B0\\u30E9\\u30D5\\u30A3\\u30C3\\u30AF\") {\n                  const cardId3 = DefineFn.EffectFn.getCardID(effect2);\n                  const from2 = GameStateFn.getItemBaSyou(ctx3, cardId3);\n                  const to = DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"G\\u30BE\\u30FC\\u30F3\");\n                  ctx3 = GameStateFn.doItemMove(ctx3, to, [cardId3, from2]);\n                  ctx3 = GameStateFn.triggerEvent(ctx3, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                  return ctx3;\n                }\n                if (prototype2.category == \"\\u30AA\\u30DA\\u30EC\\u30FC\\u30B7\\u30E7\\u30F3\") {\n                  const cardId3 = DefineFn.EffectFn.getCardID(effect2);\n                  const from2 = GameStateFn.getItemBaSyou(ctx3, cardId3);\n                  const to = DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\");\n                  ctx3 = GameStateFn.doItemMove(ctx3, to, [cardId3, from2]);\n                  ctx3 = GameStateFn.triggerEvent(ctx3, { title: [\"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u5834\\u306B\\u51FA\\u305F\\u5834\\u5408\"], cardIds: [cardId3] });\n                  return ctx3;\n                }\n                if (prototype2.category == \"ACE\") {\n                  throw new Error(`not support category: ${prototype2.category}`);\n                }\n                return ctx3;\n              }"
                            }
                        ]
                    }
                ]
            }
        },
        {
            "id": "getPlayGEffects_card_0192280d-2a1a-722c-bee8-b807844b970f",
            "reason": [
                "PlayCard",
                "PlayerB",
                "card_0192280d-2a1a-722c-bee8-b807844b970f"
            ],
            "description": "PlayG",
            "text": {
                "id": "getPlayGEffects_text_card_0192280d-2a1a-722c-bee8-b807844b970f",
                "title": [],
                "conditions": {
                    "出G上限": {
                        "actions": [
                            {
                                "title": "function _(ctx3, effect5, { DefineFn: DefineFn2, GameStateFn: GameStateFn2, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn2.EffectFn.getCardID(effect5);\n                const cardController = GameStateFn2.getItemController(ctx3, cardId2);\n                const ps = GameStateFn2.getPlayerState(ctx3, cardController);\n                if (ps.playGCount > 0) {\n                  throw new DefineFn2.GameError(`\\u51FAG\\u4E0A\\u9650: ${ps.playGCount}`);\n                }\n                ctx3 = GameStateFn2.mapPlayerState(ctx3, cardController, (ps2) => {\n                  return {\n                    ...ps2,\n                    playGCount: ps2.playGCount + 1\n                  };\n                });\n                return ctx3;\n              }"
                            }
                        ]
                    }
                },
                "logicTreeActions": [
                    {
                        "actions": [
                            {
                                "title": "function _(ctx3, effect5, { DefineFn: DefineFn2, GameStateFn: GameStateFn2, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn2.EffectFn.getCardID(effect5);\n                const from = GameStateFn2.getItemBaSyou(ctx3, cardId2);\n                ctx3 = GameStateFn2.moveItem(ctx3, DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"G\\u30BE\\u30FC\\u30F3\"), [cardId2, from]);\n                return ctx3;\n              }"
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
        {
            "id": "getPlayGEffects_card_0192280d-2a1a-722c-bee8-09acb2c31074",
            "reason": [
                "PlayCard",
                "PlayerB",
                "card_0192280d-2a1a-722c-bee8-09acb2c31074"
            ],
            "description": "PlayG",
            "text": {
                "id": "getPlayGEffects_text_card_0192280d-2a1a-722c-bee8-09acb2c31074",
                "title": [],
                "conditions": {
                    "出G上限": {
                        "actions": [
                            {
                                "title": "function _(ctx3, effect5, { DefineFn: DefineFn2, GameStateFn: GameStateFn2, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn2.EffectFn.getCardID(effect5);\n                const cardController = GameStateFn2.getItemController(ctx3, cardId2);\n                const ps = GameStateFn2.getPlayerState(ctx3, cardController);\n                if (ps.playGCount > 0) {\n                  throw new DefineFn2.GameError(`\\u51FAG\\u4E0A\\u9650: ${ps.playGCount}`);\n                }\n                ctx3 = GameStateFn2.mapPlayerState(ctx3, cardController, (ps2) => {\n                  return {\n                    ...ps2,\n                    playGCount: ps2.playGCount + 1\n                  };\n                });\n                return ctx3;\n              }"
                            }
                        ]
                    }
                },
                "logicTreeActions": [
                    {
                        "actions": [
                            {
                                "title": "function _(ctx3, effect5, { DefineFn: DefineFn2, GameStateFn: GameStateFn2, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn2.EffectFn.getCardID(effect5);\n                const from = GameStateFn2.getItemBaSyou(ctx3, cardId2);\n                ctx3 = GameStateFn2.moveItem(ctx3, DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"G\\u30BE\\u30FC\\u30F3\"), [cardId2, from]);\n                return ctx3;\n              }"
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
        {
            "id": "getPlayGEffects_card_0192280d-2a1a-722c-bee8-af517568f08a",
            "reason": [
                "PlayCard",
                "PlayerB",
                "card_0192280d-2a1a-722c-bee8-af517568f08a"
            ],
            "description": "PlayG",
            "text": {
                "id": "getPlayGEffects_text_card_0192280d-2a1a-722c-bee8-af517568f08a",
                "title": [],
                "conditions": {
                    "出G上限": {
                        "actions": [
                            {
                                "title": "function _(ctx3, effect5, { DefineFn: DefineFn2, GameStateFn: GameStateFn2, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn2.EffectFn.getCardID(effect5);\n                const cardController = GameStateFn2.getItemController(ctx3, cardId2);\n                const ps = GameStateFn2.getPlayerState(ctx3, cardController);\n                if (ps.playGCount > 0) {\n                  throw new DefineFn2.GameError(`\\u51FAG\\u4E0A\\u9650: ${ps.playGCount}`);\n                }\n                ctx3 = GameStateFn2.mapPlayerState(ctx3, cardController, (ps2) => {\n                  return {\n                    ...ps2,\n                    playGCount: ps2.playGCount + 1\n                  };\n                });\n                return ctx3;\n              }"
                            }
                        ]
                    }
                },
                "logicTreeActions": [
                    {
                        "actions": [
                            {
                                "title": "function _(ctx3, effect5, { DefineFn: DefineFn2, GameStateFn: GameStateFn2, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn2.EffectFn.getCardID(effect5);\n                const from = GameStateFn2.getItemBaSyou(ctx3, cardId2);\n                ctx3 = GameStateFn2.moveItem(ctx3, DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"G\\u30BE\\u30FC\\u30F3\"), [cardId2, from]);\n                return ctx3;\n              }"
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
        {
            "id": "getPlayGEffects_card_0192280d-2a1a-722c-bee8-380ec4e3af20",
            "reason": [
                "PlayCard",
                "PlayerB",
                "card_0192280d-2a1a-722c-bee8-380ec4e3af20"
            ],
            "description": "PlayG",
            "text": {
                "id": "getPlayGEffects_text_card_0192280d-2a1a-722c-bee8-380ec4e3af20",
                "title": [],
                "conditions": {
                    "出G上限": {
                        "actions": [
                            {
                                "title": "function _(ctx3, effect5, { DefineFn: DefineFn2, GameStateFn: GameStateFn2, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn2.EffectFn.getCardID(effect5);\n                const cardController = GameStateFn2.getItemController(ctx3, cardId2);\n                const ps = GameStateFn2.getPlayerState(ctx3, cardController);\n                if (ps.playGCount > 0) {\n                  throw new DefineFn2.GameError(`\\u51FAG\\u4E0A\\u9650: ${ps.playGCount}`);\n                }\n                ctx3 = GameStateFn2.mapPlayerState(ctx3, cardController, (ps2) => {\n                  return {\n                    ...ps2,\n                    playGCount: ps2.playGCount + 1\n                  };\n                });\n                return ctx3;\n              }"
                            }
                        ]
                    }
                },
                "logicTreeActions": [
                    {
                        "actions": [
                            {
                                "title": "function _(ctx3, effect5, { DefineFn: DefineFn2, GameStateFn: GameStateFn2, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn2.EffectFn.getCardID(effect5);\n                const from = GameStateFn2.getItemBaSyou(ctx3, cardId2);\n                ctx3 = GameStateFn2.moveItem(ctx3, DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"G\\u30BE\\u30FC\\u30F3\"), [cardId2, from]);\n                return ctx3;\n              }"
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
    ],
    "destroyEffect": []
}