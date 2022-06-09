import IState from "./IState";

const { ccclass, property } = cc._decorator;

@ccclass
export default class StateController extends cc.Component {

    current: IState = null;

    changeState(state: IState) {
        this.current = state;
    }

    onPrevClick(owner: any) {
        this.current.onPrevClick(owner);
    }

    onNextClick(owner: any) {
        this.current.onNextClick(owner);
    }

    onLeftClick(owner: any) {
        this.current.onLeftClick(owner);
    }

    onRightClick(owner: any) {
        this.current.onRightClick(owner);
    }

    onEnterClick(owner: any) {
        this.current.onEnterClick(owner);
    }

    onEscClick(owner: any) {
        this.current.onEscClick(owner);
    }
}
