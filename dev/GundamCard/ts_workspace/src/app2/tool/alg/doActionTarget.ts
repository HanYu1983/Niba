import { getBaShouID, CardColor, getNextTiming } from "../tool/basic/basic";
import { BlockPayload, wrapRequireKey } from "../tool/basic/blockPayload";
import { Action } from "../tool/basic/action";
import {
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
} from "../tool/basic/gameContext";
import {
  getCardBaSyou,
  getCardColor,
  getCardController,
  getCardOwner,
  getAbsoluteBaSyou,
} from "../tool/basic/handleCard";
import { log2 } from "../../../tool/logger";
import { TargetType } from "../tool/basic/targetType";
import { getCardState, getTargetType } from "./helper";
import { initState } from "./handleGameContext";

let idSeq = 0;
export function doActionTarget(
  ctx: GameContext,
  blockPayload: BlockPayload,
  targets: { [key: string]: TargetType },
  action: Action,
  varCtxID: string
): GameContext {
  log2("doActionTarget", "action", action);
  switch (action.id) {
    case "ActionRoll": {
      const cards = getTargetType(ctx, blockPayload, targets, action.cards);
      if (cards?.id != "カード") {
        throw new Error("must カード");
      }
      if (!Array.isArray(cards.value)) {
        throw new Error("執行Action時的所有target必須是陣列");
      }
      if (cards.value.length == 0) {
        //throw new Error("執行Action時的所有target必須最少有一個值");
        log2("doActionTarget", "將執行action，但對象為空陣列。直接回傳。");
        return ctx;
      }
      const table = cards.value.reduce((table, cardID) => {
        if (cardID == null) {
          throw new Error("target must not null");
        }
        return mapCard(table, (card) => {
          if (card.id != cardID) {
            return card;
          }
          if (card.tap == true) {
            throw new Error("[doActionTarget][ActionRoll] already tap");
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
      if (cards.value.length == 0) {
        //throw new Error("執行Action時的所有target必須最少有一個值");
        log2("doActionTarget", "將執行action，但對象為空陣列。直接回傳。");
        return ctx;
      }
      const table = cards.value.reduce((table, cardID) => {
        if (cardID == null) {
          throw new Error("target must not null");
        }
        return mapCard(table, (card) => {
          if (card.id != cardID) {
            return card;
          }
          if (card.tap == false) {
            throw new Error(
              "[doActionTarget][ActionRoll] 已經是直立狀態, 不能直立"
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
      if (cards.value.length == 0) {
        //throw new Error("執行Action時的所有target必須最少有一個值");
        log2("doActionTarget", "將執行action，但對象為空陣列。直接回傳。");
        return ctx;
      }
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
        log2("doActionTarget", "將執行action，但對象為空陣列。直接回傳。");
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
      if (cards.value.length == 0) {
        //throw new Error("執行Action時的所有target必須最少有一個值");
        log2("doActionTarget", "將執行action，但對象為空陣列。直接回傳。");
        return ctx;
      }
      ctx = cards.value.reduce((ctx, cardID) => {
        if (cardID == null) {
          throw new Error("[doActionTarget][ActionDrop]target must not null");
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
      if (cards.value.length == 0) {
        //throw new Error("執行Action時的所有target必須最少有一個值");
        log2("doActionTarget", "將執行action，但對象為空陣列。直接回傳。");
        return ctx;
      }
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
      ctx = cards.value.reduce((ctx, cardID) => {
        if (cardID == null) {
          throw new Error(
            "[doActionTarget][ActionMoveCardToPosition] cardID not found"
          );
        }
        const fromBaSyouID = getBaShouID(getCardBaSyou(ctx, cardID));
        const toBaSyouID = getBaShouID(getAbsoluteBaSyou(baSyou, ctx, cardID));
        const nextTable = moveCard(
          ctx.gameState.table,
          fromBaSyouID,
          toBaSyouID,
          cardID,
          null
        );
        return {
          ...ctx,
          gameState: {
            ...ctx.gameState,
            table: nextTable,
          },
        };
      }, ctx);
      return ctx;
    case "ActionAddBlock": {
      const blockUuid = `ActionAddBlock_${new Date().getTime()}_${idSeq++}`;
      switch (action.type) {
        case "堆疊": {
          const wrappedBlock: BlockPayload = {
            ...action.block,
            id: blockUuid,
            contextID: blockPayload.contextID,
            cause: blockPayload.cause,
            ...(action.block.require
              ? { require: wrapRequireKey(action.block.require) }
              : null),
          };
          return {
            ...ctx,
            gameState: {
              ...ctx.gameState,
              stackEffect: [wrappedBlock, ...ctx.gameState.stackEffect],
            },
          };
        }
        case "立即": {
          const wrappedBlock: BlockPayload = {
            ...action.block,
            id: blockUuid,
            contextID: blockPayload.contextID,
            cause: blockPayload.cause,
            ...(action.block.require
              ? { require: wrapRequireKey(action.block.require) }
              : null),
          };
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
      if (cards.value.length == 0) {
        //throw new Error("執行Action時的所有target必須最少有一個值");
        log2("doActionTarget", "將執行action，但對象為空陣列。直接回傳。");
        return ctx;
      }
      const cardStateAfterSignID = cards.value.map((cardID): CardState => {
        // 修改它的ID，變成一張卡吃能新增同樣的內文一次
        return {
          ...cardState,
          id: `${cardID}_${cardState.id}`,
          cardID: cardID,
          cardTextStates: cardState.cardTextStates.map((cts, i) => {
            return {
              ...cts,
              id: `${cardID}_${cardState.id}_${cts.id}_${i}`,
            };
          }),
        };
      });
      const cardStateWillAdd = cardStateAfterSignID.filter((t) => {
        return cardState.cardTextStates.find((v) => v.id != t.id) == null;
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
          globalCardState: ctx.gameState.globalCardState.filter(
            (v) => v.id != cardTextStateID
          ),
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
      if (cards.value.length == 0) {
        //throw new Error("執行Action時的所有target必須最少有一個值");
        log2("doActionTarget", "將執行action，但對象為空陣列。直接回傳。");
        return ctx;
      }
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
        log2("doActionTarget", "將執行action，但對象為空陣列。直接回傳。");
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
          return cardState.cardTextStates.find((v) => v.id != t.id) == null;
        });
        if (cardTextStateWillAdd.length == 0) {
          return ctx;
        }
        const nextCardState = nextCtx.gameState.cardState.map(
          (cardState): CardState => {
            if (cardState.cardID != cardID) {
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
      if (cards.value.length == 0) {
        //throw new Error("執行Action時的所有target必須最少有一個值");
        log2("doActionTarget", "將執行action，但對象為空陣列。直接回傳。");
        return ctx;
      }
      const cardID = cards.value[0];
      if (cardID == null) {
        throw new Error("card ID not found");
      }
      let [nextCtx, _] = getCardState(ctx, cardID);
      const nextCardState = nextCtx.gameState.cardState.map(
        (cardState): CardState => {
          if (cardState.cardID != cardID) {
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
      if (cardA.value.length == 0) {
        log2("doActionTarget", "將執行action，但對象為空陣列。直接回傳。");
        return ctx;
      }
      const cardB = getTargetType(ctx, blockPayload, targets, action.cardB);
      if (cardB.id != "カード") {
        throw new Error("must カード");
      }
      if (!Array.isArray(cardB.value)) {
        throw new Error("執行Action時的所有target必須是陣列");
      }
      if (cardB.value.length == 0) {
        log2("doActionTarget", "將執行action，但對象為空陣列。直接回傳。");
        return ctx;
      }
      const cardAValue = cardA.value[0];
      const cardBValue = cardB.value[0];
      {
        // 移動cardA到cardB的位置
        // TODO: 修改setGroup
        const cardID = cardBValue;
        const fromBaSyouID = getBaShouID(getCardBaSyou(ctx, cardID));
        const toBaSyouID = getBaShouID(getCardBaSyou(ctx, cardAValue));
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
      }
      {
        // 廢棄cardA
        const cardID = cardAValue;
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
      }
      return ctx;
    }
    default:
      throw new Error(`not impl: ${action.id}`);
  }
  return ctx;
}
