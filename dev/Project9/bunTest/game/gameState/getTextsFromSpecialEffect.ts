import { Bridge } from "../../script/bridge";
import { TextSpeicalEffect, CardText } from "../define/CardText";
import { Effect } from "../define/Effect";
import { Tip } from "../define/Tip";
import { GameState } from "./GameState";

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
                    description: "這張卡在戰區的場合, 打開自軍本國上的1張卡和這張卡同的情況, 這張卡回合結束前+x/+x/+x, x為打開的卡的横置費用數量, 這個效果1回合只能用1次",
                    conditions: {
                        "這張卡在戰區的場合": {
                            actions: [
                                {
                                    title: ["這張卡在戰區的場合"]
                                }
                            ]
                        },
                        "自軍本國上的1張卡": {
                            title: ["自軍本國上的1張卡"]
                        },
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
                                    title: function _() {
                                        // 打開自軍本國上的1張卡
                                        // 這張卡回合結束前+x/+x/+x, x為打開的卡的横置費用數量
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
                    id: "",
                    title: ["使用型", ["自軍", "攻撃ステップ"]],
                    description: "這張卡以外的自軍機體1張重置"
                }
            ]
        }
        case "サイコミュ": {
            const [_, x] = specialEffect
            return [
                {
                    id: "",
                    title: ["使用型", ["防御ステップ"]],
                    description: "交戰中的敵軍機體1張x傷害. 這個效果只有在同區中有NT才能使用.",
                    conditions: {
                        "交戰中的敵軍機體1張": {

                        },
                        "同區中有NT才能使用": {

                        }
                    },
                    logicTreeActions: [
                        {
                            actions: [
                                {
                                    title: ["cutIn", [
                                        {
                                            title: ""
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
                    id: "",
                    title: ["使用型", ["ダメージ判定ステップ"]],
                    description: "和這張卡交戰的防禦力x以下的敵軍機體1張破壞",
                    conditions: {
                        "這張卡交戰的防禦力x以下的敵軍機體1張": {

                        }
                    },
                    logicTreeActions: [
                        {
                            actions: [
                                {
                                    title: ["cutIn", [
                                        {
                                            title: ["破壞"],
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
                    id: "",
                    title: ["使用型", ["常時"]],
                    description: "可以從自軍本國找出特徵A的1張卡移到HANGER, 那個時候本國洗牌. 這個效果只有這張卡從手中打出的回合可以使用",
                    conditions: {
                        "自軍本國找出特徵A的1張卡": {

                        },
                        "這個效果只有這張卡從手中打出的回合可以使用": {

                        }
                    }
                }
            ]
        }
        case "改装": {
            const [_, A] = specialEffect
            return [
                {
                    id: "",
                    title: ["使用型", ["戦闘フェイズ"]],
                    description: "打開自軍手裡或指定HANGER中特徵A並合計國力x以下的1張卡, 和這張卡重置狀態置換, 這張卡置換後廢棄",
                    conditions: {
                        "打開自軍手裡或指定HANGER中特徵A並合計國力x以下的1張卡": {

                        },
                        "這個效果只有這張卡從手中打出的回合可以使用": {

                        }
                    }
                }
            ]
        }
        case "ステイ":
            return []
    }
    return []
}