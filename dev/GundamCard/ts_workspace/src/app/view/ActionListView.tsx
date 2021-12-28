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
    if (appContext.viewModel.model.gameState.paymentTable.action) {
      list.push({
        id: "CancelPaymentAction",
        playerID: appContext.viewModel.clientID,
      });
      list.push({
        id: "ApplyPaymentAction",
        playerID: appContext.viewModel.clientID,
      });
      return list;
    }
    const selectedCardIds = Object.entries(appContext.viewModel.cardSelection)
      .filter(([k, v]) => {
        return v;
      })
      .map(([k, v]) => {
        return k;
      });
    const selectedCardPositionIds = Object.entries(
      appContext.viewModel.cardPositionSelection
    )
      .filter(([k, v]) => {
        return v;
      })
      .map(([k, v]) => {
        return k;
      });
    if (selectedCardIds.length && selectedCardPositionIds.length) {
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
