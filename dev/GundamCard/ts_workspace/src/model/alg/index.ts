import {
  Context,
  CardPosition,
  Action,
  Payment,
  Effect,
} from "../../tool/types";
import { Card } from "../../tool/table";

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
