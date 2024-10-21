import { logCategory } from "../../tool/logger"
import { Table, TableFns } from "../../tool/table"
import { AbsoluteBaSyou, AbsoluteBaSyouFn, BaSyouKeyword, BaSyouKeywordFn } from "../define/BaSyou"
import { Card } from "../define/Card"
import { Action } from "../define/CardText"
import { Chip } from "../define/Chip"
import { CommandEffectTip } from "../define/CommandEffectTip"
import { Effect, EffectFn } from "../define/Effect"
import { TargetMissingError } from "../define/GameError"
import { GameEvent } from "../define/GameEvent"
import { GameExtParams } from "../define/GameExtParams"
import { ItemState, ItemStateFn } from "../define/ItemState"
import { PlayerID } from "../define/PlayerID"
import { PlayerState, PlayerStateFn } from "../define/PlayerState"
import { Phase } from "../define/Timing"
import { StrBaSyouPair } from "../define/Tip"
import { getActivePlayerID } from "./ActivePlayerComponent"
import { mapCard } from "./CardTableComponent"
import { removeCoinIds, getCoinIdsByCardId } from "./CoinTableComponent"
import { doTriggerEvent } from "./doTriggerEvent"
import { getCutInDestroyEffects, removeEffect } from "./EffectStackComponent"
import { GameState } from "./GameState"
import { updateGlobalEffects } from "./globalEffects"
import { clearHasCheck } from "./IsBattleComponent"
import { mapItemState, mapItemStateValues } from "./ItemStateComponent"
import { getItemIdsByBasyou, Item } from "./ItemTableComponent"
import { addMessage, getMessageCurrentEffect, setMessageCurrentEffect } from "./MessageComponent"
import { mapPlayerState } from "./PlayerStateComponent"
import { removeSetGroupParent } from "./SetGroupComponent"

function assertIsGameState(ctx: any) {
    if (ctx.isGameState != true) {
        throw new Error(`must is gameState`)
    }
}

