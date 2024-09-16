import { log } from "../../tool/logger";
import { createGameStateWithFlowMemory, GameStateWithFlowMemory } from "./GameStateWithFlowMemory";
import { PhaseFn, SiYouTiming } from "../define/Timing";
import { getTextsFromTokuSyuKouKa, Text } from "../define/Text";
import { PlayerA, PlayerID } from "../define/PlayerID";
import { AbsoluteBaSyouFn, BaSyouKeywordFn } from "../define/BaSyou";
import { addCards, createCardWithProtoIds, getCard } from "../gameState/CardTableComponent";
import { Effect } from "../define/Effect";
import { getPlayCardEffects } from "../gameState/getPlayCardEffect";
import { getItemIdsByBasyou, getItemPrototype } from "../gameState/ItemTableComponent";
import { loadPrototype } from "../../script";
import { always, flatten, ifElse, lift, map, pipe } from "ramda";
import { getCardHasSpeicalEffect, getCurrentPhase, getCurrentTiming, setNextTiming } from "../gameState/GameState";
import { ToolFn } from "../tool";

export function getClientCommand(ctx: GameStateWithFlowMemory, playerId: PlayerID): Effect[] {
    const getPlayCardEffectsF = ifElse(
        always(PhaseFn.eq(getCurrentPhase(ctx), ["配備フェイズ", "フリータイミング"])),
        pipe(
            always([AbsoluteBaSyouFn.of(playerId, "手札"), AbsoluteBaSyouFn.of(playerId, "ハンガー")]),
            map(basyou => getItemIdsByBasyou(ctx, basyou)), flatten,
            map(cardId => getPlayCardEffects(ctx, cardId)), flatten
        ),
        // クイック
        ifElse(
            always(PhaseFn.isFreeTiming(getCurrentPhase(ctx))),
            pipe(
                always([AbsoluteBaSyouFn.of(playerId, "手札"), AbsoluteBaSyouFn.of(playerId, "ハンガー")]),
                map(basyou => getItemIdsByBasyou(ctx, basyou)), flatten,
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
    const getPlayTextF = pipe(
        always(lift(AbsoluteBaSyouFn.of)([playerId], BaSyouKeywordFn.getBaAll())),
        map(basyou => getItemIdsByBasyou(ctx, basyou)), flatten,
        map(cardId => {
            const card = getCard(ctx, cardId)
            const proto = getItemPrototype(ctx, card.id)
            return proto.texts.filter(inTiming).map(text => {
                return {
                    id: ToolFn.getUUID("getClientCommand"),
                    reason: ["PlayText", playerId, cardId, text.id],
                    text: text
                } as Effect
            })
        }), flatten
    )
    const getPlayCommandF = ifElse(
        always(PhaseFn.isFreeTiming(getCurrentPhase(ctx))),
        pipe(
            always([AbsoluteBaSyouFn.of(playerId, "手札"), AbsoluteBaSyouFn.of(playerId, "ハンガー")]),
            map(basyou => getItemIdsByBasyou(ctx, basyou)), flatten,
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

    function inTiming(text: Text): boolean {
        const siYouTiming: SiYouTiming = (() => {
            if (text.title[0] == "使用型") {
                return text.title[1]
            }
            if (text.title[0] == "特殊型") {
                const [_, toku] = text.title;
                const t = getTextsFromTokuSyuKouKa(toku).find((v) => v.title[0] == "使用型");
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
                        "getClientCommand",
                        `ctx.activePlayerID != ${playerId}`,
                        text
                    );
                    return false;
                }
                break;
            case "敵軍":
                if (ctx.activePlayerID == playerId) {
                    log(
                        "getClientCommand",
                        `ctx.activePlayerID == ${playerId}`,
                        text
                    );
                    return false;
                }
                break;
            case "戦闘フェイズ":
                if (ctx.timing[1][0] != "戦闘フェイズ") {
                    log(
                        "getClientCommand",
                        `ctx.timing[1][0] != "戦闘フェイズ"`,
                        text
                    );
                    return false;
                }
                break;
            case "攻撃ステップ":
            case "防御ステップ":
            case "ダメージ判定ステップ":
            case "帰還ステップ":
                if (ctx.timing[1][0] != "戦闘フェイズ") {
                    log(
                        "getClientCommand",
                        `ctx.timing[1][0] != "戦闘フェイズ"`,
                        text
                    );
                    return false;
                }
                if (ctx.timing[1][1] != siYouTiming[0]) {
                    log(
                        "getClientCommand",
                        `ctx.timing[1][1] != ${siYouTiming[0]}`,
                        text
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
                        if (ctx.timing[1][0] != siYouTiming[1]) {
                            log(
                                "getClientCommand",
                                `ctx.timing[1][0] != ${siYouTiming[1]}`,
                                text
                            );
                            return false;
                        }
                        break;
                    case "攻撃ステップ":
                    case "防御ステップ":
                    case "ダメージ判定ステップ":
                    case "帰還ステップ":
                        if (ctx.timing[1][0] != "戦闘フェイズ") {
                            log(
                                "getClientCommand",
                                `ctx.timing[1][0] != "戦闘フェイズ"`,
                                text
                            );
                            return false;
                        }
                        if (ctx.timing[1][1] != siYouTiming[1]) {
                            log(
                                "getClientCommand",
                                `ctx.timing[1][1] != ${siYouTiming[1]}`,
                                text
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

export async function testGetClientCommand() {
    await loadPrototype("179001_01A_CH_WT007R_white")
    let ctx = createGameStateWithFlowMemory()
    ctx = createCardWithProtoIds(ctx, AbsoluteBaSyouFn.of(PlayerA, "手札"), ["179001_01A_CH_WT007R_white"]) as GameStateWithFlowMemory
    ctx = createCardWithProtoIds(ctx, AbsoluteBaSyouFn.of(PlayerA, "ハンガー"), ["179001_01A_CH_WT007R_white"]) as GameStateWithFlowMemory
    ctx = createCardWithProtoIds(ctx, AbsoluteBaSyouFn.of(PlayerA, "配備エリア"), ["179001_01A_CH_WT007R_white"]) as GameStateWithFlowMemory
    {
        const playEffects = getClientCommand(ctx, PlayerA)
        if (playEffects.length != 0) {
            throw new Error(`playEffects.length != 0`)
        }
    }
    ctx = setNextTiming(ctx) as GameStateWithFlowMemory
    {
        const playEffects = getClientCommand(ctx, PlayerA)
        console.log(playEffects)
        if (playEffects.length != 0) {
            throw new Error(`playEffects.length != 0`)
        }
    }
}