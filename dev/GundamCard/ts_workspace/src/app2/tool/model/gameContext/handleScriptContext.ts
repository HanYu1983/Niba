import {
  CardColor,
  BaSyou,
  CardCategory,
  TextCategory,
  SiYouTiming,
  TargetType,
  Timing,
  TIMEING_CHART,
  PlayerA,
  getBaShouID,
} from "../basic";
import {
  BlockPayload,
  Feedback,
  Require,
  RequireCustom,
  RequireTarget,
} from "../blockPayload";
import {
  BlockContext,
  mapBlock,
  next,
  Block,
  addBlock,
} from "../scriptContext/blockContext";
import { Condition } from "../blockPayload/condition";
import { Action } from "../blockPayload/action";
import {
  ScriptContext,
  mapVarContext,
  mapBlockPayloadRequire,
  DEFAULT_SCRIPT_CONTEXT,
} from "../scriptContext";
import {
  DEFAULT_TABLE,
  getTopCards,
  mapCard,
  moveCard,
  Table,
} from "../../../../tool/table";
import { GameContext } from "./gameContext";
import { doConditionTarget } from "./doConditionTarget";
import { doActionTarget } from "./doActionTarget";
import { doRequireCustom } from "./doRequireCustom";

export function doCondition(
  gameCtx: GameContext,
  block: Block,
  blockPayload: BlockPayload,
  require: RequireTarget,
  condition: Condition
): string | null {
  try {
    const results = require.targets.map((target, i) => {
      if (target == null) {
        throw new Error(
          `block(${block.id}) require(${require.key}) 你必須完成第${i}個target`
        );
      }
      return doConditionTarget(gameCtx, block, blockPayload, target, condition);
    });

    const reasons = results
      .map((reason, i) => {
        if (reason == null) {
          return reason;
        }
        return `第${i}選擇錯誤:${reason}`;
      })
      .filter((reason) => reason);

    if (reasons.length) {
      return reasons.join(".");
    }
    return null;
  } catch (e: any) {
    if (e instanceof Error) {
      return e.message;
    }
    return JSON.stringify(e);
  }
}

export function doAction(
  gameCtx: GameContext,
  block: Block,
  blockPayload: BlockPayload,
  require: RequireTarget,
  action: Action,
  varCtxID: string
): GameContext {
  switch (action.id) {
    case "ActionSetTarget": {
      const targetID = action.targetID;
      const targets = require.targets;
      return {
        ...gameCtx,
        scriptContext: mapVarContext(
          gameCtx.scriptContext,
          varCtxID,
          (varCtx) => {
            return {
              ...varCtx,
              vars: {
                ...varCtx.vars,
                [targetID]: targets,
              },
            };
          }
        ),
      };
    }
    default:
      return doActionTarget(
        gameCtx,
        block,
        blockPayload,
        require.targets,
        action,
        varCtxID
      );
  }
}

