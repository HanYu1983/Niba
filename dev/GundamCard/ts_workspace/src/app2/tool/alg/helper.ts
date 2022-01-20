import {
  AbsoluteBaSyou,
  BaSyou,
  CardCategory,
  CardColor,
} from "../tool/basic/basic";
import { CardPrototype, GameContext } from "../tool/basic/gameContext";
import { BlockPayload } from "../tool/basic/blockPayload";
import { getCard, mapCard, Card } from "../../../tool/table";
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
  log("getTargetType", "target");
  log("getTargetType", target);
  log("getTargetType", "targets");
  log("getTargetType", targets);
  const targetTypeAfterProcess = (() => {
    if (typeof target.value == "string") {
      if (targets[target.value] == null) {
        throw new Error("target.value not found:" + target.value);
      }
      const replaced = targets[target.value];
      if (replaced.id != target.id) {
        throw new Error(`從變數取來的類型必須和本來的一樣:${target.id} != ${replaced.id}`)
      }
      return replaced
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
  log("getTargetType", "targetTypeAfterProcess");
  log("getTargetType", targetTypeAfterProcess);
  switch (targetTypeAfterProcess.id) {
    case "參照":
      return targetTypeAfterProcess;
    // このカード -> カード
    // 対象 -> カード
    // カード -> カード
    case "カード": {
      if (Array.isArray(targetTypeAfterProcess.value)) {
        if (targetTypeAfterProcess.valueLengthInclude) {
          if (targetTypeAfterProcess.valueLengthInclude.includes(targetTypeAfterProcess.value.length) == false) {
            throw new Error("card length must in " + JSON.stringify(targetTypeAfterProcess.valueLengthInclude))
          }
        }
        return targetTypeAfterProcess;
      }
      const path = targetTypeAfterProcess.value.path;
      switch (path[0].id) {
        case "このカード":
          return {
            id: "カード",
            value: [getCardID()],
          };
      }
      break;
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
          if (!Array.isArray(targetType.value)) {
            throw new Error("must be real value");
          }
          // if (targetType.value.length == 0) {
          //   throw new Error("cardID must > 0");
          // }
          const values = targetType.value.map((cardID) => {
            switch (path[1]) {
              case "的「持ち主」": {
                return getCardOwner(ctx, cardID);
              }
              case "的「コントローラー」": {
                return getCardController(ctx, cardID);
              }
            }
          });
          return {
            id: "プレーヤー",
            value: values,
          };
        }
      }
      break;
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
          if (!Array.isArray(targetType.value)) {
            throw new Error("must be real value");
          }
          // if (targetType.value.length == 0) {
          //   throw new Error("cardID must > 0");
          // }
          const values = targetType.value.map((cardID): CardColor => {
            switch (path[1]) {
              case "的「色」": {
                const [_, cardState] = getCardState(ctx, cardID);
                return cardState.prototype.color;
              }
            }
          });
          return {
            id: "カードの色",
            value: values,
          };
        }
      }
      break;
    }
    case "「カード」的角色": {
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
          if (!Array.isArray(targetType.value)) {
            throw new Error("must be real value");
          }
          // if (targetType.value.length == 0) {
          //   throw new Error("cardID must > 0");
          // }
          const values = targetType.value.map((cardID): CardCategory => {
            switch (path[1]) {
              case "的角色": {
                const {
                  value: [_, baSyou],
                } = getCardBaSyou(ctx, cardID);
                const [_2, cardState] = getCardState(ctx, cardID);
                switch (baSyou) {
                  case "Gゾーン":
                    return "グラフィック";
                  case "戦闘エリア（左）":
                  case "戦闘エリア（右）":
                  case "配備エリア":
                    return cardState.prototype.category;
                  default:
                    throw new Error("no have role");
                }
              }
            }
          });
          return {
            id: "「カード」的角色",
            value: values,
          };
        }
      }
      break;
    }
    case "カードの種類": {
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
          if (!Array.isArray(targetType.value)) {
            throw new Error("must be real value");
          }
          // if (targetType.value.length == 0) {
          //   throw new Error("cardID must > 0");
          // }
          const values = targetType.value.map((cardID): CardCategory => {
            switch (path[1]) {
              case "的「種類」": {
                const [_, cardState] = getCardState(ctx, cardID);
                return cardState.prototype.category;
              }
            }
          });
          return {
            id: "カードの種類",
            value: values,
          };
        }
      }
      break;
    }
    case "字串": {
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
          if (!Array.isArray(targetType.value)) {
            throw new Error("must be real value");
          }
          // if (targetType.value.length == 0) {
          //   throw new Error("cardID must > 0");
          // }
          const values = targetType.value.map((cardID): string => {
            const [_, cardState] = getCardState(ctx, cardID);
            switch (path[1]) {
              case "的「特徴」": {
                return cardState.prototype.characteristic.join("|");
              }
              case "的「名称」": {
                return cardState.prototype.title;
              }
            }
          });
          return {
            id: "字串",
            value: values,
          };
        }
      }
      break;
    }
    case "場所": {
      if (Array.isArray(targetTypeAfterProcess.value)) {
        return {
          id: "場所",
          value: targetTypeAfterProcess.value.map((v) => {
            if (v.id == "AbsoluteBaSyou") {
              return v;
            }
            return getAbsoluteBaSyou(v, ctx, getCardID());
          }),
        };
      }
      const path = targetTypeAfterProcess.value.path;
      switch (path[0].id) {
        case "カード": {
          const targetType = getTargetType(ctx, blockPayload, targets, path[0]);
          if (targetType.id != "カード") {
            throw new Error("must be カード");
          }
          if (!Array.isArray(targetType.value)) {
            throw new Error("must be real value");
          }
          // if (targetType.value.length == 0) {
          //   throw new Error("cardID must > 0");
          // }
          const values = targetType.value.map((cardID) => {
            switch (path[1]) {
              case "的「場所」": {
                return getCardBaSyou(ctx, cardID);
              }
            }
          });
          return {
            id: "場所",
            value: values,
          };
        }
      }
      break;
    }
    case "數字": {
      if (Array.isArray(targetTypeAfterProcess.value)) {
        return targetTypeAfterProcess;
      }
      const path = targetTypeAfterProcess.value.path;
      switch (path[0].id) {
        case "參照": {
          const targetType = getTargetType(ctx, blockPayload, targets, path[0]);
          if (Array.isArray(targetType.value)) {
            return { id: "數字", value: [targetType.value.length] };
          } else {
            throw new Error("must be real value");
          }
        }
        case "カード": {
          const targetType = getTargetType(ctx, blockPayload, targets, path[0]);
          if (targetType.id != "カード") {
            throw new Error("must be カード");
          }
          if (!Array.isArray(targetType.value)) {
            throw new Error("must be real value");
          }
          // if (targetType.value.length == 0) {
          //   throw new Error("cardID must > 0");
          // }
          const values = targetType.value.map((cardID) => {
            switch (path[1]) {
              case "的「改装」的「合計国力」":
              case "的陣列長度":
                throw new Error("not support");
              case "的「攻撃力」":
              case "的「防御力」":
              case "的「合計国力」": {
                return 0;
              }
            }
          });
          return {
            id: "數字",
            value: values,
          };
        }
        case "プレーヤー": {
          const targetType = getTargetType(ctx, blockPayload, targets, path[0]);
          if (targetType.id != "プレーヤー") {
            throw new Error("must be プレーヤー");
          }
          if (!Array.isArray(targetType.value)) {
            throw new Error("must be real value");
          }
          // if (targetType.value.length == 0) {
          //   throw new Error("cardID must > 0");
          // }
          const values = targetType.value.map((cardID) => {
            switch (path[1]) {
              case "的陣列長度":
              case "的「攻撃力」":
              case "的「防御力」":
                throw new Error("not support");
              case "的「合計国力」": {
                return 0;
              }
              case "的「改装」的「合計国力」": {
                return 0
              }
            }
          });
          return {
            id: "數字",
            value: values,
          };
        }
      }
      break;
    }
    case "布林": {
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
          if (!Array.isArray(targetType.value)) {
            throw new Error("must be real value");
          }
          // if (targetType.value.length == 0) {
          //   throw new Error("cardID must > 0");
          // }
          const values = targetType.value.map((cardID) => {
            switch (path[1]) {
              case "在「交戦中」？": {
                return false;
              }
              case "是「セットカード」？": {
                const [_, cardIterator] = getCardIterator(ctx);
                const [_2, cardState] = getCardState(ctx, cardID);
                const findSameSetGroup =
                  cardIterator.filter((v) => {
                    return v.state.setGroupID == cardState.setGroupID;
                  }).length > 1;
                return findSameSetGroup;
              }
              case "存在旗標？": {
                const flag = path[2];
                const [_2, cardState] = getCardState(ctx, cardID);
                return cardState.flags.includes(flag);
              }
              case "是直立的？": {
                const card = getCard(ctx.gameState.table, cardID)
                if (card == null) {
                  throw new Error("card must find")
                }
                return card.tap == false
              }
            }
          });
          return {
            id: "布林",
            value: values,
          };
        }
      }
      break;
    }
    case "カードの種類":
      {
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
            if (!Array.isArray(targetType.value)) {
              throw new Error("must be real value");
            }
            // if (targetType.value.length == 0) {
            //   throw new Error("cardID must > 0");
            // }
            const values = targetType.value.map((cardID) => {
              switch (path[1]) {
                case "的「種類」": {
                  const [_2, cardState] = getCardState(ctx, cardID);
                  return cardState.prototype.category
                }
              }
            });
            return {
              id: "カードの種類",
              value: values,
            };
          }
        }
        break;
      }
    case "腳本": {
      const func: TargetTypeCustomFunctionType = getCustomFunction(
        targetTypeAfterProcess.value
      );
      return func(ctx, blockPayload);
    }
    default:
      throw new Error(`not impl: ${targetTypeAfterProcess.id}`)
  }
}
