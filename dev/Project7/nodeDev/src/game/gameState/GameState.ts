import {
  getCard,
  CardTableComponent,
  getCardIds,
} from "./CardTableComponent"
import { CardState, CardStateComponent, CardStateFn, getCardState, getCardStateValues, mapCardState, setCardState } from "./CardStateComponent";
import { IsBattleComponent } from "./IsBattleComponent";
import { getSetGroupCards, getSetGroupRoot, SetGroupComponent } from "./SetGroupComponent";
import { addDestroyEffect, addImmediateEffect, EffectStackComponent } from "./EffectStackComponent";
import { getPrototype } from "../../script";
import { log } from "../../tool/logger";
import { Action, ActionFn, ActionTitle, ActionTitleFn, BattleBonus, Condition, ConditionFn, ConditionTitle, ConditionTitleFn, getOnSituationFn, LogicTreeActionFn, OnSituationFn, Situation, Text, TextFn, TextSpeicalEffect, TextSpeicalEffectFn } from "../define/Text";
import { AttackSpeed } from "../define";
import { getOpponentPlayerID, PlayerA, PlayerID } from "../define/PlayerID";
import { AbsoluteBaSyou, BattleAreaKeyword, BaSyouKeyword, AbsoluteBaSyouFn } from "../define/BaSyou";
import { CardPrototype, CardColor, RollCostColor } from "../define/CardPrototype";
import { GlobalEffect } from "../define/GlobalEffect";
import { Timing, TIMING_CHART } from "../define/Timing";
import { DestroyReason, Effect, EffectFn } from "../define/Effect";
import { Event } from "../define/Event";
import { DEFAULT_TABLE } from "../../tool/table";
import { BattlePoint, BattlePointFn, DEFAULT_BATTLE_POINT } from "../define/BattlePoint";
import { __, always, filter, flatten, flow, map, pipe, reduce, sum } from "ramda";
import { createBridge } from "../bridge/createBridge";
import { CoinTableComponent, getCardIdByCoinId, getCoins } from "./CoinTableComponent";
import { getItemBaSyou, getItemController, getItemIdsByBasyou, getItemPrototype, ItemTableComponent } from "./ItemTableComponent";
import { Tip } from "../define/Tip";
import { Bridge } from "../../script/bridge";
import { Card } from "../define/Card";
import { ToolFn } from "../tool";

export type PlayerState = {
  id: string;
  turn: number;
  playGCount: number;
  confirmPhase: boolean;
};

export type CardTextState = {
  id: string;
  enabled: boolean;
  cardText: Text;
};


export type GlobalCardState = {
  id: string;
  cardID: string;
  cardTextStates: CardTextState[];
};

export type GameEffectCustom = {
  id: "GameEffectCustom";
  customID: any;
};

export type GameEffect = GameEffectCustom;

// export type GameEffectState = {
//   id: string;
//   effect: GameEffect;
// };

// export type Message = {
//   id: "MessageCustom";
//   value: string;
// };



export type TimingComponent = {
  timing: Timing;
}

export type PlayerStateComponent = {
  playerState: PlayerState[];
}

export type ActivePlayerComponent = {
  activePlayerID: string | null;
}


export type GameState = {
  globalEffectPool: { [key: string]: GlobalEffect[] }
} & SetGroupComponent
  & IsBattleComponent
  & CardTableComponent
  & EffectStackComponent
  & CardStateComponent
  & TimingComponent
  & PlayerStateComponent
  & ActivePlayerComponent
  & CoinTableComponent
  & ItemTableComponent;

export const DEFAULT_GAME_STATE: GameState = {
  cards: {},
  effects: {},
  table: DEFAULT_TABLE,
  chips: {},
  chipProtos: {},
  cardStates: {},
  timing: TIMING_CHART[0],
  playerState: [],
  activePlayerID: null,
  commandEffect: [],
  immediateEffect: [],
  stackEffect: [],
  destroyEffect: [],
  setGroupLink: {},
  isBattle: {},
  coins: {},
  coinId2cardId: {},
  globalEffectPool: {}
}

