import DefaultState from "../../DefaultState";
import MainPage from "../../Page/MainPage";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PrepareMenuState extends DefaultState {
    onPrevClick(owner: any) {
        (owner as MainPage).onPrepareMenuPrevClick();
    }
    onNextClick(owner: any) {
        (owner as MainPage).onPrepareMenuNextClick();
    }
    onLeftClick(owner: any) {
        
    }
    onRightClick(owner: any) {
        
    }
    onEnterClick(owner: any) {
        (owner as MainPage).onPrepareMenuEnterClick();
    }
    onEscClick(owner: any) {
        (owner as MainPage).onPrepareMenuEscClick();
    }
}
