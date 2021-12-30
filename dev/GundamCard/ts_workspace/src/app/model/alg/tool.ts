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
} from "../../types";
import { Card, getCard, Table } from "../../../tool/table";
import { askRowData } from "../../../tool/data";
import { Script } from "../../script/types";
import { PlayerA, PlayerB } from "../../types";

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

export function askCardPlayAbilityPayment(
  ctx: Context,
  card: Card,
  abilityID: string
): Payment[] {
  const rowData = askRowData(card.protoID);
  const script = askCardScript(rowData.id);
  if (script.askPlayAbilityPayment == null) {
    console.warn(`askPlayAbilityPayment not found:${rowData.id}.ts`);
    return [];
  }
  return script.askPlayAbilityPayment(ctx, card, abilityID);
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

export function cardPosition(positionID: string): CardPosition {
  return JSON.parse(positionID);
}

export function opponent(ctx: Context, playerID: string): string {
  return playerID == PlayerA ? PlayerB : PlayerA;
}

export function askCardPosition(ctx: Context, cardID: string): CardPosition {
  const find = Object.entries(ctx.gameState.table.cardStack)
    .filter(([key, cards]) => {
      return (cards || []).filter((card) => card.id == cardID).length > 0;
    })
    .map(([key, cards]) => key);
  if (find.length == 0) {
    throw new Error(`找不到卡的位置:${cardID}`);
  }
  try {
    const pos = JSON.parse(find[0]) as CardPosition;
    return pos;
  } catch (e) {
    throw new Error(`未知的位置: ${find[0]}`);
  }
}
