
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import DefaultState from "../../DefaultState";
import LobbyPage from "../LobbyPage";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ComponentStoreBuyState extends DefaultState {
    onPrevClick(owner: any) {
        
    }
    onNextClick(owner: any) {
        
    }
    onLeftClick(owner: any) {
        (owner as LobbyPage).onComponentStoreBuyLeftClick();
    }
    onRightClick(owner: any) {
        (owner as LobbyPage).onComponentStoreBuyRightClick();
    }
    onEnterClick(owner: any) {
        (owner as LobbyPage).onComponentStoreBuyEnterClick();
    }
    onEscClick(owner: any) {
        (owner as LobbyPage).onComponentStoreBuyEscClick();
    }
}
