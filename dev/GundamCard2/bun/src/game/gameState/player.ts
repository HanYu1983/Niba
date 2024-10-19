import { pipe, always, map, sum, lift } from "ramda";
import { logCategory } from "../../tool/logger";
import { AttackSpeed } from "../define";
import { AbsoluteBaSyouFn, BaKeyword, BaSyouKeyword, BaSyouKeywordFn } from "../define/BaSyou";
import { DestroyReason, Effect, EffectFn } from "../define/Effect";
import { ItemState } from "../define/ItemState";
import { PlayerA, PlayerB, PlayerID, PlayerIDFn } from "../define/PlayerID";
import { isBattleGroupHasA, getBattleGroup, getBattleGroupBattlePoint, isABattleGroup } from "./battleGroup";
import { GameState } from "./GameState";
import { getItemState, setItemState } from "./ItemStateComponent";
import { GameEvent } from "../define/GameEvent";
import { getSetGroupBattlePoint } from "./setGroup";
import { doTriggerEvent } from "./doTriggerEvent";
import { StrBaSyouPair } from "../define/Tip";
import { doItemMove } from "./doItemMove";
import { createStrBaSyouPair, getItemController, getItemIdsByBasyou, getItemPrototype } from "./ItemTableComponent";
import { doItemSetDestroy } from "./doItemSetDestroy";
import { doEffect, getCardTipStrBaSyouPairs, setTipSelectionForUser } from "./doEffect";
import { doCountryDamage } from "./doCountryDamage";
import { addDestroyEffect, getCutInDestroyEffects, getEffect, getImmediateEffects, getTopEffect, removeEffect } from "./EffectStackComponent";
import { createDestroyEffect } from "./createDestroyEffect";
import { getCard } from "./CardTableComponent";
import { getCardBattleArea, getCardHasSpeicalEffect } from "./card";
import { getActivePlayerID } from "./ActivePlayerComponent";
import { isBattle } from "./IsBattleComponent";
import { GlobalEffect } from "../define/GlobalEffect";
import { GameStateFn } from ".";

// player
export function isPlayerHasBattleGroup(
  ctx: GameState,
  playerId: PlayerID
): boolean {
  return pipe(
    always(
      [
        AbsoluteBaSyouFn.of(playerId, "戦闘エリア2"),
        AbsoluteBaSyouFn.of(playerId, "戦闘エリア1"),
      ]
    ),
    map(baSyou => getItemIdsByBasyou(ctx, baSyou).length),
    sum
  )() > 0
}

export function doBattleDamage(ctx: GameState, playerId: string, guardUnits: string[], attackPower: number, options: { isNotRule?: boolean, ges?: GlobalEffect[] }): [GameState, number] {
  // 敵方機體存在, 攻擊機體
  if (guardUnits.length) {
    const changedCardState = guardUnits.map((cardID): ItemState => {
      const cs = getItemState(ctx, cardID);
      if (attackPower <= 0) {
        return cs;
      }
      const [_, _2, hp] = getSetGroupBattlePoint(ctx, cardID, { ges: options?.ges });
      const live = hp - cs.damage;
      if (live <= 0) {
        return cs;
      }
      attackPower -= live;
      if (attackPower >= 0) {
        const reason: DestroyReason = {
          id: "戦闘ダメージ",
          playerID: playerId,
        };
        // 這裡不發送破壞事件, 因為破壞比較等到破壞效果進堆疊才算數
        ctx = doItemSetDestroy(ctx, reason, createStrBaSyouPair(ctx, cardID), { isSkipTargetMissing: true })
        return {
          ...cs,
          damage: hp,
          destroyReason: reason,
        };
      }
      // 剩餘血量
      const nextLive = -attackPower;
      const nextDamage = hp - nextLive;
      // 傷害用完了, 重設為0
      attackPower = 0;
      const gameEvent: GameEvent = {
        // p71
        // 如果非規定效果的時候，這個傷害效果才算是敵軍效果
        title: ["戦闘ダメージを受けた場合", { isNotRule: options?.isNotRule }],
        cardIds: [cs.id],
        playerId: playerId
      };
      ctx = doTriggerEvent(ctx, gameEvent)
      return {
        ...cs,
        damage: nextDamage,
      };
    });
    // 套用傷害
    ctx = changedCardState.reduce((ctx, cs) => {
      return setItemState(ctx, cs.id, cs) as GameState
    }, ctx)
  }
  return [ctx, attackPower]
}

