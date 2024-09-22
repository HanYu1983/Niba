import { createBridge } from "../bridge/createBridge";
import { AbsoluteBaSyouFn } from "../define/BaSyou";
import { CardTextFn, Condition, ConditionFn } from "../define/CardText";
import { Effect } from "../define/Effect";
import { TargetMissingError } from "../define/GameError";
import { PlayerA, PlayerB } from "../define/PlayerID";
import { Tip, TipFn } from "../define/Tip";
import { setActivePlayerID } from "../gameState/ActivePlayerComponent";
import { createCardWithProtoIds, mapCardsWithBasyou } from "../gameState/CardTableComponent";
import { createGameState, GameState } from "../gameState/GameState";
import { getPlayEffects } from "../gameState/getPlayEffects";
import { setCommandEffectTips } from "./effect";

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

export type TipOrErrors = {
    conditionKey: string,
    tip: Tip | null,
    errors: any[]
}

export type CommandEffectTip = {
    id: string,
    effect: Effect,
    logicID: number,
    logicSubID: number,
    tipOrErrors: TipOrErrors[]
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
    commandEffects: Effect[],
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
        commandEffects: [],
        destroyEffect: [],
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
