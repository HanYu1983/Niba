// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, Node, Sprite, Label, Color } from 'cc';
import { Instant } from './Instant';
const { ccclass, property } = _decorator;

@ccclass('InstButton')
export class InstButton extends Instant {

    @property(Sprite)
    color:Sprite = null;

    @property(Label)
    label:Label = null;

    @property(Color)
    normalColor:Color = new Color(255,255,255);

    @property(Color)
    focusColor:Color = new Color(255,255,0);

    @property(Color)
    disableColor:Color = new Color(255,0,0);

    clear(){
        super.clear();
    }

    doBuild(data:any, all:any):void{
        this.setLabel(data[0]);
        this.setFocus(data[1]);
        this.setEnabled(data[2]);
    }

    private setFocus(focus:boolean){
        let c = this.enabled ? this.normalColor : this.disableColor;
        this.color.color = focus ? this.focusColor : c;
    }

    private setEnabled(enabled:boolean){
        this.enabled = enabled;
    }

    private setLabel(label:string){
        this.label.string = label;
    }
}
