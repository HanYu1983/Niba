import {
  AbsoluteBaSyou,
  BaKeyword,
  BattleAreaKeyword,
  CardText,
  GameEvent,
  getBaSyouID,
  getNextTiming,
  getOpponentPlayerID,
  isBa,
  PlayerA,
  PlayerB,
  BlockPayload,
  TIMING_CHART,
  AttackSpeed,
  BaSyouKeyword,
  CardTextSiYouKaTa,
  CardTextZiDouKaTa,
  DestroyReason
} from "../define";
import {
  getBlockOwner,
  GameState,
  doBlockPayload,
  CardState,
  getBattleGroup,
  getBattleGroupBattlePoint,
  getCardBattlePoint,
  isABattleGroup,
  DEFAULT_GAME_STATE,
} from "../model/GameState";
import {
  filterEffect,
  iterateEffect,
  reduceEffect,
  addImmediateEffect,
} from "../model/EffectStackComponent";
import { checkIsBattle } from "../model/IsBattleComponent";
import { log2 } from "../../tool/logger";
import { DEFAULT_TABLE } from "../../tool/table";
import { cancelActiveEffectID, setActiveEffectID } from "../model/ActiveEffectComponent";
import { getCardBaSyou, mapCard } from "../model/CardTableComponent";
import { getCardState, mapCardState } from "../model/CardStateComponent";
import { getSetGroupCards } from "../model/SetGroupComponent";

export type Message = {
  id: "MessageCustom";
  value: string;
};

type FlowMemoryComponent = {
  state: "prepareDeck" | "whoFirst" | "draw6AndConfirm" | "playing";
  hasTriggerEvent: boolean;
  hasPlayerPassPhase: { [key: string]: boolean };
  hasPlayerPassCut: { [key: string]: boolean };
  hasPlayerPassPayCost: { [key: string]: boolean };
  shouldTriggerStackEffectFinishedEvent: boolean;
  msgs: Message[];
}

const DEFAULT_FLOW_MEMORY: FlowMemoryComponent = {
  state: "prepareDeck",
  hasTriggerEvent: false,
  hasPlayerPassPhase: {},
  hasPlayerPassCut: {},
  hasPlayerPassPayCost: {},
  shouldTriggerStackEffectFinishedEvent: false,
  msgs: [],
}

type HasFlowMemoryComponent = {
  flowMemory: FlowMemoryComponent
}

export type GameStateWithFlowMemory = GameState & HasFlowMemoryComponent;

export type GameContext = {
  gameState: GameStateWithFlowMemory;
  versionID: number;
};

export const DEFAULT_GAME_CONTEXT: GameContext = {
  gameState: {
    ...DEFAULT_GAME_STATE,
    flowMemory: DEFAULT_FLOW_MEMORY
  },
  versionID: 0,
};

function setGameActiveEffectID(
  ctx: GameContext,
  playerID: string,
  effectID: string
): GameContext {
  const gameState = setActiveEffectID(ctx.gameState, playerID, effectID)
  return {
    ...ctx,
    gameState: gameState as GameStateWithFlowMemory
  };
}

function cancelGameActiveEffectID(
  ctx: GameContext,
  playerID: string
): GameContext {
  const gameState = cancelActiveEffectID(ctx.gameState, playerID)
  return {
    ...ctx,
    gameState: gameState as GameStateWithFlowMemory
  };
}

export function doEffect(
  ctx: GameContext,
  playerID: string,
  effectID: string
): GameContext {
  log2("doEffect", effectID);
  // 判斷這個效果是否正在支付，不然不應該執行
  if (ctx.gameState.activeEffectID != effectID) {
    throw new Error("activeEffectID != effectID");
  }
  // 暫存原本的效果, 用來發送當堆疊結束時的事件
  const stackEffect = ctx.gameState.stackEffect.find((e) => e.id == effectID);
  // 處理事件
  let gameState = reduceEffect(
    ctx.gameState,
    (ctx, effect) => {
      if (effect.id != effectID) {
        return ctx;
      }
      return doBlockPayload(ctx, effect);
    },
    ctx.gameState as GameState
  );
  ctx = {
    ...ctx,
    gameState: gameState as GameStateWithFlowMemory
  }
  // 清除旗標，代表現在沒有正在支付的效果
  ctx = {
    ...ctx,
    gameState: {
      ...ctx.gameState,
      activeEffectID: null,
    },
  };
  // 將效果移除
  gameState = filterEffect(ctx.gameState, (effect) => {
    return effect.requirePassed != true;
  }) as GameState;
  // 如果是堆疊事件，將事件移到堆疊記憶去
  const isStackEffect = stackEffect != null;
  if (isStackEffect) {
    ctx = {
      ...ctx,
      gameState: {
        ...ctx.gameState,
        stackEffectMemory: [...ctx.gameState.stackEffectMemory, stackEffect],
      },
    };
  }
  // 是否堆疊結束
  // 觸發切入解決事件，並清空堆疊記憶
  const isStackFinished =
    isStackEffect && ctx.gameState.stackEffect.length == 0;
  if (isStackFinished) {
    ctx = {
      ...ctx,
      gameState: {
        ...ctx.gameState,
        flowMemory: {
          ...ctx.gameState.flowMemory,
          shouldTriggerStackEffectFinishedEvent: true,
        },
      },
    };
  }
  return ctx;
}

export function deleteImmediateEffect(
  ctx: GameContext,
  playerID: string,
  effectID: string
): GameContext {
  let gameState = filterEffect(ctx.gameState, (effect) => {
    if (effect.id != effectID) {
      return true;
    }
    const controller = getBlockOwner(effect);
    if (controller != playerID) {
      throw new Error("you are not controller");
    }
    if (effect.isOption != true) {
      throw new Error("isOption must true");
    }
    return false;
  }) as GameState;

  return {
    ...ctx,
    gameState: gameState as GameStateWithFlowMemory
  };
}

type FlowUpdateCommand = {
  id: "FlowUpdateCommand";
  description?: string;
};
type FlowTriggerTextEvent = {
  id: "FlowTriggerTextEvent";
  event: GameEvent;
  description?: string;
};
type FlowNextTiming = {
  id: "FlowNextTiming";
  description?: string;
};
type FlowAddBlock = {
  id: "FlowAddBlock";
  responsePlayerID: string;
  description?: string;
  block: BlockPayload;
};
type FlowWaitPlayer = {
  id: "FlowWaitPlayer";
  description?: string;
};
type FlowSetActiveEffectID = {
  id: "FlowSetActiveEffectID";
  effectID: string | null;
  tips: BlockPayload[];
  description?: string;
};
type FlowCancelActiveEffectID = {
  id: "FlowCancelActiveEffectID";
  description?: string;
};
type FlowDoEffect = {
  id: "FlowDoEffect";
  effectID: string;
  description?: string;
};
type FlowObserveEffect = {
  id: "FlowObserveEffect";
  effectID: string;
  description?: string;
};
type FlowDeleteImmediateEffect = {
  id: "FlowDeleteImmediateEffect";
  effectID: string | null;
  description?: string;
  tips: BlockPayload[];
};
type FlowPassPhase = {
  id: "FlowPassPhase";
  description?: string;
};
type FlowCancelPassPhase = {
  id: "FlowCancelPassPhase";
  description?: string;
};
type FlowPassCut = {
  id: "FlowPassCut";
  description?: string;
};
type FlowCancelPassCut = {
  id: "FlowCancelPassCut";
  description?: string;
};
type FlowHandleDamageStepRule = {
  id: "FlowHandleDamageStepRule";
  description?: string;
};
type FlowHandleReturnStepRule = {
  id: "FlowHandleReturnStepRule";
  description?: string;
};
type FlowHandleStackEffectFinished = {
  id: "FlowHandleStackEffectFinished";
  description?: string;
};
type FlowPassPayCost = {
  id: "FlowPassPayCost";
  effectID: string;
  description?: string;
};
type FlowMakeDestroyOrder = {
  id: "FlowMakeDestroyOrder";
  destroyEffect: BlockPayload[];
  description?: string;
};

type FlowHandleRerollPhaseRule = {
  id: "FlowHandleRerollPhaseRule";
  description?: string;
};

