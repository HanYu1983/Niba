import EmptyViewController from "../EmptyViewController";
import View from "../../../Vic/View";
import StackViewControler from "../StackViewController";
import IUnit from "../../interface/IUnit";
import Helper from "../Helper";
import IModel from "../../interface/IModel";
import IStackViewControllerEvents from "../../interface/IStackViewControllerEvents";
import UnitMenuViewController from "./UnitMenuViewController";

export default class UnitSelectPositionViewController extends EmptyViewController implements IStackViewControllerEvents{
    
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
        
    }

    onGamePageESCAPEClick() {
        this.view.getGamePage().closeUnitMenu();
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

    onGamePageENTERClick() {
        const cursor = this.getModel().getCursor();
        this.getModel().getUnitNormalState(this.unit.key, info=>{
            const isInRange = info.moveRange.filter(([x,y])=>{
                return x == cursor[0] && y == cursor[1];
            }).length > 0;
            if(isInRange == false){
                return;
            }
            this.getModel().buildPath(cursor, path=>{
                Helper.unitMove(this.view, this.unit.key, path, ()=>{
                    this.stackMgr.push(new UnitMenuViewController(this.view, this.stackMgr, this.unit));
                });
            })
        })
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