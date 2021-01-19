// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, Node, Sprite, Vec3 } from 'cc';
import { Instant } from '../lib/instanceViewer/Instant';
import { Grids } from './Grids';
const { ccclass, property } = _decorator;

@ccclass('LandMap')
export class LandMap extends Instant {
    
    @property(Grids)
    grids:Grids = null;

    @property(Sprite)
    cursor:Sprite = null;

    clear(){
        this.grids.clear();
    }

    doBuild(content:any, data:any):void{
        this.grids.build(content);
        this.setCursor(content.Cursor);
    }

    setCursor(cursor:any){
        const [x, y] = this.grids.getGridPos(cursor[0], cursor[1]);
        this.cursor.node.setPosition(new Vec3(x, y, 0));
    }
}
