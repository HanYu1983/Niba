import { pair } from "ramda";
import { Bridge } from "../../script/bridge";
import { TextSpeicalEffect, CardText } from "../define/CardText";
import { Effect } from "../define/Effect";
import { Tip } from "../define/Tip";
import { getCardGSignProperty, getCardRollCostLength, getItemCharacteristic } from "./card";
import { GameState } from "./GameState";
import { addStackEffect } from "./EffectStackComponent";
import { getItemState, mapItemState } from "./ItemStateComponent";
import { getItemBaSyou, getItemController, getItemIdsByBasyou } from "./ItemTableComponent";
import { TargetMissingError } from "../define/GameError";
import { AbsoluteBaSyouFn } from "../define/BaSyou";

export function getTextsFromSpecialEffect(ctx: GameState, text: CardText): CardText[] {
    if (text.title[0] != "特殊型") {
        throw new Error(`text not 特殊型`)
    }
    const specialEffect = text.title[1]
    switch (specialEffect[0]) {
        case "PS装甲": {
            return [
                {
                    id: `${text.id}_1`,
                    title: ["自動型", "起動"],
                    description: "出場時直立出場",
                },
                {
                    id: `${text.id}_2`,
                    title: ["自動型", "起動"],
                    description: "這張卡出現在戰區時, 下回合開始時回到持有者手上. 但如果和持有補給或供給的卡組合部隊的時候, 上述的效果不發動.",
                    onEvent: function _(ctx: GameState, effect: Effect, { GameStateFn, DefineFn }: Bridge): GameState {
                        const cardId = DefineFn.EffectFn.getCardID(effect)
                        const evt = DefineFn.EffectFn.getEvent(effect)
                        if (evt.title[0] == "GameEventOnMove" &&
                            (
                                DefineFn.AbsoluteBaSyouFn.getBaSyouKeyword(evt.title[2]) == "戦闘エリア1" ||
                                DefineFn.AbsoluteBaSyouFn.getBaSyouKeyword(evt.title[2]) == "戦闘エリア2"
                            )
                        ) {
                            // 如果這張卡移到戰區
                            if (evt.cardIds?.includes(cardId)) {
                                // 判斷同區有沒有補給或供給
                                const hasSupply = GameStateFn.isBattleGroupHasA(ctx, ["供給"], cardId)
                                if (hasSupply) {
                                    // do nothing
                                } else {
                                    // 回家旗標
                                    ctx = GameStateFn.mapItemState(ctx, cardId, is => DefineFn.ItemStateFn.setFlag(is, "return", true)) as GameState
                                }
                            } else {
                                // 如果別張卡移到這張卡的戰區
                                if (DefineFn.AbsoluteBaSyouFn.eq(GameStateFn.getItemBaSyou(ctx, cardId), evt.title[2])) {
                                    // 判斷新來的卡有沒有補給或供給
                                    // 如果有, 就刪除回家旗標
                                    const hasSupply = GameStateFn.isBattleGroupHasA(ctx, ["供給"], cardId)
                                    if (hasSupply) {
                                        // 回家旗標
                                        ctx = GameStateFn.mapItemState(ctx, cardId, is => DefineFn.ItemStateFn.removeFlag(is, "return")) as GameState
                                    }
                                }
                            }
                        }
                        // 到下個回合開始時
                        if (evt.title[0] == "GameEventOnTiming" &&
                            DefineFn.PhaseFn.eq(evt.title[1], DefineFn.PhaseFn.getFirst())
                        ) {
                            // 如果有回家旗標就回家
                            const cardId = DefineFn.EffectFn.getCardID(effect)
                            const cardController = GameStateFn.getItemController(ctx, cardId)
                            const cs = GameStateFn.getItemState(ctx, cardId)
                            if (cs.flags["return"]) {
                                ctx = GameStateFn.moveItem(ctx, DefineFn.AbsoluteBaSyouFn.of(cardController, "手札"), [cardId, GameStateFn.getItemBaSyou(ctx, cardId)], GameStateFn.onMoveItem) as GameState
                                ctx = GameStateFn.mapItemState(ctx, cardId, is => DefineFn.ItemStateFn.removeFlag(is, "return")) as GameState
                            }
                        }
                        return ctx
                    }.toString()
                }
            ]
        }
        case "クロスウェポン": {
            const [_, A] = specialEffect
            return [
                {
                    id: `${text.id}_1`,
                    title: ["使用型", ["戦闘フェイズ"]],
                    description: "（戦闘フェイズ）：［ ］の特徴を持つ自軍ユニット１枚は、ターン終了時まで、このカードの本来のテキスト１つと同じテキストを得る。ただし同じテキストは得られない）",
                    conditions: {
                        ...text.conditions,
                        "［ ］の特徴を持つ自軍ユニット１枚は": {
                            title: ["_本来の記述に｢特徴：_装弾｣を持つ_自軍_G_１枚", false, A, "自軍", "ユニット", 1],
                            exceptItemSelf: true,
                        },
                        "このカードの本来のテキスト１つ": {
                            title: ["このカードの_本来のテキスト１つ", true, 1]
                        }
                    },
                    logicTreeActions: [
                        {
                            actions: [
                                {
                                    title: ["cutIn", [
                                        {
                                            title: function _(ctx: GameState, effect: Effect, { GameStateFn, DefineFn }: Bridge): GameState {
                                                const cardId = DefineFn.EffectFn.getCardID(effect)
                                                const pairs = GameStateFn.getCardTipStrBaSyouPairs(ctx, "［ ］の特徴を持つ自軍ユニット１枚は", cardId)
                                                const textRefs = GameStateFn.getCardTipTextRefs(ctx, "このカードの本来のテキスト１つ", cardId)
                                                for (const pair of pairs) {
                                                    GameStateFn.assertTargetMissingError(ctx, pair)
                                                    const [targetCardId, targetBasyou] = pair
                                                    ctx = GameStateFn.mapItemState(ctx, targetCardId, targetItemState => {
                                                        for (const textRef of textRefs) {
                                                            const alreadyHas = GameStateFn.getCardTexts(ctx, targetItemState.id).find(text => text.id == textRef.textId) != null
                                                            if (alreadyHas) {
                                                                continue
                                                            }
                                                            targetItemState = DefineFn.ItemStateFn.setGlobalEffect(targetItemState, null, true, {
                                                                title: ["AddTextRef", textRef],
                                                                cardIds: [targetItemState.id]
                                                            })
                                                        }
                                                        return targetItemState
                                                    }) as GameState
                                                }
                                                return ctx
                                            }.toString()
                                        }
                                    ]]
                                }
                            ]
                        }
                    ]
                }
            ]
        }
        case "ゲイン": {
            return [
                {
                    id: `${text.id}_1`,
                    title: ["使用型", ["戦闘フェイズ"]],
                    description: "這張卡在戰區的場合, 打開自軍本國上的1張卡和這張卡同GsignProperty的情況, 這張卡回合結束前+x/+x/+x, x為打開的卡的横置費用數量, 這個效果1回合只能用1次",
                    conditions: {
                        ...text.conditions,
                        "這個效果1回合只能用1次": {
                            actions: [
                                {
                                    title: ["這個效果1回合只能用1次"]
                                }
                            ]
                        }
                    },
                    logicTreeActions: [
                        {
                            actions: [
                                {
                                    title: function _(ctx: GameState, effect: Effect, { GameStateFn, DefineFn }: Bridge): GameState {
                                        ctx = GameStateFn.addStackEffect(ctx, {
                                            id: "",
                                            reason: effect.reason,
                                            description: effect.description,
                                            text: {
                                                id: effect.text.id,
                                                description: effect.text.description,
                                                title: [],
                                                conditions: {
                                                    "這張卡在戰區的場合": {
                                                        actions: [
                                                            {
                                                                title: ["這張卡在_戰區的場合", ["戦闘エリア1", "戦闘エリア2"]]
                                                            }
                                                        ]
                                                    },
                                                    "自軍本國上的1張卡": {
                                                        title: ["_自軍_本國上的_1張卡", "自軍", "本国", 1],
                                                        actions: [
                                                            {
                                                                title: ["_ロールする", "打開"],
                                                                vars: ["自軍本國上的1張卡"]
                                                            }
                                                        ]
                                                    },
                                                },
                                                logicTreeActions: [
                                                    {
                                                        actions: [
                                                            {
                                                                title: function _(ctx: GameState, effect: Effect, { GameStateFn, DefineFn }: Bridge): GameState {
                                                                    const cardId = DefineFn.EffectFn.getCardID(effect)
                                                                    const pairs = GameStateFn.getCardTipStrBaSyouPairs(ctx, "自軍本國上的1張卡", cardId)
                                                                    if (pairs.length == 0) {
                                                                        throw new Error()
                                                                    }
                                                                    const [openCardId] = pairs[0]
                                                                    const hasSameGSighProperty = getCardGSignProperty(ctx, openCardId) == getCardGSignProperty(ctx, cardId)
                                                                    if (hasSameGSighProperty) {
                                                                        const bonus = getCardRollCostLength(ctx, openCardId)
                                                                        ctx = mapItemState(ctx, cardId, is => DefineFn.ItemStateFn.setGlobalEffect(is, null, true, {
                                                                            title: ["＋x／＋x／＋xを得る", [bonus, bonus, bonus]], cardIds: [cardId]
                                                                        })) as GameState
                                                                    }
                                                                    return ctx
                                                                }.toString()
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        }) as GameState
                                        return ctx
                                    }.toString()
                                }
                            ]
                        }
                    ]
                }
            ]
        }
        case "供給": {
            return [
                {
                    id: `${text.id}_1`,
                    title: ["使用型", ["自軍", "攻撃ステップ"]],
                    description: "這張卡以外的自軍機體1張重置",
                    conditions: {
                        ...text.conditions,
                        "這張卡以外的自軍機體1張": {
                            title: ["_自軍_ユニット_１枚", "自軍", "ユニット", 1],
                            exceptItemSelf: true,
                        }
                    },
                    logicTreeActions: [
                        {
                            actions: [
                                {
                                    title: ["cutIn", [
                                        {
                                            title: ["_ロールする", "リロール"],
                                            vars: ["這張卡以外的自軍機體1張"]
                                        }
                                    ]]
                                },
                            ]
                        }
                    ]
                }
            ]
        }
        case "サイコミュ": {
            const [_, x] = specialEffect
            return [
                {
                    id: `${text.id}_1`,
                    title: ["使用型", ["防御ステップ"]],
                    description: "交戰中的敵軍機體1張x傷害. 這個效果只有在同區中有NT才能使用.",
                    conditions: {
                        ...text.conditions,
                        "交戰中的敵軍機體1張": {
                            title: ["_交戦中の_自軍_ユニット_１枚", "交戦中", "敵軍", "ユニット", 1]
                        },
                        "同區中有NT才能使用": {
                            actions: [
                                {
                                    title: function _(ctx: GameState, effect: Effect, { GameStateFn, DefineFn }: Bridge): GameState {
                                        const cardId = DefineFn.EffectFn.getCardID(effect)
                                        const from = GameStateFn.getItemBaSyou(ctx, cardId)
                                        const hasNT = GameStateFn.getCardLikeItemIdsByBasyou(ctx, from).filter(itemId => getItemCharacteristic(ctx, itemId).indexOf("NT")).length > 0
                                        if (hasNT == false) {
                                            throw new Error(`no NT in the same area`)
                                        }
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
                                    title: ["cutIn", [
                                        {
                                            title: ["_１ダメージを与える", x],
                                            vars: ["交戰中的敵軍機體1張"]
                                        }
                                    ]]
                                }
                            ]
                        }
                    ]
                }
            ]
        }
        case "範囲兵器": {
            const [_, x] = specialEffect
            return [
                {
                    id: `${text.id}_1`,
                    title: ["使用型", ["ダメージ判定ステップ"]],
                    description: "和這張卡交戰的防禦力x以下的敵軍機體1張破壞",
                    conditions: {
                        ...text.conditions,
                        "這張卡交戰的防禦力_x以下的敵軍機體1張": {
                            title: ["這張卡交戰的防禦力_x以下的敵軍機體_1張", x, 1]
                        }
                    },
                    logicTreeActions: [
                        {
                            actions: [
                                {
                                    title: ["cutIn", [
                                        {
                                            title: ["_ロールする", "破壞"],
                                            vars: ["這張卡交戰的防禦力x以下的敵軍機體1張"]
                                        }
                                    ]]
                                }
                            ]
                        }
                    ]
                }
            ]
        }
        case "共有": {
            const [_, A] = specialEffect
            return [
                {
                    id: `${text.id}_1`,
                    title: ["使用型", ["常時"]],
                    description: "看自己本國全部的卡,可以從中找出特徵A的1張卡移到HANGER,那個時候本國洗牌.這個效果只有這張卡從手中打出的回合可以使用",
                    conditions: {
                        ...text.conditions,
                        "這個效果只有這張卡從手中打出的回合可以使用": {
                            actions: [
                                {
                                    title: function _(ctx: GameState, effect: Effect, { GameStateFn, DefineFn }: Bridge): GameState {
                                        const cardId = DefineFn.EffectFn.getCardID(effect)
                                        if (GameStateFn.getItemState(ctx, cardId).isFirstTurn != true) {
                                            throw new DefineFn.TargetMissingError(`這個效果只有這張卡從手中打出的回合可以使用:${effect.text.description}`)
                                        }
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
                                    title: function _(ctx: GameState, effect: Effect, { GameStateFn, DefineFn }: Bridge): GameState {
                                        ctx = GameStateFn.addStackEffect(ctx, {
                                            id: "",
                                            reason: effect.reason,
                                            description: effect.description,
                                            text: {
                                                id: effect.text.id,
                                                description: effect.text.description,
                                                title: [],
                                                conditions: {
                                                    "看自己本國全部的卡,可以從中找出特徵A的1張卡移到HANGER,那個時候本國洗牌": {
                                                        title: ["_自軍_本國找出特徵_A的_1張卡", "自軍", "本国", A, 1],
                                                        actions: [
                                                            {
                                                                title: ["看自己_本國全部的卡", "本国"]
                                                            },
                                                        ]
                                                    },
                                                },
                                                logicTreeActions: [
                                                    {
                                                        actions: [
                                                            {
                                                                title: function _(ctx: GameState, effect: Effect, { GameStateFn, DefineFn }: Bridge): GameState {
                                                                    const cardId = DefineFn.EffectFn.getCardID(effect)
                                                                    const cardController = getItemController(ctx, cardId)
                                                                    const pairs = GameStateFn.getCardTipStrBaSyouPairs(ctx, "看自己本國全部的卡,可以從中找出特徵A的1張卡移到HANGER,那個時候本國洗牌", cardId)
                                                                    if (pairs.length) {
                                                                        for (const pair of pairs) {
                                                                            ctx = GameStateFn.moveItem(ctx, DefineFn.AbsoluteBaSyouFn.of(cardController, "ハンガー"), pair, GameStateFn.onMoveItem) as GameState
                                                                        }
                                                                        ctx = GameStateFn.shuffleItems(ctx, DefineFn.AbsoluteBaSyouFn.of(cardController, "本国"))
                                                                    }
                                                                    return ctx
                                                                }.toString()
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        }) as GameState
                                        return ctx
                                    }.toString()
                                }
                            ]
                        }
                    ]
                }
            ]
        }
        case "改装": {
            const [_, A] = specialEffect
            return [
                {
                    id: `${text.id}_1`,
                    title: ["使用型", ["戦闘フェイズ"]],
                    description: "打開自軍手裡或指定HANGER中特徵A並合計國力x以下的1張卡, 和這張卡重置狀態置換, 這張卡置換後廢棄. x為自軍G的張數",
                    conditions: {
                        ...text.conditions,
                        "打開自軍手裡或指定HANGER中特徵A並合計國力x以下的1張卡": {
                            title: function _(ctx: GameState, effect: Effect, bridge: Bridge): Tip | null {
                                const { A } = { A: "" }
                                const { GameStateFn, DefineFn } = bridge
                                const cardId = DefineFn.EffectFn.getCardID(effect)
                                const cardController = GameStateFn.getItemController(ctx, cardId)
                                const gCount = GameStateFn.getItemIdsByBasyou(ctx, DefineFn.AbsoluteBaSyouFn.of(cardController, "Gゾーン")).length
                                return GameStateFn.getConditionTitleFn({
                                    title: ["打開自軍手裡或指定HANGER中特徵_A並合計國力_x以下的_1張卡", A, gCount, 1]
                                }, {})(ctx, effect, bridge)
                            }.toString().replace(`{ A: "" }`, JSON.stringify({ A: A })),
                            actions: [
                                {
                                    title: function _(ctx: GameState, effect: Effect, { GameStateFn, DefineFn }: Bridge): GameState {
                                        const cardId = DefineFn.EffectFn.getCardID(effect)
                                        const basyou = GameStateFn.getItemBaSyou(ctx, cardId)
                                        const pairs = GameStateFn.getCardTipStrBaSyouPairs(ctx, "打開自軍手裡或指定HANGER中特徵A並合計國力x以下的1張卡", cardId)
                                        for (const pair of pairs) {
                                            const [targetCardId, targetBasyou] = pair
                                            if (AbsoluteBaSyouFn.getBaSyouKeyword(targetBasyou) == "手札") {
                                                ctx = mapItemState(ctx, targetCardId, is => ({ ...is, isOpenForGain: true })) as GameState
                                            }
                                            ctx = GameStateFn.moveItem(ctx, basyou, [targetCardId, targetBasyou], GameStateFn.onMoveItem) as GameState
                                            ctx = GameStateFn.moveItem(ctx, DefineFn.AbsoluteBaSyouFn.setBaSyouKeyword(basyou, "ジャンクヤード"), [cardId, basyou], GameStateFn.onMoveItem) as GameState
                                            
                                            let targetCard = GameStateFn.getCard(ctx, targetCardId)
                                            targetCard = DefineFn.CardFn.setIsRoll(targetCard, false)
                                            ctx = GameStateFn.setCard(ctx, targetCard.id, targetCard) as GameState
                                            GameStateFn.mapItemState(ctx, targetCardId, ()=> getItemState(ctx, cardId))
                                            // only first
                                            return ctx
                                        }
                                        throw new Error()
                                    }.toString()
                                }
                            ]
                        }
                    }
                }
            ]
        }
    }
    return []
}