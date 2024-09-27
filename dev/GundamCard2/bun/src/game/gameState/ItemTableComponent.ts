import { assoc, lift, pair } from "ramda";
import { DEFAULT_TABLE, Table, TableFns } from "../../tool/table";
import { AbsoluteBaSyou, AbsoluteBaSyouFn, BaSyou, BaSyouKeywordFn } from "../define/BaSyou";
import { PlayerID, PlayerIDFn } from "../define/PlayerID";
import { CardTableComponent, getCard, getCardIds, getCardOwner, setCard } from "./CardTableComponent";
import { addCoins, CoinTableComponent, getCardIdByCoinId, getCoin, getCoinIds, getCoinOwner } from "./CoinTableComponent";
import { ChipTableComponent, getChip, getChipIds, getChipOwner, getChipPrototype, setChip } from "./ChipTableComponent";
import { Coin } from "../define/Coin";
import { StrBaSyouPair } from "../define/Tip";
import { getSetGroupChildren, SetGroupComponent } from "./SetGroupComponent";
import { TargetMissingError } from "../define/GameError";
import { CardPrototype } from "../define/CardPrototype";
import { getPrototype } from "../../script";
import { Card, CardFn } from "../define/Card";
import { Chip, ChipFn } from "../define/Chip";
import { GlobalEffect } from "../define/GlobalEffect";
import { getItemState } from "./ItemStateComponent";
import { logCategory } from "../../tool/logger";
import { GameState } from "./GameState";
import { getGlobalEffects } from "./globalEffects";
import { EventCenterFn } from "./EventCenter";
import { doItemMove } from "./doItemMove";

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

export function isCardLike(ctx: ItemTableComponent): (itemId: string) => boolean {
  return (itemId: string): boolean => {
    return isCard(ctx, itemId) || isChip(ctx, itemId)
  }
}

export function addCoinsToCard(ctx: ItemTableComponent, target: StrBaSyouPair, coins: Coin[]): ItemTableComponent {
  assertTargetMissingError(ctx, target)
  const [targetItemId, targetOriginBasyou] = target
  if (isCard(ctx, targetItemId)) {
    ctx = addCoins(ctx, targetItemId, coins) as ItemTableComponent
    return ctx
  }
  throw new Error(`addCoinsToCard unknown item: ${targetItemId}`)
}

export function shuffleItems(ctx: ItemTableComponent, basyou: AbsoluteBaSyou): ItemTableComponent {
  const oldTable = ctx.table
  ctx = {
    ...ctx,
    table: TableFns.shuffleCards(ctx.table, AbsoluteBaSyouFn.toString(basyou))
  }
  ctx = EventCenterFn.onTableChange(ctx, oldTable, ctx.table)
  return ctx
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

export function getCardLikeItemIds(ctx: ItemTableComponent): string[] {
  return [
    ...Object.keys(ctx.cards),
    ...Object.keys(ctx.chips)
  ]
}

export function getItemIdsByPlayerId(ctx: ItemTableComponent, isBa: boolean, playerId: PlayerID): string[] {
  const basyous = isBa ? lift(AbsoluteBaSyouFn.of)([playerId], BaSyouKeywordFn.getBaAll()) : lift(AbsoluteBaSyouFn.of)([playerId], BaSyouKeywordFn.getScriptAll())
  return basyous.flatMap(basyou => getItemIdsByBasyou(ctx, basyou))
}

export function getItemIdsByBasyou(ctx: ItemTableComponent, basyou: AbsoluteBaSyou): string[] {
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
  throw new Error(`getItemController unknown item: ${id}`)
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
  throw new Error(`getItemOwner unknown item: ${id}`)
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
  throw new Error(`getItemBaSyou unknown item: ${id}`)
}

export function createStrBaSyouPair(
  ctx: ItemTableComponent,
  id: string
): StrBaSyouPair {
  return [id, getItemBaSyou(ctx, id)]
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
  throw new Error(`getItemPrototype unknown item: ${itemId}`)
}

export function getAbsoluteBaSyouFromBaSyou(
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

export function assertTargetMissingError(ctx: ItemTableComponent, [itemId, originBasyou]: StrBaSyouPair) {
  if (isCard(ctx, itemId) || isChip(ctx, itemId)) {
    const nowBasyou = getItemBaSyou(ctx, itemId)
    if (AbsoluteBaSyouFn.eq(nowBasyou, originBasyou) == false) {
      throw new TargetMissingError(`assertTargetMissingError: ${itemId} from ${AbsoluteBaSyouFn.toString(originBasyou)} now ${AbsoluteBaSyouFn.toString(nowBasyou)}`)
    }
  } else if (isCoin(ctx, itemId)) {
    throw new Error(`coin not support`)
  } else {
    throw new Error(`unknown cardId type ${itemId}`)
  }
}