// globalEffects
function getSituationEffects(ctx: GameState, situation: Situation | null): GlobalEffect[] {
  // getCardIdsByBasyou(ctx, {
  //   id: "AbsoluteBaSyou",
  //   value: [PlayerA, "Gゾーン"]
  // })
  return getCardIds(ctx).map(cardId => getCard(ctx, cardId)).flatMap(card => {
    if (card == null) {
      throw new Error("card not found")
    }
    const proto = getItemPrototype(ctx, card.id)
    const globalEffects = proto.texts.filter(text => text.title[0] == "自動型" && text.title[1] == "恒常")
      .map((text, i) => {
        const cardController = getItemController(ctx, card.id)
        const fn = getOnSituationFn(text)
        const effect: Effect = {
          id: "",
          reason: ["Situation", cardController, card.id, situation],
          text: text
        }
        const ret: [OnSituationFn, Effect] = [fn, effect]
        return ret
      })
      .flatMap(([fn, effect]) => {
        return fn(ctx, effect, createBridge())
      })
    return globalEffects
  })
}

export function getGlobalEffects(ctx: GameState, situation: Situation | null): GlobalEffect[] {
  const key = JSON.stringify(situation)
  const cached = ctx.globalEffectPool[key]
  if (cached) {
    //log("getGlobalEffects", "useCache")
    return cached
  }
  const ges = getSituationEffects(ctx, situation)
  ctx.globalEffectPool[key] = ges
  return ges
}

export function clearGlobalEffects(ctx: GameState) {
  ctx.globalEffectPool = {}
}

// card
export function getCardTexts(ctx: GameState, cardID: string): Text[] {
  const ges = getGlobalEffects(ctx, null)
  const addedTexts = ges.map(e => {
    if (e.cardIds.includes(cardID) && e.title[0] == "AddText") {
      return e.title[1]
    }
  }).filter(v => v) as Text[]
  const prototype = getItemPrototype(ctx, cardID)
  return [...prototype.texts, ...addedTexts];
}

export function getCardCharacteristic(ctx: GameState, cardID: string) {
  const prototype = getItemPrototype(ctx, cardID)
  return prototype.characteristic;
}

export function getCardColor(ctx: GameState, cardID: string): CardColor {
  const prototype = getItemPrototype(ctx, cardID)
  return prototype.color;
}

export function getCardTitle(ctx: GameState, cardID: string): string {
  const prototype = getItemPrototype(ctx, cardID)
  return prototype.title;
}

export function getCardRollCost(ctx: GameState, cardID: string): RollCostColor[] {
  const prototype = getItemPrototype(ctx, cardID)
  return prototype.rollCost;
}

export function getCardRollCostLength(ctx: GameState, cardID: string): number {
  const prototype = getItemPrototype(ctx, cardID)
  const gEffects = getSituationEffects(ctx, null)
  const added = pipe(
    always(gEffects),
    map(ge => {
      if (ge.title[0] == "合計国力＋(１)") {
        return ge.title[1]
      }
      return 0
    }),
    sum
  )()
  return prototype.rollCost.length + added;
}

export function getCardCanPayRollCost(ctx: GameState, playerId: PlayerID, situation: Situation | null): string[] {
  const normalG = getItemIdsByBasyou(ctx, AbsoluteBaSyouFn.of(playerId, "Gゾーン")).map(cardId => {
    return [cardId, getCard(ctx, cardId)] as [string, Card]
  }).filter(([cardId, card]) => card.isRoll != true).map(([cardId]) => cardId)
  return normalG
}

export function getCardBattlePoint(
  ctx: GameState,
  cardID: string
): BattlePoint {
  const globalEffects = getGlobalEffects(ctx, null);
  const card = getCard(ctx, cardID);
  const bonusFromGlobalEffects = globalEffects.map(ge => {
    if (ge.title[0] == "AddText" &&
      ge.cardIds.includes(cardID) &&
      ge.title[1].title[0] == "TextBattleBonus") {
      return ge.title[1].title[1]
    }
    if (ge.title[0] == "＋x／＋x／＋xを得る" && ge.cardIds.includes(cardID)) {
      return ge.title[1]
    }
    return [0, 0, 0] as BattleBonus
  })
  const bonusFormCoin = getCoins(ctx).map(coin => {
    if (coin.title[0] == "BattleBonus" && getCardIdByCoinId(ctx, coin.id) == cardID) {
      return coin.title[1]
    }
    return [0, 0, 0] as BattleBonus
  })
  const prototype = getItemPrototype(ctx, card.id);
  const retBonus = [...bonusFromGlobalEffects, ...bonusFormCoin].reduce(
    BattlePointFn.add,
    prototype.battlePoint
  );
  return retBonus;
}

export function getCardHasSpeicalEffect(
  ctx: GameState,
  a: TextSpeicalEffect,
  cardID: string
): boolean {
  const texts = getCardTexts(ctx, cardID)
  const has = texts.filter(e =>
    e.title[0] == "特殊型" &&
    TextSpeicalEffectFn.isSameKeyword(e.title[1], a)
  ).length > 0
  return has;
}


