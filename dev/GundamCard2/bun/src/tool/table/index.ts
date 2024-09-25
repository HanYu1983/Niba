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
        //console.log(`table.cardStack[${position}] not found`)
        return []
    }
    return table.cardStack[position]
}

function moveCard(table: Table, fromPosition: string, toPosition: string, cardId: string): Table {
    if (!table.cardStack[fromPosition] || !table.cardStack[fromPosition].includes(cardId)) {
        throw new Error("Card not found in the specified position");
    }
    const updatedFromStack = table.cardStack[fromPosition].filter(id => id !== cardId);
    const updatedToStack = table.cardStack[toPosition] ? [...table.cardStack[toPosition], cardId] : [cardId];
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
    addCard, moveCard, getCardPosition, getCardsByPosition, shuffleCards
}