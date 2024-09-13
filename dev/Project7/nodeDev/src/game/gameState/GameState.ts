import {
  getCard,
  getCardBaSyou,
  getCardController,
  CardTableComponent,
  getCardIds,
  getCardIdsByBasyou,
} from "./CardTableComponent"
import { CardStateComponent, getCardState, mapCardState } from "./CardStateComponent";
import { IsBattleComponent } from "./IsBattleComponent";
import { getSetGroupCards, getSetGroupRoot, SetGroupComponent } from "./SetGroupComponent";
import { EffectStackComponent } from "./EffectStackComponent";
import { getPreloadPrototype } from "../../script";
import { log } from "../../tool/logger";
import { Bridge } from "../../script/bridge";
import { Action, ActionFn, ActionTitle, ActionTitleFn, Condition, ConditionFn, ConditionTitle, ConditionTitleFn, getOnSituationFn, LogicTreeActionFn, OnSituationFn, Situation, Text, TextFn, TextTokuSyuKouKa } from "../define/Text";
import { AttackSpeed } from "../define";
import { getOpponentPlayerID, PlayerA, PlayerID } from "../define/PlayerID";
import { AbsoluteBaSyou, BattleAreaKeyword, BaSyouKeyword, getBaSyouID } from "../define/BaSyou";
import { CardPrototype, CardColor } from "../define/CardPrototype";
import { GlobalEffect } from "../define/GlobalEffect";
import { Timing, TIMING_CHART } from "../define/Timing";
import { DestroyReason, Effect, EffectFn } from "../define/Effect";
import { Event } from "../define/Event";
import { DEFAULT_TABLE } from "../../tool/table";
import { BattlePoint, BattlePointFn } from "../define/BattlePoint";
import { __, always, flatten, flow, map, pipe, reduce } from "ramda";

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

export type CardState = {
  id: string; // card.id
  //isChip: boolean;
  damage: number;
  destroyReason: DestroyReason | null;
  //setGroupID: string;
  flags: string[];
  cardTextStates: CardTextState[];
  //prototype: CardPrototype;
};

export const DEFAULT_CARD_STATE: CardState = {
  id: "",
  //isChip: true,
  damage: 0,
  destroyReason: null,
  //setGroupID: "",
  flags: [],
  cardTextStates: [],
  // prototype: DEFAULT_CARD_PROTOTYPE,
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
  globalCardState: GlobalCardState[];
  stackEffectMemory: Effect[];
  // 專門給破壞效果用的用的堆疊
  // 傷害判定結束時，將所有破壞產生的廢棄效果丟到這，重設「決定解決順序」的旗標為真
  // 如果這個堆疊一有值時並「決定解決順序」為真時，就立刻讓主動玩家決定解決順序，決定完後，將旗標設為假
  // 旗標為假時，才能才能開放給玩家切入
  // 這個堆疊解決完後，才回復到本來的堆疊的解決程序
  destroyEffect: Effect[];
  chipPool: { [key: string]: CardPrototype };
} & SetGroupComponent
  & IsBattleComponent
  & CardTableComponent
  & EffectStackComponent
  & CardStateComponent
  & TimingComponent
  & PlayerStateComponent
  & ActivePlayerComponent;

export const DEFAULT_GAME_STATE: GameState = {
  cards: {},
  effects: {},
  globalCardState: [],
  table: DEFAULT_TABLE,
  cardStates: {},
  timing: TIMING_CHART[0],
  playerState: [],
  activePlayerID: null,
  commandEffect: [],
  immediateEffect: [],
  stackEffect: [],
  stackEffectMemory: [],
  destroyEffect: [],
  setGroupLink: {},
  isBattle: {},
  chipPool: {},
}

export function getOpponentBattleArea(baSyou: AbsoluteBaSyou): AbsoluteBaSyou {
  const {
    value: [playerID, baSyouKW],
  } = baSyou;
  return {
    id: "AbsoluteBaSyou",
    value: [getOpponentPlayerID(playerID), baSyouKW],
  };
}

export function getCardCharacteristic(ctx: GameState, cardID: string) {
  const card = getCard(ctx, cardID);
  if (card == null) {
    throw new Error("card not found");
  }
  const prototype = getPreloadPrototype(card.protoID);
  return prototype.characteristic;
}

