import { pipe, always, map, sum, dissoc } from "ramda"
import { Bridge } from "../../script/bridge"
import { CardColorFn, CardColor, CardPrototypeRollCost, CardPrototype } from "../define/CardPrototype"
import { Action, CardText, CardTextFn, Condition, createRollCostRequire } from "../define/CardText"
import { Effect, EffectFn } from "../define/Effect"
import { getCardGSignProperty, getCardHasSpeicalEffect, getCardTotalCostLength } from "./card"
import { GameState } from "./GameState"
import { getGlobalEffects, setGlobalEffects } from "./globalEffects"
import { getItemPrototype, getItemOwner, getItemBaSyou } from "./ItemTableComponent"
import { logCategory } from "../../tool/logger"
import { LogicTree } from "../../tool/logicTree"
import { getCard } from "./CardTableComponent"
import { TipFn } from "../define/Tip"
import { createBridge } from "../bridge/createBridge"
import { ToolFn } from "../tool"
import { GlobalEffect } from "../define/GlobalEffect"
import { BaSyouKeywordFn } from "../define/BaSyou"
import { GameExtParams } from "../define/GameExtParams"
import { TargetMissingError } from "../define/GameError"

export function createPlayCardEffects(ctx: GameState, cardId: string, options: GameExtParams & { isQuick?: boolean }): Effect[] {
    logCategory("createPlayCardEffects", "")
    let ges = options.ges || []
    const ret: Effect[] = []
    const prototype = getItemPrototype(ctx, cardId)
    const basyou = getItemBaSyou(ctx, cardId)
    if (basyou.value[1] == "手札" || basyou.value[1] == "ハンガー") {
        // 正常從手牌打出
        if (options?.isQuick) {

        } else {
            ret.push(createPlayGEffect(ctx, cardId))
        }
        ret.push(...createPlayCardEffect(ctx, cardId, { ges: ges }))
    } else {
        // 不在手牌的情況
        const canPlayByText = ges
            .filter(ge => ge.title[0] == "自軍手札にあるかのようにプレイできる")
            .find(ge => ge.cardIds.includes(cardId))
        if (canPlayByText) {
            if (options?.isQuick) {

            } else {
                ret.push(createPlayGEffect(ctx, cardId))
            }
            ret.push(...createPlayCardEffect(ctx, cardId, { ges: ges }))
        }
    }
    // 內文新增的出牌
    const playerId = getItemOwner(ctx, cardId)
    prototype.texts?.forEach((text) => {
        if (text.createPlayEffect == null) {
            return
        }
        if (basyou.value[1] == "Gゾーン") {
            if (text.protectLevel != 2) {
                return
            }
        }
        // 非場所只有恒常能發動
        if (BaSyouKeywordFn.isBa(basyou.value[1]) == false) {
            if (text.title[0] == "自動型" && text.title[1] == "恒常") {

            } else {
                return
            }
        }
        const effs = CardTextFn.getCreatePlayEffectFn(text)(ctx, {
            id: `createPlayCardEffects_${cardId}`,
            reason: ["PlayCard", playerId, cardId, {
                isPlayUnit: prototype.category == "ユニット",
                isPlayCommand: prototype.category == "コマンド",
                isPlayCharacter: prototype.category == "キャラクター",
                isPlayOperationUnit: prototype.category == "オペレーション(ユニット)",
                isPlayOperation: prototype.category == "オペレーション",
            }],
            text: text,
        }, createBridge({ ges: ges }))
        effs?.forEach(eff => {
            if (eff.text.title[0] != "使用型") {
                console.log(eff?.text.description)
                throw new Error()
            }
            ret.push(eff)
        })
    })
    return ret
}

