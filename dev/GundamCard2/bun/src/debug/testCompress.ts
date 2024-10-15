import { AbsoluteBaSyouFn } from "../game/define/BaSyou"
import { TargetMissingError } from "../game/define/GameError"
import { PlayerA, PlayerB, PlayerIDFn } from "../game/define/PlayerID"
import { getActivePlayerID } from "../game/gameState/ActivePlayerComponent"
import { createCardWithProtoIds } from "../game/gameState/CardTableComponent"
import { GameState } from "../game/gameState/GameState"
import { getGlobalEffects, setGlobalEffects } from "../game/gameState/globalEffects"
import { getItemIdsByBasyou } from "../game/gameState/ItemTableComponent"
import { getPhase } from "../game/gameState/PhaseComponent"
import { createPlayerScore } from "../game/gameState/player"
import { thinkRandom, thinkVer1 } from "../game/gameStateWithFlowMemory/ai/thinkVer1"
import { applyFlow } from "../game/gameStateWithFlowMemory/applyFlow"
import { Flow } from "../game/gameStateWithFlowMemory/Flow"
import { createGameStateWithFlowMemory, initState, GameStateWithFlowMemory } from "../game/gameStateWithFlowMemory/GameStateWithFlowMemory"
import { queryFlow } from "../game/gameStateWithFlowMemory/queryFlow"
import { loadPrototype } from "../script"
import { logCategory } from "../tool/logger"
import { TableFns } from "../tool/table"

