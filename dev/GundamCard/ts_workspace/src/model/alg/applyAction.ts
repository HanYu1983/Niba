import { mapCard, moveCard } from "../../tool/table";
import {
  Context,
  Action,
  Payment,
  Effect,
  ApplyPaymentAction,
  mapPlayerState,
  isEveryConfirmPhase,
} from "../../tool/types";
import {
  askPlayerG,
  cardPositionID,
  onEffectCompleted,
  onCardEntered,
  opponent,
  askNextPhase,
} from ".";
import { checkPayment } from "./checkPayment";
import { queryPlayCardPayment } from "./queryPlayCardPayment";
import { PlayerA, PlayerB } from "../../app/context";

export function applyAction(
  ctx: Context,
  playerID: string,
  action: Action
): Context {
  switch (action.id) {
    case "AttackAction":
      {
        if (ctx.gameState.phase[0] != "attack") {
          throw new Error("現在不是攻擊階段")
        }
        if (ctx.gameState.phase[1] != "effect") {
          throw new Error("現在不是規定效果")
        }
        if (ctx.gameState.activePlayerID != playerID) {
          throw new Error("主動玩家才能攻擊")
        }
        if (action.from == null) {
          throw new Error("你沒有指定from")
        }
        if (action.to == null) {
          throw new Error("你沒有指定to")
        }
        if (action.cardID == null) {
          throw new Error("你沒有指定cardID")
        }
        if (action.to.where != "universe" && action.to.where != "earth") {
          throw new Error("你必須指定戰鬥區域")
        }
        // 直接將卡移到戰場, 沒有切入時間
        return {
          ...ctx,
          gameState: {
            ...ctx.gameState,
            table: moveCard(ctx.gameState.table, cardPositionID(action.from), cardPositionID(action.to), action.cardID, action.beforeCardID)
          }
        }
      }
    case "GuardAction":
      {
        if (ctx.gameState.phase[0] != "guard") {
          throw new Error("現在不是防禦階段")
        }
        if (ctx.gameState.phase[1] != "effect") {
          throw new Error("現在不是規定效果")
        }
        if (ctx.gameState.activePlayerID == playerID) {
          throw new Error("被動玩家才能防禦")
        }
        if (action.from == null) {
          throw new Error("你沒有指定from")
        }
        if (action.to == null) {
          throw new Error("你沒有指定to")
        }
        if (action.cardID == null) {
          throw new Error("你沒有指定cardID")
        }
        if (action.to.where != "universe" && action.to.where != "earth") {
          throw new Error("你必須指定戰鬥區域")
        }
        // 直接將卡移到戰場, 沒有切入時間
        return {
          ...ctx,
          gameState: {
            ...ctx.gameState,
            table: moveCard(ctx.gameState.table, cardPositionID(action.from), cardPositionID(action.to), action.cardID, action.beforeCardID)
          }
        }
      }
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
          ] || [];
        const topCards = homeStack.slice(
          Math.max(0, homeStack.length - num),
          homeStack.length
        );
        const nextTable = topCards.reduce((table, card) => {
          return moveCard(
            table,
            cardPositionID({ playerID: activePlayerID, where: "home" }),
            cardPositionID({ playerID: activePlayerID, where: "hand" }),
            card.id,
            null,
          );
        }, ctx.gameState.table);
        if (
          (
            nextTable.cardStack[
            cardPositionID({ playerID: activePlayerID, where: "home" })
            ] || []
          ).length == 0
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
    case "SystemAddDestroyEffectAction":
      {
        if (ctx.gameState.destroyEffect.length == 0) {
          throw new Error("沒有破壞卡要處理")
        }
        const topDestryEffect = ctx.gameState.destroyEffect[0]
        return {
          ...ctx,
          gameState: {
            ...ctx.gameState,
            destroyEffect: ctx.gameState.destroyEffect.slice(1),
            effectStack: {
              ...ctx.gameState.effectStack,
              effects: [topDestryEffect, ...ctx.gameState.effectStack.effects]
            }
          }
        }
      }
    case "SystemHandleEffectAction":
      {
        if (ctx.gameState.effectStack.effects.length == 0) {
          throw new Error("沒有效果要處理")
        }
        if (playerID != PlayerA) {
          throw new Error("只有先攻玩家能操作")
        }
        if (isEveryConfirmPhase(ctx, [PlayerA, PlayerB]) == false) {
          throw new Error("雙方都要確認沒事才能操作SystemHandleEffectAction")
        }
        const topEffect = ctx.gameState.effectStack.effects[0];
        console.log("處理效果...", topEffect);
        switch (topEffect.id) {
          case "ActionEffect":
            switch (topEffect.action.id) {
              case "PlayCardAction":
                {
                  if (topEffect.action.cardID == null) {
                    throw new Error("cardID不存在，請檢查程式");
                  }
                  if (topEffect.action.to == null) {
                    throw new Error(`to不存在，請檢查程式`);
                  }
                  if (topEffect.action.from == null) {
                    throw new Error(`from不存在，請檢查程式`);
                  }
                  const nextTable = moveCard(
                    ctx.gameState.table,
                    cardPositionID(topEffect.action.from),
                    cardPositionID(topEffect.action.to),
                    topEffect.action.cardID,
                    null
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
            break
          case "DestroyEffect":
            {

            }
            break
          default:
            throw new Error(`unknown effect: ${topEffect}`)
        }
        ctx = {
          ...ctx,
          gameState: {
            ...ctx.gameState,
            effectStack: {
              ...ctx.gameState.effectStack,
              effects: ctx.gameState.effectStack.effects.slice(1),
            },
          },
        };
        if (ctx.gameState.effectStack.effects.length == 0) {
          // 重設為非確認狀態
          ctx = mapPlayerState(ctx, [PlayerA, PlayerB], (playerState) => {
            return {
              ...playerState,
              confirmPhase: false,
            };
          });
        }
        return ctx
      }
    case "SystemHandlePhaseEffectAction":
      {
        if (ctx.gameState.phase[1] != "effect") {
          throw new Error("現在不是規定效果")
        }
        if (playerID != PlayerA) {
          throw new Error("只有先攻玩家能操作")
        }
        switch (ctx.gameState.phase[0]) {
          case "damage":
            {
              // TODO:傷害計算並造成傷害
              // 每個被破壞的卡必須存到列表, 一個一個將破壞效果放入堆疊中
              // 但每次只能放一個, 等到堆疊解決完, 再放入下一個
              // 所以必須要再多一個列表
              // TODO: 將破壞效果加入列表
              return ctx
            }
          case "return":
            {
              // TODO: 回到配置區
              return ctx
            }
        }
        // 移到下個階段
        ctx = {
          ...ctx,
          gameState: {
            ...ctx.gameState,
            phase: askNextPhase(ctx, ctx.gameState.phase),
          },
        };
        return ctx;
      }
    case "CancelConfirmPhaseAction":
      {
        if (ctx.gameState.phase[1] == "effect") {
          throw new Error("請先處理規定效果")
        }
        // 取消宣告沒事
        ctx = mapPlayerState(ctx, [playerID], (playerState) => {
          return {
            ...playerState,
            confirmPhase: false,
          };
        });
        return ctx
      }
    case "ConfirmPhaseAction": {
      if (ctx.gameState.phase[1] == "effect") {
        throw new Error("請先處理規定效果")
      }
      // 玩家宣告沒事
      ctx = mapPlayerState(ctx, [playerID], (playerState) => {
        return {
          ...playerState,
          confirmPhase: true,
        };
      });
      // 如果還有玩家有事要做，就回傳
      if (isEveryConfirmPhase(ctx, [PlayerA, PlayerB]) == false) {
        return ctx;
      }
      // 所有玩家都宣告沒事
      // 如果堆疊存在，先解決效果，回傳
      if (ctx.gameState.effectStack.effects.length) {
        console.log("先攻玩家準備呼叫SystemHandleEffectAction")
        return ctx
        // // 解決所有效果
        // while (ctx.gameState.effectStack.effects.length) {
        //   const topEffect = ctx.gameState.effectStack.effects[0];
        //   console.log("處理效果...", topEffect);
        //   switch (topEffect.action.id) {
        //     case "PlayCardAction":
        //       {
        //         if (topEffect.action.cardID == null) {
        //           throw new Error("cardID不存在，請檢查程式");
        //         }
        //         if (topEffect.action.to == null) {
        //           throw new Error(`to不存在，請檢查程式`);
        //         }
        //         if (topEffect.action.from == null) {
        //           throw new Error(`from不存在，請檢查程式`);
        //         }
        //         const nextTable = moveCard(
        //           ctx.gameState.table,
        //           cardPositionID(topEffect.action.from),
        //           cardPositionID(topEffect.action.to),
        //           topEffect.action.cardID,
        //           null
        //         );
        //         ctx = onCardEntered(
        //           {
        //             ...ctx,
        //             gameState: {
        //               ...ctx.gameState,
        //               table: nextTable,
        //             },
        //           },
        //           topEffect.action.cardID
        //         );
        //         ctx = onEffectCompleted(ctx, topEffect);
        //       }
        //       break;
        //     case "PlayCardAbilityAction":
        //       break;
        //     default:
        //       throw new Error("unknown action");
        //   }
        //   ctx = {
        //     ...ctx,
        //     gameState: {
        //       ...ctx.gameState,
        //       effectStack: {
        //         ...ctx.gameState.effectStack,
        //         effects: ctx.gameState.effectStack.effects.slice(1),
        //       },
        //     },
        //   };
        // }
        // // 重設為非確認狀態
        // ctx = mapPlayerState(ctx, [PlayerA, PlayerB], (playerState) => {
        //   return {
        //     ...playerState,
        //     confirmPhase: false,
        //   };
        // });
        // // 回傳
        // return ctx;
      }
      // 移到下個階段
      ctx = {
        ...ctx,
        gameState: {
          ...ctx.gameState,
          phase: askNextPhase(ctx, ctx.gameState.phase),
        },
      };
      // 重設為非確認狀態
      ctx = mapPlayerState(ctx, [PlayerA, PlayerB], (playerState) => {
        return {
          ...playerState,
          confirmPhase: false,
        };
      });
      return ctx;
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
        throw new Error(reasons.map((reason) => reason.id).join(","));
      }
      const effect: Effect = {
        id: "ActionEffect",
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
        if (action.to == null) {
          throw new Error(`沒有指定出場位置`);
        }
        // 放G的話直接進堆疊
        if (action.to.where == "G") {
          const effect: Effect = {
            id: "ActionEffect",
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
        const payments = queryPlayCardPayment(ctx, playerID, action.cardID);
        // 沒有cost就直接放入堆疊
        if (payments.length == 0) {
          const effect: Effect = {
            id: "ActionEffect",
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
        if (ctx.gameState.paymentTable.action == null) {
          throw new Error("現在沒有支付的必要");
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
                  tipCardID: [],
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
