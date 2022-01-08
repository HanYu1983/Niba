import {
  CardColor,
  BaSyou,
  CardCategory,
  CardText,
  SiYouTiming,
  TargetType,
  Timing,
  TIMING_CHART,
  PlayerA,
  getBaShouID,
  GameEvent,
} from "../basic";
import {
  BlockPayload,
  Feedback,
  recurRequire,
  Require,
  RequireCustom,
  RequireTarget,
} from "../blockPayload";
import {
  BlockContext,
  mapBlock,
  next,
  Block,
  addBlock,
} from "../scriptContext/blockContext";
import { Condition } from "../blockPayload/condition";
import { Action } from "../blockPayload/action";
import {
  ScriptContext,
  mapVarContext,
  mapBlockPayloadRequire,
  DEFAULT_SCRIPT_CONTEXT,
} from "../scriptContext";
import {
  DEFAULT_TABLE,
  getTopCards,
  mapCard,
  moveCard,
  Table,
} from "../../../../tool/table";
import { GameContext } from "./gameContext";
import { doConditionTarget } from "./doConditionTarget";
import { doActionTarget } from "./doActionTarget";
import { doRequireCustom } from "./doRequireCustom";
import { mapEffect, reduceEffect } from ".";

function doCondition(
  ctx: GameContext,
  blockPayload: BlockPayload,
  require: RequireTarget,
  condition: Condition
): string | null {
  switch (condition.id) {
    case "ConditionNot": {
      const result = doCondition(ctx, blockPayload, require, condition.not);
      const isOk = result == null;
      const notResult = isOk == false;
      return notResult ? null : `子項目必須為否`;
    }
    case "ConditionAnd": {
      const results = condition.and.map((cond) =>
        doCondition(ctx, blockPayload, require, cond)
      );
      const reasons = results.filter((reason) => reason);
      const hasFalse = reasons.length > 0;
      if (hasFalse) {
        return reasons.join(".");
      }
      return null;
    }
    case "ConditionOr": {
      const results = condition.or.map((cond) =>
        doCondition(ctx, blockPayload, require, cond)
      );
      const reasons = results.filter((reason) => reason);
      const hasTrue = reasons.length != condition.or.length;
      if (hasTrue) {
        return null;
      }
      return `不符合其中1項: ${reasons.join(".")}`;
    }
    case "ConditionTargetType":
      {
        // switch (condition.target) {
        //   case "カード": {
        //     if (target.id != "カード" && target.id != "このカード") {
        //       return "必須是カード";
        //     }
        //   }
        //   default:
        //     if (target.id != condition.target) {
        //       return `必須是${condition.target}`;
        //     }
        // }
      }
      break;
    case "ConditionCardOnCategory": {
      // if (target.id != "カード") {
      //   return "必須是カード";
      // }
      // const card = getCard(ctx.gameState.table, target.cardID);
      // if (card == null) {
      //   return `target cardID(${target.cardID}) not found`;
      // }

      // const rowData = askRowData(card.protoID);
      // switch (condition.category) {
      //   case "ユニット":
      //     if (rowData.category != "UNIT") {
      //       return `卡片類型必須是${condition.category}`;
      //     }
      //   case "コマンド":
      //     if (rowData.category != "COMMAND") {
      //       return `卡片類型必須是${condition.category}`;
      //     }
      //   case "キャラクター":
      //     if (rowData.category != "CHARACTER") {
      //       return `卡片類型必須是${condition.category}`;
      //     }
      //   case "オペレーション":
      //     if (rowData.category != "OPERATION") {
      //       return `卡片類型必須是${condition.category}`;
      //     }
      //   case "グラフィック":
      //     if (rowData.category != "GRAPHIC") {
      //       return `卡片類型必須是${condition.category}`;
      //     }
      // }
      return null;
    }
  }
  return null;
}

function doAction(
  ctx: GameContext,
  blockPayload: BlockPayload,
  require: RequireTarget,
  action: Action,
  varCtxID: string
): GameContext {
  Object.entries(require.targets).forEach(([key, target]) => {
    switch (target.id) {
      case "カード":
        {
          target.cardID.forEach((v, i) => {
            if (v == null) {
              throw new Error(`target(${key})[${i}] must not null`);
            }
          });
        }
        break;
      case "プレーヤー": {
        target.playerID.forEach((v, i) => {
          if (v == null) {
            throw new Error(`target(${key})[${i}] must not null`);
          }
        });
        break;
      }
    }
  });

  switch (action.id) {
    case "ActionSetTarget": {
      const { target } = action;
      const source = require.targets[action.source];
      if (source == null) {
        throw new Error(`require.targets[${action.source}] not found`);
      }
      return {
        ...ctx,
        varsPool: {
          ...ctx.varsPool,
          [varCtxID]: {
            ...ctx.varsPool[varCtxID],
            targets: {
              ...ctx.varsPool[varCtxID]?.targets,
              [target]: source,
            },
          },
        },
      };
    }
    default:
      return doActionTarget(
        ctx,
        blockPayload,
        require.targets,
        action,
        varCtxID
      );
  }
}

