import DefaultState from "../../DefaultState";
import MainPage from "../MainPage";

const {ccclass, property} = cc._decorator;

@ccclass
export default class WeaponSettingRobotState extends DefaultState {
    onPrevClick(owner: any) {
        (owner as MainPage).onWeaponSettingRobotStateUpClick();
    }
    onNextClick(owner: any) {
        (owner as MainPage).onWeaponSettingRobotStateDownClick();
    }
    onLeftClick(owner: any) {
        (owner as MainPage).onWeaponSettingRobotStateLeftClick();
    }
    onRightClick(owner: any) {
        (owner as MainPage).onWeaponSettingRobotStateRightClick();
    }
    onEnterClick(owner: any) {
        (owner as MainPage).onWeaponSettingRobotStateEnterClick();
    }
    onEscClick(owner: any) {
        (owner as MainPage).onWeaponSettingRobotStateEscClick();
    }
}