export function createPlayCardEffect(ctx: GameState, cardId: string, options: GameExtParams): Effect[] {
    logCategory("createPlayCardEffect", "")
    const prototype = getItemPrototype(ctx, cardId)
    let basicEff: Effect | null = null
    const ret: Effect[] = []
    switch (prototype.category) {
        case "コマンド": {
            basicEff = createPlayCommandText(ctx, cardId, options)
            ret.push(basicEff)
            break
        }
        case "キャラクター": {
            basicEff = createPlayCharacterOperationEffect(ctx, cardId, options)
            ret.push(basicEff)
            const stayEff = createPlayStayEffect(ctx, cardId, options)
            if (stayEff) {
                ret.push(stayEff)
            }
            break
        }
        case "オペレーション(ユニット)": {
            basicEff = createPlayCharacterOperationEffect(ctx, cardId, options)
            ret.push(basicEff)
            break
        }
        case "ユニット": {
            basicEff = createPlayUnitEffect(ctx, cardId, options)
            ret.push(basicEff)
            break
        }
        case "オペレーション":
        case "ACE": {
            basicEff = createPlayOperationEffect(ctx, cardId, options)
            ret.push(basicEff)
            break
        }
        case "グラフィック": {
            ret.push(createPlayGEffect(ctx, cardId))
            break
        }
    }

    if (basicEff) {
        const morePlayEfs = options?.ges?.filter(g => g.title[0] == "合計国力_＋１してプレイできる" && g.cardIds.includes(cardId)) || []
        const hasTotolCostPlusPlay = morePlayEfs.length > 0
        if (hasTotolCostPlusPlay) {
            // 取得原始條件
            let copyOriginCondition = basicEff.text.conditions || {}
            // 重新計算合計國力紅利
            const cardRollCostLength = getCardTotalCostLength(ctx, cardId, { ges: options.ges })
            const addedLength = pipe(always(morePlayEfs), map(g => g.title[0] == "合計国力_＋１してプレイできる" ? g.title[1] : 0), sum)()
            copyOriginCondition = {
                ...copyOriginCondition,
                "合計国力〔x〕": {
                    actions: [
                        {
                            title: ["合計国力〔x〕", cardRollCostLength + addedLength]
                        }
                    ]
                }
            }

            // 重寫條件
            let totalCostPlusPlayEffect: Effect = JSON.parse(JSON.stringify(basicEff))
            totalCostPlusPlayEffect = {
                ...totalCostPlusPlayEffect,
                id: `totalCostPlusPlayEffect_${cardId}`,
                description: "合計国力_＋１してプレイできる",
                text: {
                    ...totalCostPlusPlayEffect.text,
                    id: prototype.commandText?.id || `totalCostPlusPlayEffect_text_${cardId}`,
                    description: "合計国力_＋１してプレイできる",
                    conditions: copyOriginCondition,
                }
            }

            if (totalCostPlusPlayEffect.text.logicTreeActions?.[0] == null) {
                throw new Error(`morePlayCardEffect.text.logicTreeActions?.[0] == null`)
            }
            // 加入新的action, 用這個能力出場的要標記
            totalCostPlusPlayEffect.text.logicTreeActions[0].actions.push({
                title: function _(ctx: GameState, effect: Effect, { GameStateFn, DefineFn }: Bridge): GameState {
                    const { addedLength } = { addedLength: 0 }
                    const cardId = DefineFn.EffectFn.getCardID(effect)
                    let cs = GameStateFn.getItemState(ctx, cardId)
                    cs = DefineFn.ItemStateFn.setMoreTotalRollCostLengthPlay(cs, addedLength)
                    ctx = GameStateFn.setItemState(ctx, cardId, cs) as GameState
                    return ctx
                }.toString().replace("{ addedLength: 0 }", `{addedLength: ${addedLength}}`)
            })
            ret.push(totalCostPlusPlayEffect)
        }
    }
    return ret
}

