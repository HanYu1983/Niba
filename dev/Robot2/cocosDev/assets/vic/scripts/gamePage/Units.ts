// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, Node, instantiate, tween, Tween, Vec3 } from 'cc';
import { Instant } from '../lib/instanceViewer/Instant';
import { Grids } from './Grids';
import { Unit } from './Unit';
const { ccclass, property } = _decorator;

@ccclass('Units')
export class Units extends Instant {
    
    @property(Node)
    prefab:Node = null;

    private units:Node[] = [];

    moveUnit(robotID: string, path: any, cb: ()=>void){
        const unit = this.getUnitByID(robotID);
        if (unit) {
            let actions = [];
            path.forEach(element => {
                let gridPos = Grids.getGridPos(element[0], element[1]);
                actions.push(tween().to(.05, {position:gridPos}));
            });
            let t = tween(unit);

            // 改用apply的形式才可以帶入動作陣列
            t.sequence.apply(t, actions).delay(.05).call(cb).start();
        }

        // 不知道爲什麽只要呼叫了tween之後，再callback。畫面就會閃一下
        // tween(unit).call(cb).start();

        // 這樣直接callback就不會閃
        // cb();
    }

    damageUnit(unidId:string, hp:number, en:number){
        const unit = this.getUnitByID(unidId);
        if(unit){
            // unit.getComponent(Unit)
        }
    }

    private getUnitByID(unitId: string):Node{
        for(let i = 0; i < this.units.length; ++i){
            const unit = this.units[i];
            if(unit.getComponent(Unit)?.unitId == unitId) return unit;
        }
        return null;
    }

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
                unit.getComponent(Unit).unitId = unitKey;
                if(robot){
                    // console.log("robot", robot);
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
