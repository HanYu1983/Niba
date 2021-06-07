
import { _decorator, Component, Node, Label, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Item')
export class Item extends Component {

    @property(Node)
    back:Node;

    @property(Node)
    cover:Node;

    start(){
        this.showOver(false);
    }

    setValid(active:boolean){
        this.back.setScale(active ? Vec3.ONE : Vec3.ZERO);
    }

    isValidItem(){
        return this.back.scale.equals(Vec3.ONE);
    }

    showOver(active:boolean){
        this.cover.setScale(active ? Vec3.ONE : Vec3.ZERO);
    }
}

/**
 * [1] Class member could be defined like this.
 * [2] Use `property` decorator if your want the member to be serializable.
 * [3] Your initialization goes here.
 * [4] Your update function goes here.
 *
 * Learn more about scripting: https://docs.cocos.com/creator/3.0/manual/en/scripting/
 * Learn more about CCClass: https://docs.cocos.com/creator/3.0/manual/en/scripting/ccclass.html
 * Learn more about life-cycle callbacks: https://docs.cocos.com/creator/3.0/manual/en/scripting/life-cycle-callbacks.html
 */
