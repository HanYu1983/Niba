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
import { log } from "../../../tool/logger";
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
  log("doActionTarget", action.id);
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
        throw new Error("執行Action時的所有target必須最少有一個值");
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
        throw new Error("執行Action時的所有target必須最少有一個值");
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
            throw new Error("[doActionTarget][ActionRoll] already not tap");
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
    case "ActionConsumeG": {
      const cards = getTargetType(ctx, blockPayload, targets, action.cards);
      if (cards?.id != "カード") {
        throw new Error("must カード");
      }
      if (!Array.isArray(cards.value)) {
        throw new Error("執行Action時的所有target必須是陣列");
      }
      if (cards.value.length == 0) {
        throw new Error("執行Action時的所有target必須最少有一個值");
      }
      const color: CardColor | null = (() => {
        if (action.color == null) {
          return null;
        }
        const _color = getTargetType(ctx, blockPayload, targets, action.color);
        if (_color.id != "カードの色") {
          throw new Error("must カードの色");
        }
        if (!Array.isArray(_color.value)) {
          throw new Error("執行Action時的所有target必須是陣列");
        }
        if (_color.value.length == 0) {
          throw new Error("執行Action時的所有target必須最少有一個值");
        }
        return _color.value[0];
      })();
      const table = cards.value.reduce((table, cardID) => {
        if (cardID == null) {
          throw new Error("target must not null");
        }
        if (color != null) {
          const cardColor = getCardColor(ctx, cardID);
          if (color != cardColor) {
            throw new Error("[doActionTarget][ActionConsumeG] color not right");
          }
        }
        return mapCard(table, (card) => {
          if (card.id != cardID) {
            return card;
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
    case "ActionDrop": {
      const cards = getTargetType(ctx, blockPayload, targets, action.cards);
      if (cards?.id != "カード") {
        throw new Error("must カード");
      }
      if (!Array.isArray(cards.value)) {
        throw new Error("執行Action時的所有target必須是陣列");
      }
      if (cards.value.length == 0) {
        throw new Error("執行Action時的所有target必須最少有一個值");
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
      return ctx;
    }
    case "ActionMoveCardToPosition":
      const cards = getTargetType(ctx, blockPayload, targets, action.cards);
      if (cards?.id != "カード") {
        throw new Error("must カード");
      }
      log("doActionTarget", "ActionMoveCardToPosition");
      console.log(cards);
      if (!Array.isArray(cards.value)) {
        throw new Error("執行Action時的所有target必須是陣列");
      }
      if (cards.value.length == 0) {
        throw new Error("執行Action時的所有target必須最少有一個值");
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
      const { cardText, cardTextStateID } = action;
      const cards = getTargetType(ctx, blockPayload, targets, action.cards);
      if (cards.id != "カード") {
        throw new Error("must カード");
      }
      if (!Array.isArray(cards.value)) {
        throw new Error("執行Action時的所有target必須是陣列");
      }
      if (cards.value.length == 0) {
        throw new Error("執行Action時的所有target必須最少有一個值");
      }
      const cardID = cards.value[0];
      const id = cardTextStateID || `ActionAddGlobalCardText_${idSeq++}`;
      const cardState: CardState = {
        ...DEFAULT_CARD_STATE,
        id: id,
        cardID: cardID,
        cardTextStates: [
          {
            id: id,
            enabled: true,
            cardText: cardText,
          },
        ],
      };
      return {
        ...ctx,
        gameState: {
          ...ctx.gameState,
          globalCardState: [...ctx.gameState.globalCardState, cardState],
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
      const { cardText, cardTextStateID } = action;
      const cards = getTargetType(ctx, blockPayload, targets, action.cards);
      if (cards.id != "カード") {
        throw new Error("must カード");
      }
      if (!Array.isArray(cards.value)) {
        throw new Error("執行Action時的所有target必須是陣列");
      }
      if (cards.value.length == 0) {
        throw new Error("執行Action時的所有target必須最少有一個值");
      }
      const cardID = cards.value[0];
      let [nextCtx, _] = getCardState(ctx, cardID);
      const nextCardState = nextCtx.gameState.cardState.map(
        (cardState): CardState => {
          if (cardState.cardID != cardID) {
            return cardState;
          }
          const hasSameState =
            cardState.cardTextStates.find((s) => s.id == cardTextStateID) !=
            null;
          if (hasSameState) {
            return cardState;
          }
          return {
            ...cardState,
            cardTextStates: [
              ...cardState.cardTextStates,
              {
                id: cardTextStateID || `ActionAddCardText_${idSeq++}`,
                enabled: true,
                cardText: cardText,
              },
            ],
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
        throw new Error("執行Action時的所有target必須最少有一個值");
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
  }
  return ctx;
}