export function doRuleBattleDamage(
  ctx: GameState,
  speedPhase: number,
  currentAttackPlayerID: PlayerID,
  currentGuardPlayerID: PlayerID,
  willAttackUnits: string[],
  willGuardUnits: string[],
  willAttackPower: number,
  options: { ges?: GlobalEffect[] }
): GameState {
  logCategory("handleAttackDamage", "speed", speedPhase);
  logCategory("handleAttackDamage", "willAttackUnits", willAttackUnits);
  logCategory("handleAttackDamage", "willGuardUnits", willGuardUnits);
  logCategory("handleAttackDamage", "willAttackPower", willAttackPower);
  if (willAttackUnits.length) {
    // 判斷速度1速度2是否可攻擊
    const hasSpeedAttack = isABattleGroup(ctx, ["速攻"], willAttackUnits[0], { ges: options.ges });
    if (
      // 有速攻的情況在速度1
      (hasSpeedAttack && speedPhase == 1) ||
      // 沒速攻的情況在速度2
      (hasSpeedAttack == false && speedPhase == 2)
    ) {
      let currentAttackPower = willAttackPower;
      logCategory("handleAttackDamage", "attack", currentAttackPower);
      // 敵方機體存在, 攻擊機體
      if (willGuardUnits.length) {
        [ctx, currentAttackPower] = doBattleDamage(ctx, currentAttackPlayerID, willGuardUnits, currentAttackPower, { ges: options?.ges })
      }
      // 若傷害沒有用完, 攻擊方可以攻擊本國
      if (currentAttackPlayerID == getActivePlayerID(ctx) && currentAttackPower > 0) {
        // 非交戰中或有強襲才能打本國(p35)
        if (isBattle(ctx, willAttackUnits[0], null) == false || isABattleGroup(ctx, ["強襲"], willAttackUnits[0], { ges: options.ges })) {
          ctx = doCountryDamage(ctx, currentGuardPlayerID, currentAttackPower)
          {
            const gameEvent: GameEvent = {
              title: ["このカードの部隊が敵軍本国に戦闘ダメージを与えた場合"],
              cardIds: willAttackUnits,
            };
            ctx = doTriggerEvent(ctx, gameEvent)
          }
        }
      }
    }
  }
  return ctx
}

export function doPlayerAttack(
  ctx: GameState,
  attackPlayerID: PlayerID,
  where: BaSyouKeyword,
  speedPhase: AttackSpeed,
  options: { ges?: GlobalEffect[] }
): GameState {
  const guardPlayerID = PlayerIDFn.getOpponent(attackPlayerID)
  const attackUnits = getBattleGroup(ctx, AbsoluteBaSyouFn.of(attackPlayerID, where));
  const attackPower = getBattleGroupBattlePoint(ctx, attackUnits, { ges: options.ges });
  const guardUnits = getBattleGroup(ctx, AbsoluteBaSyouFn.of(guardPlayerID, where));
  const guardPower = getBattleGroupBattlePoint(ctx, guardUnits, { ges: options.ges });
  ctx = doRuleBattleDamage(ctx, speedPhase, attackPlayerID, guardPlayerID, attackUnits, guardUnits, attackPower, { ges: options?.ges })
  ctx = doRuleBattleDamage(ctx, speedPhase, guardPlayerID, attackPlayerID, guardUnits, attackUnits, guardPower, { ges: options?.ges });
  [...attackUnits, ...guardUnits].forEach(cardId => {
    const itemState = getItemState(ctx, cardId)
    const [_, _2, hp] = getSetGroupBattlePoint(ctx, cardId, { ges: options.ges })
    if (hp <= itemState.damage) {
      ctx = addDestroyEffect(ctx, createDestroyEffect(ctx, { id: "戦闘ダメージ", playerID: PlayerIDFn.getOpponent(getItemController(ctx, cardId)) }, cardId)) as GameState
    }
  })
  return ctx;
}

export function getPlayerGIds(ctx: GameState, playerId: PlayerID): string[] {
  return getItemIdsByBasyou(ctx, AbsoluteBaSyouFn.of(playerId, "Gゾーン"))
}

export function getPlayerHandIds(ctx: GameState, playerId: PlayerID): string[] {
  return getItemIdsByBasyou(ctx, AbsoluteBaSyouFn.of(playerId, "手札"))
}

export function getPlayerJunkyardIds(ctx: GameState, playerId: PlayerID): string[] {
  return getItemIdsByBasyou(ctx, AbsoluteBaSyouFn.of(playerId, "ジャンクヤード"))
}

export function getPlayerDestroyIds(ctx: GameState, playerId: PlayerID): string[] {
  return getCutInDestroyEffects(ctx).map(e => EffectFn.getCardID(e)).filter(itemId => getItemController(ctx, itemId) == playerId)
}

