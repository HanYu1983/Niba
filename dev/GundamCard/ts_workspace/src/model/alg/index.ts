import {
  Context,
  CardPosition,
  Action,
  Payment,
  ActionEffect,
  CardType,
  Color,
  GameState,
  CardState,
  Phase,
} from "../../tool/types";
import { Card, getCard, Table } from "../../tool/table";
import { askRowData } from "../../tool/data";
import { Script } from "../../script/types";
import { PlayerA, PlayerB } from "../../app/context";
import { askCardPower } from "./askCardPower";

export function askCardScript(cardRowDataID: string): Script {
  try {
    return require(`../../script/${cardRowDataID}.ts`);
  } catch (e) {
    console.error(`script/${cardRowDataID}.ts not found`);
  }
  return {};
}

export function askCardAction(ctx: Context, card: Card): Action[] {
  const rowData = askRowData(card.protoID);
  const script = askCardScript(rowData.id);
  if (script.askAction == null) {
    console.warn(`askAction not found:${rowData.id}.ts`);
    return [];
  }
  return script.askAction(ctx, card);
}

export function askCardPlayPayment(ctx: Context, card: Card): Payment[] {
  const rowData = askRowData(card.protoID);
  const script = askCardScript(rowData.id);
  if (script.askPlayPayment == null) {
    console.warn(`askPlayPayment not found:${rowData.id}.ts`);
    return [];
  }
  return script.askPlayPayment(ctx, card);
}

export function askCardState(ctx: Context, cardID: string): CardState | null {
  return ctx.gameState.cardState[cardID] || null;
}

export function askPlayerG(ctx: Context, playerID: string): Card[] {
  return (
    ctx.gameState.table.cardStack[
      cardPositionID({ playerID: playerID, where: "G" })
    ] || []
  );
}

export function cardPositionID(position: CardPosition) {
  return JSON.stringify(position);
}

export function opponent(ctx: Context, playerID: string): string {
  return playerID == PlayerA ? PlayerB : PlayerA;
}

export function onCardEntered(ctx: Context, cardID: string): Context {
  return ctx;
}

export function mapCardState(
  ctx: Context,
  cardIDs: string[],
  mapF: (s: CardState) => CardState
): Context {
  return {
    ...ctx,
    gameState: {
      ...ctx.gameState,
      cardState: cardIDs.reduce((cardState, cardID) => {
        const card = getCard(ctx.gameState.table, cardID);
        if (card == null) {
          throw new Error(`card not found: cardID:${cardID}`);
        }
        if (card.ownerID == null) {
          throw new Error(`card.ownerID not found: cardID:${cardID}`);
        }
        const [melee, range, live] = askCardPower(ctx, card);
        return {
          ...cardState,
          [cardID]: mapF(
            cardState[cardID] || {
              playerID: card.ownerID,
              live: live || 0,
            }
          ),
        };
      }, ctx.gameState.cardState),
    },
  };
}
