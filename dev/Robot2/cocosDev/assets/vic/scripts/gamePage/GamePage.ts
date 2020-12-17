// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, Node, tween } from 'cc';
import { BasicViewer } from '../lib/BasicViewer';
import { IInstant } from '../lib/instanceViewer/IInstant';
import { InstMenu } from '../lib/instanceViewer/InstMenu';
import { Grids } from './Grids';
const { ccclass, property } = _decorator;

@ccclass('GamePage')
export class GamePage extends BasicViewer {
   
    @property(Grids)
    grids:Grids = null;

    @property(Node)
    unitMenu:Node = null;

    start(){
        
        tween(this.node).call(()=>{
            this.grids.build({});
            this.showUnitMenu([['移動', ['武器一', '武器二'], ['道具一', '道具二', '道具三'], '待機'], [0, 0, 0, 0], 0]);
        }).delay(2).call(()=>{
            this.showUnitMenu([['移動', ['武器一', '武器二'], ['道具一', '道具二', '道具三'], '待機'], [0, 0, 0, 0], 1]);
        }).delay(.5).call(()=>{
            this.showUnitMenu([['移動', ['武器一', '武器二'], ['道具一', '道具二', '道具三'], '待機'], [0, 1, 0, 0], 1]);
        }).delay(.5).call(()=>{
            this.grids.build({});
            this.showUnitMenu([['移動', ['武器一', '武器二'], ['道具一', '道具二', '道具三'], '待機'], [0, 1, 0, 0], 2]);
        }).delay(.5).call(()=>{
            this.showUnitMenu([['移動', ['武器一', '武器二'], ['道具一', '道具二', '道具三'], '待機'], [0, 1, 1, 0], 2]);
        }).delay(.5).call(()=>{
            this.showUnitMenu([['移動', ['武器一', '武器二'], ['道具一', '道具二', '道具三'], '待機'], [0, 1, 2, 0], 2]);
        }).start();
    }

    startGame(){
        console.log("start game");
    }

    showUnitMenu(data:any){
        this.unitMenu.active = true;
        this.unitMenu.getComponent(InstMenu)?.build(data);
    }
}
