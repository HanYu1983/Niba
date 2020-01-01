import EmptyViewController from "./EmptyViewController";
import View from "../../Vic/View";
import StackViewControler from "./StackViewController";
import IUnit from "../interface/IUnit";
import Helper from "./Helper";
import IModel from "../interface/IModel";
import UnitMoveViewController from "./UnitMoveViewController";
import IStackViewControllerEvents from "../interface/IStackViewControllerEvents";

export default class UnitMenuViewController extends EmptyViewController implements IStackViewControllerEvents {
    
    private view: View;
    private stackMgr: StackViewControler;
    private unit: IUnit;

    constructor(view: View, stackMgr: StackViewControler, unit:IUnit) {
        super();
        this.view = view;
        this.stackMgr = stackMgr;
        this.unit = unit;
    }

    onEnterState() {
        // 關掉地圖監聽
        this.view.getGamePage().removeListenser();
        this.getModel().getUnitMenu(this.unit.key, (info) => {
            cc.log(info);
            this.view.getGamePage().openUnitMenu(info, (key) => {
                cc.log(key);

                switch (key) {
                    case "move":
                        this.view.getGamePage().closeUnitMenu();
                        this.stackMgr.push(new UnitMoveViewController(this.view, this.stackMgr));
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