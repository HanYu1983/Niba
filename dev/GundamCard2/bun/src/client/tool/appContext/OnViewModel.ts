import { AbsoluteBaSyouFn } from "../../../game/define/BaSyou";
import { PlayerA, PlayerB } from "../../../game/define/PlayerID";
import { Phase, PhaseFn } from "../../../game/define/Timing";
import { createCardWithProtoIds } from "../../../game/gameState/CardTableComponent";
import { GameState } from "../../../game/gameState/GameState";
import { getPhase } from "../../../game/gameState/PhaseComponent";
import { applyFlow } from "../../../game/gameStateWithFlowMemory/applyFlow";
import { GameStateWithFlowMemory, initState } from "../../../game/gameStateWithFlowMemory/GameStateWithFlowMemory";
import { updateCommand } from "../../../game/gameState/updateCommand";
import { loadPrototype } from "../../../script";
import { logCategory } from "../../../tool/logger";
import { createGameContext, GameContext } from "../../define/GameContext";
import { OnEvent, OnError } from "./eventCenter";
import * as rxjs from "rxjs"
import { TableFns } from "../../../tool/table";
import { queryFlow } from "../../../game/gameStateWithFlowMemory/queryFlow";
import { shuffleItems } from "../../../game/gameState/ItemTableComponent";

export type Selection = string[];

export type ViewModel = {
  model: GameContext;
  cardSelection: Selection;
  cardPositionSelection: Selection;
  localMemory: {
    clientId: string | null;
    timing: Phase;
    lastPassPhase: boolean;
  };
};

export const DEFAULT_VIEW_MODEL: ViewModel = {
  model: createGameContext(),
  cardSelection: [],
  cardPositionSelection: [],
  localMemory: {
    clientId: null,
    timing: PhaseFn.getFirst(),
    lastPassPhase: false,
  },
};

const TMP_DECK = ["179015_04B_O_BK010C_black", "179015_04B_O_BK010C_black", "179015_04B_U_BK058R_black", "179015_04B_U_BK058R_black", "179015_04B_U_BK059C_black", "179015_04B_U_BK059C_black", "179015_04B_U_BK061C_black", "179015_04B_U_BK061C_black", "179016_04B_U_BK066C_black", "179016_04B_U_BK066C_black", "179019_02A_C_BK015S_black", "179019_02A_C_BK015S_black", "179020_05C_U_BK100U_black", "179020_05C_U_BK100U_black", "179023_06C_C_BK048R_black", "179023_06C_C_BK048R_black", "179023_06C_C_BK049U_black", "179023_06C_C_BK049U_black", "179024_04B_C_BK027U_black", "179024_04B_C_BK027U_black", "179024_04B_U_BK060C_black", "179024_04B_U_BK060C_black", "179024_04B_U_BK067C_black", "179024_04B_U_BK067C_black", "179024_B2B_C_BK054C_black", "179024_B2B_C_BK054C_black", "179024_B2B_U_BK128S_black_02", "179024_B2B_U_BK128S_black_02", "179024_B2B_U_BK129R_black", "179024_B2B_U_BK129R_black", "179027_09D_C_BK063R_black", "179027_09D_C_BK063R_black", "179027_09D_O_BK010N_black", "179027_09D_O_BK010N_black", "179027_09D_U_BK163S_black", "179027_09D_U_BK163S_black", "179027_09D_U_BK163S_black", "179029_06C_C_BK045U_black", "179029_06C_C_BK045U_black", "179029_B3C_C_BK071N_black", "179029_B3C_C_BK071N_black", "179029_B3C_U_BK184N_black", "179029_B3C_U_BK184N_black", "179029_B3C_U_BK184N_black", "179029_B3C_U_BK185N_black", "179029_B3C_U_BK185N_black", "179030_11E_U_BK194S_2_black", "179030_11E_U_BK194S_2_black", "179030_11E_U_BK194S_2_black", "179901_B2B_C_BK005P_black"]
const TMP_DECK2 = ["179001_01A_CH_WT007R_white","179004_01A_CH_WT009R_white","179004_01A_CH_WT010C_white","179007_02A_U_WT027U_white","179007_02A_U_WT027U_white","179008_02A_U_WT034U_white","179008_02A_U_WT034U_white","179008_02A_U_WT034U_white","179014_03B_CH_WT027R_white","179015_04B_U_WT067C_white","179015_04B_U_WT067C_white","179015_04B_U_WT067C_white","179016_04B_U_WT074C_white","179016_04B_U_WT074C_white","179016_04B_U_WT074C_white","179016_04B_U_WT075C_white","179016_04B_U_WT075C_white","179016_04B_U_WT075C_white","179019_01A_C_WT010C_white","179019_01A_C_WT010C_white","179019_02A_U_WT028R_white","179019_02A_U_WT028R_white","179022_06C_CH_WT057R_white","179022_06C_CH_WT057R_white","179022_06C_CH_WT057R_white","179022_06C_U_WT113R_white","179022_06C_U_WT113R_white","179022_06C_U_WT113R_white","179023_06C_CH_WT067C_white","179024_03B_U_WT057U_white","179024_03B_U_WT057U_white","179025_07D_C_WT060U_white","179025_07D_CH_WT075C_white","179025_07D_CH_WT075C_white","179025_07D_CH_WT075C_white","179027_09D_C_WT067R_white","179027_09D_C_WT067R_white","179029_B3C_CH_WT102R_white","179029_B3C_CH_WT103N_white","179029_B3C_U_WT196R_white","179030_11E_C_WT077S_white","179030_11E_C_WT077S_white","179030_11E_C_WT077S_white","179030_11E_CH_WT108N_white","179901_00_C_WT003P_white","179901_00_C_WT003P_white","179901_00_C_WT003P_white","179901_CG_C_WT001P_white","179901_CG_C_WT001P_white","179901_CG_CH_WT002P_white"]

