import { createBridge } from "../bridge/createBridge";
import { AbsoluteBaSyouFn } from "../define/BaSyou";
import { CardTextFn, Condition, ConditionFn } from "../define/CardText";
import { CommandEffectTip } from "../define/CommandEffectTip";
import { Effect, EffectFn } from "../define/Effect";
import { TargetMissingError } from "../define/GameError";
import { PlayerA, PlayerB } from "../define/PlayerID";
import { Tip, TipFn } from "../define/Tip";
import { setActivePlayerID } from "../gameState/ActivePlayerComponent";
import { createCardWithProtoIds, mapCardsWithBasyou } from "../gameState/CardTableComponent";
import { createGameState, GameState } from "../gameState/GameState";
import { getPlayEffects } from "../gameState/getPlayEffects";
import { setCommandEffectTips } from "./effect";

export type FlowMemoryComponent = {
    state: "prepareDeck" | "whoFirst" | "draw6AndConfirm" | "playing";
    hasTriggerEvent: boolean;
    hasPlayerPassPhase: { [key: string]: boolean };
    hasPlayerPassCut: { [key: string]: boolean };
    hasPlayerPassPayCost: { [key: string]: boolean };
    shouldTriggerStackEffectFinishedEvent: boolean;
    activeEffectID: string | null;
    activeLogicID: number | null;
    activeLogicSubID: number | null;
}

export const DEFAULT_FLOW_MEMORY: FlowMemoryComponent = {
    state: "prepareDeck",
    hasTriggerEvent: false,
    hasPlayerPassPhase: {},
    hasPlayerPassCut: {},
    hasPlayerPassPayCost: {},
    shouldTriggerStackEffectFinishedEvent: false,
    activeEffectID: null,
    activeLogicID: null,
    activeLogicSubID: null,
}

export type HasFlowMemoryComponent = {
    flowMemory: FlowMemoryComponent
}

export type GameStateWithFlowMemory = {
    // 指令效果
    commandEffectTips: CommandEffectTip[];
    commandEffects: Effect[],
    stackEffectMemory: Effect[];
} & GameState & HasFlowMemoryComponent;

export function createGameStateWithFlowMemory(): GameStateWithFlowMemory {
    return {
        ...createGameState(),
        stackEffectMemory: [],
        flowMemory: DEFAULT_FLOW_MEMORY,
        commandEffectTips: [],
        commandEffects: [],
    }
}

export function initState(ctx: GameStateWithFlowMemory, deckA: string[], deckB: string[]): GameStateWithFlowMemory {
    ctx = createCardWithProtoIds(ctx, AbsoluteBaSyouFn.of(PlayerA, "本国"), deckA) as GameStateWithFlowMemory
    ctx = createCardWithProtoIds(ctx, AbsoluteBaSyouFn.of(PlayerB, "本国"), deckB) as GameStateWithFlowMemory
    ctx = initCardFace(ctx);
    ctx = setActivePlayerID(ctx, PlayerA) as GameStateWithFlowMemory
    return ctx;
}

export function initCardFace(ctx: GameStateWithFlowMemory): GameStateWithFlowMemory {
    return mapCardsWithBasyou(ctx, (baSyou, card) => {
        switch (baSyou.value[1]) {
            case "本国":
            case "捨て山":
            case "手札":
                return {
                    ...card,
                    isFaceDown: true,
                };
            default:
                return {
                    ...card,
                    isFaceDown: false,
                };
        }
    }) as GameStateWithFlowMemory;
}
