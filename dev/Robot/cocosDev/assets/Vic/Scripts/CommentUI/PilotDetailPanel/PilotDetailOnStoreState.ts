import DefaultState from "../../DefaultState";
import MainPage from "../../Page/MainPage";

const {ccclass, property} = cc._decorator;

@ccclass
export default class PilotDetailOnStoreState extends DefaultState {
    onPrevClick(owner: any) {
        (owner as MainPage).onPilotDetailOnStoreUpClick();
    }
    onNextClick(owner: any) {
        (owner as MainPage).onPilotDetailOnStoreDownClick();
    }
    onLeftClick(owner: any) {
    }
    onRightClick(owner: any) {
    }
    onEnterClick(owner: any) {
        (owner as MainPage).onPilotDetailOnStoreEnterClick();
    }
    onEscClick(owner: any) {
        (owner as MainPage).onPilotDetailOnStoreEscClick();
    }
}
