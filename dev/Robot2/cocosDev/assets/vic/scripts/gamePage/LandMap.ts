// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, Node, Sprite, Vec3, tween } from 'cc';
import { Instant } from '../lib/instanceViewer/Instant';
import { EffectGenerator } from './EffectGenerator';
import { Grids } from './Grids';
import { Units } from './Units';
const { ccclass, property } = _decorator;

@ccclass('LandMap')
export class LandMap extends Instant {
    
    @property(Grids)
    grids:Grids = null;

    @property(Units)
    units:Units = null;

    @property(Sprite)
    cursor:Sprite = null;

    @property(EffectGenerator)
    effects:EffectGenerator = null;

    clear(){
        this.grids.clear();
        this.units.clear();
    }

    doBuild(content:any, data:any):void{
        this.grids.build(content);
        this.units.build(content);
        this.setCursor(content.Cursor);

        tween(this.node).delay(2).call(()=>{
            this.effects.build([[0, Grids.getGridPos(2,3)]]);
        }).start();
    }

    setCursor(cursor:any){
        const cursorPos = Grids.getGridPos(cursor[0], cursor[1]);
        this.cursor.node.setPosition(cursorPos);
    }
}
