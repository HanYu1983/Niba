import {
  CardText,
  GameEvent,
  getBaShouID,
  getNextTiming,
  isBa,
  PlayerA,
  PlayerB,
} from "../tool/basic/basic";
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
  getBlockOwner,
  reduceEffect,
} from "../tool/basic/gameContext";
import { getCard, mapCard, Card, reduceCard } from "../../../tool/table";
import { mapEffect } from "../tool/basic/gameContext";
import { TargetType, TargetTypeCard } from "../tool/basic/targetType";
import { getCardBaSyou, getCardController } from "../tool/basic/handleCard";
import { log2 } from "../../../tool/logger";
import { Action } from "../tool/basic/action";
import { doRequire, doFeedback } from "./handleBlockPayload";
import { getCardState } from "./helper";
import { doConditionTarget } from "./doConditionTarget";
//import { createPlayUnitText } from "./createPlayUnitText";

export function wrapTip(
  ctx: GameContext,
  autoFill: boolean,
  block: BlockPayload
): BlockPayload {
  if (block.require == null) {
    return block;
  }
  // 針對每一個需求,
  const nextRequire = recurRequire(block.require, (r) => {
    if (r.id != "RequireTarget") {
      return r;
    }
    // 的每一個對象,
    return mapRequireTargets(r, (targetID, target): TargetType => {
      if (r.key == null) {
        return target;
      }
      switch (target.id) {
        case "カード": {
          // 取得提示.
          const { validCardID, msgs } = reduceCard(
            ctx.gameState.table,
            ({ validCardID, msgs }, card) => {
              if (r.condition == null) {
                return {
                  validCardID,
                  msgs,
                };
              }
              const tmp: TargetTypeCard = {
                id: "カード",
                value: [card.id],
              };
              const msg = doConditionTarget(
                ctx,
                block,
                {
                  ...r.targets,
                  [targetID]: tmp,
                },
                r.condition
              );
              return {
                validCardID: msg ? validCardID : [...validCardID, card.id],
                msgs: {
                  ...msgs,
                  ...(msg ? { [card.id]: msg } : null),
                },
              };
            },
            {
              validCardID: [] as string[],
              msgs: {} as { [key: string]: string },
            }
          );
          const nextValues = (() => {
            if (autoFill == false) {
              return target.value;
            }
            if (validCardID.length == 0) {
              return target.value;
            }
            if (!Array.isArray(target.value)) {
              return target.value;
            }
            if (target.valueLengthInclude == null) {
              return target.value;
            }
            if (target.valueLengthInclude.length == 0) {
              return target.value;
            }
            const len = target.valueLengthInclude[0];
            return validCardID.slice(0, len);
          })();
          return {
            ...target,
            value: nextValues,
            tipID: validCardID,
            tipMessage: msgs,
          };
        }
      }
      return target;
    });
  });
  return {
    ...block,
    require: nextRequire,
  };
}

