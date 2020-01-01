import EmptyViewController from "./EmptyViewController";
import View from "../../Vic/View";
import StackViewControler from "./StackViewController";
import IUnit from "../interface/IUnit";
import Helper from "./Helper";
import IModel from "../interface/IModel";

export default class UnitMenuViewController extends EmptyViewController {
    private view: View;
    private stackMgr: StackViewControler;

    constructor(view: View, stackMgr: StackViewControler) {
        super();
        this.view = view;
        this.stackMgr = stackMgr;
    }

    setModel(model: IModel) {
        super.setModel(model);

        // 關掉地圖監聽
        this.view.getGamePage().removeListenser();

        // 打開單位選單
        let unit: IUnit = this._getUnitOnCursor();
        this.getModel().getUnitMenu(unit.key, (info) => {
            cc.log(info);
            this.view.getGamePage().openUnitMenu(info, (key) => {
                cc.log(key);

                switch (key) {
                    case "move":
                        this.view.getGamePage().closeUnitMenu();
                        break;
                    case "cancel":
                        this.view.getGamePage().closeUnitMenu();
                        this.view.getGamePage().addListener();
                        this.stackMgr.pop();
                        break;
                    default:
                        break;
                }
            });
        });
    }

    private _getUnitOnCursor(): IUnit {
        return Helper.checkIsUnit(this.getModel().getUnits(), this.getModel().getCursor());
    }
}