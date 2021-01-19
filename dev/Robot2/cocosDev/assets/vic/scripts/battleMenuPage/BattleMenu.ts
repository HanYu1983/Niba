// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, Node } from 'cc';
import { Drawer } from '../Drawer';
import { Instant } from '../lib/instanceViewer/Instant';
const { ccclass, property } = _decorator;

@ccclass('BattleMenu')
export class BattleMenu extends Instant {
    
    protected doBuild(content:any, data:any):void{
        super.doBuild(content, data);
        // console.log(content);
    }
    protected checkData(data:any):any{
        return Drawer.getBattleMenuInGame(data);
    }
}
