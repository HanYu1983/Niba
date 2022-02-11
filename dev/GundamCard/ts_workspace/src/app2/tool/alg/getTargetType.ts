import {
  AbsoluteBaSyou,
  BaSyou,
  BattleBonus,
  CardCategory,
  CardColor,
  CardRole,
  Coin,
  getBaShouID,
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
import { err2string, getCustomFunction } from "../../../tool/helper";
import {
  TargetType,
  TargetTypeCard,
  TargetTypeScriptFunctionType,
} from "../tool/basic/targetType";
import { log2 } from "../../../tool/logger";
import { getPrototype } from "./script";
import { triggerTextEvent, wrapTip } from "./handleGameContext";
import { getCardState, getCardStateIterator } from "./helper";

export type TargetTypeCardCustom1 = {
  id: "交戦中ではない、全てのユニット";
};

export type TargetTypeCardCustom = TargetTypeCardCustom1;

export function getTargetTypeCardCustom(
  ctx: GameContext,
  blockPayload: BlockPayload,
  targets: { [key: string]: TargetType },
  target: TargetType,
  customID: TargetTypeCardCustom1
): TargetTypeCard {
  switch (customID.id) {
    case "交戦中ではない、全てのユニット": {
      const allUnitCards = Object.keys(ctx.gameState.table.cardStack)
        .filter((baSyouID) => {
          const [_, kw] = JSON.parse(baSyouID);
          return isBa(kw);
        })
        .filter((baSyouID) => {
          return ctx.gameState.isBattle[baSyouID] != true;
        })
        .flatMap((baSyouID) => ctx.gameState.table.cardStack[baSyouID]);
      return {
        id: "カード",
        value: allUnitCards.map((card) => card.id),
      };
    }
  }
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
      case "BlockPayloadCauseDestroy":
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
                ...targetTypeAfterProcess,
                id: "カード",
                value: targetType.value.slice(0, x),
              };
            }
            case "のセットグループのユニット": {
              return {
                ...targetTypeAfterProcess,
                id: "カード",
                value: targetType.value.map((cardID) => {
                  const rootCardID = getSetGroupRoot(ctx, cardID);
                  if (rootCardID == null) {
                    throw new Error("rootCardID not found");
                  }
                  return rootCardID;
                }),
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
        case "custom":
          return getTargetTypeCardCustom(
            ctx,
            blockPayload,
            targets,
            target,
            path[1]
          );
        case "このカード":
          return {
            id: "カード",
            value: [getCardID(blockPayload)],
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
                ...targetTypeAfterProcess,
                id: "プレーヤー",
                value: [getOpponentPlayerID(getBlockOwner(ctx, blockPayload))],
              };
            case "自軍":
            default:
              return {
                ...targetTypeAfterProcess,
                id: "プレーヤー",
                value: [getBlockOwner(ctx, blockPayload)],
              };
          }
        case "敵軍":
          switch (targetTypeAfterProcess.responsePlayer) {
            case "敵軍":
              return {
                ...targetTypeAfterProcess,
                id: "プレーヤー",
                value: [getBlockOwner(ctx, blockPayload)],
              };
            case "自軍":
            default:
              return {
                ...targetTypeAfterProcess,
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
            ...targetTypeAfterProcess,
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
                const card = getCard(ctx.gameState.table, cardID);
                if (card == null) {
                  throw new Error("card not found");
                }
                const prototype = getPrototype(card.protoID);
                return prototype.color;
              }
            }
          });
          return {
            ...targetTypeAfterProcess,
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
                    const card = getCard(ctx.gameState.table, cardID);
                    if (card == null) {
                      throw new Error("card not found");
                    }
                    const prototype = getPrototype(card.protoID);
                    return prototype.category;
                  default:
                    return "未指定";
                }
              }
            }
          });
          return {
            ...targetTypeAfterProcess,
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
                const card = getCard(ctx.gameState.table, cardID);
                if (card == null) {
                  throw new Error("card not found");
                }
                const prototype = getPrototype(card.protoID);
                return prototype.category;
              }
            }
          });
          return {
            ...targetTypeAfterProcess,
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
                const card = getCard(ctx.gameState.table, cardID);
                if (card == null) {
                  throw new Error("card not found");
                }
                const prototype = getPrototype(card.protoID);
                return prototype.characteristic.join("|");
              }
              case "的「名称」": {
                const card = getCard(ctx.gameState.table, cardID);
                if (card == null) {
                  throw new Error("card not found");
                }
                const prototype = getPrototype(card.protoID);
                return prototype.title;
              }
            }
          });
          return {
            ...targetTypeAfterProcess,
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
            ...targetTypeAfterProcess,
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
          switch (path[1]) {
            case "的陣列長度": {
              const targetType = getTargetType(
                ctx,
                blockPayload,
                targets,
                path[0]
              );
              if (Array.isArray(targetType.value)) {
                return { id: "數字", value: [targetType.value.length] };
              } else {
                throw new Error("must be real value");
              }
            }
            default:
              throw new Error(`not support:${path[1]}`);
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
                const card = getCard(ctx.gameState.table, cardID);
                if (card == null) {
                  throw new Error("card not found");
                }
                const prototype = getPrototype(card.protoID);
                return prototype.battlePoint[0];
              }
              case "的「防御力」": {
                const card = getCard(ctx.gameState.table, cardID);
                if (card == null) {
                  throw new Error("card not found");
                }
                const prototype = getPrototype(card.protoID);
                const [_, cardState] = getCardState(ctx, cardID);
                return prototype.battlePoint[2];
              }
              case "的「合計国力」": {
                // p.55
                // 1. 加算効果
                // 2. 減算效果
                // 3. 支付
                // 4. 特殊支付
                const card = getCard(ctx.gameState.table, cardID);
                if (card == null) {
                  throw new Error("card not found");
                }
                const prototype = getPrototype(card.protoID);
                return prototype.rollCost.length;
              }
              case "的「ロールコストの合計値」": {
                const card = getCard(ctx.gameState.table, cardID);
                if (card == null) {
                  throw new Error("card not found");
                }
                const prototype = getPrototype(card.protoID);
                return prototype.rollCost.filter((v) => v != null).length;
              }
              default:
                throw new Error(`not support:${path[1]}`);
            }
          });
          return {
            ...targetTypeAfterProcess,
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
            ...targetTypeAfterProcess,
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
                // const [_, cardIterator] = getCardIterator(ctx);
                // const [_2, cardState] = getCardState(ctx, cardID);
                // const findSameSetGroup =
                //   cardIterator.filter((v) => {
                //     return v.state.setGroupID == cardState.setGroupID;
                //   }).length > 1;
                //return findSameSetGroup;
                return ctx.gameState.setGroupLink[cardID] != null;
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
            ...targetTypeAfterProcess,
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
                const card = getCard(ctx.gameState.table, cardID);
                if (card == null) {
                  throw new Error("card not found");
                }
                const prototype = getPrototype(card.protoID);
                return prototype.category;
              }
            }
          });
          return {
            ...targetTypeAfterProcess,
            id: "カードの種類",
            value: values,
          };
        }
      }
      break;
    }
    case "腳本": {
      const func: TargetTypeScriptFunctionType = getCustomFunction(
        targetTypeAfterProcess.value
      );
      return func(ctx, blockPayload, targets, target);
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
      }
    }
    case "カードのテキスト":
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
          const values = targetType.value.flatMap((cardID) => {
            switch (path[1]) {
              case "的「テキスト」": {
                return getCardStateIterator(ctx)
                  .filter(([id, _]) => {
                    return id == cardID;
                  })
                  .flatMap(([_, cts]) => cts);
              }
            }
          });
          return {
            ...targetTypeAfterProcess,
            id: "カードのテキスト",
            value: values,
          };
        }
      }
    default:
      throw new Error(`not impl: ${targetTypeAfterProcess.id}`);
  }
}
