// import { BlockPayload } from "../basic/blockPayload";

// type Block = {
//   id: string;
//   payload: BlockPayload;
//   createdTime: number;
// };

// type BlockContext = {
//   idSeq: number;
//   blocks: Block[];
//   time: number;
// };

// const DEFAULT_BLOCK_CONTEXT: BlockContext = {
//   idSeq: 0,
//   blocks: [],
//   time: 0,
// };

// function addBlock(ctx: BlockContext, payload: BlockPayload): BlockContext {
//   return {
//     ...ctx,
//     idSeq: ctx.idSeq + 1,
//     blocks: [
//       {
//         id: `addBlock_${ctx.idSeq}`,
//         payload: payload,
//         createdTime: ctx.time,
//       },
//       ...ctx.blocks,
//     ],
//   };
// }

// function next(ctx: BlockContext): BlockContext {
//   return {
//     ...ctx,
//     time: ctx.time + 1,
//   };
// }

// function getTopBlocks(ctx: BlockContext): Block[] {
//   if (ctx.blocks.length == 0) {
//     return [];
//   }
//   const top = ctx.blocks[0];
//   return ctx.blocks.filter((block) => block.createdTime == top.createdTime);
// }

// function mapBlock(
//   ctx: BlockContext,
//   mapF: (block: Block) => Block
// ): BlockContext {
//   const nextBlocks = ctx.blocks.map((block) => {
//     return mapF(block);
//   });
//   return {
//     ...ctx,
//     blocks: nextBlocks,
//   };
// }
