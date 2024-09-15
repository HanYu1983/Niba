import { assoc, pair } from "ramda";
import { DEFAULT_TABLE, Table, TableFns } from "../../tool/table";
import { AbsoluteBaSyou, AbsoluteBaSyouFn, BaSyou } from "../define/BaSyou";
import { PlayerID, PlayerIDFn } from "../define/PlayerID";
import { CardTableComponent, getCard, getCardIds, getCardOwner, setCard } from "./CardTableComponent";
import { addCoins, CoinTableComponent, getCardIdByCoinId, getCoin, getCoinIds, getCoinOwner } from "./CoinTableComponent";
import { ChipTableComponent, getChip, getChipIds, getChipOwner, getChipPrototype, setChip } from "./ChipTableComponent";
import { Coin } from "../define/Coin";
import { StrBaSyouPair } from "../define/Tip";
import { getSetGroupCards, SetGroupComponent } from "./SetGroupComponent";
import { TargetMissingError } from "../define/GameError";
import { CardPrototype } from "../define/CardPrototype";
import { getPrototype } from "../../script";
import { Card, CardFn } from "../define/Card";
import { Chip, ChipFn } from "../define/Chip";
import { CardStateFn, getCardState, setCardState } from "./CardStateComponent";

export type Item = Card | Coin | Chip;

export type ItemTableComponent = CardTableComponent & CoinTableComponent & ChipTableComponent & SetGroupComponent

export function isCard(ctx: ItemTableComponent, id: string): boolean {
  return getCardIds(ctx).includes(id)
}

export function isChip(ctx: ItemTableComponent, id: string): boolean {
  return getChipIds(ctx).includes(id)
}

export function isCoin(ctx: ItemTableComponent, id: string): boolean {
  return getCoinIds(ctx).includes(id)
}

export function getItem(ctx: ItemTableComponent, id: string): Item {
  if (isCard(ctx, id)) {
    return getCard(ctx, id)
  }
  if (isChip(ctx, id)) {
    return getChip(ctx, id)
  }
  if (isCoin(ctx, id)) {
    return getCoin(ctx, id)
  }
  throw new Error(`item id not found in itemTable: ${id}`)
}

export function getItemIds(ctx: ItemTableComponent): string[] {
  return [
    ...Object.keys(ctx.cards),
    ...Object.keys(ctx.chips),
    ...Object.keys(ctx.coins)
  ]
}

export function getItemIdsByBasyou(ctx: CardTableComponent, basyou: AbsoluteBaSyou): string[] {
  return TableFns.getCardsByPosition(ctx.table, AbsoluteBaSyouFn.toString(basyou))
}

export function getItemController(ctx: ItemTableComponent, id: string): PlayerID {
  if (isCard(ctx, id) || isChip(ctx, id)) {
    const baSyou = getItemBaSyou(ctx, id);
    return baSyou.value[0];
  }
  if (isCoin(ctx, id)) {
    const baSyou = getItemBaSyou(ctx, getCardIdByCoinId(ctx, id));
    return baSyou.value[0];
  }
  throw new Error(`unknown item: ${id}`)
}

export function getItemOwner(ctx: ItemTableComponent, id: string): PlayerID {
  if (isCard(ctx, id)) {
    return getCardOwner(ctx, id)
  }
  if (isChip(ctx, id)) {
    return getChipOwner(ctx, id)
  }
  if (isCoin(ctx, id)) {
    return getCoinOwner(ctx, id)
  }
  throw new Error(`unknown item: ${id}`)
}

export function getItemBaSyou(
  ctx: ItemTableComponent,
  id: string
): AbsoluteBaSyou {
  if (isCard(ctx, id) || isChip(ctx, id)) {
    const cardPosition = TableFns.getCardPosition(ctx.table, id);
    if (cardPosition == null) {
      throw new Error("[getController] cardPosition not found");
    }
    return AbsoluteBaSyouFn.fromString(cardPosition);
  }
  if (isCoin(ctx, id)) {
    throw new Error(`coin no basyou`)
  }
  throw new Error(`unknown item: ${id}`)
}

export type OnMoveItemFn = (ctx: ItemTableComponent, to: AbsoluteBaSyou, sb: StrBaSyouPair) => ItemTableComponent;

