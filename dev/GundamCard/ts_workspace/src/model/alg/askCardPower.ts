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
import { askCardScript } from "./tool";
import { PlayerA, PlayerB } from "../../tool/types";

export function askCardPower(
  ctx: Context,
  card: Card
): [number | null, number | null, number | null] {
  const rowData = askRowData(card.protoID);
  const script = askCardScript(rowData.id);
  if (script.askPower == null) {
    console.warn(`askPower not found:${rowData.id}.ts`);
    return [null, null, null];
  }
  return script.askPower(ctx, card);
}
