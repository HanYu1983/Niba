import * as rxjs from "rxjs";
import { OnEvent, OnError } from "./eventCenter";
import * as firebase from "../../../../tool/firebase";
import {
  DEFAULT_GAME_CONTEXT,
  GameContext,
} from "../../../tool/tool/basic/gameContext";
import { PlayerA } from "../../../tool/tool/basic/basic";
import { applyFlow } from "../../../tool/alg/handleClient";

export type Selection = { [key: string]: boolean };

export type ViewModel = {
  model: GameContext;
  clientID: string;
  cardSelection: Selection;
  cardPositionSelection: Selection;
};

export const DEFAULT_VIEW_MODEL: ViewModel = {
  model: DEFAULT_GAME_CONTEXT,
  clientID: PlayerA,
  cardSelection: {},
  cardPositionSelection: {},
};

export const OnViewModel = OnEvent.pipe(
  rxjs.scan((viewModel, evt): ViewModel => {
    console.log("OnViewModel:", evt);
    switch (evt.id) {
      case "OnClickNewGame": {
        let newModel = DEFAULT_GAME_CONTEXT;
        firebase.sync(newModel);
        return DEFAULT_VIEW_MODEL;
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
  }, DEFAULT_VIEW_MODEL)
);
