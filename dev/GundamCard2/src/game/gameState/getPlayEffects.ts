import { log } from "../../tool/logger";
import { PhaseFn, SiYouTiming } from "../define/Timing";
import { CardText, Condition } from "../define/CardText";
import { PlayerA, PlayerB, PlayerID } from "../define/PlayerID";
import { AbsoluteBaSyouFn, BaSyouKeywordFn } from "../define/BaSyou";
import { addCards, createCardWithProtoIds, getCard } from "./CardTableComponent";
import { Effect } from "../define/Effect";
import { getPlayCardEffects } from "./getPlayCardEffect";
import { getCardLikeItemIdsByBasyou, getItemIdsByBasyou, getItemPrototype } from "./ItemTableComponent";
import { getPrototype, loadPrototype } from "../../script";
import { always, flatten, ifElse, lift, map, pipe } from "ramda";
import { createGameState, GameState } from "./GameState";
import { ToolFn } from "../tool";
import { getPhase, setNextPhase, setPhase } from "./PhaseComponent";
import { getCardHasSpeicalEffect, getCardTexts } from "./card";
import { Card } from "../define/Card";
import { setActivePlayerID } from "./ActivePlayerComponent";
import { getTextsFromSpecialEffect } from "./getTextsFromSpecialEffect";
import { getPlayGEffects } from "./getPlayGEffect";
import { Bridge } from "../../script/bridge";
import { TargetMissingError } from "../define/GameError";

