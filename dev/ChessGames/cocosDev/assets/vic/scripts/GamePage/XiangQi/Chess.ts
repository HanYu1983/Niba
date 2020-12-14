// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, Node, Sprite, SpriteFrame, Color } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Chess')
export class Chess extends Component {

    @property(Sprite)
    image:Sprite = null;

    setImage(spt:SpriteFrame){
        this.image.spriteFrame = spt;
    }

    setColor(color:Color){
        this.image.color = color;
    }
}
