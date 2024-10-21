import { count } from "console"
import { AbsoluteBaSyouFn } from "../define/BaSyou"
import { PlayerID } from "../define/PlayerID"
import { StrBaSyouPair } from "../define/Tip"
import { doItemMove } from "./doItemMove"
import { GameState } from "./GameState"
import { getItemIdsByBasyou } from "./ItemTableComponent"
import { GameExtParams } from "../define/GameExtParams"

export function doPlayerDrawCard(ctx: GameState, count: number, playerId: PlayerID, options: GameExtParams): GameState {
  const fromBasyou = AbsoluteBaSyouFn.of(playerId, "本国")
  const pairs = getItemIdsByBasyou(ctx, fromBasyou).slice(0, count).map(cardId => {
    return [cardId, fromBasyou] as StrBaSyouPair
  })
  for (const pair of pairs) {
    ctx = doItemMove(ctx, AbsoluteBaSyouFn.of(playerId, "手札"), pair, options) as GameState
  }
  return ctx
}