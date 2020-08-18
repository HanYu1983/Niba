import IState from "./IState";

const { ccclass, property } = cc._decorator;

@ccclass
export default class StateController extends cc.Component {

    current: IState = null;

    changeState(state: IState, owner:any) {
        if(this.current) this.current.onReleaseState(owner);
        this.current = state;
        this.current.onEnterState(owner);
    }

    onUpClick(owner: any) {
        this.current.onUpClick(owner);
    }

    onDownClick(owner: any) {
        this.current.onDownClick(owner);
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
