import EmptyViewController from "./EmptyViewController";
import View from "../../Vic/View";
import StackViewControler from "./StackViewController";
import IUnit from "../interface/IUnit";
import Helper from "./Helper";
import IModel from "../interface/IModel";
import IStackViewControllerEvents from "../interface/IStackViewControllerEvents";

export default class UnitMoveViewController extends EmptyViewController implements IStackViewControllerEvents{
    
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
        this.view.getGamePage().addListener();
    }

    onGamePageESCAPEClick() {
        this.view.getGamePage().removeListenser();
        this.view.getGamePage().closeUnitMenu();
        this.view.getGamePage().addListener();
        this.stackMgr.pop();
    }

    onGamePageWClick() {
        let cursor = this.getModel().getCursor();
        cursor[1] -= 1;
        this.setCursor(cursor);
    }

    onGamePageAClick() {
        let cursor = this.getModel().getCursor();
        cursor[0] -= 1;
        this.setCursor(cursor);
    }

    onGamePageSClick() {
        let cursor = this.getModel().getCursor();
        cursor[1] += 1;
        this.setCursor(cursor);
    }

    onGamePageDClick() {
        let cursor = this.getModel().getCursor();
        cursor[0] += 1;
        this.setCursor(cursor);
    }

    private setCursor(cursor) {
        this.getModel().setCursor(cursor, (newCursor) => {
            this.refreshCursor();
        });
    }

    private refreshCursor() {
        let global = Helper.projectPosition(this.getModel().getCamera(), this.getModel().getCursor());
        this.view.getGamePage().setCursor(global);
    }
}