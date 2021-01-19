// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, Node, tween, Sprite, Vec3 } from 'cc';
import { BasicPage } from '../BasicPage';
import { Drawer } from '../Drawer';
import { Grids } from './Grids';
const { ccclass, property } = _decorator;

@ccclass('GamePage')
export class GamePage extends BasicPage {

    @property(Grids)
    grids:Grids = null;

    @property(Sprite)
    cursor:Sprite = null;

    clear(){
        this.grids.clear();
    }
   
    protected doBuild(content:any, data:any):void{
        super.doBuild(content, data);

        const gameData = content.GameplayPages
        this.grids.build(gameData.Map);
        this.setCursor(gameData.Cursor);
    }

    setCursor(cursor:any){
        const [x, y] = this.grids.getGridPos(cursor[0], cursor[1]);
        this.cursor.node.setPosition(new Vec3(x, y, 0));
    }
}
