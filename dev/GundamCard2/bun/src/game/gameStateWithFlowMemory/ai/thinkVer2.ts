import { createBattleGroupForAttackBattle, createBattleGroupForAttackCountry, createBattleGroupForDefenceBattle } from "../../ai/SelectBattleGroupGene";
import { AbsoluteBaSyou, AbsoluteBaSyouFn } from "../../define/BaSyou";
import { BattlePointFn } from "../../define/BattlePoint";
import { Effect, EffectFn } from "../../define/Effect";
import { GameExtParams } from "../../define/GameExtParams";
import { GlobalEffect } from "../../define/GlobalEffect";
import { PlayerID, PlayerIDFn } from "../../define/PlayerID";
import { Phase } from "../../define/Timing";
import { StrBaSyouPair, TipFn } from "../../define/Tip";
import { getBattleGroup, getBattleGroupBattlePoint } from "../../gameState/battleGroup";
import { getCardHasSpeicalEffect } from "../../gameState/card";
import { doEffect, getCardTipStrBaSyouPairs, setTipSelectionForUser } from "../../gameState/doEffect";
import { getEffect, getImmediateEffects, getStackEffects, getTopEffect } from "../../gameState/EffectStackComponent";
import { GameState } from "../../gameState/GameState";
import { getGlobalEffects, setGlobalEffects } from "../../gameState/globalEffects";
import { getItemState } from "../../gameState/ItemStateComponent";
import { createStrBaSyouPair, getItemIdsByBasyou, getItemPrototype } from "../../gameState/ItemTableComponent";
import { getPhase } from "../../gameState/PhaseComponent";
import { createPlayerScore, createPreviewEffectScore, getPlayerGIds, getPlayerHandIds, getPlayerUnitCanGoEarthIds, getPlayerUnitCanGoSpaceIds, getPlayerUnitIds } from "../../gameState/player";
import { getSetGroupBattlePoint, isMeleeUnit, isRangeUnit } from "../../gameState/setGroup";
import { Flow } from "../Flow";
import { GameStateWithFlowMemory } from "../GameStateWithFlowMemory";


let currentKey: string = ""
function getUnitIds(ctx: GameState, playerId: string, isAttack: boolean, isDefence: boolean, ges: GlobalEffect[]): [string[], string[]] {
  let earthIds: string[] = []
  let spaceIds: string[] = []
  const key = playerId + isAttack + isDefence
  if (currentKey != key) {
    if (isAttack) {
      const opponentPlayerId = PlayerIDFn.getOpponent(playerId)
      const opponentGoEarthIds = getPlayerUnitCanGoEarthIds(ctx, opponentPlayerId, { ges: ges })
      const opponentGoSpaceIds = getPlayerUnitCanGoSpaceIds(ctx, opponentPlayerId, { ges: ges })
      if (opponentGoEarthIds.length == 0 && opponentGoSpaceIds.length == 0) {
        [earthIds, spaceIds] = createBattleGroupForAttackCountry(ctx, playerId, { ges: ges })
      } else {
        [earthIds, spaceIds] = createBattleGroupForAttackBattle(ctx, playerId, { ges: ges })
      }
    } else if (isDefence) {
      const opponentPlayerId = PlayerIDFn.getOpponent(playerId)
      const opponentGoEarthIds = getItemIdsByBasyou(ctx, AbsoluteBaSyouFn.of(opponentPlayerId, "戦闘エリア1"))
      const opponentGoSpaceIds = getItemIdsByBasyou(ctx, AbsoluteBaSyouFn.of(opponentPlayerId, "戦闘エリア2"))
      if (opponentGoEarthIds.length == 0 && opponentGoSpaceIds.length == 0) {
        [earthIds, spaceIds] = [[], []]
      } else {
        [earthIds, spaceIds] = createBattleGroupForDefenceBattle(ctx, playerId, { ges: ges })
      }
    } else {
      [earthIds, spaceIds] = [[], []]
    }
  }
  {
    const area1 = earthIds
    const area2 = spaceIds
    area1.forEach(eid => {
      if (area2.includes(eid)) {
        console.log(area1, area2)
        throw new Error()
      }
    })
  }
  return [earthIds, spaceIds]
}