export function isCardCanReroll(
  ctx: GameState,
  cardID: string,
  situation: Situation | null
): boolean {
  const baSyouKW = getItemBaSyou(ctx, cardID).value[1];
  switch (baSyouKW) {
    case "Gゾーン":
    case "配備エリア":
    case "戦闘エリア2":
    case "戦闘エリア1":
      break;
    default:
      return false;
  }
  const baSyou = getItemBaSyou(ctx, cardID);
  const setGroup = getSetGroupCards(ctx, cardID);
  return true;
}

export function isCardMaster(
  ctx: GameState,
  unitCardID: string,
  cardID: string
): boolean {
  const match = getCardCharacteristic(ctx, unitCardID).match(/専用「(.+?)」/);
  if (match == null) {
    return false;
  }
  const [_, masterName] = match;
  if (masterName != getCardTitle(ctx, cardID)) {
    return false;
  }
  return true;
}

export function getCardBattleArea(
  ctx: GameState,
  cardID: string
): BattleAreaKeyword[] {
  const card = getCard(ctx, cardID);
  if (card == null) {
    throw new Error("card not found");
  }
  const prototype = getItemPrototype(ctx, card.id);
  return prototype.battleArea;
}
// setgroup
export function getSetGroupBattlePoint(ctx: GameState, cardId: string): BattleBonus {
  return pipe(
    always(getSetGroupCards(ctx, cardId)),
    map(setGroupCardID => getCardBattlePoint(ctx, setGroupCardID)),
    reduce(BattlePointFn.add, DEFAULT_BATTLE_POINT),
    BattlePointFn.toBattleBonus
  )()
}

// battleGroup
export function getBattleGroup(
  ctx: GameState,
  baSyou: AbsoluteBaSyou
): string[] {
  return getItemIdsByBasyou(ctx, baSyou).filter((cardId) => {
    return getSetGroupRoot(ctx, cardId) == null;
  })
}

export function getBattleGroupBattlePoint(
  ctx: GameState,
  unitCardIDs: string[]
): number {
  const attackPower = unitCardIDs
    .map((cardID, i): number => {
      // 破壞的單位沒有攻擊力
      const cs = getCardState(ctx, cardID);
      if (cs.destroyReason != null) {
        return 0;
      }
      const card = getCard(ctx, cardID);
      if (card == null) {
        throw new Error("card not found");
      }
      // 横置的單位沒有攻擊力
      if (card.isRoll) {
        return 0;
      }
      const [melee, range, _] = getSetGroupBattlePoint(ctx, cardID)
      // 第一位是格鬥力
      if (i == 0) {
        return melee
      }
      // 其它的是射擊力
      return range
    }).reduce((acc, c) => acc + c, 0);
  return attackPower;
}

