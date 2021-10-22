import { Context, CardType } from "../../tool/types";
import { Card, getCard, Table } from "../../tool/table";
import { askRowData } from "../../tool/data";

export function askCardType(ctx: Context, card: Card): CardType {
  const rowData = askRowData(card.protoID);
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
