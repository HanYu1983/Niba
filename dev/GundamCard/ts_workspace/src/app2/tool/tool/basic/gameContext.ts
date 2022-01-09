import {
  Card,
  DEFAULT_TABLE,
  getCard,
  getCardPosition,
  mapCard,
  Table,
} from "../../../../tool/table";
import { getCustomFunction } from "../../../../tool/helper";
import { log } from "../../../../tool/logger";
import type {
  GameEvent,
  TargetType,
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

export type Vars = {
  targets: { [key: string]: TargetType };
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

export type GameContext = {
  varsPool: { [key: string]: Vars };
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

export function toBaSyou(
  baSyou: RelatedBaSyou,
  ctx: GameContext,
  playerID: string,
  cardID: string
): AbsoluteBaSyou {
  const _playerID = (() => {
    switch (baSyou.value[0]) {
      case "持ち主": {
        const card = getCard(ctx.gameState.table, cardID);
        if (card == null) {
          throw new Error("getAbsoluteBaSyou card not found");
        }
        if (card.ownerID == null) {
          throw new Error("getAbsoluteBaSyou ownerID must not null");
        }
        return card.ownerID;
      }
      case "自軍":
        return playerID;
    }
  })();
  return {
    id: "AbsoluteBaSyou",
    value: [_playerID, baSyou.value[1]],
  };
}

export function getCardBaSyou(
  ctx: GameContext,
  cardID: string
): AbsoluteBaSyou {
  const [_, cardPosition] = getCardPosition(ctx.gameState.table, cardID);
  if (cardPosition == null) {
    throw new Error("[getController] cardPosition not found");
  }
  return getBaShou(cardPosition);
}

export function getCardController(ctx: GameContext, cardID: string): PlayerID {
  const baSyou = getCardBaSyou(ctx, cardID);
  return baSyou.value[0];
}

export function getCardOwner(ctx: GameContext, cardID: string): PlayerID {
  const card = getCard(ctx.gameState.table, cardID);
  if (card == null) {
    throw new Error("[getCardOwner] card not found");
  }
  if (card.ownerID == null) {
    throw new Error("[getCardOwner] card.ownerID not found");
  }
  return card.ownerID;
}

export type TargetTypeCustomFunctionType = (
  ctx: GameContext,
  blockPayload: BlockPayload
) => TargetType;

export function getTargetType(
  ctx: GameContext,
  blockPayload: BlockPayload,
  targets: { [key: string]: TargetType },
  target: string | TargetType
): TargetType {
  log("getTargetType", target);
  const targetTypeAfterProcess = (() => {
    if (typeof target == "string") {
      return targets[target];
    }
    return target;
  })();
  switch (targetTypeAfterProcess.id) {
    case "このカード":
      if (blockPayload.cause?.cardID == null) {
        throw new Error("[getTarget] このカード not found");
      }
      return { id: "カード", cardID: [blockPayload.cause.cardID] };
    case "TargetTypeCustom": {
      const func: TargetTypeCustomFunctionType = getCustomFunction(
        targetTypeAfterProcess.scriptString
      );
      return func(ctx, blockPayload);
    }
    default:
      return targetTypeAfterProcess;
  }
}

export function getCardColor(ctx: GameContext, cardID: string): CardColor {
  const cardState = ctx.gameState.cardState.find((cs) => {
    return cs.id == cardID;
  });
  if (cardState == null) {
    throw new Error("[getCardColor] cardState not found");
  }
  return cardState.prototype.color;
}

function recurRequire(
  require: Require,
  mapF: (require: Require) => Require
): Require {
  switch (require.id) {
    case "RequireAnd": {
      const nextRequires = require.and.map((require) => {
        return recurRequire(require, mapF);
      });
      const nextAnd: RequireAnd = {
        ...require,
        and: nextRequires,
      };
      return nextAnd;
    }
    case "RequireOr": {
      const nextRequires = require.or.map((require) => {
        return recurRequire(require, mapF);
      });
      const nextOr: RequireOr = {
        ...require,
        or: nextRequires,
      };
      return nextOr;
    }
    default:
      return mapF(require);
  }
}

let _reqKey = 0;
export function wrapRequireKey(r: Require): Require {
  return recurRequire(r, (r) => {
    return {
      ...r,
      key: `wrapRequireKey_${_reqKey++}`,
    };
  });
}
