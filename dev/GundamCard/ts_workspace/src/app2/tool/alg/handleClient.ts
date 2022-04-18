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
} from "../tool/basic/basic";
import {
  BlockPayload,
  recurRequire,
  Require,
  RequireTarget,
  wrapRequireKey,
} from "../tool/basic/blockPayload";
import {
  CardTextState,
  checkIsBattle,
  filterEffect,
  GameContext,
  getBlockOwner,
  getSetGroupCards,
  iterateEffect,
  reduceEffect,
} from "../tool/basic/gameContext";
import {
  getCard,
  mapCard,
  Card,
  iterateCard,
  moveCard,
} from "../../../tool/table";
import { mapEffect } from "../tool/basic/gameContext";
import { TargetType, TargetTypeCard } from "../tool/basic/targetType";
import { getCardBaSyou, getCardController } from "../tool/basic/handleCard";
import { log2 } from "../../../tool/logger";
import { Action } from "../tool/basic/action";
import {
  doRequire,
  doFeedback,
  doBlockPayload,
  doRequireTargetAction,
} from "./handleBlockPayload";
import {
  assertBlockPayloadTargetTypeValueLength,
  getCardState,
  isCanReroll,
} from "./helper";
import { doConditionTarget } from "./doConditionTarget";
import {
  getClientCommand,
  handleAttackDamage,
  triggerTextEvent,
  updateCommand,
  updateDestroyEffect,
  updateEffect,
} from "./handleGameContext";
import { getConditionMacro } from "./script/getConditionMacro";

export function setRequireAnswer(
  ctx: GameContext,
  requireID: string,
  answer: boolean
): GameContext {
  return mapEffect(ctx, (effect) => {
    if (effect.require == null) {
      return effect;
    }
    const nextRequire = recurRequire(effect.require, (require) => {
      if (require.key == null) {
        return require;
      }
      if (require.key != requireID) {
        return require;
      }
      if (require.id != "RequireYesNo") {
        return require;
      }
      return { ...require, answer: answer };
    });
    return {
      ...effect,
      require: nextRequire,
    };
  });
}

export function setRequireTarget(
  ctx: GameContext,
  requireID: string,
  varID: string,
  value: TargetType
): GameContext {
  return mapEffect(ctx, (effect) => {
    if (effect.require == null) {
      return effect;
    }
    const nextRequire = recurRequire(effect.require, (require): Require => {
      if (require.key == null) {
        return require;
      }
      if (require.key != requireID) {
        return require;
      }
      if (require.id != "RequireTarget") {
        return require;
      }
      const target = require.targets[varID];
      if (target == null) {
        throw new Error(`require(${requireID}) target(${varID}) not found`);
      }
      if (target.id != value.id) {
        throw new Error(
          `require(${requireID}) target(${varID}) type not match: ${target.id} != ${value.id}`
        );
      }
      // TODO: 判斷當中的張數必須一樣
      const nextTargets = {
        ...require.targets,
      };
      nextTargets[varID] = value;
      return { ...require, targets: nextTargets };
    });
    return {
      ...effect,
      require: nextRequire,
    };
  });
}

export function doEffectRequire(
  ctx: GameContext,
  effectID: string
): GameContext {
  return reduceEffect(
    ctx,
    (ctx, effect) => {
      if (effect.id != effectID) {
        return ctx;
      }
      if (effect.requirePassed) {
        throw new Error("已經處理了require");
      }
      const varCtxID = effect.contextID || effect.id;
      if (effect.require) {
        ctx = doRequire(ctx, effect, effect.require, varCtxID);
      }
      return mapEffect(ctx, (effect) => {
        if (effect.id != effectID) {
          return effect;
        }
        return { ...effect, requirePassed: true };
      });
    },
    ctx
  );
}

export function doEffectFeedback(
  ctx: GameContext,
  effectID: string
): GameContext {
  return reduceEffect(
    ctx,
    (ctx, effect) => {
      if (effect.id != effectID) {
        return ctx;
      }
      if (effect.feedbackPassed) {
        throw new Error("已經處理了feeback");
      }
      const varCtxID = effect.contextID || effect.id;
      if (effect.feedback) {
        ctx = effect.feedback.reduce((ctx, feedback) => {
          return doFeedback(ctx, effect, feedback, varCtxID);
        }, ctx);
      }
      return mapEffect(ctx, (effect) => {
        if (effect.id != effectID) {
          return effect;
        }
        return { ...effect, feedbackPassed: true };
      });
    },
    ctx
  );
}