export function getCardColor(ctx: GameState, cardID: string): CardColor {
  const card = getCard(ctx, cardID);
  if (card == null) {
    throw new Error("card not found");
  }
  const prototype = getPreloadPrototype(card.protoID);
  return prototype.color;
}

export function getCardTitle(ctx: GameState, cardID: string): string {
  const card = getCard(ctx, cardID);
  if (card == null) {
    throw new Error("card not found");
  }
  const prototype = getPreloadPrototype(card.protoID);
  return prototype.title;
}

function createBridge(ctx: GameState): Bridge {
  const bridge: Bridge = {
    ctx: ctx,
    getEffectCardID: function (effect: Effect): string {
      return EffectFn.getCardID(effect)
    },
    getEffectPlayerID: function (effect: Effect): PlayerID {
      return EffectFn.getPlayerID(effect)
    },
    getMyUnitIds: function (playerID: PlayerID): string[] {
      return getCardIds(ctx);
    },
    getFunctionByAction: function (action: ActionTitle): (ctx: Bridge, effect: Effect) => Bridge {
      throw new Error("Function not implemented.");
    },
    cutIn: function (effect: Effect): Bridge {
      throw new Error("Function not implemented.");
    }
  }
  return bridge
}

export function getSituationEffects(ctx: GameState, situation: Situation | null): GlobalEffect[] {
  // getCardIdsByBasyou(ctx, {
  //   id: "AbsoluteBaSyou",
  //   value: [PlayerA, "Gゾーン"]
  // })
  return getCardIds(ctx).map(cardId => getCard(ctx, cardId)).flatMap(card => {
    if (card == null) {
      throw new Error("card not found")
    }
    const proto = getPreloadPrototype(card.protoID)
    const globalEffects = proto.texts.filter(text => text.title[0] == "自動型" && text.title[1] == "恒常")
      .map((text, i) => {
        const cardController = getCardController(ctx, card.id)
        const fn = getOnSituationFn(text)
        const effect: Effect = {
          id: "",
          reason: ["PlayText", cardController, ["origin", card.id, i]],
          text: text
        }
        const ret: [OnSituationFn, Effect] = [fn, effect]
        return ret
      })
      .flatMap(([fn, effect]) => {
        const bridge = createBridge(ctx)
        return fn(bridge, effect, situation)
      })
    return globalEffects
  })
}

export function getCardBattlePoint(
  ctx: GameState,
  cardID: string
): BattlePoint {
  const globalEffects = getSituationEffects(ctx, null);
  const card = getCard(ctx, cardID);
  if (card == null) {
    throw new Error("card not found");
  }
  const bonusFromGlobalEffects = globalEffects.map(ge => {
    if (ge.type == "AddText" &&
      ge.cardIds.includes(cardID) &&
      ge.text.title[0] == "TTextBattleBonus") {
      return ge.text.title[1]
    }
    return [0, 0, 0] as BattlePoint
  })
  const prototype = getPreloadPrototype(card.protoID);
  // const bonusFromCardState = ctx.globalCardState
  //   .filter((cs) => cs.cardID == cardID)
  //   .flatMap((cs) => cs.cardTextStates.map((cts) => cts.cardText))
  //   .filter(
  //     (ct) =>
  //       ct.id == "CardTextCustom" &&
  //       ct.customID.id == "CardTextCustomIDBattleBonus"
  //   )
  //   .map((ct) => {
  //     if (
  //       ct.id != "CardTextCustom" ||
  //       ct.customID.id != "CardTextCustomIDBattleBonus"
  //     ) {
  //       throw new Error("must be CardTextCustomIDBattleBonus");
  //     }
  //     return ct.customID.battleBonus;
  //   });
  // const bonusFromCoin = ctx.table.tokens
  //   .filter((t) => {
  //     if (t.position.id != "TokenPositionCard") {
  //       return false;
  //     }
  //     if (t.position.cardID != cardID) {
  //       return false;
  //     }
  //     const coin = t.protoID as Coin;
  //     if (coin == null) {
  //       return false;
  //     }
  //     if (coin.id != "CoinBattleBonus") {
  //       return false;
  //     }
  //     return true;
  //   })
  //   .map((t) => {
  //     const coin = t.protoID as Coin;
  //     if (coin.id != "CoinBattleBonus") {
  //       throw new Error("must be CoinBattleBonus");
  //     }
  //     return coin.battleBonus;
  //   });
  const retBonus = [...bonusFromGlobalEffects].reduce(
    BattlePointFn.add,
    prototype.battlePoint
  );
  return retBonus;
}

