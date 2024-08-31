import { log } from "../../tool/logger";
import { getCardState } from "../gameState/CardStateComponent";
import { getBlockOwner } from "../gameState/GameState";
import { GameStateWithFlowMemory } from "./GameStateWithFlowMemory";
import { SiYouTiming } from "../define/Timing";
import { TextIDFns } from "../define/TextID";
import { getTextsFromTokuSyuKouKa } from "../define/Text";

export function getClientCommand(ctx: GameStateWithFlowMemory, clientID: string) {
    return ctx.commandEffect.filter((effect) => {
        const controller = getBlockOwner(effect);
        if (controller != clientID) {
            log("getClientCommand", "you are not owner. return");
            return;
        }
        if (effect.reason[0] != "TEffectReasonUpdateCommand") {
            throw new Error("must from command cause");
        }
        const [_, textID] = effect.reason;
        // 在堆疊裡的技能不能再次發動(記免同一個技能一直切入)
        if (
            ctx.stackEffect.filter((e) => {
                if (e.reason[0] != "TEffectReasonUpdateCommand") {
                    return false;
                }
                const [_, textID2] = e.reason;
                if (TextIDFns.eq(textID, textID2)) {
                    return false;
                }
                return true;
            }).length
        ) {
            log("getClientCommand", `cardTextID(${TextIDFns.inspect(textID)})已經在堆疊裡.`);
            return;
        }
        const cardState = getCardState(ctx, TextIDFns.getCardID(textID));
        const text = cardState.cardTextStates.find((v) => v.id == TextIDFns.getTextID(textID));
        if (text == null) {
            throw new Error("must find text");
        }
        const siYouTiming: SiYouTiming = (() => {
            if (text.cardText.title[0] == "使用型") {
                return text.cardText.title[1]
            }
            if (text.cardText.title[0] == "特殊型") {
                const [_, toku] = text.cardText.title;
                const t = getTextsFromTokuSyuKouKa(toku).find((v) => v.title[0] == "使用型");
                if (t == null) {
                    throw new Error("t must find");
                }
                if (t.title[0] != "使用型") {
                    throw new Error("must be 使用型")
                }
                return t.title[1];
            }
            throw new Error("not support:" + text.cardText);
        })();
        switch (siYouTiming[0]) {
            case "自軍":
                if (ctx.activePlayerID != clientID) {
                    log(
                        "getClientCommand",
                        `ctx.activePlayerID != ${clientID}`,
                        effect
                    );
                    return;
                }
                break;
            case "敵軍":
                if (ctx.activePlayerID == clientID) {
                    log(
                        "getClientCommand",
                        `ctx.activePlayerID == ${clientID}`,
                        effect
                    );
                    return;
                }
                break;
            case "戦闘フェイズ":
                if (ctx.timing[1][0] != "戦闘フェイズ") {
                    log(
                        "getClientCommand",
                        `ctx.timing[1][0] != "戦闘フェイズ"`,
                        effect
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
                        effect
                    );
                    return;
                }
                if (ctx.timing[1][1] != siYouTiming[0]) {
                    log(
                        "getClientCommand",
                        `ctx.timing[1][1] != ${siYouTiming[0]}`,
                        effect
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
                                effect
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
                                effect
                            );
                            return;
                        }
                        if (ctx.timing[1][1] != siYouTiming[1]) {
                            log(
                                "getClientCommand",
                                `ctx.timing[1][1] != ${siYouTiming[1]}`,
                                effect
                            );
                            return;
                        }
                        break;
                }
                break;
        }
        return true;
    });
}