export function setActiveEffectID(
  ctx: GameContext,
  playerID: string,
  effectID: string
): GameContext {
  if (ctx.gameState.activeEffectID != null) {
    throw new Error("有人在執行其它指令");
  }
  if (ctx.gameState.activeEffectID != null) {
    const currentActiveEffect = iterateEffect(ctx).find(
      (e) => e.id == ctx.gameState.activeEffectID
    );
    if (currentActiveEffect != null) {
      const controller = getBlockOwner(ctx, currentActiveEffect);
      if (controller != playerID) {
        throw new Error("[cancelCommand] 你不是控制者");
      }
      if (currentActiveEffect.requirePassed) {
        throw new Error("[cancelCommand] 已經處理需求的不能取消");
      }
    }
  }
  const effect = iterateEffect(ctx).find((e) => e.id == effectID);
  if (effect == null) {
    throw new Error("effect not found");
  }
  const controller = getBlockOwner(ctx, effect);
  if (controller != playerID) {
    throw new Error("[cancelCommand] 你不是控制者");
  }
  return {
    ...ctx,
    gameState: {
      ...ctx.gameState,
      activeEffectID: effectID,
    },
  };
}

export function cancelActiveEffectID(
  ctx: GameContext,
  playerID: string
): GameContext {
  if (ctx.gameState.activeEffectID == null) {
    throw new Error("[cancelEffectID] activeEffectID not exist");
  }
  const effect = iterateEffect(ctx).find(
    (e) => e.id == ctx.gameState.activeEffectID
  );
  if (effect == null) {
    return ctx;
  }
  const controller = getBlockOwner(ctx, effect);
  if (controller != playerID) {
    throw new Error("[cancelEffectID] 你不是控制者");
  }
  if (effect.requirePassed) {
    throw new Error("[cancelEffectID] 已經處理需求的不能取消");
  }
  return {
    ...ctx,
    gameState: {
      ...ctx.gameState,
      activeEffectID: null,
    },
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
  ctx = reduceEffect(
    ctx,
    (ctx, effect) => {
      if (effect.id != effectID) {
        return ctx;
      }
      return doBlockPayload(ctx, effect);
    },
    ctx
  );
  // 清除旗標，代表現在沒有正在支付的效果
  ctx = {
    ...ctx,
    gameState: {
      ...ctx.gameState,
      activeEffectID: null,
    },
  };
  // 將效果移除
  ctx = filterEffect(ctx, (effect) => {
    return effect.requirePassed != true;
  });
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
  ctx = filterEffect(ctx, (effect) => {
    if (effect.id != effectID) {
      return true;
    }
    const controller = getBlockOwner(ctx, effect);
    if (controller != playerID) {
      throw new Error("you are not controller");
    }
    if (effect.isOption != true) {
      throw new Error("isOption must true");
    }
    return false;
  });
  return ctx;
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
      ctx = setActiveEffectID(ctx, playerID, flow.effectID);
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
      return cancelActiveEffectID(ctx, playerID);
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
              // {
              //   const plyrID = PlayerA;
              //   const baSyou: AbsoluteBaSyou = {
              //     id: "AbsoluteBaSyou",
              //     value: [plyrID, "本国"],
              //   };
              //   const fromCS = ctx.gameState.table.cardStack[getBaSyouID(baSyou)];
              //   const toBaSyou: AbsoluteBaSyou = {
              //     id: "AbsoluteBaSyou",
              //     value: [plyrID, "手札"],
              //   };
              //   const toCS = ctx.gameState.table.cardStack[getBaSyouID(toBaSyou)];
              //   ctx = {
              //     ...ctx,
              //     gameState: {
              //       ...ctx.gameState,
              //       table: {
              //         ...ctx.gameState.table,
              //         cardStack: {
              //           ...ctx.gameState.table.cardStack,
              //           [getBaSyouID(baSyou)]: fromCS.slice(6),
              //           [getBaSyouID(toBaSyou)]: [...fromCS.slice(0, 6), ...toCS],
              //         },
              //       },
              //     },
              //   };
              // }
              // {
              //   const plyrID = PlayerB;
              //   const baSyou: AbsoluteBaSyou = {
              //     id: "AbsoluteBaSyou",
              //     value: [plyrID, "本国"],
              //   };
              //   const fromCS = ctx.gameState.table.cardStack[getBaSyouID(baSyou)];
              //   const toBaSyou: AbsoluteBaSyou = {
              //     id: "AbsoluteBaSyou",
              //     value: [plyrID, "手札"],
              //   };
              //   const toCS = ctx.gameState.table.cardStack[getBaSyouID(toBaSyou)];
              //   ctx = {
              //     ...ctx,
              //     gameState: {
              //       ...ctx.gameState,
              //       table: {
              //         ...ctx.gameState.table,
              //         cardStack: {
              //           ...ctx.gameState.table.cardStack,
              //           [getBaSyouID(baSyou)]: fromCS.slice(6),
              //           [getBaSyouID(toBaSyou)]: [...fromCS.slice(0, 6), ...toCS],
              //         },
              //       },
              //     },
              //   };
              // }
              {
                ctx = applyFlow(ctx, playerID, {
                  id: "FlowAddBlock",
                  responsePlayerID: PlayerA,
                  block: {
                    feedback: [
                      {
                        id: "FeedbackAction",
                        action: [{ id: "ActionRuleDraw" }],
                      },
                      {
                        id: "FeedbackAction",
                        action: [{ id: "ActionRuleDraw" }],
                      },
                      {
                        id: "FeedbackAction",
                        action: [{ id: "ActionRuleDraw" }],
                      },
                      {
                        id: "FeedbackAction",
                        action: [{ id: "ActionRuleDraw" }],
                      },
                      {
                        id: "FeedbackAction",
                        action: [{ id: "ActionRuleDraw" }],
                      },
                      {
                        id: "FeedbackAction",
                        action: [{ id: "ActionRuleDraw" }],
                      },
                    ],
                  },
                });

                ctx = applyFlow(ctx, playerID, {
                  id: "FlowAddBlock",
                  responsePlayerID: PlayerB,
                  block: {
                    feedback: [
                      {
                        id: "FeedbackAction",
                        action: [{ id: "ActionRuleDraw" }],
                      },
                      {
                        id: "FeedbackAction",
                        action: [{ id: "ActionRuleDraw" }],
                      },
                      {
                        id: "FeedbackAction",
                        action: [{ id: "ActionRuleDraw" }],
                      },
                      {
                        id: "FeedbackAction",
                        action: [{ id: "ActionRuleDraw" }],
                      },
                      {
                        id: "FeedbackAction",
                        action: [{ id: "ActionRuleDraw" }],
                      },
                      {
                        id: "FeedbackAction",
                        action: [{ id: "ActionRuleDraw" }],
                      },
                    ],
                  },
                });
              }

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
        ctx = checkIsBattle(ctx);
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
        ...(block.require ? { require: wrapRequireKey(block.require) } : null),
      };
      ctx = {
        ...ctx,
        gameState: {
          ...ctx.gameState,
          immediateEffect: [block, ...ctx.gameState.immediateEffect],
        },
      };
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
      {
        ctx = updateEffect(ctx);
      }
      const cardsInBattleArea = iterateCard(ctx.gameState.table).filter(
        (card) => {
          switch (getCardBaSyou(ctx, card.id).value[1]) {
            case "戦闘エリア（右）":
            case "戦闘エリア（左）":
              return true;
            default:
              return false;
          }
        }
      );
      // 移動到配置區
      ctx = cardsInBattleArea.reduce((ctx, card) => {
        const cardNotInBattleArea =
          cardsInBattleArea.map((c) => c.id).includes(card.id) == false;
        if (cardNotInBattleArea) {
          return ctx;
        }
        const cardController = getCardController(ctx, card.id);
        const fromBaSyou = getCardBaSyou(ctx, card.id);
        const toBaSyou: AbsoluteBaSyou = {
          ...fromBaSyou,
          value: [cardController, "配備エリア"],
        };
        const table = moveCard(
          ctx.gameState.table,
          getBaSyouID(fromBaSyou),
          getBaSyouID(toBaSyou),
          card.id,
          null
        );
        return {
          ...ctx,
          gameState: {
            ...ctx.gameState,
            table: table,
          },
        };
      }, ctx);
      // 横置
      {
        const table = mapCard(ctx.gameState.table, (card) => {
          const cardNotInBattleArea =
            cardsInBattleArea.map((c) => c.id).includes(card.id) == false;
          if (cardNotInBattleArea) {
            return card;
          }
          return {
            ...card,
            tap: true,
          };
        });
        ctx = {
          ...ctx,
          gameState: {
            ...ctx.gameState,
            table: table,
          },
        };
      }
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
      const effect = iterateEffect(ctx).find((e) => e.id == flow.effectID);
      if (effect == null) {
        throw new Error(`effectID not found:${flow.effectID}`);
      }
      assertBlockPayloadTargetTypeValueLength(effect);
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
      const activePlayerID = ctx.gameState.activePlayerID;
      if (activePlayerID == null) {
        throw new Error("activePlayer not found");
      }
      // 先更新效果
      ctx = updateEffect(ctx);
      const myCards = iterateCard(ctx.gameState.table)
        // 我控制的
        .filter((card) => {
          return getCardController(ctx, card.id) == activePlayerID;
        })
        // 可以重置的
        .filter((card) => {
          // 檢查是否可以重置
          // 必須在updateEffect之後呼叫才能確保卡片效果有在作用
          return isCanReroll(ctx, null, card.id);
        });
      // 重置控制者為主動玩家的卡
      const table = mapCard(ctx.gameState.table, (card) => {
        const isNotMyCard = myCards.map((c) => c.id).includes(card.id) == false;
        if (isNotMyCard) {
          return card;
        }
        return {
          ...card,
          tap: false,
        };
      });
      ctx = {
        ...ctx,
        gameState: {
          ...ctx.gameState,
          table: table,
        },
      };
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
  }
  return ctx;
}

