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
export default class UnitStatuInfo extends BasicViewer {

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
    
    setUnit(unit: any) {
        this.node.active = false;
        if (unit != null) {
            this.node.active = true;

            const image = ViewController.instance.imagesAssets.getImageByKey(unit.robotState.robotKey);
            if (image != undefined) {
                this.unitImage.spriteFrame = image;
            }

            this.unitName.string = unit.robotState.title;

            const hp:number = unit.robotState.hp;
            const en:number = unit.robotState.en;
            const maxHp:number = unit.robotState.maxHp;
            const maxEn:number = unit.robotState.maxEn;
            const curage:number = unit.robotState.curage;
            this.unitHpLabal.string = hp + "/" + maxHp;
            this.unitEnLabal.string = en + "/" + maxEn;
            this.unitHpBar.node.scaleX = hp / maxHp;
            this.unitEnBar.node.scaleX = en / maxEn;
        }
    }
}
