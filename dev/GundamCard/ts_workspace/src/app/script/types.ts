import {
  Context,
  CardPosition,
  Action,
  Payment,
  ActionEffect,
  Effect,
} from "../types";
import { opponent, askPlayerG, cardPositionID } from "../model/alg/tool";
import { Card } from "../../tool/table";

export type Script = {
  onEffect?: (ctx: Context, card: Card, effect: ActionEffect) => Context;
  onEffectCompleted?: (
    ctx: Context,
    card: Card,
    effect: ActionEffect
  ) => Context;
  askAction?: (ctx: Context, card: Card) => Action[];
  askPlayPayment?: (ctx: Context, card: Card) => Payment[];
  askPlayAbilityPayment?: (
    ctx: Context,
    card: Card,
    abilityID: string
  ) => Payment[];
  askPower?: (
    ctx: Context,
    card: Card
  ) => [number | null, number | null, number | null];
};
