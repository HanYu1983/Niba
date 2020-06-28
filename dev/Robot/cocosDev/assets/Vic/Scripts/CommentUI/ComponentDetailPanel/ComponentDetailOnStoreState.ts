import DefaultState from "../../DefaultState";
import MainPage from "../../Page/MainPage";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ComponentDetailOnStoreState extends DefaultState {
    onPrevClick(owner: any) {
        (owner as MainPage).onComponentDetailOnStoreUpClick();
    }
    onNextClick(owner: any) {
        (owner as MainPage).onComponentDetailOnStoreDownClick();
    }
    onLeftClick(owner: any) {
    }
    onRightClick(owner: any) {
    }
    onEnterClick(owner: any) {
        (owner as MainPage).onComponentDetailOnStoreEnterClick();
    }
    onEscClick(owner: any) {
        (owner as MainPage).onComponentDetailOnStoreEscClick();
    }
}
