// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Cards from "./Cards";

const {ccclass, property} = cc._decorator;

@ccclass
export default class PlayerDetail extends cc.Component {

    @property(Cards)
    cards:Cards = null;

    @property(cc.Label)
    currentAsk:cc.Label = null;

    setAsk(ask:string){
        this.currentAsk.string = ask;
    }
}
