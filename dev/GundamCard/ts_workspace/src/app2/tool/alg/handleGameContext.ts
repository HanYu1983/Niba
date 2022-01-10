import { GameEvent } from "../tool/basic/basic";
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
import { GameContext } from "../tool/basic/gameContext";
import { getCard, mapCard, Card } from "../../../tool/table";
import { mapEffect } from "../tool/basic/gameContext";
import { TargetType, TargetTypeCard } from "../tool/basic/targetType";
import { doRequire, doFeedback } from "./handleBlockPayload";
import { getCardState } from "./helper";
import { doConditionTarget } from "./doConditionTarget";
import { log } from "../../../tool/logger";

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
            cardID: cardState.id,
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
  }, ctx);
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
        let wrapEvent: BlockPayload = {
          ...block,
          id: `updateCommand_${ctx.commandEffect.length}`,
          // 準備背景資料用來判斷
          cause: {
            id: "BlockPayloadCauseUpdateCommand",
            cardID: cardState.id,
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
