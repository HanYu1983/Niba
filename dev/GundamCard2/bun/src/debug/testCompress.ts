import { AbsoluteBaSyouFn } from "../game/define/BaSyou"
import { TargetMissingError } from "../game/define/GameError"
import { PlayerA, PlayerB, PlayerIDFn } from "../game/define/PlayerID"
import { getActivePlayerID } from "../game/gameState/ActivePlayerComponent"
import { createCardWithProtoIds } from "../game/gameState/CardTableComponent"
import { getItemIdsByBasyou } from "../game/gameState/ItemTableComponent"
import { getPhase } from "../game/gameState/PhaseComponent"
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
      const whiteSpeed = ["179001_01A_CH_WT007R_white", "179004_01A_CH_WT009R_white", "179004_01A_CH_WT010C_white", "179007_02A_U_WT027U_white", "179007_02A_U_WT027U_white", "179008_02A_U_WT034U_white", "179008_02A_U_WT034U_white", "179008_02A_U_WT034U_white", "179014_03B_CH_WT027R_white", "179015_04B_U_WT067C_white", "179015_04B_U_WT067C_white", "179015_04B_U_WT067C_white", "179016_04B_U_WT074C_white", "179016_04B_U_WT074C_white", "179016_04B_U_WT074C_white", "179016_04B_U_WT075C_white", "179016_04B_U_WT075C_white", "179016_04B_U_WT075C_white", "179019_01A_C_WT010C_white", "179019_01A_C_WT010C_white", "179019_02A_U_WT028R_white", "179019_02A_U_WT028R_white", "179022_06C_CH_WT057R_white", "179022_06C_CH_WT057R_white", "179022_06C_CH_WT057R_white", "179022_06C_U_WT113R_white", "179022_06C_U_WT113R_white", "179022_06C_U_WT113R_white", "179023_06C_CH_WT067C_white", "179024_03B_U_WT057U_white", "179024_03B_U_WT057U_white", "179025_07D_C_WT060U_white", "179025_07D_CH_WT075C_white", "179025_07D_CH_WT075C_white", "179025_07D_CH_WT075C_white", "179027_09D_C_WT067R_white", "179027_09D_C_WT067R_white", "179029_B3C_CH_WT102R_white", "179029_B3C_CH_WT103N_white", "179029_B3C_U_WT196R_white", "179030_11E_C_WT077S_white", "179030_11E_C_WT077S_white", "179030_11E_C_WT077S_white", "179030_11E_CH_WT108N_white", "179901_00_C_WT003P_white", "179901_00_C_WT003P_white", "179901_00_C_WT003P_white", "179901_CG_C_WT001P_white", "179901_CG_C_WT001P_white", "179901_CG_CH_WT002P_white"]
      const blackT3 = ["179015_04B_O_BK010C_black", "179015_04B_O_BK010C_black", "179015_04B_U_BK058R_black", "179015_04B_U_BK058R_black", "179015_04B_U_BK059C_black", "179015_04B_U_BK059C_black", "179015_04B_U_BK061C_black", "179015_04B_U_BK061C_black", "179016_04B_U_BK066C_black", "179016_04B_U_BK066C_black", "179019_02A_C_BK015S_black", "179019_02A_C_BK015S_black", "179020_05C_U_BK100U_black", "179020_05C_U_BK100U_black", "179023_06C_C_BK048R_black", "179023_06C_C_BK048R_black", "179023_06C_C_BK049U_black", "179023_06C_C_BK049U_black", "179024_04B_C_BK027U_black", "179024_04B_C_BK027U_black", "179024_04B_U_BK060C_black", "179024_04B_U_BK060C_black", "179024_04B_U_BK067C_black", "179024_04B_U_BK067C_black", "179024_B2B_C_BK054C_black", "179024_B2B_C_BK054C_black", "179024_B2B_U_BK128S_black_02", "179024_B2B_U_BK128S_black_02", "179024_B2B_U_BK129R_black", "179024_B2B_U_BK129R_black", "179027_09D_C_BK063R_black", "179027_09D_C_BK063R_black", "179027_09D_O_BK010N_black", "179027_09D_O_BK010N_black", "179027_09D_U_BK163S_black", "179027_09D_U_BK163S_black", "179027_09D_U_BK163S_black", "179029_06C_C_BK045U_black", "179029_06C_C_BK045U_black", "179029_B3C_C_BK071N_black", "179029_B3C_C_BK071N_black", "179029_B3C_U_BK184N_black", "179029_B3C_U_BK184N_black", "179029_B3C_U_BK184N_black", "179029_B3C_U_BK185N_black", "179029_B3C_U_BK185N_black", "179030_11E_U_BK194S_2_black", "179030_11E_U_BK194S_2_black", "179030_11E_U_BK194S_2_black", "179901_B2B_C_BK005P_black"]
      await Promise.all(blackT3.concat(whiteSpeed).map(loadPrototype))
      ctx = initState(ctx, blackT3, blackT3)
      ctx = createCardWithProtoIds(ctx, AbsoluteBaSyouFn.of(PlayerA, "Gゾーン"), blackT3.slice(0, 6)) as GameStateWithFlowMemory
      ctx = createCardWithProtoIds(ctx, AbsoluteBaSyouFn.of(PlayerB, "Gゾーン"), blackT3.slice(0, 6)) as GameStateWithFlowMemory
      for (let i = 0; i < 1000; ++i) {
          logCategory("testCompress", `${i} > ${getPhase(ctx)} > ${getActivePlayerID(ctx)}`)
          logCategory("testCompress", `${i} > PlayerA: ${getItemIdsByBasyou(ctx, AbsoluteBaSyouFn.of(PlayerA, "本国")).length}`)
          logCategory("testCompress", `${i} > PlayerB: ${getItemIdsByBasyou(ctx, AbsoluteBaSyouFn.of(PlayerB, "本国")).length}`)
          logCategory("testCompress", `${i} > turn: ${ctx.turn}`)
          const playerId = PlayerIDFn.getAll()[Math.round(Math.random() * 1000) % 2]
          {
              const clickTime = Math.round(Math.random() * 1000) % 3
              for (let t = 0; t < clickTime; ++t) {
                  const flows = queryFlow(ctx, playerId)
                  if (flows.length) {
                      try {
                          let flow: Flow | null = null
                          // const aiChoiseList = flows.flatMap(flow => createAIChoiseList(ctx, flow))
                          // if (aiChoiseList.length > 0) {
                          //     aiChoiseList.sort((a, b) => b.weight - a.weight)
                          //     flow = aiChoiseList[0].flow
                          // }
                          // if (flow == null) {
                          //     flow = flows[0]
                          // }
                          flow = flows[Math.round(Math.random()*1000)%flows.length]
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