export function getPlayerUnitIds(ctx: GameState, playerId: PlayerID): string[] {
  return lift(AbsoluteBaSyouFn.of)([playerId], BaSyouKeywordFn.getBaAll()).flatMap(basyou => getItemIdsByBasyou(ctx, basyou)).filter(itemId => getItemPrototype(ctx, itemId).category == "ユニット")
}

export function getPlayerUnitCanGoEarthIds(ctx: GameState, playerId: PlayerID): string[] {
  const currentBaKw: BaKeyword = "戦闘エリア1"
  const runtimeBattleArea = GameStateFn.getRuntimeBattleArea(ctx, currentBaKw)
  if (runtimeBattleArea == "宇宙エリア") {
    return []
  }
  const opponentPlayerId = PlayerIDFn.getOpponent(playerId)
  const cardIds = getPlayerUnitIds(ctx, playerId)
  let unitIds = cardIds
    .filter(cardId => GameStateFn.getSetGroupRoot(ctx, cardId) == cardId)
    .filter(cardId => GameStateFn.getCardBattleArea(ctx, cardId).includes(runtimeBattleArea))
    .filter(cardId => GameStateFn.getCard(ctx, cardId).isRoll != true)
  const opponentUnitIds = GameStateFn.getBattleGroup(ctx, AbsoluteBaSyouFn.of(opponentPlayerId, currentBaKw));
  if (opponentUnitIds.length) {
    const ges = GameStateFn.getGlobalEffects(ctx, null)
    if (GameStateFn.isABattleGroup(ctx, ["高機動"], opponentUnitIds[0], { ges: ges })) {
      unitIds = unitIds.filter(id => GameStateFn.isSetGroupHasA(ctx, ["高機動"], id, { ges: ges }))
    }
  }
  return unitIds
}

export function getPlayerUnitCanGoSpaceIds(ctx: GameState, playerId: PlayerID): string[] {
  const currentBaKw: BaKeyword = "戦闘エリア2"
  const runtimeBattleArea = GameStateFn.getRuntimeBattleArea(ctx, currentBaKw)
  if (runtimeBattleArea == "地球エリア") {
    return []
  }
  const opponentPlayerId = PlayerIDFn.getOpponent(playerId)
  const cardIds = GameStateFn.getItemIdsByBasyou(ctx, AbsoluteBaSyouFn.of(playerId, "配備エリア"))
  let unitIds = cardIds
    .filter(cardId => GameStateFn.getSetGroupRoot(ctx, cardId) == cardId)
    .filter(cardId => GameStateFn.getCardBattleArea(ctx, cardId).includes(runtimeBattleArea))
    .filter(cardId => GameStateFn.getCard(ctx, cardId).isRoll != true)
  const opponentUnitIds = GameStateFn.getBattleGroup(ctx, AbsoluteBaSyouFn.of(opponentPlayerId, currentBaKw));
  if (opponentUnitIds.length) {
    const ges = GameStateFn.getGlobalEffects(ctx, null)
    if (GameStateFn.isABattleGroup(ctx, ["高機動"], opponentUnitIds[0], { ges: ges })) {
      unitIds = unitIds.filter(id => GameStateFn.isSetGroupHasA(ctx, ["高機動"], id, { ges: ges }))
    }
  }
  return unitIds
}

export function getPlayerCharacterIds(ctx: GameState, playerId: PlayerID): string[] {
  return lift(AbsoluteBaSyouFn.of)([playerId], BaSyouKeywordFn.getBaAll()).flatMap(basyou => getItemIdsByBasyou(ctx, basyou)).filter(itemId => getItemPrototype(ctx, itemId).category == "キャラクター")
}

export function getPlayerOperationIds(ctx: GameState, playerId: PlayerID): string[] {
  return lift(AbsoluteBaSyouFn.of)([playerId], BaSyouKeywordFn.getBaAll()).flatMap(basyou => getItemIdsByBasyou(ctx, basyou)).filter(itemId => getItemPrototype(ctx, itemId).category == "オペレーション")
}

