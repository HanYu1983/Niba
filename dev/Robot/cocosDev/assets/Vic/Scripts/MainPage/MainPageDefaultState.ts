
import DefaultState from "../DefaultState";
import StateController from "../StateController";
import MainPage from "../Page/MainPage";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MainPageDefaultState extends DefaultState {
    onPrevClick(owner: any, stateController: StateController) {
        (owner as MainPage).onMenuUpClick();
    }
    onNextClick(owner: any, stateController: StateController) {
        (owner as MainPage).onMenuDownClick();
    }
    onLeftClick(owner: any, stateController: StateController) {
        
    }
    onRightClick(owner: any, stateController: StateController) {
        
    }
    onEnterClick(owner: any, stateController: StateController) {
        (owner as MainPage).onMenuEnterClick();
    }
    onEscClick(owner: any, stateController: StateController) {
        
    }
}
