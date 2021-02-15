// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, Node, Vec3, tween } from 'cc';
import { Instant } from '../lib/instanceViewer/Instant';
const { ccclass, property } = _decorator;

@ccclass('ShotEffectGenerator')
export class ShotEffectGenerator extends Instant {
    
    @property(Node)
    effects:Node[] = [];

    create(type:number, from:Vec3, to:Vec3, cb:()=>void){
        const effect:Node = this.pool.aquire(this.effects[type], this.node);
        effect.setPosition(from);

        let diff = to.subtract(from);
        diff.normalize();
        const radian = Math.atan2(diff.y, diff.x);
        effect.setRotationFromEuler(0, 0, radian);

        tween(effect).to(.5, {position:to}).call(()=>{
            this.pool.release(this.effects[type], effect);
            if(cb) cb();
        }).start();
    }
}
