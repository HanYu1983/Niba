import { mapCard, moveCard } from "./table";
import { Context, Action, Payment, Effect } from "./types";
import { askPlayerG, cardPositionID, onEffectCompleted } from "./alg/alg";
import { queryAction } from "./alg/queryAction";
import { applyAction } from "./alg/applyAction";
import { checkPayment } from "./alg/checkPayment";

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
