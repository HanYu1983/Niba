import { createBridge } from "../bridge/createBridge";
import { CardTextFn, ConditionFn } from "../define/CardText";
import { Effect } from "../define/Effect";
import { TargetMissingError } from "../define/GameError";
import { PlayerA, PlayerB } from "../define/PlayerID";
import { TipFn } from "../define/Tip";
import { mapCardsWithBasyou } from "../gameState/CardTableComponent";
import { createGameState, GameState } from "../gameState/GameState";
import { getPlayEffects } from "../gameState/getPlayEffects";
import { setCommandEffects } from "./effect";

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

export type CommandEffectTip = {
    id: string,
    effect: Effect,
    logicID: number,
    logicSubID: number,
    errors: (TargetMissingError | null)[]
}

export type GameStateWithFlowMemory = {
    // 專門給破壞效果用的用的堆疊
    // 傷害判定結束時，將所有破壞產生的廢棄效果丟到這，重設「決定解決順序」的旗標為真
    // 如果這個堆疊一有值時並「決定解決順序」為真時，就立刻讓主動玩家決定解決順序，決定完後，將旗標設為假
    // 旗標為假時，才能才能開放給玩家切入
    // 這個堆疊解決完後，才回復到本來的堆疊的解決程序
    destroyEffect: Effect[];
    // 指令效果
    commandEffectTips: CommandEffectTip[];
    stackEffectMemory: Effect[];
    activeEffectID: string | null;
} & GameState & HasFlowMemoryComponent;

export function createGameStateWithFlowMemory(): GameStateWithFlowMemory {
    return {
        ...createGameState(),
        stackEffectMemory: [],
        activeEffectID: null,
        flowMemory: DEFAULT_FLOW_MEMORY,
        commandEffectTips: [],
        destroyEffect: [],
    }
}

export function initState(ctx: GameStateWithFlowMemory): GameStateWithFlowMemory {
    ctx = initCardFace(ctx);
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