export type Flow =
  | FlowAddBlock
  | FlowTriggerTextEvent
  | FlowUpdateCommand
  | FlowNextTiming
  | FlowWaitPlayer
  | FlowSetActiveEffectID
  | FlowCancelActiveEffectID
  | FlowDoEffect
  | FlowObserveEffect
  | FlowDeleteImmediateEffect
  | FlowPassPhase
  | FlowCancelPassPhase
  | FlowPassCut
  | FlowCancelPassCut
  | FlowHandleDamageStepRule
  | FlowHandleReturnStepRule
  | FlowHandleStackEffectFinished
  | FlowPassPayCost
  | FlowMakeDestroyOrder
  | FlowHandleRerollPhaseRule;

let idSeq = 0;
export function applyFlow(
  ctx: GameContext,
  playerID: string,
  flow: Flow
): GameContext {
  log2("applyFlow", playerID, flow);
  switch (flow.id) {
    case "FlowSetActiveEffectID": {
      if (flow.effectID == null) {
        throw new Error("effectID not found");
      }
      ctx = setGameActiveEffectID(ctx, playerID, flow.effectID);
      const isAllPassCut =
        !!ctx.gameState.flowMemory.hasPlayerPassCut[PlayerA] &&
        !!ctx.gameState.flowMemory.hasPlayerPassCut[PlayerB];
      // 如果不是雙方都結束，就重設
      if (isAllPassCut == false) {
        ctx = {
          ...ctx,
          gameState: {
            ...ctx.gameState,
            flowMemory: {
              ...ctx.gameState.flowMemory,
              hasPlayerPassCut: {},
            },
          },
        };
      }
      return ctx;
    }
    case "FlowCancelActiveEffectID": {
      return cancelGameActiveEffectID(ctx, playerID);
    }
    case "FlowDeleteImmediateEffect": {
      if (flow.effectID == null) {
        throw new Error("effectID not found");
      }
      return deleteImmediateEffect(ctx, playerID, flow.effectID);
    }
    case "FlowDoEffect": {
      if (flow.effectID == null) {
        throw new Error("effectID not found");
      }
      ctx = doEffect(ctx, playerID, flow.effectID);
      // 執行完效果時自動取消其中一方的結束宣告
      ctx = {
        ...ctx,
        gameState: {
          ...ctx.gameState,
          flowMemory: {
            ...ctx.gameState.flowMemory,
            hasPlayerPassPhase: {},
          },
        },
      };
      // 清空支付狀態
      ctx = {
        ...ctx,
        gameState: {
          ...ctx.gameState,
          flowMemory: {
            ...ctx.gameState.flowMemory,
            hasPlayerPassPayCost: {},
          },
        },
      };
      // 每執行完一次效果，就更新指令
      ctx = updateCommand(ctx);
      return ctx;
    }
    case "FlowPassPhase": {
      return {
        ...ctx,
        gameState: {
          ...ctx.gameState,
          flowMemory: {
            ...ctx.gameState.flowMemory,
            hasPlayerPassPhase: {
              ...ctx.gameState.flowMemory.hasPlayerPassPhase,
              [playerID]: true,
            },
          },
        },
      };
    }
    case "FlowCancelPassPhase":
      return {
        ...ctx,
        gameState: {
          ...ctx.gameState,
          flowMemory: {
            ...ctx.gameState.flowMemory,
            hasPlayerPassPhase: {
              ...ctx.gameState.flowMemory.hasPlayerPassPhase,
              [playerID]: false,
            },
          },
        },
      };
    case "FlowPassCut": {
      return {
        ...ctx,
        gameState: {
          ...ctx.gameState,
          flowMemory: {
            ...ctx.gameState.flowMemory,
            hasPlayerPassCut: {
              ...ctx.gameState.flowMemory.hasPlayerPassCut,
              [playerID]: true,
            },
          },
        },
      };
    }
    case "FlowCancelPassCut":
      return {
        ...ctx,
        gameState: {
          ...ctx.gameState,
          flowMemory: {
            ...ctx.gameState.flowMemory,
            hasPlayerPassCut: {
              ...ctx.gameState.flowMemory.hasPlayerPassCut,
              [playerID]: false,
            },
          },
        },
      };
    case "FlowTriggerTextEvent":
      if (ctx.gameState.flowMemory.hasTriggerEvent) {
        log2("applyFlow", "已經執行過triggerTextEvent");
        return ctx;
      }
      ctx = triggerTextEvent(ctx, flow.event);
      // set hasTriggerEvent
      ctx = {
        ...ctx,
        gameState: {
          ...ctx.gameState,
          flowMemory: {
            ...ctx.gameState.flowMemory,
            hasTriggerEvent: true,
          },
        },
      };
      return ctx;
    case "FlowUpdateCommand":
      ctx = updateCommand(ctx);
      // set hasTriggerEvent
      ctx = {
        ...ctx,
        gameState: {
          ...ctx.gameState,
          flowMemory: {
            ...ctx.gameState.flowMemory,
            hasTriggerEvent: true,
          },
        },
      };
      return ctx;
    case "FlowNextTiming": {
      {
        // 處理遊戲開始的效果
        if (ctx.gameState.flowMemory.state != "playing") {
          switch (ctx.gameState.flowMemory.state) {
            case "prepareDeck": {
              {
                const plyrID = PlayerA;
                const baSyou: AbsoluteBaSyou = {
                  id: "AbsoluteBaSyou",
                  value: [plyrID, "本国"],
                };
                const fromCS =
                  ctx.gameState.table.cardStack[getBaSyouID(baSyou)];
                ctx = {
                  ...ctx,
                  gameState: {
                    ...ctx.gameState,
                    table: {
                      ...ctx.gameState.table,
                      cardStack: {
                        ...ctx.gameState.table.cardStack,
                        [getBaSyouID(baSyou)]: fromCS.sort(
                          () => Math.random() - 0.5
                        ),
                      },
                    },
                  },
                };
              }
              {
                const plyrID = PlayerB;
                const baSyou: AbsoluteBaSyou = {
                  id: "AbsoluteBaSyou",
                  value: [plyrID, "本国"],
                };
                const fromCS =
                  ctx.gameState.table.cardStack[getBaSyouID(baSyou)];
                ctx = {
                  ...ctx,
                  gameState: {
                    ...ctx.gameState,
                    table: {
                      ...ctx.gameState.table,
                      cardStack: {
                        ...ctx.gameState.table.cardStack,
                        [getBaSyouID(baSyou)]: fromCS.sort(
                          () => Math.random() - 0.5
                        ),
                      },
                    },
                  },
                };
              }
              ctx = {
                ...ctx,
                gameState: {
                  ...ctx.gameState,
                  flowMemory: {
                    ...ctx.gameState.flowMemory,
                    state: "whoFirst",
                  },
                },
              };
              break;
            }
            case "whoFirst": {
              ctx = {
                ...ctx,
                gameState: {
                  ...ctx.gameState,
                  flowMemory: {
                    ...ctx.gameState.flowMemory,
                    state: "draw6AndConfirm",
                  },
                },
              };
              break;
            }
            case "draw6AndConfirm": {
              ctx = {
                ...ctx,
                gameState: {
                  ...ctx.gameState,
                  timing: [0, ["リロールフェイズ", "フェイズ開始"]],
                },
              };
              ctx = {
                ...ctx,
                gameState: {
                  ...ctx.gameState,
                  flowMemory: {
                    ...ctx.gameState.flowMemory,
                    state: "playing",
                  },
                },
              };
              break;
            }
          }
          return ctx;
        }
      }
      // 傷判的規定效果一結束就收集所有破壞的卡並建立破壞而廢棄的效果
      if (
        ctx.gameState.timing[1][0] == "戦闘フェイズ" &&
        ctx.gameState.timing[1][1] == "ダメージ判定ステップ" &&
        ctx.gameState.timing[1][2] == "規定の効果"
      ) {
        // 更新所有破壞而廢棄的效果
        // 若有產生值，在下一步時主動玩家就要拿到決定解決順序的指令
        ctx = updateDestroyEffect(ctx);
      }
      // 回合結束時切換主動玩家
      if (
        ctx.gameState.timing[1][0] == "戦闘フェイズ" &&
        ctx.gameState.timing[1][1] == "ターン終了時" &&
        ctx.gameState.timing[1][2] == "効果終了。ターン終了"
      ) {
        if (ctx.gameState.activePlayerID == null) {
          throw new Error("activePlayerID not found");
        }
        ctx = {
          ...ctx,
          gameState: {
            ...ctx.gameState,
            activePlayerID: getOpponentPlayerID(ctx.gameState.activePlayerID),
          },
        };
      }
      // 下一步
      {
        const nextTiming = getNextTiming(ctx.gameState.timing);
        ctx = {
          ...ctx,
          gameState: {
            ...ctx.gameState,
            timing: nextTiming,
          },
        };
      }
      // p34
      // 戰鬥階段的每個步驟開始時，確認是否交戰中
      if (
        ctx.gameState.timing[1][0] == "戦闘フェイズ" &&
        ctx.gameState.timing[1][2] == "ステップ開始"
      ) {
        ctx = { ...ctx, gameState: checkIsBattle(ctx.gameState) as GameStateWithFlowMemory };
      }
      // 重設觸發flag
      ctx = {
        ...ctx,
        gameState: {
          ...ctx.gameState,
          flowMemory: {
            ...ctx.gameState.flowMemory,
            hasTriggerEvent: false,
          },
        },
      };
      // 重設宣告結束的flag
      ctx = {
        ...ctx,
        gameState: {
          ...ctx.gameState,
          flowMemory: {
            ...ctx.gameState.flowMemory,
            hasPlayerPassPhase: {},
          },
        },
      };
      // 自動更新指令
      ctx = updateCommand(ctx);
      return ctx;
    }
    case "FlowAddBlock": {
      let block = flow.block;
      block = {
        ...block,
        id: `FlowAddBlock_${idSeq++}`,
        cause: {
          id: "BlockPayloadCauseGameRule",
          playerID: flow.responsePlayerID,
          description: flow.description || "",
        },
        //...(block.require ? { require: wrapRequireKey(block.require) } : null),
      };
      let gameState = addImmediateEffect(ctx.gameState, block)
      ctx = {
        ...ctx,
        gameState: gameState as GameStateWithFlowMemory
      }
      // ctx = {
      //   ...ctx,
      //   gameState: {
      //     ...ctx.gameState,
      //     immediateEffect: [block, ...ctx.gameState.immediateEffect],
      //   },
      // };
      // set hasTriggerEvent
      ctx = {
        ...ctx,
        gameState: {
          ...ctx.gameState,
          flowMemory: {
            ...ctx.gameState.flowMemory,
            hasTriggerEvent: true,
          },
        },
      };
      return ctx;
    }
    case "FlowHandleDamageStepRule": {
      // 傷害計算並造成傷害
      const attackPlayerID = ctx.gameState.activePlayerID;
      if (attackPlayerID == null) {
        throw new Error("attackPlayerID not found");
      }
      const guardPlayerID = getOpponentPlayerID(attackPlayerID);
      // 速度1
      ctx = handleAttackDamage(
        ctx,
        attackPlayerID,
        guardPlayerID,
        "戦闘エリア（左）",
        1
      );
      ctx = handleAttackDamage(
        ctx,
        attackPlayerID,
        guardPlayerID,
        "戦闘エリア（右）",
        1
      );
      // 速度2
      ctx = handleAttackDamage(
        ctx,
        attackPlayerID,
        guardPlayerID,
        "戦闘エリア（左）",
        2
      );
      ctx = handleAttackDamage(
        ctx,
        attackPlayerID,
        guardPlayerID,
        "戦闘エリア（右）",
        2
      );
      // set hasTriggerEvent
      ctx = {
        ...ctx,
        gameState: {
          ...ctx.gameState,
          flowMemory: {
            ...ctx.gameState.flowMemory,
            hasTriggerEvent: true,
          },
        },
      };
      return ctx;
    }
    case "FlowHandleReturnStepRule": {
      // TODO: 如果地形不適應，移到廢棄庫
      // {
      //   ctx = updateEffect(ctx);
      // }
      // const cardsInBattleArea = iterateCard(ctx.gameState.table).filter(
      //   (card) => {
      //     switch (getCardBaSyou(ctx, card.id).value[1]) {
      //       case "戦闘エリア（右）":
      //       case "戦闘エリア（左）":
      //         return true;
      //       default:
      //         return false;
      //     }
      //   }
      // );
      // // 移動到配置區
      // ctx = cardsInBattleArea.reduce((ctx, card) => {
      //   const cardNotInBattleArea =
      //     cardsInBattleArea.map((c) => c.id).includes(card.id) == false;
      //   if (cardNotInBattleArea) {
      //     return ctx;
      //   }
      //   const cardController = getCardController(ctx, card.id);
      //   const fromBaSyou = getCardBaSyou(ctx, card.id);
      //   const toBaSyou: AbsoluteBaSyou = {
      //     ...fromBaSyou,
      //     value: [cardController, "配備エリア"],
      //   };
      //   const table = moveCard(
      //     ctx.gameState.table,
      //     getBaSyouID(fromBaSyou),
      //     getBaSyouID(toBaSyou),
      //     card.id,
      //     null
      //   );
      //   return {
      //     ...ctx,
      //     gameState: {
      //       ...ctx.gameState,
      //       table: table,
      //     },
      //   };
      // }, ctx);
      // // 横置
      // {
      //   ctx = mapCard(ctx, (card) => {
      //     const cardNotInBattleArea =
      //       cardsInBattleArea.map((c) => c.id).includes(card.id) == false;
      //     if (cardNotInBattleArea) {
      //       return card;
      //     }
      //     return {
      //       ...card,
      //       tap: true,
      //     };
      //   });
      // }
      // // set hasTriggerEvent
      // ctx = {
      //   ...ctx,
      //   gameState: {
      //     ...ctx.gameState,
      //     flowMemory: {
      //       ...ctx.gameState.flowMemory,
      //       hasTriggerEvent: true,
      //     },
      //   },
      // };
      return ctx;
    }
    case "FlowHandleStackEffectFinished": {
      ctx = triggerTextEvent(ctx, {
        id: "カット終了時",
        effects: ctx.gameState.stackEffectMemory,
      });
      ctx = {
        ...ctx,
        gameState: {
          ...ctx.gameState,
          stackEffectMemory: [],
          flowMemory: {
            ...ctx.gameState.flowMemory,
            shouldTriggerStackEffectFinishedEvent: false,
          },
        },
      };
      return ctx;
    }
    case "FlowPassPayCost": {
      const effect = iterateEffect(ctx.gameState).find((e) => e.id == flow.effectID);
      if (effect == null) {
        throw new Error(`effectID not found:${flow.effectID}`);
      }
      //assertBlockPayloadTargetTypeValueLength(effect);
      ctx = {
        ...ctx,
        gameState: {
          ...ctx.gameState,
          flowMemory: {
            ...ctx.gameState.flowMemory,
            hasPlayerPassPayCost: {
              ...ctx.gameState.flowMemory.hasPlayerPassPayCost,
              [playerID]: true,
            },
          },
        },
      };
      return ctx;
    }
    case "FlowMakeDestroyOrder": {
      const willAddedDestroyEffect = ctx.gameState.destroyEffect.filter((a) => {
        return ctx.gameState.stackEffect.find((b) => a.id == b.id) == null;
      });
      if (flow.destroyEffect.length != willAddedDestroyEffect.length) {
        throw new Error("長度不符合");
      }
      return {
        ...ctx,
        gameState: {
          ...ctx.gameState,
          // 移除破壞效果，全部移到堆疊
          destroyEffect: [],
          stackEffect: [
            ...willAddedDestroyEffect,
            ...ctx.gameState.stackEffect,
          ],
          // 重設切入旗標，讓玩家再次切入
          flowMemory: {
            ...ctx.gameState.flowMemory,
            hasPlayerPassCut: {},
          },
        },
      };
    }
    case "FlowHandleRerollPhaseRule": {
      // const activePlayerID = ctx.gameState.activePlayerID;
      // if (activePlayerID == null) {
      //   throw new Error("activePlayer not found");
      // }
      // // 先更新效果
      // ctx = updateEffect(ctx);
      // const myCards = iterateCard(ctx.gameState.table)
      //   // 我控制的
      //   .filter((card) => {
      //     return getCardController(ctx, card.id) == activePlayerID;
      //   })
      //   // 可以重置的
      //   .filter((card) => {
      //     // 檢查是否可以重置
      //     // 必須在updateEffect之後呼叫才能確保卡片效果有在作用
      //     return isCanReroll(ctx, null, card.id);
      //   });
      // // 重置控制者為主動玩家的卡
      // ctx = mapCard(ctx, (card) => {
      //   const isNotMyCard = myCards.map((c) => c.id).includes(card.id) == false;
      //   if (isNotMyCard) {
      //     return card;
      //   }
      //   return {
      //     ...card,
      //     tap: false,
      //   };
      // });
      // // set hasTriggerEvent
      // ctx = {
      //   ...ctx,
      //   gameState: {
      //     ...ctx.gameState,
      //     flowMemory: {
      //       ...ctx.gameState.flowMemory,
      //       hasTriggerEvent: true,
      //     },
      //   },
      // };
      return ctx;
    }
  }
  return ctx;
}

