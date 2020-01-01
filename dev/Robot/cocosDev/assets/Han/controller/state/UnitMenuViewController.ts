import EmptyViewController from "../EmptyViewController";
import View from "../../../Vic/View";
import StackViewControler from "./StackViewController";
import IUnit from "../../interface/IUnit";
import Helper from "../Helper";
import IModel from "../../interface/IModel";
import UnitMoveViewController from "./UnitMoveViewController";
import IStackViewControllerEvents from "../../interface/IStackViewControllerEvents";

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

    onGamePageWClick() {
        this.view.getGamePage().unitMenu.prev();
    }

    onGamePageAClick() {
        this.view.getGamePage().unitMenu.left();
    }

    onGamePageSClick() {
        this.view.getGamePage().unitMenu.next();
    }

    onGamePageDClick() {
        this.view.getGamePage().unitMenu.right();
    }

    onGamePageENTERClick() {
        this.view.getGamePage().unitMenu.enter();
    }

    onGamePageESCAPEClick() {
        this.view.getGamePage().unitMenu.escape();
    }

    onEnterState() {
        this.getModel().getUnitMenu(this.unit.key, (info) => {
            cc.log(info);
            this.view.getGamePage().openUnitMenu(info, (key) => {
                cc.log(key);

                switch (key) {
                    case "move":
                        this.view.getGamePage().closeUnitMenu();
                        this.stackMgr.push(new UnitMoveViewController(this.view, this.stackMgr, this.unit));
                        break;
                    case "cancel":
                        this.view.getGamePage().closeUnitMenu();
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