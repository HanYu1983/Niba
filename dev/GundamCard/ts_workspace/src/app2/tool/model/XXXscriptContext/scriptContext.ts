// import {
//   BlockContext,
//   mapBlock,
//   next,
//   Block,
//   DEFAULT_BLOCK_CONTEXT,
// } from "./blockContext";
// import {
//   Require,
//   BlockPayload,
//   RequireOr,
//   RequireAnd,
// } from "../basic/blockPayload";
// import { TargetType } from "../basic";

// type VarContextType = {
//   vars: { [key: string]: TargetType };
// };

// const DEFAULT_VAR_CONTEXT: VarContextType = {
//   vars: {},
// };

// type ScriptContext = {
//   blockContext: BlockContext;
//   varContextPool: { [key: string]: VarContextType };
// };

// const DEFAULT_SCRIPT_CONTEXT: ScriptContext = {
//   blockContext: DEFAULT_BLOCK_CONTEXT,
//   varContextPool: {},
// };

// function mapVarContext(
//   ctx: ScriptContext,
//   varCtxID: string,
//   mapF: (varCtx: VarContextType) => VarContextType
// ): ScriptContext {
//   return {
//     ...ctx,
//     varContextPool: {
//       ...ctx.varContextPool,
//       [varCtxID]: mapF(ctx.varContextPool[varCtxID] || DEFAULT_VAR_CONTEXT),
//     },
//   };
// }

// // function mapBlockPayloadRequire(
// //   ctx: ScriptContext,
// //   mapF: (require: Require) => Require
// // ): ScriptContext {
// //   const nextBlocks = ctx.blockContext.blocks.map((block): Block => {
// //     const payload: BlockPayload = block.payload;
// //     if (payload.require) {
// //       const nextRequire = recurRequire(payload.require, mapF);
// //       return {
// //         ...block,
// //         payload: {
// //           ...payload,
// //           require: nextRequire,
// //         },
// //       };
// //     }
// //     return block;
// //   });
// //   return {
// //     ...ctx,
// //     blockContext: {
// //       ...ctx.blockContext,
// //       blocks: nextBlocks,
// //     },
// //   };
// // }
