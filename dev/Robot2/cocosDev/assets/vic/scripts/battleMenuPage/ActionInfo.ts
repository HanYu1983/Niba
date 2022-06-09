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
    title:Label = null;

    @property(Label)
    damage:Label = null;

    @property(Label)
    accuracy:Label = null;

    @property(Label)
    action:Label = null;

    clear(){
        super.clear();

        this.damage.string = "";
        this.title.string = "";
        this.accuracy.string = "";
        this.action.string = "";
    }

    doBuild(data:any){
        this.setInfo(data.Info);
        this.setWeapon(data.Weapon);

        // 最後乎叫，因為行動不能的時候，也會設定到武器及命中率
        this.setAction(data.BattleAction);
    }

    private setWeapon(weapon:any){
        this.damage.string = weapon.Damage;
        this.title.string = weapon.Title;
    }

    private setInfo(info:any){
        this.accuracy.string = Math.round(info.HitRate * 100) + "%";
    }

    private setAction(actionType?:ModelType.BattleMenuAction){
        switch(actionType){
            case ModelType.BattleMenuAction.BattleMenuActionAttack:
                this.action.string = "攻擊";
                break;
            case ModelType.BattleMenuAction.BattleMenuActionGuard:
                this.action.string = "防禦";
                break;
            case ModelType.BattleMenuAction.BattleMenuActionEvade:
                this.action.string = "回避";
                break;
            case ModelType.BattleMenuAction.BattleMenuActionCanNotMove:
                this.action.string = "行動不能";
                this.damage.string = "--";
                this.title.string = "--";
                this.accuracy.string = "--";
                break;
        }
    }
}