export function doRequire(
  gameCtx: GameContext,
  block: Block,
  blockPayload: BlockPayload,
  require: Require,
  varCtxID: string
): GameContext {
  switch (require.id) {
    case "RequireAnd": {
      return require.and.reduce((originGameCtx, r) => {
        return doRequire(originGameCtx, block, blockPayload, r, varCtxID);
      }, gameCtx);
    }
    case "RequireOr": {
      const results = require.or.map((r): [string | null, GameContext] => {
        try {
          return [null, doRequire(gameCtx, block, blockPayload, r, varCtxID)];
        } catch (e) {
          return [JSON.stringify(e), gameCtx];
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
      return gameCtx;
    }
    case "RequireTarget": {
      if (require.condition) {
        const reason = doCondition(
          gameCtx,
          block,
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
            block,
            blockPayload,
            require,
            action,
            varCtxID
          );
        }, gameCtx);
      }
      return gameCtx;
    }
    case "RequireCustom": {
      return doRequireCustom(
        gameCtx,
        block,
        blockPayload,
        require,
        require.customID,
        varCtxID
      );
    }
    default:
      console.log(`not support yet: ${require.id}`);
      return gameCtx;
  }
}

export function doBlockRequire(
  gameCtx: GameContext,
  blockID: string
): GameContext {
  const block = gameCtx.scriptContext.blockContext.blocks.find(
    (block) => block.id == blockID
  );
  if (block == null) {
    throw new Error(`block(${blockID}) not found`);
  }
  const payload = block.payload;
  if (payload.requirePassed) {
    throw new Error("已經處理了require");
  }
  const varCtxID = payload.contextID || block.id;
  if (payload.require) {
    gameCtx = doRequire(gameCtx, block, payload, payload.require, varCtxID);
  }
  const nextBlockContext = mapBlock(
    gameCtx.scriptContext.blockContext,
    (block) => {
      if (block.id != blockID) {
        return block;
      }
      const nextPayload: BlockPayload = {
        ...payload,
        requirePassed: true,
      };
      return {
        ...block,
        payload: nextPayload,
      };
    }
  );

  gameCtx = {
    ...gameCtx,
    scriptContext: {
      ...gameCtx.scriptContext,
      blockContext: nextBlockContext,
    },
  };

  return gameCtx;
}

export function doFeedback(
  gameCtx: GameContext,
  block: Block,
  blockPayload: BlockPayload,
  feedback: Feedback,
  varCtxID: string
): GameContext {
  switch (feedback.id) {
    case "FeedbackAddBlock": {
      const payload: BlockPayload = {
        ...feedback.block,
        contextID: blockPayload.contextID,
      };
      return {
        ...gameCtx,
        scriptContext: {
          ...gameCtx.scriptContext,
          blockContext: addBlock(gameCtx.scriptContext.blockContext, payload),
        },
      };
    }
    case "FeedbackAction": {
      const actions = feedback.action;
      if (actions.length) {
        return actions.reduce((originGameCtx, action) => {
          return doActionTarget(
            originGameCtx,
            block,
            blockPayload,
            null,
            action,
            varCtxID
          );
        }, gameCtx);
      }
      return gameCtx;
    }
    case "FeedbackTargetAction": {
      const actions = feedback.action;
      const targets: (TargetType | null)[] =
        gameCtx.scriptContext.varContextPool[varCtxID]?.vars[
          feedback.targetID
        ] || null;
      if (targets == null) {
        throw new Error(`targetID ${feedback.targetID} is null`);
      }
      if (actions.length) {
        return actions.reduce((originGameCtx, action) => {
          return doActionTarget(
            originGameCtx,
            block,
            blockPayload,
            targets,
            action,
            varCtxID
          );
        }, gameCtx);
      }
      return gameCtx;
    }
  }
  return gameCtx;
}

export function doBlockFeedback(
  gameCtx: GameContext,
  blockID: string
): GameContext {
  const block = gameCtx.scriptContext.blockContext.blocks.find(
    (block) => block.id == blockID
  );
  if (block == null) {
    throw new Error(`block(${blockID}) not found`);
  }
  const payload: BlockPayload = block.payload;
  if (payload.feedbackPassed) {
    throw new Error("已經處理了feedback");
  }
  const varCtxID = payload.contextID || block.id;
  if (payload.feedback?.length) {
    gameCtx = payload.feedback.reduce((originGameCtx, feedback) => {
      return doFeedback(originGameCtx, block, payload, feedback, varCtxID);
    }, gameCtx);
  }
  const nextBlockContext = mapBlock(
    gameCtx.scriptContext.blockContext,
    (block) => {
      if (block.id != blockID) {
        return block;
      }
      const nextPayload: BlockPayload = {
        ...payload,
        feedbackPassed: true,
      };
      return {
        ...block,
        payload: nextPayload,
      };
    }
  );
  gameCtx = {
    ...gameCtx,
    scriptContext: {
      ...gameCtx.scriptContext,
      blockContext: nextBlockContext,
    },
  };

  return gameCtx;
}

export function setRequireAnswer(
  gameCtx: GameContext,
  requireID: string,
  answer: boolean
): GameContext {
  const nextScriptCtx = mapBlockPayloadRequire(
    gameCtx.scriptContext,
    (require) => {
      if (require.key == null) {
        return require;
      }
      if (require.key != requireID) {
        return require;
      }
      if (require.id != "RequireYesNo") {
        return require;
      }
      return { ...require, answer: answer };
    }
  );
  return {
    ...gameCtx,
    scriptContext: nextScriptCtx,
  };
}

export function setRequireTarget(
  gameCtx: GameContext,
  requireID: string,
  i: number,
  value: TargetType
): GameContext {
  const nextScriptCtx = mapBlockPayloadRequire(
    gameCtx.scriptContext,
    (require) => {
      if (require.key == null) {
        return require;
      }
      if (require.key != requireID) {
        return require;
      }
      if (require.id != "RequireTarget") {
        return require;
      }
      const nextTargets = require.targets.map((target, _i) => {
        if (i != _i) {
          return target;
        }
        return value;
      });
      return { ...require, targets: nextTargets };
    }
  );
  return {
    ...gameCtx,
    scriptContext: nextScriptCtx,
  };
}
