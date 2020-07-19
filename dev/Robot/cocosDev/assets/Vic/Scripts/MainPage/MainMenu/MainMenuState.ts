import DefaultState from "../../DefaultState";
import MainPage from "../MainPage";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MainMenuState extends DefaultState {
    onPrevClick(owner: any) {
        cc.log("onPrevClick");
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
