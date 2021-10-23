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

export function onEffect(ctx: Context, effect: ActionEffect): Context {
  switch (effect.action.id) {
    case "PlayCardAction":
    case "PlayCardAbilityAction":
      {
        if (effect.action.cardID == null) {
          return ctx;
        }
        const card = getCard(ctx.gameState.table, effect.action.cardID);
        if (card == null) {
          throw new Error(`card(${effect.action.cardID}) not found`);
        }
        const rowData = askRowData(card.protoID);
        const script = askCardScript(rowData.id);
        if (script.onEffect == null) {
          console.warn(`onEffect not found in script:${rowData.id}.ts`);
          return ctx;
        }
        console.log(`處理效果:${card.protoID}`);
        return script.onEffect(ctx, card, effect);
      }
      break;
    default:
      return ctx;
  }
}