export const EventCenterFn = {
    onTargetMessingError(ctx: any, effect: Effect, e: TargetMissingError): any {
        assertIsGameState(ctx)
        const msg = `對象遺失: ${e.message}:${effect.text.description}`
        ctx = addMessage(ctx, { id: 0, description: msg })
        console.warn(`=======================`)
        console.warn(msg)
        return ctx
    },
    onAddImmediateEffectButConditionFail(ctx: any, effect: Effect, cets: CommandEffectTip[]): any {
        assertIsGameState(ctx)
        const msg = `將發動起動效果但條件不足: ${cets.flatMap(cet => cet.tipOrErrors.flatMap(toe => toe.errors)).join("|")}: ${effect.text.description}`
        ctx = addMessage(ctx, { id: 0, description: msg })
        console.warn(`=======================`)
        console.warn(msg)
        return ctx
    },
    onAddImmediateEffect(ctx: any, effect: Effect): any {
        assertIsGameState(ctx)
        logCategory(`onAddImmediateEffect`, `${effect.description}`, effect)
        return ctx
    },
    onEvent(ctx: any, evt: GameEvent, options:GameExtParams): any {
        assertIsGameState(ctx)
        logCategory(`onEvent`, `${JSON.stringify(evt.title)} ${JSON.stringify(evt.cardIds)}`, evt.title, evt.cardIds)
        ctx = addMessage(ctx, { id: 0, description: `onEvent: ${evt.title[0]} ${JSON.stringify(evt.cardIds)}` })
        ctx = onEvent(ctx, evt, options)
        return ctx
    },
    onEffectStart(ctx: any, effect: Effect): any {
        assertIsGameState(ctx)
        logCategory(`onEffectStart`, `${effect.text.description}`)
        ctx = setMessageCurrentEffect(ctx, effect) as GameState
        ctx = addMessage(ctx, { id: 0, description: `onEffectStart: ${effect.text.description}` })
        return ctx
    },
    onEffectEnd(ctx: any, effect: Effect): any {
        assertIsGameState(ctx)
        logCategory(`onEffectEnd`, `${effect.text.description}`)
        ctx = setMessageCurrentEffect(ctx, null) as GameState
        ctx = addMessage(ctx, { id: 0, description: `onEffectEnd: ${effect.text.description}` })
        return ctx
    },
    onActionStart(ctx: any, effect: Effect, action: Action): any {
        assertIsGameState(ctx)
        logCategory(`onActionStart`, `${action.description}`)
        return ctx
    },
    onActionEnd(ctx: any, effect: Effect, action: Action): any {
        assertIsGameState(ctx)
        logCategory(`onActionEnd`, `${action.description}`)
        return ctx
    },
    onItemStateDestroyReasonChange(ctx: any, old: ItemState, curr: ItemState): any {
        assertIsGameState(ctx)
        if (old.destroyReason == null && curr.destroyReason) {
            logCategory("onItemStateDestroyReasonChange", `被破壞尚未進入堆疊:${curr.id}`)
            ctx = addMessage(ctx, { id: 0, description: `被破壞尚未進入堆疊:${curr.id}` })
        } else if (old.destroyReason && curr.destroyReason == null) {
            logCategory("onItemStateDestroyReasonChange", `破壞被取消:${curr.id}`)
            ctx = addMessage(ctx, { id: 0, description: `破壞被取消:${curr.id}` })
        }
        return ctx
    },
    onItemDamageChange(ctx: any, old: ItemState, curr: ItemState): any {
        assertIsGameState(ctx)
        const msg = `傷害變化: ${curr.id} ${old.damage} => ${curr.damage}`
        logCategory(`onItemDamageChange`, msg)
        ctx = addMessage(ctx, { id: 0, description: msg })
        return ctx
    },
    onItemStateChange(ctx: any, old: ItemState, curr: ItemState): any {
        assertIsGameState(ctx)
        if (old.destroyReason != curr.destroyReason) {
            ctx = EventCenterFn.onItemStateDestroyReasonChange(ctx, old, curr)
        }
        if (old.damage != curr.damage) {
            ctx = EventCenterFn.onItemDamageChange(ctx, old, curr)
        }
        let msg: string | null = null
        if (old.globalEffects.length != curr.globalEffects.length) {
            msg = `${curr.id}.globalEffects.length ${old.globalEffects.length} => ${curr.globalEffects.length}`
        }
        if (msg) {
            ctx = addMessage(ctx, { id: 0, description: msg })
            logCategory(`onItemStateChange`, msg)
        }
        return ctx
    },
    onCardChange(ctx: any, old: Card, curr: Card): any {
        assertIsGameState(ctx)
        let msg: string | null = null
        if (old.isFaceDown != curr.isFaceDown) {
            msg = `${curr.id}.isFaceDown ${old.isFaceDown} => ${curr.isFaceDown}`
        }
        if (old.isRoll != curr.isRoll) {
            msg = `${curr.id}.isRoll ${old.isRoll} => ${curr.isRoll}`
        }
        if (old.protoID != curr.protoID) {
            msg = `${curr.id}.protoID ${old.protoID} => ${curr.protoID}`
        }
        if (msg) {
            ctx = addMessage(ctx, { id: 0, description: msg })
            logCategory(`onCardChange`, msg)
        }
        return ctx
    },
    onPlayerStateChange(ctx: any, old: PlayerState, curr: PlayerState): any {
        assertIsGameState(ctx)
        ctx = addMessage(ctx, { id: 0, description: `onPlayerStateChange:${curr.id}` })
        return ctx
    },
    onSetSetGroupParent(ctx: any, parentId: string, itemId: string): any {
        assertIsGameState(ctx)
        ctx = addMessage(ctx, { id: 0, description: `onSetSetGroupParent:${parentId} ${itemId}` })
        return ctx
    },
    onSetPhase(ctx: any, old: Phase, curr: Phase): any {
        assertIsGameState(ctx)
        logCategory(`onSetPhase`, `${curr}`)
        ctx = addMessage(ctx, { id: 0, description: `onSetPhase:${curr}` })
        return ctx
    },
    onIsBattleChange(ctx: any, basyou: AbsoluteBaSyou, old: boolean, curr: boolean): GameState {
        assertIsGameState(ctx)
        if (curr) {
            ctx = doTriggerEvent(ctx, { title: ["交戦中となった場合"], cardIds: getItemIdsByBasyou(ctx, basyou) }, {})
        }
        return ctx
    },
    onCountryHeal(ctx: any, playerId: PlayerID, value: number): any {
        assertIsGameState(ctx)
        const msg = `本國回血: ${playerId} => ${value}`
        ctx = addMessage(ctx, { id: 0, description: msg })
        logCategory(`onCountryHeal`, msg)
        return ctx
    },
    onCountryDamage(ctx: any, playerId: PlayerID, damage: number): any {
        assertIsGameState(ctx)
        const msg = `本國受到傷害: ${playerId} => ${damage} damage`
        ctx = addMessage(ctx, { id: 0, description: msg })
        logCategory(`onCountryDamage`, msg)
        return ctx
    },
    onItemAdd(ctx:any, basyou:AbsoluteBaSyou, itemId: string):any{
        assertIsGameState(ctx)
        return ctx
    },
    onItemDelete(ctx:any, basyou:AbsoluteBaSyou, itemId: string):any{
        assertIsGameState(ctx)
        return ctx
    },
    onItemMove(ctx:any, from:AbsoluteBaSyou, to:AbsoluteBaSyou, itemId: string, options:GameExtParams):any{
        assertIsGameState(ctx)
        ctx = onItemMove(ctx, from, to, itemId, options)
        return ctx
    },
    // onItemAdd(ctx: any, itemId: string): any {
    //     assertIsGameState(ctx)
    //     logCategory(`onItemAdd`, `${itemId}`)
    //     return ctx
    // },
    // onItemMove(ctx: any, from: string, to: string, itemId: string): any {
    //     assertIsGameState(ctx)
    //     logCategory(`onItemMove`, `${itemId} = ${from} => ${to}`)
    //     ctx = addMessage(ctx, { id: 0, description: `onItemMove:${itemId} = ${from} => ${to}` })
    //     return ctx
    // },
    // onItemDelete(ctx: any, itemId: string): any {
    //     assertIsGameState(ctx)
    //     logCategory(`onItemDelete`, `${itemId}`)
    //     return ctx
    // },
    onTableChange(ctx: any, old: Table, curr: Table): any {
        assertIsGameState(ctx)
        // for (const oldBasyouStr in old.cardStack) {
        //     for (const itemId of old.cardStack[oldBasyouStr]) {
        //         const newBasyouStr = TableFns.getCardPosition(curr, itemId)
        //         if (newBasyouStr == null) {
        //             ctx = EventCenterFn.onItemDelete(ctx, itemId)
        //         } else if (newBasyouStr != oldBasyouStr) {

        //         }
        //     }
        // }
        // for (const newBasyouStr in curr.cardStack) {
        //     for (const itemId of curr.cardStack[newBasyouStr]) {
        //         const oldBasyouStr = TableFns.getCardPosition(old, itemId)
        //         if (oldBasyouStr == null) {
        //             ctx = EventCenterFn.onItemAdd(ctx, itemId)
        //         } else if (newBasyouStr != oldBasyouStr) {
        //             ctx = EventCenterFn.onItemMove(ctx, oldBasyouStr, newBasyouStr, itemId)
        //         }
        //     }
        // }
        return ctx
    },
}

