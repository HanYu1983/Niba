import { PlayerA } from "../game/define/PlayerID";
import { GameStateWithFlowMemory } from "../game/gameStateWithFlowMemory/GameStateWithFlowMemory";
import { getPlayerCommands, getPlayerCommandsFilterNoError, getPlayerCommandsFilterNoErrorDistinct } from "../game/gameStateWithFlowMemory/updateCommand";

export function testIssue1() {
    const ctx:GameStateWithFlowMemory = {
        "cards": {
            "card_019218bf-257b-722c-b331-2a7f417c2811": {
                "id": "card_019218bf-257b-722c-b331-2a7f417c2811",
                "protoID": "179015_04B_O_BK010C_black",
                "ownerID": "PlayerA"
            },
            "card_019218bf-257b-722c-b331-33d95e4b6f6a": {
                "id": "card_019218bf-257b-722c-b331-33d95e4b6f6a",
                "protoID": "179015_04B_O_BK010C_black",
                "ownerID": "PlayerA"
            },
            "card_019218bf-257b-722c-b331-3fbd6e8363fe": {
                "id": "card_019218bf-257b-722c-b331-3fbd6e8363fe",
                "protoID": "179015_04B_U_BK058R_black",
                "ownerID": "PlayerA"
            },
            "card_019218bf-257b-722c-b331-4035fbd4ae4c": {
                "id": "card_019218bf-257b-722c-b331-4035fbd4ae4c",
                "protoID": "179015_04B_U_BK058R_black",
                "ownerID": "PlayerA"
            },
            "card_019218bf-257b-722c-b331-48e00f0a1ffd": {
                "id": "card_019218bf-257b-722c-b331-48e00f0a1ffd",
                "protoID": "179015_04B_U_BK059C_black",
                "ownerID": "PlayerA"
            },
            "card_019218bf-257b-722c-b331-53130727f10f": {
                "id": "card_019218bf-257b-722c-b331-53130727f10f",
                "protoID": "179015_04B_U_BK059C_black",
                "ownerID": "PlayerA"
            },
            "card_019218bf-257b-722c-b331-5ee9a60d0d74": {
                "id": "card_019218bf-257b-722c-b331-5ee9a60d0d74",
                "protoID": "179015_04B_U_BK061C_black",
                "ownerID": "PlayerA"
            },
            "card_019218bf-257b-722c-b331-65a0de404053": {
                "id": "card_019218bf-257b-722c-b331-65a0de404053",
                "protoID": "179015_04B_U_BK061C_black",
                "ownerID": "PlayerA"
            },
            "card_019218bf-257b-722c-b331-68f17727d364": {
                "id": "card_019218bf-257b-722c-b331-68f17727d364",
                "protoID": "179016_04B_U_BK066C_black",
                "ownerID": "PlayerA"
            },
            "card_019218bf-257b-722c-b331-7212b3463e8c": {
                "id": "card_019218bf-257b-722c-b331-7212b3463e8c",
                "protoID": "179016_04B_U_BK066C_black",
                "ownerID": "PlayerA"
            },
            "card_019218bf-257b-722c-b331-7ef913bc0a12": {
                "id": "card_019218bf-257b-722c-b331-7ef913bc0a12",
                "protoID": "179019_02A_C_BK015S_black",
                "ownerID": "PlayerA"
            },
            "card_019218bf-257b-722c-b331-815b8eebd43e": {
                "id": "card_019218bf-257b-722c-b331-815b8eebd43e",
                "protoID": "179019_02A_C_BK015S_black",
                "ownerID": "PlayerA"
            },
            "card_019218bf-257b-722c-b331-8b811f916eeb": {
                "id": "card_019218bf-257b-722c-b331-8b811f916eeb",
                "protoID": "179020_05C_U_BK100U_black",
                "ownerID": "PlayerA"
            },
            "card_019218bf-257b-722c-b331-97af356da49a": {
                "id": "card_019218bf-257b-722c-b331-97af356da49a",
                "protoID": "179020_05C_U_BK100U_black",
                "ownerID": "PlayerA"
            },
            "card_019218bf-257b-722c-b331-9ac72451e5f2": {
                "id": "card_019218bf-257b-722c-b331-9ac72451e5f2",
                "protoID": "179023_06C_C_BK048R_black",
                "ownerID": "PlayerA"
            },
            "card_019218bf-257b-722c-b331-a1791dd972fe": {
                "id": "card_019218bf-257b-722c-b331-a1791dd972fe",
                "protoID": "179023_06C_C_BK048R_black",
                "ownerID": "PlayerA"
            },
            "card_019218bf-257b-722c-b331-aa3708e31bc6": {
                "id": "card_019218bf-257b-722c-b331-aa3708e31bc6",
                "protoID": "179023_06C_C_BK049U_black",
                "ownerID": "PlayerA"
            },
            "card_019218bf-257b-722c-b331-b19de4df264a": {
                "id": "card_019218bf-257b-722c-b331-b19de4df264a",
                "protoID": "179023_06C_C_BK049U_black",
                "ownerID": "PlayerA"
            },
            "card_019218bf-257b-722c-b331-befcce3aeffc": {
                "id": "card_019218bf-257b-722c-b331-befcce3aeffc",
                "protoID": "179024_04B_C_BK027U_black",
                "ownerID": "PlayerA"
            },
            "card_019218bf-257b-722c-b331-c4c8fbbbc3e3": {
                "id": "card_019218bf-257b-722c-b331-c4c8fbbbc3e3",
                "protoID": "179024_04B_C_BK027U_black",
                "ownerID": "PlayerA"
            },
            "card_019218bf-257b-722c-b331-ca0a7547c3c2": {
                "id": "card_019218bf-257b-722c-b331-ca0a7547c3c2",
                "protoID": "179024_04B_U_BK060C_black",
                "ownerID": "PlayerA"
            },
            "card_019218bf-257b-722c-b331-d038d1955735": {
                "id": "card_019218bf-257b-722c-b331-d038d1955735",
                "protoID": "179024_04B_U_BK060C_black",
                "ownerID": "PlayerA"
            },
            "card_019218bf-257b-722c-b331-df204e5c6489": {
                "id": "card_019218bf-257b-722c-b331-df204e5c6489",
                "protoID": "179024_04B_U_BK067C_black",
                "ownerID": "PlayerA"
            },
            "card_019218bf-257b-722c-b331-e5fad9f78c42": {
                "id": "card_019218bf-257b-722c-b331-e5fad9f78c42",
                "protoID": "179024_04B_U_BK067C_black",
                "ownerID": "PlayerA"
            },
            "card_019218bf-257b-722c-b331-e9f14c53f2b8": {
                "id": "card_019218bf-257b-722c-b331-e9f14c53f2b8",
                "protoID": "179024_B2B_C_BK054C_black",
                "ownerID": "PlayerA"
            },
            "card_019218bf-257b-722c-b331-f074952cc34c": {
                "id": "card_019218bf-257b-722c-b331-f074952cc34c",
                "protoID": "179024_B2B_C_BK054C_black",
                "ownerID": "PlayerA"
            },
            "card_019218bf-257b-722c-b331-fd440e0f144a": {
                "id": "card_019218bf-257b-722c-b331-fd440e0f144a",
                "protoID": "179024_B2B_U_BK128S_black_02",
                "ownerID": "PlayerA"
            },
            "card_019218bf-257b-722c-b332-074de9dc146d": {
                "id": "card_019218bf-257b-722c-b332-074de9dc146d",
                "protoID": "179024_B2B_U_BK128S_black_02",
                "ownerID": "PlayerA"
            },
            "card_019218bf-257b-722c-b332-0e14a1e91176": {
                "id": "card_019218bf-257b-722c-b332-0e14a1e91176",
                "protoID": "179024_B2B_U_BK129R_black",
                "ownerID": "PlayerA"
            },
            "card_019218bf-257b-722c-b332-15fc0638967f": {
                "id": "card_019218bf-257b-722c-b332-15fc0638967f",
                "protoID": "179024_B2B_U_BK129R_black",
                "ownerID": "PlayerA"
            },
            "card_019218bf-257b-722c-b332-1d815fa3e0e1": {
                "id": "card_019218bf-257b-722c-b332-1d815fa3e0e1",
                "protoID": "179027_09D_C_BK063R_black",
                "ownerID": "PlayerA"
            },
            "card_019218bf-257b-722c-b332-21fb0787e3b9": {
                "id": "card_019218bf-257b-722c-b332-21fb0787e3b9",
                "protoID": "179027_09D_C_BK063R_black",
                "ownerID": "PlayerA"
            },
            "card_019218bf-257b-722c-b332-282d62695751": {
                "id": "card_019218bf-257b-722c-b332-282d62695751",
                "protoID": "179027_09D_O_BK010N_black",
                "ownerID": "PlayerA"
            },
            "card_019218bf-257b-722c-b332-36c67d29afcc": {
                "id": "card_019218bf-257b-722c-b332-36c67d29afcc",
                "protoID": "179027_09D_O_BK010N_black",
                "ownerID": "PlayerA"
            },
            "card_019218bf-257b-722c-b332-383edb86da05": {
                "id": "card_019218bf-257b-722c-b332-383edb86da05",
                "protoID": "179027_09D_U_BK163S_black",
                "ownerID": "PlayerA"
            },
            "card_019218bf-257b-722c-b332-44ca40bf3ba0": {
                "id": "card_019218bf-257b-722c-b332-44ca40bf3ba0",
                "protoID": "179027_09D_U_BK163S_black",
                "ownerID": "PlayerA"
            },
            "card_019218bf-257b-722c-b332-4b5e808a40d7": {
                "id": "card_019218bf-257b-722c-b332-4b5e808a40d7",
                "protoID": "179027_09D_U_BK163S_black",
                "ownerID": "PlayerA"
            },
            "card_019218bf-257b-722c-b332-50d14e4d844b": {
                "id": "card_019218bf-257b-722c-b332-50d14e4d844b",
                "protoID": "179029_06C_C_BK045U_black",
                "ownerID": "PlayerA"
            },
            "card_019218bf-257b-722c-b332-5ea2d95501b4": {
                "id": "card_019218bf-257b-722c-b332-5ea2d95501b4",
                "protoID": "179029_06C_C_BK045U_black",
                "ownerID": "PlayerA"
            },
            "card_019218bf-257b-722c-b332-638e3c4c056d": {
                "id": "card_019218bf-257b-722c-b332-638e3c4c056d",
                "protoID": "179029_B3C_C_BK071N_black",
                "ownerID": "PlayerA"
            },
            "card_019218bf-257b-722c-b332-6fce8bb64576": {
                "id": "card_019218bf-257b-722c-b332-6fce8bb64576",
                "protoID": "179029_B3C_C_BK071N_black",
                "ownerID": "PlayerA"
            },
            "card_019218bf-257b-722c-b332-711ac7f038bc": {
                "id": "card_019218bf-257b-722c-b332-711ac7f038bc",
                "protoID": "179029_B3C_U_BK184N_black",
                "ownerID": "PlayerA"
            },
            "card_019218bf-257b-722c-b332-7acdd1645786": {
                "id": "card_019218bf-257b-722c-b332-7acdd1645786",
                "protoID": "179029_B3C_U_BK184N_black",
                "ownerID": "PlayerA"
            },
            "card_019218bf-257b-722c-b332-87067c39fbe5": {
                "id": "card_019218bf-257b-722c-b332-87067c39fbe5",
                "protoID": "179029_B3C_U_BK184N_black",
                "ownerID": "PlayerA"
            },
            "card_019218bf-257b-722c-b332-8b297b2bb768": {
                "id": "card_019218bf-257b-722c-b332-8b297b2bb768",
                "protoID": "179029_B3C_U_BK185N_black",
                "ownerID": "PlayerA"
            },
            "card_019218bf-257b-722c-b332-93d2bae78ef0": {
                "id": "card_019218bf-257b-722c-b332-93d2bae78ef0",
                "protoID": "179029_B3C_U_BK185N_black",
                "ownerID": "PlayerA"
            },
            "card_019218bf-257b-722c-b332-99f879db3ad3": {
                "id": "card_019218bf-257b-722c-b332-99f879db3ad3",
                "protoID": "179030_11E_U_BK194S_2_black",
                "ownerID": "PlayerA"
            },
            "card_019218bf-257b-722c-b332-a10c5bce702b": {
                "id": "card_019218bf-257b-722c-b332-a10c5bce702b",
                "protoID": "179030_11E_U_BK194S_2_black",
                "ownerID": "PlayerA"
            },
            "card_019218bf-257b-722c-b332-aa41eba12a30": {
                "id": "card_019218bf-257b-722c-b332-aa41eba12a30",
                "protoID": "179030_11E_U_BK194S_2_black",
                "ownerID": "PlayerA"
            },
            "card_019218bf-257b-722c-b332-b7a1c554cc1d": {
                "id": "card_019218bf-257b-722c-b332-b7a1c554cc1d",
                "protoID": "179901_B2B_C_BK005P_black",
                "ownerID": "PlayerA"
            },
            "card_019218bf-257b-722c-b332-b88fdefd171a": {
                "id": "card_019218bf-257b-722c-b332-b88fdefd171a",
                "protoID": "179015_04B_O_BK010C_black",
                "ownerID": "PlayerB"
            },
            "card_019218bf-257b-722c-b332-c7ea64f1db07": {
                "id": "card_019218bf-257b-722c-b332-c7ea64f1db07",
                "protoID": "179015_04B_O_BK010C_black",
                "ownerID": "PlayerB"
            },
            "card_019218bf-257b-722c-b332-c917d87eb9e2": {
                "id": "card_019218bf-257b-722c-b332-c917d87eb9e2",
                "protoID": "179015_04B_U_BK058R_black",
                "ownerID": "PlayerB"
            },
            "card_019218bf-257b-722c-b332-d4d2f043ce19": {
                "id": "card_019218bf-257b-722c-b332-d4d2f043ce19",
                "protoID": "179015_04B_U_BK058R_black",
                "ownerID": "PlayerB"
            },
            "card_019218bf-257b-722c-b332-d82b9d21aa39": {
                "id": "card_019218bf-257b-722c-b332-d82b9d21aa39",
                "protoID": "179015_04B_U_BK059C_black",
                "ownerID": "PlayerB"
            },
            "card_019218bf-257b-722c-b332-e0a8a5265596": {
                "id": "card_019218bf-257b-722c-b332-e0a8a5265596",
                "protoID": "179015_04B_U_BK059C_black",
                "ownerID": "PlayerB"
            },
            "card_019218bf-257b-722c-b332-e8d063230fb1": {
                "id": "card_019218bf-257b-722c-b332-e8d063230fb1",
                "protoID": "179015_04B_U_BK061C_black",
                "ownerID": "PlayerB"
            },
            "card_019218bf-257b-722c-b332-f4a4436d7c38": {
                "id": "card_019218bf-257b-722c-b332-f4a4436d7c38",
                "protoID": "179015_04B_U_BK061C_black",
                "ownerID": "PlayerB"
            },
            "card_019218bf-257b-722c-b332-f85a5a9fdcd7": {
                "id": "card_019218bf-257b-722c-b332-f85a5a9fdcd7",
                "protoID": "179016_04B_U_BK066C_black",
                "ownerID": "PlayerB"
            },
            "card_019218bf-257b-722c-b333-0778858dcc98": {
                "id": "card_019218bf-257b-722c-b333-0778858dcc98",
                "protoID": "179016_04B_U_BK066C_black",
                "ownerID": "PlayerB"
            },
            "card_019218bf-257b-722c-b333-0ab9ab6e6d91": {
                "id": "card_019218bf-257b-722c-b333-0ab9ab6e6d91",
                "protoID": "179019_02A_C_BK015S_black",
                "ownerID": "PlayerB"
            },
            "card_019218bf-257b-722c-b333-1353f272277c": {
                "id": "card_019218bf-257b-722c-b333-1353f272277c",
                "protoID": "179019_02A_C_BK015S_black",
                "ownerID": "PlayerB"
            },
            "card_019218bf-257b-722c-b333-1ae8665ecab1": {
                "id": "card_019218bf-257b-722c-b333-1ae8665ecab1",
                "protoID": "179020_05C_U_BK100U_black",
                "ownerID": "PlayerB"
            },
            "card_019218bf-257b-722c-b333-2286b9fcc9dc": {
                "id": "card_019218bf-257b-722c-b333-2286b9fcc9dc",
                "protoID": "179020_05C_U_BK100U_black",
                "ownerID": "PlayerB"
            },
            "card_019218bf-257b-722c-b333-28d1738393d0": {
                "id": "card_019218bf-257b-722c-b333-28d1738393d0",
                "protoID": "179023_06C_C_BK048R_black",
                "ownerID": "PlayerB"
            },
            "card_019218bf-257b-722c-b333-30eeeaabab70": {
                "id": "card_019218bf-257b-722c-b333-30eeeaabab70",
                "protoID": "179023_06C_C_BK048R_black",
                "ownerID": "PlayerB"
            },
            "card_019218bf-257b-722c-b333-3c8be4839498": {
                "id": "card_019218bf-257b-722c-b333-3c8be4839498",
                "protoID": "179023_06C_C_BK049U_black",
                "ownerID": "PlayerB"
            },
            "card_019218bf-257b-722c-b333-432678ecc4b3": {
                "id": "card_019218bf-257b-722c-b333-432678ecc4b3",
                "protoID": "179023_06C_C_BK049U_black",
                "ownerID": "PlayerB"
            },
            "card_019218bf-257b-722c-b333-4f385b739b52": {
                "id": "card_019218bf-257b-722c-b333-4f385b739b52",
                "protoID": "179024_04B_C_BK027U_black",
                "ownerID": "PlayerB"
            },
            "card_019218bf-257b-722c-b333-52596ad3174c": {
                "id": "card_019218bf-257b-722c-b333-52596ad3174c",
                "protoID": "179024_04B_C_BK027U_black",
                "ownerID": "PlayerB"
            },
            "card_019218bf-257b-722c-b333-5c7cfe240a41": {
                "id": "card_019218bf-257b-722c-b333-5c7cfe240a41",
                "protoID": "179024_04B_U_BK060C_black",
                "ownerID": "PlayerB"
            },
            "card_019218bf-257b-722c-b333-64ceb78d0685": {
                "id": "card_019218bf-257b-722c-b333-64ceb78d0685",
                "protoID": "179024_04B_U_BK060C_black",
                "ownerID": "PlayerB"
            },
            "card_019218bf-257b-722c-b333-6c1aa00a5275": {
                "id": "card_019218bf-257b-722c-b333-6c1aa00a5275",
                "protoID": "179024_04B_U_BK067C_black",
                "ownerID": "PlayerB"
            },
            "card_019218bf-257b-722c-b333-7558cd6e6c54": {
                "id": "card_019218bf-257b-722c-b333-7558cd6e6c54",
                "protoID": "179024_04B_U_BK067C_black",
                "ownerID": "PlayerB"
            },
            "card_019218bf-257b-722c-b333-7882bdccc71a": {
                "id": "card_019218bf-257b-722c-b333-7882bdccc71a",
                "protoID": "179024_B2B_C_BK054C_black",
                "ownerID": "PlayerB"
            },
            "card_019218bf-257b-722c-b333-83e1b3e8fb82": {
                "id": "card_019218bf-257b-722c-b333-83e1b3e8fb82",
                "protoID": "179024_B2B_C_BK054C_black",
                "ownerID": "PlayerB"
            },
            "card_019218bf-257b-722c-b333-883dd59b067f": {
                "id": "card_019218bf-257b-722c-b333-883dd59b067f",
                "protoID": "179024_B2B_U_BK128S_black_02",
                "ownerID": "PlayerB"
            },
            "card_019218bf-257b-722c-b333-95803ab59a74": {
                "id": "card_019218bf-257b-722c-b333-95803ab59a74",
                "protoID": "179024_B2B_U_BK128S_black_02",
                "ownerID": "PlayerB"
            },
            "card_019218bf-257b-722c-b333-9e815b27daa7": {
                "id": "card_019218bf-257b-722c-b333-9e815b27daa7",
                "protoID": "179024_B2B_U_BK129R_black",
                "ownerID": "PlayerB"
            },
            "card_019218bf-257b-722c-b333-a15d0bd74a88": {
                "id": "card_019218bf-257b-722c-b333-a15d0bd74a88",
                "protoID": "179024_B2B_U_BK129R_black",
                "ownerID": "PlayerB"
            },
            "card_019218bf-257b-722c-b333-ac4c938fd1b1": {
                "id": "card_019218bf-257b-722c-b333-ac4c938fd1b1",
                "protoID": "179027_09D_C_BK063R_black",
                "ownerID": "PlayerB"
            },
            "card_019218bf-257b-722c-b333-b210ab6fe556": {
                "id": "card_019218bf-257b-722c-b333-b210ab6fe556",
                "protoID": "179027_09D_C_BK063R_black",
                "ownerID": "PlayerB"
            },
            "card_019218bf-257b-722c-b333-bcd0e8942584": {
                "id": "card_019218bf-257b-722c-b333-bcd0e8942584",
                "protoID": "179027_09D_O_BK010N_black",
                "ownerID": "PlayerB"
            },
            "card_019218bf-257b-722c-b333-c2f04e2a2d11": {
                "id": "card_019218bf-257b-722c-b333-c2f04e2a2d11",
                "protoID": "179027_09D_O_BK010N_black",
                "ownerID": "PlayerB"
            },
            "card_019218bf-257b-722c-b333-cc54781ec1d8": {
                "id": "card_019218bf-257b-722c-b333-cc54781ec1d8",
                "protoID": "179027_09D_U_BK163S_black",
                "ownerID": "PlayerB"
            },
            "card_019218bf-257b-722c-b333-d21ee5bf2d56": {
                "id": "card_019218bf-257b-722c-b333-d21ee5bf2d56",
                "protoID": "179027_09D_U_BK163S_black",
                "ownerID": "PlayerB"
            },
            "card_019218bf-257b-722c-b333-dbae405907fe": {
                "id": "card_019218bf-257b-722c-b333-dbae405907fe",
                "protoID": "179027_09D_U_BK163S_black",
                "ownerID": "PlayerB"
            },
            "card_019218bf-257b-722c-b333-e6f568b13746": {
                "id": "card_019218bf-257b-722c-b333-e6f568b13746",
                "protoID": "179029_06C_C_BK045U_black",
                "ownerID": "PlayerB"
            },
            "card_019218bf-257b-722c-b333-eb0937384faa": {
                "id": "card_019218bf-257b-722c-b333-eb0937384faa",
                "protoID": "179029_06C_C_BK045U_black",
                "ownerID": "PlayerB"
            },
            "card_019218bf-257b-722c-b333-f14f7e6d7cdf": {
                "id": "card_019218bf-257b-722c-b333-f14f7e6d7cdf",
                "protoID": "179029_B3C_C_BK071N_black",
                "ownerID": "PlayerB"
            },
            "card_019218bf-257b-722c-b333-fa2458f62776": {
                "id": "card_019218bf-257b-722c-b333-fa2458f62776",
                "protoID": "179029_B3C_C_BK071N_black",
                "ownerID": "PlayerB"
            },
            "card_019218bf-257b-722c-b334-00f8c69ab51b": {
                "id": "card_019218bf-257b-722c-b334-00f8c69ab51b",
                "protoID": "179029_B3C_U_BK184N_black",
                "ownerID": "PlayerB"
            },
            "card_019218bf-257b-722c-b334-0ed76d1bfd81": {
                "id": "card_019218bf-257b-722c-b334-0ed76d1bfd81",
                "protoID": "179029_B3C_U_BK184N_black",
                "ownerID": "PlayerB"
            },
            "card_019218bf-257b-722c-b334-15d2f5f15336": {
                "id": "card_019218bf-257b-722c-b334-15d2f5f15336",
                "protoID": "179029_B3C_U_BK184N_black",
                "ownerID": "PlayerB"
            },
            "card_019218bf-257b-722c-b334-1a7ee2d399a1": {
                "id": "card_019218bf-257b-722c-b334-1a7ee2d399a1",
                "protoID": "179029_B3C_U_BK185N_black",
                "ownerID": "PlayerB"
            },
            "card_019218bf-257b-722c-b334-2097a350c888": {
                "id": "card_019218bf-257b-722c-b334-2097a350c888",
                "protoID": "179029_B3C_U_BK185N_black",
                "ownerID": "PlayerB"
            },
            "card_019218bf-257b-722c-b334-2908567b0a18": {
                "id": "card_019218bf-257b-722c-b334-2908567b0a18",
                "protoID": "179030_11E_U_BK194S_2_black",
                "ownerID": "PlayerB"
            },
            "card_019218bf-257b-722c-b334-357c694148af": {
                "id": "card_019218bf-257b-722c-b334-357c694148af",
                "protoID": "179030_11E_U_BK194S_2_black",
                "ownerID": "PlayerB"
            },
            "card_019218bf-257b-722c-b334-380cf73d1b44": {
                "id": "card_019218bf-257b-722c-b334-380cf73d1b44",
                "protoID": "179030_11E_U_BK194S_2_black",
                "ownerID": "PlayerB"
            },
            "card_019218bf-257b-722c-b334-47f077bb25a7": {
                "id": "card_019218bf-257b-722c-b334-47f077bb25a7",
                "protoID": "179901_B2B_C_BK005P_black",
                "ownerID": "PlayerB"
            },
            "card_019218bf-257d-722c-b334-4e3736195082": {
                "id": "card_019218bf-257d-722c-b334-4e3736195082",
                "protoID": "179015_04B_O_BK010C_black",
                "ownerID": "PlayerA",
                "isRoll": false
            },
            "card_019218bf-257d-722c-b334-560911907909": {
                "id": "card_019218bf-257d-722c-b334-560911907909",
                "protoID": "179015_04B_O_BK010C_black",
                "ownerID": "PlayerA",
                "isRoll": false
            },
            "card_019218bf-257d-722c-b334-5f8d69d4a6d4": {
                "id": "card_019218bf-257d-722c-b334-5f8d69d4a6d4",
                "protoID": "179015_04B_U_BK058R_black",
                "ownerID": "PlayerA",
                "isRoll": false
            },
            "card_019218bf-257d-722c-b334-607acf499510": {
                "id": "card_019218bf-257d-722c-b334-607acf499510",
                "protoID": "179015_04B_U_BK058R_black",
                "ownerID": "PlayerA",
                "isRoll": false
            },
            "card_019218bf-257d-722c-b334-6c8763e493e2": {
                "id": "card_019218bf-257d-722c-b334-6c8763e493e2",
                "protoID": "179015_04B_U_BK059C_black",
                "ownerID": "PlayerA",
                "isRoll": false
            },
            "card_019218bf-257d-722c-b334-763b8233b319": {
                "id": "card_019218bf-257d-722c-b334-763b8233b319",
                "protoID": "179015_04B_U_BK059C_black",
                "ownerID": "PlayerA",
                "isRoll": false
            }
        },
        "effects": {},
        "table": {
            "cardStack": {
                "[\"PlayerA\",\"本国\"]": [
                    "card_019218bf-257b-722c-b332-711ac7f038bc",
                    "card_019218bf-257b-722c-b331-fd440e0f144a",
                    "card_019218bf-257b-722c-b332-638e3c4c056d",
                    "card_019218bf-257b-722c-b331-48e00f0a1ffd",
                    "card_019218bf-257b-722c-b331-d038d1955735",
                    "card_019218bf-257b-722c-b331-2a7f417c2811",
                    "card_019218bf-257b-722c-b331-c4c8fbbbc3e3",
                    "card_019218bf-257b-722c-b332-6fce8bb64576",
                    "card_019218bf-257b-722c-b331-65a0de404053",
                    "card_019218bf-257b-722c-b331-df204e5c6489",
                    "card_019218bf-257b-722c-b331-33d95e4b6f6a",
                    "card_019218bf-257b-722c-b331-5ee9a60d0d74",
                    "card_019218bf-257b-722c-b332-44ca40bf3ba0",
                    "card_019218bf-257b-722c-b331-3fbd6e8363fe",
                    "card_019218bf-257b-722c-b331-9ac72451e5f2",
                    "card_019218bf-257b-722c-b332-074de9dc146d",
                    "card_019218bf-257b-722c-b331-68f17727d364",
                    "card_019218bf-257b-722c-b332-b7a1c554cc1d",
                    "card_019218bf-257b-722c-b331-aa3708e31bc6",
                    "card_019218bf-257b-722c-b332-aa41eba12a30",
                    "card_019218bf-257b-722c-b331-ca0a7547c3c2",
                    "card_019218bf-257b-722c-b332-7acdd1645786",
                    "card_019218bf-257b-722c-b331-f074952cc34c",
                    "card_019218bf-257b-722c-b332-21fb0787e3b9",
                    "card_019218bf-257b-722c-b332-383edb86da05",
                    "card_019218bf-257b-722c-b332-87067c39fbe5",
                    "card_019218bf-257b-722c-b331-53130727f10f",
                    "card_019218bf-257b-722c-b332-1d815fa3e0e1",
                    "card_019218bf-257b-722c-b332-99f879db3ad3",
                    "card_019218bf-257b-722c-b331-4035fbd4ae4c",
                    "card_019218bf-257b-722c-b331-815b8eebd43e",
                    "card_019218bf-257b-722c-b332-36c67d29afcc",
                    "card_019218bf-257b-722c-b331-b19de4df264a",
                    "card_019218bf-257b-722c-b332-282d62695751",
                    "card_019218bf-257b-722c-b331-97af356da49a",
                    "card_019218bf-257b-722c-b332-50d14e4d844b",
                    "card_019218bf-257b-722c-b331-a1791dd972fe",
                    "card_019218bf-257b-722c-b332-93d2bae78ef0",
                    "card_019218bf-257b-722c-b331-e9f14c53f2b8",
                    "card_019218bf-257b-722c-b331-7212b3463e8c",
                    "card_019218bf-257b-722c-b332-15fc0638967f",
                    "card_019218bf-257b-722c-b332-5ea2d95501b4",
                    "card_019218bf-257b-722c-b332-4b5e808a40d7"
                ],
                "[\"PlayerB\",\"本国\"]": [
                    "card_019218bf-257b-722c-b333-a15d0bd74a88",
                    "card_019218bf-257b-722c-b333-83e1b3e8fb82",
                    "card_019218bf-257b-722c-b333-1353f272277c",
                    "card_019218bf-257b-722c-b333-fa2458f62776",
                    "card_019218bf-257b-722c-b333-d21ee5bf2d56",
                    "card_019218bf-257b-722c-b334-00f8c69ab51b",
                    "card_019218bf-257b-722c-b333-ac4c938fd1b1",
                    "card_019218bf-257b-722c-b332-e8d063230fb1",
                    "card_019218bf-257b-722c-b332-e0a8a5265596",
                    "card_019218bf-257b-722c-b334-380cf73d1b44",
                    "card_019218bf-257b-722c-b333-7882bdccc71a",
                    "card_019218bf-257b-722c-b333-52596ad3174c",
                    "card_019218bf-257b-722c-b333-30eeeaabab70",
                    "card_019218bf-257b-722c-b333-1ae8665ecab1",
                    "card_019218bf-257b-722c-b333-7558cd6e6c54",
                    "card_019218bf-257b-722c-b333-bcd0e8942584",
                    "card_019218bf-257b-722c-b333-cc54781ec1d8",
                    "card_019218bf-257b-722c-b333-64ceb78d0685",
                    "card_019218bf-257b-722c-b333-883dd59b067f",
                    "card_019218bf-257b-722c-b334-47f077bb25a7",
                    "card_019218bf-257b-722c-b334-357c694148af",
                    "card_019218bf-257b-722c-b333-e6f568b13746",
                    "card_019218bf-257b-722c-b333-f14f7e6d7cdf",
                    "card_019218bf-257b-722c-b333-5c7cfe240a41",
                    "card_019218bf-257b-722c-b333-432678ecc4b3",
                    "card_019218bf-257b-722c-b334-2097a350c888",
                    "card_019218bf-257b-722c-b334-15d2f5f15336",
                    "card_019218bf-257b-722c-b333-2286b9fcc9dc",
                    "card_019218bf-257b-722c-b332-c917d87eb9e2",
                    "card_019218bf-257b-722c-b333-95803ab59a74",
                    "card_019218bf-257b-722c-b332-d82b9d21aa39",
                    "card_019218bf-257b-722c-b332-f4a4436d7c38",
                    "card_019218bf-257b-722c-b333-3c8be4839498",
                    "card_019218bf-257b-722c-b333-9e815b27daa7",
                    "card_019218bf-257b-722c-b333-dbae405907fe",
                    "card_019218bf-257b-722c-b334-2908567b0a18",
                    "card_019218bf-257b-722c-b333-0ab9ab6e6d91",
                    "card_019218bf-257b-722c-b333-b210ab6fe556",
                    "card_019218bf-257b-722c-b332-f85a5a9fdcd7",
                    "card_019218bf-257b-722c-b333-c2f04e2a2d11",
                    "card_019218bf-257b-722c-b333-eb0937384faa",
                    "card_019218bf-257b-722c-b334-0ed76d1bfd81",
                    "card_019218bf-257b-722c-b333-0778858dcc98",
                    "card_019218bf-257b-722c-b333-28d1738393d0"
                ],
                "[\"PlayerA\",\"Gゾーン\"]": [
                    "card_019218bf-257d-722c-b334-4e3736195082",
                    "card_019218bf-257d-722c-b334-560911907909",
                    "card_019218bf-257d-722c-b334-5f8d69d4a6d4",
                    "card_019218bf-257d-722c-b334-607acf499510",
                    "card_019218bf-257d-722c-b334-6c8763e493e2",
                    "card_019218bf-257d-722c-b334-763b8233b319"
                ],
                "[\"PlayerA\",\"手札\"]": [
                    "card_019218bf-257b-722c-b331-befcce3aeffc",
                    "card_019218bf-257b-722c-b332-0e14a1e91176",
                    "card_019218bf-257b-722c-b331-8b811f916eeb",
                    "card_019218bf-257b-722c-b331-e5fad9f78c42",
                    "card_019218bf-257b-722c-b331-7ef913bc0a12",
                    "card_019218bf-257b-722c-b332-a10c5bce702b",
                    "card_019218bf-257b-722c-b332-8b297b2bb768"
                ],
                "[\"PlayerB\",\"手札\"]": [
                    "card_019218bf-257b-722c-b332-c7ea64f1db07",
                    "card_019218bf-257b-722c-b333-6c1aa00a5275",
                    "card_019218bf-257b-722c-b334-1a7ee2d399a1",
                    "card_019218bf-257b-722c-b332-b88fdefd171a",
                    "card_019218bf-257b-722c-b333-4f385b739b52",
                    "card_019218bf-257b-722c-b332-d4d2f043ce19"
                ]
            }
        },
        "chips": {},
        "chipProtos": {},
        "itemStates": {},
        "phase": [
            "配備フェイズ",
            "フリータイミング"
        ],
        "playerStates": {},
        "activePlayerID": "PlayerA",
        "immediateEffect": [],
        "stackEffect": [],
        "isBattle": {},
        "coins": {},
        "coinId2cardId": {},
        "globalEffectPool": {},
        "setGroup": {
            "itemGroupParent": {},
            "itemGroupChildren": {}
        },
        "stackEffectMemory": [],
        "activeEffectID": null,
        "flowMemory": {
            "state": "playing",
            "hasTriggerEvent": false,
            "hasPlayerPassPhase": {},
            "hasPlayerPassCut": {},
            "hasPlayerPassPayCost": {},
            "shouldTriggerStackEffectFinishedEvent": false,
            "msgs": []
        },
        "commandEffectTips": [
            {
                "id": "getCommandEffectTips_019218c9-9428-722c-b338-ffb9bc9cc317",
                "effect": {
                    "id": "getPlayCardEffects_card_019218bf-257b-722c-b331-befcce3aeffc",
                    "reason": [
                        "PlayCard",
                        "PlayerA",
                        "card_019218bf-257b-722c-b331-befcce3aeffc"
                    ],
                    "description": "從手中即將出牌, 出牌後會產生場出的效果",
                    "text": {
                        "id": "getPlayCardEffects_text_card_019218bf-257b-722c-b331-befcce3aeffc",
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
                                "actions": [
                                    {
                                        "title": "function _(ctx3, effect3, { DefineFn: DefineFn2, GameStateFn: GameStateFn2, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn2.EffectFn.getCardID(effect3);\n                const prototype2 = GameStateFn2.getItemPrototype(ctx3, cardId2);\n                const from = GameStateFn2.getItemBaSyou(ctx3, cardId2);\n                ctx3 = GameStateFn2.moveItem(ctx3, DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u3044\\u308B\\u30AB\\u30FC\\u30C9\"), [cardId2, from]);\n                if (prototype2.category == \"\\u30E6\\u30CB\\u30C3\\u30C8\") {\n                  return GameStateFn2.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn2.EffectFn.getPlayerID(effect3), DefineFn2.EffectFn.getCardID(effect3)],\n                    description: effect3.text.description,\n                    text: {\n                      id: effect3.text.id,\n                      description: effect3.text.description,\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect4, { DefineFn: DefineFn3, GameStateFn: GameStateFn3 }) {\n                                const cardId3 = DefineFn3.EffectFn.getCardID(effect4);\n                                const from2 = GameStateFn3.getItemBaSyou(ctx4, cardId3);\n                                const to = DefineFn3.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\");\n                                ctx4 = GameStateFn3.moveItem(ctx4, to, [cardId3, from2], GameStateFn3.onMoveItem);\n                                const hasHigh = GameStateFn3.getCardHasSpeicalEffect(ctx4, [\"\\u6226\\u95D8\\u914D\\u5099\"], cardId3);\n                                const hasPS = GameStateFn3.getCardHasSpeicalEffect(ctx4, [\"PS\\u88C5\\u7532\"], cardId3);\n                                const isNoNeedRoll = hasHigh || hasPS;\n                                const isRoll = isNoNeedRoll == false;\n                                ctx4 = GameStateFn3.setItemIsRoll(ctx4, isRoll, [cardId3, to]);\n                                return ctx4;\n                              }.toString()\n                            }\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30AD\\u30E3\\u30E9\\u30AF\\u30BF\\u30FC\" || prototype2.category == \"\\u30AA\\u30DA\\u30EC\\u30FC\\u30B7\\u30E7\\u30F3(\\u30E6\\u30CB\\u30C3\\u30C8)\") {\n                  return GameStateFn2.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn2.EffectFn.getPlayerID(effect3), DefineFn2.EffectFn.getCardID(effect3)],\n                    description: effect3.text.description,\n                    text: {\n                      id: effect3.text.id,\n                      description: effect3.text.description,\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect4, { DefineFn: DefineFn3, GameStateFn: GameStateFn3 }) {\n                                const cardId3 = DefineFn3.EffectFn.getCardID(effect4);\n                                const pairs = GameStateFn3.getCardTipStrBaSyouPairs(ctx4, \"unitForSet\", cardId3);\n                                const [targetCardId, targetBasyou] = pairs[0];\n                                const from2 = GameStateFn3.getItemBaSyou(ctx4, cardId3);\n                                const to = targetBasyou;\n                                ctx4 = GameStateFn3.moveItem(ctx4, to, [cardId3, from2], GameStateFn3.onMoveItem);\n                                ctx4 = GameStateFn3.setSetGroupLink(ctx4, targetCardId, cardId3);\n                                return ctx4;\n                              }.toString()\n                            }\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30B3\\u30DE\\u30F3\\u30C9\" && prototype2.commandText) {\n                  return GameStateFn2.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn2.EffectFn.getPlayerID(effect3), DefineFn2.EffectFn.getCardID(effect3)],\n                    description: effect3.text.description,\n                    text: {\n                      id: prototype2.commandText.id,\n                      description: prototype2.commandText.description,\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect4, { DefineFn: DefineFn3, GameStateFn: GameStateFn3 }) {\n                                const cardId3 = DefineFn3.EffectFn.getCardID(effect4);\n                                const from2 = GameStateFn3.getItemBaSyou(ctx4, cardId3);\n                                const to = DefineFn3.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u30B8\\u30E3\\u30F3\\u30AF\\u30E4\\u30FC\\u30C9\");\n                                ctx4 = GameStateFn3.moveItem(ctx4, to, [cardId3, from2], GameStateFn3.onMoveItem);\n                                return ctx4;\n                              }.toString()\n                            },\n                            ...prototype2.commandText.logicTreeActions?.[0].actions || []\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30B0\\u30E9\\u30D5\\u30A3\\u30C3\\u30AF\") {\n                  const cardId3 = DefineFn2.EffectFn.getCardID(effect3);\n                  const from2 = GameStateFn2.getItemBaSyou(ctx3, cardId3);\n                  const to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"G\\u30BE\\u30FC\\u30F3\");\n                  return GameStateFn2.moveItem(ctx3, to, [cardId3, from2], GameStateFn2.onMoveItem);\n                }\n                if (prototype2.category == \"\\u30AA\\u30DA\\u30EC\\u30FC\\u30B7\\u30E7\\u30F3\") {\n                  const cardId3 = DefineFn2.EffectFn.getCardID(effect3);\n                  const from2 = GameStateFn2.getItemBaSyou(ctx3, cardId3);\n                  const to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\");\n                  return GameStateFn2.moveItem(ctx3, to, [cardId3, from2], GameStateFn2.onMoveItem);\n                }\n                if (prototype2.category == \"ACE\") {\n                  throw new Error(`not support category: ${prototype2.category}`);\n                }\n                return ctx3;\n              }"
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
                                        "card_019218bf-257d-722c-b334-4e3736195082",
                                        {
                                            "id": "AbsoluteBaSyou",
                                            "value": [
                                                "PlayerA",
                                                "Gゾーン"
                                            ]
                                        }
                                    ],
                                    [
                                        "card_019218bf-257d-722c-b334-560911907909",
                                        {
                                            "id": "AbsoluteBaSyou",
                                            "value": [
                                                "PlayerA",
                                                "Gゾーン"
                                            ]
                                        }
                                    ],
                                    [
                                        "card_019218bf-257d-722c-b334-5f8d69d4a6d4",
                                        {
                                            "id": "AbsoluteBaSyou",
                                            "value": [
                                                "PlayerA",
                                                "Gゾーン"
                                            ]
                                        }
                                    ],
                                    [
                                        "card_019218bf-257d-722c-b334-607acf499510",
                                        {
                                            "id": "AbsoluteBaSyou",
                                            "value": [
                                                "PlayerA",
                                                "Gゾーン"
                                            ]
                                        }
                                    ],
                                    [
                                        "card_019218bf-257d-722c-b334-6c8763e493e2",
                                        {
                                            "id": "AbsoluteBaSyou",
                                            "value": [
                                                "PlayerA",
                                                "Gゾーン"
                                            ]
                                        }
                                    ],
                                    [
                                        "card_019218bf-257d-722c-b334-763b8233b319",
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
                                        "card_019218bf-257d-722c-b334-4e3736195082",
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
                "id": "getCommandEffectTips_019218c9-9429-722c-b339-02199841053b",
                "effect": {
                    "id": "getPlayCardEffects_card_019218bf-257b-722c-b332-0e14a1e91176",
                    "reason": [
                        "PlayCard",
                        "PlayerA",
                        "card_019218bf-257b-722c-b332-0e14a1e91176"
                    ],
                    "description": "從手中即將出牌, 出牌後會產生場出的效果",
                    "text": {
                        "id": "getPlayCardEffects_text_card_019218bf-257b-722c-b332-0e14a1e91176",
                        "title": [],
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
                                        "title": "function _(ctx3, effect3, { DefineFn: DefineFn2, GameStateFn: GameStateFn2, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn2.EffectFn.getCardID(effect3);\n                const prototype2 = GameStateFn2.getItemPrototype(ctx3, cardId2);\n                const from = GameStateFn2.getItemBaSyou(ctx3, cardId2);\n                ctx3 = GameStateFn2.moveItem(ctx3, DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u3044\\u308B\\u30AB\\u30FC\\u30C9\"), [cardId2, from]);\n                if (prototype2.category == \"\\u30E6\\u30CB\\u30C3\\u30C8\") {\n                  return GameStateFn2.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn2.EffectFn.getPlayerID(effect3), DefineFn2.EffectFn.getCardID(effect3)],\n                    description: effect3.text.description,\n                    text: {\n                      id: effect3.text.id,\n                      description: effect3.text.description,\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect4, { DefineFn: DefineFn3, GameStateFn: GameStateFn3 }) {\n                                const cardId3 = DefineFn3.EffectFn.getCardID(effect4);\n                                const from2 = GameStateFn3.getItemBaSyou(ctx4, cardId3);\n                                const to = DefineFn3.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\");\n                                ctx4 = GameStateFn3.moveItem(ctx4, to, [cardId3, from2], GameStateFn3.onMoveItem);\n                                const hasHigh = GameStateFn3.getCardHasSpeicalEffect(ctx4, [\"\\u6226\\u95D8\\u914D\\u5099\"], cardId3);\n                                const hasPS = GameStateFn3.getCardHasSpeicalEffect(ctx4, [\"PS\\u88C5\\u7532\"], cardId3);\n                                const isNoNeedRoll = hasHigh || hasPS;\n                                const isRoll = isNoNeedRoll == false;\n                                ctx4 = GameStateFn3.setItemIsRoll(ctx4, isRoll, [cardId3, to]);\n                                return ctx4;\n                              }.toString()\n                            }\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30AD\\u30E3\\u30E9\\u30AF\\u30BF\\u30FC\" || prototype2.category == \"\\u30AA\\u30DA\\u30EC\\u30FC\\u30B7\\u30E7\\u30F3(\\u30E6\\u30CB\\u30C3\\u30C8)\") {\n                  return GameStateFn2.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn2.EffectFn.getPlayerID(effect3), DefineFn2.EffectFn.getCardID(effect3)],\n                    description: effect3.text.description,\n                    text: {\n                      id: effect3.text.id,\n                      description: effect3.text.description,\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect4, { DefineFn: DefineFn3, GameStateFn: GameStateFn3 }) {\n                                const cardId3 = DefineFn3.EffectFn.getCardID(effect4);\n                                const pairs = GameStateFn3.getCardTipStrBaSyouPairs(ctx4, \"unitForSet\", cardId3);\n                                const [targetCardId, targetBasyou] = pairs[0];\n                                const from2 = GameStateFn3.getItemBaSyou(ctx4, cardId3);\n                                const to = targetBasyou;\n                                ctx4 = GameStateFn3.moveItem(ctx4, to, [cardId3, from2], GameStateFn3.onMoveItem);\n                                ctx4 = GameStateFn3.setSetGroupLink(ctx4, targetCardId, cardId3);\n                                return ctx4;\n                              }.toString()\n                            }\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30B3\\u30DE\\u30F3\\u30C9\" && prototype2.commandText) {\n                  return GameStateFn2.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn2.EffectFn.getPlayerID(effect3), DefineFn2.EffectFn.getCardID(effect3)],\n                    description: effect3.text.description,\n                    text: {\n                      id: prototype2.commandText.id,\n                      description: prototype2.commandText.description,\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect4, { DefineFn: DefineFn3, GameStateFn: GameStateFn3 }) {\n                                const cardId3 = DefineFn3.EffectFn.getCardID(effect4);\n                                const from2 = GameStateFn3.getItemBaSyou(ctx4, cardId3);\n                                const to = DefineFn3.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u30B8\\u30E3\\u30F3\\u30AF\\u30E4\\u30FC\\u30C9\");\n                                ctx4 = GameStateFn3.moveItem(ctx4, to, [cardId3, from2], GameStateFn3.onMoveItem);\n                                return ctx4;\n                              }.toString()\n                            },\n                            ...prototype2.commandText.logicTreeActions?.[0].actions || []\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30B0\\u30E9\\u30D5\\u30A3\\u30C3\\u30AF\") {\n                  const cardId3 = DefineFn2.EffectFn.getCardID(effect3);\n                  const from2 = GameStateFn2.getItemBaSyou(ctx3, cardId3);\n                  const to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"G\\u30BE\\u30FC\\u30F3\");\n                  return GameStateFn2.moveItem(ctx3, to, [cardId3, from2], GameStateFn2.onMoveItem);\n                }\n                if (prototype2.category == \"\\u30AA\\u30DA\\u30EC\\u30FC\\u30B7\\u30E7\\u30F3\") {\n                  const cardId3 = DefineFn2.EffectFn.getCardID(effect3);\n                  const from2 = GameStateFn2.getItemBaSyou(ctx3, cardId3);\n                  const to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\");\n                  return GameStateFn2.moveItem(ctx3, to, [cardId3, from2], GameStateFn2.onMoveItem);\n                }\n                if (prototype2.category == \"ACE\") {\n                  throw new Error(`not support category: ${prototype2.category}`);\n                }\n                return ctx3;\n              }"
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
                                        "card_019218bf-257d-722c-b334-4e3736195082",
                                        {
                                            "id": "AbsoluteBaSyou",
                                            "value": [
                                                "PlayerA",
                                                "Gゾーン"
                                            ]
                                        }
                                    ],
                                    [
                                        "card_019218bf-257d-722c-b334-560911907909",
                                        {
                                            "id": "AbsoluteBaSyou",
                                            "value": [
                                                "PlayerA",
                                                "Gゾーン"
                                            ]
                                        }
                                    ],
                                    [
                                        "card_019218bf-257d-722c-b334-5f8d69d4a6d4",
                                        {
                                            "id": "AbsoluteBaSyou",
                                            "value": [
                                                "PlayerA",
                                                "Gゾーン"
                                            ]
                                        }
                                    ],
                                    [
                                        "card_019218bf-257d-722c-b334-607acf499510",
                                        {
                                            "id": "AbsoluteBaSyou",
                                            "value": [
                                                "PlayerA",
                                                "Gゾーン"
                                            ]
                                        }
                                    ],
                                    [
                                        "card_019218bf-257d-722c-b334-6c8763e493e2",
                                        {
                                            "id": "AbsoluteBaSyou",
                                            "value": [
                                                "PlayerA",
                                                "Gゾーン"
                                            ]
                                        }
                                    ],
                                    [
                                        "card_019218bf-257d-722c-b334-763b8233b319",
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
                                        "card_019218bf-257d-722c-b334-4e3736195082",
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
                                        "card_019218bf-257d-722c-b334-560911907909",
                                        {
                                            "id": "AbsoluteBaSyou",
                                            "value": [
                                                "PlayerA",
                                                "Gゾーン"
                                            ]
                                        }
                                    ],
                                    [
                                        "card_019218bf-257d-722c-b334-5f8d69d4a6d4",
                                        {
                                            "id": "AbsoluteBaSyou",
                                            "value": [
                                                "PlayerA",
                                                "Gゾーン"
                                            ]
                                        }
                                    ],
                                    [
                                        "card_019218bf-257d-722c-b334-607acf499510",
                                        {
                                            "id": "AbsoluteBaSyou",
                                            "value": [
                                                "PlayerA",
                                                "Gゾーン"
                                            ]
                                        }
                                    ],
                                    [
                                        "card_019218bf-257d-722c-b334-6c8763e493e2",
                                        {
                                            "id": "AbsoluteBaSyou",
                                            "value": [
                                                "PlayerA",
                                                "Gゾーン"
                                            ]
                                        }
                                    ],
                                    [
                                        "card_019218bf-257d-722c-b334-763b8233b319",
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
                                        "card_019218bf-257d-722c-b334-560911907909",
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
                "id": "getCommandEffectTips_019218c9-942a-722c-b339-0bb540ba9623",
                "effect": {
                    "id": "getPlayCardEffects_card_019218bf-257b-722c-b331-8b811f916eeb",
                    "reason": [
                        "PlayCard",
                        "PlayerA",
                        "card_019218bf-257b-722c-b331-8b811f916eeb"
                    ],
                    "description": "從手中即將出牌, 出牌後會產生場出的效果",
                    "text": {
                        "id": "getPlayCardEffects_text_card_019218bf-257b-722c-b331-8b811f916eeb",
                        "title": [],
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
                                        "title": "function _(ctx3, effect3, { DefineFn: DefineFn2, GameStateFn: GameStateFn2, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn2.EffectFn.getCardID(effect3);\n                const prototype2 = GameStateFn2.getItemPrototype(ctx3, cardId2);\n                const from = GameStateFn2.getItemBaSyou(ctx3, cardId2);\n                ctx3 = GameStateFn2.moveItem(ctx3, DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u3044\\u308B\\u30AB\\u30FC\\u30C9\"), [cardId2, from]);\n                if (prototype2.category == \"\\u30E6\\u30CB\\u30C3\\u30C8\") {\n                  return GameStateFn2.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn2.EffectFn.getPlayerID(effect3), DefineFn2.EffectFn.getCardID(effect3)],\n                    description: effect3.text.description,\n                    text: {\n                      id: effect3.text.id,\n                      description: effect3.text.description,\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect4, { DefineFn: DefineFn3, GameStateFn: GameStateFn3 }) {\n                                const cardId3 = DefineFn3.EffectFn.getCardID(effect4);\n                                const from2 = GameStateFn3.getItemBaSyou(ctx4, cardId3);\n                                const to = DefineFn3.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\");\n                                ctx4 = GameStateFn3.moveItem(ctx4, to, [cardId3, from2], GameStateFn3.onMoveItem);\n                                const hasHigh = GameStateFn3.getCardHasSpeicalEffect(ctx4, [\"\\u6226\\u95D8\\u914D\\u5099\"], cardId3);\n                                const hasPS = GameStateFn3.getCardHasSpeicalEffect(ctx4, [\"PS\\u88C5\\u7532\"], cardId3);\n                                const isNoNeedRoll = hasHigh || hasPS;\n                                const isRoll = isNoNeedRoll == false;\n                                ctx4 = GameStateFn3.setItemIsRoll(ctx4, isRoll, [cardId3, to]);\n                                return ctx4;\n                              }.toString()\n                            }\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30AD\\u30E3\\u30E9\\u30AF\\u30BF\\u30FC\" || prototype2.category == \"\\u30AA\\u30DA\\u30EC\\u30FC\\u30B7\\u30E7\\u30F3(\\u30E6\\u30CB\\u30C3\\u30C8)\") {\n                  return GameStateFn2.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn2.EffectFn.getPlayerID(effect3), DefineFn2.EffectFn.getCardID(effect3)],\n                    description: effect3.text.description,\n                    text: {\n                      id: effect3.text.id,\n                      description: effect3.text.description,\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect4, { DefineFn: DefineFn3, GameStateFn: GameStateFn3 }) {\n                                const cardId3 = DefineFn3.EffectFn.getCardID(effect4);\n                                const pairs = GameStateFn3.getCardTipStrBaSyouPairs(ctx4, \"unitForSet\", cardId3);\n                                const [targetCardId, targetBasyou] = pairs[0];\n                                const from2 = GameStateFn3.getItemBaSyou(ctx4, cardId3);\n                                const to = targetBasyou;\n                                ctx4 = GameStateFn3.moveItem(ctx4, to, [cardId3, from2], GameStateFn3.onMoveItem);\n                                ctx4 = GameStateFn3.setSetGroupLink(ctx4, targetCardId, cardId3);\n                                return ctx4;\n                              }.toString()\n                            }\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30B3\\u30DE\\u30F3\\u30C9\" && prototype2.commandText) {\n                  return GameStateFn2.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn2.EffectFn.getPlayerID(effect3), DefineFn2.EffectFn.getCardID(effect3)],\n                    description: effect3.text.description,\n                    text: {\n                      id: prototype2.commandText.id,\n                      description: prototype2.commandText.description,\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect4, { DefineFn: DefineFn3, GameStateFn: GameStateFn3 }) {\n                                const cardId3 = DefineFn3.EffectFn.getCardID(effect4);\n                                const from2 = GameStateFn3.getItemBaSyou(ctx4, cardId3);\n                                const to = DefineFn3.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u30B8\\u30E3\\u30F3\\u30AF\\u30E4\\u30FC\\u30C9\");\n                                ctx4 = GameStateFn3.moveItem(ctx4, to, [cardId3, from2], GameStateFn3.onMoveItem);\n                                return ctx4;\n                              }.toString()\n                            },\n                            ...prototype2.commandText.logicTreeActions?.[0].actions || []\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30B0\\u30E9\\u30D5\\u30A3\\u30C3\\u30AF\") {\n                  const cardId3 = DefineFn2.EffectFn.getCardID(effect3);\n                  const from2 = GameStateFn2.getItemBaSyou(ctx3, cardId3);\n                  const to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"G\\u30BE\\u30FC\\u30F3\");\n                  return GameStateFn2.moveItem(ctx3, to, [cardId3, from2], GameStateFn2.onMoveItem);\n                }\n                if (prototype2.category == \"\\u30AA\\u30DA\\u30EC\\u30FC\\u30B7\\u30E7\\u30F3\") {\n                  const cardId3 = DefineFn2.EffectFn.getCardID(effect3);\n                  const from2 = GameStateFn2.getItemBaSyou(ctx3, cardId3);\n                  const to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\");\n                  return GameStateFn2.moveItem(ctx3, to, [cardId3, from2], GameStateFn2.onMoveItem);\n                }\n                if (prototype2.category == \"ACE\") {\n                  throw new Error(`not support category: ${prototype2.category}`);\n                }\n                return ctx3;\n              }"
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
                                        "card_019218bf-257d-722c-b334-4e3736195082",
                                        {
                                            "id": "AbsoluteBaSyou",
                                            "value": [
                                                "PlayerA",
                                                "Gゾーン"
                                            ]
                                        }
                                    ],
                                    [
                                        "card_019218bf-257d-722c-b334-560911907909",
                                        {
                                            "id": "AbsoluteBaSyou",
                                            "value": [
                                                "PlayerA",
                                                "Gゾーン"
                                            ]
                                        }
                                    ],
                                    [
                                        "card_019218bf-257d-722c-b334-5f8d69d4a6d4",
                                        {
                                            "id": "AbsoluteBaSyou",
                                            "value": [
                                                "PlayerA",
                                                "Gゾーン"
                                            ]
                                        }
                                    ],
                                    [
                                        "card_019218bf-257d-722c-b334-607acf499510",
                                        {
                                            "id": "AbsoluteBaSyou",
                                            "value": [
                                                "PlayerA",
                                                "Gゾーン"
                                            ]
                                        }
                                    ],
                                    [
                                        "card_019218bf-257d-722c-b334-6c8763e493e2",
                                        {
                                            "id": "AbsoluteBaSyou",
                                            "value": [
                                                "PlayerA",
                                                "Gゾーン"
                                            ]
                                        }
                                    ],
                                    [
                                        "card_019218bf-257d-722c-b334-763b8233b319",
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
                                        "card_019218bf-257d-722c-b334-4e3736195082",
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
                                        "card_019218bf-257d-722c-b334-560911907909",
                                        {
                                            "id": "AbsoluteBaSyou",
                                            "value": [
                                                "PlayerA",
                                                "Gゾーン"
                                            ]
                                        }
                                    ],
                                    [
                                        "card_019218bf-257d-722c-b334-5f8d69d4a6d4",
                                        {
                                            "id": "AbsoluteBaSyou",
                                            "value": [
                                                "PlayerA",
                                                "Gゾーン"
                                            ]
                                        }
                                    ],
                                    [
                                        "card_019218bf-257d-722c-b334-607acf499510",
                                        {
                                            "id": "AbsoluteBaSyou",
                                            "value": [
                                                "PlayerA",
                                                "Gゾーン"
                                            ]
                                        }
                                    ],
                                    [
                                        "card_019218bf-257d-722c-b334-6c8763e493e2",
                                        {
                                            "id": "AbsoluteBaSyou",
                                            "value": [
                                                "PlayerA",
                                                "Gゾーン"
                                            ]
                                        }
                                    ],
                                    [
                                        "card_019218bf-257d-722c-b334-763b8233b319",
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
                                        "card_019218bf-257d-722c-b334-560911907909",
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
                "id": "getCommandEffectTips_019218c9-942b-722c-b339-12da4dbd8d0c",
                "effect": {
                    "id": "getPlayCardEffects_card_019218bf-257b-722c-b331-e5fad9f78c42",
                    "reason": [
                        "PlayCard",
                        "PlayerA",
                        "card_019218bf-257b-722c-b331-e5fad9f78c42"
                    ],
                    "description": "從手中即將出牌, 出牌後會產生場出的效果",
                    "text": {
                        "id": "getPlayCardEffects_text_card_019218bf-257b-722c-b331-e5fad9f78c42",
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
                                "actions": [
                                    {
                                        "title": "function _(ctx3, effect3, { DefineFn: DefineFn2, GameStateFn: GameStateFn2, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn2.EffectFn.getCardID(effect3);\n                const prototype2 = GameStateFn2.getItemPrototype(ctx3, cardId2);\n                const from = GameStateFn2.getItemBaSyou(ctx3, cardId2);\n                ctx3 = GameStateFn2.moveItem(ctx3, DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u3044\\u308B\\u30AB\\u30FC\\u30C9\"), [cardId2, from]);\n                if (prototype2.category == \"\\u30E6\\u30CB\\u30C3\\u30C8\") {\n                  return GameStateFn2.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn2.EffectFn.getPlayerID(effect3), DefineFn2.EffectFn.getCardID(effect3)],\n                    description: effect3.text.description,\n                    text: {\n                      id: effect3.text.id,\n                      description: effect3.text.description,\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect4, { DefineFn: DefineFn3, GameStateFn: GameStateFn3 }) {\n                                const cardId3 = DefineFn3.EffectFn.getCardID(effect4);\n                                const from2 = GameStateFn3.getItemBaSyou(ctx4, cardId3);\n                                const to = DefineFn3.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\");\n                                ctx4 = GameStateFn3.moveItem(ctx4, to, [cardId3, from2], GameStateFn3.onMoveItem);\n                                const hasHigh = GameStateFn3.getCardHasSpeicalEffect(ctx4, [\"\\u6226\\u95D8\\u914D\\u5099\"], cardId3);\n                                const hasPS = GameStateFn3.getCardHasSpeicalEffect(ctx4, [\"PS\\u88C5\\u7532\"], cardId3);\n                                const isNoNeedRoll = hasHigh || hasPS;\n                                const isRoll = isNoNeedRoll == false;\n                                ctx4 = GameStateFn3.setItemIsRoll(ctx4, isRoll, [cardId3, to]);\n                                return ctx4;\n                              }.toString()\n                            }\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30AD\\u30E3\\u30E9\\u30AF\\u30BF\\u30FC\" || prototype2.category == \"\\u30AA\\u30DA\\u30EC\\u30FC\\u30B7\\u30E7\\u30F3(\\u30E6\\u30CB\\u30C3\\u30C8)\") {\n                  return GameStateFn2.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn2.EffectFn.getPlayerID(effect3), DefineFn2.EffectFn.getCardID(effect3)],\n                    description: effect3.text.description,\n                    text: {\n                      id: effect3.text.id,\n                      description: effect3.text.description,\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect4, { DefineFn: DefineFn3, GameStateFn: GameStateFn3 }) {\n                                const cardId3 = DefineFn3.EffectFn.getCardID(effect4);\n                                const pairs = GameStateFn3.getCardTipStrBaSyouPairs(ctx4, \"unitForSet\", cardId3);\n                                const [targetCardId, targetBasyou] = pairs[0];\n                                const from2 = GameStateFn3.getItemBaSyou(ctx4, cardId3);\n                                const to = targetBasyou;\n                                ctx4 = GameStateFn3.moveItem(ctx4, to, [cardId3, from2], GameStateFn3.onMoveItem);\n                                ctx4 = GameStateFn3.setSetGroupLink(ctx4, targetCardId, cardId3);\n                                return ctx4;\n                              }.toString()\n                            }\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30B3\\u30DE\\u30F3\\u30C9\" && prototype2.commandText) {\n                  return GameStateFn2.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn2.EffectFn.getPlayerID(effect3), DefineFn2.EffectFn.getCardID(effect3)],\n                    description: effect3.text.description,\n                    text: {\n                      id: prototype2.commandText.id,\n                      description: prototype2.commandText.description,\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect4, { DefineFn: DefineFn3, GameStateFn: GameStateFn3 }) {\n                                const cardId3 = DefineFn3.EffectFn.getCardID(effect4);\n                                const from2 = GameStateFn3.getItemBaSyou(ctx4, cardId3);\n                                const to = DefineFn3.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u30B8\\u30E3\\u30F3\\u30AF\\u30E4\\u30FC\\u30C9\");\n                                ctx4 = GameStateFn3.moveItem(ctx4, to, [cardId3, from2], GameStateFn3.onMoveItem);\n                                return ctx4;\n                              }.toString()\n                            },\n                            ...prototype2.commandText.logicTreeActions?.[0].actions || []\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30B0\\u30E9\\u30D5\\u30A3\\u30C3\\u30AF\") {\n                  const cardId3 = DefineFn2.EffectFn.getCardID(effect3);\n                  const from2 = GameStateFn2.getItemBaSyou(ctx3, cardId3);\n                  const to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"G\\u30BE\\u30FC\\u30F3\");\n                  return GameStateFn2.moveItem(ctx3, to, [cardId3, from2], GameStateFn2.onMoveItem);\n                }\n                if (prototype2.category == \"\\u30AA\\u30DA\\u30EC\\u30FC\\u30B7\\u30E7\\u30F3\") {\n                  const cardId3 = DefineFn2.EffectFn.getCardID(effect3);\n                  const from2 = GameStateFn2.getItemBaSyou(ctx3, cardId3);\n                  const to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\");\n                  return GameStateFn2.moveItem(ctx3, to, [cardId3, from2], GameStateFn2.onMoveItem);\n                }\n                if (prototype2.category == \"ACE\") {\n                  throw new Error(`not support category: ${prototype2.category}`);\n                }\n                return ctx3;\n              }"
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
                                        "card_019218bf-257d-722c-b334-4e3736195082",
                                        {
                                            "id": "AbsoluteBaSyou",
                                            "value": [
                                                "PlayerA",
                                                "Gゾーン"
                                            ]
                                        }
                                    ],
                                    [
                                        "card_019218bf-257d-722c-b334-560911907909",
                                        {
                                            "id": "AbsoluteBaSyou",
                                            "value": [
                                                "PlayerA",
                                                "Gゾーン"
                                            ]
                                        }
                                    ],
                                    [
                                        "card_019218bf-257d-722c-b334-5f8d69d4a6d4",
                                        {
                                            "id": "AbsoluteBaSyou",
                                            "value": [
                                                "PlayerA",
                                                "Gゾーン"
                                            ]
                                        }
                                    ],
                                    [
                                        "card_019218bf-257d-722c-b334-607acf499510",
                                        {
                                            "id": "AbsoluteBaSyou",
                                            "value": [
                                                "PlayerA",
                                                "Gゾーン"
                                            ]
                                        }
                                    ],
                                    [
                                        "card_019218bf-257d-722c-b334-6c8763e493e2",
                                        {
                                            "id": "AbsoluteBaSyou",
                                            "value": [
                                                "PlayerA",
                                                "Gゾーン"
                                            ]
                                        }
                                    ],
                                    [
                                        "card_019218bf-257d-722c-b334-763b8233b319",
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
                                        "card_019218bf-257d-722c-b334-4e3736195082",
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
                "id": "getCommandEffectTips_019218c9-942b-722c-b339-196991db9d2f",
                "effect": {
                    "id": "getPlayCardEffects_card_019218bf-257b-722c-b331-7ef913bc0a12",
                    "reason": [
                        "PlayCard",
                        "PlayerA",
                        "card_019218bf-257b-722c-b331-7ef913bc0a12"
                    ],
                    "description": "從手中即將出牌, 出牌後會產生場出的效果",
                    "text": {
                        "id": "getPlayCardEffects_text_card_019218bf-257b-722c-b331-7ef913bc0a12",
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
                                "actions": [
                                    {
                                        "title": "function _(ctx3, effect3, { DefineFn: DefineFn2, GameStateFn: GameStateFn2, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn2.EffectFn.getCardID(effect3);\n                const prototype2 = GameStateFn2.getItemPrototype(ctx3, cardId2);\n                const from = GameStateFn2.getItemBaSyou(ctx3, cardId2);\n                ctx3 = GameStateFn2.moveItem(ctx3, DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u3044\\u308B\\u30AB\\u30FC\\u30C9\"), [cardId2, from]);\n                if (prototype2.category == \"\\u30E6\\u30CB\\u30C3\\u30C8\") {\n                  return GameStateFn2.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn2.EffectFn.getPlayerID(effect3), DefineFn2.EffectFn.getCardID(effect3)],\n                    description: effect3.text.description,\n                    text: {\n                      id: effect3.text.id,\n                      description: effect3.text.description,\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect4, { DefineFn: DefineFn3, GameStateFn: GameStateFn3 }) {\n                                const cardId3 = DefineFn3.EffectFn.getCardID(effect4);\n                                const from2 = GameStateFn3.getItemBaSyou(ctx4, cardId3);\n                                const to = DefineFn3.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\");\n                                ctx4 = GameStateFn3.moveItem(ctx4, to, [cardId3, from2], GameStateFn3.onMoveItem);\n                                const hasHigh = GameStateFn3.getCardHasSpeicalEffect(ctx4, [\"\\u6226\\u95D8\\u914D\\u5099\"], cardId3);\n                                const hasPS = GameStateFn3.getCardHasSpeicalEffect(ctx4, [\"PS\\u88C5\\u7532\"], cardId3);\n                                const isNoNeedRoll = hasHigh || hasPS;\n                                const isRoll = isNoNeedRoll == false;\n                                ctx4 = GameStateFn3.setItemIsRoll(ctx4, isRoll, [cardId3, to]);\n                                return ctx4;\n                              }.toString()\n                            }\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30AD\\u30E3\\u30E9\\u30AF\\u30BF\\u30FC\" || prototype2.category == \"\\u30AA\\u30DA\\u30EC\\u30FC\\u30B7\\u30E7\\u30F3(\\u30E6\\u30CB\\u30C3\\u30C8)\") {\n                  return GameStateFn2.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn2.EffectFn.getPlayerID(effect3), DefineFn2.EffectFn.getCardID(effect3)],\n                    description: effect3.text.description,\n                    text: {\n                      id: effect3.text.id,\n                      description: effect3.text.description,\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect4, { DefineFn: DefineFn3, GameStateFn: GameStateFn3 }) {\n                                const cardId3 = DefineFn3.EffectFn.getCardID(effect4);\n                                const pairs = GameStateFn3.getCardTipStrBaSyouPairs(ctx4, \"unitForSet\", cardId3);\n                                const [targetCardId, targetBasyou] = pairs[0];\n                                const from2 = GameStateFn3.getItemBaSyou(ctx4, cardId3);\n                                const to = targetBasyou;\n                                ctx4 = GameStateFn3.moveItem(ctx4, to, [cardId3, from2], GameStateFn3.onMoveItem);\n                                ctx4 = GameStateFn3.setSetGroupLink(ctx4, targetCardId, cardId3);\n                                return ctx4;\n                              }.toString()\n                            }\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30B3\\u30DE\\u30F3\\u30C9\" && prototype2.commandText) {\n                  return GameStateFn2.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn2.EffectFn.getPlayerID(effect3), DefineFn2.EffectFn.getCardID(effect3)],\n                    description: effect3.text.description,\n                    text: {\n                      id: prototype2.commandText.id,\n                      description: prototype2.commandText.description,\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect4, { DefineFn: DefineFn3, GameStateFn: GameStateFn3 }) {\n                                const cardId3 = DefineFn3.EffectFn.getCardID(effect4);\n                                const from2 = GameStateFn3.getItemBaSyou(ctx4, cardId3);\n                                const to = DefineFn3.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u30B8\\u30E3\\u30F3\\u30AF\\u30E4\\u30FC\\u30C9\");\n                                ctx4 = GameStateFn3.moveItem(ctx4, to, [cardId3, from2], GameStateFn3.onMoveItem);\n                                return ctx4;\n                              }.toString()\n                            },\n                            ...prototype2.commandText.logicTreeActions?.[0].actions || []\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30B0\\u30E9\\u30D5\\u30A3\\u30C3\\u30AF\") {\n                  const cardId3 = DefineFn2.EffectFn.getCardID(effect3);\n                  const from2 = GameStateFn2.getItemBaSyou(ctx3, cardId3);\n                  const to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"G\\u30BE\\u30FC\\u30F3\");\n                  return GameStateFn2.moveItem(ctx3, to, [cardId3, from2], GameStateFn2.onMoveItem);\n                }\n                if (prototype2.category == \"\\u30AA\\u30DA\\u30EC\\u30FC\\u30B7\\u30E7\\u30F3\") {\n                  const cardId3 = DefineFn2.EffectFn.getCardID(effect3);\n                  const from2 = GameStateFn2.getItemBaSyou(ctx3, cardId3);\n                  const to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\");\n                  return GameStateFn2.moveItem(ctx3, to, [cardId3, from2], GameStateFn2.onMoveItem);\n                }\n                if (prototype2.category == \"ACE\") {\n                  throw new Error(`not support category: ${prototype2.category}`);\n                }\n                return ctx3;\n              }"
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
                                        "card_019218bf-257d-722c-b334-4e3736195082",
                                        {
                                            "id": "AbsoluteBaSyou",
                                            "value": [
                                                "PlayerA",
                                                "Gゾーン"
                                            ]
                                        }
                                    ],
                                    [
                                        "card_019218bf-257d-722c-b334-560911907909",
                                        {
                                            "id": "AbsoluteBaSyou",
                                            "value": [
                                                "PlayerA",
                                                "Gゾーン"
                                            ]
                                        }
                                    ],
                                    [
                                        "card_019218bf-257d-722c-b334-5f8d69d4a6d4",
                                        {
                                            "id": "AbsoluteBaSyou",
                                            "value": [
                                                "PlayerA",
                                                "Gゾーン"
                                            ]
                                        }
                                    ],
                                    [
                                        "card_019218bf-257d-722c-b334-607acf499510",
                                        {
                                            "id": "AbsoluteBaSyou",
                                            "value": [
                                                "PlayerA",
                                                "Gゾーン"
                                            ]
                                        }
                                    ],
                                    [
                                        "card_019218bf-257d-722c-b334-6c8763e493e2",
                                        {
                                            "id": "AbsoluteBaSyou",
                                            "value": [
                                                "PlayerA",
                                                "Gゾーン"
                                            ]
                                        }
                                    ],
                                    [
                                        "card_019218bf-257d-722c-b334-763b8233b319",
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
                                        "card_019218bf-257d-722c-b334-4e3736195082",
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
                "id": "getCommandEffectTips_019218c9-942c-722c-b339-24075ee3a2b8",
                "effect": {
                    "id": "getPlayCardEffects_card_019218bf-257b-722c-b332-a10c5bce702b",
                    "reason": [
                        "PlayCard",
                        "PlayerA",
                        "card_019218bf-257b-722c-b332-a10c5bce702b"
                    ],
                    "description": "從手中即將出牌, 出牌後會產生場出的效果",
                    "text": {
                        "id": "getPlayCardEffects_text_card_019218bf-257b-722c-b332-a10c5bce702b",
                        "title": [],
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
                                        "title": "function _(ctx3, effect3, { DefineFn: DefineFn2, GameStateFn: GameStateFn2, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn2.EffectFn.getCardID(effect3);\n                const prototype2 = GameStateFn2.getItemPrototype(ctx3, cardId2);\n                const from = GameStateFn2.getItemBaSyou(ctx3, cardId2);\n                ctx3 = GameStateFn2.moveItem(ctx3, DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u3044\\u308B\\u30AB\\u30FC\\u30C9\"), [cardId2, from]);\n                if (prototype2.category == \"\\u30E6\\u30CB\\u30C3\\u30C8\") {\n                  return GameStateFn2.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn2.EffectFn.getPlayerID(effect3), DefineFn2.EffectFn.getCardID(effect3)],\n                    description: effect3.text.description,\n                    text: {\n                      id: effect3.text.id,\n                      description: effect3.text.description,\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect4, { DefineFn: DefineFn3, GameStateFn: GameStateFn3 }) {\n                                const cardId3 = DefineFn3.EffectFn.getCardID(effect4);\n                                const from2 = GameStateFn3.getItemBaSyou(ctx4, cardId3);\n                                const to = DefineFn3.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\");\n                                ctx4 = GameStateFn3.moveItem(ctx4, to, [cardId3, from2], GameStateFn3.onMoveItem);\n                                const hasHigh = GameStateFn3.getCardHasSpeicalEffect(ctx4, [\"\\u6226\\u95D8\\u914D\\u5099\"], cardId3);\n                                const hasPS = GameStateFn3.getCardHasSpeicalEffect(ctx4, [\"PS\\u88C5\\u7532\"], cardId3);\n                                const isNoNeedRoll = hasHigh || hasPS;\n                                const isRoll = isNoNeedRoll == false;\n                                ctx4 = GameStateFn3.setItemIsRoll(ctx4, isRoll, [cardId3, to]);\n                                return ctx4;\n                              }.toString()\n                            }\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30AD\\u30E3\\u30E9\\u30AF\\u30BF\\u30FC\" || prototype2.category == \"\\u30AA\\u30DA\\u30EC\\u30FC\\u30B7\\u30E7\\u30F3(\\u30E6\\u30CB\\u30C3\\u30C8)\") {\n                  return GameStateFn2.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn2.EffectFn.getPlayerID(effect3), DefineFn2.EffectFn.getCardID(effect3)],\n                    description: effect3.text.description,\n                    text: {\n                      id: effect3.text.id,\n                      description: effect3.text.description,\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect4, { DefineFn: DefineFn3, GameStateFn: GameStateFn3 }) {\n                                const cardId3 = DefineFn3.EffectFn.getCardID(effect4);\n                                const pairs = GameStateFn3.getCardTipStrBaSyouPairs(ctx4, \"unitForSet\", cardId3);\n                                const [targetCardId, targetBasyou] = pairs[0];\n                                const from2 = GameStateFn3.getItemBaSyou(ctx4, cardId3);\n                                const to = targetBasyou;\n                                ctx4 = GameStateFn3.moveItem(ctx4, to, [cardId3, from2], GameStateFn3.onMoveItem);\n                                ctx4 = GameStateFn3.setSetGroupLink(ctx4, targetCardId, cardId3);\n                                return ctx4;\n                              }.toString()\n                            }\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30B3\\u30DE\\u30F3\\u30C9\" && prototype2.commandText) {\n                  return GameStateFn2.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn2.EffectFn.getPlayerID(effect3), DefineFn2.EffectFn.getCardID(effect3)],\n                    description: effect3.text.description,\n                    text: {\n                      id: prototype2.commandText.id,\n                      description: prototype2.commandText.description,\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect4, { DefineFn: DefineFn3, GameStateFn: GameStateFn3 }) {\n                                const cardId3 = DefineFn3.EffectFn.getCardID(effect4);\n                                const from2 = GameStateFn3.getItemBaSyou(ctx4, cardId3);\n                                const to = DefineFn3.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u30B8\\u30E3\\u30F3\\u30AF\\u30E4\\u30FC\\u30C9\");\n                                ctx4 = GameStateFn3.moveItem(ctx4, to, [cardId3, from2], GameStateFn3.onMoveItem);\n                                return ctx4;\n                              }.toString()\n                            },\n                            ...prototype2.commandText.logicTreeActions?.[0].actions || []\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30B0\\u30E9\\u30D5\\u30A3\\u30C3\\u30AF\") {\n                  const cardId3 = DefineFn2.EffectFn.getCardID(effect3);\n                  const from2 = GameStateFn2.getItemBaSyou(ctx3, cardId3);\n                  const to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"G\\u30BE\\u30FC\\u30F3\");\n                  return GameStateFn2.moveItem(ctx3, to, [cardId3, from2], GameStateFn2.onMoveItem);\n                }\n                if (prototype2.category == \"\\u30AA\\u30DA\\u30EC\\u30FC\\u30B7\\u30E7\\u30F3\") {\n                  const cardId3 = DefineFn2.EffectFn.getCardID(effect3);\n                  const from2 = GameStateFn2.getItemBaSyou(ctx3, cardId3);\n                  const to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\");\n                  return GameStateFn2.moveItem(ctx3, to, [cardId3, from2], GameStateFn2.onMoveItem);\n                }\n                if (prototype2.category == \"ACE\") {\n                  throw new Error(`not support category: ${prototype2.category}`);\n                }\n                return ctx3;\n              }"
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
                "id": "getCommandEffectTips_019218c9-942c-722c-b339-2a56791c8503",
                "effect": {
                    "id": "getPlayCardEffects_card_019218bf-257b-722c-b332-8b297b2bb768",
                    "reason": [
                        "PlayCard",
                        "PlayerA",
                        "card_019218bf-257b-722c-b332-8b297b2bb768"
                    ],
                    "description": "從手中即將出牌, 出牌後會產生場出的效果",
                    "text": {
                        "id": "getPlayCardEffects_text_card_019218bf-257b-722c-b332-8b297b2bb768",
                        "title": [],
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
                                        "title": "function _(ctx3, effect3, { DefineFn: DefineFn2, GameStateFn: GameStateFn2, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn2.EffectFn.getCardID(effect3);\n                const prototype2 = GameStateFn2.getItemPrototype(ctx3, cardId2);\n                const from = GameStateFn2.getItemBaSyou(ctx3, cardId2);\n                ctx3 = GameStateFn2.moveItem(ctx3, DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u3044\\u308B\\u30AB\\u30FC\\u30C9\"), [cardId2, from]);\n                if (prototype2.category == \"\\u30E6\\u30CB\\u30C3\\u30C8\") {\n                  return GameStateFn2.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn2.EffectFn.getPlayerID(effect3), DefineFn2.EffectFn.getCardID(effect3)],\n                    description: effect3.text.description,\n                    text: {\n                      id: effect3.text.id,\n                      description: effect3.text.description,\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect4, { DefineFn: DefineFn3, GameStateFn: GameStateFn3 }) {\n                                const cardId3 = DefineFn3.EffectFn.getCardID(effect4);\n                                const from2 = GameStateFn3.getItemBaSyou(ctx4, cardId3);\n                                const to = DefineFn3.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\");\n                                ctx4 = GameStateFn3.moveItem(ctx4, to, [cardId3, from2], GameStateFn3.onMoveItem);\n                                const hasHigh = GameStateFn3.getCardHasSpeicalEffect(ctx4, [\"\\u6226\\u95D8\\u914D\\u5099\"], cardId3);\n                                const hasPS = GameStateFn3.getCardHasSpeicalEffect(ctx4, [\"PS\\u88C5\\u7532\"], cardId3);\n                                const isNoNeedRoll = hasHigh || hasPS;\n                                const isRoll = isNoNeedRoll == false;\n                                ctx4 = GameStateFn3.setItemIsRoll(ctx4, isRoll, [cardId3, to]);\n                                return ctx4;\n                              }.toString()\n                            }\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30AD\\u30E3\\u30E9\\u30AF\\u30BF\\u30FC\" || prototype2.category == \"\\u30AA\\u30DA\\u30EC\\u30FC\\u30B7\\u30E7\\u30F3(\\u30E6\\u30CB\\u30C3\\u30C8)\") {\n                  return GameStateFn2.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn2.EffectFn.getPlayerID(effect3), DefineFn2.EffectFn.getCardID(effect3)],\n                    description: effect3.text.description,\n                    text: {\n                      id: effect3.text.id,\n                      description: effect3.text.description,\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect4, { DefineFn: DefineFn3, GameStateFn: GameStateFn3 }) {\n                                const cardId3 = DefineFn3.EffectFn.getCardID(effect4);\n                                const pairs = GameStateFn3.getCardTipStrBaSyouPairs(ctx4, \"unitForSet\", cardId3);\n                                const [targetCardId, targetBasyou] = pairs[0];\n                                const from2 = GameStateFn3.getItemBaSyou(ctx4, cardId3);\n                                const to = targetBasyou;\n                                ctx4 = GameStateFn3.moveItem(ctx4, to, [cardId3, from2], GameStateFn3.onMoveItem);\n                                ctx4 = GameStateFn3.setSetGroupLink(ctx4, targetCardId, cardId3);\n                                return ctx4;\n                              }.toString()\n                            }\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30B3\\u30DE\\u30F3\\u30C9\" && prototype2.commandText) {\n                  return GameStateFn2.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn2.EffectFn.getPlayerID(effect3), DefineFn2.EffectFn.getCardID(effect3)],\n                    description: effect3.text.description,\n                    text: {\n                      id: prototype2.commandText.id,\n                      description: prototype2.commandText.description,\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect4, { DefineFn: DefineFn3, GameStateFn: GameStateFn3 }) {\n                                const cardId3 = DefineFn3.EffectFn.getCardID(effect4);\n                                const from2 = GameStateFn3.getItemBaSyou(ctx4, cardId3);\n                                const to = DefineFn3.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u30B8\\u30E3\\u30F3\\u30AF\\u30E4\\u30FC\\u30C9\");\n                                ctx4 = GameStateFn3.moveItem(ctx4, to, [cardId3, from2], GameStateFn3.onMoveItem);\n                                return ctx4;\n                              }.toString()\n                            },\n                            ...prototype2.commandText.logicTreeActions?.[0].actions || []\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30B0\\u30E9\\u30D5\\u30A3\\u30C3\\u30AF\") {\n                  const cardId3 = DefineFn2.EffectFn.getCardID(effect3);\n                  const from2 = GameStateFn2.getItemBaSyou(ctx3, cardId3);\n                  const to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"G\\u30BE\\u30FC\\u30F3\");\n                  return GameStateFn2.moveItem(ctx3, to, [cardId3, from2], GameStateFn2.onMoveItem);\n                }\n                if (prototype2.category == \"\\u30AA\\u30DA\\u30EC\\u30FC\\u30B7\\u30E7\\u30F3\") {\n                  const cardId3 = DefineFn2.EffectFn.getCardID(effect3);\n                  const from2 = GameStateFn2.getItemBaSyou(ctx3, cardId3);\n                  const to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\");\n                  return GameStateFn2.moveItem(ctx3, to, [cardId3, from2], GameStateFn2.onMoveItem);\n                }\n                if (prototype2.category == \"ACE\") {\n                  throw new Error(`not support category: ${prototype2.category}`);\n                }\n                return ctx3;\n              }"
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
                                        "card_019218bf-257d-722c-b334-4e3736195082",
                                        {
                                            "id": "AbsoluteBaSyou",
                                            "value": [
                                                "PlayerA",
                                                "Gゾーン"
                                            ]
                                        }
                                    ],
                                    [
                                        "card_019218bf-257d-722c-b334-560911907909",
                                        {
                                            "id": "AbsoluteBaSyou",
                                            "value": [
                                                "PlayerA",
                                                "Gゾーン"
                                            ]
                                        }
                                    ],
                                    [
                                        "card_019218bf-257d-722c-b334-5f8d69d4a6d4",
                                        {
                                            "id": "AbsoluteBaSyou",
                                            "value": [
                                                "PlayerA",
                                                "Gゾーン"
                                            ]
                                        }
                                    ],
                                    [
                                        "card_019218bf-257d-722c-b334-607acf499510",
                                        {
                                            "id": "AbsoluteBaSyou",
                                            "value": [
                                                "PlayerA",
                                                "Gゾーン"
                                            ]
                                        }
                                    ],
                                    [
                                        "card_019218bf-257d-722c-b334-6c8763e493e2",
                                        {
                                            "id": "AbsoluteBaSyou",
                                            "value": [
                                                "PlayerA",
                                                "Gゾーン"
                                            ]
                                        }
                                    ],
                                    [
                                        "card_019218bf-257d-722c-b334-763b8233b319",
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
                                        "card_019218bf-257d-722c-b334-4e3736195082",
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
                "id": "getCommandEffectTips_019218c9-942d-722c-b339-367a619d0742",
                "effect": {
                    "id": "getPlayCardEffects_card_019218bf-257b-722c-b332-c7ea64f1db07",
                    "reason": [
                        "PlayCard",
                        "PlayerB",
                        "card_019218bf-257b-722c-b332-c7ea64f1db07"
                    ],
                    "description": "從手中即將出牌, 出牌後會產生場出的效果",
                    "text": {
                        "id": "getPlayCardEffects_text_card_019218bf-257b-722c-b332-c7ea64f1db07",
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
                                "actions": [
                                    {
                                        "title": "function _(ctx3, effect3, { DefineFn: DefineFn2, GameStateFn: GameStateFn2, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn2.EffectFn.getCardID(effect3);\n                const prototype2 = GameStateFn2.getItemPrototype(ctx3, cardId2);\n                const from = GameStateFn2.getItemBaSyou(ctx3, cardId2);\n                ctx3 = GameStateFn2.moveItem(ctx3, DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u3044\\u308B\\u30AB\\u30FC\\u30C9\"), [cardId2, from]);\n                if (prototype2.category == \"\\u30E6\\u30CB\\u30C3\\u30C8\") {\n                  return GameStateFn2.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn2.EffectFn.getPlayerID(effect3), DefineFn2.EffectFn.getCardID(effect3)],\n                    description: effect3.text.description,\n                    text: {\n                      id: effect3.text.id,\n                      description: effect3.text.description,\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect4, { DefineFn: DefineFn3, GameStateFn: GameStateFn3 }) {\n                                const cardId3 = DefineFn3.EffectFn.getCardID(effect4);\n                                const from2 = GameStateFn3.getItemBaSyou(ctx4, cardId3);\n                                const to = DefineFn3.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\");\n                                ctx4 = GameStateFn3.moveItem(ctx4, to, [cardId3, from2], GameStateFn3.onMoveItem);\n                                const hasHigh = GameStateFn3.getCardHasSpeicalEffect(ctx4, [\"\\u6226\\u95D8\\u914D\\u5099\"], cardId3);\n                                const hasPS = GameStateFn3.getCardHasSpeicalEffect(ctx4, [\"PS\\u88C5\\u7532\"], cardId3);\n                                const isNoNeedRoll = hasHigh || hasPS;\n                                const isRoll = isNoNeedRoll == false;\n                                ctx4 = GameStateFn3.setItemIsRoll(ctx4, isRoll, [cardId3, to]);\n                                return ctx4;\n                              }.toString()\n                            }\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30AD\\u30E3\\u30E9\\u30AF\\u30BF\\u30FC\" || prototype2.category == \"\\u30AA\\u30DA\\u30EC\\u30FC\\u30B7\\u30E7\\u30F3(\\u30E6\\u30CB\\u30C3\\u30C8)\") {\n                  return GameStateFn2.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn2.EffectFn.getPlayerID(effect3), DefineFn2.EffectFn.getCardID(effect3)],\n                    description: effect3.text.description,\n                    text: {\n                      id: effect3.text.id,\n                      description: effect3.text.description,\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect4, { DefineFn: DefineFn3, GameStateFn: GameStateFn3 }) {\n                                const cardId3 = DefineFn3.EffectFn.getCardID(effect4);\n                                const pairs = GameStateFn3.getCardTipStrBaSyouPairs(ctx4, \"unitForSet\", cardId3);\n                                const [targetCardId, targetBasyou] = pairs[0];\n                                const from2 = GameStateFn3.getItemBaSyou(ctx4, cardId3);\n                                const to = targetBasyou;\n                                ctx4 = GameStateFn3.moveItem(ctx4, to, [cardId3, from2], GameStateFn3.onMoveItem);\n                                ctx4 = GameStateFn3.setSetGroupLink(ctx4, targetCardId, cardId3);\n                                return ctx4;\n                              }.toString()\n                            }\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30B3\\u30DE\\u30F3\\u30C9\" && prototype2.commandText) {\n                  return GameStateFn2.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn2.EffectFn.getPlayerID(effect3), DefineFn2.EffectFn.getCardID(effect3)],\n                    description: effect3.text.description,\n                    text: {\n                      id: prototype2.commandText.id,\n                      description: prototype2.commandText.description,\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect4, { DefineFn: DefineFn3, GameStateFn: GameStateFn3 }) {\n                                const cardId3 = DefineFn3.EffectFn.getCardID(effect4);\n                                const from2 = GameStateFn3.getItemBaSyou(ctx4, cardId3);\n                                const to = DefineFn3.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u30B8\\u30E3\\u30F3\\u30AF\\u30E4\\u30FC\\u30C9\");\n                                ctx4 = GameStateFn3.moveItem(ctx4, to, [cardId3, from2], GameStateFn3.onMoveItem);\n                                return ctx4;\n                              }.toString()\n                            },\n                            ...prototype2.commandText.logicTreeActions?.[0].actions || []\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30B0\\u30E9\\u30D5\\u30A3\\u30C3\\u30AF\") {\n                  const cardId3 = DefineFn2.EffectFn.getCardID(effect3);\n                  const from2 = GameStateFn2.getItemBaSyou(ctx3, cardId3);\n                  const to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"G\\u30BE\\u30FC\\u30F3\");\n                  return GameStateFn2.moveItem(ctx3, to, [cardId3, from2], GameStateFn2.onMoveItem);\n                }\n                if (prototype2.category == \"\\u30AA\\u30DA\\u30EC\\u30FC\\u30B7\\u30E7\\u30F3\") {\n                  const cardId3 = DefineFn2.EffectFn.getCardID(effect3);\n                  const from2 = GameStateFn2.getItemBaSyou(ctx3, cardId3);\n                  const to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\");\n                  return GameStateFn2.moveItem(ctx3, to, [cardId3, from2], GameStateFn2.onMoveItem);\n                }\n                if (prototype2.category == \"ACE\") {\n                  throw new Error(`not support category: ${prototype2.category}`);\n                }\n                return ctx3;\n              }"
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
                            {
                                "name": "GameError"
                            }
                        ]
                    },
                    {
                        "conditionKey": "0[黒]",
                        "tip": {
                            "title": [
                                "カード",
                                [],
                                []
                            ],
                            "min": 1
                        },
                        "errors": [
                            {
                                "name": "GameError"
                            }
                        ]
                    }
                ]
            },
            {
                "id": "getCommandEffectTips_019218c9-942e-722c-b339-3be52f9493ac",
                "effect": {
                    "id": "getPlayCardEffects_card_019218bf-257b-722c-b333-6c1aa00a5275",
                    "reason": [
                        "PlayCard",
                        "PlayerB",
                        "card_019218bf-257b-722c-b333-6c1aa00a5275"
                    ],
                    "description": "從手中即將出牌, 出牌後會產生場出的效果",
                    "text": {
                        "id": "getPlayCardEffects_text_card_019218bf-257b-722c-b333-6c1aa00a5275",
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
                                "actions": [
                                    {
                                        "title": "function _(ctx3, effect3, { DefineFn: DefineFn2, GameStateFn: GameStateFn2, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn2.EffectFn.getCardID(effect3);\n                const prototype2 = GameStateFn2.getItemPrototype(ctx3, cardId2);\n                const from = GameStateFn2.getItemBaSyou(ctx3, cardId2);\n                ctx3 = GameStateFn2.moveItem(ctx3, DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u3044\\u308B\\u30AB\\u30FC\\u30C9\"), [cardId2, from]);\n                if (prototype2.category == \"\\u30E6\\u30CB\\u30C3\\u30C8\") {\n                  return GameStateFn2.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn2.EffectFn.getPlayerID(effect3), DefineFn2.EffectFn.getCardID(effect3)],\n                    description: effect3.text.description,\n                    text: {\n                      id: effect3.text.id,\n                      description: effect3.text.description,\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect4, { DefineFn: DefineFn3, GameStateFn: GameStateFn3 }) {\n                                const cardId3 = DefineFn3.EffectFn.getCardID(effect4);\n                                const from2 = GameStateFn3.getItemBaSyou(ctx4, cardId3);\n                                const to = DefineFn3.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\");\n                                ctx4 = GameStateFn3.moveItem(ctx4, to, [cardId3, from2], GameStateFn3.onMoveItem);\n                                const hasHigh = GameStateFn3.getCardHasSpeicalEffect(ctx4, [\"\\u6226\\u95D8\\u914D\\u5099\"], cardId3);\n                                const hasPS = GameStateFn3.getCardHasSpeicalEffect(ctx4, [\"PS\\u88C5\\u7532\"], cardId3);\n                                const isNoNeedRoll = hasHigh || hasPS;\n                                const isRoll = isNoNeedRoll == false;\n                                ctx4 = GameStateFn3.setItemIsRoll(ctx4, isRoll, [cardId3, to]);\n                                return ctx4;\n                              }.toString()\n                            }\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30AD\\u30E3\\u30E9\\u30AF\\u30BF\\u30FC\" || prototype2.category == \"\\u30AA\\u30DA\\u30EC\\u30FC\\u30B7\\u30E7\\u30F3(\\u30E6\\u30CB\\u30C3\\u30C8)\") {\n                  return GameStateFn2.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn2.EffectFn.getPlayerID(effect3), DefineFn2.EffectFn.getCardID(effect3)],\n                    description: effect3.text.description,\n                    text: {\n                      id: effect3.text.id,\n                      description: effect3.text.description,\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect4, { DefineFn: DefineFn3, GameStateFn: GameStateFn3 }) {\n                                const cardId3 = DefineFn3.EffectFn.getCardID(effect4);\n                                const pairs = GameStateFn3.getCardTipStrBaSyouPairs(ctx4, \"unitForSet\", cardId3);\n                                const [targetCardId, targetBasyou] = pairs[0];\n                                const from2 = GameStateFn3.getItemBaSyou(ctx4, cardId3);\n                                const to = targetBasyou;\n                                ctx4 = GameStateFn3.moveItem(ctx4, to, [cardId3, from2], GameStateFn3.onMoveItem);\n                                ctx4 = GameStateFn3.setSetGroupLink(ctx4, targetCardId, cardId3);\n                                return ctx4;\n                              }.toString()\n                            }\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30B3\\u30DE\\u30F3\\u30C9\" && prototype2.commandText) {\n                  return GameStateFn2.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn2.EffectFn.getPlayerID(effect3), DefineFn2.EffectFn.getCardID(effect3)],\n                    description: effect3.text.description,\n                    text: {\n                      id: prototype2.commandText.id,\n                      description: prototype2.commandText.description,\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect4, { DefineFn: DefineFn3, GameStateFn: GameStateFn3 }) {\n                                const cardId3 = DefineFn3.EffectFn.getCardID(effect4);\n                                const from2 = GameStateFn3.getItemBaSyou(ctx4, cardId3);\n                                const to = DefineFn3.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u30B8\\u30E3\\u30F3\\u30AF\\u30E4\\u30FC\\u30C9\");\n                                ctx4 = GameStateFn3.moveItem(ctx4, to, [cardId3, from2], GameStateFn3.onMoveItem);\n                                return ctx4;\n                              }.toString()\n                            },\n                            ...prototype2.commandText.logicTreeActions?.[0].actions || []\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30B0\\u30E9\\u30D5\\u30A3\\u30C3\\u30AF\") {\n                  const cardId3 = DefineFn2.EffectFn.getCardID(effect3);\n                  const from2 = GameStateFn2.getItemBaSyou(ctx3, cardId3);\n                  const to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"G\\u30BE\\u30FC\\u30F3\");\n                  return GameStateFn2.moveItem(ctx3, to, [cardId3, from2], GameStateFn2.onMoveItem);\n                }\n                if (prototype2.category == \"\\u30AA\\u30DA\\u30EC\\u30FC\\u30B7\\u30E7\\u30F3\") {\n                  const cardId3 = DefineFn2.EffectFn.getCardID(effect3);\n                  const from2 = GameStateFn2.getItemBaSyou(ctx3, cardId3);\n                  const to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\");\n                  return GameStateFn2.moveItem(ctx3, to, [cardId3, from2], GameStateFn2.onMoveItem);\n                }\n                if (prototype2.category == \"ACE\") {\n                  throw new Error(`not support category: ${prototype2.category}`);\n                }\n                return ctx3;\n              }"
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
                            {
                                "name": "GameError"
                            }
                        ]
                    },
                    {
                        "conditionKey": "0[黒]",
                        "tip": {
                            "title": [
                                "カード",
                                [],
                                []
                            ],
                            "min": 1
                        },
                        "errors": [
                            {
                                "name": "GameError"
                            }
                        ]
                    }
                ]
            },
            {
                "id": "getCommandEffectTips_019218c9-942e-722c-b339-4624048680b3",
                "effect": {
                    "id": "getPlayCardEffects_card_019218bf-257b-722c-b334-1a7ee2d399a1",
                    "reason": [
                        "PlayCard",
                        "PlayerB",
                        "card_019218bf-257b-722c-b334-1a7ee2d399a1"
                    ],
                    "description": "從手中即將出牌, 出牌後會產生場出的效果",
                    "text": {
                        "id": "getPlayCardEffects_text_card_019218bf-257b-722c-b334-1a7ee2d399a1",
                        "title": [],
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
                                        "title": "function _(ctx3, effect3, { DefineFn: DefineFn2, GameStateFn: GameStateFn2, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn2.EffectFn.getCardID(effect3);\n                const prototype2 = GameStateFn2.getItemPrototype(ctx3, cardId2);\n                const from = GameStateFn2.getItemBaSyou(ctx3, cardId2);\n                ctx3 = GameStateFn2.moveItem(ctx3, DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u3044\\u308B\\u30AB\\u30FC\\u30C9\"), [cardId2, from]);\n                if (prototype2.category == \"\\u30E6\\u30CB\\u30C3\\u30C8\") {\n                  return GameStateFn2.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn2.EffectFn.getPlayerID(effect3), DefineFn2.EffectFn.getCardID(effect3)],\n                    description: effect3.text.description,\n                    text: {\n                      id: effect3.text.id,\n                      description: effect3.text.description,\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect4, { DefineFn: DefineFn3, GameStateFn: GameStateFn3 }) {\n                                const cardId3 = DefineFn3.EffectFn.getCardID(effect4);\n                                const from2 = GameStateFn3.getItemBaSyou(ctx4, cardId3);\n                                const to = DefineFn3.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\");\n                                ctx4 = GameStateFn3.moveItem(ctx4, to, [cardId3, from2], GameStateFn3.onMoveItem);\n                                const hasHigh = GameStateFn3.getCardHasSpeicalEffect(ctx4, [\"\\u6226\\u95D8\\u914D\\u5099\"], cardId3);\n                                const hasPS = GameStateFn3.getCardHasSpeicalEffect(ctx4, [\"PS\\u88C5\\u7532\"], cardId3);\n                                const isNoNeedRoll = hasHigh || hasPS;\n                                const isRoll = isNoNeedRoll == false;\n                                ctx4 = GameStateFn3.setItemIsRoll(ctx4, isRoll, [cardId3, to]);\n                                return ctx4;\n                              }.toString()\n                            }\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30AD\\u30E3\\u30E9\\u30AF\\u30BF\\u30FC\" || prototype2.category == \"\\u30AA\\u30DA\\u30EC\\u30FC\\u30B7\\u30E7\\u30F3(\\u30E6\\u30CB\\u30C3\\u30C8)\") {\n                  return GameStateFn2.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn2.EffectFn.getPlayerID(effect3), DefineFn2.EffectFn.getCardID(effect3)],\n                    description: effect3.text.description,\n                    text: {\n                      id: effect3.text.id,\n                      description: effect3.text.description,\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect4, { DefineFn: DefineFn3, GameStateFn: GameStateFn3 }) {\n                                const cardId3 = DefineFn3.EffectFn.getCardID(effect4);\n                                const pairs = GameStateFn3.getCardTipStrBaSyouPairs(ctx4, \"unitForSet\", cardId3);\n                                const [targetCardId, targetBasyou] = pairs[0];\n                                const from2 = GameStateFn3.getItemBaSyou(ctx4, cardId3);\n                                const to = targetBasyou;\n                                ctx4 = GameStateFn3.moveItem(ctx4, to, [cardId3, from2], GameStateFn3.onMoveItem);\n                                ctx4 = GameStateFn3.setSetGroupLink(ctx4, targetCardId, cardId3);\n                                return ctx4;\n                              }.toString()\n                            }\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30B3\\u30DE\\u30F3\\u30C9\" && prototype2.commandText) {\n                  return GameStateFn2.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn2.EffectFn.getPlayerID(effect3), DefineFn2.EffectFn.getCardID(effect3)],\n                    description: effect3.text.description,\n                    text: {\n                      id: prototype2.commandText.id,\n                      description: prototype2.commandText.description,\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect4, { DefineFn: DefineFn3, GameStateFn: GameStateFn3 }) {\n                                const cardId3 = DefineFn3.EffectFn.getCardID(effect4);\n                                const from2 = GameStateFn3.getItemBaSyou(ctx4, cardId3);\n                                const to = DefineFn3.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u30B8\\u30E3\\u30F3\\u30AF\\u30E4\\u30FC\\u30C9\");\n                                ctx4 = GameStateFn3.moveItem(ctx4, to, [cardId3, from2], GameStateFn3.onMoveItem);\n                                return ctx4;\n                              }.toString()\n                            },\n                            ...prototype2.commandText.logicTreeActions?.[0].actions || []\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30B0\\u30E9\\u30D5\\u30A3\\u30C3\\u30AF\") {\n                  const cardId3 = DefineFn2.EffectFn.getCardID(effect3);\n                  const from2 = GameStateFn2.getItemBaSyou(ctx3, cardId3);\n                  const to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"G\\u30BE\\u30FC\\u30F3\");\n                  return GameStateFn2.moveItem(ctx3, to, [cardId3, from2], GameStateFn2.onMoveItem);\n                }\n                if (prototype2.category == \"\\u30AA\\u30DA\\u30EC\\u30FC\\u30B7\\u30E7\\u30F3\") {\n                  const cardId3 = DefineFn2.EffectFn.getCardID(effect3);\n                  const from2 = GameStateFn2.getItemBaSyou(ctx3, cardId3);\n                  const to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\");\n                  return GameStateFn2.moveItem(ctx3, to, [cardId3, from2], GameStateFn2.onMoveItem);\n                }\n                if (prototype2.category == \"ACE\") {\n                  throw new Error(`not support category: ${prototype2.category}`);\n                }\n                return ctx3;\n              }"
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
                            {
                                "name": "GameError"
                            }
                        ]
                    },
                    {
                        "conditionKey": "0[黒]",
                        "tip": {
                            "title": [
                                "カード",
                                [],
                                []
                            ],
                            "min": 1
                        },
                        "errors": [
                            {
                                "name": "GameError"
                            }
                        ]
                    }
                ]
            },
            {
                "id": "getCommandEffectTips_019218c9-942f-722c-b339-4cfe70a984c4",
                "effect": {
                    "id": "getPlayCardEffects_card_019218bf-257b-722c-b332-b88fdefd171a",
                    "reason": [
                        "PlayCard",
                        "PlayerB",
                        "card_019218bf-257b-722c-b332-b88fdefd171a"
                    ],
                    "description": "從手中即將出牌, 出牌後會產生場出的效果",
                    "text": {
                        "id": "getPlayCardEffects_text_card_019218bf-257b-722c-b332-b88fdefd171a",
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
                                "actions": [
                                    {
                                        "title": "function _(ctx3, effect3, { DefineFn: DefineFn2, GameStateFn: GameStateFn2, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn2.EffectFn.getCardID(effect3);\n                const prototype2 = GameStateFn2.getItemPrototype(ctx3, cardId2);\n                const from = GameStateFn2.getItemBaSyou(ctx3, cardId2);\n                ctx3 = GameStateFn2.moveItem(ctx3, DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u3044\\u308B\\u30AB\\u30FC\\u30C9\"), [cardId2, from]);\n                if (prototype2.category == \"\\u30E6\\u30CB\\u30C3\\u30C8\") {\n                  return GameStateFn2.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn2.EffectFn.getPlayerID(effect3), DefineFn2.EffectFn.getCardID(effect3)],\n                    description: effect3.text.description,\n                    text: {\n                      id: effect3.text.id,\n                      description: effect3.text.description,\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect4, { DefineFn: DefineFn3, GameStateFn: GameStateFn3 }) {\n                                const cardId3 = DefineFn3.EffectFn.getCardID(effect4);\n                                const from2 = GameStateFn3.getItemBaSyou(ctx4, cardId3);\n                                const to = DefineFn3.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\");\n                                ctx4 = GameStateFn3.moveItem(ctx4, to, [cardId3, from2], GameStateFn3.onMoveItem);\n                                const hasHigh = GameStateFn3.getCardHasSpeicalEffect(ctx4, [\"\\u6226\\u95D8\\u914D\\u5099\"], cardId3);\n                                const hasPS = GameStateFn3.getCardHasSpeicalEffect(ctx4, [\"PS\\u88C5\\u7532\"], cardId3);\n                                const isNoNeedRoll = hasHigh || hasPS;\n                                const isRoll = isNoNeedRoll == false;\n                                ctx4 = GameStateFn3.setItemIsRoll(ctx4, isRoll, [cardId3, to]);\n                                return ctx4;\n                              }.toString()\n                            }\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30AD\\u30E3\\u30E9\\u30AF\\u30BF\\u30FC\" || prototype2.category == \"\\u30AA\\u30DA\\u30EC\\u30FC\\u30B7\\u30E7\\u30F3(\\u30E6\\u30CB\\u30C3\\u30C8)\") {\n                  return GameStateFn2.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn2.EffectFn.getPlayerID(effect3), DefineFn2.EffectFn.getCardID(effect3)],\n                    description: effect3.text.description,\n                    text: {\n                      id: effect3.text.id,\n                      description: effect3.text.description,\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect4, { DefineFn: DefineFn3, GameStateFn: GameStateFn3 }) {\n                                const cardId3 = DefineFn3.EffectFn.getCardID(effect4);\n                                const pairs = GameStateFn3.getCardTipStrBaSyouPairs(ctx4, \"unitForSet\", cardId3);\n                                const [targetCardId, targetBasyou] = pairs[0];\n                                const from2 = GameStateFn3.getItemBaSyou(ctx4, cardId3);\n                                const to = targetBasyou;\n                                ctx4 = GameStateFn3.moveItem(ctx4, to, [cardId3, from2], GameStateFn3.onMoveItem);\n                                ctx4 = GameStateFn3.setSetGroupLink(ctx4, targetCardId, cardId3);\n                                return ctx4;\n                              }.toString()\n                            }\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30B3\\u30DE\\u30F3\\u30C9\" && prototype2.commandText) {\n                  return GameStateFn2.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn2.EffectFn.getPlayerID(effect3), DefineFn2.EffectFn.getCardID(effect3)],\n                    description: effect3.text.description,\n                    text: {\n                      id: prototype2.commandText.id,\n                      description: prototype2.commandText.description,\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect4, { DefineFn: DefineFn3, GameStateFn: GameStateFn3 }) {\n                                const cardId3 = DefineFn3.EffectFn.getCardID(effect4);\n                                const from2 = GameStateFn3.getItemBaSyou(ctx4, cardId3);\n                                const to = DefineFn3.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u30B8\\u30E3\\u30F3\\u30AF\\u30E4\\u30FC\\u30C9\");\n                                ctx4 = GameStateFn3.moveItem(ctx4, to, [cardId3, from2], GameStateFn3.onMoveItem);\n                                return ctx4;\n                              }.toString()\n                            },\n                            ...prototype2.commandText.logicTreeActions?.[0].actions || []\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30B0\\u30E9\\u30D5\\u30A3\\u30C3\\u30AF\") {\n                  const cardId3 = DefineFn2.EffectFn.getCardID(effect3);\n                  const from2 = GameStateFn2.getItemBaSyou(ctx3, cardId3);\n                  const to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"G\\u30BE\\u30FC\\u30F3\");\n                  return GameStateFn2.moveItem(ctx3, to, [cardId3, from2], GameStateFn2.onMoveItem);\n                }\n                if (prototype2.category == \"\\u30AA\\u30DA\\u30EC\\u30FC\\u30B7\\u30E7\\u30F3\") {\n                  const cardId3 = DefineFn2.EffectFn.getCardID(effect3);\n                  const from2 = GameStateFn2.getItemBaSyou(ctx3, cardId3);\n                  const to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\");\n                  return GameStateFn2.moveItem(ctx3, to, [cardId3, from2], GameStateFn2.onMoveItem);\n                }\n                if (prototype2.category == \"ACE\") {\n                  throw new Error(`not support category: ${prototype2.category}`);\n                }\n                return ctx3;\n              }"
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
                            {
                                "name": "GameError"
                            }
                        ]
                    },
                    {
                        "conditionKey": "0[黒]",
                        "tip": {
                            "title": [
                                "カード",
                                [],
                                []
                            ],
                            "min": 1
                        },
                        "errors": [
                            {
                                "name": "GameError"
                            }
                        ]
                    }
                ]
            },
            {
                "id": "getCommandEffectTips_019218c9-9430-722c-b339-579302619951",
                "effect": {
                    "id": "getPlayCardEffects_card_019218bf-257b-722c-b333-4f385b739b52",
                    "reason": [
                        "PlayCard",
                        "PlayerB",
                        "card_019218bf-257b-722c-b333-4f385b739b52"
                    ],
                    "description": "從手中即將出牌, 出牌後會產生場出的效果",
                    "text": {
                        "id": "getPlayCardEffects_text_card_019218bf-257b-722c-b333-4f385b739b52",
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
                                "actions": [
                                    {
                                        "title": "function _(ctx3, effect3, { DefineFn: DefineFn2, GameStateFn: GameStateFn2, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn2.EffectFn.getCardID(effect3);\n                const prototype2 = GameStateFn2.getItemPrototype(ctx3, cardId2);\n                const from = GameStateFn2.getItemBaSyou(ctx3, cardId2);\n                ctx3 = GameStateFn2.moveItem(ctx3, DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u3044\\u308B\\u30AB\\u30FC\\u30C9\"), [cardId2, from]);\n                if (prototype2.category == \"\\u30E6\\u30CB\\u30C3\\u30C8\") {\n                  return GameStateFn2.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn2.EffectFn.getPlayerID(effect3), DefineFn2.EffectFn.getCardID(effect3)],\n                    description: effect3.text.description,\n                    text: {\n                      id: effect3.text.id,\n                      description: effect3.text.description,\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect4, { DefineFn: DefineFn3, GameStateFn: GameStateFn3 }) {\n                                const cardId3 = DefineFn3.EffectFn.getCardID(effect4);\n                                const from2 = GameStateFn3.getItemBaSyou(ctx4, cardId3);\n                                const to = DefineFn3.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\");\n                                ctx4 = GameStateFn3.moveItem(ctx4, to, [cardId3, from2], GameStateFn3.onMoveItem);\n                                const hasHigh = GameStateFn3.getCardHasSpeicalEffect(ctx4, [\"\\u6226\\u95D8\\u914D\\u5099\"], cardId3);\n                                const hasPS = GameStateFn3.getCardHasSpeicalEffect(ctx4, [\"PS\\u88C5\\u7532\"], cardId3);\n                                const isNoNeedRoll = hasHigh || hasPS;\n                                const isRoll = isNoNeedRoll == false;\n                                ctx4 = GameStateFn3.setItemIsRoll(ctx4, isRoll, [cardId3, to]);\n                                return ctx4;\n                              }.toString()\n                            }\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30AD\\u30E3\\u30E9\\u30AF\\u30BF\\u30FC\" || prototype2.category == \"\\u30AA\\u30DA\\u30EC\\u30FC\\u30B7\\u30E7\\u30F3(\\u30E6\\u30CB\\u30C3\\u30C8)\") {\n                  return GameStateFn2.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn2.EffectFn.getPlayerID(effect3), DefineFn2.EffectFn.getCardID(effect3)],\n                    description: effect3.text.description,\n                    text: {\n                      id: effect3.text.id,\n                      description: effect3.text.description,\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect4, { DefineFn: DefineFn3, GameStateFn: GameStateFn3 }) {\n                                const cardId3 = DefineFn3.EffectFn.getCardID(effect4);\n                                const pairs = GameStateFn3.getCardTipStrBaSyouPairs(ctx4, \"unitForSet\", cardId3);\n                                const [targetCardId, targetBasyou] = pairs[0];\n                                const from2 = GameStateFn3.getItemBaSyou(ctx4, cardId3);\n                                const to = targetBasyou;\n                                ctx4 = GameStateFn3.moveItem(ctx4, to, [cardId3, from2], GameStateFn3.onMoveItem);\n                                ctx4 = GameStateFn3.setSetGroupLink(ctx4, targetCardId, cardId3);\n                                return ctx4;\n                              }.toString()\n                            }\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30B3\\u30DE\\u30F3\\u30C9\" && prototype2.commandText) {\n                  return GameStateFn2.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn2.EffectFn.getPlayerID(effect3), DefineFn2.EffectFn.getCardID(effect3)],\n                    description: effect3.text.description,\n                    text: {\n                      id: prototype2.commandText.id,\n                      description: prototype2.commandText.description,\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect4, { DefineFn: DefineFn3, GameStateFn: GameStateFn3 }) {\n                                const cardId3 = DefineFn3.EffectFn.getCardID(effect4);\n                                const from2 = GameStateFn3.getItemBaSyou(ctx4, cardId3);\n                                const to = DefineFn3.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u30B8\\u30E3\\u30F3\\u30AF\\u30E4\\u30FC\\u30C9\");\n                                ctx4 = GameStateFn3.moveItem(ctx4, to, [cardId3, from2], GameStateFn3.onMoveItem);\n                                return ctx4;\n                              }.toString()\n                            },\n                            ...prototype2.commandText.logicTreeActions?.[0].actions || []\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30B0\\u30E9\\u30D5\\u30A3\\u30C3\\u30AF\") {\n                  const cardId3 = DefineFn2.EffectFn.getCardID(effect3);\n                  const from2 = GameStateFn2.getItemBaSyou(ctx3, cardId3);\n                  const to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"G\\u30BE\\u30FC\\u30F3\");\n                  return GameStateFn2.moveItem(ctx3, to, [cardId3, from2], GameStateFn2.onMoveItem);\n                }\n                if (prototype2.category == \"\\u30AA\\u30DA\\u30EC\\u30FC\\u30B7\\u30E7\\u30F3\") {\n                  const cardId3 = DefineFn2.EffectFn.getCardID(effect3);\n                  const from2 = GameStateFn2.getItemBaSyou(ctx3, cardId3);\n                  const to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\");\n                  return GameStateFn2.moveItem(ctx3, to, [cardId3, from2], GameStateFn2.onMoveItem);\n                }\n                if (prototype2.category == \"ACE\") {\n                  throw new Error(`not support category: ${prototype2.category}`);\n                }\n                return ctx3;\n              }"
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
                            {
                                "name": "GameError"
                            }
                        ]
                    },
                    {
                        "conditionKey": "0[黒]",
                        "tip": {
                            "title": [
                                "カード",
                                [],
                                []
                            ],
                            "min": 1
                        },
                        "errors": [
                            {
                                "name": "GameError"
                            }
                        ]
                    }
                ]
            },
            {
                "id": "getCommandEffectTips_019218c9-9431-722c-b339-59a8a3612a93",
                "effect": {
                    "id": "getPlayCardEffects_card_019218bf-257b-722c-b332-d4d2f043ce19",
                    "reason": [
                        "PlayCard",
                        "PlayerB",
                        "card_019218bf-257b-722c-b332-d4d2f043ce19"
                    ],
                    "description": "從手中即將出牌, 出牌後會產生場出的效果",
                    "text": {
                        "id": "getPlayCardEffects_text_card_019218bf-257b-722c-b332-d4d2f043ce19",
                        "title": [],
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
                            }
                        },
                        "logicTreeActions": [
                            {
                                "actions": [
                                    {
                                        "title": "function _(ctx3, effect3, { DefineFn: DefineFn2, GameStateFn: GameStateFn2, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn2.EffectFn.getCardID(effect3);\n                const prototype2 = GameStateFn2.getItemPrototype(ctx3, cardId2);\n                const from = GameStateFn2.getItemBaSyou(ctx3, cardId2);\n                ctx3 = GameStateFn2.moveItem(ctx3, DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u3044\\u308B\\u30AB\\u30FC\\u30C9\"), [cardId2, from]);\n                if (prototype2.category == \"\\u30E6\\u30CB\\u30C3\\u30C8\") {\n                  return GameStateFn2.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn2.EffectFn.getPlayerID(effect3), DefineFn2.EffectFn.getCardID(effect3)],\n                    description: effect3.text.description,\n                    text: {\n                      id: effect3.text.id,\n                      description: effect3.text.description,\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect4, { DefineFn: DefineFn3, GameStateFn: GameStateFn3 }) {\n                                const cardId3 = DefineFn3.EffectFn.getCardID(effect4);\n                                const from2 = GameStateFn3.getItemBaSyou(ctx4, cardId3);\n                                const to = DefineFn3.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\");\n                                ctx4 = GameStateFn3.moveItem(ctx4, to, [cardId3, from2], GameStateFn3.onMoveItem);\n                                const hasHigh = GameStateFn3.getCardHasSpeicalEffect(ctx4, [\"\\u6226\\u95D8\\u914D\\u5099\"], cardId3);\n                                const hasPS = GameStateFn3.getCardHasSpeicalEffect(ctx4, [\"PS\\u88C5\\u7532\"], cardId3);\n                                const isNoNeedRoll = hasHigh || hasPS;\n                                const isRoll = isNoNeedRoll == false;\n                                ctx4 = GameStateFn3.setItemIsRoll(ctx4, isRoll, [cardId3, to]);\n                                return ctx4;\n                              }.toString()\n                            }\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30AD\\u30E3\\u30E9\\u30AF\\u30BF\\u30FC\" || prototype2.category == \"\\u30AA\\u30DA\\u30EC\\u30FC\\u30B7\\u30E7\\u30F3(\\u30E6\\u30CB\\u30C3\\u30C8)\") {\n                  return GameStateFn2.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn2.EffectFn.getPlayerID(effect3), DefineFn2.EffectFn.getCardID(effect3)],\n                    description: effect3.text.description,\n                    text: {\n                      id: effect3.text.id,\n                      description: effect3.text.description,\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect4, { DefineFn: DefineFn3, GameStateFn: GameStateFn3 }) {\n                                const cardId3 = DefineFn3.EffectFn.getCardID(effect4);\n                                const pairs = GameStateFn3.getCardTipStrBaSyouPairs(ctx4, \"unitForSet\", cardId3);\n                                const [targetCardId, targetBasyou] = pairs[0];\n                                const from2 = GameStateFn3.getItemBaSyou(ctx4, cardId3);\n                                const to = targetBasyou;\n                                ctx4 = GameStateFn3.moveItem(ctx4, to, [cardId3, from2], GameStateFn3.onMoveItem);\n                                ctx4 = GameStateFn3.setSetGroupLink(ctx4, targetCardId, cardId3);\n                                return ctx4;\n                              }.toString()\n                            }\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30B3\\u30DE\\u30F3\\u30C9\" && prototype2.commandText) {\n                  return GameStateFn2.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn2.EffectFn.getPlayerID(effect3), DefineFn2.EffectFn.getCardID(effect3)],\n                    description: effect3.text.description,\n                    text: {\n                      id: prototype2.commandText.id,\n                      description: prototype2.commandText.description,\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect4, { DefineFn: DefineFn3, GameStateFn: GameStateFn3 }) {\n                                const cardId3 = DefineFn3.EffectFn.getCardID(effect4);\n                                const from2 = GameStateFn3.getItemBaSyou(ctx4, cardId3);\n                                const to = DefineFn3.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u30B8\\u30E3\\u30F3\\u30AF\\u30E4\\u30FC\\u30C9\");\n                                ctx4 = GameStateFn3.moveItem(ctx4, to, [cardId3, from2], GameStateFn3.onMoveItem);\n                                return ctx4;\n                              }.toString()\n                            },\n                            ...prototype2.commandText.logicTreeActions?.[0].actions || []\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30B0\\u30E9\\u30D5\\u30A3\\u30C3\\u30AF\") {\n                  const cardId3 = DefineFn2.EffectFn.getCardID(effect3);\n                  const from2 = GameStateFn2.getItemBaSyou(ctx3, cardId3);\n                  const to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"G\\u30BE\\u30FC\\u30F3\");\n                  return GameStateFn2.moveItem(ctx3, to, [cardId3, from2], GameStateFn2.onMoveItem);\n                }\n                if (prototype2.category == \"\\u30AA\\u30DA\\u30EC\\u30FC\\u30B7\\u30E7\\u30F3\") {\n                  const cardId3 = DefineFn2.EffectFn.getCardID(effect3);\n                  const from2 = GameStateFn2.getItemBaSyou(ctx3, cardId3);\n                  const to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\");\n                  return GameStateFn2.moveItem(ctx3, to, [cardId3, from2], GameStateFn2.onMoveItem);\n                }\n                if (prototype2.category == \"ACE\") {\n                  throw new Error(`not support category: ${prototype2.category}`);\n                }\n                return ctx3;\n              }"
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
                            {
                                "name": "GameError"
                            }
                        ]
                    },
                    {
                        "conditionKey": "0[黒]",
                        "tip": {
                            "title": [
                                "カード",
                                [],
                                []
                            ],
                            "min": 1
                        },
                        "errors": [
                            {
                                "name": "GameError"
                            }
                        ]
                    },
                    {
                        "conditionKey": "1[黒]",
                        "tip": {
                            "title": [
                                "カード",
                                [],
                                []
                            ],
                            "min": 1
                        },
                        "errors": [
                            {
                                "name": "GameError"
                            }
                        ]
                    }
                ]
            }
        ],
        "commandEffects": [
            {
                "id": "getPlayCardEffects_card_019218bf-257b-722c-b331-befcce3aeffc",
                "reason": [
                    "PlayCard",
                    "PlayerA",
                    "card_019218bf-257b-722c-b331-befcce3aeffc"
                ],
                "description": "從手中即將出牌, 出牌後會產生場出的效果",
                "text": {
                    "id": "getPlayCardEffects_text_card_019218bf-257b-722c-b331-befcce3aeffc",
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
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect3, { DefineFn: DefineFn2, GameStateFn: GameStateFn2, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn2.EffectFn.getCardID(effect3);\n                const prototype2 = GameStateFn2.getItemPrototype(ctx3, cardId2);\n                const from = GameStateFn2.getItemBaSyou(ctx3, cardId2);\n                ctx3 = GameStateFn2.moveItem(ctx3, DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u3044\\u308B\\u30AB\\u30FC\\u30C9\"), [cardId2, from]);\n                if (prototype2.category == \"\\u30E6\\u30CB\\u30C3\\u30C8\") {\n                  return GameStateFn2.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn2.EffectFn.getPlayerID(effect3), DefineFn2.EffectFn.getCardID(effect3)],\n                    description: effect3.text.description,\n                    text: {\n                      id: effect3.text.id,\n                      description: effect3.text.description,\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect4, { DefineFn: DefineFn3, GameStateFn: GameStateFn3 }) {\n                                const cardId3 = DefineFn3.EffectFn.getCardID(effect4);\n                                const from2 = GameStateFn3.getItemBaSyou(ctx4, cardId3);\n                                const to = DefineFn3.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\");\n                                ctx4 = GameStateFn3.moveItem(ctx4, to, [cardId3, from2], GameStateFn3.onMoveItem);\n                                const hasHigh = GameStateFn3.getCardHasSpeicalEffect(ctx4, [\"\\u6226\\u95D8\\u914D\\u5099\"], cardId3);\n                                const hasPS = GameStateFn3.getCardHasSpeicalEffect(ctx4, [\"PS\\u88C5\\u7532\"], cardId3);\n                                const isNoNeedRoll = hasHigh || hasPS;\n                                const isRoll = isNoNeedRoll == false;\n                                ctx4 = GameStateFn3.setItemIsRoll(ctx4, isRoll, [cardId3, to]);\n                                return ctx4;\n                              }.toString()\n                            }\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30AD\\u30E3\\u30E9\\u30AF\\u30BF\\u30FC\" || prototype2.category == \"\\u30AA\\u30DA\\u30EC\\u30FC\\u30B7\\u30E7\\u30F3(\\u30E6\\u30CB\\u30C3\\u30C8)\") {\n                  return GameStateFn2.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn2.EffectFn.getPlayerID(effect3), DefineFn2.EffectFn.getCardID(effect3)],\n                    description: effect3.text.description,\n                    text: {\n                      id: effect3.text.id,\n                      description: effect3.text.description,\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect4, { DefineFn: DefineFn3, GameStateFn: GameStateFn3 }) {\n                                const cardId3 = DefineFn3.EffectFn.getCardID(effect4);\n                                const pairs = GameStateFn3.getCardTipStrBaSyouPairs(ctx4, \"unitForSet\", cardId3);\n                                const [targetCardId, targetBasyou] = pairs[0];\n                                const from2 = GameStateFn3.getItemBaSyou(ctx4, cardId3);\n                                const to = targetBasyou;\n                                ctx4 = GameStateFn3.moveItem(ctx4, to, [cardId3, from2], GameStateFn3.onMoveItem);\n                                ctx4 = GameStateFn3.setSetGroupLink(ctx4, targetCardId, cardId3);\n                                return ctx4;\n                              }.toString()\n                            }\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30B3\\u30DE\\u30F3\\u30C9\" && prototype2.commandText) {\n                  return GameStateFn2.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn2.EffectFn.getPlayerID(effect3), DefineFn2.EffectFn.getCardID(effect3)],\n                    description: effect3.text.description,\n                    text: {\n                      id: prototype2.commandText.id,\n                      description: prototype2.commandText.description,\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect4, { DefineFn: DefineFn3, GameStateFn: GameStateFn3 }) {\n                                const cardId3 = DefineFn3.EffectFn.getCardID(effect4);\n                                const from2 = GameStateFn3.getItemBaSyou(ctx4, cardId3);\n                                const to = DefineFn3.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u30B8\\u30E3\\u30F3\\u30AF\\u30E4\\u30FC\\u30C9\");\n                                ctx4 = GameStateFn3.moveItem(ctx4, to, [cardId3, from2], GameStateFn3.onMoveItem);\n                                return ctx4;\n                              }.toString()\n                            },\n                            ...prototype2.commandText.logicTreeActions?.[0].actions || []\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30B0\\u30E9\\u30D5\\u30A3\\u30C3\\u30AF\") {\n                  const cardId3 = DefineFn2.EffectFn.getCardID(effect3);\n                  const from2 = GameStateFn2.getItemBaSyou(ctx3, cardId3);\n                  const to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"G\\u30BE\\u30FC\\u30F3\");\n                  return GameStateFn2.moveItem(ctx3, to, [cardId3, from2], GameStateFn2.onMoveItem);\n                }\n                if (prototype2.category == \"\\u30AA\\u30DA\\u30EC\\u30FC\\u30B7\\u30E7\\u30F3\") {\n                  const cardId3 = DefineFn2.EffectFn.getCardID(effect3);\n                  const from2 = GameStateFn2.getItemBaSyou(ctx3, cardId3);\n                  const to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\");\n                  return GameStateFn2.moveItem(ctx3, to, [cardId3, from2], GameStateFn2.onMoveItem);\n                }\n                if (prototype2.category == \"ACE\") {\n                  throw new Error(`not support category: ${prototype2.category}`);\n                }\n                return ctx3;\n              }"
                                }
                            ]
                        }
                    ]
                }
            },
            {
                "id": "getPlayCardEffects_card_019218bf-257b-722c-b332-0e14a1e91176",
                "reason": [
                    "PlayCard",
                    "PlayerA",
                    "card_019218bf-257b-722c-b332-0e14a1e91176"
                ],
                "description": "從手中即將出牌, 出牌後會產生場出的效果",
                "text": {
                    "id": "getPlayCardEffects_text_card_019218bf-257b-722c-b332-0e14a1e91176",
                    "title": [],
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
                                    "title": "function _(ctx3, effect3, { DefineFn: DefineFn2, GameStateFn: GameStateFn2, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn2.EffectFn.getCardID(effect3);\n                const prototype2 = GameStateFn2.getItemPrototype(ctx3, cardId2);\n                const from = GameStateFn2.getItemBaSyou(ctx3, cardId2);\n                ctx3 = GameStateFn2.moveItem(ctx3, DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u3044\\u308B\\u30AB\\u30FC\\u30C9\"), [cardId2, from]);\n                if (prototype2.category == \"\\u30E6\\u30CB\\u30C3\\u30C8\") {\n                  return GameStateFn2.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn2.EffectFn.getPlayerID(effect3), DefineFn2.EffectFn.getCardID(effect3)],\n                    description: effect3.text.description,\n                    text: {\n                      id: effect3.text.id,\n                      description: effect3.text.description,\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect4, { DefineFn: DefineFn3, GameStateFn: GameStateFn3 }) {\n                                const cardId3 = DefineFn3.EffectFn.getCardID(effect4);\n                                const from2 = GameStateFn3.getItemBaSyou(ctx4, cardId3);\n                                const to = DefineFn3.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\");\n                                ctx4 = GameStateFn3.moveItem(ctx4, to, [cardId3, from2], GameStateFn3.onMoveItem);\n                                const hasHigh = GameStateFn3.getCardHasSpeicalEffect(ctx4, [\"\\u6226\\u95D8\\u914D\\u5099\"], cardId3);\n                                const hasPS = GameStateFn3.getCardHasSpeicalEffect(ctx4, [\"PS\\u88C5\\u7532\"], cardId3);\n                                const isNoNeedRoll = hasHigh || hasPS;\n                                const isRoll = isNoNeedRoll == false;\n                                ctx4 = GameStateFn3.setItemIsRoll(ctx4, isRoll, [cardId3, to]);\n                                return ctx4;\n                              }.toString()\n                            }\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30AD\\u30E3\\u30E9\\u30AF\\u30BF\\u30FC\" || prototype2.category == \"\\u30AA\\u30DA\\u30EC\\u30FC\\u30B7\\u30E7\\u30F3(\\u30E6\\u30CB\\u30C3\\u30C8)\") {\n                  return GameStateFn2.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn2.EffectFn.getPlayerID(effect3), DefineFn2.EffectFn.getCardID(effect3)],\n                    description: effect3.text.description,\n                    text: {\n                      id: effect3.text.id,\n                      description: effect3.text.description,\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect4, { DefineFn: DefineFn3, GameStateFn: GameStateFn3 }) {\n                                const cardId3 = DefineFn3.EffectFn.getCardID(effect4);\n                                const pairs = GameStateFn3.getCardTipStrBaSyouPairs(ctx4, \"unitForSet\", cardId3);\n                                const [targetCardId, targetBasyou] = pairs[0];\n                                const from2 = GameStateFn3.getItemBaSyou(ctx4, cardId3);\n                                const to = targetBasyou;\n                                ctx4 = GameStateFn3.moveItem(ctx4, to, [cardId3, from2], GameStateFn3.onMoveItem);\n                                ctx4 = GameStateFn3.setSetGroupLink(ctx4, targetCardId, cardId3);\n                                return ctx4;\n                              }.toString()\n                            }\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30B3\\u30DE\\u30F3\\u30C9\" && prototype2.commandText) {\n                  return GameStateFn2.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn2.EffectFn.getPlayerID(effect3), DefineFn2.EffectFn.getCardID(effect3)],\n                    description: effect3.text.description,\n                    text: {\n                      id: prototype2.commandText.id,\n                      description: prototype2.commandText.description,\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect4, { DefineFn: DefineFn3, GameStateFn: GameStateFn3 }) {\n                                const cardId3 = DefineFn3.EffectFn.getCardID(effect4);\n                                const from2 = GameStateFn3.getItemBaSyou(ctx4, cardId3);\n                                const to = DefineFn3.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u30B8\\u30E3\\u30F3\\u30AF\\u30E4\\u30FC\\u30C9\");\n                                ctx4 = GameStateFn3.moveItem(ctx4, to, [cardId3, from2], GameStateFn3.onMoveItem);\n                                return ctx4;\n                              }.toString()\n                            },\n                            ...prototype2.commandText.logicTreeActions?.[0].actions || []\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30B0\\u30E9\\u30D5\\u30A3\\u30C3\\u30AF\") {\n                  const cardId3 = DefineFn2.EffectFn.getCardID(effect3);\n                  const from2 = GameStateFn2.getItemBaSyou(ctx3, cardId3);\n                  const to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"G\\u30BE\\u30FC\\u30F3\");\n                  return GameStateFn2.moveItem(ctx3, to, [cardId3, from2], GameStateFn2.onMoveItem);\n                }\n                if (prototype2.category == \"\\u30AA\\u30DA\\u30EC\\u30FC\\u30B7\\u30E7\\u30F3\") {\n                  const cardId3 = DefineFn2.EffectFn.getCardID(effect3);\n                  const from2 = GameStateFn2.getItemBaSyou(ctx3, cardId3);\n                  const to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\");\n                  return GameStateFn2.moveItem(ctx3, to, [cardId3, from2], GameStateFn2.onMoveItem);\n                }\n                if (prototype2.category == \"ACE\") {\n                  throw new Error(`not support category: ${prototype2.category}`);\n                }\n                return ctx3;\n              }"
                                }
                            ]
                        }
                    ]
                }
            },
            {
                "id": "getPlayCardEffects_card_019218bf-257b-722c-b331-8b811f916eeb",
                "reason": [
                    "PlayCard",
                    "PlayerA",
                    "card_019218bf-257b-722c-b331-8b811f916eeb"
                ],
                "description": "從手中即將出牌, 出牌後會產生場出的效果",
                "text": {
                    "id": "getPlayCardEffects_text_card_019218bf-257b-722c-b331-8b811f916eeb",
                    "title": [],
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
                                    "title": "function _(ctx3, effect3, { DefineFn: DefineFn2, GameStateFn: GameStateFn2, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn2.EffectFn.getCardID(effect3);\n                const prototype2 = GameStateFn2.getItemPrototype(ctx3, cardId2);\n                const from = GameStateFn2.getItemBaSyou(ctx3, cardId2);\n                ctx3 = GameStateFn2.moveItem(ctx3, DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u3044\\u308B\\u30AB\\u30FC\\u30C9\"), [cardId2, from]);\n                if (prototype2.category == \"\\u30E6\\u30CB\\u30C3\\u30C8\") {\n                  return GameStateFn2.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn2.EffectFn.getPlayerID(effect3), DefineFn2.EffectFn.getCardID(effect3)],\n                    description: effect3.text.description,\n                    text: {\n                      id: effect3.text.id,\n                      description: effect3.text.description,\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect4, { DefineFn: DefineFn3, GameStateFn: GameStateFn3 }) {\n                                const cardId3 = DefineFn3.EffectFn.getCardID(effect4);\n                                const from2 = GameStateFn3.getItemBaSyou(ctx4, cardId3);\n                                const to = DefineFn3.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\");\n                                ctx4 = GameStateFn3.moveItem(ctx4, to, [cardId3, from2], GameStateFn3.onMoveItem);\n                                const hasHigh = GameStateFn3.getCardHasSpeicalEffect(ctx4, [\"\\u6226\\u95D8\\u914D\\u5099\"], cardId3);\n                                const hasPS = GameStateFn3.getCardHasSpeicalEffect(ctx4, [\"PS\\u88C5\\u7532\"], cardId3);\n                                const isNoNeedRoll = hasHigh || hasPS;\n                                const isRoll = isNoNeedRoll == false;\n                                ctx4 = GameStateFn3.setItemIsRoll(ctx4, isRoll, [cardId3, to]);\n                                return ctx4;\n                              }.toString()\n                            }\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30AD\\u30E3\\u30E9\\u30AF\\u30BF\\u30FC\" || prototype2.category == \"\\u30AA\\u30DA\\u30EC\\u30FC\\u30B7\\u30E7\\u30F3(\\u30E6\\u30CB\\u30C3\\u30C8)\") {\n                  return GameStateFn2.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn2.EffectFn.getPlayerID(effect3), DefineFn2.EffectFn.getCardID(effect3)],\n                    description: effect3.text.description,\n                    text: {\n                      id: effect3.text.id,\n                      description: effect3.text.description,\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect4, { DefineFn: DefineFn3, GameStateFn: GameStateFn3 }) {\n                                const cardId3 = DefineFn3.EffectFn.getCardID(effect4);\n                                const pairs = GameStateFn3.getCardTipStrBaSyouPairs(ctx4, \"unitForSet\", cardId3);\n                                const [targetCardId, targetBasyou] = pairs[0];\n                                const from2 = GameStateFn3.getItemBaSyou(ctx4, cardId3);\n                                const to = targetBasyou;\n                                ctx4 = GameStateFn3.moveItem(ctx4, to, [cardId3, from2], GameStateFn3.onMoveItem);\n                                ctx4 = GameStateFn3.setSetGroupLink(ctx4, targetCardId, cardId3);\n                                return ctx4;\n                              }.toString()\n                            }\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30B3\\u30DE\\u30F3\\u30C9\" && prototype2.commandText) {\n                  return GameStateFn2.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn2.EffectFn.getPlayerID(effect3), DefineFn2.EffectFn.getCardID(effect3)],\n                    description: effect3.text.description,\n                    text: {\n                      id: prototype2.commandText.id,\n                      description: prototype2.commandText.description,\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect4, { DefineFn: DefineFn3, GameStateFn: GameStateFn3 }) {\n                                const cardId3 = DefineFn3.EffectFn.getCardID(effect4);\n                                const from2 = GameStateFn3.getItemBaSyou(ctx4, cardId3);\n                                const to = DefineFn3.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u30B8\\u30E3\\u30F3\\u30AF\\u30E4\\u30FC\\u30C9\");\n                                ctx4 = GameStateFn3.moveItem(ctx4, to, [cardId3, from2], GameStateFn3.onMoveItem);\n                                return ctx4;\n                              }.toString()\n                            },\n                            ...prototype2.commandText.logicTreeActions?.[0].actions || []\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30B0\\u30E9\\u30D5\\u30A3\\u30C3\\u30AF\") {\n                  const cardId3 = DefineFn2.EffectFn.getCardID(effect3);\n                  const from2 = GameStateFn2.getItemBaSyou(ctx3, cardId3);\n                  const to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"G\\u30BE\\u30FC\\u30F3\");\n                  return GameStateFn2.moveItem(ctx3, to, [cardId3, from2], GameStateFn2.onMoveItem);\n                }\n                if (prototype2.category == \"\\u30AA\\u30DA\\u30EC\\u30FC\\u30B7\\u30E7\\u30F3\") {\n                  const cardId3 = DefineFn2.EffectFn.getCardID(effect3);\n                  const from2 = GameStateFn2.getItemBaSyou(ctx3, cardId3);\n                  const to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\");\n                  return GameStateFn2.moveItem(ctx3, to, [cardId3, from2], GameStateFn2.onMoveItem);\n                }\n                if (prototype2.category == \"ACE\") {\n                  throw new Error(`not support category: ${prototype2.category}`);\n                }\n                return ctx3;\n              }"
                                }
                            ]
                        }
                    ]
                }
            },
            {
                "id": "getPlayCardEffects_card_019218bf-257b-722c-b331-e5fad9f78c42",
                "reason": [
                    "PlayCard",
                    "PlayerA",
                    "card_019218bf-257b-722c-b331-e5fad9f78c42"
                ],
                "description": "從手中即將出牌, 出牌後會產生場出的效果",
                "text": {
                    "id": "getPlayCardEffects_text_card_019218bf-257b-722c-b331-e5fad9f78c42",
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
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect3, { DefineFn: DefineFn2, GameStateFn: GameStateFn2, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn2.EffectFn.getCardID(effect3);\n                const prototype2 = GameStateFn2.getItemPrototype(ctx3, cardId2);\n                const from = GameStateFn2.getItemBaSyou(ctx3, cardId2);\n                ctx3 = GameStateFn2.moveItem(ctx3, DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u3044\\u308B\\u30AB\\u30FC\\u30C9\"), [cardId2, from]);\n                if (prototype2.category == \"\\u30E6\\u30CB\\u30C3\\u30C8\") {\n                  return GameStateFn2.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn2.EffectFn.getPlayerID(effect3), DefineFn2.EffectFn.getCardID(effect3)],\n                    description: effect3.text.description,\n                    text: {\n                      id: effect3.text.id,\n                      description: effect3.text.description,\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect4, { DefineFn: DefineFn3, GameStateFn: GameStateFn3 }) {\n                                const cardId3 = DefineFn3.EffectFn.getCardID(effect4);\n                                const from2 = GameStateFn3.getItemBaSyou(ctx4, cardId3);\n                                const to = DefineFn3.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\");\n                                ctx4 = GameStateFn3.moveItem(ctx4, to, [cardId3, from2], GameStateFn3.onMoveItem);\n                                const hasHigh = GameStateFn3.getCardHasSpeicalEffect(ctx4, [\"\\u6226\\u95D8\\u914D\\u5099\"], cardId3);\n                                const hasPS = GameStateFn3.getCardHasSpeicalEffect(ctx4, [\"PS\\u88C5\\u7532\"], cardId3);\n                                const isNoNeedRoll = hasHigh || hasPS;\n                                const isRoll = isNoNeedRoll == false;\n                                ctx4 = GameStateFn3.setItemIsRoll(ctx4, isRoll, [cardId3, to]);\n                                return ctx4;\n                              }.toString()\n                            }\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30AD\\u30E3\\u30E9\\u30AF\\u30BF\\u30FC\" || prototype2.category == \"\\u30AA\\u30DA\\u30EC\\u30FC\\u30B7\\u30E7\\u30F3(\\u30E6\\u30CB\\u30C3\\u30C8)\") {\n                  return GameStateFn2.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn2.EffectFn.getPlayerID(effect3), DefineFn2.EffectFn.getCardID(effect3)],\n                    description: effect3.text.description,\n                    text: {\n                      id: effect3.text.id,\n                      description: effect3.text.description,\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect4, { DefineFn: DefineFn3, GameStateFn: GameStateFn3 }) {\n                                const cardId3 = DefineFn3.EffectFn.getCardID(effect4);\n                                const pairs = GameStateFn3.getCardTipStrBaSyouPairs(ctx4, \"unitForSet\", cardId3);\n                                const [targetCardId, targetBasyou] = pairs[0];\n                                const from2 = GameStateFn3.getItemBaSyou(ctx4, cardId3);\n                                const to = targetBasyou;\n                                ctx4 = GameStateFn3.moveItem(ctx4, to, [cardId3, from2], GameStateFn3.onMoveItem);\n                                ctx4 = GameStateFn3.setSetGroupLink(ctx4, targetCardId, cardId3);\n                                return ctx4;\n                              }.toString()\n                            }\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30B3\\u30DE\\u30F3\\u30C9\" && prototype2.commandText) {\n                  return GameStateFn2.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn2.EffectFn.getPlayerID(effect3), DefineFn2.EffectFn.getCardID(effect3)],\n                    description: effect3.text.description,\n                    text: {\n                      id: prototype2.commandText.id,\n                      description: prototype2.commandText.description,\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect4, { DefineFn: DefineFn3, GameStateFn: GameStateFn3 }) {\n                                const cardId3 = DefineFn3.EffectFn.getCardID(effect4);\n                                const from2 = GameStateFn3.getItemBaSyou(ctx4, cardId3);\n                                const to = DefineFn3.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u30B8\\u30E3\\u30F3\\u30AF\\u30E4\\u30FC\\u30C9\");\n                                ctx4 = GameStateFn3.moveItem(ctx4, to, [cardId3, from2], GameStateFn3.onMoveItem);\n                                return ctx4;\n                              }.toString()\n                            },\n                            ...prototype2.commandText.logicTreeActions?.[0].actions || []\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30B0\\u30E9\\u30D5\\u30A3\\u30C3\\u30AF\") {\n                  const cardId3 = DefineFn2.EffectFn.getCardID(effect3);\n                  const from2 = GameStateFn2.getItemBaSyou(ctx3, cardId3);\n                  const to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"G\\u30BE\\u30FC\\u30F3\");\n                  return GameStateFn2.moveItem(ctx3, to, [cardId3, from2], GameStateFn2.onMoveItem);\n                }\n                if (prototype2.category == \"\\u30AA\\u30DA\\u30EC\\u30FC\\u30B7\\u30E7\\u30F3\") {\n                  const cardId3 = DefineFn2.EffectFn.getCardID(effect3);\n                  const from2 = GameStateFn2.getItemBaSyou(ctx3, cardId3);\n                  const to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\");\n                  return GameStateFn2.moveItem(ctx3, to, [cardId3, from2], GameStateFn2.onMoveItem);\n                }\n                if (prototype2.category == \"ACE\") {\n                  throw new Error(`not support category: ${prototype2.category}`);\n                }\n                return ctx3;\n              }"
                                }
                            ]
                        }
                    ]
                }
            },
            {
                "id": "getPlayCardEffects_card_019218bf-257b-722c-b331-7ef913bc0a12",
                "reason": [
                    "PlayCard",
                    "PlayerA",
                    "card_019218bf-257b-722c-b331-7ef913bc0a12"
                ],
                "description": "從手中即將出牌, 出牌後會產生場出的效果",
                "text": {
                    "id": "getPlayCardEffects_text_card_019218bf-257b-722c-b331-7ef913bc0a12",
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
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect3, { DefineFn: DefineFn2, GameStateFn: GameStateFn2, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn2.EffectFn.getCardID(effect3);\n                const prototype2 = GameStateFn2.getItemPrototype(ctx3, cardId2);\n                const from = GameStateFn2.getItemBaSyou(ctx3, cardId2);\n                ctx3 = GameStateFn2.moveItem(ctx3, DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u3044\\u308B\\u30AB\\u30FC\\u30C9\"), [cardId2, from]);\n                if (prototype2.category == \"\\u30E6\\u30CB\\u30C3\\u30C8\") {\n                  return GameStateFn2.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn2.EffectFn.getPlayerID(effect3), DefineFn2.EffectFn.getCardID(effect3)],\n                    description: effect3.text.description,\n                    text: {\n                      id: effect3.text.id,\n                      description: effect3.text.description,\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect4, { DefineFn: DefineFn3, GameStateFn: GameStateFn3 }) {\n                                const cardId3 = DefineFn3.EffectFn.getCardID(effect4);\n                                const from2 = GameStateFn3.getItemBaSyou(ctx4, cardId3);\n                                const to = DefineFn3.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\");\n                                ctx4 = GameStateFn3.moveItem(ctx4, to, [cardId3, from2], GameStateFn3.onMoveItem);\n                                const hasHigh = GameStateFn3.getCardHasSpeicalEffect(ctx4, [\"\\u6226\\u95D8\\u914D\\u5099\"], cardId3);\n                                const hasPS = GameStateFn3.getCardHasSpeicalEffect(ctx4, [\"PS\\u88C5\\u7532\"], cardId3);\n                                const isNoNeedRoll = hasHigh || hasPS;\n                                const isRoll = isNoNeedRoll == false;\n                                ctx4 = GameStateFn3.setItemIsRoll(ctx4, isRoll, [cardId3, to]);\n                                return ctx4;\n                              }.toString()\n                            }\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30AD\\u30E3\\u30E9\\u30AF\\u30BF\\u30FC\" || prototype2.category == \"\\u30AA\\u30DA\\u30EC\\u30FC\\u30B7\\u30E7\\u30F3(\\u30E6\\u30CB\\u30C3\\u30C8)\") {\n                  return GameStateFn2.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn2.EffectFn.getPlayerID(effect3), DefineFn2.EffectFn.getCardID(effect3)],\n                    description: effect3.text.description,\n                    text: {\n                      id: effect3.text.id,\n                      description: effect3.text.description,\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect4, { DefineFn: DefineFn3, GameStateFn: GameStateFn3 }) {\n                                const cardId3 = DefineFn3.EffectFn.getCardID(effect4);\n                                const pairs = GameStateFn3.getCardTipStrBaSyouPairs(ctx4, \"unitForSet\", cardId3);\n                                const [targetCardId, targetBasyou] = pairs[0];\n                                const from2 = GameStateFn3.getItemBaSyou(ctx4, cardId3);\n                                const to = targetBasyou;\n                                ctx4 = GameStateFn3.moveItem(ctx4, to, [cardId3, from2], GameStateFn3.onMoveItem);\n                                ctx4 = GameStateFn3.setSetGroupLink(ctx4, targetCardId, cardId3);\n                                return ctx4;\n                              }.toString()\n                            }\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30B3\\u30DE\\u30F3\\u30C9\" && prototype2.commandText) {\n                  return GameStateFn2.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn2.EffectFn.getPlayerID(effect3), DefineFn2.EffectFn.getCardID(effect3)],\n                    description: effect3.text.description,\n                    text: {\n                      id: prototype2.commandText.id,\n                      description: prototype2.commandText.description,\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect4, { DefineFn: DefineFn3, GameStateFn: GameStateFn3 }) {\n                                const cardId3 = DefineFn3.EffectFn.getCardID(effect4);\n                                const from2 = GameStateFn3.getItemBaSyou(ctx4, cardId3);\n                                const to = DefineFn3.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u30B8\\u30E3\\u30F3\\u30AF\\u30E4\\u30FC\\u30C9\");\n                                ctx4 = GameStateFn3.moveItem(ctx4, to, [cardId3, from2], GameStateFn3.onMoveItem);\n                                return ctx4;\n                              }.toString()\n                            },\n                            ...prototype2.commandText.logicTreeActions?.[0].actions || []\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30B0\\u30E9\\u30D5\\u30A3\\u30C3\\u30AF\") {\n                  const cardId3 = DefineFn2.EffectFn.getCardID(effect3);\n                  const from2 = GameStateFn2.getItemBaSyou(ctx3, cardId3);\n                  const to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"G\\u30BE\\u30FC\\u30F3\");\n                  return GameStateFn2.moveItem(ctx3, to, [cardId3, from2], GameStateFn2.onMoveItem);\n                }\n                if (prototype2.category == \"\\u30AA\\u30DA\\u30EC\\u30FC\\u30B7\\u30E7\\u30F3\") {\n                  const cardId3 = DefineFn2.EffectFn.getCardID(effect3);\n                  const from2 = GameStateFn2.getItemBaSyou(ctx3, cardId3);\n                  const to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\");\n                  return GameStateFn2.moveItem(ctx3, to, [cardId3, from2], GameStateFn2.onMoveItem);\n                }\n                if (prototype2.category == \"ACE\") {\n                  throw new Error(`not support category: ${prototype2.category}`);\n                }\n                return ctx3;\n              }"
                                }
                            ]
                        }
                    ]
                }
            },
            {
                "id": "getPlayCardEffects_card_019218bf-257b-722c-b332-a10c5bce702b",
                "reason": [
                    "PlayCard",
                    "PlayerA",
                    "card_019218bf-257b-722c-b332-a10c5bce702b"
                ],
                "description": "從手中即將出牌, 出牌後會產生場出的效果",
                "text": {
                    "id": "getPlayCardEffects_text_card_019218bf-257b-722c-b332-a10c5bce702b",
                    "title": [],
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
                                    "title": "function _(ctx3, effect3, { DefineFn: DefineFn2, GameStateFn: GameStateFn2, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn2.EffectFn.getCardID(effect3);\n                const prototype2 = GameStateFn2.getItemPrototype(ctx3, cardId2);\n                const from = GameStateFn2.getItemBaSyou(ctx3, cardId2);\n                ctx3 = GameStateFn2.moveItem(ctx3, DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u3044\\u308B\\u30AB\\u30FC\\u30C9\"), [cardId2, from]);\n                if (prototype2.category == \"\\u30E6\\u30CB\\u30C3\\u30C8\") {\n                  return GameStateFn2.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn2.EffectFn.getPlayerID(effect3), DefineFn2.EffectFn.getCardID(effect3)],\n                    description: effect3.text.description,\n                    text: {\n                      id: effect3.text.id,\n                      description: effect3.text.description,\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect4, { DefineFn: DefineFn3, GameStateFn: GameStateFn3 }) {\n                                const cardId3 = DefineFn3.EffectFn.getCardID(effect4);\n                                const from2 = GameStateFn3.getItemBaSyou(ctx4, cardId3);\n                                const to = DefineFn3.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\");\n                                ctx4 = GameStateFn3.moveItem(ctx4, to, [cardId3, from2], GameStateFn3.onMoveItem);\n                                const hasHigh = GameStateFn3.getCardHasSpeicalEffect(ctx4, [\"\\u6226\\u95D8\\u914D\\u5099\"], cardId3);\n                                const hasPS = GameStateFn3.getCardHasSpeicalEffect(ctx4, [\"PS\\u88C5\\u7532\"], cardId3);\n                                const isNoNeedRoll = hasHigh || hasPS;\n                                const isRoll = isNoNeedRoll == false;\n                                ctx4 = GameStateFn3.setItemIsRoll(ctx4, isRoll, [cardId3, to]);\n                                return ctx4;\n                              }.toString()\n                            }\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30AD\\u30E3\\u30E9\\u30AF\\u30BF\\u30FC\" || prototype2.category == \"\\u30AA\\u30DA\\u30EC\\u30FC\\u30B7\\u30E7\\u30F3(\\u30E6\\u30CB\\u30C3\\u30C8)\") {\n                  return GameStateFn2.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn2.EffectFn.getPlayerID(effect3), DefineFn2.EffectFn.getCardID(effect3)],\n                    description: effect3.text.description,\n                    text: {\n                      id: effect3.text.id,\n                      description: effect3.text.description,\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect4, { DefineFn: DefineFn3, GameStateFn: GameStateFn3 }) {\n                                const cardId3 = DefineFn3.EffectFn.getCardID(effect4);\n                                const pairs = GameStateFn3.getCardTipStrBaSyouPairs(ctx4, \"unitForSet\", cardId3);\n                                const [targetCardId, targetBasyou] = pairs[0];\n                                const from2 = GameStateFn3.getItemBaSyou(ctx4, cardId3);\n                                const to = targetBasyou;\n                                ctx4 = GameStateFn3.moveItem(ctx4, to, [cardId3, from2], GameStateFn3.onMoveItem);\n                                ctx4 = GameStateFn3.setSetGroupLink(ctx4, targetCardId, cardId3);\n                                return ctx4;\n                              }.toString()\n                            }\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30B3\\u30DE\\u30F3\\u30C9\" && prototype2.commandText) {\n                  return GameStateFn2.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn2.EffectFn.getPlayerID(effect3), DefineFn2.EffectFn.getCardID(effect3)],\n                    description: effect3.text.description,\n                    text: {\n                      id: prototype2.commandText.id,\n                      description: prototype2.commandText.description,\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect4, { DefineFn: DefineFn3, GameStateFn: GameStateFn3 }) {\n                                const cardId3 = DefineFn3.EffectFn.getCardID(effect4);\n                                const from2 = GameStateFn3.getItemBaSyou(ctx4, cardId3);\n                                const to = DefineFn3.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u30B8\\u30E3\\u30F3\\u30AF\\u30E4\\u30FC\\u30C9\");\n                                ctx4 = GameStateFn3.moveItem(ctx4, to, [cardId3, from2], GameStateFn3.onMoveItem);\n                                return ctx4;\n                              }.toString()\n                            },\n                            ...prototype2.commandText.logicTreeActions?.[0].actions || []\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30B0\\u30E9\\u30D5\\u30A3\\u30C3\\u30AF\") {\n                  const cardId3 = DefineFn2.EffectFn.getCardID(effect3);\n                  const from2 = GameStateFn2.getItemBaSyou(ctx3, cardId3);\n                  const to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"G\\u30BE\\u30FC\\u30F3\");\n                  return GameStateFn2.moveItem(ctx3, to, [cardId3, from2], GameStateFn2.onMoveItem);\n                }\n                if (prototype2.category == \"\\u30AA\\u30DA\\u30EC\\u30FC\\u30B7\\u30E7\\u30F3\") {\n                  const cardId3 = DefineFn2.EffectFn.getCardID(effect3);\n                  const from2 = GameStateFn2.getItemBaSyou(ctx3, cardId3);\n                  const to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\");\n                  return GameStateFn2.moveItem(ctx3, to, [cardId3, from2], GameStateFn2.onMoveItem);\n                }\n                if (prototype2.category == \"ACE\") {\n                  throw new Error(`not support category: ${prototype2.category}`);\n                }\n                return ctx3;\n              }"
                                }
                            ]
                        }
                    ]
                }
            },
            {
                "id": "getPlayCardEffects_card_019218bf-257b-722c-b332-8b297b2bb768",
                "reason": [
                    "PlayCard",
                    "PlayerA",
                    "card_019218bf-257b-722c-b332-8b297b2bb768"
                ],
                "description": "從手中即將出牌, 出牌後會產生場出的效果",
                "text": {
                    "id": "getPlayCardEffects_text_card_019218bf-257b-722c-b332-8b297b2bb768",
                    "title": [],
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
                                    "title": "function _(ctx3, effect3, { DefineFn: DefineFn2, GameStateFn: GameStateFn2, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn2.EffectFn.getCardID(effect3);\n                const prototype2 = GameStateFn2.getItemPrototype(ctx3, cardId2);\n                const from = GameStateFn2.getItemBaSyou(ctx3, cardId2);\n                ctx3 = GameStateFn2.moveItem(ctx3, DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u3044\\u308B\\u30AB\\u30FC\\u30C9\"), [cardId2, from]);\n                if (prototype2.category == \"\\u30E6\\u30CB\\u30C3\\u30C8\") {\n                  return GameStateFn2.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn2.EffectFn.getPlayerID(effect3), DefineFn2.EffectFn.getCardID(effect3)],\n                    description: effect3.text.description,\n                    text: {\n                      id: effect3.text.id,\n                      description: effect3.text.description,\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect4, { DefineFn: DefineFn3, GameStateFn: GameStateFn3 }) {\n                                const cardId3 = DefineFn3.EffectFn.getCardID(effect4);\n                                const from2 = GameStateFn3.getItemBaSyou(ctx4, cardId3);\n                                const to = DefineFn3.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\");\n                                ctx4 = GameStateFn3.moveItem(ctx4, to, [cardId3, from2], GameStateFn3.onMoveItem);\n                                const hasHigh = GameStateFn3.getCardHasSpeicalEffect(ctx4, [\"\\u6226\\u95D8\\u914D\\u5099\"], cardId3);\n                                const hasPS = GameStateFn3.getCardHasSpeicalEffect(ctx4, [\"PS\\u88C5\\u7532\"], cardId3);\n                                const isNoNeedRoll = hasHigh || hasPS;\n                                const isRoll = isNoNeedRoll == false;\n                                ctx4 = GameStateFn3.setItemIsRoll(ctx4, isRoll, [cardId3, to]);\n                                return ctx4;\n                              }.toString()\n                            }\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30AD\\u30E3\\u30E9\\u30AF\\u30BF\\u30FC\" || prototype2.category == \"\\u30AA\\u30DA\\u30EC\\u30FC\\u30B7\\u30E7\\u30F3(\\u30E6\\u30CB\\u30C3\\u30C8)\") {\n                  return GameStateFn2.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn2.EffectFn.getPlayerID(effect3), DefineFn2.EffectFn.getCardID(effect3)],\n                    description: effect3.text.description,\n                    text: {\n                      id: effect3.text.id,\n                      description: effect3.text.description,\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect4, { DefineFn: DefineFn3, GameStateFn: GameStateFn3 }) {\n                                const cardId3 = DefineFn3.EffectFn.getCardID(effect4);\n                                const pairs = GameStateFn3.getCardTipStrBaSyouPairs(ctx4, \"unitForSet\", cardId3);\n                                const [targetCardId, targetBasyou] = pairs[0];\n                                const from2 = GameStateFn3.getItemBaSyou(ctx4, cardId3);\n                                const to = targetBasyou;\n                                ctx4 = GameStateFn3.moveItem(ctx4, to, [cardId3, from2], GameStateFn3.onMoveItem);\n                                ctx4 = GameStateFn3.setSetGroupLink(ctx4, targetCardId, cardId3);\n                                return ctx4;\n                              }.toString()\n                            }\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30B3\\u30DE\\u30F3\\u30C9\" && prototype2.commandText) {\n                  return GameStateFn2.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn2.EffectFn.getPlayerID(effect3), DefineFn2.EffectFn.getCardID(effect3)],\n                    description: effect3.text.description,\n                    text: {\n                      id: prototype2.commandText.id,\n                      description: prototype2.commandText.description,\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect4, { DefineFn: DefineFn3, GameStateFn: GameStateFn3 }) {\n                                const cardId3 = DefineFn3.EffectFn.getCardID(effect4);\n                                const from2 = GameStateFn3.getItemBaSyou(ctx4, cardId3);\n                                const to = DefineFn3.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u30B8\\u30E3\\u30F3\\u30AF\\u30E4\\u30FC\\u30C9\");\n                                ctx4 = GameStateFn3.moveItem(ctx4, to, [cardId3, from2], GameStateFn3.onMoveItem);\n                                return ctx4;\n                              }.toString()\n                            },\n                            ...prototype2.commandText.logicTreeActions?.[0].actions || []\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30B0\\u30E9\\u30D5\\u30A3\\u30C3\\u30AF\") {\n                  const cardId3 = DefineFn2.EffectFn.getCardID(effect3);\n                  const from2 = GameStateFn2.getItemBaSyou(ctx3, cardId3);\n                  const to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"G\\u30BE\\u30FC\\u30F3\");\n                  return GameStateFn2.moveItem(ctx3, to, [cardId3, from2], GameStateFn2.onMoveItem);\n                }\n                if (prototype2.category == \"\\u30AA\\u30DA\\u30EC\\u30FC\\u30B7\\u30E7\\u30F3\") {\n                  const cardId3 = DefineFn2.EffectFn.getCardID(effect3);\n                  const from2 = GameStateFn2.getItemBaSyou(ctx3, cardId3);\n                  const to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\");\n                  return GameStateFn2.moveItem(ctx3, to, [cardId3, from2], GameStateFn2.onMoveItem);\n                }\n                if (prototype2.category == \"ACE\") {\n                  throw new Error(`not support category: ${prototype2.category}`);\n                }\n                return ctx3;\n              }"
                                }
                            ]
                        }
                    ]
                }
            },
            {
                "id": "getPlayCardEffects_card_019218bf-257b-722c-b332-c7ea64f1db07",
                "reason": [
                    "PlayCard",
                    "PlayerB",
                    "card_019218bf-257b-722c-b332-c7ea64f1db07"
                ],
                "description": "從手中即將出牌, 出牌後會產生場出的效果",
                "text": {
                    "id": "getPlayCardEffects_text_card_019218bf-257b-722c-b332-c7ea64f1db07",
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
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect3, { DefineFn: DefineFn2, GameStateFn: GameStateFn2, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn2.EffectFn.getCardID(effect3);\n                const prototype2 = GameStateFn2.getItemPrototype(ctx3, cardId2);\n                const from = GameStateFn2.getItemBaSyou(ctx3, cardId2);\n                ctx3 = GameStateFn2.moveItem(ctx3, DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u3044\\u308B\\u30AB\\u30FC\\u30C9\"), [cardId2, from]);\n                if (prototype2.category == \"\\u30E6\\u30CB\\u30C3\\u30C8\") {\n                  return GameStateFn2.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn2.EffectFn.getPlayerID(effect3), DefineFn2.EffectFn.getCardID(effect3)],\n                    description: effect3.text.description,\n                    text: {\n                      id: effect3.text.id,\n                      description: effect3.text.description,\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect4, { DefineFn: DefineFn3, GameStateFn: GameStateFn3 }) {\n                                const cardId3 = DefineFn3.EffectFn.getCardID(effect4);\n                                const from2 = GameStateFn3.getItemBaSyou(ctx4, cardId3);\n                                const to = DefineFn3.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\");\n                                ctx4 = GameStateFn3.moveItem(ctx4, to, [cardId3, from2], GameStateFn3.onMoveItem);\n                                const hasHigh = GameStateFn3.getCardHasSpeicalEffect(ctx4, [\"\\u6226\\u95D8\\u914D\\u5099\"], cardId3);\n                                const hasPS = GameStateFn3.getCardHasSpeicalEffect(ctx4, [\"PS\\u88C5\\u7532\"], cardId3);\n                                const isNoNeedRoll = hasHigh || hasPS;\n                                const isRoll = isNoNeedRoll == false;\n                                ctx4 = GameStateFn3.setItemIsRoll(ctx4, isRoll, [cardId3, to]);\n                                return ctx4;\n                              }.toString()\n                            }\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30AD\\u30E3\\u30E9\\u30AF\\u30BF\\u30FC\" || prototype2.category == \"\\u30AA\\u30DA\\u30EC\\u30FC\\u30B7\\u30E7\\u30F3(\\u30E6\\u30CB\\u30C3\\u30C8)\") {\n                  return GameStateFn2.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn2.EffectFn.getPlayerID(effect3), DefineFn2.EffectFn.getCardID(effect3)],\n                    description: effect3.text.description,\n                    text: {\n                      id: effect3.text.id,\n                      description: effect3.text.description,\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect4, { DefineFn: DefineFn3, GameStateFn: GameStateFn3 }) {\n                                const cardId3 = DefineFn3.EffectFn.getCardID(effect4);\n                                const pairs = GameStateFn3.getCardTipStrBaSyouPairs(ctx4, \"unitForSet\", cardId3);\n                                const [targetCardId, targetBasyou] = pairs[0];\n                                const from2 = GameStateFn3.getItemBaSyou(ctx4, cardId3);\n                                const to = targetBasyou;\n                                ctx4 = GameStateFn3.moveItem(ctx4, to, [cardId3, from2], GameStateFn3.onMoveItem);\n                                ctx4 = GameStateFn3.setSetGroupLink(ctx4, targetCardId, cardId3);\n                                return ctx4;\n                              }.toString()\n                            }\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30B3\\u30DE\\u30F3\\u30C9\" && prototype2.commandText) {\n                  return GameStateFn2.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn2.EffectFn.getPlayerID(effect3), DefineFn2.EffectFn.getCardID(effect3)],\n                    description: effect3.text.description,\n                    text: {\n                      id: prototype2.commandText.id,\n                      description: prototype2.commandText.description,\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect4, { DefineFn: DefineFn3, GameStateFn: GameStateFn3 }) {\n                                const cardId3 = DefineFn3.EffectFn.getCardID(effect4);\n                                const from2 = GameStateFn3.getItemBaSyou(ctx4, cardId3);\n                                const to = DefineFn3.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u30B8\\u30E3\\u30F3\\u30AF\\u30E4\\u30FC\\u30C9\");\n                                ctx4 = GameStateFn3.moveItem(ctx4, to, [cardId3, from2], GameStateFn3.onMoveItem);\n                                return ctx4;\n                              }.toString()\n                            },\n                            ...prototype2.commandText.logicTreeActions?.[0].actions || []\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30B0\\u30E9\\u30D5\\u30A3\\u30C3\\u30AF\") {\n                  const cardId3 = DefineFn2.EffectFn.getCardID(effect3);\n                  const from2 = GameStateFn2.getItemBaSyou(ctx3, cardId3);\n                  const to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"G\\u30BE\\u30FC\\u30F3\");\n                  return GameStateFn2.moveItem(ctx3, to, [cardId3, from2], GameStateFn2.onMoveItem);\n                }\n                if (prototype2.category == \"\\u30AA\\u30DA\\u30EC\\u30FC\\u30B7\\u30E7\\u30F3\") {\n                  const cardId3 = DefineFn2.EffectFn.getCardID(effect3);\n                  const from2 = GameStateFn2.getItemBaSyou(ctx3, cardId3);\n                  const to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\");\n                  return GameStateFn2.moveItem(ctx3, to, [cardId3, from2], GameStateFn2.onMoveItem);\n                }\n                if (prototype2.category == \"ACE\") {\n                  throw new Error(`not support category: ${prototype2.category}`);\n                }\n                return ctx3;\n              }"
                                }
                            ]
                        }
                    ]
                }
            },
            {
                "id": "getPlayCardEffects_card_019218bf-257b-722c-b333-6c1aa00a5275",
                "reason": [
                    "PlayCard",
                    "PlayerB",
                    "card_019218bf-257b-722c-b333-6c1aa00a5275"
                ],
                "description": "從手中即將出牌, 出牌後會產生場出的效果",
                "text": {
                    "id": "getPlayCardEffects_text_card_019218bf-257b-722c-b333-6c1aa00a5275",
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
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect3, { DefineFn: DefineFn2, GameStateFn: GameStateFn2, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn2.EffectFn.getCardID(effect3);\n                const prototype2 = GameStateFn2.getItemPrototype(ctx3, cardId2);\n                const from = GameStateFn2.getItemBaSyou(ctx3, cardId2);\n                ctx3 = GameStateFn2.moveItem(ctx3, DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u3044\\u308B\\u30AB\\u30FC\\u30C9\"), [cardId2, from]);\n                if (prototype2.category == \"\\u30E6\\u30CB\\u30C3\\u30C8\") {\n                  return GameStateFn2.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn2.EffectFn.getPlayerID(effect3), DefineFn2.EffectFn.getCardID(effect3)],\n                    description: effect3.text.description,\n                    text: {\n                      id: effect3.text.id,\n                      description: effect3.text.description,\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect4, { DefineFn: DefineFn3, GameStateFn: GameStateFn3 }) {\n                                const cardId3 = DefineFn3.EffectFn.getCardID(effect4);\n                                const from2 = GameStateFn3.getItemBaSyou(ctx4, cardId3);\n                                const to = DefineFn3.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\");\n                                ctx4 = GameStateFn3.moveItem(ctx4, to, [cardId3, from2], GameStateFn3.onMoveItem);\n                                const hasHigh = GameStateFn3.getCardHasSpeicalEffect(ctx4, [\"\\u6226\\u95D8\\u914D\\u5099\"], cardId3);\n                                const hasPS = GameStateFn3.getCardHasSpeicalEffect(ctx4, [\"PS\\u88C5\\u7532\"], cardId3);\n                                const isNoNeedRoll = hasHigh || hasPS;\n                                const isRoll = isNoNeedRoll == false;\n                                ctx4 = GameStateFn3.setItemIsRoll(ctx4, isRoll, [cardId3, to]);\n                                return ctx4;\n                              }.toString()\n                            }\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30AD\\u30E3\\u30E9\\u30AF\\u30BF\\u30FC\" || prototype2.category == \"\\u30AA\\u30DA\\u30EC\\u30FC\\u30B7\\u30E7\\u30F3(\\u30E6\\u30CB\\u30C3\\u30C8)\") {\n                  return GameStateFn2.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn2.EffectFn.getPlayerID(effect3), DefineFn2.EffectFn.getCardID(effect3)],\n                    description: effect3.text.description,\n                    text: {\n                      id: effect3.text.id,\n                      description: effect3.text.description,\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect4, { DefineFn: DefineFn3, GameStateFn: GameStateFn3 }) {\n                                const cardId3 = DefineFn3.EffectFn.getCardID(effect4);\n                                const pairs = GameStateFn3.getCardTipStrBaSyouPairs(ctx4, \"unitForSet\", cardId3);\n                                const [targetCardId, targetBasyou] = pairs[0];\n                                const from2 = GameStateFn3.getItemBaSyou(ctx4, cardId3);\n                                const to = targetBasyou;\n                                ctx4 = GameStateFn3.moveItem(ctx4, to, [cardId3, from2], GameStateFn3.onMoveItem);\n                                ctx4 = GameStateFn3.setSetGroupLink(ctx4, targetCardId, cardId3);\n                                return ctx4;\n                              }.toString()\n                            }\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30B3\\u30DE\\u30F3\\u30C9\" && prototype2.commandText) {\n                  return GameStateFn2.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn2.EffectFn.getPlayerID(effect3), DefineFn2.EffectFn.getCardID(effect3)],\n                    description: effect3.text.description,\n                    text: {\n                      id: prototype2.commandText.id,\n                      description: prototype2.commandText.description,\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect4, { DefineFn: DefineFn3, GameStateFn: GameStateFn3 }) {\n                                const cardId3 = DefineFn3.EffectFn.getCardID(effect4);\n                                const from2 = GameStateFn3.getItemBaSyou(ctx4, cardId3);\n                                const to = DefineFn3.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u30B8\\u30E3\\u30F3\\u30AF\\u30E4\\u30FC\\u30C9\");\n                                ctx4 = GameStateFn3.moveItem(ctx4, to, [cardId3, from2], GameStateFn3.onMoveItem);\n                                return ctx4;\n                              }.toString()\n                            },\n                            ...prototype2.commandText.logicTreeActions?.[0].actions || []\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30B0\\u30E9\\u30D5\\u30A3\\u30C3\\u30AF\") {\n                  const cardId3 = DefineFn2.EffectFn.getCardID(effect3);\n                  const from2 = GameStateFn2.getItemBaSyou(ctx3, cardId3);\n                  const to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"G\\u30BE\\u30FC\\u30F3\");\n                  return GameStateFn2.moveItem(ctx3, to, [cardId3, from2], GameStateFn2.onMoveItem);\n                }\n                if (prototype2.category == \"\\u30AA\\u30DA\\u30EC\\u30FC\\u30B7\\u30E7\\u30F3\") {\n                  const cardId3 = DefineFn2.EffectFn.getCardID(effect3);\n                  const from2 = GameStateFn2.getItemBaSyou(ctx3, cardId3);\n                  const to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\");\n                  return GameStateFn2.moveItem(ctx3, to, [cardId3, from2], GameStateFn2.onMoveItem);\n                }\n                if (prototype2.category == \"ACE\") {\n                  throw new Error(`not support category: ${prototype2.category}`);\n                }\n                return ctx3;\n              }"
                                }
                            ]
                        }
                    ]
                }
            },
            {
                "id": "getPlayCardEffects_card_019218bf-257b-722c-b334-1a7ee2d399a1",
                "reason": [
                    "PlayCard",
                    "PlayerB",
                    "card_019218bf-257b-722c-b334-1a7ee2d399a1"
                ],
                "description": "從手中即將出牌, 出牌後會產生場出的效果",
                "text": {
                    "id": "getPlayCardEffects_text_card_019218bf-257b-722c-b334-1a7ee2d399a1",
                    "title": [],
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
                                    "title": "function _(ctx3, effect3, { DefineFn: DefineFn2, GameStateFn: GameStateFn2, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn2.EffectFn.getCardID(effect3);\n                const prototype2 = GameStateFn2.getItemPrototype(ctx3, cardId2);\n                const from = GameStateFn2.getItemBaSyou(ctx3, cardId2);\n                ctx3 = GameStateFn2.moveItem(ctx3, DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u3044\\u308B\\u30AB\\u30FC\\u30C9\"), [cardId2, from]);\n                if (prototype2.category == \"\\u30E6\\u30CB\\u30C3\\u30C8\") {\n                  return GameStateFn2.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn2.EffectFn.getPlayerID(effect3), DefineFn2.EffectFn.getCardID(effect3)],\n                    description: effect3.text.description,\n                    text: {\n                      id: effect3.text.id,\n                      description: effect3.text.description,\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect4, { DefineFn: DefineFn3, GameStateFn: GameStateFn3 }) {\n                                const cardId3 = DefineFn3.EffectFn.getCardID(effect4);\n                                const from2 = GameStateFn3.getItemBaSyou(ctx4, cardId3);\n                                const to = DefineFn3.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\");\n                                ctx4 = GameStateFn3.moveItem(ctx4, to, [cardId3, from2], GameStateFn3.onMoveItem);\n                                const hasHigh = GameStateFn3.getCardHasSpeicalEffect(ctx4, [\"\\u6226\\u95D8\\u914D\\u5099\"], cardId3);\n                                const hasPS = GameStateFn3.getCardHasSpeicalEffect(ctx4, [\"PS\\u88C5\\u7532\"], cardId3);\n                                const isNoNeedRoll = hasHigh || hasPS;\n                                const isRoll = isNoNeedRoll == false;\n                                ctx4 = GameStateFn3.setItemIsRoll(ctx4, isRoll, [cardId3, to]);\n                                return ctx4;\n                              }.toString()\n                            }\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30AD\\u30E3\\u30E9\\u30AF\\u30BF\\u30FC\" || prototype2.category == \"\\u30AA\\u30DA\\u30EC\\u30FC\\u30B7\\u30E7\\u30F3(\\u30E6\\u30CB\\u30C3\\u30C8)\") {\n                  return GameStateFn2.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn2.EffectFn.getPlayerID(effect3), DefineFn2.EffectFn.getCardID(effect3)],\n                    description: effect3.text.description,\n                    text: {\n                      id: effect3.text.id,\n                      description: effect3.text.description,\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect4, { DefineFn: DefineFn3, GameStateFn: GameStateFn3 }) {\n                                const cardId3 = DefineFn3.EffectFn.getCardID(effect4);\n                                const pairs = GameStateFn3.getCardTipStrBaSyouPairs(ctx4, \"unitForSet\", cardId3);\n                                const [targetCardId, targetBasyou] = pairs[0];\n                                const from2 = GameStateFn3.getItemBaSyou(ctx4, cardId3);\n                                const to = targetBasyou;\n                                ctx4 = GameStateFn3.moveItem(ctx4, to, [cardId3, from2], GameStateFn3.onMoveItem);\n                                ctx4 = GameStateFn3.setSetGroupLink(ctx4, targetCardId, cardId3);\n                                return ctx4;\n                              }.toString()\n                            }\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30B3\\u30DE\\u30F3\\u30C9\" && prototype2.commandText) {\n                  return GameStateFn2.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn2.EffectFn.getPlayerID(effect3), DefineFn2.EffectFn.getCardID(effect3)],\n                    description: effect3.text.description,\n                    text: {\n                      id: prototype2.commandText.id,\n                      description: prototype2.commandText.description,\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect4, { DefineFn: DefineFn3, GameStateFn: GameStateFn3 }) {\n                                const cardId3 = DefineFn3.EffectFn.getCardID(effect4);\n                                const from2 = GameStateFn3.getItemBaSyou(ctx4, cardId3);\n                                const to = DefineFn3.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u30B8\\u30E3\\u30F3\\u30AF\\u30E4\\u30FC\\u30C9\");\n                                ctx4 = GameStateFn3.moveItem(ctx4, to, [cardId3, from2], GameStateFn3.onMoveItem);\n                                return ctx4;\n                              }.toString()\n                            },\n                            ...prototype2.commandText.logicTreeActions?.[0].actions || []\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30B0\\u30E9\\u30D5\\u30A3\\u30C3\\u30AF\") {\n                  const cardId3 = DefineFn2.EffectFn.getCardID(effect3);\n                  const from2 = GameStateFn2.getItemBaSyou(ctx3, cardId3);\n                  const to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"G\\u30BE\\u30FC\\u30F3\");\n                  return GameStateFn2.moveItem(ctx3, to, [cardId3, from2], GameStateFn2.onMoveItem);\n                }\n                if (prototype2.category == \"\\u30AA\\u30DA\\u30EC\\u30FC\\u30B7\\u30E7\\u30F3\") {\n                  const cardId3 = DefineFn2.EffectFn.getCardID(effect3);\n                  const from2 = GameStateFn2.getItemBaSyou(ctx3, cardId3);\n                  const to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\");\n                  return GameStateFn2.moveItem(ctx3, to, [cardId3, from2], GameStateFn2.onMoveItem);\n                }\n                if (prototype2.category == \"ACE\") {\n                  throw new Error(`not support category: ${prototype2.category}`);\n                }\n                return ctx3;\n              }"
                                }
                            ]
                        }
                    ]
                }
            },
            {
                "id": "getPlayCardEffects_card_019218bf-257b-722c-b332-b88fdefd171a",
                "reason": [
                    "PlayCard",
                    "PlayerB",
                    "card_019218bf-257b-722c-b332-b88fdefd171a"
                ],
                "description": "從手中即將出牌, 出牌後會產生場出的效果",
                "text": {
                    "id": "getPlayCardEffects_text_card_019218bf-257b-722c-b332-b88fdefd171a",
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
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect3, { DefineFn: DefineFn2, GameStateFn: GameStateFn2, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn2.EffectFn.getCardID(effect3);\n                const prototype2 = GameStateFn2.getItemPrototype(ctx3, cardId2);\n                const from = GameStateFn2.getItemBaSyou(ctx3, cardId2);\n                ctx3 = GameStateFn2.moveItem(ctx3, DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u3044\\u308B\\u30AB\\u30FC\\u30C9\"), [cardId2, from]);\n                if (prototype2.category == \"\\u30E6\\u30CB\\u30C3\\u30C8\") {\n                  return GameStateFn2.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn2.EffectFn.getPlayerID(effect3), DefineFn2.EffectFn.getCardID(effect3)],\n                    description: effect3.text.description,\n                    text: {\n                      id: effect3.text.id,\n                      description: effect3.text.description,\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect4, { DefineFn: DefineFn3, GameStateFn: GameStateFn3 }) {\n                                const cardId3 = DefineFn3.EffectFn.getCardID(effect4);\n                                const from2 = GameStateFn3.getItemBaSyou(ctx4, cardId3);\n                                const to = DefineFn3.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\");\n                                ctx4 = GameStateFn3.moveItem(ctx4, to, [cardId3, from2], GameStateFn3.onMoveItem);\n                                const hasHigh = GameStateFn3.getCardHasSpeicalEffect(ctx4, [\"\\u6226\\u95D8\\u914D\\u5099\"], cardId3);\n                                const hasPS = GameStateFn3.getCardHasSpeicalEffect(ctx4, [\"PS\\u88C5\\u7532\"], cardId3);\n                                const isNoNeedRoll = hasHigh || hasPS;\n                                const isRoll = isNoNeedRoll == false;\n                                ctx4 = GameStateFn3.setItemIsRoll(ctx4, isRoll, [cardId3, to]);\n                                return ctx4;\n                              }.toString()\n                            }\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30AD\\u30E3\\u30E9\\u30AF\\u30BF\\u30FC\" || prototype2.category == \"\\u30AA\\u30DA\\u30EC\\u30FC\\u30B7\\u30E7\\u30F3(\\u30E6\\u30CB\\u30C3\\u30C8)\") {\n                  return GameStateFn2.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn2.EffectFn.getPlayerID(effect3), DefineFn2.EffectFn.getCardID(effect3)],\n                    description: effect3.text.description,\n                    text: {\n                      id: effect3.text.id,\n                      description: effect3.text.description,\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect4, { DefineFn: DefineFn3, GameStateFn: GameStateFn3 }) {\n                                const cardId3 = DefineFn3.EffectFn.getCardID(effect4);\n                                const pairs = GameStateFn3.getCardTipStrBaSyouPairs(ctx4, \"unitForSet\", cardId3);\n                                const [targetCardId, targetBasyou] = pairs[0];\n                                const from2 = GameStateFn3.getItemBaSyou(ctx4, cardId3);\n                                const to = targetBasyou;\n                                ctx4 = GameStateFn3.moveItem(ctx4, to, [cardId3, from2], GameStateFn3.onMoveItem);\n                                ctx4 = GameStateFn3.setSetGroupLink(ctx4, targetCardId, cardId3);\n                                return ctx4;\n                              }.toString()\n                            }\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30B3\\u30DE\\u30F3\\u30C9\" && prototype2.commandText) {\n                  return GameStateFn2.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn2.EffectFn.getPlayerID(effect3), DefineFn2.EffectFn.getCardID(effect3)],\n                    description: effect3.text.description,\n                    text: {\n                      id: prototype2.commandText.id,\n                      description: prototype2.commandText.description,\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect4, { DefineFn: DefineFn3, GameStateFn: GameStateFn3 }) {\n                                const cardId3 = DefineFn3.EffectFn.getCardID(effect4);\n                                const from2 = GameStateFn3.getItemBaSyou(ctx4, cardId3);\n                                const to = DefineFn3.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u30B8\\u30E3\\u30F3\\u30AF\\u30E4\\u30FC\\u30C9\");\n                                ctx4 = GameStateFn3.moveItem(ctx4, to, [cardId3, from2], GameStateFn3.onMoveItem);\n                                return ctx4;\n                              }.toString()\n                            },\n                            ...prototype2.commandText.logicTreeActions?.[0].actions || []\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30B0\\u30E9\\u30D5\\u30A3\\u30C3\\u30AF\") {\n                  const cardId3 = DefineFn2.EffectFn.getCardID(effect3);\n                  const from2 = GameStateFn2.getItemBaSyou(ctx3, cardId3);\n                  const to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"G\\u30BE\\u30FC\\u30F3\");\n                  return GameStateFn2.moveItem(ctx3, to, [cardId3, from2], GameStateFn2.onMoveItem);\n                }\n                if (prototype2.category == \"\\u30AA\\u30DA\\u30EC\\u30FC\\u30B7\\u30E7\\u30F3\") {\n                  const cardId3 = DefineFn2.EffectFn.getCardID(effect3);\n                  const from2 = GameStateFn2.getItemBaSyou(ctx3, cardId3);\n                  const to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\");\n                  return GameStateFn2.moveItem(ctx3, to, [cardId3, from2], GameStateFn2.onMoveItem);\n                }\n                if (prototype2.category == \"ACE\") {\n                  throw new Error(`not support category: ${prototype2.category}`);\n                }\n                return ctx3;\n              }"
                                }
                            ]
                        }
                    ]
                }
            },
            {
                "id": "getPlayCardEffects_card_019218bf-257b-722c-b333-4f385b739b52",
                "reason": [
                    "PlayCard",
                    "PlayerB",
                    "card_019218bf-257b-722c-b333-4f385b739b52"
                ],
                "description": "從手中即將出牌, 出牌後會產生場出的效果",
                "text": {
                    "id": "getPlayCardEffects_text_card_019218bf-257b-722c-b333-4f385b739b52",
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
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect3, { DefineFn: DefineFn2, GameStateFn: GameStateFn2, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn2.EffectFn.getCardID(effect3);\n                const prototype2 = GameStateFn2.getItemPrototype(ctx3, cardId2);\n                const from = GameStateFn2.getItemBaSyou(ctx3, cardId2);\n                ctx3 = GameStateFn2.moveItem(ctx3, DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u3044\\u308B\\u30AB\\u30FC\\u30C9\"), [cardId2, from]);\n                if (prototype2.category == \"\\u30E6\\u30CB\\u30C3\\u30C8\") {\n                  return GameStateFn2.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn2.EffectFn.getPlayerID(effect3), DefineFn2.EffectFn.getCardID(effect3)],\n                    description: effect3.text.description,\n                    text: {\n                      id: effect3.text.id,\n                      description: effect3.text.description,\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect4, { DefineFn: DefineFn3, GameStateFn: GameStateFn3 }) {\n                                const cardId3 = DefineFn3.EffectFn.getCardID(effect4);\n                                const from2 = GameStateFn3.getItemBaSyou(ctx4, cardId3);\n                                const to = DefineFn3.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\");\n                                ctx4 = GameStateFn3.moveItem(ctx4, to, [cardId3, from2], GameStateFn3.onMoveItem);\n                                const hasHigh = GameStateFn3.getCardHasSpeicalEffect(ctx4, [\"\\u6226\\u95D8\\u914D\\u5099\"], cardId3);\n                                const hasPS = GameStateFn3.getCardHasSpeicalEffect(ctx4, [\"PS\\u88C5\\u7532\"], cardId3);\n                                const isNoNeedRoll = hasHigh || hasPS;\n                                const isRoll = isNoNeedRoll == false;\n                                ctx4 = GameStateFn3.setItemIsRoll(ctx4, isRoll, [cardId3, to]);\n                                return ctx4;\n                              }.toString()\n                            }\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30AD\\u30E3\\u30E9\\u30AF\\u30BF\\u30FC\" || prototype2.category == \"\\u30AA\\u30DA\\u30EC\\u30FC\\u30B7\\u30E7\\u30F3(\\u30E6\\u30CB\\u30C3\\u30C8)\") {\n                  return GameStateFn2.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn2.EffectFn.getPlayerID(effect3), DefineFn2.EffectFn.getCardID(effect3)],\n                    description: effect3.text.description,\n                    text: {\n                      id: effect3.text.id,\n                      description: effect3.text.description,\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect4, { DefineFn: DefineFn3, GameStateFn: GameStateFn3 }) {\n                                const cardId3 = DefineFn3.EffectFn.getCardID(effect4);\n                                const pairs = GameStateFn3.getCardTipStrBaSyouPairs(ctx4, \"unitForSet\", cardId3);\n                                const [targetCardId, targetBasyou] = pairs[0];\n                                const from2 = GameStateFn3.getItemBaSyou(ctx4, cardId3);\n                                const to = targetBasyou;\n                                ctx4 = GameStateFn3.moveItem(ctx4, to, [cardId3, from2], GameStateFn3.onMoveItem);\n                                ctx4 = GameStateFn3.setSetGroupLink(ctx4, targetCardId, cardId3);\n                                return ctx4;\n                              }.toString()\n                            }\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30B3\\u30DE\\u30F3\\u30C9\" && prototype2.commandText) {\n                  return GameStateFn2.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn2.EffectFn.getPlayerID(effect3), DefineFn2.EffectFn.getCardID(effect3)],\n                    description: effect3.text.description,\n                    text: {\n                      id: prototype2.commandText.id,\n                      description: prototype2.commandText.description,\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect4, { DefineFn: DefineFn3, GameStateFn: GameStateFn3 }) {\n                                const cardId3 = DefineFn3.EffectFn.getCardID(effect4);\n                                const from2 = GameStateFn3.getItemBaSyou(ctx4, cardId3);\n                                const to = DefineFn3.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u30B8\\u30E3\\u30F3\\u30AF\\u30E4\\u30FC\\u30C9\");\n                                ctx4 = GameStateFn3.moveItem(ctx4, to, [cardId3, from2], GameStateFn3.onMoveItem);\n                                return ctx4;\n                              }.toString()\n                            },\n                            ...prototype2.commandText.logicTreeActions?.[0].actions || []\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30B0\\u30E9\\u30D5\\u30A3\\u30C3\\u30AF\") {\n                  const cardId3 = DefineFn2.EffectFn.getCardID(effect3);\n                  const from2 = GameStateFn2.getItemBaSyou(ctx3, cardId3);\n                  const to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"G\\u30BE\\u30FC\\u30F3\");\n                  return GameStateFn2.moveItem(ctx3, to, [cardId3, from2], GameStateFn2.onMoveItem);\n                }\n                if (prototype2.category == \"\\u30AA\\u30DA\\u30EC\\u30FC\\u30B7\\u30E7\\u30F3\") {\n                  const cardId3 = DefineFn2.EffectFn.getCardID(effect3);\n                  const from2 = GameStateFn2.getItemBaSyou(ctx3, cardId3);\n                  const to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\");\n                  return GameStateFn2.moveItem(ctx3, to, [cardId3, from2], GameStateFn2.onMoveItem);\n                }\n                if (prototype2.category == \"ACE\") {\n                  throw new Error(`not support category: ${prototype2.category}`);\n                }\n                return ctx3;\n              }"
                                }
                            ]
                        }
                    ]
                }
            },
            {
                "id": "getPlayCardEffects_card_019218bf-257b-722c-b332-d4d2f043ce19",
                "reason": [
                    "PlayCard",
                    "PlayerB",
                    "card_019218bf-257b-722c-b332-d4d2f043ce19"
                ],
                "description": "從手中即將出牌, 出牌後會產生場出的效果",
                "text": {
                    "id": "getPlayCardEffects_text_card_019218bf-257b-722c-b332-d4d2f043ce19",
                    "title": [],
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
                        }
                    },
                    "logicTreeActions": [
                        {
                            "actions": [
                                {
                                    "title": "function _(ctx3, effect3, { DefineFn: DefineFn2, GameStateFn: GameStateFn2, ToolFn: ToolFn2 }) {\n                const cardId2 = DefineFn2.EffectFn.getCardID(effect3);\n                const prototype2 = GameStateFn2.getItemPrototype(ctx3, cardId2);\n                const from = GameStateFn2.getItemBaSyou(ctx3, cardId2);\n                ctx3 = GameStateFn2.moveItem(ctx3, DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from, \"\\u30D7\\u30EC\\u30A4\\u3055\\u308C\\u3066\\u3044\\u308B\\u30AB\\u30FC\\u30C9\"), [cardId2, from]);\n                if (prototype2.category == \"\\u30E6\\u30CB\\u30C3\\u30C8\") {\n                  return GameStateFn2.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn2.EffectFn.getPlayerID(effect3), DefineFn2.EffectFn.getCardID(effect3)],\n                    description: effect3.text.description,\n                    text: {\n                      id: effect3.text.id,\n                      description: effect3.text.description,\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect4, { DefineFn: DefineFn3, GameStateFn: GameStateFn3 }) {\n                                const cardId3 = DefineFn3.EffectFn.getCardID(effect4);\n                                const from2 = GameStateFn3.getItemBaSyou(ctx4, cardId3);\n                                const to = DefineFn3.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\");\n                                ctx4 = GameStateFn3.moveItem(ctx4, to, [cardId3, from2], GameStateFn3.onMoveItem);\n                                const hasHigh = GameStateFn3.getCardHasSpeicalEffect(ctx4, [\"\\u6226\\u95D8\\u914D\\u5099\"], cardId3);\n                                const hasPS = GameStateFn3.getCardHasSpeicalEffect(ctx4, [\"PS\\u88C5\\u7532\"], cardId3);\n                                const isNoNeedRoll = hasHigh || hasPS;\n                                const isRoll = isNoNeedRoll == false;\n                                ctx4 = GameStateFn3.setItemIsRoll(ctx4, isRoll, [cardId3, to]);\n                                return ctx4;\n                              }.toString()\n                            }\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30AD\\u30E3\\u30E9\\u30AF\\u30BF\\u30FC\" || prototype2.category == \"\\u30AA\\u30DA\\u30EC\\u30FC\\u30B7\\u30E7\\u30F3(\\u30E6\\u30CB\\u30C3\\u30C8)\") {\n                  return GameStateFn2.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn2.EffectFn.getPlayerID(effect3), DefineFn2.EffectFn.getCardID(effect3)],\n                    description: effect3.text.description,\n                    text: {\n                      id: effect3.text.id,\n                      description: effect3.text.description,\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect4, { DefineFn: DefineFn3, GameStateFn: GameStateFn3 }) {\n                                const cardId3 = DefineFn3.EffectFn.getCardID(effect4);\n                                const pairs = GameStateFn3.getCardTipStrBaSyouPairs(ctx4, \"unitForSet\", cardId3);\n                                const [targetCardId, targetBasyou] = pairs[0];\n                                const from2 = GameStateFn3.getItemBaSyou(ctx4, cardId3);\n                                const to = targetBasyou;\n                                ctx4 = GameStateFn3.moveItem(ctx4, to, [cardId3, from2], GameStateFn3.onMoveItem);\n                                ctx4 = GameStateFn3.setSetGroupLink(ctx4, targetCardId, cardId3);\n                                return ctx4;\n                              }.toString()\n                            }\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30B3\\u30DE\\u30F3\\u30C9\" && prototype2.commandText) {\n                  return GameStateFn2.addStackEffect(ctx3, {\n                    id: ToolFn2.getUUID(\"getPlayCardEffects\"),\n                    reason: [\"\\u5834\\u306B\\u51FA\\u308B\", DefineFn2.EffectFn.getPlayerID(effect3), DefineFn2.EffectFn.getCardID(effect3)],\n                    description: effect3.text.description,\n                    text: {\n                      id: prototype2.commandText.id,\n                      description: prototype2.commandText.description,\n                      title: [],\n                      logicTreeActions: [\n                        {\n                          actions: [\n                            {\n                              title: function _(ctx4, effect4, { DefineFn: DefineFn3, GameStateFn: GameStateFn3 }) {\n                                const cardId3 = DefineFn3.EffectFn.getCardID(effect4);\n                                const from2 = GameStateFn3.getItemBaSyou(ctx4, cardId3);\n                                const to = DefineFn3.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u30B8\\u30E3\\u30F3\\u30AF\\u30E4\\u30FC\\u30C9\");\n                                ctx4 = GameStateFn3.moveItem(ctx4, to, [cardId3, from2], GameStateFn3.onMoveItem);\n                                return ctx4;\n                              }.toString()\n                            },\n                            ...prototype2.commandText.logicTreeActions?.[0].actions || []\n                          ]\n                        }\n                      ]\n                    }\n                  });\n                }\n                if (prototype2.category == \"\\u30B0\\u30E9\\u30D5\\u30A3\\u30C3\\u30AF\") {\n                  const cardId3 = DefineFn2.EffectFn.getCardID(effect3);\n                  const from2 = GameStateFn2.getItemBaSyou(ctx3, cardId3);\n                  const to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"G\\u30BE\\u30FC\\u30F3\");\n                  return GameStateFn2.moveItem(ctx3, to, [cardId3, from2], GameStateFn2.onMoveItem);\n                }\n                if (prototype2.category == \"\\u30AA\\u30DA\\u30EC\\u30FC\\u30B7\\u30E7\\u30F3\") {\n                  const cardId3 = DefineFn2.EffectFn.getCardID(effect3);\n                  const from2 = GameStateFn2.getItemBaSyou(ctx3, cardId3);\n                  const to = DefineFn2.AbsoluteBaSyouFn.setBaSyouKeyword(from2, \"\\u914D\\u5099\\u30A8\\u30EA\\u30A2\");\n                  return GameStateFn2.moveItem(ctx3, to, [cardId3, from2], GameStateFn2.onMoveItem);\n                }\n                if (prototype2.category == \"ACE\") {\n                  throw new Error(`not support category: ${prototype2.category}`);\n                }\n                return ctx3;\n              }"
                                }
                            ]
                        }
                    ]
                }
            }
        ],
        "destroyEffect": [],
        "card_019218bf-257b-722c-b331-2a7f417c2811": {
            "id": "card_019218bf-257b-722c-b331-2a7f417c2811",
            "protoID": "179015_04B_O_BK010C_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "card_019218bf-257b-722c-b331-33d95e4b6f6a": {
            "id": "card_019218bf-257b-722c-b331-33d95e4b6f6a",
            "protoID": "179015_04B_O_BK010C_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "card_019218bf-257b-722c-b331-3fbd6e8363fe": {
            "id": "card_019218bf-257b-722c-b331-3fbd6e8363fe",
            "protoID": "179015_04B_U_BK058R_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "card_019218bf-257b-722c-b331-4035fbd4ae4c": {
            "id": "card_019218bf-257b-722c-b331-4035fbd4ae4c",
            "protoID": "179015_04B_U_BK058R_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "card_019218bf-257b-722c-b331-48e00f0a1ffd": {
            "id": "card_019218bf-257b-722c-b331-48e00f0a1ffd",
            "protoID": "179015_04B_U_BK059C_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "card_019218bf-257b-722c-b331-53130727f10f": {
            "id": "card_019218bf-257b-722c-b331-53130727f10f",
            "protoID": "179015_04B_U_BK059C_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "card_019218bf-257b-722c-b331-5ee9a60d0d74": {
            "id": "card_019218bf-257b-722c-b331-5ee9a60d0d74",
            "protoID": "179015_04B_U_BK061C_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "card_019218bf-257b-722c-b331-65a0de404053": {
            "id": "card_019218bf-257b-722c-b331-65a0de404053",
            "protoID": "179015_04B_U_BK061C_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "card_019218bf-257b-722c-b331-68f17727d364": {
            "id": "card_019218bf-257b-722c-b331-68f17727d364",
            "protoID": "179016_04B_U_BK066C_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "card_019218bf-257b-722c-b331-7212b3463e8c": {
            "id": "card_019218bf-257b-722c-b331-7212b3463e8c",
            "protoID": "179016_04B_U_BK066C_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "card_019218bf-257b-722c-b331-7ef913bc0a12": {
            "id": "card_019218bf-257b-722c-b331-7ef913bc0a12",
            "protoID": "179019_02A_C_BK015S_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "card_019218bf-257b-722c-b331-815b8eebd43e": {
            "id": "card_019218bf-257b-722c-b331-815b8eebd43e",
            "protoID": "179019_02A_C_BK015S_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "card_019218bf-257b-722c-b331-8b811f916eeb": {
            "id": "card_019218bf-257b-722c-b331-8b811f916eeb",
            "protoID": "179020_05C_U_BK100U_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "card_019218bf-257b-722c-b331-97af356da49a": {
            "id": "card_019218bf-257b-722c-b331-97af356da49a",
            "protoID": "179020_05C_U_BK100U_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "card_019218bf-257b-722c-b331-9ac72451e5f2": {
            "id": "card_019218bf-257b-722c-b331-9ac72451e5f2",
            "protoID": "179023_06C_C_BK048R_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "card_019218bf-257b-722c-b331-a1791dd972fe": {
            "id": "card_019218bf-257b-722c-b331-a1791dd972fe",
            "protoID": "179023_06C_C_BK048R_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "card_019218bf-257b-722c-b331-aa3708e31bc6": {
            "id": "card_019218bf-257b-722c-b331-aa3708e31bc6",
            "protoID": "179023_06C_C_BK049U_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "card_019218bf-257b-722c-b331-b19de4df264a": {
            "id": "card_019218bf-257b-722c-b331-b19de4df264a",
            "protoID": "179023_06C_C_BK049U_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "card_019218bf-257b-722c-b331-befcce3aeffc": {
            "id": "card_019218bf-257b-722c-b331-befcce3aeffc",
            "protoID": "179024_04B_C_BK027U_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "card_019218bf-257b-722c-b331-c4c8fbbbc3e3": {
            "id": "card_019218bf-257b-722c-b331-c4c8fbbbc3e3",
            "protoID": "179024_04B_C_BK027U_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "card_019218bf-257b-722c-b331-ca0a7547c3c2": {
            "id": "card_019218bf-257b-722c-b331-ca0a7547c3c2",
            "protoID": "179024_04B_U_BK060C_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "card_019218bf-257b-722c-b331-d038d1955735": {
            "id": "card_019218bf-257b-722c-b331-d038d1955735",
            "protoID": "179024_04B_U_BK060C_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "card_019218bf-257b-722c-b331-df204e5c6489": {
            "id": "card_019218bf-257b-722c-b331-df204e5c6489",
            "protoID": "179024_04B_U_BK067C_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "card_019218bf-257b-722c-b331-e5fad9f78c42": {
            "id": "card_019218bf-257b-722c-b331-e5fad9f78c42",
            "protoID": "179024_04B_U_BK067C_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "card_019218bf-257b-722c-b331-e9f14c53f2b8": {
            "id": "card_019218bf-257b-722c-b331-e9f14c53f2b8",
            "protoID": "179024_B2B_C_BK054C_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "card_019218bf-257b-722c-b331-f074952cc34c": {
            "id": "card_019218bf-257b-722c-b331-f074952cc34c",
            "protoID": "179024_B2B_C_BK054C_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "card_019218bf-257b-722c-b331-fd440e0f144a": {
            "id": "card_019218bf-257b-722c-b331-fd440e0f144a",
            "protoID": "179024_B2B_U_BK128S_black_02",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "card_019218bf-257b-722c-b332-074de9dc146d": {
            "id": "card_019218bf-257b-722c-b332-074de9dc146d",
            "protoID": "179024_B2B_U_BK128S_black_02",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "card_019218bf-257b-722c-b332-0e14a1e91176": {
            "id": "card_019218bf-257b-722c-b332-0e14a1e91176",
            "protoID": "179024_B2B_U_BK129R_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "card_019218bf-257b-722c-b332-15fc0638967f": {
            "id": "card_019218bf-257b-722c-b332-15fc0638967f",
            "protoID": "179024_B2B_U_BK129R_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "card_019218bf-257b-722c-b332-1d815fa3e0e1": {
            "id": "card_019218bf-257b-722c-b332-1d815fa3e0e1",
            "protoID": "179027_09D_C_BK063R_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "card_019218bf-257b-722c-b332-21fb0787e3b9": {
            "id": "card_019218bf-257b-722c-b332-21fb0787e3b9",
            "protoID": "179027_09D_C_BK063R_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "card_019218bf-257b-722c-b332-282d62695751": {
            "id": "card_019218bf-257b-722c-b332-282d62695751",
            "protoID": "179027_09D_O_BK010N_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "card_019218bf-257b-722c-b332-36c67d29afcc": {
            "id": "card_019218bf-257b-722c-b332-36c67d29afcc",
            "protoID": "179027_09D_O_BK010N_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "card_019218bf-257b-722c-b332-383edb86da05": {
            "id": "card_019218bf-257b-722c-b332-383edb86da05",
            "protoID": "179027_09D_U_BK163S_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "card_019218bf-257b-722c-b332-44ca40bf3ba0": {
            "id": "card_019218bf-257b-722c-b332-44ca40bf3ba0",
            "protoID": "179027_09D_U_BK163S_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "card_019218bf-257b-722c-b332-4b5e808a40d7": {
            "id": "card_019218bf-257b-722c-b332-4b5e808a40d7",
            "protoID": "179027_09D_U_BK163S_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "card_019218bf-257b-722c-b332-50d14e4d844b": {
            "id": "card_019218bf-257b-722c-b332-50d14e4d844b",
            "protoID": "179029_06C_C_BK045U_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "card_019218bf-257b-722c-b332-5ea2d95501b4": {
            "id": "card_019218bf-257b-722c-b332-5ea2d95501b4",
            "protoID": "179029_06C_C_BK045U_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "card_019218bf-257b-722c-b332-638e3c4c056d": {
            "id": "card_019218bf-257b-722c-b332-638e3c4c056d",
            "protoID": "179029_B3C_C_BK071N_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "card_019218bf-257b-722c-b332-6fce8bb64576": {
            "id": "card_019218bf-257b-722c-b332-6fce8bb64576",
            "protoID": "179029_B3C_C_BK071N_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "card_019218bf-257b-722c-b332-711ac7f038bc": {
            "id": "card_019218bf-257b-722c-b332-711ac7f038bc",
            "protoID": "179029_B3C_U_BK184N_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "card_019218bf-257b-722c-b332-7acdd1645786": {
            "id": "card_019218bf-257b-722c-b332-7acdd1645786",
            "protoID": "179029_B3C_U_BK184N_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "card_019218bf-257b-722c-b332-87067c39fbe5": {
            "id": "card_019218bf-257b-722c-b332-87067c39fbe5",
            "protoID": "179029_B3C_U_BK184N_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "card_019218bf-257b-722c-b332-8b297b2bb768": {
            "id": "card_019218bf-257b-722c-b332-8b297b2bb768",
            "protoID": "179029_B3C_U_BK185N_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "card_019218bf-257b-722c-b332-93d2bae78ef0": {
            "id": "card_019218bf-257b-722c-b332-93d2bae78ef0",
            "protoID": "179029_B3C_U_BK185N_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "card_019218bf-257b-722c-b332-99f879db3ad3": {
            "id": "card_019218bf-257b-722c-b332-99f879db3ad3",
            "protoID": "179030_11E_U_BK194S_2_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "card_019218bf-257b-722c-b332-a10c5bce702b": {
            "id": "card_019218bf-257b-722c-b332-a10c5bce702b",
            "protoID": "179030_11E_U_BK194S_2_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "card_019218bf-257b-722c-b332-aa41eba12a30": {
            "id": "card_019218bf-257b-722c-b332-aa41eba12a30",
            "protoID": "179030_11E_U_BK194S_2_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "card_019218bf-257b-722c-b332-b7a1c554cc1d": {
            "id": "card_019218bf-257b-722c-b332-b7a1c554cc1d",
            "protoID": "179901_B2B_C_BK005P_black",
            "ownerID": "PlayerA",
            "isFaceDown": true
        },
        "card_019218bf-257b-722c-b332-b88fdefd171a": {
            "id": "card_019218bf-257b-722c-b332-b88fdefd171a",
            "protoID": "179015_04B_O_BK010C_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "card_019218bf-257b-722c-b332-c7ea64f1db07": {
            "id": "card_019218bf-257b-722c-b332-c7ea64f1db07",
            "protoID": "179015_04B_O_BK010C_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "card_019218bf-257b-722c-b332-c917d87eb9e2": {
            "id": "card_019218bf-257b-722c-b332-c917d87eb9e2",
            "protoID": "179015_04B_U_BK058R_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "card_019218bf-257b-722c-b332-d4d2f043ce19": {
            "id": "card_019218bf-257b-722c-b332-d4d2f043ce19",
            "protoID": "179015_04B_U_BK058R_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "card_019218bf-257b-722c-b332-d82b9d21aa39": {
            "id": "card_019218bf-257b-722c-b332-d82b9d21aa39",
            "protoID": "179015_04B_U_BK059C_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "card_019218bf-257b-722c-b332-e0a8a5265596": {
            "id": "card_019218bf-257b-722c-b332-e0a8a5265596",
            "protoID": "179015_04B_U_BK059C_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "card_019218bf-257b-722c-b332-e8d063230fb1": {
            "id": "card_019218bf-257b-722c-b332-e8d063230fb1",
            "protoID": "179015_04B_U_BK061C_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "card_019218bf-257b-722c-b332-f4a4436d7c38": {
            "id": "card_019218bf-257b-722c-b332-f4a4436d7c38",
            "protoID": "179015_04B_U_BK061C_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "card_019218bf-257b-722c-b332-f85a5a9fdcd7": {
            "id": "card_019218bf-257b-722c-b332-f85a5a9fdcd7",
            "protoID": "179016_04B_U_BK066C_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "card_019218bf-257b-722c-b333-0778858dcc98": {
            "id": "card_019218bf-257b-722c-b333-0778858dcc98",
            "protoID": "179016_04B_U_BK066C_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "card_019218bf-257b-722c-b333-0ab9ab6e6d91": {
            "id": "card_019218bf-257b-722c-b333-0ab9ab6e6d91",
            "protoID": "179019_02A_C_BK015S_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "card_019218bf-257b-722c-b333-1353f272277c": {
            "id": "card_019218bf-257b-722c-b333-1353f272277c",
            "protoID": "179019_02A_C_BK015S_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "card_019218bf-257b-722c-b333-1ae8665ecab1": {
            "id": "card_019218bf-257b-722c-b333-1ae8665ecab1",
            "protoID": "179020_05C_U_BK100U_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "card_019218bf-257b-722c-b333-2286b9fcc9dc": {
            "id": "card_019218bf-257b-722c-b333-2286b9fcc9dc",
            "protoID": "179020_05C_U_BK100U_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "card_019218bf-257b-722c-b333-28d1738393d0": {
            "id": "card_019218bf-257b-722c-b333-28d1738393d0",
            "protoID": "179023_06C_C_BK048R_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "card_019218bf-257b-722c-b333-30eeeaabab70": {
            "id": "card_019218bf-257b-722c-b333-30eeeaabab70",
            "protoID": "179023_06C_C_BK048R_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "card_019218bf-257b-722c-b333-3c8be4839498": {
            "id": "card_019218bf-257b-722c-b333-3c8be4839498",
            "protoID": "179023_06C_C_BK049U_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "card_019218bf-257b-722c-b333-432678ecc4b3": {
            "id": "card_019218bf-257b-722c-b333-432678ecc4b3",
            "protoID": "179023_06C_C_BK049U_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "card_019218bf-257b-722c-b333-4f385b739b52": {
            "id": "card_019218bf-257b-722c-b333-4f385b739b52",
            "protoID": "179024_04B_C_BK027U_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "card_019218bf-257b-722c-b333-52596ad3174c": {
            "id": "card_019218bf-257b-722c-b333-52596ad3174c",
            "protoID": "179024_04B_C_BK027U_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "card_019218bf-257b-722c-b333-5c7cfe240a41": {
            "id": "card_019218bf-257b-722c-b333-5c7cfe240a41",
            "protoID": "179024_04B_U_BK060C_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "card_019218bf-257b-722c-b333-64ceb78d0685": {
            "id": "card_019218bf-257b-722c-b333-64ceb78d0685",
            "protoID": "179024_04B_U_BK060C_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "card_019218bf-257b-722c-b333-6c1aa00a5275": {
            "id": "card_019218bf-257b-722c-b333-6c1aa00a5275",
            "protoID": "179024_04B_U_BK067C_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "card_019218bf-257b-722c-b333-7558cd6e6c54": {
            "id": "card_019218bf-257b-722c-b333-7558cd6e6c54",
            "protoID": "179024_04B_U_BK067C_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "card_019218bf-257b-722c-b333-7882bdccc71a": {
            "id": "card_019218bf-257b-722c-b333-7882bdccc71a",
            "protoID": "179024_B2B_C_BK054C_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "card_019218bf-257b-722c-b333-83e1b3e8fb82": {
            "id": "card_019218bf-257b-722c-b333-83e1b3e8fb82",
            "protoID": "179024_B2B_C_BK054C_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "card_019218bf-257b-722c-b333-883dd59b067f": {
            "id": "card_019218bf-257b-722c-b333-883dd59b067f",
            "protoID": "179024_B2B_U_BK128S_black_02",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "card_019218bf-257b-722c-b333-95803ab59a74": {
            "id": "card_019218bf-257b-722c-b333-95803ab59a74",
            "protoID": "179024_B2B_U_BK128S_black_02",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "card_019218bf-257b-722c-b333-9e815b27daa7": {
            "id": "card_019218bf-257b-722c-b333-9e815b27daa7",
            "protoID": "179024_B2B_U_BK129R_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "card_019218bf-257b-722c-b333-a15d0bd74a88": {
            "id": "card_019218bf-257b-722c-b333-a15d0bd74a88",
            "protoID": "179024_B2B_U_BK129R_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "card_019218bf-257b-722c-b333-ac4c938fd1b1": {
            "id": "card_019218bf-257b-722c-b333-ac4c938fd1b1",
            "protoID": "179027_09D_C_BK063R_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "card_019218bf-257b-722c-b333-b210ab6fe556": {
            "id": "card_019218bf-257b-722c-b333-b210ab6fe556",
            "protoID": "179027_09D_C_BK063R_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "card_019218bf-257b-722c-b333-bcd0e8942584": {
            "id": "card_019218bf-257b-722c-b333-bcd0e8942584",
            "protoID": "179027_09D_O_BK010N_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "card_019218bf-257b-722c-b333-c2f04e2a2d11": {
            "id": "card_019218bf-257b-722c-b333-c2f04e2a2d11",
            "protoID": "179027_09D_O_BK010N_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "card_019218bf-257b-722c-b333-cc54781ec1d8": {
            "id": "card_019218bf-257b-722c-b333-cc54781ec1d8",
            "protoID": "179027_09D_U_BK163S_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "card_019218bf-257b-722c-b333-d21ee5bf2d56": {
            "id": "card_019218bf-257b-722c-b333-d21ee5bf2d56",
            "protoID": "179027_09D_U_BK163S_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "card_019218bf-257b-722c-b333-dbae405907fe": {
            "id": "card_019218bf-257b-722c-b333-dbae405907fe",
            "protoID": "179027_09D_U_BK163S_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "card_019218bf-257b-722c-b333-e6f568b13746": {
            "id": "card_019218bf-257b-722c-b333-e6f568b13746",
            "protoID": "179029_06C_C_BK045U_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "card_019218bf-257b-722c-b333-eb0937384faa": {
            "id": "card_019218bf-257b-722c-b333-eb0937384faa",
            "protoID": "179029_06C_C_BK045U_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "card_019218bf-257b-722c-b333-f14f7e6d7cdf": {
            "id": "card_019218bf-257b-722c-b333-f14f7e6d7cdf",
            "protoID": "179029_B3C_C_BK071N_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "card_019218bf-257b-722c-b333-fa2458f62776": {
            "id": "card_019218bf-257b-722c-b333-fa2458f62776",
            "protoID": "179029_B3C_C_BK071N_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "card_019218bf-257b-722c-b334-00f8c69ab51b": {
            "id": "card_019218bf-257b-722c-b334-00f8c69ab51b",
            "protoID": "179029_B3C_U_BK184N_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "card_019218bf-257b-722c-b334-0ed76d1bfd81": {
            "id": "card_019218bf-257b-722c-b334-0ed76d1bfd81",
            "protoID": "179029_B3C_U_BK184N_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "card_019218bf-257b-722c-b334-15d2f5f15336": {
            "id": "card_019218bf-257b-722c-b334-15d2f5f15336",
            "protoID": "179029_B3C_U_BK184N_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "card_019218bf-257b-722c-b334-1a7ee2d399a1": {
            "id": "card_019218bf-257b-722c-b334-1a7ee2d399a1",
            "protoID": "179029_B3C_U_BK185N_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "card_019218bf-257b-722c-b334-2097a350c888": {
            "id": "card_019218bf-257b-722c-b334-2097a350c888",
            "protoID": "179029_B3C_U_BK185N_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "card_019218bf-257b-722c-b334-2908567b0a18": {
            "id": "card_019218bf-257b-722c-b334-2908567b0a18",
            "protoID": "179030_11E_U_BK194S_2_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "card_019218bf-257b-722c-b334-357c694148af": {
            "id": "card_019218bf-257b-722c-b334-357c694148af",
            "protoID": "179030_11E_U_BK194S_2_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "card_019218bf-257b-722c-b334-380cf73d1b44": {
            "id": "card_019218bf-257b-722c-b334-380cf73d1b44",
            "protoID": "179030_11E_U_BK194S_2_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        },
        "card_019218bf-257b-722c-b334-47f077bb25a7": {
            "id": "card_019218bf-257b-722c-b334-47f077bb25a7",
            "protoID": "179901_B2B_C_BK005P_black",
            "ownerID": "PlayerB",
            "isFaceDown": true
        }
    }
    
    const cmds = getPlayerCommands(ctx, PlayerA)
    if(cmds.length != 7){
        throw new Error()
    }
    if(getPlayerCommandsFilterNoError(ctx, PlayerA).length != cmds.length){
        throw new Error()
    }
    if(getPlayerCommandsFilterNoErrorDistinct(ctx, PlayerA).length != cmds.length){
        throw new Error()
    }
}