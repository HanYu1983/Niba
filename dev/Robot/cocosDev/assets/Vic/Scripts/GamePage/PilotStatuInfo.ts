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
export default class PilotStateInfo extends BasicViewer {

    @property(cc.Sprite)
    pilot: cc.Sprite = null;

    @property(cc.Label)
    pilotName: cc.Label = null;

    @property(cc.Label)
    melee: cc.Label = null;

    @property(cc.Label)
    range: cc.Label = null;

    @property(cc.Label)
    evade: cc.Label = null;

    @property(cc.Label)
    guard: cc.Label = null;
    
    @property(cc.Label)
    unitCurage: cc.Label = null;

    setPilot(pilot: any) {
        this.node.active = false;
        if (pilot != null) {
            this.node.active = true;

            cc.log(pilot)
            // const image = ViewController.instance.imagesAssets.getImageByKey(unit.robotState.robotKey);
            // if (image != undefined) {
            //     this.unitImage.spriteFrame = image;
            // }

            this.pilotName.string = pilot.title;
            this.melee.string = (pilot.melee * 100) + "";
            this.range.string = (pilot.range * 100) + "";
            this.evade.string = (pilot.agi * 100) + "";
            this.guard.string = (pilot.dex * 100) + "";
            this.unitCurage.string = pilot.curage + "氣力";
        }
    }
}
