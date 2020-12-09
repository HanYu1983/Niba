// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, Node, EventMouse, log } from 'cc';
import { BasicViewer } from '../lib/BasicViewer';
import { Board } from './GamePage/Board';
const { ccclass, property } = _decorator;

@ccclass('GamePage')
export class GamePage extends BasicViewer {

    @property(Board)
    public board:Board = null;

    open(arg?:any){
        super.open(arg);

        this.board.open();
        this.board.removeListener();

        this.onPlayerTurnStart();
    }

    close(arg?:any){
        super.close(arg);

        this.board.close();
    }

    onPlayerTurnStart(){
        this.board.removeListener();

        this.board.addListener({callback:(evt:EventMouse)=>{
            let _grid:Node = evt.currentTarget;
            log("玩家點選第一次", _grid.name);

            this.onPlayerTurnClickOnce();
        }});
    }

    onPlayerTurnClickOnce(){
        this.board.removeListener();

        this.board.addListener({callback:(evt:EventMouse)=>{
            let _grid:Node = evt.currentTarget;
            log("玩家點選第二次", _grid.name);

            this.onPlayerTurnClickSecond();
        }})
    }

    onPlayerTurnClickSecond(){
        this.board.removeListener();
    }
}
