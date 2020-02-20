import IState from "./IState";

const { ccclass, property } = cc._decorator;

@ccclass
export default class StateController extends cc.Component {

    current: IState = null;

    changeState(state: IState) {
        this.current = state;
    }

    onPrevClick(owner: any) {
        this.current.onPrevClick(owner, this);
    }

    onNextClick(owner: any) {
        this.current.onNextClick(owner, this);
    }

    onLeftClick(owner: any) {
        this.current.onLeftClick(owner, this);
    }

    onRightClick(owner: any) {
        this.current.onRightClick(owner, this);
    }

    onEnterClick(owner: any) {
        this.current.onEnterClick(owner, this);
    }

    onEscClick(owner: any) {
        this.current.onEscClick(owner, this);
    }
}
