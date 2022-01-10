import { CardText, GameEvent, getNextTiming } from "../tool/basic/basic";
import {
  BlockPayload,
  Feedback,
  mapRequireTargets,
  recurRequire,
  Require,
  RequireCustom,
  RequireTarget,
  wrapRequireKey,
} from "../tool/basic/blockPayload";
import {
  CardTextState,
  GameContext,
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

// 觸發事件腳本
// 在每次事件發生時都要呼叫
// 這時技能可能會被加到起動列表或堆疊列表中
// 起動列表必須優先讓玩家處理
export function triggerTextEvent(
  ctx: GameContext,
  evt: GameEvent
): GameContext {
  // 只有事件類要和global一起算
  return [...ctx.gameState.cardState, ...ctx.gameState.globalCardState].reduce(
    (ctx, cardState: { cardID: string; cardTextStates: CardTextState[] }) => {
      return cardState.cardTextStates.reduce((ctx, cardTextState) => {
        log("triggerTextEvent", cardTextState.cardText.description);
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
          log("triggerTextEvent", block);
          const wrapEvent: BlockPayload = {
            ...block,
            cause: {
              id: "BlockPayloadCauseGameEvent",
              cardID: cardState.cardID,
              cardTextID: cardTextState.id,
              gameEvent: evt,
              description: JSON.stringify(cardTextState.cardText.description),
            },
          };
          const varCtxID = "triggerTextEvent";
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
    },
    ctx
  );
}

// 更新命令列表
export function updateCommand(ctx: GameContext): GameContext {
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
        let wrapEvent: BlockPayload = {
          ...block,
          id: `updateCommand_${ctx.gameState.commandEffect.length}`,
          // 準備背景資料用來判斷
          cause: {
            id: "BlockPayloadCauseUpdateCommand",
            cardID: cardState.cardID,
            cardTextID: cardTextState.id,
            description: JSON.stringify(cardTextState.cardText.description),
          },
          // 若有需求，則將每個需求加上ID才能讓玩家選擇
          ...(block.require
            ? { require: wrapRequireKey(block.require) }
            : null),
        };
        // 若有需求，則將需求加上提示
        if (wrapEvent.require) {
          // 針對每一個需求,
          const nextRequire = recurRequire(wrapEvent.require, (r) => {
            if (r.id != "RequireTarget") {
              return r;
            }
            // 的每一個對象,
            return mapRequireTargets(r, (targetID, target) => {
              if (r.key == null) {
                return target;
              }
              // 取得提示.
              const tip = getTip(ctx, wrapEvent.id || "", r.key, targetID);
              switch (target.id) {
                case "カード":
                  return {
                    ...target,
                    tipID: tip,
                  };
              }
              return target;
            });
          });
          wrapEvent = {
            ...wrapEvent,
            require: nextRequire,
          };
        }
        // 直接加入指令列表
        ctx = {
          ...ctx,
          gameState: {
            ...ctx.gameState,
            commandEffect: [wrapEvent, ...ctx.gameState.commandEffect],
          },
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
            cardID: cardState.cardID,
            cardTextID: cardTextState.id,
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
}

export function initState(ctx: GameContext): GameContext {
  mapCard(ctx.gameState.table, (card) => {
    const [nextCtx] = getCardState(ctx, card.id);
    ctx = nextCtx;
    return card;
  });
  return ctx;
}

export function getTip(
  ctx: GameContext,
  blockID: string,
  requireID: string,
  targetID: string
): string[] {
  let ret: string[] = [];
  mapEffect(ctx, (effect) => {
    if (effect.id == null) {
      return effect;
    }
    if (effect.id != blockID) {
      return effect;
    }
    if (effect.require == null) {
      return effect;
    }
    recurRequire(effect.require, (require) => {
      if (require.key != requireID) {
        return require;
      }
      if (require?.id != "RequireTarget") {
        return require;
      }
      if (require.condition == null) {
        return require;
      }
      if (require.targets == null) {
        return require;
      }
      const { condition, targets } = require;
      const target = targets[targetID];
      if (target == null) {
        throw new Error("[getTip] target not found");
      }
      switch (target.id) {
        case "カード": {
          const validCardID: string[] = [];
          mapCard(ctx.gameState.table, (card) => {
            const tmp: TargetTypeCard = {
              id: "カード",
              cardID: [card.id],
            };
            const msg = doConditionTarget(
              ctx,
              effect,
              {
                ...targets,
                [targetID]: tmp,
              },
              condition
            );
            log("getTip", msg);
            if (msg == null) {
              validCardID.push(card.id);
            }
            return card;
          });
          ret = validCardID;
          break;
        }
      }
      return require;
    });
    return effect;
  });
  return ret;
}

// 取得指令列表
// 玩家隨時可以呼叫
// 取得後，選擇要執行的指令呼叫setCommand
// 之後就按doEffectRequire, doEffectFeedback
// function getCommands(ctx: GameContext, playerID: string): BlockPayload[] {
//   let ret: BlockPayload[] = [];
//   let idSeq = 0;
//   ctx.gameState.cardState.forEach((cardState) => {
//     const controller = getCardController(ctx, cardState.id);
//     if (controller != playerID) {
//       return;
//     }
//     cardState.cardTextStates.forEach((cardTextState) => {
//       const blocks: BlockPayload[] = (() => {
//         switch (cardTextState.cardText.id) {
//           case "自動型":
//             return [];
//           case "使用型":
//             return [cardTextState.cardText.block];
//           case "特殊型":
//             return cardTextState.cardText.texts
//               .filter((t) => t.id == "使用型")
//               .map((t) => t.block);
//         }
//       })();
//       blocks.forEach((block) => {
//         let wrapEvent: BlockPayload = {
//           ...block,
//           id: `updateCommand_${idSeq++}`,
//           // 準備背景資料用來判斷
//           cause: {
//             id: "BlockPayloadCauseUpdateCommand",
//             cardID: cardState.cardID,
//             cardTextID: cardTextState.id,
//             description: JSON.stringify(cardTextState.cardText.description),
//           },
//           // 若有需求，則將每個需求加上ID才能讓玩家選擇
//           ...(block.require
//             ? { require: wrapRequireKey(block.require) }
//             : null),
//         };
//         // 若有需求，則將需求加上提示
//         if (wrapEvent.require) {
//           // 針對每一個需求,
//           const nextRequire = recurRequire(wrapEvent.require, (r) => {
//             if (r.id != "RequireTarget") {
//               return r;
//             }
//             // 的每一個對象,
//             return mapRequireTargets(r, (targetID, target) => {
//               if (r.key == null) {
//                 return target;
//               }
//               // 取得提示.
//               const tip = getTip(ctx, wrapEvent.id || "", r.key, targetID);
//               switch (target.id) {
//                 case "カード":
//                   return {
//                     ...target,
//                     tipID: tip,
//                   };
//               }
//               return target;
//             });
//           });
//           wrapEvent = {
//             ...wrapEvent,
//             require: nextRequire,
//           };
//           ret.push(wrapEvent);
//         }
//       });
//     });
//   });
//   return ret;
// }

// export function setCommand(ctx: GameContext, cmd: BlockPayload): GameContext {
//   if (ctx.gameState.commandEffect.length) {
//     throw new Error("有人在執行其它指令");
//   }
//   return {
//     ...ctx,
//     gameState: {
//       ...ctx.gameState,
//       commandEffect: [cmd],
//     },
//   };
// }

// export function cancelCommand(ctx: GameContext, playerID: string): GameContext {
//   if (ctx.gameState.commandEffect.length == 0) {
//     return ctx;
//   }
//   const cmd = ctx.gameState.commandEffect[0];
//   const cardID = cmd.cause?.cardID;
//   if (cardID == null) {
//     throw new Error("[cancelCommand] cardID not found");
//   }
//   const controller = getCardController(ctx, cardID);
//   if (controller != playerID) {
//     throw new Error("[cancelCommand] 你不是控制者");
//   }
//   if (cmd.requirePassed) {
//     throw new Error("[cancelCommand] 已經處理需求的不能取消");
//   }
//   return {
//     ...ctx,
//     gameState: {
//       ...ctx.gameState,
//       commandEffect: [],
//     },
//   };
// }

export function setActiveEffect(
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
      const cardID = currentActiveEffect.cause?.cardID;
      if (cardID == null) {
        throw new Error("[cancelCommand] cardID not found");
      }
      const controller = getCardController(ctx, cardID);
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
  const cardID = effect.cause?.cardID;
  if (cardID == null) {
    throw new Error("[cancelCommand] cardID not found");
  }
  const controller = getCardController(ctx, cardID);
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

export function cancelEffectID(
  ctx: GameContext,
  playerID: string
): GameContext {
  if (ctx.gameState.activeEffectID == null) {
    return ctx;
  }
  const effect = [
    ...ctx.gameState.commandEffect,
    ...ctx.gameState.immediateEffect,
  ].find((e) => e.id == ctx.gameState.activeEffectID);
  if (effect == null) {
    return ctx;
  }
  const cardID = effect.cause?.cardID;
  if (cardID == null) {
    throw new Error("[cancelCommand] cardID not found");
  }
  const controller = getCardController(ctx, cardID);
  if (controller != playerID) {
    throw new Error("[cancelCommand] 你不是控制者");
  }
  if (effect.requirePassed) {
    throw new Error("[cancelCommand] 已經處理需求的不能取消");
  }
  return {
    ...ctx,
    gameState: {
      ...ctx.gameState,
      activeEffectID: null,
    },
  };
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
type FlowCallAction = {
  id: "FlowCallAction";
  action: Action;
};
type FlowWaitPlayer = {
  id: "FlowWaitPlayer";
};
type Flow =
  | FlowTriggerTextEvent
  | FlowUpdateCommand
  | FlowCallAction
  | FlowNextTiming
  | FlowWaitPlayer;

export function queryFlow(ctx: GameContext, playerID: string): Flow[] {
  // 有玩家在支付卡片
  if (ctx.gameState.activeEffectID != null) {
    return [
      {
        id: "FlowWaitPlayer",
      },
    ];
  }
  // 處理立即效果
  if (ctx.gameState.immediateEffect.length) {
    // 選擇一個效果呼叫setEffectID
    // 不然呼叫cancelEffectID
    return [
      {
        id: "FlowWaitPlayer",
      },
    ];
  }
  // 處理堆疊效果，從最上方開始處理
  if (ctx.gameState.stackEffect.length) {
    // 如果雙方玩家還沒放棄切入
    // 回傳切入動作與相關卡片
    const topEffect = ctx.gameState.stackEffect[0];
    // 效果使用者呼叫doEffectRequire, doEffectFeedback
    return [
      {
        id: "FlowWaitPlayer",
      },
    ];
  }
  // 處理指令
  if (ctx.gameState.commandEffect.length) {
    // 選擇一個效果呼叫setEffectID
    // 不然呼叫cancelEffectID
    return [{ id: "FlowWaitPlayer" }];
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
          if (false) {
            return [{ id: "FlowNextTiming" }];
          }
          return [
            {
              id: "FlowTriggerTextEvent",
              event: 0,
            },
          ];
        case "規定の効果":
          // 如果已經觸發規定の効果
          if (false) {
            return [{ id: "FlowNextTiming" }];
          }
          return [
            {
              id: "FlowCallAction",
              action: {
                id: "ActionAddBlock",
                type: "立即",
                block: {},
              },
            },
          ];
        case "フリータイミング":
          if (false) {
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
              if (false) {
                return [{ id: "FlowNextTiming" }];
              }
              return [
                {
                  id: "FlowTriggerTextEvent",
                  event: 0,
                },
              ];
            case "規定の効果":
              // 如果已經觸發規定の効果
              if (false) {
                return [{ id: "FlowNextTiming" }];
              }
              return [
                {
                  id: "FlowCallAction",
                  action: {
                    id: "ActionAddBlock",
                    type: "立即",
                    block: {},
                  },
                },
              ];
            case "フリータイミング":
              if (false) {
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
              if (false) {
                return [{ id: "FlowNextTiming" }];
              }
              return [
                {
                  id: "FlowTriggerTextEvent",
                  event: 0,
                },
              ];
          }
      }
      break;
  }
  return [];
}

export function applyFlow(
  ctx: GameContext,
  playerID: string,
  flow: Flow
): GameContext {
  switch (flow.id) {
    case "FlowTriggerTextEvent":
      ctx = triggerTextEvent(ctx, flow.event);
      break;
    case "FlowUpdateCommand":
      // ctx = updateCommand(ctx);
      break;
    case "FlowNextTiming":
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
      break;
  }
  return ctx;
}
