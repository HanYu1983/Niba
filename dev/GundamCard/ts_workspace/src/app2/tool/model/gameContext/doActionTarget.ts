import {
  TargetType,
  getBaShouID,
  CardColor,
  PlayerID,
  getBaShou,
  BaSyou,
  AbsoluteBaSyou,
} from "../../tool/basic/basic";
import { BlockPayload } from "../../tool/basic/blockPayload";
import { Action } from "../../tool/basic/action";
import {
  getCard,
  getCardPosition,
  getTopCards,
  mapCard,
  moveCard,
} from "../../../../tool/table";
import { GameContext } from "../../tool/basic/gameContext";
import { wrapRequireKey } from "../../tool/basic/gameContext";
import {
  getCardBaSyou,
  getCardColor,
  getCardController,
  getCardOwner,
  getTargetType,
} from "../../tool/basic/gameContext";
import { log } from "../../../../tool/logger";

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
        // case "指令": {
        //   const wrappedBlock: BlockPayload = {
        //     ...action.block,
        //     id: blockUuid,
        //     contextID: blockPayload.contextID,
        //     cause: blockPayload.cause,
        //   };
        //   return {
        //     ...ctx,
        //     commandEffect: [wrappedBlock, ...ctx.commandEffect],
        //   };
        // }
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
      return ctx;
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
  }
  return ctx;
}
