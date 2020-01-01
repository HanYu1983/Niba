import IUnit from "./IUnit";

export default interface IModel {
    pushState(state: string, save: any, callback?: () => void): void;
    popState(callback?: () => void): void;
    getLocalMap(cb: (args: number[][]) => void): void;
    getUnits(): IUnit[];
    getLocalUnits(cb: (args: IUnit[]) => void): void;
    getUnitsByRegion(cb: (args: IUnit[]) => void): void;
    getUnitNormalState(unitKey, cb: (info: { unit: IUnit, moveRange: number[][] }) => void): void;
    getCamera(): number[];
    setCamera(camera: number[], cb: (args: number[]) => void): void;
    getCursor(): number[];
    setCursor(cursor: number[], cb: (args: number[]) => void): void;
    
    gameStart();
}