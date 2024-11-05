import { TableFns } from "../../tool/table";
import { Coin } from "../define/Coin";
import { Effect } from "../define/Effect";
import { GameExtParams } from "../define/GameExtParams";
import { StrBaSyouPair } from "../define/Tip";
import { assertTargetMissingError, assertTargetNoLongerValid } from "./assertTargetMissingError";
import { getCard, mapCard, setCard } from "./CardTableComponent";
import { GameState } from "./GameState";
import { addCoinsToCard, isCard } from "./ItemTableComponent";

export function doItemAddCoin(ctx: GameState, effect: Effect, target: StrBaSyouPair, coins: Coin[], options: GameExtParams): GameState {
    assertTargetMissingError(ctx, effect, target, options)
    return addCoinsToCard(ctx, target[0], coins) as GameState
}