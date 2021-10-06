import { mapCard, moveCard } from "./table";
import { Context, Action, Payment, Effect } from "./types";
import { askPlayerG, cardPositionID } from "./alg";

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

function onCardEntered(ctx: Context, cardID: string): Context {
  return ctx;
}

function onEffectCompleted(ctx: Context, effect: Effect): Context {
  if (effect.action.id != "PlayCardAction") {
    return ctx;
  }
  const cardScript = require(`../script/102425.ts`);
  if (cardScript.onEffectCompleted == null) {
    throw new Error(
      `onEffectCompleted not found in script:${effect.action.cardID}`
    );
  }
  return cardScript.onEffectCompleted(ctx, effect);
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

function applyAction(ctx: Context, playerID: string, action: Action): Context {
  switch (action.id) {
    case "EndStepAction": {
      if (true) {
        // 如果雙方都endStep
        // 抽牌階段規定效果
        // 主動玩家抽牌
        const activePlayerID = playerID;
        const num = 1;
        const homeStack =
          ctx.table.cardStack[
            cardPositionID({ playerID: activePlayerID, where: "home" })
          ];
        const topCards = homeStack.slice(
          Math.max(0, homeStack.length - num),
          homeStack.length
        );
        const nextTable = topCards.reduce((table, card) => {
          return moveCard(
            table,
            cardPositionID({ playerID: activePlayerID, where: "home" }),
            cardPositionID({ playerID: activePlayerID, where: "hand" }),
            card.id
          );
        }, ctx.table);
        if (
          nextTable.cardStack[
            cardPositionID({ playerID: activePlayerID, where: "home" })
          ].length == 0
        ) {
          // 牌庫抽完了，遊戲結束
        }
        return {
          ...ctx,
          table: nextTable,
        };
      }
    }
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
            ctx = onCardEntered(
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

function testScript() {
  const ctx = onEffectCompleted(DefaultContext, {
    action: {
      id: "PlayCardAction",
      playerID: "",
      cardID: null,
      position: null,
    },
    currents: [],
  });
  console.log(ctx);
}

export function start() {
  testPlayCard();
  testScript();
}
