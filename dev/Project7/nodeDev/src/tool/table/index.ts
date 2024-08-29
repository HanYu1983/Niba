export type TableType = {
    cardStack: { [key: string]: string[] },
}

function addCard(table: TableType, position: string, cardId: string): TableType {
    if (!table.cardStack[position]) {
        table.cardStack[position] = [cardId];
    } else {
        table.cardStack[position].push(cardId);
    }
    return table;
}

function moveCard(table: TableType, fromPosition: string, toPosition: string, cardId: string): TableType {
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

function getCardPosition(table: TableType, cardId: string): string {
    for (const [key, value] of Object.entries(table.cardStack)) {
        if (value.includes(cardId)) {
            return key;
        }
    }
    throw new Error("Card not found")
}

const DEFAULT_TABLE: TableType = {
    cardStack: {}
}

export default {
    DEFAULT_TABLE, addCard, moveCard, getCardPosition
}