export async function testCompress() {
    let ctx = createGameStateWithFlowMemory()
    try {
        const DECK_GREEN_APU = ["179003_01A_C_GN003R_green", "179003_01A_CH_GN001R_green", "179003_01A_U_GN001R_green", "179003_01A_U_GN001R_green", "179003_01A_U_GN001R_green", "179003_01A_U_GN008R_green_02", "179003_01A_U_GN008R_green_02", "179003_01A_U_GN008R_green_02", "179007_02A_U_GN020R_green", "179009_03B_U_GN036U_green", "179009_03B_U_GN036U_green", "179009_03B_U_GN036U_green", "179009_03B_U_GN037C_green", "179009_03B_U_GN037C_green", "179009_03B_U_GN037C_green", "179009_03B_U_GN042R_green", "179009_03B_U_GN042R_green", "179009_03B_U_GN042R_green", "179015_04B_CH_GN030R_green", "179015_04B_U_GN053U_green", "179015_04B_U_GN055R_green_haku", "179015_04B_U_GN055R_green_haku", "179016_04B_CH_GN035R_green", "179016_04B_CH_GN036C_green", "179016_04B_CH_GN036C_green", "179018_05C_U_GN082U_green", "179019_02A_U_GN024U_green", "179019_02A_U_GN024U_green", "179019_02A_U_GN024U_green", "179024_B2B_C_GN052C_green", "179025_07D_C_GN056U_green", "179025_07D_CH_GN070C_green", "179029_05C_U_GN077R_green", "179030_11E_C_GN074R_green", "179030_11E_CH_GN093N_green", "179030_11E_CH_GN094R_green", "179030_11E_U_GN184N_green", "179030_11E_U_GN184N_green", "179030_11E_U_GN184N_green", "179031_12E_CH_GN096R_green", "179901_00_C_GN007P_green", "179901_00_C_GN007P_green", "179901_00_C_GN007P_green", "179901_00_U_GN001P_green_02", "179901_00_U_GN002P_green_02", "179901_CG_CH_GN001P_green", "179901_CG_U_GN003P_green", "179901_CG_U_GN003P_green", "179901_CG_U_GN008P_green", "179901_CG_U_GN008P_green"]
        const whiteSpeed = ["179001_01A_CH_WT007R_white", "179004_01A_CH_WT009R_white", "179004_01A_CH_WT010C_white", "179007_02A_U_WT027U_white", "179007_02A_U_WT027U_white", "179008_02A_U_WT034U_white", "179008_02A_U_WT034U_white", "179008_02A_U_WT034U_white", "179014_03B_CH_WT027R_white", "179015_04B_U_WT067C_white", "179015_04B_U_WT067C_white", "179015_04B_U_WT067C_white", "179016_04B_U_WT074C_white", "179016_04B_U_WT074C_white", "179016_04B_U_WT074C_white", "179016_04B_U_WT075C_white", "179016_04B_U_WT075C_white", "179016_04B_U_WT075C_white", "179019_01A_C_WT010C_white", "179019_01A_C_WT010C_white", "179019_02A_U_WT028R_white", "179019_02A_U_WT028R_white", "179022_06C_CH_WT057R_white", "179022_06C_CH_WT057R_white", "179022_06C_CH_WT057R_white", "179022_06C_U_WT113R_white", "179022_06C_U_WT113R_white", "179022_06C_U_WT113R_white", "179023_06C_CH_WT067C_white", "179024_03B_U_WT057U_white", "179024_03B_U_WT057U_white", "179025_07D_C_WT060U_white", "179025_07D_CH_WT075C_white", "179025_07D_CH_WT075C_white", "179025_07D_CH_WT075C_white", "179027_09D_C_WT067R_white", "179027_09D_C_WT067R_white", "179029_B3C_CH_WT102R_white", "179029_B3C_CH_WT103N_white", "179029_B3C_U_WT196R_white", "179030_11E_C_WT077S_white", "179030_11E_C_WT077S_white", "179030_11E_C_WT077S_white", "179030_11E_CH_WT108N_white", "179901_00_C_WT003P_white", "179901_00_C_WT003P_white", "179901_00_C_WT003P_white", "179901_CG_C_WT001P_white", "179901_CG_C_WT001P_white", "179901_CG_CH_WT002P_white"]
        const blackT3 = ["179015_04B_O_BK010C_black", "179015_04B_O_BK010C_black", "179015_04B_U_BK058R_black", "179015_04B_U_BK058R_black", "179015_04B_U_BK059C_black", "179015_04B_U_BK059C_black", "179015_04B_U_BK061C_black", "179015_04B_U_BK061C_black", "179016_04B_U_BK066C_black", "179016_04B_U_BK066C_black", "179019_02A_C_BK015S_black", "179019_02A_C_BK015S_black", "179020_05C_U_BK100U_black", "179020_05C_U_BK100U_black", "179023_06C_C_BK048R_black", "179023_06C_C_BK048R_black", "179023_06C_C_BK049U_black", "179023_06C_C_BK049U_black", "179024_04B_C_BK027U_black", "179024_04B_C_BK027U_black", "179024_04B_U_BK060C_black", "179024_04B_U_BK060C_black", "179024_04B_U_BK067C_black", "179024_04B_U_BK067C_black", "179024_B2B_C_BK054C_black", "179024_B2B_C_BK054C_black", "179024_B2B_U_BK128S_black_02", "179024_B2B_U_BK128S_black_02", "179024_B2B_U_BK129R_black", "179024_B2B_U_BK129R_black", "179027_09D_C_BK063R_black", "179027_09D_C_BK063R_black", "179027_09D_O_BK010N_black", "179027_09D_O_BK010N_black", "179027_09D_U_BK163S_black", "179027_09D_U_BK163S_black", "179027_09D_U_BK163S_black", "179029_06C_C_BK045U_black", "179029_06C_C_BK045U_black", "179029_B3C_C_BK071N_black", "179029_B3C_C_BK071N_black", "179029_B3C_U_BK184N_black", "179029_B3C_U_BK184N_black", "179029_B3C_U_BK184N_black", "179029_B3C_U_BK185N_black", "179029_B3C_U_BK185N_black", "179030_11E_U_BK194S_2_black", "179030_11E_U_BK194S_2_black", "179030_11E_U_BK194S_2_black", "179901_B2B_C_BK005P_black"]
        await Promise.all(blackT3.concat(whiteSpeed).concat(DECK_GREEN_APU).map(loadPrototype))
        ctx = initState(ctx, whiteSpeed, whiteSpeed)
        ctx = createCardWithProtoIds(ctx, AbsoluteBaSyouFn.of(PlayerA, "Gゾーン"), whiteSpeed.slice(0, 6)) as GameStateWithFlowMemory
        ctx = createCardWithProtoIds(ctx, AbsoluteBaSyouFn.of(PlayerB, "Gゾーン"), whiteSpeed.slice(0, 6)) as GameStateWithFlowMemory
        for (let i = 0; i < 6000; ++i) {
            const ges = getGlobalEffects(ctx, null)
            ctx = setGlobalEffects(ctx, null, ges) as GameStateWithFlowMemory
            const playAhp = getItemIdsByBasyou(ctx, AbsoluteBaSyouFn.of(PlayerA, "本国")).length
            const playBhp = getItemIdsByBasyou(ctx, AbsoluteBaSyouFn.of(PlayerB, "本国")).length
            logCategory("testCompress", `${i} > ${getPhase(ctx)} > ${getActivePlayerID(ctx)}`)
            logCategory("testCompress", `${i} > PlayerA Hp: ${playAhp}`)
            logCategory("testCompress", `${i} > PlayerA Score: ${createPlayerScore(ctx, PlayerA, { ges: ges })}`)
            logCategory("testCompress", `${i} > PlayerB Hp: ${playBhp}`)
            logCategory("testCompress", `${i} > PlayerB Score: ${createPlayerScore(ctx, PlayerB, { ges: ges })}`)
            logCategory("testCompress", `${i} > turn: ${ctx.turn}`)
            if (playAhp <= 0 || playBhp <= 0) {
                break
            }
            const playerId = PlayerIDFn.getAll()[Math.round(Math.random() * 1000) % 2]
            {
                const clickTime = Math.round(Math.random() * 1000) % 3
                for (let t = 0; t < clickTime; ++t) {
                    const flows = queryFlow(ctx, playerId)
                    if (flows.length) {
                        try {
                            let flow: Flow | null = thinkVer1(ctx, playerId, flows)
                            if (flow) {
                                logCategory("testCompress", "think", playerId, flow.id)
                            }
                            if (flow == null) {
                                flow = flows[Math.round(Math.random() * 1000) % flows.length]
                            }
                            ctx = applyFlow(ctx, playerId, flow)
                            TableFns.assertDup(ctx.table)
                        } catch (e) {
                            if (e instanceof TargetMissingError) {
                                logCategory("testCompress", e.message)
                            } else {
                                throw e
                            }
                        }
                    }
                }
            }
        }
    } catch (e) {
        //ctx.globalEffectPool = {}
        //await fs.writeFile('__gameState_bug.json', JSON.stringify(ctx));
        throw e
    }
}