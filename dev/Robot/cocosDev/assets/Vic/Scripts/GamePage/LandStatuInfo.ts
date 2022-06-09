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
import UnitSampleInfo from './UnitSampleInfo';
import ViewController from "../ViewController";
const { ccclass, property } = cc._decorator;

@ccclass
export default class LandStatuInfo extends BasicViewer {
    @property(cc.Sprite)
    landImage: cc.Sprite = null;

    @property(cc.Label)
    moveBuff: cc.Label = null;

    @property(cc.Label)
    accuracyBuff: cc.Label = null;

    @property(cc.Label)
    damageBuff: cc.Label = null;

    setTerrain(terrain: any) {
        this.node.active = false;
        if (terrain != null) {
            this.node.active = true;
            
            const image = ViewController.instance.imagesAssets.getImageByKey(terrain.title);
            if (image != undefined) {
                this.landImage.spriteFrame = image;
            }

            this.moveBuff.string = "移動補正="+terrain.cost;
            this.accuracyBuff.string = "命中補正="+terrain.hitRate;
            this.damageBuff.string = "傷害補正="+terrain.damage;
        }
    }
}
