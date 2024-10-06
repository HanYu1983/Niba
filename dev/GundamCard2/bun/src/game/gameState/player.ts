import { pipe, always, map, sum, lift } from "ramda";
import { logCategory } from "../../tool/logger";
import { AttackSpeed } from "../define";
import { AbsoluteBaSyouFn, BaSyouKeyword, BaSyouKeywordFn } from "../define/BaSyou";
import { DestroyReason, EffectFn } from "../define/Effect";
import { ItemState } from "../define/ItemState";
import { PlayerID, PlayerIDFn } from "../define/PlayerID";
import { isBattleGroupHasA, getBattleGroup, getBattleGroupBattlePoint } from "./battleGroup";
import { GameState } from "./GameState";
import { getItemState, setItemState } from "./ItemStateComponent";
import { GameEvent } from "../define/GameEvent";
import { getSetGroupBattlePoint } from "./setGroup";
import { doTriggerEvent } from "./doTriggerEvent";
import { StrBaSyouPair } from "../define/Tip";
import { doItemMove } from "./doItemMove";
import { createStrBaSyouPair, getItemController, getItemIdsByBasyou, getItemPrototype } from "./ItemTableComponent";
import { doItemSetDestroy } from "./doItemSetDestroy";
import { getCardTipStrBaSyouPairs } from "./doEffect";
import { doCountryDamage } from "./doCountryDamage";
import { addDestroyEffect, getCutInDestroyEffects } from "./EffectStackComponent";
import { createDestroyEffect } from "./createDestroyEffect";
import { getCard } from "./CardTableComponent";

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