export function createPlayGEffect(ctx: GameState, cardId: string): Effect {
    // 注意, 這裡的effect.id是用函數名為前綴+卡片ID, 必須是唯一的
    const text: CardText = {
        id: `createPlayGEffect_${cardId}`,
        title: ["使用型", ["自軍", "配備フェイズ"]],
        description: "PlayG",
        conditions: {
            "出G上限": {
                actions: [
                    {
                        title: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn, ToolFn }: Bridge): GameState {
                            const cardId = DefineFn.EffectFn.getCardID(effect)
                            const cardController = GameStateFn.getItemController(ctx, cardId)
                            const ps = GameStateFn.getPlayerState(ctx, cardController)
                            if (ps.playGCount > 0) {
                                throw new DefineFn.TipError(`出G上限: ${ps.playGCount}`, { isPlayGLimit: true })
                            }
                            ctx = GameStateFn.mapPlayerState(ctx, cardController, ps => {
                                return {
                                    ...ps,
                                    playGCount: ps.playGCount + 1
                                }
                            }) as GameState
                            return ctx
                        }.toString()
                    }
                ]
            }
        },
        logicTreeActions: [
            {
                actions: [
                    {
                        title: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn, Options }: Bridge): GameState {
                            const cardId = DefineFn.EffectFn.getCardID(effect)
                            const from = GameStateFn.getItemBaSyou(ctx, cardId)
                            ctx = GameStateFn.doItemMove(ctx, effect, DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, "Gゾーン"), [cardId, from], { ges: Options.ges }) as GameState
                            return ctx
                        }.toString()
                    },
                    {
                        title: ["triggerEvent", { title: ["プレイされて場に出た場合"] }]
                    },
                    {
                        title: ["triggerEvent", { title: ["このカードがGとして場に出た場合"] }]
                    }
                ]
            }
        ]
    }
    return {
        id: `createPlayGEffect_${cardId}`,
        reason: ["PlayCard", getItemOwner(ctx, cardId), cardId, { isPlayG: true }],
        description: `Play G`,
        text: text
    }
}

export function createPlayUnitEffect(ctx: GameState, cardId: string, options: GameExtParams): Effect {
    logCategory("createPlayUnitEffect", "")
    const prototype = getItemPrototype(ctx, cardId)
    if (prototype.category == "ユニット") {

    } else {
        throw new Error()
    }
    const conditions = createPlayCardConditions(ctx, cardId, options)
    const description = `Play ${prototype.title}`
    const text: CardText = {
        id: `createPlayUnitEffect_${cardId}`,
        title: ["使用型", ["自軍", "配備フェイズ"]],
        description: description,
        conditions: conditions,
        logicTreeActions: [
            {
                actions: [
                    {
                        title: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn, Options }: Bridge): GameState {
                            let ges = Options.ges || []
                            const cardId = DefineFn.EffectFn.getCardID(effect)
                            const from = GameStateFn.getItemBaSyou(ctx, cardId)
                            ctx = GameStateFn.doItemMove(ctx, effect, DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, "プレイされているカード"), [cardId, from], { ges: Options.ges }) as GameState
                            const newE = GameStateFn.createUnitGoStageEffectFromPlayEffect(ctx, effect, { ges: ges })
                            return GameStateFn.addStackEffect(ctx, newE) as GameState
                        }.toString()
                    }
                ]
            },
        ]
    }
    return {
        id: `createPlayUnitEffect_${cardId}`,
        reason: ["PlayCard", getItemOwner(ctx, cardId), cardId, { isPlayUnit: true }],
        description: `Play ${prototype.title}`,
        text: text
    }
}

export function createPlayOperationEffect(ctx: GameState, cardId: string, options: GameExtParams): Effect {
    logCategory("createPlayOperationEffect", "")
    const prototype = getItemPrototype(ctx, cardId)
    if (prototype.category == "オペレーション") {

    } else {
        throw new Error()
    }
    const conditions = createPlayCardConditions(ctx, cardId, options)
    const description = `Play ${prototype.title}`
    const text: CardText = {
        id: `createPlayOperationEffect_${cardId}`,
        title: ["使用型", ["自軍", "配備フェイズ"]],
        description: description,
        conditions: conditions,
        logicTreeActions: [
            {
                actions: [
                    {
                        title: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn, Options }: Bridge): GameState {
                            const cardId = DefineFn.EffectFn.getCardID(effect)
                            const from = GameStateFn.getItemBaSyou(ctx, cardId)
                            ctx = GameStateFn.doItemMove(ctx, effect, DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, "プレイされているカード"), [cardId, from], { ges: Options.ges }) as GameState
                            const newE = GameStateFn.createOperationGoStageEffectFromPlayEffect(ctx, effect)
                            return GameStateFn.addStackEffect(ctx, newE) as GameState
                        }.toString()
                    }
                ]
            },
        ]
    }
    return {
        id: `createPlayOperationEffect_${cardId}`,
        reason: ["PlayCard", getItemOwner(ctx, cardId), cardId, { isPlayOperation: true }],
        description: `Play ${prototype.title}`,
        text: text
    }
}

