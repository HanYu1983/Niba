import { Table, Card, mapCard, moveCard } from "./table";

type Color = "blue" | "black" | "red";

type ColorPayment = {
  id: "ColorPayment";
  color: Color;
  cardID: string | null;
};

type TapPayment = {
  id: "TapPayment";
  cardID: string | null;
  condition: Condition[] | null;
};

type GCountPayment = {
  id: "GCountPayment";
  gCount: number;
};

type Target1Payment = {
  id: "Target1Payment";
  cardID: string | null;
  condition: Condition[] | null;
};

type Payment = (ColorPayment | TapPayment | GCountPayment | Target1Payment) & {
  playerID: string;
};

type PlayCardAction = {
  id: "PlayCardAction";
  cardID: string | null;
  position: CardPosition | null;
};

type PlayCardAbilityAction = {
  id: "PlayCardAbilityAction";
  cardID: string | null;
  abilityID: string;
};

type TapCardToGenG = {
  id: "TapCardToGenG";
  cardID: string | null;
  color: Color | null;
};

type AddPaymentAction = {
  id: "AddPaymentAction";
  payment: Payment;
};

type CancelPaymentAction = {
  id: "CancelPaymentAction";
};

type ApplyPaymentAction = {
  id: "ApplyPaymentAction";
};

type GiveUpCutAction = {
  id: "GiveUpCutAction";
};

type Action = (
  | PlayCardAction
  | PlayCardAbilityAction
  | TapCardToGenG
  | AddPaymentAction
  | CancelPaymentAction
  | ApplyPaymentAction
  | GiveUpCutAction
) & { playerID: string };

type PaymentTable = {
  action: Action | null;
  requires: Payment[];
  currents: Payment[];
  snapshot: Context | null;
  isLock: boolean;
};

type Effect = {
  action: Action;
  currents: Payment[];
};

type EffectStack = {
  effects: Effect[];
};

type Context = {
  table: Table;
  paymentTable: PaymentTable;
  effectStack: EffectStack;
};

type Condition = "手牌" | "特徴：装弾";

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
    isLock: false,
  },
  effectStack: {
    effects: [],
  },
};

type CardPosition = {
  playerID: string;
  where: "home" | "gravyard" | "ground" | "hand" | "G";
};

function cardPositionID(position: CardPosition) {
  return JSON.stringify(position);
}

function queryAction(ctx: Context, playerID: string): Action[] {
  const ret: Action[] = [];
  if (ctx.paymentTable.action?.playerID == playerID) {
    // 支付狀態
    ret.push({
      id: "CancelPaymentAction",
      playerID: playerID,
    });
    ret.push({
      id: "ApplyPaymentAction",
      playerID: playerID,
    });
    return ret;
  }
  {
    // 正常狀態
    const hands =
      ctx.table.cardStack[
        cardPositionID({ playerID: playerID, where: "hand" })
      ] || [];
    const actions = hands.flatMap((card): Action => {
      return {
        id: "PlayCardAction",
        cardID: card.id,
        playerID: playerID,
        position: null,
      };
    });
    ret.push(...actions);
  }
  return ret;
}

function onCardStage(ctx: Context, cardID: string): Context {
  return ctx;
}

function opponent(ctx: Context, playerID: string): string {
  return playerID;
}

function onEffectCompleted(ctx: Context, effect: Effect): Context {
  if (true) {
    // 狂乱の女戦士【コレクタブルレア】
    //（自軍戦闘階段）：敵軍手札を全部見て、那個中に存在的卡１枚を選んで廃棄執行。
    //『恒常』：このカードの解決直後に、本来の記述に｢特徴：装弾｣を持つ自軍G１枚をロールできる。その場合、敵軍は、自分の手札１枚を選んで廃棄する。
    //（自軍戦闘フェイズ）：敵軍手札を全て見て、その中にあるカード１枚を選んで廃棄する。
    if (effect.action.id != "PlayCardAction") {
      return ctx;
    }
    return {
      ...ctx,
      paymentTable: {
        action: {
          id: "PlayCardAbilityAction",
          cardID: effect.action.cardID,
          playerID: effect.action.playerID,
          abilityID: "",
        },
        requires: [
          {
            id: "TapPayment",
            cardID: null,
            playerID: effect.action.playerID,
            condition: ["特徴：装弾"],
          },
          {
            id: "Target1Payment",
            cardID: null,
            playerID: opponent(ctx, effect.action.playerID),
            condition: ["手牌"],
          },
        ],
        currents: [],
        snapshot: null,
        isLock: true,
      },
    };
  }
  return ctx;
}

