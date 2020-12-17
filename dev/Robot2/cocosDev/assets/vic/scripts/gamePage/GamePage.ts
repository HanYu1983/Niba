// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, Node } from 'cc';
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
        this.grids.initGrids();
    }

    startGame(){
        console.log("start game");
    }

    showUnitMenu(data:any){
        this.unitMenu.active = true;
        this.unitMenu.getComponent(InstMenu)?.build(data);
    }
}