export function getBattleGroup(
  ctx: GameState,
  baSyou: AbsoluteBaSyou
): string[] {
  return (
    ctx.table.cardStack[getBaSyouID(baSyou)]
      ?.filter((cardId) => {
        return getSetGroupRoot(ctx, cardId) == null;
      })
      .map((rootCardId) => {
        return rootCardId
      }) || []
  );
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
      if (card.tap) {
        return 0;
      }
      const setGroupCards = getSetGroupCards(ctx, cardID);
      const power = setGroupCards
        .map((setGroupCardID) => {
          const [melee, range] = getCardBattlePoint(ctx, setGroupCardID);
          if (melee == "*") {
            return 0;
          }
          if (i == 0) {
            return melee || 0;
          }
          if (range == "*") {
            return 0;
          }
          return range || 0;
        })
        .reduce((a, b) => a + b);
      return power;
    }).reduce((acc, c) => acc + c, 0);
  return attackPower;
}

export function hasTokuSyouKouKa(
  ctx: GameState,
  a: TextTokuSyuKouKa,
  cardID: string
): boolean {
  
  // pipe(
  //   always(getCard(ctx, cardID)),
  //   card=>getPreloadPrototype
  // )

  // const cs = getCardState(ctx, cardID);
  // const gcs = ctx.globalCardState.filter((cs) => {
  //   return cs.cardID == cardID;
  // });
  // const texts = [cs, ...gcs]
  //   .reduce((acc, cs) => acc.concat(cs.cardTextStates), [])
  //   .map((cts) => cts.cardText);
  // const has =
  //   texts.find((text) => {
  //     if (text.id != "特殊型") {
  //       return false;
  //     }
  //     if (text.description[0] != a[0]) {
  //       return false;
  //     }
  //     return true;
  //   }) != null;
  // return has;
  return false;
}

