import { createBridge } from "../game/bridge/createBridge";
import { AbsoluteBaSyouFn } from "../game/define/BaSyou";
import { Card } from "../game/define/Card";
import { PlayerA, PlayerB } from "../game/define/PlayerID";
import { getBattleGroup, getBattleGroupBattlePoint, isBattleGroupHasA } from "../game/gameState/battleGroup";
import { addCards, createCardWithProtoIds } from "../game/gameState/CardTableComponent";
import { Flow } from "../game/gameStateWithFlowMemory/Flow";
import { loadPrototype } from "../script";
import { repeat } from "ramda";
import { getPlayerUnitIds } from "../game/gameState/player";
import { isMeleeUnit, isRangeUnit } from "../game/gameState/setGroup";
import { setPhase } from "../game/gameState/PhaseComponent";
import { createGameStateWithFlowMemory, GameStateWithFlowMemory } from "../game/gameStateWithFlowMemory/GameStateWithFlowMemory";
import { queryFlow } from "../game/gameStateWithFlowMemory/queryFlow";
import { setActivePlayerID } from "../game/gameState/ActivePlayerComponent";
import { applyFlow } from "../game/gameStateWithFlowMemory/applyFlow";
import { thinkVer1 } from "../game/gameStateWithFlowMemory/ai/thinkVer1";
import { StrBaSyouPair } from "../game/define/Tip";
import { getGlobalEffects } from "../game/gameState/globalEffects";

export async function testThinkVer1() {
    await loadPrototype("179015_04B_U_BK059C_black")
    await loadPrototype("179015_04B_U_BK061C_black")
    let ctx = createGameStateWithFlowMemory()
    ctx = createCardWithProtoIds(ctx, AbsoluteBaSyouFn.of(PlayerA, "配備エリア"), repeat("179015_04B_U_BK059C_black", 2)) as GameStateWithFlowMemory
    ctx = createCardWithProtoIds(ctx, AbsoluteBaSyouFn.of(PlayerA, "配備エリア"), repeat("179015_04B_U_BK061C_black", 2)) as GameStateWithFlowMemory
    ctx = createCardWithProtoIds(ctx, AbsoluteBaSyouFn.of(PlayerA, "本国"), repeat("179015_04B_U_BK061C_black", 2)) as GameStateWithFlowMemory
    ctx = createCardWithProtoIds(ctx, AbsoluteBaSyouFn.of(PlayerB, "本国"), repeat("179015_04B_U_BK061C_black", 2)) as GameStateWithFlowMemory
    ctx = setPhase(ctx, ["戦闘フェイズ", "攻撃ステップ", "規定の効果"]) as GameStateWithFlowMemory
    ctx = setActivePlayerID(ctx, PlayerA) as GameStateWithFlowMemory
    ctx = {
        ...ctx,
        flowMemory: {
            ...ctx.flowMemory,
            state: "playing"
        }
    }
    let units = getPlayerUnitIds(ctx, PlayerA)
    if (units.length != 4) {
        throw new Error()
    }
    let ges = getGlobalEffects(ctx, null)
    let meleeUnits = units.filter(id => isMeleeUnit(ctx, id, { ges: ges }))
    if (meleeUnits.length != 2) {
        throw new Error()
    }
    let rangeUnits = units.filter(id => isRangeUnit(ctx, id, { ges: ges }))
    if (rangeUnits.length != 2) {
        throw new Error()
    }
    // 產生規定效果
    let flows = queryFlow(ctx, PlayerA)
    let flow: Flow | null = flows[0]
    flow = flows.find(flow => flow.id == "FlowTriggerTextEvent") || null
    if (flow == null) {
        throw new Error()
    }
    ctx = applyFlow(ctx, PlayerA, flow)
    // 支付出擊效果
    flows = queryFlow(ctx, PlayerA)
    flow = flows[0]
    flow = flows.find(flow => flow.id == "FlowSetActiveEffectID") || null
    if (flow == null) {
        throw new Error()
    }
    ctx = applyFlow(ctx, PlayerA, flow)
    // 去地球對象指定
    flows = queryFlow(ctx, PlayerA)
    flow = flows.find(flow => flow.id == "FlowSetTipSelection" && flow.tip.flags?.isGoBattleArea1) || null
    if (flow == null) {
        throw new Error()
    }
    flow = thinkVer1(ctx, PlayerA, flows)
    if (flow?.id == "FlowSetTipSelection" && flow.tip.flags?.isGoBattleArea1) {

    } else {
        throw new Error()
    }
    // 一個格鬥配一個射擊
    const unitsGoEarth = (flow.tip.title[2] as StrBaSyouPair[]).map(pair => pair[0])
    if (flow.tip.title[2].length != 2) {
        throw new Error()
    }
    ctx = applyFlow(ctx, PlayerA, flow)
    // 去宇宙對象指定
    flows = queryFlow(ctx, PlayerA)
    flow = flows.find(flow => flow.id == "FlowSetTipSelection" && flow.tip.flags?.isGoBattleArea2) || null
    if (flow == null) {
        throw new Error()
    }
    flow = thinkVer1(ctx, PlayerA, flows)
    if (flow?.id == "FlowSetTipSelection" && flow.tip.flags?.isGoBattleArea2) {

    } else {
        throw new Error()
    }
    // 一個格鬥配一個射擊
    const unitsGoSpace = (flow.tip.title[2] as StrBaSyouPair[]).map(pair => pair[0])
    if (flow.tip.title[2].length != 2) {
        throw new Error()
    }
    ctx = applyFlow(ctx, PlayerA, flow)
    // 
    if (unitsGoSpace.filter(id => unitsGoEarth.includes(id)).length) {
        console.log(unitsGoEarth, unitsGoSpace)
        throw new Error(`出擊的機體不能重復`)
    }
    // 確認支付
    flows = queryFlow(ctx, PlayerA)
    flow = flows.find(flow => flow.id == "FlowPassPayCost") || null
    if (flow == null) {
        throw new Error()
    }
    ctx = applyFlow(ctx, PlayerA, flow)
    // PlayerB確認支付
    flows = queryFlow(ctx, PlayerB)
    flow = flows.find(flow => flow.id == "FlowPassPayCost") || null
    if (flow == null) {
        throw new Error()
    }
    ctx = applyFlow(ctx, PlayerB, flow)
    // 出擊
    flows = queryFlow(ctx, PlayerA)
    flow = flows.find(flow => flow.id == "FlowDoEffect") || null
    if (flow == null) {
        throw new Error()
    }
    ctx = applyFlow(ctx, PlayerA, flow)
    let battleGroup = getBattleGroup(ctx, AbsoluteBaSyouFn.of(PlayerA, "戦闘エリア1"))
    let bp = getBattleGroupBattlePoint(ctx, battleGroup, battleGroup, { ges: ges })
    if (bp != 6) {
        throw new Error()
    }
    battleGroup = getBattleGroup(ctx, AbsoluteBaSyouFn.of(PlayerA, "戦闘エリア2"))
    bp = getBattleGroupBattlePoint(ctx, battleGroup, battleGroup, { ges: ges })
    if (bp != 6) {
        throw new Error()
    }
}

