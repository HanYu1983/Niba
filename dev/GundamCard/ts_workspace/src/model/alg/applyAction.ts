import { Context, Action } from "../../tool/types";
import { applyAction_AttackAction } from "./applyAction.AttackAction";
import { applyAction_GuardAction } from "./applyAction.GuardAction";
import { applyAction_EndStepAction } from "./applyAction.EndStepAction";
import { applyAction_AddPaymentAction } from "./applyAction.AddPaymentAction";
import { applyAction_SystemNextStepAction } from "./applyAction.SystemNextStepAction";
import { applyAction_SystemAddDestroyEffectAction } from "./applyAction.SystemAddDestroyEffectAction";
import { applyAction_SystemHandleEffectAction } from "./applyAction.SystemHandleEffectAction";
import { applyAction_SystemHandlePhaseEffectAction } from "./applyAction.SystemHandlePhaseEffectAction";
import { applyAction_CancelConfirmPhaseAction } from "./applyAction.CancelConfirmPhaseAction";
import { applyAction_ConfirmPhaseAction } from "./applyAction.ConfirmPhaseAction";
import { applyAction_ApplyPaymentAction } from "./applyAction.ApplyPaymentAction";
import { applyAction_CancelPaymentAction } from "./applyAction.CancelPaymentAction";
import { applyAction_PlayCardAction } from "./applyAction.PlayCardAction";
import { applyAction_PlayCardAbilityAction } from "./applyAction.PlayCardAbilityAction";
import { applyAction_TapCardToGenG } from "./applyAction.TapCardToGenG";
import { applyAction_AddDestroyEffectAction } from "./applyAction.AddDestroyEffectAction";
import { applyAction_TargetCardToGenTarget1 } from "./applyAction.TargetCardToGenTarget1";

export function applyAction(
  ctx: Context,
  playerID: string,
  action: Action
): Context {
  switch (action.id) {
    case "AttackAction":
      return applyAction_AttackAction(ctx, playerID, action);
    case "GuardAction":
      return applyAction_GuardAction(ctx, playerID, action);
    case "EndStepAction":
      return applyAction_EndStepAction(ctx, playerID, action);
    case "AddPaymentAction":
      return applyAction_AddPaymentAction(ctx, playerID, action);
    case "SystemNextStepAction":
      return applyAction_SystemNextStepAction(ctx, playerID, action);
    case "SystemAddDestroyEffectAction":
      return applyAction_SystemAddDestroyEffectAction(ctx, playerID, action);
    case "SystemHandleEffectAction":
      return applyAction_SystemHandleEffectAction(ctx, playerID, action);
    case "SystemHandlePhaseEffectAction":
      return applyAction_SystemHandlePhaseEffectAction(ctx, playerID, action);
    case "CancelConfirmPhaseAction":
      return applyAction_CancelConfirmPhaseAction(ctx, playerID, action);
    case "ConfirmPhaseAction":
      return applyAction_ConfirmPhaseAction(ctx, playerID, action);
    case "ApplyPaymentAction":
      return applyAction_ApplyPaymentAction(ctx, playerID, action);
    case "CancelPaymentAction":
      return applyAction_CancelPaymentAction(ctx, playerID, action);
    case "PlayCardAction":
      return applyAction_PlayCardAction(ctx, playerID, action);
    case "PlayCardAbilityAction":
      return applyAction_PlayCardAbilityAction(ctx, playerID, action);
    case "TapCardToGenG":
      return applyAction_TapCardToGenG(ctx, playerID, action);
    case "AddDestroyEffectAction":
      throw new Error("not support yet");
    case "TargetCardToGenTarget1":
      return applyAction_TargetCardToGenTarget1(ctx, playerID, action);
  }
  return ctx;
}
