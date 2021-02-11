// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, Node, Label } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Explode')
export class Explode extends Component {
    @property(Label)
    damage:Label = null;

    setDamage(damage:number){
        if(damage < 0){
            this.damage.string = "";
        }else{
            this.damage.string = damage + "";
        }
    }
}
