import {
  BlockPayload,
  Feedback,
  Require,
  RequireTarget,
} from "../tool/basic/blockPayload";
import { Condition } from "../tool/basic/condition";
import { Action } from "../tool/basic/action";
import { GameContext } from "../tool/basic/gameContext";
import { mapEffect, reduceEffect } from "../tool/basic/gameContext";
import { getCustomFunction } from "../../../tool/helper";
import { RequireScriptFunction } from "../tool/basic/gameContext";
import { doActionTarget } from "./doActionTarget";
import { doRequireCustom } from "./doRequireCustom";
import { doConditionTarget } from "./doConditionTarget";

function doCondition(
  ctx: GameContext,
  blockPayload: BlockPayload,
  require: RequireTarget,
  condition: Condition
): string | null {
  return doConditionTarget(ctx, blockPayload, require.targets, condition);
}

function doAction(
  ctx: GameContext,
  blockPayload: BlockPayload,
  require: RequireTarget,
  action: Action,
  varCtxID: string
): GameContext {
  Object.entries(require.targets).forEach(([key, target]) => {
    switch (target.id) {
      case "カード":
        {
          if (target.cardID == "このカード") {
            break;
          }
          target.cardID.forEach((v, i) => {
            if (v == null) {
              throw new Error(`target(${key})[${i}] must not null`);
            }
          });
        }
        break;
      case "プレーヤー": {
        if (target.playerID == null) {
          throw new Error(`target(${key})[playerID] must not null`);
        }
        break;
      }
      case "TargetTypeBoolean":
      case "TargetTypeNumber":
      case "TargetTypeString":
        if (target.value == null) {
          throw new Error(`target(${key})[TargetTypeString] must not null`);
        }
        break;
    }
  });

  switch (action.id) {
    case "ActionSetTarget": {
      const { target } = action;
      const source = require.targets[action.source];
      if (source == null) {
        throw new Error(`require.targets[${action.source}] not found`);
      }
      return {
        ...ctx,
        varsPool: {
          ...ctx.varsPool,
          [varCtxID]: {
            ...ctx.varsPool[varCtxID],
            targets: {
              ...ctx.varsPool[varCtxID]?.targets,
              [target]: source,
            },
          },
        },
      };
    }
    default:
      return doActionTarget(
        ctx,
        blockPayload,
        require.targets,
        action,
        varCtxID
      );
  }
}

export function doRequire(
  ctx: GameContext,
  blockPayload: BlockPayload,
  require: Require,
  varCtxID: string
): GameContext {
  switch (require.id) {
    case "RequireAnd": {
      return require.and.reduce((originGameCtx, r) => {
        return doRequire(originGameCtx, blockPayload, r, varCtxID);
      }, ctx);
    }
    case "RequireOr": {
      const results = require.or.map((r): [string | null, GameContext] => {
        try {
          return [null, doRequire(ctx, blockPayload, r, varCtxID)];
        } catch (e) {
          return [JSON.stringify(e), ctx];
        }
      });
      for (const [err, nextGameCtx] of results) {
        if (err == null) {
          return nextGameCtx;
        }
      }
      const msg = results
        .filter(([err, _]) => err)
        .map(([err, _]) => err)
        .join(".");
      throw new Error(msg);
    }
    case "RequireYesNo": {
      if (require.answer == null) {
        throw new Error("沒有回答Yes Or No");
      }
      return ctx;
    }
    case "RequireTarget": {
      if (require.condition) {
        const reason = doCondition(
          ctx,
          blockPayload,
          require,
          require.condition
        );
        if (reason != null) {
          throw new Error(reason);
        }
      }
      if (require.action?.length) {
        return require.action.reduce((originGameCtx, action) => {
          return doAction(
            originGameCtx,
            blockPayload,
            require,
            action,
            varCtxID
          );
        }, ctx);
      }
      return ctx;
    }
    case "RequireScript": {
      const func: RequireScriptFunction = getCustomFunction(require.string);
      return func(ctx, blockPayload, varCtxID);
    }
    case "RequireCustom": {
      return doRequireCustom(
        ctx,
        blockPayload,
        require,
        require.customID,
        varCtxID
      );
    }
    default:
      console.log(`not support yet: ${require.id}`);
      return ctx;
  }
}

export function doFeedback(
  ctx: GameContext,
  blockPayload: BlockPayload,
  feedback: Feedback,
  varCtxID: string
): GameContext {
  switch (feedback.id) {
    case "FeedbackAction": {
      const actions = feedback.action;
      if (actions.length) {
        const targets = ctx.varsPool[varCtxID]?.targets || {};
        return actions.reduce((originGameCtx, action) => {
          return doActionTarget(
            originGameCtx,
            blockPayload,
            targets,
            action,
            varCtxID
          );
        }, ctx);
      }
      return ctx;
    }
    case "FeedbackTargetAction": {
      const actions = feedback.action;
      const targets = feedback.targets;
      if (actions.length) {
        return actions.reduce((originGameCtx, action) => {
          return doActionTarget(
            originGameCtx,
            blockPayload,
            targets,
            action,
            varCtxID
          );
        }, ctx);
      }
      return ctx;
    }
  }
}