export function createPlayStayEffect(ctx: GameState, cardId: string, options: GameExtParams): Effect | null {
    logCategory("createPlayStayEffect", "")
    const prototype = getItemPrototype(ctx, cardId)
    if (prototype.category == "キャラクター") {

    } else {
        throw new Error()
    }
    if (getCardHasSpeicalEffect(ctx, ["【ステイ】"], cardId, options)) {

    } else {
        return null
    }
    const conditions = createPlayCardConditions(ctx, cardId, options)
    delete conditions[TipFn.createCharacterTargetUnitKey()]
    const description = `Play ${prototype.title}`
    const text: CardText = {
        id: `createPlayStayEffect_${cardId}`,
        title: ["使用型", ["自軍", "配備フェイズ"]],
        description: description,
        conditions: conditions,
        logicTreeActions: [
            {
                actions: [
                    {
                        title: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn, Options }: Bridge): GameState {
                            const cardId = DefineFn.EffectFn.getCardID(effect)
                            const from = GameStateFn.getItemBaSyou(ctx, cardId)
                            ctx = GameStateFn.doItemMove(ctx, effect, DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, "プレイされているカード"), [cardId, from], { ges: Options.ges }) as GameState
                            const newE = GameStateFn.createOperationGoStageEffectFromPlayEffect(ctx, effect)
                            return GameStateFn.addStackEffect(ctx, newE) as GameState
                        }.toString()
                    }
                ]
            },
        ]
    }
    return {
        id: `createPlayStayEffect_${cardId}`,
        reason: ["PlayCard", getItemOwner(ctx, cardId), cardId, { isPlayOperation: true }],
        description: `Play 【ステイ】 ${prototype.title}`,
        text: { ...text, description: `【ステイ】${text.description}` }
    }
}

export function createPlayCharacterOperationEffect(ctx: GameState, cardId: string, options: GameExtParams): Effect {
    logCategory("createPlayCharacterOperationEffect", "")
    const prototype = getItemPrototype(ctx, cardId)
    if (prototype.category == "キャラクター" || prototype.category == "オペレーション(ユニット)") {

    } else {
        throw new Error()
    }
    const conditions = createPlayCardConditions(ctx, cardId, options)
    const description = `Play ${prototype.title}`
    const text: CardText = {
        id: `createPlayCharacterOperationEffect_${cardId}`,
        title: ["使用型", ["自軍", "配備フェイズ"]],
        description: description,
        conditions: conditions,
        logicTreeActions: [
            {
                actions: [
                    {
                        title: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn, Options }: Bridge): GameState {
                            const cardId = DefineFn.EffectFn.getCardID(effect)
                            const prototype = GameStateFn.getItemPrototype(ctx, cardId)
                            const from = GameStateFn.getItemBaSyou(ctx, cardId)
                            ctx = GameStateFn.doItemMove(ctx, effect, DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, "プレイされているカード"), [cardId, from], { ges: Options.ges }) as GameState
                            const newE = GameStateFn.createCharOpUnitGoStageEffectFromPlayEffect(ctx, effect)
                            return GameStateFn.addStackEffect(ctx, newE) as GameState
                        }.toString()
                    }
                ]
            },
        ]
    }

    const eff: Effect = {
        id: `createPlayCharacterOperationEffect_${cardId}`,
        reason: ["PlayCard", getItemOwner(ctx, cardId), cardId, {
            isPlayCharacter: prototype.category == "キャラクター",
            isPlayOperation: prototype.category == "オペレーション(ユニット)",
        }],
        description: `Play ${prototype.title}`,
        text: text
    }
    return eff
}