export const OnViewModel = OnEvent.pipe(
  rxjs.scan((viewModel, evt): ViewModel => {
    logCategory("OnViewModel", "evt", evt);
    try {
      switch (evt.id) {
        case "OnClickNewGame": {
          let ctx = createGameContext();
          ctx = {
            ...ctx,
            versionID: viewModel.model.versionID,
          };
          Promise.all(TMP_DECK.concat(TMP_DECK2).map(loadPrototype))
          ctx.gameState = initState(ctx.gameState, TMP_DECK, TMP_DECK);
          // ctx.gameState = initState(ctx.gameState, TMP_DECK.slice(12), TMP_DECK.slice(12));
          // ctx.gameState = createCardWithProtoIds(ctx.gameState, AbsoluteBaSyouFn.of(PlayerA, "手札"), TMP_DECK.slice(0, 6)) as GameStateWithFlowMemory
          // ctx.gameState = createCardWithProtoIds(ctx.gameState, AbsoluteBaSyouFn.of(PlayerA, "Gゾーン"), TMP_DECK.slice(6, 12)) as GameStateWithFlowMemory
          // ctx.gameState = createCardWithProtoIds(ctx.gameState, AbsoluteBaSyouFn.of(PlayerB, "手札"), TMP_DECK.slice(0, 6)) as GameStateWithFlowMemory
          // ctx.gameState = createCardWithProtoIds(ctx.gameState, AbsoluteBaSyouFn.of(PlayerB, "Gゾーン"), TMP_DECK.slice(6, 12)) as GameStateWithFlowMemory
          // ctx.gameState = {
          //   ...ctx.gameState,
          //   phase: ["配備フェイズ", "フリータイミング"],
          //   flowMemory: {
          //     ...ctx.gameState.flowMemory,
          //     state: "playing",
          //   }
          // }
          // ctx.gameState = updateCommand(ctx.gameState) as GameStateWithFlowMemory;
          return { ...DEFAULT_VIEW_MODEL, model: ctx };
        }
        case "OnClickFlowConfirm": {
          const gameState = applyFlow(viewModel.model.gameState, evt.clientId, evt.flow);
          //TableFns.assertDup(gameState.table)
          return {
            ...viewModel,
            model: {
              ...viewModel.model,
              gameState: gameState,
            },
            cardSelection: [],
            localMemory: {
              clientId: evt.clientId,
              timing: getPhase(gameState),
              lastPassPhase: gameState.flowMemory.hasPlayerPassPhase[evt.clientId] || false,
            },
          };
        }
        case "OnClickRequireTargetConfirm": {
          return { ...viewModel, cardSelection: [] };
        }
        case "OnClickChangeClient": {
          return viewModel;
        }
        case "OnModelFromFirebase":
          return viewModel;
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
