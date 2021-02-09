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
import { Drawer } from '../Drawer';
import { Explode } from './Explode';
const { ccclass, property } = _decorator;

@ccclass('LandMap')
export class LandMap extends Instant {
    
    @property(Grids)
    grids:Grids = null;

    @property(Units)
    units:Units = null;

    @property(Sprite)
    cursor:Sprite = null;

    @property(Sprite)
    aimNode:Sprite = null;

    @property(EffectGenerator)
    effects:EffectGenerator = null;

    clear(){
        super.clear();
        this.grids.clear();
        this.units.clear();

        this.aimNode.node.setScale(Vec3.ZERO);
    }

    doBuild(content:any, data:any):void{
        this.grids.build(content);
        this.units.build(content);
        this.setCursor(content.Cursor);
    }

    setCursor(cursor:any){
        const cursorPos = Grids.getGridPos(cursor[0], cursor[1]);
        this.cursor.node.setScale(Vec3.ONE);
        this.cursor.node.setPosition(cursorPos);
    }

    playBattleAnimation(result:any, cb:()=>void){
        const anims = result.Animations;

        this.cursor.node.setScale(Vec3.ZERO);
        
        let actions = [];
        anims.forEach(anim => {
            const type = anim.Type;
            const robotBefore = anim.RobotBefore;
            const robotAfter = anim.RobotAfter;

            switch(type){
                case ModelType.BattleResultType.BattleResultTypePending:
                    // 不用處理
                    break;
                case ModelType.BattleResultType.BattleResultTypeAim:

                    actions.push(tween().call(()=>{
                        this.aimNode.node.setScale(Vec3.ONE);
                        const from = anim.AimPosition[0];
                        const to = anim.AimPosition[1];
                        this.aimNode.node.setPosition(Grids.getGridPos(from[0], from[1])); 
                        tween(this.aimNode.node).to(1, {position:Grids.getGridPos(to[0], to[1])}, {easing:"expoOut"}).start();
                    }).delay(.5));
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

                        this.aimNode.node.setScale(Vec3.ZERO);

                        const unitView = this.units.getUnitByID(robotAfter.ID);
                        unitView.getComponent(Animation)?.play("shake");

                        const pos = unitView.getComponent(Unit)?.node.position;
                        if(pos){
                            const explode = this.effects.createEffect(0, pos);
                            explode.getComponent(Explode)?.setDamage(anim.Damage);
                        }
                    }).delay(1));
                    break;
                case ModelType.BattleResultType.BattleResultTypeEvade:
                    actions.push(tween().call(()=>{
                        this.aimNode.node.setScale(Vec3.ZERO);

                        console.log("BattleResultTypeEvade");

                        const unitView = this.units.getUnitByID(robotAfter.ID);
                        unitView.getComponent(Animation)?.play("evade");
                    }).delay(1));
                    break;
                case ModelType.BattleResultType.BattleResultTypeGuard:

                    actions.push(tween().call(()=>{
                        const unitView = this.units.getUnitByID(robotAfter.ID);
                        unitView.getComponent(Unit)?.showAction("防禦");
                    }).delay(.5));

                    actions.push(tween().call(()=>{
                        console.log("BattleResultTypeGuard");

                        this.aimNode.node.setScale(Vec3.ZERO);

                        const unitView = this.units.getUnitByID(robotAfter.ID);
                        unitView.getComponent(Animation)?.play("shake");
                        unitView.getComponent(Unit)?.hideAction();

                        const pos = unitView.getComponent(Unit)?.node.position;
                        if(pos){
                            const explode = this.effects.createEffect(0, pos);
                            explode.getComponent(Explode)?.setDamage(anim.Damage);
                        }
                    }).delay(1));
                    break;
            }
        });

        const t = tween(this.node);
        t.sequence.apply(t, actions).call(cb).start();
    }
}
