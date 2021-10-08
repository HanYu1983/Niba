import { mapCard, moveCard, createCard } from "../../tool/table";
import { Context, Action, Payment, Effect } from "../../tool/types";
import { askPlayerG, cardPositionID, onEffectCompleted } from "../alg";
import { queryAction } from "../alg/queryAction";
import { applyAction } from "../alg/applyAction";
import { checkPayment } from "../alg/checkPayment";

const DefaultContext: Context = {
  gameState: {
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
    cardState: {},
  },
  animationState: {
    productID: 0,
    animations: [],
    consumeID: {},
  },
};

function testPlayCard() {
  const playerID = "a";
  let ctx: Context = {
    ...DefaultContext,
    gameState: {
      ...DefaultContext.gameState,
      table: {
        ...DefaultContext.gameState.table,
        cardStack: {
          ...DefaultContext.gameState.table.cardStack,
          [cardPositionID({ playerID: playerID, where: "hand" })]: [
            { id: "1", faceDown: true, protoID: "", tap: false, ownerID: null },
          ],
          [cardPositionID({ playerID: playerID, where: "G" })]: [
            { id: "2", faceDown: true, protoID: "", tap: false, ownerID: null },
            { id: "3", faceDown: true, protoID: "", tap: false, ownerID: null },
          ],
        },
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
    color: "青",
    cardID: "2",
    playerID: playerID,
  };
  ctx = applyAction(ctx, playerID, tapGAction);
  const findTapCard = ctx.gameState.table.cardStack[
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
    ctx.gameState.table.cardStack[
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

function testRealCard() {
  const playerID = "A";
  const ctx: Context = {
    ...DefaultContext,
    gameState: {
      ...DefaultContext.gameState,
      table: createCard(
        DefaultContext.gameState.table,
        playerID,
        cardPositionID({ playerID: playerID, where: "hand" }),
        [
          "179030_11E_G_RD021N_red",
          "179030_11E_U_BL209R_blue",
          "179030_11E_U_BL210N_blue",
        ]
      ),
    },
  };
  console.log(ctx);
  queryAction(ctx, playerID);
}

export function test() {
  testRealCard();
}
