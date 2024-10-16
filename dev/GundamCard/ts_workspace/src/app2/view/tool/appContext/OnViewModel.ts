import * as rxjs from "rxjs";
import { OnEvent, OnError } from "./eventCenter";
import * as firebase from "../../../../tool/firebase";
import {
  DEFAULT_GAME_CONTEXT,
  GameContext,
} from "../../../tool/tool/basic/gameContext";
import {
  getBaSyouID,
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
import { initState, updateCommand } from "../../../tool/alg/handleGameContext";
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
    try {
      switch (evt.id) {
        case "OnClickNewGame": {
          let ctx = DEFAULT_GAME_CONTEXT;
          if (false) {
            let table = ctx.gameState.table;
            table = createCard(
              table,
              PlayerA,
              getBaSyouID({
                id: "AbsoluteBaSyou",
                value: [PlayerA, "本国"],
              }),
              [
                "179016_04B_U_WT075C_white",
                "179016_04B_U_WT075C_white",
                "179029_05C_O_BK014C_black",
              ]
            );
            table = createCard(
              table,
              PlayerA,
              getBaSyouID({
                id: "AbsoluteBaSyou",
                value: [PlayerA, "手札"],
              }),
              ["179016_04B_U_WT075C_white", "179004_01A_CH_WT009R_white"]
            );
            table = createCard(
              table,
              PlayerA,
              getBaSyouID({
                id: "AbsoluteBaSyou",
                value: [PlayerA, "Gゾーン"],
              }),
              [
                "179016_04B_U_WT075C_white",
                "179016_04B_U_WT075C_white",
                "179016_04B_U_WT075C_white",
                "179001_01A_CH_WT007R_white",
                "179030_11E_C_BL076S_blue",
              ]
            );
            table = createCard(
              table,
              PlayerA,
              getBaSyouID({
                id: "AbsoluteBaSyou",
                value: [PlayerA, "配備エリア"],
              }),
              [
                "179008_02A_U_WT034U_white",
                "179008_02A_U_WT034U_white",
                "179016_04B_U_WT074C_white",
              ]
            );
            table = createCard(
              table,
              PlayerB,
              getBaSyouID({
                id: "AbsoluteBaSyou",
                value: [PlayerB, "配備エリア"],
              }),
              ["179016_04B_U_WT075C_white", "179016_04B_U_WT075C_white"]
            );
            table = createCard(
              table,
              PlayerB,
              getBaSyouID({
                id: "AbsoluteBaSyou",
                value: [PlayerB, "手札"],
              }),
              ["179001_01A_CH_WT007R_white", "179016_04B_U_WT075C_white"]
            );
            table = createCard(
              table,
              PlayerB,
              getBaSyouID({
                id: "AbsoluteBaSyou",
                value: [PlayerB, "Gゾーン"],
              }),
              [
                "179016_04B_U_WT075C_white",
                "179016_04B_U_WT075C_white",
                "179016_04B_U_WT075C_white",
                "179001_01A_CH_WT007R_white",
                "179030_11E_C_BL076S_blue",
              ]
            );
            ctx = {
              ...ctx,
              gameState: {
                ...ctx.gameState,
                table: table,
              },
            };
            ctx = {
              ...ctx,
              gameState: {
                ...ctx.gameState,
                timing: [14, ["戦闘フェイズ", "攻撃ステップ", "規定の効果"]],
                activePlayerID: PlayerA,
                flowMemory: {
                  ...ctx.gameState.flowMemory,
                  state: "playing",
                },
              },
              versionID: viewModel.model.versionID,
            };
          }
          if (false) {
            let table = ctx.gameState.table;
            console.log("準備F91在手上");
            table = createCard(
              table,
              PlayerA,
              getBaSyouID({
                id: "AbsoluteBaSyou",
                value: [PlayerA, "手札"],
              }),
              [
                "179901_00_U_RD010P_red",
                "179025_07D_U_RD156R_red",
                "179025_07D_U_RD158C_red",
                "179001_01A_CH_WT007R_white",
                "179029_05C_O_BK014C_black",
                "179030_11E_O_GN023N_green",
              ]
            );
            table = createCard(
              table,
              PlayerA,
              getBaSyouID({
                id: "AbsoluteBaSyou",
                value: [PlayerA, "配備エリア"],
              }),
              ["179901_00_U_RD010P_red"]
            );
            table = createCard(
              table,
              PlayerA,
              getBaSyouID({
                id: "AbsoluteBaSyou",
                value: [PlayerA, "戦闘エリア（右）"],
              }),
              ["179901_00_U_RD010P_red"]
            );
            console.log("準備2張G");
            table = createCard(
              table,
              PlayerA,
              getBaSyouID({
                id: "AbsoluteBaSyou",
                value: [PlayerA, "Gゾーン"],
              }),
              [
                "179030_11E_G_RD021N_red",
                "179030_11E_G_RD021N_red",
                "179030_11E_G_RD021N_red",
                "179030_11E_O_GN023N_green",
                "179029_05C_O_BK014C_black",
                "179001_01A_CH_WT007R_white",
              ]
            );
            table = createCard(
              table,
              PlayerB,
              getBaSyouID({
                id: "AbsoluteBaSyou",
                value: [PlayerB, "プレイされているカード"],
              }),
              ["179030_11E_G_RD021N_red"]
            );
            table = createCard(
              table,
              PlayerB,
              getBaSyouID({
                id: "AbsoluteBaSyou",
                value: [PlayerB, "配備エリア"],
              }),
              ["179008_02A_U_WT034U_white"]
            );
            table = createCard(
              table,
              PlayerB,
              getBaSyouID({
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
              },
            };
            ctx = {
              ...ctx,
              gameState: {
                ...ctx.gameState,
                activePlayerID: PlayerA,
                // @ts-ignore
                timing: TIMING_CHART.find((t) => t[1][0] == "配備フェイズ"),
              },
              versionID: viewModel.model.versionID,
            };
          }
          if (false) {
            let table = ctx.gameState.table;
            table = createCard(
              table,
              PlayerA,
              getBaSyouID({
                id: "AbsoluteBaSyou",
                value: [PlayerA, "本国"],
              }),
              [
                "179016_04B_U_WT075C_white",
                "179016_04B_U_WT075C_white",
                "179029_05C_O_BK014C_black",
              ]
            );
            table = createCard(
              table,
              PlayerA,
              getBaSyouID({
                id: "AbsoluteBaSyou",
                value: [PlayerA, "手札"],
              }),
              [
                "179029_B3C_CH_WT102R_white",
                "179029_B3C_CH_WT103N_white",
                "179025_07D_CH_WT075C_white",
              ]
            );
            table = createCard(
              table,
              PlayerA,
              getBaSyouID({
                id: "AbsoluteBaSyou",
                value: [PlayerA, "Gゾーン"],
              }),
              [
                "179016_04B_U_WT075C_white",
                "179016_04B_U_WT075C_white",
                "179016_04B_U_WT075C_white",
                "179001_01A_CH_WT007R_white",
                "179030_11E_C_BL076S_blue",
              ]
            );
            table = createCard(
              table,
              PlayerA,
              getBaSyouID({
                id: "AbsoluteBaSyou",
                value: [PlayerA, "配備エリア"],
              }),
              [
                "179008_02A_U_WT034U_white",
                "179016_04B_U_WT074C_white",
                "179001_01A_CH_WT007R_white",
              ]
            );
            table = createCard(
              table,
              PlayerB,
              getBaSyouID({
                id: "AbsoluteBaSyou",
                value: [PlayerB, "配備エリア"],
              }),
              ["179008_02A_U_WT034U_white"]
            );
            ctx = {
              ...ctx,
              gameState: {
                ...ctx.gameState,
                table: table,
              },
            };
            ctx = {
              ...ctx,
              gameState: {
                ...ctx.gameState,
                // @ts-ignore
                timing: TIMING_CHART.find((t) => t[1][0] == "配備フェイズ"),
                activePlayerID: PlayerA,
              },
            };
          }
          if (false) {
            ctx = {
              ...ctx,
              gameState: {
                ...ctx.gameState,
                table: {
                  ...ctx.gameState.table,
                  cardStack: {
                    ...ctx.gameState.table.cardStack,
                    [getBaSyouID({
                      id: "AbsoluteBaSyou",
                      value: [PlayerA, "手札"],
                    })]: [
                      {
                        id: "h1",
                        protoID: "179028_10D_C_BL070N_blue",
                        faceDown: true,
                        ownerID: PlayerA,
                        tap: false,
                      },
                      {
                        id: "h2",
                        protoID: "179019_01A_C_WT010C_white",
                        faceDown: true,
                        ownerID: PlayerA,
                        tap: false,
                      },
                    ],
                    [getBaSyouID({
                      id: "AbsoluteBaSyou",
                      value: [PlayerA, "配備エリア"],
                    })]: [
                      {
                        id: "a1",
                        protoID: "179004_01A_CH_WT010C_white",
                        faceDown: true,
                        ownerID: PlayerA,
                        tap: false,
                      },
                      {
                        id: "a2",
                        protoID: "179016_04B_U_WT075C_white",
                        faceDown: true,
                        ownerID: PlayerA,
                        tap: false,
                      },
                      // {
                      //   id: "a3",
                      //   protoID: "179003_01A_U_BK008U_black",
                      //   faceDown: true,
                      //   ownerID: PlayerA,
                      //   tap: false,
                      // },
                    ],
                    [getBaSyouID({
                      id: "AbsoluteBaSyou",
                      value: [PlayerA, "Gゾーン"],
                    })]: [
                      {
                        id: "g1",
                        protoID: "179019_01A_C_WT010C_white",
                        faceDown: true,
                        ownerID: PlayerA,
                        tap: false,
                      },
                      {
                        id: "g2",
                        protoID: "179030_11E_G_RD021N_red",
                        faceDown: true,
                        ownerID: PlayerA,
                        tap: false,
                      },
                      {
                        id: "g3",
                        protoID: "179028_10D_C_BL070N_blue",
                        faceDown: true,
                        ownerID: PlayerA,
                        tap: false,
                      },
                    ],
                  },
                },
                setGroupLink: { a1: "a2" },
                activePlayerID: PlayerA,
                timing: [
                  24,
                  ["戦闘フェイズ", "ダメージ判定ステップ", "規定の効果"],
                ],
              },
            };
          }
          if (false) {
            ctx = {
              ...ctx,
              gameState: {
                ...ctx.gameState,
                table: {
                  ...ctx.gameState.table,
                  cardStack: {
                    ...ctx.gameState.table.cardStack,
                    [getBaSyouID({
                      id: "AbsoluteBaSyou",
                      value: [PlayerA, "手札"],
                    })]: [],
                    [getBaSyouID({
                      id: "AbsoluteBaSyou",
                      value: [PlayerA, "配備エリア"],
                    })]: [
                      {
                        id: "a1",
                        protoID: "179023_06C_CH_WT067C_white",
                        faceDown: true,
                        ownerID: PlayerA,
                        tap: true,
                      },
                      {
                        id: "a2",
                        protoID: "179016_04B_U_WT075C_white",
                        faceDown: true,
                        ownerID: PlayerA,
                        tap: true,
                      },
                    ],
                    [getBaSyouID({
                      id: "AbsoluteBaSyou",
                      value: [PlayerA, "Gゾーン"],
                    })]: [
                      {
                        id: "g1",
                        protoID: "179019_01A_C_WT010C_white",
                        faceDown: true,
                        ownerID: PlayerA,
                        tap: false,
                      },
                      {
                        id: "g2",
                        protoID: "179030_11E_G_RD021N_red",
                        faceDown: true,
                        ownerID: PlayerA,
                        tap: false,
                      },
                      {
                        id: "g3",
                        protoID: "179028_10D_C_BL070N_blue",
                        faceDown: true,
                        ownerID: PlayerA,
                        tap: false,
                      },
                      {
                        id: "g4",
                        protoID: "179028_10D_C_BL070N_blue",
                        faceDown: true,
                        ownerID: PlayerA,
                        tap: false,
                      },
                    ],
                    [getBaSyouID({
                      id: "AbsoluteBaSyou",
                      value: [PlayerB, "戦闘エリア（左）"],
                    })]: [
                      {
                        id: "b1",
                        protoID: "179019_01A_C_WT010C_white",
                        faceDown: true,
                        ownerID: PlayerB,
                        tap: false,
                      },
                    ],
                  },
                },
                setGroupLink: { a1: "a2" },
                activePlayerID: PlayerA,
                timing: [
                  23,
                  ["戦闘フェイズ", "ダメージ判定ステップ", "ステップ開始"],
                ],
              },
            };
          }
          if (false) {
            ctx = {
              ...ctx,
              gameState: {
                ...ctx.gameState,
                table: {
                  ...ctx.gameState.table,
                  cardStack: {
                    ...ctx.gameState.table.cardStack,
                    [getBaSyouID({
                      id: "AbsoluteBaSyou",
                      value: [PlayerA, "本国"],
                    })]: [
                      {
                        id: "a_1",
                        protoID: "179025_07D_C_WT060U_white",
                        faceDown: true,
                        ownerID: PlayerA,
                        tap: false,
                      },
                    ],
                    [getBaSyouID({
                      id: "AbsoluteBaSyou",
                      value: [PlayerA, "手札"],
                    })]: [
                      {
                        id: "h1",
                        protoID: "179025_07D_C_WT060U_white",
                        faceDown: true,
                        ownerID: PlayerA,
                        tap: false,
                      },
                    ],
                    [getBaSyouID({
                      id: "AbsoluteBaSyou",
                      value: [PlayerA, "配備エリア"],
                    })]: [
                      {
                        id: "aset1",
                        protoID: "179901_CG_CH_WT002P_white",
                        faceDown: true,
                        ownerID: PlayerA,
                        tap: false,
                      },
                    ],
                    [getBaSyouID({
                      id: "AbsoluteBaSyou",
                      value: [PlayerA, "戦闘エリア（左）"],
                    })]: [
                      {
                        id: "a1",
                        protoID: "179016_04B_U_WT075C_white",
                        faceDown: true,
                        ownerID: PlayerA,
                        tap: false,
                      },
                      {
                        id: "a2",
                        protoID: "179001_01A_CH_WT007R_white",
                        faceDown: true,
                        ownerID: PlayerA,
                        tap: false,
                      },
                    ],
                    [getBaSyouID({
                      id: "AbsoluteBaSyou",
                      value: [PlayerB, "本国"],
                    })]: [
                      {
                        id: "b_1",
                        protoID: "179025_07D_C_WT060U_white",
                        faceDown: true,
                        ownerID: PlayerB,
                        tap: false,
                      },
                    ],
                    [getBaSyouID({
                      id: "AbsoluteBaSyou",
                      value: [PlayerB, "戦闘エリア（左）"],
                    })]: [
                      {
                        id: "b1",
                        protoID: "179016_04B_U_WT075C_white",
                        faceDown: true,
                        ownerID: PlayerB,
                        tap: false,
                      },
                      {
                        id: "b2",
                        protoID: "179016_04B_U_WT075C_white",
                        faceDown: true,
                        ownerID: PlayerB,
                        tap: false,
                      },
                    ],
                    [getBaSyouID({
                      id: "AbsoluteBaSyou",
                      value: [PlayerA, "Gゾーン"],
                    })]: [
                      {
                        id: "g1",
                        protoID: "179019_01A_C_WT010C_white",
                        faceDown: true,
                        ownerID: PlayerA,
                        tap: false,
                      },
                      {
                        id: "g2",
                        protoID: "179030_11E_G_RD021N_red",
                        faceDown: true,
                        ownerID: PlayerA,
                        tap: false,
                      },
                      {
                        id: "g3",
                        protoID: "179030_11E_G_RD021N_red",
                        faceDown: true,
                        ownerID: PlayerA,
                        tap: false,
                      },
                      {
                        id: "g4",
                        protoID: "179030_11E_G_RD021N_red",
                        faceDown: true,
                        ownerID: PlayerA,
                        tap: false,
                      },
                      {
                        id: "g5",
                        protoID: "179030_11E_G_RD021N_red",
                        faceDown: true,
                        ownerID: PlayerA,
                        tap: false,
                      },
                    ],
                  },
                },
                activePlayerID: PlayerA,
                setGroupLink: { a2: "a1" },
                timing: [
                  22,
                  ["戦闘フェイズ", "ダメージ判定ステップ", "ステップ開始"],
                ],
                flowMemory: {
                  ...ctx.gameState.flowMemory,
                  state: "playing",
                },
              },
            };
          }
          if (true) {
            const deck = [
              "179001_01A_CH_WT007R_white",
              "179003_01A_U_BK008U_black",
              "179004_01A_CH_WT009R_white",
              "179004_01A_CH_WT010C_white",
              "179007_02A_O_BK005C_black",
              "179007_02A_U_WT027U_white",
              "179008_02A_U_WT034U_white",
              "179014_03B_CH_WT027R_white",
              "179015_04B_U_WT067C_white",
              "179016_04B_U_RD083C_red",
              "179016_04B_U_WT074C_white",
              "179016_04B_U_WT075C_white",
              "179019_01A_C_WT010C_white",
              "179022_06C_CH_WT057R_white",
              "179022_06C_U_WT113R_white",
              "179023_06C_CH_WT067C_white",
              "179023_06C_G_BL021C_blue",
              "179024_03B_U_WT057U_white",
              "179025_07D_C_WT060U_white",
              "179025_07D_CH_WT075C_white",
              "179025_07D_O_GN019C_green",
              "179025_07D_U_RD156R_red",
              "179025_07D_U_RD158C_red",
              "179028_10D_C_BL070N_blue",
              "179029_05C_O_BK014C_black",
              "179029_B3C_CH_WT102R_white",
              "179029_B3C_CH_WT103N_white",
              "179030_11E_C_BL076S_blue",
              "179030_11E_G_RD021N_red",
              "179030_11E_O_BK012N_black",
              "179030_11E_O_GN023N_green",
              "179030_11E_U_BL208S_blue",
              "179030_11E_U_BL210N_blue",
              "179030_11E_U_BL215R_blue",
              "179901_00_U_RD010P_red",
              "179901_CG_C_WT001P_white",
              "179901_CG_CH_WT002P_white",
            ];
            const gDeck = [
              "179023_06C_G_BL021C_blue",
              "179030_11E_G_RD021N_red",
              "179901_CG_C_WT001P_white",
              "179901_CG_C_WT001P_white",
              "179901_CG_C_WT001P_white",
            ];
            let table = ctx.gameState.table;
            table = createCard(
              table,
              PlayerA,
              getBaSyouID({ id: "AbsoluteBaSyou", value: [PlayerA, "本国"] }),
              deck.slice(0, 10)
            );
            table = createCard(
              table,
              PlayerA,
              getBaSyouID({ id: "AbsoluteBaSyou", value: [PlayerA, "手札"] }),
              deck.slice(6, 12)
            );
            table = createCard(
              table,
              PlayerA,
              getBaSyouID({
                id: "AbsoluteBaSyou",
                value: [PlayerA, "Gゾーン"],
              }),
              gDeck
            );
            table = createCard(
              table,
              PlayerB,
              getBaSyouID({ id: "AbsoluteBaSyou", value: [PlayerB, "本国"] }),
              deck.slice(10, 20)
            );
            table = createCard(
              table,
              PlayerB,
              getBaSyouID({ id: "AbsoluteBaSyou", value: [PlayerB, "手札"] }),
              deck.slice(0, 6)
            );
            table = createCard(
              table,
              PlayerB,
              getBaSyouID({
                id: "AbsoluteBaSyou",
                value: [PlayerB, "Gゾーン"],
              }),
              gDeck
            );
            ctx = {
              ...ctx,
              gameState: {
                ...ctx.gameState,
                table,
                timing: TIMING_CHART[9],
                flowMemory: {
                  ...ctx.gameState.flowMemory,
                  state: "playing",
                },
              },
            };
          }
          ctx = {
            ...ctx,
            versionID: viewModel.model.versionID,
          };
          ctx = initState(ctx);
          ctx = updateCommand(ctx);
          firebase.sync(ctx);
          return DEFAULT_VIEW_MODEL;
        }
        case "OnClickFlowConfirm": {
          const model = applyFlow(viewModel.model, evt.clientID, evt.flow);
          const isDirty =
            JSON.stringify(viewModel.model) != JSON.stringify(model);
          if (isDirty == false) {
            log2(
              "OnViewModel",
              "OnClickFlowConfirm. but isDirty == false. return",
              model
            );
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
