import { BlockContext, mapBlock, next, Block } from "../../../tool/block";

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
