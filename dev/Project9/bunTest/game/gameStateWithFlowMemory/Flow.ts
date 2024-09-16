import { Effect } from "../define/Effect";
import { GameEvent } from "../define/GameEvent";
import { CommandEffectTip } from "./GameStateWithFlowMemory";

type FlowUpdateCommand = {
    id: "FlowUpdateCommand";
    description?: string;
};
type FlowTriggerTextEvent = {
    id: "FlowTriggerTextEvent";
    event: GameEvent;
    description?: string;
};
type FlowNextTiming = {
    id: "FlowNextTiming";
    description?: string;
};
type FlowAddBlock = {
    id: "FlowAddBlock";
    responsePlayerID: string;
    description?: string;
    block: Effect;
};
type FlowWaitPlayer = {
    id: "FlowWaitPlayer";
    description?: string;
};
type FlowSetActiveEffectID = {
    id: "FlowSetActiveEffectID";
    effectID: string | null;
    tips: Effect[];
    description?: string;
};
type FlowCancelActiveEffectID = {
    id: "FlowCancelActiveEffectID";
    description?: string;
};
type FlowDoEffect = {
    id: "FlowDoEffect";
    effectID: string;
    logicID: number | null,
    logicSubID: number | null,
    description?: string;
};
type FlowObserveEffect = {
    id: "FlowObserveEffect";
    effectID: string;
    description?: string;
};
type FlowDeleteImmediateEffect = {
    id: "FlowDeleteImmediateEffect";
    effectID: string | null;
    description?: string;
    tips: Effect[];
};
type FlowPassPhase = {
    id: "FlowPassPhase";
    description?: string;
};
type FlowCancelPassPhase = {
    id: "FlowCancelPassPhase";
    description?: string;
};
type FlowPassCut = {
    id: "FlowPassCut";
    description?: string;
};
type FlowCancelPassCut = {
    id: "FlowCancelPassCut";
    description?: string;
};
type FlowHandleDamageStepRule = {
    id: "FlowHandleDamageStepRule";
    description?: string;
};
type FlowHandleReturnStepRule = {
    id: "FlowHandleReturnStepRule";
    description?: string;
};
type FlowHandleStackEffectFinished = {
    id: "FlowHandleStackEffectFinished";
    description?: string;
};
type FlowPassPayCost = {
    id: "FlowPassPayCost";
    effectID: string;
    description?: string;
};
type FlowMakeDestroyOrder = {
    id: "FlowMakeDestroyOrder";
    destroyEffect: Effect[];
    description?: string;
};

type FlowHandleRerollPhaseRule = {
    id: "FlowHandleRerollPhaseRule";
    description?: string;
};

export type Flow =
    | FlowAddBlock
    | FlowTriggerTextEvent
    | FlowUpdateCommand
    | FlowNextTiming
    | FlowWaitPlayer
    | FlowSetActiveEffectID
    | FlowCancelActiveEffectID
    | FlowDoEffect
    | FlowObserveEffect
    | FlowDeleteImmediateEffect
    | FlowPassPhase
    | FlowCancelPassPhase
    | FlowPassCut
    | FlowCancelPassCut
    | FlowHandleDamageStepRule
    | FlowHandleReturnStepRule
    | FlowHandleStackEffectFinished
    | FlowPassPayCost
    | FlowMakeDestroyOrder
    | FlowHandleRerollPhaseRule;