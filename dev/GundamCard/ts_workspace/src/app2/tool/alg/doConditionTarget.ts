import { BlockPayload } from "../tool/basic/blockPayload";
import { Condition } from "../tool/basic/condition";
import { GameContext, getBlockOwner } from "../tool/basic/gameContext";
import { getCardState, getCardIterator, getTargetType } from "./helper";
import { TargetType } from "../tool/basic/targetType";
import { getAbsoluteBaSyou, getCardController } from "../tool/basic/handleCard";
import { getBaShouID } from "../tool/basic/basic";
import { log2 } from "../../../tool/logger";
import { jsonfp } from "../tool/basic/jsonfpHelper";
import { err2string } from "../../../tool/helper";

export function doConditionTarget(
  ctx: GameContext,
  blockPayload: BlockPayload,
  targets: { [key: string]: TargetType },
  condition: Condition,
  varCtxID: string
): void {
  switch (condition.id) {
    case "ConditionNot": {
      try {
        doConditionTarget(ctx, blockPayload, targets, condition.not, varCtxID);
      } catch (e) {
        log2("doConditionTarget", "子項目為否, 符合需求. 回傳.", e);
        return;
      }
      throw new Error("子項目必須為否");
    }
    case "ConditionAnd": {
      const results = condition.and.map((cond) => {
        try {
          doConditionTarget(ctx, blockPayload, targets, cond, varCtxID);
          return null;
        } catch (e) {
          return err2string(e);
        }
      });
      const reasons = results.filter((reason) => reason);
      const hasFalse = reasons.length > 0;
      if (hasFalse) {
        throw new Error(reasons.join("."));
      }
      return;
    }
    case "ConditionOr": {
      const results = condition.or.map((cond) => {
        try {
          doConditionTarget(ctx, blockPayload, targets, cond, varCtxID);
          return null;
        } catch (e) {
          return err2string(e);
        }
      });
      const reasons = results.filter((reason) => reason);
      const hasTrue = reasons.length != condition.or.length;
      if (hasTrue) {
        return;
      }
      throw new Error(`不符合其中1項: ${reasons.join(".")}`);
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
            throw new Error("type not right: ConditionCompareCardCategory");
          }
          if (target2.id != "カードの種類") {
            throw new Error("type not right: ConditionCompareCardCategory");
          }
          break;
        case "ConditionCompareCardColor":
          if (target1.id != "カードの色") {
            throw new Error("type not right");
          }
          if (target2.id != "カードの色") {
            throw new Error("type not right");
          }
          break;
        case "ConditionCompareBaSyou":
          if (target1.id != "場所") {
            throw new Error("type not right: ConditionCompareBaSyou");
          }
          if (target2.id != "場所") {
            throw new Error("type not right: ConditionCompareBaSyou");
          }
          break;
      }
      if (!Array.isArray(target1.value)) {
        throw new Error("type not right: must array");
      }
      const msgs = target1.value
        .map((a) => {
          switch (target2.id) {
            case "場所": {
              if (typeof a != "object") {
                throw new Error("a must be baSyou object");
              }
              if (!Array.isArray(target2.value)) {
                throw new Error("type not right: must array 2");
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
                    throw new Error(
                      `場所不符合:${getBaShouID(a)} != ${getBaShouID(b)}`
                    );
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
                    throw new Error(
                      `不包含指定的場所:變數${JSON.stringify(
                        v1
                      )}的場所${getBaShouID(a)}必須包含在${JSON.stringify(
                        target2.value
                      )}`
                    );
                  }
                  break;
                }
                default:
                  throw new Error("baSyou not support op");
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
                    throw new Error(`不為真：${a} < ${b}`);
                  }
                  break;
                case "<=":
                  if (a <= b == false) {
                    throw new Error(`不為真：${a} <= ${b}`);
                  }
                  break;
                case "==":
                  if ((a == b) == false) {
                    throw new Error(`不為真：${a} == ${b}`);
                  }
                  break;
                case "!=":
                  if ((a != b) == false) {
                    throw new Error(`不為真：${a} != ${b}`);
                  }
                  break;
                case ">":
                  if (a > b == false) {
                    throw new Error(`不為真：${a} > ${b}`);
                  }
                  break;
                case ">=":
                  if (a >= b == false) {
                    throw new Error(`不為真：${a} >= ${b}`);
                  }
                  break;
                case "in":
                  // @ts-ignore
                  if (target2.value.includes(a) == false) {
                    throw new Error(
                      `不為真：${a}包含在${JSON.stringify(target2.value)}`
                    );
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
                default:
                  throw new Error(`not impl: ${op}`);
              }
              break;
            }
          }
        })
        .filter((v) => v);
      if (msgs.length) {
        throw new Error(msgs.join("."));
      }
      break;
    }
    case "ConditionJsonfp": {
      const originJsonfpContext = ctx.varsPool[varCtxID]?.jsonfpContext || {};
      const jsonfpContext = { ...originJsonfpContext };
      let err: any = null;
      let result: any = null;
      jsonfp.apply(
        jsonfpContext,
        {
          ctx: { def: ctx },
          blockPayload: { def: blockPayload },
          require: { def: require },
          targets: { def: targets },
        },
        condition.program,
        // 使用callback的error, 時機才會正確
        (e: any, ret: any) => {
          err = e;
          result = ret;
        }
      );
      if (err != null) {
        throw err;
      }
      break;
    }
  }
}
