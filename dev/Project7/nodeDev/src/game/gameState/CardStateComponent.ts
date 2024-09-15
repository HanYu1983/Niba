import { assoc, dissoc } from "ramda";
import { DestroyReason } from "../define/Effect";
import { Tip } from "../define/Tip";
import { AbsoluteBaSyou, AbsoluteBaSyouFn } from "../define/BaSyou";

export type CardState = {
  id: string;
  damage: number;
  destroyReason: DestroyReason | null;
  flags: { [key: string]: any };
  tips: { [key: string]: Tip }
};

const DEFAULT_CARD_STATE: CardState = {
  id: "",
  damage: 0,
  destroyReason: null,
  flags: {},
  tips: {},
};

export const CardStateFn = {
  setFlag(ctx: CardState, k: string, v: any): CardState {
    return {
      ...ctx,
      flags: assoc(k, v, ctx.flags)
    }
  },
  removeFlag(ctx: CardState, k: string): CardState {
    return {
      ...ctx,
      flags: dissoc(k, ctx.flags),
    }
  },
  getTip(ctx: CardState, k: string): Tip {
    if (ctx.tips[k] == null) {
      throw new Error(`cardId: ${ctx.id} target not set yet: ${k}`)
    }
    return ctx.tips[k]
  },
  damage(ctx: CardState, v: number): CardState {
    return {
      ...ctx,
      damage: ctx.damage + v
    }
  }
}

export type CardStateComponent = {
  cardStates: { [key: string]: CardState }
}

export function getCardState(ctx: CardStateComponent, cardID: string): CardState {
  return ctx.cardStates[cardID] || { ...DEFAULT_CARD_STATE, id: cardID };
}

export function setCardState(ctx: CardStateComponent, cardID: string, cardState: CardState): CardStateComponent {
  return { ...ctx, cardStates: assoc(cardID, cardState, ctx.cardStates) }
}

export function getCardStateValues(ctx: CardStateComponent): CardState[] {
  return Object.values(ctx.cardStates)
}

export function mapCardState(ctx: CardStateComponent, f: (key: AbsoluteBaSyou, cs: CardState) => CardState): CardStateComponent {
  const cardStates = Object.keys(ctx.cardStates).reduce((cardStates, key) => {
    return {
      ...cardStates,
      [key]: f(AbsoluteBaSyouFn.fromString(key), cardStates[key])
    }
  }, ctx.cardStates)
  return {
    ...ctx,
    cardStates
  }
}
