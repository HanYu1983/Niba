export type Card = {
  id: string;
  protoID: string;
  faceDown: boolean;
  tap: boolean;
  ownerID: string | null;
};

export type CardStack = { [key: string]: Card[] | undefined };

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
  cardID: string,
  beforeCardID: string | null
): Table {
  const findCard = (table.cardStack[from] || []).filter(
    (card) => card.id == cardID
  );
  if (findCard.length == 0) {
    console.log(table);
    console.log(table.cardStack[from]);
    throw new Error(`找不到要移動的卡:${cardID}`);
  }
  let nextTo = (table.cardStack[to] || [])
  if (beforeCardID != null) {
    const beforeCardIndex = nextTo.findIndex(card => card.id = beforeCardID)
    if (beforeCardIndex != -1) {
      if (beforeCardIndex == 0) {
        nextTo = [findCard[0], ...nextTo]
      } else {
        nextTo = [...nextTo.slice(0, beforeCardIndex), findCard[0], ...nextTo.slice(beforeCardIndex)]
      }
    }
  } else {
    nextTo = [...nextTo, findCard[0]]
  }
  return {
    ...table,
    cardStack: {
      ...table.cardStack,
      [from]: (table.cardStack[from] || []).filter((card) => card.id != cardID),
      [to]: nextTo
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
