export default interface IModel {
    pushState(state: string, save: any, callback: () => void): void;
    popState(callback: () => void): void;
    getLocalMap(cb: (args: number[][]) => void): void;
    getLocalUnits(cb: (args: any[]) => void): void;
    getUnitsByRegion(cb: (args: any[]) => void): void;
    getUnitNormalState(unitKey, cb: (info: { unit: any, moveRange: number[][] }) => void): void;
    getCamera(): number[];
    setCamera(camera: number[], cb: (args: number[]) => void): void;
    getCursor(): number[];
    setCursor(cursor: number[], cb: (args: number[]) => void): void;
}