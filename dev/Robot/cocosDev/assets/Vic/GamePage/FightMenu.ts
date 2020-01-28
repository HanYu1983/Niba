// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import FightInfo from "./FightInfo";
import Pool from "../Pool";

import ViewController from "../ViewController";

const { ccclass, property, requireComponent } = cc._decorator;

@ccclass
export default class FightMenu extends cc.Component {

    @property(cc.Sprite)
    back:cc.Sprite = null;

    @property(FightInfo)
    playerInfo: FightInfo = null;

    @property(FightInfo)
    enemyInfo: FightInfo = null;

    showInfos(datas: any[]) {
        this.clearInfo();
        this.showInfo(this.playerInfo, datas[0]);
        this.showInfo(this.enemyInfo, datas[1]);
    }

    showInfo(info: FightInfo, data: any) {
        this.back.node.active = true;
        info.node.active = true;
        let weapon:any = ViewController.instance.getWeapon(data.action[1].weaponKey);
        info.setAction(data.action[0]);
        info.setPower(weapon.damage);
        info.setWeaponName(weapon.title);
        info.setHitRate(data.hitRate);
    }

    clearInfo() {
        this.back.node.active = false;
        this.playerInfo.node.active = false;
        this.enemyInfo.node.active = false;
    }
}
