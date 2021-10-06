export type Card = {
  id: string;
  protoId: string;
  faceDown: boolean;
  tap: boolean;
};

export type CardStack = { [key: string]: Card[] };

export type TokenPosition =
  | { id: 'TokenPositionCard'; cardID: string }
  | { id: 'TokenPositionPlayer'; playerID: string };

export type Token = {
  id: string;
  position: TokenPosition;
};

export type Table = {
  cardStack: CardStack;
  tokens: Token[];
};

export function moveCard(
  table: Table,
  from: string,
  to: string,
  cardID: string
): Table {
  const findCard = table.cardStack[from].filter((card) => card.id == cardID);
  if (findCard.length == 0) {
    throw new Error('xxx');
  }
  return {
    ...table,
    cardStack: {
      ...table.cardStack,
      [from]: table.cardStack[from].filter((card) => card.id != cardID),
      [to]: [...(table.cardStack[to] || []), findCard[0]],
    },
  };
}

export function mapCard(table: Table, f: (card: Card) => Card) {
  const nextStack = Object.keys(table.cardStack)
    .map((key): [string, Card[]] => {
      return [key, (table.cardStack[key] || []).map(f)];
    })
    .reduce((acc, [key, cs]) => {
      return {
        ...acc,
        [key]: cs,
      };
    }, {} as CardStack);
  return {
    ...table,
    cardStack: nextStack,
  };
}
