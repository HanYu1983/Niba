// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, Node } from 'cc';
import { Drawer } from '../Drawer';
import { UnitInfo } from '../gamePage/UnitInfo';
import { Instant } from '../lib/instanceViewer/Instant';
import { ActionInfo } from './ActionInfo';
const { ccclass, property } = _decorator;

@ccclass('BattleMenu')
export class BattleMenu extends Instant {

    @property(UnitInfo)
    unitInfos:UnitInfo[] = [];

    @property(ActionInfo)
    actionInfos:ActionInfo[] = [];

    clear(){
        this.actionInfos.forEach(info=>{
            info.clear();
        });

        this.unitInfos.forEach(info=>{
            info.clear();
        });
    }
    
    protected doBuild(content:any, data:any):void{
        super.doBuild(content, data);

        this.unitInfos[0].build(content.Left.Robot);
        this.unitInfos[1].build(content.Right.Robot);
        
        this.actionInfos[0].build(content.Left);
        this.actionInfos[1].build(content.Right);
    }
    protected checkData(data:any):any{
        return Drawer.getBattleMenuInGame(data);
    }
}
