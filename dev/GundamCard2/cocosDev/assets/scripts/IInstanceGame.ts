interface IInstanceGame<T> {
    sync(game: IGame, relative: T): Promise<void>;
}

interface IModel {
    varsPool: Record<string, any>;
    gameState: IGameState;
    versionID: number;
}

interface IGameState {
    isGameState: boolean;
    cards: Record<string, ICard>;
    effects: Record<string, any>;
    table: ITable;
    chips: Record<string, any>;
    chipProtos: Record<string, any>;
    itemStates: Record<string, any>;
    phase: string[];
    playerStates: Record<string, any>;
    activePlayerID: string;
    immediateEffect: any[];
    stackEffect: any[];
    destroyEffect: any[];
    commandEffects: any[];
    commandEffectTips: any[];
    hasCheck: boolean;
    battleSnapshot: Record<string, any>;
    coins: Record<string, any>;
    coinId2cardId: Record<string, any>;
    globalEffectPool: Record<string, any>;
    messageTopId: number;
    messages: IMessage[];
    messagesCurrentEffect: any;
    messagesIsPlayerRead: Record<string, boolean>;
    turn: number;
    setGroup: ISetGroup;
    stackEffectMemory: any[];
    flowMemory: IFlowMemory;
}

interface ITable {
    cardStack: Record<string, string[]>;
}

interface ICard {
    id: string;
    protoID: string;
    ownerID: string;
    isFaceDown: boolean;
}

interface IMessage {
    id: number;
    description: string;
}

interface ISetGroup {
    itemGroupParent: Record<string, any>;
    itemGroupChildren: Record<string, any>;
}

interface IFlowMemory {
    state: string;
    hasTriggerEvent: boolean;
    hasPlayerPassPhase: Record<string, boolean>;
    hasPlayerPassCut: Record<string, boolean>;
    hasPlayerPassPayCost: Record<string, boolean>;
    shouldTriggerStackEffectFinishedEvent: boolean;
    activeEffectID: string | null;
    activeLogicID: string | null;
    activeLogicSubID: string | null;
}

interface IPlayerCommand {
    id: string;
    event?: Record<string, any>;
    description?: string;
}

interface ILocalMemory {
    clientId: string | null;
    timing: string[];
    lastPassPhase: boolean;
    globalEffects: any[];
}

interface IGame {
    model: IModel;
    playerCommands: Record<string, IPlayerCommand[]>;
    cardSelection: any[];
    cardPositionSelection: any[];
    localMemory: ILocalMemory;
    extra: any;
}