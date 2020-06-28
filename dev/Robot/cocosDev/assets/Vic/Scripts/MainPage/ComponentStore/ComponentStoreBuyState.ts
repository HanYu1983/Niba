
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import DefaultState from "../../DefaultState";
import MainPage from "../MainPage";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ComponentStoreBuyState extends DefaultState {
    onPrevClick(owner: any) {
        
    }
    onNextClick(owner: any) {
        
    }
    onLeftClick(owner: any) {
        (owner as MainPage).onComponentStoreBuyLeftClick();
    }
    onRightClick(owner: any) {
        (owner as MainPage).onComponentStoreBuyRightClick();
    }
    onEnterClick(owner: any) {
        (owner as MainPage).onComponentStoreBuyEnterClick();
    }
    onEscClick(owner: any) {
        (owner as MainPage).onComponentStoreBuyEscClick();
    }
}
