import EmptyViewController from "../EmptyViewController";
import View from "../../../Vic/View";
import StackViewControler from "./StackViewController";
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

    setModel(model: IModel) {
        super.setModel(model);

        this.view.getGamePage().removeListenser();
        // 打開地圖選單
        this.view.getGamePage().openSceneMenu(['endTurn', 'cancel'], (key) => {
            console.log("XXXXX "+key);
            switch (key) {
                case "endTurn":
                    {
                        this.stackMgr.popToFirst();
                        this.view.getGamePage().closeSceneMenu();
                        this.view.getGamePage().removeListenser();
                        this.getModel().endTurn();
                    }
                    break;
                case "cancel":
                    {
                        this.view.getGamePage().closeSceneMenu();
                        this.view.getGamePage().addListener();
                        this.stackMgr.pop();
                    }
                    break;
            }
        });
    }
}