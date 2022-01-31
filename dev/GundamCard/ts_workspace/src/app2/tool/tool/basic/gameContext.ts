import {
  Card,
  DEFAULT_TABLE,
  getCard,
  getCardPosition,
  mapCard,
  Table,
} from "../../../../tool/table";
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
  BattleBonus,
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
  battlePoint: BattleBonus;
  texts: CardText[];
};

export const DEFAULT_CARD_PROTOTYPE: CardPrototype = {
  title: "",
  characteristic: [],
  color: "白",
  category: "ユニット",
  rollCost: [],
  battlePoint: [0, 0, 0],
  texts: [],
};

export type CardState = {
  id: string; // card.id
  isChip: boolean;
  damage: number;
  destroyReason: DestroyReason | null;
  //setGroupID: string;
  flags: string[];
  cardTextStates: CardTextState[];
  //prototype: CardPrototype;
};

export const DEFAULT_CARD_STATE: CardState = {
  id: "",
  isChip: true,
  damage: 0,
  destroyReason: null,
  //setGroupID: "",
  flags: [],
  cardTextStates: [],
  // prototype: DEFAULT_CARD_PROTOTYPE,
};

export type GlobalCardState = {
  id: string;
  cardID: string;
  cardTextStates: CardTextState[];
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

export type Message = {
  id: "MessageCustom";
  value: string;
};

export type DestroyReason1 = {
  id: "通常ダメージ" | "戦闘ダメージ" | "破壊する" | "マイナスの戦闘修正";
  // 誰造成的
  playerID: string;
};

export type DestroyReason = DestroyReason1;

export type GameState = {
  table: Table;
  cardState: CardState[];
  timing: Timing;
  playerState: PlayerState[];
  activePlayerID: string | null;
  effects: GameEffectState[];
  globalCardState: GlobalCardState[];
  activeEffectID: string | null;
  // 指令效果
  commandEffect: BlockPayload[];
  // 立即效果。玩家必須立即一個一個進行處理
  immediateEffect: BlockPayload[];
  // 堆疊效果。每次只處理第一個代表top的block
  stackEffect: BlockPayload[];
  // 記錄上一次的堆疊。每次解決一個堆疊效果，就將那效果移到這裡
  // 在發送切入解決時，清空。
  stackEffectMemory: BlockPayload[];
  // 專門給破壞效果用的用的堆疊
  // 傷害判定結束時，將所有破壞產生的廢棄效果丟到這，重設「決定解決順序」的旗標為真
  // 如果這個堆疊一有值時並「決定解決順序」為真時，就立刻讓主動玩家決定解決順序，決定完後，將旗標設為假
  // 旗標為假時，才能才能開放給玩家切入
  // 這個堆疊解決完後，才回復到本來的堆疊的解決程序
  destroyEffect: BlockPayload[];
  // setGroup
  setGroupLink: { [key: string]: string };
  //
  flowMemory: {
    hasTriggerEvent: boolean;
    hasPlayerPassPhase: { [key: string]: boolean };
    hasPlayerPassCut: { [key: string]: boolean };
    hasPlayerPassPayCost: { [key: string]: boolean };
    shouldTriggerStackEffectFinishedEvent: boolean;
    msgs: Message[];
  };
  chipPool: { [key: string]: CardPrototype };
};

export type Vars = {
  targets: { [key: string]: TargetType };
  jsonfpContext: any;
};

export type VarsPool = { [key: string]: Vars };

export type GameContext = {
  varsPool: VarsPool;
  gameState: GameState;
  versionID: number;
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
    stackEffectMemory: [],
    destroyEffect: [],
    setGroupLink: {},
    flowMemory: {
      hasTriggerEvent: false,
      hasPlayerPassPhase: {},
      hasPlayerPassCut: {},
      hasPlayerPassPayCost: {},
      shouldTriggerStackEffectFinishedEvent: false,
      msgs: [],
    },
    chipPool: {},
  },
  versionID: 0,
};

export function iterateEffect(ctx: GameContext): BlockPayload[] {
  return [
    ...ctx.gameState.immediateEffect,
    ...ctx.gameState.commandEffect,
    ...ctx.gameState.stackEffect,
  ];
}

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
    case "BlockPayloadCauseDestroy":
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
  switch (target.responsePlayer) {
    case "自軍":
      return getBlockOwner(ctx, blockPayload);
    case "敵軍":
      return getOpponentPlayerID(getBlockOwner(ctx, blockPayload));
  }
}

export function getSetGroupCards(ctx: GameContext, cardID: string) {
  return [
    cardID,
    ...Object.keys(ctx.gameState.setGroupLink).filter((k) => {
      return ctx.gameState.setGroupLink[k] == cardID;
    }),
  ];
}

export function getSetGroupRoot(
  ctx: GameContext,
  cardID: string
): string | null {
  return ctx.gameState.setGroupLink[cardID] || null;
}
