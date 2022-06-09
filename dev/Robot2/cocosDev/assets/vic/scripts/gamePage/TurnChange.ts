// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, Node, Label, Sprite, Color } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('TurnChange')
export class TurnChange extends Component {

    @property(Label)
    title:Label = null;

    @property(Sprite)
    back:Sprite = null;

    @property(Color)
    colors:Color[] = [];

    setTitleAndColor(title:string, colorId:number){
        this.title.string = title;
        this.back.color = this.colors[colorId];
    }
}
