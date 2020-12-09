// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, Node } from 'cc';
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
    }

    close(arg?:any){
        super.close(arg);

        this.board.close();
    }
}
