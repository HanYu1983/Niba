import { GameEvent } from "./GameEvent";
import { PlayerID } from "./PlayerID";
import { Situation, CardText, Condition, Action, LogicTreeAction } from "./CardText";

export type DamageTypeKeyword = "通常ダメージ" | "戦闘ダメージ"

export type DestroyReason1 = {
    id: DamageTypeKeyword | "破壊する" | "マイナスの戦闘修正";
    // 誰造成的
    playerID: string;
};

export type DestroyReason = DestroyReason1

export type EffectReason =
    | ["場に出る", PlayerID, string]
    | ["PlayCard", PlayerID, string, { isPlayG?: boolean, isPlayUnit?: boolean, isPlayCharacter?: boolean, isPlayCommand?: boolean, isPlayOperationUnit?: boolean, isPlayOperation?: boolean }]
    | ["PlayText", PlayerID, string, string]
    // null代表系統負責
    | ["GameRule", PlayerID | null, { isAttack?: boolean, isDefence?: boolean, isReturn?: boolean, isDamageCheck?: boolean, isDraw?: boolean, isReroll?: boolean, isDiscard?: boolean }]
    // 只要破壞狀態沒有被取消的話就會產生廢棄的效果, 這個移動效果不能被防止(p40, p72)
    | ["Destroy", PlayerID, string, DestroyReason]
    | ["Situation", PlayerID, string, Situation | null]
    | ["Event", PlayerID, string, GameEvent];

export type Effect = {
    id: string,
    reason: EffectReason
    text: CardText
    description?: string
    isOption?: boolean,
}

export const EffectFn = {
    createEmptyPlayCard(playerId: PlayerID, cardId: string): Effect {
        return { id: "", reason: ["PlayCard", playerId, cardId, {}], text: { id: "", title: [] } }
    },

    isFakeCardID(string: string): boolean {
        return string.startsWith("SystemFakeCardID_")
    },

    createFakeCardID(textId: string): string {
        return `SystemFakeCardID_${textId}`
    },

    getCardID(ctx: Effect): string {
        switch (ctx.reason[0]) {
            case "GameRule":
                // 通常GameRule是沒有第三個cardId的, 存在的目的是為了方便套用程式碼邏輯, 讓沒有cardId的效果也能存入TipSelection到ItemState中
                return EffectFn.createFakeCardID(ctx.text.id)
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
    },

    fromEffectBasic(e: Effect, options?: { reason?: EffectReason, conditions?: { [key: string]: Condition }, logicTreeAction?: LogicTreeAction, isOption?: boolean, description?: string }): Effect {
        return {
            id: "",
            reason: options?.reason || e.reason,
            description: options?.description || e.description,
            isOption: options?.isOption,
            text: {
                id: e.text.id,
                title: e.text.title,
                description: options?.description || e.text.description,
                conditions: options?.conditions || undefined,
                logicTreeActions: options?.logicTreeAction ? [options.logicTreeAction] : [
                    {
                        actions: []
                    }
                ]
            }
        }
    }
}