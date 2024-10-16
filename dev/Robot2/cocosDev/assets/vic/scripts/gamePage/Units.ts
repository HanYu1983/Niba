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

    getUnitByID(unitId: string):Node{
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
                unit.getComponent(Unit).gridPos.x = pos[0];
                unit.getComponent(Unit).gridPos.y = pos[1];
                unit.getComponent(Unit)?.showAction("");
                if(robot){
                    if(robot.PlayerID == "PlayerIDPlayer"){
                        unit.getComponent(Unit)?.showColor(0);
                    }else{
                        unit.getComponent(Unit)?.showColor(1);
                    }

                    const unitTag = data.Tags[unitKey];
                    if(unitTag){
                        if(unitTag.IsDone) unit.getComponent(Unit)?.showColor(2);
                        unit.getComponent(Unit)?.isAir(unitTag.Sky);
                    }else{
                        unit.getComponent(Unit)?.isAir(false);
                    }
                    unit.getComponent(Unit)?.changeUnit(robot.ProtoID);
                    unit.getComponent(Unit)?.showHPEN(robot.HP, robot.MaxHP, robot.EN, robot.MaxEN);
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

        this.showMapWeaponInfo(content);
    }

    showMapWeaponInfo(content:any){
        if(content.HitMarks){
            for (let key in content.HitMarks) {
                const robot = content.Robots[key];

                // 可能機體爆去所以找不到
                if(robot){
                    let value = content.HitMarks[key];
                    const rate = value.HitRate;
                    const unitView:Node = this.getUnitByID(robot.ID);
                    if(unitView) unitView.getComponent(Unit)?.showAction(Math.round(rate * 100) + "%");
                }
            }
        }
    }
}
