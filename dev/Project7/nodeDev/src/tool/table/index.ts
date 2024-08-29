export type Table = {
    cardStack: { [key: string]: string[] },
}

export function addCard(table:Table, position: string, cardId:string):Table {
    if (!table.cardStack[position]) {
        table.cardStack[position] = [cardId];
    } else {
        table.cardStack[position].push(cardId);
    }
    return table;
}

export function moveCard(table: Table, fromPosition: string, toPosition: string, cardId: string): Table {
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

export function getCardPosition(table: Table, cardId: string): string {
    for (const [key, value] of Object.entries(table.cardStack)) {
        if (value.includes(cardId)) {
            return key;
        }
    }
    throw new Error("Card not found")
}

export const DEFAULT_TABLE: Table = {
    cardStack: {}
}