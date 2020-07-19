import DefaultState from "../../DefaultState";
import LobbyPage from "../LobbyPage";

const {ccclass, property} = cc._decorator;

@ccclass
export default class PilotSettingComponentState extends DefaultState {
    onPrevClick(owner: any) {
        (owner as LobbyPage).onPilotSettingComponentStateUpClick();
    }
    onNextClick(owner: any) {
        (owner as LobbyPage).onPilotSettingComponentStateDownClick();
    }
    onLeftClick(owner: any) {
        (owner as LobbyPage).onPilotSettingComponentStateLeftClick();
    }
    onRightClick(owner: any) {
        (owner as LobbyPage).onPilotSettingComponentStateRightClick();
    }
    onEnterClick(owner: any) {
        (owner as LobbyPage).onPilotSettingComponentStateEnterClick();
    }
    onEscClick(owner: any) {
        (owner as LobbyPage).onPilotSettingComponentStateEscClick();
    }
}
