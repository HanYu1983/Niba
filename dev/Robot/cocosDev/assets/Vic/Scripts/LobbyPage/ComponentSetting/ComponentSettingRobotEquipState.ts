import DefaultState from "../../DefaultState";
import LobbyPage from "../LobbyPage";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ComponentSettingRobotEquipState extends DefaultState {
    onPrevClick(owner: any) {
        (owner as LobbyPage).onComponentSettingRobotEquipStateUpClick();
    }
    onNextClick(owner: any) {
        (owner as LobbyPage).onComponentSettingRobotEquipStateDownClick();
    }
    onLeftClick(owner: any) {
        (owner as LobbyPage).onComponentSettingRobotEquipStateLeftClick();
    }
    onRightClick(owner: any) {
        (owner as LobbyPage).onComponentSettingRobotEquipStateRightClick();
    }
    onEnterClick(owner: any) {
        (owner as LobbyPage).onComponentSettingRobotEquipStateEnterClick();
    }
    onEscClick(owner: any) {
        (owner as LobbyPage).onComponentSettingRobotEquipStateEscClick();
    }
}
