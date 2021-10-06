import { Table } from "./table";

export type Color = "blue" | "black" | "red";

export type ColorPayment = {
  id: "ColorPayment";
  color: Color;
  cardID: string | null;
};

export type TapPayment = {
  id: "TapPayment";
  cardID: string | null;
  condition: Condition[] | null;
};

export type GCountPayment = {
  id: "GCountPayment";
  gCount: number;
};

export type Target1Payment = {
  id: "Target1Payment";
  cardID: string | null;
  condition: Condition[] | null;
};

export type Payment = (
  | ColorPayment
  | TapPayment
  | GCountPayment
  | Target1Payment
) & {
  playerID: string;
};

export type PlayCardAction = {
  id: "PlayCardAction";
  cardID: string | null;
  position: CardPosition | null;
};

export type PlayCardAbilityAction = {
  id: "PlayCardAbilityAction";
  cardID: string | null;
  abilityID: string;
};

export type TapCardToGenG = {
  id: "TapCardToGenG";
  cardID: string | null;
  color: Color | null;
};

export type AddPaymentAction = {
  id: "AddPaymentAction";
  payment: Payment;
};

export type CancelPaymentAction = {
  id: "CancelPaymentAction";
};

export type ApplyPaymentAction = {
  id: "ApplyPaymentAction";
};

export type GiveUpCutAction = {
  id: "GiveUpCutAction";
};

export type EndStepAction = {
  id: "EndStepAction";
};

export type Action = (
  | PlayCardAction
  | PlayCardAbilityAction
  | TapCardToGenG
  | AddPaymentAction
  | CancelPaymentAction
  | ApplyPaymentAction
  | GiveUpCutAction
  | EndStepAction
) & { playerID: string };

export type PaymentTable = {
  action: Action | null;
  requires: Payment[];
  currents: Payment[];
  snapshot: Context | null;
  isLock: boolean;
};

export type Effect = {
  action: Action;
  currents: Payment[];
};

export type EffectStack = {
  effects: Effect[];
};

export type Context = {
  table: Table;
  paymentTable: PaymentTable;
  effectStack: EffectStack;
};

export type Condition = "手牌" | "特徴：装弾";

export type CardPosition = {
  playerID: string;
  where: "home" | "gravyard" | "ground" | "hand" | "G";
};
