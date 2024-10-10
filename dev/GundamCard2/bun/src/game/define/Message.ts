import { Effect } from "./Effect"

export type MessageTitle =
    | []

export type Message = {
    id: number,
    title?: MessageTitle,
    description?: string,
    effect?: Effect,
}