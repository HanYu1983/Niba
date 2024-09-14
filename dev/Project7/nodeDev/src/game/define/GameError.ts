export class TargetMissingError extends Error {
    constructor(message) {
        super(message);
        this.name = "GameError";
    }
}