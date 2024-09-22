import { AbsoluteBaSyouFn } from "../../../game/define/BaSyou";
import { PlayerA } from "../../../game/define/PlayerID";
import { Phase, PhaseFn } from "../../../game/define/Timing";
import { createCardWithProtoIds } from "../../../game/gameState/CardTableComponent";
import { GameState } from "../../../game/gameState/GameState";
import { getPhase } from "../../../game/gameState/PhaseComponent";
import { applyFlow } from "../../../game/gameStateWithFlowMemory/applyFlow";
import { GameStateWithFlowMemory, initState } from "../../../game/gameStateWithFlowMemory/GameStateWithFlowMemory";
import { updateCommand } from "../../../game/gameStateWithFlowMemory/updateCommand";
import { loadPrototype } from "../../../script";
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

const TMP_DECK = ["179015_04B_O_BK010C_black", "179015_04B_O_BK010C_black", "179015_04B_U_BK058R_black", "179015_04B_U_BK058R_black", "179015_04B_U_BK059C_black", "179015_04B_U_BK059C_black", "179015_04B_U_BK061C_black", "179015_04B_U_BK061C_black", "179016_04B_U_BK066C_black", "179016_04B_U_BK066C_black", "179019_02A_C_BK015S_black", "179019_02A_C_BK015S_black", "179020_05C_U_BK100U_black", "179020_05C_U_BK100U_black", "179023_06C_C_BK048R_black", "179023_06C_C_BK048R_black", "179023_06C_C_BK049U_black", "179023_06C_C_BK049U_black", "179024_04B_C_BK027U_black", "179024_04B_C_BK027U_black", "179024_04B_U_BK060C_black", "179024_04B_U_BK060C_black", "179024_04B_U_BK067C_black", "179024_04B_U_BK067C_black", "179024_B2B_C_BK054C_black", "179024_B2B_C_BK054C_black", "179024_B2B_U_BK128S_black_02", "179024_B2B_U_BK128S_black_02", "179024_B2B_U_BK129R_black", "179024_B2B_U_BK129R_black", "179027_09D_C_BK063R_black", "179027_09D_C_BK063R_black", "179027_09D_O_BK010N_black", "179027_09D_O_BK010N_black", "179027_09D_U_BK163S_black", "179027_09D_U_BK163S_black", "179027_09D_U_BK163S_black", "179029_06C_C_BK045U_black", "179029_06C_C_BK045U_black", "179029_B3C_C_BK071N_black", "179029_B3C_C_BK071N_black", "179029_B3C_U_BK184N_black", "179029_B3C_U_BK184N_black", "179029_B3C_U_BK184N_black", "179029_B3C_U_BK185N_black", "179029_B3C_U_BK185N_black", "179030_11E_U_BK194S_2_black", "179030_11E_U_BK194S_2_black", "179030_11E_U_BK194S_2_black", "179901_B2B_C_BK005P_black"]

export const OnViewModel = OnEvent.pipe(
  rxjs.scan((viewModel, evt): ViewModel => {
    log("OnViewModel", "evt", evt);
    try {
      switch (evt.id) {
        case "OnClickNewGame": {
          let ctx = createGameContext();
          ctx = {
            ...ctx,
            versionID: viewModel.model.versionID,
          };
          Promise.all(TMP_DECK.map(loadPrototype))
          ctx.gameState = initState(ctx.gameState, TMP_DECK, TMP_DECK);
          ctx.gameState = createCardWithProtoIds(ctx.gameState, AbsoluteBaSyouFn.of(PlayerA, "Gゾーン"), TMP_DECK.slice(0, 6)) as GameStateWithFlowMemory
          ctx.gameState = updateCommand(ctx.gameState);
          return { ...DEFAULT_VIEW_MODEL, model: ctx };
        }
        case "OnClickFlowConfirm": {
          const gameState = applyFlow(viewModel.model.gameState, evt.clientID, evt.flow);
          return {
            ...viewModel,
            model: {
              ...viewModel.model,
              gameState: gameState,
            },
            localMemory: {
              clientID: evt.clientID,
              timing: getPhase(gameState),
              lastPassPhase: gameState.flowMemory.hasPlayerPassPhase[evt.clientID] || false,
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
