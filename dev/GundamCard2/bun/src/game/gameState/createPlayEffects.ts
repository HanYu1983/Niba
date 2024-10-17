import { logCategory } from "../../tool/logger";
import { PhaseFn, SiYouTiming } from "../define/Timing";
import { CardText, CardTextFn, Condition } from "../define/CardText";
import { PlayerA, PlayerB, PlayerID } from "../define/PlayerID";
import { AbsoluteBaSyouFn, BaSyouKeywordFn } from "../define/BaSyou";
import { addCards, createCardWithProtoIds, getCard } from "./CardTableComponent";
import { Effect } from "../define/Effect";
import { createPlayCardEffects } from "./createPlayCardEffects";
import { getItem, getItemBaSyou, getItemIdsByBasyou, getItemPrototype } from "./ItemTableComponent";
import { getPrototype, loadPrototype } from "../../script";
import { always, concat, flatten, ifElse, lift, map, pipe } from "ramda";
import { createGameState, GameState } from "./GameState";
import { getPhase, setPhase } from "./PhaseComponent";
import { getCardHasSpeicalEffect, getCardTexts } from "./card";
import { createTextsFromSpecialEffect } from "./createTextsFromSpecialEffect";
import { getGlobalEffects, setGlobalEffects } from "./globalEffects";
import { LogicTree } from "../../tool/logicTree";

