// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import Pool from "../Pool";
import ViewController from "../ViewController";
import AnimationEndCallback from "../AnimationEndCallback";
const {ccclass, property, requireComponent} = cc._decorator;

@ccclass
@requireComponent(Pool)
export default class EffectLayer extends cc.Component {

    private _pool:Pool = null;

    onLoad(){
        this._pool = this.node.getComponent(Pool);
    }

    createEffect(pos:number[], transformToGrid:boolean = true):cc.Node{
        let effect:cc.Node = this._pool.acquire();
        let gridPos = transformToGrid ? ViewController.instance.view.getGridPos(pos) : pos;
        effect.x = gridPos[0];
        effect.y = gridPos[1];
        effect.setParent(this.node);

        // 不需要指定播放的animation且確定會重新播放的呼叫方式
        effect.active = false;
        effect.active = true;
        effect.getComponent(cc.Animation).play();

        // 確保只有一次的監聽
        effect.off(AnimationEndCallback.ON_ANIMATION_END);
        effect.on(AnimationEndCallback.ON_ANIMATION_END, ()=>{
            effect.off(AnimationEndCallback.ON_ANIMATION_END);
            effect.removeFromParent();
            this._pool.release(effect);
        });
        return effect;
    }
}
