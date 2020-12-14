// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, Node, log, EventMouse, Button, Label } from 'cc';
import { Chess, Gameplay } from '../../../../han/types';
import { Controller } from '../../Controller';
import { BasicGameViewer } from '../BasicGameViewer';
import { Sensor } from '../Sensor';
import { Chesses } from './Chesses';
const { ccclass, property } = _decorator;

@ccclass('ChineseXiangQi')
export class ChineseXiangQi extends BasicGameViewer {

    @property(Sensor)
    sensor:Sensor = null;

    @property(Chesses)
    chesses:Chesses = null;

    onGameStart(arg?:any):void{
        this.sensor.open();
        this.sensor.removeListener();

        this.chesses.initChesses();

    }
    onGameEnd(arg?:any):void{
        
    }
    onPlayerTurn(arg?:any):void{
        this.onPlayerTurnStart();
    }
    onUpdate(arg?:any):void{
        this.refreshBoard(arg);
    }

    private refreshBoard(boardData:Gameplay){
        this.chesses.clearChesses();
        
        let activePlayer = boardData.ActivePlayer;
        let board = boardData.Board;
        for(let y = 0; y < board.length; ++y){
            for(let x = 0; x < board[y].length; ++x){
                this.chesses.setChess(x, y, board[y][x]);
            }
        }
    }

    private onPlayerTurnStart(arg?:any):void{
        this.setStatus("到玩家了，請點選要移動的棋子");
        this.removeBtnBackStepListener();
        
        this.sendData = [];
        this.sensor.addListener();

        this.sensor.onEnter = (grid:Node)=>{
            this.chesses.clearMovable();

            let pos = this.getXYByName(grid);
            let moveRange = Controller.inst.model.QueryMoveRange(pos[0], pos[1]);
            if(moveRange[0]){

            }else{
                moveRange[1].forEach((element) => {
                    this.chesses.setMovable(element[0], element[1]);
                });
            }
        };
        this.sensor.onLeave = null;
        this.sensor.onClick = (grid:Node)=>{
            log("玩家點選第一次", grid.name);

            this.sendData.push(grid);
            this.onPlayerTurnClickOnce();
        };
    }

    private onPlayerTurnClickOnce(){
        this.setStatus("請點選要移動到哪裏");

        this.sensor.addListener();
        this.addBtnBackStepListener((btn:any)=>{this.onPlayerTurnStart();});

        this.sensor.onEnter = null;
        this.sensor.onLeave = null;
        this.sensor.onClick = (grid:Node)=>{
            log("玩家點選第二次", grid.name);

            this.sendData.push(grid);
            this.onPlayerTurnClickSecond();
        };
    }

    private onPlayerTurnClickSecond(){
        this.setStatus("完成移動");
        
        this.sensor.onEnter = null;
        this.sensor.onLeave = null;
        this.sensor.removeListener();
        this.addBtnBackStepListener((btn:any)=>{this.onPlayerTurnClickOnce();});

        let from = this.getXYByName(this.sendData[0]);
        let to = this.getXYByName(this.sendData[1]);
        this.answer([from[0], from[1], to[0], to[1]]);
    }
}
