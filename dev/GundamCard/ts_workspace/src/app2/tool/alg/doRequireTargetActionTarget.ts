import {
  getBaShouID,
  CardColor,
  getNextTiming,
  isBa,
} from "../tool/basic/basic";
import { BlockPayload, wrapRequireKey } from "../tool/basic/blockPayload";
import { Action } from "../tool/basic/action";
import {
  Card,
  CardStack,
  createCard,
  getCard,
  getCardPosition,
  getTopCards,
  mapCard,
  moveCard,
} from "../../../tool/table";
import {
  CardState,
  CardTextState,
  DEFAULT_CARD_STATE,
  GameContext,
  getBlockOwner,
  getSetGroupCards,
  GlobalCardState,
} from "../tool/basic/gameContext";
import {
  getCardBaSyou,
  getCardOwner,
  getAbsoluteBaSyou,
} from "../tool/basic/handleCard";
import { log2 } from "../../../tool/logger";
import { TargetType } from "../tool/basic/targetType";
import {
  assertTargetTypeValueLength,
  getCardState,
  getTargetType,
} from "./helper";
import {
  initState,
  triggerTextEvent,
  updateCommand,
  updateEffect,
} from "./handleGameContext";
import { wrapBlockRequireKey } from "./handleBlockPayload";
import { jsonfp } from "./jsonfpHelper";

