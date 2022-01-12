import {
  CardText,
  GameEvent,
  getNextTiming,
  PlayerA,
  PlayerB,
} from "../tool/basic/basic";
import { BlockPayload, recurRequire } from "../tool/basic/blockPayload";
import {
  CardTextState,
  filterEffect,
  GameContext,
  getBlockOwner,
  reduceEffect,
} from "../tool/basic/gameContext";
import { getCard, mapCard, Card } from "../../../tool/table";
import { mapEffect } from "../tool/basic/gameContext";
import { TargetType, TargetTypeCard } from "../tool/basic/targetType";
import { getCardController } from "../tool/basic/handleCard";
import { log } from "../../../tool/logger";
import { Action } from "../tool/basic/action";
import { doRequire, doFeedback } from "./handleBlockPayload";
import { getCardState } from "./helper";
import { doConditionTarget } from "./doConditionTarget";
import { triggerTextEvent, updateCommand } from "./handleGameContext";

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
    const nextRequire = recurRequire(effect.require, (require) => {
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
        [varID]: value,
      };
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
    const currentActiveEffect = [
      ...ctx.gameState.commandEffect,
      ...ctx.gameState.immediateEffect,
    ].find((e) => e.id == ctx.gameState.activeEffectID);
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
  const effect = [
    ...ctx.gameState.commandEffect,
    ...ctx.gameState.immediateEffect,
  ].find((e) => e.id == effectID);
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
  const effect = [
    ...ctx.gameState.commandEffect,
    ...ctx.gameState.immediateEffect,
  ].find((e) => e.id == ctx.gameState.activeEffectID);
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
  if (ctx.gameState.activeEffectID != effectID) {
    throw new Error("activeEffectID != effectID");
  }
  ctx = reduceEffect(
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
      if (effect.feedbackPassed) {
        throw new Error("已經處理了feedback");
      }
      if (effect.feedback) {
        ctx = effect.feedback.reduce((ctx, feedback) => {
          return doFeedback(ctx, effect, feedback, varCtxID);
        }, ctx);
      }
      return mapEffect(ctx, (effect) => {
        if (effect.id != effectID) {
          return effect;
        }
        return { ...effect, requirePassed: true, feedbackPassed: true };
      });
    },
    ctx
  );
  ctx = {
    ...ctx,
    gameState: {
      ...ctx.gameState,
      activeEffectID: null,
    },
  };
  ctx = filterEffect(ctx, (effect) => {
    return effect.requirePassed == false;
  });
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
};
type FlowTriggerTextEvent = {
  id: "FlowTriggerTextEvent";
  event: GameEvent;
};
type FlowNextTiming = {
  id: "FlowNextTiming";
};
type FlowAddBlock = {
  id: "FlowAddBlock";
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
type FlowDeleteImmediateEffect = {
  id: "FlowDeleteImmediateEffect";
  effectID: string | null;
  description?: string;
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

export type Flow =
  | FlowAddBlock
  | FlowTriggerTextEvent
  | FlowUpdateCommand
  | FlowNextTiming
  | FlowWaitPlayer
  | FlowSetActiveEffectID
  | FlowCancelActiveEffectID
  | FlowDoEffect
  | FlowDeleteImmediateEffect
  | FlowPassPhase
  | FlowCancelPassPhase
  | FlowPassCut
  | FlowCancelPassCut;

let idSeq = 0;
export function applyFlow(
  ctx: GameContext,
  playerID: string,
  flow: Flow
): GameContext {
  switch (flow.id) {
    case "FlowSetActiveEffectID": {
      if (flow.effectID == null) {
        throw new Error("effectID not found");
      }
      return setActiveEffectID(ctx, playerID, flow.effectID);
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
        log("applyFlow", "已經執行過triggerTextEvent");
        return ctx;
      }
      ctx = triggerTextEvent(ctx, flow.event);
      return {
        ...ctx,
        gameState: {
          ...ctx.gameState,
          flowMemory: {
            ...ctx.gameState.flowMemory,
            hasTriggerEvent: true,
          },
        },
      };
    case "FlowUpdateCommand":
      return updateCommand(ctx);
    case "FlowNextTiming": {
      const nextTiming = getNextTiming(ctx.gameState.timing);
      ctx = {
        ...ctx,
        gameState: {
          ...ctx.gameState,
          timing: nextTiming,
          flowMemory: {
            ...ctx.gameState.flowMemory,
            hasTriggerEvent: false,
          },
        },
      };
      return ctx;
    }
    case "FlowAddBlock": {
      let block = flow.block;
      block = {
        ...block,
        id: `FlowAddBlock_${idSeq++}`,
        cause: {
          id: "BlockPayloadCauseGameRule",
          playerID: playerID,
          description: "抽牌階段規定效果",
        },
      };
      return {
        ...ctx,
        gameState: {
          ...ctx.gameState,
          immediateEffect: [block, ...ctx.gameState.immediateEffect],
        },
      };
    }
  }
  return ctx;
}

export function queryFlow(ctx: GameContext, playerID: string): Flow[] {
  // 有玩家在支付卡片
  if (ctx.gameState.activeEffectID != null) {
    const currentActiveEffect = [
      ...ctx.gameState.commandEffect,
      ...ctx.gameState.immediateEffect,
    ].find((e) => e.id == ctx.gameState.activeEffectID);
    if (currentActiveEffect == null) {
      throw new Error("activeEffectID not found");
    }
    const controller = getBlockOwner(ctx, currentActiveEffect);
    if (controller != playerID) {
      return [
        {
          id: "FlowWaitPlayer",
          description: "等待對方支付ActiveEffectID",
        },
      ];
    }
    if (currentActiveEffect.requirePassed != true) {
      return [
        {
          id: "FlowDoEffect",
          effectID: ctx.gameState.activeEffectID,
        },
      ];
    }
    return [
      {
        id: "FlowCancelActiveEffectID",
        description: "取消支付效果，讓其它玩家可以支付",
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
    const optionEffect = myEffect.filter((v) => v.isOption == true);
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
      return [
        {
          id: "FlowSetActiveEffectID",
          effectID: myEffect[0].id || null,
          description: "選擇一個起動效果",
          tips: myEffect,
        },
        ...(optionEffect.length
          ? [
              {
                id: "FlowDeleteImmediateEffect",
                effectID: null,
                description: "你可以放棄這些效果",
              } as Flow,
            ]
          : []),
      ];
    }
    // 主動玩家
    return [
      {
        id: "FlowSetActiveEffectID",
        effectID: myEffect[0].id || null,
        description: "選擇一個起動效果",
        tips: myEffect,
      },
      ...(optionEffect.length
        ? [
            {
              id: "FlowDeleteImmediateEffect",
              effectID: null,
              description: "你可以放棄這些效果",
            } as Flow,
          ]
        : []),
    ];
  }
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
      ctx.gameState.flowMemory.hasPlayerPassCut[PlayerA] &&
      ctx.gameState.flowMemory.hasPlayerPassCut[PlayerB];
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
        if (isOpponentPassCut == false) {
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
        ...(() => {
          if (ctx.gameState.commandEffect.length == 0) {
            return [];
          }
          const myEffect: BlockPayload[] = [];
          ctx.gameState.commandEffect.forEach((effect) => {
            const controller = getBlockOwner(ctx, effect);
            if (controller == playerID) {
              myEffect.push(effect);
            }
          });
          return [];
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
  const isAllPassPhase =
    ctx.gameState.flowMemory.hasPlayerPassPhase[PlayerA] &&
    ctx.gameState.flowMemory.hasPlayerPassPhase[PlayerB];
  if (isAllPassPhase == false) {
    if (ctx.gameState.flowMemory.hasPlayerPassPhase[playerID]) {
      return [
        {
          id: "FlowCancelPassPhase",
          description: "取消宣告階段結束",
        },
      ];
    }
    return [
      {
        id: "FlowPassPhase",
        description: "宣告階段結束",
      },
      // 處理指令
      ...((): Flow[] => {
        if (ctx.gameState.commandEffect.length == 0) {
          return [];
        }
        const myEffect: BlockPayload[] = [];
        ctx.gameState.commandEffect.forEach((effect) => {
          const controller = getBlockOwner(ctx, effect);
          if (controller == playerID) {
            myEffect.push(effect);
          }
        });
        return [
          {
            id: "FlowSetActiveEffectID",
            effectID: myEffect[0].id || null,
            description: "選擇一個指令",
            tips: myEffect,
          },
        ];
      })(),
    ];
  }
  if (playerID != PlayerA) {
    return [
      {
        id: "FlowWaitPlayer",
        description: "等待伺服器處理",
      },
    ];
  }
  const [id, phase] = ctx.gameState.timing;
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
          return [
            {
              id: "FlowAddBlock",
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
        case "フリータイミング":
          if (ctx.gameState.flowMemory.hasTriggerEvent) {
            return [{ id: "FlowNextTiming" }];
          }
          return [
            {
              id: "FlowUpdateCommand",
            },
          ];
      }
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
              return [
                {
                  id: "FlowAddBlock",
                  block: {},
                },
              ];
            case "フリータイミング":
              if (ctx.gameState.flowMemory.hasTriggerEvent) {
                return [{ id: "FlowNextTiming" }];
              }
              return [
                {
                  id: "FlowUpdateCommand",
                },
              ];
          }
        case "ターン終了時":
          switch (phase[2]) {
            case "ダメージリセット":
            case "効果解決":
            case "手札調整":
              // 如果玩家手牌超過6張，丟到剩下6張
              return [{ id: "FlowNextTiming" }];
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
  return [];
}
