import DefaultState from "../DefaultState";
import MainPage from "../Page/MainPage";

const {ccclass, property} = cc._decorator;

@ccclass
export default class PilotStoreState extends DefaultState {
    onPrevClick(owner: any) {
        (owner as MainPage).onPilotStoreUpClick();
    }
    onNextClick(owner: any) {
        (owner as MainPage).onPilotStoreDownClick();
    }
    onLeftClick(owner: any) {
        (owner as MainPage).onPilotStoreLeftClick();
    }
    onRightClick(owner: any) {
        (owner as MainPage).onPilotStoreRightClick();
    }
    onEnterClick(owner: any) {
        (owner as MainPage).onPilotStoreEnterClick();
    }
    onEscClick(owner: any) {
        (owner as MainPage).onPilotStoreEscClick();
    }
}