function applyAction(ctx: Context, playerID: string, action: Action): Context {
  switch (action.id) {
    case "AddPaymentAction": {
      if (ctx.paymentTable.action == null) {
        throw new Error("no payment");
      }
      return {
        ...ctx,
        paymentTable: {
          ...ctx.paymentTable,
          currents: [...ctx.paymentTable.currents, action.payment],
        },
      };
    }
    case "GiveUpCutAction": {
      if (ctx.effectStack.effects.length == 0) {
        console.log("現在沒有堆疊，切入沒有效果");
        return ctx;
      }
      // 如果雙方都放棄切入
      const topEffect = ctx.effectStack.effects[0];
      switch (topEffect.action.id) {
        case "PlayCardAction":
          {
            if (topEffect.action.cardID == null) {
              throw new Error("cardID不存在，請檢查程式");
            }
            if (topEffect.action.position == null) {
              throw new Error(`position不存在，請檢查程式`);
            }
            const nextTable = moveCard(
              ctx.table,
              cardPositionID({ playerID: playerID, where: "hand" }),
              cardPositionID({ playerID: playerID, where: "ground" }),
              topEffect.action.cardID
            );
            ctx = onCardStage(
              {
                ...ctx,
                table: nextTable,
              },
              topEffect.action.cardID
            );
            ctx = onEffectCompleted(ctx, topEffect);
          }
          break;
        case "PlayCardAbilityAction":
          break;
        default:
          throw new Error("unknown action");
      }
      return {
        ...ctx,
        effectStack: {
          ...ctx.effectStack,
          effects: ctx.effectStack.effects.slice(1),
        },
      };
    }
    case "ApplyPaymentAction":
      if (ctx.paymentTable.action == null) {
        throw new Error("no payment");
      }
      if (ctx.paymentTable.action.playerID != playerID) {
        throw new Error("your are not owner");
      }
      const [passed, reasons] = checkPayment(ctx, playerID);
      if (passed == false) {
        throw new Error(reasons.join(","));
      }
      const effect = {
        action: ctx.paymentTable.action,
        currents: ctx.paymentTable.currents,
      };
      return {
        ...ctx,
        // clear payment table
        paymentTable: {
          ...ctx.paymentTable,
          action: null,
          snapshot: null,
        },
        // add effect to stack
        effectStack: {
          effects: [effect, ...ctx.effectStack.effects],
        },
      };
    case "CancelPaymentAction":
      if (ctx.paymentTable.action == null) {
        return ctx;
      }
      if (ctx.paymentTable.isLock) {
        throw new Error("必須完成這個支付");
      }
      if (ctx.paymentTable.snapshot == null) {
        throw new Error("snapshot not found");
      }
      if (ctx.paymentTable.action.playerID != playerID) {
        throw new Error("your are not owner");
      }
      return ctx.paymentTable.snapshot;
    case "PlayCardAction":
      {
        if (ctx.paymentTable.action != null) {
          throw new Error(`${ctx.paymentTable.action.playerID}還在支付中`);
        }
        if (action.cardID == null) {
          throw new Error("你必須指定cardID");
        }
        if (action.position == null) {
          throw new Error(`沒有指定出場位置`);
        }
        ctx = {
          ...ctx,
          paymentTable: {
            action: action,
            requires: queryPlayCardPayment(ctx, playerID, action.cardID),
            currents: [],
            snapshot: ctx,
            isLock: false,
          },
        };
      }
      break;
    case "PlayCardAbilityAction":
      {
        if (ctx.paymentTable.action != null) {
          throw new Error(`${ctx.paymentTable.action.playerID}還在支付中`);
        }
        // TODO: change to payment mode
        ctx = {
          ...ctx,
          paymentTable: {
            action: action,
            requires: [],
            currents: [],
            snapshot: ctx,
            isLock: false,
          },
        };
      }
      break;
    case "TapCardToGenG":
      {
        if (action.color == null) {
          throw new Error("你必須指定color");
        }
        if (action.cardID == null) {
          throw new Error("你必須指定cardID");
        }
        const nextTable = mapCard(ctx.table, (card) => {
          if (card.id != action.cardID) {
            return card;
          }
          if (card.tap) {
            throw new Error(`G已經橫置，不能使用: ${card}`);
          }
          return { ...card, tap: true };
        });
        if (JSON.stringify(ctx.table) == JSON.stringify(nextTable)) {
          throw new Error(`找不到你要橫置的卡:${action.cardID}`);
        }
        ctx = {
          ...ctx,
          table: nextTable,
          paymentTable: {
            ...ctx.paymentTable,
            currents: [
              ...ctx.paymentTable.currents,
              {
                id: "ColorPayment",
                color: action.color,
                cardID: action.cardID,
                playerID: action.playerID,
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
        id: "ColorPayment",
        color: "blue",
        cardID: "",
        playerID: playerID,
      } as Payment,
      {
        id: "GCountPayment",
        gCount: 2,
        playerID: playerID,
      } as Payment,
    ]
  );
  if (false) {
    // 私情による裏切り
    // （常時）：敵軍キャラ１枚、または敵軍オペ１枚を破壊する。その場合、敵軍は、自分の本国を５回復できる。
    payments.push(
      ...[
        {
          id: "Target1Payment",
          cardID: null,
          playerID: playerID,
        } as Payment,
        {
          id: "ColorPayment",
          color: "black",
          cardID: null,
          playerID: playerID,
        } as Payment,
        {
          id: "GCountPayment",
          gCount: 1,
          playerID: playerID,
        } as Payment,
      ]
    );
  }
  return payments;
}

function askPlayerG(ctx: Context, playerID: string): Card[] {
  return ctx.table.cardStack[
    cardPositionID({ playerID: playerID, where: "G" })
  ];
}

function checkPayment(ctx: Context, playerID: string): [boolean, Payment[]] {
  if (ctx.paymentTable.action == null) {
    throw new Error("要確認支付，但找不到action。請確定有呼叫");
  }
  const passed: { [key: number]: boolean } = {};
  const consumed: { [key: number]: boolean } = {};
  for (const requireID in ctx.paymentTable.requires) {
    const require = ctx.paymentTable.requires[requireID];
    if (require.id == "GCountPayment") {
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
      if (require.playerID != current.playerID) {
        continue;
      }
      if (
        require.id == "ColorPayment" &&
        current.id == "ColorPayment" &&
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

function testPlayCard() {
  const playerID = "a";
  let ctx: Context = {
    ...DefaultContext,
    table: {
      ...DefaultContext.table,
      cardStack: {
        ...DefaultContext.table.cardStack,
        [cardPositionID({ playerID: playerID, where: "hand" })]: [
          { id: "1", faceDown: true, protoID: "", tap: false },
        ],
        [cardPositionID({ playerID: playerID, where: "G" })]: [
          { id: "2", faceDown: true, protoID: "", tap: false },
          { id: "3", faceDown: true, protoID: "", tap: false },
        ],
      },
    },
  };
  console.log("查詢動作");
  let actions = queryAction(ctx, playerID);
  const unitAction = actions[0];
  if (unitAction.id != "PlayCardAction") {
    throw new Error("動作必須是PlayCardAction");
  }
  unitAction.position = {
    playerID: playerID,
    where: "ground",
  };
  console.log("使用PlayCardAction");
  ctx = applyAction(ctx, playerID, unitAction);
  console.log("再查詢動作");
  actions = queryAction(ctx, playerID);
  console.log(actions);
  console.log("轉G支付國力");
  const tapGAction: Action = {
    id: "TapCardToGenG",
    color: "blue",
    cardID: "2",
    playerID: playerID,
  };
  ctx = applyAction(ctx, playerID, tapGAction);
  const findTapCard = ctx.table.cardStack[
    cardPositionID({ playerID: playerID, where: "G" })
  ].find((card) => {
    return card.id == tapGAction.cardID;
  });
  if (findTapCard == null) {
    throw new Error("找不到橫置的卡");
  }
  if (findTapCard.tap == false) {
    throw new Error("國力必須橫置");
  }
  const [passed, reason] = checkPayment(ctx, playerID);
  if (passed == false) {
    throw new Error(
      `必須成功支付:${reason.map((o) => JSON.stringify(o)).join(",")}`
    );
  }
  console.log("確認支付");
  ctx = applyAction(ctx, playerID, {
    id: "ApplyPaymentAction",
    playerID: playerID,
  });
  ctx = applyAction(ctx, playerID, {
    id: "GiveUpCutAction",
    playerID: playerID,
  });
  if (
    ctx.table.cardStack[
      cardPositionID({ playerID: playerID, where: "ground" })
    ][0].id != unitAction.cardID
  ) {
    throw new Error(`${unitAction.cardID}必須在場上`);
  }
  console.log(ctx);
}

export function start() {
  testPlayCard();
}