let idSeq = 0;
export function doRequireTargetActionTarget(
  ctx: GameContext,
  blockPayload: BlockPayload,
  targets: { [key: string]: TargetType },
  action: Action,
  varCtxID: string
): GameContext {
  log2("doRequireTargetActionTarget", "action", action);
  switch (action.id) {
    case "ActionSetSetCard": {
      const cards = getTargetType(ctx, blockPayload, targets, action.cards);
      if (cards?.id != "カード") {
        throw new Error("must カード");
      }
      if (!Array.isArray(cards.value)) {
        throw new Error("執行Action時的所有target必須是陣列");
      }
      assertTargetTypeValueLength(cards);
      const distCard = getTargetType(
        ctx,
        blockPayload,
        targets,
        action.distCard
      );
      if (distCard?.id != "カード") {
        throw new Error("must カード");
      }
      if (!Array.isArray(distCard.value)) {
        throw new Error("執行Action時的所有target必須是陣列");
      }
      assertTargetTypeValueLength(distCard);
      const distCardID = distCard.value[0];
      // 處理setGroup
      {
        const setGroupLink = cards.value.reduce((link, cardID) => {
          if (cardID == null) {
            throw new Error("target must not null");
          }
          if (link[distCardID] != null) {
            throw new Error("指定的卡是setCard, 不能再次set");
          }
          return {
            ...link,
            [cardID]: distCardID,
          };
        }, ctx.gameState.setGroupLink);
        ctx = {
          ...ctx,
          gameState: {
            ...ctx.gameState,
            setGroupLink: setGroupLink,
          },
        };
      }
      // 處理移動
      {
        const toBaSyou = getCardBaSyou(ctx, distCardID);
        if (toBaSyou.value[1] != "配備エリア") {
          return {
            ...ctx,
            gameState: {
              ...ctx.gameState,
              flowMemory: {
                ...ctx.gameState.flowMemory,
                msgs: [
                  ...ctx.gameState.flowMemory.msgs,
                  {
                    id: "MessageCustom",
                    value: "要設置的目標卡被移動了, 設置失敗",
                  },
                ],
              },
            },
          };
        }
        const toBaSyouID = getBaShouID(toBaSyou);
        const isToBa = isBa(toBaSyou.value[1]);
        ctx = cards.value.reduce((ctx, cardID) => {
          const fromBaSyou = getCardBaSyou(ctx, cardID);
          const fromBaSyouID = getBaShouID(fromBaSyou);
          const isFromBa = isBa(fromBaSyou.value[1]);
          const nextTable = moveCard(
            ctx.gameState.table,
            fromBaSyouID,
            toBaSyouID,
            cardID,
            null
          );
          ctx = {
            ...ctx,
            gameState: {
              ...ctx.gameState,
              table: nextTable,
            },
          };
          const isShowBa = isFromBa == false && isToBa;
          if (isShowBa) {
            ctx = triggerTextEvent(ctx, {
              id: "場に出た場合",
              cardID: cardID,
            });
          }
          ctx = triggerTextEvent(ctx, {
            id: "プレイされて場にセットされた場合",
            cardID: cardID,
          });
          return ctx;
        }, ctx);
      }
      return ctx;
    }
    case "ActionRoll": {
      const cards = getTargetType(ctx, blockPayload, targets, action.cards);
      if (cards?.id != "カード") {
        throw new Error("must カード");
      }
      if (!Array.isArray(cards.value)) {
        throw new Error("執行Action時的所有target必須是陣列");
      }
      assertTargetTypeValueLength(cards);
      // 整個setGroup一起
      const cardsWithItsSetCard = cards.value
        .flatMap((cardID) => {
          return [
            cardID,
            ...Object.keys(ctx.gameState.setGroupLink).filter((setCardID) => {
              return ctx.gameState.setGroupLink[setCardID] == cardID;
            }),
          ];
        })
        .reduce((acc, cardID) => {
          if (acc.includes(cardID)) {
            return acc;
          }
          return [...acc, cardID];
        }, [] as string[]);
      const table = cardsWithItsSetCard.reduce((table, cardID) => {
        if (cardID == null) {
          throw new Error("target must not null");
        }
        return mapCard(table, (card) => {
          if (card.id != cardID) {
            return card;
          }
          if (card.tap == true) {
            throw new Error(
              "[doRequireTargetActionTarget][ActionRoll] already tap"
            );
          }
          return {
            ...card,
            tap: true,
          };
        });
      }, ctx.gameState.table);
      return {
        ...ctx,
        gameState: {
          ...ctx.gameState,
          table: table,
        },
      };
    }
    case "ActionReroll": {
      const cards = getTargetType(ctx, blockPayload, targets, action.cards);
      if (cards?.id != "カード") {
        throw new Error("must カード");
      }
      if (!Array.isArray(cards.value)) {
        throw new Error("執行Action時的所有target必須是陣列");
      }
      assertTargetTypeValueLength(cards);
      // 整個setGroup一起
      const cardsWithItsSetCard = cards.value
        .flatMap((cardID) => {
          return [
            cardID,
            ...Object.keys(ctx.gameState.setGroupLink).filter((setCardID) => {
              return ctx.gameState.setGroupLink[setCardID] == cardID;
            }),
          ];
        })
        .reduce((acc, cardID) => {
          if (acc.includes(cardID)) {
            return acc;
          }
          return [...acc, cardID];
        }, [] as string[]);
      const table = cardsWithItsSetCard.reduce((table, cardID) => {
        if (cardID == null) {
          throw new Error("target must not null");
        }
        return mapCard(table, (card) => {
          if (card.id != cardID) {
            return card;
          }
          if (card.tap == false) {
            throw new Error(
              "[doRequireTargetActionTarget][ActionRoll] 已經是直立狀態, 不能直立"
            );
          }
          return {
            ...card,
            tap: false,
          };
        });
      }, ctx.gameState.table);
      return {
        ...ctx,
        gameState: {
          ...ctx.gameState,
          table: table,
        },
      };
    }
    case "ActionSetFace": {
      const cards = getTargetType(ctx, blockPayload, targets, action.cards);
      if (cards?.id != "カード") {
        throw new Error("must カード");
      }
      if (!Array.isArray(cards.value)) {
        throw new Error("執行Action時的所有target必須是陣列");
      }
      assertTargetTypeValueLength(cards);
      const faceDown = getTargetType(
        ctx,
        blockPayload,
        targets,
        action.faceDown
      );
      if (faceDown?.id != "布林") {
        throw new Error("must 布林");
      }
      if (!Array.isArray(faceDown.value)) {
        throw new Error("執行Action時的所有target必須是陣列");
      }
      if (faceDown.value.length == 0) {
        //throw new Error("執行Action時的所有target必須最少有一個值");
        log2(
          "doRequireTargetActionTarget",
          "將執行action，但對象為空陣列。直接回傳。"
        );
        return ctx;
      }
      const faceDownValue = faceDown.value[0];
      const table = cards.value.reduce((table, cardID) => {
        if (cardID == null) {
          throw new Error("target must not null");
        }
        return mapCard(table, (card) => {
          if (card.id != cardID) {
            return card;
          }
          if (card.faceDown == faceDownValue) {
            throw new Error(`你必須改變朝向的狀態: 現在是${card.faceDown}`);
          }
          return {
            ...card,
            faceDown: faceDownValue,
          };
        });
      }, ctx.gameState.table);
      return {
        ...ctx,
        gameState: {
          ...ctx.gameState,
          table: table,
        },
      };
    }
    case "ActionDrop": {
      const cards = getTargetType(ctx, blockPayload, targets, action.cards);
      if (cards?.id != "カード") {
        throw new Error("must カード");
      }
      if (!Array.isArray(cards.value)) {
        throw new Error("執行Action時的所有target必須是陣列");
      }
      assertTargetTypeValueLength(cards);
      ctx = cards.value.reduce((ctx, cardID) => {
        if (cardID == null) {
          throw new Error(
            "[doRequireTargetActionTarget][ActionDrop]target must not null"
          );
        }
        const ownerID = getCardOwner(ctx, cardID);
        const fromBaSyouID = getBaShouID(getCardBaSyou(ctx, cardID));
        const toBaSyouID = getBaShouID({
          id: "AbsoluteBaSyou",
          value: [ownerID, "捨て山"],
        });
        moveCard(ctx.gameState.table, fromBaSyouID, toBaSyouID, cardID, null);
        return ctx;
      }, ctx);
      return ctx;
    }
    case "ActionDraw": {
      const playerID = getBlockOwner(ctx, blockPayload);
      if (playerID == null) {
        throw new Error(`${playerID} not found`);
      }
      const fromBaSyouID = getBaShouID({
        id: "AbsoluteBaSyou",
        value: [playerID, "本国"],
      });
      const toBaSyouID = getBaShouID({
        id: "AbsoluteBaSyou",
        value: [playerID, "手札"],
      });
      const drawCount = action.count;
      const topCards = getTopCards(
        ctx.gameState.table,
        fromBaSyouID,
        drawCount
      );
      const table = topCards.reduce((table, card) => {
        // TODO: trigger card move
        return moveCard(table, fromBaSyouID, toBaSyouID, card.id, null);
      }, ctx.gameState.table);
      return {
        ...ctx,
        gameState: {
          ...ctx.gameState,
          table: table,
        },
      };
    }
    case "ActionRuleDraw": {
      const playerID = ctx.gameState.activePlayerID;
      if (playerID == null) {
        throw new Error("playerID not found");
      }
      const fromBaSyouID = getBaShouID({
        id: "AbsoluteBaSyou",
        value: [playerID, "本国"],
      });
      const toBaSyouID = getBaShouID({
        id: "AbsoluteBaSyou",
        value: [playerID, "手札"],
      });
      const drawCount = 1;
      const topCards = getTopCards(
        ctx.gameState.table,
        fromBaSyouID,
        drawCount
      );
      const table = topCards.reduce((table, card) => {
        // TODO: trigger card move
        return moveCard(table, fromBaSyouID, toBaSyouID, card.id, null);
      }, ctx.gameState.table);
      return {
        ...ctx,
        gameState: {
          ...ctx.gameState,
          table: table,
          timing: getNextTiming(ctx.gameState.timing),
        },
      };
    }
    case "ActionDestroy": {
      const cards = getTargetType(ctx, blockPayload, targets, action.cards);
      if (cards?.id != "カード") {
        throw new Error("must カード");
      }
      // TODO: trigger 破壞效果

      doRequireTargetActionTarget(
        ctx,
        blockPayload,
        targets,
        {
          id: "ActionAddBlock",
          type: "立即",
          block: {
            feedback: [
              {
                id: "FeedbackAction",
                action: [
                  {
                    id: "ActionMoveCardToPosition",
                    cards: {
                      id: "カード",
                      value: cards.value,
                    },
                    baSyou: {
                      id: "場所",
                      value: [
                        { id: "RelatedBaSyou", value: ["持ち主", "捨て山"] },
                      ],
                    },
                  },
                ],
              },
            ],
          },
        },
        varCtxID
      );
      return ctx;
    }
    case "ActionMoveCardToPosition":
      const cards = getTargetType(ctx, blockPayload, targets, action.cards);
      if (cards?.id != "カード") {
        throw new Error("must カード");
      }
      if (!Array.isArray(cards.value)) {
        throw new Error("執行Action時的所有target必須是陣列");
      }
      assertTargetTypeValueLength(cards);
      const targetBaSyou = getTargetType(
        ctx,
        blockPayload,
        targets,
        action.baSyou
      );
      if (targetBaSyou?.id != "場所") {
        throw new Error("must 場所");
      }
      if (!Array.isArray(targetBaSyou.value)) {
        throw new Error("執行Action時的所有target必須是陣列");
      }
      if (targetBaSyou.value.length == 0) {
        throw new Error("執行Action時的所有target必須最少有一個值");
      }
      const baSyou = targetBaSyou.value[0];
      // 整個setGroup一起移動
      const cardsWithItsSetCard = cards.value
        .flatMap((cardID) => {
          return [
            cardID,
            ...Object.keys(ctx.gameState.setGroupLink).filter((setCardID) => {
              return ctx.gameState.setGroupLink[setCardID] == cardID;
            }),
          ];
        })
        .reduce((acc, cardID) => {
          if (acc.includes(cardID)) {
            return acc;
          }
          return [...acc, cardID];
        }, [] as string[]);
      ctx = cardsWithItsSetCard.reduce((ctx, cardID) => {
        if (cardID == null) {
          throw new Error(
            "[doRequireTargetActionTarget][ActionMoveCardToPosition] cardID not found"
          );
        }
        // TODO: 依照規則在不同的指令場所時，卡的正面或反面會改變
        const fromBaSyou = getCardBaSyou(ctx, cardID);
        const fromBaSyouID = getBaShouID(fromBaSyou);
        const isFromBa = isBa(fromBaSyou.value[1]);
        const toBaSyou = getAbsoluteBaSyou(baSyou, ctx, cardID);
        const toBaSyouID = getBaShouID(toBaSyou);
        const isToBa = isBa(toBaSyou.value[1]);
        const nextTable = moveCard(
          ctx.gameState.table,
          fromBaSyouID,
          toBaSyouID,
          cardID,
          null
        );
        ctx = {
          ...ctx,
          gameState: {
            ...ctx.gameState,
            table: nextTable,
          },
        };
        // 出場時
        const isShowBa = isFromBa == false && isToBa;
        if (isShowBa) {
          ctx = triggerTextEvent(ctx, {
            id: "場に出た場合",
            cardID: cardID,
          });
        }
        return ctx;
      }, ctx);
      return ctx;
    case "ActionAddBlock": {
      const blockUuid = `ActionAddBlock_${new Date().getTime()}_${idSeq++}`;
      switch (action.type) {
        case "堆疊": {
          const wrappedBlock: BlockPayload = wrapBlockRequireKey({
            ...action.block,
            id: blockUuid,
            contextID: blockPayload.contextID,
            cause: blockPayload.cause,
          });
          return {
            ...ctx,
            gameState: {
              ...ctx.gameState,
              stackEffect: [wrappedBlock, ...ctx.gameState.stackEffect],
            },
          };
        }
        case "立即": {
          const wrappedBlock: BlockPayload = wrapBlockRequireKey({
            ...action.block,
            id: blockUuid,
            contextID: blockPayload.contextID,
            cause: blockPayload.cause,
          });
          return {
            ...ctx,
            gameState: {
              ...ctx.gameState,
              immediateEffect: [wrappedBlock, ...ctx.gameState.immediateEffect],
            },
          };
        }
      }
    }
    case "ActionAddEffect": {
      if (action.effectID) {
        const originEffect = ctx.gameState.effects.find((effect) => {
          return effect.id == action.effectID;
        });
        if (originEffect != null) {
          return ctx;
        }
        return {
          ...ctx,
          gameState: {
            ...ctx.gameState,
            effects: [
              { id: action.effectID, effect: action.effect },
              ...ctx.gameState.effects,
            ],
          },
        };
      }
      return {
        ...ctx,
        gameState: {
          ...ctx.gameState,
          effects: [
            {
              id: `ActionAddEffect_${new Date().getTime()}_${idSeq++}`,
              effect: action.effect,
            },
            ...ctx.gameState.effects,
          ],
        },
      };
    }
    case "ActionAddGlobalCardText": {
      const { cardState } = action;
      const cards = getTargetType(ctx, blockPayload, targets, action.cards);
      if (cards.id != "カード") {
        throw new Error("must カード");
      }
      if (!Array.isArray(cards.value)) {
        throw new Error("執行Action時的所有target必須是陣列");
      }
      assertTargetTypeValueLength(cards);
      const cardStateAfterSignID = cards.value.map(
        (cardID): GlobalCardState => {
          // 修正ID，變成一張卡吃能新增同樣的內文一次
          const cardStateID = `${cardID}_${cardState.id}`;
          return {
            ...cardState,
            id: cardStateID,
            cardID: cardID,
            cardTextStates: cardState.cardTextStates.map((cts, i) => {
              return {
                ...cts,
                id: `${cardID}_${cardState.id}_${cts.id}_${i}`,
              };
            }),
          };
        }
      );
      const cardStateWillAdd = cardStateAfterSignID.filter((t) => {
        return cardState.cardTextStates.find((v) => v.id == t.id) == null;
      });
      if (cardStateWillAdd.length == 0) {
        return ctx;
      }
      return {
        ...ctx,
        gameState: {
          ...ctx.gameState,
          globalCardState: [
            ...ctx.gameState.globalCardState,
            ...cardStateWillAdd,
          ],
        },
      };
    }
    case "ActionDeleteGlobalCardText": {
      const { cardTextStateID } = action;
      return {
        ...ctx,
        gameState: {
          ...ctx.gameState,
          globalCardState: ctx.gameState.globalCardState.filter((v) => {
            // 修正ID
            const cardStateID = `${v.cardID}_${cardTextStateID}`;
            return v.id != cardStateID;
          }),
        },
      };
    }
    case "ActionAddCardText": {
      const cards = getTargetType(ctx, blockPayload, targets, action.cards);
      if (cards.id != "カード") {
        throw new Error("must カード");
      }
      if (!Array.isArray(cards.value)) {
        throw new Error("執行Action時的所有target必須是陣列");
      }
      assertTargetTypeValueLength(cards);
      const cardTextState = getTargetType(
        ctx,
        blockPayload,
        targets,
        action.cardTextState
      );
      if (cardTextState.id != "TargetTypeCardTextState") {
        throw new Error("must TargetTypeCardTextState");
      }
      if (!Array.isArray(cardTextState.value)) {
        throw new Error("執行Action時的所有target必須是陣列");
      }
      if (cardTextState.value.length == 0) {
        //throw new Error("執行Action時的所有target必須最少有一個值");
        log2(
          "doRequireTargetActionTarget",
          "將執行action，但對象為空陣列。直接回傳。"
        );
        return ctx;
      }
      const cardTextStateFromSelection = cardTextState.value;

      cards.value.reduce((ctx, cardID) => {
        let [nextCtx, cardState] = getCardState(ctx, cardID);
        ctx = nextCtx;
        const cardTextStateAfterSignID = cardTextStateFromSelection.map((v) => {
          // 修改它的ID，變成一張卡吃能新增同樣的內文一次
          return {
            ...v,
            id: `${cardID}_${v.id}`,
          };
        });
        const cardTextStateWillAdd = cardTextStateAfterSignID.filter((t) => {
          return cardState.cardTextStates.find((v) => v.id == t.id) == null;
        });
        if (cardTextStateWillAdd.length == 0) {
          return ctx;
        }
        const nextCardState = nextCtx.gameState.cardState.map(
          (cardState): CardState => {
            if (cardState.id != cardID) {
              return cardState;
            }
            return {
              ...cardState,
              cardTextStates: [
                ...cardState.cardTextStates,
                ...cardTextStateWillAdd,
              ],
            };
          }
        );
        ctx = {
          ...ctx,
          gameState: {
            ...ctx.gameState,
            cardState: nextCardState,
          },
        };
        return ctx;
      }, ctx);
      return ctx;
    }
    case "ActionDeleteCardText": {
      const { cardTextStateID } = action;
      const cards = getTargetType(ctx, blockPayload, targets, action.cards);
      if (cards.id != "カード") {
        throw new Error("must カード");
      }
      if (!Array.isArray(cards.value)) {
        throw new Error("執行Action時的所有target必須是陣列");
      }
      assertTargetTypeValueLength(cards);
      const cardID = cards.value[0];
      if (cardID == null) {
        throw new Error("card ID not found");
      }
      let [nextCtx, _] = getCardState(ctx, cardID);
      const nextCardState = nextCtx.gameState.cardState.map(
        (cardState): CardState => {
          if (cardState.id != cardID) {
            return cardState;
          }
          return {
            ...cardState,
            cardTextStates: cardState.cardTextStates.filter(
              (s) => s.id != cardTextStateID
            ),
          };
        }
      );
      nextCtx = {
        ...nextCtx,
        gameState: {
          ...nextCtx.gameState,
          cardState: nextCardState,
        },
      };
      ctx = nextCtx;
      return ctx;
    }
    case "ActionRegisterChip": {
      return {
        ...ctx,
        gameState: {
          ...ctx.gameState,
          chipPool: {
            [action.protoID]: action.prototype,
          },
        },
      };
    }
    case "ActionCreateChip": {
      const playerID = getBlockOwner(ctx, blockPayload);
      const baSyouID = getBaShouID({
        id: "AbsoluteBaSyou",
        value: [playerID, "配備エリア"],
      });
      const nextTable = createCard(ctx.gameState.table, playerID, baSyouID, [
        action.protoID,
      ]);
      ctx = {
        ...ctx,
        gameState: {
          ...ctx.gameState,
          table: nextTable,
        },
      };
      ctx = initState(ctx);
      return ctx;
    }
    case "ActionOKiKaeRu": {
      const cardA = getTargetType(ctx, blockPayload, targets, action.cardA);
      if (cardA.id != "カード") {
        throw new Error("must カード");
      }
      if (!Array.isArray(cardA.value)) {
        throw new Error("執行Action時的所有target必須是陣列");
      }
      assertTargetTypeValueLength(cardA);
      const cardB = getTargetType(ctx, blockPayload, targets, action.cardB);
      if (cardB.id != "カード") {
        throw new Error("must カード");
      }
      if (!Array.isArray(cardB.value)) {
        throw new Error("執行Action時的所有target必須是陣列");
      }
      if (cardB.value.length == 0) {
        log2(
          "doRequireTargetActionTarget",
          "將執行action，但對象為空陣列。直接回傳。"
        );
        return ctx;
      }
      const cardAValue = cardA.value[0];
      const cardBValue = cardB.value[0];

      // p.77
      // 置換的繼承
      // 1. 直立/横置, 破壞, 累積的傷害
      // 2. 針對這張卡的戰鬥修正
      // 3. setCard
      // 4. 戰鬥修正的coin
      // 5. 未解決的待機中效果的對象
      {
        // 除了卡片ID，交換外觀和所有狀態
        let table = ctx.gameState.table;
        const cardACard = getCard(table, cardAValue);
        if (cardACard == null) {
          throw new Error("cardACard not found");
        }
        const cardBCard = getCard(table, cardBValue);
        if (cardBCard == null) {
          throw new Error("cardBCard not found");
        }
        const nextCardACard: Card = {
          ...cardBCard,
          id: cardACard.id,
        };
        table = mapCard(table, (card) => {
          if (card.id != cardACard.id) {
            return card;
          }
          return nextCardACard;
        });
        const nextCardBCard: Card = {
          ...cardACard,
          id: cardBCard.id,
        };
        table = mapCard(table, (card) => {
          if (card.id != cardBCard.id) {
            return card;
          }
          return nextCardBCard;
        });
        ctx = {
          ...ctx,
          gameState: {
            ...ctx.gameState,
            table: table,
          },
        };
      }
      {
        // 只交換內文，其它的維持原樣
        const [_, cardAState] = getCardState(ctx, cardAValue);
        const [_2, cardBState] = getCardState(ctx, cardBValue);
        const nextCardAState: CardState = {
          ...cardAState,
          cardTextStates: cardBState.cardTextStates,
        };
        let cardState = ctx.gameState.cardState;
        cardState = ctx.gameState.cardState.map((cs) => {
          if (cs.id != cardAState.id) {
            return cs;
          }
          return nextCardAState;
        });
        const nextCardBState: CardState = {
          ...cardBState,
          cardTextStates: cardAState.cardTextStates,
        };
        cardState = ctx.gameState.cardState.map((cs) => {
          if (cs.id != cardBState.id) {
            return cs;
          }
          return nextCardBState;
        });
        ctx = {
          ...ctx,
          gameState: {
            ...ctx.gameState,
            cardState: cardState,
          },
        };
      }
      // {
      //   //修改setGroup, 將B的整個setGroup移到A
      //   const cardBSetGroup = getSetGroupCards(ctx, cardBValue);
      //   const setGroupLink = cardBSetGroup.reduce(
      //     (link, cardBSetGroupCardID) => {
      //       if (cardBSetGroupCardID == cardBValue) {
      //         return link;
      //       }
      //       return {
      //         ...link,
      //         [cardBSetGroupCardID]: cardAValue,
      //       };
      //     },
      //     ctx.gameState.setGroupLink
      //   );
      //   ctx = {
      //     ...ctx,
      //     gameState: {
      //       ...ctx.gameState,
      //       setGroupLink: setGroupLink,
      //     },
      //   };
      // }

      // {
      //   // 移動cardA到cardB的位置
      //   const cardID = cardBValue;
      //   const fromBaSyouID = getBaShouID(getCardBaSyou(ctx, cardID));
      //   const toBaSyouID = getBaShouID(getCardBaSyou(ctx, cardAValue));
      //   const nextTable = moveCard(
      //     ctx.gameState.table,
      //     fromBaSyouID,
      //     toBaSyouID,
      //     cardID,
      //     null
      //   );
      //   ctx = {
      //     ...ctx,
      //     gameState: {
      //       ...ctx.gameState,
      //       table: nextTable,
      //     },
      //   };
      // }
      {
        // 直接廢棄cardB就行了，不必移動。因為卡被交換了
        const cardID = cardBValue;
        const fromBaSyouID = getBaShouID(getCardBaSyou(ctx, cardID));
        const toBaSyouID = getBaShouID({
          id: "AbsoluteBaSyou",
          value: [getCardOwner(ctx, cardID), "捨て山"],
        });
        const nextTable = moveCard(
          ctx.gameState.table,
          fromBaSyouID,
          toBaSyouID,
          cardID,
          null
        );
        ctx = {
          ...ctx,
          gameState: {
            ...ctx.gameState,
            table: nextTable,
          },
        };
        ctx = triggerTextEvent(ctx, {
          id: "「改装」の効果で廃棄される場合",
          cardID: cardID,
        });
      }
      {
        const cardID = cardAValue;
        ctx = triggerTextEvent(ctx, {
          id: "「改装」の効果で場に出た場合",
          cardID: cardID,
        });
        ctx = triggerTextEvent(ctx, {
          id: "場に出た場合",
          cardID: cardID,
        });
      }
      // 更新指令
      ctx = updateCommand(ctx);
      // 更新效果
      ctx = updateEffect(ctx);
      return ctx;
    }
    case "ActionSetFlag": {
      const cards = getTargetType(ctx, blockPayload, targets, action.cards);
      if (cards.id != "カード") {
        throw new Error("must カード");
      }
      if (!Array.isArray(cards.value)) {
        throw new Error("執行Action時的所有target必須是陣列");
      }
      assertTargetTypeValueLength(cards);
      const cardIDs = cards.value;
      const flag = getTargetType(ctx, blockPayload, targets, action.flag);
      if (flag.id != "字串") {
        throw new Error("must 字串");
      }
      if (!Array.isArray(flag.value)) {
        throw new Error("執行Action時的所有target必須是陣列");
      }
      if (flag.value.length == 0) {
        log2(
          "doRequireTargetActionTarget",
          "將執行action，但對象為空陣列。直接回傳。"
        );
        return ctx;
      }
      const flags = flag.value;
      const nextCardStates = ctx.gameState.cardState.map((cardState) => {
        if (cardIDs.includes(cardState.id) == false) {
          return cardState;
        }
        const nextFlags = flags.reduce((flags, flag) => {
          if (flags.includes(flag)) {
            return flags;
          }
          return [...flags, flag];
        }, cardState.flags);
        return {
          ...cardState,
          flags: nextFlags,
        };
      });
      return {
        ...ctx,
        gameState: {
          ...ctx.gameState,
          cardState: nextCardStates,
        },
      };
    }
    case "ActionAddFlag": {
      const cards = getTargetType(ctx, blockPayload, targets, action.cards);
      if (cards.id != "カード") {
        throw new Error("must カード");
      }
      if (!Array.isArray(cards.value)) {
        throw new Error("執行Action時的所有target必須是陣列");
      }
      assertTargetTypeValueLength(cards);
      const cardIDs = cards.value;
      const flag = getTargetType(ctx, blockPayload, targets, action.flag);
      if (flag.id != "字串") {
        throw new Error("must 字串");
      }
      if (!Array.isArray(flag.value)) {
        throw new Error("執行Action時的所有target必須是陣列");
      }
      if (flag.value.length == 0) {
        log2(
          "doRequireTargetActionTarget",
          "將執行action，但對象為空陣列。直接回傳。"
        );
        return ctx;
      }
      const flags = flag.value;
      const nextCardStates = ctx.gameState.cardState.map((cardState) => {
        if (cardIDs.includes(cardState.id) == false) {
          return cardState;
        }
        const nextFlags = [...cardState.flags, ...flags];
        return {
          ...cardState,
          flags: nextFlags,
        };
      });
      return {
        ...ctx,
        gameState: {
          ...ctx.gameState,
          cardState: nextCardStates,
        },
      };
    }
    case "ActionDeleteFlag": {
      const cards = getTargetType(ctx, blockPayload, targets, action.cards);
      if (cards.id != "カード") {
        throw new Error("must カード");
      }
      if (!Array.isArray(cards.value)) {
        throw new Error("執行Action時的所有target必須是陣列");
      }
      assertTargetTypeValueLength(cards);
      const cardIDs = cards.value;
      const flag = getTargetType(ctx, blockPayload, targets, action.flag);
      if (flag.id != "字串") {
        throw new Error("must 字串");
      }
      if (!Array.isArray(flag.value)) {
        throw new Error("執行Action時的所有target必須是陣列");
      }
      if (flag.value.length == 0) {
        log2(
          "doRequireTargetActionTarget",
          "將執行action，但對象為空陣列。直接回傳。"
        );
        return ctx;
      }
      const flags = flag.value;
      const nextCardStates = ctx.gameState.cardState.map((cardState) => {
        if (cardIDs.includes(cardState.id) == false) {
          return cardState;
        }
        const nextFlags = flags.reduce((flags, flag) => {
          return flags.filter((f) => f != flag);
        }, cardState.flags);
        return {
          ...cardState,
          flags: nextFlags,
        };
      });
      return {
        ...ctx,
        gameState: {
          ...ctx.gameState,
          cardState: nextCardStates,
        },
      };
    }
    case "ActionJsonfp": {
      const originJsonfpContext = ctx.varsPool[varCtxID]?.jsonfpContext || {};
      const jsonfpContext = { ...originJsonfpContext };
      let err: any = null;
      let result: any = null;
      jsonfp.apply(
        jsonfpContext,
        {
          ctx: { def: ctx },
          blockPayload: { def: blockPayload },
          require: { def: require },
          targets: { def: targets },
        },
        action.program,
        (e: any, ret: any) => {
          err = e;
          result = ret;
        }
      );
      if (err != null) {
        throw err;
      }
      log2("doRequireTargetActionTarget", "jsonfpResult", result);
      if (result.output == null) {
        throw new Error("必須回傳output:Action");
      }
      const willDoAction: Action = result.output;
      ctx = {
        ...ctx,
        varsPool: {
          ...ctx.varsPool,
          [varCtxID]: {
            ...ctx.varsPool[varCtxID],
            jsonfpContext: jsonfpContext,
          },
        },
      };
      return doRequireTargetActionTarget(
        ctx,
        blockPayload,
        targets,
        willDoAction,
        varCtxID
      );
    }
    case "ActionTriggerGameEvent": {
      ctx = triggerTextEvent(ctx, action.gameEvent);
      return ctx;
    }
    default:
      throw new Error(`not impl: ${action.id}`);
  }
  return ctx;
}
