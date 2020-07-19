import DefaultState from "../../DefaultState";
import MainPage from "../MainPage";

const {ccclass, property} = cc._decorator;

@ccclass
export default class PilotSettingComponentState extends DefaultState {
    onPrevClick(owner: any) {
        (owner as MainPage).onPilotSettingComponentStateUpClick();
    }
    onNextClick(owner: any) {
        (owner as MainPage).onPilotSettingComponentStateDownClick();
    }
    onLeftClick(owner: any) {
        (owner as MainPage).onPilotSettingComponentStateLeftClick();
    }
    onRightClick(owner: any) {
        (owner as MainPage).onPilotSettingComponentStateRightClick();
    }
    onEnterClick(owner: any) {
        (owner as MainPage).onPilotSettingComponentStateEnterClick();
    }
    onEscClick(owner: any) {
        (owner as MainPage).onPilotSettingComponentStateEscClick();
    }
}
