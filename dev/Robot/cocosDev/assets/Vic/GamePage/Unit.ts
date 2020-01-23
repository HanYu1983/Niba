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

    @property(cc.Sprite)
    unitImage: cc.Sprite = null;

    @property(cc.SpriteFrame)
    images: cc.SpriteFrame[] = [];

    unitId: string = "";

    setUnitImage(key: string) {
        for(let i = 0; i < this.images.length; ++i){
            let image = this.images[i];
            if(image.name==key){
                this.unitImage.spriteFrame = image;
            }
        }
    }

    setColor(color: cc.Color) {
        this.unitImage.node.color = color;
    }

    shake() {
        this.node.getComponent(cc.Animation).play("ShakeUnit");
    }
}
