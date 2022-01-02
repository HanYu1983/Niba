export type Block = {
  id: string;
  payload: any;
  createdTime: number;
};

export type BlockContext = {
  idSeq: number;
  blocks: Block[];
  time: number;
};

export const DEFAULT_BLOCK_CONTEXT: BlockContext = {
  idSeq: 0,
  blocks: [],
  time: 0,
};

export function addBlock(ctx: BlockContext, payload: any): BlockContext {
  return {
    ...ctx,
    idSeq: ctx.idSeq + 1,
    blocks: [
      {
        id: `addBlock_${ctx.idSeq}`,
        payload: payload,
        createdTime: ctx.time,
      },
      ...ctx.blocks,
    ],
  };
}

export function next(ctx: BlockContext): BlockContext {
  return {
    ...ctx,
    time: ctx.time + 1,
  };
}

export function getTopBlocks(ctx: BlockContext): Block[] {
  if (ctx.blocks.length == 0) {
    return [];
  }
  const top = ctx.blocks[0];
  return ctx.blocks.filter((block) => block.createdTime == top.createdTime);
}

export function mapBlock(
  ctx: BlockContext,
  mapF: (block: Block) => Block
): BlockContext {
  const nextBlocks = ctx.blocks.map((block) => {
    return mapF(block);
  });
  return {
    ...ctx,
    blocks: nextBlocks,
  };
}
