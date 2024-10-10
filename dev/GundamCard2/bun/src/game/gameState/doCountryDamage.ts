import { AbsoluteBaSyouFn } from "../define/BaSyou"
import { EffectFn } from "../define/Effect"
import { GameEvent } from "../define/GameEvent"
import { PlayerID, PlayerIDFn } from "../define/PlayerID"
import { StrBaSyouPair } from "../define/Tip"
import { doItemMove } from "./doItemMove"
import { doTriggerEvent } from "./doTriggerEvent"
import { EventCenterFn } from "./EventCenter"
import { GameState } from "./GameState"
import { getItemController, getItemIdsByBasyou } from "./ItemTableComponent"

export function doCountryDamage(ctx: GameState, playerId: PlayerID, damage: number, options?: {}): GameState {
    if (damage == 0) {
        return ctx
    }
    if (damage < 0) {
        const from = AbsoluteBaSyouFn.of(playerId, "捨て山")
        const pairs = getItemIdsByBasyou(ctx, from).map(itemId => {
            return [itemId, from] as StrBaSyouPair
        }).slice(0, damage)
        const to = AbsoluteBaSyouFn.of(playerId, "本国")
        for (const pair of pairs) {
            ctx = doItemMove(ctx, to, pair, { isSkipTargetMissing: true })
        }
        return ctx
    }
    const from = AbsoluteBaSyouFn.of(playerId, "本国")
    const pairs = getItemIdsByBasyou(ctx, from).map(itemId => {
        return [itemId, from] as StrBaSyouPair
    }).slice(0, damage)
    const to = AbsoluteBaSyouFn.of(playerId, "捨て山")
    for (const pair of pairs) {
        ctx = doItemMove(ctx, to, pair, { isSkipTargetMissing: true })
    }
    ctx = doTriggerEvent(ctx, {
        title: ["自軍本国に戦闘ダメージが与えられた場合"],
        playerId: playerId
    })
    ctx = EventCenterFn.onCountryDamage(ctx, playerId, damage)
    return ctx
}