export function queryFlow(ctx: GameContext, playerID: string): Flow[] {
  if (true) {
    const hasSomeoneLiveIsZero =
      [PlayerA, PlayerB]
        .map((pid) => {
          return getBaSyouID({ id: "AbsoluteBaSyou", value: [pid, "本国"] });
        })
        .map((baSyouID) => {
          return ctx.gameState.table.cardStack[baSyouID] || [];
        })
        .filter((cards) => {
          return cards.length == 0;
        }).length > 0;
    if (hasSomeoneLiveIsZero) {
      console.log(ctx);
      return [{ id: "FlowWaitPlayer", description: "遊戲結束" }];
    }
  }
  // 有玩家在支付卡片
  if (ctx.gameState.activeEffectID != null) {
    const currentActiveEffect = iterateEffect(ctx.gameState).find(
      (e) => e.id == ctx.gameState.activeEffectID
    );
    if (currentActiveEffect == null) {
      throw new Error("activeEffectID not found");
    }

    const enablePayCost = true;
    if (enablePayCost) {
      const controller = getBlockOwner(currentActiveEffect);
      const isPass = !!ctx.gameState.flowMemory.hasPlayerPassPayCost[playerID];
      const isOpponentPass =
        !!ctx.gameState.flowMemory.hasPlayerPassPayCost[
        getOpponentPlayerID(playerID)
        ];
      if (isPass && isOpponentPass) {
        if (controller != playerID) {
          return [
            {
              id: "FlowObserveEffect",
              effectID: ctx.gameState.activeEffectID,
            },
          ];
        }
        return [
          {
            id: "FlowDoEffect",
            effectID: ctx.gameState.activeEffectID,
          },
        ];
      } else if (isPass || isOpponentPass) {
        if (controller == playerID) {
          if (isPass) {
            return [
              {
                id: "FlowObserveEffect",
                effectID: ctx.gameState.activeEffectID,
              },
            ];
          }
        } else {
          if (isOpponentPass == false) {
            return [
              {
                id: "FlowObserveEffect",
                effectID: ctx.gameState.activeEffectID,
              },
            ];
          }
          return [
            {
              id: "FlowPassPayCost",
              effectID: ctx.gameState.activeEffectID,
            },
          ];
        }
      }
      if (controller != playerID) {
        return [
          {
            id: "FlowWaitPlayer",
            description: "等待對方支付ActiveEffectID",
          },
        ];
      }
      return [
        {
          id: "FlowCancelActiveEffectID",
          description: "取消支付效果，讓其它玩家可以支付",
        },
        {
          id: "FlowPassPayCost",
          effectID: ctx.gameState.activeEffectID,
        },
      ];
    }

    const controller = getBlockOwner(currentActiveEffect);
    if (controller != playerID) {
      return [
        {
          id: "FlowWaitPlayer",
          description: "等待對方支付ActiveEffectID",
        },
        {
          id: "FlowObserveEffect",
          effectID: ctx.gameState.activeEffectID,
        },
      ];
    }
    return [
      {
        id: "FlowCancelActiveEffectID",
        description: "取消支付效果，讓其它玩家可以支付",
      },
      {
        id: "FlowDoEffect",
        effectID: ctx.gameState.activeEffectID,
      },
    ];
  }
  // 處理立即效果
  if (ctx.gameState.immediateEffect.length) {
    const isActivePlayer = ctx.gameState.activePlayerID == playerID;
    const myEffect: BlockPayload[] = [];
    const opponentEffect: BlockPayload[] = [];
    ctx.gameState.immediateEffect.forEach((effect) => {
      const controller = getBlockOwner(effect);
      if (controller == playerID) {
        myEffect.push(effect);
      } else {
        opponentEffect.push(effect);
      }
    });
    // 不是主動玩家的情況，要等主動玩家先處理完起動效果才行
    if (isActivePlayer == false) {
      if (opponentEffect.length) {
        return [
          {
            id: "FlowWaitPlayer",
            description: "等待主動玩家處理起動效果",
          },
        ];
      }
    }
    // 主動玩家
    if (myEffect.length == 0) {
      return [
        {
          id: "FlowWaitPlayer",
          description: "等待被動玩家處理起動效果",
        },
      ];
    }
    const optionEffect = myEffect.filter((v) => v.isOption == true);
    return [
      ...(myEffect.length
        ? [
          {
            id: "FlowSetActiveEffectID",
            effectID: myEffect[0].id || null,
            description: "選擇一個起動效果",
            tips: myEffect,
          } as FlowSetActiveEffectID,
        ]
        : []),
      ...(optionEffect.length
        ? [
          {
            id: "FlowDeleteImmediateEffect",
            effectID: optionEffect[0].id,
            description: "你可以放棄這些效果",
            tips: optionEffect,
          } as FlowDeleteImmediateEffect,
        ]
        : []),
    ];
  }
  if (ctx.gameState.flowMemory.shouldTriggerStackEffectFinishedEvent) {
    const isActivePlayer = ctx.gameState.activePlayerID == playerID;
    if (isActivePlayer == false) {
      return [
        {
          id: "FlowWaitPlayer",
          description: "等待主動玩家處理",
        },
      ];
    }
    return [
      {
        id: "FlowHandleStackEffectFinished",
        description: "處理堆疊結束",
      },
    ];
  }
  // 破壞效果，如果效果多於1個，則讓主動玩家選擇順序
  SelectDestroyOrder: {
    switch (ctx.gameState.timing[1][0]) {
      case "戦闘フェイズ":
        switch (ctx.gameState.timing[1][1]) {
          case "ダメージ判定ステップ":
            switch (ctx.gameState.timing[1][2]) {
              case "規定の効果":
                break SelectDestroyOrder;
            }
        }
        // 因為destroyEffect可以重復刷新，所以在加入到堆疊時，不能加入重復的
        const willAddedDestroyEffect = ctx.gameState.destroyEffect.filter(
          (a) => {
            return ctx.gameState.stackEffect.find((b) => a.id == b.id) == null;
          }
        );
        if (willAddedDestroyEffect.length) {
          const isActivePlayer = ctx.gameState.activePlayerID == playerID;
          if (isActivePlayer == false) {
            return [
              {
                id: "FlowWaitPlayer",
                description: "等待主動玩家決定破壞廢棄效果的順序",
              },
            ];
          }
          return [
            {
              id: "FlowMakeDestroyOrder",
              destroyEffect: willAddedDestroyEffect,
              description: "決定破壞廢棄效果的順序",
            },
          ];
        }
    }
  }
  const myCommandList = getClientCommand(ctx, playerID);
  // 處理堆疊效果，從最上方開始處理
  if (ctx.gameState.stackEffect.length) {
    // 取得最上方的效果
    const effect = ctx.gameState.stackEffect[0];
    if (effect.id == null) {
      throw new Error("effect.id not found");
    }
    // 取得效果的控制者
    const controller = getBlockOwner(effect);
    // 判斷切入流程
    const isAllPassCut =
      !!ctx.gameState.flowMemory.hasPlayerPassCut[PlayerA] &&
      !!ctx.gameState.flowMemory.hasPlayerPassCut[PlayerB];
    // 如果雙方玩家還沒放棄切入
    if (isAllPassCut == false) {
      // 如果我宣告了放棄切入，回傳取消
      const isPassCut = ctx.gameState.flowMemory.hasPlayerPassCut[playerID];
      if (isPassCut) {
        return [
          {
            id: "FlowCancelPassCut",
          },
        ];
      }
      // 雙方現在都可以切入，但要判斷切入的優先權在誰那
      // 如果堆疊最上方的控制者是自己，則優先權在對方。必須等對方宣告放棄切入
      if (controller == playerID) {
        const opponentPlayerID = playerID == PlayerA ? PlayerB : PlayerA;
        const isOpponentPassCut =
          ctx.gameState.flowMemory.hasPlayerPassCut[opponentPlayerID];
        if (!isOpponentPassCut) {
          return [
            {
              id: "FlowWaitPlayer",
              description: "現在的切入優先權在對方",
            },
          ];
        }
      }
      return [
        // 可以切入的指令
        ...((): Flow[] => {
          if (myCommandList.length == 0) {
            return [];
          }
          return [
            {
              id: "FlowSetActiveEffectID",
              effectID: myCommandList[0].id || "",
              tips: myCommandList,
              description: "你可以切入",
            },
          ];
        })(),
        // 宣告放棄切入
        {
          id: "FlowPassCut",
        },
      ];
    }
    // 雙方都已放棄切入，等待堆疊中的效果控制者處理
    if (controller != playerID) {
      return [
        {
          id: "FlowWaitPlayer",
          description: "等待效果控制者處理",
        },
      ];
    }
    return [
      {
        id: "FlowSetActiveEffectID",
        effectID: effect.id,
        description: "支付最上方的堆疊效果",
        tips: [effect],
      },
    ];
  }

  const handleFreeTiming = (): Flow[] => {
    const isAllPassPhase =
      !!ctx.gameState.flowMemory.hasPlayerPassPhase[PlayerA] &&
      !!ctx.gameState.flowMemory.hasPlayerPassPhase[PlayerB];
    if (isAllPassPhase == false) {
      if (ctx.gameState.flowMemory.hasPlayerPassPhase[playerID]) {
        return [
          {
            id: "FlowCancelPassPhase",
            description: `等待對方結束或是取消[${ctx.gameState.timing}]結束`,
          },
        ];
      }
      return [
        {
          id: "FlowPassPhase",
          description: `宣告[${ctx.gameState.timing}]結束`,
        },
        // 處理指令
        ...((): Flow[] => {
          if (myCommandList.length == 0) {
            return [];
          }
          return [
            {
              id: "FlowSetActiveEffectID",
              effectID: myCommandList[0].id || null,
              description: "選擇一個指令",
              tips: myCommandList,
            },
          ];
        })(),
      ];
    }
    if (playerID != ctx.gameState.activePlayerID) {
      return [
        {
          id: "FlowWaitPlayer",
          description: "等待伺服器處理",
        },
      ];
    }
    return [
      {
        id: "FlowNextTiming",
      },
    ];
  };
  {
    // 處理遊戲開始的效果
    // 在FlowNextTiming處理
    if (ctx.gameState.flowMemory.state == "prepareDeck") {
      if (playerID != PlayerA) {
        return [
          {
            id: "FlowWaitPlayer",
            description: "等待伺服器處理",
          },
        ];
      }
      return [{ id: "FlowNextTiming", description: "準備卡組" }];
    }
    if (ctx.gameState.flowMemory.state == "whoFirst") {
      if (playerID != PlayerA) {
        return [
          {
            id: "FlowWaitPlayer",
            description: "等待伺服器處理",
          },
        ];
      }
      return [{ id: "FlowNextTiming", description: "PlayerA先攻" }];
    }
    if (ctx.gameState.flowMemory.state == "draw6AndConfirm") {
      if (playerID != PlayerA) {
        return [
          {
            id: "FlowWaitPlayer",
            description: "等待伺服器處理",
          },
        ];
      }
      return [{ id: "FlowNextTiming", description: "抽6張" }];
    }
  }
  const [id, phase] = ctx.gameState.timing;
  // 處理自由時間，必須雙方都宣告結束才能進行到下一步
  switch (phase[0]) {
    case "ドローフェイズ":
    case "リロールフェイズ":
    case "配備フェイズ":
      switch (phase[1]) {
        case "フリータイミング": {
          return handleFreeTiming();
        }
      }
    case "戦闘フェイズ":
      switch (phase[1]) {
        case "攻撃ステップ":
        case "防御ステップ":
        case "帰還ステップ":
        case "ダメージ判定ステップ":
          switch (phase[2]) {
            case "フリータイミング": {
              return handleFreeTiming();
            }
          }
      }
      break;
  }
  // 之後的都是系統事件，由主動玩家呼叫
  if (playerID != ctx.gameState.activePlayerID) {
    return [
      {
        id: "FlowWaitPlayer",
        description: "等待伺服器處理",
      },
    ];
  }
  switch (phase[0]) {
    case "ドローフェイズ":
    case "リロールフェイズ":
    case "配備フェイズ":
      switch (phase[1]) {
        case "フェイズ開始":
        case "フェイズ終了":
          // 如果已經觸發事件
          if (ctx.gameState.flowMemory.hasTriggerEvent) {
            return [{ id: "FlowNextTiming" }];
          }
          return [
            {
              id: "FlowTriggerTextEvent",
              event: {
                id: "GameEventOnTiming",
                timing: ctx.gameState.timing,
              },
            },
          ];
        case "規定の効果":
          // 如果已經觸發規定の効果
          if (ctx.gameState.flowMemory.hasTriggerEvent) {
            return [{ id: "FlowNextTiming" }];
          }
          switch (phase[0]) {
            case "ドローフェイズ":
              return [
                {
                  id: "FlowAddBlock",
                  responsePlayerID: ctx.gameState.activePlayerID,
                  description: `${phase[0]}規定效果`,
                  block: {
                    // feedback: [
                    //   {
                    //     id: "FeedbackAction",
                    //     action: [
                    //       {
                    //         id: "ActionRuleDraw",
                    //       },
                    //     ],
                    //   },
                    // ],
                  },
                },
              ];
            case "リロールフェイズ":
              // 如果已經觸發規定の効果
              if (ctx.gameState.flowMemory.hasTriggerEvent) {
                return [{ id: "FlowNextTiming" }];
              }
              return [
                {
                  id: "FlowHandleRerollPhaseRule",
                  description: "執行「リロールフェイズ」",
                },
              ];
          }
          break;
      }
      break;
    case "戦闘フェイズ":
      switch (phase[1]) {
        case "攻撃ステップ":
        case "防御ステップ":
        case "帰還ステップ":
        case "ダメージ判定ステップ":
          switch (phase[2]) {
            case "ステップ開始":
            case "ステップ終了":
              // 如果已經觸發事件
              if (ctx.gameState.flowMemory.hasTriggerEvent) {
                return [{ id: "FlowNextTiming" }];
              }
              return [
                {
                  id: "FlowTriggerTextEvent",
                  event: {
                    id: "GameEventOnTiming",
                    timing: ctx.gameState.timing,
                  },
                },
              ];
            case "規定の効果":
              // 如果已經觸發規定の効果
              if (ctx.gameState.flowMemory.hasTriggerEvent) {
                return [{ id: "FlowNextTiming" }];
              }
              switch (phase[1]) {
                case "攻撃ステップ":
                case "防御ステップ": {
                  const [leftArea, rightArea]: [
                    BattleAreaKeyword,
                    BattleAreaKeyword
                  ] = ["地球エリア", "宇宙エリア"];
                  const playerID =
                    phase[1] == "攻撃ステップ"
                      ? ctx.gameState.activePlayerID
                      : getOpponentPlayerID(ctx.gameState.activePlayerID);
                  return [
                    {
                      id: "FlowAddBlock",
                      description: `${phase[1]}規定效果`,
                      responsePlayerID: playerID,
                      block: {
                        isOption: true,
                        // contextID: `${phase[1]}規定效果`,
                        // require: {
                        //   id: "RequireTarget",
                        //   targets: {
                        //     去左方的卡: {
                        //       id: "カード",
                        //       value: [],
                        //     },
                        //     去右方的卡: {
                        //       id: "カード",
                        //       value: [],
                        //     },
                        //   },
                        //   condition: {
                        //     id: "ConditionAnd",
                        //     and: [
                        //       getConditionMacro({
                        //         id: "變量x的場所包含於y",
                        //         x: { id: "カード", value: "去左方的卡" },
                        //         y: [
                        //           {
                        //             id: "AbsoluteBaSyou",
                        //             value: [playerID, "配備エリア"],
                        //           },
                        //         ],
                        //       }),
                        //       getConditionMacro({
                        //         id: "變量x的角色包含於y",
                        //         x: { id: "カード", value: "去左方的卡" },
                        //         y: ["ユニット"],
                        //       }),
                        //       {
                        //         id: "ConditionCompareString",
                        //         value: [
                        //           {
                        //             id: "字串",
                        //             value: {
                        //               path: [
                        //                 { id: "カード", value: "去左方的卡" },
                        //                 "的「地形適性」",
                        //               ],
                        //             },
                        //           },
                        //           "hasToken",
                        //           { id: "字串", value: ["宇宙エリア"] },
                        //         ],
                        //       },
                        //       getConditionMacro({
                        //         id: "變量x的場所包含於y",
                        //         x: { id: "カード", value: "去右方的卡" },
                        //         y: [
                        //           {
                        //             id: "AbsoluteBaSyou",
                        //             value: [playerID, "配備エリア"],
                        //           },
                        //         ],
                        //       }),
                        //       getConditionMacro({
                        //         id: "變量x的角色包含於y",
                        //         x: { id: "カード", value: "去右方的卡" },
                        //         y: ["ユニット"],
                        //       }),
                        //       {
                        //         id: "ConditionCompareString",
                        //         value: [
                        //           {
                        //             id: "字串",
                        //             value: {
                        //               path: [
                        //                 { id: "カード", value: "去右方的卡" },
                        //                 "的「地形適性」",
                        //               ],
                        //             },
                        //           },
                        //           "hasToken",
                        //           { id: "字串", value: ["地球エリア"] },
                        //         ],
                        //       },
                        //     ],
                        //   },
                        //   action: [
                        //     {
                        //       id: "ActionSetTarget",
                        //       source: "去左方的卡",
                        //       target: "去左方的卡",
                        //     },
                        //     {
                        //       id: "ActionSetTarget",
                        //       source: "去右方的卡",
                        //       target: "去右方的卡",
                        //     },
                        //   ],
                        // },
                        // feedback: [
                        //   {
                        //     id: "FeedbackAction",
                        //     action: [
                        //       {
                        //         id: "ActionMoveCardToPosition",
                        //         cards: { id: "カード", value: "去左方的卡" },
                        //         baSyou: {
                        //           id: "場所",
                        //           value: [
                        //             {
                        //               id: "AbsoluteBaSyou",
                        //               value: [playerID, "戦闘エリア（左）"],
                        //             },
                        //           ],
                        //         },
                        //       },
                        //       {
                        //         id: "ActionMoveCardToPosition",
                        //         cards: { id: "カード", value: "去右方的卡" },
                        //         baSyou: {
                        //           id: "場所",
                        //           value: [
                        //             {
                        //               id: "AbsoluteBaSyou",
                        //               value: [playerID, "戦闘エリア（右）"],
                        //             },
                        //           ],
                        //         },
                        //       },
                        //     ],
                        //   },
                        // ],
                      },
                    },
                  ];
                }

                case "ダメージ判定ステップ":
                  // 如果已經觸發規定の効果
                  if (ctx.gameState.flowMemory.hasTriggerEvent) {
                    return [{ id: "FlowNextTiming" }];
                  }
                  return [
                    {
                      id: "FlowHandleDamageStepRule",
                      description: "執行「ダメージ判定ステップ」",
                    },
                  ];
                case "帰還ステップ":
                  // 如果已經觸發規定の効果
                  if (ctx.gameState.flowMemory.hasTriggerEvent) {
                    return [{ id: "FlowNextTiming" }];
                  }
                  return [
                    {
                      id: "FlowHandleReturnStepRule",
                      description: "執行「帰還ステップ」",
                    },
                  ];
                default:
                  throw new Error("unknown phase:" + phase[1]);
              }
              break;
          }
        case "ターン終了時":
          switch (phase[2]) {
            case "ダメージリセット":
            case "効果解決":
            case "手札調整":
              // 如果玩家手牌超過6張，丟到剩下6張
              return [
                { id: "FlowNextTiming", description: `TODO:執行${phase[2]}` },
              ];
            case "効果終了。ターン終了":
              // 如果已經觸發事件
              if (ctx.gameState.flowMemory.hasTriggerEvent) {
                return [{ id: "FlowNextTiming" }];
              }
              return [
                {
                  id: "FlowTriggerTextEvent",
                  event: {
                    id: "GameEventOnTiming",
                    timing: ctx.gameState.timing,
                  },
                },
              ];
          }
      }
      break;
  }
}


