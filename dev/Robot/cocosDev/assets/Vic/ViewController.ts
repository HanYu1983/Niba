import IViewController from "../Han/interface/IViewController";
import IModel from "../Han/interface/IModel";
import ModelController from "../Han/controller/ModelController";
import View from "./View";
import IViewManager from "../Han/interface/IViewManager";
import DefaultViewController from "../Han/controller/state/DefaultViewController";
import StackViewControler from "../Han/controller/StackViewController";
import IView from "../Han/interface/IView";
import EmptyViewController from "../Han/controller/EmptyViewController"

const { ccclass, property } = cc._decorator;

@ccclass
export default class ViewController extends cc.Component {
    @property(View)
    view: View = null;

    @property(ModelController)
    modelController: ModelController = null;

    static instance: ViewController;

    onLoad() {
        this.modelController.setView(this.view);
        ViewController.instance = this;
    }

    start() {
        this.view.openGamePage();
    }

    notifyStartGame() {
        this.modelController.startGame();
    }
}
