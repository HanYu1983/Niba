import DefaultState from "../DefaultState";
import StateController from "../StateController";
import MainPage from "../Page/MainPage";

// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class RobotStoreState extends DefaultState {
    onPrevClick(owner: any, stateController: StateController) {
        (owner as MainPage).onRobotStoreUpClick();
    }
    onNextClick(owner: any, stateController: StateController) {
        (owner as MainPage).onRobotStoreDownClick();
    }
    onLeftClick(owner: any, stateController: StateController) {
        (owner as MainPage).onRobotStoreLeftClick();
    }
    onRightClick(owner: any, stateController: StateController) {
        (owner as MainPage).onRobotStoreRightClick();
    }
    onEnterClick(owner: any, stateController: StateController) {
        (owner as MainPage).onRobotStoreEnterClick();
    }
    onEscClick(owner: any, stateController: StateController) {
        (owner as MainPage).onRobotStoreEscClick();
    }
}
