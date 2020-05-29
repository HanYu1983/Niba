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
export default class UnitStatuMenu extends BasicViewer {

    @property(cc.Node)
    unitSection: cc.Node = null;

    @property(cc.Node)
    terrainSection: cc.Node = null;

    @property(cc.Sprite)
    unitImage: cc.Sprite = null;

    @property(cc.Label)
    unitName: cc.Label = null;

    @property(cc.Label)
    unitHpLabal: cc.Label = null;

    @property(cc.Label)
    unitEnLabal: cc.Label = null;
    
    @property(cc.Sprite)
    unitHpBar: cc.Sprite = null;

    @property(cc.Sprite)
    unitEnBar: cc.Sprite = null;

    @property(cc.Sprite)
    landImage: cc.Sprite = null;

    @property(cc.Label)
    moveBuff: cc.Label = null;

    @property(cc.Label)
    accuracyBuff: cc.Label = null;

    @property(cc.Label)
    damageBuff: cc.Label = null;

    setUnit(unit: any) {
        this.unitSection.active = false;
        if (unit != null) {
            this.unitSection.active = true;

            const image = ViewController.instance.imagesAssets.getImageByKey(unit.robotState.robot);
            if (image != undefined) {
                this.unitImage.spriteFrame = image;
            }

            this.unitName.string = unit.robotState.robot;

            const hp:number = unit.robotState.hp;
            const en:number = unit.robotState.en;
            const maxHp:number = unit.robotState.maxHp;
            const maxEn:number = unit.robotState.maxEn;
            this.unitHpLabal.string = hp + "/" + maxHp;
            this.unitEnLabal.string = en + "/" + maxEn;
            this.unitHpBar.node.scaleX = hp / maxHp;
            this.unitEnBar.node.scaleX = en / maxEn;
        }
    }

    setTerrain(terrain: any) {
        this.terrainSection.active = false;
        if (terrain != null) {
            this.terrainSection.active = true;
            
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