export function queryFlow(ctx: GameContext, playerID: string): Flow[] {
  // 有玩家在支付卡片
  if (ctx.gameState.activeEffectID != null) {
    const currentActiveEffect = iterateEffect(ctx).find(
      (e) => e.id == ctx.gameState.activeEffectID
    );
    if (currentActiveEffect == null) {
      throw new Error("activeEffectID not found");
    }

    const enablePayCost = true;
    if (enablePayCost) {
      const controller = getBlockOwner(ctx, currentActiveEffect);
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

    const controller = getBlockOwner(ctx, currentActiveEffect);
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
      const controller = getBlockOwner(ctx, effect);
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
    const controller = getBlockOwner(ctx, effect);
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
                    feedback: [
                      {
                        id: "FeedbackAction",
                        action: [
                          {
                            id: "ActionRuleDraw",
                          },
                        ],
                      },
                    ],
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
                        contextID: `${phase[1]}規定效果`,
                        require: {
                          id: "RequireTarget",
                          targets: {
                            去左方的卡: {
                              id: "カード",
                              value: [],
                            },
                            去右方的卡: {
                              id: "カード",
                              value: [],
                            },
                          },
                          condition: {
                            id: "ConditionAnd",
                            and: [
                              getConditionMacro({
                                id: "變量x的場所包含於y",
                                x: { id: "カード", value: "去左方的卡" },
                                y: [
                                  {
                                    id: "AbsoluteBaSyou",
                                    value: [playerID, "配備エリア"],
                                  },
                                ],
                              }),
                              getConditionMacro({
                                id: "變量x的角色包含於y",
                                x: { id: "カード", value: "去左方的卡" },
                                y: ["ユニット"],
                              }),
                              getConditionMacro({
                                id: "變量x的場所包含於y",
                                x: { id: "カード", value: "去右方的卡" },
                                y: [
                                  {
                                    id: "AbsoluteBaSyou",
                                    value: [playerID, "配備エリア"],
                                  },
                                ],
                              }),
                              getConditionMacro({
                                id: "變量x的角色包含於y",
                                x: { id: "カード", value: "去右方的卡" },
                                y: ["ユニット"],
                              }),
                            ],
                          },
                          action: [
                            {
                              id: "ActionSetTarget",
                              source: "去左方的卡",
                              target: "去左方的卡",
                            },
                            {
                              id: "ActionSetTarget",
                              source: "去右方的卡",
                              target: "去右方的卡",
                            },
                          ],
                        },
                        feedback: [
                          {
                            id: "FeedbackAction",
                            action: [
                              {
                                id: "ActionMoveCardToPosition",
                                cards: { id: "カード", value: "去左方的卡" },
                                baSyou: {
                                  id: "場所",
                                  value: [
                                    {
                                      id: "AbsoluteBaSyou",
                                      value: [playerID, "戦闘エリア（左）"],
                                    },
                                  ],
                                },
                              },
                              {
                                id: "ActionMoveCardToPosition",
                                cards: { id: "カード", value: "去右方的卡" },
                                baSyou: {
                                  id: "場所",
                                  value: [
                                    {
                                      id: "AbsoluteBaSyou",
                                      value: [playerID, "戦闘エリア（右）"],
                                    },
                                  ],
                                },
                              },
                            ],
                          },
                        ],
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
