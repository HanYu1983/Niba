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
          const deckA = evt.deckA
          const deckB = evt.deckB
          ctx.gameState = initState(ctx.gameState, deckA, deckB);
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
