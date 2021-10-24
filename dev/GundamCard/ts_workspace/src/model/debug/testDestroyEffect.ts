import { Card, createCard } from "../../tool/table";
import {
  Context,
  defaultCardState,
  defaultContext,
  PlayerA,
  PlayerB,
} from "../../tool/types";
import { applyAction } from "../alg/applyAction";
import { askCardColor } from "../alg/askCardColor";
import { cardPositionID } from "../alg/tool";

export function testDestroyEffect() {
  const commandCard: Card = {
    id: "commandCard",
    protoID: "179024_B2B_C_BK054C_black",
    ownerID: PlayerA,
    faceDown: false,
    tap: false,
  };
  const destroyCard: Card = {
    id: "destroyCard",
    protoID: "179030_11E_U_BK187N_black",
    ownerID: PlayerA,
    faceDown: false,
    tap: false,
  };
  const colorCard1: Card = {
    id: "colorCard1",
    protoID: "179030_11E_U_BK187N_black",
    ownerID: PlayerA,
    faceDown: false,
    tap: false,
  };
  const colorCard2: Card = {
    id: "colorCard2",
    protoID: "179030_11E_U_BK187N_black",
    ownerID: PlayerA,
    faceDown: false,
    tap: false,
  };
  const colorCard3: Card = {
    id: "colorCard3",
    protoID: "179030_11E_U_BK187N_black",
    ownerID: PlayerA,
    faceDown: false,
    tap: false,
  };
  const originCtx: Context = {
    ...defaultContext,
    gameState: {
      ...defaultContext.gameState,
      destroyEffect: [
        {
          id: "DestroyEffect",
          cardID: destroyCard.id,
          reason: "",
          from: { playerID: PlayerA, where: "earth" },
        },
      ],
      cardState: {
        [destroyCard.id]: {
          ...defaultCardState,
          destroy: true,
        },
      },
      table: {
        ...defaultContext.gameState.table,
        cardStack: {
          [cardPositionID({ playerID: PlayerA, where: "hand" })]: [commandCard],
          [cardPositionID({ playerID: PlayerA, where: "earth" })]: [
            destroyCard,
          ],
          [cardPositionID({ playerID: PlayerA, where: "G" })]: [
            colorCard1,
            colorCard2,
            colorCard3,
          ],
          [cardPositionID({ playerID: PlayerA, where: "home" })]: [
            {
              id: "_a",
              protoID: "179030_11E_U_BK187N_black",
              ownerID: PlayerA,
              faceDown: false,
              tap: false,
            },
            {
              id: "_b",
              protoID: "179030_11E_U_BK187N_black",
              ownerID: PlayerA,
              faceDown: false,
              tap: false,
            },
          ],
        },
      },
      activePlayerID: PlayerA,
    },
  };
  let ctx = originCtx;
  console.log("觸發破壞效果");
  ctx = applyAction(ctx, PlayerA, {
    id: "SystemAddDestroyEffectAction",
    playerID: PlayerA,
  });
  console.log("PlayerA宣告沒事");
  ctx = applyAction(ctx, PlayerA, {
    id: "ConfirmPhaseAction",
    playerID: PlayerA,
  });
  console.log("PlayerB宣告沒事");
  ctx = applyAction(ctx, PlayerB, {
    id: "ConfirmPhaseAction",
    playerID: PlayerB,
  });
  console.log("SystemHandleEffectAction");
  ctx = applyAction(ctx, PlayerA, {
    id: "SystemHandleEffectAction",
    playerID: PlayerA,
  });
  if (
    (
      ctx.gameState.table.cardStack[
        cardPositionID({ playerID: PlayerA, where: "gravyard" })
      ] || []
    ).length == 0
  ) {
    throw new Error("墓地中必須有一張卡");
  }
  console.log("重設為原狀態");
  ctx = originCtx;
  console.log("觸發破壞效果");
  ctx = applyAction(ctx, PlayerA, {
    id: "SystemAddDestroyEffectAction",
    playerID: PlayerA,
  });
  if (ctx.gameState.effectStack.effects.length != 1) {
    throw new Error("堆疊中必須有1個效果");
  }
  console.log("PlayerA使用ロング・ブレードライフル");
  ctx = applyAction(ctx, PlayerA, {
    id: "PlayCardAction",
    playerID: PlayerA,
    cardID: commandCard.id,
    from: { playerID: PlayerA, where: "hand" },
    to: { playerID: PlayerA, where: "gravyard" },
  });
  console.log("轉G支付");
  ctx = applyAction(ctx, PlayerA, {
    id: "TapCardToGenG",
    playerID: PlayerA,
    cardID: colorCard1.id,
    color: askCardColor(ctx, colorCard1),
  });
  console.log("轉G支付");
  ctx = applyAction(ctx, PlayerA, {
    id: "TapCardToGenG",
    playerID: PlayerA,
    cardID: colorCard2.id,
    color: askCardColor(ctx, colorCard2),
  });
  console.log("指定破壞的卡");
  ctx = applyAction(ctx, PlayerA, {
    id: "TargetCardToGenTarget1",
    playerID: PlayerA,
    cardID: destroyCard.id,
  });
  console.log("確認支付");
  ctx = applyAction(ctx, PlayerA, {
    id: "ApplyPaymentAction",
    playerID: PlayerA,
  });
  if (ctx.gameState.effectStack.effects.length != 2) {
    throw new Error("堆疊中必須有2個效果");
  }
  console.log("PlayerA宣告沒事");
  ctx = applyAction(ctx, PlayerA, {
    id: "ConfirmPhaseAction",
    playerID: PlayerA,
  });
  console.log("PlayerB宣告沒事");
  ctx = applyAction(ctx, PlayerB, {
    id: "ConfirmPhaseAction",
    playerID: PlayerB,
  });
  console.log("SystemHandleEffectAction");
  ctx = applyAction(ctx, PlayerA, {
    id: "SystemHandleEffectAction",
    playerID: PlayerA,
  });
  if (ctx.gameState.effectStack.effects.length != 1) {
    throw new Error("堆疊中必須有1個效果");
  }
  console.log("SystemHandleEffectAction");
  ctx = applyAction(ctx, PlayerA, {
    id: "SystemHandleEffectAction",
    playerID: PlayerA,
  });
  if (ctx.gameState.effectStack.effects.length != 0) {
    throw new Error("堆疊中必須有0個效果");
  }
  console.log(ctx);
  if (
    (
      ctx.gameState.table.cardStack[
        cardPositionID({ playerID: PlayerA, where: "hand" })
      ] || []
    ).length != 2
  ) {
    throw new Error("現在手牌必須要有2張");
  }
}