export function isABattleGroup(
  ctx: GameState,
  a: TextTokuSyuKouKa,
  cardID: string
): boolean {
  const baSyou = getCardBaSyou(ctx, cardID);
  const battleGroup = getBattleGroup(ctx, baSyou);
  return (
    battleGroup
      .map((cardID) => {
        // 其中一張卡有就行了
        const setGroupCards = getSetGroupCards(ctx, cardID);
        for (const cardGroupCardID of setGroupCards) {
          if (hasTokuSyouKouKa(ctx, a, cardGroupCardID)) {
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

export function isCanReroll(
  ctx: GameState,
  condition: any,
  cardID: string
): boolean {
  const baSyouKW = getCardBaSyou(ctx, cardID).value[1];
  switch (baSyouKW) {
    case "Gゾーン":
    case "配備エリア":
    case "戦闘エリア（右）":
    case "戦闘エリア（左）":
      break;
    default:
      return false;
  }
  const baSyou = getCardBaSyou(ctx, cardID);
  const setGroup = getSetGroupCards(ctx, cardID);
  return true;
}

export function isOpponentHasBattleGroup(
  ctx: GameState,
  cardID: string
): boolean {
  const controller = getCardController(ctx, cardID);
  const opponentPlayerID = getOpponentPlayerID(controller);
  const battleAreas: AbsoluteBaSyou[] = [
    { id: "AbsoluteBaSyou", value: [opponentPlayerID, "戦闘エリア（右）"] },
    { id: "AbsoluteBaSyou", value: [opponentPlayerID, "戦闘エリア（左）"] },
  ];
  return (
    battleAreas.reduce((acc: string[], battleArea) => {
      return acc.concat(ctx.table.cardStack[getBaSyouID(battleArea)] || []);
    }, []).length != 0
  );
}

export function isMaster(
  ctx: GameState,
  unitCardID: string,
  cardID: string
): boolean {
  const match = getCardCharacteristic(ctx, unitCardID)
    .join("|")
    .match(/専用「(.+?)」/);
  if (match == null) {
    return false;
  }
  const [_, masterName] = match;
  if (masterName != getCardTitle(ctx, cardID)) {
    return false;
  }
  return true;
}

// export function getCardCoins(ctx: GameState, cardID: string): Coin[] {
//   return ctx.table.tokens
//     .filter((token) => {
//       if (token.position.id != "TokenPositionCard") {
//         return false;
//       }
//       if (token.position.cardID != cardID) {
//         return false;
//       }
//       return true;
//     })
//     .map((token) => token.protoID as Coin);
// }

// export function getCardStateIterator(
//   ctx: GameState
// ): [string, CardTextState[]][] {
//   const converGlobalCardState = ctx.globalCardState.map((gs) => {
//     return {
//       id: gs.cardID,
//       cardTextStates: gs.cardTextStates,
//     };
//   });
//   return [...ctx.cardState, ...converGlobalCardState].map((v) => {
//     return [v.id, v.cardTextStates] as [string, CardTextState[]];
//   });
// }


export function getCardBattleArea(
  ctx: GameState,
  cardID: string
): BattleAreaKeyword[] {
  const card = getCard(ctx, cardID);
  if (card == null) {
    throw new Error("card not found");
  }
  const prototype = getPreloadPrototype(card.protoID);
  return prototype.battleArea;
}

function genActionTitleFn(action: Action): ActionTitleFn {
  if (typeof action.title == "string") {
    return ActionFn.getTitleFn(action)
  }
  return function (ctx: Bridge, effect: Effect) {
    return ctx
  }
}

export function doEffect(
  ctx: GameState,
  effect: Effect,
  logicId: number,
  conditionIds: string[],
): GameState {
  const conditions = conditionIds.map(id => TextFn.getCondition(effect.text, id))
  const bridge = createBridge(ctx)
  // conditions
  //   .flatMap(condition => ConditionFn.getActionTitleFns(condition, genActionTitleFn))
  //   .reduce((ctx, fn) => {
  //     return fn(ctx, effect)
  //   }, bridge)
  // LogicTreeActionFn.getActionTitleFns(TextFn.getLogicTreeAction(effect.text, logicId), genActionTitleFn)
  //   .reduce((ctx, fn) => {
  //     return fn(ctx, effect)
  //   }, bridge)

  const processCondition = pipe(
    always(conditions),
    map(condition => ConditionFn.getActionTitleFns(condition, genActionTitleFn)),
    flatten,
    reduce((ctx, fn) => fn(ctx, effect), bridge)
  )

  const processLogicAction = pipe(
    always(TextFn.getLogicTreeAction(effect.text, logicId)),
    lta => LogicTreeActionFn.getActionTitleFns(lta, genActionTitleFn),
    reduce((ctx, fn) => fn(ctx, effect), bridge)
  )

  processCondition()
  processLogicAction()

  return bridge.ctx;
}

export function handleAttackDamage(
  ctx: GameState,
  attackPlayerID: string,
  guardPlayerID: string,
  where: BaSyouKeyword,
  speed: AttackSpeed
): GameState {
  const attackUnits = getBattleGroup(ctx, {
    id: "AbsoluteBaSyou",
    value: [attackPlayerID, where],
  });
  const attackPower = getBattleGroupBattlePoint(ctx, attackUnits);
  const guardUnits = getBattleGroup(ctx, {
    id: "AbsoluteBaSyou",
    value: [guardPlayerID, where],
  });
  const guardPower = getBattleGroupBattlePoint(ctx, guardUnits);
  const willTriggerEvent: Event[] = [];
  {
    const currentAttackPlayerID = attackPlayerID;
    const currentGuardPlayerID = guardPlayerID;
    const willAttackUnits = attackUnits;
    const willGuardUnits = guardUnits;
    const willAttackPower = attackPower;
    log("handleAttackDamage", "speed", speed);
    log("handleAttackDamage", "baSyou", where);
    log("handleAttackDamage", "willAttackUnits", willAttackUnits);
    log("handleAttackDamage", "willGuardUnits", willGuardUnits);
    log("handleAttackDamage", "willAttackPower", willAttackPower);
    if (willAttackUnits.length) {
      // 判斷速度1速度2是否可攻擊
      const hasSpeedAttack = isABattleGroup(ctx, ["速攻"], willAttackUnits[0]);
      if (
        // 有速攻的情況在速度1
        (hasSpeedAttack && speed == 1) ||
        // 沒速攻的情況在速度2
        (hasSpeedAttack == false && speed == 2)
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
            const setGroupCards = getSetGroupCards(ctx, cardID);
            const hp = setGroupCards
              .map((setGroupCardID) => {
                const [_2, _3, hp] = getCardBattlePoint(ctx, setGroupCardID);
                if (hp == "*") {
                  return 0;
                }
                return hp;
              })
              .reduce((a, b) => a + b);
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
              willTriggerEvent.push(gameEvent);
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
            willTriggerEvent.push(gameEvent);
            return {
              ...cs,
              damage: nextDamage,
            };
          });
          // 套用傷害
          ctx = mapCardState(ctx, (_, cs1) => {
            for (const cs2 of changedCardState) {
              if (cs1.id == cs2.id) {
                return cs2;
              }
            }
            return cs1;
          }) as GameState
          // const cardState = ctx.gameState.cardState.map((cs1) => {
          //   for (const cs2 of changedCardState) {
          //     if (cs1.id == cs2.id) {
          //       return cs2;
          //     }
          //   }
          //   return cs1;
          // });
          // ctx = {
          //   ...ctx,
          //   gameState: {
          //     ...ctx.gameState,
          //     cardState: cardState,
          //   },
          // };
        }
        // 攻擊方可以攻擊本國
        // 若傷害沒有用完, 攻擊本國
        if (
          currentAttackPower > 0 ||
          // 對方有防禦機體的情況, 有強襲就攻擊本國
          (willGuardUnits.length &&
            isABattleGroup(ctx, ["強襲"], willAttackUnits[0]))
        ) {
          // 本國傷害
          log("handleAttackDamage", "attack 本国", currentAttackPower);
          let table = ctx.table;
          let fromCardStackID = getBaSyouID({
            id: "AbsoluteBaSyou",
            value: [currentGuardPlayerID, "本国"],
          });
          let toCardStackID = getBaSyouID({
            id: "AbsoluteBaSyou",
            value: [currentGuardPlayerID, "捨て山"],
          });
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
  }
  {
    const currentAttackPlayerID = guardPlayerID;
    const currentGuardPlayerID = attackPlayerID;
    const willAttackUnits = guardUnits;
    const willGuardUnits = attackUnits;
    const willAttackPower = guardPower;
    log("handleAttackDamage", "speed", speed);
    log("handleAttackDamage", "baSyou", where);
    log("handleAttackDamage", "willAttackUnits", willAttackUnits);
    log("handleAttackDamage", "willGuardUnits", willGuardUnits);
    log("handleAttackDamage", "willAttackPower", willAttackPower);
    if (willAttackUnits.length) {
      // 判斷速度1速度2是否可攻擊
      const hasSpeedAttack = isABattleGroup(ctx, ["速攻"], willAttackUnits[0]);
      if (
        // 有速攻的情況在速度1
        (hasSpeedAttack && speed == 1) ||
        // 沒速攻的情況在速度2
        (hasSpeedAttack == false && speed == 2)
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
            const setGroupCards = getSetGroupCards(ctx, cardID);
            const hp = setGroupCards
              .map((setGroupCardID) => {
                const [_2, _3, hp] = getCardBattlePoint(ctx, setGroupCardID);
                if (hp == "*") {
                  return 0;
                }
                return hp;
              })
              .reduce((a, b) => a + b);
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
                cardID: cs.id,
              };
              willTriggerEvent.push(gameEvent);
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
            willTriggerEvent.push(gameEvent);
            return {
              ...cs,
              damage: nextDamage,
            };
          });
          // 套用傷害
          ctx = mapCardState(ctx, (_, cs1) => {
            for (const cs2 of changedCardState) {
              if (cs1.id == cs2.id) {
                return cs2;
              }
            }
            return cs1;
          }) as GameState
          // const cardState = ctx.gameState.cardState.map((cs1) => {
          //   for (const cs2 of changedCardState) {
          //     if (cs1.id == cs2.id) {
          //       return cs2;
          //     }
          //   }
          //   return cs1;
          // });
          // ctx = {
          //   ...ctx,
          //   gameState: {
          //     ...ctx.gameState,
          //     cardState: cardState,
          //   },
          // };
        }
      }
    }
  }
  ctx = updateDestroyEffect(ctx);
  ctx = willTriggerEvent.reduce((ctx, evt) => {
    return triggerTextEvent(ctx, evt);
  }, ctx);
  return ctx;
}

// 觸發事件腳本
// 在每次事件發生時都要呼叫
// 起動型技能
export function triggerTextEvent(
  ctx: GameState,
  evt: Event
): GameState {
  log("triggerTextEvent", evt.title);
  // return getCardStateIterator(ctx).reduce((ctx, [cardID, cardTextStates]) => {
  //   return cardTextStates.reduce((ctx, cardTextState) => {
  //     const cardTexts = (() => {
  //       switch (cardTextState.cardText.id) {
  //         case "自動型":
  //           return [cardTextState.cardText].filter((t) => {
  //             if (t.id == "自動型" && t.category == "起動") {
  //               return filterEnableCardText(ctx, cardID, false, t);
  //             }
  //             return false;
  //           });
  //         case "特殊型":
  //         case "恒常":
  //           return cardTextState.cardText.texts.filter((t) => {
  //             if (t.id == "自動型" && t.category == "起動") {
  //               return filterEnableCardText(ctx, cardID, true, t);
  //             }
  //             return false;
  //           });
  //         default:
  //           return [];
  //       }
  //     })();
  //     return cardTexts.reduce((ctx, cardText) => {
  //       const cardController = getCardController(ctx, cardID);
  //       const wrapEvent: TEffect = {
  //         ...cardText.block,
  //         cause: {
  //           id: "BlockPayloadCauseGameEvent",
  //           playerID: cardController,
  //           cardID: cardID,
  //           cardTextID: cardTextState.id,
  //           gameEvent: evt,
  //           description: cardText.description,
  //         },
  //         // 加上卡ID，讓varCtxID變成每張卡唯一。而不是遊戲唯一。
  //         contextID: `[${cardID}]_[${cardText.block.contextID}]`,
  //       };
  //       // const varCtxID = "triggerTextEvent";
  //       // try {
  //       //   if (wrapEvent.require != null) {
  //       //     // 清空變量，因為是臨時性的訪問，所以可以這麼做
  //       //     ctx = {
  //       //       ...ctx,
  //       //       varsPool: {
  //       //         ...ctx.varsPool,
  //       //         [varCtxID]: {
  //       //           targets: {},
  //       //           jsonfpContext: {},
  //       //         },
  //       //       },
  //       //     };
  //       //     ctx = doRequire(ctx, wrapEvent, wrapEvent.require, varCtxID);
  //       //   }
  //       //   if (wrapEvent.feedback) {
  //       //     ctx = wrapEvent.feedback.reduce((ctx, feedback) => {
  //       //       return doFeedback(ctx, wrapEvent, feedback, varCtxID);
  //       //     }, ctx);
  //       //   }
  //       // } catch (e) {
  //       //   log2("triggerTextEvent", err2string(e));
  //       // }
  //       return ctx;
  //     }, ctx);
  //   }, ctx);
  // }, ctx);
  return ctx;
}

export function updateDestroyEffect(ctx: GameState): GameState {
  // 將所有破壞效果加入破壞用堆疊
  // 加入破壞用堆疊後，主動玩家就必須決定解決順序
  // 決定後，依順序將所有效果移到正在解決中的堆疊，並重設切入的旗標，讓玩家可以在堆疊解決中可以再次切入
  // const effects = ctx.gameState.cardState
  //   .filter((cs) => {
  //     if (cs.destroyReason == null) {
  //       return false;
  //     }
  //     return true;
  //   })
  //   .map((cs): TEffect => {
  //     const card = getCard(ctx.gameState.table, cs.id);
  //     if (card == null) {
  //       throw new Error("card not found");
  //     }
  //     if (cs.destroyReason == null) {
  //       throw new Error("destroyReason must found");
  //     }
  //     const setGroupCards = getSetGroupCards(ctx, card.id);
  //     const hp = setGroupCards
  //       .map((setGroupCardID) => {
  //         const [_2, _3, hp] = getCardBattlePoint(ctx, setGroupCardID);
  //         return hp;
  //       })
  //       .reduce((a, b) => a + b);
  //     return {
  //       ...getCardTextMacro({
  //         id: "破壊する",
  //         cause: {
  //           id: "BlockPayloadCauseDestroy",
  //           reason:
  //             hp <= 0
  //               ? {
  //                   id: "マイナスの戦闘修正",
  //                   playerID: cs.destroyReason.playerID,
  //                 }
  //               : cs.destroyReason,
  //           playerID: cs.destroyReason.playerID,
  //           cardID: cs.id,
  //           description: "破壞產生的自身的廢棄效果",
  //         },
  //       }).block,
  //       id: `updateDestroyEffect_${cs.id}`,
  //     };
  //   });
  // ctx = {
  //   ...ctx,
  //   gameState: {
  //     ...ctx.gameState,
  //     destroyEffect: effects,
  //   },
  // };
  return ctx;
}