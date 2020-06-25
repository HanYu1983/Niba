import DefaultState from "../../DefaultState";
import MainPage from "../../Page/MainPage";

const {ccclass, property} = cc._decorator;

@ccclass
export default class RobotDetailOnStoreState extends DefaultState {
    onPrevClick(owner: any) {
        (owner as MainPage).onRobotDetailOnStoreUpClick();
    }
    onNextClick(owner: any) {
        (owner as MainPage).onRobotDetailOnStoreDownClick();
    }
    onLeftClick(owner: any) {
    }
    onRightClick(owner: any) {
    }
    onEnterClick(owner: any) {
        (owner as MainPage).onRobotDetailOnStoreEnterClick();
    }
    onEscClick(owner: any) {
        (owner as MainPage).onRobotDetailOnStoreEscClick();
    }
}
