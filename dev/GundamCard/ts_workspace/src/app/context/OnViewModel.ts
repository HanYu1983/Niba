import * as rxjs from "rxjs";
import { cardPositionID } from "../../model/alg/tool";
import { OnEvent, OnError } from "../../tool/eventCenter";
import { createCard } from "../../tool/table";
import * as types from "../../tool/types";
import * as firebase from "../../tool/firebase";
import { applyAction } from "../../model/alg/applyAction";

export type Selection = { [key: string]: boolean };

export type ViewModel = {
  model: types.Context;
  clientID: string;
  cardSelection: Selection;
  cardPositionSelection: Selection;
};

export const DEFAULT_VIEW_MODEL: ViewModel = {
  model: types.defaultContext,
  clientID: types.PlayerA,
  cardSelection: {},
  cardPositionSelection: {},
};

export const OnViewModel = OnEvent.pipe(
  rxjs.scan((viewModel, evt): ViewModel => {
    console.log("OnViewModel:", evt);
    switch (evt.id) {
      case "OnClickNewGame": {
        let table = types.defaultContext.gameState.table;
        table = createCard(
          table,
          types.PlayerA,
          cardPositionID({ playerID: types.PlayerA, where: "hand" }),
          ["179030_11E_U_BK187N_black", "179030_11E_U_BK187N_black"]
        );
        table = createCard(
          table,
          types.PlayerB,
          cardPositionID({ playerID: types.PlayerB, where: "hand" }),
          ["179030_11E_U_BK187N_black", "179030_11E_U_BK187N_black"]
        );
        let newModel: types.Context = {
          ...types.defaultContext,
          gameState: {
            ...types.defaultContext.gameState,
            table: table,
          },
        };
        firebase.sync(newModel);
        return viewModel;
      }
      case "OnClickChangeClient": {
        const nextClient =
          viewModel.clientID == types.PlayerA ? types.PlayerB : types.PlayerA;
        return {
          ...viewModel,
          clientID: nextClient,
        };
      }
      case "OnModelFromFirebase":
        return {
          ...viewModel,
          model: evt.model,
        };
      case "OnClickCardEvent":
        return {
          ...viewModel,
          cardSelection: {
            ...viewModel.cardSelection,
            [evt.card.id]: !!!viewModel.cardSelection[evt.card.id],
          },
        };
      case "OnClickCardPositionEvent": {
        const key = cardPositionID(evt.where);
        return {
          ...viewModel,
          cardPositionSelection: {
            ...viewModel.cardPositionSelection,
            [key]: !!!viewModel.cardPositionSelection[key],
          },
        };
      }
      case "OnClickActionConfirm": {
        try {
          const newModel = applyAction(
            viewModel.model,
            viewModel.clientID,
            evt.action
          );
          return {
            ...viewModel,
            model: newModel,
          };
        } catch (e: any) {
          OnError.next(e);
        }
        return viewModel;
      }
      default:
        console.log(`unknown evt ${evt}`);
        return viewModel;
    }
  }, DEFAULT_VIEW_MODEL)
);
