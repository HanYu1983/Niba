import { CardStack, Table } from "../table";

export const PlayerA = "PlayerA";
export const PlayerB = "PlayerB";

export type Color = "緑" | "茶" | "青" | "白" | "紫" | "黒" | "赤";

export type CardType =
  | "GRAPHIC"
  | "UNIT"
  | "CHARACTER"
  | "OPERATION"
  | "COMMAND";

type BasePayment = {
  playerID: string;
};

export type ColorPayment = {
  id: "ColorPayment";
  color: Color;
  cardID: string | null;
  tipCardID: string[];
} & BasePayment;

export type TapPayment = {
  id: "TapPayment";
  cardID: string | null;
  tipCardID: string[];
} & BasePayment;

export type GCountPayment = {
  id: "GCountPayment";
  gCount: number;
  tipCardID: string[];
} & BasePayment;

export type Target1Payment = {
  id: "Target1Payment";
  cardID: string | null;
  tipCardID: string[];
} & BasePayment;

export type Payment =
  | ColorPayment
  | TapPayment
  | GCountPayment
  | Target1Payment;

type BaseAction = {
  playerID: string;
};

export type PlayCardAction = {
  id: "PlayCardAction";
  cardID: string | null;
  from: CardPosition | null;
  to: CardPosition | null;
} & BaseAction;

export type PlayCardAbilityAction = {
  id: "PlayCardAbilityAction";
  cardID: string | null;
  abilityID: string;
} & BaseAction;

export type TapCardToGenG = {
  id: "TapCardToGenG";
  cardID: string | null;
  color: Color | null;
} & BaseAction;

export type AddPaymentAction = {
  id: "AddPaymentAction";
  payment: Payment;
} & BaseAction;

export type CancelPaymentAction = {
  id: "CancelPaymentAction";
} & BaseAction;

export type ApplyPaymentAction = {
  id: "ApplyPaymentAction";
} & BaseAction;

export type ConfirmPhaseAction = {
  id: "ConfirmPhaseAction";
} & BaseAction;

export type CancelConfirmPhaseAction = {
  id: "CancelConfirmPhaseAction";
} & BaseAction;

export type EndStepAction = {
  id: "EndStepAction";
} & BaseAction;

export type AttackAction = {
  id: "AttackAction";
  cardID: string | null;
  from: CardPosition | null;
  to: CardPosition | null;
  beforeCardID: string | null;
} & BaseAction;

export type GuardAction = {
  id: "GuardAction";
  cardID: string | null;
  from: CardPosition | null;
  to: CardPosition | null;
  beforeCardID: string | null;
} & BaseAction;

export type AddDestroyEffectAction = {
  id: "AddDestroyEffectAction";
  cardID: string;
} & BaseAction;

export type SystemHandleEffectAction = {
  id: "SystemHandleEffectAction";
} & BaseAction;

export type SystemHandlePhaseEffectAction = {
  id: "SystemHandlePhaseEffectAction";
} & BaseAction;

export type SystemAddDestroyEffectAction = {
  id: "SystemAddDestroyEffectAction";
} & BaseAction;

export type SystemNextStepAction = {
  id: "SystemNextStepAction";
} & BaseAction;

export type Action =
  | PlayCardAction
  | PlayCardAbilityAction
  | TapCardToGenG
  | AddPaymentAction
  | CancelPaymentAction
  | ApplyPaymentAction
  | ConfirmPhaseAction
  | CancelConfirmPhaseAction
  | EndStepAction
  | AttackAction
  | GuardAction
  | AddDestroyEffectAction
  | SystemHandleEffectAction
  | SystemHandlePhaseEffectAction
  | SystemAddDestroyEffectAction
  | SystemNextStepAction;

export type PaymentTable = {
  action: Action | null;
  requires: Payment[];
  currents: Payment[];
  snapshot: Context | null;
  isLock: boolean;
};

export type ActionEffect = {
  id: "ActionEffect";
  action: Action;
  currents: Payment[];
};

export type DestroyEffect = {
  id: "DestroyEffect";
  cardID: string;
  reason: string;
};

export type Effect = ActionEffect | DestroyEffect;

export type EffectStack = {
  effects: Effect[];
};

export type CardState = {
  playerID: string;
  live: number;
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
  cardState: { [key: string]: CardState | undefined };
  phase: Phase;
  playerState: { [key: string]: PlayerState | undefined };
  activePlayerID: string | null;
  destroyEffect: DestroyEffect[];
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

export type CardBattleWhere = "universe" | "earth";

export type CardWhere =
  | "home"
  | "gravyard"
  | "ground"
  | "hand"
  | "G"
  | CardBattleWhere;

export type CardPosition = {
  playerID: string;
  where: CardWhere;
};

export type AttackSpeed = 1 | 2 | 3;

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
    destroyEffect: [],
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

export function isEveryConfirmPhase(ctx: Context, players: string[]): boolean {
  return players
    .map((playerID) => !!ctx.gameState.playerState[playerID]?.confirmPhase)
    .reduce((acc, c) => acc && c, true);
}
