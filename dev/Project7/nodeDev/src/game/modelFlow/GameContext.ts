import { GameStateWithFlowMemory, DEFAULT_GAME_STATE_WITH_FLOW_MEMORY } from "../gameStateWithFlowMemory/GameStateWithFlowMemory";

export type GameContext = {
    gameState: GameStateWithFlowMemory;
    versionID: number;
};

export const DEFAULT_GAME_CONTEXT: GameContext = {
    gameState: DEFAULT_GAME_STATE_WITH_FLOW_MEMORY,
    versionID: 0,
};