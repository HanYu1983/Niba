import DefaultState from "../../DefaultState";
import MainPage from "../MainPage";

const {ccclass, property} = cc._decorator;

@ccclass
export default class WeaponSettingRobotEquipState extends DefaultState {
    onPrevClick(owner: any) {
        (owner as MainPage).onWeaponSettingRobotEquipStateUpClick();
    }
    onNextClick(owner: any) {
        (owner as MainPage).onWeaponSettingRobotEquipStateDownClick();
    }
    onLeftClick(owner: any) {
        (owner as MainPage).onWeaponSettingRobotEquipStateLeftClick();
    }
    onRightClick(owner: any) {
        (owner as MainPage).onWeaponSettingRobotEquipStateRightClick();
    }
    onEnterClick(owner: any) {
        (owner as MainPage).onWeaponSettingRobotEquipStateEnterClick();
    }
    onEscClick(owner: any) {
        (owner as MainPage).onWeaponSettingRobotEquipStateEscClick();
    }
}
