

export type GameErrorInfo = {
    flags: "出G上限"[]
}

export class GameError extends Error {
    info: GameErrorInfo
    constructor(message: any, info?: GameErrorInfo) {
        super(message);
        this.name = "GameError";
        this.info = info || {
            flags: []
        }
    }
}


// 只給createEffectTips補捉
// Condition中只能用這個
export class TipError extends GameError {
    constructor(message: any, info?:GameErrorInfo) {
        super(message, info);
        this.name = "TipError";
    }
}

// 主程式只補捉這個
export class TargetMissingError extends GameError {
    constructor(message: any, info?:GameErrorInfo) {
        super(message, info);
        this.name = "TargetMissingError";
    }
}