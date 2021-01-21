// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, Node, tween, Sprite, Vec3 } from 'cc';
import { BasicPage } from '../BasicPage';
import { LandMap } from './LandMap';
import { UnitInfo } from './UnitInfo';
const { ccclass, property } = _decorator;

@ccclass('GamePage')
export class GamePage extends BasicPage {

    @property(LandMap)
    map:LandMap = null;

    @property(UnitInfo)
    unitInfo:UnitInfo = null;

    clear(){
        super.clear();
        this.map.clear();
        this.unitInfo.clear();
    }
   
    protected doBuild(content:any, data:any):void{
        super.doBuild(content, data);
        
        const gameData = content.GameplayPages;
        this.map.build(gameData);

        this.unitInfo.hpValueBar.setValue(300);
        this.unitInfo.enValueBar.setValue(500);

        // tween(this.node).delay(2).call(()=>{
        //     this.unitInfo.hpValueBar.setValue(1300, ()=>{});
        // }).delay(2).call(()=>{
        //     this.unitInfo.hpValueBar.setValue(3000, ()=>{});
        //     this.unitInfo.enValueBar.setValue(2000, ()=>{});
        // }).delay(2).call(()=>{
        //     this.unitInfo.hpValueBar.setValue(2000, ()=>{});
        //     this.unitInfo.enValueBar.setValue(3000, ()=>{});
        // }).start();
    }

}