// 觸發事件腳本
// 在每次事件發生時都要呼叫
// 起動型技能
export function triggerTextEvent(
  ctx: GameContext,
  evt: GameEvent
): GameContext {
  // 只有事件類要和global一起算
  return [...ctx.gameState.cardState, ...ctx.gameState.globalCardState].reduce(
    (ctx, cardState: { cardID: string; cardTextStates: CardTextState[] }) => {
      return cardState.cardTextStates.reduce((ctx, cardTextState) => {
        const blocks: BlockPayload[] = (() => {
          switch (cardTextState.cardText.id) {
            case "自動型":
              switch (cardTextState.cardText.category) {
                case "起動":
                  return [cardTextState.cardText.block];
                default:
                  return [];
              }
            case "使用型":
              return [];
            case "特殊型":
            case "恒常":
              return cardTextState.cardText.texts
                .filter((t) => t.id == "自動型" && t.category == "起動")
                .map((t) => t.block);
          }
        })();
        return blocks.reduce((ctx, block) => {
          const cardController = getCardController(ctx, cardState.cardID);
          const wrapEvent: BlockPayload = {
            ...block,
            cause: {
              id: "BlockPayloadCauseGameEvent",
              playerID: cardController,
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
                    jsonfpContext: {},
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
// 使用型技能
export function updateCommand(ctx: GameContext): GameContext {
  // clear command
  ctx = {
    ...ctx,
    gameState: {
      ...ctx.gameState,
      commandEffect: [],
    },
  };
  return ctx.gameState.cardState.reduce((ctx, cardState) => {
    // const playText: CardTextState = {
    //   id: `playText${cardState.cardID}`,
    //   enabled: true,
    //   cardText: createPlayUnitText(ctx, cardState.cardID),
    // };
    return cardState.cardTextStates.reduce((ctx, cardTextState) => {
      const blocks: BlockPayload[] = (() => {
        switch (cardTextState.cardText.id) {
          case "自動型":
            return [];
          case "使用型":
            return [cardTextState.cardText.block];
          case "特殊型":
          case "恒常":
            return cardTextState.cardText.texts
              .filter((t) => t.id == "使用型")
              .map((t) => t.block);
        }
      })();
      return blocks.reduce((ctx, block) => {
        const cardController = getCardController(ctx, cardState.cardID);
        let wrapEvent: BlockPayload = {
          ...block,
          id: `updateCommand_${ctx.gameState.commandEffect.length}`,
          // 準備背景資料用來判斷
          cause: {
            id: "BlockPayloadCauseUpdateCommand",
            playerID: cardController,
            cardID: cardState.cardID,
            cardTextID: cardTextState.id,
            description: JSON.stringify(cardTextState.cardText.description),
          },
          // 若有需求，則將每個需求加上ID才能讓玩家選擇
          ...(block.require
            ? { require: wrapRequireKey(block.require) }
            : null),
        };
        wrapEvent = wrapTip(ctx, true, wrapEvent);
        // 判斷需求是否能滿足
        let canPass = true;
        if (wrapEvent.require) {
          try {
            doRequire(ctx, wrapEvent, wrapEvent.require, "tmp");
          } catch (e) {
            log2(
              "updateCommand",
              "檢測可行性失敗，不加入指令列表",
              wrapEvent,
              e
            );
            canPass = false;
          }
        }
        if (canPass == false) {
          return ctx;
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

// 恒常, 常駐型技能
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
        switch (cardTextState.cardText.id) {
          case "自動型":
            switch (cardTextState.cardText.category) {
              case "常駐": {
                const {
                  value: [_, baSyouKeyword],
                } = getCardBaSyou(ctx, cardState.cardID);
                // 常駐技能只有在場中才能計算
                if (isBa(baSyouKeyword) == false) {
                  return [];
                }
                return [cardTextState.cardText.block];
              }
              default:
                return [];
            }
          case "使用型":
            return [];
          case "特殊型":
            return cardTextState.cardText.texts.flatMap((t) => {
              switch (t.id) {
                case "自動型":
                  switch (t.category) {
                    case "常駐": {
                      const {
                        value: [_, baSyouKeyword],
                      } = getCardBaSyou(ctx, cardState.cardID);
                      // 常駐技能只有在場中才能計算
                      if (isBa(baSyouKeyword) == false) {
                        return [];
                      }
                      return [t.block];
                    }
                    case "恒常":
                      return [t.block];
                    default:
                      return [];
                  }
                case "使用型":
                  return [];
              }
            });
          case "恒常":
            // 恒常裡的常駐也是恒常
            return cardTextState.cardText.texts
              .filter(
                (t) =>
                  t.id == "自動型" &&
                  (t.category == "恒常" || t.category == "常駐")
              )
              .map((t) => t.block);
        }
      })();
      return blocks.reduce((ctx, block) => {
        const cardController = getCardController(ctx, cardState.cardID);
        const wrapEvent: BlockPayload = {
          ...block,
          cause: {
            id: "BlockPayloadCauseUpdateEffect",
            playerID: cardController,
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
                  jsonfpContext: {},
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
  return {
    ...ctx,
    gameState: {
      ...ctx.gameState,
      activePlayerID: PlayerA,
      table: {
        ...ctx.gameState.table,
        cardStack: {
          [getBaShouID({ id: "AbsoluteBaSyou", value: [PlayerA, "Gゾーン"] })]:
            [],
          [getBaShouID({
            id: "AbsoluteBaSyou",
            value: [PlayerA, "ジャンクヤード"],
          })]: [],
          [getBaShouID({ id: "AbsoluteBaSyou", value: [PlayerA, "ハンガー"] })]:
            [],
          [getBaShouID({
            id: "AbsoluteBaSyou",
            value: [PlayerA, "プレイされているカード"],
          })]: [],
          [getBaShouID({
            id: "AbsoluteBaSyou",
            value: [PlayerA, "取り除かれたカード"],
          })]: [],
          [getBaShouID({
            id: "AbsoluteBaSyou",
            value: [PlayerA, "戦闘エリア（右）"],
          })]: [],
          [getBaShouID({
            id: "AbsoluteBaSyou",
            value: [PlayerA, "戦闘エリア（左）"],
          })]: [],
          [getBaShouID({ id: "AbsoluteBaSyou", value: [PlayerA, "手札"] })]: [],
          [getBaShouID({ id: "AbsoluteBaSyou", value: [PlayerA, "捨て山"] })]:
            [],
          [getBaShouID({ id: "AbsoluteBaSyou", value: [PlayerA, "本国"] })]: [],
          [getBaShouID({
            id: "AbsoluteBaSyou",
            value: [PlayerA, "配備エリア"],
          })]: [],
          [getBaShouID({ id: "AbsoluteBaSyou", value: [PlayerB, "Gゾーン"] })]:
            [],
          [getBaShouID({
            id: "AbsoluteBaSyou",
            value: [PlayerB, "ジャンクヤード"],
          })]: [],
          [getBaShouID({ id: "AbsoluteBaSyou", value: [PlayerB, "ハンガー"] })]:
            [],
          [getBaShouID({
            id: "AbsoluteBaSyou",
            value: [PlayerB, "プレイされているカード"],
          })]: [],
          [getBaShouID({
            id: "AbsoluteBaSyou",
            value: [PlayerB, "取り除かれたカード"],
          })]: [],
          [getBaShouID({
            id: "AbsoluteBaSyou",
            value: [PlayerB, "戦闘エリア（右）"],
          })]: [],
          [getBaShouID({
            id: "AbsoluteBaSyou",
            value: [PlayerB, "戦闘エリア（左）"],
          })]: [],
          [getBaShouID({ id: "AbsoluteBaSyou", value: [PlayerB, "手札"] })]: [],
          [getBaShouID({ id: "AbsoluteBaSyou", value: [PlayerB, "捨て山"] })]:
            [],
          [getBaShouID({ id: "AbsoluteBaSyou", value: [PlayerB, "本国"] })]: [],
          [getBaShouID({
            id: "AbsoluteBaSyou",
            value: [PlayerB, "配備エリア"],
          })]: [],
          ...ctx.gameState.table.cardStack,
        },
      },
    },
  };
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
    if (effect.require == null) {
      return effect;
    }
    if (effect.id != blockID) {
      return effect;
    }
    recurRequire(effect.require, (require) => {
      if (require.key == null) {
        return require;
      }
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
              value: [card.id],
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

export function getClientCommand(ctx: GameContext, clientID: string) {
  return ctx.gameState.commandEffect.filter((effect) => {
    const controller = getBlockOwner(ctx, effect);
    if (controller != clientID) {
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
          return;
        }
        break;
      case "敵軍":
        if (ctx.gameState.activePlayerID == clientID) {
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
