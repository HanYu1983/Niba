import DefaultState from "../../DefaultState";
import LobbyPage from "../LobbyPage";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ComponentSettingRobotState extends DefaultState {
    onPrevClick(owner: any) {
        (owner as LobbyPage).onComponentSettingRobotStateUpClick();
    }
    onNextClick(owner: any) {
        (owner as LobbyPage).onComponentSettingRobotStateDownClick();
    }
    onLeftClick(owner: any) {
        (owner as LobbyPage).onComponentSettingRobotStateLeftClick();
    }
    onRightClick(owner: any) {
        (owner as LobbyPage).onComponentSettingRobotStateRightClick();
    }
    onEnterClick(owner: any) {
        (owner as LobbyPage).onComponentSettingRobotStateEnterClick();
    }
    onEscClick(owner: any) {
        (owner as LobbyPage).onComponentSettingRobotStateEscClick();
    }
}
