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
import {
  getCard,
  Card,
  getAbsoluteBaSyou,
  getCardBaSyou,
  getCardController,
  getCardOwner,
  CardTableComponent,
} from "./CardTableComponent"
import { DEFAULT_TABLE, Table, getCardPosition } from "../../tool/table";
import { CardStateComponent, getCardState } from "./CardStateComponent";
import { IsBattleComponent } from "./IsBattleComponent";
import { getSetGroupCards, getSetGroupRoot, SetGroupComponent } from "./SetGroupComponent";
import { EffectStackComponent } from "./EffectStackComponent";
import { getPreloadPrototype } from "../../script";

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

export function getBlockOwner(
  ctx: GameState,
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

export function getCardCharacteristic(ctx: GameState, cardID: string) {
  const card = getCard(ctx, cardID);
  if (card == null) {
    throw new Error("card not found");
  }
  const prototype = getPreloadPrototype(card.protoID);
  return prototype.characteristic;
}

export function getCardColor(ctx: GameState, cardID: string): CardColor {
  const card = getCard(ctx, cardID);
  if (card == null) {
    throw new Error("card not found");
  }
  const prototype = getPreloadPrototype(card.protoID);
  return prototype.color;
}

export function getCardTitle(ctx: GameState, cardID: string): string {
  const card = getCard(ctx, cardID);
  if (card == null) {
    throw new Error("card not found");
  }
  const prototype = getPreloadPrototype(card.protoID);
  return prototype.title;
}

export function getCardBattlePoint(
  ctx: GameContext,
  cardID: string
): BattleBonus {
  const card = getCard(ctx.gameState, cardID);
  if (card == null) {
    throw new Error("card not found");
  }
  const prototype = getPreloadPrototype(card.protoID);
  // const bonusFromCardState = ctx.gameState.globalCardState
  //   .filter((cs) => cs.cardID == cardID)
  //   .flatMap((cs) => cs.cardTextStates.map((cts) => cts.cardText))
  //   .filter(
  //     (ct) =>
  //       ct.id == "CardTextCustom" &&
  //       ct.customID.id == "CardTextCustomIDBattleBonus"
  //   )
  //   .map((ct) => {
  //     if (
  //       ct.id != "CardTextCustom" ||
  //       ct.customID.id != "CardTextCustomIDBattleBonus"
  //     ) {
  //       throw new Error("must be CardTextCustomIDBattleBonus");
  //     }
  //     return ct.customID.battleBonus;
  //   });
  // const bonusFromCoin = ctx.gameState.table.tokens
  //   .filter((t) => {
  //     if (t.position.id != "TokenPositionCard") {
  //       return false;
  //     }
  //     if (t.position.cardID != cardID) {
  //       return false;
  //     }
  //     const coin = t.protoID as Coin;
  //     if (coin == null) {
  //       return false;
  //     }
  //     if (coin.id != "CoinBattleBonus") {
  //       return false;
  //     }
  //     return true;
  //   })
  //   .map((t) => {
  //     const coin = t.protoID as Coin;
  //     if (coin.id != "CoinBattleBonus") {
  //       throw new Error("must be CoinBattleBonus");
  //     }
  //     return coin.battleBonus;
  //   });
  // const retBonus = [...bonusFromCardState, ...bonusFromCoin].reduce(
  //   ([x, y, z], [x2, y2, z2]): BattleBonus => {
  //     return [x + x2, y + y2, z + z2];
  //   },
  //   prototype.battlePoint
  // );
  return [0, 0, 0];
}

export function getBattleGroup(
  ctx: GameContext,
  baSyou: AbsoluteBaSyou
): string[] {
  return (
    ctx.gameState.table.cardStack[getBaSyouID(baSyou)]
      ?.filter((cardId) => {
        return getSetGroupRoot(ctx.gameState, cardId) == null;
      })
      .map((rootCardId) => {
        return rootCardId
      }) || []
  );
}

export function getBattleGroupBattlePoint(
  ctx: GameContext,
  unitCardIDs: string[]
) {
  const attackPower =
    unitCardIDs
      .map((cardID, i): number => {
        // 破壞的單位沒有攻擊力
        const cs = getCardState(ctx.gameState, cardID);
        if (cs.destroyReason != null) {
          return 0;
        }
        const card = getCard(ctx.gameState, cardID);
        if (card == null) {
          throw new Error("card not found");
        }
        // 横置的單位沒有攻擊力
        if (card.tap) {
          return 0;
        }
        const setGroupCards = getSetGroupCards(ctx.gameState, cardID);
        const power = setGroupCards
          .map((setGroupCardID) => {
            const [melee, range] = getCardBattlePoint(ctx, setGroupCardID);
            if (melee == "*") {
              return 0;
            }
            if (i == 0) {
              return melee || 0;
            }
            if (range == "*") {
              return 0;
            }
            return range || 0;
          })
          .reduce((a, b) => a + b);
        return power;
      })
      ?.reduce((acc, c) => acc + c, 0) || 0;
  return attackPower;
}

export function hasTokuSyouKouKa(
  ctx: GameContext,
  a: TokuSyuKouKa,
  cardID: string
): boolean {
  // const cs = getCardState(ctx, cardID);
  // const gcs = ctx.gameState.globalCardState.filter((cs) => {
  //   return cs.cardID == cardID;
  // });
  // const texts = [cs, ...gcs]
  //   .reduce((acc, cs) => acc.concat(cs.cardTextStates), [])
  //   .map((cts) => cts.cardText);
  // const has =
  //   texts.find((text) => {
  //     if (text.id != "特殊型") {
  //       return false;
  //     }
  //     if (text.description[0] != a[0]) {
  //       return false;
  //     }
  //     return true;
  //   }) != null;
  // return has;
  return false;
}

export function isABattleGroup(
  ctx: GameContext,
  a: TokuSyuKouKa,
  cardID: string
): boolean {
  const baSyou = getCardBaSyou(ctx.gameState, cardID);
  const battleGroup = getBattleGroup(ctx, baSyou);
  return (
    battleGroup
      .map((cardID) => {
        // 其中一張卡有就行了
        const setGroupCards = getSetGroupCards(ctx.gameState, cardID);
        for (const cardGroupCardID of setGroupCards) {
          if (hasTokuSyouKouKa(ctx, a, cardGroupCardID)) {
            return true;
          }
        }
        return false;
      })
      .reduce((acc, c) => {
        return acc && c;
      }) || false
  );
}

export function isCanReroll(
  ctx: GameContext,
  condition: any,
  cardID: string
): boolean {
  const baSyouKW = getCardBaSyou(ctx.gameState, cardID).value[1];
  switch (baSyouKW) {
    case "Gゾーン":
    case "配備エリア":
    case "戦闘エリア（右）":
    case "戦闘エリア（左）":
      break;
    default:
      return false;
  }
  const baSyou = getCardBaSyou(ctx.gameState, cardID);
  const setGroup = getSetGroupCards(ctx.gameState, cardID);
  return true;
}

export function isOpponentHasBattleGroup(
  ctx: GameContext,
  cardID: string
): boolean {
  const controller = getCardController(ctx.gameState, cardID);
  const opponentPlayerID = getOpponentPlayerID(controller);
  const battleAreas: AbsoluteBaSyou[] = [
    { id: "AbsoluteBaSyou", value: [opponentPlayerID, "戦闘エリア（右）"] },
    { id: "AbsoluteBaSyou", value: [opponentPlayerID, "戦闘エリア（左）"] },
  ];
  return (
    battleAreas.reduce((acc: string[], battleArea) => {
      return acc.concat(ctx.gameState.table.cardStack[getBaSyouID(battleArea)] || []);
    }, []).length != 0
  );
}

export function isMaster(
  ctx: GameState,
  unitCardID: string,
  cardID: string
): boolean {
  const match = getCardCharacteristic(ctx, unitCardID)
    .join("|")
    .match(/専用「(.+?)」/);
  if (match == null) {
    return false;
  }
  const [_, masterName] = match;
  if (masterName != getCardTitle(ctx, cardID)) {
    return false;
  }
  return true;
}

// export function getCardCoins(ctx: GameContext, cardID: string): Coin[] {
//   return ctx.gameState.table.tokens
//     .filter((token) => {
//       if (token.position.id != "TokenPositionCard") {
//         return false;
//       }
//       if (token.position.cardID != cardID) {
//         return false;
//       }
//       return true;
//     })
//     .map((token) => token.protoID as Coin);
// }

// export function getCardStateIterator(
//   ctx: GameContext
// ): [string, CardTextState[]][] {
//   const converGlobalCardState = ctx.gameState.globalCardState.map((gs) => {
//     return {
//       id: gs.cardID,
//       cardTextStates: gs.cardTextStates,
//     };
//   });
//   return [...ctx.gameState.cardState, ...converGlobalCardState].map((v) => {
//     return [v.id, v.cardTextStates] as [string, CardTextState[]];
//   });
// }

export function getCardCardTextState(
  ctx: GameState,
  cardID: string
): CardTextState[] {
  // return getCardStateIterator(ctx)
  //   .filter(([id, cts]) => {
  //     return id == cardID;
  //   })
  //   .flatMap(([_, cts]) => cts);
  return [];
}

export function getCardBattleArea(
  ctx: GameState,
  cardID: string
): BattleAreaKeyword[] {
  const card = getCard(ctx, cardID);
  if (card == null) {
    throw new Error("card not found");
  }
  const prototype = getPreloadPrototype(card.protoID);
  return prototype.battleArea;
}

export function doBlockPayload(
  ctx: GameState,
  blockPayload: BlockPayload
): GameState {
  return ctx;
}