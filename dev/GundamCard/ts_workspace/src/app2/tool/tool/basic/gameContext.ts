import {
  Card,
  DEFAULT_TABLE,
  getCard,
  getCardPosition,
  mapCard,
  Table,
} from "../../../../tool/table";
import { getTargetType } from "../../alg/helper";
import {
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
  getOpponentPlayerID,
} from "./basic";
import { getBaShou, TIMING_CHART } from "./basic";
import { BlockPayload, Require, RequireAnd, RequireOr } from "./blockPayload";
import { getCardController } from "./handleCard";
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
  rollCost: (CardColor | null)[];
  texts: CardText[];
};

export const DEFAULT_CARD_PROTOTYPE: CardPrototype = {
  title: "",
  characteristic: [],
  color: "白",
  category: "ユニット",
  rollCost: [],
  texts: [],
};

export type CardState = {
  id: string;
  isChip: boolean;
  cardID: string;
  live: number;
  destroy: boolean;
  setGroupID: string;
  flags: string[];
  cardTextStates: CardTextState[];
  prototype: CardPrototype;
};

export const DEFAULT_CARD_STATE: CardState = {
  id: "",
  isChip: true,
  cardID: "",
  live: 0,
  destroy: false,
  setGroupID: "",
  flags: [],
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
  globalCardState: CardState[];
  activeEffectID: string | null;
  // 指令效果
  commandEffect: BlockPayload[];
  // 立即效果。玩家必須立即一個一個進行處理
  immediateEffect: BlockPayload[];
  // 堆疊效果。每次只處理第一個代表top的block
  stackEffect: BlockPayload[];
  //
  flowMemory: {
    hasTriggerEvent: boolean;
    hasPlayerPassPhase: { [key: string]: boolean };
    hasPlayerPassCut: { [key: string]: boolean };
  };
  chipPool: { [key: string]: CardPrototype };
};

export type Vars = {
  targets: { [key: string]: TargetType };
};

export type VarsPool = { [key: string]: Vars };

export type GameContext = {
  varsPool: VarsPool;
  gameState: GameState;
};

export const DEFAULT_GAME_CONTEXT: GameContext = {
  varsPool: {},
  gameState: {
    effects: [],
    globalCardState: [],
    table: DEFAULT_TABLE,
    cardState: [],
    timing: TIMING_CHART[0],
    playerState: [],
    activePlayerID: null,
    activeEffectID: null,
    commandEffect: [],
    immediateEffect: [],
    stackEffect: [],
    flowMemory: {
      hasTriggerEvent: false,
      hasPlayerPassPhase: {},
      hasPlayerPassCut: {},
    },
    chipPool: {},
  },
};

export function mapEffect(
  ctx: GameContext,
  doF: (effect: BlockPayload) => BlockPayload
): GameContext {
  return {
    ...ctx,
    gameState: {
      ...ctx.gameState,
      immediateEffect: ctx.gameState.immediateEffect.map(doF),
      commandEffect: ctx.gameState.commandEffect.map(doF),
      stackEffect: ctx.gameState.stackEffect.map(doF),
    },
  };
}

export function reduceEffect<T>(
  ctx: GameContext,
  doF: (init: T, effect: BlockPayload) => T,
  init: T
): T {
  return [
    ...ctx.gameState.immediateEffect,
    ...ctx.gameState.commandEffect,
    ...ctx.gameState.stackEffect,
  ].reduce(doF, init);
}

export function filterEffect(
  ctx: GameContext,
  filterF: (effect: BlockPayload) => boolean
): GameContext {
  return {
    ...ctx,
    gameState: {
      ...ctx.gameState,
      immediateEffect: ctx.gameState.immediateEffect.filter(filterF),
      commandEffect: ctx.gameState.commandEffect.filter(filterF),
      stackEffect: ctx.gameState.stackEffect.filter(filterF),
    },
  };
}

export type RequireScriptFunction = (
  gameCtx: GameContext,
  blockPayload: BlockPayload,
  varCtxID: string
) => GameContext;

export function getBlockOwner(
  ctx: GameContext,
  blockPayload: BlockPayload
): PlayerID {
  if (blockPayload.cause == null) {
    throw new Error("must has cause");
  }
  switch (blockPayload.cause.id) {
    // case "BlockPayloadCauseGameEvent":
    // case "BlockPayloadCauseUpdateEffect": {
    //   if (blockPayload.cause.cardID == null) {
    //     throw new Error("must has cardID");
    //   }
    //   const playerID = getCardController(ctx, blockPayload.cause.cardID);
    //   if (playerID == null) {
    //     throw new Error(`${playerID} not found`);
    //   }
    //   return playerID;
    // }
    case "BlockPayloadCauseGameEvent":
    case "BlockPayloadCauseUpdateEffect":
    case "BlockPayloadCauseUpdateCommand":
    case "BlockPayloadCauseGameRule":
      return blockPayload.cause.playerID;
  }
}

export function getRequireTargetOwner(
  ctx: GameContext,
  blockPayload: BlockPayload,
  require: Require,
  target: TargetType
): PlayerID {
  if (target.responsePlayer == null) {
    return getBlockOwner(ctx, blockPayload);
  }
  if (require.id != "RequireTarget") {
    return getBlockOwner(ctx, blockPayload);
  }
  const targetType = getTargetType(
    ctx,
    blockPayload,
    require.targets,
    target.responsePlayer
  );
  if (targetType.id != "プレーヤー") {
    throw new Error("must プレーヤー");
  }
  if (!Array.isArray(targetType.value)) {
    throw new Error("must real value");
  }
  return targetType.value[0];
}
