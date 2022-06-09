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
    chess:Sprite = null;

    @property(Sprite)
    moveable:Sprite = null;

    setChessImageAndColor(spt:SpriteFrame, color:Color){
        this.chess.node.active = true;
        this.chess.spriteFrame = spt;
        this.chess.color = color;
    }

    noChess(){
        this.chess.node.active = false;
    }

    showMovable(show:boolean){
        this.moveable.node.active = show;
    }
}
