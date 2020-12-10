// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, Node, log, EventMouse } from 'cc';
import { BasicViewer } from '../../lib/BasicViewer';
import { IGame } from './IGame';
import { Sensor } from './Sensor';
const { ccclass, property } = _decorator;

@ccclass('ChineseXiangQi')
export class ChineseXiangQi extends BasicViewer implements IGame {

    @property(Sensor)
    public sensor:Sensor = null;

    onGameStart(arg?:any):void{
        this.sensor.open();
        this.sensor.removeListener();

        this.onPlayerTurnStart();
    }
    onGameEnd(arg?:any):void{

    }
    
    onUpdate(arg?:any):void{

    }

    private onPlayerTurnStart(arg?:any):void{
        this.sensor.removeListener();

        this.sensor.addListener({callback:(evt:EventMouse)=>{
            let _grid:Node = evt.currentTarget;
            log("玩家點選第一次", _grid.name);

            this.onPlayerTurnClickOnce();
        }});
    }

    private onPlayerTurnClickOnce(){
        this.sensor.removeListener();

        this.sensor.addListener({callback:(evt:EventMouse)=>{
            let _grid:Node = evt.currentTarget;
            log("玩家點選第二次", _grid.name);

            this.onPlayerTurnClickSecond();
        }})
    }

    private onPlayerTurnClickSecond(){
        this.sensor.removeListener();
    }
}
