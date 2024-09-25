
export class GameError extends Error {
    constructor(message: any) {
        super(message);
        this.name = "GameError";
    }
}

export class TargetMissingError extends GameError {
    constructor(message: any) {
        super(message);
        this.name = "TargetMissingError";
    }
}