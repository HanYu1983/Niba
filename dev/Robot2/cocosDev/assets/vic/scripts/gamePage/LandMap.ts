// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, Node, Sprite, Vec3, tween, Animation } from 'cc';
import { Instant } from '../lib/instanceViewer/Instant';
import { EffectGenerator } from './EffectGenerator';
import { Grids } from './Grids';
import { Units } from './Units';
import * as ModelType from '../../../han/types';
import { Unit } from './Unit';
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

        // test effect
        // tween(this.node).delay(2).call(()=>{
        //     this.effects.build([[0, Grids.getGridPos(2,3)]]);
        // }).start();
    }

    setCursor(cursor:any){
        const cursorPos = Grids.getGridPos(cursor[0], cursor[1]);
        this.cursor.node.setPosition(cursorPos);
    }

    playBattleAnimation(result:any, cb:()=>void){
        console.log(result);
        const anims = result.Animations;

        console.log(anims);
        
        let actions = [
            tween().call(()=>{
                console.log("play aim animation");
            }).delay(1)
        ];
        
        anims.forEach(anim => {
            // console.log(anim);

            const type = anim.Type;
            const robotBefore = anim.RobotBefore;
            const robotAfter = anim.RobotAfter;

            switch(type){
                case ModelType.BattleResultType.BattleResultTypePending:
                    actions.push(tween().call(()=>{
                        console.log("BattleResultTypePending");
                        console.log(robotAfter);
                    }).delay(1));
                    break;
                case ModelType.BattleResultType.BattleResultTypeWeapon:
                    actions.push(tween().call(()=>{
                        console.log("BattleResultTypeWeapon");

                        const unitView = this.units.getUnitByID(robotAfter.ID);
                        unitView.getComponent(Unit)?.showHPEN(robotBefore.HP, robotBefore.MaxHP, robotBefore.EN, robotBefore.MaxEN);
                        unitView.getComponent(Unit)?.tweenHPEN(robotAfter.HP, robotAfter.MaxHP, robotAfter.EN, robotAfter.MaxEN);

                    }).delay(1));
                    break;
                case ModelType.BattleResultType.BattleResultTypeDamage:
                    actions.push(tween().call(()=>{
                        console.log("BattleResultTypeDamage");

                        const unitView = this.units.getUnitByID(robotAfter.ID);
                        unitView.getComponent(Animation)?.play("shake");

                        const pos = unitView.getComponent(Unit)?.node.position;
                        this.effects.build([[0, pos]]);
                    }).delay(1));
                    break;
                case ModelType.BattleResultType.BattleResultTypeEvade:
                    actions.push(tween().call(()=>{
                        console.log("BattleResultTypeEvade");

                        const unitView = this.units.getUnitByID(robotAfter.ID);
                        unitView.getComponent(Animation)?.play("evade");
                    }).delay(1));
                    break;
                case ModelType.BattleResultType.BattleResultTypeGuard:
                    actions.push(tween().call(()=>{
                        console.log(robotAfter);
                        console.log("BattleResultTypeGuard");
                    }).delay(2));
                    break;
            }
        });

        const t = tween(this.node);
        t.sequence.apply(t, actions).call(cb).start();
    }
}
