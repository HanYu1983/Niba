export type MessageTitle =
    | []

export type Message = {
    id: string,
    title: MessageTitle,
    isPlayerRead: { [key: string]: boolean }
}