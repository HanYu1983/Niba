import DefaultState from "../DefaultState";
import MainPage from "../Page/MainPage";

const {ccclass, property} = cc._decorator;

@ccclass
export default class StandByState extends DefaultState {
    onPrevClick(owner: any) {
        (owner as MainPage).onStandByUpClick();
    }
    onNextClick(owner: any) {
        (owner as MainPage).onStandByDownClick();
    }
    onLeftClick(owner: any) {
        (owner as MainPage).onStandByLeftClick();
    }
    onRightClick(owner: any) {
        (owner as MainPage).onStandByRightClick();
    }
    onEnterClick(owner: any) {
        (owner as MainPage).onStandByEnterClick();
    }
    onEscClick(owner: any) {
        (owner as MainPage).onStandByEscClick();
    }
}
