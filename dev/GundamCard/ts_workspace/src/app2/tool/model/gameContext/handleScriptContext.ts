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
import { GameContext } from "./gameContext";
import { doActionTarget } from "./doActionTarget";
import { doRequireCustom } from "./doRequireCustom";
import {
  CardState,
  mapEffect,
  reduceEffect,
  DEFAULT_CARD_STATE,
  CardTextState,
  getTargetType,
  getCardState,
} from ".";
import { mapCard } from "../../../../tool/table";
import { getPrototype } from "../../script";
import { wrapRequireKey } from "../scriptContext";
import { doConditionTarget } from "./doConditionTarget";

export type RequireCustomFunction = (
  gameCtx: GameContext,
  blockPayload: BlockPayload,
  varCtxID: string
) => GameContext;

export function getRequireCustomFunctionString(
  fn: RequireCustomFunction
): string {
  // 手動加入匿名方法的function name
  // 無法按下列這樣做，因為編譯器會把匿名方法的function name拿掉
  // (function main(){}).toString()
  return fn.toString().replace("function", "function main");
}

function getRequestCustomFunction(script: string): RequireCustomFunction {
  console.log(script);
  eval.apply(null, [script]);
  // 避免混淆器
  return eval.apply(null, ["main"]);
}

function doCondition(
  ctx: GameContext,
  blockPayload: BlockPayload,
  require: RequireTarget,
  condition: Condition
): string | null {
  return doConditionTarget(ctx, blockPayload, require.targets, condition);
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
    case "RequireScript": {
      return getRequestCustomFunction(require.string)(
        ctx,
        blockPayload,
        varCtxID
      );
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
  return ctx.gameState.cardState.reduce((ctx, cardState) => {
    return cardState.cardTextStates.reduce((ctx, cardTextState) => {
      const blocks: BlockPayload[] = (() => {
        switch (cardTextState.cardText.id) {
          case "自動型":
            switch (cardTextState.cardText.category) {
              case "常駐":
                return [];
              default:
                return [cardTextState.cardText.block];
            }
          case "使用型":
            return [];
          case "特殊型":
            return cardTextState.cardText.texts
              .filter((t) => t.id == "自動型" && t.category != "常駐")
              .map((t) => t.block);
        }
      })();
      return blocks.reduce((ctx, block) => {
        const wrapEvent: BlockPayload = {
          ...block,
          cause: {
            id: "BlockPayloadCauseGameEvent",
            cardID: cardState.id,
            gameEvent: evt,
            description: JSON.stringify(cardTextState.cardText.description),
          },
        };
        try {
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
            ctx = doRequire(ctx, wrapEvent, wrapEvent.require, varCtxID);
            if (wrapEvent.feedback) {
              ctx = wrapEvent.feedback.reduce((ctx, feedback) => {
                return doFeedback(ctx, wrapEvent, feedback, varCtxID);
              }, ctx);
            }
          }
        } catch (e) {
          console.log(e);
        }
        return ctx;
      }, ctx);
    }, ctx);
  }, ctx);

  // return ctx.gameState.cardState.reduce((ctx, cardState): GameContext => {
  //   return cardState.cardTextStates
  //     .filter((cardState) => {
  //       return cardState.enabled;
  //     })
  //     .flatMap((cardTextState): BlockPayload[] => {
  //       switch (cardTextState.cardText.id) {
  //         case "自動型":
  //           switch (cardTextState.cardText.category) {
  //             case "常駐":
  //               return [];
  //             default:
  //               return [cardTextState.cardText.block];
  //           }
  //         case "使用型":
  //           return [];
  //         case "特殊型":
  //           return cardTextState.cardText.texts
  //             .filter((t) => t.id == "自動型" && t.category != "常駐")
  //             .map((t) => t.block);
  //       }
  //     })
  //     .reduce((ctx, block) => {
  //       const wrapEvent: BlockPayload = {
  //         ...block,
  //         cause: {
  //           id: "BlockPayloadCauseGameEvent",
  //           cardID: cardState.id,
  //           gameEvent: evt,
  //           description: "",
  //         },
  //       };
  //       try {
  //         if (wrapEvent.require != null) {
  //           const varCtxID = "triggerTextEvent";
  //           // 清空變量，因為是臨時性的訪問，所以可以這麼做
  //           ctx = {
  //             ...ctx,
  //             varsPool: {
  //               ...ctx.varsPool,
  //               [varCtxID]: {
  //                 targets: {},
  //               },
  //             },
  //           };
  //           ctx = doRequire(ctx, wrapEvent, wrapEvent.require, varCtxID);
  //           if (wrapEvent.feedback) {
  //             ctx = wrapEvent.feedback.reduce((ctx, feedback) => {
  //               return doFeedback(ctx, wrapEvent, feedback, varCtxID);
  //             }, ctx);
  //           }
  //         }
  //       } catch (e) {
  //         console.log(e);
  //       }
  //       return ctx;
  //     }, ctx);
  // }, ctx);
}

