import { AbsoluteBaSyou, AbsoluteBaSyouFn } from "../../define/BaSyou";
import { BattlePointFn } from "../../define/BattlePoint";
import { Effect, EffectFn } from "../../define/Effect";
import { PlayerID, PlayerIDFn } from "../../define/PlayerID";
import { StrBaSyouPair, TipFn } from "../../define/Tip";
import { getBattleGroup, getBattleGroupBattlePoint } from "../../gameState/battleGroup";
import { getCardHasSpeicalEffect } from "../../gameState/card";
import { doEffect, getCardTipStrBaSyouPairs, setTipSelectionForUser } from "../../gameState/doEffect";
import { getEffect, getImmediateEffects, getStackEffects, getTopEffect } from "../../gameState/EffectStackComponent";
import { GameState } from "../../gameState/GameState";
import { getItemState } from "../../gameState/ItemStateComponent";
import { getItemPrototype } from "../../gameState/ItemTableComponent";
import { getPhase } from "../../gameState/PhaseComponent";
import { createPlayerScore, getPlayerGIds, getPlayerUnitIds } from "../../gameState/player";
import { getSetGroupBattlePoint, isMeleeUnit, isRangeUnit } from "../../gameState/setGroup";
import { Flow } from "../Flow";
import { GameStateWithFlowMemory } from "../GameStateWithFlowMemory";

export function thinkRandom(ctx: GameStateWithFlowMemory, playerId: PlayerID, flows: Flow[], options?: {}): Flow | null {
  const flow = flows[Math.round(Math.random() * 1000) % flows.length]
  return flow
}

