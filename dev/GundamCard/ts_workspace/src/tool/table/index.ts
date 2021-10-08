export type Card = {
  id: string;
  protoID: string;
  faceDown: boolean;
  tap: boolean;
  ownerID: string | null;
};

export type CardStack = { [key: string]: Card[] };

export type TokenPosition =
  | { id: "TokenPositionCard"; cardID: string }
  | { id: "TokenPositionPlayer"; playerID: string };

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
    throw new Error("xxx");
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

export function getCard(table: Table, cardID: string): Card | null {
  let find: Card | null = null;
  mapCard(table, (card) => {
    if (card.id == cardID) {
      find = card;
    }
    return card;
  });
  return find;
}

let seqID = 0;
export function createCard(
  table: Table,
  ownerID: string | null,
  positionID: string,
  cardProtoIDs: string[]
): Table {
  return {
    ...table,
    cardStack: {
      ...table.cardStack,
      [positionID]: [
        ...(table.cardStack[positionID] || []),
        ...cardProtoIDs.map((protoID: string): Card => {
          return {
            id: `${seqID++}`,
            protoID: protoID,
            ownerID: ownerID,
            tap: false,
            faceDown: true,
          };
        }),
      ],
    },
  };
}
