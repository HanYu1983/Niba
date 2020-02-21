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
export default class PilotStoreBuyState extends DefaultState {
    onPrevClick(owner: any) {
        
    }
    onNextClick(owner: any) {
        
    }
    onLeftClick(owner: any) {
        (owner as MainPage).onPilotStoreBuyLeftClick();
    }
    onRightClick(owner: any) {
        (owner as MainPage).onPilotStoreBuyRightClick();
    }
    onEnterClick(owner: any) {
        (owner as MainPage).onPilotStoreBuyEnterClick();
    }
    onEscClick(owner: any) {
        (owner as MainPage).onPilotStoreBuyEscClick();
    }
}