// 更新命令列表
// 腳本中必須加入ActionAddBlock到"命令"列表中
// 因為會重新設置命令列表，所以只有使用型技能中的加入到命令列表才能正確運作
export function updateCommand(ctx: GameContext): GameContext {
  // 清空命令列表
  ctx = {
    ...ctx,
    commandEffect: [],
  };
  return ctx.gameState.cardState.reduce((ctx, cardState) => {
    return cardState.cardTextStates.reduce((ctx, cardTextState) => {
      const blocks: BlockPayload[] = (() => {
        switch (cardTextState.cardText.id) {
          case "自動型":
            return [];
          case "使用型":
            return [cardTextState.cardText.block];
          case "特殊型":
            return cardTextState.cardText.texts
              .filter((t) => t.id == "使用型")
              .map((t) => t.block);
        }
      })();
      return blocks.reduce((ctx, block) => {
        const wrapEvent: BlockPayload = {
          ...block,
          id: `updateCommand_${ctx.commandEffect.length}`,
          cause: {
            id: "BlockPayloadCauseUpdateCommand",
            cardID: cardState.id,
            description: JSON.stringify(cardTextState.cardText.description),
          },
          ...(block.require
            ? { require: wrapRequireKey(block.require) }
            : null),
        };
        // 直接加入指令列表
        ctx = {
          ...ctx,
          commandEffect: [wrapEvent, ...ctx.commandEffect],
        };
        return ctx;
      }, ctx);
    }, ctx);
  }, ctx);
}

export function updateEffect(ctx: GameContext): GameContext {
  // 清空效果列表
  ctx = {
    ...ctx,
    gameState: {
      ...ctx.gameState,
      effects: [],
    },
  };
  return ctx.gameState.cardState.reduce((ctx, cardState) => {
    return cardState.cardTextStates.reduce((ctx, cardTextState) => {
      const blocks: BlockPayload[] = (() => {
        // 只找出常駐型技能
        switch (cardTextState.cardText.id) {
          case "自動型":
            switch (cardTextState.cardText.category) {
              case "常駐":
                return [cardTextState.cardText.block];
              default:
                return [];
            }
          case "使用型":
            return [];
          case "特殊型":
            return cardTextState.cardText.texts
              .filter((t) => t.id == "自動型" && t.category == "常駐")
              .map((t) => t.block);
        }
      })();
      return blocks.reduce((ctx, block) => {
        const wrapEvent: BlockPayload = {
          ...block,
          cause: {
            id: "BlockPayloadCauseUpdateEffect",
            cardID: cardState.id,
            description: JSON.stringify(cardTextState.cardText.description),
          },
        };
        const varCtxID = "updateEffect";
        try {
          if (wrapEvent.require != null) {
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
            ctx = doRequire(ctx, wrapEvent, wrapEvent.require, varCtxID);
          }
          if (wrapEvent.feedback) {
            ctx = wrapEvent.feedback.reduce((ctx, feedback) => {
              return doFeedback(ctx, wrapEvent, feedback, varCtxID);
            }, ctx);
          }
        } catch (e) {
          console.log(e);
        }
        return ctx;
      }, ctx);
    }, ctx);
  }, ctx);

  // return ctx.gameState.cardState.reduce((ctx, cardState) => {
  //   return cardState.cardTextStates
  //     .filter((cardState) => {
  //       return cardState.enabled;
  //     })
  //     .flatMap((cardTextState): BlockPayload[] => {
  //       // 只找出常駐型技能
  //       switch (cardTextState.cardText.id) {
  //         case "自動型":
  //           switch (cardTextState.cardText.category) {
  //             case "常駐":
  //               return [cardTextState.cardText.block];
  //             default:
  //               return [];
  //           }
  //         case "使用型":
  //           return [];
  //         case "特殊型":
  //           return cardTextState.cardText.texts
  //             .filter((t) => t.id == "自動型" && t.category == "常駐")
  //             .map((t) => t.block);
  //       }
  //     })
  //     .reduce((ctx, block) => {
  //       const wrapEvent: BlockPayload = {
  //         ...block,
  //         cause: {
  //           id: "BlockPayloadCauseUpdateEffect",
  //           cardID: cardState.id,
  //           description: "",
  //         },
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
  //         console.log(e);
  //       }
  //       return ctx;
  //     }, ctx);
  // }, ctx);
}

export function initState(ctx: GameContext): GameContext {
  mapCard(ctx.gameState.table, (card) => {
    const [nextCtx] = getCardState(ctx, card.id);
    ctx = nextCtx;
    return card;
  });
  return ctx;
}
