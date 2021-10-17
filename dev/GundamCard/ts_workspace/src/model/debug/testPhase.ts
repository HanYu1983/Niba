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
import { PlayerA, PlayerB } from "../../app/context";
import { askCardColor } from "../alg";

export function testPhase() {
  let ctx: Context = {
    ...defaultContext,
    gameState: {
      ...defaultContext.gameState,
      phase: ["draw", "before"],
      activePlayerID: PlayerA,
    },
  };
  console.log("A宣告沒事");
  ctx = applyAction(ctx, PlayerA, {
    id: "ConfirmPhaseAction",
    playerID: PlayerA,
  });
  if ((ctx.gameState.playerState[PlayerA]?.confirmPhase || false) != true) {
    throw new Error("PlayerA必須確認結束");
  }
  if ((ctx.gameState.playerState[PlayerB]?.confirmPhase || false) != false) {
    throw new Error("PlayerB必須沒有結束");
  }
  console.log("B宣告沒事");
  ctx = applyAction(ctx, PlayerB, {
    id: "ConfirmPhaseAction",
    playerID: PlayerB,
  });
  console.log("SystemNextStepAction")
  ctx = applyAction(ctx, PlayerA, {
    id: "SystemNextStepAction",
    playerID: PlayerA
  })
  if (ctx.gameState.phase[1] != "effect") {
    throw new Error("必須到規定效果");
  }
  if ((ctx.gameState.playerState[PlayerA]?.confirmPhase || false) != false) {
    throw new Error("PlayerA的確認狀態必須被清空");
  }
  if ((ctx.gameState.playerState[PlayerB]?.confirmPhase || false) != false) {
    throw new Error("PlayerB的確認狀態必須被清空");
  }
  if (ctx.gameState.phase[1] != "effect") {
    throw new Error("必須到規定效果");
  }
  console.log("A完成規定效果");
  ctx = applyAction(ctx, PlayerA, {
    id: "SystemHandlePhaseEffectAction",
    playerID: PlayerA,
  });
  if (ctx.gameState.phase[1] != "after") {
    throw new Error("必須到after");
  }
  console.log("現在到了抽牌階段規定效果後的自由時間");
  console.log("A宣告到下一步");
  ctx = applyAction(ctx, PlayerA, {
    id: "ConfirmPhaseAction",
    playerID: PlayerA,
  });
  console.log("B宣告到下一步");
  ctx = applyAction(ctx, PlayerB, {
    id: "ConfirmPhaseAction",
    playerID: PlayerB,
  });
  console.log("SystemNextStepAction")
  ctx = applyAction(ctx, PlayerA, {
    id: "SystemNextStepAction",
    playerID: PlayerA
  })
  if (ctx.gameState.phase[0] != "set") {
    throw new Error("必須到設置階段");
  }
  if (ctx.gameState.phase[1] != "before") {
    throw new Error("必須到設置階段的自由時間");
  }
}