export function thinkVer1(ctx: GameStateWithFlowMemory, playerId: PlayerID, flows: Flow[], options?: {}): Flow | null {
  // 出擊分配部隊
  const attackFlow: Flow[] = flows.flatMap(flow => {
    if (flow.id == "FlowSetTipSelection") {
      const effect = getEffect(ctx, flow.effectID)
      if (effect.reason[0] == "GameRule" && (effect.reason[2].isAttack)) {
        const hasEarthIds = ((getItemState(ctx, EffectFn.getCardID(effect)).tips[TipFn.createGoEarthKey()]?.title[2] || []) as StrBaSyouPair[]).map(pair => pair[0])
        const hasSpaceIds = ((getItemState(ctx, EffectFn.getCardID(effect)).tips[TipFn.createGoSpaceKey()]?.title[2] || []) as StrBaSyouPair[]).map(pair => pair[0])
        const hasIds = [...hasEarthIds, ...hasSpaceIds]
        const canAttackUnits = (TipFn.getWant(flow.tip) as StrBaSyouPair[]).filter(pair => hasIds.includes(pair[0]) == false)
        const meleeUnits = canAttackUnits.filter(pair => isMeleeUnit(ctx, pair[0]))
        const rangeUnits = canAttackUnits.filter(pair => isRangeUnit(ctx, pair[0]))
        let willAttackPairs: StrBaSyouPair[] = []

        const hasMeleeHighUnits = meleeUnits.filter(pair => getCardHasSpeicalEffect(ctx, ["高機動"], pair[0]))
        const hasMeleeSpeed = meleeUnits.filter(pair => getCardHasSpeicalEffect(ctx, ["速攻"], pair[0]))
        const hasMeleeStrongUnits = meleeUnits.filter(pair => getCardHasSpeicalEffect(ctx, ["強襲"], pair[0]))
        const hasRangeStrongHighUnits = rangeUnits.filter(pair => getCardHasSpeicalEffect(ctx, ["強襲"], pair[0]))
        if (hasMeleeSpeed.length) {
          // 速攻
          const hasRangeSpeedUnits = rangeUnits.filter(pair => getCardHasSpeicalEffect(ctx, ["速攻"], pair[0]))
          willAttackPairs = [hasMeleeSpeed[0], ...hasRangeSpeedUnits]
        } else if (hasMeleeHighUnits.length) {
          // 高機動
          const hasRangeHighUnits = rangeUnits.filter(pair => getCardHasSpeicalEffect(ctx, ["高機動"], pair[0]))
          willAttackPairs = [hasMeleeHighUnits[0], ...hasRangeHighUnits]
        } else if (hasMeleeStrongUnits.length > 0 && hasRangeStrongHighUnits.length >= 1) {
          // 最少1格鬥1射擊才組強襲
          willAttackPairs = [hasMeleeStrongUnits[0], ...hasRangeStrongHighUnits]
        } else if (meleeUnits.length == 1) {
          // 只有一個格鬥機，就全上同一路
          willAttackPairs = [meleeUnits[0], ...rangeUnits]
        } else if (meleeUnits.length >= 1) {
          // 有多個格鬥機就各配一個射擊機
          willAttackPairs = [meleeUnits[0], ...rangeUnits.slice(0, 1)]
        } else if (rangeUnits.length >= 3) {
          // 沒格鬥機的情況若射擊機3個以上就全上
          willAttackPairs = rangeUnits
        }
        if (willAttackPairs.length) {
          flow = {
            ...flow,
            tip: {
              ...flow.tip,
              title: ["カード", [], willAttackPairs]
            }
          }
          return [flow]
        }
      }
      if (effect.reason[0] == "GameRule" && (effect.reason[2].isDefence)) {
        const hasEarthIds = ((getItemState(ctx, EffectFn.getCardID(effect)).tips[TipFn.createGoEarthKey()]?.title[2] || []) as StrBaSyouPair[]).map(pair => pair[0])
        const hasSpaceIds = ((getItemState(ctx, EffectFn.getCardID(effect)).tips[TipFn.createGoSpaceKey()]?.title[2] || []) as StrBaSyouPair[]).map(pair => pair[0])
        const hasIds = [...hasEarthIds, ...hasSpaceIds]
        const canAttackUnits = (TipFn.getWant(flow.tip) as StrBaSyouPair[]).filter(pair => hasIds.includes(pair[0]) == false)
        const meleeUnits = canAttackUnits.filter(pair => isMeleeUnit(ctx, pair[0]))
        const rangeUnits = canAttackUnits.filter(pair => isRangeUnit(ctx, pair[0]))
        let willAttackPairs: StrBaSyouPair[] = []
        const battleArea: AbsoluteBaSyou = flow.tip.flags?.isGoBattleArea1 ? AbsoluteBaSyouFn.of(PlayerIDFn.getOpponent(playerId), "戦闘エリア1") : AbsoluteBaSyouFn.of(PlayerIDFn.getOpponent(playerId), "戦闘エリア2")
        const opponentPower = getBattleGroupBattlePoint(ctx, getBattleGroup(ctx, battleArea))
        if (opponentPower == 0) {
          return [flow]
        }
        if (meleeUnits.length >= 1) {
          const myUnits = [meleeUnits[0], ...rangeUnits]
          const myPower = getBattleGroupBattlePoint(ctx, myUnits.map(pair => pair[0]))
          if (myPower >= opponentPower) {
            willAttackPairs = myUnits
          }
          if (willAttackPairs.length) {
            flow = {
              ...flow,
              tip: {
                ...flow.tip,
                title: ["カード", [], willAttackPairs]
              }
            }
            return [flow]
          }
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
  const playUnits = plays.filter(p =>
    p.reason[0] == "PlayCard"
    && getItemPrototype(ctx, p.reason[2]).category == "ユニット")
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
  const effectScorePairs: [Effect, number][] = playTexts.map(pt => {
    try {
      const originStackLength = getStackEffects(ctx).length
      const originImmediateLength = getImmediateEffects(ctx).length
      let ctx2: GameStateWithFlowMemory = JSON.parse(JSON.stringify(ctx))
      ctx2 = setTipSelectionForUser(ctx2, pt, 0, 0) as GameStateWithFlowMemory
      ctx2 = doEffect(ctx2, pt, 0, 0) as GameStateWithFlowMemory
      if (getStackEffects(ctx2).length > originStackLength) {
        const eff = getTopEffect(ctx2)
        if (eff == null) {
          throw new Error()
        }
        ctx2 = setTipSelectionForUser(ctx2, pt, 0, 0) as GameStateWithFlowMemory
        ctx2 = doEffect(ctx2, eff, 0, 0) as GameStateWithFlowMemory
      }
      if (getImmediateEffects(ctx2).length > originImmediateLength) {
        const eff = getImmediateEffects(ctx2)[0]
        if (eff == null) {
          throw new Error()
        }
        ctx2 = setTipSelectionForUser(ctx2, pt, 0, 0) as GameStateWithFlowMemory
        ctx2 = doEffect(ctx2, eff, 0, 0) as GameStateWithFlowMemory
      }
      const score = createPlayerScore(ctx2, playerId) - createPlayerScore(ctx2, PlayerIDFn.getOpponent(playerId))
      return [pt, score]
    } catch (e: any) {
      console.warn(`AI計算時例外，忽略:${e.message}`)
    }
    return [pt, 0]
  })


  // 如果使用後盤面分數比本來的差距還大就使用
  const originScore = createPlayerScore(ctx, playerId) - createPlayerScore(ctx, PlayerIDFn.getOpponent(playerId))
  effectScorePairs.sort(([_, s1], [_2, s2]) => s2 - s1)
  const shouldUseTexts = effectScorePairs.filter(([eff, score]) => score > originScore)
  if (shouldUseTexts.length) {
    return { id: "FlowSetActiveEffectID", effectID: shouldUseTexts[0][0].id, tips: [] }
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
  if (useFlows.length) {
    let flow = useFlows[Math.round(Math.random() * 1000) % useFlows.length]
    return flow
  }
  return null
}