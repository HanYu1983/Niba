import DefaultState from "../../DefaultState";
import MainPage from "../MainPage";

const {ccclass, property} = cc._decorator;

@ccclass
export default class PilotSettingRobotEquipState extends DefaultState {
    onPrevClick(owner: any) {
        (owner as MainPage).onPilotSettingRobotEquipStateUpClick();
    }
    onNextClick(owner: any) {
        (owner as MainPage).onPilotSettingRobotEquipStateDownClick();
    }
    onLeftClick(owner: any) {
        (owner as MainPage).onPilotSettingRobotEquipStateLeftClick();
    }
    onRightClick(owner: any) {
        (owner as MainPage).onPilotSettingRobotEquipStateRightClick();
    }
    onEnterClick(owner: any) {
        (owner as MainPage).onPilotSettingRobotEquipStateEnterClick();
    }
    onEscClick(owner: any) {
        (owner as MainPage).onPilotSettingRobotEquipStateEscClick();
    }
}
