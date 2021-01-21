// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, Node, instantiate } from 'cc';
import { Instant } from '../lib/instanceViewer/Instant';
import { Grids } from './Grids';
const { ccclass, property } = _decorator;

@ccclass('Units')
export class Units extends Instant {
    
    @property(Node)
    prefab:Node = null;

    private units:Node[] = [];

    clear(){
        super.clear();
        this.units.forEach(unit=>{
            this.pool.release(this.prefab, unit);
        });
        this.units = [];
    }

    doBuild(content:any, data:any){
        const units = content.Units;
        
        if(units){
            for(let i = 0; i < units.length; ++i){
                const unitKey = units[i];
                const pos = content.Positions[unitKey];
                const robot = content.Robots[unitKey];
                const item = content.Items[unitKey];
                const unit:Node = this.pool.aquire(this.prefab, this.node);
                if(robot){
                    console.log("robot", robot);
                }
                if(pos){
                    unit.setPosition(Grids.getGridPos(pos[0], pos[1]));
                }
                if(item){
                    // deal with item
                }
                this.units.push(unit);
            }
        }
    }
}
