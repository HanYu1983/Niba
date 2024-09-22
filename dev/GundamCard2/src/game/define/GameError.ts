export class TargetMissingError extends Error {
    constructor(message:any) {
        super(message);
        this.name = "GameError";
    }
}