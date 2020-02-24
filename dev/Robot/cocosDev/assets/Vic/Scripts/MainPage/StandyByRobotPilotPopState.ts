import DefaultState from "../DefaultState";
import MainPage from "../Page/MainPage";

const {ccclass, property} = cc._decorator;

@ccclass
export default class StandByRobotPilotPopState extends DefaultState {
    onPrevClick(owner: any) {

    }
    onNextClick(owner: any) {

    }
    onLeftClick(owner: any) {
        (owner as MainPage).onStandByRobotPilotPopLeftClick();
    }
    onRightClick(owner: any) {
        (owner as MainPage).onStandByRobotPilotPopRightClick();
    }
    onEnterClick(owner: any) {
        (owner as MainPage).onStandByRobotPilotPopEnterClick();
    }
    onEscClick(owner: any) {
        (owner as MainPage).onStandByRobotPilotPopEscClick();
    }
}
