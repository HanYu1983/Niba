import DefaultState from "../../DefaultState";
import MainPage from "../../Page/MainPage";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ComponentStoreState extends DefaultState {
    onPrevClick(owner: any) {
        (owner as MainPage).onComponentStoreUpClick();
    }
    onNextClick(owner: any) {
        (owner as MainPage).onComponentStoreDownClick();
    }
    onLeftClick(owner: any) {
        (owner as MainPage).onComponentStoreLeftClick();
    }
    onRightClick(owner: any) {
        (owner as MainPage).onComponentStoreRightClick();
    }
    onEnterClick(owner: any) {
        (owner as MainPage).onComponentStoreEnterClick();
    }
    onEscClick(owner: any) {
        (owner as MainPage).onComponentStoreEscClick();
    }
}
