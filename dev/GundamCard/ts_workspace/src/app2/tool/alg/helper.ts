import { AbsoluteBaSyou, BaSyou } from "../tool/basic/basic";
import { CardPrototype, GameContext } from "../tool/basic/gameContext";
import { BlockPayload } from "../tool/basic/blockPayload";
import { getCard, mapCard, Card } from "../../../tool/table";
import { getCardBaSyou } from "../tool/basic/handleCard";
import {
  CardState,
  mapEffect,
  reduceEffect,
  DEFAULT_CARD_STATE,
  CardTextState,
} from "../tool/basic/gameContext";
import { getCustomFunction } from "../../../tool/helper";
import {
  TargetType,
  TargetTypeCustomFunctionType,
} from "../tool/basic/targetType";
import { log } from "../../../tool/logger";
import { getPrototype } from "./script";

let idSeq = 0;
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
    throw new Error("[getCardOwner] card not found");
  }
  const [proto, isChip] = ((): [CardPrototype, boolean] => {
    const chip = ctx.gameState.chipPool[card.protoID];
    if (chip != null) {
      return [chip, true];
    }
    return [getPrototype(card.protoID), false];
  })();
  const uuidKey = `getCardState_${idSeq++}`;
  const newCardState: CardState = {
    ...DEFAULT_CARD_STATE,
    id: card.id,
    isChip: isChip,
    cardID: card.id,
    live: 0,
    destroy: false,
    setGroupID: uuidKey,
    cardTextStates: proto.texts.map((text, i): CardTextState => {
      return {
        id: `${card.id}_${i}`,
        enabled: true,
        cardText: {
          ...text,
        },
      };
    }),
    prototype: proto,
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
  const getCardID = () => {
    if (blockPayload.cause == null) {
      throw new Error("must has cause");
    }
    switch (blockPayload.cause.id) {
      case "BlockPayloadCauseGameEvent":
      case "BlockPayloadCauseUpdateCommand":
      case "BlockPayloadCauseUpdateEffect":
        if (blockPayload.cause.cardID == null) {
          throw new Error("[getTarget] このカード not found");
        }
        return blockPayload.cause.cardID;
      default:
        throw new Error("not support cause:" + blockPayload.cause.id);
    }
  };
  switch (targetTypeAfterProcess.id) {
    case "カード": {
      if (targetTypeAfterProcess.cardID != "このカード") {
        return {
          id: "カード",
          cardID: targetTypeAfterProcess.cardID,
        };
      }
      return {
        id: "カード",
        cardID: [getCardID()],
      };
    }
    case "TargetTypeString": {
      if (targetTypeAfterProcess.value == null) {
        return targetTypeAfterProcess;
      }
      const isRef = typeof targetTypeAfterProcess.value == "string";
      if (isRef == false) {
        return targetTypeAfterProcess;
      }
      if (targetTypeAfterProcess.source == null) {
        throw new Error("source not found");
      }
      const ref = targets[targetTypeAfterProcess.source];
      if (ref == null) {
        throw new Error("source is null");
      }
      const refTargetType = getTargetType(ctx, blockPayload, targets, ref);
      if (refTargetType.id != "カード") {
        throw new Error("must be card");
      }
      if (refTargetType.cardID.length == 0) {
        throw new Error("cardID must > 0");
      }
      if (refTargetType.cardID[0] == null) {
        throw new Error("cardID[0] must not null");
      }
      const [_, cardState] = getCardState(ctx, refTargetType.cardID[0]);
      switch (targetTypeAfterProcess.value) {
        default:
        case "名称": {
          return {
            id: "TargetTypeString",
            value: [""],
          };
        }
      }
    }
    case "TargetTypeNumber": {
      if (targetTypeAfterProcess.value == null) {
        return targetTypeAfterProcess;
      }
      const isRef = Array.isArray(targetTypeAfterProcess.value);
      if (isRef == false) {
        return targetTypeAfterProcess;
      }
      if (targetTypeAfterProcess.source == null) {
        throw new Error("source not found");
      }
      const ref = targets[targetTypeAfterProcess.source];
      if (ref == null) {
        throw new Error("source is null");
      }
      const refTargetType = getTargetType(ctx, blockPayload, targets, ref);
      if (refTargetType.id != "カード") {
        throw new Error("must be card");
      }
      if (refTargetType.cardID.length == 0) {
        throw new Error("cardID must > 0");
      }
      if (refTargetType.cardID[0] == null) {
        throw new Error("cardID[0] must not null");
      }
      const [_, cardState] = getCardState(ctx, refTargetType.cardID[0]);
      switch (targetTypeAfterProcess.value) {
        default:
        case "合計国力": {
          return {
            id: "TargetTypeNumber",
            value: 0,
          };
        }
      }
    }
    case "TargetTypeBoolean": {
      if (targetTypeAfterProcess.value == null) {
        return targetTypeAfterProcess;
      }
      const isRef = Array.isArray(targetTypeAfterProcess.value);
      if (isRef == false) {
        return targetTypeAfterProcess;
      }
      if (targetTypeAfterProcess.source == null) {
        throw new Error("source not found");
      }
      const ref = targets[targetTypeAfterProcess.source];
      if (ref == null) {
        throw new Error("source is null");
      }
      const refTargetType = getTargetType(ctx, blockPayload, targets, ref);
      if (refTargetType.id != "カード") {
        throw new Error("must be card");
      }
      if (refTargetType.cardID.length == 0) {
        throw new Error("cardID must > 0");
      }
      if (refTargetType.cardID[0] == null) {
        throw new Error("cardID[0] must not null");
      }
      const [_, cardState] = getCardState(ctx, refTargetType.cardID[0]);
      switch (targetTypeAfterProcess.value) {
        default:
        case "自軍": {
          return {
            id: "TargetTypeBoolean",
            value: false,
          };
        }
      }
    }
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
