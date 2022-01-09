import { TargetType } from "../basic";
import { BlockPayload } from "../blockPayload";
import { Condition } from "../blockPayload/condition";
import { GameContext } from "./gameContext";
import { getTargetType, getCardState, getCardIterator } from ".";

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
    case "ConditionCardOnCategory": {
      const target = getTargetType(
        ctx,
        blockPayload,
        targets,
        condition.source
      );
      if (target.id != "カード") {
        return "必須是カード";
      }
      const msgs = target.cardID
        .map((cardID): string | null => {
          if (cardID == null) {
            return "[doCondition][ConditionCardOnCategory] cardID is null";
          }
          const [_, cardState] = getCardState(ctx, cardID);
          if (condition.category != cardState.prototype.category) {
            return `卡片類型必須是${condition.category}`;
          }
          return null;
        })
        .filter((v) => v);
      if (msgs.length) {
        return msgs.join(",");
      }
      return null;
    }
    case "ConditionCardContainFlag": {
      const target = getTargetType(
        ctx,
        blockPayload,
        targets,
        condition.source
      );
      if (target.id != "カード") {
        return "必須是カード";
      }
      const msgs = target.cardID
        .map((cardID): string | null => {
          if (cardID == null) {
            return "[doCondition][ConditionCardContainFlag] cardID is null";
          }
          const [_, cardState] = getCardState(ctx, cardID);
          if (cardState.flags[condition.flag] != true) {
            return "flag is right";
          }
          return null;
        })
        .filter((v) => v);
      if (msgs.length) {
        return msgs.join(",");
      }
      return null;
    }
    case "ConditionCardHasSetCard": {
      const target = getTargetType(
        ctx,
        blockPayload,
        targets,
        condition.source
      );
      if (target.id != "カード") {
        return "必須是カード";
      }
      const [_, cardIterator] = getCardIterator(ctx);
      const msgs = target.cardID
        .map((cardID): string | null => {
          if (cardID == null) {
            return "[doCondition][ConditionCardHasSetCard] cardID is null";
          }
          const [_, cardState] = getCardState(ctx, cardID);
          const findSameSetGroup =
            cardIterator.filter((v) => {
              return v.state.setGroupID == cardState.setGroupID;
            }).length > 1;
          if (findSameSetGroup == false) {
            return "[doCondition][ConditionCardHasSetCard] must has setGroup";
          }
          return null;
        })
        .filter((v) => v);
      if (msgs.length) {
        return msgs.join(",");
      }
      return null;
    }
    case "ConditionCardHasTokuTyou":
      break;
  }
  return null;
}
