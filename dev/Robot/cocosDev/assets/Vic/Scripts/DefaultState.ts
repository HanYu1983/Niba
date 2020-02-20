import IState from "./IState";
import StateController from "./StateController";

const {ccclass, property} = cc._decorator;

@ccclass
export default class DefaultState implements IState {

    onPrevClick(owner: any, stateController: StateController) {
        throw new Error("Method not implemented.");
    }    
    onNextClick(owner: any, stateController: StateController) {
        throw new Error("Method not implemented.");
    }
    onLeftClick(owner: any, stateController: StateController) {
        throw new Error("Method not implemented.");
    }
    onRightClick(owner: any, stateController: StateController) {
        throw new Error("Method not implemented.");
    }
    onEnterClick(owner: any, stateController: StateController) {
        throw new Error("Method not implemented.");
    }
    onEscClick(owner: any, stateController: StateController) {
        throw new Error("Method not implemented.");
    }
}
