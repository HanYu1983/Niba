// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, Node, Label, Color, Sprite, CCInteger, Vec3, tween } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ValueBar')
export class ValueBar extends Component {

    // @property(Label)
    // title:Label = null;

    // @property(Color)
    // titleColor:Color = Color.BLACK;

    @property(Label)
    lblValue:Label = null;

    @property(CCInteger)
    maxValue:number = 0;

    @property(Sprite)
    valueImage:Sprite = null;

    private value:number = 0;

    setValue(value:number, cb?:()=>void){
        if(cb){
            this.animationToValue(value, cb);
        }else{
            this.stepToValue(value);
        }
        this.value = value;
    }

    private stepToValue(toValue:number){
        const scale = toValue / this.maxValue;
        this.valueImage.node.setScale(new Vec3(scale, 1, 1));
        this.lblValue.string = toValue + " / " + this.maxValue;
    }

    private animationToValue(toValue:number, cb:()=>void){
        const toScale = toValue / this.maxValue;
        tween(this.valueImage.node).to(1, {scale:new Vec3(toScale, 1, 1)}, {easing:"expoOut"}).call(cb).start();

        const beforeValue = this.value;
        const diff = toValue - beforeValue;
        tween({value:beforeValue}).to(1, {value:this.value}, {easing:"expoOut", onUpdate:(target, ratio)=>{
            if(ratio){
                const showValue = Math.floor(beforeValue + diff * ratio);
                this.lblValue.string = showValue.toString() + " / " + this.maxValue;
            }
        }}).call(cb).start();
    }
}
