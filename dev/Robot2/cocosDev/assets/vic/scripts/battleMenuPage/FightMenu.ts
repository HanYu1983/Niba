// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import { Sprite, _decorator } from "cc";
import { Drawer } from "../Drawer";
import { Instant } from "../lib/instanceViewer/Instant";
import FightInfo from "./FightInfo";
const { ccclass, property, requireComponent } = _decorator;

@ccclass
export default class FightMenu extends Instant {

    @property(Sprite)
    back: Sprite = null;

    @property(FightInfo)
    playerInfo: FightInfo = null;

    @property(FightInfo)
    enemyInfo: FightInfo = null;

    protected doBuild(content:any, data:any):void{
        super.doBuild(content, data);
        this.showInfos(content);
    }

    protected checkData(data:any):any{
        return Drawer.getBattleMenuInGame(data);
    }

    showInfos(datas: any) {
        this.showInfo(this.playerInfo, datas.Left);
        this.showInfo(this.enemyInfo, datas.Right);
    }

    showInfo(info: FightInfo, data: any) {

        // 如果是防禦或閃避, 沒有第二個元素
        // ["evade"]
        // ["guard"]
        // ["attack" weaponData]

        this.back.node.active = true;
        info.node.active = true;

        info.setUnit(data.Robot);
        
        switch (data.action[0]) {
            case "evade":
                info.setWeaponName("迴避");
                info.showPower(false);
                info.setHitRate(0);
                break;
            case "guard":
                info.setWeaponName("防御");
                info.showPower(false);
                info.setHitRate(0);
                break;
            case "attack":
                {
                    // let weapon: any = ViewController.instance.getWeapon(data.action[1].weaponKey);
                    // info.showPower(true);
                    // info.showHit(true);
                    // info.setHitRate(data.hitRate);
                    // info.setWeaponName(weapon.title);
                    // info.setPower(weapon.damage);
                }
                break;
        }
    }

    // clearInfo() {
    //     this.back.node.active = false;
    //     this.playerInfo.node.active = false;
    //     this.enemyInfo.node.active = false;
    // }
}
