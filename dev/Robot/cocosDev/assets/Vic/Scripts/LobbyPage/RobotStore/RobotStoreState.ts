import DefaultState from "../../DefaultState";
import MainPage from "../../Page/MainPage";

const {ccclass, property} = cc._decorator;

@ccclass
export default class RobotStoreState extends DefaultState {
    onPrevClick(owner: any) {
        (owner as MainPage).onRobotStoreUpClick();
    }
    onNextClick(owner: any) {
        (owner as MainPage).onRobotStoreDownClick();
    }
    onLeftClick(owner: any) {
        (owner as MainPage).onRobotStoreLeftClick();
    }
    onRightClick(owner: any) {
        (owner as MainPage).onRobotStoreRightClick();
    }
    onEnterClick(owner: any) {
        (owner as MainPage).onRobotStoreEnterClick();
    }
    onEscClick(owner: any) {
        (owner as MainPage).onRobotStoreEscClick();
    }
}
