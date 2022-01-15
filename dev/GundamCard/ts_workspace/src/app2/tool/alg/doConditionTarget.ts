import { BlockPayload } from "../tool/basic/blockPayload";
import { Condition } from "../tool/basic/condition";
import { GameContext, getBlockOwner } from "../tool/basic/gameContext";
import { getCardState, getCardIterator, getTargetType } from "./helper";
import { TargetType } from "../tool/basic/targetType";
import { getAbsoluteBaSyou, getCardController } from "../tool/basic/handleCard";
import { getBaShouID } from "../tool/basic/basic";

export function doConditionTarget(
  ctx: GameContext,
  blockPayload: BlockPayload,
  targets: { [key: string]: TargetType },
  condition: Condition
): string | null {
  switch (condition.id) {
    case "ConditionNot": {
      const result = doConditionTarget(
        ctx,
        blockPayload,
        targets,
        condition.not
      );
      const isOk = result == null;
      const notResult = isOk == false;
      return notResult ? null : `子項目必須為否`;
    }
    case "ConditionAnd": {
      const results = condition.and.map((cond) =>
        doConditionTarget(ctx, blockPayload, targets, cond)
      );
      const reasons = results.filter((reason) => reason);
      const hasFalse = reasons.length > 0;
      if (hasFalse) {
        return reasons.join(".");
      }
      return null;
    }
    case "ConditionOr": {
      const results = condition.or.map((cond) =>
        doConditionTarget(ctx, blockPayload, targets, cond)
      );
      const reasons = results.filter((reason) => reason);
      const hasTrue = reasons.length != condition.or.length;
      if (hasTrue) {
        return null;
      }
      return `不符合其中1項: ${reasons.join(".")}`;
    }
    // case "ConditionCardContainFlag": {
    //   const target = getTargetType(
    //     ctx,
    //     blockPayload,
    //     targets,
    //     condition.source
    //   );
    //   if (target.id != "カード") {
    //     return "必須是カード";
    //   }
    //   const msgs = target.cardID
    //     .map((cardID): string | null => {
    //       if (cardID == null) {
    //         return "[doCondition][ConditionCardContainFlag] cardID is null";
    //       }
    //       const [_, cardState] = getCardState(ctx, cardID);
    //       if (cardState.flags[condition.flag] != true) {
    //         return "flag is right";
    //       }
    //       return null;
    //     })
    //     .filter((v) => v);
    //   if (msgs.length) {
    //     return msgs.join(",");
    //   }
    //   return null;
    // }
    // case "ConditionCardHasSetCard": {
    //   const target = getTargetType(
    //     ctx,
    //     blockPayload,
    //     targets,
    //     condition.source
    //   );
    //   if (target.id != "カード") {
    //     return "必須是カード";
    //   }
    //   const [_, cardIterator] = getCardIterator(ctx);
    //   const msgs = target.cardID
    //     .map((cardID): string | null => {
    //       if (cardID == null) {
    //         return "[doCondition][ConditionCardHasSetCard] cardID is null";
    //       }
    //       const [_, cardState] = getCardState(ctx, cardID);
    //       const findSameSetGroup =
    //         cardIterator.filter((v) => {
    //           return v.state.setGroupID == cardState.setGroupID;
    //         }).length > 1;
    //       if (findSameSetGroup == false) {
    //         return "[doCondition][ConditionCardHasSetCard] must has setGroup";
    //       }
    //       return null;
    //     })
    //     .filter((v) => v);
    //   if (msgs.length) {
    //     return msgs.join(",");
    //   }
    //   return null;
    // }
    case "ConditionCompareBoolean":
    case "ConditionCompareString":
    case "ConditionCompareNumber":
    case "ConditionCompareCard":
    case "ConditionCompareRole":
    case "ConditionComparePlayer":
    case "ConditionCompareCardCategory":
    case "ConditionCompareBaSyou": {
      const [v1, op, v2] = condition.value;
      const target1 = getTargetType(ctx, blockPayload, targets, v1);
      const target2 = getTargetType(ctx, blockPayload, targets, v2);
      switch (condition.id) {
        case "ConditionCompareNumber":
          if (target1.id != "數字") {
            throw new Error("type not right");
          }
          if (target2.id != "數字") {
            throw new Error("type not right");
          }
          break;
        case "ConditionCompareString":
          if (target1.id != "字串") {
            throw new Error("type not right");
          }
          if (target2.id != "字串") {
            throw new Error("type not right");
          }
          break;
        case "ConditionCompareBoolean":
          if (target1.id != "布林") {
            throw new Error("type not right");
          }
          if (target2.id != "布林") {
            throw new Error("type not right");
          }
          break;
        case "ConditionCompareCard":
          if (target1.id != "カード") {
            throw new Error("type not right");
          }
          if (target2.id != "カード") {
            throw new Error("type not right");
          }
          break;
        case "ConditionComparePlayer":
          if (target1.id != "プレーヤー") {
            throw new Error("type not right");
          }
          if (target2.id != "プレーヤー") {
            throw new Error("type not right");
          }
          break;
        case "ConditionCompareRole":
          if (target1.id != "「カード」的角色") {
            throw new Error("type not right");
          }
          if (target2.id != "「カード」的角色") {
            throw new Error("type not right");
          }
          break;
        case "ConditionCompareCardCategory":
          if (target1.id != "カードの種類") {
            throw new Error("type not right");
          }
          if (target2.id != "カードの種類") {
            throw new Error("type not right");
          }
          break;
        case "ConditionCompareBaSyou":
          if (target1.id != "場所") {
            throw new Error("type not right");
          }
          if (target2.id != "場所") {
            throw new Error("type not right");
          }
          break;
      }
      if (!Array.isArray(target1.value)) {
        throw new Error("type not right");
      }
      target1.value.forEach((a) => {
        switch (target2.id) {
          case "場所": {
            if (typeof a != "object") {
              throw new Error("a must be baSyou object");
            }
            if (!Array.isArray(target2.value)) {
              throw new Error("type not right");
            }
            if (a.id == "RelatedBaSyou") {
              throw new Error("must be absolute baSyou");
            }
            switch (op) {
              case "==": {
                if (target2.value.length == 0) {
                  throw new Error("value.length must > 0");
                }
                const b = target2.value[0];
                if (b.id == "RelatedBaSyou") {
                  throw new Error("must be absolute baSyou");
                }
                if ((getBaShouID(a) == getBaShouID(b)) == false) {
                  throw new Error("baSyou not ==");
                }
                break;
              }
              case "in": {
                if (
                  target2.value
                    .map((b) => {
                      if (b.id == "RelatedBaSyou") {
                        throw new Error("must be absolute baSyou");
                      }
                      return getBaShouID(b);
                    })
                    .includes(getBaShouID(a)) == false
                ) {
                  throw new Error("baSyou not in");
                }
                break;
              }
              default:
                throw new Error("baSyou not support op");
            }
          }
          case "カード":
          case "プレーヤー":
          case "字串":
          case "布林":
          case "數字":
          case "「カード」的角色":
          case "カードの種類": {
            if (typeof a == "object") {
              throw new Error("a must be basic type");
            }
            if (!Array.isArray(target2.value)) {
              throw new Error("type not right");
            }
            if (target2.value.length == 0) {
              throw new Error("value.length must > 0");
            }
            const b = target2.value[0];
            switch (op) {
              case "<":
                if (a < b == false) {
                  throw new Error("xxx");
                }
                break;
              case "<=":
                if (a <= b == false) {
                  throw new Error("xxx");
                }
                break;
              case "==":
                if ((a == b) == false) {
                  throw new Error("xxx");
                }
                break;
              case ">":
                if (a > b == false) {
                  throw new Error("xxx");
                }
                break;
              case ">=":
                if (a >= b == false) {
                  throw new Error("xxx");
                }
                break;
              case "in":
                // @ts-ignore
                if (target2.value.includes(a) == false) {
                  throw new Error("xx");
                }
                break;
              case "hasToken": {
                if (typeof a != "string") {
                  throw new Error("hasToken only support string");
                }
                if (typeof b != "string") {
                  throw new Error("hasToken only support string");
                }
                const tokens = a.split("|");
                if (tokens.includes(b) == false) {
                  throw new Error("hasToken error");
                }
                break;
              }
              case "交戦中":
                throw new Error("xxxx");
            }
          }
        }
      });
    }
  }
  return null;
}
