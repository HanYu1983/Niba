
export type Card = {
    id: string
    ownerID?: string
    protoID?: string
    isRoll?: boolean
    isFaceDown?: boolean
}

export const CardFn = {
    setIsRoll(ctx: Card, isRoll: boolean): Card {
        return {
            ...ctx,
            isRoll: isRoll
        }
    }
}
