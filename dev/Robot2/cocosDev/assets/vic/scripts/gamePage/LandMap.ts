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
import { ShotEffectGenerator } from './ShotEffectGenerator';
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

    @property(ShotEffectGenerator)
    shotEffects:ShotEffectGenerator = null;

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

                    // 瞄準動畫
                    actions.push(tween().call(()=>{
                        this.aimNode.node.setScale(Vec3.ONE);
                        const from = anim.AimPosition[0];
                        const to = anim.AimPosition[1];
                        this.aimNode.node.setPosition(Grids.getGridPos(from[0], from[1])); 
                        tween(this.aimNode.node).to(1, {position:Grids.getGridPos(to[0], to[1])}, {easing:"expoOut"}).start();
                    }).delay(.5));
                    break;
                case ModelType.BattleResultType.BattleResultTypeWeapon:

                    // 使用武器時的扣血扣en動畫
                    actions.push(tween().call(()=>{
                        const unitView = this.units.getUnitByID(robotAfter.ID);
                        unitView.getComponent(Unit)?.showHPEN(robotBefore.HP, robotBefore.MaxHP, robotBefore.EN, robotBefore.MaxEN);
                        unitView.getComponent(Unit)?.tweenHPEN(robotAfter.HP, robotAfter.MaxHP, robotAfter.EN, robotAfter.MaxEN);
                    }).delay(1));
                    break;
                case ModelType.BattleResultType.BattleResultTypeDamage:

                    // 爆炸動畫
                    actions.push(tween().call(()=>{
                        this.aimNode.node.setScale(Vec3.ZERO);

                        const unitView = this.units.getUnitByID(robotAfter.ID);
                        unitView.getComponent(Animation)?.play("shake");

                        const pos = unitView.getComponent(Unit)?.node.position;
                        if(pos){
                            const explode = this.effects.createEffect(0, pos);
                            explode.getComponent(Explode)?.setDamage(anim.Damage);
                        }
                    }).delay(.5));

                    // 被攻擊時的扣血扣en動畫
                    actions.push(tween().call(()=>{

                        const unitView = this.units.getUnitByID(robotAfter.ID);
                        unitView.getComponent(Unit)?.showHPEN(robotBefore.HP, robotBefore.MaxHP, robotBefore.EN, robotBefore.MaxEN);
                        unitView.getComponent(Unit)?.tweenHPEN(robotAfter.HP, robotAfter.MaxHP, robotAfter.EN, robotAfter.MaxEN);
                    }).delay(1));
                    break;
                case ModelType.BattleResultType.BattleResultTypeDie:

                    // 爆炸動畫
                    actions.push(tween().call(()=>{
                        this.aimNode.node.setScale(Vec3.ZERO);

                        const unitView = this.units.getUnitByID(robotAfter.ID);

                        // 爆炸動畫
                        const pos = unitView.getComponent(Unit)?.node.position;
                        if(pos){
                            const explode = this.effects.createEffect(0, pos);
                            explode.getComponent(Explode)?.setDamage(-1);

                            // unit 消失
                            unitView.setPosition(this.outOfWorld);
                        }
                    }).delay(.5));
                    break;
                case ModelType.BattleResultType.BattleResultTypeEvade:

                    // 顯示回避標示
                    actions.push(tween().call(()=>{
                        const unitView = this.units.getUnitByID(robotAfter.ID);
                        unitView.getComponent(Unit)?.showAction("回避");
                    }).delay(.5));

                    // 回避動畫
                    actions.push(tween().call(()=>{
                        this.aimNode.node.setScale(Vec3.ZERO);
                        const unitView = this.units.getUnitByID(robotAfter.ID);
                        unitView.getComponent(Animation)?.play("evade");
                        unitView.getComponent(Unit)?.hideAction();
                    }).delay(1));
                    break;
                case ModelType.BattleResultType.BattleResultTypeGuard:

                    // 顯示防禦標示
                    actions.push(tween().call(()=>{
                        const unitView = this.units.getUnitByID(robotAfter.ID);
                        unitView.getComponent(Unit)?.showAction("防禦");
                    }).delay(.5));

                    // 防禦動畫
                    actions.push(tween().call(()=>{
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

        if(actions.length > 0){
            const t = tween(this.node);

            if(actions.length > 1){

                // 爲了達成可以用陣列的形式，改用apply
                t.sequence.apply(t, actions).call(cb).start();
            }else{

                // 不知道爲什麽只有一個動作序列的時候，就不能用sequence的方法，改用then才可以
                t.then(actions[0]).delay(.5).call(cb).start();
            }
        }

    }
}
