import DefaultState from "../DefaultState";
import MainPage from "../Page/MainPage";

const {ccclass, property} = cc._decorator;

@ccclass
export default class StandByRobotPilotState extends DefaultState {
    onPrevClick(owner: any) {
        (owner as MainPage).onStandByRobotPilotUpClick();
    }
    onNextClick(owner: any) {
        (owner as MainPage).onStandByRobotPilotDownClick();
    }
    onLeftClick(owner: any) {
        
    }
    onRightClick(owner: any) {
        
    }
    onEnterClick(owner: any) {
        (owner as MainPage).onStandByRobotPilotEnterClick();
    }
    onEscClick(owner: any) {
        (owner as MainPage).onStandByRobotPilotEscClick();
    }
}
