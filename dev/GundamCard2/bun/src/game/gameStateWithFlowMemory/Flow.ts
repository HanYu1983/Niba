import { CommandEffectTip } from "../define/CommandEffectTip";
import { Effect } from "../define/Effect";
import { GameEvent } from "../define/GameEvent";
import { Tip } from "../define/Tip";

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
    description?: string;
    block: Effect;
};
type FlowWaitPlayer = {
    id: "FlowWaitPlayer";
    description?: string;
};
type FlowSetActiveEffectID = {
    id: "FlowSetActiveEffectID";
    effectID: string;
    tips: Effect[];
    description?: string;
};
type FlowCancelActiveEffectID = {
    id: "FlowCancelActiveEffectID";
    description?: string;
};
type FlowSetActiveLogicID = {
    id: "FlowSetActiveLogicID";
    logicID: number;
    logicSubID: number;
    tips: CommandEffectTip[],
    description?: string;
};
type FlowCancelActiveLogicID = {
    id: "FlowCancelActiveLogicID";
    description?: string;
};
type FlowDoEffect = {
    id: "FlowDoEffect";
    effectID: string;
    logicID: number,
    logicSubID: number,
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
type FlowHandleStackEffectFinished = {
    id: "FlowHandleStackEffectFinished";
    description?: string;
};
type FlowSetTipSelection = {
    id: "FlowSetTipSelection";
    effectID: string;
    conditionKey: string;
    tip: Tip;
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

export type Flow =
    | FlowAddBlock
    | FlowTriggerTextEvent
    | FlowUpdateCommand
    | FlowNextTiming
    | FlowWaitPlayer
    | FlowSetActiveEffectID
    | FlowCancelActiveEffectID
    | FlowSetActiveLogicID
    | FlowCancelActiveLogicID
    | FlowDoEffect
    | FlowObserveEffect
    | FlowDeleteImmediateEffect
    | FlowPassPhase
    | FlowCancelPassPhase
    | FlowPassCut
    | FlowCancelPassCut
    | FlowHandleStackEffectFinished
    | FlowSetTipSelection
    | FlowPassPayCost
    | FlowMakeDestroyOrder;