export function createPlayerScore(ctx: GameState, playerId: string, options: { ges?: GlobalEffect[] }): number {
  const units = getPlayerUnitIds(ctx, playerId)
  const chars = getPlayerCharacterIds(ctx, playerId)
  const gs = getPlayerGIds(ctx, playerId)
  const ops = getPlayerOperationIds(ctx, playerId)
  const hands = getPlayerHandIds(ctx, playerId)
  // 從未處理的破壞陣列取得
  const destroyIds = ctx.destroyEffect.filter(eid => getItemController(ctx, EffectFn.getCardID(getEffect(ctx, eid))) == playerId)
  const junkyardIds = getPlayerJunkyardIds(ctx, playerId)
  const gScore = gs.length * 3
  const unitScore = units.length * 5
  const charScore = chars.length
  // op再多也沒什麼分
  const opScore = Math.max(3, ops.length) * 3
  const handScore = hands.length * 3
  const destroyScore = destroyIds.length * -10
  const junkyardScore = junkyardIds.length * -1
  const rollScore = [...gs, ...units].filter(itemId => getCard(ctx, itemId).isRoll).length * -5
  const bpScore = units.map(id => {
    if (getCard(ctx, id).isRoll) {
      return 0
    }
    const [atk, range, hp] = getSetGroupBattlePoint(ctx, id, { ges: options.ges })
    return atk + range + hp
  }).reduce((acc, c) => acc + c, 0)
  const specialScore1 = units.filter(id => getCardHasSpeicalEffect(ctx, ["速攻"], id, { ges: options.ges })).length * 2
  const specialScore2 = units.filter(id => getCardHasSpeicalEffect(ctx, ["高機動"], id, { ges: options.ges })).length * 2
  const specialScore3 = units.filter(id => getCardHasSpeicalEffect(ctx, ["強襲"], id, { ges: options.ges })).length * 2
  const total = gScore + unitScore + charScore + opScore + handScore + destroyScore + junkyardScore + rollScore + bpScore + specialScore1 + specialScore2 + specialScore3
  logCategory("createPlayerScore", "=======", playerId)
  logCategory("createPlayerScore", "gScore:", gScore)
  logCategory("createPlayerScore", "unitScore:", unitScore)
  logCategory("createPlayerScore", "charScore:", charScore)
  logCategory("createPlayerScore", "opScore:", opScore)
  logCategory("createPlayerScore", "handScore:", handScore)
  logCategory("createPlayerScore", "destroyScore:", destroyScore)
  logCategory("createPlayerScore", "junkyardScore:", junkyardScore)
  logCategory("createPlayerScore", "rollScore:", rollScore)
  logCategory("createPlayerScore", "bpScore:", bpScore)
  logCategory("createPlayerScore", "specialScore1:", specialScore1)
  logCategory("createPlayerScore", "specialScore2:", specialScore2)
  logCategory("createPlayerScore", "specialScore3:", specialScore3)
  logCategory("createPlayerScore", "total:", total)
  return total
}

export function createPreviewEffectScore(ctx: GameState, playerId: string, effects: Effect[], options: { isMoreThenOrigin?: boolean, ges?: GlobalEffect[] }): [string, number][] {
  const opponentId = PlayerIDFn.getOpponent(playerId)
  const scoreA = createPlayerScore(ctx, playerId, { ges: options?.ges })
  const scoreB = createPlayerScore(ctx, opponentId, { ges: options?.ges })
  const score = scoreA - scoreB
  let effectScorePairs: [string, number][] = effects.map(eff => {
    try {
      let ctx2: GameState = JSON.parse(JSON.stringify(ctx))
      ctx2.stackEffect = []
      ctx2.immediateEffect = []
      ctx2 = setTipSelectionForUser(ctx2, eff, 0, 0) as GameState
      ctx2 = doEffect(ctx2, eff, 0, 0) as GameState
      for (let i = 0; i < 99; ++i) {
        let eff = getTopEffect(ctx2)
        if (eff == null) {
          break
        }
        ctx2 = setTipSelectionForUser(ctx2, eff, 0, 0) as GameState
        ctx2 = doEffect(ctx2, eff, 0, 0) as GameState
        ctx2 = removeEffect(ctx2, eff.id) as GameState
      }
      for (let i = 0; i < 99; ++i) {
        const eff = getImmediateEffects(ctx2)[0]
        if (eff == null) {
          break
        }
        ctx2 = setTipSelectionForUser(ctx2, eff, 0, 0) as GameState
        ctx2 = doEffect(ctx2, eff, 0, 0) as GameState
        ctx2 = removeEffect(ctx2, eff.id) as GameState
      }
      const scoreA = createPlayerScore(ctx2, playerId, { ges: options?.ges })
      const scoreB = createPlayerScore(ctx2, opponentId, { ges: options?.ges })
      const score = scoreA - scoreB
      return [eff.id, score]
    } catch (e: any) {
      console.warn(`AI計算時例外，忽略:${e.message}`)
    }
    return [eff.id, 0]
  })
  effectScorePairs.sort(([_, s1], [_2, s2]) => s2 - s1)
  if (options?.isMoreThenOrigin) {
    effectScorePairs = effectScorePairs.filter(([_, s]) => s >= score)
  }
  return effectScorePairs
}