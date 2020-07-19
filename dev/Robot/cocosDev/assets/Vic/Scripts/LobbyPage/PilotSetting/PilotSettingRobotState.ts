import DefaultState from "../../DefaultState";
import LobbyPage from "../LobbyPage";

const {ccclass, property} = cc._decorator;

@ccclass
export default class PilotSettingRobotState extends DefaultState {
    onPrevClick(owner: any) {
        (owner as LobbyPage).onPilotSettingRobotStateUpClick();
    }
    onNextClick(owner: any) {
        (owner as LobbyPage).onPilotSettingRobotStateDownClick();
    }
    onLeftClick(owner: any) {
        (owner as LobbyPage).onPilotSettingRobotStateLeftClick();
    }
    onRightClick(owner: any) {
        (owner as LobbyPage).onPilotSettingRobotStateRightClick();
    }
    onEnterClick(owner: any) {
        (owner as LobbyPage).onPilotSettingRobotStateEnterClick();
    }
    onEscClick(owner: any) {
        (owner as LobbyPage).onPilotSettingRobotStateEscClick();
    }
}
