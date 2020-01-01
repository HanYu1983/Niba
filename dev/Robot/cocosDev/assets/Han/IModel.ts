export default interface IModel {
    pushState(state: string, save: any, callback: () => void): void;
    popState(callback: () => void): void;
    getLocalMap(cb: (args: number[][]) => void): void;
    getLocalUnits(cb: (args: any[]) => void): void;
}