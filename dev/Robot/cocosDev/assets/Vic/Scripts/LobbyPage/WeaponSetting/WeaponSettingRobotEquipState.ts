import DefaultState from "../../DefaultState";
import LobbyPage from "../LobbyPage";

const {ccclass, property} = cc._decorator;

@ccclass
export default class WeaponSettingRobotEquipState extends DefaultState {
    onPrevClick(owner: any) {
        (owner as LobbyPage).onWeaponSettingRobotEquipStateUpClick();
    }
    onNextClick(owner: any) {
        (owner as LobbyPage).onWeaponSettingRobotEquipStateDownClick();
    }
    onLeftClick(owner: any) {
        (owner as LobbyPage).onWeaponSettingRobotEquipStateLeftClick();
    }
    onRightClick(owner: any) {
        (owner as LobbyPage).onWeaponSettingRobotEquipStateRightClick();
    }
    onEnterClick(owner: any) {
        (owner as LobbyPage).onWeaponSettingRobotEquipStateEnterClick();
    }
    onEscClick(owner: any) {
        (owner as LobbyPage).onWeaponSettingRobotEquipStateEscClick();
    }
}
