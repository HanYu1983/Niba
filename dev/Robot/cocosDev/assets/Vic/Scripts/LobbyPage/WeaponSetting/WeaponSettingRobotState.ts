import DefaultState from "../../DefaultState";
import LobbyPage from "../LobbyPage";

const {ccclass, property} = cc._decorator;

@ccclass
export default class WeaponSettingRobotState extends DefaultState {
    onPrevClick(owner: any) {
        (owner as LobbyPage).onWeaponSettingRobotStateUpClick();
    }
    onNextClick(owner: any) {
        (owner as LobbyPage).onWeaponSettingRobotStateDownClick();
    }
    onLeftClick(owner: any) {
        (owner as LobbyPage).onWeaponSettingRobotStateLeftClick();
    }
    onRightClick(owner: any) {
        (owner as LobbyPage).onWeaponSettingRobotStateRightClick();
    }
    onEnterClick(owner: any) {
        (owner as LobbyPage).onWeaponSettingRobotStateEnterClick();
    }
    onEscClick(owner: any) {
        (owner as LobbyPage).onWeaponSettingRobotStateEscClick();
    }
}
