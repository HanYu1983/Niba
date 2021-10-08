import { Context, CardPosition, Action, Payment, Effect } from "../tool/types";
import { opponent, askPlayerG, cardPositionID } from "../model/alg";
import { Card } from "../tool/table";

export type Script = {
  onEffectCompleted?: (ctx: Context, card: Card, effect: Effect) => Context;
  askAction?: (ctx: Context, card: Card) => Action[];
  askPlayPayment?: (ctx: Context, card: Card) => Payment[];
};
