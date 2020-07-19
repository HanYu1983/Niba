import DefaultState from "../../DefaultState";
import LobbyPage from "../LobbyPage";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ComponentSettingComponentState extends DefaultState {
    onPrevClick(owner: any) {
        (owner as LobbyPage).onComponentSettingComponentStateUpClick();
    }
    onNextClick(owner: any) {
        (owner as LobbyPage).onComponentSettingComponentStateDownClick();
    }
    onLeftClick(owner: any) {
        (owner as LobbyPage).onComponentSettingComponentStateLeftClick();
    }
    onRightClick(owner: any) {
        (owner as LobbyPage).onComponentSettingComponentStateRightClick();
    }
    onEnterClick(owner: any) {
        (owner as LobbyPage).onComponentSettingComponentStateEnterClick();
    }
    onEscClick(owner: any) {
        (owner as LobbyPage).onComponentSettingComponentStateEscClick();
    }
}
