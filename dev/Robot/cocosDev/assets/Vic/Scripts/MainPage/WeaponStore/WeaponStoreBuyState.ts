
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
export default class WeaponStoreBuyState extends DefaultState {
    onPrevClick(owner: any) {
        
    }
    onNextClick(owner: any) {
        
    }
    onLeftClick(owner: any) {
        (owner as MainPage).onWeaponStoreBuyLeftClick();
    }
    onRightClick(owner: any) {
        (owner as MainPage).onWeaponStoreBuyRightClick();
    }
    onEnterClick(owner: any) {
        (owner as MainPage).onWeaponStoreBuyEnterClick();
    }
    onEscClick(owner: any) {
        (owner as MainPage).onWeaponStoreBuyEscClick();
    }
}
