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
    // null代表系統負責
    | ["GameRule", PlayerID | null]
    // 只要破壞狀態沒有被取消的話就會產生廢棄的效果, 這個移動效果不能被防止(p40, p72)
    | ["Destroy", PlayerID, string, DestroyReason]
    | ["Situation", PlayerID, string, Situation | null]
    | ["Event", PlayerID, string, GameEvent];

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
                // 通常GameRule是沒有第三個cardId的, 存在的目的是為了方便套用程式碼邏輯, 讓沒有cardId的效果也能存入TipSelection到ItemState中
                return `SystemFakeCardID_${ctx.text.id}`
            case "PlayText":
            case "PlayCard":
            case "場に出る":
            case "Destroy":
            case "Situation":
            case "Event":
                return ctx.reason[2]
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
            case "Event":
                return ctx.reason[1]
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
                return ctx.reason[3]
            default:
                throw new Error(`${ctx.reason[0]} no Event`)
        }
    }
}