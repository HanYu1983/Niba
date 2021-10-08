import { mapCard, moveCard, createCard } from "../../tool/table";
import {
  Context,
  Action,
  Payment,
  Effect,
  defaultContext,
} from "../../tool/types";
import { askPlayerG, cardPositionID, onEffectCompleted } from "../alg";
import { queryAction } from "../alg/queryAction";
import { applyAction } from "../alg/applyAction";
import { checkPayment } from "../alg/checkPayment";
import { rootApp } from "../../tool/firebase";

function testPlayCard() {
  const playerID = "a";
  let ctx: Context = {
    ...defaultContext,
    gameState: {
      ...defaultContext.gameState,
      table: {
        ...defaultContext.gameState.table,
        cardStack: {
          ...defaultContext.gameState.table.cardStack,
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
  ]?.find((card) => {
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
    ]?.[0].id != unitAction.cardID
  ) {
    throw new Error(`${unitAction.cardID}必須在場上`);
  }
  console.log(ctx);
}

function testScript() {
  const ctx = onEffectCompleted(defaultContext, {
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

function testPlayG() {
  const playerID = "A";
  let ctx: Context = {
    ...defaultContext,
    gameState: {
      ...defaultContext.gameState,
      table: createCard(
        defaultContext.gameState.table,
        playerID,
        cardPositionID({ playerID: playerID, where: "hand" }),
        ["179030_11E_G_RD021N_red"]
      ),
    },
  };
  const actions = queryAction(ctx, playerID);
  if (actions.length == 0) {
    throw new Error("必須有出牌動作");
  }
  if (actions[0].id != "PlayCardAction") {
    throw new Error("動作必須是PlayCardAction");
  }
  console.log("出G");
  ctx = applyAction(ctx, playerID, actions[0]);
  console.log("放棄切入");
  ctx = applyAction(ctx, playerID, {
    id: "GiveUpCutAction",
    playerID: playerID,
  });
  if (
    (
      ctx.gameState.table.cardStack[
        cardPositionID({ playerID: playerID, where: "G" })
      ] || []
    ).length != 1
  ) {
    throw new Error("G必須在場上");
  }
  if (
    (
      ctx.gameState.table.cardStack[
        cardPositionID({ playerID: playerID, where: "hand" })
      ] || []
    ).length != 0
  ) {
    throw new Error("手牌必須為0");
  }
  console.log(ctx);
}

function testFirebase() {
  console.log(rootApp);
}

export function test() {
  testFirebase();
}
