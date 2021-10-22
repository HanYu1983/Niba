import { mapCard, moveCard, createCard } from "../../tool/table";
import {
  Context,
  Action,
  Payment,
  Effect,
  defaultContext,
} from "../../tool/types";
import { askPlayerG, cardPositionID } from "../alg";
import { queryAction } from "../alg/queryAction";
import { applyAction } from "../alg/applyAction";
import { PlayerA, PlayerB } from "../../app/context";
import { onEffectCompleted } from "../alg/onEffectCompleted";

export function testPlayG() {
  let ctx: Context = {
    ...defaultContext,
    gameState: {
      ...defaultContext.gameState,
      table: createCard(
        defaultContext.gameState.table,
        PlayerA,
        cardPositionID({ playerID: PlayerA, where: "hand" }),
        ["179030_11E_G_RD021N_red"]
      ),
      activePlayerID: PlayerA,
    },
  };
  const actions = queryAction(ctx, PlayerA);
  if (actions.length == 0) {
    throw new Error("必須有出牌動作");
  }
  console.log(actions);
  if (actions[0].id != "PlayCardAction") {
    throw new Error("動作必須是PlayCardAction");
  }
  console.log("A出G");
  ctx = applyAction(ctx, PlayerA, actions[0]);
  console.log("A放棄切入");
  ctx = applyAction(ctx, PlayerA, {
    id: "ConfirmPhaseAction",
    playerID: PlayerA,
  });
  console.log("B放棄切入");
  ctx = applyAction(ctx, PlayerB, {
    id: "ConfirmPhaseAction",
    playerID: PlayerB,
  });
  ctx = applyAction(ctx, PlayerA, {
    id: "SystemHandleEffectAction",
    playerID: PlayerA,
  });
  console.log(ctx);
  if (
    (
      ctx.gameState.table.cardStack[
        cardPositionID({ playerID: PlayerA, where: "G" })
      ] || []
    ).length != 1
  ) {
    throw new Error("G必須在場上");
  }
  if (
    (
      ctx.gameState.table.cardStack[
        cardPositionID({ playerID: PlayerA, where: "hand" })
      ] || []
    ).length != 0
  ) {
    throw new Error("手牌必須為0");
  }
}
