
import DefaultState from "../DefaultState";
import MainPage from "../Page/MainPage";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MainPageDefaultState extends DefaultState {
    onPrevClick(owner: any) {
        (owner as MainPage).onMenuUpClick();
    }
    onNextClick(owner: any) {
        (owner as MainPage).onMenuDownClick();
    }
    onLeftClick(owner: any) {
        
    }
    onRightClick(owner: any) {
        
    }
    onEnterClick(owner: any) {
        (owner as MainPage).onMenuEnterClick();
    }
    onEscClick(owner: any) {
        
    }
}