export function thinkVer2(ctx: GameStateWithFlowMemory, playerId: PlayerID, flows: Flow[]): Flow | null {
  const ges = getGlobalEffects(ctx, null)
  // 出擊分配部隊
  const attackFlow: Flow[] = flows.flatMap(flow => {
    if (flow.id == "FlowSetTipSelection") {
      const effect = getEffect(ctx, flow.effectID)
      if (effect.reason[0] == "GameRule" && (effect.reason[2].isAttack)) {
        let willGoIds: string[] = []
        if (flow.tip.flags?.isGoBattleArea1) {
          willGoIds = getUnitIds(ctx, playerId, true, false, ges)[0]
        } else if (flow.tip.flags?.isGoBattleArea2) {
          willGoIds = getUnitIds(ctx, playerId, true, false, ges)[1]
        } else {
          throw new Error()
        }
        if (willGoIds.length) {
          flow = {
            ...flow,
            tip: {
              ...flow.tip,
              title: ["カード", [], willGoIds.map(id => createStrBaSyouPair(ctx, id))]
            }
          }
          return [flow]
        }
      }
      if (effect.reason[0] == "GameRule" && (effect.reason[2].isDefence)) {
        let willGoIds: string[] = []
        if (flow.tip.flags?.isGoBattleArea1) {
          willGoIds = getUnitIds(ctx, playerId, false, true, ges)[0]
        } else if (flow.tip.flags?.isGoBattleArea2) {
          willGoIds = getUnitIds(ctx, playerId, false, false, ges)[1]
        } else {
          throw new Error()
        }
        if (willGoIds.length) {
          flow = {
            ...flow,
            tip: {
              ...flow.tip,
              title: ["カード", [], willGoIds.map(id => createStrBaSyouPair(ctx, id))]
            }
          }
          return [flow]
        }
      }
    }
    return []
  })
  if (attackFlow.length) {
    return attackFlow[0]
  }
  const plays = flows.flatMap(flow => flow.id == "FlowSetActiveEffectID" ? flow.tips : [])
  // 規定效果就直接選
  const ruleEffect = plays.find(p => p.reason[0] == "GameRule" && (p.reason[2].isAttack || p.reason[2].isDefence || p.reason[2].isReturn || p.reason[2].isDamageCheck || p.reason[2].isReroll || p.reason[2].isDraw))
  if (ruleEffect) {
    return { id: "FlowSetActiveEffectID", effectID: ruleEffect.id, tips: [] }
  }
  const playGs = plays.filter(p => p.reason[0] == "PlayCard" && p.reason[3].isPlayG)
  const playChars = plays.filter(p => p.reason[0] == "PlayCard" && p.reason[3].isPlayCharacter)
  const mygs = getPlayerGIds(ctx, playerId)
  // G小於7張優先下G
  if (mygs.length < 7 && playGs.length) {
    return { id: "FlowSetActiveEffectID", effectID: playGs[0].id, tips: [] }
  }
  const playUnits = plays.filter(p => p.reason[0] == "PlayCard" && p.reason[3].isPlayUnit)
  const myUnits = getPlayerUnitIds(ctx, playerId)
  // 機體小於4張優先下機體
  if (myUnits.length < 4 && playUnits.length) {
    return { id: "FlowSetActiveEffectID", effectID: playUnits[0].id, tips: [] }
  }
  if (playChars.length) {
    // 0,0,0 的角色不下到機體上
    const shouldSetCharEffs = playChars.filter(eff => {
      const [atk, range, hp] = getItemPrototype(ctx, EffectFn.getCardID(eff)).battlePoint || BattlePointFn.getAllStar()
      if (BattlePointFn.getValue(atk) + BattlePointFn.getValue(range) + BattlePointFn.getValue(hp) == 0) {
        return false
      }
      return true
    })
    if (shouldSetCharEffs.length) {
      let eff = shouldSetCharEffs[Math.round(Math.random() * 1000) % shouldSetCharEffs.length]
      return { id: "FlowSetActiveEffectID", effectID: eff.id, tips: [] }
    }
  }
  // play內文時計算績分
  const playTexts = plays.filter(p => p.reason[0] == "PlayText")
  const shouldUseTexts = createPreviewEffectScore(ctx, playerId, playTexts, { ges: ges })
  if (shouldUseTexts.length) {
    return { id: "FlowSetActiveEffectID", effectID: shouldUseTexts[0][0], tips: [] }
  }
  // 機體小於8張下機體
  if (myUnits.length < 8 && playUnits.length) {
    return { id: "FlowSetActiveEffectID", effectID: playUnits[0].id, tips: [] }
  }
  // 其它就隨意
  const useFlows = flows.filter(flow => {
    switch (flow.id) {
      case "FlowCancelActiveEffectID":
      case "FlowCancelActiveLogicID":
      case "FlowCancelPassCut":
      case "FlowCancelPassPhase":
      case "FlowWaitPlayer":
      case "FlowObserveEffect":
        return false
    }
    return true
  })
  const myHand = getPlayerHandIds(ctx, playerId)
  if (mygs.length >= 6 && myHand.length <= 2) {
    const flow = flows.find(flow => flow.id == "FlowPassCut")
    if (flow) {
      return flow
    }
  }

  if (useFlows.length) {
    let flow = useFlows[Math.round(Math.random() * 1000) % useFlows.length]
    return flow
  }
  return null
}