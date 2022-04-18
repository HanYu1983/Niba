import {
  AbsoluteBaSyou,
  BaSyou,
  BattleBonus,
  CardCategory,
  CardColor,
  CardRole,
  Coin,
  getBaSyouID,
  getOpponentPlayerID,
  isBa,
  TokuSyuKouKa,
} from "../tool/basic/basic";
import {
  CardPrototype,
  GameContext,
  getBlockOwner,
  getSetGroupCards,
  getSetGroupRoot,
} from "../tool/basic/gameContext";
import {
  BlockPayload,
  mapRequireTargets,
  recurRequire,
} from "../tool/basic/blockPayload";
import { getCard, mapCard, Card, reduceCard } from "../../../tool/table";
import {
  getAbsoluteBaSyou,
  getCardBaSyou,
  getCardController,
  getCardOwner,
} from "../tool/basic/handleCard";
import {
  CardState,
  mapEffect,
  reduceEffect,
  DEFAULT_CARD_STATE,
  CardTextState,
} from "../tool/basic/gameContext";
import { err2string, getCustomFunction } from "../../../tool/helper";
import {
  TargetType,
  TargetTypeCard,
  TargetTypeScriptFunctionType,
} from "../tool/basic/targetType";
import { log2 } from "../../../tool/logger";
import { getPrototype } from "./script";

export function getCardState(
  ctx: GameContext,
  cardID: string
): [GameContext, CardState] {
  const cardState = ctx.gameState.cardState.find((cs) => {
    return cs.id == cardID;
  });
  if (cardState != null) {
    return [ctx, cardState];
  }
  const card = getCard(ctx.gameState.table, cardID);
  if (card == null) {
    throw new Error("[getCardState] card not found");
  }
  const [proto, isChip] = ((): [CardPrototype, boolean] => {
    const chip = ctx.gameState.chipPool[card.protoID];
    if (chip != null) {
      return [chip, true];
    }
    return [getPrototype(card.protoID), false];
  })();
  const newCardState: CardState = {
    ...DEFAULT_CARD_STATE,
    id: card.id,
    isChip: isChip,
    cardTextStates: proto.texts.map((text, i): CardTextState => {
      const cardTextStateID = text.cardTextStateID || `${card.id}_${i}`;
      return {
        id: cardTextStateID,
        enabled: true,
        cardText: {
          ...text,
        },
      };
    }),
  };
  return [
    {
      ...ctx,
      gameState: {
        ...ctx.gameState,
        cardState: [...ctx.gameState.cardState, newCardState],
      },
    },
    newCardState,
  ];
}

export function getCardIterator(
  ctx: GameContext
): [
  GameContext,
  { id: string; card: Card; baSyou: AbsoluteBaSyou; state: CardState }[]
] {
  const cards: Card[] = [];
  mapCard(ctx.gameState.table, (card) => {
    cards.push(card);
    return card;
  });
  const cardBaSyous = cards.map((card) => {
    return getCardBaSyou(ctx, card.id);
  });
  const cardStates = cards.map((card) => {
    const [nextCtx, cardState] = getCardState(ctx, card.id);
    ctx = nextCtx;
    return cardState;
  });
  return [
    ctx,
    cards.map((card, i) => {
      return {
        id: card.id,
        card: card,
        baSyou: cardBaSyous[i],
        state: cardStates[i],
      };
    }),
  ];
}

export function assertTargetTypeValueLength(target: TargetType) {
  if (!Array.isArray(target.value)) {
    return;
  }
  if (target.valueLengthInclude) {
    if (target.valueLengthInclude.includes(target.value.length) == false) {
      log2("assertTargetTypeValueLength", target);
      throw new Error(
        "陣列長度不正確:" + JSON.stringify(target.valueLengthInclude)
      );
    }
  }
}

export function assertBlockPayloadTargetTypeValueLength(
  blockPayload: BlockPayload
) {
  if (blockPayload.require == null) {
    return;
  }
  // 判斷需求長度
  recurRequire(blockPayload.require, (r) => {
    if (r.id != "RequireTarget") {
      return r;
    }
    mapRequireTargets(r, (k, v) => {
      try {
        assertTargetTypeValueLength(v);
      } catch (e) {
        throw new Error(`變數(${k})的${err2string(e)}`);
      }
      return v;
    });
    return r;
  });
}

export function getCardCharacteristic(ctx: GameContext, cardID: string) {
  const card = getCard(ctx.gameState.table, cardID);
  if (card == null) {
    throw new Error("card not found");
  }
  const prototype = getPrototype(card.protoID);
  return prototype.characteristic;
}

export function getCardColor(ctx: GameContext, cardID: string): CardColor {
  const card = getCard(ctx.gameState.table, cardID);
  if (card == null) {
    throw new Error("card not found");
  }
  const prototype = getPrototype(card.protoID);
  return prototype.color;
}

export function getCardTitle(ctx: GameContext, cardID: string): string {
  const card = getCard(ctx.gameState.table, cardID);
  if (card == null) {
    throw new Error("card not found");
  }
  const prototype = getPrototype(card.protoID);
  return prototype.title;
}