export function createPlayEffects(ctx: GameState, playerId: PlayerID): Effect[] {
    logCategory("createPlayEffects", "")
    const ges = getGlobalEffects(ctx, null)
    ctx = setGlobalEffects(ctx, null, ges)
    const myTextOn = lift(AbsoluteBaSyouFn.of)([playerId], BaSyouKeywordFn.getTextOn())
    const getPlayCardEffectsF =
        ifElse(
            always(PhaseFn.eq(getPhase(ctx), ["配備フェイズ", "フリータイミング"])),
            pipe(
                always(myTextOn),
                map(basyou => getItemIdsByBasyou(ctx, basyou)), flatten,
                map(cardId => {
                    // 指令在一個部分計算
                    if (getItemPrototype(ctx, cardId).category == "コマンド") {
                        return []
                    }
                    return createPlayCardEffects(ctx, cardId).filter(eff => inTiming(eff.text))
                }), flatten,
            ),
            // クイック
            ifElse(
                always(PhaseFn.isFreeTiming(getPhase(ctx))),
                pipe(
                    always(myTextOn),
                    map(basyou => getItemIdsByBasyou(ctx, basyou)), flatten,
                    map(cardId => {
                        // 指令在一個部分計算
                        if (getItemPrototype(ctx, cardId).category == "コマンド") {
                            return []
                        }
                        if (getCardHasSpeicalEffect(ctx, ["クイック"], cardId, { ges: ges })) {
                            // クイック不判斷使用時機inTiming
                            return createPlayCardEffects(ctx, cardId, { isQuick: true })
                        }
                        return []
                    }),
                    flatten
                ),
                always([] as Effect[])
            )
        )

    const getPlayCommandF = ifElse(
        always(PhaseFn.isFreeTiming(getPhase(ctx))),
        pipe(
            always(myTextOn),
            map(basyou => getItemIdsByBasyou(ctx, basyou)), flatten,
            map(cardId => {
                const item = getItem(ctx, cardId)
                const proto = getItemPrototype(ctx, item.id)
                if (proto.category != "コマンド") {
                    return []
                }
                return createPlayCardEffects(ctx, item.id)
            }), flatten,
            effs => effs.filter(eff => inTiming(eff.text))
        ),
        always([] as Effect[])
    )

    const getPlayTextF = pipe(
        always(lift(AbsoluteBaSyouFn.of)([playerId], [...BaSyouKeywordFn.getBaAll(), "Gゾーン"])),
        map(basyou => {
            const cardIds = getItemIdsByBasyou(ctx, basyou)
            return cardIds.flatMap(
                cardId => getCardTexts(ctx, cardId, { ges: ges })
                    .flatMap(text => {
                        logCategory("createPlayEffect", cardId, text.description)
                        if (AbsoluteBaSyouFn.getBaSyouKeyword(basyou) == "Gゾーン") {
                            if (text.protectLevel != 2) {
                                return []
                            }
                        }
                        switch (text.title[0]) {
                            case "使用型":
                                return [text]
                            case "特殊型":
                                return createTextsFromSpecialEffect(text, { ges: ges, cardId: cardId }).filter(text => text.title[0] == "使用型")
                        }
                        return []
                    }).filter(inTiming).map(text => {
                        logCategory("createPlayEffect", "====== after inTiming ======")
                        logCategory("createPlayEffect", cardId, text.description)
                        const playTextConditions: { [key: string]: Condition } = {
                            // 沒有同切上限，只有一回合能用多少次，基本上是1次
                            // "同切上限": {
                            //     actions: [
                            //         {
                            //             title: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn, ToolFn }: Bridge): GameState {
                            //                 // 使用了卡牌後, 同一個切入不能再使用. 以下記錄使用過的卡片, 會在切入結束後清除
                            //                 const cardId = DefineFn.EffectFn.getCardID(effect)
                            //                 const ps = GameStateFn.getItemState(ctx, cardId)
                            //                 if (ps.textIdsUseThisCut?.[effect.text.id]) {
                            //                     throw new DefineFn.TipError(`同切上限: ${effect.text.description}`)
                            //                 }
                            //                 ctx = GameStateFn.mapItemState(ctx, cardId, ps => {
                            //                     return {
                            //                         ...ps,
                            //                         textIdsUseThisCut: {
                            //                             ...ps.textIdsUseThisCut,
                            //                             [effect.text.id]: true
                            //                         }
                            //                     }
                            //                 }) as GameState
                            //                 return ctx
                            //             }.toString()
                            //         }
                            //     ]
                            // },
                            "同回合上限": {
                                actions: [
                                    {
                                        title: ["同回合上限", 1]
                                    }
                                ]
                            }
                        }
                        // 合併邏輯樹
                        const logicLeafs: LogicTree[] = Object.keys(playTextConditions).map(k => {
                            const ret: LogicTree = {
                                type: "Leaf",
                                value: k
                            }
                            return ret
                        })
                        const logicTree: LogicTree = {
                            type: "And",
                            children: text.logicTreeActions?.[0] ?
                                [...logicLeafs, ...CardTextFn.getLogicTreeTreeLeafs(text, text.logicTreeActions[0])] :
                                logicLeafs
                        }
                        return {
                            id: `createPlayEffects_${playerId}_${cardId}_${text.id}`,
                            reason: ["PlayText", playerId, cardId, text.id],
                            description: text.description,
                            text: {
                                ...text,
                                conditions: {
                                    ...text.conditions,
                                    ...playTextConditions
                                },
                                logicTreeActions: [
                                    {
                                        logicTree: logicTree,
                                        actions: text.logicTreeActions?.[0].actions || []
                                    }
                                ]
                            }
                        } as Effect
                    })
            )
        }), flatten
    )

    function inTiming(text: CardText): boolean {
        const siYouTiming: SiYouTiming = (() => {
            if (text.title[0] == "使用型") {
                return text.title[1]
            }
            throw new Error("not support:" + text.title[0] + ":" + text.description);
        })();
        switch (siYouTiming[0]) {
            case "自軍":
                if (ctx.activePlayerID != playerId) {
                    logCategory(
                        "createPlayEffects",
                        `ctx.activePlayerID != ${playerId}`,
                        text.title, text.description
                    );
                    return false;
                }
                break;
            case "敵軍":
                if (ctx.activePlayerID == playerId) {
                    logCategory(
                        "createPlayEffects",
                        `ctx.activePlayerID == ${playerId}`,
                        text.title, text.description
                    );
                    return false;
                }
                break;
            case "戦闘フェイズ":
                if (ctx.phase[0] != "戦闘フェイズ") {
                    logCategory(
                        "createPlayEffects",
                        `ctx.timing[0] != "戦闘フェイズ"`,
                        text.title, text.description
                    );
                    return false;
                }
                break;
            case "攻撃ステップ":
            case "防御ステップ":
            case "ダメージ判定ステップ":
            case "帰還ステップ":
                if (ctx.phase[0] != "戦闘フェイズ") {
                    logCategory(
                        "createPlayEffects",
                        `ctx.timing[0] != "戦闘フェイズ"`,
                        text.title, text.description
                    );
                    return false;
                }
                if (ctx.phase[1] != siYouTiming[0]) {
                    logCategory(
                        "createPlayEffects",
                        `ctx.timing[1] != ${siYouTiming[0]}`,
                        text.title, text.description
                    );
                    return false;
                }
                break;
        }
        switch (siYouTiming[0]) {
            case "自軍":
            case "敵軍":
                switch (siYouTiming[1]) {
                    case "配備フェイズ":
                    case "戦闘フェイズ":
                        if (ctx.phase[0] != siYouTiming[1]) {
                            logCategory(
                                "createPlayEffects",
                                `ctx.timing[0] != ${siYouTiming[1]}`,
                                text.title, text.description
                            );
                            return false;
                        }
                        break;
                    case "攻撃ステップ":
                    case "防御ステップ":
                    case "ダメージ判定ステップ":
                    case "帰還ステップ":
                        if (ctx.phase[0] != "戦闘フェイズ") {
                            logCategory(
                                "createPlayEffects",
                                `ctx.timing[0] != "戦闘フェイズ"`,
                                ctx.phase, text.title, text.description
                            );
                            return false;
                        }
                        if (ctx.phase[1] != siYouTiming[1]) {
                            logCategory(
                                "createPlayEffects",
                                `ctx.timing[1] != ${siYouTiming[1]}`,
                                ctx.phase, text.title, text.description
                            );
                            return false;
                        }
                        break;
                }
                break;
        }
        return true;
    }

    return [...getPlayCardEffectsF(), ...getPlayCommandF(), ...getPlayTextF()]
}