function doDamage(
  ctx: GameState,
  speedPhase: number,
  currentAttackPlayerID: PlayerID,
  currentGuardPlayerID: PlayerID,
  willAttackUnits: string[],
  willGuardUnits: string[],
  willAttackPower: number
): GameState {
  logCategory("handleAttackDamage", "speed", speedPhase);
  logCategory("handleAttackDamage", "willAttackUnits", willAttackUnits);
  logCategory("handleAttackDamage", "willGuardUnits", willGuardUnits);
  logCategory("handleAttackDamage", "willAttackPower", willAttackPower);
  if (willAttackUnits.length) {
    // 判斷速度1速度2是否可攻擊
    const hasSpeedAttack = isBattleGroupHasA(ctx, ["速攻"], willAttackUnits[0]);
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
        const changedCardState = willGuardUnits.map((cardID): ItemState => {
          const cs = getItemState(ctx, cardID);
          if (currentAttackPower <= 0) {
            return cs;
          }
          const [_, _2, hp] = getSetGroupBattlePoint(ctx, cardID);

          const live = hp - cs.damage;
          if (live <= 0) {
            return cs;
          }
          currentAttackPower -= live;
          if (currentAttackPower >= 0) {
            const reason: DestroyReason = {
              id: "戦闘ダメージ",
              playerID: currentAttackPlayerID,
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
          const nextLive = -currentAttackPower;
          const nextDamage = hp - nextLive;
          // 傷害用完了, 重設為0
          currentAttackPower = 0;
          const gameEvent: GameEvent = {
            title: ["戦闘ダメージを受けた場合"],
            cardIds: [cs.id],
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

      if (willGuardUnits.length == 0 || isBattleGroupHasA(ctx, ["強襲"], willAttackUnits[0])) {
        ctx = doCountryDamage(ctx, currentGuardPlayerID, currentAttackPower)
        {
          const gameEvent: GameEvent = {
            title: ["このカードの部隊が敵軍本国に戦闘ダメージを与えた場合"],
            cardIds: willAttackUnits,
          };
          ctx = doTriggerEvent(ctx, gameEvent)
        }
        {
          const gameEvent: GameEvent = {
            title: ["自軍本国に戦闘ダメージが与えられた場合"],
            playerId: currentGuardPlayerID
          };
          ctx = doTriggerEvent(ctx, gameEvent)
        }
      }
      // 攻擊方可以攻擊本國
      // 若傷害沒有用完, 攻擊本國
      // if (
      //   currentAttackPower > 0 ||
      //   // 對方有防禦機體的情況, 有強襲就攻擊本國
      //   (willGuardUnits.length && isBattleGroupHasA(ctx, ["強襲"], willAttackUnits[0]))
      // ) {
      //   // 本國傷害
      //   logCategory("handleAttackDamage", "attack 本国", currentAttackPower);
      //   const from = AbsoluteBaSyouFn.of(currentGuardPlayerID, "本国")
      //   const pairs = getItemIdsByBasyou(ctx, from).map(itemId => {
      //     return [itemId, from] as StrBaSyouPair
      //   }).slice(0, currentAttackPower)
      //   const to = AbsoluteBaSyouFn.of(currentGuardPlayerID, "捨て山")
      //   for (const pair of pairs) {
      //     ctx = doItemMove(ctx, to, pair)
      //   }
      // }
    }
  }
  return ctx
}

export function doPlayerAttack(
  ctx: GameState,
  attackPlayerID: PlayerID,
  where: BaSyouKeyword,
  speedPhase: AttackSpeed
): GameState {
  const guardPlayerID = PlayerIDFn.getOpponent(attackPlayerID)
  const attackUnits = getBattleGroup(ctx, AbsoluteBaSyouFn.of(attackPlayerID, where));
  const attackPower = getBattleGroupBattlePoint(ctx, attackUnits);
  const guardUnits = getBattleGroup(ctx, AbsoluteBaSyouFn.of(guardPlayerID, where));
  const guardPower = getBattleGroupBattlePoint(ctx, guardUnits);
  ctx = doDamage(ctx, speedPhase, attackPlayerID, guardPlayerID, attackUnits, guardUnits, attackPower)
  ctx = doDamage(ctx, speedPhase, guardPlayerID, attackPlayerID, guardUnits, attackUnits, guardPower);
  [...attackUnits, ...guardUnits].forEach(cardId => {
    const itemState = getItemState(ctx, cardId)
    const [_, _2, hp] = getSetGroupBattlePoint(ctx, cardId)
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

export function getPlayerDestroyIds(ctx: GameState, playerId: PlayerID): string[] {
  return getCutInDestroyEffects(ctx).map(e => EffectFn.getCardID(e)).filter(itemId => getItemController(ctx, itemId) == playerId)
}

export function getPlayerUnitIds(ctx: GameState, playerId: PlayerID): string[] {
  return lift(AbsoluteBaSyouFn.of)([playerId], BaSyouKeywordFn.getBaAll()).flatMap(basyou => getItemIdsByBasyou(ctx, basyou)).filter(itemId => getItemPrototype(ctx, itemId).category == "ユニット")
}

export function getPlayerCharacterIds(ctx: GameState, playerId: PlayerID): string[] {
  return lift(AbsoluteBaSyouFn.of)([playerId], BaSyouKeywordFn.getBaAll()).flatMap(basyou => getItemIdsByBasyou(ctx, basyou)).filter(itemId => getItemPrototype(ctx, itemId).category == "キャラクター")
}

export function getPlayerOperationIds(ctx: GameState, playerId: PlayerID): string[] {
  return lift(AbsoluteBaSyouFn.of)([playerId], BaSyouKeywordFn.getBaAll()).flatMap(basyou => getItemIdsByBasyou(ctx, basyou)).filter(itemId => getItemPrototype(ctx, itemId).category == "オペレーション")
}

export function createPlayerScore(ctx: GameState, playerId: string): number {
  const units = getPlayerUnitIds(ctx, playerId)
  const chars = getPlayerCharacterIds(ctx, playerId)
  const gs = getPlayerGIds(ctx, playerId)
  const ops = getPlayerOperationIds(ctx, playerId)
  const hands = getPlayerHandIds(ctx, playerId)
  const destroyIds = getPlayerDestroyIds(ctx, playerId)
  const gScore = gs.length * 3
  const unitScore = units.length * 5
  const charScore = chars.length
  const opScore = Math.max(2, ops.length) * 3
  const handScore = hands.length * 3
  const destroyScore = destroyIds.length * 10 * -1
  const rollScore = [...gs, ...units].filter(itemId => getCard(ctx, itemId).isRoll).length * -5
  const bpScore = units.map(id => {
    if(getCard(ctx, id).isRoll){
      return 0
    }
    const [atk, range, hp] = getSetGroupBattlePoint(ctx, id)
    return atk + range + hp
  }).reduce((acc, c) => acc + c, 0)
  return gScore + unitScore + charScore + opScore + handScore + destroyScore + rollScore + bpScore
}