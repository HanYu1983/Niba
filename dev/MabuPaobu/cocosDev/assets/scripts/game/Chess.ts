
import { _decorator, Component, Node, Label, Sprite, Color } from 'cc';
import { Viewer } from '../lib/Viewer';
const { ccclass, property } = _decorator;

@ccclass('Chess')
export class Chess extends Viewer {
    
    @property(Label)
    lblName:Label = null;

    @property(Sprite)
    backNode:Sprite = null;
    
    private setNameAndColor(name:string, color:Color){
        this.lblName.string = name;
        this.backNode.color = color;
    }

    protected doOpen(data?:any){
        this.setNameAndColor(data.type == 0 ? '馬' : '炮', data.player == 0 ? Color.BLUE : Color.RED)
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