export async function testThinkVer1_2() {
    await loadPrototype("179015_04B_U_BK059C_black")
    await loadPrototype("179015_04B_U_BK061C_black")
    let ctx = createGameStateWithFlowMemory()
    ctx = createCardWithProtoIds(ctx, AbsoluteBaSyouFn.of(PlayerA, "配備エリア"), repeat("179015_04B_U_BK059C_black", 2)) as GameStateWithFlowMemory
    ctx = createCardWithProtoIds(ctx, AbsoluteBaSyouFn.of(PlayerA, "配備エリア"), repeat("179015_04B_U_BK061C_black", 2)) as GameStateWithFlowMemory
    ctx = createCardWithProtoIds(ctx, AbsoluteBaSyouFn.of(PlayerA, "本国"), repeat("179015_04B_U_BK061C_black", 2)) as GameStateWithFlowMemory
    ctx = createCardWithProtoIds(ctx, AbsoluteBaSyouFn.of(PlayerB, "本国"), repeat("179015_04B_U_BK061C_black", 2)) as GameStateWithFlowMemory
    ctx = createCardWithProtoIds(ctx, AbsoluteBaSyouFn.of(PlayerB, "戦闘エリア2"), repeat("179015_04B_U_BK061C_black", 1)) as GameStateWithFlowMemory
    ctx = setPhase(ctx, ["戦闘フェイズ", "防御ステップ", "規定の効果"]) as GameStateWithFlowMemory
    ctx = setActivePlayerID(ctx, PlayerB) as GameStateWithFlowMemory
    ctx = {
        ...ctx,
        flowMemory: {
            ...ctx.flowMemory,
            state: "playing"
        }
    }
    let units = getPlayerUnitIds(ctx, PlayerA)
    if (units.length != 4) {
        throw new Error()
    }
    let ges = getGlobalEffects(ctx, null)
    let meleeUnits = units.filter(id => isMeleeUnit(ctx, id, { ges: ges }))
    if (meleeUnits.length != 2) {
        throw new Error()
    }
    let rangeUnits = units.filter(id => isRangeUnit(ctx, id, { ges: ges }))
    if (rangeUnits.length != 2) {
        throw new Error()
    }
    // 產生規定效果
    let flows = queryFlow(ctx, PlayerB)
    let flow: Flow | null = flows[0]
    flow = flows.find(flow => flow.id == "FlowTriggerTextEvent") || null
    if (flow == null) {
        throw new Error()
    }
    ctx = applyFlow(ctx, PlayerB, flow)
    // 支付出擊效果
    flows = queryFlow(ctx, PlayerA)
    console.log(flows)
    flow = flows[0]
    flow = flows.find(flow => flow.id == "FlowSetActiveEffectID") || null
    if (flow == null) {
        throw new Error()
    }
    ctx = applyFlow(ctx, PlayerA, flow)
    // 去地球對象指定
    flows = queryFlow(ctx, PlayerA)
    flow = flows.find(flow => flow.id == "FlowSetTipSelection" && flow.tip.flags?.isGoBattleArea1) || null
    if (flow == null) {
        throw new Error()
    }
    flow = thinkVer1(ctx, PlayerA, flows)
    if (flow?.id == "FlowSetTipSelection" && flow.tip.flags?.isGoBattleArea1) {

    } else {
        throw new Error()
    }
    // 一個格鬥配一個射擊
    const unitsGoEarth = (flow.tip.title[2] as StrBaSyouPair[]).map(pair => pair[0])
    if (flow.tip.title[2].length != 0) {
        throw new Error()
    }
    ctx = applyFlow(ctx, PlayerA, flow)
    // 去宇宙對象指定
    flows = queryFlow(ctx, PlayerA)
    flow = flows.find(flow => flow.id == "FlowSetTipSelection" && flow.tip.flags?.isGoBattleArea2) || null
    if (flow == null) {
        throw new Error()
    }
    flow = thinkVer1(ctx, PlayerA, flows)
    if (flow?.id == "FlowSetTipSelection" && flow.tip.flags?.isGoBattleArea2) {

    } else {
        throw new Error()
    }
    // 一個格鬥配一個射擊
    const unitsGoSpace = (flow.tip.title[2] as StrBaSyouPair[]).map(pair => pair[0])
    if (flow.tip.title[2].length != 3) {
        throw new Error()
    }
    ctx = applyFlow(ctx, PlayerA, flow)
    // 
    if (unitsGoSpace.filter(id => unitsGoEarth.includes(id)).length) {
        console.log(unitsGoEarth, unitsGoSpace)
        throw new Error(`出擊的機體不能重復`)
    }
    // 確認支付
    flows = queryFlow(ctx, PlayerA)
    flow = flows.find(flow => flow.id == "FlowPassPayCost") || null
    if (flow == null) {
        throw new Error()
    }
    ctx = applyFlow(ctx, PlayerA, flow)
    // PlayerB確認支付
    flows = queryFlow(ctx, PlayerB)
    flow = flows.find(flow => flow.id == "FlowPassPayCost") || null
    if (flow == null) {
        throw new Error()
    }
    ctx = applyFlow(ctx, PlayerB, flow)
    // 出擊
    flows = queryFlow(ctx, PlayerA)
    flow = flows.find(flow => flow.id == "FlowDoEffect") || null
    if (flow == null) {
        throw new Error()
    }
    ctx = applyFlow(ctx, PlayerA, flow)
    let battleGroup = getBattleGroup(ctx, AbsoluteBaSyouFn.of(PlayerA, "戦闘エリア1"))
    let bp = getBattleGroupBattlePoint(ctx, battleGroup, battleGroup, { ges: ges})
    if (bp != 0) {
        throw new Error()
    }
    battleGroup = getBattleGroup(ctx, AbsoluteBaSyouFn.of(PlayerA, "戦闘エリア2"))
    bp = getBattleGroupBattlePoint(ctx, battleGroup, battleGroup, { ges: ges })
    if (bp != 8) {
        console.log(bp)
        throw new Error()
    }
}
