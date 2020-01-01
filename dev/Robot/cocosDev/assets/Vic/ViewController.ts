import IViewController from "../Han/IViewController";
import IModel from "../Han/IModel";
import ModelController from "./ModelController";
import View from "./View";
import GamePage from "./Page/GamePage";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component implements IViewController {
    onPrepareForStart(callback: () => void): void {
        this.refreshGameMap(callback);
    }

    @property(View)
    view: View = null;

    @property(ModelController)
    modelController: ModelController = null;

    static instance: NewClass;

    private _model: IModel;

    onLoad() {
        this.modelController.setViewController(this);
        NewClass.instance = this;
    }

    start() {
        this.view.openGamePage();
    }

    setCursor(cursor) {
        this.getModel().setCursor(cursor, (newCursor) => {
            this.refreshCursor();
        });
    }

    setCamera(camera) {
        this.getModel().setCamera(camera, (newCamera) => {
            this.refreshGameMap();
        });
    }

    refreshCursor(){
        let global = ModelController.projectPosition(this.getModel().getCamera(), this.getModel().getCursor());
        this.view.getGamePage().setCursor(global);
    }

    refreshGameMap(callback?:()=>void) {
        // 不支援同時呼叫多個callback, 只能順序呼叫
        this._model.getLocalMap(map => {

            // 顯示地圖
            this.view.getGamePage().map.setMap(map);

            // 取得當前地圖的單位
            this._model.getUnitsByRegion(units => {

                // 取得單位的投影
                units = ModelController.projectUnits(this._model.getCamera(), units);

                // 顯示單位
                this.view.getGamePage().units.setUnits(units);

                this.refreshCursor();

                if(callback) callback();
            })
        })
    }

    setModel(model: IModel): void {
        this._model = model;
    }

    getModel() {
        return this._model;
    }

    onPlayerTurnStart(callback: () => void): void {
        this.view.getGamePage().openTurnStart(true, () => {
            this.onPlayerTurn();
            callback();
        });
    }

    onEnemyTurnStart(ai: string, callback: () => void): void {
        this.view.getGamePage().openTurnStart(false, callback);

        this.closeAllMenu();
        this.view.getGamePage().removeListenser();
    }

    onStateChange(state: string, data: any): void {
        cc.log("onStateChange");
    }

    onPlayerTurn() {
        this.closeAllMenu();
        this.view.getGamePage().map.clearRange();
        this.view.getGamePage().addListener();
        // this.view.getGamePage().node.on(GamePage.ON_GAMEPAGE_ENTER, (corsor) => {
        //     this.notifySelectMap(corsor);
        // });

    }

    removeGamePageExtraListener() {
        this.view.getGamePage().node.off(GamePage.ON_GAMEPAGE_ENTER);
        this.view.getGamePage().node.off(GamePage.ON_GAMEPAGE_ESCAPE);
    }

    closeAllMenu() {
        this.view.getGamePage().closeSceneMenu();
        this.view.getGamePage().closeUnitMenu();
    }

    notifyStartGame() {
        this._model.gameStart();
    }
}