export function getCardBattlePoint(
  ctx: GameContext,
  cardID: string
): BattleBonus {
  const card = getCard(ctx.gameState.table, cardID);
  if (card == null) {
    throw new Error("card not found");
  }
  const prototype = getPrototype(card.protoID);
  const bonusFromCardState = ctx.gameState.globalCardState
    .filter((cs) => cs.cardID == cardID)
    .flatMap((cs) => cs.cardTextStates.map((cts) => cts.cardText))
    .filter(
      (ct) =>
        ct.id == "CardTextCustom" &&
        ct.customID.id == "CardTextCustomIDBattleBonus"
    )
    .map((ct) => {
      if (
        ct.id != "CardTextCustom" ||
        ct.customID.id != "CardTextCustomIDBattleBonus"
      ) {
        throw new Error("must be CardTextCustomIDBattleBonus");
      }
      return ct.customID.battleBonus;
    });
  const bonusFromCoin = ctx.gameState.table.tokens
    .filter((t) => {
      if (t.position.id != "TokenPositionCard") {
        return false;
      }
      if (t.position.cardID != cardID) {
        return false;
      }
      const coin = t.protoID as Coin;
      if (coin == null) {
        return false;
      }
      if (coin.id != "CoinBattleBonus") {
        return false;
      }
      return true;
    })
    .map((t) => {
      const coin = t.protoID as Coin;
      if (coin.id != "CoinBattleBonus") {
        throw new Error("must be CoinBattleBonus");
      }
      return coin.battleBonus;
    });
  const retBonus = [...bonusFromCardState, ...bonusFromCoin].reduce(
    ([x, y, z], [x2, y2, z2]): BattleBonus => {
      return [x + x2, y + y2, z + z2];
    },
    prototype.battlePoint
  );
  return retBonus;
}

export function getBattleGroup(
  ctx: GameContext,
  baSyou: AbsoluteBaSyou
): string[] {
  return (
    ctx.gameState.table.cardStack[getBaSyouID(baSyou)]
      ?.filter((card) => {
        return getSetGroupRoot(ctx, card.id) == null;
      })
      .map((root) => {
        return root.id;
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
        const [_, cs] = getCardState(ctx, cardID);
        if (cs.destroyReason != null) {
          return 0;
        }
        const card = getCard(ctx.gameState.table, cardID);
        if (card == null) {
          throw new Error("card not found");
        }
        // 横置的單位沒有攻擊力
        if (card.tap) {
          return 0;
        }
        const setGroupCards = getSetGroupCards(ctx, cardID);
        const power = setGroupCards
          .map((setGroupCardID) => {
            const [melee, range] = getCardBattlePoint(ctx, setGroupCardID);
            if (i == 0) {
              return melee || 0;
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
  const [_, cs] = getCardState(ctx, cardID);
  const gcs = ctx.gameState.globalCardState.filter((cs) => {
    return cs.cardID == cardID;
  });
  const texts = [cs, ...gcs]
    .flatMap((cs) => cs.cardTextStates)
    .map((cts) => cts.cardText);
  const has =
    texts.find((text) => {
      if (text.id != "特殊型") {
        return false;
      }
      if (text.description[0] != a[0]) {
        return false;
      }
      return true;
    }) != null;
  return has;
}

export function isABattleGroup(
  ctx: GameContext,
  a: TokuSyuKouKa,
  cardID: string
): boolean {
  const baSyou = getCardBaSyou(ctx, cardID);
  const battleGroup = getBattleGroup(ctx, baSyou);
  return (
    battleGroup
      .map((cardID) => {
        // 其中一張卡有就行了
        const setGroupCards = getSetGroupCards(ctx, cardID);
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
  const baSyouKW = getCardBaSyou(ctx, cardID).value[1];
  switch (baSyouKW) {
    case "Gゾーン":
    case "配備エリア":
    case "戦闘エリア（右）":
    case "戦闘エリア（左）":
      break;
    default:
      return false;
  }
  const baSyou = getCardBaSyou(ctx, cardID);
  const setGroup = getSetGroupCards(ctx, cardID);
  return true;
}

export function isOpponentHasBattleGroup(
  ctx: GameContext,
  cardID: string
): boolean {
  const controller = getCardController(ctx, cardID);
  const opponentPlayerID = getOpponentPlayerID(controller);
  const battleAreas: AbsoluteBaSyou[] = [
    { id: "AbsoluteBaSyou", value: [opponentPlayerID, "戦闘エリア（右）"] },
    { id: "AbsoluteBaSyou", value: [opponentPlayerID, "戦闘エリア（左）"] },
  ];
  return (
    battleAreas.flatMap((battleArea) => {
      return ctx.gameState.table.cardStack[getBaSyouID(battleArea)] || [];
    }).length != 0
  );
}

export function isMaster(
  ctx: GameContext,
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

export function getCardCoins(ctx: GameContext, cardID: string): Coin[] {
  return ctx.gameState.table.tokens
    .filter((token) => {
      if (token.position.id != "TokenPositionCard") {
        return false;
      }
      if (token.position.cardID != cardID) {
        return false;
      }
      return true;
    })
    .map((token) => token.protoID as Coin);
}

export function getCardStateIterator(
  ctx: GameContext
): [string, CardTextState[]][] {
  const converGlobalCardState = ctx.gameState.globalCardState.map((gs) => {
    return {
      id: gs.cardID,
      cardTextStates: gs.cardTextStates,
    };
  });
  return [...ctx.gameState.cardState, ...converGlobalCardState].map((v) => {
    return [v.id, v.cardTextStates] as [string, CardTextState[]];
  });
}

export function getCardCardTextState(
  ctx: GameContext,
  cardID: string
): CardTextState[] {
  return getCardStateIterator(ctx)
    .filter(([id, cts]) => {
      return id == cardID;
    })
    .flatMap(([_, cts]) => cts);

  // const converGlobalCardState = ctx.gameState.globalCardState.map((gs) => {
  //   return {
  //     id: gs.cardID,
  //     cardTextStates: gs.cardTextStates,
  //   };
  // });
  // return [...ctx.gameState.cardState, ...converGlobalCardState]
  //   .filter((v) => {
  //     return v.id == cardID;
  //   })
  //   .flatMap((v) => v.cardTextStates);
}
