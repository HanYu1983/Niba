import DefaultState from "../../DefaultState";
import MainPage from "../MainPage";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ComponentSettingComponentState extends DefaultState {
    onPrevClick(owner: any) {
        (owner as MainPage).onComponentSettingComponentStateUpClick();
    }
    onNextClick(owner: any) {
        (owner as MainPage).onComponentSettingComponentStateDownClick();
    }
    onLeftClick(owner: any) {
        (owner as MainPage).onComponentSettingComponentStateLeftClick();
    }
    onRightClick(owner: any) {
        (owner as MainPage).onComponentSettingComponentStateRightClick();
    }
    onEnterClick(owner: any) {
        (owner as MainPage).onComponentSettingComponentStateEnterClick();
    }
    onEscClick(owner: any) {
        (owner as MainPage).onComponentSettingComponentStateEscClick();
    }
}
