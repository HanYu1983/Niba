import { GameState } from "../gameState/GameState";


export type Message = {
    id: "MessageCustom";
    value: string;
};

export type FlowMemoryComponent = {
    state: "prepareDeck" | "whoFirst" | "draw6AndConfirm" | "playing";
    hasTriggerEvent: boolean;
    hasPlayerPassPhase: { [key: string]: boolean };
    hasPlayerPassCut: { [key: string]: boolean };
    hasPlayerPassPayCost: { [key: string]: boolean };
    shouldTriggerStackEffectFinishedEvent: boolean;
    msgs: Message[];
}

export const DEFAULT_FLOW_MEMORY: FlowMemoryComponent = {
    state: "prepareDeck",
    hasTriggerEvent: false,
    hasPlayerPassPhase: {},
    hasPlayerPassCut: {},
    hasPlayerPassPayCost: {},
    shouldTriggerStackEffectFinishedEvent: false,
    msgs: [],
}

export type HasFlowMemoryComponent = {
    flowMemory: FlowMemoryComponent
}

export type GameStateWithFlowMemory = {
    activeEffectID: string | null;
} & GameState & HasFlowMemoryComponent;