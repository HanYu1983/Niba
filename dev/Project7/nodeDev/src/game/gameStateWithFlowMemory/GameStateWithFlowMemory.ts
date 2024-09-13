import { PlayerA, PlayerB } from "../define/PlayerID";
import { getCardBaSyou, mapCard } from "../gameState/CardTableComponent";
import { DEFAULT_GAME_STATE, GameState } from "../gameState/GameState";
import { AbsoluteBaSyouFn } from "../define/BaSyou";

export type Message = {
    id: "MessageCustom";
    value: string;
};

export type FlowMemoryComponent = {
    state: "prepareDeck" | "whoFirst" | "draw6AndConfirm" | "playing";
    hasTriggerEvent: boolean;
    hasPlayerPassPhase: { [key: string]: boolean };
    hasPlayerPassCut: { [key: string]: boolean };
    hasPlayerPassPayCost: { [key: string]: boolean };
    shouldTriggerStackEffectFinishedEvent: boolean;
    msgs: Message[];
}

export const DEFAULT_FLOW_MEMORY: FlowMemoryComponent = {
    state: "prepareDeck",
    hasTriggerEvent: false,
    hasPlayerPassPhase: {},
    hasPlayerPassCut: {},
    hasPlayerPassPayCost: {},
    shouldTriggerStackEffectFinishedEvent: false,
    msgs: [],
}

export type HasFlowMemoryComponent = {
    flowMemory: FlowMemoryComponent
}

export type GameStateWithFlowMemory = {
    activeEffectID: string | null;
} & GameState & HasFlowMemoryComponent;

export const DEFAULT_GAME_STATE_WITH_FLOW_MEMORY: GameStateWithFlowMemory = {
    ...DEFAULT_GAME_STATE,
    activeEffectID: null,
    flowMemory: DEFAULT_FLOW_MEMORY
}

// 更新命令列表
// 使用型技能
export function updateCommand(ctx: GameStateWithFlowMemory): GameStateWithFlowMemory {
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
export function updateEffect(ctx: GameStateWithFlowMemory): GameStateWithFlowMemory {
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

export function initState(ctx: GameStateWithFlowMemory): GameStateWithFlowMemory {
    // mapCard(ctx, (card) => {
    //   const [nextCtx] = getCardState(ctx, card.id);
    //   ctx = nextCtx;
    //   return card;
    // });
    ctx = {
        ...ctx,
        activePlayerID: ctx.activePlayerID || PlayerA,
        table: {
            ...ctx.table,
            cardStack: {
                [AbsoluteBaSyouFn.toString({ id: "AbsoluteBaSyou", value: [PlayerA, "Gゾーン"] })]:
                    [],
                [AbsoluteBaSyouFn.toString({
                    id: "AbsoluteBaSyou",
                    value: [PlayerA, "ジャンクヤード"],
                })]: [],
                [AbsoluteBaSyouFn.toString({ id: "AbsoluteBaSyou", value: [PlayerA, "ハンガー"] })]:
                    [],
                [AbsoluteBaSyouFn.toString({
                    id: "AbsoluteBaSyou",
                    value: [PlayerA, "プレイされているカード"],
                })]: [],
                [AbsoluteBaSyouFn.toString({
                    id: "AbsoluteBaSyou",
                    value: [PlayerA, "取り除かれたカード"],
                })]: [],
                [AbsoluteBaSyouFn.toString({
                    id: "AbsoluteBaSyou",
                    value: [PlayerA, "戦闘エリア（右）"],
                })]: [],
                [AbsoluteBaSyouFn.toString({
                    id: "AbsoluteBaSyou",
                    value: [PlayerA, "戦闘エリア（左）"],
                })]: [],
                [AbsoluteBaSyouFn.toString({ id: "AbsoluteBaSyou", value: [PlayerA, "手札"] })]: [],
                [AbsoluteBaSyouFn.toString({ id: "AbsoluteBaSyou", value: [PlayerA, "捨て山"] })]:
                    [],
                [AbsoluteBaSyouFn.toString({ id: "AbsoluteBaSyou", value: [PlayerA, "本国"] })]: [],
                [AbsoluteBaSyouFn.toString({
                    id: "AbsoluteBaSyou",
                    value: [PlayerA, "配備エリア"],
                })]: [],
                [AbsoluteBaSyouFn.toString({ id: "AbsoluteBaSyou", value: [PlayerB, "Gゾーン"] })]:
                    [],
                [AbsoluteBaSyouFn.toString({
                    id: "AbsoluteBaSyou",
                    value: [PlayerB, "ジャンクヤード"],
                })]: [],
                [AbsoluteBaSyouFn.toString({ id: "AbsoluteBaSyou", value: [PlayerB, "ハンガー"] })]:
                    [],
                [AbsoluteBaSyouFn.toString({
                    id: "AbsoluteBaSyou",
                    value: [PlayerB, "プレイされているカード"],
                })]: [],
                [AbsoluteBaSyouFn.toString({
                    id: "AbsoluteBaSyou",
                    value: [PlayerB, "取り除かれたカード"],
                })]: [],
                [AbsoluteBaSyouFn.toString({
                    id: "AbsoluteBaSyou",
                    value: [PlayerB, "戦闘エリア（右）"],
                })]: [],
                [AbsoluteBaSyouFn.toString({
                    id: "AbsoluteBaSyou",
                    value: [PlayerB, "戦闘エリア（左）"],
                })]: [],
                [AbsoluteBaSyouFn.toString({ id: "AbsoluteBaSyou", value: [PlayerB, "手札"] })]: [],
                [AbsoluteBaSyouFn.toString({ id: "AbsoluteBaSyou", value: [PlayerB, "捨て山"] })]:
                    [],
                [AbsoluteBaSyouFn.toString({ id: "AbsoluteBaSyou", value: [PlayerB, "本国"] })]: [],
                [AbsoluteBaSyouFn.toString({
                    id: "AbsoluteBaSyou",
                    value: [PlayerB, "配備エリア"],
                })]: [],
                ...ctx.table.cardStack,
            },
        },
    };
    ctx = initCardFace(ctx);
    return ctx;
}

export function initCardFace(ctx: GameStateWithFlowMemory): GameStateWithFlowMemory {
    return mapCard(ctx, (baSyou, card) => {
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
    }) as GameStateWithFlowMemory;
}
