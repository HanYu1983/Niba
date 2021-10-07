import {
  Context,
  CardPosition,
  Action,
  Payment,
  Effect,
  CardType,
  Color,
} from "../../tool/types";
import { Card } from "../../tool/table";
import { askRowData } from "../../tool/data";

export function askCardType(imgID: string): CardType {
  const rowData = askRowData(imgID);
  switch (rowData.info_3) {
    case "UNIT":
      return "UNIT";
    case "CHARACTER":
      return "CHARACTER";
    case "GRAPHIC":
      return "GRAPHIC";
    case "COMMAND":
      return "COMMAND";
    case "OPERATION":
      return "OPERATION";
    default:
      throw new Error(`card type not found: ${rowData}`);
  }
}

export function askCardColor(imgID: string): Color {
  const rowData = askRowData(imgID);
  switch (rowData.info_18) {
    case "白":
      return "白";
    case "緑":
      return "緑";
    case "茶":
      return "茶";
    case "青":
      return "青";
    case "紫":
      return "紫";
    case "黒":
      return "黒";
    default:
      throw new Error(`card type not found: ${rowData}`);
  }
}

export function askPlayerG(ctx: Context, playerID: string): Card[] {
  return ctx.gameState.table.cardStack[
    cardPositionID({ playerID: playerID, where: "G" })
  ];
}

export function cardPositionID(position: CardPosition) {
  return JSON.stringify(position);
}

export function opponent(ctx: Context, playerID: string): string {
  return playerID;
}

export function onCardEntered(ctx: Context, cardID: string): Context {
  return ctx;
}

export function onEffectCompleted(ctx: Context, effect: Effect): Context {
  if (effect.action.id != "PlayCardAction") {
    return ctx;
  }
  const cardScript = require(`../../script/102425.ts`);
  if (cardScript.onEffectCompleted == null) {
    throw new Error(
      `onEffectCompleted not found in script:${effect.action.cardID}`
    );
  }
  return cardScript.onEffectCompleted(ctx, effect);
}
