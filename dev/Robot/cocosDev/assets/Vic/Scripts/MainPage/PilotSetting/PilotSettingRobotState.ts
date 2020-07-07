import DefaultState from "../../DefaultState";
import MainPage from "../MainPage";

const {ccclass, property} = cc._decorator;

@ccclass
export default class PilotSettingRobotState extends DefaultState {
    onPrevClick(owner: any) {
        (owner as MainPage).onPilotSettingRobotStateUpClick();
    }
    onNextClick(owner: any) {
        (owner as MainPage).onPilotSettingRobotStateDownClick();
    }
    onLeftClick(owner: any) {
        (owner as MainPage).onPilotSettingRobotStateLeftClick();
    }
    onRightClick(owner: any) {
        (owner as MainPage).onPilotSettingRobotStateRightClick();
    }
    onEnterClick(owner: any) {
        (owner as MainPage).onPilotSettingRobotStateEnterClick();
    }
    onEscClick(owner: any) {
        (owner as MainPage).onPilotSettingRobotStateEscClick();
    }
}
