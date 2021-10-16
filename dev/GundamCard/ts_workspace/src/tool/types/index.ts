import { CardStack, Table } from "../table";

export type Color = "緑" | "茶" | "青" | "白" | "紫" | "黒" | "赤";

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
  tipCardID: string[];
};

export type TapPayment = {
  id: "TapPayment";
  cardID: string | null;
  tipCardID: string[];
};

export type GCountPayment = {
  id: "GCountPayment";
  gCount: number;
  tipCardID: string[];
};

export type Target1Payment = {
  id: "Target1Payment";
  cardID: string | null;
  tipCardID: string[];
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
  from: CardPosition | null;
  to: CardPosition | null;
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

export type ConfirmPhaseAction = {
  id: "ConfirmPhaseAction";
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
  | ConfirmPhaseAction
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

export type CardState = {
  playerID: string;
};

export type PhaseMain =
  | "draw"
  | "set"
  | "attack"
  | "guard"
  | "damage"
  | "return";

export type PhaseSub = "before" | "effect" | "after";

export type Phase = [PhaseMain, PhaseSub];

export type PlayerState = {
  turn: number;
  playGCount: number;
  confirmPhase: boolean;
};

export type GameState = {
  table: Table;
  paymentTable: PaymentTable;
  effectStack: EffectStack;
  cardState: { [key: string]: CardState };
  phase: Phase;
  playerState: { [key: string]: PlayerState | undefined };
  activePlayerID: string | null;
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

export type Context = {
  gameState: GameState;
  animationState: AnimationState;
};

export type CardPosition = {
  playerID: string;
  where: "home" | "gravyard" | "ground" | "hand" | "G";
};

export const defaultContext: Context = {
  gameState: {
    table: {
      cardStack: {},
      tokens: [],
    },
    paymentTable: {
      action: null,
      requires: [],
      currents: [],
      snapshot: null,
      isLock: false,
    },
    effectStack: {
      effects: [],
    },
    cardState: {},
    phase: ["draw", "before"],
    playerState: {},
    activePlayerID: null,
  },
  animationState: {
    productID: 0,
    animations: [],
    consumeID: {},
  },
};

export function mapPlayerState(
  ctx: Context,
  players: string[],
  mapF: (s: PlayerState) => PlayerState
): Context {
  return {
    ...ctx,
    gameState: {
      ...ctx.gameState,
      playerState: players.reduce((playerState, playerID) => {
        return {
          ...playerState,
          [playerID]: mapF(
            playerState[playerID] || {
              turn: 0,
              playGCount: 0,
              confirmPhase: false,
            }
          ),
        };
      }, ctx.gameState.playerState),
    },
  };
}

export function isEveryConfirmPhase(ctx: Context, players: string[]):boolean {
  return players
    .map((playerID) => !!ctx.gameState.playerState[playerID]?.confirmPhase)
    .reduce((acc, c) => acc && c, true);
}
