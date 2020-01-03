import EmptyViewController from "../EmptyViewController";
import View from "../../../Vic/View";
import StackViewControler from "../StackViewController";
import IUnit from "../../interface/IUnit";
import Helper from "../Helper";
import IModel from "../../interface/IModel";

export default class SceneMenuViewController extends EmptyViewController {
    private view: View;
    private stackMgr: StackViewControler;

    constructor(view: View, stackMgr: StackViewControler) {
        super();
        this.view = view;
        this.stackMgr = stackMgr;
    }

    onGamePageWClick() {
        this.view.getGamePage().sceneMenu.prev();
    }

    onGamePageAClick() {
        this.view.getGamePage().sceneMenu.left();
    }

    onGamePageSClick() {
        this.view.getGamePage().sceneMenu.next();
    }

    onGamePageDClick() {
        this.view.getGamePage().sceneMenu.right();
    }

    onGamePageENTERClick() {
        this.view.getGamePage().sceneMenu.enter();
    }

    onGamePageESCAPEClick() {
        this.view.getGamePage().sceneMenu.escape();
    }

    setModel(model: IModel) {
        super.setModel(model);

        this.view.getGamePage().openSceneMenu(['endTurn', 'cancel'], (key) => {
            switch (key) {
                case "endTurn":
                    {
                        this.stackMgr.popToFirst();
                        this.view.getGamePage().closeSceneMenu();
                        this.getModel().endTurn();
                    }
                    break;
                case "cancel":
                    {
                        this.view.getGamePage().closeSceneMenu();
                        this.stackMgr.pop();
                    }
                    break;
            }
        });
    }
}