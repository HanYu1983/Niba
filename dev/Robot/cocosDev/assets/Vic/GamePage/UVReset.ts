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
export default class NewClass extends cc.Component {

    start () {
        cc.log(this.getComponent(cc.Sprite).spriteFrame.getRect());
        //cc.log(this.getComponent(cc.Sprite).getMaterial(0).setProperty );
        //cc.log(this.getComponent(cc.Sprite).getMaterial(0).passes[0]);
        this.getComponent(cc.Sprite).getMaterial(0).setProperty('myc', [100,1,0,0]);
        //this.getComponent(cc.Sprite).getMaterial(0).setProperty('alphaThreshold', 1);

        
        
    }
}
