import { Table, Card, mapCard } from './table';

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
  table: Table;
  paymentTable: PaymentTable;
};

const DefaultContext: Context = {
  table: {
    cardStack: {},
    tokens: [],
  },
  paymentTable: {
    action: null,
    requires: [],
    currents: [],
    snapshot: null,
  },
};

function handCardStackID(playerID: string) {
  return `${playerID}/hand`;
}

function GCardStackID(playerID: string) {
  return `${playerID}/G`;
}

function queryAction(ctx: Context, playerID: string): Action[] {
  const ret: Action[] = [];
  if (ctx.paymentTable.action?.playerID == playerID) {
    // 支付狀態
    const gs = askPlayerG(ctx, playerID);
    const actions = gs
      .filter((card) => card.tap == false)
      .flatMap((card): Action => {
        return {
          id: 'TapCardToGenG',
          cardID: card.id,
          playerID: playerID,
        };
      });
    ret.push(...actions);
    // cancel
    ret.push({
      id: 'CancelPayment',
      cardID: ctx.paymentTable.action.cardID,
      playerID: playerID,
    });
  } else {
    // 正常狀態
    const hands = ctx.table.cardStack[handCardStackID(playerID)] || [];
    const actions = hands.flatMap((card): Action => {
      return {
        id: 'PlayCardAction',
        cardID: card.id,
        playerID: playerID,
      };
    });
    ret.push(...actions);
  }
  return ret;
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
        ctx = {
          ...ctx,
          table: mapCard(ctx.table, (card) => {
            if (card.id != action.cardID) {
              return card;
            }
            if (card.tap) {
              throw new Error(`G已經橫置，不能使用: ${card}`);
            }
            return { ...card, tap: true };
          }),
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

function askPlayerG(ctx: Context, playerID: string): Card[] {
  return ctx.table.cardStack[GCardStackID(playerID)];
}

function checkPayment(ctx: Context): [boolean, Payment[]] {
  if (ctx.paymentTable.action == null) {
    throw new Error('要確認支付，但找不到action。請確定有呼叫');
  }
  const passed: { [key: number]: boolean } = {};
  const consumed: { [key: number]: boolean } = {};
  for (const requireID in ctx.paymentTable.requires) {
    const require = ctx.paymentTable.requires[requireID];
    if (require.id == 'GCountPayment') {
      if (
        askPlayerG(ctx, ctx.paymentTable.action.playerID).length <
        require.gCount
      ) {
        break;
      }
      passed[requireID] = true;
      break;
    }
    for (const currentID in ctx.paymentTable.currents) {
      if (consumed[currentID]) {
        continue;
      }
      const current = ctx.paymentTable.currents[currentID];
      console.log(require, current);
      if (
        require.id == 'ColorPayment' &&
        current.id == 'ColorPayment' &&
        require.color == current.color
      ) {
        passed[requireID] = true;
        consumed[currentID] = true;
        break;
      }
    }
  }
  const isPass = Object.keys(passed).length == ctx.paymentTable.requires.length;
  const reasons = ctx.paymentTable.requires.filter((_, i) => passed[i] != true);
  return [isPass, reasons];
}

function test1() {
  const playerID = 'a';
  let ctx: Context = {
    ...DefaultContext,
    table: {
      ...DefaultContext.table,
      cardStack: {
        ...DefaultContext.table.cardStack,
        [handCardStackID(playerID)]: [
          { id: '1', faceDown: true, protoID: '', tap: false },
        ],
        [GCardStackID(playerID)]: [
          { id: '2', faceDown: true, protoID: '', tap: false },
          { id: '3', faceDown: true, protoID: '', tap: false },
        ],
      },
    },
  };
  let actions = queryAction(ctx, playerID);
  const unitAction = actions[0];
  console.log(actions);
  ctx = applyAction(ctx, playerID, unitAction);
  console.log(ctx);
  actions = queryAction(ctx, playerID);
  console.log(actions);
  const tapGAction = actions[0];
  if (tapGAction.id != 'TapCardToGenG') {
    throw new Error('must TapCardToGenG');
  }
  ctx = applyAction(ctx, playerID, tapGAction);
  console.log(ctx);
  const [passed, reason] = checkPayment(ctx);
  console.log(passed, reason);

  if (ctx.paymentTable.action == null) {
    throw new Error('must have payment action');
  }
  console.log(ctx);
}

test1();
