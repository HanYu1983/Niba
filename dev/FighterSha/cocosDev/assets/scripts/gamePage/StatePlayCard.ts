// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import DefaultState from "../lib/DefaultState";
import GamePage from "./GamePage";

const {ccclass, property} = cc._decorator;

@ccclass
export default class StatePlayCard extends DefaultState {

    onEnterState(){
        (this.owner as GamePage).playerDetail.setAsk("aaabbb");
    }
}
