export default interface IModel {
    pushState(state: string, save: any, callback: () => void): void;
    popState(callback: () => void): void;
}