import { count } from "console"
import { AbsoluteBaSyouFn } from "../define/BaSyou"
import { PlayerID } from "../define/PlayerID"
import { StrBaSyouPair } from "../define/Tip"
import { doItemMove } from "./doItemMove"
import { GameState } from "./GameState"
import { getItemIdsByBasyou } from "./ItemTableComponent"
import { GameExtParams } from "../define/GameExtParams"
import { TargetMissingError } from "../define/GameError"
import { Effect, EffectFn } from "../define/Effect"

export function doPlayerDrawCard(ctx: GameState, effect: Effect, count: number, playerId: PlayerID, options: GameExtParams): GameState {
  const fromBasyou = AbsoluteBaSyouFn.of(playerId, "本国")
  const itemIds = getItemIdsByBasyou(ctx, fromBasyou)
  if (itemIds.length == 0) {
    throw new TargetMissingError(`本國的牌不夠抽, 你想抽${count}張, 但剩下${itemIds.length}張`)
  }
  const pairs = itemIds.slice(0, count).map(cardId => {
    return [cardId, fromBasyou] as StrBaSyouPair
  })
  for (const pair of pairs) {
    ctx = doItemMove(ctx, effect, AbsoluteBaSyouFn.of(playerId, "手札"), pair, options) as GameState
  }
  return ctx
}