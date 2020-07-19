import DefaultState from "../../DefaultState";
import LobbyPage from "../LobbyPage";

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
        (owner as LobbyPage).onPilotStoreBuyLeftClick();
    }
    onRightClick(owner: any) {
        (owner as LobbyPage).onPilotStoreBuyRightClick();
    }
    onEnterClick(owner: any) {
        (owner as LobbyPage).onPilotStoreBuyEnterClick();
    }
    onEscClick(owner: any) {
        (owner as LobbyPage).onPilotStoreBuyEscClick();
    }
}
