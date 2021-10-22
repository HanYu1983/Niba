import { mapCard, moveCard } from "../../tool/table";
import {
  Context,
  Action,
  Payment,
  Effect,
  mapPlayerState,
  isEveryConfirmPhase,
} from "../../tool/types";
import { cardPositionID, opponent } from "./tool";
import { checkPayment } from "./checkPayment";
import { queryPlayCardPayment } from "./queryPlayCardPayment";
import { PlayerA, PlayerB } from "../../tool/types";
import { handleAttackDamage } from "./handleAttackDamage";
import { askNextPhase } from "./askNextPhase";
import { onEffectCompleted } from "./onEffectCompleted";
import { onCardEntered } from "./onCardEntered";
import { AttackAction } from "./applyAction.AttackAction";
import { GuardAction } from "./applyAction.GuardAction";
import { EndStepAction } from "./applyAction.EndStepAction";
import { AddPaymentAction } from "./applyAction.AddPaymentAction";
import { SystemNextStepAction } from "./applyAction.SystemNextStepAction";
import { SystemAddDestroyEffectAction } from "./applyAction.SystemAddDestroyEffectAction";
import { SystemHandleEffectAction } from "./applyAction.SystemHandleEffectAction";
import { SystemHandlePhaseEffectAction } from "./applyAction.SystemHandlePhaseEffectAction";
import { CancelConfirmPhaseAction } from "./applyAction.CancelConfirmPhaseAction";
import { ConfirmPhaseAction } from "./applyAction.ConfirmPhaseAction";
import { ApplyPaymentAction } from "./applyAction.ApplyPaymentAction";
import { CancelPaymentAction } from "./applyAction.CancelPaymentAction";
import { PlayCardAction } from "./applyAction.PlayCardAction";
import { PlayCardAbilityAction } from "./applyAction.PlayCardAbilityAction";
import { TapCardToGenG } from "./applyAction.TapCardToGenG";

export function applyAction(
  ctx: Context,
  playerID: string,
  action: Action
): Context {
  switch (action.id) {
    case "AttackAction":
      return AttackAction(ctx, playerID, action);
    case "GuardAction":
      return GuardAction(ctx, playerID, action);
    case "EndStepAction":
      return EndStepAction(ctx, playerID, action);
    case "AddPaymentAction":
      return AddPaymentAction(ctx, playerID, action);
    case "SystemNextStepAction":
      return SystemNextStepAction(ctx, playerID, action);
    case "SystemAddDestroyEffectAction":
      return SystemAddDestroyEffectAction(ctx, playerID, action);
    case "SystemHandleEffectAction":
      return SystemHandleEffectAction(ctx, playerID, action);
    case "SystemHandlePhaseEffectAction":
      return SystemHandlePhaseEffectAction(ctx, playerID, action);
    case "CancelConfirmPhaseAction":
      return CancelConfirmPhaseAction(ctx, playerID, action);
    case "ConfirmPhaseAction":
      return ConfirmPhaseAction(ctx, playerID, action);
    case "ApplyPaymentAction":
      return ApplyPaymentAction(ctx, playerID, action);
    case "CancelPaymentAction":
      return CancelPaymentAction(ctx, playerID, action);
    case "PlayCardAction":
      return PlayCardAction(ctx, playerID, action);
    case "PlayCardAbilityAction":
      return PlayCardAbilityAction(ctx, playerID, action);
    case "TapCardToGenG":
      return TapCardToGenG(ctx, playerID, action);
  }
  return ctx;
}
