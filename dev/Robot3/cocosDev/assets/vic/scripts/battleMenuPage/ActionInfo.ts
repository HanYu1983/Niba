// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, Node, Label } from 'cc';
import { Instant } from '../lib/instanceViewer/Instant';
import * as ModelType from '../../../han/types';
const { ccclass, property } = _decorator;

@ccclass('ActionInfo')
export class ActionInfo extends Instant {

    @property(Label)
    damage:Label = null;

    @property(Label)
    accuracy:Label = null;

    @property(Label)
    action:Label = null;

    clear(){
        super.clear();
    }

    doBuild(data:any){
        this.setAction(data.BattleAction);
        this.setInfo(data.Info);
        this.setPower(data.Weapon)
    }

    private setPower(weapon:any){
        this.damage.string = weapon.Damage;
    }

    private setInfo(info:any){
        this.accuracy.string = Math.floor(info.HitRate * 100) + "%";
    }

    private setAction(actionType?:ModelType.BattleAction){
        switch(actionType){
            case ModelType.BattleAction.BattleActionAttack:
                this.action.string = "攻擊";
                break;
            case ModelType.BattleAction.BattleActionGuard:
                this.action.string = "防禦";
                break;
            case ModelType.BattleAction.BattleActionEvade:
                this.action.string = "回避";
                break;
        }
    }
}