export function createPlayCommandText(ctx: GameState, cardId: string, options: GameExtParams): Effect {
    logCategory("createPlayCommandText", "")
    const prototype = getItemPrototype(ctx, cardId)
    if (prototype.category == "コマンド") {

    } else {
        throw new Error()
    }
    const commandText = prototype.commandText
    const conditions = createPlayCardConditions(ctx, cardId, options)
    const description = `Play ${prototype.title}`
    const logicLeafs: LogicTree[] = Object.keys(conditions).map(k => {
        const ret: LogicTree = {
            type: "Leaf",
            value: k
        }
        return ret
    })
    const logicTree: LogicTree = {
        type: "And",
        children: commandText?.logicTreeActions?.[0] ?
            [...logicLeafs, ...CardTextFn.getLogicTreeTreeLeafs(commandText, commandText.logicTreeActions[0])] :
            logicLeafs
    }
    const text: CardText = {
        id: commandText?.id || `createPlayCommandText_${cardId}`,
        title: commandText?.title || ["使用型", ["自軍", "配備フェイズ"]],
        description: description,
        conditions: {
            ...conditions,
            ...commandText?.conditions
        },
        logicTreeActions: [
            {
                logicTree: logicTree,
                actions: [
                    {
                        title: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn, Options }: Bridge): GameState {
                            const cardId = DefineFn.EffectFn.getCardID(effect)
                            const prototype = GameStateFn.getItemPrototype(ctx, cardId)
                            if (prototype.category == "コマンド") {

                            } else {
                                throw new Error()
                            }
                            const commandText = prototype.commandText
                            const from = GameStateFn.getItemBaSyou(ctx, cardId)
                            ctx = GameStateFn.doItemMove(ctx, effect, DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, "プレイされているカード"), [cardId, from], { ges: Options.ges }) as GameState
                            return GameStateFn.addStackEffect(ctx, {
                                id: `${effect.id}_場に出る`,
                                reason: ["場に出る", DefineFn.EffectFn.getPlayerID(effect), DefineFn.EffectFn.getCardID(effect)],
                                description: effect.text.description,
                                text: {
                                    id: commandText?.id || `getPlayCardEffects_commentText_${cardId}`,
                                    description: commandText?.description || "unknown",
                                    title: [],
                                    logicTreeActions: [
                                        {
                                            actions: [
                                                {
                                                    title: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn, Options }: Bridge): GameState {
                                                        const cardId = DefineFn.EffectFn.getCardID(effect)
                                                        const from = GameStateFn.getItemBaSyou(ctx, cardId)
                                                        const to = DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, "ジャンクヤード")
                                                        ctx = GameStateFn.doItemMove(ctx, effect, to, [cardId, from], { ges: Options.ges }) as GameState
                                                        ctx = GameStateFn.doTriggerEvent(ctx, { title: ["プレイされて場に出た場合"], cardIds: [cardId] }, { ges: Options.ges })
                                                        return ctx
                                                    }.toString()
                                                },
                                                ...(commandText?.logicTreeActions?.[0]?.actions || [])
                                            ]
                                        },
                                    ]
                                }
                            }) as GameState
                        }.toString()
                    }
                ]
            },
        ]
    }
    return {
        id: `createPlayCommandText_${cardId}`,
        reason: ["PlayCard", getItemOwner(ctx, cardId), cardId, { isPlayCommand: true }],
        description: `Play ${prototype.title}`,
        text: text
    }
}

