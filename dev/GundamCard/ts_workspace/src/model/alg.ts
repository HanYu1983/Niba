import { Context, CardPosition, Action, Payment, Effect } from "./types";
import { Card } from "./table";

export function askPlayerG(ctx: Context, playerID: string): Card[] {
  return ctx.table.cardStack[
    cardPositionID({ playerID: playerID, where: "G" })
  ];
}

export function cardPositionID(position: CardPosition) {
  return JSON.stringify(position);
}

export function opponent(ctx: Context, playerID: string): string {
  return playerID;
}
