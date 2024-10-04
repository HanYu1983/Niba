import { includes } from "ramda";

export type Table = {
    cardStack: { [key: string]: string[] },
}

function addCard(table: Table, position: string, cardId: string): Table {
    return {
        ...table,
        cardStack: {
            ...table.cardStack,
            [position]: [...(table.cardStack[position] || []), cardId]
        }
    }
}

function getCardsByPosition(table: Table, position: string): string[] {
    if (table.cardStack[position] == null) {
        return []
    }
    return table.cardStack[position]
}

function moveCard(table: Table, fromPosition: string, toPosition: string, cardId: string, options?:{insertId?: number}): Table {
    if(fromPosition == toPosition){
        console.warn(`moveCard from ${fromPosition} to ${toPosition}. ignore`)
        return table
    }
    if (table.cardStack[fromPosition]?.includes(cardId) != true) {
        throw new Error(`table from ${fromPosition} not exist ${cardId}`)
    }
    const updatedFromStack = (table.cardStack[fromPosition]?.filter(id => id !== cardId) || [])
    let updatedToStack = table.cardStack[toPosition] || []
    if(options?.insertId != null){
        if(options.insertId < 0){
            throw new Error(`insertId not < 0: ${options.insertId}`)
        }
        if(options.insertId == 0){
            updatedToStack = [cardId, ...updatedToStack]
        } else {
            updatedToStack = [...updatedToStack.slice(0, options.insertId), cardId, ...updatedToStack.slice(options.insertId)]
        }
    } else {
        updatedToStack = [...updatedToStack, cardId]
    }
    return {
        ...table,
        cardStack: {
            ...table.cardStack,
            [fromPosition]: updatedFromStack,
            [toPosition]: updatedToStack,
        },
    }
}

function getCardPosition(table: Table, cardId: string): string | null {
    for (const [key, value] of Object.entries(table.cardStack)) {
        if (value.includes(cardId)) {
            return key;
        }
    }
    return null
}

function shuffleCards(ctx: Table, position: string): Table {
    const cards = ctx.cardStack[position];
    if (!cards) return ctx;
    const shuffledCards = [...cards].sort(() => Math.random() - 0.5);
    return {
        ...ctx,
        cardStack: {
            ...ctx.cardStack,
            [position]: shuffledCards,
        },
    };
}

export const DEFAULT_TABLE: Table = {
    cardStack: {}
}

export const TableFns = {
    addCard, moveCard, getCardPosition, getCardsByPosition, shuffleCards,
    assertDup(table: Table) {
        for (const key in table.cardStack) {
            const cardIdSets: any = {}
            const cs = table.cardStack[key]
            for (const cardId of cs) {
                if (cardIdSets[cardId]) {
                    throw new Error(`dup !! ${cardId} in ${key}`)
                }
                cardIdSets[cardId] = true
            }
        }
    }
}