import { Bridge } from "../../script/bridge";
import { AbsoluteBaSyouFn } from "../define/BaSyou";
import { TextSpeicalEffect, CardText } from "../define/CardText";
import { Effect, EffectFn } from "../define/Effect";
import { ItemStateFn } from "../define/ItemState";
import { PhaseFn } from "../define/Timing";
import { isABattleGroup, isBattleGroupHasA } from "./battleGroup";
import { onMoveItem } from "./effect";
import { addImmediateEffect } from "./EffectStackComponent";
import { GameState } from "./GameState";
import { getItemState, setItemState } from "./ItemStateComponent";
import { getItemBaSyou, getItemController, moveItem } from "./ItemTableComponent";

export function getTextsFromSpecialEffect(text: CardText): CardText[] {
    if (text.title[0] != "特殊型") {
        throw new Error(`text not 特殊型`)
    }
    switch (text.title[1][0]) {
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
                    onEvent: function (ctx: GameState, effect: Effect): GameState {
                        const cardId = EffectFn.getCardID(effect)
                        const cardController = getItemController(ctx, cardId)
                        const evt = EffectFn.getEvent(effect)
                        if (evt.title[0] == "GameEventOnMove" &&
                            (
                                AbsoluteBaSyouFn.getBaSyouKeyword(evt.title[2]) == "戦闘エリア1" ||
                                AbsoluteBaSyouFn.getBaSyouKeyword(evt.title[2]) == "戦闘エリア2"
                            )
                        ) {
                            // 如果這張卡移到戰區
                            if (evt.cardIds?.includes(cardId)) {
                                // 判斷同區有沒有補給或供給
                                const hasSupply = isBattleGroupHasA(ctx, ["供給"], cardId)
                                if (hasSupply) {
                                    // do nothing
                                } else {
                                    // 回家旗標
                                    let cs = getItemState(ctx, cardId)
                                    cs = ItemStateFn.setFlag(cs, "return", true)
                                    ctx = setItemState(ctx, cardId, cs) as GameState
                                }
                            } else {
                                // 如果別張卡移到這張卡的戰區
                                if (AbsoluteBaSyouFn.eq(getItemBaSyou(ctx, cardId), evt.title[2])) {
                                    // 判斷新來的卡有沒有補給或供給
                                    // 如果有, 就刪除回家旗標
                                    const hasSupply = isBattleGroupHasA(ctx, ["供給"], cardId)
                                    if (hasSupply) {
                                        // 回家旗標
                                        let cs = getItemState(ctx, cardId)
                                        cs = ItemStateFn.removeFlag(cs, "return")
                                        ctx = setItemState(ctx, cardId, cs) as GameState
                                    }
                                }
                            }
                        }
                        // 到下個回合開始時
                        if (evt.title[0] == "GameEventOnTiming" &&
                            PhaseFn.eq(evt.title[1], PhaseFn.getFirst())
                        ) {
                            // 如果有回家旗標就回家
                            const cardId = EffectFn.getCardID(effect)
                            const cardController = getItemController(ctx, cardId)
                            let cs = getItemState(ctx, cardId)
                            if (cs.flags["return"]) {
                                ctx = moveItem(ctx, AbsoluteBaSyouFn.of(cardController, "手札"), [cardId, getItemBaSyou(ctx, cardId)], onMoveItem) as GameState
                                cs = ItemStateFn.removeFlag(cs, "return")
                                ctx = setItemState(ctx, cardId, cs) as GameState
                            }
                            // ctx = addImmediateEffect(ctx, {
                            //     id: "",
                            //     reason: ["PlayText", cardController, cardId, effect.text.id],
                            //     description: effect.text.description,
                            //     text: {
                            //         id: "",
                            //         title: [],
                            //         description: effect.text.description,
                            //         logicTreeActions: [
                            //             {
                            //                 actions: [
                            //                     {
                            //                         title: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn }: Bridge): GameState {
                            //                             const cardId = DefineFn.EffectFn.getCardID(effect)
                            //                             const cardController = GameStateFn.getItemController(ctx, cardId)
                            //                             let cs = GameStateFn.getItemState(ctx, cardId)
                            //                             if (cs.flags["return"]) {
                            //                                 ctx = GameStateFn.moveItem(ctx, AbsoluteBaSyouFn.of(cardController, "手札"), [cardId, GameStateFn.getItemBaSyou(ctx, cardId)], onMoveItem) as GameState
                            //                                 cs = ItemStateFn.removeFlag(cs, "return")
                            //                                 ctx = setItemState(ctx, cardId, cs) as GameState
                            //                             }
                            //                             return ctx
                            //                         }.toString()
                            //                     }
                            //                 ]
                            //             }
                            //         ]
                            //     }
                            // }) as GameState
                        }
                        return ctx
                    }
                }
            ]
        }
    }
    return []
}