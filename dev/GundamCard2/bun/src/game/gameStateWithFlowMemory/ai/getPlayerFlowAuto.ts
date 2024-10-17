import { PlayerID } from "../../define/PlayerID";
import { PhaseFn } from "../../define/Timing";
import { getCard } from "../../gameState/CardTableComponent";
import { getPhase } from "../../gameState/PhaseComponent";
import { getPlayerUnitIds } from "../../gameState/player";
import { Flow } from "../Flow";
import { GameStateWithFlowMemory } from "../GameStateWithFlowMemory";

export function getPlayerFlowAuto(ctx: GameStateWithFlowMemory, playerId: PlayerID, flows: Flow[], options?: {}): Flow | null {
  // 規定效果自動按
  const phase = getPhase(ctx)
  if (PhaseFn.isRuleEffect(phase)) {
    let flow: Flow | undefined = flows.find(flow => flow.id == "FlowPassPayCost")
    if (flow == null) {
      // 規定效果非出擊一律自動按
      flows.find(flow => flow.id == "FlowSetActiveEffectID" && phase[0] == "戦闘フェイズ" && (phase[1] != "攻撃ステップ" && phase[1] != "防御ステップ"))
    }
    if (flow == null) {
      // 若是出擊則額外判斷有沒有兵可以出
      const deleteFlow = flows.find(flow => flow.id == "FlowDeleteImmediateEffect" && phase[0] == "戦闘フェイズ" && (phase[1] == "攻撃ステップ" || phase[1] == "防御ステップ"))
      if (deleteFlow?.id == "FlowDeleteImmediateEffect") {
        const atkDefEf = deleteFlow.tips.find(e => e.reason[0] == "GameRule" && (e.reason[2].isAttack || e.reason[2].isDefence))
        if (atkDefEf) {
          const isAllRoll = getPlayerUnitIds(ctx, playerId).every(itemId => getCard(ctx, itemId).isRoll)
          if (isAllRoll) {
            flow = deleteFlow
          }
        }
      }
    }
    if (flow != null) {
      return flow
    }
  }
  // 只剩下一個命令時自動按，一些狀況除外
  if (flows.length == 1) {
    const flow = flows[0]
    if (flow.id == "FlowCancelPassPhase") {
      return null
    }
    if (flow.id == "FlowCancelPassCut") {
      return null
    }
    if (flow.id == "FlowWaitPlayer") {
      return null
    }
    if (flow.id == "FlowDeleteImmediateEffect") {
      return null
    }
    if (flow.id == "FlowSetTipSelection") {
      return null
    }
    if (flow.id == "FlowObserveEffect") {
      return null
    }
    if (flow.id == "FlowSetActiveLogicID") {
      return null
    }
    return flow
  }
  return null
}