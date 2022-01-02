export type Block = {
  id: string;
  payload: any;
  createdTime: number;
};

export type BlockContext = {
  blocks: Block[];
  time: number;
};

export function addBlock(ctx: BlockContext, block: Block): BlockContext {
  return {
    ...ctx,
    blocks: [
      {
        ...block,
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
  blockID: string,
  mapF: (block: Block) => Block
): BlockContext {
  const nextBlocks = ctx.blocks.map((block) => {
    if (block.id != blockID) {
      return block;
    }
    return mapF(block);
  });
  return {
    ...ctx,
    blocks: nextBlocks,
  };
}
