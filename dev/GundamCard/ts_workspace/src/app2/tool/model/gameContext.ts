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
} from "./basic";
import { BlockPayload, Feedback, Require, RequireTarget } from "./blockPayload";
import {
  BlockContext,
  mapBlock,
  next,
  Block,
  addBlock,
} from "./scriptContext/blockContext";
import { Condition } from "./blockPayload/condition";
import { Action } from "./blockPayload/action";
import {
  ScriptContext,
  mapVarContext,
  mapBlockPayloadRequire,
  DEFAULT_SCRIPT_CONTEXT,
} from "./scriptContext";
import { DEFAULT_TABLE, Table } from "../../../tool/table";

export type PlayerState = {
  turn: number;
  playGCount: number;
  confirmPhase: boolean;
};

export type CardState = {
  playerID: string;
  live: number;
  destroy: boolean;
  setGroupID: string;
  memory: any;
};

export type GameState = {
  table: Table;
  cardState: { [key: string]: CardState | undefined };
  phase: Timing;
  playerState: { [key: string]: PlayerState | undefined };
  activePlayerID: string | null;
};

export type GameContext = {
  gameState: GameState;
  scriptContext: ScriptContext;
};

export const DEFAULT_GAME_CONTEXT: GameContext = {
  gameState: {
    table: DEFAULT_TABLE,
    cardState: {},
    phase: TIMEING_CHART[0],
    playerState: {},
    activePlayerID: null,
  },
  scriptContext: DEFAULT_SCRIPT_CONTEXT,
};

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
        throw new Error(`你必須完成第${i}個target`);
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

export function doActionTarget(
  gameCtx: GameContext,
  block: Block,
  blockPayload: BlockPayload,
  targets: (TargetType | null)[] | null,
  action: Action,
  varCtxID: string
): GameContext {
  switch (action.id) {
    case "ActionRoll":
      {
        const thisCardID = blockPayload.cause?.cardID;
        if (thisCardID == null) {
          throw new Error(`${thisCardID} not found`);
        }
      }
      break;
    case "ActionDraw":
      break;
  }
  return gameCtx;
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
