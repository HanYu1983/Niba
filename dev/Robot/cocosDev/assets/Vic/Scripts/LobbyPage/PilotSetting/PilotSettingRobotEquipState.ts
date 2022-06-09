import DefaultState from "../../DefaultState";
import LobbyPage from "../LobbyPage";

const {ccclass, property} = cc._decorator;

@ccclass
export default class PilotSettingRobotEquipState extends DefaultState {
    onPrevClick(owner: any) {
        (owner as LobbyPage).onPilotSettingRobotEquipStateUpClick();
    }
    onNextClick(owner: any) {
        (owner as LobbyPage).onPilotSettingRobotEquipStateDownClick();
    }
    onLeftClick(owner: any) {
        (owner as LobbyPage).onPilotSettingRobotEquipStateLeftClick();
    }
    onRightClick(owner: any) {
        (owner as LobbyPage).onPilotSettingRobotEquipStateRightClick();
    }
    onEnterClick(owner: any) {
        (owner as LobbyPage).onPilotSettingRobotEquipStateEnterClick();
    }
    onEscClick(owner: any) {
        (owner as LobbyPage).onPilotSettingRobotEquipStateEscClick();
    }
}
