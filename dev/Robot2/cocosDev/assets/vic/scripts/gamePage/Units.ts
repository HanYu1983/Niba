// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, Node, instantiate, tween, Tween } from 'cc';
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
        console.log(unit);
        console.log(path);
        // if (unit) {
        //     let actions:Tween<Node>[] = [];
        //     path.forEach(element => {
        //         // let gridPos = Grids.getGridPos(element[0], element[1]);
        //         // let action = moveTo(gridPos.x, gridPos.y);
        //         // //action.easing(cc.easeSineOut());
        //         // actions.push(action);

        //         const t1 = tween(unit).call(()=>{
        //             console.log("aaaaa");
        //         })

        //         actions.push(t1);
        //     });
        //     console.log(actions);
            
        //     tween(unit).sequence(actions).start();
        //     // tween(unit).sequence(actions).call(cb).start();
        // }
    }

    moveUnitByID(id: string, moveTo: any, callback: () => void) {
        let unit = this.getUnitByID(id);
        if (unit) {
            let actions = [];
            moveTo.forEach(element => {
                let gridPos = ViewController.instance.view.getGridPos(element);
                let action = cc.moveTo(.05, gridPos[0], gridPos[1]);
                //action.easing(cc.easeSineOut());
                actions.push(action);
            });
            actions.push(cc.callFunc(callback));
            unit.node.runAction(cc.sequence(actions));
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
