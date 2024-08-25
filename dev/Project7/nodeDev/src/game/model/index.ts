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
  getBaSyouID,
  PlayerA,
  BattleAreaKeyword,
  getBaSyou,
  TIMING_CHART,
  BlockPayload
} from "../define";
import { DEFAULT_TABLE, Table, getCardPosition } from "../../tool/table";

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
  battleArea: BattleAreaKeyword[];
  texts: CardText[];
  implProgress: number;
};

export const DEFAULT_CARD_PROTOTYPE: CardPrototype = {
  title: "名稱未定義",
  characteristic: [],
  color: "白",
  category: "ユニット",
  rollCost: [],
  battlePoint: [0, 0, 0],
  battleArea: ["地球エリア", "宇宙エリア"],
  texts: [],
  implProgress: 0,
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
  // 是否交戰中，key代表牌堆名稱的字串
  isBattle: { [key: string]: boolean };
  //
  flowMemory: {
    state: "prepareDeck" | "whoFirst" | "draw6AndConfirm" | "playing";
    hasTriggerEvent: boolean;
    hasPlayerPassPhase: { [key: string]: boolean };
    hasPlayerPassCut: { [key: string]: boolean };
    hasPlayerPassPayCost: { [key: string]: boolean };
    shouldTriggerStackEffectFinishedEvent: boolean;
    msgs: Message[];
  };
  chipPool: { [key: string]: CardPrototype };
};


export type GameContext = {
  gameState: GameState;
  versionID: number;
};

export const DEFAULT_GAME_CONTEXT: GameContext = {
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
    isBattle: {},
    flowMemory: {
      state: "prepareDeck",
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
    case "BlockPayloadCauseGameEvent":
    case "BlockPayloadCauseUpdateEffect":
    case "BlockPayloadCauseUpdateCommand":
    case "BlockPayloadCauseGameRule":
    case "BlockPayloadCauseDestroy":
      return blockPayload.cause.playerID;
  }
}

export function getSetGroupCards(ctx: GameContext, cardID: string): string[] {
  const root = getSetGroupRoot(ctx, cardID);
  if (root != null) {
    return getSetGroupCards(ctx, root);
  }
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

export function getOpponentBattleArea(baSyou: AbsoluteBaSyou): AbsoluteBaSyou {
  const {
    value: [playerID, baSyouKW],
  } = baSyou;
  return {
    id: "AbsoluteBaSyou",
    value: [getOpponentPlayerID(playerID), baSyouKW],
  };
}

export function checkIsBattle(ctx: GameContext): GameContext {
  const battleAreas: AbsoluteBaSyou[] = [
    { id: "AbsoluteBaSyou", value: [PlayerA, "戦闘エリア（左）"] },
    { id: "AbsoluteBaSyou", value: [PlayerA, "戦闘エリア（右）"] },
  ];
  return battleAreas.reduce((ctx, battleArea) => {
    const baSyouID1 = getBaSyouID(battleArea);
    const baSyouID2 = getBaSyouID(getOpponentBattleArea(battleArea));
    if (
      ctx.gameState.table.cardStack[baSyouID1]?.length &&
      ctx.gameState.table.cardStack[baSyouID2]?.length
    ) {
      return {
        ...ctx,
        gameState: {
          ...ctx.gameState,
          isBattle: {
            ...ctx.gameState.isBattle,
            [baSyouID1]: true,
            [baSyouID2]: true,
          },
        },
      };
    }
    return {
      ...ctx,
      gameState: {
        ...ctx.gameState,
        isBattle: {
          ...ctx.gameState.isBattle,
          [baSyouID1]: false,
          [baSyouID2]: false,
        },
      },
    };
  }, ctx);
}

export function isBattle(
  ctx: GameContext,
  cardID: string,
  cardID2: string | null
): boolean {
  const baSyou1 = getCardBaSyou(ctx, cardID);
  if (ctx.gameState.isBattle[getBaSyouID(baSyou1)] != true) {
    return false;
  }
  if (cardID2 != null) {
    const baSyou2 = getOpponentBattleArea(baSyou1);
    const isFindCardID2 =
      ctx.gameState.table.cardStack[getBaSyouID(baSyou2)].find((cardId) => {
        return cardId == cardID2;
      }) != null;
    if (isFindCardID2 == false) {
      return false;
    }
  }
  return true;
}


export type Card = {
  id: string
  ownerID: string
  protoID: string
  tap: boolean
}

export function getCard(ctx: GameContext, cardId: string): Card | null {
  return null;
}

export function mapCard(ctx: GameContext, f: (Card) => Card): GameContext {
  return ctx;
}

export function getAbsoluteBaSyou(
  baSyou: BaSyou,
  ctx: GameContext,
  cardID: string
): AbsoluteBaSyou {
  if (baSyou.id == "AbsoluteBaSyou") {
    return baSyou;
  }
  const _playerID = (() => {
    switch (baSyou.value[0]) {
      case "持ち主": {
        const card = getCard(ctx, cardID);
        if (card == null) {
          throw new Error("getAbsoluteBaSyou card not found");
        }
        if (card.ownerID == null) {
          throw new Error("getAbsoluteBaSyou ownerID must not null");
        }
        return card.ownerID;
      }
      case "自軍":
        return getCardController(ctx, cardID);
      case "敵軍":
        return getOpponentPlayerID(getCardController(ctx, cardID));
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
  return getBaSyou(cardPosition);
}

export function getCardController(ctx: GameContext, cardID: string): PlayerID {
  const baSyou = getCardBaSyou(ctx, cardID);
  return baSyou.value[0];
}

export function getCardOwner(ctx: GameContext, cardID: string): PlayerID {
  const card = getCard(ctx, cardID);
  if (card == null) {
    throw new Error("[getCardOwner] card not found");
  }
  if (card.ownerID == null) {
    throw new Error("[getCardOwner] card.ownerID not found");
  }
  return card.ownerID;
}

export function addStackEffect(ctx: GameContext, block: BlockPayload): GameContext {
  return {
    ...ctx,
    gameState: {
      ...ctx.gameState,
      stackEffect: [block, ...ctx.gameState.stackEffect],
    },
  };
}

export function addImmediateEffect(ctx: GameContext, block: BlockPayload): GameContext {
  return {
    ...ctx,
    gameState: {
      ...ctx.gameState,
      immediateEffect: [block, ...ctx.gameState.immediateEffect],
    },
  };
}