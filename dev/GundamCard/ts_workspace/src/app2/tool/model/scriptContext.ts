import {
  BlockContext,
  mapBlock,
  next,
  Block,
  DEFAULT_BLOCK_CONTEXT,
} from "../../../tool/block";
import { Require, BlockPayload, RequireOr, RequireAnd } from "./blockPayload";

export type VarContextType = {
  vars: { [key: string]: any };
};

const DEFAULT_VAR_CONTEXT: VarContextType = {
  vars: {},
};

export type ScriptContext = {
  blockContext: BlockContext;
  varContextPool: { [key: string]: VarContextType };
};

export const DEFAULT_SCRIPT_CONTEXT: ScriptContext = {
  blockContext: DEFAULT_BLOCK_CONTEXT,
  varContextPool: {},
};

export function mapVarContext(
  ctx: ScriptContext,
  varCtxID: string,
  mapF: (varCtx: VarContextType) => VarContextType
): ScriptContext {
  return {
    ...ctx,
    varContextPool: {
      ...ctx.varContextPool,
      [varCtxID]: mapF(ctx.varContextPool[varCtxID] || DEFAULT_VAR_CONTEXT),
    },
  };
}

function recurRequire(
  require: Require,
  mapF: (require: Require) => Require
): Require {
  switch (require.id) {
    case "RequireAnd": {
      const nextRequires = require.and.map((require) => {
        return recurRequire(require, mapF);
      });
      const nextAnd: RequireAnd = {
        ...require,
        and: nextRequires,
      };
      return nextAnd;
    }
    case "RequireOr": {
      const nextRequires = require.or.map((require) => {
        return recurRequire(require, mapF);
      });
      const nextOr: RequireOr = {
        ...require,
        or: nextRequires,
      };
      return nextOr;
    }
    default:
      return mapF(require);
  }
}

export function mapBlockPayloadRequire(
  ctx: ScriptContext,
  mapF: (require: Require) => Require
): ScriptContext {
  const nextBlocks = ctx.blockContext.blocks.map((block): Block => {
    const payload: BlockPayload = block.payload;
    if (payload.require) {
      const nextRequire = recurRequire(payload.require, mapF);
      return {
        ...block,
        payload: {
          ...payload,
          require: nextRequire,
        },
      };
    }
    return block;
  });
  return {
    ...ctx,
    blockContext: {
      ...ctx.blockContext,
      blocks: nextBlocks,
    },
  };
}
