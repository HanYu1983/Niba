import { log } from "../../tool/logger";
import { DEFAULT_GAME_STATE_WITH_FLOW_MEMORY, GameStateWithFlowMemory } from "./GameStateWithFlowMemory";
import { SiYouTiming } from "../define/Timing";
import { getTextsFromTokuSyuKouKa } from "../define/Text";
import { PlayerA, PlayerID } from "../define/PlayerID";
import { AbsoluteBaSyouOf } from "../define/BaSyou";
import { concatMap, filter, lastValueFrom, merge, of, toArray } from "rxjs";
import { addCards, createCardWithProtoIds, getCard, getCardBaSyou, getCardIdsByBasyou } from "../gameState/CardTableComponent";
import { Effect } from "../define/Effect";
import { Bridge } from "../../script/bridge";
import { getPreloadPrototype } from "../../script";

function getPlayCardEffect(ctx: GameStateWithFlowMemory, playerId: PlayerID, cardId: string): Effect {
    return {
        id: "",
        reason: ["PlayCard", playerId, cardId],
        text: {
            title: [],
            conditions: {
                "1": {
                    title: ["total(x)", 3],
                    actions: [
                        {
                            title: ["(このカード)を(リロール)する", ["abc"], "リロール"]
                        }
                    ]
                },
                "2": {
                    title: ["c(x)", "白", 2],
                    actions: [
                        {
                            title: ["(このカード)を(リロール)する", ["abc"], "リロール"]
                        }
                    ]
                }
            },
            logicTreeCommands: [
                {
                    actions: [
                        {
                            title: ["(このカード)を(リロール)する", ["abc"], "リロール"]
                        },
                        {
                            title: function _(bridge: Bridge, effect: Effect) {
                                bridge.cutIn({
                                    id: "",
                                    reason: ["場に出る", playerId, bridge.getEffectCardID(effect)],
                                    text: {
                                        title: [],
                                        logicTreeCommands: [
                                            {
                                                actions: [
                                                    {
                                                        title: ["(このカード)を(リロール)する", [bridge.getEffectCardID(effect)], "リロール"]
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                })
                            }.toString()
                        }
                    ]
                }
            ]
        }
    }
}

export function getClientCommand(ctx: GameStateWithFlowMemory, playerId: PlayerID): Effect[] {
    ctx = createCardWithProtoIds(ctx, playerId, AbsoluteBaSyouOf(playerId, "手札"), ["179001_01A_CH_WT007R_white"]) as GameStateWithFlowMemory
    ctx = createCardWithProtoIds(ctx, playerId, AbsoluteBaSyouOf(playerId, "ハンガー"), ["179001_01A_CH_WT007R_white"]) as GameStateWithFlowMemory
    ctx = createCardWithProtoIds(ctx, playerId, AbsoluteBaSyouOf(playerId, "配備エリア"), ["179001_01A_CH_WT007R_white"]) as GameStateWithFlowMemory
    const playCardEffects = of(AbsoluteBaSyouOf(playerId, "手札"), AbsoluteBaSyouOf(playerId, "ハンガー"))
        .pipe(concatMap(basyou => getCardIdsByBasyou(ctx, basyou)))
        .pipe(concatMap(cardId => {
            return [getPlayCardEffect(ctx, playerId, cardId)]
        }))

    const playTextCards = of(AbsoluteBaSyouOf(playerId, "配備エリア"))
        .pipe(concatMap(basyou => getCardIdsByBasyou(ctx, basyou)))
        .pipe(concatMap(cardId => {
            const card = getCard(ctx, cardId)
            const proto = getPreloadPrototype(card.protoID)
            const textsInTime = proto.texts.filter(text => {
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
                            return;
                        }
                        break;
                    case "敵軍":
                        if (ctx.activePlayerID == playerId) {
                            log(
                                "getClientCommand",
                                `ctx.activePlayerID == ${playerId}`,
                                text
                            );
                            return;
                        }
                        break;
                    case "戦闘フェイズ":
                        if (ctx.timing[1][0] != "戦闘フェイズ") {
                            log(
                                "getClientCommand",
                                `ctx.timing[1][0] != "戦闘フェイズ"`,
                                text
                            );
                            return;
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
                            return;
                        }
                        if (ctx.timing[1][1] != siYouTiming[0]) {
                            log(
                                "getClientCommand",
                                `ctx.timing[1][1] != ${siYouTiming[0]}`,
                                text
                            );
                            return;
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
                                    return;
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
                                    return;
                                }
                                if (ctx.timing[1][1] != siYouTiming[1]) {
                                    log(
                                        "getClientCommand",
                                        `ctx.timing[1][1] != ${siYouTiming[1]}`,
                                        text
                                    );
                                    return;
                                }
                                break;
                        }
                        break;
                }
                return true;
            })
            return textsInTime.map(text => {
                return {
                    id: "",
                    reason: ["場に出る", playerId, ""],
                    text: text
                } as Effect
            })
        }))
    const allEffects = merge(playCardEffects, playTextCards).pipe(toArray())
    let ret: any;
    allEffects.subscribe(effects => {
        ret = effects;
    });
    return ret
}

export function testGetClientCommand() {
    const ctx = DEFAULT_GAME_STATE_WITH_FLOW_MEMORY
    getClientCommand(ctx, PlayerA)
}