export function getPlayEffects(ctx: GameState, playerId: PlayerID): Effect[] {
    log("getPlayEffects", "start")
    const getPlayCardEffectsF = ifElse(
        always(PhaseFn.eq(getPhase(ctx), ["配備フェイズ", "フリータイミング"])),
        pipe(
            always([AbsoluteBaSyouFn.of(playerId, "手札"), AbsoluteBaSyouFn.of(playerId, "ハンガー")]),
            map(basyou => getCardLikeItemIdsByBasyou(ctx, basyou)), flatten,
            map(cardId => getPlayCardEffects(ctx, cardId)), flatten
        ),
        // クイック
        ifElse(
            always(PhaseFn.isFreeTiming(getPhase(ctx))),
            pipe(
                always([AbsoluteBaSyouFn.of(playerId, "手札"), AbsoluteBaSyouFn.of(playerId, "ハンガー")]),
                map(basyou => getCardLikeItemIdsByBasyou(ctx, basyou)), flatten,
                map(cardId => {
                    if (getCardHasSpeicalEffect(ctx, ["クイック"], cardId)) {
                        return getPlayCardEffects(ctx, cardId)
                    }
                    return []
                }),
                flatten
            ),
            always([] as Effect[])
        )
    )

    const getPlayGF = ifElse(
        always(PhaseFn.eq(getPhase(ctx), ["配備フェイズ", "フリータイミング"])),
        pipe(
            always([AbsoluteBaSyouFn.of(playerId, "手札"), AbsoluteBaSyouFn.of(playerId, "ハンガー")]),
            map(basyou => getCardLikeItemIdsByBasyou(ctx, basyou)), flatten,
            map(cardId => {
                const card = getCard(ctx, cardId)
                const proto = getItemPrototype(ctx, card.id)
                if (proto.commandText && inTiming(proto.commandText)) {
                    return [getPlayGEffects(ctx, card.id)]
                }
                return []
            }), flatten
        ),
        always([] as Effect[])
    )

    const getPlayTextF = pipe(
        always(lift(AbsoluteBaSyouFn.of)([playerId], BaSyouKeywordFn.getBaAll())),
        map(basyou => getCardLikeItemIdsByBasyou(ctx, basyou)), flatten,
        map(cardId => {
            return (getCardTexts(ctx, cardId)).flatMap(text => {
                switch (text.title[0]) {
                    case "特殊型":
                        return getTextsFromSpecialEffect(ctx, text)
                    case "TextBattleBonus":
                        return []
                }
                return [text]
            }).filter(inTiming).map(text => {
                const playTextConditions: { [key: string]: Condition } = {
                    "同切上限": {
                        actions: [
                            {
                                title: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn, ToolFn }: Bridge): GameState {
                                    // 使用了卡牌後, 同一個切入不能再使用. 以下記錄使用過的卡片, 會在切入結束後清除
                                    const cardId = DefineFn.EffectFn.getCardID(effect)
                                    const ps = GameStateFn.getItemState(ctx, cardId)
                                    if (ps.textIdsUseThisCut?.[effect.text.id]) {
                                        throw new TargetMissingError(`同切上限: ${effect.text.description}`)
                                    }
                                    ctx = GameStateFn.mapItemState(ctx, cardId, ps => {
                                        return {
                                            ...ps,
                                            textIdsUseThisCut: {
                                                ...ps.textIdsUseThisCut,
                                                [effect.text.id]: true
                                            }
                                        }
                                    }) as GameState
                                    return ctx
                                }.toString()
                            }
                        ]
                    }
                }
                return {
                    id: `getPlayEffects_${playerId}_${cardId}`,
                    reason: ["PlayText", playerId, cardId, text.id],
                    description: text.description,
                    text: {
                        ...text,
                        conditions: {
                            ...text.conditions,
                            //...playTextConditions
                        }
                    }
                } as Effect
            })
        }), flatten
    )
    const getPlayCommandF = ifElse(
        always(PhaseFn.isFreeTiming(getPhase(ctx))),
        pipe(
            always([AbsoluteBaSyouFn.of(playerId, "手札"), AbsoluteBaSyouFn.of(playerId, "ハンガー")]),
            map(basyou => getCardLikeItemIdsByBasyou(ctx, basyou)), flatten,
            map(cardId => {
                const card = getCard(ctx, cardId)
                const proto = getItemPrototype(ctx, card.id)
                if (proto.commandText && inTiming(proto.commandText)) {
                    return getPlayCardEffects(ctx, card.id)
                }
                return []
            }), flatten
        ),
        always([] as Effect[])
    )



    function inTiming(text: CardText): boolean {
        const siYouTiming: SiYouTiming = (() => {
            if (text.title[0] == "使用型") {
                return text.title[1]
            }
            if (text.title[0] == "特殊型") {
                const [_, toku] = text.title;
                const t = getTextsFromSpecialEffect(ctx, text).find((v) => v.title[0] == "使用型");
                if (t == null) {
                    throw new Error("t must find");
                }
                if (t.title[0] != "使用型") {
                    throw new Error("must be 使用型")
                }
                return t.title[1];
            }
            throw new Error("not support:" + text);
        })();
        switch (siYouTiming[0]) {
            case "自軍":
                if (ctx.activePlayerID != playerId) {
                    log(
                        "getPlayEffects",
                        `ctx.activePlayerID != ${playerId}`,
                        text.title, text.description
                    );
                    return false;
                }
                break;
            case "敵軍":
                if (ctx.activePlayerID == playerId) {
                    log(
                        "getPlayEffects",
                        `ctx.activePlayerID == ${playerId}`,
                        text.title, text.description
                    );
                    return false;
                }
                break;
            case "戦闘フェイズ":
                if (ctx.phase[0] != "戦闘フェイズ") {
                    log(
                        "getPlayEffects",
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
                    log(
                        "getPlayEffects",
                        `ctx.timing[0] != "戦闘フェイズ"`,
                        text.title, text.description
                    );
                    return false;
                }
                if (ctx.phase[1] != siYouTiming[0]) {
                    log(
                        "getPlayEffects",
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
                            log(
                                "getPlayEffects",
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
                            log(
                                "getPlayEffects",
                                `ctx.timing[0] != "戦闘フェイズ"`,
                                text.title, text.description
                            );
                            return false;
                        }
                        if (ctx.phase[1] != siYouTiming[1]) {
                            log(
                                "getPlayEffects",
                                `ctx.timing[1] != ${siYouTiming[1]}`,
                                text.title, text.description
                            );
                            return false;
                        }
                        break;
                }
                break;
        }
        return true;
    }

    return [...getPlayCardEffectsF(), ...getPlayGF(), ...getPlayCommandF(), ...getPlayTextF()]
}

export async function testGetPlayEffects() {
    await loadPrototype("179024_03B_U_WT042U_white")
    let ctx = createGameState()
    const cardA: Card = {
        id: "cardA",
        protoID: "179024_03B_U_WT042U_white"
    }
    const cardB: Card = {
        id: "cardB",
        protoID: "179024_03B_U_WT042U_white"
    }
    const cardC: Card = {
        id: "cardC",
        protoID: "179024_03B_U_WT042U_white"
    }
    const cardCProto = getPrototype(cardC.protoID || "unknown")
    ctx = addCards(ctx, AbsoluteBaSyouFn.of(PlayerA, "手札"), [cardA]) as GameState
    ctx = addCards(ctx, AbsoluteBaSyouFn.of(PlayerA, "ハンガー"), [cardB]) as GameState
    ctx = addCards(ctx, AbsoluteBaSyouFn.of(PlayerA, "配備エリア"), [cardC]) as GameState
    {
        const playEffects = getPlayEffects(ctx, PlayerA)
        if (playEffects.length != 0) {
            throw new Error(`playEffects.length != 0`)
        }
    }
    ctx = setPhase(ctx, ["配備フェイズ", "フリータイミング"]) as GameState
    {
        const playEffects = getPlayEffects(ctx, PlayerA)
        if (playEffects.length != 2) {
            throw new Error(`playEffects.length != 2`)
        }
        if (playEffects[0].reason[0] == "PlayCard" && playEffects[0].reason[1] == PlayerA && playEffects[0].reason[2] == cardA.id) {

        } else {
            throw new Error(`playEffects[0].reason[0] == "PlayCard" && playEffects[0].reason[1] == PlayerA && playEffects[0].reason[2] == cardA.id`)
        }
        if (playEffects[1].reason[0] == "PlayCard" && playEffects[1].reason[1] == PlayerA && playEffects[1].reason[2] == cardB.id) {

        } else {
            throw new Error(`playEffects[1].reason[0] == "PlayCard" && playEffects[1].reason[1] == PlayerA && playEffects[1].reason[2] == cardB.id`)
        }
    }
    ctx = setPhase(ctx, ["戦闘フェイズ", "ダメージ判定ステップ", "フリータイミング"]) as GameState
    ctx = setActivePlayerID(ctx, PlayerA) as GameState
    {
        const playEffects = getPlayEffects(ctx, PlayerA)
        if (playEffects.length != 1) {
            throw new Error(`playEffects.length != 1`)
        }
        if (playEffects[0].reason[0] == "PlayText" && playEffects[0].reason[1] == PlayerA && playEffects[0].reason[2] == cardC.id && playEffects[0].reason[3] == cardCProto.texts?.[0].id) {

        } else {
            throw new Error(`playEffects[0].reason[0] == "PlayText" && playEffects[0].reason[1] == PlayerA && playEffects[0].reason[2] == cardC.id && playEffects[0].reason[3] == cardCProto.texts[0].id`)
        }
    }
}