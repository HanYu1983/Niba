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
export default class UVReset extends cc.Component {

    fix () {
        let t:cc.Texture2D = this.getComponent(cc.Sprite).spriteFrame.getTexture();
        let r:cc.Rect = this.getComponent(cc.Sprite).spriteFrame.getRect();
        let min_u = r.x / t.width;
        let max_u = (r.x + r.width) / t.width;
        let min_y = r.y / t.height;
        let max_y = (r.y + r.height) / t.height;
        this.getComponent(cc.Sprite).getMaterial(0).setProperty('resetUV', [min_u, max_u - min_u, min_y, max_y - min_y]);
    }
}
