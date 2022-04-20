import {
  AbsoluteBaSyou,
  AttackSpeed,
  BaSyouKeyword,
  CardText,
  CardTextSiYouKaTa,
  CardTextZiDouKaTa,
  GameEvent,
  getBaSyouID,
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
  CardState,
  CardTextState,
  DestroyReason,
  GameContext,
  getBlockOwner,
  getSetGroupCards,
  reduceEffect,
} from "../tool/basic/gameContext";
import {
  getCard,
  mapCard,
  Card,
  reduceCard,
  getTopCards,
} from "../../../tool/table";
import { mapEffect } from "../tool/basic/gameContext";
import { TargetType, TargetTypeCard } from "../tool/basic/targetType";
import { getCardBaSyou, getCardController } from "../tool/basic/handleCard";
import { log2 } from "../../../tool/logger";
import { Action } from "../tool/basic/action";
import { doRequire, doFeedback } from "./handleBlockPayload";
import {
  assertBlockPayloadTargetTypeValueLength,
  getBattleGroup,
  getBattleGroupBattlePoint,
  getCardBattlePoint,
  getCardState,
  getCardStateIterator,
  isABattleGroup,
} from "./helper";
import { doConditionTarget } from "./doConditionTarget";
import { err2string } from "../../../tool/helper";
import { getCardTextMacro } from "./script/getCardTextMacro";
import { getTargetType } from "./getTargetType";

