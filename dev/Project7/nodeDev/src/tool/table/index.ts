export type TTable = {
    cardStack: { [key: string]: string[] },
}

function addCard(table: TTable, position: string, cardId: string): TTable {
    if (!table.cardStack[position]) {
        table.cardStack[position] = [cardId];
    } else {
        table.cardStack[position].push(cardId);
    }
    return table;
}

function moveCard(table: TTable, fromPosition: string, toPosition: string, cardId: string): TTable {
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

function getCardPosition(table: TTable, cardId: string): string {
    for (const [key, value] of Object.entries(table.cardStack)) {
        if (value.includes(cardId)) {
            return key;
        }
    }
    throw new Error("Card not found")
}

const DEFAULT_TABLE: TTable = {
    cardStack: {}
}

export default {
    DEFAULT_TABLE, addCard, moveCard, getCardPosition
}