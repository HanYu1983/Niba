export declare type Card = {
    id: string;
    protoID: string;
    faceDown: boolean;
    tap: boolean;
};
export declare type CardStack = {
    [key: string]: Card[];
};
export declare type TokenPosition = {
    id: 'TokenPositionCard';
    cardID: string;
} | {
    id: 'TokenPositionPlayer';
    playerID: string;
};
export declare type Token = {
    id: string;
    position: TokenPosition;
};
export declare type Table = {
    cardStack: CardStack;
    tokens: Token[];
};
export declare function moveCard(table: Table, from: string, to: string, cardID: string): Table;
export declare function mapCard(table: Table, f: (card: Card) => Card): {
    cardStack: CardStack;
    tokens: Token[];
};
