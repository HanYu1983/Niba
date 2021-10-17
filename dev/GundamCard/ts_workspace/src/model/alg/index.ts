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

function askCardScript(cardRowDataID: string): Script {
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

export function askCardPower(ctx: Context, card: Card): [number | null, number | null, number | null] {
  const rowData = askRowData(card.protoID);
  const script = askCardScript(rowData.id);
  if (script.askPower == null) {
    console.warn(`askPower not found:${rowData.id}.ts`);
    return [null, null, null];
  }
  return script.askPower(ctx, card);
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

export function onEffectCompleted(ctx: Context, effect: ActionEffect): Context {
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
        if (script.onEffectCompleted == null) {
          console.warn(
            `onEffectCompleted not found in script:${rowData.id}.ts`
          );
          return ctx;
        }
        return script.onEffectCompleted(ctx, card, effect);
      }
      break;
    default:
      return ctx;
  }
}

export function askNextPhase(ctx: Context, phase: Phase): Phase {
  const [main, sub] = phase;
  switch (sub) {
    case "before":
      // 設置階段沒有規定效果
      if (main == "set") {
        return ["draw", sub];
      }
      return [main, "effect"];
    case "after":
      switch (main) {
        case "draw":
          return ["set", "before"];
        case "set":
          return ["attack", "before"];
        case "attack":
          return ["guard", "before"];
        case "guard":
          return ["damage", "before"];
        case "damage":
          return ["return", "before"];
        case "return":
          return ["draw", "before"];
        default:
          throw new Error(`未知的狀態:${main}`);
      }
    case "effect":
      return [main, "after"];
    default:
      throw new Error(`未知的狀態:${phase}`);
  }
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
        const card = getCard(ctx.gameState.table, cardID)
        if (card == null) {
          throw new Error(`card not found: cardID:${cardID}`)
        }
        if (card.ownerID == null) {
          throw new Error(`card.ownerID not found: cardID:${cardID}`)
        }
        const [melee, range, live] = askCardPower(ctx, card)
        return {
          ...cardState,
          [cardID]: mapF(
            cardState[cardID] || {
              playerID: card.ownerID,
              live: live || 0
            }
          ),
        };
      }, ctx.gameState.cardState),
    },
  };
}