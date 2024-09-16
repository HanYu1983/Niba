import { log } from "../../tool/logger";
import { createGameStateWithFlowMemory, GameStateWithFlowMemory } from "./GameStateWithFlowMemory";
import { SiYouTiming } from "../define/Timing";
import { getTextsFromTokuSyuKouKa } from "../define/Text";
import { PlayerA, PlayerID } from "../define/PlayerID";
import { AbsoluteBaSyouFn } from "../define/BaSyou";
import { concatMap, filter, lastValueFrom, merge, of, toArray } from "rxjs";
import { addCards, createCardWithProtoIds, getCard } from "../gameState/CardTableComponent";
import { Effect } from "../define/Effect";
import { getPlayCardEffects } from "../gameState/getPlayCardEffect";
import { getItemIdsByBasyou, getItemPrototype } from "../gameState/ItemTableComponent";
import { loadPrototype } from "../../script";

export function getClientCommand(ctx: GameStateWithFlowMemory, playerId: PlayerID): Effect[] {

    const playCardEffects = of(AbsoluteBaSyouFn.of(playerId, "手札"), AbsoluteBaSyouFn.of(playerId, "ハンガー"))
        .pipe(concatMap(basyou => getItemIdsByBasyou(ctx, basyou)))
        .pipe(concatMap(cardId => {
            return [getPlayCardEffects(ctx, cardId)]
        }))

    const playTextCards = of(AbsoluteBaSyouFn.of(playerId, "配備エリア"))
        .pipe(concatMap(basyou => getItemIdsByBasyou(ctx, basyou)))
        .pipe(concatMap(cardId => {
            const card = getCard(ctx, cardId)
            const proto = getItemPrototype(ctx, card.id)
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

export async function testGetClientCommand() {
    await loadPrototype("179001_01A_CH_WT007R_white")
    let ctx = createGameStateWithFlowMemory()
    ctx = createCardWithProtoIds(ctx, AbsoluteBaSyouFn.of(PlayerA, "手札"), ["179001_01A_CH_WT007R_white"]) as GameStateWithFlowMemory
    ctx = createCardWithProtoIds(ctx, AbsoluteBaSyouFn.of(PlayerA, "ハンガー"), ["179001_01A_CH_WT007R_white"]) as GameStateWithFlowMemory
    ctx = createCardWithProtoIds(ctx, AbsoluteBaSyouFn.of(PlayerA, "配備エリア"), ["179001_01A_CH_WT007R_white"]) as GameStateWithFlowMemory
    getClientCommand(ctx, PlayerA)
}