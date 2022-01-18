import {
  BaKeyword,
  BattleAreaKeyword,
  CardText,
  GameEvent,
  getNextTiming,
  getOpponentPlayerID,
  PlayerA,
  PlayerB,
} from "../tool/basic/basic";
import {
  BlockPayload,
  recurRequire,
  wrapRequireKey,
} from "../tool/basic/blockPayload";
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
    ...ctx.gameState.stackEffect,
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
  log("doEffect", effectID);
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
  log("doEffect", ctx);
  ctx = filterEffect(ctx, (effect) => {
    return effect.requirePassed != true;
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
  | FlowCancelPassCut
  | FlowHandleDamageStepRule
  | FlowHandleReturnStepRule;

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
      const nextTiming = getNextTiming(ctx.gameState.timing);
      ctx = {
        ...ctx,
        gameState: {
          ...ctx.gameState,
          timing: nextTiming,
          flowMemory: {
            ...ctx.gameState.flowMemory,
          },
        },
      };
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
    const currentActiveEffect = [
      ...ctx.gameState.commandEffect,
      ...ctx.gameState.immediateEffect,
      ...ctx.gameState.stackEffect,
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
  const myCommandList = (() => {
    return ctx.gameState.commandEffect.filter((effect) => {
      const controller = getBlockOwner(ctx, effect);
      if (controller != playerID) {
        return;
      }
      if (effect.cause?.id != "BlockPayloadCauseUpdateCommand") {
        throw new Error("must from command cause");
      }
      const { cardID, cardTextID } = effect.cause;
      const [_, cardState] = getCardState(ctx, cardID);
      const text = cardState.cardTextStates.find((v) => v.id == cardTextID);
      if (text == null) {
        throw new Error("must find text");
      }
      const siYouTiming = (() => {
        switch (text.cardText.id) {
          case "使用型":
            return text.cardText.timing;
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
          if (ctx.gameState.activePlayerID != playerID) {
            return;
          }
          break;
        case "敵軍":
          if (ctx.gameState.activePlayerID == playerID) {
            return;
          }
          break;
        case "戦闘フェイズ":
          if (ctx.gameState.timing[1][0] != "戦闘フェイズ") {
            return;
          }
          break;
        case "攻撃ステップ":
        case "防御ステップ":
        case "ダメージ判定ステップ":
        case "帰還ステップ":
          if (ctx.gameState.timing[1][0] != "戦闘フェイズ") {
            return;
          }
          if (ctx.gameState.timing[1][1] != siYouTiming[0]) {
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
                return;
              }
              break;
            case "攻撃ステップ":
            case "防御ステップ":
            case "ダメージ判定ステップ":
            case "帰還ステップ":
              if (ctx.gameState.timing[1][0] != "戦闘フェイズ") {
                return;
              }
              if (ctx.gameState.timing[1][1] != siYouTiming[1]) {
                return;
              }
              break;
          }
          break;
      }
      return true;
    });
  })();
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
    log("queryFlow", `isAllPassCut: ${isAllPassCut}`);
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
              return [
                {
                  id: "FlowAddBlock",
                  responsePlayerID: ctx.gameState.activePlayerID,
                  description: `${phase[0]}規定效果`,
                  block: {},
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
                              {
                                id: "ConditionCompareRole",
                                value: [
                                  {
                                    id: "「カード」的角色",
                                    value: {
                                      path: [
                                        {
                                          id: "カード",
                                          value: "去左方的卡",
                                        },
                                        "的角色",
                                      ],
                                    },
                                  },
                                  "==",
                                  {
                                    id: "「カード」的角色",
                                    value: ["ユニット"],
                                  },
                                ],
                              },
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
