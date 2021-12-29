import React, { useContext, useMemo } from "react";
import { AppContext } from "../context";
import * as types from "../../tool/types";
import { OnEvent } from "../../tool/eventCenter";
import { cardPosition } from "../../model/alg/tool";
import { getCardPosition } from "../../tool/table";

export const ActionListView = (props: {}) => {
  const appContext = useContext(AppContext);
  const actionList = useMemo(() => {
    const list: types.Action[] = [];

    const hasPayment =
      appContext.viewModel.model.gameState.paymentTable.action != null;

    const hasEffect =
      appContext.viewModel.model.gameState.effectStack.effects.length > 0;

    const selectedCardIds = Object.entries(appContext.viewModel.cardSelection)
      .filter(([k, v]) => {
        return v;
      })
      .map(([k, v]) => {
        return k;
      });
    const hasSelectedCard = selectedCardIds.length > 0;

    const selectedCardPositionIds = Object.entries(
      appContext.viewModel.cardPositionSelection
    )
      .filter(([k, v]) => {
        return v;
      })
      .map(([k, v]) => {
        return k;
      });
    const hasSelectedCardPosition = selectedCardPositionIds.length > 0;
    const isActivePlayer =
      appContext.viewModel.model.gameState.activePlayerID ==
      appContext.viewModel.clientID;
    const lastEffect = hasEffect
      ? appContext.viewModel.model.gameState.effectStack.effects[
          appContext.viewModel.model.gameState.effectStack.effects.length - 1
        ]
      : null;
    const isLastEffectOwner =
      lastEffect &&
      lastEffect.id == "ActionEffect" &&
      lastEffect.action.playerID == appContext.viewModel.clientID;

    const enableCancelPaymentAction = hasPayment;
    const enableApplyPaymentAction = hasPayment;
    const enablePlayCardAction =
      hasPayment == false && hasSelectedCard && hasSelectedCardPosition;
    const enableConfirmPhaseAction = true;
    const enableCancelConfirmPhaseAction = hasEffect;
    const enableSystemHandleEffectAction = hasEffect && isActivePlayer;
    const enableSystemNextStepAction = true;
    const enableSystemHandlePhaseEffectAction = true;

    if (enableCancelPaymentAction) {
      list.push({
        id: "CancelPaymentAction",
        playerID: appContext.viewModel.clientID,
      });
    }
    if (enableApplyPaymentAction) {
      list.push({
        id: "ApplyPaymentAction",
        playerID: appContext.viewModel.clientID,
      });
    }
    if (enableConfirmPhaseAction) {
      list.push({
        id: "ConfirmPhaseAction",
        playerID: appContext.viewModel.clientID,
      });
    }
    if (enableCancelConfirmPhaseAction) {
      list.push({
        id: "CancelConfirmPhaseAction",
        playerID: appContext.viewModel.clientID,
      });
    }
    if (enableSystemHandleEffectAction) {
      list.push({
        id: "SystemHandleEffectAction",
        playerID: appContext.viewModel.clientID,
      });
    }
    if (enableSystemNextStepAction) {
      list.push({
        id: "SystemNextStepAction",
        playerID: appContext.viewModel.clientID,
      });
    }
    if (enableSystemHandlePhaseEffectAction) {
      list.push({
        id: "SystemHandlePhaseEffectAction",
        playerID: appContext.viewModel.clientID,
      });
    }
    if (enablePlayCardAction) {
      const toPos: types.CardPosition = cardPosition(
        selectedCardPositionIds[0]
      );
      const useCardID = selectedCardIds[0];
      const [_card, cardPositionIDFrom] = getCardPosition(
        appContext.viewModel.model.gameState.table,
        useCardID
      );
      if (cardPositionIDFrom) {
        const fromPos = cardPosition(cardPositionIDFrom);
        list.push({
          id: "PlayCardAction",
          cardID: useCardID,
          from: fromPos,
          to: toPos,
          playerID: appContext.viewModel.clientID,
        });
      } else {
        console.log("[ActionListView] cardPositionIDFrom not found");
      }
    }
    return list;
  }, [
    appContext.viewModel.cardSelection,
    appContext.viewModel.cardPositionSelection,
    appContext.viewModel.clientID,
    appContext.viewModel.model.gameState.paymentTable,
    appContext.viewModel.model.gameState.table,
    appContext.viewModel.model.gameState.activePlayerID,
  ]);
  const render = useMemo(() => {
    return (
      <div>
        {actionList.map((action, i) => {
          return (
            <div
              key={i}
              style={{ border: "1px solid black" }}
              onClick={() => {
                OnEvent.next({ id: "OnClickActionConfirm", action: action });
              }}
            >
              {JSON.stringify(action)}
            </div>
          );
        })}
      </div>
    );
  }, [actionList]);
  return <>{render}</>;
};
