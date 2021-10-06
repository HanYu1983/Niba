type Color = 'blue' | 'black' | 'red';

type ColorPayment = {
  id: 'ColorPayment';
  color: Color;
  cardID: string;
};

type TapPayment = {
  id: 'TapPayment';
  cardID: string;
};

type GCountPayment = {
  id: 'GCountPayment';
  gCount: number;
};

type Payment = (ColorPayment | TapPayment | GCountPayment) & {
  reason?: string;
};

type PlayCardAction = {
  id: 'PlayCardAction';
  cardID: string;
  position: string;
};

type PlayCardAbilityAction = {
  id: 'PlayCardAbilityAction';
  cardID: string;
  abilityID: string;
};

type TapCardToGenG = {
  id: 'TapCardToGenG';
  cardID: string;
};

type CancelPayment = {
  id: 'CancelPayment';
  cardID: string;
};

type ApplyPayment = {
  id: 'ApplyPayment';
  cardID: string;
};

type Action = (
  | PlayCardAction
  | PlayCardAbilityAction
  | TapCardToGenG
  | CancelPayment
  | ApplyPayment
) & { playerID: string };

type PaymentTable = {
  action: Action | null;
  requires: Payment[];
  currents: Payment[];
  snapshot: Context | null;
};

type Context = {
  paymentTable: PaymentTable;
};

function queryAction(ctx: Context, playerID: string): Action[] {
  return [
    {
      id: 'PlayCardAction',
      cardID: '',
      playerID: playerID,
      position: '',
    },
  ];
}

function onCardStage(ctx: Context, cardID: string): Context {
  return ctx;
}

function applyAction(ctx: Context, playerID: string, action: Action): Context {
  switch (action.id) {
    case 'ApplyPayment':
      if (ctx.paymentTable.action == null) {
        throw new Error('no payment');
      }
      if (ctx.paymentTable.action.playerID != playerID) {
        throw new Error('your are not owner');
      }
      // TODO: play card
      switch (ctx.paymentTable.action.id) {
        case 'PlayCardAction':
          {
            // TODO: move card to position
            // TODO: 觸發卡牌進場事件
            ctx = onCardStage(ctx, ctx.paymentTable.action.cardID);
          }
          break;
        case 'PlayCardAbilityAction':
          break;
        default:
          throw new Error('unknown action');
      }
      return {
        ...ctx,
        paymentTable: {
          ...ctx.paymentTable,
          action: null,
          snapshot: null,
        },
      };
    case 'CancelPayment':
      if (ctx.paymentTable.action == null) {
        return ctx;
      }
      if (ctx.paymentTable.snapshot == null) {
        throw new Error('snapshot not found');
      }
      if (ctx.paymentTable.action.playerID != playerID) {
        throw new Error('your are not owner');
      }
      return ctx.paymentTable.snapshot;
    case 'PlayCardAction':
      {
        // TODO: change to payment mode
        ctx = {
          ...ctx,
          paymentTable: {
            action: action,
            requires: queryPlayCardPayment(ctx, playerID, action.cardID),
            currents: [],
            snapshot: ctx,
          },
        };
      }
      break;
    case 'PlayCardAbilityAction':
      {
        // TODO: change to payment mode
        ctx = {
          ...ctx,
          paymentTable: {
            action: action,
            requires: [],
            currents: [],
            snapshot: ctx,
          },
        };
      }
      break;
    case 'TapCardToGenG':
      {
        // TODO: tap card
        ctx = {
          ...ctx,
          paymentTable: {
            ...ctx.paymentTable,
            currents: [
              ...ctx.paymentTable.currents,
              {
                id: 'ColorPayment',
                color: 'blue',
                cardID: action.cardID,
              },
            ],
          },
        };
      }
      break;
  }
  return ctx;
}

function queryPlayCardPayment(
  ctx: Context,
  playerID: string,
  cardID: string
): Payment[] {
  const payments: Payment[] = [];
  payments.push(
    ...[
      {
        id: 'ColorPayment',
        color: 'blue',
        cardID: '',
      } as ColorPayment,
      {
        id: 'GCountPayment',
        gCount: 2,
      } as GCountPayment,
    ]
  );
  return payments;
}

function checkPayment(ctx: Context): [boolean, string[]] {
  const passed: { [key: number]: boolean } = [];
  const consumed: { [key: number]: boolean } = [];
  for (const requireID in ctx.paymentTable.requires) {
    const require = ctx.paymentTable.requires[requireID];
    for (const currentID in ctx.paymentTable.currents) {
      if (consumed[currentID]) {
        continue;
      }
      const current = ctx.paymentTable.currents[currentID];
      if (require.id == 'GCountPayment') {
        // TODO: check G
        consumed[currentID] = true;
        passed[requireID] = true;
        break;
      }
      if (
        require.id == 'ColorPayment' &&
        current.id == 'ColorPayment' &&
        require.color == current.color
      ) {
        passed[requireID] == true;
        consumed[currentID] == true;
        break;
      }
    }
  }
  const isPass = Object.keys(passed).length == 0;
  const reasons = Object.keys(passed).map(
    (id) => ctx.paymentTable.requires[parseInt(id)].id
  );
  return [isPass, reasons];
}
