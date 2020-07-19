import DefaultState from "../../DefaultState";
import LobbyPage from "../LobbyPage";

const {ccclass, property} = cc._decorator;

@ccclass
export default class WeaponSettingComponentState extends DefaultState {
    onPrevClick(owner: any) {
        (owner as LobbyPage).onWeaponSettingComponentStateUpClick();
    }
    onNextClick(owner: any) {
        (owner as LobbyPage).onWeaponSettingComponentStateDownClick();
    }
    onLeftClick(owner: any) {
        (owner as LobbyPage).onWeaponSettingComponentStateLeftClick();
    }
    onRightClick(owner: any) {
        (owner as LobbyPage).onWeaponSettingComponentStateRightClick();
    }
    onEnterClick(owner: any) {
        (owner as LobbyPage).onWeaponSettingComponentStateEnterClick();
    }
    onEscClick(owner: any) {
        (owner as LobbyPage).onWeaponSettingComponentStateEscClick();
    }
}
