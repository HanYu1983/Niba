
export class GameError extends Error {
    constructor(message: any) {
        super(message);
        this.name = "GameError";
    }
}

export class TargetMissingError extends Error {
    constructor(message: any) {
        super(message);
        this.name = "TargetMissingError";
    }
}