import {
  AbsoluteBaSyou,
  BaSyou,
  BattleBonus,
  CardCategory,
  CardColor,
  CardRole,
  getBaShouID,
  getOpponentPlayerID,
} from "../tool/basic/basic";
import {
  CardPrototype,
  GameContext,
  getBlockOwner,
} from "../tool/basic/gameContext";
import { BlockPayload } from "../tool/basic/blockPayload";
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
import { getCustomFunction } from "../../../tool/helper";
import {
  TargetType,
  TargetTypeCustomFunctionType,
} from "../tool/basic/targetType";
import { log2 } from "../../../tool/logger";
import { getPrototype } from "./script";
import { triggerTextEvent } from "./handleGameContext";
import { GameEventOnManualEventCustomID } from "./gameEventOnManualEventCustomID";

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
    throw new Error("[getCardState] card not found");
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
  const targetTypeAfterProcess = (() => {
    if (typeof target.value == "string") {
      if (targets[target.value] == null) {
        log2("getTargetType", "blockPayload", blockPayload);
        throw new Error("target.value not found:" + target.value);
      }
      const replaced = targets[target.value];
      // 是參照的情況就不管取得類型
      if (target.id != "參照") {
        if (replaced.id != target.id) {
          log2("getTargetType", "blockPayload", blockPayload);
          log2("getTargetType", "target", target);
          log2("getTargetType", "replaced", replaced);
          throw new Error(
            `從變數取來的類型必須和本來的一樣:${target.id} != ${replaced.id}`
          );
        }
      }
      return replaced;
    }
    return target;
  })();
  if (targetTypeAfterProcess.value == null) {
    return targetTypeAfterProcess;
  }
  if (typeof targetTypeAfterProcess.value == "string") {
    throw new Error("must only one layer");
  }
  const getCardID = (block: BlockPayload) => {
    if (block.cause == null) {
      throw new Error("must has cause");
    }
    switch (block.cause.id) {
      case "BlockPayloadCauseGameEvent":
      case "BlockPayloadCauseUpdateCommand":
      case "BlockPayloadCauseUpdateEffect":
        if (block.cause.cardID == null) {
          throw new Error("[getTarget] このカード not found");
        }
        return block.cause.cardID;
      default:
        throw new Error("not support cause:" + block.cause.id);
    }
  };
  switch (targetTypeAfterProcess.id) {
    case "參照":
      return targetTypeAfterProcess;
    // このカード -> カード
    // 対象 -> カード
    // カード -> カード
    case "カード": {
      if (Array.isArray(targetTypeAfterProcess.value)) {
        // if (targetTypeAfterProcess.valueLengthInclude) {
        //   if (
        //     targetTypeAfterProcess.valueLengthInclude.includes(
        //       targetTypeAfterProcess.value.length
        //     ) == false
        //   ) {
        //     log2(
        //       "getTargetType",
        //       "targetTypeAfterProcess",
        //       targetTypeAfterProcess
        //     );
        //     throw new Error(
        //       "陣列長度不正確:" +
        //         JSON.stringify(targetTypeAfterProcess.valueLengthInclude)
        //     );
        //   }
        // }
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
          if (targetType.value.length == 0) {
            throw new Error("must have one value");
          }
          switch (path[1]) {
            case "的「カード」":
              throw new Error("not supoort");
            case "の上のカードX枚": {
              const x = path[2];
              return {
                id: "カード",
                value: targetType.value.slice(0, x),
              };
            }
            default:
              throw new Error(`unknown path[1]: ${path[1]}`);
          }
          break;
        }
        case "場所": {
          const targetType = getTargetType(ctx, blockPayload, targets, path[0]);
          if (targetType.id != "場所") {
            throw new Error("must be 場所");
          }
          if (!Array.isArray(targetType.value)) {
            throw new Error("must be real value");
          }
          if (targetType.value.length == 0) {
            throw new Error("must have one value");
          }
          if (targetType.value[0].id != "AbsoluteBaSyou") {
            throw new Error("must be AbsoluteBaSyou");
          }
          switch (path[1]) {
            case "的「カード」":
              const baSyouID = getBaShouID(targetType.value[0]);
              return {
                id: "カード",
                value: ctx.gameState.table.cardStack[baSyouID].map((c) => c.id),
              };
            case "の上のカードX枚": {
              throw new Error("not supoort");
            }
            default:
              throw new Error(`unknown path[1]: ${path[1]}`);
          }
          break;
        }
        case "このカード":
          return {
            id: "カード",
            value: [getCardID(blockPayload)],
          };
        case "「効果」解決時": {
          const targetType = getTargetType(ctx, blockPayload, targets, path[0]);
          if (targetType.id != "「効果」解決時") {
            throw new Error("must be 「効果」解決時");
          }
          if (!Array.isArray(targetType.value)) {
            throw new Error("must be real value");
          }
          const values = targetType.value.map((evt) => {
            switch (path[1]) {
              case "的「カード」": {
                if (evt.block.cause?.id != "BlockPayloadCauseGameEvent") {
                  throw new Error("必須是BlockPayloadCauseGameEvent");
                }
                if (evt.block.cause.gameEvent.id != "「効果」解決時") {
                  throw new Error("必須是「効果」解決時");
                }
                return getCardID(evt.block);
              }
              default:
                throw new Error(`unknown path[1]: ${path[1]}`);
            }
          });
          return {
            id: "カード",
            value: values,
          };
        }
        case "手動事件發生時":
          const targetType = getTargetType(ctx, blockPayload, targets, path[0]);
          if (targetType.id != "手動事件發生時") {
            throw new Error("must be 手動事件發生時");
          }
          if (!Array.isArray(targetType.value)) {
            throw new Error("must be real value");
          }
          const values = targetType.value.map((evt) => {
            switch (path[1]) {
              case "プレイされて場に出た場合のカード": {
                const customID: GameEventOnManualEventCustomID = evt.customID;
                if (customID.id != "プレイされて場に出た場合") {
                  throw new Error("must be プレイされて場に出た場合");
                }
                return customID.cardID;
              }
              default:
                throw new Error(`unknown path[1]: ${path[1]}`);
            }
          });
          return {
            id: "カード",
            value: values,
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
        case "自軍":
          switch (targetTypeAfterProcess.responsePlayer) {
            case "敵軍":
              return {
                id: "プレーヤー",
                value: [getOpponentPlayerID(getBlockOwner(ctx, blockPayload))],
              };
            case "自軍":
            default:
              return {
                id: "プレーヤー",
                value: [getBlockOwner(ctx, blockPayload)],
              };
          }
        case "敵軍":
          switch (targetTypeAfterProcess.responsePlayer) {
            case "敵軍":
              return {
                id: "プレーヤー",
                value: [getBlockOwner(ctx, blockPayload)],
              };
            case "自軍":
            default:
              return {
                id: "プレーヤー",
                value: [getOpponentPlayerID(getBlockOwner(ctx, blockPayload))],
              };
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
              case "的「持ち主」": {
                return getCardOwner(ctx, cardID);
              }
              case "的「コントローラー」": {
                return getCardController(ctx, cardID);
              }
              default:
                throw new Error("not support:" + path[1]);
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
      if (targetTypeAfterProcess.value.triggerGameEvent) {
        ctx = triggerTextEvent(
          ctx,
          targetTypeAfterProcess.value.triggerGameEvent
        );
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
          const values = targetType.value.map((cardID): CardRole => {
            switch (path[1]) {
              case "當成横置裝彈G時的角色":
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
                    return "未指定";
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
            return getAbsoluteBaSyou(v, ctx, getCardID(blockPayload));
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
        case "數字": {
          const [v1, op] = targetTypeAfterProcess.value.path;
          switch (op) {
            case "+":
            case "-": {
              const targetType1 = getTargetType(ctx, blockPayload, targets, v1);
              if (!Array.isArray(targetType1.value)) {
                throw new Error("must be real value");
              }
              const v2 = targetTypeAfterProcess.value.path[2];
              const targetType2 = getTargetType(ctx, blockPayload, targets, v2);
              if (!Array.isArray(targetType2.value)) {
                throw new Error("must be real value");
              }
              const b = targetType2.value[0];
              return {
                id: "數字",
                value: targetType1.value.map((a) => {
                  switch (op) {
                    case "+":
                      return a + b;
                    case "-":
                      return a - b;
                  }
                }),
              };
            }
            default:
              throw new Error(
                `not support:${targetTypeAfterProcess.value.path[1]}`
              );
          }
        }
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
          if (targetTypeAfterProcess.value.triggerGameEvent) {
            ctx = triggerTextEvent(
              ctx,
              targetTypeAfterProcess.value.triggerGameEvent
            );
          }
          const values = targetType.value.map((cardID) => {
            switch (path[1]) {
              case "的「改装」的「合計国力」":
              case "的陣列長度":
                throw new Error("not support");
              case "的「攻撃力」": {
                const [_, cardState] = getCardState(ctx, cardID);
                return cardState.prototype.battlePoint[0];
              }
              case "的「防御力」": {
                const [_, cardState] = getCardState(ctx, cardID);
                return cardState.prototype.battlePoint[2];
              }
              case "的「合計国力」": {
                const [_, cardState] = getCardState(ctx, cardID);
                return cardState.prototype.rollCost.length;
              }
              case "的「ロールコストの合計値」": {
                const [_, cardState] = getCardState(ctx, cardID);
                return cardState.prototype.rollCost.filter((v) => v != null)
                  .length;
              }
              default:
                throw new Error(`not support:${path[1]}`);
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
              case "的「ロールコストの合計値」":
                throw new Error("not support");
              case "的「合計国力」":
              case "的「改装」的「合計国力」": {
                const controller = getBlockOwner(ctx, blockPayload);
                const gBaSyou: AbsoluteBaSyou = {
                  id: "AbsoluteBaSyou",
                  value: [controller, "Gゾーン"],
                };
                const gCards =
                  ctx.gameState.table.cardStack[getBaShouID(gBaSyou)];
                if (gCards == null) {
                  log2("getTargetType", "gBaSyou", gBaSyou);
                  throw new Error("gCards must find");
                }
                return gCards.length;
              }
              default:
                throw new Error(`not support:${path[1]}`);
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
                const card = getCard(ctx.gameState.table, cardID);
                if (card == null) {
                  throw new Error("card must find");
                }
                return card.tap == false;
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
          const values = targetType.value.map((cardID) => {
            switch (path[1]) {
              case "的「種類」": {
                const [_2, cardState] = getCardState(ctx, cardID);
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
    case "腳本": {
      const func: TargetTypeCustomFunctionType = getCustomFunction(
        targetTypeAfterProcess.value
      );
      return func(ctx, blockPayload);
    }
    case "戦闘修正": {
      if (Array.isArray(targetTypeAfterProcess.value)) {
        return targetTypeAfterProcess;
      }
      const path = targetTypeAfterProcess.value.path;
      switch (path[0].id) {
        case "數字": {
          const targetType = getTargetType(ctx, blockPayload, targets, path[0]);
          if (targetType.id != "數字") {
            throw new Error("must be 數字");
          }
          if (!Array.isArray(targetType.value)) {
            throw new Error("must be real value");
          }
          switch (path[1]) {
            case "の戦闘修正": {
              if (targetType.value.length == 1) {
                return {
                  id: "戦闘修正",
                  value: [
                    [
                      targetType.value[0],
                      targetType.value[0],
                      targetType.value[0],
                    ],
                  ],
                };
              }
              const bonus: BattleBonus = [
                targetType.value?.[0] || 0,
                targetType.value?.[1] || 0,
                targetType.value?.[2] || 0,
              ];
              return {
                id: "戦闘修正",
                value: [bonus],
              };
            }
            default:
              throw new Error("not support:" + path[1]);
          }
          break;
        }
        case "手動事件發生時": {
          const targetType = getTargetType(ctx, blockPayload, targets, path[0]);
          if (targetType.id != "手動事件發生時") {
            throw new Error("must be 手動事件發生時");
          }
          if (!Array.isArray(targetType.value)) {
            throw new Error("must be real value");
          }
          const values = targetType.value.map((evt) => {
            switch (path[1]) {
              case "の「ゲイン」の「効果」の戦闘修正": {
                const customID: GameEventOnManualEventCustomID = evt.customID;
                if (customID.id != "「ゲイン」の効果で戦闘修正を得た場合") {
                  throw new Error(
                    "must be 「ゲイン」の効果で戦闘修正を得た場合"
                  );
                }
                return customID.bonus;
              }
              default:
                throw new Error("not support:" + path[1]);
            }
          });
          return {
            id: "戦闘修正",
            value: values,
          };
        }
      }
    }
    case "「効果」解決時": {
      if (Array.isArray(targetTypeAfterProcess.value)) {
        return targetTypeAfterProcess;
      }
      const path = targetTypeAfterProcess.value.path;
      switch (path[0].id) {
        case "觸發這個事件的「効果」": {
          if (blockPayload.cause?.id != "BlockPayloadCauseGameEvent") {
            throw new Error("必須是BlockPayloadCauseGameEvent");
          }
          if (blockPayload.cause.gameEvent.id != "「効果」解決時") {
            throw new Error("必須是「効果」解決時");
          }
          return {
            id: "「効果」解決時",
            value: [blockPayload.cause.gameEvent],
          };
        }
      }
    }
    case "手動事件發生時": {
      if (Array.isArray(targetTypeAfterProcess.value)) {
        return targetTypeAfterProcess;
      }
      const path = targetTypeAfterProcess.value.path;
      switch (path[0].id) {
        case "觸發這個事件的手動事件": {
          if (blockPayload.cause?.id != "BlockPayloadCauseGameEvent") {
            throw new Error("必須是BlockPayloadCauseGameEvent");
          }
          if (blockPayload.cause.gameEvent.id != "手動事件發生時") {
            throw new Error("必須是手動事件發生時");
          }
          return {
            id: "手動事件發生時",
            value: [blockPayload.cause.gameEvent],
          };
        }
      }
    }
    default:
      throw new Error(`not impl: ${targetTypeAfterProcess.id}`);
  }
}