export function moveItem(ctx: ItemTableComponent, to: AbsoluteBaSyou, sb: StrBaSyouPair, onFn?: OnMoveItemFn): ItemTableComponent {
  const [itemId, originBasyou] = sb
  if (isCard(ctx, itemId) && isChip(ctx, itemId)) {
    const nowBasyou = getItemBaSyou(ctx, itemId)
    if (AbsoluteBaSyouFn.eq(nowBasyou, originBasyou) == false) {
      throw new TargetMissingError(`target missing: ${itemId} from ${originBasyou}`)
    }
    const itemIds = getSetGroupCards(ctx, itemId)
    const table = itemIds.reduce((table, itemId) => {
      return TableFns.moveCard(table, AbsoluteBaSyouFn.toString(nowBasyou), AbsoluteBaSyouFn.toString(to), itemId)
    }, ctx.table)
    ctx = {
      ...ctx,
      table: table
    }
    if (onFn) {
      ctx = onFn(ctx, to, sb)
    }
    return ctx
  }
  if (isChip(ctx, itemId)) {
    throw new Error(`chip can not move: ${itemId}`)
  }
  throw new Error(`unknown item: ${itemId}`)
}

export function setItemIsRoll(ctx: ItemTableComponent, isRoll: boolean, [itemId, originBasyou]: StrBaSyouPair): ItemTableComponent {
  if (isCard(ctx, itemId)) {
    const nowBasyou = getItemBaSyou(ctx, itemId)
    if (AbsoluteBaSyouFn.eq(nowBasyou, originBasyou) == false) {
      throw new TargetMissingError(`target missing: ${itemId} from ${originBasyou}`)
    }
    const itemIds = getSetGroupCards(ctx, itemId)
    ctx = itemIds.reduce((ctx, itemId) => {
      if (isCard(ctx, itemId)) {
        let item = getCard(ctx, itemId)
        item = CardFn.setIsRoll(item, isRoll)
        ctx = setCard(ctx, itemId, item) as ItemTableComponent
        return ctx
      }
      if (isChip(ctx, itemId)) {
        let item = getChip(ctx, itemId)
        item = ChipFn.setIsRoll(item, isRoll)
        ctx = setChip(ctx, itemId, item) as ItemTableComponent
        return ctx
      }
      return ctx
    }, ctx)
    return ctx
  }
  if (isChip(ctx, itemId)) {
    const nowBasyou = getItemBaSyou(ctx, itemId)
    if (AbsoluteBaSyouFn.eq(nowBasyou, originBasyou) == false) {
      throw new TargetMissingError(`target missing: ${itemId} from ${originBasyou}`)
    }
    let item = getChip(ctx, itemId)
    item = ChipFn.setIsRoll(item, isRoll)
    ctx = setChip(ctx, itemId, item) as ItemTableComponent
    return ctx
  }
  throw new Error(`unknown item: ${itemId}`)
}

export function addCoinsToCard(ctx: ItemTableComponent, target: StrBaSyouPair, coins: Coin[]): ItemTableComponent {
  const [targetItemId, targetOriginBasyou] = target
  if (isCard(ctx, targetItemId)) {
    const nowBasyou = getItemBaSyou(ctx, targetItemId)
    if (AbsoluteBaSyouFn.eq(targetOriginBasyou, nowBasyou)) {
      throw new TargetMissingError("basyou not same")
    }
    ctx = addCoins(ctx, targetItemId, coins) as ItemTableComponent
    return ctx
  }
  throw new Error(`unknown item: ${targetItemId}`)
}


export function getAbsoluteBaSyou(
  ctx: ItemTableComponent,
  itemId: string,
  baSyou: BaSyou
): AbsoluteBaSyou {
  if (baSyou.id == "AbsoluteBaSyou") {
    return baSyou;
  }
  const _playerID = (() => {
    switch (baSyou.value[0]) {
      case "持ち主": {
        return getItemOwner(ctx, itemId)
      }
      case "自軍":
        return getItemController(ctx, itemId)
      case "敵軍":
        return PlayerIDFn.getOpponent(getItemController(ctx, itemId));
    }
  })();
  return AbsoluteBaSyouFn.of(_playerID, baSyou.value[1])
}

export function getItemPrototype(ctx: ItemTableComponent, itemId: string): CardPrototype {
  if (isCard(ctx, itemId)) {
    return getPrototype(getCard(ctx, itemId).protoID || "unknown")
  }
  if (isChip(ctx, itemId)) {
    return getChipPrototype(ctx, getChip(ctx, itemId).protoID || "unknown")
  }
  if (isCoin(ctx, itemId)) {
    throw new Error(`coin no prototype: ${itemId}`)
  }
  throw new Error(`unknown item: ${itemId}`)
}