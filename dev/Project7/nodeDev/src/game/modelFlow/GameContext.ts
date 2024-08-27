import { GameStateWithFlowMemory, DEFAULT_FLOW_MEMORY } from "../gameStateWithFlowMemory/GameStateWithFlowMemory";
import { DEFAULT_GAME_STATE } from "../model/GameState";

export type GameContext = {
    gameState: GameStateWithFlowMemory;
    versionID: number;
};

export const DEFAULT_GAME_CONTEXT: GameContext = {
    gameState: {
        ...DEFAULT_GAME_STATE,
        activeEffectID: null,
        flowMemory: DEFAULT_FLOW_MEMORY
    },
    versionID: 0,
};