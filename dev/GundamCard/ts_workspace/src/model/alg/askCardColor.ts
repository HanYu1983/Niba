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
import { PlayerA, PlayerB } from "../../tool/types";

export function askCardColor(ctx: Context, card: Card): Color {
  const rowData = askRowData(card.protoID);
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
    case "赤":
      return "赤";
    default:
      throw new Error(`card color not found: ${JSON.stringify(rowData)}`);
  }
}
