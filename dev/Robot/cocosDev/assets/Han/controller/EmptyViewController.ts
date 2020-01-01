import IViewManager from "../interface/IViewManager";
import IModel from "../interface/IModel";

export default class EmptyViewController implements IViewManager{
    private model:IModel;
    setModel(model: IModel): void {
        this.model =  model;
    }    
    getModel():IModel{
        return this.model;
    }
    
    onPrepareForStart(callback: () => void): void {

    }
    onPlayerTurnStart(callback: () => void): void {

    }
    onEnemyTurnStart(ai: string, callback: () => void): void {

    }
    onStateChange(state: string, data: any): void {

    }
    onGamePageWClick() {

    }
    onGamePageAClick() {

    }
    onGamePageSClick() {

    }
    onGamePageDClick() {

    }
    onGamePageUPClick() {

    }
    onGamePageDOWNClick() {

    }
    onGamePageLEFTClick() {

    }
    onGamePageRIGHTClick() {

    }
    onGamePageENTERClick() {

    }
    onGamePageESCAPEClick() {

    }
    notifyStartGame() {

    }

    
}