import DefaultState from "../../DefaultState";
import MainPage from "../MainPage";

const {ccclass, property} = cc._decorator;

@ccclass
export default class WeaponSettingComponentState extends DefaultState {
    onPrevClick(owner: any) {
        (owner as MainPage).onWeaponSettingComponentStateUpClick();
    }
    onNextClick(owner: any) {
        (owner as MainPage).onWeaponSettingComponentStateDownClick();
    }
    onLeftClick(owner: any) {
        (owner as MainPage).onWeaponSettingComponentStateLeftClick();
    }
    onRightClick(owner: any) {
        (owner as MainPage).onWeaponSettingComponentStateRightClick();
    }
    onEnterClick(owner: any) {
        (owner as MainPage).onWeaponSettingComponentStateEnterClick();
    }
    onEscClick(owner: any) {
        (owner as MainPage).onWeaponSettingComponentStateEscClick();
    }
}
