// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, Node, log, EventMouse, Button, Label } from 'cc';
import { BasicGameViewer } from './BasicGameViewer';
import { Sensor } from './Sensor';
const { ccclass, property } = _decorator;

@ccclass('ChineseXiangQi')
export class ChineseXiangQi extends BasicGameViewer {

    @property(Sensor)
    sensor:Sensor = null;

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
        this.setStatus("到玩家了，請點選要移動的棋子");
        this.removeBtnBackStepListener();
        
        this.sendData = [];
        this.sensor.removeListener();

        this.sensor.addListener({callback:(evt:EventMouse)=>{
            let _grid:Node = evt.currentTarget;
            log("玩家點選第一次", _grid.name);

            this.sendData.push(_grid);
            this.onPlayerTurnClickOnce();
        }});
    }

    private onPlayerTurnClickOnce(){
        this.setStatus("請點選要移動到哪裏");

        this.sensor.removeListener();
        this.addBtnBackStepListener((btn:any)=>{this.onPlayerTurnStart();});

        this.sensor.addListener({callback:(evt:EventMouse)=>{
            let _grid:Node = evt.currentTarget;
            log("玩家點選第二次", _grid.name);

            this.sendData.push(_grid);
            this.onPlayerTurnClickSecond();
        }})
    }

    private onPlayerTurnClickSecond(){
        this.setStatus("完成移動");
        log(this.sendData);

        this.sensor.removeListener();

        this.addBtnBackStepListener((btn:any)=>{this.onPlayerTurnClickOnce();});
    }
}
