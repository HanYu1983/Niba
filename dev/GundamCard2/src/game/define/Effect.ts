import { GameEvent } from "./GameEvent";
import { PlayerID } from "./PlayerID";
import { Situation, CardText } from "./CardText";

export type DestroyReason1 = {
    id: "通常ダメージ" | "戦闘ダメージ" | "破壊する" | "マイナスの戦闘修正";
    // 誰造成的
    playerID: string;
};

export type DestroyReason = DestroyReason1

export type EffectReason =
    | ["場に出る", PlayerID, string]
    | ["PlayCard", PlayerID, string]
    | ["PlayText", PlayerID, string, string]
    // 通常GameRule是沒有第三個cardId的, 存在的目的是為了方便套用程式碼邏輯, 讓沒有cardId的效果也能存入TipSelection到ItemState中
    | ["GameRule", PlayerID | null]
    | ["Destroy", PlayerID, string, DestroyReason]
    | ["Situation", PlayerID, string, Situation | null]
    | ["Event", string, GameEvent];

export type Effect = {
    id: string,
    reason: EffectReason
    text: CardText
    description?: string
    isOption?: boolean
    // TODO: delete
    requirePassed?: boolean
}

export const EffectFn = {
    getCardID(ctx: Effect): string {
        switch (ctx.reason[0]) {
            case "GameRule":
                return "SystemFakeCardID"

            case "PlayText":
            case "PlayCard":
            case "場に出る":
            case "Destroy":
            case "Situation":
                return ctx.reason[2]

            case "Event":
                return ctx.reason[1]
        }
    },

    getPlayerID(ctx: Effect): PlayerID {
        switch (ctx.reason[0]) {
            case "GameRule":
                if (ctx.reason[1] == null) {
                    throw new Error(`this GameRule not playerID: ${ctx.id} ${ctx.description}`);
                }
                return ctx.reason[1]

            case "PlayText":
            case "場に出る":
            case "PlayCard":
            case "Destroy":
            case "Situation":
                return ctx.reason[1]
            case "Event":
                throw new Error(`${ctx.reason[0]} no playerID`)
        }
    },

    getSituation(ctx: Effect): Situation | null {
        switch (ctx.reason[0]) {
            case "Situation":
                return ctx.reason[3]
            default:
                throw new Error(`${ctx.reason[0]} no Situation`)
        }
    },

    getDestroyReason(ctx: Effect): DestroyReason {
        switch (ctx.reason[0]) {
            case "Destroy":
                return ctx.reason[3]
            default:
                throw new Error(`${ctx.reason[0]} no DestroyReason`)
        }
    },

    getEvent(ctx: Effect): GameEvent {
        switch (ctx.reason[0]) {
            case "Event":
                return ctx.reason[2]
            default:
                throw new Error(`${ctx.reason[0]} no Event`)
        }
    }
}