export function isABattleGroup(
  ctx: GameState,
  a: TextSpeicalEffect,
  cardID: string
): boolean {
  const baSyou = getItemBaSyou(ctx, cardID);
  const battleGroup = getBattleGroup(ctx, baSyou);
  return (
    battleGroup
      .map((cardID) => {
        // 其中一張卡有就行了
        const setGroupCards = getSetGroupCards(ctx, cardID);
        for (const cardGroupCardID of setGroupCards) {
          if (getCardHasSpeicalEffect(ctx, a, cardGroupCardID)) {
            return true;
          }
        }
        return false;
      })
      .reduce((acc, c) => {
        return acc && c;
      }) || false
  );
}

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
        const changedCardState = willGuardUnits.map((cardID): CardState => {
          const cs = getCardState(ctx, cardID);
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
            const gameEvent: Event = {
              title: ["破壊された場合", reason],
              cardID: cs.id
            };
            ctx = triggerTextEvent(ctx, gameEvent)
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
          const gameEvent: Event = {
            title: ["戦闘ダメージを受けた場合"],
            cardID: cs.id,
          };
          ctx = triggerTextEvent(ctx, gameEvent)
          return {
            ...cs,
            damage: nextDamage,
          };
        });
        // 套用傷害
        ctx = changedCardState.reduce((ctx, cs) => {
          return setCardState(ctx, cs.id, cs) as GameState
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
  const guardPlayerID = getOpponentPlayerID(attackPlayerID)
  const attackUnits = getBattleGroup(ctx, AbsoluteBaSyouFn.of(attackPlayerID, where));
  const attackPower = getBattleGroupBattlePoint(ctx, attackUnits);
  const guardUnits = getBattleGroup(ctx, AbsoluteBaSyouFn.of(guardPlayerID, where));
  const guardPower = getBattleGroupBattlePoint(ctx, guardUnits);
  ctx = doDamage(ctx, speedPhase, attackPlayerID, guardPlayerID, attackUnits, guardUnits, attackPower)
  ctx = doDamage(ctx, speedPhase, guardPlayerID, attackPlayerID, guardUnits, attackUnits, guardPower)
  ctx = updateDestroyEffect(ctx);
  return ctx;
}

function getConditionTitleFn(condition: Condition, options: { isPlay?: boolean }): ConditionTitleFn {
  if (typeof condition.title == "string") {
    return ConditionFn.getTitleFn(condition)
  }
  switch (condition.title[0]) {
    case "合計国力〔x〕":
      return function (ctx: GameState, effect: Effect): Tip[] {
        const playerId = EffectFn.getPlayerID(effect)

        return []
      }
    default:
      return function (ctx: GameState, effect: Effect): Tip[] {
        return []
      }
  }
}

function getActionTitleFn(action: Action): ActionTitleFn {
  if (typeof action.title == "string") {
    return ActionFn.getTitleFn(action)
  }
  switch (action.title[0]) {
    case "(このカード)を(リロール)する": {
      const [_, cardIds, isRollStr] = action.title
      const isRoll = isRollStr == "ロール"
      return function (ctx: GameState, effect: Effect): GameState {

        return ctx
      }
    }
  }
}

export function doEffect(
  ctx: GameState,
  effect: Effect,
  logicId: number,
  conditionIds: string[],
): GameState {
  const conditions = conditionIds.map(id => TextFn.getCondition(effect.text, id))
  const bridge = createBridge()
  const processCondition = (ctx: GameState) => pipe(
    always(conditions),
    map(condition => ConditionFn.getActionTitleFns(condition, getActionTitleFn)),
    flatten,
    reduce((ctx, fn) => fn(ctx, effect, bridge), ctx)
  )
  const processLogicAction = (ctx: GameState) => pipe(
    always(TextFn.getLogicTreeAction(effect.text, logicId)),
    lta => LogicTreeActionFn.getActionTitleFns(lta, getActionTitleFn),
    reduce((ctx, fn) => fn(ctx, effect, bridge), ctx)
  )
  ctx = processCondition(ctx)()
  ctx = processLogicAction(ctx)()
  return ctx;
}

// 觸發事件腳本
// 在每次事件發生時都要呼叫
// 起動型技能
export function triggerTextEvent(
  ctx: GameState,
  evt: Event
): GameState {
  const bridge = createBridge()
  return pipe(
    always(getCardIds(ctx)),
    map(cardId => ({ cardId: cardId, texts: getCardTexts(ctx, cardId) })),
    reduce((ctx, { cardId, texts }) => {
      return pipe(
        always(texts),
        reduce((ctx, text) => {
          const effect: Effect = {
            id: ToolFn.getUUID("triggerTextEvent"),
            reason: ["Event", cardId, evt],
            text: text
          }
          return TextFn.getOnEventFn(text)(ctx, effect, bridge)
        }, ctx)
      )()
    }, ctx)
  )()
}

export function updateDestroyEffect(ctx: GameState): GameState {
  // 將所有破壞效果加入破壞用堆疊
  // 加入破壞用堆疊後，主動玩家就必須決定解決順序
  // 決定後，依順序將所有效果移到正在解決中的堆疊，並重設切入的旗標，讓玩家可以在堆疊解決中可以再次切入
  getCardStateValues(ctx).reduce((ctx, cs) => {
    if (cs.destroyReason) {
      const effect: Effect = {
        id: ToolFn.getUUID("updateDestroyEffect"),
        reason: ["Destroy", cs.destroyReason.playerID, cs.id, cs.destroyReason],
        text: {
          id: "",
          title: [],
        }
      }
      ctx = addDestroyEffect(ctx, effect) as GameState
      return ctx
    }
    const [_, _2, hp] = getSetGroupBattlePoint(ctx, cs.id)
    if (hp <= cs.damage) {
      const destroyReason: DestroyReason = {
        id: "マイナスの戦闘修正",
        playerID: getItemController(ctx, cs.id)
      }
      const effect: Effect = {
        id: ToolFn.getUUID("updateDestroyEffect"),
        reason: ["Destroy", destroyReason.playerID, cs.id, destroyReason],
        text: {
          id: "",
          title: [],
        }
      }
      ctx = addDestroyEffect(ctx, effect) as GameState
      return ctx
    }
    return ctx
  }, ctx)
  return ctx;
}