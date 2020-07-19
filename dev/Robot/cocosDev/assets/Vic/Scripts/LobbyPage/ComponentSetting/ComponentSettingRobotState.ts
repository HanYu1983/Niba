import DefaultState from "../../DefaultState";
import MainPage from "../MainPage";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ComponentSettingRobotState extends DefaultState {
    onPrevClick(owner: any) {
        (owner as MainPage).onComponentSettingRobotStateUpClick();
    }
    onNextClick(owner: any) {
        (owner as MainPage).onComponentSettingRobotStateDownClick();
    }
    onLeftClick(owner: any) {
        (owner as MainPage).onComponentSettingRobotStateLeftClick();
    }
    onRightClick(owner: any) {
        (owner as MainPage).onComponentSettingRobotStateRightClick();
    }
    onEnterClick(owner: any) {
        (owner as MainPage).onComponentSettingRobotStateEnterClick();
    }
    onEscClick(owner: any) {
        (owner as MainPage).onComponentSettingRobotStateEscClick();
    }
}
