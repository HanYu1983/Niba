import IViewController from "../Han/IViewController";
import IModel from "../Han/IModel";
import ModelController from "./ModelController";
import View from "./View";
import GamePage from "./Page/GamePage";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component implements IViewController {

    @property(View)
    view: View = null;

    @property(ModelController)
    modelController:ModelController = null;

    static instance:NewClass;

    private _model: IModel;

    onLoad(){
        this.modelController.setViewController(this);
        NewClass.instance = this;
    }

    setModel(model: IModel): void {
        this._model = model;
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
}
