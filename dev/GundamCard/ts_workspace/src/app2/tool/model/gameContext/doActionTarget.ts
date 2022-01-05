import { TargetType, getBaShouID } from "../basic";
import { BlockPayload } from "../blockPayload";
import { Block } from "../scriptContext/blockContext";
import { Action } from "../blockPayload/action";
import { getTopCards, mapCard, moveCard } from "../../../../tool/table";
import { GameContext } from "./gameContext";

export function doActionTarget(
  gameCtx: GameContext,
  block: Block,
  blockPayload: BlockPayload,
  targets: { [key: string]: TargetType },
  action: Action,
  varCtxID: string
): GameContext {
  switch (action.id) {
    case "ActionRoll": {
      const cards = (() => {
        if (typeof action.cards == "string") {
          return targets[action.cards];
        }
        return action.cards;
      })();
      if (cards?.id != "カード" && cards?.id != "このカード") {
        throw new Error("must カード");
      }
      const cardID: (string | null)[] = (() => {
        switch (cards.id) {
          case "カード":
            return cards.cardID;
          case "このカード":
            if (blockPayload.cause?.cardID == null) {
              throw new Error("blockPayload.cause?.cardID not found");
            }
            return [blockPayload.cause?.cardID || ""];
        }
      })();
      const table = cardID.reduce((table, cardID) => {
        if (cardID == null) {
          throw new Error("target must not null");
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
      }, gameCtx.gameState.table);
      return {
        ...gameCtx,
        gameState: {
          ...gameCtx.gameState,
          table: table,
        },
      };
    }
    case "ActionConsumeG": {
      const cards = (() => {
        if (typeof action.cards == "string") {
          return targets[action.cards];
        }
        return action.cards;
      })();
      if (cards?.id != "カード") {
        throw new Error("must カード");
      }
      const color = (() => {
        if (typeof action.color == "string") {
          return targets[action.color || ""] || null;
        }
        return action.color || null;
      })();
      if (color?.id != "カードの色") {
        throw new Error("must カードの色");
      }
      const table = cards.cardID.reduce((table, cardID) => {
        if (cardID == null) {
          throw new Error("target must not null");
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
      }, gameCtx.gameState.table);
      return {
        ...gameCtx,
        gameState: {
          ...gameCtx.gameState,
          table: table,
        },
      };
    }
    case "ActionDraw": {
      const playerID = blockPayload.cause?.playerID;
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
        gameCtx.gameState.table,
        fromBaSyouID,
        drawCount
      );
      const table = topCards.reduce((table, card) => {
        return moveCard(table, fromBaSyouID, toBaSyouID, card.id, null);
      }, gameCtx.gameState.table);
      return {
        ...gameCtx,
        gameState: {
          ...gameCtx.gameState,
          table: table,
        },
      };
    }
    case "ActionDrop": {
    }
  }
  return gameCtx;
}
