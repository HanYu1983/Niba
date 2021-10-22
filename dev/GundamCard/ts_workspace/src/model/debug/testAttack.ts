import { mapCard, moveCard, createCard } from "../../tool/table";
import {
  Context,
  Action,
  Payment,
  Effect,
  defaultContext,
} from "../../tool/types";
import { askPlayerG, cardPositionID } from "../alg";
import { applyAction } from "../alg/applyAction";
import { PlayerA, PlayerB } from "../../app/context";
import { onEffectCompleted } from "../alg/onEffectCompleted";

export function testAttack() {
  let table = defaultContext.gameState.table;
  table = createCard(
    table,
    PlayerA,
    cardPositionID({ playerID: PlayerA, where: "ground" }),
    ["179030_11E_U_BK187N_black", "179030_11E_U_BK187N_black"]
  );
  table = createCard(
    table,
    PlayerB,
    cardPositionID({ playerID: PlayerB, where: "ground" }),
    ["179030_11E_U_BK187N_black", "179030_11E_U_BK187N_black"]
  );
  let ctx: Context = {
    ...defaultContext,
    gameState: {
      ...defaultContext.gameState,
      table: table,
      phase: ["attack", "effect"],
      activePlayerID: PlayerA,
    },
  };
  const unit1 =
    ctx.gameState.table.cardStack[
      cardPositionID({ playerID: PlayerA, where: "ground" })
    ]?.[0];
  if (unit1 == null) {
    throw new Error("unit1 not found");
  }
  const unit2 =
    ctx.gameState.table.cardStack[
      cardPositionID({ playerID: PlayerA, where: "ground" })
    ]?.[1];
  if (unit2 == null) {
    throw new Error("unit2 not found");
  }
  console.log("出一機到地球");
  ctx = applyAction(ctx, PlayerA, {
    id: "AttackAction",
    playerID: PlayerA,
    cardID: unit1.id,
    from: { playerID: PlayerA, where: "ground" },
    to: { playerID: PlayerA, where: "earth" },
    beforeCardID: null,
  });
  if (
    (ctx.gameState.table.cardStack[
      cardPositionID({ playerID: PlayerA, where: "earth" })
    ]?.length || 0) != 1
  ) {
    throw new Error("地球區必須有1機");
  }
  console.log("再出一機到地球, 放入部隊先頭");
  ctx = applyAction(ctx, PlayerA, {
    id: "AttackAction",
    playerID: PlayerA,
    cardID: unit2.id,
    from: { playerID: PlayerA, where: "ground" },
    to: { playerID: PlayerA, where: "earth" },
    beforeCardID: unit1.id,
  });
  if (
    (ctx.gameState.table.cardStack[
      cardPositionID({ playerID: PlayerA, where: "earth" })
    ]?.length || 0) != 2
  ) {
    throw new Error("地球區必須有2機");
  }
  const unitOnEarth1 =
    ctx.gameState.table.cardStack[
      cardPositionID({ playerID: PlayerA, where: "earth" })
    ]?.[0];
  if (unitOnEarth1 == null) {
    throw new Error("unitOnEarth1 not found");
  }
  const unitOnEarth2 =
    ctx.gameState.table.cardStack[
      cardPositionID({ playerID: PlayerA, where: "earth" })
    ]?.[1];
  if (unitOnEarth2 == null) {
    throw new Error("unitOnEarth1 not found");
  }
  if (unitOnEarth1.id != unit2.id) {
    throw new Error(`${unit2.id}必須是部隊先頭`);
  }
  if (unitOnEarth2.id != unit1.id) {
    throw new Error(`${unit2.id}必須是部隊後面`);
  }
  console.log("SystemHandlePhaseEffectAction");
  ctx = applyAction(ctx, PlayerA, {
    id: "SystemHandlePhaseEffectAction",
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
  console.log("SystemNextStepAction");
  ctx = applyAction(ctx, PlayerA, {
    id: "SystemNextStepAction",
    playerID: PlayerA,
  });
  console.log(ctx);
  if (ctx.gameState.phase[0] != "guard") {
    throw new Error("現在必須是防禦階段");
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
  console.log("SystemNextStepAction");
  ctx = applyAction(ctx, PlayerA, {
    id: "SystemNextStepAction",
    playerID: PlayerA,
  });
  if (ctx.gameState.phase[1] != "effect") {
    throw new Error("現在必須是防禦階段的規定效果");
  }
  const enemy1 =
    ctx.gameState.table.cardStack[
      cardPositionID({ playerID: PlayerB, where: "ground" })
    ]?.[0];
  if (enemy1 == null) {
    throw new Error("enemy1 not found");
  }
  console.log("敵方出一機");
  ctx = applyAction(ctx, PlayerB, {
    id: "GuardAction",
    playerID: PlayerB,
    cardID: enemy1.id,
    from: { playerID: PlayerB, where: "ground" },
    to: { playerID: PlayerB, where: "earth" },
    beforeCardID: null,
  });
  console.log("SystemHandlePhaseEffectAction");
  ctx = applyAction(ctx, PlayerB, {
    id: "SystemHandlePhaseEffectAction",
    playerID: PlayerB,
  });
  if (ctx.gameState.phase[1] != "after") {
    throw new Error("現在必須是after");
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
  console.log("SystemNextStepAction");
  ctx = applyAction(ctx, PlayerA, {
    id: "SystemNextStepAction",
    playerID: PlayerA,
  });
  if (ctx.gameState.phase[0] != "damage") {
    throw new Error("現在必須是傷判階段");
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
  console.log("SystemNextStepAction");
  ctx = applyAction(ctx, PlayerA, {
    id: "SystemNextStepAction",
    playerID: PlayerA,
  });
  if (ctx.gameState.phase[1] != "effect") {
    throw new Error("現在必須是傷判階段的規定效果");
  }
  console.log("SystemHandlePhaseEffectAction");
  ctx = applyAction(ctx, PlayerB, {
    id: "SystemHandlePhaseEffectAction",
    playerID: PlayerB,
  });
  console.log(ctx);
}
