import { Effect } from "../define/Effect"
import { ItemState } from "../define/ItemState"
import { Message } from "../define/Message"
import { PlayerState } from "../define/PlayerState"
import { ToolFn } from "../tool"

export type MessageComponent = {
    messageTopId: number,
    messages: Message[],
    messagesCurrentEffect: Effect | null,
    messagesIsPlayerRead: { [key: string]: string[] }
}

export function addMessage(ctx: MessageComponent, msg: Message): MessageComponent {
    if (msg.id == 0) {
        msg.id = ctx.messageTopId
    }
    msg.effect = ctx.messagesCurrentEffect || undefined
    let nextMsgs = [msg, ...ctx.messages]
    if (nextMsgs.length > 200) {
        nextMsgs = nextMsgs.slice(0, 200)
    }
    return {
        ...ctx,
        messageTopId: ctx.messageTopId + 1,
        messages: nextMsgs
    }
}
export function mapMessage(ctx: MessageComponent, fn: (msg: Message) => Message): MessageComponent {
    return {
        ...ctx,
        messages: ctx.messages.map(fn),
    }
}
export function setMessageCurrentEffect(ctx: MessageComponent, effect: Effect | null): MessageComponent {
    return {
        ...ctx,
        messagesCurrentEffect: effect
    }
}
export function getMessageCurrentEffect(ctx: MessageComponent): Effect | null {
    return ctx.messagesCurrentEffect
}
export function setMessageIsRead(ctx: MessageComponent, playerId: string, messageId: string): MessageComponent {
    return {
        ...ctx,
        messagesIsPlayerRead: {
            ...ctx.messagesIsPlayerRead,
            [playerId]: {
                ...ctx.messagesIsPlayerRead[playerId],
                [messageId]: true
            }
        }
    }
}