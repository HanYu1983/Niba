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
import { CardStateComponent } from "./helper";

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
  //table: Table;
  //cardState: CardState[];
  timing: Timing;
  playerState: PlayerState[];
  activePlayerID: string | null;
  effects: GameEffectState[];
  globalCardState: GlobalCardState[];
  activeEffectID: string | null;
  stackEffectMemory: BlockPayload[];
  // 專門給破壞效果用的用的堆疊
  // 傷害判定結束時，將所有破壞產生的廢棄效果丟到這，重設「決定解決順序」的旗標為真
  // 如果這個堆疊一有值時並「決定解決順序」為真時，就立刻讓主動玩家決定解決順序，決定完後，將旗標設為假
  // 旗標為假時，才能才能開放給玩家切入
  // 這個堆疊解決完後，才回復到本來的堆疊的解決程序
  destroyEffect: BlockPayload[];
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
} & SetGroupComponent & IsBattleComponent & CardTableComponent & EffectStackComponent & CardStateComponent;


export type GameContext = {
  gameState: GameState;
  versionID: number;
};

export const DEFAULT_GAME_CONTEXT: GameContext = {
  gameState: {
    cards: {},
    effects: [],
    globalCardState: [],
    table: DEFAULT_TABLE,
    cardStates: {},
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


// export type RequireScriptFunction = (
//   gameCtx: GameContext,
//   blockPayload: BlockPayload,
//   varCtxID: string
// ) => GameContext;

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

export function getOpponentBattleArea(baSyou: AbsoluteBaSyou): AbsoluteBaSyou {
  const {
    value: [playerID, baSyouKW],
  } = baSyou;
  return {
    id: "AbsoluteBaSyou",
    value: [getOpponentPlayerID(playerID), baSyouKW],
  };
}

// EffectStackComponent

export type EffectStackComponent = {
  // 指令效果
  commandEffect: BlockPayload[];
  // 立即效果。玩家必須立即一個一個進行處理
  immediateEffect: BlockPayload[];
  // 堆疊效果。每次只處理第一個代表top的block
  stackEffect: BlockPayload[];
}

export function iterateEffect(ctx: EffectStackComponent): BlockPayload[] {
  return [
    ...ctx.immediateEffect,
    ...ctx.commandEffect,
    ...ctx.stackEffect,
  ];
}

export function mapEffect(
  ctx: EffectStackComponent,
  doF: (effect: BlockPayload) => BlockPayload
): EffectStackComponent {
  return {
    ...ctx,
    immediateEffect: ctx.immediateEffect.map(doF),
    commandEffect: ctx.commandEffect.map(doF),
    stackEffect: ctx.stackEffect.map(doF),
  };
}

export function reduceEffect<T>(
  ctx: EffectStackComponent,
  doF: (init: T, effect: BlockPayload) => T,
  init: T
): T {
  return [
    ...ctx.immediateEffect,
    ...ctx.commandEffect,
    ...ctx.stackEffect,
  ].reduce(doF, init);
}

export function filterEffect(
  ctx: EffectStackComponent,
  filterF: (effect: BlockPayload) => boolean
): EffectStackComponent {
  return {
    ...ctx,
    immediateEffect: ctx.immediateEffect.filter(filterF),
    commandEffect: ctx.commandEffect.filter(filterF),
    stackEffect: ctx.stackEffect.filter(filterF)
  };
}

export function addStackEffect(ctx: EffectStackComponent, block: BlockPayload): EffectStackComponent {
  return {
    ...ctx,
    stackEffect: [block, ...ctx.stackEffect],
  };
}

export function addImmediateEffect(ctx: EffectStackComponent, block: BlockPayload): EffectStackComponent {
  return {
    ...ctx,
    immediateEffect: [block, ...ctx.immediateEffect],
  };
}

// setGroup

export type SetGroupComponent = {
  setGroupLink: { [key: string]: string };
}

export function getSetGroupCards(ctx: SetGroupComponent, cardID: string): string[] {
  const root = getSetGroupRoot(ctx, cardID);
  if (root != null) {
    return getSetGroupCards(ctx, root);
  }
  return [
    cardID,
    ...Object.keys(ctx.setGroupLink).filter((k) => {
      return ctx.setGroupLink[k] == cardID;
    }),
  ];
}

export function getSetGroupRoot(
  ctx: SetGroupComponent,
  cardID: string
): string | null {
  return ctx.setGroupLink[cardID] || null;
}

// battle

export type IsBattleComponent = {
  // 是否交戰中，key代表牌堆名稱的字串
  isBattle: { [key: string]: boolean }
  table: Table
} & CardTableComponent

export function checkIsBattle(ctx: IsBattleComponent): IsBattleComponent {
  const battleAreas: AbsoluteBaSyou[] = [
    { id: "AbsoluteBaSyou", value: [PlayerA, "戦闘エリア（左）"] },
    { id: "AbsoluteBaSyou", value: [PlayerA, "戦闘エリア（右）"] },
  ];
  return battleAreas.reduce((ctx, battleArea) => {
    const baSyouID1 = getBaSyouID(battleArea);
    const baSyouID2 = getBaSyouID(getOpponentBattleArea(battleArea));
    if (
      ctx.table.cardStack[baSyouID1]?.length &&
      ctx.table.cardStack[baSyouID2]?.length
    ) {
      return {
        ...ctx,
        isBattle: {
          ...ctx.isBattle,
          [baSyouID1]: true,
          [baSyouID2]: true,
        },
      };
    }
    return {
      ...ctx,
      isBattle: {
        ...ctx.isBattle,
        [baSyouID1]: false,
        [baSyouID2]: false,
      }
    };
  }, ctx);
}

export function isBattle(
  ctx: IsBattleComponent,
  cardID: string,
  cardID2: string | null
): boolean {
  const baSyou1 = getCardBaSyou(ctx, cardID);
  if (ctx.isBattle[getBaSyouID(baSyou1)] != true) {
    return false;
  }
  if (cardID2 != null) {
    const baSyou2 = getOpponentBattleArea(baSyou1);
    const isFindCardID2 =
      ctx.table.cardStack[getBaSyouID(baSyou2)].find((cardId) => {
        return cardId == cardID2;
      }) != null;
    if (isFindCardID2 == false) {
      return false;
    }
  }
  return true;
}

// card
export type Card = {
  id: string
  ownerID: string
  protoID: string
  tap: boolean
}

export type CardTableComponent = {
  table: Table
  cards: { [key: string]: Card }
}

export function getCard(ctx: CardTableComponent, cardId: string): Card | null {
  return ctx.cards[cardId];
}

export function mapCard(ctx: CardTableComponent, f: (Card) => Card): CardTableComponent {
  return ctx;
}

export function getCardBaSyou(
  ctx: CardTableComponent,
  cardID: string
): AbsoluteBaSyou {
  const [_, cardPosition] = getCardPosition(ctx.table, cardID);
  if (cardPosition == null) {
    throw new Error("[getController] cardPosition not found");
  }
  return getBaSyou(cardPosition);
}

export function getCardController(ctx: CardTableComponent, cardID: string): PlayerID {
  const baSyou = getCardBaSyou(ctx, cardID);
  return baSyou.value[0];
}

export function getCardOwner(ctx: CardTableComponent, cardID: string): PlayerID {
  const card = getCard(ctx, cardID);
  if (card == null) {
    throw new Error("[getCardOwner] card not found");
  }
  if (card.ownerID == null) {
    throw new Error("[getCardOwner] card.ownerID not found");
  }
  return card.ownerID;
}

export function getAbsoluteBaSyou(
  baSyou: BaSyou,
  ctx: CardTableComponent,
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

// 

