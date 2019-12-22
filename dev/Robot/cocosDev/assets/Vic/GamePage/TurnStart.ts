// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import BasicViewer from "../BasicViewer"
const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends BasicViewer {

    @property(cc.Label)
    content: cc.Label = null;

    @property(cc.Sprite)
    backColor:cc.Sprite = null;

    setContent(content:string){
        this.content.string = content;
    }

    setPlayer(isPlayer:boolean){
        this.backColor.node.color = isPlayer ? cc.Color.BLUE : cc.Color.RED;
    }

    open(){
        super.open();
        this.node.getComponent(cc.Animation).play("TurnStart");
    }

    end(){
        this.node.emit("end");
        this.close();
    }
}
