// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GridBorder')
export class GridBorder extends Component {

    @property(Node)
    public focus:Node = null;

    showFocus(show:boolean):void{
        this.focus.active = show;
    }

    

}
