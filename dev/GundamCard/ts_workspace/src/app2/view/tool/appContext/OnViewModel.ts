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
  Timing,
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
  localMemory: {
    clientID: string | null;
    timing: Timing;
    lastPassPhase: boolean;
  };
};

export const DEFAULT_VIEW_MODEL: ViewModel = {
  model: DEFAULT_GAME_CONTEXT,
  cardSelection: [],
  cardPositionSelection: [],
  localMemory: {
    clientID: null,
    timing: TIMING_CHART[0],
    lastPassPhase: false,
  },
};

export const OnViewModel = OnEvent.pipe(
  rxjs.scan((viewModel, evt): ViewModel => {
    log2("OnViewModel", "evt", evt);
    log2("OnViewModel", "viewModel", viewModel);
    try {
      switch (evt.id) {
        case "OnClickNewGame": {
          // let newModel = DEFAULT_GAME_CONTEXT;
          // let table = newModel.gameState.table;
          // table = createCard(
          //   table,
          //   PlayerA,
          //   getBaShouID({
          //     id: "AbsoluteBaSyou",
          //     value: [PlayerA, "本国"],
          //   }),
          //   ["179016_04B_U_WT075C_white", "179030_11E_U_BL208S_blue"]
          // );
          // table = createCard(
          //   table,
          //   PlayerA,
          //   getBaShouID({
          //     id: "AbsoluteBaSyou",
          //     value: [PlayerA, "手札"],
          //   }),
          //   ["179016_04B_U_WT075C_white"]
          // );
          // table = createCard(
          //   table,
          //   PlayerA,
          //   getBaShouID({
          //     id: "AbsoluteBaSyou",
          //     value: [PlayerA, "Gゾーン"],
          //   }),
          //   [
          //     "179016_04B_U_WT075C_white",
          //     "179030_11E_U_BL208S_blue",
          //     "179030_11E_U_BL215R_blue",
          //     "179001_01A_CH_WT007R_white",
          //     "179030_11E_C_BL076S_blue",
          //   ]
          // );
          // table = createCard(
          //   table,
          //   PlayerA,
          //   getBaShouID({
          //     id: "AbsoluteBaSyou",
          //     value: [PlayerA, "配備エリア"],
          //   }),
          //   ["179030_11E_U_BL208S_blue", "179030_11E_U_BL208S_blue"]
          // );
          // table = createCard(
          //   table,
          //   PlayerB,
          //   getBaShouID({
          //     id: "AbsoluteBaSyou",
          //     value: [PlayerB, "配備エリア"],
          //   }),
          //   ["179016_04B_U_WT075C_white", "179030_11E_U_BL208S_blue"]
          // );
          // table = createCard(
          //   table,
          //   PlayerB,
          //   getBaShouID({
          //     id: "AbsoluteBaSyou",
          //     value: [PlayerB, "手札"],
          //   }),
          //   ["179001_01A_CH_WT007R_white"]
          // );
          // newModel = {
          //   ...newModel,
          //   gameState: {
          //     ...newModel.gameState,
          //     timing: TIMING_CHART[9],
          //     table: table,
          //     activePlayerID: PlayerA,
          //   },
          //   versionID: viewModel.model.versionID,
          // };

          let ctx = DEFAULT_GAME_CONTEXT;
          let table = ctx.gameState.table;
          console.log("準備F91在手上");
          table = createCard(
            table,
            PlayerA,
            getBaShouID({
              id: "AbsoluteBaSyou",
              value: [PlayerA, "手札"],
            }),
            ["179901_00_U_RD010P_red", "179025_07D_U_RD158C_red"]
          );
          console.log("準備2張G");
          table = createCard(
            table,
            PlayerA,
            getBaShouID({
              id: "AbsoluteBaSyou",
              value: [PlayerA, "Gゾーン"],
            }),
            [
              "179030_11E_G_RD021N_red",
              "179030_11E_G_RD021N_red",
              "179030_11E_G_RD021N_red",
              "179030_11E_G_RD021N_red",
              "179030_11E_G_RD021N_red",
              "179030_11E_G_RD021N_red",
            ]
          );
          table = createCard(
            table,
            PlayerB,
            getBaShouID({
              id: "AbsoluteBaSyou",
              value: [PlayerB, "プレイされているカード"],
            }),
            ["179030_11E_G_RD021N_red"]
          );
          table = createCard(
            table,
            PlayerB,
            getBaShouID({
              id: "AbsoluteBaSyou",
              value: [PlayerB, "戦闘エリア（右）"],
            }),
            ["179008_02A_U_WT034U_white", "179008_02A_U_WT034U_white"]
          );
          ctx = {
            ...ctx,
            gameState: {
              ...ctx.gameState,
              table: table,
              activePlayerID: PlayerA,
            },
          };
          ctx = {
            ...ctx,
            gameState: {
              ...ctx.gameState,
              // @ts-ignore
              timing: TIMING_CHART.find(
                //(t) => t[1][1] == "ダメージ判定ステップ"
                (t) => t[1][0] == "配備フェイズ"
              ),
            },
            versionID: viewModel.model.versionID,
          };
          ctx = initState(ctx);
          firebase.sync(ctx);
          return DEFAULT_VIEW_MODEL;
        }
        case "OnClickFlowConfirm": {
          const model = applyFlow(viewModel.model, evt.clientID, evt.flow);
          const isDirty =
            JSON.stringify(viewModel.model) != JSON.stringify(model);
          if (isDirty == false) {
            return viewModel;
          }
          firebase.sync(model);
          return {
            ...viewModel,
            localMemory: {
              clientID: evt.clientID,
              timing: model.gameState.timing,
              lastPassPhase:
                model.gameState.flowMemory.hasPlayerPassPhase[evt.clientID] ||
                false,
            },
          };
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
          if (remoteNum >= originNum) {
            if (remoteNum > originNum) {
              OnError.next(
                new Error(
                  `你的版號過期，本地資料將被覆蓋:origin(${originNum}) remote(${remoteNum})`
                )
              );
            }
            if (
              viewModel.localMemory.clientID != null &&
              viewModel.localMemory.timing[0] == evt.model.gameState.timing[0]
            ) {
              const hasPlayerPassPhaseMerge = {
                ...evt.model.gameState.flowMemory.hasPlayerPassPhase,
                [viewModel.localMemory.clientID]:
                  viewModel.localMemory.lastPassPhase,
              };
              let model = evt.model;
              model = {
                ...model,
                gameState: {
                  ...model.gameState,
                  flowMemory: {
                    ...model.gameState.flowMemory,
                    hasPlayerPassPhase: hasPlayerPassPhaseMerge,
                  },
                },
              };
              const isDirty =
                JSON.stringify(evt.model) != JSON.stringify(model);
              if (isDirty) {
                model = {
                  ...model,
                  versionID: remoteNum + 1000,
                };
                firebase.sync(model);
                return {
                  ...viewModel,
                  model: model,
                };
              }
            }
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
                `版本號不對，送新上傳版本:origin(${originNum}) remote(${remoteNum})`
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
