// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import UnitStatuInfo from "./UnitStatuInfo";
import PilotStateInfo from "./PilotStatuInfo";

const { ccclass, property } = cc._decorator;

@ccclass
export default class FightInfo extends cc.Component {

    @property(cc.Label)
    weaponName: cc.Label = null;

    @property(cc.Label)
    power: cc.Label = null;

    @property(cc.Label)
    hit: cc.Label = null;

    @property(UnitStatuInfo)
    unit:UnitStatuInfo = null;

    @property(PilotStateInfo)
    pilot:PilotStateInfo = null;

    setHitRate(rate: number) {
        this.hit.string = rate === 0 ? "--" : (rate * 100).toFixed(0) + "%";
    }

    setPower(power: number) {
        this.power.string = power.toString();
    }

    setWeaponName(name: string) {
        this.weaponName.string = name;
    }

    setUnit(unit:any){
        this.unit.setUnit(unit);
        this.pilot.setPilot(unit.robotState.pilotState);
    }

    showHit(show:boolean){
        this.hit.node.active = show;
    }

    showPower(show:boolean){
        this.power.node.active = show;
    }
}
