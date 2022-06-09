// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, Node, Vec3, Animation } from 'cc';
import AnimationEndCallback from '../lib/AnimationEndCallback';
import { Instant } from '../lib/instanceViewer/Instant';
const { ccclass, property } = _decorator;

@ccclass('EffectGenerator')
export class EffectGenerator extends Instant {
    
    @property(Node)
    effects:Node[] = [];

    createEffect(effectType:number, pos:Vec3, cb?:()=>void):Node{

        const effect:Node = this.pool.aquire(this.effects[effectType], this.node);
        effect.setPosition(pos);

        // 不需要指定播放的animation且確定會重新播放的呼叫方式
        effect.active = false;
        effect.active = true;
        effect.getComponent(Animation)?.play();

        // 確保只有一次的監聽
        effect.off(AnimationEndCallback.ON_ANIMATION_END);
        effect.on(AnimationEndCallback.ON_ANIMATION_END, ()=>{
            effect.off(AnimationEndCallback.ON_ANIMATION_END);            
            this.pool.release(this.effects[effectType], effect);
            if(cb) cb();
        });
        return effect;
    }
}
