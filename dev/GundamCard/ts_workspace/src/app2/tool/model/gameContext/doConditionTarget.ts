import { TargetType } from "../basic";
import { BlockPayload } from "../blockPayload";
import { Block } from "../scriptContext/blockContext";
import { Condition } from "../blockPayload/condition";
import { GameContext } from "./gameContext";

export function doConditionTarget(
  gameCtx: GameContext,
  block: Block,
  blockPayload: BlockPayload,
  target: TargetType,
  condition: Condition
): string | null {
  switch (condition.id) {
    case "ConditionNot": {
      const result = doConditionTarget(
        gameCtx,
        block,
        blockPayload,
        target,
        condition.not
      );
      const isOk = result == null;
      const notResult = isOk == false;
      return notResult ? null : `子項目必須為否`;
    }
    case "ConditionAnd": {
      const results = condition.and.map((cond) =>
        doConditionTarget(gameCtx, block, blockPayload, target, cond)
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
        doConditionTarget(gameCtx, block, blockPayload, target, cond)
      );
      const reasons = results.filter((reason) => reason);
      const hasTrue = reasons.length != condition.or.length;
      if (hasTrue) {
        return null;
      }
      return `不符合其中1項: ${reasons.join(".")}`;
    }
    case "ConditionTargetType":
      {
        switch (condition.target) {
          case "カード": {
            if (target.id != "カード" && target.id != "このカード") {
              return "必須是カード";
            }
          }
          default:
            if (target.id != condition.target) {
              return `必須是${condition.target}`;
            }
        }
      }
      break;
    case "ConditionCardOnCategory": {
      switch (condition.category) {
        case "ユニット":
      }
      return null;
    }
  }
  return null;
}
