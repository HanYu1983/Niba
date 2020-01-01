import IViewController from "../Han/interface/IViewController";
import IModel from "../Han/interface/IModel";
import ModelController from "../Han/controller/ModelController";
import View from "./View";
import GamePage from "./Page/GamePage";
import Helper from "../Han/controller/Helper";
import IUnit from "../Han/interface/IUnit";
import IViewEvents from "../Han/interface/IViewEvents";
import IViewManager from "../Han/interface/IViewManager";
import DefaultViewController from "../Han/controller/DefaultViewController";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component implements IViewController {
    @property(View)
    view: View = null;

    @property(ModelController)
    modelController: ModelController = null;

    static instance: NewClass;
    private _viewEventHandler: IViewManager;

    onLoad() {
        this._viewEventHandler = new DefaultViewController(this.view);
        this.modelController.setViewController(this);
        NewClass.instance = this;
    }

    start() {
        this.view.openGamePage();
    }

    notifyStartGame() {
        this._viewEventHandler.notifyStartGame();
    }

    onPrepareForStart(callback: () => void): void {
        this._viewEventHandler.onPrepareForStart(callback);
    }

    onGamePageWClick() {
        this._viewEventHandler.onGamePageWClick();
    }

    onGamePageAClick() {
        this._viewEventHandler.onGamePageAClick();
    }

    onGamePageSClick() {
        this._viewEventHandler.onGamePageSClick();
    }

    onGamePageDClick() {
        this._viewEventHandler.onGamePageDClick();
    }

    onGamePageUPClick() {
        this._viewEventHandler.onGamePageUPClick();
    }

    onGamePageDOWNClick() {
        this._viewEventHandler.onGamePageDOWNClick();
    }

    onGamePageLEFTClick() {
        this._viewEventHandler.onGamePageLEFTClick();
    }

    onGamePageRIGHTClick() {
        this._viewEventHandler.onGamePageRIGHTClick();
    }

    onGamePageENTERClick() {
        this._viewEventHandler.onGamePageENTERClick();
    }

    onGamePageESCAPEClick() {
        this._viewEventHandler.onGamePageESCAPEClick();
    }

    setModel(model: IModel): void {
        this._viewEventHandler.setModel(model);
    }

    onPlayerTurnStart(callback: () => void): void {
        this._viewEventHandler.onPlayerTurnStart(callback);
    }

    onEnemyTurnStart(ai: string, callback: () => void): void {
        this._viewEventHandler.onEnemyTurnStart(ai, callback);
    }

    onStateChange(state: string, data: any): void {
        this._viewEventHandler.onStateChange(state, data);
    }
}
