import {
  Card,
  DEFAULT_TABLE,
  getCard,
  getCardPosition,
  mapCard,
  Table,
} from "../../../../tool/table";
import type {
  GameEvent,
  CardText,
  Timing,
  TokuSyuKouKa,
  CardCategory,
  CardColor,
  AbsoluteBaSyou,
  PlayerID,
  BaSyou,
  RelatedBaSyou,
} from "./basic";
import { getBaShou, TIMING_CHART } from "./basic";
import { BlockPayload, Require, RequireAnd, RequireOr } from "./blockPayload";
import { TargetType } from "./targetType";

export type PlayerState = {
  id: string;
  turn: number;
  playGCount: number;
  confirmPhase: boolean;
};

export type CardTextState = {
  id: string;
  enabled: boolean;
  cardText: CardText;
};

export type CardPrototype = {
  title: string;
  characteristic: string[];
  color: CardColor;
  category: CardCategory;
  texts: CardText[];
};

export const DEFAULT_CARD_PROTOTYPE: CardPrototype = {
  title: "",
  characteristic: [],
  color: "白",
  category: "ユニット",
  texts: [],
};

export type CardState = {
  id: string;
  live: number;
  destroy: boolean;
  setGroupID: string;
  flags: { [key: string]: boolean };
  cardTextStates: CardTextState[];
  prototype: CardPrototype;
};

export const DEFAULT_CARD_STATE: CardState = {
  id: "",
  live: 0,
  destroy: false,
  setGroupID: "",
  flags: {},
  cardTextStates: [],
  prototype: DEFAULT_CARD_PROTOTYPE,
};

export type GameEffectCustom = {
  id: "GameEffectCustom";
  customID: any;
};

export type GameEffect = GameEffectCustom;

export type GameEffectState = {
  id: string;
  effect: GameEffect;
};

export type GameState = {
  table: Table;
  cardState: CardState[];
  timing: Timing;
  playerState: PlayerState[];
  activePlayerID: string | null;
  effects: GameEffectState[];
};

export type Vars = {
  targets: { [key: string]: TargetType };
};

export type VarsPool = { [key: string]: Vars };

export type GameContext = {
  varsPool: VarsPool;
  // 指令效果。從這裡取得玩家可用的指令
  commandEffect: BlockPayload[];
  // 立即效果。玩家必須立即一個一個進行處理
  immediateEffect: BlockPayload[];
  // 堆疊效果。每次只處理第一個代表top的block
  stackEffect: BlockPayload[];
  gameState: GameState;
};

export const DEFAULT_GAME_CONTEXT: GameContext = {
  varsPool: {},
  gameState: {
    effects: [],
    table: DEFAULT_TABLE,
    cardState: [],
    timing: TIMING_CHART[0],
    playerState: [],
    activePlayerID: null,
  },
  commandEffect: [],
  immediateEffect: [],
  stackEffect: [],
};

export function mapEffect(
  ctx: GameContext,
  doF: (effect: BlockPayload) => BlockPayload
): GameContext {
  return {
    ...ctx,
    immediateEffect: ctx.immediateEffect.map(doF),
    commandEffect: ctx.commandEffect.map(doF),
    stackEffect: ctx.stackEffect.map(doF),
  };
}

export function reduceEffect<T>(
  ctx: GameContext,
  doF: (init: T, effect: BlockPayload) => T,
  init: T
): T {
  return [
    ...ctx.immediateEffect,
    ...ctx.commandEffect,
    ...ctx.stackEffect,
  ].reduce(doF, init);
}

export type RequireScriptFunction = (
  gameCtx: GameContext,
  blockPayload: BlockPayload,
  varCtxID: string
) => GameContext;
