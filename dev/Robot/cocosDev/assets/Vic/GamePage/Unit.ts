// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class Unit extends cc.Component {

    @property(cc.Label)
    lblName: cc.Label = null;

    @property(cc.Sprite)
    backColor:cc.Sprite = null;

    unitId:string = "";

    setName(name:string){
        this.lblName.string = name;
    }

    setColor(color:cc.Color){
        this.backColor.node.color = color;
    }

    shake(){
        this.node.getComponent(cc.Animation).play("ShakeUnit");
    }
}
