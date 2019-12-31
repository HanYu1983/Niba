import IModel from "./IModel";

export default interface IViewController {
    setModel(model: IModel): void;
    onPlayerTurnStart(callback: () => void): void;
    onEnemyTurnStart(ai: string, callback: () => void): void;
    onStateChange(state: string, data: any): void;
}