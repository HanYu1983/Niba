import DefaultState from "../../DefaultState";
import MainPage from "../../Page/MainPage";

const {ccclass, property} = cc._decorator;

@ccclass
export default class StandByRobotDetailState extends DefaultState {
    onPrevClick(owner: any) {
        
    }
    onNextClick(owner: any) {
        
    }
    onLeftClick(owner: any) {
        
    }
    onRightClick(owner: any) {
        
    }
    onEnterClick(owner: any) {
        (owner as MainPage).onStandByRobotDetailEnterClick();
    }
    onEscClick(owner: any) {
        (owner as MainPage).onStandByRobotDetailEscClick();
    }
}