export function createUnitGoStageEffectFromPlayEffect(ctx: GameState, effect: Effect, options: GameExtParams): Effect {
    const cardId = EffectFn.getCardID(effect)
    const prototype = getItemPrototype(ctx, cardId)
    if (prototype.category == "ユニット") {
        return {
            id: `createUnitGoStageEffectFromPlayEffect_${cardId}`,
            reason: ["場に出る", EffectFn.getPlayerID(effect), EffectFn.getCardID(effect)],
            description: effect.text.description,
            text: {
                id: effect.text.id,
                description: effect.text.description,
                title: [],
                logicTreeActions: [
                    {
                        actions: [
                            {
                                title: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn, Options }: Bridge): GameState {
                                    const cardId = DefineFn.EffectFn.getCardID(effect)
                                    const from = GameStateFn.getItemBaSyou(ctx, cardId)
                                    const to = DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, "配備エリア")
                                    ctx = GameStateFn.doItemMove(ctx, effect, to, [cardId, from], { ges: Options.ges }) as GameState
                                    const hasHigh = GameStateFn.getCardHasSpeicalEffect(ctx, ["戦闘配備"], cardId, Options)
                                    const hasPS = GameStateFn.getCardHasSpeicalEffect(ctx, ["【PS装甲】"], cardId, Options)
                                    const isNoNeedRoll = (hasHigh || hasPS)
                                    const isRoll = isNoNeedRoll == false
                                    ctx = GameStateFn.doItemSetRollState(ctx, effect, isRoll, [cardId, GameStateFn.getItemBaSyou(ctx, cardId)], { ...Options, isSkipTargetMissing: true })
                                    ctx = GameStateFn.doTriggerEvent(ctx, { title: ["プレイされて場に出た場合"], cardIds: [cardId] }, Options)
                                    return ctx
                                }.toString()
                            },
                        ]
                    }
                ]
            }
        }
    }
    throw new Error()
}

export function createOperationGoStageEffectFromPlayEffect(ctx: GameState, effect: Effect): Effect {
    const cardId = EffectFn.getCardID(effect)
    const prototype = getItemPrototype(ctx, cardId)
    // character for stay
    if (prototype.category == "オペレーション" || prototype.category == "キャラクター") {
        return {
            id: `createOperationGoStageEffectFromPlayEffect_${cardId}`,
            reason: ["場に出る", EffectFn.getPlayerID(effect), EffectFn.getCardID(effect)],
            description: effect.text.description,
            text: {
                id: effect.text.id,
                description: effect.text.description,
                title: [],
                logicTreeActions: [
                    {
                        actions: [
                            {
                                title: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn, Options }: Bridge): GameState {
                                    const cardId = DefineFn.EffectFn.getCardID(effect)
                                    const from = GameStateFn.getItemBaSyou(ctx, cardId)
                                    const to = DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(from, "配備エリア")
                                    ctx = GameStateFn.doItemMove(ctx, effect, to, [cardId, from], { ges: Options.ges }) as GameState
                                    ctx = GameStateFn.doTriggerEvent(ctx, { title: ["プレイされて場に出た場合"], cardIds: [cardId] }, { ges: Options.ges })
                                    return ctx
                                }.toString()
                            },
                        ]
                    }
                ]
            }
        }
    }
    throw new Error()
}

export function createCharOpUnitGoStageEffectFromPlayEffect(ctx: GameState, effect: Effect): Effect {
    const cardId = EffectFn.getCardID(effect)
    const prototype = getItemPrototype(ctx, cardId)
    if (prototype.category == "キャラクター" || prototype.category == "オペレーション(ユニット)") {
        return {
            id: `createCharOpUnitGoStageEffectFromPlayEffect_${cardId}`,
            reason: ["場に出る", EffectFn.getPlayerID(effect), EffectFn.getCardID(effect)],
            description: effect.text.description,
            text: {
                id: effect.text.id,
                description: effect.text.description,
                title: [],
                logicTreeActions: [
                    {
                        actions: [
                            {
                                title: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn, Options }: Bridge): GameState {
                                    const cardId = DefineFn.EffectFn.getCardID(effect)
                                    const pairs = GameStateFn.getCardTipStrBaSyouPairs(ctx, DefineFn.TipFn.createCharacterTargetUnitKey(), cardId)
                                    if (pairs.length == 0) {
                                        throw new Error(`pairs must not 0: ${effect.text.description}`)
                                    }
                                    const [targetCardId, targetBasyou] = pairs[0]
                                    const from = GameStateFn.getItemBaSyou(ctx, cardId)
                                    const to = targetBasyou
                                    ctx = GameStateFn.doItemMove(ctx, effect, to, [cardId, from], { ges: Options.ges }) as GameState
                                    const isRoll = GameStateFn.getCard(ctx, targetCardId).isRoll || false
                                    ctx = GameStateFn.mapCard(ctx, cardId, is => ({ ...is, isRoll: isRoll })) as GameState
                                    ctx = GameStateFn.setSetGroupParent(ctx, targetCardId, cardId) as GameState
                                    ctx = GameStateFn.doTriggerEvent(ctx, { title: ["プレイされて場に出た場合"], cardIds: [cardId] }, { ges: Options.ges })
                                    ctx = GameStateFn.doTriggerEvent(ctx, { title: ["プレイされて場にセットされた場合"], cardIds: [cardId] }, { ges: Options.ges })
                                    return ctx
                                }.toString()
                            }
                        ]
                    }
                ]
            }
        }
    }
    throw new Error()
}

