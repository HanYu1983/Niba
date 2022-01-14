import * as rxjs from "rxjs";
import { OnEvent, OnError } from "./eventCenter";
import * as firebase from "../../../../tool/firebase";
import {
  DEFAULT_GAME_CONTEXT,
  GameContext,
} from "../../../tool/tool/basic/gameContext";
import { getBaShouID, PlayerA } from "../../../tool/tool/basic/basic";
import { applyFlow } from "../../../tool/alg/handleClient";
import { createCard } from "../../../../tool/table";
import { initState } from "../../../tool/alg/handleGameContext";

export type Selection = { [key: string]: boolean };

export type ViewModel = {
  model: GameContext;
  cardSelection: Selection;
  cardPositionSelection: Selection;
};

export const DEFAULT_VIEW_MODEL: ViewModel = {
  model: DEFAULT_GAME_CONTEXT,
  cardSelection: {},
  cardPositionSelection: {},
};

export const OnViewModel = OnEvent.pipe(
  rxjs.scan((viewModel, evt): ViewModel => {
    console.log("OnViewModel:", evt);
    try {
      switch (evt.id) {
        case "OnClickNewGame": {
          let newModel = DEFAULT_GAME_CONTEXT;
          let table = newModel.gameState.table;
          table = createCard(
            table,
            PlayerA,
            getBaShouID({
              id: "AbsoluteBaSyou",
              value: [PlayerA, "本国"],
            }),
            [
              "179016_04B_U_WT075C_white",
              // "179030_11E_U_BL208S_blue",
              // "179030_11E_U_BL215R_blue",
              //"179001_01A_CH_WT007R_white",
              //"179030_11E_C_BL076S_blue",
            ]
          );
          // table = createCard(
          //   table,
          //   PlayerA,
          //   getBaShouID({
          //     id: "AbsoluteBaSyou",
          //     value: [PlayerA, "手札"],
          //   }),
          //   ["179001_01A_CH_WT007R_white"]
          // );
          newModel = {
            ...newModel,
            gameState: {
              ...newModel.gameState,
              table: table,
              activePlayerID: PlayerA,
            },
          };
          newModel = initState(newModel);
          firebase.sync(newModel);
          return DEFAULT_VIEW_MODEL;
        }
        case "OnClickFlowConfirm": {
          const model = applyFlow(viewModel.model, evt.clientID, evt.flow);
          console.log(model);
          firebase.sync(model);
          return viewModel;
        }
        case "OnClickChangeClient": {
          return viewModel;
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
        default:
          console.log(`unknown evt ${evt}`);
          return viewModel;
      }
    } catch (e: any) {
      console.log(e);
    }
    return viewModel;
  }, DEFAULT_VIEW_MODEL)
);
