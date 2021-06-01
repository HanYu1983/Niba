
import { _decorator, Component, Node, Label, Sprite, Color } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Chess')
export class Chess extends Component {
    
    @property(Label)
    lblName:Label = null;

    @property(Sprite)
    backNode:Sprite = null;
    
    setNameAndColor(name:string, color:Color){
        this.lblName.string = name;
        this.backNode.color = color;
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
