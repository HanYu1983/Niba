export type Chip = {
    id: string
    ownerID?: string
    protoID?: string
    isRoll?: boolean
}

export const ChipFn = {
    setIsRoll(ctx: Chip, isRoll: boolean): Chip {
        return {
            ...ctx,
            isRoll: isRoll
        }
    }
}