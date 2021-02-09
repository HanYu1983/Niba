// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, Node, tween, Sprite, Vec3 } from 'cc';
import { BasicPage } from '../BasicPage';
import { EffectGenerator } from './EffectGenerator';
import { LandMap } from './LandMap';
import { TurnChange } from './TurnChange';
import { UnitInfo } from './UnitInfo';
const { ccclass, property } = _decorator;

@ccclass('GamePage')
export class GamePage extends BasicPage {

    @property(LandMap)
    map:LandMap = null;

    @property(UnitInfo)
    unitInfo:UnitInfo = null;

    @property(EffectGenerator)
    frontEffect:EffectGenerator = null;

    clear(){
        super.clear();
        this.map.clear();
        this.unitInfo.clear();
    }

    showTurnChange(info:any, cb:()=>void){
        let turnChange = this.frontEffect.createEffect(0, Vec3.ZERO, cb);
        if(info.ID == "PlayerIDPlayer"){
            turnChange.getComponent(TurnChange)?.setTitleAndColor("自軍回合開始", 0);
        }else{
            turnChange.getComponent(TurnChange)?.setTitleAndColor("敵軍回合開始", 1);
        }
    }

    showMsg(msg:string){
        let turnChange = this.frontEffect.createEffect(0, Vec3.ZERO, ()=>{});
        turnChange.getComponent(TurnChange)?.setTitleAndColor(msg, 2);
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
