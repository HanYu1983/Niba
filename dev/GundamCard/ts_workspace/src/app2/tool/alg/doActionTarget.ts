import { getBaShouID, CardColor } from "../tool/basic/basic";
import { BlockPayload, wrapRequireKey } from "../tool/basic/blockPayload";
import { Action } from "../tool/basic/action";
import {
  CardStack,
  getCard,
  getCardPosition,
  getTopCards,
  mapCard,
  moveCard,
} from "../../../tool/table";
import {
  CardState,
  CardTextState,
  GameContext,
} from "../tool/basic/gameContext";
import {
  getCardBaSyou,
  getCardColor,
  getCardController,
  getCardOwner,
  getAbsoluteBaSyou,
} from "../tool/basic/handleCard";
import { log } from "../../../tool/logger";
import { TargetType, getTargetType } from "../tool/basic/targetType";
import { getCardState } from "./helper";

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
      const table = cards.cardID.reduce((table, cardID) => {
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
      const table = cards.cardID.reduce((table, cardID) => {
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
      const color: CardColor | null = (() => {
        if (action.color == null) {
          return null;
        }
        const _color = getTargetType(ctx, blockPayload, targets, action.color);
        if (_color.id != "カードの色") {
          throw new Error("must カードの色");
        }
        return _color.color;
      })();
      const table = cards.cardID.reduce((table, cardID) => {
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
      ctx = cards.cardID.reduce((ctx, cardID) => {
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
      if (blockPayload.cause?.cardID == null) {
        throw new Error("[doActionTarget][ActionDraw] cardID not found");
      }
      const playerID = getCardController(ctx, blockPayload.cause.cardID);
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
      const baSyou = getTargetType(ctx, blockPayload, targets, action.baSyou);
      if (baSyou?.id != "場所") {
        throw new Error("must 場所");
      }
      ctx = cards.cardID.reduce((ctx, cardID) => {
        if (baSyou.baSyou == null) {
          throw new Error("baSyou not found");
        }
        if (cardID == null) {
          throw new Error(
            "[doActionTarget][ActionMoveCardToPosition] cardID not found"
          );
        }
        const fromBaSyouID = getBaShouID(getCardBaSyou(ctx, cardID));
        const toBaSyouID = getBaShouID(
          getAbsoluteBaSyou(baSyou.baSyou, ctx, cardID)
        );
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
            stackEffect: [wrappedBlock, ...ctx.stackEffect],
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
            immediateEffect: [wrappedBlock, ...ctx.immediateEffect],
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
    case "ActionAddCardText": {
      const { cardText, cardTextStateID } = action;
      const cards = getTargetType(ctx, blockPayload, targets, action.cards);
      if (cards.id != "カード") {
        throw new Error("must カード");
      }
      if (cards.cardID.length) {
        const cardID = cards.cardID[0];
        if (cardID == null) {
          throw new Error("card ID not found");
        }
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
      }
    }
    case "ActionDeleteCardText": {
      const { cardTextStateID } = action;
      const cards = getTargetType(ctx, blockPayload, targets, action.cards);
      if (cards.id != "カード") {
        throw new Error("must カード");
      }
      if (cards.cardID.length) {
        const cardID = cards.cardID[0];
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
      }
    }
  }
  return ctx;
}
