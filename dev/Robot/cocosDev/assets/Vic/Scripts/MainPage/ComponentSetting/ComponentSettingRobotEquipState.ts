import DefaultState from "../../DefaultState";
import MainPage from "../MainPage";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ComponentSettingRobotEquipState extends DefaultState {
    onPrevClick(owner: any) {
        (owner as MainPage).onComponentSettingRobotEquipStateUpClick();
    }
    onNextClick(owner: any) {
        (owner as MainPage).onComponentSettingRobotEquipStateDownClick();
    }
    onLeftClick(owner: any) {
        (owner as MainPage).onComponentSettingRobotEquipStateLeftClick();
    }
    onRightClick(owner: any) {
        (owner as MainPage).onComponentSettingRobotEquipStateRightClick();
    }
    onEnterClick(owner: any) {
        (owner as MainPage).onComponentSettingRobotEquipStateEnterClick();
    }
    onEscClick(owner: any) {
        (owner as MainPage).onComponentSettingRobotEquipStateEscClick();
    }
}
