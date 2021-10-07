import { Table } from "../table";

export type Color = "緑" | "茶" | "青" | "白" | "紫" | "黒";

export type CardType =
  | "GRAPHIC"
  | "UNIT"
  | "CHARACTER"
  | "OPERATION"
  | "COMMAND";

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

export type GameState = {
  table: Table;
  paymentTable: PaymentTable;
  effectStack: EffectStack;
};

export type Animation = {
  id: number;
  description: string;
  gameState: GameState;
};

export type AnimationState = {
  productID: number;
  animations: Animation[];
  consumeID: { [key: string]: number };
};

export type PlayerState = {
  turn: number;
  playGCount: number;
};

export type Context = {
  gameState: GameState;
  animationState: AnimationState;
};

export type Condition = "手牌" | "特徴：装弾";

export type CardPosition = {
  playerID: string;
  where: "home" | "gravyard" | "ground" | "hand" | "G";
};
