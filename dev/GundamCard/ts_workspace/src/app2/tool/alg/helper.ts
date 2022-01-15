import {
  AbsoluteBaSyou,
  BaSyou,
  CardCategory,
  CardColor,
} from "../tool/basic/basic";
import { CardPrototype, GameContext } from "../tool/basic/gameContext";
import { BlockPayload } from "../tool/basic/blockPayload";
import { getCard, mapCard, Card } from "../../../tool/table";
import { getCardBaSyou, getCardController } from "../tool/basic/handleCard";
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
  target: TargetType
): TargetType {
  log("getTargetType", target);
  const targetTypeAfterProcess = (() => {
    if (typeof target.value == "string") {
      if (targets[target.value] == null) {
        throw new Error("target.value not found");
      }
      return targets[target.value];
    }
    return target;
  })();
  if (targetTypeAfterProcess.value == null) {
    return targetTypeAfterProcess;
  }
  if (typeof targetTypeAfterProcess.value == "string") {
    throw new Error("must only one layer");
  }
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
    case "TargetTypeRef":
      return targetTypeAfterProcess;
    // このカード -> カード
    // 対象 -> カード
    // カード -> カード
    case "カード": {
      if (Array.isArray(targetTypeAfterProcess.value)) {
        return targetTypeAfterProcess;
      }
      const path = targetTypeAfterProcess.value.path;
      switch (path[0].id) {
        case "このカード":
          return {
            id: "カード",
            value: [getCardID()],
          };
        default:
          throw new Error("path[0].id not found:" + path[0].id);
      }
    }
    case "プレーヤー": {
      if (Array.isArray(targetTypeAfterProcess.value)) {
        return targetTypeAfterProcess;
      }
      const path = targetTypeAfterProcess.value.path;
      switch (path[0].id) {
        case "カード": {
          const targetType = getTargetType(ctx, blockPayload, targets, path[0]);
          if (targetType.id != "カード") {
            throw new Error("must be カード");
          }
          if (typeof targetType.value == "string") {
            throw new Error("must only one layer");
          }
          if (Array.isArray(targetType.value)) {
            if (targetType.value.length == 0) {
              throw new Error("cardID must > 0");
            }
            if (targetType.value[0] == null) {
              throw new Error("cardID[0] must not null");
            }
            const values = targetType.value.map((cardID) => {
              switch (path[1]) {
                default:
                case "Controller": {
                  return getCardController(ctx, cardID);
                }
              }
            });
            return {
              id: "プレーヤー",
              value: values,
            };
          } else {
            throw new Error("must be real value");
          }
        }
        default:
          throw new Error("path[0].id not found:" + path[0].id);
      }
    }
    case "カードの色": {
      if (Array.isArray(targetTypeAfterProcess.value)) {
        return targetTypeAfterProcess;
      }
      const path = targetTypeAfterProcess.value.path;
      switch (path[0].id) {
        case "カード": {
          const targetType = getTargetType(ctx, blockPayload, targets, path[0]);
          if (targetType.id != "カード") {
            throw new Error("must be カード");
          }
          if (typeof targetType.value == "string") {
            throw new Error("must only one layer");
          }
          if (Array.isArray(targetType.value)) {
            if (targetType.value.length == 0) {
              throw new Error("cardID must > 0");
            }
            if (targetType.value[0] == null) {
              throw new Error("cardID[0] must not null");
            }
            const values = targetType.value.map((cardID): CardColor => {
              switch (path[1]) {
                default:
                case "の色": {
                  return "白";
                }
              }
            });
            return {
              id: "カードの色",
              value: values,
            };
          } else {
            throw new Error("must be real value");
          }
        }
        default:
          throw new Error("path[0].id not found:" + path[0].id);
      }
    }
    case "TargetTypeCardRole": {
      if (Array.isArray(targetTypeAfterProcess.value)) {
        return targetTypeAfterProcess;
      }
      const path = targetTypeAfterProcess.value.path;
      switch (path[0].id) {
        case "カード": {
          const targetType = getTargetType(ctx, blockPayload, targets, path[0]);
          if (targetType.id != "カード") {
            throw new Error("must be カード");
          }
          if (typeof targetType.value == "string") {
            throw new Error("must only one layer");
          }
          if (Array.isArray(targetType.value)) {
            if (targetType.value.length == 0) {
              throw new Error("cardID must > 0");
            }
            if (targetType.value[0] == null) {
              throw new Error("cardID[0] must not null");
            }
            const values = targetType.value.map((cardID): CardCategory => {
              switch (path[1]) {
                default:
                case "的角色": {
                  return "グラフィック";
                }
              }
            });
            return {
              id: "TargetTypeCardRole",
              value: values,
            };
          } else {
            throw new Error("must be real value");
          }
        }
        default:
          throw new Error("path[0].id not found:" + path[0].id);
      }
    }
    case "TargetTypeString": {
      if (Array.isArray(targetTypeAfterProcess.value)) {
        return targetTypeAfterProcess;
      }
      const path = targetTypeAfterProcess.value.path;
      switch (path[0].id) {
        case "カード": {
          const targetType = getTargetType(ctx, blockPayload, targets, path[0]);
          if (targetType.id != "カード") {
            throw new Error("must be カード");
          }
          if (typeof targetType.value == "string") {
            throw new Error("must only one layer");
          }
          if (Array.isArray(targetType.value)) {
            if (targetType.value.length == 0) {
              throw new Error("cardID must > 0");
            }
            if (targetType.value[0] == null) {
              throw new Error("cardID[0] must not null");
            }
            const values = targetType.value.map((cardID): string => {
              switch (path[1]) {
                default:
                case "名称": {
                  return "xx";
                }
              }
            });
            return {
              id: "TargetTypeString",
              value: values,
            };
          } else {
            throw new Error("must be real value");
          }
        }
        default:
          throw new Error("path[0].id not found:" + path[0].id);
      }
    }
    case "場所": {
      if (Array.isArray(targetTypeAfterProcess.value)) {
        return targetTypeAfterProcess;
      }
      const path = targetTypeAfterProcess.value.path;
      switch (path[0].id) {
        case "カード": {
          const targetType = getTargetType(ctx, blockPayload, targets, path[0]);
          if (targetType.id != "カード") {
            throw new Error("must be カード");
          }
          if (typeof targetType.value == "string") {
            throw new Error("must only one layer");
          }
          if (Array.isArray(targetType.value)) {
            if (targetType.value.length == 0) {
              throw new Error("cardID must > 0");
            }
            if (targetType.value[0] == null) {
              throw new Error("cardID[0] must not null");
            }
            const values = targetType.value.map((cardID) => {
              switch (path[1]) {
                default:
                case "の場所": {
                  return getCardBaSyou(ctx, cardID);
                }
              }
            });
            return {
              id: "場所",
              value: values,
            };
          } else {
            throw new Error("must be real value");
          }
        }
        default:
          throw new Error("path[0].id not found:" + path[0].id);
      }
    }
    case "TargetTypeNumber": {
      if (Array.isArray(targetTypeAfterProcess.value)) {
        return targetTypeAfterProcess;
      }
      const path = targetTypeAfterProcess.value.path;
      switch (path[0].id) {
        case "TargetTypeRef": {
          const targetType = getTargetType(ctx, blockPayload, targets, path[0]);
          if (Array.isArray(targetType.value)) {
            return { id: "TargetTypeNumber", value: [targetType.value.length] };
          } else {
            throw new Error("must be real value");
          }
        }
        case "カード": {
          const targetType = getTargetType(ctx, blockPayload, targets, path[0]);
          if (targetType.id != "カード") {
            throw new Error("must be カード");
          }
          if (typeof targetType.value == "string") {
            throw new Error("must only one layer");
          }
          if (Array.isArray(targetType.value)) {
            if (targetType.value.length == 0) {
              throw new Error("cardID must > 0");
            }
            if (targetType.value[0] == null) {
              throw new Error("cardID[0] must not null");
            }
            const values = targetType.value.map((cardID) => {
              switch (path[1]) {
                default:
                case "合計国力": {
                  return 0;
                }
              }
            });
            return {
              id: "TargetTypeNumber",
              value: values,
            };
          } else {
            throw new Error("must be real value");
          }
        }
        default:
          throw new Error("path[0].id not found:" + path[0]);
      }
    }
    case "TargetTypeBoolean": {
      if (Array.isArray(targetTypeAfterProcess.value)) {
        return targetTypeAfterProcess;
      }
      const path = targetTypeAfterProcess.value.path;
      switch (path[0].id) {
        case "カード": {
          const targetType = getTargetType(ctx, blockPayload, targets, path[0]);
          if (targetType.id != "カード") {
            throw new Error("must be カード");
          }
          if (typeof targetType.value == "string") {
            throw new Error("must only one layer");
          }
          if (Array.isArray(targetType.value)) {
            if (targetType.value.length == 0) {
              throw new Error("cardID must > 0");
            }
            if (targetType.value[0] == null) {
              throw new Error("cardID[0] must not null");
            }
            const values = targetType.value.map((cardID) => {
              switch (path[1]) {
                default:
                case "交戦中": {
                  return false;
                }
              }
            });
            return {
              id: "TargetTypeBoolean",
              value: values,
            };
          } else {
            throw new Error("must be real value");
          }
        }
        default:
          throw new Error("path[0].id not found:" + path[0].id);
      }
    }
    case "TargetTypeCustom": {
      const func: TargetTypeCustomFunctionType = getCustomFunction(
        targetTypeAfterProcess.value
      );
      return func(ctx, blockPayload);
    }
    default:
      return targetTypeAfterProcess;
  }
}
