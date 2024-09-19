import { pipe, always, map, sum } from "ramda";
import { log } from "../../tool/logger";
import { AttackSpeed } from "../define";
import { AbsoluteBaSyouFn, BaSyouKeyword } from "../define/BaSyou";
import { DestroyReason } from "../define/Effect";
import { ItemState } from "../define/ItemState";
import { PlayerID, PlayerIDFn } from "../define/PlayerID";
import { isABattleGroup, getBattleGroup, getBattleGroupBattlePoint } from "./battleGroup";
import { GameState } from "./GameState";
import { getItemState, setItemState } from "./ItemStateComponent";
import { getCardLikeItemIdsByBasyou, getItemIdsByBasyou } from "./ItemTableComponent";
import { GameEvent } from "../define/GameEvent";
import { getSetGroupBattlePoint } from "./setGroup";
import { triggerEvent } from "./triggerEvent";

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
    map(baSyou => getCardLikeItemIdsByBasyou(ctx, baSyou).length),
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
  log("handleAttackDamage", "speed", speedPhase);
  log("handleAttackDamage", "willAttackUnits", willAttackUnits);
  log("handleAttackDamage", "willGuardUnits", willGuardUnits);
  log("handleAttackDamage", "willAttackPower", willAttackPower);
  if (willAttackUnits.length) {
    // 判斷速度1速度2是否可攻擊
    const hasSpeedAttack = isABattleGroup(ctx, ["速攻"], willAttackUnits[0]);
    if (
      // 有速攻的情況在速度1
      (hasSpeedAttack && speedPhase == 1) ||
      // 沒速攻的情況在速度2
      (hasSpeedAttack == false && speedPhase == 2)
    ) {
      let currentAttackPower = willAttackPower;
      log("handleAttackDamage", "attack", currentAttackPower);
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
            const gameEvent: GameEvent = {
              title: ["破壊された場合", reason],
              cardIds: [cs.id]
            };
            ctx = triggerEvent(ctx, gameEvent)
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
          ctx = triggerEvent(ctx, gameEvent)
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
      // 攻擊方可以攻擊本國
      // 若傷害沒有用完, 攻擊本國
      if (
        currentAttackPower > 0 ||
        // 對方有防禦機體的情況, 有強襲就攻擊本國
        (willGuardUnits.length && isABattleGroup(ctx, ["強襲"], willAttackUnits[0]))
      ) {
        // 本國傷害
        log("handleAttackDamage", "attack 本国", currentAttackPower);
        let table = ctx.table;
        let fromCardStackID = AbsoluteBaSyouFn.toString(AbsoluteBaSyouFn.of(currentGuardPlayerID, "本国"))
        let toCardStackID = AbsoluteBaSyouFn.toString(AbsoluteBaSyouFn.of(currentGuardPlayerID, "捨て山"))
        table = {
          ...table,
          cardStack: {
            ...table.cardStack,
            [fromCardStackID]:
              table.cardStack[fromCardStackID].slice(currentAttackPower),
            [toCardStackID]: [
              ...table.cardStack[fromCardStackID].slice(
                0,
                currentAttackPower
              ),
              ...table.cardStack[toCardStackID],
            ],
          },
        };
        ctx = {
          ...ctx,
          table: table,
        };
      }
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
  ctx = doDamage(ctx, speedPhase, guardPlayerID, attackPlayerID, guardUnits, attackUnits, guardPower)
  return ctx;
}