import { BlockPayload } from "../tool/basic/blockPayload";
import { Condition } from "../tool/basic/condition";
import { GameContext, getBlockOwner } from "../tool/basic/gameContext";
import { getCardState, getCardIterator, getTargetType } from "./helper";
import { TargetType } from "../tool/basic/targetType";
import { getAbsoluteBaSyou, getCardController } from "../tool/basic/handleCard";
import { getBaShouID } from "../tool/basic/basic";
import { log } from "../../../tool/logger";

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
    case "ConditionCompareBoolean":
    case "ConditionCompareString":
    case "ConditionCompareNumber":
    case "ConditionCompareCard":
    case "ConditionCompareRole":
    case "ConditionComparePlayer":
    case "ConditionCompareCardCategory":
    case "ConditionCompareCardColor":
    case "ConditionCompareBaSyou": {
      const [v1, op, v2] = condition.value;
      const target1 = getTargetType(ctx, blockPayload, targets, v1);
      const target2 = getTargetType(ctx, blockPayload, targets, v2);
      switch (condition.id) {
        case "ConditionCompareNumber":
          if (target1.id != "數字") {
            return "type not right";
          }
          if (target2.id != "數字") {
            return "type not right";
          }
          break;
        case "ConditionCompareString":
          if (target1.id != "字串") {
            return "type not right";
          }
          if (target2.id != "字串") {
            return "type not right";
          }
          break;
        case "ConditionCompareBoolean":
          if (target1.id != "布林") {
            return "type not right";
          }
          if (target2.id != "布林") {
            return "type not right";
          }
          break;
        case "ConditionCompareCard":
          if (target1.id != "カード") {
            return "type not right";
          }
          if (target2.id != "カード") {
            return "type not right";
          }
          break;
        case "ConditionComparePlayer":
          if (target1.id != "プレーヤー") {
            return "type not right";
          }
          if (target2.id != "プレーヤー") {
            return "type not right";
          }
          break;
        case "ConditionCompareRole":
          if (target1.id != "「カード」的角色") {
            return "type not right";
          }
          if (target2.id != "「カード」的角色") {
            return "type not right";
          }
          break;
        case "ConditionCompareCardCategory":
          if (target1.id != "カードの種類") {
            return "type not right: ConditionCompareCardCategory";
          }
          if (target2.id != "カードの種類") {
            return "type not right: ConditionCompareCardCategory";
          }
          break;
        case "ConditionCompareCardColor":
          if (target1.id != "カードの色") {
            return "type not right";
          }
          if (target2.id != "カードの色") {
            return "type not right";
          }
          break;
        case "ConditionCompareBaSyou":
          if (target1.id != "場所") {
            return "type not right: ConditionCompareBaSyou";
          }
          if (target2.id != "場所") {
            return "type not right: ConditionCompareBaSyou";
          }
          break;
      }
      if (!Array.isArray(target1.value)) {
        return "type not right: must array";
      }
      const msgs = target1.value.map((a) => {
        switch (target2.id) {
          case "場所": {
            if (typeof a != "object") {
              return "a must be baSyou object";
            }
            if (!Array.isArray(target2.value)) {
              return "type not right: must array 2";
            }
            if (a.id == "RelatedBaSyou") {
              return "must be absolute baSyou";
            }
            switch (op) {
              case "==": {
                if (target2.value.length == 0) {
                  return "value.length must > 0";
                }
                const b = target2.value[0];
                if (b.id == "RelatedBaSyou") {
                  return "must be absolute baSyou";
                }
                if ((getBaShouID(a) == getBaShouID(b)) == false) {
                  return "baSyou not ==";
                }
                break;
              }
              case "in": {
                if (
                  target2.value
                    .map((b) => {
                      if (b.id == "RelatedBaSyou") {
                        return "must be absolute baSyou";
                      }
                      return getBaShouID(b);
                    })
                    .includes(getBaShouID(a)) == false
                ) {
                  return `不包含指定的場所:變數${JSON.stringify(v1)}的場所${getBaShouID(a)}必須包含在${JSON.stringify(target2.value)}`;
                }
                break;
              }
              default:
                return "baSyou not support op";
            }
            break;
          }
          case "カード":
          case "プレーヤー":
          case "字串":
          case "布林":
          case "數字":
          case "「カード」的角色":
          case "カードの種類":
          case "カードの色": {
            if (typeof a == "object") {
              return "a must be basic type";
            }
            if (!Array.isArray(target2.value)) {
              return "type not right";
            }
            if (target2.value.length == 0) {
              return "value.length must > 0";
            }
            const b = target2.value[0];
            switch (op) {
              case "<":
                if (a < b == false) {
                  return "xxx";
                }
                break;
              case "<=":
                if (a <= b == false) {
                  return "xxx";
                }
                break;
              case "==":
                if ((a == b) == false) {
                  return `不相等：${a} ${b}`;
                }
                break;
              case ">":
                if (a > b == false) {
                  return "xxx";
                }
                break;
              case ">=":
                if (a >= b == false) {
                  return "xxx";
                }
                break;
              case "in":
                // @ts-ignore
                if (target2.value.includes(a) == false) {
                  return "xx";
                }
                break;
              case "hasToken": {
                if (typeof a != "string") {
                  return "hasToken only support string";
                }
                if (typeof b != "string") {
                  return "hasToken only support string";
                }
                const tokens = a.split("|");
                if (tokens.includes(b) == false) {
                  return "hasToken error";
                }
                break;
              }
              case "交戦中":
                return "xxxx";
            }
            break;
          }
        }
      }).filter(v => v);
      if (msgs.length) {
        return msgs.join(".")
      }
    }
  }
  return null;
}
