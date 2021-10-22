import {
  Context,
  CardPosition,
  Action,
  Payment,
  ActionEffect,
} from "../tool/types";
import { opponent, askPlayerG, cardPositionID } from "../model/alg/tool";
import { Card } from "../tool/table";

export type Script = {
  onEffectCompleted?: (
    ctx: Context,
    card: Card,
    effect: ActionEffect
  ) => Context;
  askAction?: (ctx: Context, card: Card) => Action[];
  askPlayPayment?: (ctx: Context, card: Card) => Payment[];
  askPower?: (
    ctx: Context,
    card: Card
  ) => [number | null, number | null, number | null];
};
