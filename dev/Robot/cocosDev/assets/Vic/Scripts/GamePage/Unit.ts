// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class Unit extends cc.Component {

    @property(cc.Node)
    unit:cc.Node = null;

    @property(cc.Sprite)
    unitImage: cc.Sprite = null;

    @property(cc.SpriteFrame)
    images: cc.SpriteFrame[] = [];

    unitId: string = "";

    setUnitImage(key: string) {
        for(let i = 0; i < this.images.length; ++i){
            let image = this.images[i];
            if(image.name.toLowerCase()==key.toLowerCase()){
                this.unitImage.spriteFrame = image;
            }
        }
    }

    setColor(color: cc.Color) {
        this.unitImage.node.color = color;
    }

    shake() {
        this.node.getComponent(cc.Animation).play("UnitShake");
    }

    evade(){
        this.node.getComponent(cc.Animation).play("UnitEvade");
    }

    toSky(cb:()=>void){
        cc.tween(this.unit).to(.5, {y:6}).call(cb).start();
    }

    toLand(cb:()=>void){
        cc.tween(this.unit).to(.5, {y:0}).call(cb).start();
    }
}
