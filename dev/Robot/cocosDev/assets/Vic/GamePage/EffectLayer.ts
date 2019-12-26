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
import Controller from "../Controller";
import AnimationEndCallback from "../AnimationEndCallback";
const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    private _pool:Pool = null;

    onLoad(){
        this._pool = this.node.getComponent(Pool);
    }

    createEffect(pos:number[]){
        let effect:cc.Node = this._pool.acquire();
        let gridPos = Controller.instance.view.getGridPos(pos);
        effect.x = gridPos[0];
        effect.y = gridPos[1];
        effect.active = false;
        effect.active = true;
        effect.getComponent(cc.Animation).play();
        effect.setParent(this.node);
        effect.on(AnimationEndCallback.ON_ANIMATION_END, ()=>{
            cc.log("on blade end");
            effect.removeFromParent();
            this._pool.release(effect);
        });
    }
}