function filterEnableCardText(
  ctx: GameContext,
  cardID: string,
  isPer: boolean,
  cardText: CardTextSiYouKaTa | CardTextZiDouKaTa
) {
  const {
    value: [_, baSyouKeyword],
  } = getCardBaSyou(ctx.gameState, cardID);
  // [起動]應該只有在場時有效
  if (isBa(baSyouKeyword) == false) {
    // 是G時，計算<>技能
    if (baSyouKeyword == "Gゾーン" && cardText.fixed) {
      return true;
    }
    // 恒常
    if (isPer) {
      if (baSyouKeyword == "ジャンクヤード") {
        return true;
      }
    }
    return false;
  }
  return true;
}

// 觸發事件腳本
// 在每次事件發生時都要呼叫
// 起動型技能
export function triggerTextEvent(
  ctx: GameContext,
  evt: GameEvent
): GameContext {
  log2("triggerTextEvent", evt.id);
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
  //       const wrapEvent: BlockPayload = {
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

// 更新命令列表
// 使用型技能
export function updateCommand(ctx: GameContext): GameContext {
  // ctx = {
  //   ...ctx,
  //   gameState: {
  //     ...ctx.gameState,
  //     commandEffect: [],
  //   },
  // };
  // return getCardStateIterator(ctx).reduce((ctx, [cardID, cardTextStates]) => {
  //   return cardTextStates.reduce((ctx, cardTextState) => {
  //     const cardTexts = (() => {
  //       switch (cardTextState.cardText.id) {
  //         case "使用型": {
  //           const {
  //             value: [_, baSyouKeyword],
  //           } = getCardBaSyou(ctx, cardID);
  //           // G的話，只計算<>
  //           if (baSyouKeyword == "Gゾーン") {
  //             if (cardTextState.cardText.fixed) {
  //               return [cardTextState.cardText];
  //             }
  //             return [];
  //           }
  //           return [cardTextState.cardText];
  //         }
  //         case "特殊型":
  //         case "恒常":
  //           return cardTextState.cardText.texts
  //             .filter((t) => {
  //               if (t.id == "使用型") {
  //                 const {
  //                   value: [_, baSyouKeyword],
  //                 } = getCardBaSyou(ctx, cardID);
  //                 // G的話，只計算<>
  //                 if (baSyouKeyword == "Gゾーン") {
  //                   if (t.fixed) {
  //                     return true;
  //                   }
  //                   return false;
  //                 }
  //                 return true;
  //               }
  //               return false;
  //             })
  //             .map((t) => t);
  //         default:
  //           return [];
  //       }
  //     })();
  //     return cardTexts.reduce((ctx, cardText) => {
  //       const cardController = getCardController(ctx, cardID);
  //       let wrapEvent: BlockPayload = {
  //         ...cardText.block,
  //         id: `updateCommand_${ctx.gameState.commandEffect.length}`,
  //         // 準備背景資料用來判斷
  //         cause: {
  //           id: "BlockPayloadCauseUpdateCommand",
  //           playerID: cardController,
  //           cardID: cardID,
  //           cardTextID: cardTextState.id,
  //           description: cardText.description,
  //         },
  //         // 若有需求，則將每個需求加上ID才能讓玩家選擇
  //         ...(cardText.block.require
  //           ? { require: wrapRequireKey(cardText.block.require) }
  //           : null),
  //         // 加上卡ID，讓varCtxID變成每張卡唯一。而不是遊戲唯一。
  //         contextID: `[${cardID}]_[${cardText.block.contextID}]`,
  //       };
  //       const varCtxID = "updateCommand";
  //       wrapEvent = wrapTip(ctx, true, wrapEvent, varCtxID);
  //       // 判斷需求是否能滿足
  //       let canPass = true;
  //       if (wrapEvent.require) {
  //         try {
  //           assertBlockPayloadTargetTypeValueLength(wrapEvent);
  //           doRequire(ctx, wrapEvent, wrapEvent.require, varCtxID);
  //         } catch (e) {
  //           log2(
  //             "updateCommand",
  //             `檢測可行性失敗，不加入指令列表:${cardText.description}`,
  //             wrapEvent,
  //             e
  //           );
  //           canPass = false;
  //         }
  //       }
  //       if (canPass == false) {
  //         return ctx;
  //       }
  //       // 直接加入指令列表
  //       ctx = {
  //         ...ctx,
  //         gameState: {
  //           ...ctx.gameState,
  //           commandEffect: [wrapEvent, ...ctx.gameState.commandEffect],
  //         },
  //       };
  //       return ctx;
  //     }, ctx);
  //   }, ctx);
  // }, ctx);
  return ctx
}

// 恒常, 常駐型技能
export function updateEffect(ctx: GameContext): GameContext {
  // 清空效果列表
  // ctx = {
  //   ...ctx,
  //   gameState: {
  //     ...ctx.gameState,
  //     effects: [],
  //   },
  // };
  // return getCardStateIterator(ctx).reduce((ctx, [cardID, cardTextStates]) => {
  //   return cardTextStates.reduce((ctx, cardTextState) => {
  //     const cardTexts = (() => {
  //       switch (cardTextState.cardText.id) {
  //         case "自動型":
  //           return [cardTextState.cardText].filter((t) => {
  //             if (t.id == "自動型" && t.category == "常駐") {
  //               return filterEnableCardText(ctx, cardID, false, t);
  //             }
  //             return false;
  //           });
  //         case "特殊型":
  //         case "恒常":
  //           // 恒常裡的常駐也是恒常
  //           return cardTextState.cardText.texts.filter((t) => {
  //             if (
  //               t.id == "自動型" &&
  //               (t.category == "恒常" || t.category == "常駐")
  //             ) {
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
  //       const wrapEvent: BlockPayload = {
  //         ...cardText.block,
  //         cause: {
  //           id: "BlockPayloadCauseUpdateEffect",
  //           playerID: cardController,
  //           cardID: cardID,
  //           cardTextID: cardTextState.id,
  //           description: cardText.description,
  //         },
  //         // 加上卡ID，讓varCtxID變成每張卡唯一。而不是遊戲唯一。
  //         contextID: `[${cardID}]_[${cardText.block.contextID}]`,
  //       };
  //       const varCtxID = "updateEffect";
  //       try {
  //         if (wrapEvent.require != null) {
  //           // 清空變量，因為是臨時性的訪問，所以可以這麼做
  //           ctx = {
  //             ...ctx,
  //             varsPool: {
  //               ...ctx.varsPool,
  //               [varCtxID]: {
  //                 targets: {},
  //                 jsonfpContext: {},
  //               },
  //             },
  //           };
  //           ctx = doRequire(ctx, wrapEvent, wrapEvent.require, varCtxID);
  //         }
  //         if (wrapEvent.feedback) {
  //           ctx = wrapEvent.feedback.reduce((ctx, feedback) => {
  //             return doFeedback(ctx, wrapEvent, feedback, varCtxID);
  //           }, ctx);
  //         }
  //       } catch (e) {
  //         log2("updateEffect", e);
  //       }
  //       return ctx;
  //     }, ctx);
  //   }, ctx);
  // }, ctx);
  return ctx
}

export function initState(ctx: GameContext): GameContext {
  // mapCard(ctx, (card) => {
  //   const [nextCtx] = getCardState(ctx, card.id);
  //   ctx = nextCtx;
  //   return card;
  // });
  ctx = {
    ...ctx,
    gameState: {
      ...ctx.gameState,
      activePlayerID: ctx.gameState.activePlayerID || PlayerA,
      table: {
        ...ctx.gameState.table,
        cardStack: {
          [getBaSyouID({ id: "AbsoluteBaSyou", value: [PlayerA, "Gゾーン"] })]:
            [],
          [getBaSyouID({
            id: "AbsoluteBaSyou",
            value: [PlayerA, "ジャンクヤード"],
          })]: [],
          [getBaSyouID({ id: "AbsoluteBaSyou", value: [PlayerA, "ハンガー"] })]:
            [],
          [getBaSyouID({
            id: "AbsoluteBaSyou",
            value: [PlayerA, "プレイされているカード"],
          })]: [],
          [getBaSyouID({
            id: "AbsoluteBaSyou",
            value: [PlayerA, "取り除かれたカード"],
          })]: [],
          [getBaSyouID({
            id: "AbsoluteBaSyou",
            value: [PlayerA, "戦闘エリア（右）"],
          })]: [],
          [getBaSyouID({
            id: "AbsoluteBaSyou",
            value: [PlayerA, "戦闘エリア（左）"],
          })]: [],
          [getBaSyouID({ id: "AbsoluteBaSyou", value: [PlayerA, "手札"] })]: [],
          [getBaSyouID({ id: "AbsoluteBaSyou", value: [PlayerA, "捨て山"] })]:
            [],
          [getBaSyouID({ id: "AbsoluteBaSyou", value: [PlayerA, "本国"] })]: [],
          [getBaSyouID({
            id: "AbsoluteBaSyou",
            value: [PlayerA, "配備エリア"],
          })]: [],
          [getBaSyouID({ id: "AbsoluteBaSyou", value: [PlayerB, "Gゾーン"] })]:
            [],
          [getBaSyouID({
            id: "AbsoluteBaSyou",
            value: [PlayerB, "ジャンクヤード"],
          })]: [],
          [getBaSyouID({ id: "AbsoluteBaSyou", value: [PlayerB, "ハンガー"] })]:
            [],
          [getBaSyouID({
            id: "AbsoluteBaSyou",
            value: [PlayerB, "プレイされているカード"],
          })]: [],
          [getBaSyouID({
            id: "AbsoluteBaSyou",
            value: [PlayerB, "取り除かれたカード"],
          })]: [],
          [getBaSyouID({
            id: "AbsoluteBaSyou",
            value: [PlayerB, "戦闘エリア（右）"],
          })]: [],
          [getBaSyouID({
            id: "AbsoluteBaSyou",
            value: [PlayerB, "戦闘エリア（左）"],
          })]: [],
          [getBaSyouID({ id: "AbsoluteBaSyou", value: [PlayerB, "手札"] })]: [],
          [getBaSyouID({ id: "AbsoluteBaSyou", value: [PlayerB, "捨て山"] })]:
            [],
          [getBaSyouID({ id: "AbsoluteBaSyou", value: [PlayerB, "本国"] })]: [],
          [getBaSyouID({
            id: "AbsoluteBaSyou",
            value: [PlayerB, "配備エリア"],
          })]: [],
          ...ctx.gameState.table.cardStack,
        },
      },
    },
  };
  ctx = initCardFace(ctx);
  return ctx;
}

export function initCardFace(ctx: GameContext): GameContext {
  let gameState = mapCard(ctx.gameState, (card) => {
    const baSyou = getCardBaSyou(ctx.gameState, card.id);
    switch (baSyou.value[1]) {
      case "本国":
      case "捨て山":
      case "手札":
        return {
          ...card,
          faceDown: true,
        };
      default:
        return {
          ...card,
          faceDown: false,
        };
    }
  }) as GameState;
  return { ...ctx, gameState: gameState as GameStateWithFlowMemory }
}

export function updateDestroyEffect(ctx: GameContext): GameContext {
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
  //   .map((cs): BlockPayload => {
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

export function getClientCommand(ctx: GameContext, clientID: string) {
  return ctx.gameState.commandEffect.filter((effect) => {
    const controller = getBlockOwner(effect);
    if (controller != clientID) {
      log2("getClientCommand", "you are not owner. return");
      return;
    }
    if (effect.cause?.id != "BlockPayloadCauseUpdateCommand") {
      throw new Error("must from command cause");
    }
    const { cardID, cardTextID } = effect.cause;
    // 在堆疊裡的技能不能再次發動(記免同一個技能一直切入)
    if (
      ctx.gameState.stackEffect.filter((e) => {
        if (e.cause?.id != "BlockPayloadCauseUpdateCommand") {
          return false;
        }
        if (e.cause.cardTextID != cardTextID) {
          return false;
        }
        return true;
      }).length
    ) {
      log2("getClientCommand", `cardTextID(${cardTextID})已經在堆疊裡.`);
      return;
    }
    const cardState = getCardState(ctx.gameState, cardID);
    const text = cardState.cardTextStates.find((v) => v.id == cardTextID);
    if (text == null) {
      throw new Error("must find text");
    }
    const siYouTiming = (() => {
      switch (text.cardText.id) {
        case "使用型":
          return text.cardText.timing;
        case "恒常":
        case "特殊型": {
          const t = text.cardText.texts.find((v) => v.id == "使用型");
          if (t == null) {
            throw new Error("t must find");
          }
          if (t.id != "使用型") {
            throw new Error("t must be 使用型");
          }
          return t.timing;
        }
        default:
          throw new Error("not support:" + text.cardText.id);
      }
    })();
    switch (siYouTiming[0]) {
      case "自軍":
        if (ctx.gameState.activePlayerID != clientID) {
          log2(
            "getClientCommand",
            `ctx.gameState.activePlayerID != ${clientID}`,
            effect
          );
          return;
        }
        break;
      case "敵軍":
        if (ctx.gameState.activePlayerID == clientID) {
          log2(
            "getClientCommand",
            `ctx.gameState.activePlayerID == ${clientID}`,
            effect
          );
          return;
        }
        break;
      case "戦闘フェイズ":
        if (ctx.gameState.timing[1][0] != "戦闘フェイズ") {
          log2(
            "getClientCommand",
            `ctx.gameState.timing[1][0] != "戦闘フェイズ"`,
            effect
          );
          return;
        }
        break;
      case "攻撃ステップ":
      case "防御ステップ":
      case "ダメージ判定ステップ":
      case "帰還ステップ":
        if (ctx.gameState.timing[1][0] != "戦闘フェイズ") {
          log2(
            "getClientCommand",
            `ctx.gameState.timing[1][0] != "戦闘フェイズ"`,
            effect
          );
          return;
        }
        if (ctx.gameState.timing[1][1] != siYouTiming[0]) {
          log2(
            "getClientCommand",
            `ctx.gameState.timing[1][1] != ${siYouTiming[0]}`,
            effect
          );
          return;
        }
        break;
    }
    switch (siYouTiming[0]) {
      case "自軍":
      case "敵軍":
        switch (siYouTiming[1]) {
          case "配備フェイズ":
          case "戦闘フェイズ":
            if (ctx.gameState.timing[1][0] != siYouTiming[1]) {
              log2(
                "getClientCommand",
                `ctx.gameState.timing[1][0] != ${siYouTiming[1]}`,
                effect
              );
              return;
            }
            break;
          case "攻撃ステップ":
          case "防御ステップ":
          case "ダメージ判定ステップ":
          case "帰還ステップ":
            if (ctx.gameState.timing[1][0] != "戦闘フェイズ") {
              log2(
                "getClientCommand",
                `ctx.gameState.timing[1][0] != "戦闘フェイズ"`,
                effect
              );
              return;
            }
            if (ctx.gameState.timing[1][1] != siYouTiming[1]) {
              log2(
                "getClientCommand",
                `ctx.gameState.timing[1][1] != ${siYouTiming[1]}`,
                effect
              );
              return;
            }
            break;
        }
        break;
    }
    return true;
  });
}

export function handleAttackDamage(
  ctx: GameContext,
  attackPlayerID: string,
  guardPlayerID: string,
  where: BaSyouKeyword,
  speed: AttackSpeed
): GameContext {
  const attackUnits = getBattleGroup(ctx.gameState, {
    id: "AbsoluteBaSyou",
    value: [attackPlayerID, where],
  });
  const attackPower = getBattleGroupBattlePoint(ctx.gameState, attackUnits);
  const guardUnits = getBattleGroup(ctx.gameState, {
    id: "AbsoluteBaSyou",
    value: [guardPlayerID, where],
  });
  const guardPower = getBattleGroupBattlePoint(ctx.gameState, guardUnits);
  const willTriggerEvent: GameEvent[] = [];
  {
    const currentAttackPlayerID = attackPlayerID;
    const currentGuardPlayerID = guardPlayerID;
    const willAttackUnits = attackUnits;
    const willGuardUnits = guardUnits;
    const willAttackPower = attackPower;
    log2("handleAttackDamage", "speed", speed);
    log2("handleAttackDamage", "baSyou", where);
    log2("handleAttackDamage", "willAttackUnits", willAttackUnits);
    log2("handleAttackDamage", "willGuardUnits", willGuardUnits);
    log2("handleAttackDamage", "willAttackPower", willAttackPower);
    if (willAttackUnits.length) {
      // 判斷速度1速度2是否可攻擊
      const hasSpeedAttack = isABattleGroup(ctx.gameState, ["速攻"], willAttackUnits[0]);
      if (
        // 有速攻的情況在速度1
        (hasSpeedAttack && speed == 1) ||
        // 沒速攻的情況在速度2
        (hasSpeedAttack == false && speed == 2)
      ) {
        let currentAttackPower = willAttackPower;
        log2("handleAttackDamage", "attack", currentAttackPower);
        // 敵方機體存在, 攻擊機體
        if (willGuardUnits.length) {
          const changedCardState = willGuardUnits.map((cardID): CardState => {
            const cs = getCardState(ctx.gameState, cardID);
            if (currentAttackPower <= 0) {
              return cs;
            }
            const setGroupCards = getSetGroupCards(ctx.gameState, cardID);
            const hp = setGroupCards
              .map((setGroupCardID) => {
                const [_2, _3, hp] = getCardBattlePoint(ctx.gameState, setGroupCardID);
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
              const gameEvent: GameEvent = {
                id: "破壊された場合",
                cardID: cs.id,
                destroyReason: reason,
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
            const gameEvent: GameEvent = {
              id: "戦闘ダメージを受けた場合",
              cardID: cs.id,
            };
            willTriggerEvent.push(gameEvent);
            return {
              ...cs,
              damage: nextDamage,
            };
          });
          // 套用傷害
          let gameState = mapCardState(ctx.gameState, (_, cs1) => {
            for (const cs2 of changedCardState) {
              if (cs1.id == cs2.id) {
                return cs2;
              }
            }
            return cs1;
          }) as GameState
          ctx = {
            ...ctx,
            gameState: gameState as GameStateWithFlowMemory
          }
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
            isABattleGroup(ctx.gameState, ["強襲"], willAttackUnits[0]))
        ) {
          // 本國傷害
          log2("handleAttackDamage", "attack 本国", currentAttackPower);
          let table = ctx.gameState.table;
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
            gameState: {
              ...ctx.gameState,
              table: table,
            },
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
    log2("handleAttackDamage", "speed", speed);
    log2("handleAttackDamage", "baSyou", where);
    log2("handleAttackDamage", "willAttackUnits", willAttackUnits);
    log2("handleAttackDamage", "willGuardUnits", willGuardUnits);
    log2("handleAttackDamage", "willAttackPower", willAttackPower);
    if (willAttackUnits.length) {
      // 判斷速度1速度2是否可攻擊
      const hasSpeedAttack = isABattleGroup(ctx.gameState, ["速攻"], willAttackUnits[0]);
      if (
        // 有速攻的情況在速度1
        (hasSpeedAttack && speed == 1) ||
        // 沒速攻的情況在速度2
        (hasSpeedAttack == false && speed == 2)
      ) {
        let currentAttackPower = willAttackPower;
        log2("handleAttackDamage", "attack", currentAttackPower);
        // 敵方機體存在, 攻擊機體
        if (willGuardUnits.length) {
          const changedCardState = willGuardUnits.map((cardID): CardState => {
            const cs = getCardState(ctx.gameState, cardID);
            if (currentAttackPower <= 0) {
              return cs;
            }
            const setGroupCards = getSetGroupCards(ctx.gameState, cardID);
            const hp = setGroupCards
              .map((setGroupCardID) => {
                const [_2, _3, hp] = getCardBattlePoint(ctx.gameState, setGroupCardID);
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
              const gameEvent: GameEvent = {
                id: "破壊された場合",
                cardID: cs.id,
                destroyReason: reason,
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
            const gameEvent: GameEvent = {
              id: "戦闘ダメージを受けた場合",
              cardID: cs.id,
            };
            willTriggerEvent.push(gameEvent);
            return {
              ...cs,
              damage: nextDamage,
            };
          });
          // 套用傷害
          let gameState = mapCardState(ctx.gameState, (_, cs1) => {
            for (const cs2 of changedCardState) {
              if (cs1.id == cs2.id) {
                return cs2;
              }
            }
            return cs1;
          }) as GameState
          ctx = {
            ...ctx,
            gameState: gameState as GameStateWithFlowMemory
          }
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