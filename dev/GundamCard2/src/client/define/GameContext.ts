import { createGameStateWithFlowMemory, GameStateWithFlowMemory } from "../../game/gameStateWithFlowMemory/GameStateWithFlowMemory";

export type GameContext = {
    varsPool: { [key: string]: any };
    gameState: GameStateWithFlowMemory;
    versionID: number;
};

export function createGameContext():GameContext{
    return {
        varsPool: {},
        gameState: createGameStateWithFlowMemory(),
        versionID: 0,
    }
}