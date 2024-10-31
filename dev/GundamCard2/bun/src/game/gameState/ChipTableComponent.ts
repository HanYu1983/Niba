import { assoc } from "ramda";
import { DEFAULT_TABLE, Table, TableFns } from "../../tool/table";
import { AbsoluteBaSyou, AbsoluteBaSyouFn } from "../define/BaSyou";
import { CardPrototype } from "../define/CardPrototype";
import { PlayerID } from "../define/PlayerID";
import { Chip } from "../define/Chip";
import { EventCenterFn } from "./EventCenter";

export type ChipTableComponent = {
  table: Table
  chips: { [key: string]: Chip }
  chipProtos: { [key: string]: CardPrototype }
}

export const DEFAULT_CHIP_TABLE_COMPONENT: ChipTableComponent = {
  table: DEFAULT_TABLE,
  chips: {},
  chipProtos: {}
}

export function getChip(ctx: ChipTableComponent, chipId: string): Chip {
  if (ctx.chips[chipId] == null) {
    throw new Error("Chip not found")
  }
  return ctx.chips[chipId];
}

export function setChip(ctx: ChipTableComponent, id: string, card: Chip): ChipTableComponent {
  return {
    ...ctx,
    chips: {
      ...ctx.chips,
      [id]: card
    }
  }
}

export function getChipIds(ctx: ChipTableComponent): string[] {
  return Object.keys(ctx.chips);
}

export function getChips(ctx: ChipTableComponent): Chip[] {
  return Object.values(ctx.chips)
}

export function setChipPrototype(ctx: ChipTableComponent, k: string, v: CardPrototype): ChipTableComponent {
  return {
    ...ctx,
    chipProtos: assoc(k, v, ctx.chipProtos)
  }
}

export function getChipPrototype(ctx: ChipTableComponent, k: string): CardPrototype {
  if (ctx.chipProtos[k] == null) {
    throw new Error(`chipProto not found: ${k}`)
  }
  return ctx.chipProtos[k]
}

export function addChips(ctx: ChipTableComponent, basyou: AbsoluteBaSyou, addedChips: Chip[]): ChipTableComponent {
  const old = ctx.table
  ctx = addedChips.reduce((ctx, newChip) => {
    ctx = {
      ...ctx,
      table: TableFns.addCard(ctx.table, AbsoluteBaSyouFn.toString(basyou), newChip.id),
      chips: {
        ...ctx.chips,
        [newChip.id]: newChip
      }
    }
    ctx = EventCenterFn.onItemAdd(ctx, basyou, newChip.id)
    return ctx
  }, ctx)
  ctx = EventCenterFn.onTableChange(ctx, old, ctx.table)
  return ctx
}

export function getChipOwner(ctx: ChipTableComponent, chipId: string): PlayerID {
  const Chip = getChip(ctx, chipId);
  if (Chip == null) {
    throw new Error("[getChipOwner] Chip not found");
  }
  if (Chip.ownerID == null) {
    throw new Error("[getChipOwner] Chip.ownerID not found");
  }
  return Chip.ownerID;
}