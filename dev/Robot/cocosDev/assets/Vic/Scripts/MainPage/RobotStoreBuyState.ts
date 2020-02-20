import DefaultState from "../DefaultState";
import MainPage from "../Page/MainPage";

// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class RobotStoreBuyState extends DefaultState {
    onPrevClick(owner: any) {
        
    }
    onNextClick(owner: any) {
        
    }
    onLeftClick(owner: any) {
        (owner as MainPage).onRobotStoreBuyLeftClick();
    }
    onRightClick(owner: any) {
        (owner as MainPage).onRobotStoreBuyRightClick();
    }
    onEnterClick(owner: any) {
        (owner as MainPage).onRobotStoreBuyEnterClick();
    }
    onEscClick(owner: any) {
        (owner as MainPage).onRobotStoreBuyEscClick();
    }
}
