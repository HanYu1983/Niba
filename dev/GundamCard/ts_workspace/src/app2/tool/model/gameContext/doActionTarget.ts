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
  targets: (TargetType | null)[] | null,
  action: Action,
  varCtxID: string
): GameContext {
  switch (action.id) {
    case "ActionRoll": {
      if (targets == null) {
        throw new Error(`targets not found`);
      }
      const table = targets.reduce((table, target) => {
        if (target == null) {
          throw new Error("target must not null");
        }
        if (target.id != "カード") {
          throw new Error("target must be カード");
        }
        return mapCard(table, (card) => {
          if (card.id != target.id) {
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