function onItemMove(ctx: GameState, from:AbsoluteBaSyou, to: AbsoluteBaSyou, cardId: string, options: GameExtParams): GameState {
    ctx = updateGlobalEffects(ctx)
    if (AbsoluteBaSyouFn.getBaSyouKeyword(from) == "手札") {
        if (AbsoluteBaSyouFn.getBaSyouKeyword(to) == "プレイされているカード") {
            ctx = doTriggerEvent(ctx, {
                title: ["プレイした場合"],
                cardIds: [cardId],
            }, options)
        }
    }
    // 從非場所到場所=出場
    if (BaSyouKeywordFn.isBa(AbsoluteBaSyouFn.getBaSyouKeyword(from)) == false && BaSyouKeywordFn.isBa(AbsoluteBaSyouFn.getBaSyouKeyword(to))) {
        // 剛出場的回合
        ctx = mapItemState(ctx, cardId, is => {
            return {
                ...is,
                isFirstTurn: true,
            }
        }) as GameState
        ctx = mapCard(ctx, cardId, card => {
            return {
                ...card,
                isFaceDown: false,
            }
        }) as GameState
        ctx = doTriggerEvent(ctx, {
            title: ["このカードが場に出た場合"],
            cardIds: [cardId]
        }, options)
    }
    // 相反從場所到非場所
    if (BaSyouKeywordFn.isBa(AbsoluteBaSyouFn.getBaSyouKeyword(from)) == true && BaSyouKeywordFn.isBa(AbsoluteBaSyouFn.getBaSyouKeyword(to)) == false) {
        // 剛出場的回合
        ctx = mapItemState(ctx, cardId, is => {
            return {
                ...is,
                damage: 0,
                destroyReason: null,
            }
        }) as GameState
        // 清掉coin
        ctx = removeCoinIds(ctx, getCoinIdsByCardId(ctx, cardId)) as GameState
        // 移除SetGroup
        ctx = removeSetGroupParent(ctx, cardId) as GameState
        // 移除堆疊中的破壞效果
        for (const effect of getCutInDestroyEffects(ctx)) {
            if (EffectFn.getCardID(effect) == cardId) {
                ctx = removeEffect(ctx, effect.id) as GameState
            }
        }
        ctx = doTriggerEvent(ctx, {
            title: ["カードが場から離れた場合"],
            cardIds: [cardId]
        }, options)
    }
    // 到以下的場所
    if ((["捨て山", "本国", "手札"] as BaSyouKeyword[]).includes(AbsoluteBaSyouFn.getBaSyouKeyword(to))) {
        ctx = mapCard(ctx, cardId, card => {
            return {
                ...card,
                isRoll: false,
                isFaceDown: true,
            }
        }) as GameState
    } else if ((["ジャンクヤード", "ハンガー", "プレイされているカード", "取り除かれたカード"] as BaSyouKeyword[]).includes(AbsoluteBaSyouFn.getBaSyouKeyword(to))) {
        ctx = mapCard(ctx, cardId, card => {
            return {
                ...card,
                isRoll: false,
                isFaceDown: false,
            }
        }) as GameState
    } else if ((["Gゾーン"] as BaSyouKeyword[]).includes(AbsoluteBaSyouFn.getBaSyouKeyword(to))) {
        ctx = mapCard(ctx, cardId, card => {
            return {
                ...card,
                isFaceDown: false,
            }
        }) as GameState
    }
    ctx = doTriggerEvent(ctx, {
        title: ["GameEventOnMove", from, to],
        cardIds: [cardId]
    }, options)
    return ctx
}

function onEvent(ctx:GameState, event:GameEvent, options:GameExtParams):GameState{
    if (event.title[0] == "カット終了時") {
        ctx = mapItemStateValues(ctx, cs => {
            return ItemStateFn.onCutEnd(cs)
        }) as GameState
    }
    if (event.title[0] == "GameEventOnTiming") {
        const onPhase = event.title[1]
        if (onPhase[0] == "戦闘フェイズ" && onPhase[2] == "ステップ終了") {
            ctx = mapItemStateValues(ctx, cs => {
                return ItemStateFn.onStepEnd(cs)
            }) as GameState
            ctx = clearHasCheck(ctx) as GameState
        }
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
                    ctx = updateGlobalEffects(ctx)
                    break
                }
            }
        }
    }
    return ctx
}