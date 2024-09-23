import { Effect } from "../define/Effect"
import { ItemState } from "../define/ItemState"
import { Message } from "../define/Message"
import { PlayerState } from "../define/PlayerState"

export type MessageComponent = {
    messages: Message[],
    messagesCurrentEffect: Effect | null
}

export function addMessage(ctx: MessageComponent, msg: Message): MessageComponent {
    return {
        ...ctx,
        messages: [...ctx.messages, msg]
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