import { pipe, always, map, concat, reduce, flatten } from "ramda"
import { createBridge } from "../bridge/createBridge"
import { CardText } from "../define/CardText"
import { Effect, EffectFn } from "../define/Effect"
import { GameEvent } from "../define/GameEvent"
import { ToolFn } from "../tool"
import { getCardTexts } from "./card"
import { getCard, getCardIds } from "./CardTableComponent"
import { GameState } from "./GameState"
import { getCardLikeItemIds, getItem, getItemController, getItemIdsByBasyou, getItemPrototype, isCard, isChip, Item } from "./ItemTableComponent"
import { ItemStateFn } from "../define/ItemState"
import { PhaseFn } from "../define/Timing"
import { getItemState, mapItemState, mapItemStateValues, setItemState } from "./ItemStateComponent"
import { createTextsFromSpecialEffect } from "./createTextsFromSpecialEffect"
import { logCategory } from "../../tool/logger"
import { mapPlayerState } from "./PlayerStateComponent"
import { PlayerStateFn } from "../define/PlayerState"
import { getActivePlayerID } from "./ActivePlayerComponent"
import { AbsoluteBaSyouFn, BaSyouKeywordFn } from "../define/BaSyou"
import { createOnEventTitleFn } from "./createOnEventTitleFn"
import { EventCenterFn } from "./EventCenter"
import { PlayerA, PlayerB } from "../define/PlayerID"
import { createAllCardTexts } from "./globalEffects"
import { addImmediateEffect } from "./EffectStackComponent"
import { createAttackPhaseRuleEffect } from "./createAttackPhaseRuleEffect"

// 觸發事件腳本
// 在每次事件發生時都要呼叫
// 起動型技能
export function doTriggerEvent(
    ctx: GameState,
    event: GameEvent
): GameState {
    logCategory("doTriggerEvent", event.title, event.cardIds)
    const bridge = createBridge()
    createAllCardTexts(ctx, null).forEach(info => {
        const [item, texts] = info
        texts.forEach(text => {
            const effect: Effect = {
                id: `doTriggerEvent_${item.id}_${text.id}`,
                reason: ["Event", getItemController(ctx, item.id), item.id, event],
                text: text
            }
            ctx = createOnEventTitleFn(text)(ctx, effect, bridge)
        })
    })
    if (event.title[0] == "カット終了時") {
        ctx = mapItemStateValues(ctx, cs => {
            return ItemStateFn.onCutEnd(cs)
        }) as GameState
    }
    if (event.title[0] == "GameEventOnTiming") {
        const onPhase = event.title[1]
        if (onPhase[0] == "戦闘フェイズ" && onPhase[1] == "ターン終了時") {
            switch (onPhase[2]) {
                case "ダメージリセット":
                    // p41
                    // 1 ・ ダ メ ー ジ の リ セ ッ ト
                    // ユ ニ ッ ト に 蓄 積 さ れ て い る 全 て ダ メ ー ジ が 0 に な り ま す 。
                    // 戦 間 エ リ ア に ユ ニ ッ ト が い る 場 合 、 そ の ユ ニ ッ ト は 取 り 除 か れ ま す 。 こ の 処 理
                    // は 、 カ ー ド の 効 果 な ど で 無 効 に す る 事 が で き ま せ ん 。
                    ctx = mapItemStateValues(ctx, cs => {
                        return ItemStateFn.onDamageReset(cs)
                    }) as GameState
                    break
                case "効果解決":
                // 2 ・ タ ー ン 終 了 時 に 起 動 す る 効 果 の 適 ⽤
                // タ ー ン 終 了 時 に 起 動 す る 効 果 を 適 ⽤ し ま す 。 複 数 発 ⽣ し て い る 場 合 は 、
                // 攻 撃 側 が 適 ⽤ す る 順 番 を 決 定 し ま す 。
                case "手札調整":
                    // 3 • ⼿ 札 の 調 整
                    // 攻 撃 側 は 、 「 ⼿ 札 の 調 整 」 を ⾏ い ま す 。 ⼿ 札 の 上 限 枚 数 を 超 え て い る 分 の ⾃ 軍
                    // ⼿ 札 を 選 ん で 廃 棄 し ま す 。 通 常 、 ⼿ 札 の 上 限 枚 数 は 6 枚 で す 。
                    // 防 衛 側 は 「 ⼿ 札 の 調 整 」 を ⾏ い ま せ ん 。
                    break
                case "効果終了。ターン終了": {
                    // 4 ・ タ ー ン 終 了 時 ま で 有 効 な 効 果 の 終 了
                    // 「 タ ー ン 終 了 時 ま で ～ す る 」 な ど 、 タ ー ン 終 了 時 ま で 有 効 な 効 果 が 終 了 し ま す
                    ctx = mapItemStateValues(ctx, cs => {
                        return ItemStateFn.onTurnEnd(cs)
                    }) as GameState
                    const activePlayerId = getActivePlayerID(ctx)
                    ctx = mapPlayerState(ctx, activePlayerId, ps => {
                        return PlayerStateFn.onTurnEnd(ps)
                    }) as GameState
                    break
                }
            }
        }
    }
    ctx = EventCenterFn.onEvent(ctx, event)
    return ctx
}