function doRequire(
  ctx: GameContext,
  blockPayload: BlockPayload,
  require: Require,
  varCtxID: string
): GameContext {
  switch (require.id) {
    case "RequireAnd": {
      return require.and.reduce((originGameCtx, r) => {
        return doRequire(originGameCtx, blockPayload, r, varCtxID);
      }, ctx);
    }
    case "RequireOr": {
      const results = require.or.map((r): [string | null, GameContext] => {
        try {
          return [null, doRequire(ctx, blockPayload, r, varCtxID)];
        } catch (e) {
          return [JSON.stringify(e), ctx];
        }
      });
      for (const [err, nextGameCtx] of results) {
        if (err == null) {
          return nextGameCtx;
        }
      }
      const msg = results
        .filter(([err, _]) => err)
        .map(([err, _]) => err)
        .join(".");
      throw new Error(msg);
    }
    case "RequireYesNo": {
      if (require.answer == null) {
        throw new Error("沒有回答Yes Or No");
      }
      return ctx;
    }
    case "RequireTarget": {
      if (require.condition) {
        const reason = doCondition(
          ctx,
          blockPayload,
          require,
          require.condition
        );
        if (reason != null) {
          throw new Error(reason);
        }
      }
      if (require.action?.length) {
        return require.action.reduce((originGameCtx, action) => {
          return doAction(
            originGameCtx,
            blockPayload,
            require,
            action,
            varCtxID
          );
        }, ctx);
      }
      return ctx;
    }
    case "RequireCustom": {
      return doRequireCustom(
        ctx,
        blockPayload,
        require,
        require.customID,
        varCtxID
      );
    }
    default:
      console.log(`not support yet: ${require.id}`);
      return ctx;
  }
}

function doFeedback(
  ctx: GameContext,
  blockPayload: BlockPayload,
  feedback: Feedback,
  varCtxID: string
): GameContext {
  switch (feedback.id) {
    case "FeedbackAction": {
      const actions = feedback.action;
      if (actions.length) {
        const targets = ctx.varsPool[varCtxID]?.targets || {};
        return actions.reduce((originGameCtx, action) => {
          return doActionTarget(
            originGameCtx,
            blockPayload,
            targets,
            action,
            varCtxID
          );
        }, ctx);
      }
      return ctx;
    }
    case "FeedbackTargetAction": {
      const actions = feedback.action;
      const targets = feedback.targets;
      if (actions.length) {
        return actions.reduce((originGameCtx, action) => {
          return doActionTarget(
            originGameCtx,
            blockPayload,
            targets,
            action,
            varCtxID
          );
        }, ctx);
      }
      return ctx;
    }
  }
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

// 觸發事件腳本
// 在每次事件發生時都要呼叫
// 這時技能可能會被加到起動列表或堆疊列表中
// 起動列表必須優先讓玩家處理
export function triggerTextEvent(
  ctx: GameContext,
  evt: GameEvent
): GameContext {
  return ctx.gameState.cardState.reduce((ctx, cardState): GameContext => {
    return cardState.cardTextStates
      .filter((cardState) => {
        return cardState.enabled;
      })
      .flatMap((cardTextState): BlockPayload[] => {
        switch (cardTextState.cardText.id) {
          case "自動型":
          case "使用型":
            return [cardTextState.cardText.block];
          case "特殊型":
            return cardTextState.cardText.texts.map((t) => t.block);
        }
      })
      .reduce((ctx, block) => {
        const uuidKey = `triggerTextEvent_${JSON.stringify(
          evt
        )}_${new Date().getTime()}`;
        const wrapEvent: BlockPayload = {
          ...block,
          id: uuidKey,
          cause: {
            id: "BlockPayloadCauseGameEvent",
            cardID: cardState.id,
            gameEvent: evt,
          },
        };
        if (wrapEvent.require != null) {
          const varCtxID = "triggerTextEvent";
          // 清空變量，因為是臨時性的訪問，所以可以這麼做
          ctx = {
            ...ctx,
            varsPool: {
              ...ctx.varsPool,
              [varCtxID]: {
                targets: {},
              },
            },
          };
          try {
            ctx = doRequire(ctx, wrapEvent, wrapEvent.require, varCtxID);
            if (wrapEvent.feedback) {
              ctx = wrapEvent.feedback.reduce((ctx, feedback) => {
                return doFeedback(ctx, wrapEvent, feedback, varCtxID);
              }, ctx);
            }
          } catch (e) {
            console.log(e);
          }
        }
        return ctx;
      }, ctx);
  }, ctx);
}

// 更新命令列表
// 腳本中必須加入ActionAddBlock到"命令"列表中
// 因為會重新設置命令列表，所以只有使用型技能中的加入到命令列表才能正確運作
export function updateCommand(ctx: GameContext, playerID: string): GameContext {
  // 清空命令列表
  ctx = {
    ...ctx,
    commandEffect: [],
  };
  return ctx.gameState.cardState.reduce((ctx, cardState) => {
    return cardState.cardTextStates.reduce((ctx, cardTextState) => {
      if (cardTextState.enabled == false) {
        return ctx;
      }
      // 只找出使用型技能
      if (cardTextState.cardText.id != "使用型") {
        return ctx;
      }
      const block = cardTextState.cardText.block;
      const uuidKey = `updateCommand_${playerID}_${new Date().getTime()}`;
      const wrapEvent: BlockPayload = {
        ...block,
        id: uuidKey,
        cause: {
          id: "BlockPayloadCauseAskCommand",
          cardID: cardState.id,
          playerID: playerID,
        },
      };
      if (wrapEvent.require != null) {
        const varCtxID = "updateCommand";
        // 清空變量，因為是臨時性的訪問，所以可以這麼做
        ctx = {
          ...ctx,
          varsPool: {
            ...ctx.varsPool,
            [varCtxID]: {
              targets: {},
            },
          },
        };
        try {
          ctx = doRequire(ctx, wrapEvent, wrapEvent.require, varCtxID);
          if (wrapEvent.feedback) {
            ctx = wrapEvent.feedback.reduce((ctx, feedback) => {
              return doFeedback(ctx, wrapEvent, feedback, varCtxID);
            }, ctx);
          }
        } catch (e) {
          console.log(e);
        }
      }
      return ctx;
    }, ctx);
  }, ctx);
}
