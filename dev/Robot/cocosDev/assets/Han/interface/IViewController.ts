import IModel from "./IModel";

export default interface IViewController {
    setModel(model: IModel): void;
    onPrepareForStart(callback: () => void): void;
    onPlayerTurnStart(callback: () => void): void;
    onEnemyTurnStart(ai: string, callback: () => void): void;
    onStateChange(state: string, data: any): void;
}