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

export function onCardEntered(ctx: Context, cardID: string): Context {
  return ctx;
}