export function wrapTip(
  ctx: GameContext,
  autoFill: boolean,
  block: BlockPayload,
  varCtxID: string
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
        case "戦闘修正": {
          if (target.tip) {
            const tip = getTargetType(ctx, block, r.targets, target.tip);
            if (tip.id != "戦闘修正") {
              throw new Error("must be 戦闘修正");
            }
            if (!Array.isArray(tip.value)) {
              throw new Error("must be real value");
            }
            const validCardID = tip.value;
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
              const len =
                target.valueLengthInclude[target.valueLengthInclude.length - 1];
              return validCardID.slice(0, len);
            })();
            return {
              ...target,
              tip: tip,
              value: nextValues,
            };
          }
          throw new Error("「戦闘修正」的提示必須手動在卡牌腳本中定義(tip)");
        }
        case "カードのテキスト": {
          if (target.tip) {
            const tip = getTargetType(ctx, block, r.targets, target.tip);
            if (tip.id != "カードのテキスト") {
              throw new Error("must be カードのテキスト");
            }
            if (!Array.isArray(tip.value)) {
              throw new Error("must be real value");
            }
            const validCardID = tip.value;
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
              const len =
                target.valueLengthInclude[target.valueLengthInclude.length - 1];
              return validCardID.slice(0, len);
            })();
            return {
              ...target,
              tip: tip,
              value: nextValues,
            };
          }
          throw new Error(
            "「カードのテキスト」的提示必須手動在卡牌腳本中定義(tip)"
          );
        }
        case "カード": {
          if (target.tip) {
            const tip = getTargetType(ctx, block, r.targets, target.tip);
            if (tip.id != "カード") {
              throw new Error("must be カード");
            }
            if (!Array.isArray(tip.value)) {
              throw new Error("must be real value");
            }
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
              const len =
                target.valueLengthInclude[target.valueLengthInclude.length - 1];
              return validCardID.slice(0, len);
            })();
            return {
              ...target,
              value: nextValues,
              tip: tip,
            };
          }
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
              let msg: string | null = null;
              try {
                doConditionTarget(
                  ctx,
                  block,
                  {
                    ...r.targets,
                    [targetID]: tmp,
                  },
                  r.condition,
                  varCtxID
                );
              } catch (e) {
                msg = err2string(e);
              }
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
            const len =
              target.valueLengthInclude[target.valueLengthInclude.length - 1];
            return validCardID.slice(0, len);
          })();
          return {
            ...target,
            value: nextValues,
            tip: {
              id: "カード",
              value: validCardID,
            },
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

function filterEnableCardText(
  ctx: GameContext,
  cardID: string,
  isPer: boolean,
  cardText: CardTextSiYouKaTa | CardTextZiDouKaTa
) {
  const {
    value: [_, baSyouKeyword],
  } = getCardBaSyou(ctx, cardID);
  // [起動]應該只有在場時有效
  if (isBa(baSyouKeyword) == false) {
    // 是G時，計算<>技能
    if (baSyouKeyword == "Gゾーン" && cardText.fixed) {
      return true;
    }
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
  return getCardStateIterator(ctx).reduce((ctx, [cardID, cardTextStates]) => {
    return cardTextStates.reduce((ctx, cardTextState) => {
      const cardTexts = (() => {
        switch (cardTextState.cardText.id) {
          case "自動型":
            return [cardTextState.cardText].filter((t) => {
              if (t.id == "自動型" && t.category == "起動") {
                return filterEnableCardText(ctx, cardID, false, t);
              }
              return false;
            });
          case "特殊型":
          case "恒常":
            return cardTextState.cardText.texts.filter((t) => {
              if (t.id == "自動型" && t.category == "起動") {
                return filterEnableCardText(ctx, cardID, true, t);
              }
              return false;
            });
          default:
            return [];
        }
      })();
      return cardTexts.reduce((ctx, cardText) => {
        const cardController = getCardController(ctx, cardID);
        const wrapEvent: BlockPayload = {
          ...cardText.block,
          cause: {
            id: "BlockPayloadCauseGameEvent",
            playerID: cardController,
            cardID: cardID,
            cardTextID: cardTextState.id,
            gameEvent: evt,
            description: cardText.description,
          },
          // 加上卡ID，讓varCtxID變成每張卡唯一。而不是遊戲唯一。
          contextID: `[${cardID}]_[${cardText.block.contextID}]`,
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
          log2("triggerTextEvent", err2string(e));
        }
        return ctx;
      }, ctx);
    }, ctx);
  }, ctx);
}

// 更新命令列表
// 使用型技能
export function updateCommand(ctx: GameContext): GameContext {
  ctx = {
    ...ctx,
    gameState: {
      ...ctx.gameState,
      commandEffect: [],
    },
  };
  return getCardStateIterator(ctx).reduce((ctx, [cardID, cardTextStates]) => {
    return cardTextStates.reduce((ctx, cardTextState) => {
      const cardTexts = (() => {
        switch (cardTextState.cardText.id) {
          case "使用型": {
            const {
              value: [_, baSyouKeyword],
            } = getCardBaSyou(ctx, cardID);
            // G的話，只計算<>
            if (baSyouKeyword == "Gゾーン") {
              if (cardTextState.cardText.fixed) {
                return [cardTextState.cardText];
              }
              return [];
            }
            return [cardTextState.cardText];
          }
          case "特殊型":
          case "恒常":
            return cardTextState.cardText.texts
              .filter((t) => {
                if (t.id == "使用型") {
                  const {
                    value: [_, baSyouKeyword],
                  } = getCardBaSyou(ctx, cardID);
                  // G的話，只計算<>
                  if (baSyouKeyword == "Gゾーン") {
                    if (t.fixed) {
                      return true;
                    }
                    return false;
                  }
                  return true;
                }
                return false;
              })
              .map((t) => t);
          default:
            return [];
        }
      })();
      return cardTexts.reduce((ctx, cardText) => {
        const cardController = getCardController(ctx, cardID);
        let wrapEvent: BlockPayload = {
          ...cardText.block,
          id: `updateCommand_${ctx.gameState.commandEffect.length}`,
          // 準備背景資料用來判斷
          cause: {
            id: "BlockPayloadCauseUpdateCommand",
            playerID: cardController,
            cardID: cardID,
            cardTextID: cardTextState.id,
            description: cardText.description,
          },
          // 若有需求，則將每個需求加上ID才能讓玩家選擇
          ...(cardText.block.require
            ? { require: wrapRequireKey(cardText.block.require) }
            : null),
          // 加上卡ID，讓varCtxID變成每張卡唯一。而不是遊戲唯一。
          contextID: `[${cardID}]_[${cardText.block.contextID}]`,
        };
        const varCtxID = "updateCommand";
        wrapEvent = wrapTip(ctx, true, wrapEvent, varCtxID);
        // 判斷需求是否能滿足
        let canPass = true;
        if (wrapEvent.require) {
          try {
            assertBlockPayloadTargetTypeValueLength(wrapEvent);
            doRequire(ctx, wrapEvent, wrapEvent.require, varCtxID);
          } catch (e) {
            log2(
              "updateCommand",
              `檢測可行性失敗，不加入指令列表:${cardText.description}`,
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
  return getCardStateIterator(ctx).reduce((ctx, [cardID, cardTextStates]) => {
    return cardTextStates.reduce((ctx, cardTextState) => {
      const cardTexts = (() => {
        switch (cardTextState.cardText.id) {
          case "自動型":
            return [cardTextState.cardText].filter((t) => {
              if (t.id == "自動型" && t.category == "常駐") {
                return filterEnableCardText(ctx, cardID, false, t);
              }
              return false;
            });
          case "特殊型":
          case "恒常":
            // 恒常裡的常駐也是恒常
            return cardTextState.cardText.texts.filter((t) => {
              if (
                t.id == "自動型" &&
                (t.category == "恒常" || t.category == "常駐")
              ) {
                return filterEnableCardText(ctx, cardID, true, t);
              }
              return false;
            });
          default:
            return [];
        }
      })();
      return cardTexts.reduce((ctx, cardText) => {
        const cardController = getCardController(ctx, cardID);
        const wrapEvent: BlockPayload = {
          ...cardText.block,
          cause: {
            id: "BlockPayloadCauseUpdateEffect",
            playerID: cardController,
            cardID: cardID,
            cardTextID: cardTextState.id,
            description: cardText.description,
          },
          // 加上卡ID，讓varCtxID變成每張卡唯一。而不是遊戲唯一。
          contextID: `[${cardID}]_[${cardText.block.contextID}]`,
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
          log2("updateEffect", e);
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
  const table = mapCard(ctx.gameState.table, (card) => {
    const baSyou = getCardBaSyou(ctx, card.id);
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
  });
  return {
    ...ctx,
    gameState: {
      ...ctx.gameState,
      table: table,
    },
  };
}

export function updateDestroyEffect(ctx: GameContext): GameContext {
  // 將所有破壞效果加入破壞用堆疊
  // 加入破壞用堆疊後，主動玩家就必須決定解決順序
  // 決定後，依順序將所有效果移到正在解決中的堆疊，並重設切入的旗標，讓玩家可以在堆疊解決中可以再次切入
  const effects = ctx.gameState.cardState
    .filter((cs) => {
      if (cs.destroyReason == null) {
        return false;
      }
      return true;
    })
    .map((cs): BlockPayload => {
      const card = getCard(ctx.gameState.table, cs.id);
      if (card == null) {
        throw new Error("card not found");
      }
      if (cs.destroyReason == null) {
        throw new Error("destroyReason must found");
      }
      const setGroupCards = getSetGroupCards(ctx, card.id);
      const hp = setGroupCards
        .map((setGroupCardID) => {
          const [_2, _3, hp] = getCardBattlePoint(ctx, setGroupCardID);
          return hp;
        })
        .reduce((a, b) => a + b);
      return {
        ...getCardTextMacro({
          id: "破壊する",
          cause: {
            id: "BlockPayloadCauseDestroy",
            reason:
              hp <= 0
                ? {
                    id: "マイナスの戦闘修正",
                    playerID: cs.destroyReason.playerID,
                  }
                : cs.destroyReason,
            playerID: cs.destroyReason.playerID,
            cardID: cs.id,
            description: "破壞產生的自身的廢棄效果",
          },
        }).block,
        id: `updateDestroyEffect_${cs.id}`,
        // cause: {
        //   id: "BlockPayloadCauseDestroy",
        //   reason:
        //     hp <= 0
        //       ? {
        //           id: "マイナスの戦闘修正",
        //           playerID: cs.destroyReason.playerID,
        //         }
        //       : cs.destroyReason,
        //   playerID: cs.destroyReason.playerID,
        //   cardID: cs.id,
        //   description: "破壞產生的自身的廢棄效果",
        // },
        // feedback: [
        //   {
        //     id: "FeedbackAction",
        //     action: [
        //       {
        //         id: "ActionMoveCardToPosition",
        //         cards: {
        //           id: "カード",
        //           value: [cs.id],
        //         },
        //         baSyou: {
        //           id: "場所",
        //           value: [
        //             {
        //               id: "RelatedBaSyou",
        //               value: ["持ち主", "ジャンクヤード"],
        //             },
        //           ],
        //         },
        //       },
        //     ],
        //   },
        // ],
      };
    });
  ctx = {
    ...ctx,
    gameState: {
      ...ctx.gameState,
      destroyEffect: effects,
    },
  };
  return ctx;
}

function getTipXX(
  ctx: GameContext,
  blockID: string,
  requireID: string,
  targetID: string,
  varCtxID: string
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
            let msg: string | null = null;
            try {
              doConditionTarget(
                ctx,
                effect,
                {
                  ...targets,
                  [targetID]: tmp,
                },
                condition,
                varCtxID
              );
              if (msg == null) {
                validCardID.push(card.id);
              }
            } catch (e) {
              msg = err2string(e);
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
      log2("getClientCommand", "you are not owner. return");
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
      if (willGuardUnits.length == 0) {
        // 本國傷害
        let currentAttackPower = willAttackPower;
        let table = ctx.gameState.table;
        let fromCardStackID = getBaSyouID({
          id: "AbsoluteBaSyou",
          value: [currentGuardPlayerID, "本国"],
        });
        let toCardStackID = getBaSyouID({
          id: "AbsoluteBaSyou",
          value: [currentGuardPlayerID, "ジャンクヤード"],
        });
        let topCards = table.cardStack[fromCardStackID].slice(
          0,
          currentAttackPower
        );
        topCards = topCards.map((card) => {
          return {
            ...card,
            faceDown: false,
          };
        });
        table = {
          ...table,
          cardStack: {
            ...table.cardStack,
            [fromCardStackID]:
              table.cardStack[fromCardStackID].slice(currentAttackPower),
            [toCardStackID]: [...table.cardStack[toCardStackID], ...topCards],
          },
        };
        ctx = {
          ...ctx,
          gameState: {
            ...ctx.gameState,
            table: table,
          },
        };
      } else {
        const hasSpeedAttack = isABattleGroup(
          ctx,
          ["速攻"],
          willAttackUnits[0]
        );
        if (
          (hasSpeedAttack && speed == 1) ||
          (hasSpeedAttack == false && speed == 2)
        ) {
          let currentAttackPower = willAttackPower;
          const changedCardState = willGuardUnits.map((cardID): CardState => {
            const [_, cs] = getCardState(ctx, cardID);
            if (currentAttackPower <= 0) {
              return cs;
            }
            const setGroupCards = getSetGroupCards(ctx, cardID);
            const hp = setGroupCards
              .map((setGroupCardID) => {
                const [_2, _3, hp] = getCardBattlePoint(ctx, setGroupCardID);
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
          const cardState = ctx.gameState.cardState.map((cs1) => {
            for (const cs2 of changedCardState) {
              if (cs1.id == cs2.id) {
                return cs2;
              }
            }
            return cs1;
          });
          ctx = {
            ...ctx,
            gameState: {
              ...ctx.gameState,
              cardState: cardState,
            },
          };
          // 若傷害沒有用完, 就判斷強襲
          if (
            currentAttackPower > 0 &&
            isABattleGroup(ctx, ["強襲"], willAttackUnits[0])
          ) {
            // 本國傷害
            let table = ctx.gameState.table;
            let fromCardStackID = getBaSyouID({
              id: "AbsoluteBaSyou",
              value: [currentGuardPlayerID, "本国"],
            });
            let toCardStackID = getBaSyouID({
              id: "AbsoluteBaSyou",
              value: [currentGuardPlayerID, "ジャンクヤード"],
            });
            let topCards = table.cardStack[fromCardStackID].slice(
              0,
              currentAttackPower
            );
            topCards = topCards.map((card) => {
              return {
                ...card,
                faceDown: false,
              };
            });
            table = {
              ...table,
              cardStack: {
                ...table.cardStack,
                [fromCardStackID]:
                  table.cardStack[fromCardStackID].slice(currentAttackPower),
                [toCardStackID]: [
                  ...table.cardStack[toCardStackID],
                  ...topCards,
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
      if (willGuardUnits.length == 0) {
        // 防禦方不對本國造成傷害
      } else {
        const hasSpeedAttack = isABattleGroup(
          ctx,
          ["速攻"],
          willAttackUnits[0]
        );
        if (
          (hasSpeedAttack && speed == 1) ||
          (hasSpeedAttack == false && speed == 2)
        ) {
          let currentAttackPower = willAttackPower;
          const changedCardState = willGuardUnits.map((cardID): CardState => {
            const [_, cs] = getCardState(ctx, cardID);
            if (currentAttackPower <= 0) {
              return cs;
            }
            const setGroupCards = getSetGroupCards(ctx, cardID);
            const hp = setGroupCards
              .map((setGroupCardID) => {
                const [_2, _3, hp] = getCardBattlePoint(ctx, setGroupCardID);
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
          const cardState = ctx.gameState.cardState.map((cs1) => {
            for (const cs2 of changedCardState) {
              if (cs1.id == cs2.id) {
                return cs2;
              }
            }
            return cs1;
          });
          ctx = {
            ...ctx,
            gameState: {
              ...ctx.gameState,
              cardState: cardState,
            },
          };
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
