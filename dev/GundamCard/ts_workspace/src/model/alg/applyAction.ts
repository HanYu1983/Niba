import { mapCard, moveCard } from "../../tool/table";
import {
  Context,
  Action,
  Payment,
  Effect,
  ApplyPaymentAction,
} from "../../tool/types";
import {
  askPlayerG,
  cardPositionID,
  onEffectCompleted,
  onCardEntered,
  opponent,
} from ".";
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
          ctx.gameState.table.cardStack[
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
        }, ctx.gameState.table);
        if (
          nextTable.cardStack[
            cardPositionID({ playerID: activePlayerID, where: "home" })
          ].length == 0
        ) {
          // 牌庫抽完了，遊戲結束
        }
        return {
          ...ctx,
          gameState: {
            ...ctx.gameState,
            table: nextTable,
          },
        };
      }
    }
    case "AddPaymentAction": {
      if (ctx.gameState.paymentTable.action == null) {
        throw new Error("no payment");
      }
      return {
        ...ctx,
        gameState: {
          ...ctx.gameState,
          paymentTable: {
            ...ctx.gameState.paymentTable,
            currents: [...ctx.gameState.paymentTable.currents, action.payment],
          },
        },
      };
    }
    case "GiveUpCutAction": {
      if (ctx.gameState.effectStack.effects.length == 0) {
        console.log("現在沒有堆疊，切入沒有效果");
        return ctx;
      }
      // 如果雙方都放棄切入
      const topEffect = ctx.gameState.effectStack.effects[0];
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
              ctx.gameState.table,
              cardPositionID({ playerID: playerID, where: "hand" }),
              cardPositionID({ playerID: playerID, where: "ground" }),
              topEffect.action.cardID
            );
            ctx = onCardEntered(
              {
                ...ctx,
                gameState: {
                  ...ctx.gameState,
                  table: nextTable,
                },
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
        gameState: {
          ...ctx.gameState,
          effectStack: {
            ...ctx.gameState.effectStack,
            effects: ctx.gameState.effectStack.effects.slice(1),
          },
        },
      };
    }
    case "ApplyPaymentAction":
      if (ctx.gameState.paymentTable.action == null) {
        throw new Error("no payment");
      }
      if (ctx.gameState.paymentTable.action.playerID != playerID) {
        throw new Error("your are not owner");
      }
      const [passed, reasons] = checkPayment(ctx, playerID);
      if (passed == false) {
        throw new Error(reasons.join(","));
      }
      const effect = {
        action: ctx.gameState.paymentTable.action,
        currents: ctx.gameState.paymentTable.currents,
      };
      return {
        ...ctx,
        gameState: {
          ...ctx.gameState,
          // clear payment table
          paymentTable: {
            ...ctx.gameState.paymentTable,
            action: null,
            snapshot: null,
          },
          // add effect to stack
          effectStack: {
            effects: [effect, ...ctx.gameState.effectStack.effects],
          },
        },
      };
    case "CancelPaymentAction":
      if (ctx.gameState.paymentTable.action == null) {
        return ctx;
      }
      if (ctx.gameState.paymentTable.isLock) {
        throw new Error("必須完成這個支付");
      }
      if (ctx.gameState.paymentTable.snapshot == null) {
        throw new Error("snapshot not found");
      }
      if (ctx.gameState.paymentTable.action.playerID != playerID) {
        throw new Error("your are not owner");
      }
      return ctx.gameState.paymentTable.snapshot;
    case "PlayCardAction":
      {
        if (ctx.gameState.paymentTable.action != null) {
          throw new Error(
            `${ctx.gameState.paymentTable.action.playerID}還在支付中`
          );
        }
        if (action.cardID == null) {
          throw new Error("你必須指定cardID");
        }
        if (action.position == null) {
          throw new Error(`沒有指定出場位置`);
        }
        const payments = queryPlayCardPayment(ctx, playerID, action.cardID);
        // 沒有cost就直接放入堆疊
        if (payments.length == 0) {
          const effect = {
            action: action,
            currents: [],
          };
          return {
            ...ctx,
            gameState: {
              ...ctx.gameState,
              effectStack: {
                effects: [effect, ...ctx.gameState.effectStack.effects],
              },
            },
          };
        }
        ctx = {
          ...ctx,
          gameState: {
            ...ctx.gameState,
            paymentTable: {
              action: action,
              requires: payments,
              currents: [],
              snapshot: ctx,
              isLock: false,
            },
          },
        };
      }
      break;
    case "PlayCardAbilityAction":
      {
        if (ctx.gameState.paymentTable.action != null) {
          throw new Error(
            `${ctx.gameState.paymentTable.action.playerID}還在支付中`
          );
        }
        // TODO: change to payment mode
        ctx = {
          ...ctx,
          gameState: {
            ...ctx.gameState,
            paymentTable: {
              action: action,
              requires: [],
              currents: [],
              snapshot: ctx,
              isLock: false,
            },
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
        const nextTable = mapCard(ctx.gameState.table, (card) => {
          if (card.id != action.cardID) {
            return card;
          }
          if (card.tap) {
            throw new Error(`G已經橫置，不能使用: ${card}`);
          }
          return { ...card, tap: true };
        });
        if (JSON.stringify(ctx.gameState.table) == JSON.stringify(nextTable)) {
          throw new Error(`找不到你要橫置的卡:${action.cardID}`);
        }
        ctx = {
          ...ctx,
          gameState: {
            ...ctx.gameState,
            table: nextTable,
            paymentTable: {
              ...ctx.gameState.paymentTable,
              currents: [
                ...ctx.gameState.paymentTable.currents,
                {
                  id: "ColorPayment",
                  color: action.color,
                  cardID: action.cardID,
                  playerID: action.playerID,
                },
              ],
            },
          },
        };
      }
      break;
  }
  return ctx;
}
