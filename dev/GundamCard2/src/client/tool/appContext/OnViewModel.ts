import { Phase, PhaseFn } from "../../../game/define/Timing";
import { getPhase } from "../../../game/gameState/PhaseComponent";
import { applyFlow } from "../../../game/gameStateWithFlowMemory/applyFlow";
import { initState } from "../../../game/gameStateWithFlowMemory/GameStateWithFlowMemory";
import { updateCommand } from "../../../game/gameStateWithFlowMemory/updateCommand";
import { log } from "../../../tool/logger";
import { createGameContext, GameContext } from "../../define/GameContext";
import { OnEvent, OnError } from "./eventCenter";
import * as rxjs from "rxjs"

export type Selection = string[];

export type ViewModel = {
  model: GameContext;
  cardSelection: Selection;
  cardPositionSelection: Selection;
  localMemory: {
    clientID: string | null;
    timing: Phase;
    lastPassPhase: boolean;
  };
};

export const DEFAULT_VIEW_MODEL: ViewModel = {
  model: createGameContext(),
  cardSelection: [],
  cardPositionSelection: [],
  localMemory: {
    clientID: null,
    timing: PhaseFn.getFirst(),
    lastPassPhase: false,
  },
};

export const OnViewModel = OnEvent.pipe(
  rxjs.scan((viewModel, evt): ViewModel => {
    log("OnViewModel", "evt", evt);
    try {
      switch (evt.id) {
        case "OnClickNewGame": {
          let ctx = createGameContext();
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
            ctx = {
              ...ctx,
              gameState: {
                ...ctx.gameState,
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
          ctx.gameState = initState(ctx.gameState);
          ctx.gameState = updateCommand(ctx.gameState);
          return { ...DEFAULT_VIEW_MODEL, model: ctx };
        }
        case "OnClickFlowConfirm": {
          const model = applyFlow(viewModel.model.gameState, evt.clientID, evt.flow);
          const isDirty =
            JSON.stringify(viewModel.model) != JSON.stringify(model);
          if (isDirty == false) {
            log(
              "OnViewModel",
              "OnClickFlowConfirm. but isDirty == false. return",
              model
            );
            return viewModel;
          }
          return {
            ...viewModel,
            localMemory: {
              clientID: evt.clientID,
              timing: getPhase(model),
              lastPassPhase:
                model.flowMemory.hasPlayerPassPhase[evt.clientID] || false,
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
