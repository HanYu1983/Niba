import * as rxjs from "rxjs";
import { OnEvent, OnError } from "./eventCenter";
import * as firebase from "../../../../tool/firebase";
import {
  DEFAULT_GAME_CONTEXT,
  GameContext,
} from "../../../tool/tool/basic/gameContext";
import {
  getBaShouID,
  PlayerA,
  PlayerB,
  TIMING_CHART,
} from "../../../tool/tool/basic/basic";
import {
  applyFlow,
  Flow,
  setRequireTarget,
} from "../../../tool/alg/handleClient";
import { createCard } from "../../../../tool/table";
import { initState } from "../../../tool/alg/handleGameContext";
import { log2 } from "../../../../tool/logger";

export type Selection = string[];

export type ViewModel = {
  model: GameContext;
  cardSelection: Selection;
  cardPositionSelection: Selection;
  flows: Flow[];
};

export const DEFAULT_VIEW_MODEL: ViewModel = {
  model: DEFAULT_GAME_CONTEXT,
  cardSelection: [],
  cardPositionSelection: [],
  flows: [],
};

export const OnViewModel = OnEvent.pipe(
  rxjs.scan((viewModel, evt): ViewModel => {
    log2("OnViewModel", "evt", evt);
    log2("OnViewModel", "viewModel", viewModel);
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
              "179030_11E_U_BL208S_blue",
              // "179030_11E_U_BL215R_blue",
              //"179001_01A_CH_WT007R_white",
              //"179030_11E_C_BL076S_blue",
            ]
          );
          table = createCard(
            table,
            PlayerA,
            getBaShouID({
              id: "AbsoluteBaSyou",
              value: [PlayerA, "手札"],
            }),
            ["179016_04B_U_WT075C_white"]
          );
          table = createCard(
            table,
            PlayerA,
            getBaShouID({
              id: "AbsoluteBaSyou",
              value: [PlayerA, "Gゾーン"],
            }),
            [
              "179016_04B_U_WT075C_white",
              "179030_11E_U_BL208S_blue",
              "179030_11E_U_BL215R_blue",
              "179001_01A_CH_WT007R_white",
              "179030_11E_C_BL076S_blue",
            ]
          );
          table = createCard(
            table,
            PlayerA,
            getBaShouID({
              id: "AbsoluteBaSyou",
              value: [PlayerA, "配備エリア"],
            }),
            ["179030_11E_U_BL208S_blue", "179030_11E_U_BL208S_blue"]
          );
          table = createCard(
            table,
            PlayerB,
            getBaShouID({
              id: "AbsoluteBaSyou",
              value: [PlayerB, "配備エリア"],
            }),
            ["179016_04B_U_WT075C_white", "179030_11E_U_BL208S_blue"]
          );
          table = createCard(
            table,
            PlayerB,
            getBaShouID({
              id: "AbsoluteBaSyou",
              value: [PlayerB, "手札"],
            }),
            ["179001_01A_CH_WT007R_white"]
          );
          newModel = {
            ...newModel,
            gameState: {
              ...newModel.gameState,
              timing: TIMING_CHART[9],
              table: table,
              activePlayerID: PlayerA,
            },
            versionID: viewModel.model.versionID,
          };
          newModel = initState(newModel);
          firebase.sync(newModel);
          return DEFAULT_VIEW_MODEL;
        }
        case "OnClickFlowConfirm": {
          const model = applyFlow(viewModel.model, evt.clientID, evt.flow);
          firebase.sync(model);
          return viewModel;
        }
        case "OnClickRequireTargetConfirm": {
          if (evt.require.key == null) {
            throw new Error("key must not null");
          }
          const model = setRequireTarget(
            viewModel.model,
            evt.require.key,
            evt.varID,
            {
              id: "カード",
              value: viewModel.cardSelection,
            }
          );
          firebase.sync(model);
          return { ...viewModel, cardSelection: [] };
        }
        case "OnClickChangeClient": {
          return viewModel;
        }
        case "OnModelFromFirebase":
          const originNum = viewModel.model.versionID;
          const remoteNum = evt.model.versionID;
          if (remoteNum > originNum) {
            OnError.next(
              new Error(
                `你的版號過期，本地資料將被覆蓋:origin(${viewModel.model.versionID}) remote(${evt.model.versionID})`
              )
            );
            return {
              ...viewModel,
              model: {
                ...evt.model,
                versionID: remoteNum + 1,
              },
            };
          } else if (remoteNum == originNum) {
            // const isDirty =
            //   JSON.stringify(viewModel.model) != JSON.stringify(evt.model);
            // if (isDirty == false) {
            //   return viewModel;
            // }
            return {
              ...viewModel,
              model: {
                ...evt.model,
                versionID: remoteNum + 1,
              },
            };
          } else {
            OnError.next(
              new Error(
                `版本號不對，送新上傳版本:origin(${viewModel.model.versionID}) remote(${evt.model.versionID})`
              )
            );
            firebase.sync(viewModel.model);
            return viewModel;
          }
        case "OnClickCardEvent":
          if (viewModel.cardSelection.includes(evt.card.id)) {
            return {
              ...viewModel,
              cardSelection: viewModel.cardSelection.filter(
                (v) => v != evt.card.id
              ),
            };
          }
          return {
            ...viewModel,
            cardSelection: [...viewModel.cardSelection, evt.card.id],
          };
        default:
          console.log(`unknown evt ${evt}`);
          return viewModel;
      }
    } catch (e: any) {
      OnError.next(e);
    }
    return viewModel;
  }, DEFAULT_VIEW_MODEL)
);
