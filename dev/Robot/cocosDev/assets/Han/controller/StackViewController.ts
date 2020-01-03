import IViewManager from "../interface/IViewManager";
import IModel from "../interface/IModel";
import EmptyViewController from "./EmptyViewController";
import IStackViewControllerEvents from "../interface/IStackViewControllerEvents";

export default class StackViewControler extends EmptyViewController {
    private stack: IViewManager[] = [];

    push(mgr: IViewManager) {
        if (this.getModel() != null) {
            mgr.setModel(this.getModel());
        }
        this.stack.push(mgr);
        if (mgr["onEnterState"]) {
            mgr["onEnterState"]();
        }
    }

    pop() {
        this.stack.pop();
        const mgr = this.getTop();
        if (mgr != null) {
            if (mgr["onEnterState"]) {
                mgr["onEnterState"]();
            }
        }
    }

    popToFirst() {
        if (this.stack.length <= 1) {
            return;
        }
        this.stack.length = 1;

        const mgr = this.getTop();
        if (mgr != null) {
            if (mgr["onEnterState"]) {
                mgr["onEnterState"]();
            }
        }
    }

    getTop(): IViewManager {
        if (this.stack.length == 0) {
            return null;
        }
        return this.stack[this.stack.length - 1];
    }

    setModel(model: IModel): void {
        super.setModel(model);
        for (let i in this.stack) {
            this.stack[i].setModel(model);
        }
    }

    onPrepareForStart(callback: () => void): void {
        const top = this.getTop();
        if (top == null) {
            return;
        }
        top.onPrepareForStart(callback);
    }
    onPlayerTurnStart(callback: () => void): void {
        const top = this.getTop();
        if (top == null) {
            return;
        }
        top.onPlayerTurnStart(callback);
    }
    onEnemyTurnStart(ai: string, callback: () => void): void {
        const top = this.getTop();
        if (top == null) {
            return;
        }
        top.onEnemyTurnStart(ai, callback);
    }
    onStateChange(state: string, data: any): void {
        const top = this.getTop();
        if (top == null) {
            return;
        }
        top.onStateChange(state, data);
    }
    onGamePageWClick() {
        const top = this.getTop();
        if (top == null) {
            return;
        }
        top.onGamePageWClick();
    }
    onGamePageAClick() {
        const top = this.getTop();
        if (top == null) {
            return;
        }
        top.onGamePageAClick();
    }
    onGamePageSClick() {
        const top = this.getTop();
        if (top == null) {
            return;
        }
        top.onGamePageSClick();
    }
    onGamePageDClick() {
        const top = this.getTop();
        if (top == null) {
            return;
        }
        top.onGamePageDClick();
    }
    onGamePageUPClick() {
        const top = this.getTop();
        if (top == null) {
            return;
        }
        top.onGamePageUPClick();
    }
    onGamePageDOWNClick() {
        const top = this.getTop();
        if (top == null) {
            return;
        }
        top.onGamePageDOWNClick();
    }
    onGamePageLEFTClick() {
        const top = this.getTop();
        if (top == null) {
            return;
        }
        top.onGamePageLEFTClick();
    }
    onGamePageRIGHTClick() {
        const top = this.getTop();
        if (top == null) {
            return;
        }
        top.onGamePageRIGHTClick();
    }
    onGamePageENTERClick() {
        const top = this.getTop();
        if (top == null) {
            return;
        }
        top.onGamePageENTERClick();
    }
    onGamePageESCAPEClick() {
        const top = this.getTop();
        if (top == null) {
            return;
        }
        top.onGamePageESCAPEClick();
    }
    notifyStartGame() {
        const top = this.getTop();
        if (top == null) {
            return;
        }
        top.notifyStartGame();
    }
}