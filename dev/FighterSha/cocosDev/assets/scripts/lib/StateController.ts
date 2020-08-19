import IState from "./IState";

const { ccclass, property } = cc._decorator;

@ccclass
export default class StateController extends cc.Component {

    current: IState = null;

    changeState(state: IState) {
        if(this.current) this.current.onReleaseState();
        this.current = state;
        this.current.onEnterState();
    }

    onUpClick() {
        this.current.onUpClick();
    }

    onDownClick() {
        this.current.onDownClick();
    }

    onLeftClick() {
        this.current.onLeftClick();
    }

    onRightClick() {
        this.current.onRightClick();
    }

    onEnterClick() {
        this.current.onEnterClick();
    }

    onEscClick() {
        this.current.onEscClick();
    }
}