export function createRollCostConditions(ctx: GameState, proto: CardPrototype, rollCost: CardPrototypeRollCost, bonus: number): { [key: string]: Condition } {
    if (rollCost == "X") {
        if (proto.color == null) {
            throw new Error()
        }
        return {
            [TipFn.createConditionKeyOfPayColorX(proto)]: {
                title: ["RollColor", proto.color]
            }
        }
    }
    const rollCostConditions = CardColorFn.getAll()
        .map(tc => createRollCostRequire(Math.max(0, rollCost.filter(c => c == tc).length + bonus), tc))
        .reduce((ctx, cons) => ({ ...ctx, ...cons }))
    return rollCostConditions
}

export function createPlayCardConditions(ctx: GameState, cardId: string, options: GameExtParams): { [key: string]: Condition } {
    logCategory("createPlayCardConditions", "")
    const prototype = getItemPrototype(ctx, cardId)
    const cardRollCostLength = getCardTotalCostLength(ctx, cardId, options)
    const costConditions: { [key: string]: Condition } = (prototype.category != "グラフィック") ? {
        [TipFn.createTotalCostKey()]: {
            actions: [
                {
                    title: ["合計国力〔x〕", cardRollCostLength]
                }
            ]
        },
    } : {}
    const rollCostConditions = createRollCostConditions(ctx, prototype, prototype.rollCost || [], 0)
    const characterOperationUnitConditions: { [key: string]: Condition } = (prototype.category == "キャラクター" || prototype.category == "オペレーション(ユニット)") ? {
        [TipFn.createCharacterTargetUnitKey()]: {
            title: ["Entity", {
                at: ["配備エリア"],
                isCanSetCharacter: prototype.category == "キャラクター" || undefined,
                side: "自軍",
                is: ["ユニット"],
                count: 1
            }],
        },
    } : {}
    
    const characterMoreConditions: { [key: string]: Condition } = prototype.category == "キャラクター" ? {
        "同名卡不能下": {
            actions: [
                {
                    title: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn, Options }: Bridge): GameState {
                        const cardId = DefineFn.EffectFn.getCardID(effect)
                        const tip = GameStateFn.createTipByEntitySearch(ctx, effect, {
                            atBa: true,
                            // 空陣列會自動填入自身
                            hasTitle: [],
                            count: 0
                        }, Options)
                        if(DefineFn.TipFn.getWant(tip).length){
                            throw new TargetMissingError(`已有同名卡存在: ${cardId}`)
                        }
                        return ctx
                    }.toString()
                }
            ]
        }
    } : {}
    let conditions: { [key: string]: Condition } = {
        ...costConditions,
        ...rollCostConditions,
        ...characterOperationUnitConditions,
        ...characterMoreConditions
    }
    const hasSp = options.ges?.find(ge => ge.title[0] == "このカードは、戦闘エリアにいる自軍ユニットにもセットできる" && ge.cardIds.includes(cardId)) != null
    if (hasSp) {
        conditions = {
            ...conditions,
            // 覆蓋對象
            [TipFn.createCharacterTargetUnitKey()]: {
                title: ["Entity", {
                    atBa: true,
                    isCanSetCharacter: true,
                    side: "自軍",
                    is: ["ユニット"],
                    count: 1
                }],
            },
        }
    }
    return conditions
}