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


    private refreshBoard(boardData:any){
        this.chesses.clearChesses();

        let activePlayer = boardData.ActivePlayer;
        let board = boardData.Board;
        for(let y = 0; y < board.length; ++y){
            for(let x = 0; x < board[y].length; ++x){
                const chessData = board[y][x];
                if(chessData.Face){
                    this.chesses.setChess(x, y, chessData.ID.Color, chessData.ID.Word);
                }else{
                    this.chesses.setChess(x, y, 0, -1);
                }
            }
        }
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
        
        this.sensor.removeListener();
        this.addBtnBackStepListener((btn:any)=>{this.onPlayerTurnClickOnce();});

        const from:Node = this.sendData[0];
        const to:Node = this.sendData[1];
        let fromPos = from.name.split("_");
        let toPos = to.name.split("_");
        this.answer([fromPos[0], fromPos[1], toPos[0], toPos[1]]);
    }
}
