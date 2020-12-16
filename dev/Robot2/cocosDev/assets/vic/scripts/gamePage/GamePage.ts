// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, Node } from 'cc';
import { BasicViewer } from '../lib/BasicViewer';
import { Grids } from './Grids';
const { ccclass, property } = _decorator;

@ccclass('GamePage')
export class GamePage extends BasicViewer {
   
    @property(Grids)
    grids:Grids = null;

    start(){
        this.grids.initGrids();
    }

    startGame(){
        console.log("start game");
    }
}
