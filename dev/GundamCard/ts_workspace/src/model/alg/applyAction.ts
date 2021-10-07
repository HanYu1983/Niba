import { mapCard, moveCard } from "../table";
import { Context, Action, Payment, Effect } from "../types";
import {
  askPlayerG,
  cardPositionID,
  onEffectCompleted,
  onCardEntered,
  opponent,
} from "./alg";
import { checkPayment } from "./checkPayment";
import { queryPlayCardPayment } from "./queryPlayCardPayment";

export function applyAction(
  ctx: Context,
  playerID: string,
  action: Action
): Context {
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
