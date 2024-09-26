
// 只給createEffectTips補捉
export class GameError extends Error {
    constructor(message: any) {
        super(message);
        this.name = "GameError";
    }
}

// 主程式只補捉這個
export class TargetMissingError extends Error {
    constructor(message: any) {
        super(message);
        this.name = "TargetMissingError";
    }
}