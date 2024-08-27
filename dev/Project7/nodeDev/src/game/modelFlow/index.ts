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
  handleAttackDamage,
  triggerTextEvent,
  updateDestroyEffect,
} from "../model/GameState";
import {
  filterEffect,
  iterateEffect,
  reduceEffect,
  addImmediateEffect,
} from "../model/EffectStackComponent";
import { checkIsBattle } from "../model/IsBattleComponent";
import { log2 } from "../../tool/logger";
import { cancelActiveEffectID, deleteImmediateEffect, doEffect, getActiveEffectID, setActiveEffectID } from "./handleEffect";
import { getCardBaSyou, mapCard } from "../model/CardTableComponent";
import { getCardState, mapCardState } from "../model/CardStateComponent";
import { GameStateWithFlowMemory, DEFAULT_FLOW_MEMORY } from "./GameStateWithFlowMemory";
import { Flow } from "./Flow";

export type GameContext = {
  gameState: GameStateWithFlowMemory;
  versionID: number;
};

export const DEFAULT_GAME_CONTEXT: GameContext = {
  gameState: {
    ...DEFAULT_GAME_STATE,
    activeEffectID: null,
    flowMemory: DEFAULT_FLOW_MEMORY
  },
  versionID: 0,
};

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

