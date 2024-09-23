import { ItemState } from "../define/ItemState"
import { Message } from "../define/Message"
import { PlayerState } from "../define/PlayerState"

export type MessageComponent = {
    messages: Message[],
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
